"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useScrollFade } from "@/components/hooks";
import { ButtonColorful } from "@/components/ui/button-colorful";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LogosStack from "@/components/LogosStack";
import PricingModels from "@/components/PricingModels";
import QuickContact from "@/components/QuickContact";
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
  const offers = dict.claudeCode.offers;
  return (
    <section
      className="light-section"
      id="claude-code-offer"
      data-ph="claude-code-offer"
    >
      <div className="section-inner" style={{ maxWidth: 1040 }}>
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
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            marginBottom: 48,
          }}
        >
          {offers.map((offer, idx) => {
            const isRecommended = Boolean(offer.recommendedBadge);
            return (
              <motion.div
                key={offer.title}
                variants={cardReveal}
                style={{
                  padding: "28px 26px",
                  borderRadius: 14,
                  border: isRecommended
                    ? "1px solid rgba(200, 149, 108, 0.45)"
                    : "1px solid rgba(0,0,0,0.08)",
                  background: isRecommended
                    ? "linear-gradient(180deg, rgba(200,149,108,0.10) 0%, rgba(200,149,108,0.02) 100%)"
                    : "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(4px)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {isRecommended && offer.recommendedBadge && (
                  <span
                    style={{
                      display: "inline-block",
                      fontFamily: "var(--font-body)",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#1a1410",
                      background: "#c8956c",
                      padding: "5px 12px",
                      borderRadius: 4,
                      marginBottom: 16,
                      fontWeight: 600,
                      alignSelf: "flex-start",
                    }}
                  >
                    {offer.recommendedBadge}
                  </span>
                )}
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: isRecommended ? "#c8956c" : "var(--text-muted)",
                    marginBottom: 12,
                    fontWeight: 500,
                    marginTop: isRecommended ? 0 : 0,
                  }}
                >
                  {offer.kind}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 22,
                    fontWeight: 500,
                    color: "var(--text)",
                    marginBottom: 8,
                    lineHeight: 1.2,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {offer.title}
                </h3>
                {offer.intro && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--text)",
                      marginBottom: 20,
                      lineHeight: 1.45,
                    }}
                  >
                    {offer.intro}
                  </p>
                )}
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    flex: 1,
                  }}
                >
                  {offer.bullets.map((b, i) => (
                    <li
                      key={i}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        color: "var(--text-muted)",
                        lineHeight: 1.55,
                        fontWeight: 300,
                        paddingLeft: 18,
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "0.55em",
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: isRecommended ? "#c8956c" : "var(--text-muted)",
                        }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
                {offer.footnote && (
                  <p
                    style={{
                      marginTop: 20,
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      fontStyle: "italic",
                      color: "var(--text-muted)",
                      lineHeight: 1.5,
                      fontWeight: 300,
                      paddingTop: 16,
                      borderTop: isRecommended
                        ? "1px solid rgba(200,149,108,0.18)"
                        : "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    {offer.footnote}
                  </p>
                )}
                <a
                  href="#callback-form"
                  data-ph={`claude-code-cta-${idx}`}
                  onClick={() => trackCtaClick(`claude-code-${offer.title}`)}
                  style={{
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                    padding: "12px 20px",
                    borderRadius: 999,
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 500,
                    color: isRecommended ? "#ffffff" : "var(--text)",
                    background: isRecommended
                      ? "linear-gradient(135deg, #c8956c 0%, #b8814c 100%)"
                      : "rgba(0,0,0,0.04)",
                    border: isRecommended
                      ? "none"
                      : "1px solid rgba(0,0,0,0.12)",
                    textDecoration: "none",
                    transition: "transform 0.15s ease",
                  }}
                >
                  {dict.claudeCode.cta}
                </a>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--text-muted)",
            fontWeight: 300,
            fontStyle: "italic",
            maxWidth: 640,
            margin: "0 auto",
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          {dict.claudeCode.target}
        </motion.p>
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
        style={{ textAlign: "center", color: "var(--text-light-muted)", fontFamily: "var(--font-body)", fontSize: "16px", marginBottom: "32px", fontWeight: 300, padding: "0 24px" }}
      >
        {dict.cta.subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        style={{ padding: "0 24px" }}
      >
        <QuickContact strings={dict.quickContact} page="home" variant="dark" />
      </motion.div>

      <motion.div
        className="secondary-cta"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        style={{ marginTop: "32px" }}
      >
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
