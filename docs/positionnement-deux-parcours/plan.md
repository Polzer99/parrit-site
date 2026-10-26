# Plan d'exécution, 25/10/2026

Source : `docs/handoffs/2026-10-25-positionnement-deux-parcours.md`, révision 4.
Exécution autorisée par la demande explicite de Paul. Aucun commit, push ou déploiement.

1. Conserver les modifications du premier passage ; compléter les deux dictionnaires
   avec Laparra et vérifier la présentation mobile de cette entrée plus longue.
2. Créer la liste canonique des clients publiables, partager le contrôle avec les gates
   existantes et vérifier par mutation qu'un nom non autorisé dans le DICT est rejeté.
3. Remplacer les assertions de copie par des contrôles de présence, de cardinalité,
   de destination et de cohérence. Conserver les interdictions, faits, mesures,
   protections réseau et contrôles d'accessibilité. Consigner chaque remplacement.
4. Aligner uniquement les passages contradictoires des documents de référence sur
   les décisions datées de la révision 2 ; CLAUDE.md importe déjà AGENTS.md.
5. Exécuter lint, tests unitaires/SSR, Brand OS, claims, build, marque et Playwright.
   Ne pas démarrer de serveur manuellement. Rapporter les limites de l'environnement.
6. Relire le diff et livrer le rapport avec fichiers, assertions, résultats et blocages.

Complément R3 autorisé par le handoff : identifier les notices de langue par
`data-language-note`, vérifier FR/EN avec et sans badge de certificat, puis relire
chaque substitution R2 pour rattacher les contrôles au contenu concerné (statut,
ligne de registre, confidentialité et accessibilité). Conserver les captures
existantes et laisser la batterie externe gérer le serveur.

Complément R4 autorisé par la demande d'implémentation intégrale :
1. Étendre la liste publique aux cinq noms et reconnaître Clevery Avocats ; séparer
   le contrôle des pages de celui du Journal, où tous les clients restent interdits.
2. Remplacer les références de l'accueil par une liste structurée responsive,
   appliquer les textes R4, aligner parcours et harmoniser son h2 avec maison.
3. Corriger dossiers, JSON-LD et le générateur llms, puis régénérer llms.txt.
4. Renforcer les contrôles clients (mutations incluses), positionnement servi et
   géométrie ; adapter les sélecteurs à la liste sémantique sans perdre de contrôle.
5. Aligner les règles clients, exécuter la batterie prescrite et consigner les
   résultats effectifs. Conserver intacte la modification préexistante du handoff.
