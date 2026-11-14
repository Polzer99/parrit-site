# Journal — budget de raisonnement, 13 novembre 2026

Implémentation de `docs/CODEX-SPEC-2026-11-13-journal-budget-raisonnement.md`.
Base demandée : checkout local `codex/docs-CODEX-SPEC-2026-11-13-journal-budget-raisonne`,
SHA `e70743066e8c5d32504340859e471d499a0b3c7f`. La spec était le seul fichier
non suivi à l'arrivée ; elle a été conservée sans modification.

## Périmètre et sources

Instructions lues avant écriture : `AGENTS.md`, contexte courant `AI_CONTEXT.md`,
spec et doctrine `~/parrit-os/RECURSIVE-AGENT-HARNESS.md`. Le plan suit la spec
validée : configuration et traces, essai isolé, workflow, tests puis vérification.
Une implémentation et un tour correctif après revue adverse indépendante.

TARGET_SYSTEM : dépôt local. ENVIRONMENT : worktree de handoff.
WRITE_SCOPE : scripts Journal, workflow quotidien, tests machine et documentation.
REVERSIBLE : oui, diff local sans commit. ROLLBACK : retirer les modifications de
ce lot en préservant la spec préexistante. BACKUP : base Git ci-dessus, fichiers
préexistants inchangés. EXPECTED_ROWS : aucune donnée métier distante.
Aucun secret consulté, aucun appel LLM réel, commit, push, déploiement ou armement.

Faits vérifiés le 13/11/2026 :

- Code de départ : rédaction/secrétariat à 12 000 jetons, juge à 4 500,
  échelon 2 `effort: low`, alertes rédaction/secrétariat à 0,15 USD.
