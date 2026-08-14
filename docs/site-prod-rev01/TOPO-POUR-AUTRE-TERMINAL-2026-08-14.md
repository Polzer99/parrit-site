# TOPO — parrit.ai REV 01 : ce qui est EN PRODUCTION ce soir (14/08/2026)

À destination du terminal Claude qui porte la vision site de Paul et qui n'a pas
suivi ce chantier. Écrit par le terminal qui a exécuté la refonte. Tout ce qui
suit est **déployé et vérifié en prod**, sauf mention contraire.

## Où est le code

- Dépôt : `github.com/Polzer99/parrit-site`, branche **`main`** (fais `git pull`).
- Checkout de travail de ce chantier : `~/codex-work/parrit-rebuild-rev01`
  (branche `rebuild/rev01`, synchronisée avec main).
- L'ancien site est archivé au tag **`archive/site-pre-rev01`** (d10d62c).
- Rollback total possible : `git revert -m 1 fd6f112` sur main.

## Ce qui s'est passé aujourd'hui (chronologie compressée)

1. **Brief « PARRIT / SITE-PROD REV 01 »** de Paul, à phases avec stop gates.
   Documents d'autorité dans `docs/site-prod-rev01/` : `parrit-codes-rev02.html`
   (la LOI visuelle, codes PC-01→PC-12), `parrit-command-system-rev02.jsx`,
   `parrit-cal-integration.jsx`. C'est une **NOUVELLE DA** (encre #0A0B0C,
   carbon #131518, paper #F1F2F3, rouge #E10600, Geist/Geist Mono, radius 0,
   pas de dégradés) — elle NE SUIT PAS `docs/design-system/` ni BRAND.md
   (l'alignement Brand OS §48 est un chantier ouvert).
2. **Phase 0** : audit de l'existant (`AUDIT.md`) — SEO quasi nul (2 URLs
   indexées, 0 backlink) → refonte greenfield, 301 = hygiène. Validé par Paul.
3. **Hotfix leads** (avant la refonte) : le webhook n8n de capture était mort ;
   réparé bout-en-bout (n8n srv1857989 → Supabase RPC `ingerer_lead_site`), PR #205.
4. **Construction** en 7 lots (Codex code, Claude relit/commit/vérifie), branche
   longue `rebuild/rev01`, CI sur PR draft #208 (fermée depuis).
5. **GO Paul reçu → cutover** : merge `fd6f112`. parrit.ai sert le REV 01.
6. **Corrections post-launch le soir même** (ordres Paul successifs) :
   - Lien Cal réel = **`paul-larmaraud/30min`** (l'event du brief n'existait pas) ;
     copy « 45 min » → « 30 min » (78d6559).
   - **Un seul lien de booking sur tout le site** (celui de Paul) ; les
     constantes coaching (liens séparés Paul/Maxime, nom d'offre, prix) supprimées.
   - **PIVOT : « site institutionnel, pas avec Paul et Maxime »** (dc55e5e) —
     section « The operators » retirée de la home ; `/paul` et `/maxime` en
     noindex+nofollow, hors sitemap, plus aucun lien entrant. Les pages
     EXISTENT ENCORE par URL directe ; leur suppression définitive n'est pas
     tranchée. NB : le brief initial validé les incluait (funnel coaching) —
     c'est un pivot du soir, pas une dérive d'exécution.
   - Favicon : `src/app/icon.svg` servait l'ANCIEN perroquet (et prime sur
     tout) ; remplacé par le monogramme [P.] REV 03.

## Architecture actuelle (main)

- **Routes REV 01** (hors i18n, groupe `src/app/(rev01)/`) : `/` (home
  institutionnelle : hero, instrument, loop, commissioning, lien /journal),
  `/standard`, `/commission` (embed Cal inline 30 min), `/legal`,
  `/journal` (+ 20 entrées MDX dans `content/journal/`, RSS, OG images),
  `/paul` + `/maxime` (cachées, noindex), `/dossiers` (vide, noindex),
  `/system` (page de vérification interne, noindex).
- **Système** : `src/system/` (tokens.css, composants Frame/Hold/K/RegistryLine/
  CalInline/PersonalPage/RevHeader…), `site.config.ts` à la racine
  (`CAL_LINK_COMMISSION` = seul lien de booking).
- **⚠️ Piège n°1 du repo** : toute route hors i18n doit être ajoutée dans
  `src/proxy.ts` À DEUX ENDROITS (matcher + early-return), sinon 404 via
  redirect /fr/<route>.
- **L'ancien site** (arbre `[lang]` : /fr, /en, /pt-BR, /zh-CN) est TOUJOURS
  dans le code et toujours servi sur ses URLs — volontaire, pour éviter une
  vague de 404. Sa purge est un lot post-launch à venir.
- 80 redirects 301 legacy blog/glossaire/actualite → `/journal/<slug>` dans
  `next.config.ts`.
- **CI** : lint+build + gate réseau Playwright (deny-all, règle gravée dans
  AGENTS.md après l'incident du 14/08 : un mock divergent a envoyé des POST
  réels en prod) + gate de conformité marque (`npm run qa:brand:rev01`).
- Déploiement : push `main` → Vercel (décision Paul : on reste chez Vercel).

## Décisions Paul verrouillées à connaître

- 100 % anglais, un seul domaine, pas d'i18n sur le REV 01.
- La home ne mentionne JAMAIS le coaching. Aucun prix affiché.
- Dossiers/cas clients fictifs (SILVANI, NORTHSTAR, Müller, Meridian) :
  JAMAIS en prod (vérifié par grep sur le build à chaque étape).
- Blog survit sous `/journal` (« We Find The Way ») ; glossaire fondu dedans
  (9 entrées = traductions machine à relire éditorialement).
- DNS (SPF/DMARC/www) : reporté « temps 2 » par Paul.

## Chantiers ouverts (aucun n'est bloquant)

1. Sort final de `/paul` et `/maxime` (supprimer ou garder cachées) — à Paul.
2. Purge de l'arbre legacy `[lang]` + son retrait du sitemap (l'archive existe).
3. Alignement Brand OS / AGENTS.md sur la DA REV 02 (§48) — AGENTS.md prescrit
   encore l'ancienne DA (#FFFDFA/#D1132F/Arpona) qui n'est PLUS celle du site
   public : ne pas « corriger » le REV 01 vers l'ancien canon.
4. Relecture des 9 traductions glossaire.
5. Funnel « prototypes personnalisés » (spec séparée post-launch, en mémoire).
6. DNS temps 2 · extinction srv1115145 au 31/08 (chantier distinct).

## Si tu veux modifier le site

La loi visuelle est `docs/site-prod-rev01/parrit-codes-rev02.html`. La méthode
du chantier : spec dans `docs/site-prod-rev01/lots/` → Codex code → review →
build réel + `next start` + curl avant tout push. Les gates CI attraperont les
écarts de marque et les fuites réseau, mais pas les écarts de fond.
