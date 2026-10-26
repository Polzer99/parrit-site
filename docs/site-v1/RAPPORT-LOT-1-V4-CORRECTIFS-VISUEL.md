# Lot 1 V4 : correctifs et résultats

26 octobre 2026. Aucun commit, push, merge ou déploiement.

## Reprise après clarification du point 5 (état final)

Le dépôt contenait déjà les correctifs de rendu V4 et leurs tests au démarrage
de cette reprise. Ils ont été conservés, ainsi que tous les autres changements
locaux. Aucun nouveau correctif CSS ou TSX n’était nécessaire après inspection.

Le point 5 du handoff précise que l’interdiction de modifier les tests concerne
ceux antérieurs à V3. Trois assertions V3 sont donc alignées sur H12 :

- `tests/site-v1-visual.test.mjs` : exactement une destination localisée au lieu
  de trois, pour FR et EN ; toutes les autres assertions conservées.
- `tests/site-v1-visual.spec.ts` : cardinalité 1 dans les dix parcours responsive
  et le parcours sans JavaScript ; contrôles de destination, focus, hauteur,
  géométrie, mouvement, preuves et réseau conservés.
- `AI_CONTEXT.md` et ce rapport : actualisation des résultats.

Aucun test supplémentaire ajouté pendant cette reprise : les deux tests Node
et les douze tests navigateur V4 déjà présents couvrent les correctifs demandés.
Aucun test antérieur à V3 modifié par cette reprise. La contradiction décrite
plus bas appartient à l’exécution précédente et est désormais résolue.

### Vérifications de la reprise

Journaux : `/private/tmp/v4-reprise-*.log`.

| Contrôle | Résultat |
|---|---|
| Baseline ciblée V3/V4 avant modification | 2/4 : deux échecs H12 attendus |
| `npm ci --silent` | Réussi |
| `npm run lint` | Réussi |
| `npx tsc --noEmit` | Réussi |
| `npm run qa:brand:rev01` et `npm run qa:claims:rev01` | Réussis |
| `npm run build` | Turbopack interrompu sans progression en compilation |
| `npm run build -- --webpack` | Réussi, 62 pages générées |
| `npm test` après build terminé | 148/148 |
| `npm run test:brand-os` | 24/24 |
| `npx next start -p 3210` | Refus sandbox : `listen EPERM` |
| `npm run qa:network:rev01 -- --max-failures=1` | Chromium refusé avant navigation ; 1 échec, 4 interrompus, 419 non exécutés |
| `git diff --check` | Réussi |

Un premier lancement de `npm test` concomitant au build avait échoué sur les
artefacts compilés ; le rejeu après build est intégralement vert. Le build
Webpack valide la compilation, mais ne rend pas verte la commande Turbopack
prescrite. Aucun test réseau ni revue visuelle n’est déclaré réussi.

Preuve restante : Claude rejoue les 424 cas navigateur sur l’hôte et effectue
la revue visuelle avant soumission de l’aperçu à Paul. Aucun commit, push,
merge ou déploiement effectué.

## Historique de la première exécution V4

## Base et préservation

Le checkout initial est `2115aab`, antérieur à la V3 demandée par le handoff.
Seul `docs/site-v1/HANDOFF-LOT-1-V4-CORRECTIFS-VISUEL.md` était non suivi ; il
est conservé intact. La base V3 disponible localement, `19e5e88`, a été reprise
par application de son diff dans les fichiers de travail, sans changer HEAD ni
l'index. Le diff global inclut donc les 72 fichiers du socle V3 (routes,
navigation, contenus, registre, tests et documentation), pas seulement les
correctifs ci-dessous. Les fichiers de tests hérités sont tous identiques octet
pour octet à `19e5e88`.

Cible : fichiers du dépôt local, environnement de développement. Aucune écriture
distante ou métier, aucune migration. Changements réversibles par comparaison
avec HEAD et le commit V3 ; aucun changement préexistant écrasé. Limite de travail :
une passe de correction et vérifications ciblées, sans contournement du sandbox.

## Changements propres à V4

- `src/system/site-v1.css` : H2 de section sur `--d-s` (40 px, 32 px jusqu'à
  760 px inclus), clôtures conservées sur `--d-m` (54/34 px), retrait de H3 de
  la règle de corps à 18 px pour retrouver `--t-l` (22 px).
- Même fichier : contour des onglets H06 sur le jeton `--brand-fg` du régime
  canard, y compris l'état sélectionné. Aucune nouvelle couleur, aucun changement
  du paquet vendorisé ni de la liste de dette.
- `src/app/(rev01)/page.tsx` : H12 garde une seule rangée et un seul lien vers
  `/commission` ou `/fr/commission`, avec le libellé existant.
