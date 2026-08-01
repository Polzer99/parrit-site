/**
 * SPECIMENS DES HUIT TEMPLATES.
 *
 * Chaque fixture utilise des données RÉELLES : preuves du registre, assets
 * présents dans `public/`, ressources effectivement servies. Aucun faux chiffre,
 * aucun faux client, aucune fausse capture — un specimen qui ment ne prouve rien.
 *
 * Cette route est `noindex`. Elle sert de démonstration vivante et de cible QA,
 * exactement comme `/design-system`.
 */

import type { ArticleData } from "@/components/templates/T1Article";
import type { VideoData } from "@/components/templates/T2Video";
import type { SystemeData } from "@/components/templates/T4Systeme";
import type { ThemeData } from "@/components/templates/T5Theme";
import type { PresseData } from "@/components/templates/T6Presse";
import type { CampagneData } from "@/components/templates/T7Landing";
import type { AuteurData } from "@/components/templates/T8Auteur";

export const LANG = "fr";

export const ARTICLE: ArticleData = {
  slug: "specimen-derive-de-cout",
  titre: "Une facture qui monte pendant que tous les voyants restent verts",
  description:
    "Comment une erreur avalée dans un bloc catch fait repayer le même travail tous les jours.",
  corps: `
    <h2 id="le-symptome">Le symptôme</h2>
    <p>Le même nombre d'éléments traités à chaque exécution, et jamais zéro. C'est la
    signature. Un système sain finit par ne plus rien avoir à traiter.</p>
    <h2 id="la-cause">La cause</h2>
    <p>L'écriture qui marque « déjà traité » échoue. L'échec est attrapé par un bloc vide.
    L'exécution se termine en succès. Le travail recommence au cycle suivant.</p>
    <h2 id="la-parade">La parade</h2>
    <p>Un plafond par workflow, un compteur remis à zéro chaque jour, et un coupe-circuit
    qui mesure un débit — pas un total.</p>
  `,
  sommaire: [
    { id: "le-symptome", texte: "Le symptôme" },
    { id: "la-cause", texte: "La cause" },
    { id: "la-parade", texte: "La parade" },
  ],
  datePubliee: "2026-08-01",
  auteur: { nom: "Paul Larmaraud", slug: "paul-larmaraud", role: "Fondateur, Parrit.ai" },
  categorie: "Fiabilité",
  tempsLecture: "6 min",
  tldr:
    "Un bloc catch vide sur une écriture d'idempotence transforme une panne discrète en dépense quotidienne.",
  faq: [
    {
      q: "Comment repérer la boucle sans lire tout le code ?",
      a: "En comparant le nombre d'éléments traités entre deux exécutions. Un compte identique et non nul, deux fois de suite, c'est la boucle.",
    },
  ],
  sources: [{ label: "OpenRouter — API des crédits", url: "https://openrouter.ai/docs" }],
  plaque: {
    src: "/brand/editorial/plates/plate-repetition.jpg",
    alt: "Plaque éditoriale, motif de répétition",
    legende: "Répétition",
  },
  preuveRefs: ["preuve.derive-openrouter", "preuve.circuit-breaker"],
  articlesLies: [],
  themeHref: "/fr/blog/sujet/agents-ia",
  themeNom: "agent IA",
};

