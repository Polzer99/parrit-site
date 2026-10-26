# Rapport site V1, lot 1 V2 — 26/10/2026

## Périmètre et état initial

Demande : implémenter intégralement HANDOFF-LOT-1-V2, dont le lot 1 et son plan
restent dus. Consignes AGENTS, AI_CONTEXT, TRUTH et documents du lot lus avant
modification. Documentation locale Next 16.3.4 et Context7 Next 16.2.9 consultées.

Le checkout initial était `2115aab95e6656d5272ac8cf0ae109b3f567418d`, antérieur au
lot 1. Le seul changement préexistant était `docs/site-v1/HANDOFF-LOT-1-V2.md`,
non suivi et conservé intact. Le commit `3052fce`, explicitement demandé par la
spec V2, était disponible localement. Son diff a été appliqué aux fichiers après
vérification, sans checkout, commit ni modification de l'index. Les documents
prérequis absents ont ainsi été repris depuis cette même source.

Écritures : dépôt local uniquement, réversibles par diff. Aucune écriture métier,
base de données, envoi, installation de service, publication ou déploiement.
Aucun commit, push ni merge. Les fichiers ajoutés restent non suivis pour le script
qui prendra la suite. Le rapport du lot 1 est conservé comme historique ; ce
rapport décrit la validation actuelle.

## Modifications

Le lot 1 complet est présent : accueil H01–H07/H11/H12, quatre pages bilingues,
navigation, preuves filtrées, SEO, traductions, documentation et tests adaptés.

Corrections V2 :

- `src/system/site-v1.css` : contours des boutons secondaires via `currentColor`,
  contours des onglets via les tokens du registre. Liste de dette et seuils des
  tests de contraste inchangés.
- `src/system/components/RevHeader.tsx` : fermeture des menus sur lien, route,
  Échap et clic extérieur. Le hero est dépassé seulement si son bas est au-dessus
  du viewport. Ouvrir le menu et pousser le hero sous l'écran ne déclenche plus
  l'accent. Le test doctrine-visible n'a pas été modifié par rapport au lot 1.
- `src/system/components/SiteV1Page.tsx` : titres uniques FR/EN exactement selon
  V2 pour Sprints et Harness ; schéma Harness sans flèches entre composants.
- `src/lib/registry/preuves.ts` : permission, portée, source et validité calendaire
  requises ; aucune dépendance à la date courante pour publier. Fonction de revue
  avec `today` explicite ; test CI bloquant 30 jours avant l'échéance. La date de
  revue n'est jamais une expiration de publication.
- `src/app/(rev01)/page.tsx` : sections H02/H04 et titres absents si listes vides,
  séparateurs FR conformes, traduction Joone corrigée, aucune promesse de test dans
  la traduction de Construction.
- `src/system/components/CaseStudyCard.tsx` : `pageId` obligatoire, transmis au
  filtre de permission ; dictionnaires accessibles aux tests d'identifiants.
- `src/system/components/IntegrationBuildSwitcher.tsx` : nom ARIA localisé.
- `src/system/site-v1-pages.ts` : traduction Construction corrigée.
- `src/app/(rev01)/{dossiers,standard,manufacture,systems,sketch/[id]}/page.tsx` :
  uniquement les CTA demandés remplacés par Parler d'un projet / Talk about a project.
- `src/proxy.ts`, `next.config.ts` : alias conseil normalisé dans le proxy après
  traitement du choix de langue, supprimant le double saut. Source et UTM conservés.
- `scripts/generate-llms.mjs`, `public/llms.txt` régénéré : phrases interdites
  retirées, phrase fondatrice et trois portes conservées, propriété par contrat.
- `TRUTH.md` : phrase fondatrice actualisée, cinq capacités et leurs garde-fous
  restaurés ; seule Content Factory retirée du tableau.
- `scripts/capture-site-v1.sh`, `docs/site-v1/captures/README.md` : capture explicite
  via SITE_V1_CAPTURE=1 ; 50 vues FR/EN aux cinq largeurs, hauteur 844 px.
- `AGENTS.md`, `AI_CONTEXT.md` : état courant et distinction revue/publication.

Les fichiers `/legal`, `/build-with-you`, `/commission`, Journal, public-clients,
polices et tokens vendorisés sont inchangés. Les clauses de propriété de Standard
et Manufacture n'ont pas été retouchées. La barre reste dans le flux.

