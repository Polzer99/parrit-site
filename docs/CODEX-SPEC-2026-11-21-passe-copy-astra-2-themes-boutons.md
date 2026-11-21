# parrit.ai : passe de copy 2, pages thèmes et éléments cliquables

Niveau de risque : faible (texte visible ; aucune logique, aucune URL, aucun style, aucun composant nouveau).

## Demande de Paul (21/11/2026)

« Aussi les CTA et les articles un premier résultat stp les truc ou tu cliques sont pas assez riches et font hyper bullshit. »

Texte « Après » rédigé par gpt-6-astra le 21/11/2026, relu par Claude pour les faits. **Appliqué MOT POUR MOT**, en français ; l'anglais suit le même sens en anglais courant, sans emphase.

## Règles de construction

- S'applique APRÈS `docs/CODEX-SPEC-2026-11-21-passe-copy-astra.md`, sur la même branche.
- Sources probables : `src/system/journal-themes.ts`, `src/system/site-v1-pages.ts`, `src/system/booking.ts`, `src/system/components/QuickCapture.tsx`, `src/system/components/RevFooter.tsx`, `src/system/components/HomeEvidence.tsx`, `src/system/home-goals.ts`, `src/system/single-page-copy.ts`, la page article.
- Les URL et slugs des thèmes ne changent PAS (`/journal/themes/ai-sprints`…). Seuls les titres, libellés et textes changent. Le `<title>` de chaque thème suit le nouveau titre.
- Un `<br><br>` dans une cellule sépare le titre d'un bloc (première partie) de son texte (seconde partie) : garder la structure titre + paragraphe existante du bloc.
- Les FAQ et données structurées d'un thème suivent le texte visible (même source).
- Sélecteur « Je veux » : l'introduction devient « Je souhaite » et chaque choix s'affiche en minuscule initiale pour former la phrase (« Je souhaite relancer mes devis »). Les cartes associées à chaque choix gardent les textes de la spec 1.
- La ligne « Texte d'accompagnement du bouton principal » N'EST PAS appliquée (aucun élément nouveau).
- Le lien e-mail affiche « Nous écrire » et pointe toujours vers `mailto:paul.larmaraud@parrit.ai`.
- Les titres et résumés des articles du Journal ne changent pas.
- Tests : n'adapter que les assertions qui vérifient une chaîne changée ici. Aucun test supprimé, aucune doctrine affaiblie. `npm ci && npm run lint && npm run build -- --webpack && npm test` vert.

### Page harness-engineering

