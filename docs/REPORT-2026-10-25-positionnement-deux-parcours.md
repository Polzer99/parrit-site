# Positionnement et deux parcours : compte rendu R4

Spec implémentée jusqu'à la révision 4. Les révisions 1 à 3 étaient déjà présentes
à l'arrivée ; elles ont été conservées et complétées. La seule modification locale
préexistante était l'ajout R4 au handoff : ce fichier n'a pas été modifié.
Aucun commit, push, merge ou déploiement effectué ; aucune capture PNG modifiée.

Instructions lues avant modification : AI_CONTEXT.md, AGENTS.md, TRUTH.md,
CLAUDE.md et le handoff complet. Guides Next installés consultés : page,
generateMetadata et JSON-LD. Le plan existant a été complété pour R4.

## Modifications et fichiers

| Fichiers | Résultat de cette reprise |
| --- | --- |
| `src/system/public-clients.ts` | Liste unique : Laparra, Clevery, Forexpert, Joone, SNCF. Résolution exacte de l'alias Clevery Avocats, sans accepter un suffixe arbitraire. |
| `src/app/(rev01)/page.tsx` | Cinq références structurées FR/EN, nom et réalisation distincts, liste sémantique sans logo ni action. Textes R4 mot pour mot, dont Joone accompagné et SNCF formée avec Arkel. Parcours adressés au lecteur, retrait du doublon Laparra, FormIA ; anglais américain program/organization. |
| `src/app/(rev01)/rev01.css` | Références en General Sans 600/400, filets neutres de 1 px, deux colonnes dès 1024 px, une en dessous. Retrait gauche supprimé dans la première colonne parcours et dans les deux sur mobile ; séparateur conservé. Les h2 parcours/maison héritent déjà de la même règle `.home-s h2`, sans nouvel override. |
| `src/app/(rev01)/dossiers/page.tsx` | Anonymisation sauf accord du client, FR/EN. |
| `src/system/jsonld.ts` | Description Organization remplacée par celle prescrite pour les logiciels métier et la transformation IA. |
| `scripts/generate-llms.mjs`, `public/llms.txt` | Description et entrée de l'accueil alignées ; fichier public régénéré, jamais édité directement. |
| `scripts/lib/public-clients.mjs` | Noms privés séparés des références publiques ; contrôle strict du Journal ; analyse AST des listes structurées du DICT, sans exécuter la page. |
| `scripts/false-claims-check.mjs`, `scripts/journal-gates.mjs`, `scripts/publish-journal.mjs` | Pages autorisées selon la liste ; contenu et publisher du Journal refusent tous les clients connus, même publics. Message du publisher corrigé. Le publisher n'a pas été exécuté hors de son test isolé existant en dry-run. |
| `AGENTS.md`, `TRUTH.md`, `AI_CONTEXT.md` | Règle clients actuelle, attributions Joone/SNCF et exception Journal ; état de validation actualisé dans AI_CONTEXT. CLAUDE.md reste un import d'AGENTS.md et n'a pas été modifié. |
| `docs/positionnement-deux-parcours/plan.md`, `docs/positionnement-deux-parcours/assertions.md`, ce rapport | Plan R4, inventaire des assertions et compte rendu. |

Les changements R1 à R3 du hero, des métadonnées, de l'image Open Graph et des
notices de langue restent présents. H1, CTA et destinations sont conservés.
Aucun nouveau token, couleur, police, rayon, logo, lien tiers, dépendance ou schéma.
Les articles du Journal et les assets vendorisés restent inchangés.

## Tests ajoutés ou renforcés

