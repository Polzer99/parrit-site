"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useScrollFade } from "@/components/hooks";
import { ButtonColorful } from "@/components/ui/button-colorful";

const CALENDAR_URL = "https://calendar.app.google/nWa2QQe8DUwtuwbz8";
const WEBHOOK_URL =
  "https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead";

/* ─── UTM parameter extraction ─── */
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

function trackCtaClick(label?: string) {
  fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: "parrit.ai",
      action: "cta_click",
      cta_label: label || "unknown",
      referrer: typeof document !== "undefined" ? document.referrer : "",
      url: typeof window !== "undefined" ? window.location.href : "",
      timestamp: new Date().toISOString(),
      page: "landing",
      ...getUtmParams(),
    }),
  }).catch(() => {});
}

/* ─── Scroll depth + time-on-page tracking ─── */
function useEngagementTracking() {
  const firedRef = useRef<Set<number>>(new Set());
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    const thresholds = [25, 50, 75, 100];

    function handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const pct = Math.round((window.scrollY / scrollHeight) * 100);

      thresholds.forEach((t) => {
        if (pct >= t && !firedRef.current.has(t)) {
          firedRef.current.add(t);
          if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).posthog) {
            ((window as unknown as Record<string, unknown>).posthog as { capture: (e: string, p: Record<string, unknown>) => void }).capture("scroll_depth", { depth: t });
          }
        }
      });
    }

    function handleBeforeUnload() {
      const seconds = Math.round((Date.now() - startTime.current) / 1000);
      if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).posthog) {
        ((window as unknown as Record<string, unknown>).posthog as { capture: (e: string, p: Record<string, unknown>) => void }).capture("time_on_page", {
          seconds,
          max_scroll: Math.max(...Array.from(firedRef.current), 0),
        });
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
}

