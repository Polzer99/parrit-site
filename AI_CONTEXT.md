# AI Context

## Tour 2 impact — 27/10/2026

Accueil en grille 7/5 puis cadre produit pleine largeur ; quatre visuels partagés
avec les guides, rangées alternées et guides à filets 4/8. Onglets Engineering
conservés sur leur page, schémas compacts sur mobile, navigation sur une rangée.
Promesses Standard/Commission adoucies et apostrophes françaises harmonisées.
Actifs approuvés et jetons vendorisés inchangés. Aucun commit/push/déploiement.
Validation et limites : `docs/site-v1/RAPPORT-TOUR2-IMPACT.md`. Chromium refusé
par macOS : captures, hauteur −30 % et batterie navigateur restent à valider
sur l’hôte ; le test de hauteur exige une mesure initiale, sans valeur inventée.

## Correctif B tour 1 — 27/10/2026, nuit

H1 accueil restauré à 400 (autres H1 : 500), observateur historique de
navigation restauré (ghost puis exec après le hero accueil), accent canonique
et premier bouton Systems ghost rétablis. AGENTS actualisé ; seul le test
tour1-coherence est adapté pour l’exception du hero Systems.
Lint, build Webpack 62 pages, marque, claims et 24 tests Brand OS passent.
168/169 tests Node : readability-contract exige encore la navigation
invariante et interdit l’observateur ; laissé intact conformément au handoff B.
Turbopack interrompu sans progression, serveur 3210 refusé EPERM.
Rapport tour 1, section Correctif B : détails et validation navigateur à rejouer.
Aucun commit, push ni changement de branche.

## Correctif tour 1 — 26/10/2026, nuit

H12 section directe, H1 à 500, navigation non rose invariante, contours des
onglets renforcés, lien BWY clair et boutons groupés de dimensions cohérentes.
FAQ Systems conserve quatre titres h3 via le composant partagé. Hero accueil :
« Parlons de votre transformation » / « Let's talk about your transformation ».
Deux tests seulement adaptés (ancrage footer et exception CTA hero).
Le rapport tour 1 contient les 46 causes et corrections, ainsi que les assertions
navigateur contradictoires laissées intactes. Aucun commit, push ni changement
de branche ; preuve navigateur à rejouer par Claude sur l’hôte.
Validation : npm ci, lint, 169 tests Node, marque, claims et 24 tests Brand OS
réussis avec build Webpack (62 pages). Chaîne exacte bloquée au build Turbopack,
interrompu après environ 120 s sans progression ; script build inchangé.

## Tour 1 cohérence — 26/10/2026

Textes contractuels et accroches Journal corrigés (corps inchangés), articles
/fr redirigés 308 vers les URL anglaises, composants Sequence/Faq/FinalCall
partagés et règles de boutons/liens/H1 harmonisées. CTA navigation invariant.
169 tests Node, 24 Brand OS, lint/types/claims/marque et build Webpack passent.
Turbopack sans progression ; serveur 3210 et Chromium refusés par le sandbox.
489 cas navigateur à rejouer sur l’hôte. Langue/24 h Cal.com non pris en charge
par l’API embed 1.5.3 installée ; thème et dimensions côté hôte corrigés.
Voir docs/site-v1/RAPPORT-TOUR1-COHERENCE.md, notamment les limites de preuve.
Aucun commit, push ou déploiement.

## Correctif PR #330 — 26/10/2026

Checkout initial `01e334f` : socle `bdf6167` repris sans commit ni changement
d'index. H2 capture commission à `--t-m`/600 ; tests cartes de références,
grille gauche du hero et titre commission renforcés (FR/EN, dont 390 px).
CSS mobile, échelle et audit d'aération inchangés. Lint/types/marque/claims,
165 tests Node, 24 tests Brand OS et build Webpack (62 pages) passent.
Turbopack interrompu sans progression ; Chromium refusé avant navigation
(436 cas recensés). Validation navigateur à effectuer sur l'hôte.
Aucun commit, push ou déploiement. Section « Correctif » de
`docs/site-v1/RAPPORT-ERGONOMIE-IMPACT.md` pour la provenance et les résultats.

## Ergonomie et impact, mode accessible, 26/10/2026 soir

Handoff ERGONOMIE-IMPACT implémenté localement : ProductScene restauré au hero,
schéma déplacé au Conseil, cartes à deux lignes, méthode 3 × 2, actions à largeur
de contenu, surtitres et registres décoratifs retirés. Mono réservée à Systems,
au code du Journal et au mot-symbole. H06 garde ses titres sans JS et les masque
visuellement après hydratation. Preuves et permissions inchangées.
Lint/types/claims/marque, 165 tests Node, 24 tests Brand OS et build Webpack passent.
Turbopack interrompu sans progression ; port 3210 et Chromium refusés par le
sandbox. Les 434 cas navigateur et les quatre captures restent à valider sur
l’hôte. Aucun commit, push ou déploiement. Détail des adaptations de tests et
résultats : `docs/site-v1/RAPPORT-ERGONOMIE-IMPACT.md`.

## Cession écrite et faiblesses du lot 1 — 26/10/2026

Les textes FR/EN de Standard, Manufacture, BWY et des guides annoncent une
cession contractuelle limitée ; Standard explicite les licences des tiers.
La gate de claims bloque les anciennes promesses de propriété, hors mentions
légales, démonstrations privées, Journal et commentaires. Schéma à quatre
étapes par colonne, CTA finaux pleins, grain 512 px avec respiration brand-s6.
Le paragraphe « Prendre la main » cité par le handoff est absent de cette base ;
les six étapes courtes de l'accueil sont conservées.
Lint/types/claims/marque, 161 tests Node, 24 tests Brand OS et build Webpack
passent. Turbopack interrompu sans progression ; serveur :3210 et Chromium
refusés par le sandbox. Les 428 cas navigateur restent à exécuter sur l'hôte.
Aucun commit, push ni déploiement. Rapport :
`docs/site-v1/RAPPORT-JURIDIQUE-FAIBLESSES.md`.

## Matière granuleuse, option A — 26/10/2026

Une bande décorative vide et aria-hidden suit H01 sur les accueils FR/EN.
Matiere utilise une tuile PNG opaque issue des jetons vendorisés ; prebuild
régénère les deux tons de façon déterministe, sans dépendance ajoutée.
La gate de marque vérifie format, palette, cellules, densité et poids.
Six tests Node et quatre parcours Playwright ajoutés ; fixtures existantes
étendues sans changer leurs assertions. Lint/types/claims/marque, 154 tests Node,
24 tests Brand OS et deux builds Webpack passent, PNG identiques entre builds.
Turbopack sans progression interrompu ; serveur :3210 et Chromium refusés par
le sandbox. Captures et validation navigateur restent à faire sur l'hôte.
Voir `docs/site-v1/RAPPORT-MATIERE-GRAIN-A.md`. Aucun commit/push/déploiement.

## Reprise V4 après clarification du point 5, 26/10/2026

Les correctifs de rendu V4 présents au démarrage sont conservés. Le point 5 du
handoff autorise l’alignement des tests créés en V3 : H12 exige désormais une
seule destination localisée dans `site-v1-visual.test.mjs` et dans les deux
assertions correspondantes de `site-v1-visual.spec.ts`. Toutes les autres
assertions et les tests antérieurs à V3 restent inchangés dans cette reprise.
Les deux tests Node et douze parcours navigateur V4 déjà présents sont conservés.

`npm ci --silent`, lint, types, marque, claims, build Webpack, 148/148 tests Node
et 24/24 tests Brand OS passent. Turbopack interrompu sans progression ; écoute
3210 refusée (EPERM) et Chromium refusé avant navigation. Les 424 cas navigateur
ne sont donc pas validés. Aucun commit, push ou déploiement. Cette reprise lève
la contradiction de tests décrite dans l’état historique ci-dessous, pas le
blocage de validation visuelle sur l’hôte. Voir le rapport V4 pour les journaux.

## Site V1 lot 1 V4, 26/10/2026

Checkout initial `2115aab` ; socle V3 `19e5e88` repris dans les fichiers de travail
sans commit ni changement d'index. H2 de section 40/32 px, clôtures 54/34 px,
H3 22 px, un seul lien H12 localisé. L'onglet actif H06 était à 2,749:1 sur canard
selon les traces hôte V3 ; contour clair du registre ajouté (calcul 5,768:1).
Filets, schéma, statuts et mouvements V3 conservés. Aucun test hérité modifié.
Deux tests Node et douze tests navigateur V4 ajoutés ; deny-all réseau conservé.

