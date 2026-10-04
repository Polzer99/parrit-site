# Captures des arbitrages du 05/10/2026

Les 18 captures n'ont pas pu être produites dans le sandbox : Chromium échoue au
lancement (`bootstrap_check_in ... Permission denied (1100)`). Aucune capture de
production ni image de remplacement n'est présentée comme preuve du candidat.

Après un build réussi, sur l'hôte autorisant serveur et navigateur :

```sh
npm run start -- -p 3210
```

Dans un second terminal :

```sh
npx playwright test tests/arbitrages.spec.ts --browser=chromium --workers=1
npm run qa:network:rev01
```

`tests/arbitrages.spec.ts` écrit ici les captures complètes `home`, `fr`,
`build-with-you`, `fr-build-with-you`, `legal`, `fr-legal`, chacune à
375, 768 et 1440 px (hauteur de fenêtre 900 px). Il mesure aussi les mots par
ligne du H1 après chargement des polices, la disposition du portrait, ses
alternatives FR/EN et les empreintes des quatre fichiers réellement servis.
Toutes les navigations utilisent le deny-all réseau partagé ; aucun formulaire
n'est envoyé. Le contrôle visuel humain des captures reste nécessaire.
