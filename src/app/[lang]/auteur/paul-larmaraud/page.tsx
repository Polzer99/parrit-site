import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDictionary,
  hasLocale,
  locales,
  type Locale,
} from "../../dictionaries";

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
  const a = dict.author;

  return {
    title: a.metaTitle,
    description: a.metaDescription,
    authors: [{ name: "Paul Larmaraud" }],
    alternates: {
      canonical: `${SITE_URL}/${lang}/auteur/paul-larmaraud`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}/auteur/paul-larmaraud`]),
      ),
    },
    openGraph: {
      title: a.metaTitle,
      description: a.metaDescription,
      url: `${SITE_URL}/${lang}/auteur/paul-larmaraud`,
      siteName: "Parrit.ai",
      locale: dict.meta.ogLocale,
      type: "profile",
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const a = dict.author;

  const profileUrl = `${SITE_URL}/${lang}/auteur/paul-larmaraud`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${profileUrl}#profilepage`,
        url: profileUrl,
        name: a.metaTitle,
        description: a.metaDescription,
        inLanguage: lang,
        mainEntity: { "@id": `${SITE_URL}/#paul-larmaraud` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#paul-larmaraud`,
        name: "Paul Larmaraud",
        givenName: "Paul",
        familyName: "Larmaraud",
        jobTitle: "Fondateur Parrit.ai",
        url: profileUrl,
        email: "paul.larmaraud@parrit.ai",
        worksFor: { "@id": `${SITE_URL}/#organization` },
        sameAs: [
          "https://www.linkedin.com/in/paul-larmaraud/",
          "https://github.com/Polzer99",
        ],
        knowsAbout: [
          "Claude Code",
          "Anthropic Claude",
          "AI agents",
          "Production AI deployment",
          "B2B sales operations automation",
          "API integration",
          "Rapid prototyping",
        ],
        knowsLanguage: ["fr", "en", "pt-BR"],
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
            name: "Paul Larmaraud",
            item: profileUrl,
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

      <article className="blog-article" style={{ paddingTop: 80 }}>
        <header className="blog-article-header">
          <h1 className="blog-article-title">{a.title}</h1>
          <p
            className="blog-article-subtitle"
            style={{ color: "var(--text-muted)", marginTop: 8 }}
          >
            {a.role} · {a.location}
          </p>
        </header>

        <div className="blog-article-content">
          <p>{a.bioP1}</p>
          <p>{a.bioP2}</p>
          <p>{a.bioP3}</p>

          <h2>{a.expertiseTitle}</h2>
          <ol>
            {a.expertise.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ol>

          <h2>{a.experienceTitle}</h2>
          <ol>
            {a.experience.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ol>

          <h2>{a.linksTitle}</h2>
          <ol>
            <li>
              <a
                href="https://www.linkedin.com/in/paul-larmaraud/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {a.links.linkedin}
              </a>
            </li>
            <li>
              <a href="mailto:paul.larmaraud@parrit.ai">{a.links.email}</a>
            </li>
            <li>
              <Link href={`/${lang}/blog`}>{a.links.blog}</Link>
            </li>
          </ol>

          <h2>{a.ctaTitle}</h2>
          <p>{a.ctaText}</p>
          <p>
            <Link href={`/${lang}#callback-form`} className="blog-footer-cta">
              {a.ctaButton}
            </Link>
          </p>
        </div>

        <footer className="blog-footer">
          <p className="footer-legal" style={{ marginTop: 40 }}>
            © {new Date().getFullYear()} SASU PARRIT.AI · Rueil-Malmaison
          </p>
        </footer>
      </article>
    </>
  );
}
