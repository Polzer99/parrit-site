# Passe 3 — page racontée, logos clients, trajet d'une donnée (Paul, 27/10/2026)

Statut : maquette validée par Paul le 27/10/2026 (« ok go »). Elle prime sur
`MAQUETTE-VALIDEE.html` pour tout ce qu'elle couvre ; le reste de la page ne change pas.

Objectif de la page (Paul) : que les gens prennent rendez-vous. On ne dévoile pas tout.

## 0. Matériel fourni (lecture seule, hors dépôt)

- Maquette : `/private/tmp/claude-501/-Users-paullarmaraud/b2420e7f-18c7-4612-878e-b13d9a2a28d0/scratchpad/maquette-bas/`
  (`index.html`, `hero.js`, `hero.css`, `icons/`). Elle fait foi pour la mise en page,
  les textes français, les animations et leurs durées. La copier dans
  `docs/site-v1/page-unique/passe-3/maquette/` (sans le `.mp4`) pour la garder au dépôt.
  Les chemins `file:///…/public/tools/*.svg` de la maquette désignent les fichiers déjà
  présents dans `public/tools/`.
- Logos prêts à servir, en masque (seul le canal alpha compte, aucune couleur dedans) :
  `/private/tmp/claude-501/-Users-paullarmaraud/b2420e7f-18c7-4612-878e-b13d9a2a28d0/scratchpad/passe3-assets/`
  - `clients/` : `laparra.png` (551×120), `clevery.png` (367×120), `forexpert.png` (119×120),
    `joone.png` (387×120), `sncf.svg` (viewBox 24×24). À copier dans `public/clients/`.
  - `tools/` : `mistralai.svg`, `ovh.svg`, `whatsapp.svg`, `imessage.svg`, `gmail.svg`,
    `qwen.svg`, `deepseek.svg`, `openrouter.svg`. À copier dans `public/tools/`.

## 1. Ordre des sections après la passe

hero → en production (inchangé) → ce qui change (inchangé) → parcours → services →
partenaires → références → **architecture** (nouvelle) → fondateur et contact.

- **Supprimer la section garde-fous** (`#confiance` / `#safeguards`) en entier, ses textes
  dans `single-page-copy.ts` et son CSS mort. Paul : « elle sert dans une slide, pas sur un
  site web ; elle perd tout le monde ».
- Nouvelle section `id="architecture"` (même id en FR et en EN).
- Navigation (six ancres) : En production · Le parcours · Services · L'équipe · Références ·
  Contact / In production · The path · Services · The team · References · Contact.
- `LanguageLink.tsx` : retirer `confiance`.
- `next.config.ts` : `/standard` et `/systems` redirigent en 308 vers `/#architecture` et
  `/fr#architecture` (requête conservée, un seul saut).
- `scripts/generate-llms.mjs` : remplacer « safeguards and hosting » par « how data travels
  through our systems », puis régénérer.

## 2. Hero : l'ontologie raconte trois histoires

Reprendre `hero.js` (fonction `hero`) en composant React `OntologyHero` (client), qui remplace
`OntologyStory` et le SVG actuel. Sans JS et en mouvement réduit, le rendu serveur montre l'état
final : les trois résultats affichés, la légende de la première histoire, aucun jeton.

- SVG `viewBox="0 0 1080 360"`, `aria-hidden="true"`. Couches et positions exactement celles de
  `hero.js` :
  - données (y 60) : E-mails, Clients, Stocks, Factures, Commandes ;
  - règles (y 175) : Validation, Droits, Seuils, Échéances ;
  - agents (y 300) : Commercial, Relances, ADV, Stock, Compta, Pilotage.
- Seize arêtes d'ambiance, plus cinq courbes pointillées « les agents se parlent » (`talk`).
  Une pulsation SMIL par arête, uniquement avec mouvement.
- Colonne « Résultats » (x 820) de trois cases 250×50. La case qui vient de se remplir est rose
  (`--rose`, texte `--ink`) ; les précédentes restent remplies, sans rose. C'est l'exception
  validée par Paul le 27/10 : bouton rose et résultat rose dans le hero.
