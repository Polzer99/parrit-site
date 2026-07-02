"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const DIAGNOSTIC_API = process.env.NEXT_PUBLIC_DIAGNOSTIC_API ?? "";

type Front = { label: string; nodes: string[] };
type Diagnostic = {
  framing: string;
  front1: Front;
  front2: Front;
  pills: string[];
  offer: string;
  cta: string;
};

type Status = "idle" | "checking" | "done" | "error";

type PostHog = { capture: (e: string, p?: Record<string, unknown>) => void };
function ph(): PostHog | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as Record<string, unknown>).posthog as PostHog | undefined;
}

export default function DiagnosticExpressRevealClient({ id }: { id: string }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [diag, setDiag] = useState<Diagnostic | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const codeTrimmed = code.trim();
    if (!codeTrimmed) {
      setError("Indiquez le code reçu par mail.");
      return;
    }
    if (!DIAGNOSTIC_API) {
      setError("Le diagnostic est momentanément indisponible. Réessayez plus tard.");
      return;
    }

    setStatus("checking");
    try {
      const res = await fetch(`${DIAGNOSTIC_API}/reveal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, code: codeTrimmed }),
      });

      if (res.status === 401) {
        setError("Code invalide.");
        setStatus("error");
        return;
      }
      if (res.status === 404) {
        setError("Ce diagnostic est introuvable ou a expiré.");
        setStatus("error");
        return;
      }
      if (!res.ok) throw new Error(`Erreur ${res.status}`);

      const data = (await res.json()) as { diagnostic?: Diagnostic };
      if (!data.diagnostic) throw new Error("Réponse inattendue.");

      setDiag(data.diagnostic);
      setStatus("done");
      ph()?.capture("diagnostic_express_revealed", { id });
    } catch {
      setError("La vérification n'est pas passée. Réessayez dans un instant.");
      setStatus("error");
    }
  }

  return (
    <main className="dx-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="dx-win">
        <div className="dx-chrome">
          <div className="dx-lights"><span className="r" /><span className="y" /><span className="g" /></div>
          <div className="dx-title">parrit.sh : diagnostic-express</div>
        </div>

        {!diag ? (
          <>
            <section className="dx-hero">
              <p className="dx-eyebrow">DIAGNOSTIC EXPRESS</p>
              <h2 className="dx-h1">
                Votre code, votre diagnostic <span className="dx-seal">速</span>
              </h2>
              <p className="dx-lede">
                Récupérez le code reçu par mail et entrez-le ci-dessous pour consulter votre
                diagnostic.
              </p>
            </section>

            <form className="dx-form" onSubmit={handleSubmit} noValidate>
              <label className="dx-field">
                <span className="dx-label">Code reçu par mail</span>
                <input
                  type="text"
                  placeholder="Ex. 7XQK2"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  aria-invalid={status === "error"}
                  aria-label="Code reçu par mail"
                  autoFocus
                />
              </label>

              {error && <div className="dx-err" role="alert">{error}</div>}

              <button className="dx-submit" type="submit" disabled={status === "checking"}>
                {status === "checking" ? "Vérification…" : "Voir mon diagnostic"}
              </button>
            </form>
          </>
        ) : (
          <div className="dx-canvas">
            <div className="dx-ctop">
              <span className="dx-ctag">DIAGNOSTIC</span>
            </div>
            <div className="dx-ctitle">{diag.framing}</div>
            <div className="dx-fronts">
              {[diag.front1, diag.front2].map((f, i) => (
                <div className="dx-fcard" key={i}>
                  <div className="dx-fhead">
                    <span className="dx-fn">{i === 0 ? "Front 1" : "Front 2"}</span>
                    <b>{f?.label}</b>
                  </div>
                  <div className="dx-nodes">
                    {(f?.nodes || []).map((n, j) => (
                      <span key={j} style={{ display: "contents" }}>
                        <div className={`dx-node ${/agent|速/i.test(n) ? "ag" : ""}`}>{n}</div>
                        {j < (f?.nodes || []).length - 1 && <span className="dx-arr">→</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {diag.pills?.length > 0 && (
              <div className="dx-pills">
                {diag.pills.map((p) => (
                  <span className="dx-pill" key={p}>{p}</span>
                ))}
              </div>
            )}
            {diag.offer && <div className="dx-offer">{diag.offer}</div>}
            {diag.cta && (
              <div className="dx-gate">
                <div className="dx-gh">{diag.cta}</div>
              </div>
            )}
          </div>
        )}

        <div className="dx-statusbar">
          <span>Un diagnostic sur-mesure, adapté à votre métier.</span>
          <span>l&apos;autorité se démontre, jamais ne se décrète</span>
        </div>
      </div>
    </main>
  );
}

const CSS = `
.dx-root{
  --creme:#F5F8FF; --encre:#161616; --rouge:#AA0003; --rouge-soft:rgba(170,0,3,.07);
  --muted:#6E7079; --border:rgba(20,20,26,.14);
  --body:var(--font-body),system-ui,sans-serif; --mono:var(--font-mono),monospace;
  display:block; max-width:760px; margin:0 auto; padding:22px 18px 48px; font-family:var(--body); color:var(--encre);
}
.dx-win{background:#fff; border:2px solid var(--encre); border-radius:11px; box-shadow:8px 8px 0 var(--encre); overflow:hidden}
.dx-chrome{display:flex; align-items:center; gap:10px; padding:11px 14px; border-bottom:2px solid var(--encre); background:var(--creme); position:relative}
.dx-lights{display:flex;gap:7px}
.dx-lights span{width:12px;height:12px;border-radius:50%;border:1.5px solid var(--encre);display:block}
.dx-lights .r{background:var(--rouge)} .dx-lights .y{background:#E8B84B} .dx-lights .g{background:#1a7f4b}
.dx-title{position:absolute;left:0;right:0;text-align:center;font-family:var(--mono);font-size:12.5px;color:var(--muted);pointer-events:none}
.dx-hero{padding:28px 26px 8px}
.dx-eyebrow{font-family:var(--mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--rouge); margin:0 0 10px}
.dx-h1{font-size:28px; font-weight:600; line-height:1.2; margin:0 0 14px}
.dx-seal{color:var(--rouge)}
.dx-lede{font-size:15px; line-height:1.55; color:var(--muted); max-width:56ch; margin:0}
.dx-form{display:flex; flex-direction:column; gap:14px; padding:20px 26px 26px}
.dx-field{display:flex; flex-direction:column; gap:6px}
.dx-label{font-family:var(--mono); font-size:11px; letter-spacing:.04em; text-transform:uppercase; color:var(--muted)}
.dx-field input{border:2px solid var(--encre); border-radius:8px; padding:11px 13px; font-family:var(--body); font-size:14px; background:var(--creme); outline:none}
.dx-field input::placeholder{color:#9a9a9d}
.dx-field input[aria-invalid="true"]{border-color:var(--rouge)}
.dx-err{font-family:var(--mono); font-size:12.5px; color:var(--rouge); font-weight:700}
.dx-submit{border:2px solid var(--encre); background:var(--encre); color:var(--creme); font-weight:700; font-size:14.5px; border-radius:8px; padding:13px 18px; box-shadow:4px 4px 0 var(--rouge); cursor:pointer}
.dx-submit:disabled{opacity:.6; cursor:wait}
.dx-canvas{padding:22px 26px 28px; background:repeating-linear-gradient(0deg,#fff,#fff 27px,rgba(20,20,26,.025) 28px)}
.dx-ctop{display:flex; justify-content:space-between; align-items:center; margin-bottom:8px}
.dx-ctag{font-family:var(--mono); font-size:10.5px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; color:var(--rouge); background:var(--rouge-soft); border:1.5px solid var(--rouge); border-radius:5px; padding:4px 9px}
.dx-ctitle{font-size:26px; font-weight:600; margin:6px 0 16px; line-height:1.25}
.dx-fronts{display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px}
.dx-fcard{border:2px solid var(--encre); border-radius:10px; background:#fff; padding:13px; box-shadow:3px 3px 0 var(--encre)}
.dx-fhead{margin-bottom:11px}
.dx-fn{font-family:var(--mono); font-size:10px; letter-spacing:.04em; text-transform:uppercase; color:var(--muted); display:block; margin-bottom:2px}
.dx-fhead b{font-size:13.5px}
.dx-nodes{display:flex; align-items:center; gap:5px; flex-wrap:wrap}
.dx-node{flex:1; border:1.5px solid var(--encre); border-radius:6px; padding:7px 4px; text-align:center; font-family:var(--mono); font-size:9.5px; line-height:1.2; background:var(--creme)}
.dx-node.ag{background:var(--encre); color:var(--creme)}
.dx-arr{flex:0 0 auto; color:var(--rouge); font-weight:700; font-size:13px}
.dx-pills{display:flex; flex-wrap:wrap; gap:7px; margin-bottom:12px}
.dx-pill{font-family:var(--mono); font-size:10px; font-weight:700; color:var(--encre); background:var(--rouge-soft); border:1.5px solid var(--rouge); border-radius:999px; padding:3px 9px}
.dx-offer{font-size:14px; line-height:1.5; background:var(--rouge-soft); border-radius:8px; padding:12px 14px; margin-bottom:14px}
.dx-gate{margin-top:auto; border-top:2px solid var(--encre); padding-top:13px}
.dx-gh{font-family:var(--mono); font-size:12.5px; letter-spacing:.02em; color:var(--encre); font-weight:700}
.dx-statusbar{border-top:2px solid var(--encre); background:var(--creme); padding:9px 14px; font-family:var(--mono); font-size:10.5px; color:var(--muted); display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px}
@media(max-width:520px){ .dx-fronts{grid-template-columns:1fr} }
`;
