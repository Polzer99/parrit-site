# Sacred Seven — Economics & Data Audit

**Page:** `src/app/page.tsx` | **Date:** 2026-03-31

## Business Model Clarity: Weak
The page positions Parrit.ai as a premium AI consulting firm (luxury tone, name-dropping Bollore/Nestle/Seb). But the model is invisible: no pricing signal, no engagement format (retainer? project? subscription?), no deliverable described. A visitor understands the vibe but not what they are buying. The only conversion path is a calendar link — fine for high-ticket, but the page gives zero reason to believe the call is worth 30 minutes.

## Tracking Coverage: Insufficient
Two `data-ph` attributes exist (`hero-cta`, `final-cta`) but PostHog init uses a placeholder key (`phc_PLACEHOLDER`) — meaning nothing is actually tracked. Even if activated, two CTA clicks are not enough. Missing: scroll depth per section, time-on-page, bounce vs. engaged session, stamp/section visibility (which sections get seen?), email link clicks, mobile vs. desktop split.

## Segmentation: None
The page speaks to one abstract persona. "Automatisation, CRM, Agents, SAP, Processus" is a feature list, not segmentation. A COO looking at process automation and a CTO evaluating SAP agents have completely different pain points. No dynamic content, no persona-specific entry points, no industry vertical signaling beyond the client names.

## Missing Data Points for Conversion Optimization
1. **Traffic source attribution** — no UTM capture, no referrer logging in the webhook payload.
2. **Scroll-to-CTA ratio** — how many visitors reach the bottom CTA vs. only seeing the hero?
3. **Webhook success rate** — `trackCtaClick` fires-and-forgets with `.catch(() => {})`, so you have no idea if lead capture actually works.
4. **Qualification signal** — the calendar link sends everyone to the same slot. No way to pre-qualify or segment inbound.

## One Measurement to Add
**Add UTM parameters to the webhook payload and a `scroll_depth` PostHog event** (fire at 25/50/75/100%). This single addition answers: "Where do my best leads come from?" and "Where does the page lose people?" — the two questions that drive every optimization decision downstream.
