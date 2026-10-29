<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## AI Playbook — engineering doctrine (REGLES-DOR §33)
Applies to any code delivered from this repo. "The CI blocks" beats "remember to check"; validate before normalizing (foundations first, finishing later). Non-negotiables:
- Plan validated BEFORE any code; 1 module = 1 closed loop (write → targeted review → reversible commit on a branch).
- Data: stable primary key; relations via foreign key only (never join by name); each business entity in its own table (no free text); unique key before any import/seed; constraints in the DB (uniqueness, enum, not-null, format), not only in app code.
- Security: code never reaches business tables from an unauthenticated/client surface — go through a server path; service_role/secrets server-side only; a missing env var = hard stop at startup (no silent fallback); never hardcode a secret (incl. in workflow YAML); DB views in security_invoker (SECURITY DEFINER only for documented anonymous aggregates).
- Versioning: every schema change = a replayable migration + an updated reference schema; never alter the prod schema without a migration.
- Knowledge: maintain a minimal AI_CONTEXT.md (architecture state · risk zones · established rules) and read it first each session.
- JS/TS repos also: TypeScript strict (`any` forbidden), ESLint strict, Dependabot, security scan; ci.yml = exactly checkout → npm ci → npm run lint → npm run build (npm ci, never npm install); CI verifies, it never deploys.

# parrit-site — carte du dépôt (pour Codex & Claude)

> Entrée des agents. `CLAUDE.md` importe ce fichier : même source pour les deux.
> Site institutionnel public **parrit.ai** (Next.js 16 / React 19, déployé sur Vercel via push `main`). REV 01 : **FR + EN** (`src/system/locale.ts`, `LOCALES = ["fr", "en"]`), URLs nues en anglais et `/fr/*` en français ; bascule cliquable avec cookie. `src/proxy.ts` négocie `Accept-Language` par 302 vers le français hors bots et hors cookie de choix. *Corrigé le 20/09/2026 : la mention « anglais uniquement » était obsolète depuis l'ajout du FR.* L'arbre multilingue legacy `[lang]` a été supprimé le 14/08/2026 (Lot P) ; `/:lang/*` répond 301 vers `/`.

## Source de vérité COMMUNE = `TRUTH.md`
**Avant de toucher au contenu/positionnement/conversion, lire [`TRUTH.md`](./TRUTH.md)** : ce qu'est Parrit, le rôle du site (24/10/2026 : montrer produits, réalisations, capacités et preuves ; rendez-vous possible sans maximisation), l'ICP, les offres, la voix (LE TAMIS), les règles dures, et la définition d'une « amélioration ». C'est le **cerveau partagé** entre le site et l'agent d'amélioration continue **Hermes** (`hermes/`, voir `hermes/LOOP.md`). La source de vérité **visuelle** est la section suivante (Brand OS). En cas de conflit : `REGLES-DOR.md` puis `VISION.md` (hors-repo) priment.

## Source de vérité visuelle = Brand OS (04/10/2026)

Le Brand OS remplace la charte T4/REV 03 (D1 du 24/09, désactivation le 28/09).
Le prototype REV 03, `BRAND.md`, `docs/design-system/` et `design-source/` sont historiques.
Ne pas recopier leurs couleurs ni réintroduire leurs polices.

| Source | Rôle |
|---|---|
| `src/system/brand-os.origin.json` | Provenance, commande de régénération et SHA256 du paquet et des polices |
| `src/system/brand-os.tokens.css` | Valeurs vendorisées, jamais éditées à la main |
| `src/system/brand-os.{forbidden-assets,glyphs,connectors}.json` | Contrats d'assets, de couverture typographique et de connecteurs |
| `src/system/tokens.css` | Adaptation du site par `var(--brand-*)`, sans valeur de palette recopiée |
| `src/system/` + `src/app/(rev01)/` | Composants et pages du site |

