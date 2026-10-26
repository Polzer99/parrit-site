# Audit du dépôt parrit.ai (refonte site V1) — 26/10/2026

Dépôt audité : `/Users/paullarmaraud/codex-work/wt-site-v1` (HEAD `2115aab`, merge PR #322 « six capacités »). Lecture seule, aucun fichier du dépôt touché. `node_modules` absent du worktree : aucun test n'a été exécuté, les assertions ci-dessous sont lues dans le code (constaté), pas rejouées.
Convention : « constaté » = lu dans un fichier ou observé en ligne ; « déduit » = conclusion tirée, non vérifiée par exécution.
Chemins relatifs à la racine du dépôt, sauf mention.

---

## 1. Carte des routes actuelles

### 1.1 Mécanisme de langue (constaté)
- `src/system/locale.ts:1` : `LOCALES = ["fr","en"]`. **URL nue = anglais, `/fr/*` = français** (une langue = une URL). Le français est servi par un *rewrite* du proxy vers la même page, avec header `x-parrit-locale`.
- `src/system/locale.ts:10-12` `TRANSLATED_PATHS` : seules ces routes existent en FR : `/`, `/build-with-you`, `/systems`, `/manufacture`, `/standard`, `/dossiers`, `/commission`, `/journal`, `/legal`. Toute autre route `/fr/x` est redirigée en 301 vers `/x` (`src/proxy.ts:34-39`).
- `src/proxy.ts` : négociation `Accept-Language` en **302** vers `/fr/...` (hors bots, hors cookie `parrit_locale`) ; `?lang=` legacy en 301 ; matcher explicite `src/proxy.ts:73-76` (une nouvelle route doit y être ajoutée).
- hreflang / canonical : `localizedAlternates()` `src/system/locale.ts:60-70` (en + fr + x-default = anglais nu ; fr seulement si la route est dans `TRANSLATED_PATHS`) ; `localizedOpenGraph()` `:72-78`. Chaque page appelle ces fonctions dans son `generateMetadata`.
- Sitemap : `src/app/sitemap.ts:8-17` (`REV01_PUBLIC_ROUTES`, liste écrite à la main, EN+FR avec alternates) + Journal (`:32-48`, articles EN seulement). `src/app/robots.ts` (sitemap, bots IA autorisés, disallow `/os`, `/api`, `/_next`). Texte machine : `scripts/generate-llms.mjs` (prebuild, écrit `public/llms.txt`) et `src/app/llms-full.txt/route.ts`.
- Observé en ligne : `https://parrit.ai/fr` : canonical `/fr`, hreflang `fr=/fr`, `en=/`, `x-default=/`.

### 1.2 Pages existantes (constaté)
| URL EN / FR | Fichier | Nature |
|---|---|---|
| `/` · `/fr` | `src/app/(rev01)/page.tsx` (337 l.) | Home « Nous transformons des problèmes opérationnels en systèmes qui fonctionnent », agent esquisse, 5 clients publics, six capacités |
| `/systems` · `/fr/systems` | `.../systems/page.tsx` (314 l.) | « Nous montrons le système. Vous jugez avant de vous engager » : registre des sources de vérité, 4 cartes, FAQ |
| `/manufacture` · `/fr/manufacture` | `.../manufacture/page.tsx` | Méthode en 3 phases (Examen, Construction, Capitalisation) |
| `/standard` · `/fr/standard` | `.../standard/page.tsx` | Six engagements (contrôle interne, « pas une accréditation ») |
| `/dossiers` · `/fr/dossiers` | `.../dossiers/page.tsx` | 3 dossiers anonymisés (références) |
| `/commission` · `/fr/commission` | `.../commission/page.tsx` | Réservation Cal.com + capture e-mail ; **seul lien de booking** |
| `/build-with-you` · `/fr/build-with-you` | `.../build-with-you/page.tsx` | « Avec Parrit.ai, vous construisez un système qui tourne » (accompagnement hands-on) ; lien footer uniquement |
| `/journal` + `/journal/[slug]` | `.../journal/page.tsx`, `[slug]/page.tsx` | Index traduit ; 40 articles MDX anglais (alias `/fr/journal/<slug>` avec bandeau de langue) |
| `/journal/rss.xml` | `.../journal/rss.xml/route.ts` | Flux |
| `/legal` · `/fr/legal` | `.../legal/page.tsx` | Mentions légales + confidentialité |
| `/sketch/[id]` | `.../sketch/[id]/page.tsx` | Esquisse privée, `noindex`, `force-dynamic` |
| `/api/interet`, `/api/interet/projection` | `src/app/api/interet/*` | Capture lead (POST) |
| `/opengraph-image`, `/journal/[slug]/og` | `src/app/opengraph-image.tsx` | Cartes OG |
| 404 | `src/app/not-found.tsx` | 404 bilingue |

### 1.3 Redirections existantes (`next.config.ts`)
- `:92-94` : `/camp-costa-rica/:path*`, `/paul`, `/maxime` vers `/` (`permanent: true`, donc 308 en pratique ; observé en ligne : `/paul` donne 308).
- `:49-60` + `:96-110` : anciens chemins `blog/`, `actualite/`, `glossaire/` vers `/journal/<slug>` en 301 ; renommages de slugs Journal ; `/architecture-claude-md` et `/demarrer-claude-code` vers `/journal`.
- `:112-120` : `/:lang(en|pt-BR|zh-CN)` et `/:lang(en|pt-BR|zh-CN)/:path*` vers `/` (301).
- Aucune redirection pour `/systems`, `/manufacture`, etc.

### 1.4 Pages MVP de la spec vs existant
Observé en ligne le 26/10 : les 8 URLs `/conseil-transformation`, `/ai-sprints`, `/engineering-integration`, `/harness-engineering`, `/realisations`, `/partenaires`, `/ecosysteme`, `/contact` répondent **404**. `/fr/realisations` donne 301 vers `/realisations` (404) : effet du proxy. Aucune de ces pages n'existe dans le code.

| Page MVP spec | Existant le plus proche | Remplace / redirections à prévoir (déduit) |
|---|---|---|
| `/` | `/` | Remplace la home (même URL, pas de 301) |
| `/conseil-transformation` | `/manufacture` (méthode) et partiellement `/systems` | Nouvelle page ; décider si `/manufacture` est conservée ou redirigée (301 vers `/conseil-transformation` ou `/engineering-integration`) |
| `/ai-sprints` | `/build-with-you` (accompagnement court) | Nouvelle ; `/build-with-you` pourrait y être redirigée en 301 (lien footer et 3 tests dépendent d'elle, voir §6) |
| `/engineering-integration` | `/systems` (système maison + capacités) | Nouvelle ; `/systems` conservée comme preuve ou redirigée |
| `/harness-engineering` | aucun | Nouvelle (« Harness Badge » du Journal, `src/system/components/HarnessBadge.tsx`, n'est pas une offre) |
| `/realisations`, `/realisations/[slug]` | `/dossiers` (3 dossiers anonymisés) | `/dossiers` vers `/realisations` en 301 si fusion ; la contrainte « clients publiables » (§6) s'applique |
| `/partenaires` | aucun | Nouvelle |
| `/ecosysteme` | note FormIA sur la home (`page.tsx:40,121`) | Nouvelle |
| `/contact` | `/commission` | 301 `/commission` vers `/contact` si renommage ; **~15 assertions pinnent `/commission`** (§6) ; ajouter les entrées `TRANSLATED_PATHS`, `proxy.ts` matcher, `sitemap.ts` |
| (non spécifiées) `/standard`, `/legal`, `/journal`, `/sketch` | — | À conserver ; `/legal` obligatoire |

Écart de doctrine à noter : la spec dit « FR primaire » ; le code est EN par défaut sur l'URL nue, avec bascule FR par 302 de négociation.

---

## 2. Home actuelle, header, footer

### 2.1 Ordre des sections de `src/app/(rev01)/page.tsx` (constaté)
| # | Classe de section | Lignes | Contenu |
|---|---|---|---|
| 1 | `home-s-hero r2-dark` | 202-215 | Kicker, **H1** (« Nous transformons… systèmes qui fonctionnent. »), sous-titre, `AgentEsquisse`, CTA ghost « Réserver l'examen » |
| 2 | `home-s-brands` | 217-227 | « Ils nous ont confié un sujet » : 5 clients en texte (Laparra, Clevery Avocats, Forexpert, Joone, SNCF), aucun logo |
| 3 | `home-s-parcours` | 229-243 | PME/ETI vs grands groupes ; note FormIA |
| 4 | `home-s-maison` | 245-259 | Déroulement en 4 étapes + CTA unique vers `/commission` |
| 5 | `home-s-capacites#capacites` | 261-275 | **Six capacités** (6 H3, aucun lien) |
| 6 | `home-s-build r2-dark` | 277-296 | `ProductScene` (carte de visite vers fiche CRM) |
| 7 | `home-s-proof` | 298-314 | Cartes vers `/systems` et `/dossiers` |
| 8 | `home-s-journal` | 316-325 | 3 derniers articles |
| 9 | `home-s-close r2-dark` | 327-333 | CTA final `rev-button exec` |

Textes (constaté) : DICT `en` lignes 13-93, `fr` lignes 94-174 ; métadonnées `generateMetadata` 177-193 ; titre « Parrit.ai · Systèmes intelligents pour les opérations ».
`layout.tsx` du groupe (`src/app/(rev01)/layout.tsx`) : meta par défaut (titre template `%s · Parrit.ai`, description « connects your sources… », `:38-43`, **ancien libellé, probablement divergent** : déduit), JSON-LD Organization (`:17,60`), préchargement 4 polices (`:56-59`), `AnalyticsInit` / `RevHeader` / `RevFooter`.

### 2.2 Header `src/system/components/RevHeader.tsx` (constaté)
- Barre `cmdbar` 64 px, **dans le flux** (pas `position: fixed`), alignée sur la colonne 1160 px.
- Contenu : wordmark `PARRIT.AI` (lien `/`), nav `NAV` `RevHeader.tsx:9-18` = **2 liens** (Journal, Systèmes/Systems), bascule de langue FR/EN (boutons, cookie), CTA `HeaderBookingAction` `:24-44` « Réserver l'examen » / « Book the examination » vers `/commission` (outline « ghost » sur le hero de la home, « exec » quand le hero sort du viewport via IntersectionObserver), bouton Menu mobile + panneau `cmd-panel` `:164-188` (mêmes liens + CTA).
- Aucun menu déroulant, aucun accordéon.

### 2.3 Footer `src/system/components/RevFooter.tsx:5-28` (constaté)
7 liens : La Manufacture, Le Standard, Les Dossiers, Le Journal, Commande, « Construire un premier système avec nous » (`/build-with-you`, lien secondaire seulement ici), Mentions légales ; ligne `© 2026 Parrit.ai`. Aucune mention de partenaire, certification, réseau social.

---

## 3. « Content Factory » / usine de contenu (constaté, grep sur tout le dépôt hors `docs/site-v1`, `archive`, `artifacts`)

**Pages publiques / navigation**
- `src/app/(rev01)/page.tsx:51` EN : `["Content Factories", "Producing, checking and publishing, with controls before every release."]`
- `src/app/(rev01)/page.tsx:132` FR : `["Usines de contenu", "Produire, vérifier et publier, avec des contrôles avant chaque diffusion."]`
- Rendu live confirmé sur `https://parrit.ai/fr` (capture 1440 : sixième carte « Usines de contenu »).
- Navigation / footer / header : **aucune occurrence**.

**Doctrine (pas rendu sur le site mais injecté dans les tests/agents)**
- `TRUTH.md:28` : ligne 6 du tableau « Six capacités » = « Content Factories ». TRUTH.md est vérifié par `scripts/false-claims-check.mjs` (`EXTRA_FILES`, `:8`) mais pas pour ce mot.
- `docs/handoffs/2026-10-26-alignement-positionnement-six-capacites.md:38,50` (spec Codex de la PR #322, source des libellés).

**Absent (constaté)** : `scripts/generate-llms.mjs` / `public/llms.txt` (aucune liste de capacités), `src/system/jsonld.ts` (Organization : description seule, pas de `makesOffer`), métadonnées de pages, contenus `content/journal/*.mdx`, `src/app/opengraph-image.tsx`.

**Hors site mais mentionnant le terme (non publics)** : `scripts/publish-journal.mjs:2,188-191` (« registre Content Factory », outil interne de publication du Journal), `scripts/propose-journal.mjs:2`, `docs/CODEX-SPEC-2026-08-29-moteur-journal-autonome.md`, docs `sales/*` et `conversational-site/*`.

**Impact tests si retrait** : la carte 6 est comptée par `tests/six-capacites.test.mjs:43` (`items.length === 6`) et `:63` (`h3 === 6`) et `tests/six-capacites.spec.ts` (6 H3, ordre des sections). Retirer la capacité ou remplacer la section oblige à modifier ces tests (NOTE-CADRAGE dit que la spec remplace la section « six capacités » fusionnée le 26/10).

---

## 4. Tokens de design

### 4.1 Couleurs (constaté)
Source : `src/system/brand-os.tokens.css` (GÉNÉRÉ, « NE PAS ÉDITER », Brand OS 0.1.0-candidate, `brand-os.origin.json` : commit parrit-canon `112de90e`, mode accessible seul). Adaptation du site : `src/system/tokens.css` (alias `var(--brand-*)`, aucune valeur de palette recopiée). Tout hex en dehors du fichier vendorisé est un défaut (`scripts/brand-conformity-check.mjs`).

Valeurs vendorisées (`brand-os.tokens.css:4-20`) :
| Token canon | Hex | Rôle / alias site (`tokens.css`) | Où utilisé |
|---|---|---|---|
| `--brand-core-canard` | `#006F8A` | `--accent-strong/-text/-border`, `--action-fill`, `--crit-dot`, régime « canard » | texte d'accent sur fond clair, numéros d'étape (`tests/design-harmonisation.spec.ts:49`), focus |
| `--brand-core-rose` | `#F08E85` | `--accent-on-dark`, `--accent-dark-border` | accent sur fond sombre, cadre du H1 (`.frame`), bouton esquisse, marqueurs de scène ; 3 usages directs dans `rev01.css`, 12 via `--accent-on-dark` |
| `--brand-core-off` | `#F7F9F8` | `--paper` | fond clair (49 usages `rev01.css`) et texte sur fond sombre |
| `--brand-accessible-ink` | `#06262E` | `--ink`, `--carbon`, `--body-l` | fond sombre des sections `r2-dark` (`rev01.css:1467-1470`) et texte courant sur clair |
| `--brand-accessible-ink2` | `#496167` | `--g2`, `--g3`, `--g4`, `--label-d` | texte secondaire |
| `--brand-accessible-sky` | `#DBE9E1` | `--accent-soft`, `--accent-surface`, sélection | sélection de texte |
| `--brand-accessible-warm` | `#FADDDA` | non alias dans `tokens.css` | déduit : défini, usage non trouvé |
| `--brand-accessible-line` | `#798A8E` | non alias | idem |
| `--brand-derived-white` | `#FFFFFF` | `--paper2` | 10 usages `rev01.css` |
| `--brand-derived-on-ink-2` | `#A9C2C7` | `--g4-d` | libellés sur sombre (`.r2-dark .k`, `rev01.css:1473-1475`) |
| `--brand-derived-on-ink-line` | `#7FA0A7` | `--rule-d` | filets sur sombre (54 usages `rev01.css`) |
| `--brand-derived-aux-1` | `#B8CDD1` | `--rule-l` | filets sur clair (43 usages) |
| `--brand-derived-aux-3` | `#062A30` | `--carbon2`, `--steel`, `--accent-dark-surface` | surfaces sombres |
| `--brand-derived-on-canard-2` `-on-rose-2` `-aqua-dots` `-aux-2` | `#D5EAEF` `#3D2320` `#5C948D` `#95BEB9` | pas d'alias dans `tokens.css` | déduit : régimes canard/rose, usage non trouvé sur le site |

Régimes (`brand-os.tokens.css:31-34`) : `calm` (fond `#F7F9F8`), `canard` (`#006F8A`), `ink` (`#06262E`), `rose` (`#F08E85`). Le site n'emploie visiblement que clair (`paper`) et sombre (`ink`) (déduit des classes `r2-dark` / `home-s-*`).
Espacements : `--brand-s1..s8` = 8/16/24/32/48/64 px ; `tokens.css:61-67` `--s1..s8` identiques. Mouvement : `--ease`, `--micro 120ms`, `--move 240ms`, `--seq 400ms`, `--hold 600ms` (`tokens.css:69-74`).
Règles de forme : radius 0 sauf maquette téléphone, zéro dégradé, zéro ombre (vérifié par `qa:brand:rev01`, `scripts/brand-conformity-check.mjs:219-236`, et par `tests/conformity-home.spec.ts:112-138`).
**Ancienne palette** (noir/blanc/encre/sceau rouge) : seulement `design-source/` et `src/app/camp-costa-rica` (`AGENTS.md`) ; ne pas réintroduire.

### 4.2 Polices (constaté)
- `src/system/fonts.css:3-44` : General Sans 400/500/600 (`/public/fonts/rev02/GeneralSans-{Regular,Medium,Semibold}.woff2`) ; IBM Plex Mono 400/500/600 (`/public/fonts/rev03/ibm-plex-mono-latin-{400,500,600}-normal.woff2`) ; `font-display: swap`. Préchargées dans `layout.tsx:56-59` (Regular, Medium, Mono 400, Mono 500). SHA256 attendus dans `brand-os.origin.json` `canon_fonts`, vérifiés par `tests/brand-os-contracts.test.mjs`.
- Tokens : `--ui` = General Sans (+ Helvetica Neue, Arial), `--mono` = IBM Plex Mono, `--ed` = `--ui` (`tokens.css:43-45`). Usage dans `rev01.css` : `var(--mono)` ×31 (kickers, libellés, nav, bascule de langue, numéros), `var(--ui)` ×11, `var(--ed)` ×3.
- Polices OG (Satori) : `src/og-assets/`.

### 4.3 Échelle typographique (constaté, `src/system/tokens.css:47-90`, `src/app/(rev01)/rev01.css`)
| Rôle | Desktop | Mobile (≤ 760 px) | Source |
|---|---|---|---|
| **H1 home** (`.home-s-hero h1`) | **84 px** (`--d-xl`), poids 400, interligne .98, `letter-spacing -.045em` | **40 px** (`--d-xl`, mesuré en ligne à 390 px) ; une règle `@media (max-width: 859px)` (`rev01.css:2220,2230-2232`) applique `--d-l` au H1 de la home : effet sur 761-859 px non mesuré (déduit : 54 px) | `rev01.css:1773-1782`, `tokens.css:59,84-89` |
| H1 pages intérieures | `--d-m` 54 px (`/commission`, `/standard`, journal) ; `--d-xl` 84 px (`/systems`, `r2-hero`, dossiers) ; `--d-l` 54 px (`legal`) | 34 px (`--d-m`) / 40 px | `rev01.css:371-374,669-671,700-702,808-811,985-988,1053-1056,1521-1529` |
| **H2 de section** | **40 px** (`--d-s`), poids 400, `-.035em`, interligne 1.04 | **32 px** | `rev01.css:1753-1759`, `tokens.css:56,86-89` |
| H2 de clôture (`.home-s-close h2`, `.r2-close h2`) | 54 px (`--d-l`) | 34 px | `rev01.css:2144-2148,2638-2643` |
| **H3 unique** | **22 px** (`--t-l`), poids 500 | 22 px | `rev01.css:3313` (`.rev-page h3`), `:3012-3016` |
| Corps / kickers / boutons | 16 px (`--t-s`, `--t-k`) ; 18 px (`--t-m`) pour certains liens ; boutons 16 px / 600 / hauteur ≥ 48 px / padding `14px 24px` (`tokens.css:78-83`) | idem | interligne corps ≥ 1.44 (`tests/audit-readability.spec.ts:56`) |
| Mesure | `max-width: 68ch` pour p/li/dd (`rev01.css:3300ish`), 56ch pour la colonne « déroulement » | | |
| `text-wrap` | `balance` sur h1-h3, `pretty` sur p (`rev01.css:2-10`) | | |
Grille : colonne `max-width: 1160px` ; marge gauche 180 px à 1440, 20 px à 375/390 (`tests/alignment-grid.spec.ts:14-24`, `tests/conformity-home.spec.ts:50`).

**Écart documentaire à signaler** : `AGENTS.md:56` et la consigne de la tâche disent « H1 88 px » ; le code et les tests disent **84 px** (`tests/design-harmonisation.spec.ts:93` attend exactement `84px` / `40px`, `tests/conformity-home.spec.ts:109-110` accepte 82-86). Capturé en ligne : `h1px = 84px` à 1440, `40px` à 390 (voir `capture-log-2026-10-26.json`).

---

## 5. Composants réutilisables (`src/system/components/`) vs composants de la spec

Existants, génériques : `K` (kicker mono), `St` (statut ok/att/crit/done), `Frame` (crochets d'accent du H1), `Instrument`, `RegistryLine`, `Seal`, `Hold` (geste maintenu), `DecisionCard`, `Dossier`, `SystemCard` (domaine / entrée / traitement / sortie / limites / preuve), `MechanismSchema`, `RegistrySnapshot` (lignes domaine / source / statut), `HarnessBadge` (certificat de contrôle d'un article Journal, `public/certificates/*.json`), `ProductScene` (+ `.css`), `AgentEsquisse`, `QuickCapture`, `ParritCalInline` (Cal.com), `RevHeader`, `RevFooter`, `Opening` (non rendu depuis 06/09), `SketchBoot`, `AnalyticsInit`. Boutons : classes `.rev-button` / `.exec` / `.ghost` dans le CSS, pas de composant.

| Composant de la spec | État (constaté / déduit) |
|---|---|
| `LogoWall` | **Absent**. La home affiche 5 clients en texte (`page.tsx:217-227`), et les tests interdisent `a, button, img, svg` dans cette section (`tests/conformity-home.spec.ts:74`, `tests/brand-os-render.test.mjs:159`). Aucun asset de logo client dans `public/`. |
| `Capabilities` | **Partiel** : section `home-s-capacites` en dur dans `page.tsx:261-275` (6 cartes titre + texte, sans lien, test `six-capacites.spec.ts:21`), pas de composant. |
| `CaseStudyCard` | **Absent** ; plus proche : `Dossier.tsx` (116 l.) et `SystemCard.tsx` (28 l.). |
| `EvidenceBadge` | **Absent** comme composant ; mais un **registre de preuves** existe, mort : `src/lib/registry/preuves.ts` (264 l., huit natures de preuve, champ `publicationPermission`, règle « preuve nominative exige permission »), avec `cta.ts`, `ciblage.ts`, `ressources.ts`, `validate.ts`. Aucun import depuis `src/app` ni `src/system` (déduit : code non branché). Très proche du « registre éditorial structuré » du §6 de la spec ; champs à étendre (relationship_type, permission_owner, expiration_or_review_date, last_verified, page_ids absents ? non vérifié ligne à ligne). |
| `TechnologyRegistry` | **Absent**. |
| `ScientificPartnerCard` | **Absent** (aucune notion de chercheur/partenaire dans `src`). |
| `IntegrationBuildSwitcher` | **Absent** (aucun composant interactif à états ; `Hold` et `QuickCapture` sont les seuls client components interactifs avec `AgentEsquisse`). |
| `CTA` | **Partiel** : pas de composant ; liens `<Link className="rev-button …">` répétés (`page.tsx:213,256,331`, `RevHeader.tsx:40,184`). `src/lib/registry/cta.ts` (229 l.) définit un registre de CTA (une seule priorité « principale » par page), non branché. |

Autres : `src/lib/pillars.ts` (114 l., ancien contenu de piliers, non importé : déduit mort).

---

## 6. Tests qui contraignent ou casseraient la refonte

Lancement : `package.json` scripts `qa:network:rev01` (18 specs Playwright, port 3210, deny-all réseau `tests/network-deny.setup.ts`), `test:brand-os`, `test` (`node --test tests/*.test.mjs`), `qa:brand:rev01`, `qa:claims:rev01`. Règle AGENTS.md:130 / NOTE-CADRAGE : « les tests contrôlent les règles de fond, pas les libellés », mais beaucoup d'assertions actuelles pinnent des structures et des URLs.

### 6.1 Navigation (header)
- `tests/conformity-home.spec.ts:161-175` : `.cmd-nav a` doit compter exactement **2** (`:173`) ; une seule ligne de base.
- `tests/conformity-i18n.spec.ts:185-191` : `.cmd-nav a[href="<prefix>/systems"]` compte 1 sur la home.
- `tests/conformity-home.spec.ts:181-192` : `.cmdbar` hauteur **64 px**, `position` pas `fixed` sur `/`, `/standard`, `/commission`, `/journal`.
- `tests/design-harmonisation.spec.ts:88-141` : bascule de langue (`role=group` « Langue »/« Language », boutons ≥ 44 × 48 px, IBM Plex Mono, mêmes taille/espacement que `.cmd-nav a`) ; `:127-128` bouton `.cmd-menu-toggle` sur mobile.
- `tests/audit-readability.spec.ts:17-43` : bouton Menu + `.cmd-panel-cta` (padding `14px 24px`, 16 px, hauteur ≥ 48 px), CTA header `.cmd-cta` (couleurs par token, fond transparent) ; `:66` cibles de nav/footer/bascule ≥ 44 px.
- `tests/doctrine-visible.spec.ts:16-34, 159-247` : `.cmd-cta` a la classe `ghost` (JS désactivé, build-with-you), puis `exec` seulement après la sortie du hero sur la home (`:228-244`) ; `.wordmark` ramène au hero ; `.home-s-proof-item[href$="/systems"]` existe.
- `tests/brand-os.spec.ts:296-297, 298-311` : 404 avec `.cmdbar`, `footer`, actions `.not-found-actions` vers `/`, `/fr`, `/journal`.
- `AGENTS.md:55-59` documente la barre à 2 liens + « Réserver l'examen » ; NOTE-CADRAGE annonce l'adaptation (spec = 5 entrées + « Parler d'un projet »).

### 6.2 Libellé et destination du CTA
- Libellé : aucun test ne pinne « Réserver l'examen » en dur (peuplé seulement : `expectPopulated`). `tests/doctrine-visible.test.mjs:41` exige un lien `rev-button exec` unique sur la page esquisse privée.
- **Destination `/commission` pinnée partout** : `tests/doctrine-visible.spec.ts:40-44` (tout `a.rev-button[href$="/commission"]` sur 9 routes × 2 langues), `:56`, `:77`, `:93`, `:254-256`, `:267` ; `tests/audit-readability.spec.ts:78` ; `tests/conformity-home.spec.ts:206` ; `tests/six-capacites.spec.ts:19` ; `tests/six-capacites.test.mjs:74-76` ; `tests/systems.spec.ts:71,76` ; `tests/conformity-i18n.spec.ts:137` (`.cmd-cta[href="/fr/commission"]`) ; `tests/doctrine-visible.test.mjs:43`. Renommer `/commission` en `/contact` : tous à adapter ; sinon garder `/commission` comme route et faire de `/contact` un alias 301.
- `tests/cal-link.test.mjs:7-25` : `CAL_LINK_COMMISSION` doit valoir `paul-larmaraud/audit` ; le lien legacy `paul-larmaraud/30min` est interdit dans `src/`.
- `tests/doctrine-visible.spec.ts:62-81` : après capture e-mail réussie, lien de réservation `.quick-capture a[href$="/commission"]`.
- `tests/conformity-commission.spec.ts:19-26` : H1 de `/commission` entre 50 et 54 px ; instrument `.cal-instrument` visible ; **`tests/conformity-commission.spec.ts:21-` pas d'ombre ni de radius**.

### 6.3 Taille H1 (84 px, pas 88)
- `tests/design-harmonisation.spec.ts:92-93` : `.home-s-hero h1` poids 400 et **84 px (> 760 px) / 40 px (≤ 760 px)**, exact.
- `tests/conformity-home.spec.ts:105-110` : H1 de `/` entre 82 et 86 px.
- `tests/conformity-standard.spec.ts:17-23` et `tests/conformity-commission.spec.ts:19-26` : H1 50-54 px.
- `tests/audit-readability.spec.ts:67-68` : H1 ≥ 32 px ; **un seul** `font-size` distinct pour tous les `main h3` visibles (≤ 1).
- `tests/design-harmonisation.spec.ts:56-86, 227-236` : H2 de section 40 px (32 px ≤ 760) sur `.home-s-maison h2, .product-scene-copy h2, .home-s-journal h2`, 22 px pour les H2 d'index Journal, 54/34 px pour les H2 de clôture ; frontière exacte à 760/761 px (`:228-236`).
- `tests/brand-os.spec.ts:149-275` : H1 de la home avec `.frame` (`display:inline-block`, `white-space: nowrap` > 760 px) et `.home-s-hero-ending` : géométrie du cadre rose autour du dernier segment. **Un nouveau H1 (« Transformez votre entreprise. Pas simplement vos outils. ») doit conserver `.frame` / `.home-s-hero-ending`, ou ces tests changent.**
- `tests/doctrine-visible.spec.ts:143-145` et `tests/design-harmonisation.spec.ts:155`: H3 des cartes 22 px.

### 6.4 Ordre et structure des sections de la home
- `tests/six-capacites.spec.ts:17` : sélecteur de frères adjacents `.home-s-brands + .home-s-parcours + .home-s-maison + .home-s-capacites + .home-s-build + .home-s-proof + .home-s-journal + .home-s-close` doit exister exactement 1 fois. Idem rendu serveur `tests/six-capacites.test.mjs:52-66`.
- `tests/conformity-home.spec.ts:30-32` : `.home-s-parcours` entre `.home-s-brands` et `.home-s-maison` ; `:277-282` : `.home-s-brands` suit directement `.home-s-hero` (écart ≤ 1 px).
- `tests/six-capacites.spec.ts:13-23` : `.home-s-capacites#capacites` : 6 H3, **aucun `a` ni `button`**, alignement des colonnes ; `main a[href=".../build-with-you"]` = 0 et lien footer visible (`:30-31`).
- `tests/brand-os-render.test.mjs:114-162` : section `home-s-build r2-dark` (scène produit : 4 messages, marqueurs 1/2/3 ×2, 2 images lazy, chat `lang="fr"`, heures 08:04/08:05), pas de Rungis/MIN/Lyon dans la scène (`:121`), parcours sans lien (`:149`), exactement 5 clients (`:154-158`).
- `tests/doctrine-visible.spec.ts:84-157` : `.home-s-maison-copy` : un seul `.k` enfant, aucune image/figure, un seul `rev-button ghost` vers `/commission`, paragraphes à 56ch, kickers en IBM Plex Mono, 3 articles Journal (`tests/conformity-home.spec.ts:153-159`), `hreflang="en"` sur chaque lien d'article, bandeau de langue FR.
- `tests/doctrine-visible.spec.ts:166-243` : espacement des accents roses ≥ 844 px entre deux éléments roses.
- `tests/aeration.spec.ts` (843 l.) et `tests/alignment-grid.spec.ts` (`routes` = `/`, `/systems`, `/journal`, `/standard`, `/commission`, `/manufacture`, `/build-with-you`, `/dossiers`, `/legal`, un article) : géométrie, marges (gauche 180 px à 1440, 20 px à 375), typographie ; **la liste des routes testées est figée**, supprimer une route casse ces suites.
- `tests/conformity-home.spec.ts:99-139` : **zéro ombre, zéro radius** sur toute la home (hors `[data-phone-mockup]`) ; `tests/design-harmonisation.spec.ts:136-139` idem sur `main`.
- Routes figées : `tests/brand-os.spec.ts:14`, `tests/brand-os-render.test.mjs:21`, `tests/anti-slop-copy.spec.ts:5`, `tests/doctrine-visible.spec.ts:35`, `tests/audit-readability.spec.ts:18`, `tests/conformity-i18n.spec.ts:10,177-179` (7 paires EN/FR attendues dans le sitemap). Les pages `/systems`, `/build-with-you`, `/manufacture`, `/dossiers`, `/standard`, `/commission`, `/legal`, `/journal` doivent **rester en 200** ou ces tests sont à réécrire.
- Contrôles globaux sur le sitemap : `tests/internal-linking.spec.ts:51-54` (**chaque URL du sitemap ≥ 7 liens internes uniques**), `:76-77` (≥ 40 URLs découvertes) ; `tests/metadata-integrity.spec.ts:89-92` (titre unique par URL, `og:image` en 200).
- Métadonnées : `tests/brand-os-render.test.mjs:65-67,83-90` (og:image/twitter:image `https://parrit.ai/opengraph-image` 1200×630 ; H1 unique non vide ; `description`/`og:*` uniques) ; `tests/conformity-i18n.spec.ts:66-85` (hreflang réciproque, canonical, `og:locale`, descriptions EN ≠ FR) ; `tests/conformity-i18n.spec.ts:50-63` (Googlebot reçoit l'anglais sur `/`).

### 6.5 Garde-fous anti-tarif et mots interdits
- `tests/anti-slop-copy.spec.ts:6` (`noOffer`) : interdit sur toutes les pages publiques (texte, aria/alt, meta, JSON-LD) : `offert|gratuit|free|forfait|fixed price|sur devis|custom quote|sans engagement|no commitment|pas un abonnement|not subscribed|10/15 min|30 min|à partir de (sauf « à partir de vos opérations »)|HT|excl. VAT`. Idem `tests/brand-os-render.test.mjs:77`, `tests/anti-slop-copy.test.mjs:12` (llms.txt).
- `tests/anti-slop-copy.spec.ts:7-12` : **tiret cadratin `—`/`–` interdit** ; `fictif/fictive/fictional/illustratif…` ; codes internes `REV 0n`, `PS-0n`, `STD-n.n`, `P0` ; motif « Pas X. Y. » (négation + phrase courte).
- `:32` : **aucun `€`** hors `/legal`. `:33` et `tests/brand-os-render.test.mjs:80-81` : **les mots `Paul`, `Larmaraud`, `fondateur/fondatrice`, `fondée par`, `founder`, `founded by`, `quinze minutes`, `fifteen minutes` et tout lien `paul-larmaraud.com` sont interdits sur toute page sauf `/legal`**. Contrainte forte pour `/partenaires` (chercheurs) et `/ecosysteme` (Formia « dirigée par notre fondateur » est interdit).
- `:36-38` : `.home-s-offers` et `#offre` absents, `.offer-price` absent.
- `scripts/false-claims-check.mjs` (`qa:claims:rev01`, `tests/public-clients.test.mjs:44-69`) : sur `src`, `scripts`, `content/journal`, `public/llms.txt`, `site.config.ts`, `TRUTH.md` : interdit notamment « verified live », « measured in client systems », « 20 engineers », « partner leads / associé construit », durée d'appel 30 min, et **toute phrase contenant `certified|certification|certifié` sans « not an accreditation / pas une accréditation »** (`scripts/lib/certification-claims.mjs:4-11`). **Toute mention de la certification Qualiopi sera bloquée par cette règle** tant que `certification-claims.mjs` n'est pas adapté (exception explicite et justifiée).
- `tests/privacy-corrections.test.mjs:108` : le mot `Qualiopi` (et `ATA 1926`, `certified to`, `depuis trois ans`…) est interdit dans `src/app/(rev01)/page.tsx`, `manufacture/page.tsx`, `scripts/generate-llms.mjs`, `public/llms.txt` et deux articles. `/ecosysteme` n'est pas visée mais la home et llms.txt le sont.
- `tests/brand-os-render.test.mjs:56` et `tests/audit-truth-copy.test.mjs:108` : ne pas réintroduire « maison de données » / « data and AI firm ».
- `tests/audit-truth-copy.test.mjs:97-114` : description canonique d'Organisation identique entre `src/system/jsonld.ts:10`, `scripts/generate-llms.mjs`, `public/llms.txt` ; `tests/six-capacites.test.mjs:90-95` (llms contient la description de l'Organisation, pas « maison »). Changer le positionnement impose de changer ces trois fichiers ensemble.
- Glyphes : `tests/brand-os-contracts.test.mjs:17` (aucun glyphe hors `brand-os.glyphs.json`, pas de flèche-caractère) ; `scripts/brand-os-contracts.mjs`.
- Assets interdits : `brand-os.forbidden-assets.json` (portraits `jardin-ref-2066`, `paul-ref-2066`, etc.) ; `tests/founder-photo.test.mjs:10-43` (seuls 4 exports de photo présents, octet pour octet ; DSC00629 interdit). Aucune photo de partenaire/chercheur n'a de statut ici : ajout = nouveau contrat d'assets.

### 6.6 Garde « clients publiables »
- `src/system/public-clients.ts:2` : `PUBLIC_CLIENT_NAMES = ["Laparra","Clevery","Forexpert","Joone","SNCF"]`.
- `tests/conformity-home.spec.ts:66-97` : la section `.home-s-brands` doit lister **exactement** ces 5 noms (texte, `strong` 600 / `span` 400, bordure basse 1 px, **ni `a`, `button`, `img`, `svg`**). `tests/conformity-home.spec.ts:275-276`, `tests/doctrine-visible.spec.ts:279`.
- `tests/public-clients.test.mjs:11-42` : lit `src/app/(rev01)/page.tsx` ; chaque client doit apparaître **2 fois** (une par langue) ; un client inconnu injecté dans le DICT ou une prose fait échouer (`scripts/lib/public-clients.mjs`, `homeClientViolations`). `tests/audit-truth-copy.test.mjs:33-66` : SNCF doit citer « Arkel » et « formation » ; Joone « accompagnement/coaching » sans « système ».
- `scripts/false-claims-check.mjs:110-118` : tout `src/app/(rev01)/**` est scanné pour noms de clients privés (`privateClientNames`) ; le Journal ne nomme **aucun** client, même public (`tests/public-clients.test.mjs:13-17`).
- Conséquence pour `/realisations/[slug]` : un cas nommé hors liste fait échouer `false-claims-check`; il faut des cas anonymisés (`/dossiers` le fait) ou étendre la liste de façon documentée (règle d'or n° 6 amendée le 25/10).

---

## 7. Qualiopi, Formia, MIT, chercheurs, partenaires sur le site aujourd'hui

### Qualiopi (constaté)
- **Aucune mention dans `src/`, `public/llms.txt`, `scripts/generate-llms.mjs`, `content/`** (grep insensible à la casse). Le site live ne la mentionne pas (capture FR).
- Historique : un bloc « Formia, également dirigée par notre fondateur, est certifiée Qualiopi (ATA 1926 2026, valable jusqu'en mai 2029) » existait (spec `docs/CODEX-SPEC-2026-09-21-home-systems-rewrite.md:199,206`, `docs/CODEX-SPEC-2026-09-23-revue-6-personas.md:334-347`). Il a été **retiré le 05/10/2026** : `docs/CODEX-SPEC-2026-10-05-parrit-ai-corrections-v1.md:16-17` motive : « numéro non vérifié, entité tierce » ; `docs/REPORT-2026-10-05-corrections.md:9` confirme (« suppression des deux entrées credential et de leur section/logo Qualiopi »).
- Reste un **fichier orphelin** `public/brand/qualiopi-formia.png` (non référencé par `src`, déduit par grep) et deux mentions de maintenance : `AGENTS.md:51` (« certification Qualiopi conservée ») et `AI_CONTEXT.md:247-248` (« bande après la clôture attribue la certification Qualiopi à Formia », décrit un état antérieur).
- Entité à laquelle elle était attribuée : **Formia** (« organisme de formation »), pas Parrit.ai. Titulaire, validité et catégories d'actions : **non vérifiés dans le dépôt** (UNKNOWN). Le numéro « ATA 1926 » n'est pas sourcé.
- Contraintes techniques : voir §6.5 (`false-claims-check` et `privacy-corrections`).

### Formia / FormIA (constaté)
- Deux occurrences publiques seulement : `src/app/(rev01)/page.tsx:40` (EN) « Training for your teams goes through FormIA, our training organization. » et `:121` (FR) « …La formation de vos équipes passe par FormIA, notre organisme de formation. » Orthographe site : **FormIA**, spec : Formia.
- `TRUTH.md:17` : « FormIA est l'organisme de formation de Parrit.ai, sans site propre ». La formulation « notre organisme de formation » **présente Formia comme une branche de Parrit** ; la spec (§2 H10) demande de ne pas attribuer à Parrit.ai ce qui est porté par Formia et de clarifier la relation. Relation juridique réelle Formia/Parrit : non documentée dans le dépôt (UNKNOWN).
- Aucune page, aucun logo, aucun lien Formia ; la mention de formation SNCF dit « avec Arkel » (`page.tsx:29,110`).

### MIT (constaté)
- Seule occurrence : `content/journal/glm-5-2-sovereignty.mdx:16` (licence MIT du modèle GLM, sans rapport avec l'institution). **Aucun chercheur MIT, aucun logo MIT sur le site.**

### Chercheur / research / scientifique (constaté)
- **Aucune** occurrence dans `src/`, `public/llms.txt`, `scripts/` (hors un lien de source dans `public/certificates/malicious-mcp-server-after-install.json`, article Journal). Le mot « chercheur » n'est pas interdit par les tests, mais les mots `Paul/fondateur/founder` le sont (§6.5).

### Partenaires (constaté)
- Aucune page ni section « partenaires ». `partner` n'apparaît que comme règle de blocage `false-claims-check.mjs:69-71` (« partner leads », « associé mène ») et dans deux articles du Journal (sens générique, ex. « monitoring partner »). Mention « avec Arkel » pour la SNCF (`page.tsx:29,110`) : seul partenaire cité.
- Identité légale (constaté) : `src/app/(rev01)/legal/page.tsx:7-9` : PARRIT.AI, SAS, capital 100 €, siège 3 avenue Otis Mygatt, 92500 Rueil-Malmaison, RCS Nanterre 928 503 218 ; directeur de publication « Paul Larmaraud » (seule mention nominative autorisée). Aucune mention de Formia ni de Calypie/Calliope. La NOTE-CADRAGE tranche « Calypie » = Qualiopi.

---

## 8. Mécanisme de réservation / contact (chemins seulement)

- Réservation : Cal.com en iframe sur `/commission` : `src/app/(rev01)/commission/page.tsx` → `src/system/components/CalInline.tsx` (`ParritCalInline`, embed chargé en lazy à l'approche du viewport, namespace `commission`, thème sombre) ; identifiant de calendrier : `site.config.ts` (`CAL_LINK_COMMISSION`, événement « audit », visio Google Meet ; verrouillé par `tests/cal-link.test.mjs`). Tests : les domaines `app.cal.com` / `cal.com` sont les seuls externes tolérés (mock dans `tests/anti-slop-copy.spec.ts:19-20`, `tests/doctrine-visible.spec.ts:10-11`, `tests/conformity-i18n.spec.ts:35-38`).
- Capture e-mail : `src/system/components/QuickCapture.tsx` (page `/commission`, état `data-state="done"` puis lien de réservation) et `src/system/components/AgentEsquisse.tsx` (hero de la home) → `POST /api/interet` : `src/app/api/interet/route.ts` → `src/lib/server/interets.ts`, `src/lib/server/leads.ts` (déduplication par e-mail), `src/lib/server/supabase.ts` (variables d'environnement `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, valeurs non lues) ; notification via la file `telegram_queue` (commentaire `route.ts`, `leads.ts:301-334`). `src/app/api/interet/projection/route.ts` + `src/lib/interet/*` : esquisse personnalisée `/sketch/[id]` (`src/lib/server/sketch.ts`).
- Attribution UTM / source : `src/lib/attribution.ts`, `src/lib/analytics.ts` (en mémoire seulement ; PostHog retiré le 05/10/2026, mesure d'audience par Cloudflare Web Analytics injecté hors dépôt, décrit dans `/legal`).
- Pas de webhook n8n dans `src/` (`CODEX-SPEC-2026-09-08-retrait-webhook-fantome.md`). Adresse de contact légale : dans `legal/page.tsx:7-9`.
- Contrainte spec : « éviter doubles parcours concurrents » (H12) : aujourd'hui deux parcours (Cal + capture e-mail) coexistent sur `/commission`.

---

## 9. Modèle de contenu

- **Pas de CMS.** Pas de MDX pour les pages ; le texte des pages est dans des objets `DICT` en TypeScript, dans chaque `page.tsx` (home `:12-175`, systems `:104-250`, dossiers, manufacture, standard, build-with-you, commission, legal), séparés en `en` / `fr`.
- **Seul contenu fichier : le Journal** : `content/journal/*.mdx` (40 fichiers, front-matter `title`, `date`, `description`, `slug`, `noindex`), lu par `src/system/journal.ts` (gray-matter, validation de slug/date) ; publication par `scripts/publish-journal.mjs`, `scripts/propose-journal.mjs`, `scripts/journal-gates.mjs` ; certificats de contrôle `public/certificates/*.json` (`scripts/verify-certificates.mjs`, prebuild).
- **Registres TS** : `src/system/public-clients.ts` (liste blanche de clients, 5 noms) ; `src/system/examination.ts` (note « En visio ») ; `src/system/engagements.ts`, `src/system/commissioning.ts`, `src/system/auteur.ts` (identité JSON-LD), `src/system/jsonld.ts` ; **non branchés** : `src/lib/registry/{preuves,cta,ciblage,ressources,validate,index}.ts`, `src/lib/pillars.ts`.
- Données de dossiers : en dur dans `dossiers/page.tsx`. Registre des sources de vérité affiché sur `/systems` : lignes en dur (`systems/page.tsx`, test `tests/systems.spec.ts:35` attend 7 lignes).
- Hermes (`hermes/`) : agent d'amélioration continue qui lit `TRUTH.md` ; `hermes/proposals/*.md`.
- Docs de pilotage : `TRUTH.md`, `AGENTS.md` (= `CLAUDE.md`), `AI_CONTEXT.md`, `docs/CODEX-SPEC-*`.
- La spec §8 demande les types Offer, UseCase, CaseStudy, Technology, Partner, Person, Entity, Testimonial, Evidence, Video, CTA : **aucun n'existe** comme schéma ; `preuves.ts` couvre une partie de `Evidence`, `cta.ts` le `CTA`.

---

## 10. Captures datées (live)

Générées avec `/Users/paullarmaraud/parrit-presentation-kit/node_modules/playwright` (le worktree n'a pas de `node_modules`), script `capture.cjs`, chromium headless, mouvement réduit, plein écran :
- `/private/tmp/claude-501/-Users-paullarmaraud/b346e810-3d70-419d-bed2-335c723c82cc/scratchpad/site-v1/audit-depot/parrit-ai-fr-1440-2026-10-26.png` (1440 × 7461)
- `.../parrit-ai-fr-390-2026-10-26.png` (390 × 10366)
- `.../parrit-ai-en-1440-2026-10-26.png` (1440 × 7072)
- `.../parrit-ai-en-390-2026-10-26.png` (390 × 9895)
- Journal des relevés : `.../capture-log-2026-10-26.json` (titre, H1, taille H1 calculée, canonical, hreflang, nav, CTA, footer, sections).
Contrôle visuel : la capture FR 1440 montre bien les 9 sections de §2.1, y compris « Usines de contenu » ; la home live correspond au code du HEAD (aucun écart constaté). Aucun débordement horizontal (`scrollWidth` = largeur de viewport).

---

## Annexe : points ouverts pour la refonte (déduits)

1. `/contact` ou `/commission` : décision d'URL avant tout ; ~15 assertions pinnent `/commission`.
2. Nav de 5 entrées avec menu déroulant : casse `.cmd-nav a` = 2, bascule, panneau mobile ; à réécrire en règle de fond (destination, accessibilité, géométrie).
3. Hero : la spec change le H1 ; garder le mécanisme `.frame`/`.home-s-hero-ending`, `--d-xl` 84 / 40 px.
4. LogoWall : aujourd'hui interdit par test (`img`, `svg`, `a` dans `.home-s-brands`) et aucun logo client dans `public/` ; à traiter avec la liste blanche `public-clients.ts` et les autorisations.
5. Interdits transverses à intégrer dans le copy : tiret cadratin, `€`, « gratuit/free », « 15 minutes », « fondateur/founder/Paul », « certifié/certification » sans exception, « partenaire mène », liens `paul-larmaraud.com`.
6. Qualiopi et Formia : exige (a) vérification de l'entité titulaire hors dépôt, (b) modification de `scripts/lib/certification-claims.mjs` et de `tests/privacy-corrections.test.mjs:108` pour autoriser une mention vérifiée.
7. `TRANSLATED_PATHS` (`locale.ts:10`), `proxy.ts:73-76` (matcher), `sitemap.ts:8-17`, `scripts/generate-llms.mjs` doivent être mis à jour à chaque nouvelle route ; `internal-linking.spec.ts` exige ≥ 7 liens internes par page.
8. `AGENTS.md:56` (« H1 88px ») est inexact : 84 px dans le code.
9. Registre de preuves déjà écrit (`src/lib/registry/preuves.ts`) mais non branché : candidat naturel pour le « registre éditorial » de la spec §6.
10. `src/app/(rev01)/layout.tsx:38-43` : titre/description par défaut obsolètes (« Business software and AI, tools you own ») : à aligner avec la nouvelle promesse.
