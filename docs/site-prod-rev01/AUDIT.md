# PARRIT / SITE-PROD · PHASE 0 — AUDIT
PARRIT / AUDIT · REV 01 · 2026-08-14 · PREPARED FOR: P. LARMARAUD

Method: three parallel probes — local repo recon, live-site crawl, public SEO signals. OBSERVED and INFERRED are separated throughout. Caveat: the local checkout at `~/Parrit.ai/Projets-Dev/parrit-site` is **133 commits behind origin/main** (local HEAD 2026-07-23, origin 2026-08-10); the **live crawl is the authoritative inventory**, the repo recon informed stack and data-model findings only.

---

## 1. Stack identification — OBSERVED

- **Repo**: `github.com/Polzer99/parrit-site`. **Codex-tooled** (`AGENTS.md`) — §25 applies to every build phase of the rebuild.
- **Framework**: Next.js 16.2.2 (App Router, Turbopack), React 19, Tailwind 4, framer-motion, Radix, Poppins (@fontsource).
- **Hosting**: **Vercel** (`x-vercel-id: cdg1::…`, deployment-ID asset URLs) behind **Cloudflare proxy** (NS ken/maisie.ns.cloudflare.com, edge A records). Deploys via Vercel Git integration (no deploy workflow in repo). Root `/` is a 307 → `/fr`.
- **i18n**: 4 locales live — fr / en / pt-BR / zh-CN — plus six unlocalized FR-only routes. x-default = fr.
- **DNS / email (cutover-critical)**:
  - MX → Google Workspace (aspmx.l.google.com et al) on the apex.
  - TXT apex = Google site-verification **only**. **No SPF record. No DMARC record** (`_dmarc.parrit.ai` empty — verified). Deliverability exposure independent of the rebuild, but same DNS zone: fix at cutover.
  - **`www.parrit.ai` does not resolve at all** (no A, no CNAME).
- **robots.txt is self-contradictory**: Cloudflare-managed block (`ai-train=no`, `Disallow: /` for ClaudeBot/GPTBot/CCBot/Bytespider/Google-Extended…) stacked above the site's own block that `Allow: /` the same agents. Parser-dependent outcome. An `llms.txt` (FR, 4.5 KB) also exists.
- **CI**: `ci.yml`, `diagnostic-live-qa.yml` (probes the live site), `hermes-weekly.yml` (Hermes autonomous copy loop, commits to main — last cycle 2026-08-10).
- **Security headers**: no CSP, no x-frame-options on responses.

## 2. Content inventory — OBSERVED (live crawl, sitemap = 167 URLs; every crawled URL returned 200)

