import { hasFrenchJournalTranslation } from "@/system/journal-translations";
import type { Metadata } from "next";
import { JournalCard } from "@/system/components/JournalCard";

import { getLocale } from "@/lib/server/locale";
import type { Locale } from "@/system/locale";
import { getAllJournalEntrySummaries } from "@/system/journal";
import { localizedAlternates, localizedOpenGraph } from "@/system/locale";

const DICT = {
  "en": {
    "title": "Journal",
    "heading": "This journal describes work on AI systems in businesses.",
    "sub": "The articles describe what worked and what failed, with dates and findings.",
    "entry": "Journal / Entry"
  },
  "fr": {
    "title": "Le Journal",
    "heading": "Ce journal raconte le travail sur des systèmes d'IA en entreprise.",
    "sub": "Les articles décrivent ce qui a fonctionné et ce qui a échoué, avec les dates et les constats.",
    "entry": "Journal / Entrée"
  }
} as const;

export async function generateMetadata(routeLocale?: Locale): Promise<Metadata> { const locale = routeLocale ?? await getLocale(); const copy = DICT[locale]; return { title: copy.title, description: copy.sub, openGraph: localizedOpenGraph("/journal", locale, copy.title, copy.sub), alternates: { ...localizedAlternates("/journal", locale), types: { "application/rss+xml": [{ url: "/journal/rss.xml", title: "Parrit Journal" }] } } }; }

export default async function JournalPage(routeLocale?: Locale) {
  const locale = routeLocale ?? await getLocale();
  const copy = DICT[locale];
  const entries = getAllJournalEntrySummaries(locale).filter(entry => locale !== "fr" || hasFrenchJournalTranslation(entry.slug));

  return (
    <main className="rev-page">
      <div className="rev-wrap">
        <header className="journal-header">

          <h1>{copy.heading}</h1>
          <p>{copy.sub}</p>
        </header>

        <ol className="journal-list journal-index">
          {entries.map((entry) => (
            <li key={entry.slug}>
              <JournalCard entry={entry} locale={locale}/>
            </li>
          ))}
        </ol>


      </div>
    </main>
  );
}
