"use client";

import { useEffect, useRef, useState } from "react";
import { getAttribution } from "@/lib/attribution";

const WEBHOOK_URL = "https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead";
const SURFACE = "detecteur-bullshit";
const PENDING_LEAD_KEY = `pending_lead_${SURFACE}`;

type Axis = { key: string; score: number; weight: number };
type Result = {
  score: number;
  band: string;
  verdict: string;
  axes: Axis[];
  flags: string[];
  substance: string[];
  guard?: string | null;
};

const AXIS_LABELS: Record<string, string> = {
  preuve_execution: "Preuve d'usage réel",
  delta_information: "Delta d'information",
  comment_vs_promesse: "Le COMMENT vs la promesse",
  tromperie_vs_honnetete: "Tromperie vs honnêteté",
};

const ARC = Math.PI * 80; // longueur du demi-arc, rayon 80

function looksLikeEmail(v: string): boolean {
  return /\S+@\S+\.\S+/.test(v.trim());
}
function colorFor(s: number): string {
  if (s >= 56) return "#D1132F";
  if (s >= 31) return "#6E7079";
  return "#0C0C0D";
}
function arcColorFor(s: number): string {
  if (s >= 56) return "#D1132F";
  if (s >= 31) return "#7a7a7d";
  return "#0C0C0D";
}

type PostHog = {
  capture: (e: string, p: Record<string, unknown>) => void;
  identify: (id: string, p?: Record<string, unknown>) => void;
};
function getPosthog(): PostHog | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as Record<string, unknown>).posthog as
    | PostHog
    | undefined;
}

function statusFromError(error: unknown): number | undefined {
  if (!(error instanceof Error)) return undefined;
  const match = error.message.match(/webhook (\d+)/);
  return match ? Number(match[1]) : undefined;
}

function savePendingLead(payload: Record<string, unknown>, status?: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PENDING_LEAD_KEY, JSON.stringify({ surface: SURFACE, status, payload, savedAt: new Date().toISOString() }));
}

