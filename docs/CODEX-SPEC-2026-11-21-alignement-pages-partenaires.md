# parrit.ai : alignement des pages, partenaires en avant, fin des titres sans texte

Niveau de risque : moyen (gabarit des pages thèmes, ordre des sections de l'accueil, menu, pied de page, textes).

## Demande de Paul (21/11/2026, dictée)

« Il y a des call to action qui vont pas, il y a des textes, des petits slop un peu partout. Il y a trop de "Vous échangez avec Paul Larmaraud". On dirait que je suis tout seul dans la boîte. Il faut vraiment mettre en avant les partenaires. Il faut aussi veiller à ce qu'il n'y ait plus de vides dans le texte. […] Quand on clique sur les liens en bas de la page, il y a des pages où il y a de grands titres, et il y a une phrase de texte, puis un autre grand titre. S'il y a plus de grands titres que de texte, c'est quoi, ce bordel ? […] Il faut que chaque page soit chiadée, travaillée et au standard Parrit.ai. »

Paul a demandé de regarder Craft AI, Galadrim et Palantir. Ce que nous en retenons, et rien d'autre :

- une page d'offre a quatre ou cinq sections, chacune avec un vrai contenu (étapes numérotées, liste de ce qu'on reçoit), jamais un titre suivi d'une seule phrase ;
- le même bouton, avec le même libellé, en haut et en bas de chaque page ;
- le menu suit l'ordre de la page, et chaque lien mène à la section qu'il nomme ;
- l'entreprise se présente par son réseau et par son travail, pas par une seule personne.

## Mesure avant (en ligne le 21/11/2026, à corriger)

| Page | Grands titres | Texte sous les titres | Défaut |
|---|---|---|---|
| `/fr/journal/themes/harness-engineering` | 13 | 22 blocs, 478 mots | un `h2` de 40 px puis une phrase, sept fois de suite |
| `/fr/journal/themes/ai-sprints` | 14 | 18 blocs, 457 mots | idem |
| `/fr/journal/themes/integration-developpement` | 14 | 12 blocs, 298 mots | idem, et une section « Journal » avec un seul article |
| `/fr/journal/themes/conseil-transformation` | 13 | 13 blocs, 383 mots | idem |
| `/fr` | « Chroniques parues dans Le Monde Informatique. » | aucun texte | titre sans contenu, et le bouton mène au Journal |
| `/fr` | « Ou demandez à votre assistant. » | quatre liens | titre sans contenu |
| `/fr`, menu | « Applications » et « Services » | | les deux mènent au calculateur |
| `/fr`, bloc contact | bouton « Prendre rendez-vous » | | il renvoie à `#contact`, c'est-à-dire à lui-même, alors que le calendrier est juste dessous |
| toutes | « Paul Larmaraud » | 5 fois sur l'accueil, 1 fois par page thème, 4 fois sur `/rendez-vous` | on croit lire une entreprise d'une seule personne |
| pages thèmes et articles | lien « Nous écrire » | | couleur bleue par défaut du navigateur |

## Règles de construction

- **Priorité.** Cette spec porte la décision de Paul du 21/11/2026 (soir). Elle prime sur les contrats antérieurs d'`AGENTS.md` pour les seuls points qu'elle change : ordre des sections de l'accueil, liens du menu, section des partenaires, sections « mesures » et « assistants », bloc contact, gabarit et textes des pages thèmes, bloc de rendez-vous, pied de page. Ajouter en tête d'`AGENTS.md` un paragraphe daté qui le dit et qui remplace les phrases citées du bloc contact et de l'introduction des partenaires. Tout le reste des contrats reste en vigueur : charte, géométrie (« un bloc = un écran » à 1440×800, 1280×720 et 390×700), contraste, stabilité, blocage réseau des tests, permissions des clients.
- Les textes « Après » sont appliqués **mot pour mot**. Chaque fichier garde sa convention d'apostrophe actuelle (`’` dans `site-v1-pages.ts` et `booking.ts`, `'` dans `home-layers.ts` et `single-page-copy.ts`).
- Les URL, les slugs et les identifiants d'ancre existants ne changent pas. Les anciennes ancres (`#en-production`, `#services`, `#mesures`, `#assistant`, `#technologies`, `#references`) restent atteignables.
- Aucun prix, aucun chiffre nouveau, aucun nom de partenaire ou de client ajouté.
- Le libellé du bouton reste « Prendre rendez-vous » / « Book a call » partout.
- Aucun tiret long, aucun point d'exclamation.
- Les données structurées (FAQ, article du thème) suivent le texte visible, depuis la même source.
- `public/llms.txt` est régénéré par son script. `AGENTS.md`, `TRUTH.md` et `AI_CONTEXT.md` sont mis à jour là où ils citent un texte ou une règle changés ici (titre du bloc contact, ordre des sections, menu), pour qu'un prochain passage ne rétablisse pas l'ancien texte.
- Tests : adapter les assertions qui vérifient une chaîne ou un ordre changés ici, sans en supprimer et sans affaiblir un contrôle de doctrine. Ajouter les tests du lot 6.
- Batterie : `npm ci && npm run lint && npm run build -- --webpack && npm test` verte. Les specs Playwright tournent en CI : relire `tests/accueil-epure.spec.ts`, `tests/single-page.spec.ts`, `tests/booking.spec.ts`, `tests/anti-slop-copy.spec.ts`, `tests/aeration.spec.ts`, `tests/internal-linking.spec.ts` et `tests/parcours-accueil.spec.ts`, et adapter ce que ce changement touche.
- Rappel des contrôles de texte de la CI : la durée « 15 minutes » n'est admise que dans le bloc `.booking-call`, dans le paragraphe `.contact-expectation` et dans la première réponse des questions de l'accueil. Elle ne s'écrit nulle part ailleurs sur l'accueil ni sur les pages thèmes.

