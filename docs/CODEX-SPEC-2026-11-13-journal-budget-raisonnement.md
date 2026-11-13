# CODEX SPEC — Journal : le raisonnement des modèles consomme tout le plafond de sortie

Niveau de risque : moyen (coût par passage). **Lancée le 13/11/2026 sur accord de Paul (« go »).**

Bornes proposées (§55) : un tour Codex, un tour correctif au maximum ; un essai des modèles (plafond 0,10 USD) ; un seul passage réel (plafond 0,80 USD). La publication automatique reste désarmée.

## 1. Constaté (run 43404974119, 13/11/2026 09:54 UTC, après #382 ; source : `journal-runs.jsonl` de l'artefact du run)

La recherche fonctionne : 10 sources retenues sur le premier sujet, 5 sur le second ; 8 appels, 0,046 USD. Les six appels de rédaction sont tronqués (`finish_reason: "length"`), plafond de sortie 12 000 jetons :

| Sujet | Modèle | Échelon | Jetons de sortie | dont raisonnement | Coût USD | Durée |
|---|---|---|---|---|---|---|
| 1 | z-ai/glm-5.2 | 1 | 12 000 | 6 914 | 0,096 | 75 s |
| 1 | z-ai/glm-5.2 | 2 (`reasoning.effort: low`) | 12 000 | 12 000 | 0,082 | 97 s |
| 1 | deepseek/deepseek-v4-pro | 3 | 12 000 | 11 680 | 0,100 | 120 s |
| 2 | z-ai/glm-5.2 | 1 | 12 000 | 12 000 | 0,082 | 56 s |
| 2 | z-ai/glm-5.2 | 2 (`reasoning.effort: low`) | 12 000 | 12 000 | 0,070 | 46 s |
| 2 | deepseek/deepseek-v4-pro | 3 | 12 000 | 11 691 | 0,078 | 115 s |

Coût du passage : 0,554 USD. Motif : `openrouter_redaction_tronquee`.

Ce qui est établi : les deux modèles raisonnent avant d'écrire, et ce raisonnement prend de 58 % à 100 % du plafond ; `reasoning.effort: "low"` ne réduit pas le raisonnement de `glm-5.2` (12 000 jetons à l'échelon 2) ; même quand il reste 5 000 jetons (premier appel), deux éditions complètes ne tiennent pas. Ce qui n'est pas établi : quel réglage réduit réellement le raisonnement de ces deux modèles, et combien ils raisonneraient sans plafond.

Documentation OpenRouter (guide « Reasoning tokens », relu le 13/11) : les jetons de raisonnement comptent dans `max_tokens` et sont facturés ; pour l'éviter, monter `max_tokens` bien au-dessus du raisonnement attendu, ou plafonner avec `reasoning.max_tokens` ou un `reasoning.effort` plus bas ; `effort: "none"` désactive le raisonnement ; le guide ne cite comme modèles prenant en charge `effort` que les modèles de raisonnement d'OpenAI et Grok.

## 2. Correction

### 2.1 Essai des modèles (établir le fait avant de régler)

Nouveau mode `node scripts/journal-machine.mjs --essai-modeles`, déclenchable par le workflow (`workflow_dispatch`, entrée `essai_modeles: true`), sans article, sans recherche, sans écriture d'état autre que le journal de bord. Pour chaque modèle de rédaction et de juge configuré (principal et repli), une même petite demande (un paragraphe de 120 mots en JSON, `max_tokens: 3000`) est envoyée avec cinq réglages : aucun paramètre `reasoning` ; `{ effort: "low" }` ; `{ effort: "none" }` ; `{ max_tokens: 1024 }` ; `{ enabled: false }`. Pour chaque appel, la trace habituelle (statut ou code HTTP, `finish_reason`, jetons de sortie, jetons de raisonnement, coût, durée) est consignée et affichée dans le résumé du run sous forme de tableau modèle × réglage. Plafond de coût de l'essai : 0,10 USD, vérifié avant chaque appel. Un réglage refusé (400 ou 422) est consigné `parametre_refuse` et l'essai continue.

