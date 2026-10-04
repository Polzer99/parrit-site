# CODEX SPEC — parrit.ai passe sur le Brand OS (lot 1 : identité, raccordement, contrôles, titres)

Date : 04/10/2026 · Auteur : Claude (relecture et merge, §25) · Base : `origin/main` (pas le `main` local, en retard de 7 commits).
Décisions qui couvrent ce lot : D1 (Paul, 24/09 : palette P1/P3 du Brand OS remplace la charte T4), ancienne charte
désactivée (Paul, 28/09), REGLES-DOR §37 (vraie photo uniquement), §48 (un seul canon de marque), mission de Paul du
04/10 (« migrer les deux sites vers le nouveau Brand OS, fusion et déploiement autorisés pour ce qui est couvert par des
décisions établies »). **Hors lot, ne pas toucher** : promesse et catégorie du hero (`hero.*` de la page d'accueil,
décisions DV-01/DV-02 ouvertes), « Commissioned, not subscribed » / « Une commande, pas un abonnement » (DV-03),
faits d'offre (prix, durées, livrables : DV-06), contenu des articles du Journal, textes juridiques, routes, API,
formulaires, Cal.com, PostHog.

## FIX1 (04/10, après la première exécution) — À FAIRE SUR LE TRAVAIL DÉJÀ PRÉSENT DANS CE WORKTREE
La première exécution est conservée dans ce worktree (non commitée) : ne rien refaire, ne rien annuler. La batterie
réelle (hors sandbox, `next build` Turbopack) a échoué sur `src/app/favicon.ico` : « The PNG is not in RGBA format ».
Le défaut venait du générateur d'icônes (corrigé, commit `6da9777` du Brand OS). Recopier octet pour octet le nouveau
`favicon.ico` depuis `/Users/paullarmaraud/parrit-canon-visual-system/brand/visual/sites/handoff/2026-10-04/icons/parrit-ai/`
(ainsi que les trois autres icônes si leur sha256 a changé), relancer `npm run build` (Turbopack, la commande standard,
pas Webpack) et `npm run test:brand-os`. Rien d'autre à modifier.

## FIX2 (04/10) — CI GitHub de la PR #294 rouge (run 37203746920), défauts réels
1. `input::placeholder` sur fond sombre : 3,30:1 (minimum 4,5) → couleur claire des conteneurs sombres
   (`--brand-derived-on-ink-2` via les variables du site), sur `/` et `/commission`, EN et FR.
2. `button.rev-button.exec` « Sketch / Esquisser » à l'état désactivé : rose à opacité réduite sur encre, 2,89:1
   (minimum 3:1 pour un contrôle). L'état désactivé ne passe plus par l'opacité : fond transparent, bordure et texte
   en couleur claire des conteneurs sombres (≥ 3:1 pour la bordure, ≥ 4,5:1 pour le texte), curseur `not-allowed`.
   L'état actif garde le rose plein.
3. `span.k` sur fond sombre à 2,83:1 (`/commission`, `/` à 375 et 1440) : couleur claire des conteneurs sombres.
4. `tests/conformity-home.spec.ts:119` fige « Let's meet → » / « Rencontrons-nous → » : la spec retire la flèche
   (contrat VS-CONNECTOR, caractère absent des polices) ; mettre à jour l'attendu en « Let's meet » / « Rencontrons-nous ».
5. Registre des ressources : « La matrice tâche · modèle » affaiblit le sens ; écrire « La matrice qui associe chaque
   tâche à un modèle, et le calcul de ce que vous payez en trop. » et « La matrice qui associe chaque tâche à un modèle,
   avec les seuils ».
Ne pas assouplir les tests. La batterie du pont lancera cette fois `qa:network:rev01` hors sandbox.

## 0. Sources à lire (lecture seule, hors du dépôt)
- Paquet de raccordement (versionné dans le Brand OS, commit `cd69c5b`, branche `brand-os/visual-system-v0.2`) :
  `/Users/paullarmaraud/parrit-canon-visual-system/brand/visual/sites/handoff/2026-10-04/parrit-ai/brand-os/`
  (5 fichiers : `brand-os.tokens.css`, `brand-os.origin.json`, `brand-os.forbidden-assets.json`, `brand-os.glyphs.json`,
  `brand-os.connectors.json`) et `/Users/paullarmaraud/parrit-canon-visual-system/brand/visual/sites/handoff/2026-10-04/icons/parrit-ai/`
  (`favicon.svg`, `favicon.ico`, `icon-512.png`, `apple-icon-180.png`) + `../icons/site-assets.manifest.json`.
