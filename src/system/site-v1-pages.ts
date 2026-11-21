import type { Locale } from "./locale";

export type GuideCopy = {
  name: string;
  title: string;
  description: string;
  cases: { title: string; intro: string; items: readonly string[] };
  steps: { title: string; items: readonly (readonly [string, string])[] };
  deliverables: { title: string; items: readonly string[]; note: readonly [string, string] };
  rules: { title: string; paragraphs: readonly string[] };
  faq: readonly (readonly [string, string])[];
};
export const SITE_V1_PAGES = {
  "consulting-transformation": {
    "fr": {
      "name": "Conseil & Transformation",
      "title": "Choisir quoi automatiser",
      "description": "Avant de choisir un outil, nous regardons avec vos équipes le travail qu’elles font réellement. Vous recevez la liste des tâches examinées et les raisons de commencer par certaines.",
      "cases": {
        "title": "Chaque tâche demande des gestes différents.",
        "intro": "Préparer une réponse à un client, traiter une facture fournisseur ou réunir les chiffres d’un rapport financier ne demande pas le même travail. Nous examinons ces tâches avec les personnes qui les réalisent, pour déterminer où un outil peut être utile.",
        "items": [
          "Vous n’avez pas encore choisi d’outil et une tâche vous pose problème.",
          "Plusieurs services demandent un outil et vous devez décider par lequel commencer."
        ]
      },
      "steps": {
        "title": "Nous observons le travail, nous comparons les tâches, puis nous définissons la première à améliorer.",
        "items": [
          [
            "L’observation",
            "Vos équipes nous montrent comment elles travaillent. Nous suivons une tâche dans l’ordre, avec ses fichiers, ses échanges et ses vérifications."
          ],
          [
            "Le tri",
            "Cette observation fait apparaître ce qui se répète et ce qui demande un jugement humain."
          ],
          [
            "La comparaison",
            "Nous comparons les améliorations possibles, les difficultés de construction et les risques pour votre activité."
          ],
          [
            "La première tâche",
            "Nous précisons le résultat attendu, les données nécessaires et la manière de le vérifier. Si vous décidez de construire, les personnes concernées essaient l’outil et participent à sa prise en main."
          ]
        ]
      },
      "deliverables": {
        "title": "Vous recevez un ordre de travail expliqué.",
        "items": [
          "Les tâches examinées et les raisons de commencer par certaines.",
          "Les outils concernés.",
          "La participation attendue de vos équipes.",
          "Les vérifications nécessaires pour mesurer ce qui change."
        ],
        "note": [
          "Si le travail se poursuit par une construction",
          "Le contrat précise les droits sur l’outil, son hébergement et sa maintenance. Il fixe aussi les conditions de reprise du système et de récupération de vos données."
        ]
      },
      "rules": {
        "title": "Vous choisissez qui accède aux données et qui valide les actions.",
        "paragraphs": [
          "Vous désignez les personnes qui accèdent aux données et celles qui valident les actions. Nous écrivons ces règles avant de construire un outil, pour que chacun sache ce qu’il peut consulter et ce qui demande un accord."
        ]
      },
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
      "description": "Before choosing a tool, we look with your teams at the work they actually do. You receive the list of tasks examined and the reasons for starting with some of them.",
      "cases": {
        "title": "Each task calls for different steps.",
        "intro": "Preparing a reply to a customer, processing a supplier invoice and gathering the figures for a financial report are not the same work. We examine these tasks with the people who do them, to determine where a tool can help.",
        "items": [
          "You have not chosen a tool yet and one task is causing you trouble.",
          "Several departments are asking for a tool and you have to decide where to start."
        ]
      },
      "steps": {
        "title": "We observe the work, compare the tasks, then define the first one to improve.",
        "items": [
          [
            "Observation",
            "Your teams show us how they work. We follow one task in order, with its files, its exchanges and its checks."
          ],
          [
            "Sorting",
            "This observation shows what repeats in the task and what needs human judgement."
          ],
          [
            "Comparison",
            "We compare the possible improvements, how hard each would be to build and the risks for your business."
          ],
          [
            "The first task",
            "We specify the expected result, the data needed and how to check it. If you decide to build, the people concerned try the tool and take part in learning to use it."
          ]
        ]
      },
      "deliverables": {
        "title": "You receive an order of work, with the reasons.",
        "items": [
          "The tasks examined and the reasons for starting with some of them.",
          "The tools involved.",
          "What is expected from your teams.",
          "The checks needed to measure what changes."
        ],
        "note": [
          "If the work continues with construction",
          "The contract specifies the rights to the tool, its hosting and its maintenance. It also sets the conditions for taking over the system and recovering your data."
        ]
      },
      "rules": {
        "title": "You choose who has access to the data and who approves the actions.",
        "paragraphs": [
          "You name the people who have access to the data and those who approve the actions. We write these rules before building a tool, so that everyone knows what they may read and what needs approval."
        ]
      },
      "faq": [
        [
          "Do you need to have chosen a tool already?",
          "You can come with a task that is causing you trouble. We examine how you work before recommending a tool."
        ],
        [
          "What does this work require from your teams?",
          "The people concerned show us their tasks and the documents they use. If a tool is built, they try it and say what they need to use it every day."
        ]
      ]
    }
  },
  "ai-sprints": {
    "fr": {
      "name": "AI Sprints",
      "title": "Tester votre futur outil",
      "description": "Avant d’équiper toute une équipe, vous essayez une première version de l’outil sur une tâche réelle. Les résultats des tests vous servent à décider de la suite.",
      "cases": {
        "title": "Un essai est utile quand la tâche est précise et que son résultat se vérifie.",
        "intro": "Vous avez une tâche qui revient souvent et dont vous savez reconnaître un bon résultat. L’essai porte sur cette tâche, avec vos propres fichiers.",
        "items": [
          "Préparer une réponse à un client en lisant son dossier.",
          "Produire un rapport financier à partir de vos fichiers.",
          "Saisir des commandes reçues par courriel, qu’une personne relit ensuite."
        ]
      },
      "steps": {
        "title": "Le travail se fait en quatre étapes, avec les personnes qui réalisent la tâche.",
        "items": [
          [
            "Le résultat attendu",
            "Vous nous montrez la tâche et un résultat que vous jugez correct. Nous écrivons ce que l’outil doit produire. Pour un rapport financier, nous précisons les chiffres à retrouver et les documents auxquels les comparer."
          ],
          [
            "Une première version",
            "Nous construisons un outil qui travaille sur les fichiers et les situations retenus avec vous. Vous examinez ce qu’il produit et vous signalez ce qui manque."
          ],
          [
            "Les tests",
            "Les personnes qui réalisent la tâche essaient l’outil. Nous comparons leurs résultats aux exigences écrites au départ et nous consignons les écarts."
          ],
          [
            "La décision",
            "Nous vous présentons ce qui fonctionne, les erreurs restantes et le travail nécessaire avant une mise en service. Vous décidez de mettre l’outil en service, de le corriger ou d’arrêter."
          ]
        ]
      },
      "deliverables": {
        "title": "Vous recevez l’outil testé et le compte rendu des vérifications.",
        "items": [
          "La première version de l’outil, essayée par vos équipes.",
          "Les résultats attendus, écrits avant la construction.",
          "La liste des cas essayés, avec les écarts constatés.",
          "La décision prise avec vous et les étapes suivantes, s’il y en a."
        ],
        "note": [
          "Ce que l’essai ne prouve pas",
          "Cette première version vérifie le fonctionnement sur les cas retenus. Elle ne suffit pas à autoriser tous les usages dans votre entreprise. L’étendre à toutes vos équipes demande une décision et une préparation supplémentaires."
        ]
      },
      "rules": {
        "title": "Le périmètre et le calendrier sont écrits avant de construire.",
        "paragraphs": [
          "Nous définissons avec vous la tâche, les fichiers utilisés et le calendrier. Celui-ci dépend de la tâche et des données disponibles.",
          "Vous désignez les personnes qui essaient l’outil et celles qui valident le résultat."
        ]
      },
      "faq": [
        [
          "Que devez-vous préparer ?",
          "Réunissez un exemple de la tâche, les fichiers nécessaires et un résultat que vous jugez correct. Prévoyez la participation des personnes qui utiliseront l’outil, pour qu’elles puissent l’essayer."
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
      "description": "Before equipping a whole team, you try a first version of the tool on a real task. You decide what comes next from the test results.",
      "cases": {
        "title": "A trial is useful when the task is specific and its result can be checked.",
        "intro": "You have a task that comes up often, and you can tell a good result from a poor one. The trial covers that task, with your own files.",
        "items": [
          "Preparing a reply to a customer from their file.",
          "Producing a financial report from your files.",
          "Entering orders received by email, which someone then reviews."
        ]
      },
      "steps": {
        "title": "The work takes four steps, with the people who do the task.",
        "items": [
          [
            "The expected result",
            "You show us the task and a result you consider correct. We write down what the tool must produce. For a financial report, we specify the figures to find and the documents to compare them with."
          ],
          [
            "A first version",
            "We build a tool that works on the files and situations agreed with you. You examine what it produces and tell us what is missing."
          ],
          [
            "The tests",
            "The people who do the task try the tool. We compare their results with the requirements written at the start and record the gaps."
          ],
          [
            "The decision",
            "We show you what works, the remaining errors and the work needed before the tool goes into service. You decide to put it into service, correct it or stop."
          ]
        ]
      },
      "deliverables": {
        "title": "You receive the tested tool and the record of the checks.",
        "items": [
          "The first version of the tool, tried by your teams.",
          "The expected results, written before construction.",
          "The list of cases tried, with the gaps found.",
          "The decision made with you and the next steps, if any."
        ],
        "note": [
          "What the trial does not prove",
          "This first version checks that the tool works on the agreed cases. It is not enough to authorise every use in your company. Extending it to all your teams requires a further decision and further preparation."
        ]
      },
      "rules": {
        "title": "The scope and the schedule are written before we build.",
        "paragraphs": [
          "We define the task, the files used and the schedule with you. The schedule depends on the task and the data available.",
          "You name the people who try the tool and those who approve the result."
        ]
      },
      "faq": [
        [
          "What should you prepare?",
          "Gather an example of the task, the files it needs and a result you consider correct. Plan for the people who will use the tool to take part, so they can try it."
        ],
        [
          "When can the tool go into service?",
          "You make that decision after the tests. Beforehand, we specify the corrections, access and approvals its use requires."
        ]
      ]
    }
  },
  "engineering-integration": {
    "fr": {
      "name": "Engineering & Intégration",
      "title": "Relier vos logiciels",
      "description": "Quand une même information est saisie dans plusieurs logiciels, nous relions les outils que vous utilisez déjà. Si aucun ne couvre le besoin, nous construisons la fonction qui manque.",
      "cases": {
        "title": "Nous gardons vos logiciels et nous ajoutons ce qui manque.",
        "intro": "Le travail commence par les logiciels que vous utilisez déjà. Trois cas se présentent.",
        "items": [
          "Transmettre une information d’un logiciel à un autre, avec les vérifications nécessaires.",
          "Construire un outil sur mesure quand vos logiciels ne couvrent pas le besoin, par exemple pour préparer un rapport financier à partir de vos fichiers.",
          "Remplacer un fonctionnement existant, après avoir comparé les résultats et préparé le retour en arrière."
        ]
      },
      "steps": {
        "title": "Nous vérifions le parcours de chaque information avant de remplacer un fonctionnement.",
        "items": [
          [
            "Le périmètre",
            "Vous nous montrez vos fichiers et le résultat attendu. Nous écrivons le périmètre, les validations nécessaires et les tests avant de construire."
          ],
          [
            "Le parcours des données",
            "Nous identifions les logiciels à relier et les personnes autorisées à consulter les données. Nous définissons où ces données circulent et où elles sont conservées."
          ],
          [
            "La construction",
            "Nous relions vos logiciels ou nous construisons l’outil manquant. Vous l’essayez sur vos propres tâches."
          ],
          [
            "La comparaison",
            "Nous contrôlons ce que chaque logiciel reçoit et ce qu’il transmet. Avant de remplacer un fonctionnement existant, nous comparons les résultats et nous préparons le retour en arrière."
          ]
        ]
      },
      "deliverables": {
        "title": "Vous recevez les logiciels reliés, les tests et la description du parcours des données.",
        "items": [
          "Les logiciels reliés ou l’outil construit, essayés sur vos tâches.",
          "Les résultats des tests et de la comparaison avec l’ancien fonctionnement.",
          "La description du parcours des données, avec les logiciels qui les reçoivent et les personnes qui peuvent les consulter."
        ],
        "note": [
          "Ce que fixe le contrat",
          "Le contrat fixe les droits sur le travail livré, l’hébergement et la maintenance. Il précise aussi les conditions de transfert du système et de récupération de vos données."
        ]
      },
      "rules": {
        "title": "Vous gardez la main sur les actions de l’assistant.",
        "paragraphs": [
          "Lorsqu’un assistant intervient, nous précisons les fichiers qu’il peut consulter et les actions qu’il peut exécuter. Les actions qui engagent votre entreprise suivent les validations définies avec vous."
        ]
      },
      "faq": [
        [
          "Faut-il remplacer vos logiciels ?",
          "Nous conservons ceux qui répondent au besoin. Nous examinons d’abord les possibilités de les relier ou de leur ajouter la fonction manquante."
        ],
        [
          "Qui valide les actions ?",
          "Vous désignez les personnes responsables. Nous définissons avec elles les actions qui demandent un accord avant leur exécution."
        ],
        [
          "Où les données sont-elles hébergées ?",
          "Le choix de l’hébergement dépend des logiciels à relier, des personnes autorisées à consulter les données et des engagements écrits dans le contrat."
        ]
      ]
    },
    "en": {
      "name": "Engineering & Integration",
      "title": "Connect your software",
      "description": "When the same information is typed into several pieces of software, we connect the tools you already use. If none of them covers the need, we build the missing function.",
      "cases": {
        "title": "We keep your software and add what is missing.",
        "intro": "The work starts with the software you already use. There are three cases.",
        "items": [
          "Passing information from one piece of software to another, with the necessary checks.",
          "Building a custom tool when your software does not cover the need, for example to prepare a financial report from your files.",
          "Replacing an existing process, after comparing the results and preparing the way back."
        ]
      },
      "steps": {
        "title": "We check the path of each piece of information before replacing a process.",
        "items": [
          [
            "The scope",
            "You show us your files and the expected result. We write the scope, the approvals needed and the tests before we build."
          ],
          [
            "The path of the data",
            "We identify the software to connect and the people allowed to read the data. We define where that data travels and where it is kept."
          ],
          [
            "Construction",
            "We connect your software or build the missing tool. You try it on your own tasks."
          ],
          [
            "The comparison",
            "We check what each piece of software receives and what it passes on. Before replacing an existing process, we compare the results and prepare the way back."
          ]
        ]
      },
      "deliverables": {
        "title": "You receive the connected software, the tests and the description of the data path.",
        "items": [
          "The connected software or the tool we built, tried on your tasks.",
          "The results of the tests and of the comparison with the previous process.",
          "The description of the data path, with the software that receives the data and the people who may read it."
        ],
        "note": [
          "What the contract sets",
          "The contract sets the rights to the delivered work, hosting and maintenance. It also specifies the conditions for transferring the system and recovering your data."
        ]
      },
      "rules": {
        "title": "You stay in control of the assistant’s actions.",
        "paragraphs": [
          "When an assistant is involved, we specify the files it may read and the actions it may carry out. Actions that commit your company follow the approvals defined with you."
        ]
      },
      "faq": [
        [
          "Do you need to replace your software?",
          "We keep the software that meets the need. We first examine whether it can be connected or given the missing function."
        ],
        [
          "Who approves the actions?",
          "You name the people responsible. With them, we define the actions that need approval before they are carried out."
        ],
        [
          "Where is the data hosted?",
          "The choice of hosting depends on the software to connect, the people allowed to read the data and the commitments written in the contract."
        ]
      ]
    }
  },
  "harness-engineering": {
    "fr": {
      "name": "Harness Engineering",
      "title": "Contrôler vos assistants IA",
      "description": "Avant de laisser un assistant modifier un fichier ou envoyer un message, vous devez pouvoir vérifier son travail. Nous écrivons avec vous ce qu’il peut faire, ce qui lui est interdit et à quel moment il doit demander un accord.",
      "cases": {
        "title": "Ce travail concerne les assistants qui agissent sur vos fichiers et vos messages.",
        "intro": "Un assistant qui modifie un fichier, envoie un message ou lance une commande engage votre entreprise. Nous intervenons dans deux situations.",
        "items": [
          "Vous préparez un assistant. Nous écrivons les contrôles avant de le relier à vos outils.",
          "Votre assistant est déjà en service et commet des erreurs. Nous reproduisons le problème, puis nous vérifions les corrections sur les mêmes tâches."
        ]
      },
      "steps": {
        "title": "Nous écrivons les règles, nous installons les contrôles, puis nous les testons.",
        "items": [
          [
            "Les accès",
            "Nous précisons les informations que l’assistant peut consulter, ce qu’il peut conserver et les outils qu’il peut utiliser."
          ],
          [
            "Les validations",
            "Pour chaque tâche, nous déterminons qui relit le travail et qui autorise l’action. Vous gardez la décision sur ce qui engage votre entreprise."
          ],
          [
            "Les contrôles",
            "Nous installons des contrôles avant les actions sensibles. Ils bloquent ce qui est interdit, et une trace conserve ce que l’assistant a exécuté."
          ],
          [
            "Les tests",
            "Nous écrivons d’abord ce qui doit réussir et ce qui doit être bloqué. Les résultats indiquent les erreurs corrigées et celles qui restent à traiter."
          ]
        ]
      },
      "deliverables": {
        "title": "Vous disposez de règles écrites et de contrôles que vous pouvez vérifier.",
        "items": [
          "Le diagnostic des erreurs constatées.",
          "Les corrections réalisées et les résultats des tests, avant et après.",
          "Un guide qui précise les accès autorisés, les validations attendues et la marche à suivre en cas de problème.",
          "Le suivi des dépenses d’utilisation de l’assistant."
        ],
        "note": [
          "Ce que les tests ne couvrent pas",
          "Les tests portent sur les situations examinées. Un assistant peut encore échouer sur une situation nouvelle. Nous indiquons les cas testés et ceux qui restent à vérifier avant d’élargir son utilisation."
        ]
      },
      "rules": {
        "title": "Une personne valide les actions qui engagent votre entreprise.",
        "paragraphs": [
          "Prenons une réponse à un client. Nous déterminons les documents que l’assistant peut lire, la personne qui relit la réponse et celle qui autorise son envoi.",
          "Nous précisons de la même façon à quel moment l’assistant doit s’arrêter pour demander un accord. Ces règles sont écrites avant de le relier à vos outils."
        ]
      },
      "faq": [
        [
          "Qui décide de ce que l’assistant peut faire ?",
          "Vous. Nous écrivons avec vous ses accès, les actions autorisées et les situations dans lesquelles il doit demander confirmation."
        ],
        [
          "Par où commencer si l’assistant est déjà en service ?",
          "Vous nous montrez les tâches qui échouent ou les actions qui vous inquiètent. Nous cherchons à reproduire le problème, puis nous vérifions les corrections sur ces mêmes tâches."
        ]
      ]
    },
    "en": {
      "name": "Harness Engineering",
      "title": "Control your AI assistants",
      "description": "Before you let an assistant change a file or send a message, you need to be able to check its work. We write down with you what it may do, what it may not, and when it must ask for approval.",
      "cases": {
        "title": "This work is for assistants that act on your files and messages.",
        "intro": "An assistant that changes a file, sends a message or runs a command commits your company. We step in in two situations.",
        "items": [
          "You are preparing an assistant. We write the controls before connecting it to your tools.",
          "Your assistant is already in service and makes mistakes. We reproduce the problem, then check the corrections on the same tasks."
        ]
      },
      "steps": {
        "title": "We write the rules, install the controls, then test them.",
        "items": [
          [
            "Access",
            "We specify the information the assistant may read, what it may keep and the tools it may use."
          ],
          [
            "Approvals",
            "For each task, we determine who reviews the work and who authorises the action. You keep the decision on anything that commits your company."
          ],
          [
            "Controls",
            "We install controls before sensitive actions. They block what is forbidden, and a log keeps what the assistant executed."
          ],
          [
            "Tests",
            "We first write down what must succeed and what must be blocked. The results show which errors are corrected and which remain."
          ]
        ]
      },
      "deliverables": {
        "title": "You have written rules and controls you can check.",
        "items": [
          "The diagnosis of the errors found.",
          "The corrections made and the test results, before and after.",
          "A guide that sets out permitted access, expected approvals and what to do when a problem occurs.",
          "Tracking of what the assistant costs to run."
        ],
        "note": [
          "What the tests do not cover",
          "The tests cover the situations examined. An assistant can still fail on a new situation. We list the cases tested and those still to be checked before its use is extended."
        ]
      },
      "rules": {
        "title": "A person approves the actions that commit your company.",
        "paragraphs": [
          "Take a reply to a customer. We determine the documents the assistant may read, the person who reviews the reply and the person who authorises sending it.",
          "In the same way, we specify when the assistant must stop and ask for approval. These rules are written before it is connected to your tools."
        ]
      },
      "faq": [
        [
          "Who decides what the assistant may do?",
          "You do. We write down with you its access, the permitted actions and the situations in which it must ask for confirmation."
        ],
        [
          "Where do we start if the assistant is already in service?",
          "You show us the tasks that fail or the actions that worry you. We try to reproduce the problem, then check the corrections on those same tasks."
        ]
      ]
    }
  }
} as const satisfies Record<string, Record<Locale, GuideCopy>>;
export type SiteV1PageId = keyof typeof SITE_V1_PAGES;