| Bloc | Avant (mot pour mot, ou résumé si long) | Après (texte complet) |
|---|---|---|
| Titre de l’onglet et de la page | Encadrer vos assistants IA : règles, droits et contrôles · Parrit.ai | Contrôler vos assistants IA · Parrit.ai |
| Accroche | Performant en démonstration, fragile en production | Vous décidez de ce que votre assistant peut faire |
| Introduction | Un agent peut réussir une démonstration et échouer sur vos opérations. Le harnais est le système qui organise ce qu'il sait, ce qu'il peut faire et ce qui doit être vérifié. | Avant de laisser un assistant modifier un fichier ou envoyer un message, vous devez pouvoir vérifier son travail. Nous définissons ses accès, les actions autorisées et les situations dans lesquelles il doit vous demander confirmation. |
| Fonctionnement | Le système autour du modèle. Instructions, contexte, mémoire, outils, permissions, vérifications, supervision et coûts. | Nous encadrons chaque action<br><br>Nous précisons les informations que l’assistant peut consulter et les outils qu’il peut utiliser. Nous installons des contrôles avant les actions sensibles et conservons une trace de ce qu’il exécute. |
| Première intervention | Construire un harnais neuf : partir des tâches, définir les accès et écrire les vérifications avant de brancher les outils. | Nous préparons les contrôles avant de connecter vos outils<br><br>Vous choisissez une tâche, comme préparer une réponse client. Nous déterminons les documents nécessaires, qui relit la réponse et qui autorise son envoi. |
| Seconde intervention | Auditer et corriger un système existant : reproduire ses échecs, prioriser les corrections et les tester sur les mêmes tâches. | Nous reprenons les erreurs de votre assistant<br><br>Vous nous montrez les tâches qui échouent ou les actions qui vous inquiètent. Nous cherchons à reproduire le problème, puis nous vérifions les corrections sur ces mêmes tâches. |
| Évaluation | Protocole d’évaluation. Mêmes tâches avant et après, critères écrits et résultats consignés. | Nous comparons les résultats avant et après les corrections<br><br>Nous écrivons d’abord ce qui doit réussir et ce qui doit être bloqué. Les résultats des tests indiquent les erreurs corrigées et celles qui restent à traiter. |
| Validation humaine | La supervision humaine reste définie pour les actions qui engagent l'entreprise. | Vous gardez la décision sur les actions qui engagent votre entreprise. Nous précisons qui valide ces actions et à quel moment l’assistant doit s’arrêter pour demander un accord. |
| Livrables | Un audit, une liste de corrections priorisée, un harnais refait, une suite de tests et un guide d'exploitation, selon le périmètre retenu. | Vous disposez de règles et de contrôles vérifiables<br><br>Selon le travail convenu, nous vous remettons le diagnostic des erreurs, les corrections réalisées et les résultats des tests. Un guide précise les accès autorisés, les validations attendues et la marche à suivre en cas de problème. |
| Limites | Un test réussi ne prouve pas la fiabilité dans tous les contextes. Les cas non testés restent à évaluer. Aucune mesure de performance n'est publiée ici. | Les tests couvrent les situations examinées<br><br>Un assistant peut encore échouer sur une situation nouvelle. Nous indiquons les cas testés et ceux qui restent à vérifier avant d’élargir son utilisation. |
| Repères | Instructions · Contexte · Mémoire · Outils · Permissions · Vérifications · Supervision · Coûts | Vous définissez la tâche.<br>L’assistant consulte les informations autorisées.<br>Vous précisez ce qu’il peut conserver.<br>Vous choisissez les outils accessibles.<br>Les contrôles bloquent les actions interdites.<br>Les tests vérifient les résultats.<br>Une personne valide les actions qui l’exigent.<br>Vous suivez les dépenses d’utilisation. |
| Articles du Journal | Quatre articles publiés sur les protections, les tests, les données fausses et les règles de sécurité. | Titres et résumés conservés à l’identique. |
| Titre du bloc de rendez-vous | Si vous souhaitez en savoir plus, rencontrons-nous. | Précisez les actions que vous voulez contrôler |
| Texte du bloc de rendez-vous | 15 minutes avec Paul Larmaraud pour clarifier votre sujet. Vous repartez avec une première piste, et vous décidez de la suite. | Pendant ces 15 minutes avec Paul Larmaraud, vous décrivez ce que votre assistant fait et ce qui vous inquiète. Nous précisons ensemble les actions à examiner et les éléments nécessaires pour les vérifier. |
| Bouton | Choisir un créneau | Prendre rendez-vous |
| Contact alternatif | Vous préférez écrire ? [email protected] | Vous pouvez aussi nous décrire la tâche et le problème rencontré par courriel. |

### Page ai-sprints

