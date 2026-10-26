# Lot 1 V3 visuel : implémentation et limites de validation

26 octobre 2026. Aucun commit, push, merge ou déploiement effectué.

## Base et périmètre

Le checkout fourni était `2115aab`, alors que le handoff exige de repartir de
`d05a3b4` (V2). Le seul changement préexistant était le handoff V3 non suivi ; il
est conservé. Le diff `2115aab..d05a3b4` a été appliqué aux fichiers de travail,
sans modifier HEAD ni l'index. Le relevé Metalab a été repris à l'identique depuis
`2692525`. Les changements du socle V2 sont donc inclus dans la livraison :
routes, navigation, registre de preuves, textes, tests et documentation.

Cible : dépôt local, environnement de développement, fichiers seulement.
Aucune écriture métier ou distante ; aucune donnée à migrer. Modifications
réversibles par comparaison avec HEAD et la base V2. Aucun fichier initialement
modifié n'a été écrasé. La reprise V2 est une dépendance explicite du handoff,
pas une nouvelle réécriture éditoriale V3.

## Modifications propres à V3

- `src/app/(rev01)/page.tsx` : régimes accessibles alternés, listes ordonnées
  01–04 / 01–06, trois actions H12 avec les libellés existants vers la commission
  localisée. Les dictionnaires FR/EN sont identiques à V2.
- `src/system/components/CaseStudyCard.tsx` : statut déplacé en tête, toujours
  dans un DL avec son libellé ; aucune modification des permissions ou des textes.
- `src/system/components/SiteV1Page.tsx` : régimes sur les pages nouvelles ; CTA
  neutres pour éviter de cumuler leur accent rose avec celui de la navigation.
- `src/system/site-v1.css` : H1 à 84 px desktop, interligne 0,98 et approche
  −0,035 em ; H2 `--d-m`, corps 18 et métadonnées mono 16 ; grille six colonnes,
  gouttière `--s3`, respirations `--s8` ; références et preuves en rangées ; filets
  verticaux des méthodes ; suppression des cadres du schéma du hero, connecteurs
  VS-CONNECTOR existants conservés ; masques rectangulaires de 600 ms et survols
  de 240 ms, désactivés en mouvement réduit. Aucun JS d'animation ajouté.
- `package.json` : nouvelle spec visuelle dans `qa:network:rev01`.
- `tests/site-v1.test.mjs`, `tests/site-v1.spec.ts` : exclusion des seuls indices
  de méthode du contrôle des chiffres non sourcés. Le contrat a changé explicitement
  avec V3 ; les nouvelles assertions vérifient la séquence exacte et sa cardinalité.
- `tests/site-v1-visual.test.mjs` : 2 tests FR/EN du rendu serveur sans réseau :
  listes, métadonnées de preuve, destinations, régimes et connecteurs.
- `tests/site-v1-visual.spec.ts` : 11 tests navigateur, cinq largeurs et deux langues,
  géométrie, mouvements réduits, focus clavier, filets, statut au-dessus du titre,
  destinations et contenu sans JavaScript ; deny-all réseau.
- `AI_CONTEXT.md` et ce rapport : état et limites de reprise.

Les pages Standard et Manufacture sont identiques à `d05a3b4`. Elles contiennent
les modifications déjà livrées par V2 par rapport à `2115aab` ; aucune modification
V3 ne les cible. Les contrats vendorisés, polices et dette de contraste sont inchangés.

## Exécution

| Contrôle | Résultat |
|---|---|
| `npm ci --silent` | Réussi |
| Baseline V2 `npm test` avant build | 141/144 ; 3 échecs dus à l'absence de `.next` |
| Tests ciblés Node | 26/26 |
| `npm run lint` | Réussi |
| `npx tsc --noEmit` | Réussi |
| `npm run qa:brand:rev01` | Réussi |
| `npm run qa:claims:rev01` | Réussi |
| `npm run build` (Turbopack) | Interrompu après plusieurs minutes sans progression |
| `npm run build -- --webpack` | Réussi |
| `npm test` après build | 146/146 |
| `npm run test:brand-os` | 24/24 |
| Spec navigateur V3 | 1 échec de lancement Chromium, 10 non exécutés |
| `qa:network:rev01`, arrêt au premier échec | 1 échec de lancement Chromium, 411 non exécutés |
| `git diff --check` | Réussi |

Le refus Chromium est antérieur à la navigation :
`bootstrap_check_in … MachPortRendezvousServer … Permission denied (1100)`.
Aucun échec fonctionnel navigateur n'est établi ; aucune réussite visuelle ne
peut être revendiquée. Journaux : `/private/tmp/v3-*.log`.

La chaîne stricte `npm ci && lint && test && build` ne peut pas être déclarée
verte : les tests Brand OS dépendent du build, et Turbopack ne termine pas ici.
Webpack valide la compilation, pas le fonctionnement de Turbopack.

## Écarts éditoriaux non résolus

1. T04 demande libellé + déclaration + paragraphe pour chaque section, mais
   plusieurs sections V2 (H02, H04, H11, H12 et certaines sections des guides)
   ne disposent pas de ces trois éléments. L'interdiction de modifier les textes
   empêche de compléter cette grammaire sans arbitrage. Leur contenu reste intact.
2. H02/H04 sont en rangées à filets, mais n'ont pas d'action individuelle : V2
   ne donne aucune destination finale validée pour chaque référence ou exemple.
   Aucun faux lien vers un dossier sans rapport, aucune URL fabriquée, aucun
   bouton sans fonction n'a été ajouté. Les destinations validées sont nécessaires.

Ces deux points ont fait l'objet d'une question à Paul durant l'exécution. En
l'absence de réponse, ils restent ouverts : la spec n'est pas intégralement close.

## Preuve restant à obtenir

Claude doit rejouer la suite Playwright sur l'hôte et produire les captures
360/390/768/1024/1440 FR/EN (`scripts/capture-site-v1.sh`), puis vérifier visuellement
les contrastes, la lisibilité, le premier écran mobile et l'accent unique par écran.
Les captures ne sont pas produites dans ce sandbox. Aucun aperçu Vercel n'est créé,
conformément à l'interdiction de déployer donnée pour cette tâche.
