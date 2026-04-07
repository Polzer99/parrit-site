"use client";

import { useEffect, useState } from "react";
import { useScrollFade } from "@/components/hooks";

const CALENDAR_URL = "https://calendar.app.google/nWa2QQe8DUwtuwbz8";
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

/* ─── NAV ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <span className="nav-logo">PARRIT.AI</span>
      <a
        href={CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="nav-cta"
        data-ph="nav-cta"
        onClick={trackCtaClick}
      >
        R&eacute;server un appel
      </a>
    </nav>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section
      id="section-hero"
      className="min-h-screen flex flex-col items-center justify-center px-6 pt-[72px]"
      style={{ background: "var(--bg)" }}
    >
      <p
        className="hero-animate hero-delay-1 uppercase text-xs font-medium mb-8"
        style={{
          color: "var(--accent)",
          letterSpacing: "0.15em",
          fontFamily: "var(--font-body)",
        }}
      >
        INTELLIGENCE ARTIFICIELLE APPLIQU&Eacute;E
      </p>

      <h1
        className="hero-animate hero-delay-2 text-center leading-[1.1] max-w-[780px] mb-6"
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 500,
          fontSize: "clamp(36px, 5.5vw, 62px)",
          color: "var(--text)",
          letterSpacing: "-0.01em",
        }}
      >
        Exposez-moi vos contraintes.
        <br />
        <span style={{ color: "var(--accent)" }}>
          Je con&ccedil;ois la solution.
        </span>
      </h1>

      <p
        className="hero-animate hero-delay-3 text-center mb-10"
        style={{
          color: "var(--text-muted)",
          fontSize: "18px",
          fontWeight: 300,
          maxWidth: "480px",
          lineHeight: 1.7,
          fontFamily: "var(--font-body)",
        }}
      >
        D&eacute;ploy&eacute;e en quatre semaines.
      </p>

      <a
        href={CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hero-animate hero-delay-4 cta-button"
        data-ph="hero-cta"
        onClick={trackCtaClick}
      >
        R&eacute;server un appel
      </a>

      <p
        className="hero-animate hero-delay-5 mt-10 text-xs uppercase"
        style={{
          color: "var(--text-dim)",
          letterSpacing: "0.15em",
          fontWeight: 300,
        }}
      >
        Paris &middot; Duba&iuml; &middot; Shanghai
      </p>
    </section>
  );
}

/* ─── DIVIDER ─── */
function Divider() {
  return (
    <div className="py-12">
      <div className="divider" />
    </div>
  );
}

/* ─── PHILOSOPHY ─── */
function Philosophy() {
  return (
    <section
      id="section-philosophy"
      className="px-6 py-16 md:py-24 max-w-[640px] mx-auto text-center"
    >
      <p
        className="fade-in"
        style={{
          fontFamily: "var(--font-heading)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(18px, 2.2vw, 24px)",
          lineHeight: 1.8,
          color: "var(--text-muted)",
        }}
      >
        &laquo;&nbsp;Comprendre avant de proposer. D&eacute;ployer avant de
        promettre. Mesurer avant de facturer.&nbsp;&raquo;
      </p>
    </section>
  );
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
    <section
      id="section-domains"
      className="px-6 py-16 md:py-24 max-w-[800px] mx-auto text-center"
    >
      <p
        className="fade-in uppercase text-xs font-medium mb-10"
        style={{
          color: "var(--accent)",
          letterSpacing: "0.15em",
          fontFamily: "var(--font-body)",
        }}
      >
        DOMAINES D&rsquo;INTERVENTION
      </p>
      <div className="fade-in flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
        {domains.map((d, i) => (
          <span key={i} className="flex items-center gap-3">
            {i > 0 && <span className="copper-dot" />}
            <span
              style={{
                color: "var(--text-muted)",
                fontSize: "16px",
                fontWeight: 300,
                fontFamily: "var(--font-body)",
              }}
            >
              {d}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* ─── SOCIAL PROOF ─── */
function SocialProof() {
  return (
    <section className="px-6 py-12 text-center">
      <p
        className="fade-in text-xs uppercase"
        style={{
          color: "var(--text-dim)",
          letterSpacing: "0.15em",
          fontWeight: 300,
          fontFamily: "var(--font-body)",
        }}
      >
        Clevery Avocats &middot; SLC Production &middot; Arkel &middot; Lime &middot; Chamas Tacos &middot; Carte Noire &middot; Agence Laparra
      </p>
    </section>
  );
}

/* ─── DARK CTA + FOOTER ─── */
function DarkCTA() {
  return (
    <section
      id="section-cta"
      className="px-6 pt-24 pb-12 md:pt-32 md:pb-16 flex flex-col items-center text-center"
      style={{ background: "var(--bg-dark)" }}
    >
      <h2
        className="fade-in mb-10"
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 400,
          fontSize: "clamp(32px, 4vw, 44px)",
          color: "#F5F0EB",
          letterSpacing: "-0.01em",
        }}
      >
        &Eacute;changeons.
      </h2>

      <a
        href={CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fade-in cta-button-dark mb-6"
        data-ph="final-cta"
        onClick={trackCtaClick}
      >
        R&eacute;server un appel
      </a>

      <p className="fade-in mb-20" style={{ color: "#6B7280", fontSize: "14px" }}>
        <a
          href="mailto:paul@parrit.ai"
          style={{ color: "#9CA3AF", textDecoration: "none" }}
        >
          paul@parrit.ai
        </a>
      </p>

      {/* Footer */}
      <p
        className="text-xs"
        style={{ color: "#4B5563", letterSpacing: "0.04em" }}
      >
        &copy; 2026 Paul Larmaraud &middot; SASU PARRIT.AI &middot;
        Rueil-Malmaison
      </p>
    </section>
  );
}

/* ─── PAGE ─── */
export default function Home() {
  useScrollFade();

  return (
    <>
      <Nav />
      <Hero />
      <Divider />
      <Philosophy />
      <Divider />
      <Domains />
      <Divider />
      <SocialProof />
      <DarkCTA />
    </>
  );
}