### 2.2 Réglages de rédaction pilotés par configuration

- `JOURNAL_REDACTION_MAX_TOKENS` (défaut 32 000) remplace le 12 000 en dur pour la rédaction et le secrétariat ; `JOURNAL_JUGE_MAX_TOKENS` (défaut 8 000) pour le juge.
- `JOURNAL_RAISONNEMENT_REDACTION` et `JOURNAL_RAISONNEMENT_JUGE` : objet JSON passé tel quel comme paramètre `reasoning` à l'échelon 1 (défaut `{"max_tokens":4000}`). L'échelon 2 utilise `{"effort":"none"}` ; l'échelon 3 (modèle de repli) reprend le réglage de l'échelon 1. Une valeur invalide est une erreur de configuration au démarrage, avant tout appel payant.
- Les cinq variables passent par le workflow (`vars.*`).
- Une réponse dont le texte visible (jetons de sortie moins jetons de raisonnement) est nul est classée `vide`, même si `content` contient des espaces ; la trace gagne le champ `jetons_visibles`.
- Seuils d'alerte de coût : rédaction et secrétariat 0,25 USD par appel (au lieu de 0,15), juge 0,05 USD inchangé. Plafond du run inchangé (0,80 USD), réserve inchangée.

### 2.3 Ce qui ne change pas

Portes éditoriales, consignes de rédaction, échelle à trois échelons, séparation rédacteur/juge, coupe-circuit, fusion automatique désarmée.

## 3. Tests

- Essai : cinq réglages par modèle appelés une fois chacun, tableau complet dans le résumé, arrêt au plafond de 0,10 USD, réglage refusé consigné sans interrompre, aucun article ni sujet modifié.
- Réglages : valeurs par défaut envoyées ; variables d'environnement prises en compte ; JSON invalide → erreur de configuration avant tout appel ; échelon 2 envoie `{"effort":"none"}`.
- `jetons_visibles` calculé ; réponse à zéro jeton visible classée `vide`.
- Seuil d'alerte à 0,25 USD.
- Ne modifie pas les tests existants hors ceux de la machine. Batterie : toutes les étapes de `.github/workflows/ci.yml` exécutables (`npm run lint`, `npm run qa:claims:rev01`, `npm run build`, `npm run test:brand-os`, `npm test`, `npm run qa:brand:rev01`), vertes deux fois.
- Rapport `docs/REPORT-2026-11-13-journal-budget-raisonnement.md`.

## 4. Après fusion (Claude)

1. Lancer l'essai des modèles ; lire le tableau ; si le réglage par défaut ne réduit pas le raisonnement, proposer à Paul les valeurs des variables (changement de réglage du dépôt : son geste ou son accord).
2. Un seul passage réel. Attendu : un article proposé en PR, à relire face à une chronique de référence avant tout armement.

## Correctif 1 — l'essai ne doit pas mourir au premier incident (13/11/2026, relecture de Claude), dernier tour

Le code rendu suit la spec. Quatre points de robustesse, tous dans le périmètre de la machine. Aucun autre changement.

### A. Un appel d'essai sans réponse n'arrête plus tout l'essai

Constaté dans `scripts/journal-machine-trial.mjs` : tout appel sans réponse autre que 400 ou 422 (délai, 404, 429, 5xx, coupure réseau) laisse `trace.cout` à `null`, ce qui arrête l'essai entier avec le motif `usage.cost absent ou invalide`. Un seul incident sur quinze appels rend le tableau inutilisable et oblige à relancer.

