import { notFound } from "next/navigation";
import Chemin from "@/components/Chemin";
import { hasLocale, type Locale } from "./dictionaries";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <Chemin lang={lang as Locale} />;
}
