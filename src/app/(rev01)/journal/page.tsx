import type { Metadata } from "next";
import Link from "next/link";

import { getLocale } from "@/lib/server/locale";
import { K, RegistryLine } from "@/system/components";
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
          <K>{locale === "fr" ? "Parrit / Le Journal" : "Parrit / Journal"}</K>
          <h1>{copy.heading}</h1>
          <p>{copy.sub}</p>
        </header>

        <ol className="journal-list">
          {entries.map((entry) => (
            <li key={entry.slug}>
              <Link href={`/journal/${entry.slug}`} hrefLang="en">
                <div>
                  <K>{copy.entry}{locale === "fr" && <> · <span lang="en">EN</span></>}</K>
                  <h2 lang="en">{entry.title}</h2>
                  <p lang="en">{entry.description}</p>
                </div>
                <time dateTime={entry.date}>{entry.date}</time>
              </Link>
            </li>
          ))}
        </ol>

        <footer className="rev-footer"><RegistryLine value="PARRIT / JOURNAL · 2026" /></footer>
      </div>
    </main>
  );
}
