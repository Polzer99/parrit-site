# LOT C — CONFORMITY: `/commission` (staged dark Cal instrument)
PARRIT / SITE-CONFORMITY · 2026-08-14 · Authority: `docs/site-prod-rev01/CONFORMITY-REV01.md` §1, §4 + `docs/site-prod-rev01/parrit-cal-integration.jsx` (exact embed config) + prototype `parrit-command-system-rev02.jsx` for staging.

**READ CONFORMITY-REV01.md FIRST. It is the law.** Verbatim copy, punctuation included.

## Scope (this lot ONLY)
- `src/app/(rev01)/commission/page.tsx` — rebuild to §4:
  - light page; eyebrow k "PARRIT — COMMISSION"; display "Commission your Operating System." (Geist 500, clamp(30px,4vw,52px), -.03em); paragraph 15.5px var(--g3) max-width 44ch: "One conversation to examine how your company operates. The first step — an examination, not a sales call."
  - ONE dark instrument at center = the Cal embed, framed per parrit-cal-integration.jsx: wrapper background var(--carbon), border 1px var(--rule-d), max-width 860px, box-shadow `0 40px 80px -40px rgba(10,11,12,.4)` (the ONLY shadow on this page); top bar k: "PARRIT / COMMISSION" / "SELECT A TIME"; bottom bar k: "30 MIN · VIDEO" / 9px red square + "COMMISSIONED, NOT SUBSCRIBED".
  - Strip any other current sections (the 3-step "Commissioned, not subscribed" grid lives on the home now — remove it here if present).
- `src/system/components/CalInline.tsx` — align the embed to parrit-cal-integration.jsx: namespace-scoped, theme "dark", layout month_view, styles.branding.brandColor #E10600, cssVarsPerTheme.dark { cal-brand: #E10600, cal-bg: #131518, cal-bg-emphasis: #1A1D21, cal-border: #24282D }. Keep calLink default = CAL_LINK_COMMISSION from site.config.ts. Booking is NOT Hold-to-Commit — no Hold component anywhere here. NOTE: /paul and /maxime also render this component (hidden pages) — keep its API backward-compatible.
- CSS: add/replace ONLY the /commission-specific section in `src/app/(rev01)/rev01.css`. Assume `.rev-button` primary is being restyled by a parallel lot (1.5px ink border, not filled red).
- New Playwright spec `tests/conformity-commission.spec.ts`: at 1440×900 assert display font-size 52px ±2px; EXACTLY one box-shadow on the page (the instrument); zero border-radius. Import the network deny-all setup like `tests/rev01-system.spec.ts` (the Cal request must be blocked/mocked by the deny-all — assert the wrapper renders, not the live calendar).

## Constraints
- Tokens §1 only; no icons; no "!"; PC-10 words banned.
- Keep RevHeader + footer registry line.
- Do NOT touch: home, /standard, /journal pages or their CSS; site.config.ts values; proxy.ts; sitemap.

## Acceptance
- `npm run lint` + `npx tsc --noEmit` green (Claude builds and runs the real server + real Cal check).
- Copy diff vs §4 = zero deviation.
- Report: diff table. Do not commit; state the intended commit message.
