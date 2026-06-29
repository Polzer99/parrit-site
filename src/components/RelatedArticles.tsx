import Link from "next/link";
import { getPostsByPillar, type BlogLocale } from "@/lib/blog";
import type { PillarSlug } from "@/lib/pillars";

interface Props {
  lang: string;
  pillar: PillarSlug;
}

function toContentLocale(lang: string): BlogLocale {
  if (lang === "fr" || lang === "en" || lang === "pt-BR") return lang;
  return "en";
}

function sectionTitle(lang: string): string {
  if (lang === "fr") return "Articles liés";
  if (lang === "pt-BR") return "Artigos relacionados";
  if (lang === "zh-CN") return "相关文章";
  return "Related articles";
}

export default function RelatedArticles({ lang, pillar }: Props) {
  const locale = toContentLocale(lang);
  const posts = getPostsByPillar(pillar, locale).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="blog-related landing-related" aria-label={sectionTitle(lang)}>
      <p className="blog-related-title">{sectionTitle(lang)}</p>
      <div className="blog-related-grid">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/${lang}/blog/${post.slug}`}
            className="blog-related-card"
          >
            <span className="blog-related-category">{post.category}</span>
            <h3 className="blog-related-card-title">{post.title}</h3>
            <span className="blog-related-card-meta">{post.readingTime}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
