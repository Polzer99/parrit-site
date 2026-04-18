"use client";

import { motion } from "framer-motion";

type ModelCopy = {
  kind: string;
  title: string;
  intro?: string;
  bullets: string[];
  footnote?: string;
  recommendedBadge?: string;
};

export type PricingModelsCopy = {
  title: string;
  models: ModelCopy[];
};

export default function PricingModels({ copy }: { copy: PricingModelsCopy }) {
  const project = copy.models[0];
  const performance = copy.models[1];
  if (!project || !performance) return null;
  return (
    <section
      aria-label="Pricing models"
      style={{
        padding: "48px 24px 56px",
        background: "transparent",
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(24px, 3.4vw, 34px)",
          fontWeight: 500,
          lineHeight: 1.2,
          textAlign: "center",
          color: "var(--text)",
          maxWidth: 720,
          margin: "0 auto 32px",
          letterSpacing: "-0.015em",
        }}
      >
        {copy.title}
      </motion.h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
          maxWidth: 1040,
          margin: "0 auto",
        }}
      >
        {/* Card 1 — Project */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          style={{
            padding: "28px 26px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.015)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: 16,
              fontWeight: 500,
            }}
          >
            {project.kind}
          </p>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 22,
              fontWeight: 500,
              color: "var(--text)",
              marginBottom: 24,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}
          >
            {project.title}
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {project.bullets.map((b, i) => (
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
                    background: "var(--text-muted)",
                  }}
                />
                {b}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Card 2 — Performance (recommended) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            padding: "28px 26px",
            borderRadius: 14,
            border: "1px solid rgba(200, 149, 108, 0.35)",
            background: "linear-gradient(180deg, rgba(200,149,108,0.08) 0%, rgba(200,149,108,0.02) 100%)",
            position: "relative",
          }}
        >
          {performance.recommendedBadge && (
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
              }}
            >
              {performance.recommendedBadge}
            </span>
          )}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#c8956c",
              marginBottom: 12,
              fontWeight: 500,
              marginTop: performance.recommendedBadge ? 0 : 16,
            }}
          >
            {performance.kind}
          </p>
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
            {performance.title}
          </h3>
          {performance.intro && (
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
              {performance.intro}
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
            }}
          >
            {performance.bullets.map((b, i) => (
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
                    background: "#c8956c",
                  }}
                />
                {b}
              </li>
            ))}
          </ul>
          {performance.footnote && (
            <p
              style={{
                marginTop: 24,
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontStyle: "italic",
                color: "var(--text-muted)",
                lineHeight: 1.5,
                fontWeight: 300,
                paddingTop: 20,
                borderTop: "1px solid rgba(200,149,108,0.18)",
              }}
            >
              {performance.footnote}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
