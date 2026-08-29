# CODEX-SPEC 2026-08-29 — Journal : contrat de publication pour le moteur quotidien

## Contexte

Le moteur éditorial quotidien qui publie déjà sur paul-larmaraud.com s'étend à
parrit.ai (ordre Paul, 29/08). Un agent headless rédige un article Journal en
anglais (matière : infrastructure IA, souveraineté des modèles, déploiement,
systèmes d'entreprise) et le publie par les portes machines, sans validation
humaine par article. Le contrat existant (`scripts/publish-journal.mjs`) date de
l'époque `rebuild/rev01` : cette branche n'existe plus, et le script ne sait pas
ingérer un brouillon écrit hors du dépôt. Le worktree appelant du moteur est
toujours un worktree frais créé depuis `origin/main`.

## Travail demandé

### 1. `scripts/journal-gates.mjs` — nouvelles portes, factorisées et testables

Créer ce module qui exporte des fonctions pures (chacune retourne
`{ ok: boolean, motif?: string }`) :

- `gateSlug(slug)` : refuse un slug contenant une date (`\d{4}-\d{2}-\d{2}`) ou
  commençant par `journal-` (leçon paul-larmaraud-landing du 28/08 : URL faible).
- `gateNoms(texte)` : refuse si le texte (front-matter inclus) contient un de
  ces noms — insensible à la casse, **en frontières de mots, jamais en
  sous-chaîne nue** : Joone, Clevery, Lavazza, "Naval Group", "Estée Lauder",
  Hiolle, Toyotomi, Metavisio, Stratera, Rydge, Eficia, TerraCall, SNCF.
  Le motif cite le nom trouvé.
- `gateRepetition(title, description, entreesExistantes)` : similarité Jaccard
  sur les tokens (minuscules, sans ponctuation) du `title` ET de la
  `description` contre chaque entrée existante `{title, description}` ;
  refuse si l'une ou l'autre atteint ≥ 0.6 avec une entrée existante,
  motif = le slug de l'entrée en collision.

### 2. `scripts/publish-journal.mjs` — moderniser le contrat

- **Mode moteur** : accepter en 1er argument SOIT un slug (comportement
  actuel), SOIT un chemin **absolu** vers un fichier `.mdx` hors du dépôt.
  Dans ce cas : valider `gateSlug(basename)` puis copier le fichier vers
  `content/journal/<basename>` AVANT les autres portes.
- Brancher les trois portes de `journal-gates.mjs` après la porte front-matter
  existante (le corps complet passe dans `gateNoms` ; les entrées existantes de
  `content/journal/` alimentent `gateRepetition` — exclure l'article en cours).
- **Corriger la publication** : la branche `rebuild/rev01` n'existe plus ; la
  poussée doit partir de la branche courante vers `main` (refspec `HEAD`).
  Avant le commit : récupérer l'état distant de `main` et échouer proprement
  (message clair) si `HEAD` n'en est pas descendant — le moteur doit alors
  republier depuis un worktree frais.
- Conserver tout le reste à l'identique : portes front-matter / pièges MDX /
  prooflint / build / conformité marque, `--dry-run`, la sonde prod
  (200 + titre), la ligne au registre Content Factory.

### 3. SEO des pages article — seulement si absent

Dans `src/app/(rev01)/journal/[slug]/page.tsx` : vérifier que chaque article a
un `alternates.canonical` et un JSON-LD `BlogPosting` (headline, datePublished,
description, author = Organization Parrit, mainEntityOfPage = l'URL canonique).
Ajouter ce qui manque sans rien changer au rendu visible.

## 4. Tests

- `tests/publish-journal-gates.test.mjs` (exécutable par `node --test`) : cas
  forgés pour CHAQUE porte — slug daté refusé, préfixe `journal-` refusé, slug
  sain accepté, nom client refusé (et un faux positif de sous-chaîne accepté,
  p.ex. « clevernesse » ne déclenche pas Clevery), répétition Jaccard ≥ 0.6
  refusée, titres disjoints acceptés.
- npm script `test:journal` = `node --test tests/publish-journal-gates.test.mjs`.

## Vérifications attendues

`npm run test:journal` vert · `npm run build` vert · `npm run qa:brand:rev01`
vert · démonstration `--dry-run` sur un article existant (aucune écriture git).

## Hors périmètre

- Ne pas toucher `scripts/propose-journal.mjs` (la voie carte Telegram reste
  valable pour les publications déclenchées à la main).
- Ne pas modifier le contenu existant de `content/journal/`.
- Aucune nouvelle dépendance npm.
