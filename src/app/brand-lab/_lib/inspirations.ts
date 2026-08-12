/**
 * Références du Brand Lab.
 *
 * Règle légale et créative, tenue sans exception : on extrait un PRINCIPE de
 * composition, de rythme, de densité, de hiérarchie ou de mécanique de
 * conversion. On ne reproduit ni logo, ni iconographie propriétaire, ni
 * wording, ni combinaison distinctive, ni composition au pixel.
 *
 * Les captures servent de moodboard INTERNE. Elles vivent sous
 * public/brand-lab/refs/, la route est en noindex et robots.ts la refuse.
 * Elles sont datées : un site change, la lecture ci-dessous est celle du jour
 * de capture.
 *
 * Régénérer : node scripts/brand-lab-capture.mjs [--force]
 */

export type Family = "paul" | "maxime" | "parrit";

export type Inspiration = {
  slug: string;
  name: string;
  url: string;
  families: Family[];
  /** Ce qu'on a réellement regardé, pas une impression générale. */
  observed: string;
  take: string[];
  avoid: string[];
  /** Traduction en décision de design pour le lab. */
  applied: string;
  /** Vraie si aucune capture n'a pu être faite : on retombe sur la plaque CSS. */
  noShot?: boolean;
  doctrineOnly?: boolean;
};

export const CAPTURED_AT = "12/08/2026";

