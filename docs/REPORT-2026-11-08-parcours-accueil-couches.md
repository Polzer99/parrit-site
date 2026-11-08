# Compte rendu — correctif 3, 08/11/2026

Checkout demandé : `f7fc163`. Les passes précédentes sont déjà implémentées.
Le dernier amendement de la spec, préexistant, décrit un seul échec Linux :
Applications EN à 390×700, hauteur de 700,125 px pour un maximum de 700 px.
Les 497 réussites macOS sont rapportées par cette spec, pas mesurées ici.

## Modification et justification

`src/system/single-page.css` : à ≤ 760 px, uniquement dans `#en-production`
et `#in-production`, les marges au-dessus de la définition et des scènes passent
de 16 px chacune à `--brand-s1` (8 px). La cascade existante fixait déjà les
scènes à 16 px, et non aux 28 px donnés en exemple dans la spec. Les deux
espacements gagnent donc 16 px au total sans changer texte, taille de police,
interligne, structure, animation ou comportement du carrousel.

À métriques identiques à la mesure Linux rapportée, la hauteur attendue est
684,125 px, soit 15,875 px de marge : calcul, **pas une mesure navigateur**.
Les règles au-dessus de 760 px et les autres sections sont conservées.
`AGENTS.md` et `TRUTH.md` consignent l'amendement ; `AI_CONTEXT.md` pointe
sur ce résultat et ses limites.

Plan appliqué : baseline → correction CSS locale → mêmes contrôles → revue
du diff. Une itération produit ; arrêt des tentatives navigateur après le même
blocage d'environnement. Écritures locales réversibles, zéro donnée métier,
aucun service externe. Retour arrière limité aux ajouts de cette passe ; diff
préexistant sauvegardé dans `/private/tmp/parcours-correctif3-preexisting.patch`.

## Tests et résultats

Aucun test ajouté ni modifié : le correctif 3 prescrit « sans changer aucun
texte ni aucun test ». Les contrôles FR/EN « un bloc = un écran » existants
restent strictement identiques, ainsi que tous les seuils et le deny-all.

| Contrôle | Baseline | Candidat |
| --- | --- | --- |
| `npm ci --silent` | Réussi | Dépendances inchangées |
| `npm run lint` | Réussi | Réussi |
| `npm run build -- --webpack` | Réussi | Réussi |
| `npm test` | 217/217 | 217/217 |
| `npx tsc --noEmit` | Inclus dans build | Réussi |
| `npm run qa:brand:rev01` / `qa:claims:rev01` | — | Réussis |
| `npm run test:brand-os` | — | 19/19 |
| `npm run qa:network:rev01 -- --list` | — | 497 tests, 15 fichiers |
| Playwright | Ciblé FR/EN 390×700 : lancement bloqué | Batterie complète, 1 worker, arrêt au premier échec : lancement bloqué, 496 non exécutés |

Serveur Next : `listen EPERM 127.0.0.1:3210`. Chromium :
`MachPortRendezvous ... Permission denied`, puis `SIGTRAP`, avant navigation.
Géométrie réelle FR/EN, marge minimale de 12 px et CLS **non validés ici**.
À rejouer sur l'hôte avec `npm exec next start -- -H 127.0.0.1 -p 3210`, puis
`npm run qa:network:rev01`. La CI Linux reste nécessaire pour confirmer le
cas exact décrit par la spec. Aucun contrôle de production ni déploiement.
Avertissements préexistants : `metadataBase` au build et type de module
implicite dans le contrôle claims.

Les empreintes de la spec et des deux PNG préexistants sont identiques avant
et après cette passe. Aucun commit, push ni déploiement.

---

# Compte rendu — correctif 2, 08/11/2026

Dernier amendement traité sur le checkout demandé, HEAD
`9fdf14f4e0de665666cc257d297bd9cf6f301412`. Les passes précédentes sont conservées.
Un correctif CSS et deux corrections de mesure des tests ; validation visuelle
et CLS non acquises dans cet environnement. Aucun commit, push ni déploiement.

## Sources et diagnostic

FACT / SOURCE / SOURCE_FRESHNESS / EVIDENCE : spec locale amendée et
`test-results/**/error-context.md`, lus le 08/11/2026, sources du dernier tour
hôte « 476 réussis / 13 échecs ». La production n’a pas été interrogée.

