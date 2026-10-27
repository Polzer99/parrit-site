# Passe 4 : livraison locale du 27/10/2026

Branche `feat/passe-4-page`, référence initiale `f473085`. Aucun push.

Le périmètre et le plan sont ceux autorisés par la spec : contenu bilingue et
animations, adaptation à un écran, tests de structure/comportement/géométrie,
contrôles, documentation puis commit unique. Cible : ce worktree local ; pas de
base de données ni de service client modifié. Modifications réversibles par
revert du commit ; référence Git initiale comme sauvegarde. Aucun secret ajouté.

Sources : spec datée du 27/10, code de la branche, `passe4.py` et `index.html`
de la maquette externe indiquée dans la spec. Seul `passe4.py` est recopié,
octet pour octet ; aucun film, HTML ou capture importé. Documentation Next.js
16.3.4 locale sur `use client`, documentation React sur le cycle de nettoyage
via Context7. Le rendu serveur compilé est testé sans socket et avec réseau interdit.

Implémentation :

- Douze services, quatre cas chacun, alternance back-office/nouveau. SSR et
  mouvement réduit : premier cas ; animation : une carte sur deux commence au
  deuxième, décalage de 290 ms, lecture 3,5 s puis transition 120 ms. Les quatre
  cas restent accessibles, sans annonces `aria-live`.
- Sept partenaires et vingt offres. Liste visible sans JS/en mouvement réduit,
  face canard pendant les séquences ; ancien surlignage retiré.
- Trajet client : sources élargies, cloud/serveurs/local, harnais et contrôles,
  propre application en tête. Toutes les icônes `/tools/` sont devenues inutiles
  et supprimées ; mention des propriétaires des marques conservée.
- Laparra : scène, référence et registre corrigés. Recherche dans `src/`,
  `content/` et le générateur llms : aucune autre association à corriger ; les
  usages génériques de CRM et les démonstrations privées restent inchangés.
- Six carrousels mobiles avec scroll-snap, points synchronisés, noms accessibles,
  focus et commandes gauche/droite/début/fin. Avance du trajet à 2,4 s seulement
  en mobile avec mouvement autorisé ; toucher, clavier, molette ou focus rendent
  définitivement le contrôle au lecteur. Écouteurs et minuteurs nettoyés.

## Écarts nécessaires et arbitrages

1. Le contrôle de claims interdit toute certification nouvelle non documentée.
   « Des formations certifiées / Certified training » devient « Des formations
   par métier / Training by role ». L’ancienne description autorisée de l’organisme
   certifié reste inchangée. Aucune exception ajoutée au contrôle.
2. Le filtre anti-slop interdit `à partir de`, y compris dans `à partir des`.
   Deux cas FR deviennent « Évalue un nouveau fournisseur avec des sources
   publiques. » et « Répond aux opérateurs avec les notices techniques. ».
   Le sens et les traductions EN restent ceux de la spec. Filtre inchangé.
3. Le contrôle d’aération impose 16 px et une échelle fermée : tous les petits
   textes sont donc à 16 px, y compris puces et téléphones, au lieu des 15 px
   permis par la maquette. La seule adaptation du contrôle d’aération porte sur
   le H1 de l’accueil sur ordinateur : 88 px explicitement exigés par §5, alors
   que la branche initiale rendait 84 px. Les autres pages et le plancher 16 px
   restent contrôlés à l’identique.
4. Partenaires : 3 × 2,2 s + 2 × 150 ms = 6,9 s ; deux départs à 3,4 s font
   6,8 s. Pour conserver la cadence et ne jamais ouvrir trois cartes, la plus
   ancienne se referme avant la troisième ouverture. Sa dernière offre dure
   donc 2,1 s dans ce cas ; toutes les offres sont montrées. Ce conflit de
   timing est présent dans le script de maquette ; il n’est pas reproduit.
5. Le hero occupe la largeur disponible ; sous le H1, texte/bouton et figure
   sont côte à côte sur ordinateur. La hauteur du SVG dépend du viewport ;
   ses libellés sont agrandis, les résultats longs ont deux lignes, et les
   noms des couches sont éloignés des nœuds. Sur téléphone, la figure complète
   se parcourt horizontalement pour garder ses caractères lisibles.
6. Les téléphones sont resserrés sans retirer de message. Les listes d’offres
   statiques demandent des marges internes partenaires plus petites que la
   maquette animée. Le bandeau de logos reste sur une ligne accessible au
   clavier, même sans mouvement, pour éviter son empilement. La photo reste
   entière, à 38 % à côté de l’identité sur mobile, avec les détails dessous.

## Validation

| Contrôle | Résultat |
|---|---|
| `npm ci` | Réussi, lockfile inchangé |
| Build Webpack de référence + `npm test` | Réussis, 109/109 tests |
| `npm run lint` | Réussi |
| `npm run build -- --webpack` | Réussi, 52 pages |
| `npm test` | 113/113 réussis |
| `npm run qa:brand:rev01` | Réussi |
| `npm run qa:claims:rev01` | Réussi |
| `npm run test:brand-os` | 19/19 réussis |

Les premiers tests de baseline ont été lancés avant build et ne pouvaient pas
lire `.next/required-server-files.json` ; la baseline retenue est celle rejouée
après le build de référence. Les contrôles de glyphes, permissions, secrets,
routes et rendu serveur restent en place. Les nouveaux tests Node exercent les
cycles complets, le décalage, les transitions, le plafond de deux faces et le
nettoyage, en plus du HTML complet bilingue.

Tests Playwright écrits et compilés, **non exécutés** conformément au mandat.
Les changements d’anciens tests correspondent aux contrats remplacés : barres
supprimées, liste d’outils retirée, empilement mobile remplacé par carrousel,
résultats SVG sur plusieurs lignes. Aucune assertion de réseau, de droits ou
de destination supprimée ; aucun seuil de géométrie relâché.

Le test bloquant `un bloc = un écran` mesure pour FR et EN à 1440×800, 1280×720
et 390×700 : le premier enfant de chacune des sept sections concernées, son
scrollHeight, douze figures (dont le fondateur) et les cartes des carrousels.
Il vérifie aussi le hero complet avec barre à 1440×800 et son H1 à 88 px.
Aucune hauteur forcée ou découpe verticale ne sert à faire passer le contrôle.

**PRODUCTION_PROOF restant** : lancer sur l’hôte le serveur du build puis
`npm run qa:network:rev01` et inspecter les captures aux tailles contractuelles.
Les estimations avec les métriques des polices locales ont guidé l’espacement,
mais ne constituent pas une mesure de mise en page navigateur. Le passage réel
du test « un bloc = un écran », la lecture visuelle et les gestes restent à
confirmer sur l’hôte. Aucun déploiement ni preuve production revendiqués.
