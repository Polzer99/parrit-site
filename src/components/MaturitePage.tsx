import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OnePager from "@/components/OnePager";
import RelatedArticles from "@/components/RelatedArticles";
import { hasLocale, locales, type Locale } from "@/app/[lang]/dictionaries";
import { maturiteOffers, type MaturiteSlug } from "@/lib/maturite";
import type { PillarSlug } from "@/lib/pillars";

const maturitePillar: Record<MaturiteSlug, PillarSlug> = {
  audit: "agents-ia",
  "deploiement-agents": "agents-ia",
  "optimisation-flotte": "agents-ia",
  "outils-agentiques": "logiciel-ia-sur-mesure",
  "masterclass-ia": "formation-agents-ia",
  "masterclass-metier": "formation-agents-ia",
  "sessions-mcp": "formation-agents-ia",
};

const SITE_URL = "https://parrit.ai";
const OG_IMAGE = `${SITE_URL}/opengraph-image`;

export function generateMaturiteStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMaturiteMetadata({
  params,
  slug,
}: {
  params: Promise<{ lang: string }>;
  slug: MaturiteSlug;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const offer = maturiteOffers[slug];
  const languagesMap: Record<string, string> = {
    "x-default": `${SITE_URL}/fr/${slug}`,
  };

  locales.forEach((locale) => {
    languagesMap[locale] = `${SITE_URL}/${locale}/${slug}`;
  });

  return {
    metadataBase: new URL(SITE_URL),
    title: `${offer.eyebrow} | Parrit.ai`,
    description: offer.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/${lang}/${slug}`,
      languages: languagesMap,
    },
    openGraph: {
      title: offer.h1,
      description: offer.metaDescription,
      url: `${SITE_URL}/${lang}/${slug}`,
      siteName: "Parrit.ai",
      type: "article",
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
      title: offer.h1,
      description: offer.metaDescription,
      images: [OG_IMAGE],
    },
    robots: { index: true, follow: true },
  };
}

export default async function MaturitePage({
  params,
  slug,
}: {
  params: Promise<{ lang: string }>;
  slug: MaturiteSlug;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <OnePager
      {...maturiteOffers[slug]}
      lang={lang as Locale}
      relatedArticles={<RelatedArticles lang={lang} pillar={maturitePillar[slug]} />}
    />
  );
}
