"use client";

import { useEffect, useState } from "react";
import { useScrollFade } from "@/components/hooks";

const CALENDAR_URL = "https://calendar.app.google/nWa2QQe8DUwtuwbz8";
const WHATSAPP_URL =
  "https://wa.me/33759665687?text=Bonjour%20Paul%20!";
const WEBHOOK_URL =
  "https://n8n.srv1115145.hstgr.cloud/webhook/lead-inbound";

function trackCtaClick() {
  fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: "parrit.ai",
      action: "cta_click",
      timestamp: new Date().toISOString(),
      page: "landing",
    }),
  }).catch(() => {});
}

/* ─── SCROLL PROGRESS BAR ─── */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div className="scroll-progress" style={{ width: `${progress}%` }} />;
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section
      id="section-hero"
      className="min-h-[85vh] flex flex-col items-center justify-center px-6 py-20 relative"
      style={{ background: "var(--bg)" }}
    >
      {/* Radial copper glow behind hero */}
      <div className="hero-glow" />

      <p
        className="hero-animate hero-delay-1 uppercase tracking-[0.25em] text-sm font-semibold mb-6"
        style={{ color: "var(--accent)" }}
      >
        PARRIT.AI
      </p>

      <h1 className="hero-animate hero-delay-2 text-center leading-[1.12] max-w-[860px] mb-8 text-[clamp(32px,5.5vw,60px)] tracking-[-0.02em]" style={{ color: "#f5f0eb", fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 500, letterSpacing: "0.01em" }}>
        Exposez-moi vos contraintes.
        <br />
        <span style={{ color: "var(--accent)" }}>Je con&ccedil;ois la solution.</span>
      </h1>

      <p
        className="hero-animate hero-delay-3 text-center mb-8"
        style={{ color: "var(--text-muted)", fontSize: "1rem", letterSpacing: "0.04em" }}
      >
        Intelligence artificielle &middot; D&eacute;ploy&eacute;e en quatre semaines
      </p>

      <div className="hero-animate hero-delay-4 flex flex-col items-center gap-4">
        <a
          href={CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button"
          data-ph="hero-cta"
          onClick={trackCtaClick}
        >
          R&eacute;server un appel avec Paul
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline underline-offset-4"
          style={{ color: "var(--text-dim)" }}
        >
          Ou m&rsquo;&eacute;crivez sur WhatsApp
        </a>
      </div>

      <p
        className="hero-animate hero-delay-4 mt-8 text-xs tracking-[0.15em] uppercase"
        style={{ color: "var(--text-dim)" }}
      >
        Paris &middot; Duba&iuml; &middot; Shanghai
      </p>
    </section>
  );
}

/* ─── PHILOSOPHY ─── */
function Philosophy() {
  return (
    <section id="section-philosophy" className="px-6 py-32 md:py-40 max-w-[640px] mx-auto text-center">
      <p className="fade-in text-[clamp(18px,2.2vw,22px)] leading-[1.9]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-heading), Georgia, serif", fontStyle: "italic" }}>
        &laquo;&nbsp;Comprendre avant de proposer. D&eacute;ployer avant de promettre. Mesurer avant de facturer.&nbsp;&raquo;
      </p>
    </section>
  );
}

/* ─── SECTION DIVIDER ─── */
function SectionDivider() {
  return <div className="section-divider" />;
}

/* ─── DOMAINS ─── */
function Domains() {
  const domains = [
    "Automatisation documentaire",
    "CRM sur mesure",
    "Agents conversationnels",
    "Optimisation des processus",
    "Int\u00e9gration SAP",
  ];

  return (
    <section id="section-domains" className="px-6 py-32 md:py-40 max-w-[700px] mx-auto text-center">
      <p className="fade-in text-xs uppercase tracking-[0.2em] mb-12" style={{ color: "var(--accent)" }}>Domaines d&rsquo;intervention</p>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
        {domains.map((d, i) => (
          <span key={i} className={`fade-in stagger-${i + 1} text-lg`} style={{ color: "var(--text-muted)", letterSpacing: "0.02em" }}>{d}</span>
        ))}
      </div>
    </section>
  );
}

