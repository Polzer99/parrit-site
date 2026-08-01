import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import "../../styles/parrit-tokens.css";

/**
 * Layout provisoire du specimen.
 *
 * Il reprend, à l'identique, le patron de `design-system/layout.tsx` — y compris
 * la neutralisation du fond photo hérité de `globals.css`.
 *
 * ⚠️ Ce fichier est une DETTE ASSUMÉE, pas un modèle. Le dépôt porte déjà dix
 * racines `<html>` (04-DESIGN-SYSTEM-CONSOLIDATION.md §1.1) et celui-ci en est
 * une onzième. Il disparaît à la tranche « shell », quand le layout racine
 * unique existera. Les templates, eux, n'en dépendent pas : ils ne rendent ni
 * `<html>` ni `<body>`.
 */

const body = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Grammaire de pages — Parrit.ai",
  description: "Specimen interne des huit templates Parrit.ai.",
  robots: { index: false, follow: false, nocache: true },
};

export default function TemplateGrammarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${body.variable} ${mono.variable}`}>
      <body
        style={{
          margin: 0,
          background: "var(--color-paper-default)",
          color: "var(--color-ink-default)",
          backgroundImage: "none",
        }}
      >
        {children}
      </body>
    </html>
  );
}
