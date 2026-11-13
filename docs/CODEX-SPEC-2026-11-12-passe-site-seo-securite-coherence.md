# CODEX SPEC — Passe site : cache, en-têtes de sécurité, cohérence du Journal et des appels à l'action

Niveau de risque : moyen (en-têtes HTTP, rendu statique, navigation). Aucun changement de texte commercial, de prix, d'offre ni de design system.

Demande de Paul (12/11/2026) : « vérifie tout ce qui est DNS et bonnes pratiques, fais une passe sur le site d'un point de vue design, cohérence, call to action. L'objectif, c'est de rehausser le niveau. » Audit mené le 12/11 sur le site en ligne (captures 1440 et 390, en-têtes, données structurées). Cette spec ne contient que ce qui est **constaté** et corrigeable sans décision de fond. Les sujets à arbitrer par Paul (pages d'offre, logos, photo) sont hors périmètre.

Coordination : la PR #376 (polissage UI, autre terminal) touche `rev01.css`, `single-page.css`, `system.css` et des tests. Ne pas refaire son contenu (espace chapeau/temps de lecture de l'article, états `:active`, six clients). Partir de `origin/main` ; si #376 est fusionnée entre-temps, se rebaser.

## 1. Les pages ne sont jamais mises en cache (constaté)

`curl -sI https://parrit.ai/fr` et `https://parrit.ai/fr/journal/<slug>` : `cache-control: private, no-cache, no-store, max-age=0, must-revalidate`, `x-vercel-cache: MISS`, `cf-cache-status: DYNAMIC`, à chaque requête. Les articles ont pourtant `generateStaticParams`. Cause probable à confirmer dans le code : `src/proxy.ts` injecte `LOCALE_HEADER` et `PATHNAME_HEADER`, lus côté rendu par `headers()` (layout ou composants), ce qui rend tout l'arbre dynamique.

Objectif : les pages publiques dont le contenu ne dépend que de l'URL sont servies **statiques ou ISR**, avec un `Cache-Control` public :
- `/journal/[slug]` et `/fr/journal/[slug]`, `/journal` et `/fr/journal`, pages de thème du Journal, `/legal` et `/fr/legal` : obligatoire ;
- accueil `/` et `/fr` : souhaité ; si `searchParams` (attribution `?source=`) empêche le statique, déplacer la lecture de l'attribution côté client sans rien perdre (les tests `source`/UTM existants doivent rester verts) ; si ce n'est pas faisable sans régression, laisser l'accueil dynamique et le dire dans le rapport ;
- `/rendez-vous`, `/sketch/[id]` : restent dynamiques.

Contraintes : la langue reste portée par l'URL (jamais par un cookie ou un en-tête pour le contenu) ; la redirection 302 de négociation de langue de `proxy.ts` pour les humains et l'exemption des robots restent inchangées ; `hreflang`, canoniques, sitemap inchangés. Preuve attendue dans le rapport : sortie de build montrant ces routes en `○`/`●` (statique/SSG) et en-têtes `Cache-Control` relevés sur `next start`.

## 2. En-têtes de sécurité absents (constaté)

Seul `strict-transport-security: max-age=63072000` est présent. Ajouter dans `next.config.ts` → `headers()`, pour toutes les routes :
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: SAMEORIGIN` et `Content-Security-Policy: frame-ancestors 'self'` (uniquement cette directive : pas de CSP complète dans ce lot, l'embed Cal.com et les polices demandent un inventaire à part)
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`
Ne pas toucher à HSTS (géré par Vercel ; `includeSubDomains` est une décision de domaine, hors lot). Vérifier que l'embed Cal.com (`app.cal.com` en iframe dans nos pages) et les images OG fonctionnent toujours. Test : une spec qui vérifie la présence des quatre en-têtes sur `/`, `/fr`, un article et `/rendez-vous`.

