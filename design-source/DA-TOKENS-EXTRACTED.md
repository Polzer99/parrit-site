# Parrit "Parrit Template" — Tokens DA EXTRAITS de la frame Figma (pixel-perfect)

**23/06/2026.** Source = export Smoooth Studio `Parrit Template.png` (1440×5371),
copie préservée : `resources/FIGMA-REFERENCE-parrit-template.png`.
Valeurs **mesurées au pixel** (PIL : histogramme global + échantillons ciblés + scan de hauteurs de texte).
**Ces tokens sont désormais la DA active.** Implémentés dans `resources/parrit-da.css`.
L'ancienne DA (`parrit-site/BRAND.md`, desktop-OS) reste en **backup, jamais supprimée**.

## ⚙️ AFFINÉ depuis le SVG VECTORIEL (23/06 — source de vérité finale)
Paul a fourni les exports **SVG** Smoooth (`brand-kit/Parrit Template LO-Y-WA.svg` + `Bannière LinkedIn LO-Y-WA.svg`) + le **kit complet** (`brand-kit/kit-assets/` : logos, cartes de visite, signature mail, bannières, template CTA-RDV, photos de profil). Le texte du SVG est **vectorisé (outlines)** donc pas de nom de police dedans → la police reste **identifiée par bake-off = Hanken Grotesk** (display) + JetBrains Mono (mono) + le **logotype PARRIT·AI** (asset SVG `parrit-lockup.svg`, à utiliser tel quel, jamais retypé).
**Couleurs FINALES (fills vectoriels, priment sur l'histogramme) :** fond **`#F5F8FF`** · encre **`#161616`** · rouge **`#AA0003`** · terracotta **`#C67C60`** · sombre **`#2E2D2B`** · muted/labels **`#8987A1`** · halftone gris `#D0D8D7`. ⚠️ La **bannière** LinkedIn, elle, utilise l'ancien `#D1132F`/crème `#FFFDFA` (incohérence Smoooth) — pour le SITE on garde la palette du **Template** (`#AA0003`/`#F5F8FF`). **7 logos clients** extraits → `brand-kit/client-logos/logo-1..7.png` (Lavazza, Laparra, SNCF, Joone, Clevery, efi, Carte Noire) = preuve sociale prête.

## Couleurs (mesurées — histogramme PNG, affinées ci-dessus par le SVG)
| Token | Hex | Rôle | vs ancien BRAND.md |
|---|---|---|---|
| `--bg` | `#F3F5FA` | page : **blanc cassé FROID** (5,6 M px) | crème chaud `#FEFDF9` |
| `--band` | `#EBEEF6` | bande alternée | — |
| `--surface` | `#FFFFFF` | cartes | = |
| `--ink` | `#161616` | titres / texte fort | `#0C0C0D` |
| `--muted` | `#6E7079` | texte mono courant (assombri vs réf `~#94969D` pour WCAG) | `#4A4A4E` |
| `--faint` | `#9A9CA6` | labels ladder, fine print, coords | — |
| `--dark` | `#2C2B29` | bande sombre **anthracite CHAUD** | noir `#0C0C0D` |
| `--dark-2` | `#26241F` | baseball-cards sombres | — |
| `--red` | `#A80708` | **cramoisi profond** : sceau, emphase, CTA | vif `#D1132F` |
| `--red-hover` | `#8C0506` | hover | — |
| `--terra` | `#C67C60` | **terracotta** : tag « format phare » + emphase sur sombre | `#C44536` « retiré » → RÉINTRODUIT (nuance différente) |

> ⚠️ La frame **diverge des tokens BRAND.md « figés »** : palette plus **froide**, rouge plus **profond**,
> terracotta **réintroduite**, look **plat/soft** (≠ néo-brutaliste). C'est la DA réellement dessinée par Smoooth.

## Typo
- **Display** = **Hanken Grotesk**, poids **700/800/900** — IDENTIFIÉE par bake-off rendu vs la frame (single-story `g` à queue ouverte, `a` à queue courbe, `t` coupé en biais). **DM Sans REJETÉ** (queue de `g` trop fermée/géométrique). *(Corrige le défaut initial « DM Sans » — Paul 23/06 « reprendre les polices ».)*
- **Labels / mono / coords / eyebrow** = JetBrains Mono.
- Échelle mesurée (espace 1440, colonne contenu **1212 px**, marges ~114) :
  - H1 hero ≈ **58–63 px** / 800 / interligne 1.06 / `-0.02em`
  - H2 section ≈ **42–46 px** / 800
  - Display offre (« From a half-day… ») ≈ **52–54 px** / 800
  - Titre cas d'usage (`.cell h4`) ≈ **25–26 px** / 700
  - Titre carte (`.card h3`) ≈ **19 px** / 700
  - Titre CTA ≈ **28–30 px** / 800
  - Corps mono ≈ **13–14 px** / interligne 1.7
  - Eyebrow / labels ≈ **12.5–14 px** mono, MAJ, `letter-spacing .2em` (eyebrow) / `.06em` (ladder)

## Layout & composants (relevé)
- **Colonne contenu** ≈ 1212 px centrée (marges ~114 px à 1440).
- **Rayons** : boutons/tag 5–9 px · cartes 16 px · icône-box 10 px · CTA 20 px · chips **pilule** (100px).
- **Ombres** : **douces** (`0 10px 30px rgba(20,24,48,.06)`), **pas** d'offset dur.
- **Nav** : sceau rouge (速) + `Parrit.ai` gras ; bouton rouge plat « Écrire à Paul ».
- **Hero** : **gauche**, eyebrow mono rouge → H1 lourd (emphase rouge) → sub mono → **chips = pilules blanches** (logos outils + point rouge) → 2 boutons. Watermark sceau pâle à droite.
- **Cartes** : blanches, **bord 1px** + ombre douce (PLATES) ; icône = **boîte claire + glyphe rouge** (≠ carré rouge plein).
- **Ladder** : `↗` (muté) | filet vertical | label **mono MAJ muté** | prix à droite ; tag **« FORMAT PHARE » terracotta**.
- **Cas d'usage** : grille 3×, **séparateurs POINTILLÉS**, badge rond rouge (速), titre 25 px, desc mono.
- **Preuves** : baseball-cards **sombres chaudes** (`#26241F`), secteur + résultat chiffré en **terracotta**.
- **CTA final** : **carte blanche plate**, sceau + titre + fine print mono + bouton rouge + ghost gris pâle ; watermark sceau pâle à droite (réf = halftone à points).
- **Texture** : grain papier fractalNoise opacity ~.035 sur les aplats clairs.

## Fichiers
- DA active : `resources/parrit-da.css`  (v1 tokens nus : `resources/parrit-da.v1-tokens.bak.css`)
- Réf préservée : `resources/FIGMA-REFERENCE-parrit-template.png`
- Rendus à jour : `resources/png/{site-home,offre-deployer,offre-croissance,offre-autonomie,interne-personas,interne-catalogue}.png`
