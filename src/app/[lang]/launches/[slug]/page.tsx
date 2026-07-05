import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  getAllLaunches,
  getLaunchBySlug,
  type Launch,
} from "@/lib/launches";
import {
  getDictionary,
  hasLocale,
  locales,
  type Locale,
} from "../../dictionaries";

const SITE_URL = "https://parrit.ai";

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export function generateStaticParams() {
  const launches = getAllLaunches();
  return locales.flatMap((lang) =>
    launches.map((launch) => ({ lang, slug: launch.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const launch = getLaunchBySlug(slug);
  if (!launch) return {};

  const dict = await getDictionary(lang as Locale);
  const title = `${launch.title} | Launch #${String(launch.num).padStart(3, "0")} | Parrit.ai`;
  const image = launch.cover
    ? `${SITE_URL}${launch.cover}`
    : `${SITE_URL}/opengraph-image`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: launch.summary,
    alternates: {
      canonical: `${SITE_URL}/${lang}/launches/${launch.slug}`,
      languages: Object.fromEntries([
        ...locales.map((locale) => [
          locale,
          `${SITE_URL}/${locale}/launches/${launch.slug}`,
        ]),
        ["x-default", `${SITE_URL}/fr/launches/${launch.slug}`],
      ]),
    },
    openGraph: {
      title,
      description: launch.summary,
      url: `${SITE_URL}/${lang}/launches/${launch.slug}`,
      siteName: "Parrit.ai",
      locale: dict.meta.ogLocale,
      type: "article",
      publishedTime: launch.date,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: launch.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: launch.summary,
      images: [image],
    },
  };
}

function formatNum(num: number): string {
  return `#${String(num).padStart(3, "0")}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function LaunchMeta({ launch }: { launch: Launch }) {
  return (
    <aside className="launch-meta-block" aria-label="Meta launch">
      <div>
        <span>Numero</span>
        <strong>{formatNum(launch.num)}</strong>
      </div>
      <div>
        <span>Secteur</span>
        <strong>{launch.sector}</strong>
      </div>
      <div>
        <span>Duree dev</span>
        <strong>{launch.devDuration}</strong>
      </div>
      <div>
        <span>Difficulte</span>
        <strong>{launch.difficulty}/5</strong>
      </div>
      <div className="launch-meta-stack">
        <span>Stack</span>
        <p>
          {launch.stack.map((tool) => (
            <span className="launch-chip" key={tool}>
              {tool}
            </span>
          ))}
        </p>
      </div>
    </aside>
  );
}

export default async function LaunchPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const launch = getLaunchBySlug(slug);
  if (!launch) notFound();

  const launchUrl = `${SITE_URL}/${lang}/launches/${launch.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: launch.title,
    description: launch.summary,
    datePublished: launch.date,
    articleSection: launch.category,
    url: launchUrl,
    mainEntityOfPage: launchUrl,
    publisher: {
      "@type": "Organization",
      name: "Parrit.ai",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="blog-nav">
        <Link href={`/${lang}`} className="nav-logo">
          Parrit.ai
        </Link>
        <div className="blog-nav-links">
          <Link href={`/${lang}/launches`} className="blog-nav-link">
            Launches
          </Link>
          <Link href={`/${lang}/blog`} className="blog-nav-link">
            Articles
          </Link>
        </div>
      </nav>

      <article className="launch-article">
        <header className="launch-article-header">
          <Link href={`/${lang}/launches`} className="launch-back">
            Retour aux launches
          </Link>
          <p className="launch-kicker">
            <span>{formatNum(launch.num)}</span>
            <span>{launch.category}</span>
            <time>{formatDate(launch.date)}</time>
          </p>
          <h1>{launch.title}</h1>
          <p>{launch.summary}</p>
        </header>

        <LaunchMeta launch={launch} />

        {launch.resource && (
          <section className="launch-resource">
            <p>Ressource</p>
            <a href={launch.resource.href}>{launch.resource.label}</a>
          </section>
        )}

        <div className="launch-markdown">
          <ReactMarkdown>{launch.content}</ReactMarkdown>
        </div>
      </article>
    </>
  );
}
