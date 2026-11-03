import { orgRef } from "./auteur.ts";
import type { Locale } from "./locale";
import type { JournalEntry } from "./journal";

export function organizationJsonLd(locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    ...orgRef(),
    alternateName: "PARRIT.AI",
    logo: "https://parrit.ai/icon.png",
    description: locale === "fr"
      ? "Parrit.ai forme vos équipes à l'IA et construit les outils qui leur manquent."
      : "Parrit.ai trains your teams in AI and builds the tools they need.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rueil-Malmaison",
      addressCountry: "FR",
    },
    areaServed: ["Lille", "Métropole européenne de Lille", "Hauts-de-France", "France"],
    // Aucun profil entreprise vérifié dans le graphe existant.
    sameAs: [],
  };
}

export function blogPostingJsonLd(entry: Pick<JournalEntry, "slug" | "title" | "date" | "description">) {
  const canonical = `https://parrit.ai/journal/${entry.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonical}#article`,
    headline: entry.title,
    datePublished: entry.date,
    dateModified: entry.date,
    image: `${canonical}/og`,
    inLanguage: "en",
    publisher: {
      ...orgRef(),
      logo: { "@type": "ImageObject", url: "https://parrit.ai/icon.png" },
    },
    description: entry.description,
    author: orgRef(),
    mainEntityOfPage: canonical,
  };
}

export function personJsonLd(locale: Locale = "en") {
  return { "@context": "https://schema.org", "@type": "Person", "@id": "https://parrit.ai/#founder", name: "Paul Larmaraud", jobTitle: locale === "fr" ? "Fondateur" : "Founder", worksFor: orgRef() };
}
