# Matière granuleuse — option A — 26/10/2026

Implémentation de `HANDOFF-MATIERE-GRAIN-A.md` dans le checkout demandé,
branche `codex/docs-site-v1-HANDOFF-MATIERE-GRAIN-A-md`, base
`0ba990bdf8db7d32914e61e9fc142212d81e2804`. La spec non suivie présente au
démarrage est conservée sans modification. Aucun commit, push ou déploiement.

## Périmètre et décisions

Sources : AGENTS.md, AI_CONTEXT.md, spec et jetons vendorisés du checkout au
26/10/2026. Documentation Next.js locale CSS/public et Context7 consultée.
Plan : générateur et contrôle des assets, composant et insertion accueil,
tests ciblés puis batterie du dépôt. Écritures limitées au dépôt local,
réversibles par fichier, sans donnée métier ni système externe. Deux builds
Webpack pour la preuve de reproductibilité ; arrêt des essais navigateur dès
confirmation du refus système, sans contournement du sandbox.

## Fichiers

- `scripts/generate-grain.mjs` : PNG indexés opaques à un bit, zlib natif,
  graine fixe, prélèvement uniforme sans remise des cellules de 2 × 2 px.
  Lecture stricte des trois jetons ; absence, valeur illisible ou ambiguë et
  couleurs identiques provoquent un échec. Aucun nouvel ajout de dépendance.
- `public/matiere/grain-clair.png` et `grain-canard.png` : 256 × 256 px,
  respectivement 1 349 et 1 725 octets. Densités 6 % et 10 %, arrondies à la
  cellule entière la plus proche (983 et 1 638 cellules sur 16 384).
- `src/system/components/Matiere.tsx`, `Matiere.module.css`, `index.ts` :
  composant vide, aria-hidden, hauteur Brand OS s6, fond répété pixelated.
- `src/app/(rev01)/page.tsx` : une insertion après H01 dans la colonne
  existante, registre clair, commune aux accueils FR/EN. Aucun texte modifié.
- `scripts/check-grain.mjs` et `brand-conformity-check.mjs` : contrôle de
  chaque fichier du dossier, palette issue des jetons, CRC, format opaque,
  dimensions, densité, cellules et poids ; rejet des fichiers supplémentaires.
  Le lecteur accepte volontairement le format PNG strict du générateur.
- `package.json` : générateur ajouté à la fin de prebuild et nouvelle spec
  navigateur ajoutée à qa:network:rev01.
- `tests/grain.test.mjs` : six tests, dont génération répétée, mutation de
  chacun des jetons dans une copie temporaire, cas invalides, rendu serveur
  FR/EN et absence sur les quatre pages de service.
- `tests/matiere.spec.ts` : quatre parcours FR/EN × 375/1440, deny-all réseau,
  aucun enfant ni texte superposé, taille et absence de débordement, chargement
  du PNG, styles, placement, captures intégrales jointes aux résultats Playwright.
- `tests/brand-os.test.mjs`, `tests/helpers/site-v1-render.mjs` : fixtures
  étendues aux assets requis et au composant réel ; aucune assertion héritée
  supprimée ou affaiblie.
- `AI_CONTEXT.md` et ce rapport : état et limites de validation.

## Exécution

Installation depuis le cache : `npm ci --offline --ignore-scripts`, réussie.
Baseline avant modification, après installation : marque verte ; tests Node
145/148, les trois échecs dus à l'absence de build `.next`.

| Vérification | Résultat |
|---|---|
| `node --test tests/grain.test.mjs` | 6/6 |
| `npm run lint` | Réussi |
| `npx tsc --noEmit` | Réussi |
| `npm run qa:claims:rev01` | Réussi |
| `npm run qa:brand:rev01` | Réussi |
| `npm test` après compilation | 154/154 |
| `npm run test:brand-os` | 24/24 |
| `npm run build` | Turbopack interrompu, sans progression en compilation |
| `npm run build -- --webpack` | Deux exécutions réussies, 62 pages chacune |
| Deux builds : empreintes PNG | Identiques à l'octet près |
| `next start -p 3210` | Refus système `listen EPERM` |
| `qa:network:rev01 -- --workers=1 --max-failures=1` | Chromium refusé avant navigation ; 1 échec de lancement, 427 non exécutés |
| Spec Matiere seule | Même refus ; 1 échec de lancement, 3 non exécutés |

Empreintes SHA256 après les builds :

```text
988f7ffa5aa4ee5a3180ca6b7e5b4cd213cd34a24200b14f9717b01d8b075110  grain-canard.png
9845a81fe4c7b65f1e9c68576fe784bfa4391ae1e3303cecb88880a8d149ca44  grain-clair.png
```

Une revue indépendante de l'implémentation puis des tests n'a trouvé aucun
défaut bloquant. Elle confirme l'absence d'affaiblissement des assertions.

## Validation restante sur l'hôte

L'acceptation visuelle n'est pas acquise : Chromium échoue avec
`MachPortRendezvousServer: Permission denied (1100)`. Aucun parcours navigateur
ni capture n'a été obtenu ici. Après lancement du serveur local, rejouer
`npm run qa:network:rev01` intégralement ; les quatre captures seront produites
par la spec Matiere dans `test-results/` et attachées au résultat de test pour
être jointes à la PR par le script/relecteur. Le build Turbopack standard reste
également à confirmer sur l'hôte. Aucune preuve de production, conformément au
mandat sans déploiement.

Journaux de cette session : `/private/tmp/grain-{baseline-test,baseline-brand,
targeted,lint,types,claims,brand,test,brand-os,build,build-webpack-1,
build-webpack-2,network,browser-targeted,server}.log` ; empreintes comparées
`/private/tmp/grain-build-{1,2}.sha256`.
