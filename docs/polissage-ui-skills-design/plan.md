# Plan — polissage UI du 12/11/2026

Source : [spec autorisée](../CODEX-SPEC-2026-11-12-polissage-ui-skills-design.md).
Le lancement explicite de Paul autorise son implémentation. Aucun commit, push,
déploiement, changement de dépendance ou appel `npx`.

## T1 — Établir la référence

Lire AGENTS, AI_CONTEXT, les CSS importés et leurs composants. Exécuter la batterie
avant modification ; conserver les empreintes de la spec préexistante et de llms.txt.
Contrôler les options Cal.com dans les instructions officielles et Context7.

## T2 — Verrouiller les contrats

Ajouter `design-md-truth.test.mjs` (variables définies par les feuilles effectivement
importées, aucun hex) et une garde sur les transitions. Ajouter à la batterie
navigateur existante les contrôles FR/EN : ligne unique à 1440×800, images de taille
inchangée sans chevauchement, mobile inchangé, cadre technologies, espacement du
chapeau, appui des contrôles. Deny-all réseau conservé.

## T3 — Corriger les détails servis

CSS accueil et PublicEvidence : les boîtes de logos totalisent 1081,56 px sans
espacement. À partir de 1101 px, retirer 8 px d'espace intérieur par boîte et utiliser
un intervalle de 4 px, tous deux issus de `--brand-s1`. Les images gardent exactement
leurs dimensions, y compris l'éclairage existant. Largeur totale : 1053,56 px.
Mobile et tablette inchangés.

Retirer le contour permanent du bandeau technologies sans ajouter de hauteur ;
conserver le contour de focus clavier. Ajouter `--brand-s2` avant les métadonnées
d'article. Compléter les états d'appui manquants, sans nouvelle animation ni palette.
En mouvement réduit, annuler les transitions plutôt que laisser `all` implicite à 1 ms.
Cal.com reste inchangé si aucune option 24 h documentée n'est trouvée.

## T4 — Décrire le système servi

Créer DESIGN.md en français, avec sources pour chaque entrée ; signaler les deux
documents historiques sans supprimer leur contenu ; ajouter le lien dans AGENTS.
Le Brand OS et les décisions datées gardent leur préséance.

## T5 — Vérifier et rendre compte

Rejouer lint, build, tests, Brand OS, conformité marque ; recenser les tests navigateur
pour l'hôte. Relecture indépendante selon le harnais du dépôt. Maximum trois passes
de correction, arrêt après deux échecs identiques d'environnement. Documenter les
limites sans annoncer de preuve navigateur ou production absente.

Périmètre d'écriture : ce worktree uniquement, fichiers source/docs/tests ; changements
réversibles par patch inverse, aucune donnée externe ni ligne métier affectée.
Sauvegarde de référence : HEAD d7da52b et empreintes sous /tmp ; spec non suivie conservée.
