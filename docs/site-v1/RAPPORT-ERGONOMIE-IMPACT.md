# Ergonomie et impact : compte rendu du 26/10/2026

Implémentation locale réalisée. Validation statique et serveur verte avec Webpack ;
validation visuelle, captures et suite navigateur encore bloquées par le sandbox.
Aucun commit, push ou déploiement.

## Sources et périmètre

- Dépôt courant, branche préexistante `codex/docs-site-v1-HANDOFF-ERGONOMIE-IMPACT-md`,
  base `01e334f6c3bd1d626111daf7ad8f01ceac8aa95d`.
- Instructions lues : `AGENTS.md`, `AI_CONTEXT.md`, `TRUTH.md`, handoff demandé,
  doctrine locale du harness, documentation CSS de Next.js 16.3.4 installée.
  Documentation officielle React consultée via Context7 pour la distinction
  rendu serveur/hydratation de `useSyncExternalStore`.
- Textes et intégration ProductScene repris de `bd7f9aa^`, images existantes inchangées.
- Seul changement préexistant : `docs/site-v1/HANDOFF-ERGONOMIE-IMPACT.md`, non suivi,
  conservé sans modification. La branche dédiée existait déjà.
- Cible : fichiers locaux de ce checkout ; aucune écriture externe, aucune donnée
  métier, zéro ligne de base de données. Modifications réversibles par le diff,
  référence des fichiers suivis dans HEAD. Aucun fichier vendorisé modifié.

## Modifications

- `src/app/(rev01)/page.tsx` : remplacements FR/EN demandés ; ProductScene dans
  le hero, texte à gauche et objet CRM à droite sur desktop, empilement mobile ;
  mention de démonstration visible ; ProcessDiagram déplacé sous les étapes Conseil.
  Les textes et la conversation de la scène approuvée restent disponibles.
  Références en cartes, sans modifier les noms et descriptions ; méthode six
  étapes avec cinq ProcessConnector ; boutons secondaires sans point final.
- `src/system/components/CaseStudyCard.tsx` : deux lignes par exemple, texte exact
  du handoff, statut sous le titre ; contrôle `getSiteEvidence(id, pageId)` conservé.
- `src/system/components/IntegrationBuildSwitcher.tsx` : H3 conservé et rendu
  `sr-only` uniquement après hydratation ; trois titres et panneaux visibles sans JS.
- `src/system/components/SiteV1Page.tsx` : suppression du surtitre, clôture conservée.
- `src/system/site-v1.css` : grille de cartes à deux colonnes et une sur mobile,
  surfaces Brand OS sans bordure ; méthode 3 × 2 à 1440/1024 et une colonne mobile ;
  suppression des filets de clôture et du panneau Engineering, raccord au footer
  sombre ; actions à largeur de contenu ; typographie publique General Sans.
  L’annexe Systems et le mot-symbole gardent leur typographie ; le code du Journal
  garde IBM Plex Mono. Aucune nouvelle taille de police ou couleur littérale.
- Pages `build-with-you`, `commission`, `dossiers`, `journal`, `journal/[slug]`,
  `legal`, `manufacture`, `standard` : retrait des surtitres et registres décoratifs.
  Les six engagements du Standard, les dates et le repère linguistique EN sont
  conservés. La page `systems` reçoit une classe de portée technique et ses
  boutons de catalogue perdent leur point final. `src/app/not-found.tsx` suit
  également le mode accessible.
- `QuickCapture.tsx` et `CalInline.tsx` : messages utiles conservés en texte courant,
  sans présentation K ; logique de formulaire inchangée.
- `AGENTS.md` : décision de Paul et règle du mode accessible ajoutées.
  `AI_CONTEXT.md` : état et limites de validation actualisés.
- `package.json` : nouvelle spec ajoutée à `qa:network:rev01`.

## Tests ajoutés et adaptations autorisées

`tests/ergonomie-impact.test.mjs` ajoute quatre tests Node FR/EN : scène approuvée
au hero, déplacement du schéma sous les étapes, absence de K/index/étiquettes,
six étapes et cinq connecteurs, boutons sans point, panneaux complets sans JS.

