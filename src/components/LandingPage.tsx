"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  relatedArticles?: React.ReactNode;
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const, delay: i * 0.06 },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const ACCENTS = ["#D1132F", "#0C0C0D", "#D1132F", "#0C0C0D"];

export default function LandingPage({ data, lang, quickContact, pageId, relatedArticles }: Props) {
  return (
    <div className="landing-v4-shell">
      <div className="landing-v4-topbar">
        <Link href={`/${lang}`} aria-label="Parrit.ai" className="landing-v4-traffic" data-ph="cta" data-ph-label="Parrit.ai" data-ph-dest={`/${lang}`} data-ph-placement="topbar_logo">
          <span style={{ background: "#D1132F" }} />
          <span style={{ background: "#C67C60" }} />
          <span style={{ background: "#D0D8D7" }} />
        </Link>
        <div className="landing-v4-topbar-title">parrit.ai · {pageId}</div>
        <div className="landing-v4-topbar-actions">
          <Link href={`/${lang}`} className="landing-v4-home-link" data-ph="cta" data-ph-label="home" data-ph-dest={`/${lang}`} data-ph-placement="topbar_nav">
            ← {lang === "fr" ? "Accueil" : lang === "pt-BR" ? "Início" : lang === "zh-CN" ? "首页" : "Home"}
          </Link>
          <div className="landing-v4-lang"><LanguageSwitcher currentLang={lang} /></div>
        </div>
      </div>

      <main className="landing-v4">
        {/* HERO */}
        <section className="landing-v4-hero">
          <motion.p
            className="landing-v4-eyebrow"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {data.hero.label}
          </motion.p>
          <motion.h1
            className="landing-v4-title"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            {data.hero.titleMain}{" "}
            <em style={{ color: "var(--parrit-red)", fontStyle: "normal", fontWeight: 500 }}>
              {data.hero.titleAccent}
            </em>
          </motion.h1>
          <motion.p
            className="landing-v4-sub"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            {data.hero.quickAnswer}
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <Link href="#contact" className="landing-v4-cta-button" data-ph="cta" data-ph-label={data.hero.cta} data-ph-dest="#contact" data-ph-placement="hero">
              {data.hero.cta} →
            </Link>
          </motion.div>
        </section>

        {/* AUDIENCE */}
        <section className="landing-v4-section">
          <h2 className="landing-v4-section-title">{data.audience.title}</h2>
          <motion.div
            className="landing-v4-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {data.audience.items.map((it, i) => (
              <motion.div
                key={it.role}
                variants={cardReveal}
                className="landing-v4-card"
                style={{ ["--card-accent" as string]: ACCENTS[i % ACCENTS.length] } as React.CSSProperties}
              >
                <h3 className="landing-v4-card-title">{it.role}</h3>
                <p className="landing-v4-card-desc">{it.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* METHOD */}
        <section className="landing-v4-section">
          <h2 className="landing-v4-section-title">{data.method.title}</h2>
          <div className="landing-v4-steps">
            {data.method.steps.map((s, i) => (
              <motion.div
                key={s.n}
                className="landing-v4-step"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{ ["--card-accent" as string]: ACCENTS[i % ACCENTS.length] } as React.CSSProperties}
              >
                <span className="landing-v4-step-num">{s.n}</span>
                <div>
                  <h3 className="landing-v4-step-title">{s.title}</h3>
                  <p className="landing-v4-step-desc">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* DELIVERABLES */}
        <section className="landing-v4-section">
          <h2 className="landing-v4-section-title">{data.deliverables.title}</h2>
          <ul className="landing-v4-deliverables">
            {data.deliverables.items.map((d, i) => (
              <motion.li
                key={d}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <span className="landing-v4-tick" /> {d}
              </motion.li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="landing-v4-section">
          <h2 className="landing-v4-section-title">{data.faq.title}</h2>
          <div className="landing-v4-faq">
            {data.faq.items.map((f, i) => (
              <details
                key={f.q}
                className="landing-v4-faq-item"
                style={{ ["--card-accent" as string]: ACCENTS[i % ACCENTS.length] } as React.CSSProperties}
              >
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="landing-v4-cta" id="contact">
          <h2 className="landing-v4-cta-title">{data.ctaSection.title}</h2>
          <p className="landing-v4-cta-sub">{data.ctaSection.subtitle}</p>
          <div style={{ maxWidth: 540, margin: "0 auto" }}>
            <QuickContact strings={quickContact} page={pageId} variant="dark" lang={lang} />
          </div>
        </section>
      </main>

      {relatedArticles && (
        <div className="landing-v4-related">{relatedArticles}</div>
      )}

      <footer className="landing-v4-statusbar">
        <span>● parrit.ai</span>
        <span>Paul Larmaraud · paul.larmaraud@parrit.ai</span>
        <span className="landing-v4-date">
          {new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : lang === "zh-CN" ? "zh-CN" : lang === "pt-BR" ? "pt-BR" : "en-US", { day: "2-digit", month: "short" })}
        </span>
      </footer>
    </div>
  );
}
