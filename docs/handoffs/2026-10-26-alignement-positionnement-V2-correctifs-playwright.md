# Handoff 2026-10-26 V2 — correctifs Playwright de l'alignement six capacités

Base : commit `0d1fe01` (PR #322, implémentation de `2026-10-26-alignement-positionnement-six-capacites.md`). Writer : Codex. Superviseur : Claude.

## Constat (Claude, sur l'hôte, serveur `next start -p 3210`, build Turbopack par défaut réussi)
`npm run qa:network:rev01` : **339 passed, 8 failed**, tous dans `tests/conformity-home.spec.ts`, tous causés par la PR :
1. `home parcours presents two audiences without actions` (×4) : `.home-s-parcours` résout **2** éléments ; la section `capacites` réutilise la classe `home-s-parcours`. Le test exige aussi que `parcours` soit **directement** suivie de `.home-s-maison`.
2. `maison has one booking action without personal branding` (×4) : `.home-s-maison` contient **2** liens ; le lien secondaire Build With You y a été ajouté. La règle du dépôt est une seule action par section.

`tests/six-capacites.spec.ts` : 4/4 verts sur l'hôte.

## À faire
1. La section `capacites` reçoit **sa propre classe** (`home-s-capacites`) ; elle peut réutiliser les styles de grille existants par composition de classes, mais ne porte jamais `home-s-parcours`.
2. **Déplacer** la section `capacites` : après `.home-s-maison` (le déroulement) et avant la section `build` (scène de la carte de visite). L'ordre devient brands → parcours → maison → capacites → build → proof → journal → close.
3. **Retirer** le lien secondaire Build With You de `.home-s-maison`. Le garder dans `RevFooter.tsx` uniquement.
4. Mettre à jour `tests/six-capacites.spec.ts`, `tests/six-capacites.test.mjs` et `docs/REPORT-2026-10-26-six-capacites.md` en conséquence (le lien Build With You est vérifié dans le footer, plus dans l'accueil).
5. Mettre à jour la phrase correspondante de `AI_CONTEXT.md` (« relie Build With You depuis la méthode et le footer » → « depuis le footer »).

## Interdits
Ne modifier **aucune assertion** de `tests/conformity-home.spec.ts` ni d'aucun autre test existant. Aucun changement de copie hors de ce qui précède. Aucun déploiement, aucun appel réseau.

## Contrôles
1. Batterie : `npm ci --silent && npm run lint && npm test && npm run build`.
2. Claude rejoue sur l'hôte `qa:network:rev01` complet (attendu : 0 échec) et regarde les captures 375 et 1440 FR/EN.
3. Validation de Paul avant merge.