`tests/ergonomie-impact.spec.ts` ajoute six parcours avec deny-all réseau :

- FR/EN à 1440 et 375 : cinq routes contrôlées pour la mono visible (hors mot-symbole),
  débordements et boutons ; objet produit chargé dans le premier écran desktop ;
  ordre mobile ; titres des panneaux masqués après activation ; géométrie de la
  méthode ; absence de séparateurs horizontaux superposés à moins de 24 px.
- FR/EN à 1024 : méthode en deux rangées de trois étapes.
- Les quatre parcours home écrivent et joignent les captures
  `docs/site-v1/captures/ergonomie-{fr,en}-{375,1440}.png` lorsqu’ils s’exécutent.

Assertions héritées adaptées uniquement aux structures remplacées :

- `site-v1-visual.test.mjs`, `site-v1-visual.spec.ts`, `product-scene.spec.ts` :
  ordre/compte des étapes à la place des index ; cartes à deux lignes à la place
  des quatre champs ; statut après le titre.
- `site-v1.test.mjs`, `site-v1.spec.ts`, `six-capacites.test.mjs` : les deux images
  approuvées remplacent l’interdiction absolue d’image. Allowlist exacte ; les
  chiffres des marqueurs et heures de la conversation sont exclus des claims
  numériques, comme les anciens index. Les autres chiffres restent interdits.
- `design-harmonisation.spec.ts`, `conformity-standard.spec.ts` : engagements et
  étapes toujours présents, anciens numéros absents, typographie accessible.
- `alignment-grid.spec.ts`, `conformity-journal.spec.ts`, `brand-os.spec.ts` :
  absence de registre/kicker sur les pages accessibles ; date du Journal et
  alignement du hero 404 conservés. Registre technique Systems conservé.
- `tests/helpers/site-v1-render.mjs` accepte explicitement l’import CSS local de
  ProductScene, sans élargir les imports réseau.

Aucune modification des assertions de permissions, destinations, contrôle des
promesses de propriété, contrastes, taille des cibles ou deny-all réseau.

## Résultats

| Vérification | Résultat |
| --- | --- |
| `npm ci --offline --silent` | Réussi |
| Référence `npm test`, avant édition | 158/161 ; trois échecs dus au build absent |
| `npm run lint` | Réussi |
| `npx tsc --noEmit` | Réussi |
| `npm test` sur le candidat construit | **165/165** |
| `npm run qa:brand:rev01` | Réussi |
| `npm run qa:claims:rev01` | Réussi |
| `npm run test:brand-os` | **24/24** |
| `npm run build` | Turbopack sans progression, interrompu |
| `npm run build -- --webpack` | Réussi, 62 pages générées |
| `git diff --check` | Réussi |
| `npx next start -p 3210` | Refus du sandbox : `listen EPERM` |
| Nouvelle spec Playwright | Chromium refusé avant navigation |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | 434 cas découverts ; arrêt au premier lancement Chromium refusé |

Journaux de la session : `/private/tmp/ergonomie-{test-final,contracts-final,
webpack-final2,lint-final2,types-final,brand-final2,claims-final2,network,browser,
server,build}.log`. Les avertissements `metadataBase` du build sont visibles
au journal ; aucune configuration SEO n’a été modifiée dans ce lot.

## Blocage et preuve attendue sur l’hôte

Chromium échoue sur `MachPortRendezvousServer: Permission denied (1100)` ; le serveur
local est lui aussi interdit. Aucune capture n’a donc été créée et aucune mesure
navigateur n’est déclarée validée. La réussite des tests serveur ne prouve pas
la géométrie, le contraste réel ni les interactions après hydratation.

Sur l’hôte, démarrer le build sur 3210 puis exécuter `npm run qa:network:rev01`
sans limite d’échecs. Examiner les quatre captures générées, notamment le hero,
les raccords de sections, les cartes, les deux rangées de méthode et les titres
Engineering. Cette revue et la suite navigateur intégralement verte restent
nécessaires avant de considérer les critères d’acceptation complètement acquis.


## Correctif

Correctif du 26/10/2026, suivant `HANDOFF-CORRECTIF-330.md`.

### Base et préservation

