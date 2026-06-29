import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs, getRelatedPosts, type BlogLocale } from "@/lib/blog";
import { getPillar } from "@/lib/pillars";
import {
  getDictionary,
  hasLocale,
  locales,
  type Locale,
} from "../../dictionaries";

const SITE_URL = "https://parrit.ai";
const contentAlternateLocales = locales.filter((locale) => locale !== "zh-CN");

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return locales.flatMap((lang) =>
    slugs.map((slug) => ({ lang, slug })),
  );
}

// Blog content not yet translated to zh-CN: fallback to EN content (UI strings stay zh)
function toContentLocale(lang: string): BlogLocale {
  return (lang === "zh-CN" ? "en" : lang) as BlogLocale;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const post = getPostBySlug(slug, toContentLocale(lang));
  if (!post) return {};

  const dict = await getDictionary(lang as Locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: `${post.title} | Parrit.ai`,
    description: post.description,
    authors: [{ name: post.author }],
    alternates: {
      canonical: `${SITE_URL}/${lang}/blog/${post.slug}`,
      languages: Object.fromEntries(
        [
          ...contentAlternateLocales.map((l) => [
            l,
            `${SITE_URL}/${l}/blog/${post.slug}`,
          ]),
          ["x-default", `${SITE_URL}/fr/blog/${post.slug}`],
        ],
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

function slugifyHeading(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function withHeadingAnchors(
  html: string,
): { html: string; toc: { id: string; text: string }[] } {
  const toc: { id: string; text: string }[] = [];
  const idCounts: Record<string, number> = {};

  const result = html.replace(
    /<h2([^>]*)>([\s\S]*?)<\/h2>/g,
    (_match, attrs: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      let id = slugifyHeading(text);
      if (idCounts[id] !== undefined) {
        idCounts[id]++;
        id = `${id}-${idCounts[id]}`;
      } else {
        idCounts[id] = 0;
      }
      toc.push({ id, text });
      return `<h2 id="${id}"${attrs}>${inner}</h2>`;
    },
  );

  return { html: result, toc };
}

const UI_LABELS: Record<string, Record<string, string>> = {
  tldr: { fr: "En bref", en: "In short", "pt-BR": "Em resumo", "zh-CN": "摘要" },
  toc: { fr: "Sommaire", en: "Contents", "pt-BR": "Sumário", "zh-CN": "目录" },
  faq: {
    fr: "Questions fréquentes",
    en: "FAQ",
    "pt-BR": "Perguntas frequentes",
    "zh-CN": "常见问题",
  },
  sources: { fr: "Sources", en: "Sources", "pt-BR": "Fontes", "zh-CN": "参考资料" },
  viewProfile: {
    fr: "Voir le profil",
    en: "View profile",
    "pt-BR": "Ver perfil",
    "zh-CN": "查看简介",
  },
};

function uiLabel(lang: string, key: keyof typeof UI_LABELS): string {
  return UI_LABELS[key][lang] ?? UI_LABELS[key]["en"];
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const post = getPostBySlug(slug, toContentLocale(lang));
  if (!post) notFound();

  const dict = await getDictionary(lang as Locale);
  const related = getRelatedPosts(post.slug, toContentLocale(lang), 3);
  const pillar = post.pillar ? getPillar(post.pillar) : undefined;

  const postUrl = `${SITE_URL}/${lang}/blog/${post.slug}`;
  const wordCount = post.content
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  const { html: processedContent, toc } = withHeadingAnchors(post.content);

  const jsonLdGraph: object[] = [
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
  ];

  if (post.faq?.length) {
    jsonLdGraph.push({
      "@type": "FAQPage",
      "@id": `${postUrl}#faq`,
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  const jsonLd = { "@context": "https://schema.org", "@graph": jsonLdGraph };

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

      <article className="blog-article">
        <header className="blog-article-header">
          <Link href={`/${lang}/blog`} className="blog-back">
            {dict.blog.back}
          </Link>
          {pillar && (
            <Link
              href={`/${lang}/blog/sujet/${pillar.slug}`}
              className="blog-nav-link"
              style={{ display: "inline-block", marginBottom: "0.5rem" }}
            >
              ‹ {pillar.keyword}
            </Link>
          )}
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
            <span style={{ fontWeight: 600 }}>Paul Larmaraud</span>
            {" · "}
            <span style={{ color: "var(--muted, #6E7079)", fontSize: "0.875rem" }}>
              Fondateur, Parrit.ai
            </span>
            {" · "}
            <Link
              href={`/${lang}/auteur/paul-larmaraud`}
              style={{ borderBottom: "1px solid currentColor", fontSize: "0.875rem" }}
            >
              {uiLabel(lang, "viewProfile")}
            </Link>
          </p>
        </header>

        {post.tldr && (
          <div
            style={{
              borderLeft: "3px solid var(--parrit-red, #AA0003)",
              background: "var(--bg-faint, #F5F8FF)",
              padding: "0.75rem 1rem",
              marginBottom: "1.5rem",
              borderRadius: "0 4px 4px 0",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                fontWeight: 600,
                marginBottom: "0.25rem",
                color: "var(--parrit-red, #AA0003)",
              }}
            >
              {uiLabel(lang, "tldr")}
            </p>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>{post.tldr}</p>
          </div>
        )}

        {toc.length >= 3 && (
          <nav
            aria-label={uiLabel(lang, "toc")}
            style={{
              border: "1px solid rgba(20,20,26,.10)",
              borderRadius: "6px",
              padding: "0.75rem 1rem",
              marginBottom: "1.5rem",
              background: "var(--bg-faint, #F5F8FF)",
            }}
          >
            <p
              style={{
                margin: "0 0 0.5rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--muted, #6E7079)",
              }}
            >
              {uiLabel(lang, "toc")}
            </p>
            <ol style={{ margin: 0, paddingLeft: "1.25rem" }}>
              {toc.map((entry) => (
                <li key={entry.id} style={{ margin: "0.2rem 0", fontSize: "0.875rem" }}>
                  <a
                    href={`#${entry.id}`}
                    style={{ color: "inherit", borderBottom: "1px solid rgba(20,20,26,.15)" }}
                  >
                    {entry.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div
          className="blog-article-body"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />

        {post.faq && post.faq.length > 0 && (
          <section style={{ marginTop: "2rem" }} aria-labelledby="faq-heading">
            <h2 id="faq-heading" style={{ marginBottom: "1rem" }}>
              {uiLabel(lang, "faq")}
            </h2>
            {post.faq.map((item, i) => (
              <div key={i} style={{ marginBottom: "1.25rem" }}>
                <h3 style={{ margin: "0 0 0.35rem", fontSize: "1rem" }}>
                  <strong>{item.q}</strong>
                </h3>
                <p style={{ margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </section>
        )}

        {post.sources && post.sources.length > 0 && (
          <section style={{ marginTop: "2rem", borderTop: "1px solid rgba(20,20,26,.10)", paddingTop: "1rem" }}>
            <p style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted, #6E7079)" }}>
              {uiLabel(lang, "sources")}
            </p>
            <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
              {post.sources.map((src) => (
                <li key={src.url} style={{ margin: "0.2rem 0", fontSize: "0.875rem" }}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", borderBottom: "1px solid rgba(20,20,26,.15)" }}
                  >
                    {src.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section className="blog-related" aria-label="Articles liés">
            <p className="blog-related-title">
              {lang === "fr" ? "À lire ensuite" : lang === "en" ? "Read next" : "Para ler depois"}
            </p>
            <div className="blog-related-grid">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${lang}/blog/${r.slug}`}
                  className="blog-related-card"
                >
                  <span className="blog-related-category">{r.category}</span>
                  <h3 className="blog-related-card-title">{r.title}</h3>
                  <span className="blog-related-card-meta">
                    {r.readingTime} · {formatDate(r.date, dict.blogListDateLocale)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <footer className="blog-footer">
        <p className="blog-footer-text">{dict.blog.articleFooter}</p>
        <Link href={`/${lang}/rendez-vous`} className="blog-footer-cta">
          {dict.blog.footerCta}
        </Link>
        <p className="footer-legal" style={{ marginTop: 40 }}>
          © {new Date().getFullYear()} SASU PARRIT.AI · Rueil-Malmaison
        </p>
      </footer>
    </>
  );
}