Lint, types, marque, claims, build Webpack et 24 tests Brand OS passent.
`npm test` : 146/148 ; les deux assertions V3 attendent encore trois liens H12,
contrairement à V4. Onze tests navigateur V3 portent la même contradiction.
V4 interdit de modifier les tests ; exception demandée, sans réponse reçue.
Turbopack interrompu sans progression ; Chromium et écoute :3210 interdits par
le sandbox. Validation visuelle et batterie verte non acquises.
Détails : `docs/site-v1/RAPPORT-LOT-1-V4-CORRECTIFS-VISUEL.md`.


## Site V1, lot 1 V3 visuel — 26/10/2026

Base V2 `d05a3b4` reprise dans le checkout initial `2115aab`, sans commit.
Passe visuelle limitée aux nouvelles pages : régimes Brand OS, grille six colonnes,
filets, numérotation des méthodes, statut des preuves en tête et trois liens H12.
Textes V2 conservés. Webpack, lint, types, 146 tests Node et 24 tests Brand OS passent.
Turbopack sans progression ; Chromium refusé par macOS avant navigation.
T04 et actions H02/H04 restent ouverts faute de textes/destinations validés.
Voir `docs/site-v1/RAPPORT-LOT-1-V3-VISUEL.md` avant de considérer le lot clos.

## Site V1, lot 1 V2, 26/10/2026

La reprise V2 inclut le lot 1 du commit `3052fce` dans ce checkout initialement
sur `2115aab`, sans commit ni changement de branche. La date de revue des preuves
ne les retire jamais en production : CI échoue 30 jours avant, avec date injectée
dans les tests déterministes. Permission et portée restent obligatoires ; les
sections H02/H04 vides disparaissent. CaseStudyCard exige le pageId consommateur.
Menu refermé sur lien, route, Échap et clic extérieur ; l'observateur du header
ne considère le hero dépassé que si son bas est au-dessus du viewport.
Les titres FR/EN sont uniques ; l'alias conseil avec lang=en fait un seul 301.
TRUTH garde les cinq capacités restantes et leurs garde-fous. Les conditions de
propriété de Standard/Manufacture et la page Build With You restent inchangées.
`SITE_V1_CAPTURE=1` est obligatoire pour écrire les captures de site-v1.spec.ts.

Validation : 144 tests Node et 24 tests Brand OS passent ; lint, types, marque,
claims et build Webpack 62 pages passent. Turbopack sans progression interrompu ;
Chromium refusé par le sandbox avant navigation. Rapport :
`docs/site-v1/RAPPORT-LOT-1-V2.md`. Validation visuelle et 401 tests navigateur à
reprendre sur l'hôte. Aucun commit, push, déploiement ni preuve de production.

## Site V1, lot 1, état précédent du 26/10/2026

Le plan `docs/site-v1/ETAPE-1-PLAN.md` remplace l’accueil à six capacités :
H01 à H07, H11 et H12 ; trois portes et Harness Engineering. Quatre pages FR/EN
utilisent `SiteV1Page`, avec `/fr/conseil-transformation` associé à
`/consulting-transformation`. Le proxy, les alternates, le sitemap et llms suivent
cette correspondance. `/contact` et `/fr/contact` redirigent en 301 vers la réservation.

Navigation à quatre entrées, sous-menu Engineering et accordéon mobile natifs,
dans le flux. H06 expose trois panneaux sans JS et des onglets clavier après
hydratation. Les preuves publiques passent par `getSiteEvidence` : permission,
portée, source et dates calendaires valides ; revue trimestrielle au 26/01/2027.
Les anciennes preuves sans permission explicite ne passent plus le filtre public.
Les références lisent `public-clients.ts` ; aucune nouvelle permission de logo.

Les textes exacts du plan priment sur les descriptions historiques ci-dessous.
Pages protégées, Journal, fichiers vendorisés et polices conservés. Résultats et
limites : `docs/site-v1/RAPPORT-LOT-1.md`. Aucun commit, push ou déploiement.

## Positionnement précédent, remplacé par le site V1, 26/10/2026

Parrit.ai conçoit, construit et met en production des systèmes intelligents qui
transforment les opérations des entreprises. La spec du 26/10 ajoute six capacités
FR/EN après la méthode et avant la scène produit, sans actions par carte, et relie
Build With You depuis le footer uniquement (correctif V2 du 26/10).
H1, références, preuves, scène produit, Journal, header et page Build With You conservés. Métadonnées, JSON-LD, llms.txt et TRUTH
reprennent le canon `parrit-canon/positioning/POSITIONNEMENT-CANONIQUE-2026-10-26.md`.
TRUTH conserve les parcours et FormIA et ajoute les huit principes canoniques.

Validation et limites : `docs/REPORT-2026-10-26-six-capacites.md`.

## État précédent, 25/10/2026 (définition remplacée le 26/10)

La spec `docs/handoffs/2026-10-25-positionnement-deux-parcours.md`, révision 4,
est implémentée pour revue. Parrit construit des logiciels métier avec l'ambition de
verticaliser des produits, et accompagne la transformation IA. Deux parcours PME/ETI
et grands groupes, conseil et logiciel pour les deux ; FormIA est l'organisme de
formation de Parrit.ai, sans site propre. L'accueil FR/EN présente cinq références :
Laparra, Clevery Avocats (Clevery), Forexpert, Joone (accompagnement IA), SNCF
(formation avec Arkel, jamais client direct). Seuls les clients de
`src/system/public-clients.ts` sont publiables (25/10). Le Journal continue de
refuser tous les clients connus, même ceux de la liste publique.

Rôle du site (24/10) : peu de texte, montrer produits, réalisations, capacités et
preuves ; le rendez-vous est une suite possible, sans objectif de maximisation.
Aucun prix ni offre détaillée, aucune mention du fondateur hors `/legal` (12/10).
CTA conservés : « Réserver l'examen » / « Book the examination » vers `/commission`
ou `/fr/commission` (04/10). Les tests vérifient structure et règles de fond, sans
figer les libellés (25/10). Le contrôle client des pages partage la liste canonique ;
le Journal conserve son interdiction globale. JSON-LD et llms.txt décrivent logiciels métier et IA.
Mesure active (05/10) : Cloudflare Web Analytics injectée par Cloudflare hors dépôt,
décrite dans `/legal` ; PostHog retiré du navigateur.

R3 : les notices françaises du Journal portent `data-language-note` ; ne jamais
les repérer par `h1 + p` (le chapeau anglais occupe aussi cette position).
R4 : références en liste à deux colonnes dès 1024 px, une en dessous ; parcours
alignés à gauche et h2 partageant la règle de maison. Tests Node 110/110, Brand OS
24/24, lint, types, claims, marque et build Webpack réussis. Turbopack interrompu
sans progression ; Chromium refusé au lancement par le sandbox (326 tests recensés,
325 non exécutés). Validation navigateur à reprendre sur l'hôte. Aucune capture modifiée.

Résultats et limites : `docs/REPORT-2026-10-25-positionnement-deux-parcours.md`.
Aucun commit, push ou déploiement ; validation de publication réservée à Paul.

## Architecture actuelle

Site public Parrit.ai : Next.js 16.2.2 (App Router), React 19, TypeScript strict, Tailwind v4. Déploiement Vercel depuis `main`, Node.js 24.x (`.nvmrc`). Lire `AGENTS.md`, puis `TRUTH.md` avant tout changement de contenu ou de conversion. La spec validée `docs/CODEX-SPEC-2026-09-06-site-integral.md` décrit les lots du 06/09/2026.

L'application publique canonique vit dans `src/app/(rev01)/` : `/`, `/manufacture`, `/standard`, `/dossiers`, `/commission`, `/journal`, `/journal/[slug]`, `/journal/rss.xml`, `/legal` et `/sketch/[id]`. Le layout du groupe charge les polices, tokens, styles et la command bar. La home simplifiée porte `QuickCapture` hero et `AgentEsquisse`, puis les métriques et les sections éditoriales. `Opening` reste dans le code mais n’est plus rendu (décision Paul 06/09/2026). Les cinq pages intérieures ont leur copy FR/EN dédié.

