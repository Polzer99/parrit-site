# Compte rendu — action unique et wording, 08/11/2026

## État de livraison

Implémentation locale réalisée pour les textes, la réduction des actions, les
cartes et les huit références. **Conformité intégrale non acquise : arbitrage
sur la navigation encore ouvert, validation navigateur bloquée par l'environnement.**
Aucun commit, push, déploiement ni appel vers un service métier.

La spec exige à la fois navigation et hero roses `exec`, le hero entier avec
la barre à 1440×800, et un seul rose par écran. Le contrôle `doctrine-visible`
exige 844 px de séparation entre accents : ces trois exigences ne peuvent
être satisfaites ensemble au premier écran. Une question a été posée à Paul :
conserver la navigation `ghost`, ou autoriser deux roses au premier écran.
En l'absence de réponse, le style antérieur `ghost` de navigation est conservé,
avec le nouveau libellé et `source=rdv-nav`. Ce n'est pas une décision attribuée
à Paul et ce point ne satisfait pas « toujours exec ». Aucune assertion du rose
unique n'a été supprimée ou assouplie.

## Sources et mandat

- Dépôt courant, HEAD et origin/main locaux : `5d34aca63742d9ed060c76af32a3148fbe57e7ab`, fusion PR #369.
- Source actuelle : spec locale `docs/CODEX-SPEC-2026-11-08-action-unique-et-wording.md`, seule entrée non suivie préexistante. Empreinte SHA256 vérifiée avant/après.
- Instructions lues : AGENTS.md, AI_CONTEXT.md, TRUTH.md et harnais récursif canonique. Documentation Next installée 16.3.4 ; Context7 16.2.9 pour useSearchParams/Suspense, version la plus récente proposée.
- Écritures : dépôt local de développement, réversibles, aucune donnée métier (0 ligne), aucun secret ; référence de retour HEAD, conservation de la spec utilisateur et des sources hors dépôt.
- Plan exécuté : baseline → copie/liens → permissions/assets → tests/contrats → revue indépendante → batterie finale. Deux passes de correction ciblée ; pas de boucle sur les refus de l'environnement.

## Fichiers et comportement

- `src/system/components/AppointmentLink.tsx` : action commune, destinations localisées et `avecSource`, UTM dans le HTML serveur, clic natif modifié conservé, historique/défilement/focus sans recharger le formulaire.
- `SinglePage.tsx`, `RevHeader.tsx`, `SessionPhotos.tsx`, `QuickCapture.tsx` : hero et bandeau uniques, suppression des actions terrain/offres/parcours/portrait et de la relance réservation après envoi. Trois placements logiques, avec deux copies responsive de la navigation dont une seule visible. Bouton d'envoi et repli e-mail conservés. Hors accueil, header inchangé. Lecture des anciennes sources conservée.
- `src/system/home-layers.ts`, `single-page-copy.ts`, `src/app/(rev01)/page.tsx`, `src/system/jsonld.ts`, `scripts/generate-llms.mjs` et `public/llms.txt` régénéré : copies FR/EN demandées, deux métiers sans bouton, public PME/ETI/grands groupes, FAQ et métadonnées alignées. Le H1 et l'OG qui ne reprend que le H1 sont inchangés. Description Organization partagée alignée sur le positionnement.
- `src/system/public-clients.ts`, `src/lib/registry/preuves.ts`, `PublicEvidence.tsx`, `scripts/lib/public-clients.mjs` : trois noms complets autorisés, permissions de nom/logo distinctes datées du 08/11 et limitées à home. Toyotomi et Hiolle isolés restent privés ; tous les noms restent interdits dans le Journal.
- `public/clients/{toyotomi,hiolle-technologies,carte-noire}.png`, `SOURCES.md`, `tests/fixtures/new-client-logos.json`, `scripts/convert-client-logos.mjs` : trois masques noirs transparents à hauteur 120 px, provenance et SHA256. Conversion sans redessin ; Carte Noire en négatif, ruban noir et lettres transparentes. Inspection visuelle sur fond blanc effectuée. Sources externes inchangées par SHA256.
- `src/system/single-page.css` : deux cartes, retrait des rangées de boutons, bande de références limitée à 1060 px, deux rangées autorisées sur ordinateur et deux colonnes sur téléphone. Les huit références restent dans la bande, sans duplicata ni défilement horizontal. Éclairage sur 12,8 s, créneaux 1,6 s et rampes 300 ms, pause survol/focus, mouvement réduit statique. Espace réservé au grossissement du logo.
- `AGENTS.md`, `TRUTH.md`, `AI_CONTEXT.md` : amendement « décision de Paul du 08/11/2026, nuit » et réserve navigation explicitement distincte.

