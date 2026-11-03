# Langue métier et référencement : rapport du 03/11/2026

Implémentation de `docs/CODEX-SPEC-2026-11-02-langue-metier-et-referencement.md`,
validée par Paul. Code et contrôles hors navigateur terminés ; preuve géométrique
et de stabilité à rejouer sur l'hôte.

Branche fournie : `codex/docs-CODEX-SPEC-2026-11-02-langue-metier-et-refere`.
Baseline : `3cbe36d7f5b4ebe46b0845bbff3041cda1a7bf33`.
La spec était le seul fichier non suivi au départ ; elle est conservée sans édition.
Aucun commit, push, déploiement ni appel au script de handoff.

## Modifications

- `src/system/single-page-copy.ts`, `ontology-hero-data.ts` : textes FR exacts
  demandés, traductions anglaises courantes, titres des plans, zones et étapes.
  Les 48 cas et 23 offres sont conservés ; les étiquettes deviennent « Tâche reprise »
  et « Nouvelle capacité ». Les données géométriques, liens et durées sont inchangés.
- `src/system/components/SinglePage.tsx`, `OntologyHero.tsx`, `ServiceTasks.tsx` :
  nouveau H1, accroche, CTA, phrase sous le schéma, noms d'assistants, équipe et
  fondateur ; définition unique sous le titre « Ce que l'IA change ».
  `src/system/single-page.css` ajoute seulement l'espacement de cette définition
  avec le jeton Brand OS existant.
- `src/system/technologies.ts`, `components/TechnologyBand.tsx` : sélection publique
  ordonnée de dix noms avant l'équipe ; les 41 entrées du registre et tous les
  logos restent disponibles. Le fonctionnement de la boucle et du mouvement
  réduit reste inchangé.
- `src/system/components/RevFooter.tsx` : quatre liens de thèmes ajoutés au pied
  partagé, en FR/EN. Six destinations de contenu, plus la bascule de langue existante.
- `src/app/(rev01)/page.tsx`, `(rev01)/layout.tsx`, `src/system/jsonld.ts` : titre
  et description de l'accueil, Organization localisée et rôle « Fondateur » en FR.
  `sameAs` reste vide : aucun profil LinkedIn d'entreprise confirmé dans le mandat.
- `src/system/site-v1-pages.ts`, `src/app/(rev01)/journal/themes/[theme]/page.tsx` :
  quatre titres et introductions FR simplifiés, sans préfixe technique dans le
  titre des métadonnées FR. Adresses, corps des thèmes et articles conservés.
- `src/app/sitemap.ts` : date de modification de l'accueil et des thèmes actualisée.
  Sept adresses françaises conservées ; aucune fausse traduction d'article ajoutée.
- `src/app/opengraph-image.tsx`, `src/system/locale.ts` et le layout : nouveau titre
  dans l'image de partage et version de l'URL OG/Twitter actualisée.
- `scripts/generate-llms.mjs`, `public/llms.txt` : présentation bilingue des sections
  actuelles, dans l'ordre, et liens FR/EN. Le fichier public est généré exclusivement
  par le script.
- `AGENTS.md`, `TRUTH.md`, `AI_CONTEXT.md` et les documents de page unique
  `BANDEAU-TECHNOLOGIES.md`, `HANDOFF-PAGE-UNIQUE.md`, `PASSE-3-PAGE-RACONTEE.md`,
  `SCENARIO-DONNEE-ET-MOTS-INUTILES.md` : décisions remplacées explicitement par
  la décision de Paul du 02/11/2026 ; historique et autres exigences conservés.

Aucune nouvelle page, composant ou dépendance. Aucun changement du choix de langue,
du cache de l'accueil, de Cal.com, de la mesure, des articles ou de leur publication.

## Tests ajoutés et adaptés

Huit tests Node dans `tests/langue-metier.test.mjs` :

- absence du jargon et occurrence unique d'agent dans le HTML FR/EN, définition
  et étiquettes présentes au serveur, absence de client hors références ;
- titres, descriptions, canonical et JSON-LD localisés, y compris le layout ;
- six destinations du pied et bascule de langue ;
- introductions françaises, adresses et alternates du sitemap ;
- génération déterministe et bilingue de `llms.txt`, sans sections retirées.

Sept tests Playwright ajoutés à `tests/single-page.spec.ts` : texte visible et SEO
FR/EN en 1440/390, puis pied sur `/fr`, `/fr/journal` et un article, avec contrôle
du débordement du pied. Ils utilisent le deny-all réseau existant.

