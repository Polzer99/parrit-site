import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import "../globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], variable: "--dg-serif", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--dg-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--dg-mono", display: "swap" });

const SITE_URL = "https://parrit.ai";

export const metadata: Metadata = {
  title: "Parler à Parrit — votre diagnostic sur-mesure | Parrit.ai",
  description:
    "Dites ce qui vous fait perdre du temps. Parrit vous rend un diagnostic sur vos deux fronts (back-office et business), adapté à votre métier, et vous l'envoie. Une conversation, pas un formulaire.",
  alternates: { canonical: `${SITE_URL}/diagnostic` },
  openGraph: {
    title: "Parler à Parrit — votre diagnostic sur-mesure",
    description:
      "Parlez à Parrit, obtenez un diagnostic concret sur vos deux fronts critiques. Le site fait tourner un agent, il ne vous montre pas une démo.",
    url: `${SITE_URL}/diagnostic`,
    siteName: "Parrit.ai",
    type: "website",
  },
};

export default function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-bg text-text antialiased min-h-screen">{children}</body>
    </html>
  );
}
