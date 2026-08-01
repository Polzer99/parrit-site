/**
 * PARRIT-COPY-RESET-V1 — socle de message commun aux trois concepts.
 *
 * Les trois directions artistiques portent EXACTEMENT le même message. Elles
 * ne défendent pas trois positionnements. Le choix entre A, B et C reste un
 * choix de direction artistique, pas de discours.
 *
 * Ce que Parrit vend : la transformation d'un processus opérationnel par un
 * système d'agents mis en production. Pas des agents, pas des interfaces,
 * pas des fronts.
 *
 * Rien n'est inventé ici : aucun nom de client, aucun chiffre de résultat,
 * aucune promesse de ROI. Les cas d'usage viennent tous de
 * `content/agents/catalog.json`, statut `deployed` uniquement.
 */

export const FACTS = {
  nom: "Parrit",

  hero: {
    eyebrow: "Direction IA opérationnelle · Mission de 3 mois",
    titre: ["On entre pour déployer.", "On vous laisse les clés quand ça tourne."],
    texte:
      "On choisit le processus qui vous ralentit le plus, on construit le système d'agents qui l'exécute, puis on rend vos équipes autonomes.",
  },

  /** Preuve immédiate. Aucun de ces éléments n'est une garantie universelle. */
  preuve: [
    { cle: "3 mois", ligne: "Du diagnostic à un premier système en production." },
    { cle: "5 000 € / mois", ligne: "Un périmètre et un résultat, pas des heures vendues." },
    { cle: "1 premier système", ligne: "Déployé dans les opérations réelles de l'entreprise." },
    { cle: "Vos équipes autonomes", ligne: "Contrôle, documentation et transmission inclus." },
  ],

  probleme: {
    titre: ["L'IA parle.", "Vos opérations attendent."],
    paragraphes: [
      "Vous avez peut-être déjà testé ChatGPT, lancé des ateliers ou accumulé des prototypes.",
      "Mais les dossiers circulent encore à la main. Les informations restent dispersées. Les décisions attendent la bonne personne. Et les prototypes ne passent jamais vraiment en production.",
      "Parrit intervient à cet endroit précis.",
    ],
  },

  /**
   * Cas d'usage. Chacun correspond à une entrée `status: "deployed"` du
   * catalogue public. Le cas « première version de contrat » proposé au
   * cadrage n'a **pas** été repris : rien ne l'adosse dans le catalogue.
   *
   * Aucun cas n'est classé par technologie, et le langage est celui du
   * travail réel, pas celui de l'architecture logicielle.
   */
  cas: [
    {
      id: "capture-multicanal",
      phrase: "Des demandes dispersées deviennent une fiche à jour et une relance posée.",
      entree: "Un message WhatsApp, un formulaire du site, un appel manqué.",
      systeme: "Rapproche la demande du bon dossier, complète la fiche, pose la relance.",
      sortie: "Une fiche à jour, une relance datée.",
      humain: "Qui on rappelle en priorité.",
    },
    {
      id: "acquisition-signal-first",
      phrase: "Des prospects bruts deviennent une file priorisée et documentée.",
      entree: "Un signal public daté, vérifié à la source.",
      systeme: "Vérifie, enrichit, écrit un message pour une seule personne.",
      sortie: "Une file de contacts, chacun avec la raison d'y être.",
      humain: "Ce qu'on envoie, et à qui.",
    },
    {
      id: "tri-reclamations",
      phrase: "Des réclamations en vrac deviennent un brouillon prêt à valider.",
      entree: "Une boîte mail de réclamations.",
      systeme: "Classe, isole les urgences, rédige une réponse.",
      sortie: "Un brouillon prêt à valider, les urgences remontées.",
      humain: "Ce qui part, et le geste commercial.",
    },
    {
      id: "facturation-suivi",
      phrase: "Un devis signé devient une facture émise et une échéance suivie.",
      entree: "Un devis signé.",
      systeme: "Émet la facture, décompte les heures, relance les impayés.",
      sortie: "Une facture émise, une échéance posée.",
      humain: "Quand on arrête de relancer.",
    },
  ],

  methode: {
    titre: "On commence par ce qui vous ralentit le plus.",
    etapes: [
      {
        n: "1",
        titre: "Choisir",
        corps:
          "Un processus assez coûteux pour créer un vrai résultat, mais assez précis pour être déployé rapidement.",
      },
      {
        n: "2",
        titre: "Déployer",
        corps:
          "On connecte les données, les logiciels, les règles métier et les validations humaines nécessaires.",
      },
      {
        n: "3",
        titre: "Transmettre",
        corps:
          "On mesure, on fiabilise, on documente et on rend vos équipes capables de faire évoluer le système.",
      },
    ],
  },

  hermes: {
    titre: ["Hermes fait circuler le travail.", "L'humain garde la décision."],
    texte:
      "Hermes reçoit une entrée, exécute les étapes autorisées et produit une sortie vérifiable. Quand une décision humaine est nécessaire, il s'arrête, présente le contexte et demande une validation.",
    trace: "Chaque action laisse une trace. Chaque erreur peut améliorer le système.",
    /** Attribution obligatoire. Hermes n'est pas une technologie Parrit. */
    attribution: "Hermes Agent, open source by Nous Research, MIT License.",
  },

  offre: {
    titre: "Trois mois pour ne plus dépendre de nous.",
    mois: [
      {
        n: "Mois 1",
        titre: "Choisir et connecter",
        corps: "Choisir le processus, cadrer le résultat et connecter l'existant.",
      },
      {
        n: "Mois 2",
        titre: "Déployer et mesurer",
        corps:
          "Mettre le premier système en production et le confronter aux opérations réelles.",
      },
      {
        n: "Mois 3",
        titre: "Fiabiliser et transmettre",
        corps: "Documenter, sécuriser et rendre les équipes autonomes.",
      },
    ],
    mention: "À partir de 5 000 € par mois pendant trois mois.",
  },

  final: {
    titre: "Quel processus vous coûte encore trop de temps ?",
    texte:
      "En 45 minutes, on identifie celui qui mérite d'être accéléré et on définit ce que le système doit recevoir, produire et laisser à l'humain.",
  },

  /** Le parcours diagnostic réellement implémenté. Aucune destination créée. */
  cta: {
    principal: { label: "Choisir le premier processus", href: "/diagnostic?source=lab" },
    final: { label: "Décrire le processus", href: "/diagnostic?source=lab" },
    secondaire: { label: "Voir ce qu'on déploie", href: "#cas" },
  },
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
  {
    id: "d",
    code: "D",
    nom: "Editorial Operating System",
    resume: "La synthèse. Le système porte la page, l'humain la valide.",
    href: "/art-direction-lab/concept-d",
  },
] as const;
