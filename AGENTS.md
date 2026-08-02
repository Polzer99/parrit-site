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

## Contexte partagé = `.ai/PARRIT_CONTEXT_INTERNAL.md`
`CLAUDE.md` importe ce fichier et le bundle interne : même contexte pour Claude Code, Codex et le shell. Le bundle est **généré**, jamais édité à la main. Régénérer avec `npm run context:build`, vérifier avec `npm run context:check`, afficher avec `npm run context:show`. Le prebuild lance `context:check`.

Trois profils : `.ai/PARRIT_CONTEXT_INTERNAL.md` (défaut dans le dépôt) · `.ai/PARRIT_CONTEXT_COMMERCIAL.md` · `.ai/PARRIT_CONTEXT_PUBLIC.md`.

## Source de vérité du positionnement = `brand/00_SOURCE_OF_TRUTH.md`
Index des trois registres, avec quatre hiérarchies de précédence. **Identifier son registre avant de produire du contenu.**

- **Interne** `brand/00A_POSITIONING_INTERNAL.md`, status `living`. Évolue souvent, affirmations statuées.
- **Externe** `brand/00B_POSITIONING_EXTERNAL.md`, status `approved` v1.0.0. Contrat stable avec le marché, ne change que sur décision explicite de Paul.
- **Commercial** `brand/00C_COMMERCIAL_NARRATIVE.md`, status `adaptable-within-guardrails`. Approfondit `00B` sans le contredire.
- **Phrases publiques exactes** `positioning-os/10-LOCKED-PUBLIC-COPY.md`, 14 paires FR et EN. **Jamais réécrites.** `context:check` échoue si une paire manque, change d'un caractère, casse sa correspondance FR/EN ou sort de l'ordre canonique.

Une évolution interne ne modifie pas automatiquement le public. Une formulation commerciale ne devient pas une phrase canonique. Hors repo, `REGLES-DOR.md` puis `VISION.md` priment.

**`status: historical`, hors de toute position canonique et exclus des bundles** : `TRUTH.md` · `MATURITE-SOT.md` · `BRAND.md` · `DESIGN-SYSTEM.md` · `design-source/DA-TOKENS-EXTRACTED.md`.

## Source de vérité visuelle ET éditoriale = `brand/` (Parrit Brand OS v0.2.1, 30/07/2026)
**Avant toute UI, tout copy, tout visuel : lire [`brand/README.md`](./brand/README.md) puis `brand/00` et `brand/01`.** Le Brand OS est le canon de marque de TOUTE l'entreprise (site, propales, decks, PDF, carousels), pas seulement de ce repo. Le site en ligne est une sortie du système, jamais la source.

Précédence : `brand/00_SOURCE_OF_TRUTH > brand/01_DESIGN_TOKENS > brand/02-05 (contrats) > Figma audité > code > site en ligne`. Hors repo, `REGLES-DOR.md` puis `VISION.md` priment.

- **Palette stricte** (validée Paul 04/07 sur Figma, VERROUILLÉE) : fond `#FFFDFA` (crème chaud) · fond alt `#F0F0F0` · encre `#0C0C0D` · muted `#6E7079` · rouge signal `#D1132F` · red-tint `rgba(209,19,47,.10)` · filet `#D0D8D7` · terracotta RARE `#C67C60`.
- **Polices** : Geist pour titres (`letter-spacing:-0.04em`, poids 500-600) · Geist Mono pour corps, labels et boutons.
- **Zéro ombre, zéro arrondi** (`border-radius:0`, `radius.round` réservé au sceau/avatar/pastille), zéro dégradé décoratif. Filets 1px, whitespace massif, cartes plates. Grain papier 3 couches = la seule texture de fond.
- **PÉRIMÉ, ne plus jamais en partir** : `design-source/DA-TOKENS-EXTRACTED.md` (`#F5F8FF`/`#161616`/`#AA0003`/Hanken) · `BRAND.md` (backup DA agence juin) · DNA PostHog/Pancake pour les couleurs et typos (leurs **formes** restent libres). Les blocs « palette stricte #F5F8FF » et « INTERDIT : #D1132F » qui vivaient ici jusqu'au 30/07 étaient faux et sont supprimés.
- **Composants signature** : cartes plates, ladder, logowall clients séparé, CTA leadform + WhatsApp, Qualiopi. Contrats complets dans `brand/02_COMPONENTS.md`.
- **Voix** : `00B` §8 gouverne le ton et le vocabulaire ; `brand/03_CONTENT_SYSTEM.md` est un guide d'exécution subordonné (+ doctrine LE TAMIS) : Operating Partner, autorité démontrée, faits, sobriété, **pas de tiret cadratin `—`**, pas de jargon IA, jamais de preuve ni de ROI inventés.

