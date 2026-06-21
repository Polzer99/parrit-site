"use client";

import { useEffect, useRef, useState } from "react";
import { SEGMENTS, detectSegment, type SegmentId } from "@/lib/diagnostic/personas";
import { getAttribution } from "@/lib/attribution";

const WEBHOOK_URL = "https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead";

type Msg = { role: "user" | "assistant"; content: string };
type Front = { label: string; nodes: string[] };
type Diag = { framing: string; front1: Front; front2: Front; pills: string[]; offer: string; cta: string };

function looksLikeEmail(v: string) {
  return /\S+@\S+\.\S+/.test(v.trim());
}
function opener(voix: string): string {
  if (voix === "executive") return "Où l'adoption de l'IA cale-t-elle dans votre organisation ?";
  if (voix === "coup-de-poing") return "Qu'est-ce qui vous prend le plus de temps cette semaine ?";
  return "Quelle tâche pèse le plus sur vos équipes en ce moment ?";
}

export default function DiagnosticClient() {
  const [seg, setSeg] = useState<SegmentId>("neutre");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [diag, setDiag] = useState<Diag | null>(null);
  const [persona, setPersona] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [leadSent, setLeadSent] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  const pack = SEGMENTS[seg] || SEGMENTS.neutre;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = detectSegment(params, typeof document !== "undefined" ? document.referrer : "");
    setSeg(s);
    setMessages([{ role: "assistant", content: opener((SEGMENTS[s] || SEGMENTS.neutre).voix) }]);
  }, []);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || status === "sending") return;
    setError("");
    const next: Msg[] = [...messages, { role: "user", content: t }];
    setMessages(next);
    setInput("");
    setStatus("sending");
    try {
      const r = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, segment: seg }),
      });
      const d = await r.json();
      if (!r.ok || d.error) throw new Error(d.error || "Erreur");
      setMessages([...next, { role: "assistant", content: d.reply || "" }]);
      setPersona(d.persona || "");
      if (d.done && d.diagnostic) {
        setDiag(d.diagnostic as Diag);
        setStatus("done");
      } else {
        setStatus("idle");
      }
    } catch (e) {
      setError("⚠️ " + (e as Error).message);
      setStatus("idle");
    }
  }

  async function sendLead() {
    if (!looksLikeEmail(email) || leadSent) return;
    setLeadSent(true);
    const utms = getAttribution();
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "parrit.ai",
          action: "diagnostic_lead",
          page: "diagnostic",
          email: email.trim(),
          contact_raw: email.trim(),
          segment: seg,
          persona,
          besoin: diag ? `${diag.framing} ${diag.front1?.label} / ${diag.front2?.label}` : "",
          transcript: messages,
          referrer: typeof document !== "undefined" ? document.referrer : "",
          url: typeof window !== "undefined" ? window.location.href : "",
          timestamp: new Date().toISOString(),
          ...utms,
        }),
      });
    } catch {
      // non bloquant
    }
  }

  const started = messages.some((m) => m.role === "user");

  return (
    <main className="dg-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="dg-win">
        <div className="dg-chrome">
          <div className="dg-lights"><span className="r" /><span className="y" /><span className="g" /></div>
          <div className="dg-title">parrit.sh — diagnostic</div>
        </div>

        <div className="dg-grid">
          {/* THREAD */}
          <div className="dg-thread">
            <div className="dg-agent"><span className="dg-seal">速</span><span className="dg-id"><b>parrit</b> › operating partner</span></div>
            <div className="dg-flow" ref={threadRef}>
              {messages.map((m, i) => (
                <div className={`dg-turn ${m.role === "user" ? "u" : "p"}`} key={i}>
                  <div className="dg-pre">{m.role === "user" ? "vous" : "parrit ›"}</div>
                  <div className="dg-txt">{m.content}</div>
                </div>
              ))}
              {status === "sending" && (
                <div className="dg-work">› lecture du cas<br />› cadrage des deux fronts <span className="dg-cur" /></div>
              )}
              {error && <div className="dg-err">{error}</div>}
            </div>

            {!started && (
              <div className="dg-chips">
                {pack.chips.map((c) => (
                  <button key={c} className="dg-chip" onClick={() => send(c)}>{c}</button>
                ))}
              </div>
            )}

            <form
              className="dg-composer"
              onSubmit={(e) => { e.preventDefault(); send(input); }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Décrivez une tâche qui pèse…"
                aria-label="Votre message"
                disabled={status === "sending"}
              />
              <button className="dg-send" type="submit" disabled={status === "sending"} aria-label="Envoyer">↑</button>
            </form>
          </div>

          {/* CANVAS */}
          <div className="dg-canvas">
            <div className="dg-ctop">
              <span className="dg-ctag">Diagnostic · {pack.label}</span>
              {diag && <span className="dg-clive"><span className="d" />construit en direct</span>}
            </div>

            {!diag ? (
              <div className="dg-empty">
                <div className="dg-stamp">速</div>
                <p>{status === "sending" ? "Parrit analyse votre cas…" : "Votre diagnostic se construit ici, au fil de la conversation."}</p>
              </div>
            ) : (
              <>
                <div className="dg-ctitle">{diag.framing}</div>
                <div className="dg-fronts">
                  {[diag.front1, diag.front2].map((f, i) => (
                    <div className="dg-fcard" key={i}>
                      <div className="dg-fhead"><span className="dg-fn">{i === 0 ? "Front 1" : "Front 2"}</span><b>{f?.label}</b></div>
                      <div className="dg-nodes">
                        {(f?.nodes || []).map((n, j) => (
                          <span key={j} style={{ display: "contents" }}>
                            <div className={`dg-node ${/agent/i.test(n) ? "ag" : ""}`}>{n}</div>
                            {j < (f?.nodes || []).length - 1 && <span className="dg-arr">→</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {diag.pills?.length > 0 && (
                  <div className="dg-pills">{diag.pills.map((p) => <span className="dg-pill" key={p}>{p}</span>)}</div>
                )}
                {diag.offer && <div className="dg-offer">{diag.offer}</div>}

                <div className="dg-gate">
                  {leadSent ? (
                    <div className="dg-thanks">C'est noté. Paul vous envoie votre page sur-mesure et revient vers vous.</div>
                  ) : (
                    <>
                      <div className="dg-gh">{diag.cta}</div>
                      <form className="dg-grow" onSubmit={(e) => { e.preventDefault(); sendLead(); }}>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.pro" inputMode="email" aria-label="Email professionnel" />
                        <button className="dg-go" type="submit">Me l'envoyer →</button>
                      </form>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="dg-statusbar">
          <span>Un diagnostic sur-mesure, adapté à votre métier. La construction, on la cadre ensemble.</span>
          <span>l'autorité se démontre, jamais ne se décrète</span>
        </div>
      </div>
    </main>
  );
}

const CSS = `
.dg-root{
  --creme:#FEFDF9; --encre:#0C0C0D; --rouge:#D1132F; --rouge-soft:rgba(209,19,47,.07);
  --muted:#6c6c70; --border:rgba(12,12,13,.14);
  --serif:var(--dg-serif),Georgia,serif; --body:var(--dg-body),system-ui,sans-serif; --mono:var(--dg-mono),monospace;
  display:block; max-width:1080px; margin:0 auto; padding:22px 18px 48px; font-family:var(--body); color:var(--encre);
}
.dg-win{background:#fff; border:2px solid var(--encre); border-radius:11px; box-shadow:8px 8px 0 var(--encre); overflow:hidden}
.dg-chrome{display:flex; align-items:center; gap:10px; padding:11px 14px; border-bottom:2px solid var(--encre); background:var(--creme); position:relative}
.dg-lights{display:flex;gap:7px}
.dg-lights span{width:12px;height:12px;border-radius:50%;border:1.5px solid var(--encre);display:block}
.dg-lights .r{background:var(--rouge)} .dg-lights .y{background:#E8B84B} .dg-lights .g{background:#1a7f4b}
.dg-title{position:absolute;left:0;right:0;text-align:center;font-family:var(--mono);font-size:12.5px;color:var(--muted);pointer-events:none}
.dg-grid{display:grid; grid-template-columns:40fr 60fr; min-height:520px}
.dg-thread{display:flex; flex-direction:column; border-right:2px solid var(--encre); padding:18px}
.dg-agent{display:flex; align-items:center; gap:9px; margin-bottom:14px}
.dg-seal{font-family:var(--serif); color:var(--rouge); font-size:24px; font-weight:600; line-height:1}
.dg-id{font-family:var(--mono); font-size:12px; color:var(--muted)}
.dg-id b{color:var(--encre)}
.dg-flow{flex:1; display:flex; flex-direction:column; gap:13px; font-size:14px; overflow:auto; max-height:360px; padding-right:4px}
.dg-turn .dg-pre{font-family:var(--mono); font-size:10px; letter-spacing:.06em; text-transform:uppercase; margin-bottom:3px}
.dg-turn.u .dg-pre{color:var(--muted)} .dg-turn.p .dg-pre{color:var(--rouge)}
.dg-txt{line-height:1.5}
.dg-work{font-family:var(--mono); font-size:12.5px; color:var(--muted); line-height:1.7}
.dg-cur{display:inline-block; width:8px; height:14px; background:var(--rouge); vertical-align:-2px; animation:dgbl 1s steps(2) infinite}
@keyframes dgbl{50%{opacity:0}}
.dg-err{color:var(--rouge); font-family:var(--mono); font-size:13px; font-weight:700}
.dg-chips{display:flex; flex-wrap:wrap; gap:7px; margin:14px 0 12px}
.dg-chip{font-family:var(--mono); font-size:11px; color:var(--rouge); background:var(--rouge-soft); border:1.5px solid var(--rouge); border-radius:999px; padding:6px 12px; cursor:pointer}
.dg-chip:hover{background:var(--rouge); color:#fff}
.dg-composer{display:flex; gap:8px; align-items:center; margin-top:14px}
.dg-composer input{flex:1; border:2px solid var(--encre); border-radius:8px; padding:11px 13px; font-family:var(--mono); font-size:13px; background:var(--creme); outline:none}
.dg-composer input::placeholder{color:#9a9a9d}
.dg-send{flex:0 0 auto;width:42px;height:42px;border:2px solid var(--encre);background:var(--encre);color:var(--creme);border-radius:8px;box-shadow:3px 3px 0 var(--rouge);cursor:pointer;font-size:17px}
.dg-send:disabled{opacity:.5;cursor:wait}
.dg-canvas{padding:20px 22px; background:repeating-linear-gradient(0deg,#fff,#fff 27px,rgba(12,12,13,.025) 28px); display:flex; flex-direction:column}
.dg-ctop{display:flex; justify-content:space-between; align-items:center; margin-bottom:8px}
.dg-ctag{font-family:var(--mono); font-size:10.5px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; color:var(--rouge); background:var(--rouge-soft); border:1.5px solid var(--rouge); border-radius:5px; padding:4px 9px}
.dg-clive{font-family:var(--mono); font-size:10px; color:var(--muted)}
.dg-clive .d{display:inline-block;width:7px;height:7px;border-radius:50%;background:#1a7f4b;margin-right:5px;vertical-align:1px}
.dg-empty{margin:auto; text-align:center; color:var(--muted); position:relative; padding:30px}
.dg-empty p{font-family:var(--mono); font-size:13px; max-width:30ch; margin:14px auto 0}
.dg-stamp{font-family:var(--serif); font-size:120px; color:var(--rouge); opacity:.08; line-height:1}
.dg-ctitle{font-family:var(--serif); font-size:30px; font-weight:600; margin:2px 0 14px}
.dg-fronts{display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px}
.dg-fcard{border:2px solid var(--encre); border-radius:10px; background:#fff; padding:13px; box-shadow:3px 3px 0 var(--encre)}
.dg-fhead{margin-bottom:11px}
.dg-fn{font-family:var(--mono); font-size:10px; letter-spacing:.04em; text-transform:uppercase; color:var(--muted); display:block; margin-bottom:2px}
.dg-fhead b{font-size:13.5px}
.dg-nodes{display:flex; align-items:center; gap:5px}
.dg-node{flex:1; border:1.5px solid var(--encre); border-radius:6px; padding:7px 4px; text-align:center; font-family:var(--mono); font-size:9.5px; line-height:1.2; background:var(--creme)}
.dg-node.ag{background:var(--encre); color:var(--creme)}
.dg-arr{flex:0 0 auto; color:var(--rouge); font-weight:700; font-size:13px}
.dg-pills{display:flex; flex-wrap:wrap; gap:7px; margin-bottom:12px}
.dg-pill{font-family:var(--mono); font-size:10px; font-weight:700; color:var(--encre); background:var(--rouge-soft); border:1.5px solid var(--rouge); border-radius:999px; padding:3px 9px}
.dg-offer{font-size:14px; line-height:1.5; background:var(--rouge-soft); border-radius:8px; padding:12px 14px; margin-bottom:14px}
.dg-gate{margin-top:auto; border-top:2px solid var(--encre); padding-top:13px}
.dg-gh{font-family:var(--mono); font-size:10.5px; letter-spacing:.05em; text-transform:uppercase; color:var(--muted); margin-bottom:8px}
.dg-grow{display:flex; gap:9px}
.dg-grow input{flex:1; border:2px solid var(--encre); border-radius:7px; padding:11px 13px; font-family:var(--mono); font-size:12.5px; background:var(--creme); outline:none}
.dg-go{flex:0 0 auto; border:2px solid var(--encre); background:var(--rouge); color:#fff; font-weight:700; font-size:13px; border-radius:7px; padding:11px 16px; box-shadow:3px 3px 0 var(--encre); cursor:pointer; white-space:nowrap}
.dg-thanks{font-family:var(--serif); font-size:18px; line-height:1.4}
.dg-statusbar{border-top:2px solid var(--encre); background:var(--creme); padding:9px 14px; font-family:var(--mono); font-size:10.5px; color:var(--muted); display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px}
@media(max-width:820px){ .dg-grid{grid-template-columns:1fr} .dg-thread{border-right:none;border-bottom:2px solid var(--encre)} .dg-flow{max-height:300px} }
`;
