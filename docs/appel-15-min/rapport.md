# Rapport d'implémentation : appel de 15 minutes, lot A

Date : 08/11/2026. Source : `../CODEX-SPEC-2026-11-08-appel-15-min-lot-a.md`.

## Résultat

La page de réservation bilingue, le bloc partagé et l'attribution sont implémentés.
Les vérifications hors navigateur passent. Les captures et la géométrie restent
non vérifiées : le sandbox refuse le serveur local et Chromium avant navigation.
Aucune réservation réelle ni validation de collecte côté Cal.com revendiquée.
Aucun commit, push ou déploiement.

## Fichiers

- `src/app/(rev01)/rendez-vous/page.tsx` : page FR/EN, metadata localisée,
  noindex/follow, H1, phrase, calendrier et mail ; hors sitemap.
- `src/system/booking.ts` : textes communs, source limitée à 1–80 caractères
  minuscules/chiffres/tirets ; rejet des tableaux, espaces et sauts de ligne.
  Transmission des seuls `metadata[source]` et `utm_*`, tableaux UTM conservés.
- `src/system/booking.css` : composition avec les jetons existants, bouton
  intrinsèque dès 600 px et pleine largeur en dessous ; aucun style d'article modifié.
- `src/system/components/BookingCall.tsx` : quatre éléments, langue explicite,
  lien attribué, un exec et repli mail neutre.
- `src/system/components/CalInline.tsx` : prop `bookingParams` facultative.
  Sans prop, config strictement identique. La page remonte le calendrier si les
  paramètres changent : le SDK initialise son iframe une seule fois par montage.
- `src/app/(rev01)/journal/[slug]/page.tsx` : bloc après le corps anglais et
  avant les liens de lecture. Contenu MDX et mise en page existante conservés.
- `src/app/(rev01)/journal/themes/[theme]/page.tsx` : dernière section remplacée.
- `src/system/locale.ts`, `src/proxy.ts` : chemin traduit et matcher.
- `src/lib/registry/cta.ts`, `src/lib/attribution.ts` : correction des cinq CTA
  et de `buildRdvHref`, `avecSource` seul pose source ; suppression de BOOKING_URL
  sans consommateur. Les cinq UTM de visite existants sont conservés par le helper.
- `AGENTS.md` : ajout daté en tête seulement. `TRUTH.md` : seule phrase demandée
  du rôle du site modifiée, pour limiter le conflit avec la PR concurrente.
- `AI_CONTEXT.md` : état du lot ; `docs/appel-15-min/plan.md` et ce rapport.
- `package.json` : nouvelle spec navigateur incluse dans `qa:network:rev01`.

Accueil, calendrier configuré dans `site.config.ts`, tests `cal-link.test.mjs`
et `stabilite.spec.ts`, FormIA, corpus, sitemap et chaîne de publication inchangés.
Les hooks prebuild et tests régénèrent llms à l'identique : aucun diff de
`public/llms.txt`. Le lockfile est inchangé.

La spec non suivie préexistante est conservée, SHA256 :
`b2cada2882f71a4b490ffe5fff35ea1483e9cf58124fc1fd53a95af8d68b7adf`.
Baseline du checkout explicitement demandé : `27967907c3280b8d4afbc0c2a1768deccde4a767`.

## Tests ajoutés et adaptations

**9 tests Node supplémentaires** :

- `tests/booking.test.mjs` : filtrage et limites de source, UTM répétés,
  chemins des cinq CTA et helper, contenu bilingue, noindex/canonical, prop Cal,
  bloc à quatre éléments, et config sans attribution inchangée.
- `tests/booking-render.test.mjs` : serveur Next compilé, sans socket et avec
  réseau interdit ; routes en 200, proxy FR/EN et requête conservée, bloc unique,
  emplacement, langue du corps, exec unique, cinq destinations et sitemap.

**16 scénarios Playwright** dans `tests/booking.spec.ts` : SDK réellement
installé servi localement, iframe simulée, URL demandée et paramètres, sources
invalides, absence de cookies, stockage interdit, destinations en 200, ordre,
largeurs et absence de débordement ; captures à 1440 et 375 px.
Deny-all partagé et service workers bloqués. Aucun service réel contacté.

