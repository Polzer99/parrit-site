import type { Metadata } from "next";
import { getLocale } from "@/lib/server/locale";
import { SinglePage } from "@/system/components/SinglePage";
import { localizedAlternates, localizedOpenGraph } from "@/system/locale";
import { personJsonLd } from "@/system/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title = locale === "fr" ? "Parrit.ai · Agents et logiciels d'IA en production, Lille et Hauts-de-France" : "Parrit.ai · AI agents and software in production";
  const description = locale === "fr"
    ? "Parrit.ai transforme vos problèmes opérationnels en systèmes qui fonctionnent : agents, logiciels et formation IA à Lille et en Hauts-de-France."
    : "Parrit.ai turns operational problems into systems that work: AI agents, business software and team training, from the Lille area to your company.";
  return { title: { absolute: title }, description, alternates: localizedAlternates("/", locale), openGraph: localizedOpenGraph("/", locale, title, description) };
}
export default async function HomePage() {
  const locale = await getLocale();
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}/><SinglePage locale={locale}/></>;
}
