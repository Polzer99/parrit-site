# SPEC — fix test conformité journal cassé par croissance normale du contenu (self-healing canary #3)

## Contexte

`tests/conformity-journal.spec.ts` (job CI "REV 01 network-deny Playwright gate", dans
"lint and build") échoue actuellement sur `main` (constaté sur les runs `33251093149`,
`33251075665`, `33112248782`, et sur la PR #222 qui n'y touche pourtant pas — donc pas causé
par cette PR, un vrai défaut indépendant déjà présent sur `main`).

## Root cause (constatée, pas déduite)

```ts
const rows = page.locator(".journal-list > li");
await expect(rows).toHaveCount(20);
```

Le test attend EXACTEMENT 20 lignes. `src/app/(rev01)/journal/page.tsx` appelle
`getAllJournalEntrySummaries()` et affiche `entries.map(...)` **sans slice/limite/pagination**
— l'index affiche TOUT le journal, qui grandit chaque jour (moteur journal-quotidien, 2 rails
actifs depuis le 29/08/2026). Le journal a maintenant 21 entrées publiées, le test est resté
figé sur l'ancien total. Ce n'est pas une régression de code, c'est un test dont l'assertion
n'a pas suivi la croissance normale et attendue du contenu — et il recassera chaque fois qu'un
nouvel article se publie tant qu'il reste un nombre en dur.

## Fix demandé

Dans `tests/conformity-journal.spec.ts` : remplacer le nombre en dur `20` par une valeur
dérivée du contenu réel au moment du test, pour que le test vérifie la PROPRIÉTÉ voulue (les
lignes du journal ont le bon style : carré, sans ombre — c'est l'objet réel du test, voir la
suite du fichier) et non un total qui bouge tous les jours. Deux façons possibles, choisir la
plus simple compatible avec le reste du fichier (à lire en entier avant de trancher) :

1. Lire le nombre réel d'entrées via la même source que la page (`getAllJournalEntrySummaries`
   depuis `src/system/journal.ts`, si elle est importable côté test Node/Playwright), et
   asserter `toHaveCount(await getExpectedCount())` au lieu d'un littéral.
2. Si l'import direct côté test n'est pas praticable (contexte navigateur Playwright vs
   Node), asserter `await expect(rows).not.toHaveCount(0)` pour la présence, puis vérifier le
   style (carré/sans ombre) sur TOUTES les lignes retournées par le locator plutôt que sur un
   total fixe — c'est déjà ce que fait la suite du test (`decoratedElements`), donc l'assertion
   de comptage n'a peut-être même pas besoin d'un nombre précis pour remplir son rôle réel.

**Ne pas juste remplacer `20` par `21`** — ça re-casserait au prochain article publié (le
moteur journal-quotidien publie automatiquement). Le fix doit survivre à la croissance
continue du contenu, pas seulement corriger le chiffre d'aujourd'hui.

## Tests / vérification attendus

1. `npx playwright test tests/conformity-journal.spec.ts --browser=chromium` doit passer
   contre le contenu RÉEL actuel du journal (21 entrées ou plus au moment du test).
2. Ne pas casser les autres assertions du même fichier (style carré/sans ombre) — les lire
   avant de modifier, elles restent le cœur du test.
3. `npm run lint` doit rester vert sur ce fichier.

## Périmètre — ce que ce lot NE fait PAS

- Ne touche à aucun composant applicatif (`RevHeader.tsx`, `CalInline.tsx` — déjà couverts par
  un autre lot, PR #222, indépendant).
- Ne modifie pas `src/app/(rev01)/journal/page.tsx` ni `src/system/journal.ts` sauf si la
  lecture du fichier prouve que le fix doit passer par une fonction exportée manquante (auquel
  cas documenter précisément pourquoi dans la PR).
- N'ajoute pas de pagination à l'index du journal — ce n'est pas dans le périmètre demandé,
  et changerait un comportement produit sans décision explicite de Paul.
- Ce lot est un canary du chantier SELF_HEALING_INGESTION_AND_AGENT_MAIL_V0 : la preuve
  attendue est que ce test cesse de casser à chaque nouvelle publication du journal, pas
  seulement qu'il passe aujourd'hui.
