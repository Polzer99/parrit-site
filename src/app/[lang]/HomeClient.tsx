"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useScrollFade } from "@/components/hooks";
import { ButtonColorful } from "@/components/ui/button-colorful";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import QuickContact from "@/components/QuickContact";
import Stamps from "@/components/Stamps";
import OfferAnimation, { offerTypeFromTitle } from "@/components/OfferAnimation";
import { captureTouch, getAttribution } from "@/lib/attribution";
import type { Dictionary, Locale } from "./dictionaries";

const WEBHOOK_URL =
  "https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead";

function trackCtaClick(label?: string) {
  const utms = getAttribution();
  if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).posthog) {
    ((window as unknown as Record<string, unknown>).posthog as { capture: (e: string, p: Record<string, unknown>) => void }).capture("cta_clicked", {
      label: label || "unknown",
      page: "landing",
      ...utms,
    });
  }
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
      ...utms,
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
          className="grid-3-cards"
          style={{ marginBottom: 48 }}
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
                {(() => {
                  const animType = offerTypeFromTitle(offer.title);
                  return animType ? (
                    <div
                      style={{
                        marginBottom: 18,
                        height: 90,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0.95,
                      }}
                    >
                      <OfferAnimation type={animType} />
                    </div>
                  ) : null;
                })()}
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
   CAS VITRINES PAR PROFIL (4 sous-pages dédiées)
   ═══════════════════════════════════════════════════════════ */
function CasVitrinesProfilSection({ dict }: { dict: Dictionary }) {
  const cv = dict.casVitrines.homeSection;
  return (
    <section className="light-section" data-ph="cas-categories">
      <div className="section-inner" style={{ maxWidth: 1200 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: 48 }}
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
            {cv.badge}
          </span>
          <h2 className="light-section-title" style={{ marginTop: 0, marginBottom: 16 }}>
            {cv.title}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--text-muted)",
              fontWeight: 300,
              maxWidth: 760,
              margin: "0 auto",
            }}
          >
            {cv.subtitle}
          </p>
        </motion.div>

        <div className="cas-categories-grid">
          {cv.categories.map((cat, ci) => (
            <motion.div
              key={cat.badge}
              className="cas-category"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: ci * 0.15 }}
            >
              <span className="cas-category-badge">{cat.badge}</span>
              <h3 className="cas-category-title">{cat.title}</h3>
              <div className="cas-examples">
                {cat.examples.map((ex, ei) => (
                  <motion.div
                    key={ex.title}
                    className="cas-example-card"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: ci * 0.15 + ei * 0.1 + 0.2 }}
                  >
                    <h4 className="cas-example-title">{ex.title}</h4>
                    {ex.context && (
                      <p className="cas-example-context">{ex.context}</p>
                    )}
                    <p className="cas-example-brief">{ex.brief}</p>
                    <p className="cas-example-result">
                      <span aria-hidden="true">→</span> {ex.result}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {cv.footer && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="cas-footer"
          >
            {cv.footer}
          </motion.p>
        )}
      </div>
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
      <Stamps
        title="Deux traditions, une même exigence."
        subtitle="Quatre œuvres de France et de Chine. Parce qu'avant d'opérer, on regarde."
      />
      <ClaudeCodeOffer dict={dict} />
      <CasVitrinesProfilSection dict={dict} />
      <CtaFooter dict={dict} />
    </>
  );
}
