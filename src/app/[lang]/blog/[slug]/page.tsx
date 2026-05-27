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
  // Blog content not yet translated to zh-CN
  const blogLocales = locales.filter((l) => l !== "zh-CN");
  return blogLocales.flatMap((lang) =>
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
    title: `${post.title} | Parrit.ai`,
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

  const postUrl = `${SITE_URL}/${lang}/blog/${post.slug}`;
  const wordCount = post.content
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${postUrl}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        wordCount,
        articleSection: post.category,
        inLanguage: lang,
        url: postUrl,
        mainEntityOfPage: postUrl,
        image: post.ogImage ? [`${SITE_URL}${post.ogImage}`] : [`${SITE_URL}/og-image.png`],
        author: {
          "@type": "Person",
          name: post.author,
          url: `${SITE_URL}/${lang}`,
          jobTitle: "Fondateur Parrit.ai",
          knowsAbout: ["Claude Code", "Anthropic Claude", "Automatisation IA", "Agents IA"],
        },
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "Parrit.ai",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/og-image.png`,
          },
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
            name: post.title,
            item: postUrl,
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
            {dict.blog.by}{" "}
            <Link
              href={`/${lang}/auteur/paul-larmaraud`}
              style={{ borderBottom: "1px solid currentColor" }}
            >
              {post.author}
            </Link>
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
          © {new Date().getFullYear()} SASU PARRIT.AI · Rueil-Malmaison
        </p>
      </footer>
    </>
  );
}
