import { orgRef } from "./auteur.ts";
import { localizedPath, type Locale } from "./locale.ts";
import type { JournalEntry } from "./journal";
import type { GuideCopy } from "./site-v1-pages";
import { JOURNAL_THEMES_LAST_MODIFIED } from "./journal-themes.ts";

export function organizationJsonLd(locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    ...orgRef(),
    alternateName: "PARRIT.AI",
    logo: "https://parrit.ai/icon.png",
    description: locale === "fr"
      ? "Parrit.ai accompagne vos équipes dans la prise en main de l'IA et développe les logiciels qui leur manquent."
      : "Parrit.ai helps your teams adopt AI and builds the software they are missing.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rueil-Malmaison",
      addressCountry: "FR",
    },
    location: ["Tourcoing", "Paris"].map(addressLocality => ({
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality, addressCountry: "FR" },
    })),
    areaServed: ["Tourcoing", "Paris", "Métropole européenne de Lille", "Hauts-de-France", "France"],
    // Aucun profil entreprise vérifié dans le graphe existant.
    sameAs: [],
  };
}

export function journalThemeJsonLd(copy: Pick<GuideCopy, "title" | "description" | "faq">, locale: Locale, canonical: string) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: copy.title,
      description: copy.description,
      inLanguage: locale,
      author: orgRef(),
      publisher: orgRef(),
      mainEntityOfPage: canonical,
      dateModified: JOURNAL_THEMES_LAST_MODIFIED,
    },
    ...(copy.faq.length > 0 ? [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: locale,
      mainEntity: copy.faq.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    }] : []),
  ];
}

export function blogPostingJsonLd(entry: Pick<JournalEntry, "slug" | "title" | "date" | "description" | "updatedAt" | "author">, locale: Locale = "en") {
  const canonical = `https://parrit.ai${localizedPath(`/journal/${entry.slug}`, locale)}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonical}#article`,
    headline: entry.title,
    datePublished: entry.date,
    dateModified: entry.updatedAt ?? entry.date,
    image: `https://parrit.ai/journal/${entry.slug}/og`,
    inLanguage: locale,
    publisher: {
      ...orgRef(),
      logo: { "@type": "ImageObject", url: "https://parrit.ai/icon.png" },
    },
    description: entry.description,
    author: founderPerson(locale),
    mainEntityOfPage: canonical,
  };
}

export function journalFaqJsonLd(entry: Pick<JournalEntry, "faq">, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: (entry.faq ?? []).map(({ q, a }) => ({
      "@type": "Question", name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function founderPerson(locale: Locale = "en") {
  return { "@type": "Person", "@id": "https://parrit.ai/#paul-larmaraud", name: "Paul Larmaraud", jobTitle: locale === "fr" ? "Fondateur" : "Founder", worksFor: { "@id": orgRef()["@id"] } };
}

export function personJsonLd(locale: Locale = "en") {
  return { "@context": "https://schema.org", ...founderPerson(locale) };
}
