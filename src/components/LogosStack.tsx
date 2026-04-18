"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type Logo = { name: string; src: string; height?: number };

// Official simple-icons/iconify SVGs stored in /public/logos. Monochrome --text.
const LOGOS: Logo[] = [
  { name: "Claude", src: "/logos/claude.svg", height: 24 },
  { name: "ChatGPT", src: "/logos/openai.svg", height: 24 },
  { name: "Gemini", src: "/logos/googlegemini.svg", height: 24 },
  { name: "n8n", src: "/logos/n8n.svg", height: 22 },
  { name: "Telegram", src: "/logos/telegram.svg", height: 24 },
  { name: "Perplexity", src: "/logos/perplexity.svg", height: 22 },
  { name: "Obsidian", src: "/logos/obsidian.svg", height: 24 },
];

export default function LogosStack({ label }: { label: string }) {
  return (
    <section
      aria-label="Technology stack"
      style={{
        padding: "40px 24px 48px",
        borderTop: "1px solid rgba(42,36,32,0.08)",
      }}
    >
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          textAlign: "center",
          marginBottom: 32,
          fontWeight: 500,
        }}
      >
        {label}
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px 44px",
          maxWidth: 880,
          margin: "0 auto",
        }}
      >
        {LOGOS.map((logo) => (
          <div
            key={logo.name}
            title={logo.name}
            aria-label={logo.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 32,
              opacity: 0.55,
              filter: "grayscale(100%)",
              transition: "opacity 220ms ease, filter 220ms ease, transform 220ms ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.95";
              e.currentTarget.style.filter = "grayscale(0%)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.55";
              e.currentTarget.style.filter = "grayscale(100%)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Image
              src={logo.src}
              alt={logo.name}
              width={120}
              height={logo.height ?? 24}
              style={{ height: logo.height ?? 24, width: "auto" }}
              unoptimized
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
