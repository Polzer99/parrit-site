import type { Metadata } from "next";
import { JournalCard } from "@/system/components/JournalCard";

import { getLocale } from "@/lib/server/locale";
import { getAllJournalEntrySummaries } from "@/system/journal";
import { localizedAlternates, localizedOpenGraph } from "@/system/locale";

const DICT = {
  "en": {
    "title": "Journal",
    "heading": "This journal is written on the job.",
    "sub": "What held and what broke on AI systems inside companies, dated and on the record.",
    "entry": "Journal / Entry"
  },
  "fr": {
    "title": "Le Journal",
    "heading": "Ce journal s'écrit sur les chantiers.",
    "sub": "Ce qui a tenu et ce qui a cassé sur des systèmes d'IA en entreprise, daté et consigné.",
    "entry": "Journal / Entrée"
  }
} as const;

export async function generateMetadata(): Promise<Metadata> { const locale = await getLocale(); const copy = DICT[locale]; return { title: copy.title, description: copy.sub, openGraph: localizedOpenGraph("/journal", locale, copy.title, copy.sub), alternates: { ...localizedAlternates("/journal", locale), types: { "application/rss+xml": [{ url: "/journal/rss.xml", title: "Parrit Journal" }] } } }; }

export default async function JournalPage() {
  const locale = await getLocale();
  const copy = DICT[locale];
  const entries = getAllJournalEntrySummaries();

  return (
    <main className="rev-page">
      <div className="rev-wrap">
        <header className="journal-header">

          <h1>{copy.heading}</h1>
          <p>{copy.sub}</p>
          {locale === "fr" && <p>Articles en anglais</p>}
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
