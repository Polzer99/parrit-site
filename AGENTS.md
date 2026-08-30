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
> Site institutionnel public **parrit.ai** (Next.js 16 / React 19, déployé sur Vercel via push `main`). REV 01 : **anglais uniquement** (la version FR est un lot futur à spécifier — bascule cliquable, jamais de redirection auto). L'arbre multilingue legacy a été supprimé le 14/08/2026 (Lot P) ; `/:lang/*` répond 301 vers `/`.

## Source de vérité COMMUNE = `TRUTH.md`
**Avant de toucher au contenu/positionnement/conversion, lire [`TRUTH.md`](./TRUTH.md)** : ce qu'est Parrit, les north stars (RDV qualifiés → cash), l'ICP, les offres, la voix (LE TAMIS), les 7 règles dures, et la définition d'une « amélioration ». C'est le **cerveau partagé** entre le site et l'agent d'amélioration continue **Hermes** (`hermes/`, voir `hermes/LOOP.md`). La source de vérité **visuelle** est la section suivante (REV 03). En cas de conflit : `REGLES-DOR.md` puis `VISION.md` (hors-repo) priment.

## Source de vérité visuelle = REV 03 (14/08/2026) — l'ancienne DA est MORTE

> **Ordre de Paul, 14/08/2026 : la direction artistique Smoooth Studio / « papier crème »
> (`#FFFDFA`, `#F5F8FF`, `#D1132F`, `#AA0003`, Arpona, grain papier, desktop-OS, sceau 速)
> est SUPPRIMÉE. Plus aucune surface ne s'en réclame. Ne jamais la reproduire, ne jamais
> « corriger » vers elle.** `BRAND.md`, `docs/design-system/`, `src/styles/parrit-tokens.css`,
> `src/components/ds/`, `design-source/brand-kit/` = archives historiques du code legacy
> non migré ; les rencontrer n'autorise pas à en écrire de nouvelles occurrences.

La DA active est celle du site en production. Trois sources, dans cet ordre :

| Source | Rôle |
|---|---|
| `docs/site-prod-rev01/parrit-command-center-rev03.html` | **la LOI** — prototype approuvé par Paul (Brand Command Center REV 03) : registres, red law, composants, cotes exactes |
| `src/system/tokens.css` | **les valeurs**. Un hex écrit ailleurs est un bug (gate `npm run qa:brand:rev01`) |
| `src/system/` + `src/app/(rev01)/` | les composants et pages canon |

Compléments : `docs/site-prod-rev01/REV03-DELTAS.md` (deltas appliqués),
`CONFORMITY-REV01.md` (protocole de conformité, gate screenshot), `logo-rev04/` (le mark).

- **Palette** : ink `#0A0B0C` · carbon `#131518` · carbon2 `#1A1D21` · paper `#F1F2F3` ·
  paper2 `#FAFAFB` · rule-l `#DDE0E3` · rule-d `#24282D` · g2 `#9CA1A6` · g3 `#55595E` ·
  g4 `#6F757B` · **Parrit Red `#E10600`** (pressé `#B80500`) · body-l `#26282B` · label-d `#C7CBCF`.
  Deux registres seulement : documents blanc-froid (l'institution) et instruments carbone (le produit).
- **Red law** : le rouge = décision requise, action qui s'exécute, état critique, objet
  sélectionné, commission scellée. JAMAIS décoratif (pas de titre rouge, pas de fond, pas de logo).
- **Typo T3 (arbitrage Paul 15/08, banc d'essai)** : **General Sans** (corps/UI, Fontshare,
  gratuite commerciale) + **JetBrains Mono** (registre technique, OFL) + **Fraunces variable**
  (OFL) — Fraunces RÉSERVÉE aux grands titres éditoriaux REV 02 (`--ed`, opsz 40, SOFT 0,
  WONK 0, poids ~480), jamais en corps. Auto-hébergées `public/fonts/rev02/`. Geist et
  IBM Plex sont MORTES. Pas d'italique, pas d'autre famille.
  Registre « k » : Mono 10px, letter-spacing .18em, uppercase.
- **Formes** : radius 0 partout (sauf mockups téléphone) · zéro ombre sauf l'unique ombre
  d'instrument `0 40px 80px -40px rgba(10,11,12,.4)` · zéro dégradé · statuts = forme + couleur.
- **Logo REV 04** : mark live-text `[P.]` JetBrains Mono 600, point rouge ; wordmark live-text
  `PARRIT.AI` (point rouge). Fichiers : `docs/site-prod-rev01/logo-rev04/` + `public/brand/`.
- **L'enveloppe fait partie du canon** : la command bar sombre (fixe 52px — wordmark,
  registre `SYSTEM PARRIT.AI · REV 01 · STATUS OPERATIONAL`, horloge live) est sur TOUTES les
  pages, et la séquence d'ouverture (`Opening.tsx` : boot log → statement avec Parrit Frame)
  joue à **chaque arrivée** sur `/` (décision Paul 14/08 — pas de flag de session ; skip au
  clic/scroll/touche, skip total en `prefers-reduced-motion`, SSR intact dessous).
