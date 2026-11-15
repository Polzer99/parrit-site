# CODEX SPEC 2026-11-13 : six client logos on one line (desktop)

**Risk:** low/medium (CSS for one public section, no copy changes, no data changes).
**Decision:** Paul, 13/11/2026: « ok do it ». He accepts slightly smaller logos so that all six fit on one line. This replaces the comment from his 08/11 decision (« six logos, two desktop rows, 1060px »).

## Objective
In `#references` on the home page (fr and en), on desktop (viewport ≥ 1100 px), the six logos (Laparra, Clevery, Forexpert, Joone, SNCF, Carte Noire) sit **on a single line**, centred inside the 1060 px strip, and **no two logos touch**: at least `var(--brand-s3)` between two bounding boxes, measured at 1440 px and at 1100 px.

## Constraints
- Change only `src/system/single-page.css` (logo rules) and, if needed, the component that sets the logo widths/heights. Do not touch `public/clients/`, the list `PUBLIC_CLIENT_NAMES`, or the copy.
- Reduce the logo size **evenly** and as little as possible: keep each logo's proportions and the optical balance (no squashed or tiny logo). If one logo is optically dominant (for example Laparra, which is wide), you may cap its width, but explain why in the report.
- Mobile and tablet (< 1100 px): wrapping onto several lines stays allowed. Keep the current behaviour.
- Keep the spotlight animation, `prefers-reduced-motion`, the 1.08 scale (it must not cause any overlap during the animation either), and the hover/focus pause.
- Update the CSS comment: « Décision de Paul du 13/11/2026 : six logos sur une ligne en desktop (remplace la décision du 08/11) ».
- Brand OS: CSS variables only, no hex values.

## Tests (to add or adapt)
- Playwright (`tests/home-visual-layers.spec.ts` or a new spec): at 1440 and 1100 px, fr and en, the 6 `.client-logo` share the same `top` (±2 px) and the minimum horizontal gap is ≥ the computed value of `--brand-s3`; no logo is narrower than 60 px.
- Existing Node tests stay green (6 logos, no Toyotomi or Hiolle).
- Update any test that encoded « two rows ».

## Proof (report `docs/REPORT-2026-11-13-logos-une-ligne.md`)
- Before/after screenshots at 1440 px and 390 px.
- Result of lint, build, Node tests, and the relevant Playwright tests.

## Patch prepared by Claude (14/11, to be applied in a session with the exemption)

Calculation: SSR widths 307.6 + 204.9 + 105.1 + 216.0 + 106 + 141.8 = 1,081.4 px, plus 5 × 24 px of gaps.
Width factor needed: 0.869 at 1,440 px (1,060 px strip), 0.832 at 1,100 px (1,020 px strip). Smallest logo (Forexpert) ≈ 87 px.
Principle: with `flex-shrink` weighted by `flex-basis` (the inline width), all logos shrink proportionally. The gap stays fixed, so no two logos can touch.

1. `src/system/single-page.css`: replace the comment « Décision de Paul du 08/11/2026, nuit : six logos, two desktop rows, 1060px. » with « Décision de Paul du 13/11/2026 : six logos sur une ligne en desktop, réduits à proportion (remplace la décision du 08/11). »
   At the end of the file:
   ```css
   @media (min-width:1100px){
     .single-page .logo-set {flex-wrap:nowrap;}
     .single-page .client-logo {flex-shrink:1;min-width:0;}
   }
   ```
2. `tests/home-visual-layers.test.mjs`: the test « at most two rows » becomes « one row at ≥ 1100 px ». k = (min(1060, 1100 − 80) − 5 × gap) / Σwidths, assert min(width × k) ≥ 60, and assert that the CSS rule above is present.
3. `tests/single-page.spec.ts` (~l.1209): `rowTops.length` toBe(1), add the width [1100, 800], minimum gap between two adjacent logos ≥ 24 px, every logo ≥ 60 px wide.
4. Battery: lint, build, `node --test tests/*.test.mjs`, Playwright specs single-page + home-visual-layers + intentions, screenshots at 1,440 / 1,100 / 390 px.

## Bounds
At most 2 iterations. If a single line is impossible without a logo under 60 px wide at 1100 px, set the breakpoint at 1200 px and say so.
