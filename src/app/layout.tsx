import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parrit.ai — IA, Automatisation & Agents pour entreprises",
  description:
    "On construit, on déploie, on opère vos solutions IA. Prototypage en 48h, automatisation de processus, agents intelligents. Fondé par Paul Larmaraud & Yukun Leng.",
  keywords: [
    "IA entreprise",
    "automatisation",
    "agents IA",
    "n8n",
    "Next.js",
    "SAP",
    "CRM",
    "consulting IA",
    "Parrit.ai",
  ],
  authors: [{ name: "Paul Larmaraud" }, { name: "Yukun Leng" }],
  openGraph: {
    title: "Parrit.ai — IA, Automatisation & Agents pour entreprises",
    description:
      "On construit, on déploie, on opère vos solutions IA. Prototypage en 48h, automatisation de processus, agents intelligents.",
    url: "https://parrit.ai",
    siteName: "Parrit.ai",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parrit.ai — IA, Automatisation & Agents pour entreprises",
    description:
      "On construit, on déploie, on opère vos solutions IA. Prototypage en 48h.",
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
      "IA, Automatisation & Agents pour entreprises. Prototypage en 48h, déploiement et opérations.",
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
