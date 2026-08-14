# LOT O — THE COMMAND BAR + THE OPENING (the artifact's shell becomes the site's identity)
PARRIT / SITE · 2026-08-14 night · Authority: `docs/site-prod-rev01/parrit-command-center-rev03.html` (in-repo). Owner feedback (Paul): the shipped site missed « le rapport » with his HTML — the dark command-bar chrome and the boot Opening ARE the identity, not presentation harness.

## 1. CmdBar — replaces RevHeader on ALL REV 01 pages
Port `.cmdbar` from the artifact exactly (fixed top, 52px, background rgba(10,11,12,.92)
+ backdrop-blur 8px, border-bottom 1px var(--rule-d)):
- Left: wordmark `PARRIT<i>.</i>AI` — mono 600, 13px, letter-spacing .22em, paper text,
  red dot (`.wordmark i`). It is the back-to-home link (replaces the [P.] link role).
- Middle (hide under 760px like the artifact): registry `SYSTEM PARRIT.AI · REV 01 ·
  STATUS OPERATIONAL` in k-style 10px .14em, values in var(--g2) weight 500
  (adapt the artifact's OS-0042 demo values to the site's real registry).
- Right: live clock `HH:MM:SS · LOCAL` (mono 10px .12em var(--g4)) — client component,
  1s interval, initial render "—" to avoid hydration mismatch.
Implementation: rewrite `src/system/components/RevHeader.tsx` (keep the exported name
so all layouts keep working) as a client component; CSS in rev01.css replacing the
current .rev-header/.rev-mark styles. Pages get top padding for the fixed bar (52px).
The bar is dark on every page including light ones — exactly like the artifact.

## 2. The Opening — home entry sequence (view 00 "Opening", ported faithfully)
On `/` only: a full-viewport carbon (--ink background) opening that plays ONCE per
browser session (sessionStorage flag), then reveals the page.
- Boot log (mono 11px .1em, var(--g4), lines fade-in staggered ~260ms as in the artifact):
  `PARRIT / SITE · REV 01` · `LOADING COMPANY MODEL ................ DONE` ·
  `CONNECTING OPERATIONS ................ 14 SYSTEMS` ·
  `SCANNING FOR EXCEPTIONS .............. 2 FOUND` (the "2 FOUND" in var(--red)) · `READY.`
- Then the statement fades in: `The system your company operates on.` — Geist-era specs
  from the artifact: weight 500, -.03em, clamp(42px, 7.2vw, 96px), max-width 14ch, paper
  text, with the word `operates` wrapped in the red Parrit Frame (reuse `.frame` +
  `.fx` from src/system — corner brackets, padding 0 .12em).
- Bottom: left k `PARRIT DESIGNS AND BUILDS / COMPANY OPERATING SYSTEMS.` · right
  paragraph 14px var(--g2) max-width 34ch: "One system to understand, decide and act
  across the company. Built for one company at a time. Commissioned, not subscribed."
- Exit: after READY + statement (~2.4s total) the overlay fades out (--seq 400ms) and
  the home appears. Also exit immediately on click/keydown/scroll. With
  prefers-reduced-motion: no animation — skip straight to the home (do not even flash).
  SSR-safe: the overlay must not blank the page for crawlers — render the home normally;
  the overlay is a client-side layer on top (aria-hidden, role presentation).
- No layout shift: home renders beneath from the start.

## Constraints
- Tokens only; the Opening is dark-register (ink/carbon greys + the one red frame + red "2 FOUND").
- No new fonts, no shadows, no radius. PC-10 clean.
- tests: extend `tests/conformity-home.spec.ts` — with sessionStorage flag PRE-SET the
  page shows no overlay; the cmdbar exists on /, /standard, /commission, /journal
  (fixed, 52px). Keep existing assertions green (H1 88px still the LIGHT hero's h1 —
  make sure the Opening statement is NOT an h1; use a div/p with aria-hidden, the page
  keeps exactly one h1).
- Booking/nav untouched. Do not commit; report with a diff table vs the artifact's
  .cmdbar/.bootlog/.boothero/.bootfoot values.
