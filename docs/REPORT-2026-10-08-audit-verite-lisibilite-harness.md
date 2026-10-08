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

## Complément FIX1, 08/10/2026

Base de cette reprise : checkout demandé `8309ba5`. Seule modification initiale :
l'ajout FIX1 dans la spec, préservé intégralement. Les sections principales étaient
déjà implémentées ; les 102 tests Node passaient avant cette reprise.

Modifications :
- `src/app/(rev01)/rev01.css` : marges horizontales automatiques sur le conteneur
  du second CTA hero, dont la largeur est plafonnée à 68ch ; cibles des liens
  isolés fondateur et suite BWY de 44 px minimum, padding vertical 12 px.
- `src/app/(rev01)/build-with-you/page.tsx` : classe dédiée au lien de suite sur
  mesure, commune aux deux langues. Texte, taille et destination conservés.
- `tests/audit-readability.spec.ts` : 18 parcours au lieu de 10, ajout de 390 px
  et BWY FR ; vérification du centrage par rapport au titre et à Sketch (1 px de
  tolérance), hauteur des liens, tailles conservées et destination localisée.
- `AI_CONTEXT.md` : état du correctif et limites de validation.

Vérifications de cette reprise :
- `npm run build` : Turbopack interrompu pendant la compilation sans progression.
- `npm run build -- --webpack && npm test` : réussi, 55 pages et 102/102 tests.
- Lint, TypeScript, claims, conformité de marque et `git diff --check` : réussis.
- `npm run test:brand-os` : 20/20 réussis.
- Batterie navigateur : 215 cas ; arrêt au lancement de Chromium avec
  `bootstrap_check_in ... Permission denied (1100)`, avant toute navigation.
  Géométrie et captures restent à vérifier sur l'hôte avec le serveur local.

Aucun certificat publié, aucune donnée métier modifiée, aucun commit, push ou
déploiement. La preuve visuelle et la preuve de production restent non obtenues.
Les avertissements metadataBase du build existaient déjà dans le rapport initial.

## Complément FIX2, 08/10/2026

Source de cette reprise : checkout demandé par Paul, HEAD
`509a1bb1a1de75f04aa00dcc08cd7cb173c56459`. Seule modification initiale :
la section FIX2 de la spec, conservée sans modification. Les sections principales
et FIX1 étaient déjà implémentées ; baseline `npm test` : 102/102.
AGENTS.md, AI_CONTEXT.md, TRUTH.md, spec et doctrine Harness relus ; rapports A/B/C
consultés dans le checkout d'audit indiqué plus haut (absents du présent dépôt).
Plan : corriger la cascade et les variantes CTA, mettre à jour les contrats
explicitement remplacés, rejouer la batterie. Une passe de correction et une revue
indépendante en lecture seule ; arrêt des tentatives sur les blocages d'environnement.
Écritures : sources/tests/docs de ce checkout uniquement, réversibles par diff,
aucune ligne métier ni certificat public ajouté. Aucun commit, push ou déploiement.

### Modifications

- `src/app/(rev01)/rev01.css` : lien BWY hérite du texte sombre du registre,
  cible 44 px et taille conservées ; mesure 68ch par défaut à spécificité nulle,
  laissant gagner les mesures locales dont 56ch du parcours. Interlignage 1,45
  conservé. En-tête et panneau mobile en contour rose ; second CTA hero en
  contour clair, centré. Survol sombre conservant le contraste du texte clair.
- `src/system/components/RevHeader.tsx` : variantes ghost desktop/mobile,
  sans dépendance au scroll ni changement des libellés/destinations.
- `src/app/(rev01)/page.tsx` : second CTA hero ghost ; Sketch reste plein rose.
- Aucun jeton vendorisé, contenu éditorial ou mécanisme Harness modifié.

### Tests renforcés et références actualisées

- `tests/audit-readability.spec.ts` : couleurs/bordures/fond transparent des
  CTA desktop/mobile depuis les jetons, couleur héritée BWY, contour clair et
  survol du second CTA hero ; maintien des contrôles 48/44 px et centrage.
- `tests/brand-os.spec.ts` : Sketch désactivé plein selon le jeton exec,
  texte et bordure correspondants, hauteur >=48 px ; états désactivé/survol/
  activé/réinitialisé toujours exercés. Le point 6 de FIX2 cite doctrine-visible
  ligne 409, mais l'assertion correspondante se trouve dans brand-os.spec.ts.
- `tests/systems.spec.ts` : Lemlist et transfert en cours, toujours troisième
  ligne et compteur zéro.
- `tests/doctrine-visible.spec.ts` : quatre secteurs ; header ghost sans JS,
  après scroll et navigation ; titre d'article ciblé par `span[lang]` pour ne
  pas confondre l'étiquette EN ajoutée avec le titre. Ce dernier point explique
  un échec supplémentaire de « home composition and language ».
- Sur mobile, le CTA desktop est masqué : le test des accents ouvre le panneau,
  attend son apparition puis vérifie l'accent effectivement disponible dans ce
  panneau. Il le ferme avant les parcours suivants. Les assertions d'espacement
  >=844 px et les groupes de repères produit sont conservés.
- `tests/readability-contract.test.mjs` : contrat statique du header ghost,
  absence d'observateur de scroll toujours contrôlée.

Revue indépendante : attentes exec périmées, ambiguïté des spans EN, doublon du
sélecteur Sketch et absence d'accent au repos sur le header mobile identifiés et
traités. La correction hover évite un texte clair sur le fond clair de la variante
ghost générique. Aucune assertion de largeur 56ch, contraste ou débordement retirée.

