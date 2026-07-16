"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
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
    <div className="home-template dx-page">
      <div className="frame" />

      <div className="wrap">
        <nav>
          <Link className="logo" href="/fr" aria-label="Parrit·AI, accueil">
            <img className="logo-img" src="/brand/parrit-lockup-red.svg" alt="Parrit·AI" />
          </Link>
          <Link className="btn btn-red" href="/fr/blog">Nos articles</Link>
        </nav>
      </div>

      <section className="hero left">
        <img className="seal-wm" src="/brand/parrit-seal.svg" alt="" />
        <div className="wrap">
          <span className="kicker">DIAGNOSTIC EXPRESS</span>
          <h1>
            Votre site, passé au crible par un <span className="red">速 Agent</span>.
          </h1>
          <p className="sub">
            Laissez l&apos;adresse de votre site et votre fonction. Vous recevez par mail un
            diagnostic sur-mesure de vos deux fronts critiques, back-office et business, avec un
            code pour le consulter.
          </p>

          {status === "done" ? (
            <div className="card dx-success" role="status">
              <div className="ic">速</div>
              <h3>Votre diagnostic part par mail avec un code.</h3>
              <p>Ouvrez le mail, récupérez le code, et consultez votre diagnostic sur cette page.</p>
            </div>
          ) : (
            <form className="dx-form" onSubmit={handleSubmit} noValidate>
              <div className="dx-field">
                <span className="dx-field-label">Site web</span>
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
              </div>

              <div className="dx-field">
                <span className="dx-field-label">Votre fonction</span>
                <input
                  type="text"
                  placeholder="Dirigeant, DAF, responsable opérations…"
                  value={fonction}
                  onChange={(e) => setFonction(e.target.value)}
                  aria-label="Votre fonction"
                />
              </div>

              <div className="dx-field">
                <span className="dx-field-label">Email</span>
                <input
                  type="email"
                  placeholder="vous@entreprise.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-label="Email"
                />
                {fieldErrors.email && <span className="dx-field-err">{fieldErrors.email}</span>}
              </div>

              <div className="dx-field">
                <span className="dx-field-label">Prénom (optionnel)</span>
                <input
                  type="text"
                  placeholder="Prénom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  aria-label="Prénom"
                />
              </div>

              {error && <div className="dx-error" role="alert">{error}</div>}

              <button className="btn btn-red btn-lg" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Envoi…" : "Recevoir mon diagnostic"}
              </button>
            </form>
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
