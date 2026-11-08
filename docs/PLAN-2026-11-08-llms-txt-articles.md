# Plan — llms.txt et articles, 08/11/2026

Spec autorisée par la demande d'implémentation intégrale :
`CODEX-SPEC-2026-11-08-llms-txt-articles.md`, conservée sans modification.
Source : checkout demandé, `4490653a19892776d7a36260075850dcd68ca545`.

1. Capturer lint/build/tests et le HTML SSR FR/EN avant modification.
2. Ajouter des tests Node comparant llms.txt au rendu réel (ordre, titres,
   six FAQ), au sitemap et au RSS (sélection, dates, métadonnées, thèmes).
   Exercer brouillons, dates futures et noindex avec des fichiers en mémoire.
3. Partager l'ordre et les titres existants de l'accueil dans home-layers.ts,
   consommés par les composants et le générateur, sans changement de HTML.
4. Extraire le lecteur Journal utilisable au prebuild sans serveur Next ;
   conserver la façade server-only et appliquer le filtre brouillon/date future
   à la source commune. Conserver l'exclusion noindex du sitemap/RSS.
5. Générer les FAQ et les 31 articles indexables actuels dans les deux langues,
   à partir des sources communes ; refuser les noms clients avant écriture.
6. Rejouer la batterie prescrite, types et contrôles Brand OS, comparer le SSR,
   faire relire indépendamment le candidat et documenter résultats/limites.

La règle ancienne interdisant toute durée dans llms.txt devra autoriser uniquement
la réponse FAQ exacte à 15 minutes, expressément demandée par la nouvelle spec.
Les autres contrôles restent applicables.

TARGET_SYSTEM : dépôt local. ENVIRONMENT : branche de handoff.
WRITE_SCOPE : sources concernées, tests, llms généré, plan/rapport/AI_CONTEXT.
REVERSIBLE : oui. ROLLBACK : retrait du seul diff de cette passe.
BACKUP : baseline Git et empreinte de la spec préexistante ; SSR dans /private/tmp.
EXPECTED_ROWS : zéro donnée métier. Aucun commit/push/déploiement.

Boucle bornée : trois passes au maximum, arrêt sur même blocage deux fois ;
aucun appel LLM produit ni service réel. Preuve locale attendue : égalité exacte
du HTML SSR avant/après et sortie générée conforme aux sources. PRODUCTION_PROOF :
non exécutée, publication réservée au script de l'utilisateur.