Le checkout fourni était `01e334f` (PR #329), sur la branche dédiée
`codex/docs-site-v1-HANDOFF-CORRECTIF-330-md`, et non `bdf6167` comme prévu
par la spec. Le socle complet de `bdf6167` a été repris à l'identique dans les
fichiers de travail avant correction, sans changer HEAD, la branche ou l'index.
Cela explique les 36 fichiers du socle présents dans le diff global.
Le seul fichier préexistant non suivi, `HANDOFF-CORRECTIF-330.md`, est conservé.
Aucun commit, push, déploiement ou écriture externe ; aucune donnée métier.
Cible : checkout local ; changements réversibles par le diff, références HEAD et
`bdf6167`, zéro ligne de base de données. Aucun fichier vendorisé modifié.

### Modifications propres au correctif

- `src/app/(rev01)/rev01.css` : le H2 de capture de commission utilise
  `--t-m` (18 px), graisse 600, au lieu du 27 px implicite. Portée limitée à
  `.commission-page .standard-action h2`, sémantique H2 conservée.
- `tests/conformity-home.spec.ts` : remplacement du contrat de bordure par
  le fond calculé de `--brand-surf`, zéro bordure, radius et ombre pour chaque
  carte. Géométrie des cinq cartes contrôlée : deux colonnes à 1024/1440
  (également 1023, comportement existant), une à 375/390, alignement des
  rangées et absence de chevauchement. Autres assertions conservées.
- `tests/alignment-grid.spec.ts` : suppression de l'exception centrée de
  l'accueil ; bord gauche commun. À 1440, assertion de l'alignement du texte
  du H1, du groupe de boutons et du premier bouton, justification à gauche.
  Le CSS du socle assure déjà cet alignement, sans modification du mobile.
- `tests/conformity-commission.spec.ts` : contrôle du H2 visible, de sa taille
  calculée depuis `--t-m` et de sa graisse, en FR/EN à 375, 390 et 1440.
  Deux parcours supplémentaires à 390 ; les quatre existants sont renforcés.
- `AI_CONTEXT.md` : état et limites de validation du correctif.

L'échelle typographique et `tests/aeration.spec.ts` restent strictement inchangés.
Les tests héritent toujours du deny-all réseau partagé. Aucun test Node ajouté
pour reproduire une déclaration CSS : les contrôles ajoutés mesurent le rendu.
Revue indépendante en lecture seule : aucun défaut bloquant identifié.

### Exécutions

| Vérification | Résultat |
| --- | --- |
| `npm ci --offline --silent` | Réussi |
| Baseline `npm test` sur le socle avant correction | 162/165 ; trois échecs liés au build absent |
| `npm run lint` | Réussi |
| `npx tsc --noEmit` après build | Réussi |
| `npm run qa:brand:rev01` | Réussi |
| `npm run qa:claims:rev01` | Réussi |
| `npm run build` | Turbopack sans progression ; interrompu |
| `npm run build -- --webpack` | Réussi, 62 pages générées |
| `npm test` après build | **165/165** |
| `npm run test:brand-os` | **24/24** |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | 436 cas ; Chromium refusé au premier lancement, 435 non exécutés |
| `git diff --check` | Réussi |

Journaux : `/private/tmp/correctif-330-{baseline,lint,types-final,brand,claims,
build,webpack,test-final,contracts,network}.log`.
Avertissements du socle conservés : metadataBase pendant le build et type de
module pendant la gate claims.

### Blocages et preuve attendue

Chromium est refusé avant navigation par macOS :
`MachPortRendezvousServer: Permission denied (1100)`.
Le sandbox ne permet donc pas de valider ici les mesures ni les captures.
Le build par défaut Turbopack n'est pas validé ; seul Webpack a abouti.
La suite complète verte demandée reste à obtenir sur l'hôte : démarrer le
serveur sur 3210 et rejouer `npm run qa:network:rev01` sans limite d'échecs.
Vérifier les cartes aux quatre largeurs, le hero desktop gauche et son mobile
inchangé, puis les H2 commission FR/EN avec l'audit d'aération intact.
Aucune preuve de production ou de validation visuelle n'est revendiquée.