---

## Lot 1. Pages thèmes : un seul gabarit, moins de titres, plus de contenu

Fichiers probables : `src/system/site-v1-pages.ts`, `src/system/integration-copy.ts` (à supprimer), `src/system/pages/theme.tsx`, `src/system/journal-themes.css`, `src/system/journal-themes.ts`, `src/system/jsonld.ts`.

### 1.1 Modèle de données

`GuideCopy` devient, pour les quatre pages et dans les deux langues :

```ts
export type GuideCopy = {
  name: string;
  title: string;
  description: string;                                   // chapeau, deux phrases
  cases: { title: string; intro: string; items: readonly string[] };
  steps: { title: string; items: readonly (readonly [string, string])[] };  // quatre étapes : [nom, texte]
  deliverables: { title: string; items: readonly string[]; note: readonly [string, string] }; // note : [amorce, texte]
  rules: { title: string; paragraphs: readonly string[] };
  faq: readonly (readonly [string, string])[];
};
```

Les champs `brief`, `briefTitle`, `markers` et `sections` disparaissent, ainsi que `INTEGRATION_COPY` et le cas particulier `config.page === "engineering-integration"` de `theme.tsx`.

### 1.2 Gabarit rendu (même ordre sur les quatre pages)

1. **En-tête sombre** (inchangé visuellement) : `h1` = `title`, paragraphe = `description`, puis le bouton « Prendre rendez-vous » vers `/rendez-vous`, source `theme-<slug>-haut`. Sur fond sombre, le bouton prend le style principal déjà utilisé sur le héros de l'accueil.
2. **`cases`** : `h2`, paragraphe `intro`, liste `ul` des `items`.
3. **`steps`** : `h2`, puis une liste ordonnée `ol.theme-steps`. Chaque `li` contient le numéro (compteur CSS, deux chiffres : 01, 02…), le nom de l'étape dans un `strong` et le texte dans un `p`. **Le nom d'une étape n'est pas un titre** (`h3` interdit ici). Sur écran large : grille de deux colonnes sur toute la largeur du contenu, chaque étape séparée par un filet fin, comme les cellules de la grille des partenaires de l'accueil. Sur téléphone : une colonne.
4. **`deliverables`** : `h2`, puis deux colonnes sur écran large : à gauche la liste `ul` des `items`, à droite un encadré (`aside`, filet fin, fond légèrement teinté déjà présent dans les jetons) avec l'amorce de `note` en `strong` et son texte en `p`. Une colonne sur téléphone.
5. **`rules`** : `h2`, paragraphes.
6. **Questions** : `h2` « Questions fréquentes » / « Frequently asked questions », puis des `details`/`summary` avec le style `home-faq` de l'accueil (la question dans le `summary`, plus de `h3`). Le premier est ouvert.
7. **Journal** : `h2` « À lire dans le Journal » / « From the Journal », puis les cartes existantes. **La section entière est omise s'il n'y a aucun article à afficher.**
8. **Bloc de rendez-vous** existant (`BookingCall`).