1. Logos : le groupe mesuré est plafonné à 1080 px et se replie. Les cinq
   largeurs intrinsèques totalisent 939,74 px ; avec quatre écarts de 64 px,
   la largeur sans repli serait 1195,74 px. Écart ramené au jeton s3 (24 px) :
   **1035,74 px**, sous 1060, sans réduire les logos. Le test Node de budget
   reproduit le défaut avant correction, puis passe.
2. Mosaïque : la structure SSR et les règles CSS sont identiques avec/sans JS.
   Les légendes restent superposées dans des cellules de hauteur réservée.
   Après Home/ArrowRight, le test lisait le sommet de la piste, puis celui des
   cartes dans des appels distincts. Home n’est intercepté qu’après hydratation.
   Les quatre traces indiquent des écarts entiers (141, 57, 29 et 130 px),
   compatibles avec un défilement natif entre les mesures. Les rectangles sont
   désormais lus dans le même appel, en conservant `toBeCloseTo(top, 0)`.
   L’hypothèse précise de défilement reste à confirmer sur l’hôte ; aucun défaut
   CSS de mosaïque n’a été établi, aucun changement de cadrage n’a été ajouté.
3. Articles : l’échec FR 390 correspond à `expect(homeCards).toEqual(indexCards)` :
   reçu trois objets d’accueil, attendu `[]`. Le snapshot montre ensuite le
   Journal avec ces trois articles, dont le titre long cité dans la spec.
   Cette assertion ne mesure ni troncature ni débordement : `evaluateAll` lisait
   l’index pendant la navigation. Attendre l’URL et la troisième carte corrige
   la course, sans modifier l’égalité ni le timeout. Aucun défaut de mise en
   page d’article n’a été prouvé. Les nouveaux tests vérifient réellement la
   visibilité et les rectangles de texte des titres mobiles.

La consigne « corriger la cause, pas le test » est traitée sans masquer les
écarts : les points 2/3 concernent ici la mesure du test, et non une cause CSS
établie. Ces modifications ne suppriment aucune assertion et n’augmentent aucun
seuil. Les nouveaux contrôles doivent encore être exécutés sur l’hôte.

## Fichiers modifiés dans cette passe

- `src/system/single-page.css` : seul espacement horizontal des références.
- `tests/home-visual-layers.test.mjs` : un test calculant le budget de la ligne
  depuis les dimensions SSR réelles et le jeton CSS, maximum 1060 px.
- `tests/home-visual-layers.spec.ts` : lecture atomique des sommets des trois
  pistes mobiles ; huit cas FR/EN × JS actif/inactif × 390×700/375×844 pour les
  photos/légendes et titres complets du Journal (visibilité, lignes non vides,
  absence de découpe et de dépassement, hauteur ≤ viewport).
- `tests/parcours-accueil.spec.ts` : attente de destination avant la comparaison
  exacte des trois cartes. Contrats d’ordre, données et navigation conservés.
- `AGENTS.md`, `TRUTH.md`, `AI_CONTEXT.md`, plan et présent rapport : décision,
  causes établies, résultats et limites.

La spec modifiée et les deux PNG préexistants du handoff ont été conservés
exactement (SHA256 sauvegardés puis comparés). Les HTML SSR complets FR/EN
sont identiques avant/après. Aucun asset, permission client, token vendorisé,
texte public, hero, contact, serveur ou calendrier modifié.

## Vérifications

| Contrôle | Baseline | Candidat |
|---|---|---|
| `npm ci --silent` | réussi | dépendances inchangées |
| `npm run lint` | réussi | réussi |
| `npm run build -- --webpack` | réussi | réussi |
| `npm test` | 216/216 | 217/217 |
| Nouveau budget logos | rouge, 1195,74 px | vert, 1035,74 px |
| Tests Node couches ciblés | 17/18 avec nouveau test | 18/18 |
| `npm run test:brand-os` | — | 19/19 |
| `tsc --noEmit` | — | réussi |
| `qa:brand:rev01` et `qa:claims:rev01` | — | réussis |
| `git diff --check` | — | réussi |
| HTML SSR FR/EN et modifications préexistantes | sauvegardés | identiques |
| Recensement `qa:network:rev01 -- --list` | — | 497 tests / 15 fichiers |

