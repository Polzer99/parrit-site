# LOT 4 — PERSONAL PAGES: /paul, /maxime, /legal
PARRIT / SITE-PROD · REV 01 · LOT 4 · 2026-08-14

Branch: `rebuild/rev01`. Read `LOT-1-FOUNDATION.md` and `LOT-2-PAGES.md` first — reuse `src/system/` tokens/components (`Frame`, `Hold`, `St`, `K`, `RegistryLine`, `Seal`, `Instrument`, `CalInline`), don't recreate. Authority: `parrit-codes-rev02.html` → `parrit-cal-integration.jsx` → `ARCHITECTURE.md` §3.

Do not touch legacy `src/app/[lang]/...` or the current `/fondateurs` page — this lot builds new pages under `src/app/(rev01)/paul/`, `src/app/(rev01)/maxime/`, `src/app/(rev01)/legal/`, following the exact isolation pattern Lot 1/2 established (add each new top-level path to the exclusion list in `src/proxy.ts`'s matcher AND to the early-return block, same as `/`, `/standard`, `/commission` — **this is exactly the bug fixed in the last commit on this branch, don't repeat it**).

## `/paul` and `/maxime`

Per the locked funnel decision (`ARCHITECTURE.md` §3): "personal page: positioning, the 10-hour coaching offer, Cal embed (coaching), bridge section → Parrit". Per the production brief: "lighter institutional weight — more first person, same typography and grid" than the Parrit institution pages.

Structure for each (same shape, different person):
- Hero: first-person positioning statement. For Paul: something like "I turn operational problems into systems that work" (per the brief's suggested angle — adapt, don't invent a different positioning). For Maxime: the architecture/infrastructure/reliability angle (per the brief). Do not invent biographical claims, credentials, or numbers not already established elsewhere in this repo (check `src/app/fondateurs/page.tsx` in the legacy tree for existing real bio content to reuse as source material — read-only, do not modify it).
- The 10-hour coaching offer block: use `site.config.ts`'s `COACHING_OFFER_NAME` and `COACHING_PRICE_DISPLAY`. Both are `"TBD"` right now. Render them through the `isPlaceholder()` helper from Lot 1: when a value is a placeholder, show a visibly marked `[TO FILL]` block (per the brief: "clearly marked, blocks the launch checklist") instead of the raw string "TBD" — do not silently hide the offer section, do not invent a name or price.
- Cal.com embed: reuse `CalInline` from `src/system/components/` (built in Lot 2B), but resolve `CAL_LINK_COACHING_PAUL` / `CAL_LINK_COACHING_MAXIME` from `site.config.ts` instead of `CAL_LINK_COMMISSION`. Both are also `"TBD"` — if `CalInline` is given a placeholder link, it should render the same `[TO FILL]` block instead of trying to boot a Cal.com embed with an invalid link (extend `CalInline` to accept a `calLink` prop with this placeholder-aware behavior, defaulting to the commission link if unset, since Lot 2B hardcoded it — check and adapt).
- Bridge section: "when the problem outgrows coaching" → link to `/commission` (the Parrit institution engagement). Real copy, no invented numbers.
- Registry line footer.
- **No prices beyond the `COACHING_PRICE_DISPLAY` placeholder mechanism** — no other numbers invented anywhere on these pages.

## `/legal`

Rewrite in English of the current site's legal pages. Source material (read-only, legacy tree, French): `src/app/[lang]/mentions-legales/` and `src/app/[lang]/confidentialite/` if they exist under that path — locate them first (the live audit found `/fr/mentions-legales` and `/fr/confidentialite`; find the corresponding source files in this repo, they may be under a slightly different path — search before assuming). Translate faithfully (legal content — do not paraphrase creatively, translate accurately; if genuinely unsure of a legal term's correct English equivalent, leave a `[TRANSLATOR NOTE: ...]` comment in the MDX/component source rather than guessing).
- Single page `src/app/(rev01)/legal/page.tsx` combining both (mentions légales + privacy) under clear headings, OR two pages if the source content is long enough to warrant it — your call, document which you picked.
- Registry line footer. Document register, no decoration.

## Explicitly out of scope

No navigation wiring yet. No changes to `site.config.ts`'s placeholder values themselves (that's Paul's decision, not this lot's). No changes to `CalInline`'s core Cal.com integration logic beyond adding the placeholder-aware `calLink` prop.

## Acceptance criteria

- `npm run lint` && `npm run build` green (verified for real).
- `/paul`, `/maxime`, `/legal` all render at their own top-level URLs (not nested under any locale prefix), confirmed via a real running server (`next start` + `curl`), not just the build log — the last lot's bug (missing proxy exclusion) must not repeat; explicitly test all three URLs return 200 before reporting done.
- The 4 coaching-related placeholders render as visible `[TO FILL]` blocks, not as the literal string "TBD" and not silently omitted.
- No invented prices, credentials, or biographical claims.
- Brand-conformity gate passes.
- Commit in logical steps (paul, then maxime, then legal — or shared-component-first if you extract a common personal-page layout), don't push.

## Reporting

What was built per page, the `/legal` structure choice (one page or two), any legal-term translation notes, and explicit confirmation (with the actual curl/server output) that all three new URLs resolve to 200 — this is the exact class of bug found in Lot 2, verify it yourself before reporting done.
