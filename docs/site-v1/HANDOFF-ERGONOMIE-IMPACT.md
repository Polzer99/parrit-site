# Handoff Codex : sortir de l'univers « technique », ergonomie et impact de l'accueil (26/10/2026, soir)

## Ce que Paul a dit (dicté, 26/10/2026)

Sur parrit.ai en production : « beaucoup mieux qu'avant », mais « gros problème d'ergonomie » ; « il manque quelque chose de très visuel » ; « des lignes les unes sur les autres » ; « integrate what exists » écrit deux fois ; la méthode « sur l'ordinateur, ça va pas » ; des lignes « qui n'ont pas lieu d'être » sous « Let's talk about the operation you want to transform » ; « ça fait trop un site genre blog » ; « ça manque d'impact technologique ».

Puis : « un problème au niveau du copywriting sur tous ces mots. Nous vendons le système en production. […] tout cet univers, la visuelle de pseudo-geek qu'on avait supprimée dans la nouvelle direction artistique, dans le nouveau branding. Je comprends pas comment on reste là-dessus. » Ordre : mettre en production.

## Règle de fond, qui prime sur `AGENTS.md`

Le site est en **mode accessible** du Brand OS (dirigeants, équipes métier). La charte réserve la police machine à l'appareil technique (`parrit-canon/brand/decisions/LEGACY-VISUAL-RECOVERY.md` : « la mono = appareil technique seulement »). Sur les pages publiques du groupe `(rev01)` et les pages `SiteV1Page` :

