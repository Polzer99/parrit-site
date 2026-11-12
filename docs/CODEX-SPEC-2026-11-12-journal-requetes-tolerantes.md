# CODEX SPEC — Journal : requêtes de recherche tolérantes

Niveau de risque : faible (script de contenu désarmé).

Constat : passage réel du 12/11 (run 43302703785), les deux sujets échouent en « requêtes de recherche invalides » avant toute recherche web (coût 0,0002 USD). Cause : `scripts/journal-machine-research.mjs` ligne 68 rejette **tout** le lot si **une** requête ne contient pas à la fois l'année et un des mots « étude|enquête|baromètre|rapport », ou si une passe n'a pas 2 à 3 requêtes, ou si la réponse a une clé en trop. Une requête de contradiction ne contient presque jamais « étude ». Et le journal de bord ne conserve pas la réponse brute, d'où un diagnostic vide.

## Correction

1. Normaliser au lieu de rejeter : accepter la réponse si elle contient les trois clés de passe (clés en trop ignorées ; tolérer un objet enveloppé `{ "requetes": { ... } }` ou des clés en casse différente). Pour chaque passe, garder les chaînes non vides de 600 caractères au plus, dédoublonnées, au plus 3. L'année n'est plus exigée dans le texte (le moteur gère la fraîcheur ; le filtre de date des sources reste dans les portes). Le mot « étude… » reste une **consigne** du prompt pour les passes `institutions` et `presse_editeurs`, pas un critère de rejet ; aucune contrainte de mot pour `contradiction`.
2. Si une passe n'a aucune requête exploitable après normalisation : la construire à partir de la requête du sujet (passe institutions : `<requete> étude <année>` ; presse : `<requete> enquête <année>` ; contradiction : `<requete> limites échecs <année>`), et consigner `requetes_reconstruites: true` pour cette passe.
3. Si `JSON.parse` échoue : une seule nouvelle demande avec le message d'erreur ; second échec → requêtes reconstruites comme au point 2 (pas d'échec du sujet pour ce motif).
4. Diagnostic : dans `journal-runs.jsonl`, conserver pour la préparation des requêtes les 800 premiers caractères de la réponse brute du modèle (`preparation_brute`), et les requêtes finalement utilisées par passe.

## Tests

- Réponse avec requêtes sans « étude » ni année → acceptée, passes appelées.
- Réponse enveloppée, clé en trop, passe vide → normalisée ou reconstruite, consignée.
- JSON invalide deux fois → requêtes reconstruites, recherche lancée.
- Ne modifie pas les tests existants, sauf ceux de la machine (`tests/journal-machine*`). Batterie : `npm ci --silent && npm run lint && npm run build -- --webpack && npm test`, entièrement verte.
