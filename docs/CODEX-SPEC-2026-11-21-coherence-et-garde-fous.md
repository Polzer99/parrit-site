# parrit.ai : cohérence du texte et garde-fous contre le texte de machine

Niveau de risque : moyen (textes de l'accueil dans les deux langues, une section retirée, un test qui bloque la CI).

S'applique **après** `docs/CODEX-SPEC-2026-11-21-alignement-pages-partenaires.md`, sur `main` à jour.

## Demande de Paul (21/11/2026, soir)

« Il faut juste surtout que ça soit lisible et que les gens sachent comment l'utiliser en regardant directement la page. […] C'est juste call to action, comment nous utiliser, et avoir pas l'impression que c'est juste Paul Larmaraud qui tient la boîte. Il faut plutôt parler de Parrit.ai comme d'un collectif. Et surtout, faire la chasse à l'AI slop. […] Il n'y a pas suffisamment de guardrails pour que ça soit respecté. […] Faut qu'à la fin des phrases, il y ait des points. Faut pas qu'il y ait des fois des phrases avec des points, des fois des phrases sans points, pareil en anglais qu'en français. Les gens doivent pouvoir lire, mais aussi les agents. »

« Pareil sur les assistants, on s'en fout. […] Ce n'est pas du tout les IA qu'on utilise. Tous ces petits trucs-là qui font que ce n'est pas aligné. »

## Mesure avant (en ligne le 21/11/2026)

- L'outil de style actuel (`prooflint`) ne relève rien sur l'accueil ni sur une page thème : il cherche des mots, pas ces défauts-là.
- Accueil français : la phrase « Vos équipes prennent l'IA en main » est dans 5 blocs, dont le titre des offres et la carte juste dessous, mot pour mot. « selon » revient 8 fois.
- Accueil anglais : « take AI in hand » 4 fois et « according to your/the… » 6 fois. Ce sont des calques du français.
- Dans une même liste, deux lignes finissent par un point et la troisième non (« Prise en main sur vos outils et vos documents » puis « Vous définissez qui utilise l'IA et selon quelles règles. »). Les titres de l'accueil ont un point final, ceux des pages thèmes n'en ont pas.

---

## Lot A. Une seule règle de ponctuation, en français et en anglais

À appliquer à **tout** le texte visible des pages publiques hors corps et titres des articles du Journal : accueil, pages thèmes, `/rendez-vous`, en-tête du Journal, blocs de rendez-vous, pied de page, page 404.

| Rôle du texte | Règle |
|---|---|
| Paragraphe, réponse d'une question, légende de photo, texte d'une étape, texte d'une carte | finit par un point (ou par un point d'interrogation si c'est une question) |
| Ligne d'une liste de contenu (`li` : avantages des offres, cas, ce que vous recevez) | finit par un point. Toutes les lignes d'une même liste finissent de la même façon |
| Titre `h1`, `h2` ou `h3` de **trois mots ou plus** | finit par un point, ou par un point d'interrogation |
| Titre d'un ou deux mots (« Questions », « Apprendre ») et nom d'une étape (`strong`) | pas de point |
| Bouton, lien, entrée de menu, libellé de champ, surtitre de carte, nom d'outil ou de technologie, étiquette courte d'une grille (les listes « Avec eux, nous livrons ») | jamais de point final |
| Titre et résumé d'un article du Journal, dans les cartes comme dans l'article | inchangés |

Conséquences à appliquer, entre autres :

- les `h2` des quatre pages thèmes prennent un point final (« Un essai est utile quand la tâche est précise et que son résultat se vérifie. ») ; les `h1` des pages thèmes aussi (« Tester votre futur outil. ») alors que les liens du pied de page et le `<title>` gardent le libellé sans point ;
- les titres des blocs de rendez-vous prennent un point (« Décrivez la tâche que vous voulez essayer. ») ;
- le titre du bloc contact devient « Commencez par » + « une tâche précise. » : le contrôle Playwright qui exigeait l'absence de point final sur `#contact h2` est retourné (il exige désormais le point) ;
- les trois légendes de photos : « Prise en main par les équipes. », « Atelier sur vos outils. », « Intervention devant des dirigeants. » ;
- les six lignes d'avantages des deux cartes d'offres finissent toutes par un point ;
- en anglais, mêmes règles, et le libellé de champ « E-mail » devient « Email ».

Le français garde l'espace insécable avant « ? » et « : ». Aucun point n'est ajouté dans une donnée structurée dont la valeur est un nom (`name` d'une organisation, d'un service).

---

## Lot B. Accueil : textes qui se répètent, calques de l'anglais, section des assistants

Fichiers probables : `src/system/home-layers.ts`, `src/system/single-page-copy.ts`, `src/system/home-goals.ts`, `src/system/components/HomeEvidence.tsx`, `src/system/components/SinglePage.tsx`, `src/system/components/SessionPhotos.tsx`, `scripts/generate-llms.mjs`.

### B.1 La section des assistants est supprimée

Le bloc « Vous préférez interroger votre assistant ? » (ancien « Ou demandez à votre assistant. ») et ses quatre liens ChatGPT, Claude, Perplexity et Le Chat disparaissent de la page, du composant, de `llms.txt` et des tests. La section de la presse garde une seule colonne : le titre « Nous publions ce que nous apprenons sur le terrain. », son paragraphe et le bouton « Lire nos retours de terrain ». L'ancre `#assistant` n'a plus à exister.

### B.2 Textes français (mot pour mot)

| Emplacement | Avant | Après |
|---|---|---|
| Sous le titre du calculateur | Vos chiffres, votre calcul. | Remplacez ces chiffres par les vôtres. |
| Carte « Transformation IA », titre | Vos équipes prennent l'IA en main. | Vos équipes apprennent sur leurs propres dossiers. |
| Carte « Transformation IA », ligne 1 | Prise en main sur vos outils et vos documents | Des ateliers sur vos outils et vos documents. |
| Carte « Transformation IA », ligne 2 | Accompagnement au changement, du comité de direction aux équipes métier | Un accompagnement du comité de direction aux équipes métier. |
| Carte « Développement de logiciels », lignes | (sans point) | Des outils sur mesure, reliés à vos logiciels. / Des assistants que vos équipes relisent et valident. / Installés chez vous si vos données l'exigent. |
| Partenaires, cellule « Ingénieurs IA » | Les ingénieurs interviennent selon leur spécialité sur les documents, les assistants ou les liens entre logiciels. | Des ingénieurs spécialisés travaillent sur vos documents, vos assistants ou les liens entre vos logiciels. |
| Question « Faut-il des équipes techniques ? » | Non. Vos équipes prennent l'IA en main sur leurs outils, puis nous construisons des assistants qu'elles relisent et valident. | Non. Vos équipes apprennent sur leurs propres outils. Nous construisons ensuite des assistants qu'elles relisent et valident. |
| Question « Travaillez-vous avec les grands groupes comme avec les PME ? » | Oui. Nous choisissons les intervenants selon les besoins de votre entreprise. | Oui. Nous réunissons les intervenants qu'il faut, pour une PME comme pour un grand groupe. |

La première réponse des questions (« Nous échangeons pendant 15 minutes… ») et le paragraphe `.contact-expectation` ne changent pas d'un caractère : des contrôles les comparent mot pour mot.

### B.3 Textes anglais (écrits en anglais, pas traduits)

| Emplacement | Avant | Après |
|---|---|---|
| Sous le titre du calculateur | Your figures, your math. | Replace these figures with your own. |
| Sélecteur du héros, carte « prise en main » | Your teams take AI in hand, on their own files. | Your teams learn to work with AI, on their own files. |
| Carte « AI transformation », titre | Your teams take AI in hand. | Your teams learn on their own files. |
| Carte « AI transformation », lignes | (sans point) | Workshops on your own tools and documents. / Support from the executive committee to every team. / You decide who uses AI and under which rules. |
| Carte « Software development », lignes | (sans point) | Custom tools connected to your software. / Assistants your teams review and approve. / Installed on your servers when your data requires it. |
| Légendes des photos | Teams taking AI in hand / Workshop on your tools / Talk to business leaders | Teams getting hands-on with AI. / A workshop on your tools. / A talk to business leaders. |
| Titre du bandeau des technologies | We choose tools according to your needs. | We choose the tools that fit your needs. |
| Partenaires, cellule « AI engineers » | Engineers work in their areas of expertise on documents, assistants or connections between software. | Specialist engineers work on your documents, your assistants or the links between your software. |
| Question « Do we need technical teams? » | No. Your teams take AI in hand with their own tools, then we build assistants they review and approve. | No. Your teams learn on their own tools. We then build assistants they review and approve. |
| Question « Which technologies do you use? » | We choose from ChatGPT, Claude, Gemini, Mistral, Copilot and other tools according to your needs. We do not depend on a single provider. | We choose from ChatGPT, Claude, Gemini, Mistral, Copilot and other tools, depending on what you need. We do not depend on a single provider. |
| Question « Do you work with large companies as well as SMEs? » | Yes. We choose the people involved according to the needs of your business. | Yes. We bring together the right people, for a small company as for a large group. |
| Question « How much does it cost? » | The price is set after scoping, according to the project scope. We do not publish a price list. | The price is set after scoping and depends on the scope. We do not publish a price list. |
| Résultat du calculateur « Save time » | 17 h a month spent on this task… | 17 hours a month spent on this task… (le mot « hours » en toutes lettres, le calcul ne change pas) |

Après ce lot, « take AI in hand », « taking AI in hand » et « according to » n'apparaissent plus dans le texte anglais du site hors articles.

### B.4 Bloc contact : rien d'explicite

Précision de Paul, le 21/11/2026 au soir : « Comment nous utiliser, il doit être implicite, pas explicite. Il faut faire sentir. » Aucune liste « comment ça marche », aucune étape numérotée n'est ajoutée au bloc contact. Le paragraphe posé par la spec précédente reste tel quel. La page fait comprendre la marche à suivre par sa construction : un seul bouton, toujours le même libellé, et le calendrier juste sous le texte.

---

## Lot C. Le garde-fou : `tests/style-site.test.mjs`, lancé par `npm test`

Le test rend en HTML statique (comme `tests/brand-os-render.test.mjs` le fait déjà) l'accueil, les quatre pages thèmes, `/rendez-vous` et l'en-tête du Journal, **en français et en anglais**, puis vérifie sur le texte visible. Un échec bloque la CI. Les éléments `aria-hidden` (copies de carrousel) sont ignorés. Le corps et les titres des articles ne sont pas concernés.

1. **Ponctuation par rôle** : les règles du lot A, une à une. Le message d'échec cite la page, la langue, la balise et le texte fautif.
2. **Listes homogènes** : dans une même liste de contenu, toutes les lignes finissent par le même signe.
3. **Pas de phrase en double** : sur une même page, aucune phrase de cinq mots ou plus n'apparaît deux fois (hors menu, pied de page et boutons).
4. **Pas de formule ressassée** : sur une même page, aucune suite de quatre mots n'apparaît dans plus de trois blocs différents (mots-outils compris, noms d'outils exclus).
5. **Le nom** : « Paul Larmaraud » apparaît au plus une fois dans le texte visible de l'accueil, et zéro fois sur les pages thèmes et sur `/rendez-vous`.
6. **Calques et mots interdits**, lus depuis une liste unique `tests/fixtures/style-interdits.json`, deux tableaux `fr` et `en` :
   - `en` : "in hand", "according to", "in function of", "permits to", "allows to", "leverage", "seamless", "cutting-edge", "unlock", "empower", "game-chang", "revolutionary", "world-class", "best-in-class", "delve", "tailored solution", "in today's";
   - `fr` : « innovant », « révolutionnaire », « de pointe », « écosystème », « levier », « booster », « optimiser », « afin de », « par ailleurs », « en outre », « n'hésitez pas », « dans un monde où », « à l'ère de », « sur mesure pour vous », « clé en main », « solution » (mot entier, singulier et pluriel).
   Si un mot de cette liste est présent aujourd'hui dans un texte que cette spec ne réécrit pas, le signaler dans le compte rendu au lieu de l'exempter en silence, et le retirer de la liste seulement avec cette justification écrite.
7. **Une seule langue par page** : sur une page française, aucun bloc de texte de trois mots ou plus n'est composé de mots anglais courants (« the », « your », « with », « and », « we ») ; l'inverse sur une page anglaise (« le », « les », « vos », « avec », « nous »). Les noms d'outils, de clients et les titres d'articles sont exclus.
8. **Signes** : aucun tiret long ou demi-cadratin, aucun point d'exclamation, aucune suite de trois points, aucun émoji dans le texte visible.
9. **Un bouton, un nom** : tous les boutons et liens qui mènent au rendez-vous portent exactement « Prendre rendez-vous » en français et « Book a call » en anglais.

Le test `tests/densite-pages.test.mjs` de la spec précédente reste et n'est pas fusionné dans celui-ci.

Ajouter dans `AGENTS.md`, sous le paragraphe daté du 21/11/2026, la règle de ponctuation du lot A en cinq lignes et la phrase : « Tout texte visible passe `tests/style-site.test.mjs`. Une exception s'écrit dans le test avec sa raison, jamais dans le texte. »

---

## Lot D. Lisibilité par les robots (mesures du 21/11/2026)

1. **`/rendez-vous` sans JavaScript.** La page ne contient aujourd'hui que 51 mots et aucun lien de réservation dans le HTML initial. Ajouter un `<noscript>` avec un lien direct vers la page Cal.com de la langue (le même `calLink` que le calendrier intégré), libellé « Prendre rendez-vous » / « Book a call ».
2. **Anglais dans les métadonnées de pages françaises.** `og:image:alt="Parrit.ai Journal article"` sur les articles français devient « Article du Journal de Parrit.ai ». Le titre du flux RSS annoncé sur `/fr/journal` devient « Journal de Parrit.ai ».
3. **`llms.txt`.** La ligne de la réservation décrit aussi `/fr/rendez-vous` et `/rendez-vous`, qui sont la destination des boutons hors accueil. La ponctuation française (espace avant « : ») ne s'applique qu'à la partie française du fichier.

## Critères d'acceptation

- Plus aucune liste ni aucun groupe de titres où certains éléments ont un point et d'autres non, en français comme en anglais.
- La section des assistants n'existe plus.
- `tests/style-site.test.mjs` passe, et échoue si l'on remet l'un des défauts (le vérifier en remettant « Vos équipes prennent l'IA en main. » comme titre de carte : le test doit tomber sur la règle 3).
- Batterie verte : `npm ci && npm run lint && npm run build -- --webpack && npm test`. `llms.txt` régénéré. Specs Playwright touchées par un texte ou par la section supprimée : adaptées, sans affaiblir un seuil.
- Compte rendu dans `docs/REPORT-2026-11-21-coherence-et-garde-fous.md`, avec la liste de chaque chaîne modifiée par la règle de ponctuation.

## Hors périmètre

- Le titre principal de l'accueil, le sélecteur du héros et ses 17 cartes (hors la ligne anglaise citée), le calculateur, le parcours en trois étapes : inchangés hors ponctuation.
- Les articles du Journal.
- La charte, les polices et les couleurs.