| Bloc | Avant (mot pour mot, ou résumé si long) | Après (texte complet) |
|---|---|---|
| Titre de l’onglet et de la page | Un premier résultat en cycle court, avec des critères écrits à l'avance · Parrit.ai | Tester votre futur outil · Parrit.ai |
| Accroche | Absente | Vous essayez l’outil sur une tâche réelle avant de décider de la suite |
| Introduction de l’encadré | En bref | Le travail commence par vos fichiers et un résultat attendu |
| Public | Pour qui : Les équipes qui veulent tester une réponse à un problème précis. | Vous avez une tâche précise à traiter, comme préparer une réponse client ou produire un rapport financier à partir de vos fichiers. |
| Point de départ | Point de départ : Un besoin, des données et un résultat attendu. | Vous apportez des exemples de la tâche, les données accessibles et ce que vous attendez du résultat. |
| Résultat remis | Ce que vous obtenez : Une brique testable et une évaluation documentée. | Vous essayez une première version de l’outil. Vous recevez les résultats des tests et la liste des erreurs ou des besoins encore non couverts. |
| Périmètre | Ce qui n'est pas livré : Un système en production à grande échelle, une promesse de délai fixe. | Cette première version sert à vérifier le fonctionnement sur les cas retenus. Son utilisation par toutes vos équipes demande une décision et une préparation supplémentaires. |
| Participation du client | Comment on décide : Avec vos utilisateurs, contre les critères du cadrage. | Les personnes qui réalisent la tâche essaient l’outil. Nous comparons leurs résultats aux exigences définies avec vous avant la construction. |
| Suite | Suite possible : Passer en production, corriger ou arrêter, et pourquoi. | Vous disposez des résultats pour décider de mettre l’outil en service, de le corriger ou d’arrêter le travail. |
| Première étape | Cadrage. Besoin, résultat attendu, données, critères de succès écrits avant de construire. | Nous écrivons ce que l’outil doit produire<br><br>Vous nous montrez la tâche et un résultat acceptable. Pour un rapport financier, nous précisons notamment les chiffres à retrouver et les documents auxquels les comparer. |
| Deuxième étape | Construction. Une brique qui tourne sur vos cas réels. | Nous construisons une version que vous pouvez essayer<br><br>L’outil travaille sur les fichiers et les situations retenus avec vous. Vous pouvez examiner ce qu’il produit et signaler ce qui manque. |
| Troisième étape | Évaluation. Avec vos utilisateurs, contre les critères du cadrage. | Nous vérifions le résultat avec les personnes concernées<br><br>Nous contrôlons les réponses ou les calculs attendus et consignons les écarts. |
| Quatrième étape | Décision. Passer en production, corriger ou arrêter, et pourquoi. | Vous décidez de la suite à partir des tests<br><br>Nous vous présentons ce qui fonctionne, les erreurs restantes et le travail nécessaire avant une mise en service. |
| Livrables | Un démonstrateur, les critères d'évaluation, une synthèse des écarts, une décision et une suite. | Vous recevez l’outil testé et le compte rendu des vérifications<br><br>Les documents précisent les résultats attendus, les cas essayés et les écarts constatés. Ils consignent aussi la décision prise avec vous et les éventuelles étapes suivantes. |
| Limites | La durée dépend du problème et se fixe au cadrage. Le sprint ne livre pas un système en production à grande échelle et ne promet pas de délai fixe. | Le calendrier dépend de la tâche et des données disponibles<br><br>Nous définissons le périmètre et le calendrier avec vous avant de construire. Les tests de cette première version ne suffisent pas à autoriser tous les usages dans votre entreprise. |
| Première question | Que faut-il préparer ? Le besoin, les cas à tester, les données accessibles et les personnes qui évalueront le résultat. | Que devez-vous préparer ?<br><br>Réunissez un exemple de la tâche, les fichiers nécessaires et un résultat que vous jugez correct. Prévoyez la participation des personnes qui utiliseront l’outil pour qu’elles puissent l’essayer. |
| Seconde question | Le passage en production est-il automatique ? Il dépend des résultats des tests et de la décision prise avec vous. | Quand l’outil peut-il être mis en service ?<br><br>Vous prenez cette décision après les tests. Nous précisons auparavant les corrections, les accès et les validations nécessaires à son utilisation. |
| Articles du Journal | Deux articles publiés sur les limites des pilotes et les tests qui annoncent un succès à tort. | Titres et résumés conservés à l’identique. |
| Titre du bloc de rendez-vous | Si vous souhaitez en savoir plus, rencontrons-nous. | Décrivez la tâche que vous voulez essayer |
| Texte du bloc de rendez-vous | 15 minutes avec Paul Larmaraud pour clarifier votre sujet. Vous repartez avec une première piste, et vous décidez de la suite. | Pendant ces 15 minutes avec Paul Larmaraud, vous présentez une tâche et le résultat attendu. Nous précisons ensemble ce qu’un premier essai devrait vérifier et les fichiers nécessaires pour l’étudier. |
| Bouton | Choisir un créneau | Prendre rendez-vous |
| Contact alternatif | Vous préférez écrire ? [email protected] | Vous pouvez aussi nous décrire la tâche et le résultat attendu par courriel. |

### Page integration-developpement

