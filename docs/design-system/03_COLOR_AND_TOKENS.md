# 03 — Couleur et tokens techniques

**Source unique : `src/styles/parrit-tokens.css`.** Ce document explique ; le fichier CSS fait foi. Aucune valeur ne doit être dupliquée ailleurs.

Les trois couleurs de base sont **vérifiées dans Figma** (`Direction-artistique`, `J8hieoaq5XwOxqtQJbiP0A`, variables `Noire #0c0c0d` · `Rouge #d1132f` · `Blanc #fffdfa`).

---

## Nommage

Les noms expriment une **fonction**, jamais une valeur.

| Préférer | Éviter |
|---|---|
| `--color-signal-critical` | `--red`, `--red-2`, `--parrit-red` |
| `--color-action-primary` | `--accent`, `--accent-hover` |
| `--space-section-xl` | `--spacing-17` |
| `--type-display-primary` | `--big-title` |

**Dette connue.** `globals.css` porte encore cinq alias pour le rouge (`--accent`, `--parrit-red`, `--red`, `--accent-hover`, `--red-hover`), cinq pour le filet et quatre pour l'encre sombre. Cette redondance est chiffrée dans `STATUS.md` et n'a pas été touchée (ADR-011).

## Couleurs

| Token | Valeur | Rôle |
|---|---:|---|
| `--color-paper-default` | `#FFFDFA` | papier, crème chaud, fond de tout |
| `--color-paper-alt` | `#F0F0F0` | fond de section derrière une carte |
| `--color-surface-inverse` | `#0C0C0D` | plaque sombre, couche expressive |
| `--color-ink-default` | `#0C0C0D` | titres, texte fort |
| `--color-ink-muted` | `#6E7079` | corps mono atténué, métadonnées |
| `--color-ink-faint` | `#8987A1` | labels d'index, mentions faibles |
| `--color-ink-inverse` | `#FFFDFA` | texte sur surface inverse |
| `--color-signal-critical` | `#D1132F` | signal, action, causalité, état |
| `--color-signal-tint` | `rgba(209,19,47,.10)` | fond de badge |
| `--color-line-hairline` | `#D0D8D7` | filets et bordures 1px |
| `--color-accent-warm` | `#C67C60` | terracotta, liseré de coche uniquement, < 2 % d'un écran |

Alias sémantiques d'action : `--color-action-primary` (rouge), `--color-action-secondary` (encre), et leurs encres inverses.

### Il n'y a pas de blanc pur

`#FFFFFF` est **interdit** comme fond et comme encre. Le papier est `#FFFDFA`. C'est ce qui donne la chaleur du système ; un blanc pur à côté le fait paraître sale.

### Valeurs périmées, à ne jamais ressusciter

`#F5F8FF` (bleuté froid) · `#AA0003` (ancien rouge) · `#161616` (ancienne encre) · `#F6F2EB` et `#F8F5EF` (papiers proposés puis rejetés) · `#D0202E` (rouge proposé puis rejeté).

Sources périmées : `design-source/DA-TOKENS-EXTRACTED.md`, `BRAND.md`, la DNA PostHog/Pancake, `brand-visual-system/v1.1/design-system_01_TOKENS.md`.

## Espacement

Base 8 px : `--space-1` `0.25rem` → `--space-12` `12rem` (0.25 · 0.5 · 0.75 · 1 · 1.5 · 2 · 3 · 4 · 6 · 8 · 10 · 12 rem).

Rythme de section : `--space-section-sm` (4rem) · `-md` (6rem) · `-lg` (8rem) · `-xl` (10rem).

Le whitespace est massif. La hiérarchie repose sur l'espace, la typographie et les filets. **Jamais sur l'ombre.**

## Conteneurs, contrôles

`--container-text` 46rem · `--container-content` 80rem · `--container-wide` 90rem.
`--control-height-sm` 2.5rem · `-md` 3rem · `-lg` 3.5rem.

## Rayons et bordures

| Token | Valeur |
|---|---:|
| `--radius-none` | `0` |
| `--radius-round` | `999rem` |
| `--border-hairline` | `1px` |
| `--border-strong` | `2px` |

**Le rayon par défaut est 0.** Angles à 90 degrés : boutons, cartes, badges, champs, images. `--radius-round` est réservé au sceau, aux avatars et aux pastilles d'état. **Il n'existe aucun rayon intermédiaire** — pas de `xs`, `sm` ni `md`. Si tu en cherches un, c'est que tu dessines autre chose que du Parrit.

## Ombres

| Token | Valeur |
|---|---|
| `--shadow-none` | `none` |

Un seul token, et il vaut `none`. Aucune ombre portée, nulle part. Aucune ombre d'impression non plus : `shadow.print` de `brand-visual-system/v1.1` est écarté (ADR-008).

## Mouvement

`--motion-fast` 120ms · `--motion-base` 220ms · `--motion-slow` 420ms.
`--ease-standard` `cubic-bezier(.2,.8,.2,1)` · `--ease-exit` `cubic-bezier(.4,0,1,1)`.

Le mouvement explique une direction, un état ou un passage. Pas de boucle décorative continue, aucun glow au survol. Les trois durées passent à `0ms` sous `prefers-reduced-motion: reduce`.

## Opacités, z-index

`--opacity-grain-dark` .06 · `--opacity-grain-light` .05 · `--opacity-muted` .4.
`--z-base` 1 · `--z-sticky` 100 · `--z-overlay` 500 · `--z-modal` 1000 · `--z-grain` 9999.

## Breakpoints

`sm` 40rem · `md` 48rem · `lg` 64rem · `xl` 80rem · `2xl` 96rem. Tester à **375, 768, 1024 et 1440 px**.

## Grain papier

La seule texture de fond autorisée. Trois couches, dans cet ordre, via la classe `.parrit-grain` :

1. grain sombre fin — `feTurbulence baseFrequency=0.9 numOctaves=2`, opacité `.06`, `mix-blend-mode: multiply` ;
2. grain blanc scintillant — `baseFrequency=1.1`, opacité `.05`, `mix-blend-mode: screen` ;
3. lueur ambiante — `radial-gradient(130% 62% at 50% -12%, rgba(255,255,255,.85), transparent 58%)`.

L'effet doit se lire comme **premium**, pas comme granuleux. C'est la seule exception au « pas de dégradé » : c'est de la lumière, pas de la décoration.

Le halftone est autre chose : une couche **graphique et explicative** appliquée aux images. Il ne remplace pas le grain et **ne se cumule pas avec lui sur une même surface**.

> La production applique aujourd'hui **une seule couche** à `opacity .035`. Écart consigné dans `STATUS.md`.

## Format d'export et synchronisation

**Source canonique : CSS custom properties**, parce que la stack est Next 16 + Tailwind v4 et que Tailwind v4 consomme des variables CSS nativement via `@theme inline`.

Sens de synchronisation : **repository → Figma**. Figma ne contient aujourd'hui que trois variables de couleur, aucun spacing, aucune typo, aucun composant publié. Inverser la source serait une régression. Détail dans `11_FIGMA_CODE_MAPPING.md`.

## Ce qu'un composant ne peut jamais faire

- Introduire une couleur, une police, un rayon, un pas d'espacement ou une durée absents de ce document.
- Poser une ombre.
- Arrondir un angle hors `--radius-round` sur un sceau, un avatar ou une pastille.
- Utiliser le rouge comme fond décoratif étalé.
- Utiliser un dégradé bleu-violet, du néon, un hologramme, un robot humanoïde, un blob 3D, du glassmorphism ou un faux dashboard.