export const VIDEO: VideoData = {
  slug: "specimen-trace-agent",
  titre: "Un agent qui s'arrête, et la personne qui reprend la main",
  description: "Six minutes sur le point d'arrêt d'un système en production.",
  // Le specimen fournit ses trois URL : aucun adapter n'est requis, donc aucun
  // hébergeur n'est présélectionné. `provider` est ici une valeur de démonstration.
  media: {
    provider: "specimen",
    externalId: "specimen-trace-agent",
    canonicalUrl: "/media/specimen.mp4",
    embedUrl: "/media/specimen.mp4",
    thumbnail: "/brand/terrain/atelier-cartographie.jpg",
    duration: 372,
    publicationDate: "2026-08-01",
    chapters: [
      { debut: 0, titre: "Le point de départ" },
      { debut: 72, titre: "Ce que l'agent classe" },
      { debut: 220, titre: "Quand la source ne répond pas" },
    ],
    captions: [],
    transcript: [
      { t: "00:00", debut: 0, texte: "On part d'une boîte de réception, pas d'une démonstration." },
      { t: "01:12", debut: 72, texte: "L'agent classe, il ne répond pas. La réponse reste une décision humaine." },
      { t: "03:40", debut: 220, texte: "Ici la source est indisponible. L'exécution s'arrête et le dit." },
    ],
  },
  auteur: { nom: "Paul Larmaraud", slug: "paul-larmaraud" },
  resumeStructure: [
    "Ce que l'agent lit, et ce à quoi il n'a pas accès",
    "L'étape où il s'arrête tout seul",
    "Ce qu'un humain valide avant l'envoi",
    "Ce qui se passe quand la source ne répond pas",
  ],
  trace: {
    scope: "lecture seule sur une boîte de réception, aucun envoi automatique",
    steps: [
      { time: "08:02", action: "Lecture des messages non traités", source: "boîte de réception", state: "success" },
      { time: "08:03", action: "Classement par intention", state: "success" },
      { time: "08:04", action: "Enrichissement depuis la base", source: "base contacts", state: "blocked" },
      { time: "08:05", action: "Proposition de réponse soumise à validation", state: "human-review" },
    ],
  },
  videosLiees: [],
};

export const SYSTEME: SystemeData = {
  slug: "specimen-detection-de-boucle",
  titre: "Détecter un workflow qui repaye le même travail",
  lede:
    "Le système compare le nombre d'éléments traités entre deux exécutions et signale les workflows dont le compte ne descend jamais.",
  fonction: "Fiabilité et contrôle des coûts",
  perimetre: [
    "lecture seule sur les exécutions",
    "aucune modification de workflow",
    "un relevé toutes les dix minutes",
  ],
  rail: [
    {
      index: "01",
      input: "Historique d'exécutions",
      output: "Liste des workflows en boucle",
      owner: "Paul Larmaraud",
      scope: "Lecture seule. Le système signale, il ne coupe pas.",
    },
    {
      index: "02",
      input: "Relevé de crédits",
      output: "Débit horaire mesuré sur trente minutes",
      owner: "Paul Larmaraud",
      scope: "Le coupe-circuit s'arme sur un débit, jamais sur un total déjà dépensé.",
    },
  ],
  trace: {
    scope: "surveillance des exécutions, aucune écriture",
    steps: [
      { time: "10:00", action: "Relevé des exécutions des dernières 24 h", state: "success" },
      { time: "10:00", action: "Comparaison des comptes d'éléments", state: "success" },
      { time: "10:01", action: "Deux workflows signalés en boucle", state: "human-review" },
      { time: "10:01", action: "Coupure automatique", state: "blocked" },
    ],
  },
  limites: [
    "Il ne coupe aucun workflow de lui-même : il signale, un humain tranche.",
    "Il ne lit pas les identifiants stockés dans l'outil d'automatisation.",
    "Il ne dit pas si le travail effectué était utile, seulement s'il se répète.",
  ],
  deplacements: [
    {
      context: "Contrôle des coûts",
      before: "Une facture découverte en fin de mois",
      after: "Un débit horaire mesuré, et une coupure avant le seuil",
    },
  ],
  capture: {
    src: "/brand/terrain/atelier-cartographie.jpg",
    alt: "Séance de cartographie des flux, en atelier",
    legende: "Cartographie des flux, en atelier",
  },
  maturite: "en_production",
  statutVerifieManuellement: true,
  preuveRefs: ["preuve.derive-openrouter", "preuve.circuit-breaker"],
  casLies: [],
};

