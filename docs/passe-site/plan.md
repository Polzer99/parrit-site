# Passe site — plan d'exécution, 12/11/2026

Mandat : implémenter la spec `../CODEX-SPEC-2026-11-12-passe-site-seo-securite-coherence.md`, sans commit, push ni déploiement.

Base : HEAD et origin/main locaux à `8785098`. Seule modification initiale : spec non suivie, conservée par empreinte. PR #376 absente de l'historique local ; ne pas reprendre son polissage CSS.

## Sources et limites

Le layout et six pages appellent getLocale, qui lit headers/cookies : source code au 12/11, build de référence toutes ces routes en ƒ. Documentation Next installée 16.3.4 et Context7 16.3.6 : les lectures de requête rendent le rendu dynamique ; des racines distinctes peuvent partager leur composant.

Écriture limitée au worktree local ; réversible par diff, sauvegarde Git de la base ; aucune ligne de données métier, aucun secret, aucun effet externe. Trois passes maximum (implémentation, revue, correction), arrêt/documentation sur le même blocage environnemental répété. Preuve de production hors mandat ; preuve locale attendue : build et réponses HTTP.

## T1 — Baseline

Installer via npm ci ; build Webpack puis tests (les tests de rendu dépendent du build). Conserver les journaux hors dépôt. Lire les contrats de locale, navigation, articles, attribution et les docs Next.

## T2 — Langue portée par la route

Extraire les rendus partagés dans src/system/pages et créer les entrées FR explicites, avec layout FR distinct et langue constante. Supprimer la dépendance aux en-têtes dans le rendu. Conserver négociation 302, bots et redirections legacy. Pré-générer les articles et thèmes ; garder accueil dynamique pour son attribution SSR sans JS, réservation et esquisses dynamiques.

## T3 — Sécurité et redirections

Ajouter les cinq en-têtes globaux sans modifier HSTS ; security.txt à l'adresse publiée. Redirections formation en un saut vers offres. Tests de table, de réponses HTTP et d'OG.

## T4 — Journal et navigation

Ajouter Journal après Questions dans les deux navigations et son état actif. Conserver Contact si la géométrie le permet. Filtrer les listes FR par le registre de traductions, sans changer le lecteur historique. Ajouter signature/dates localisées et Person partagé avec l'accueil, sans changer l'appel de fin d'article. Réservation : ancre locale conservant source et UTM.

## T5 — Validation et rapport

Ajouter des tests de contrat, rendu compilé et navigateur avec réseau fermé. Rejouer npm ci, lint, build Webpack, npm test, marque, Brand OS. Revue indépendante selon le harnais du dépôt ; corriger les défauts constatés. Documenter les contradictions des anciennes assertions si leur adaptation reste interdite. Ne pas toucher aux PNG ; Playwright complet réservé à Claude sur l'hôte.