Adaptations nécessaires, sans modification des assertions de langue ou vie privée :
`tests/journal-language-note.test.mjs` charge le vrai BookingCall ;
`tests/privacy-corrections.test.mjs` autorise les deux dépendances locales ajoutées.
`tests/brand-os-render.test.mjs` et `tests/anti-slop-copy.spec.ts` excluent le seul
bloc autorisé des anciennes interdictions de durée/identité ; ses contraintes
sont vérifiées par les nouveaux tests. Métadonnées, attributs, JSON-LD, RSS et
llms restent contrôlés. Aucun seuil géométrique assoupli.

Les articles conservent leur URL canonique anglaise et leur mécanisme actuel de
langue d'interface. Le rendu FR du bloc d'article est vérifié dans le contexte
serveur FR existant ; aucune nouvelle URL d'article FR ni négociation ajoutée.
Le parcours navigateur article porte donc sur l'URL canonique EN ; thèmes et
réservation ont les parcours FR/EN.

## Résultats d'exécution

| Vérification | Baseline | Final |
| --- | --- | --- |
| `npm ci --offline --cache /Users/paullarmaraud/.npm` | Réussi | Dépendances inchangées |
| `npm run lint` | Réussi | Réussi |
| `npm run build -- --webpack` | Réussi | Réussi, 53 pages statiques générées, route RDV dynamique |
| `npm test` | 166/166 | **175/175** |
| `npm run qa:brand:rev01` | — | Réussi |
| `npm run qa:claims:rev01` | — | Réussi |
| `npm run test:brand-os` | — | **19/19** |
| `git diff --check` | — | Réussi |
| `npm run qa:network:rev01 -- --list` | — | 426 tests recensés, 13 fichiers |
| Playwright ciblé | — | Refus du navigateur avant navigation ; 1 échec de lancement, 15 non exécutés |

Les sept premiers tests nouveaux ont été exécutés rouges avant l'implémentation.
La première batterie candidate a relevé quatre dépendances manquantes dans le
simulateur de langue ; correction du chargeur, puis mêmes assertions repassées.
Avertissements non bloquants préexistants : metadataBase d'autres routes,
MODULE_TYPELESS_PACKAGE_JSON, et scripts d'installation npm non approuvés.

Journaux : `/private/tmp/appel-baseline-{lint,build,test}.log`,
`/private/tmp/appel-final-{lint,build,test,brand,claims,brand-os}.log`,
`/private/tmp/appel-npm-ci.log`, `appel-red.log`, `appel-server.log`,
`appel-browser.log`, `appel-network-list.log`.

## Preuves et relecture bornée

SDK installés : 1.5.3 pour embed-react, 1.5.3 pour embed-core.
`dist/Cal.es.mjs` transmet config à inline. Dans embed-core,
`buildFilteredQueryParams` sérialise les scalaires et tableaux, puis `createIframe`
les ajoute à l'URL. Aucun contournement. Guides locaux Next 16.3.4 consultés ;
Context7 Next 16.2.9 confirme le contrat Promise de searchParams.

Une relecture indépendante en lecture seule, suivie d'une correction consolidée.
Défaut relevé : une exemption trop large dans le test historique d'identité
retirait métadonnées et attributs du contrôle. Corrigé en gardant ces surfaces,
ainsi que JSON-LD ; RSS et llms contrôlés bruts. Aucun autre défaut concret
identifié par cette passe.

PRODUCTION_PROOF : non établie, hors mandat sans déploiement. Le banc local
prouve le rendu et la configuration ; il ne prouve pas l'enregistrement d'une
réservation attribuée par Cal.com.

## Blocages et reprise sur l'hôte

- `next start -p 3210` : `listen EPERM 0.0.0.0:3210`.
- Chromium : `bootstrap_check_in ... MachPortRendezvousServer: Permission denied`,
  arrêt SIGTRAP avant navigation.
- Aucune capture créée ; géométrie, contraste calculé du nouveau rendu et
  transmission observée dans l'iframe restent à vérifier sur l'hôte.

Après installation et build sur l'hôte, démarrer le serveur dans un terminal :

```sh
npx next start -p 3210
```

Puis dans un autre :

```sh
npm run qa:network:rev01
```

Les captures du lot seront écrites sous `test-results/` par `booking.spec.ts`.
Cette reprise comprend les contrôles d'accueil et de stabilité existants, intacts.
Aucune tentative de réservation réelle n'est incluse dans ces tests.