- La PR #292 (commit `ec09bc3`, branche `codex/docs-CODEX-SPEC-2026-09-28-brand-os-p1-palette-md`) : mapping des
  variables, tests et contrôle de conformité déjà écrits. Elle est en conflit avec `origin/main` et sa CI était rouge.
- Le dossier `docs/brand-os-migration-2026-10-04/` éventuellement présent dans l'arbre principal est un brouillon
  obsolète : ne pas l'utiliser, ne pas le committer.

## 1. Raccordement au Brand OS (pas de copie manuelle de valeurs)
1. Partir de `origin/main`, appliquer le contenu de `ec09bc3` (`git cherry-pick ec09bc3` puis résoudre les conflits
   `AI_CONTEXT.md`, `package.json`, `src/app/(rev01)/layout.tsx` en gardant les deux côtés : `test:entity` et
   `src/system/jsonld.ts` de main restent).
2. Remplacer `src/system/brand-os.tokens.css` par le fichier du paquet (octet pour octet) et ajouter à côté, octet pour
   octet, `brand-os.origin.json`, `brand-os.forbidden-assets.json`, `brand-os.glyphs.json`, `brand-os.connectors.json`.
   Ces 5 fichiers ne s'éditent jamais à la main (commentaire en tête du CSS). Régénération : commande `regenerate` de
   `brand-os.origin.json`, puis recopie.
3. Le mapping de `src/system/tokens.css` reste celui de #292 (noms de variables du site inchangés, valeurs = `var(--brand-*)`).
   Ajouts (contrastes mesurés en production le 04/10, < 4,5:1) :
   - `.r2-dark`, `.home-s-hero` et `.cmdbar` redéfinissent `--g2/--g3/--g4` sur `var(--brand-derived-on-ink-2)` ;
     `.cmdbar` : fond `color-mix(in srgb, var(--ink) 92%, transparent)` (plus aucun `rgba(10,11,12,…)`).
   - Liens sans style dans les conteneurs sombres (`.r2-dark a`, `.r2-sub a`, liens de `/systems` et `/build-with-you`
     rendus en bleu navigateur #0000EE sur encre, 2,1:1) : couleur `var(--accent-on-dark)`, soulignés.
   - `/commission` : l'étiquette `K` « Your request / Votre demande » (2,59:1 sur carbone) passe sur la couleur claire
     des conteneurs sombres.
   - `--label-d` sur fond clair (1,56:1 sur `/` et `/fr`, textes « 15 of 25 information sources… » et « Three open
     dossiers… ») : corrigé par le mapping ; le vérifier.
4. Polices : la famille éditoriale `Source Serif 4` n'existe pas dans le Brand OS (mode accessible = General Sans +
   IBM Plex Mono). Retirer son `@font-face`, son fichier `public/fonts/rev03/source-serif-4-latin-opsz-normal.woff2` et
   sa licence ; `--ed` pointe sur `var(--ui)` ; les graisses 420/480 deviennent 500. Les fichiers General Sans et
   Plex Mono restent à leur chemin actuel : un test vérifie que leur sha256 est égal à `canon_fonts` de
   `brand-os.origin.json`.
5. Aucun mode complex, aucune police Inter Tight : le paquet ne les contient pas, ne pas les réintroduire.

## 2. Flèches et glyphes (contrats communs VS-CONNECTOR et V-GLYPH)
Mesuré en production le 04/10 : « → » est absent d'IBM Plex Mono et de General Sans, le navigateur le dessine avec une
police de repli. Le contrat (`brand-os.connectors.json` → `glyph_arrows_forbidden`, `head`) interdit une flèche-caractère.
1. Retirer toute flèche-caractère du texte visible : « Let's meet → », « See the system → », « See the dossiers → »,
   « Rencontrons-nous → », « Voir le système → », « Voir les dossiers → » (le libellé reste, sans flèche) ;
   « Examination → Construction → Compounding » / « Examen → Construction → Capitalisation » devient
   « Examination · Construction · Compounding » / « Examen · Construction · Capitalisation ».
