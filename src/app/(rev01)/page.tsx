import type { Metadata } from "next";
import { getLocale } from "@/lib/server/locale";
import { SinglePage } from "@/system/components/SinglePage";
import { localizedAlternates, localizedOpenGraph } from "@/system/locale";
import { personJsonLd } from "@/system/jsonld";
import { getAllJournalEntrySummaries } from "@/system/journal";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title = locale === "fr" ? "Parrit.ai · Transformation IA et développement de logiciels pour les entreprises, Tourcoing et Paris" : "Parrit.ai · AI transformation and software development for businesses, Tourcoing and Paris";
  const description = locale === "fr"
    ? "Vos équipes prennent l'IA en main. Nous développons les logiciels qui leur manquent. Tourcoing, Paris et toute la France."
    : "Your teams take AI in hand. We build the software they are missing. Tourcoing, Paris and across France.";
  return { title: { absolute: title }, description, alternates: localizedAlternates("/", locale), openGraph: localizedOpenGraph("/", locale, title, description) };
}
export default async function HomePage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(await props?.searchParams ?? {})) {
    for (const item of Array.isArray(value) ? value : value === undefined ? [] : [value]) query.append(key, item);
  }
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)) }}/><SinglePage locale={locale} contactQuery={query.toString()} latestEntries={getAllJournalEntrySummaries(locale).slice(0, 3)}/></>;
}
