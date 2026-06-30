import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const body = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-body",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://parrit.ai";
const OG_IMAGE = `${SITE_URL}/opengraph-image`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "L'IA, métier par métier : la métamorphose du commercial | Parrit.ai",
  description:
    "Le chemin de l'IA appliqué à votre métier. On commence par le commercial : du porte-à-porte à la prospection par signal, jusqu'à l'administratif qui se fait seul. Et ce que l'IA vous rend : le temps de retourner chez vos clients.",
  alternates: { canonical: `${SITE_URL}/metiers` },
  openGraph: {
    title: "L'IA, métier par métier | Parrit.ai",
    description:
      "La métamorphose d'un métier, racontée en vidéo. On commence par le commercial.",
    url: `${SITE_URL}/metiers`,
    siteName: "Parrit.ai",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "L'IA métier par métier, par Parrit.ai" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "L'IA, métier par métier | Parrit.ai",
    description: "La métamorphose d'un métier, en vidéo. On commence par le commercial.",
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export default function MetiersLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${body.variable} ${mono.variable}`}>
      <body className="font-body bg-bg text-text antialiased min-h-screen">{children}</body>
    </html>
  );
}
