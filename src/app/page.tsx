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
        Planifier un entretien
      </a>
    </nav>
  );
}

/* ─── SECTION 1: OPENING (HERO) ─── */
function Hero() {
  return (
    <section
      id="section-hero"
      className="min-h-screen flex flex-col items-center justify-center px-6 pt-[72px]"
      style={{ background: "var(--bg)" }}
    >
      <h1
        className="hero-animate hero-delay-2 text-center leading-[1.15] max-w-[780px] mb-6"
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 500,
          fontSize: "clamp(40px, 5vw, 56px)",
          color: "var(--text)",
          letterSpacing: "-0.01em",
        }}
      >
        La preuve par l&rsquo;exemple.
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
        Je ne vends pas de l&rsquo;IA. J&rsquo;en d&eacute;ploie. Tous les jours. Dans de vraies entreprises.
      </p>

      <a
        href={CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hero-animate hero-delay-4 cta-button"
        data-ph="hero-cta"
        onClick={trackCtaClick}
      >
        Planifier un entretien
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

/* ─── SECTION 2: THE ORIGIN ─── */
function Origin() {
  return (
    <section
      id="section-origin"
      className="px-6 py-16 md:py-24"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-[680px] mx-auto">
        <p
          className="fade-in uppercase text-xs font-medium mb-10"
          style={{
            color: "var(--accent)",
            letterSpacing: "0.15em",
            fontFamily: "var(--font-body)",
          }}
        >
          L&rsquo;ORIGINE
        </p>

        <p
          className="fade-in mb-8"
          style={{
            color: "var(--text-muted)",
            fontSize: "17px",
            lineHeight: 1.9,
            fontFamily: "var(--font-body)",
            fontWeight: 300,
          }}
        >
          Tout a commenc&eacute; par un d&eacute;jeuner &agrave; Palo Alto. Un ancien de Mint, devenu Venture Capitalist, m&rsquo;a dit une phrase qui a tout chang&eacute; : <strong style={{ color: "var(--text)", fontWeight: 500 }}>&laquo;&nbsp;Investis ton temps dans le produit et l&rsquo;intelligence artificielle.&nbsp;&raquo;</strong>
        </p>

        <p
          className="fade-in mb-8"
          style={{
            color: "var(--text-muted)",
            fontSize: "17px",
            lineHeight: 1.9,
            fontFamily: "var(--font-body)",
            fontWeight: 300,
          }}
        >
          J&rsquo;ai appliqu&eacute; &agrave; la lettre. Chez <strong style={{ color: "var(--text)", fontWeight: 500 }}>Lime</strong>, j&rsquo;ai int&eacute;gr&eacute; l&rsquo;IA dans les op&eacute;rations, la prospection, les partenariats. J&rsquo;ai scal&eacute; les swap stations, gagn&eacute; des appels d&rsquo;offres &agrave; Bruxelles et Lille, form&eacute; les &eacute;quipes de Londres.
        </p>

        <p
          className="fade-in mb-8"
          style={{
            color: "var(--text-muted)",
            fontSize: "17px",
            lineHeight: 1.9,
            fontFamily: "var(--font-body)",
            fontWeight: 300,
          }}
        >
          Puis <strong style={{ color: "var(--text)", fontWeight: 500 }}>Arkel</strong> &mdash; parmi les meilleurs en automatisation IA. Je leur ai ramen&eacute; Groupe Seb, Nestl&eacute;, Carte Noire, Altaria, la SNCF. De l&rsquo;acquisition au closing, jusqu&rsquo;&agrave; la gestion de projet.
        </p>

        <p
          className="fade-in mb-8"
          style={{
            color: "var(--text-muted)",
            fontSize: "17px",
            lineHeight: 1.9,
            fontFamily: "var(--font-body)",
            fontWeight: 300,
          }}
        >
          Au bout de deux ans, j&rsquo;avais tous les &eacute;l&eacute;ments. Le r&eacute;seau, la m&eacute;thode, les partenaires. <strong style={{ color: "var(--text)", fontWeight: 500 }}>J&rsquo;ai lanc&eacute; Parrit.ai.</strong>
        </p>
      </div>
    </section>
  );
}

/* ─── SECTION 3: THE INSIGHT ─── */
function Insight() {
  return (
    <section
      id="section-insight"
      className="px-6 py-16 md:py-24 max-w-[640px] mx-auto text-center"
    >
      <p
        className="fade-in"
        style={{
          fontFamily: "var(--font-heading)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(20px, 2.5vw, 28px)",
          lineHeight: 1.8,
          color: "var(--accent)",
        }}
      >
        &laquo;&nbsp;Le plus important, ce n&rsquo;est pas la technologie. C&rsquo;est la compr&eacute;hension de l&rsquo;humain.&nbsp;&raquo;
      </p>
    </section>
  );
}

/* ─── SECTION 4: PROOF BY EXAMPLE ─── */
function Proof() {
  return (
    <section
      id="section-proof"
      className="px-6 py-16 md:py-24"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-[680px] mx-auto">
        <p
          className="fade-in uppercase text-xs font-medium mb-10"
          style={{
            color: "var(--accent)",
            letterSpacing: "0.15em",
            fontFamily: "var(--font-body)",
          }}
        >
          LA PREUVE
        </p>

        {/* Story 1 */}
        <p
          className="fade-in mb-8"
          style={{
            color: "var(--text-muted)",
            fontSize: "17px",
            lineHeight: 1.9,
            fontFamily: "var(--font-body)",
            fontWeight: 300,
          }}
        >
          <strong style={{ color: "var(--text)", fontWeight: 500 }}>110 restaurants. 40 ouvertures pr&eacute;vues cette ann&eacute;e.</strong> La fondatrice passait des semaines sur chaque ouverture &mdash; juridique, op&eacute;rations, demandes mairie, le tout suivi sur des tableurs.
        </p>

        <p
          className="fade-in mb-8"
          style={{
            color: "var(--text-muted)",
            fontSize: "17px",
            lineHeight: 1.9,
            fontFamily: "var(--font-body)",
            fontWeight: 300,
          }}
        >
          J&rsquo;ai d&eacute;ploy&eacute; un syst&egrave;me de suivi dynamique avec notifications automatiques. Le temps d&rsquo;ouverture a &eacute;t&eacute; r&eacute;duit de 75%.
        </p>

        {/* Copper divider */}
        <div className="fade-in py-8 flex justify-start">
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "var(--accent)",
            }}
          />
        </div>

        {/* Story 2 */}
        <p
          className="fade-in mb-8"
          style={{
            color: "var(--text-muted)",
            fontSize: "17px",
            lineHeight: 1.9,
            fontFamily: "var(--font-body)",
            fontWeight: 300,
          }}
        >
          <strong style={{ color: "var(--text)", fontWeight: 500 }}>Une fondatrice dans l&rsquo;import-export.</strong> Trois heures par jour &agrave; trier ses emails &mdash; demandes de prix, catalogues, fournisseurs, r&eacute;ponses. Trois heures perdues.
        </p>

        <p
          className="fade-in mb-8"
          style={{
            color: "var(--text-muted)",
            fontSize: "17px",
            lineHeight: 1.9,
            fontFamily: "var(--font-body)",
            fontWeight: 300,
          }}
        >
          Connexion aux outils existants, tri automatique, g&eacute;n&eacute;ration de brouillons, to-do list intelligente. <strong style={{ color: "var(--text)", fontWeight: 500 }}>80% du temps r&eacute;cup&eacute;r&eacute;.</strong> Deux heures trente lib&eacute;r&eacute;es chaque jour.
        </p>
      </div>
    </section>
  );
}

/* ─── SECTION 5: DOMAINS ─── */
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

/* ─── SECTION 6: SOCIAL PROOF ─── */
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
        className="fade-in cta-button-dark mb-8"
        data-ph="final-cta"
        onClick={trackCtaClick}
      >
        Planifier un entretien
      </a>

      <p className="fade-in mb-24" style={{ fontSize: "14px", letterSpacing: "0.04em" }}>
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

/* ─── DIVIDER ─── */
function Divider() {
  return (
    <div className="py-12">
      <div className="divider" />
    </div>
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
      <Divider />
      <Insight />
      <Divider />
      <Proof />
      <Divider />
      <Domains />
      <Divider />
      <SocialProof />
      <DarkCTA />
    </>
  );
}
