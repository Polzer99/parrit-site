import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { K, RegistryLine } from "@/system/components";
import { getAllJournalEntrySummaries, getJournalEntry } from "@/system/journal";

type JournalArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllJournalEntrySummaries().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: JournalArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getJournalEntry(slug);

  if (!entry) {
    return {};
  }

  return {
    title: entry.title,
    description: entry.description,
  };
}

export default async function JournalArticlePage({ params }: JournalArticlePageProps) {
  const { slug } = await params;
  const entry = getJournalEntry(slug);

  if (!entry) {
    notFound();
  }

  return (
    <main className="rev-page">
      <article className="journal-article">
        <header className="journal-header">
          <K>Journal / {entry.slug}</K>
          <h1>{entry.title}</h1>
          <p className="journal-deck">{entry.description}</p>
        </header>

        <div className="journal-body">
          <ReactMarkdown>{entry.content}</ReactMarkdown>
        </div>

        <footer className="journal-article-footer">
          <RegistryLine />
          <time className="journal-date" dateTime={entry.date}>
            Published {entry.date}
          </time>
        </footer>
      </article>
    </main>
  );
}
