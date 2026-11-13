# Passe site : cache, sécurité et cohérence — 12/11/2026

## État de livraison

Les sept points produit de la spec sont implémentés. **Tour correctif 1 : 540/553 tests passent ; 13 restent bloqués par des contrats incompatibles avec la spec.** La batterie n’est pas entièrement verte ; la branche n’est pas prête à déployer. Aucun commit, push, merge ou déploiement effectué. Le détail actualisé est dans la section « Tour correctif 1 » ci-dessous ; les résultats du premier passage sont conservés comme historique.

Mandat : `docs/CODEX-SPEC-2026-11-12-passe-site-seo-securite-coherence.md`. Plan : `docs/passe-site/plan.md`.
Base HEAD = origin/main local = `8785098e452d963d5ff76c1ae00493cea76dd1c4`. La spec non suivie était le seul changement initial ; son SHA256 est resté identique. `git ls-remote origin refs/heads/main` échoue par résolution DNS de github.com : fraîcheur distante et fusion éventuelle de #376 non vérifiables. Aucun rebase effectué. Les trois CSS de #376, les six clients, les logos et le corpus Journal sont intacts.

## 1. Cache et langue de l'URL

**Fait / source / fraîcheur / preuve** : le code initial appelait `headers()` et `cookies()` via `src/lib/server/locale.ts` depuis le layout et les pages ; build de référence exécuté ici le 12/11 : toutes les pages concernées en ƒ. Documentation lue : Next installé 16.3.4 (`internationalization`, `layout`, `headers`, configuration HTTP), Context7 Next 16.3.6.

Les rendus sont partagés dans `src/system/pages/{layout,home,journal,article,theme,legal,booking}.tsx`. Les entrées anglaises restent dans `src/app/(rev01)/`. Les entrées françaises et leur racine HTML explicite sont dans `src/app/(fr)/fr/`. Le préfixe URL choisit donc la langue au routage, sans aucune API de requête dans le rendu. Le lecteur Journal, ses originaux et ses traductions ne sont pas modifiés. Les includes de tracing couvrent les deux arbres.

Le proxy laisse passer ces routes sans réécriture vers l'anglais ; ses redirections 302 de négociation, exemptions robots, cookie de choix, Vary et redirections legacy sont conservés. Les en-têtes internes restent écrasés par le proxy, mais aucun rendu ne les consomme. Les tests envoient volontairement de faux en-têtes et cookies à chaque route compilée : le HTML et ses métadonnées restent dans la langue URL.

| Routes | Avant | Après | Cache observé sur le renderer compilé |
|---|---|---|---|
| `/journal`, `/fr/journal` | ƒ, FR réécrit vers EN | ○ / ○ | `s-maxage=31536000` |
| `/journal/[slug]`, `/fr/journal/[slug]` | ƒ, FR réécrit vers EN | ●, 40 EN / 31 FR | `s-maxage=31536000` |
| `/journal/themes/[theme]`, `/fr/journal/themes/[theme]` | ƒ | ●, 4 par langue | `s-maxage=31536000` |
| `/legal`, `/fr/legal` | ƒ | ○ / ○ | `s-maxage=31536000` |
| `/`, `/fr` | ƒ | ƒ / ƒ | `private, no-cache, no-store, max-age=0, must-revalidate` |
| `/rendez-vous`, `/fr/rendez-vous` | ƒ | ƒ / ƒ | même valeur privée |
| `/sketch/[id]` | ƒ | ƒ | non interrogé : lecture métier hors test |

Le Cache-Control standard de Next utilise `s-maxage` pour autoriser le cache partagé, sans mot `public` explicite. Aucun en-tête cache artificiel ne masque un rendu dynamique. L'accueil reste volontairement dynamique : `searchParams` sert les liens attribués dès le HTML, y compris sans JavaScript. Les UTM répétés et les quatre sources existantes sont préservés.

**Limite obligatoire** : `npm run start -- -p 3210` échoue avec `listen EPERM: operation not permitted 0.0.0.0:3210`. Les valeurs ci-dessus proviennent du vrai NextServer de production avec requêtes/réponses en mémoire, réseau totalement interdit ; ce n'est pas un relevé HTTP sur `next start`. Le cache Vercel/Cloudflare et la géométrie doivent être prouvés sur l'hôte.

### Sortie du build candidat

```text
Route (app)
┌ ƒ /
├ ○ /_not-found
├ ƒ /api/interet
├ ƒ /api/interet/projection
├ ○ /apple-icon.png
├ ƒ /fr
├ ○ /fr/journal
├   /fr/journal/[slug]
│ ├ ● /fr/journal/ai-cost-french-vs-english-tokens
│ ├ ● /fr/journal/hook-timeout-lets-tool-call-through
│ ├ ● /fr/journal/legacy-database-migration-writers-first
│ └ ● [+28 more paths]
├   /fr/journal/themes/[theme]
│ ├ ● /fr/journal/themes/harness-engineering
│ ├ ● /fr/journal/themes/ai-sprints
│ ├ ● /fr/journal/themes/integration-developpement
│ └ ● /fr/journal/themes/conseil-transformation
├ ○ /fr/legal
├ ƒ /fr/rendez-vous
├ ○ /icon.png
├ ○ /journal
├   /journal/[slug]
│ ├ ● /journal/ai-cost-french-vs-english-tokens
│ ├ ● /journal/hook-timeout-lets-tool-call-through
│ ├ ● /journal/legacy-database-migration-writers-first
│ └ ● [+37 more paths]
├ ƒ /journal/[slug]/og
├ ƒ /journal/rss.xml
├   /journal/themes/[theme]
│ ├ ● /journal/themes/harness-engineering
│ ├ ● /journal/themes/ai-sprints
│ ├ ● /journal/themes/integration-developpement
│ └ ● /journal/themes/conseil-transformation
├ ○ /legal
├ ƒ /llms-full.txt
├ ƒ /opengraph-image
├ ƒ /rendez-vous
├ ○ /robots.txt
├ ○ /sitemap.xml
└ ƒ /sketch/[id]


ƒ Proxy (Middleware)

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand


```

## 2. Sécurité

`next.config.ts` applique globalement les cinq en-têtes demandés : nosniff, Referrer-Policy, SAMEORIGIN, CSP `frame-ancestors 'self'` et Permissions-Policy. HSTS n'est pas modifié. La CSP n'ajoute aucune restriction de chargement des iframes, scripts, images ou polices.

`public/.well-known/security.txt` publie l'adresse déjà présente dans les mentions légales, `paul.larmaraud@parrit.ai`, expiration `2027-11-12T00:00:00Z`, langues fr/en.

Preuves : huit tests de configuration sur accueil FR/EN, articles FR/EN, réservation FR/EN, OG et security.txt. Les tests OG historiques exécutent les générateurs avec réseau interdit et restent verts. Six tests navigateur supplémentaires contrôlent les réponses HTTP réelles ; deux chargent le SDK Cal installé et une iframe servie par mock sous la CSP. Ils sont recensés, mais non exécutés ici. Aucun appel à Cal réel.

## 3. Formation et table de redirections

`/formation` → `/#offres`, `/fr/formation` → `/fr#offres`, 308 permanents en un saut. L'anglais utilisait `#offers` : une ancre alias `offres` sur le div existant dans `SinglePage.tsx` préserve les deux destinations, sans nouvel élément ni changement de géométrie.

Le cas ajouté à `tests/site-v1-routing.test.mjs` parcourt toute la table, développe les destinations `:slug` avec le corpus existant, rend les destinations compilées et vérifie HTTP 200 **et existence du fragment**. Aucun cas arbitraire inexistant n'est prétendu valide. Test vert.

La sérialisation réelle Next de la requête avant le fragment est vérifiée. L'utilitaire expérimental de test Next place incorrectement la query après le fragment : ce contrôle utilise donc `prepareDestination`, `stringifyQuery` et le formatage URL de production, plus le test de statut/redirection sans query. Aucun changement du routeur pour compenser ce défaut de l'utilitaire.

## 4. Navigation Journal

