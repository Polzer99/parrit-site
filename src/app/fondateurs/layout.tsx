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
  title: "Les fondateurs : Paul Larmaraud & Yukun Leng | Parrit.ai",
  description:
    "Parrit.ai est une maison franco-chinoise qui construit des outils sur-mesure avec Claude Code. Paul Larmaraud façonne les prototypes, Yukun Leng les porte en production.",
  alternates: { canonical: `${SITE_URL}/fondateurs` },
  openGraph: {
    title: "Les fondateurs de Parrit.ai",
    description:
      "Paul Larmaraud façonne les prototypes, Yukun Leng les porte en production. Une maison franco-chinoise du fait-main.",
    url: `${SITE_URL}/fondateurs`,
    siteName: "Parrit.ai",
    type: "profile",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Parrit.ai : l'IA qui agit pour vous, en 14 jours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Les fondateurs de Parrit.ai",
    description:
      "Paul Larmaraud façonne les prototypes, Yukun Leng les porte en production. Une maison franco-chinoise du fait-main.",
    images: [OG_IMAGE],
  },
};

export default function FondateursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${body.variable} ${mono.variable}`}>
      <body className="font-body bg-bg text-text antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
