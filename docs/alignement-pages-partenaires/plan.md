# Plan : alignement des pages et partenaires

Date : 21/11/2026. Mandat : implémentation intégrale de la spec validée
`docs/CODEX-SPEC-2026-11-21-alignement-pages-partenaires.md`.

1. Relever l'état Git, installer les dépendances verrouillées, compiler et
   exécuter la suite de référence. Préserver la spec non suivie.
2. Remplacer les quatre dictionnaires et le gabarit thèmes par cases, steps,
   deliverables, rules et FAQ. Supprimer le cas particulier intégration.
   Vérifier les textes exacts, les ancres, la date et le JSON-LD partagé.
3. Aligner rendez-vous, accueil, légende, ordre et liens. Le bouton contact
   cible et focalise reservation avec rdv-contact ; conserver les autres CTA.
4. Regrouper le pied depuis JOURNAL_THEMES ; appliquer les styles à partir
   des jetons existants, sans modifier les seuils de géométrie.
5. Ajouter les tests de densité et de rendu ; adapter les contrats explicitement
   remplacés, ajouter les parcours calendrier/navigation avec blocage réseau.
6. Régénérer llms, aligner les consignes, lancer lint, build Webpack, npm test,
   audits marque/claims et Brand OS. Tenter les preuves navigateur locales.
7. Faire relire le diff indépendamment, corriger les défauts puis rejouer les
   vérifications affectées. Écrire le rapport et les limites constatées.

Périmètre d'écriture : fichiers locaux du site, tests et documentation de ce lot.
Environnement : worktree local ; aucune donnée métier, aucun service distant.
Réversible : diff Git, base e43ecd5 ; aucun commit, push ou déploiement.
Sauvegarde : base Git, empreinte de la spec préexistante ; aucune ligne DB.
Boucle bornée : trois passes correctives maximum ; arrêter une même erreur
infrastructure reproduite deux fois, conserver sa preuve dans le rapport.
Preuve attendue : rendu des huit thèmes FR/EN, accueil/ancres/menu et focus
calendrier en navigateur local ; aucune preuve production sans déploiement.