- `tests/site-v1-v4.test.mjs` : deux tests du rendu serveur sans réseau,
  vérifiant la cardinalité et la destination de H12 en FR/EN.
- `tests/site-v1-v4.spec.ts` : douze tests navigateur avec deny-all partagé.
  H2/H3 sur l'accueil et les quatre nouvelles pages, FR/EN, à 390/760/761/1440 px ;
  absence de débordement, lien H12 unique et focus ; contraste des quatre côtés
  du contour de chacun des trois onglets sélectionnés à 390/1440 px en FR/EN.
- `package.json` : ajout de cette nouvelle spec à `qa:network:rev01`.
- `AI_CONTEXT.md` et ce rapport : état et limites de validation.

Filets, indices numérotés, régimes alternés, métadonnées de preuve, schéma du
hero et mouvements V3 restent inchangés. Standard et Manufacture sont identiques
à la base V3. Aucun test existant modifié ou désactivé.

## Diagnostic du contraste

Source factuelle : traces de l'hôte présentes dans le worktree V3,
`test-results/tests-aeration-at-1440px-a-dc0bb-ithin-the-closed-type-scale/error-context.md`
et `tests-aeration-at-390px-al-e9a67-ithin-the-closed-type-scale/error-context.md`.
Elles désignent l'onglet actif H06 `button#_R_r5feivb_-tab-0`, avec un rapport
de 2,749:1, et non les rangées H02/H04. Les trois occurrences consignées concernent
ce même contrôle dans plusieurs parcours.

Le calcul WCAG depuis les jetons vendorisés confirme 2,7489:1 pour l'encre sur
canard. Le contour clair du registre donne 5,7680:1. C'est une preuve numérique
sur les couleurs et une correction de cascade CSS ; ce n'est pas une mesure du
rendu navigateur final. La nouvelle spec mesure ce rendu sur les trois sélections.

## Vérifications exécutées

Journaux : `/private/tmp/site-v4-*.log`.

| Contrôle | Résultat |
|---|---|
| `npm ci --silent` | Réussi |
| Baseline V3, `npm test` sans build | 143/146 ; 3 échecs dus à l'absence de `.next` |
| `npm run lint` final | Réussi |
| `npx tsc --noEmit` final | Réussi |
| `npm run qa:brand:rev01` | Réussi |
| `npm run qa:claims:rev01` | Réussi |
| `npm run build` (Turbopack) | Interrompu sans progression après le début de compilation |
| `npm run build -- --webpack` final | Réussi |
| `npm test` après build final | 146/148 ; deux assertions V3 contradictoires avec V4 |
| `npm run test:brand-os` | 24/24 |
| Nouvelle spec V4 Chromium | Refus de lancement, 1 échec et 11 non exécutés |
| `qa:network:rev01 -- --max-failures=1` | Refus de lancement Chromium ; 424 cas recensés, aucune validation fonctionnelle |
| `npx next start -p 3210` | `listen EPERM`, port interdit par le sandbox |
| `git diff --check` | Réussi |
| Comparaison des tests existants avec V3 | Aucun fichier modifié |

Une exécution intermédiaire de `npm test` pendant la recompilation avait les
trois échecs d'artefacts supplémentaires ; le résultat ci-dessus est celui du
rejeu après la fin du build. Le refus Chromium est antérieur à la navigation
(`MachPortRendezvousServer`, permission denied). Aucun résultat de géométrie ou
capture finale ne peut être annoncé.

## Contradiction bloquante dans les tests hérités

La V4 exige un seul lien H12 et dit explicitement « ne modifier aucun test ».
Or `tests/site-v1-visual.test.mjs:16` attend trois destinations (deux tests FR/EN)
et `tests/site-v1-visual.spec.ts:32,56` attend trois liens (onze tests navigateur).
Ces assertions ont été conservées. Les deux tests Node échouent pour cette seule
raison ; les onze tests navigateur auront la même contradiction dès qu'ils
pourront s'exécuter. Les tests de conformité home, eux, exigent le lien unique.

Une question a été envoyée pour autoriser uniquement l'actualisation de ces
cardinalités de 3 à 1. Aucune réponse reçue lors de cette livraison : aucune
exception présumée, aucun test affaibli, aucun masquage d'échec. La batterie
stricte demandée n'est donc pas verte.

## Preuve restante

Après résolution explicite de la contradiction, Claude doit rejouer toute la
suite Playwright sur l'hôte, produire les captures, vérifier les quatre correctifs
et la conservation du rendu V3. La revue visuelle et l'aperçu soumis à Paul ne sont
pas réalisés ici. Aucun déploiement n'est lancé pour obtenir cet aperçu.
