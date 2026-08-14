# LOT 5 — /dossiers (built, hidden at launch)
PARRIT / SITE-PROD · REV 01 · LOT 5 · 2026-08-14

Branch: `rebuild/rev01`. Read `LOT-1-FOUNDATION.md` first — reuse `src/system/` tokens/components (`RegistryLine`, `K`, `Seal`), don't recreate. Reference: prototype view `Dossier()` in `parrit-command-system-rev02.jsx` — the `.dossier`/`.dh`/`.ds`/`.caps`/`.ba` visual structure (header with client/system/domain plate, "Operating problem" section, "Capabilities built" grid, "Before/After" measured-change comparison, footer with Seal + registry).

## Critical constraint (locked decision, brief §1 and ARCHITECTURE.md §3)

**This section ships built but EMPTY and HIDDEN at launch.** Per the brief: "Build the System Dossier template... but ship the section hidden/empty. It activates when a real, client-approved dossier exists. The fictional SILVANI/NORTHSTAR content from the prototypes must never reach production." This is non-negotiable — the prototype's `Dossier()` content (Silvani Group, Müller GmbH, €1.2M, the specific before/after numbers) is a fictional demo and **must not appear anywhere in this lot's output**, not even as placeholder/example content in code comments visible to a reader of the rendered page.

## Scope

1. **Dossier template component**: `src/system/components/Dossier.tsx` — a reusable component matching the prototype's visual contract (header plate: CLIENT / SYSTEM / DOMAIN / COMMISSIONED / REV / STATUS; "Operating problem" prose section; "Capabilities built" numbered grid (CAP-01, CAP-02...); "Measured change" before/after two-column comparison; footer with `Seal` + registry line), built with `src/system/tokens.css` only, accepting real props (no hardcoded fictional data) — e.g. `client`, `systemId`, `domain`, `commissionedYear`, `problem`, `capabilities: string[]`, `before: string[]`, `after: string[]`.
2. **Index page** `src/app/(rev01)/dossiers/page.tsx`: renders an **empty state** — no dossier cards, because none are approved yet. Real, honest copy for the empty state (e.g. something like "System dossiers are published once a client has approved their release" — do not invent a different framing; keep it short and factual, PC-10 compliant). Do NOT render any fictional example dossier "to show what it would look like" — that violates the brief.
3. **`noindex`** on this route (it's empty; no SEO value yet, and per the brief it's meant to be hidden — treat `noindex` plus absence from any navigation as the hiding mechanism for this lot; do not build a password gate or feature flag system, that's over-engineering for an empty page).
4. **No navigation link** to `/dossiers` from any other page built so far (`/`, `/standard`, `/commission`, `/paul`, `/maxime`, `/journal`) — do not add one. It stays reachable only by direct URL for internal review, exactly like the other REV 01 pages so far.
5. Add `/dossiers` to `src/proxy.ts`'s exclusion list (matcher AND early-return block) — same pattern as `/paul`, `/maxime`, `/legal`, `/journal`. **Verify this yourself with a real running server before reporting done** — this exact bug (forgetting a path in the proxy exclusion list) has now happened once (Lot 2) and been avoided twice (Lot 4, Lot 3); do not let it recur.
6. Add the `Dossier` component to the `/system` verification route (`src/app/system/page.tsx`) with **realistic but clearly fictional placeholder data that is NOT Silvani/Northstar/Müller/Meridian** — e.g. invent a generic anonymized example like "Client A" / "SYS-000" / "Illustrative example — not a real deployment" labeled explicitly as such, so `/system`'s purpose (verifying the component renders correctly) is served without reintroducing the banned fictional brand names. If you're not confident this satisfies the "zero fictional client data" launch check cleanly, use fully abstract placeholder text instead (e.g. "—" or "[value]") rather than any named scenario.

## Out of scope

Do not populate any real dossier content (no real client has approved one yet — that's a future, separate action by the owner, not part of this lot). Do not build a CMS/admin UI for adding dossiers later — a future lot, if ever needed; for now a new dossier is just a new call to the `Dossier` component with real props, committed like any other content change.

## Acceptance criteria

- `npm run lint` && `npm run build` green (verified for real).
- `/dossiers` renders, empty state only, `noindex`, reachable via direct URL, not linked from anywhere.
- Real server test (`next start` + `curl`) confirms `/dossiers` returns 200 — same verification discipline as Lot 3/4.
- `grep -riE "silvani|northstar|müller|meridian"` across all new files (including `/system`'s new Dossier demo) returns nothing.
- Brand-conformity gate passes.
- Commit in logical steps, don't push.

## Reporting

What was built, confirmation of the real-server test output for `/dossiers`, and the exact placeholder data used in the `/system` demo (so it can be double-checked against the fictional-name ban).