2. `MechanismSchema.tsx` : les deux `↓` deviennent un connecteur dessiné (CSS ou SVG inline, `aria-hidden`) : trait
   vertical `var(--brand-connector-stroke)`, tête pleine triangulaire `var(--brand-connector-head-len)` ×
   `var(--brand-connector-head-w)`, tige ≥ `var(--brand-connector-min-shaft)`, pointe à `var(--brand-connector-endpoint-gap)`
   du bloc cible, couleur de ligne du registre (`--rule-l`/`--g3` selon le fond). Orthogonal, aucun caractère.
3. Chercher les autres flèches-caractères de la liste dans `src/` (texte rendu, pas les commentaires) et les traiter pareil.

## 3. Assets
1. Icônes : remplacer `src/app/icon.png` par `icon-512.png`, `src/app/apple-icon.png` par `apple-icon-180.png`,
   `public/brand/favicon.svg` par `favicon.svg`, ajouter `src/app/favicon.ico` (fichier `favicon.ico` du paquet).
   Formes inchangées ([P.]) ; seules palette et police viennent du Brand OS. Le logo reste l'arbitrage AV-2 : n'inventer
   aucune autre forme.
2. Portrait : `public/founder-portrait.jpg` est REJETÉ dans le registre (provenance non vérifiée, probablement généré :
   §37). Le retirer du site : fichier, `<Image>` de la section `home-s-maison` (`page.tsx`), règle d'en-tête de cache dans
   `next.config.ts`. La légende « Paul Larmaraud · Founder / Fondateur » reste en `K` en tête de la colonne de texte ; la
   grille passe à une colonne de texte, sans emplacement vide. Aucune photo de remplacement (arbitrage AV-3 ouvert).
