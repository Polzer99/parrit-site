# Spec : une réalisation montrée, un métier dit, un sélecteur resserré (23/11/2026)

Décision de Paul du 23/11/2026, après lecture d'une étude sur le site :
« Ok lançons les réalisations […] On peut montrer la réalisation. Yes, on peut lancer cette PR. »

Correction de Paul le même jour, PR ouverte : la section présente le produit et son marché, « logiciel pour le marché du négoce ». Elle ne dit ni le métier ni le lieu d'un client.

Niveau de risque : moyen (code ordinaire de l'accueil, texte public). `src/system/pages/legal.tsx` n'est pas touché.

## Ce qui change sur l'accueil, et rien d'autre

1. **Une phrase de métier sous le titre du héros.** Classe `hero-metier`, entre le `h1` et le formulaire « Je veux ». L'écart sous le titre passe de 32 à 16 px ; sur téléphone, l'écart au-dessus du bouton aussi, pour que le premier écran tienne.
2. **Une ligne sur les 15 minutes sous le bouton du héros.** Classe `hero-note`, dans `.hero-intro`, après `.actions`. Elle ne pousse pas le bouton.
3. **Le sélecteur passe de 17 besoins à 7**, dans les trois mêmes groupes, sans changer un identifiant ni un libellé.
4. **Une section « réalisation »** entre les logos des clients et les offres : un écran réel du logiciel, sur un jeu de données fictif.

Ne change pas : le titre du héros, le libellé unique « Prendre rendez-vous », le nombre de boutons (deux dans `main`), le menu, la section des partenaires et sa carte « Chercheurs du MIT » (à trancher par Paul, hors de cette PR), les pages d'offre, la page de rendez-vous, les mentions légales.

## Les textes

Le rédacteur imposé pour tout texte public est indisponible jusqu'au 26/11/2026. Cette PR n'emploie donc que des phrases de l'étude, des phrases déjà en place sur le site, et le libellé dicté par Paul.

| Emplacement | Français | Origine |
|---|---|---|
| `hero-metier` | Des audits pour choisir où agir. Des logiciels conçus autour de votre métier. | Étude du 23/11, citée mot pour mot à Paul, qui a répondu oui |
| `hero-note` | 15 minutes pour présenter votre besoin et parler de ce qui est réalisable. | Étude du 23/11, mot pour mot. Le site promet déjà les 15 minutes dans ses questions |
| étiquette de la section | Logiciel pour le marché du négoce | Dicté par Paul le 23/11/2026 |
| titre de la section | Votre façon de travailler devient un logiciel. | `single-page-copy.ts`, déjà traduit |
| paragraphe | Chacun voit les mêmes informations, à jour. | `single-page-copy.ts`, déjà traduit |
| légende de l'écran | Démonstration, données fictives. | Mention d'état déjà approuvée, dans les deux langues (`tests/anti-slop-copy.spec.ts`) |

**Chaînes provisoires, à faire reprendre par le rédacteur à son retour.** Elles portent le mot « PROVISOIRE » en commentaire dans `src/` :

- EN `hero-metier` : « Audits to decide where to act. Software built around your business. »
- EN `hero-note` : « 15 minutes to present your need and discuss what is feasible. »
- EN de l'étiquette : « Software for trading companies »
- Texte alternatif de l'écran : « Tableau de bord des ventes du logiciel. » / « The software's sales dashboard. »

## Aucun client nommé dans la section

La section ne nomme aucun client et ne dit ni son métier ni son lieu. Son texte n'avance aucun chiffre de gain et n'attribue aucun résultat commercial au logiciel ; les chiffres visibles dans l'écran sont ceux du jeu de données fictif. Les logos des clients restent où ils sont, dans leur bande. La section se lit comme la démonstration d'un produit, pas comme une référence nominative.

## L'écran

- Capture réelle du tableau de bord des ventes du logiciel, prise sur un jeu de données fictif généré pour la démonstration (2390 × 1400). L'image porte elle-même la mention « Démonstration · données fictives ». L'original reste hors du dépôt.
- Fichiers servis : `public/realisations/pilotage-ventes-800.{avif,webp}` et `pilotage-ventes-1600.{avif,webp}`. Métadonnées retirées. Provenance : `public/realisations/SOURCES.md`.
- Rendu : `figure.realisation-window` (cadre d'une fenêtre : filet fin, coins droits, sans ombre, selon le Brand OS), `picture` avec `width`, `height` et `loading="lazy"`, puis `figcaption`. La figure tient dans la hauteur de l'écran à 1440 × 800, 1280 × 720 et 390 × 700 (règle « un bloc = un écran »).
- Registre des preuves : nouvelle entrée `realisation-negoce` dans `SITE_EVIDENCE` (`src/lib/registry/preuves.ts`), catégorie `demonstration` (ni nom ni logo), `approved_assets` = les quatre fichiers, `usage_scope` = texte et image, page `home`, décision de Paul du 23/11/2026, revue au 21/02/2027. La section ne s'affiche que si `getSiteEvidence("realisation-negoce", "home")` répond.

## Le sélecteur : les sept besoins gardés

| Groupe | Identifiant | Libellé |
|---|---|---|
| Faire grandir l'activité | `rendez-vous` | préparer ma prospection |
| | `relances` | relancer mes devis |
| Gagner du temps | `commandes` | saisir mes commandes |
| | `reponses-client` | répondre à mes clients |
| Construire | `logiciel` | construire mon outil |
| | `formation` | prendre l'IA en main |
| | `priorites` | choisir par où commencer |

Retirés de `HOME_GOALS` : `contenu`, `appels-offres`, `clients-reactives`, `factures`, `comptes-rendus`, `contrats`, `agents`, `developpeurs`, `ia-interne`, `prototype`. Les trois plans du schéma gardent leurs 16 nœuds (48 au total) : le schéma décrit l'entreprise, pas la liste. Un ancien lien `?objectif=<retiré>` ou `source=accueil-<retiré>` retombe sur le premier besoin, comme toute valeur inconnue aujourd'hui ; son rendez-vous est alors attribué à ce premier besoin.

Les sept besoins ont été choisis par le rédacteur de cette spec (deux par groupe, plus les trois entrées qui correspondent à ce que le site vend). Paul a validé « quelques entrées », pas cette liste : elle se change en une ligne par besoin.

## La section

- Identifiant de section : `realisation` (fr), `case-study` (en), ajouté à `HOME_SECTION_ORDER` après `references`, à `homeSectionHeadings` et à la table de `home-anchors.ts`. Les partenaires passent du quatrième au cinquième bloc.
- Structure : étiquette (`offer-eyebrow`), `h2`, un paragraphe, la figure. Aucun lien, aucun bouton.
- Styles dans `single-page.css`, avec les jetons existants : une taille par niveau de titre, bord gauche commun, rythme 64 / 32 / 16.

## Contrôles existants qui reçoivent une exception écrite

La phrase exacte de `hero-note` est admise une seule fois sur l'accueil par `tests/brand-os-render.test.mjs` et `tests/anti-slop-copy.spec.ts`, qui refusent toute mention de « 15 minutes » hors FAQ. Toute autre mention tombe toujours.

## Tests à mettre à jour ou à ajouter

- Voisinage de la section des offres : `tests/home-visual-layers.spec.ts`.
- Compte des besoins 17 → 7 : `tests/accueil-epure.test.mjs`, `tests/langue-metier.test.mjs`, `tests/single-page.test.mjs`, et les specs `accueil-epure.spec.ts`, `single-page.spec.ts`, `stabilite.spec.ts`. Les identifiants retirés employés par les specs (`agents`, `contenu`) sont remplacés par des identifiants gardés.
- Ordre et compte des sections (10 → 11) : `tests/brand-os-render.test.mjs`, `tests/parcours-accueil.test.mjs`, `tests/single-page.test.mjs`, `tests/llms-articles.test.mjs`, les specs `parcours-accueil.spec.ts`, `single-page.spec.ts`, `stabilite.spec.ts`, `doctrine-visible.spec.ts` ; `public/llms.txt` régénéré ; date du plan du site de l'accueil.
- Nouveau test `tests/realisation-accueil.test.mjs` : la section existe dans les deux langues entre les logos et les offres ; elle ne contient ni lien ni bouton ; elle ne nomme aucun client et ne dit ni son métier ni son lieu ; l'image a ses dimensions, son texte alternatif, son attribut `sizes` et ses quatre fichiers sur le disque ; la section disparaît si la preuve n'est plus accordée ; les deux lignes du héros sont présentes et le bouton reste le seul bouton du héros ; les sept identifiants gardés sont exactement ceux de cette spec.
- `AGENTS.md`, `AI_CONTEXT.md`, `DESIGN.md`, `TRUTH.md` : une entrée datée.

## Contrôles

`npm test` (Node), `npm run lint`, `npm run build`. Les specs Playwright tournent en CI. Mesure du premier écran à 1440 × 800, 390 × 700 et 375 × 700, avec et sans JavaScript : titre, résultat et bouton entièrement visibles sans défilement.

## Revenir en arrière

Annuler la fusion (`git revert -m 1 <fusion>`) rétablit les 17 besoins et retire la section. Aucune donnée, aucun service externe, aucun réglage n'est touché.
