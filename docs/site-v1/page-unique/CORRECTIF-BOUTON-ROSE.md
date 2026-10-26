# Correctif : bouton principal en rose franc (27/10/2026)

Constat de Claude sur la production après la PR #337 : le bouton « Parlons de votre transformation » du haut de page a un fond `rgb(250, 221, 218)` (`--brand-accessible-warm`, rose très clair) au lieu de `--brand-core-rose` (`#F08E85`) de la maquette validée. Paul avait déjà jugé ce bouton « un peu petit, on n'arrive pas bien à le lire » : l'éclaircir lui fait perdre son rôle d'éclat unique.

À faire :
1. Le bouton principal (`exec`) du haut de page et celui de la section fondateur ont le fond `--brand-core-rose` (via le jeton d'action du registre sombre), texte encre, comme dans `MAQUETTE-VALIDEE.html`.
2. Respecter « un seul éclat rose par écran » en retirant le rose des **autres** éléments s'il en reste dans le même écran (le bouton est l'éclat). Ne pas toucher au test `doctrine-visible` ni au test `single-page` ; si l'un d'eux échoue, corriger le rendu.
3. Ajouter à `tests/single-page.spec.ts` une assertion : le bouton principal du haut de page a la couleur calculée de `--brand-core-rose`, FR et EN.

Batterie : `npm run lint && npm test && (npm run build || npx next build --webpack) && npm run qa:brand:rev01 && npm run test:brand-os`. Ni commit, ni push.

## Reprise des six échecs navigateur

Source : journal hôte `cta-echecs.log` du scratchpad
`b2420e7f-18c7-4612-878e-b13d9a2a28d0`, 226 réussis / 6 échecs.

- Hero : fond rose franc et texte encre conservés ; bordure de 2 px via
  `--white` → `--brand-derived-white`. Contraste calculé contre le canard :
  5,768:1. La spécificité conserve cette bordure au survol et à l'appui.
- Contact : rose sur encre à 6,730:1 ; aucune bordure supplémentaire nécessaire.
- Les deux échecs d'aération viennent du message de validation devenu neutre.
  Retour au jeton `--accent-on-dark`, contraste sur encre à 6,730:1.
- Aucun test modifié dans cette reprise ; modifications antérieures conservées.

Limite du contrôle existant : `tests/brand-os.spec.ts` mesure `backgroundColor`
pour tout bouton opaque, même lorsque sa bordure est contrastée. Les quatre
assertions hero continueront donc à mesurer 2,448:1, sans tenir compte du
contour de 2 px. Aucun contournement du test dans le code.

Preuve navigateur candidate indisponible dans ce sandbox : écoute 3210 refusée
(`EPERM`) et Chromium refusé avant navigation (`bootstrap_check_in`, permission
denied). Le contraste ci-dessus est calculé depuis les jetons vendorisés ;
il ne remplace pas une mesure du rendu sur l'hôte.

Validation de la reprise : lint, 105/105 tests Node, build Webpack (52 pages),
conformité marque et 19/19 tests Brand OS réussis. Build Turbopack interrompu,
puis repli Webpack demandé. Empreintes des specs navigateur inchangées.
Aucun commit, push ni changement de branche.
