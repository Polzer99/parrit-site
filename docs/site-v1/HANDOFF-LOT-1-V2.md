# Handoff Codex — site V1, lot 1, version 2 (corrections après revue, 26/10/2026)

Writer : Codex · Superviseur : Claude · Décideur : Paul. Repart du commit 3052fce (PR #323). **Aucune fusion ni mise en ligne sans validation de Paul.**
Lire d'abord `docs/site-v1/HANDOFF-LOT-1.md` et `docs/site-v1/ETAPE-1-PLAN.md` : tout ce qui y est demandé reste dû.

## A. Échecs Playwright constatés sur l'hôte (le bac à sable ne lance pas Chromium)
Résultat hôte : 392 réussis, 4 échoués.
1. `tests/aeration.spec.ts:114` (1440 et 390) : « neutral controls below 3:1 must not grow beyond the frozen debt list » sur `/`, `/fr`, `/engineering-integration`, `/fr/engineering-integration` (3 à 5 nouveaux contrôles). Corriger les contrôles (onglets de `IntegrationBuildSwitcher`, boutons secondaires, liens bordés) pour qu'ils atteignent 3:1 avec les jetons existants. **Ne pas agrandir la liste de dette figée.**
2. `tests/metadata-integrity.spec.ts:64` : titres partagés FR/EN pour `ai-sprints` et `harness-engineering`. Donner des titres uniques par langue : FR « AI Sprints : un problème, un système testable · Parrit.ai » et « Harness Engineering : des agents fiables en production · Parrit.ai » ; EN « AI Sprints: one problem, a testable system · Parrit.ai » et « Harness Engineering: reliable agents in production · Parrit.ai ».
3. `tests/doctrine-visible.spec.ts:94` (en / 390) : échec `toHaveClass` sur l'espacement de l'accent rose décoratif. Trouver la cause dans le nouveau rendu et la corriger dans le composant, pas dans le test.

## B. Revue adverse
4. **Date de revue des preuves** (`src/lib/registry/preuves.ts:293,305`) : la date `2027-01-26` retire silencieusement H02 et H04 en production le 27/01/2027 et fait échouer des tests sans rapport. Faire de la date de revue un avertissement de CI (test qui échoue 30 jours avant l'échéance avec un message clair), jamais un retrait en production ; injecter `today` dans les tests ; une section dont la liste est vide disparaît avec son titre.
5. **`llms.txt`** (`scripts/generate-llms.mjs:33,42,54`) : retirer « intelligent systems for operations », « The system belongs to you », « built remotely inside the client's own infrastructure », « one critical operation rebuilt end-to-end into production » ; reprendre la phrase fondatrice et les trois portes du plan.
6. **`TRUTH.md`** : ne retirer du tableau des capacités que la ligne Content Factory, restaurer les autres lignes et leurs garde-fous (« aucun envoi sans validation humaine », « aucune revendication de conformité sans audit »), et mettre à jour la phrase de positionnement selon le plan.
7. **Menu déroulant ordinateur** (`RevHeader.tsx:35`) : le refermer au clic sur un lien, au changement de route, à Échap et au clic extérieur.
8. **Noms de clients** : ajouter une assertion que tout identifiant client de `SITE_EVIDENCE` et de `CaseStudyCard` appartient à `PUBLIC_CLIENT_NAMES`, et lancer le contrôle des noms privés sur le HTML rendu de chaque page.
9. **Libellé « Réserver l'examen »** : le remplacer par « Parler d'un projet » / « Talk about a project » sur /dossiers, /standard, /manufacture, /systems et /sketch (destination inchangée). Ne pas toucher à /build-with-you.
10. `CaseStudyCard` : recevoir l'identifiant de page en propriété au lieu de `"home"` en dur.
11. `IntegrationBuildSwitcher` : `aria-label` localisé.
12. Anglais : « tested on your real cases » → « a system that runs on your real cases » (sans promesse de test) ; « AI coaching » → « AI support for the teams ». FR H02 : séparateur « : » comme dans le plan.
13. Schéma du harnais : retirer les flèches entre les éléments de la grille ; les composants sont présentés comme un ensemble, pas comme une chaîne.
14. Tests : restaurer un contrôle textuel de l'identité du fondateur limité à `/legal` ; ajouter à 390 px un contrôle que les deux boutons du hero sont visibles sans défiler ; faire tourner le contrôle sans JavaScript de H06 sur `/`, `/fr`, `/engineering-integration` et `/fr/engineering-integration` ; `site-v1.spec.ts` ne doit écrire de PNG que si `SITE_V1_CAPTURE=1` (le script de capture le pose), jamais pendant `qa:network`.
15. `/fr/consulting-transformation?lang=en` : un seul saut 301.

## Ne pas faire (décisions de Paul en attente)
- Ne pas modifier « Vous restez propriétaire du système » (`standard/page.tsx:82`) ni `manufacture/page.tsx:16,65` : c'est une condition commerciale ; Paul tranche.
- Ne pas changer le comportement de la barre (dans le flux) : la contradiction avec « bouton visible après le hero » est soumise à Paul.
- Interdits du lot 1 inchangés.

## Contrôles
1. Batterie `npm ci --silent && npm run lint && npm test && npm run build` verte.
2. Claude rejoue sur l'hôte toute la suite Playwright : 0 échec.
3. Revue Claude du diff, puis aperçu Vercel soumis à Paul.
