# LOT 7 — SINGLE BOOKING LINK (Paul's), NO COACHING CONFIG
PARRIT / SITE-PROD · REV 01 · LOT 7 · 2026-08-14

Owner decision (Paul, 14/08 evening): **the site displays exactly ONE booking link —
Paul's** (`CAL_LINK_COMMISSION` = `paul-larmaraud/executive-operating-session`).
No separate coaching links for /paul and /maxime, no coaching offer name, no price.

## Changes

1. **`site.config.ts`** — delete `CAL_LINK_COACHING_PAUL`, `CAL_LINK_COACHING_MAXIME`,
   `COACHING_OFFER_NAME`, `COACHING_PRICE_DISPLAY` (constants + `siteConfig` entries).
   Keep `CAL_LINK_COMMISSION` and `isPlaceholder` (still used by `CalInline`).
2. **`src/system/components/PersonalPage.tsx`** —
   - remove the `calLink` prop; render `<ParritCalInline />` with no prop (it already
     defaults to `CAL_LINK_COMMISSION`);
   - delete the entire `personal-config-grid` block (Offer name / Price) and the
     `ConfigValue` helper + `COACHING_*` imports. Do NOT invent any price or offer
     name to replace them — the offer intro paragraph stays as the only description;
   - the calendar section: heading `Book a working session`, and the `<K>` label must
     not imply the calendar belongs to `{person}` (on /maxime it is Paul's calendar).
     Use a neutral label: `<K>Booking / Cal.com</K>`.
3. **`src/app/(rev01)/paul/page.tsx` + `maxime/page.tsx`** — drop the `calLink` prop
   and the now-unused imports.
4. If `rev01.css` has rules for `.personal-config-grid` / `.personal-config-value`
   that become dead, remove them.

## Acceptance

- `npm run lint` green; `npx tsc --noEmit` green (sandbox cannot run `npm run build` —
  Claude will run it).
- `grep -rn "COACHING" src/ site.config.ts` → zero matches.
- Rendered /paul and /maxime contain zero `TO FILL` occurrences and one Cal embed each.
- No Hold-to-Commit anywhere in this change (booking is navigation, PC-07).
- Do not commit — report the intended commit message; Claude commits.
