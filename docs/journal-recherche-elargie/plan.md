# Plan du 12/11/2026

Spec autorisée : `docs/CODEX-SPEC-2026-11-12-journal-recherche-elargie.md`.
Référence locale demandée : `7726aa3`. Seul changement initial : la spec non suivie.

1. Capturer la baseline après `npm ci --silent`, puis ajouter des tests machine
   hors réseau pour les trois passes, les diagnostics et la reprise d'état.
2. Externaliser les domaines dans `content/plan/sources-primaires.json`.
   Préparer 2–3 requêtes concrètes par passe avec le modèle de recherche, puis
   lancer trois appels web Exa (10 résultats). Une préparation sans web est
   nécessaire : Exa s'exécute avant la réponse du modèle et `search_prompt`
   configure l'injection des résultats, pas une API de requêtes explicites.
   Compter tous les appels dans le budget inchangé de 0,80 USD.
3. Fusionner les annotations par URL sans UTM/fragment ; vérifier les pages et
   conserver les seuils 3 sources / 4 faits. Journaliser uniquement les requêtes
   transmises à OpenRouter, URL, titres, motifs et compteurs, jamais les extraits.
   Un seul repli sans engine si l'API refuse include_domains avec Exa.
4. Sauvegarder les runs sans article sur `journal/etat`, sans PR ni écriture main,
   y compris en mode armé. Restaurer uniquement un état plus récent que main,
   conserver les nouveaux sujets et les statuts terminaux de main.
5. Revue indépendante en lecture seule, corrections ciblées, dry-run fixtures,
   puis `npm ci --silent`, lint, build Webpack et suite Node complète.

Écritures : dépôt local uniquement, scripts machine, listes JSON, tests machine,
documentation. Réversibles par diff, aucun état réel ni article modifié.
Pas de commit, push ou déploiement. Tests GitHub/OpenRouter entièrement simulés.
Boucle bornée : deux passes de correction par défaut ; même blocage externe
répété deux fois = documenter. Preuve de production attendue après livraison :
run réel avec diagnostics et reprise des essais, hors du mandat de cette session.
