# Sacred Seven -- UX Audit

## Cognitive load
The hero stacks 8 sequential animation steps before a CEO can read the full message. The floating PARRIT.AI logo, italic intro, two-line h1, italic subtitle, CTA, quote, features row, and city line all compete for attention. A CEO scanning in 10 seconds will catch "L'excellence par l'usage" but may miss the CTA entirely because it sits at animation step 5 (delay ~750ms) surrounded by decorative text above and below. Recommendation: cut the hero to 4 elements max (logo, title, one-liner, CTA).

## Visual hierarchy
The eye path is: floating logo (copper, 36-42px) then intro italic (18px, muted) then h1 (48-80px, dark) then subtitle (28-42px, copper) then CTA button. The intro italic at 18px before the h1 breaks the expected logo-to-title descent -- the eye stutters on a secondary phrase before reaching the primary headline. The CTA competes with the quote below it (`hero-quote`, also copper italic) which dilutes the call to action.

## Touch targets
The `ButtonColorful` with `h-14 px-8` gives a 56px height and generous horizontal padding -- this meets the 48px minimum for mobile tap targets. Good. However, the `paul@parrit.ai` link in the footer has no padding and only `font-size: 14px`, making its tap area roughly 14x20px -- well below the 44px Apple HIG minimum.

## Readability
- Body text at `17px / line-height 1.65` with `color: #6B6058` on `background: #f3e8d3` yields a contrast ratio of approximately 3.5:1 -- below the WCAG AA minimum of 4.5:1 for normal text. Darken `--text-muted` to at least `#5A5047` (around 5:1).
- `origin-text` line-height at 1.9 is generous and readable.
- The features row at `14px / font-weight 300` is too light on a textured background. Bump to `font-weight 400`.

## One concrete fix
Remove `hero-intro` (the "Si vous cherchez..." italic block) from above the h1 and place it as a subtitle below "Intelligence artificielle deployee." This collapses the animation from 8 steps to 6, puts the h1 in the CEO's first fixation zone (within 200ms of page load), and makes the visual path: logo (0.15s) then h1 (0.30s) then subtitle (0.45s) then CTA (0.60s). In CSS, darken `--text-muted` from `#6B6058` to `#5A5047` for AA compliance.
