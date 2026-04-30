"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ButtonColorful } from "@/components/ui/button-colorful";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import QuickContact, { type QuickContactStrings } from "@/components/QuickContact";
import type { Locale } from "@/app/[lang]/dictionaries";

export interface LandingPageData {
  hero: {
    label: string;
    titleMain: string;
    titleAccent: string;
    quickAnswer: string;
    cta: string;
  };
  audience: { title: string; items: { role: string; desc: string }[] };
  method: { title: string; steps: { n: string; title: string; desc: string }[] };
  deliverables: { title: string; items: string[] };
  faq: { title: string; items: { q: string; a: string }[] };
  nextSteps: {
    title: string;
    subtitle: string;
    options: { kind: string; title: string; desc: string }[];
  };
  ctaSection: { title: string; subtitle: string; primary: string; secondary: string };
}

interface Props {
  data: LandingPageData;
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

export default function LandingPage({
  data,
  lang,
  quickContact,
  pageId,
}: Props) {
  const contactAnchor = "#contact";

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
      <section className="hero-section" style={{ minHeight: "auto", paddingTop: 120, paddingBottom: 80 }}>
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
            {data.hero.label}
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
            {data.hero.quickAnswer}
          </motion.p>

          <motion.div
            className="hero-cta-block"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <Link href={contactAnchor} className="hero-cta-link">
              <ButtonColorful label={data.hero.cta} className="h-14 px-8 text-base" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="light-section">
        <div className="section-inner" style={{ maxWidth: 1040 }}>
          <motion.h2
            className="light-section-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ marginBottom: 40 }}
          >
            {data.audience.title}
          </motion.h2>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {data.audience.items.map((item) => (
              <motion.div
                key={item.role}
                variants={cardReveal}
                style={{
                  padding: "24px 22px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "rgba(255,255,255,0.55)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 18,
                    fontWeight: 500,
                    color: "var(--text)",
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}
                >
                  {item.role}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    fontWeight: 300,
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* METHOD */}
      <section className="dark-section">
        <div className="section-inner" style={{ maxWidth: 880 }}>
          <motion.h2
            className="dark-section-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ marginBottom: 48 }}
          >
            {data.method.title}
          </motion.h2>

          <motion.ol
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {data.method.steps.map((step) => (
              <motion.li
                key={step.n}
                variants={cardReveal}
                style={{
                  display: "flex",
                  gap: 24,
                  alignItems: "flex-start",
                  padding: "20px 22px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 32,
                    fontWeight: 300,
                    color: "#c8956c",
                    minWidth: 36,
                    lineHeight: 1,
                  }}
                >
                  {step.n}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 20,
                      fontWeight: 500,
                      color: "#fff",
                      marginBottom: 6,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      color: "var(--text-light-muted)",
                      lineHeight: 1.65,
                      fontWeight: 300,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* DELIVERABLES */}
      <section className="light-section">
        <div className="section-inner" style={{ maxWidth: 880 }}>
          <motion.h2
            className="light-section-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ marginBottom: 32 }}
          >
            {data.deliverables.title}
          </motion.h2>

          <motion.ul
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {data.deliverables.items.map((item, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  color: "var(--text)",
                  lineHeight: 1.55,
                  fontWeight: 300,
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <span
                  style={{
                    color: "#c8956c",
                    fontWeight: 500,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  →
                </span>
                <span>{item}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="dark-section">
        <div className="section-inner" style={{ maxWidth: 880 }}>
          <motion.h2
            className="dark-section-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ marginBottom: 40 }}
          >
            {data.faq.title}
          </motion.h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.faq.items.map((item, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  padding: "18px 22px",
                }}
              >
                <summary
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 17,
                    fontWeight: 500,
                    color: "#fff",
                    cursor: "pointer",
                    listStyle: "none",
                    lineHeight: 1.4,
                  }}
                >
                  {item.q}
                </summary>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--text-light-muted)",
                    lineHeight: 1.7,
                    fontWeight: 300,
                    marginTop: 12,
                  }}
                >
                  {item.a}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* NEXT STEPS */}
      <section className="light-section" id="next-steps">
        <div className="section-inner" style={{ maxWidth: 1040 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ textAlign: "center", marginBottom: 40 }}
          >
            <h2 className="light-section-title" style={{ marginBottom: 12 }}>
              {data.nextSteps.title}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 16,
                lineHeight: 1.6,
                color: "var(--text-muted)",
                fontWeight: 300,
                maxWidth: 640,
                margin: "0 auto",
              }}
            >
              {data.nextSteps.subtitle}
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            {data.nextSteps.options.map((opt) => (
              <motion.div
                key={opt.title}
                variants={cardReveal}
                style={{
                  padding: "24px 22px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "rgba(255,255,255,0.55)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "#c8956c",
                    marginBottom: 10,
                    fontWeight: 500,
                  }}
                >
                  {opt.kind}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 19,
                    fontWeight: 500,
                    color: "var(--text)",
                    marginBottom: 10,
                    lineHeight: 1.3,
                  }}
                >
                  {opt.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    fontWeight: 300,
                    flex: 1,
                  }}
                >
                  {opt.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA — quick contact, friction max baissée */}
      <section className="cta-section" id="contact">
        <motion.h2
          className="cta-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {data.ctaSection.title}
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
          {data.ctaSection.subtitle}
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
