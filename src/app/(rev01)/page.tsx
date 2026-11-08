import type { Metadata } from "next";
import { getLocale } from "@/lib/server/locale";
import { SinglePage } from "@/system/components/SinglePage";
import { localizedAlternates, localizedOpenGraph } from "@/system/locale";
import { personJsonLd } from "@/system/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title = locale === "fr" ? "Parrit.ai · Formation à l'IA et outils sur mesure pour les entreprises, Tourcoing et Paris" : "Parrit.ai · AI training and custom tools for businesses, Tourcoing and Paris";
  const description = locale === "fr"
    ? "Nous formons vos équipes à l'IA et construisons des outils sur mesure : réponses aux clients, relances, devis, comptes rendus. Tourcoing, Paris et toute la France."
    : "We train your teams in AI and build custom tools: client replies, follow-ups, quotes and meeting notes. Tourcoing, Paris and across France.";
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
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)) }}/><SinglePage locale={locale} contactQuery={query.toString()}/></>;
}
