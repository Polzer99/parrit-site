import type { Metadata } from "next";
import Link from "next/link";

import { getLocale } from "@/lib/server/locale";
import { K, RegisterInterest, RegistryLine } from "@/system/components";
import { getAllJournalEntrySummaries } from "@/system/journal";
import { localizedAlternates } from "@/system/locale";

const DICT = {
  en: { title: "Journal", description: "Field notes on building and operating company systems.", sub: "Field notes on the systems we examine, build and operate.", entry: "Journal / Entry", registerAria: "Register your interest" },
  fr: { title: "Journal", description: "Notes de terrain sur la construction et l'exploitation de systèmes d'entreprise.", sub: "Notes de terrain sur les systèmes que nous examinons, construisons et faisons tourner.", entry: "Journal / Entrée", registerAria: "Demandez votre esquisse" },
} as const;

export async function generateMetadata(): Promise<Metadata> { const copy = DICT[await getLocale()]; return { title: copy.title, description: copy.description, alternates: localizedAlternates("/journal") }; }

export default async function JournalPage() {
  const locale = await getLocale();
  const copy = DICT[locale];
  const entries = getAllJournalEntrySummaries();

  return (
    <main className="rev-page">
      <div className="rev-wrap">
        <header className="journal-header">
          <RegistryLine value="PARRIT / JOURNAL · REV 01 · 2026" />
          <h1>We Find The Way.</h1>
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

        <section className="ri-stage r2-dark" aria-label={copy.registerAria}>
          <RegisterInterest source="site:journal" locale={locale} />
        </section>

        <footer className="rev-footer">
          <RegistryLine />
        </footer>
      </div>
    </main>
  );
}
