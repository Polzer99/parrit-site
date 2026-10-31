# Hero : noms des plans lisibles sur téléphone

Relecture de Claude après la fusion de la PR #356 (histoire « Une réclamation qualité arrive »), le 31/10/2026.

## Défaut

Sous 1200 px, le lien allumé `top_recl_rech` (Réclamation vers Recherche documentaire) monte à la verticale et traverse le nom du plan « ONTOLOGIE » (`.onto-layer b`), qui n'a pas de fond. Constaté en production à 390 × 844, histoire 4, étape 4 : le trait passe entre « ONTOLO » et « GIE ».

## Correction attendue

Dans `src/system/single-page.css`, donner au nom du plan (`.single-page .onto-layer b`) un fond `var(--canard)` serré, comme les titres de zone : `background:var(--canard);padding:0 2px;`. Il se pose sur la couleur de la page, donc le trait passe derrière sans que l'on voie de rectangle. Aucun hex, aucune ombre, aucun rayon. Rien d'autre ne change, ni texte, ni position, ni taille.

À partir de 1200 px, le même fond s'applique et ne change rien de visible : les noms des plans sont à droite du schéma, sur le fond de la page.

## Test

Dans `tests/single-page.spec.ts`, à côté des contrôles des libellés et des zones : à 390 × 844 et à 1440 × 800, en FR et en EN, la couleur de fond calculée de chaque `.onto-layer b` visible est égale à celle du fond du hero.

## Documentation

Une ligne dans la section « Hero trois plans » d'`AGENTS.md` : les noms des plans ont, comme les zones, le fond de la page.

## Hors périmètre

Tout le reste. `tests/stabilite.spec.ts` est inchangé, aucun seuil assoupli.
