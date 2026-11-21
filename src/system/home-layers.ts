import type { Locale } from "./locale";
import { SINGLE_PAGE_EN } from "./single-page-copy.ts";

// Décision de Paul du 08/11/2026 : texte affiché et FAQPage partagent ces paires.
export const HOME_LAYERS = {
  fr: {
    offersTitle: "Vos équipes prennent l'IA en main. Nous construisons vos outils.",
    offers: [
      { id: "transformation", eyebrow: "Transformation IA", title: "Vos équipes prennent l'IA en main.", benefits: ["Prise en main sur vos outils et vos documents", "Accompagnement au changement, du comité de direction aux équipes métier", "Vous définissez qui utilise l'IA et selon quelles règles."] },
      { id: "software", eyebrow: "Développement de logiciels", title: "Ce qui manque, nous le construisons.", benefits: ["Des outils sur mesure, reliés à vos logiciels", "Des assistants que vos équipes relisent et valident", "Installés chez vous si vos données l'exigent"] },
    ],
    offersAudience: "Pour les PME, les ETI et les grands groupes.",
    questionsTitle: "Questions",
    faq: [
      ["Par où commence-t-on ?", "Nous échangeons pendant 15 minutes en visioconférence, puis nous définissons le travail par écrit. Si nous ne pouvons pas vous aider, nous vous expliquons pourquoi."],
      ["Faut-il des équipes techniques ?", "Non. Vos équipes prennent l'IA en main sur leurs outils, puis nous construisons des assistants qu'elles relisent et valident."],
      ["Que deviennent nos données ?", "L'IA peut être installée sur vos serveurs, et nous contrôlons l'usage qu'en font vos équipes."],
      ["Quelles technologies utilisez-vous ?", "Nous choisissons selon votre besoin parmi ChatGPT, Claude, Gemini, Mistral, Copilot et d'autres outils. Nous ne dépendons pas d'un seul fournisseur."],
      ["Travaillez-vous avec les grands groupes comme avec les PME ?", "Oui. Nous choisissons les intervenants selon les besoins de votre entreprise."],
      ["Combien cela coûte-t-il ?", "Le prix se fixe après le cadrage, selon le périmètre. Nous ne publions pas de grille."],
    ],
    articlesTitle: "Derniers articles",
    journalLink: "Le Journal",
  },
  en: {
    offersTitle: "Your teams learn to use AI. We build your tools.",
    offers: [
      { id: "transformation", eyebrow: "AI transformation", title: "Your teams take AI in hand.", benefits: ["Hands-on work with your own tools and documents", "Change management, from the executive committee to every team", "You decide who uses AI and under which rules."] },
      { id: "software", eyebrow: "Software development", title: "What is missing, we build.", benefits: ["Custom tools connected to your software", "Assistants your teams review and approve", "Installed on your servers when your data requires it"] },
    ],
    offersAudience: "For SMEs, mid-sized companies and large groups.",
    questionsTitle: "Questions",
    faq: [
      ["Where do we start?", "We talk for 15 minutes by video, then define the work in writing. If we cannot help you, we explain why."],
      ["Do we need technical teams?", "No. Your teams take AI in hand with their own tools, then we build assistants they review and approve."],
      ["What happens to our data?", "AI can be installed on your servers, and we control how your teams use it."],
      ["Which technologies do you use?", "We choose from ChatGPT, Claude, Gemini, Mistral, Copilot and other tools according to your needs. We do not depend on a single provider."],
      ["Do you work with large companies as well as SMEs?", "Yes. We choose the people involved according to the needs of your business."],
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
  "hero", "references", "motors", "measures", "assistant", "terrain", "offers", "path",
  "technologies", "team", "questions", "contact",
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
    motors: [locale === "fr" ? "Ce que ces tâches vous coûtent aujourd'hui." : "What these tasks cost you today."],
    measures: [locale === "fr" ? "Chroniques parues dans Le Monde Informatique." : "Columns published in Le Monde Informatique."],
    assistant: [locale === "fr" ? "Ou demandez à votre assistant." : "Or ask your assistant."],
    path: [t("Trois étapes,"), t("vous commencez où vous voulez.")],
    technologies: [t("Nous choisissons les outils"), t("selon votre besoin.")],
    team: [t("Chaque projet a son équipe"), t("et sa technologie.")],
    questions: [copy.questionsTitle],
    contact: [t("Vous échangez avec"), "Paul Larmaraud."],
  } as const satisfies Record<HomeSection, readonly string[]>;
}