Adaptations au contrat explicitement modifié :

- `tests/single-page.test.mjs`, `tests/technologies.test.mjs`,
  `tests/og-canard.test.mjs` : contrôle du fond et de la cohérence, sans recopier
  les nouveaux titres ; ordre des sections et sélection technique exacts.
- `tests/brand-os-render.test.mjs` : ordre et sélection dans le build compilé,
  nouvelle version OG et pied commun vérifié aussi sur tous les articles rendus.
- `tests/metadata-integrity.spec.ts` : nouvelle version de l'image.
- `tests/fixtures/hero-quality.json`, `tests/ontology-motion.test.mjs` : seuls
  les mots changés par la spec sont actualisés ; parcours, liens, étapes,
  validations humaines et durées restent contrôlés.
- `tests/passe4-motion.test.mjs` : le test des durées lit désormais les cas du
  rendu réel, étiquettes comprises, au lieu des anciennes clés supprimées.

Aucun seuil géométrique, réseau, typographique ou de stabilité assoupli.
`tests/stabilite.spec.ts` est inchangé.

## Résultats

| Vérification | Baseline | Candidat |
|---|---|---|
| Installation | `npm ci --offline` réussie | `npm ci --offline` réussie |
| Lint | Réussi | Réussi |
| Build `npm run build -- --webpack` | Réussi | Réussi |
| `npm test` | 134/134 | 142/142 |
| `npx tsc --noEmit` | Inclus au build | Réussi séparément |
| `npm run qa:brand:rev01` | Non rejoué séparément | Réussi |
| `npm run qa:claims:rev01` | Non rejoué séparément | Réussi |
| `npm run test:brand-os` | Inclus dans npm test | 19/19 |
| `git diff --check` | Aucun changement suivi | Réussi |
| Image OG | Non inspectée | PNG 1200×630 rendu et inspecté, titre entier |
| Playwright réseau | Non exécuté | Bloqué avant navigation ; 410 tests recensés |

La première installation réseau a échoué (`ENOTFOUND registry.npmjs.org`).
Le cache npm existant a été copié dans `/private/tmp`, puis `npm ci --offline`
a réussi sans modifier les versions ni le lockfile. Baseline exécutée dans une
archive isolée de HEAD, avant de comparer au candidat du répertoire de travail.
Guides locaux de Next 16.3.4 lus ; Context7 consulté pour les métadonnées,
JSON-LD et sitemaps (documentation 16.2.9 disponible sur ce serveur).

Revue indépendante en lecture seule : un défaut de test de durée identifié et
corrigé ; aucun autre écart fonctionnel concret identifié. L'examen statique ne
remplace pas la mesure dans le navigateur.

## Blocages et reprise

Le serveur est refusé : `listen EPERM 127.0.0.1:3210`.
`npm run qa:network:rev01 -- --max-failures=1 --workers=1` a été tenté :
Chromium s'arrête avant navigation (`MachPortRendezvousServer`, permission denied,
SIGTRAP). Un test est marqué échoué pour ce blocage, 409 ne sont pas exécutés.
La découverte des 410 tests dans 12 fichiers réussit.

Géométrie du hero 1440×800, blocs 1280×720 et 390×700, captures, animations et CLS :
**UNKNOWN** dans cet environnement. À rejouer sur l'hôte autorisé, sans assouplir
les tests :

```sh
npm ci --silent
npm run lint
npm run build -- --webpack
npm test
npm run qa:brand:rev01
npm run qa:claims:rev01
npm run test:brand-os
```

Démarrer ensuite `npx next start -H 127.0.0.1 -p 3210` dans un terminal et lancer
`npm run qa:network:rev01` dans un autre. Après fusion par Paul : contrôle navigateur
FR/EN ordinateur/téléphone et lecture du texte par Paul, conformément à la spec.
Le profil LinkedIn pourra rejoindre `sameAs` après sa confirmation nominative.

## Périmètre d'écriture et preuve

TARGET_SYSTEM : ce dépôt local ; ENVIRONMENT : branche de handoff fournie.
WRITE_SCOPE : sources, générateur/artefact llms, tests et documentation décrits ici.
REVERSIBLE : oui ; ROLLBACK : annuler le diff des fichiers listés en préservant la spec.
BACKUP : HEAD ci-dessus et copie isolée de baseline ; EXPECTED_ROWS : 0.
PRODUCTION_PROOF : non acquise, aucun déploiement autorisé ni effectué.
