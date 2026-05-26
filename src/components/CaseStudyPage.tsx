"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import QuickContact, { type QuickContactStrings } from "@/components/QuickContact";
import FlowDiagram from "@/components/FlowDiagram";
import type { Locale } from "@/app/[lang]/dictionaries";

export interface CaseStudyData {
  slug: string;
  hero: {
    badge: string;
    titleMain: string;
    titleAccent: string;
    intro: string;
  };
  profile: {
    title: string;
    items: { label: string; value: string }[];
  };
  transformation: {
    title: string;
    quote: string;
    body: string;
  };
  domains: {
    title: string;
    items: string[];
  };
  result: {
    title: string;
    metrics: { value: string; label: string }[];
    note?: string;
  };
  stack: {
    title: string;
    items: string[];
  };
  cta: {
    title: string;
    subtitle: string;
  };
}

interface Props {
  data: CaseStudyData;
  lang: Locale;
  quickContact: QuickContactStrings;
  pageId: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay: i * 0.08 },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function CaseStudyPage({
  data,
  lang,
  quickContact,
  pageId,
}: Props) {
  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            width: "100%",
          }}
        >
          <Link
            href={`/${lang}`}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 18,
              color: "var(--text)",
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            PARRIT.AI
          </Link>
          <LanguageSwitcher currentLang={lang} />
        </div>
      </nav>

      {/* HERO */}
      <section
        className="hero-section"
        style={{ minHeight: "auto", paddingTop: 120, paddingBottom: 72 }}
      >
        <div className="hero-content" style={{ maxWidth: 880 }}>
          <motion.span
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
              marginBottom: 24,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            {data.hero.badge}
          </motion.span>

          <motion.h1
            className="hero-title"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            {data.hero.titleMain}{" "}
            <em className="hero-accent">{data.hero.titleAccent}</em>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            style={{ maxWidth: 760 }}
          >
            {data.hero.intro}
          </motion.p>
        </div>
      </section>

      {/* FLOW DIAGRAM */}
      <FlowDiagram slug={data.slug} />

      {/* RÉSULTATS */}
      <section className="dark-section">
        <div className="section-inner" style={{ maxWidth: 880 }}>
          <motion.h2
            className="dark-section-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ marginBottom: 40, textAlign: "center" }}
          >
            {data.result.title}
          </motion.h2>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid-3-cards"
            style={{ marginBottom: data.result.note ? 32 : 0 }}
          >
            {data.result.metrics.map((metric, i) => (
              <motion.div
                key={i}
                variants={cardReveal}
                style={{
                  padding: "28px 22px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(32px, 5vw, 44px)",
                    fontWeight: 400,
                    color: "#c8956c",
                    lineHeight: 1,
                    marginBottom: 12,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {metric.value}
                </span>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--text-light-muted)",
                    lineHeight: 1.5,
                    fontWeight: 300,
                  }}
                >
                  {metric.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {data.result.note && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--text-light-muted)",
                fontStyle: "italic",
                fontWeight: 300,
                textAlign: "center",
                maxWidth: 640,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              {data.result.note}
            </motion.p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="contact">
        <motion.h2
          className="cta-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {data.cta.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            textAlign: "center",
            color: "var(--text-light-muted)",
            fontFamily: "var(--font-body)",
            fontSize: 16,
            marginBottom: 32,
            fontWeight: 300,
            padding: "0 24px",
          }}
        >
          {data.cta.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          style={{ padding: "0 24px" }}
        >
          <QuickContact strings={quickContact} page={pageId} variant="dark" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            marginTop: 28,
            display: "flex",
            justifyContent: "center",
            gap: 24,
            flexWrap: "wrap",
            padding: "0 24px",
            fontFamily: "var(--font-body)",
            fontSize: 13,
          }}
        >
          <a
            href="mailto:paul.larmaraud@parrit.ai"
            style={{
              color: "var(--text-light-muted)",
              textDecoration: "none",
              borderBottom: "1px solid rgba(255,255,255,0.18)",
              paddingBottom: 2,
            }}
          >
            paul.larmaraud@parrit.ai
          </a>
        </motion.div>
      </section>
    </>
  );
}
