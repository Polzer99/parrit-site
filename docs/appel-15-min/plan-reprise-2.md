# Seconde reprise du lot A, 08/11/2026

Mandat : `REPRISE-SUR-MAIN-2.md`, spec et plan du lot A déjà validés.
Base explicitement demandée : checkout `4490653a19892776d7a36260075850dcd68ca545`
(fusion #367). Référence : diff `f124fae86..faee226`, hors `.codex-handoffs`.

1. Lire les instructions, le diff, les guides Next et le SDK Cal installés.
2. Installer avec npm ci ; relever lint, build Webpack et tests avant changement.
3. Rejouer les fichiers compatibles ; intégrer les ajouts aux fichiers qui ont
   évolué, en conservant tous les contrôles et comportements de main.
4. Rejouer les mêmes vérifications, les tests Brand OS et les contrôles de types.
   Comparer le rendu SSR de l'accueil FR/EN avant et après avec la même attribution.
5. Une revue indépendante en lecture seule, une correction consolidée au plus,
   puis rapport. Suite navigateur complète et captures à rejouer par Claude sur
   l'hôte, conformément à la spec. Aucune preuve Cal.com réelle revendiquée.

Écritures : dépôt local uniquement, sources/tests/documents du lot A et rapport.
Réversibles : retrait du seul diff ajouté ; sauvegarde par HEAD. Seul fichier
préexistant non suivi : `REPRISE-SUR-MAIN-2.md`, conservé par SHA256
`4e25cf86ad6008e16427e7bd06e54db7daccb3924a7dc53afce1a86dd26cd08a`.
Aucune donnée métier (0 ligne), aucun secret, aucun service client modifié.
Aucun commit, push, déploiement ni écriture dans `.codex-handoffs/`.

Faits établis : les cinq cibles de réservation du registre sont inchangées entre
la base de référence et main ; seule la fonction `avecSource` a évolué. Garder
cette version de main, qui traite correctement les ancres et les sources déjà
présentes. Les boutons `intention-*` de l'accueil restent au contact. Le registre
des thèmes partagé de main remplace l'ancien registre local : le conserver et
ne remplacer que le bloc final du thème. Aucun arbitrage produit supplémentaire.
