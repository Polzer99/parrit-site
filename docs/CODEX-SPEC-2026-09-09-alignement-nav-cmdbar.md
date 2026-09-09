# Alignement vertical de la nav de la command bar

Date : 2026-09-09. Signalé par Paul, deux fois. Périmètre : `src/app/(rev01)/rev01.css`
et `tests/conformity-home.spec.ts`. Aucun autre fichier.

## Le défaut, mesuré en production

Sur `https://parrit.ai/` en 1440×900, les trois entrées de `.cmd-nav` n'ont pas
leur texte sur la même ligne. Mesure du rectangle du nœud texte (Range API), pas
de la boîte :

| entrée | haut du texte | bas du texte | centre |
|---|---|---|---|
| Journal | 10 | 23 | **16,5** |
| Commission | 10 | 23 | **16,5** |
| Your prototype (`.cmd-nav-prototype`) | 19 | 32 | **25,5** |

Écart maximal : **9,00 px**. Les deux liens simples flottent au-dessus du bouton.

## La cause

`.cmd-nav` est un conteneur flex qui ne déclare pas `align-items` : la valeur
calculée est `normal`, c'est-à-dire l'étirement. Les deux liens simples, sans
padding, s'étirent donc sur la hauteur de la ligne — 31 px, imposée par
`.cmd-nav-prototype` et son `padding: 9px 12px` — et leur texte se pose en haut
de cette boîte étirée. Le bouton, lui, a son texte centré par son propre padding.
D'où les 9 px : la moitié de la différence entre 31 px de boîte et 13 px de texte.

## La correction

Dans `.cmd-nav` (fichier `src/app/(rev01)/rev01.css`, bloc « REV 02 — HYBRIDE
B+C »), ajouter la seule déclaration manquante :

```css
.cmd-nav {
  display: flex;
  align-items: center;   /* ← ajout */
  gap: 26px;
  margin: 0 auto;
}
```

Rien d'autre. Ne pas toucher au padding du bouton, ne pas changer la hauteur de
`.cmdbar` (52 px, cote du canon), ne pas toucher au panneau mobile `.cmd-panel`
qui est en colonne et n'a pas le défaut.

Ajouter au-dessus de la déclaration un commentaire court d'une ligne qui dit le
pourquoi : sans `align-items`, les liens sans padding s'étirent sur la hauteur du
bouton et leur texte se cale en haut.

## Le test qui verrouille

Dans `tests/conformity-home.spec.ts`, ajouter un test qui échoue si l'écart
revient. Il doit mesurer le **texte**, pas la boîte — la boîte était déjà alignée
(top 10, bottom 41 pour les trois), c'est précisément pour ça que le défaut a
survécu à tous les gates existants.

```ts
test("command bar nav items share one text baseline", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${BASE_URL}/`);
  const centres = await page.evaluate(() =>
    [...document.querySelectorAll(".cmd-nav a")].map((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const rect = range.getBoundingClientRect();
      range.detach();
      return rect.top + rect.height / 2;
    }),
  );
  expect(centres.length).toBeGreaterThanOrEqual(3);
  expect(Math.max(...centres) - Math.min(...centres)).toBeLessThanOrEqual(1);
});
```

Respecter le deny-all réseau du fichier s'il en pose un en tête, et la façon dont
`BASE_URL` y est déjà défini : ne pas réintroduire une URL en dur.

## Preuve attendue

1. `npm run qa:brand:rev01` vert.
2. `npm run build`, puis `npx next start -p 3210`, puis `npm run qa:network:rev01`
   vert avec le nouveau test.
3. **La preuve que le test mord** : retirer temporairement la ligne
   `align-items: center`, relancer la spec — elle DOIT échouer en affichant un
   écart proche de 9 px. Remettre la ligne, revérifier le vert. Rapporter les deux
   sorties dans le message final.
