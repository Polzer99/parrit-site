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

Les deux arbitrages qui étaient ouverts ici le 31/07 au matin ont été tranchés par Paul dans la journée : interlignage display à `1.08` (ADR-013) et rouge de titre sur segment porteur (ADR-012). Il ne reste rien de provisoire dans le canon lui-même.

## Ce qui doit être migré — dette chiffrée sur `origin/main`

Mesures faites le 31/07 sur `origin/main` et sur le CSS réellement servi par `parrit.ai`.

| Écart | Volume | Règle violée | Difficulté |
|---|---:|---|---|
| **Fond `body` = photo `paysage-lo-y-wa.jpg` + dégradé `#F5F8FF`** | 1 | Structural Integrity + palette périmée + zéro dégradé | **visible en prod · retrait décidé, voir ci-dessous** |
| Tokens `--shadow` / `--shadow-sm` / `--shadow-lg` déclarés dans `:root` | 3 | aucun token d'ombre n'existe | faible |
| `box-shadow` non nulle | 4 | `shadow.none` | faible |
| Alias redondants dans `:root` (5 noms pour le rouge, 5 pour le filet, 4 pour l'encre sombre) | ~20 | nommage sémantique | moyenne |
| Hex hors palette dans `src/**` | 37 valeurs distinctes | palette verrouillée | moyenne |
| dont `#FFFFFF` (blanc pur) | 41 occurrences | le papier est `#FFFDFA` | moyenne |
| dont périmés `#AA0003` · `#161616` · `#F5F8FF` | 1 · 4 · 1 | palette verrouillée | faible |
| Grain papier à **1 couche** (`opacity .035`) au lieu de 3 | 1 | grain 3 couches | faible |
| `--font-heading` non exposé en token sémantique | — | nommage | faible |

**Correction à l'audit précédent.** `brand/10_SITE_AUDIT_CURRENT.md` annonce 57 rayons non nuls, 30 ombres et 61 hex périmés. Ces chiffres ont été mesurés sur la branche locale `feat/pivot-collaborateurs-souverains`, qui est **72 commits derrière `origin/main`**. Sur la production réelle : 53 `border-radius: 0`, seulement 2 `50 %` et 1 `999px` (sceau, avatar, pastille — autorisés), 4 ombres, 6 hex périmés. **La dette de rayons est déjà résorbée.** Le vrai point dur restant est le fond photo du `body`.

## Décision irréversible : le fond photo du `body` est obsolète

**Tranché par Paul le 31/07/2026. Non appliqué dans cette tranche, volontairement.**

La production sert aujourd'hui, sur toutes les pages, un `body` dont le fond est une photographie de paysage (`/brand/paysage-lo-y-wa.jpg`) en `background-attachment: fixed`, recouverte d'un dégradé `#F5F8FF`, couleur périmée.

Trois règles sont violées en même temps : un média narratif est attaché **globalement** au `body`, donc la page dépend d'une image pour exister ; la couleur du dégradé n'appartient plus à la palette ; et le système interdit tout dégradé décoratif.

**Ce qui est décidé, et ne se rediscute pas :**

- la photo de fond **est supprimée** lors de la migration de la homepage ;
- le fond cible est le **papier `#FFFDFA`**, le **grain trois couches** et les **contrastes canoniques**, rien d'autre ;
- **aucun média narratif ne peut être attaché globalement au `body`**, sur aucune page, jamais. Un média appartient à une section, porte `data-layer="expressive"`, et disparaît au Structural Integrity Test.

**Ce qui n'est pas fait ici, et pourquoi.** Le retrait se voit immédiatement en production sur toutes les pages à la fois. Il appartient donc à la tranche homepage, avec captures avant/après aux quatre largeurs et un rollback d'une ligne, pas à une tranche de fondations qui ne touche aucune page publique.

## 🔴 Bloquant découvert le 31/07 : `brand/` n'est pas versionné

Les **11 documents du Brand OS v0.2.1**, écrits le 30/07 et cités partout comme doctrine détaillée, **n'ont jamais été commités**. `git ls-files brand/` renvoie zéro. Ils existent uniquement en fichiers non suivis dans le worktree `~/parrit-site`, sur la branche `feat/pivot-collaborateurs-souverains`.

Conséquences immédiates :

- **Ils ne survivent pas à un `git clean`, à un changement de branche mal maîtrisé, ni à une panne de disque.** C'est le canon de marque de toute l'entreprise, et il tient sur des fichiers non sauvegardés.
- Les deux corrections décidées le 31/07 (Arpona dans `brand/01_DESIGN_TOKENS.md`, `fileKey` dans `brand/07_FIGMA_SYNC.md`) **n'ont pas pu être appliquées** : les fichiers ne sont pas dans ce dépôt.
- Toute référence à `brand/` depuis `docs/design-system/` pointe vers quelque chose qui n'existe pas pour un autre développeur, ni pour la CI.

Le contenu des deux corrections est intégralement consigné ici, donc rien n'est perdu : ADR-007 porte la correction Arpona avec ses preuves, `11_FIGMA_CODE_MAPPING.md` porte le `fileKey` `J8hieoaq5XwOxqtQJbiP0A` et l'état réel du Figma.

**Action attendue de Paul :** commiter `brand/` (et les modifications associées de `AGENTS.md`, `DESIGN-SYSTEM.md`, `BRAND.md`, `design-source/DA-TOKENS-EXTRACTED.md`) depuis son worktree, puis appliquer les deux corrections. Tant que ce n'est pas fait, `docs/design-system/` est le **seul** canon réellement versionné.

## Ce qui n'a pas pu être audité

- **Aucun design system Parrit n'existe dans Figma.** Le fichier `Direction-artistique` contient les frames de la DA et **3 variables de couleur**. `search_design_system` ne renvoie aucun composant, aucune variable, aucun style Parrit. Les seules bibliothèques attachées sont Material 3, Simple Design System et les kits Apple. La cible décrite dans `brand/07_FIGMA_SYNC.md` (collections `Primitives/Color`, `Semantic/Light`, pages `01 · Foundations`…) **n'existe pas**.
- `design-source/figma-template/` est référencé par `brand/01_DESIGN_TOKENS.md` comme « vérité pixel » : **le dossier n'existe pas dans le repository.** Référence morte.
- Safari : la QA tourne sur Chromium seul. Le test typographique français n'a pas été rejoué sur WebKit.
- `scripts/contrast-audit.py` n'a pas été exécuté sur la page specimen.

## Prochaine tranche — `HOMEPAGE-LEVEL0-V1`

**Spécifiée, non implémentée.** Aucune page publique n'est modifiée tant que cette tranche n'est pas ouverte explicitement.

### Périmètre strict

- **`/fr` uniquement.** Les trois autres langues ne bougent pas.
- **Derrière un feature flag**, avec bascule serveur et exposition contrôlée.
- Deux composants seulement : **`HeroLevel0`** et **`ProofRailLevel0`**.
- **Suppression de la double porte commerciale** : le visiteur ne choisit plus une offre avant d'avoir vu une preuve.
- **Un seul CTA principal**, tourné vers le workflow et non vers l'offre.
- **Fond structurel sans photo globale** : papier, grain trois couches, contrastes canoniques. Application de la décision ci-dessus.
- **Aucune modification du reste de la homepage.** Les sections suivantes restent en l'état, y compris si elles jurent avec la nouvelle tête de page. C'est le prix d'une tranche fine, et c'est assumé.
- **Mesures analytics définies et instrumentées AVANT le déploiement**, pas après.

### Critères de succès

| Critère | Vérification |
|---|---|
| Promesse comprise en moins de cinq secondes | test à froid sur trois personnes hors contexte |
| CTA principal identifiable immédiatement | une seule action primaire visible sans scroll |
| Preuve visible sans scroll excessif | le premier cas `input → output` atteint en moins d'un écran et demi |
| Page reconnaissable sans image | Structural Integrity Test, `ds-specimen-qa.mjs` |
| Aucune régression responsive | 375, 768, 1024, 1440 px, captures avant/après |
| Rollback immédiat possible | bascule du flag, sans redéploiement |

### Ce qui reste ouvert après cette tranche

1. Neutraliser les 3 tokens d'ombre et les 4 `box-shadow` de `globals.css`.
2. Migrer les alias `:root` vers les noms sémantiques, à rendu constant.
3. Repointer `AGENTS.md` vers `docs/design-system/` (ADR-010).
4. Créer les variables et composants dans Figma, ou acter que le repository est seul maître et que Figma reste une surface de dessin.
