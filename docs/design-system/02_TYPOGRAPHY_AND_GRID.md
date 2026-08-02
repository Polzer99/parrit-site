# 02 — Typographie et grille

## Trois rôles, trois familles

| Rôle | Famille | Statut | Usage |
|---|---|---|---|
| **Display** | **Arpona** (Floodfonts) | canonique, auto-hébergée | titres, héros, chiffres monumentaux |
| **UI** | **Geist** | canonique, `next/font` | navigation, contrôles, textes longs, fallback d'Arpona |
| **Mono** | **Geist Mono** | canonique, `next/font` | corps descriptif, labels, index, boutons, données, trace |

### Arpona — ce qu'il faut savoir

- Fonderie **Floodfonts**. La coupe de base « Arpona », **pas** « Arpona Sans ». Glyphique humaniste, inspirée des lettres romaines gravées.
- Livrée par Smoooth (Alexandre Caillard) le 16/07/2026, convertie OTF → woff2, **auto-hébergée** dans `public/fonts/arpona/` (4 graisses, ~36 Ko chacune, accents FR et PT complets).
- Auto-hébergée signifie : utilisable en **PDF, deck, propale et page chiffrée**. C'est ce qui la sépare d'une police Google Fonts.
- **Graisse de titrage retenue par Paul : SemiBold 600.** La maquette Figma est en Regular ; l'option « plus fin » a été proposée et non retenue.
- **Signature :** les points des `i` et `j`, ainsi que le point final, sont des **losanges**. C'est voulu. Le losange rouge rappelle le sceau 速.
- Fallback : Geist. La chaîne complète est `"Arpona", "Geist", ui-serif, Georgia, serif`.

### Ce qu'on n'utilise pas

Hanken Grotesk et JetBrains Mono traînent dans `design-source/fonts/` : ce sont des vestiges de l'ancienne DA. Ils ne sont ni chargés ni autorisés. Barlow Condensed, proposé par `brand-visual-system/v1.1`, est **écarté** (ADR-008) : aucune police n'était fournie et la valeur ne s'adosse à aucune source.

---

## Échelle

| Token | Valeur |
|---|---:|
| `--type-size-xs` | `0.75rem` |
| `--type-size-sm` | `0.875rem` |
| `--type-size-md` | `1rem` |
| `--type-size-lg` | `1.125rem` |
| `--type-size-xl` | `1.375rem` |
| `--type-size-2xl` | `1.75rem` |
| `--type-size-3xl` | `2.25rem` |
| `--type-size-4xl` | `3rem` |
| `--type-size-5xl` | `4rem` |
| `--type-size-6xl` | `5.5rem` |

Niveaux display, fluides :

| Token | Valeur |
|---|---|
| `--type-display-hero` | `clamp(2.75rem, 6vw, 4.5rem)` |
| `--type-display-section` | `clamp(2rem, 4vw, 3rem)` |
| `--type-display-card` | `clamp(1.5rem, 2.5vw, 2.25rem)` |

## Interlignage — la contrainte française

| Token | Valeur | Usage |
|---|---:|---|
| `--type-leading-display` | `1.05` | **défaut display** |
| `--type-leading-display-tight` | `0.9` | dérogation encadrée, voir ci-dessous |
| `--type-leading-headline` | `1.02` | titres courts sur une ligne |
| `--type-leading-body` | `1.55` | lecture |
| `--type-leading-mono` | `1.35` | labels, données |

**Pourquoi 1.05 et pas 0.9.** Mesuré le 31/07/2026 avec `scripts/ds-specimen-qa.mjs`, qui interroge l'encre réelle des glyphes via `TextMetrics` : sur Arpona SemiBold, la chaîne `ÉQUIPES ÀÈÊÎÔÛ` occupe **1.038 em** — l'accent du É monte, le jambage du Q descend. Sous 1.04, l'accent de la ligne N mord sur le jambage de la ligne N−1.

Le canon Figma est dessiné à 0.9, mais **en anglais** : « Your teams prototype their own AI agents » ne contient aucune capitale accentuée. 0.9 tient sans accent et casse avec.

**`--type-leading-display-tight` (0.9) n'est autorisé que si** la chaîne ne contient aucune capitale accentuée **et** que la QA passe sur cette chaîne précise. Ce n'est pas un token de confort : c'est une dérogation qui se justifie.

> Un interlignage serré « pour l'effet » n'est jamais une raison suffisante. Voir ADR-009.

## Tracking

| Token | Valeur | Usage |
|---|---:|---|
| `--type-tracking-display` | `-0.04em` | titres |
| `--type-tracking-body` | `-0.01em` | corps |
| `--type-tracking-label` | `0.12em` | labels mono uppercase |

Le Figma mesure `-0.06em` sur le H1 à 64 px. `-0.04em` a été retenu après la remarque de Paul sur le resserrement excessif. À rejouer si un titre paraît lâche à très grande taille.

## Règles d'usage

- **Labels :** Geist Mono, UPPERCASE, `0.12em`, 12 à 14 px, **jamais plus d'une ligne**. Un label nomme une zone, il ne raconte pas.
- **Corps :** Geist Mono, poids 400, souvent en `--color-ink-muted`. La première phrase d'un chapô en gras est une signature Parrit.
- **Boutons :** Geist Mono, uppercase, `--type-weight-mono-strong`.
- **Largeur maximale de lecture :** `--container-text` (46rem). Au-delà, le texte devient illisible même bien composé.
- `text-wrap: balance` sur les titres.

## Variantes interdites

Italique sur un display · souligné décoratif · `text-transform: uppercase` sur un titre display long en français (le risque d'accent augmente avec la longueur) · une quatrième famille · un poids display sous 500 · un titre dans une fonte UI non éditoriale.

---

## Grille

| Token | Valeur |
|---|---:|
| `--container-text` | `46rem` |
| `--container-content` | `80rem` |
| `--container-wide` | `90rem` |
| `--gutter-desktop` | `clamp(2rem, 5vw, 5rem)` |
| `--gutter-mobile` | `1.25rem` |

**Desktop (≥ 1024 px).** 12 colonnes. La composition est **asymétrique et alignée** : un bloc démarre en colonne 1, 3 ou 5, jamais à une position arbitraire. L'index mono occupe une gouttière fixe à gauche, le contenu le reste.

**Tablette (768 à 1023 px).** 8 colonnes. L'asymétrie se conserve mais s'amortit : l'index passe au-dessus du contenu plutôt qu'à côté.

**Mobile (< 768 px).** 4 colonnes, gouttière 20 px. **Le mobile est une composition dessinée, pas un desktop écrasé.** On recompose : l'index devient une ligne de label, la grille de preuve devient une liste, le titre change de niveau d'échelle.

## Règles d'alignement et d'asymétrie

1. L'asymétrie est **alignée, pas aléatoire**. Chaque décalage se justifie par une colonne.
2. Les zones denses alternent avec des zones calmes. Deux sections denses consécutives fatiguent.
3. Le rythme vertical repose sur `--space-section-*`, pas sur des marges au jugé.
4. Un filet 1px sépare mieux qu'une carte. Un blanc sépare mieux qu'un filet.
5. Une section = une idée dominante. Si tu hésites entre deux titres, c'est deux sections.