/* ----- la fiche verdict, animée au montage (remonte à chaque analyse via key) ----- */
function Verdict({ result }: { result: Result }) {
  const [armed, setArmed] = useState(false);
  const [gNum, setGNum] = useState(0);
  const [axVals, setAxVals] = useState<number[]>(result.axes.map(() => 0));

  useEffect(() => {
    const raf0 = requestAnimationFrame(() => setArmed(true));
    const start = performance.now();
    const lastEnd = 350 + (result.axes.length - 1) * 130 + 720;
    let frame = 0;
    const tick = (now: number) => {
      const t = now - start;
      const pg = Math.min(1, t / 1000);
      const eg = 1 - Math.pow(1 - pg, 3);
      setGNum(Math.round(result.score * eg));
      setAxVals(
        result.axes.map((a, i) => {
          const ts = 350 + i * 130;
          const pa = Math.min(1, Math.max(0, t - ts) / 700);
          return Math.round(a.score * pa);
        }),
      );
      if (t < lastEnd) {
        frame = requestAnimationFrame(tick);
      } else {
        setGNum(result.score);
        setAxVals(result.axes.map((a) => a.score));
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf0);
      cancelAnimationFrame(frame);
    };
  }, [result]);

  const needleDeg = armed ? -90 + (result.score / 100) * 180 : -90;
  const dashOffset = armed ? ARC * (1 - result.score / 100) : ARC;

  return (
    <>
      <div className="bsd-gaugewrap">
        <div className="bsd-gauge">
          <svg width="210" height="122" viewBox="0 0 200 116">
            <path
              d="M20 100 A80 80 0 0 1 180 100"
              fill="none"
              stroke="rgba(20,20,26,.10)"
              strokeWidth="13"
              strokeLinecap="round"
            />
            <path
              className="bsd-arcval"
              d="M20 100 A80 80 0 0 1 180 100"
              fill="none"
              stroke={arcColorFor(result.score)}
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray={ARC}
              strokeDashoffset={dashOffset}
            />
            <g
              className="bsd-needle"
              style={{ transform: `rotate(${needleDeg}deg)` }}
            >
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="34"
                stroke="#0C0C0D"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="100" r="7" fill="#0C0C0D" />
            </g>
          </svg>
          <div className="bsd-gnum" style={{ color: colorFor(result.score) }}>
            {gNum}
            <small>/100</small>
          </div>
        </div>
        <div className="bsd-gmeta">
          <span className={`bsd-band${result.score <= 55 ? " bsd-lo" : ""}`}>
            {result.band.toUpperCase()}
          </span>
          <div className="bsd-gscale">
            0–30 substance · 31–55 vide-honnête · 56–79 bullshit · 80–100 toxique
          </div>
        </div>
      </div>

      <div className="bsd-verdict">
        <span className="bsd-who">Verdict</span>
        <p>{result.verdict}</p>
      </div>

      <div className="bsd-axes">
        <p className="bsd-axhead">Décomposition</p>
        {result.axes.map((a, i) => (
          <div className="bsd-ax" key={a.key}>
            <div className="bsd-lab">
              {AXIS_LABELS[a.key] ?? a.key}
              <i>poids {a.weight.toFixed(2)}</i>
            </div>
            <div className="bsd-track">
              <div
                className="bsd-fill"
                style={{
                  width: armed ? `${a.score}%` : 0,
                  background: colorFor(a.score),
                  transitionDelay: `${0.35 + i * 0.13}s`,
                }}
              />
            </div>
            <div className="bsd-val">{axVals[i] ?? 0}</div>
          </div>
        ))}
      </div>

      <div className="bsd-cols">
        <div className="bsd-col bsd-flags">
          <h5>Ce qui manque</h5>
          <ul>
            {result.flags.map((f, i) => (
              <li
                key={i}
                style={{
                  opacity: armed ? 1 : 0,
                  transform: armed ? "translateY(0)" : "translateY(4px)",
                  transitionDelay: `${0.9 + i * 0.1}s`,
                }}
              >
                {f}
              </li>
            ))}
            {result.flags.length === 0 && (
              <li className="bsd-empty">Rien à signaler côté tromperie.</li>
            )}
          </ul>
        </div>
        <div className="bsd-col bsd-sub">
          <h5>Ce qui prouve l&apos;opération</h5>
          <ul>
            {result.substance.map((s, i) => (
              <li
                key={i}
                style={{
                  opacity: armed ? 1 : 0,
                  transform: armed ? "translateY(0)" : "translateY(4px)",
                  transitionDelay: `${0.9 + i * 0.1}s`,
                }}
              >
                {s}
              </li>
            ))}
            {result.substance.length === 0 && (
              <li className="bsd-empty">Rien. Il en parle de loin.</li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default function DetecteurClient() {
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "analyzing" | "done">("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const emailSentRef = useRef(false);

  useEffect(() => {
    const retryPendingLead = async () => {
      const raw = localStorage.getItem(PENDING_LEAD_KEY);
      if (!raw) return;
      const pending = JSON.parse(raw) as { surface?: string; payload?: Record<string, unknown> };
      if (pending.surface !== SURFACE || !pending.payload) return;
      const r = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pending.payload),
      });
      if (!r.ok) throw new Error(`webhook ${r.status}`);
      localStorage.removeItem(PENDING_LEAD_KEY);
    };

    retryPendingLead().catch((error) => {
      getPosthog()?.capture("form_failed", { surface: SURFACE, status: statusFromError(error) });
    });
  }, []);

  async function captureLead(mail: string) {
    const utms = getAttribution();
    const ph = getPosthog();
    const payload = {
      source: "parrit.ai",
      action: "bullshit_detector_lead",
      page: "outils/detecteur-bullshit",
      email: mail.trim(),
      contact_raw: mail.trim(),
      referrer: typeof document !== "undefined" ? document.referrer : "",
      url: typeof window !== "undefined" ? window.location.href : "",
      timestamp: new Date().toISOString(),
      ...utms,
    };
    try {
      const r = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(`webhook ${r.status}`);
      if (ph) {
        ph.identify(mail.trim(), { email: mail.trim() });
        ph.capture("form_submitted", {
          form: "bullshit_detector",
          page: "outils/detecteur-bullshit",
          ...utms,
        });
      }
    } catch (error) {
      // non bloquant : l'analyse continue meme si le webhook echoue
      const status = statusFromError(error);
      ph?.capture("form_failed", { surface: SURFACE, status });
      console.error(payload, error);
      savePendingLead(payload, status);
    }
  }

  async function analyze() {
    setError("");
    const t = text.trim();
    if (!looksLikeEmail(email)) {
      setError("Entrez votre email pro pour débloquer l'analyse.");
      return;
    }
    if (t.length < 15) {
      setError("Collez un peu plus de texte (au moins une phrase).");
      return;
    }
    setStatus("analyzing");
    setResult(null);
    if (!emailSentRef.current) {
      emailSentRef.current = true;
      void captureLead(email);
    }
    try {
      const r = await fetch("/api/bullshit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t }),
      });
      const d = await r.json();
      if (!r.ok || d.error) throw new Error(d.error || "Erreur");
      setResult(d as Result);
      setStatus("done");
    } catch (e) {
      setError("⚠️ " + (e as Error).message);
      setStatus("idle");
    }
  }

  const unlocked = looksLikeEmail(email);

  return (
    <main className="bsd-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="bsd-head">
        <div className="bsd-seal">速</div>
        <p className="bsd-kicker">Parrit · l&apos;œil de Paul Larmaraud</p>
        <h1>Détecteur de Bullshit IA</h1>
        <p className="bsd-lede">
          Collez un post, un mail ou un pitch sur l&apos;IA. On regarde{" "}
          <b>s&apos;il y a quelqu&apos;un derrière</b>. ~90 % du marché parle à
          30 000 pieds.
        </p>
      </div>

      <div className="bsd-win">
        <div className="bsd-chrome">
          <div className="bsd-lights">
            <span className="bsd-r" />
            <span className="bsd-y" />
            <span className="bsd-g" />
          </div>
          <div className="bsd-title">detecteur_de_bullshit.exe</div>
        </div>

        <div className="bsd-grid">
          {/* GAUCHE : saisie + gate */}
          <div className="bsd-pane bsd-pane-left">
            <p className="bsd-pane-label">Le contenu à analyser</p>
            <textarea
              className="bsd-editor"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Collez un post, un mail, un paragraphe sur l'IA. On regarde s'il y a quelqu'un derrière."
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") analyze();
              }}
            />
            <div className="bsd-gate">
              <input
                type="email"
                className="bsd-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.pro"
                autoComplete="email"
                inputMode="email"
                aria-label="Votre email professionnel"
              />
              <button
                className="bsd-cta"
                onClick={analyze}
                disabled={status === "analyzing"}
              >
                {status === "analyzing" ? "ANALYSE…" : "ANALYSER"}
              </button>
            </div>
            <p className="bsd-microgate">
              {unlocked
                ? "Accès débloqué. Cmd/Ctrl + Entrée pour lancer."
                : "Votre email pro débloque l'analyse. Zéro spam, on n'écrit que si vous le demandez."}
            </p>
            {error && <p className="bsd-err">{error}</p>}
          </div>

          {/* DROITE : verdict */}
          <div className="bsd-pane bsd-pane-right">
            <div className="bsd-stamp">速</div>
            {status === "done" && result ? (
              <Verdict result={result} key={result.verdict + result.score} />
            ) : (
              <div className="bsd-placeholder">
                {status === "analyzing" ? (
                  <>
                    <span className="bsd-blink">●</span> Lecture. On cherche la
                    trace d&apos;usage réel.
                  </>
                ) : (
                  "Le verdict s'imprime ici."
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bsd-statusbar">
          <span>modèle deepseek · grille v1 multi-axes</span>
          <span>l&apos;autorité se démontre, jamais ne se décrète</span>
        </div>
      </div>

      <footer className="bsd-footer">
        Construit par Parrit. Le jugement est calé sur la doctrine éditoriale de
        Paul Larmaraud : faits &gt; pathos, autorité démontrée &gt; décrétée.
        Pas un détecteur d&apos;IA, un détecteur de <i>vide</i>.
      </footer>
    </main>
  );
}

const CSS = `
.bsd-root{
  --creme:#FFFDFA; --encre:#0C0C0D; --rouge:#D1132F; --rouge-h:#8A0203;
  --rouge-soft:rgba(170,0,3,.07); --muted:#6E7079; --border:rgba(20,20,26,.12);
  --serif:var(--font-body),system-ui,sans-serif; --body:var(--font-body),system-ui,sans-serif; --mono:var(--font-mono),monospace;
  display:block; max-width:1080px; margin:0 auto; padding:24px 18px 56px;
  font-family:var(--body); color:var(--encre); line-height:1.5;
}
.bsd-head{margin:0 0 18px}
.bsd-seal{font-family:var(--serif); font-size:24px; color:var(--rouge); font-weight:600; line-height:1}
.bsd-kicker{font-family:var(--mono); font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); margin:7px 0 0}
.bsd-root h1{font-family:var(--body); font-weight:700; letter-spacing:-.02em; font-size:clamp(26px,4.4vw,40px); margin:5px 0 4px; line-height:1.04}
.bsd-lede{font-size:16px; color:var(--muted); margin:0; max-width:60ch}
.bsd-lede b{color:var(--encre)}

.bsd-win{background:#fff; border:2px solid var(--encre); border-radius: 0; box-shadow: none; overflow:hidden; margin-top:18px}
.bsd-chrome{display:flex; align-items:center; gap:10px; padding:11px 14px; border-bottom:2px solid var(--encre); background:var(--creme); position:relative}
.bsd-lights{display:flex; gap:7px}
.bsd-lights span{width:12px;height:12px;border-radius:50%;border:1.5px solid var(--encre);display:block}
.bsd-lights .bsd-r{background:var(--rouge)} .bsd-lights .bsd-y{background:#E8B84B} .bsd-lights .bsd-g{background:#1a7f4b}
.bsd-title{position:absolute; left:0; right:0; text-align:center; font-family:var(--mono); font-size:12.5px; color:var(--muted); pointer-events:none}

.bsd-grid{display:grid; grid-template-columns:1fr 1fr; min-height:520px}
.bsd-pane{padding:22px}
.bsd-pane-left{border-right:2px solid var(--encre); display:flex; flex-direction:column}
.bsd-pane-label{font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin:0 0 10px}
.bsd-editor{flex:1; border:2px solid var(--encre); border-radius: 0; background:var(--creme); padding:14px; font-family:var(--mono); font-size:13.5px; line-height:1.6; color:var(--encre); min-height:210px; resize:vertical; outline:none; box-shadow:inset 0 0 0 3px #fff}
.bsd-editor:focus{border-color:var(--rouge); box-shadow:inset 0 0 0 3px #fff, 0 0 0 3px var(--rouge-soft)}
.bsd-editor::placeholder{color:#9a9a9d}
.bsd-gate{display:flex; gap:10px; margin-top:14px; flex-wrap:wrap}
.bsd-email{flex:1 1 200px; border:2px solid var(--encre); border-radius: 0; padding:12px 14px; font-family:var(--mono); font-size:13.5px; background:#fff; color:var(--encre); outline:none}
.bsd-email:focus{border-color:var(--rouge); box-shadow: none; font-weight:700; font-size:15px; letter-spacing:.04em; background:var(--encre); color:var(--creme); border:2px solid var(--encre); box-shadow: none; padding:12px 24px; border-radius: 0; cursor:pointer; transition:transform .06s, box-shadow .06s; white-space:nowrap}
.bsd-cta:hover{box-shadow: none; box-shadow: none; cursor:wait; box-shadow: none; font-size:11px; color:var(--muted); margin:10px 0 0; line-height:1.5}
.bsd-err{color:var(--rouge); font-weight:700; font-size:13.5px; margin:10px 0 0; font-family:var(--mono)}

.bsd-pane-right{position:relative; background:#fff; display:flex; flex-direction:column}
.bsd-stamp{position:absolute; right:18px; top:84px; font-family:var(--serif); font-size:168px; color:var(--rouge); opacity:.05; pointer-events:none; transform:rotate(-8deg); line-height:1}
.bsd-placeholder{margin:auto; font-family:var(--mono); font-size:13.5px; color:var(--muted); text-align:center; padding:40px 10px}
.bsd-blink{color:var(--rouge); animation:bsdblink 1s steps(2) infinite}
@keyframes bsdblink{50%{opacity:.2}}

.bsd-gaugewrap{display:flex; align-items:center; gap:22px; margin-bottom:4px; position:relative; z-index:1}
.bsd-gauge{position:relative; width:210px; height:122px; flex:0 0 auto}
.bsd-gauge svg{display:block; overflow:visible}
.bsd-arcval{transition:stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)}
.bsd-needle{transform-origin:100px 100px; transition:transform 1s cubic-bezier(.2,.8,.2,1)}
.bsd-gnum{position:absolute; left:0; right:0; top:54px; text-align:center; font-family:var(--mono); font-weight:700; font-size:46px; line-height:1}
.bsd-gnum small{font-size:18px; color:var(--muted); font-weight:500}
.bsd-gmeta{flex:1}
.bsd-band{display:inline-block; font-family:var(--mono); font-size:11.5px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; padding:6px 11px; border:1.5px solid var(--encre); border-radius: 0; background:var(--rouge-soft); color:var(--rouge)}
.bsd-band.bsd-lo{color:var(--encre); background:rgba(20,20,26,.05)}
.bsd-gscale{font-family:var(--mono); font-size:10.5px; color:var(--muted); margin-top:9px}

.bsd-verdict{margin:20px 0 2px; border-left:3px solid var(--rouge); padding:4px 0 4px 16px; position:relative; z-index:1}
.bsd-who{font-family:var(--mono); font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); display:block; margin-bottom:6px}
.bsd-verdict p{font-family:var(--serif); font-size:23px; line-height:1.32; margin:0; font-weight:500}

.bsd-axes{margin:20px 0 6px; padding:0; position:relative; z-index:1}
.bsd-axhead{font-family:var(--mono); font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin:0 0 12px}
.bsd-ax{display:grid; grid-template-columns:150px 1fr 34px; align-items:center; gap:12px; margin-bottom:11px}
.bsd-lab{font-family:var(--mono); font-size:11.5px; line-height:1.25}
.bsd-lab i{display:block; color:var(--muted); font-style:normal; font-size:9.5px; margin-top:2px}
.bsd-track{height:11px; border:1.5px solid var(--encre); border-radius: 0; background:var(--creme); overflow:hidden}
.bsd-fill{height:100%; width:0; transition:width .9s cubic-bezier(.2,.8,.2,1)}
.bsd-val{font-family:var(--mono); font-size:12.5px; font-weight:700; text-align:right}

.bsd-cols{display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-top:8px; position:relative; z-index:1}
.bsd-col h5{font-family:var(--mono); font-size:10.5px; letter-spacing:.08em; text-transform:uppercase; margin:0 0 9px}
.bsd-flags h5{color:var(--rouge)} .bsd-sub h5{color:#1a7f4b}
.bsd-col ul{margin:0; padding:0; list-style:none}
.bsd-col li{font-family:var(--mono); font-size:12px; line-height:1.5; margin-bottom:6px; transition:opacity .4s, transform .4s}
.bsd-flags li{color:var(--encre)} .bsd-flags li::before{content:"> "; color:var(--rouge); font-weight:700}
.bsd-sub li{color:#176e41} .bsd-sub li::before{content:"+ "; color:#1a7f4b; font-weight:700}
.bsd-col .bsd-empty{font-family:var(--serif); font-style:italic; font-size:15px; color:var(--muted); opacity:1 !important; transform:none !important}
.bsd-col .bsd-empty::before{content:"" !important}

.bsd-statusbar{border-top:2px solid var(--encre); background:var(--creme); padding:9px 14px; font-family:var(--mono); font-size:10.5px; color:var(--muted); display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px}
.bsd-footer{font-family:var(--body); font-size:13px; color:var(--muted); margin-top:26px; max-width:62ch}
.bsd-footer i{color:var(--encre)}

@media(max-width:820px){
  .bsd-grid{grid-template-columns:1fr}
  .bsd-pane-left{border-right:none; border-bottom:2px solid var(--encre)}
  .bsd-stamp{font-size:120px; top:30px}
}
`;
