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
> Site marketing public **parrit.ai** (Next.js 16 / React 19 / Tailwind v4, déployé sur Vercel via push `main`). 4 langues : `fr` · `en` · `pt-BR` · `zh-CN`.

## Source de vérité COMMUNE = `TRUTH.md`
**Avant de toucher au contenu/positionnement/conversion, lire [`TRUTH.md`](./TRUTH.md)** : ce qu'est Parrit, les north stars (RDV qualifiés → cash), l'ICP, les offres, la voix (LE TAMIS), les 7 règles dures, et la définition d'une « amélioration ». C'est le **cerveau partagé** entre le site et l'agent d'amélioration continue **Hermes** (`hermes/`, voir `hermes/LOOP.md`). `BRAND.md` reste la source de vérité **visuelle** (DA). En cas de conflit : `REGLES-DOR.md` puis `VISION.md` (hors-repo) priment.

## Source de vérité visuelle = `docs/design-system/` + `src/styles/parrit-tokens.css` + `src/components/ds/`

> **Corrigé le 01/08/2026.** Cette section prescrivait la palette de juin (`#F5F8FF` / `#161616` / `#AA0003`) et **interdisait** `#D1132F` et `#0C0C0D` — c'est-à-dire exactement les couleurs canoniques. Chaque session d'agent réintroduisait donc la dette que la précédente venait de solder. Les valeurs canoniques sont vérifiées dans Figma (`Direction-artistique`, fileKey `J8hieoaq5XwOxqtQJbiP0A`, variables `Noire` · `Rouge` · `Blanc`).

Quatre sources, dans cet ordre. Aucune valeur visuelle ne se décide ailleurs.

| Source | Rôle |
|---|---|
| `docs/design-system/` (00→12, `PARRIT-DESIGN-SYSTEM.md`, `DECISIONS.md`, `STATUS.md`) | la doctrine et les ADR |
| `src/styles/parrit-tokens.css` | **les valeurs**. Un hex écrit ailleurs est un bug |
| `src/components/ds/primitives.tsx` + `ds/level0.tsx` | les composants canoniques |
| `~/parrit-os/site-lead-engine/_parallel/TEMPLATE-GRAMMAR.md` | l'assemblage en pages : les huit templates, leurs registres, leurs contrats |