### Résultats et preuve restante

- `npm run build` : interrompu après absence de progression en compilation
  Turbopack ; `npm run build -- --webpack && npm test` : réussi, 55 pages,
  **102/102 tests** (même batterie que la baseline).
- `npm run lint`, `npx tsc --noEmit`, `node scripts/false-claims-check.mjs`,
  `node scripts/brand-conformity-check.mjs`, `git diff --check` : réussis.
- `npm run test:brand-os` : **20/20**.
- `npx playwright test --max-failures=1` : arrêt au lancement de Chromium,
  `bootstrap_check_in ... Permission denied (1100)`, avant navigation.
  `npx playwright test --list` : **215 tests / 16 fichiers**.
- Les 39 échecs du run CI cité par la spec ne peuvent donc pas être déclarés
  résolus par une exécution navigateur ici. Rejouer la batterie sur l'hôte,
  serveur local port 3210, avec les deny-all réseau conservés ; captures,
  géométrie et contraste calculé restent non validés dans cette reprise.
- Avertissements metadataBase et type de module Node déjà présents dans les
  rapports précédents. Aucune preuve de production : déploiement interdit par
  le mandat de cette session.

## Complément FIX3, 08/10/2026

Source : checkout demandé, HEAD `e4c3c8ceea0062d1fd9af26ab52f85ebbe78542c`.
Référence canonique lue par `git show origin/main` :
`85465b5ae510deea0d8a42de45ea590285fb356d` (référence locale, aucun fetch).
La modification initiale de la spec (19 lignes FIX3) est conservée intégralement.
AGENTS, AI_CONTEXT, TRUTH, spec, doctrine Harness et rapports A/B/C du checkout
`spec-parrit-audit-2026-10-08` consultés. Documentation Next locale lue ; aucune
nouvelle API externe introduite. Baseline : 102/102 tests Node.

Plan exécuté : vérifier les acquis des sections 1–4/FIX1/FIX2, corriger FIX3,
revue indépendante en lecture seule, batterie. Une passe puis correction ciblée
de la cause potentielle du débordement ; pas de tentatives répétées contre le
blocage navigateur. Écritures limitées aux sources/tests/docs du checkout,
réversibles par diff ; aucune donnée métier ni certificat ajouté.

Fichiers produit :
- `src/system/components/RevHeader.tsx` : logique d'accueil reprise du canon,
  observateur du hero et nettoyage conservés, contour desktop neutre au repos,
  panneau mobile neutre. Interprétation de « Sur l'accueil » dans FIX3 : la
  restauration concerne les accueils FR/EN ; les pages intérieures conservent
  le contour rose de FIX2 pour garder leur accent. Tailles 48 px/16 px conservées.
- `src/app/(rev01)/rev01.css` : couleurs contextuelles du header, spécificité
  du texte `--paper` du second CTA hero ; `.r2-shead` autorise le retour à la
  ligne avec un espacement de 16 px. La revue a identifié ses deux enfants
  flex sans wrap comme cause plausible du débordement ; le footer n'avait pas
  de nowrap et n'a finalement pas été modifié. Cause et résultat géométriques
  non mesurés, Chromium étant indisponible.
- `src/app/(rev01)/page.tsx` : note FR originale restaurée.
- `src/app/(rev01)/dossiers/page.tsx` : titres opérationnels FR/EN de 26-002,
  secteur conservé dans la référence, statut inchangé, paragraphe redondant
  retiré. La home n'affiche pas les fiches individuelles : son lien générique
  vers les dossiers est conservé, sans ajout d'un nouveau contenu.

Tests :
- `tests/audit-truth-copy.test.mjs` : nouveau cas sur titres opérationnels,
  unicité des phrases, note FR et préfixe Commandes de.
- `tests/audit-readability.spec.ts` : six cas supplémentaires Manufacture
  FR/EN à 375/390/1440 ; débordement, typo et cibles toujours contrôlés ; couleurs
  neutres accueil et roses pages intérieures, hauteur mobile >=48 px.
- `tests/readability-contract.test.mjs` : observer, nettoyage, branches accueil
  et couleur neutre ; remplace le contrat FIX2 devenu obsolète.
- `tests/doctrine-visible.spec.ts` : transition après sortie du hero attendue
  exec comme au canon ; aucune relaxation de l'assertion d'espacement des accents.
- `tests/conformity-home.spec.ts` : titres attendus FR/EN de 26-002 actualisés ;
  test de note FR inchangé. Assertion `--paper` d'audit-readability inchangée.
- `AI_CONTEXT.md` actualisé.

Résultats :
- `npm run build` : compilation Turbopack sans progression, interrompue.
- `npm run build -- --webpack && npm test` : code 0, 55 pages, **103/103** tests.
- `npm run test:brand-os` : **20/20**.
- Lint, TypeScript, false-claims-check, brand-conformity-check, diff-check : verts.
- `npx playwright test --max-failures=1` : échec de lancement Chromium,
  `bootstrap_check_in ... Permission denied (1100)`, avant navigation ;
  1 échec de lancement, 4 interrompus, 216 non exécutés.
- `npx playwright test --list` : **221 tests, 16 fichiers**.
- Avertissement metadataBase déjà documenté dans les reprises antérieures.

Les 13 échecs CI cités par FIX3 ne sont pas déclarés résolus par mesure ici.
Rejouer sur l'hôte les tests navigateur et les captures 1440/390/375, notamment
Manufacture FR. Aucune preuve de production, aucun commit, push ou déploiement.
