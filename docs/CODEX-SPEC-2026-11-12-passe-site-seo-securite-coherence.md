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
