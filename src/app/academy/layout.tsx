import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "../globals.css";

const heading = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const SITE_URL = "https://parrit.ai";

export const metadata: Metadata = {
  title: "Claude Code Academy — Fais agir ton ordinateur | Parrit.ai",
  description:
    "Des modules courts pour apprendre à faire AGIR ton ordinateur avec Claude Code : ranger tes mails, sortir un site en une soirée, trouver des clients pendant que tu dors. Les 10 premiers sont gratuits.",
  alternates: { canonical: `${SITE_URL}/academy` },
  openGraph: {
    title: "Claude Code Academy — par Parrit.ai",
    description:
      "Apprends à faire agir ton ordinateur, pas juste discuter avec une IA. Modules courts, concrets, prouvés sur le quotidien de Paul. Les 10 premiers gratuits.",
    url: `${SITE_URL}/academy`,
    siteName: "Parrit.ai",
    type: "website",
  },
};

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${heading.variable} ${body.variable}`}>
      <body className="font-body bg-bg text-text antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
