import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parrit.ai \u2014 Automatisation IA pour entreprises",
  description:
    "Deux fois moins de t\u00e2ches r\u00e9p\u00e9titives. On automatise vos processus avec l\u2019IA. Prototypage en 48h, d\u00e9ploiement inclus. Paul Larmaraud & Yukun Leng.",
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
    title: "Parrit.ai \u2014 Automatisation IA pour entreprises",
    description:
      "Deux fois moins de t\u00e2ches r\u00e9p\u00e9titives. Prototypage en 48h, d\u00e9ploiement inclus.",
    url: "https://parrit.ai",
    siteName: "Parrit.ai",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parrit.ai \u2014 Automatisation IA pour entreprises",
    description:
      "Deux fois moins de t\u00e2ches r\u00e9p\u00e9titives. Prototypage en 48h, d\u00e9ploiement inclus.",
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
      "Automatisation IA pour entreprises. Prototypage en 48h, d\u00e9ploiement inclus.",
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
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