## Tests

- `tests/site-v1.test.mjs` : permissions, portée de CaseStudyCard, sections vides,
  noms privés sur rendu HTML, IDs clients contre PUBLIC_CLIENT_NAMES, fondateur
  absent des nouvelles pages, titres uniques entre langues, schéma sans flèche,
  échéance avec dates injectées et fixture indépendante des futures revues.
- `tests/site-v1-routing.test.mjs` : alias FR sans lang, avec lang=fr et lang=en,
  paramètres conservés, absence de second redirect.
- `tests/site-v1.spec.ts` : deux CTA entièrement dans le viewport à 390×844,
  ARIA localisé, H06 réellement sans JavaScript sur les quatre URL demandées,
  fermetures du menu, alias en un saut, PNG conditionnés par SITE_V1_CAPTURE.
- `tests/brand-os-render.test.mjs` : noms privés contrôlés au point commun de rendu
  de toutes les pages testées, identité du directeur présente dans /legal ;
  interdiction du fondateur ailleurs conservée.
- `tests/anti-slop-copy.test.mjs` : remplacement justifié du contrat imposant de
  recopier la clause universelle de propriété dans llms. Les cinq autres critères
  restent contrôlés ; les quatre phrases retirées sont désormais interdites.
- `tests/audit-truth-copy.test.mjs` : « support » remplace « coaching » conformément
  à la traduction expressément demandée. Les garde-fous client restent actifs.

Les adaptations plus larges des suites existantes sont celles du commit de base
3052fce (voir RAPPORT-LOT-1.md). Aucun seuil de contraste/géométrie ni deny-all
réseau assoupli pour V2.

## Résultats exécutés

| Vérification | Résultat |
|---|---|
| npm ci --silent | Réussi |
| Baseline npm test après installation | 112/115 ; 3 échecs car build absent |
| Tests ciblés V2 | 30/30 |
| npm run lint | Réussi |
| npx tsc --noEmit | Réussi |
| npm test après build | **144/144** |
| npm run qa:brand:rev01 | Réussi |
| npm run qa:claims:rev01 | Réussi |
| npm run build | Turbopack sans progression en compilation ; interrompu |
| npm run build -- --webpack | **Réussi, 62/62 pages**, compilation et types |
| npm run test:brand-os | **24/24**, dont rendu serveur compilé sans réseau |
| git diff --check | Réussi |
| npm run qa:network:rev01 -- --list | 401 tests / 20 fichiers |
| Playwright site-v1, max-failures=1 | Chromium refusé avant navigation ; 64 non exécutés |
| qa:network:rev01, max-failures=1, workers=1 | Même refus ; 400 non exécutés |

Les premières exécutions ont exposé deux assertions obsolètes (propriété dans llms,
coaching) corrigées selon les changements de contrat explicites V2, et trois tests
exigeant le build. La suite finale est entièrement verte après build Webpack.
Les journaux détaillés sont dans `/private/tmp/site-v1-v2-*.log`.

## Revue et limites

Revue adverse indépendante en lecture seule, conformément au Recursive Agent
Harness : cause de l'accent mobile identifiée, corrections menu/alias/contraste
vérifiées, aucun blocage concret relevé. Une fragilité des tests de dates a été
corrigée en séparant fixture fixe et revue réelle. Cette revue ne remplace pas
la revue Claude du diff et des textes prévue par le handoff.

Le sandbox macOS refuse Chromium : `MachPortRendezvousServer: Permission denied
(1100)`, avant toute navigation. Aucun serveur n'a été lancé dans ce sandbox,
conformément aux instructions locales. Aucune capture ni preuve de rendu navigateur
n'est revendiquée ; contraste effectif, géométrie, interactions et zéro échec
Playwright restent à établir sur l'hôte. Aucun nouvel essai identique après ces
refus. La chaîne exacte demandée avec Turbopack n'est pas entièrement validée.

Reprise hôte : build, démarrage local sur 3210, `npm run qa:network:rev01`, puis
`sh scripts/capture-site-v1.sh`. Revue Claude et validation Paul restent nécessaires
avant fusion ou mise en ligne ; aucune preuve de production n'est revendiquée.