`RevHeader.tsx` ajoute Journal après Questions dans les deux navigations, liens localisés, `aria-current=page` sur index/articles/thèmes. `header-navigation.css` fournit un soulignement contextuel sans impact sur les dimensions. Contact conservé ; le bouton de rendez-vous garde style et texte. Quatre cas navigateur vérifient FR/EN à 1280 et 390 px, état actif, alignement à 1 px et absence de débordement. Mesures encore non exécutées ; aucun seuil historique modifié.

## 5. Listes françaises

Index, derniers articles de l'accueil, articles liés et thèmes filtrent leur liste FR via `hasFrenchJournalTranslation`. La fonction historique de lecture conserve son comportement et l'index EN garde les 40 articles. Tests de listes FR/EN et rendu compilé des 31 éditions françaises verts ; chaque édition FR compilée reste `lang=fr`, canonique et alternates inchangés.

## 6. Signature, dates, graphe

`article.tsx` ajoute la signature Paul Larmaraud et la date de publication sous le chapeau. La date de modification n'est visible que si différente. Pour les articles machine, `JournalMachineBody` place cette ligne sous leur vrai premier paragraphe, sans répéter la description de métadonnées. Les 12 tests additionnels couvrent FR/EN, article classique/machine, date absente/égale/distincte. Les dates des liens suivants utilisent le même formateur localisé UTC.

`jsonld.ts` partage `founderPerson` entre l'accueil et Article : `https://parrit.ai/#paul-larmaraud`, name, jobTitle localisé, worksFor par @id. Le code antérieur utilisait en réalité `#founder` sur l'accueil et certains articles machine ; cet identifiant est remplacé des deux côtés conformément à la valeur explicite de la nouvelle spec. Publisher inchangé. Métadonnée authors alignée. Les corps historiques et l'appel de fin d'article sont conservés ; la signature finale existante des articles machine reste elle aussi intacte.

## 7. Réservation

Sur les seules routes rendez-vous, le bouton d'en-tête est un lien natif `#reservation` vers le wrapper du calendrier. Il conserve intégralement la query courante, même sans JavaScript, sans écraser `source` par `rdv-nav`. Les autres pages gardent leur bouton existant. Preuve : HTML compilé FR/EN et résolution d'URL, deux tests navigateur avec JS et deux sans JS, ces derniers à rejouer sur hôte.

## 8. Tests et résultats

| Commande / contrôle | Référence | Candidat final |
|---|---:|---:|
| `npm ci --silent` | réussi | réussi |
| `npm run lint` | — | réussi sans avertissement |
| `npm run build -- --webpack` | réussi | réussi, 96 pages générées |
| `npm test` | **519/519** | **527/553**, 26 échecs |
| nouveaux tests Node | — | **34/34** |
| `npm run qa:brand:rev01` | — | réussi |
| `npm run qa:claims:rev01` | — | réussi |
| `npm run test:brand-os` | inclus dans suite de référence | **16/19**, 3 échecs inclus dans les 26 |
| `npx tsc --noEmit` | — | réussi |
| nouveaux Playwright `--list` | — | **14 cas** recensés |
| `next start` | — | bloqué par EPERM |

Le candidat a été rejoué avec la chaîne exacte `npm ci --silent && npm run lint && npm run build -- --webpack && npm test` : les trois premières étapes passent ; la dernière échoue. Aucun test supprimé, désactivé ou assertion existante modifiée. Le seul fichier de test historique modifié reçoit un import et un cas supplémentaires.

Tests ajoutés :
- `tests/passe-site.test.mjs` : 30 contrats et rendus ciblés.
- `tests/passe-site-render.test.mjs` : 3 tests de manifeste, rendu compilé/cache et attribution.
- ajout à `tests/site-v1-routing.test.mjs` : 1 test exhaustif des destinations.
- `tests/helpers/compiled-site.mjs` : harness production avec fermeture réseau globale.
- `tests/passe-site.spec.ts` : 14 cas navigateur avec deny-all ; ajoutés à `qa:network:rev01` dans package.json. La batterie navigateur complète est réservée à Claude sur l'hôte, conformément à la spec.

### Pourquoi les 26 échecs restent visibles

La spec impose simultanément les nouveaux contrats et l'interdiction de modifier les assertions historiques. Une demande ciblée d'autorisation d'adapter ces assertions a été présentée ; aucune réponse reçue pendant cette exécution. Elles restent intactes.

Les catégories :
- tests qui imposent le rewrite FR vers EN ou rendent la route EN en injectant un en-tête FR ; la langue est maintenant portée par deux vraies routes ;
- tests qui exigent auteur Organization / ancien Person `#founder`, six liens de navigation ou les 40 entrées dans l'index FR ;
- tests de source/mocks fermés qui lisent directement les fichiers déplacés vers `src/system/pages`, ou rendent la racine EN en attendant du FR ;
- **un nouveau défaut révélé du corpus historique** : le scan Brand OS voit désormais les HTML statiques des articles. `automated-invoicing-with-ai` EN et FR contient « → » dans une phrase ; `malicious-mcp-server-after-install` EN contient « ✓ ». Ces glyphes existaient déjà mais les pages dynamiques n'entraient pas dans `prerenderedPages`. Ni le corpus, ni le scanner, ni les contrats vendorisés n'ont été changés pour masquer cet échec.

Fichiers des tests en échec :
- `tests/audit-truth-copy.test.mjs`
- `tests/booking-render.test.mjs`
- `tests/brand-os-contracts.test.mjs`
- `tests/brand-os-render.test.mjs`
- `tests/brand-os.test.mjs`
- `tests/entity-graph.test.mjs`
- `tests/intentions.test.mjs`
- `tests/journal-fr-routes.test.mjs`
- `tests/journal-language-note.test.mjs`
- `tests/journal-machine-rendering.test.mjs`
- `tests/langue-metier.test.mjs`
- `tests/parcours-accueil.test.mjs`
- `tests/privacy-corrections.test.mjs`
- `tests/site-v1-routing.test.mjs`

Les anciens tests pourraient cacher d'autres assertions incompatibles après leur première erreur ; le nombre 26 décrit les cas actuellement en échec, pas une garantie sur la future adaptation. Les nouveaux tests ne remplacent pas la batterie historique et ne prouvent pas sa réussite.

## Revue et limites de preuve

Revue indépendante selon le harnais du dépôt : alias `offres`, état actif visible et position de signature machine corrigés. Seconde revue : 34/34 nouveaux tests rejoués, aucun nouveau défaut produit concret identifié. Aucun seuil de géométrie, contraste ou CLS assoupli. Aucun PNG sous `.codex-handoffs/brand-os-p1/after/` modifié. Pas de données métier écrites, aucun appel LLM, aucune requête sortante dans les nouveaux tests.

Restent à obtenir : adaptation autorisée des seuls contrats de test remplacés et de leurs chemins/mocks, arbitrage des glyphes historiques sans contourner Brand OS, preuve navigateur/Cal et en-têtes sur `next start`, état distant #376. Aucune preuve de production revendiquée.

Journaux locaux : `/tmp/passe-site-baseline-{build,test}.log`, `/tmp/passe-site-final-{install,lint,build,test,brand,claims,brand-os,types}.log`, `/tmp/passe-site-{new-test,render,redirects,start,playwright-list,remote}.log`.


## Tour correctif 1

Mandat de Paul du 12/11/2026 : reprendre le worktree, rendre la suite verte sans
modifier les assertions, sauf repointage des fichiers déplacés ; corriger les
glyphes historiques dans leur contenu ou rendu ; conserver la spec et ne pas
committer. La spec est vérifiée par SHA256 avant/après. Référence reproduite :
**527/553**, mêmes 26 échecs que `/tmp/claude-501/passe-echecs.txt`.

Écritures limitées au worktree local, sans donnée métier ni effet externe.
Sauvegarde avant correction : `/tmp/passe-correctif1-before.tar.gz` ; retour
possible fichier par fichier sans perdre le travail préexistant. Deux passes
ciblées, puis batterie finale ; aucun appel LLM produit ni service réel.
Documentation de routage : Next installé 16.3.4, guide internationalisation et
proxy ; Context7 `/vercel/next.js/v16.3.6`, rendu statique et API de requête.

### Corrections réalisées et limites

