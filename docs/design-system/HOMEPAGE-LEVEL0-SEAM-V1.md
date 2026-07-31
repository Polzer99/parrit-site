# HOMEPAGE-LEVEL0-SEAM-V1

**Tranche du 31 juillet 2026.** Jonction entre le premier écran Level0 et la homepage historique.
**État : implémentée, testée, non exposée.** Même flag que la tranche précédente, éteint par défaut.

---

## Problème initial

`HOMEPAGE-LEVEL0-V1` fonctionnait isolément, mais sa jonction avec la page historique trahissait l'assemblage : rupture de rythme après le rail de preuve, largeurs différentes, densité différente, et surtout un **doublon de numérotation**, la première section historique reprenant à « 01 » juste après un rail qui n'osait pas se numéroter pour l'éviter.

Ce défaut perturbait le test à froid du nouveau hero : on ne juge pas cinq secondes d'une page qui a visiblement deux origines.

## Cartographie de la couture

| | Variant Level0 | Première section historique |
|---|---|---|
| Dernier / premier élément | `<div data-level0-end>` après le rail de preuve | `<section class="hd-terrain">` |
| Conteneur | `.home-level0-inner` | `.hd-terrain` |
| Largeur maximale | **1280 px** (`80rem`) | **1120 px** |
| Gouttière | **64 px** au-delà de 1024 px | **24 px** |
| Filet | `border-top` sur chaque ligne, dans la boîte de **contenu** | `border-top` sur la boîte de l'**élément** |
| Fond | `#FFFDFA` déclaré, plus une couche `.parrit-grain` | transparent, hérité de `.hd` |
| Typographie | Arpona display, labels mono | Arpona display, eyebrow mono **rouge** |
| Index | aucun, volontairement omis | `01`, écrit en dur dans le JSX |
| Rythme vertical | `--space-section-md` 3,5 rem en sortie | `padding-top: 66px` |
| Ancres et IDs | aucun | `#catalogue-agents`, `#offres` |
| Logique conditionnelle | `hideHero` | idem, prop passée par la route |

**Trois incompatibilités structurelles**, mesurées au navigateur à 1440 px :

1. Le conteneur du variant occupait `80 → 1360`, celui de la section historique `160 → 1280`. Deux grilles.
2. Les filets du rail étaient tracés dans la boîte de contenu, donc **en retrait de 24 px de chaque côté** par rapport au filet de la section historique, tracé sur la boîte de l'élément. Deux familles de lignes à deux largeurs.
3. Le variant portait une **couche de grain supplémentaire** que la page n'a pas, créant une rupture de texture exactement à la jonction.

## Cause du doublon « 01 »

Les index de section de `HomeDeux` sont **écrits en dur dans le JSX**, à trois endroits :

```
ligne 381  <span className="hd-eyebrow-n">01</span> · terrain
ligne 423  <span className="hd-eyebrow-n">02</span> · catalogue
ligne 442  <span className="hd-eyebrow-n">03</span> · offres
```

Ils ne vivent ni dans le `DICT`, ni dans un dictionnaire par langue : ils sont **communs aux quatre langues**. Il n'existait donc aucune source unique à décaler, et la tranche précédente avait contourné le conflit en n'attribuant aucun index au rail de preuve, ce qui laissait un rail non numéroté au milieu d'une page numérotée.

À ne pas confondre : les offres portent aussi `n: "01" | "02" | "03"` dans le `DICT` de chaque langue. C'est la **numérotation des offres**, un autre espace de noms, et `p.n === "01"` pilote la carte mise en avant. Ces valeurs n'ont pas été touchées.

## Arbitrage de numérotation

| | Flag activé | Flag éteint |
|---|---|---|
| `HeroLevel0` | non numéroté | absent |
| `ProofRailLevel0` | **01** | absent |
| Sur le terrain | **02** | 01 |
| Catalogue | **03** | 02 |
| Nos offres | **04** | 03 |

Aucun doublon, aucun saut, ordre croissant, et la numérotation historique est **strictement restaurée** quand le flag est éteint. Vérifié automatiquement dans les deux états.

