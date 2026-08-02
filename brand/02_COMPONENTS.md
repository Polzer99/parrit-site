# 02 — Contrats de composants

## Composition rules

1. One dominant idea per viewport.
2. Every section needs a clear function: orient, prove, demonstrate, qualify or convert.
3. Do not create cards merely to fill space. Use a card only when the content is a reusable object with a defined state.
4. Use red for signal, action, causality or status. Never use red as an undifferentiated decorative background across the whole page.
5. Photography and graphic treatment are separate layers. Keep the source photo clean; apply halftone, crop, red fields and line work in Figma or code.
6. Default geometry is square. Radius is `0`. The only exception is `radius.round` on the 速 seal, avatars and status pills.
7. A section must work in grayscale before the red signal is added.
8. No component may introduce a new color, radius, shadow, spacing step or font without updating the tokens.

## Layout primitives

### `PageShell`

- Off-white paper background by default.
- Maximum width: `--container-wide`.
- Content grid: 12 columns desktop, 6 tablet, 4 mobile.
- Outer gutter: 24 px mobile, 40 px tablet, 64–96 px desktop.
- Section spacing: 96–160 px desktop, 64–96 px mobile.

### `SectionLabel`

Use for `PARRIT · NOTES DE TERRAIN`, `01 · ON THE GROUND`, status or category.

- Mono font.
- Uppercase.
- 12–14 px.
- 0.12 em tracking.
- Red for category; black or muted ink for sequence/status.
- Never exceed one line.

### `EditorialHeadline`

- Display condensed font.
- Uppercase for manifesto/editorial pages; sentence case for product usability.
- Tight line height: 0.88–1.02.
- Maximum 10–12 words in a hero.
- Prefer a strong line break over shrinking text.
- One red punctuation mark or key word maximum.

### `BodyCopy`

- Body font.
- 18–22 px on landing pages.
- 60–72 characters per line.
- Concrete nouns and verbs.
- Avoid more than three sentences in one paragraph.

### `RedThread`

A visual primitive for dependency, causality, orchestration or handoff.

- 1–2 px red line.
- May use arrowheads, dots or numbered nodes.
- Must connect meaningful objects.
- Never use as random decoration.
- Motion, when used, reveals direction rather than loops continuously.

### `HalftoneField`

- A red or black dot field derived from an image or geometric mask.
- Use behind a subject, at an edge or as an editorial transition.
- Maximum visual area: roughly 25% of a standard viewport unless the page is an editorial cover.
- Never reduce text legibility.

## Conversion components

### `HermesCaseInput`

Primary conversion entry point.

**Prompt:** “Quelle tâche vous fait encore perdre du temps ?”

English: “Which workflow is still wasting your team’s time?”

Contract:

- One free-text field or voice input.
- One primary action.
- Maximum three qualification questions before returning value.
- Always return a useful summary, even if the case is not feasible.
- Show scope, required access, likely output, uncertainty and next step.
- Never pretend to be a human colleague.

States:

- idle
- typing
- qualifying
- analysing
- summary
- handoff
- unavailable

### `FeasibilitySummary`

Required fields:

- observed workflow
- input
- expected output
- feasibility confidence
- main dependency
- main risk
- first test
- recommended owner
- next action

### `PrimaryCTA`

- Label starts with a verb.
- Default: black background / paper text or red background / paper text.
- Height: 48–56 px.
- Radius: 0. Always.
- One icon maximum; arrow is preferred.
- Hover: slight translation or underline reveal, never glow.

Preferred labels:

- Tester un cas avec Hermès
- Décrire mon workflow
- Vérifier la faisabilité
- Book a feasibility check
- Test a workflow with Hermès

### `SecondaryCTA`

- Text or outlined button.
- Preferred label: `Parler à Paul` / `Talk to Paul`.
- Never visually compete with the primary action.

## Proof components

### `ProofStrip`

Use early on the page.

Contains three to five verifiable facts, for example:

- deployed workflows
- days to first controlled prototype
- functions covered
- named client or partner proof
- auditability / ownership commitment

Never use an unverified vanity number.

### `InputOutputCase`

The core Parrit proof pattern.

Required:

- context
- input before
- output after
- agent actions
- human control point
- time or quality change
- deployment status

The before/after must be operational, not aspirational.

### `AgentTrace`

A readable execution trace showing:

- trigger
- action
- tool or system used
- decision gate
- result
- exception path

Avoid fake terminal noise. The trace must teach the visitor how the system behaves.

### `CaseStudyCard`

- One client or anonymised sector.
- One pain.
- One system.
- One measured result.
- One quote or trace.
- One link.

No generic testimonial-only cards.

## Editorial components

### `EditorialPortrait`

- Subject on one side, 40–55% empty composition space.
- Clean source photograph.
- Optional halftone or red block applied as separate layer.
- Skin remains natural.
- Eye contact or visible concentration.

### `FieldCollage`

- Two to six documentary images.
- Red-thread annotations explain relationships.
- Mono captions.
- Black and white dominant.
- No decorative collage without a narrative.

### `ManifestoCover`

- Section label.
- 4–12 word headline.
- Portrait or symbolic image.
- One red graphic intervention.
- Optional index, issue number or timestamp.

## Navigation and footer

### `SiteHeader`

- Wordmark left.
- Maximum four top-level links.
- One primary CTA.
- Sticky only if it remains visually quiet.
- On scroll, use a paper background and hairline border; no blur-heavy glass.

Recommended navigation:

- Cas d’usage
- Hermès
- Méthode
- Preuves
- CTA

### `SiteFooter`

- Clear contact and legal information.
- Newsletter secondary to the main conversion path.
- One sentence restating the operating promise.
- No giant sitemap unless content volume justifies it.

## Component maturity

Each component must carry one status:

- `experimental`: allowed behind feature flag or in editorial content
- `stable`: approved for production reuse
- `deprecated`: retained for migration only

Component documentation must contain purpose, anatomy, states, responsive behavior, accessibility and analytics events.
