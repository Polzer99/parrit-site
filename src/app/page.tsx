"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
      action: "cta_click", referrer: typeof document !== "undefined" ? document.referrer : "", url: typeof window !== "undefined" ? window.location.href : "",
      timestamp: new Date().toISOString(),
      page: "landing",
    }),
  }).catch(() => {});
}

/* ─── Shared animation variants ─── */
const heroReveal: Record<string, any> = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay: i * 0.15 },
  }),
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

/* ─── SECTION 1: HERO (houseofouss style — centered, massive, breathing) ─── */
function Hero() {
  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 pt-[72px] relative">
      {/* Styled text logo — subtle floating animation */}
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: [0, -5, 0],
        }}
        transition={{
          opacity: { duration: 0.7, ease: "easeOut", delay: 0.15 },
          y: {
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 0.9,
          },
        }}
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(36px, 5vw, 42px)",
          fontWeight: 400,
          letterSpacing: "0.15em",
          color: "var(--accent)",
          marginBottom: "32px",
        }}
      >
        PARRIT.AI
      </motion.span>

      {/* Italic intro phrase */}
      <motion.p
        className="hero-intro"
        style={{ maxWidth: "480px", marginBottom: "40px" }}
        variants={heroReveal}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        Si vous cherchez quelqu&rsquo;un qui parle d&rsquo;IA
        <br />
        &mdash; vous n&rsquo;&ecirc;tes pas au bon endroit.
      </motion.p>

      {/* MEGA title */}
      <motion.h1
        className="hero-title"
        style={{ marginBottom: "8px" }}
        variants={heroReveal}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        L&rsquo;excellence
      </motion.h1>
      <motion.h1
        className="hero-title"
        style={{ marginBottom: "12px" }}
        variants={heroReveal}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        par l&rsquo;usage.
      </motion.h1>

      {/* Accent italic subtitle */}
      <motion.p
        variants={heroReveal}
        initial="hidden"
        animate="visible"
        custom={4}
        style={{
          fontFamily: "var(--font-heading)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(28px, 4vw, 42px)",
          lineHeight: 1.15,
          color: "var(--accent)",
          textAlign: "center",
          marginBottom: "32px",
        }}
      >
        Intelligence artificielle<br />d&eacute;ploy&eacute;e.
      </motion.p>

      {/* CTA — visible sans scroller */}
      <motion.a
        href={CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-ph="hero-cta"
        onClick={trackCtaClick}
        variants={heroReveal}
        initial="hidden"
        animate="visible"
        custom={5}
      >
        <ButtonColorful label="R&eacute;servez votre diagnostic" className="h-14 px-8 text-base" />
      </motion.a>

      {/* Italic copper quote */}
      <motion.p
        className="hero-quote"
        style={{ maxWidth: "600px", marginTop: "48px", marginBottom: "32px" }}
        variants={heroReveal}
        initial="hidden"
        animate="visible"
        custom={6}
      >
        Comprendre avant de proposer. D&eacute;ployer avant de promettre.
      </motion.p>

      {/* Features row */}
      <motion.div
        className="features-row"
        style={{ marginBottom: "0" }}
        variants={heroReveal}
        initial="hidden"
        animate="visible"
        custom={6}
      >
        <span>Automatisation</span>
        <span className="copper-dot" />
        <span>CRM</span>
        <span className="copper-dot" />
        <span>Agents</span>
        <span className="copper-dot" />
        <span>SAP</span>
        <span className="copper-dot" />
        <span>Processus</span>
      </motion.div>

      {/* Paris · Dubaï · Shanghai */}
      <motion.p
        variants={heroReveal}
        initial="hidden"
        animate="visible"
        custom={8}
        style={{ marginTop: "64px", color: "var(--text-dim)", fontSize: "11px", letterSpacing: "0.15em", fontWeight: 500, textTransform: "uppercase" as const }}
      >
        Paris &middot; Duba&iuml; &middot; Shanghai
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-hint"
        variants={heroReveal}
        initial="hidden"
        animate="visible"
        custom={8}
      >
        <div className="scroll-chevron" />
      </motion.div>
    </section>
  );
}

