# Compte rendu — Hero de conversion, 08/11/2026

La spec est implémentée dans le worktree. La preuve de rendu navigateur reste
bloquée par les permissions de l'environnement ; aucune conformité géométrique
ni amélioration mesurée de conversion en production n'est revendiquée.

## Périmètre et sources

- Dépôt courant, HEAD et origin/main locaux : `28d7a4341df70331f3994a3f33107c2abc4d20e5`, fusion de la PR #371. Aucun fetch ni changement de branche.
- Source : `docs/CODEX-SPEC-2026-11-08-hero-conversion.md`, seule modification préexistante (fichier non suivi). SHA256 avant/après : `f0e1405e4fae9e4b334871181e1ccd0cde04ad18f88ef870805157d1d1156100`.
- Consignes lues : AGENTS, état actuel d'AI_CONTEXT, TRUTH et doctrine Recursive Agent Harness. Spec validée par la demande d'implémentation de Paul.
- Captures locales Studeria/Alegria examinées. Permissions et assets : registre local actuel, `PublicEvidence.tsx`, `SessionPhotos.tsx`, manifestes et fichiers existants.
- Documentation : guide installé Next 16.3.4 et Context7 Next 16.2.9 pour les attributs d'image prioritaire et les dimensions intrinsèques.
- Écritures : fichiers locaux du site, tests et documentation ; aucune donnée métier, aucun système client, 0 ligne de base de données. Réversible par diff sur la baseline Git ; spec préexistante préservée.
- Boucle bornée : référence, implémentation, revue indépendante, correction, vérification. Tentatives navigateur arrêtées après confirmation du refus système. Aucun commit, push ou déploiement.

## Fichiers et changements

- `src/system/components/SinglePage.tsx` : hero texte/photo, surtitre bilingue, preuve directement sous le bouton ; section du schéma après les deux métiers.
- `src/system/components/PublicEvidence.tsx` : quatre logos blancs, contrôle de publication du nom et du logo ; sélection préférentielle Toyotomi Europe/SNCF/Hiolle Technologies/Laparra, sinon quatre premiers autorisés. Aucun logo ni libellé de confiance si tous sont refusés.
- `src/system/components/SessionPhotos.tsx` : photo `formation-equipes` existante, AVIF/WebP, dimensions 960×1280, `loading="eager"`, `fetchPriority="high"`, légende localisée.
- `src/system/components/OntologyHero.tsx` : retrait du slot de texte du hero ; données, vecteurs, histoires, durées et nettoyage du minuteur conservés.
- `src/system/single-page.css` : colonnes égales dès 1100 px, gouttière Brand OS de 48 px, bords photo/texte communs, rythme compact, preuve à 16 px ; bouton pleine largeur sous 1100, logos 2×2, photo 4:3. Schéma dans son propre bloc canard, dimensionné pour le contrat d'écran.
- `src/system/home-layers.ts`, `src/system/home-anchors.ts` : quatorze sections, titre FR/EN et ancres `fonctionnement` / `how-it-works` localisées.
- `public/llms.txt` : régénéré par le prebuild, nouvel ordre bilingue. Aucun changement d'article.
- `AGENTS.md`, `TRUTH.md`, `AI_CONTEXT.md` : contrat courant et limites de validation consignés.

## Tests

- Nouveau `tests/hero-conversion.test.mjs` : 11 tests Node, rendu SSR FR/EN, ordre, action/attribution, photo existante prioritaire, quatre logos autorisés, retrait de permission de nom/logo, repli et retrait total, déplacement du schéma et bascule des ancres.
- `tests/single-page.spec.ts` : 24 cas ajoutés (FR/EN × JS actif/inactif × mouvements normal/réduit × 1440×800/1280×720/390×844). Ordre, bords à 1 px, preuve à ≤24 px, aucun trou >48 px, colonnes égales, photo alignée à ±4 px, chargement réel, quatre logos blancs autorisés, grille mobile, un seul exec visible, quatre histoires dans leur section.
- Tests navigateur adaptés : `single-page`, `intentions`, `parcours-accueil`, `doctrine-visible`, `stabilite`. Les tests animés défilent vers le schéma avant de l'activer ; stabilité observée 25 secondes dans la nouvelle section aussi.
- Contrats Node adaptés : `single-page`, `parcours-accueil`, `langue-metier`, `llms-articles`, `brand-os-render`. Changements limités au nouvel ordre, au déplacement et aux logos désormais autorisés dans la preuve du hero.
- Les trois échecs du premier passage complet provenaient de l'ancien ordre compilé et de l'ancienne interdiction de noms hors références. Attentes mises à jour selon la nouvelle spec. Seuils géométriques, CLS, durées, contraste et deny-all conservés.

## Résultats

| Contrôle | Référence | Candidat |
|---|---|---|
| `npm ci --silent` | Réussi | Même installation |
| `npm run lint` | Réussi | Réussi |
| `npm run build -- --webpack` | Réussi | Réussi |
| `npm test` | 332/332 | 343/343 |
| `npm run test:brand-os` | Couvert par npm test | 19/19 |
| `npx tsc --noEmit` | — | Réussi |
| `npm run qa:brand:rev01` | — | Réussi |
| `npm run qa:claims:rev01` | — | Réussi |
| `git diff --check` | — | Réussi |
| `npm run qa:network:rev01 -- --list` | — | 604 cas recensés |

Comparaison du rendu SSR FR/EN avant/après : les douze sections préexistantes
hors hero sont identiques octet pour octet. Le sous-arbre du schéma, ses légendes,
cartes et phrase explicative est également identique après déplacement.
Les assets, les 31 articles FR et leurs originaux EN, les données des quatre
histoires, les jetons vendorisés et les PNG du handoff n'ont pas été modifiés.

Revue indépendante : grille mobile corrigée de quatre colonnes à 2×2.
Les calculs statiques de hauteur ne constituent pas une mesure navigateur.
Avertissements préexistants : `metadataBase` sur certaines routes et
`MODULE_TYPELESS_PACKAGE_JSON` pour les imports TypeScript dans les scripts Node.

## Blocage et preuve restante

`next start -H 127.0.0.1 -p 3210` échoue avec `listen EPERM`.
Chromium échoue avant navigation : `MachPortRendezvous`, `Permission denied`,
`SIGTRAP`. Batterie réseau tentée avec un worker et arrêt au premier échec :
1 échec au lancement, 603 cas non exécutés. Aucune requête vers un service réel.

À rejouer sur un hôte autorisé : démarrer le build sur 3210, lancer
`npm run qa:network:rev01`, examiner les captures 1440/1280/390/375, les
alignements, le cadrage de la photo, le bloc schéma à 390×700, les polices lentes
et le CLS. `PRODUCTION_PROOF` absent : publication explicitement hors mandat.
