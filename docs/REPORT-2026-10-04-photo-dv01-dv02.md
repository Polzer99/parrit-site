# Rapport — photo AV-3, promesse DV-01 a, catégorie DV-02 a

Implémentation du 04/10/2026 selon la spec locale validée. Aucun commit, push,
merge ni déploiement. Le fichier de spec est conservé sans modification.
L'implémentation ci-dessous était déjà présente lors de la reprise FIX1 ; ses
changements et les quatre captures PNG préexistantes ont été préservés.

## Périmètre et sources

- Instructions lues : `AGENTS.md`, `AI_CONTEXT.md`, `TRUTH.md`, spec du lot,
  doctrine `RECURSIVE-AGENT-HARNESS.md` et documentation metadata de Next 16.3.4
  installée localement. Les changements utilisent les API existantes.
- Source photo : manifeste et exports en lecture seule dans
  `/Users/paullarmaraud/parrit-canon-visual-system/brand/visual/sites/handoff/2026-10-05/photos/`.
  Les quatre SHA-256 du manifeste sont reproduits dans une fixture indépendante.
- Écritures limitées au checkout local : sources, assets, tests, documentation et
  sorties de build. Aucun système distant ni donnée métier modifié ; zéro ligne
  métier affectée. Diff réversible par fichier ; les originaux des photos restent
  dans le dossier canon, inchangés. Pas de secret utilisé.
- Boucle bornée : implémentation, revue indépendante en lecture seule, correction
  ciblée et vérifications. Pas de répétition de Chromium après son refus système.

## Fichiers modifiés

| Fichier(s) | Modification |
|---|---|
| `public/brand/founder/parrit-ai-founder-dsc00629-3x4-{340,680}.{avif,webp}` | Exactement quatre copies binaires, sans retouche ni recompression. |
| `src/app/(rev01)/page.tsx` | Kicker, H1 encadré, sous-titre, lien examen et métadonnées exacts FR/EN ; figure avant le déroulement, sources AVIF puis WebP, tailles et chargement prescrits, alt et légende localisés. |
| `src/app/(rev01)/rev01.css` | Grille 340 px + colonne flexible au-dessus de 859 px ; photo au-dessus du texte en dessous ; largeur bornée à 340 px, sans ombre ni rayon. H1 élargi à 24ch ; palier existant `--d-s` sur téléphone ≤480 px, tracking −.06em pour garder le groupe français dans un cadre rectangulaire sans coupure. Tailles desktop/tablette et tokens conservés. |
| `src/app/(rev01)/layout.tsx` | Titre et description EN par défaut. |
| `src/system/jsonld.ts` | Seul le segment de catégorie Organization est remplacé ; fin de phrase conservée. |
| `src/system/components/Opening.tsx` | Promesse et signature FR/EN alignées ; ligne suivante DV-03 conservée. Aucun changement de comportement. |
| `src/app/opengraph-image.tsx` | Titre de carte et alt « PARRIT.AI · DATA AND AI » ; DV-03 conservé. |
| `src/app/(rev01)/sketch/[id]/page.tsx` | « Operating System · Sketch » devient « System · Sketch ». |
| `src/app/(rev01)/manufacture/page.tsx` | Description EN : « builds a company operating system » devient « builds a system », pour satisfaire le contrôle final. |
| `scripts/generate-llms.mjs`, `public/llms.txt` | Nouvelle catégorie et systèmes livrés ; fichier public régénéré par le script. |
| `TRUTH.md` | Catégorie, systèmes sur mesure et correction de l’ancrage tarifaire autorisé sur la home. Aucun prix produit modifié. |
| `package.json` | Test d’intégrité photo ajouté à `test:brand-os`. |
| `AI_CONTEXT.md` | État du lot et limites de validation. |
| `tests/fixtures/founder-photo.json`, `tests/founder-photo.test.mjs` | Fixture des quatre exports approuvés et test SHA-256, taille binaire, cardinalité exacte. Chemin du manifeste documenté dans le test. |
| `tests/brand-os-render.test.mjs`, `tests/brand-os.spec.ts`, `tests/conformity-home.spec.ts`, `tests/conformity-i18n.spec.ts` | Contrats et tests détaillés ci-dessous. |

