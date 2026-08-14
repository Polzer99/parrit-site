# LOT P — PURGE THE LEGACY SITE (old DA dies in production)
PARRIT / SITE · 2026-08-14 night · Owner order (Paul, dictated): « même les vieilles pages
portent encore l'ancienne DA — on va supprimer ça, on remet vers la nouvelle, et en anglais. »
The full old site is archived at git tag `archive/site-pre-rev01` — deletion is safe.

## Goal
parrit.ai serves ONLY the REV 01/03 surfaces. Every legacy URL 301s somewhere sensible.
No page in the old DA remains reachable.

## Keep (do NOT touch)
- Everything under `src/app/(rev01)/`, `src/app/system/`, `src/system/`, `content/journal/`.
- `src/app/opengraph-image.tsx`, `apple-icon.png`, `icon.png`, `sitemap.ts` (edited below), `robots.txt` handling.
- **`src/app/camp-costa-rica/`** — separate compartment served on campparrita.com via proxy. KEEP, and keep its proxy logic.
- `src/app/api/` if it exists (check what consumes it before deciding anything; report).
- Legacy → /journal 301 maps in next.config.ts (they stay).

## Delete
- `src/app/[lang]/` entirely (all locale pages incl. HomeDeux/HomeClient, dictionaries, blog, glossaire, launches, ressources, actualite, diagnostic, rendez-vous…).
- `src/app/os/`, `src/app/fondateurs/`, `src/app/academy/`, `src/app/design-system/`,
  `src/app/template-grammar/`, `src/app/art-direction-lab/`, `src/app/chemin/`, `src/app/metiers/`,
  `src/app/harnais-ia/`, `src/app/outils/`, `src/app/demarrer-claude-code/`,
  `src/app/architecture-claude-md/`, `src/app/efi-audit-hotels/`, `src/app/hr-radar/` and any
  other legacy top-level route dir NOT in the Keep list (inventory `src/app/` first, list in report).
- Components/lib/styles used ONLY by deleted pages (follow imports; leave shared utils that
  survive). `src/components/ds/`, `src/styles/parrit-tokens.css` etc. die if nothing else imports them.
- Legacy tests + scripts that exercise deleted pages: tests/diagnostic-e2e.spec.ts,
  parrit-premium-qa, template-grammar, ressources-reachability, contrast-audit… (inventory tests/).

## Redirects (SEO hygiene — add to next.config.ts)
- `/:lang(fr|en|pt-BR|zh-CN)` → `/` 301, and `/:lang(fr|en|pt-BR|zh-CN)/:path*` → `/` 301
  (EXCEPT the journal 301s already defined, which must keep priority — order the specific
  slug rules BEFORE the catch-all in the returned array).
- Bare legacy paths that had real traffic surface: `/architecture-claude-md` and
  `/demarrer-claude-code` → `/journal` 301 (their content was folded there); everything else
  bare → covered by deletion + optional catch-alls only if trivially safe (do NOT create
  redirect loops with REV01 routes; test).
- `src/proxy.ts`: with `[lang]` gone, the locale-redirect branch becomes dead — simplify:
  keep ONLY the campparrita.com host rewrite + camp path passthrough; remove the locale
  matcher gymnastics (the REV01 early-return list becomes unnecessary once nothing else
  is proxied — matcher can shrink to the camp concerns). Be conservative: verify /,
  /journal/x, /opengraph-image, /sitemap.xml, /llms.txt all still 200 after the change.
- `src/app/sitemap.ts`: drop STATIC_ROUTES/legacy blog/glossaire/launches/ressources/
  pillars/videos/presse entries and their imports — keep REV01_PUBLIC_ROUTES + journal.
- `.github/workflows/ci.yml`: remove the "diagnostic Playwright gate" step (page deleted);
  keep network-deny + brand gates.
- `package.json`: remove scripts that only served deleted surfaces (qa:diagnostic:e2e,
  qa:premium, qa:templates…); keep qa:network:rev01, qa:brand:rev01.

## Acceptance
- `npm run lint` + `npx tsc --noEmit` green (Claude runs build + real server).
- Real-server checks (Claude will run, but list them in your report): REV01 routes 200 ·
  /fr → 301 / · /fr/blog/une-carte-une-action → 301 /journal/… (single hop) ·
  /architecture-claude-md → 301 /journal · sitemap has ONLY REV01+journal URLs ·
  camp-costa-rica still renders.
- Grep the build output for `#FFFDFA|#D1132F|#AA0003|Arpona` → target 0 in served pages
  (report any remainder with its source).
- Report: inventory of what was deleted/kept, redirect table, anything ambiguous left standing.
  Do not commit.
