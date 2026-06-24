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
  title: "Claude Code Academy : Fais agir ton ordinateur | Parrit.ai",
  description:
    "Des modules courts pour apprendre à faire AGIR ton ordinateur avec Claude Code : ranger tes mails, sortir un site en une soirée, trouver des clients pendant que tu dors. Les 10 premiers sont gratuits.",
  alternates: { canonical: `${SITE_URL}/academy` },
  openGraph: {
    title: "Claude Code Academy : par Parrit.ai",
    description:
      "Apprends à faire agir ton ordinateur, pas juste discuter avec une IA. Modules courts, concrets, prouvés sur le quotidien de Paul. Les 10 premiers gratuits.",
    url: `${SITE_URL}/academy`,
    siteName: "Parrit.ai",
    type: "website",
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
    title: "Claude Code Academy : par Parrit.ai",
    description:
      "Apprends à faire agir ton ordinateur, pas juste discuter avec une IA. Modules courts, concrets, prouvés sur le quotidien de Paul. Les 10 premiers gratuits.",
    images: [OG_IMAGE],
  },
};

export default function AcademyLayout({
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
