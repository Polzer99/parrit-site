import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OnePager from "@/components/OnePager";
import { hasLocale, locales, type Locale } from "@/app/[lang]/dictionaries";
import { maturiteOffers, type MaturiteSlug } from "@/lib/maturite";

const SITE_URL = "https://parrit.ai";

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
    },
    twitter: {
      card: "summary_large_image",
      title: offer.h1,
      description: offer.metaDescription,
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

  return <OnePager {...maturiteOffers[slug]} lang={lang as Locale} />;
}
