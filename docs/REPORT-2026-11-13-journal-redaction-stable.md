# Journal : rédaction stable — compte rendu du 13/11/2026

État actuel : voir la section finale « Correctif 1 », qui prime sur les décisions
et résultats du premier tour conservés ci-dessous.

Implémentation initiale de `docs/CODEX-SPEC-2026-11-12-journal-redaction-reponse-vide.md`.
Référence de travail demandée : dépôt courant, HEAD
`c2e7adad9c89e4b685a547d3ff0c649b2e5f4fc6`.

## Périmètre et conservation

AGENTS.md, le contexte actuel du Journal dans AI_CONTEXT.md, la spec et le
harnais canonique ont été lus avant modification. Le lancement et le plan sont
ceux validés par Paul dans la spec : six mécanismes, implémentation puis un tour
correctif avec revue indépendante. Aucun appel LLM réel ni coût fournisseur.

Cible : fichiers locaux du worktree ; environnement de développement ; aucune
écriture de données en production. Changements réversibles par fichier, référence
Git disponible, sans commit, push ni déploiement. Le seul fichier préexistant
non suivi était la spec, conservée à l'identique :
`2155d15e0a24e1f57f0e3d9db8dbe482882a1fc20f621084db2ef2048c4893ad` (SHA256).

Aucune dépendance ajoutée ; package.json et verrou npm inchangés. Les portes
éditoriales, WRITING_SYSTEM, formatPrompt, EDITING_PROMPT, les articles, la
fusion automatique, JOURNAL_AUTOPUBLISH, le périmètre des fichiers publiables
et ci.yml sont inchangés. Les tests hors machine sont inchangés.

## Fichiers et comportement

| Fichier | Modification |
| --- | --- |
| `scripts/journal-machine.mjs` | Instrumentation de chaque tentative OpenRouter, reprises bornées, réserve de coût, choix des modèles, coupe-circuit après restauration, résumé et sauvegarde crash. |
| `scripts/journal-machine-trace.mjs` | Nouveau module : classification des réponses, traces sans texte, projection du journal, historique technique et tableau Markdown. |
| `scripts/journal-machine-github.mjs` | Accepte `coupe_circuit` dans l'état distant ; réutilise et actualise l'issue dédiée par `issueOnce`. |
| `.github/workflows/journal-quotidien.yml` | Transmet les deux variables de repli depuis `vars.*`. |
| `tests/journal-machine-stable.test.mjs` | 43 nouveaux tests sans réseau réel. |
| `tests/journal-machine.test.mjs` | Assertions machine alignées sur les nouveaux contrats de confidentialité, JSON et budget préventif. |
| `AI_CONTEXT.md` | État courant et renvoi vers ce rapport. |

Les trois échelons concernent rédaction, secrétariat et juge : appel normal,
même modèle avec `reasoning: { effort: "low" }`, puis modèle de repli sans ce
paramètre. `length` est prioritaire sur le contenu vide ; aucune sortie tronquée
n'est transmise au secrétariat ou aux portes. Un JSON syntaxiquement invalide
est repris ; une décision éditoriale défavorable reste une décision des portes,
sans nouvelle réécriture. La préparation de recherche conserve sa reconstruction
tolérante et son repli ciblé `include_domains`.

Les reprises délai/429/5xx existantes restent limitées à une après cinq secondes
par échelon. Chaque tentative a sa propre trace et durée, y compris les erreurs
HTTP, les refus 400/422 à l'échelon 2 et les appels annulés lors d'un crash.
Les coûts inconnus restent `null`. `http_000` désigne une erreur de transport ou
une annulation sans réponse HTTP ; ce n'est pas un statut renvoyé par OpenRouter.

Le coût connu maximal d'un appel dans le run constitue la réserve minimale avant
chaque nouvel appel, y compris les reprises réseau et de préparation. Le garde
après facturation reste actif et le plafond reste 0,80 USD. Cette réserve est
une estimation fondée sur les appels précédents, pas une garantie sur un prix
futur inconnu ou une facturation non renvoyée par le fournisseur.

