# Handoff : image de partage et icônes de parrit.ai alignées sur la page unique (fond canard)

Date : 27/10/2026. Base : origin/main (après #340). Reprise de la PR #341, fermée pour conflit. Rédigée par Claude, implémentée par Codex (§25).
Niveau de risque : faible (image de partage, icônes, aucun texte de page).

## Constat (Paul, 27/10)

La page unique est en ligne avec sa nouvelle direction (fond canard plein, titre blanc, « Nous allons à la frontière
du possible, puis nous le livrons à nos clients. »). L'image de partage (`src/app/opengraph-image.tsx`) est restée à
l'ancienne version : fond sombre, en anglais, « We turn operational problems into systems that work. » Paul ne veut
plus que Parrit.ai parle de « systèmes » dans son accroche. Les icônes (`icon.png`, `apple-icon.png`, `favicon.ico`)
gardent elles aussi l'ancien fond sombre. Google garde l'ancienne miniature tant que l'adresse de l'image ne change pas.

## Changements, et rien d'autre

1. `src/app/opengraph-image.tsx` (1200 × 630), couleurs par `token()` uniquement :
   - fond `--accent-strong` (canard), texte `--paper2` (blanc), texte secondaire en `--brand-derived-on-canard-2`
     (ou le token d'alias existant qui y mène) ;
   - en haut à gauche, en IBM Plex Mono : `PARRIT.AI · AGENTS ET LOGICIELS D'IA` ; en haut à droite la marque
     `[P.]` existante, point en `--accent-on-dark` (rose) ;
   - au centre, sur deux lignes, la première en graisse normale, la seconde en gras (même geste que le h1 du site) :
     `Nous allons à la frontière du possible,` / `puis nous le livrons à nos clients.`
   - en bas, en IBM Plex Mono : `APPRENDRE · AMÉLIORER · CONSTRUIRE`.
   - `alt` : `Parrit.ai · Nous allons à la frontière du possible, puis nous le livrons à nos clients.`
   - Les polices viennent de `src/og-assets/` ; ajouter la graisse semibold de General Sans si elle n'y est pas
     (copie du fichier déjà présent dans le dépôt ou dans `public/fonts`, jamais téléchargée).
2. Adresse de l'image : l'URL publiée dans `og:image` et `twitter:image` doit changer par rapport à
   `https://parrit.ai/opengraph-image` (paramètre de version `?v=2026-10-27` ou empreinte de contenu ajoutée par Next),
   pour que Google et LinkedIn reprennent l'image. Respecter la contrainte de taille documentée dans
   `docs/CODEX-SPEC-2026-08-27-fix-opengraph-image-edge-limit.md`.
3. Icônes `src/app/icon.png` (512), `src/app/apple-icon.png` (180), `src/app/favicon.ico` (48) : même marque `[P.]`
   en IBM Plex Mono blanc, point rose, sur fond canard plein. Générées par un script reproductible versionné (pas
   d'édition à la main), couleurs lues dans les tokens.
4. Tests : l'image de partage se rend (statut 200, 1200 × 630, pixel du coin = canard) ; son texte ne contient ni
   « systems » ni « systèmes » ; `og:image` de l'accueil FR et EN porte la nouvelle adresse ; les trois icônes ont
   un fond canard.

Aucun autre fichier, aucun texte de page ne change. Ne pas modifier `AI_CONTEXT.md` (un autre chantier y écrit : conflit garanti).

## Vérifications

`npm ci --silent && npm run lint && npm run build && npm test`

## Compte rendu attendu

Fichiers modifiés, résultat de la batterie. Ne pas embarquer de copie de spec dans `tmp/`.
