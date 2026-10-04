# Rapport — photo LinkedIn, 05/10/2026

Implémentation de `docs/CODEX-SPEC-2026-10-05-parrit-ai-photo-linkedin-v1.md`.
Instructions AGENTS.md, AI_CONTEXT.md, TRUTH.md et guide local Next.js public-folder
lus avant modification. État initial : seule la spec était non suivie ; elle est
préservée. Aucun commit, push ni déploiement.

## Périmètre et provenance

- `public/brand/founder/` : quatre fichiers `parrit-ai-founder-linkedin-3x4-{340,680}.{avif,webp}`
  copiés octet pour octet depuis `/Users/paullarmaraud/parrit-canon-visual-system/brand/visual/sites/handoff/2026-10-04/photos-linkedin/`.
  Les quatre exports DSC00629 sont supprimés. Source consultée en lecture seule ;
  aucune transformation d’image. Les tailles et SHA256 sont contrôlés par la fixture.
- `src/app/(rev01)/page.tsx` : seules les URLs de la picture et son commentaire
  changent. Grille, srcset 340w/680w, sizes, dimensions 340×453, alt FR/EN,
  légende, lazy loading et décodage asynchrone conservés.
- `tests/fixtures/founder-photo.json` : les quatre entrées Parrit.ai du manifeste source.
- `tests/founder-photo.test.mjs` : provenance et empreintes actualisées ; nouveau
  contrôle récursif des noms et contenus dans src/public, insensible à la casse.
- `tests/brand-os-render.test.mjs` : attente du nouveau WebP dans le rendu serveur FR/EN.
- `tests/brand-os.spec.ts` : nouvelles URLs srcset et assertion explicite du src
  de repli ; géométrie, alt, légende et contrôles responsive existants conservés.
- `AI_CONTEXT.md` : état et décision photo actualisés par ajout.

Écritures limitées au checkout local, sans système distant ni données métier.
Retour arrière possible en restaurant les anciens fichiers suivis et en retirant
les quatre nouveaux exports. Aucune modification des tokens, polices, hero, scène,
offres, Journal ou CSS.

## Vérifications

Dépendances absentes au départ : `npm ci --offline --ignore-scripts` a installé
462 paquets depuis le cache local ; lockfile inchangé. Node exécuté : v26.3.0.

Baseline avant modification : test photo 1/1, lint, claims et marque verts après
installation. Le build Turbopack est resté sans progression en compilation et a
été interrompu ; les tests de contrats lancés avant disponibilité du build ont
renvoyé deux erreurs de dossier `.next/server/app` absent (10/12 réussis).
Ils passent tous après le build Webpack.

| Commande | Résultat final |
| --- | --- |
| `npm run lint` | OK |
| `npm run qa:claims:rev01` | OK |
| `npm run build -- --webpack` | OK, 55 pages générées |
| `npm run qa:brand:rev01` | OK |
| `./node_modules/.bin/tsc --noEmit` | OK |
| `npm run test:brand-os` | OK, 18/18, aucun skip |
| `node --test tests/founder-photo.test.mjs` | OK, 2/2 |
| `git diff --check` | OK |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | Bloqué au lancement de Chromium ; 1 échec infrastructure, 182 non exécutés |

Le test de régression a aussi été éprouvé par mutation : ajout temporaire d’une
référence `DSC00629` dans public, échec attendu, retrait dans un bloc finally,
puis succès 2/2. Aucun fichier de mutation conservé.

Le build et le rendu serveur émettent un avertissement metadataBase absent sur
certaines métadonnées (repli localhost:3000), hors du périmètre photo.

## Limite et preuve restante

Chromium échoue avant toute navigation : `bootstrap_check_in … Permission denied
(1100)`, SIGTRAP, sandbox macOS. Aucun serveur local lancé, conformément à
AI_CONTEXT.md. Aucune assertion navigateur assouplie ; deny-all réseau conservé.

La preuve locale acquise est l’identité SHA256 des quatre assets et le rendu
serveur compilé FR/EN avec la nouvelle photo et les textes attendus. La preuve
visuelle responsive et le chargement réel dans un navigateur restent à établir
hors sandbox : démarrer le build sur le port 3210 puis exécuter
`npm run qa:network:rev01`. Aucun rendu navigateur ni résultat de production
n’est revendiqué par ce rapport.
