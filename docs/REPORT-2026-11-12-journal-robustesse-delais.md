# Journal — robustesse des délais, 12/11/2026

Implémentation de `docs/CODEX-SPEC-2026-11-12-journal-robustesse-delais.md`
sur le checkout demandé, base `8785098e452d963d5ff76c1ae00493cea76dd1c4`.

Les deux batteries finales consécutives sont vertes : installation exacte,
lint, build Webpack et **549/549 tests**, sans échec, annulation ni test ignoré.
Aucun commit, push, déploiement, appel LLM réel ou écriture distante effectué.

## Diagnostic établi dans le code

L'ancien `withinDeadline(promise, signal)` pouvait appeler `throwIfAborted()`
avant d'observer une promesse déjà créée par `reader.read()`, `fetchImpl()` ou
`resolve()`. Le catch extérieur récupérait l'exception immédiate, mais la
promesse pouvait rejeter sans gestionnaire. La revue indépendante a reproduit
cette fenêtre sans réseau : exception récupérée et un rejet non traité.
Ce constat établit une cause possible dans les octets de la base locale ;
l'attribution exacte du run de production 43313590199 n'a pas été rejouée.

Le cache de `Response.clone()` conservait également un flux et le signal de la
requête initiale pour les portes suivantes. Il est remplacé par un cache en
mémoire du résultat intégralement lu : texte, date extraite et URL finale.

## Fichiers et comportements

| Fichier | Modification |
| --- | --- |
| `scripts/journal-machine-io.mjs` | Nouveau helper de délai : opération différée jusqu'au contrôle du signal, rejets tardifs observés, classification bornée des erreurs. |
| `scripts/journal-machine-gates.mjs` | DNS, en-têtes, corps et commandes PDF protégés ; maximum 5 000 000 octets ; nettoyage des flux et fichiers temporaires ; cache de résultats consommés. |
| `scripts/journal-machine-research.mjs` | Lots de quatre attendus par Promise.allSettled ; motifs delai_depasse, trop_lourde, reseau_<code> ; statuts HTTP et refus de domaine conservés. Expurgation réutilisable pour les messages de crash. |
| `scripts/journal-machine.mjs` | Délais OpenRouter de 90/180/60 secondes, une seule relance après 5 secondes sur délai/429/5xx ; motif par étape après échec ; contexte étape/sujet ; filet CLI et unhandledRejection, sauvegarde de secours et sortie 1. |
| `scripts/journal-machine-github.mjs` | Reprise des lignes issue: crash ; signal d'arrêt vérifié avant les écritures de publication ; sauvegarde sur journal/etat indépendante de ce signal. |
| `tests/journal-machine-delais.test.mjs` | Nouvelle suite de régressions transport, PDF, taille, cache, OpenRouter et crash. |
| `tests/journal-machine.test.mjs` | Intégrations : sujet suivant après deux délais, exception dans le vrai run, arrêt avant publication et secours après échec de sauvegarde. |
| `tests/journal-machine-github.test.mjs` | Reprise distante d'un crash et interruption des écritures de publication avec sauvegarde d'état encore possible. |
| `tests/journal-machine-dates.test.mjs` | Test de délai stabilisé par signal déclenché explicitement, au lieu d'une fenêtre réelle de 10 ms. Contrôle du délai de 15 secondes, annulation du corps et rejet conservés ; nettoyage borné à une seconde contrôlé aussi. |
| `docs/journal-robustesse-delais/plan.md`, `AI_CONTEXT.md` | Plan d'exécution et contexte de reprise. |

Les portes éditoriales, seuils, gabarit, modèles, budget et deux sujets maximum
restent inchangés. Les retries sont techniques et n'ajoutent aucune passe
éditoriale. Aucun article, manifeste de traduction, état de production, workflow,
test hors machine ou fichier de dépendances n'a été modifié.

Le filet global conserve un diagnostic de 300 caractères maximum sans secret,
l'étape et le sujet courants. Il arrête le travail actif, nettoie le candidat
local et sauvegarde l'état sans publication. Une restauration échouée ne permet
jamais d'écraser l'état distant. Un échec du secours est signalé sans récursion.
Une écriture distante déjà partie au moment d'un crash reste de résultat
potentiellement incertain ; les écritures suivantes sont bloquées.

## Tests et exécution

Référence avant modification : **187/187 tests machine**. Les dépendances étaient
initialement absentes ; npm ci --silent a permis cette référence exacte.
Candidat : **217/217**, soit **30 tests ajoutés**, plus le test chronométrique
stabilisé. Les tests bloquent les transports réseau réels.

Cas couverts : corps expiré et connexion coupée, lots suivants traités, taille
annoncée ou détectée pendant le flux, échec/timeout de pdftotext, nettoyage du
PDF, absence de clone réseau, délai déjà expiré et rejet tardif, corps JSON
OpenRouter expiré puis succès, deux délais, 429/5xx et absence de retry sur 400/401,
délais par rôle, sujet suivant réussi avec runtime simulé, crash expurgé,
sauvegarde unique, restauration échouée, secours lui-même en échec, reprise des
logs et arrêt de publication. Un sous-processus Node provoque un **vrai
unhandledRejection** et vérifie log, sauvegarde simulée et sortie 1.

| Vérification | Résultat |
| --- | --- |
| Batterie finale 1 : npm ci --silent && npm run lint && npm run build -- --webpack && npm test | Code 0 ; 549/549 tests, zéro échec/annulation/ignoré. |
| Même batterie finale 2, immédiatement après | Code 0 ; 549/549 tests, zéro échec/annulation/ignoré. |
| npm run qa:brand:rev01 | Réussi. |
| npm run qa:claims:rev01 | Réussi. |
| node scripts/journal-machine.mjs --dry-run --fixtures | Code 0 ; issue: pr, simulation: true, fichiers dans un répertoire temporaire. |
| git diff --check | Réussi. |
| Revue adverse indépendante | Deux défauts corrigés (publication après arrêt et motif masqué par le nettoyage) ; aucun défaut bloquant identifié à la revue finale. |

Une première tentative de batterie s'était arrêtée au lint sur le nom de variable
module du nouveau test de sous-processus ; renommée moduleUrl avant les deux
batteries vertes. Aucun échec de test n'a été ignoré. Avertissements préexistants
MODULE_TYPELESS_PACKAGE_JSON et metadataBase toujours présents, non bloquants.
Exécution locale : Node 26.12.1, Next 16.3.4 installé depuis le lockfile.

Logs locaux : `/tmp/journal-delais-baseline.log`,
`/tmp/journal-delais-integrated.log`, `/tmp/journal-delais-battery-1.log`,
`/tmp/journal-delais-battery-2.log`, `/tmp/journal-delais-dry-run.log`.

## Préservation et limites

Seul changement préexistant : spec non suivie, conservée octet pour octet.
SHA256 avant/après :
`f0d6a49a3ce55e773366e661181a701703c7934b7c1aea9f6ea593f0d3d66880`.
Le prebuild a régénéré llms.txt sans diff.

Aucun blocage local restant. Les garanties réseau/GitHub sont prouvées par
injection et simulations, pas par une exécution réelle du workflow. La preuve
production attendue après livraison est un run survivant à une source lente,
ou un diagnostic de crash effectivement relu depuis journal/etat. Aucune
vérification navigateur nécessaire à ce correctif de scripts n'a été ajoutée.