- [Documentation OpenRouter, raisonnement](https://openrouter.ai/docs/guides/best-practices/reasoning-tokens),
  obtenue avec Context7 : le raisonnement consomme le plafond de sortie ;
  `completion_tokens_details.reasoning_tokens` permet de calculer les jetons visibles.
- [Documentation OpenRouter, routage](https://openrouter.ai/docs/guides/routing/provider-selection),
  obtenue avec Context7 : `provider.max_price.prompt/completion` est en USD par
  million de jetons ; `request` limite le prix par requête.
- Guide CLI installé `node_modules/next/dist/docs/01-app/03-api-reference/06-cli/next.md` :
  `next build --webpack` est le repli documenté au build Turbopack.

Le support effectif des cinq réglages par chaque modèle reste inconnu tant que
l'essai réel après fusion n'a pas été lancé. Aucune efficacité réelle du défaut
`max_tokens: 4000` n'est revendiquée à partir des simulations.

## Fichiers et comportement

- `scripts/journal-machine-config.mjs` : validation centralisée des deux plafonds
  et des deux objets JSON. Défauts : rédaction/secrétariat 32 000, juge 8 000,
  raisonnement `{max_tokens:4000}`. Variables vides du workflow = défauts ;
  valeurs invalides refusées avant restauration, catalogue et paiement.
  Les valeurs de configuration ne sont jamais recopiées dans les erreurs.
- `scripts/journal-machine.mjs` : configuration aux échelons 1/3, `effort:none`
  au deuxième ; recherche inchangée. Routage CLI `--essai-modeles` sans création
  du runtime GitHub. Catalogue enrichi en prix sur demande, retour historique
  d'identifiants conservé pour la production. Les crashs d'essai portent leur mode.
- `scripts/journal-machine-trial.mjs` : une même demande JSON de 120 mots,
  plafond de sortie 3 000, cinq réglages par modèle distinct configuré. Un repli
  commun à deux rôles est testé une seule fois. Aucun retry, recherche, sélection
  de sujet, article, manifeste, restauration, persistance Git ou publication.
  Seuls le JSONL et le résumé de diagnostic sont écrits. 400/422 devient
  `parametre_refuse` et laisse continuer ; coût inconnu ou panne réseau arrête
  l'essai sans nouvel appel.
- `scripts/journal-machine-trace.mjs` : `jetons_visibles`, priorité à `vide`
  lorsque le compte visible est zéro, alertes à 0,25 USD pour rédaction/secrétariat
  et 0,05 pour le juge. Si les détails de raisonnement sont absents, ils valent
  zéro pour la soustraction ; sans compteur de sortie, le résultat reste `null`.
  Résumé avec réglage, HTTP, finish_reason, compteurs, coût, durée et issue ;
  aucun texte généré ou corps d'erreur fournisseur. Les essais ne réarment ni
  n'incrémentent le coupe-circuit quotidien.
- `.github/workflows/journal-quotidien.yml` : booléen `essai_modeles`, désarmé
  par défaut ; quatre nouvelles variables et `JOURNAL_COUT_MAX_USD` existante
  transmises par `vars.*`. La spec parle de cinq variables mais ne nomme que
  quatre nouveautés : aucune cinquième variable de configuration n'a été inventée.
  Watchdog exclu des essais, artefact conservé même après échec. Cron et armement
  de publication inchangés ; aucun changement de `.github/workflows/ci.yml`.
- `tests/journal-machine-budget.test.mjs` : 60 nouveaux cas sans réseau réel.
- `tests/journal-machine-stable.test.mjs` : anciennes attentes adaptées uniquement
  aux contrats modifiés (raisonnement et seuils).
- `tests/journal-machine-github.test.mjs` : attente watchdog adaptée à l'exception
  essai. Aucun test extérieur à la machine modifié.
- `AI_CONTEXT.md` et ce rapport : état et preuves de reprise.

Portes éditoriales, consignes de rédaction, séparation des rôles, trois échelons,
réserve et plafond de production de 0,80 USD restent inchangés. Aucun article,
sujet, certificat, contenu public ou dépendance livré n'a été modifié.

## Budget de l'essai et revue adverse

Le plafond de l'essai est fixe à 0,10 USD, indépendant du budget de production.
Avant chaque appel, la réserve prend le maximum entre le coût observé le plus
élevé et la borne tarifaire du modèle : 4 096 jetons d'entrée, 3 000 de sortie,
plus le prix par requête. Les 4 096 jetons sont une réserve conservatrice pour
la demande fixe de moins de 200 octets et son enveloppe fournisseur. Les prix
absents, invalides ou une réserve dépassant le solde interdisent l'appel.
`provider.max_price` impose également ces tarifs au routage : le prix de départ
du catalogue ne suffit pas à borner tous les fournisseurs. Le coût déclaré est
encore vérifié après réponse ; un dépassement ou une facturation inconnue est
un échec visible. Les appels non effectués au plafond ne sont pas inventés dans
le tableau ; le résumé signale `essai_plafond` et les mesures déjà obtenues.

La revue indépendante a découvert que la seule réserve du coût précédent pouvait
laisser passer une série de coûts 0,025 / 0,025 / 0,025 / 0,05, soit 0,125 USD.
Le correctif tarifaire ci-dessus empêche le quatrième appel ; un premier appel
borné à 0,11 USD est aussi refusé. Ces deux cas ont été ajoutés aux tests.
Recontrôle indépendant : défaut levé, aucun autre défaut confirmé. Les contrôles
complémentaires suggérés (compatibilité du catalogue et conversion des trois
plafonds non nuls) ont été intégrés à la suite permanente.

## Vérifications

Exécution locale avec Node v26.12.1 ; `.nvmrc` indique 24 et le workflow quotidien utilise 22.
Installation exacte réussie : `npm ci --offline --no-audit --no-fund`.
Référence avant modification : **305/305 tests machine**.
Candidat : **365 tests machine**, dont **60 nouveaux**. Couverture : matrice
complète de 20 appels pour quatre modèles distincts, déduplication du repli
commun, refus 400/422, coût constant/variable et inconnu, réserve du premier
appel, tarifs et unités, zéro mutation métier, erreurs de configuration avant
paiement, configuration par rôle/échelon, jetons visibles et alertes, crashs,
confidentialité des diagnostics, workflow et coupe-circuit.

| Vérification | Passage 1 | Passage 2 |
| --- | --- | --- |
| `npm run lint` | OK | OK |
| `npm run qa:claims:rev01` | OK | OK |
| `npm run build -- --webpack` | OK, 96 pages | OK, 96 pages |
| `npm run test:brand-os` | 19/19 | 19/19 |
| `npm test` | 735/735 | 735/735 |
| `npm run qa:brand:rev01` | OK | OK |

`node scripts/journal-machine.mjs --dry-run --fixtures` : succès, issue `pr`
simulée, coût fictif 0,061 USD, fichiers uniquement dans un répertoire temporaire.
`git diff --check` : aucune erreur.
Journaux locaux : `/private/tmp/journal-budget-{baseline,targeted-final,newtests}.log`,
`/private/tmp/journal-budget-pass1-*.log`, `/private/tmp/journal-budget-pass2-*.log`,
`/private/tmp/journal-budget-dryrun.log`.

## Limites et preuve à acquérir

- `npm run build` standard a été tenté : Turbopack est resté sur
  « Creating an optimized production build » sans progression et a été interrompu
  (code 130). Aucun script npm modifié pour masquer cette limite ; les deux
  validations de compilation utilisent explicitement Webpack.
- Démarrage du serveur : `listen EPERM` sur `0.0.0.0:3210`.
- `npm run qa:network:rev01 -- --max-failures=1` : Chromium refusé avant navigation
  (`MachPortRendezvousServer`, permission denied, `SIGTRAP`). Bilan : un échec
  de lancement, quatre cas interrompus, 611 non exécutés. Aucun seuil, assertion
  ou blocage réseau assoupli. Journaux `journal-budget-server.log` et
  `journal-budget-browser.log` sous `/private/tmp`.

La batterie navigateur n'est donc pas verte ; la commande Turbopack standard
n'est pas validée. Aucun résultat de navigateur ou de production n'est déduit
des tests Node ou du build Webpack.

PRODUCTION_PROOF attendue après fusion, conformément au §4 de la spec : Claude
lance un seul essai (0,10 USD), lit la matrice, puis au plus un passage réel
(0,80 USD), avec une PR d'article à comparer à une chronique de référence.
Tout changement de variables après cette observation suit l'accord de Paul.
La publication automatique reste désarmée par défaut.

## Correctif 1

Appliqué le 13/11/2026 selon la dernière section de la spec locale et le mandat
explicite de Paul. Cette section remplace les descriptions antérieures des
incidents d'essai, de leur ordre et de la priorité des jetons visibles.
Référence : worktree demandé, branche
`codex/docs-CODEX-SPEC-2026-11-13-journal-budget-raisonne`, HEAD `e707430` ; les
modifications déjà présentes à l'arrivée ont été conservées.

TARGET_SYSTEM : dépôt local. ENVIRONMENT : worktree de handoff.
WRITE_SCOPE : `scripts/journal-machine-trial.mjs`,
`scripts/journal-machine-trace.mjs`, `tests/journal-machine-budget.test.mjs`
et ce rapport uniquement. REVERSIBLE : oui. ROLLBACK : restaurer les quatre
copies de départ sous `/private/tmp/journal-budget-correctif1/`.
BACKUP : copies et manifeste SHA256 avant intervention (`before.json`).
EXPECTED_ROWS : aucune donnée distante.

- **A — incidents** : 404 tracé `http_404` à coût nul ; délai, 429, 5xx et
  coupure réseau comptabilisés à hauteur de `pricing.reserve`, sans remplacer
  le `cout: null` de leur trace. Le total et
  `cout_reserves_sans_reponse` persistent dans le JSONL ; le résumé affiche
  « dont réserves comptées pour appels sans réponse ». La réserve du prochain
  appel reste contrôlée avant paiement. Une réponse 200 sans coût valide
  arrête toujours l'essai, y compris un résultat nul ou indéfini.
- **B — tarifs** : plafonds prompt/completion arrondis vers le haut à six
  décimales par million de jetons, request à neuf décimales ; réserve calculée
  depuis les plafonds arrondis. Tests des prix `0.00000055` / `0.0000022`,
  de décimales supplémentaires et du prix par requête, avec arrêt au plafond.
- **C — ordre et tableau** : réglages en boucle extérieure, modèles distincts
  en boucle intérieure ; ordre `effort_none`, `enabled_false`,
  `max_tokens_1024`, `effort_low`, `sans_parametre`. Matrice complète dans
  le résumé, avec « non essayé (plafond) » pour chaque cellule restante ;
  tableau détaillé des appels conservé. Ordre exact des quinze appels contrôlé.
- **D — contenu** : texte présent traité selon finish_reason puis JSON,
  même si le raisonnement égale ou dépasse les jetons de sortie. Contenu
  absent ou blanc et zéro jeton visible classé `vide`, même avec `length`.
  Le compteur reste une mesure ; la priorité historique de `tronquee` est
  conservée pour un contenu vide dont les jetons visibles sont positifs.

Les attentes préexistantes adaptées concernent seulement ces changements :
ordre des réglages, poursuite après incidents, contenu prioritaire et plafond
tarifaire arrondi. La réserve initialement égale à 0,05 USD dépasse désormais
légèrement ce montant après arrondi : le test correspondant attend deux
appels à 0,025 USD, au lieu de trois. Aucun test machine extérieur au fichier
budget, ni test hors machine, n'a été modifié.

Référence avant écriture : **365/365 tests machine**. Candidat : **385/385**,
soit 20 cas supplémentaires nets. Pendant l'écriture des nouveaux tests,
deux attentes ont été corrigées : comparaison exacte de flottants remplacée
par une tolérance de 1e-12 USD ; liste de la matrice limitée aux modèles de
rédaction et de juge, sans inclure celui de recherche. Aucun seuil produit
ni assertion historique hors comportement amendé n'a été assoupli.

| Vérification | Passage 1 | Passage 2 |
| --- | --- | --- |
| `npm run lint` | OK, sortie 0 | OK, sortie 0 |
| `npm test` | 755/755, sortie 0 | 755/755, sortie 0 |

Revue adverse indépendante des deux scripts effectuée en lecture seule :
aucun défaut bloquant A/B/C/D identifié. `git diff --check` réussi.
Le manifeste SHA256 vérifie que seuls les quatre fichiers autorisés ont changé
depuis le début de ce correctif. Journaux :
`/private/tmp/journal-budget-correctif1/baseline.log`, `targeted-final.log`,
`pass1-lint.log`, `pass1-test.log`, `pass2-lint.log`, `pass2-test.log`.

Aucun appel réseau réel ; incidents, catalogue, coûts et réponses simulés,
avec blocage réseau dans les tests machine. Aucun Playwright ni build lancé,
conformément au mandat : ces vérifications seront rejouées par Paul sur l'hôte.
Aucun commit, push, secret consulté, armement ou publication.
PRODUCTION_PROOF : non acquise ici ; l'essai réel prévu au §4 reste à exécuter
après fusion. Les tests prouvent la logique locale, pas le comportement d'un
fournisseur réel.
