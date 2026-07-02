"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const DIAGNOSTIC_API = process.env.NEXT_PUBLIC_DIAGNOSTIC_API ?? "";

type Status = "idle" | "sending" | "done" | "error";

type PostHog = { capture: (e: string, p?: Record<string, unknown>) => void };
function ph(): PostHog | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as Record<string, unknown>).posthog as PostHog | undefined;
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return /\./.test(url.hostname);
  } catch {
    return false;
  }
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function DiagnosticExpressClient() {
  const [site, setSite] = useState("");
  const [fonction, setFonction] = useState("");
  const [email, setEmail] = useState("");
  const [prenom, setPrenom] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const fieldErrors = {
    site: site.trim().length > 0 && !isValidUrl(site) ? "Ce n'est pas une adresse de site valide." : "",
    email: email.trim().length > 0 && !isValidEmail(email) ? "Ce n'est pas une adresse mail valide." : "",
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const siteTrimmed = site.trim();
    const fonctionTrimmed = fonction.trim();
    const emailTrimmed = email.trim();

    if (!siteTrimmed || !isValidUrl(siteTrimmed)) {
      setError("Indiquez l'adresse de votre site web.");
      return;
    }
    if (!fonctionTrimmed) {
      setError("Indiquez votre fonction.");
      return;
    }
    if (!emailTrimmed || !isValidEmail(emailTrimmed)) {
      setError("Indiquez une adresse mail valide.");
      return;
    }
    if (!DIAGNOSTIC_API) {
      setError("Le diagnostic est momentanément indisponible. Réessayez plus tard.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`${DIAGNOSTIC_API}/diagnostic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site: siteTrimmed,
          fonction: fonctionTrimmed,
          email: emailTrimmed,
          prenom: prenom.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      await res.json().catch(() => null);
      ph()?.capture("diagnostic_express_submitted", { fonction: fonctionTrimmed });
      setStatus("done");
    } catch {
      setError("La demande n'est pas passée. Réessayez dans un instant.");
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

        <section className="dx-hero">
          <p className="dx-eyebrow">DIAGNOSTIC EXPRESS</p>
          <h2 className="dx-h1">
            Votre site, passé au crible <span className="dx-seal">速</span>
          </h2>
          <p className="dx-lede">
            Laissez l&apos;adresse de votre site et votre fonction. Vous recevez par mail un
            diagnostic sur-mesure de vos deux fronts critiques (back-office et business), avec un
            code pour le consulter.
          </p>
        </section>

        {status === "done" ? (
          <div className="dx-success" role="status">
            <div className="dx-stamp">速</div>
            <p className="dx-success-title">Votre diagnostic part par mail avec un code.</p>
            <p className="dx-success-sub">
              Ouvrez le mail, récupérez le code, et consultez votre diagnostic sur cette page.
            </p>
          </div>
        ) : (
          <form className="dx-form" onSubmit={handleSubmit} noValidate>
            <label className="dx-field">
              <span className="dx-label">Site web</span>
              <input
                type="text"
                inputMode="url"
                placeholder="votresite.fr"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                aria-invalid={Boolean(fieldErrors.site)}
                aria-label="Site web"
              />
              {fieldErrors.site && <span className="dx-field-err">{fieldErrors.site}</span>}
            </label>

            <label className="dx-field">
              <span className="dx-label">Votre fonction</span>
              <input
                type="text"
                placeholder="Dirigeant, DAF, responsable opérations…"
                value={fonction}
                onChange={(e) => setFonction(e.target.value)}
                aria-label="Votre fonction"
              />
            </label>

            <label className="dx-field">
              <span className="dx-label">Email</span>
              <input
                type="email"
                placeholder="vous@entreprise.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-label="Email"
              />
              {fieldErrors.email && <span className="dx-field-err">{fieldErrors.email}</span>}
            </label>

            <label className="dx-field">
              <span className="dx-label">Prénom (optionnel)</span>
              <input
                type="text"
                placeholder="Prénom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                aria-label="Prénom"
              />
            </label>

            {error && <div className="dx-err" role="alert">{error}</div>}

            <button className="dx-submit" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Envoi…" : "Recevoir mon diagnostic"}
            </button>
          </form>
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
.dx-field-err{font-size:12px; color:var(--rouge)}
.dx-err{font-family:var(--mono); font-size:12.5px; color:var(--rouge); font-weight:700}
.dx-submit{border:2px solid var(--encre); background:var(--encre); color:var(--creme); font-weight:700; font-size:14.5px; border-radius:8px; padding:13px 18px; box-shadow:4px 4px 0 var(--rouge); cursor:pointer}
.dx-submit:disabled{opacity:.6; cursor:wait}
.dx-success{padding:36px 26px 30px; text-align:center}
.dx-stamp{font-family:var(--body); font-size:60px; color:var(--rouge); margin-bottom:10px}
.dx-success-title{font-size:19px; font-weight:600; margin:0 0 8px}
.dx-success-sub{font-size:14px; color:var(--muted); margin:0}
.dx-statusbar{border-top:2px solid var(--encre); background:var(--creme); padding:9px 14px; font-family:var(--mono); font-size:10.5px; color:var(--muted); display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px}
`;
