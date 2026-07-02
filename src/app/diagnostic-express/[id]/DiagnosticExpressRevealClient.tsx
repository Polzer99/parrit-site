"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
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

function isAgentNode(node: string): boolean {
  return /agent|速/i.test(node);
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
    <div className="home-template dx-page">
      <div className="frame" />

      <div className="wrap">
        <nav>
          <Link className="logo" href="/fr" aria-label="Parrit·AI, accueil">
            <img className="logo-img" src="/brand/parrit-lockup-red.svg" alt="Parrit·AI" />
          </Link>
          <Link className="btn btn-red" href="/diagnostic-express">Nouveau diagnostic</Link>
        </nav>
      </div>

      <section className="hero left">
        <img className="seal-wm" src="/brand/parrit-seal.svg" alt="" />
        <div className="wrap">
          {!diag ? (
            <>
              <span className="kicker">DIAGNOSTIC EXPRESS</span>
              <h1>
                Votre code, votre <span className="red">diagnostic</span>.
              </h1>
              <p className="sub">
                Récupérez le code reçu par mail et entrez-le ci-dessous pour consulter votre
                diagnostic.
              </p>

              <form className="dx-form" onSubmit={handleSubmit} noValidate>
                <div className="dx-field">
                  <span className="dx-field-label">Code reçu par mail</span>
                  <input
                    type="text"
                    placeholder="Ex. 7XQK2"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    aria-invalid={status === "error"}
                    aria-label="Code reçu par mail"
                    autoFocus
                  />
                </div>

                {error && <div className="dx-error" role="alert">{error}</div>}

                <button className="btn btn-red btn-lg" type="submit" disabled={status === "checking"}>
                  {status === "checking" ? "Vérification…" : "Voir mon diagnostic"}
                </button>
              </form>
            </>
          ) : (
            <div className="dx-result">
              <span className="kicker">DIAGNOSTIC</span>
              <h1 className="dx-framing">{diag.framing}</h1>

              <div className="grid2">
                {[diag.front1, diag.front2].map((f, i) => (
                  <div className="card" key={i}>
                    <div className="dx-fn">{i === 0 ? "Front 1" : "Front 2"}</div>
                    <h3>{f?.label}</h3>
                    <div className="dx-flow">
                      {(f?.nodes || []).map((n, j) => (
                        <span key={j} style={{ display: "contents" }}>
                          <span className={`dx-node ${isAgentNode(n) ? "ag" : ""}`}>{n}</span>
                          {j < (f?.nodes || []).length - 1 && <span className="dx-arrow">→</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {diag.pills?.length > 0 && (
                <div className="chips" style={{ justifyContent: "flex-start", marginTop: 24 }}>
                  {diag.pills.map((p) => (
                    <span className="chip" key={p}>{p}</span>
                  ))}
                </div>
              )}

              {diag.offer && <p className="dx-offer">{diag.offer}</p>}
              {diag.cta && <p className="dx-cta">{diag.cta}</p>}
            </div>
          )}
        </div>
      </section>

      <div className="wrap">
        <footer className="dx-footer">
          <div className="logo">
            <img className="logo-img" src="/brand/parrit-lockup-red.svg" alt="Parrit·AI" />
          </div>
          <span className="mono dim">l&apos;autorité se démontre, jamais ne se décrète</span>
        </footer>
      </div>
    </div>
  );
}