`src/app/llms-full.txt/route.ts` est inchangé : son introduction lit déjà celle
extraite de `public/llms.txt`. Il bénéficie donc de la régénération sans dupliquer
le texte. Les articles qu’il expose sont préservés.

## Tests : avant / après

| Test | Avant | Après / justification |
|---|---|---|
| `conformity-i18n.spec.ts` | H1 FR « Le système IA qui fait tourner votre entreprise. » et fragment EN « The AI system your company ». | Nouveau H1 FR exact et fragment EN « We turn operational problems into » ; contrat éditorial DV-01. |
| `conformity-home.spec.ts` | Sous-titres FR/EN commençant directement par la facture, se terminant par la mise en service. | Textes complets prescrits, commençant par la catégorie données/IA. Assertions de funnel et géométrie conservées. |
| `brand-os.spec.ts` | Six cas FR/EN × 375/768/1440 exigeaient zéro photo et aucun label fondateur dans la colonne texte. | Photo approuvée chargée, alt exact, dimensions, lazy/async, sources et sizes, légende, ordre responsive et alignement. Les assertions du kicker dans la colonne texte restent identiques. Ajout H1 exact, cadre rectangulaire sans coupure, comptage des mots par ligne avec Range, absence de débordement et capture. |
| `brand-os.spec.ts` — nouveau cas | Aucun contrôle des quatre URL publiques. | Chaque URL doit répondre 200 avec le bon MIME et les octets correspondant au SHA-256 ; navigation sous deny-all partagé. |
| `brand-os-render.test.mjs` | Absence de l’ancien nom `founder-portrait` et équivalence photo/légende. | Photo DSC00629 et alt explicites, titre metadata et H1 exacts ; équivalence photo/légende conservée. Le texte du H1 est extrait sans ajouter d’espaces aux frontières des spans. |
| `founder-photo.test.mjs` — nouveau | Aucun verrou sur DSC00629. | Quatre fichiers exactement, tailles binaires et SHA-256 du manifeste. Intégré à `test:brand-os`. |

Aucun seuil existant abaissé ou supprimé. Deny-all partagé et service workers
bloqués conservés dans les tests navigateur. La nouvelle vérification des URL
statiques est dans Playwright : le serveur Next mocké utilisé par le test Node
ne comprend pas le routeur des fichiers `public` et répondait 404 à ces requêtes.

## Résultats d’exécution

Installation locale : `npm ci --offline --ignore-scripts` réussit, lockfile inchangé.
Baseline avant modification : lint, claims et gate de marque passent. Les tests
Node Brand OS sans build donnent 9 succès / 2 échecs dus à l’absence de
`.next/server/app`, pas à un écart de contrat. Le build Turbopack initial reste
bloqué à « Creating an optimized production build » et est interrompu ; aucune
baseline de rendu complète n’est revendiquée.

| Vérification finale | Résultat |
|---|---|
| `npm run lint` | Réussi, aucun avertissement ESLint. |
| `npx tsc --noEmit` | Réussi. |
| `npm run qa:claims:rev01` | Réussi. |
| `npm run qa:brand:rev01` | Réussi. |
| `npm run build -- --webpack` | Réussi, y compris TypeScript et génération des 54 pages statiques. Le build final comprend le correctif H1. |
| `npm run test:brand-os` | 13/13 réussis : empreintes, assets interdits, glyphes, rendu réel EN/FR, 404, OG PNG, contrats et nouvelles photos. |
| Tests Node doctrine, entity-spelling, entity-graph, privacy-corrections | 26/26 réussis. |
| `git diff --check` | Réussi. |
| Grep prescrit dans `src scripts` | Aucun résultat ; code de sortie 1 normal pour zéro correspondance. |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | Bloqué avant navigation : lancement Chromium refusé par macOS, `bootstrap_check_in … MachPortRendezvousServer: Permission denied (1100)`. 1 échec d’infrastructure ; les autres tests non exécutés. |

