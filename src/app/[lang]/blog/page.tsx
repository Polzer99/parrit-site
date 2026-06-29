import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, type BlogLocale } from "@/lib/blog";
import { getPillars } from "@/lib/pillars";
import {
  getDictionary,
  hasLocale,
  locales,
  type Locale,
} from "../dictionaries";

const SITE_URL = "https://parrit.ai";
const contentAlternateLocales = locales.filter((locale) => locale !== "zh-CN");

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Blog content not yet translated to zh-CN: fallback to EN content (UI strings stay zh)
function toContentLocale(lang: string): BlogLocale {
  return (lang === "zh-CN" ? "en" : lang) as BlogLocale;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const dict = await getDictionary(lang as Locale);
  const m = dict.blog.meta;

  return {
    metadataBase: new URL(SITE_URL),
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/blog`,
      languages: Object.fromEntries(
        [
          ...contentAlternateLocales.map((l) => [l, `${SITE_URL}/${l}/blog`]),
          ["x-default", `${SITE_URL}/fr/blog`],
        ],
      ),
    },
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      url: `${SITE_URL}/${lang}/blog`,
      siteName: "Parrit.ai",
      locale: dict.meta.ogLocale,
      type: "website",
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Parrit.ai : diagnostic IA avant transformation",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.ogTitle,
      description: m.ogDescription,
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

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const posts = getAllPosts(toContentLocale(lang));
  const pillars = getPillars();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog Parrit.ai",
    url: `${SITE_URL}/${lang}/blog`,
    description: dict.blog.meta.schemaDescription,
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
          <Link href={`/${lang}/blog`} className="blog-nav-link">
            {dict.blog.navTitle}
          </Link>
          <Link href={`/${lang}/actualite`} className="blog-nav-link">
            {dict.actualite.navTitle}
          </Link>
        </div>
      </nav>

      <header className="blog-header">
        <p className="blog-header-label">{dict.blog.headerLabel}</p>
        <h1 className="blog-header-title">
          {dict.blog.headerTitleMain}{" "}
          <em className="hero-accent">{dict.blog.headerTitleAccent}</em>
        </h1>
        <p className="blog-header-subtitle">{dict.blog.headerSubtitle}</p>
      </header>

      <section
        aria-label={
          lang === "fr"
            ? "Les grands sujets"
            : lang === "en"
              ? "Key topics"
              : "Grandes temáticas"
        }
        style={{ padding: "0 var(--blog-side-pad, 1.25rem)", maxWidth: 720, margin: "0 auto 2.5rem" }}
      >
        <p
          className="blog-header-label"
          style={{ marginBottom: "1rem" }}
        >
          {lang === "fr"
            ? "Les grands sujets"
            : lang === "en"
              ? "Key topics"
              : lang === "pt-BR"
                ? "Grandes temáticas"
                : "核心主题"}
        </p>
        <div className="blog-list" style={{ marginBottom: 0 }}>
          {pillars.map((pillar, i) => {
            const pl =
              lang === "zh-CN"
                ? pillar.translations["en"]
                : pillar.translations[
                    (lang as "fr" | "en" | "pt-BR") ?? "fr"
                  ] ?? pillar.translations["fr"];
            return (
              <Link
                key={pillar.slug}
                href={`/${lang}/blog/sujet/${pillar.slug}`}
                className="blog-card"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="blog-card-meta">
                  <span className="blog-card-category">{pillar.keyword}</span>
                </div>
                <h2 className="blog-card-title">{pl.title}</h2>
                <p className="blog-card-desc">{pl.description}</p>
                <span className="blog-card-read">
                  {lang === "fr"
                    ? "Lire le sujet"
                    : lang === "en"
                      ? "Read topic"
                      : lang === "pt-BR"
                        ? "Ler o tema"
                        : "阅读主题"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

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

      <footer className="blog-footer">
        <p className="blog-footer-text">{dict.blog.footerText}</p>
        <Link href={`/${lang}#callback-form`} className="blog-footer-cta">
          {dict.blog.footerCta}
        </Link>
        <p className="footer-legal" style={{ marginTop: 40 }}>
          © {new Date().getFullYear()} SASU PARRIT.AI · Rueil-Malmaison
        </p>
      </footer>
    </>
  );
}
