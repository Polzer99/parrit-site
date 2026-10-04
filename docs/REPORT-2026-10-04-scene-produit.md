# Scène produit — compte rendu du 04/10/2026

Implémentation terminée ; validation navigateur et captures **non réalisées**, lancement de Chromium interdit par le sandbox macOS. Aucun commit, push, merge ni déploiement.

## Périmètre et sources

- Dépôt courant explicitement mandaté, HEAD `225040725035b579b4f4d834c20d2aa10cf3bc69`, identique à la base de la spec.
- Instructions lues : `AGENTS.md`, `AI_CONTEXT.md`, `TRUTH.md`, spec scène produit et doctrine Recursive Agent Harness. Guide Next local Server/Client Components et Context7 consultés.
- Plan : baseline → assets et composant serveur → intégration limitée à `home-s-build` → tests/relecture indépendante → correction ciblée → vérification. Deux passes de correction au plus ; arrêt des essais navigateur après confirmation du même refus d'environnement.
- État initial : seul le fichier de spec était non suivi ; il est conservé intact. Aucun autre changement préexistant.
- TARGET_SYSTEM : checkout local ; ENVIRONMENT : sandbox ; WRITE_SCOPE : section accueil, composant, assets, tests, documentation ; REVERSIBLE : oui ; ROLLBACK : retrait sélectif de ce diff ; BACKUP : fichiers suivis dans HEAD, sources d'assets canoniques en lecture seule ; EXPECTED_ROWS : aucune écriture de données.
- FACT : le PNG messagerie mesure **1434 × 2400**, contrairement aux 2399 px de la spec. SOURCE : manifeste canon du 04/10 et métadonnées PNG lues avec Sharp. EVIDENCE : empreinte SHA256 identique et tests de dimensions. Les attributs HTML utilisent 2400.

## Fichiers modifiés ou ajoutés

| Fichiers | Changement |
|---|---|
| `src/system/components/ProductScene.tsx` | Composant serveur réutilisable paramétré : titre, phrase, étapes, images, étiquette, positions, mention. Deux picture AVIF/WebP puis PNG, lazy/async, dimensions et alt localisés. Aucun JS client. |
| `src/app/(rev01)/page.tsx` | Remplacement strict du copy et des trois cartes de construction par la scène FR/EN prescrite. |
| `src/app/(rev01)/rev01.css` | Styles de scène : trois colonnes au-delà de 1024, texte au-dessus des images à 768–1024, pile en dessous. Repères de 28 px via cercle de découpe, sans rayon ni ombre CSS. Tokens et polices existants. Suppression des styles des cartes retirées. |
| `public/brand/scenes/` | Deux PNG copiés octet pour octet et huit dérivés WebP/AVIF. |
| `tests/fixtures/product-scene.json` | Copie du manifeste canon avec provenance. |
| `tests/product-scene.test.mjs` | Quatre tests Node : SHA256, tailles et dimensions des PNG ; dimensions, ratio, alpha et poids des dérivés. Chemin du manifeste en commentaire. |
| `tests/product-scene.spec.ts` | Dix parcours navigateur, deny-all partagé : FR/EN × 375/768/1024/1025/1440. Copy, anonymat, mention, six repères et positions, images chargées, formats, dimensions, composition, débordement des conteneurs et du texte. Capture de section jointe à chaque test. |
| `tests/brand-os-render.test.mjs` | Vérification sans réseau du HTML compilé : copy FR/EN exact, anonymat, ordre 1-2-3 du texte puis des images, deux picture lazy/async, absence des cartes et de la conclusion retirées. |
| `tests/doctrine-visible.spec.ts` | Groupe des seuls `.scene-marker` par scène compté comme un éclat ; emprise verticale complète conservée pour détecter les autres accents. Nettoyage des sélecteurs de l'ancien verdict. |
| `package.json` | Tests scène ajoutés à `test:brand-os` et `qa:network:rev01`. |
| `AI_CONTEXT.md`, présent rapport | État et limites de validation. |

Hero, déroulement, photo, preuve, offres, Journal, header, footer, tokens, polices et autres pages : aucune modification fonctionnelle. Aucun changement de registre, d'intégration ou de base de données.

Dérivés produits avec Sharp déjà installé avec Next : pour chaque PNG, `resize({ width })`, puis `toFormat(format, { quality: 85 })`. Largeurs 480/960 pour la messagerie, 430/860 pour la fiche, formats WebP/AVIF. Aucun crop, aplatissement, retouche ni transformation des PNG sources ; canal alpha conservé.