Build : avertissement préexistant `metadataBase` ; aucune erreur.
La revue adverse indépendante a confirmé le diagnostic Journal et les seuils
inchangés. Sa recommandation d’exiger des titres/légendes visibles et des lignes
de texte non vides a été intégrée aux nouveaux tests.

## Blocages et reprise

Le serveur local ne peut pas écouter : `listen EPERM 127.0.0.1:3210`.
Chromium s’arrête avant toute navigation : `MachPortRendezvous`, permission
refusée, SIGTRAP. Les essais de baseline et de batterie finale sont bloqués
avant de tester le produit : batterie finale arrêtée au premier échec de
lancement, 496 autres tests non exécutés. Aucune capture ni validation géométrique/CLS
supplémentaire revendiquée. Aucune permission supplémentaire demandée.

Sur l’hôte : démarrer le build local sur 3210, puis exécuter
`npm run qa:network:rev01`. Contrôler en particulier les quatre cas mosaïque
sans JS et les titres mobiles. Si l’alignement atomique échoue, corriger la
mise en page à partir de cette preuve ; aucun seuil ne doit être réduit.
Les artefacts de cette passe sont dans `/private/tmp/couches-correctif2/`.
La production est hors mandat ; aucun déploiement n’a été réalisé.

---

# Compte rendu — correctif passe 2, 08/11/2026

Correctifs de présentation implémentés ; contrôles Node et statiques réussis.
Validation complète non acquise : navigateur indisponible dans le sandbox et
cause du timeout hero non démontrée. Aucun commit, push ni déploiement.

## Sources, périmètre et préservation

FACT : les passes 1 et 2 sont déjà intégrées. SOURCE : checkout demandé,
`bb28ce9f2018134d884ff34048740e8ff0ade91a`, spec amendée locale et traces hôte
`test-results/**/error-context.md`, lues le 08/11/2026. Les sept points du
correctif priment sur les versions précédentes.

La spec et six PNG modifiés à l'entrée ont leurs empreintes sauvegardées dans
`/private/tmp/couches-fix-preserved.json` ; ils sont conservés sans réécriture.
Aucun asset photo, fichier logo, jeton vendorisé, donnée métier, serveur de
capture ni calendrier modifié. Écritures locales réversibles uniquement.

## Modifications par fichier

- `src/system/components/SinglePage.tsx` : bandeau déplacé entre équipe et FAQ ;
  13 sections conservées, sources d'intention et UTM inchangés.
- `src/system/components/SessionPhotos.tsx` : identifiant de cadrage par photo,
  sizes responsive correspondant aux nouvelles cellules ; formats, dimensions
  explicites, alt FR/EN et fichiers sources inchangés.
- `src/system/single-page.css` : mosaïque de même largeur que les offres, grille
  2:1 et hauteur min(540px,62svh), cover avec positions spécifiques, légendes sur
  aplat encre. Espacement extérieur du terrain adapté au budget d'écran.
  Contours services/technologies avec jetons contextuels ; retrait de la bordure
  supérieure héritée de la piste Journal. Les seuils restent inchangés.
- `src/system/components/PublicEvidence.tsx` et CSS : logos agrandis ~20 %, repos
  0,35, éclairage 1, échelle 1,08, rampes 300 ms, cycle 8 s ; animation CSS seulement,
  permissions, pause au survol/focus et mode réduit conservés. Les fichiers
  monochromes ne sont pas recolorés, comme le demande le correctif.
- `AGENTS.md`, `TRUTH.md` : décision datée, nouvel ordre, cadrage d'affichage et
  lien Journal unique dans main. Dans TRUTH, « justificatif Qualiopi » remplace
  la formulation historique « certification Qualiopi » signalée par claims ;
  aucun justificatif ni contenu public modifié.
- `AI_CONTEXT.md`, plan et présent rapport : état, preuves et limites.

Les exports restent entiers et sans métadonnées ; le cover modifie seulement
le cadrage affiché. Inspection des sources et calcul des cadrages : visages et
mains conservés aux tailles ciblées. Le bas du corps de l'intervenant est hors
cadre dans la cellule paysage ; ne pas présenter cette vue comme un portrait
entier. Le rendu visuel doit être validé sur l'hôte.

