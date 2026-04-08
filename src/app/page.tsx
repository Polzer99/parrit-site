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

      {/* Body prose */}
      <p
        className="hero-animate hero-delay-5"
        style={{
          color: "var(--text-muted)",
          fontSize: "17px",
          fontWeight: 300,
          maxWidth: "680px",
          lineHeight: 1.85,
          fontFamily: "var(--font-body)",
          textAlign: "justify",
          textAlignLast: "center",
          marginBottom: "40px",
        }}
      >
        Je ne produis pas de slides. Je ne vends pas de formations.
        J&rsquo;entre dans une entreprise, je comprends ses m&eacute;canismes,
        et je d&eacute;ploie de l&rsquo;intelligence artificielle qui change
        concr&egrave;tement la vitesse d&rsquo;ex&eacute;cution. En semaines, pas en mois.
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
        className="hero-animate hero-delay-7 cta-button"
        data-ph="hero-cta"
        onClick={trackCtaClick}
      >
        Planifier un entretien
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
          Un d&eacute;jeuner &agrave; <strong>Palo Alto</strong> a pos&eacute; la premi&egrave;re pierre. Face &agrave; moi, un ancien cadre de Mint devenu investisseur. Une seule recommandation, formul&eacute;e avec la clart&eacute; de ceux qui voient loin&nbsp;: &laquo;&nbsp;Consacre-toi au produit et &agrave; l&rsquo;intelligence artificielle.&nbsp;&raquo;
        </p>

        <p className="fade-in">
          Les ann&eacute;es qui ont suivi ont &eacute;t&eacute; une immersion totale. Chez <strong>Lime</strong>, j&rsquo;ai d&eacute;ploy&eacute; l&rsquo;IA au c&oelig;ur des op&eacute;rations&nbsp;: prospection par apprentissage automatique, partenariats strat&eacute;giques, appels d&rsquo;offres remport&eacute;s &agrave; Bruxelles et Lille, formation des &eacute;quipes londoniennes sur le plus grand march&eacute; de l&rsquo;entreprise.
        </p>

        <p className="fade-in">
          Puis est venu <strong>Arkel</strong>&nbsp;&mdash; r&eacute;f&eacute;rence fran&ccedil;aise en automatisation intelligente. J&rsquo;y ai conduit l&rsquo;acquisition de comptes d&rsquo;envergure&nbsp;: <strong>Groupe Seb</strong>, <strong>Nestl&eacute;</strong>, <strong>Carte Noire</strong>, <strong>Altaria</strong>, la <strong>SNCF</strong>. De la premi&egrave;re prise de contact jusqu&rsquo;&agrave; la livraison en production.
        </p>

        <p className="fade-in">
          C&rsquo;est dans ce parcours que <strong>Yukun</strong> est entr&eacute;e dans l&rsquo;&eacute;quation. Consultante SAP depuis dix ans au sein des maisons de luxe europ&eacute;ennes, sp&eacute;cialiste de la gestion des flux et de la supply chain entre la France et la Chine. Sa rigueur op&eacute;rationnelle compl&egrave;te exactement l&rsquo;approche terrain qui d&eacute;finit Parrit.ai.
        </p>

        <p className="fade-in">
          Deux ann&eacute;es de pratique, un r&eacute;seau de partenaires experts, une m&eacute;thode &eacute;prouv&eacute;e. <strong>Parrit.ai est n&eacute; de cette convergence.</strong>
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
          Une enseigne de restauration en pleine expansion&nbsp;: <strong>cent dix &eacute;tablissements, quarante ouvertures programm&eacute;es</strong> sur l&rsquo;ann&eacute;e. Chaque nouvelle franchise mobilisait des semaines enti&egrave;res&nbsp;&mdash; suivi juridique, coordination op&eacute;rationnelle, &eacute;changes avec les municipalit&eacute;s, le tout dispers&eacute; entre tableurs et messageries.
        </p>

        <p className="fade-in">
          Un syst&egrave;me de pilotage a &eacute;t&eacute; con&ccedil;u sur mesure&nbsp;: chaque &eacute;tape trac&eacute;e, chaque &eacute;ch&eacute;ance surveill&eacute;e, chaque document contr&ocirc;l&eacute; automatiquement. Le d&eacute;lai d&rsquo;ouverture a &eacute;t&eacute; divis&eacute; par quatre.
        </p>

        <div className="fade-in flex justify-center" style={{ padding: "40px 0" }}>
          <div style={{ width: "40px", height: "1px", background: "var(--accent)" }} />
        </div>

        <p className="fade-in">
          Une dirigeante dans le n&eacute;goce international consacrait <strong>trois heures chaque jour</strong> au traitement de sa correspondance&nbsp;: demandes tarifaires, catalogues, relances fournisseurs, confirmations de commandes.
        </p>

        <p className="fade-in">
          Ses outils ont &eacute;t&eacute; interconnect&eacute;s, le tri automatis&eacute;, les r&eacute;ponses pr&eacute;-r&eacute;dig&eacute;es. Il ne reste qu&rsquo;une validation finale. R&eacute;sultat&nbsp;: deux heures trente restitu&eacute;es quotidiennement &agrave; la direction strat&eacute;gique de son entreprise.
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
        className="fade-in cta-button-dark mb-8"
        data-ph="final-cta"
        onClick={trackCtaClick}
      >
        Planifier un entretien
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
      <EditorialDivider />
      <Insight />
      <EditorialDivider />
      <Proof />
      <EditorialDivider />
      <DarkCTA />
    </>
  );
}
