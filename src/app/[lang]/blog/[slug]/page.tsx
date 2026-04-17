import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs, type BlogLocale } from "@/lib/blog";
import {
  getDictionary,
  hasLocale,
  locales,
  type Locale,
} from "../../dictionaries";

const SITE_URL = "https://parrit.ai";

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return locales.flatMap((lang) =>
    slugs.map((slug) => ({ lang, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const post = getPostBySlug(slug, lang as BlogLocale);
  if (!post) return {};

  const dict = await getDictionary(lang as Locale);

  return {
    title: `${post.title} — Parrit.ai`,
    description: post.description,
    authors: [{ name: post.author }],
    alternates: {
      canonical: `${SITE_URL}/${lang}/blog/${post.slug}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}/blog/${post.slug}`]),
      ),
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/${lang}/blog/${post.slug}`,
      siteName: "Parrit.ai",
      locale: dict.meta.ogLocale,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const post = getPostBySlug(slug, lang as BlogLocale);
  if (!post) notFound();

  const dict = await getDictionary(lang as Locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Parrit.ai",
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/${lang}/blog/${post.slug}`,
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

      <article className="blog-article">
        <header className="blog-article-header">
          <Link href={`/${lang}/blog`} className="blog-back">
            {dict.blog.back}
          </Link>
          <div className="blog-card-meta" style={{ justifyContent: "center" }}>
            <span className="blog-card-category">{post.category}</span>
            <span className="blog-card-dot">·</span>
            <time className="blog-card-date">
              {formatDate(post.date, dict.blogListDateLocale)}
            </time>
            <span className="blog-card-dot">·</span>
            <span className="blog-card-reading">{post.readingTime}</span>
          </div>
          <h1 className="blog-article-title">{post.title}</h1>
          <p className="blog-article-author">
            {dict.blog.by} {post.author}
          </p>
        </header>

        <div
          className="blog-article-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <footer className="blog-footer">
        <p className="blog-footer-text">{dict.blog.articleFooter}</p>
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