/* ─── SECTION 2: L'ORIGINE (elegant, centered, invitation tone) ─── */
function Origin() {
  return (
    <section className="py-28 md:py-32 px-6">
      <div className="origin-section">
        <p className="fade-in section-label text-center">L&rsquo;Origine</p>

        <p className="fade-in origin-text">
          De Palo Alto &agrave; Lime, puis Arkel&nbsp;&mdash; nous avons accompagn&eacute; des maisons telles que Bollor&eacute; Energy, Groupe Seb, Nestl&eacute;, Carte Noire.
        </p>

        {/* Copper ornament */}
        <div className="fade-in flex justify-center py-6">
          <div className="copper-ornament" />
        </div>

        <p className="fade-in origin-text">
          <strong>Paul</strong> porte la vision produit et le terrain. <strong>Yukun</strong> apporte dix ann&eacute;es au c&oelig;ur des maisons europ&eacute;ennes et la ma&icirc;trise des op&eacute;rations entre la France et la Chine.
        </p>
      </div>
    </section>
  );
}

/* ─── STAMPS WITH PARALLAX ─── */
function Stamps() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="py-24 md:py-28 flex flex-col items-center px-6">
      <motion.div className="fade-in stamps-row" style={{ y }}>
        <img src="/stamp-paris.png" alt="Paris" className="stamp stamp-left" />
        <img src="/stamp-china.png" alt="Shanghai" className="stamp stamp-center" />
        <img src="/stamp-cameroun.png" alt="Cameroun" className="stamp stamp-right" />
      </motion.div>
      <p className="fade-in stamps-caption">Paris &middot; Shanghai &middot; Douala</p>
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
        &laquo;&nbsp;Ce qui compte n&rsquo;est pas la technologie. C&rsquo;est la compr&eacute;hension de l&rsquo;humain.&nbsp;&raquo;
      </p>
    </section>
  );
}

/* ─── SECTION 4: SAVOIR-FAIRE (3 words, copper, elegant) ─── */
const savoirFaireWords = ["Diagnostic", "Conception", "D\u00e9ploiement"];

function SavoirFaire() {
  return (
    <section className="py-28 md:py-32 px-6 flex flex-col items-center">
      <p className="fade-in section-label text-center" style={{ marginBottom: "48px" }}>Savoir-faire</p>

      <div className="savoir-faire-list">
        {savoirFaireWords.map((word, i) => (
          <motion.div
            key={word}
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.12 }}
          >
            <span className="savoir-faire-word">{word}</span>
            {i < savoirFaireWords.length - 1 && <div className="savoir-faire-line" />}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── DARK CTA + FOOTER ─── */
function DarkCTA() {
  return (
    <section
      className="px-6 py-40 flex flex-col items-center text-center"
      style={{ background: "var(--bg-dark)" }}
    >
      <motion.h2
        className="mb-12"
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 400,
          fontSize: "clamp(36px, 5vw, 52px)",
          color: "var(--text-light)",
          letterSpacing: "-0.01em",
        }}
        initial={{ opacity: 0, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        &Eacute;changeons.
      </motion.h2>

      <motion.a
        href={CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-10"
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
        style={{ fontSize: "14px", letterSpacing: "0.04em", marginBottom: "80px" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <a
          href="mailto:paul@parrit.ai"
          style={{ color: "var(--text-light-muted)", textDecoration: "none" }}
        >
          paul@parrit.ai
        </a>
      </motion.p>

      <p
        style={{ color: "rgba(90, 80, 71, 0.5)", fontSize: "11px", letterSpacing: "0.1em" }}
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
      <Origin />
      {/* Stamps — vintage, slightly rotated, overlapping */}
      <Stamps />
      <Insight />
      <SavoirFaire />
      <DarkCTA />
    </>
  );
}