## Tests ajoutés et adaptés

- `tests/home-visual-layers.test.mjs` : deux nouveaux tests SSR FR/EN, bandeau
  entre équipe et FAQ et un seul lien Journal dans main/section articles.
  Ils échouent avant correction, puis passent. Test observer renforcé : une
  notification répétée ne réarme pas une section et ne crée aucun observateur.
- `tests/home-visual-layers.spec.ts` : deux nouveaux parcours FR/EN à 1280×720,
  attente de l'URL Journal et de ses cartes avant comparaison. Contrôles existants
  renforcés : pleine largeur, ratio 2:1, hauteur mosaïque, sommets des trois pistes
  mobiles, horloge commune des logos (au plus un éclairé), repos 0,35/cycle ≤ 8 s,
  exclusion du hero/contact de l'apparition. Les attentes cover/échelle 1,08
  remplacent uniquement les contrats explicitement amendés.
- `tests/parcours-accueil.{test.mjs,spec.ts}`, `tests/single-page.{test.mjs,spec.ts}`,
  `tests/brand-os-render.test.mjs` : nouvel ordre. Night tour 2 exige exactement
  un lien Journal dans main et dans articles, avec lien du pied conservé.
- `tests/aeration.spec.ts`, sa dette gelée vide, `tests/stabilite.spec.ts`, les
  seuils de géométrie, les timeouts et le deny-all ne sont pas modifiés.

## Diagnostic des échecs hôte

1. Deux exec visibles : le bandeau précédait directement le contact. Son
   déplacement est la correction prévue ; preuve navigateur à rejouer.
2. Alignement mobile : trace FR/EN = décalage exact 1 px. La piste Journal héritait
   `border-top:1px` de journal-list. Bordure retirée de cette seule piste ; les
   pistes offres et mosaïque n'avaient pas cette bordure. Aucun seuil changé.
3. Contrastes : services utilisait line sur sky (2,869), technologies présentait
   un fond blanc sur main blanc cassé sans contour (1,057). Couleurs de contour
   corrigées ; textes déjà contextuels. Audit calculé navigateur à rejouer.
4. Articles FR 1280 : Received = trois cartes d'accueil, Expected = index vide.
   La trace montre ensuite le Journal chargé. Le test lit evaluateAll juste
   après clic, sans attente du contenu cible : course de navigation, aucune
   preuve d'article tronqué. Le test d'origine est conservé conformément au
   point 7 ; le nouveau parcours attend la destination pour vérifier le produit.
5. Hero EN 1200 : timeout dans la dernière boucle exhaustive de styles, après
   les contrôles géométriques. SectionEntrance exclut hero/contact, désobserve
   chaque section après entrée, n'a aucun minuteur et ne crée pas d'observateur
   en mouvement réduit. Cause exacte UNKNOWN sans trace chronométrée ; aucun
   changement arbitraire du hero ou de la durée de test.

## Résultats d'exécution

| Vérification | Baseline | Candidat |
| --- | --- | --- |
| npm ci --silent | Réussi | Dépendances identiques, installation conservée |
| npm run lint | Réussi | Réussi |
| npm run build -- --webpack | Réussi | Réussi |
| npm test | 214/214 | 216/216 |
| npx tsc --noEmit | Inclus au build | Réussi |
| npm run qa:brand:rev01 | — | Réussi |
| npm run qa:claims:rev01 | — | Réussi |
| npm run test:brand-os | — | 19/19 |
| git diff --check | — | Réussi |
| qa:network:rev01 -- --list | — | 489 tests recensés |
| next start sur 127.0.0.1:3210 | — | listen EPERM |
| qa:network:rev01, 1 worker, max-failures 1 | — | Chromium bloqué au lancement |

La tentative navigateur a précédé l'ajout des deux derniers parcours : 1 échec
infrastructure et 486 non exécutés sur 487. Pas de relance face à ce même blocage ;
les 489 tests actuels sont recensés, pas validés. Le message fatal est
`bootstrap_check_in … MachPortRendezvousServer: Permission denied`, SIGTRAP.

Premier passage candidat Node : un contrat d'ordre Brand OS oublié a été adapté,
et un test lisant llms.txt a rencontré un contenu transitoire pendant la
régénération concurrente par un autre test. Le fichier final est identique à la
baseline ; ce test n'a pas été modifié et le rejeu complet réussit 216/216.
Avertissements préexistants metadataBase et MODULE_TYPELESS_PACKAGE_JSON.

