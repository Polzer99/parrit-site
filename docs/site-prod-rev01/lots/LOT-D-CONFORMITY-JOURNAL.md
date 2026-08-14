# LOT D — CONFORMITY: `/journal` pass + glossary noindex
PARRIT / SITE-CONFORMITY · 2026-08-14 · Authority: `docs/site-prod-rev01/CONFORMITY-REV01.md` §1, §5.

**READ CONFORMITY-REV01.md FIRST. It is the law.** This is a conformity pass — content stays, presentation conforms.

## Scope (this lot ONLY)
- `/journal` index (`src/app/(rev01)/journal/page.tsx`): bordered LIST rows with 1px var(--rule-l) separators — NOT card grids, no thumbnails. Row = title + date + k-style metadata. If it is already a list, verify each property (separators, type sizes, k labels) and fix deviations.
- Article page (`src/app/(rev01)/journal/[slug]/page.tsx` + its CSS): measure 62–68ch, body 15–16px/1.7, headings Geist 600. NO red in article bodies (links inside article prose: ink underline, not red). No bullets-with-icons, no pull-quote styling. Article footer: registry line `WE FIND THE WAY · <DATE> · PARRIT / JOURNAL` (k style; <DATE> = the entry's date, uppercase mono).
- **The 9 machine-translated glossary entries → noindex immediately** (they stay published, review comes later). The 9 slugs are the `glossaire` list in `next.config.ts` (JOURNAL_LEGACY_ROUTES.glossaire): agent-ia-entreprise, agent-ia-vs-rpa, automatiser-veille-juridique, claude-code-pour-non-dev, claude-code-vs-chatgpt, comment-deployer-llm-entreprise, comment-integrer-agent-ia, mcp-anthropic-explication, rgpd-llm-securite. Implement via frontmatter flag (e.g. `noindex: true` in each MDX) read by generateMetadata → robots { index: false }, AND exclude flagged entries from the sitemap's journal section (`src/app/sitemap.ts` builds journal entries — filter noindexed ones). Keep them in the index list and RSS or exclude from RSS — brief is silent: keep in index page, EXCLUDE from RSS (RSS is a syndication surface; syndicating known-unreviewed translations contradicts the review intent). Note this choice in your report.
- New Playwright spec `tests/conformity-journal.spec.ts`: index page has zero box-shadow, zero border-radius, list rows present; one article page renders the registry-line footer; a glossary entry (e.g. /journal/rgpd-llm-securite) has meta robots noindex. Import the network deny-all setup like `tests/rev01-system.spec.ts`.

## Constraints
- Tokens §1 only. No shadows, no radius, no gradients on these pages.
- Do NOT touch: home, /standard, /commission pages or their CSS sections; proxy.ts; next.config.ts redirect lists; site.config.ts. (sitemap.ts journal filter IS in scope.)
- Content of the 20 MDX files: do not rewrite prose; only add frontmatter flags.

## Acceptance
- `npm run lint` + `npx tsc --noEmit` green (Claude builds).
- Report: diff table + list of every deviation found vs §5 with what you changed. Do not commit; state the intended commit message.
