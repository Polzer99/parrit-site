# Spec Codex : hero en trois plans, titre « Votre expertise est la matière première »

Date : 29/10/2026. Choix de Paul : le hero n° 07 (titre, phrase, schéma en trois plans).
Maquettes de référence dans `docs/hero-trois-plans/` :

- `Hero-07.dc.html` + `ordinateur.png` : ordinateur, cadre 1440 × 800.
- `Hero-07-mobile.dc.html` + `telephone.png` : téléphone, largeur 390.
- `gen_palantir.py`, `gen_mobile.py` : les générateurs. **La géométrie, les libellés, les liens et les quatre histoires viennent de là. Ne rien inventer, ne rien renommer.**

**Ces fichiers ne sont pas encore sur `main`.** Lis-les à ce chemin absolu, en lecture seule :
`/Users/paullarmaraud/parrit-site-worktrees/hero-trois-plans/docs/hero-trois-plans/`

Copie ensuite dans `docs/hero-trois-plans/` de ta branche, et dans la PR, les fichiers suivants : `Hero-07-final.dc.html`, `Hero-07-mobile.dc.html`, `ordinateur.png`, `ordinateur-etape3.png` et `telephone.png`. Ne copie aucun `.py`.

La maquette d'ordinateur qui fait foi est `Hero-07-final.dc.html`. `Hero-07.dc.html` est l'ancienne version, où la carte était posée sur le schéma.

Les fichiers `.dc.html` sont des maquettes, pas du code à copier. La syntaxe `{{...}}` et `class Component extends DCLogic` n'existent pas dans le site.

## 1. Le texte

| Élément | Français | Anglais |
|---|---|---|
| h1, première partie | Votre expertise est la matière première. | Your expertise is the raw material. |
| h1, partie en gras (`<b>`) | Nous la mettons au travail. | We put it to work. |
| Phrase sous le titre | Vos règles, vos données et vos décisions deviennent des systèmes qui en multiplient l'impact. | Your rules, your data and your decisions become systems that multiply their impact. |
| Bouton | Parlons de votre transformation (inchangé) | inchangé |

- Ces entrées remplacent, dans `src/system/single-page-copy.ts`, celles de « Nous allons à la frontière du possible », « puis nous le livrons à nos clients » et « Votre expertise est la matière première. Nous en faisons des systèmes… ». Retirer les clés devenues inutiles.
- `src/app/opengraph-image.tsx` : `alt` et texte de l'image passent au nouveau titre, avec la même règle de gras. Mettre à jour `tests/og-canard.test.mjs`.
- La ligne Clive Humby (`.humby`) reste, sous le schéma, sans changement.

## 1 bis. Écarts imposés par le Brand OS (priment sur les maquettes)

Les maquettes ont été dessinées hors du site ; `AGENTS.md` prime sur elles :