**Plus petite abstraction possible**, locale à `HomeDeux.tsx` :

```ts
const NUMBERED_SECTIONS = ["terrain", "catalog", "offers"] as const;
function sectionIndex(section, offset) { … }
const indexOffset = hideHero ? 1 : 0;
```

Ce n'est pas un moteur de numérotation pour le site : c'est la liste des sections de cette page, à un seul endroit. L'offset est dérivé du signal `hideHero` déjà existant, donc **aucun second flag**.

## Modifications structurelles

1. **Le variant emprunte la grille de la page.** `.home-level0-inner` passe de `80rem / 64px` à `1120px / 24px`, exactement les valeurs des sections historiques. On aligne le nouveau sur l'ancien, jamais l'inverse.
2. **Les filets du rail sortent jusqu'au bord de l'élément**, par `margin-inline: -24px; padding-inline: 24px`, pour rejoindre la largeur du filet de `.hd-terrain` sans déplacer le texte.
3. **Le fond propre du variant est retiré.** Il laisse voir celui de la page. Une seule surface peinte, plus de frontière.
4. **La couche `.parrit-grain` est retirée du variant.** Le grain appartient à la page, pas à une section. La montée du grain de fond à trois couches reste une dette globale, suivie dans `STATUS.md`.
5. **La respiration de sortie est réduite** à `1.5rem`, de sorte que l'écart total à la jonction soit de **16 px** avant le filet, puis les 66 px de `.hd-terrain`, soit environ 82 px, le rythme habituel entre deux sections historiques.

**La couture n'ajoute aucun élément décoratif** : pas de dégradé, pas d'ombre, pas de rayon, pas de carte flottante, pas d'image, pas de texture, pas d'animation, **pas de nouveau rouge**. Le filet de transition est celui que la section historique portait déjà.

## Éléments historiques préservés

Vérifié automatiquement, en comparant les deux états du flag sur `/fr`, hero historique exclu des deux côtés :

| | Résultat |
|---|---|
| Texte | identique, **21 936 caractères** |
| Liens et destinations | identiques, 8 |
| IDs publics | identiques, 7 |
| Ordre et classes des sections | identiques, 6 |
| CTA instrumentés `data-ph` | identiques, 5 |

Aucun titre réécrit, aucune section supprimée, aucune offre touchée, aucune ancre modifiée.

## Responsive

Testé à 375 × 812, 768 × 1024, 1024 × 768 et 1440 × 900.

Aux quatre largeurs : filets alignés à moins de 1 px, fond continu, jonction de 16 px, aucun débordement horizontal, aucun doublon d'index, aucun index orphelin.

À 375 px, l'index passe **au-dessus** du contenu (règle `.ds-row-indexed` en une colonne sous 48 rem) et ne réduit pas la largeur utile du texte. Le filet du rail et celui de la section historique occupent tous deux `0 → 375`.

**Mobile Height Guard :** le rail de preuve commence à **905 px**, exactement la valeur mesurée au commit `c11f595`. La couture n'a pas aggravé la dette de hauteur mobile. Elle n'a pas cherché à la corriger non plus : c'est une dette séparée.

## Accessibilité

Ordre des titres inchangé, un seul `H1`, navigation clavier et focus intacts, ancres intactes, `prefers-reduced-motion` respecté par les tokens de mouvement. Contraste : `contrast-audit.py` sur `/fr`, `/en` et `/design-system`, **TOTAL = 0**.

Les index de section ne portent aucune information à eux seuls : ils accompagnent toujours un libellé textuel (`02 · SUR LE TERRAIN`), et le rail de preuve porte son propre en-tête. Aucun déplacement de focus à l'activation du variant, qui est résolue au rendu serveur.

## Feature flag

`NEXT_PUBLIC_HOMEPAGE_LEVEL0_V1`, **exactement le même**. Aucun second flag n'a été créé.