Les modèles de repli par défaut sont `deepseek/deepseek-v4-pro`, configurables
par `JOURNAL_MODELE_REDACTION_REPLI` et `JOURNAL_MODELE_JUGE_REPLI`. Le catalogue
est consulté à l'exécution. Le juge exclut les modèles ayant produit le brouillon
**et** la réécriture finale. Si aucun choix distinct ne répond, le sujet échoue
sans article. `modeles_effectifs` indique le dernier modèle réellement appelé
pour chaque étape du sujet courant ; `appels` conserve toutes les tentatives,
avec leur sujet, leur échelon et leur modèle.

Le coupe-circuit intervient après restauration de l'état et avant même le
catalogue. Il ne concerne que `GITHUB_ACTIONS=true` et
`GITHUB_EVENT_NAME=schedule`. Les simulations ne comptent pas ; les exécutions
manuelles et locales passent. Un succès ou une absence de travail remet la
séquence à zéro. Les entrées `coupe_circuit` sont ignorées dans le comptage :
un cron sauté ne peut pas réarmer le suivant. L'issue dédiée contient les trois
motifs et tableaux ; elle est réutilisée au lieu de créer des doublons. Aucun
appel à l'alerte générale n'est ajouté sur ce chemin. L'issue `coupe_circuit`
termine avec le code logique 0 lorsque sa sauvegarde et son alerte réussissent.

## Confidentialité et anciens contrats

La spec nouvelle interdit les textes de requête et de réponse dans JSONL et
GITHUB_STEP_SUMMARY. Elle contredit certaines assertions plus anciennes de la
machine : réponses `preparation_brute`/`preparation_relance_brute`, requêtes de
recherche, titre retenu et citations du juge dans les portes.

La recherche et les portes conservent leur matériau en mémoire. La projection
persistée retire ces textes, les titres/éditeurs issus du modèle et les détails
de porte pouvant citer l'article. Elle garde états, compteurs, dates, méthodes,
noms des portes et diagnostics techniques contrôlés. Les anciens logs ne sont
pas réécrits ; leurs tableaux sont projetés avant réutilisation dans l'issue.
Le texte arbitraire d'un crash devient `erreur_technique`, avec étape, sujet,
coût et traces disponibles. Le résumé est ajouté aussi sur le chemin de crash.

Les tests historiques concernés ont donc été adaptés explicitement, plutôt que
de préserver des attentes incompatibles :

- préparation tolérante : mêmes requêtes transmises et mêmes indicateurs,
  assertions de non-persistance des textes à la place de leur copie ;
- coût : arrêt à 0,45 USD avant un second appel de 0,45, et à 0,021 avant un appel
  qui dépasserait un budget de 0,025 ;
- deux passes : brouillon JSON valide, températures inchangées ; le cas JSON
  invalide est désormais couvert séparément par l'échelle de reprise ;
- titre retenu : conservé pour le traitement, absent des diagnostics persistés.

Les tests unitaires des précédents correctifs recherche, dates et délais sont
restés inchangés. Aucun seuil éditorial ni test hors machine n'a été assoupli.

## Preuves et exécution

Référence avant modification : installation `npm ci --silent` réussie, puis
**217/217 tests machine**. Le tout premier essai sans dépendances était bloqué
par `gray-matter` absent. La suite complète de référence lancée avant build
avait **543/552** succès : neuf échecs dus aux artefacts `.next` absents ; ils
ont disparu après build, sans modification de leurs tests.

Les **43 nouveaux tests** couvrent les dix cas de la spec et leurs variantes :
les trois étapes de l'échelle, contenus absents/null/espaces, troncature avec
texte, JSON invalide, deux sujets sans fichiers résiduels, refus 400/422,
reprises délai/429/503, juge distinct des deux rédacteurs, catalogue sans juge
disponible, cron/manuel/local, succès et simulations dans l'historique, état
distant, issue unique, traces exhaustives, absence de marqueurs privés,
alertes de coût, réserve du plus cher appel et sauvegarde d'un appel suspendu.
Les tests bloquent fetch, HTTP, HTTPS et les sockets réels ; les clients et
sources sont injectés.