### Règles visuelles non négociables
Papier crème, encre noire, un seul rouge Parrit contrôlé. Hiérarchie éditoriale, espace négatif généreux, grain tactile. **Le rouge signifie signal, action, causalité ou état** : jamais un fond décoratif étalé. Géométrie carrée par défaut. Halftone et fils rouges seulement quand ils expliquent quelque chose. Photo source propre, overlays de marque ajoutés en code ou Figma. Le mobile est une composition dessinée, pas un desktop écrasé. **Jamais** de couleur, police, rayon, espacement, ombre ou durée hors du système de tokens. Jamais de dégradé bleu-violet, néon, hologramme, robot humanoïde, blob 3D glacé, glassmorphism, faux dashboard ni esthétique de banque d'images.

### Règles de message non négociables
Partir d'un workflow réel, d'un input et d'un output attendu. Montrer ce que fait l'agent, ce qui reste humain, le périmètre et l'incertitude. Langage court et concret. **Jamais inventer une preuve, un ROI, une métrique, un nom de client ou une faisabilité.** Jamais décrire un agent comme un employé magique. L'objet de conversion est un workflow concret, pas une démo générique.

## Routes
- `src/app/[lang]/page.tsx` → rend `HomeClient.tsx` (la home « desktop-OS »). C'est ~95 % du site.
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
- **Aucun prix public. Aucun prix en commercial générique.** Les montants n'existent qu'en INTERNAL et dans un devis ou une proposition nominative transmis volontairement. Les bundles public et commercial échouent sur un symbole monétaire, un montant en devise ou une règle tarifaire interne. Le prototype commercial gratuit sélectif reste `INTERNAL STRICT`. Pas de noms clients **dans le TEXTE** (anonymisé) ; le mur de logos **visuel** reste autorisé (override Paul).
- Collab Codex↔Claude = via **GitHub Issues/PR**, jamais d'auto-merge, **Paul merge**. Codex = codeur, Claude = relecteur (sécu/archi/bugs/dette).
- **Toute décision de marque stable se grave dans le même PR** : code modifié + document `brand/` concerné mis à jour + entrée ADR dans `brand/09_GOVERNANCE.md` + captures + rollback décrit. Un changement de token, de promesse principale, d'offre, de prix ou de mention légale exige la validation de Paul. Tester à 375, 768, 1024 et 1440 px.
- **Pas de swarm large sur ce repo.** Deux audits en lecture seule en parallèle au maximum, puis on consolide avant d'implémenter. Ordre de travail : inspecter la stack réelle → lancer build/lint/tests existants → écrire un audit court avec preuves → plan étroit → implémenter par incréments.
- **Portes de qualité avant de dire « c'est fait »** : typecheck · lint · tests · `npm run build` (4 langues SSG) · revue accessibilité et clavier · revue `prefers-reduced-motion` · captures responsive · perf · vérification des events analytics · revue vie privée sur les inputs Hermès · scan des tokens en dur · vérification de chaque affirmation chiffrée. Rapporter ce qui a échoué, pas seulement ce qui est passé.
