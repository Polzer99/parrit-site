import type { Locale } from './locale';
import { SINGLE_PAGE_EN } from './single-page-copy';

// Spec du 13/11/2026, ordre croissance, temps, construction. Identifiants stables FR/EN.
export type HomeGoal = {
  id: string; group: 'c' | 't' | 'b'; label: Record<Locale, string>; result: Record<Locale, string>;
  path: readonly [string, string, string];
};
export const HOME_GOALS: readonly HomeGoal[] = [
  {
    "id": "rendez-vous",
    "group": "c",
    "label": {
      "fr": "préparer ma prospection",
      "en": "prepare my outreach"
    },
    "result": {
      "fr": "Les bons contacts repérés, le message prêt.",
      "en": "The right contacts found, the message ready."
    },
    "path": [
      "Signaux du marché",
      "Prospect",
      "Rendez-vous"
    ]
  },
  {
    "id": "contenu",
    "group": "c",
    "label": {
      "fr": "préparer mes articles",
      "en": "prepare my articles"
    },
    "result": {
      "fr": "Vos sujets deviennent des articles sourcés.",
      "en": "Your topics become sourced articles."
    },
    "path": [
      "Votre expertise",
      "Sujet",
      "Article publié"
    ]
  },
  {
    "id": "relances",
    "group": "c",
    "label": {
      "fr": "relancer mes devis",
      "en": "follow up my quotes"
    },
    "result": {
      "fr": "Chaque devis sans réponse a sa relance prête.",
      "en": "Every unanswered quote has its follow-up ready."
    },
    "path": [
      "Devis",
      "Client",
      "Relance"
    ]
  },
  {
    "id": "appels-offres",
    "group": "c",
    "label": {
      "fr": "repérer les appels d’offres",
      "en": "spot tenders"
    },
    "result": {
      "fr": "Les appels d'offres utiles, triés chaque matin.",
      "en": "Relevant tenders, sorted every morning."
    },
    "path": [
      "Appels d'offres",
      "Prospect",
      "Dossier de réponse"
    ]
  },
  {
    "id": "clients-reactives",
    "group": "c",
    "label": {
      "fr": "relancer d'anciens clients",
      "en": "follow up past clients"
    },
    "result": {
      "fr": "Vous repérez les clients à rappeler et pour quel motif.",
      "en": "You identify which clients to call back and why."
    },
    "path": [
      "Base clients",
      "Client",
      "Relance"
    ]
  },
  {
    "id": "commandes",
    "group": "t",
    "label": {
      "fr": "saisir mes commandes",
      "en": "enter my orders"
    },
    "result": {
      "fr": "Les commandes reçues par e-mail, saisies, à relire.",
      "en": "Orders received by email, entered, ready to review."
    },
    "path": [
      "E-mails",
      "Commande",
      "Mise à jour ERP"
    ]
  },
  {
    "id": "factures",
    "group": "t",
    "label": {
      "fr": "rapprocher mes factures",
      "en": "reconcile my invoices"
    },
    "result": {
      "fr": "Relevés et grand livre rapprochés, écarts signalés.",
      "en": "Statements and ledger reconciled, gaps flagged."
    },
    "path": [
      "Factures",
      "Paiement",
      "Trésorerie"
    ]
  },
  {
    "id": "comptes-rendus",
    "group": "t",
    "label": {
      "fr": "préparer mes comptes rendus",
      "en": "prepare my meeting notes"
    },
    "result": {
      "fr": "Vous retrouvez les décisions et les personnes chargées de les appliquer.",
      "en": "You find the decisions and the people responsible for carrying them out."
    },
    "path": [
      "Comptes rendus",
      "Action",
      "Suivi des actions"
    ]
  },
  {
    "id": "reponses-client",
    "group": "t",
    "label": {
      "fr": "répondre à mes clients",
      "en": "answer my customers"
    },
    "result": {
      "fr": "Une réponse proposée pour chaque demande.",
      "en": "A suggested reply for every request."
    },
    "path": [
      "E-mails",
      "Client",
      "Réponse client"
    ]
  },
  {
    "id": "contrats",
    "group": "t",
    "label": {
      "fr": "vérifier mes contrats",
      "en": "check my contracts"
    },
    "result": {
      "fr": "Chaque contrat comparé à vos conditions.",
      "en": "Every contract compared with your terms."
    },
    "path": [
      "Contrats",
      "Contrat",
      "Écarts de contrat"
    ]
  },
  {
    "id": "agents",
    "group": "b",
    "label": {
      "fr": "automatiser des tâches",
      "en": "automate tasks"
    },
    "result": {
      "fr": "Des assistants se répartissent le travail. Vous gardez le contrôle.",
      "en": "Assistants share the work. You stay in control."
    },
    "path": [
      "Vos processus",
      "Processus",
      "Assistants coordonnés"
    ]
  },
  {
    "id": "logiciel",
    "group": "b",
    "label": {
      "fr": "construire mon outil",
      "en": "build my own tool"
    },
    "result": {
      "fr": "Nous construisons votre outil à partir de votre métier.",
      "en": "We build your tool around the work you do."
    },
    "path": [
      "Votre expertise",
      "Métier",
      "Logiciel propriétaire"
    ]
  },
  {
    "id": "formation",
    "group": "b",
    "label": {
      "fr": "prendre l'IA en main",
      "en": "get hands-on with AI"
    },
    "result": {
      "fr": "Vos équipes prennent l'IA en main, sur leurs propres dossiers.",
      "en": "Your teams learn to work with AI, on their own files."
    },
    "path": [
      "Vos équipes",
      "Équipe",
      "Équipes autonomes"
    ]
  },
  {
    "id": "priorites",
    "group": "b",
    "label": {
      "fr": "choisir par où commencer",
      "en": "choose where to start"
    },
    "result": {
      "fr": "Nous examinons votre travail et définissons les priorités avec vous.",
      "en": "We look at your work and set priorities with you."
    },
    "path": [
      "Vos processus",
      "Décision",
      "Feuille de route"
    ]
  },
  {
    "id": "developpeurs",
    "group": "b",
    "label": {
      "fr": "équiper mes développeurs",
      "en": "equip my developers"
    },
    "result": {
      "fr": "Vos développeurs utilisent l'IA sans perturber les logiciels en service.",
      "en": "Your developers use AI without disrupting software already in use."
    },
    "path": [
      "Votre code",
      "Projet",
      "Code contrôlé"
    ]
  },
  {
    "id": "ia-interne",
    "group": "b",
    "label": {
      "fr": "garder l'IA chez nous",
      "en": "keep AI in-house"
    },
    "result": {
      "fr": "Installée sur vos serveurs, vos données n'en sortent pas.",
      "en": "Installed on your servers, your data never leaves."
    },
    "path": [
      "Vos données",
      "Métier",
      "IA installée chez vous"
    ]
  },
  {
    "id": "prototype",
    "group": "b",
    "label": {
      "fr": "tester un outil concret",
      "en": "test a concrete tool"
    },
    "result": {
      "fr": "Vous testez une première version pour décider de la suite.",
      "en": "You test a first version to decide what comes next."
    },
    "path": [
      "Votre expertise",
      "Produit",
      "Prototype"
    ]
  }
];

