# CODEX SPEC — Journal quotidien : recherche élargie et diagnostic

Niveau de risque : faible (script de contenu désarmé, aucun changement de site).

Suite de `docs/CODEX-SPEC-2026-11-12-machine-articles-quotidienne.md` (PR #375 fusionnée). Premier passage réel le 12/11 (run 43290556357) : les deux premiers sujets écartés en `materiau_insuffisant`, pour 0,015 USD. Le contrôle a bien empêché d'écrire à vide, mais la recherche est trop pauvre : **une seule** requête web de 8 résultats, sans orientation vers les sources primaires, sur des questions génériques (« par où commencer l'IA dans une PME »), ramène surtout des blogs de vendeurs que la porte refuse. Et le journal de bord ne dit pas pourquoi.

## 1. Recherche en trois passes (remplace l'étape de recherche de `scripts/journal-machine.mjs`)

Chaque passe = un appel OpenRouter avec `plugins: [{ "id": "web", "engine": "exa", "max_results": 10, ... }]` (options documentées par OpenRouter : `engine`, `max_results`, `include_domains`, `exclude_domains`, `search_prompt`). Le modèle de recherche reformule d'abord la requête du sujet en 2 ou 3 requêtes de recherche concrètes (avec l'année, le secteur, le mot « étude », « enquête », « baromètre », « rapport »).

1. **Données publiques et études** : `include_domains` = liste `content/plan/sources-primaires.json` clé `institutions` (à créer) : insee.fr, bpifrance.fr, lab.bpifrance.fr, banque-france.fr, dares.travail-emploi.gouv.fr, francenum.gouv.fr, economie.gouv.fr, entreprises.gouv.fr, cnil.fr, legifrance.gouv.fr, eur-lex.europa.eu, digital-strategy.ec.europa.eu, ec.europa.eu, eurostat (ec.europa.eu/eurostat), oecd.org, cci.fr, hautsdefrance.fr, cpme.fr, medef.com, mckinsey.com, bcg.com, ey.com, pwc.fr, deloitte.com, gartner.com, capgemini.com, stanford.edu (hai.stanford.edu), arxiv.org.
2. **Éditeurs et presse de référence** : clé `presse_editeurs` : anthropic.com, claude.com, openai.com, mistral.ai, blog.google, microsoft.com, lesechos.fr, lemonde.fr, usinenouvelle.com, lemondeinformatique.fr, latribune.fr, lefigaro.fr, ft.com, reuters.com.
3. **Contradiction** : sans `include_domains`, `exclude_domains` = `content/plan/sources-refusees.json`, consigne : chercher ce qui contredit ou nuance la thèse pressentie.

Les trois listes vivent dans les fichiers JSON (modifiables sans code). Les annotations `url_citation` des trois passes sont fusionnées et dédoublonnées par URL canonique (sans `utm_*`, sans fragment). Si l'engine `exa` refuse `include_domains` (erreur API), réessayer la passe une fois sans `engine` (repli natif) puis consigner.

Le seuil « 3 sources primaires acceptées, 4 faits chiffrés » reste inchangé. Plafond de coût inchangé (0,80 USD) ; trois passes coûtent environ 0,03 USD de recherche.

## 2. Diagnostic dans le journal de bord

Dans `content/plan/journal-runs.jsonl`, pour chaque tentative : requêtes de recherche émises par passe, nombre de résultats par passe, et pour chaque URL écartée le motif (`domaine_refuse`, `trop_ancienne`, `sans_date`, `http_<code>`, `sans_chiffre`, `doublon`). Liste des sources acceptées avec le nombre de faits chiffrés trouvés dans chacune. Pas de texte de page dans le journal (seulement URL, titre, motif, compteurs).

## 3. Persistance de l'état

Un run qui n'a produit **aucun article** ne doit pas exiger l'ouverture d'une PR pour sauvegarder `sujets.json` et `journal-runs.jsonl` : dans ce cas, pousser un commit d'état direct sur une branche dédiée `journal/etat` (créée si absente, mise à jour à chaque run), et l'artefact de diagnostic existant reste. Les runs suivants relisent l'état depuis `journal/etat` s'il est plus récent que `main`. Un article produit continue de passer par une PR (ou la fusion armée). Les compteurs `essais` des sujets ne doivent pas être perdus entre deux runs.

## 4. Tests

- Recherche simulée (fixtures) : trois passes appelées avec les bons `plugins` (engine, include/exclude), fusion et dédoublonnage, repli sans engine sur erreur.
- Journal de bord : motifs d'écart présents pour chaque URL refusée.
- Persistance : run sans article → commit sur `journal/etat` simulé, aucune PR ouverte ; run suivant relit cet état.
- Ne modifie pas les tests existants, sauf ceux de la machine (`tests/journal-machine*`). Batterie : `npm ci --silent && npm run lint && npm run build -- --webpack && npm test`, entièrement verte.
