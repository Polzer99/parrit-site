import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import "../../globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--bsd-serif",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--bsd-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--bsd-mono",
  display: "swap",
});

const SITE_URL = "https://parrit.ai";

export const metadata: Metadata = {
  title: "Détecteur de Bullshit IA — l'œil de Paul Larmaraud | Parrit.ai",
  description:
    "Collez un post, un mail ou un pitch sur l'IA. On regarde s'il y a quelqu'un derrière : score de bullshit 0-100, décomposition en 4 axes et verdict sans complaisance. ~90 % du marché parle à 30 000 pieds.",
  alternates: { canonical: `${SITE_URL}/outils/detecteur-bullshit` },
  openGraph: {
    title: "Détecteur de Bullshit IA — par Parrit.ai",
    description:
      "~90 % du contenu IA est du bullshit. Le détecteur le passe au crible : preuve d'usage réel, delta d'information, le comment vs la promesse, tromperie vs honnêteté.",
    url: `${SITE_URL}/outils/detecteur-bullshit`,
    siteName: "Parrit.ai",
    type: "website",
  },
};

export default function DetecteurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${serif.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="bg-bg text-text antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
