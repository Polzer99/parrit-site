# Machine à articles quotidienne : compte rendu du 12/11/2026

**Mise à jour : la section « Correctif 1 » en fin de rapport prime sur le format, les coûts et les limites d’environnement du compte rendu initial ci-dessous.**

Implémentation livrée désarmée. Aucune publication, PR, issue, fusion, dépense OpenRouter, modification de configuration distante, commit, push ou déploiement exécuté pendant cette session. La validation complète reste bloquée par l'environnement et les échecs historiques décrits ci-dessous : la machine ne doit pas être annoncée opérationnelle en production.

## Référence et préservation

- Dépôt demandé, HEAD `d7da52bf03b5c51527f5a57b244fd1c353d7a24b`; aucune synchronisation ou écriture Git.
- Seul changement initial : spec non suivie. Son SHA256 reste `eef7dc632ce5a4d03778ee895f2b83b7b50ca805d515132ab6bdc678fd023f03`.
- Tous les articles historiques FR/EN, les tests existants, `ci.yml`, `hermes-weekly.yml`, le verrou npm, `public/llms.txt` et les PNG sous `.codex-handoffs/` sont inchangés.
- Aucune dépendance ajoutée. Les tableaux utilisent un dialecte Markdown limité, partagé entre contrôle et rendu.

## Fichiers livrés

| Fichiers | Changement |
|---|---|
| `content/plan/sujets.json` | Les 36 sujets dans l'ordre prescrit, identifiants stables, piliers/offres, un angle local, états initiaux. |
| `content/plan/journal-runs.jsonl` | Journal versionné, initialement vide. |
| `content/plan/journal-translations.json` | Registre additionnel des nouvelles éditions, initialement vide. |
| `scripts/journal-sujets.mjs` | Ajout manuel, validation des champs et refus des doublons. |
| `scripts/journal-machine.mjs` | Recherche unique par sujet, annotations conservées dans les runs, rédaction FR/adaptation EN, modèles configurables contrôlés dans le catalogue, budget cumulatif, réécriture ciblée, report/écartement, dry-run isolé. |
| `scripts/journal-machine-gates.mjs` | Portes réutilisées et nouveaux contrôles : structure, voix, chiffres, sources, liens, interdits, adaptation. |
| `scripts/publish-journal.mjs` | Extraction importable des pièges MDX et garde d'entrée CLI; comportement local de publication conservé. |
| `scripts/false-claims-check.mjs` | Contrôle pur importable et garde d'entrée CLI; audit global conservé. |
| `scripts/journal-machine-verify.mjs` | Contrôles bloquants, corpus historique isolé et validation du candidat complet. |
| `scripts/journal-machine-github.mjs` | PR, fusion limitée au contenu, sauvegarde d'état, reprise, preuve de publication, IndexNow et alertes dédupliquées. |
| `.github/workflows/journal-quotidien.yml` | Cron `15 5 * * *`, déclenchement manuel, Node 22, permissions minimales, concurrence sans annulation, watchdog `always()` et diagnostic en artifact. |
| `src/system/journal-data.ts`, `journal-translations.ts`, `jsonld.ts` | Champs optionnels, traduction des nouveaux slugs, FAQPage, auteur et dateModified. |
| `src/app/(rev01)/journal/[slug]/page.tsx`, `src/app/sitemap.ts` | FAQ visible, sources, auteur, updatedAt et sitemap bilingue. |
| `src/system/journal-markdown.ts`, `src/system/components/JournalMachineBody.tsx`, `src/app/(rev01)/rev01.css` | Tableaux simples rendus sans HTML brut, styles limités aux nouvelles tables. |
| `src/lib/attribution.ts`, `src/lib/registry/cta.ts` | La réservation utilise son chemin bilingue fixe sans charger le registre Journal; toutes les destinations du registre sont comparées à leur comportement antérieur. |
| `AGENTS.md`, `AI_CONTEXT.md`, `docs/machine-articles-quotidienne/plan.md` | Exception d'armement demandée, architecture, limites et plan d'exécution. |
| `tests/journal-machine*.test.mjs`, `tests/fixtures/journal-machine/*` | Tests et fixtures FR/EN/OpenRouter nouveaux, sans modification des tests existants. |

## Fonctionnement et arbitrages

