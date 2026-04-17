import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, type BlogLocale } from "@/lib/blog";
import {
  getDictionary,
  hasLocale,
  locales,
  type Locale,
} from "../dictionaries";

const SITE_URL = "https://parrit.ai";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
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
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/blog`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}/blog`]),
      ),
    },
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      url: `${SITE_URL}/${lang}/blog`,
      siteName: "Parrit.ai",
      locale: dict.meta.ogLocale,
      type: "website",
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
  const posts = getAllPosts(lang as BlogLocale);

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
        <Link href={`/${lang}/blog`} className="blog-nav-link">
          {dict.blog.navTitle}
        </Link>
      </nav>

      <header className="blog-header">
        <p className="blog-header-label">{dict.blog.headerLabel}</p>
        <h1 className="blog-header-title">
          {dict.blog.headerTitleMain}{" "}
          <em className="hero-accent">{dict.blog.headerTitleAccent}</em>
        </h1>
        <p className="blog-header-subtitle">{dict.blog.headerSubtitle}</p>
      </header>

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
          © {new Date().getFullYear()} SASU PARRIT.AI — Rueil-Malmaison
        </p>
      </footer>
    </>
  );
}
