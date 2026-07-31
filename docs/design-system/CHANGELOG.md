# Changelog — design system Parrit.ai

SemVer. `patch` : correction sans changement de règle. `minor` : nouveau composant, pattern ou règle compatible. `major` : changement de positionnement, de système visuel ou de contrat incompatible.

---

## 1.0.0 — 2026-07-31

Première version canonique. Consolidation de cinq sources contradictoires en une seule.

### Ajouté

- `docs/design-system/` — 16 documents, dont `PARRIT-DESIGN-SYSTEM.md` comme source de vérité unique et compacte.
- `src/styles/parrit-tokens.css` — tokens sémantiques, source unique, additive.
- `src/components/ds/primitives.tsx` — 8 primitives structurelles.
- `src/components/ds/level0.tsx` — les 5 composants de niveau 0, les 8 états Hermès, `MediaPlate`.
- `src/app/design-system/` — page specimen noindex avec le bouton « Masquer les images ».
- `scripts/ds-specimen-qa.mjs` — QA automatisée sur 4 viewports : test typographique français par mesure d'encre, Structural Integrity Test, Token Discipline, captures avec et sans média.
- `HERMES-CONTINUOUS-IMPROVEMENT.md` — architecture du site auto-améliorant, avec deux verrous humains non automatisables.

### Décidé

- **ADR-007** — le titrage est **Arpona**, pas Geist. `brand/01` avait régressé sur une décision du 16/07 déjà en production.
- **ADR-008** — la doctrine v1.1 (deux couches, Structural Integrity Test, `references/` en QA seule) est adoptée ; ses tokens (`#F8F5EF`, Barlow Condensed, ombres d'impression, rayons 4 px) sont écartés.
- **ADR-009** — interlignage display porté à `1.05`, **sur mesure** : l'encre des capitales accentuées occupe 1.038 em en Arpona SemiBold. Clôt le défaut « A1 ».
- **ADR-010** — `docs/design-system/` devient le point d'entrée canonique. `brand/` reste la doctrine détaillée, rien n'est supprimé.
- **ADR-011** — les nouveaux tokens sont additifs et ne touchent pas `globals.css`. Aucune page publique ne change.

### Corrigé

- L'audit de dette de `brand/10_SITE_AUDIT_CURRENT.md` avait été mesuré sur une branche **72 commits derrière `origin/main`**. Chiffres réels de production consignés dans `STATUS.md` : la dette de rayons est déjà résorbée (53 `border-radius: 0`), il reste 4 ombres et 6 hex périmés, pas 30 et 61.
- `brand/07_FIGMA_SYNC.md` déclarait `file_key: pending` : le `fileKey` est `J8hieoaq5XwOxqtQJbiP0A`.

### Constaté, non corrigé

- **Il n'existe aucun design system Parrit dans Figma** : 3 variables de couleur, zéro composant, zéro style, zéro bibliothèque Parrit.
- `design-source/figma-template/` est cité comme « vérité pixel » par `brand/01` et **n'existe pas** dans le repository.
- La production sert un `body` avec une photo de paysage et un dégradé `#F5F8FF` périmé.
- QA sur Chromium seul ; `contrast-audit.py` non exécuté sur la page specimen.

### Non fait, volontairement

Aucune page publique modifiée. Aucun merge, aucun déploiement. `AGENTS.md` non repointé vers ce dossier — c'est la tranche suivante.
