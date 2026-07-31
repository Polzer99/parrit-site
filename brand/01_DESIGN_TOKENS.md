# 01 — Design tokens

**Statut :** VERROUILLÉ. Valeurs couleur et typographie validées par Paul le 04/07/2026 sur les frames Figma (« c'est OK pour moi »).

> **Arbitrage du 30/07/2026 (Paul).** Le pack Brand OS v0.2 proposait des tokens provisoires (`#F6F2EB`, Barlow Condensed, Inter, IBM Plex Mono, rayons et ombres autorisés). Ils sont **rejetés**. Le Brand OS entre comme canon de **doctrine** (composants, éditorial, image, Hermès, conversion, gouvernance) ; les **valeurs visuelles restent celles du canon Figma du 04/07**. Ce qui suit fait loi.
>
> Sont également périmés, et ne doivent plus servir de source : `design-source/DA-TOKENS-EXTRACTED.md` (`#F5F8FF` / `#161616` / `#AA0003`), `BRAND.md` (backup historique), la DNA PostHog/Pancake.

Aucune implémentation ne doit introduire une valeur visuelle absente de ce document. Toute nouvelle valeur se décide ici, dans le même commit que le code.

## Couleurs

| Token | Valeur | Usage |
|---|---:|---|
| `paper.default` | `#FFFDFA` | fond de page et de cartes, crème CHAUD |
| `paper.alt` | `#F0F0F0` | fond de section derrière une carte (bloc CTA) |
| `ink.default` | `#0C0C0D` | titres, texte fort, surfaces sombres |
| `ink.muted` | `#6E7079` | corps mono atténué, métadonnées |
| `ink.inverse` | `#FFFDFA` | texte sur fond sombre |
| `signal.red` | `#D1132F` | signal, action, causalité, état. Bouton primaire, badge, sceau |
| `signal.redTint` | `rgba(209,19,47,.10)` | fond de badge |
| `line.default` | `#D0D8D7` | filets et bordures 1px |
| `accent.terra` | `#C67C60` | accent RARE, liseré de coche uniquement |

Le rouge Parrit n'est pas une couleur de remplissage. Il indique quelque chose : un signal, une action, une causalité, un état.

Une section doit fonctionner en niveaux de gris avant que le rouge ne soit ajouté.

## Typographies

Deux familles, strictes. Pas de troisième.

> **Correction du 31/07/2026 — ADR-007.** Ce document déclarait `Geist` en display. C'était une régression documentaire. Le titrage de la DA est **Arpona** : lu directement dans le nœud H1 `1:225` du Figma `Direction-artistique` le 16/07, livré par Smoooth, converti OTF vers woff2, auto-hébergé et **en production depuis le commit `1da446d`**. Vérifié le 31/07 sur le CSS réellement servi par `parrit.ai`.

> **Correction du 31/07/2026 — ADR-017.** Ce tableau décrit le **registre commercial** : propales, decks personnalisés, documents clients formels, supports de rendez-vous. Arpona y reste la display. Il ne décrit plus le **registre éditorial** : site, newsletter, articles, manifestes, pages Hermes, campagnes. La display de l'éditorial est **Barlow Condensed** (SIL Open Font License 1.1, auto-hébergée, Black 900 et ExtraBold 800), et Arpona y garde le rôle de **stature** : citations, textes de posture, registre institutionnel. Décision réversible tant que Paul n'a pas arbitré entre les trois concepts du laboratoire.

| Rôle | Famille | Usage |
|---|---|---|
| Display / titres | **`Arpona`** (fallback `Geist`) | titres, sous-titres, héros du registre commercial |
| Display éditoriale | **`Barlow Condensed`** 900 / 800 | manifeste, impact, grands titres du site et de la newsletter |
| UI / textes longs | `Geist` | navigation, contrôles, fallback d'Arpona |
| Corps / labels / boutons | `Geist Mono` | tout le descriptif, les petits labels, le texte des boutons |

- Titres Arpona : `letter-spacing: -0.04em` systématique, poids `500`–`600` (graisse retenue par Paul : **SemiBold 600**), héros en `clamp(40px, 6vw, 72px)`.
- Corps Geist Mono : poids `400`, souvent en `ink.muted`, sauf boutons et badges.
- Labels : Geist Mono, UPPERCASE, `letter-spacing: 0.12em`, 12–14 px, jamais plus d'une ligne.
- Signature Arpona : les points des `i` et `j`, ainsi que le point final, sont des **losanges**. C'est voulu.

### Interlignage display : `1.08`, jamais sous `1.04` — ADR-013

Le français impose une contrainte que l'anglais masque. Les **capitales accentuées** (`É À È Ê Î Ô Û`) montent plus haut que les capitales nues et entrent en collision avec la ligne du dessus quand l'interlignage est serré.

Mesure du 31/07/2026, par lecture de l'encre réelle des glyphes (`TextMetrics`) dans la police effectivement chargée : sur Arpona SemiBold, la chaîne `ÉQUIPES ÀÈÊÎÔÛ` occupe **1.038 em**. Le plancher absolu est donc `1.04`. La valeur canonique est **`1.08`**, qui conserve une marge de sécurité réelle (1,34 px à 375 px, 2,02 px à 1440 px).

Le canon Figma est dessiné à `0.9`, mais **en anglais** (« Your teams prototype their own AI agents »), sans aucune capitale accentuée. Un interlignage sous `1.04` n'est autorisé que sur une chaîne sans capitale accentuée, et seulement si la QA passe sur cette chaîne précise.

**Le French Typography Test est obligatoire** avant toute mise en production d'un titre. Chaîne de test : `ÉQUIPES · EXÉCUTION · RÉDUCTION · MÉTIERS · DÉCRIVEZ · AMÉLIORATION · DÉPLOIEMENT`, à 375, 768, 1024 et 1440 px. Outillage et méthode : `docs/design-system/10_VISUAL_QA.md`.

Chargement :
- Arpona : **auto-hébergée** dans `public/fonts/arpona/*.woff2` (4 graisses, accents FR et PT complets). Utilisable hors ligne, en PDF, en deck et en page chiffrée.
- Geist et Geist Mono, site Next : `next/font` (déjà en place dans les layouts).
- Artifacts, PDF, decks, propales : embed base64 depuis `public/fonts/arpona/` pour le display, et depuis `node_modules/next/dist/next-devtools/server/font/geist-latin.woff2` et `geist-mono-latin.woff2` pour le reste.

### Échelle typographique

| Token | Valeur |
|---|---:|
| `font.xs` | `0.75rem` |
| `font.sm` | `0.875rem` |
| `font.md` | `1rem` |
| `font.lg` | `1.125rem` |
| `font.xl` | `1.375rem` |
| `font.2xl` | `1.75rem` |
| `font.3xl` | `2.25rem` |
| `font.4xl` | `3rem` |
| `font.5xl` | `4rem` |
| `font.6xl` | `5.5rem` |
| `font.7xl` | `7.5rem` |

Line-height : `tight` `0.9` · `headline` `1.02` · `body` `1.55` · `mono` `1.35`.

Letter-spacing : display `-0.04em` · body `-0.01em` · label `0.12em`.

## Espacements

Base 8 px, quelques demi-pas.

| Token | Valeur |
|---|---:|
| `space.0` | `0` |
| `space.1` | `0.25rem` |
| `space.2` | `0.5rem` |
| `space.3` | `0.75rem` |
| `space.4` | `1rem` |
| `space.5` | `1.5rem` |
| `space.6` | `2rem` |
| `space.7` | `3rem` |
| `space.8` | `4rem` |
| `space.9` | `6rem` |
| `space.10` | `8rem` |
| `space.11` | `10rem` |
| `space.12` | `12rem` |

Le whitespace est massif. La hiérarchie repose sur l'espace, la typographie et les filets, jamais sur l'ombre.

## Conteneurs

| Token | Valeur |
|---|---:|
| `container.text` | `46rem` |
| `container.content` | `80rem` |
| `container.wide` | `90rem` |

## Contrôles

| Token | Valeur |
|---|---:|
| `control.sm` | `2.5rem` |
| `control.md` | `3rem` |
| `control.lg` | `3.5rem` |

## Rayons et bordures

| Token | Valeur |
|---|---:|
| `radius.none` | `0` |
| `radius.round` | `999rem` |
| `border.hairline` | `1px` |
| `border.strong` | `2px` |

**Le rayon par défaut est `0`. Angles à 90 degrés.** Boutons, cartes, badges, champs, images : tous à angles nets.

`radius.round` est réservé au sceau 速, aux avatars et aux pastilles d'état. Il ne définit jamais le langage global. Il n'existe **aucun** rayon intermédiaire : pas de `radius.xs`, `sm` ni `md`.

## Ombres

| Token | Valeur |
|---|---:|
| `shadow.none` | `none` |

**Aucune ombre portée, nulle part.** Aucun dégradé décoratif sur les aplats. La seule exception au « pas de dégradé » est la lueur ambiante du grain, décrite ci-dessous, qui est de la lumière et non de la décoration.

## Grain papier (la seule texture autorisée)

Le fond crème porte un grain papier. C'est la signature tactile de Parrit, pas une fioriture. Trois couches subtiles, dans cet ordre :

1. **Grain sombre fin** : `feTurbulence baseFrequency=0.9 numOctaves=2`, `opacity: .06`, `mix-blend-mode: multiply`.
2. **Grain blanc scintillant** : `feTurbulence baseFrequency=1.1`, blanc, `opacity: .05`, `mix-blend-mode: screen`.
3. **Lueur ambiante** : `radial-gradient(130% 62% at 50% -12%, rgba(255,255,255,.85), transparent 58%)`.

Rester subtil : l'effet doit se lire comme premium, pas comme granuleux. Recette CSS complète : `parrit-os/docs/design-system/parrit-da.canon.css`.

Le halftone décrit en `02_COMPONENTS.md` et `04_IMAGE_SYSTEM.md` est une couche **graphique et explicative** appliquée aux images. Il ne remplace pas le grain de fond et ne se cumule pas avec lui sur une même surface.

## Mouvement

| Token | Valeur |
|---|---:|
| `motion.fast` | `120ms` |
| `motion.base` | `220ms` |
| `motion.slow` | `420ms` |
| `ease.standard` | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| `ease.exit` | `cubic-bezier(0.4, 0, 1, 1)` |

Le mouvement explique une direction, un état ou un passage. Pas de boucle décorative continue. Aucun glow au survol.

## Breakpoints

| Token | Valeur |
|---|---:|
| `sm` | `40rem` |
| `md` | `48rem` |
| `lg` | `64rem` |
| `xl` | `80rem` |
| `2xl` | `96rem` |

Tester à 375, 768, 1024 et 1440 px.

## Variables CSS de référence

```css
:root {
  --parrit-paper: #fffdfa;
  --parrit-paper-alt: #f0f0f0;
  --parrit-ink: #0c0c0d;
  --parrit-ink-muted: #6e7079;
  --parrit-ink-inverse: #fffdfa;
  --parrit-red: #d1132f;
  --parrit-red-tint: rgba(209, 19, 47, 0.1);
  --parrit-line: #d0d8d7;
  --parrit-terra: #c67c60;

  --font-display: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Geist Mono", ui-monospace, SFMono-Regular, monospace;
  --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, monospace;

  --tracking-display: -0.04em;
  --tracking-body: -0.01em;
  --tracking-label: 0.12em;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4rem;
  --space-9: 6rem;
  --space-10: 8rem;
  --space-11: 10rem;
  --space-12: 12rem;

  --radius: 0;
  --radius-round: 999rem;
  --border-hairline: 1px;
  --border-strong: 2px;
  --shadow: none;

  --container-text: 46rem;
  --container-content: 80rem;
  --container-wide: 90rem;

  --motion-fast: 120ms;
  --motion-base: 220ms;
  --motion-slow: 420ms;
  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
}
```

Claude Code adapte l'implémentation à la stack détectée, mais conserve les noms sémantiques et les valeurs tant qu'une décision documentée dans `09_GOVERNANCE.md` ne les remplace pas.

## Assets de marque (invariants, jamais recréés)

| Asset | Fichier | Usage |
|---|---|---|
| Logotype | `public/brand/parrit-lockup.svg` | PARRIT·AI + sceau 速 rouge. Héros, headers. **Jamais retapé en texte.** |
| Wordmark | `public/brand/parrit-wordmark.svg` | Nav, pied de page |
| Lockup empilé | `public/brand/parrit-stacked.svg` | Cartes, propales, lockup centré |
| Reversed | `public/brand/parrit-reversed.svg` | Wordmark blanc sur fond sombre |
| Sceau | `public/brand/parrit-seal.svg` | Favicon, avatar, tampon, filigrane sur photo |

Frames Figma de référence (vérité pixel) : fichier `Direction-artistique`, `fileKey J8hieoaq5XwOxqtQJbiP0A`, frames `Parrit Template 1` à `6`. Traitement photo : `mix-blend-mode: soft-light`, angles nets.

> **Correction du 31/07/2026.** Ce paragraphe pointait vers `design-source/figma-template/Parrit Template 1..6.svg` et `design-source/figma-template/photos/`. **Ce dossier n'existe pas dans le repository** : référence morte depuis au moins le 30/07. Les frames existent, mais dans Figma seulement. Voir `07_FIGMA_SYNC.md`.

## Ce qu'un composant ne peut jamais faire

- introduire une couleur, une police, un rayon, un pas d'espacement ou une durée hors de ce document ;
- poser une ombre ;
- arrondir un angle en dehors de `radius.round` sur un sceau, un avatar ou une pastille ;
- utiliser le rouge comme fond décoratif non différencié sur toute une page ;
- utiliser un dégradé bleu-violet, du néon, un hologramme, un robot humanoïde, un blob 3D, du glassmorphism ou un faux dashboard.