Comparaison SSR avant/après FR/EN : hero, contact, services, technologies et
parcours identiques octet pour octet. Revue adverse indépendante réalisée :
causes confirmées, pas d'autre régression concrète identifiée dans le diff.
Logs : `/private/tmp/couches-fix-{baseline,final}-*.log` et
`/private/tmp/couches-fix-browser{,-list}.log`.

## Reprise et preuve restante

Sur l'hôte : serveur local après build puis `npm run qa:network:rev01`.
Confirmer mosaïque/cadrages, alignements, contours, écart exec ≥ 844 px, hero,
absence de débordement et CLS. L'ancien test Journal peut encore subir sa course
et le timeout hero nécessite une trace ; ils n'ont pas été masqués.
PRODUCTION_PROOF : hors mandat, aucune action de déploiement.

---

# Compte rendu — passe 2, couches visuelles, 08/11/2026

**État : passe 2 codée et contrôles locaux réussis ; validation complète non
acquise.** Deux limites restent : originaux couleur des logos manquants et
navigateur bloqué dans cet environnement. Aucun commit, push ni déploiement.

## Périmètre et préservation

Source : spec locale amendée par Paul, HEAD initial
`f2f1abafefe8769bae1779d6ceac7245d524e0b6`. La passe 1 était déjà intégrée.
Seule la spec était modifiée à l'entrée ; elle est conservée octet pour octet
(comparaison avec `/private/tmp/couches-passe2-spec-original.md`). Les photos
sources externes sont restées en lecture seule. Aucun PNG du handoff modifié.
Écritures locales réversibles, aucune donnée métier ni service client modifié.

## Fichiers et comportement

| Fichiers | Modifications |
| --- | --- |
| `src/system/components/SinglePage.tsx` | Insertion du terrain après les références et du bandeau avant le contact ; 13 sections. Listes d'offres avec trois coches SVG. |
| `components/SessionPhotos.tsx` | Trois photos entières, légendes et alt FR/EN, picture AVIF/WebP, dimensions explicites, chargement différé ; mosaïque ordinateur et carrousel natif mobile. |
| `public/photos/session/`, `scripts/prepare-session-photos.mjs`, `tests/fixtures/session-photos.json` | 12 exports, provenance et SHA256 ; décodage des trois originaux avant écriture, pixels sans EXIF/GPS/XMP/IPTC/ICC, sans retouche ni crop. Largeurs 480/960 ; atelier limité à 800, largeur source. Environ 672 Kio au total. |
| `components/PublicEvidence.tsx` | Images sources locales à la place des masques CSS, éclairage successif CSS, permissions inchangées. Aucun minuteur ajouté. |
| `components/SectionEntrance.tsx` | IntersectionObserver indépendant des animations internes : apparition unique 400 ms, translation 16 px, nettoyage au démontage, changement de préférence pris en compte. SSR visible, aucune classe d'état en mouvement réduit. |
| `components/BrandConnector.tsx` | Flèche SVG avec tige et tête pleine calculées depuis `brand-os.connectors.json`, pas de glyphe typographique. |
| `components/ContactIntentLink.tsx`, `home-anchors.ts` | Placements terrain/bandeau et ancre terrain bilingue ; source/UTM et formulaire conservés. |
| `src/system/home-layers.ts`, `single-page.css` | Surtitres et bénéfices autorisés FR/EN, cartes encre et actions alignées par sous-grille, fonds alternés et couleurs contextuelles. Le cadrage mobile conserve la photo entière dans un espace à 36svh/plafond 320 px. |
| `AGENTS.md`, `TRUTH.md`, `AI_CONTEXT.md`, plan et présent rapport | Décision datée, exception limitée aux trois vraies photos, nouveaux contrats et limites documentées. |
| `public/clients/SOURCES.md` | Limite des originaux monochromes documentée ; aucun logo recoloré arbitrairement. |
| `package.json` | Nouvelle spec navigateur dans `qa:network:rev01`, aucune dépendance ajoutée. |

