# Spec — calculateur : le test de l'animation vérifie l'animation elle-même

Niveau de risque : faible (un seul fichier de test, aucun code de production).

## Contexte
PR #394 (fusionnée, 99a09db) : le chiffre du calculateur rejoue l'animation `calc-tick` à chaque nouveau résultat, grâce à une clé React sur `<strong data-calc-result>` dans `src/system/components/HomeGoals.tsx`. Le test `calculator result replays its tick (${motion})` de `tests/accueil-epure.spec.ts` vérifie le nom d'animation CSS et le remplacement du nœud, mais pas qu'une animation tourne réellement sur le nouveau nœud.

## À faire
Dans `tests/accueil-epure.spec.ts`, test `calculator result replays its tick`, juste après `await expect(result).not.toHaveAttribute("data-old");`, ajouter :
```ts
// The new node must actually run the tick (or run nothing under reduced motion).
const ticks = await result.evaluate(el => el.getAnimations().filter(a => (a as CSSAnimation).animationName === "calc-tick").length);
expect(ticks).toBe(motion === "reduce" ? 0 : 1);
```
Si l'animation de 0,22 s peut déjà être finie au moment de la lecture (`getAnimations()` vide), lire plutôt avec `expect.poll` ou capturer le compte dans un `MutationObserver` posé avant le `fill` ; choisir la forme la plus simple qui ne soit pas instable.

## Interdits
- Ne modifier aucun autre fichier, ni aucun autre test.
- Aucun secret, aucun `.env`.
- Ne pas fusionner.

## Preuve attendue
`npx playwright test tests/accueil-epure.spec.ts --browser=chromium` vert (si Chromium est inaccessible dans le bac à sable, le dire : Claude lance la vérification sur l'hôte).