Le build et le rendu Node signalent un avertissement `metadataBase` sur certaines
surfaces. Les assertions d’URL OG des pages EN/FR et de la 404 restent vertes.
Aucun élargissement du lot pour traiter cet avertissement.

Logs locaux de cette session : `/tmp/photo-build-final.log`,
`/tmp/photo-lint-final.log`, `/tmp/photo-types-final.log`,
`/tmp/photo-brand-final.log`, `/tmp/photo-node.log`, `/tmp/photo-network.log`.

## Revue, hors lot et preuves restantes

Une revue indépendante a signalé la fragilité des coins absolus sur un cadre
inline multiligne. Corrigé : `inline-block` et `nowrap` conservés, H1 mobile sur
un palier existant. Un élargissement accidentel de `.rev-hero h1` a été retiré.

DV-03 est intact : « Une commande, pas un abonnement » / « Commissioned, not
subscribed » demeure dans les surfaces concernées. Tokens vendorisés, polices,
offres, tarifs, durées, routes, boutons et comportement QuickCapture/AgentEsquisse
inchangés. Aucun fichier `content/journal/` modifié, notamment
`content/journal/what-is-a-company-operating-system.mdx` (« What is a company
operating system? »). Son ancienne catégorie reste volontairement dans l’article,
ses métadonnées et les flux Journal/llms-full qui le republient. Aucun reste dans
le périmètre littéral du grep `src scripts`.

La preuve navigateur est **non obtenue** : contrôles de mots seuls, composition
du H1, crochets, chargement réel des photos, contraste visuel, captures et batterie
réseau restent à exécuter par le script hôte avec le serveur local sur 3210.
Les tests correspondants sont prêts ; ne pas présenter leur collecte comme une
exécution réussie. Le test SHA local prouve les octets livrés, pas leur service HTTP.
Aucune preuve de production revendiquée, le déploiement étant interdit dans ce lot.

## Reprise FIX1 — 04/10/2026

Source : section FIX1 de la spec, checkout demandé sur la branche
`codex/docs-CODEX-SPEC-2026-10-04-parrit-ai-photo-dv01-dv`, HEAD `bb7b7e0`.
Les résultats ci-dessus décrivent la passe initiale ; ceux-ci sont ceux de la reprise.

Modification ciblée de `tests/doctrine-visible.spec.ts` : le contrôle de composition
FR/EN mesure maintenant `.home-s-maison-grid` si une image est rendue et si la
largeur dépasse 859 px. Son centre est comparé à celui de la section et sa largeur
à `.home-s-build > .home-s-wrap`. Le h2 reste limité à 3.01 lignes (tolérance
existante), les deux écarts à 1 px. Sur mobile et sans image visible, le test mesure
toujours `.home-s-maison-copy`, comme avant. Aucun changement supplémentaire de
CSS, de contenu ou d'asset ; aucun nouveau fichier de test nécessaire pour FIX1.
`AI_CONTEXT.md` documente cette reprise.

Vérifications exécutées :

- Baseline ciblée : les quatre cas de composition sont collectés, puis Chromium
  échoue au lancement (`MachPortRendezvousServer: Permission denied (1100)`) ;
  aucune mesure géométrique initiale n'est obtenue.
- `npm run lint`, `qa:claims:rev01`, `qa:brand:rev01` : réussis.
- `npm run build -- --webpack` : réussi.
- `npx tsc --noEmit` : réussi ; `test:brand-os` rejoué après build : 13/13.
- Tests Node : Brand OS 13/13, doctrine 10/10, confidentialité 9/9, entité 7/7.
- `git diff --check` : réussi ; grep prescrit `src scripts` : zéro correspondance.
- `npm run qa:network:rev01 -- --workers=1 --max-failures=1` : même refus de
  Chromium avant navigation, 1 échec d'infrastructure et 170 cas non exécutés.

Logs : `/tmp/photo-fix1-{baseline,lint,build,network}.log`.
La validation navigateur et les captures restent à exécuter hors sandbox ; aucun
succès visuel ni résultat en production n'est revendiqué. La branche sans photo
est conservée dans le code du test, sans prétendre l'avoir exercée au navigateur.


## Reprise FIX2 — 04/10/2026

