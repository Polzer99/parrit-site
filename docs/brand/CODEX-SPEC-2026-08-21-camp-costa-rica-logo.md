# Spec Codex — logo obsolète sur /camp-costa-rica

## Constat

`src/app/camp-costa-rica/Landing.tsx` (lignes ~62 et ~345) référence encore
`/brand/parrit-lockup-red.svg` — un logotype de l'ancienne DA Smoooth (crème/#D1132F),
explicitement MORTE depuis l'arbitrage de Paul du 14/08/2026 (voir
`reference_brand_os_canon_unique` en mémoire, et le canon `src/system/tokens.css`).
C'est la seule route publique du site encore sur l'ancien logo — le header principal
(`src/system/components/RevHeader.tsx`) utilise déjà un wordmark texte "PARRIT.AI" sans
image, cohérent avec la doctrine "live-text mark" du canon REV 03/04.

## Tâche

Remplacer les deux `<img className="cnav-logo" src="/brand/parrit-lockup-red.svg" ... />`
dans `Landing.tsx` par le même traitement texte que `RevHeader.tsx` (wordmark
"PARRIT.AI" en live-text, classe `.cnav-logo` adaptée ou réutilisation du composant/style
existant), pour que `/camp-costa-rica` (FR/EN/ES) soit visuellement cohérent avec le reste
du site.

Ne pas toucher aux autres fichiers `public/brand/*.svg` (ils peuvent rester sur disque,
juste ne plus être référencés ici) ni au reste de la page.

## Porte de qualité

`npm run build` doit passer, `npm run qa:brand:rev01` doit passer (si le check couvre
cette route).
