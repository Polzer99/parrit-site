# Alignement positionnement, 26/10/2026

Implémentation de `docs/handoffs/2026-10-26-alignement-positionnement-six-capacites.md` sur le checkout demandé, HEAD `2b97c85c4dcf799854c672830f5db700f8e3baf1`. La spec non suivie préexistante est conservée sans modification. Aucun commit, push, déploiement ou appel à un service externe.

## Sources et périmètre

AGENTS.md, AI_CONTEXT.md et TRUTH.md lus avant modification. Définition, six capacités et huit principes vérifiés dans `/Users/paullarmaraud/parrit-canon/positioning/POSITIONNEMENT-CANONIQUE-2026-10-26.md`, décision datée du 26/10. Documentation Next installée 16.3.4 consultée pour métadonnées et liens. Plan fourni par la spec exécuté en deux passes : implémentation, puis corrections issues des vérifications.

Écritures limitées au dépôt local, réversibles par retrait du diff du lot ; aucun système client ou table métier touché (0 ligne). Référence initiale Git conservée, aucun changement préexistant écrasé.

## Modifications (état final après V2)

- `src/app/(rev01)/page.tsx` : kicker, sous-titre et métadonnées exacts FR/EN ; six capacités après la méthode et avant la scène produit, avec leur propre classe `home-s-capacites` ; lien Build With You conservé uniquement dans le footer.
- `src/app/(rev01)/rev01.css` : styles partagés entre parcours et capacités ; alignement des cartes de la colonne gauche. Style du lien retiré de la méthode supprimé en V2. Composants, grille, palette et typographies existants réutilisés.
- `src/system/components/RevFooter.tsx` : même lien localisé.
- `src/system/jsonld.ts`, `scripts/generate-llms.mjs`, `public/llms.txt` : définition canonique ; fichier public régénéré.
- `TRUTH.md`, `AGENTS.md`, `AI_CONTEXT.md` : définition, capacités, principes et état du lot synchronisés ; parcours, FormIA et règles conservés.

H1, header, clients, preuves, scène produit, Journal, commission et contenu Build With You inchangés.

## Tests

- `tests/six-capacites.test.mjs` : cinq tests Node, rendu réel des composants via transpilation locale avec dépendances réseau interdites. Six items FR/EN, parité des clés, position de section, absence d'action/prix/durée, lien footer localisé, absence de lien Build With You dans le contenu de l’accueil et action unique de la méthode, cohérence métadonnées et JSON-LD/llms.txt. Vérification adversariale des gardes anti-prix.
- `tests/six-capacites.spec.ts` : quatre cas FR/EN à 375/1440, absence de débordement, alignement des cartes, liens et captures pleine page, fixture deny-all partagée.
- `tests/public-clients.test.mjs` : injection indépendante de l'ancien kicker, contrôle de rejet conservé.
- `tests/audit-truth-copy.test.mjs` : anciennes expressions « business software »/« AI transformation » remplacées par une assertion de cohérence de la description canonique entre les sources machine.
- `tests/brand-os-render.test.mjs`, `tests/anti-slop-copy.spec.ts` : exception limitée à « à partir de vos opérations » (copie imposée), auparavant interprétée comme annonce tarifaire. Les expressions tarifaires restent rejetées, y compris les montants écrits en lettres et un forfait ajouté après la phrase autorisée. Aucun contrôle réseau, accessibilité ou géométrie retiré.

## Résultats initiaux (avant V2)

- Installation `npm ci --silent --offline --no-audit --no-fund` : réussie depuis le cache, sans réseau.
- Baseline : lint, build Webpack, 110/110 tests Node réussis.
- Final : lint, TypeScript `--noEmit`, claims, conformité marque et `git diff --check` réussis.
- `npm run build` : Turbopack bloqué à la compilation, interrompu sans résultat. `npm run build -- --webpack` : réussi, sans modification de la configuration de build.
- `npm test` final : 115/115 réussis.
- `npm run test:brand-os` : 24/24 réussis, dont le rendu serveur compilé FR/EN avec réseau interdit.
- Playwright captures : lancement Chromium refusé, 1 échec avant navigation et 3 cas non exécutés.
- `npm run qa:network:rev01 -- --workers=1 --max-failures=1` : même refus Chromium, 1 échec avant navigation et 346 cas non exécutés. Aucun échec fonctionnel navigateur établi.

