# LOT 2B — /commission (suite du Lot 2)
PARRIT / SITE-PROD · REV 01 · LOT 2B · 2026-08-14

Reprise de `docs/site-prod-rev01/lots/LOT-2-PAGES.md`, section `/commission` uniquement.
`/` et `/standard` sont déjà livrés sur cette branche (commit `601af7a`). `@calcom/embed-react`
est maintenant installé (`package.json` — commit `88823b8`) : le blocage réseau du run
précédent est levé, tu peux l'importer directement.

Exécute uniquement la section `/commission` de LOT-2-PAGES.md : import/adaptation de
`ParritCalInline` depuis `docs/site-prod-rev01/parrit-cal-integration.jsx` vers
`src/system/components/CalInline.tsx` (vérifie d'abord s'il existe déjà — sinon crée-le),
`CAL_LINK` résolu depuis `site.config.ts` (`CAL_LINK_COMMISSION`), page `/commission` sous
`src/app/(rev01)/commission/page.tsx` avec le narratif Examination → Construction →
Compounding (déjà écrit sur `/` — réutilise le même texte réel, ne le réinvente pas) au-dessus
ou à côté du calendrier, **aucun Hold-to-Commit sur la réservation**, registry line en pied
de page.

Mêmes critères d'acceptation que LOT-2-PAGES.md : lint + build verts, zéro nom fictif,
gate de conformité de marque respecté. Commit puis reste sans push, je m'en charge.