Le sujet reste `a_faire` lorsqu'une PR est ouverte. Les sujets des PR ouvertes ou fusionnées sont exclus des nouvelles générations. `publie` n'est écrit qu'après preuve du runtime. Les échecs incrémentent `essais`; le troisième échec d'un run pour un sujet l'écarte avec son motif. Chaque sujet reçoit au maximum deux versions; le run tente au maximum deux sujets. Un échec de build entre dans la même boucle de correction. Après une tentative de publication au résultat incertain, aucun deuxième article n'est publié dans ce run.

Le budget additionne `usage.cost` à chaque réponse, recherche web incluse côté OpenRouter. Une donnée de coût manquante, invalide ou un dépassement arrête avant publication. Aucun fallback payant silencieux. Les modèles de la spec sont des valeurs par défaut remplaçables par variables; leur présence au catalogue est vérifiée à chaque run réel.

Les domaines de sources sont limités aux institutions publiques et documentations d'éditeurs recensées dans `SOURCE_HOSTS`; l'angle local est limité à Région/Bpifrance/CCI. C'est une politique plus conservatrice que la simple préférence francophone, choisie pour rendre l'exclusion des concurrents et sites anonymes contrôlable. URL et redirections sont vérifiées, IP privées refusées, délai HTTP de quinze secondes. Les extraits originaux des annotations restent autoritaires face aux métadonnées produites par le modèle. Les nombres sont comparés après normalisation; les notations abrégées/scientifiques non prises en charge sont refusées. Cette vérification prouve la présence du nombre dans une source, pas à elle seule l'équivalence sémantique de toute affirmation.

Le registre supplémentaire sous `content/plan/` permet aux prochaines PR de contenir exclusivement les deux MDX et ce manifeste. Pas besoin de modifier du TypeScript pour chaque article. Les sources, FAQ et dates ne changent pas les rendus historiques lorsqu'elles sont absentes.

### Choix de fusion automatique

Choix retenu : lint, build Webpack, tests et contrôles de marque/claims exécutés dans le même job, sur les octets figés du candidat. `publish` réutilise la preuve seulement si ces octets et le SHA de base restent identiques. Les événements créés par `GITHUB_TOKEN` ne garantissent pas une CI automatique : la documentation actuelle indique notamment une approbation pour les workflows de PR issus de ce token. Il n'y a donc pas d'attente aveugle de `ci.yml`, ni de bypass d'une protection GitHub.

Avant fusion : diff complet, dépôt, branche, parenté, SHA de tête, arbre non tronqué et modes de fichiers contrôlés. Code, renommages, suppressions et liens symboliques refusés. Commit candidat limité aux deux éditions et au manifeste. Le token ne reçoit que `contents`, `pull-requests`, `issues` en écriture.

L'API REST ne propose pas de compare-and-swap atomique du SHA de base pendant `PUT merge`. Le runtime vérifie main à nouveau juste avant; une protection exigeant une branche à jour, sans bypass pour le token, doit être conservée sur l'hôte. Cette configuration n'a pas été consultée ni modifiée ici.

En mode désarmé, l'état vit dans `journal/etat-machine` avec une PR dédiée, pour que les essais et alertes survivent aux runs sans écrire main. En mode armé, l'état est committé sur main après relecture de sa référence. La restauration ne régresse pas les compteurs ni les statuts terminaux. Le watchdog n'a que des imports Node natifs : il peut alerter même si `npm ci` échoue. Les issues sont dédupliquées par titre et assignées à `Polzer99`.

Après fusion : au plus quinze minutes pour obtenir le titre FR dans la page 200, puis son URL exacte dans le sitemap. Les entités HTML du titre sont décodées. IndexNow vient ensuite et ne transforme pas un simple 200 en preuve d'indexation. Son échec ouvre une issue sans effacer la preuve de publication acquise.

### Tests historiques figés

`tests/journal-translations.test.mjs` impose exactement 31 éditions et un frontmatter FR égal à l'anglais hors titre/description. Ces assertions ne peuvent décrire les nouveaux articles avec FAQ traduite. Elles restent intactes : le vérificateur crée une copie temporaire du dépôt, y retire uniquement les slugs du manifeste additionnel, reconstruit ce corpus historique et y exécute `npm test`. Ensuite le vrai candidat complet reçoit lint/build/claims/marque/Brand OS et tous les nouveaux tests, dont la lecture et le rendu de chaque entrée effectivement inscrite au manifeste. Aucun seuil n'est relâché, aucune erreur n'est ignorée, aucun fichier n'est déplacé hors du vrai checkout.

## Tests ajoutés et résultats

92 nouveaux tests :