Régénérer dans le dépôt canon avec la commande de `origin.json`, puis recopier les cinq fichiers
à l'identique. `npm run test:brand-os` contrôle leurs empreintes après build. Les fichiers de
polices General Sans (`public/fonts/rev02/`) et IBM Plex Mono (`public/fonts/rev03/`) doivent
correspondre à `canon_fonts`. Mode accessible uniquement ; `--ed` utilise `--ui`, poids 500.
Aucun mode complex ni Inter Tight.

- **Couleurs (24/09/2026, D1)** : Brand OS P1/P3, valeurs générées dans `brand-os.tokens.css`, adaptées par `tokens.css`.
- **Polices (04/10/2026)** : General Sans pour le texte et l'interface, IBM Plex Mono pour le registre technique ; auto-hébergées.
- **Accent** : utiliser les jetons contextuels du registre clair/sombre ; aucune couleur littérale hors du fichier vendorisé.
- **Boutons** : General Sans 600, casse normale, sans espacement de lettres ajouté.
- **Formes** : radius 0 sauf téléphone, zéro dégradé ; zéro ombre.
- **Logo** : `[P.]` et `PARRIT.AI`, arbitrage AV-2 conservé ; icônes issues du paquet canon.
- **Connecteurs** : tige et tête vectorielles suivant VS-CONNECTOR, aucune flèche-caractère.
- **Photo** : aucune photo de remplacement avant AV-3 ; certification Qualiopi conservée.
- **Enveloppe, décision Paul du 27/10/2026** : page unique, maquette et handoff dans
  `docs/site-v1/page-unique/` ; section 0 prime. Barre canard dans le flux,
  six ancres, langues et contact ; menu mobile natif. Pied : copyright,
  Journal, mentions légales, langue. Aucun surtitre ni registre visible.
- **Photo** : portrait choisi par Paul le 27/10/2026 : buste LinkedIn souriant,
  section contact, exports AVIF/WebP 340/680 de `public/brand/founder/` ;
  octets et SHA256 contrôlés par `tests/fixtures/founder-photo.json`, cadrage entier 3:4.

### Boutons publics — tour 1 (26/10/2026)

Largeur de contenu à partir de 600 px ; sous 600 px, tous les boutons d’un même
groupe suivent le même choix de largeur. Alignement sur le bord gauche du texte
précédent, ou centré si son titre est centré. Deux actions : `exec` puis `ghost`,
espacement `var(--brand-s2)`, hauteur et ligne de base communes. Un seul `exec`
par section ; principal en clôture. Pas de point final, infinitif FR et impératif
court EN. Vers `/#contact` ou `/fr#contact` : « Parler d'un projet » / « Talk about a project ».
Exception : bouton principal du hero accueil « Parlons de votre transformation » /
« Let's talk about your transformation ». L’envoi du formulaire de contact reste à droite du champ.
Un seul éclat rose par écran (Brand OS) : navigation `ghost`, dans le flux ; boutons principaux du hero et du contact `exec`. Repli e-mail à bouton neutre.

### Règle de création — non négociable

Toute nouvelle page publique se construit avec `src/system/` (tokens, composants K/St/Frame/
Instrument/RegistryLine, boutons `.rev-button` / `.exec` / `.ghost`) et se vérifie contre le
Brand OS et ses contrats (captures 1440/375, contraste et absence de débordement). Un hex dans une
page est un défaut. Interdit de créer un design system local ou une seconde famille typo.
La CI bloque : `qa:brand:rev01` (tokens, ombres, radius, PC-10) + `qa:network:rev01`
(specs de conformité — H1 88px, une ombre max, zéro radius).

### Règle d'index — arbitrage Paul du 02/08/2026

**La structure n'ajoute pas d'étape entre le visiteur et la valeur.**

Une carte d'index porte **une seule action**, et cette action mène à la **destination finale**. Pas de « voir la fiche » quand une autre action reste nécessaire derrière.

Une ressource a **une seule URL canonique** : celle qui rend son expérience complète (promesse, contenu, preuve, formulaire éventuel, accès, CTA suivant). Elle est déclarée dans `experience` au registre. Le corollaire s'applique partout :

