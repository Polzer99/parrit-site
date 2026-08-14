# LOT 2 — PAGES: /, /standard, /commission
PARRIT / SITE-PROD · REV 01 · LOT 2 · 2026-08-14

Branch: `rebuild/rev01` (already checked out — work directly on it). Lot 1 is merged into this branch (`src/system/`, `site.config.ts`, `/system` route, fonts, CI gates). Read `docs/site-prod-rev01/lots/LOT-1-FOUNDATION.md` first to know what already exists — reuse it, do not recreate tokens/components. Authority, same order as Lot 1: `parrit-codes-rev02.html` (law) → `parrit-command-system-rev02.jsx` (reference implementation) → `parrit-cal-integration.jsx` → `ARCHITECTURE.md`.

A real CI now runs on every push to this branch via PR #208 (draft, never merges) — you can and should push incrementally and let CI be the proof, instead of asserting locally that something works.

Do not touch the existing legacy `src/app/[lang]/...` tree. These three new pages live under `src/app/(rev01)/` — a new route group, sibling to `src/app/system/` from Lot 1 (same pattern: isolated root layout, does not collide with legacy routes). If Next 16 route groups don't compose cleanly with the existing root layout the way Lot 1 found for `/system`, apply the same kind of isolated-layout fix Lot 1 used and document the deviation — don't silently pick a different structure.

## Pages to build

### `/` — homepage
Reference: prototype view `Home` (`function Home()` in `parrit-command-system-rev02.jsx`) — reuse its structure and copy voice, not its literal English marketing copy verbatim (that copy is for "Silvani Group", a fictional demo client — replace with real Parrit copy per PC-10 and `ARCHITECTURE.md` §3: "Hero, instrument object, operating loop, commissioning model. Faces of Paul & Maxime: names/roles/links only — never prices").
- Hero: H1 + one-line description, CTA row with **one** `Hold` component wrapping the primary commit-style action (per PC-07, only for something genuinely consequential — if there's no consequential action on the homepage, use a standard button instead and say so in the report; don't force a Hold where the prototype used one just because the prototype did) and one standard `ghost` button for a secondary action ("Examine a system" style, e.g. linking to `/standard` or `#dossiers` when that section exists later).
- The "instrument object" section: reuse the `.instr`/`ibar`/`irow` visual pattern from the prototype (already available as design-system primitives from Lot 1 if present, otherwise build minimal local markup using `src/system/tokens.css` — do not introduce new colors).
- "One operating loop" 3-column section (Understand / Decide / Act) — same content pattern as prototype, real Parrit copy.
- "Commissioned, not subscribed" 3-column section (Examination / Construction / Compounding) — same pattern, real copy tied to Parrit's actual engagement model (do not invent numbers or prices).
- Paul & Maxime as human faces: names, roles, links to `/paul` and `/maxime` — no photos required this lot if assets aren't ready, use text-only placeholder blocks clearly marked, not fake imagery.
- Footer: `RegistryLine` component from Lot 1, exact text `PARRIT / SITE · REV 01 · 2026`.
- No fictional client names or numbers (SILVANI, NORTHSTAR, Müller, Meridian, €1.2M, etc.) — grep for these before finishing, per the Phase 4 brief check.

### `/standard` — the Parrit Standard as specification
Reference: prototype's `doctrine` block in `BrandSystem()` (the `PS-01` → `PS-06` table: Observable / Actionable / Traceable / Reversible / Owned / Compounding). Build this as its own page (not embedded in a brand-system demo) — same visual contract (`.doctrine`/`.doc-h`/`.doc-r`/`.doc-f`, or the Lot 1 component equivalents), real doctrine text (the six principles already have their descriptions in the prototype — reuse those verbatim, they are the actual doctrine, not fictional).
- Header per PC-05 conventions: title, registry-line plate.
- End with the `Seal` component ("BUILT TO THE PARRIT STANDARD").

### `/commission` — the engagement page
Reference: prototype's "Commissioned, not subscribed" 3-step content (Examination/Construction/Compounding) PLUS the Cal.com inline integration from `parrit-cal-integration.jsx` (`ParritCalInline`, mode 1 — inline instrument, not the popup mode).
- Import and adapt `ParritCalInline` from the reference file into `src/system/components/CalInline.tsx` (or reuse if Lot 1 already staged it — check first). Replace its hardcoded `CAL_LINK = "parrit/commission"` with `site.config.ts`'s `CAL_LINK_COMMISSION`.
- `@calcom/embed-react` is not yet a dependency — add it (`npm install @calcom/embed-react`, check it doesn't conflict with existing deps; if there's a reason it can't be added cleanly, report and stop rather than forcing it).
- Standard button styling for any CTA on this page — **no Hold-to-Commit on booking**, per the explicit note in `parrit-cal-integration.jsx`'s own comment header (opening a calendar is not consequential).
- The three-stage narrative (examination → construction → compounding) above or beside the calendar, using real Parrit language, no invented figures.
- Registry line footer.

## Shared work

- If any component needed by these three pages doesn't yet exist in `src/system/components/` from Lot 1 (e.g. the instrument chrome, the three-column layout primitive), add it there — same rules as Lot 1: no hex outside `tokens.css`, no radius, no gradients, PC-10 banned words excluded.
- Update `src/system/page.tsx` (the `/system` verification route) only if you add new reusable components, so it stays a complete inventory — don't restyle what's already there.
- Do not wire these pages into any navigation/sitemap yet (no `next-sitemap` changes, no header/footer nav linking legacy `/[lang]` pages to these) — that's a later lot once the full site exists. These three pages should be reachable directly by URL for review.

## Out of scope for Lot 2

`/journal`, `/paul`, `/maxime`, `/legal`, `/dossiers` — later lots. Do not touch legacy content, CI config beyond what's needed to keep it green, or hosting/deploy config.

## Acceptance criteria

- `npm run lint` and `npm run build` pass (verified by the real CI on PR #208 — push and let it run; don't just assert local success).
- `/`, `/standard`, `/commission` all render, all use only `src/system/tokens.css` values (brand-conformity gate from Lot 1 must pass on these new files).
- `/commission` embeds a real Cal.com inline widget resolving `CAL_LINK_COMMISSION` from `site.config.ts`.
- `grep -riE "silvani|northstar|müller|meridian"` across the new files returns nothing.
- No Hold-to-Commit on any booking/navigation action across the three pages.
- Commit in logical steps (page by page is fine), push to `rebuild/rev01` after each logically-complete step so CI on PR #208 gives real signal along the way — don't batch everything into one giant push at the end.

## Reporting

Standard handoff: what was built per page, any deviation (especially the route-group/layout question), any copy decisions you made where the brief was ambiguous (flag them, don't silently invent positioning claims), and confirmation the CI gates (network-deny, brand-conformity) still pass on the new files.
