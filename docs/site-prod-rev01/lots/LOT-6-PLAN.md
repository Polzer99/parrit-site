# Plan — Lot 6 navigation and sitemap
Source spec: `docs/site-prod-rev01/lots/LOT-6-NAV-SITEMAP.md` (approved by explicit execution request)
Date: 2026-08-14

## Tâche T1 : Add the shared REV 01 home link
- Goal: Provide one brand-conformant, persistent route back to `/` on every public REV 01 surface.
- Files: `src/system/components/RevHeader.tsx`, `src/system/components/index.ts`, `src/app/(rev01)/layout.tsx`, `src/app/(rev01)/rev01.css`
- Steps:
  1. Implement the PC-11 `PARRIT.AI` wordmark as a plain `Link`, with the terminal dot using `var(--red)`.
  2. Render it once from the shared REV 01 layout so `/`, the six public pages, and every journal article inherit it.
  3. Keep styling token-only, with no Hold interaction, radius, shadow, gradient, or literal color.
- Acceptance: Each required route renders an `href="/"` home link and the brand-conformity gate passes.
- Effort: ~20 min
- Dépend de: —

## Tâche T2 : Connect the journal from home
- Goal: Remove `/journal` from orphan status without exposing `/dossiers` or `/system`.
- File: `src/app/(rev01)/page.tsx`
- Steps:
  1. Add a visible, natural journal entry point near the existing public links.
  2. Confirm the rendered home contains links to `/standard`, `/commission`, `/paul`, `/maxime`, and `/journal`.
- Acceptance: A human can reach all five public destinations by clicking from `/`; no public incoming link targets `/dossiers` or `/system`.
- Effort: ~10 min
- Dépend de: T1

## Tâche T3 : Add the public REV 01 sitemap entries
- Goal: Make the six public REV 01 routes discoverable without surfacing internal routes.
- File: `src/app/sitemap.ts`
- Steps:
  1. Add `/`, `/standard`, `/commission`, `/paul`, `/maxime`, and `/legal` with sensible frequencies and priorities.
  2. Preserve the existing journal entries and legacy localized tree.
  3. Verify `/system` already has `robots: { index: false }`; fix only if missing.
- Acceptance: The real `/sitemap.xml` contains all six URLs and contains neither `/dossiers` nor `/system`; `/system` remains noindex.
- Effort: ~15 min
- Dépend de: —

## Tâche T4 : Verify and commit closed loops
- Goal: Prove the implementation against every acceptance criterion without network egress.
- Files: changed production files and generated server output only
- Steps:
  1. Run targeted static checks and the repository brand-conformity gate.
  2. Run `npm run lint` and `npm run build`.
  3. Start the production server locally and inspect rendered HTML plus `/sitemap.xml` with `curl` against localhost.
  4. Commit the implementation and sitemap changes in coherent, reversible commits; do not push.
- Acceptance: All specified commands and real-server checks pass with captured output.
- Effort: ~25 min
- Dépend de: T1, T2, T3
