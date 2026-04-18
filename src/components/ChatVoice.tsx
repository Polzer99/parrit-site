"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, ArrowUp, X } from "lucide-react";
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
   Groq Whisper transcription (MediaRecorder chunks)
   Pattern copié de parrit-os/call-copilot/useTranscription
   ────────────────────────────────────────────── */
const CHUNK_INTERVAL_MS = 5000;

function pickAudioMime(): string {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined") return "";
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) || "";
}

function extForMime(mime: string): string {
  if (mime.includes("mp4")) return "mp4";
  if (mime.includes("ogg")) return "ogg";
  return "webm";
}

function langForWhisper(lang: Locale): string {
  if (lang === "en") return "en";
  if (lang === "pt-BR") return "pt";
  return "fr";
}

function hasMediaRecorder(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.MediaRecorder !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    window.isSecureContext
  );
}

/* ──────────────────────────────────────────────
   Shared tokens
   ────────────────────────────────────────────── */
const ACCENT = "#c8956c";
const ACCENT_DARK = "#b8814c";
const CREAM_SOLID = "#f5f0e8";

const FORM_INPUT_STYLE: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 14,
  fontWeight: 400,
  color: "var(--text)",
  background: "#ffffff",
  border: "1px solid rgba(42,36,32,0.12)",
  borderRadius: 8,
  padding: "12px 14px",
  outline: "none",
  transition: "border-color 0.2s ease",
  width: "100%",
};

