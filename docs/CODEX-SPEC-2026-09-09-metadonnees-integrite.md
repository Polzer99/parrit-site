# Les métadonnées doivent dire vrai

Date : 2026-09-09. Lot SEO n°4 du plan du 09/09 (hygiène des métadonnées), réduit
à ce qui est **mécanique** : aucun titre d'article, aucun chapô éditorial n'est
réécrit ici. Ces deux points-là remontent à Paul.

## Ce qui est mesuré, pas supposé

Mesure faite sur le build local ET confirmée en production le 09/09 :

1. **L'image déclarée en JSON-LD répond 404 sur les 20 articles indexables.**
   `blogPostingJsonLd.image` vaut `${canonical}/opengraph-image`. Or Next 16 ne
   sert pas ce chemin : la convention de fichier génère une route **hachée**.
   Vérifié en production :
   - `GET https://parrit.ai/journal/what-is-parrit-ai/opengraph-image` → **404**
   - la vraie balise vaut
     `og:image = .../opengraph-image-1vnfsf?0685464e6a7acb4f`
   Le hachage change à chaque build : il ne peut pas être écrit en dur. Chaque
   article annonce donc à Google une image morte.
2. **Deux URL portent le même `<title>`** : `/journal` et `/fr/journal` rendent
   toutes deux « Journal · Parrit.ai », parce que `DICT.fr.title` vaut `Journal`
   comme `DICT.en.title`. Le reste de la page est bien traduit.
3. **Le nom d'entité n'est pas uniforme** : le JSON-LD Organization du layout
   déclare `name: "PARRIT.AI"` en capitales, alors que toutes les autres surfaces
   (titres, OG, RSS, footer) écrivent `Parrit.ai`. Pour un graphe d'entités, deux
   graphies sont deux chaînes.

## Correction

### 1. Une seule URL d'image, stable et joignable

Remplacer la convention de fichier par une route explicite, pour que **la même
URL** serve l'image à Open Graph, à Twitter et au JSON-LD :

- déplacer le rendu de
  `src/app/(rev01)/journal/[slug]/opengraph-image.tsx` vers
  `src/app/(rev01)/journal/[slug]/og/route.tsx`, en exportant `GET` et en
  renvoyant la même `ImageResponse`. Le corps du rendu ne change pas d'un pixel :
  mêmes polices lues dans `src/og-assets/`, mêmes tokens lus dans `tokens.css`,
  même `size`, même `contentType`, même `notFound()` sur un slug inconnu ;
- supprimer l'ancien fichier de convention, sinon deux URL rendent la même image ;
- dans `generateMetadata`, déclarer explicitement
  `openGraph.images` et `twitter.images` sur `${canonical}/og`, avec `width`,
  `height` et `alt` ;
- faire pointer `blogPostingJsonLd.image` sur la même chaîne, construite une
  seule fois dans le fichier.

### 2. Le titre du Journal français

`DICT.fr.title` devient `Le Journal` — la graphie déjà utilisée dans le footer et
dans la nav. Ne toucher à aucun autre libellé.

### 3. Le nom d'entité

Dans le JSON-LD Organization du layout, `name` devient `Parrit.ai`. Ajouter
`alternateName: "PARRIT.AI"` pour ne pas perdre la graphie du wordmark.

## Le gate

Créer `tests/metadata-integrity.spec.ts`, ajouté à `qa:network:rev01`, en HTTP pur
(fixture `request`, jamais `page`), sur le modèle de `tests/internal-linking.spec.ts` :

pour chaque URL du sitemap,
- relever `<title>`, `<meta name="description">`, `og:image` et le `image` du
  JSON-LD s'il y en a un ;
- **échouer si deux URL partagent le même `<title>`** — le message nomme les deux ;
- **échouer si une URL d'image déclarée (og:image ou JSON-LD) ne répond pas 200** —
  le message nomme la page, le champ et le statut obtenu.

Ne pas mettre de seuil sur la longueur des titres ni des descriptions : c'est un
arbitrage éditorial de Paul, pas une règle de CI.

## Preuve attendue

1. `npm run qa:brand:rev01` et `npm run build` verts.
2. `npm run qa:network:rev01` vert, nouvelle spec comprise.
3. `curl -o /dev/null -w "%{http_code}"` sur l'URL d'image d'un article : **200**.
4. Preuve que le gate mord : remettre temporairement l'ancienne valeur
   `${canonical}/opengraph-image` dans le JSON-LD, relancer — la spec DOIT échouer
   en nommant l'article et le 404. Remettre, revérifier le vert.
