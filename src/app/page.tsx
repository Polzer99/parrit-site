"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
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
   ANIMATED DEMO: Email Sorting
   ═══════════════════════════════════════════════════════════ */
function EmailSortingDemo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const docs = [
    { icon: "\u2709", label: "Email" },
    { icon: "\uD83D\uDCC4", label: "Facture" },
    { icon: "\uD83D\uDCCB", label: "Contrat" },
    { icon: "\uD83E\uDDFE", label: "Re\u00e7u" },
  ];

  return (
    <div ref={ref} className="demo-container">
      <div className="demo-email-stage">
        {/* Incoming documents */}
        <div className="demo-email-incoming">
          {docs.map((d, i) => (
            <motion.div
              key={i}
              className="demo-doc"
              initial={{ x: -120, opacity: 0 }}
              animate={
                inView
                  ? {
                      x: [null, 0, 0, 80],
                      opacity: [null, 1, 1, 0],
                    }
                  : {}
              }
              transition={{
                duration: 3.5,
                delay: i * 0.6,
                times: [0, 0.25, 0.65, 1],
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              <span className="demo-doc-icon">{d.icon}</span>
            </motion.div>
          ))}
        </div>

        {/* Scan line */}
        <motion.div
          className="demo-scan-line"
          initial={{ scaleY: 0 }}
          animate={
            inView
              ? {
                  scaleY: [0, 1, 1, 0],
                  opacity: [0, 0.8, 0.8, 0],
                }
              : {}
          }
          transition={{
            duration: 3.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />

        {/* Sorted folders */}
        <div className="demo-email-sorted">
          {["Factures", "Contrats", "Divers"].map((label, i) => (
            <motion.div
              key={label}
              className="demo-folder"
              initial={{ opacity: 0.3, scale: 0.9 }}
              animate={
                inView
                  ? {
                      opacity: [0.3, 0.3, 1],
                      scale: [0.9, 0.9, 1],
                    }
                  : {}
              }
              transition={{
                duration: 3.5,
                delay: i * 0.3,
                times: [0, 0.5, 1],
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              <div className="demo-folder-icon">\uD83D\uDCC1</div>
              <span className="demo-folder-label">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED DEMO: Dashboard Filling
   ═══════════════════════════════════════════════════════════ */
function DashboardDemo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const bars = [65, 85, 45];

  return (
    <div ref={ref} className="demo-container">
      <div className="demo-dashboard">
        {/* Mini header */}
        <div className="demo-dash-header">
          <div className="demo-dash-dot" />
          <div className="demo-dash-dot" />
          <div className="demo-dash-dot" />
        </div>

        <div className="demo-dash-body">
          {/* Bar chart */}
          <div className="demo-bars">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                className="demo-bar"
                initial={{ height: 0 }}
                animate={inView ? { height: `${h}%` } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.3 + i * 0.15,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          {/* Line chart SVG */}
          <svg className="demo-line-svg" viewBox="0 0 200 80" fill="none">
            <motion.path
              d="M0 60 Q30 55 50 40 T100 30 T150 15 T200 10"
              stroke="#c8956c"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
            />
          </svg>

          {/* Counters */}
          <div className="demo-counters">
            <AnimatedCounter value={2847} inView={inView} delay={0.4} suffix="" />
            <AnimatedCounter value={94} inView={inView} delay={0.6} suffix="%" />
            <AnimatedCounter value={12} inView={inView} delay={0.8} suffix="s" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AnimatedCounter({
  value,
  inView,
  delay,
  suffix,
}: {
  value: number;
  inView: boolean;
  delay: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const duration = 1200;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress >= 1) clearInterval(timer);
    }, 30);
    const delayTimer = setTimeout(() => {}, delay * 1000);
    return () => {
      clearInterval(timer);
      clearTimeout(delayTimer);
    };
  }, [inView, value, delay]);

  return (
    <motion.span
      className="demo-counter-value"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ delay, duration: 0.4 }}
    >
      {count}
      {suffix}
    </motion.span>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED DEMO: WhatsApp Agent Chat
   ═══════════════════════════════════════════════════════════ */
function WhatsAppDemo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="demo-container">
      <div className="demo-phone">
        {/* Phone header */}
        <div className="demo-phone-header">
          <div className="demo-phone-notch" />
          <span className="demo-phone-title">Agent Parrit</span>
        </div>

        {/* Chat area */}
        <div className="demo-chat-area">
          {/* User message */}
          <motion.div
            className="demo-chat-bubble demo-chat-user"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          >
            Brief moi sur Pomona
          </motion.div>

          {/* Typing indicator */}
          <motion.div
            className="demo-chat-bubble demo-chat-agent demo-typing"
            initial={{ opacity: 0 }}
            animate={
              inView
                ? { opacity: [0, 1, 1, 0], display: ["flex", "flex", "flex", "none"] }
                : {}
            }
            transition={{ delay: 1.2, duration: 1.5, times: [0, 0.1, 0.8, 1] }}
          >
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </motion.div>

          {/* Agent response */}
          <motion.div
            className="demo-chat-bubble demo-chat-agent"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 2.8, duration: 0.6, ease: "easeOut" }}
          >
            <strong>Pomona</strong> &mdash; 3 commandes ce mois.
            <br />
            Dernier contact il y a 2 jours.
            <br />
            <span style={{ color: "#c8956c" }}>Relance sugg&eacute;r&eacute;e demain.</span>
          </motion.div>
        </div>
      </div>
    </div>
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
        <p className="cta-micro">15 minutes &middot; Sans engagement &middot; Confidentiel</p>
      </motion.div>

      {/* Exponential curve animation */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={4}
        style={{ marginTop: "48px", width: "100%", maxWidth: "480px" }}
      >
        <svg viewBox="0 0 480 160" fill="none" style={{ width: "100%", overflow: "visible" }}>
          {/* Grid lines subtle */}
          {[40, 80, 120].map((y) => (
            <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="rgba(200,149,108,0.08)" strokeWidth="1" />
          ))}
          {/* Exponential curve */}
          <motion.path
            d="M0 150 Q60 148 120 140 T200 120 T280 95 T340 60 T400 20 T440 -10 T480 -60"
            stroke="#c8956c"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, delay: 0.8, ease: "easeOut" }}
          />
          {/* Glow under curve */}
          <motion.path
            d="M0 150 Q60 148 120 140 T200 120 T280 95 T340 60 T400 20 T440 -10 T480 -60 V160 H0 Z"
            fill="url(#curveGlow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 2, delay: 1.5 }}
          />
          <defs>
            <linearGradient id="curveGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c8956c" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          {/* Dot at the tip */}
          <motion.circle
            cx="480"
            cy="-60"
            r="5"
            fill="#c8956c"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: [0, 1.3, 1] }}
            transition={{ delay: 3, duration: 0.5 }}
          />
        </svg>
      </motion.div>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={5}
        style={{ marginTop: "24px", fontSize: "13px", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 300, textAlign: "center" as const }}
      >
        Co-construction &middot; Long terme &middot; R&eacute;sultats mesurables
      </motion.p>

      <motion.div
        className="scroll-hint"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={6}
      >
        <div className="scroll-chevron" />
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 2 — PAIN POINTS (visual 2x2 grid)
   ═══════════════════════════════════════════════════════════ */
function PainPoints() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const pains = [
    { icon: "\u2709", label: "Saisie manuelle" },
    { icon: "\uD83D\uDCCA", label: "Suivi inexistant" },
    { icon: "\uD83D\uDD04", label: "Copier-coller" },
    { icon: "\u23F3", label: "Validations sans fin" },
  ];

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
          Ce qui ralentit vos &eacute;quipes
        </motion.h2>

        <div ref={ref} className="pain-visual-grid">
          {pains.map((p, i) => (
            <motion.div
              key={p.label}
              className="pain-visual-card"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6, ease: "easeOut" }}
            >
              {/* Animated icon with pulse */}
              <motion.div
                className="pain-visual-icon"
                animate={
                  inView
                    ? {
                        scale: [1, 1.15, 1],
                        opacity: [0.7, 1, 0.7],
                      }
                    : {}
                }
                transition={{
                  duration: 2.5,
                  delay: i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {p.icon}
              </motion.div>
              <span className="pain-visual-label">{p.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="pain-bottom-line"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Tout cela s&rsquo;automatise en quelques jours.
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 3 — SERVICES (animated demos)
   ═══════════════════════════════════════════════════════════ */
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
          Ce que nous d&eacute;ployons
        </motion.h2>

        <div className="services-demo-grid">
          <motion.div
            className="service-demo-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <EmailSortingDemo />
            <h3 className="service-demo-title">Saisie automatique</h3>
          </motion.div>

          <motion.div
            className="service-demo-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <DashboardDemo />
            <h3 className="service-demo-title">Suivi centralis&eacute;</h3>
          </motion.div>

          <motion.div
            className="service-demo-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <WhatsAppDemo />
            <h3 className="service-demo-title">Agent WhatsApp</h3>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 4 — CASE STUDIES (animated counters)
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
   SECTION 5 — TEAM (shorter)
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
        <p className="cta-micro">15 minutes &middot; Sans engagement &middot; Confidentiel</p>
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
    <>
      <Nav />
      <Hero />
      <PainPoints />
      <Services />
      <CaseStudies />
      <ShareableQuote />
      <Team />
      <CtaFooter />
    </>
  );
}
