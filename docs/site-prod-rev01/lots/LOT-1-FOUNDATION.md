# LOT 1 — FOUNDATION
PARRIT / SITE-PROD · REV 01 · LOT 1 · 2026-08-14

Branch: `rebuild/rev01` (already checked out — work directly on it, do not create a nested branch). Authority, in order: `docs/site-prod-rev01/parrit-codes-rev02.html` (law, PC-01→PC-12) → `docs/site-prod-rev01/parrit-command-system-rev02.jsx` (reference implementation) → `docs/site-prod-rev01/parrit-cal-integration.jsx` → `docs/site-prod-rev01/ARCHITECTURE.md` (this lot's plan) → `docs/site-prod-rev01/logo-rev03/LOGO-README.md` (mark usage rules).

Decisions locked by the owner (2026-08-14): hosting = **stay on Vercel** (no infra change this lot); glossary folds into `/journal` (no separate glossary section); 100% English, no i18n.

Do not touch the existing `src/` tree in this lot. This is pure foundation — new code lives in a fresh structure that will replace `src/` only at final cutover (a later lot). Do not delete or modify existing pages/components/routes.

## Scope

1. **App skeleton** (new, parallel to legacy `src/`)
   - New Next.js App Router tree rooted so it doesn't collide with the live legacy app during this branch's life. Concretely: build under `src/app-rev01/` planning to swap to `src/app/` at cutover — pick the cleanest approach that keeps `npm run dev`/`npm run build` green for the legacy site throughout this lot (legacy must still build; this branch is not deployed to production during Lot 1–4). If a clean parallel-tree approach is impractical in this Next version, document why in the PR and propose the alternative (e.g. a feature-flagged root layout) — do not silently deviate from "don't touch existing routes."
   - `site.config.ts` at repo root: typed config object with `CAL_LINK_COMMISSION = "paul-larmaraud/executive-operating-session"`, `CAL_LINK_COACHING_PAUL = "TBD"`, `CAL_LINK_COACHING_MAXIME = "TBD"`, `COACHING_OFFER_NAME = "TBD"`, `COACHING_PRICE_DISPLAY = "TBD"`. Export a helper `isPlaceholder(value)` used later to render visible `[TO FILL]` markers.

2. **Design system package** — `src/system/`
   - `tokens.css`: every PC-01→PC-04 and PC-09 value as CSS custom properties, **names and values copied verbatim from `parrit-command-system-rev02.jsx`'s `CSS` template literal `:root` block** (do not reinvent — that file is the reference implementation and its tokens are already correct). Include the two-register split (`--ink/--carbon...` = Instrument, `--paper/--paper2...` = Document) exactly as named there.
   - Fonts: download Geist + Geist Mono (the same weights referenced in the prototype: 400/500/600/700 for Geist, 400/500/600 for Geist Mono) into `public/fonts/` and self-host via `@font-face` in a `fonts.css` — **remove the Google Fonts `@import`** that the prototype uses for its own demo purposes; production never calls Google Fonts at runtime. Wire `--ui`/`--mono` tokens to the self-hosted families with the same system fallback stack as the reference file.
   - Components, lifted from `parrit-command-system-rev02.jsx` into individual TSX files under `src/system/components/`, converted to TypeScript, **behavior unchanged**:
     - `Frame` (the `frame`/`fx` wrapper with `closed` prop)
     - `Hold` (600ms linear fill, pointer + keyboard, `prefers-reduced-motion` short-circuit to instant commit — copy the exact logic from the reference `Hold` function)
     - `St` (status marks: `ok`/`att`/`crit`/`done` — shape+color per PC-06)
     - `K` (registry-line mono text primitive)
     - `RegistryLine` — new small component wrapping `K` for the footer pattern `PARRIT / SITE · REV 01 · 2026` (per ARCHITECTURE.md §3)
     - `DecisionCard` — a **marketing-safe** variant of the reference `DecisionCard`: same visual contract (Frame, title, body, status, Hold action, closes + shows journal line on commit) but the `onCommit` callback is a no-op stub by default (accepts a prop) since marketing pages have no real backend action to journal — document this distinction in a comment at the top of the file.
     - `Seal` — small component for the `BUILT TO THE PARRIT STANDARD` mark (PC-11), red 9px square + mono caps, per the reference `.seal`/`.doc-f` styling.
   - Logo integration: copy `docs/site-prod-rev01/logo-rev03/*.svg` into `public/brand/` (keep filenames). Generate PNG app-icon derivatives (512/192/180/32) from `favicon.svg` using any available tool (`sharp`, `resvg`, or a build script) — if no rasterizer is available in this sandbox, commit the SVGs only and leave a `TODO-PNG.md` note in `public/brand/` naming exactly what's missing; do not fake or skip silently.

3. **`/system` internal verification route** — `src/app/system/page.tsx` (or the Lot's parallel-tree equivalent), `noindex`, renders every token swatch (PC-01/02) and every component above in both registers (Document and Instrument) so the brand-conformity pass in Phase 4 has a single page to check against ARCHITECTURE.md §2.

4. **CI battery** — extend `.github/workflows/ci.yml` (or add a job) with, in order:
   - `npm run lint`, `npm run build` (existing, keep green for the legacy app).
   - **Network-deny Playwright harness**, per the rule just added to `AGENTS.md` ("Tests : blocage réseau global obligatoire"): a `tests/network-deny.setup.ts` (or equivalent Playwright fixture) that blocks all outbound requests except `localhost`/`127.0.0.1` by default for every e2e spec in this repo, failing any test that triggers an unmatched external request. Apply it as the default fixture for new REV 01 specs; do not need to retrofit every legacy test in this lot, but the deny-all must exist and be provably active on at least one new smoke test (e.g. loading `/system`).
   - **Brand-conformity grep gate**, scoped to the new `src/system/` and `src/app-rev01/` (or equivalent) trees only — NOT the legacy `src/` tree, which still carries the old palette and will be swept at cutover: fail CI if any of these appear outside `tokens.css`: a hex color literal, `border-radius` other than `0` or the documented device-mockup exception, `linear-gradient`/`radial-gradient`, `box-shadow` other than the one documented instrument shadow value, or any of the PC-10 banned words ("unlock", "revolutionize", "supercharge", "AI-powered", "cutting-edge") in new copy strings. A simple grep-based script (`scripts/brand-conformity-check.mjs`) invoked from CI is sufficient — no need for an AST linter in this lot.

## Explicitly out of scope for Lot 1

Do not build `/`, `/standard`, `/commission`, `/journal`, `/paul`, `/maxime`, `/legal`, `/dossiers` content — those are Lots 2–5. Do not touch Cal.com integration beyond copying the reference file for later lots to consume. Do not delete or migrate any legacy content. Do not change hosting/deploy config (owner decision: stay on Vercel, zero change).

## Acceptance criteria

- `npm run build` succeeds for the legacy app (unchanged) AND the new `/system` route renders.
- `/system` visually matches the reference prototype's PC-01/02/05/06/07/11 sections (tokens, Frame, Hold interaction working via pointer and keyboard, status marks, registry line, seal).
- Fonts load from `public/fonts/`, zero request to `fonts.googleapis.com`/`fonts.gstatic.com` on `/system`.
- `scripts/brand-conformity-check.mjs` runs in CI and passes on the new trees.
- A Playwright spec loading `/system` proves the network-deny harness is active (e.g. asserts a blocked-request log, or the harness itself has a self-test).
- PR against `rebuild/rev01` (this branch — not `main`), small enough to review (split into multiple PRs if the diff is large; each PR still must pass CI). Do not merge to `main`.

## Reporting

Standard Codex handoff report: what was built, any deviation from this spec (especially on the parallel-tree question in §1), what's left as `TODO-PNG.md` if rasterization wasn't possible, and the CI results.
