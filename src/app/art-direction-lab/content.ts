/**
 * PARRIT-VISUAL-RESET-V2 — socle d'information commun aux trois concepts.
 *
 * Les trois directions artistiques doivent porter EXACTEMENT les mêmes faits.
 * Si un concept paraît plus convaincant qu'un autre, ce doit être à cause de
 * sa direction artistique, pas parce qu'il en dit plus.
 *
 * Source des faits : TRUTH.md. Rien n'est inventé ici : aucun prix, aucun nom
 * de client, aucun chiffre de résultat, aucune promesse de ROI.
 */

export const FACTS = {
  nom: "Parrit",
  phrase: "Parrit opère vos deux fronts critiques.",

  /** Les deux cas d'usage sont de poids strictement égal. TRUTH.md §1. */
  fronts: [
    {
      code: "BO",
      titre: "Back-office automatisé",
      corps:
        "On opère les fronts internes critiques : gestion, capture multi-canal, facturation, veille, support.",
      entree: "Une boîte mail, un tableur, un canal de tickets.",
      sortie: "Une fiche à jour, une facture émise, une relance posée.",
    },
    {
      code: "BG",
      titre: "Business généré",
      corps:
        "On va chercher du revenu : signaux de marché, prise de contact personnalisée, rendez-vous qualifiés.",
      entree: "Un signal public daté, vérifié à la source.",
      sortie: "Un message écrit pour une seule personne, et un créneau.",
    },
  ],

  /** Chaîne à deux mains. TRUTH.md §1. */
  mains: [
    { qui: "Paul", role: "fait naître le prototype, code tous les jours" },
    { qui: "Yukun", role: "le met en production sur les systèmes réels" },
  ],
  citation: "Ce qui tourne chez un client tourne d'abord chez moi.",

  /** Trois offres, toutes sur devis. Aucun prix public. TRUTH.md §4 et §6.1. */
  offres: [
    {
      n: "01",
      titre: "Transformation IA",
      corps: "Advisory COMEX et DSI, transformation de bout en bout.",
      prix: "sur devis",
    },
    {
      n: "02",
      titre: "Sprint agentique",
      corps: "Un agent en production contrôlée, périmètre fermé.",
      prix: "sur devis",
    },
    {
      n: "03",
      titre: "Formation agentique",
      corps: "Rendre les équipes autonomes. Finançable OPCO.",
      prix: "sur devis",
    },
  ],

  /**
   * Traces d'exécution. Ce sont des FORMES de trace, pas des résultats
   * mesurés : aucun volume, aucune durée, aucun nom de client.
   */
  traces: [
    {
      entree: "Un mail entrant",
      sortie: "Une fiche prospect créée, un créneau proposé",
      proprietaire: "Direction commerciale",
      etat: "tourne",
    },
    {
      entree: "Un devis signé",
      sortie: "Une facture émise, une échéance posée",
      proprietaire: "Administration des ventes",
      etat: "tourne",
    },
    {
      entree: "Un signal public daté",
      sortie: "Un message écrit pour une seule personne",
      proprietaire: "Direction générale",
      etat: "décision humaine",
    },
    {
      entree: "Un ticket support",
      sortie: "Une réponse rédigée, une relance planifiée",
      proprietaire: "Service client",
      etat: "tourne",
    },
  ],

  cta: {
    principal: { label: "Parler à Paul", href: "/diagnostic?source=lab", note: "15 minutes, visio ou présentiel" },
    secondaire: { label: "Voir ce qui tourne", href: "#fronts" },
  },

  /** Mention obligatoire dès qu'Hermes est nommé. */
  hermes:
    "Hermes est un modèle open source de Nous Research, sous licence MIT. Ce n'est pas une technologie Parrit.",
} as const;

export const CONCEPTS = [
  {
    id: "a",
    code: "A",
    nom: "Editorial Field Report",
    resume: "Le compte rendu de terrain. Le portrait porte la page.",
    href: "/art-direction-lab/concept-a",
  },
  {
    id: "b",
    code: "B",
    nom: "Agent Operating System",
    resume: "Le registre d'exécution. La trace porte la page.",
    href: "/art-direction-lab/concept-b",
  },
  {
    id: "c",
    code: "C",
    nom: "Manifesto in Production",
    resume: "L'affiche. La typographie porte la page.",
    href: "/art-direction-lab/concept-c",
  },
] as const;
