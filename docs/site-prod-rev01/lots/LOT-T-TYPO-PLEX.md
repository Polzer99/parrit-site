# LOT T — TYPE PAIR: IBM Plex Sans + IBM Plex Mono (replaces Geist)
PARRIT / SITE · 2026-08-14 night · Owner direction (Paul, dictated): the parrit.ai
typography must convey **institutional luxury + technology — Palantir-grade seriousness,
the parent institution above Paul and Maxime**. Geist was always the declared transition
face (REV 02 tokens comment + REV 03 rationale R-04). Selected pair: **IBM Plex Sans
(display/UI) + IBM Plex Mono (registry/mono)** — engineered for a century-old technology
institution, OFL-licensed, self-hostable, and already the prototype's own fallback chain
(`"Geist Mono", "IBM Plex Mono", Menlo`).

## Files already staged by Claude (do not re-download)
- `public/fonts/plex/` — IBMPlexSans-{Regular,Medium,SemiBold}.woff2 + IBMPlexMono-{Regular,Medium,SemiBold}.woff2
- `src/og-assets/` — IBMPlexSans-Medium.ttf, IBMPlexMono-{Medium,SemiBold}.ttf

## Changes (REV 01 surfaces ONLY — do not touch legacy `[lang]`, camp, os pages)
1. `src/system/fonts.css` — replace the 7 Geist @font-face blocks with 6 IBM Plex blocks:
   family "IBM Plex Sans" (400/500/600) from `/fonts/plex/IBMPlexSans-*.woff2`,
   family "IBM Plex Mono" (400/500/600) from `/fonts/plex/IBMPlexMono-*.woff2`.
   `font-display: swap` as today. Delete nothing under public/fonts/geist (legacy pages may use it — check: if only REV01 loads fonts.css, geist files simply become unused; leave them, Lot P purges).
2. `src/system/tokens.css` — `--ui: "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;`
   `--mono: "IBM Plex Mono", Menlo, monospace;`
3. `src/app/opengraph-image.tsx` + `src/app/(rev01)/journal/[slug]/opengraph-image.tsx` —
   swap font files to the Plex TTFs (names in ImageResponse fonts[] must match the
   fontFamily strings used in the JSX styles; update both).
4. `tests/rev01-system.spec.ts` asserts local font assets — check it doesn't hardcode
   "geist" paths; if it does, update to plex.
5. Optical compensation (Plex runs slightly wider/looser than Geist at display sizes):
   keep every size/tracking token EXACTLY as specified by REV 03 (88px, -.035em, .18em…).
   Do NOT invent new values. If a string now wraps differently (hero max-width 13ch),
   that is acceptable; note it in the report.

## Acceptance
- `npm run lint` + `npx tsc --noEmit` green (Claude builds + renders).
- Zero remaining `"Geist"` string in src/system/, src/app/(rev01)/, src/app/opengraph-image.tsx.
- Brand + conformity gates pass unchanged (they assert sizes, not families).
- Report: files changed, any wrap/metric observations. Do not commit.
