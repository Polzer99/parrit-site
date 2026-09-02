"use client";

import { useState } from "react";

import { track } from "@/lib/analytics";
import type { Locale } from "@/system/locale";
import { K } from "./K";

const DICT = {
  en: {
    interests: [
      ["reporting", "Reporting & visibility"],
      ["client-flow", "Client flow & CRM"],
      ["mail-followups", "Mail & follow-ups"],
      ["full-os", "The full operating system"],
    ],
    registered: "Registered",
    done: "Noted. The first sketch of your operating system is being assembled right now. From what you just told us, not from a template.",
    watch: "Watch your sketch being assembled",
    aria: "Register your interest",
    label: "Register your interest",
    title: "In 10 focused hours, your company gets its first system. Start here.",
    intro: "Tell us where it hurts. We answer with a sketch of your operating system: a prototype built for your company, in your inbox. No newsletter, no sequence.",
    email: "Work e-mail",
    emailPlaceholder: "you@company.com",
    hurts: "What hurts most",
    company: "Company (optional)",
    companyPlaceholder: "Name or domain",
    call: "Also open to a 30-minute examination call.",
    submit: "Get your prototype now",
    sending: "Sending…",
    failure: "Registration failed",
    direct: "Write to us instead:",
    invalid: "Enter a valid work e-mail to receive your sketch.",
    note: "One prototype per company · No automated sequence",
  },
  fr: {
    interests: [
      ["reporting", "Reporting et visibilité"],
      ["client-flow", "Flux clients et CRM"],
      ["mail-followups", "E-mails et relances"],
      ["full-os", "Le système d'exploitation complet"],
    ],
    registered: "Bien reçu.",
    done: "C'est noté. La première esquisse de votre système d'exploitation part en assemblage, à partir de ce que vous venez de nous dire. Pas d'un modèle tout fait.",
    watch: "Voir l'esquisse s'assembler",
    aria: "Demandez votre esquisse",
    label: "Demandez votre esquisse",
    title: "En 10 heures, votre entreprise tient son premier système. Ça commence ici.",
    intro: "Dites-nous où ça coince. Nous répondons par une esquisse de votre système d'exploitation : un prototype construit pour votre entreprise, livré dans votre boîte mail. Pas de newsletter, pas de séquence automatique.",
    email: "E-mail professionnel",
    emailPlaceholder: "vous@entreprise.fr",
    hurts: "Ce qui coince le plus",
    company: "Entreprise (facultatif)",
    companyPlaceholder: "Nom ou site web",
    call: "Un examen de 30 minutes m'intéresse aussi.",
    submit: "Recevez votre prototype",
    sending: "Envoi en cours…",
    failure: "L'envoi a échoué",
    direct: "Écrivez-nous directement :",
    invalid: "Indiquez un e-mail professionnel valide pour recevoir votre esquisse.",
    note: "Un prototype par entreprise · Aucune séquence automatique",
  },
} as const;

function attribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const out: Record<string, string> = {};
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of params) {
    if (key.startsWith("utm_") || key === "source") out[key] = value;
  }
  if (document.referrer) out.referrer = document.referrer;
  return out;
}

export function RegisterInterest({ source, locale }: { source: string; locale: Locale }) {
  const copy = DICT[locale];
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState<string>("full-os");
  const [company, setCompany] = useState("");
  const [openToCall, setOpenToCall] = useState(false);
  const [submissionId] = useState(() => crypto.randomUUID());
  const [state, setState] = useState<"idle" | "invalid" | "sending" | "done" | "error">("idle");
  const [detail, setDetail] = useState("");
  const [sketchUrl, setSketchUrl] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "sending" || state === "done") return;
    const emailField = event.currentTarget.querySelector<HTMLInputElement>('input[type="email"]');
    if (emailField && !emailField.checkValidity()) {
      setState("invalid");
      emailField.focus();
      return;
    }
    setState("sending");
    track("form_started", { form: "register-interest", interest });
    try {
      const response = await fetch("/api/interet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          interet: interest,
          entreprise: company,
          ouvertAppel: openToCall,
          source,
          pageOrigine: window.location.pathname,
          lang: locale,
          attribution: attribution(),
          submissionId,
        }),
      });
      const body = (await response.json()) as { ok?: boolean; error?: string; sketchUrl?: string };
      if (response.ok && body.ok) {
        if (body.sketchUrl) setSketchUrl(body.sketchUrl);
        setState("done");
        track("form_completed", { form: "register-interest", interest });
        track("prototype_requested", { form: "register-interest", interest, open_to_call: openToCall });
      } else {
        setState("error");
        setDetail(body.error ?? `status ${response.status}`);
        track("form_failed", { form: "register-interest", reason: body.error ?? String(response.status) });
      }
    } catch {
      setState("error");
      setDetail("network");
    }
  };

  if (state === "done") {
    return (
      <div className="ri" data-state="done">
        <K>{copy.registered}</K>
        <p className="ri-done">{copy.done}</p>
        {sketchUrl ? <a className="rev-button exec" href={sketchUrl}>{copy.watch}</a> : null}
      </div>
    );
  }

  return (
    <form className="ri" onSubmit={submit} noValidate aria-label={copy.aria}>
      <div className="ri-head">
        <K>{copy.label}</K>
        <h3>{copy.title}</h3>
        <p>{copy.intro}</p>
      </div>
      <div className="ri-grid">
        <label>
          <K>{copy.email}</K>
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder={copy.emailPlaceholder} autoComplete="email" />
        </label>
        <label>
          <K>{copy.hurts}</K>
          <select value={interest} onChange={(event) => setInterest(event.target.value)}>
            {copy.interests.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label>
          <K>{copy.company}</K>
          <input type="text" value={company} onChange={(event) => setCompany(event.target.value)} placeholder={copy.companyPlaceholder} autoComplete="organization" />
        </label>
      </div>
      <label className="ri-check">
        <input type="checkbox" checked={openToCall} onChange={(event) => setOpenToCall(event.target.checked)} />
        <span>{copy.call}</span>
      </label>
      <div className="ri-foot">
        <button className="rev-button exec" type="submit" disabled={state === "sending"}>{state === "sending" ? copy.sending : copy.submit}</button>
        {state === "error" ? (
          <span className="ri-error" role="alert">{copy.failure} ({detail}). {copy.direct} paul.larmaraud@parrit.ai</span>
        ) : state === "invalid" ? (
          <span className="ri-error" role="alert">{copy.invalid}</span>
        ) : <K>{copy.note}</K>}
      </div>
    </form>
  );
}
