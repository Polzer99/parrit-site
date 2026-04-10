"use client";

import { useEffect, useState } from "react";
import { useScrollFade } from "@/components/hooks";
import { ButtonColorful } from "@/components/ui/button-colorful";

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
    </nav>
  );
}

/* ─── SECTION 1: HERO (houseofouss style — centered, massive, breathing) ─── */
function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-[72px]">
      {/* Emblem */}
      <img
        src="/emblem.png"
        alt="Parrit.ai"
        className="hero-animate hero-delay-1"
        style={{ width: "180px", height: "180px", marginBottom: "32px", filter: "drop-shadow(0 8px 24px rgba(200,149,108,0.15))" }}
      />

      {/* Italic intro phrase */}
      <p className="hero-animate hero-delay-2 hero-intro" style={{ maxWidth: "480px", marginBottom: "40px" }}>
        Si vous cherchez quelqu&rsquo;un qui parle d&rsquo;IA
        <br />
        &mdash; vous n&rsquo;&ecirc;tes pas au bon endroit.
      </p>

      {/* MEGA title */}
      <h1 className="hero-animate hero-delay-2 hero-title" style={{ marginBottom: "8px" }}>
        L&rsquo;excellence
      </h1>
      <h1 className="hero-animate hero-delay-3 hero-title" style={{ marginBottom: "12px" }}>
        par l&rsquo;usage.
      </h1>

      {/* Accent italic subtitle */}
      <p
        className="hero-animate hero-delay-4"
        style={{
          fontFamily: "var(--font-heading)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(28px, 4vw, 42px)",
          lineHeight: 1.15,
          color: "var(--accent)",
          textAlign: "center",
          marginBottom: "32px",
        }}
      >
        Intelligence artificielle<br />d&eacute;ploy&eacute;e.
      </p>

      {/* CTA — visible sans scroller */}
      <a
        href={CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hero-animate hero-delay-5"
        data-ph="hero-cta"
        onClick={trackCtaClick}
      >
        <ButtonColorful label="Planifier un entretien" className="h-14 px-8 text-base" />
      </a>

      {/* Italic copper quote */}
      <p className="hero-animate hero-delay-6 hero-quote" style={{ maxWidth: "600px", marginTop: "48px", marginBottom: "32px" }}>
        Comprendre avant de proposer. D&eacute;ployer avant de promettre.
      </p>

      {/* Features row */}
      <div className="hero-animate hero-delay-6 features-row" style={{ marginBottom: "0" }}>
        <span>Automatisation</span>
        <span className="copper-dot" />
        <span>CRM</span>
        <span className="copper-dot" />
        <span>Agents</span>
        <span className="copper-dot" />
        <span>SAP</span>
        <span className="copper-dot" />
        <span>Processus</span>
      </div>

      {/* Paris · Dubaï · Shanghai */}
      <p
        className="hero-animate hero-delay-8"
        style={{ marginTop: "64px", color: "var(--text-dim)", fontSize: "11px", letterSpacing: "0.15em", fontWeight: 500, textTransform: "uppercase" as const }}
      >
        Paris &middot; Duba&iuml; &middot; Shanghai
      </p>
    </section>
  );
}

/* ─── SECTION 2: L'ORIGINE (elegant, centered, invitation tone) ─── */
function Origin() {
  return (
    <section className="py-28 md:py-32 px-6">
      <div className="origin-section">
        <p className="fade-in section-label text-center">L&rsquo;Origine</p>

        <p className="fade-in origin-text">
          De Palo Alto &agrave; Lime, puis Arkel&nbsp;&mdash; nous avons accompagn&eacute; des maisons telles que Bollor&eacute; Energy, Groupe Seb, Nestl&eacute;, Carte Noire.
        </p>

        {/* Copper ornament */}
        <div className="fade-in flex justify-center py-6">
          <div className="copper-ornament" />
        </div>

        <p className="fade-in origin-text">
          <strong>Paul</strong> porte la vision produit et le terrain. <strong>Yukun</strong> apporte dix ann&eacute;es au c&oelig;ur des maisons europ&eacute;ennes et la ma&icirc;trise des op&eacute;rations entre la France et la Chine.
        </p>
      </div>
    </section>
  );
}

/* ─── SECTION 3: L'INSIGHT (centered, italic, copper) ─── */
function Insight() {
  return (
    <section className="section-space flex items-center justify-center px-6">
      <p
        className="fade-in text-center"
        style={{
          fontFamily: "var(--font-heading)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(20px, 2.5vw, 26px)",
          lineHeight: 1.8,
          color: "var(--accent)",
          maxWidth: "640px",
        }}
      >
        &laquo;&nbsp;Ce qui compte n&rsquo;est pas la technologie. C&rsquo;est la compr&eacute;hension de l&rsquo;humain.&nbsp;&raquo;
      </p>
    </section>
  );
}

/* ─── SECTION 4: SAVOIR-FAIRE (3 words, copper, elegant) ─── */
function SavoirFaire() {
  return (
    <section className="py-28 md:py-32 px-6 flex flex-col items-center">
      <p className="fade-in section-label text-center" style={{ marginBottom: "48px" }}>Savoir-faire</p>

      <div className="fade-in savoir-faire-list">
        <span className="savoir-faire-word">Diagnostic</span>
        <div className="savoir-faire-line" />
        <span className="savoir-faire-word">Conception</span>
        <div className="savoir-faire-line" />
        <span className="savoir-faire-word">D&eacute;ploiement</span>
      </div>
    </section>
  );
}

/* ─── DARK CTA + FOOTER ─── */
function DarkCTA() {
  return (
    <section
      className="px-6 py-40 flex flex-col items-center text-center"
      style={{ background: "var(--bg-dark)" }}
    >
      <h2
        className="fade-in mb-12"
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 400,
          fontSize: "clamp(36px, 5vw, 52px)",
          color: "var(--text-light)",
          letterSpacing: "-0.01em",
        }}
      >
        &Eacute;changeons.
      </h2>

      <a
        href={CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fade-in mb-10"
        data-ph="final-cta"
        onClick={trackCtaClick}
      >
        <ButtonColorful label="Planifier un entretien" className="h-14 px-8 text-base" />
      </a>

      <p className="fade-in" style={{ fontSize: "14px", letterSpacing: "0.04em", marginBottom: "80px" }}>
        <a
          href="mailto:paul@parrit.ai"
          style={{ color: "var(--text-light-muted)", textDecoration: "none" }}
        >
          paul@parrit.ai
        </a>
      </p>

      <p
        style={{ color: "rgba(90, 80, 71, 0.5)", fontSize: "11px", letterSpacing: "0.1em" }}
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
      <Origin />
      {/* Stamps — vintage, slightly rotated, overlapping */}
      <section className="py-24 md:py-28 flex flex-col items-center px-6">
        <div className="fade-in stamps-row">
          <img src="/stamp-paris.png" alt="Paris" className="stamp stamp-left" />
          <img src="/stamp-china.png" alt="Shanghai" className="stamp stamp-center" />
          <img src="/stamp-cameroun.png" alt="Cameroun" className="stamp stamp-right" />
        </div>
        <p className="fade-in stamps-caption">Paris &middot; Shanghai &middot; Douala</p>
      </section>
      <Insight />
      <SavoirFaire />
      <DarkCTA />
    </>
  );
}
