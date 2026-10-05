# Contre-vérification du 05/10/2026 — compte rendu

Implémentation terminée dans le checkout ; validation navigateur et captures bloquées par l'environnement. Aucun commit, push, merge, préversion distante ou déploiement effectué.

## Périmètre, sources et conservation

- Dépôt : checkout demandé `handoff-docs-CODEX-SPEC-2026-10-05-parrit-ai-contre-verifi`, HEAD `ea0630805accc10a6313e29e3fa0149c696a44ae`, base correspondant à celle de la spec. La production n'a pas été interrogée.
- État initial : seul `docs/CODEX-SPEC-2026-10-05-parrit-ai-contre-verification-v1.md` était non suivi. Il est conservé sans modification.
- Instructions lues : AGENTS.md, AI_CONTEXT.md, TRUTH.md, harness §55, spec ; documentation locale Next 16.3.4. Registres verbaux et OCR du canon consultés en lecture seule.
- Écritures : sources, tests, un asset dérivé et documentation dans ce checkout ; artefacts locaux de compilation/tests. Aucune donnée métier, migration ou écriture externe. Retour arrière possible par retrait sélectif du diff et des nouveaux fichiers, sans toucher la spec préexistante.
- Plan appliqué : textes/claims → scène et composition → intégration/tests → relecture indépendante. Une passe d'implémentation et corrections ciblées ; arrêt des tentatives navigateur dès le refus de lancement, pas de contournement du sandbox.

## Modifications livrées

### Scène produit

`src/system/components/ProductScene.tsx`, nouveau `ProductScene.css`, accueil et `rev01.css` : conversation p2 en HTML serveur, français identique à la capture dans les deux locales (attribut `lang="fr"`). En-tête Agent CRM/bot, pastille CRM, date, quatre bulles, heures et coches, choix Oui/Non et champ Message représentés sans envoi ni interaction trompeuse. Les coches/croix sont vectorielles pour ne pas dépendre de glyphes absents des polices canoniques. Textes et heures à 14 px minimum ; repères 1/2 à 6 px à gauche des bulles.

`public/brand/scenes/scene-carte-visite-photo.png` est une extraction sans redimensionnement ni retouche du PNG approuvé : `{left:376, top:570, width:754, height:520}`. Le test compare tous les pixels au rectangle source. Les PNG initiaux et leurs exports restent inchangés.

Conversation : 320 px desktop, jusqu'à 360 px sous 1025 px. CRM : 420 px au-delà de 1024 px, pleine largeur du conteneur en dessous ; libellé à 10 px du bloc image. Titre équilibré. Les couleurs tierces sont déclarées seulement sur `.scene-chat`, explicitement documentées ; la gate `scripts/brand-conformity-check.mjs` autorise uniquement les huit déclarations exactes de ce fichier, sans exemption globale de fichier. Aucun token canon modifié.

**Limite CRM demandée par la spec : les petits libellés raster ne garantissent toujours pas 12 px.** À 375 px, le conteneur de 335 px réduit la capture de 860 px à 39 % ; à 1440 px, les 420 px la réduisent à 49 %. Un libellé d'environ 20 px dans la source représente donc environ 8 et 10 px respectivement. C'est une estimation d'échelle du raster, pas une mesure de police CSS ni une validation navigateur. La capture réelle est conservée, sans redessin.

### Noms, prix et affirmations

- `site.config.ts` : montant et devise BWY centralisés dans `BUILD_WITH_YOU_PRICE`.
- `OfferCard.tsx`, accueil, `build-with-you/page.tsx`, `systems/page.tsx` : « À partir de 3 200 € HT au forfait » / « From €3,200 excl. VAT, fixed price ». Espaces insécables entre milliers, devise et HT ; montant issu de la configuration.
- `build-with-you/page.tsx` : système sur mesure/custom system ; lien long conservé comme lien de texte.
- `RevFooter.tsx` : réserver **l'**examen / book **the** examination. Les boutons étaient déjà harmonisés.
- `manufacture/page.tsx` : réutilisation de l'existant et périmètre écrit/non clair.
- `standard/page.tsx` : PS-06 sur la réutilisation ; titre « Six engagements que nous appliquons à nos systèmes. » / « Six commitments we apply to our systems. ».
- `dossiers/page.tsx` : sceau limité à « En production » / « In production ».
- `systems/page.tsx` : point avant le constat daté, chiffres inchangés.

