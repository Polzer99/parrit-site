# AI Context

## Architecture actuelle

Site public Parrit.ai : Next.js 16.2.2 (App Router), React 19, TypeScript strict, Tailwind v4. Déploiement Vercel depuis `main`, Node.js 24.x (`.nvmrc`). Lire `AGENTS.md`, puis `TRUTH.md` avant tout changement de contenu ou de conversion. La spec validée `docs/CODEX-SPEC-2026-09-06-site-integral.md` décrit les lots du 06/09/2026.

L'application publique canonique vit dans `src/app/(rev01)/` : `/`, `/manufacture`, `/standard`, `/dossiers`, `/commission`, `/journal`, `/journal/[slug]`, `/journal/rss.xml`, `/legal` et `/sketch/[id]`. Le layout du groupe charge les polices, tokens, styles et la command bar. La home simplifiée porte `QuickCapture` hero et `AgentEsquisse`, puis les métriques et les sections éditoriales. `Opening` reste dans le code mais n’est plus rendu (décision Paul 06/09/2026). Les cinq pages intérieures ont leur copy FR/EN dédié.

Le copy vit dans des dictionnaires `DICT` par page et dans les composants localisés. Depuis le lot GEO/SEO B, les URLs nues rendent toujours l'anglais ; `/fr` et `/fr/{manufacture,standard,dossiers,commission,journal,legal}` rendent le français par rewrite du proxy, sans duplication. Le proxy transmet le chemin public et la locale ; `getLocale()` donne priorité au chemin. La négociation Accept-Language redirige en 302 uniquement les URLs traduites nues, hors bots et hors cookie de choix. Le header pose le cookie puis navigue entre URLs localisées ; `?lang=fr|en` migre en 301 en conservant les autres paramètres. Les articles du Journal et son RSS restent sans variante `/fr`. Canonicals, hreflang réciproques et OG suivent le chemin ; x-default reste anglais. Le sitemap inclut les sept paires (six routes institutionnelles et l'index Journal traduit).

## Canon visuel

Le prototype REV 03 `docs/site-prod-rev01/parrit-command-center-rev03.html` est une référence historique de mise en page ; depuis le 09/09/2026, seuls les tokens bleus de `src/system/tokens.css` font autorité pour les couleurs et `src/system/` les composants. General Sans pour le corps/UI, JetBrains Mono pour le registre technique, Fraunces pour les grands titres éditoriaux. Polices auto-hébergées dans `public/fonts/rev02/` ; polices OG dans `src/og-assets/`.

`BRAND.md`, `docs/design-system/` et `design-source/` sont historiques. Ne pas restaurer la palette crème, les anciens logos, Geist ou IBM Plex. Les images OG lisent les couleurs via `token()` ; `next.config.ts` inclut le CSS et les polices dans leurs bundles. CalInline résout les variables CSS du parent avant de les transmettre à l'iframe externe.

## Conversion et données

`QuickCapture` poste vers `/api/interet`. Sa variante hero propose `idee` optionnelle (300 caractères) ; `src/lib/server/interets.ts` la range dans `metadata.interets_declares[].idee_prototype`. Les écritures métier passent par le serveur ; aucun secret côté client. `RegisterInterest` a été supprimé au lot GEO/SEO A.

`AgentEsquisse` est un échange déterministe local, sans backend ni LLM, avec un événement analytique au premier envoi. `/commission` porte `ParritCalInline` puis une capture standard. `NewsletterCapture` porte l'abonnement sur le Journal et la home. Les esquisses privées `/sketch/[id]` restent noindex et dynamiques ; leur UUID est le jeton d'accès.

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

## Échelle fermée et plancher 14 px, 09/09/2026

Les neuf tailles canoniques vivent dans `tokens.css` (`--t-*`, `--d-*`). Les 102 déclarations de `rev01.css` sont normalisées (dont une reste `inherit`), ainsi que les 19 tailles de `system.css` ; le corps hérite désormais de `--t-m`. Les valeurs absentes du tableau de la spec sont rattachées sans nouveau pas : 26 px à `--t-xl`, 34 px fixe et clamps plafonnés à 30/38 px à `--d-s`, plafonds 76 px à `--d-xl`, 15 px et code `.9em` à `--t-s`, 9.5/12.5 px à `--t-k`.

Les usages CSS de rouge des deux arbres actifs passent par `--accent`/`--accent-p`, alias des valeurs brutes conservées. CalInline et la couleur conditionnelle des esquisses suivent ces alias. Aucun texte affiché ni valeur de couleur modifié.

Tracking réduit pour `.wordmark`, `.cmd-nav a`, `.clock` entre 761 et 1000 px, `.doctrine-code .k` et `.r2-std-row .ps` (media query comprise). Les numéros mobiles `.r2-phase .no` gardent 14 px avec un padding horizontal de 12 px. Les tests d'aération existants ajoutent le plancher strict et les neuf valeurs attendues indépendantes des tokens, tolérance 0.5 px sur les pas fluides ; champs et placeholders inclus.

TypeScript, lint complet et gate de marque passent hors réseau. Le H1 home vaut statiquement 84 px à 1440 ; son override mobile passe de 46.8 à 38 px à 390, et de 68 à 49.152 px à 768. Aucun build, navigateur, port ou commit exécuté. Claude doit encore passer la batterie et regarder les trois largeurs, surtout la command bar tablette, les en-têtes de Manufacture, les sceaux du Standard et des dossiers, les libellés Cal et le hero mobile. Les routes Journal et les esquisses restent hors des huit routes du test d'aération prescrit.

## Accent bleu, 09/09/2026

Décision Paul sur conseil de Bénédicte : suppression du rouge. `--accent` remplit et sert sur papier, `--accent-p` porte le pressé, `--accent-clair` sert au texte, aux cadres et au focus sur fond sombre. Les composants partagés ont des variantes contextuelles ; la newsletter du Journal reste sur papier car `.ri-stage` est transparent. Les lectures OG des anciens tokens sont migrées. Le favicon SVG prend le profond demandé ; le lockup legacy est supprimé.

La gate de marque refuse les hex rougeâtres dans src/ et les SVG de public/, avec exceptions explicites pour camp-costa-rica et docs. PNG inchangés : Claude doit les régénérer, passer build et tests navigateur et regarder les rendus. Cal conserve le profond pour sa couleur de marque partagée ; ses usages internes dans l'iframe sont à vérifier visuellement.

Vérification locale : lint complet, TypeScript sans émission, gate de marque et mutations anti-rouge isolées passent. Comparaison statique : déclarations CSS hors couleur inchangées, TSX limité aux noms de classe et tokens de couleur. Aucun réseau, port, build, navigateur ou commit.

## Contraste des actions remplies, 09/09/2026

La claire vit sur le carbone, remplissages inclus. Les surfaces transmettent `--action-fill`, `--action-pressed` et `--action-text` ; les documents clairs imbriqués rétablissent le profond. Le pressé sombre utilise `--accent-clair-p` (#6399E6), texte ink. Navigation, captures, agent, clôtures et remplissage progressif Hold suivent ce contexte.

Le contrôle dans `tests/aeration.spec.ts` compare le fond effectif de chaque contrôle interactif rempli à celui de son conteneur, seuil 3:1, avec composition alpha et opacité des ancêtres. Il inclut les champs et contrôles désactivés ; aucune exemption par classe. Les huit routes EN/FR et deux largeurs existantes restent le périmètre. Les images de fond non résolues font échouer le contrôle. Exécution navigateur interdite pour ce lot ; des défauts de champs peuvent donc encore être révélés.
