# 07 — Synchronisation Figma ↔ repository

## Fichier canonique

Renseigné le 31/07/2026, après audit effectif via le MCP Figma.

```yaml
figma:
  file_url: https://www.figma.com/design/J8hieoaq5XwOxqtQJbiP0A/Direction-artistique
  file_key: J8hieoaq5XwOxqtQJbiP0A
  frames_de_reference: "Parrit Template 1 à 6 (node 1:208 et suivants)"
  variables_couleur: 3          # Noire #0c0c0d · Rouge #d1132f · Blanc #fffdfa
  variables_spacing: 0
  variables_typographie: 0
  composants_publies: 0
  bibliotheque_parrit: aucune
  code_connect: aucun
```

## Partage d'autorité

| Qui fait foi | Sur quoi |
|---|---|
| **Le repository** | source canonique des **tokens et des règles**. `src/styles/parrit-tokens.css` et `docs/design-system/`. |
| **Figma** | référence des **compositions explicitement validées** : les 6 frames `Parrit Template`. On reproduit la compo, on n'échange que le copy. |

Quatre faits, à ne pas confondre :

1. Figma ne contient aujourd'hui que **trois variables de couleur**. Elles correspondent exactement aux tokens `paper.default`, `ink.default` et `signal.red` : sur ces trois valeurs, Figma et le code sont d'accord.
2. **Aucune bibliothèque Parrit complète n'existe.** Les seules bibliothèques attachées sont Material 3, Simple Design System et les kits Apple.
3. **Aucun Code Connect** ne relie un composant Figma à un composant de code.
4. La création des composants Figma et du Code Connect est une **tranche future**, pas un prérequis. Le système fonctionne sans, aujourd'hui.

Inverser le sens d'autorité serait une régression : le code porte un jeu de tokens complet, versionné et testé ; Figma porte trois couleurs. État détaillé : `docs/design-system/11_FIGMA_CODE_MAPPING.md`.

## Cible à construire

## Figma structure

Recommended pages:

```text
00 · Start here
01 · Foundations
02 · Components
03 · Patterns
04 · Website
05 · Editorial
06 · Photography
07 · Experiments
99 · Archive
```

## Variables

Create collections:

- `Primitives / Color`
- `Semantic / Light`
- `Semantic / Dark`
- `Spacing`
- `Typography`
- `Radius and border` (only `none` and `round`)
- `Motion`
- `Component states`

Modes:

- Light / Paper
- Dark / Ink
- High contrast where needed

Variable names should mirror the repository tokens, for example:

```text
color/paper/default
color/ink/default
color/signal/red
space/6
radius/none
motion/duration/base
```

## Component naming

```text
Action/Button
Action/Text link
Conversion/Hermes case input
Conversion/Feasibility summary
Proof/Input output case
Proof/Agent trace
Proof/Case study card
Editorial/Section label
Editorial/Headline
Editorial/Halftone field
Editorial/Red thread
Media/Founder portrait
Navigation/Header
Navigation/Footer
```

## Code Connect

Stable Figma components should map to real source components. A component is not stable until:

- its Figma properties are documented;
- its code API exists;
- responsive behavior is defined;
- analytics events are defined when interactive;
- accessibility behavior is verified;
- a Code Connect mapping exists or is deliberately waived.

## Change flow

1. Create or update the source token/component contract.
2. Mirror it in Figma.
3. Implement or update code.
4. Run visual regression.
5. Update decision log and changelog.
6. Publish the Figma library and merge the code in the same release window.

Do not use Figma as an unversioned playground for stable production components. Experimental assets belong in the `07 · Experiments` page.


## Règle d’audit

Une connexion MCP au compte ne constitue pas un audit. L’audit est considéré comme réalisé uniquement lorsque Claude ou l’opérateur a lu le `fileKey`, les pages et les nodes précis du fichier concerné.

Sans URL exacte :

- continuer l’audit du repository ;
- conserver les choix typographiques comme provisoires ;
- créer `docs/audit/FIGMA_PENDING.md` ;
- ne jamais prétendre avoir reconcilié les composants ou variables.