Le copy vit dans des dictionnaires `DICT` par page et dans les composants localisés. Depuis le lot GEO/SEO B, les URLs nues rendent toujours l'anglais ; `/fr` et `/fr/{manufacture,standard,dossiers,commission,journal,legal}` rendent le français par rewrite du proxy, sans duplication. Le proxy transmet le chemin public et la locale ; `getLocale()` donne priorité au chemin. La négociation Accept-Language redirige en 302 uniquement les URLs traduites nues, hors bots et hors cookie de choix. Le header pose le cookie puis navigue entre URLs localisées ; `?lang=fr|en` migre en 301 en conservant les autres paramètres. Les articles du Journal et son RSS restent sans variante `/fr`. Canonicals, hreflang réciproques et OG suivent le chemin ; x-default reste anglais. Le sitemap inclut les sept paires (six routes institutionnelles et l'index Journal traduit).

## Canon visuel

Depuis le 04/10/2026, le Brand OS remplace T4/REV 03 : `src/system/brand-os.*` contient
le paquet vendorisé immuable (mode accessible), avec empreintes et régénération dans
`brand-os.origin.json`. `tokens.css` adapte ses valeurs par alias. General Sans (UI et titres)
et IBM Plex Mono (technique) sont conservées à leurs chemins actuels, contrôlées par SHA256.
Les documents REV 03 et `BRAND.md` sont historiques. Aucun mode complex ni Inter Tight.
Les OG utilisent `token.server.ts` et les deux CSS sont tracés dans les bundles Next.
Les états sombres redéfinissent les gris et `--label-d`, dont le défaut convient au clair.

## Conversion et données

`QuickCapture` poste vers `/api/interet`. Sa variante hero propose `idee` optionnelle (300 caractères) ; `src/lib/server/interets.ts` la range dans `metadata.interets_declares[].idee_prototype`. Les écritures métier passent par le serveur ; aucun secret côté client. `RegisterInterest` a été supprimé au lot GEO/SEO A.

`AgentEsquisse` est un échange déterministe local, sans backend ni LLM, avec un événement analytique au premier envoi. `/commission` porte `ParritCalInline` puis une capture standard. Le Journal n'a pas de capture d'abonnement. Les esquisses privées `/sketch/[id]` restent noindex et dynamiques ; leur UUID est le jeton d'accès.

## Journal et zones sensibles

Les entrées sont dans `content/journal/*.mdx`, lues par `src/system/journal.ts`. Ne pas modifier ces articles dans une purge d'identité. Le publisher `scripts/publish-journal.mjs` passe les gates de `scripts/journal-gates.mjs` puis le contrat de validation. Sa publication hors dry-run utilise git et pousse sur `main` : ne pas l'exécuter pendant un lot interdisant git.

Les registres `src/lib/registry/` restent des données legacy : éviter les transformations larges. L'entrée de ressource du détecteur dont la route n'existait plus a été retirée au lot 3. Aucun changement de schéma de base dans ce lot.

## Surfaces retirées

`src/app-rev01/` et la route de debug `src/app/system/` sont supprimés ; `/system` répond 404. Le microsite et ses assets dédiés sont archivés dans `archive/camp-costa-rica/`, hors routing Next et hors `public/`. L'archive est exclue de TypeScript et ESLint. La redirection permanente `/camp-costa-rica/:path*` vers `/` vit dans `next.config.ts` ; le proxy ne contient plus de rewrite de domaine camp. `/paul` et `/maxime` restent redirigées vers `/`.

## Vérification

Pour chaque lot : `npm run lint`, `npx tsc --noEmit`, `npm run qa:brand:rev01`. La gate de marque parcourt les deux arbres actifs `src/system` et `src/app/(rev01)` et interdit les hex hors tokens, y compris dans CalInline. L'hôte exécute `npm run build` et `npm run qa:network:rev01` avec le serveur sur le port 3210 ; ne pas lancer de serveur dans ce sandbox. Tous les tests e2e doivent utiliser le deny-all réseau partagé. La spec `tests/rev01-system.spec.ts` verrouille désormais la 404 et conserve l'autotest de blocage réseau.

Aucun appel runtime à `*.vercel.app`. Aucun changement de schéma sans migration. Aucun secret committé. Le lot 3 interdit toute commande git ; Paul reste responsable du merge.

## GEO/SEO, lot A

Métadonnées home localisées ; articles EN avec canonical auto-référent et alternates en/x-default, BlogPosting et OG enrichis. RSS découvrable depuis le layout et le Journal. Les engagements du Standard et les phases sont des h3 à rendu constant ; ItemList localisé sur Standard. /llms-full.txt expose les articles indexables en texte brut, cache partagé 1 h. Sitemap daté par route ; Vary Accept-Language/Cookie dans le proxy. Le routage /fr est maintenant pris en charge par le lot B.


## GEO/SEO, lot B

`tests/conformity-i18n.spec.ts` rejoint `qa:network:rev01` : contenu par URL, négociation 302, migration 301, cookie/header, métadonnées réciproques, sitemap et articles uniquement EN. Deny-all partagé, service workers bloqués et embed Cal simulé. Lint, TypeScript et gate de marque validés ; 96 cas proxy vérifiés hors réseau. Les 19 tests navigateur sont listés, à exécuter chez l'hôte avec le build. Aucun CSS ni article MDX modifié. Rapport `.codex-report-geo-b.md`.

## Intégrité des métadonnées, 09/09/2026

Les images des articles utilisent la route explicite `/journal/[slug]/og`, commune à Open Graph, Twitter et BlogPosting. La convention `journal/[slug]/opengraph-image.tsx` est supprimée ; rendu, polices et tokens conservés. Le tracing des assets cible la nouvelle route. Le titre du Journal français devient `Le Journal` ; Organization porte `Parrit.ai` et l'alias `PARRIT.AI`.

`tests/metadata-integrity.spec.ts` rejoint `qa:network:rev01` : HTTP pur, destinations limitées au serveur local, redirections interdites, titres uniques sur le sitemap et images OG/JSON-LD en 200. Les descriptions sont relevées sans seuil éditorial. Build, vérifications HTTP et preuve par mutation restent à exécuter par Claude hors de ce sandbox.

## Géométrie et aération, 09/09/2026

Le lot géométrique conserve textes, tailles et couleurs. `rev01.css` regroupe l'écart de 24 px pour `.standard-action` et `.r2-close` (deux structures existantes), espace la note de clôture en em, équilibre les titres, applique pretty aux paragraphes, aligne les statuts des dossiers et élargit les intitulés du Standard. Le sélecteur de langue espace aussi ses boutons pour garder le texte voisin à distance du fond actif.

`tests/aeration.spec.ts` rejoint `qa:network:rev01` : huit routes EN/FR à 1440/390, fragments de texte mesurés par Range, minimum 12 px aux actions remplies et aucun chevauchement de textes distincts non imbriqués. Deny-all partagé, service workers bloqués ; aucune de ces routes ne monte Cal. Support progressif de text-wrap : les anciens navigateurs de la cible Next peuvent ignorer balance/pretty et conserver le retour à la ligne natif. Documentation locale Next et données caniuse consultées hors réseau.

TypeScript, ESLint ciblé et gate de marque validés. Build, rendu navigateur, captures et preuve de mutation sur l'ancien build restent à exécuter par Claude, hors sandbox. Aucun port, réseau ou commit dans ce lot.

## Couleurs et polices en vigueur, 04/10/2026

Brand OS P1/P3 (24/09/2026, D1) : valeurs générées dans
`src/system/brand-os.tokens.css`, adaptées par `src/system/tokens.css`.
General Sans (texte et interface), IBM Plex Mono (registre technique), auto-hébergées.
Anciennes consignes couleur et typographie remplacées le 04/10/2026.

## Retrait capture Journal, 14/09/2026

Règle Paul : un bouton qui ne déclenche rien de réel est supprimé. La capture d'abonnement au Journal a été retirée de la home et de `/journal` parce qu'aucun envoi du Journal n'existe ; `QuickCapture` et `/api/interet` restent en place pour le prototype.

## Échelle fermée et plancher 14 px, 09/09/2026

Les neuf tailles canoniques vivent dans `tokens.css` (`--t-*`, `--d-*`). Les 102 déclarations de `rev01.css` sont normalisées (dont une reste `inherit`), ainsi que les 19 tailles de `system.css` ; le corps hérite désormais de `--t-m`. Les valeurs absentes du tableau de la spec sont rattachées sans nouveau pas : 26 px à `--t-xl`, 34 px fixe et clamps plafonnés à 30/38 px à `--d-s`, plafonds 76 px à `--d-xl`, 15 px et code `.9em` à `--t-s`, 9.5/12.5 px à `--t-k`.

