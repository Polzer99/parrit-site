# PRODUCT-LIVING-HERO-PROOF-V1

> **DÉPASSÉ SUR DEUX POINTS, LE 2 AOÛT 2026.**
> La preuve du hero est passée de **six moments en 9,3 s** à **cinq chapitres en 12,5 s**,
> et Ink est devenu le traitement principal. L'état courant fait foi dans
> [`SILICON-VALLEY-AI-PRODUCT-STANDARDS.md`](./SILICON-VALLEY-AI-PRODUCT-STANDARDS.md).
> Le reste de ce document — arbitrage D + V2, charpente, rôle de la preuve,
> variantes Paper et Ink, défauts trouvés — reste valable.

**Tranche du 1er août 2026.** Test d'intégration, expérimental.
**Aucune direction n'est déclarée approuvée.** Aucun ADR n'est créé.

Route : `/art-direction-lab/product-living-hero-proof`
Implémentation : `src/app/art-direction-lab/product-living-hero-proof/`

| Route conservée | Rôle |
|---|---|
| `/art-direction-lab/concept-d` | prototype de recherche, charpente d'origine |
| `/art-direction-lab/product-living-scene` | scène V1 |
| `/art-direction-lab/product-living-scene-v2` | démonstration longue, cible du lien |
| `/art-direction-lab/product-living-scene-v2-premium` | variante de finition |

Aucune n'est modifiée par cette tranche.

---

## Arbitrage D + V2

Concept D avait la bonne charpente de homepage — eyebrow, titre, promesse, appel à l'action, panneau de preuve — et ratait l'exécution de ce panneau : statique, éditorial, froid, un système raconté plutôt que vécu.

La scène V2 réussit exactement la preuve, et ne fait pas une homepage : aucune promesse, aucun appel à l'action, et trop de complexité pour un premier écran.

L'hypothèse testée ici est donc : **charpente de D, preuve vivante de V2 réduite à six moments.**

## Rôle de la charpente

De Concept D on reprend la **hiérarchie** et la **logique de conversion**, pas les styles. Ni ses filets, ni son registre de rapport, ni ses tableaux.

La copy vient **mot pour mot** de `../content.ts`, le socle partagé du laboratoire, et les libellés d'état de `../concept-d/system.ts`. Aucun mot n'est écrit dans cette tranche, et le harnais compare le texte affiché au socle pour le prouver.

## Rôle de la preuve

Le panneau est un **renderer dédié**, pas la scène V2 miniaturisée. Il consomme le même scénario, les mêmes agents et les mêmes surfaces, et n'en montre qu'une fraction.

**Ce qui est délibérément absent** : les dix états, les quatre versions, la liste des agents, la liste des sources, les identifiants internes, les références de politique, les codes de module, les commandes de lecture. Tout cela reste dans la démonstration longue, atteignable par un lien secondaire qui ne concurrence pas l'appel à l'action commercial.

## Les six moments

| # | Moment | Durée | Ce que le visiteur comprend |
|---|---|---|---|
| 01 | Une demande arrive | 1 300 ms | quelque chose vient de se produire |
| 02 | Le système comprend | 1 400 ms | l'objet de travail apparaît |
| 03 | Travail en parallèle | 2 300 ms | trois effets, décalés : vérifié, manquant, préparé |
| 04 | Le système s'arrête | 1 600 ms | **la machine ne décide pas seule** |
| 05 | Un humain tranche | 900 ms | la décision est portée par quelqu'un de nommé |
| 06 | L'action est préparée | 1 800 ms | message, agenda, dossier |

**Total 9 300 ms**, plus **1 100 ms de respiration** : la boucle ne redémarre jamais d'un coup sec, la scène s'éteint doucement avant de repartir.

Le travail parallèle est montré **par ses effets**, jamais par une liste d'agents. Le moment 03 fait apparaître ses trois lignes à 0, 700 et 1 400 ms.

La boucle **s'arrête quand l'onglet n'est plus visible** et aucun timer ne survit au démontage.

## Une divergence assumée avec le moteur

La scène longue s'arrête **réellement** et attend une décision humaine. Le hero ne peut rien exiger d'un visiteur : il suspend visiblement, puis reprend. C'est la seule divergence, elle est dictée par le contexte, et elle est isolée dans `useBoucle.ts` — le moteur de la scène n'est pas touché.

## Variante Paper

Panneau clair sur page claire, différencié par un fond gris froid, un filet d'encre en tête et des ombres dures courtes. Le rouge reste porté par le texte : sur papier il passe à 5,9:1.

