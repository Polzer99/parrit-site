"use client";

import { motion } from "framer-motion";

interface FlowStep {
  label: string;
  items: string[];
  highlight?: boolean;
}

type FlowSlug =
  | "tpe-artisan-commercant"
  | "pme-marque-b2c"
  | "cabinet-conseil"
  | "grand-groupe";

const FLOWS: Record<FlowSlug, FlowStep[]> = {
  "tpe-artisan-commercant": [
    {
      label: "Canaux entrants",
      items: ["E-commerce", "TikTok / Snapchat", "Téléphone", "Point de vente"],
    },
    {
      label: "Agent Parrit",
      items: [
        "Capture en temps réel",
        "Qualification typologie",
        "Routage automatique",
      ],
      highlight: true,
    },
    {
      label: "Sorties",
      items: [
        "WhatsApp segmenté",
        "Stocks à jour",
        "Dashboard 10 min / jour",
      ],
    },
  ],
  "pme-marque-b2c": [
    {
      label: "50 prompts / jour",
      items: ["Catégories produit", "Cas d'usage", "Comparatifs prix"],
    },
    {
      label: "Agent Parrit",
      items: [
        "Scrape Rufus + Alexa",
        "Mesure share-of-voice IA",
        "Détection concurrents",
      ],
      highlight: true,
    },
    {
      label: "Sorties",
      items: [
        "Dashboard quotidien",
        "Alertes Telegram",
        "Réajustement fiches produit",
      ],
    },
  ],
  "cabinet-conseil": [
    {
      label: "Signaux entrants",
      items: [
        "18 podcasts / jour",
        "Presse spécialisée",
        "Levées + nominations",
      ],
    },
    {
      label: "Agent Parrit",
      items: [
        "Extraction dirigeant",
        "Enrichissement contact",
        "Copywriting voix dirigeant",
      ],
      highlight: true,
    },
    {
      label: "Sorties",
      items: [
        "Mail Operating Partner",
        "Réponses triées chaud / froid",
        "Reporting RDV pris",
      ],
    },
  ],
  "grand-groupe": [
    {
      label: "Entrée",
      items: ["1 cas métier réel", "1 dirigeant", "1 contexte business"],
    },
    {
      label: "Sprint Parrit 2 jours",
      items: [
        "Cadrage + co-construction",
        "Claude Code + Gemini",
        "Branchement outils internes",
      ],
      highlight: true,
    },
    {
      label: "Sortie",
      items: [
        "Agent en production J+2",
        "Dirigeant autonome",
        "Train-the-trainer interne",
      ],
    },
  ],
};

interface Props {
  slug: string;
  title?: string;
}

export default function FlowDiagram({ slug, title }: Props) {
  const steps = FLOWS[slug as FlowSlug];
  if (!steps) return null;

  return (
    <section className="light-section" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="section-inner" style={{ maxWidth: 1100 }}>
        {title && (
          <motion.h2
            className="light-section-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ marginBottom: 36, textAlign: "center" }}
          >
            {title}
          </motion.h2>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="flow-grid"
        >
          {steps.map((step, idx) => (
            <div key={step.label} style={{ display: "contents" }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                style={{
                  padding: "24px 20px",
                  borderRadius: 14,
                  background: step.highlight
                    ? "linear-gradient(180deg, rgba(200,149,108,0.12) 0%, rgba(200,149,108,0.04) 100%)"
                    : "rgba(255,255,255,0.7)",
                  border: step.highlight
                    ? "1px solid rgba(200,149,108,0.45)"
                    : "1px solid rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 200,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-body)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: step.highlight ? "#c8956c" : "var(--text-muted)",
                    marginBottom: 12,
                  }}
                >
                  Étape {idx + 1}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 19,
                    fontWeight: 500,
                    color: "var(--text)",
                    marginBottom: 16,
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.label}
                </h3>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {step.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        color: "var(--text-muted)",
                        lineHeight: 1.5,
                        fontWeight: 400,
                        paddingLeft: 16,
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "0.55em",
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: step.highlight
                            ? "#c8956c"
                            : "var(--text-muted)",
                          opacity: step.highlight ? 1 : 0.45,
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              {idx < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: idx * 0.15 + 0.2 }}
                  className="flow-arrow"
                  aria-hidden="true"
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 20H32M32 20L24 12M32 20L24 28"
                      stroke="#c8956c"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
