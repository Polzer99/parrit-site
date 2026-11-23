# Spec : une réalisation montrée, un métier dit, un sélecteur resserré (23/11/2026)

Décision de Paul du 23/11/2026, après lecture de l'étude « Une direction plus forte pour Parrit.ai » :
« Ok lançons les réalisations, Laparra. On peut montrer la réalisation. Yes, on peut lancer cette PR. »

Niveau de risque attendu : moyen (code ordinaire de l'accueil, texte public). `src/system/pages/legal.tsx` n'est pas touché.

## Ce qui change sur l'accueil, et rien d'autre

1. **Une phrase de métier sous le titre du héros.** Classe `hero-metier`, entre le `h1` et le formulaire « Je veux ».
2. **Une ligne sur les 15 minutes sous le bouton du héros.** Classe `hero-note`, dans `.hero-intro`, après `.actions`. Elle ne pousse pas le bouton.
3. **Le sélecteur passe de 17 besoins à 7**, dans les trois mêmes groupes, sans changer un identifiant ni un libellé.
4. **Une section « réalisation »** entre les logos des clients et les offres : un écran réel de l'outil livré à un grossiste de Rungis, sur un jeu de données fictif.

Ne change pas : le titre du héros, le libellé unique « Prendre rendez-vous », le nombre de boutons (deux dans `main`), le menu, la section des partenaires et sa carte « Chercheurs du MIT » (à trancher par Paul, hors de cette PR), les pages d'offre, la page de rendez-vous, les mentions légales.

## Les textes : aucune phrase nouvelle en français

Le rédacteur OpenAI (`redaction-openai`) ne répond plus depuis le 22/11/2026 (forfait vide jusqu'au 26/11, 6 h 10). Cette PR n'emploie donc que des phrases qui existent déjà.

| Emplacement | Français | Origine |
|---|---|---|
| `hero-metier` | Des audits pour choisir où agir. Des logiciels conçus autour de votre métier. | Étude du 23/11, citée mot pour mot à Paul, qui a répondu oui |
| `hero-note` | 15 minutes pour présenter votre besoin et parler de ce qui est réalisable. | Étude du 23/11, mot pour mot. Le site promet déjà les 15 minutes dans ses questions |
| étiquette de la section | Chez un client | `single-page-copy.ts`, déjà traduite |
| titre de la section | Votre façon de travailler devient un logiciel. | `single-page-copy.ts`, déjà traduite |
| paragraphe | Un grossiste de Rungis pilote son activité en parlant à son assistant. Chacun voit les mêmes informations, à jour. | Deux phrases de `single-page-copy.ts`, déjà traduites |
| légende de l'écran | Les données affichées sont fictives. | Seconde phrase d'une légende de `single-page-copy.ts` |

**Trois chaînes provisoires, à faire reprendre par le rédacteur OpenAI à partir du 26/11** (elles sont réunies dans `REALISATION_PROVISOIRE` avec ce commentaire) : la traduction anglaise des deux lignes de l'étude, et le texte alternatif de l'image dans les deux langues.

- EN `hero-metier` : « Audits to decide where to act. Software built around your business. »
- EN `hero-note` : « 15 minutes to present your need and discuss what is feasible. »
- Texte alternatif : « Tableau de bord des ventes de l'outil, sur des données fictives. » / « The tool's sales dashboard, shown with fictitious data. »

## Le client n'est pas nommé dans la section

La section dit « un grossiste de Rungis », comme le site le fait déjà. Le logo de Laparra reste où il est, dans la bande des clients. Raisons : règle du 16/11/2026 (« ne jamais nommer Laparra dans un support », go-to-market de l'ERP) et matrice des preuves du site du 15/11. Nommer le client dans la section est une ligne à changer si Paul le décide.

Aucun chiffre de gain, aucun résultat commercial attribué à l'outil.

## L'écran

- Source : `eric-godard-laparra/2026-11-partenariat-crm-rungis/SOURCE/v3/assets/captures-vente/ventes_dash.png` (2390 × 1400), capture réelle du tableau de bord de l'outil sur un jeu de données fictif, faite pour le deck de vente du 08/11/2026. L'image porte elle-même la mention « Démonstration · données fictives ». Fonction déclarée en service dans le deck de vente du 16/11.
- Fichiers servis : `public/realisations/pilotage-ventes-800.webp`, `pilotage-ventes-1600.webp`, et les mêmes en `.avif`. Métadonnées retirées.
- Rendu : `figure.realisation-window` (cadre d'une fenêtre : filet fin, coins droits, sans ombre, selon le Brand OS), `picture` avec `width`, `height` et `loading="lazy"`, puis `figcaption`. La figure tient dans la hauteur de l'écran à 1440 × 800, 1280 × 720 et 390 × 700 (règle « un bloc = un écran »).
- Registre des preuves : nouvelle entrée `realisation-grossiste` dans `SITE_EVIDENCE` (`src/lib/registry/preuves.ts`), catégorie `client`, sans nom de client, `approved_assets` = les quatre fichiers, `usage_scope` = texte et image, page `home`, décision de Paul du 23/11/2026, revue au 21/02/2027. La section ne s'affiche que si `getSiteEvidence("realisation-grossiste", "home")` répond.

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

Retirés de `HOME_GOALS` : `contenu`, `appels-offres`, `clients-reactives`, `factures`, `comptes-rendus`, `contrats`, `agents`, `developpeurs`, `ia-interne`, `prototype`. Les trois plans du schéma gardent leurs 16 nœuds (48 au total) : le schéma décrit l'entreprise, pas la liste. Un ancien lien `?objectif=<retiré>` ou `source=accueil-<retiré>` retombe sur le premier besoin, comme toute valeur inconnue aujourd'hui.

## La section

- Identifiant de section : `realisation` (fr), `case-study` (en), ajouté à `HOME_SECTION_ORDER` après `references`, à `homeSectionHeadings` et à la table de `home-anchors.ts`.
- Structure : étiquette (`offer-eyebrow`), `h2`, un paragraphe, la figure. Aucun lien, aucun bouton.
- Styles dans `single-page.css`, avec les jetons existants : une taille par niveau de titre, bord gauche commun, rythme 64 / 32 / 16.

## Tests à mettre à jour ou à ajouter

- Compte des besoins 17 → 7 : `tests/accueil-epure.test.mjs`, `tests/langue-metier.test.mjs`, `tests/single-page.test.mjs`, et les specs `accueil-epure.spec.ts`, `single-page.spec.ts`, `stabilite.spec.ts`. Les identifiants retirés employés par les specs (`agents`, `contenu`) sont remplacés par des identifiants gardés.
- Ordre des sections : `tests/brand-os-render.test.mjs` (liste attendue), `public/llms.txt` régénéré, date du plan du site de l'accueil.
- Nouveau test `tests/realisation-accueil.test.mjs` : la section existe dans les deux langues entre les logos et les offres ; elle ne contient ni lien ni bouton ; elle ne nomme aucun client ; l'image a ses dimensions, son texte alternatif et ses quatre fichiers sur le disque ; la section disparaît si la preuve n'est plus accordée ; les deux lignes du héros sont présentes et le bouton reste le seul bouton du héros ; les sept identifiants gardés sont exactement ceux de cette spec.
- `DESIGN.md` et `AI_CONTEXT.md` : une entrée datée.

## Contrôles

`npm test` (Node), `npm run lint`, `npm run build`. Les specs Playwright tournent en CI. Mesure du premier écran à 1440 × 800, 390 × 700 et 375 × 700, avec et sans JavaScript : titre, résultat et bouton entièrement visibles sans défilement.

## Revenir en arrière

Annuler la fusion (`git revert -m 1 <fusion>`) rétablit les 17 besoins et retire la section. Aucune donnée, aucun service externe, aucun réglage n'est touché.