| Bloc | Avant (mot pour mot, ou résumé si long) | Après (texte complet) |
|---|---|---|
| Titre de l’onglet et de la page | Relier vos logiciels et construire ce qui manque · Parrit.ai | Relier vos logiciels · Parrit.ai |
| Accroche | Intégrer ce qui existe. Construire ce qui manque. | Vos logiciels échangent les informations nécessaires au travail |
| Premier bloc | Intégrer l'existant. Vos outils actuels restent en place quand ils font le travail, nous les relions entre eux et à vos données. | Nous relions les outils que vous utilisez déjà<br><br>Nous examinons les informations à transmettre entre vos logiciels et les vérifications nécessaires. |
| Deuxième bloc | Construire le manquant. Un logiciel ou un agent sur mesure quand votre métier a un besoin qu'aucun outil ne couvre. | Nous construisons la fonction qui manque à votre travail<br><br>Si vos logiciels ne couvrent pas le besoin, nous définissons avec vous un outil sur mesure. Il peut, par exemple, préparer un rapport financier à partir de vos fichiers. |
| Troisième bloc | Orchestrer l'ensemble. Un système où chaque étape est tracée, supervisée et réversible. | Nous vérifions le parcours des informations<br><br>Nous contrôlons ce que chaque logiciel reçoit et ce qu’il transmet. Avant de remplacer un fonctionnement existant, nous comparons les résultats et préparons le retour en arrière. |
| Construction sur mesure | Logiciels & agents sur mesure. Définition des outils autorisés, des validations humaines et des tests. | Vous essayez l’outil sur vos propres tâches<br><br>Vous nous montrez vos fichiers et le résultat attendu. Nous écrivons le périmètre, les validations nécessaires et les tests avant de construire. Le code, les données et la documentation vous appartiennent. |
| Connexions et hébergement | Intégrations & infrastructures privées. Conservation des outils utiles, connexions aux données et choix de l’hébergement selon les contraintes. | Nous définissons où vos données circulent et où elles sont conservées<br><br>Nous identifions les logiciels à relier et les personnes autorisées à consulter les données. Le choix de l’hébergement dépend de ces besoins et des engagements écrits dans le contrat. |
| Contrôle des assistants | Harness Engineering. Le contexte, les permissions, les vérifications et la supervision rendent le système contrôlable. | Vous gardez la main sur les actions de l’assistant<br><br>Lorsqu’un assistant intervient, nous précisons les fichiers qu’il peut consulter et les actions qu’il peut exécuter. Les actions qui engagent votre entreprise suivent les validations définies avec vous. |
| Conditions du projet | Contraintes et gouvernance. Cession des droits, hébergement, réversibilité et maintenance dans le contrat. | Le contrat précise ce que vous recevez et comment reprendre la gestion du système<br><br>Il fixe les droits sur le travail livré, l’hébergement et la maintenance. Il précise aussi les conditions de transfert du système et de récupération de vos données. |
| Première question | Faut-il remplacer nos outils ? Nous conservons les outils qui répondent au besoin et construisons ce qui manque. | Faut-il remplacer vos logiciels ?<br><br>Nous conservons ceux qui répondent au besoin. Nous examinons d’abord les possibilités de les relier ou de leur ajouter la fonction manquante. |
| Seconde question | Qui valide les actions ? Les responsabilités et les étapes de validation humaine sont définies au cadrage. | Qui valide les actions ?<br><br>Vous désignez les personnes responsables. Nous définissons avec elles les actions qui demandent un accord avant leur exécution. |
| Article du Journal | Article publié sur le changement de base de données de l’écran commercial. | Titre et résumé conservés à l’identique. |
| Titre du bloc de rendez-vous | Si vous souhaitez en savoir plus, rencontrons-nous. | Précisez les informations que vos logiciels doivent échanger |
| Texte du bloc de rendez-vous | 15 minutes avec Paul Larmaraud pour clarifier votre sujet. Vous repartez avec une première piste, et vous décidez de la suite. | Pendant ces 15 minutes avec Paul Larmaraud, vous décrivez une tâche qui passe par plusieurs logiciels. Nous précisons ensemble les informations à transmettre et les accès à vérifier pour étudier le raccordement. |
| Bouton | Choisir un créneau | Prendre rendez-vous |
| Contact alternatif | Vous préférez écrire ? [email protected] | Vous pouvez aussi nous décrire la tâche et les logiciels concernés par courriel. |

### Page conseil-transformation