Deux batteries complètes consécutives sur le candidat final :

```sh
npm ci --silent && npm run lint && npm run build -- --webpack && npm test
```

| Vérification | Passage 1 | Passage 2 |
| --- | --- | --- |
| Installation exacte npm | Succès | Succès |
| ESLint | Succès | Succès |
| Build Next 16.3.4 Webpack, TypeScript et 53 pages statiques | Succès | Succès |
| Tests Node, certificats inclus | **595/595**, aucun ignoré | **595/595**, aucun ignoré |

La machine passe de **217 à 260 tests**, dont **43 nouveaux**. Les deux batteries
finales ont terminé en code 0. Traces locales :
`/tmp/journal-battery-final-1.log` et `/tmp/journal-battery-final-2.log`.

Contrôles supplémentaires réussis : `qa:brand:rev01`, `qa:claims:rev01`,
`git diff --check`, identité exacte des trois prompts éditoriaux avec HEAD,
empreinte inchangée de la spec. Le dry-run `--dry-run --fixtures` termine en
code 0 avec `issue: pr`, `simulation: true`, sept appels simulés tracés et
0,061 USD de coût fictif. Il ne crée aucune PR réelle. Les 19 tests Brand OS
font partie de la suite complète.

Avertissements non bloquants existants : `MODULE_TYPELESS_PACKAGE_JSON` et
`metadataBase` non défini. Environnement local : Node 26.12.1 ; le workflow
reste sur Node 22. Aucun blocage local restant. Pas de contrôle navigateur
ajouté : aucun rendu, composant public ni style n'est modifié.

Revue adverse indépendante : deux défauts constatés puis corrigés dans le tour
correctif (trace en cours perdue au crash ; texte arbitraire admis comme motif).
Les reproductions exactes passent, dont le client qui ne résout jamais.
La revue finale n'a identifié aucun défaut concret restant.

## Documentation et limites

