# SPEC — Lien vers paul-larmaraud.com : ton casual, pas protocolaire

Branche : `codex/bridge-casual`. Base : `origin/main` (`f2cdbe0`).

## Contexte

Retour de Paul (23/09/2026, verbatim) : « C'est pas d'avoir des rencontres
épaules, c'est juste « let's meet », tu vois ? » — à propos du lien secondaire
de la section « journey » de la home, qui pointe vers paul-larmaraud.com.
Le libellé actuel (« Rencontrez Paul » / « Meet Paul ») sonne comme une
formule protocolaire (impératif de politesse, façon prise de rendez-vous
officielle). Paul veut un ton simple et direct, à la première personne du
pluriel, façon conversation — le modèle qu'il donne lui-même est « let's
meet ». Le nom de Paul reste inutile dans ce libellé précis : la légende sous
le portrait (« Paul Larmaraud · Fondateur ») et le contexte visuel (portrait,
destination paul-larmaraud.com) suffisent déjà à identifier qui.

Le site a déjà cette convention casual/1re personne du pluriel ailleurs sur
la même page : `hero.alternative` → « Let's talk »/« Parlons-en » (CTA
principal vers /commission). Le nouveau libellé du bridge doit suivre le même
registre.

Périmètre strict : une seule clé de copy (`journey.bridge`), dans les deux
locales, dans `src/app/(rev01)/page.tsx`. Rien d'autre ne change (le `href`
reste `https://paul-larmaraud.com`, `target="_blank"`, `rel`, l'aria-label
généré automatiquement à partir de `bridge` n'a pas besoin d'un changement de
code — il se met à jour tout seul).

## Fichier — `src/app/(rev01)/page.tsx`

Remplacer (dans `DICT.en.journey`) :
```ts
      bridge: "Meet Paul",
```
par :
```ts
      bridge: "Let's meet",
```

Remplacer (dans `DICT.fr.journey`) :
```ts
      bridge: "Rencontrez Paul",
```
par :
```ts
      bridge: "Rencontrons-nous",
```

Aucun autre changement dans ce fichier.

## Vérification attendue (par Claude, après merge)

- `npm run build`, `npm run lint`, `qa:brand:rev01`, `qa:claims:rev01`,
  `qa:network:rev01` verts.
- Chercher toute assertion de test citant l'ancien texte exact du lien
  bridge (« Meet Paul »/« Rencontrez Paul ») — mettre à jour pour refléter
  le nouveau texte, jamais l'affaiblir.
- Vérifier que l'aria-label généré (`${bridge} (opens paul-larmaraud.com in a
  new tab)` / `${bridge} (ouvre paul-larmaraud.com dans un nouvel onglet)`)
  reste grammaticalement correct avec le nouveau texte — c'est le cas ici
  (« Let's meet (opens... »/« Rencontrons-nous (ouvre... »).
- Aucun tiret cadratin introduit.
