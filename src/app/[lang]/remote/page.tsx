import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getDictionary,
  hasLocale,
  locales,
  type Locale,
} from "../dictionaries";
import LandingPage from "@/components/LandingPage";

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
  const m = dict.remote.meta;

  const languagesMap: Record<string, string> = {
    "x-default": `${SITE_URL}/fr/remote`,
  };
  locales.forEach((l) => {
    languagesMap[l] = `${SITE_URL}/${l}/remote`;
  });

  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/remote`,
      languages: languagesMap,
    },
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      url: `${SITE_URL}/${lang}/remote`,
      siteName: "Parrit.ai",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: m.ogTitle,
      description: m.ogDescription,
    },
    robots: { index: true, follow: true },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const remote = dict.remote;

  const pageUrl = `${SITE_URL}/${lang}/remote`;

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: remote.meta.ogTitle,
        serviceType: "Claude Code Remote international",
        description: remote.meta.schemaDescription,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: ["US", "GB", "DE", "AT", "CH", "BR", "AE", "AS"],
        audience: {
          "@type": "BusinessAudience",
          audienceType:
            "Founders, CEOs, international subsidiaries, distributed teams, investors",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: remote.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Parrit.ai",
            item: `${SITE_URL}/${lang}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: remote.meta.ogTitle,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <LandingPage
        data={remote}
        lang={lang as Locale}
        whatsappMessage={dict.whatsappMessages.formCta}
        quickContact={dict.quickContact}
        pageId="remote"
      />
    </>
  );
}