| Fichier | Avant → après |
| --- | --- |
| `tests/public-clients.test.mjs` | Le publisher acceptait Laparra → tous les noms publics et l'alias sont refusés dans le Journal, acceptés sur l'accueil. Quatre mutations Laparra → dix mutations, un nom fictif injecté dans chaque référence FR/EN. Client privé injecté : Clevery → Naval Group. Nouveau test d'intégration de la vraie gate dans un dossier temporaire : accueil accepté, six variantes Journal refusées. |
| `tests/audit-truth-copy.test.mjs` | Comptage de deux chaînes contenant un point médian → deux listes FR/EN, références exactement dans la liste canonique, notes/kickers/descriptions renseignés. Regex de note fragile face aux objets imbriqués → lecture AST de la note. Contrôles sémantiques ajoutés : Joone accompagné, SNCF formée avec Arkel ; ancien positionnement interdit dans JSON-LD et llms. |
| `tests/brand-os-render.test.mjs` | Cinq spans et noms recherchés aussi dans parcours → cinq lignes nom/description, noms canoniques, note unique non vide, aucune action ni image dans la liste. Ancien positionnement interdit dans chaque rendu : neuf routes institutionnelles FR/EN, tous les articles, données structurées, métadonnées, flux et 404 ; llms.txt contrôlé aussi. |
| `tests/conformity-home.spec.ts` | Note clients seule → note et appartenance de chaque nom à la liste. Quatre tests parcours FR/EN à 1440/390 renforcés : égalité des tailles h2, premier h3 aligné au h2, paragraphes alignés à leurs h3. Dix nouveaux cas clients FR/EN à 1440/1024/1023/390/375 : noms, poids 600/400, famille commune, filets, seuil responsive, absence d'actions/images/débordement. |
| `tests/doctrine-visible.spec.ts` | Sélecteur `> span` → `> li` ; cardinalité, retour à la ligne et vérification des rectangles de texte conservés. |

Aucun test entier supprimé. Les contrôles de fond antérieurs restent présents.
Les tests navigateur réutilisent le deny-all réseau et bloquent les service workers.
Le rendu serveur bloque fetch, HTTP, HTTPS et les connexions socket, sans serveur
à l'écoute. L'inventaire R2/R3 est conservé dans
[assertions.md](positionnement-deux-parcours/assertions.md), complété par R4.

## Résultats d'exécution

Les suites Node/SSR et Brand OS ont été lancées après le build Webpack afin de
vérifier les nouveaux artefacts compilés. Résultats finaux :

| Commande | Résultat |
| --- | --- |
| `npm run lint` | Réussi. |
| `npx tsc --noEmit` | Réussi. |
| `npm test` | 110/110 réussis, aucun ignoré. |
| `npm run test:brand-os` | 24/24 réussis. |
| `npm run qa:claims:rev01` | Réussi. |
| `npm run build` | Interrompu après absence de progression en compilation Turbopack ; non validé. |
| `npm run build -- --webpack` | Réussi, 58 pages générées. |
| `npm run qa:brand:rev01` | Réussi. |
| `npm run qa:network:rev01 -- --max-failures=1 --workers=1` | 326 tests découverts ; 1 échec de lancement Chromium, 325 non exécutés. |
| `git diff --check` | Réussi. |

Le test d'intégration clients passe : les six variantes injectées dans le Journal
échouent volontairement dans le sous-processus de contrôle ; ce sont des résultats
attendus, pas des échecs de la suite.

## Contrôle textuel final dans src/ et public/

- `anonymisons tous` : aucune occurrence.
- `data and AI firm` : aucune occurrence.
- `maison de données` : aucune occurrence.
- `Prospect B` : quatre occurrences, toutes dans `src/system/components/ProductScene.tsx`, aucune hors scène produit.
- `organisation` : aucune occurrence dans la copie anglaise. Restent uniquement les identifiants et commentaires français de `src/lib/interet/projection.ts`, `src/lib/registry/preuves.ts` et `src/app/(rev01)/layout.tsx`.

## Limites de validation

Chromium est refusé avant toute navigation par macOS :
`bootstrap_check_in ... MachPortRendezvousServer ... Permission denied (1100)`.
Les mesures de géométrie, le contraste et les captures ne sont donc pas validés
ici. Aucun serveur de test n'a été lancé manuellement, conformément au handoff ;
ce checkout ne contient pas de configuration Playwright webServer. La batterie
externe devra fournir le serveur local puis rejouer les 326 tests.

Turbopack reste non validé. Webpack réussit sans changement de package.json.
Les avertissements préexistants metadataBase et détection ESM du fichier TypeScript
restent non bloquants ; les URL de métadonnées du rendu serveur passent leurs tests.

Aucun point fonctionnel de R4 n'est laissé de côté. La validation navigateur et
la revue visuelle restent à effectuer sur l'hôte autorisé avant publication.