const FORM_LABEL_STYLE: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 12,
  fontWeight: 500,
  color: "var(--text-muted)",
  letterSpacing: "0.04em",
  marginBottom: 6,
  display: "block",
};

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
  const [isNarrow, setIsNarrow] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeTypeRef = useRef<string>("");
  const chunkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const speechSupported =
    typeof window !== "undefined" ? hasMediaRecorder() : true;

  /* ── Responsive breakpoint (for fullscreen mobile modal) ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* ── Scroll to bottom when messages grow ── */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, leadStage]);

  /* ── Auto-grow textarea ── */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, 4 * 22 + 20); // ~4 lines
    el.style.height = next + "px";
  }, [draft]);

  /* ── Stop recorder + stream on close ── */
  useEffect(() => {
    if (!open) {
      try {
        if (chunkTimerRef.current) clearTimeout(chunkTimerRef.current);
        const rec = recorderRef.current;
        recorderRef.current = null;
        if (rec && rec.state === "recording") {
          try { rec.stop(); } catch {}
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
      } catch {}
      abortRef.current?.abort();
    }
  }, [open]);

  /* ── Escape key closes modal ── */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
    async (text: string, _prefill?: boolean) => {
      const content = text.trim();
      if (!content || isStreaming) return;

      const userMsg: ChatMessage = { role: "user", content };

      setMessages((prev) => {
        const next = [...prev, userMsg];
        // fire-and-forget streaming with updated history
        void streamReply(next);
        return next;
      });

      setDraft("");
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

  /* ── Voice transcription (Groq Whisper via /api/transcribe) ── */

  const transcribeChunk = useCallback(
    async (audioBlob: Blob) => {
      if (audioBlob.size < 500) return;
      try {
        const ext = extForMime(mimeTypeRef.current);
        const formData = new FormData();
        formData.append("file", audioBlob, `recording.${ext}`);
        formData.append("language", langForWhisper(lang));

        const resp = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });
        if (!resp.ok) return;
        const data = (await resp.json()) as { text?: string };
        const text = (data.text || "").trim();
        if (text && text.length > 1) {
          setDraft((prev) => (prev ? `${prev} ${text}` : text).trim());
        }
      } catch {
        // silencieux — on ne casse pas l'UX pour un chunk raté
      }
    },
    [lang],
  );

  const scheduleChunkStop = useCallback(() => {
    if (chunkTimerRef.current) clearTimeout(chunkTimerRef.current);
    chunkTimerRef.current = setTimeout(() => {
      const rec = recorderRef.current;
      if (rec && rec.state === "recording") {
        try { rec.stop(); } catch {}
      }
    }, CHUNK_INTERVAL_MS);
  }, []);

  const startListening = useCallback(async () => {
    if (!hasMediaRecorder()) {
      setVoiceError(t.voiceUnsupported);
      openWith();
      return;
    }
    openWith();

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setVoiceError(t.voiceDenied);
      setIsListening(false);
      return;
    }
    streamRef.current = stream;

    const mime = pickAudioMime();
    mimeTypeRef.current = mime;

    const startRecorder = () => {
      const stillActive = streamRef.current?.active;
      if (!stillActive) return;
      const rec = new MediaRecorder(
        streamRef.current!,
        mime ? { mimeType: mime } : undefined,
      );
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, {
            type: mimeTypeRef.current || "audio/webm",
          });
          chunksRef.current = [];
          void transcribeChunk(blob);
        }
        // Relance un nouveau chunk si toujours en écoute
        if (recorderRef.current && streamRef.current?.active) {
          startRecorder();
        }
      };
      recorderRef.current = rec;
      rec.start();
      scheduleChunkStop();
    };

    setIsListening(true);
    setVoiceError(null);
    startRecorder();
  }, [openWith, scheduleChunkStop, t.voiceDenied, t.voiceUnsupported, transcribeChunk]);

  const stopListening = useCallback(() => {
    if (chunkTimerRef.current) {
      clearTimeout(chunkTimerRef.current);
      chunkTimerRef.current = null;
    }
    const rec = recorderRef.current;
    recorderRef.current = null; // empêche le onstop de relancer un cycle
    if (rec && rec.state === "recording") {
      try { rec.stop(); } catch {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
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
  const modalRadius = isNarrow ? 0 : 18;
  const modalMaxHeight = isNarrow ? "100vh" : "85vh";
  const modalWidth = isNarrow ? "100vw" : "100%";
  const overlayPadding = isNarrow ? 0 : 24;

  return (
    <>
      {/* Inline section on the page */}
      <section
        aria-label="Chat voice"
        id="chat-voice"
        style={{
          padding: "56px 24px 80px",
          background: "transparent",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(26px, 3.6vw, 36px)",
              fontWeight: 500,
              lineHeight: 1.2,
              color: "var(--text)",
              margin: "0 0 12px",
              letterSpacing: "-0.015em",
            }}
          >
            {t.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              color: "var(--text-muted)",
              fontWeight: 300,
              lineHeight: 1.6,
              margin: "0 0 40px",
              maxWidth: 560,
            }}
          >
            {t.subtitle}
          </motion.p>

          <motion.button
            type="button"
            onClick={startListening}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={t.micLabel}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              padding: "14px 32px",
              height: 60,
              borderRadius: 999,
              border: "none",
              background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`,
              color: "#ffffff",
              fontFamily: "var(--font-body)",
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: "0.01em",
              cursor: "pointer",
              boxShadow: "0 8px 28px rgba(200, 149, 108, 0.32)",
              transition: "box-shadow 0.25s ease",
              maxWidth: isNarrow ? "calc(100% - 32px)" : 520,
              width: isNarrow ? "calc(100% - 32px)" : "auto",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 36px rgba(200, 149, 108, 0.42)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(200, 149, 108, 0.32)";
            }}
          >
            <Mic size={20} strokeWidth={2} color="#ffffff" aria-hidden />
            <span>{t.micLabel}</span>
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--text-dim)",
              margin: "14px 0 0",
              fontWeight: 300,
            }}
          >
            {t.micHint}
          </motion.p>

          {/* Chips */}
          <div style={{ marginTop: 40, width: "100%" }}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                fontWeight: 500,
                margin: "0 0 14px",
              }}
            >
              {t.examplesLabel.replace(/:$/, "")}
            </motion.p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                justifyContent: "center",
              }}
            >
              {t.chips.map((chip, i) => (
                <motion.button
                  key={chip}
                  type="button"
                  onClick={() => openWith(chip)}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
                  whileHover={{ y: -2 }}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 999,
                    border: "1px solid rgba(42,36,32,0.15)",
                    background: "rgba(255,255,255,0.4)",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 400,
                    cursor: "pointer",
                    transition:
                      "border-color 0.2s ease, color 0.2s ease, background 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(200,149,108,0.55)";
                    e.currentTarget.style.color = ACCENT;
                    e.currentTarget.style.background = "rgba(255,250,243,0.75)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(42,36,32,0.15)";
                    e.currentTarget.style.color = "var(--text-muted)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.4)";
                  }}
                >
                  {chip}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(42,36,32,0.55)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              zIndex: 1000,
              display: "flex",
              alignItems: isNarrow ? "stretch" : "center",
              justifyContent: "center",
              padding: overlayPadding,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="chatvoice-modal-title"
              style={{
                width: modalWidth,
                maxWidth: isNarrow ? "100vw" : 560,
                height: isNarrow ? "100vh" : "auto",
                maxHeight: modalMaxHeight,
                background: CREAM_SOLID,
                borderRadius: modalRadius,
                border: isNarrow ? "none" : "1px solid rgba(42,36,32,0.08)",
                boxShadow: isNarrow
                  ? "none"
                  : "0 24px 80px rgba(42,36,32,0.25)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  minHeight: 64,
                  borderBottom: "1px solid rgba(42,36,32,0.06)",
                  flexShrink: 0,
                }}
              >
                <div>
                  <p
                    id="chatvoice-modal-title"
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading)",
                      fontSize: 20,
                      fontWeight: 500,
                      color: "var(--text)",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                    }}
                  >
                    {t.modalTitle}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 4,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: ACCENT,
                        boxShadow: `0 0 0 3px rgba(200,149,108,0.18)`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--text-muted)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {t.modalSubtitle}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t.close}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    border: 0,
                    background: "rgba(42,36,32,0.06)",
                    color: "var(--text)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(42,36,32,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(42,36,32,0.06)";
                  }}
                >
                  <X size={16} strokeWidth={2} aria-hidden />
                </button>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {messages.map((m, i) => {
                  const isUser = m.role === "user";
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{
                        display: "flex",
                        justifyContent: isUser ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "78%",
                          padding: "10px 14px",
                          borderRadius: 14,
                          borderBottomRightRadius: isUser ? 4 : 14,
                          borderBottomLeftRadius: isUser ? 14 : 4,
                          background: isUser
                            ? ACCENT
                            : "rgba(42,36,32,0.05)",
                          color: isUser ? "#ffffff" : "var(--text)",
                          fontFamily: "var(--font-body)",
                          fontSize: 14,
                          lineHeight: 1.55,
                          fontWeight: 300,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {m.content ||
                          (isStreaming && i === messages.length - 1 ? "…" : "")}
                      </div>
                    </motion.div>
                  );
                })}

                {leadStage === "lead" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{
                      marginTop: 6,
                      padding: 18,
                      background: "rgba(200,149,108,0.08)",
                      border: "1px solid rgba(200,149,108,0.22)",
                      borderRadius: 14,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--text)",
                        margin: 0,
                        fontWeight: 500,
                        lineHeight: 1.5,
                      }}
                    >
                      {t.leadIntro}
                    </p>

                    <div>
                      <label htmlFor="cv-first" style={FORM_LABEL_STYLE}>
                        {t.leadFirstName}
                      </label>
                      <input
                        id="cv-first"
                        type="text"
                        style={FORM_INPUT_STYLE}
                        value={leadFirstName}
                        onChange={(e) => setLeadFirstName(e.target.value)}
                        autoComplete="given-name"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(200,149,108,0.55)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(42,36,32,0.12)";
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor="cv-email" style={FORM_LABEL_STYLE}>
                        {t.leadEmail}
                      </label>
                      <input
                        id="cv-email"
                        type="email"
                        style={FORM_INPUT_STYLE}
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        autoComplete="email"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(200,149,108,0.55)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(42,36,32,0.12)";
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor="cv-phone" style={FORM_LABEL_STYLE}>
                        {t.leadPhone}
                      </label>
                      <input
                        id="cv-phone"
                        type="tel"
                        style={FORM_INPUT_STYLE}
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        autoComplete="tel"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(200,149,108,0.55)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(42,36,32,0.12)";
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={submitLead}
                      disabled={!leadEmail.includes("@")}
                      style={{
                        width: "100%",
                        height: 48,
                        borderRadius: 999,
                        border: 0,
                        background: leadEmail.includes("@")
                          ? `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`
                          : "rgba(200,149,108,0.45)",
                        color: "#ffffff",
                        fontFamily: "var(--font-body)",
                        fontSize: 15,
                        fontWeight: 500,
                        letterSpacing: "0.01em",
                        cursor: leadEmail.includes("@") ? "pointer" : "not-allowed",
                        transition: "transform 0.15s ease, box-shadow 0.2s ease",
                        boxShadow: leadEmail.includes("@")
                          ? "0 6px 20px rgba(200,149,108,0.3)"
                          : "none",
                        marginTop: 4,
                      }}
                    >
                      {t.leadSubmit}
                    </button>
                  </motion.div>
                )}

                {leadStage === "sending" && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--text-muted)",
                      textAlign: "center",
                      margin: "8px 0 0",
                    }}
                  >
                    {t.leadSubmitting}
                  </p>
                )}

                {leadStage === "done" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      marginTop: 6,
                      padding: 20,
                      background: "rgba(200,149,108,0.1)",
                      border: "1px solid rgba(200,149,108,0.28)",
                      borderRadius: 14,
                      textAlign: "center",
                    }}
                  >
                    <div
                      aria-hidden
                      style={{
                        width: 36,
                        height: 36,
                        margin: "0 auto 10px",
                        borderRadius: "50%",
                        background: ACCENT,
                        color: "#ffffff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        fontWeight: 500,
                      }}
                    >
                      ✓
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: 18,
                        fontWeight: 500,
                        color: "var(--text)",
                        margin: "0 0 4px",
                        lineHeight: 1.3,
                      }}
                    >
                      {t.leadThanks}
                    </p>
                  </motion.div>
                )}

                {leadStage === "error" && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "#b94a3a",
                      textAlign: "center",
                      margin: "8px 0 0",
                    }}
                  >
                    {t.leadError}
                  </p>
                )}
              </div>

              {/* Composer */}
              {leadStage === "chat" && (
                <div
                  style={{
                    padding: "14px 16px",
                    borderTop: "1px solid rgba(42,36,32,0.06)",
                    background: CREAM_SOLID,
                    flexShrink: 0,
                  }}
                >
                  {isListening && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <motion.span
                        aria-hidden
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{
                          duration: 1.3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#c24545",
                          boxShadow: "0 0 0 3px rgba(194,69,69,0.18)",
                          display: "inline-block",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 12,
                          color: "var(--text-muted)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {t.listening}
                      </span>
                    </div>
                  )}
                  {voiceError && (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "#b94a3a",
                        margin: "0 0 8px",
                        textAlign: "center",
                      }}
                    >
                      {voiceError}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 10,
                    }}
                  >
                    <motion.button
                      type="button"
                      onClick={
                        !speechSupported
                          ? undefined
                          : isListening
                            ? stopListening
                            : startListening
                      }
                      disabled={!speechSupported}
                      aria-label={isListening ? t.listening : t.micLabel}
                      title={!speechSupported ? t.voiceUnsupported : undefined}
                      whileTap={speechSupported ? { scale: 0.94 } : undefined}
                      animate={
                        isListening
                          ? { scale: [1, 1.08, 1] }
                          : { scale: 1 }
                      }
                      transition={
                        isListening
                          ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
                          : { duration: 0.2 }
                      }
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: 0,
                        background: isListening
                          ? `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`
                          : "rgba(200,149,108,0.16)",
                        color: isListening ? "#ffffff" : ACCENT,
                        cursor: speechSupported ? "pointer" : "not-allowed",
                        opacity: speechSupported ? 1 : 0.5,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "background 0.2s ease, color 0.2s ease",
                      }}
                    >
                      <Mic size={16} strokeWidth={2} aria-hidden />
                    </motion.button>

                    <textarea
                      ref={textareaRef}
                      rows={1}
                      placeholder={
                        isListening ? t.listening : t.inputPlaceholder
                      }
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void sendMessage(draft);
                        }
                      }}
                      disabled={isStreaming}
                      onFocus={(e) => {
                        e.currentTarget.style.border =
                          "1px solid rgba(200,149,108,0.35)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.border =
                          "1px solid rgba(42,36,32,0.1)";
                      }}
                      style={{
                        flex: 1,
                        resize: "none",
                        minHeight: 36,
                        maxHeight: 110,
                        padding: "9px 14px",
                        border: "1px solid rgba(42,36,32,0.1)",
                        borderRadius: 18,
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        lineHeight: 1.45,
                        color: "var(--text)",
                        background: "rgba(255,255,255,0.7)",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                        fontWeight: 400,
                      }}
                    />

                    <motion.button
                      type="button"
                      onClick={() => void sendMessage(draft)}
                      disabled={!draft.trim() || isStreaming}
                      aria-label={t.send}
                      whileTap={
                        draft.trim() && !isStreaming ? { scale: 0.94 } : undefined
                      }
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: 0,
                        background:
                          draft.trim() && !isStreaming
                            ? `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`
                            : "rgba(200,149,108,0.3)",
                        color: "#ffffff",
                        cursor:
                          draft.trim() && !isStreaming ? "pointer" : "not-allowed",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "background 0.2s ease",
                        boxShadow:
                          draft.trim() && !isStreaming
                            ? "0 4px 14px rgba(200,149,108,0.3)"
                            : "none",
                      }}
                    >
                      <ArrowUp size={16} strokeWidth={2.5} aria-hidden />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