- l'alias `/[lang]/ressources/[slug]` redirige en **301** vers l'expérience quand celle-ci vit ailleurs — la redirection se déclare dans `next.config.ts`, jamais dans une page, pour rester à **un seul saut** ;
- **une seule** des deux URL entre au sitemap, et c'est l'expérience ;
- le `source` et les `utm_*` survivent au saut : ne jamais réécrire une destination en jetant sa chaîne de requête. Un seul utilitaire pose `?source=` — `avecSource()` dans `cta.ts`.

`tests/ressources-reachability.spec.ts` bloque les cinq régressions correspondantes. Ses assertions portent sur les URL et le registre, **jamais sur des classes CSS** : une refonte visuelle ne doit pas casser un test de conversion.

## Routes, page unique (27/10/2026)

- `/` et `/fr` : neuf sections selon `BANDEAU-TECHNOLOGIES.md` §2.
- `/journal`, `/fr/journal`, `/journal/[slug]`, RSS et `/legal`, `/fr/legal` conservés.
- Quatre thèmes bilingues sous `/journal/themes/` : harness-engineering,
  ai-sprints, integration-developpement, conseil-transformation.
- Anciennes pages : 308 en un saut dans `next.config.ts`, quatre pages V1 vers
  leurs thèmes, autres vers les ancres du handoff. Requête conservée.
- `/sketch/[id]` : privé, noindex, inchangé. `/system` reste 404.
- OG et chaîne de publication Journal conservés. `scripts/generate-llms.mjs`
  génère `public/llms.txt` ; ne pas éditer ce dernier à la main.

## Tests : blocage réseau global obligatoire (règle repo, 14/08/2026)

**Aucun test (Playwright ou autre) n'a le droit de laisser sortir une requête vers un service réel.** Incident du 14/08/2026 : le mock e2e interceptait une URL divergente de celle du code, et les POST du CI sont partis en vrai sur le webhook n8n de production (faux leads en CRM + alertes mail). Décision Paul : la règle est gravée ici, immédiatement.

Concrètement, dans toute spec e2e :
- poser un **deny-all** en tête de test — `page.route('**/*', …)` avec allowlist limitée à `localhost`/`127.0.0.1` — et **faire échouer le test** sur toute requête sortante non attendue ;
- ne jamais intercepter un endpoint réel par son URL en dur : importer la constante depuis le code testé, ou intercepter par motif (`**/webhook/**`) ;
- un mock qui ne matche pas = requête qui SORT. Le deny-all est le filet, pas l'exception.

## Batterie avant tout push
```bash
npm run build                                   # inclut prebuild (llms.txt)
npm run qa:brand:rev01                          # couleurs hors vendor, radius, ombres, dégradés, PC-10
npm run test:brand-os                           # origine, polices, assets, glyphes après build
npx next start -p 3210 &                        # les specs visent :3210 (QA_BASE_URL)
npm run qa:network:rev01                        # 5 specs Playwright (deny-all réseau)
```
Voir aussi la skill `qa-playwright` (batterie responsive + multi-navigateur).

