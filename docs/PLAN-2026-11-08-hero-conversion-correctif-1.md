# Plan — Hero de conversion, correctif 1

Source autorisée : `docs/CODEX-SPEC-2026-11-08-hero-conversion.md`, correctif 1.
Lancement : demande explicite d'implémentation intégrale, sans commit/push/déploiement.
Baseline : dépôt courant demandé, `HEAD=16013d4` ; seul changement préexistant :
la spec amendée, sauvegardée et contrôlée par SHA256 hors dépôt.

## Périmètre et sécurité

TARGET_SYSTEM : site local ; ENVIRONMENT : worktree de handoff.
WRITE_SCOPE : CSS du hero, tests et documentation. Aucune donnée métier.
REVERSIBLE : oui, diff par rapport à HEAD ; BACKUP : patch initial et SHA256
sous `/tmp/hero-correction-16013d4` ; EXPECTED_ROWS : 0.
ROLLBACK : retirer uniquement le diff de cette passe, préserver la spec locale.

## T1 — Établir la référence

Lire AGENTS, AI_CONTEXT, TRUTH, spec, code et contrats de tests. Installer par
`npm ci --silent`, exécuter lint/build Webpack/tests, capturer le SSR FR/EN et
tenter serveur et navigateur. Ne pas confondre erreur système et défaut du site.

## T2 — Verrouiller le correctif

Étendre `tests/single-page.spec.ts` : 1440×900 en plus des tailles existantes,
FR/EN, JS actif/inactif, mouvement normal/réduit. Mesurer simultanément bords
barre/hero/références (±1 px), padding ≤64 px, vides haut/bas ≤80 px, écarts
visuels des logos (±2 px) et hauteur optique commune. Conserver les plafonds de
hauteur existants, les espacements internes, le mobile, le CLS et le deny-all.

## T3 — Corriger le CSS ciblé

Réutiliser le `.wrap` canonique de 1160 px avec 40 px internes : contenu entre
180 et 1260 px à 1440. Supprimer la hauteur forcée et son centrage dans le
viewport ; conserver le rythme compact en jetons. Passer les logos en flex,
largeurs intrinsèques et hauteur commune ; compenser les marges transparentes
verticales du SVG SNCF. Conserver la grille mobile 2×2, les fichiers et permissions.
Alternative écartée : nouvelle largeur locale ou colonnes de logos égales,
contraires au correctif. Aucun changement de texte ni de taille typographique.

## T4 — Vérifier et documenter

Rejouer exactement lint/build/tests, types, Brand OS, audits marque/claims,
batterie réseau si possible. Comparer SSR complet avant/après ; revue adverse
indépendante en lecture seule selon le harness du dépôt. Mettre AGENTS/TRUTH,
AI_CONTEXT et le compte rendu à jour, conserver la spec et les PNG préexistants.

Boucle : référence → candidat → revue → correction éventuelle → vérification.
Maximum deux passes correctives ; arrêt des tentatives système après confirmation
du même refus. Aucune API LLM payante, aucune publication.
PRODUCTION_PROOF attendu après publication hors mandat : rendu réellement
observé aux dimensions demandées ; aucune hausse de conversion revendiquée.
