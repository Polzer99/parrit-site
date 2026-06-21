"use client";

import { FormEvent, useMemo, useState } from "react";

type RelatedLink = {
  href: string;
  label: string;
};

type Props = {
  interestTag: string;
  lang: "fr" | "en" | "pt-BR" | "zh-CN";
  sourcePath?: string;
  title?: string;
  description?: string;
  relatedLinks?: RelatedLink[];
};

type Status = "idle" | "sending" | "done" | "error";

const COPY = {
  fr: {
    title: "Recevoir la suite utile",
    description: "Laissez votre email. On garde le contexte de cette page pour vous orienter vers le bon chantier.",
    consent: "J'accepte que Parrit me recontacte au sujet de cette thématique.",
    placeholder: "vous@entreprise.fr",
    submit: "Recevoir",
    sending: "Envoi...",
    done: "C'est noté.",
    error: "Le message n'est pas parti.",
    explore: "Pages liées",
  },
  en: {
    title: "Get the useful next step",
    description: "Leave your email. We keep this page context to route you to the right topic.",
    consent: "I agree that Parrit may contact me about this topic.",
    placeholder: "you@company.com",
    submit: "Send",
    sending: "Sending...",
    done: "Got it.",
    error: "The message did not go through.",
    explore: "Related pages",
  },
  "pt-BR": {
    title: "Receber o próximo passo útil",
    description: "Deixe seu email. Guardamos o contexto desta página para orientar o tema certo.",
    consent: "Aceito que a Parrit entre em contato comigo sobre este tema.",
    placeholder: "voce@empresa.com",
    submit: "Receber",
    sending: "Enviando...",
    done: "Pronto.",
    error: "A mensagem não foi enviada.",
    explore: "Páginas relacionadas",
  },
  "zh-CN": {
    title: "Get the useful next step",
    description: "Leave your email. We keep this page context to route you to the right topic.",
    consent: "I agree that Parrit may contact me about this topic.",
    placeholder: "you@company.com",
    submit: "Send",
    sending: "Sending...",
    done: "Got it.",
    error: "The message did not go through.",
    explore: "Related pages",
  },
};

export default function InterestEmailCapture({
  interestTag,
  lang,
  sourcePath,
  title,
  description,
  relatedLinks = [],
}: Props) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const copy = COPY[lang] || COPY.fr;
  const normalizedPath = useMemo(() => {
    if (sourcePath) return sourcePath;
    if (typeof window !== "undefined") return window.location.pathname;
    return "/";
  }, [sourcePath]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/email-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          interest_tag: interestTag,
          source_path: normalizedPath,
          lang,
          consent,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || copy.error);
      setStatus("done");
      setEmail("");
      setConsent(false);
      setMessage(copy.done);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : copy.error);
    }
  }

  return (
    <section className="interest-capture" aria-label={title || copy.title}>
      <div className="interest-capture-head">
        <span className="interest-capture-tag">{interestTag}</span>
        <h2>{title || copy.title}</h2>
        <p>{description || copy.description}</p>
      </div>
      <form className="interest-capture-form" onSubmit={submit}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={copy.placeholder}
          aria-label="Email"
          required
        />
        <label className="interest-capture-consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            required
          />
          <span>{copy.consent}</span>
        </label>
        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? copy.sending : copy.submit}
        </button>
      </form>
      {message && <p className={`interest-capture-message ${status}`}>{message}</p>}
      {relatedLinks.length > 0 && (
        <div className="interest-capture-links">
          <span>{copy.explore}</span>
          {relatedLinks.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