- **Palette canonique** : papier `#FFFDFA` · papier alt `#F0F0F0` · encre `#0C0C0D` · muted `#6E7079` · faint `#8987A1` · rouge signal `#D1132F` · filet `#D0D8D7` · accent chaud `#C67C60` (liseré uniquement, < 2 % d'un écran). **Il n'existe pas de blanc pur** : `#FFFFFF` est interdit comme fond et comme encre.
- **Polices** : **Arpona** pour le titrage (`--type-display-primary`, auto-hébergée dans `public/fonts/arpona/`, 4 graisses, graisse display 600) · **Geist** pour l'UI (`--type-ui-primary`) · **Geist Mono** pour labels, corps mono et coordonnées (`--type-mono-primary`).
- **Interlignage display = `1.08`** (ADR-013, mesuré sur capitales accentuées). `0.9` n'est autorisé que si la chaîne ne porte aucune capitale accentuée **et** que la QA passe sur cette chaîne.
- **Périmé, à ne plus produire** : `#F5F8FF`, `#161616`, `#AA0003`, `#FEFDF9`, `#FFFFFF`, `#2E2D2B`, DM Sans, Cormorant, Hanken Grotesk, JetBrains Mono, le second design system de `public/da/`, la chrome « fenêtre d'OS » (`.landing-v4-traffic`, pastilles rondes), le fond photo attaché au `body`. Ces valeurs restent présentes dans le code non migré : les rencontrer n'autorise pas à en écrire de nouvelles.
- **Rayons, ombres, textures** : rayon `0` partout (`--radius-none`) ; `--radius-round` est réservé au sceau, aux avatars et aux pastilles d'état. **Aucune ombre portée** — le seul token d'ombre vaut `none`, la seule exception est l'anneau de focus. Le grain papier est **trois couches** (`.parrit-grain`) et ne se cumule jamais avec le halftone.
- **Largeurs** : trois, pas quatre — `--container-text` 46rem, `--container-content` 80rem, `--container-wide` 90rem.
- **Composants signature** : `HeroLevel0`, `ProofRailLevel0`, `HermesTraceLevel0`, `TestimonialShiftLevel0`, `CTASectionLevel0`, `MediaPlate`, plus les primitives (`Label`, `IndexMark`, `Badge`, `Metric`, `Divider`, `SectionHeader`, `Button`, `TextLink`).
- **Structural Integrity Test** : tout média expressif porte `data-layer="expressive"`. Une page qui devient illisible sous `[data-hide-media="true"]` est non conforme — ce n'est pas le test qui est trop dur.
- **Voix** (`BRAND.md §6bis`, doctrine LE TAMIS) : Operating Partner, autorité démontrée, faits (Enargeia), sobriété, **pas de tiret cadratin `—`**, pas de jargon IA.

### Règle de création — non négociable

**Toute nouvelle page publique doit être construite avec les primitives, les tokens et les templates canoniques.**

Il est interdit de créer un design system local, une feuille de style complète propre à une page, un jeu de tokens parallèle, une seconde famille typographique ou un composant qui duplique un composant existant de `src/components/ds/`.

Concrètement, avant d'écrire une page :

1. chercher le template qui correspond dans `src/components/templates/` (T1 article · T2 vidéo · T3 ressource · T4 système · T5 thème · T6 presse · T7 landing · T8 auteur) ;
2. si aucun ne correspond, composer avec les primitives et le niveau 0 — **pas avec du CSS neuf** ;
3. si une primitive manque vraiment, elle s'ajoute à `src/components/ds/`, adossée aux tokens, et elle est documentée. Elle ne naît jamais dans une page.

Une page n'écrit **ni couleur, ni taille de police, ni rayon, ni ombre en dur**. Elle consomme des variables CSS. Un hex dans `src/app/**` est un défaut, pas un choix.

**Les CTA, les preuves et les ressources sont des registres, pas du texte de page** : `src/lib/registry/cta.ts`, `preuves.ts`, `ressources.ts`. Un libellé de bouton écrit dans un composant est un défaut. Le contrat complet est dans `TEMPLATE-GRAMMAR.md` §5.

## Routes
- `src/app/[lang]/page.tsx` → rend **`HomeDeux.tsx`** (home pivot 2026 : hero « recruter des agents » + catalogue + 3 offres sans prix + La Veille + blog). Contenu i18n dans le `DICT` interne de `HomeDeux` (fr/en/pt-BR/zh-CN) ; les cartes agents viennent de `catalog.json` (FR pour l'instant, i18n à faire). L'ancienne home desktop-OS `HomeClient.tsx` n'est plus servie que par `/os-classic` (noindex).
- `src/app/[lang]/{sprint,audit-claude-code,setup-claude-code,remote}/page.tsx` → partagent `src/components/LandingPage.tsx` + contenu dans `src/app/[lang]/dictionaries/*.json`.
- `src/app/[lang]/{blog,glossaire}/...` · `src/app/{academy,fondateurs}/...` (hors `[lang]`, FR seul ; academy = voix « grand public », tutoiement).
- `src/app/opengraph-image.tsx` = carte OG. `src/app/os/*` = dashboard interne (PAS le site public).

## Anatomie de `HomeClient.tsx` (~3900 lignes — le gros morceau)
Les numéros bougent : re-`grep` avant d'éditer. Ordre du fichier :
1. **`type Lang` + `const DICT`** (≈25-1620) : tout le contenu, **un bloc par langue** — `fr` (≈28), `en` (≈418), `"pt-BR"` (≈807), `"zh-CN"` (≈1174). Chaque bloc a la même forme : `offers[]`, `panel.{manifeste,transformation,methode,cas,paul,yukun}`, `contact`, `waitlist`, docks. **Éditer une langue = répliquer dans les 4.**
2. **Types** `AgentBox`/`OfferCopy`/`PanelCopy`/`FullCopy` (≈1543-1620) + `getCopy()` (≈1624).
3. **Composants de présentation** (≈1631-3450) : `Icon*`, `LeftIcon`, `OfferIcon`, `HeroScene` (constellation), `Win` (modale), `SlotPicker`, `ContactBlock`, `WaitlistWindow`, `OfferWindow`, **`PanelContent`** (rend manifeste/transformation/méthode/cas/paul/yukun, styles inline), `WorldMap`.
4. **`export default HomeClient`** (≈3455) : topbar → desktop grid (dock gauche = panels, centre = hero, dock droit = offres) → section « deux fronts » → carte du monde → dock mobile → **modales** (`AnimatePresence`) → blog → statusbar.

Le **contenu** vit dans `DICT` ; le **style** vit dans les composants (inline) + `globals.css` (classes `.parrit-os-*`, `.landing-v4-*`).

## Garde-fou contraste (lancer AVANT tout push)
`scripts/contrast-audit.py` (Playwright) marche le DOM, calcule fg/bg effectifs + ratio WCAG, sort tout texte < 3:1 (noir-sur-noir ≈ 1.0). Couvre la home + chaque modale + sous-pages.
```bash
npm run dev                                   # sert sur :3000 (ou un port libre)
PARRIT_BASE=http://localhost:3000 python3 scripts/contrast-audit.py \
  /fr /fr/sprint /fr/audit-claude-code /fr/setup-claude-code /fr/remote \
  /fr/glossaire /academy /fondateurs        # cible : TOTAL = 0
```
Voir aussi la skill `qa-playwright` (batterie responsive + multi-navigateur). Toujours `npm run build` avant push (4 langues SSG).

## Règles de sortie (non négociables)
- **Jamais d'appel runtime à `*.vercel.app`** dans une livraison (REGLES-DOR §13). Le site EST hébergé sur Vercel — ça vise les ressources chargées au runtime (images/redirects/signatures), pas l'hébergement.
- Prix publics autorisés uniquement sous forme d'ancrage `à partir de X €` quand la SOT le demande. Pas de devis détaillé ni de prix personnalisé hors propale privée. Pas de noms clients **dans le TEXTE** (anonymisé). Le mur de logos clients **visuel** est autorisé (override Paul, `BRAND.md §6`) — **contradiction ouverte, non tranchée**, voir `TEMPLATE-GRAMMAR.md` §8.2. En attendant l'arbitrage, la mécanique est la même dans les deux cas : toute preuve nominative, texte **ou** logo, exige `publication_permission: true` dans `src/lib/registry/preuves.ts`, et aucun template n'exige jamais un nom ou un logo pour se rendre.
- Collab Codex↔Claude = via **GitHub Issues/PR**, jamais d'auto-merge, **Paul merge**. Codex = codeur, Claude = relecteur (sécu/archi/bugs/dette).
- **Une seule exception à « jamais d'auto-merge »** (armée par Paul le 27/07/2026) : la skill Hermès `site-analysis` merge seule un changement **mineur**, et uniquement si `hermes/automerge-gate.mjs` rend le verdict MINEUR (branche `hermes-auto/` · ≤3 fichiers · ≤20 lignes · `.tsx` **modifiés** dans `src/components` ou `src/app` · CI entièrement verte · 1 merge/7 j). Tout le reste reste aux 3 feux. Détail et désarmement : `hermes/LOOP.md`. Cette exception ne s'étend **ni à Codex ni à Claude** : elle vaut pour la seule boucle Hermès, sur son seul périmètre.
