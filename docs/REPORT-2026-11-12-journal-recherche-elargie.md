# Recherche Journal élargie : compte rendu du 12/11/2026

Implémentation de `docs/CODEX-SPEC-2026-11-12-journal-recherche-elargie.md`
sur le checkout demandé, `7726aa3`. Instructions AGENTS.md et contexte du dépôt
lus avant modification. La spec était le seul fichier non suivi initial ; elle
est conservée à l'identique (SHA256
`cb3f83f1051db42760f240d8f491def7e323f1320dae75132c596f8d3478666a`).

## Modifications

- `content/plan/sources-primaires.json` : listes institutions et presse/éditeurs
  de la spec. La liste noire existante `sources-refusees.json` est réutilisée.
- `scripts/journal-machine-research.mjs` : préparation des requêtes, trois
  passes web Exa à dix résultats, filtres JSON, contradiction et repli unique
  sans engine lorsque l'API refuse include_domains. Fusion des citations par
  URL sans UTM ni fragment, paramètres utiles conservés et triés. Dates et faits
  restent vérifiés dans les pages ; aucune relaxation des seuils 3 sources et
  4 faits. Plus de huit pistes de recherche ne fait plus échouer la collecte ;
  le contrat de l'article demeure 3–8 références.
- `scripts/journal-machine.mjs` : branchement de la recherche, classification
  des erreurs API sans recopier leur corps, suppression des extraits du log,
  coût cumulé incluant la préparation et les replis. Une restauration échouée
  ou une configuration invalide avant restauration interdit la sauvegarde distante.
- `scripts/journal-machine-gates.mjs` : les nouveaux domaines JSON rejoignent
  le registre autorisé ; restrictions locales, liste noire, contrôle DNS et
  protections des redirections restent applicables.
- `scripts/journal-machine-github.mjs` : sauvegarde des deux fichiers d'état
  sur `journal/etat`, sans PR d'état ni écriture main, même en mode armé.
  La publication des articles conserve le chemin PR et l'armement existants.
  La branche est créée si absente puis avancée sans force avec le commit d'état
  précédent comme parent. Une modification concurrente refuse la sauvegarde.
  Reprise depuis un SHA figé, comparaison des dates de commits par fichier
  d'état, validation des deux fichiers avant écriture locale. Les compteurs
  fusionnent par maximum même si main a ajouté un sujet plus récemment ; seuls
  les champs d'état et le journal plus récents sont repris. Les sujets nouveaux,
  champs éditoriaux et statuts terminaux de main sont conservés. Lecture de
  l'ancienne branche `journal/etat-machine` uniquement si la nouvelle est absente.
- `tests/journal-machine-research.test.mjs` : nouveaux tests dédiés.
- `tests/journal-machine.test.mjs`, `tests/journal-machine-github.test.mjs` et
  `tests/fixtures/journal-machine/openrouter.json` : contrats de la machine
  adaptés aux trois passes et tests supplémentaires.
- `docs/journal-recherche-elargie/plan.md`, ce rapport et `AI_CONTEXT.md` : plan,
  choix d'implémentation et état de validation.

Aucun article, fichier d'état réel, workflow, dépendance, test hors machine ou
fichier visuel n'a été modifié. Aucun commit, push ou déploiement effectué.

## Diagnostic et interprétation des requêtes

Chaque tentative conserve `recherches` (passe, requêtes, résultats annotés,
repli éventuel), `sources_ecartees` (URL, titre, motif) et `sources_acceptees`
(URL, titre, nombre de faits vérifiés). Les six motifs demandés sont couverts :
`domaine_refuse`, `trop_ancienne`, `sans_date`, `http_<code>`, `sans_chiffre`,
`doublon`. Des motifs explicites complètent les erreurs de métadonnées, les
sources inaccessibles et les recherches interrompues. Les extraits et textes
de pages servent aux portes en mémoire uniquement. L'historique préexistant
n'est pas réécrit. L'artefact de diagnostic du workflow est conservé.

