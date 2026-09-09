"use client";

import { useState } from "react";

import { track } from "@/lib/analytics";
import { noteFunnel } from "@/system/engagements";
import type { Locale } from "@/system/locale";
import { K } from "./K";

const DICT = {
  en: {
    label: "YOUR PROTOTYPE",
    line: "One e-mail address is enough. You receive the first sketch of your system, then a time to examine it together.",
    idea: "The process to rebuild, in one sentence (optional)",
    placeholder: "you@company.com",
    button: "Get your prototype now",
    sending: "Sending…",
    invalid: "Enter a valid work e-mail to receive your sketch.",
    failure: "Registration failed",
    direct: "Write to us instead:",
    registered: "Registered",
    done: "Noted. The first sketch of your operating system is being assembled right now. From what you just told us, not from a template.",
    watch: "Watch your sketch being assembled",
    aria: "Get your prototype",
  },
  fr: {
    label: "VOTRE PROTOTYPE",
    line: "Une adresse e-mail suffit. Vous recevez l'esquisse de votre premier système, puis un créneau pour l'examiner ensemble.",
    idea: "Votre process à reconstruire, en une phrase (facultatif)",
    placeholder: "vous@entreprise.fr",
    button: "Recevez votre prototype",
    sending: "Envoi en cours…",
    invalid: "Indiquez un e-mail professionnel valide pour recevoir votre esquisse.",
    failure: "L'envoi a échoué",
    direct: "Écrivez-nous directement :",
    registered: "Bien reçu.",
    done: "C'est noté. La première esquisse de votre système d'exploitation part en assemblage, à partir de ce que vous venez de nous dire. Pas d'un modèle tout fait.",
    watch: "Voir l'esquisse s'assembler",
    aria: "Recevez votre prototype",
  },
} as const;

function attribution(): Record<string, string> {
  const values: Record<string, string> = {};
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of params) {
    if (key.startsWith("utm_") || key === "source") values[key] = value;
  }
  if (document.referrer) values.referrer = document.referrer;
  return values;
}

export function QuickCapture({ locale, id, hero = false }: { locale: Locale; id?: string; hero?: boolean }) {
  const copy = DICT[locale];
  const [email, setEmail] = useState("");
  const [idee, setIdee] = useState("");
  const [ideaRevealed, setIdeaRevealed] = useState(false);
  const [submissionId] = useState(() => crypto.randomUUID());
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<"idle" | "invalid" | "sending" | "done" | "error">("idle");
  const [detail, setDetail] = useState("");
  const [sketchUrl, setSketchUrl] = useState("");

  const start = () => {
    if (started) return;
    setStarted(true);
    track("form_started", { form: "quick-capture", interest: "full-os" });
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "sending" || state === "done") return;
    const emailField = event.currentTarget.elements.namedItem("quick-email");
    if (!(emailField instanceof HTMLInputElement) || !emailField.checkValidity()) {
      setState("invalid");
      if (emailField instanceof HTMLInputElement) emailField.focus();
      return;
    }
    start();
    setState("sending");
    try {
      const response = await fetch("/api/interet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          ...(hero ? { idee: idee.slice(0, 300) } : {}),
          interet: "full-os",
          source: "site:quick-capture",
          pageOrigine: window.location.pathname,
          lang: locale,
          submissionId,
          attribution: attribution(),
        }),
      });
      const body = (await response.json()) as { ok?: boolean; error?: string; sketchUrl?: string };
      if (response.ok && body.ok) {
        if (body.sketchUrl) setSketchUrl(body.sketchUrl);
        setState("done");
        track("form_completed", { form: "quick-capture", interest: "full-os" });
        track("prototype_requested", { form: "quick-capture", interest: "full-os" });
      } else {
        setState("error");
        setDetail(body.error ?? `status ${response.status}`);
        track("form_failed", { form: "quick-capture", reason: body.error ?? String(response.status) });
      }
    } catch {
      setState("error");
      setDetail("network");
    }
  };

  if (state === "done") {
    return (
      <section id={id} className={`quick-capture${hero ? " home-s-quick-capture" : ""}`} data-state="done" aria-live="polite">
        <K>{copy.registered}</K>
        <p>{copy.done}</p>
        {sketchUrl ? <a className="rev-button exec" href={sketchUrl}>{copy.watch}</a> : null}
      </section>
    );
  }

  return (
    <section id={id} className={`quick-capture${hero ? " home-s-quick-capture" : ""}`} aria-label={copy.aria}>
      {!hero ? <div className="quick-copy">
        <K>{copy.label}</K>
        <p>{copy.line}</p>
      </div> : null}
      <form onSubmit={submit} noValidate>
        {hero ? <div className="home-s-idea-reveal" data-open={ideaRevealed}>
          <label className="sr-only" htmlFor="quick-idee">{copy.idea}</label>
          <input className="quick-idea" id="quick-idee" name="idee" type="text" maxLength={300} value={idee} placeholder={copy.idea} onFocus={start} onChange={(event) => setIdee(event.target.value.slice(0, 300))} />
        </div> : null}
        <div className="quick-fields">
          <label className="sr-only" htmlFor="quick-email">E-mail</label>
          <input id="quick-email" name="quick-email" type="email" required autoComplete="email" value={email} placeholder={copy.placeholder} onFocus={() => {
            if (hero) setIdeaRevealed(true);
            start();
          }} onChange={(event) => {
            setEmail(event.target.value);
            if (hero && event.target.value.length > 0) setIdeaRevealed(true);
          }} />
          <button className="rev-button exec" type="submit" disabled={state === "sending"}>{state === "sending" ? copy.sending : copy.button}</button>
        </div>
        {state === "error" ? (
          <span className="ri-error" role="alert">{copy.failure} ({detail}). {copy.direct} paul.larmaraud@parrit.ai</span>
        ) : state === "invalid" ? (
          <span className="ri-error" role="alert">{copy.invalid}</span>
        ) : <K>{noteFunnel(locale, hero ? "hero" : "standard")}</K>}
      </form>
    </section>
  );
}
