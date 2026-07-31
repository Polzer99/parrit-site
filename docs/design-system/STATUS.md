# STATUS — design system Parrit.ai

**Au 31 juillet 2026.** Branche `ds/canon-v1`, worktree `parrit-site-ds`, partie de `origin/main`.
**Rien n'est mergé, rien n'est déployé.**

---

## Ce qui existe et fait autorité

| Élément | Emplacement | État |
|---|---|---|
| Source de vérité | `docs/design-system/PARRIT-DESIGN-SYSTEM.md` | **canonique** |
| Tokens techniques | `src/styles/parrit-tokens.css` | **canonique**, additif, non branché sur les pages publiques |
| Primitives | `src/components/ds/primitives.tsx` | **canonique** |
| Niveau 0 | `src/components/ds/level0.tsx` | **canonique** |
| Page specimen | `src/app/design-system/` | **canonique**, noindex |
| QA outillée | `scripts/ds-specimen-qa.mjs` | **canonique**, 4 viewports, sortie non nulle si échec |
| Doctrine détaillée | `brand/` (00 à 10) | **canonique en doctrine**, sauf `01` (voir ci-dessous) |
| Variables Figma | `Direction-artistique`, `J8hieoaq5XwOxqtQJbiP0A` | **3 variables seulement** : `Noire`, `Rouge`, `Blanc` |

## Ce qui reste provisoire

- **`--type-leading-display: 1.05`** — mesuré, valide, mais la marge est inférieure à 1 px. Confort possible à `1.08`. Arbitrage esthétique ouvert (ADR-009).
- **Le rouge sur un segment de titre.** Le Figma canon met « AI agents » en rouge dans le H1. `brand-visual-system/CLAUDE.md` interdit « le rouge utilisé comme simple surlignage de mot ». Les deux se défendent : ici le rouge porte le sujet, pas un mot au hasard. Règle provisoire retenue : **le segment rouge doit être le sujet de la phrase**. À confirmer.

## Ce qui doit être migré — dette chiffrée sur `origin/main`

Mesures faites le 31/07 sur `origin/main` et sur le CSS réellement servi par `parrit.ai`.

| Écart | Volume | Règle violée | Difficulté |
|---|---:|---|---|
| **Fond `body` = photo `paysage-lo-y-wa.jpg` + dégradé `#F5F8FF`** | 1 | Structural Integrity + palette périmée + zéro dégradé | **visible en prod** |
| Tokens `--shadow` / `--shadow-sm` / `--shadow-lg` déclarés dans `:root` | 3 | aucun token d'ombre n'existe | faible |
| `box-shadow` non nulle | 4 | `shadow.none` | faible |
| Alias redondants dans `:root` (5 noms pour le rouge, 5 pour le filet, 4 pour l'encre sombre) | ~20 | nommage sémantique | moyenne |
| Hex hors palette dans `src/**` | 37 valeurs distinctes | palette verrouillée | moyenne |
| dont `#FFFFFF` (blanc pur) | 41 occurrences | le papier est `#FFFDFA` | moyenne |
| dont périmés `#AA0003` · `#161616` · `#F5F8FF` | 1 · 4 · 1 | palette verrouillée | faible |
| Grain papier à **1 couche** (`opacity .035`) au lieu de 3 | 1 | grain 3 couches | faible |
| `--font-heading` non exposé en token sémantique | — | nommage | faible |

**Correction à l'audit précédent.** `brand/10_SITE_AUDIT_CURRENT.md` annonce 57 rayons non nuls, 30 ombres et 61 hex périmés. Ces chiffres ont été mesurés sur la branche locale `feat/pivot-collaborateurs-souverains`, qui est **72 commits derrière `origin/main`**. Sur la production réelle : 53 `border-radius: 0`, seulement 2 `50 %` et 1 `999px` (sceau, avatar, pastille — autorisés), 4 ombres, 6 hex périmés. **La dette de rayons est déjà résorbée.** Le vrai point dur restant est le fond photo du `body`.

## Ce qui n'a pas pu être audité

- **Aucun design system Parrit n'existe dans Figma.** Le fichier `Direction-artistique` contient les frames de la DA et **3 variables de couleur**. `search_design_system` ne renvoie aucun composant, aucune variable, aucun style Parrit. Les seules bibliothèques attachées sont Material 3, Simple Design System et les kits Apple. La cible décrite dans `brand/07_FIGMA_SYNC.md` (collections `Primitives/Color`, `Semantic/Light`, pages `01 · Foundations`…) **n'existe pas**.
- `design-source/figma-template/` est référencé par `brand/01_DESIGN_TOKENS.md` comme « vérité pixel » : **le dossier n'existe pas dans le repository.** Référence morte.
- Safari : la QA tourne sur Chromium seul. Le test typographique français n'a pas été rejoué sur WebKit.
- `scripts/contrast-audit.py` n'a pas été exécuté sur la page specimen.

## Prochaines tranches

1. **Corriger `brand/01_DESIGN_TOKENS.md`** : Arpona en display (ADR-007). Une ligne, zéro risque, arrête la régression à la source.
2. Neutraliser les 3 tokens d'ombre et les 4 `box-shadow`.
3. Remplacer le fond `body` photo + dégradé par crème + grain 3 couches, avec captures avant/après et validation Paul.
4. Migrer les alias `:root` vers les noms sémantiques, à rendu constant.
5. Créer les variables et composants dans Figma, ou acter que le repository est seul maître et que Figma reste une surface de dessin.