export const INSPIRATIONS: Inspiration[] = [
  /* ------------------------------------------------------------------ PAUL */
  {
    slug: "palantir",
    name: "Palantir",
    url: "https://www.palantir.com/",
    families: ["paul", "parrit"],
    observed:
      "La page ne vend pas une technologie, elle nomme des situations opérationnelles. Le texte est dense, la typo tenue, l'image documentaire. Rien ne cherche à séduire.",
    take: [
      "La gravité : on sent l'infrastructure, pas la démo",
      "Les problèmes réels nommés avant la capacité",
      "L'autorité intellectuelle portée par le texte, pas par le décor",
      "La densité assumée, sans peur du paragraphe",
    ],
    avoid: [
      "Le jargon défense et grands comptes",
      "La froideur qui met le lecteur dehors",
      "La complexité qu'on ne peut pas expliquer à un dirigeant",
    ],
    applied:
      "Paul hérite du fond encre, des filets fins et de la densité tenue. Mais chaque section reste explicable à un patron de PME en une phrase.",
  },
  {
    slug: "linear",
    name: "Linear",
    url: "https://linear.app/",
    families: ["paul"],
    observed:
      "Une interface montrée en fonctionnement, presque à chaque écran. Les transitions sont courtes. L'espace est réglé au pixel, la hiérarchie tient sans décoration.",
    take: [
      "La précision : rien ne dépasse",
      "L'artisanat comme argument commercial",
      "La vitesse ressentie, motion courte et nette",
      "Montrer le produit plutôt que le décrire",
    ],
    avoid: ["Devenir un outil pour développeurs", "Le vocabulaire de la roadmap produit"],
    applied:
      "Motion la plus rapide des trois thèmes (150 ms), interfaces montrées en squelette, aucune ombre. La précision se voit dans l'alignement, pas dans un effet.",
  },
  {
    slug: "uber",
    name: "Uber",
    url: "https://www.uber.com/",
    families: ["paul"],
    observed:
      "Une action principale évidente, posée haut, sans concurrence. Le reste de la page vient après la décision, jamais avant.",
    take: [
      "Le mouvement et l'action comme sujet",
      "Une seule action principale, très simple",
      "L'ambition lisible sans slogan",
    ],
    avoid: [
      "Reprendre le branding actuel comme gabarit",
      "L'esthétique marketplace grand public",
    ],
    applied:
      "Le hero de Paul porte un CTA dominant et un prix visible. Rien d'autre ne se dispute l'attention au-dessus de la ligne de flottaison.",
  },
  {
    slug: "mckinsey",
    name: "McKinsey",
    url: "https://www.mckinsey.com/featured-insights",
    families: ["paul"],
    observed:
      "L'entrée se fait par la pensée : un article, un cadre, une prise de position. La crédibilité précède l'offre.",
    take: [
      "L'autorité par la profondeur éditoriale",
      "Les cadres de pensée montrés, pas résumés",
      "La crédibilité dirigeant",
    ],
    avoid: [
      "Le site institutionnel lent et froid",
      "Le langage de consultant qui ne dit rien",
    ],
    applied:
      "Une section « How Paul thinks » : les critères de décision écrits, y compris ceux qui disent de ne rien construire.",
  },
  {
    slug: "amazon-doctrine",
    name: "Amazon",
    url: "https://www.aboutamazon.com/",
    families: ["paul"],
    doctrineOnly: true,
    noShot: true,
    observed:
      "Arbitrage de Paul du 12/08 : Amazon sort des références visuelles. Leur interface est mauvaise et leur identité n'a rien à nous apprendre. Ce qu'on garde est l'excellence opérationnelle : l'obsession du mécanisme, la construction sur le temps long, l'efficacité comme sujet.",
    take: [
      "L'obsession de l'exécution",
      "Le mécanisme plutôt que l'intention",
      "L'efficacité et la construction longue",
    ],
    avoid: [
      "Leur direction artistique",
      "Leur interface et leurs parcours",
      "Toute reprise de forme, quelle qu'elle soit",
    ],
    applied:
      "Nourrit le FOND de la page Paul : les systèmes, le mécanisme, ce qui reste après nous. Ne touche à aucune décision de forme. Aucune capture n'est affichée, volontairement.",
  },
  {
    slug: "wispr",
    name: "Wispr Flow",
    url: "https://wisprflow.ai/",
    families: ["paul", "parrit"],
    observed:
      "On comprend le produit avant d'avoir lu. La démonstration remplace l'explication, et il n'y a presque rien à décider.",
    take: [
      "Compréhension quasi instantanée",
      "Une seule action évidente",
      "Démontrer plutôt qu'expliquer",
      "La friction retirée jusqu'à l'os",
    ],
    avoid: ["Donner à Paul le ton d'un petit logiciel grand public"],
    applied:
      "Étalon mental de chaque écran du lab : est-ce qu'on comprend quoi faire en cinq secondes ?",
  },

  /* ---------------------------------------------------------------- MAXIME */
  {
    slug: "matis-clouet",
    name: "Matis Clouet",
    url: "https://www.matisclouet.com/",
    families: ["maxime"],
    observed:
      "La personne est l'entrée. L'offre est compréhensible tout de suite, le parcours va du contenu à la confiance puis à l'accompagnement.",
    take: [
      "La marque personnelle comme actif",
      "Une offre haut de gamme lisible d'un coup",
      "Le trajet contenu, confiance, accompagnement",
      "La proximité",
    ],
    avoid: [
      "Les codes entrepreneur de vingt-cinq ans",
      "La culture du hustle",
      "Les captures de revenus",
      "L'agressivité commerciale",
    ],
    applied:
      "La page Maxime emprunte la mécanique (visage, offre claire, parcours) et refuse le registre. Le lecteur est un dirigeant de 52 ans.",
  },
  {
    slug: "iman-gadzhi",
    name: "Iman Gadzhi",
    url: "https://gadzhi.com/",
    families: ["maxime"],
    observed:
      "Production média très au-dessus du standard du secteur. La personne fonctionne comme canal de distribution à elle seule.",
    take: [
      "La puissance de production média",
      "La personne comme actif de distribution",
      "La conviction et la qualité perçue",
    ],
    avoid: [
      "L'esthétique de gourou",
      "Le luxe sombre caricatural",
      "Le train de vie comme argument",
      "Toute promesse financière",
    ],
    applied:
      "On garde le niveau de production et la mise en scène. On jette le noir et or, les chiffres de revenus et la promesse.",
  },

  /* ---------------------------------------------------------------- PARRIT */
  {
    slug: "aman",
    name: "Aman",
    url: "https://www.aman.com/",
    families: ["parrit"],
    observed:
      "Presque rien à l'écran. Une image, un lieu, un mot. Le silence fait la valeur, et l'international se dit sans drapeau.",
    take: [
      "Le silence et l'espace",
      "La retenue comme signature",
      "Un monde de marque, pas une liste d'offres",
      "L'international sans drapeaux",
    ],
    avoid: ["Le vide qui ne dit rien", "Le luxe qui refuse d'expliquer ce qu'il fait"],
    applied:
      "Parrit prend le rythme vertical le plus large des trois (12 rem entre sections) et le hero le plus pauvre en texte.",
  },
  {
    slug: "bang-olufsen",
    name: "Bang & Olufsen",
    url: "https://www.bang-olufsen.com/",
    families: ["parrit"],
    observed:
      "L'ingénierie est rendue désirable par la matière et le détail. La technologie disparaît derrière l'objet.",
    take: [
      "L'ingénierie rendue désirable",
      "La technologie qui s'efface derrière l'expérience",
      "La matière et la précision",
    ],
    avoid: ["Le fétichisme produit sans usage"],
    applied:
      "Le vocabulaire de Parrit parle travail, opérations, décisions. La technique est présente et jamais nommée.",
  },
  {
    slug: "apple",
    name: "Apple",
    url: "https://www.apple.com/",
    families: ["parrit"],
    observed:
      "La complexité rendue simple, le produit montré en fonctionnement, un niveau de détail constant du desktop au mobile.",
    take: [
      "La complexité rendue simple",
      "Le produit montré en marche",
      "Le détail tenu partout",
    ],
    avoid: ["Le mimétisme de gabarit", "La page produit qui devient une fiche technique"],
    applied:
      "La section « Watch it work » montre la chaîne complète, du signal au résultat, avec la décision humaine visible au milieu.",
  },
  {
    slug: "rimowa",
    name: "RIMOWA",
    url: "https://www.rimowa.com/",
    families: ["parrit"],
    observed:
      "Un objet fonctionnel devenu patrimoine. L'identité tient dans une forme, répétée sans fatigue.",
    take: [
      "La fonction transformée en patrimoine",
      "La permanence",
      "Une identité forte portée par une seule forme",
    ],
    avoid: ["La nostalgie décorative"],
    applied:
      "L'échelle de croissance de Parrit se lit comme un objet qui dure, pas comme une grille tarifaire.",
  },
  {
    slug: "aesop",
    name: "Aesop",
    url: "https://www.aesop.com/",
    families: ["parrit"],
    observed:
      "Un luxe sans noir ni or : de la matière, de la retenue, et un texte qui suppose un lecteur intelligent.",
    take: [
      "Le luxe sans noir et or",
      "La matière et la retenue",
      "Un texte qui respecte le lecteur",
    ],
    avoid: ["Le raffinement qui devient illisible", "Le texte littéraire pour lui-même"],
    applied:
      "Confirme le papier crème et le grain contre la tentation du noir premium. Le rouge devient rare sur Parrit.",
  },
];

export const FAMILY_LABEL: Record<Family, string> = {
  paul: "Paul · operator",
  maxime: "Maxime · guide",
  parrit: "Parrit · institution",
};
