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
| Brand OS, doctrine | `brand/` (00 à 10 + README) | **canonique, versionné le 31/07**, corrections d'import appliquées |
| Variables Figma | `Direction-artistique`, `J8hieoaq5XwOxqtQJbiP0A` | **3 variables seulement** : `Noire`, `Rouge`, `Blanc` |

## Ce qui reste provisoire

Les deux arbitrages qui étaient ouverts ici le 31/07 au matin ont été tranchés par Paul dans la journée : interlignage display à `1.08` (ADR-013) et rouge de titre sur segment porteur (ADR-012). Il ne reste rien de provisoire dans le canon lui-même.

## Ce qui doit être migré — dette chiffrée sur `origin/main`

Mesures faites le 31/07 sur `origin/main` et sur le CSS réellement servi par `parrit.ai`.

| Écart | Volume | Règle violée | Difficulté |
|---|---:|---|---|
| **Fond `body` = photo `paysage-lo-y-wa.jpg` + dégradé `#F5F8FF`** | 1 | Structural Integrity + palette périmée + zéro dégradé | **actif sur les pages `.home-template` seulement, PAS sur la homepage** — voir la correction ci-dessous |
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

**Tranché par Paul le 31/07/2026.**

> ⚠️ **Correction du 31/07, mesurée.** Le paragraphe ci-dessous affirmait que la photo était servie « sur toutes les pages ». **C'est faux.** Vérifié au navigateur : `/fr` et `/en` ont `background-image: none`, parce que la règle existante `body:not(:has(.home-template))` la neutralise déjà et que la homepage pivot ne porte pas cette classe. La photo est bien active, mais **uniquement sur les pages qui portent `.home-template`**, comme `/fr/deployer`. La dette est réelle, son périmètre est plus étroit qu'annoncé.

La production sert, sur les pages portant `.home-template`, un `body` dont le fond est une photographie de paysage (`/brand/paysage-lo-y-wa.jpg`) en `background-attachment: fixed`, recouverte d'un dégradé `#F5F8FF`, couleur périmée.

Trois règles sont violées en même temps : un média narratif est attaché **globalement** au `body`, donc la page dépend d'une image pour exister ; la couleur du dégradé n'appartient plus à la palette ; et le système interdit tout dégradé décoratif.

**Ce qui est décidé, et ne se rediscute pas :**

- la photo de fond **est supprimée** lors de la migration de la homepage ;
- le fond cible est le **papier `#FFFDFA`**, le **grain trois couches** et les **contrastes canoniques**, rien d'autre ;
- **aucun média narratif ne peut être attaché globalement au `body`**, sur aucune page, jamais. Un média appartient à une section, porte `data-layer="expressive"`, et disparaît au Structural Integrity Test.

**Ce qui n'est pas fait ici, et pourquoi.** Le retrait se voit immédiatement en production sur toutes les pages à la fois. Il appartient donc à la tranche homepage, avec captures avant/après aux quatre largeurs et un rollback d'une ligne, pas à une tranche de fondations qui ne touche aucune page publique.

## ✅ Brand OS sécurisé — tranche `BRAND-CANON-V1`, 31/07/2026

Les **12 documents du Brand OS** n'avaient jamais été commités : `git ls-files brand/` renvoyait zéro. Ils vivaient en fichiers non suivis dans le worktree `~/parrit-site`, sans aucune sauvegarde. C'était le canon de marque de toute l'entreprise, et un `git clean` suffisait à l'effacer.

**Ils sont désormais versionnés** dans `brand/`, importés octet pour octet avec leurs dates, sans aucune écriture dans le worktree source (ADR-015).

| Correction appliquée à l'import | Où |
|---|---|
| Typographie display : Geist → **Arpona**, avec interlignage `1.08`, capitales accentuées et French Typography Test obligatoire | `brand/01`, `brand/02` |
| `fileKey` Figma **`J8hieoaq5XwOxqtQJbiP0A`** et partage d'autorité explicite | `brand/07` |
| Référence morte `design-source/figma-template/` signalée | `brand/01` |
| **Positionnement transversal** : la posture, pas le secteur, et la distinction relation / posture | `brand/00` |
| Numérotation ADR continue sur deux journaux, plus ADR-014, 015, 016 | `brand/09` |

**Deux tensions signalées, volontairement non tranchées** (on ne fusionne pas en silence) :

