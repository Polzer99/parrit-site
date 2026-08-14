# LOT 3 — JOURNAL (blog migration)
PARRIT / SITE-PROD · REV 01 · LOT 3 · 2026-08-14

Branch: `rebuild/rev01`. Read `LOT-1-FOUNDATION.md` and `LOT-2-PAGES.md` first — reuse `src/system/` tokens/components, don't recreate. Authority: `parrit-codes-rev02.html` → `ARCHITECTURE.md` §4 (content migration mapping) and §3 (sitemap).

Do not touch legacy `src/app/[lang]/blog/...` or `src/lib/blog*.ts`/`actualite*.ts` — those are the CURRENT production data source and stay live until final cutover. This lot reads from them (or from a fresh export you create) but does not modify them.

## Content source

The legacy repo (this same repo, current `main`/legacy tree) holds:
- `src/lib/blog.ts` (7 hand-authored articles) + `src/lib/blog-generated.ts` (3 more) — each with `fr`/`en`/`pt-BR` translations. **Use the `en` translation** for each article's content (locked decision: 100% English).
- `src/lib/actualite-generated.ts` (1 article: `glm-5-2-souverainete`).
- `content/glossaire/*.json` (9 entries + index) — French only in current source; the glossary content will need translation to English as part of this lot (glossary folds into `/journal` per owner decision — no separate section).

Total: 20 pieces of content to migrate (10 blog + 1 actualité + 9 glossaire), all as `/journal/[slug]` entries.

## Scope

1. **MDX pipeline**: `content/journal/*.mdx` with frontmatter (`title`, `date`, `description`, `slug`). Reader/loader in `src/system/journal.ts` (or `src/app/(rev01)/journal/lib.ts` — pick one, be consistent), typed, no `any`.
2. **Article template**: `src/app/(rev01)/journal/[slug]/page.tsx` — Document register (cold white per PC-02), registry line + publish date in footer, PC-03 type scale, no decorative red. Use `src/system/` primitives (`RegistryLine`, `K`) — do not invent new typographic classes.
3. **Index**: `src/app/(rev01)/journal/page.tsx` — list of all migrated entries, title + date + description, no decoration.
4. **Migrate all 20 pieces** as MDX content, English versions, straight port of the existing English translations (do not rewrite the copy — that's an editorial pass for later; this lot is structural migration). For the 9 glossary entries (French-only source): translate to English preserving meaning — flag in the report that this is a first-pass machine-assisted translation, not a final editorial pass, so it can be reviewed later.
5. **301 redirect map** in `next.config.ts` (or middleware if cleaner — match existing patterns in `src/proxy.ts`) covering **every** old URL from the audit: all four language prefixes (`fr`/`en`/`pt-BR`/`zh-CN`) × `/blog/[old-slug]`, `/actualite/[old-slug]`, `/glossaire/[old-slug]` → the new `/journal/[new-slug]`. Also the two existing redirects already in `next.config.ts` (`audit-claude-code`→`audit`, `sprint`→`deploiement-agents`) must keep working — do not remove them. Reuse old slugs as new slugs where they're already clean English-readable strings; only rename where the old slug is clearly French (e.g. `facturation-automatique-ia-pme` can stay, but check each one).
6. **RSS feed**: `src/app/(rev01)/journal/rss.xml/route.ts` (or `feed.xml`), valid RSS 2.0, all 20 entries. (The live site has none today — this fixes a real gap noted in the audit.)
7. **Sitemap entries**: add `/journal` + `/journal/[slug]` for all 20 to whatever sitemap mechanism this lot's route group uses (check if `src/app/sitemap.ts` already covers the legacy tree — extend it to include the new journal entries, or note if a separate REV 01 sitemap is cleaner given the parallel-tree setup from Lot 1; document the choice).
8. **OG images**: `src/app/(rev01)/journal/[slug]/opengraph-image.tsx` — ink background, mono registry line, article title in Geist 500, no other decoration (per `ARCHITECTURE.md` §4 — this fixes the live 404 on the current OG route).

## Explicitly out of scope

Do not wire `/journal` into any homepage navigation yet (that's the nav/sitemap lot after Lot 4). Do not delete legacy blog routes or data files. Do not do a full editorial rewrite of article copy — structural migration only, flag translation-quality items in the report instead of perfecting them.

## Acceptance criteria

- `npm run lint` && `npm run build` green (verified for real, not just asserted).
- All 20 `/journal/[slug]` URLs render.
- 301 map covers every legacy URL from `AUDIT.md`'s content inventory (spot-check a handful of both blog and glossary URLs across all 4 old language prefixes).
- RSS validates (well-formed XML, 20 items).
- OG image route renders (no 404) for at least one article.
- Brand-conformity gate passes on new files.
- Commit in logical steps (pipeline, then template, then bulk content migration, then redirects/RSS/OG), don't push — I push after real verification, same as prior lots.

## Reporting

What was migrated, the translation-quality flag for the 9 glossary entries specifically, the redirect-map coverage (how many URLs, any gaps), and confirmation of the sitemap-mechanism choice in point 7.
