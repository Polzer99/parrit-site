# Visual Audit: Parrit.ai vs houseofouss.com

> Generated 2026-03-31. Source of truth: houseofouss.com production CSS (`b422fae4c87022cc.css`) + JS chunks.

---

## 1. Background

| Property | houseofouss | parrit | MATCH |
|----------|-------------|--------|-------|
| Main bg | `#f3e8d3` (warm parchment, CSS var `--bg`) | `#F5F1EA` (lighter, cooler cream) | NO |
| Surface / card bg | `#faf6ef` (--surface / `.bg-shironeri` = `rgb(250,246,239)`) | N/A (no surface token) | MISSING |
| Grain overlay | `body::before` with SVG fractalNoise, `opacity: 0.03`, fixed, full-screen | None | MISSING |

**What needs to change:** Parrit bg is too white/cool. Switch to `#f3e8d3` or very close. Add the paper grain texture overlay for editorial feel. Add a `--surface` token (`#faf6ef`).

---

## 2. Typography -- Fonts

| Property | houseofouss | parrit | MATCH |
|----------|-------------|--------|-------|
| Heading font | **Instrument Serif** (Google Font, weight 400, italic available) | **Playfair Display** (weights 400-700) | NO |
| Body / sans font | **Instrument Sans** (weights 400, 500, 600, 700) | **Inter** (weights 300, 400, 500) | NO |
| Mono font | SF Mono, Fira Code, monospace | None | MISSING |
| CSS var heading | `--font-serif` | `--font-heading` | Different naming |
| CSS var body | `--font-sans` | `--font-body` | Different naming |

**What needs to change:** The font pairing is fundamentally different. Instrument Serif + Instrument Sans is the signature of houseofouss. Playfair Display is a high-contrast Didone; Instrument Serif is a low-contrast transitional serif with a softer, more approachable feel. Instrument Sans is a geometric humanist sans-serif; Inter is a neo-grotesque. If the goal is to match the feel, switch to Instrument Serif + Instrument Sans.

---

## 3. Typography -- Hero Heading

| Property | houseofouss | parrit | MATCH |
|----------|-------------|--------|-------|
| Font family | `var(--font-serif)` = Instrument Serif | `var(--font-heading)` = Playfair Display | NO |
| Size | `.text-hero` = `clamp(2.75rem, 6vw, 4.5rem)` = clamp(44px, 6vw, 72px) | `clamp(48px, 8vw, 80px)` | NO -- parrit is ~10% larger |
| Weight | 400 (normal) -- serif does the work | 700 (bold) | NO |
| Line-height | 1.05 | 1.05 | YES |
| Letter-spacing | -0.02em | -0.02em | YES |
| Style | Often paired with italic (`font-serif italic`) | Bold roman + italic accent in separate span | PARTIAL |

**What needs to change:** Parrit hero is bolder and larger. houseofouss uses weight 400 and lets the serif character carry authority. Reduce weight to 400, reduce size to `clamp(44px, 6vw, 72px)`.

---

## 4. Typography -- Section Headings (h2, h3)

| Property | houseofouss | parrit | MATCH |
|----------|-------------|--------|-------|
| h2 size | `.text-h2` = `clamp(2.25rem, 5vw, 3.5rem)` = clamp(36px, 5vw, 56px) | Dark CTA h2 = `clamp(32px, 4vw, 44px)` | NO -- parrit is smaller |
| h2 weight | 400 (via `[& h2]:font-normal`) | 400 | YES |
| h2 font | `var(--font-serif)` via `[& h2]:font-serif` | `var(--font-heading)` (Playfair) | NO (font diff) |
| h2 line-height | 1.1 | Not explicit (browser default) | NO |
| h2 letter-spacing | -0.02em | -0.01em | CLOSE |
| h3 size | `.text-h3` = 1.75rem (28px), line-height 1.3 | N/A -- no h3 used | N/A |
| h3 letter-spacing | -0.01em | N/A | N/A |

**What needs to change:** Align h2 sizing to houseofouss range. Add explicit line-height 1.1 and letter-spacing -0.02em.