export const GOAL_PLANES = [
  {
    "label": {
      "fr": "Ce que vous obtenez",
      "en": "What you get"
    },
    "nodes": [
      {
        "fr": "Rendez-vous",
        "en": "Meeting"
      },
      {
        "fr": "Article publié",
        "en": "Published article"
      },
      {
        "fr": "Relance",
        "en": "Follow-up"
      },
      {
        "fr": "Dossier de réponse",
        "en": "Tender response"
      },
      {
        "fr": "Mise à jour ERP",
        "en": "ERP update"
      },
      {
        "fr": "Trésorerie",
        "en": "Cash flow"
      },
      {
        "fr": "Suivi des actions",
        "en": "Action tracking"
      },
      {
        "fr": "Réponse client",
        "en": "Customer reply"
      },
      {
        "fr": "Écarts de contrat",
        "en": "Contract gaps"
      },
      {
        "fr": "Assistants coordonnés",
        "en": "Coordinated assistants"
      },
      {
        "fr": "Logiciel propriétaire",
        "en": "Proprietary software"
      },
      {
        "fr": "Équipes autonomes",
        "en": "Autonomous teams"
      },
      {
        "fr": "Feuille de route",
        "en": "Roadmap"
      },
      {
        "fr": "Code contrôlé",
        "en": "Reviewed code"
      },
      {
        "fr": "IA installée chez vous",
        "en": "AI installed in-house"
      },
      {
        "fr": "Prototype",
        "en": "Prototype"
      }
    ]
  },
  {
    "label": {
      "fr": "Votre entreprise",
      "en": "Your business"
    },
    "nodes": [
      {
        "fr": "Prospect",
        "en": "Prospect"
      },
      {
        "fr": "Client",
        "en": "Client"
      },
      {
        "fr": "Sujet",
        "en": "Topic"
      },
      {
        "fr": "Commande",
        "en": "Order"
      },
      {
        "fr": "Paiement",
        "en": "Payment"
      },
      {
        "fr": "Action",
        "en": "Action"
      },
      {
        "fr": "Contrat",
        "en": "Contract"
      },
      {
        "fr": "Équipe",
        "en": "Team"
      },
      {
        "fr": "Fournisseur",
        "en": "Supplier"
      },
      {
        "fr": "Processus",
        "en": "Process"
      },
      {
        "fr": "Métier",
        "en": "Trade"
      },
      {
        "fr": "Produit",
        "en": "Product"
      },
      {
        "fr": "Stock",
        "en": "Stock"
      },
      {
        "fr": "Projet",
        "en": "Project"
      },
      {
        "fr": "Réclamation",
        "en": "Complaint"
      },
      {
        "fr": "Décision",
        "en": "Decision"
      }
    ]
  },
  {
    "label": {
      "fr": "Ce que vous avez déjà",
      "en": "What you already have"
    },
    "nodes": [
      {
        "fr": "Signaux du marché",
        "en": "Market signals"
      },
      {
        "fr": "Votre expertise",
        "en": "Your expertise"
      },
      {
        "fr": "Devis",
        "en": "Quotes"
      },
      {
        "fr": "Appels d'offres",
        "en": "Tenders"
      },
      {
        "fr": "Base clients",
        "en": "Customer database"
      },
      {
        "fr": "E-mails",
        "en": "Emails"
      },
      {
        "fr": "Factures",
        "en": "Invoices"
      },
      {
        "fr": "Comptes rendus",
        "en": "Meeting notes"
      },
      {
        "fr": "Contrats",
        "en": "Contracts"
      },
      {
        "fr": "Vos logiciels",
        "en": "Your software"
      },
      {
        "fr": "Vos processus",
        "en": "Your processes"
      },
      {
        "fr": "Vos données",
        "en": "Your data"
      },
      {
        "fr": "Votre code",
        "en": "Your code"
      },
      {
        "fr": "Vos équipes",
        "en": "Your teams"
      },
      {
        "fr": "Agenda",
        "en": "Calendar"
      },
      {
        "fr": "Documents",
        "en": "Documents"
      }
    ]
  }
] as const;

// Existing ontology translations take precedence wherever the label already exists.
export function goalNodeLabel(node: {fr: string; en: string}, locale: Locale) {
 return locale === 'fr' ? node.fr : SINGLE_PAGE_EN[node.fr] ?? node.en;
}
export function homeGoal(id: string | null | undefined): HomeGoal {
 return HOME_GOALS.find(goal => goal.id === id) ?? HOME_GOALS[0];
}
export const GOAL_GROUPS = [
 {id: 'c', label: {fr: "Faire grandir l'activité", en: 'Grow the business'}, title: {fr: "Faire grandir l'activité.", en: 'Grow the business.'}},
 {id: 't', label: {fr: 'Gagner du temps', en: 'Save time'}, title: {fr: 'Libérer du temps.', en: 'Free up time.'}},
 {id: 'b', label: {fr: 'Construire', en: 'Build'}, title: {fr: 'Construire vos outils.', en: 'Build your tools.'}},
] as const;
