import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./dictionaries";
import HomeClient from "./HomeClient";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <HomeClient lang={lang as Locale} />;
}
