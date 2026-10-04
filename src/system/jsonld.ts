import { orgRef, personRef } from "./auteur.ts";
import type { JournalEntry } from "./journal";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    ...orgRef(),
    alternateName: "PARRIT.AI",
    logo: "https://parrit.ai/icon.png",
    description:
      "Parrit.ai is a data and AI company: it turns a company's data into software tools the company owns. Based in France; working in English and French.",
    founder: personRef(),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rueil-Malmaison",
      addressCountry: "FR",
    },
    // Compléter sameAs quand la page LinkedIn entreprise existera.
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
    author: personRef(),
    mainEntityOfPage: canonical,
  };
}
