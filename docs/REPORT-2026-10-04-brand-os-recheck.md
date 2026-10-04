# Brand OS : vérification de la reprise du 04/10/2026

## État et périmètre

Source : spec locale `CODEX-SPEC-2026-10-04-parrit-ai-brand-os-v1.md`, FIX1 à FIX3 inclus.
Dépôt courant à `bc877afd3cb71e5f1045bf656a6ddd971f2bfe11`, avec les changements
non committés présents au début de cette reprise. AGENTS.md et AI_CONTEXT.md lus.

La migration et les trois correctifs étaient déjà implémentés. La relecture
statique, complétée par une revue indépendante en lecture seule, n'a identifié
aucun écart matériel nécessitant une modification supplémentaire du code.
Les cinq fichiers vendorisés et les quatre icônes sont identiques octet pour
octet au paquet canon local. Le scan des assets dans les sources, public,
content et next.config.ts ne trouve aucun asset interdit.

## Fichiers et tests conservés

- `src/app/(rev01)/rev01.css` : labels fondateur et parcours sur deux lignes,
  espace de 24 px ; titre 404 sur la colonne et actions alignées à gauche.
- `src/app/not-found.tsx` : un bouton principal et deux secondaires.
- `tests/brand-os.spec.ts` : six cas de séparation FR/EN à 375/768/1440 px ;
  404 à 375/1440 px, axe gauche, trois liens entièrement visibles avant le footer
  à 1440 × 900, un seul fond plein. Le deny-all réseau est conservé.
- `AI_CONTEXT.md`, spec, rapport FIX3 et quatre captures d'accueil modifiés
  préalablement : conservés sans réécriture.

Aucun nouveau test ni texte produit ajouté pendant cette reprise : la couverture
demandée existe déjà. Seul le présent rapport est ajouté. Les rapports v1, FIX2
et FIX3 détaillent les fichiers et textes des interventions précédentes.

## Résultats de cette reprise

| Commande / contrôle | Résultat |
|---|---|
| `npm ci --offline --no-audit --no-fund` | Réussi, 462 paquets depuis le cache |
| `npm run lint` | Réussi |
| `npx tsc --noEmit` | Réussi |
| `npm run qa:claims:rev01` | Réussi |
| `npm run qa:brand:rev01` | Réussi |
| `git diff --check` | Réussi |
| `npm run build` standard Turbopack | Resté en compilation, interrompu ; non validé |
| `npm run test:brand-os` | 9 réussites, 3 échecs faute de HTML compilé et de `.next/required-server-files.json` |
| `npm run start -- -p 3210` | Refus du sandbox : `listen EPERM` |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | Chromium refusé : `bootstrap_check_in … Permission denied (1100)` ; 1 échec de lancement, 127 cas non exécutés |

Les neuf tests Node réussis couvrent notamment les empreintes, les mutations
hostiles, les glyphes sur fixtures, les alias, les contrastes des jetons et le
rendu effectif des deux images OG en PNG. Ils ne prouvent pas la géométrie ni
le contraste des pages dans un navigateur.

Logs locaux : `/tmp/parrit-brand-os-recheck-build.log`,
`/tmp/parrit-brand-os-recheck-node.log`, `/tmp/parrit-brand-os-recheck-network.log`.

## Validation restante

Le script hôte doit terminer le build standard, rejouer `test:brand-os`, puis
lancer `next start -p 3210` et `qa:network:rev01` hors sandbox. Les captures
préexistantes n'ont pas été régénérées pendant cette reprise. Aucun résultat
visuel ou de production supplémentaire n'est revendiqué.

Aucun commit, push, déploiement ou changement de données métier effectué.