Les usages CSS de rouge des deux arbres actifs passent par `--accent`/`--accent-p`, alias des valeurs brutes conservées. CalInline et la couleur conditionnelle des esquisses suivent ces alias. Aucun texte affiché ni valeur de couleur modifié.

Tracking réduit pour `.wordmark`, `.cmd-nav a`, `.clock` entre 761 et 1000 px, `.doctrine-code .k` et `.r2-std-row .ps` (media query comprise). Les numéros mobiles `.r2-phase .no` gardent 14 px avec un padding horizontal de 12 px. Les tests d'aération existants ajoutent le plancher strict et les neuf valeurs attendues indépendantes des tokens, tolérance 0.5 px sur les pas fluides ; champs et placeholders inclus.

TypeScript, lint complet et gate de marque passent hors réseau. Le H1 home vaut statiquement 84 px à 1440 ; son override mobile passe de 46.8 à 38 px à 390, et de 68 à 49.152 px à 768. Aucun build, navigateur, port ou commit exécuté. Claude doit encore passer la batterie et regarder les trois largeurs, surtout la command bar tablette, les en-têtes de Manufacture, les sceaux du Standard et des dossiers, les libellés Cal et le hero mobile. Les routes Journal et les esquisses restent hors des huit routes du test d'aération prescrit.

## Tests pré-hydratation, 14/09/2026

`tests/aeration.spec.ts` et `tests/conformity-i18n.spec.ts` rejouent désormais les gestes client fragiles avec `expect(...).toPass` et des bornes courtes : le champ email invalide doit garder sa valeur avant submit puis exposer `.ri-error[role='alert']`, et chaque switch de langue ne retente qu'une seule cible (`EN` puis `FR`) tout en conservant URL, query/hash, cookie et `lang`. Aucun attribut produit ni retry Playwright global ajouté ; si une saisie réelle est perdue avant hydratation sur connexion lente, ce sera un lot `src/` séparé.

## Offres publiques, décision du 12/10/2026

Aucun prix ni offre détaillée sur le site public. L'ancien ancrage et les cartes
commerciales sont retirés ; prix et périmètre restent dans les propales privées.
La page `/build-with-you` et sa variante FR restent des présentations sans prix.
Les tests contrôlent cette absence et les liens, pas les libellés.

## En-tête, hero et schéma, 20/09/2026

La spec `docs/CODEX-SPEC-2026-09-20-header-hero-systems-visual.md` remplace l'horloge par le CTA localisé commission (barre desktop, panneau mobile). `AgentEsquisse` vit dans le hero, entre le sous-titre et `QuickCapture` ; sa clôture indique désormais « ci-dessous » / « below ». `MechanismSchema` reprend trois étapes bilingues ancrées sur des faits vérifiés (onze outils, audit du 11/09, fermeture du 14/09) après un premier test de distinctivité qui avait jugé une version plus générique publiable pour n'importe quelle agence. Le test de succession des sections attend maintenant le hero avant les marques.

Validation complétée hors sandbox Codex (build, `qa:brand:rev01`, `qa:network:rev01` 74/74, captures desktop/mobile avant/après) : deux régressions réelles trouvées et corrigées avant merge — cascade CSS `.rev-button` écrasant le padding `.cmd-cta` (fixée par `.cmdbar .cmd-cta`), et le test de contraste du focus sur bouton sombre qui ciblait par erreur un bouton `disabled` d'AgentEsquisse après la réorganisation du hero (le sélecteur exclut désormais les contrôles désactivés et couvre aussi `.cmdbar .rev-button.exec`).

Lint, TypeScript et contrôle de marque passent. Les trois grep prescrits sont vides. Validation visuelle non obtenue : Chromium et le port local sont refusés dans le sandbox. Voir le rapport dédié pour les limites de validation et de distinctivité.

## Recomposition de l'en-tête et schéma relationnel, 20/09/2026

La spec `docs/CODEX-SPEC-2026-09-20-header-recompose-systems-diagram.md` remplace la composition précédente : `.cmdbar` reste fixe, hauteur 64 px, contenu dans `.cmdbar-inner` sur la grille 1160 px. Navigation Journal et Systems/Systèmes, commission uniquement via le CTA. Les décalages liés à l'en-tête suivent 64 px ; les quatre espacements indépendants de 52 px restent identiques. `MechanismSchema` reprend exactement le copy et les quatre blocs de la spec : deux sources, contrôle, décision, avec deux flèches. Tests de hauteur, cardinalité, CTA localisé et sélecteurs mis à jour ; accès Systems depuis les deux accueils ajouté.

Lint, TypeScript et gate de marque passent. Les quatre grep sont vides.

Validation complétée hors sandbox (build, `qa:brand:rev01`, `qa:network:rev01` 76/76,
captures desktop/mobile FR/EN avant/après) : une correction appliquée avant merge. La bordure
d'accent du schéma était posée sur le nœud « Deux contrôles », en contradiction avec la loi de
l'accent (« décision requise ») ; déplacée sur « Décision humaine, datée ». Jugement visuel
fait sur les captures : l'en-tête aligné sur la grille 1160px et la nav à 2 liens + 1 CTA se
distinguent clairement de l'ancienne barre plein-bord ; le schéma montre une vraie relation
2 sources → 1 contrôle → 1 décision, pas trois cartes parallèles.

## En-tête dans le flux et preuve Systems, 20/09/2026

La spec `docs/CODEX-SPEC-2026-09-20-header-static-systems-hero-proof.md`, sections 1 à 4, remplace le canon fixe précédent : command bar de 64 px dans le flux, sans compensation body. Opening et panneau mobile restent fixes. Le hero Systems réutilise la première SystemCard et la date observée ; le catalogue conserve ses quatre cartes. MechanismSchema reprend les formulations FR/EN prescrites et la bordure décision devient neutre (`--rule-d`), avec le fond `--carbon` conservé. Seul le test de positionnement est adapté au nouveau contrat.

Validation complétée hors sandbox (build, `qa:brand:rev01`, `qa:network:rev01` 76/76, captures
desktop/mobile FR/EN avant/après, dont une capture après défilement confirmant que la barre
quitte bien l'écran sur l'accueil et sur `/systems`). Jugement visuel fait sur les captures :
la carte de preuve du hero Systems est lisible sans défiler sur desktop, atteignable par un
court défilement sur mobile ; le nœud décision du schéma est visuellement identique au nœud
contrôle (bordure neutre), seule sa profondeur (`--carbon`) le distingue des deux nœuds sources.

## Continuité du funnel et justesse des engagements, 21/09/2026

La spec `docs/CODEX-SPEC-2026-09-21-funnel-continuity.md` (première des deux specs de reprise
demandées après l'audit funnel/copywriting du 20-21/09) referme plusieurs écarts trouvés en
audit. `AgentEsquisse` et `QuickCapture` sont fusionnés dans un seul parcours : le besoin tapé
est transmis (`initialIdee`), le classement suit enfin le scénario détecté au lieu d'être
toujours `full-os` (`interet={INTERET_FOR_SCENARIO[...]}`), le focus va au champ e-mail sans
saut d'ancre (`autoFocusEmail`), et l'ancienne ancre `#prototype` a disparu. `/sketch/[id]` lit
désormais la langue déclarée (`lireEsquisse` renvoie `lang`) et rend les 4 gabarits et tout le
chrome dans cette langue — plus de texte anglais fixe sur une esquisse française. `getLang()`
retombe sur `"en"` par défaut (un chemin sans préfixe est anglais sur ce site, jamais français).
Le contrôle du schéma (`MechanismSchema`) redevient scopé à l'ajout d'un point d'écriture, pas
à toute écriture. Deux résultats clients de `/dossiers` sans appui dans `preuves.ts` (le
registre canon, qui déclare lui-même 0 métrique client publiable) sont redevenus des
descriptions de mécanisme, sans chiffre inventé. PS-04 du Standard distingue désormais
annulation avant envoi, retour à l'état interne, et correction après envoi — sans jamais
promettre l'effacement d'un message déjà reçu. L'écart documenté le 20/09 (« audit offert 30 min
pour Build With You, destination commission annonçant 15 min ») est refermé : l'étape 1 devient
un examen de 15 min, identique au lien réellement réservé ; la restitution de 30 min n'est pas
touchée. Le hero de `/systems` n'affiche plus la fiche catalogue complète (4 blocs, ~937 px
mesurés en audit) mais un fragment compact (nom, preuve, limite, ~400 px).