Les fichiers extraits sont désormais lus à leur emplacement réel par les tests
concernés. Pour le layout commun, le banc transmet explicitement `locale`, comme
les deux points d’entrée de production ; les contrôles de langue, JSON-LD et
absence de PostHog sont inchangés. Le contrôle des métadonnées de l’accueil FR
charge le layout de `src/app/(fr)/fr/layout.tsx`. Les rendus compilés Brand OS et
articles utilisent la vraie URL française, au lieu d’une URL EN assortie d’un
en-tête FR. Les assertions de ces rendus sont conservées.

Les imports CSS du layout commun utilisent les chemins relatifs historiques,
qui résolvent les mêmes fichiers dans leur même ordre : tokens vendorisés, puis
adaptation du site. Aucun changement des routes OG, des valeurs CSS ni de leur
traçage. Les contrôles OG sont verts.

Le filtrage français reste dans les pages. L’essai consistant à le déplacer dans
`getAllJournalEntrySummaries` a été annulé :
`journal-translations.test.mjs`, « localized reader keeps the original order… »,
impose que les listes du lecteur gardent les mêmes 40 slugs en FR et EN, et
`intentions.test.mjs` impose que les résumés gardent tous leurs champs et le même
nombre d’entrées. Aucun changement final de `journal-data.ts`.

### Les 26 échecs de référence

« Chemin » indique une correction du fichier/URL chargé par le banc, sans
changement de son assertion. « Bloqué » indique une assertion conservée qui
exige un comportement contraire à la spec ; ce n’est pas un test réussi.

| # | Test de référence | Cause vérifiée | Action / état |
|---|---|---|---|
| 1 | `31 translated routes, 9 noindex redirects…` | Exige encore un rewrite `/fr/journal/...` vers `/journal/...`. | Bloqué : les routes FR statiques sont désormais des destinations propres ; redirections et attribution existantes non modifiées. |
| 2 | `actual layout renders no PostHog script (en)…` | Mock fermé lisant l’ancien wrapper au lieu du layout extrait. | Chemin `src/system/pages/layout.tsx`, locale explicite ; vert. |
| 3 | `actual layout renders no PostHog script (fr)…` | Même cause. | Même correction, locale FR ; vert. |
| 4 | `all prerendered text uses supported glyphs and no font arrows` | Huit flèches dans deux articles et coche du badge. | Contenu + rendu corrigés ci-dessous ; vert. |
| 5 | `Article d’un vrai article : graphe lié…` | Attend exactement un auteur Organization ; §6 exige Person. | Bloqué, assertion conservée. |
| 6 | `both OG routes bundle both CSS inputs and share the resolver` | Lit les imports dans l’ancien wrapper. | Chemin du layout partagé + chemins d’import relatifs valides dans le code ; vert. |
| 7 | `compiled bilingual articles render the complete correct edition…` | Envoie une URL EN même pour tester le FR. | URL `publicPath`, vraie route FR ; comparaison intégrale du corps et métadonnées inchangée ; vert. |
| 8 | `compiled booking funnel, bilingual interface…` | Exige un rewrite FR vers EN avant même de rendre la réservation. | Bloqué : routes propres FR, assertion conservée. |
| 9 | `compiled EN/FR pages publish images, content structure and supported glyphs…` | URL EN pour les deux langues ; après correction, exige 40 cartes FR contre 31 traduites. | URL corrigée ; reste bloqué sur le nombre de cartes imposé par le test. Aucun contrôle de glyphes retiré. |
| 10 | `home metadata and Organization/Person JSON-LD… (fr)` | Charge le layout EN, lequel impose légitimement `locale="en"`. | Chemin du layout FR ; métadonnées et graphe contrôlés sans modifier les assertions ; vert. |
| 11 | `Journal index renders only registered themes and localized reading time (fr)` | Compare les 31 cartes FR aux 40 entrées du lecteur historique. | Bloqué : §5 exige 31 cartes ; modifier le lecteur violerait aussi ses tests de contrat existants. |
| 12 | `language notice… (en, certified=false)` | Mock fermé lisant le wrapper au lieu de l’article extrait. | Chemin `src/system/pages/article.tsx` ; vert. |
| 13 | `language notice… (en, certified=true)` | Même cause. | Même chemin ; vert. |
| 14 | `language notice… (fr, certified=false)` | Même cause. | Même chemin ; vert. |
| 15 | `language notice… (fr, certified=true)` | Même cause. | Même chemin ; vert. |
| 16 | `layered home order, definition and navigation (en)` | L’ordre des couches passe ; la liste exacte de navigation interdit le nouveau lien Journal. | Bloqué : §4 exige Journal après Questions. |
| 17 | `layered home order, definition and navigation (fr)` | Même cause. | Bloqué ; aucune modification des couches ou de leurs assertions. |
| 18 | `legal identity remains accurate` | Lit le wrapper vide de contenu. | Chemin du rendu légal partagé ; identité inchangée ; vert. |
| 19 | `legal page discloses Cloudflare… (en)` | Mock fermé lisant le wrapper. | Chemin du rendu légal partagé ; mention Cloudflare inchangée ; vert. |
| 20 | `legal page discloses Cloudflare… (fr)` | Même cause. | Même chemin ; vert. |
| 21 | `new article renders answer, optional table… (en)` | Réponse, tableau et sources passent ; auteur attendu exactement `#founder`, contre Person `#paul-larmaraud` avec `jobTitle`/`worksFor` (§6). | Bloqué. La même fonction est contrôlée avec l’identité opposée par les nouveaux tests de la passe. |
| 22 | `new article renders answer, optional table… (fr)` | Même cause ; une assertion ultérieure exige aussi la première signature après les sources. | Bloqué ; §6 exige la signature sous le chapeau. FAQ, sources, réponse et tableau ne sont pas supprimés. |
| 23 | `proxy serves and negotiates both languages for ai-sprints` | `new URL(null)` sur le rewrite retiré, avant les assertions de négociation. | Bloqué ; il ne s’agit pas d’un échec observé de la négociation 302. |
| 24 | `proxy serves and negotiates both languages for conseil-transformation` | Même cause. | Bloqué, assertion conservée. |
| 25 | `proxy serves and negotiates both languages for harness-engineering` | Même cause. | Bloqué, assertion conservée. |
| 26 | `proxy serves and negotiates both languages for integration-developpement` | Même cause. | Bloqué, assertion conservée. |

### Remplacements typographiques exhaustifs

Deux contenus historiques changent, sans modification de leur frontmatter,
dates, liens, chiffres ou sens. Chaque flèche U+2192 est remplacée par une
articulation textuelle exprimant la même succession. Les huit occurrences :

| Fichier | Transition originale | Remplacement |
|---|---|---|
| `content/journal/automated-invoicing-with-ai.mdx:12` | `complete → create` | `complete, then create` |
| même fichier | `(if you remember) → send` | `(if you remember), then send` |
| même fichier | `(if you have time) → check` | `(if you have time), then check` |
| même fichier | `(if you think of it) → reconcile` | `(if you think of it), then reconcile` |
| `content/journal/fr/automated-invoicing-with-ai.mdx:13` | `terminée → créer` | `terminée, puis créer` |
| même fichier | `si vous y pensez → l’envoyer` | `si vous y pensez, puis l’envoyer` |
| même fichier | `si vous avez le temps → vérifier` | `si vous avez le temps, puis vérifier` |
| même fichier | `si vous vous en souvenez → faire` | `si vous vous en souvenez, puis faire` |

La coche U+2713 n’était **pas** dans l’article historique
`malicious-mcp-server-after-install` : elle venait de
`src/system/components/HarnessBadge.tsx`. Le libellé anglais passe de
`Harness Certified ✓` à `Harness Certified`. La signification, le lien de preuve
et le contrôle du certificat sont conservés. Les octets de l’article certifié
et de tous les certificats restent identiques. Cette vérification corrige le
diagnostic trop large du rapport initial sur le « corpus historique ».

### Arbitrage restant et preuves

Une demande d’autorisation ciblée a été présentée à Paul pour aligner les seuls
contrats explicitement remplacés par la spec. Aucune réponse n’a été reçue à
ce stade. Leur modification n’est donc pas exécutée. Les contrôles ne sont ni
supprimés, ni ignorés, ni rendus conditionnels ; aucune donnée ou comportement
spécial de production n’est ajouté pour tromper les bancs.

