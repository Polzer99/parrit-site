import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getDictionary,
  hasLocale,
  locales,
  type Locale,
} from "../../dictionaries";
import CaseStudyPage, {
  type CaseStudyData,
  type CaseStudyNavLink,
} from "@/components/CaseStudyPage";

const SITE_URL = "https://parrit.ai";

type CasVitrinesProfile = Awaited<
  ReturnType<typeof getDictionary>
>["casVitrines"]["profiles"][number];

export async function generateStaticParams() {
  const fr = await getDictionary("fr");
  const slugs = fr.casVitrines.profiles.map((p) => p.slug);
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

  const dict = await getDictionary(lang as Locale);
  const profile = dict.casVitrines.profiles.find((p) => p.slug === slug);
  if (!profile) return {};

  const title = `${profile.hero.titleMain} ${profile.hero.titleAccent} — Parrit.ai`;
  const description = profile.hero.intro;

  const languagesMap: Record<string, string> = {
    "x-default": `${SITE_URL}/fr/cas/${slug}`,
  };
  locales.forEach((l) => {
    languagesMap[l] = `${SITE_URL}/${l}/cas/${slug}`;
  });

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/cas/${slug}`,
      languages: languagesMap,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}/cas/${slug}`,
      siteName: "Parrit.ai",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

function toCaseStudyData(profile: CasVitrinesProfile, labels: {
  profile: string;
  transformation: string;
  domains: string;
  result: string;
  stack: string;
}, ctaTitle: string, ctaSubtitle: string): CaseStudyData {
  return {
    slug: profile.slug,
    hero: profile.hero,
    profile: { title: labels.profile, items: profile.profile.items },
    transformation: {
      title: labels.transformation,
      quote: profile.transformation.quote,
      body: profile.transformation.body,
    },
    domains: { title: labels.domains, items: profile.domains },
    result: {
      title: labels.result,
      metrics: profile.result.metrics,
      note: profile.result.note,
    },
    stack: { title: labels.stack, items: profile.stack },
    cta: { title: ctaTitle, subtitle: ctaSubtitle },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const cv = dict.casVitrines;
  const profile = cv.profiles.find((p) => p.slug === slug);
  if (!profile) notFound();

  const data = toCaseStudyData(profile, cv.labels, cv.ctaTitle, cv.ctaSubtitle);

  const otherProfiles: CaseStudyNavLink[] = cv.profiles
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      slug: p.slug,
      badge: p.hero.badge,
      title: `${p.hero.titleMain} ${p.hero.titleAccent}`,
    }));

  const pageUrl = `${SITE_URL}/${lang}/cas/${slug}`;
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: `${profile.hero.titleMain} ${profile.hero.titleAccent}`,
        description: profile.hero.intro,
        url: pageUrl,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
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
            name: "Cas vitrines",
            item: `${SITE_URL}/${lang}/cas`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: profile.hero.badge,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <CaseStudyPage
        data={data}
        otherProfiles={otherProfiles}
        otherProfilesTitle={cv.labels.otherProfilesTitle}
        otherProfilesLabel={cv.labels.otherProfilesCta}
        lang={lang as Locale}
        quickContact={dict.quickContact}
        pageId={`cas-${slug}`}
      />
    </>
  );
}
