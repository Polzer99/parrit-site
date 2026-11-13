import type { Locale } from './locale';
import { SINGLE_PAGE_EN } from './single-page-copy';

// Spec du 13/11/2026, ordre croissance, temps, construction. Identifiants stables FR/EN.
export type HomeGoal = {
  id: string; group: 'c' | 't' | 'b'; label: Record<Locale, string>; result: Record<Locale, string>;
  path: readonly [string, string, string];
  flow?: Record<Locale, {label: string; steps: readonly [string, string, string]}>;
};
export const HOME_GOALS: readonly HomeGoal[] = [
  {
    "id": "rendez-vous",
    "group": "c",
    "label": {
      "fr": "plus de rendez-vous",
      "en": "more meetings"
    },
    "result": {
      "fr": "Les bons contacts repérés, le message prêt.",
      "en": "The right contacts found, the message ready."
    },
    "path": [
      "Signaux du marché",
      "Prospect",
      "Rendez-vous"
    ],
    "flow": {
      "fr": {
        "label": "Rendez-vous",
        "steps": [
          "Signaux",
          "Message prêt",
          "Rendez-vous"
        ]
      },
      "en": {
        "label": "Appointments",
        "steps": [
          "Signals",
          "Message ready",
          "Meeting"
        ]
      }
    }
  },
  {
    "id": "contenu",
    "group": "c",
    "label": {
      "fr": "du contenu publié",
      "en": "content published"
    },
    "result": {
      "fr": "Vos sujets deviennent des articles sourcés.",
      "en": "Your topics become sourced articles."
    },
    "path": [
      "Votre expertise",
      "Sujet",
      "Article publié"
    ],
    "flow": {
      "fr": {
        "label": "Contenu",
        "steps": [
          "Expertise",
          "Article sourcé",
          "Publié"
        ]
      },
      "en": {
        "label": "Content",
        "steps": [
          "Expertise",
          "Sourced article",
          "Published"
        ]
      }
    }
  },
  {
    "id": "relances",
    "group": "c",
    "label": {
      "fr": "des devis relancés",
      "en": "quotes followed up"
    },
    "result": {
      "fr": "Chaque devis sans réponse a sa relance prête.",
      "en": "Every unanswered quote has its follow-up ready."
    },
    "path": [
      "Devis",
      "Client",
      "Relance"
    ],
    "flow": {
      "fr": {
        "label": "Relances",
        "steps": [
          "Devis",
          "Relance prête",
          "Réponse"
        ]
      },
      "en": {
        "label": "Follow-ups",
        "steps": [
          "Quote",
          "Follow-up ready",
          "Reply"
        ]
      }
    }
  },
  {
    "id": "appels-offres",
    "group": "c",
    "label": {
      "fr": "des appels d'offres repérés",
      "en": "tenders spotted"
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
      "fr": "d'anciens clients réactivés",
      "en": "past clients reactivated"
    },
    "result": {
      "fr": "Les clients silencieux, avec une raison de les rappeler.",
      "en": "Quiet clients, with a reason to call them back."
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
      "fr": "des commandes saisies",
      "en": "orders entered"
    },
    "result": {
      "fr": "Les commandes reçues par e-mail, saisies, à relire.",
      "en": "Orders received by email, entered, ready to review."
    },
    "path": [
      "E-mails",
      "Commande",
      "Mise à jour ERP"
    ],
    "flow": {
      "fr": {
        "label": "Commandes",
        "steps": [
          "E-mail",
          "Commande",
          "ERP à jour"
        ]
      },
      "en": {
        "label": "Orders",
        "steps": [
          "Email",
          "Order",
          "ERP updated"
        ]
      }
    }
  },
  {
    "id": "factures",
    "group": "t",
    "label": {
      "fr": "des factures rapprochées",
      "en": "invoices reconciled"
    },
    "result": {
      "fr": "Relevés et grand livre rapprochés, écarts signalés.",
      "en": "Statements and ledger reconciled, gaps flagged."
    },
    "path": [
      "Factures",
      "Paiement",
      "Trésorerie"
    ],
    "flow": {
      "fr": {
        "label": "Finance",
        "steps": [
          "Relevés",
          "Rapprochement",
          "Trésorerie"
        ]
      },
      "en": {
        "label": "Finance",
        "steps": [
          "Statements",
          "Reconciliation",
          "Cash flow"
        ]
      }
    }
  },
  {
    "id": "comptes-rendus",
    "group": "t",
    "label": {
      "fr": "des comptes rendus prêts",
      "en": "meeting notes ready"
    },
    "result": {
      "fr": "Les décisions de la réunion, et qui s'en charge.",
      "en": "The meeting's decisions, and who owns them."
    },
    "path": [
      "Comptes rendus",
      "Action",
      "Suivi des actions"
    ],
    "flow": {
      "fr": {
        "label": "Réunions",
        "steps": [
          "Réunion",
          "Compte rendu",
          "Actions"
        ]
      },
      "en": {
        "label": "Meetings",
        "steps": [
          "Meeting",
          "Notes",
          "Actions"
        ]
      }
    }
  },
  {
    "id": "reponses-client",
    "group": "t",
    "label": {
      "fr": "des réponses client prêtes",
      "en": "customer replies ready"
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
      "fr": "des contrats vérifiés",
      "en": "contracts checked"
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
      "fr": "une flotte d'agents autonomes",
      "en": "a fleet of autonomous agents"
    },
    "result": {
      "fr": "Des agents qui se répartissent le travail, sous votre contrôle.",
      "en": "Agents that share the work, under your control."
    },
    "path": [
      "Vos processus",
      "Processus",
      "Agents autonomes"
    ],
    "flow": {
      "fr": {
        "label": "Agents",
        "steps": [
          "Processus",
          "Agents",
          "Contrôle"
        ]
      },
      "en": {
        "label": "Agents",
        "steps": [
          "Processes",
          "Agents",
          "Control"
        ]
      }
    }
  },
  {
    "id": "logiciel",
    "group": "b",
    "label": {
      "fr": "un logiciel propriétaire",
      "en": "proprietary software"
    },
    "result": {
      "fr": "Un outil à vous, construit sur votre métier.",
      "en": "A tool of your own, built on your trade."
    },
    "path": [
      "Votre expertise",
      "Métier",
      "Logiciel propriétaire"
    ],
    "flow": {
      "fr": {
        "label": "Logiciel",
        "steps": [
          "Votre métier",
          "Logiciel",
          "À vous"
        ]
      },
      "en": {
        "label": "Software",
        "steps": [
          "Your trade",
          "Software",
          "Yours"
        ]
      }
    }
  },
  {
    "id": "formation",
    "group": "b",
    "label": {
      "fr": "des équipes formées à l'IA",
      "en": "teams trained in AI"
    },
    "result": {
      "fr": "Vos équipes prennent l'IA en main, sur leurs propres dossiers.",
      "en": "Your teams take AI in hand, on their own files."
    },
    "path": [
      "Vos équipes",
      "Équipe",
      "Équipes autonomes"
    ],
    "flow": {
      "fr": {
        "label": "Équipes",
        "steps": [
          "Formation",
          "Pratique",
          "Autonomie"
        ]
      },
      "en": {
        "label": "Teams",
        "steps": [
          "Training",
          "Practice",
          "Autonomy"
        ]
      }
    }
  },
  {
    "id": "priorites",
    "group": "b",
    "label": {
      "fr": "savoir par où commencer",
      "en": "to know where to start"
    },
    "result": {
      "fr": "Un état des lieux, puis un plan par priorité.",
      "en": "An assessment, then a plan by priority."
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
      "fr": "des développeurs plus rapides",
      "en": "faster developers"
    },
    "result": {
      "fr": "Un cadre pour coder avec l'IA sans casser la production.",
      "en": "A framework to code with AI without breaking production."
    },
    "path": [
      "Votre code",
      "Projet",
      "Code fiable"
    ]
  },
  {
    "id": "ia-interne",
    "group": "b",
    "label": {
      "fr": "une IA qui reste chez nous",
      "en": "AI that stays in-house"
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
      "fr": "tester une idée",
      "en": "to test an idea"
    },
    "result": {
      "fr": "Un prototype qui tourne, pour décider sur pièce.",
      "en": "A working prototype, to decide on evidence."
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
        "fr": "Agents autonomes",
        "en": "Autonomous agents"
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
        "fr": "Code fiable",
        "en": "Reliable code"
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
 {id: 't', label: {fr: 'Gagner du temps', en: 'Save time'}, title: {fr: 'Libérer du temps.', en: 'Save time.'}},
 {id: 'b', label: {fr: 'Construire', en: 'Build'}, title: {fr: 'Construire vos outils.', en: 'Build your tools.'}},
] as const;
