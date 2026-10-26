import type { Locale } from "./locale";

export type GuideCopy = { name: string; title: string; description: string; brief?: readonly (readonly [string, string])[]; sections: readonly (readonly [string, string, readonly string[]])[]; faq: readonly (readonly [string, string])[] };
export const SITE_V1_PAGES = {
  "consulting-transformation": {
    "fr": {
      "name": "Conseil & Transformation",
      "title": "Comprendre, décider, transformer.",
      "description": "Partir de vos opérations pour décider des priorités, construire une feuille de route et préparer l'adoption.",
      "sections": [
        [
          "problems",
          "Les problèmes réels",
          [
            "Les tâches qui reviennent, les outils qui ne se parlent pas, les projets IA qui ne dépassent pas la démonstration."
          ]
        ],
        [
          "work",
          "Ce que nous faisons",
          [
            "Diagnostic des opérations et des outils, cartographie des opportunités, priorisation selon la valeur, le risque et la faisabilité.",
            "Architecture cible, gouvernance des données et conduite du changement."
          ]
        ],
        [
          "deliverables",
          "Les livrables",
          [
            "Un état des lieux, une matrice de priorisation, une feuille de route, un plan d'adoption et des indicateurs."
          ]
        ],
        [
          "method",
          "Notre méthode",
          [
            "Observer les tâches réelles, les outils et les données. Prioriser selon la valeur, le risque et la faisabilité.",
            "Transformer les processus et les systèmes, une brique à la fois. Mesurer ce qui a changé avec une méthode décidée au départ."
          ]
        ],
        [
          "governance",
          "Contraintes et gouvernance",
          [
            "Nous cadrons les accès aux données, les responsabilités et les validations humaines avant de construire.",
            "La propriété du code, l'hébergement, la réversibilité et la maintenance se décident pour chaque projet, par contrat."
          ]
        ]
      ],
      "faq": [
        [
          "Faut-il déjà avoir choisi un outil ?",
          "Nous partons du travail réel pour décider des outils utiles."
        ],
        [
          "Comment les équipes participent-elles ?",
          "Elles décrivent leurs tâches, testent le système et participent au plan d'adoption."
        ]
      ]
    },
    "en": {
      "name": "Consulting & Transformation",
      "title": "Understand, decide, transform.",
      "description": "Start from your operations to decide priorities, build a roadmap and prepare adoption.",
      "sections": [
        [
          "problems",
          "Real problems",
          [
            "Recurring tasks, tools that do not communicate, AI projects that never move beyond a demonstration."
          ]
        ],
        [
          "work",
          "What we do",
          [
            "Diagnose operations and tools, map opportunities and prioritize by value, risk and feasibility.",
            "Target architecture, data governance and change management."
          ]
        ],
        [
          "deliverables",
          "Deliverables",
          [
            "An assessment, a prioritization matrix, a roadmap, an adoption plan and indicators."
          ]
        ],
        [
          "method",
          "Our method",
          [
            "Observe real tasks, tools and data. Prioritize by value, risk and feasibility.",
            "Transform processes and systems, one building block at a time. Measure what has changed using a method agreed at the outset."
          ]
        ],
        [
          "governance",
          "Constraints and governance",
          [
            "We define data access, responsibilities and human approvals before building.",
            "Code ownership, hosting, reversibility and maintenance are agreed for each project, by contract."
          ]
        ]
      ],
      "faq": [
        [
          "Do we need to have chosen a tool?",
          "We start from the actual work to decide which tools are useful."
        ],
        [
          "How do teams participate?",
          "They describe their tasks, test the system and take part in the adoption plan."
        ]
      ]
    }
  },
  "ai-sprints": {
    "fr": {
      "name": "AI Sprints",
      "title": "Un problème précis, un système testable, une décision fondée sur des preuves.",
      "description": "Un cycle court sur un périmètre décidé ensemble, avec des critères écrits avant de construire et une décision documentée.",
      "brief": [
        [
          "Pour qui",
          "Les équipes qui veulent tester une réponse à un problème précis."
        ],
        [
          "Point de départ",
          "Un besoin, des données et un résultat attendu."
        ],
        [
          "Ce que vous obtenez",
          "Une brique testable et une évaluation documentée."
        ],
        [
          "Ce qui n'est pas livré",
          "Un système en production à grande échelle, une promesse de délai fixe."
        ],
        [
          "Comment on décide",
          "Avec vos utilisateurs, contre les critères du cadrage."
        ],
        [
          "Suite possible",
          "Passer en production, corriger ou arrêter, et pourquoi."
        ]
      ],
      "sections": [
        [
          "scoping",
          "Cadrage",
          [
            "Besoin, résultat attendu, données, critères de succès écrits avant de construire."
          ]
        ],
        [
          "construction",
          "Construction",
          [
            "Une brique qui tourne sur vos cas réels."
          ]
        ],
        [
          "evaluation",
          "Évaluation",
          [
            "Avec vos utilisateurs, contre les critères du cadrage."
          ]
        ],
        [
          "decision",
          "Décision",
          [
            "Passer en production, corriger ou arrêter, et pourquoi."
          ]
        ],
        [
          "deliverables",
          "Les livrables",
          [
            "Un démonstrateur, les critères d'évaluation, une synthèse des écarts, une décision et une suite."
          ]
        ],
        [
          "limits",
          "Les limites",
          [
            "La durée dépend du problème et se fixe au cadrage. Le sprint ne livre pas un système en production à grande échelle et ne promet pas de délai fixe."
          ]
        ]
      ],
      "faq": [
        [
          "Que faut-il préparer ?",
          "Le besoin, les cas à tester, les données accessibles et les personnes qui évalueront le résultat."
        ],
        [
          "Le passage en production est-il automatique ?",
          "Il dépend des résultats des tests et de la décision prise avec vous."
        ]
      ]
    },
    "en": {
      "name": "AI Sprints",
      "title": "A precise problem, a testable system, a decision based on evidence.",
      "description": "A short cycle with an agreed scope, criteria written before building and a documented decision.",
      "brief": [
        [
          "Who it is for",
          "Teams that want to test an answer to a precise problem."
        ],
        [
          "Starting point",
          "A need, data and an expected outcome."
        ],
        [
          "What you receive",
          "A testable building block and a documented evaluation."
        ],
        [
          "What is not delivered",
          "A system in production at scale, a promise of a fixed deadline."
        ],
        [
          "How we decide",
          "With your users, against the scoping criteria."
        ],
        [
          "Possible next step",
          "Move to production, correct or stop, and why."
        ]
      ],
      "sections": [
        [
          "scoping",
          "Scoping",
          [
            "Need, expected outcome, data and success criteria written before building."
          ]
        ],
        [
          "construction",
          "Construction",
          [
            "A system that runs on your real cases."
          ]
        ],
        [
          "evaluation",
          "Evaluation",
          [
            "With your users, against the scoping criteria."
          ]
        ],
        [
          "decision",
          "Decision",
          [
            "Move to production, correct or stop, and why."
          ]
        ],
        [
          "deliverables",
          "Deliverables",
          [
            "A demonstrator, evaluation criteria, a summary of gaps, a decision and next steps."
          ]
        ],
        [
          "limits",
          "Limits",
          [
            "Duration depends on the problem and is set during scoping. The sprint does not deliver a system in production at scale or promise a fixed deadline."
          ]
        ]
      ],
      "faq": [
        [
          "What should we prepare?",
          "The need, cases to test, accessible data and the people who will evaluate the outcome."
        ],
        [
          "Is production automatic?",
          "It depends on test results and the decision made with you."
        ]
      ]
    }
  },
  "engineering-integration": {
    "fr": {
      "name": "Engineering & Intégration",
      "title": "Concevoir, connecter, construire.",
      "description": "Intégrer ce qui existe, construire ce qui manque et orchestrer un système supervisé adapté à vos opérations.",
      "sections": [
        [
          "custom",
          "Logiciels & agents sur mesure",
          [
            "Un logiciel ou un agent sur mesure quand votre métier a un besoin qu'aucun outil ne couvre. Nous définissons les outils autorisés, les validations humaines et les tests avant de construire."
          ]
        ],
        [
          "integrations",
          "Intégrations & infrastructures privées",
          [
            "Vos outils actuels restent en place quand ils font le travail. Nous les relions entre eux et à vos données.",
            "Le choix de l'hébergement dépend des données, des accès et du contrat. Le nom d'un fournisseur ne suffit pas à établir la souveraineté d'une infrastructure."
          ]
        ],
        [
          "harness",
          "Harness Engineering",
          [
            "Le contexte, les permissions, les vérifications et la supervision rendent le système contrôlable."
          ]
        ],
        [
          "governance",
          "Contraintes et gouvernance",
          [
            "La propriété du code, l'hébergement, la réversibilité et la maintenance se décident pour chaque projet, par contrat."
          ]
        ]
      ],
      "faq": [
        [
          "Faut-il remplacer nos outils ?",
          "Nous conservons les outils qui répondent au besoin et construisons ce qui manque."
        ],
        [
          "Qui valide les actions ?",
          "Les responsabilités et les étapes de validation humaine sont définies au cadrage."
        ]
      ]
    },
    "en": {
      "name": "Engineering & Integration",
      "title": "Design, connect, build.",
      "description": "Integrate what exists, build what is missing and orchestrate a supervised system suited to your operations.",
      "sections": [
        [
          "custom",
          "Custom software & agents",
          [
            "Custom software or an agent when your business has a need that no tool covers. We define permitted tools, human approvals and tests before building."
          ]
        ],
        [
          "integrations",
          "Integrations & private infrastructure",
          [
            "Your current tools stay in place when they do the job. We connect them to each other and to your data.",
            "Hosting choices depend on data, access and the contract. A provider's name alone does not establish infrastructure sovereignty."
          ]
        ],
        [
          "harness",
          "Harness Engineering",
          [
            "Context, permissions, checks and supervision make the system controllable."
          ]
        ],
        [
          "governance",
          "Constraints and governance",
          [
            "Code ownership, hosting, reversibility and maintenance are agreed for each project, by contract."
          ]
        ]
      ],
      "faq": [
        [
          "Do we need to replace our tools?",
          "We keep tools that meet the need and build what is missing."
        ],
        [
          "Who approves actions?",
          "Responsibilities and human approval steps are defined during scoping."
        ]
      ]
    }
  },
  "harness-engineering": {
    "fr": {
      "name": "Harness Engineering",
      "title": "Le modèle ne suffit pas. Il faut un système fiable autour.",
      "description": "Concevoir ou corriger le système autour de vos agents : contexte, outils, permissions, vérifications et supervision.",
      "sections": [
        [
          "problem",
          "Performant en démonstration, fragile en production",
          [
            "Un agent peut réussir une démonstration et échouer sur vos opérations. Le harnais est le système qui organise ce qu'il sait, ce qu'il peut faire et ce qui doit être vérifié."
          ]
        ],
        [
          "harness",
          "Le système autour du modèle",
          [
            "Les instructions définissent le travail. Le contexte et la mémoire apportent les informations utiles. Les outils et les permissions bornent les actions. Les vérifications et la supervision contrôlent les décisions. Le suivi des coûts permet de surveiller l'exploitation."
          ]
        ],
        [
          "interventions",
          "Deux cas d'intervention",
          [
            "Construire un harnais neuf : partir des tâches, définir les accès et écrire les vérifications avant de brancher les outils.",
            "Auditer et corriger un système existant : reproduire ses échecs, prioriser les corrections et les tester sur les mêmes tâches."
          ]
        ],
        [
          "evaluation",
          "Protocole d'évaluation",
          [
            "Nous utilisons les mêmes tâches avant et après les corrections. Les critères sont écrits avant les tests et les résultats sont consignés, y compris les échecs.",
            "La supervision humaine reste définie pour les actions qui engagent l'entreprise."
          ]
        ],
        [
          "deliverables",
          "Les livrables",
          [
            "Un audit, une liste de corrections priorisée, un harnais refait, une suite de tests et un guide d'exploitation, selon le périmètre retenu."
          ]
        ],
        [
          "limits",
          "Les limites",
          [
            "Un test réussi ne prouve pas la fiabilité dans tous les contextes. Les cas non testés restent à évaluer. Aucune mesure de performance n'est publiée ici."
          ]
        ]
      ],
      "faq": []
    },
    "en": {
      "name": "Harness Engineering",
      "title": "The model is not enough. It needs a reliable system around it.",
      "description": "Design or correct the system around your agents: context, tools, permissions, checks and supervision.",
      "sections": [
        [
          "problem",
          "Strong in a demonstration, fragile in production",
          [
            "An agent can succeed in a demonstration and fail in your operations. The harness organizes what it knows, what it can do and what must be checked."
          ]
        ],
        [
          "harness",
          "The system around the model",
          [
            "Instructions define the work. Context and memory provide useful information. Tools and permissions bound actions. Checks and supervision control decisions. Cost tracking helps monitor operations."
          ]
        ],
        [
          "interventions",
          "Two types of intervention",
          [
            "Build a new harness: start from tasks, define access and write checks before connecting tools.",
            "Audit and correct an existing system: reproduce its failures, prioritize corrections and test them on the same tasks."
          ]
        ],
        [
          "evaluation",
          "Evaluation protocol",
          [
            "We use the same tasks before and after corrections. Criteria are written before testing and results are recorded, including failures.",
            "Human supervision remains defined for actions that commit the company."
          ]
        ],
        [
          "deliverables",
          "Deliverables",
          [
            "An audit, a prioritized correction list, a rebuilt harness, a test suite and an operations guide, depending on the agreed scope."
          ]
        ],
        [
          "limits",
          "Limits",
          [
            "A successful test does not prove reliability in every context. Untested cases still need evaluation. No performance measurements are published here."
          ]
        ]
      ],
      "faq": []
    }
  }
} as const satisfies Record<string, Record<Locale, GuideCopy>>;
export type SiteV1PageId = keyof typeof SITE_V1_PAGES;
