"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
      referrer: typeof document !== "undefined" ? document.referrer : "",
      url: typeof window !== "undefined" ? window.location.href : "",
      timestamp: new Date().toISOString(),
      page: "landing",
    }),
  }).catch(() => {});
}

/* ─── Shared animation variants ─── */
const fadeUp: Record<string, any> = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay: i * 0.12 },
  }),
};

const stagger: Record<string, any> = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardReveal: Record<string, any> = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

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
        Diagnostic gratuit
      </a>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 1 — HERO (light background)
   ═══════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="hero-section">
      <motion.span
        className="hero-logo-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -5, 0] }}
        transition={{
          opacity: { duration: 0.7, ease: "easeOut", delay: 0.15 },
          y: { duration: 4, ease: "easeInOut", repeat: Infinity, delay: 0.9 },
        }}
      >
        PARRIT.AI
      </motion.span>

      <motion.h1
        className="hero-title"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        Solutions d&rsquo;automatisation
        <br />
        intelligente pour les entreprises
      </motion.h1>

      <motion.p
        className="hero-subtitle"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        Votre entreprise, avec deux fois moins de t&acirc;ches r&eacute;p&eacute;titives
        d&egrave;s aujourd&rsquo;hui.
      </motion.p>

      <motion.p
        className="hero-tagline"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        Automatisation des processus par IA &middot; Laissez votre &eacute;quipe se concentrer sur ce qui compte vraiment.
      </motion.p>

      <motion.a
        href={CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-ph="hero-cta"
        onClick={trackCtaClick}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={4}
      >
        <ButtonColorful label="R&eacute;servez votre diagnostic" className="h-14 px-8 text-base" />
      </motion.a>

      <motion.div
        className="features-row"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={5}
      >
        <span>Automatisation</span>
        <span className="copper-dot" />
        <span>CRM</span>
        <span className="copper-dot" />
        <span>Agents IA</span>
        <span className="copper-dot" />
        <span>SAP</span>
        <span className="copper-dot" />
        <span>Processus</span>
      </motion.div>

      <motion.p
        className="hero-geo"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={6}
      >
        Entreprise fran&ccedil;aise &middot; Au service des march&eacute;s chinois et international
      </motion.p>

      <motion.div
        className="scroll-hint"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={7}
      >
        <div className="scroll-chevron" />
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 2 — PAIN POINTS (dark background)
   ═══════════════════════════════════════════════════════════ */
const painPoints = [
  {
    title: "Saisie manuelle des documents",
    desc: "Factures, rapports, contrats saisis un \u00e0 un \u00e0 la main \u2014 erreurs et reprises in\u00e9vitables.",
  },
  {
    title: "Suivi de projet via messagerie",
    desc: "Un message manqu\u00e9 peut bloquer tout un projet.",
  },
  {
    title: "Consolidation de donn\u00e9es par copier-coller",
    desc: "Agr\u00e9gation manuelle entre syst\u00e8mes \u2014 une demi-journ\u00e9e pour produire un seul rapport.",
  },
  {
    title: "Validations r\u00e9p\u00e9titives \u00e9puisantes",
    desc: "M\u00eames processus recommenc\u00e9s \u00e0 chaque fois, sans visibilit\u00e9 sur l\u2019avancement.",
  },
];

function PainPoints() {
  return (
    <section className="dark-section">
      <div className="section-inner">
        <motion.p
          className="section-label-dark"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          Le constat
        </motion.p>
        <motion.h2
          className="dark-section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Avez-vous ces probl&egrave;mes&nbsp;?
        </motion.h2>

        <motion.div
          className="pain-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {painPoints.map((p) => (
            <motion.div key={p.title} className="pain-card" variants={cardReveal}>
              <h3 className="pain-card-title">{p.title}</h3>
              <p className="pain-card-desc">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="pain-bottom-line"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Ces t&acirc;ches, l&rsquo;IA peut les faire &agrave; votre place.
          <br />
          Votre &eacute;quipe m&eacute;rite de se concentrer sur l&rsquo;essentiel.
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 3 — SERVICES (dark background)
   ═══════════════════════════════════════════════════════════ */
const services = [
  {
    icon: "\uD83D\uDCCA",
    title: "CRM sur mesure + Assistant IA commercial",
    desc: "Gestion unifi\u00e9e des clients et opportunit\u00e9s. Consultation directe via WhatsApp.",
  },
  {
    icon: "\u2699\uFE0F",
    title: "Assistant intelligent SAP",
    desc: "Op\u00e9rez SAP en langage naturel. R\u00e9duisez la d\u00e9pendance aux consultants.",
  },
  {
    icon: "\uD83D\uDCC4",
    title: "Automatisation intelligente des documents",
    desc: "Reconnaissance et saisie automatiques des factures et contrats. 30 secondes \u2014 10\u00D7 plus rapide.",
  },
  {
    icon: "\uD83D\uDD04",
    title: "Solution d\u2019automatisation des processus sur mesure",
    desc: "Validation et suivi 100% automatis\u00e9s. Alertes automatiques, z\u00e9ro oubli.",
  },
];

function Services() {
  return (
    <section className="dark-section">
      <div className="section-inner">
        <motion.p
          className="section-label-dark"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          Nos solutions
        </motion.p>
        <motion.h2
          className="dark-section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Nos quatre services cl&eacute;s
        </motion.h2>

        <motion.div
          className="services-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {services.map((s) => (
            <motion.div key={s.title} className="service-card" variants={cardReveal}>
              <div className="service-icon">{s.icon}</div>
              <h3 className="service-card-title">{s.title}</h3>
              <p className="service-card-desc">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 4 — CASE STUDIES (dark background)
   ═══════════════════════════════════════════════════════════ */
const cases = [
  {
    badge: "CAS R\u00c9EL \u00B7 RESTAURATION \u00B7 DUBA\u00CF",
    title: "10+ \u00e9tapes d\u2019ouverture enti\u00e8rement g\u00e9r\u00e9es automatiquement",
    subtitle: "Enseigne de restauration en forte croissance \u00b7 Duba\u00ef",
    before:
      "Gestion par e-mails et m\u00e9moire individuelle, \u00e9tapes r\u00e9guli\u00e8rement oubli\u00e9es. Documents manquants, processus bloqu\u00e9s.",
    after:
      "Rappels de t\u00e2ches automatiques par r\u00f4le, syst\u00e8me d\u2019alerte \u00e0 trois niveaux. Avancement visible en temps r\u00e9el, z\u00e9ro oubli.",
    stats: [
      { value: "75%", label: "R\u00e9duction du d\u00e9lai" },
      { value: "0", label: "Documents oubli\u00e9s" },
    ],
  },
  {
    badge: "CAS R\u00c9EL \u00B7 FORMATION PROFESSIONNELLE",
    title: "16 antennes r\u00e9gionales \u00b7 Consolidation de donn\u00e9es",
    subtitle: "Organisme de formation \u00b7 16 agences en France",
    before:
      "16 agences envoyaient chacune leurs Excel + PDF, consolidation 100% manuelle, 2 \u00e0 4 jours par cycle.",
    after:
      "Le syst\u00e8me agr\u00e8ge automatiquement les 16 sources, v\u00e9rifie et g\u00e9n\u00e8re le tableau r\u00e9capitulatif, anomalies alert\u00e9es automatiquement.",
    stats: [
      { value: "2\u20134j", label: "R\u00e9duit \u00e0 quelques minutes" },
      { value: "16", label: "Sources automatis\u00e9es" },
    ],
  },
  {
    badge: "CAS R\u00c9EL \u00B7 INDUSTRIE TEXTILE",
    title: "30 factures fournisseurs par jour, trait\u00e9es en 30 secondes",
    subtitle: "Entreprise textile \u00b7 Traitement de factures",
    before:
      "30 factures fournisseurs par jour, 30 minutes de traitement manuel chacune.",
    after:
      "Extraction automatique depuis e-mail \u2192 saisie automatique \u2192 validation humaine finale. 30 min \u2192 30 sec.",
    stats: [
      { value: "60\u00D7", label: "Plus rapide" },
      { value: "30s", label: "Par facture" },
    ],
  },
];

function CaseStudies() {
  return (
    <section className="dark-section">
      <div className="section-inner">
        <motion.p
          className="section-label-dark"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          R&eacute;sultats
        </motion.p>
        <motion.h2
          className="dark-section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Cas r&eacute;els, r&eacute;sultats mesurables
        </motion.h2>

        <div className="cases-list">
          {cases.map((c, idx) => (
            <motion.div
              key={idx}
              className="case-block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: idx * 0.1 }}
            >
              <span className="case-badge">{c.badge}</span>
              <h3 className="case-title">{c.title}</h3>
              <p className="case-subtitle">{c.subtitle}</p>

              <div className="case-columns">
                <div className="case-col">
                  <span className="case-col-label">Avant</span>
                  <p className="case-col-text">{c.before}</p>
                </div>
                <div className="case-col">
                  <span className="case-col-label case-col-label--after">Apr&egrave;s</span>
                  <p className="case-col-text">{c.after}</p>
                </div>
              </div>

              <div className="case-stats">
                {c.stats.map((s, si) => (
                  <div key={si} className="case-stat">
                    <span className="case-stat-value">{s.value}</span>
                    <span className="case-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 5 — TEAM (light background)
   ═══════════════════════════════════════════════════════════ */
function Team() {
  return (
    <section className="light-section">
      <div className="section-inner">
        <motion.p
          className="section-label text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          &Eacute;quipe
        </motion.p>
        <motion.h2
          className="light-section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Qui sommes-nous&nbsp;?
        </motion.h2>
        <motion.p
          className="team-intro"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          Experts en automatisation IA qui comprennent votre m&eacute;tier.
          <br />
          Entreprise fran&ccedil;aise, plus de dix ans d&rsquo;exp&eacute;rience dans les grandes entreprises.
        </motion.p>

        <motion.div
          className="team-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div className="team-card" variants={cardReveal}>
            <h3 className="team-name">Yukun Leng</h3>
            <p className="team-role">Co-fondateur</p>
            <p className="team-bio">
              Consultant SAP &middot; 10 ans MM/SD/FI &middot; Ex-consultant international chez LVMH, Jabil.
              Ma&icirc;trise des pratiques professionnelles franco-chinoises.
              Sp&eacute;cialit&eacute;&nbsp;: supply chain / optimisation des processus.
              Responsable march&eacute; Chine.
            </p>
          </motion.div>

          <motion.div className="team-card" variants={cardReveal}>
            <h3 className="team-name">Paul Larmaraud</h3>
            <p className="team-role">Co-fondateur</p>
            <p className="team-bio">
              Ing&eacute;nieur IA &middot; 3+ ans de d&eacute;ploiement IA en entreprise.
              Exp&eacute;rience dans le nucl&eacute;aire, la grande distribution et les RH.
              Ex-&eacute;quipe op&eacute;rations mondiales Lime.
              &laquo;&nbsp;From idea &rarr; agent &rarr; adoption. Fast.&nbsp;&raquo;
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 6 — CTA + FOOTER (light background)
   ═══════════════════════════════════════════════════════════ */
function CtaFooter() {
  return (
    <section className="cta-section">
      <motion.h2
        className="cta-title"
        initial={{ opacity: 0, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        R&eacute;servez votre diagnostic
      </motion.h2>

      <motion.p
        className="cta-sub"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        Un appel de 30 minutes pour identifier vos gains imm&eacute;diats.
      </motion.p>

      <motion.a
        href={CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-ph="final-cta"
        onClick={trackCtaClick}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
      >
        <ButtonColorful label="R&eacute;servez votre diagnostic" className="h-14 px-8 text-base" />
      </motion.a>

      <motion.p
        className="cta-email"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <a href="mailto:paul@parrit.ai">paul@parrit.ai</a>
      </motion.p>

      <p className="footer-legal">
        &copy; 2026 SASU PARRIT.AI &middot; Rueil-Malmaison &middot; France
      </p>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Home() {
  useScrollFade();

  return (
    <>
      <Nav />
      <Hero />
      <PainPoints />
      <Services />
      <CaseStudies />
      <Team />
      <CtaFooter />
    </>
  );
}