La section FIX2 de la spec est prioritaire sur le seuil décrit dans FIX1.
L’implémentation et les changements préexistants sont conservés. Seule modification
fonctionnelle de cette reprise : `tests/doctrine-visible.spec.ts`, assertion du
nombre de lignes du h2 à 1440 px, FR/EN : `3.01` devient
`hasPhoto ? 4.01 : 3.01`. La tolérance fractionnelle existante de 0.01 est conservée.
Le contrat autorise explicitement quatre lignes avec photo ; sans image visible,
la limite reste trois lignes. Les contrôles mobile, centrage et largeur restent
inchangés. Aucun nouveau test nécessaire : les cas de composition existants
portent cette assertion. Aucun changement de CSS, de contenu ou d’asset.
`AI_CONTEXT.md` documente cette reprise.

Écritures locales réversibles : test et documentation uniquement, plus sorties de
vérification ; aucun système distant ni donnée métier. Boucle limitée à cette
correction et une passe de vérifications, sans tentative de contourner le sandbox.

Résultats de cette reprise :

- Baseline ciblée : Chromium refuse de démarrer avant navigation
  (`MachPortRendezvousServer: Permission denied (1100)`) ; un échec
  d’infrastructure, trois cas non exécutés, aucune géométrie mesurée.
- `npm run lint`, `npm run qa:claims:rev01`, `npm run qa:brand:rev01` : réussis.
- `npm run build -- --webpack` : réussi, 54 pages générées. Avertissement
  `metadataBase` préexistant conservé, hors périmètre FIX2.
- `npx tsc --noEmit` : réussi.
- Après build : `test:brand-os` 13/13, `test:doctrine` 10/10,
  `test:privacy` 9/9, `test:entity` 7/7 — soit 39 tests Node réussis.
- `git diff --check` : réussi ; grep prescrit dans `src scripts` : aucune correspondance.
- `npm run qa:network:rev01 -- --workers=1 --max-failures=1` : refus identique
  de Chromium avant navigation, un échec d’infrastructure, 170 cas non exécutés.

Logs : `/tmp/photo-fix2-{baseline,build,lint,brand-tests,doctrine,privacy,entity,types,network}.log`.
Les mesures navigateur et captures restent à exécuter sur l’hôte ; aucune preuve
visuelle ou de production n’est revendiquée. Aucun commit, push ou déploiement.

## Reprise FIX3 — 04/10/2026

La photo, les textes DV-01/DV-02 et FIX1/FIX2 étaient déjà implémentés dans le
checkout. Seule la spec portait une modification préexistante (ajout de FIX3) :
elle est préservée intégralement. Aucun changement des assets, du Journal,
des tokens, des polices ou du contenu dans cette reprise.

Plan appliqué : baseline, correction du cadre, contrôle géométrique ciblé,
vérifications et rapport. Écritures limitées au checkout local, réversibles par
fichier ; aucune donnée métier ni système distant, zéro ligne métier affectée.
Les versions initiales des fichiers modifiés sont dans HEAD ; la spec préexistante
n’est pas écrasée. Une passe de correction et de vérifications, sans contournement
du sandbox. Aucun commit, push ni déploiement.

Fichiers de cette reprise :

- `src/app/(rev01)/rev01.css` : uniquement le cadre du H1 accueil,
  `padding-inline: .9em` et `margin-inline: -.9em`. Les marges compensent
  l’espace ajouté pour garder la largeur typographique participant à la coupure.
  Taille du H1, tracking, line-height et nowrap inchangés. À 30 px, le retrait
  vaut 27 px : même avec des coins de 16 px en content-box placés à -1 px,
  la séparation théorique est de 12 px.
- `tests/brand-os.spec.ts` : les six parcours photo/titre existants deviennent
  huit avec FR/EN à 390 px. Chaque parcours mesure le texte par
  `Range.getClientRects()` et reconstruit les quatre rectangles des pseudo-éléments
  depuis leurs dimensions et positions calculées (bordures incluses). Assertions :
  un seul rectangle de texte, quatre coins non vides, aucune intersection,
  séparation horizontale ≥ 12 px et coins entièrement dans le viewport.
  Les assertions existantes (texte, mots seuls, débordement, photo, légende,
  captures) et le deny-all réseau sont conservés. Aucun seuil assoupli.
