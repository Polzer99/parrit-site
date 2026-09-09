import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { getLocale } from "@/lib/server/locale";
import { AUTEUR } from "@/system/auteur";
import { K, RegistryLine } from "@/system/components";
import { getAllJournalEntrySummaries, getJournalEntry } from "@/system/journal";

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

  const canonical = `${SITE_URL}/journal/${entry.slug}`;
  return {
    title: entry.title,
    authors: [{ name: AUTEUR.nom, url: AUTEUR.url }],
    description: entry.description,
    alternates: { canonical, languages: { en: canonical, "x-default": canonical } },
    openGraph: {
      title: entry.title,
      description: entry.description,
      type: "article",
      publishedTime: entry.date,
      siteName: "Parrit.ai",
      url: canonical,
    },
    twitter: { card: "summary_large_image" },
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
  const entries = getAllJournalEntrySummaries();
  const currentIndex = entries.findIndex((candidate) => candidate.slug === entry.slug);
  // Garder la position avant filtrage permet aussi de partir d'une entrée noindex.
  const relatedEntries = [
    ...entries.slice(currentIndex + 1),
    ...entries.slice(0, currentIndex),
  ].filter((candidate) => !candidate.noindex && candidate.slug !== entry.slug).slice(0, 3);
  const relatedLabel = locale === "fr" ? "À lire ensuite" : "Continue reading";
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: entry.title,
    datePublished: entry.date,
    dateModified: entry.date,
    image: `${canonical}/opengraph-image`,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "Parrit.ai",
      logo: { "@type": "ImageObject", url: "https://parrit.ai/icon.png" },
    },
    description: entry.description,
    author: {
      "@type": "Person",
      name: AUTEUR.nom,
      url: AUTEUR.url,
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

        {relatedEntries.length > 0 ? (
          <nav className="journal-related" aria-label={relatedLabel}>
            <K>{relatedLabel}</K>
            {/* Article anglais unique : une URL localisée ajouterait un saut 301. */}
            {relatedEntries.map((related) => (
              <Link key={related.slug} href={`/journal/${related.slug}`}>
                <span>{related.title}</span>
                <time dateTime={related.date}>{related.date}</time>
              </Link>
            ))}
          </nav>
        ) : null}

        <footer className="journal-article-footer">
          <RegistryLine value={`WE FIND THE WAY · ${entry.date} · PARRIT / JOURNAL`} />
        </footer>
      </article>
    </main>
  );
}