**Choix Standard :** `claims.json`, entrée `CLM-INT-STANDARD`, autorise des engagements de méthode et non une preuve de résultat systématique. La formulation « vérifiés sur chaque système avant sa livraison » n'est donc pas retenue. Source lue au 05/10/2026 ; la formulation prudente explicitement proposée par la spec est appliquée.

### Composition et Journal

`rev01.css` : liens de prose en texte courant souligné, lien alternatif du hero lisible, fondateur non rose ; titres h1/h2/h3 équilibrés. Cadre : insets horizontaux symétriques conservés, ajout d'espace vertical dont 0,22 em sous le texte pour les jambages. Coins canoniques inchangés. Les éléments de la liste de références sont des spans insécables. Sur `/systems`, le CTA du hero passe en contour pour ne pas concurrencer celui du header ; destination et libellé inchangés.

`src/proxy.ts`, `src/system/locale.ts`, `src/lib/server/locale.ts`, `journal/[slug]/page.tsx` : les alias d'articles `/fr/journal/[slug]` restent à leur URL par rewrite et affichent « Article en anglais. » sous le titre. Corps et titre anglais annotés `lang="en"`, canonical anglais et sitemap conservés. Flux RSS, OG, esquisses et autres routes conservent leurs comportements. Aucun article MDX modifié.

## Tests ajoutés et contrats avant/après

| Fichier | Changement de contrat ou couverture |
|---|---|
| `product-scene.test.mjs` | Nouveau test d'identité pixel du recadrage ; empreintes des anciens assets conservées. |
| `product-scene.spec.ts` | Conversation raster → transcript HTML exact ; anciens repères proportionnels → bulles DOM, séparation de 6 px ; CRM 380 → 420 px desktop/pleine largeur mobile ; corps ≥14 px, label 8–12 px ; captures et contrôles de débordement conservés. |
| `brand-os-render.test.mjs` | Deux pictures → une picture CRM + photo PNG ; transcript/emphases/heures côté serveur ; alias d'article avec notice FR, canonical et contenu EN identiques. |
| `brand-os.spec.ts` | Symétrie du cadre ≤2 px, réserve basse ≥descente mesurée de y/q, coins 14×14 ; anciennes marges écran ≥16 px et séparation ≥12 px conservées. |
| `doctrine-visible.spec.ts` | Accent étendu à commission/systems, FR/EN 1440/390 ; inclut les liens roses, pas seulement les fonds ; CTA systems en contour ; listes sans coupure ; captures FR ajoutées à 768/375 pour accueil/BWY/commission. |
| `offer-card.test.mjs` | Prix ancien « · forfait/fixed fee » → formulation décidée ; deux tests ajoutés sur les insécables et un autre montant. |
| `offer-cards.spec.ts`, `systems.spec.ts` | Prix attendus actualisés en FR/EN, sans réduction de seuil. |
| `conformity-standard.spec.ts` | Ancien titre « Chaque système livré les tient » et promesse de valeur PS-06 → engagement de méthode et réutilisation. |
| `conformity-i18n.spec.ts` | Alias article auparavant 301 → URL FR conservée, notice, contenu EN identique, canonical EN, bascule FR/EN. |
| nouveau `journal-locale.test.mjs` | 4 tests hors réseau du vrai proxy : rewrite/query, en-têtes forgés, redirections hors articles, bascule/paramètres. |

Aucun seuil de lisibilité, contraste, débordement ou géométrie n'a été diminué. Les attentes remplacées correspondent au nouveau contrat de la spec. Les tests navigateur utilisent le deny-all partagé ; aucun envoi réel n'a été exécuté.

## Exécution et preuves

Dépendances initialement absentes. Installation reproductible depuis le cache : `npm ci --offline --cache /Users/paullarmaraud/.npm --ignore-scripts --no-audit --no-fund` (462 paquets). Lockfile inchangé.

Baseline après installation : lint, claims et gate de marque verts ; `test:brand-os` 15/18, trois échecs dus à l'absence initiale de `.next`, donc pas une baseline de rendu complète.

| Vérification finale | Résultat |
|---|---|
| `npm run lint` | Passe, aucune erreur ni avertissement ESLint. |
| `npx tsc --noEmit` | Passe. |
| `npm run qa:claims:rev01` | Passe. |
| `npm run qa:brand:rev01` | Passe. |
| `npm run build` | Turbopack sans progression après la phase « Creating an optimized production build » ; interrompu. |
| `npm run build -- --webpack` | Passe, compilation/types/prérendu terminés. |
| `npm run test:brand-os` | **19/19 passent**, dont rendu compilé FR/EN avec réseau refusé. |
| Tests Node complémentaires ci-dessous | **45/45 passent**. |
| `git diff --check` | Passe. |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | Bloqué avant navigation : Chromium `bootstrap_check_in … Permission denied (1100)`. 1 lancement en échec, 196 tests non exécutés. Ce n'est pas une validation fonctionnelle. |

