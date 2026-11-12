# Plan d'exécution, 12 novembre 2026

Spec approuvée par l'ordre d'implémentation : ../CODEX-SPEC-2026-11-12-machine-articles-quotidienne.md.
Référence demandée : checkout d7da52bf03b5c51527f5a57b244fd1c353d7a24b.
Seul changement préexistant : la spec non suivie (SHA256 eef7dc632ce5a4d03778ee895f2b83b7b50ca805d515132ab6bdc678fd023f03).

1. Capturer installation, lint/build/tests de référence. Lire contrats et API actuelles.
2. Ajouter file de 36 sujets, enrichissement CLI et portes déterministes réutilisant les portes existantes; tester chaque refus et sources HTTP simulées.
3. Ajouter générateur injectable, budget cumulatif, annotations, rédaction/adaptation, une réécriture, deux sujets maximum, état et journal persistants; dry-run isolé sans réseau/git.
4. Étendre seulement les champs optionnels et le rendu des nouveaux articles; registre complémentaire sous content/plan pour permettre des PR contenu seul.
5. Ajouter orchestration GitHub désarmée, PR à diff limité, contrôles dans le job, preuve titre+sitemap, IndexNow et incidents dédupliqués.
6. Rejouer vérifications, revue adverse indépendante, corriger puis rapport avec limites exactes.

Écriture : dépôt local de développement uniquement; nouveaux scripts/tests/plan/workflow et adaptations gabarit/documentation. Réversible par diff; aucun original MDX, test existant, ci.yml ou hermes-weekly.yml modifié. Aucun commit/push/déploiement pendant cette session. Aucun appel LLM payant.

Boucle bornée : un passage de réalisation puis deux passes correctives ciblées; arrêt sur blocage d'environnement répété et constat explicite, sans affaiblir les contrôles. Preuve de production implémentée mais non exécutée (déploiement exclu du mandat).

## Correctif 1 — calibre presse

Mandat explicite du 12/11 : appliquer C1.1–C1.6, sans nouveau départ, commit ou push.
La spec amendée fournie par Paul vaut cadrage approuvé ; pas de variante de produit.
1. Capturer la référence : 92 tests machine, empreintes tests/articles, diff en /tmp.
2. Ajouter registres de titres seuls et domaines refusés ; écarter 23/33 et appliquer Jaccard 0,4 à l'ajout, la sélection et au titre final.
3. Remplacer le contrat de structure et vérifier le matériau primaire daté, les citations exactes et les nombres contre les pages ouvertes.
4. Deux appels d'écriture bilingues : rédaction puis secrétariat, même GLM-5.2 (0,5 / 0,2), sans réécriture supplémentaire ; juge à trois questions, plafond 0,80, thèse journalisée.
5. Adapter le rendu des seuls nouveaux articles : Sources datées, signature, une ligne de réservation ; FAQ seulement JSON-LD.
6. Adapter exclusivement les tests/fixtures créés dans ce chantier, ajouter C1.6 et cas adverses ; rejouer référence, lint, build et batterie disponible, rapport.

TARGET_SYSTEM=worktree demandé ; ENVIRONMENT=local ; WRITE_SCOPE=machine Journal,
gabarit nouveau, registres, propres tests et documentation ; REVERSIBLE=oui ;
ROLLBACK=diff et sauvegardes /tmp/journal-c1-baseline ; EXPECTED_ROWS=36 sujets,
dont deux écarts imposés ; aucun article historique modifié. Limite : deux passes
correctives ciblées, aucun appel payant, production non exécutée.
