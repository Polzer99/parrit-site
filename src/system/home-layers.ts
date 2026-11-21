import type { Locale } from "./locale";
import { SINGLE_PAGE_EN } from "./single-page-copy.ts";

// Décision de Paul du 08/11/2026 : texte affiché et FAQPage partagent ces paires.
export const HOME_LAYERS = {
  fr: {
    offersTitle: "Vos équipes prennent l'IA en main. Nous construisons vos outils.",
    offers: [
      { id: "transformation", eyebrow: "Transformation IA", title: "Vos équipes apprennent sur leurs propres dossiers.", benefits: ["Des ateliers sur vos outils et vos documents.", "Un accompagnement du comité de direction aux équipes métier.", "Vous définissez qui utilise l'IA et selon quelles règles."] },
      { id: "software", eyebrow: "Développement de logiciels", title: "Ce qui manque, nous le construisons.", benefits: ["Des outils sur mesure, reliés à vos logiciels.", "Des assistants que vos équipes relisent et valident.", "Installés chez vous si vos données l'exigent."] },
    ],
    offersAudience: "Pour les PME, les ETI et les grands groupes.",
    questionsTitle: "Questions",
    faq: [
      ["Par où commence-t-on ?", "Nous échangeons pendant 15 minutes en visioconférence, puis nous définissons le travail par écrit. Si nous ne pouvons pas vous aider, nous vous expliquons pourquoi."],
      ["Faut-il des équipes techniques ?", "Non. Vos équipes apprennent sur leurs propres outils. Nous construisons ensuite des assistants qu'elles relisent et valident."],
      ["Que deviennent nos données ?", "L'IA peut être installée sur vos serveurs, et nous contrôlons l'usage qu'en font vos équipes."],
      ["Quelles technologies utilisez-vous ?", "Nous choisissons selon votre besoin parmi ChatGPT, Claude, Gemini, Mistral, Copilot et d'autres outils. Nous ne dépendons pas d'un seul fournisseur."],
      ["Travaillez-vous avec les grands groupes comme avec les PME ?", "Oui. Nous réunissons les intervenants qu'il faut, pour une PME comme pour un grand groupe."],
      ["Combien cela coûte-t-il ?", "Le prix se fixe après le cadrage, selon le périmètre. Nous ne publions pas de grille."],
    ],
    articlesTitle: "Derniers articles",
    journalLink: "Le Journal",
  },
  en: {
    offersTitle: "Your teams learn to use AI. We build your tools.",
    offers: [
      { id: "transformation", eyebrow: "AI transformation", title: "Your teams learn on their own files.", benefits: ["Workshops on your own tools and documents.", "Support from the executive committee to every team.", "You decide who uses AI and under which rules."] },
      { id: "software", eyebrow: "Software development", title: "What is missing, we build.", benefits: ["Custom tools connected to your software.", "Assistants your teams review and approve.", "Installed on your servers when your data requires it."] },
    ],
    offersAudience: "For SMEs, mid-sized companies and large groups.",
    questionsTitle: "Questions",
    faq: [
      ["Where do we start?", "We talk for 15 minutes by video, then define the work in writing. If we cannot help you, we explain why."],
      ["Do we need technical teams?", "No. Your teams learn on their own tools. We then build assistants they review and approve."],
      ["What happens to our data?", "AI can be installed on your servers, and we control how your teams use it."],
      ["Which technologies do you use?", "We choose from ChatGPT, Claude, Gemini, Mistral, Copilot and other tools, depending on what you need. We do not depend on a single provider."],
      ["Do you work with large companies as well as SMEs?", "Yes. We bring together the right people, for a small company as for a large group."],
      ["How much does it cost?", "The price is set after scoping and depends on the scope. We do not publish a price list."],
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
  "hero", "references", "motors", "offers", "team", "path", "terrain",
  "technologies", "measures", "questions", "contact",
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
    measures: [locale === "fr" ? "Nous publions ce que nous apprenons sur le terrain." : "We publish what we learn in the field."],
    path: [t("Trois étapes,"), t("vous commencez où vous voulez.")],
    technologies: [t("Nous choisissons les outils"), t("selon votre besoin.")],
    team: [t("Vous travaillez avec les spécialistes"), t("dont votre projet a besoin.")],
    questions: [copy.questionsTitle],
    contact: [t("Commencez par"), t("une tâche précise.")],
  } as const satisfies Record<HomeSection, readonly string[]>;
}
