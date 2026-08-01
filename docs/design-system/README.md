> **Source visuelle de vérité : [`VISUAL-SOURCE-OF-TRUTH.md`](./VISUAL-SOURCE-OF-TRUTH.md)** — Concept D poli, statut `APPROVED PENDING FINAL COPY`, validé le 01/08/2026 (ADR-018). Sur toute question visuelle, ce document prime sur les quinze fiches ci-dessous tant que la migration n'a pas eu lieu.

# Design system Parrit.ai

**Source de vérité visuelle et éditoriale de l'entreprise.** Pas seulement du site : les pages commerciales, les interfaces produit, Hermès, les newsletters, les publications LinkedIn, les decks, les visuels éditoriaux et les futures applications internes en dépendent.

L'objectif : **qu'un agent ou un développeur produise une interface reconnaissable comme Parrit.ai sans réinventer la direction artistique à chaque fois.**

---

## Par où commencer

| Tu veux… | Lis |
|---|---|
| produire quoi que ce soit | **`PARRIT-DESIGN-SYSTEM.md`** — obligatoire, en entier |
| lancer un agent sur une tâche UI | `12_AGENT_INSTRUCTIONS.md` |
| savoir ce qui est canonique et ce qui est de la dette | `STATUS.md` |
| comprendre pourquoi une valeur est ce qu'elle est | `DECISIONS.md` |
| voir le système en vrai | la route `/design-system` |

```bash
npm run build && npm run start
# puis http://localhost:3000/design-system
```

## Les documents

| Fichier | Contenu |
|---|---|
| **`PARRIT-DESIGN-SYSTEM.md`** | **la source de vérité.** Compact, conçu pour être chargé par un agent |
| `01_BRAND_FOUNDATIONS.md` | mission, positionnement, personnalité, concept visuel, assets |
| `02_TYPOGRAPHY_AND_GRID.md` | Arpona, Geist, Geist Mono, échelle, grilles, accents français |
| `03_COLOR_AND_TOKENS.md` | tokens techniques, nommage, format d'export |
| `04_COMPONENTS.md` | contrats, niveau 0, états Hermès |
| `05_PHOTOGRAPHY_AND_MEDIA.md` | trois familles, traitement, règle `references/` |
| `06_HERMES_UI.md` | langage visuel Hermès, états, attribution |
| `07_CONTENT_AND_COPY.md` | voix, mots bannis, patterns éditoriaux |
| `08_CONVERSION_PATTERNS.md` | conversion, architecture de homepage proposée |
| `09_RESPONSIVE_AND_ACCESSIBILITY.md` | breakpoints, recomposition, a11y, portes de qualité |
| `10_VISUAL_QA.md` | les six tests, scoring, outillage |
| `11_FIGMA_CODE_MAPPING.md` | état réel du Figma, écarts, sens de synchronisation |
| `12_AGENT_INSTRUCTIONS.md` | prompt système réutilisable |
| `HERMES-CONTINUOUS-IMPROVEMENT.md` | architecture du site auto-améliorant supervisé |
| `DECISIONS.md` · `STATUS.md` · `CHANGELOG.md` | journal, état, versions |

## Implémentation

| Chemin | Rôle |
|---|---|
| `src/styles/parrit-tokens.css` | **tokens canoniques**, source unique |
| `src/components/ds/primitives.tsx` | Label, IndexMark, Badge, Metric, Divider, SectionHeader, Button, TextLink |
| `src/components/ds/level0.tsx` | les cinq composants de niveau 0, états Hermès, MediaPlate |
| `src/app/design-system/` | page specimen, noindex |
| `scripts/ds-specimen-qa.mjs` | QA automatisée, 4 viewports, captures avec et sans média |
| `docs/design-system/qa/` | captures et `report.json` |

## Précédence

Ce dossier **applique** le Brand OS. Il ne le remplace pas.

```
brand/README.md  >  brand/00_SOURCE_OF_TRUTH.md  >  brand/01_DESIGN_TOKENS.md
  >  brand/02–06  >  brand/07–09
  >  PARRIT-DESIGN-SYSTEM.md  >  01–12  >  tokens et composants du code  >  pages
```

| `brand/` possède | ce dossier possède |
|---|---|
| identité, vision, positionnement | traduction visuelle |
| doctrine, principes, voix, récit | tokens, composants, grille, typographie |
| publics, promesse, preuves | photographie, UI Hermès, conversion |
| décisions de marque | QA, instructions d'implémentation |

**Avant un changement de marque**, lire `brand/`. **Pour une tâche purement UI**, `PARRIT-DESIGN-SYSTEM.md` suffit.

Hors de ce repository : `REGLES-DOR.md` puis `VISION.md` priment. **Le site en ligne est une sortie du système, jamais la source.**

## Artefacts historiques — à ne jamais utiliser comme source

`brand/` est le **Brand OS** : il possède la doctrine, ce dossier possède sa traduction. Versionné le 31/07/2026 par la tranche `BRAND-CANON-V1` (ADR-015).

Ne sont **plus des sources** : `BRAND.md` · `design-source/DA-TOKENS-EXTRACTED.md` · `brand-visual-system/` (v1.0 et v1.1) · la DNA PostHog/Pancake · `DESIGN-SYSTEM.md`.

Ils sont conservés. On ne supprime aucun travail historique. Mais on ne s'en sert plus pour décider.

## La règle qui gouverne tout le reste

> **Masque toutes les images de la page. Si la hiérarchie, le rythme, la tension, la preuve et l'action principale disparaissent, la page n'est pas conforme.**

Le bouton « Masquer les images » de `/design-system` outille ce test. `ds-specimen-qa.mjs` l'automatise.
