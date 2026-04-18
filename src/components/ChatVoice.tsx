"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ChatVoiceProps {
  dict: Dictionary;
  lang: Locale;
}

/* ──────────────────────────────────────────────
   Web Speech API types (minimal, SSR-safe)
   ────────────────────────────────────────────── */
interface SpeechRecognitionResult {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResult;
  };
}
interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

function localeForBrowser(lang: Locale): string {
  if (lang === "en") return "en-US";
  if (lang === "pt-BR") return "pt-BR";
  return "fr-FR";
}

/* ──────────────────────────────────────────────
   Main component
   ────────────────────────────────────────────── */
export default function ChatVoice({ dict, lang }: ChatVoiceProps) {
  const t = dict.chatVoice;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [leadStage, setLeadStage] = useState<
    "chat" | "lead" | "sending" | "done" | "error"
  >("chat");
  const [leadFirstName, setLeadFirstName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  /* ── Scroll to bottom when messages grow ── */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, leadStage]);

  /* ── Stop recognition + stream on close ── */
  useEffect(() => {
    if (!open) {
      try {
        recognitionRef.current?.abort();
      } catch {}
      abortRef.current?.abort();
    }
  }, [open]);

  /* ── Stream a reply from /api/chat ── */
  const streamReply = useCallback(
    async (history: ChatMessage[]) => {
      setIsStreaming(true);

      // Insert empty assistant message we'll grow
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const ac = new AbortController();
      abortRef.current = ac;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, lang }),
          signal: ac.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Parse SSE frames split by blank line
          const frames = buffer.split("\n\n");
          buffer = frames.pop() || "";

          for (const frame of frames) {
            const line = frame.trim();
            if (!line.startsWith("data:")) continue;
            const json = line.slice(5).trim();
            if (!json) continue;
            try {
              const evt = JSON.parse(json) as
                | { type: "delta"; text: string }
                | { type: "done" }
                | { type: "error"; message: string };
              if (evt.type === "delta") {
                setMessages((prev) => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last && last.role === "assistant") {
                    copy[copy.length - 1] = {
                      ...last,
                      content: last.content + evt.text,
                    };
                  }
                  return copy;
                });
              } else if (evt.type === "error") {
                setMessages((prev) => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last && last.role === "assistant" && last.content === "") {
                    copy[copy.length - 1] = {
                      ...last,
                      content: evt.message,
                    };
                  }
                  return copy;
                });
              }
            } catch {
              // ignore malformed frame
            }
          }
        }
      } catch (err) {
        // If aborted on close, silently stop
        const isAbort = err instanceof Error && err.name === "AbortError";
        if (!isAbort) {
          setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last && last.role === "assistant" && last.content === "") {
              copy[copy.length - 1] = {
                ...last,
                content: "…",
              };
            }
            return copy;
          });
        }
      } finally {
        setIsStreaming(false);
        // After 4+ user turns, nudge to lead capture
        setMessages((curr) => {
          const userTurns = curr.filter((m) => m.role === "user").length;
          if (userTurns >= 4 && leadStage === "chat") {
            setLeadStage("lead");
          }
          return curr;
        });
      }
    },
    [lang, leadStage],
  );

  /* ── Send a user message (from text or voice) ── */
  const sendMessage = useCallback(
    async (text: string, prefill?: boolean) => {
      const content = text.trim();
      if (!content || isStreaming) return;

      const userMsg: ChatMessage = { role: "user", content };

      setMessages((prev) => {
        const next = [...prev, userMsg];
        // fire-and-forget streaming with updated history
        void streamReply(next);
        return next;
      });

      if (!prefill) {
        setDraft("");
      } else {
        setDraft("");
      }
    },
    [isStreaming, streamReply],
  );

  /* ── Open modal, seed with greeting ── */
  const openWith = useCallback(
    (initial?: string) => {
      setOpen(true);
      setVoiceError(null);
      setLeadStage("chat");
      if (messages.length === 0) {
        setMessages([{ role: "assistant", content: t.greeting }]);
      }
      if (initial && initial.trim()) {
        // Give the modal a frame to mount, then push the initial message
        setTimeout(() => {
          void sendMessage(initial, true);
        }, 120);
      }
    },
    [messages.length, sendMessage, t.greeting],
  );

  /* ── Voice recognition ── */
  const startListening = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setVoiceError(t.voiceUnsupported);
      // Even without voice, open the modal so user can type
      openWith();
      return;
    }

    openWith();

    try {
      const rec = new Ctor();
      rec.lang = localeForBrowser(lang);
      rec.interimResults = true;
      rec.continuous = false;

      let finalText = "";

      rec.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) {
            finalText += r[0].transcript;
          } else {
            interim += r[0].transcript;
          }
        }
        setDraft((finalText + interim).trim());
      };

      rec.onerror = (evt) => {
        setIsListening(false);
        if (evt.error === "not-allowed" || evt.error === "service-not-allowed") {
          setVoiceError(t.voiceDenied);
        }
      };

      rec.onend = () => {
        setIsListening(false);
        const text = finalText.trim();
        if (text) {
          void sendMessage(text);
        }
      };

      recognitionRef.current = rec;
      rec.start();
      setIsListening(true);
    } catch {
      setVoiceError(t.voiceUnsupported);
      setIsListening(false);
    }
  }, [lang, openWith, sendMessage, t.voiceDenied, t.voiceUnsupported]);

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {}
    setIsListening(false);
  }, []);

  /* ── Lead submit ── */
  const submitLead = useCallback(async () => {
    if (!leadEmail || !leadEmail.includes("@")) return;
    setLeadStage("sending");

    const utm: Record<string, string> = {};
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(
        (k) => {
          const v = params.get(k);
          if (v) utm[k] = v;
        },
      );
    }

    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: leadFirstName,
          email: leadEmail,
          phone: leadPhone,
          lang,
          transcript: messages,
          referrer: typeof document !== "undefined" ? document.referrer : "",
          url: typeof window !== "undefined" ? window.location.href : "",
          utm,
        }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      setLeadStage("done");
    } catch {
      setLeadStage("error");
    }
  }, [lang, leadEmail, leadFirstName, leadPhone, messages]);

  /* ──────────────────────────────────────────────
     Render
     ────────────────────────────────────────────── */
  return (
    <>
      {/* Inline section on the page */}
      <section className="chatvoice-section" id="chat-voice">
        <div className="chatvoice-inner">
          <motion.h2
            className="chatvoice-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {t.title}
          </motion.h2>
          <motion.p
            className="chatvoice-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t.subtitle}
          </motion.p>

          <motion.button
            type="button"
            className="chatvoice-pill"
            onClick={startListening}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={t.micLabel}
          >
            <span className="chatvoice-pill-mic" aria-hidden>
              <MicIcon />
            </span>
            <span className="chatvoice-pill-label">{t.micLabel}</span>
          </motion.button>
          <p className="chatvoice-hint">{t.micHint}</p>

          <div className="chatvoice-chips">
            <span className="chatvoice-chips-label">{t.examplesLabel}</span>
            <div className="chatvoice-chips-row">
              {t.chips.map((chip, i) => (
                <motion.button
                  key={chip}
                  type="button"
                  className="chatvoice-chip"
                  onClick={() => openWith(chip)}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                  whileHover={{ y: -2 }}
                >
                  {chip}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal / drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="chatvoice-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="chatvoice-modal"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="chatvoice-modal-title"
            >
              <div className="chatvoice-header">
                <div>
                  <p className="chatvoice-modal-title" id="chatvoice-modal-title">
                    {t.modalTitle}
                  </p>
                  <p className="chatvoice-modal-subtitle">{t.modalSubtitle}</p>
                </div>
                <button
                  type="button"
                  className="chatvoice-close"
                  onClick={() => setOpen(false)}
                  aria-label={t.close}
                >
                  ×
                </button>
              </div>

              <div className="chatvoice-messages" ref={scrollRef}>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`chatvoice-msg chatvoice-msg-${m.role}`}
                  >
                    <div className="chatvoice-msg-bubble">
                      {m.content ||
                        (isStreaming && i === messages.length - 1 ? "…" : "")}
                    </div>
                  </div>
                ))}

                {leadStage === "lead" && (
                  <div className="chatvoice-lead-block">
                    <p className="chatvoice-lead-intro">{t.leadIntro}</p>
                    <input
                      type="text"
                      className="chatvoice-lead-input"
                      placeholder={t.leadFirstName}
                      value={leadFirstName}
                      onChange={(e) => setLeadFirstName(e.target.value)}
                      autoComplete="given-name"
                    />
                    <input
                      type="email"
                      className="chatvoice-lead-input"
                      placeholder={t.leadEmail}
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      autoComplete="email"
                    />
                    <input
                      type="tel"
                      className="chatvoice-lead-input"
                      placeholder={t.leadPhone}
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      autoComplete="tel"
                    />
                    <button
                      type="button"
                      className="chatvoice-lead-submit"
                      onClick={submitLead}
                      disabled={!leadEmail.includes("@")}
                    >
                      {t.leadSubmit}
                    </button>
                  </div>
                )}

                {leadStage === "sending" && (
                  <p className="chatvoice-lead-status">{t.leadSubmitting}</p>
                )}
                {leadStage === "done" && (
                  <p className="chatvoice-lead-status chatvoice-lead-status-ok">
                    ✓ {t.leadThanks}
                  </p>
                )}
                {leadStage === "error" && (
                  <p className="chatvoice-lead-status chatvoice-lead-status-error">
                    {t.leadError}
                  </p>
                )}
              </div>

              {leadStage === "chat" && (
                <div className="chatvoice-composer">
                  {voiceError && (
                    <p className="chatvoice-voice-error">{voiceError}</p>
                  )}
                  <div className="chatvoice-composer-row">
                    <button
                      type="button"
                      className={`chatvoice-mic-btn ${
                        isListening ? "is-listening" : ""
                      }`}
                      onClick={isListening ? stopListening : startListening}
                      aria-label={isListening ? t.listening : t.micLabel}
                    >
                      <MicIcon />
                      {isListening && <span className="chatvoice-pulse" />}
                    </button>
                    <input
                      type="text"
                      className="chatvoice-input"
                      placeholder={isListening ? t.listening : t.inputPlaceholder}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void sendMessage(draft);
                        }
                      }}
                      disabled={isStreaming}
                    />
                    <button
                      type="button"
                      className="chatvoice-send"
                      onClick={() => void sendMessage(draft)}
                      disabled={!draft.trim() || isStreaming}
                      aria-label={t.send}
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scoped styles — mirrors the site's tokens */}
      <style jsx>{`
        .chatvoice-section {
          background: var(--bg);
          padding: 56px 24px 80px;
        }
        .chatvoice-inner {
          max-width: 760px;
          margin: 0 auto;
          text-align: center;
        }
        .chatvoice-title {
          font-family: var(--font-heading);
          font-weight: 400;
          font-size: clamp(24px, 3.2vw, 32px);
          color: var(--text);
          margin: 0 0 12px;
          line-height: 1.2;
        }
        .chatvoice-subtitle {
          font-family: var(--font-body);
          font-size: 15px;
          color: var(--text-muted);
          font-weight: 300;
          line-height: 1.6;
          margin: 0 0 28px;
        }
        .chatvoice-pill {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 18px 30px;
          border-radius: 999px;
          border: 1px solid rgba(200, 149, 108, 0.35);
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.7) 0%,
            rgba(255, 247, 238, 0.6) 100%
          );
          color: var(--text);
          font-family: var(--font-body);
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(200, 149, 108, 0.15);
          transition: box-shadow 0.25s ease, transform 0.2s ease;
          max-width: 520px;
          width: 100%;
        }
        .chatvoice-pill:hover {
          box-shadow: 0 8px 32px rgba(200, 149, 108, 0.25);
        }
        .chatvoice-pill-mic {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c8956c 0%, #b8855c 100%);
          color: #fff;
          flex-shrink: 0;
        }
        .chatvoice-pill-label {
          flex: 1;
          text-align: left;
        }
        .chatvoice-hint {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--text-dim);
          margin: 12px 0 28px;
        }
        .chatvoice-chips-label {
          display: block;
          font-family: var(--font-body);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-dim);
          margin-bottom: 12px;
        }
        .chatvoice-chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }
        .chatvoice-chip {
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(42, 37, 32, 0.12);
          background: rgba(255, 255, 255, 0.5);
          color: var(--text);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 400;
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
        }
        .chatvoice-chip:hover {
          border-color: rgba(200, 149, 108, 0.5);
          background: rgba(255, 247, 238, 0.8);
        }
        /* ── Modal ── */
        .chatvoice-overlay {
          position: fixed;
          inset: 0;
          background: rgba(20, 17, 14, 0.55);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .chatvoice-modal {
          width: 100%;
          max-width: 560px;
          max-height: 80vh;
          background: #fffaf3;
          border-radius: 20px;
          box-shadow: 0 24px 80px rgba(20, 17, 14, 0.35);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(200, 149, 108, 0.2);
        }
        .chatvoice-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(42, 37, 32, 0.08);
          background: linear-gradient(
            135deg,
            rgba(200, 149, 108, 0.08) 0%,
            rgba(255, 250, 243, 0.6) 100%
          );
        }
        .chatvoice-modal-title {
          margin: 0;
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 500;
          color: var(--text);
        }
        .chatvoice-modal-subtitle {
          margin: 2px 0 0;
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--text-muted);
        }
        .chatvoice-close {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 0;
          background: rgba(42, 37, 32, 0.06);
          color: var(--text);
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
        }
        .chatvoice-close:hover {
          background: rgba(42, 37, 32, 0.12);
        }
        .chatvoice-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .chatvoice-msg {
          display: flex;
        }
        .chatvoice-msg-user {
          justify-content: flex-end;
        }
        .chatvoice-msg-assistant {
          justify-content: flex-start;
        }
        .chatvoice-msg-bubble {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 14px;
          font-family: var(--font-body);
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
        }
        .chatvoice-msg-user .chatvoice-msg-bubble {
          background: linear-gradient(135deg, #c8956c 0%, #b8855c 100%);
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        .chatvoice-msg-assistant .chatvoice-msg-bubble {
          background: rgba(42, 37, 32, 0.06);
          color: var(--text);
          border-bottom-left-radius: 4px;
        }
        .chatvoice-composer {
          padding: 12px 16px 16px;
          border-top: 1px solid rgba(42, 37, 32, 0.08);
          background: #fffaf3;
        }
        .chatvoice-voice-error {
          font-family: var(--font-body);
          font-size: 12px;
          color: #b94a3a;
          margin: 0 0 8px;
          text-align: center;
        }
        .chatvoice-composer-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .chatvoice-mic-btn {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(200, 149, 108, 0.35);
          background: rgba(255, 255, 255, 0.5);
          color: var(--text);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .chatvoice-mic-btn.is-listening {
          background: linear-gradient(135deg, #c8956c 0%, #b8855c 100%);
          color: #fff;
          border-color: transparent;
        }
        .chatvoice-pulse {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(200, 149, 108, 0.6);
          animation: chatvoice-pulse 1.4s infinite ease-out;
        }
        @keyframes chatvoice-pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        .chatvoice-input {
          flex: 1;
          height: 40px;
          border: 1px solid rgba(42, 37, 32, 0.12);
          border-radius: 999px;
          padding: 0 14px;
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--text);
          background: #fff;
          outline: none;
        }
        .chatvoice-input:focus {
          border-color: rgba(200, 149, 108, 0.6);
        }
        .chatvoice-send {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 0;
          background: linear-gradient(135deg, #c8956c 0%, #b8855c 100%);
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .chatvoice-send:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .chatvoice-lead-block {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 16px;
          background: rgba(200, 149, 108, 0.08);
          border-radius: 14px;
          border: 1px solid rgba(200, 149, 108, 0.2);
          margin-top: 4px;
        }
        .chatvoice-lead-intro {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--text);
          margin: 0 0 4px;
          font-weight: 500;
        }
        .chatvoice-lead-input {
          height: 38px;
          border: 1px solid rgba(42, 37, 32, 0.12);
          border-radius: 8px;
          padding: 0 12px;
          font-family: var(--font-body);
          font-size: 14px;
          background: #fff;
          outline: none;
        }
        .chatvoice-lead-input:focus {
          border-color: rgba(200, 149, 108, 0.6);
        }
        .chatvoice-lead-submit {
          height: 40px;
          border-radius: 8px;
          border: 0;
          background: linear-gradient(135deg, #c8956c 0%, #b8855c 100%);
          color: #fff;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 4px;
        }
        .chatvoice-lead-submit:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .chatvoice-lead-status {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--text-muted);
          text-align: center;
          padding: 14px 8px 4px;
          margin: 0;
        }
        .chatvoice-lead-status-ok {
          color: #4a8a5a;
          font-weight: 500;
        }
        .chatvoice-lead-status-error {
          color: #b94a3a;
        }
        @media (max-width: 640px) {
          .chatvoice-modal {
            max-height: 90vh;
            border-radius: 20px 20px 0 0;
            align-self: flex-end;
          }
          .chatvoice-overlay {
            align-items: flex-end;
            padding: 0;
          }
          .chatvoice-chip {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
}

function MicIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}
