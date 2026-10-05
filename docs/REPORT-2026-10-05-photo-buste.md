# Rapport — photo buste, 05/10/2026

Implémentation de `docs/CODEX-SPEC-2026-10-05-parrit-ai-photo-buste-v1.md`.
AGENTS.md, AI_CONTEXT.md, TRUTH.md et le guide local Next.js public-folder lus
avant modification. Au départ, seule la spec était non suivie ; elle est conservée.
Aucun commit, push, déploiement ni écriture distante.

## Modifications

- `public/brand/founder/` : quatre exports buste AVIF/WebP 340/680 copiés octet
  pour octet depuis le manifeste canonique en lecture seule :
  `/Users/paullarmaraud/parrit-canon-visual-system/brand/visual/sites/handoff/2026-10-05/photos-linkedin-buste/`.
  Les quatre anciens exports sont supprimés. Aucune retouche ou recompression.
- `src/app/(rev01)/page.tsx` : seules les URLs des deux sources et du repli img
  changent. Srcset 340w/680w, sizes, dimensions 340×453, alt FR/EN, légende,
  lazy loading, décodage et mise en page inchangés.
- `tests/fixtures/founder-photo.json` : quatre entrées extraites du manifeste canon.
- `tests/founder-photo.test.mjs` : provenance et SHA256 mis à jour ; nouveau test
  interdisant les anciens exports dans les noms et contenus de src/public.
- `tests/brand-os-render.test.mjs` et `tests/brand-os.spec.ts` : attentes SSR et
  navigateur adaptées aux nouveaux chemins ; assertions géométriques conservées.
- `AI_CONTEXT.md` : décision et état de validation actualisés.

Les documents historiques restent inchangés. Les anciennes URLs n'existent plus
comme ressources ou références actives ; leur motif reste volontairement dans
le test qui en interdit le retour.

Écritures limitées au checkout local, réversibles par restauration des fichiers
suivis et retrait des nouveaux exports. Aucun CSS, token, autre section ou donnée
métier modifié. Le lockfile et la spec fournie restent inchangés.

## Vérifications

Dépendances installées depuis le cache avec `npm ci --offline --ignore-scripts`
(462 paquets). Baseline photo avant modification : 2/2 tests passent.
Lint, claims et marque de référence passent également.

| Commande | Résultat |
| --- | --- |
| `npm run lint` | OK |
| `npm run qa:claims:rev01` | OK |
| `npm run build -- --webpack` | OK, 55 pages générées |
| `npm run qa:brand:rev01` | OK |
| `npx tsc --noEmit` | OK |
| `node --test tests/founder-photo.test.mjs` | OK, 3/3 |
| `npm run test:brand-os` | OK, 20/20, aucun skip |
| `git diff --check` | OK |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | Bloqué : Chromium refuse de démarrer ; 1 échec infrastructure, 196 tests non exécutés |

Preuve par mutation : une référence temporaire à l'ancien export dans public
fait échouer le nouveau test comme attendu. Fichier retiré dans un bloc finally ;
la batterie Brand OS passe ensuite. SHA256 et tailles des quatre exports vérifiés
contre le manifeste ; rendu serveur compilé FR/EN vérifié sans réseau.

Webpack choisi pour éviter les blocages Turbopack documentés dans les rapports
précédents. Avertissement préexistant : metadataBase absent sur certaines
métadonnées, repli localhost:3000 ; hors périmètre photo.

## Blocage et preuve restante

Chromium échoue avant navigation : bootstrap_check_in, Permission denied (1100),
SIGTRAP dans le sandbox macOS. Aucun serveur local lancé, conformément aux
instructions AI_CONTEXT.md ; aucun contrôle réseau ou test assoupli.
La preuve visuelle responsive et le chargement navigateur restent à établir sur
l'hôte : démarrer le build au port 3210 puis lancer `npm run qa:network:rev01`.
Aucun résultat visuel navigateur ou résultat de production n'est revendiqué.
