"use client";

import { motion } from "framer-motion";

type AnimationType = "transformation" | "prototype" | "leadgen";

interface Props {
  type: AnimationType;
}

/* Mini-animations SVG qui illustrent chaque offre.
   Tournent en boucle, attirent l'œil sans jamais distraire. */

function TransformationAnim() {
  return (
    <svg width="100%" height="100" viewBox="0 0 100 100" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx="50"
          cy="50"
          r={14 + i * 11}
          fill="none"
          stroke="#c8956c"
          strokeWidth="1.2"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{
            opacity: [0, 0.55, 0.55, 0],
            scale: [0.7, 1, 1, 1.15],
          }}
          transition={{
            duration: 3,
            delay: i * 0.4,
            repeat: Infinity,
            repeatDelay: 0.4,
            ease: "easeOut",
          }}
        />
      ))}
      <motion.circle
        cx="50"
        cy="50"
        r="6"
        fill="#c8956c"
        animate={{ scale: [0.85, 1.1, 0.85] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function PrototypeAnim() {
  const lines = [
    { w: 60, x: 18, y: 28 },
    { w: 75, x: 25, y: 40 },
    { w: 45, x: 25, y: 52 },
    { w: 65, x: 18, y: 64 },
    { w: 35, x: 25, y: 76 },
  ];
  return (
    <svg width="100%" height="100" viewBox="0 0 100 100" aria-hidden="true">
      {lines.map((l, i) => (
        <motion.rect
          key={i}
          x={l.x}
          y={l.y}
          width={l.w}
          height="3.5"
          rx="1.5"
          fill="#c8956c"
          initial={{ scaleX: 0, originX: 0, opacity: 0 }}
          animate={{
            scaleX: [0, 1, 1, 0],
            opacity: [0, 1, 1, 0],
          }}
          style={{ transformOrigin: `${l.x}px ${l.y + 1.75}px` }}
          transition={{
            duration: 3,
            delay: i * 0.3,
            repeat: Infinity,
            repeatDelay: 0.4,
            times: [0, 0.35, 0.75, 1],
            ease: "easeOut",
          }}
        />
      ))}
      <motion.rect
        x="14"
        y="20"
        width="2.5"
        height="7"
        fill="#c8956c"
        animate={{ opacity: [1, 0, 1, 0, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
    </svg>
  );
}

function LeadGenAnim() {
  return (
    <svg width="100%" height="100" viewBox="0 0 100 100" aria-hidden="true">
      {/* silhouette gauche */}
      <motion.g
        initial={{ x: -12, opacity: 0 }}
        animate={{ x: [-12, 0, 0, -12], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          times: [0, 0.25, 0.85, 1],
          ease: "easeOut",
        }}
      >
        <circle cx="28" cy="38" r="7" fill="#c8956c" />
        <path
          d="M18 60 Q18 70, 28 70 Q38 70, 38 60 L38 52 Q38 48, 34 48 L22 48 Q18 48, 18 52 Z"
          fill="#c8956c"
        />
      </motion.g>
      {/* silhouette droite */}
      <motion.g
        initial={{ x: 12, opacity: 0 }}
        animate={{ x: [12, 0, 0, 12], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 3.5,
          delay: 0.2,
          repeat: Infinity,
          times: [0, 0.25, 0.85, 1],
          ease: "easeOut",
        }}
      >
        <circle cx="72" cy="38" r="7" fill="#c8956c" />
        <path
          d="M62 60 Q62 70, 72 70 Q82 70, 82 60 L82 52 Q82 48, 78 48 L66 48 Q62 48, 62 52 Z"
          fill="#c8956c"
        />
      </motion.g>
      {/* étincelle poignée de main */}
      <motion.circle
        cx="50"
        cy="55"
        r="3.5"
        fill="#c8956c"
        animate={{ scale: [0, 1.4, 1, 0], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 3.5,
          delay: 0.6,
          repeat: Infinity,
          times: [0, 0.3, 0.85, 1],
          ease: "easeOut",
        }}
      />
    </svg>
  );
}

export default function OfferAnimation({ type }: Props) {
  if (type === "transformation") return <TransformationAnim />;
  if (type === "prototype") return <PrototypeAnim />;
  if (type === "leadgen") return <LeadGenAnim />;
  return null;
}

export function offerTypeFromTitle(title: string): AnimationType | null {
  const lower = title.toLowerCase();
  if (lower.includes("transformation")) return "transformation";
  if (lower.includes("prototyp")) return "prototype";
  if (lower.includes("lead")) return "leadgen";
  return null;
}
