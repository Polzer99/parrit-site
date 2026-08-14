# PARRIT / SITE-PROD · PHASE 1 — ARCHITECTURE
PARRIT / ARCH · REV 01 · 2026-08-14 · AUTHORITY: PARRIT / CODES-1.0 REV 02

Sources of truth, in order: `parrit-codes-rev02.html` (law) → `parrit-command-system-rev02.jsx` (reference implementation) → `parrit-cal-integration.jsx` (Cal.com integration) → the production brief. Phase 0 findings in `AUDIT.md`.

---

## 1. Stack (per brief, confirmed against audit)

- **Next.js (App Router) + React**, TypeScript strict. **MDX in the repo** for `/journal` — content ships by PR. Static generation everywhere; zero runtime API routes at launch except `sitemap`/`og` generation at build.
- **Fonts self-hosted**: Geist + Geist Mono downloaded into `public/fonts/` (no Google Fonts at runtime — the prototype's `@import` is NOT carried over). Font tokens structured so Söhne is a variable swap (PC-03).
- **Repo: same repo (`Polzer99/parrit-site`)**, rebuilt on a long-lived branch `rebuild/rev01`. Rationale: keeps Codex tooling, CI, issues, and history; cutover = one merge to main (atomic, revertable); Vercel previews the branch throughout. The legacy `src/` tree is deleted in the final cutover commit — after the archive step (Phase 4 checklist).
- **No i18n scaffolding.** 100% EN (locked).

## 2. Design system package

`src/system/` (single package inside the app — no monorepo overhead for one consumer):
- `tokens.css` — every PC-01→PC-04/PC-09 value as CSS custom properties, names mapped 1:1 to the REV 02 prototype (`--ink #0A0B0C`, `--carbon #131518`, `--carbon2`, `--paper #F1F2F3`, `--paper2`, `--rule-l/-d`, `--g2/g3/g4`, `--red #E10600`, `--red-p #B80500`; `--s1…--s8`; `--ease cubic-bezier(.2,0,0,1)`, `--micro/move/seq/hold`).
- Components lifted from the prototype without reinterpretation: `Frame` (with `closed` state), `Hold` (600 ms linear, keyboard + `prefers-reduced-motion` per PC-07), `RegistryLine` (PC-05), `St` status marks (PC-06: shape+color, 4 states), `K` registry text, `DecisionCard` (marketing-safe variant: journal line simulated, no real side effects), `Instrument` chrome (ibar/irow), `Seal`.
- `/system` internal route (noindex): renders every token and component against the spec for visual verification — the acceptance surface for the brand-conformity pass in Phase 4.
- Hard rules enforced by lint/CI: no hex outside `tokens.css`, no `border-radius` except device mockups, no gradients, no box-shadow except the single instrument shadow, no red body text.

## 3. Sitemap (definitive, from brief)

| Route | Register | Source view | Notes |
|---|---|---|---|
| `/` | Document, opens on Instrument objects | Prototype 03 (+ boot from 01, degraded under reduced-motion) | Hero, instrument object, operating loop, commissioning model. Faces of Paul & Maxime: names/roles/links only |
| `/standard` | Document | Prototype 02 doctrine block | PS-01→PS-06 as specification |
| `/dossiers` | Document | Prototype 07 | Built, **hidden at launch** (no nav link, noindex, empty index). SILVANI/NORTHSTAR/Müller never ship |
| `/journal` | Document | — | "We Find The Way". MDX index |
| `/journal/[slug]` | Document | — | Articles, registry line + publish date in footer |
| `/paul`, `/maxime` | Document, lighter weight, first person | Same codes | 10-h coaching offer, Cal embed (namespace per person), bridge → Parrit |
| `/commission` | Document + Instrument (Cal inline) | `parrit-cal-integration.jsx` mode 1 | examination → construction → compounding; `CAL_LINK_COMMISSION` |
| `/legal` | Document | — | Rewrite of mentions légales + privacy (exist on current site) |

- `site.config.ts`: `CAL_LINK_COMMISSION = "paul-larmaraud/executive-operating-session"`; `CAL_LINK_COACHING_PAUL/MAXIME`, `COACHING_OFFER_NAME`, `COACHING_PRICE_DISPLAY` = `TBD` rendered as visible `[TO FILL]` blocks that fail the launch checklist.
- Registry line in every footer: `PARRIT / SITE · REV 01 · 2026`.
- Cal.com: standard buttons open embeds (Hold-to-Commit NEVER on booking — per spec note in the Cal file). The current Google-Calendar booking link stays alive outside the site (it lives in emails/signatures).

## 4. Content migration mapping (feeds Phase 2)

- 10 blog EN versions + 1 actualité + 9 glossary EN versions → `/journal/[slug]`, one 301 map covering **every** old URL (all four language trees × blog/glossaire/actualite + the 2 offer redirects + `/en`, `/fr`, `/heygen-…` one-liner). Greenfield SEO (2 indexed URLs) means slugs are freely renamed to clean EN.
- The 2 long-form gated FR docs (architecture-claude-md, demarrer-claude-code) → Reuse pool for future `/journal` pieces (EN rewrite; not launch-blocking).
- RSS + sitemap.xml + OG images generated in-brand (ink background, mono registry line, Geist 500 title). Fixes the two live defects: OG route 404, no RSS.
- robots.txt: single coherent policy (AI crawlers allowed — current site intent); remove the contradictory Cloudflare-managed block at cutover; regenerate `llms.txt`/`llms-full.txt` in EN.

## 5. Hosting — two plans for arbitration (owner decides on evidence)

**Correction to the Phase 0 flag:** repo doctrine (AGENTS.md, §13 note) states §13 bans runtime calls to `*.vercel.app` resources, **not Vercel as hosting** — the current site is hosted there deliberately. Both plans below are therefore doctrine-compliant; the choice is operational.

**Plan A — stay on Vercel (recommended for launch).**
- Deploy: Vercel Git integration on the repo, as today. Domain and Cloudflare proxy: **zero DNS change at cutover** — cutover is a git merge, not an infra move.
- Rollback: instant — Vercel "promote previous deployment", or revert the merge commit. Old site remains one click away for the whole transition.
- Cost of change: none. CI/preview flow already proven this morning (PR #205/#206).
- Risk: none new; Cloudflare cache re-validated (observed 4-day stale age → set explicit cache rules).

**Plan B — VPS srv1857989 (sovereignty / unified-CD alignment).**
- Deploy: `next build` standalone in Docker behind the existing Traefik (`main → CD → /srv` pattern already canonical on this VPS); Cloudflare origin switched from Vercel to VPS IP.
- Rollback: keep the Vercel deployment warm; flip Cloudflare origin back (minutes, but a real infra operation with SSL/proxy re-validation).
- Cost of change: CD workflow + container + Traefik route + cache tuning to build and operate; the VPS also carries n8n + super-app (blast radius shared).
- When it wins: if Paul wants the whole Parrit surface on owned infrastructure (§44 spirit) more than he wants the fastest reversible launch.

**Recommendation: Plan A for REV 01 launch; revisit B once the site is stable** — the build is static either way, so moving later is an infra task, not a redesign. Priority stated by Paul on 14/08: "être en ligne".

## 6. Parallel lane (cadrage only, separate spec)

**Personalized-prototype funnel** (Paul, 14/08: onboarding style "Paulsia" [name TBC] — email in → personalized landing/prototype generated → email sequence; proven on his prospects). Architecture reserves: a lead-capture endpoint posting to the existing n8n webhook (proven), a `source` taxonomy, and a `/p/[token]` route namespace for generated artefacts. Everything else (generation pipeline, sequences) = its own spec + gate; not launch-blocking; PC-10 and §27 apply.

## 7. Sequencing & workplan (Codex codes, Claude reviews/merges — §25)

1. **Lot 1 — Foundation**: branch `rebuild/rev01`, Next app skeleton, `src/system/` (tokens + components), `/system` route, fonts self-hosted, CI battery (lint, build, **network-deny Playwright harness** per AGENTS.md rule, brand-conformity greps: hex/radius/gradient/banned words PC-10).
2. **Lot 2 — Pages**: `/`, `/standard`, `/commission` (Cal inline), `/legal`, `site.config.ts` with `[TO FILL]` gates.
3. **Lot 3 — Journal**: MDX pipeline, article template, RSS/sitemap/OG, 301 map, migrate the 20 Keep articles (EN).
4. **Lot 4 — Personal pages**: `/paul`, `/maxime` (+ coaching placeholders visible), bridge sections.
5. **Lot 5 — Dossiers**: template per prototype 07, index hidden, zero fictional content.
6. **Phase 4 — QA & LAUNCH.md** per brief; cutover on explicit "go".

Each lot = spec in `docs/site-prod-rev01/lots/` → Codex bridge (local lane; Cloud when ENV_ID provided) → PR → 3-feux merge.

## 8. Open items (not decided here)

- Hosting arbitrage (§5) — Paul, on this report.
- Söhne / ABC Diatype license (spec R-04) — later, token swap.
- Glossary: folded into `/journal` by default (no glossary section in the locked sitemap). Flag if Paul wants it kept as a section.
- PostHog: clean break confirmed; new event taxonomy defined in Lot 2 spec (funnel /paul+/maxime → /commission).
- Brand OS repo docs (AGENTS.md DA section, `docs/design-system/`) still describe the superseded Arpona/#FFFDFA system: updated at cutover to REV 02 (§48 — one canon), not before (the legacy site still lives on it).

— END · PARRIT / ARCH · REV 01 · FOR APPROVAL —