Commande des 45 tests complémentaires :

```sh
node --test tests/offer-card.test.mjs tests/journal-locale.test.mjs tests/doctrine-visible.test.mjs tests/privacy-corrections.test.mjs tests/entity-spelling.test.mjs tests/entity-graph.test.mjs tests/publish-journal-gates.test.mjs
```

Le rendu serveur émet l'avertissement Next `metadataBase` sur son environnement mock ; les assertions des images et canonicals absolus passent. La relecture indépendante a signalé l'ancien contrat scène (actualisé) et le risque de double CTA rose sur systems (hero passé en contour).

## Validation restante sur l'hôte

**Aucune capture navigateur n'a pu être produite.** Les tests de capture FR 1440/768/375 accueil, scène et Build With You sont prêts ; ne pas considérer centrage réel, jambages, veuves, contrastes composés ou éclats simultanés comme validés par le seul build.

Sur l'hôte, lancer le serveur local sur 3210, puis la batterie complète `npm run qa:network:rev01`. Les pièces jointes Playwright comprennent les captures pleine page FR et les captures de scène. Aucune preuve de préversion ou production n'est revendiquée : publication interdite pendant cette tâche.


## Reprise FIX1 du 05/10/2026

Le checkout reçu contenait déjà l'implémentation ci-dessus, ses tests et des captures
modifiées. Tous ces changements ont été conservés. L'addendum FIX1 de la spec impose
deux corrections seulement et des tests inchangés ; aucun nouveau test n'est nécessaire.

- `src/app/(rev01)/rev01.css` : `box-sizing: border-box` sur les quatre
  pseudo-éléments du cadre du hero uniquement. Les 14 px déclarés incluent désormais
  les bordures de 2 px, au lieu de produire 16 px. Insets, centrage et marge des
  jambages conservés ; commentaire mobile actualisé.
- `src/system/system.css` : `.cal-status i` utilise `currentColor`, donc la
  couleur du texte adjacent, au lieu du jeton rose `--crit-dot`.
- Ce rapport documente la reprise ; aucun autre fichier modifié par cette passe.

Périmètre d'écriture : checkout local et artefacts de vérification ; aucune donnée
métier ni écriture distante (0 ligne métier). Sauvegardes avant édition dans
`/tmp/parrit-contre-fix1/` ; retour arrière sélectif possible sans annuler le travail
préexistant. Boucle bornée à une correction, puis vérifications ; arrêt au refus
répété de Chromium, sans contournement. Documentation CSS locale Next 16.3.4 lue.

Baseline de reprise : claims et marque passent ; les tests navigateur ciblés ne
démarrent pas (Chromium refusé par macOS). Les deux régressions fonctionnelles
sont celles documentées par FIX1, pas une reproduction navigateur dans ce sandbox.

| Vérification après FIX1 | Résultat |
|---|---|
| `npm run lint` | Passe. |
| `npx tsc --noEmit` | Passe. |
| `npm run qa:claims:rev01` | Passe. |
| `npm run qa:brand:rev01` | Passe. |
| `npm run build -- --webpack` | Passe (55 pages générées). Webpack conservé compte tenu du blocage Turbopack documenté lors de la passe précédente. |
| `npm run test:brand-os` | 19/19 passent. |
| Les sept fichiers Node complémentaires listés plus haut | 45/45 passent. |
| `git diff --check` | Passe. |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | Bloqué au lancement Chromium : `bootstrap_check_in … Permission denied (1100)` ; 1 échec de lancement, 196 tests non exécutés. |

Avertissements non bloquants : `metadataBase` lors du build/rendu serveur et
`MODULE_TYPELESS_PACKAGE_JSON` dans les tests Node. Aucun seuil ni assertion
modifié. Les captures déjà présentes sont préexistantes : aucune nouvelle capture
et aucune validation visuelle de FIX1 ne sont revendiquées. Rejouer la batterie
navigateur sur l'hôte pour vérifier les coins et l'accent aux largeurs prescrites.
Aucun serveur, commit, push ni déploiement effectué pendant cette reprise.
