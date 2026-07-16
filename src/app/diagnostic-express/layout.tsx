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
  title: "Diagnostic Express : votre site passé au crible en 2 minutes | Parrit.ai",
  description:
    "Laissez votre site web et votre fonction. Vous recevez par mail un diagnostic sur-mesure de vos deux fronts (back-office et business), avec un code pour le consulter.",
  alternates: { canonical: `${SITE_URL}/diagnostic-express` },
  openGraph: {
    title: "Diagnostic Express : par Parrit.ai",
    description:
      "Un diagnostic sur-mesure de vos deux fronts critiques, envoyé par mail avec un code d'accès.",
    url: `${SITE_URL}/diagnostic-express`,
    siteName: "Parrit.ai",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Parrit.ai : diagnostic IA avant transformation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diagnostic Express : par Parrit.ai",
    description:
      "Un diagnostic sur-mesure de vos deux fronts critiques, envoyé par mail avec un code d'accès.",
    images: [OG_IMAGE],
  },
};

export default function DiagnosticExpressLayout({
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
