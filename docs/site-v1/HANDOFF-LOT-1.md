# Handoff Codex — site V1, lot 1 (26/10/2026)

Writer : Codex · Superviseur : Claude · Décideur : Paul. **Aucune fusion ni mise en ligne sans validation explicite de Paul.**

## Lire avant d'écrire
1. `docs/site-v1/PARRIT_SITE_SPEC_V1_2026-10-26.md` (spec de Paul, référence).
2. `docs/site-v1/ETAPE-1-PLAN.md` : **périmètre exact du lot 1 et textes exacts à reprendre mot pour mot** (sections 2 à 6). Les textes anglais sont à traduire fidèlement, même registre, sans ajout.
3. `docs/site-v1/NOTE-CADRAGE.md` et `docs/site-v1/releves/` (audit du dépôt : routes, tests, tokens ; registre des preuves).
4. `AGENTS.md`, `TRUTH.md`.

## À faire
1. **Navigation** (`RevHeader` et version mobile) : section 3 du plan. Barre toujours dans le flux du document (pas `position: fixed`) ; sur mobile, menu accordéon à un niveau, bouton « Parler d'un projet » accessible sans couvrir le contenu.
2. **Accueil** FR et EN : ordre et textes de la section 4 (H01 à H07, H11, H12). Les références H02 lisent `src/system/public-clients.ts` et une table de libellés « ce qui a été fait » tirée du plan ; aucun logo. Le module H06 est un composant à onglets accessible (rôles ARIA tablist/tab/tabpanel, flèches clavier, focus visible, fonctionne sans JavaScript en affichant les trois panneaux).
3. **Quatre pages** FR et EN : `/fr/conseil-transformation` ↔ `/consulting-transformation`, `/fr/ai-sprints` ↔ `/ai-sprints`, `/fr/engineering-integration` ↔ `/engineering-integration`, `/fr/harness-engineering` ↔ `/harness-engineering`, selon la section 5. Ajout dans `TRANSLATED_PATHS`, le matcher de `src/proxy.ts`, `src/app/sitemap.ts`, `scripts/generate-llms.mjs`, avec hreflang ; titres et descriptions uniques ; au moins 7 liens internes par page comme l'exige le test existant.
4. **Redirection** `/contact` et `/fr/contact` → `/commission` et `/fr/commission` en 301 dans `next.config.ts`.
5. **Retrait de Content Factory** : section « six capacités » de l'accueil, `llms.txt` (générateur), JSON-LD, métadonnées, et la capacité 6 de `TRUTH.md`. Aligner aussi `AGENTS.md` (navigation, CTA, positionnement du 26/10) sur le nouvel état.
6. **Registre de preuves** : brancher `src/lib/registry/preuves.ts` (ou l'étendre aux champs de la spec §6) de sorte qu'un élément dont `permission_status` n'est pas `granted` ne soit jamais rendu. Le contenu du lot 1 n'utilise que des éléments autorisés.
7. **Composants** dans `src/system/` avec les tokens existants : `CaseStudyCard` (avec statut écrit en clair), `IntegrationBuildSwitcher`, `Capabilities` si utile, `EvidenceBadge` (statut interne, non visible par défaut). Aucune nouvelle couleur, police, ombre, dégradé ni radius.
8. **Tests** : remplacer les assertions qui figent l'ancien état (navigation à 2 liens, six cartes, ordre des sections, H1 « Systèmes intelligents… », libellé « Réserver l'examen ») par des assertions de fond : destination `/commission` des boutons, nombre d'entrées de navigation, présence des trois portes et de Harness, accessibilité clavier du module H06, absence de Content Factory, géométrie et contraste existants. Ajouter les tests de preuve de la spec §11 étape 3 : aucun `img`/`svg` de logo client, aucune attribution institutionnelle au MIT (« MIT License » exclu), aucune mention de certification Qualiopi attribuée à Parrit.ai, aucun chiffre de résultat, aucun tiret cadratin ou demi-cadratin dans le texte rendu.
9. **Captures** Playwright de l'accueil et des quatre pages, FR et EN, à 360, 390, 768, 1024 et 1440 px, dans `docs/site-v1/captures/` (le pont ne lance pas Chromium : laisser le script prêt, Claude le relance sur l'hôte).

## Interdits
- Ne pas modifier `src/system/brand-os.tokens.css`, les polices, `public-clients.ts`, `/legal`, `/build-with-you`, `/commission` (hors libellés de bouton qui y mènent), ni le Journal.
- Aucun prix, aucun délai promis, aucun nom de personne hors `/legal`, aucun logo, aucune mention de FORMIA, Qualiopi, MIT ou de chercheurs (lot 2).
- Ne pas affaiblir les tests de réseau (deny-all), de marque, d'accessibilité ou de géométrie.
- Aucun appel réseau dans les tests, aucun déploiement, aucune fusion.

## Contrôles (5, voir NOTE-CADRAGE)
1. Batterie `npm ci --silent && npm run lint && npm test && npm run build` verte ; Claude relance `qa:brand:rev01`, `test:brand-os` et `qa:network:rev01` sur l'hôte.
2. Tests de preuve verts.
3. Captures aux cinq largeurs, clavier, contraste, mouvement réduit.
4. Revue Claude du diff et des textes contre `ETAPE-1-PLAN.md`.
5. Validation de Paul sur l'aperçu Vercel avant toute fusion.