Ajouter `public/.well-known/security.txt` (Contact : `mailto:` l'adresse de contact déjà publiée sur le site, `Expires` à un an, `Preferred-Languages: fr, en`).

## 3. Redirection cassée (constaté)

`https://parrit.ai/fr/formation` → 301 `https://parrit.ai/formation` → **404**. Corriger en un seul saut vers `/fr#offres` (et `/formation` → `/#offres`), dans `next.config.ts`. Ajouter au test des redirections existant une vérification générique : **aucune** destination de `redirects()` ne répond 404 (parcourir la table).

## 4. Le Journal n'est pas dans la navigation (constaté)

En-tête : Applications, Offres, Le parcours, Services, Questions, Contact. Le Journal n'est accessible que par un bouton en bas d'accueil et par le pied de page, alors que la stratégie d'acquisition repose sur lui. Ajouter « Journal » (EN : « Journal ») dans la navigation de l'en-tête, ordinateur et menu mobile, après « Questions », lien `/fr/journal` (EN `/journal`), état actif sur les pages du Journal. Retirer « Contact » de la liste si la place manque à 1280 px : le bouton « Prendre rendez-vous » pointe déjà sur `#contact` (ne pas modifier ce bouton). Les tests de géométrie de l'en-tête doivent rester verts ; ne pas en assouplir les seuils.

## 5. Index du Journal en français : neuf titres en anglais (constaté)

`/fr/journal` affiche les articles sans traduction avec leur titre anglais (« How to automate legal monitoring with an agent », « MCP (Model Context Protocol): what is it and what is it for? », etc., 9 entrées). Sur l'index FR, n'afficher que les articles qui ont une version française ; les autres restent sur l'index EN. Idem pour la section « Derniers articles » de l'accueil FR et pour les « articles liés » en fin d'article FR. Test : aucun lien de l'index FR ne mène à une page `lang="en"`.

## 6. Article : auteur, dates, formats (constaté)

- Aucune signature visible ; données structurées `Article.author` = Organization. Ajouter sous le chapeau une ligne « Paul Larmaraud, fondateur de Parrit.ai » (EN : « Paul Larmaraud, founder of Parrit.ai ») suivie de « Publié le <date> » et, si `updatedAt` diffère, « Mis à jour le <date> ». Données structurées : `author` = `Person` (`name`, `jobTitle`, `worksFor` → l'organisation par `@id`, `@id` stable `https://parrit.ai/#paul-larmaraud`, le même que le `Person` déjà émis sur l'accueil), `publisher` inchangé.
- Liste des articles liés en fin d'article : dates au format ISO (`2026-08-31`) alors que le reste du site écrit « 31 août 2026 ». Utiliser le même formatage de date localisé que l'en-tête de l'article.
- Ne pas modifier le bloc d'appel de fin d'article ni son libellé.

## 7. Page `/rendez-vous` : le bouton d'en-tête fait quitter la page (constaté)

Sur `/fr/rendez-vous` et `/rendez-vous`, le bouton d'en-tête « Prendre rendez-vous » mène à `/fr?source=rdv-nav#contact`, soit un second calendrier sur une autre page. Sur ces deux routes uniquement, ce bouton pointe sur l'ancre du calendrier de la page courante (même libellé, même style), en conservant les paramètres `source`/`utm_*` présents dans l'URL.

## 8. Tests et batterie

- Ne modifie pas les tests existants, sauf pour y ajouter des cas ; aucun seuil géométrique, de contraste ou de CLS assoupli.
- Batterie : `npm ci --silent && npm run lint && npm run build -- --webpack && npm test`, entièrement verte ; `npm run qa:brand:rev01`. Ne pas committer les PNG réécrits sous `.codex-handoffs/brand-os-p1/after/`. Playwright (`qa:network:rev01`) sera rejoué par Claude sur l'hôte.
- Rapport `docs/REPORT-2026-11-12-passe-site.md` : par point, ce qui est fait, la preuve, ce qui n'a pas pu être vérifié ; pour le point 1, le tableau des routes avec leur mode de rendu avant et après.

---

## Correctif 2 — contrats de tests à aligner sur cette spec (12/11/2026)

Après le tour correctif 1 (hôte : lint et build verts, 540/553), les 13 échecs restants viennent de tests qui décrivent le comportement que cette spec remplace. Exception explicite à « ne modifie pas les tests existants », limitée aux quatre contrats ci-dessous. Chaque test garde toutes ses autres assertions ; l'ancienne attente est remplacée par la nouvelle, jamais supprimée sans remplacement.

1. **Routes françaises propres (§1)** : les tests qui exigent une réécriture interne de `/fr/journal/...`, `/fr/journal/themes/...` ou `/fr/rendez-vous` vers la route anglaise vérifient désormais que la route française répond directement, en français (`lang="fr"`, canonique FR, `hreflang` réciproques), sans redirection ni réécriture. Les redirections en un saut, les 9 `noindex`, les slugs renommés et la conservation de `source`/`utm_*` restent vérifiés tels quels.
2. **Auteur des articles (§6)** : `Article.author` attendu = `Person` (`@id` `https://parrit.ai/#paul-larmaraud`, `name`, `jobTitle`, `worksFor` → organisation par `@id`) ; `publisher` reste l'organisation.
3. **Index français du Journal (§5)** : l'index FR, les « Derniers articles » de l'accueil FR et les articles liés FR n'affichent que les articles traduits (31 aujourd'hui, le nombre se déduit des fichiers `content/journal/fr/`, ne pas l'écrire en dur) ; l'index EN garde les 40. Les listes du lecteur (`journal-data.ts`) ne changent pas.
4. **Navigation (§4)** : l'en-tête attend l'entrée « Journal » à sa place ; l'ordre des couches de l'accueil et tous les autres liens restent vérifiés.

Résultat attendu : `npm test` entièrement vert, deux fois de suite. Lister dans le rapport chaque assertion remplacée (avant, après).

---

## Correctif 3 — paramètres de campagne ajoutés après chargement sur les pages statiques (accord de Paul, 13/11/2026 : « ok cache »)

Après le tour correctif 2 : lint, build et marque verts, `npm test` 552/553 (commit local `c814bad`). Le test restant (`tests/brand-os-render.test.mjs`, « compiled EN/FR pages publish images… », ligne 233, `null !== 'offhome'`) exige que le bouton d'en-tête porte `utm_custom` de la visite dans le HTML initial de `/journal`, `/journal/themes/ai-sprints`, `/journal/what-is-parrit-ai`, `/legal`. C'est incompatible avec le §1 (pages servies en cache). Arbitrage de Paul : le cache l'emporte ; les paramètres `source`/`utm_*` sont ajoutés au bouton **après chargement**, côté navigateur (comportement déjà en place dans `RevHeader.tsx`).

Ordre de travail :

1. **Intégrer `main` d'abord.** Dans ce worktree, `git merge origin/main` (la référence est déjà à jour, aucun accès réseau n'est nécessaire ; les PR #376 polissage UI et #381 y sont). Résoudre les conflits en **conservant intégralement** le contenu de #376 (finitions de `rev01.css`, `single-page.css`, `system.css`, six clients, tests `ui-polish`, `design-md-truth`, `public-clients`, `action-unique`) et en y réappliquant les changements de cette spec. Terminer le commit de fusion. `DESIGN.md` et `DESIGN-SYSTEM.md` font désormais foi et sont testés (`tests/design-md-truth.test.mjs`) : si l'entrée « Journal » dans la navigation ou la signature d'article les contredit, mettre ces documents à jour dans le même geste.
2. **Test aligné** : dans `tests/brand-os-render.test.mjs`, pour les pages statiques (Journal, thèmes, articles, pages légales, EN et FR), l'attente devient : le HTML initial contient le bouton d'en-tête avec son adresse de base (sans paramètre de visite). Pour les pages restées dynamiques (`/`, `/fr`, `/rendez-vous`, `/fr/rendez-vous`), l'attente d'origine (paramètres dans le HTML initial) est **conservée**. Toutes les autres assertions du test restent.
3. **Test navigateur ajouté** (`tests/passe-site.spec.ts`, avec le filet réseau deny-all du dépôt) : sur les quatre pages ci-dessus, en EN et en FR, avec `?source=essai&utm_custom=offhome&utm_campaign=c1`, après hydratation, l'adresse du bouton d'en-tête contient les trois paramètres. Vérifier aussi qu'un paramètre inconnu (hors `source` et `utm_*`) n'est pas recopié, et que la réponse de ces pages porte un `Cache-Control` public sur `next start`.
4. **Résultat attendu** : `npm ci --silent`, `npm run lint`, `npm run build -- --webpack`, `npm run qa:brand:rev01`, `npm test` verts, `npm test` deux fois de suite. Compléter `docs/REPORT-2026-11-12-passe-site.md` (assertion remplacée : avant, après ; routes statiques relevées au build ; conflits résolus et comment). Committer le travail sur la branche courante, sans pousser : Claude rejoue la batterie et Playwright sur l'hôte, puis ouvre la PR.

---

## Correctif 4 — tests navigateur rejoués sur l'hôte (13/11/2026), tour unique

Batterie hôte après le correctif 3 : lint, build, marque et `npm test` verts deux fois ; en-têtes de sécurité présents ; Journal, articles et pages légales servis avec `Cache-Control: s-maxage`. Tests navigateur (`npm run qa:network:rev01`) : **535 passés, 79 en échec**. Journal complet : `/Users/paullarmaraud/codex-work/hote-s-navigateur.log` (à lire ; le bac à sable ne peut pas lancer Chromium, Claude rejoue ensuite sur l'hôte). Cinq causes :

1. **Signature et auteur des articles : retirés de ce lot (40 échecs `anti-slop-copy.spec.ts`, 4 échecs `conformity-journal.spec.ts`).** Le §6 de cette spec contredit une décision datée de Paul (27/10/2026, `TRUTH.md` et `AGENTS.md` : nom et portrait du fondateur autorisés dans la section contact seulement, « le Journal conserve son identité Parrit.ai »). Cette décision n'est pas à Claude ni à Codex : la question est posée à Paul. En attendant :
   - retirer la ligne de signature visible sous le chapeau (et toute mention « Paul », « Larmaraud », « fondateur », « founder » ajoutée par ce lot dans les pages du Journal, texte comme métadonnées) ;
   - remettre `Article.author` = l'organisation, comme sur `origin/main`, et rétablir à l'identique les assertions de tests correspondantes (`tests/entity-graph.test.mjs` et autres) ;
   - **conserver** les dates localisées des articles liés (§6, deuxième point) et tout ce qui ne nomme personne ;
   - l'espace entre chapeau et temps de lecture doit retrouver la valeur vérifiée par `conformity-journal.spec.ts` (« UI polish: deck and reading time have system spacing »), sans toucher à ce test.
   Le contrat 2 du Correctif 2 (« Auteur des articles ») est annulé.
2. **Source du bouton d'en-tête hors accueil (8 échecs `intentions.spec.ts`, 1 échec `conformity-i18n.spec.ts` « header switches paths »).** Le contrat existant est le bon et doit être rétabli : hors accueil, le bouton d'en-tête garde `source=rdv-nav` et ses propres `utm_*` de navigation ; les paramètres de la visite ne remplacent jamais `source`. Retirer `attributionSource` de `AppointmentLink`/`RevHeader`. Sur les pages statiques, après chargement, le bouton doit produire exactement la même adresse que celle que le rendu serveur produisait sur `origin/main` pour la même visite ; lire ces deux tests pour le détail attendu et ne pas les modifier. Corriger en conséquence le test ajouté au Correctif 3 dans `tests/passe-site.spec.ts` (il attendait à tort `source=essai`).
3. **Liens de langue FR/EN sur les pages statiques (2 échecs `conformity-i18n.spec.ts` « source and UTM survive renaming and native … link »).** Sur une page statique, le HTML initial porte le lien de langue sans paramètre de visite ; après chargement, le lien reprend la chaîne de requête de la visite comme avant. Le groupe « without hydration » garde ses assertions pour les redirections de renommage (statut, un seul saut, requête conservée dans l'adresse d'arrivée) ; seule l'attente sur l'attribut `href` du lien de langue d'une page statique sans JavaScript devient « adresse de base », et un cas avec JavaScript vérifie l'adresse complète puis le clic. Les pages dynamiques gardent l'attente d'origine.
4. **Entrée « Journal » dans la navigation (20 échecs `parcours-accueil.spec.ts`, 4 échecs `single-page.spec.ts` « mobile menu panel… »).** Contrat 4 du Correctif 2, côté navigateur : les listes de liens attendues gagnent `/journal` (EN) ou `/fr/journal` (FR) entre « questions » et « contact » ; le menu mobile compte 7 liens. Toutes les autres assertions de ces tests (géométrie du panneau, visibilité de chaque lien, absence de débordement) restent telles quelles et doivent passer : si le septième lien fait déborder le panneau à 390 px ou à 800 px, corriger la mise en page, pas le seuil.
5. **Rapport** : compléter `docs/REPORT-2026-11-12-passe-site.md` (ce qui est retiré et pourquoi, assertions rétablies, assertions alignées avant/après).

Résultat attendu : `npm run lint`, `npm run build -- --webpack`, `npm run qa:brand:rev01`, `npm test` verts deux fois ; commit local sans push. Ne modifier aucun autre test, n'abaisser aucun seuil.

---

## Correctif 5 — deux tests navigateur à aligner sur « ok cache » (13/11/2026), limité à ces deux tests

Rejeu hôte après le correctif 4 : lint, build, marque verts, `npm test` 586/586, tests navigateur **611 passés, 5 en échec**. Les cinq ont la même cause, déjà arbitrée par Paul le 13/11 (« ok cache » : sur une page servie en cache, les paramètres de campagne de la visite sont ajoutés au bouton après chargement ; un visiteur sans JavaScript ne les a pas). La consigne « ne pas modifier ces tests » du Correctif 4 était une erreur de Claude pour ces deux cas précis. Aucun code de production n'est à modifier.

1. `tests/intentions.spec.ts`, groupe « off-home appointment … JS=false » (4 cas, ligne 275) : les quatre routes testées sont des pages statiques. Avec JavaScript, l'attente reste `utm_campaign=navigation`. Sans JavaScript, l'attente devient : aucun `utm_campaign` dans l'adresse du bouton (`null`). Toutes les autres assertions du test restent, dans les deux modes : un seul bouton visible, libellé, chemin, ancre `#contact`, `source` égal à `["rdv-nav"]`, clic, arrivée sur le contact.
2. `tests/conformity-i18n.spec.ts`, « header switches paths, saves choice and preserves query/hash » (ligne 151) : `/fr/legal` est une page statique, le test lit l'attribut `href` avant la fin du chargement. Avant de lire l'adresse, attendre avec une assertion à relance (`toHaveAttribute` avec une expression qui exige `utm_campaign=language`) ; les quatre attentes sur le chemin, l'ancre, `source` et `utm_campaign` restent ensuite inchangées.

Ne toucher à rien d'autre. `npm run lint` et `npm test` verts ; compléter le rapport (deux assertions : avant, après) ; commit local sans push.
