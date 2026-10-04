# CODEX SPEC — parrit.ai : la page légale décrit la mesure Cloudflare réellement active

Date : 05/10/2026 · Auteur : Claude (relecture et merge, §25) · Base : `origin/main` (ebd3ae1 = production, PR #297).
**Ce lot sera fusionné et publié.** Il corrige une phrase devenue fausse après #297.

## Constat (mesuré en production le 05/10, navigateur Chromium sans drapeau d'automatisation)
- parrit.ai passe par Cloudflare (serveurs de noms `*.ns.cloudflare.com`, en-tête `server: cloudflare`, `cf-ray`).
- Cloudflare injecte de lui-même, au niveau du domaine, le script `https://static.cloudflareinsights.com/beacon.min.js`
  (Cloudflare Web Analytics) ; la page envoie ensuite 3 requêtes `POST /cdn-cgi/rum`. Ce script n'est PAS dans le dépôt.
- Aucun cookie, aucune clé `localStorage` ni `sessionStorage` après chargement et défilement.
- La page légale publiée dit « Le site ne mesure plus l'audience dans votre navigateur. » : c'est faux, et Cloudflare
  n'apparaît pas dans la liste des prestataires.

## Modification (`src/app/(rev01)/legal/page.tsx`, FR et EN, rien d'autre)
1. Rubrique « Mesure d'audience » (FR) : « Cloudflare, qui achemine le site, mesure les performances des pages (temps de
   chargement) et compte les visites. Cette mesure ne dépose ni cookie ni stockage dans votre navigateur et ne produit que
   des statistiques agrégées. Base légale : notre intérêt légitime à faire fonctionner et à améliorer le site. »
   EN : « Cloudflare, which delivers the site, measures page performance (load times) and counts visits. This measurement
   sets no cookie and no browser storage, and produces aggregated statistics only. Legal basis: our legitimate interest in
   running and improving the site. »
2. Rubrique « Destinataires et sous-traitants » : ajouter « acheminement du site et mesure des performances (Cloudflare) »
   (EN : « site delivery and performance measurement (Cloudflare) ») après l'hébergement (Vercel).
3. Mettre à jour le test qui vérifie le texte de la page légale (`tests/privacy-corrections.test.mjs`) : il exige la mention
   de Cloudflare et refuse la phrase « ne mesure plus l'audience » / « no longer measures ».

## Preuves attendues
Batterie hors sandbox (lint, claims, build, brand, `test:brand-os`, `qa:network:rev01`) ; pas de build dans le sandbox.
`docs/REPORT-2026-10-05-legal-cloudflare.md` : texte avant/après FR et EN.
