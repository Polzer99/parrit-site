"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useScrollFade } from "@/components/hooks";
import { ButtonColorful } from "@/components/ui/button-colorful";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ChatVoice from "@/components/ChatVoice";
import LogosStack from "@/components/LogosStack";
import PricingModels from "@/components/PricingModels";
import type { Dictionary, Locale } from "./dictionaries";

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
function Nav({ lang }: { lang: Locale }) {
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "16px 24px",
          width: "100%",
        }}
      >
        <LanguageSwitcher currentLang={lang} />
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════ */
function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="hero-section">
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
          {dict.hero.logo}
        </motion.span>

        <motion.h1
          className="hero-title"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          {dict.hero.titleMain}{" "}
          <em className="hero-accent">{dict.hero.titleAccent}</em>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          {dict.hero.subtitle}
        </motion.p>

        <motion.div
          className="hero-cta-block"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <a
            href="#callback-form"
            data-ph="hero-cta"
            onClick={() => trackCtaClick("hero")}
            className="hero-cta-link"
          >
            <ButtonColorful label={dict.hero.cta} className="h-14 px-8 text-base" />
          </a>
          <p className="cta-micro">{dict.hero.ctaMicro}</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   VISUAL SHOWCASE
   ═══════════════════════════════════════════════════════════ */
const showcaseSrcs = [
  "/demo-agents.jpg",
  "/demo-crm.jpg",
  "/demo-automation.jpg",
  "/demo-whatsapp.jpg",
];