## Règles de sortie (non négociables)
- **Jamais d'appel runtime à `*.vercel.app`** dans une livraison (REGLES-DOR §13). Le site EST hébergé sur Vercel — ça vise les ressources chargées au runtime (images/redirects/signatures), pas l'hébergement.
- Aucun prix ni offre détaillée sur le site public (12/10/2026). Pas de devis détaillé ni de prix personnalisé hors propale privée.
- Clients (25/10/2026, révision 4) : seuls les noms de `src/system/public-clients.ts` sont publiables (Laparra, Clevery, Forexpert, Joone, SNCF) ; tous les autres restent anonymisés. Clevery Avocats désigne Clevery. Joone : accompagnement IA ; SNCF : formation avec Arkel, jamais client direct. Exception : le Journal ne nomme aucun client, même public. Décision Paul du 27/10/2026 : logos des cinq clients publiables affichés sans accord écrit des clients ; provenance dans `public/clients/SOURCES.md`, MIT sans logo. Aucun template n'exige de nom ou de logo pour se rendre.
- Positionnement : page unique validée par Paul le 27/10/2026, `docs/site-v1/page-unique/PASSE-3-PAGE-RACONTEE.md`.
- Marque : Parrit.ai ; nom et portrait de Paul autorisés dans le contact (27/10), identité du Journal inchangée.
- Mesure d'audience (05/10/2026) : PostHog retiré du navigateur ; seule mesure active, Cloudflare Web Analytics injectée hors dépôt par Cloudflare et décrite dans `/legal`.
- CTA (26/10/2026) : « Parler d'un projet » / « Talk about a project », hero « Parlons de votre transformation » / « Let's talk about your transformation » vers `/#contact` ou `/fr#contact`.
- CTA réservation (28/10/2026) : Cal.com utilise `paul-larmaraud/audit` en FR et `paul-larmaraud/ai-strategy-meeting` en EN ; un `calLink` explicite reste prioritaire.
- Tests (25/10/2026) : contrôler les règles de fond et la structure, pas les libellés. Conserver les contrôles de destination, accessibilité, réseau et géométrie.
- Collab Codex↔Claude = via **GitHub Issues/PR**, jamais d'auto-merge, **Paul merge**. Codex = codeur, Claude = relecteur (sécu/archi/bugs/dette).

## Page unique et mode accessible (27/10/2026)

La passe 3 (`docs/site-v1/page-unique/PASSE-3-PAGE-RACONTEE.md`) et sa maquette
archivée dans `passe-3/maquette/` priment sur la maquette précédente pour leur périmètre.
Ordre actuel (bandeau, 27/10 au soir) : hero, technologies, applications, ce qui change, parcours, services,
partenaires, références, fondateur/contact avec réservation intégrée.
Aucune section « Votre phrase ». Aucun prix. Aucun CRM en vedette.
Les chiffres et outils explicitement présents dans la maquette sont autorisés.
Navigation : Applications, parcours, services, équipe, références, contact.
`standard` et `systems` redirigent en 308 vers `#technologies`.
Les références nominatives passent par `getSiteEvidence`. Revue J-30 en CI, pas d'expiration
silencieuse en production. Décision Paul du 27/10/2026 : logos des cinq clients publiables affichés sans
accord écrit des clients, sur sa décision nominative datée ; provenance dans
`public/clients/SOURCES.md`. Le contrat `publicationLogo` reste obligatoire,
ainsi que la permission de publication du client. MIT dans partenaires, sans logo. Logos techniques : outils utilisés, pas partenariat.
General Sans partout sur la page ; IBM Plex Mono uniquement dans le code du Journal.
Téléphones : seule exception de rayon ; animations CSS, messages visibles sans JS
et avec mouvement réduit. Contrôles dans `tests/single-page.spec.ts`.

## Passe 4, 27/10/2026

`docs/site-v1/page-unique/PASSE-4-CAS-D-USAGE-ET-ECRAN.md` prime sur la passe 3
pour les cas d’usage, les offres partenaires, le trajet et la géométrie.
Maquette source archivée : `docs/site-v1/page-unique/passe-4/passe4.py`.
Décision Paul du 27/10/2026, soir : `BANDEAU-TECHNOLOGIES.md` remplace la
règle de confidentialité de la stack. Bandeau agnostique `#technologies` juste
après le hero : pour chaque besoin, la meilleure technologie. Liste canonique
dans `src/system/technologies.ts`, logos locaux dans `public/tech/`, aucun
partenariat sous-entendu. La section architecture est retirée.
Les mentions de Claude Code comme formation/audit restent autorisées.
Un bloc = un écran : en FR/EN et mouvement réduit, à 1440×800, 1280×720 et
390×700, le premier enfant de chaque section (hors hero/contact) et chaque
figure doivent tenir dans la hauteur du viewport, sans découpe ni texte masqué.
Le hero entier, barre comprise, tient à 1440×800 ; le calendrier seul est exempté.
Cinq carrousels mobiles natifs (celui du trajet est retiré), accessibles au clavier, avec points de position.
Les 48 cas et les 23 offres restent dans le HTML serveur ; aucun mouvement
en mode réduit et aucun minuteur après démontage. Le registre de preuves conserve
le pilotage agentique des fruits et légumes pour Laparra ; seuls les logos
sont désormais affichés dans les références (§5 du tour 1).