Journaux : `/private/tmp/six-capacites-*.log` (baseline, installation, lint, types, claims, brand, build, webpack, test, brand-os, captures et network).

## Limites initiales et suite

Chromium échoue sur `MachPortRendezvousServer`, `Permission denied (1100)` dans le sandbox macOS. Aucune capture produite ; géométrie, contraste et interactions effectives restent à vérifier sur l'hôte en lançant le serveur local sur 3210 puis les suites Playwright. La preuve fournie est locale, aucune preuve de production n'est revendiquée.

Revue indépendante Codex effectuée : copie et périmètre conformes ; retrait des cartes 3/5 corrigé, contexte actualisé. Elle ne remplace pas la revue Claude du diff exigée par la spec, qui reste à faire, puis validation de Paul avant merge. Aucun envoi externe effectué pour demander cette revue.

## Correctifs V2, 26/10/2026

Spec exécutée : `docs/handoffs/2026-10-26-alignement-positionnement-V2-correctifs-playwright.md`.
Le constat hôte du superviseur (339 réussites, 8 échecs) remplace le diagnostic
initial limité par le sandbox : classe parcours dupliquée et seconde action dans
la méthode. Ces deux causes sont corrigées.

Fichiers de ce correctif :
- `src/app/(rev01)/page.tsx` : classe propre `home-s-capacites`, ordre brands →
  parcours → maison → capacites → build → proof → journal → close ; retrait du
  lien Build With You de la méthode et des deux entrées de dictionnaire inutilisées.
- `src/app/(rev01)/rev01.css` : capacités ajoutées aux styles partagés de section,
  note et grille responsive ; suppression du style du lien retiré. Valeurs et
  spécificité conservées, aucune modification des tokens.
- `tests/six-capacites.test.mjs` et `tests/six-capacites.spec.ts` : assertions
  FR/EN sur la classe propre, l'unicité des parcours, l'ordre des sections,
  l'action unique vers commission, l'absence du lien Build With You dans main
  et sa présence localisée dans le footer. Géométrie, captures 375/1440,
  absence d'actions dans les capacités et deny-all conservés.
- `AI_CONTEXT.md` et ce rapport : position des capacités et accès par le footer
  synchronisés. `RevFooter.tsx` était déjà conforme et reste inchangé.

Aucun autre test modifié, notamment `tests/conformity-home.spec.ts`.
Les 36 captures préexistantes modifiées et la spec non suivie sont préservées.
Écritures limitées à ces six fichiers locaux, sans données métier (0 ligne),
sans commit, push, déploiement ou appel à un service externe. Installation
hors réseau depuis le cache ; documentation Next installée consultée.

### Vérifications V2

- `npm ci --silent --offline --no-audit --no-fund` : réussi. Les options hors
  ligne respectent l'interdiction d'appel réseau de la spec.
- Tests ciblés adaptés avant correction : 2 échecs FR/EN sur l'ordre, puis
  5/5 réussites après correction, sur les mêmes assertions.
- `npm run build` : Turbopack sans résultat après 120 secondes, arrêté.
- `npm run build -- --webpack` : réussi sans changement de configuration.
- `npm run lint`, TypeScript `--noEmit`, `qa:brand:rev01`, `qa:claims:rev01`
  et `git diff --check` : réussis.
- `npm test` après build : 115/115 réussis ; `test:brand-os` : 24/24 réussis.
  Une exécution intermédiaire pendant la reconstruction de `.next` avait
  échoué sur trois artefacts compilés absents ; rejouée après build, sans
  modification des tests concernés.
- Playwright ciblé : Chromium refusé au lancement par macOS
  (`MachPortRendezvousServer`, `Permission denied (1100)`) ; 1 échec avant
  navigation, 3 cas non exécutés.
- `qa:network:rev01 -- --workers=1 --max-failures=1` : même blocage au lancement,
  1 échec avant navigation, 346 cas non exécutés.

Journaux : `/private/tmp/six-v2-*.log` (installation, baseline, targeted, lint,
 test, build, webpack, types, brand, claims, brand-os, playwright et network).

La preuve locale couvre le rendu serveur FR/EN et les contrats structurels.
La validation navigateur reste à faire par Claude sur l'hôte : serveur local
sur 3210, batterie `qa:network:rev01`, quatre cas `six-capacites.spec.ts` et
inspection des captures 375/1440 FR/EN. Aucune nouvelle capture ni preuve de
production revendiquée. Validation de Paul avant merge, comme prévu par la spec.
