# CODEX SPEC — 08/11/2026 — Headline « matière première »

Niveau de risque : faible (copie du haut de page, aucune donnée, aucun prix, aucun envoi).

## Décision

Paul, 08/11/2026 : « il faudrait changer la headline et mettre "Votre expertise est la matière première, nous la mettons au travail" ».

C'est le titre d'avant le 02/11 (voir `docs/CODEX-SPEC-2026-11-02-langue-metier-et-referencement.md`, lot 1). La phrase claire « Nous formons vos équipes à l'IA et construisons les outils qui leur manquent. » ne disparaît pas : elle descend en sous-titre, pour que le visiteur comprenne l'offre en une ligne.

## Changements (texte exact)

### `src/system/components/SinglePage.tsx` (hero) et `src/system/single-page-copy.ts` (traduction EN)

| Élément | Avant | Après (FR) | Après (EN) |
|---|---|---|---|
| H1, partie normale | Nous formons vos équipes à l'IA | Votre expertise est la matière première. | Your expertise is the raw material. |
| H1, partie en gras (`<b>`) | et construisons les outils qui leur manquent. | Nous la mettons au travail. | We put it to work. |
| Sous-titre (`.sub p`) | Réponses aux clients, relances, devis, comptes rendus : l'IA prépare, vos équipes relisent et décident. | Nous formons vos équipes à l'IA et construisons les outils qui leur manquent. | We train your teams in AI and build the tools they need. |

Le bouton « Parler d'un projet » ne change pas. Ajouter les nouvelles clés dans `SINGLE_PAGE_EN` ; retirer les clés devenues inutilisées seulement si aucun autre composant ne les lit (vérifier par recherche).

### `src/app/opengraph-image.tsx`

Aligner l'image de partage sur le nouveau H1 : `alt` = « Parrit.ai · Votre expertise est la matière première. Nous la mettons au travail. » et même découpage (partie normale / partie en gras).

### `TRUTH.md` et `AGENTS.md`

Remplacer la ligne du H1 et le bloc du hero par le nouveau texte, avec la mention « décision de Paul du 08/11/2026 ». Ne rien changer d'autre dans ces fichiers.

## Hors périmètre (ne pas toucher)

- Balise `<title>`, meta description, `public/llms.txt`, `scripts/generate-llms.mjs`, données structurées : ils restent descriptifs (« Formation à l'IA et outils sur mesure… ») pour le référencement.
- Couleurs, polices, mise en page, animations, autres sections.
- Les docs historiques sous `docs/site-v1/` et les specs passées.

## Tests

- Mettre à jour les tests qui vérifient le texte du H1 ou du sous-titre (FR et EN).
- Batterie : `npm ci --silent && npm run lint && npm run build -- --webpack && npm test`, verte.
- Ne pas committer les PNG réécrits sous `.codex-handoffs/brand-os-p1/after/` (`git restore`), ni ce fichier de spec copié dans `tmp/`.

## Preuve attendue

Captures FR et EN du haut de page (desktop et mobile) : le H1 tient sur l'écran sans débordement, le sous-titre est lisible, le bouton est visible sans défiler.