- `journal-machine-gates.test.mjs` : 30 cas, dont article valide, tirets, prix, client, fait de mission, H2, réponse directe, chiffres non sourcés, dates, unités, référence Markdown hostile, redirections/IP privées, annotations et juge strict.
- `journal-machine.test.mjs` : 18 cas : choix, deux fichiers, état/logs, une réécriture, deux sujets maximum, troisième échec, budgets/missing cost, file vide, PR en attente, build rouge puis vert, publication incertaine, modèles et transport simulé.
- `journal-machine-github.test.mjs` : 26 cas : désarmement, snapshots et réemploi du contrôle, périmètre exact du commit, base/tête déplacées, code/renommage/suppression/symlink, preuve titre+sitemap, IndexNow, état, alertes et watchdog.
- `journal-machine-rendering.test.mjs` : 16 cas : champs optionnels, manifestes invalides, FR/EN, routes, métadonnées, JSON-LD fidèle, HTML hostile et tables.
- `journal-machine-corpus.test.mjs` : 2 cas au départ, puis deux langues de chaque article ajouté au manifeste; contrôle supplémentaire de parité des destinations CTA.

Tous les nouveaux tests de transport passent par injections explicites; aucun service externe réel n'est appelé. Le dry-run a aussi été exécuté avec un préchargement interdisant `fetch`, sockets HTTP/TCP et tous les sous-processus : deux MDX, manifeste et rapport créés sous un répertoire temporaire, aucune écriture de contenu dans le dépôt.

| Vérification | Référence | Candidat final |
|---|---|---|
| `npm ci --silent` | Échec réseau | Même blocage; aucun verrou modifié |
| `npm run lint` | Réussi | Réussi |
| `npm run build -- --webpack` | Échec module Cal.com absent | Même échec |
| `npm test` | 317 réussis / 332, 15 échecs | 409 réussis / 424, mêmes 15 échecs par nom |
| Nouveaux tests et régression Journal/attribution ciblée | Sans nouveaux tests | **137/137 réussis** |
| `qa:claims:rev01`, `qa:brand:rev01` | — | Réussis |
| `test:brand-os` | Dépend du build | 16/19, trois échecs dus aux sorties `.next` absentes |
| Certificats | Réussis | Réussis |
| TypeScript | Dépendances incomplètes | Bloqué uniquement par `@calcom/embed-react` absent |
| `--dry-run --fixtures` sans réseau/sous-processus | — | Réussi, coût simulé 0,04 USD, aucun coût réel |
| Playwright Journal | — | 46 cas recensés, exécution navigateur non validée sans build |
| Préservation / `git diff --check` | Spec SHA256 capturé | Spec inchangée, pas de diff des fichiers protégés, contrôle réussi |

La comparaison des noms d'échecs complets référence/candidat est identique (15/15). Ils regroupent : assertions d'accueil/services qui attendent encore huit références après le retrait antérieur de deux logos; fixtures de logos retirés absentes; routes/robots/sitemap/RSS/Brand OS compilés indisponibles faute de build; reproduction binaire d'icône différente avec l'environnement local. Deux régressions d'import du manifeste détectées pendant le développement ont été corrigées par le découplage réservation/registre, puis la suite complète rejouée.

## Environnement et limites

`registry.npmjs.org` échoue en `ENOTFOUND`; le cache offline est incomplet (`ENOTCACHED`). Afin de vérifier du code sans modifier le verrou, les dépendances déjà disponibles dans le dépôt local voisin ont été copiées dans `node_modules` ignoré. Cette installation de dépannage n'est pas une installation conforme au verrou : Next **16.2.2** contre **16.3.4** attendu, module `@calcom/embed-react` manquant. Node local **26.12.1**, `.nvmrc` **24**, workflow demandé **22**. Les résultats locaux ne certifient donc pas la combinaison Node 22 + verrou exact.

À vérifier sur l'hôte autorisé : installation exacte, batterie complète, rendu navigateur des tableaux/FAQ, protections et permissions GitHub, disponibilité réelle des trois modèles, une génération réelle et sa qualité éditoriale. La chaîne s'arrête sur toute vérification rouge; les échecs historiques non résolus bloquent donc aussi la publication automatique. Les tests et articles historiques ont été conservés conformément au mandat.

`JOURNAL_AUTOPUBLISH` n'a pas été armé. `INDEXNOW_KEY` et son fichier public `public/<clé>.txt` n'ont pas été fournis dans le dépôt; aucune clé n'est inventée. Le runtime exige leur concordance avant ping. Le fichier doit être installé une fois par une modification explicite de configuration/publication distincte des PR automatiques de contenu. Secret OpenRouter, variables de dépôt, clé publique IndexNow, protection main et véritable déploiement n'ont pas été vérifiés à distance.

