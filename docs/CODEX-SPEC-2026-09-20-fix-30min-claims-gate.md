# CODEX-SPEC · 2026-09-20 · Corriger le déclenchement CI `qa:claims:rev01` sur la branche offer-cards-home

Statut : **VALIDÉ PAR PAUL le 20/09/2026.** Correctif ciblé sur la branche
`codex/docs-CODEX-SPEC-2026-09-20-offer-cards-home-md` (PR #268), pas une nouvelle
fonctionnalité. `npm run qa:claims:rev01` échoue actuellement sur 3 lignes.

## Fait établi (ne pas re-discuter)

Les 15 minutes annoncées sur `/commission` concernent le **premier échange**
(l'examen général avec le fondateur), un fait indépendant de Build With You. Les 30
minutes de l'étape "Audit offert" de Build With You sont un fait **différent et
également sourcé** (`commercial-graph-v1.json`, nœud `off.build-with-you`, champ
`resume` : "audit 30 min offert -> restitution 30 min -> 10 heures"). Les deux faits
coexistent et sont vrais chacun dans son contexte — il ne s'agit PAS d'un chiffre à
harmoniser ou à supprimer.

Le gate `scripts/false-claims-check.mjs` a raison de bloquer tout texte qui pourrait
laisser croire que **le premier échange général du fondateur** dure 30 minutes. Il se
déclenche ici par un **faux positif de vocabulaire** : le mot "examine"/"examiner" et
la proximité littérale de "fondateur"/"founder" avec "30 min" dans le code source (pas
dans le sens réel du texte) — pas parce que Build With You revendique la durée du
premier échange. **Ne pas affaiblir le gate** (ne pas toucher à
`scripts/false-claims-check.mjs`) : corriger uniquement le texte pour qu'il ne
ressemble plus, littéralement, à une affirmation sur le premier échange.

## Corrections exactes (diff minimal, ne rien reformuler d'autre)

### 1. `src/app/(rev01)/build-with-you/page.tsx`

Dans `DICT.en.steps[0]`, remplacer uniquement :
```
"30 minutes to examine your needs."
```
par :
```
"30 minutes to go over your situation."
```

Dans `DICT.fr.steps[0]`, remplacer uniquement :
```
"30 minutes pour examiner votre besoin."
```
par :
```
"30 minutes pour parcourir votre situation."
```

Ne pas toucher aux steps 2 et 3, ni au reste du fichier.

### 2. `src/app/(rev01)/page.tsx`

Dans `DICT.en.offers.cards[0].deliverables` (carte "Build With You"), remplacer
uniquement le 3e élément :
```
"10 hours of building with the founder"
```
par :
```
"10 hours of building with Paul"
```

Dans `DICT.fr.offers.cards[0].deliverables`, remplacer uniquement le 3e élément :
```
"10 heures de construction avec le fondateur"
```
par :
```
"10 heures de construction avec Paul"
```

Ne pas toucher aux autres champs de la carte (`format` garde "avec le
fondateur"/"with the founder" — ce champ n'est pas en cause), ni à la carte "Système
sur mesure"/"Custom system".

## QA avant push

- `npm run qa:claims:rev01` : doit passer de rouge à vert, **sans modification de
  `scripts/false-claims-check.mjs`**.
- `npm run lint` + `npx tsc --noEmit` + `npm run build` + `npm run qa:brand:rev01` +
  `npm run qa:network:rev01` : toujours verts (aucune régression).
- `git diff --stat` : seuls `build-with-you/page.tsx` et `page.tsx` doivent apparaître
  en modification. Aucun autre fichier.

## Livraison

Commit + push sur la branche existante `codex/docs-CODEX-SPEC-2026-09-20-offer-cards-home-md`
(PR #268 déjà ouverte) — ne pas créer de nouvelle branche, ne pas ouvrir de nouvelle PR.
