import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getActualitePostBySlug,
  getAllActualiteSlugs,
  type BlogLocale,
} from "@/lib/actualite";
import {
  getDictionary,
  hasLocale,
  locales,
  type Locale,
} from "../../dictionaries";

const SITE_URL = "https://parrit.ai";
const contentAlternateLocales = locales.filter((locale) => locale !== "zh-CN");
const FORBIDDEN_VIDEO_HOST = ["vercel", "app"].join(".");

export function generateStaticParams() {
  const slugs = getAllActualiteSlugs();
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

function toContentLocale(lang: string): BlogLocale {
  return (lang === "zh-CN" ? "en" : lang) as BlogLocale;
}

function getSafeVideoUrl(videoUrl?: string): string | undefined {
  if (!videoUrl) return undefined;

  try {
    const parsed = new URL(videoUrl, SITE_URL);
    if (
      parsed.hostname === FORBIDDEN_VIDEO_HOST ||
      parsed.hostname.endsWith(`.${FORBIDDEN_VIDEO_HOST}`)
    ) {
      return undefined;
    }
    return videoUrl;
  } catch {
    return undefined;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const post = getActualitePostBySlug(slug, toContentLocale(lang));
  if (!post) return {};

  const dict = await getDictionary(lang as Locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: `${post.title} | Parrit.ai`,
    description: post.description,
    authors: [{ name: post.author }],
    alternates: {
      canonical: `${SITE_URL}/${lang}/actualite/${post.slug}`,
      languages: Object.fromEntries(
        [
          ...contentAlternateLocales.map((l) => [
            l,
            `${SITE_URL}/${l}/actualite/${post.slug}`,
          ]),
          ["x-default", `${SITE_URL}/fr/actualite/${post.slug}`],
        ],
      ),
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/${lang}/actualite/${post.slug}`,
      siteName: "Parrit.ai",
      locale: dict.meta.ogLocale,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
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
      title: post.title,
      description: post.description,
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

export default async function ActualitePostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const post = getActualitePostBySlug(slug, toContentLocale(lang));
  if (!post) notFound();

  const dict = await getDictionary(lang as Locale);
  const postUrl = `${SITE_URL}/${lang}/actualite/${post.slug}`;
  const safeVideoUrl = getSafeVideoUrl(post.videoUrl);
  const wordCount = post.content
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updatedAt ?? post.date,
        wordCount,
        articleSection: post.category,
        inLanguage: lang,
        url: postUrl,
        mainEntityOfPage: postUrl,
        image: post.ogImage
          ? [`${SITE_URL}${post.ogImage}`]
          : [`${SITE_URL}/opengraph-image`],
        author: {
          "@type": "Person",
          "@id": `${SITE_URL}/${lang}/auteur/paul-larmaraud#person`,
          name: post.author,
        },
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "Parrit.ai",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/opengraph-image`,
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
            name: dict.actualite.navTitle,
            item: `${SITE_URL}/${lang}/actualite`,
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
        <div className="blog-nav-links">
          <Link href={`/${lang}/blog`} className="blog-nav-link">
            {dict.blog.navTitle}
          </Link>
          <Link href={`/${lang}/actualite`} className="blog-nav-link">
            {dict.actualite.navTitle}
          </Link>
        </div>
      </nav>

      <article className="blog-article actualite-article">
        <header className="blog-article-header">
          <Link href={`/${lang}/actualite`} className="blog-back">
            {dict.actualite.back}
          </Link>
          <div className="blog-card-meta">
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
            {dict.actualite.by}{" "}
            <Link
              href={`/${lang}/auteur/paul-larmaraud`}
              style={{ borderBottom: "1px solid currentColor" }}
            >
              {post.author}
            </Link>
          </p>
        </header>

        {safeVideoUrl && (
          <video
            className="actualite-video"
            controls
            preload="metadata"
            src={safeVideoUrl}
          />
        )}

        <div
          className="blog-article-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <footer className="blog-footer">
        <p className="blog-footer-text">{dict.actualite.articleFooter}</p>
        <Link href={`/${lang}/rendez-vous`} className="blog-footer-cta">
          {dict.actualite.footerCta}
        </Link>
        <p className="footer-legal" style={{ marginTop: 40 }}>
          © {new Date().getFullYear()} SASU PARRIT.AI · Rueil-Malmaison
        </p>
      </footer>
    </>
  );
}
