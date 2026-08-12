/**
 * Brand Lab · configuration de l'offre d'entrée COMMUNE à Paul et Maxime.
 *
 * Même produit économique, deux expressions psychologiques. Le prix est
 * volontairement configurable ici et NULLE PART ailleurs : aucun composant ne
 * doit hardcoder un montant. Deux variantes sont exposées pour être testées
 * visuellement côte à côte (ancrage rond vs ancrage psychologique).
 */

export type PriceVariant = "round" | "charm";

/** Variante affichée par défaut dans le lab. Bascule ici, pas dans les pages. */
export const BUILD_WITH_YOU_PRICE_VARIANT: PriceVariant = "round";

export const BUILD_WITH_YOU_PRICE = {
  round: { amount: "2 500 €", unit: "HT", raw: 2500 },
  charm: { amount: "2 499 €", unit: "HT", raw: 2499 },
} as const;

export const price = BUILD_WITH_YOU_PRICE[BUILD_WITH_YOU_PRICE_VARIANT];

export const OFFER = {
  hours: 10,
  format: "10 heures de co-construction, avec vous, sur votre travail réel.",
  /** Ce que le client repart avec. Aucun résultat chiffré : rien n'est prouvé. */
  outcomes: [
    "Un premier système qui tourne sur vos vraies données, pas une maquette.",
    "La méthode pour choisir le prochain cas d'usage sans nous.",
    "De quoi traiter seul les petits sujets.",
  ],
  /** Ce que l'offre n'est PAS. Sert de garde-fou anti-dérive du copy. */
  isNot: [
    "10 heures de conseil",
    "une formation IA académique",
    "une liste d'outils",
    "une transformation avant d'avoir compris le besoin",
  ],
} as const;

/** Les six mouvements des 10 heures. Progression visible, jamais scolaire. */
export const METHOD = [
  {
    key: "understand",
    label: "Understand",
    fr: "Comprendre",
    line: "On regarde comment vous travaillez vraiment. Pas comment vous êtes censé travailler.",
  },
  {
    key: "select",
    label: "Select",
    fr: "Choisir",
    line: "On identifie le bon premier cas. Tout ne mérite pas d'être automatisé, et le dire fait partie du travail.",
  },
  {
    key: "build",
    label: "Build",
    fr: "Construire",
    line: "On construit ensemble, en direct. Pas de boîte noire livrée trois semaines plus tard.",
  },
  {
    key: "use",
    label: "Use",
    fr: "Utiliser",
    line: "On le fait tourner sur du travail réel, dans la semaine, pas dans un bac à sable.",
  },
  {
    key: "learn",
    label: "Learn",
    fr: "Comprendre pourquoi",
    line: "Pourquoi ça marche, et surtout où sont les limites. C'est ce qui rend la suite possible.",
  },
  {
    key: "repeat",
    label: "Repeat",
    fr: "Recommencer",
    line: "Vous savez repérer le prochain usage. C'est là que vous n'avez plus besoin de nous pour les petits sujets.",
  },
] as const;

/** La transformation. Sans jargon, lisible en une passe. */
export const ARC = [
  { state: "Perdu", line: "« Il se passe quelque chose d'important. Je ne sais pas quoi en faire. »" },
  { state: "Je comprends", line: "Vous voyez où la machine aide, et où elle ne sert à rien." },
  { state: "Je construis", line: "Sur votre propre travail : vos documents, vos données, vos processus." },
  { state: "J'obtiens un résultat", line: "Un premier système qui tourne et que vous utilisez." },
  { state: "Je sais continuer", line: "Vous identifiez le suivant, et vous le faites." },
] as const;

/** Matière de travail possible pendant les 10 heures. Concret, jamais générique. */
export const MATERIAL = [
  { k: "Administratif", v: "les pièces qui reviennent chaque mois et qu'on retraite à la main" },
  { k: "Commercial", v: "la préparation de rendez-vous, le suivi, ce qui tombe entre deux relances" },
  { k: "Reporting", v: "l'export brut, le reclassement, le document qu'on ose envoyer" },
  { k: "Analyse", v: "les fichiers qu'on ouvre pour répondre à une seule question" },
  { k: "Contenu", v: "ce qu'on écrit dix fois par mois sous une forme légèrement différente" },
  { k: "Documents", v: "les contrats, les comptes rendus, ce qu'il faut relire avant d'envoyer" },
  { k: "Processus", v: "l'enchaînement que tout le monde connaît mais que personne n'a écrit" },
  { k: "Recherche", v: "ce qu'on va chercher chaque semaine et qu'on oublie de recouper" },
] as const;
