import type { Metadata } from "next";
import LegalFooterLine from "@/components/LegalFooterLine";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsByPillar, type BlogLocale } from "@/lib/blog";
import { getPillar, getPillars } from "@/lib/pillars";
import {
  getDictionary,
  hasLocale,
  locales,
  type Locale,
} from "../../../dictionaries";

const SITE_URL = "https://parrit.ai";
const contentAlternateLocales = locales.filter((l) => l !== "zh-CN");

export function generateStaticParams() {
  const pillars = getPillars();
  return locales.flatMap((lang) =>
    pillars.map((p) => ({ lang, pillar: p.slug })),
  );
}

function toContentLocale(lang: string): BlogLocale {
  return (lang === "zh-CN" ? "en" : lang) as BlogLocale;
}

function toPillarLocale(
  lang: string,
): "fr" | "en" | "pt-BR" {
  if (lang === "zh-CN") return "en";
  return lang as "fr" | "en" | "pt-BR";
}

function toInLanguage(lang: string): string {
  if (lang === "pt-BR") return "pt-BR";
  if (lang === "zh-CN") return "zh-CN";
  return lang;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; pillar: string }>;
}): Promise<Metadata> {
  const { lang, pillar: pillarSlug } = await params;
  if (!hasLocale(lang)) return {};

  const pillar = getPillar(pillarSlug);
  if (!pillar) return {};

  const tl = pillar.translations[toPillarLocale(lang)];
  // Un pilier sans article (cluster vide) = page mince : on le garde hors de l'index
  // tant qu'il n'a pas de spoke. Il s'indexera dès le premier article rattaché.
  const hasPosts = getPostsByPillar(pillar.slug, toContentLocale(lang)).length > 0;

  return {
    metadataBase: new URL(SITE_URL),
    title: `${tl.title} | Parrit.ai`,
    description: tl.description,
    robots: hasPosts ? undefined : { index: false, follow: true },
    alternates: {
      canonical: `${SITE_URL}/${lang}/blog/sujet/${pillarSlug}`,
      languages: Object.fromEntries([
        ...contentAlternateLocales.map((l) => [
          l,
          `${SITE_URL}/${l}/blog/sujet/${pillarSlug}`,
        ]),
        ["x-default", `${SITE_URL}/fr/blog/sujet/${pillarSlug}`],
      ]),
    },
    openGraph: {
      title: tl.title,
      description: tl.description,
      url: `${SITE_URL}/${lang}/blog/sujet/${pillarSlug}`,
      siteName: "Parrit.ai",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Parrit.ai",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tl.title,
      description: tl.description,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

function formatDate(iso: string, dateLocale: string): string {
  return new Date(iso).toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ lang: string; pillar: string }>;
}) {
  const { lang, pillar: pillarSlug } = await params;
  if (!hasLocale(lang)) notFound();

  const pillar = getPillar(pillarSlug);
  if (!pillar) notFound();

  const dict = await getDictionary(lang as Locale);
  const tl = pillar.translations[toPillarLocale(lang)];
  const posts = getPostsByPillar(pillar.slug, toContentLocale(lang));

  const pageUrl = `${SITE_URL}/${lang}/blog/sujet/${pillarSlug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": pageUrl,
        name: tl.title,
        description: tl.description,
        url: pageUrl,
        inLanguage: toInLanguage(lang),
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "Parrit.ai",
          url: SITE_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Parrit.ai",
            item: `${SITE_URL}/${lang}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: dict.blog.navTitle,
            item: `${SITE_URL}/${lang}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: tl.title,
            item: pageUrl,
          },
        ],
      },
    ],
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
          <Link href={`/${lang}/blog`} className="blog-nav-link">
            {dict.blog.navTitle}
          </Link>
          <Link href={`/${lang}/actualite`} className="blog-nav-link">
            {dict.actualite.navTitle}
          </Link>
        </div>
      </nav>

      <header className="blog-header">
        <p className="blog-header-label">{pillar.keyword}</p>
        <h1 className="blog-header-title">{tl.title}</h1>
        <div
          className="blog-header-subtitle"
          dangerouslySetInnerHTML={{ __html: tl.intro }}
        />
      </header>

      <nav aria-label="Fil d'Ariane" style={{ padding: "0 var(--blog-side-pad, 1.25rem)", maxWidth: 720, margin: "0 auto 2rem" }}>
        <Link href={`/${lang}`} className="blog-nav-link">Parrit.ai</Link>
        {" › "}
        <Link href={`/${lang}/blog`} className="blog-nav-link">{dict.blog.navTitle}</Link>
        {" › "}
        <span>{tl.title}</span>
      </nav>

      {posts.length > 0 && (
        <main className="blog-list">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/${lang}/blog/${post.slug}`}
              className="blog-card"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="blog-card-meta">
                <span className="blog-card-category">{post.category}</span>
                <span className="blog-card-dot">·</span>
                <time className="blog-card-date">
                  {formatDate(post.date, dict.blogListDateLocale)}
                </time>
                <span className="blog-card-dot">·</span>
                <span className="blog-card-reading">{post.readingTime}</span>
              </div>
              <h2 className="blog-card-title">{post.title}</h2>
              <p className="blog-card-desc">{post.description}</p>
              <span className="blog-card-read">{dict.blog.readArticle}</span>
            </Link>
          ))}
        </main>
      )}

      <footer className="blog-footer">
        <p className="blog-footer-text">{dict.blog.footerText}</p>
        <Link href={`/${lang}/rendez-vous`} className="blog-footer-cta">
          {dict.blog.footerCta}
        </Link>
        <LegalFooterLine lang={lang} />
      </footer>
    </>
  );
}
