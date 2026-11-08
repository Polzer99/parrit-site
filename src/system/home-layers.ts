import type { Locale } from "./locale";
import { SINGLE_PAGE_EN } from "./single-page-copy.ts";

// Décision de Paul du 08/11/2026 : texte affiché et FAQPage partagent ces paires.
export const HOME_LAYERS = {
  fr: {
    offersTitle: "Deux métiers, une même transformation.",
    offers: [
      { id: "transformation", eyebrow: "Transformation IA", title: "Vos équipes prennent l'IA en main.", benefits: ["Prise en main sur vos outils et vos documents", "Accompagnement au changement, du comité de direction aux équipes métier", "Une gouvernance claire : qui utilise quoi, avec quelles règles"] },
      { id: "software", eyebrow: "Développement de logiciels", title: "Ce qui manque, nous le construisons.", benefits: ["Des outils sur mesure, reliés à vos logiciels", "Des assistants que vos équipes relisent et valident", "Installés chez vous si vos données l'exigent"] },
    ],
    offersAudience: "Pour les PME, les ETI et les grands groupes.",
    questionsTitle: "Questions",
    faq: [
      ["Par où commence-t-on ?", "Par un premier échange de 15 minutes en visioconférence, puis un cadrage écrit, ou un refus motivé si nous ne sommes pas les bons interlocuteurs."],
      ["Faut-il des équipes techniques ?", "Non. Vos équipes prennent l'IA en main sur leurs outils, puis nous construisons des assistants qu'elles relisent et valident."],
      ["Que deviennent nos données ?", "L'IA peut être installée sur vos serveurs, et nous contrôlons l'usage qu'en font vos équipes."],
      ["Quelles technologies utilisez-vous ?", "Pour chaque besoin, la plus adaptée : ChatGPT, Claude, Gemini, Mistral, Copilot, entre autres, sans dépendre d'un seul fournisseur."],
      ["Travaillez-vous avec les grands groupes comme avec les PME ?", "Oui. L'équipe se compose selon le diagnostic, parmi plus de vingt partenaires."],
      ["Combien cela coûte-t-il ?", "Le prix se fixe après le cadrage, selon le périmètre. Nous ne publions pas de grille."],
    ],
    articlesTitle: "Derniers articles",
    journalLink: "Le Journal",
  },
  en: {
    offersTitle: "Two crafts, one transformation.",
    offers: [
      { id: "transformation", eyebrow: "AI transformation", title: "Your teams take AI in hand.", benefits: ["Hands-on work with your own tools and documents", "Change management, from the executive committee to every team", "Clear governance: who uses what, under which rules"] },
      { id: "software", eyebrow: "Software development", title: "What is missing, we build.", benefits: ["Custom tools connected to your software", "Assistants your teams review and approve", "Installed on your servers when your data requires it"] },
    ],
    offersAudience: "For SMEs, mid-sized companies and large groups.",
    questionsTitle: "Questions",
    faq: [
      ["Where do we start?", "With a first 15-minute video call, then a written scope, or an explanation if we are not the right people to help."],
      ["Do we need technical teams?", "No. Your teams take AI in hand with their own tools, then we build assistants they review and approve."],
      ["What happens to our data?", "AI can be installed on your servers, and we control how your teams use it."],
      ["Which technologies do you use?", "The best fit for each need: ChatGPT, Claude, Gemini, Mistral, Copilot, among others, without depending on a single provider."],
      ["Do you work with large companies as well as SMEs?", "Yes. The team is put together according to the diagnosis, from more than twenty partners."],
      ["How much does it cost?", "The price is set after scoping, according to the project scope. We do not publish a price list."],
    ],
    articlesTitle: "Latest articles",
    journalLink: "Journal",
  },
} as const;

export function homeFaqJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: HOME_LAYERS[locale].faq.map(([name, text]) => ({
      "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text },
    })),
  };
}

// One order for the rendered home and its machine-readable description.
export const HOME_SECTION_ORDER = [
  "hero", "references", "terrain", "offers", "tools", "applications", "path", "services",
  "technologies", "team", "banner", "questions", "articles", "contact",
] as const;
export type HomeSection = typeof HOME_SECTION_ORDER[number];

// Existing heading fragments, including their emphasis, shared without new copy.
export function homeSectionHeadings(locale: Locale) {
  const t = (text: string) => locale === "fr" ? text : SINGLE_PAGE_EN[text];
  const copy = HOME_LAYERS[locale];
  return {
    hero: [t("Votre expertise est la matière première."), t("Nous la mettons au travail.")],
    references: [t("Ils travaillent"), t("avec nous.")],
    terrain: [locale === "fr" ? "Sur le terrain, avec vos équipes." : "In the field, with your teams."],
    offers: [copy.offersTitle],
    tools: [locale === "fr" ? "Comment l'IA travaille avec vos outils." : "How AI works with your tools."],
    applications: [t("Quelques applications"), t("concrètes.")],
    path: [t("Trois étapes,"), t("vous commencez où vous voulez.")],
    services: [t("Ce que l'IA prépare"), t("dans chaque service.")],
    technologies: [t("Pour chaque besoin,"), t("nous choisissons la meilleure technologie.")],
    team: [t("Chaque projet a son équipe"), t("et sa technologie.")],
    banner: [locale === "fr" ? "Votre expertise, mise au travail." : "Your expertise, put to work."],
    questions: [copy.questionsTitle],
    articles: [copy.articlesTitle],
    contact: ["Paul Larmaraud,", t("fondateur de Parrit.ai")],
  } as const satisfies Record<HomeSection, readonly string[]>;
}
