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

## As delivered (PR #391): deviations and their reasons

- **Button**: « Prendre rendez-vous » / « Book a call », the single shared `AppointmentLink` label (Paul's rule of 13/11 on buttons), source `accueil-calculateur`, ink border (3:1 control contrast on a light background).
- **« L'assistant prépare. Vous validez. »**: kept under the calculator. The human-approval checks (Paul's decision of 08/11) require it on the home page; « Vos chiffres, votre calcul. » moves under the title.
- **First task**: « Saisie des commandes » / « Order entry ». The long label overflowed the field at 390 px.
- **Mobile**: two cards in a native carousel (one card per screen) rather than stacked, for the « one block = one screen » and « five carousels » checks. Each field on one line (label then field).
- **Calculation**: cost on the displayed hours, so a visitor who checks finds the result (17 h × 40 € = 680 €; 0,4 h × 40 € = 16 €). Hours to the hour, one decimal below one hour (« 0,4 h » rather than « 0 h »). Thousands spaces are read (« 3 000 »).
- **« € » exemption**: written in the tests (`langue-metier.test.mjs`, `brand-os-render.test.mjs`, `anti-slop-copy.spec.ts`), limited to the calculator section, rather than in `qa:claims`, which did not block. To narrow later to the figures alone if text is added to the cards.
- **Press**: the « Le Monde Informatique » line becomes the section title (`h2`) of the compact block.
- **`flow` of the 17 objectives**: no longer read anywhere (the hero does not use them). Kept in the data for now; to delete in a later pass if no section uses them again.

## Bounds
At most 2 iterations. If `qa:claims` blocks the default figures (they are examples, not claims), mark them in the checker as examples to be edited, with a documented exemption, without weakening the rule for the rest.
