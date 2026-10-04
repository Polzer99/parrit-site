# Brand OS : exécution FIX2 du 04/10/2026

## Périmètre et sources

Source : spec locale `docs/CODEX-SPEC-2026-10-04-parrit-ai-brand-os-v1.md`, y compris
son ajout FIX2 déjà modifié à l'arrivée. Ce fichier est préservé intégralement.
Base du travail : HEAD `83ddbdc`, qui contient déjà la migration initiale et FIX1.
Les cinq fichiers vendorisés et les quatre icônes sont identiques octet pour octet
au paquet canon hors dépôt ; aucune recopie ni reprise de cherry-pick nécessaire.

Écritures limitées aux fichiers locaux du dépôt, réversibles par leur diff ; aucune
donnée métier, aucun système client, aucun commit, push ou déploiement.
Boucle bornée : baseline, correction FIX2, relecture indépendante, vérification.

## Fichiers modifiés par cette exécution

- `src/app/(rev01)/rev01.css` : placeholders à opacité 1 et couleur `--g4-d` ;
  boutons désactivés transparents à bordure et texte `--g3` (alias clair sur les
  conteneurs sombres), y compris hover/active ; labels sombres `--g4-d` ; suppression
  du fondu d'opacité du texte de chargement Cal pour conserver son contraste.
- `src/lib/registry/ressources.ts` : deux formulations exactes restaurées :
  « La matrice qui associe chaque tâche à un modèle, et le calcul de ce que vous payez en trop. »
  et « La matrice qui associe chaque tâche à un modèle, avec les seuils ».
- `tests/conformity-home.spec.ts` : attendu conforme au libellé déjà livré,
  « Let's meet » / « Rencontrons-nous », sans flèche-caractère.
- `tests/brand-os.spec.ts` : les contrôles désactivés ne sont plus exclus de la
  mesure du contraste du texte ; ajout du seuil 3:1 sur leur bordure ; quatre
  tests FR/EN × 375/1440 px vérifient état vide, survol, activation après saisie,
  puis désactivation pour des espaces seuls. Ils vérifient opacité, fond, bordure
  visible, couleurs, curseur et conservation du rose actif. Aucun formulaire envoyé.
  Le deny-all partagé reste actif ; aucune assertion de contraste assouplie.
- `AI_CONTEXT.md` : ajout du comportement FIX2 et lien vers ce rapport.
- `docs/REPORT-2026-10-04-brand-os-fix2.md` : ce compte rendu.

## Validation

- `npm ci --offline --no-audit --no-fund` : réussi, 462 paquets depuis le cache.
  npm signale les scripts d'installation non autorisés de fsevents et unrs-resolver.
- Baseline : lint, qa:claims:rev01 et qa:brand:rev01 réussis.
- Candidat : lint, TypeScript (`npx tsc --noEmit`), qa:claims:rev01,
  qa:brand:rev01 et `git diff --check` réussis.
- `node --test tests/brand-os.test.mjs` : 6/6 réussis, incluant les contrastes
  des jetons et le rendu PNG réel des deux routes OG sans réseau.
- Paquet canon : 9/9 fichiers identiques, favicon RGBA corrigé déjà présent.
- Relecture indépendante statique : aucun défaut CSS bloquant ; fragilité des
  assertions pendant les transitions corrigée avec les assertions réessayées `toHaveCSS`.
- `npm run qa:network:rev01 -- --workers=1 --max-failures=1` : 120 tests découverts,
  arrêt au premier lancement de Chromium, refus macOS `bootstrap_check_in ...
  Permission denied (1100)` ; 119 tests non exécutés. Aucun résultat navigateur validé.
  Journal d'exécution local : `/tmp/parrit-brand-fix2-network.log`.

## Limites

Le build standard Turbopack reste en compilation sans aboutir dans cet environnement.
La baseline a été interrompue ; le candidat a atteint la limite de 100 secondes
(code de sortie 124), toujours en compilation. Aucun basculement
Webpack ni modification de configuration pour contourner cette limitation.
Sans build complet, les trois tests dépendant des artefacts `.next` de
`npm run test:brand-os` échouent (HTML compilé et required-server-files absents) :
9 tests réussis et 3 échoués. Journal local : `/tmp/parrit-brand-fix2-node.log`.
Le pont doit rejouer le build standard, test:brand-os puis qa:network:rev01 contre
next start hors sandbox. Les captures et les contrastes effectifs du navigateur
restent donc à confirmer ; aucune preuve de production, déploiement interdit.

Les arbitrages de positionnement/offres et de photo restent hors lot. Aucun nouveau
texte commercial hors des deux formulations explicitement prescrites.