---

## 5. Typography -- Body Text

| Property | houseofouss | parrit | MATCH |
|----------|-------------|--------|-------|
| Font | Instrument Sans via `var(--font-sans)` | Inter via `var(--font-body)` | NO |
| Base size | `1.0625rem` (17px) on body | 17px on `.prose-section p` and `.origin-text` | YES |
| Line-height | 1.65 on body; `.text-body` = 1.75; `[& p]:leading-relaxed` = 1.625 | 1.85 on `.prose-section p`; 1.9 on `.origin-text` | NO -- parrit is more spaced |
| Weight | 400 (normal) default | 300 (light) on prose and origin | NO |
| Color | `--text` = `#2b2b2a` (body), `--muted` = `#7d7d7d` for secondary | `--text-muted` = `#6B6058` (warm brown-gray) | DIFFERENT -- houseofouss muted is neutral gray, parrit is warm |
| Text-align | left (default) + `.text-justify` class available | `text-align: justify` on prose | DIFFERENT |

**What needs to change:** Reduce line-height to 1.65-1.75 range. Increase body weight from 300 to 400. Consider switching from justify to left alignment. Muted color difference is a design choice (warm vs neutral) -- keep if intentional.

---

## 6. Typography -- Labels / Small Caps

| Property | houseofouss | parrit | MATCH |
|----------|-------------|--------|-------|
| Class | `.label-caps` | `.section-label` | Different name |
| Font-size | 0.6875rem (11px) | 11px | YES |
| Font-weight | 600 | 500 | NO |
| Letter-spacing | 0.15em | 0.15em | YES |
| Text-transform | uppercase | uppercase | YES |
| Color | Not specified in .label-caps (contextual) | `var(--accent)` = `#c8956c` (copper) | DIFFERENT |

**What needs to change:** Increase label weight from 500 to 600. Color choice is a conscious brand decision.

---

## 7. Colors -- Full Palette Comparison

| Token | houseofouss | parrit | MATCH |
|-------|-------------|--------|-------|
| Background | `--bg: #f3e8d3` | `--bg: #F5F1EA` | NO (parrit is cooler/lighter) |
| Surface | `--surface: #faf6ef` | N/A | MISSING |
| Primary text | `--text: #2b2b2a` (near-black) | `--text: #2A2520` (dark brown) | CLOSE (parrit warmer) |
| Muted text | `--muted: #7d7d7d` (neutral gray) | `--text-muted: #6B6058` (warm gray-brown) | NO |
| Accent | `--accent: #6a4c9c` (purple/komurasaki) | `--accent: #c8956c` (copper/gold) | NO -- totally different hue |
| Depth | `--depth: #2d4a5c` (dark teal) | N/A | MISSING |
| Named colors (houseofouss) | komurasaki `rgb(106,76,156)`, akane `rgb(194,91,74)`, matcha `rgb(107,143,94)`, ochre `rgb(212,168,67)`, nezumi `rgb(125,125,125)`, sumi `rgb(43,43,42)`, shironeri `rgb(250,246,239)`, torinoko `rgb(243,232,211)` | Single accent `#c8956c` | VASTLY DIFFERENT |

**What needs to change:** This is the biggest divergence. houseofouss uses a Japanese-inspired named color system with purple as accent. Parrit uses a warm copper/gold as accent. This is a **brand identity choice** -- Parrit should NOT copy the purple. However, the background warmth (`#f3e8d3` vs `#F5F1EA`) and muted gray neutrality could be aligned.

---

## 8. Spacing -- Section Padding

| Property | houseofouss | parrit | MATCH |
|----------|-------------|--------|-------|
| Section vertical | `.py-24` = 6rem (96px); `.py-16` = 4rem (64px) | `.section-space` = 112px top+bottom | NO -- parrit is more generous |
| Section vertical (md) | `md:py-24` = 96px | same 112px | NO |
| Hero min-height | `.min-h-[100dvh]` (dynamic viewport height) | `min-h-screen` (100vh) | CLOSE (dvh vs vh) |
| Content max-width | `.max-w-content` = 900px; `.max-w-prose` = 720px | `.prose-section` max-width 680px; `.origin-section` max-width 620px | NO -- parrit is narrower |
| Horizontal padding | `.px-6` = 1.5rem (24px); `.md:px-12` = 3rem (48px) | 24px mobile, 48px desktop on prose | YES |

