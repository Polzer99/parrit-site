import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "../dictionaries";
import HomeClient from "../HomeClient";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default async function OsClassicPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <HomeClient lang={lang as Locale} />;
}
