# LOT 6 — NAV WIRING & SITEMAP
PARRIT / SITE-PROD · REV 01 · LOT 6 · 2026-08-14

Branch: `rebuild/rev01`. All content lots (1-5) are done: `/`, `/standard`, `/commission`, `/paul`, `/maxime`, `/legal`, `/journal` (+20 entries), `/dossiers` (hidden), `/system`. This lot connects them and makes the public ones real for search engines. Read `ARCHITECTURE.md` before starting.

## What's already wired (don't redo)

`/` already links to `/commission`, `/standard`, `/paul`, `/maxime` (checked in `src/app/(rev01)/page.tsx`). Every REV 01 page already has a `RegistryLine` footer.

## What's missing

1. **`/journal` is an orphan** — nothing links to it. Add a link from `/` (a natural place: near the existing links, or its own small entry point — your call on exact placement, but it must be a real visible link, not just present in the sitemap).
2. **No way back to `/` from the other REV 01 pages.** `/standard`, `/commission`, `/paul`, `/maxime`, `/legal`, `/journal` are dead ends once you're on them. Fix: add a small top element on every REV 01 page (`/`, `/standard`, `/commission`, `/paul`, `/maxime`, `/legal`, `/journal`, `/journal/[slug]`) that links back to `/` — reuse the prototype's wordmark pattern (`.mark` in `parrit-command-system-rev02.jsx`: `PARRIT<i>.</i>AI`, the `.` in red per PC-11) as a small persistent header bar, or the simplest thing that satisfies "there is always a way back to home" without inventing new visual language beyond PC-11's wordmark rules (present at most once per artefact, per the spec — so this header wordmark replaces the need for a registry line at the top; the existing footer `RegistryLine` stays as is, that's a different mark). Build this as one shared component in `src/system/components/` (e.g. `RevHeader.tsx`) so it isn't duplicated seven times — add it to each page's layout/page file.
3. **`/dossiers` and `/system` stay unlinked** — do not add the header to `/dossiers` in a way that would surface it in normal navigation flow (it can still have the back-to-home wordmark for internal review convenience, that's fine — it does not need to be excluded from the header, just excluded from being linked *to* from anywhere public). `/system` likewise: internal tool, wordmark-back-link is fine, no incoming links needed.

## Sitemap

`src/app/sitemap.ts` currently includes the legacy `[lang]` tree entries plus (from Lot 3) `/journal` and its 20 entries. Add entries for the six public REV 01 pages: `/`, `/standard`, `/commission`, `/paul`, `/maxime`, `/legal`. Do NOT add `/dossiers` (noindex, hidden) or `/system` (internal, noindex — verify it's actually marked noindex; if not, that's a Lot 1 gap, fix it here and note it). Follow the existing pattern in the file (`SITE_URL`, `changeFrequency`, `priority` — use sensible values consistent with what's already there for comparable pages, e.g. homepage priority 1.0 like the legacy `""` entry).

## Acceptance criteria

- `npm run lint` && `npm run build` green (verified for real).
- Real server test: from `/`, a human can reach every other public REV 01 page by clicking (verify by grepping the rendered HTML for the expected `href`s, or via a quick Playwright/curl check — your choice) — `/standard`, `/commission`, `/paul`, `/maxime`, `/journal` all linked from `/`.
- From `/standard`, `/commission`, `/paul`, `/maxime`, `/legal`, `/journal`, and one `/journal/[slug]`, the back-to-home link is present and points to `/`.
- `sitemap.xml` (real server, `/sitemap.xml`) contains the 6 public REV 01 URLs and does NOT contain `/dossiers` or `/system`.
- Brand-conformity gate passes (the new header component uses only `src/system/tokens.css`, no new colors/radius/gradients).
- No Hold-to-Commit on this header (it's pure navigation, per PC-07's own rule).
- Commit in logical steps, don't push.

## Reporting

What was added (the shared header component, where it was wired in), confirmation of the click-through and sitemap checks with actual output, and explicit confirmation of `/system`'s noindex status (fixed if it was missing).
