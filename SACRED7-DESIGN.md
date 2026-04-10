# Sacred Seven -- Product Design Audit

**Page:** `src/app/page.tsx` (Parrit.ai landing page)
**Date:** 2026-03-31

## What problem does this page solve for the visitor?
It signals that Parrit.ai is a premium, execution-focused AI consultancy -- not another "we talk about AI" agency. The visitor's problem: finding a partner who actually deploys AI, not one who pitches decks. The page addresses this with a contrarian opener ("vous n'etes pas au bon endroit") and a lean Diagnostic > Conception > Deploiement funnel.

## Is the value proposition clear in 5 seconds?
**No.** "L'excellence par l'usage" is elegant but abstract. A first-time visitor (CEO PME/ETI) cannot tell in 5 seconds *what Parrit.ai does concretely* or *what outcome they get*. The tagline reads like a luxury brand motto, not a business promise. The feature row (Automatisation, CRM, Agents, SAP, Processus) helps but arrives too late and is too generic.

## Core hypothesis
"If we project a high-end, anti-bullshit brand image, C-level visitors will trust us enough to book a call." This is a *credibility-first* bet. The risk: credibility without clarity produces admiration but not action.

## What to A/B test first
**Hero subtitle.** Replace "L'excellence par l'usage. Intelligence artificielle deployee." with a concrete outcome line (e.g. "On deploie l'IA qui tourne -- automatisation, CRM, agents -- en 4 semaines."). Measure CTA click rate (hero-cta) between abstract vs. concrete. The webhook tracking is already in place, so this is cheap to run.

## One concrete change to make the page more lovable
Add a single, short client proof point between the Hero and Origin sections -- e.g. a one-line testimonial or a "12 entreprises deployees en 2025" counter. Right now the page is 100% assertion, 0% evidence. One real number or quote would break the "trust barrier" and make the scroll from Hero to CTA feel earned, not hoped for.
