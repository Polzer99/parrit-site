# 10 — Audit de travail de la homepage au 30 juillet 2026

**Statut :** audit de travail à confirmer par audit du repository et captures actuelles.

> ⚠️ **Chiffres périmés, corrigés le 31/07/2026.** La table de dette en fin de document (57 rayons non nuls, 30 ombres, 61 hex périmés) a été mesurée sur la branche locale `feat/pivot-collaborateurs-souverains`, qui était **72 commits derrière `origin/main`**. Sur la production réelle : 53 `border-radius: 0`, seulement 2 `50 %` et 1 `999px` (sceau, avatar, pastille, tous autorisés), 4 ombres, 6 hex périmés. **La dette de rayons est déjà résorbée.** Le point dur restant est le fond photo du `body`.
>
> Le document est **conservé tel quel** comme trace de l'analyse du 30/07. Les chiffres qui font foi sont dans `docs/design-system/STATUS.md`.

Référence utilisée lors de la première passe : `https://parrit.ai/en`

## What already works

- The core line “Go from AI that talks to AI that acts” expresses the central Parrit tension clearly.
- The page says Parrit deploys with client teams and prioritises production over slides.
- The `Input → Output` model is a strong, ownable sales device.
- The offer set covers transformation, individual agent deployment and training.
- The site communicates ownership, defined scope and auditability more clearly than a generic AI agency.

## Main conversion frictions

### 1. The visitor must choose a commercial door before fully seeing proof

The page presents multiple offers and two hero CTAs, but the most natural first decision is not an offer. It is whether a concrete workflow is worth testing.

Recommendation: make the workflow input the primary conversion mechanism, then route to the correct offer.

### 2. The evidence is more asserted than demonstrated

Statements about production, speed and the network need visible traces, cases, boundaries and outcomes.

Recommendation: show one execution trace, one failure/exception path and two measured before/after cases above the offer architecture.

### 3. The editorial identity and the product site are not yet one system

The strongest Parrit visuals use off-white paper (#FFFDFA), ink (#0C0C0D), signal red (#D1132F), grain, halftone, Geist typography, documentary photography and red-thread causality. The website must apply that language through reusable primitives rather than as isolated campaign images.

### 4. Hermès is absent from the core experience

Hermès can become both proof and conversion: a controlled interface that qualifies a workflow, returns useful value and visibly explains its reasoning boundaries.

### 5. The offer architecture is broader than the primary promise

Transformation, agent deployment and training are valid delivery modes. They should appear after the visitor understands the central mechanism and sees proof.

### 6. The founder story needs warmer, more precise trust

The current founder section is useful, but “shipping an agent to production takes him a day” is easy to challenge without context. It should be framed as first controlled deployment, scope and conditions, then supported by a trace or case.

### 7. The newsletter competes with the main journey

The brief is valuable but should not interrupt the primary workflow-to-meeting path. It can remain as a secondary conversion near the footer or after proof.

## Recommended homepage order

1. Hero promise + Hermès workflow input
2. Trust strip: scope, ownership, auditability, handover
3. Three concrete input → output cases
4. Live or simulated Hermès feasibility summary
5. Execution trace and exception path
6. Measured client proof
7. Five-step Parrit method
8. Delivery modes / offers
9. Founder and expert network
10. Final workflow CTA
11. Newsletter and footer

## First redesign objective

Do not redesign every page at once. Build the canonical tokens and primitives, then implement one complete homepage path that proves the system. Use that path to validate the brand, conversion model and Hermès instrumentation before migrating the rest of the site.

---

## Dette d'implémentation relevée le 30/07/2026 (code, pas doctrine)

Audit de `src/app/globals.css` (~2000 lignes) au moment de l'entrée du Brand OS. Les tokens `:root` sont **corrects** (`#FFFDFA` / `#0C0C0D` / `#D1132F` / Geist + Geist Mono) : c'est `AGENTS.md` qui pointait vers la mauvaise palette, pas le code. En revanche, le CSS applique encore des règles interdites par `01_DESIGN_TOKENS.md` :

| Écart | Occurrences | Règle violée |
|---|---:|---|
| `box-shadow` non nulle (dont ombres dures neo-brutalist `4px 4px 0`, `6px 6px 0`) | 30 sur 57 | `shadow.none`, aucune ombre nulle part |
| `border-radius` non nul (jusqu'à `12px`) | 57 | `radius.none`, angles à 90 degrés |
| Hex périmés en dur (`#161616`, `#F5F8FF`, `#AA0003`) | 61 | palette verrouillée |
| Tokens `--shadow` / `--shadow-sm` / `--shadow-lg` déclarés dans `:root` | 3 | aucun token d'ombre n'existe |
| Fond `body` : dégradé `rgba(245,248,255,…)` (ancien `#F5F8FF`) par-dessus une photo de paysage | 1 | zéro dégradé décoratif ; le fond est crème + grain papier 3 couches |

**Statut : non corrigé.** Ce n'est pas un nettoyage mécanique : supprimer les ombres, les arrondis et le fond photo change visiblement la home en production. À traiter comme une migration à part, validée par Paul, avec régression visuelle et captures avant/après.

Ordre recommandé, conforme à `08_IMPLEMENTATION_MAP.md` :

1. remplacer les 61 hex périmés en dur par les variables sémantiques, à rendu constant ;
2. neutraliser les 3 tokens d'ombre dans `:root`, puis les 30 `box-shadow` ;
3. passer les 57 `border-radius` à `0`, en préservant le sceau, les avatars et les pastilles d'état ;
4. remplacer le fond `body` (dégradé + photo) par crème + grain papier 3 couches ;
5. régression visuelle à 375, 768, 1024 et 1440 px, puis `scripts/contrast-audit.py` (cible TOTAL = 0).
