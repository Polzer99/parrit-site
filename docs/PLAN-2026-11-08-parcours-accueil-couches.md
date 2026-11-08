# Plan d’exécution — parcours de l’accueil

Source : `CODEX-SPEC-2026-11-08-parcours-accueil-couches.md`, décision de Paul du
08/11/2026, implémentation explicitement demandée. Baseline : `f335989`, fusion
de la PR #365, checkout courant demandé par Paul. Spec non suivie conservée.

1. Capturer lint, build Webpack et tests Node avant modification. Ajouter les
   contrats FR/EN d’ordre, navigation, offres, FAQ et derniers articles.
2. Extraire la carte Journal partagée, conserver son rendu d’index et charger
   les trois dernières entrées côté serveur. Ajouter offres et FAQ localisées,
   JSON-LD dérivé des mêmes paires question/réponse, sans dépendance nouvelle.
3. Réordonner l’accueil, déplacer la définition, retirer le doublon, adapter
   navigation et anciennes ancres. Conserver hero, parcours, services, preuves,
   outils, partenaires et contact. Adapter seulement les contrats devenus caducs.
4. Vérifier les liens et l’attribution, les accordéons natifs avec/sans JS,
   les cartes et la géométrie aux tailles existantes. Rejouer lint/build/tests,
   marque/claims, Brand OS et batterie navigateur avec deny-all.
5. Revue indépendante en lecture seule, corrections ciblées et rapport des
   résultats. Aucun commit, push ou déploiement.

Écritures : dépôt local uniquement ; code, styles, tests et documentation.
Réversibles par diff sur `f335989` ; sauvegarde Git et HTML de référence dans
`/tmp/parcours-before-{fr,en}.html`. Aucune donnée métier, zéro ligne distante.
Boucle bornée : une implémentation, une revue indépendante, au plus deux passes
de correction. Arrêt des relances si un même blocage d’environnement persiste.
Preuve attendue : rendu SSR + interactions navigateur FR/EN, géométrie inchangée,
FAQ visible égale au JSON-LD et articles égaux au Journal. Production hors mandat.