La revue indépendante a confirmé les contradictions sur l’auteur, la navigation,
les réécritures et la position de signature machine. La suite exacte ne peut pas
être entièrement verte en conservant simultanément ces assertions et la spec.
Les échecs sont laissés visibles ; les premières erreurs peuvent en masquer
d’autres, notamment dans les longs tests compilés.

Batterie finale et journaux : voir résultats ci-dessous. Aucun navigateur, cache
hébergeur ni déploiement de production n’est présenté comme vérifié.


### Batterie finale du tour correctif 1

Exécutée dans l’ordre demandé, après toutes les corrections de code/tests :

| Commande | Résultat |
|---|---|
| `npm run lint` | Vert, aucune erreur ni avertissement ESLint. |
| `npm run build -- --webpack` | Vert, 96 pages ; Journal, articles, thèmes et mentions légales restent statiques/SSG en FR et EN. |
| `npm test` | **540/553**, 13 échecs conservés ; 0 ignoré, 0 annulé. |
| `npm run qa:brand:rev01` | Vert. |
| `npm run test:brand-os` | **18/19** ; glyphes verts, seul le contrôle compilé attend encore 40 cartes dans l’index FR. |
| `git diff --check` | Vert. |

Gain constaté : **13 des 26 échecs résolus**, aucun nouvel échec dans la batterie
finale. L’objectif « npm test entièrement vert » n’est pas atteint. Il reste
6 attentes de réécriture, 3 d’identité d’auteur, 2 de navigation sans Journal,
et 2 d’index FR à 40 cartes. Aucun changement silencieux de contrat.

Logs : `/tmp/passe-correctif1-final-lint.log`,
`/tmp/passe-correctif1-final-build.log`, `/tmp/passe-correctif1-final-test.log`,
`/tmp/passe-correctif1-brand.log`, `/tmp/passe-correctif1-brand-os.log`.
Référence : `/tmp/passe-correctif1-baseline.log`.
La comparaison finale confirme : spec inchangée, certificats inchangés,
aucun PNG modifié et aucun commit effectué.


## Tour correctif 2

Mandat du 12/11/2026 : appliquer exclusivement les quatre contrats du correctif 2,
conserver toutes les autres assertions, obtenir deux suites complètes vertes,
lint et build Webpack verts ; aucun commit. La spec canonique de
`/Users/paullarmaraud/parrit-site/docs/` remplace intégralement la copie locale.
SHA256 identique : `0dd142e6c85a23fba85845d1aa4939ceece41199d7fc20d8a1c2302e1d677e99`.

Référence : branche `codex/docs-CODEX-SPEC-2026-11-12-passe-site-seo-securite`,
HEAD `8785098e452d963d5ff76c1ae00493cea76dd1c4`, avec les modifications des tours
précédents conservées. Référence rejouée : **540/553**, 13 échecs.
Source des faits : spec canonique lue ce tour, fichiers du worktree demandé,
HTML compilé et journaux de commandes du même tour ; aucun état distant inféré.

Écritures : worktree local de développement, huit fichiers de tests, copie de
spec, présent rapport et résumé AI_CONTEXT. Aucune écriture métier (0 ligne),
aucun code produit modifié ce tour. Retour réversible fichier par fichier depuis
`/private/tmp/passe-site-c2-before.tar.gz` ; empreintes de référence dans
`/private/tmp/passe-site-c2-before-sha.json`. Ne pas réinitialiser le worktree,
qui contient les apports précédents. Boucle bornée : référence, corrections
ciblées, revue indépendante, batterie et second passage ; arrêter sur une
contradiction hors mandat. Aucun appel LLM produit ni service réel.

### Chaque assertion remplacée : avant et après

Les numéros ci-dessous identifient les remplacements, pas des suppressions de
tests. Les attentes EN restent inchangées sauf le contrat d'auteur explicitement
bilingue. Les 31 traductions et 40 originaux sont des constats du corpus actuel,
pas des nouvelles constantes de tests.

| # | Fichier / assertion | Avant | Après | Contrat |
|---|---|---|---|---|
| 1 | `journal-fr-routes.test.mjs`, réponse proxy des articles FR traduits | `x-middleware-rewrite = /journal/<slug>?<query>` | En-tête de rewrite nul, aucun `Location`, réponse 200 ; langue et chemin FR transmis restent contrôlés. Le rendu compilé des deux éditions vérifie aussi absence de rewrite/redirection, query conservée, `lang`, canonique et alternates réciproques. | 1 |
| 2 | `booking-render.test.mjs`, réservation FR | Rewrite vers `/rendez-vous?source=journal-test&utm_source=x` | Aucun rewrite ni redirection ; rendu direct de l'URL `/fr/rendez-vous` avec sa query, HTML `lang=fr`, canonique FR et alternates fr/en/x-default réciproques. Les réponses du moteur n'ont ni `Location` ni rewrite. | 1 |
| 3 | `site-v1-routing.test.mjs`, quatre thèmes, chemin de rewrite | `new URL(rewrite).pathname === route EN` | Réponse proxy 200, sans rewrite ni redirection ; chemin de requête FR inchangé ; rendu réel FR et EN, 200, langue de l'URL, canoniques propres et alternates réciproques. | 1 |
| 4 | Même fichier, query du rewrite des quatre thèmes | `rewrite.search === ?source=qa` | Query de la requête directe inchangée, avec `source=qa`, UTM encodé et UTM répété ; cette même query atteint le rendu. Attentes de négociation 302, robots, cookie, ancienne query `lang=en` et redirections 301/308 inchangées. | 1 |
| 5 | `entity-graph.test.mjs`, égalité complète du graphe Article réel | `author: orgRef()` | Objet Person exact : `#paul-larmaraud`, nom Paul Larmaraud, `jobTitle: Founder`, `worksFor.@id = #organization`. Tous les autres champs du graphe, dont publisher complet, inchangés. | 2 |
| 6 | `journal-machine-rendering.test.mjs`, auteur FR/EN | Person avec `#founder` et nom seuls | Person avec `#paul-larmaraud`, même nom, `Fondateur`/`Founder` et `worksFor` vers `#organization`. | 2 |
| 7 | Même fichier, position de la première signature FR/EN | Sources avant première occurrence de « Paul Larmaraud, » | Signature immédiatement après le paragraphe de chapô, avant le premier H2 et les sources, conformément au §6. Assertion d'identité visible conservée ; publisher Organization et relation worksFor ajoutés. FAQ, tableau, sources, dates et unique lien de réservation inchangés. | 2, §6 |
| 8 | `brand-os-render.test.mjs`, anonymat des trois articles contrôlés | Aucune occurrence du nom/fondateur dans HTML, métadonnées et JSON-LD, hors bloc d'appel existant | Auteur Person, publisher Organization, signature unique et deux métadonnées auteur contrôlés précisément ; seules ces occurrences exactes sont exclues de l'ancienne regex d'anonymat. La regex reste appliquée au reste, notamment les durées interdites. RSS, llms-full et interdiction du site personnel restent inchangés. | 2 |
| 9 | Même fichier, nombre de cartes de l'index | Nombre d'originaux EN pour les deux langues | Nombre de fichiers MDX du dossier de la langue (`content/journal/fr/` pour FR, racine pour EN). Égalité exacte des ensembles de slugs ajoutée. Les contrôles de destination, langue, titre localisé et absence d'étiquette EN restent. | 3 |
| 10 | `intentions.test.mjs`, cartes de l'index et leurs champs | Toutes les entrées du lecteur en FR comme en EN | Attentes FR filtrées par les noms des fichiers MDX français, attentes EN intégrales. Les assertions de nombre de lignes, lien unique, destination, titre, description, durée et thèmes restent appliquées à chaque entrée attendue. | 3 |
| 11 | `parcours-accueil.test.mjs`, trois derniers articles et leurs champs | Les trois premières entrées du lecteur non filtré | Les trois premières entrées traduites en FR, originaux en EN ; filtre déduit des fichiers FR. Le contrôle de tri du lecteur entier est conservé, ainsi que nombre de cartes, lien unique, date, titre, durée, thèmes et lien index. | 3 |
| 12 | Même fichier, égalité exacte de navigation FR/EN | Applications, Offres, Parcours, Services, Questions, Contact | Même séquence avec Journal après Questions et avant Contact ; destination localisée. Les assertions d'ordre des couches et de définition restent inchangées. | 4 |

