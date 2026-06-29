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
  title: "Le chemin de l'IA : du premier chat à la flotte d'agents | Parrit.ai",
  description:
    "Un parcours en sept étapes, du premier chat jusqu'à une flotte d'agents qui travaillent seuls. À chaque palier, ce qu'on déploie concrètement, en images. Trouvez votre point de départ.",
  alternates: { canonical: `${SITE_URL}/fr` },
  openGraph: {
    title: "Le chemin de l'IA, étape par étape | Parrit.ai",
    description:
      "Du premier chat à la flotte d'agents autonomes : les sept paliers de maturité, en images. Trouvez où vous en êtes.",
    url: `${SITE_URL}/fr`,
    siteName: "Parrit.ai",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Le chemin de l'IA par Parrit.ai" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Le chemin de l'IA, étape par étape | Parrit.ai",
    description:
      "Du premier chat à la flotte d'agents autonomes : les sept paliers de maturité, en images.",
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export default function CheminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${body.variable} ${mono.variable}`}>
      <body className="font-body bg-bg text-text antialiased min-h-screen">{children}</body>
    </html>
  );
}
