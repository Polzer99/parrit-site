# Rapport : six logos clients sur une ligne (desktop)

Spec : `docs/CODEX-SPEC-2026-11-13-logos-une-ligne.md`. Décision de Paul du 13/11/2026.
Appliqué le 15/11/2026 par Claude (Codex sans crédit, dérogation active).

## Ce qui change

- `src/system/single-page.css` : à partir de 1100 px de large, le bandeau ne passe plus à la ligne
  (`flex-wrap:nowrap`) et chaque logo peut rétrécir (`flex-shrink:1;min-width:0`). La largeur
  posée en ligne par le composant sert de base : tous les logos rétrécissent dans la même
  proportion, l'écart de 24 px (`--brand-s3`) reste fixe. Commentaire de décision mis à jour.
- Aucun logo n'est plafonné à part : Laparra reste le plus large, dans la même proportion qu'avant.
- En dessous de 1100 px, rien ne change (retour à la ligne, grille à deux colonnes sous 760 px).
- Le composant, `public/clients/`, la liste des clients et les textes ne sont pas touchés.

## Mesures (page `/fr`, Chromium)

| Largeur | Avant (parrit.ai) | Après (local) | Écart minimal | Plus petit logo |
|---|---|---|---|---|
| 1440 px | 2 lignes | 1 ligne | 24 px | 91,4 px (Forexpert) |
| 1100 px | 2 lignes | 1 ligne | 24 px | 87,5 px (Forexpert) |
| 390 px | 3 lignes | 3 lignes, largeurs identiques | sans objet | inchangé |

Réduction : 13 % à 1440 px, 17 % à 1100 px. Le seuil de 1100 px tient, pas besoin de 1200 px.

Captures : `docs/logos-une-ligne/avant-{1440,1100,390}.png` et `apres-{1440,1100,390}.png`.

## Animation

Depuis l'accueil épuré (#388), les logos de l'accueil sont statiques
(`.home-epure .client-logo img {animation:none}`). Les règles du projecteur, de l'échelle 1,08
et de la pause au survol restent en place, non modifiées. L'image garde sa réserve
(`max-width:calc(100% / 1.08)`), donc l'échelle ne déborde pas de la boîte du logo.

## Tests

- `tests/home-visual-layers.test.mjs` : « au plus deux lignes » devient « une ligne à partir de
  1100 px, aucun logo sous 60 px », avec vérification que la règle CSS est présente.
- `tests/single-page.spec.ts` : une seule ligne (centres alignés à 2 px), écart entre voisins
  d'au moins 24 px, chaque logo d'au moins 60 px, largeur 1100 px ajoutée à 1440 et 1280,
  en français et en anglais, avec et sans JavaScript.

## Batterie

| Contrôle | Résultat |
|---|---|
| `npm run lint` | vert |
| `npm run build` | vert |
| `npm run qa:brand:rev01` | vert |
| `npm test` (Node) | 802 réussis, 0 échec |
| Playwright `single-page`, `home-visual-layers`, `intentions`, `accueil-epure` | 262 réussis, 0 échec |

## Retour arrière

Annuler le commit de fusion : les six logos reviennent sur deux lignes, sans autre effet.
