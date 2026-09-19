# CODEX-SPEC · 2026-09-19 · Copy home + dossiers, registre Palantir × ColdIQ (retrait des badges-preuve)

Statut : **VALIDÉ PAR PAUL le 19/09/2026** (« OK, vas-y, let's go » sur la
proposition de `docs/AUDIT-COPY-PALANTIR-COLDIQ-2026-09-19.md`).
Source de vérité de ce changement : ce fichier d'audit, déjà présent dans le
dépôt (`docs/AUDIT-COPY-PALANTIR-COLDIQ-2026-09-19.md`). **Lis-le en entier
avant de commencer** — il contient chaque paire AVANT/APRÈS exacte, en FR et
en EN, avec sa justification. Ce présent fichier n'en est que le résumé
d'exécution ; en cas de doute sur une formulation exacte, le fichier d'audit
fait foi mot pour mot.

Périmètre strict : chaînes de copy + suppression d'une section dans
`src/app/(rev01)/page.tsx` et `src/app/(rev01)/dossiers/page.tsx`. Aucun
changement de route, aucun autre composant, aucun changement sur
`/manufacture`, `/standard`, `/commission`, `/journal`, `/legal` (l'audit les
a lus et les a explicitement exclus — déjà au bon registre).

## 1. `src/app/(rev01)/page.tsx` — retirer la section `metrics`

Section "## `/` — Accueil" de l'audit, recommandation primaire (pas le
repli) : **retirer entièrement** la section des trois badges-chiffres
(200+ / 2,5 mois / 100%) et sa note de date (`metricsNote`), à la fois la
clé `DICT.en.metrics`/`DICT.fr.metrics`/`metricsNote` ET le bloc JSX qui les
rend (probablement une `<section className="home-s-metrics...">` ou
équivalent — identifie-le en lisant le fichier, ne devine pas son nom exact).
Les sections avant et après doivent s'enchaîner proprement (pas d'espace
vide résiduel, pas de `border`/`padding` orphelins).

## 2. `src/app/(rev01)/page.tsx` — `brands.note`

Remplacer `DICT.en.brands.note` et `DICT.fr.brands.note` par les valeurs
« APRÈS » de la section "### `brands.note`" de l'audit. Ne pas toucher
`brands.kicker` ni `brands.list`.

## 3. `src/app/(rev01)/page.tsx` — `maison`

Remplacer `title`, `leadStrong`, `leadRest`, `body` de `DICT.en.maison` et
`DICT.fr.maison` par les valeurs « APRÈS » de la section "### `maison`" de
l'audit (FR et EN, quatre clés chacune). Ne pas toucher `kicker`, `link`,
`alt`, `caption`.

## 4. `src/app/(rev01)/dossiers/page.tsx`

Applique les 4 remplacements de la section "## `/dossiers`" de l'audit :
- Dossier 26-003 : `title` + `body`, FR et EN.
- Dossier 26-002 : `title` + `body`, FR et EN.
- Dossier 26-001 : `body` uniquement, FR et EN (`title` reste inchangé —
  l'audit le dit explicitement, ce n'est pas une violation).
- `note` du registre des dossiers scellés, FR et EN.

## 5. QA avant PR

- `npm run lint` + `npx tsc --noEmit` + `npm run build` : verts.
- `npm run qa:claims:rev01` + `npm run qa:brand:rev01` : verts (le retrait
  des chiffres ne doit déclencher aucune fausse alerte du gate claims —
  vérifier que le script ne référence pas en dur une métrique supprimée).
- `python3 ~/parrit-os/tools/prooflint.py` sur les chaînes modifiées.
- Capture d'écran de la home (FR + EN, desktop 1440px) montrant l'enchaînement
  propre hero → bandeau marques (plus de bandeau metrics entre les deux).
- Capture de `/dossiers` (FR + EN) montrant les nouveaux titres.
- `git diff --stat` : seuls `page.tsx` et `dossiers/page.tsx` doivent
  apparaître (plus ce fichier de spec).

## 6. Livraison

Branche dédiée → PR vers `main`. NE PAS MERGER : review Claude (APPROVE) +
CD/batterie verte = les 3 feux (§25 — validation du fond déjà acquise via
l'audit lu et approuvé par Paul). Rollback : revert de la PR (aucune
migration de données).
