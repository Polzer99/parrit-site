# CODEX SPEC — Journal : rédaction stable (réponse vide, repli, coupe-circuit, preuve par appel)

Niveau de risque : moyen (script de contenu désarmé, mais comportement de coût et workflow quotidien). Lancement validé par Paul le 13/11/2026 (« go correctif », avec la consigne : « je veux quelque chose de stable, en reprenant toutes les logiques de harnais »).

Bornes du chantier (§55) : un tour Codex, un tour correctif au maximum, un seul passage réel de preuve après fusion (plafond 0,80 USD). La publication automatique reste désarmée (`JOURNAL_AUTOPUBLISH` n'est pas touché).

## 1. Constat (run 43318896226, 12/11 22:21 UTC, après #381)

- La recherche fonctionne : sujet 3, 7 sources primaires retenues (France Num, Deloitte, Bpifrance, Le Monde Informatique), dates lues dans la page ; sujet 4, 5 sources (France Num, Banque de France, Le Monde Informatique).
- Les deux sujets échouent ensuite avec le motif « réponse OpenRouter vide », avant toute porte (`passes: []`, `these_retenue: null`). L'étape en cause est le premier appel de rédaction, modèle `z-ai/glm-5.2`, `max_tokens: 12000` (`scripts/journal-machine.mjs`, fonction `ask`).
- Coût du passage : 0,32 USD pour deux tentatives sans texte.
- Le journal de bord ne garde ni l'étape, ni `finish_reason`, ni le détail d'usage : **la cause exacte n'est pas établie**. Hypothèse à vérifier par la preuve du §2, pas à tenir pour acquise : `glm-5.2` raisonne avant d'écrire, le raisonnement consomme le plafond de sortie, `content` revient vide avec `finish_reason: "length"`.
- Quatre passages réels de suite ont échoué le 12/11, chacun sur un défaut différent (#378 à #381). La machine n'a aucun mécanisme qui l'empêche de refaire le même échec payant chaque matin.

## 2. Principe : la machine suit la logique du harnais

Chaque appel payant est une étape avec un contrat : une entrée, une sortie vérifiée, un nombre de reprises borné, un repli, une trace. Aucune étape ne peut échouer sans laisser de quoi établir la cause. Les six mécanismes ci-dessous sont le périmètre complet ; ne rien ajouter d'autre.

### 2.1 Preuve par appel (trace)

Pour **chaque** appel OpenRouter (recherche, rédaction, secrétariat de rédaction, juge), ajouter au run consigné dans `content/plan/journal-runs.jsonl` une entrée dans un tableau `appels` : `etape`, `modele`, `tentative`, `echelon` (voir 2.2), `finish_reason`, `jetons_entree`, `jetons_sortie`, `jetons_raisonnement` (si fournis par `usage.completion_tokens_details.reasoning_tokens`, sinon `null`), `cout`, `duree_ms`, `issue` (liste fermée : `ok`, `vide`, `tronquee`, `json_invalide`, `delai`, `http_<code>`, `parametre_refuse`). **Jamais** de texte de requête ni de réponse, jamais d'en-tête, jamais de clé.

Un appel qui échoue par délai ou erreur HTTP est consigné lui aussi (coût `null` si inconnu).

### 2.2 Échelle de reprise pour toute réponse inutilisable

Une réponse est **inutilisable** si : `content` absent, vide ou fait seulement d'espaces (`vide`) ; `finish_reason` vaut `length` (`tronquee`, même si `content` n'est pas vide : un texte coupé ne part jamais vers les portes) ; pour les étapes qui attendent du JSON, le JSON ne se lit pas (`json_invalide`).

Pour les étapes rédaction, secrétariat de rédaction et juge, l'échelle est fixe, trois échelons, jamais plus :

1. **Échelon 1** : l'appel actuel, inchangé.
2. **Échelon 2** : même modèle, raisonnement réduit. Utiliser le paramètre `reasoning` d'OpenRouter (à vérifier dans la documentation OpenRouter en ligne avant de coder : `effort: "low"`, ou `max_tokens` de raisonnement, ou `exclude` ; retenir la forme qui **réduit** réellement les jetons de raisonnement, pas celle qui se contente de les masquer). Si OpenRouter refuse le paramètre (400 ou 422), consigner `parametre_refuse` et passer à l'échelon 3 sans planter.
3. **Échelon 3** : modèle de repli de l'étape, appel simple.

Si l'échelon 3 rend encore une réponse inutilisable : le sujet échoue avec un motif de la liste fermée `openrouter_<etape>_<issue>` (par exemple `openrouter_redaction_vide`), et la machine passe au sujet suivant comme aujourd'hui. Le retour `completeWithRetry` existant (délai, 429, 5xx : une reprise) est conservé à l'intérieur de chaque échelon.

Le plafond de coût du run est revérifié avant chaque échelon ; un échelon ne part pas s'il ne reste pas de quoi le payer au prix de l'appel précédent le plus cher.

### 2.3 Modèles de repli et séparation des rôles

- `JOURNAL_MODELE_REDACTION` inchangé (défaut `z-ai/glm-5.2`) ; ajouter `JOURNAL_MODELE_REDACTION_REPLI` (défaut `deepseek/deepseek-v4-pro`).
- `JOURNAL_MODELE_JUGE` inchangé (défaut `z-ai/glm-5.3`) ; ajouter `JOURNAL_MODELE_JUGE_REPLI` (défaut `deepseek/deepseek-v4-pro`).
- **Le juge n'est jamais le modèle qui a écrit le texte.** Si, après replis, le modèle du juge serait identique au modèle qui a effectivement rédigé, le juge utilise l'autre modèle disponible (son modèle principal ou son repli) ; si aucun modèle différent ne répond, le sujet échoue avec le motif `juge_identique_au_redacteur` : aucune proposition d'article.
- Les modèles **effectivement** utilisés par étape sont consignés dans le run (champ `modeles_effectifs`), en plus de `modeles` (configuration).
- Les deux nouvelles variables sont passées par le workflow (`vars.*`), comme les trois existantes.

### 2.4 Coupe-circuit

Avant tout appel payant, lire les derniers runs réels consignés (hors `simulation`). Si les **trois derniers** runs réels se sont terminés en `echec` pour un motif technique (tout motif sauf file de sujets vide, sujets en attente de PR, sujet écarté pour répétition), et que le déclenchement est le **cron** : la machine ne fait aucun appel payant, consigne un run `issue: "coupe_circuit"` (coût 0), ouvre ou met à jour **une seule** issue GitHub « Journal : coupe-circuit, trois échecs de suite » (réutiliser `issueOnce`) avec les trois motifs et les trois tableaux `appels` résumés, et termine en code 0.

Un déclenchement manuel (`workflow_dispatch`) passe toujours : c'est le geste humain de réarmement. Un run réel qui se termine autrement qu'en échec technique remet le compteur à zéro. Le déclencheur est lu dans `GITHUB_EVENT_NAME` ; hors GitHub Actions, se comporter comme un déclenchement manuel.

### 2.5 Alerte de coût par appel

Un appel de rédaction ou de secrétariat dont le coût dépasse 0,15 USD, ou un appel de juge au-delà de 0,05 USD, est marqué `alerte_cout: true` dans sa trace. Le plafond du run (0,80 USD) reste le garde final, inchangé.

### 2.6 Résumé lisible sans télécharger d'artefact

À la fin de chaque run, écrire dans `GITHUB_STEP_SUMMARY` (si la variable existe) : la date, l'issue du run, le sujet, le motif, le coût total, puis un tableau des appels (étape, modèle, échelon, `finish_reason`, jetons de sortie, jetons de raisonnement, coût, durée, issue). Même règle : aucun texte de requête ni de réponse.

## 3. Banc de cas réels (§55 : un défaut constaté devient un cas du banc)

Ajouter aux tests de la machine, avec le client simulé existant, sans réseau :

1. `content` vide et `finish_reason: "length"` à l'échelon 1, succès à l'échelon 2 → article produit, `appels` contient les deux entrées avec leurs échelons.
2. `content: null` aux échelons 1 et 2, succès du modèle de repli → article produit, `modeles_effectifs.redaction` = modèle de repli.
3. Réponse non vide mais `finish_reason: "length"` → traitée comme inutilisable, jamais envoyée aux portes.
4. Trois échelons inutilisables → motif `openrouter_redaction_vide`, sujet suivant tenté, aucun fichier d'article laissé sur le disque.
5. Paramètre `reasoning` refusé en 400 à l'échelon 2 → `parametre_refuse`, échelon 3 appelé.
6. Rédaction faite par le modèle de repli, juge configuré sur ce même modèle → le juge utilise un modèle différent ; aucun modèle différent disponible → `juge_identique_au_redacteur`.
7. Coupe-circuit : trois runs réels en échec technique + cron → zéro appel payant, une issue, code 0 ; même historique + `workflow_dispatch` → la machine tourne ; un succès remet le compteur à zéro ; les simulations ne comptent pas.
8. Trace : pour chaque appel simulé, toutes les clés de 2.1 présentes ; aucune chaîne du prompt ni de la réponse dans `journal-runs.jsonl` ni dans le résumé (test par recherche d'un marqueur placé dans le prompt et dans la réponse simulés).
9. Alerte de coût : un appel de rédaction à 0,20 USD simulé porte `alerte_cout: true`.
10. Plafond : un échelon qui ferait dépasser 0,80 USD ne part pas.

Les quatre défauts déjà corrigés (#378 à #381) gardent leurs tests ; ne pas les modifier, sauf pour y ajouter des cas.

## 4. Contraintes

- Ne modifie pas les tests existants hors ceux de la machine. Aucune dépendance npm ajoutée.
- Ne touche ni aux portes éditoriales, ni aux consignes de rédaction (`WRITING_SYSTEM`, `formatPrompt`, `EDITING_PROMPT`), ni à la fusion automatique, ni au périmètre de fichiers autorisés.
- Mettre à jour `docs/` : rapport `docs/REPORT-2026-11-13-journal-redaction-stable.md` (ce qui est fait, la preuve par test, ce qui n'a pas pu être vérifié sans clé OpenRouter, notamment le comportement réel du paramètre `reasoning` sur `glm-5.2`).
- Batterie : `npm ci --silent && npm run lint && npm run build -- --webpack && npm test`, verte deux fois de suite.

## 5. Preuve finale (faite par Claude après fusion, hors périmètre Codex)

Un seul passage réel par `workflow_dispatch`. Attendu : soit un article proposé en PR, soit un échec dont le tableau `appels` établit la cause (`finish_reason`, jetons de raisonnement, échelon). Dans les deux cas, la cause du défaut du 12/11 passe de « hypothèse » à « constaté ».

---

## Correctif 1 — relecture de Claude (13/11/2026), tour unique

La relecture du premier tour (595/595 chez Codex) relève cinq écarts. Le premier vient d'une contradiction de cette spec (§2.1 et cas 8 du banc), les quatre autres touchent à la stabilité demandée par Paul.

1. **Ne pas appauvrir le diagnostic qui existait.** `runRecord` retire aujourd'hui du journal de bord les motifs des portes, les adresses et titres des sources acceptées et écartées, les requêtes de recherche, `preparation_brute`/`preparation_relance_brute` et `these_retenue`. Ces champs existaient avant ce chantier et ont servi à établir les causes des défauts #378 à #381 ; sans eux, un échec à une porte ou en recherche redevient opaque. **Les rétablir tels qu'ils étaient sur `origin/main`**, et rétablir à l'identique les assertions historiques modifiées dans `tests/journal-machine.test.mjs` (hors celles que les points 2 à 5 changent réellement, à lister dans le rapport). La règle « aucun texte de requête ni de réponse » s'applique **uniquement** au tableau `appels`, au résumé `GITHUB_STEP_SUMMARY` et au corps de l'issue du coupe-circuit. Le cas 8 du banc est corrigé en ce sens : le marqueur ne doit apparaître ni dans `appels`, ni dans le résumé, ni dans le corps de l'issue. Dans le résumé et l'issue, le motif reste réduit à sa classification (`diagnosticReason`), comme aujourd'hui.
2. **Le modèle de repli sert aussi quand le modèle principal ne répond pas.** Aujourd'hui, un délai dépassé ou une erreur 429/5xx à l'échelon 1, après la reprise de `completeWithRetry`, fait échouer le sujet sans essayer le repli. Pour la rédaction, le secrétariat et le juge : après épuisement de la reprise sur `delai`, `http_429` ou `http_5xx`, passer **directement à l'échelon 3** (modèle de repli), sans passer par l'échelon 2. Les erreurs 4xx autres que 429 (hors `parametre_refuse` à l'échelon 2) continuent de faire échouer le sujet. La recherche garde son comportement actuel.
3. **Lecture tolérante du JSON.** Une réponse entourée de clôtures de code Markdown (```` ```json … ``` ````) ou suivie de texte après l'objet est fréquente et ne doit ni consommer un échelon ni faire échouer le sujet. Une seule fonction partagée extrait l'objet (retirer les clôtures, prendre du premier `{` au dernier `}` correspondant, puis `JSON.parse`) ; elle est utilisée par `responseIssue`, par `editions` et par `validateJudge`. Un JSON réellement illisible après extraction reste `json_invalide`. Rétablir alors le test historique sur le tiret cadratin dans sa forme d'origine s'il repasse.
4. **Disponibilité des modèles vérifiée avant de payer.** Au démarrage, après lecture du catalogue : recherche indisponible → arrêt de configuration (comme aujourd'hui) ; rédaction → si le modèle principal est absent du catalogue mais le repli présent, le run continue avec le repli (consigné dans `modeles_effectifs`), si les deux sont absents → arrêt de configuration ; juge → au moins un des deux modèles présent, sinon arrêt de configuration. Le motif `juge_identique_au_redacteur` est réservé au cas où le seul juge disponible est le modèle qui a rédigé ; un juge simplement absent du catalogue ne doit jamais porter ce motif.
5. **Un crash compte dans le coupe-circuit.** `technicalFailure` ignore les runs `issue: "crash"` (filet global de #381) : trois crashs de suite ne déclenchent rien, et un crash intercalé remet le compteur à zéro. Un run `crash` est un échec technique.

Tests à ajouter ou corriger : un cas par point (1 : champs historiques présents dans le journal, marqueur absent de `appels`, du résumé et de l'issue ; 2 : délai puis repli, 429 puis repli, 400 sans repli ; 3 : clôtures Markdown, texte après l'objet, JSON illisible ; 4 : les quatre combinaisons de catalogue ; 5 : trois crashs + cron, et échec, crash, échec + cron). Batterie complète verte deux fois de suite. Compléter le rapport `docs/REPORT-2026-11-13-journal-redaction-stable.md`. Ne pas committer.
