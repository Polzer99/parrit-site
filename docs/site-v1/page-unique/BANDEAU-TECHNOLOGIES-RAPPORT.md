# Bandeau technologies, 27/10/2026

Mandat : `BANDEAU-TECHNOLOGIES.md`, branche `feat/bandeau-technologies`.
Baseline : `dbfaa0066aae60671e3f70bd9653ae8e900e94ab`.
Source visuelle en lecture seule : `maquette-bas/frontiere.html`, capture
`tech.png` et `tech_band.py` dans le scratchpad indiqué par le brief
(le script est à la racine du scratchpad, et non dans `maquette-bas/`).

## Livraison

Bandeau `#technologies` immédiatement après le hero, 41 technologies dans
l'ordre exact du brief, 33 SVG copiés sans modification depuis `tech-assets/`.
Chaque fichier a sa provenance versionnée et son SHA256 dans
`public/tech/SOURCES.md`. Six noms ont un carré, Claude Code et Codex réutilisent
les logos de Claude et OpenAI. Aucune dépendance ou requête distante ajoutée.

Les deux listes sont rendues côté serveur ; la seconde est `aria-hidden`.
Défilement CSS de droite à gauche en 60 s, sans minuteur JavaScript. En mouvement
réduit, l'animation et la copie de boucle disparaissent ; tous les noms restent
visibles en retour à la ligne. Fond et textes passent exclusivement par les
jetons Brand OS ; les SVG n'ont aucune couleur littérale.

Retrait de DataArchitecture, de ses traductions exclusives et du CSS associé.
Le texte partagé « Commande saisie » du hero et la mention des marques restent.
`public/tools/` ne contenait déjà plus d'icônes ; son SOURCES.md obsolète est retiré.
L'autodéfilement optionnel de MobileCarousel, utilisé seulement par le trajet,
est supprimé. Les cinq autres carrousels conservent clavier, défilement natif,
points de position et nettoyage des écouteurs. Aucun changement à la navigation.
`/standard`, `/systems` et leurs variantes françaises redirigent en un saut 308
vers les technologies ; les paramètres de requête restent conservés.

## Écarts à la maquette

- Liste de 41 noms issue du brief, prioritaire sur les 33 noms du script de maquette.
- Titre à 22 px (jeton `--t-l`), au lieu des 20 px de la maquette :
  `tests/aeration.spec.ts` impose l'échelle 16/18/22/26. Aucun test ni token
  assoupli. Interligne à 1,45 pour conserver le contrôle de lisibilité.
- Espacements resserrés en mouvement réduit, particulièrement sur mobile ;
  les noms restent à 18 px, les logos à 26 px et les carrés à 14 px.
- Pause aussi au focus clavier, en complément du survol demandé.
- Mention juridique sous le bandeau, à 16 px, selon le brief.

## Contrôles

Baseline : npm ci, build Webpack puis 113/113 tests Node réussis. Le premier
npm test avant build échouait sur `.next/required-server-files.json` absent.
Aucun serveur en écoute, navigateur ou service réel utilisé par les tests.
Context7 indisponible (quota atteint) ; guides redirects et Server/Client
Components de Next.js 16.3.4 lus dans `node_modules/next/dist/docs/`.

Candidat final :

| Commande | Résultat |
|---|---|
| `npm ci` | Réussi |
| `npm run lint` | Réussi |
| `npm run build -- --webpack` | Réussi, 52 pages générées, TypeScript strict |
| `npm test` | 117/117 (baseline 113/113) |
| `npm run qa:brand:rev01` | Réussi |
| `npm run qa:claims:rev01` | Réussi |
| `npm run test:brand-os` | 19/19 |
| `npx tsc --noEmit` | Réussi |
| `npx playwright test tests/single-page.spec.ts --list` | 55 cas recensés, aucun navigateur lancé |

Les 33 SVG ont aussi été comparés octet par octet au dossier fourni : identiques.
La largeur du conteneur réduit est explicitement bornée à 100 % ; le flex-shrink
nul de la boucle ne peut donc pas imposer sa largeur intrinsèque sur mobile.

Les anciens contrôles métier restent, avec les seuls contrats devenus obsolètes
remplacés : architecture → technologies, six → cinq carrousels, suppression des
assertions sur les puces et l'autodéfilement du trajet retiré. Les contrôles de
navigation, réseau, contraste, taille et géométrie ne sont pas assouplis.

Tests nouveaux : registre exact, rendu serveur bilingue et HTML réellement
compilé, boucle accessible, empreintes/provenance et absence de couleurs dans
les SVG. Playwright couvre les trois tailles en FR/EN, avec/sans JavaScript,
le bandeau entier ≤ hauteur d'écran, chaque nom visible, contraste ≥4,5:1,
minimum 16 px, absence de découpe, mouvement réduit, jointure de la boucle,
pause survol/clavier et préférence de mouvement changée à chaud. Le deny-all
réseau existant s'applique à toutes les nouvelles specs. Les requêtes d'assets
et de redirections sont limitées explicitement à localhost/127.0.0.1.

Revue indépendante statique réalisée ; contrôle de jointure renforcé après
relecture. Les métriques de General Sans donnent 15 lignes/446 px pour la liste
à 390 px ; cette estimation n'est pas une preuve de rendu navigateur.

PRODUCTION_PROOF : à établir sur l'hôte, sans présumer du résultat. Exécuter
la batterie Playwright existante (`npm run qa:network:rev01`) avec le serveur
sur :3210 ; les nouveaux cas sont intégrés à `single-page.spec.ts`.
Captures et mesure réelle des trois tailles restent à faire par Paul.

Écritures : dépôt local seulement, aucun système client ni donnée modifiée.
Réversibilité : un commit sur branche, rollback par revert ; baseline Git
conservée. Aucun push ni déploiement.