Documentation OpenRouter consultée via Context7 et directement en ligne le
13/11/2026 : [Reasoning Tokens](https://openrouter.ai/docs/guides/best-practices/reasoning-tokens).
`effort: "low"` contrôle le budget de raisonnement ; `exclude` masque seulement
sa restitution et ne constitue pas une réduction. Le choix est donc `low`.

Aucun appel OpenRouter authentifié n'a été effectué. L'acceptation effective du
paramètre et son effet sur `z-ai/glm-5.2`, les tarifs réellement facturés et la
cause précise du run 43318896226 restent **non vérifiés en production**.
Les tests montrent le comportement de la machine pour les réponses simulées,
pas l'hypothèse fournisseur. La preuve finale reste le seul workflow_dispatch
prévu pour Claude après fusion, avec PR ou diagnostic détaillé par appel.
Aucune issue GitHub, PR, fusion, publication ou modification de variable réelle
n'a été effectuée pendant cette intervention.

## Correctif 1 — version canonique du 13/11/2026

Cette section prime sur le compte rendu du premier tour ci-dessus, notamment
sur « Confidentialité et anciens contrats ». Seuls les cinq points du
Correctif 1 ont été exécutés sur le premier tour déjà présent et non commité.
La spec faisant foi a été lue **en entier** à son chemin absolu :
`/Users/paullarmaraud/parrit-site/docs/CODEX-SPEC-2026-11-12-journal-redaction-reponse-vide.md`.
SHA256 : `0daf8625ad188a426358a2503cb105e8a4f393c7d9c49f9a09bfc63230b7d80d`.
La copie plus ancienne du worktree reste inchangée (SHA256
`2155d15e0a24e1f57f0e3d9db8dbe482882a1fc20f621084db2ef2048c4893ad`).
`HEAD` et la référence locale `origin/main` valent tous deux
`c2e7adad9c89e4b685a547d3ff0c649b2e5f4fc6` ; aucun fetch ni changement de référence.

### Périmètre, référence et réversibilité

Cible : scripts machine, tests machine et documentation dans ce worktree local.
Aucune écriture externe ni donnée de production ; zéro ligne métier attendue.
Sauvegarde des cinq fichiers concernés du premier tour dans
`/tmp/journal-c1-backup/`, permettant de revenir à l'état initial sans perdre
le travail préexistant. Un correctif borné, revue adverse indépendante puis
validation. Aucun secret lu/modifié, aucune clé utilisée, aucun appel OpenRouter
réel, aucun commit, push, déploiement ou changement d'armement.

Référence avant modification : `node --test tests/journal-machine*.test.mjs`,
**260/260**, code 0 (`/tmp/journal-c1-baseline.log`). Les faits techniques sont
établis par les sources locales : spec canonique datée du 13/11, diff de
`origin/main` et tests exécutés pendant ce correctif. Aucune API fournisseur
n'est ajoutée ou modifiée ; aucune incertitude de signature OpenRouter n'a
nécessité de consultation supplémentaire. La documentation citée plus haut
appartient au premier tour, pas à une vérification fournisseur réelle ici.

### Les cinq changements

1. **Diagnostics restaurés.** `runRecord` conserve désormais les motifs complets,
   les portes et leurs explications, les tentatives, requêtes, préparations
   brutes et relances, la thèse retenue, les sources acceptées/écartées avec
   leurs URL, titres, éditeurs et détails, ainsi que le diagnostic de recherche
   interrompue. Leur structure historique n'est plus projetée ni amputée.
   Seuls `appels` et les identifiants de modèles passent par la projection
   contrôlée. Le résumé et le corps de l'issue utilisent toujours
   `diagnosticReason` et les appels filtrés. Tests : égalité des diagnostics
   persistés, projection exhaustive de champs historiques, marqueurs absents
   des appels, du résumé et de l'issue effectivement produite par le cron simulé.
2. **Repli après panne.** Après les deux tentatives internes sur délai, 429 ou
   5xx, rédaction, secrétariat et juge passent directement de l'échelon 1 au 3.
   Aucun appel avec raisonnement réduit n'est consommé sur ce chemin. Les 4xx
   autres que 429 échouent sans repli, sauf refus de paramètre à l'échelon 2.
   Tests : délai/429/503 sur chacune des trois étapes, ordre des traces
   `[1/1, 1/2, 3/1]`, modèle effectif et attente unique de 5 secondes simulée ;
   400/401/403/422 sans repli. La réserve reste contrôlée sur chaque appel de
   l'échelle, y compris ses reprises internes.
3. **JSON partagé et tolérant.** `parseResponseObject` est utilisée par
   `responseIssue`, `editions` et `validateJudge`. Elle retire les clôtures,
   extrait le premier objet jusqu'à son accolade fermante correspondante
   (en respectant objets imbriqués, chaînes et échappements), puis fait
   `JSON.parse`. Le texte terminal ne consomme pas d'échelon ; le JSON réellement
   invalide reste refusé. Tests : clôtures et texte terminal pour les trois
   étapes, accolades/échappements, JSON incomplet ou invalide, trois échelons
   illisibles sans article. Le test historique avec tiret cadratin repasse
   dans sa forme d'origine.
4. **Catalogue contrôlé avant paiement.** Recherche absente : arrêt de
   configuration ; rédaction ou juge : au moins un de leurs modèles doit être
   présent. Le repli rédaction disponible remplace immédiatement le principal
   absent, avec échelon 3 et modèle effectif tracés. Les quatre combinaisons
   principal/repli sont testées séparément pour rédaction et juge, ainsi que
   l'absence du modèle de recherche. Aucun appel payant n'a lieu en cas de
   configuration invalide. `juge_identique_au_redacteur` est réservé à l'absence
   de juge disponible distinct des auteurs. Une panne du juge distinct garde
   son vrai motif, même si l'autre modèle a rédigé. La revue adverse a reproduit
   puis fait corriger ce dernier cas ; régressions HTTP 400/503, réponse vide
   et repli absent couvertes.
5. **Crashs comptés.** `technicalFailure` compte aussi `issue: crash`.
   Trois crashs, ou échec/crash/échec, coupent le cron avant catalogue et appel
   payant : coût nul, une issue, code 0. Simulations, réarmement manuel et
   succès conservent leurs contrôles existants.

### Assertions historiques : état exact

**Toutes les assertions de `tests/journal-machine.test.mjs` sont rétablies à
l'identique de `origin/main` ; aucune ne reste modifiée.** Comparaison binaire
réussie et diff vide. Cela rétablit notamment :

- `preparation_brute`, `preparation_relance_brute`, les requêtes exactes et les
  indicateurs de reconstruction des préparations tolérantes ;
- la préparation brute conservée lors d'un arrêt pour coût ;
- le tiret cadratin ajouté au brouillon puis transmis au secrétariat,
  les deux températures et la thèse retenue persistée ;
- les assertions de coût historiques : seconde préparation à 0,45 USD donnant
  0,90 USD et arrêt après facturation, puis budget de test 0,025 USD arrêté à
  0,031 USD après quatre appels de recherche.

Pour ces deux derniers cas, le premier tour avait étendu la réserve du plus
cher appel à la recherche. Le §2.2 définit cette nouvelle échelle pour
rédaction/secrétariat/juge ; le Correctif 1 conserve le comportement de la
recherche et exige le rétablissement des assertions historiques. La réserve
préventive est donc limitée aux trois étapes de l'échelle. La recherche garde
ses contrôles historiques avant et après coût facturé. Le plafond configuré
reste 0,80 USD, sans assouplissement des portes ; les tests de réserve empêchant
un nouvel échelon coûteux restent verts. Comme auparavant, un coût fournisseur
inconnu avant réponse peut dépasser le plafond : l'arrêt intervient alors
après comptabilisation, sans publication.

Dans le fichier **nouveau au premier tour** `journal-machine-stable.test.mjs`,
les seules attentes remplacées concernent les contrats explicitement amendés :
interdiction de texte limitée à appels/résumé/issue, motifs historiques autorisés
dans JSONL, et vrai motif du juge distinct qui échoue. Ces changements relèvent
des points 1 et 4. Les nouveaux cas complètent les anciens ; aucun test hors
machine, seuil éditorial ou prompt de rédaction n'a été changé.

### Validation finale du correctif

Candidat ciblé : **305/305 tests machine**, code 0, soit **45 cas ajoutés** depuis
la référence 260 ; aucun échec, ignoré ou annulé (`/tmp/journal-c1-targeted.log`).
La revue adverse indépendante a terminé sans autre défaut concret après le
correctif de classification du juge. Les trois prompts éditoriaux sont
identiques à `origin/main`, vérification automatique réussie.

Les batteries ci-dessous suivent les trois commandes explicitement demandées
pour ce correctif ; `npm ci` n'a pas été relancé. Chaque commande possède son
journal distinct sous `/tmp/journal-c1-pass{1,2}-{lint,build,test}.log`.

| Commande | Passage 1 | Passage 2 |
| --- | --- | --- |
| `npm run lint` | Succès, code 0 | Succès, code 0 |
| `npm run build -- --webpack` | Succès, code 0 ; 53/53 pages | Succès, code 0 ; 53/53 pages |
| `npm test` | **640/640**, code 0 | **640/640**, code 0 |

Les six commandes ont été exécutées dans l'ordre lint → build → tests,
puis lint → build → tests, sur le même code candidat. Aucun test ignoré,
annulé ou en échec. Les deux builds valident aussi TypeScript et le prebuild
(certificats et génération llms). Avertissements préexistants seulement :
`MODULE_TYPELESS_PACKAGE_JSON` et `metadataBase` absent. `git diff --check`
réussit ; les empreintes des deux specs restent inchangées. Aucun test hors
machine n'est modifié ; le fichier historique est identique octet pour octet.

Aucune preuve de production : l'effet réel de `reasoning` sur GLM, les coûts
fournisseur, l'accès réel aux modèles et la publication restent non vérifiés.
Les tests utilisent uniquement clients et sources simulés, avec blocage du
réseau. Le passage réel après fusion reste hors du périmètre Codex.