function VisualShowcase({ dict }: { dict: Dictionary }) {
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
          {dict.showcase.title}
        </motion.h2>

        <div className="showcase-grid">
          {dict.showcase.items.map((item, i) => (
            <motion.div
              key={showcaseSrcs[i]}
              className="showcase-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.12 }}
            >
              <div className="showcase-img-wrapper">
                <Image
                  src={showcaseSrcs[i]}
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
          <a href="#callback-form" data-ph="mid-cta" onClick={() => trackCtaClick("mid-showcase")}>
            <ButtonColorful label={dict.showcase.midCta} className="h-12 px-6 text-sm" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   APPROACH
   ═══════════════════════════════════════════════════════════ */
function Approach({ dict }: { dict: Dictionary }) {
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
          {dict.approach.title}
        </motion.h2>
        <motion.p
          style={{ fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.8, color: "var(--text-muted)", marginBottom: "48px", fontWeight: 300 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {dict.approach.description}
        </motion.p>

        <div style={{ display: "flex", flexWrap: "wrap" as const, justifyContent: "center", gap: "32px" }}>
          {dict.approach.pillars.map((item, i) => (
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
   CASE STUDIES
   ═══════════════════════════════════════════════════════════ */
type CaseItem = Dictionary["cases"]["items"][number];

function CaseStudyCard({ c, index, beforeLabel, afterLabel }: {
  c: CaseItem;
  index: number;
  beforeLabel: string;
  afterLabel: string;
}) {
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
          <span className="case-ba-label">{beforeLabel}</span>
          <span className="case-ba-value-before">{c.before}</span>
        </motion.div>
        <motion.div
          className="case-ba-after"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span className="case-ba-label case-ba-label--after">{afterLabel}</span>
          <span className="case-ba-value-after">{c.after}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function CaseStudies({ dict }: { dict: Dictionary }) {
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
          {dict.cases.title}
        </motion.h2>

        <div className="cases-list">
          {dict.cases.items.map((c, idx) => (
            <CaseStudyCard
              key={idx}
              c={c}
              index={idx}
              beforeLabel={dict.cases.before}
              afterLabel={dict.cases.after}
            />
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{ textAlign: "center", marginTop: "48px", fontSize: "14px", color: "var(--text-light-muted)", fontStyle: "italic", fontFamily: "var(--font-heading)" }}
        >
          {dict.cases.footer}
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHAREABLE QUOTE
   ═══════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════
   CLAUDE CODE OFFER
   ═══════════════════════════════════════════════════════════ */
function ClaudeCodeOffer({ dict }: { dict: Dictionary }) {
  return (
    <section
      className="light-section"
      id="claude-code-offer"
      data-ph="claude-code-offer"
    >
      <div className="section-inner" style={{ maxWidth: 960 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 14px",
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: "#c8956c",
              background: "rgba(200,149,108,0.08)",
              border: "1px solid rgba(200,149,108,0.25)",
              borderRadius: 999,
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            {dict.claudeCode.badge}
          </span>
          <h2
            className="light-section-title"
            style={{ marginTop: 0, marginBottom: 16 }}
          >
            {dict.claudeCode.title}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--text-muted)",
              fontWeight: 300,
              maxWidth: 640,
              margin: "0 auto",
            }}
          >
            {dict.claudeCode.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            marginBottom: 48,
          }}
        >
          {dict.claudeCode.deliverables.map((d) => (
            <motion.div
              key={d.title}
              variants={cardReveal}
              style={{
                padding: "24px 20px",
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 12,
                backdropFilter: "blur(4px)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  color: "#c8956c",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                {d.day}
              </span>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 18,
                  fontWeight: 500,
                  color: "var(--text)",
                  marginBottom: 8,
                  lineHeight: 1.3,
                }}
              >
                {d.title}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--text-muted)",
                  fontWeight: 300,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {d.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          style={{ textAlign: "center" }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--text-muted)",
              fontWeight: 300,
              fontStyle: "italic",
              maxWidth: 560,
              margin: "0 auto 28px",
              lineHeight: 1.6,
            }}
          >
            {dict.claudeCode.target}
          </p>
          <a
            href="#callback-form"
            data-ph="claude-code-cta"
            onClick={() => trackCtaClick("claude-code-offer")}
          >
            <ButtonColorful
              label={dict.claudeCode.cta}
              className="h-12 px-7 text-sm"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function ShareableQuote({ dict }: { dict: Dictionary }) {
  return (
    <section className="quote-section" data-ph="shareable-quote">
      <motion.blockquote
        className="shareable-quote"
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="quote-text">{dict.quote.text}</p>
        <cite className="quote-cite">{dict.quote.cite}</cite>
      </motion.blockquote>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOUNDERS
   ═══════════════════════════════════════════════════════════ */
function Founders({ dict }: { dict: Dictionary }) {
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
          {dict.founders.title}
        </motion.h2>

        <motion.div
          className="team-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div className="team-card team-card-premium" variants={cardReveal}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/stamp-paul.png" alt="" className="team-stamp" />
            <h3 className="team-name">{dict.founders.paul.name}</h3>
            <p className="team-role">{dict.founders.paul.role}</p>
            <p className="team-bio">{dict.founders.paul.bio}</p>
            <p className="team-signature">{dict.founders.paul.signature}</p>
          </motion.div>

          <motion.div className="team-card team-card-premium" variants={cardReveal}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/stamp-yukun.png" alt="" className="team-stamp" />
            <h3 className="team-name">{dict.founders.yukun.name}</h3>
            <p className="team-role">{dict.founders.yukun.role}</p>
            <p className="team-bio">{dict.founders.yukun.bio}</p>
            <p className="team-signature">{dict.founders.yukun.signature}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CALLBACK FORM + CTA FOOTER
   ═══════════════════════════════════════════════════════════ */
function CtaFooter({ dict }: { dict: Dictionary }) {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [creneau, setCreneau] = useState("");
  const [besoin] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("sending");
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "parrit.ai",
          action: "callback_request",
          nom,
          prenom,
          entreprise,
          telephone,
          email,
          creneau,
          besoin,
          referrer: typeof document !== "undefined" ? document.referrer : "",
          url: typeof window !== "undefined" ? window.location.href : "",
          timestamp: new Date().toISOString(),
          page: "landing",
          ...getUtmParams(),
        }),
      });
      trackCtaClick("footer-form");
      setFormState("sent");
    } catch {
      setFormState("error");
    }
  }

  function slotLabel(slot: string): string {
    switch (slot) {
      case "asap": return dict.cta.sent.slotAsap;
      case "matin": return dict.cta.sent.slotMorning;
      case "midi": return dict.cta.sent.slotNoon;
      case "aprem": return dict.cta.sent.slotAfternoon;
      default: return dict.cta.sent.slotDefault;
    }
  }

  const thanksLine = dict.cta.sent.thanks.replace("{firstName}", prenom);
  const confirmLine = dict.cta.sent.confirmation
    .replace("{phone}", telephone)
    .replace("{slot}", slotLabel(creneau));

  const whatsappFormUrl = `https://wa.me/33759665687?text=${encodeURIComponent(dict.whatsappMessages.formCta)}`;
  const whatsappSecondaryUrl = `https://wa.me/33759665687?text=${encodeURIComponent(dict.whatsappMessages.secondaryCta)}`;

  return (
    <section className="cta-section" id="callback-form">
      <motion.h2
        className="cta-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {dict.cta.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        style={{ textAlign: "center", color: "var(--text-light-muted)", fontFamily: "var(--font-body)", fontSize: "16px", marginBottom: "32px", fontWeight: 300 }}
      >
        {dict.cta.subtitle}
      </motion.p>

      {formState === "sent" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", padding: "40px 24px" }}
        >
          <p style={{ fontSize: "24px", marginBottom: "12px" }}>&#10003;</p>
          <p style={{ color: "#FFFFFF", fontFamily: "var(--font-heading)", fontSize: "20px", marginBottom: "8px" }}>
            {thanksLine}
          </p>
          <p style={{ color: "var(--text-light-muted)", fontFamily: "var(--font-body)", fontSize: "15px" }}>
            {confirmLine}
          </p>
        </motion.div>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          style={{ maxWidth: "420px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px", padding: "0 24px" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <input
              type="text"
              required
              name="given-name"
              autoComplete="given-name"
              placeholder={dict.cta.form.firstName}
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="callback-input"
            />
            <input
              type="text"
              required
              name="family-name"
              autoComplete="family-name"
              placeholder={dict.cta.form.lastName}
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="callback-input"
            />
          </div>
          <input
            type="text"
            required
            name="organization"
            autoComplete="organization"
            placeholder={dict.cta.form.company}
            value={entreprise}
            onChange={(e) => setEntreprise(e.target.value)}
            className="callback-input"
          />
          <input
            type="tel"
            required
            name="tel"
            autoComplete="tel"
            placeholder={dict.cta.form.phone}
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="callback-input"
          />
          <input
            type="email"
            required
            name="email"
            autoComplete="email"
            placeholder={dict.cta.form.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="callback-input"
          />
          <select
            value={creneau}
            onChange={(e) => setCreneau(e.target.value)}
            className="callback-input"
          >
            <option value="">{dict.cta.form.slotPlaceholder}</option>
            <option value="matin">{dict.cta.form.slotMorning}</option>
            <option value="midi">{dict.cta.form.slotNoon}</option>
            <option value="aprem">{dict.cta.form.slotAfternoon}</option>
            <option value="asap">{dict.cta.form.slotAsap}</option>
          </select>
          <button
            type="submit"
            disabled={formState === "sending"}
            className="callback-submit"
          >
            {formState === "sending" ? dict.cta.form.submitting : dict.cta.form.submit}
          </button>
          {formState === "error" && (
            <p style={{ color: "#ff6b6b", fontSize: "13px", textAlign: "center" }}>
              {dict.cta.form.error}
            </p>
          )}
          <div className="callback-separator">
            <span className="callback-separator-line" />
            <span className="callback-separator-text">{dict.cta.form.or}</span>
            <span className="callback-separator-line" />
          </div>
          <a
            href={whatsappFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="callback-whatsapp"
            onClick={() => trackCtaClick("whatsapp-form")}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ flexShrink: 0 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span>{dict.cta.form.whatsapp}</span>
          </a>
        </motion.form>
      )}

      <motion.div
        className="secondary-cta"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        style={{ marginTop: "40px" }}
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
          href={whatsappSecondaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="secondary-cta-link"
          data-ph="whatsapp-cta"
          onClick={() => trackCtaClick("whatsapp")}
        >
          {dict.cta.secondaryWhatsapp}
        </a>
      </motion.div>

      <footer className="footer-block">
        <p className="footer-legal">{dict.cta.footer.legal}</p>
        <p className="footer-rgpd">
          {dict.cta.footer.rgpd}{" "}
          <a href="mailto:paul.larmaraud@parrit.ai">paul.larmaraud@parrit.ai</a>
        </p>
      </footer>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function HomeClient({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  useScrollFade();
  useEngagementTracking();

  return (
    <>
      <Nav lang={lang} />
      <Hero dict={dict} />
      <ChatVoice dict={dict} lang={lang} />
      <LogosStack label={dict.stackLabel} />
      <VisualShowcase dict={dict} />
      <Approach dict={dict} />
      <CaseStudies dict={dict} />
      <ClaudeCodeOffer dict={dict} />
      <ShareableQuote dict={dict} />
      <Founders dict={dict} />
      <PricingModels copy={dict.pricingModels} />
      <CtaFooter dict={dict} />
    </>
  );
}