La documentation [OpenRouter Web Search](https://openrouter.ai/docs/guides/features/plugins/web-search),
consultée via Context7 le 12/11/2026, décrit `search_prompt` comme le texte
d'injection des résultats. Une préparation sans web génère donc d'abord les
2–3 requêtes par passe ; elles sont ensuite transmises dans chacun des trois
appels web. Le journal expose ces requêtes émises vers OpenRouter, pas une
prétendue trace interne d'Exa, que cette API ne fournit pas. Les nombres de
résultats sont les annotations url_citation effectivement retournées.

Le repli est borné à une tentative sans engine par passe avec include_domains,
sur refus API identifié (400/422). Une erreur d'authentification, quota, réseau
ou budget ne déclenche pas ce repli. Le budget reste 0,80 USD ; chaque réponse
réussie exige un usage.cost valide. Aucun coût réel n'a été engagé ici.

La fraîcheur et les écritures GitHub s'appuient sur les contrats officiels
[liste des commits filtrée par fichier](https://docs.github.com/en/rest/commits/commits)
et [mise à jour de référence sans force](https://docs.github.com/en/rest/git/refs),
consultés via Context7 le même jour.

## Tests et résultats

Les tests bloquent le réseau réel ; clients OpenRouter, pages sources, DNS et
API GitHub sont injectés. Seuls les fichiers `tests/journal-machine*` et leurs
fixtures ont été modifiés.

Les 16 tests supplémentaires couvrent notamment :

- filtres exacts et trois passes après préparation, regroupement de sources
  différentes par passe, dédoublonnage des UTM/fragments ;
- repli ciblé et borné, erreurs non éligibles, absence de corps API dans les logs ;
- tous les motifs requis, faits présents dans les pages, absence d'extraits
  persistés, diagnostic des candidats lors d'une interruption ;
- état sans PR en armé/désarmé, création et mise à jour sans force, reprise
  entre deux runs jusqu'au troisième essai, fusion monotone des compteurs,
  refus de l'état invalide et migration de l'ancienne branche ;
- absence de sauvegarde avant une reprise réussie.

| Vérification | Résultat |
| --- | --- |
| Baseline machine avant modification | 114/114 |
| Premier npm test avant génération des artefacts | 437/446 ; 9 échecs sur artefacts de build absents |
| Build Webpack de référence | Réussi |
| npm ci --silent, final | Réussi |
| npm run lint, final | Réussi |
| npm run build -- --webpack, final | Réussi |
| npm test, après build final | **462/462**, aucun échec ni test ignoré |
| Tests machine ciblés, après corrections | **130/130** |
| node scripts/journal-machine.mjs --dry-run --fixtures | Réussi, deux éditions en répertoire temporaire |
| git diff --check | Réussi |

La chaîne demandée a été exécutée dans l'ordre, avec arrêt sur erreur.
Journaux locaux : `/private/tmp/journal-elargie-final-{ci,lint,build,tests}.log`.
Dry-run : `/private/tmp/journal-elargie-final-dry-run.json` et son `.log`.
Le coût de 0,061 USD affiché par ce dry-run vient des fixtures, pas d'une facture.

Une revue indépendante en lecture seule a trouvé puis fait corriger les pertes
de compteurs lors d'un ajout de sujet sur main, la migration de branche et le
diagnostic interrompu. Contre-revue finale : aucun défaut bloquant identifié.

## Limites et preuve attendue après livraison

Aucun blocage local restant. Aucun appel OpenRouter réel, commit GitHub réel,
déploiement ou publication n'a été exécuté, conformément au mandat. Le premier
run autorisé devra confirmer la qualité des sources réellement retournées,
la compatibilité des filtres du fournisseur et la reprise effective depuis
`journal/etat`. Les tests simulés ne constituent pas cette preuve de production.
