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

## Source de vérité visuelle = `src/app/globals.css` + `design-source/DA-TOKENS-EXTRACTED.md`
Depuis le 23/06, toute UI publique part de `src/app/globals.css` (`:root`) et de `design-source/DA-TOKENS-EXTRACTED.md`. `BRAND.md` est un backup historique : ne pas l'utiliser pour ressusciter l'ancienne home desktop-OS.
- **Palette stricte** : fond `#F5F8FF` · encre `#161616` · sombre `#2E2D2B` · rouge `#AA0003` · terracotta rare `#C67C60` · muted `#6E7079` · faint `#8987A1` · border `rgba(20,20,26,.10)`.
- **INTERDIT (retired)** : crème `#FEFDF9`, ancien rouge `#D1132F`, ancienne encre `#0C0C0D`, DM Sans, Cormorant comme typo de page, CTA/cartes neo-brutalist, namespace `.parrit-os-*` sur la home.
- **Polices** : Geist pour body/heading (`--font-body`, `--font-heading`) · Geist Mono pour labels/chips/coords (`--font-mono`).
- **Composants signature** : cartes plates, chips pilules, ladder, logowall clients séparé, CTA leadform + WhatsApp, Qualiopi.
- **Voix** (`BRAND.md §6bis`, doctrine LE TAMIS) : Operating Partner, autorité démontrée, faits (Enargeia), sobriété, **pas de tiret cadratin `—`**, pas de jargon IA.

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
- Prix publics autorisés uniquement sous forme d'ancrage `à partir de X €` quand la SOT le demande. Pas de devis détaillé ni de prix personnalisé hors propale privée. Pas de noms clients **dans le TEXTE** (anonymisé). Le mur de logos clients **visuel** est autorisé (override Paul, `BRAND.md §6`).
- Collab Codex↔Claude = via **GitHub Issues/PR**, jamais d'auto-merge, **Paul merge**. Codex = codeur, Claude = relecteur (sécu/archi/bugs/dette).
