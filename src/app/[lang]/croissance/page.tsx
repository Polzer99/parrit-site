import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OfferPage from "@/components/OfferPage";
import { getOfferCopy } from "@/lib/offer-copy";
import { hasLocale, locales, type Locale } from "../dictionaries";

const SITE_URL = "https://parrit.ai";
const OFFER = "croissance" as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const copy = getOfferCopy(lang as Locale, OFFER);
  const languagesMap: Record<string, string> = { "x-default": `${SITE_URL}/fr/${OFFER}` };
  locales.forEach((l) => {
    languagesMap[l] = `${SITE_URL}/${l}/${OFFER}`;
  });

  return {
    metadataBase: new URL(SITE_URL),
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/${OFFER}`,
      languages: languagesMap,
    },
    openGraph: {
      title: copy.meta.title,
      description: copy.meta.description,
      url: `${SITE_URL}/${lang}/${OFFER}`,
      siteName: "Parrit.ai",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Parrit.ai : l'IA qui agit pour vous, en 14 jours",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.meta.title,
      description: copy.meta.description,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <OfferPage lang={lang as Locale} offer={OFFER} />;
}
