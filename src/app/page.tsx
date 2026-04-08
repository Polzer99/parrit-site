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

/* ─── EDITORIAL DIVIDER ─── */
function EditorialDivider() {
  return <hr className="editorial-divider" />;
}

/* ─── SECTION 1: HERO (houseofouss style — centered, massive, breathing) ─── */
function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-[72px]">
      {/* Italic intro phrase */}
      <p className="hero-animate hero-delay-1 hero-intro" style={{ maxWidth: "480px", marginBottom: "40px" }}>
        Si vous cherchez quelqu&rsquo;un qui parle d&rsquo;IA
        <br />
        &mdash; vous n&rsquo;&ecirc;tes pas au bon endroit.
      </p>

      {/* MEGA title */}
      <h1 className="hero-animate hero-delay-2 hero-title" style={{ marginBottom: "8px" }}>
        La preuve
      </h1>
      <h1 className="hero-animate hero-delay-3 hero-title" style={{ marginBottom: "12px" }}>
        par l&rsquo;exemple.
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
          marginBottom: "48px",
        }}
      >
        Intelligence artificielle<br />d&eacute;ploy&eacute;e.
      </p>

      {/* Italic copper quote */}
      <p className="hero-animate hero-delay-6 hero-quote" style={{ maxWidth: "600px", marginBottom: "48px" }}>
        Comprendre avant de proposer. D&eacute;ployer avant de promettre.
      </p>

      {/* Features row */}
      <div className="hero-animate hero-delay-6 features-row" style={{ marginBottom: "48px" }}>
        <span>Automatisation</span>
        <span className="copper-dot" />
        <span>CRM</span>
        <span className="copper-dot" />
        <span>Agents IA</span>
        <span className="copper-dot" />
        <span>SAP</span>
        <span className="copper-dot" />
        <span>Processus</span>
      </div>

      {/* CTA */}
      <a
        href={CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hero-animate hero-delay-7"
        data-ph="hero-cta"
        onClick={trackCtaClick}
      >
        <ButtonColorful label="Planifier un entretien" className="h-14 px-8 text-base" />
      </a>

      {/* Social proof */}
      <div className="hero-animate hero-delay-8" style={{ marginTop: "80px", marginBottom: "32px" }}>
        <p className="trust-label" style={{ marginBottom: "16px" }}>
          Ils nous font confiance
        </p>
        <p className="trust-names">
          Clevery Avocats &middot; SLC Production &middot; Arkel &middot; Lime &middot; Chamas Tacos &middot; Carte Noire &middot; Agence Laparra
        </p>
      </div>
    </section>
  );
}

/* ─── SECTION 2: L'ORIGINE (prose-section, justified) ─── */
function Origin() {
  return (
    <section className="section-space">
      <div className="prose-section">
        <p className="fade-in section-label">L&rsquo;Origine</p>

        <p className="fade-in">
          Notre parcours nous a conduits de <strong>Palo Alto</strong> &agrave; <strong>Lime</strong>, puis <strong>Arkel</strong>&nbsp;&mdash; r&eacute;f&eacute;rence fran&ccedil;aise en automatisation intelligente. Nous sommes intervenus aupr&egrave;s de grands groupes tels que Bollor&eacute; Energy, Groupe Seb, Nestl&eacute; ou encore Carte Noire.
        </p>

        <p className="fade-in">
          <strong>Paul</strong> apporte la vision produit et l&rsquo;approche terrain. <strong>Yukun</strong>, dix ans de SAP au sein des maisons de luxe europ&eacute;ennes, compl&egrave;te par sa ma&icirc;trise de la supply chain entre la France et la Chine.
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
        &laquo;&nbsp;Le plus important, ce n&rsquo;est pas la technologie. C&rsquo;est la compr&eacute;hension de l&rsquo;humain.&nbsp;&raquo;
      </p>
    </section>
  );
}

/* ─── SECTION 4: LA PREUVE (prose-section, two stories) ─── */
function Proof() {
  return (
    <section className="section-space">
      <div className="prose-section">
        <p className="fade-in section-label">La Preuve</p>

        <p className="fade-in">
          <strong>Cent dix restaurants, quarante ouvertures par an.</strong> Le d&eacute;lai d&rsquo;ouverture a &eacute;t&eacute; divis&eacute; par quatre gr&acirc;ce &agrave; un syst&egrave;me de pilotage automatis&eacute;.
        </p>

        <div className="fade-in flex justify-center" style={{ padding: "32px 0" }}>
          <div style={{ width: "40px", height: "1px", background: "var(--accent)" }} />
        </div>

        <p className="fade-in">
          <strong>Trois heures par jour de gestion d&rsquo;emails.</strong> Tri automatis&eacute;, r&eacute;ponses pr&eacute;-r&eacute;dig&eacute;es, validation en un clic. Deux heures trente restitu&eacute;es quotidiennement.
        </p>
      </div>
    </section>
  );
}

/* ─── DARK CTA + FOOTER ─── */
function DarkCTA() {
  return (
    <section
      className="px-6 pt-28 pb-12 md:pt-36 md:pb-16 flex flex-col items-center text-center"
      style={{ background: "var(--bg-dark)" }}
    >
      <h2
        className="fade-in mb-10"
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 400,
          fontSize: "clamp(32px, 4vw, 44px)",
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
        className="fade-in mb-8"
        data-ph="final-cta"
        onClick={trackCtaClick}
      >
        <ButtonColorful label="Planifier un entretien" className="h-14 px-8 text-base" />
      </a>

      <p className="fade-in mb-28" style={{ fontSize: "14px", letterSpacing: "0.04em" }}>
        <a
          href="mailto:paul@parrit.ai"
          style={{ color: "var(--text-light-muted)", textDecoration: "none" }}
        >
          paul@parrit.ai
        </a>
      </p>

      <p
        style={{ color: "var(--text-light-dim)", fontSize: "12px", letterSpacing: "0.08em" }}
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
      <EditorialDivider />
      <Origin />
      <section className="section-space flex justify-center gap-6 md:gap-10 px-6">
        <img src="/stamp-paris.png" alt="Paris" className="fade-in w-[180px] md:w-[240px] rounded shadow-lg" style={{ border: '1px solid var(--border)' }} />
        <img src="/stamp-china.png" alt="Shanghai" className="fade-in w-[180px] md:w-[240px] rounded shadow-lg" style={{ border: '1px solid var(--border)' }} />
        <img src="/stamp-cameroun.png" alt="Cameroun" className="fade-in w-[180px] md:w-[240px] rounded shadow-lg" style={{ border: '1px solid var(--border)' }} />
      </section>
      <EditorialDivider />
      <Insight />
      <EditorialDivider />
      <Proof />
      <EditorialDivider />
      <DarkCTA />
    </>
  );
}
