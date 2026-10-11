# Alignement et copy FR/EN, 11/10/2026

Implémentation de `CODEX-SPEC-2026-10-11-parrit-ai-alignement-anti-slop-v1.md`.
La spec était le seul fichier non suivi à l'arrivée et a été conservée intacte.
Aucun commit, push, déploiement, appel à une base métier ou envoi de message.

## Modifications

- `src/app/(rev01)/rev01.css`, `src/system/system.css` : grille 1160 px avec
  gouttières 40/20 px, accueil/header/footer/article/legal alignés ; ponctuation
  dans le cadre du hero ; centrage des notes ; dates et codes sur une ligne ;
  attaque des heros 98 px ; espace sous les titres 34 px ; rythme de corps commun ;
  sous-grilles des cartes ; bordure de preuve Systems ; calendrier pleine largeur ;
  convergence des appels finaux ; boutons du header 48 px ; liens en ligne et
  garde-fous corrigés ; filets du Journal pleine largeur et filet final unique ;
  téléphone ancré à gauche sur mobile et résultat CRM conservé en bas, libellé
  immédiatement au-dessus de l'image (variante autorisée par l'audit n° 27).
- Pages `src/app/(rev01)/{page,systems/page,standard/page,manufacture/page,
  dossiers/page,commission/page,build-with-you/page,journal/page,legal/page,
  journal/[slug]/page,sketch/[id]/page}.tsx` : copy FR/EN et pieds locaux uniformes,
  retrait des redondances prévues, états des dossiers et chiffres conservés.
- `src/system/examination.ts` : constante EXAM_NOTE par langue. La note BWY garde
  explicitement « offert / Free ». Cal conserve sa forme courte.
- `src/system/components/{AgentEsquisse,QuickCapture,ProductScene,HarnessBadge,
  CalInline,RegistryLine,RegistrySnapshot,RevFooter,K,SystemCard}.tsx` : copy,
  labels accessibles, dates localisées, séparateurs insécables, rythme CSS.
- `src/lib/server/interets.ts` : mail de capture aligné sur la nouvelle formulation.
- `src/app/opengraph-image.tsx`, `src/app/(rev01)/journal/[slug]/og/route.tsx`,
  `src/system/jsonld.ts`, `scripts/generate-llms.mjs`, `public/llms.txt` : métier,
  H1 de partage, retrait des codes et de la tagline hors footer, six énoncés du
  Standard repris exactement dans le fichier généré.
- `AGENTS.md`, `AI_CONTEXT.md` : documentation corrigée, Opening conservé sans
  import, critères 01…06, registry sans révision, état de validation documenté.
- `package.json` : nouvelles specs intégrées à `qa:network:rev01` ; test Node
  intégré aussi à `test:brand-os`, déjà exécuté par la CI existante.

Le paquet Brand OS, les polices, les images, les articles MDX, les certificats,
les prix et les états 26-002/26-003 restent intacts. Pas de modification Cal.com,
de traduction des articles ou d'arbitrage sur les roses/rayons.

## Tests ajoutés et adaptés

- `tests/anti-slop-copy.spec.ts` : 18 parcours (neuf routes FR/EN), texte rendu,
  alt et aria-label, cinq interdictions ; vérifie aussi l'esquisse après interaction.
- `tests/alignment-grid.spec.ts` : 40 parcours (neuf routes et un article FR/EN,
  1440/375), bords du logo/titre/sections/footer, centrage de note, codes et dates,
  hauteur 48 px du header, largeur Cal, footer local unique, débordements et captures.
- `tests/anti-slop-copy.test.mjs` : trois tests sur le générateur réellement exécuté,
  les six énoncés du Standard, la note partagée et le mail automatique.
- `tests/brand-os-render.test.mjs` : contrôle supplémentaire des interdictions sur
  le vrai HTML compilé des 18 pages, avec réseau interdit et sans serveur écoutant.
- Assertions éditoriales adaptées dans `audit-truth-copy`, `conformity-home`,
  `conformity-standard`, `product-scene`, `brand-os-render`, `systems`, `system-card`,
  `harness-certificates` et `doctrine-visible` ; le mock de l'esquisse autorise
  explicitement le nouveau module de notes. Aucune assertion géométrique,
  typographique, de contraste, de propriété ou de prix assouplie.

## Résultats

| Commande | Résultat |
|---|---|
| `npm ci` | Réussi, 462 paquets installés |
| `npm run lint` | Réussi |
| `npx tsc --noEmit` | Réussi |
| `npm run build` | Turbopack interrompu après absence de progression |
| `npm run build -- --webpack` | Réussi, 57 pages générées |
| `npm test` | 107/107 tests passent |
| `npm run qa:claims:rev01` | Réussi |
| `npm run qa:brand:rev01` | Réussi |
| `npm run test:brand-os` | 23/23 tests passent |
| `git diff --check` | Réussi |
| `npx next start -p 3210` | Bloqué : `listen EPERM`, port interdit par le sandbox |
| Deux nouvelles specs Playwright | 58 tests découverts ; Chromium refusé avant navigation |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | 280 tests découverts ; même refus Chromium, arrêt au premier lancement |

Le build affiche l'avertissement metadataBase déjà présent sur certains rendus.
Le contrôle SSR vérifie néanmoins les destinations OG canoniques attendues.

## Validation restante sur l'hôte

Chromium échoue avec `bootstrap_check_in ... MachPortRendezvousServer: Permission denied (1100)`.
Aucune mesure ni capture navigateur n'a donc été obtenue ici. Le passage du HTML
serveur et des contrôles statiques ne prouve pas l'alignement au pixel.

Rejouer le build canonique, démarrer Next sur 3210 puis lancer la batterie réseau
complète. Inspecter les captures FR/EN 1440/375, notamment les cartes en subgrid,
le hero, le footer, l'article et la scène produit. La sonde de contre-mesure en
production relève de l'étape après publication, hors mandat de cette intervention.