- **Éléments propriétaires** : le Parrit Frame (crochets rouges = objet en attente de décision),
  la registry line (`PARRIT / SITE · REV 01 · 2026`), le Standard en spécification PS-01…PS-06.

### Règle de création — non négociable

Toute nouvelle page publique se construit avec `src/system/` (tokens, composants K/St/Frame/
Instrument/RegistryLine, boutons `.rev-button` / `.exec` / `.ghost`) et se vérifie contre le
prototype REV 03 (gate screenshot : paires 1440/390 prototype vs candidat). Un hex dans une
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
- `src/app/(rev01)/page.tsx` → home institutionnelle (Opening + hero « Your company. One system. » + live demo + loop) ; `layout.tsx` du groupe porte la command bar (`RevHeader`) et le footer.
- `/standard` (PS-01…PS-06) · `/commission` (Cal inline `paul-larmaraud/30min`, seul lien de booking du site) · `/journal` + `/journal/[slug]` · `/dossiers` · `/legal`.
- `/paul` et `/maxime` : **SUPPRIMÉES le 14/08/2026** (ordre Paul) — 301 vers `/` dans `next.config.ts`. Ne pas les recréer.
- `/manufacture` (doctrine + phases) · `/sketch/[id]` (esquisse personnalisée du funnel, noindex, force-dynamic — l'UUID de soumission est le jeton d'accès).
- `src/app/opengraph-image.tsx` (+ OG par article) = cartes OG, polices TTF officielles dans `src/og-assets/` (Satori refuse le woff2).
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
npm run qa:brand:rev01                          # hex hors tokens, radius, ombres, dégradés, PC-10
npx next start -p 3210 &                        # les specs visent :3210 (QA_BASE_URL)
npm run qa:network:rev01                        # 5 specs Playwright (deny-all réseau)
```
Voir aussi la skill `qa-playwright` (batterie responsive + multi-navigateur).

## Règles de sortie (non négociables)
- **Jamais d'appel runtime à `*.vercel.app`** dans une livraison (REGLES-DOR §13). Le site EST hébergé sur Vercel — ça vise les ressources chargées au runtime (images/redirects/signatures), pas l'hébergement.
- Prix publics autorisés uniquement sous forme d'ancrage `à partir de X €` quand la SOT le demande. Pas de devis détaillé ni de prix personnalisé hors propale privée. Pas de noms clients **dans le TEXTE** (anonymisé). Le mur de logos clients **visuel** est autorisé (override Paul, `BRAND.md §6`) — **contradiction ouverte, non tranchée**, voir `TEMPLATE-GRAMMAR.md` §8.2. En attendant l'arbitrage, la mécanique est la même dans les deux cas : toute preuve nominative, texte **ou** logo, exige `publication_permission: true` dans `src/lib/registry/preuves.ts`, et aucun template n'exige jamais un nom ou un logo pour se rendre.
- Collab Codex↔Claude = via **GitHub Issues/PR**, jamais d'auto-merge, **Paul merge**. Codex = codeur, Claude = relecteur (sécu/archi/bugs/dette).
- **Une seule exception à « jamais d'auto-merge »** (armée par Paul le 27/07/2026) : la skill Hermès `site-analysis` merge seule un changement **mineur**, et uniquement si `hermes/automerge-gate.mjs` rend le verdict MINEUR (branche `hermes-auto/` · ≤3 fichiers · ≤20 lignes · `.tsx` **modifiés** dans `src/components` ou `src/app` · CI entièrement verte · 1 merge/7 j). Tout le reste reste aux 3 feux. Détail et désarmement : `hermes/LOOP.md`. Cette exception ne s'étend **ni à Codex ni à Claude** : elle vaut pour la seule boucle Hermès, sur son seul périmètre.
