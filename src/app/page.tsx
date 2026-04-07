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
        className="hero-animate hero-delay-3 text-center max-w-[520px] leading-[1.8] mb-8"
        style={{ color: "var(--text-muted)", fontSize: "1.05rem", letterSpacing: "0.02em" }}
      >
        Diagnostic pr&eacute;cis de vos points de friction op&eacute;rationnels.
        D&eacute;ploiement d&rsquo;intelligence artificielle cibl&eacute;e.
        R&eacute;sultats mesurables sous quatre semaines.
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
        className="hero-animate hero-delay-4 mt-8 text-xs tracking-wide"
        style={{ color: "var(--text-dim)" }}
      >
        2,5 ans de terrain &middot; 2 syst&egrave;mes en production &middot; 0 PowerPoint
      </p>
    </section>
  );
}

/* ─── PROBLEM ─── */
function Problem() {
  const lines = [
    "Vos \u00e9quipes passent des heures \u00e0 saisir les m\u00eames donn\u00e9es dans trois outils diff\u00e9rents.",
    "Les relances tombent dans l\u2019oubli parce que tout repose sur la m\u00e9moire de quelqu\u2019un.",
    "Vous savez que l\u2019IA peut aider. Vous ne savez pas par o\u00f9 commencer.",
    "Et chaque mois qui passe, le co\u00fbt de l\u2019inaction augmente.",
  ];

  return (
    <section
      id="section-problem"
      className="px-6 py-32 md:py-40 max-w-[700px] mx-auto"
    >
      {lines.map((line, i) => (
        <p
          key={i}
          className={`fade-in stagger-${i + 1} text-[clamp(20px,2.8vw,28px)] leading-relaxed mb-10 last:mb-0`}
          style={{ color: "var(--text)" }}
        >
          {line}
        </p>
      ))}
    </section>
  );
}

/* ─── SECTION DIVIDER ─── */
function SectionDivider() {
  return <div className="section-divider" />;
}

/* ─── PROOF ─── */
function Proof() {
  const stats = [
    { number: "48h", label: "Premier prototype" },
    { number: "110", label: "Restaurants automatis\u00e9s" },
    { number: "2", label: "Syst\u00e8mes en prod" },
    { number: "0", label: "PowerPoints produits" },
  ];

  const cases = [
    {
      badge: "MAISON DE VENTE AUX ENCH\u00c8RES",
      description:
        "Catalogue g\u00e9n\u00e9r\u00e9 automatiquement \u2014 descriptions + estimations de prix \u00e0 partir de photos d\u2019objets",
      before: "45 min par objet, manuellement",
      after: "30 secondes par objet, automatis\u00e9",
    },
    {
      badge: "110 RESTAURANTS \u00b7 DUBA\u00cf",
      description:
        "Ouverture de franchises standardis\u00e9e \u2014 chaque \u00e9tape automatis\u00e9e et trac\u00e9e",
      before: "Retards constants, documents oubli\u00e9s, 0 visibilit\u00e9",
      after: "75% de r\u00e9duction des d\u00e9lais, z\u00e9ro document manquant",
    },
  ];

  return (
    <section id="section-proof" className="px-6 py-32 md:py-40">
      {/* Stats */}
      <div className="max-w-[900px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
        {stats.map((s, i) => (
          <div key={i} className="fade-in text-center">
            <p
              className="stat-number text-[clamp(40px,6vw,64px)] font-bold leading-none mb-2"
              style={{ color: "var(--accent)" }}
            >
              {s.number}
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Cases */}
      <div className="max-w-[800px] mx-auto flex flex-col gap-8">
        {cases.map((c, i) => (
          <div
            key={i}
            className="fade-in case-card rounded-lg p-8 md:p-10"
            style={{ background: "var(--bg-elevated)" }}
          >
            <span
              className="inline-block uppercase text-xs font-semibold tracking-wider rounded px-3 py-1 mb-5"
              style={{
                color: "var(--accent)",
                background: "var(--accent-glow)",
              }}
            >
              {c.badge}
            </span>
            <p className="text-base md:text-lg mb-6" style={{ color: "var(--text)" }}>
              {c.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p
                  className="text-xs uppercase tracking-wider mb-1 font-medium"
                  style={{ color: "var(--text-dim)" }}
                >
                  Avant
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {c.before}
                </p>
              </div>
              <div>
                <p
                  className="text-xs uppercase tracking-wider mb-1 font-medium"
                  style={{ color: "var(--accent)" }}
                >
                  Apr&egrave;s
                </p>
                <p className="text-sm" style={{ color: "var(--text)" }}>
                  {c.after}
                </p>
              </div>
            </div>
          </div>
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
      <h2 className="fade-in text-[clamp(28px,4.5vw,48px)] font-bold leading-tight max-w-[640px] mb-12">
        Si vous lisez encore, vous avez
        <br />
        probablement d&eacute;j&agrave; votre r&eacute;ponse.
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
      <Problem />
      <SectionDivider />
      <Proof />
      <SectionDivider />
      <Method />
      <SectionDivider />
      <Tools />
      <SectionDivider />
      <FinalCTA />
      <Footer />
    </>
  );
}
