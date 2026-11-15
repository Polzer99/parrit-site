# CODEX SPEC 2026-11-15: ROI calculator on the home page (replaces the three engines and « Ce que nous avons mesuré »)

**Risk:** medium (public copy and an interactive component, no data, no sending).
**Decision:** Paul, 15/11/2026. On the engines section and the measures block: « ça ne fait aucun sens… on ne voit pas qu'on a gagné du temps… que du texte… les gens veulent du retour sur investissement, du temps récupéré sur leurs tâches ou du chiffre d'affaires généré en plus ». Format chosen by Paul the same day: **calculator** (the visitor enters their own figures).
**Why a calculator:** no client gain has ever been measured at Parrit, and the canon (`~/parrit-os/canon/CASE-STUDIES-EVIDENCE-MATRIX.md` l.1535-1560) forbids publishing a time gain or an efficiency percentage that was not measured. The calculator shows what the task **costs today** with the visitor's figures. It promises no gain.

## What changes (fr and en)

1. **`GoalMotors` (`#en-production` / `#in-production`)** is replaced by two calculator cards, side by side on desktop and stacked on mobile:
   - **« Faire grandir l'activité. » / « Grow the business. »**: process « Devis restés sans relance » / « Quotes left without follow-up ».
     Inputs: quotes without follow-up per month (default 20), share that signs when followed up (default 15 %), average amount (default 3,000 €).
     Result in large type: `n × share × amount` → « 9 000 € » plus the line « de devis par mois se jouent sur la relance. » / « in quotes a month hinge on the follow-up. »
   - **« Libérer du temps. » / « Save time. »**: one task select:
     - « Commandes reçues par mail, saisies dans l'ERP » (40 / week, 6 min)
     - « Rapprochement bancaire » (50 lines / week, 2 min)
     - « Comptes rendus de réunion » (5 / week, 30 min)
     
     Inputs: volume per week, minutes per item, hourly cost (default 40 €/h).
     Result in large type: hours per month = `volume × min × 52 / 12 / 60` (rounded to the hour) → « 17 h » plus « par mois passées sur cette tâche, soit environ 680 €. » / « a month spent on this task, about €680. »
   - Under the two cards, one line: « Vos chiffres, votre calcul. » / « Your figures, your math. » Then the existing appointment button (`AppointmentLink`, source `accueil-calculateur`) with the label « Mesurons-le chez vous » / « Let's measure it with you ».
   - Section title (`homeSectionHeadings().motors`): « Ce que ces tâches vous coûtent aujourd'hui. » / « What these tasks cost you today. »
2. **`HomeMeasures` (`#mesures`)**: the three figures go (internal measurements, not client results). Keep only the press line « Chroniques parues dans Le Monde Informatique. » and the « Lire le Journal » button, in one compact block. `HOME_MEASURES` leaves the home page; delete the constant if nothing else uses it.
3. « Construire vos outils » leaves this section. The 17 objectives in the hero and their `flow` stay unchanged (the hero still uses them).

## Constraints
- **No promise:** never « vous gagnerez », « économisez », « −X % ». The result describes what exists today with the visitor's figures.
- No hex values (tokens / Brand OS only); radius 0; no new font family.
- Server rendering: without JS, the cards display the defaults and their result already computed. JS updates them live.
- Accessibility: every input has a `<label>`; `type="number"`, `inputmode="decimal"`, `min=0`; the result sits in `aria-live="polite"`; invalid or empty input falls back to 0, with no NaN or Infinity; amounts are formatted with `Intl.NumberFormat(locale)` in €.
- Mobile 390/320: no horizontal overflow, inputs ≥ 44 px tall.
- Remove the « L'assistant prépare. Vous validez. » line from this section.
- Keep the anchors `#services`, `#ce-qui-change`, `#what-changes` (aliases).

## Tests
- Node: pure calculation (exported function), FR/EN SSR rendering with the default results (9 000 €, 17 h, 680 €), absence of the three old figures (29 à 54 %, 16 sur 34, 1 355) on the home page, absence of promise words (gagnerez|économisez|économiser|−\d+ %).
- Playwright: changing an input updates the result; empty input → 0; no overflow at 1440/390/320; network deny-all in place.
- Update the existing tests that encode the engines/measures (accueil-epure, home-visual-layers, intentions, parcours-accueil, single-page, langue-metier, action-unique) to the new content, without weakening the brand and geometry thresholds.

## Battery
`npm run lint`, `npm run qa:claims:rev01`, `npm run build`, `npm test`, `npm run qa:brand:rev01`, relevant Playwright specs; 1440 / 390 screenshots of the section, fr and en.

## Bounds
At most 2 iterations. If `qa:claims` blocks the default figures (they are examples, not claims), mark them in the checker as examples to be edited, with a documented exemption, without weakening the rule for the rest.
