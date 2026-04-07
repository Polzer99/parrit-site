import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parrit.ai — Automatisation IA pour entreprises",
  description:
    "Votre entreprise, avec deux fois moins de taches repetitives. CRM sur mesure, assistant SAP, automatisation de documents et processus. Paul Larmaraud & Yukun Leng.",
  keywords: [
    "IA entreprise",
    "automatisation",
    "agents IA",
    "SAP",
    "CRM",
    "consulting IA",
    "Parrit.ai",
    "automatisation processus",
    "assistant IA",
  ],
  authors: [{ name: "Paul Larmaraud" }, { name: "Yukun Leng" }],
  openGraph: {
    title: "Parrit.ai — Automatisation IA pour entreprises",
    description:
      "Votre entreprise, avec deux fois moins de taches repetitives. Automatisation des processus par IA.",
    url: "https://parrit.ai",
    siteName: "Parrit.ai",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parrit.ai — Automatisation IA pour entreprises",
    description:
      "Votre entreprise, avec deux fois moins de taches repetitives. Automatisation des processus par IA.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Parrit.ai",
    legalName: "SASU PARRIT.AI",
    url: "https://parrit.ai",
    description:
      "Automatisation IA pour entreprises. CRM sur mesure, assistant SAP, automatisation de documents et processus.",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rueil-Malmaison",
      addressCountry: "FR",
    },
    founder: [
      { "@type": "Person", name: "Paul Larmaraud" },
      { "@type": "Person", name: "Yukun Leng" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "paul@parrit.ai",
      contactType: "sales",
    },
  };

  return (
    <html lang="fr" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
