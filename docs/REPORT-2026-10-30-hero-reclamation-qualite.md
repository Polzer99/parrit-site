# Hero : réclamation qualité, compte rendu du 30/10/2026

Source : `docs/CODEX-SPEC-2026-10-30-hero-reclamation-qualite.md`.
Baseline locale demandée : `f0a4b630dc1307193c05c6705ff502e564996679`.
La spec était le seul fichier non suivi initialement ; elle est conservée sans modification.

## Modifications

- `src/system/ontology-hero-data.ts` : quatrième histoire remplacée par la réclamation qualité ; ajout de `rel_recl_commande`, `up_procedures_recl` et `top_recl_rech`.
- `src/system/single-page-copy.ts` : cinq traductions ajoutées, six anciennes chaînes inutilisées retirées. La sixième traduction demandée, « le système le relie à sa commande », existait déjà et reste partagée avec la première histoire.
- `tests/fixtures/hero-quality.json` : attentes indépendantes issues de la spec, phrases FR/EN, résultat, décision humaine et parcours cumulatif des nœuds/liens.
- `tests/ontology-motion.test.mjs` et `tests/single-page.spec.ts` : assertions ajoutées aux parcours existants pour vérifier ces attentes à chacune des cinq étapes et dans les deux groupes SVG. Les contrôles de hauteur couvrent les vingt étapes, FR/EN, à 320, 360, 390, 1024, 1280 et 1440 px.
- `AGENTS.md`, `AI_CONTEXT.md`, `TRUTH.md` : amendement documenté, avec sa raison : parler aussi à l’industrie.

Les tracés et réservations SSR dérivent déjà des données. Aucun changement de composant, de style, de durée ou de seuil. `tests/stabilite.spec.ts` reste strictement inchangé.

## Vérifications

Avant modification : installation `npm ci --offline --no-audit --no-fund`, build Webpack, 134/134 tests Node et 19/19 tests ciblés réussis.

Comparaison structurelle avant/après réussie : trois premières histoires identiques, tous les nœuds et positions conservés, listes de liens seulement augmentées des trois paires prescrites, autres traductions identiques, HTML serveur hors hero strictement identique en FR et EN. Snapshot de contrôle local : `/private/tmp/hero-quality-baseline.json`.

Résultats finaux :

| Vérification | Résultat |
|---|---|
| `npm run lint` | Réussi |
| `npm run qa:brand:rev01` | Réussi |
| `npm run qa:claims:rev01` | Réussi |
| Tests ciblés Node | 19/19 avant et après |
| `npm run build` (Turbopack) | Sans progression, interruption du superviseur ; processus Next resté actif |
| `npm run build -- --webpack` | Réussi dans la copie temporaire identique |
| `tsc --noEmit` | Réussi dans cette copie |
| `npm test` | 134/134, comme la baseline, avec les nouvelles assertions |
| `npm run test:brand-os` | 19/19 |

Le premier essai Webpack dans le dépôt a rencontré le verrou laissé par
Turbopack. Le sandbox interdit de terminer le processus Next (`kill: operation
not permitted`). La copie `/private/tmp/hero-quality-verify-4cw5_atr` utilise
les mêmes fichiers applicatifs et de test, le même lockfile et les mêmes
dépendances ; aucun paramètre applicatif n’a été changé. Le build puis les
tests finaux y ont été exécutés successivement, sans régénération concurrente
du build. Au dernier contrôle, le processus `node` PID 1060 tenait encore
`.next/lock` dans le dépôt : à arrêter sur l’hôte avant un nouveau build local.

Revue indépendante terminée sans défaut concret. `git diff --check` réussi.
Les journaux sont sous `/private/tmp/hero-quality-*.log` ; notamment
`hero-quality-webpack-isolated.log`, `hero-quality-final-tests.log`,
`hero-quality-brand-os.log` et `hero-quality-network.log`.

## Limites de validation navigateur

Le démarrage sur `127.0.0.1:3210` échoue avec `listen EPERM`. La batterie `npm run qa:network:rev01 -- --workers=1 --max-failures=1` est bien lancée : Chromium est refusé avant navigation (`MachPortRendezvousServer`, permission denied, SIGTRAP). Résultat : 1 échec d’environnement et 398 tests non exécutés ; aucun résultat visuel validé.

La découverte Playwright réussit : 399 tests dans 12 fichiers, dont 12 parcours animés du hero FR/EN aux six largeurs. Hauteur rendue, hero entier à 1440 × 800, CLS et captures restent à vérifier sur l’hôte, avec les mêmes tests et seuils. Aucun contournement du sandbox ni du blocage réseau.

## Périmètre d’écriture et arrêt

Écriture locale réversible uniquement dans le dépôt demandé ; aucune donnée métier, aucun système client, zéro ligne de base de données. Retour arrière possible par le diff des fichiers suivis ; spec préexistante préservée. Boucle bornée à une implémentation, une revue indépendante et une validation ; arrêt des tentatives navigateur au blocage de l’environnement. Aucune preuve de production revendiquée : aucun commit, push ou déploiement exécuté.
