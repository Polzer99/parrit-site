import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale, type Locale } from "../dictionaries";
import HomeClient from "../HomeClient";

// Ancienne page d'accueil « desktop-OS », conservée et accessible (réversible).
// Non indexée : la page d'accueil canonique est désormais le « chemin » sur /[lang].
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <HomeClient lang={lang as Locale} />;
}
