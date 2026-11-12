# Plan — robustesse des délais du Journal

Spec autorisée par la demande du 12/11/2026 :
`docs/CODEX-SPEC-2026-11-12-journal-robustesse-delais.md`.
Référence locale demandée : `8785098e452d963d5ff76c1ae00493cea76dd1c4`.

1. Capturer la référence machine, puis ajouter les régressions déterministes
   sur corps avortés, PDF, taille et rejet tardif. Corriger la gestion du délai
   et conserver seulement des résultats lus dans le cache ; attendre les lots
   par `Promise.allSettled`. Terminé quand les autres sources survivent aux erreurs.
2. Ajouter les délais par rôle et un seul retry technique après 5 secondes.
   Tester corps JSON, 429/5xx, non-retry, compteurs et sujet suivant.
   Ne changer ni portes, ni budget, ni nombre de passes éditoriales.
3. Protéger l'entrée CLI et les rejets non traités avec un diagnostic crash
   expurgé, contexte étape/sujet, sauvegarde état seule et sortie 1.
   Tester sauvegarde simulée, idempotence, arrêt du travail et reprise des logs.
4. Revue adverse indépendante, corrections ciblées, puis deux batteries
   consécutives : npm ci --silent, lint, build --webpack, npm test.
   Compléter AI_CONTEXT et le rapport avec résultats et limites.

Écritures : uniquement ce worktree local, scripts machine, tests machine et
documentation. Réversibles par diff, état initial Git propre hors spec non suivie
(SHA256 f0d6a49a3ce55e773366e661181a701703c7934b7c1aea9f6ea593f0d3d66880).
Aucune donnée distante, publication, commit, push ou déploiement.
Maximum trois passes de correction ; même blocage répété deux fois : diagnostic.
Preuve production attendue après livraison : un run réel survit à une source lente,
et un crash laisse son diagnostic sur journal/etat. Non exécutée dans ce mandat.
