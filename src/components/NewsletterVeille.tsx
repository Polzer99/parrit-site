"use client";

import { useEffect, useRef, useState } from "react";
import { getAttribution } from "@/lib/attribution";
import { track } from "@/lib/analytics";

const WEBHOOK_URL = "https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead";
const FORM_ID = "newsletter-veille";

export type NewsletterCopy = {
  placeholder: string;
  button: string;
  ok: string;
  error: string;
};

export default function NewsletterVeille({ copy, page }: { copy: NewsletterCopy; page: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const viewed = useRef(false);

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    track("form_view", { form: FORM_ID });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value || state === "sending") return;
    setState("sending");
    try {
      const r = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "site:newsletter-veille",
          action: "newsletter_optin",
          page,
          email: value,
          ...getAttribution(),
        }),
      });
      if (!r.ok) throw new Error(`webhook ${r.status}`);
      track("form_submitted", { form: FORM_ID });
      setState("sent");
    } catch (error) {
      const status = error instanceof Error
        ? Number(error.message.match(/webhook (\d+)/)?.[1])
        : Number.NaN;
      track("form_failed", { form: FORM_ID, ...(Number.isNaN(status) ? {} : { status }) });
      setState("error");
    }
  }

  if (state === "sent") {
    return <p className="hd-nl-ok" role="status">{copy.ok}</p>;
  }

  return (
    <>
      <form className="hd-nl-form" onSubmit={handleSubmit}>
        <input
          className="hd-nl-input"
          type="email"
          required
          inputMode="email"
          autoComplete="email"
          placeholder={copy.placeholder}
          aria-label={copy.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="hd-btn primary" type="submit" disabled={state === "sending"}>
          {copy.button} <span className="hd-cta-arrow" aria-hidden="true">→</span>
        </button>
      </form>
      {state === "error" && <p className="hd-nl-err" role="alert">{copy.error}</p>}
    </>
  );
}
