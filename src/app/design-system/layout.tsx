import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import "../../styles/parrit-tokens.css";

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
  title: "Design system — Parrit.ai",
  description: "Page specimen interne du design system Parrit.ai.",
  // Page interne : jamais indexée.
  robots: { index: false, follow: false, nocache: true },
};

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${body.variable} ${mono.variable}`}>
      <body
        style={{
          margin: 0,
          background: "var(--color-paper-default)",
          color: "var(--color-ink-default)",
          // Le specimen neutralise volontairement le fond photo hérité de
          // globals.css : une page Parrit ne dépend pas d'une image de fond.
          backgroundImage: "none",
        }}
      >
        {children}
      </body>
    </html>
  );
}