Repointages accompagnant le contrat 1 dans `booking-render.test.mjs` : les pages
article/thème et les destinations du registre sont rendues à leur URL FR réelle,
sans supprimer `/fr` avant le rendu ; les assertions existantes du parcours
restent. Les tests complets des corps bilingues et les assertions de métadonnées
préexistantes restent intacts. Les neuf noindex, douze alias renommés, sauts
uniques et UTM répétés sont toujours vérifiés. `journal-data.ts` et les tests de
ses listes restent inchangés ; les contrôles préexistants des articles liés FR
restent en place. Aucun seuil géométrique, de contraste, de CLS, de timeout ou
aucune règle réseau modifié.

### Blocage hors des quatre contrats : attribution SSR

Après les alignements, `tests/brand-os-render.test.mjs:233` révèle une assertion
auparavant masquée par l'échec du nombre de cartes FR :
`assert.equal(url.searchParams.get("utm_custom"), "offhome")`.
Elle exige que les deux boutons de navigation du **HTML initial sans JavaScript**
contiennent les UTM de la requête sur l'index, un thème, un article et les mentions
légales, dans les deux langues. Cette assertion est conservée exactement.

Diagnostic sur les huit URL avec `?utm_custom=offhome&source=old` : réponse 200,
`Cache-Control: s-maxage=31536000`, deux boutons `/?source=rdv-nav#contact` en EN
ou `/fr?source=rdv-nav#contact` en FR, donc UTM absent de ce HTML préconstruit.
Preuve : `/private/tmp/passe-site-c2-attribution-proof.log`. Il ne s'agit pas
d'un défaut nouveau introduit par ces changements de tests : aucun code produit
n'a changé ce tour, et l'assertion n'était pas atteinte auparavant.

Un HTML statique partagé ne varie pas avec la query de chaque visiteur. Rendre
ces pages dynamiques contredirait le §1 et les tests imposant leurs rendus ○/● ;
un contrôle après hydratation changerait ce contrat SSR hors des quatre
exceptions. La revue indépendante confirme cette contradiction. Une demande
d'exception supplémentaire est présentée à Paul ; sans nouvelle décision,
aucun contrôle d'attribution n'est déplacé, conditionné ou supprimé.

Le bloc d'identité auteur du grand test compilé se trouve après ce blocage :
il a été exécuté isolément, en reprenant exactement ses assertions, sur trois
articles, RSS et llms-full, avec deny-all réseau. Ce diagnostic ciblé ne remplace
pas la réussite de la suite complète. Journal :
`/private/tmp/passe-site-c2-author-identity.log`.

### Validation et limites

Résultats finaux ci-dessous. Le build reste à 96 pages : index et mentions
légales ○ ; articles et quatre thèmes ●, en FR/EN ; accueil, réservation et sketch
ƒ. Les anciens tests de données, de glyphes et de redirections ne sont pas
neutralisés. Aucun navigateur, hydratation, iframe Cal.com, en-tête HTTP sur
socket `next start`, mesure géométrique ou production n'est présenté comme prouvé.
Les en-têtes du diagnostic viennent du moteur compilé local, sans socket.

| Commande / contrôle | Résultat |
|---|---|
| Référence `npm test` | 540/553, 13 échecs. |
| `npm run lint` (état final des tests) | Vert, code retour 0. |
| `npm run build -- --webpack` | Vert, code retour 0, 96 pages. |
| `npm test`, passage 1 | **552/553**, un échec UTM SSR, 0 ignoré, 0 annulé. |
| `npm test`, passage 2 consécutif, mêmes fichiers | **552/553**, même échec UTM SSR, 0 ignoré, 0 annulé. |
| `npm run qa:brand:rev01` | Vert. |
| `git diff --check` | Vert. |
| Revue indépendante | Quatre contrats respectés ; contradiction SSR/statique confirmée ; métadonnées auteur explicitement contrôlées. |

Journaux : `/private/tmp/passe-site-c2-baseline.log`,
`/private/tmp/passe-site-c2-lint.log`, `/private/tmp/passe-site-c2-build.log`,
`/private/tmp/passe-site-c2-test-1.log`, `/private/tmp/passe-site-c2-test-2.log`,
`/private/tmp/passe-site-c2-brand.log`. L'installation des dépendances n'a pas
été rejouée ce tour ; versions locales existantes utilisées (Next 16.3.4).
Guide Next local d'internationalisation consulté ; documentation Context7 sur
routes explicites et alternates consultée, aucun nouvel appel API framework.

**Objectif deux suites entièrement vertes non atteint.** Les 13 attentes
initialement bloquantes ont été alignées, mais une assertion supplémentaire du
même grand test compilé reste en échec. Aucun dépassement des quatre exceptions
pour masquer ce résultat. La répétition du même blocage met fin à la boucle
jusqu'à arbitrage. Aucun commit, push ou déploiement. Spec identique au canon,
code produit, corpus, certificats et PNG inchangés par ce tour, vérifiés contre
les empreintes avant intervention.


## Correctif 3 — cache et attribution après hydratation, 13/11/2026

Mandat : section finale de la spec canonique lue intégralement dans
`/Users/paullarmaraud/parrit-site/docs/CODEX-SPEC-2026-11-12-passe-site-seo-securite-coherence.md`.
Uniquement Correctif 3 ; aucun réseau externe, push, déploiement ou accès aux secrets.
Écritures : worktree local et index Git de la branche courante ; réversibles par
revert des commits locaux. Aucun système client, aucune ligne métier modifiée.
La référence Git et les commits constituent le point de restauration.
Boucle bornée : référence, ajustement, deux batteries complètes ; arrêt si un
même blocage persiste deux fois. Aucun seuil ni test tiers ajusté pour obtenir le vert.

### Fusion effectuée avant les corrections

- Branche initiale : `c814bada145207b6af1c2ec232cf8afe8477dabe`, worktree propre.
- `git merge origin/main`, référence locale `c2e7adad9c89e4b685a547d3ff0c649b2e5f4fc6`,
  sans fetch. PR #376 et #381 intégrées.
- Seul conflit Git : `AI_CONTEXT.md`, deux introductions au même emplacement.
  Conservation intégrale du compte rendu passe-site et de celui sur les délais Journal.
- Commit de fusion terminé : `805ac63043b81121c00f77228ce6262b22ed1992`.
- Comparaison à `origin/main` : `rev01.css`, `single-page.css`, `system.css`,
  `public-clients.ts`, `preuves.ts`, tests `ui-polish`, `design-md-truth`,
  `public-clients`, `action-unique` identiques. Finitions, six clients et tests
  entrants conservés ; aucun conflit CSS à résoudre.
- `DESIGN.md` enrichi dans le commit de fusion : Journal après Questions,
  état actif, signature et dates de l'article, lien vers le rendu partagé FR/EN.
  `DESIGN-SYSTEM.md` reprend sans modification supplémentaire son bandeau
  historique ajouté par main, qui renvoie à DESIGN.md et au Brand OS.

Référence après fusion, avant correction : `npm test` **585/586**, seul échec
`null !== 'offhome'` dans `brand-os-render` ; compilation héritée du tour précédent.
Journal : `/private/tmp/passe-site-c3-baseline.log`.

### Assertion remplacée et comportement testé

Dans `tests/brand-os-render.test.mjs`, seules les pages statiques concernées
changent de contrat :

| Avant | Après |
|---|---|
| `utm_custom` vaut `offhome` dans le HTML initial, sur les huit URL statiques. | Query initiale exactement `source=rdv-nav` ; aucun paramètre de visite dans le HTML partagé. Chemin localisé, fragment contact, deux liens et libellés toujours vérifiés. |

Les assertions SSR de l'accueil sont inchangées. Ajout d'un contrôle compilé
FR/EN sur `/rendez-vous` : deux liens natifs `#reservation`, résolution conservant
`source=essai`, `utm_custom=offhome`, `utm_campaign=c1` sans JavaScript.
Aucun autre test existant modifié hors intégration de main. Dans
`tests/passe-site.spec.ts`, seuls huit nouveaux cas sont ajoutés.

