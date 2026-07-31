# 11 — Figma ↔ code

**Audit réalisé le 31/07/2026** via le MCP Figma, compte `paul.larmaraud@parrit.ai`, plan « L'équipe de Paul Larmaraud » (pro).

`brand/07_FIGMA_SYNC.md` pose la règle : *une connexion MCP au compte ne constitue pas un audit ; l'audit n'est réel que si le `fileKey`, les pages et les nodes ont été effectivement lus.* Ce document respecte cette règle et distingue ce qui a été lu de ce qui ne l'a pas été.

---

## Ce qui a été ouvert

| Fichier | fileKey | Lu | Contenu réel |
|---|---|---|---|
| `Direction-artistique` | `J8hieoaq5XwOxqtQJbiP0A` | pages, frames, variables du node `1:208` | La DA Parrit : signature mail, photos de profil LinkedIn, bannières, carte de visite, CTA RDV, **`Parrit Template 1` à 6** |
| *(Content Factory)* | `rSzUt9sC2jxUGYQo7SX5Hu` | page `0:1`, 10 frames | StoresDiscount / Content Factory. **Rien à voir avec le design system.** |

## Variables Figma — l'inventaire complet

```
Noire  → #0c0c0d
Rouge  → #d1132f
Blanc  → #fffdfa
```

**Trois variables. C'est tout.** Elles correspondent exactement à `--color-ink-default`, `--color-signal-critical` et `--color-paper-default`. Sur ces trois valeurs, Figma et le code sont d'accord.

## Écarts constatés

| Constat | Conséquence |
|---|---|
| **Il n'existe aucun design system Parrit dans Figma.** `search_design_system` ne renvoie **aucun** composant, **aucune** variable, **aucun** style Parrit. | La structure cible décrite dans `brand/07_FIGMA_SYNC.md` (collections `Primitives/Color`, `Semantic/Light`, `Spacing`, `Typography`, pages `00 · Start here` → `99 · Archive`) est un **projet**, pas un état. |
| Les seules bibliothèques attachées sont **Material 3 Design Kit**, **Simple Design System**, et les kits **iOS / macOS / watchOS / visionOS**. Aucune bibliothèque Parrit. | Aucune source de composants partagée. Chaque frame est dessinée à la main. |
| `brand/01_DESIGN_TOKENS.md` cite `design-source/figma-template/Parrit Template 1..6.svg` comme « vérité pixel ». | **Le dossier n'existe pas dans le repository.** Référence morte. Les frames existent, mais dans Figma seulement. |
| `brand/07_FIGMA_SYNC.md` déclare `file_url: pending`, `file_key: pending`. | Le `fileKey` est connu depuis le 16/07. À renseigner. |
| Aucun mapping Code Connect. | Aucun composant Figma n'est relié à un composant de code. |
| `brand/01` déclare le display en **Geist** ; le node H1 du Figma et la production servent **Arpona**. | Corrigé par ADR-007. |

## Ce qui a été confirmé visuellement

Capture du node `1:208` (`Parrit Template 1`, 1440 × 816) lue le 31/07 :

- papier crème, encre noire, rouge signal — conformes aux variables ;
- **hero sans photographie** : logotype `PARRIT·AI` avec le sceau 速 rouge, badge red-tint, H1, sous-titre mono centré, rangée de logos outils, ligne de conditions. C'est déjà une composition de **niveau 0** ;
- titrage en Arpona, avec le point en losange caractéristique ;
- corps, badge et conditions en Geist Mono ;
- boutons et badge à angles nets, aucune ombre ;
- un segment du H1 en rouge (« AI agents »).

Ce dernier point est une **tension ouverte** : `brand-visual-system/CLAUDE.md` interdit « le rouge utilisé comme simple surlignage de mot ». Ici, le rouge porte le sujet de la phrase. Règle provisoire retenue dans le code : le segment rouge doit être le **sujet**, jamais un mot choisi pour l'effet. Voir `STATUS.md`.

## Sens de synchronisation

**Le repository est la source. Figma la reflète.**

Ce n'est pas un choix théorique : Figma ne contient aujourd'hui ni variable de spacing, ni style de texte, ni composant publié. Le code contient un jeu de tokens complet, versionné et testé. Inverser la source reviendrait à régresser.

Figma reste maître sur un point et un seul : **la composition dessinée** (les 6 frames `Parrit Template`) et les **assets de marque** (logotype, sceau). On reproduit la compo, on n'échange que le copy, et le logotype est un fichier SVG — jamais retapé en texte.

## À connecter, si Paul veut investir Figma

Par ordre de rendement :

1. Publier les **trois variables existantes** dans une collection `Semantic / Light` correctement nommée (`color/paper/default`…), pour que le nom soit partagé et pas seulement la valeur.
2. Ajouter les variables de **spacing** et de **typographie** depuis `03_COLOR_AND_TOKENS.md`.
3. Créer les cinq composants de **niveau 0** en Figma d'après `04_COMPONENTS.md`.
4. Code Connect sur ces cinq-là uniquement.

Tant que ce n'est pas fait, ce document reste la carte honnête du terrain : **il n'y a pas de design system Figma à réconcilier.**
