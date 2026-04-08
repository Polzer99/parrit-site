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

/* ─── EDITORIAL DIVIDER ─── */
function EditorialDivider() {
  return <hr className="editorial-divider" />;
}

/* ─── SECTION 1: HERO (min-h-screen, centered, nothing else) ─── */
function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-[72px]">
      <h1
        className="hero-animate hero-delay-2 text-center leading-[1.15] mb-6"
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 500,
          fontSize: "clamp(42px, 5vw, 58px)",
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
          fontSize: "17px",
          fontWeight: 300,
          maxWidth: "440px",
          lineHeight: 1.75,
          fontFamily: "var(--font-body)",
          textAlign: "justify",
          textAlignLast: "center",
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
        className="hero-animate hero-delay-5 mt-10"
        style={{
          color: "var(--text-dim)",
          fontSize: "11px",
          letterSpacing: "0.15em",
          fontWeight: 500,
          textTransform: "uppercase" as const,
        }}
      >
        Paris &middot; Duba&iuml; &middot; Shanghai
      </p>
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
          Tout a commenc&eacute; par un d&eacute;jeuner &agrave; <strong>Palo Alto</strong>. Un ancien de Mint, devenu Venture Capitalist, m&rsquo;a dit une phrase qui a tout chang&eacute; : &laquo;&nbsp;Investis ton temps dans le produit et l&rsquo;intelligence artificielle.&nbsp;&raquo;
        </p>

        <p className="fade-in">
          J&rsquo;ai appliqu&eacute; &agrave; la lettre. Chez <strong>Lime</strong>, j&rsquo;ai int&eacute;gr&eacute; l&rsquo;IA dans les op&eacute;rations, la prospection, les partenariats. J&rsquo;ai scal&eacute; les swap stations, gagn&eacute; des appels d&rsquo;offres &agrave; Bruxelles et Lille, form&eacute; les &eacute;quipes de Londres &mdash; le march&eacute; num&eacute;ro un de Lime.
        </p>

        <p className="fade-in">
          Puis <strong>Arkel</strong> &mdash; parmi les meilleurs en automatisation IA en France. Je leur ai ramen&eacute; le <strong>Groupe Seb</strong>, <strong>Nestl&eacute;</strong>, <strong>Carte Noire</strong>, <strong>Altaria</strong>, la <strong>SNCF</strong>. De l&rsquo;acquisition au closing, jusqu&rsquo;&agrave; la gestion de projet.
        </p>

        <p className="fade-in">
          C&rsquo;est l&agrave; que j&rsquo;ai rencontr&eacute; <strong>Yukun</strong>. Dix ans d&rsquo;exp&eacute;rience SAP chez les grands groupes de luxe, consultante en gestion des flux, une expertise supply chain forg&eacute;e entre la France et la Chine. Un profil radicalement diff&eacute;rent du mien &mdash; et c&rsquo;est exactement ce qu&rsquo;il fallait.
        </p>

        <p className="fade-in">
          Au bout de deux ans, nous avions tous les &eacute;l&eacute;ments. Le r&eacute;seau, la m&eacute;thode, les partenaires experts. <strong>Nous avons lanc&eacute; Parrit.ai.</strong>
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

        {/* Story 1 */}
        <p className="fade-in">
          <strong>Cent dix restaurants. Quarante ouvertures pr&eacute;vues cette ann&eacute;e.</strong> Une fondatrice qui passait des semaines sur chaque ouverture &mdash; juridique, op&eacute;rations, demandes de mairie, le tout suivi sur des tableurs et des messages.
        </p>

        <p className="fade-in">
          Nous avons d&eacute;ploy&eacute; un syst&egrave;me de suivi dynamique avec notifications automatiques par r&ocirc;le. Chaque &eacute;tape trac&eacute;e, chaque retard d&eacute;tect&eacute;, chaque document v&eacute;rifi&eacute;. Le temps d&rsquo;ouverture a &eacute;t&eacute; r&eacute;duit de soixante-quinze pour cent.
        </p>

        {/* Thin copper divider between stories */}
        <div className="fade-in flex justify-center" style={{ padding: "40px 0" }}>
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "var(--accent)",
            }}
          />
        </div>

        {/* Story 2 */}
        <p className="fade-in">
          <strong>Une fondatrice dans l&rsquo;import-export.</strong> Trois heures par jour &agrave; trier ses emails &mdash; demandes de prix, catalogues, fournisseurs, r&eacute;ponses de toutes parts.
        </p>

        <p className="fade-in">
          Connexion aux outils existants, tri automatique, g&eacute;n&eacute;ration de brouillons, to-do list intelligente. Quatre-vingts pour cent du temps r&eacute;cup&eacute;r&eacute;. Deux heures trente lib&eacute;r&eacute;es chaque jour pour ce qui compte vraiment.
        </p>
      </div>
    </section>
  );
}

/* ─── SECTION 5: DOMAINES (centered, copper dots) ─── */
function Domains() {
  const domains = [
    "Automatisation documentaire",
    "CRM sur mesure",
    "Agents conversationnels",
    "Optimisation des processus",
    "Int\u00e9gration SAP",
  ];

  return (
    <section className="section-space px-6 text-center">
      <p className="fade-in section-label" style={{ textAlign: "center" }}>
        Domaines d&rsquo;intervention
      </p>
      <div
        className="fade-in flex flex-wrap items-center justify-center gap-x-3 gap-y-3"
        style={{ maxWidth: "680px", margin: "0 auto" }}
      >
        {domains.map((d, i) => (
          <span key={i} className="flex items-center gap-3">
            {i > 0 && <span className="copper-dot" />}
            <span
              style={{
                color: "var(--text-muted)",
                fontSize: "15px",
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

/* ─── SECTION 6: REFERENCES (centered, ultra small) ─── */
function References() {
  return (
    <section className="px-6 py-12 text-center">
      <p
        className="fade-in"
        style={{
          color: "var(--text-dim)",
          fontSize: "11px",
          letterSpacing: "0.15em",
          fontWeight: 500,
          textTransform: "uppercase" as const,
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

/* ─── PAGE ─── */
export default function Home() {
  useScrollFade();

  return (
    <>
      <Nav />
      <Hero />
      <EditorialDivider />
      <Origin />
      <EditorialDivider />
      <Insight />
      <EditorialDivider />
      <Proof />
      <EditorialDivider />
      <Domains />
      <EditorialDivider />
      <References />
      <DarkCTA />
    </>
  );
}
