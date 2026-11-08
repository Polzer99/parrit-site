# Rapport — llms.txt et articles, 08/11/2026

## Périmètre et sources

Implémentation de `CODEX-SPEC-2026-11-08-llms-txt-articles.md` sur le checkout
explicitement demandé, branche `codex/docs-CODEX-SPEC-2026-11-08-llms-txt-articles-md`,
baseline `4490653a19892776d7a36260075850dcd68ca545`. Aucun commit, push ou déploiement.

| Fait | Source vérifiée dans ce checkout | Preuve |
| --- | --- | --- |
| Accueil de 13 sections FR/EN | SinglePage et composants, home-layers | Rendu SSR avant/après identique |
| Six paires FAQ par langue | HOME_LAYERS, rendu details/summary/p | Comparaison exacte des textes rendus |
| 40 fichiers, 31 articles indexables | content/journal, lecteur, sitemap, RSS | 31 URLs identiques par langue dans llms |
| Noms clients interdits dans le Journal | public-clients.ts et journalClientNames | Contrôle avant écriture et tests adverses |

Le lecteur initial excluait `noindex` du sitemap/RSS mais ne gérait pas `draft`
ni les dates futures. Le filtrage demandé a donc été ajouté à la source commune.
La journée de publication est évaluée en UTC, comme les dates du RSS.

## Modifications

- `src/system/home-layers.ts` : ordre partagé et fragments des titres existants,
  sans nouvelle formulation ; la FAQ reste dans sa source initiale.
- `src/system/components/SinglePage.tsx` : rendu des sections par cet ordre,
  fragments React avec clés et aucun élément DOM supplémentaire.
- `src/system/components/SessionPhotos.tsx`, `TechnologyBand.tsx` : titres partagés.
- `src/system/journal-data.ts` : extraction du lecteur local ; validation des
  indicateurs, exclusion des brouillons et articles futurs, tri conservé.
  Le champ interne draft est retiré avant retour : contrat public inchangé.
- `src/system/journal.ts` : façade server-only conservée pour les consommateurs
  applicatifs, réexportant le lecteur partagé avec le prebuild.
- `scripts/generate-llms.mjs` : ordre dérivé, FAQ exacte, articles avec titre,
  date, description d'origine et tous les thèmes enregistrés dans chaque langue.
  Exclusion noindex ; noms clients publics et privés connus refusés avant écriture.
- `public/llms.txt` : régénéré uniquement par le script, toujours appelé au prebuild.
- `AI_CONTEXT.md`, ce rapport et le plan : état et décisions de cette passe.

La phrase française « les articles restent en anglais » et les URLs anglaises
canoniques sont conservées. Les chiffres de la sortie proviennent des textes
existants. Aucun contenu MDX, prix, style, asset ou PNG de handoff modifié.

## Tests

`tests/llms-articles.test.mjs` ajoute 12 tests Node :

- ordre et titres comparés aux 13 sections réellement rendues, FR/EN ;
- six FAQ mot pour mot, FR/EN ;
- nombre, unicité et ordre des URLs comparés au sitemap et au RSS, présence dans
  le sitemap compilé, métadonnées originales et thèmes canoniques, FR/EN ;
- fixtures en mémoire : publié aujourd'hui, ancien, futur, brouillon, noindex,
  visibilité directe et indicateurs invalides ; aucune requête externe ;
- génération déterministe et fichier généré à jour ;
- rejet des noms clients dans titre, description et slug ;
- tri par titre anglais à date égale, sans mutation des entrées ;
- exclusion des métadonnées confidentielles des articles noindex.

Deux anciens contrats sont adaptés explicitement à la spec :
`anti-slop-copy.test.mjs` exempte uniquement les deux réponses exactes de la
fixture FAQ existante à 15 minutes ; `langue-metier.test.mjs` garde le contrôle
des concepts retirés dans la présentation de l'accueil, les descriptions
historiques du Journal pouvant désormais parler d'architecture. Les anciens
libellés de l'ordre sont remplacés par la comparaison stricte au rendu réel.
Aucun seuil géométrique, contraste ou stabilité modifié.

## Validation et corrections

Baseline : npm ci, lint, build Webpack et **217/217 tests Node** réussis.
Les huit premiers tests nouveaux échouaient avant implémentation.

Corrections pendant la vérification : l'extracteur de titres de test ajoutait
un espace artificiel autour des balises b (corrigé sans changer le texte) ; le
lecteur exposait initialement draft dans les objets d'article (détecté par le
test existant de stabilité des champs, corrigé sans toucher à ce test).
L'ancien test interdisant architecture partout est adapté comme expliqué ci-dessus.

Revue indépendante finale : aucun défaut restant identifié, **41/41** tests
ciblés réussis (intentions, langue-metier, llms-articles, anti-slop).

Batterie finale complète réussie :

| Vérification | Résultat |
| --- | --- |
| `npm ci --silent` | Réussi |
| `npm run lint` | Réussi |
| `npm run build -- --webpack` (prebuild inclus) | Réussi, 52 pages générées |
| `npm test` | **229/229**, soit 12 tests supplémentaires |
| `npx tsc --noEmit` | Réussi |
| `npm run qa:brand:rev01` | Réussi |
| `npm run qa:claims:rev01` | Réussi |
| `npm run test:brand-os` | **19/19** |
| `git diff --check` | Réussi |
| HTML SSR FR/EN avant/après | Identique octet pour octet |

Les journaux d'exécution sont dans `/private/tmp/llms-final-{ci,lint,build,test}.log`,
`llms-types.log`, `llms-brand.log`, `llms-claims.log`, `llms-brand-os.log`.
Aucun blocage restant pour la livraison locale.

## Préservation et limites

La seule modification préexistante était la spec non suivie ; SHA256 avant/après :
`810a60f75760baf95cb2a6e084f31037ed265aff245e6ab21ac4aff1ae2a72b4`.
Aucun PNG sous `.codex-handoffs/brand-os-p1/after/` modifié.
Écritures locales réversibles uniquement, zéro donnée métier et aucun service réel.

Environnement exécuté : Node v26.12.1, Next 16.3.4. Le dépôt déclare Node 24 dans
.nvmrc ; aucun changement de version ou de dépendance effectué.
Avertissements non bloquants : metadataBase absent (déjà présent en baseline)
et MODULE_TYPELESS_PACKAGE_JSON pour les imports TS directs.

La preuve locale porte sur la sortie générée, le sitemap compilé et le rendu SSR.
Aucun navigateur ni contrôle de production exécuté : la spec prescrit des tests
Node, et la publication est réservée au script de l'utilisateur. La présence
réelle sur https://parrit.ai/llms.txt reste à vérifier après ce déploiement.