/* ─── METHOD ─── */
function Method() {
  const lines = [
    "J\u2019entre dans vos process avant de proposer quoi que ce soit.",
    "Je d\u00e9ploie sur un cas r\u00e9el, pas sur un slide deck.",
    "Je forme vos \u00e9quipes pour qu\u2019elles n\u2019aient plus besoin de moi.",
    "Je dis non quand le timing ou le cas ne s\u2019y pr\u00eate pas.",
  ];

  return (
    <section
      id="section-method"
      className="px-6 py-32 md:py-40 max-w-[700px] mx-auto"
    >
      {lines.map((line, i) => (
        <p
          key={i}
          className={`fade-in stagger-${i + 1} text-xl leading-relaxed mb-8 last:mb-0 flex items-start gap-4`}
        >
          <span
            className="inline-block mt-[6px] w-2 h-2 rounded-full shrink-0"
            style={{ background: "var(--accent)" }}
          />
          <span>{line}</span>
        </p>
      ))}
    </section>
  );
}

/* ─── TOOLS ─── */
function Tools() {
  const tools = [
    {
      name: "PaY",
      description:
        "Agent SAP proactif \u2014 MM/SD/FI en langage naturel",
      link: "",
    },
    {
      name: "Contestation SNCF",
      description:
        "Photo \u2192 IA \u2192 recommand\u00e9 AR envoy\u00e9 automatiquement",
      link: "https://contester-amende-sncf.vercel.app",
    },
    {
      name: "CRM M\u00e9tier",
      description:
        "Dashboard, pipeline, saisonnalit\u00e9 pour le terrain",
      link: "",
    },
  ];

  return (
    <section id="section-tools" className="px-6 py-32 md:py-40">
      <div className="max-w-[800px] mx-auto">
        <h2 className="fade-in text-[clamp(28px,4vw,40px)] font-bold mb-12">
          En production
        </h2>
        <div className="flex flex-col">
          {tools.map((t, i) => {
            const isLinked = t.link !== "";
            const Tag = isLinked ? "a" : "div";
            const linkProps = isLinked
              ? {
                  href: t.link,
                  target: "_blank" as const,
                  rel: "noopener noreferrer",
                }
              : {};

            return (
              <Tag
                key={i}
                {...linkProps}
                className="fade-in tool-row flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-8 py-6 px-4 -mx-4 rounded-lg cursor-default"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  cursor: isLinked ? "pointer" : "default",
                  textDecoration: "none",
                  color: "inherit",
                }}
                data-ph="tool-click"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6 flex-1">
                  <span className="font-semibold text-base whitespace-nowrap min-w-[160px]">
                    {t.name}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t.description}
                  </span>
                </div>
                {isLinked && (
                  <span
                    className="text-sm font-medium shrink-0"
                    style={{ color: "var(--accent)" }}
                  >
                    Acc&eacute;der &rarr;
                  </span>
                )}
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── FINAL CTA ─── */
function FinalCTA() {
  return (
    <section
      id="section-cta"
      className="px-6 py-32 md:py-40 flex flex-col items-center text-center"
    >
      <h2 className="fade-in text-[clamp(28px,4vw,42px)] leading-tight max-w-[500px] mb-12" style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 400, letterSpacing: "0.01em", color: "var(--text)" }}>
        &Eacute;changeons.
      </h2>
      <a
        href={CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fade-in cta-button mb-6"
        data-ph="final-cta"
        onClick={trackCtaClick}
      >
        R&eacute;server un appel avec Paul
      </a>
      <p className="fade-in text-sm" style={{ color: "var(--text-dim)" }}>
        Ou &eacute;crivez-moi :{" "}
        <a
          href="mailto:paul@parrit.ai"
          className="underline underline-offset-4"
          style={{ color: "var(--text-muted)" }}
        >
          paul@parrit.ai
        </a>
      </p>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="px-6 py-10 text-center">
      <p className="text-xs" style={{ color: "var(--text-dim)" }}>
        &copy; 2026 Paul Larmaraud &middot; SASU PARRIT.AI &middot; Rueil-Malmaison
      </p>
    </footer>
  );
}

/* ─── PAGE ─── */
export default function Home() {
  useScrollFade();

  return (
    <>
      <ScrollProgress />
      <Hero />
      <SectionDivider />
      <Philosophy />
      <SectionDivider />
      <Domains />
      <SectionDivider />
      <FinalCTA />
      <Footer />
    </>
  );
}
