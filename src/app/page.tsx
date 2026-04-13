"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useScrollFade } from "@/components/hooks";
import { ButtonColorful } from "@/components/ui/button-colorful";

const CALENDAR_URL = "https://calendar.app.google/nWa2QQe8DUwtuwbz8";
const WEBHOOK_URL =
  "https://n8n.srv1115145.hstgr.cloud/webhook/lead-inbound";

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
          if (typeof window !== "undefined" && (window as any).posthog) {
            (window as any).posthog.capture("scroll_depth", { depth: t });
          }
        }
      });
    }

    function handleBeforeUnload() {
      const seconds = Math.round((Date.now() - startTime.current) / 1000);
      if (typeof window !== "undefined" && (window as any).posthog) {
        (window as any).posthog.capture("time_on_page", {
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
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED DEMO: Before/After Counter
   ═══════════════════════════════════════════════════════════ */
function BeforeAfterCounter({
  before,
  after,
  label,
  inView,
  delay = 0,
}: {
  before: string;
  after: string;
  label: string;
  inView: boolean;
  delay?: number;
}) {
  return (
    <div className="demo-ba-item">
      <div className="demo-ba-values">
        <motion.span
          className="demo-ba-before"
          initial={{ opacity: 1, scale: 1 }}
          animate={
            inView
              ? {
                  opacity: [1, 1, 0],
                  scale: [1, 1, 0.7],
                  filter: ["blur(0px)", "blur(0px)", "blur(4px)"],
                }
              : {}
          }
          transition={{
            delay: delay + 0.3,
            duration: 1.5,
            times: [0, 0.4, 1],
            ease: "easeOut",
          }}
        >
          {before}
        </motion.span>
        <motion.span
          className="demo-ba-after"
          initial={{ opacity: 0, scale: 0.7, filter: "blur(4px)" }}
          animate={
            inView
              ? { opacity: 1, scale: 1, filter: "blur(0px)" }
              : {}
          }
          transition={{ delay: delay + 1.6, duration: 0.7, ease: "easeOut" }}
        >
          {after}
        </motion.span>
      </div>
      <motion.span
        className="demo-ba-label"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: delay + 2, duration: 0.5 }}
      >
        {label}
      </motion.span>
    </div>
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
        Votre partenaire
        <br />
        <span style={{ color: "var(--accent)" }}>exponentiel.</span>
      </motion.h1>

      <motion.div
        className="hero-cta-block"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <motion.a
          href={CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-ph="hero-cta"
          onClick={() => trackCtaClick("hero")}
          className="hero-cta-link"
        >
          <ButtonColorful label="R&eacute;servez votre diagnostic" className="h-14 px-8 text-base" />
        </motion.a>
        <p className="cta-micro">15 minutes &middot; Sans engagement &middot; Partenaire longue dur&eacute;e</p>
      </motion.div>

      {/* Curve is now global — behind all content */}

    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 2 — VISUAL SHOWCASE (replaces pain points + services)
   ═══════════════════════════════════════════════════════════ */
const showcaseItems = [
  { src: "/demo-agents.jpg", label: "Agents intelligents" },
  { src: "/demo-crm.jpg", label: "CRM sur mesure" },
  { src: "/demo-automation.jpg", label: "Automatisation documentaire" },
  { src: "/demo-whatsapp.jpg", label: "Interfaces conversationnelles" },
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
          Ce que nous d&eacute;ployons
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
            <ButtonColorful label="Discutons de votre cas" className="h-14 px-8 text-base" />
          </a>
          <p className="cta-micro" style={{ color: "var(--text-light-muted)" }}>15 minutes &middot; Sans engagement &middot; Partenaire longue dur&eacute;e</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 3 — CASE STUDIES (animated counters only)
   ═══════════════════════════════════════════════════════════ */
const cases = [
  {
    badge: "RESTAURATION \u00B7 DUBA\u00CF",
    title: "Ouvertures de franchises",
    counters: [
      { before: "75%", after: "\u22121 semaine", label: "D\u00e9lai d\u2019ouverture" },
      { before: "5+ oublis", after: "0 oubli", label: "Documents manquants" },
    ],
  },
  {
    badge: "FORMATION \u00B7 16 AGENCES",
    title: "Consolidation de donn\u00e9es",
    counters: [
      { before: "4 jours", after: "5 min", label: "Temps de consolidation" },
      { before: "1 source", after: "16 sources", label: "Automatis\u00e9es" },
    ],
  },
  {
    badge: "TEXTILE \u00B7 INDUSTRIE",
    title: "Traitement de factures",
    counters: [
      { before: "45 min", after: "30 sec", label: "Par facture" },
      { before: "\u00D71", after: "\u00D760", label: "Rapidit\u00e9" },
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
          Cas r&eacute;els, chiffres r&eacute;els
        </motion.h2>

        <div className="cases-visual-list">
          {cases.map((c, idx) => {
            const CaseBlock = () => {
              const caseRef = useRef(null);
              const caseInView = useInView(caseRef, { once: true, margin: "-60px" });
              return (
                <motion.div
                  ref={caseRef}
                  className="case-visual-block"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: idx * 0.1 }}
                >
                  <span className="case-badge">{c.badge}</span>
                  <h3 className="case-visual-title">{c.title}</h3>
                  <div className="case-counters-row">
                    {c.counters.map((ct, ci) => (
                      <BeforeAfterCounter
                        key={ci}
                        before={ct.before}
                        after={ct.after}
                        label={ct.label}
                        inView={caseInView}
                        delay={ci * 0.4}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            };
            return <CaseBlock key={idx} />;
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHAREABLE QUOTE
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
          &laquo;&nbsp;L&rsquo;IA ne remplace pas vos &eacute;quipes.
          <br />
          Elle leur rend les heures vol&eacute;es.&nbsp;&raquo;
        </p>
        <cite className="quote-cite">&mdash; Paul Larmaraud, Parrit.ai</cite>
      </motion.blockquote>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 5 — TEAM (short — just names)
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
          Qui sommes-nous
        </motion.h2>

        <motion.div
          className="team-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div className="team-card" variants={cardReveal}>
            <h3 className="team-name">Yukun Leng</h3>
            <p className="team-role">Co-fondateur &middot; SAP &amp; Supply Chain</p>
          </motion.div>

          <motion.div className="team-card" variants={cardReveal}>
            <h3 className="team-name">Paul Larmaraud</h3>
            <p className="team-role">Co-fondateur &middot; IA &amp; Automatisation</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 6 — CTA + FOOTER
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
        Repartez avec une cartographie de vos gains &mdash; m&ecirc;me sans travailler avec nous.
      </motion.p>

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
        <p className="cta-micro">15 minutes &middot; Sans engagement &middot; Partenaire longue dur&eacute;e</p>
      </motion.div>

      <motion.div
        className="secondary-cta"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
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
        <span className="secondary-cta-sep">&middot;</span>
        <a
          href="mailto:paul.larmaraud@parrit.ai"
          className="secondary-cta-link"
          data-ph="email-cta"
          onClick={() => trackCtaClick("email")}
        >
          paul.larmaraud@parrit.ai
        </a>
      </motion.div>

      <footer className="footer-block">
        <p className="footer-legal">
          &copy; 2026 SASU PARRIT.AI &middot; Rueil-Malmaison &middot; France
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
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Global exponential curve — spans the ENTIRE page */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        fill="none"
      >
        <motion.path
          d="M-5 98 Q10 97 20 95 T35 90 T45 82 T55 70 T65 52 T75 28 T85 0 T95 -40 T105 -100"
          stroke="#c8956c"
          strokeWidth="0.15"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.2, 0.2, 0] }}
          transition={{ duration: 8, times: [0, 0.5, 0.75, 1], repeat: Infinity, repeatDelay: 2, ease: "easeOut" }}
        />
        <motion.path
          d="M-5 98 Q10 97 20 95 T35 90 T45 82 T55 70 T65 52 T75 28 T85 0 T95 -40 T105 -100 V100 H-5 Z"
          fill="url(#globalCurveGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.03, 0.03, 0] }}
          transition={{ duration: 8, times: [0, 0.5, 0.75, 1], repeat: Infinity, repeatDelay: 2 }}
        />
        <defs>
          <linearGradient id="globalCurveGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8956c" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      {/* Content on top */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />
        <Hero />
        <VisualShowcase />
        <CaseStudies />
        <ShareableQuote />
        <Team />
        <CtaFooter />
      </div>
    </div>
  );
}
