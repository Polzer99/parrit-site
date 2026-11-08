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
