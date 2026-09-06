import type { Metadata } from "next";
import { DICT, type CampLang } from "./dict";

const SITE_URL = "https://parrit.ai";
const CAMP_URL = "https://campparrita.com";
const OG_IMAGE = `${CAMP_URL}/camp/hero-coast.jpg`;

const LANG_SUFFIX: Record<CampLang, string> = { fr: "", en: "/en", es: "/es" };

export function campMetadata(lang: CampLang): Metadata {
  const c = DICT[lang];
  const canonical = `${CAMP_URL}${LANG_SUFFIX[lang]}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical,
      languages: {
        fr: CAMP_URL,
        en: `${CAMP_URL}/en`,
        es: `${CAMP_URL}/es`,
        "x-default": `${CAMP_URL}/en`,
      },
    },
    openGraph: {
      title: c.ogTitle,
      description: c.ogDescription,
      url: canonical,
      siteName: "Camp Parrita",
      type: "website",
      locale: lang === "fr" ? "fr_FR" : lang === "en" ? "en_US" : "es_419",
      images: [{ url: OG_IMAGE, width: 1800, height: 1012, alt: "Camp Parrita" }],
    },
    twitter: {
      card: "summary_large_image",
      title: c.ogTitle,
      description: c.metaDescription,
      images: [OG_IMAGE],
    },
  };
}

// JSON-LD : FAQPage (citable tel quel par les moteurs génératifs) + Course
// (l'offre, rattachée à l'Organization Parrit.ai + instructor Person).
export function CampJsonLd({ lang }: { lang: CampLang }) {
  const c = DICT[lang];
  const canonical = `${CAMP_URL}${LANG_SUFFIX[lang]}`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: c.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: c.metaTitle,
    description: c.metaDescription,
    url: canonical,
    inLanguage: lang,
    provider: {
      "@type": "Organization",
      name: "Parrit.ai",
      url: SITE_URL,
    },
    instructor: {
      "@type": "Person",
      name: "Paul Larmaraud",
      url: `${SITE_URL}/fr/auteur/paul-larmaraud`,
      description: c.founder.p1,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: {
        "@type": "Place",
        name: "Pacific Coast, Costa Rica (Sámara and Parrita area)",
        address: { "@type": "PostalAddress", addressCountry: "CR" },
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
    </>
  );
}
