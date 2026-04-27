"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const WEBHOOK_URL = "https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead";

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
}

function looksLikeEmail(value: string): boolean {
  return value.includes("@");
}

function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((key) => {
    const val = params.get(key);
    if (val) utms[key] = val;
  });
  return utms;
}

export default function QuickContact({ strings, page, variant = "dark" }: Props) {
  const [contact, setContact] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contact.trim()) return;
    setState("sending");
    const isEmail = looksLikeEmail(contact);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "parrit.ai",
          action: "quick_contact",
          page,
          email: isEmail ? contact.trim() : "",
          telephone: !isEmail ? contact.trim() : "",
          contact_raw: contact.trim(),
          referrer: typeof document !== "undefined" ? document.referrer : "",
          url: typeof window !== "undefined" ? window.location.href : "",
          timestamp: new Date().toISOString(),
          ...getUtmParams(),
        }),
      });
      setState("sent");
    } catch {
      setState("error");
    }
  }

  const isLight = variant === "light";
  const inputBg = isLight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.06)";
  const inputBorder = isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.18)";
  const inputColor = isLight ? "var(--text)" : "#fff";
  const microColor = isLight ? "var(--text-muted)" : "var(--text-light-muted)";

  if (state === "sent") {
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
        ✓ {strings.thanks}
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
          onChange={(e) => setContact(e.target.value)}
          style={{
            flex: "1 1 220px",
            padding: "14px 18px",
            borderRadius: 999,
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
          style={{
            padding: "14px 24px",
            borderRadius: 999,
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 500,
            color: "#1a1410",
            background: "linear-gradient(135deg, #c8956c 0%, #b8814c 100%)",
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
