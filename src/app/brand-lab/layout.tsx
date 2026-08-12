import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./lab.css";
import LabNav from "./_components/LabNav";

/*
 * BRAND LAB · atelier interne, isolé du site public.
 *
 * Isolation : ce layout est un layout racine de segment. Il n'importe PAS
 * globals.css, donc aucune règle du site public n'entre ici, et rien de ce que
 * fait le lab ne peut fuir vers le site. Le lab a son propre système dans
 * ./lab.css.
 *
 * Non indexable : noindex/nofollow ici + disallow /brand-lab dans robots.ts.
 * Les captures de références sous public/brand-lab/refs/ sont un moodboard
 * INTERNE, jamais une publication.
 */

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parrit Brand Lab",
  description: "Atelier interne de direction artistique. Non public.",
  robots: { index: false, follow: false, nocache: true },
};

export default function BrandLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="lab">
        <LabNav />
        {children}
      </body>
    </html>
  );
}
