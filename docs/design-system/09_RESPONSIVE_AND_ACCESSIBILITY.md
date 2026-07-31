# 09 — Responsive et accessibilité

## Breakpoints

| Token | Valeur |
|---|---:|
| `sm` | `40rem` |
| `md` | `48rem` |
| `lg` | `64rem` |
| `xl` | `80rem` |
| `2xl` | `96rem` |

**Tester à 375, 768, 1024 et 1440 px.** Ces quatre largeurs sont la définition d'« testé ».

## Le mobile est une composition

> **Le mobile est une composition dessinée, pas un desktop écrasé.**

Recomposer, ne pas empiler :

- l'index mono passe **au-dessus** du contenu au lieu d'occuper une gouttière ;
- une grille de preuve devient une **liste** avec des filets, pas trois cartes étroites ;
- le titre change de **niveau d'échelle**, pas seulement de taille ;
- les actions passent en pleine largeur si elles se coupent ;
- les zones calmes se raccourcissent, mais ne disparaissent pas — c'est ce qui donne le rythme.

Une page qui passe le test à 1440 px et se contente de tomber en colonne à 375 px n'est pas conforme.

## Typographie fluide

Les niveaux display utilisent `clamp()`. La borne basse doit rester lisible à 375 px, la borne haute ne doit pas dépasser la mesure confortable à 1440 px.

**Attention :** le test des capitales accentuées se rejoue **à chaque largeur**. Un titre qui tient sur une ligne à 1440 px passe sur deux lignes à 375 px, et c'est là que les accents se touchent. C'est pourquoi `ds-specimen-qa.mjs` mesure aux quatre largeurs et pas seulement à une.

## Accessibilité

### Contraste

Cible : `scripts/contrast-audit.py` → `TOTAL = 0`. Le script marche le DOM, calcule les couleurs effectives et sort tout texte sous 3:1.

Points de vigilance de la palette :

- `--color-ink-faint` (`#8987A1`) sur papier : réservé aux **labels courts**, jamais au corps de texte.
- `--color-ink-muted` (`#6E7079`) sur papier : correct pour le corps.
- Rouge sur papier : correct pour du texte de taille normale.
- Texte sur `--color-surface-inverse` : utiliser `--color-ink-inverse`, jamais le muted.

### La couleur ne porte jamais l'information seule

Chaque état Hermès porte un **libellé** et un **symbole**. Un daltonien lit la trace aussi bien qu'un autre. Cette règle vaut pour tout nouvel état, badge ou indicateur.

### Sémantique

- Un seul `<h1>` par page, hiérarchie `h1` → `h2` → `h3` sans saut.
- `<ol>` pour une trace : l'ordre porte du sens.
- `<figure>` / `<figcaption>` pour les médias.
- `alt` descriptif sur toute image ; `aria-hidden` sur les symboles décoratifs (flèches, marques d'état déjà doublées d'un libellé).
- `aria-pressed` sur les bascules.
- `role="status"` sur les messages qui apparaissent après une action.

### Clavier

Tout ce qui est cliquable est atteignable au clavier, dans un ordre logique, avec un focus **visible**. Le focus ne se supprime jamais : s'il est laid, on le redessine avec un filet, pas on le retire.

### Mouvement

`prefers-reduced-motion: reduce` passe `--motion-fast`, `--motion-base` et `--motion-slow` à `0ms`. Aucune animation ne se déclenche automatiquement en boucle. Aucun glow au survol.

## Portes de qualité avant de dire « c'est fait »

```bash
npm run lint
npx tsc --noEmit
npm run build
node scripts/ds-specimen-qa.mjs http://localhost:3000
PARRIT_BASE=http://localhost:3000 python3 scripts/contrast-audit.py /design-system
```

Puis : revue accessibilité et clavier · revue `prefers-reduced-motion` · captures aux quatre largeurs · vérification des events analytics · scan des tokens en dur · vérification de chaque affirmation chiffrée.

**Rapporter ce qui a échoué, pas seulement ce qui est passé.**

## Limites connues au 31/07/2026

- La QA tourne sur **Chromium seul**. Le test typographique français n'a pas été rejoué sur WebKit / Safari.
- `contrast-audit.py` n'a pas été exécuté sur `/design-system`.
- Aucun test clavier automatisé.
