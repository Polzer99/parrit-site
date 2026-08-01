/**
 * GRAPHE SCHEMA.ORG — les `@id` sont STABLES. Les casser casse tout le reste :
 * le `BlogPosting` de T1 pointe le `#person` de T8, qui pointe le `#organization`
 * du layout. C'est un graphe, pas une collection de balises indépendantes.
 *
 * Les helpers reprennent le balisage déjà en place dans
 * `src/app/[lang]/blog/[slug]/page.tsx:173-242`, qui est correct — ils le
 * factorisent, ils ne le réécrivent pas.
 */

import type { Miette } from "@/components/shell/Breadcrumb";

export const SITE_URL = "https://parrit.ai";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function personId(lang: string, slug: string): string {
  return `${SITE_URL}/${lang}/auteur/${slug}#person`;
}

export function organizationRef() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Parrit.ai",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/brand/parrit-lockup-red.svg`,
    },
  };
}

/**
 * Le fil d'Ariane visible et le `BreadcrumbList` sortent du MÊME tableau.
 */
export function breadcrumbList(miettes: Miette[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: miettes.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.nom,
      item: `${SITE_URL}${m.href}`,
    })),
  };
}

export function faqPage(url: string, faq: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Durée ISO 8601 à partir de secondes — exigée par `VideoObject.duration`. */
export function dureeISO(secondes: number): string {
  const h = Math.floor(secondes / 3600);
  const m = Math.floor((secondes % 3600) / 60);
  const s = secondes % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s}S`;
}

export function graphe(noeuds: object[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": noeuds });
}