3. `public/brand/qualiopi-formia.png` (certification réelle) : conservé.
4. Images de partage : mesuré le 04/10, les pages qui définissent `openGraph` (toutes sauf les articles) ne publient
   **aucun** `og:image` (la page 404 en a un). Corriger `localizedOpenGraph` (ou la métadonnée racine) pour que chaque page
   publie `og:image` 1200×630 (l'image `opengraph-image` du site) et `twitter:card summary_large_image` + `twitter:image`.
   Les couleurs des images générées (`opengraph-image.tsx`, `journal/[slug]/og/route.tsx`) se lisent via `token.server.ts`
   (#292), sans hex. Textes des images inchangés.

## 4. Page 404
Il n'existe pas de `not-found.tsx` (la 404 actuelle est celle de Next, en `system-ui`). Ajouter `src/app/not-found.tsx`
dans le système du site (en-tête et pied communs, tokens, General Sans), `robots noindex`, bilingue sans détection :
H1 « This page does not exist. » puis « Cette page n'existe pas. », liens « Back to the home page » (`/`),
« Revenir à l'accueil » (`/fr`), « Read the Journal » (`/journal`).

## 5. Titres (STYLE.MD V9.0 partie XVII : verbe + conséquence, compréhensible à froid, nombre seulement s'il est vrai ;
la formule poétique passe en sous-titre). Remplacer EXACTEMENT, EN et FR, dans les dictionnaires des pages :
| Page / clé | EN | FR |
|---|---|---|
| `/` `journey.title` | Four steps take you from the first message to a system your team runs. | Quatre étapes mènent du premier message à un système que votre équipe fait tourner. |
| `/` `proof.dossiers.title` | We show client dossiers in a meeting, not online. | Nous montrons les dossiers clients en rendez-vous, pas en ligne. |
| `/` `journal.title` | The Journal records what held and what broke on our projects. | Le Journal consigne ce qui a tenu et ce qui a cassé sur nos chantiers. |
| `/` `close.title` | A 15-minute examination tells you whether a system is worth building. | Un examen de 15 minutes vous dit si un système vaut d'être construit. |
| `/build-with-you` H1 | In 10 hours with the founder, you build a system that runs. | En 10 heures avec le fondateur, vous construisez un système qui tourne. |
| `/build-with-you` kicker au-dessus du H1 | Build With You | Build With You |
| `/manufacture` H1 | We build each system one operation at a time, from Examination to Compounding. | Nous construisons chaque système une opération à la fois, de l'Examen à la Capitalisation. |
| `/manufacture` sous-titre | A system is manufactured. It is not installed. | Un système se fabrique. Il ne s'installe pas. |
| `/manufacture` H2 « Three phases. » | Three phases turn an examined operation into a system you own. | Trois phases transforment une opération examinée en un système qui vous appartient. |
| `/dossiers` H1 | We show client dossiers in a meeting, not on this site. | Nous montrons les dossiers clients en rendez-vous, pas sur ce site. |
| `/dossiers` sous-titre | The dossiers open in conversation. Systems commissioned by large accounts, SMEs and mid-sized companies. Anonymized on principle. | Les dossiers s'ouvrent de vive voix. Des systèmes commandés par des grands comptes, des PME et des ETI. Anonymisés par principe. |
Règles : `title`/`description` de métadonnées qui recopient un H1 modifié suivent le nouveau H1 (titre ≤ 70 caractères
avant le suffixe « · Parrit.ai » ; sinon garder le titre de métadonnées actuel). Ne créer aucun tiret d'incise (« – », « — »).
Mettre à jour les tests qui figent les anciens textes (`conformity-*.spec.ts`, `offer-cards`, `systems`, etc.) plutôt que
de les supprimer. `false-claims-check` doit rester vert.

## 6. Contrôles à ajouter (la CI bloque, pas la mémoire)
Nouveau `npm run test:brand-os` (node, sans réseau), lancé dans `ci.yml` après `npm run build` :
1. **Origine** : pour chaque entrée de `brand-os.origin.json → files`, le sha256 du fichier vendorisé est égal ; sinon
   échec « fichier Brand OS édité à la main ». Les polices de `public/fonts/` qui portent un nom de `canon_fonts` ont le
   même sha256.
2. **Assets interdits** : aucun `patterns` ni nom de fichier de `rejected` (`brand-os.forbidden-assets.json`) n'apparaît
   dans `src/`, `public/`, `content/`, `next.config.ts`, `.next/server/app/**/*.html` ; aucun fichier de `public/` n'a un
   sha256 listé.
3. **Glyphes** : le texte visible des pages prérendues (`.next/server/app/**/*.html`, balises `script`/`style` exclues)
   ne contient aucun caractère hors de l'union des plages de `brand-os.glyphs.json` (espaces et contrôles Unicode
   exemptés) ni aucune flèche de `glyph_arrows_forbidden` ; le message cite le caractère, son code et la page.
4. Le contrôle de conformité de #292 (`brand-conformity-check.mjs` : aucune couleur littérale hors
   `brand-os.tokens.css`, aucun hex T4 ou mort) reste actif.
5. Playwright (`qa:network:rev01`) : contraste ≥ 4,5:1 (3:1 au-delà de 24 px) sur `/`, `/fr`, `/build-with-you`,
   `/systems`, `/commission`, `/manufacture`, `/dossiers`, `/standard`, `/journal`, `/legal` (EN et FR) ; `og:image`
   présent sur ces pages ; la 404 rend le H1 attendu avec le statut 404 ; aucun débordement horizontal à 375 px.

## 7. Documentation
`AGENTS.md` (section « Source de vérité visuelle ») et `AI_CONTEXT.md` : la source visuelle est le Brand OS, via les
fichiers vendorisés `src/system/brand-os.*` et leur `origin.json` ; supprimer les listes de hex REV 03 recopiées et la
mention Source Serif 4 ; « jamais de redirection auto » est faux (`src/proxy.ts` fait un 302 FR) : corriger la phrase pour
décrire le comportement réel, sans changer le code.

## 8. Vérifications avant de rendre
`npm ci && npm run lint && npm run qa:claims:rev01 && npm run build && npm run qa:brand:rev01 && npm run test:brand-os`
verts ; `npm run qa:network:rev01` contre `next start` vert. Le compte rendu liste chaque fichier, chaque texte modifié
et toute question ouverte. Ne pas déployer, ne pas merger.
