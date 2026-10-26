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
- **L'enveloppe fait partie du canon, état au 20/09/2026** : la command bar sombre (hauteur adaptée au contenu,
  dans le flux normal du document, PAS `position: fixed` — elle défile avec la page depuis la
  correction du 20/09 ; `tests/conformity-home.spec.ts` vérifie explicitement `not.toHaveCSS
  ("position", "fixed")`) porte le wordmark, une navigation à quatre entrées (Conseil & Transformation, AI Sprints, Engineering & Intégration, Journal), le
  sélecteur de langue et une seule action principale « Parler d'un projet »/« Talk about a project ». Son contenu
  est aligné sur la colonne `max-width:1160px` du reste du site (`.cmdbar-inner`), pas sur les
  bords bruts de l'écran. Elle est rendue avant `{children}` dans `layout.tsx` sur TOUTES les
  pages ; sans horloge live (retirée, décorative) ni doublon de navigation vers `/commission`.
  Le composant `Opening.tsx` (boot log et statement avec Parrit Frame) est conservé
  mais n'est importé ni rendu par aucune page depuis le 06/09/2026.
  Historique des passes (retrait
  de l'horloge, alignement sur la grille, puis retrait de `position: fixed`) : voir les trois
  spécifications `docs/CODEX-SPEC-2026-09-20-header-*.md`. (Le registre `SYSTEM PARRIT.AI · REV
  01 · STATUS OPERATIONAL` décrit par `docs/site-prod-rev01/lots/LOT-O-OPENING-CMDBAR.md` n'a
  jamais été implémenté dans `RevHeader.tsx` : cette ligne décrivait déjà le prototype, pas le
  composant livré — écart non corrigé, signalé pour mémoire.)
- **Éléments propriétaires** : le Parrit Frame (crochets d'accent = objet en attente de décision),
  la registry line et les numéros 01…06 ne s’affichent plus en mode accessible. Le Standard conserve ses six engagements sans numéros en police machine.

### Boutons publics — tour 1 (26/10/2026)

Largeur de contenu à partir de 600 px ; sous 600 px, tous les boutons d’un même
groupe suivent le même choix de largeur. Alignement sur le bord gauche du texte
précédent, ou centré si son titre est centré. Deux actions : `exec` puis `ghost`,
espacement `var(--brand-s2)`, hauteur et ligne de base communes. Un seul `exec`
par section ; principal en clôture. Pas de point final, infinitif FR et impératif
court EN. Vers `/commission` : « Parler d'un projet » / « Talk about a project ».
Exceptions : bouton principal du hero accueil « Parlons de votre transformation » /
« Let's talk about your transformation » ; lien textuel BWY « Parler d'un système sur mesure » / « Talk about a
custom system ». L’envoi du formulaire commission reste à droite du champ.
Un seul éclat rose par écran (Brand OS) : le bouton de navigation reste `ghost` tant qu’un `exec` du haut de page est visible, puis devient `exec` ; la paire `exec` puis `ghost` ne s’applique que si aucun autre rose n’est déjà à l’écran.

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

## Routes (REV 01 — après purge legacy du 14/08/2026)
- `src/app/(rev01)/page.tsx` → home institutionnelle (hero « We turn operational problems into systems that work. », esquisse, méthode et preuves) ; `layout.tsx` du groupe porte la command bar (`RevHeader`) et le footer.
- `/standard` (critères 01…06) · `/commission` (Cal inline `paul-larmaraud/audit`, 15 min — premier échange, seul lien de booking du site ; *corrigé le 20/09/2026, `paul-larmaraud/30min` ne correspondait plus à `CAL_LINK_COMMISSION` dans `site.config.ts`*) · `/journal` + `/journal/[slug]` · `/dossiers` · `/legal`.
- `/paul` et `/maxime` : **SUPPRIMÉES le 14/08/2026** (ordre Paul) — 301 vers `/` dans `next.config.ts`. Ne pas les recréer.
- `/manufacture` (doctrine + phases) · `/sketch/[id]` (esquisse personnalisée du funnel, noindex, force-dynamic — l'UUID de soumission est le jeton d'accès).
- `src/app/opengraph-image.tsx` (+ OG par article) = cartes OG, polices locales officielles dans `src/og-assets/` (Satori refuse le woff2).
- `src/app/camp-costa-rica/` = seule survivance de l'ancienne palette (voulu) ; `src/proxy.ts` ne gère plus que le rewrite d'hôte campparrita.com.
- `scripts/generate-llms.mjs` (prebuild) régénère `public/llms.txt` — le modifier LUI, pas le fichier généré.

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
- Clients (25/10/2026, révision 4) : seuls les noms de `src/system/public-clients.ts` sont publiables (Laparra, Clevery, Forexpert, Joone, SNCF) ; tous les autres restent anonymisés. Clevery Avocats désigne Clevery. Joone : accompagnement IA ; SNCF : formation avec Arkel, jamais client direct. Exception : le Journal ne nomme aucun client, même public. Aucun logo ajouté dans ce lot. Aucun template n'exige de nom ou de logo pour se rendre.
- Positionnement (26/10/2026) : définition canonique `parrit-canon/positioning/POSITIONNEMENT-CANONIQUE-2026-10-26.md`, remplacé pour le site par `docs/site-v1/ETAPE-1-PLAN.md` : trois portes et Harness Engineering ; pas de Content Factory, chiffres de résultat ni mentions d’écosystème au lot 1.
- Marque (12/10/2026) : Parrit.ai uniquement ; aucune mention du fondateur hors `/legal`.
- Mesure d'audience (05/10/2026) : PostHog retiré du navigateur ; seule mesure active, Cloudflare Web Analytics injectée hors dépôt par Cloudflare et décrite dans `/legal`.
- CTA (26/10/2026) : « Parler d'un projet » / « Talk about a project », hero « Parlons de votre transformation » / « Let's talk about your transformation » vers `/commission` ou `/fr/commission`.
- Tests (25/10/2026) : contrôler les règles de fond et la structure, pas les libellés. Conserver les contrôles de destination, accessibilité, réseau et géométrie.
- Collab Codex↔Claude = via **GitHub Issues/PR**, jamais d'auto-merge, **Paul merge**. Codex = codeur, Claude = relecteur (sécu/archi/bugs/dette).

## Site V1, lot 1 (26/10/2026)

Accueil H01 à H07, H11 et H12. Quatre nouvelles pages bilingues, dont
`/fr/conseil-transformation` associé à `/consulting-transformation`.
Menu mobile accordéon natif, dans le flux ; CTA accessible sans recouvrir le contenu.
Depuis le tour 2, H06 affiche un visuel CRM ; le module à onglets reste sur
`/engineering-integration`, avec tous ses panneaux sans JavaScript et onglets
clavier après hydratation.
Les preuves passent par `getSiteEvidence` : permission accordée, portée et dates valides.
La date de revue déclenche un échec CI 30 jours avant, jamais un retrait en production.
Aucun logo client, chiffre de résultat ni attribution institutionnelle au lot 1.

## Mode accessible, décision du 26/10/2026 (soir)

Paul : « Nous vendons le système en production. […] tout cet univers, la visuelle de pseudo-geek qu'on avait supprimée dans la nouvelle direction artistique, dans le nouveau branding. »

Sur les pages publiques rev01 et SiteV1Page : aucun surtitre K/eyebrow/kicker,
aucune étiquette de fiche technique ou registre documentaire, aucun index
numéroté en police machine. La police IBM Plex Mono est réservée aux blocs de
code du Journal et à l’annexe `/systems`. Le mot-symbole de navigation demeure
inchangé. Référence : `docs/site-v1/HANDOFF-ERGONOMIE-IMPACT.md`.
La spec `tests/ergonomie-impact.spec.ts` bloque la réapparition de mono visible
sur l’accueil et les quatre pages V1 FR/EN, hors mot-symbole et code autorisé.

## Tour 2 impact (27/10/2026)

Accueil : H1 7 colonnes, résumé/actions 5 colonnes, cadre produit 1160 px utiles
en dessous. H03/H05/H06/H07 alternent texte et visuel partagé avec leur page V1
(`ServiceVisual`). Mobile : texte puis visuel, navigation sur une rangée et CTA
du hero. Les pages V1 ont des rangées titre/contenu 4/8 et le Conseil regroupe
problèmes, travail et livrables. Référence : `docs/site-v1/HANDOFF-TOUR2-IMPACT.md`.
La mesure avant/après et les captures passent par `tests/tour2-impact.spec.ts` ;
le test de hauteur exige une référence réelle avant de valider les 30 %.
