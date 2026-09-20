# Recomposition de l'en-tête et schéma Systems

Implémentation de la spec du 20/09/2026, sections 1a à 1d et 2, sur la branche `codex/header-recompose-systems-diagram`, base `3830a4b4fc7074a99431262793b2261bd5dee42e`.

## Changements

- En-tête fixe conservé, contenu aligné sur la grille 1160 px, hauteur 64 px et décalages associés mis à jour. Les quatre espacements de 52 px indépendants restent inchangés.
- Navigation Journal et Systems/Systèmes ; un seul CTA commission par présentation desktop/mobile. Suppression des styles du lien prototype retiré.
- Composant et CSS du schéma repris directement des extraits : deux sources, contrôle, décision, deux flèches, copy FR/EN intact.
- Tests adaptés strictement au nouveau contrat ; ajout du lien Systems sur les accueils EN et FR.
- Suppression des tirets cadratins préexistants dans les commentaires CSS pour obtenir zéro occurrence dans les trois fichiers vérifiés.

Adaptation : `height: 64px` reste explicite sur `.cmdbar` afin que sa bordure ne porte pas la hauteur externe à 65 px avec un enfant de 64 px. Le gap mobile existant porte désormais sur `.cmdbar-inner`.

## Vérifications

Baseline : TypeScript et contrôle de marque passent avant modification. Candidat : lint complet, TypeScript, contrôle de marque et `git diff --check` passent.

Les quatre commandes suivantes ont été exécutées, chacune sans sortie (code grep 1, aucune correspondance) :

```sh
grep -n "—" src/system/components/RevHeader.tsx src/system/components/MechanismSchema.tsx src/app/'(rev01)'/rev01.css
grep -n "mechanism-schema\b" src/app/'(rev01)'/rev01.css src/app/'(rev01)'/systems/page.tsx tests/systems.spec.ts
grep -n 'cmd-nav-prototype\|Commande"\|Votre prototype\|"Commission"' src/system/components/RevHeader.tsx
grep -rn "cmd-nav-prototype\|#prototype" tests/*.spec.ts
```

La section finale de la spec comporte trois grep ; le quatrième est celui du §1d.

`npm run build && npm run qa:brand:rev01` lancé : build sans progression observable après `Creating an optimized production build`, interrompu (130). Le contrôle de marque a été lancé séparément et passe.

`npx next start -p 3210` échoue : `listen EPERM`, port interdit dans le sandbox. `npm run qa:network:rev01` exécuté : 76 échecs, dont lancement Chromium refusé par macOS (`bootstrap_check_in`, `Permission denied (1100)`) et serveur local inaccessible. Ce résultat ne valide pas le comportement produit. Aucune assertion assouplie pour contourner ces blocages.

## Distinctivité et preuve restante

Question de la spec : « en changeant seulement le nom et le logo, ce schéma serait-il publiable pour une autre agence ? »

À la lecture du composant, les détails propres au cas restent dans les paragraphes visibles : onze outils, synchronisation toutes les 15 minutes, 114 fiches et dates des 13/11/14 septembre. La structure représente les sources, le contrôle et la décision dans l'ordre prescrit. Le rendu navigateur et la distinctivité visuelle ne sont pas validés : build, batterie et inspection des captures doivent être terminés hors sandbox. Aucun déploiement réalisé.
