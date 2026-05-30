import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import {
  hasLocale,
  locales,
  type Locale,
} from "../../dictionaries";

const SITE_URL = "https://parrit.ai";
const CONTENT_DIR = path.join(process.cwd(), "content", "glossaire");

type ArticleLang = {
  title: string;
  subtitle: string;
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  intro: string;
  sections: { q: string; a: string }[];
  related?: { slug: string; label: string }[];
  cta: { title: string; subtitle: string; label: string };
};

type Article = {
  slug: string;
  category: string;
  published_at: string;
  updated_at: string;
  langs: Partial<Record<Locale, ArticleLang>>;
};

type IndexFile = {
  articles: { slug: string; category: string; langs: Locale[]; published_at: string }[];
};

function loadArticle(slug: string): Article | null {
  try {
    const file = path.join(CONTENT_DIR, `${slug}.json`);
    return JSON.parse(fs.readFileSync(file, "utf-8")) as Article;
  } catch {
    return null;
  }
}

function loadIndex(): IndexFile {
  try {
    return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "index.json"), "utf-8")) as IndexFile;
  } catch {
    return { articles: [] };
  }
}

export async function generateStaticParams() {
  const idx = loadIndex();
  const params: { lang: string; slug: string }[] = [];
  for (const a of idx.articles) {
    for (const l of a.langs) {
      params.push({ lang: l, slug: a.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const article = loadArticle(slug);
  if (!article) return {};
  const data = article.langs[lang as Locale];
  if (!data) return {};

  const languagesMap: Record<string, string> = {
    "x-default": `${SITE_URL}/fr/glossaire/${slug}`,
  };
  for (const l of locales) {
    if (article.langs[l]) {
      languagesMap[l] = `${SITE_URL}/${l}/glossaire/${slug}`;
    }
  }

  return {
    title: data.meta.title,
    description: data.meta.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/glossaire/${slug}`,
      languages: languagesMap,
    },
    openGraph: {
      title: data.meta.ogTitle,
      description: data.meta.ogDescription,
      url: `${SITE_URL}/${lang}/glossaire/${slug}`,
      siteName: "Parrit.ai",
      type: "article",
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: data.meta.ogTitle,
      description: data.meta.ogDescription,
    },
    robots: { index: true, follow: true },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const article = loadArticle(slug);
  if (!article) notFound();
  const data = article.langs[lang as Locale];
  if (!data) notFound();

  const pageUrl = `${SITE_URL}/${lang}/glossaire/${slug}`;

  // Only surface related links that point to ACTUALLY published terms in this
  // locale — the auto-publisher can emit forward-looking / imagined slugs, and
  // linking to unpublished slugs produces 404s (wasted crawl budget, weak SEO).
  const publishedSlugs = new Set(
    loadIndex()
      .articles.filter((a) => a.langs.includes(lang as Locale))
      .map((a) => a.slug),
  );
  const relatedPublished = (data.related ?? []).filter(
    (r) => r.slug !== slug && publishedSlugs.has(r.slug),
  );

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        url: pageUrl,
        name: data.meta.ogTitle,
        description: data.meta.description,
        inLanguage: lang,
        datePublished: article.published_at,
        dateModified: article.updated_at,
        author: { "@type": "Person", name: "Paul Larmaraud" },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntity: data.sections.map((s) => ({
          "@type": "Question",
          name: s.q,
          acceptedAnswer: { "@type": "Answer", text: s.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Parrit.ai", item: `${SITE_URL}/${lang}` },
          { "@type": "ListItem", position: 2, name: "Glossaire", item: `${SITE_URL}/${lang}/glossaire` },
          { "@type": "ListItem", position: 3, name: data.title, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "120px 24px 80px", color: "var(--text)" }}>
        <nav style={{ marginBottom: 32, fontSize: 13, color: "var(--text-muted)" }}>
          <Link href={`/${lang}/glossaire`} style={{ color: "inherit", textDecoration: "none" }}>
            ← Glossaire
          </Link>
        </nav>

        <header style={{ marginBottom: 48 }}>
          <span
            style={{
              display: "inline-block",
              padding: "5px 12px",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#c8956c",
              border: "1px solid rgba(200,149,108,0.3)",
              borderRadius: 999,
              marginBottom: 20,
              fontFamily: "var(--font-body)",
              fontWeight: 500,
            }}
          >
            {article.category}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(32px, 4.5vw, 44px)",
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: 20,
            }}
          >
            {data.title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 18,
              lineHeight: 1.55,
              color: "var(--text-muted)",
              fontWeight: 300,
            }}
          >
            {data.subtitle}
          </p>
        </header>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            lineHeight: 1.7,
            color: "var(--text)",
            fontWeight: 300,
            marginBottom: 56,
            borderLeft: "3px solid #c8956c",
            paddingLeft: 24,
          }}
        >
          {data.intro}
        </p>

        <section>
          {data.sections.map((s, i) => (
            <article key={i} style={{ marginBottom: 44 }}>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 22,
                  fontWeight: 500,
                  lineHeight: 1.3,
                  marginBottom: 14,
                  letterSpacing: "-0.01em",
                }}
              >
                {s.q}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "var(--text-muted)",
                  fontWeight: 300,
                }}
              >
                {s.a}
              </p>
            </article>
          ))}
        </section>

        {relatedPublished.length > 0 && (
          <section style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
            <h3
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 16,
              }}
            >
              À lire ensuite
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {relatedPublished.map((r) => (
                <li key={r.slug} style={{ marginBottom: 8 }}>
                  <Link
                    href={`/${lang}/glossaire/${r.slug}`}
                    style={{ color: "var(--text)", textDecoration: "underline", textDecorationColor: "rgba(200,149,108,0.4)" }}
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <aside
          style={{
            marginTop: 64,
            padding: "32px 28px",
            background: "linear-gradient(180deg, rgba(200,149,108,0.08) 0%, rgba(200,149,108,0.02) 100%)",
            border: "1px solid rgba(200,149,108,0.2)",
            borderRadius: 14,
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 20,
              fontWeight: 500,
              marginBottom: 10,
            }}
          >
            {data.cta.title}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--text-muted)",
              marginBottom: 20,
              fontWeight: 300,
            }}
          >
            {data.cta.subtitle}
          </p>
          <Link
            href={`/${lang}#callback-form`}
            style={{
              display: "inline-block",
              padding: "12px 24px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 500,
              color: "#fff",
              background: "linear-gradient(135deg, #c8956c 0%, #b8814c 100%)",
              textDecoration: "none",
            }}
          >
            {data.cta.label}
          </Link>
        </aside>
      </main>
    </>
  );
}