- Trois histoires en boucle. Le jeton carré suit la route avec son étiquette, chaque agent
  traversé passe en état `busy` 900 ms, la légende sous le SVG (`p.ontocap`, `aria-live="off"`)
  change à chaque histoire. Durée 4,2 s par trajet, 1,6 s entre deux histoires, 3,2 s avant de
  recommencer. `requestAnimationFrame` et minuteurs nettoyés au démontage.
- Garder la ligne Clive Humby sous la légende.
- **Réduire le vide entre le hero et « Nos agents travaillent déjà »** : `padding-bottom` du hero
  à 56px et `padding-top` de la section suivante à 72px (valeurs de la maquette). La taille du
  H1 et le style des boutons de la prod ne changent pas.

| FR | EN |
|---|---|
| Vos données · Vos règles · Vos agents · Résultats | Your data · Your rules · Your agents · Results |
| E-mails · Clients · Stocks · Factures · Commandes | E-mails · Customers · Stock · Invoices · Orders |
| Validation · Droits · Seuils · Échéances | Approval · Permissions · Thresholds · Deadlines |
| Commercial · Relances · ADV · Stock · Compta · Pilotage | Sales · Follow-ups · Order desk · Inventory · Accounting · Reporting |
| E-mail client → Relance prête | Client e-mail → Follow-up ready |
| Un client écrit. L'agent commercial le reconnaît, l'agent de relance prépare la réponse. | A client writes. The sales agent recognizes them; the follow-up agent drafts the reply. |
| Stock bas → Commande fournisseur prête | Low stock → Supplier order ready |
| Un article passe sous son seuil. L'agent de stock alerte l'administration des ventes, qui prépare la commande. | An item drops below its threshold. The inventory agent alerts the order desk, which prepares the order. |
| Facture échue → Trésorerie à jour | Invoice due → Cash position updated |
| Une facture arrive à échéance. L'agent comptable la rapproche, le tableau de pilotage se met à jour. | An invoice falls due. The accounting agent matches it, and the reporting dashboard updates. |

## 3. Parcours : un humain et son agent marchent

Composant client `PathWalker` d'après la fonction `walker` de `hero.js`, placé entre le titre et
les trois étapes. SVG `viewBox="0 0 1080 130"`, `aria-hidden`.

- Un humain marche de gauche à droite et s'arrête à chaque étape. Étape 1 : un livre s'ouvre.
  Étape 2 : des barres montent. Étape 3 : des blocs s'empilent. L'agent le rejoint après
  l'étape 1 et marche avec lui. Séquence et durées de `seq` dans `hero.js`.
- La séquence démarre quand la section entre à l'écran (voir §8). État final sans JS et en
  mouvement réduit : humain à l'étape 3, agent présent, les trois décors visibles.
- La ligne « Déjà équipés ? … » reste.

## 4. Services : douze services, une tâche qui avance

Remplacer les six cases par les douze de la maquette. Chaque case contient le nom, la phrase,
puis une tâche (libellé, compteur), une barre qui se remplit, et « Prêt à relire ». Les cases
s'animent en décalé quand la section entre à l'écran ; l'état final est visible sans JS.
**Retirer la ligne « Exemples illustratifs »** sous la grille (Paul). La retirer aussi de
`approvedStatuses` dans `tests/anti-slop-copy.spec.ts` seulement si plus aucune page ne
l'affiche. « Exemple illustratif » reste dans « Ce que l'IA change ».

