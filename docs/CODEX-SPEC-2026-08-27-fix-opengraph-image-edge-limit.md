# Débloquer le déploiement prod : Edge Function opengraph-image trop lourde

Le déploiement Vercel de `parrit.ai` est en échec depuis le 15/08/2026 (12+
jours), toutes les tentatives de déploiement en production échouent avec
exactement ce message, confirmé sur les logs Vercel :

```
The Edge Function "opengraph-image" size is 1 MB and your plan size limit is 1 MB.
```

## Cause

`src/app/opengraph-image.tsx` déclare `export const runtime = "edge";`
(ligne 3). Le bundle Edge Runtime pour cette route (React + `next/og` +
son moteur de rendu WASM) atteint exactement la limite de 1 MB du plan
Vercel actuel.

La route jumelle `src/app/journal/[slug]/opengraph-image.tsx`, qui utilise
la même bibliothèque `next/og`, **ne déclare PAS** de runtime edge — elle
tourne donc en runtime Node.js par défaut, qui n'a pas cette limite de
taille (Node.js Serverless Function : jusqu'à 50 MB). C'est la preuve que
cette route n'a jamais eu besoin du runtime edge.

## Correctif

Dans `src/app/opengraph-image.tsx`, supprimer uniquement la ligne :

```ts
export const runtime = "edge";
```

Ne rien changer d'autre dans ce fichier (le contenu du visuel OG, `alt`,
`size`, `contentType` restent identiques). Le composant `ImageResponse` de
`next/og` fonctionne de façon identique en runtime Node.js.

## Vérification

- `npm run build` doit réussir sans avertissement de taille sur cette route.
- Confirmer par une lecture du diff qu'aucune autre ligne du fichier n'a
  changé.
- Ne pas toucher aux autres routes `opengraph-image` ni à `sitemap.xml`,
  `robots.txt`, ou tout autre fichier.

## Contexte (ne pas modifier ce fichier hors du périmètre ci-dessus)

Ce correctif est isolé et ne touche à aucune règle de marque, de
positionnement ou de copy (voir `CLAUDE.md`) — c'est un correctif
d'infrastructure pur.
