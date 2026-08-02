# Parrit Brand OS

**Version 0.3.0 — 31/07/2026.** Source de vérité de marque pour toute l'entreprise : site, propales, landings, decks, PDF, carousels, visuels.

Le site en ligne est une **sortie** de ce système. Il n'en est jamais la source.

> **0.3.0, tranche `BRAND-CANON-V1` du 31/07/2026.** Ces documents ont été écrits le 30/07 et sont restés **non versionnés** jusqu'au 31/07 : ils vivaient en fichiers non suivis dans un worktree, sans sauvegarde. Ils sont désormais dans le repository. Trois corrections ont été appliquées à l'import, chacune signalée dans le document concerné : la typographie display (`01`, `02`), le `fileKey` Figma (`07`), et l'ajout du positionnement transversal (`00`). Deux tensions avec le Design System sont signalées sans être tranchées en silence (`06`, `10`). Journal : `09_GOVERNANCE.md`.

## Ordre de lecture

| # | Fichier | Ce qu'il fixe |
|---|---|---|
| 00 | [`00_SOURCE_OF_TRUTH.md`](./00_SOURCE_OF_TRUTH.md) | mission, positionnement, promesse, modèle de preuve, concept visuel, interdits |
| 01 | [`01_DESIGN_TOKENS.md`](./01_DESIGN_TOKENS.md) | **couleurs, polices, espacements, rayons, grain, mouvement, assets** |
| 02 | [`02_COMPONENTS.md`](./02_COMPONENTS.md) | contrats de composants (layout, conversion, preuve, éditorial, nav) |
| 03 | [`03_CONTENT_SYSTEM.md`](./03_CONTENT_SYSTEM.md) | message, voix, vocabulaire approuvé, mots bannis, QA contenu |
| 04 | [`04_IMAGE_SYSTEM.md`](./04_IMAGE_SYSTEM.md) | 4 familles d'images, crops, traitement, liste de rejet, prompts maîtres |
| 05 | [`05_HERMES_CONVERSION.md`](./05_HERMES_CONVERSION.md) | thèse de conversion, contrat Hermès, events analytics, expériences |
| 06 | [`06_HOMEPAGE_BLUEPRINT.md`](./06_HOMEPAGE_BLUEPRINT.md) | ordre canonique de la homepage, mobile, critères de réussite |
| 07 | [`07_FIGMA_SYNC.md`](./07_FIGMA_SYNC.md) | structure Figma, variables, nommage, Code Connect, règle d'audit |
| 08 | [`08_IMPLEMENTATION_MAP.md`](./08_IMPLEMENTATION_MAP.md) | arborescence cible, API de composants, plan de migration |
| 09 | [`09_GOVERNANCE.md`](./09_GOVERNANCE.md) | SemVer, états de composants, ADR, changelog |
| 10 | [`10_SITE_AUDIT_CURRENT.md`](./10_SITE_AUDIT_CURRENT.md) | audit de la homepage au 30/07/2026 |

## Précédence

Chaîne complète, de la marque jusqu'à la page. Consolidée le 31/07/2026, quand le Brand OS a été versionné et relié au Design System.

```
1.  brand/README.md                       ← vous êtes ici, l'index
2.  brand/00_SOURCE_OF_TRUTH.md           ← VISION et POSITIONNEMENT
3.  brand/01_DESIGN_TOKENS.md             ← valeurs visuelles
4.  brand/02 à 06                         ← doctrine : composants, voix, image, Hermès, homepage
5.  brand/07 · 08 · 09                    ← Figma, implémentation, gouvernance et ADR
6.  docs/design-system/PARRIT-DESIGN-SYSTEM.md   ← traduction visuelle, canon compact
7.  docs/design-system/01 à 12            ← détail du design system
8.  src/styles/parrit-tokens.css          ← tokens du code
9.  src/components/ds/                    ← composants du code
10. implémentations de pages              ← le site
```

Hors repo, `REGLES-DOR.md` puis `VISION.md` priment sur tout.

### Quatre règles de résolution

1. **En cas de contradiction, la décision la plus récente consignée dans un ADR prévaut.** ADR de marque : `09_GOVERNANCE.md`. ADR de design system : `docs/design-system/DECISIONS.md`.
2. **Une implémentation ne peut pas modifier silencieusement le canon.** Si le code diverge du document, c'est le code qui est en dette, jusqu'à ce qu'un ADR dise le contraire.
3. **Toute nouvelle règle s'inscrit dans le document propriétaire**, pas dans celui qui la consomme. Une règle de voix va dans `03_CONTENT_SYSTEM.md`, pas dans un composant.
4. **La duplication est remplacée par un lien dès que c'est possible.** Deux copies d'une règle finissent toujours par diverger.

### Qui possède quoi

| `brand/` possède | `docs/design-system/` possède |
|---|---|
| identité, vision, positionnement | traduction visuelle |
| doctrine, principes | tokens, composants, grille |
| voix, récit, publics | typographie, photographie |
| promesse, preuves | UI Hermès, patterns de conversion |
| décisions de marque | QA, instructions d'implémentation |

**Le Design System applique le Brand OS. Il ne le remplace pas.**

## Arbitrage du 30/07/2026 (Paul)

Le pack Brand OS v0.2 est entré comme canon de **doctrine**. Ses **tokens provisoires ont été rejetés** : les valeurs couleur et typo restent celles validées sur Figma le 04/07/2026.

| | Rejeté (Brand OS v0.2) | **Canon (04/07, en vigueur)** |
|---|---|---|
| Fond | `#F6F2EB` | **`#FFFDFA`** |
| Encre | `#0B0B0C` | **`#0C0C0D`** |
| Rouge | `#D1262F` | **`#D1132F`** |
| Polices | Barlow Condensed + Inter + IBM Plex Mono | **Arpona** (display) + **Geist** (UI) + **Geist Mono** (corps, labels) |
| Rayons | `xs` / `sm` / `md` | **`0`** (`round` réservé au sceau) |
| Ombres | `shadow.lift` | **aucune** |
| Texture | halftone seul | **grain papier 3 couches** + halftone en couche graphique |

## Fichiers périmés (ne plus jamais en partir)

- `BRAND.md` (racine du repo) : backup historique de la DA agence juin 2026.
- `design-source/DA-TOKENS-EXTRACTED.md` : `#F5F8FF` / `#161616` / `#AA0003` / Hanken. Faux.
- DNA PostHog / Pancake : abandonnée pour les couleurs et les typos. Les **formes** restent une inspiration libre.

## Miroirs

- Canon CSS réutilisable : `parrit-os/docs/design-system/parrit-da.canon.css`
- Résumé exécutable : `parrit-os/docs/design-system/DESIGN-SYSTEM.md`
- Skill Claude Code : `~/.claude/skills/design-system/`

Ces miroirs **consomment** le Brand OS. Ils ne le redéfinissent pas. Toute modification part d'ici.