| Service | Phrase | Tâche | Compteur |
|---|---|---|---|
| Direction / Leadership | (inchangée) | Comité du lundi / Monday committee | 3 décisions / 3 decisions |
| Finance | (inchangée) | Relevé et grand livre / Bank statement and ledger | 2 écarts / 2 discrepancies |
| Commercial / Sales | (inchangée) | Secteur et région / Sector and region | 12 entreprises / 12 companies |
| Administration des ventes / Sales administration | Elle saisit les commandes reçues par e-mail. / It enters orders received by e-mail. | Commandes du jour / Today's orders | 8 saisies / 8 entered |
| Achats / Purchasing | Elle compare les offres des fournisseurs. / It compares supplier offers. | Trois devis / Three quotes | 1 recommandation / 1 recommendation |
| Logistique / Logistics | Elle prévient quand une livraison prend du retard. / It warns you when a delivery runs late. | Expéditions du jour / Today's shipments | 2 retards / 2 delays |
| Production | Elle prépare le planning de la semaine. / It prepares the week's schedule. | Ordres de fabrication / Work orders | 5 lignes / 5 lines |
| Qualité / Quality | Elle classe les réclamations par cause. / It sorts complaints by cause. | Réclamations du mois / This month's complaints | 4 causes / 4 causes |
| Service client / Customer service | Elle propose une réponse à chaque demande. / It suggests a reply to each request. | Demandes du jour / Today's requests | 9 réponses / 9 replies |
| Ressources humaines / Human resources | (inchangée) | Nouvel arrivant / New hire | 1 pièce à fournir / 1 document missing |
| Marketing | (inchangée) | Annonce produit / Product launch | 4 versions / 4 versions |
| Juridique / Legal | (inchangée) | Contrat / Contract | 12 clauses / 12 clauses |

« Prêt à relire » / « Ready to review ». Grille de 4 colonnes au-dessus de 1100px, 2 colonnes
au-dessus de 600px, 1 colonne en dessous.

## 5. Partenaires : l'équipe se compose

- Garder les sept cases. Ajouter un surlignage séquentiel (bordure canard 2px, une case à la
  fois) et la légende « Une équipe composée pour chaque diagnostic » / « A team assembled for
  each diagnosis » (classe `teamcap` de la maquette).