## Tests existants : avant / après

- Recherche dans `tests/` : aucune assertion existante ne figeait le texte des trois cartes ou la phrase de conclusion.
- `doctrine-visible.spec.ts` : avant, `.home-s-verdict` était inclus dans les contrôles de prose et exclu des kickers ; après, ces références mortes sont supprimées. Les contrôles des autres éléments restent inchangés.
- Éclat rose : avant, chaque surface rose était comptée séparément ; après, seuls les repères appartenant au même `.product-scene` partagent un groupe. Les autres surfaces et le seuil de 844 px restent contrôlés sans assouplissement.
- `brand-os-render.test.mjs` : nouvelles assertions de scène, sans suppression des assertions du reste de l'accueil.

## Exécution

Dépendances absentes du checkout : lien local ignoré `node_modules` vers `/Users/paullarmaraud/parrit-site/node_modules`. Aucune installation ou modification dans ce dépôt source de dépendances.

| Contrôle | Baseline | Candidat final |
|---|---|---|
| `npm run lint` | OK | OK, sans avertissement |
| `npx tsc --noEmit` | — | OK |
| `npm run qa:claims:rev01` | OK | OK |
| `npm run qa:brand:rev01` | OK | OK |
| `npm run build` | — | Bloqué par Turbopack : lien node_modules hors racine |
| `npm run build -- --webpack` | — | OK, compilation et génération des pages |
| `npm run test:brand-os` | 10/13, trois tests bloqués par l’absence de `.next/server/app` et `.next/required-server-files.json` | **17/17** après build, dont 4 nouveaux tests d'assets et rendu compilé enrichi |
| `npm run test:doctrine` | — | 10/10 |
| `npm run test:privacy` | — | 9/9 |
| `npm run test:entity` | — | 7/7 |
| `npm run test:journal` | — | 9/9 |
| `git diff --check` | — | OK |
| Playwright scène, Chromium, 1 worker, arrêt au premier échec | — | Refus au lancement du navigateur, aucune navigation |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | — | Même refus Chromium avant le premier test effectif |

Total Node final : **52/52**. L'avertissement Node MODULE_TYPELESS_PACKAGE_JSON de `test:entity` est préexistant ; aucun ajustement global du projet pour le masquer.

Les tests Playwright étaient six lors de la tentative ; quatre cas de seuil 1024/1025 ont ensuite été ajoutés et leur collecte a été vérifiée (dix cas). La batterie réseau tentée comptait 179 cas avant cet ajout. Aucun résultat navigateur n'est revendiqué comme passé.

Erreur précise : `bootstrap_check_in org.chromium.Chromium.MachPortRendezvousServer … Permission denied (1100)`, processus arrêté par SIGTRAP. Aucun serveur n'a été lancé dans le sandbox, conformément aux instructions locales. Le build Webpack et les tests de rendu serveur ne nécessitent pas de port d'écoute.

## Relecture et preuve visuelle restante

Relecture indépendante, lecture seule :

1. Assertion Playwright sur plusieurs `<source>` corrigée en count puis nth(0)/nth(1).
2. Colonne gauche de 157 px à largeur écran 1025 : titre au cran existant `--t-xl` entre 1025–1200 et `overflow-wrap: anywhere`. Tests de seuil et rectangles Range ajoutés pour détecter le texte qui dépasserait sa boîte.
3. Manifeste 2400 px confirmé ; aucun autre écart concret signalé. Pas de validation visuelle par le relecteur.

**Captures 1440, 768, 375 FR et EN : absentes, à produire sur l'hôte.** Les tests écrivent `scene-{locale}-{width}.png` dans leur dossier `test-results/` et les joignent au rapport Playwright. Ne pas considérer la disposition, le contraste mesuré ou l'absence de chevauchement comme visuellement validés à ce stade.

Sur l'hôte avec dépendances installées, exécuter la batterie prescrite : lint, claims, build, brand, test:brand-os ; lancer `next start -p 3210`, puis `qa:network:rev01`. Les dix tests de scène produisent automatiquement les six captures prescrites et les quatre captures de seuil supplémentaires. Contrôler également les accents avec les sections voisines.

PRODUCTION_PROOF : non recherchée, aucun déploiement autorisé. La preuve actuellement disponible est la compilation, le rendu serveur FR/EN réel sans réseau et l'intégrité des fichiers. La preuve responsive navigateur reste ouverte.