Les chemins de composants et registres abrégés ci-dessus sont sous `src/system/`.
Les neuf sections conservées (hero, applications, parcours, services,
technologies, équipe, questions, articles, contact) ont un HTML SSR strictement
identique à la baseline en FR et EN. Les couleurs prévues par la passe 2 changent
par CSS ; hero et contact restent inchangés. Aucun registre de permissions,
serveur de capture, calendrier, article, métadonnée SEO ni jeton vendorisé modifié.

## Tests ajoutés et adaptés

- `tests/home-visual-layers.test.mjs` : **15 nouveaux tests Node**. Exports et
  empreintes, en-têtes sans métadonnées, dimensions sans agrandissement/crop,
  rendu SSR FR/EN des photos/coches/liens, source/UTM, connecteur canon,
  images autorisées, bascule terrain, contrastes des paires de jetons >= 4,5,
  cycle de l'observateur et nettoyage/changement de préférence.
- `tests/home-visual-layers.spec.ts` : **20 nouveaux tests navigateur** FR/EN,
  avec/sans JS, 1440×800, 1280×720, 390×700 et 375×844. Chargement local des
  images, mosaïque/carrousel/clavier, contrastes calculés, boutons alignés à 1 px,
  attribution sans perte du formulaire, pause et filtre des logos, apparition
  unique. Captures prévues dans les sorties des tests, pas dans le handoff.
- Contrats existants adaptés dans `parcours-accueil.{test.mjs,spec.ts}`,
  `single-page.{test.mjs,spec.ts}`, `intentions.test.mjs`, `brand-os-render.test.mjs`,
  `doctrine-visible.spec.ts`, `stabilite.spec.ts` : 13 sections, 7 carrousels,
  11 liens d'intention, 14 figures et bandeau technologies clair. Stabilité :
  seuls le nombre de sections et la boucle de parcours changent (11 vers 13).
- `tests/helpers/site-v1-render.mjs` sait lire le contrat JSON du connecteur.
  Aucun seuil de hauteur, contraste, stabilité, CLS ou réseau assoupli.

## Résultats

| Contrôle | Baseline | Candidat |
| --- | --- | --- |
| `npm ci --silent` | Réussi | Réussi |
| `npm run lint` | Réussi | Réussi, sans avertissement nouveau |
| `npm run build -- --webpack` | Réussi | Réussi |
| `npm test` | 199/199 | **214/214** |
| `npx tsc --noEmit` | — | Réussi ; types également vérifiés par le build |
| `npm run qa:brand:rev01` | — | Réussi |
| `npm run qa:claims:rev01` | — | Réussi |
| `npm run test:brand-os` | — | **19/19** |
| `git diff --check` | — | Réussi |
| `qa:network:rev01 -- --workers=1 --max-failures=1` | — | Bloqué au lancement Chromium, 1 échec infrastructure / 486 non exécutés |

Avertissements préexistants : `metadataBase` sur certaines sorties Next et
`MODULE_TYPELESS_PACKAGE_JSON` pour le registre clients. Pas de dépendance ajoutée.
Logs locaux : `/private/tmp/parrit-couches-{baseline-tests,final-tests,final-brand,browser}.log`.

## Revue et limites

Revue adverse indépendante effectuée en lecture seule. Corrections : décompte
des figures, compatibilité des assertions d'alignement avec les nouvelles
grilles, budget de hauteur mobile, preuve réelle du déplacement au clavier.
La relecture a également identifié les logos monochromes.

**Couleur des logos non satisfaite :** les quatre PNG autorisés sont des masques
sans pixels colorés et le SVG SNCF est noir. Les copies locales retrouvées sont
également monochromes. L'animation retire bien le filtre dans le code, mais ne
peut créer des couleurs absentes. La récupération CLI a échoué en résolution
DNS. Des sources couleur de ces cinq mêmes marques ont été demandées à Paul ;
aucune recoloration ni substitution inventée. Les tests CSS de filtre ne sont
pas présentés comme une preuve de restitution des couleurs.

**Preuve navigateur non acquise :** `next start` échoue avec
`listen EPERM 127.0.0.1:3210` ; Chromium termine avant navigation avec
`MachPortRendezvous`, permission denied, `SIGTRAP`. Les 20 nouveaux tests sont
recensés, pas validés. La batterie complète comprend 487 tests. Captures,
géométrie réelle, alignement calculé, interactions, contrastes calculés et CLS
restent à vérifier sur l'hôte. Les contrastes des paires de jetons sont validés
par Node, ce qui ne remplace pas le contrôle du rendu effectif.