L'inspection du code a révélé deux écarts au comportement demandé :
`avecSource` remplaçait la source de visite par `rdv-nav`, et la query entière
était recopiée. `RevHeader` filtre désormais `source` et `utm_*` pour Journal,
articles, thèmes et mentions légales. L'override facultatif `attributionSource`
d'`AppointmentLink` conserve la source de visite seulement après hydratation,
via `useSyncExternalStore` ; fallback SSR et autres placements gardent `rdv-*`.
Accueil et réservation conservent leurs contrats antérieurs.

Les nouveaux cas navigateur visitent `/journal`, `/journal/themes/ai-sprints`,
`/journal/what-is-parrit-ai`, `/legal`, puis les quatre variantes `/fr`, avec
`?source=essai&utm_custom=offhome&utm_campaign=c1&unknown=excluded`.
Ils attendent les trois paramètres exacts sur les deux boutons de navigation,
le chemin localisé et `#contact`, et l'absence de tout paramètre inconnu.
Ils lisent le Cache-Control de la réponse réelle : `public` ou `s-maxage`
positif, sans `private`, `no-store` ni `no-cache`. Aucun en-tête simulé.
Fixture deny-all du dépôt conservée, localhost/127.0.0.1 uniquement,
service workers bloqués ; toute sortie inattendue fait échouer le test.
La spec figure déjà dans `qa:network:rev01` ; package.json inchangé.

Documentation utilisée sans réseau : guides Next installés `use-search-params.md`
et `testing/playwright.md`, déclarations de types Playwright installées.
Revue indépendante en lecture seule : conservation PR #376 et contrôle adverse
du diff, aucun défaut bloquant identifié ; ne constitue pas une preuve navigateur.

### Diagnostic intermédiaire

Une première installation avec un cache temporaire vide a échoué hors réseau.
Copie du seul cache de paquets local `_cacache` vers `/private/tmp`, puis
`npm ci --silent` réussi avec `npm_config_offline=true`, audit et notification
npm désactivés. Aucun fichier de configuration ou secret copié.

Premier candidat : lint/build/marque verts, **578/586** tests. Les huit échecs
venaient du chargeur de tests existant, qui transpile une itération for-of de
URLSearchParams sans downlevelIteration. Correction du code en `forEach`,
sans modifier le chargeur ni les tests. Rejeu ciblé action-unique/passe-site vert.
Journaux intermédiaires : `/private/tmp/passe-site-c3-{ci,lint,build,brand,test}-1.log`,
`/private/tmp/passe-site-c3-targeted.log`. Les résultats finaux ci-dessous sont
ceux des deux batteries reprises intégralement après cette correction.

### Résultats finaux

| Commande | Batterie finale 1 | Batterie finale 2 |
|---|---|---|
| `npm ci --silent` (cache local, mode offline) | Vert, sortie 0 | Vert, sortie 0 |
| `npm run lint` | Vert, sortie 0 | Vert, sortie 0 |
| `npm run build -- --webpack` | Vert, 96/96 pages, sortie 0 | Vert, 96/96 pages, sortie 0 |
| `npm run qa:brand:rev01` | Vert, sortie 0 | Vert, sortie 0 |
| `npm test` | **586/586**, sortie 0 | **586/586**, sortie 0 |

Un troisième `npm test`, immédiatement après celui de la seconde batterie :
**586/586**, sortie 0. Les deux derniers npm test sont donc consécutifs,
sans build ni édition entre eux. Zéro test ignoré, annulé ou restant à faire
sur chacun des trois passages Node finaux.

Journaux : `/private/tmp/passe-site-c3-final-{ci,lint,build,brand,test}-{1,2}.log`,
`/private/tmp/passe-site-c3-final-test-3.log`. Codes de retour des deux batteries :
`/private/tmp/passe-site-c3-final-results.json`.

Modes de rendu relevés dans les deux builds finaux :

| Routes | Mode |
|---|---|
| `/journal`, `/fr/journal` | ○ statique |
| `/legal`, `/fr/legal` | ○ statique |
| `/journal/[slug]`, `/fr/journal/[slug]` | ● SSG (40 EN, 31 FR) |
| `/journal/themes/[theme]`, `/fr/journal/themes/[theme]` | ● SSG (4 par langue) |
| `/`, `/fr`, `/rendez-vous`, `/fr/rendez-vous`, `/sketch/[id]` | ƒ dynamique |

Contrôles complémentaires :

| Commande | Résultat |
|---|---|
| `git diff --check` | Vert |
| `node node_modules/playwright/cli.js test tests/passe-site.spec.ts --browser=chromium --list` | Vert : 22 cas recensés, dont 8 nouveaux |
| `node node_modules/next/dist/bin/next start -p 3210 --hostname 127.0.0.1` | Bloqué par le sandbox : `listen EPERM`, sortie 1 |
| `node node_modules/playwright/cli.js test tests/passe-site.spec.ts --browser=chromium --grep 'cached page hydrates only campaign attribution' --workers=1 --max-failures=1 --output=/private/tmp/passe-site-c3-playwright` | Bloqué au lancement Chromium : MachPortRendezvous `Permission denied`, SIGTRAP, sortie 1 ; un échec avant navigation, sept cas non exécutés |

Journaux navigateur : `/private/tmp/passe-site-c3-browser-list.log`,
`/private/tmp/passe-site-c3-next-start.log`, `/private/tmp/passe-site-c3-browser.log`.
Aucune tentative de contourner les restrictions du sandbox.

**PRODUCTION_PROOF restant à acquérir** : les huit navigations réelles sous
`next start`, Cache-Control public et attribution hydratée, puis batterie
Playwright complète sur l'hôte par Claude. Les deux batteries Node vertes,
la compilation et la revue ne prouvent pas cet effet navigateur. Aucune preuve
production, Cal.com réel, géométrie ou CLS nouvelle n'est revendiquée.

### Périmètre final et livraison locale

Fichiers propres au correctif, en plus des 33 fichiers entrants de main :

- `AI_CONTEXT.md` : résolution du seul conflit et état final du correctif.
- `DESIGN.md` : navigation/signature, dans le commit de fusion.
- `src/system/components/RevHeader.tsx` : attribution filtrée après hydratation.
- `src/system/components/AppointmentLink.tsx` : source facultative pour cet usage.
- `tests/brand-os-render.test.mjs` : seule attente existante remplacée ; couverture
  SSR réservation ajoutée, autres assertions conservées.
- `tests/passe-site.spec.ts` : huit cas ajoutés, tous les cas existants conservés.
- `docs/REPORT-2026-11-12-passe-site.md` : présent compte rendu.

Les autres différences par rapport au point de départ proviennent uniquement
de `git merge origin/main` (liste complète : `git diff --name-only 805ac63^1 805ac63`).
CSS, six clients et tests de #376 ont été vérifiés identiques à origin/main.
Aucun PNG, secret, seuil, dépendance ou autre test modifié par ce correctif.
Commit de fusion `805ac63`, puis commit local de correctif sur la même branche.
Aucun push ; ouverture de PR et rejeu hôte laissés à Claude selon le mandat.

## Correctif 4 — contrats navigateur, 13/11/2026

### Mandat et référence

Seule la section finale Correctif 4 de la spec canonique a été exécutée,
après lecture intégrale de
`/Users/paullarmaraud/parrit-site/docs/CODEX-SPEC-2026-11-12-passe-site-seo-securite-coherence.md`.
SHA256 : `89981c1183208dc7e58dbc7161944d354944bd17bfa5cbd944e0c4b839129af5`.
La copie de spec du worktree est inchangée. Branche courante :
`codex/docs-CODEX-SPEC-2026-11-12-passe-site-seo-securite`, départ `e404be3` ;
`origin/main` local = `c2e7adad9c89e4b685a547d3ff0c649b2e5f4fc6`. Aucun fetch/merge.

Source navigateur lue avant modification :
`/Users/paullarmaraud/codex-work/hote-s-navigateur.log`, 5919 lignes,
SHA256 `f7030177842204d32be0fa94da9dc20c716d473d2578550313de46b2cae8d68c`.
Ce journal hôte du 13/11 comporte 535 réussites et 79 échecs : 40 anti-slop,
4 espacement Journal, 8 intentions, 3 i18n, 20 parcours et 4 menu mobile.
Les tests correspondants et les versions de main ont été lus avant édition.

