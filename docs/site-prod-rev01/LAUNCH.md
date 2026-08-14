# LAUNCH — PARRIT / SITE-PROD REV 01
Phase 4 checklist · 2026-08-14 · branch `rebuild/rev01` @ `0fad595` · CI PR #208 green

Every check below was executed for real on 2026-08-14 (fresh `npm run build`, real
`next start`, real browser for Cal). Column: ✅ verified · 🔴 blocker · 🟡 needs Paul's
sign-off to launch as-is.

## 1. Routes & redirects

| Check | Result |
|---|---|
| 9 REV 01 routes serve 200 (`/`, `/standard`, `/commission`, `/paul`, `/maxime`, `/legal`, `/journal`, `/dossiers`, `/system`) | ✅ |
| Legacy → `/journal` 301s (80 rules in `next.config.ts`) — spot-checked 5 across blog/glossaire/actualite × fr/en/pt-BR/zh-CN, each 301 → target 200 | ✅ |
| `/dossiers` and `/system` render `noindex` and are absent from sitemap | ✅ |
| Sitemap contains the 6 public REV 01 URLs | ✅ |
| Legacy `[lang]` tree still present and still in sitemap (`/fr`, `/en`, `/diagnostic`…) | 🟡 intentional at cutover — see §6 |

## 2. Fictional case studies (hard rule: never ship)

`grep -riE "SILVANI|NORTHSTAR|Müller|Meridian"` on the full `.next/server/app`
build output: **zero matches**. ✅

## 3. Placeholders `[TO FILL]`

| Page | Occurrences | Constant |
|---|---|---|
| `/commission` | 0 | `CAL_LINK_COMMISSION` filled | ✅
| `/paul` | 5 | `CAL_LINK_COACHING_PAUL`, `COACHING_OFFER_NAME`, `COACHING_PRICE_DISPLAY` | 🟡
| `/maxime` | 5 | `CAL_LINK_COACHING_MAXIME`, `COACHING_OFFER_NAME`, `COACHING_PRICE_DISPLAY` | 🟡

🟡 **Gate**: either Paul provides the 4 values in `site.config.ts`, or he signs off on
launching with `/paul` and `/maxime` showing visible `[TO FILL]` markers (they are
deliberately ugly so they cannot be forgotten). The rest of the site does not
depend on them.

## 4. Brand conformity

`npm run qa:brand:rev01` → pass (src/system, src/app/(rev01), src/app/system). ✅
CI gates (network-deny Playwright + brand) green on every push via PR #208. ✅

## 5. Cal.com — desktop + mobile (real browser, Playwright/Chromium)

Embed mounts and is **visible on desktop (1440×900) and mobile (390×844)**. ✅
🔴 **Blocker**: the embed renders **“Error Code: 404. Cal Link seems to be wrong.”**
`cal.com/paul-larmaraud` exists (HTTP 200) but the event type
**`executive-operating-session` does not exist yet** (HTTP 404).
→ Action Paul (~2 min): create the event type in Cal.com with slug
`executive-operating-session` (45 min, visio), or dictate the correct slug and we
update `CAL_LINK_COMMISSION` in `site.config.ts`. Re-test is one command.

## 6. Cutover plan

1. **Archive first** (before anything is deleted, per brief): tag current prod
   `git tag archive/site-pre-rev01 origin/main && git push origin archive/site-pre-rev01`.
   The full legacy site stays recoverable from this tag forever.
2. **Cutover** = merge `rebuild/rev01` → `main` (no force-push). Vercel redeploys
   `main` automatically → parrit.ai serves REV 01 at `/`. Nothing else to touch:
   same domain, same project, DNS untouched (DNS work = « temps 2 »).
3. The legacy `[lang]` tree is **not deleted at cutover**. It keeps old URLs alive
   (no 404 wave) while REV 01 takes `/`. Its removal + sitemap purge is a small
   post-launch cleanup lot, done only after the archive tag exists.
4. PR #208 (draft, stub base) is closed after cutover; CI runs on `main` from then on.

## 7. Rollback

`git revert -m 1 <merge-commit>` on `main`, push → Vercel redeploys the old site
in ~2 min. No data risk: the site is stateless; leads flow through the n8n
webhook which is unchanged by the cutover.

## GO / NO-GO summary

- 🔴 1 blocker: Cal.com event type missing (Paul, ~2 min).
- 🟡 2 sign-offs: launch with `[TO FILL]` on /paul + /maxime (or provide values);
  legacy tree kept alive temporarily post-cutover.
- ✅ everything else verified.

Cutover happens **only on Paul's explicit "go"**.
