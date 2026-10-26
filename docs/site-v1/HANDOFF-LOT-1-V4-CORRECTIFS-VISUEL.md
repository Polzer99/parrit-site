# Handoff Codex — site V1, lot 1, version 4 : correctifs de la passe visuelle (26/10/2026)

Writer : Codex · Superviseur : Claude. Repart de la PR #325. **Aucune fusion ni mise en ligne sans validation de Paul.**

## Constat sur l'hôte (le bac à sable ne lance pas Chromium) : 390 réussis, 22 échoués
L'erreur vient de la spec V3 (Claude), pas de l'exécution : elle demandait des H2 à `--d-m` (54 px) et trois liens en H12, ce que l'échelle fermée et les tests existants du site interdisent. **Les tests ont raison : corriger le rendu, ne modifier aucun test.**

1. `design-harmonisation.spec.ts:55` et `:226` : les H2 de section (`#H03`, `#H05`, `#H06`… et pages nouvelles) reviennent à l'échelle existante : 40 px au-dessus de 760 px, 32 px en dessous.
2. `doctrine-visible.spec.ts:84` : les `main h3` reviennent à 22 px (les étapes « Observer »… et les titres de carte).
3. `conformity-home.spec.ts:5` : H12 garde **un seul lien**, vers `/commission` (ou `/fr/commission`). Les deux autres rangées de la V3 sont retirées.
4. `aeration.spec.ts:114` : 3 nouveaux contrôles neutres sous 3:1 sur `/` et `/fr` (390 et 1440). Les identifier (probablement les rangées à filet de H02/H04 ou les rangées numérotées) et les porter à 3:1 avec les jetons existants, sans agrandir la liste de dette.

5. **Relance (batterie rouge au premier passage)** : le seul échec restant est `tests/site-v1-visual.test.mjs:16`, test **créé par la V3** qui attend encore trois destinations en H12. L'interdiction de toucher aux tests vise les tests existants du site avant la V3 ; ce test-ci doit être aligné sur la décision du point 3 : exactement une destination `/commission` (ou `/fr/commission`) en H12. Garder toutes ses autres assertions.

Tout le reste de la passe V3 est conservé (filets, rangées numérotées, régimes alternés, statut de preuve en tête de carte, schéma du hero, mouvement court et désactivé en mouvement réduit), dans la mesure où il tient dans l'échelle fermée.

## Contrôles
1. Batterie `npm ci --silent && npm run lint && npm test && npm run build` verte.
2. Claude rejoue toute la suite Playwright sur l'hôte : 0 échec.
3. Revue visuelle de Claude, puis aperçu soumis à Paul.
