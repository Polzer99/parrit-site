# Retrait des fiches internes du Journal, 04/11/2026

Spec appliquée : `docs/CODEX-SPEC-2026-11-04-retrait-fiches-internes.md`.
Baseline Git : `d42a6ead83aa38d557a68d29954abbd6076df30a`.
La spec était le seul fichier non suivi préexistant ; elle est conservée intacte.
Instructions lues avant modification : `AI_CONTEXT.md`, `AGENTS.md`, `TRUTH.md`
et spec. Guide de tests de la version Next installée consulté.

## Fichiers modifiés

- `content/journal/hook-timeout-lets-tool-call-through.mdx`
- `content/journal/legacy-database-migration-writers-first.mdx`
- `content/journal/what-a-pilot-skips-to-look-finished.mdx`

Dans ces trois fichiers, seuls les octets du bloc `{/* … */}` sont retirés.
Comparaison automatisée avec `git show HEAD:<fichier>` : le résultat est exactement
l'original privé du bloc, espaces et sauts de ligne extérieurs compris.

- `scripts/journal-gates.mjs` : ajout de `gateFichesInternes`, refus de `{/*`,
  `*/}`, `FICHE D'ENTRÉE` et `RAIL parrit` en début de ligne.
- `scripts/publish-journal.mjs` : contrôle du texte brut avant le parsing du
  front-matter, donc avant prooflint, build et publication ; motif explicite.
- `tests/publish-journal-gates.test.mjs` : dix nouveaux tests, fixture isolée
  mutualisée avec le test d'identité existant.
- `tests/brand-os-render.test.mjs` : assertions ajoutées au test existant du
  serveur compilé, sans modifier son blocage réseau.
- `AI_CONTEXT.md` : contrat et résultats consignés.
- Ce rapport.

Le moteur de rendu des articles, leurs métadonnées et le reste du texte sont
inchangés. Aucun test existant assoupli.

## Tests et résultats

| Vérification | Baseline | Candidat |
| --- | --- | --- |
| `npm run lint` | Réussi | Réussi |
| `npm run build -- --webpack` (prebuild inclus) | Réussi | Réussi |
| `npm test` | 156/156 | 166/166 |
| `npm run test:journal` | 9/9 | 19/19 |
| `npm run qa:brand:rev01` | Non exécuté séparément | Réussi |
| `git diff --check` | Sans objet | Réussi |

Installation : `npm ci --offline --no-audit --no-fund`, 462 paquets depuis le
cache local. Aucune dépendance ni lockfile modifié.

Les dix nouveaux tests couvrent quatre refus unitaires (marques seules, après un
paragraphe et dans le texte brut du front-matter), quatre refus par le vrai script
dans une fixture temporaire en `--dry-run`, l'acceptation sans marque et le scan
de tous les fichiers du Journal. Une mention de `RAIL parrit` à l'intérieur d'une
phrase reste acceptée, conformément au critère de début de ligne de la spec.
Le script testé a un PATH vide et un répertoire personnel temporaire ; aucune
publication ni commande Git n'est exécutée.

Le contrôle compilé vérifie l'absence de délimiteurs et de titre de fiche dans
les pages du Journal et le vrai premier paragraphe des trois articles touchés.
HTTP, HTTPS, sockets et fetch sont interdits pendant ce test. C'est une preuve
de rendu serveur local, sans navigateur ni mesure en production.

Relecture locale ciblée : périmètre des suppressions, lecture du texte brut,
intégration du refus avant publication, isolation des tests et absence de
modification du moteur contrôlés. La revue de PR appartient à Claude ; aucune
revue indépendante ou de PR n'est revendiquée ici.

## Périmètre et suites

TARGET_SYSTEM : dépôt local ; ENVIRONMENT : worktree fourni ; WRITE_SCOPE :
trois articles, deux scripts, deux tests et documentation. REVERSIBLE : oui ;
BACKUP : baseline Git pour les fichiers suivis ; ROLLBACK : retrait sélectif
de ce diff en préservant la spec préexistante ; EXPECTED_ROWS : 0 donnée métier.
Aucun système client modifié. Boucle bornée à l'implémentation, une relecture
locale et une correction de précision du test ; aucune récursion de PR engagée.

Aucun blocage sur les vérifications locales demandées. Conformément à la spec,
les 410 tests navigateur restent à rejouer par Claude sur l'hôte ; le navigateur
n'a pas été relancé dans ce bac à sable. PRODUCTION_PROOF encore UNKNOWN : après
fusion, Claude doit contrôler les trois pages en ligne et constater leur vrai
premier paragraphe, sans fiche interne. Aucun commit, push ou déploiement effectué.
