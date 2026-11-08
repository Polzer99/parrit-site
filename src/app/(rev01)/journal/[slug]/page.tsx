import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { getLocale } from "@/lib/server/locale";
import { AUTEUR } from "@/system/auteur";
import { blogPostingJsonLd } from "@/system/jsonld";
import { HarnessBadge } from "@/system/components";
import { BookingCall } from "@/system/components/BookingCall";
import { getAllJournalEntrySummaries, getJournalEntry } from "@/system/journal";
import { localizedAlternates, localizedPath } from "@/system/locale";
import { hasFrenchJournalTranslation } from "@/system/journal-translations";
import { journalReadingMinutes } from "@/system/journal-reading";
import { getJournalThemes } from "@/system/journal-themes";

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
  const locale = await getLocale();
  const entry = getJournalEntry(slug, locale);

  if (!entry) {
    return {};
  }

  const alternates = localizedAlternates(`/journal/${entry.slug}`, locale);
  const canonical = `${SITE_URL}${alternates.canonical}`;
  const image = {
    url: articleImageUrl(`${SITE_URL}/journal/${entry.slug}`),
    width: 1200,
    height: 630,
    alt: "Parrit.ai Journal article",
  };
  return {
    title: entry.title,
    authors: [{ name: AUTEUR.nom, url: AUTEUR.url }],
    description: entry.description,
    alternates: { canonical, languages: Object.fromEntries(Object.entries(alternates.languages).map(([language, url]) => [language, `${SITE_URL}${url}`])) },
    openGraph: {
      title: entry.title,
      description: entry.description,
      type: "article",
      publishedTime: entry.date,
      siteName: "Parrit.ai",
      url: canonical,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: [image],
    },
    twitter: { card: "summary_large_image", images: [image] },
    robots: entry.noindex ? { index: false, follow: true } : undefined,
  };
}

export default async function JournalArticlePage({ params }: JournalArticlePageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const entry = getJournalEntry(slug, locale);

  if (!entry) {
    notFound();
  }

  const dateLabel = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(entry.date));
  const contentLocale = locale === "fr" && !entry.noindex && hasFrenchJournalTranslation(slug) ? "fr" : "en";
  const entries = getAllJournalEntrySummaries(locale);
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
          __html: JSON.stringify(blogPostingJsonLd(entry, contentLocale)).replace(/</g, "\\u003c") }}
      />
      <article className="rev-wrap journal-article">
        <header className="journal-header">
          <p><time dateTime={entry.date}>{dateLabel}</time></p>
          <h1 lang={contentLocale}>{entry.title}</h1>
          <HarnessBadge slug={entry.slug} locale={locale} />
          {locale === "fr" && contentLocale === "en" ? <p data-language-note="">Article en anglais.</p> : null}
          <p className="journal-deck" lang={contentLocale}>{entry.description}</p>
          <div className="journal-entry-meta">
            {getJournalThemes(slug).map(theme => <span key={theme.page}>{theme.label[locale]}</span>)}
            <span>{journalReadingMinutes(entry.content)} {locale === "fr" ? "min de lecture" : "min read"}</span>
          </div>
        </header>

        <div className="journal-body" lang={contentLocale}>
          <ReactMarkdown>{entry.content}</ReactMarkdown>
        </div>

        <BookingCall locale={locale} source={`journal-${entry.slug}`} />

        {relatedEntries.length > 0 ? (
          <nav className="journal-related" aria-label={relatedLabel}>

            {relatedEntries.map((related) => (
              <Link key={related.slug} href={localizedPath(`/journal/${related.slug}`, locale)}>
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
