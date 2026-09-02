import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { getLocale } from "@/lib/server/locale";
import { K, RegistryLine } from "@/system/components";
import { getAllJournalEntrySummaries, getJournalEntry } from "@/system/journal";
import { localizedAlternates } from "@/system/locale";

type JournalArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const SITE_URL = "https://parrit.ai";

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
    alternates: localizedAlternates(`/journal/${entry.slug}`),
    robots: entry.noindex ? { index: false, follow: true } : undefined,
  };
}

export default async function JournalArticlePage({ params }: JournalArticlePageProps) {
  const { slug } = await params;
  const entry = getJournalEntry(slug);
  const locale = await getLocale();

  if (!entry) {
    notFound();
  }

  const canonical = `${SITE_URL}/journal/${entry.slug}`;
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: entry.title,
    datePublished: entry.date,
    description: entry.description,
    author: {
      "@type": "Organization",
      name: "Parrit",
      url: SITE_URL,
    },
    mainEntityOfPage: canonical,
  };

  return (
    <main className="rev-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <article className="journal-article">
        <header className="journal-header">
          <K>{locale === "fr" ? "Journal / Entrée" : "Journal / Entry"} · {entry.date}</K>
          <h1>{entry.title}</h1>
          <p className="journal-deck">{entry.description}</p>
        </header>

        <div className="journal-body">
          <ReactMarkdown>{entry.content}</ReactMarkdown>
        </div>

        <footer className="journal-article-footer">
          <RegistryLine value={`WE FIND THE WAY · ${entry.date} · PARRIT / JOURNAL`} />
        </footer>
      </article>
    </main>
  );
}
