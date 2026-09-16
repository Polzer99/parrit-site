# CODEX-SPEC · 2026-09-16 · Le widget /commission doit pointer sur l'event type Cal.com canon (Google Meet), pas le legacy Cal Video

Statut : **VALIDÉ PAR PAUL le 16/09/2026** (« il faut que ça soit Google Meet, le
lien du meeting à prendre »). Périmètre strict : une constante de config,
aucun changement de composant, de route ou de style.

## 1. Constat (vérifié via API Cal.com v2, pas une supposition)

- `site.config.ts` définit `CAL_LINK_COMMISSION = "paul-larmaraud/30min"`.
- `src/app/(rev01)/commission/page.tsx` rend `<ParritCalInline locale={locale} />`
  sans prop `calLink`, donc `CalInline.tsx` utilise ce défaut — c'est le SEUL
  point d'embarquement Cal.com sur le site public.
- L'event type `30min` (Cal.com id 6977598) est un **attrape-liens legacy**
  créé le 07/09/2026 pour garder vivants d'anciens liens déjà envoyés à des
  prospects. Sa configuration `locations` = `[{"type":"integration",
  "integration":"cal-video"}]` — Cal Video uniquement, jamais Google Meet.
- L'event type canon `audit` (Cal.com id 6667767, slug `audit`,
  "Audit offert · 15 min") a lui `locations` = `organizersDefaultApp` +
  `integration: google-meet` — c'est le bon.
- Résultat mesuré en prod : le calendrier intégré sur `/commission` propose
  un meeting Cal Video au lieu de Google Meet, sur un event type que la
  doctrine interdit de exposer à de nouveaux visiteurs.

## 2. Fix

Dans `site.config.ts`, remplacer :
```
export const CAL_LINK_COMMISSION = "paul-larmaraud/30min";
```
par :
```
export const CAL_LINK_COMMISSION = "paul-larmaraud/audit";
```
Ne toucher aucune autre ligne de ce fichier. Ne pas toucher `CalInline.tsx`
ni `commission/page.tsx`.

## 3. QA avant PR

- `npm run lint` + `npx tsc --noEmit` + `npm run build` : verts.
- `git grep -n "paul-larmaraud/30min"` sur le dépôt après le fix : zéro
  occurrence restante dans `src/` et `site.config.ts` (les mentions dans
  `docs/` ou `CANON-DEPOTS`-like ne comptent pas, hors périmètre).
- Capture d'écran de `/commission` (FR et EN, desktop) montrant le widget
  Cal.com chargé sur le slug `audit`.

## 4. Livraison

Branche dédiée → PR vers `main`. NE PAS MERGER : review Claude (APPROVE) +
CD/batterie verte = les 3 feux (§25, validation copy déjà acquise ici car
c'est une correction de bug, pas un choix de voix). Rollback : revert de la
PR (aucune migration de données, aucun secret touché — l'event type
`30min` reste vivant côté Cal.com pour les vieux liens déjà envoyés, ce fix
ne le supprime pas).
