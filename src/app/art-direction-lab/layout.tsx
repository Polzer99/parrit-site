import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./lab.css";

/**
 * PARRIT-VISUAL-RESET-V2 — laboratoire de direction artistique.
 *
 * Isolation volontaire : ce layout n'importe NI globals.css NI parrit-tokens.css.
 * Le laboratoire ne peut donc ni hériter de la dette visuelle du site, ni la
 * modifier. Supprimer ce dossier suffit à supprimer le laboratoire.
 *
 * Jamais indexé, jamais lié depuis le site public.
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
  title: "Laboratoire de direction artistique · Parrit",
  description: "Trois directions artistiques comparables. Page interne, non publiée.",
  robots: { index: false, follow: false, nocache: true },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${body.variable} ${mono.variable}`}>
      <body className="lab" style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
