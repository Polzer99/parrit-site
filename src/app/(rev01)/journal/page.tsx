import type { Metadata } from "next";
import Link from "next/link";

import { K, RegisterInterest, RegistryLine } from "@/system/components";
import { getAllJournalEntrySummaries } from "@/system/journal";

export const metadata: Metadata = {
  alternates: { canonical: "/journal" },
  title: "Journal",
  description: "Field notes on building and operating company systems.",
};

export default function JournalPage() {
  const entries = getAllJournalEntrySummaries();

  return (
    <main className="rev-page">
      <div className="rev-wrap">
        <header className="journal-header">
          <RegistryLine value="PARRIT / JOURNAL · REV 01 · 2026" />
          <h1>We Find The Way.</h1>
          <p>Field notes on the systems we examine, build and operate.</p>
        </header>

        <ol className="journal-list">
          {entries.map((entry) => (
            <li key={entry.slug}>
              <Link href={`/journal/${entry.slug}`}>
                <div>
                  <K>Journal / Entry</K>
                  <h2>{entry.title}</h2>
                  <p>{entry.description}</p>
                </div>
                <time dateTime={entry.date}>{entry.date}</time>
              </Link>
            </li>
          ))}
        </ol>

        <section className="ri-stage r2-dark" aria-label="Register your interest">
          <RegisterInterest source="site:journal" />
        </section>

        <footer className="rev-footer">
          <RegistryLine />
        </footer>
      </div>
    </main>
  );
}
