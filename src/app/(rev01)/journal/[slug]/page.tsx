import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { getLocale } from "@/lib/server/locale";
import { AUTEUR } from "@/system/auteur";
import { blogPostingJsonLd } from "@/system/jsonld";
import { HarnessBadge } from "@/system/components";
import { getAllJournalEntrySummaries, getJournalEntry } from "@/system/journal";

type JournalArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const SITE_URL = "https://parrit.ai";

function articleImageUrl(canonical: string): string {
  return `${canonical}/og`;
}

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
  const image = {
    url: articleImageUrl(canonical),
    width: 1200,
    height: 630,
    alt: "Parrit.ai Journal article",
  };
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
      images: [image],
    },
    twitter: { card: "summary_large_image", images: [image] },
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

  const dateLabel = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(entry.date));
  const entries = getAllJournalEntrySummaries();
  const currentIndex = entries.findIndex((candidate) => candidate.slug === entry.slug);
  // Garder la position avant filtrage permet aussi de partir d'une entrée noindex.
  const relatedEntries = [
    ...entries.slice(currentIndex + 1),
    ...entries.slice(0, currentIndex),
  ].filter((candidate) => !candidate.noindex && candidate.slug !== entry.slug).slice(0, 3);
  const relatedLabel = locale === "fr" ? "À lire ensuite" : "Continue reading";

  return (
    <main className="rev-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingJsonLd(entry)).replace(/</g, "\\u003c") }}
      />
      <article className="rev-wrap journal-article">
        <header className="journal-header">
          <p><time dateTime={entry.date}>{dateLabel}</time></p>
          <h1 lang="en">{entry.title}</h1>
          <HarnessBadge slug={entry.slug} locale={locale} />
          {locale === "fr" ? <p data-language-note="">Article en anglais.</p> : null}
          <p className="journal-deck" lang="en">{entry.description}</p>
        </header>

        <div className="journal-body" lang="en">
          <ReactMarkdown>{entry.content}</ReactMarkdown>
        </div>

        {relatedEntries.length > 0 ? (
          <nav className="journal-related" aria-label={relatedLabel}>

            {/* Les articles restent liés à leur URL canonique anglaise. */}
            {relatedEntries.map((related) => (
              <Link key={related.slug} href={`/journal/${related.slug}`}>
                <span>{related.title}</span>
                <time dateTime={related.date}>{related.date}</time>
              </Link>
            ))}
          </nav>
        ) : null}


      </article>
    </main>
  );
}
