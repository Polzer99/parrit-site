# LOT A — CONFORMITY: HOME `/` + shared button + Playwright locks
PARRIT / SITE-CONFORMITY · 2026-08-14 · Authority: `docs/site-prod-rev01/CONFORMITY-REV01.md` §1, §2, §7.5 + prototype `docs/site-prod-rev01/parrit-command-system-rev02.jsx` (view 03 "Website", function `Institution()` / the marketing view — find the view whose hero is "Your company. One system.").

**READ CONFORMITY-REV01.md FIRST. It is the law. The prototype jsx is the source of COPY and exact values — port, do not reinterpret.** Where the brief and the current code disagree, the brief wins. Copy marked verbatim is verbatim, punctuation included.

## Scope (this lot ONLY — parallel lots own the other pages)
- `src/app/(rev01)/page.tsx` — rebuild to §2.1–2.5: hero (eyebrow k, H1 "Your company. One system." clamp(38px,6.6vw,86px), paragraph, CTA row), instrument object (§2.2 — dark carbon object, the ONLY box-shadow of the site: `0 40px 80px -40px rgba(10,11,12,.4)`, rows/numbers/tags exactly as specified, NO fictional client names — top bar label "PARRIT / OS — LIVE DEMO"), operating loop (§2.3), commissioned grid (§2.4), footer per §2.5 (registry line + /legal link + © line, NO seal). Keep the existing /journal link somewhere natural and k-styled (it exists today; the brief doesn't remove it).
- **Shared button fix** in `src/app/(rev01)/rev01.css`: `.rev-button` primary is currently FILLED RED — forbidden (§1.2). Rebuild: primary = 1.5px solid var(--ink) border on light (var(--paper) on dark), background transparent (or paper2), Geist Mono 9.5px, letter-spacing .15em, uppercase, weight 600, padding 12px 18px, square. Ghost = 1px var(--rule-l), color var(--g3). No hover inversions beyond a background shift. Do NOT touch other pages' CSS sections.
- CTA targets: primary "COMMISSION YOUR OPERATING SYSTEM" → `/commission` (the page that holds the Cal embed); ghost "EXAMINE A SYSTEM" → `/standard`.
- New Playwright spec `tests/conformity-home.spec.ts` (§7.5): at 1440×900 assert computed H1 font-size = 86px ±2px; exactly one element on the page with a non-none box-shadow; zero elements with border-radius > 0. MUST import the network deny-all setup like `tests/rev01-system.spec.ts` does. No hardcoded real endpoints.

## Constraints
- Tokens §1 only. No gradients, no new shadows, no radius, no icons, no "!" in copy, PC-10 words banned.
- RevHeader stays (top wordmark bar) — it is the way back home from other pages; do not remove it. Note: its wordmark must not conflict with the k system; leave its current implementation unless it violates §1.1.
- Section rhythm: padding 56px 0; border-top 1px var(--rule-l); content max-width 1200px, side padding 24px.
- Do NOT touch: /standard, /commission, /journal, /paul, /maxime pages or their CSS sections; site.config.ts; proxy.ts; sitemap.

## Acceptance
- `npm run lint` and `npx tsc --noEmit` green (sandbox cannot build — Claude builds).
- Copy diff vs §2 = zero deviation on the verbatim strings.
- Grep SILVANI/NORTHSTAR/Müller/Meridian in your changes = 0.
- Report: diff table (section → property → prototype value → candidate value → status) in your final message. Do not commit; state the intended commit message.
