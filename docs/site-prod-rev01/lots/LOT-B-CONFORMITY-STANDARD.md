# LOT B — CONFORMITY: `/standard` (doctrine = specification table)
PARRIT / SITE-CONFORMITY · 2026-08-14 · Authority: `docs/site-prod-rev01/CONFORMITY-REV01.md` §1, §3 + prototype `docs/site-prod-rev01/parrit-command-system-rev02.jsx` (view 02 "System" — function `BrandSystem()` contains the PS-01..06 doctrine block with exact styles).

**READ CONFORMITY-REV01.md FIRST. It is the law.** The doctrine is a SPECIFICATION DOCUMENT, not a feature grid: if the current page renders PS-01..06 as cards/columns, rebuild as the table in §3. Verbatim copy, punctuation included.

## Scope (this lot ONLY)
- `src/app/(rev01)/standard/page.tsx` — rebuild to §3 exactly:
  - light register (--paper), intro: eyebrow k + display "Every system we deliver is certified to the same specification." (Geist 500, clamp(30px, 4vw, 52px) — brief says clamp 30-52px, letter-spacing -.03em)
  - doctrine block: border 1.5px solid var(--ink), background var(--paper2); header row THE PARRIT STANDARD / SPECIFICATION · STD-1.0 · 2026 (border-bottom 1.5px --ink); 6 rows grid 84px/158px/1fr, 1px --rule-l separators, cells padding 15px 22px; PS-01..PS-06 with the exact six body strings from §3; footer row (border-top 1.5px --ink): 9px red square + CERTIFIED — BUILT TO THE PARRIT STANDARD.
  - below the block: single primary-look CTA linking to `/commission`. NOTHING else on the page (strip any other current sections).
- CSS: add/replace ONLY the /standard-specific section in `src/app/(rev01)/rev01.css` (search for the standard page's existing selectors). Assume `.rev-button` primary is being restyled by a parallel lot to 1.5px ink border (NOT filled red) — use the class, don't restyle it here.
- New Playwright spec `tests/conformity-standard.spec.ts`: at 1440×900 assert display font-size = 52px ±2px; zero box-shadow on this page; zero border-radius; the six strings PS-01..PS-06 present. Import the network deny-all setup like `tests/rev01-system.spec.ts`.
- Mobile (390px): the 84/158/1fr grid may stack gracefully (k code above name above body) — keep 1px separators.

## Constraints
- Tokens §1 only. No shadows on this page at all. No radius, no gradients, no icons, no "!" .
- Keep RevHeader and the footer registry line as they are.
- Do NOT touch: home, /commission, /journal pages or their CSS sections; site.config.ts; proxy.ts; sitemap; shared `.rev-button` rules.

## Acceptance
- `npm run lint` + `npx tsc --noEmit` green (Claude builds).
- Copy diff vs §3 = zero deviation.
- Report: diff table (section → property → prototype → candidate → status). Do not commit; state the intended commit message.
