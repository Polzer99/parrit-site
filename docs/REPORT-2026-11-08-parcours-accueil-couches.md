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