### Editorial content
- **Blog: 10 articles** (fr+en, most pt-BR; zh-CN partly falls back to EN). March–April SEO batch (5 posts, ~340–545 words) + June editorial batch (4 posts, incl. the 941-word `securite-agents-ia-entreprise`) + 1 actualité (`glm-5-2-souverainete`, 2026-06-18, with Supabase-hosted mp4).
- **Glossary: 9 published entries** (2026-05-15 → 06-15, ~540–750 words) + index. fr/en only for individual entries.
- **Launches: 3 short case notes** (#001–#003, July 2026, ~160 words each).
- **Two long-form unlocalized documents** — `/architecture-claude-md` (~1,661 words, dated 2026-07-13) and `/demarrer-claude-code` (~1,988 words) — the longest content on the site, gated by an email-unlock form hitting internal `/api/ressource`.

### Pages
- Offer set N1→N7 (masterclass-ia, masterclass-metier, sessions-mcp, audit, deploiement-agents, outils-agentiques, optimisation-flotte) + croissance, deployer, transmettre, remote, setup-claude-code, rendez-vous, ressources, auteur/paul-larmaraud.
- `/fondateurs` — live, **absent from sitemap**, unlocalized.
- **Legal pages exist live**: `/fr/mentions-legales` (~220 w), `/fr/confidentialite` (~282 w). (Absent from the stale local checkout — they are recent.)
- Interactive: `/diagnostic`, `/hr-radar`, `/outils/detecteur-bullshit`, `/harnais-ia` (client-rendered funnels + API routes /api/chat, /api/diagnostic, /api/transcribe, /api/bullshit).
- GEO: `llms.txt`, `llms-full.txt`. Extensive JSON-LD on the homepage (Organization, ProfessionalService, WebSite, HowTo, 4 Service, 2 Person, ContactPoint…).
- **No RSS feed anywhere** (all probed feed URLs 404).
- **OpenGraph image route is broken in prod**: `/opengraph-image` and `/fr/opengraph-image` → 404. Every social share is currently imageless.
- Existing 301s: audit-claude-code→audit, sprint→deploiement-agents.

## 3. SEO reality — OBSERVED (public signals; no Search Console access)

- **Indexed: 2 live URLs** of 167 declared — `/en` and `/fr/blog/securite-agents-ia-entreprise`. A third indexed URL (`/heygen-ai-spokesperson-video-2-mp4/`, WordPress-era artifact) 404s.
- **Zero editorial backlinks.** Best mention — Le Monde Informatique article (2026-08-10, byline Paul Larmaraud) — carries **no link to parrit.ai**. Rest is registry scrape (societe.com, pappers) and directories. No entry in France Digitale / Hub France IA / Numeum.
- **Brand SERP contested** by parrit.org, PARRiT (design app), a Facebook page.
- INFERRED driver of the 167→2 gap: 4-language near-duplicate trees, unverified hreflang, young domain, thin articles.
- **Consequence: the rebuild is greenfield, not a migration.** Total URL freedom. The 301 map is a hygiene rule from the brief (no article 404s), not equity preservation. The only redirects Google actually cares about today: `/en` → `/`, the indexed security article, and one line for the dead HeyGen URL.
- Not checkable without Search Console: crawl/impression data, manual actions, crawled-vs-discovered status.

## 4. Keep / Reuse / Discard

**Keep** (migrate content; 301 every old article URL):
- 10 blog articles + 1 actualité → `/journal/[slug]`, EN versions (they exist for all). 301 all fr/en/pt-BR/zh-CN variants.
- 9 glossary entries → EN, fold into `/journal` (or a glossary section if REV 02 sitemap gains one — not invented here; default: journal).
- The 2 long-form gated documents (architecture-claude-md, demarrer-claude-code) — highest-value content on the site; EN rewrite required (currently FR-only).
- Legal pages content basis → `/legal` (EN rewrite).
- GEO endpoints concept (`llms.txt`, `llms-full.txt`) — rebuild in new stack.
- JSON-LD structured-data coverage — rebuild per new sitemap.

**Reuse** (raw material → PC-10 voice):
- N1→N7 offer copy and croissance/deployer/transmettre → raw material for `/commission` and `/standard`.
- Launches #001–#003 → candidate seeds for real System Dossiers (client approval required before any activation; per locked decisions the section ships hidden).
- `/fondateurs` bios → `/paul` and `/maxime` raw material.

**Discard** (default per owner instruction):
- All i18n scaffolding (fr, pt-BR, zh-CN trees). New site 100% EN.
- Poppins/Tailwind design layer, framer-motion animations, Sacred-7 docs.
- Interactive funnels not in the REV 01 sitemap: /diagnostic, /hr-radar, /outils/detecteur-bullshit, /harnais-ia, /academy, /chemin, /metiers + API routes chat/diagnostic/transcribe/bullshit. ⚠ Owner call: these carry PostHog history and live CTAs; discarding is the default, but it is an explicit line in the approval of this gate.
- Hermes weekly copy loop (disable before rebuild lands).
- Stale `auto-*` / `codex/*` branches.

## 5. Migration risk list

1. **Lead capture = single n8n webhook on the OLD VPS.** Every form (10+ pages, newsletter, hr-radar, gated resources) posts to `n8n.srv1115145.hstgr.cloud/webhook/parrit-lead`. OBSERVED: alive and POST-registered on the old VPS; **plain 404 on the new VPS (srv1857989) — nothing registered there**. If the old VPS is decommissioned first, all lead capture dies silently. Migrate the webhook (or point the new site at the new VPS) as part of cutover, and test an actual submission.
2. **`/api/ressource` gate** (email-unlock for the two long-form docs) must be reimplemented; it exists (405 on GET), POST behavior unverified.
3. **PostHog event continuity**: EU project, event names embedded in markup (`data-ph`/`data-ph-label`). A rebuild that drops these breaks analytics history. Decide: carry event taxonomy or accept a clean break.
4. **DNS/email**: MX on apex + **no SPF/DMARC**. Cutover must not touch MX/TXT; adding SPF+DMARC at the same time is a cheap win. `www` currently unresolved — decide whether new site adds a www→apex redirect.
5. **Cloudflare layer**: contradictory robots blocks (Cloudflare-managed AI-crawler Disallow vs site Allow) must be resolved deliberately; cache (age observed 4.1 days) and SSL mode re-validated against the new host.
6. **GitHub Actions**: `hermes-weekly.yml` (writes commits) and `diagnostic-live-qa.yml` (probes prod) must be disabled at cutover.
7. **Supabase media** (actualité mp4, metiers assets) — keep the public bucket alive or re-host.
8. **Booking**: current site embeds Google Calendar appointment schedule (`calendar.app.google/kkpaNisBa78BuuAj8`); REV 01 brief specifies Cal.com. Two booking systems will coexist during transition — the Google link is also distributed in emails/signatures; do not kill it at cutover.
9. **WhatsApp CTA** `wa.me/33683762219` on 10 pages — disappears with the discard set; confirm intended.
10. **Doctrine tension for Phase 1**: prod is currently ON Vercel; house rule §13 says "jamais Vercel en sortie, sauf propales". The Phase 1 hosting proposal must arbitrate this explicitly (candidate: the existing VPS + CD, per the unified deployment doctrine).

## 6. Blocking flags

- 🔴 **The two authority documents are NOT on this machine**: `parrit-codes-rev02.html`, `parrit-command-system-rev02.jsx` (and `parrit-cal-integration.jsx`). Searched home directory + Spotlight. **Phase 1 cannot start without them.**
- 🟠 No Search Console / analytics API access in this session — SEO section is indexation-based.
- 🟠 Local checkout 133 commits behind origin — any Phase 1+ work must start from a fresh pull of origin/main.

— END —
PARRIT / AUDIT · REV 01 · 2026
