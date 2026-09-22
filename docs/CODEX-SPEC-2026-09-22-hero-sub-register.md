# SPEC — Sous-titre du hero : registre professionnel, portée élargie

Branche : `codex/hero-sub-register`. Base : `origin/main` (`2d4f011`).

## Contexte

Retour de Paul (22/09/2026, verbatim) sur le sous-titre actuel du hero
(« La facture que personne ne suit avant qu'elle traîne. Le rapport
recomposé à la main chaque lundi. On code chez vous, avec vos données,
jusqu'à ce que ça tourne. ») : « ça fait maxi AI slop, et il faut montrer
aussi qu'on ouvre de nouvelles possibilités, qu'il n'y a pas qu'la admin […]
On dirait que c'est du langage familier, on dirait que c'est des amateurs. »

Deux défauts distincts à corriger :
1. **Registre trop familier** : « on code chez vous » et « jusqu'à ce que ça
   tourne » sont de l'oral, pas le niveau cabinet de conseil demandé
   précédemment. Remplacé par un registre direct mais précis, aligné sur le
   vocabulaire déjà établi ailleurs sur le site (« mise en service », déjà
   utilisé dans le parcours en 4 étapes de cette même page).
2. **Portée réduite à l'administratif** : les deux scènes concrètes (facture,
   rapport) donnent l'impression que Parrit ne traite que des tâches
   subalternes. Ajout d'une phrase qui dit explicitement que ce sont des
   points de départ, pas une limite.

## Fichier — `src/app/(rev01)/page.tsx`

Remplacer (dans `DICT.en.hero`) :
```ts
      sub: "The invoice nobody owns until it's overdue. The report stitched together by hand every Monday. We build inside your systems, on your data, until it runs.",
```
par :
```ts
      sub: "The invoice that drags, the report rebuilt by hand every week: entry points, never the limit. We build inside your systems, on your data, until it goes live.",
```

Remplacer (dans `DICT.fr.hero`) :
```ts
      sub: "La facture que personne ne suit avant qu'elle traîne. Le rapport recomposé à la main chaque lundi. On code chez vous, avec vos données, jusqu'à ce que ça tourne.",
```
par :
```ts
      sub: "La facture qui traîne, le rapport refait à la main chaque semaine : des points de départ, jamais la limite. Nous construisons dans vos systèmes, sur vos données, jusqu'à la mise en service.",
```

Aucun autre changement dans ce fichier (le H1, `alternative`, et le reste du
`DICT` ne changent pas).

## Vérification attendue (par Claude, après merge)

- `npm run build`, `npm run lint`, `qa:brand:rev01`, `qa:claims:rev01`,
  `qa:network:rev01` verts.
- Chercher toute assertion de test citant l'ancien texte exact de
  `.home-s-hero-sub` (déjà mis à jour une fois dans `tests/conformity-home.spec.ts`
  lors d'une précédente PR) — actualiser avec le nouveau texte, jamais
  l'affaiblir.
- Aucun tiret cadratin (—) introduit — vérifier explicitement les deux
  chaînes avant de committer.