Plan autorisé par C4 : retrait des ajouts d'identité, restauration de la source,
alignement langue/navigation, comparaison Node avant/après, revue indépendante,
rapport, commit local. Tour unique ; arrêt sur erreur répétée ou contradiction
du mandat. TARGET_SYSTEM = ce worktree ; ENVIRONMENT = local ; WRITE_SCOPE =
fichiers concernés et assertions visées par C4, documentation ; REVERSIBLE = oui ;
ROLLBACK = revert du commit ; BACKUP = HEAD initial et empreintes PNG ;
EXPECTED_ROWS = aucune donnée métier. Aucun secret édité, aucun appel métier
externe, aucun push/déploiement. Aucun lancement Chromium ni next start.

### Par cause : changement, preuve et limite

| Cause | Changement | Preuve et limite |
|---|---|---|
| Identité, 40 échecs | Signature ajoutée sous le chapeau et injection dans le corps machine retirées. JSON-LD et métadonnées auteur restaurés selon main. | Corpus publié sans champ `author` : Organization pour les 40 EN et 31 FR. Tests compilés verts. |
| Espacement, 4 échecs | Dates localisées replacées avant le titre ; chapeau directement suivi des thèmes et du temps de lecture. Mise à jour seulement si distincte, dates liées conservées. | CSS #376 inchangée : `--brand-s2` = 16 px. Le journal mesurait un excès de 52,796875 px à 1440 et 81,59375 px à 390. Mesure finale réservée à l'hôte, aucun seuil modifié. |
| Source, 8 intentions + 1 i18n | `attributionSource` et son état d'hydratation retirés. `avecSource` impose `rdv-nav`. Filtrage statique et UTM répétés conservés, accueil dynamique/réservation inchangés. | Test C3 corrigé. Quatre cas sans JS contradictoires et course i18n non prouvée résolue : réserves ci-dessous. |
| Langue, 2 échecs | Sans JS : href de base et clic vers la traduction de base. Deux cas JS ajoutés : requête complète, paramètres répétés, clic, langue/canonique. | Statut, saut unique et requête d'arrivée du renommage restent contrôlés. LanguageLink inchangé, comportement déjà présent. |
| Navigation, 20 parcours + 4 menu | Journal inséré dans les attentes entre Questions et Contact ; compteur mobile 6 → 7. | Géométrie, visibilité, débordement et fermeture conservés. Le log passe les contrôles du panneau avant le compteur ; pas de CSS spéculative. Contrôles de chaque lien à rejouer. |

**Contrat machine antérieur conservé.** Main contient déjà un auteur Person
conditionnel sur `entry.author`, l'identifiant `#founder`, les métadonnées auteur
et une signature en pied pour les articles machine. Le retrait se limite aux
mentions « ajoutées par ce lot » : ces comportements et le test machine sont
restaurés à l'identique de main. L'identifiant Person de l'accueil retrouve aussi
son état antérieur. Aucun corps MDX, BookingCall ni pied machine réécrit.
`DESIGN.md` reflète le retrait de la signature ajoutée ; historique conservé.

### Assertions rétablies et alignées : avant → après

| Fichier / contrat | Avant ce tour | Après ce tour |
|---|---|---|
| `entity-graph.test.mjs`, auteur | Person nominative/worksFor | `orgRef()`, fichier identique à main ; publisher inchangé |
| `brand-os-render.test.mjs`, identité | Signature, Person et métadonnées nominatives exemptées | Bloc identique à main : contrôle d'identité sans ces exemptions ; autres contrats, dont cache C3, conservés |
| `journal-machine-rendering.test.mjs` | Person `#paul-larmaraud`, worksFor, signature entre chapeau/intertitre | Fichier identique à main : Person conditionnelle `#founder`, signature après les sources, métadonnées préexistantes |
| `passe-site.test.mjs`, identité | Article et accueil partagent Person | Article publié = Organization ; Person accueil = `#founder` |
| `passe-site.test.mjs`, 12 cas signature/dates | Signature après chapeau, dates dans sa ligne | En-tête sans signature nominative, absence de journal-byline ; métadonnées selon contrat antérieur ; dates localisées/mise à jour distincte ; chapeau adjacent au temps de lecture, corps conservé |
| `passe-site-render.test.mjs` | Person/worksFor et signature requises | Organization complète liée au publisher ; absence de signature ajoutée ; meta/lien auteur Parrit.ai ; cache, dates liées, canoniques et alternates conservés |
| `passe-site.spec.ts`, 8 cas C3 | `source=essai` après hydratation | `source=rdv-nav` ; UTM c1/offhome, exclusion paramètre inconnu et cache inchangés |
| `conformity-i18n.spec.ts`, sans JS | href et clic avec paramètres de visite | href et clic vers adresse de base ; renommage toujours en un saut avec requête complète à l'arrivée, langue/canonique conservées |
| `conformity-i18n.spec.ts`, JS | Pas de cas renommage puis lien hydraté spécifique | Deux cas ajoutés : requête complète dont UTM répétés, clic/destination complète dans les deux langues, deny-all conservé |
| `parcours-accueil.spec.ts`, 20 listes | Six liens, Questions → Contact | Sept liens, Questions → Journal localisé → Contact ; sections et attribution contact identiques |
| `single-page.spec.ts`, 4 menus | Six liens | Sept liens ; aucune autre assertion modifiée |

Les tests Node d'auteur/signature relèvent de « entity-graph.test.mjs et autres »
dans C4 §1. Aucun test extérieur à ces contrats modifié. Vérification octet par
octet avec HEAD initial : `intentions.spec.ts`, `conformity-journal.spec.ts`,
`anti-slop-copy.spec.ts` inchangés. Seuils, durées et filets réseau inchangés.

### Résultat des commandes

| Commande | Référence / premier candidat | Finale A (suffixe 2) | Finale B (suffixe 3) |
|---|---|---|---|
| `npm test` | Référence 586/586, sortie 0 ; premier candidat 584/586, sortie 1 (deux contrats machine auteur pas encore restaurés) | **586/586**, sortie 0 | **586/586**, sortie 0 |
| `npm run lint` | Premier candidat : sortie 0 | Sortie 0 | Sortie 0 |
| `npm run build -- --webpack` | Premier candidat : sortie 0 | Sortie 0, 96 pages | Sortie 0, 96 pages |
| `npm run qa:brand:rev01` | Premier candidat : sortie 0 | Sortie 0 | Sortie 0 |

Deux batteries finales complètes sur le même code, aucune édition entre elles.
Zéro test Node ignoré, annulé ou todo. Échec intermédiaire conservé dans les logs ;
correction par restauration de main, puis reprise entière deux fois.

Autres commandes et contrôles :

- `node --test tests/entity-graph.test.mjs tests/passe-site.test.mjs` : 33/33, sortie 0.
- Même commande avec `tests/journal-machine-rendering.test.mjs` : 49/49, sortie 0 après restauration.
- `git diff --check` : sortie 0.
- Comparaison d'octets à main : `jsonld.ts`, `JournalMachineBody.tsx`, `entity-graph.test.mjs`, `journal-machine-rendering.test.mjs` identiques.
- SHA256 des six PNG préexistants : inchangés par ce tour, exclus du commit.
- Liste facultative `node node_modules/playwright/cli.js test tests/passe-site.spec.ts tests/conformity-i18n.spec.ts tests/parcours-accueil.spec.ts tests/single-page.spec.ts --browser=chromium --list` : refusée avant exécution par PreToolUse « Garde WhatsApp », invoquant une touche simulée et WhatsApp sans rapport avec cette commande. La tentative de consigner ce refus par une commande shell a également été bloquée ; le rapport est édité avec l'outil de patch. Aucun navigateur lancé, aucun contournement du refus de lancement.
- `npm run qa:network:rev01` : non exécuté conformément au mandat, rejeu hôte par Claude. Aucun `next start` lancé.
- `npm ci --silent` : non demandé par C4, non rejoué ; dépendances existantes Next 16.3.4 conservées.

