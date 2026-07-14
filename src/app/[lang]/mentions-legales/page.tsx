import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, locales, type Locale } from "../dictionaries";
import LegalDoc, { getLegalCopy } from "@/components/LegalDoc";

const SITE_URL = "https://parrit.ai";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { metaTitle, metaDesc } = getLegalCopy("mentions-legales", lang as Locale);
  return {
    title: metaTitle,
    description: metaDesc,
    alternates: { canonical: `${SITE_URL}/${lang}/mentions-legales` },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <LegalDoc kind="mentions-legales" lang={lang as Locale} />;
}