**What needs to change:** Reduce section padding from 112px to 96px. Widen prose max-width from 680px to 720px to match houseofouss `.max-w-prose`. Consider using `100dvh` instead of `100vh`.

---

## 9. Spacing -- Between Elements

| Property | houseofouss | parrit | MATCH |
|----------|-------------|--------|-------|
| After label | `.mb-16` = 4rem (64px); `.mb-10` = 2.5rem (40px) | `margin-bottom: 40px` | CLOSE |
| Between paragraphs | `space-y-8` = 2rem (32px); `space-y-6` = 1.5rem (24px) | `margin-bottom: 28px` on prose p | CLOSE |
| After heading | `.mb-6` = 1.5rem (24px); `.mb-8` = 2rem (32px) | 8-12px between hero title lines | NO -- parrit is tighter in hero |
| Gap in grids | `.gap-6` = 1.5rem; `.gap-10` = 2.5rem | N/A (no grids) | N/A |

**What needs to change:** Minor adjustments. Parrit hero title lines could use more breathing room (16-20px gap instead of 8-12px).

---

## 10. CTA Buttons

| Property | houseofouss | parrit | MATCH |
|----------|-------------|--------|-------|
| Style | `.rounded-md` (8px), solid fill | `.rounded-full` (999px), pill shape | NO |
| Background | `bg-komurasaki` = `rgb(106,76,156)` purple | Gradient `from-amber-700 via-orange-600 to-yellow-700` | NO |
| Hover bg | `hover:bg-[#7D5DB0]` (lighter purple) | `hover:scale-105 hover:shadow-lg` | DIFFERENT approach |
| Text color | `text-shironeri` = `rgb(250,246,239)` cream-white | `text-white` (#fff) | CLOSE |
| Font size | `text-base` = 1rem (16px) | 15px on .cta-button; ButtonColorful overridden to `text-base` | CLOSE |
| Font weight | `font-semibold` (600) | `font-medium` (500) | NO |
| Padding | `px-10 py-4` = 40px horizontal, 16px vertical | `h-14 px-8` = 56px height, 32px horizontal (ButtonColorful) | DIFFERENT |
| Letter-spacing | `tracking-wide` = 0.025em | 0.03em on .cta-button | CLOSE |
| Border-radius | 8px (`rounded-md`) | 999px (full pill) | NO |
| Hover animation | `hover:-translate-y-0.5 hover:shadow-lg hover:shadow-komurasaki/20` | `hover:scale-105 hover:shadow-lg hover:shadow-amber-700/25` | SIMILAR concept |

**What needs to change:** houseofouss uses a squared-off rounded rectangle (8px), not a pill. Weight is semibold (600) not medium (500). The gradient vs solid fill is a Parrit brand choice, but the shape should be closer to houseofouss if matching is the goal: switch from `rounded-full` to `rounded-md` (8px).

---

## 11. Nav

| Property | houseofouss | parrit | MATCH |
|----------|-------------|--------|-------|
| Height | Not explicitly fixed -- uses py-3 + content | Fixed 72px | DIFFERENT approach |
| Background | Not visible in extracted CSS (likely transparent/scroll-based) | Transparent, frosted glass on scroll | LIKELY SIMILAR |
| Logo font | Instrument Sans (brand) | Inter (var(--font-body)) | NO (font diff) |
| Logo size | Not extracted | 13px, weight 500, letter-spacing 0.18em | N/A |
| Logo color | Not extracted | `var(--accent)` copper | N/A |
| Nav CTA | Not visible in CSS (may be inline in page) | Pill button, accent bg | N/A |

**What needs to change:** Nav is similar in concept. Font difference follows from overall font choice.

---

## 12. Dividers / Decorations

| Property | houseofouss | parrit | MATCH |
|----------|-------------|--------|-------|
| Horizontal rule | `border-sumi/[0.08]` = `rgb(43,43,42)` at 8% opacity | `rgba(42,37,32,0.08)` via `--border` | YES (nearly identical) |
| Decorative line | Not prominent -- uses border classes | `.copper-ornament` 48px x 1px, accent color, 0.6 opacity | PARRIT EXTRA |
| Dot separator | Not used | `.copper-dot` 4px circle, accent color | PARRIT EXTRA |
| Paper grain | SVG fractalNoise texture at 3% opacity, full screen | None | MISSING |

**What needs to change:** Add the paper grain texture. The copper ornament and dot are Parrit-specific embellishments that houseofouss does not use -- consider removing for closer match.

---

## 13. Social Proof / Trust Styling

| Property | houseofouss | parrit | MATCH |
|----------|-------------|--------|-------|
| Member photos | Grid of circular portraits, `-space-x-3` overlap | No member photos | DIFFERENT |
| Counter | Live founding member counter (font-mono, text-small) | No counter | DIFFERENT |
| Trust section | Member names + roles in grid | `.trust-label` + `.trust-names` (client names) | SIMILAR concept |
| Testimonial style | Not prominent on homepage | Not present | N/A |

**What needs to change:** N/A -- these are content differences, not pure CSS.

---

## 14. Animations / Transitions

| Property | houseofouss | parrit | MATCH |
|----------|-------------|--------|-------|
| Scroll reveal | `translate-y-4 opacity-0` -> `translate-y-0 opacity-100`, `duration-500 ease-out` | `.fade-in` translateY(20px) -> 0, opacity 0.7s ease-out | SIMILAR |
| Hero entrance | Not visible in CSS (may be JS-based) | `@keyframes hero-fade-up` 0.8s with staggered delays 0.1-1.15s | PARRIT has more elaborate hero animation |
| Link transitions | `transition-colors duration-150ms` (Tailwind default) | `color 0.3s ease, opacity 0.3s ease` | SIMILAR |
| Button hover | `-translate-y-0.5` (2px lift) | `-translate-y-2px` + scale on ButtonColorful | CLOSE |

**What needs to change:** Minor. Parrit's staggered hero animation is a nice touch that houseofouss doesn't have.

---

## 15. Overall Feel -- Summary

### What houseofouss does differently:
1. **Warmer, darker parchment background** (`#f3e8d3` vs `#F5F1EA`) with paper grain texture
2. **Lighter font weight** throughout -- body at 400, headings at 400, labels at 600. Feels effortless.
3. **Instrument Serif + Instrument Sans** -- a cohesive Google Font pairing with lower contrast than Playfair Display
4. **Tighter line-heights** (1.65 body vs 1.85) -- text feels more compact and editorial
5. **Squared rounded buttons** (8px) not pills (999px) -- more editorial, less SaaS
6. **Wider content area** (720px prose vs 680px)
7. **Less vertical padding** between sections (96px vs 112px)
8. **Paper grain texture** on body -- subtle tactile quality
9. **No decorative embellishments** (no copper dots, ornaments) -- minimalism through restraint

### Priority changes for Parrit to match the feel:
1. **Background color** -- shift from `#F5F1EA` to `#f3e8d3` (or close)
2. **Add paper grain overlay** -- SVG noise at 3% opacity
3. **Font weights** -- reduce body from 300 to 400, headings from 700 to 400
4. **Line-heights** -- reduce from 1.85 to 1.65 on body text
5. **Button shape** -- consider 8-12px border-radius instead of full pill
6. **Section spacing** -- reduce from 112px to 96px
7. **Prose width** -- increase from 680px to 720px
8. **Font swap (optional, high-impact)** -- Instrument Serif + Instrument Sans if full alignment desired

### What Parrit should KEEP (brand differentiators):
- Copper/gold accent (`#c8956c`) -- this is Parrit's identity, not the purple
- The staggered hero animation
- The emblem/logo image in the hero
- The dark CTA footer section
