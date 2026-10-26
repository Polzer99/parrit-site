# Tour 2 — impact et grammaire de page

Implémentation locale de `HANDOFF-TOUR2-IMPACT.md`, sur le checkout explicitement
fourni par Paul : `f40676dca156224cba0abc1b95a19bec89530b63`. Le seul changement
initial était le handoff non suivi ; il est conservé. Aucun commit, changement
de branche, push, PR ni déploiement effectué.

La validation visuelle n’est pas acquise : Chromium est refusé par macOS avant
navigation. Aucune capture ni mesure de hauteur n’a été inventée. Le critère
« au moins 30 % plus court » reste ouvert, ainsi que le build Turbopack standard.

**Sources et périmètre.** AGENTS.md, AI_CONTEXT.md, TRUTH.md, handoff et sources
actuelles ont été lus avant édition ; le guide Server/Client Components de
Next.js installé (16.3.4) et Context7 (16.2.9, dernière version proposée) ont été
consultés. Les principes visuels des références sont ceux consignés dans le
handoff : aucun nouvel audit des sites externes n’est revendiqué.
Écritures : fichiers de ce checkout uniquement, environnement local, aucun
système client ni donnée métier, zéro ligne de base modifiée. Changements
réversibles par diff ; base Git connue et handoff initial conservé. Limite de
boucle : arrêt des tentatives navigateur après confirmation du refus système,
aucun contournement du sandbox. Preuve de production : hors mandat, non réalisée.

**Modifications livrées.**

- `src/app/(rev01)/page.tsx` : hero 7/5, titre et résumé séparés, paire d’actions,
  cadre produit en dessous ; portes H03/H05/H06/H07 alternées. H06 ne porte plus
  d’onglets. H11 conserve ses six étapes et ses cinq connecteurs seulement.
- `src/system/components/ProductScene.tsx` : présentation hero avec conversation
  et fiche dans un aplat canard, légende en pied, explications en texte courant
  sous le cadre. Mention EN : « Demonstration in French, fictional data. ».
- `src/system/components/ServiceVisual.tsx` : quatre visuels partagés entre
  accueil et guides. Processus avant/après ; quatre étapes de Sprint et trois
  issues reliées ; capture CRM approuvée entourée de quatre catégories sans
  marques ; modèle entouré des huit composants avec connecteurs orthogonaux,
  tiges de 2 px et marqueurs SVG de 10 × 8 px non redimensionnés par un viewBox.
- `src/system/components/SiteV1Page.tsx`, `src/system/site-v1-pages.ts` : visuel
  sous le hero, rangées titre/contenu 4/8, triptyque Conseil, suppression des
  doublons Sprint et Engineering. Le sommaire Harness devient horizontal pour
  rendre la largeur au contenu ; ses ancres restent fonctionnelles.
- `IntegrationBuildSwitcher.tsx` : onglets, clavier et contenu SSR conservés
  sur Engineering ; cession conservée une seule fois dans la section gouvernance.
- `src/system/site-v1.css` : colonne utile de 1160 px sur V1, header et footer
  alignés sur cette colonne, mobile à une colonne ; animation clip-path de bas
  en haut, une fois, en `--hold`/`--ease`, uniquement sans réduction du mouvement.
  Processus mobile côte à côte, six étapes compactes, filets identiques.
- `RevHeader.tsx` : symbole vectoriel de menu, logo/langues/menu sur une rangée
  mobile ; CTA principal du hero sous le titre. Les interactions natives du
  menu et sa fermeture clavier sont conservées. FAQ déjà vectorielle conservée.
- Standard, Commission, `engagements.ts`, `scripts/generate-llms.mjs` : promesses
  adoucies, format canonique du premier échange de 15 minutes en visio, réponse
  écrite par une personne. `public/llms.txt` régénéré par son script.
