# Alignement positionnement, 26/10/2026

Implémentation de `docs/handoffs/2026-10-26-alignement-positionnement-six-capacites.md` sur le checkout demandé, HEAD `2b97c85c4dcf799854c672830f5db700f8e3baf1`. La spec non suivie préexistante est conservée sans modification. Aucun commit, push, déploiement ou appel à un service externe.

## Sources et périmètre

AGENTS.md, AI_CONTEXT.md et TRUTH.md lus avant modification. Définition, six capacités et huit principes vérifiés dans `/Users/paullarmaraud/parrit-canon/positioning/POSITIONNEMENT-CANONIQUE-2026-10-26.md`, décision datée du 26/10. Documentation Next installée 16.3.4 consultée pour métadonnées et liens. Plan fourni par la spec exécuté en deux passes : implémentation, puis corrections issues des vérifications.

Écritures limitées au dépôt local, réversibles par retrait du diff du lot ; aucun système client ou table métier touché (0 ligne). Référence initiale Git conservée, aucun changement préexistant écrasé.

## Modifications

- `src/app/(rev01)/page.tsx` : kicker, sous-titre et métadonnées exacts FR/EN ; six capacités entre parcours et méthode ; lien secondaire localisé Build With You.
- `src/app/(rev01)/rev01.css` : cible tactile du lien texte ; alignement des cartes de la colonne gauche. Composants, grille, palette et typographies existants réutilisés.
- `src/system/components/RevFooter.tsx` : même lien localisé.
- `src/system/jsonld.ts`, `scripts/generate-llms.mjs`, `public/llms.txt` : définition canonique ; fichier public régénéré.
- `TRUTH.md`, `AGENTS.md`, `AI_CONTEXT.md` : définition, capacités, principes et état du lot synchronisés ; parcours, FormIA et règles conservés.

H1, header, clients, preuves, scène produit, Journal, commission et contenu Build With You inchangés.

## Tests

- `tests/six-capacites.test.mjs` : cinq tests Node, rendu réel des composants via transpilation locale avec dépendances réseau interdites. Six items FR/EN, parité des clés, position de section, absence d'action/prix/durée, liens accueil/footer localisés, cohérence métadonnées et JSON-LD/llms.txt. Vérification adversariale des gardes anti-prix.
- `tests/six-capacites.spec.ts` : quatre cas FR/EN à 375/1440, absence de débordement, alignement des cartes, liens et captures pleine page, fixture deny-all partagée.
- `tests/public-clients.test.mjs` : injection indépendante de l'ancien kicker, contrôle de rejet conservé.
- `tests/audit-truth-copy.test.mjs` : anciennes expressions « business software »/« AI transformation » remplacées par une assertion de cohérence de la description canonique entre les sources machine.
- `tests/brand-os-render.test.mjs`, `tests/anti-slop-copy.spec.ts` : exception limitée à « à partir de vos opérations » (copie imposée), auparavant interprétée comme annonce tarifaire. Les expressions tarifaires restent rejetées, y compris les montants écrits en lettres et un forfait ajouté après la phrase autorisée. Aucun contrôle réseau, accessibilité ou géométrie retiré.

## Résultats

- Installation `npm ci --silent --offline --no-audit --no-fund` : réussie depuis le cache, sans réseau.
- Baseline : lint, build Webpack, 110/110 tests Node réussis.
- Final : lint, TypeScript `--noEmit`, claims, conformité marque et `git diff --check` réussis.
- `npm run build` : Turbopack bloqué à la compilation, interrompu sans résultat. `npm run build -- --webpack` : réussi, sans modification de la configuration de build.
- `npm test` final : 115/115 réussis.
- `npm run test:brand-os` : 24/24 réussis, dont le rendu serveur compilé FR/EN avec réseau interdit.
- Playwright captures : lancement Chromium refusé, 1 échec avant navigation et 3 cas non exécutés.
- `npm run qa:network:rev01 -- --workers=1 --max-failures=1` : même refus Chromium, 1 échec avant navigation et 346 cas non exécutés. Aucun échec fonctionnel navigateur établi.

Journaux : `/private/tmp/six-capacites-*.log` (baseline, installation, lint, types, claims, brand, build, webpack, test, brand-os, captures et network).

## Limites et suite

Chromium échoue sur `MachPortRendezvousServer`, `Permission denied (1100)` dans le sandbox macOS. Aucune capture produite ; géométrie, contraste et interactions effectives restent à vérifier sur l'hôte en lançant le serveur local sur 3210 puis les suites Playwright. La preuve fournie est locale, aucune preuve de production n'est revendiquée.

Revue indépendante Codex effectuée : copie et périmètre conformes ; retrait des cartes 3/5 corrigé, contexte actualisé. Elle ne remplace pas la revue Claude du diff exigée par la spec, qui reste à faire, puis validation de Paul avant merge. Aucun envoi externe effectué pour demander cette revue.
