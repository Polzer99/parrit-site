"use client";

import { useState } from "react";

import { track } from "@/lib/analytics";
import type { Locale } from "@/system/locale";

const DICT = {
  en: {
    placeholder: "you@company.com",
    button: "Receive the journal",
    sending: "Sending…",
    invalid: "Enter a valid work e-mail to receive the journal.",
    failure: "Registration failed",
    direct: "Write to us instead:",
    done: "Noted. The journal arrives by e-mail.",
    aria: "Receive the journal",
  },
  fr: {
    placeholder: "vous@entreprise.fr",
    button: "Recevoir le journal",
    sending: "Envoi en cours…",
    invalid: "Indiquez un e-mail professionnel valide pour recevoir le journal.",
    failure: "L'envoi a échoué",
    direct: "Écrivez-nous directement :",
    done: "Bien reçu. Le journal arrive par e-mail.",
    aria: "Recevoir le journal",
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

export function NewsletterCapture({ locale }: { locale: Locale }) {
  const copy = DICT[locale];
  const [email, setEmail] = useState("");
  const [submissionId] = useState(() => crypto.randomUUID());
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<"idle" | "invalid" | "sending" | "done" | "error">("idle");
  const [detail, setDetail] = useState("");

  const start = () => {
    if (started) return;
    setStarted(true);
    track("form_started", { form: "journal-newsletter", interest: "journal" });
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "sending" || state === "done") return;
    const emailField = event.currentTarget.elements.namedItem("journal-email");
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
          interet: "journal",
          source: "site:journal-newsletter",
          pageOrigine: window.location.pathname,
          lang: locale,
          submissionId,
          attribution: attribution(),
        }),
      });
      const body = (await response.json()) as { ok?: boolean; error?: string };
      if (response.ok && body.ok) {
        setState("done");
        track("form_completed", { form: "journal-newsletter", interest: "journal" });
      } else {
        setState("error");
        setDetail(body.error ?? `status ${response.status}`);
        track("form_failed", { form: "journal-newsletter", reason: body.error ?? String(response.status) });
      }
    } catch {
      setState("error");
      setDetail("network");
    }
  };

  if (state === "done") {
    return <p className="home-s-newsletter-done" aria-live="polite">{copy.done}</p>;
  }

  return (
    <form className="home-s-newsletter" onSubmit={submit} noValidate aria-label={copy.aria}>
      <label className="sr-only" htmlFor="journal-email">E-mail</label>
      <input id="journal-email" name="journal-email" type="email" required autoComplete="email" value={email} placeholder={copy.placeholder} onFocus={start} onChange={(event) => setEmail(event.target.value)} />
      <button className="rev-button exec" type="submit" disabled={state === "sending"}>{state === "sending" ? copy.sending : copy.button}</button>
      {state === "error" ? <span className="ri-error" role="alert">{copy.failure} ({detail}). {copy.direct} paul.larmaraud@parrit.ai</span> : null}
      {state === "invalid" ? <span className="ri-error" role="alert">{copy.invalid}</span> : null}
    </form>
  );
}
