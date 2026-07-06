import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale, locales, type Locale } from "./dictionaries";
import Chemin from "@/components/Chemin";
import { CHEMIN_CONTENT } from "@/lib/chemin-content";
import { getAllLaunches } from "@/lib/launches";

const SITE_URL = "https://parrit.ai";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = CHEMIN_CONTENT[lang as Locale];

  const languages: Record<string, string> = { "x-default": `${SITE_URL}/fr` };
  locales.forEach((l) => {
    languages[l] = `${SITE_URL}/${l}`;
  });

  return {
    metadataBase: new URL(SITE_URL),
    title: c.metaTitle,
    description: c.metaDesc,
    alternates: { canonical: `${SITE_URL}/${lang}`, languages },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDesc,
      url: `${SITE_URL}/${lang}`,
      siteName: "Parrit.ai",
      type: "website",
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

  const latestLaunches = getAllLaunches().slice(0, 6);

  return <Chemin lang={lang as Locale} launches={latestLaunches} />;
}