Attendu :
- **404** : consigné `http_404`, compté à 0 USD, l'essai continue. Source : documentation OpenRouter (« Router metadata », « No Providers Available (404) ») : quand le filtre `max_price` ou la liste de fournisseurs écarte tous les candidats, `attempt` vaut 0, la demande n'a atteint aucun fournisseur.
- **Tout autre appel sans réponse** (délai, 429, 5xx, réseau) : la facturation est inconnue, donc on compte la réserve de cet appel (`pricing.reserve`, le pire cas) dans `run.cout`, on consigne l'issue, et l'essai continue. Le plafond de 0,10 USD reste vérifié avant chaque appel avec ce coût majoré. La trace garde `cout: null` pour ne pas inventer un coût ; le total du passage, lui, inclut la réserve, et le résumé le dit sur une ligne (« dont réserves comptées pour appels sans réponse : x USD »).
- **Une réponse 200 sans `usage.cost`** reste un arrêt (inchangé) : là, la facturation réelle est certaine et inconnue.

### B. Le plafond de prix par fournisseur ne doit pas tomber sous le prix du catalogue

Constaté : `max_price` vaut `input * 1e6` et `output * 1e6`, calculés en virgule flottante depuis les chaînes du catalogue. Un arrondi d'un dernier chiffre vers le bas écarte le fournisseur au prix du catalogue et produit un 404 sur les cinq réglages du modèle.

Attendu : arrondir `prompt` et `completion` **vers le haut** à six décimales (USD par million de jetons) avant de les envoyer ; `request` arrondi vers le haut à neuf décimales. La réserve de coût reste calculée sur ces valeurs arrondies, pour que le plafond reste un majorant.

### C. Ordre de l'essai : les réglages les plus utiles d'abord

Constaté : la boucle parcourt modèle par modèle. Si le premier modèle raisonne jusqu'au plafond de sortie sur chaque réglage (ce que le passage réel du 13/11 rend plausible), le plafond de 0,10 USD est atteint avant que les autres modèles soient essayés.

Attendu : boucle extérieure sur les réglages, boucle intérieure sur les modèles, dans cet ordre de réglages : `effort_none`, `enabled_false`, `max_tokens_1024`, `effort_low`, `sans_parametre`. Si le plafond coupe l'essai, il manque les cellules les moins utiles (le comportement sans paramètre est déjà mesuré). Le résumé reste un tableau modèle × réglage ; une cellule non essayée est affichée « non essayé (plafond) », jamais laissée vide.

### D. Une réponse qui contient du texte n'est jamais classée « vide » par calcul de jetons

Constaté dans `responseIssue` : `visibleTokens(response) === 0` classe `vide` avant tout examen du contenu. Chez un fournisseur qui ne compte pas le raisonnement dans `completion_tokens`, ou qui le surestime, un article complet serait rejeté.

Attendu : `vide` seulement si le contenu est absent ou réduit à des espaces (la règle d'avant) ; dans ce cas, `vide` l'emporte sur `tronquee` quand les jetons visibles sont nuls, ce qui nomme correctement le défaut du 13/11 (tout le plafond parti en raisonnement). Un contenu non vide suit les règles existantes (`tronquee` si `finish_reason: length`, puis JSON). `jetons_visibles` reste une mesure dans la trace, pas un motif de rejet à lui seul.

### Tests à ajouter

- A : 404 au milieu de l'essai → essai complet, coût inchangé ; délai puis 503 → réserve comptée deux fois, essai poursuivi, arrêt propre `essai_plafond` quand la réserve ne tient plus ; 200 sans `usage.cost` → arrêt.
- B : prix de catalogue `"0.00000055"` et `"0.0000022"` → `max_price` supérieur ou égal au prix du catalogue converti, jamais inférieur.
- C : ordre exact des quinze appels ; plafond atteint après N appels → cellules restantes « non essayé (plafond) » dans le résumé.
- D : contenu complet avec `reasoning_tokens` supérieur à `completion_tokens` → `ok` ; contenu d'espaces avec zéro jeton visible et `finish_reason: length` → `vide`.

Batterie et rapport : comme au §3, rapport complété d'une section « Correctif 1 ».
