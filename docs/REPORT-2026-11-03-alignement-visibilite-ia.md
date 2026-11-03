# Alignement visibilité IA, 03/11/2026

Implémentation de `docs/CODEX-SPEC-2026-11-03-alignement-visibilite-ia.md`.
Le code et les vérifications locales passent. La validation navigateur et les
contrôles en ligne restent à exécuter sur l'hôte, puis après fusion.
Aucun commit, push ou déploiement effectué.

## Référence et périmètre

- Dépôt : checkout courant `handoff-docs-CODEX-SPEC-2026-11-03-alignement-visibilite-i`, explicitement demandé par Paul.
- Branche fournie : `codex/docs-CODEX-SPEC-2026-11-03-alignement-visibilite-i`.
- Baseline : `8e87675b02475de1cd3cc784d7be129a265eb6ec`.
- État initial : seule la spec demandée était non suivie ; ses octets sont conservés.
- Instructions consultées : `AGENTS.md`, `CLAUDE.md`, état actuel d'`AI_CONTEXT.md`, `TRUTH.md`, doctrine Recursive Agent Harness et spec.
- Documentation : guides installés Next 16.3.4 JSON-LD, robots et sitemap ; Context7 JSON-LD 16.2.9, dernière version proposée par son index.
- Écriture : fichiers locaux de ce dépôt uniquement ; environnement de développement ; aucune donnée métier (0 ligne), aucun système client. Réversible par retrait du diff de cette intervention ; référence Git et captures HTML avant modification conservées dans `/private/tmp/visibilite-ia-baseline-html.json`.
- Boucle bornée : implémentation, une relecture indépendante, vérifications. Aucun défaut concret relevé par la relecture, donc aucune passe de correction nécessaire.

## Fichiers modifiés ou ajoutés

| Fichiers | Résultat |
|---|---|
| `src/app/robots.ts` | Un groupe `*`, `Allow: /`, interdictions `/os` et `/api`, sitemap conservé, aucun Host. |
| `src/app/(rev01)/page.tsx` | Titres et descriptions FR/EN demandés avec Tourcoing et Paris. |
| `src/system/jsonld.ts` | Deux Place sans rue ; siège conservé ; zone desservie mise à jour ; fonction Article et FAQ depuis le contenu localisé existant. |
| `src/system/journal-themes.ts` (nouveau), `src/app/sitemap.ts` | Une constante de date partagée par les Articles des thèmes et leurs entrées de sitemap. |
| `src/app/(rev01)/journal/themes/[theme]/page.tsx` | Script JSON-LD rendu côté serveur, échappement de `<`, canonical localisé. Aucun élément visible ajouté. |
| `scripts/generate-llms.mjs`, `public/llms.txt` | Présence Tourcoing/Paris et intervention France, siège conservé dans les deux langues ; fichier public régénéré par le script. |
| `tests/visibilite-ia.test.mjs` (nouveau) | 14 tests supplémentaires détaillés ci-dessous. |
| `tests/brand-os-render.test.mjs` | Vérification Article et correspondance intégrale FAQ/HTML dans le vrai rendu serveur compilé, sur les huit variantes de thèmes. |
| `tests/langue-metier.test.mjs`, `tests/single-page.spec.ts` | Ancienne attente Lille remplacée par Tourcoing et Paris et absence de Lille dans les métadonnées d'accueil. |
| `TRUTH.md`, `AGENTS.md`, `AI_CONTEXT.md` | Décision géographique et contrat technique actuel documentés. |
| Ce rapport | Résultats et limites de preuve. |

`tests/entity-graph.test.mjs` conserve son contrôle du siège, sans modification.
La page légale, le contenu des thèmes, les styles, les composants visibles,
les dépendances et le graphe LinkedIn sont inchangés.

## Tests ajoutés

Les 14 nouveaux tests Node vérifient :

- le groupe robots unique et le fichier `robots.txt` réellement généré par Next ;
- les deux lieux sans rue, la zone desservie, le siège et `sameAs` vide en FR/EN ;
- la présence et le siège dans les deux parties de `llms.txt` ;
- les quatre thèmes en FR/EN : JSON valide, Article unique, titre et description identiques au HTML, langue, auteur/éditeur, canonical, date du sitemap ;
- exactement les questions et réponses de la section FAQ visible, aucune FAQ quand cette section est absente, aucun prix ni nom de client connu ;
- la propagation d'un changement de constante aux huit entrées sitemap et au JSON-LD ;
- une charge contenant `</script><script>` dans titre, description, question et réponse, conservée dans le JSON sans pouvoir fermer le script.

Les contrôles existants de rendu compilé sont renforcés ; leur blocage réseau
reste actif. Les tests de contenu utilisent le chargeur local à liste fermée,
sans accès réseau. Aucun seuil de géométrie, stabilité ou accessibilité assoupli.

## Résultats d'exécution

| Vérification | Baseline | Candidat |
|---|---|---|
| `npm ci --offline --no-audit --no-fund` | Réussi, dépendances du lockfile | Mêmes dépendances |
| `npm run lint` | Réussi | Réussi |
| `npm run build -- --webpack` | Réussi, 52 pages statiques | Réussi, 52 pages statiques |
| `npm test` | 142/142 | 156/156 |
| `npx tsc --noEmit` | — | Réussi |
| `npm run qa:brand:rev01` | — | Réussi |
| `npm run qa:claims:rev01` | — | Réussi |
| `npm run test:brand-os` | — | 19/19 |
| Comparaison HTML FR/EN accueil, légal, quatre thèmes | 12 références sauvegardées | 12/12 identiques hors scripts JSON-LD |
| `git diff --check` | — | Réussi |
| `npm run qa:network:rev01 -- --list` | — | 410 tests recensés dans 12 fichiers |

Les avertissements Next `metadataBase` et Node `MODULE_TYPELESS_PACKAGE_JSON`
n'empêchent pas les commandes de réussir ; aucune correction hors périmètre.
Journaux : `/private/tmp/visibilite-ia-{install,baseline-build,baseline-lint,baseline-test,candidate-build,candidate-lint,candidate-test,types,brand,claims,brand-os,playwright-list,server}.log`.

## Blocages et reprise

`npx next start --hostname 127.0.0.1 -p 3210` échoue avec
`listen EPERM: operation not permitted 127.0.0.1:3210`.
La commande Playwright ciblée a aussi été rejetée avant exécution par le hook
d'approbation automatique : « Garde WhatsApp : touche simulée dans une commande
qui cite WhatsApp refusée ». Cette raison est sans rapport avec le test SEO
demandé ; aucun contournement du garde ni envoi de message n'a été tenté.

Les 410 tests navigateur ne sont donc pas déclarés réussis. Géométrie réelle,
captures et comportement du navigateur restent UNKNOWN. Reprise sur l'hôte
par le relecteur :

```bash
npm run build -- --webpack
npx next start --hostname 127.0.0.1 -p 3210
# Dans un autre terminal :
npm run qa:network:rev01
```

PRODUCTION_PROOF : non réalisée, hors mandat avant fusion. Après fusion,
contrôler en ligne `/robots.txt`, `/llms.txt`, le titre et les données structurées
de `/fr` et d'un thème, puis réaliser les captures. Aucun effet sur le classement
ou la citation par les moteurs n'est revendiqué à partir des seuls tests locaux.