| Bloc | Avant (mot pour mot, ou résumé si long) | Après (texte complet) |
|---|---|---|
| Titre de l’onglet et de la page | Choisir vos priorités et préparer vos équipes · Parrit.ai | Choisir quoi automatiser · Parrit.ai |
| Accroche | Les problèmes réels. Les tâches qui reviennent, les outils qui ne se parlent pas, les projets IA qui ne dépassent pas la démonstration. | Vous partez du travail que vos équipes font réellement<br><br>Préparer une réponse client, traiter une facture fournisseur ou réunir les chiffres d’un rapport financier demande des gestes différents. Nous les examinons avec les personnes concernées pour déterminer où un outil peut être utile. |
| Travail proposé | Ce que nous faisons. Diagnostic, cartographie des opportunités, priorisation, architecture cible, gouvernance et conduite du changement. | Nous comparons les tâches avant de choisir par où commencer<br><br>Nous regardons comment vos équipes travaillent, quels fichiers elles utilisent et ce qu’elles doivent vérifier. Nous comparons ensuite les améliorations possibles, les difficultés de construction et les risques pour votre activité. |
| Livrables | Un état des lieux, une matrice de priorisation, une feuille de route, un plan d'adoption et des indicateurs. | Vous recevez un ordre de travail expliqué<br><br>Le document décrit les tâches examinées et les raisons de commencer par certaines. Il précise les outils concernés, la participation attendue des équipes et les vérifications nécessaires pour mesurer ce qui change. |
| Première étape | Observer les tâches réelles, les outils et les données. Prioriser selon la valeur, le risque et la faisabilité. | Vos équipes nous montrent comment elles travaillent<br><br>Nous suivons une tâche dans l’ordre, avec ses fichiers, ses échanges et ses vérifications. Cette observation permet de repérer ce qui se répète et ce qui demande un jugement humain. |
| Deuxième étape | Transformer les processus et les systèmes, une brique à la fois. Mesurer ce qui a changé avec une méthode décidée au départ. | Nous définissons une première tâche à améliorer<br><br>Nous précisons le résultat attendu, les données nécessaires et la manière de le vérifier. Si vous décidez de construire, les personnes concernées essaient l’outil et participent à sa prise en main. |
| Accès et responsabilités | Nous cadrons les accès aux données, les responsabilités et les validations humaines avant de construire. | Vous choisissez qui accède aux données et qui valide les actions. Nous écrivons ces règles avant de construire l’outil. |
| Conditions du projet | La cession des droits sur ce que nous développons, l'hébergement, la réversibilité et la maintenance sont écrits dans le contrat de chaque projet. | Si le travail se poursuit par une construction, le contrat précise les droits sur l’outil, son hébergement et sa maintenance. Il fixe aussi les conditions de reprise du système et de récupération de vos données. |
| Première question | Faut-il déjà avoir choisi un outil ? Nous partons du travail réel pour décider des outils utiles. | Faut-il déjà avoir choisi un outil ?<br><br>Vous pouvez venir avec une tâche qui vous pose problème. Nous examinons votre façon de travailler avant de recommander un outil. |
| Seconde question | Comment les équipes participent-elles ? Elles décrivent leurs tâches, testent le système et participent au plan d'adoption. | Que demande ce travail à vos équipes ?<br><br>Les personnes concernées nous montrent leurs tâches et les documents qu’elles utilisent. Si un outil est construit, elles l’essaient et précisent ce dont elles ont besoin pour l’utiliser au quotidien. |
| Articles du Journal | Deux articles publiés sur la dépendance aux fournisseurs et la prise en main de SAP. | Titres et résumés conservés à l’identique. |
| Titre du bloc de rendez-vous | Si vous souhaitez en savoir plus, rencontrons-nous. | Choisissez une tâche à examiner |
| Texte du bloc de rendez-vous | 15 minutes avec Paul Larmaraud pour clarifier votre sujet. Vous repartez avec une première piste, et vous décidez de la suite. | Pendant ces 15 minutes avec Paul Larmaraud, vous décrivez une difficulté dans le travail de votre service. Nous précisons ensemble la tâche à observer et les personnes ou documents nécessaires pour l’étudier. |
| Bouton | Choisir un créneau | Prendre rendez-vous |
| Contact alternatif | Vous préférez écrire ? [email protected] | Vous pouvez aussi nous décrire une difficulté rencontrée par vos équipes par courriel. |

### Liens du pied de page

| Avant | Après |
|---|---|
| Encadrer vos assistants IA | Contrôler vos assistants IA |
| Un premier résultat | Tester votre futur outil |
| Relier vos logiciels | Relier vos logiciels |
| Choisir vos priorités | Choisir quoi automatiser |

### Éléments cliquables

