import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DiagnosticClient from "@/app/diagnostic/DiagnosticClient";
import {
  getDictionary,
  hasLocale,
  locales,
  type Locale,
} from "../dictionaries";

const SITE_URL = "https://parrit.ai";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);

  return {
    title: "Diagnostic conversationnel | Parrit.ai",
    description:
      "Un mini-diagnostic conversationnel pour cadrer les deux fronts d'un dirigeant: back-office chronophage et génération de business.",
    alternates: {
      canonical: `${SITE_URL}/${lang}/diagnostic`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${SITE_URL}/${locale}/diagnostic`]),
      ),
    },
    openGraph: {
      title: "Diagnostic conversationnel Parrit",
      description:
        "Un diagnostic indicatif pour identifier le premier chantier agentique à cadrer avec Paul.",
      url: `${SITE_URL}/${lang}/diagnostic`,
      siteName: "Parrit.ai",
      locale: dict.meta.ogLocale,
      type: "website",
    },
  };
}

export default async function LocalizedDiagnosticPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Parrit diagnostic conversationnel",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Diagnostic conversationnel indicatif pour cadrer un chantier agentique.",
    inLanguage: lang,
    url: `${SITE_URL}/${lang}/diagnostic`,
    isAccessibleForFree: true,
    provider: { "@type": "Organization", name: "Parrit.ai", url: SITE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="blog-nav">
        <Link href={`/${lang}`} className="nav-logo">
          Parrit.ai
        </Link>
        <Link href={`/${lang}/blog`} className="blog-nav-link">
          Articles
        </Link>
      </nav>
      <DiagnosticClient />
    </>
  );
}
