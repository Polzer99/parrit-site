# Handoff Codex — site V1, lot 1, version 3 : passe visuelle inspirée de Metalab (26/10/2026)

Writer : Codex · Superviseur : Claude · Décideur : Paul (« reverse-engineer les textures de Metalab en gardant couleurs et polices Parrit.ai »). Repart du commit d05a3b4 (PR #324). **Aucune fusion ni mise en ligne sans validation de Paul.**

Lire : `docs/site-v1/releves/RAPPORT-METALAB.md` (sections 2 et 3, table de transposition T01 à T15), `AGENTS.md` (Brand OS), `docs/site-v1/ETAPE-1-PLAN.md`.

## Principe
On transpose des **techniques**, jamais une composition, un texte, une image ou un code de Metalab. Couleurs, polices et jetons : uniquement ceux du Brand OS déjà présents. **Aucun texte ne change** dans ce lot.

## À faire (seulement les techniques marquées OUI dans le rapport)
1. **Typographie (T01, T03)** : H1 à l'échelle existante (84 px sur ordinateur, comme les tests l'exigent), interligne serré (0,95 à 1), approche négative du canon ; resserrer les paliers dans les nouvelles pages : H1, H2 `--d-m`, corps 18, libellés 16 en IBM Plex Mono. Aucun corps intermédiaire nouveau.
2. **Grammaire de bloc (T04)** : chaque section des nouvelles pages et de l'accueil = libellé mono, une phrase de déclaration, un paragraphe court.
3. **Rythme et grille (T06, T07)** : colonne `max-width: 1160px` existante, 6 colonnes à gouttière `--s3` ; respirations verticales en multiples de `--s8`.
4. **Filets et index (T08)** : H02 (références) et H04 (exemples) en rangées à filet de 1 px, une seule action par rangée, survol en 240 ms maximum (fond ou trait), sans logo.
5. **Rangées numérotées (T11)** : H03 (Observer, Prioriser, Transformer, Mesurer) et H11 (méthode) en rangées numérotées 01 à 04 et 01 à 06 séparées par des filets verticaux, un seul accent.
6. **Régimes alternés (T09, T10)** : alternance `calm` / `ink` / `canard` via les régimes existants ; **un seul éclat rose par écran**.
7. **Statut de preuve (T05)** : dans les cartes H04, le statut (démonstration, réalisé pour le client) devient la rangée de métadonnées en tête de carte, en mono.
8. **Hero** : remplacer les deux boîtes « Aujourd'hui / Demain » par un schéma à filets plus lisible, même contenu, connecteurs VS-CONNECTOR vectoriels, sans boîte décorative.
9. **Mouvement** : révélation par `clip-path` rectangulaire en 600 ms maximum sur les titres de section et le schéma du hero ; contenu entièrement visible sans JavaScript ; **aucun mouvement** sous `prefers-reduced-motion: reduce`. Aucune bibliothèque de défilement, aucun préchargeur, aucune transition de page, aucun curseur remplacé.
10. **Dernier appel (H12)** : trois rangées à filet qui mènent toutes à `/commission` (parler d'un projet, cadrer un sprint, optimiser un système d'agents), avec les libellés déjà présents sur le site.

## Interdits (règles de marque, à ne pas arbitrer seul)
- Aucun grain, trame ou dithering, aucun flou, aucun radius, aucune ombre, aucun dégradé, aucun palier au-delà de 88 px, aucune nouvelle couleur ou police, aucune vidéo, aucun mode `complex`.
- Ne pas agrandir la liste de dette de contraste ; ne pas affaiblir de test.
- Aucun texte modifié ; pages Standard et Manufacture inchangées.

## Contrôles
1. Batterie `npm ci --silent && npm run lint && npm test && npm run build` verte.
2. Claude rejoue sur l'hôte toute la suite Playwright (0 échec) et les captures aux cinq largeurs.
3. Revue visuelle de Claude, puis aperçu Vercel soumis à Paul avec les arbitrages ouverts (grain, flou, radius, palier au-delà de 88 px, vidéo).
