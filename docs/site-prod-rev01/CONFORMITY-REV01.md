# PARRIT / SITE-CONFORMITY — REV 01
## Visual correction brief for Claude Code · authority: prototype REV 02
### 2026-08-14 · Written by the brainstorm-side Claude. Every value below is extracted from `docs/site-prod-rev01/parrit-command-system-rev02.jsx` — the prototype Paul approved. Nothing here is a suggestion; it is the target.

---

## 0. METHOD — READ FIRST

The production pages were built from summarized specs and diverged from the approved prototype. That approach is over. From now:

1. **The prototype is a source of COPY, not inspiration.** Its React views 02 (System) and 03 (Website) contain the exact layout, spacing, type scale and copy. Port them; do not reinterpret them.
2. **Token conformity is not visual conformity.** The logo incident proved it: correct hex values, wrong rendering. The gate is now visual.
3. **Screenshot gate, mandatory:** before any visual commit, produce side-by-side screenshots (production candidate vs prototype view) at **1440px** and **390px** widths. A commit ships only if a human squinting at the pair cannot tell which is which, structure-wise.
4. Where this brief specifies copy, it is **verbatim** — reproduce including punctuation. PC-10 governs anything not specified here.
5. Anything visual not covered by this brief or the prototype: **stop and ask Paul.** Do not invent.

---

## 1. GLOBAL TOKENS (must match exactly — check against `src/system/`)

```css
--ink:     #0A0B0C;   /* near-black */
--carbon:  #131518;   /* instrument surface */
--carbon2: #1A1D21;   /* instrument raised */
--paper:   #F1F2F3;   /* cold white — page background of Document register */
--paper2:  #FAFAFB;   /* raised light surface */
--rule-l:  #DDE0E3;   /* 1px rules on light */
--rule-d:  #24282D;   /* 1px rules on dark */
--g2:      #9CA1A6;   /* secondary on dark */
--g3:      #55595E;   /* labels on light */
--g4:      #6F757B;   /* labels on dark */
--red:     #E10600;   /* signal only */
--red-p:   #B80500;   /* pressed */
--ease:  cubic-bezier(.2, 0, 0, 1);
--micro: 120ms; --move: 240ms; --seq: 400ms; --hold: 600ms;
```

Fonts: **Geist** (400/500/600) + **Geist Mono** (400/500/600), self-hosted. No other family, no other weights, no italics anywhere.

Global prohibitions (each one is a build-breaking violation): gradients; box-shadows except the single instrument shadow (§3.2); border-radius except phone-mockup frames; colors outside the token list; red text in paragraphs; icons/illustrations on brand surfaces; exclamation marks and the PC-10 banned words in copy.

Content max-width: **1200px**, side padding 24px. Section rhythm: `padding: 56px 0; border-top: 1px solid var(--rule-l)`.

### 1.1 The registry text style ("k") — used everywhere for labels
```css
font-family: Geist Mono; font-size: 10px; letter-spacing: .16em;
text-transform: uppercase; font-weight: 500;
color: var(--g4) on dark / var(--g3) on light;  /* emphasized spans: --paper / --ink, weight 600 */
```
If a label on the current site is larger, tighter, lowercase, or in Geist (not Mono) — it is wrong.

### 1.2 Buttons
- **Hold/primary look** (used as static CTA style on marketing pages): 1.5px solid border (--ink on light, --paper on dark), transparent/paper2 background, Geist Mono 9.5px, letter-spacing .15em, uppercase, weight 600, padding 12px 18px. Square corners.
- **Ghost:** 1px solid var(--rule-l/–d), color --g3/--g2, same type treatment.
- No filled red buttons on marketing pages except where this brief says so. No rounded corners. No hover color inversions beyond a background shift.

