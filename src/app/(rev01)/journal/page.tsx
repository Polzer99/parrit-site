import type { Metadata } from "next";
import Link from "next/link";

import { getLocale } from "@/lib/server/locale";
import { K, NewsletterCapture, RegistryLine } from "@/system/components";
import { getAllJournalEntrySummaries } from "@/system/journal";
import { localizedAlternates, localizedOpenGraph } from "@/system/locale";

const DICT = {
  "en": {
    "title": "Journal",
    "heading": "This journal is written on the job.",
    "sub": "What held and what broke, on AI systems inside companies. Dated and on the record.",
    "entry": "Journal / Entry",
    "subscription": "Journal / Subscription",
    "delivery": "Every entry goes out by e-mail the day it appears.",
    "unsubscribe": "One address is enough. Unsubscribe in one click."
  },
  "fr": {
    "title": "Le Journal",
    "heading": "Ce journal s'écrit sur les chantiers.",
    "sub": "Ce qui a tenu, ce qui a cassé, sur des systèmes IA en entreprise. Daté et consigné.",
    "entry": "Journal / Entrée",
    "subscription": "Journal / Abonnement",
    "delivery": "Chaque entrée arrive par e-mail le jour où elle paraît.",
    "unsubscribe": "Une adresse suffit. Désabonnement en un clic."
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
          <RegistryLine value="PARRIT / JOURNAL · REV 01 · 2026" />
          <h1>{copy.heading}</h1>
          <p>{copy.sub}</p>
        </header>

        <ol className="journal-list">
          {entries.map((entry) => (
            <li key={entry.slug}>
              <Link href={`/journal/${entry.slug}`}>
                <div>
                  <K>{copy.entry}</K>
                  <h2>{entry.title}</h2>
                  <p>{entry.description}</p>
                </div>
                <time dateTime={entry.date}>{entry.date}</time>
              </Link>
            </li>
          ))}
        </ol>

        <section className="ri-stage r2-dark" aria-label={copy.subscription}>
          <K>{copy.subscription}</K>
          <p>{copy.delivery}</p>
          <p>{copy.unsubscribe}</p>
          <NewsletterCapture locale={locale} />
        </section>

        <footer className="rev-footer">
          <RegistryLine value="PARRIT / JOURNAL · REV 01 · 2026" />
        </footer>
      </div>
    </main>
  );
}