1. **Plus aucun surtitre en police machine** (composant `K`, classes de « kicker » ou « eyebrow », petites capitales espacées du type `CONSULTING · TRANSFORMATION · ENGINEERING`). Le surtitre disparaît ; si une information est utile, elle passe dans le titre.
2. **Plus d'étiquettes de fiche technique** : « Statut / Problème / Intervention / Système », « Status / Problem / Intervention / System », « Aujourd'hui / Demain » en police machine, « Document 01 », « Parrit / Registre documentaire », « Parrit / Document register ».
3. **Plus d'index numérotés en police machine** (« 01 », « 02 »…) devant les étapes de l'accueil et des pages V1. L'ordre se lit par la mise en page et les connecteurs.
4. IBM Plex Mono reste autorisée uniquement dans le Journal pour du code, et sur `/systems` (annexe technique). Le mot-symbole `PARRIT.AI` de la barre de navigation ne change pas (décision logo encore ouverte).
5. Mettre à jour `AGENTS.md` en conséquence : section « Éléments propriétaires » (la registry line et le Standard numéroté 01…06 ne s'affichent plus sur les pages en mode accessible ; le Standard garde ses six engagements, sans numéros en police machine) et ajouter cette règle de fond, datée du 26/10/2026, avec la citation de Paul ci-dessus.
6. Contrôle bloquant ajouté à `qa:brand:rev01` ou à une spec Playwright : sur l'accueil et les quatre pages V1, FR et EN, aucun élément visible rendu en `IBM Plex Mono` hors `/systems` et hors blocs de code.

## Texte de l'accueil : remplacements mot pour mot

Écrit nativement dans chaque langue (pas de traduction). Tout libellé non listé ici reste inchangé. Le titre d'accueil, les libellés des deux boutons du haut de page, le nom des clients et leurs descriptions ne changent pas.

| Emplacement | FR | EN |
|---|---|---|
| Haut de page, surtitre | supprimé | supprimé |
| Haut de page, sous-titre | « De la stratégie à la mise en production, nous repensons vos opérations, nous intégrons les bonnes technologies et nous livrons un système qui tourne. Pas une maquette. » | « From strategy to production, we rethink how you operate, bring in the right technology and deliver a system that runs. Not a mock-up. » |
| Références, titre | « Ce que nous avons construit, et pour qui » | « What we have built, and for whom » |
| Conseil, surtitre | supprimé | supprimé |
| Conseil, lien | « Voir l'approche conseil » | « See our consulting approach » |
| Exemples, titre (ex « Trois façons dont nous travaillons ») | « Trois systèmes que nous avons construits » | « Three systems we have built » |
| AI Sprints, surtitre | supprimé | supprimé |
| AI Sprints, titre | « AI Sprints : tester un système sur un problème précis, puis décider sur preuves. » | « AI Sprints: test a system on one precise problem, then decide on evidence. » |
| AI Sprints, lien | « Cadrer un sprint » | « Scope a sprint » |
| Engineering, surtitre | supprimé | supprimé |
| Engineering, lien | « Voir l'engineering » | « See engineering » |
| Harness, surtitre | supprimé | supprimé |
| Harness, lien | « Fiabiliser vos agents » | « Make your agents reliable » |
| Méthode, titre (ex « Méthode ») | « Six étapes, de vos opérations à un système en production. » | « Six steps, from how you operate to a system in production. » |

**Cartes d'exemples** (ex tableau Statut / Problème / Intervention / Système) : chaque cas devient une carte de deux lignes, sans étiquette.

| Cas | FR | EN |
|---|---|---|
| 1 | « Une carte de visite devient une fiche CRM, après validation. » puis, en petit : « Démonstration, données fictives. » | « A business card becomes a CRM record, once approved. » puis : « Demonstration, fictional data. » |
| 2 | « Laparra, grossiste du MIN de Rungis : un CRM construit pour son suivi commercial. » puis : « Construit pour le client. » | « Laparra, a wholesaler at the Rungis market: a CRM built for its sales follow-up. » puis : « Built for the client. » |
| 3 | « Clevery Avocats : un agent construit pour le cabinet. » puis : « Construit pour le client. » | « Clevery Avocats: an agent built for the firm. » puis : « Built for the client. » |

Si les libellés de statut viennent du registre des preuves (`getSiteEvidence`), garder la source et ne changer que l'affichage.

Libellés de bouton : sans point final, partout sur le site.

## Ergonomie

1. **Un visuel fort en haut de page.** Remettre `ProductScene` (composant et images déjà dans le dépôt, `public/brand/scenes/scene-carte-visite-fiche-crm*`) dans la section d'ouverture, à la place de `ProcessDiagram`. Reprendre l'intégration et les textes FR/EN d'avant le commit `bd7f9aa` (`git show bd7f9aa^:"src/app/(rev01)/page.tsx"`), en retirant tout libellé en police machine, et avec la mention visible « Démonstration, données fictives » / « Demonstration, fictional data ». À 1440 px : texte à gauche, scène à droite, dans le premier écran ; à 375 px : scène sous le texte. Aucune nouvelle taille de police. `ProcessDiagram` (quatre étapes) descend dans la section Conseil, sous ses quatre étapes, avec ses titres de colonne en police de texte.
2. **Un seul filet là où il en faut un.** Deux filets horizontaux ne se suivent jamais à moins de `var(--brand-s3)` ; un changement de fond ne porte pas de filet en plus. Clôture (accueil et `SiteV1Page`) : aucun filet au-dessus ni au-dessous du bouton. Pied de page : pas de filet haut quand la section précédente est sombre ; un seul filet entre les lignes de liens. Onglets Engineering : pas de bordure basse de panneau quand un filet suit.
3. **Doublon « Intégrer ce qui existe ».** Dans `IntegrationBuildSwitcher`, quand les onglets sont actifs, le `<h3>` du panneau est visuellement masqué (classe d'accessibilité existante), jamais supprimé : sans JavaScript, les trois panneaux restent visibles avec leur titre.
4. **Méthode sur ordinateur.** Six colonnes à filets verticaux : non. Frise de deux rangées de trois étapes à 1440 et 1024 px, une colonne à 375 px, étapes reliées par `ProcessConnector`, sans filet vertical, sans numéro en police machine.
5. **Moins « blog ».** Appels secondaires : boutons `rev-button ghost` à largeur de contenu, alignés à gauche, au lieu de cadres pleine largeur. Références : grille de cartes (2 colonnes à 1440 px, 1 à 375 px), nom en gras, réalisation dessous, fond `var(--brand-surf)`, sans bordure, ombre ni radius. Cartes d'exemples : même traitement.

## Interdits

- Aucun logo de client ou d'éditeur (accord écrit requis, décision ouverte).
- Aucun nouveau chiffre, nom de client, prix, promesse de résultat ou texte hors des tableaux ci-dessus.
- Aucune couleur littérale, nouvelle taille de police, ombre, radius ou dégradé. Aucun tiret cadratin.
- Ne pas casser : H06 sans JavaScript, CTA vers `/commission`, deny-all réseau, absence de débordement à 375 px, contrôle des promesses de propriété.
- Ne supprimer ni affaiblir aucune assertion ; adapter seulement celles qui figeaient l'ancienne structure (surtitres, index, étiquettes), et le dire dans le rapport.

## Critères d'acceptation

1. `npm run lint`, `npm test`, `npm run build`, `npm run qa:brand:rev01`, `npm run qa:claims:rev01`, `npm run test:brand-os` verts ; Claude rejoue `npm run qa:network:rev01` en entier sur l'hôte.
2. Nouveau test de géométrie à 1440 et 375 px, accueil FR/EN : aucune paire de filets horizontaux à moins de 24 px ; scène produit visible dans le premier écran à 1440 px ; un seul « Intégrer ce qui existe » visible quand les onglets sont actifs ; méthode sans débordement ; aucun texte visible en IBM Plex Mono.
3. Captures 1440 et 375 px de l'accueil FR et EN jointes au rapport.

## Branche et PR

Branche dédiée depuis `main` (contient la PR #329, fusionnée le 26/10), PR vers `main`, pas de fusion par Codex. Paul a ordonné la mise en production : Claude fusionne après relecture et suite complète verte sur l'hôte.