- **Supprimer** la ligne « À l'international : … Brésil … Italie … Cameroun » et sa traduction
  (Paul : « on s'en fout »).

## 6. Références : le bandeau de logos

Décision de Paul, 27/10/2026 : les logos des cinq clients publiables s'affichent sur le site.
**Aucun client n'a donné d'accord écrit** ; l'affichage repose sur la seule décision de Paul,
qui en porte le risque. Le contrat `publicationLogo` reste en place et s'appuie sur cette
décision :

- dans `src/lib/registry/preuves.ts`, pour Laparra, Clevery, Forexpert, Joone et SNCF :
  `logo: { autorise: true, fichier: "/clients/<id>.png|svg", source: "<origine ci-dessous>",
  accord: { qui: "Paul Larmaraud, décision d'affichage sans accord écrit du client", date: "2026-10-27" } }` ;
- sources : `https://www.laparra.fr` (en-tête du site, relevé le 27/10/2026), `https://www.cleveryavocats.fr`,
  `https://www.forexpert-formation.com` (pas forexpert.fr, qui appartient à un expert forestier),
  `https://www.joone.fr`, et SNCF par `simple-icons@15.16.1` (`icons/sncf.svg`) ;
- écrire ces provenances dans `public/clients/SOURCES.md` ;
- le MIT reste sans logo.

Rendu (maquette, `logos.py`) :

- Un bandeau qui défile (`28s linear infinite`, pause au survol), **sans masque dégradé**. Les
  logos sont des `span role="img" aria-label="<nom>"` en `mask-image`, fond `var(--ink)`. La
  seconde copie, nécessaire à la boucle, est en `aria-hidden="true"`.
- Hauteurs : 56px, et 64px pour Forexpert et SNCF. Largeur tirée du ratio du fichier.
- Un client sans logo autorisé n'apparaît pas dans le bandeau. Un client sans permission
  n'apparaît nulle part (comportement actuel conservé).
- En mouvement réduit : pas de défilement, une seule copie, logos sur une ligne qui passe à la ligne.
- Sous le bandeau, les cinq lignes « nom en gras + phrase » (`reflines`, phrases actuelles
  inchangées).
- La grille d'outils et le titre « Les outils avec lesquels nous construisons » quittent cette
  section : ils sont remplacés par §7.

## 7. Architecture : le trajet d'une donnée

Section `#architecture`, d'après `arch2.py` et la maquette (`.flowmap`, `.builders`).

Titre : « Le trajet d'une donnée, **de vos sources au résultat.** » / « How your data travels,
**from source to result.** »

Cinq cartes numérotées, reliées par un rail où avance un carré canard. La carte active reçoit
une bordure canard, à tour de rôle, sur un cycle de 12 s. Dans la carte 5, les trois résultats
passent au rose l'un après l'autre : c'est le seul rose de cet écran.

| # | FR | EN | Puces |
|---|---|---|---|
| 1 | Vos sources — Là où l'information arrive aujourd'hui. | Your sources — Where information reaches you today. | E-mails (gmail), ERP et CRM / ERP and CRM, Fichiers / Files, WhatsApp |
| 2 | Votre base — Une seule base, chez vous ou chez un hébergeur. | Your database — One database, on your premises or with a host. | Supabase, OVH |
| 3 | Les agents — Ils lisent, appliquent vos règles et préparent le travail. | The agents — They read, apply your rules and prepare the work. | Claude, ChatGPT, Gemini, Mistral, Qwen, DeepSeek, via OpenRouter |
| 4 | Vous validez — Là où vous êtes déjà. | You approve — Where you already are. | Votre application / Your own app, WhatsApp, iMessage, E-mail, Telegram |
| 5 | Le résultat — Le travail est fait. | The result — The work is done. | Relance envoyée / Follow-up sent, Commande saisie / Order entered, Tableau à jour / Dashboard updated |

(Le tiret ci-dessus sépare titre et phrase dans ce tableau seulement ; il ne va pas sur le site.)

- Icônes des puces en `mask-image`, fond `currentColor`, 16px, comme `.tools .ic` aujourd'hui.
  Puce sans icône : petit carré canard.
- Ligne « Nous construisons avec » / « We build with » : Claude Code, Codex, OpenCode, GitHub,
  Vercel, n8n.
- Garder la mention légale des marques sous la section, mot pour mot.
- Sous 960px : cartes en une colonne, sans rail.

## 8. Fondateur et contact

- Titre : « Paul Larmaraud, fondateur de Parrit.ai » **sans point final** (FR et EN :
  « founder of Parrit.ai »).
- **Supprimer** la ligne « Basé dans la métropole lilloise, il travaille aussi à Paris. » et sa
  traduction, ainsi que son CSS `.local-note`.
- Remplacer le `<details>` « Aucun créneau ne convient ? Laissez votre e-mail. » par un bloc
  visible sous le calendrier : titre « Vous préférez écrire ? » / « Prefer to write? », phrase
  « Laissez votre adresse, nous vous répondons nous-mêmes. » / « Leave your address and we will
  reply ourselves. », champ e-mail visible et bouton **« Être recontacté » / « Contact me »**.
  Le bouton reste `ghost` (repli neutre, AGENTS.md). Même `QuickCapture`, même endpoint
  `/api/interet`, même charge utile. Ajouter une variante d'affichage (titre, phrase et libellé
  du bouton), sans dupliquer le composant.
- Le calendrier Cal.com et son texte ne changent pas.

## 9. Lisibilité (règles appliquées à toute la page)

- Aucun texte HTML visible sous 15px calculés à 1440 et à 390 de large. Contenu 16 à 18px.
- Un seul point animé principal par écran ; toute animation démarre quand sa section entre à
  l'écran. Le composant client `RevealOnView` pose `data-anim="armed"` au montage, puis
  `data-anim="in"` à l'intersection (seuil 0,25). Les états de départ des animations ne
  s'appliquent que sous `[data-anim="armed"]` : sans JS, tout est visible dans son état final.
- `prefers-reduced-motion: reduce` : aucune animation, état final partout.
- L'information clé est au début des titres ; un seul bouton `exec` par écran.

## 10. Charte (inchangée, rappel)

Aucune couleur littérale (`rgba(...)` de la maquette compris : utiliser `var(--line)` ou un
jeton existant), radius 0 hors téléphones, aucune ombre, aucun dégradé, General Sans seule.

## 11. Tests et documents à mettre à jour