export const THEME: ThemeData = {
  slug: "agents-ia",
  motCle: "agent IA",
  titre: "Les agents IA en entreprise, sans le folklore",
  description: "Ce qu'un agent fait en production, où il s'arrête, et ce que ça coûte.",
  intro:
    "<p>Un agent fait le travail, il ne se contente pas de répondre. Ce qui décide de sa valeur n'est pas sa puissance, c'est l'endroit exact où il rend la main.</p>",
  articles: [
    {
      slug: ARTICLE.slug,
      href: `/fr/blog/${ARTICLE.slug}`,
      titre: ARTICLE.titre,
      meta: `${ARTICLE.tempsLecture} · ${ARTICLE.datePubliee}`,
      categorie: ARTICLE.categorie,
    },
  ],
  systemes: [
    {
      slug: SYSTEME.slug,
      href: `/fr/systemes/${SYSTEME.slug}`,
      titre: SYSTEME.titre,
      meta: SYSTEME.fonction,
      categorie: "En production",
    },
  ],
  preuveRefs: ["preuve.consolidation-gate"],
  themesVoisins: [],
};

export const PRESSE: PresseData = {
  phrase:
    "Parrit.ai conçoit et installe des systèmes qui font un travail défini, dans un périmètre déclaré, avec une personne qui garde la main.",
  faits: [
    { libelle: "Forme", valeur: "SASU", source: "statuts" },
    { libelle: "Siège", valeur: "Rueil-Malmaison, France", source: "statuts" },
  ],
  visuels: [
    { fichier: "/brand/parrit-lockup-red.svg", nom: "Lockup rouge", usage: "usage principal, sur papier" },
    { fichier: "/brand/parrit-lockup.svg", nom: "Lockup encre", usage: "quand le rouge n'est pas disponible" },
    { fichier: "/brand/parrit-reversed.svg", nom: "Version inversée", usage: "sur fond sombre uniquement" },
    { fichier: "/brand/parrit-seal.svg", nom: "Sceau", usage: "favicon, avatar, pastille" },
  ],
  portrait: {
    src: "/brand/editorial/portraits/paul-founder-bust.jpg",
    alt: "Paul Larmaraud, fondateur de Parrit.ai",
    legende: "Paul Larmaraud",
  },
  citations: [
    {
      texte: "Ce qui rend un système crédible, ce n'est pas ce qu'il sait faire. C'est l'endroit où il s'arrête.",
      auteur: "Paul Larmaraud",
      role: "Fondateur",
      date: "2026",
    },
  ],
  mentions: [],
  contact: {
    nom: "Paul Larmaraud",
    role: "Fondateur",
    email: "paul.larmaraud@parrit.ai",
  },
};

export const CAMPAGNE: CampagneData = {
  slug: "specimen-derive-de-cout",
  contexte: "Dérive de coût",
  titre: "Votre facture d'IA monte, et personne ne sait pourquoi",
  lede:
    "On regarde vos exécutions, on trouve ce qui se répète, et on pose un plafond avant que ça recommence.",
  cadrage: [
    "pour qui a déjà des automatisations en production",
    "pas pour qui n'a encore rien branché",
  ],
  verbatims: [
    "« Le workflow est vert, mais je paie tous les jours. »",
    "« Je ne sais pas quelle clé consomme quoi. »",
    "« J'ai coupé, et ça a recommencé deux jours après. »",
  ],
  rail: SYSTEME.rail,
  objections: [
    {
      question: "Vous allez couper ce qui tourne ?",
      reponse:
        "Non. Le premier passage est en lecture seule. Rien n'est coupé sans que vous l'ayez décidé.",
    },
    {
      question: "Il faut vous donner nos accès ?",
      reponse:
        "Une clé en lecture sur les exécutions suffit pour le diagnostic. Le reste vient après, si vous le voulez.",
    },
  ],
  utmCampaign: "derive-de-cout-2026-08",
  noindex: true,
};

export const AUTEUR: AuteurData = {
  slug: "paul-larmaraud",
  nom: "Paul Larmaraud",
  role: "Fondateur, Parrit.ai",
  positionnement:
    "Il conçoit des systèmes qui font un travail défini et qui rendent la main à un endroit choisi. Il écrit ce qui rate autant que ce qui marche.",
  portrait: {
    src: "/brand/editorial/portraits/paul-founder-bust.jpg",
    alt: "Paul Larmaraud",
    legende: "Fondateur",
  },
  preuveRefs: ["preuve.consolidation-gate", "preuve.capture-site"],
  publications: THEME.articles,
  sameAs: ["https://www.linkedin.com/in/paullarmaraud/"],
};