- **Couleurs** : aucun hex dans le composant ni dans le CSS. Tout passe par les jetons (`var(--canard)`, `var(--on-canard)`, `var(--white)`, jetons Brand OS de l'encre, de la sauge et du rose). `npm run qa:brand:rev01` doit passer.
- **Un seul éclat rose par écran** : le rose reste au seul bouton « Parlons de votre transformation ». Dans le schéma :
  - les pastilles numérotées passent en blanc, chiffre encre ;
  - la pastille « Vous validez » passe en sauge, texte encre ;
  - le nœud d'action allumé et son lien passent en blanc épais ;
  - on les distingue des autres nœuds allumés par la pastille 4.
- **Zéro ombre, rayon 0** : la carte « PRÊT » n'a pas d'ombre. Les pastilles numérotées sont des carrés, pas des ronds.
- **General Sans partout** : IBM Plex Mono est réservée au Journal. Les étiquettes de zone, de couche et « PRÊT » passent en General Sans 500, capitales, avec l'interlettrage de la maquette.
- **Le hero entier, barre comprise, tient à 1440 × 800** : la ligne Clive Humby passe sous le schéma, à droite, sur ordinateur. Sous 1200 px, elle reste sous la légende du schéma.
- **Remplace `HERO-TABLETTE.md`** pour le hero : sous 1200 px, c'est la mise en page empilée décrite plus bas. `.toklab` disparaît avec l'ancien schéma, ainsi que les tests qui le visent.
- Ajouter à `AGENTS.md` une section courte « Hero trois plans, 29/10/2026 », dans le style des sections existantes.

## 2. Le schéma : `OntologyHero.tsx` réécrit

Le schéma actuel (trois lignes, six histoires, jetons qui voyagent) est remplacé entièrement. Supprimer le code mort qui va avec : `stories`, `ambient`, `talk`, `pushResult`, les classes `.trail`, `.token`, `.res`, et le CSS associé.

### Contenu (repris tel quel de `gen_palantir.py`)

- Trois plans isométriques empilés. De haut en bas : `top`, `mid`, `bot`.
- Onze nœuds par plan : `NODES`, aux positions `ROWS`. Chaque nœud a une icône `GLYPH`.
- Trois étiquettes de zone par plan : `ZONES`. Une étiquette de couche par plan : `LAYERS`.
- Les liens :
  - `UP` : du plan du bas vers celui du milieu.
  - `REL` : dans le plan du milieu.
  - `TOP` : du plan du milieu vers celui du haut.
- Les quatre histoires sont dans le script de la maquette (`stories`, champs `d, o1, o2, rel, r, rl, out, top, result, act, al, verb, side, steps`).
- Ordre de dessin, à garder pour que les liens passent derrière les plans du dessus :
  1. plan bas ;
  2. liens UP ;
  3. plan milieu ;
  4. liens REL et TOP ;
  5. plan haut.

### Animation (identique dans les deux mises en page)

- Les quatre histoires tournent en boucle. Chacune a cinq étapes, de 0 à 4. La maquette montre ce qui s'allume à chaque étape :
  - Étape 1 : la source `d` et l'objet `o1`, avec le lien UP qui les relie.
  - Étape 2 : l'objet `o2` et le lien `rel`.
  - Étape 3 : la règle `r` et le résultat `out` (en sauge), avec les liens `rl` et `top`. La carte « PRÊT » apparaît.
  - Étape 4 : l'outil d'action `act` et le lien `al`, en blanc épais (voir § 1 bis). La pastille « Vous validez » ou « Vous décidez » apparaît.
- Durées :
  - 2 700 ms par étape ;
  - 3 600 ms sur l'étape 4 ;
  - 900 ms de pause entre deux histoires.
- Les changements d'état passent par des classes CSS avec `transition` (couleur, opacité, épaisseur de trait). Un seul `setTimeout` actif à la fois. Pas de `requestAnimationFrame`, pas de nouvelle dépendance.
- Démarrage et arrêt : garder `useMotionOnView` et son contrat. Le nettoyage remet l'état statique.
- **Mouvement réduit et rendu serveur** : état statique. C'est l'histoire 1 à l'étape 4 : tout est allumé, la carte et la pastille sont visibles, et la légende affiche ses quatre étapes. Aucun minuteur ne tourne.

### Ordinateur (largeur ≥ 1200 px)

Référence : `Hero-07-final.dc.html`, avec `ordinateur.png` et `ordinateur-*.png`. Retour de Paul du 29/10 : le résultat ne doit plus se poser au milieu du schéma.

- **Colonne de gauche**, environ 430 px :
  - titre, phrase et bouton ;
  - sous un filet fin, **le panneau de l'histoire** : son titre, les quatre étapes en liste verticale (chacune précédée de sa pastille carrée), puis la carte « PRÊT · résultat · verbe » en ligne.
- **À droite**, le schéma est dégagé :
  - les libellés des nœuds en HTML ou en `<text>` SVG, à 10,5 px dans le cadre de 1440 ;
  - les pastilles carrées 1 à 4 se posent **à gauche** des nœuds `d`, `o2`, `out` et `act`, sans couvrir aucun libellé ;
  - aucune carte n'est posée sur le schéma.
- La ligne Clive Humby se place sous le schéma, à droite.
- L'étape en cours est en gras, les étapes à venir sont estompées. La carte apparaît à l'étape 3, la pastille du verbe à l'étape 4.
- Le schéma garde ses proportions. Aucun libellé ne doit tomber sous 9 px rendus : en dessous, c'est la mise en page téléphone qui s'applique.
- Les étiquettes de zone tiennent sur une ligne. Les étiquettes de couche peuvent passer sur deux lignes, mais aucune ne doit être coupée par le bord.

### Téléphone et tablette (largeur < 1200 px)

Mise en page empilée, comme dans `telephone.png` et `gen_mobile.py` :

- Titre, phrase, puis bouton sur toute la largeur.
- Le schéma vient ensuite, à la largeur de la colonne, avec 560 px au maximum. Il est centré :
  - Les nœuds sont des **icônes sans libellé**.
  - Il n'y a pas d'étiquettes de zone.
  - Le nom de chaque couche est posé au-dessus de son plan, à gauche.
- Des pastilles numérotées de 1 à 4 se posent sur les nœuds `d`, `o2`, `out` et `act` au fil des étapes. Elles restent affichées jusqu'à la fin de l'histoire.
- Sous le schéma, la légende comprend :
  - le titre de l'histoire ;
  - les quatre étapes en liste verticale, chacune précédée de sa pastille ;
  - puis la carte « PRÊT · résultat · verbe », en ligne.
- Le titre fait 38 px sur 43 à 390 px de large. Adapter les tests qui figent les tailles du hero téléphone (`tests/single-page.spec.ts`, environ ligne 236) et le dire dans la PR.

### Stabilité et accessibilité

- **Aucun saut de mise en page** : `tests/stabilite.spec.ts` doit rester vert.
  - La hauteur de la légende est réservée par le texte le plus long des quatre histoires, avec le même principe que l'actuel `.ontocap-stack` / `.ontocap-sizer`.
  - La carte se montre et se cache par l'opacité seulement.
- La région garde `role="region"`, un `aria-label` (FR « Des sources aux résultats », EN « From sources to results ») et `tabIndex={0}`. Le SVG reste `aria-hidden`. La légende garde `aria-live="off"`.
- Contraste : les libellés au repos restent à `rgba(213,234,239,0.78)` ou plus, sur le fond `#006F8A`.

## 3. Anglais du schéma

Tout libellé visible passe par `SINGLE_PAGE_EN`.

| Français | Anglais |
|---|---|
| Synthèse de réunion | Meeting summary |
| Recherche documentaire | Document search |
| Réponse client | Client reply |
| Assistant e-mails | E-mail assistant |
| Trésorerie | Cash position |
| Écarts de contrat | Contract gaps |
| Retards de paiement | Late payments |
| Relances | Follow-ups |
| Suivi des actions | Action tracking |
| Saisie des factures | Invoice entry |
| Mise à jour ERP | ERP update |
| Devis | Quote |
| Réclamation | Complaint |
| Client | Client |
| Commande | Order |
| Paiement | Payment |
| Facture | Invoice |
| Contrat | Contract |
| Fournisseur | Supplier |
| Stock | Stock |
| Équipe | Team |
| Action | Action |
| E-mails | E-mails |
| Comptes rendus | Minutes |
| Factures | Invoices |
| Contrats | Contracts |
| Conditions générales | Terms and conditions |
| Échéances | Due dates |
| Procédures | Procedures |
| Messagerie | Mailbox |
| Agenda | Calendar |
| ERP | ERP |
| Gestion documentaire | Document management |
| ASSISTANTS ET RÉDACTION | ASSISTANTS AND DRAFTING |
| ANALYSES | ANALYSIS |
| AUTOMATISATIONS ET AGENTS | AUTOMATIONS AND AGENTS |
| COMMERCIAL | SALES |
| FINANCE ET JURIDIQUE | FINANCE AND LEGAL |
| OPÉRATIONS ET ÉQUIPES | OPERATIONS AND TEAMS |
| SOURCES DE DONNÉES | DATA SOURCES |
| SOURCES DE LOGIQUE | LOGIC SOURCES |
| SYSTÈMES D'ACTION | SYSTEMS OF ACTION |
| ANALYSES · SOLUTIONS | ANALYSIS · SOLUTIONS |
| ce que vous obtenez | what you get |
| ONTOLOGIE | ONTOLOGY |
| votre entreprise en objets reliés | your business as linked objects |
| SOURCES | SOURCES |
| ce que vous avez déjà | what you already have |
| PRÊT | READY |
| Vous validez | You approve |
| Vous décidez | You decide |
| Un client attend une réponse | A client is waiting for a reply |
| un client écrit | a client writes |
| le système le relie à sa commande | the system links it to the order |
| un agent applique vos conditions | an agent applies your terms |
| vous validez, la réponse part | you approve, the reply goes out |
| Réponse prête | Reply ready |
| Une facture n'est pas payée | An invoice is unpaid |
| la facture est échue | the invoice is overdue |
| le système la relie au client | the system links it to the client |
| un agent applique vos échéances | an agent applies your due dates |
| vous validez, la relance part | you approve, the follow-up goes out |
| Relance prête | Follow-up ready |
| Un contrat arrive | A contract comes in |
| le contrat est reçu | the contract is received |
| le système le relie au fournisseur | the system links it to the supplier |
| un agent le compare à vos procédures | an agent checks it against your procedures |
| vous décidez, l'ERP est à jour | you decide, the ERP is updated |
| Écarts signalés | Gaps flagged |
| La réunion se termine | The meeting ends |
| la réunion se termine | the meeting ends |
| le système relie actions et équipe | the system links actions and team |
| un agent suit vos procédures | an agent follows your procedures |
| vous validez, l'agenda est à jour | you approve, the calendar is updated |
| Qui fait quoi, pour quand | Who does what, by when |

## 4. Tests

- Réécrire les tests du schéma dans `tests/single-page.test.mjs` et `tests/single-page.spec.ts` :
  - trois plans, 33 nœuds, quatre histoires ;
  - l'état statique en mouvement réduit ;
  - la rotation de la légende ;
  - le nettoyage hors de l'écran ;
  - le français et l'anglais ;
  - aucune icône ni aucun libellé ne déborde du hero, à 375, 390, 768, 1024, 1280 et 1440 px de large.
- Ajouter un test d'anonymat : le HTML rendu (FR et EN) ne contient aucun de ces mots, sans tenir compte de la casse : `toyotomi`, `hiolle`, `atlas`.
- `tests/stabilite.spec.ts` doit rester vert, sans relâcher aucun seuil.
- Batterie : `npm ci --silent && npm run lint && npm test && npm run build`, plus les specs Playwright `single-page` et `stabilite`.

## 5. Hors périmètre

- Ne pas toucher l'en-tête, le bandeau des technologies ni les sections sous le hero.
- Ne pas ajouter de prix, de nom de client ni de chiffre.
- Ne pas committer `docs/hero-trois-plans/*.py`, ni ce fichier de spec s'il a été recopié dans `tmp/`.
- Branche dédiée, PR vers `main`. **Ne pas fusionner.**