- `AI_CONTEXT.md` et ce rapport : état du correctif et limites de validation.

Résultats de cette reprise :

| Vérification | Résultat |
|---|---|
| Baseline marque, claims, Brand OS Node | Réussie ; 13/13 tests Node. |
| Baseline navigateur ciblée | Refus Chromium avant navigation, aucune mesure obtenue. |
| `npm run lint`, `npx tsc --noEmit` | Réussis après modification finale du test. |
| `npm run qa:claims:rev01`, `npm run qa:brand:rev01` | Réussis. |
| `npm run build -- --webpack` | Réussi, 54 pages ; avertissement metadataBase préexistant. |
| `npm run test:brand-os` après build | 13/13 réussis. |
| `test:doctrine`, `test:privacy`, `test:entity` | 10/10, 9/9 et 7/7 : 39 tests Node au total. |
| `git diff --check` | Réussi. |
| Grep prescrit dans `src scripts` | Aucune correspondance. Article Journal préservé comme documenté plus haut. |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | 1 échec d’infrastructure Chromium, 172 cas non exécutés. |

Logs : `/tmp/photo-fix3-{baseline-node,baseline-browser,build,lint,brand-tests,doctrine,privacy,entity,network}.log`.
Le refus Chromium (`MachPortRendezvousServer`, permission système) empêche toute
validation visuelle et toute capture nouvelle. La non-intersection, les 12 px de
séparation et la coupure effective restent donc à vérifier sur l’hôte avec le
serveur local sur 3210. Le test tient compte du box-sizing des pseudo-éléments,
car le reset `*` ne suffit pas à garantir leur border-box. Aucune preuve navigateur
ou de production n’est revendiquée.

## Reprise FIX4 — 04/10/2026

Le checkout contient déjà la photo, DV-01/DV-02 et FIX1–FIX3. Les neuf fichiers
initialement modifiés, notamment la spec et les quatre PNG, sont préservés.
Instructions du dépôt, contexte, spec et guide CSS de Next installé lus avant
édition. Aucun changement de contenu ni d’API externe dans cette reprise.

Plan : baseline, correction CSS locale sous 400 px, renforcement des assertions,
vérifications puis rapport. Une seule itération de correction ; aucune escalade
de permissions. Écritures locales réversibles, aucun système distant ni donnée
métier (zéro ligne affectée). Sauvegarde des quatre fichiers avant modification :
`/tmp/photo-fix4-backup/`. Aucun commit, push ou déploiement.

Fichiers modifiés dans cette reprise :

- `src/app/(rev01)/rev01.css` : sous 400 px strictement, descente d’un cran de
  `--d-s` vers le palier existant `--t-xl` (26 px). Le retrait passe à 1.04em
  (27.04 px), avec marge compensatrice, pour maintenir les 12 px de séparation
  malgré la réduction de taille. À partir de 400 px, CSS FIX3 conservé.
- `tests/brand-os.spec.ts` : les huit parcours FR/EN × 375/390/768/1440 conservent
  leurs contrôles de viewport, d’intersection Range, d’écart ≥12 px et de mots
  seuls ; deux assertions supplémentaires imposent les limites intérieures de
  la gouttière, mesurées sur `.home-s-wrap`. Aucun seuil assoupli ni texte attendu
  changé. Deny-all conservé.
- `AI_CONTEXT.md` et ce rapport : état de FIX4 et limites de validation.

| Vérification | Résultat de cette reprise |
|---|---|
| Baseline `test:brand-os` | 13/13 réussis. |
| Baseline navigateur, parcours photo/titre | Chromium refusé avant navigation. |
| `npm run lint`, `npx tsc --noEmit` | Réussis. |
| `npm run qa:claims:rev01`, `npm run qa:brand:rev01` | Réussis. |
| `npm run build -- --webpack` | Réussi, 54 pages ; avertissement metadataBase préexistant. |
| `npm run test:brand-os` après build | 13/13 réussis. |
| `test:doctrine`, `test:privacy`, `test:entity` | 10/10, 9/9, 7/7 : 39 tests Node au total avec Brand OS. |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | Refus Chromium : 1 échec d’infrastructure, 172 cas non exécutés. |
| `git diff --check` | Réussi. |
| Grep prescrit dans `src scripts` | Aucune correspondance. Journal inchangé, dont « What is a company operating system? ». |