/* ─── Shared animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay: i * 0.12 },
  }),
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const cardReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

/* ─── NAV ─── */
function Nav() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleScroll() {
      if (navRef.current) {
        if (window.scrollY > 20) {
          navRef.current.classList.add("scrolled");
        } else {
          navRef.current.classList.remove("scrolled");
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav ref={navRef} className="nav">
      {/* nav logo removed */}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO (parchment bg, centered)
   ═══════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="hero-section">
      {/* Exponential curve — behind hero content */}
      <svg
        className="hero-curve"
        preserveAspectRatio="none"
        viewBox="0 0 1200 600"
        fill="none"
      >
        <motion.path
          d="M0 580 Q150 575 300 560 T500 500 T650 400 T780 260 T900 100 T1050 -80 T1200 -300"
          stroke="#c8956c"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.15, 0.15, 0] }}
          transition={{ duration: 8, times: [0, 0.5, 0.75, 1], repeat: Infinity, repeatDelay: 2, ease: "easeOut" }}
        />
        <motion.path
          d="M0 580 Q150 575 300 560 T500 500 T650 400 T780 260 T900 100 T1050 -80 T1200 -300 V600 H0 Z"
          fill="url(#curveGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.06, 0.06, 0] }}
          transition={{ duration: 8, times: [0, 0.5, 0.75, 1], repeat: Infinity, repeatDelay: 2 }}
        />
        <defs>
          <linearGradient id="curveGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8956c" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      <div className="hero-content">
        <motion.span
          className="hero-logo-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
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
          Votre partenaire <em className="hero-accent">exponentiel.</em>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          Nous concevons et d&eacute;ployons des solutions sur mesure qui acc&eacute;l&egrave;rent durablement votre croissance.
        </motion.p>

        <motion.div
          className="hero-cta-block"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <a
            href={CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-ph="hero-cta"
            onClick={() => trackCtaClick("hero")}
            className="hero-cta-link"
          >
            <ButtonColorful label="R&eacute;servez votre diagnostic" className="h-14 px-8 text-base" />
          </a>
          <p className="cta-micro">15 minutes &middot; Sans engagement &middot; Partenaire longue dur&eacute;e</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   VISUAL SHOWCASE (dark bg)
   ═══════════════════════════════════════════════════════════ */
const showcaseItems = [
  { src: "/demo-agents.jpg", label: "Prototypage sur mesure" },
  { src: "/demo-crm.jpg", label: "Outils m\u00e9tier d\u00e9di\u00e9s" },
  { src: "/demo-automation.jpg", label: "Automatisation des processus" },
  { src: "/demo-whatsapp.jpg", label: "Coaching & formation IA" },
];

function VisualShowcase() {
  return (
    <section className="dark-section">
      <div className="section-inner">
        <motion.h2
          className="dark-section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Notre savoir-faire
        </motion.h2>

        <div className="showcase-grid">
          {showcaseItems.map((item, i) => (
            <motion.div
              key={item.src}
              className="showcase-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.12 }}
            >
              <div className="showcase-img-wrapper">
                <Image
                  src={item.src}
                  alt={item.label}
                  width={600}
                  height={400}
                  className="showcase-img"
                  loading="lazy"
                  quality={80}
                />
              </div>
              <span className="showcase-label">{item.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mid-cta-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" data-ph="mid-cta" onClick={() => trackCtaClick("mid-showcase")}>
            <ButtonColorful label="Discutons de votre cas" className="h-12 px-6 text-sm" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   NOTRE APPROCHE (light bg) — expert network + prototypage
   ═══════════════════════════════════════════════════════════ */
function Approach() {
  return (
    <section style={{ background: "var(--bg)", padding: "80px 24px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" as const }}>
        <motion.h2
          style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(28px, 4vw, 38px)", color: "var(--text)", marginBottom: "24px" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Notre approche
        </motion.h2>
        <motion.p
          style={{ fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.8, color: "var(--text-muted)", marginBottom: "48px", fontWeight: 300 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Nous ne vendons pas de formations g&eacute;n&eacute;riques. Nous construisons avec vous.
          Prototype fonctionnel en quelques jours, it&eacute;rations en temps r&eacute;el, mise en production rapide.
          Un r&eacute;seau de plus de vingt experts &mdash; techniques et m&eacute;tier &mdash; mobilisables selon vos besoins.
        </motion.p>

        <div style={{ display: "flex", flexWrap: "wrap" as const, justifyContent: "center", gap: "32px" }}>
          {[
            { title: "Prototypage rapide", desc: "De l\u2019id\u00e9e au prototype test\u00e9 en quelques jours" },
            { title: "R\u00e9seau d\u2019experts", desc: "20+ sp\u00e9cialistes techniques et m\u00e9tier \u00e0 disposition" },
            { title: "Coaching IA", desc: "Masterclasses et ateliers pratiques pour vos \u00e9quipes" },
            { title: "Mise en production", desc: "D\u00e9ploiement, maintenance et am\u00e9lioration continue" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              style={{ flex: "1 1 160px", maxWidth: "200px", textAlign: "center" as const }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 500, color: "var(--text)", marginBottom: "8px" }}>{item.title}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.6 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CASE STUDIES (dark bg) — simple before/after
   ═══════════════════════════════════════════════════════════ */
const cases = [
  {
    badge: "PROCESSUS",
    title: "Ouvertures et lancements",
    before: "Des semaines de retard",
    after: "Chaque \u00e9tape pilot\u00e9e automatiquement",
  },
  {
    badge: "DONN\u00c9ES",
    title: "Rapports et consolidation",
    before: "Des jours de travail manuel",
    after: "G\u00e9n\u00e9r\u00e9s en un clic",
  },
  {
    badge: "QUOTIDIEN",
    title: "Emails et documents",
    before: "Des heures perdues chaque jour",
    after: "Tri\u00e9s et trait\u00e9s automatiquement",
  },
];

function CaseStudyCard({ c, index }: { c: typeof cases[number]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="case-block"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.1 }}
    >
      <span className="case-badge">{c.badge}</span>
      <h3 className="case-title">{c.title}</h3>
      <div className="case-ba-row">
        <motion.div
          className="case-ba-before"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="case-ba-label">Avant</span>
          <span className="case-ba-value-before">{c.before}</span>
        </motion.div>
        <motion.div
          className="case-ba-after"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span className="case-ba-label case-ba-label--after">Apr&egrave;s</span>
          <span className="case-ba-value-after">{c.after}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function CaseStudies() {
  return (
    <section className="dark-section">
      <div className="section-inner">
        <motion.h2
          className="dark-section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          R&eacute;sultats
        </motion.h2>

        <div className="cases-list">
          {cases.map((c, idx) => (
            <CaseStudyCard key={idx} c={c} index={idx} />
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{ textAlign: "center", marginTop: "48px", fontSize: "14px", color: "var(--text-light-muted)", fontStyle: "italic", fontFamily: "var(--font-heading)" }}
        >
          Restauration, formation, industrie, n&eacute;goce, services&hellip; Chaque secteur a ses frictions. Nous les identifions et les supprimons.
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHAREABLE QUOTE (dark bg)
   ═══════════════════════════════════════════════════════════ */
function ShareableQuote() {
  return (
    <section className="quote-section" data-ph="shareable-quote">
      <motion.blockquote
        className="shareable-quote"
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="quote-text">
          &laquo;&nbsp;L&rsquo;IA ne remplace pas vos &eacute;quipes. Elle leur rend les heures que la bureaucratie leur vole.&nbsp;&raquo;
        </p>
        <cite className="quote-cite">&mdash; Paul Larmaraud, Parrit.ai</cite>
      </motion.blockquote>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOUNDERS (parchment bg)
   ═══════════════════════════════════════════════════════════ */
function Founders() {
  return (
    <section className="light-section">
      <div className="section-inner">
        <motion.h2
          className="light-section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Qui sommes-nous
        </motion.h2>

        <motion.div
          className="team-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div className="team-card team-card-premium" variants={cardReveal}>
            <img src="/stamp-paul.png" alt="" className="team-stamp" />
            <h3 className="team-name">Paul Larmaraud</h3>
            <p className="team-role">Co-fondateur</p>
            <p className="team-bio">
              Vision produit et approche terrain. Ex-&eacute;quipe op&eacute;rations mondiales Lime.
              A conduit l&rsquo;acquisition de Groupe Seb, Nestl&eacute;, Carte Noire, SNCF chez Arkel.
            </p>
            <p className="team-signature">Produit &middot; Op&eacute;rations &middot; Acquisition</p>
          </motion.div>

          <motion.div className="team-card team-card-premium" variants={cardReveal}>
            <img src="/stamp-yukun.png" alt="" className="team-stamp" />
            <h3 className="team-name">Yukun Leng</h3>
            <p className="team-role">Co-fondatrice</p>
            <p className="team-bio">
              Dix ans au c&oelig;ur des maisons de luxe europ&eacute;ennes, dont LVMH.
              Experte supply chain et optimisation des processus entre la France et la Chine.
            </p>
            <p className="team-signature">Luxe &middot; LVMH &middot; Supply Chain &middot; Chine</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA FOOTER (dark bg)
   ═══════════════════════════════════════════════════════════ */
function CtaFooter() {
  return (
    <section className="cta-section">
      <motion.h2
        className="cta-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        &Eacute;changeons.
      </motion.h2>

      <motion.div
        className="cta-button-block"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
      >
        <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" data-ph="final-cta" onClick={() => trackCtaClick("footer")}>
          <ButtonColorful label="R&eacute;servez votre diagnostic" className="h-14 px-8 text-base" />
        </a>
        <p className="cta-micro cta-micro--dark">15 minutes &middot; Sans engagement &middot; Partenaire longue dur&eacute;e</p>
      </motion.div>

      <motion.div
        className="secondary-cta"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <a
          href="mailto:paul.larmaraud@parrit.ai"
          className="secondary-cta-link"
          data-ph="email-cta"
          onClick={() => trackCtaClick("email")}
        >
          paul.larmaraud@parrit.ai
        </a>
        <span className="secondary-cta-sep">&middot;</span>
        <a
          href="https://wa.me/33759665687?text=Bonjour%20Paul%2C%20je%20souhaiterais%20en%20savoir%20plus%20sur%20Parrit.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="secondary-cta-link"
          data-ph="whatsapp-cta"
          onClick={() => trackCtaClick("whatsapp")}
        >
          &Eacute;crire sur WhatsApp
        </a>
      </motion.div>

      <footer className="footer-block">
        <p className="footer-legal">
          &copy; 2026 Paul Larmaraud &middot; SASU PARRIT.AI &middot; Rueil-Malmaison
        </p>
        <p className="footer-rgpd">
          Ce site ne d&eacute;pose aucun cookie publicitaire.
          Les donn&eacute;es analytiques sont collect&eacute;es de mani&egrave;re anonyme
          conform&eacute;ment au RGPD. En r&eacute;servant un appel, vous acceptez
          que vos coordonn&eacute;es soient utilis&eacute;es uniquement pour organiser
          cet &eacute;change. Contact&nbsp;: <a href="mailto:paul.larmaraud@parrit.ai">paul.larmaraud@parrit.ai</a>
        </p>
      </footer>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Home() {
  useScrollFade();
  useEngagementTracking();

  return (
    <>
      <Nav />
      <Hero />
      <VisualShowcase />
      <Approach />
      <CaseStudies />
      <ShareableQuote />
      <Founders />
      <CtaFooter />
    </>
  );
}
