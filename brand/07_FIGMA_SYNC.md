# 07 — Synchronisation Figma ↔ repository

## Required target

Attach the exact Figma design URL and the node-specific URL for the existing design-system page.

```yaml
figma:
  file_url: pending
  file_key: pending
  design_system_page_id: pending
  website_page_id: pending
```

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
