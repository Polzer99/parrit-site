# Audit vérité, lisibilité et Harness — implémentation du 08/10/2026

## Périmètre et sources

Spec : `CODEX-SPEC-2026-10-08-parrit-ai-audit-verite-lisibilite-harness-v1.md`.
Checkout demandé par Paul, base `85465b5`. La spec était le seul fichier non suivi au départ ; elle est conservée sans modification. AGENTS.md, AI_CONTEXT.md, TRUTH.md et la doctrine Recursive Agent Harness lus avant modification. Les rapports A/B/C absents de ce checkout ont été lus dans `/Users/paullarmaraud/codex-work/spec-parrit-audit-2026-10-08/docs/audits/2026-10-08/`.

Écritures limitées aux sources et tests locaux ; aucune donnée métier, migration, communication externe, publication, opération de commit/push/déploiement. Modifications réversibles via le diff local. Trois étapes : contenu, lisibilité et certificats, puis intégration/revue indépendante et corrections ciblées. Preuve de production hors périmètre et non obtenue.

## Fichiers et comportement

- `content/journal/{self-hosting-latency-cost,what-is-parrit-ai,what-a-pilot-skips-to-look-finished,what-you-rent-can-be-taken-back,glm-5-2-sovereignty,publishing-without-human-review,what-a-rollback-takes-with-it}.mdx` : remplacements prescrits, retrait des affirmations de livraison non étayées et examen de quinze minutes.
- `src/app/(rev01)/{page,manufacture/page,dossiers/page,systems/page,build-with-you/page,legal/page,journal/page}.tsx` : copy EN/FR, Lemlist, autonomie, mentions légales et étiquettes EN individuelles. `sketch/[id]/page.tsx` et `TRUTH.md` retirent les anciennes mentions de certification des systèmes.
- `scripts/generate-llms.mjs` et `public/llms.txt` : engagements prospectifs, Standard non accréditant, propriété par conception, retrait de Lille et forme SAS.
- `src/system/tokens.css`, `src/app/(rev01)/rev01.css`, `src/system/components/{RevHeader.tsx,ProductScene.css}` : jeton bouton 48 px / 16 px / 600 / 14px 24px ; primaire rose issu du Brand OS ; textes informatifs 16 px, cibles de navigation 44 px, interlignage/longueur de ligne, cinq pas de titres et H3 unique. Hero mobile lisible, cadre autorisé sur plusieurs lignes. Paquet Brand OS vendorisé et polices inchangés.
- `src/system/harness-certificates.mjs`, `src/system/components/HarnessBadge.tsx`, son export et `journal/[slug]/page.tsx` : badge uniquement si statut, URL canonique et SHA256 des octets source concordent ; disclaimer EN/FR et lien JSON local. Aucun certificat public ajouté.
- `scripts/verify-certificates.mjs`, `next.config.ts`, `package.json` : vérification avant build et tests, inclusion des sources/certificats dans le bundle serveur, commande `npm test` et intégration du test navigateur.
- `scripts/false-claims-check.mjs`, `scripts/lib/certification-claims.mjs` : contrôle des mentions de certification dans les textes publics, articles inclus ; extraction AST des textes TS/TSX pour isoler les disclaimers par champ/phrase.

## Tests

Ajouts :
- `tests/audit-truth-copy.test.mjs` : 13 cas sur les remplacements et anciennes phrases.
- `tests/harness-certificates.test.mjs` : 6 cas, rendu réel du badge EN/FR, absent/NOT_CERTIFIED/invalide, hash de frontmatter, échec du cycle npm build avant compilation sur hash faux, gate et contre-exemple de commentaires avec apostrophes. Fixtures temporaires nettoyées, jamais de certificat dans public.
- `tests/readability-contract.test.mjs` : 3 contrôles déterministes des jetons/couleurs/CTA.
- `tests/audit-readability.spec.ts` : 10 parcours 375/1440, deny-all réseau, CTA 48 px, menu mobile, cibles, typo, interlignage et débordement.

Tests existants actualisés : aeration, brand-os, brand-os-render, conformity-home, doctrine-visible, product-scene, system-card. L'exigence d'un unique accent rose exclut désormais les contrôles primaires prescrits. Le cadre mobile peut avoir plusieurs lignes au lieu d'une seule. Les assertions de contenu, géométrie et absence de débordement sont conservées.

Le test SystemCard échouait déjà avant modification : ses en-têtes suivaient la première spec du 20/09. L'attente est alignée sur `CODEX-SPEC-2026-09-20-systems-editorial-corrections.md` (remplacement explicite des intitulés), avec assertions d'en-têtes et data-label conservées.

## Exécutions et limites

- Installation : `npm ci --offline --ignore-scripts` réussie depuis le cache local.
- Baseline : 76/80 tests Node ; trois absences de build et l'intitulé SystemCard périmé. Claims et marque verts.
- `npm run build` : Turbopack resté sans progression en compilation, interrompu. `npm run build -- --webpack` : réussi, 55 pages générées.
- `npm test` : **102/102 réussis** après le dernier build.
- `npm run lint`, `npx tsc --noEmit`, `git diff --check` : réussis.
- `npm run test:brand-os` : **20/20 réussis** ; `node scripts/false-claims-check.mjs` et `node scripts/brand-conformity-check.mjs` : réussis.
- `npm run qa:network:rev01 -- --max-failures=1` : 207 tests découverts ; arrêt avant navigation. Chromium échoue au lancement macOS (`bootstrap_check_in ... Permission denied (1100)`). Captures responsive, contraste calculé et géométrie navigateur restent à valider sur l'hôte avec le serveur local au port 3210. Aucun appel à un service métier effectué.
- Avertissements du build : metadataBase absent sur certaines métadonnées ; avertissement Node de type de module non déclaré. Non bloquants et hors changement demandé.

Revue indépendante : deux défauts trouvés et corrigés, spécificité du padding du CTA mobile et extraction regex des textes permettant un disclaimer voisin. Ce dernier est couvert par un test de régression AST. La validation visuelle/production ne peut pas être déclarée obtenue.
