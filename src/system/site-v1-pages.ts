import type { Locale } from "./locale";

export type GuideCopy = { name: string; title: string; description: string; briefTitle?: string; brief?: readonly (readonly [string, string])[]; markers?: readonly string[]; sections: readonly (readonly [string, string, readonly string[]])[]; faq: readonly (readonly [string, string])[] };
export const SITE_V1_PAGES = {
  "consulting-transformation": {
    "fr": {
      "name": "Conseil & Transformation",
      "title": "Choisir quoi automatiser",
      "description": "Vous partez du travail que vos équipes font réellement",
      "sections": [
        [
          "problems",
          "Vous partez du travail que vos équipes font réellement",
          [
            "Préparer une réponse client, traiter une facture fournisseur ou réunir les chiffres d’un rapport financier demande des gestes différents. Nous les examinons avec les personnes concernées pour déterminer où un outil peut être utile."
          ]
        ],
        [
          "work",
          "Nous comparons les tâches avant de choisir par où commencer",
          [
            "Nous regardons comment vos équipes travaillent, quels fichiers elles utilisent et ce qu’elles doivent vérifier. Nous comparons ensuite les améliorations possibles, les difficultés de construction et les risques pour votre activité."
          ]
        ],
        [
          "deliverables",
          "Vous recevez un ordre de travail expliqué",
          [
            "Le document décrit les tâches examinées et les raisons de commencer par certaines. Il précise les outils concernés, la participation attendue des équipes et les vérifications nécessaires pour mesurer ce qui change."
          ]
        ],
        [
          "method",
          "Vos équipes nous montrent comment elles travaillent",
          [
            "Nous suivons une tâche dans l’ordre, avec ses fichiers, ses échanges et ses vérifications. Cette observation permet de repérer ce qui se répète et ce qui demande un jugement humain."
          ]
        ],
        [
          "first-task",
          "Nous définissons une première tâche à améliorer",
          [
            "Nous précisons le résultat attendu, les données nécessaires et la manière de le vérifier. Si vous décidez de construire, les personnes concernées essaient l’outil et participent à sa prise en main."
          ]
        ],
        [
          "governance",
          "Accès et responsabilités",
          [
            "Vous choisissez qui accède aux données et qui valide les actions. Nous écrivons ces règles avant de construire l’outil.",
            "Si le travail se poursuit par une construction, le contrat précise les droits sur l’outil, son hébergement et sa maintenance. Il fixe aussi les conditions de reprise du système et de récupération de vos données."
          ]
        ]
      ],
      "faq": [
        [
          "Faut-il déjà avoir choisi un outil ?",
          "Vous pouvez venir avec une tâche qui vous pose problème. Nous examinons votre façon de travailler avant de recommander un outil."
        ],
        [
          "Que demande ce travail à vos équipes ?",
          "Les personnes concernées nous montrent leurs tâches et les documents qu’elles utilisent. Si un outil est construit, elles l’essaient et précisent ce dont elles ont besoin pour l’utiliser au quotidien."
        ]
      ]
    },
    "en": {
      "name": "Consulting & Transformation",
      "title": "Choose what to automate",
      "description": "You start from the work your teams actually do",
      "sections": [
        [
          "problems",
          "You start from the work your teams actually do",
          [
            "Preparing a customer reply, processing a supplier invoice or gathering the figures for a financial report all involve different steps. We examine them with the people concerned to determine where a tool may help."
          ]
        ],
        [
          "work",
          "We compare tasks before choosing where to start",
          [
            "We look at how your teams work, which files they use and what they need to check. We then compare possible improvements, the difficulty of building them and the risks to your operations."
          ]
        ],
        [
          "deliverables",
          "You receive an explained order of work",
          [
            "The document describes the tasks examined and why some should come first. It specifies the tools involved, the participation expected from teams and the checks needed to measure what changes."
          ]
        ],
        [
          "method",
          "Your teams show us how they work",
          [
            "We follow a task in order, including its files, exchanges and checks. This observation shows what is repeated and what requires human judgment."
          ]
        ],
        [
          "first-task",
          "We define a first task to improve",
          [
            "We specify the expected result, the data needed and how to check it. If you decide to build, the people concerned try the tool and take part in learning how to use it."
          ]
        ],
        [
          "governance",
          "Access and responsibilities",
          [
            "You choose who can access the data and who approves actions. We write these rules before building the tool.",
            "If the work continues with a build, the contract specifies the rights to the tool, its hosting and its maintenance. It also sets the conditions for taking over the system and recovering your data."
          ]
        ]
      ],
      "faq": [
        [
          "Do we need to have chosen a tool?",
          "You can come with a task that causes a problem. We examine how you work before recommending a tool."
        ],
        [
          "What does this work require from your teams?",
          "The people concerned show us their tasks and the documents they use. If a tool is built, they try it and explain what they need to use it in their daily work."
        ]
      ]
    }
  },
  "ai-sprints": {
    "fr": {
      "name": "AI Sprints",
      "title": "Tester votre futur outil",
      "description": "Vous essayez l’outil sur une tâche réelle avant de décider de la suite",
      "briefTitle": "Le travail commence par vos fichiers et un résultat attendu",
      "brief": [
        [
          "",
          "Vous avez une tâche précise à traiter, comme préparer une réponse client ou produire un rapport financier à partir de vos fichiers."
        ],
        [
          "",
          "Vous apportez des exemples de la tâche, les données accessibles et ce que vous attendez du résultat."
        ],
        [
          "",
          "Vous essayez une première version de l’outil. Vous recevez les résultats des tests et la liste des erreurs ou des besoins encore non couverts."
        ],
        [
          "",
          "Cette première version sert à vérifier le fonctionnement sur les cas retenus. Son utilisation par toutes vos équipes demande une décision et une préparation supplémentaires."
        ],
        [
          "",
          "Les personnes qui réalisent la tâche essaient l’outil. Nous comparons leurs résultats aux exigences définies avec vous avant la construction."
        ],
        [
          "",
          "Vous disposez des résultats pour décider de mettre l’outil en service, de le corriger ou d’arrêter le travail."
        ]
      ],
      "sections": [
        [
          "scoping",
          "Nous écrivons ce que l’outil doit produire",
          [
            "Vous nous montrez la tâche et un résultat acceptable. Pour un rapport financier, nous précisons notamment les chiffres à retrouver et les documents auxquels les comparer."
          ]
        ],
        [
          "construction",
          "Nous construisons une version que vous pouvez essayer",
          [
            "L’outil travaille sur les fichiers et les situations retenus avec vous. Vous pouvez examiner ce qu’il produit et signaler ce qui manque."
          ]
        ],
        [
          "evaluation",
          "Nous vérifions le résultat avec les personnes concernées",
          [
            "Nous contrôlons les réponses ou les calculs attendus et consignons les écarts."
          ]
        ],
        [
          "decision",
          "Vous décidez de la suite à partir des tests",
          [
            "Nous vous présentons ce qui fonctionne, les erreurs restantes et le travail nécessaire avant une mise en service."
          ]
        ],
        [
          "deliverables",
          "Vous recevez l’outil testé et le compte rendu des vérifications",
          [
            "Les documents précisent les résultats attendus, les cas essayés et les écarts constatés. Ils consignent aussi la décision prise avec vous et les éventuelles étapes suivantes."
          ]
        ],
        [
          "limits",
          "Le calendrier dépend de la tâche et des données disponibles",
          [
            "Nous définissons le périmètre et le calendrier avec vous avant de construire. Les tests de cette première version ne suffisent pas à autoriser tous les usages dans votre entreprise."
          ]
        ]
      ],
      "faq": [
        [
          "Que devez-vous préparer ?",
          "Réunissez un exemple de la tâche, les fichiers nécessaires et un résultat que vous jugez correct. Prévoyez la participation des personnes qui utiliseront l’outil pour qu’elles puissent l’essayer."
        ],
        [
          "Quand l’outil peut-il être mis en service ?",
          "Vous prenez cette décision après les tests. Nous précisons auparavant les corrections, les accès et les validations nécessaires à son utilisation."
        ]
      ]
    },
    "en": {
      "name": "AI Sprints",
      "title": "Test your future tool",
      "description": "You try the tool on a real task before deciding what comes next",
      "briefTitle": "The work starts with your files and an expected result",
      "brief": [
        [
          "",
          "You have a specific task to handle, such as preparing a customer reply or producing a financial report from your files."
        ],
        [
          "",
          "You bring examples of the task, the available data and what you expect from the result."
        ],
        [
          "",
          "You try a first version of the tool. You receive the test results and a list of errors or needs that are not yet covered."
        ],
        [
          "",
          "This first version checks how the tool works on the selected cases. Using it across all your teams requires a further decision and preparation."
        ],
        [
          "",
          "The people who carry out the task try the tool. We compare their results with the requirements defined with you before construction."
        ],
        [
          "",
          "You have the results needed to decide whether to put the tool into service, correct it or stop the work."
        ]
      ],
      "sections": [
        [
          "scoping",
          "We write down what the tool must produce",
          [
            "You show us the task and an acceptable result. For a financial report, we specify which figures must be found and which documents they should be checked against."
          ]
        ],
        [
          "construction",
          "We build a version you can try",
          [
            "The tool works on the files and situations selected with you. You can examine what it produces and point out what is missing."
          ]
        ],
        [
          "evaluation",
          "We check the result with the people concerned",
          [
            "We check the expected replies or calculations and record the gaps."
          ]
        ],
        [
          "decision",
          "You decide what comes next from the test results",
          [
            "We present what works, the remaining errors and the work needed before the tool can be put into service."
          ]
        ],
        [
          "deliverables",
          "You receive the tested tool and the verification report",
          [
            "The documents specify the expected results, the cases tried and the gaps found. They also record the decision made with you and any next steps."
          ]
        ],
        [
          "limits",
          "The schedule depends on the task and the available data",
          [
            "We define the scope and schedule with you before building. Testing this first version is not enough to authorize every use across your company."
          ]
        ]
      ],
      "faq": [
        [
          "What do you need to prepare?",
          "Gather an example of the task, the necessary files and a result you consider correct. Plan for the people who will use the tool to take part so they can try it."
        ],
        [
          "When can the tool be put into service?",
          "You make that decision after the tests. Beforehand, we specify the corrections, access and approvals needed to use it."
        ]
      ]
    }
  },
  "engineering-integration": {
    "fr": {
      "name": "Engineering & Intégration",
      "title": "Relier vos logiciels",
      "description": "Vos logiciels échangent les informations nécessaires au travail",
      "sections": [
        [
          "custom",
          "Vous essayez l’outil sur vos propres tâches",
          [
            "Vous nous montrez vos fichiers et le résultat attendu. Nous écrivons le périmètre, les validations nécessaires et les tests avant de construire. Le code, les données et la documentation vous appartiennent."
          ]
        ],
        [
          "integrations",
          "Nous définissons où vos données circulent et où elles sont conservées",
          [
            "Nous identifions les logiciels à relier et les personnes autorisées à consulter les données. Le choix de l’hébergement dépend de ces besoins et des engagements écrits dans le contrat."
          ]
        ],
        [
          "harness",
          "Vous gardez la main sur les actions de l’assistant",
          [
            "Lorsqu’un assistant intervient, nous précisons les fichiers qu’il peut consulter et les actions qu’il peut exécuter. Les actions qui engagent votre entreprise suivent les validations définies avec vous."
          ]
        ],
        [
          "governance",
          "Le contrat précise ce que vous recevez et comment reprendre la gestion du système",
          [
            "Il fixe les droits sur le travail livré, l’hébergement et la maintenance. Il précise aussi les conditions de transfert du système et de récupération de vos données."
          ]
        ]
      ],
      "faq": [
        [
          "Faut-il remplacer vos logiciels ?",
          "Nous conservons ceux qui répondent au besoin. Nous examinons d’abord les possibilités de les relier ou de leur ajouter la fonction manquante."
        ],
        [
          "Qui valide les actions ?",
          "Vous désignez les personnes responsables. Nous définissons avec elles les actions qui demandent un accord avant leur exécution."
        ]
      ]
    },
    "en": {
      "name": "Engineering & Integration",
      "title": "Connect your software",
      "description": "Your software exchanges the information needed for the work",
      "sections": [
        [
          "custom",
          "You try the tool on your own tasks",
          [
            "You show us your files and the expected result. We write down the scope, required approvals and tests before building. The code, data and documentation belong to you."
          ]
        ],
        [
          "integrations",
          "We define where your data flows and where it is stored",
          [
            "We identify the software to connect and the people authorized to view the data. The hosting choice depends on these needs and on the commitments written into the contract."
          ]
        ],
        [
          "harness",
          "You keep control of the assistant’s actions",
          [
            "When an assistant is involved, we specify which files it can view and which actions it can perform. Actions that commit your company follow the approvals defined with you."
          ]
        ],
        [
          "governance",
          "The contract specifies what you receive and how to take over the system",
          [
            "It sets the rights to the delivered work, hosting and maintenance. It also specifies the conditions for transferring the system and recovering your data."
          ]
        ]
      ],
      "faq": [
        [
          "Do you need to replace your software?",
          "We keep the software that meets the need. We first examine whether it can be connected or given the missing function."
        ],
        [
          "Who approves actions?",
          "You appoint the people responsible. We define with them which actions require approval before they are carried out."
        ]
      ]
    }
  },
  "harness-engineering": {
    "fr": {
      "name": "Harness Engineering",
      "title": "Contrôler vos assistants IA",
      "description": "Vous décidez de ce que votre assistant peut faire",
      "sections": [
        [
          "problem",
          "Vous décidez de ce que votre assistant peut faire",
          [
            "Avant de laisser un assistant modifier un fichier ou envoyer un message, vous devez pouvoir vérifier son travail. Nous définissons ses accès, les actions autorisées et les situations dans lesquelles il doit vous demander confirmation."
          ]
        ],
        [
          "harness",
          "Nous encadrons chaque action",
          [
            "Nous précisons les informations que l’assistant peut consulter et les outils qu’il peut utiliser. Nous installons des contrôles avant les actions sensibles et conservons une trace de ce qu’il exécute."
          ]
        ],
        [
          "interventions",
          "Nous préparons les contrôles avant de connecter vos outils",
          [
            "Vous choisissez une tâche, comme préparer une réponse client. Nous déterminons les documents nécessaires, qui relit la réponse et qui autorise son envoi."
          ]
        ],
        [
          "existing",
          "Nous reprenons les erreurs de votre assistant",
          [
            "Vous nous montrez les tâches qui échouent ou les actions qui vous inquiètent. Nous cherchons à reproduire le problème, puis nous vérifions les corrections sur ces mêmes tâches."
          ]
        ],
        [
          "evaluation",
          "Nous comparons les résultats avant et après les corrections",
          [
            "Nous écrivons d’abord ce qui doit réussir et ce qui doit être bloqué. Les résultats des tests indiquent les erreurs corrigées et celles qui restent à traiter.",
            "Vous gardez la décision sur les actions qui engagent votre entreprise. Nous précisons qui valide ces actions et à quel moment l’assistant doit s’arrêter pour demander un accord."
          ]
        ],
        [
          "deliverables",
          "Vous disposez de règles et de contrôles vérifiables",
          [
            "Selon le travail convenu, nous vous remettons le diagnostic des erreurs, les corrections réalisées et les résultats des tests. Un guide précise les accès autorisés, les validations attendues et la marche à suivre en cas de problème."
          ]
        ],
        [
          "limits",
          "Les tests couvrent les situations examinées",
          [
            "Un assistant peut encore échouer sur une situation nouvelle. Nous indiquons les cas testés et ceux qui restent à vérifier avant d’élargir son utilisation."
          ]
        ]
      ],
      "markers": [
        "Vous définissez la tâche.",
        "L’assistant consulte les informations autorisées.",
        "Vous précisez ce qu’il peut conserver.",
        "Vous choisissez les outils accessibles.",
        "Les contrôles bloquent les actions interdites.",
        "Les tests vérifient les résultats.",
        "Une personne valide les actions qui l’exigent.",
        "Vous suivez les dépenses d’utilisation."
      ],
      "faq": []
    },
    "en": {
      "name": "Harness Engineering",
      "title": "Control your AI assistants",
      "description": "You decide what your assistant is allowed to do",
      "sections": [
        [
          "problem",
          "You decide what your assistant is allowed to do",
          [
            "Before an assistant modifies a file or sends a message, you need to be able to check its work. We define its access, the actions it is allowed to take and the situations in which it must ask you for confirmation."
          ]
        ],
        [
          "harness",
          "We control each action",
          [
            "We specify the information the assistant can view and the tools it can use. We install checks before sensitive actions and keep a record of what it does."
          ]
        ],
        [
          "interventions",
          "We prepare the checks before connecting your tools",
          [
            "You choose a task, such as preparing a customer reply. We determine which documents are needed, who reviews the reply and who authorizes it to be sent."
          ]
        ],
        [
          "existing",
          "We work from your assistant’s errors",
          [
            "You show us the tasks that fail or the actions that concern you. We try to reproduce the problem, then check the corrections on those same tasks."
          ]
        ],
        [
          "evaluation",
          "We compare results before and after the corrections",
          [
            "We first write down what must succeed and what must be blocked. The test results show which errors were corrected and which still need work.",
            "You keep the decision on actions that commit your company. We specify who approves these actions and when the assistant must stop to ask for approval."
          ]
        ],
        [
          "deliverables",
          "You have rules and checks that can be verified",
          [
            "Depending on the agreed work, we provide the error diagnosis, the corrections made and the test results. A guide specifies the permitted access, expected approvals and what to do if a problem occurs."
          ]
        ],
        [
          "limits",
          "The tests cover the situations examined",
          [
            "An assistant can still fail in a new situation. We state which cases were tested and which still need to be checked before its use is expanded."
          ]
        ]
      ],
      "markers": [
        "You define the task.",
        "The assistant views the information it is allowed to use.",
        "You specify what it can retain.",
        "You choose which tools it can access.",
        "Checks block forbidden actions.",
        "Tests verify the results.",
        "A person approves the actions that require it.",
        "You track usage costs."
      ],
      "faq": []
    }
  }
} as const satisfies Record<string, Record<Locale, GuideCopy>>;
export type SiteV1PageId = keyof typeof SITE_V1_PAGES;