## Applications concrètes et bouton du hero, amendement du 27/10 au soir

`BANDEAU-TECHNOLOGIES.md` §4 prime pour la section des téléphones et le bouton du hero.
« Quelques applications concrètes. » / « A few real-world applications. » :
trois scènes anonymes, titres et note de données fictives conservés, toujours
visibles même si toutes les permissions clients sont révoquées. Navigation
« Applications » dans les deux langues ; ancres `#en-production` / `#in-production`
conservées. Les noms et logos clients restent uniquement dans `#references`,
avec `getSiteEvidence` et les contrôles de publication inchangés.
Sur ordinateur (>760 px), le bouton rose du hero tient sur une ligne, à sa
largeur de contenu, sous l'accroche et aligné à gauche ; hauteur et rembourrage
existants conservés. Sur téléphone, pleine largeur inchangée. Le hero entier,
barre comprise, tient toujours à 1440×800, sans aucun seuil de contrôle assoupli.


## Tour 1 de la nuit, 27/10/2026

`BANDEAU-TECHNOLOGIES.md` §5 : téléphones de dimensions communes, cartes des
applications pleine largeur sur mobile et carrousel également sur tablette.
Références : seuls les logos autorisés et leurs noms accessibles ; aucun texte
sous le bandeau. Mention de propriété des marques retirée des technologies.
23 offres partenaires FR/EN. `src/system/reading.ts` centralise la lecture :
max(3 000 ms, 1 200 ms + 300 ms par mot), services et offres ; fondus ajoutés
à cette durée, départs décalés, aucune offre tronquée. Hero et contact intacts
sur consigne explicite de Paul : le timing du hero est exclu de ce tour.

## Tour 2 de la nuit, 27/10/2026

`docs/site-v1/page-unique/NUIT-TOUR-2.md` : hauteur des trois téléphones
partagée par une sous-grille CSS, selon le contenu le plus long plus une ligne,
y compris sans JS. Grossiste : clémentines et échéance relative cohérente FR/EN.
Journal uniquement au pied ; hauteurs optiques des logos sans modifier les images.
Titre du fondateur suivi du texte, portrait entier 3:4 ; seul le rembourrage
horizontal du bouton du formulaire change. Hero, autres boutons, Cal.com et
offres intacts. Contrôles existants conservés ; géométrie à rejouer sur l'hôte.

## Tour 3 de la nuit, 28/10/2026

`docs/site-v1/page-unique/NUIT-TOUR-3.md` : seule la mise en page de
`ce-qui-change` / `what-changes` évolue. Cadres et légendes en sous-grille
intrinsèque commune ; cases du logiciel en rangées sur mobile, points proches
des cartes, carrousel natif dès la tablette. Aucun texte ni taille de texte
modifié ; hero, boutons, Cal.com et offres intacts. Tests FR/EN avec/sans JS,
mouvement réduit, alignement à 1 px et écart aux points ≤ 48 px ; contrôles
existants inchangés, dont « un bloc = un écran ». Navigateur à rejouer sur l'hôte.

## Tour 4 de la nuit, 28/10/2026

`docs/site-v1/page-unique/NUIT-TOUR-4.md` : entre 761 et 900 px uniquement,
langues, bouton et menu groupés à droite, logo seul à gauche ; espacement
mobile conservé via Brand OS. Libellés, styles des boutons, hero, Cal.com et
offres intacts. Six tests FR/EN à 900, 800 et 761 px : ordre, ligne commune,
bords à 1 px, écarts ≤ 48 px et absence de débordement horizontal.
Contrôles existants inchangés ; navigateur à rejouer sur l'hôte.

## Tour 5 de la nuit, 28/10/2026

