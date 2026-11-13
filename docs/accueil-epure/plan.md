# Plan d’implémentation, 13/11/2026

Mandat : implémenter la spec CODEX-SPEC-2026-11-13-accueil-epure.md.
Base locale et origin/main : e707430 (#383). Installation exacte, lint,
build Webpack et 675 tests Node verts avant modification.

1. Registre FR/EN des 17 objectifs et des 48 nœuds ; sélection partagée,
   schéma serveur, résultat et attribution via avecSource, formulaire GET.
2. Intégration des moteurs, mesures sourcées et liens assistants ; conserver
   terrain, métiers, parcours, technologies, équipe, FAQ et contact.
3. Épure depuis les jetons existants ; documentation DESIGN et contexte.
4. Tests de contrat SSR et navigateur ; remplacement justifié des seules
   attentes de sections remplacées, sans abaisser de seuil.
5. Revue indépendante, au plus deux tours correctifs, deux batteries complètes.

Écritures : worktree local uniquement ; réversibles par diff, base Git comme
sauvegarde des fichiers suivis. Spec non suivie préexistante préservée par SHA256.
Aucune écriture distante, ligne métier, commit, push ou déploiement.
Preuve de production non attendue dans ce mandat ; captures et mesures
Playwright confiées à Claude sur l’hôte selon la spec.
