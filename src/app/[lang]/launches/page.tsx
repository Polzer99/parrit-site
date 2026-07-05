import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LaunchesLibrary from "@/components/LaunchesLibrary";
import { getAllLaunches, getCategories } from "@/lib/launches";
import {
  getDictionary,
  hasLocale,
  locales,
  type Locale,
} from "../dictionaries";

const SITE_URL = "https://parrit.ai";
const TITLE = "Launches IA | Parrit.ai";
const DESCRIPTION =
  "Les prototypes IA livres par Parrit.ai : systemes deployes, stacks, durees et retours de terrain.";

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

  return {
    metadataBase: new URL(SITE_URL),
    title: TITLE,
    description: DESCRIPTION,
    alternates: {
      canonical: `${SITE_URL}/${lang}/launches`,
      languages: Object.fromEntries([
        ...locales.map((locale) => [locale, `${SITE_URL}/${locale}/launches`]),
        ["x-default", `${SITE_URL}/fr/launches`],
      ]),
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}/${lang}/launches`,
      siteName: "Parrit.ai",
      locale: dict.meta.ogLocale,
      type: "website",
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Parrit.ai Launches",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

export default async function LaunchesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const launches = getAllLaunches();
  const categories = getCategories();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/${lang}/launches`,
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
          <Link href={`/${lang}/launches`} className="blog-nav-link">
            Launches
          </Link>
          <Link href={`/${lang}/blog`} className="blog-nav-link">
            Articles
          </Link>
        </div>
      </nav>

      <main className="launch-page">
        <header className="launch-header">
          <p className="launch-kicker">Build in public</p>
          <h1>Launches</h1>
          <p>
            Un launch = un systeme IA deploye. Pas une promesse, une trace de
            fabrication : probleme, architecture, stack, duree et apprentissage.
          </p>
        </header>

        <LaunchesLibrary categories={categories} lang={lang} launches={launches} />
      </main>
    </>
  );
}