Largeur : le corps de page utilise toute la largeur du conteneur (comme l'accueil). Les paragraphes et les listes simples gardent une largeur de lecture de 720 px au plus ; les grilles des étapes et de « ce que vous recevez » occupent toute la largeur. Le tiers droit de l'écran ne reste plus vide.

Titres : `h2` à la taille actuelle, mais au plus **sept `h2` par page**, bloc de rendez-vous compris. Aucun `h3` dans les sections 2 à 6.

`JOURNAL_THEMES_LAST_MODIFIED` passe à `2026-11-21`.

### 1.3 Textes, page « Tester votre futur outil » (`ai-sprints`)

**FR**

- `description` : Avant d’équiper toute une équipe, vous essayez une première version de l’outil sur une tâche réelle. Vous décidez de la suite à partir des résultats des tests.
- `cases.title` : Un essai est utile quand la tâche est précise et que son résultat se vérifie
- `cases.intro` : Vous avez une tâche qui revient souvent et dont vous savez reconnaître un bon résultat. L’essai porte sur cette tâche, avec vos propres fichiers.
- `cases.items` :
  - Préparer une réponse à un client à partir de son dossier.
  - Produire un rapport financier à partir de vos fichiers.
  - Saisir des commandes reçues par courriel, qu’une personne relit ensuite.
- `steps.title` : Le travail se fait en quatre étapes, avec les personnes qui réalisent la tâche
- `steps.items` :
  1. **Le résultat attendu** · Vous nous montrez la tâche et un résultat que vous jugez correct. Nous écrivons ce que l’outil doit produire. Pour un rapport financier, nous précisons les chiffres à retrouver et les documents auxquels les comparer.
  2. **Une première version** · Nous construisons un outil qui travaille sur les fichiers et les situations retenus avec vous. Vous examinez ce qu’il produit et vous signalez ce qui manque.
  3. **Les tests** · Les personnes qui réalisent la tâche essaient l’outil. Nous comparons leurs résultats aux exigences écrites au départ et nous consignons les écarts.
  4. **La décision** · Nous vous présentons ce qui fonctionne, les erreurs restantes et le travail nécessaire avant une mise en service. Vous décidez de mettre l’outil en service, de le corriger ou d’arrêter.
- `deliverables.title` : Vous recevez l’outil testé et le compte rendu des vérifications
- `deliverables.items` :
  - La première version de l’outil, essayée par vos équipes.
  - Les résultats attendus, écrits avant la construction.
  - La liste des cas essayés, avec les écarts constatés.
  - La décision prise avec vous et les étapes suivantes, s’il y en a.
- `deliverables.note` : [« Ce que l’essai ne prouve pas », « Cette première version vérifie le fonctionnement sur les cas retenus. Elle ne suffit pas à autoriser tous les usages dans votre entreprise. L’étendre à toutes vos équipes demande une décision et une préparation supplémentaires. »]
- `rules.title` : Le périmètre et le calendrier sont écrits avant de construire
- `rules.paragraphs` :
  - Nous définissons avec vous la tâche, les fichiers utilisés et le calendrier. Celui-ci dépend de la tâche et des données disponibles.
  - Vous désignez les personnes qui essaient l’outil et celles qui valident le résultat.
- `faq` :
  - Que devez-vous préparer ? · Réunissez un exemple de la tâche, les fichiers nécessaires et un résultat que vous jugez correct. Prévoyez la participation des personnes qui utiliseront l’outil, pour qu’elles puissent l’essayer.
  - Quand l’outil peut-il être mis en service ? · Vous prenez cette décision après les tests. Nous précisons auparavant les corrections, les accès et les validations nécessaires à son utilisation.

**EN**

- `description` : Before equipping a whole team, you try a first version of the tool on a real task. You decide what comes next from the test results.
- `cases.title` : A trial is useful when the task is specific and its result can be checked
- `cases.intro` : You have a task that comes up often, and you can tell a good result from a poor one. The trial covers that task, with your own files.
- `cases.items` :
  - Preparing a reply to a customer from their file.
  - Producing a financial report from your files.
  - Entering orders received by email, which someone then reviews.
- `steps.title` : The work takes four steps, with the people who do the task
- `steps.items` :
  1. **The expected result** · You show us the task and a result you consider correct. We write down what the tool must produce. For a financial report, we specify the figures to find and the documents to compare them with.
  2. **A first version** · We build a tool that works on the files and situations agreed with you. You examine what it produces and tell us what is missing.
  3. **The tests** · The people who do the task try the tool. We compare their results with the requirements written at the start and record the gaps.
  4. **The decision** · We show you what works, the remaining errors and the work needed before the tool goes into service. You decide to put it into service, correct it or stop.
- `deliverables.title` : You receive the tested tool and the record of the checks
- `deliverables.items` :
  - The first version of the tool, tried by your teams.
  - The expected results, written before construction.
  - The list of cases tried, with the gaps found.
  - The decision made with you and the next steps, if any.
- `deliverables.note` : ["What the trial does not prove", "This first version checks that the tool works on the agreed cases. It is not enough to authorise every use in your company. Extending it to all your teams requires a further decision and further preparation."]
- `rules.title` : The scope and the schedule are written before we build
- `rules.paragraphs` :
  - We define the task, the files used and the schedule with you. The schedule depends on the task and the data available.
  - You name the people who try the tool and those who approve the result.
- `faq` :
  - What should you prepare? · Gather an example of the task, the files it needs and a result you consider correct. Plan for the people who will use the tool to take part, so they can try it.
  - When can the tool go into service? · You make that decision after the tests. Beforehand, we specify the corrections, access and approvals its use requires.

### 1.4 Textes, page « Contrôler vos assistants IA » (`harness-engineering`)

**FR**

- `description` : Avant de laisser un assistant modifier un fichier ou envoyer un message, vous devez pouvoir vérifier son travail. Nous écrivons avec vous ce qu’il peut faire, ce qui lui est interdit et à quel moment il doit demander un accord.
- `cases.title` : Ce travail concerne les assistants qui agissent sur vos fichiers et vos messages
- `cases.intro` : Un assistant qui modifie un fichier, envoie un message ou lance une commande engage votre entreprise. Nous intervenons dans deux situations.
- `cases.items` :
  - Vous préparez un assistant. Nous écrivons les contrôles avant de le relier à vos outils.
  - Votre assistant est déjà en service et commet des erreurs. Nous reproduisons le problème, puis nous vérifions les corrections sur les mêmes tâches.
- `steps.title` : Nous écrivons les règles, nous installons les contrôles, puis nous les testons
- `steps.items` :
  1. **Les accès** · Nous précisons les informations que l’assistant peut consulter, ce qu’il peut conserver et les outils qu’il peut utiliser.
  2. **Les validations** · Pour chaque tâche, nous déterminons qui relit le travail et qui autorise l’action. Vous gardez la décision sur ce qui engage votre entreprise.
  3. **Les contrôles** · Nous installons des contrôles avant les actions sensibles. Ils bloquent ce qui est interdit, et une trace conserve ce que l’assistant a exécuté.
  4. **Les tests** · Nous écrivons d’abord ce qui doit réussir et ce qui doit être bloqué. Les résultats indiquent les erreurs corrigées et celles qui restent à traiter.
- `deliverables.title` : Vous disposez de règles écrites et de contrôles que vous pouvez vérifier
- `deliverables.items` :
  - Le diagnostic des erreurs constatées.
  - Les corrections réalisées et les résultats des tests, avant et après.
  - Un guide qui précise les accès autorisés, les validations attendues et la marche à suivre en cas de problème.
  - Le suivi des dépenses d’utilisation de l’assistant.
- `deliverables.note` : [« Ce que les tests ne couvrent pas », « Les tests portent sur les situations examinées. Un assistant peut encore échouer sur une situation nouvelle. Nous indiquons les cas testés et ceux qui restent à vérifier avant d’élargir son utilisation. »]
- `rules.title` : Une personne valide les actions qui engagent votre entreprise
- `rules.paragraphs` :
  - Prenons une réponse à un client. Nous déterminons les documents que l’assistant peut lire, la personne qui relit la réponse et celle qui autorise son envoi.
  - Nous précisons de la même façon à quel moment l’assistant doit s’arrêter pour demander un accord. Ces règles sont écrites avant de le relier à vos outils.
- `faq` :
  - Qui décide de ce que l’assistant peut faire ? · Vous. Nous écrivons avec vous ses accès, les actions autorisées et les situations dans lesquelles il doit demander confirmation.
  - Par où commencer si l’assistant est déjà en service ? · Vous nous montrez les tâches qui échouent ou les actions qui vous inquiètent. Nous cherchons à reproduire le problème, puis nous vérifions les corrections sur ces mêmes tâches.

**EN**

- `description` : Before you let an assistant change a file or send a message, you need to be able to check its work. We write down with you what it may do, what it may not, and when it must ask for approval.
- `cases.title` : This work is for assistants that act on your files and messages
- `cases.intro` : An assistant that changes a file, sends a message or runs a command commits your company. We step in in two situations.
- `cases.items` :
  - You are preparing an assistant. We write the controls before connecting it to your tools.
  - Your assistant is already in service and makes mistakes. We reproduce the problem, then check the corrections on the same tasks.
- `steps.title` : We write the rules, install the controls, then test them
- `steps.items` :
  1. **Access** · We specify the information the assistant may read, what it may keep and the tools it may use.
  2. **Approvals** · For each task, we determine who reviews the work and who authorises the action. You keep the decision on anything that commits your company.
  3. **Controls** · We install controls before sensitive actions. They block what is forbidden, and a log keeps what the assistant executed.
  4. **Tests** · We first write down what must succeed and what must be blocked. The results show which errors are corrected and which remain.
- `deliverables.title` : You have written rules and controls you can check
- `deliverables.items` :
  - The diagnosis of the errors found.
  - The corrections made and the test results, before and after.
  - A guide that sets out permitted access, expected approvals and what to do when a problem occurs.
  - Tracking of what the assistant costs to run.
- `deliverables.note` : ["What the tests do not cover", "The tests cover the situations examined. An assistant can still fail on a new situation. We list the cases tested and those still to be checked before its use is extended."]
- `rules.title` : A person approves the actions that commit your company
- `rules.paragraphs` :
  - Take a reply to a customer. We determine the documents the assistant may read, the person who reviews the reply and the person who authorises sending it.
  - In the same way, we specify when the assistant must stop and ask for approval. These rules are written before it is connected to your tools.
- `faq` :
  - Who decides what the assistant may do? · You do. We write down with you its access, the permitted actions and the situations in which it must ask for confirmation.
  - Where do we start if the assistant is already in service? · You show us the tasks that fail or the actions that worry you. We try to reproduce the problem, then check the corrections on those same tasks.

### 1.5 Textes, page « Relier vos logiciels » (`engineering-integration`, slug `integration-developpement`)

**FR**

- `description` : Quand une même information est saisie dans plusieurs logiciels, nous relions les outils que vous utilisez déjà. Si aucun ne couvre le besoin, nous construisons la fonction qui manque.
- `cases.title` : Nous gardons vos logiciels et nous ajoutons ce qui manque
- `cases.intro` : Le travail commence par les logiciels que vous utilisez déjà. Trois cas se présentent.
- `cases.items` :
  - Transmettre une information d’un logiciel à un autre, avec les vérifications nécessaires.
  - Construire un outil sur mesure quand vos logiciels ne couvrent pas le besoin, par exemple pour préparer un rapport financier à partir de vos fichiers.
  - Remplacer un fonctionnement existant, après avoir comparé les résultats et préparé le retour en arrière.
- `steps.title` : Nous vérifions le parcours de chaque information avant de remplacer un fonctionnement
- `steps.items` :
  1. **Le périmètre** · Vous nous montrez vos fichiers et le résultat attendu. Nous écrivons le périmètre, les validations nécessaires et les tests avant de construire.
  2. **Le parcours des données** · Nous identifions les logiciels à relier et les personnes autorisées à consulter les données. Nous définissons où ces données circulent et où elles sont conservées.
  3. **La construction** · Nous relions vos logiciels ou nous construisons l’outil manquant. Vous l’essayez sur vos propres tâches.
  4. **La comparaison** · Nous contrôlons ce que chaque logiciel reçoit et ce qu’il transmet. Avant de remplacer un fonctionnement existant, nous comparons les résultats et nous préparons le retour en arrière.
- `deliverables.title` : Vous recevez les logiciels reliés, les tests et la description du parcours des données
- `deliverables.items` :
  - Les logiciels reliés ou l’outil construit, essayés sur vos tâches.
  - Les résultats des tests et de la comparaison avec l’ancien fonctionnement.
  - La description du parcours des données, avec les logiciels qui les reçoivent et les personnes qui peuvent les consulter.
- `deliverables.note` : [« Ce que fixe le contrat », « Le contrat fixe les droits sur le travail livré, l’hébergement et la maintenance. Il précise aussi les conditions de transfert du système et de récupération de vos données. »]
- `rules.title` : Vous gardez la main sur les actions de l’assistant
- `rules.paragraphs` :
  - Lorsqu’un assistant intervient, nous précisons les fichiers qu’il peut consulter et les actions qu’il peut exécuter. Les actions qui engagent votre entreprise suivent les validations définies avec vous.
- `faq` :
  - Faut-il remplacer vos logiciels ? · Nous conservons ceux qui répondent au besoin. Nous examinons d’abord les possibilités de les relier ou de leur ajouter la fonction manquante.
  - Qui valide les actions ? · Vous désignez les personnes responsables. Nous définissons avec elles les actions qui demandent un accord avant leur exécution.
  - Où les données sont-elles hébergées ? · Le choix de l’hébergement dépend des logiciels à relier, des personnes autorisées à consulter les données et des engagements écrits dans le contrat.

**EN**

- `description` : When the same information is typed into several pieces of software, we connect the tools you already use. If none of them covers the need, we build the missing function.
- `cases.title` : We keep your software and add what is missing
- `cases.intro` : The work starts with the software you already use. There are three cases.
- `cases.items` :
  - Passing information from one piece of software to another, with the necessary checks.
  - Building a custom tool when your software does not cover the need, for example to prepare a financial report from your files.
  - Replacing an existing process, after comparing the results and preparing the way back.
- `steps.title` : We check the path of each piece of information before replacing a process
- `steps.items` :
  1. **The scope** · You show us your files and the expected result. We write the scope, the approvals needed and the tests before we build.
  2. **The path of the data** · We identify the software to connect and the people allowed to read the data. We define where that data travels and where it is kept.
  3. **Construction** · We connect your software or build the missing tool. You try it on your own tasks.
  4. **The comparison** · We check what each piece of software receives and what it passes on. Before replacing an existing process, we compare the results and prepare the way back.
- `deliverables.title` : You receive the connected software, the tests and the description of the data path
- `deliverables.items` :
  - The connected software or the tool we built, tried on your tasks.
  - The results of the tests and of the comparison with the previous process.
  - The description of the data path, with the software that receives the data and the people who may read it.
- `deliverables.note` : ["What the contract sets", "The contract sets the rights to the delivered work, hosting and maintenance. It also specifies the conditions for transferring the system and recovering your data."]
- `rules.title` : You stay in control of the assistant’s actions
- `rules.paragraphs` :
  - When an assistant is involved, we specify the files it may read and the actions it may carry out. Actions that commit your company follow the approvals defined with you.
- `faq` :
  - Do you need to replace your software? · We keep the software that meets the need. We first examine whether it can be connected or given the missing function.
  - Who approves the actions? · You name the people responsible. With them, we define the actions that need approval before they are carried out.
  - Where is the data hosted? · The choice of hosting depends on the software to connect, the people allowed to read the data and the commitments written in the contract.

### 1.6 Textes, page « Choisir quoi automatiser » (`consulting-transformation`, slug `conseil-transformation`)

**FR**

- `description` : Avant de choisir un outil, nous regardons avec vos équipes le travail qu’elles font réellement. Vous recevez la liste des tâches examinées et les raisons de commencer par certaines.
- `cases.title` : Chaque tâche demande des gestes différents
- `cases.intro` : Préparer une réponse à un client, traiter une facture fournisseur ou réunir les chiffres d’un rapport financier ne demande pas le même travail. Nous examinons ces tâches avec les personnes qui les réalisent, pour déterminer où un outil peut être utile.
- `cases.items` :
  - Vous n’avez pas encore choisi d’outil et une tâche vous pose problème.
  - Plusieurs services demandent un outil et vous devez décider par lequel commencer.
- `steps.title` : Nous observons le travail, nous comparons les tâches, puis nous définissons la première à améliorer
- `steps.items` :
  1. **L’observation** · Vos équipes nous montrent comment elles travaillent. Nous suivons une tâche dans l’ordre, avec ses fichiers, ses échanges et ses vérifications.
  2. **Le tri** · Cette observation fait apparaître ce qui se répète et ce qui demande un jugement humain.
  3. **La comparaison** · Nous comparons les améliorations possibles, les difficultés de construction et les risques pour votre activité.
  4. **La première tâche** · Nous précisons le résultat attendu, les données nécessaires et la manière de le vérifier. Si vous décidez de construire, les personnes concernées essaient l’outil et participent à sa prise en main.
- `deliverables.title` : Vous recevez un ordre de travail expliqué
- `deliverables.items` :
  - Les tâches examinées et les raisons de commencer par certaines.
  - Les outils concernés.
  - La participation attendue de vos équipes.
  - Les vérifications nécessaires pour mesurer ce qui change.
- `deliverables.note` : [« Si le travail se poursuit par une construction », « Le contrat précise les droits sur l’outil, son hébergement et sa maintenance. Il fixe aussi les conditions de reprise du système et de récupération de vos données. »]
- `rules.title` : Vous choisissez qui accède aux données et qui valide les actions
- `rules.paragraphs` :
  - Vous désignez les personnes qui accèdent aux données et celles qui valident les actions. Nous écrivons ces règles avant de construire un outil, pour que chacun sache ce qu’il peut consulter et ce qui demande un accord.
- `faq` :
  - Faut-il déjà avoir choisi un outil ? · Vous pouvez venir avec une tâche qui vous pose problème. Nous examinons votre façon de travailler avant de recommander un outil.
  - Que demande ce travail à vos équipes ? · Les personnes concernées nous montrent leurs tâches et les documents qu’elles utilisent. Si un outil est construit, elles l’essaient et précisent ce dont elles ont besoin pour l’utiliser au quotidien.

**EN**

- `description` : Before choosing a tool, we look with your teams at the work they actually do. You receive the list of tasks examined and the reasons for starting with some of them.
- `cases.title` : Each task calls for different steps
- `cases.intro` : Preparing a reply to a customer, processing a supplier invoice and gathering the figures for a financial report are not the same work. We examine these tasks with the people who do them, to determine where a tool can help.
- `cases.items` :
  - You have not chosen a tool yet and one task is causing you trouble.
  - Several departments are asking for a tool and you have to decide where to start.
- `steps.title` : We observe the work, compare the tasks, then define the first one to improve
- `steps.items` :
  1. **Observation** · Your teams show us how they work. We follow one task in order, with its files, its exchanges and its checks.
  2. **Sorting** · This observation shows what repeats in the task and what needs human judgement.
  3. **Comparison** · We compare the possible improvements, how hard each would be to build and the risks for your business.
  4. **The first task** · We specify the expected result, the data needed and how to check it. If you decide to build, the people concerned try the tool and take part in learning to use it.
- `deliverables.title` : You receive an order of work, with the reasons
- `deliverables.items` :
  - The tasks examined and the reasons for starting with some of them.
  - The tools involved.
  - What is expected from your teams.
  - The checks needed to measure what changes.
- `deliverables.note` : ["If the work continues with construction", "The contract specifies the rights to the tool, its hosting and its maintenance. It also sets the conditions for taking over the system and recovering your data."]
- `rules.title` : You choose who has access to the data and who approves the actions
- `rules.paragraphs` :
  - You name the people who have access to the data and those who approve the actions. We write these rules before building a tool, so that everyone knows what they may read and what needs approval.
- `faq` :
  - Do you need to have chosen a tool already? · You can come with a task that is causing you trouble. We examine how you work before recommending a tool.
  - What does this work require from your teams? · The people concerned show us their tasks and the documents they use. If a tool is built, they try it and say what they need to use it every day.

---

## Lot 2. Blocs de rendez-vous et page `/rendez-vous` : le nom ne revient plus à chaque bloc

Fichiers probables : `src/system/booking.ts`, `src/system/booking.css`.

- Dans `BOOKING_CALL_COPY`, les cinq descriptions françaises commencent par « Pendant ces 15 minutes, vous… » : supprimer « avec Paul Larmaraud » (et la virgule s’ajuste : « Pendant ces 15 minutes, vous décrivez… »). Les cinq descriptions anglaises : supprimer « with Paul Larmaraud » (« During these 15 minutes, you… »). Le reste de chaque texte ne change pas.
- `BOOKING_COPY.fr.description` : Vous présentez une tâche ou un projet pendant 15 minutes en visioconférence. Nous vous disons ce qui est réalisable et ce qu’il faudrait examiner ensuite.
- `BOOKING_COPY.en.description` : You describe a task or a project in a 15-minute video call. We tell you what is feasible and what should be examined next.
- Le lien « Nous écrire » du bloc `.booking-call` (classe `booking-email`, lien `a`) prend la couleur du texte courant et un soulignement, comme le même lien sur la page `/rendez-vous`. Plus de bleu par défaut du navigateur, sur fond clair comme sur fond sombre.

---

## Lot 3. Accueil : partenaires en avant, sections sans texte fusionnées, bloc contact

Fichiers probables : `src/system/home-layers.ts`, `src/system/components/SinglePage.tsx`, `src/system/components/HomeEvidence.tsx`, `src/system/components/AppointmentLink.tsx`, `src/system/single-page-copy.ts`, `src/system/single-page.css`, `src/system/components/SessionPhotos.tsx`, `scripts/generate-llms.mjs`.

### 3.1 Ordre des sections

`HOME_SECTION_ORDER` devient :

`hero`, `references`, `motors`, `offers`, `team`, `path`, `terrain`, `technologies`, `measures`, `questions`, `contact`.

La section des partenaires (`team`, ancre `#partenaires`) passe de la dixième à la cinquième place, juste après les offres. La section `assistant` n'est plus une section à part (voir 3.3). Vérifier que l'alternance des fonds reste lisible : deux bandes sombres ne se suivent pas, et aucune section ne perd son espacement.

### 3.2 Section des partenaires

- Titre (deux fragments, le second en gras comme aujourd'hui) : « Vous travaillez avec les spécialistes » + « dont votre projet a besoin. » / EN : "You work with the specialists" + "your project needs."
- Introduction : « Nous travaillons avec des ingénieurs, des studios, des consultants, des intervenants, des cabinets de conseil et des chercheurs. Pour chaque projet, nous réunissons ceux dont le métier correspond à votre besoin. » / EN : "We work with engineers, studios, consultants, trainers, consulting firms and researchers. For each project, we bring together those whose expertise matches your need."
- Cellule « Transformation et projet » : « Des consultants accompagnent vos équipes dans le changement et suivent le projet avec vous. » / EN : "Consultants support your teams through the change and follow the project with you."
- La ligne sous la grille, « Nos partenaires interviennent selon les besoins du projet. » (classe `teamcap`), est supprimée : elle répète l'introduction.
- Les six autres cellules et leurs listes ne changent pas.

### 3.3 Presse et assistant : une seule section, avec du texte

Les sections « Chroniques parues dans Le Monde Informatique. » et « Ou demandez à votre assistant. » deviennent **une seule section** (ancre `#mesures` conservée, ancre `#assistant` conservée sur le bloc de droite), en deux colonnes sur écran large, une sur téléphone.

- Colonne de gauche :
  - `h2` : « Nous publions ce que nous apprenons sur le terrain. » / EN : "We publish what we learn in the field."
  - paragraphe : « Le Journal décrit ce qui a fonctionné et ce qui a échoué, avec les dates et les constats. Des chroniques sont parues dans Le Monde Informatique. » / EN : "The Journal describes what worked and what failed, with dates and findings. Columns have been published in Le Monde Informatique."
  - bouton inchangé : « Lire nos retours de terrain » / "Read our field notes", vers le Journal.
- Colonne de droite :
  - intertitre (`h3`) : « Vous préférez interroger votre assistant ? » / EN : "Would you rather ask your assistant?"
  - paragraphe : « Ces liens ouvrent votre assistant avec une question déjà rédigée sur Parrit.ai. » / EN : "These links open your assistant with a question about Parrit.ai already written."
  - les quatre liens existants (ChatGPT, Claude, Perplexity, Le Chat), inchangés.

Les anciens titres « Chroniques parues dans Le Monde Informatique. » et « Ou demandez à votre assistant. » disparaissent de la page, de `homeSectionHeadings` et de `llms.txt`.

### 3.4 Photos de terrain

Sous-titre de « Sur le terrain, avec vos équipes. » : « Les ateliers ont lieu dans vos locaux, sur vos outils et vos documents. » / EN : "Workshops take place on your premises, with your own tools and documents." (L'ancien sous-titre répétait « avec vos équipes ».)

### 3.5 Bloc contact

- Titre (deux fragments, le second en gras, **sans point final**) : « Commencez par » + « une tâche précise » / EN : "Start with" + "one specific task".
- Paragraphe : « Vous décrivez une tâche qui prend du temps à vos équipes, ou un outil qui vous manque. Nous vous disons ce qui est réalisable. Le travail se fait ensuite avec les ingénieurs, les intervenants et les consultants dont votre projet a besoin. » / EN : "You describe a task that takes up your teams’ time, or a tool you are missing. We tell you what is feasible. The work then continues with the engineers, trainers and consultants your project needs."
- La photo reste. Elle devient une `figure` avec une légende courte, en petit corps, sous l'image : « Paul Larmaraud mène le premier échange. » / EN : "Paul Larmaraud leads the first call." C'est la **seule** mention du nom dans le texte visible de l'accueil (l'attribut `alt` de la photo ne change pas).
- Le bouton « Prendre rendez-vous » de ce bloc (`placement="contact"`) fait défiler jusqu'au calendrier (`#reservation`), qui est juste dessous, et lui donne le focus. Aujourd'hui il renvoie à `#contact`, donc à lui-même. Son attribution de source (`rdv-contact`) ne change pas. Les autres emplacements (menu, héros, calculateur) continuent de mener à `#contact`.
- Le paragraphe `.contact-expectation` et le formulaire ne changent pas.

---

## Lot 4. Menu : chaque lien mène à la section qu'il nomme

Fichier probable : `src/system/components/RevHeader.tsx`.

- Menu français, dans l'ordre de la page : « Offres » (`#offres`), « Partenaires » (`#partenaires`), « Le parcours » (`#parcours`), « Questions » (`#questions`), « Journal ».
- Menu anglais : "Offers" (`#offers`), "Partners" (`#team`), "The path" (`#path`), "Questions" (`#questions`), "Journal".
- « Applications » et « Services » sont retirés du menu : les deux menaient au calculateur. « Contact » est retiré : le bouton « Prendre rendez-vous » du menu y mène déjà.
- Le menu mobile suit la même liste.
- Les ancres `#en-production`, `#services` et `#contact` continuent d'exister dans la page.

---

## Lot 5. Pied de page : deux groupes nommés

Fichier probable : `src/system/components/RevFooter.tsx`, `src/system/single-page.css`.

Le pied de page garde ses liens et les range en deux groupes, chacun avec un libellé en petit corps au-dessus (texte, pas un lien, pas un titre `h2`/`h3`) :

- « Ce que nous faisons » / "What we do" : les quatre pages thèmes, dans l'ordre « Choisir quoi automatiser », « Tester votre futur outil », « Relier vos logiciels », « Contrôler vos assistants IA ».
- « Parrit.ai » : « Journal », « Mentions légales », lien de langue.

Les libellés des thèmes sont lus depuis `JOURNAL_THEMES` (`label`), et non plus recopiés dans le composant. La ligne « © 2026 Parrit.ai » reste. Sur téléphone, les deux groupes s'empilent. Chaque lien garde une zone tactile d'au moins 44 px.

---

## Lot 6. Tests qui empêchent le retour du défaut

Ajouter `tests/densite-pages.test.mjs` (lancé par `npm test`), qui lit `SITE_V1_PAGES` pour chaque page et chaque langue et vérifie :

1. les quatre pages ont la même forme : `cases`, `steps`, `deliverables`, `rules`, `faq` ;
2. `steps.items` contient exactement quatre étapes, chacune d'au moins 12 mots ;
3. chaque section a du contenu : `cases` (intro et items) au moins 40 mots, `steps` au moins 80 mots, `deliverables` (items et note) au moins 50 mots, `rules` au moins 25 mots ;
4. le total des mots de contenu (hors titres) est au moins **six fois** le total des mots de titres (`title` de page et de sections) ;
5. le rendu de `theme.tsx` ne contient ni « Paul Larmaraud » hors du bloc `.booking-call`, ni `h3` entre l'en-tête et le bloc de rendez-vous ; il contient au plus sept `h2`.

Ajouter à un test existant de l'accueil (ou à ce fichier) :

6. `BOOKING_COPY` et `BOOKING_CALL_COPY` ne contiennent plus « Paul Larmaraud » ;
7. dans le texte visible rendu de l'accueil, « Paul Larmaraud » apparaît exactement une fois (la légende de la photo) ;
8. chaque lien du menu pointe vers une ancre distincte, et l'ordre des liens suit `HOME_SECTION_ORDER`.

---

## Critères d'acceptation

- Les quatre pages thèmes ont le même plan, sept `h2` au plus, et plus aucun `h2` suivi d'une seule phrase.
- L'accueil n'a plus de section réduite à un titre.
- Le menu n'a plus deux liens vers la même section.
- Le bouton du bloc contact mène au calendrier.
- « Paul Larmaraud » n'apparaît plus dans les blocs de rendez-vous ni sur `/rendez-vous`, et une seule fois dans le texte de l'accueil.
- Batterie verte, `llms.txt` régénéré, consignes (`AGENTS.md`, `TRUTH.md`, `AI_CONTEXT.md`) à jour.
- Compte rendu dans `docs/REPORT-2026-11-21-alignement-pages-partenaires.md` : fichiers touchés, tests ajoutés, ce qui n'a pas pu être vérifié en local.

## Hors périmètre

- Les 41 articles du Journal et leur texte (passe prévue après le 26/11).
- Le nom d'un partenaire ou d'un client : aucun n'est ajouté.
- Le héros, le calculateur, les offres, le parcours, les questions de l'accueil : textes inchangés.
- La signature des articles automatiques.
