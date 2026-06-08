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
  title: "Les fondateurs — Paul Larmaraud & Yukun Leng | Parrit.ai",
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
  },
};

export default function FondateursLayout({
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