- Apostrophes françaises normalisées dans les dictionnaires des pages accueil,
  guides, Standard, Commission, Manufacture, Dossiers, Journal (index uniquement),
  Build With You, Systems et Sketch, ainsi que leurs composants localisés
  (AgentEsquisse, FinalCall, QuickCapture, RegistrySnapshot, MechanismSchema,
  Opening, RevFooter, RevHeader, ProductScene et ProcessDiagram).
  Aucun corps d’article du Journal modifié.
- `AGENTS.md` et `AI_CONTEXT.md` : état courant et déplacement des onglets documentés.

Les images approuvées, polices et fichiers Brand OS vendorisés sont inchangés.
Les coins et l’ombre intégrés aux pixels de la capture CRM restent visibles dans
un cadre rectangulaire plus grand. Remplacer cet actif demeure une décision de
Paul ; il n’a pas été retouché.

**Tests ajoutés et adaptations.**

`tests/tour2-impact.test.mjs` ajoute cinq tests Node : réutilisation des visuels
FR/EN sans JS, structure des connecteurs/branches, un seul H1 et CTA principal,
absence de second grand titre dans le hero, légende EN, doublons retirés,
apostrophes françaises et animation opt-in.

`tests/tour2-impact.spec.ts` ajoute neuf cas navigateur : huit combinaisons
FR/EN × 1440/375 × JS actif/inactif, plus la comparaison des hauteurs des huit
guides localisés. Captures accueil et Conseil aux deux tailles et dans les deux
langues. Contrôles : haut du cadre avant 900 px, largeur utile 1160 px,
alternance, ordre mobile, boutons pleine largeur, pas de débordement, contenu
visible en réduction du mouvement, étapes compactes, absence de connecteur
après la dernière étape. Le test des hauteurs échoue si la référence manque ou
si une page ne baisse pas d’au moins 30 %. Il est inclus dans `qa:network:rev01`.

Adaptations explicites aux contrats remplacés par le handoff :

| Tests | Ancienne assertion remplacée et couverture conservée |
|---|---|
| `ergonomie-impact.spec.ts`, `alignment-grid.spec.ts`, `audit-readability.spec.ts` | Scène latérale / actions sous H1 remplacées par cadre dessous et actions alignées au résumé ; grille et géométrie toujours contrôlées. |
| `doctrine-visible.spec.ts`, `audit-readability.spec.ts` | CTA mobile vérifié dans le hero, barre masquée, sept liens du menu et fermeture Échap conservés. |
| `conformity-home.spec.ts` | Titres tous alignés à gauche remplacés par deux axes alternés sur desktop, axe unique mobile. |
| `site-v1.spec.ts`, `site-v1-v4.spec.ts`, `site-v1-visual.spec.ts`, `site-v1.test.mjs` | Onglets testés sur Engineering : clavier, sélection, contraste et trois panneaux SSR conservés ; navigation native sans JS toujours testée sur accueil et Engineering. |
| `site-v1.spec.ts`, `six-capacites.test.mjs` | Trois images approuvées sur accueil, une sur Engineering ; allowlist d’actifs inchangée. CTA mobile contrôlé dans le hero. |
| `site-v1-visual.test.mjs`, `tour1-coherence.test.mjs`, `ergonomie-impact.test.mjs` | Méthode Conseil de quatre étapes vérifiée sur sa page ; accueil vérifie le processus quatre étapes par colonne. Sprint conserve quatre nœuds et trois connecteurs internes, puis les issues. |
| `product-scene.spec.ts`, `juridique-faiblesses.test.mjs` | Processus côte à côte sur mobile, filets égaux, accent sur le libellé cible. |
| `site-v1.test.mjs` | Ancien ensemble Harness sans connecteur remplacé par huit composants et huit connexions au modèle. |
| `anti-slop-copy.spec.ts`, `brand-os-render.test.mjs` | Exception exacte pour la légende de démonstration en français et le format canonique du rendez-vous, limité à Commission. Les interdictions de prix/offres restent actives. |
| `tour1-coherence.spec.ts` | Apostrophe du CTA FR actualisée ; texte et destination continuent d’être contrôlés. |

