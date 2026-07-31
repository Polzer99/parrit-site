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

```
PARRIT-DESIGN-SYSTEM.md  >  01–12  >  Figma audité  >  code  >  site en ligne
```

Hors de ce repository : `REGLES-DOR.md` puis `VISION.md` priment. **Le site en ligne est une sortie du système, jamais la source.**

## Artefacts historiques — à ne jamais utiliser comme source

`brand/` reste la **doctrine détaillée** dont ce dossier hérite ; il n'est ni supprimé ni contredit, sauf sur `brand/01_DESIGN_TOKENS.md` (typographie de titrage, voir ADR-007).

> ⚠️ **`brand/` n'est pas versionné.** Les 11 documents existent uniquement en fichiers non suivis dans le worktree de Paul. Ils ne sont ni sur `origin/main`, ni dans aucune branche. Tant que ce n'est pas corrigé, **`docs/design-system/` est le seul canon réellement sauvegardé.** Détail et action attendue : `STATUS.md`.

Ne sont **plus des sources** : `BRAND.md` · `design-source/DA-TOKENS-EXTRACTED.md` · `brand-visual-system/` (v1.0 et v1.1) · la DNA PostHog/Pancake · `DESIGN-SYSTEM.md`.

Ils sont conservés. On ne supprime aucun travail historique. Mais on ne s'en sert plus pour décider.

## La règle qui gouverne tout le reste

> **Masque toutes les images de la page. Si la hiérarchie, le rythme, la tension, la preuve et l'action principale disparaissent, la page n'est pas conforme.**

Le bouton « Masquer les images » de `/design-system` outille ce test. `ds-specimen-qa.mjs` l'automatise.