`docs/site-v1/page-unique/NUIT-TOUR-5.md` : panneau du menu ouvert uniquement,
à ≤900 px, filet bas de 1 px via `--on-canard` et rembourrages verticaux
égaux via `--brand-s2`. Quatre tests FR/EN à 390×844 et 800×1100 : bordure
visible, liens entiers, absence de débordement et état fermé inchangé.
Contrôles existants conservés ; Playwright à rejouer par Claude sur l'hôte.

## Hero tablette, 28/10/2026

`docs/site-v1/page-unique/HERO-TABLETTE.md` : entre 761 et 1100 px, schéma
sous le texte et le bouton, pleine largeur et sans plafond de hauteur ; légende
puis citation. Contour canard de 4 unités sur `.toklab` seulement, via Brand OS.
Textes, composant, animation et géométrie hors tablette inchangés. Quatre tests
FR/EN à 800×1100 et 1024×768 : ordre, largeur ≥90 %, étiquettes à l'écran ≥14 px,
bouton intrinsèque sur une ligne et absence de débordement. Contour vérifié dans
les tests animés FR/EN ordinateur/mobile ; aucun contrôle existant assoupli.
Validation : npm ci, lint, build Webpack, 121/121 tests Node (avant/après),
marque/claims et 19/19 Brand OS réussis. Turbopack interrompu après 90 s sans
progression ; 125 tests Playwright recensés, à rejouer par Claude sur l'hôte.

## Page stable, 28/10/2026

`docs/site-v1/page-unique/PAGE-STABLE.md` : légendes, cas et faces partenaires
réservent leur variante la plus haute par grille dès le SSR. Conversations
complètes dans le flux ; animation par opacité/translation seulement. General Sans
400/500/600 préchargées, repli Arial ajusté aux métriques des fichiers canoniques.
Correctif hôte : General Sans 400/500/600 en `font-display: optional` pour éviter
les sauts liés aux coupures de mots différentes en Arial ; préchargements et
repli conservés, IBM Plex Mono inchangée. Test de fontes lentes intact (position
et hauteur ≤ 1 px, layout-shift ≤ 0,01, chargement vérifié par `document.fonts.check`) ;
huit contrôles FR/EN supplémentaires vérifient General Sans sur le H1 au premier
affichage avec les fontes servies normalement (`getComputedStyle` et `document.fonts.check`).
Cal.com réserve 570/910 px selon la largeur du cadre, sans plafond ni découpe ;
profil étroit à 800 px à confirmer avec le calendrier réel sur l'hôte.
`tests/stabilite.spec.ts` rejoint `qa:network:rev01` : huit parcours FR/EN,
quatre tailles, 25 s immobiles puis défilement ; huit contrôles de fontes lentes.
SDK et iframe Cal servis localement, deny-all inchangé. Textes, `reading.ts`
et assertions existantes intacts ; géométrie et CLS à rejouer par Claude sur l'hôte.

## Hero trois plans, 29/10/2026

`docs/CODEX-SPEC-2026-10-29-hero-trois-plans.md` remplace les précédents
contrats du hero, dont `HERO-TABLETTE.md`. Titre expertise/mise au travail,
trois plans, 33 nœuds et quatre histoires issus des maquettes archivées dans
`docs/hero-trois-plans/` (sans générateurs Python). À partir de 1200 px :
légende et carte sous le texte à gauche, schéma dégagé et citation à droite.
En dessous : bouton pleine largeur, schéma sans libellés de nœuds ni zones,
plafonné à 560 px, légende puis citation ; H1 mobile 38/43 px.
Un seul minuteur, étapes 2700 ms, dernière 3600 ms, pause 900 ms ; nettoyage
hors écran et mouvement réduit restituent l'histoire 1 à l'étape 4.
Légendes et résultats réservent toutes leurs variantes dès le SSR, par rangée.
Le rose reste au seul bouton ; pastilles carrées blanches, validation sauge,
General Sans, aucun rayon ni ombre. Le hero entier tient toujours à 1440×800.
Les audits typographiques appliquent la nouvelle échelle uniquement au hero ;
les seuils de stabilité et les contrôles des autres sections restent inchangés.