Les fichiers du Journal, mentions légales, photos, fontes, cinq anciens logos
et PNG de `.codex-handoffs/brand-os-p1/after/` n'ont pas changé. Les descriptions
originales des articles dans llms sont conservées. Aucune implémentation de la
spec abandonnée `cta-tournant-dirigeants`.

## Tests ajoutés et adaptés

- `tests/action-unique.test.mjs` : huit nouveaux tests Node FR/EN (structure, libellé/sources, UTM, clics modifiés et état du formulaire, header SSR, permissions, intégrité/alpha/monochromie des exports).
- `tests/harness-certificates.test.mjs` : un nouveau test de l’exception certification exacte, limitée aux deux sources de l’accueil ; la même phrase dans le Journal/ailleurs et les affirmations supplémentaires sont refusées. `scripts/false-claims-check.mjs` ne change que les deux formulations approuvées, pas le périmètre de l’exception.
- `tests/brand-os-render.test.mjs` : HTML du serveur compilé avec query réelle FR/EN, sans socket ni mock de useSearchParams. Deux copies nav + hero + bandeau contiennent les UTM avant JavaScript. Le mock de requête transmet désormais le pathname sans la query, comme le proxy réel.
- `tests/intentions.spec.ts` : huit nouveaux parcours FR/EN × ordinateur/téléphone × JS/sans JS, trois actions visibles avec le menu mobile ouvert, libellé/sources/UTM, deux cartes sans action, huit logos contenus, absence de vocabulaire remplacé, hero 800 px et débordement inchangés.
- `tests/parcours-accueil.spec.ts` : tests POST simulés FR/EN de l'ancienne source `intention-formation-hero`, puis succès sans quatrième action.
- Contrats existants adaptés dans `intentions`, `parcours-accueil`, `home-visual-layers`, `single-page`, `langue-metier`, `public-clients`, `site-v1`, `audit-readability`, `doctrine-visible`. Les assertions supprimées portaient sur les boutons et cartes explicitement retirés. Deux rangées de logos et cycle de huit créneaux correspondent au nouveau contrat. Géométrie, contraste, fontes, CLS, durée des tests et deny-all conservés.

## Exécution

La baseline a réussi : `npm ci --silent`, lint, build Webpack et **238/238 tests Node**.
Les nouveaux tests ont d'abord reproduit l'ancien comportement (rouges), puis
les tests ont été adaptés uniquement aux changements de contrat prescrits.
Une première exécution intermédiaire des tests en parallèle du build a rencontré
des artefacts `.next` absents/en reconstruction : elle ne compte pas comme preuve.
La batterie finale est séquentielle. Son contrôle supplémentaire `qa:claims` a
détecté l’exception certification devenue obsolète ; après correction exacte et
ajout d’un test de refus, lint/tests/marque/claims/Brand OS ont été rejoués.

Résultats finaux à la clôture :

- `npm ci --silent` : réussi.
- `npm run lint` : réussi.
- `npm run build -- --webpack` : réussi.
- `npm test` : 247/247 réussis.
- `npx tsc --noEmit` : réussi.
- `npm run qa:brand:rev01` et `npm run qa:claims:rev01` : réussis.
- `npm run test:brand-os` : 19/19 réussis.
- `git diff --check` : réussi.

Avertissements préexistants : metadataBase par défaut et détection du type de
module des imports TypeScript par Node. Aucun seuil modifié pour les éviter.

## Blocages et limite de preuve

- Serveur local : `npm start -- --hostname 127.0.0.1 -p 3210` refusé, `listen EPERM`.
- `npm run qa:network:rev01 -- --max-failures=1 --workers=1` : 517 cas recensés ; premier cas bloqué au lancement Chromium (`MachPortRendezvous`, permission denied, SIGTRAP), 516 non exécutés. Aucune navigation ni preuve de géométrie/CLS/capture acquise. Le plafond d'échecs arrête seulement le batch, sans modifier les tests.
- Une commande secondaire de l'agent relecteur de tests (diff et recensement) a aussi été rejetée avant exécution par le contrôle automatique WhatsApp : « touche simulée dans une commande qui cite WhatsApp refusée ». Aucun contournement. Le lancement de la batterie principale a néanmoins recensé les 517 cas.
- Revue indépendante statique : aucun autre défaut fonctionnel confirmé ; réserve nav `ghost` et preuves navigateur explicitement maintenues. Les masques ont été visualisés séparément, ce qui ne prouve pas leur composition dans la page.
- `PRODUCTION_PROOF` : non exécutée, publication hors mandat. Aucune conformité intégrale ni validation de production revendiquée.

Reprise sur un hôte autorisant les sockets et Chromium : démarrer le serveur
sur 3210 puis rejouer `npm run qa:network:rev01`, sans assouplissement. Trancher
la contradiction de la navigation avant de déclarer le lot terminé.
