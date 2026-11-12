# Intégration de main dans la branche de polissage — 12/11/2026

Branche : `codex/docs-CODEX-SPEC-2026-11-12-polissage-ui-skills-des`.
HEAD : `75ba14b`. Main déjà fetché : `fda6604` (#375, #378, #379).
Base commune : `d7da52b`.

## Première passe — limite Git historique

Les fichiers sont intégrés et les validations demandées passent. **Aucun commit
de merge ni push effectué.** `git merge --no-commit --no-ff origin/main` échoue
avant de commencer : création de `ORIG_HEAD.lock` interdite dans les métadonnées
du worktree, sous `/Users/paullarmaraud/parrit-site/.git/worktrees/`.
Ce chemin est hors des racines autorisées en écriture. L'index et HEAD restent
inchangés ; il n'y a pas de fusion Git en cours. La finalisation nécessite un
environnement autorisé à écrire ces métadonnées. Aucune PR fusionnée.

## Résolution à trois versions dans les fichiers

- `AI_CONTEXT.md` : conservation des sections polissage et de toutes les sections
  entrantes sur la machine à articles et ses correctifs de recherche.
- `tests/action-unique.test.mjs` : union des assertions sur les six noms publics,
  les permissions effectives et l'absence des deux clients retirés ; correctif
  de main conservé pour l'export autorisé Carte Noire.
- `tests/home-visual-layers.test.mjs` : conservation du compte à six, de l'égalité
  exacte des logos autorisés et des contrôles entrants de permissions/exclusion.
- `tests/single-page.test.mjs` : conservation des exclusions dans le HTML complet
  et dans les références, avec six logos et l'accord Carte Noire de main.

Fusion automatique sans conflit de `AGENTS.md` et `rev01.css` : exception Journal
et styles de tableaux entrants ajoutés, règles et espacement existants conservés.
Les 44 fichiers propres à main et les 15 propres à la branche sont identiques
octet pour octet à leurs versions sources, notamment CI Ubuntu 24.04, machine
Journal, DESIGN.md, six PUBLIC_CLIENT_NAMES, états :active et bandeaux Historique.

## Validation

- Avant : `npm run lint` réussi ; `node --test tests/*.test.mjs` : 335/335.
- Après : `npm run lint` réussi ; même commande Node : 480/480, aucun échec ni skip.
- `git diff --check` réussi ; aucun marqueur de conflit restant.
- Revue indépendante en lecture seule : aucune anomalie de fusion repérée.
- 58 PNG sous `.codex-handoffs/` vérifiés par SHA256, tous inchangés depuis le début,
  y compris les trois fichiers déjà modifiés par l'utilisateur.
- Aucun build, test navigateur ou résultat de production revendiqué.

Sauvegarde des fichiers préexistants : `/private/tmp/parrit-merge-backup/`.
Manifeste des 50 chemins intégrés : `/private/tmp/parrit-merge-manifest.json`.
Journaux : `/private/tmp/parrit-merge-{baseline,final}-{lint,tests}.log`.
Cette procédure de reprise est exécutée dans la finalisation ci-dessous.


## Finalisation Git — reprise du 12/11/2026

Les métadonnées Git sont désormais accessibles en écriture. La commande réelle
`git merge --no-commit --no-ff origin/main` a établi la fusion ; les quatre
conflits attendus ont été résolus par réinjection des fichiers sauvegardés,
puis ajout explicite dans l’index des 50 chemins du manifeste et de ce rapport.
Aucun conflit non résolu ne subsiste.

Parents attendus du commit de fusion, dans cet ordre :

1. Branche : `75ba14b1226c3c5e737d4c509037a6aa94df8d4d`.
2. `origin/main` / `MERGE_HEAD` : `fda6604930c42c663b678d7ed563a35c51099989`.

Le fetch de contrôle échoue sur la résolution DNS de `github.com` ; la fusion
porte donc sur la référence `origin/main` déjà récupérée et identifiée ci-dessus.
Les résolutions et le rapport avant cette reprise, ainsi que les 58 PNG, sont
sauvegardés dans `/private/tmp/parrit-merge-backup/git-finalization/` ;
`snapshot.json` contient leurs empreintes SHA256. La sauvegarde initiale et le
manifeste `/private/tmp/parrit-merge-manifest.json` sont conservés.
Les PNG n’ont pas gêné la fusion : aucun déplacement nécessaire, aucune
modification indexée ; leurs 58 SHA256 restent identiques, y compris les trois
modifications locales préexistantes.

Contrôles rejoués sur les résolutions réinjectées :

- `npm run lint` : réussi, code 0.
- `node --test tests/*.test.mjs` : 480/480, aucun échec ni skip, code 0.
- `git diff --cached --check` : réussi.
- Aucun PNG dans le diff indexé, aucun conflit non résolu.

Journaux : `/private/tmp/parrit-merge-finalization-{lint,tests}.log`.
Ce rapport est inclus dans le commit de fusion ; le SHA final et le résultat
du push sont rendus après exécution. Aucune fusion de PR demandée ni effectuée.
Aucun nouveau résultat de build, navigateur ou production revendiqué.
