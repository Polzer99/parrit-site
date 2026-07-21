"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getAttribution, buildRdvHref } from "@/lib/attribution";
import { track } from "@/lib/analytics";

const WEBHOOK_URL = "https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead";
const FORM_ID = "quickcontact";

const QC_RDV_CTA: Record<string, string> = {
  fr: "Réserver 15 minutes avec Paul",
  en: "Book 15 minutes with Paul",
  "pt-BR": "Reservar 15 minutos com Paul",
  "zh-CN": "预约与 Paul 的 15 分钟",
};

export interface QuickContactStrings {
  label: string;
  placeholder: string;
  submit: string;
  submitting: string;
  thanks: string;
  error: string;
  micro: string;
}

interface Props {
  strings: QuickContactStrings;
  page: string;
  variant?: "light" | "dark";
  source?: string;
  lang?: string;
}

function looksLikeEmail(value: string): boolean {
  return value.includes("@");
}

export default function QuickContact({ strings, page, variant = "dark", source, lang }: Props) {
  const [contact, setContact] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const started = useRef(false);

  useEffect(() => {
    track("form_view", { form: FORM_ID });
  }, []);

  function handleContactChange(value: string): void {
    setContact(value);
    if (!started.current) {
      started.current = true;
      track("form_start", { form: FORM_ID });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contact.trim()) return;
    setState("sending");
    const isEmail = looksLikeEmail(contact);
    const utms = getAttribution();
    const ph = typeof window !== "undefined"
      ? (window as unknown as Record<string, unknown>).posthog as
          | { capture: (e: string, p: Record<string, unknown>) => void; identify: (id: string, p?: Record<string, unknown>) => void }
          | undefined
      : undefined;
    try {
      const r = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: source ?? "site:quickcontact",
          action: "quick_contact",
          page,
          email: isEmail ? contact.trim() : "",
          telephone: !isEmail ? contact.trim() : "",
          contact_raw: contact.trim(),
          referrer: typeof document !== "undefined" ? document.referrer : "",
          url: typeof window !== "undefined" ? window.location.href : "",
          timestamp: new Date().toISOString(),
          ...utms,
        }),
      });
      if (!r.ok) throw new Error(`webhook ${r.status}`);
      if (isEmail) ph?.identify(contact.trim(), { email: contact.trim() });
      track("form_submitted", {
        form: FORM_ID,
        contact_kind: isEmail ? "email" : "phone",
      });
      setState("sent");
    } catch (error) {
      const status = error instanceof Error
        ? Number(error.message.match(/webhook (\d+)/)?.[1])
        : Number.NaN;
      track("form_failed", {
        form: FORM_ID,
        ...(Number.isNaN(status) ? {} : { status }),
      });
      setState("error");
    }
  }

  const isLight = variant === "light";
  const inputBg = isLight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.06)";
  const inputBorder = isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.18)";
  const inputColor = isLight ? "var(--text)" : "#fff";
  const microColor = isLight ? "var(--text-muted)" : "var(--text-light-muted)";

  if (state === "sent") {
    const ctaLang = lang || page.split("/")[1] || "fr";
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          textAlign: "center",
          padding: "20px 16px",
          fontFamily: "var(--font-heading)",
          fontSize: 18,
          color: isLight ? "var(--text)" : "#fff",
        }}
      >
        <div>✓ {strings.thanks}</div>
          {!page.includes("rendez-vous") && (
          <a
            href={buildRdvHref("quick-contact", ctaLang)}
            data-ph="booking"
            data-ph-label={QC_RDV_CTA[ctaLang] ?? QC_RDV_CTA.fr}
            data-ph-dest={buildRdvHref("quick-contact", ctaLang)}
            data-ph-placement="quick_contact_success"
            style={{
              display: "inline-block",
              marginTop: 16,
              padding: "12px 22px",
              borderRadius: 0,
              background: "var(--parrit-red)",
              color: "#FFFDFA",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {QC_RDV_CTA[ctaLang] ?? QC_RDV_CTA.fr}
          </a>
        )}
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "100%",
        maxWidth: 480,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          required
          name="contact"
          autoComplete="email"
          inputMode="email"
          aria-label={strings.label}
          placeholder={strings.placeholder}
          value={contact}
          onChange={(e) => handleContactChange(e.target.value)}
          style={{
            flex: "1 1 220px",
            padding: "14px 18px",
            borderRadius: 0,
            fontFamily: "var(--font-body)",
            fontSize: 15,
            color: inputColor,
            background: inputBg,
            border: `1px solid ${inputBorder}`,
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={state === "sending"}
          data-ph="cta"
          data-ph-label={strings.submit}
          data-ph-dest="quick_contact_submit"
          data-ph-placement="quick_contact"
          style={{
            padding: "14px 24px",
            borderRadius: 0,
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 600,
            color: "#FFFDFA",
            background: "var(--parrit-red)",
            border: "none",
            cursor: state === "sending" ? "wait" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {state === "sending" ? strings.submitting : strings.submit}
        </button>
      </div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: microColor,
          textAlign: "center",
          fontWeight: 300,
          margin: 0,
        }}
      >
        {strings.micro}
      </p>
      {state === "error" && (
        <p
          style={{
            color: "#ff6b6b",
            fontSize: 13,
            textAlign: "center",
            fontFamily: "var(--font-body)",
            margin: 0,
          }}
        >
          {strings.error}
        </p>
      )}
    </form>
  );
}
