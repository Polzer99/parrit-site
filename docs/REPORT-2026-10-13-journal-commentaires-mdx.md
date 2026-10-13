# Journal : commentaires internes MDX, 13/10/2026

## Périmètre et état initial

Spec lue à `/tmp/codex-journal-fiche-2026-10-13/docs/CODEX-SPEC-2026-10-13-journal-commentaires-mdx.md`, identique à la copie sous `tmp/` du dépôt. AGENTS.md, AI_CONTEXT.md et TRUTH.md lus avant modification.

Le checkout contenait déjà le filtre dans `src/system/journal.ts`, cinq tests dans `tests/journal-content.test.mjs` et le répertoire `tmp/`. Ces changements sont préservés. Baseline : cinq tests ciblés et 107 tests Node réussis.

Écriture limitée au checkout local : chargeur, tests et documentation ; aucune écriture de données métier, aucun changement de dépendance, style, route, publication ou article source. Modifications réversibles par le diff local ; aucun commit, push ou déploiement effectué.

## Modifications

- `src/system/journal.ts` : conservation de la fonction exportée de suppression non gourmande des commentaires MDX et HTML ; retrait du `.trim()` du chargeur pour respecter les espaces du corps. Les lignes vides initiales ne sont supprimées que si un commentaire a été retiré.
- `tests/journal-content.test.mjs` : cinq tests préexistants conservés ; cinq cas supplémentaires couvrent le chargement de commentaires MDX multilignes, MDX sur une ligne, HTML, la préservation exacte du texte sans commentaire et plusieurs commentaires mixtes non gourmands avec fins de ligne CRLF. Fixtures en mémoire, aucun fichier article modifié.
- `tests/brand-os-render.test.mjs` : assertions sur le rendu compilé des trois articles et `/llms-full.txt`, dans le test existant qui interdit tout réseau sortant.
- `AI_CONTEXT.md` : contrat et résultats actualisés.

`scripts/generate-llms.mjs` génère un texte statique sans lire les corps : aucune adaptation nécessaire. `/llms-full.txt` utilise déjà `getAllJournalEntries`, donc le même filtre. Les octets des articles et leurs certificats sont conservés.

## Vérification

Les quatre nouveaux cas de chargement ont échoué avant le retrait du trim et réussi après, sans modifier leurs attentes.

| Vérification | Résultat |
| --- | --- |
| `node --test tests/journal-content.test.mjs` | 10/10 |
| `npm test` après build | 112/112 |
| `npm run lint` | Réussi |
| `npx tsc --noEmit` | Réussi |
| `npm run qa:brand:rev01` | Réussi |
| `npm run build` | Turbopack interrompu sans progression pendant la compilation |
| `npm run build -- --webpack` | Réussi, sans changer la configuration |
| `npm run test:brand-os` | 24/24 |
| `npm run qa:network:rev01 -- --max-failures=1` | Bloqué au lancement de Chromium : MachPortRendezvousServer, Permission denied (1100) ; 1 échec, 4 interruptions, 307 non exécutés |
| `git diff --check` | Réussi |
| Diff `content/journal/` | Vide |

Une tentative de `npm test` pendant le build a échoué faute de `.next/required-server-files.json` : les tests SSR dépendent de la compilation terminée. Le rejeu après build est intégralement vert.

Preuve locale : le contenu chargé et le HTML compilé ne contiennent plus les commentaires internes pour :

- `hook-timeout-lets-tool-call-through`
- `legacy-database-migration-writers-first`
- `what-a-pilot-skips-to-look-finished`

La vérification du rendu serveur utilise le build réel sans socket ni réseau sortant. La preuve navigateur et la vérification après déploiement restent à effectuer par le script/hôte ; aucun résultat production n'est revendiqué.