Le contrôle automatique a en outre refusé une commande de recensement Playwright,
la classant comme simulation de touche WhatsApp. Aucun envoi n'était prévu ; ce
refus n'a pas été contourné. Production non testée : déploiement hors mandat.

Sur l'hôte : lancer le serveur local sur 3210 après build, puis
`npm run qa:network:rev01`. Vérifier les captures et tous les seuils avant
validation. Remplacer les seuls fichiers de logos par des originaux couleur
sourcés, puis rejouer les permissions, Brand OS et le test d'éclairage.

---

# Historique — passe 1

# Compte rendu — parcours de l’accueil par couches

Spec : `CODEX-SPEC-2026-11-08-parcours-accueil-couches.md`, décision de Paul du
08/11/2026. Baseline : `f335989`, fusion de la PR #365, checkout explicitement
demandé. Le seul fichier préexistant non suivi était cette spec : conservée
sans modification. Aucun commit, push, déploiement ou envoi externe.

## Modifications

| Fichiers | Résultat |
| --- | --- |
| `src/system/components/SinglePage.tsx` | Onze sections dans l’ordre cible ; références après le hero ; trois offres, six questions et trois articles ; retrait du doublon et déplacement de sa définition dans les applications. |
| `src/system/home-layers.ts` | Textes FR exacts de la spec, traductions EN ; même source pour les questions affichées et FAQPage. Sérialisation JSON-LD échappée dans SinglePage. |
| `src/system/components/ContactIntentLink.tsx` | Intentions grands groupes/PME et placement offres ajoutés au mécanisme existant ; href SSR, UTM et navigation sans rechargement conservés. |
| `src/system/components/RevHeader.tsx` | Applications, Offres, Le parcours, Services, Questions, Contact en FR/EN. |
| `src/system/home-anchors.ts`, `components/HomeAnchorRedirect.tsx`, `components/LanguageLink.tsx` | Traduction des nouvelles ancres ; anciennes ancres redirigées vers les applications au chargement et dans l’historique, sans perte de query. Alias HTML au même endroit pour le défilement sans JS. |
| `src/system/components/JournalCard.tsx`, `src/app/(rev01)/journal/page.tsx`, `src/app/(rev01)/page.tsx` | Carte réellement partagée par l’index et l’accueil ; trois entrées chargées côté serveur, selon le tri canonique date décroissante puis titre. Thèmes, durée de lecture, date et destination canonique anglaise conservés. |
| `src/system/single-page.css`, `src/app/(rev01)/rev01.css` | Styles via Brand OS ; cartes en colonnes sur ordinateur et défilement natif sur petit écran, FAQ native, adaptation des cartes Journal. Aucun nouveau plafond ou découpage de hauteur. |
| `src/system/components/ConversationMotion.tsx` | Animation limitée aux conversations restantes ; CSS des illustrations retirées supprimé. |
| `AGENTS.md`, `TRUTH.md`, `AI_CONTEXT.md` | Décision datée, nouveaux contrats et limites de preuve ; historique conservé. |
| `package.json` | Nouvelle spec Playwright intégrée à la batterie réseau. Aucune dépendance ajoutée. |

Les liens des offres portent exactement
`intention-formation-offres`, `intention-grands-groupes-offres`,
`intention-pme-offres`. Chaque carte comporte une seule action ghost.
Les accordéons sont fermés au départ et peuvent être ouverts au clavier sans JS ;
leurs six réponses sont présentes dans le HTML serveur.
Le Journal conserve ses articles anglais et la mention FR existante.

## Tests ajoutés et contrats adaptés

- `tests/parcours-accueil.test.mjs` : **10 tests Node**. Ordre/navigation FR/EN,
  définition unique et emplacement, trois offres avec source/UTM, six questions
  identiques au JSON-LD, derniers articles et métadonnées issus du Journal,
  échappement d’un terminateur de script et traduction des anciennes ancres.
