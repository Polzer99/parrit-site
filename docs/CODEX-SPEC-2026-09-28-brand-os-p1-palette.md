# CODEX SPEC · 28/09/2026 · parrit.ai passe sur la palette Brand OS P1 (ancienne charte T4 désactivée)

## Décision
Paul a validé le 24/09/2026 la décision D1 du Brand OS (`~/parrit-canon/brand/decisions/ADR-001-brand-os-nouvelle-identite-mere.md`) : les directions P1/P3 deviennent la base visuelle, la charte T4 bleue (papier `#F1F2F3`, carbone `#131518`, ink `#0A0B0C`, accent `#1268D9`/`#0F56B3`/`#84B5F5`/`#2F82EE`) est SUPERSEDED. Le 28/09, il a demandé de désactiver l'ancien branding partout. **Ce lot s'arrête à la PR : aucun merge, aucun déploiement.** La mise en production est une décision de Paul.

## Source de vérité des valeurs
Fichier GÉNÉRÉ `~/parrit-canon/brand/adapters/web/tokens.css` (Brand OS 0.1.0-candidate, variables `--brand-*`). Ne jamais inventer ni recopier une valeur à la main ailleurs que dans la copie vendorisée décrite ci-dessous.

## À faire
1. **Vendoriser l'adapter** : copier `~/parrit-canon/brand/adapters/web/tokens.css` à l'identique dans `src/system/brand-os.tokens.css` (en-tête « GÉNÉRÉ, NE PAS ÉDITER » conservé, plus une ligne indiquant la source et la date). L'importer AVANT `tokens.css` partout où `tokens.css` est importé (`src/app/(rev01)/layout.tsx`) et le rendre lisible par les routes OG qui lisent `tokens.css` directement (`src/app/opengraph-image.tsx`, `src/app/(rev01)/journal/[slug]/og/route.tsx`).
2. **Rebrancher `src/system/tokens.css`** : garder tous les NOMS de variables existants (aucun composant ne doit changer), mais chaque valeur de couleur devient une référence `var(--brand-…)`. Correspondance à appliquer (régimes P1 « calm » sur clair, « ink » sur sombre) :
   - `--ink`, `--carbon`, `--body-l`, `--selection-fg` → `--brand-accessible-ink`
   - `--carbon2`, `--steel` → `--brand-derived-aux-3`
   - `--paper` → `--brand-core-off` ; `--paper2` → `--brand-derived-white`
   - `--g2`, `--g3`, `--g4`, `--g4-l` → `--brand-accessible-ink2`
   - `--g4-d`, `--label-d` → `--brand-derived-on-ink-2`
   - `--rule-l` → `--brand-derived-aux-1` ; `--rule-d` → `--brand-derived-on-ink-line`
   - `--accent-strong`, `--accent-strong-p`, `--accent-text`, `--accent-border` → `--brand-core-canard`
   - `--accent-surface`, `--accent-soft` → `--brand-accessible-sky`
   - `--accent-on-dark`, `--accent-on-dark-p`, `--accent-dark-border` → `--brand-core-rose` (éclat sur fond sombre, comme le régime « ink » de P1)
   - `--accent-dark-surface` → `--brand-derived-aux-3`
   - les alias (`--action-*`, `--accent-fg`, `--accent-line`, `--focus-color`, `--selection-bg`, `--crit-dot`) restent des alias.
   Les polices ne changent pas (General Sans + IBM Plex Mono). `--ed` (Source Serif 4) reste pour les titres éditoriaux du Journal : hors périmètre de ce lot.
3. **Contraste** : vérifier par calcul chaque paire texte/fond réellement utilisée (≥ 4,5:1, 3:1 au-delà de 24 px) ; si une paire échoue (en particulier canard sur fond sombre, ou rose en texte sur fond clair), la corriger en choisissant une autre variable `--brand-*` existante, jamais un hex nouveau. Lister les paires testées dans le rapport.
4. **Garde-fou** : mettre à jour `scripts/brand-conformity-check.mjs` pour qu'il ÉCHOUE si un hex de l'ancienne charte ou un hex mort apparaît dans `src/` (hors `archive/`) : `#0A0B0C #131518 #1A1D21 #F1F2F3 #FAFAFB #1268D9 #0F56B3 #84B5F5 #68A4F3 #2F82EE #4C93F0 #E3EEFD #D0E3FB #19293E #DDE0E3 #24282D #606366 #8C8F92 #55595E #9CA1A6 #26282B #C7CBCF #3A3F47` et les morts `#6F757B #8C6A3F #C44536 #D1132F #E10600 #F6F2EB #FEFDF9 #FFFDFA` ; et s'il trouve une couleur de marque en dur hors `src/system/brand-os.tokens.css`.
5. **`AGENTS.md` du dépôt** : remplacer la palette recopiée (lignes ~44-48) par un renvoi au Brand OS (`~/parrit-canon/brand`, `brand_os.py resolve`) et au fichier vendorisé. Aucune valeur recopiée.
6. **`design-source/parrit-da.css`** : ajouter en tête un commentaire « SUPERSEDED le 28/09/2026 par le Brand OS P1 — ne plus utiliser » (le fichier n'est pas importé par le build ; ne pas le supprimer).

## Hors périmètre
Textes et copy (matrice `SITE-IMPACT-MATRIX.md` = lot séparé), photos, logo (D5 ouvert), Journal, `archive/`, déploiement, merge.

## Critères d'acceptation
- `npm run build` vert ; tests existants verts ; `node scripts/brand-conformity-check.mjs` vert.
- `grep -riE` des hex de l'ancienne charte sur `src/` (hors archive) = 0.
- Captures 1440 px et 390 px de `/`, `/legal`, `/build-with-you`, `/journal` avant/après jointes au rapport (`.codex-handoffs/`), avec la liste des paires de contraste.
- PR ouverte, description qui rappelle : « ne pas déployer sans le feu vert de Paul ».