**Risque** : la preuve peut se fondre dans la page et perdre son statut d'objet technologique.

## Variante Ink

Le panneau forme un champ sombre autonome, tenu par la grille du hero, aligné sur la colonne éditoriale, avec la même typographie. Il ne flotte pas comme une carte venue d'ailleurs.

**Risque** : effet de bloc rapporté, et un arbitrage de fond — le site est en papier.

**Une contrainte réelle est apparue ici.** Sur fond d'encre, le rouge canon `#D1132F` plafonne à **3,08:1** pour du petit texte, sous le seuil de 4,5:1. Plutôt que d'inventer un second rouge et de casser la palette, le rouge devient un **marqueur** — un filet, un cran de progression — et le texte reprend une couleur lisible. Sur papier il reste porté par le texte. C'est un écart de traitement entre les deux variantes, assumé et documenté.

## Mobile

Ordre : eyebrow, titre, promesse courte, **preuve**, appel à l'action.

L'appel à l'action passe sous la preuve grâce à `display: contents` sur la colonne éditoriale : les enfants remontent au niveau de la grille et se réordonnent, sans toucher au balisage ni à l'ordre de lecture d'un lecteur d'écran.

Les trois sorties passent en colonne : une seule transformation majeure à la fois. Rien sous 12 px, aucune commande.

## Lien vers la démonstration complète

Lien secondaire sous le panneau, vers `/art-direction-lab/product-living-scene-v2`. Il pointera vers la variante Premium si celle-ci devient la référence après arbitrage.

## Tests

`node scripts/hero-proof-qa.mjs`. Les harnais de Concept D, V1, V2 et Premium restent séparés et inchangés.

| Test | Résultat |
|---|---|
| Hero Conversion Structure | ✅ titre, promesse, appel à l'action, preuve, lien vers la démo longue |
| Copy inchangée | ✅ eyebrow, promesse et appel à l'action comparés au socle partagé |
| Six Moment | ✅ les six, dans l'ordre, plus la respiration |
| Human Stop | ✅ arrêt tenu au moins 1 200 ms, aucune sortie visible avant |
| No Interaction Required | ✅ boucle complète observée sans un seul clic |
| No Jargon | ✅ 28 termes interdits absents du texte affiché |
| Proof Not Decoration | ✅ au moins six informations métier distinctes |
| Scene Legibility | ✅ rien sous 13 px dans la preuve, chaque bloc au-dessus de 2 500 px² |
| Paper / Ink Parity | ✅ texte et structure rigoureusement identiques |
| Reduced Motion | ✅ les six moments subsistent, aucune durée longue |
| Mobile First View | ✅ preuve visible dans le premier écran, appel à l'action sous elle |
| Contraste WCAG | ✅ garde-fou ajouté, voir ci-dessous |
| Veille, démontage, débordement, WebKit | ✅ |
| `lint`, `tsc`, `build` | ✅ |

**Retell Test : il appartient à Paul.** Montrer une boucle, puis demander « qu'est-ce que tu viens de voir ». Il échoue si la réponse est « un schéma », « des cartes », « un tableau de bord » ou « je ne sais pas ce que ça fait ».

## Défauts trouvés en chemin

- **Le libellé de l'appel à l'action était invisible**, encre sur encre à 1:1. La feuille parente du laboratoire déclare `.lab a` en (0,1,1), qui l'emporte sur une simple classe. Troisième variante du même piège de spécificité dans ce dépôt, après `.pls button` et `.pv2 button`. **Un garde-fou de contraste WCAG a été ajouté au harnais** : c'est lui qui a trouvé le défaut, et il empêchera le suivant.
- Ma première version du calcul de contraste lisait les fonds semi-transparents comme opaques et inventait trois défauts inexistants. Corrigée par composition des couches alpha.
- Deux gris réellement trop clairs, à 4,41 et 4,23:1, corrigés.

## Arbitrages restant à Paul

1. **Paper ou Ink.** Rien ici ne désigne de gagnant.
2. **La boucle est-elle comprise** par quelqu'un qui n'a jamais vu la scène.
3. **La place de la preuve dans le hero** : 52 % de la largeur, est-ce trop, assez, ou pas assez.
4. **Le rouge sur encre** : accepter qu'il devienne un marqueur, ou renoncer à la variante Ink.
5. **La cible du lien** vers la démonstration longue : V2 ou Premium.

## Hors périmètre

Le reste de la homepage · la copy · les offres · le prix · le design system · la homepage publique · les scènes existantes.
