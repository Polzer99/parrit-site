# Formulation contractuelle et faiblesses du lot 1 — 26/10/2026

Implémentation du handoff dans le checkout demandé, branche
`codex/docs-site-v1-HANDOFF-JURIDIQUE-FAIBLESSES-md`, base
`d330b5bb3f63f3b18341923f00d60eb40f0f46d2`.
Aucun commit, push, changement de branche, PR ni déploiement.
Le seul changement préexistant était le handoff non suivi : conservé intact.
Écritures limitées aux sources, assets générés, tests et documentation du dépôt ;
aucune donnée externe ni modification de /legal, sketch ou Journal.

## Changements

- `src/app/(rev01)/standard/page.tsx` : critère 05 et métadonnées FR/EN,
  cession écrite limitée, licences des briques et services tiers en annexe.
- `src/app/(rev01)/build-with-you/page.tsx` : sortie et suite FR/EN.
- `src/app/(rev01)/manufacture/page.tsx` : titre des phases et phrase finale FR/EN.
- `src/system/site-v1-pages.ts` : les quatre clauses contractuelles demandées.
- `src/system/components/IntegrationBuildSwitcher.tsx` : même clause partagée
  dans le sélecteur, pour éviter une formulation différente sur l'accueil.
- `scripts/generate-llms.mjs`, `public/llms.txt` : clause EN alignée, fichier
  public régénéré par son générateur.
- `scripts/lib/ownership-claims.mjs` (nouveau), `scripts/false-claims-check.mjs` :
  contrôle AST des chaînes, métadonnées et textes JSX, hors commentaires et
  routes protégées. Interdit les sept formulations du handoff et « belongs to
  you ». Commande `qa:claims:rev01` déjà bloquante dans la CI, workflow inchangé.
- `src/system/components/ProcessDiagram.tsx` : quatre étapes par colonne,
  même demande initiale, trois ProcessConnector par colonne, aria-label conservé.
- `src/system/site-v1.css` : accent du registre sur la colonne cible,
  empilement sous 760 px ; retrait des styles de lien de clôture qui auraient
  écrasé le bouton canonique (couleurs, bordures, padding, hover).
- `src/app/(rev01)/page.tsx`, `src/system/components/SiteV1Page.tsx` : clôtures
  en `rev-button exec`, destinations et libellés conservés ; hero des guides
  toujours en `ghost`. Les CTA existants n'utilisent pas `avecSource()`.
- `scripts/generate-grain.mjs`, `scripts/check-grain.mjs`,
  `public/matiere/grain-{clair,canard}.png` : 512 × 512, graine 20261026,
  cellules 2 × 2 et densités conservées, limite stricte 8 Kio.
  Poids : clair 4 500 octets, canard 6 019 octets.
- `src/system/components/Matiere.module.css` : respiration supérieure
  `var(--brand-s6)`.
- `AI_CONTEXT.md` : état et limites de validation ajoutés en tête.

## Écart entre la spec et la base réelle

L'accueil de cette base contient six étapes courtes dans H11, sans étape
« 04 Prendre la main » ni paragraphe de propriété. Le remplacement exact cité
par la spec est donc sans cible. La structure existante est conservée : aucun
paragraphe inventé ni retour à une ancienne version. Aucun texte de propriété
interdit n'y subsiste. Le texte FR « Vous repartez avec le système » de BWY,
variante de celui cité par la spec, est remplacé par la formulation demandée.

## Tests ajoutés et adaptations autorisées

Sept nouveaux tests Node :

- `tests/ownership-claims.test.mjs` (3) : formulations interdites dans
  dictionnaires/JSX/métadonnées, exclusions/commentaires et formulation permise,
  vraie commande CLI qui refuse une injection puis accepte sa correction.
- `tests/juridique-faiblesses.test.mjs` (3) : rendu serveur FR/EN du schéma,
  quatre étapes et trois connecteurs intercalés, entrée commune, accessibilité,
  CTA final et destination sur accueil/quatre guides, hero ghost préservé,
  tokens du grain et de l'accent. Aucun libellé de schéma figé.
- `tests/grain.test.mjs` (+1) : rejet d'ancienne dimension, PNG valide trop lourd,
  et cellule cassée à densité constante.

Adaptations des assertions portant sur l'ancien contrat :

- `tests/grain.test.mjs` : dimensions, total de pixels/cellules, limite 8 Kio.
  Palette, transparence, densité, corruption, fichiers supplémentaires et
  déterminisme restent vérifiés.
- `tests/matiere.spec.ts` : dimensions 512 et assertion ajoutée sur la marge.
- `tests/product-scene.spec.ts`, `tests/site-v1-visual.test.mjs` : six connecteurs
  au lieu de deux. Assertions navigateur ajoutées : quatre étapes par colonne,
  empilement mobile/colonnes desktop, accent distinct et CTA exec.
- `tests/anti-slop-copy.test.mjs` : la clause contractuelle attendue suit la
  nouvelle formulation ; autres assertions conservées.
- `tests/public-clients.test.mjs` : fixture étendue au nouveau module importé,
  sans changement d'assertion. Le premier passage complet avait révélé cette
  dépendance manquante ; corrigée avant de rejouer toute la suite.

## Vérifications et preuves

Instructions lues avant édition : AGENTS.md, AI_CONTEXT.md, TRUTH.md, handoff,
Recursive Agent Harness ; documentation locale Next 16.3.4 Link et Context7
React 19.2.7. Revue indépendante statique : aucun défaut bloquant relevé.

| Vérification | Résultat |
|---|---|
| `npm ci --offline --silent` | Succès ; dépendances initialement absentes |
| Référence `npm test` avant modification | 151/154 ; trois échecs dus à l'absence de `.next` |
| `npm run lint` | Succès |
| `npx tsc --noEmit` | Succès |
| `npm test` après build | **161/161** |
| `npm run build` | Turbopack sans progression, interrompu ; pas déclaré vert |
| `npm run build -- --webpack` | **Succès**, sans changer package.json |
| `npm run qa:brand:rev01` | Succès |
| `npm run qa:claims:rev01` | Succès ; balayage des formulations interdites vide |
| `npm run test:brand-os` | **24/24** |
| `git diff --check` | Succès |
| `npm run qa:network:rev01 -- --list` | Collecte réussie : 428 cas, 23 fichiers ; pas une exécution |
| Playwright ciblé grain/schéma | Bloqué au lancement Chromium par macOS, avant navigation |
| `npm run start -- -p 3210` | Refus sandbox : `listen EPERM` |

Les tests utilisent le deny-all réseau existant. Aucun test navigateur déclaré
réussi, aucune capture ni preuve de production. La suite réseau complète reste
à rejouer par Claude sur l'hôte comme prévu par le handoff ; contrôler notamment
schéma empilé à 375 px, boutons finaux et respiration du grain à 375/1440 px FR/EN.
Le build Turbopack standard reste également à confirmer hors sandbox.

Journaux locaux : `/private/tmp/juridique-{baseline,install,build,webpack,lint,types,tests,brand,claims,brand-os,browser,server,network-list}.log`.
