import type { Locale } from "./locale";
import { SINGLE_PAGE_EN } from "./single-page-copy.ts";

// Décision de Paul du 08/11/2026 : texte affiché et FAQPage partagent ces paires.
export const HOME_LAYERS = {
  fr: {
    offersTitle: "Par où commencer",
    offers: [
      { intent: "formation", eyebrow: "Formation", benefits: ["Sur vos outils et vos documents", "Du comité de direction aux équipes métier", "En présentiel ou à distance"], title: "Former vos équipes", description: "Des formations pratiques sur vos outils et vos documents, du comité de direction aux équipes métier.", action: "Former mes équipes" },
      { intent: "grands-groupes", eyebrow: "Conseil", benefits: ["Choix des cas d’usage et cadrage", "Pilotes avec vos directions métier", "Sécurité et conformité avec votre DSI"], title: "Grands groupes", description: "Cadrage, choix des cas d'usage, pilotes et conformité, avec vos directions métier et votre DSI.", action: "Parler d'un projet" },
      { intent: "pme", eyebrow: "Conseil et outils", benefits: ["Un service à la fois", "Des outils construits sur mesure", "Vos équipes gardent la décision"], title: "PME et ETI", description: "On part d'un service, on retire ce qui fait perdre du temps, vos équipes gardent la décision.", action: "Parler d'un projet" },
    ],
    questionsTitle: "Questions",
    faq: [
      ["Par où commence-t-on ?", "Par un premier échange de 15 minutes en visioconférence, puis un cadrage écrit, ou un refus motivé si nous ne sommes pas les bons interlocuteurs."],
      ["Faut-il des équipes techniques ?", "Non. Nous formons vos équipes sur leurs outils, puis nous construisons des assistants qu'elles relisent et valident."],
      ["Que deviennent nos données ?", "L'IA peut être installée sur vos serveurs, et nous contrôlons l'usage qu'en font vos équipes."],
      ["Quelles technologies utilisez-vous ?", "Pour chaque besoin, la plus adaptée : ChatGPT, Claude, Gemini, Mistral, Copilot, entre autres, sans dépendre d'un seul fournisseur."],
      ["Travaillez-vous avec les grands groupes comme avec les PME ?", "Oui. L'équipe se compose selon le diagnostic, parmi plus de vingt partenaires."],
      ["Combien cela coûte-t-il ?", "Le prix se fixe après le cadrage, selon le périmètre. Nous ne publions pas de grille."],
    ],
    articlesTitle: "Derniers articles",
    journalLink: "Le Journal",
  },
  en: {
    offersTitle: "Where to start",
    offers: [
      { intent: "formation", eyebrow: "Training", benefits: ["On your tools and documents", "From the executive committee to operational teams", "In person or remotely"], title: "Train your teams", description: "Practical training on your tools and documents, from the executive committee to operational teams.", action: "Train my teams" },
      { intent: "grands-groupes", eyebrow: "Consulting", benefits: ["Use case selection and scoping", "Pilots with your business teams", "Security and compliance with your IT department"], title: "Large companies", description: "Scoping, use case selection, pilots and compliance, with your business teams and IT department.", action: "Talk about a project" },
      { intent: "pme", eyebrow: "Consulting and tools", benefits: ["One department at a time", "Tools built for your needs", "Your teams keep the decision"], title: "SMEs and mid-sized companies", description: "We start with one department, remove what wastes time, and your teams keep the decision.", action: "Talk about a project" },
    ],
    questionsTitle: "Questions",
    faq: [
      ["Where do we start?", "With a first 15-minute video call, then a written scope, or an explanation if we are not the right people to help."],
      ["Do we need technical teams?", "No. We train your teams on their tools, then build assistants whose work they review and approve."],
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
  "hero", "references", "terrain", "offers", "applications", "path", "services",
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
