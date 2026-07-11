# Pivot home — « On recrute des agents qui travaillent chez vous »

> Objectif : transformer la home en **funnel de conversion world-class** à 2 offres, ciblant
> DG et Directeurs métiers de PME/ETI, en **humanisant l'IA** (fiches de poste, prénoms,
> avatars) et en montrant **tout ce qu'on a déjà déployé**. Design haut de gamme, épuré.
> **Faire évoluer, PAS dénaturer** : on garde ce qui marche (logos clients, La Veille, launches,
> blog cas d'usage, i18n, tokens canon). Validé Paul 11/07 — base de référence = le deck
> `parrit-os/projects/client-decks` (goût validé).

## Décisions verrouillées (Paul)
- **Prix affichés en clair** partout : Sprint **5 000 €** (forfait, 50/50) · Abonnement **99 €/mois** · Évolution **250 €/h**.
- **DA = canon brutalist actuel étendu** : `src/app/globals.css` (`--bg #FFFDFA`, `--ink #0C0C0D`,
  `--red #D1132F`, Geist + Geist Mono, angles NETS, zéro ombre/arrondi/dégradé, filets 1px).
  ⚠️ Ignorer la palette périmée d'AGENTS.md (`#F5F8FF/#AA0003`) — `globals.css` fait foi.
- **FR d'abord** : on écrit le contenu FR. Le scaffold 4 langues (`[lang]`) doit continuer à builder
  (SSG) ; EN/pt-BR/zh peuvent reprendre le FR pour l'instant (i18n = follow-up, à flagger).
- **On ne met PAS en avant la souveraineté** comme pitch principal (Paul 11/07) : le message est
  « on déploie de vrais agents ». La souveraineté (VPS, données chez vous) reste un argument de
  réassurance sur la slide offre, pas le héros.

## Catalogue = source de vérité UNIQUE
- `content/agents/catalog.json` (déjà commité) = catalogue public (même schéma que le registre du
  deck ; champ `client` interne retiré → **jamais de nom client dans le texte**, règle Parrit).
- Structure : `{ personas: { growth|ops|data|content: {name,label,img} }, cases: [{id,dept,status,featured?,title,desc,sector,date}] }`.
- **À créer** : `src/lib/agents.ts` — loader typé (TS strict, pas de `any`) qui lit le JSON, groupe
  par département, filtre `status==='deployed' || featured`, expose `getCatalog({perDept})` et un
  `deployedCount`. Le llms.txt ET la home consomment CE loader. Ajouter un cas = 1 entrée JSON,
  tout se régénère.

## Home — sections (ordre)
Composant : faire évoluer `src/components/HomeDeux.tsx` (styles inline `<style>` déjà en place, même
convention). Garder les sections existantes qui marchent, insérer les nouvelles.

1. **Hero** — reprendre le cadrage du deck. H1 : « On ne vend pas de l'IA. On **recrute des agents**
   qui travaillent chez vous. » Lede court. CTA basse friction (voir §CTA). Garder le lockup + badge.
2. **Trust logos** — INCHANGÉ (mur de logos clients existant).
3. **Catalogue d'agents** (NOUVEAU, cœur) — 4 collaborateurs humanisés (Chloé/Thomas/Lucas/Amélie),
   **portrait** (`/brand/agents/<name>.png`) + prénom + label département + 3 cas réels chacun,
   depuis `getCatalog()`. Grille responsive (4 → 2 → 1 col). Composant `AgentCard`. Reproduire
   l'esprit du slide 3 du deck (fiche de poste, filets, chip). Sous-titre : « Pas des slides. Des
   agents qui tournent en production. » + foot « N agents déjà en production… ».
4. **Grille tarifaire** (NOUVEAU) — 3 tiers EN CLAIR, cartes plates canon (pas d'ombre) :
   Sprint 5 000 € (mis en avant, fond encre), Abonnement 99 €/mois, Évolution 250 €/h. Reprendre
   le slide 4 du deck. Micro-plan « en 14 jours » (audit flash → VPS sécurisé → 1er agent → passation).
5. **La Veille** — INCHANGÉ (produit d'appel, bandeau sombre existant).
6. **Cas d'usage / blog** — INCHANGÉ (section transformations existante).
7. **Launches** — INCHANGÉ (build in public).
8. **CTA final** — INCHANGÉ (ou aligné « déployer votre premier agent »).

## CTA basse friction (§réduction de friction)
- Boutons « **Embaucher un agent** » et « **Voir la démo** ». Pas de long formulaire.
- Réutiliser le parcours lead existant (`QuickContact` / webhook `parrit-lead`, cf. PR #129/#131) :
  soit `→ /[lang]/rendez-vous`, soit mini-form 2 champs (prénom + email) qui poste sur `parrit-lead`
  avec `source` taggée (`home-hire-agent`). Ne rien casser de l'attribution existante.

## Gouvernance de contenu
- **`TRUTH.md`** : ajouter l'autorisation explicite des **prix publics fermes** pour les 3 offres
  produitisées (Sprint/Abo/Évolution), sinon Hermès « corrigera » en enlevant les prix. Mettre à
  jour la définition de l'offre (2 offres produitisées + La Veille door-opener).

## GEO
- Réécrire `public/llms.txt` + la route `src/app/llms-full.txt/route.ts` : nouveau positionnement
  (« recruter des collaborateurs virtuels »), les 3 offres CHIFFRÉES, le catalogue d'agents (depuis
  le loader), ICP = DG / Directeurs métiers PME-ETI. Retirer l'ancien pitch « boutique Claude Code /
  pas de TJM / pas de slide ».

## Contraintes de sortie (NON négociables — §25 + AI Playbook)
- TS strict, **`any` interdit**, ESLint strict. `ci.yml` = checkout → `npm ci` → `npm run lint` →
  `npm run build` (npm ci, jamais install). CI vérifie, ne déploie pas.
- **Aucun appel runtime à `*.vercel.app`** dans la livraison (§13). Secrets serveur-only.
- **Aucun nom client dans le TEXTE** (le catalogue est déjà anonymisé par secteur ; mur de logos OK).
- `npm run build` vert (SSG 4 langues) + `scripts/contrast-audit.py` = 0 avant de marquer prêt.
  Idéalement la skill `qa-playwright` (responsive) passe.
- **PR obligatoire, jamais d'auto-merge. Claude review, Paul merge (3 feux).** Branche de base =
  `feat/pivot-collaborateurs-souverains` (contient déjà les assets + la base HomeDeux).

## Critères d'acceptation
1. Home FR montre : hero « recruter des agents », catalogue 4 agents avec portraits + cas réels
   (lus depuis `content/agents/catalog.json` via `src/lib/agents.ts`), grille prix en clair, sans
   avoir supprimé logos/Veille/blog/launches.
2. Ajouter une entrée dans `catalog.json` fait apparaître le cas sur la home ET dans llms.txt, sans
   autre changement de code.
3. CTA « Embaucher » / « Voir la démo » sans long formulaire, attribution lead préservée.
4. `TRUTH.md` autorise les prix publics ; `llms.txt` reflète les 3 offres chiffrées.
5. `npm run lint` + `npm run build` + `contrast-audit` verts. Aucun `*.vercel.app` runtime. Aucun `any`.
