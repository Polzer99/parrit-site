# Appel de 15 minutes : seconde reprise sur main

Date : 08/11/2026. Mandat : `REPRISE-SUR-MAIN-2.md`.
Checkout demandé : `4490653a19892776d7a36260075850dcd68ca545` (fusion #367).
Référence relue : `git diff f124fae86 faee226 -- . ':(exclude).codex-handoffs'`.

## Résultat

Lot A repris sur main : réservation bilingue, attribution au calendrier,
bloc partagé après les articles et en fin de thème. Aucun changement de fond
ni arbitrage supplémentaire. Les contrôles locaux passent. La validation
navigateur et les captures restent à faire par Claude sur l'hôte.
Aucun commit, push, déploiement, réservation réelle ni écriture métier.

## Modifications

- `src/app/(rev01)/rendez-vous/page.tsx` : route bilingue FR/EN, H1, description,
  calendrier et mail ; noindex/follow, canonical localisé, hors sitemap.
- `src/system/booking.ts`, `booking.css`, `components/BookingCall.tsx` : textes,
  filtrage de source, UTM conservés, composant à quatre éléments et styles par jetons.
- `src/system/components/CalInline.tsx` : prop facultative `bookingParams`,
  sans changement de configuration lorsqu'elle est absente.
- `src/app/(rev01)/journal/[slug]/page.tsx` et
  `src/app/(rev01)/journal/themes/[theme]/page.tsx` : bloc d'appel ; registre
  partagé des thèmes de main conservé. Corps anglais des articles inchangé.
- `src/lib/registry/cta.ts`, `src/lib/attribution.ts` : cinq destinations
  localisées vers rendez-vous, helper corrigé, ancien BOOKING_URL sans usage retiré.
- `src/proxy.ts`, `src/system/locale.ts` : route couverte par le proxy et
  ajoutée aux chemins traduits.
- `package.json` : ajout de `booking.spec.ts` au gate réseau, tous les scripts
  et les autres specs de main conservés ; lockfile inchangé.
- `AGENTS.md` : section du lot A en tête, à l'identique ; intégralité de main
  conservée. `AI_CONTEXT.md` : paragraphe historique en fin et état de la reprise.
  `TRUTH.md` : seule phrase du rôle mesuré du rendez-vous amendée.
- Documents du lot A restaurés à l'identique : spec initiale,
  `REPRISE-SUR-MAIN.md`, `plan.md`, `rapport.md`. Ces deux derniers décrivent
  l'exécution historique ; `plan-reprise-2.md` et le présent rapport décrivent
  cette exécution.

## Résolution des interactions avec main

Les cinq cibles du registre étaient inchangées depuis la base du lot A.
La modification de #365 porte sur `avecSource` : sa version de main est
conservée, avec source avant l'ancre et remplacement d'une source existante.
Les boutons `intention-*` continuent à mener au contact, sans rechargement.
Le registre partagé des thèmes de #365 est conservé ; seul le bloc final change.
L'ordre des treize sections et les correctifs de #367 restent inchangés.

`tests/anti-slop-copy.spec.ts` conserve toutes les assertions de main, dont les
exemptions exactes du contact et de la FAQ ; le seul ajout exclut le bloc d'appel
autorisé des anciennes interdictions de nom/durée. Les adaptations du rendu
Brand OS conservent également les contrôles de main. Aucun seuil géométrique,
de contraste, de stabilité ni de réseau assoupli.

## Tests ajoutés

Les tests du diff de référence sont repris à l'identique :

- `tests/booking.test.mjs` : **8 tests** de filtrage, bornes de source, UTM
  répétés, cibles FR/EN, rendu, metadata et configuration Cal par défaut.
- `tests/booking-render.test.mjs` : **1 test** des pages réellement compilées,
  sans socket, avec interdiction réseau ; langues, HTTP 200, proxy, destinations,
  bloc unique, emplacement, exec unique et absence du sitemap.
- `tests/booking.spec.ts` : **16 scénarios navigateur**, SDK installé servi
  localement et iframe simulée, deny-all global ; attribution observée dans
  l'URL, sources invalides, absence de stockage/cookie, navigation, captures
  1440/375 et absence de débordement.

Adaptations des chargeurs dans `tests/journal-language-note.test.mjs` et
`tests/privacy-corrections.test.mjs`, sans changement de leurs assertions.
Les huit tests unitaires ont échoué avant l'implémentation puis réussi après.

## Exécution

| Vérification | Avant | Après |
| --- | --- | --- |
| `npm ci --offline --cache /Users/paullarmaraud/.npm` | Réussi, 462 paquets | Dépendances inchangées |
| `npm run lint` | Réussi | Réussi |
| `npm run build -- --webpack` | Réussi | Réussi, 53 pages statiques, RDV dynamique |
| `npm test` | 217/217 | **226/226** |
| `npx tsc --noEmit` | — | Réussi |
| `npm run qa:brand:rev01` | — | Réussi |
| `npm run qa:claims:rev01` | — | Réussi |
| `npm run test:brand-os` | — | **19/19** |
| Revue indépendante, tests ciblés | — | **51/51**, aucun défaut fonctionnel |
| `npm run qa:network:rev01 -- --list` | — | **513 tests**, 16 fichiers |
| Playwright booking, 1 worker / max-failures=1 | — | Échec de lancement Chromium ; 15 non exécutés |
| `git diff --check` | Réussi | Réussi après retrait de la ligne blanche finale |

La revue indépendante a comparé le diff de référence, les comportements de main
et les contrôles d'intégration. Seule correction demandée : ligne blanche finale
dans AI_CONTEXT, retirée. Aucun correctif fonctionnel requis.

Preuves de préservation : les 11 fichiers ajoutés du lot A sont identiques à
`faee226`. HTML SSR de `SinglePage` strictement identique avant/après pour la
même attribution : FR 87 773 octets, EN 85 830 octets. Ce rendu utilise le
chargeur local existant (calendrier et formulaire simulés) ; il ne prouve pas
la géométrie du navigateur. La configuration Cal par défaut est testée séparément.
Accueil, ContactIntentLink, tests intentions/couches/stabilité/cal-link,
`site.config.ts`, lockfile et `public/llms.txt` sont identiques à HEAD.

Spec préexistante conservée, SHA256 :
`4e25cf86ad6008e16427e7bd06e54db7daccb3924a7dc53afce1a86dd26cd08a`.
Aucun fichier sous `.codex-handoffs/`, aucune copie de spec sous `tmp/`.

## Limites et reprise

`next start -p 3210` échoue sur `listen EPERM 0.0.0.0:3210`.
Chromium échoue avant navigation sur MachPortRendezvous / Permission denied,
puis SIGTRAP. Aucune capture ni preuve de rendu navigateur acquise ici.
La suite complète doit être exécutée sur l'hôte, après build :

```sh
npx next start -p 3210
```

Dans un autre terminal :

```sh
npm run qa:network:rev01
```

Les captures de `booking.spec.ts` seront produites dans `test-results/`.
PRODUCTION_PROOF : non établie, hors mandat sans déploiement ; aucune preuve
d'enregistrement effectif de `metadata[source]` par Cal.com revendiquée.

Avertissements non bloquants déjà présents avant changement : metadataBase
sur d'autres routes, MODULE_TYPELESS_PACKAGE_JSON, scripts npm non approuvés.
Journaux de cette exécution : `/private/tmp/appel2-{baseline,final}-*.log`,
`appel2-npm-ci.log`, `appel2-red.log`, `appel2-booking-test.log`,
`appel2-network-list.log`, `appel2-server.log`, `appel2-browser.log`.