## Coût estimé par article

Calcul fondé sur les tarifs **fournis par la spec datée du 12/11**, pas sur une facturation réelle ni une vérification indépendante du tarif commercial actuel : Flash 0,09/0,18 USD par million entrée/sortie; Pro 0,89/1,78; GLM 0,07/1,40; recherche environ 0,007 USD.

| Étape, hypothèse de jetons | Coût estimé USD |
|---|---:|
| Recherche : 1 500 entrée, 1 200 sortie + web | 0,007351 |
| FR + EN : 9 200 entrée, 4 800 sortie au total | 0,016732 |
| Juge : 11 000 entrée, 200 sortie | 0,001050 |
| **Article sans réécriture** | **0,025133**, environ 0,025 |
| Une réécriture FR/EN et un nouveau juge comparables | Environ **0,043** au total |

Deux sujets avec réécriture dans ces hypothèses : environ 0,086 USD. Les tailles de sources et de réponses changent ce montant; seule la somme des `usage.cost` reçus pilote le plafond réel de 0,50 USD. Le plafond arrête après réception de la réponse qui le dépasse, avant tout appel supplémentaire/publication; ce n'est pas une réservation de crédit en amont chez OpenRouter.

## Sources techniques consultées

- Code local et spec, état du 12/11/2026; guide Next local de l'installation de dépannage (16.2.2).
- [OpenRouter : annotations web](https://github.com/openrouterteam/docs/blob/main/guides/features/plugins/web-search.mdx) et [sorties structurées](https://github.com/openrouterteam/docs/blob/main/guides/features/structured-outputs.mdx), consultés via Context7.
- [GitHub REST : pull requests et fusion SHA](https://docs.github.com/en/rest/pulls/pulls), via Context7.
- [GitHub : déclenchement par GITHUB_TOKEN](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow).
- [IndexNow : preuve de propriété et soumission](https://www.indexnow.org/documentation).

## Correctif 1 — calibre presse

### Mandat, source et conservation

Application intégrale de C1.1 à C1.6 sur le travail présent, sans recommencer le chantier. La spec locale a été remplacée par les octets de `/Users/paullarmaraud/parrit-site/docs/CODEX-SPEC-2026-11-12-machine-articles-quotidienne.md`, version amendée : SHA256 `4a6fecb9edb2fcf8d12d26018ccc61f1eba5af6dde68a5234f5c136a8f83f9e4`. Cette source et le code du worktree sont les références de cette passe, datée du 12/11/2026. Le plan existant est complété sous `docs/machine-articles-quotidienne/plan.md`.

Référence capturée avant modification : **92/92 tests machine**. Empreintes de tous les tests et articles, diff initial et journaux d'exécution conservés dans `/tmp/journal-c1-baseline/`. Comparaison finale : seuls les quatre fichiers de tests machine rédigés dans ce chantier et leurs fixtures sont modifiés ; tous les tests historiques et les articles FR/EN existants sont intacts. Aucun texte de chronique presse copié : le nouveau registre contient uniquement les seize titres prescrits. Workflow, orchestration GitHub, mode désarmé, preuve en ligne et IndexNow conservés. Aucun commit, push, PR, issue, déploiement ou appel LLM réel exécuté.

### Changements par exigence

| Exigence | Réalisation |
|---|---|
| C1.1 | Prompt rédaction + secrétariat : thèse affirmative, chapô concret, progression en constat/causes/règle/action du lundi, 4–8 faits attribués, traduction du jargon et développement des sigles, chute. Portes : titre 50–90 signes sans question ni mots interdits, chapô 300–450 avec chiffre/année/source, corps 4500–7000, 3–4 intertitres affirmatifs, paragraphe avec chiffre ou source, troisième personne, FAQ 2–4 réponses présentes dans le texte. Tableau facultatif. |
| Rendu C1.1 | Sources après le corps avec titre/éditeur/date/lien, puis signature et une ligne vers `/fr/rendez-vous?source=journal-<slug>` ou son équivalent EN, via `avecSource`. Suppression du second bloc de réservation pour ces nouveaux articles. FAQ uniquement JSON-LD. Pas de deck redondant ni signature répétée en tête. Rendu historique inchangé. |
| C1.2 | Recherche contradictoire explicitement demandée avant choix de la thèse. Sources institutionnelles, éditeurs, cabinets sur leur propre site, arXiv et presse de référence admis. Au moins trois pages acceptées portant au moins quatre faits chiffrés distincts, retrouvés dans le texte récupéré ; sinon `materiau_insuffisant`, report puis sujet suivant. Usage/marché/presse : moins de six mois ; études/documentation : moins de dix-huit mois ; lois datées sans limite. Date déclarée exigée dans le texte ou les métadonnées de publication de la page. |
| C1.3 | **Deux appels bilingues**, chacun renvoyant `{fr,en}` : rédaction GLM-5.2 à 0,5, puis secrétariat avec le même modèle à 0,2. La seconde passe est obligatoire même si le brouillon est bon. Aucune troisième passe après refus des portes, du juge ou du build. Budget par défaut **0,80 USD** ; overrides existants conservés. |
| C1.4 | `content/plan/sources-refusees.json` couvre les quatre domaines imposés, les réseaux de communiqués/contenu sponsorisé et les surfaces communautaires pouvant se cacher sous un domaine autorisé. Refus aussi sur sous-domaines et redirections. Les citations longues doivent correspondre au texte récupéré de la source attribuée à proximité, après normalisation des espaces/apostrophes, sans paraphrase ni changement de casse. Les annotations seules ne prouvent plus un nombre. Juge JSON strict à trois questions, `proves_thesis` bloquant. |
| C1.5 | `these_pressentie` facultatif, initialisé à `null` ; transmis à la recherche, révisable par l'écriture. `these_retenue` inscrit dans chaque tentative et dans le run. Sujets 23 et 33 initialement `ecarte`, motif `couvert_par_chronique_presse`. Jaccard ≥0,4 contre les seize titres : ajout CLI, sélection de file et titre produit ; recoupement final = écart immédiat. CLI accepte aussi `--these` et `--titre`. |
| C1.6 | Fixtures FR/EN au nouveau gabarit, données de sources explicitement synthétiques. Cas de refus demandés plus fraîcheur aux bornes, matériau insuffisant, attribution erronée, normalisation des citations, ancienne sortie du juge, deux passes strictes, coût, thèse et exclusions. |

Les fichiers principalement modifiés par ce correctif sont `scripts/journal-machine.mjs`, `scripts/journal-machine-gates.mjs`, `scripts/journal-sujets.mjs`, `content/plan/sujets.json`, `src/system/journal-data.ts`, `src/system/components/JournalMachineBody.tsx`, la page Journal et les tests `journal-machine*` concernés. Deux registres JSON et la fixture `source.txt` sont ajoutés. Aucune dépendance de projet ni verrou modifié.

### Revue adverse et preuves

Une instance indépendante, conformément au harnais du dépôt, a reproduit quatre contournements : date récente seulement déclarée par le modèle ; FAQ/À retenir sous H3 ou gras ; sous-domaines communautaires Google/OpenAI ; première personne singulière. Ils ont été corrigés et leurs reproductions rejouées avec succès par le relecteur, sans modification de fichiers par celui-ci. L'attribution des citations a également été resserrée pour qu'une autre source nommée ailleurs dans le paragraphe ne suffise pas. Une régression d'import dans quatre tests historiques de langue a été corrigée dans le code, en isolant le footer avec le rendu machine chargé conditionnellement ; les tests sont restés intacts.

| Vérification | Résultat C1 |
|---|---|
| Tests machine | **114/114**, contre 92/92 avant C1 |
| Tests machine + quatre tests historiques de langue | **118/118** |
| Installation | `npm ci --silent` réussit désormais dans le worktree, après essai isolé |
| Lint | Réussi |
| Build Webpack | Réussi avec **Next 16.3.4**, version du verrou ; l'ancien blocage Cal.com est levé |
| TypeScript | Réussi |
| Brand OS | **19/19** |
| Claims / marque | Réussis |
| Suite complète | **440/446**, six échecs historiques de références clients |
| Dry-run `--dry-run --fixtures` | Réussi sous préchargement interdisant fetch, HTTP/TCP et sous-processus ; deux MDX et manifeste dans un répertoire temporaire, aucune PR réelle |
| Préservation | Spec identique à l'amendement, aucun article/test historique modifié, `git diff --check` réussi |

Les six échecs historiques restants portent sur les attentes de huit références alors que six sont présentes et sur les logos retirés : les variantes FR/EN de `one home action, two crafts, eight authorized references`, `client colours use only the authorized local source images` et `passe 4 services, technologies, logos and final walker`. Ils figuraient déjà dans les échecs du compte rendu initial. Leur persistance bloque volontairement la publication réelle via la batterie du workflow ; ils ne sont ni ignorés ni réécrits.

Dry-run final : 31 résultats de portes, issue simulée `pr`, quatre appels simulés, coût simulé **0,04 USD**. Ce montant est une fixture, pas un coût réel estimé. Le plafond 0,80 accepte un run simulé à 0,54 et arrête sur 0,81 ; coûts absents/invalides et cumul inter-appels restent bloquants. La plomberie budgétaire est conservée : contrôle sur `usage.cost` reçu, donc refus avant tout appel suivant/publication, sans garantie de plafonnement fournisseur en amont du dernier appel.

### Limites et coût actualisé

Les estimations initiales utilisant DeepSeek V4 Pro pour la rédaction ne s'appliquent plus. Le tarif actuel de GLM-5.2 n'a pas été vérifié : **UNKNOWN**, aucun tarif GLM-5.3 ne lui est substitué. Le coût réel est recherche + deux passes bilingues GLM-5.2 + juge ; le run vérifie les modèles disponibles et cumule les coûts renvoyés. Aucune dépense réelle effectuée.

Les portes prouvent la forme, la présence des nombres/citations/dates dans les sources récupérées et les contraintes testées. La valeur de la thèse, la qualité journalistique, la traduction des termes techniques et la fidélité sémantique restent confiées aux deux passes et aux trois questions prévues du juge ; aucune génération réelle n'a permis de les évaluer ici. Les pages illisibles, non datées ou hors registre entraînent un report plutôt qu'un contenu de substitution. La preuve navigateur en production, la disponibilité réelle des modèles, les permissions/protections GitHub et la mise en ligne n'ont pas été exécutées. `JOURNAL_AUTOPUBLISH` reste désarmé.

Exécution locale sous Node 26.12.1. Un contrôle supplémentaire sous Node 22 a été tenté via npm, puis interrompu faute de résultat du téléchargement ; la combinaison exacte du runner Node 22 reste à vérifier en CI. Le contrôle local des dates et citations ne remplace pas une vérification sémantique de la nature de chaque étude.

## Correctif 2 — tests alignés sur le retrait des logos

Mandat du 12/11/2026 : appliquer uniquement le Correctif 2 de la spec canonique, sans modifier le reste du chantier et sans commit. Lecture de `git show 6364fb4` : la PR #373 retire Toyotomi Europe et Hiolle Technologies des références et logos autorisés sur l'accueil. Le registre général `PUBLIC_CLIENT_NAMES` reste distinct du registre de publication sur l'accueil.

La spec locale a été remplacée à l'identique par la version de `/Users/paullarmaraud/parrit-site/docs/CODEX-SPEC-2026-11-12-machine-articles-quotidienne.md`. SHA256 commun : `dac94b6a4934c165538e644b8189474c0ce6c98dcb9e2cd031d58c804b088ce6`.

Seuls trois fichiers de tests sont adaptés, conformément à l'exception explicite du correctif :

- `tests/action-unique.test.mjs` : références filtrées par l'autorisation d'accueil, liste exacte des six noms et absence des deux références retirées ; contrôle des nouveaux exports limité à Carte Noire, en conservant empreintes, provenance, dimensions, masque alpha et absence de métadonnées.
- `tests/home-visual-layers.test.mjs` : six images attendues, concordance avec le nombre de sources locales autorisées, exclusion explicite des deux références retirées ; contrôle des sources et couleurs conservé.
- `tests/single-page.test.mjs` : six logos dans la page et dans la section références, exclusion des deux références retirées et décision nominative du 08/11 limitée à Carte Noire.

Les assertions sur l'action unique, les deux métiers et les autres comportements sont conservées. Aucun logo réintroduit, aucun code produit, registre, fixture, article ou workflow modifié. Écritures limitées au worktree local, réversibles ; empreintes de l'état précédent conservées dans `/tmp/journal-c2-before.json`.

Validation : même commande `npm test` avant et après, **440/446 (six échecs reproduits) → 446/446, zéro échec, zéro test ignoré**. Journaux : `/tmp/journal-c2-baseline.log` et `/tmp/journal-c2-result.log`. `git diff --check` réussi. Comparaison des empreintes : seuls ces trois tests, la copie de la spec et ce rapport ont changé pendant cette passe. Aucun commit, push, appel LLM ou publication. Cette preuve concerne la suite locale ; aucune nouvelle preuve de production n'est revendiquée.