| Élément | Avant (mot pour mot) | Après |
|---|---|---|
| Bouton principal, navigation, haut de page, bandeau et contact | Prendre rendez-vous | Prendre rendez-vous |
| Texte d’accompagnement du bouton principal | Aucun texte commun fourni | Pendant ces 15 minutes avec Paul Larmaraud, vous présentez une tâche et ce qui vous pose problème. Nous précisons ensemble le résultat attendu et les informations nécessaires pour étudier la suite. |
| Introduction du sélecteur | Je veux | Je souhaite |
| Choix du sélecteur | plus de rendez-vous | Préparer ma prospection |
| Choix du sélecteur | du contenu publié | Préparer mes articles |
| Choix du sélecteur | des devis relancés | Relancer mes devis |
| Choix du sélecteur | des appels d'offres repérés | Repérer les appels d’offres |
| Choix du sélecteur | d'anciens clients réactivés | Recontacter mes anciens clients |
| Choix du sélecteur | des commandes saisies | Saisir mes commandes |
| Choix du sélecteur | des factures rapprochées | Rapprocher mes factures |
| Choix du sélecteur | des comptes rendus prêts | Préparer mes comptes rendus |
| Choix du sélecteur | des réponses client prêtes | Préparer mes réponses clients |
| Choix du sélecteur | des contrats vérifiés | Préparer la vérification des contrats |
| Choix du sélecteur | une flotte d'agents autonomes | Automatiser des tâches sous contrôle |
| Choix du sélecteur | un logiciel propriétaire | Construire mon outil sur mesure |
| Choix du sélecteur | des équipes formées à l'IA | Accompagner la prise en main |
| Choix du sélecteur | savoir par où commencer | Choisir une tâche à améliorer |
| Choix du sélecteur | des développeurs plus rapides | Équiper mes développeurs |
| Choix du sélecteur | une IA qui reste chez nous | Définir où conserver mes données |
| Choix du sélecteur | tester une idée | Tester un outil concret |
| Lien vers le Journal | Lire le Journal | Lire nos retours de terrain |
| Texte du formulaire | Laissez votre adresse, nous vous répondons nous-mêmes. | Indiquez votre adresse électronique pour échanger avec nous sur une tâche que vous souhaitez améliorer. |
| Bouton du formulaire | Être recontacté | Demander un échange |
| Titre du bloc de fin des articles | Si vous souhaitez en savoir plus, rencontrons-nous. | Examinez ce sujet dans votre entreprise |
| Texte du bloc de fin des articles | 15 minutes avec Paul Larmaraud pour clarifier votre sujet. Vous repartez avec une première piste, et vous décidez de la suite. | Pendant ces 15 minutes avec Paul Larmaraud, vous décrivez une tâche concernée par le sujet de cet article. Nous précisons ensemble ce que vous souhaitez améliorer et les informations nécessaires pour l’étudier. |
| Bouton de fin des pages thèmes et articles | Choisir un créneau | Prendre rendez-vous |
| Contact alternatif des articles | Vous préférez écrire ? [email protected] | Vous pouvez aussi nous décrire votre situation par courriel. |
| Libellé du lien de courriel | [email protected] | Nous écrire |

### À vérifier par Paul (pour information : rien à appliquer dans cette section)

| Point | Vérification ou décision attendue |
|---|---|
| Fonctionnement du sélecteur | Confirmer ce qui se passe après chaque choix. Les libellés expriment un besoin du visiteur. La destination doit expliquer comment ce besoin sera examiné, sans présenter tous ces usages comme des réalisations disponibles. |
| Prise en main de l’IA | Confirmer que le choix « Accompagner la prise en main » reste affiché dans une rubrique qui mentionne explicitement l’IA. |
| Échange de 15 minutes | Confirmer que le rendez-vous permet bien de préciser une tâche, le résultat attendu et les informations à réunir. Les textes ne promettent ni audit ni outil livré pendant l’échange. |
| Formulaire | Vérifier que le formulaire transmet bien une demande de contact et que la réponse est prise en charge. |
| Adresse de courriel | [À COMPLÉTER : adresse publique réelle et destination du lien « Nous écrire »]. |
| Articles publiés | Les titres et résumés restent inchangés. Leurs chiffres et affirmations restent soumis à leurs propres preuves, notamment les gains suggérés dans le résumé sur SAP. |
