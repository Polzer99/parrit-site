# Premier certificat Harness : compte rendu

## Livraison locale

- `public/certificates/malicious-mcp-server-after-install.json` : copie binaire de
  `~/.parrit/certificates/journal/parrit/malicious-mcp-server-after-install.public.json`.
  Le chemin intermédiaire prévu par la spec, `docs/certificates-source/`, était
  absent dès le début et reste absent. Aucun certificat n'a été reconstruit.
- SHA256 du fichier public complet :
  `0d37563c83c45655d2d43ae3fcc34e3ae812352b9ac7cf672bbdf130b3d04354`.
  `cmp` confirme l'identité avec le canon. Ce digest des octets complets est
  distinct du champ interne `certificate_sha256`, conservé sans modification.
- L'article MDX reste inchangé :
  `7c514e04973364814bb05e29f2e09dc08c432bd5a3b2116c59f79b072a40df83`.
- `tests/harness-certificates.test.mjs` : nouveau test de validité du certificat
  réel et de l'empreinte complète de l'export public.
- `tests/brand-os-render.test.mjs` : assertions sur le rendu serveur compilé de
  l'article EN/FR, son badge « Harness Certified ✓ » et le lien local exact.
- `tests/conformity-journal.spec.ts` : test navigateur du badge, clic sur la preuve,
  réponse HTTP 200 et contenu JSON attendu, sous deny-all réseau partagé.
- `AI_CONTEXT.md` : état actualisé du certificat et de sa validation.

La spec non suivie déjà présente a été préservée. Aucun code applicatif, article,
token, verrou de dépendances ou fichier canon hors dépôt n'a été modifié.
Aucun commit, push ou déploiement.

## Vérifications

Avant copie : 6 tests Harness et 9 tests Journal passent ; claims valide.
Le nouveau test de certificat échoue sur l'absence du fichier, puis passe après
copie, sans modification de ses assertions.

Après copie :

| Commande | Résultat |
| --- | --- |
| `npm ci --silent` | Réussite |
| `npm run build` | Prebuild valide ; Turbopack interrompu après absence de progression |
| `npm run build -- --webpack` | Réussite, 55 pages générées |
| `npm run test:journal` | 9/9 |
| `npm run qa:claims:rev01` | Réussite |
| `node --test tests/harness-certificates.test.mjs` | 7/7 |
| `npm test` après build | 104/104, dont rendu compilé et contrats Brand OS |
| `npm run lint` | Réussite |
| `npx tsc --noEmit` | Réussite |
| `npm run qa:brand:rev01` | Réussite |
| `git diff --check` | Réussite |
| Test Playwright ciblé | Bloqué au lancement de Chromium par macOS : `bootstrap_check_in … Permission denied (1100)` |

Une première exécution de `npm test`, avant la fin du build, avait échoué sur
trois tests dépendant des fichiers `.next` absents. La même batterie passe
entièrement après le build Webpack. Le build émet les avertissements existants
sur `metadataBase` ; aucune modification de métadonnées dans ce lot.

## À rejouer sur l'hôte

Le rendu serveur est vérifié sans socket ni réseau ; le clic navigateur et la
réponse HTTP du fichier statique restent à confirmer. Aucun serveur local n'a
été lancé, conformément à AI_CONTEXT.md. Sur l'hôte, lancer le serveur sur 3210
puis `npm run qa:network:rev01` (qui inclut le nouveau test). Rejouer également le
build Turbopack standard. Aucune preuve en production n'est revendiquée.
