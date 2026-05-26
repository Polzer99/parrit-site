"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Stamp {
  src: string;
  artist: string;
  title: string;
  origin: string;
  year: string;
  rotation: number;
}

const STAMPS: Stamp[] = [
  {
    src: "/stamps/monet-impression.jpg",
    artist: "Claude Monet",
    title: "Impression, soleil levant",
    origin: "République Française",
    year: "1872",
    rotation: -2.2,
  },
  {
    src: "/stamps/fan-kuan-travelers.jpg",
    artist: "范寬 — Fan Kuan",
    title: "Voyageurs parmi monts et torrents",
    origin: "中國 — Chine, dyn. Song",
    year: "≈ 1000",
    rotation: 1.6,
  },
  {
    src: "/stamps/renoir-canotiers.jpg",
    artist: "Pierre-Auguste Renoir",
    title: "Le déjeuner des canotiers",
    origin: "République Française",
    year: "1881",
    rotation: 1.1,
  },
  {
    src: "/stamps/guo-xi-early-spring.jpg",
    artist: "郭熙 — Guo Xi",
    title: "Début du printemps",
    origin: "中國 — Chine, dyn. Song",
    year: "1072",
    rotation: -1.4,
  },
];

interface Props {
  title: string;
  subtitle?: string;
}

export default function Stamps({ title, subtitle }: Props) {
  return (
    <section className="dark-section" style={{ overflow: "hidden" }}>
      <div className="section-inner">
        <motion.h2
          className="dark-section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: 15,
              color: "var(--text-light-muted)",
              fontWeight: 300,
              maxWidth: 640,
              margin: "0 auto 56px",
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </motion.p>
        )}

        <div className="stamps-grid">
          {STAMPS.map((s, i) => (
            <motion.div
              key={s.src}
              className="stamp"
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: s.rotation }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.12 }}
              whileHover={{ rotate: 0, y: -6, transition: { duration: 0.3 } }}
            >
              <div className="stamp-header">
                <span className="stamp-origin">{s.origin}</span>
                <span className="stamp-year">{s.year}</span>
              </div>
              <div className="stamp-image-wrapper">
                <Image
                  src={s.src}
                  alt={`${s.artist} — ${s.title}`}
                  fill
                  sizes="(max-width: 768px) 80vw, 280px"
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                  quality={85}
                />
              </div>
              <div className="stamp-footer">
                <span className="stamp-artist">{s.artist}</span>
                <span className="stamp-title">{s.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