Logs : `/tmp/photo-fix4-{baseline-node,baseline-browser,lint,static,types,build,brand-tests,node,network}.log`.
Le log `node` contient la suite entité ; doctrine et confidentialité ont aussi
été observées en sortie du terminal (10 et 9 succès respectivement).

Limite : `bootstrap_check_in … MachPortRendezvousServer: Permission denied (1100)`
empêche toute mesure navigateur. Le build et les tests Node ne prouvent pas la
géométrie : vérifier sur l’hôte les coins dans la gouttière, la séparation ≥12 px,
les mots par ligne et les captures aux quatre largeurs FR/EN. Aucune nouvelle
capture ni preuve de production revendiquée ; validation visuelle encore ouverte.

## Reprise FIX5 — 04/10/2026

Source : section FIX5 de la spec présente dans le checkout demandé par Paul.
Elle remplace explicitement l'exigence de gouttière FIX4 par une marge écran de
16 px. Le lot photo et FIX1–FIX4 étaient déjà présents ; ils sont conservés.
Plan exécuté : baseline Node/navigateur, modification ciblée du test, mêmes
contrôles après modification et batterie du dépôt. Une seule itération.
Écriture limitée au checkout local, réversible par les sauvegardes de cette
passe dans `/tmp/photo-fix5-backup/` ; aucune donnée métier ni écriture distante.

Fichiers modifiés pendant cette reprise :

- `tests/brand-os.spec.ts` : suppression de la mesure de `.home-s-wrap` devenue
  inutile ; avant, `corner.left >= pageLeft` et `corner.right <= pageRight` ;
  après, `corner.left >= 16` et `corner.right <= width - 16`. Les huit parcours
  existants FR/EN à 375/390/768/1440 px sont adaptés, sans nouveau scénario.
  Non-intersection Range, séparation ≥12 px, présence des quatre coins, mots
  par ligne, photo, légende, captures et deny-all réseau restent inchangés.
- `AI_CONTEXT.md` et ce rapport : décision FIX5 et résultats de cette passe.

Le CSS et les changements préexistants sont préservés. L'empreinte du CSS avant
et après est identique (`/tmp/photo-fix5-css.sha256`). Aucun commit, push ou
déploiement. Le changement d'assertion suit le nouveau contrat explicite ; il
ne constitue pas une correction du rendu ni une preuve de sa géométrie.

| Vérification | Résultat de cette passe |
|---|---|
| Baseline `test:brand-os` | 13/13 réussis. |
| Parcours photo/titre avant et après | Chromium refusé avant navigation. |
| `npm run lint`, `npx tsc --noEmit` | Réussis. |
| `npm run qa:claims:rev01`, `npm run qa:brand:rev01` | Réussis. |
| `npm run build -- --webpack` | Réussi, 54 pages ; avertissement metadataBase préexistant. |
| `npm run test:brand-os` après build | 13/13 réussis. |
| `test:doctrine`, `test:privacy`, `test:entity` | 10/10, 9/9, 7/7 ; 39 tests Node au total avec Brand OS. |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | 1 échec de lancement Chromium, 172 cas non exécutés. |
| `git diff --check` | Réussi. |
| Grep prescrit dans `src scripts` | Aucune correspondance. Journal préservé, dont « What is a company operating system? ». |

Logs : `/tmp/photo-fix5-*.log`. Le refus macOS
`MachPortRendezvousServer: Permission denied (1100)` empêche les mesures et
captures navigateur. Aucun serveur démarré dans ce sandbox, conformément au
contexte du dépôt. La validation visuelle reste à exécuter sur l'hôte avec le
serveur local sur 3210 : marge écran ≥16 px et séparation texte ≥12 px aux
quatre largeurs, FR/EN. Aucune preuve de production revendiquée.