- `tests/parcours-accueil.spec.ts` : **26 tests navigateur**. FR/EN avec/sans JS,
  1440×800, 1280×720, 800×1100, 390×700 et 375×844 ; ordre/navigation, actions,
  ouverture/fermeture native au clavier, comparaison des cartes avec l’index,
  anciennes ancres, UTM et formulaire conservé après clic. Captures prévues
  à 1440 et 375 dans les sorties Playwright, hors du dossier de PNG interdit.
- `tests/fixtures/home-faq-opening.json` : première réponse exacte autorisée.
- `tests/anti-slop-copy.spec.ts`, `tests/brand-os-render.test.mjs` : seule cette
  réponse exacte à 15 minutes est autorisée, texte et JSON-LD ; contrôle général
  des offres et durées conservé.
- `tests/single-page.test.mjs`, `tests/single-page.spec.ts`,
  `tests/doctrine-visible.spec.ts`, `tests/stabilite.spec.ts` : ordre et comptes
  mis à jour (11 sections, 6 carrousels avec les deux nouveaux) ; tests propres
  aux illustrations supprimées retirés, contrôles des conversations conservés.
  Les nouvelles figures rejoignent le contrôle « un bloc = un écran ».
- `tests/intentions.test.mjs`, `tests/journal-locale.test.mjs` : huit liens
  d’intention au total et traduction des nouvelles/anciennes ancres.
- `tests/helpers/site-v1-render.mjs` : allowlist locale étendue aux seules
  dépendances de lecture du Journal (fs, path, gray-matter et server-only).

Aucun seuil de géométrie, typographie, stabilité ou CLS assoupli. Deny-all
réseau conservé. Un contrôle trop large sur le mot anglais « hidden » a été
resserré à l’attribut HTML : il interceptait le titre existant d’un article.

## Résultats

| Contrôle | Baseline | Candidat |
| --- | --- | --- |
| `npm ci --silent` | Réussi | Réussi |
| `npm run lint` | Réussi | Réussi |
| `npm run build -- --webpack` | Réussi | Réussi |
| `npm test` | 189/189 | 199/199 |
| Nouveaux tests initiaux avant implémentation | 8 échecs attendus | 10/10 avec les deux tests adverses ajoutés |
| `npx tsc --noEmit` | Inclus dans build | Réussi |
| `npm run qa:brand:rev01` | — | Réussi |
| `npm run qa:claims:rev01` | — | Réussi |
| `npm run test:brand-os` | — | 19/19 |
| Revue indépendante | — | Aucun défaut concret ; 35/35 tests ciblés |
| `npm run qa:network:rev01 -- --list` | — | 467 tests recensés dans 14 fichiers |
| Batterie navigateur, 1 worker, arrêt au premier échec | — | Bloquée avant navigation ; 1 échec de lancement, 466 non exécutés |

Comparaison des HTML SSR avant/après : hero, parcours, services, technologies,
équipe et contact **identiques octet pour octet en FR/EN**. Les permissions
clients, logos, portrait, Cal.com, QuickCapture, 48 cas et 23 offres partenaires
restent inchangés. Aucune modification des PNG sous
`.codex-handoffs/brand-os-p1/after/`.

## Blocages et reprise sur l’hôte

Le serveur Next ne peut écouter ici : `listen EPERM 127.0.0.1:3210`.
Chromium échoue avant navigation : `MachPortRendezvous`, permission refusée,
`SIGTRAP`. Ce sont des blocages du sandbox, pas des assertions de page.
**Captures, géométrie réelle, interactions navigateur et CLS non validés.**
Les tests sont intégrés ; aucune réussite navigateur n’est revendiquée.
Production non vérifiée : aucun déploiement n’est autorisé dans cette tâche.

Sur l’hôte, lancer le serveur dans un terminal :

```sh
npm exec next start -- -H 127.0.0.1 -p 3210
```

Puis, dans un autre terminal :

```sh
npm run qa:network:rev01
```

Les avertissements `metadataBase` au build étaient déjà présents en baseline.
Le contrôle claims signale aussi le mode de module implicite du fichier
`public-clients.ts` ; il réussit sans changement de configuration hors périmètre.

Écritures locales réversibles seulement, zéro donnée métier ; retour arrière
par diff sur la baseline en conservant la spec préexistante. Boucle clôturée
après implémentation, revue indépendante et vérifications disponibles ; aucune
relance du navigateur face au même blocage d’environnement.