### 1.3 Status marks (shape + colour, never colour alone)
- Operational: 7px grey (#9CA1A6) circle + mono 9.5px label
- Attention: 10×8px triangle
- Critical: 8px red square, label in red
- Executed: 8px filled circle

---

## 2. PAGE `/` — HOME (target: prototype view 03 "Website")

### 2.1 Hero
```
Container: padding 84px 0 52px (desktop).
Eyebrow (k style):        PARRIT — COMPANY OPERATING SYSTEMS
H1 (margin-top 20px):     Your company. One system.
  font: Geist 500; size: clamp(38px, 6.6vw, 86px);
  letter-spacing: -.035em; line-height: 1.0; max-width: 13ch;
Paragraph (margin-top 26px): 15.5px / 1.65 / color --g3 / max-width 44ch:
  "Parrit designs and builds the operating system your company runs on: one place
   to understand what is happening, decide what matters and act — down to your phone."
CTA row (margin-top 32px, gap 12px):
  [primary-look button]  COMMISSION YOUR OPERATING SYSTEM   → the single Cal link
  [ghost button]         EXAMINE A SYSTEM                   → /standard
```
The H1 at full desktop is **86px**. If the current hero is materially smaller, that alone explains "not haut de gamme" — the prototype's authority comes from type scale + emptiness.

### 2.2 The instrument object (non-negotiable)
Immediately after the hero: a dark cockpit object staged on the light page.
```
Wrapper: padding 10px 0 64px. Object: background --carbon; border 1px --rule-d;
max-width 740px; margin 0 auto;
box-shadow: 0 40px 80px -40px rgba(10,11,12,.4);   /* the ONLY shadow on the site */

Top bar (flex space-between, padding 12px 17px, border-bottom 1px --rule-d):
  [Critical status mark] "PARRIT / OS — LIVE DEMO" or neutral client-free labels
  ·   TUE 09:14
  (NO fictional client names in prod: relabel rows generically, keep the numbers.)

Rows (flex baseline, gap 16px, padding 16px 17px, border-bottom 1px --rule-d):
  number: Geist Mono 25px / 500 / min-width 92px / letter-spacing -.02em
  label:  13.5px / #C7CBCF
  right tag: k style, margin-left auto
  Row 1:  3     decisions require attention          TODAY
  Row 2:  €1.2M at risk on blocked orders            ACTION REQUIRED   ← number+tag in --red
  Row 3:  7     actions executed overnight           JOURNAL
Caption under object (centered, k style, margin-top 16px):
  THE OPERATING SYSTEM — SURFACED. COMPLEXITY ABSORBED UNDERNEATH.
```
If the current home has no staged dark instrument, this is the single biggest gap to close.

### 2.3 The operating loop
```
Section (56px 0, border-top): heading 22px/600 "One operating loop" + k label "SCREEN 02"
3 equal columns, border 1px --rule-l, background --paper2, internal 1px separators:
  Column head: Geist Mono 11px / .2em / 600, margin-bottom 12px
  Column body: 13px / 1.6 / #26282B
  UNDERSTAND — "The system maintains a live model of the company: orders, cash,
                operations, people, clients — provenance on every number."
  DECIDE (head in --red) — "Only what requires the executive reaches the executive.
                Framed, sourced, quantified, with its path of return documented."
  ACT — "A decision executes through the same system that surfaced it — held,
                committed, journaled."
Mobile: columns stack, separators become horizontal.
```

### 2.4 Commissioned, not subscribed
```
Section heading: "Commissioned, not subscribed" + k "SCREEN 03"
3 cells, 1px grid (background --rule-l as grout, cells --paper2, padding 26px 24px):
  cell = k label + h4 (16px/600, margins 12px 0 8px) + body 13px/1.6:
  01 — EXAMINATION / "We study how your company actually operates." /
    "Not a workshop. A diagnostic of flows, decisions and failure points, documented
     as an engineering brief."
  02 — CONSTRUCTION / "We build the first system into production." /
    "One critical operation, rebuilt end-to-end and certified to the Parrit Standard
     before anything else begins."
  03 — COMPOUNDING / "Each capability joins the Operating System." /
    "The system grows with the company. You own it — code, data, documentation —
     as company infrastructure."
```

### 2.5 Footer (site-wide)
Registry line, k style, in every page footer: `PARRIT / SITE · REV 01 · 2026` + the seal (`9px red square + BUILT TO THE PARRIT STANDARD`) reserved — the seal does NOT appear in the footer (it certifies delivered systems only); footer carries registry line + /legal link + © line only.

---

## 3. PAGE `/standard` (target: prototype view 02, doctrine block)

```
Page register: light (--paper).
Intro section: eyebrow k + display statement (Geist 500, clamp 30-52px, -.03em):
  "Every system we deliver is certified to the same specification."
Doctrine block: border 1.5px solid --ink; background --paper2.
  Header row (flex space-between, padding 16px 22px, border-bottom 1.5px --ink):
    THE PARRIT STANDARD          SPECIFICATION · STD-1.0 · 2026
  6 rows, grid 84px / 158px / 1fr, 1px --rule-l separators; cells padding 15px 22px:
    col 1 (k): PS-01 … PS-06   ·   col 2: name, 14px/600   ·   col 3: 13px/1.55 #26282B
    PS-01 Observable  — "The operator can determine the state of the system at any
                         moment, without asking anyone."
    PS-02 Actionable  — "Every surfaced piece of information leads to a possible
                         action within the same view."
    PS-03 Traceable   — "Every significant decision carries its origin: data, author,
                         timestamp, rationale."
    PS-04 Reversible  — "Every critical process has a documented path of return
                         before it enters production."
    PS-05 Owned       — "The client holds the system, its data and its documentation
                         as company assets."
    PS-06 Compounding — "Each new capability increases the value of every capability
                         already in production."
  Footer row (border-top 1.5px --ink, padding 15px 22px):
    [9px red square]  CERTIFIED — BUILT TO THE PARRIT STANDARD
Below the block: single CTA (primary-look) to the Cal link. Nothing else on the page.
```
The doctrine is a **specification document**, not a feature grid: if the current page renders PS-01..06 as cards, icons, or columns, rebuild as the table above.

---

## 4. PAGE `/commission`

```
Register: light page, ONE dark instrument at center (same staging rules as §2.2).
Above the instrument: eyebrow k "PARRIT — COMMISSION" + display statement
  "Commission your Operating System." (same display specs as /standard intro)
+ paragraph 15.5px --g3 max-width 44ch:
  "One conversation to examine how your company operates. The first step —
   an examination, not a sales call."
The instrument = the Cal.com embed, framed exactly per docs/site-prod-rev01/parrit-cal-integration.jsx:
  - wrapper: --carbon, 1px --rule-d, max-width 860px, the single shadow
  - top bar (k): PARRIT / COMMISSION          SELECT A TIME
  - Cal inline embed: namespace-scoped, theme dark, layout month_view,
    styles.branding.brandColor #E10600,
    cssVarsPerTheme.dark: cal-brand #E10600, cal-bg #131518,
    cal-bg-emphasis #1A1D21, cal-border #24282D
  - bottom bar (k): 30 MIN · VIDEO          [9px red square] COMMISSIONED, NOT SUBSCRIBED
Standard button opens/holds nothing here — booking is NOT a Hold-to-Commit action.
Cal event to relabel on Cal.com side (Paul's account): "Parrit — Examination · 30 min".
```

---

## 5. `/journal` (conformity pass only — content already migrated)

- Register: light. Article layout: measure 62-68ch, body 15-16px/1.7, headings Geist 600.
- No red anywhere in article bodies. No bullets-with-icons, no pull-quote styling.
- Each article footer: registry line `WE FIND THE WAY · <DATE> · PARRIT / JOURNAL`.
- Index page: bordered list rows (1px separators), NOT card grids with thumbnails.
- The 9 machine-translated glossary entries: noindex immediately, republish after human review.

---

## 6. LOGO — replace REV 03 with REV 04 everywhere

The approved mark is **live-text `[P.]` in Geist Mono 600** (as on the 10-proposal board). The REV 03 files in the repo are hand-drawn geometric paths — visibly different; Paul rejected them. Paul supplies the REV 04 source (light mark received 14/08: live-text SVG, ink text, red dot). Actions:
1. Replace in `docs/site-prod-rev01/` and `public/brand/`.
2. Regenerate PNG derivatives (512/192/180/32) from the REV 04 favicon.
3. Replace `src/app/icon.svg` and `apple-icon.png`.
4. Prove by rendering: screenshot of favicon + any on-site mark next to the board's 07 cell. Same glyphs or it doesn't ship.
Note: the site self-hosts Geist Mono, so live-text SVG renders correctly on-site with zero extra work.

---

## 7. SCREENSHOT GATE — protocol

For each corrected page:
1. Run the prototype (`docs/site-prod-rev01/parrit-command-system-rev02.jsx`) locally; open the matching view.
2. Capture both at 1440px and 390px: prototype view / production candidate.
3. Produce a diff table: section → property (type size, spacing, presence, structure) → prototype value → candidate value → status.
4. Attach the 4 screenshots + table to the commit/PR. **No visual commit without them.**
5. Playwright: add per-page assertions locking the H1 computed font-size at 1440px (±2px), the presence of exactly one box-shadow on the page, and zero border-radius outside phone frames. These mechanize the three most-broken rules.

---

## 8. ACCEPTANCE CHECKLIST (per page, all required)

- [ ] H1/display sizes match the clamp values above at 1440px (±2px)
- [ ] All labels in k style (Mono 10px, .16em, uppercase) — zero exceptions
- [ ] Exactly one box-shadow per page maximum (the instrument), zero elsewhere
- [ ] Zero border-radius outside phone mockups
- [ ] Zero gradients, zero off-token colors (mechanized brand check passes)
- [ ] Zero fictional client names (grep SILVANI/NORTHSTAR/Müller/Meridian)
- [ ] Copy verbatim where specified; PC-10 clean elsewhere (no banned words, no "!")
- [ ] Registry line present in footer
- [ ] Screenshot pairs (1440 + 390) attached and structurally indistinguishable
- [ ] REV 04 logo rendered and visually verified against the board

## 9. OUT OF SCOPE — do not touch
The experts-network section, the prototypes funnel, /dossiers content, and any new page: frozen until brief REV 02 (awaiting Paul's answers). This brief corrects what exists; it adds nothing.

## 10. REPORTING
One report per corrected page: what diverged (the diff table), what was changed, screenshots, what was refused (undecidable without Paul). PC-10 register. Stop at any ambiguity — ask, don't invent.