Logs : `/private/tmp/site-c4-baseline-test.log`,
`/private/tmp/site-c4-targeted.log`, `/private/tmp/site-c4-targeted-2.log`,
`/private/tmp/site-c4-final-{lint,build,brand,test}-{1,2,3}.log`.
Codes/durées : `/private/tmp/site-c4-final-results-1.json` et
`/private/tmp/site-c4-final-results-2-3.json`.
Modes de rendu inchangés dans les deux builds : Journal index/legal FR/EN ○ ;
articles (40 EN, 31 FR) et thèmes (4 par langue) ● ; accueil/rendez-vous/sketch ƒ.
Les tests compilés vérifient encore le cache partageable ; aucune nouvelle preuve
HTTP réseau. Docs consultées : guide livré Next 16.3.4 `use-search-params.md` et
Context7 Next 16.3.6 (16.3.4 non proposé), Suspense et prérendu.

### Réserves explicites pour le rejeu hôte

1. **Quatre échecs sans JavaScript restent attendus**, intentions:275, FR/EN ×
   1440/390 : exigence `utm_campaign=navigation` dans le href initial statique.
   Le log constate déjà rdv-nav correct, UTM null. Un HTML partagé sans JS ne
   dépend pas de la visite. C4 interdit de modifier ce test : conservé, aucun
   rendu dynamique ni paramètre codé en dur pour le verdir. Impossible de promettre
   qa:network entièrement vert avec ces contrats simultanés.
2. **Course d'hydratation possible**, conformity-i18n:151, « header switches paths » :
   UTM null avec rdv-nav déjà correct dans le log. La lecture immédiate du href
   après changement de langue peut encore atteindre le fallback Suspense. Retrait
   d'attributionSource et d'un rendu intermédiaire ≠ preuve de résolution. Test
   conservé ; vérifier séparément sur hôte.
3. Mesurer panneau mobile entier et chacun des sept liens à 390/800, espace
   chapeau/lecture à 1440/390, attribution hydratée FR/EN et suite complète.
   Aucune nouvelle capture, mesure CLS ou preuve production revendiquée.

Revue indépendante en lecture seule par `review_c4` : périmètre et seuils
validés, retour exact des contrats machine à main approuvé, les deux réserves
ci-dessus confirmées ; aucun autre défaut concret identifié.
PRODUCTION_PROOF = non acquise. Livraison par commit local sans push ; les six
PNG hôte préexistants restent dans le worktree et hors commit.

## Correctif 5 — alignement des deux tests navigateur, 13/11/2026

Mandat : section finale « Correctif 5 » de la spec canonique, accord « ok cache ».
Périmètre : deux fichiers de tests navigateur et ce rapport uniquement ; aucun
code de production, autre test ou seuil modifié. Six PNG préexistants exclus.

### Deux assertions avant / après

1. `tests/intentions.spec.ts`, groupe `off-home appointment`, FR/EN et 1440/390,
   quatre routes statiques :
   - Avant : `expect(target.searchParams.get("utm_campaign")).toBe("navigation");`
   - Après : `expect(target.searchParams.get("utm_campaign")).toBe(javaScriptEnabled ? "navigation" : null);`
   - Avec JS, attente inchangée ; sans JS, absence de campagne dans le HTML partagé.
     Bouton unique, libellé, chemin, ancre, source `rdv-nav`, clic et arrivée au
     contact restent contrôlés à l'identique.
2. `tests/conformity-i18n.spec.ts`, `header switches paths, saves choice and preserves query/hash` :
   - Avant : lecture immédiate de `action.getAttribute("href")` après `toHaveCount(1)`.
   - Après : ajout de `await expect(action).toHaveAttribute("href", /[?&]utm_campaign=language(?:[&#]|$)/);`
     avant cette même lecture, pour attendre l'hydratation des deux boutons.
   - Les quatre attentes chemin `/fr`, ancre `#contact`, source `["rdv-nav"]`
     et campagne `language` restent inchangées.

### Validation

| Commande | Référence avant édition | Après édition |
|---|---|---|
| `npm run lint` | Sortie 0 | Sortie 0 |
| `npm test` | 586/586, sortie 0 | 586/586, sortie 0 |

Aucun test ignoré, annulé ou todo. `git diff --check` vert.
Logs : `/private/tmp/correctif5-{baseline,final}-{lint,test}.log`.
Tests navigateur non exécutés ici : le résultat hôte 611 passés / 5 échecs
est celui rapporté par la spec, pas une nouvelle mesure. Le rejeu navigateur
sur hôte reste la preuve attendue de résolution des cinq échecs ; aucune preuve
production revendiquée. Livraison par commit local sans push.

## Correctif 6 — exception exacte du badge et coche SVG, 13/11/2026

Mandat : section finale Correctif 6 de la spec canonique située dans
`/Users/paullarmaraud/parrit-site/docs/`. Base locale `e819d2f`.
Périmètre : `HarnessBadge.tsx`, `scripts/lib/certification-claims.mjs`,
`tests/harness-certificates.test.mjs` et ce rapport uniquement. Six PNG
préexistants laissés intacts et exclus du commit. Aucun push.
Écriture locale réversible par revert du commit ; aucune donnée distante modifiée.

Le texte anglais reste « Harness Certified ». Sa coche est un SVG décoratif
anglais seulement, aria-hidden, trait currentColor, dimensions 1em et alignement
vertical -0.125em. Texte français, lien de preuve et validation du certificat
inchangés. Aucun jeton de couleur ajouté.
L'exception remplace la substitution de sous-chaîne par une égalité sur la phrase
entière, après trim, seulement avec allowBadge. L'appelant réserve toujours ce
paramètre au fichier HarnessBadge.tsx ; les autres exceptions sont inchangées.

Les trois assertions passent de l'ancien libellé avec coche au libellé exact
sans coche : accepté avec allowBadge, refusé sans, refusé avec « and certified
delivery ». Un nouveau cas vérifie l'absence du caractère dans le composant,
le SVG anglais décoratif et son absence en français ; l'ancien libellé est
également refusé par le contrôle. Référence : contrôle claims en échec (sortie 1,
HarnessBadge.tsx:9), 8/8 tests ciblés verts. Candidat : 9/9 tests ciblés verts.
Huit vérifications adverses supplémentaires passent : préfixe, suffixes,
ancienne coche, seconde affirmation et casse différente restent refusés.

### Étapes demandées, exécutées dans l'ordre

| Commande | Résultat du premier passage |
|---|---|
| `npm run lint` | Réussite, sortie 0 |
| `npm run qa:claims:rev01` | Réussite, sortie 0 |
| `npm run build` | Turbopack 16.3.4 reste sur « Creating an optimized production build » plus de cinq minutes ; interrompu par Ctrl-C, session sortie 130 |
| `npm run test:brand-os` | Échec, sortie 1 : 16/19, trois échecs faute de build complet |
| `npm test` | Échec, sortie 1 : 658/675, 17 échecs dépendant du build incomplet |
| `npm run qa:brand:rev01` | Réussite, sortie 0 |

Le prébuild (certificats et génération llms) a réussi, sans différence suivie
sur llms.txt. Le diagnostic Turbopack reste à buildStage=compile ; aucune cause
précise du blocage n'est établie. Les fichiers compilés manquants comprennent
`.next/required-server-files.json`. Une tentative SIGTERM a été refusée par le
bac à sable ; Ctrl-C a ensuite arrêté la session.

### Vérification complémentaire avec Webpack

Sans autre changement de source : `npm run build -- --webpack` réussit (sortie 0),
puis `npm run test:brand-os` réussit (19/19, sortie 0) et `npm test` réussit
(675/675, sortie 0). Aucun test ignoré ni seuil modifié. `git diff --check` vert.
Ces résultats isolent les échecs précédents au build incomplet ; ils ne prouvent
pas que la commande CI exacte utilisant Turbopack passe. L'objectif « toutes
vertes » de la batterie exacte reste donc non acquis et exige le rejeu hôte.

Logs : `/private/tmp/correctif6-{baseline-claims,baseline-tests,targeted,lint,claims,build,brand-os,test,brand,webpack,brand-os-webpack,test-webpack}.log`.
Aucune preuve navigateur ou production ajoutée ; notamment l'alignement optique
est défini en em et contrôlé dans le markup, sans mesure visuelle navigateur.
La compilation et les tests après Webpack vérifient les glyphes des pages rendues.
