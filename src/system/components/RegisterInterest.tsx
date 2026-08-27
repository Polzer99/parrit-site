"use client";

import { useState } from "react";

import { K } from "./K";
import { track } from "@/lib/analytics";

const INTERESTS = [
  { value: "reporting", label: "Reporting & visibility" },
  { value: "client-flow", label: "Client flow & CRM" },
  { value: "mail-followups", label: "Mail & follow-ups" },
  { value: "full-os", label: "The full operating system" },
] as const;

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

export function RegisterInterest({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState<string>("full-os");
  const [company, setCompany] = useState("");
  const [openToCall, setOpenToCall] = useState(false);
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
          lang: "en",
          attribution: attribution(),
        }),
      });
      const body = (await response.json()) as { ok?: boolean; error?: string; sketchUrl?: string };
      if (response.ok && body.ok) {
        if (body.sketchUrl) setSketchUrl(body.sketchUrl);
        setState("done");
        track("form_completed", { form: "register-interest", interest });
        track("prototype_requested", { interest, open_to_call: openToCall });
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
        <K>Registered</K>
        <p className="ri-done">
          Noted. The first sketch of your operating system is being assembled right now.
          from what you just told us, not from a template.
        </p>
        {sketchUrl ? (
          <a className="rev-button exec" href={sketchUrl}>
            Watch your sketch being assembled
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form className="ri" onSubmit={submit} noValidate aria-label="Register your interest">
      <div className="ri-head">
        <K>Register your interest</K>
        <h3>In 10 focused hours, your company gets its first system. Start here.</h3>
        <p>
          Tell us where it hurts. We answer with a sketch of your operating system: a
          prototype built for your company, in your inbox. No newsletter, no sequence.
        </p>
      </div>
      <div className="ri-grid">
        <label>
          <K>Work e-mail</K>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
          />
        </label>
        <label>
          <K>What hurts most</K>
          <select value={interest} onChange={(event) => setInterest(event.target.value)}>
            {INTERESTS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <K>Company (optional)</K>
          <input
            type="text"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            placeholder="Name or domain"
            autoComplete="organization"
          />
        </label>
      </div>
      <label className="ri-check">
        <input
          type="checkbox"
          checked={openToCall}
          onChange={(event) => setOpenToCall(event.target.checked)}
        />
        <span>Also open to a 30-minute examination call.</span>
      </label>
      <div className="ri-foot">
        <button className="rev-button exec" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Registering…" : "Register your interest"}
        </button>
        {state === "error" ? (
          <span className="ri-error" role="alert">
            Registration failed ({detail}). Write to us instead: paul.larmaraud@parrit.ai
          </span>
        ) : state === "invalid" ? (
          <span className="ri-error" role="alert">
            Enter a valid work e-mail to receive your sketch.
          </span>
        ) : (
          <K>One prototype per company · No automated sequence</K>
        )}
      </div>
    </form>
  );
}
