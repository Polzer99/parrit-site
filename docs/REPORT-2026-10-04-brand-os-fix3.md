# Brand OS FIX3 : compte rendu du 04/10/2026

## Périmètre

Source : spec locale `docs/CODEX-SPEC-2026-10-04-parrit-ai-brand-os-v1.md`,
dont l'ajout FIX3 préexistait à cette intervention et reste intact.
Base : HEAD `bc877af` du worktree demandé. Migration initiale, FIX1 et FIX2 déjà
présents ; les cinq fichiers vendorisés et les quatre icônes sont identiques
octet pour octet au paquet canon local du 04/10/2026.

Écritures limitées au dépôt local, réversibles par diff ; aucune donnée métier,
aucun système client, aucun commit, push ou déploiement. Boucle bornée : baseline,
correction ciblée, relecture du diff et vérification ; build limité à 100 secondes
par passage. Aucune nouvelle API Next : guide local `not-found.md` consulté.

## Fichiers modifiés

- `src/app/(rev01)/rev01.css` : deux labels de la section maison rendus en blocs,
  séparés par le jeton `--s3` (24 px). Styles propres à la 404 : titre sur toute
  la colonne et actions verticales alignées à gauche, sans le padding de clôture
  de 130 px ; espace inférieur `--s8`.
- `src/app/not-found.tsx` : classes dédiées à la 404 ; Journal devient un bouton
  secondaire. L'accueil EN reste l'unique action pleine, l'accueil FR secondaire.
- `tests/brand-os.spec.ts` : six nouveaux cas FR/EN à 375, 768 et 1440 px vérifient
  les coordonnées verticales distinctes, l'ordre, l'écart de 24 px et l'alignement
  des labels. Les deux tests 404 existants sont conservés à 375 px et déclinés à
  1440 × 900 : alignement titre/kicker/liens, visibilité complète des trois liens
  dans la fenêtre et avant le footer, un fond plein canonique et deux transparents.
  Le deny-all réseau partagé reste actif ; aucune assertion existante assouplie.
- `AI_CONTEXT.md` : état FIX3 et lien vers ce rapport.
- `docs/REPORT-2026-10-04-brand-os-fix3.md` : présent compte rendu.

Aucun texte visible modifié. Aucun fichier canonique réécrit. La spec modifiée par
l'utilisateur ne fait pas partie des modifications de cette intervention.

## Vérifications

- `npm ci --offline --no-audit --no-fund` : réussi, 462 paquets depuis le cache.
- Baseline : lint, marque et claims réussis ; Chromium bloqué avant rendu.
- Candidat : lint, TypeScript, marque, claims et `git diff --check` réussis.
- `npm run build` standard Turbopack : baseline et candidat arrêtés après
  100 secondes (code 124), toujours à « Creating an optimized production build ».
  Aucun changement de bundler ou de configuration.
- `npm run test:brand-os` : 9 réussites, 3 échecs dus aux artefacts de build
  absents (HTML prérendu et `.next/required-server-files.json`). Origine, polices,
  tests négatifs des contrats, contrastes des jetons et rendu PNG des OG réussis.
  Log local : `/tmp/parrit-brand-fix3-node.log`.
- Découverte Playwright : 128 tests, 13 fichiers, soit huit cas supplémentaires.
- `qa:network:rev01 -- --workers=1 --max-failures=1` : échec au démarrage de
  Chromium, `bootstrap_check_in ... Permission denied (1100)` ; 127 cas non exécutés.
  Log local : `/tmp/parrit-brand-fix3-network.log`.

La preuve visuelle attendue reste l'exécution réelle des tests de géométrie et
les captures hors sandbox. Aucun résultat navigateur ni résultat de production
n'est déclaré validé dans cet environnement. Aucun nouvel arbitrage nécessaire.
Le script doit rejouer `npm run build`, `npm run test:brand-os`, puis démarrer
`next start -p 3210` et lancer `npm run qa:network:rev01` hors sandbox.