Flag activé : hero Level0, rail en `01`, sections historiques en `02` à `04`, couture active.
Flag éteint : homepage historique strictement restaurée, numérotation `01` à `03`, aucune classe de couture active, autres langues intactes.

Build vérifié vert dans les deux états.

## Analytics

**Aucun nouvel événement.** Les cinq événements de la tranche précédente sont vérifiés non régressés : noms inchangés, contrats inchangés, `homepage_level0_view` déclenché **exactement une fois**, et aucun événement `homepage_level0_*` émis quand le flag est éteint.

La sentinelle `[data-level0-end]` n'a pas changé de place : `homepage_level0_scroll_to_next_section` continue de se déclencher au bon moment, une seule fois.

## Captures

`docs/design-system/qa/homepage-seam/`

Pleine page, flag activé : `on-375x812.png` · `on-768x1024.png` · `on-1024x768.png` · `on-1440x900.png`.
Pleine page, flag éteint : `off-*.png`, mêmes largeurs, incluant `/fr` historique.
Rapprochées sur la couture : `seam-375.png` · `seam-1440.png`.
Instantanés bruts comparés : `snapshot-on.json` · `snapshot-off.json`.

## Tests

Harnais : `scripts/homepage-seam-qa.mjs`, en trois temps (instantané `on`, instantané `off`, comparaison), parce que les deux états du flag demandent deux builds.

| Test | Résultat |
|---|---|
| Seam Continuity | ✅ aux 4 largeurs |
| Section Numbering | ✅ `01 / 02 03 04` activé, `01 02 03` éteint, aucun doublon |
| Historical Content Integrity | ✅ texte, liens, IDs, ordre, CTA |
| Flag Isolation | ✅ `/en`, `/pt-BR`, `/zh-CN` strictement identiques |
| Analytics Non-Regression | ✅ 1 vue, contrat inchangé, rien quand le flag est éteint |
| Mobile Height Guard | ✅ 905 px, référence 905 px |
| `lint`, `tsc`, `build` off **et** on | ✅ |
| Harnais Level0 | ✅ |
| Harnais Design System | ✅ |
| Contraste | ✅ TOTAL = 0 |

### Deux faux positifs de harnais, corrigés

Le premier comparait la classe `is-in`, posée par `HomeMotion` quand une section entre dans le viewport. Le variant repoussant la section plus bas, elle n'était pas encore révélée au moment de la capture. C'est un état d'animation, pas une structure : le harnais le neutralise désormais.

Le second comparait le fond **propre** des éléments : `#FFFDFA` déclaré d'un côté, `transparent` hérité de l'autre. Deux valeurs différentes pour un rendu identique. Le harnais remonte maintenant jusqu'au premier ancêtre non transparent. Cela a aussi révélé le vrai défaut, corrigé : le variant n'avait pas à peindre son propre fond.

## Écarts connus

- **L'eyebrow historique est rouge**, les labels du rail sont en encre atténuée. C'est la direction artistique historique, hors périmètre : la corriger reviendrait à repeindre la page, ce que la tranche interdit. C'est la dernière différence visible à la jonction.
- **Le vide à gauche du portrait de la section terrain** vient de son propre `align-items: center` sur une grille à deux colonnes avec une photo haute. Défaut préexistant, hors périmètre.
- **Rail à 905 px en mobile.** Non aggravé, non corrigé.
- **CSS mort** : les règles `.hd-hero` restent dans la feuille quand le variant est actif.

## Rollback

Retirer `NEXT_PUBLIC_HOMEPAGE_LEVEL0_V1` ou la passer à `0`, puis rebuild. Aucun fichier à modifier.

Vérifié : le variant disparaît, la numérotation historique `01 02 03` revient, les classes de couture n'ont plus de correspondance, le contenu historique est identique au caractère près, et les trois autres langues n'ont jamais bougé.

## Hors périmètre, explicitement

Copy commerciale · offres · navigation · footer · autres langues · ordre des sections · titres historiques · couleur de l'eyebrow historique · layout interne de la section terrain · migration générale de `globals.css` · dette de hauteur mobile · retrait du fond photo des pages `.home-template`.
