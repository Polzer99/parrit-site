# Parrit Brand OS

**Version 0.2.1 — 30/07/2026.** Source de vérité de marque pour toute l'entreprise : site, propales, landings, decks, PDF, carousels, visuels.

Le site en ligne est une **sortie** de ce système. Il n'en est jamais la source.

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

```
00_SOURCE_OF_TRUTH > 01_DESIGN_TOKENS > contrats spécialisés (02-05) > Figma audité > code > site en ligne
```

Hors repo, `REGLES-DOR.md` puis `VISION.md` priment sur tout.

## Arbitrage du 30/07/2026 (Paul)

Le pack Brand OS v0.2 est entré comme canon de **doctrine**. Ses **tokens provisoires ont été rejetés** : les valeurs couleur et typo restent celles validées sur Figma le 04/07/2026.

| | Rejeté (Brand OS v0.2) | **Canon (04/07, en vigueur)** |
|---|---|---|
| Fond | `#F6F2EB` | **`#FFFDFA`** |
| Encre | `#0B0B0C` | **`#0C0C0D`** |
| Rouge | `#D1262F` | **`#D1132F`** |
| Polices | Barlow Condensed + Inter + IBM Plex Mono | **Geist + Geist Mono** |
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