- `brand/06_HOMEPAGE_BLUEPRINT.md` décrit un hero avec portrait ; le Design System pose le hero sans image par défaut. Arbitrage renvoyé à `HOMEPAGE-LEVEL0-V1`.
- `brand/10_SITE_AUDIT_CURRENT.md` porte des chiffres de dette mesurés sur une branche périmée. Le document est conservé tel quel, une bannière renvoie aux chiffres qui font foi, ci-dessous.

**Partage d'autorité désormais explicite :** `brand/` possède la doctrine (identité, vision, positionnement, voix, récit, publics, promesse, preuves) ; `docs/design-system/` possède la traduction visuelle et technique. Le repository reste la source de vérité versionnée.

**Reste à faire côté worktree de Paul :** les modifications de `AGENTS.md`, `DESIGN-SYSTEM.md`, `BRAND.md` et `design-source/DA-TOKENS-EXTRACTED.md` du 30/07 sont **toujours non commitées** chez lui. Elles n'ont pas été touchées.

## Ce qui n'a pas pu être audité

- **Aucun design system Parrit n'existe dans Figma.** Le fichier `Direction-artistique` contient les frames de la DA et **3 variables de couleur**. `search_design_system` ne renvoie aucun composant, aucune variable, aucun style Parrit. Les seules bibliothèques attachées sont Material 3, Simple Design System et les kits Apple. La cible décrite dans `brand/07_FIGMA_SYNC.md` (collections `Primitives/Color`, `Semantic/Light`, pages `01 · Foundations`…) **n'existe pas**.
- `design-source/figma-template/` est référencé par `brand/01_DESIGN_TOKENS.md` comme « vérité pixel » : **le dossier n'existe pas dans le repository.** Référence morte.
- Safari : la QA tourne sur Chromium seul. Le test typographique français n'a pas été rejoué sur WebKit.
- `scripts/contrast-audit.py` n'a pas été exécuté sur la page specimen.

## ✅ Tranche `HOMEPAGE-LEVEL0-V1` — implémentée, testée, non exposée

**31/07/2026.** Hero structurel et rail de preuve sur `/fr`, derrière `NEXT_PUBLIC_HOMEPAGE_LEVEL0_V1`, **éteint par défaut**. Document complet : `HOMEPAGE-LEVEL0-V1.md`.

Livré : hero sans média, double porte commerciale supprimée, CTA principal unique vers `/diagnostic`, rail de preuve sans aucun chiffre inventé, fond structurel garanti, 5 événements analytics sur le système existant, harnais QA dédié (`scripts/homepage-level0-qa.mjs`).

Tout est vert aux quatre largeurs : intégrité structurelle, rouge causal, hiérarchie de CTA, typographie française, responsive, accessibilité, contraste, rollback, analytics. Le specimen `/design-system` ne régresse pas.

Trois extensions rétrocompatibles ont été apportées aux composants canoniques (`secondaryLink`, attributs `data-*`, en-tête surchargeable du rail), plus une correction de fond : le propriétaire et le périmètre d'une preuve ne sont plus rendus dans un `Label`, qui est `nowrap` par contrat et débordait en mobile.

**Rien n'est exposé.** L'activation demande une variable d'environnement et un build.

### Couture traitée — `HOMEPAGE-LEVEL0-SEAM-V1`, 31/07/2026

La jonction entre le variant et la page historique est harmonisée, **derrière le même flag**. Document : `HOMEPAGE-LEVEL0-SEAM-V1.md`.

Le doublon « 01 » a disparu : le rail de preuve porte `01`, les sections historiques reprennent à `02`, `03`, `04`. Les index étaient écrits en dur à trois endroits du JSX de `HomeDeux`, communs aux quatre langues ; ils passent par une liste unique locale, décalée par le signal `hideHero` déjà existant. Aucun second flag.

Le variant emprunte désormais la grille de la page (1120 px, gouttière 24 px, filets à fleur de l'élément), ne peint plus son propre fond et ne porte plus de couche de grain propre. La couture n'ajoute **aucun** élément décoratif et **aucun nouveau rouge**.

Intégrité historique vérifiée automatiquement entre les deux états du flag : texte identique au caractère près (21 936), 8 liens, 7 IDs, 6 sections, 5 CTA instrumentés. `/en`, `/pt-BR` et `/zh-CN` strictement identiques. Rail mobile à 905 px, exactement la valeur d'avant la tranche.

**Dernière différence visible à la jonction** : l'eyebrow historique est rouge, les labels du rail sont en encre atténuée. Hors périmètre, consigné.

### Spécification d'origine, pour mémoire

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