Aucun contrôle de permission, confidentialité, destination, réseau, empreinte
d’actif ni régression métier n’a été supprimé. Deny-all réseau partagé conservé.

**Exécutions.**

| Vérification | Résultat |
|---|---|
| `npm ci --silent` | Réussi. |
| Référence `npm test` avant modification | 165/169 ; quatre échecs dus à l’absence de `.next` et de son manifeste dans le checkout initial. |
| `npm run lint` | Réussi. |
| `npx tsc --noEmit` | Réussi. |
| `npm test` après implémentation et build | 174/174. |
| `npm run build` | Turbopack reste à « Creating an optimized production build » ; interrompu sans progression. Pas de succès revendiqué pour cette commande. |
| `npm run prebuild` puis `npx next build --webpack` | Réussi, 62 pages générées. Script `build` inchangé. |
| `npm run qa:brand:rev01` | Réussi. |
| `npm run qa:claims:rev01` | Réussi. |
| `npm run test:brand-os` | 24/24, empreintes d’actifs conservées. |
| `npm run qa:network:rev01 -- --list` | 498 cas recensés dans 26 fichiers. |
| `npx playwright test tests/tour2-impact.spec.ts --browser=chromium --max-failures=1` | Refus Chromium avant navigation ; huit autres cas non exécutés. |
| `npm run qa:network:rev01 -- --max-failures=1` | Refus Chromium avant navigation ; arrêt rapide, aucune validation navigateur. |
| `git diff --check` | Réussi. |

Erreur reproductible avant et après modification :
`bootstrap_check_in … Chromium.MachPortRendezvousServer … Permission denied (1100)`.
Aucun serveur n’a été lancé dans ce sandbox, conformément à AI_CONTEXT.md.
Les journaux conservés se trouvent dans `docs/site-v1/validation-tour2/`.

La revue indépendante en lecture seule a signalé les connexions insuffisantes
sur les premiers schémas. Elles ont été corrigées : chaîne Sprint, bifurcation,
catégories réparties autour de la fiche, huit liaisons continues du modèle.
Une seconde revue a trouvé une surcharge CSS d’orientation des connecteurs
inférieurs Engineering ; elle a également été corrigée. Cette revue statique
ne remplace pas la validation visuelle.

**Captures et mesures attendues sur l’hôte.**

| Page | Avant à 1440 px | Après à 1440 px | Réduction |
|---|---|---|---|
| Conseil FR/EN | Non mesuré : Chromium refusé | Non mesuré | Non vérifiée |
| AI Sprints FR/EN | Non mesuré : Chromium refusé | Non mesuré | Non vérifiée |
| Engineering FR/EN | Non mesuré : Chromium refusé | Non mesuré | Non vérifiée |
| Harness FR/EN | Non mesuré : Chromium refusé | Non mesuré | Non vérifiée |

Sur un checkout séparé de la référence `f40676d`, après build et démarrage local
sur 3210, copier uniquement la nouvelle spec de test et lancer :

```sh
TOUR2_MEASURE=before npx playwright test tests/tour2-impact.spec.ts --browser=chromium --grep 'page heights'
```

Conserver `docs/site-v1/captures/tour2-heights-before.json`, puis sur le candidat
après build et démarrage local sur 3210 :

```sh
TOUR2_BASELINE_FILE=/chemin/absolu/tour2-heights-before.json npm run qa:network:rev01
```

Le test écrit `tour2-heights-after.json` et huit captures `tour2-home-*` et
`tour2-conseil-*` dans `docs/site-v1/captures/`. Fournir ces preuves et corriger
les éventuels écarts avant de déclarer les critères visuels atteints. La
comparaison mesure la page entière, fonts chargées, même viewport, même état
initial des FAQ et des onglets. Aucun pourcentage déduit du seul CSS.