- `tests/single-page.test.mjs` et `tests/single-page.spec.ts` : nouvel ordre des ancres,
  redirections `standard`/`systems` → `architecture`, structure du hero (5 données, 4 règles,
  6 agents, 3 cases de résultat, légende), absence de « Brésil », « Cameroun », « métropole
  lilloise » et de section garde-fous, 12 services, bandeau de logos (5 `role="img"` lisibles et
  copie `aria-hidden`), fichiers de logos servis en 200, titre fondateur sans point, bouton
  « Être recontacté » visible sans ouvrir de `<details>`, état final en mouvement réduit,
  aucune police calculée sous 15px.
- Le test « client logos fail closed » garde ses cas négatifs sur `publicationLogo`. Il vérifie
  désormais que chaque client publiable porte fichier, source et accord daté, et qu'un client
  sans permission ne rend ni nom ni logo.
- Le déni réseau global reste en place ; aucun test ne charge un logo externe.
- `AGENTS.md` : remplacer « Aucun logo ajouté dans ce lot » et « Logos clients et MIT éteints :
  accord nominatif daté… Aucun logo de client téléchargé » par la décision de Paul du 27/10/2026
  (logos des cinq clients publiables affichés sans accord écrit des clients, provenance dans
  `public/clients/SOURCES.md`, MIT sans logo). Mettre à jour l'ordre des sections (sans
  garde-fous, avec architecture).
- `public/tools/SOURCES.md` : ajouter les huit icônes (simple-icons@15.16.1 : mistralai, ovh,
  whatsapp, imessage, gmail ; @lobehub/icons-static-svg@1.60.0 : qwen, deepseek, openrouter).

## 12. Hors périmètre

Pas de prix. Pas de changement Cal.com. Aucune modification des trois téléphones ni de « Ce que
l'IA change ». Ne jamais nommer d'autre client. Aucun appel réseau sortant dans les tests.

## 13. Batterie (doit être verte avant la PR)

`npm ci && npm run lint && npm run build && npm test && npm run qa:brand:rev01 && npm run qa:claims:rev01 && npm run test:brand-os`,
puis `npx next start -p 3210` et `QA_BASE_URL=http://127.0.0.1:3210 npm run qa:network:rev01`.

## 14. Amendement du 27/10, 13 h : un hero plus vivant (Paul)

Paul : « Relance prête » ne doit pas être le seul résultat, et l'animation doit être plus
vivante. La maquette `hero.js` a été mise à jour (fonction `hero`, à partir de « nœuds par
nom ») ; elle fait foi et remplace le §2 sur ces points :

- **Six histoires**, lancées toutes les 2,3 s, chacune parcourue en 4,2 s : il y a donc souvent
  deux jetons en route en même temps.
- Chaque trajet **s'éclaire** : un tracé blanc (`trail`, 2,5px) se dessine derrière le jeton,
  puis s'efface en 0,9 s. Les nœuds traversés grossissent un instant (`lit`) et les agents
  traversés font un petit saut (`busy`).
- La colonne **Résultats devient un fil** de quatre cases : le nouveau résultat entre en haut,
  en rose (le seul rose du schéma) ; les précédents descendent et s'estompent, le cinquième sort.
- La légende suit la dernière histoire lancée.
- Sans JS et en mouvement réduit : les quatre premiers résultats affichés dans le fil, la
  légende de la première histoire, ni jeton ni tracé.

| FR | EN |
|---|---|
| Bon de commande → Commande saisie | Purchase order → Order entered |
| Un client envoie son bon de commande. L'administration des ventes le saisit, vous vérifiez. | A client sends a purchase order. The order desk enters it; you check it. |
| Demande de devis → Devis à valider | Quote request → Quote to approve |
| Un prospect demande un devis. L'agent commercial le prépare selon vos conditions, vous le validez. | A prospect asks for a quote. The sales agent prepares it on your terms; you approve it. |
| Vendredi soir → Rapport de la semaine prêt | Friday evening → Weekly report ready |
| Le vendredi, l'agent de pilotage rassemble commandes et échéances dans un rapport. | On Fridays, the reporting agent gathers orders and deadlines into a report. |

Routes : Bon de commande = E-mails, Commandes, Droits, ADV ; Demande de devis = Clients,
Commandes, Validation, Commercial ; Vendredi soir = Commandes, Échéances, Pilotage.
Les trois premières histoires restent celles du §2. Le fond des cases utilise des jetons
(aucun `rgba`).