Deux défauts de test trouvés et corrigés avant merge (Codex n'a pas pu les exécuter, son
sandbox refuse Chromium) : deux entrées de la liste figée de contraste `NEUTRAL_CONTROL_DEBT`
(`input#quick-idee`/`input#quick-email` sur l'accueil) n'avaient jamais été mesurées pour de
vrai avant cette fusion — le panneau était toujours resté replié pendant l'audit — et affichaient
une valeur jamais vérifiée (1.329) ; la première mesure réelle donne 1.234, identique à
`input#agent-operation` qui partage exactement la même règle CSS. Et un `.click()` de test juste
avant une vérification de contour de focus faisait passer Chromium en modalité pointeur, masquant
le contour d'accent réel d'un lien du header pour un vrai utilisateur au clavier ; un `Tab` de
test restaure la modalité clavier avant la mesure. Aucune assertion n'a été assouplie au-delà de
ce qui a réellement changé.

Validation complétée hors sandbox (build, `qa:brand:rev01`, `qa:network:rev01` 76/76 — deux fois
de suite après correctifs —, captures desktop/mobile FR/EN avant/après). Une seconde spec,
`docs/CODEX-SPEC-2026-09-21-copywriting-parcours.md`, reprend le copywriting de l'accueil sous
le premier écran et de `/build-with-you` une fois celle-ci mergée.

## Reprise du copywriting : preuve sur l'accueil et Build With You, 21/09/2026

La spec `docs/CODEX-SPEC-2026-09-21-copywriting-parcours.md` (seconde des deux specs de reprise,
suite de la première ci-dessus) referme l'écart F09 : la promesse de « Ce que nous construisons »
n'avait aucune preuve visible depuis l'accueil avant l'offre. Une nouvelle section « La preuve »
est insérée entre `home-s-build` et `home-s-offers`, reprenant mot pour mot les `<h1>` déjà en
production de `/systems` et `/dossiers` (vérifiés caractère pour caractère) comme titres de deux
cartes-liens — aucun texte nouveau n'est inventé, seule la navigation est ajoutée. `/build-with-you`
est réécrite pour répondre à F11 : trois nouvelles sections (« What comes out of these 10 hours »,
« What you bring », « What happens next ») s'appuient sur des engagements déjà écrits ailleurs
(PS-05, PS-06 du Standard ; « pas de chef de projet » de la section « La maison ») plutôt que
d'inventer une garantie propre à cette offre. Prix et étapes 01-03 (durées déjà corrigées en PR A)
inchangés.

Un défaut de test trouvé et corrigé avant merge : les deux nouvelles cartes de la section preuve
partagent la même classe CSS, ce qui les faisait mesurer comme une seule entrée dans la liste
figée de contraste (`NEUTRAL_CONTROL_DEBT`) puis se signaler mutuellement comme « doublon » —
la vérification exige qu'un sélecteur répété corresponde à un seul élément par page. Deux classes
de modificateur (`--systems`/`--dossiers`) distinguent désormais les deux cartes ; leur contraste
réel (1.270:1, fond `--paper2` sur grille `--rule-l`, même motif de séparation 1px que
`home-s-offers-grid` et le catalogue `/systems`) est documenté dans la liste figée, pas contourné.

Validation complétée hors sandbox (build, lint, `qa:claims:rev01`, `qa:brand:rev01`,
`qa:network:rev01` 76/76, captures desktop/mobile FR/EN avant/après). `qa:claims:rev01` a
d'abord bloqué la PR A pour une fausse alerte sans lien avec cette spec (voir historique PR
#277) — la reprise ici en tient compte : aucun tableau de durées n'est reformé sur une seule
ligne source dans cette PR.

## Accueil et ouverture Systems, 21/09/2026

La spec `docs/CODEX-SPEC-2026-09-21-home-systems-rewrite.md` est appliquée à
l'identique : scènes concrètes dans le sous-titre du hero FR/EN, portée de la
méthode limitée à l'opération choisie, faits visibles dans les deux cartes de
preuve. Une bande après la clôture attribue la certification Qualiopi à Formia ;
elle utilise l'asset fourni `public/brand/qualiopi-formia.png`, sans le modifier.
L'ouverture Systems utilise un titre de largeur 32ch, une preuve compacte dédiée
et les actions après la preuve. Les autres heroes et le catalogue restent inchangés.
Les mesures navigateur avant/après et la vérification de l'asset en production
sont prévues par la spec côté Claude après merge.

## Parcours accueil, 22/09/2026

La spec `docs/CODEX-SPEC-2026-09-22-home-journey.md` est appliquée à
l'identique : `journey` remplace `maison` dans les dictionnaires FR/EN, avec
quatre étapes en liste ordonnée ; les classes de mise en page sont conservées.
Comprendre/Décider/Agir suit désormais l'exemple de la facture impayée.
L'assertion du titre est actualisée sans assouplissement. Blocs de remplacement
vérifiés caractère par caractère ; gates marque et claims vertes avant/après.
Lint, build et tests navigateur non validés ici : dépendances absentes,
installation hors réseau impossible (ENOTCACHED). Captures et batterie complète
restent à réaliser par Claude selon la spec.

## Identité d'entité, 26/09/2026

`src/system/auteur.ts` centralise l'identifiant personnel et ORG_ID ; `personRef()`
et `orgRef()` alimentent les constructeurs purs de `src/system/jsonld.ts`, utilisés
par le layout et les articles. Organization.sameAs reste vide ; le site personnel
est relié uniquement via founder. BlogPosting porte son URL canonique + #article.
Aucun changement de copy, de frontmatter ni de dateModified.

`npm run test:entity` contrôle les graphes et l'orthographe dans src/content/public/docs.
Seule la spec contenant volontairement les contre-exemples est exclue explicitement.
Le publisher exécute cette gate d'orthographe après la copie éventuelle, avant
prooflint/build/publication. Un test d'intégration isolé verrouille cet arrêt.
Résultats : entité 7/7, Journal 9/9, TypeScript, lint, marque et claims verts.
Les JSON-LD avant/après et limites d'environnement sont dans
`docs/REPORT-2026-09-26-entity-identity-v0.md`. Aucun déploiement effectué.

## Migration Brand OS, 04/10/2026

La spec `docs/CODEX-SPEC-2026-10-04-parrit-ai-brand-os-v1.md` est appliquée au checkout
`3593c229` (identique à origin/main local), avec reprise sans commit du contenu de `ec09bc3`.
Paquet de raccordement copié octet pour octet ; son origin déclare `112de90e`, export du 04/10.
Portrait rejeté et fonte éditoriale retirés. Connecteurs CSS vectoriels, CTA sans flèches.
Titres FR/EN changés uniquement dans le périmètre prescrit ; hero, offres, articles et juridique préservés.
OpenGraph explicite sur les pages localisées, Twitter large hérité, images propres aux articles conservées.
404 bilingue, chrome partagé, noindex. La CI ajoute `test:brand-os` après build ; contrôles de
contraste, métadonnées, connecteurs et débordement 375px dans la batterie deny-all.
Le registre immuable des assets interdits est l'unique exception à son propre scan textuel.
Aucun commit, push, merge ni déploiement pendant ce lot. Les preuves d'exécution et limites
sont dans `docs/REPORT-2026-10-04-brand-os-v1.md`.

## Brand OS FIX2, 04/10/2026

Les placeholders des captures et de l'agent esquisse utilisent `--g4-d`, alias du
jeton clair canonique, avec opacité 1. Les boutons désactivés gardent une bordure
et un texte contextuels lisibles, un fond transparent et le curseur `not-allowed`,
y compris au survol ; l'action active conserve son accent. Les labels sombres
utilisent `--g4-d` ; le chargement Cal ne fait plus varier l'opacité du texte.
`tests/brand-os.spec.ts` contrôle aussi le texte et la bordure désactivés et ajoute
quatre parcours FR/EN à 375/1440 px (vide, survol, saisie, espaces seuls), sans envoi.
L'attendu du lien fondateur suit le contrat sans flèche. Les deux formulations
« La matrice qui associe chaque tâche à un modèle » sont restaurées au registre.
Voir `docs/REPORT-2026-10-04-brand-os-fix2.md` pour la validation et ses limites.

## Brand OS FIX3, 04/10/2026

Les deux labels directs de `home-s-maison-copy` sont des blocs séparés par `--s3`
(24 px). La 404 utilise une colonne d'actions dédiée, alignée à gauche, avec un
seul bouton plein et deux secondaires ; son titre utilise toute la colonne.
Les tests Brand OS couvrent la séparation FR/EN à 375/768/1440 px et la visibilité
des trois actions avant le footer dans la fenêtre 1440 × 900.
Résultats et limites d'exécution : `docs/REPORT-2026-10-04-brand-os-fix3.md`.

## Corrections de confidentialité et formulations, 05/10/2026

Le lot `docs/CODEX-SPEC-2026-10-05-parrit-ai-corrections-v1.md` désactive l’injection
PostHog navigateur ; sa constante reste dormante dans le layout. Attribution en
mémoire du document uniquement, conservée en navigation client et perdue au
rechargement ; aucun accès au stockage navigateur. QuickCapture transmet aussi
cette attribution d’arrivée. AgentEsquisse et les gabarits sketch restent sans LLM.
Aucun envoi serveur PostHog ni appel n8n/Sheets trouvé dans les parcours du site.
Confidentialité FR/EN alignée, mentions chiffrées visées retirées des pages,
des deux articles et du générateur llms ; bloc de certification tierce retiré de
l’accueil (asset conservé). Les indications historiques contraires sont obsolètes.
`npm run test:privacy` couvre les régressions ; le deny-all e2e ne tolère plus
PostHog. Voir le rapport du lot pour les preuves et contrôles hors sandbox restants.

## Doctrine visible, 04/10/2026 — validation partielle

Le lot `docs/CODEX-SPEC-2026-10-04-parrit-ai-doctrine-visible-v1.md` unifie les
boutons en General Sans 600 et le libellé de réservation FR/EN. Déroulement
centré sans légende orpheline, offres en contour, preuves au cran des cartes,
Journal anglais annoncé en FR, CTA dans le hero Build With You, ombre Cal retirée.
Le contenu du hero accueil, les prix, routes, intégrations et assets canon sont préservés.
`test:doctrine` vérifie les esquisses privées avec des données synthétiques ;
`tests/doctrine-visible.spec.ts` rejoint la batterie réseau avec 42 cas et les captures.
FIX1 applique W-66 : header en contour tant que le hero accueil est visible, plein
après sa sortie via IntersectionObserver ; sans JS, contour ; ailleurs, plein.
Le test strict d’accent est conservé ; transitions, navigation et absence de JS couvertes.
L’assertion de légende compilée suit désormais la présence d’une photo dans la section.
Build interdit ici ; Chromium refuse de démarrer dans le sandbox. Voir
`docs/REPORT-2026-10-04-doctrine-visible.md` avant de considérer le lot validé.

FIX2 (04/10) : alias `--text-note` retiré ; notes et verdict au cran existant
`--t-k` (14 px), liens de preuve en General Sans au corps (18 px), casse normale.
Le déroulement occupe la largeur commune des sections ; paragraphes conservés à 56ch.
Les 36 captures PNG suivies de brand-os-p1/after sont sauvegardées hors dépôt puis
retirées ; les PNG de `.codex-handoffs` sont désormais ignorés. Tests de composition
complétés. Lint, types, claims, brand et tests Node passent ; Chromium reste bloqué,
le build et la preuve visuelle doivent être exécutés par l’hôte (voir rapport FIX2).

## Photo et catégorie, 04/10/2026 — AV-3 / DV-01 a / DV-02 a

La spec `docs/CODEX-SPEC-2026-10-04-parrit-ai-photo-dv01-dv02-v1.md` autorise
DSC00629 : quatre exports AVIF/WebP 340/680 copiés sans transformation dans
`public/brand/founder/`, avec légende et alt FR/EN. La home présente désormais
« Données et IA » / « Data and AI » et la promesse de systèmes qui fonctionnent ;
métadonnées, OG, Opening, JSON-LD et introduction llms suivent cette catégorie.
DV-03 et les articles du Journal restent inchangés. Le H1 garde le cadre sans
coupure et utilise le palier existant `--d-s` à 480 px et moins.
Build Webpack, lint, types, claims, marque et 13 tests Brand OS passent. Le rendu
navigateur et les captures 375/768/1440 restent à vérifier par l’hôte : Chromium
est refusé dans le sandbox macOS. Détails dans `docs/REPORT-2026-10-04-photo-dv01-dv02.md`.

FIX1 : le test de composition doctrine mesure désormais l'ensemble photo + texte
au-dessus de 859 px quand une image est rendue. La branche sans photo/mobile et
les seuils existants sont conservés. Build Webpack, lint, claims, marque et les
39 tests Node passent à la reprise ; Chromium reste bloqué avant navigation.


FIX2 photo (04/10) : conformément à la section FIX2 de la spec photo,
le test doctrine du h2 à 1440 px autorise quatre lignes avec photo et conserve
les trois lignes sans photo (tolérance 0.01 inchangée). Aucun autre changement
fonctionnel. Build Webpack, lint, types, claims, marque et 39 tests Node passent.
La batterie navigateur reste bloquée au lancement de Chromium par macOS ;
voir la section Reprise FIX2 du rapport photo pour les résultats de cette passe.

FIX3 photo (04/10) : le cadre du H1 accueil reçoit un padding horizontal de
0.9em avec marges compensatrices de -0.9em pour préserver la coupure du texte.
Les tests Brand OS vérifient les quatre coins face aux rectangles Range du texte,
un écart horizontal de 12 px minimum et des coins dans le viewport, FR/EN à
375/390/768/1440 px. Build Webpack, lint, types, claims, marque et 39 tests Node
passent ; Chromium reste refusé par le sandbox avant navigation. La géométrie
réelle reste à valider sur l’hôte ; voir la reprise FIX3 du rapport photo.

FIX4 photo (04/10) : sous 400 px uniquement, le H1 utilise le palier existant
`--t-xl` (26 px), avec retrait du cadre de 1.04em pour conserver la séparation
de 12 px. Les huit parcours FR/EN à 375/390/768/1440 contrôlent également les
coins dans la gouttière réelle de `.home-s-wrap`. Build Webpack et contrôles
statiques/Node passent ; géométrie navigateur non validée (Chromium refusé par
macOS avant navigation). Voir la reprise FIX4 du rapport photo.

FIX5 photo (04/10) : la dernière décision de la spec remplace le contrôle de
gouttière FIX4 par une marge écran minimale de 16 px pour chaque coin du H1.
Les huit parcours FR/EN conservent non-intersection et séparation texte ≥12 px.
CSS inchangé. Build Webpack, lint, types et 39 tests Node passent ; validation
navigateur toujours bloquée au lancement de Chromium (voir rapport FIX5).

FIX6 photo (04/10) : le groupe encadré du H1 et son point final sont réunis dans
un bloc centré (`home-s-hero-ending`), sur leur propre ligne en FR/EN. Les huit
parcours à 375/390/768/1440 px vérifient désormais chaque glyphe du H1 contre
les quatre coins, ainsi que le centrage et l'absence de mot extérieur sur la
ligne encadrée. Marges écran ≥16 px et séparation du texte encadré ≥12 px
conservées. Voir la reprise FIX6 du rapport photo pour les résultats et la
limite de validation navigateur dans le sandbox.

FIX7 photo (04/10) : ajout de `margin-top: 0.12em` au bloc
`home-s-hero-ending`, seule correction fonctionnelle demandée. Tests FIX6
inchangés. Build Webpack, types, lint, claims, marque et 39 tests Node passent.
Chromium reste bloqué au lancement par le sandbox macOS ; la non-intersection
des coins avec tous les glyphes du H1 reste à vérifier sur l'hôte.


FIX8 photo (04/10) : la marge haute de `home-s-hero-ending` passe de `0.12em`
à `0.2em`, seule correction fonctionnelle demandée ; tests FIX6 inchangés.
Build Webpack, lint, types, claims, marque et 39 tests Node passent. La batterie
navigateur reste bloquée au lancement de Chromium par macOS ; la géométrie
reste à valider sur l’hôte. Voir la reprise FIX8 du rapport photo.

## Scène produit, 04/10/2026 — validation navigateur restante

La section `home-s-build` utilise désormais `ProductScene` : conversation commerciale
et fiche CRM fictive, copy FR/EN et repères HTML selon VS-PRODUCT-SCENE. Deux PNG
canoniques inchangés, huit dérivés AVIF/WebP dans `public/brand/scenes/`. Le manifeste
fait foi pour la hauteur de messagerie : 2400 px. Compositions mobile/tablette/desktop,
avec titre au cran `--t-xl` entre 1025 et 1200 px pour la colonne étroite.
`test:brand-os` inclut les empreintes/dimensions et vérifie le HTML compilé de la scène ;
`qa:network:rev01` inclut dix parcours FR/EN à 375/768/1024/1025/1440 px. Le contrôle
d'éclat rose regroupe seulement les repères de chaque scène et garde leur emprise totale.
Build Webpack, lint, types, marque, claims et 52 tests Node passent. Turbopack refuse
le lien local node_modules ; Chromium refuse le lancement macOS. Captures et preuve
visuelle restent à produire sur l'hôte ; voir `docs/REPORT-2026-10-04-scene-produit.md`.


FIX1 scène (04/10) : repère 2 déplacé à 60 % horizontal, hauteur 69,5 % conservée.
Les dix parcours FR/EN vérifient son rectangle hors de la bulle « oui » et un
écart strictement positif à gauche ; le rendu compilé verrouille sa position.
Build Webpack, lint, types, marque, claims et 52 tests Node passent. Turbopack
interrompu sans progression en compilation ; Chromium toujours refusé par macOS.
Captures et validation géométrique navigateur restent à produire sur l'hôte.
Voir la reprise FIX1 du rapport scène produit.


FIX2 scène (04/10) : repère 2 ancré par son bord droit à 6 px de la bulle,
via `left: 64.5%`, `top: 69.5%` et translation `calc(-100% - 6px)`.
Le composant propose l'ancrage optionnel `before`. Assertions FIX1 de séparation
conservées, écart de 6 px ajouté aux dix parcours, rendu compilé FR/EN vérifié.
Build Webpack, lint, types, claims, marque et 52 tests Node passent. Turbopack
interrompu sans progression ; Chromium refusé par macOS avant navigation.
Captures et preuve responsive FIX2 restent à produire sur l'hôte (rapport scène).

## Photo LinkedIn, 05/10/2026

La décision `docs/CODEX-SPEC-2026-10-05-parrit-ai-photo-linkedin-v1.md` remplace
la précédente autorisation DSC00629 : seuls les quatre exports LinkedIn AVIF/WebP
340/680 sont livrés dans `public/brand/founder/`, identiques au manifeste canonique
`2026-10-04/photos-linkedin`. Mise en page, dimensions, alt et légende conservés.
La fixture photo et les tests SSR/navigateur suivent ces exports ; un test Node
interdit toute référence ou nom de fichier DSC00629 dans `src/` et `public/`.
Build Webpack, lint, types, claims, marque et 18 tests Brand OS passent.
Chromium est refusé par le sandbox macOS avant navigation ; captures et batterie
navigateur restent à exécuter sur l’hôte. Voir `docs/REPORT-2026-10-05-photo-linkedin.md`.

## Contre-vérification, 05/10/2026

La conversation ProductScene est désormais HTML serveur (transcript p2 FR, corps 14 px),
avec photo recadrée sans retouche et capture CRM conservée. Couleurs tierces locales
à ProductScene.css, huit déclarations autorisées exactement par la gate de marque.
Prix BWY centralisé dans site.config.ts ; formulations FR/EN et claims corrigés.
Les alias /fr/journal/[slug] gardent désormais leur URL et portent la notice
« Article en anglais. » avec canonical EN ; les anciennes mentions d'une redirection
systématique de ces alias sont obsolètes. Aucun contenu MDX ou token canon modifié.
Lint, types, claims, marque, build Webpack et 64 tests Node passent. Chromium est
refusé au lancement par le sandbox ; captures et géométrie restent à valider sur
l'hôte. Voir docs/REPORT-2026-10-05-contre-verification.md pour le détail et la limite
persistante des petits libellés raster CRM.

## Photo buste, 05/10/2026

La spec `docs/CODEX-SPEC-2026-10-05-parrit-ai-photo-buste-v1.md` remplace les
exports LinkedIn précédents par les quatre exports buste AVIF/WebP 340/680 du
canon `2026-10-05/photos-linkedin-buste`, copiés sans transformation. Seules les
URLs de la picture changent ; dimensions, mise en page, alt et légende conservés.
Fixture SHA256 et attentes SSR/navigateur actualisées ; un test interdit les
anciens exports et leurs références dans src/public. Lint, types, claims, marque,
build Webpack et 20 tests Brand OS passent. Chromium reste refusé par le sandbox
macOS avant navigation ; validation responsive à terminer sur l’hôte.
Voir `docs/REPORT-2026-10-05-photo-buste.md`.

## Audit vérité, lisibilité et Harness, 08/10/2026

La spec audit du 08/10 remplace les formulations de livraison par les engagements
prescrits, actualise Lemlist/SAS/llms et ajoute la promesse d'autonomie BWY ainsi que
les étiquettes EN par article sur les listes FR. Les actions partagent 48 px/16 px,
les textes informatifs ont un plancher 16 px, les titres cinq pas et un H3 unique.
Le cadre hero peut se répartir sur plusieurs lignes mobiles pour conserver la taille.
Le paquet Brand OS vendorisé reste inchangé.

HarnessBadge vérifie côté serveur le statut CERTIFIED, l'URL canonique EN et le
SHA256 du fichier MDX complet. Aucun certificat public livré ; un JSON invalide est
invisible au rendu et bloque prebuild/npm test. Les certificats futurs nécessitent
une réémission après chaque changement des octets source. Le contrôle des claims
inclut les articles et isole les textes TS/TSX par AST.

Build Webpack et 102 tests Node passent ; Turbopack a été interrompu sans progression.
Chromium est refusé au lancement dans le sandbox : validation responsive sur l'hôte
requise. Voir docs/REPORT-2026-10-08-audit-verite-lisibilite-harness.md.

### FIX1, 08/10/2026

Le conteneur du second CTA hero conserve sa largeur de lecture et utilise des
marges horizontales automatiques pour rester centré. Les liens isolés fondateur
et suite sur mesure BWY ont 12 px de padding vertical et un minimum de 44 px,
sans modification typographique. Le test audit-readability couvre désormais
375/390/1440 et BWY FR, avec assertions de centrage et de cibles tactiles.
Build Webpack et 102 tests Node passent ; validation Chromium toujours bloquée
par le sandbox macOS avant navigation.

### FIX2, 08/10/2026

Le header et son panneau mobile portent un CTA contour rose ; le second CTA hero
est en contour clair, Sketch reste plein rose. Dimensions 48 px/16 px conservées.
Le lien BWY hérite du registre sombre avec cible 44 px. La mesure globale 68ch
utilise une spécificité nulle et respecte les mesures locales 56ch. Les tests
suivent les quatre secteurs documentés, Lemlist/transfert en cours et le titre
EN distinct de son étiquette. L'accent mobile se vérifie dans le panneau ouvert.
Build Webpack, 102 tests Node et 20 tests Brand OS passent ; Chromium reste bloqué
au lancement par macOS. Géométrie/contraste et CI navigateur à rejouer sur l'hôte.
Voir le complément FIX2 du rapport audit du 08/10.

### FIX3, 08/10/2026

Sur les accueils FR/EN, le CTA desktop retrouve le contour neutre et l'observateur
canonique de `origin/main` ; le panneau mobile retrouve son lien neutre, avec les
48 px/16 px conservés. Hors accueil, le contour rose FIX2 reste l'accent de page.
Le bouton secondaire du hero impose `--paper` malgré la variante sombre générique.
Le titre et le libellé `.r2-shead` peuvent revenir à la ligne pour Manufacture mobile.
Dossier 26-002 : opération dans le h3, secteur dans la référence, sans paragraphe
dupliqué. La note FR redevient « Pas publiés. Partagés en rendez-vous. ».
Build Webpack, 103 tests Node et 20 tests Brand OS passent. Lint/types/claims/marque
passent. Chromium reste bloqué au lancement par macOS ; les 221 tests navigateur
et la correction géométrique Manufacture restent à confirmer sur l'hôte.

## Premier certificat Harness, 08/10/2026

Le certificat public de `malicious-mcp-server-after-install` est livré dans
`public/certificates/`, copié octet pour octet depuis l'export public canonique
`~/.parrit/certificates/journal/parrit/` (le dossier intermédiaire
`docs/certificates-source/` était absent du checkout). L'article MDX est inchangé.
Les tests verrouillent la validité, l'empreinte complète de l'export et le badge
avec son lien dans le rendu serveur EN/FR ; Playwright vérifie aussi l'accès au JSON.
Build Webpack et 104 tests Node passent. Turbopack interrompu sans progression ;
Chromium bloqué par le sandbox avant navigation. Détails dans
`docs/REPORT-2026-10-08-premier-certificat-harness.md`.

## Alignement et copy, 11/10/2026

La spec anti-slop du 11/10 conserve les compositions et le Brand OS. Les colonnes
partagent 1160 px, avec 40/20 px de padding : bord de contenu à 180/20 px pour
1440/375. Attaque des heros 98 px, pieds locaux réduits à RegistryLine, cartes en
subgrid, notes centrées, dates et numéros du Standard insécables. Les paragraphes
utilisent le rythme CSS commun ; la conversation tierce conserve son rythme propre.

`src/system/examination.ts` centralise EXAM_NOTE FR/EN ; BWY ne comporte aucune offre détaillée (12/10/2026). Les mentions défensives quittent le rendu, l'accessibilité et le mail de
capture. La tagline reste dans RevFooter uniquement (Opening reste inutilisé).
Le générateur llms reprend les six énoncés EN du Standard. Aucun article MDX,
certificat, prix, fait client ou fichier vendorisé modifié.

Nouvelles gates : anti-slop-copy (Playwright + Node) et alignment-grid (Playwright,
1440/375, FR/EN, neuf pages et un article). Deny-all partagé, Cal simulé. Le test
Node fait aussi partie de test:brand-os, déjà exécuté en CI. Tests existants adaptés
aux seules chaînes remplacées ; contrôle anti-slop ajouté au rendu serveur réel.

Validation et limites du sandbox : voir `docs/REPORT-2026-10-11-alignement-anti-slop.md`.
Aucun commit, push ou déploiement dans cette intervention.

## Revue PR #313, 11/10/2026

Les séparateurs de K restent attachés au mot précédent, avec retour possible après
le point médian ; les dates du Journal ne s’étirent plus dans leur grille. Le pied
d’article retrouve « WE FIND THE WAY · date de l’article · PARRIT / JOURNAL ».
Accueil : dossiers consultables en ligne ; /dossiers : summarized. BWY distingue
la description SEO autonome du texte visible. Les assertions Playwright suivent
les nouveaux textes, le point encadré, la suppression du registre et de la mention
produit ; les autres assertions géométriques sont conservées.

L’échec aeration à 390 px reste ouvert : aucun correctif spéculatif, test inchangé.
Chromium est refusé avant navigation (MachPortRendezvousServer, permission denied).
La trace de l’hôte est nécessaire pour établir la cause du timeout de soumission.

Validation de cette reprise : npm ci hors réseau, lint, TypeScript, qa:claims,
qa:brand, build Webpack (57 pages), npm test (107/107) et test:brand-os (23/23)
réussis. Build Turbopack interrompu sans progression. Mesures et clics navigateur
non validés dans ce sandbox. Aucun commit, push ou déploiement.

Décision Paul du 12/10/2026 : retrait de la tagline et des prix, durées et offres détaillées publiques FR/EN ; invitation à un premier échange. Gate anti-offre sur le rendu, les métadonnées et llms.txt, avec exceptions limitées au capital légal et aux faits techniques de synchronisation.

Décision Paul du 12/10/2026, marque unifiée : le site parle au nom de Parrit.ai ; aucun nom de personne hors mentions légales. Auteurs, métadonnées, données structurées, RSS, textes et e-mails de capture utilisent Parrit.ai. La photo et le lien personnel sont retirés du rendu ; les fichiers photo du canon, les identifiants internes, le compte Cal.com et l’adresse de contact sont conservés.

Validation marque unifiée : `npm test` 102/102, `npm run lint` et `npm run qa:brand:rev01` passent. `npm run build` Turbopack a refusé le lien externe node_modules ; après copie locale des mêmes dépendances, il est resté sans progression et a été interrompu. `npm run build -- --webpack` passe sans modification de package.json. Le rendu serveur testé bloque tout réseau sortant et couvre aussi les trois articles corrigés, RSS et llms-full.txt. Playwright reste à lancer par le relecteur sur :3210, selon la spec. Aucun commit ni push.

## Harmonisation design, lot A, 25/10/2026

A1/A3/A4/A5/A6 : H1 home en 500 ; numéros d'étape gris sur encre et canard sur
papier, sans toucher aux marqueurs ProductScene ; suppression des deux ombres
Instrument ; langues en Plex Mono sans cadre ni fond, langue active soulignée
et `aria-current`, cibles de 48 px de haut ; padding de base des boutons par token.
A2 bis (révision 2 validée) remplace le clamp à 48 px rejeté : les H2 de section
utilisent `--d-s` (40 px, 32 px jusqu'à 760 px), y compris la scène à largeur
tablette. Les clôtures restent à 54/34 px ; le seul H2 de Dossiers est une
clôture, donc exempté. Titres de cartes, Journal, H1 et tokens inchangés.
L'audit d'aération compte les actions pleines et au contour ; écart de 12 px,
plancher de 16 px, échelle fermée et chevauchements restent strictement identiques.
Les 17 cas de `tests/design-harmonisation.spec.ts` rejoignent `qa:network:rev01`.
Lint, TypeScript, claims, marque, build Webpack, 102 tests Node et 24 tests Brand OS
passent. Turbopack interrompu sans progression ; Chromium interdit par macOS avant
navigation (MachPortRendezvousServer). Géométrie et interactions à vérifier chez
l'hôte. Le timeout mobile était déjà documenté dans AI_CONTEXT sur origin/main ;
AgentEsquisse, QuickCapture et `measureInvalidFormStates` sont inchangés. La trace
existante montre un bouton encore désactivé après saisie, compatible avec une
course à l'hydratation, sans preuve d'une cause CSS. Diagnostic navigateur bloqué.
Aucun texte public ni contrat vendorisé modifié ; seul le présupposé « actions
pleines » du test d'aération est corrigé, selon l'autorisation de la révision 2.
Détails :
`docs/handoffs/2026-10-25-lot-a-harmonisation-design-rapport.md`.

### Harmonisation design — révision 3, 26/10/2026

La révision 3 remplace A1/A5 ci-dessus : H1 home à 400 ; sélecteur de langue
nommé Langue/Language avec `role="group"` et `aria-pressed` seul. A2 bis et
A3/A4/A6 restent en place. Les deux règles `.r2-std-row .ps` sans consommateur
sont supprimées. Sur Systems, la preuve du hero devient un H2 de carte (22 px,
500), le lien Méthode a une cible de 44 px et les cartes partagent sept lignes
de grille, dont une par rubrique du DL. Les titres et preuves s'alignent en haut
de leur ligne ; les valeurs absentes gardent leur emplacement sans texte ajouté.
Le retrait des cartes rejoint celui de la preuve du hero (24 px desktop,
18 px mobile), supprimant l'écart horizontal de 6 px prévu par l'ancienne CSS.
`design-harmonisation.spec.ts` couvre ces contrats FR/EN à 1440/390 (21 cas).
Lint, types, claims, marque, build Webpack, 102 tests Node et 24 tests Brand OS
passent sur l'état final. Turbopack interrompu après 90 s sans progression.
Chromium est toujours refusé par macOS avant navigation ; les nouvelles mesures
et le timeout mobile préexistant restent à vérifier sur l'hôte. Voir le rapport
du lot pour les résultats de compilation et les contrôles exécutés.

Reprise finale du lot A : état R3 présent conservé après revue, sans nouveau
changement de code ou de test. Lint, types, claims, marque, build Webpack (58
pages), 102 tests Node et 24 tests Brand OS repassent. Turbopack interrompu après
120 s sans progression ; Chromium toujours refusé avant navigation (333 cas
dans la batterie, 21 dans la spec du lot). Résultats et limites actualisés dans
le rapport du lot ; journaux `/private/tmp/lot-a-final-*.log`.

Nouvelle vérification, journaux `/private/tmp/lot-a-verify-*.log` : mêmes résultats
confirmés (lint/types/claims/marque, 102 tests Node, 24 tests Brand OS, build
Webpack 58/58). Code et 21 tests du lot préexistants conservés. Turbopack arrêté
après 120 s sans progression ; Chromium refusé avant navigation. Aucun nouveau
point annulé ; diagnostic du timeout mobile et mesures navigateur toujours ouverts.
