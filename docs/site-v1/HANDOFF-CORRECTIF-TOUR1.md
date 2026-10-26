# Correctif du tour 1 (PR #334), 27/10/2026, nuit

Tu travailles dans ce dossier, déjà positionné sur le commit `41cc437` (tour 1). Ne change pas de branche, ne fais ni commit ni push : Claude s'en charge après relecture.

La suite navigateur complète rejouée par Claude sur l'hôte donne 443 réussis, 46 échecs. Journal complet : `/private/tmp/claude-501/-Users-paullarmaraud/b2420e7f-18c7-4612-878e-b13d9a2a28d0/scratchpad/loop/tour1-echecs.log` (lis-le en entier avant de commencer). Corrige le **code** pour les vrais défauts ; n'adapte un test que dans les deux cas listés en §2.

## 1. Vrais défauts à corriger dans le code (les tests restent tels quels)

1. `tests/tour1-coherence.spec.ts` (ton propre test) : « unequal action heights », « mixed mobile widths » et les autres entrées listées : rends les boutons conformes à la règle du tour 1 (même hauteur côte à côte ; sous 600 px, pleine largeur pour tous les boutons d'un groupe ou pour aucun).
2. `tests/aeration.spec.ts` : contrôles neutres sous 3:1 sur `/engineering-integration` (onglets inactifs, contour mesuré 1,565:1). Le contour de l'onglet inactif doit atteindre au moins 3:1 contre son fond, avec un jeton existant du registre.
3. `tests/doctrine-visible.spec.ts` : « un seul éclat rose par écran ». Le bouton de barre `cmd-cta` est devenu rose partout et partage l'écran avec l'accent de la scène produit. L'unification du bouton de barre se fait dans l'autre sens : **un seul style non rose** sur toutes les pages (celui de l'accueil avant le tour 1).
4. `tests/systems.spec.ts` : `#faq h3` attendu 4, reçu 0. Le composant FAQ unique doit garder la question comme titre (`h3` dans le `summary`, ou structure équivalente que le test accepte sans être modifié).
5. `tests/design-harmonisation.spec.ts` : `.systems-hero h1` graisse 500 attendue, 400 reçue. La recette unique de H1 doit utiliser la graisse 500 (`--ed`, règle Brand OS) sur toutes les pages.
6. `tests/conformity-home.spec.ts` : la section de clôture de l'accueil doit garder l'identifiant `H12` (le composant `FinalCall` reçoit l'identifiant de la section qui l'emploie).
7. `tests/audit-readability.spec.ts` et l'échec `aeration` restant (1440 et 390 px) : lis leur cause exacte dans le journal et corrige le rendu ; si la cause est la couleur du lien `.build-with-you-next-link`, garde la couleur que le test exige (texte clair sur fond sombre) : le style de lien unique s'applique aux liens de texte courant, pas à ce lien d'action.

8. **Rétablir une décision de Paul** : le bouton principal du haut de l'accueil reste « Parlons de votre transformation » / « Let's talk about your transformation » (règle CTA du 26/10 dans `AGENTS.md`, décision de Paul). La règle « Parler d'un projet » vaut pour tous les **autres** boutons vers `/commission`. Corriger le libellé du hero et la ligne « CTA (26/10/2026) » d'`AGENTS.md` (« hero « Parlons de votre transformation » »), et adapter le contrôle du tour 1 pour qu'il admette cette seule exception, sur le seul bouton principal du haut de l'accueil.

## 2. Seules adaptations de test autorisées

- `tests/alignment-grid.spec.ts` : la vérification du `main footer.rev-footer` porte sur une ligne de registre retirée par décision de Paul (mode accessible) ; remplacer cet ancrage par le pied de page du site (même vérification d'alignement sur la grille).
- Aucune autre modification de test. Si un autre test te semble devoir changer, ne le change pas : écris pourquoi dans le rapport.

## Critères

`npm run lint`, `npm test`, `npm run build`, `npm run qa:brand:rev01`, `npm run qa:claims:rev01`, `npm run test:brand-os` verts. Ajoute une section « Correctif » à `docs/site-v1/RAPPORT-TOUR1-COHERENCE.md` avec, pour chacun des 46 échecs, la cause et la correction. Claude rejoue la suite navigateur.
