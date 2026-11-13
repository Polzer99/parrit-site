# Accueil épuré, compte rendu du 13/11/2026

## Périmètre et état

Implémentation de `docs/CODEX-SPEC-2026-11-13-accueil-epure.md` sur la base
locale `e70743066e8c5d32504340859e471d499a0b3c7f` (PR #383), identique à la
référence locale `origin/main`. Pas de fetch ni de changement de branche.
La spec était le seul fichier non suivi préexistant ; son SHA256 est inchangé.
Aucun commit, push, PR, fusion ou déploiement effectué. Le script externe
reste responsable de la suite. Aucun appel LLM, message ou écriture métier.

La référence a passé npm ci, lint, build Webpack et **675/675 tests Node**.
Les vérifications finales et leur état sont consignées en fin de rapport.
Aucune preuve navigateur ou production n'est revendiquée.

## Modifications et preuves par bloc

| Bloc | Réalisation | Fichiers et preuve |
| --- | --- | --- |
| Hero | H1 conservé ; 17 objectifs en trois groupes FR/EN ; résultat unique annoncé ; retrait introduction, carte et réassurance ; bouton AppointmentLink unique attribué accueil-ID. | `src/system/home-goals.ts`, `components/HomeGoals.tsx`, `components/AppointmentLink.tsx`. Tests SSR pour chaque objectif/langue, résultat/chemin/lien/calendrier cohérents. |
| Schéma | Trois plans de 16 nœuds, grille4×4 ; traductions existantes reprises ; trois nœuds actifs et fonds pleins des libellés ; un tracé déclenché par sélection, aucun minuteur ; mouvement réduit sans animation. | `GoalDiagram` dans `HomeGoals.tsx`, règles finales `single-page.css`. Tests48 nœuds/17 chemins ; géométrie navigateur préparée. |
| Sans JavaScript | Formulaire GET objectif avec bouton de soumission uniquement sans JS ; les17 options et résultats sont rendus initialement, le résultat choisi est lisible après rechargement. Les liens moteurs sont aussi des GET. | `HomeGoals.tsx`, `tests/accueil-epure.test.mjs` et `.spec.ts`. UTM conservés ; pas de nouveau cookie, stockage ou mesure. |
| Attribution | `avecSource` reste l'unique mécanisme d'attribution ; source validée prioritaire au retour sur le lien de rendez-vous ; ancienne source retirée des liens moteurs ; calendrier reçoit metadata[source] et UTM multiples. | `HomeGoalProvider`, `GoalBooking`, `AppointmentLink`. Tests source-only, ancienne query, rechargement et liens moteurs. Remontage du calendrier au changement d'objectif car embed-react capture config au montage. |
| Références | ClientLogoStrip, permissions et six fichiers inchangés ; logos statiques, deux rangées conservées. | `SinglePage.tsx`, `single-page.css`. Contrôles des six noms/assets/publication conservés. |
| Trois moteurs | Trois colonnes sans cadre, neuf lignes du prototype, deux BrandConnector par ligne, sélection du hero ; principe d'approbation unique. Carrousel natif mobile. | `GoalMotors`, `MobileCarousel` existant. Tests neuf destinations, focus, sélection, absence d'étiquettes répétées et caractères flèches. |
| Mesures | Deux chiffres vérifiables, dates exactes et liens localisés aux articles ; ligne presse sans nom de personne et lien Journal. | `components/HomeEvidence.tsx`. Tests du chiffre verbatim et date dans chaque article FR, destinations finales et absence97 %. |
| Assistants | ChatGPT, Claude, Perplexity, Le Chat ; question du prototype traduite EN, nom et adresse du site seuls comme informations sur le visiteur/sujet. Nouvel onglet avec noopener. | `HomeEvidence.tsx`. Quatre liens SSR ; contrôle des domaines/protocole, paramètres et absence de données de visite. |
| Suite conservée | Terrain, deux métiers, étapes, technologies, équipe, FAQ, contact/calendrier, dans leur ordre relatif et sans réécriture de leurs textes. | `components/SinglePage.tsx`. FAQ/JSON-LD, photos/empreintes, partenaires et routes restent testés. |
| Sections remplacées | Téléphones, grille 12 services, bandeau central et derniers articles retirés du rendu. Les composants historiques et leurs tests unitaires isolés restent disponibles. | `SinglePage.tsx`, `pages/home.tsx`, `home-layers.ts`. Métadonnées H1/title/description/canoniques/alternates/Person/FAQ conservées ; llms régénéré uniquement pour l'ordre des sections. |
| Épure | Jetons existants, filets1 px, espace, titres équilibrés, texte plafonné70 ch, cibles44 px, focus, surface de saisie et chiffres tabulaires. Pas de nouvelle palette/police/carte. | `single-page.css`, `system.css`, `DESIGN.md`. Contrôles marque et assertions historiques non assouplis. |

Les fichiers de provenance et les ressources visuelles canoniques sont inchangés.
Le prototype HTML et ses deux PNG sont copiés sans modification dans
`docs/accueil-epure/`. Ils ne sont pas servis comme pages publiques et aucun de
leurs scripts n'a été lancé. `plan.md` décrit les étapes et les bornes.
`AGENTS.md`, `TRUTH.md` et `AI_CONTEXT.md` indiquent la décision qui remplace
les anciens contrats. `package.json` inclut la nouvelle spec Playwright dans
le contrôle réseau habituel.

## Sources et écarts volontaires

- **97 % retiré** : le fichier FR `computer-use-what-it-can-undo.mdx`, daté du
  **8 septembre2026**, ne contient pas97 %. La date28 septembre de la maquette
  ne correspond pas non plus à l'article. Aucun autre chiffre ou article ne
  lui a été substitué, conformément au §3.
- **29 à54 %** : l'article `ai-cost-french-vs-english-tokens.mdx`, daté du
  **13 octobre2026**, mesure des tokens supplémentaires dans les versions FR
  de deux lois européennes, avec quatre tokenizers. La légende dit cette
  portée exacte, sans généraliser à tout texte ni à un abonnement.
- **1 355** : l'article `agents-that-fabricate-facts.mdx`, daté du
  **31 août2026**, décrit le nettoyage des lignes fausses de la base. La légende
  reprend le prototype sans attribuer leur création à un modèle.
- **« Save time. » proposé et implémenté** à la place de « Free up time. » :
  la première batterie complète a révélé que `free` enfreint les règles
  anti-slop déjà en vigueur (HTML compilé et llms). Les expressions régulières
  et leurs exceptions restent inchangées. Cette formulation, déjà employée
  pour le groupe du sélecteur, est soumise à la relecture des textes sur
  l'aperçu prévue par la spec ; elle n'est pas présentée comme un nouvel
  arbitrage validé par Paul.
- **Deux rangées de logos** : la somme des six largeurs intrinsèques est
  d'environ 1083 px, supérieure à la bande 1060 px avant même les cinq espaces
  de 40 px. La disposition actuelle permise par la spec est donc conservée.
- **Moteurs en carrousel sous 1100 px** : réemploi du composant natif du dépôt
  pour préserver « un bloc = un écran » sans réduire le texte ni masquer des
  lignes ; les trois colonnes restent dans le HTML et accessibles au clavier.
- **Polices** : General Sans est conservée partout sur l'accueil, y compris
  dates/mesures, puisque son mode accessible redéfinit `--mono` en `--ui`.
  La règle nouvelle réserve l'emploi de chasse fixe aux dates/mesures/code
  sans l'imposer. La police IBM du prototype n'est donc pas recopiée.
- **Connecteurs** : le prototype et la spec prescrivent trois temps avec
  deux connecteurs par ligne. Le contrat vendorisé VS-CONNECTOR mentionne
  `max_sequence_arrows:1`, de sévérité `C-SEQUENCE:REVIEW`. La géométrie
  canonique de chaque connecteur est conservée et le contrat n'est pas
  modifié. Ce point reste à examiner lors de la revue visuelle, sans prétendre
  avoir levé le conflit documentaire.
- Vue « Pour votre IA », barre fixe et durée du prototype non intégrées :
  elles sont hors lot ou explicitement interdites au hero. La navigation
  existante reste fonctionnelle, y compris les anciens liens applications
  et services qui rejoignent les moteurs.

## Tests ajoutés

`tests/accueil-epure.test.mjs` : **47 tests Node**, rendu réel hors réseau.
Couverture des 17 objectifs×2 langues,48 nœuds,9 lignes,2 mesures,4 assistants,
GET, données initiales complètes, défaut/entrées invalides, UTM multiples,
source prioritaire au retour, liens moteurs après une ancienne attribution,
traductions existantes et preuves datées des mesures.

`tests/accueil-epure.spec.ts` : **10 tests navigateur paramétrés**, sélection
des 17 objectifs à 390/1440 px et en FR/EN ; résultats/chemins/sources, largeur et
stabilité≤1 px, clavier/focus/cibles, GET sans JS, rechargement et SDK Cal réel
servi localement avec iframe simulée. Deny-all partagé ; POST local également
simulé pour empêcher tout appel indirect au webhook. Captures prévues 1440/390.
La collecte globale recense 622 tests dans 18 fichiers ; ce n'est pas une preuve
d'exécution.

## Assertions historiques remplacées

Les seuils de contraste (4,5), texte (16 px, résultat hero 18 px), cibles (44/48 px), grands boutons (64 px), géométrie (1 px), écran (hauteur exacte du viewport) et CLS (0,01) sont conservés. Aucun test anti-slop ni règle de texte n'est modifié. Les tests unitaires isolés OntologyHero restent présents, le composant étant conservé hors rendu.

| Fichiers | Avant | Après et motif |
| --- | --- | --- |
| single-page.test.mjs, parcours-accueil.test.mjs, brand-os-render.test.mjs; single-page.spec.ts, doctrine-visible.spec.ts | 13 sections, téléphones puis 12 services, bandeau et derniers articles | 12 sections: haut, références, moteurs, mesures, assistant, terrain, offres, parcours, technologies, équipe, questions, contact; même ordre FR/EN et contrôle du contact imbriqué compilé. |
| single-page.test.mjs | Deux géométries SVG, 33 nœuds, 4 histoires et légendes/cartes SSR | Un SVG statique de 48 nœuds, 3 actifs, chemin à 3 points; 17 options dans 3 groupes, 17 résultats SSR, titre accessible et live region; absence carte/sous-titre/réassurance. |
| single-page.test.mjs | 3 téléphones anonymes, 48 cas/12 services et 48 badges | 9 lignes des 3 moteurs, principe d'approbation unique; contenu conservé après révocation des permissions clients; badges répétitifs absents. Les 23 offres partenaires et règles de publication restent vérifiées. |
| single-page.test.mjs; single-page.spec.ts | 7 carrousels | 5 carrousels réellement présents: moteurs, terrain, offres, parcours et équipe. Clavier, Home/End, défilement et points restent testés. |
| action-unique.test.mjs, intentions.test.mjs, brand-os-render.test.mjs, passe-site-render.test.mjs | Hero rdv-hero, bandeau rdv-bandeau, contact rdv-contact; 5 liens compilés avec les 2 nav | Hero accueil-rendez-vous et contact rdv-contact; 4 liens compilés avec les 2 nav rdv-nav. UTM, destination, source unique, clic modifié, historique et connecteur restent testés; contrat unitaire des placements archivés AppointmentLink inchangé. |
| action-unique.test.mjs | Réassurance hero, étiquette d'approbation sur 24 tâches, note des téléphones | Absence réassurance/carte, 9 lignes moteurs et phrase d'approbation présente une seule fois; réponses FAQ ouvertes et concordance JSON-LD inchangées. |
| action-unique.test.mjs | Ancien lexique formation/train interdit dans toute la page hors articles | Même interdit hors moteurs remplacés: la ligne Équipes du prototype validé impose Formation/Training. Aucun changement anti-slop-copy. |
| home-visual-layers.test.mjs | Bandeau sépare équipe/FAQ, Journal dans articles, connecteur du bandeau | Équipe adjacente FAQ/contact et bandeau absent; Journal dans mesures; attribution/connecteur testés sur le hero restant. |
| home-visual-layers.test.mjs | Observer entrée de toutes sections sauf hero/contact | Exclusion explicite références/moteurs/mesures/assistant en plus, pour un mouvement d'auteur dans le haut de page. Même preuve d’entrée unique, reduced-motion et nettoyage. |
| parcours-accueil.test.mjs; action-unique.test.mjs, passe-site-render.test.mjs | 3 derniers articles triés, titre/date/thèmes/temps de lecture identiques aux cartes Journal | 2 mesures avec destinations finales FR/EN, dates reprises des articles, 97 % et article non probant absents. Tests Journal tri/temps de lecture/thèmes hors accueil inchangés. |
| langue-metier.test.mjs | Sous-titre descriptif, occurrence unique agent IA dans définition, badges 2 types | H1 inchangé, sous-titre/réassurance absents, 17 objectifs et 9 lignes, principe d'approbation; textes et métadonnées des sections conservées restent contrôlés. |
| llms-articles.test.mjs | 13 titres, un titre principal par section | 12 sections; les 3 titres moteurs sont concaténés sans inventer un titre englobant. Comparaison exacte au HTML réel maintenue; corpus/FAQ/sitemap inchangés. |
| single-page.spec.ts | Histoires automatiques cinq étapes et cleanup hors écran; légendes et cartes stables à 1 px | 17 objectifs sélectionnés, résultat unique, 3 nœuds actifs, positions et hauteurs résultat/schéma/action stables à 1 px, aucun mouvement en reduced-motion, chemin immobile après 20 secondes. Mêmes langues et six largeurs 1440/1280/1024/390/360/320. |
| single-page.spec.ts | Géométries compact/desktop, icônes/zones/libellés et fonds masquant leurs liens | 48 nœuds et 3 libellés actifs dans le hero et le schéma, mêmes bornes de confinement et aucun radius/ombre/monospace; fond plein des 3 libellés pour chacun des 17 choix. |
| single-page.spec.ts | Colonnes des services et leurs cycles; trois téléphones/messages complets et sans découpe avec/sans JS | Neuf lignes moteurs accessibles; clic sélectionne objectif/résultat; moteurs complets avec/sans JS aux mêmes six formats, min16 px, cibles44 px, aucune découpe et bloc≤écran. |
| single-page.spec.ts | 11 sections hors hero/contact et 14 figures mesurées | 10 sections hors hero/contact et 13 nouvelles/conservées figures mesurées. Hauteur/scrollHeight≤viewport et overflow non masqué inchangés; hero entier sous800 px à1440 et aucun débordement. |
| audit-readability.spec.ts | Phrase ontocap 18 px et source rdv-hero | Résultat actif goal-results 18 px et source accueil-rendez-vous; ratio ligne1,44, tailles, cibles et débordement identiques. |
| doctrine-visible.spec.ts | Attribution rdv nav/hero/bandeau/contact | Attribution rdv nav/contact ou accueil-identifiant; destination contact et typographie communes inchangées. |
| stabilite.spec.ts | Échantillonnage téléphones/services/ontocap et vérification de leur animation | Échantillonnage résultats/schéma/moteurs/mesures; les 17 objectifs sont effectivement choisis avant la même observation 25 s et le même défilement/pauses 25 s. Offres partenaires et calendrier réels simulés restent vérifiés. Hauteurs/doc≤1 px, CLS≤0,01, fontes lentes et premier affichage inchangés. |


## Assertions navigateur remplacées (sous-tâche, 13/11)

- `tests/intentions.spec.ts` : quatre emplacements `rdv-nav/hero/bandeau/contact` deviennent trois, `rdv-nav`, `accueil-rendez-vous`, `rdv-contact`. Même contrôle du clic sans navigation/rechargement, du focus contact, des UTM, des données du formulaire et de sa requête simulée ; bouton du bandeau retiré car bloc supprimé.
- Géométrie du schéma `.onto-diagram` → `.goal-diagram` ; limite du hero entier ≤800 px à 1440 conservée, largeur téléphone et alignement ≤1 px conservés.
- Réassurance retirée → résultat actif unique visible, aligné au bouton et séparé d'au moins 12 px. Espacement vertical minimum d'un viewport entre CTA bandeau/contact → entre CTA hero/contact ; bandeau explicitement absent.
- Note des données fictives des téléphones → phrase unique « L'assistant prépare. Vous validez. » du bloc moteurs. Interdiction historique des mots d'ancienne offre conservée sur sections existantes, les objectifs nouvellement autorisés étant exclus de cette ancienne règle. `anti-slop-copy.spec.ts` inchangé.
- Boucle/spotlight des six logos → six logos statiques et opaques avec et sans mouvement réduit, y compris survol/focus. Containment, taille positive et largeur ≤1060 px conservés.
- Respiration du seul fond hero → absence d'animation sur ce bouton. Dimensions, hauteur ≥64 px, padding 22×36, connecteur canon, hover/focus/appui, transition et arrêt mouvement réduit conservés pour hero ; taille contact conservée. Connecteurs du bandeau supprimé remplacés par deux connecteurs canoniques sur chacune des neuf lignes moteurs.

- `tests/home-visual-layers.spec.ts` : le précédent bloc du terrain est désormais assistant ; toutes preuves photos, ratio mosaïque, alignement, légendes et contrôles de carrousel terrain restent identiques.
- Alignement carrousel des derniers articles → alignement carrousel moteurs, même comparaison des sommets. Deux métiers inchangés (quantité, trois coches, absence d'action, alignements ≤1 px).
- Position et action bandeau → position moteurs après références/avant mesures, neuf lignes avec objectif et UTM, deux mesures et quatre assistants ; chacun des trois nouveaux blocs tient dans le viewport, sans seuil relevé.
- Contraste des anciens téléphones et bandeau → titres/texte/liens des moteurs, mesures, presse et assistants, seuil 4,5 inchangé. Rendu JS/sans JS, visibilité, absence de mouvement réduit et débordement inchangés.
- Trois derniers articles et titres complets → deux mesures et légendes complètes, dates visibles ; même hauteur maximale viewport, même seuil clipping ≤1 px, absence de line-clamp, lignes contenues.
- Comparaison accueil avec trois premières entrées du Journal → les deux mesures pointent aux articles imposés, ceux-ci existent sur l'index Journal atteint via le lien presse. Captures 390 ajoutées aux 1440/375.
- Interaction après animation terrain via bandeau → via hero attribué `accueil-rendez-vous`, mêmes contrôles préservation formulaire, focus et UTM. Entrée terrain et animation technologies conservées.

- `tests/parcours-accueil.spec.ts` : ordre des sections mis à jour, hero identifié `haut`, moteurs/mesures/assistant après logos ; sections préservées gardent leur ordre relatif. Navigation, deux métiers, six FAQ natives et égalité FAQPage inchangés.
- Derniers articles (titre, thèmes, lecture, date, lien) → deux mesures (valeur, légende, lien final et date exacts), trois moteurs/neuf lignes, quatre assistants avec `_blank`/`noopener`. La comparaison Journal porte désormais sur lien/date des deux mesures, pas sur les trois derniers articles supprimés.
- Anciennes ancres ce-qui-change/what-changes conservent destination/UTM, alias services ajouté ; premier titre moteur visible à destination.
- Après soumission legacy, liste des trois attributions actuelles contrôlée, anciennes données QuickCapture inchangées.


Une assertion supplémentaire de `brand-os-render.test.mjs` est précisée :
le titre du document reste unique et non vide, mais le comptage exclut les SVG.
Le nouveau schéma accessible contient son propre titre et 48 titres de nœuds ;
les compter comme des titres HTML produisait 50 contre 1. Le titre accessible
et les nœuds SVG sont contrôlés séparément ; aucun seuil n'est abaissé.

`tests/technologies.test.mjs` : le prédécesseur immédiat du bandeau technologies
était la grille services supprimée ; il est maintenant le parcours conservé.
Les dix technologies, leurs deux listes dont une masquée, leurs noms, logos,
empreintes et absence de partenariat implicite restent contrôlés à l'identique.

## Exécutions et limites

| Vérification | Référence | Finale A (run 3) | Finale B (run 4) |
| --- | --- | --- | --- |
| npm ci --silent | code 0 | code 0 | code 0 |
| npm run lint | code 0 | code 0 | code 0 |
| npm run qa:claims:rev01 | contrôle candidat vert | code 0 | code 0 |
| npm run build -- --webpack | code 0, 96 pages | code 0, 96 pages | code 0, 96 pages |
| npm run test:brand-os | contrat préexistant | 19/19, code 0 | 19/19, code 0 |
| npm test | 675/675 | 722/722, code 0 | 722/722, code 0 |
| npm run qa:brand:rev01 | contrôle candidat vert | code 0 | code 0 |

Les deux batteries finales ci-dessus sont **vertes consécutivement**, sans
skip, sous **Node 26.12.1 / npm 11.20.0**. Le dépôt demande Node 24 dans
`.nvmrc`. Un rejeu avec le Node 24.17.0 local a été tenté : le binaire échoue
avant npm ci, faute de `libsimdjson.33.dylib` (log `accueil-final-5-ci.log`).
Le téléchargement d'un exécutable temporaire via npm a ensuite rencontré
ENOTFOUND sur registry.npmjs.org et a été arrêté. Aucune réparation du Mac,
aucune modification de `.nvmrc`. Le rejeu sous Node 24 reste une limite
explicite de cette validation ; la CI utilise la version demandée par le dépôt.

Ordre identique aux portes demandées, installation exacte répétée à chaque
batterie. Logs : `/tmp/accueil-final-3-*.log` et
`/tmp/accueil-final-4-*.log`, résumés `summary.log` correspondants.
TypeScript sans émission et collecte Playwright passent également.

Les premières passes ont exposé des échecs, tous conservés dans les logs :
17/19 Brand OS avant remplacement de « Free up time. » ; 18/19 avant
séparation des titres HTML et SVG ; 720/722 avant mise à jour de l'adjacence
services/technologies. Aucun de ces contrôles n'a été ignoré. Les règles de
texte et les seuils de rendu n'ont pas été assouplis.

Revue indépendante finale : aucun défaut concret restant identifié après
relecture des correctifs. Deux défauts concrets d'attribution trouvés et corrigés
(source perdue au rechargement ; ancienne source prioritaire dans un lien
moteur). Les régressions ont chacune un test. Revue des adaptations des tests
faite séparément : seuils 1 px/0,01/4,5, tailles et durées conservés.

Playwright n'a pas été exécuté : le§6 réserve explicitement ce rejeu à Claude
sur l'hôte. Les 622 cas sont collectés, mais contraste réel, aération, géométrie,
CLS et comparaison des captures au prototype restent non vérifiés dans cette
session. Aucune tentative de déploiement ou preuve de production.

Les conseils tiers Impeccable ont été lus uniquement comme documentation ;
aucun script de ces dossiers lancé. Documentation Next16 consultée dans
node_modules et via Context7 (version disponible16.3.6 ; lock local16.3.4).

## Correctif 1, 13/11/2026 : reprise du rejeu hôte

Cette section décrit uniquement les changements de la présente reprise. Le
premier tour ci-dessus reste historique. La source qui fait foi est le fichier
absolu `/Users/paullarmaraud/parrit-site/docs/CODEX-SPEC-2026-11-13-accueil-epure.md`,
lu en entier, notamment ses onze points finaux. La copie antérieure du worktree
n'a pas été remplacée. SHA256 de la source :
`3a18950c203b1de88c77bd0a2153c47a15926e6b72763f7f7c8044bf3f15179d`.

### Sources, référence et périmètre

- Journal hôte lu avant modification :
  `/Users/paullarmaraud/codex-work/hote-acc-navigateur.log`, SHA256
  `74afeb7e74662d37bea2f74852c2aaa6e2d42be9e840fb980e3f9737c99b5609`.
  Résultat : 592 réussites, 30 échecs sur 622 cas ; 22 dans single-page,
  8 dans stabilite. Les cinq familles correspondent aux points 1 à 5.
- Captures examinées avant modification dans le dossier canon
  `/Users/paullarmaraud/parrit-site/docs/accueil-epure/` :
  `construit-tour1-ordinateur.png`, `construit-tour1-haut.png`,
  `prototype-2-ordinateur.png` (version actualisée). Aucun nouveau navigateur,
  aucune nouvelle capture ; les six PNG déjà modifiés à l'entrée sont conservés.
- Référence Node rejouée avant les éditions : **722/722**, code 0, log
  `/tmp/accueil-correctif1-baseline-node.log`. Environnement de cette reprise :
  Node 26.12.1, npm 11.20.0 ; `.nvmrc` demande toujours Node 24.
- Écriture : fichiers locaux de l'accueil, deux tests explicitement nommés,
  présent rapport. Aucun secret, article, actif vendorisé, déploiement ou commit.
  Sauvegarde du premier tour dans `/tmp/accueil-correctif1-baseline/` ; restauration
  possible fichier par fichier, sans effacer les travaux antérieurs. Aucune
  ligne métier ni écriture distante. Les empreintes initiales des tests et PNG
  permettent de distinguer les éditions de cette reprise du premier tour.
- Plan exécuté : diagnostic à partir du journal/code/captures, correctifs limités,
  revue adverse indépendante, vérification statique puis batterie autorisée.
  Arrêt sur contrat contradictoire non autorisé ; aucun seuil abaissé pour
  obtenir un résultat vert. Documentation React consultée via Context7 et guide
  local Next sur les composants serveur/client lu avant le code.

### Les onze points

| Point | Changement et justification | Preuve et limite |
| --- | --- | --- |
| 1. Mouvement réduit | `animation:none!important` et `transition:none!important` sur tout le schéma, ses descendants et pseudo-éléments. L'ancien correctif ne couvrait que le chemin ; le fallback universel imposait encore une durée de transition de 1 ms aux nœuds SVG. | `single-page.css`. L'exigence `getAnimations({subtree:true}).length === 0` est intacte. Les 11 échecs hôte restent à rejouer. |
| 2. Neuf lignes intemporelles | Le locator pluriel est compté (9), puis chaque ligne reçoit l'assertion d'absence de dates, avec la même expression régulière. Contrôle ajouté des mentions temporelles relatives et durées. | `single-page.spec.ts`. Plus d'assertion singulière sur neuf éléments. Aucun contrôle Journal/contact voisin retiré. |
| 3. Stabilité | L'échantillonneur retrouve les blocs présents dans le DOM à chaque frame. Il vérifie aussi que leur nombre et leurs clés logiques restent identiques. | `stabilite.spec.ts`, diagnostic détaillé ci-dessous. Calendrier, attribution et réserves de hauteur non modifiés ; seuils 1 px et CLS 0,01, durées et réseau conservés. |
| 4. Moteurs mobiles | Carrousel natif conservé ; piste `align-items:flex-start`, colonnes `align-self:flex-start`. | `single-page.css`. Choix autorisé par le point 4 pour conserver un bloc par écran. Test géométrique intact, aucun empilement de trois colonnes trop hautes. |
| 5. Bouton tablette | Dès 761 px, bouton du hero à largeur max-content, sans rétrécissement flex ni plafond de largeur. | CSS limitée au hero. Padding 22×36, taille 22 px, pleine largeur téléphone et test de largeur intrinsèque inchangés. |
| 6. Phrase du hero | Dès 861 px, label et select partagent une ligne. Un texte de dimensionnement masqué à l'accessibilité réserve la largeur du choix actif dès le SSR ; contrôle natif conservé, 26 px/600, filet rose 3 px. Sous 861 px, liste sous le label. | `HomeGoals.tsx` et CSS. Pour laisser leur largeur aux choix longs, hero en une colonne jusqu'à 1159 px, schéma plafonné à 520 px ; deux colonnes au-delà. H1, textes, GET, sources et UTM intacts. Largeurs calculées avec General Sans ; rendu natif à confirmer sur l'hôte. |
| 7. Légendes des plans | Alignement gauche à l'abscisse du bord des plans, au-dessus de chaque niveau. Fond canard opaque et plan de peinture explicite empêchent le tracé de traverser visuellement les lettres. | CSS `.goal-plane-title`, corps existant 16 px conservé. Comparaison navigateur encore nécessaire sur les 17 chemins. |
| 8. Fond des étiquettes actives | Le fond encre plein déjà présent est conservé et renforcé par un plan de peinture explicite au-dessus du SVG, avec padding 4×8 px. | CSS `.goal-node-label`. Le test existant d'opacité/fond reste inchangé. |
| 9. Trois moteurs | Titres à 26 px, une ligne à 1440 px ; enchaînements sans retour dès 1280 px, espaces de 4 px autour des connecteurs canoniques. Principe aligné à gauche à 22 px. | Métriques General Sans : titres FR environ 199–246 px ; enchaînement maximal environ 334,5 px avec deux connecteurs, pour 338,7 px disponibles. Ce calcul vérifie la place théorique, pas le rendu navigateur. |
| 10. Troisième mesure | Ajout central de « 16 sur 34 » / « 16 of 34 », daté du 10 octobre 2026, lien localisé vers `legacy-database-migration-writers-first`. Trois colonnes ordinateur. Sur téléphone, date et valeur sur une ligne puis légende ; espaces réduits pour conserver le bloc dans un écran, sans réduire les tailles. | Article FR et original EN lus intégralement. Légende FR : « éléments de l'écran commercial affichés uniquement avec l'ancienne base. » Aucun ajout de 97 %, aucune affirmation de perte de seize données. La hauteur réelle reste à vérifier sur l'hôte. |
| 11. Boutons assistants | Les quatre liens utilisent `btn rev-button ghost`, avec contour, focus et cibles ≥44 px ; padding horizontal adapté à la grille téléphone. | `HomeEvidence.tsx` et CSS. Questions, domaines, nouvel onglet et noopener inchangés. |

### Diagnostic précis du calendrier

`GoalBooking` utilise `key={goal.id}` sur `ParritCalInline` pour transmettre le
nouvel objectif à l'embed. Le changement de clé recrée son sous-arbre. Le test
capturait auparavant une seule fois les objets DOM dans `targets`, puis
mesurait ces mêmes objets pendant les 17 choix. L'ancien `.cal-embed-stage`
détaché renvoyait alors zéro. Les différences hôte, **570 px** et **1132 px**,
correspondent exactement aux minima CSS réservés (71,25×8 et 141,5×8).

Le journal montre que le scénario atteint sa dernière assertion de hauteur :
les contrôles précédents du chargement différé, de la requête calendrier unique
et de l'iframe ont donc passé. Ce n'est pas une preuve que la réserve CSS a été
perdue ou que le calendrier s'est chargé dans le hero. Le diagnostic est celui
d'une référence DOM périmée dans le test, cohérent avec la sémantique React des
clés. Le nouveau test conserve une observation continue de **tous** les blocs,
y compris le calendrier pendant les sélections, puis lors de son montage réel ;
il ne remet pas les minima/maxima à zéro entre les phases.

Assertion avant : hauteur des objets DOM capturés au démarrage, dont un nœud
détaché. Après : hauteur des mêmes blocs logiques actuellement connectés,
avec contrôle supplémentaire de présence/identité. Les seuils restent 1 px
pour chaque bloc et scrollHeight, et 0,01 pour les layout shifts hors interaction.
Les attentes 17 objectifs, trois familles de textes, plus de 100 échantillons,
les pauses de 25 secondes et les réponses Cal locales ne changent pas.

### Revue adverse et limites de preuve

Revue indépendante en lecture seule effectuée selon le Recursive Agent Harness.
Deux risques concrets ont été corrigés : compression des longs objectifs à
861 px (colonne unique intermédiaire), et écart texte/bouton Journal insuffisant
avec un gap de 8 px (maintenu à 16 px, minimum d'aération de 12 px intact).
Le sizer du select utilise les polices locales sans mesure JavaScript tardive.
Les caractères, dimensions et géométrie des connecteurs restent canoniques.

Aucun Chromium n'a été lancé. La collecte de **622 tests dans 18 fichiers**
passe ; ce résultat ne prouve pas leur exécution. La preuve attendue de Claude
sur l'hôte reste : rejouer les 622 cas, mesurer les 17 choix en FR/EN et mouvement
réduit, contrôler les trois mesures à 390×700, la phrase dès 861 px, les boutons
à 800 px, puis comparer les captures 1440/390 au prototype canon actualisé.
Aucune preuve de production ou déclaration de disponibilité au déploiement.

### Contrats contradictoires en attente d'autorisation

La consigne de cette reprise interdit de modifier un test non nommé par le
Correctif 1. Les fichiers ci-dessous restent donc identiques à l'entrée de ce
tour ; demandes de clarification adressées à Paul pendant le travail.

| Fichier | Avant (encore en vigueur dans le worktree) | Adaptation strictement proposée |
| --- | --- | --- |
| `tests/accueil-epure.test.mjs` | Deux mesures dans chaque HTML FR/EN ; chaque valeur doit être verbatim dans l'article. | Trois mesures. Pour ce seul ratio, vérifier « 16 sur 34 »/« 16 of 34 » contre le titre « 16 de ses 34 éléments » et le passage exact « L'ancienne affichait 34 éléments, la nouvelle 21, et 16 n'apparaissaient que sur l'ancienne. » ; dates et contrôles des deux autres chiffres inchangés. |
| `tests/home-visual-layers.spec.ts` | Deux mesures dans les contrôles de structure et de cartes mobiles. | Trois, sans changer aération, géométrie, contraste, textes complets ou le comptage des deux métiers. |
| `tests/parcours-accueil.spec.ts` | Deux liens/articles datés. | Trois, ajout central du slug autorisé et de la date 2026-10-10. |
| `tests/action-unique.test.mjs` | Trois liens de famille rev-button dans main. | Sept : deux rendez-vous, le Journal et quatre assistants ghost ; contrôles des deux rendez-vous inchangés. |

Patch concret préparé, **non appliqué** :
`/tmp/accueil-correctif1-tests-proposes.patch`. Aucun réordonnancement d'attributs
ou contournement des expressions régulières pour cacher les nouveaux boutons.

Premier candidat Node : **717/722**, cinq échecs exclusivement dans les contrats
ci-dessus (2 rendus FR/EN, 1 preuve verbatim, 2 comptages FR/EN). Log conservé :
`/tmp/accueil-correctif1-node-pre.log`. Les contrats Playwright qui comptent deux
mesures sont identifiés par lecture, sans tentative d'exécution.

**Deux batteries complètes vertes non acquises à ce stade.** Il faut lever le
conflit de périmètre de ces quatre tests avant de les adapter, puis exécuter deux
fois la séquence complète demandée. Les cinq échecs ne sont ni ignorés ni marqués
skip. Les contrôles préliminaires lint, affirmations, build Webpack (96 pages),
Brand OS (19/19), TypeScript et marque passent ; journaux
`/tmp/accueil-correctif1-*-pre.log` et `*-review.log`. Aucun commit.


## Correctif 2 — trois arbitrages appliqués (13/11/2026)

Source faisant foi : section finale du fichier absolu
`/Users/paullarmaraud/parrit-site/docs/CODEX-SPEC-2026-11-13-accueil-epure.md`,
lue pendant cette reprise. Elle remplace les propositions du tableau du correctif 1 :
aucun cas particulier par article et aucun passage à sept actions.

Périmètre d'écriture : ce worktree local uniquement, six fichiers de code/tests
ci-dessous et ce rapport ; aucun système distant, aucune ligne de données.
Modifications réversibles par retrait du delta de ce tour ; empreintes d'entrée
conservées dans `/tmp/accueil-correctif2-before.json`. Les modifications préexistantes
sont conservées. Aucun commit, push ou déploiement.

| Décision | Avant | Après et preuve |
| --- | --- | --- |
| 1. Trois mesures | Rendus Node et navigateur attendus à deux mesures ; listes de destinations limitées aux deux anciens articles. | Comptages à trois dans `accueil-epure.test.mjs`, `home-visual-layers.spec.ts` et `parcours-accueil.spec.ts`. Ajout central de `legacy-database-migration-writers-first` et de sa date `2026-10-10` dans le contrôle navigateur des destinations datées. Listes de liens complétées dans `home-visual-layers.spec.ts` et `parcours-accueil.test.mjs` (date lue dans l'article). |
| 2. Preuve générique | La valeur FR affichée devait apparaître verbatim dans l'article, incompatible avec « 16 sur 34 ». | `HOME_MEASURES` porte un `evidence` non vide par mesure, extrait exact de l'article FR ; l'extrait imposé pour 16/34 est repris intégralement. Un même contrôle pour les trois mesures exige l'extrait verbatim et chaque nombre affiché en FR/EN dans l'extrait. Les séparateurs de milliers (espaces et virgule anglaise) sont normalisés ; comparaison de nombres entiers extraits, pas de sous-chaînes. Aucun branchement par slug. Dates et exclusion de 97 % conservées. |
| 3. Assistants en liens texte | Quatre boutons ghost avec connecteurs, sept actions dans main. | Classes de boutons et connecteurs retirés uniquement des quatre liens assistants ; soulignement texte rétabli et style mobile propre aux boutons retiré. Destinations, questions, noopener, nouvel onglet, cibles de 44 px et focus conservés. `tests/action-unique.test.mjs` strictement identique à l'entrée (SHA256 vérifié), trois actions dans main. |

Aucun seuil de géométrie, contraste, stabilité ou aération modifié. Aucun autre
bloc produit modifié ; articles, navigation, contact et spécification locale conservés.

### Référence et contrôles

- `npm test` avant modification : code 1, **717/722**, cinq échecs reproduits
  (deux comptages de mesures, preuve verbatim et deux comptages d'actions).
  Journal : `/tmp/accueil-correctif2-baseline.log`.
- `node --test tests/accueil-epure.test.mjs tests/action-unique.test.mjs tests/parcours-accueil.test.mjs` :
  code 0, **77/77**. Journal : `/tmp/accueil-correctif2-targeted.log`.
- `npx tsc --noEmit` : code 0, journal `/tmp/accueil-correctif2-types.log`.

La batterie est exécutée deux fois dans l'ordre demandé au §6 bis, précédée
chaque fois de `npm ci --silent`. Build Webpack autorisé par la spec.
Environnement constaté : Node **26.12.1** ; `.nvmrc` demande Node 24 : ces
résultats ne constituent pas un rejeu sous Node 24.

La preuve navigateur (exécution, captures 1440/390, géométrie et CLS) reste à
rejouer par Claude sur l'hôte selon la spec. La collecte Playwright seule ne
constitue pas cette preuve. Aucune preuve de production revendiquée.

### Deux batteries consécutives vertes

| Commande | Tour 1 | Tour 2 |
| --- | --- | --- |
| `npm ci --silent` | code 0 (5.6 s) | code 0 (6.0 s) |
| `npm run lint` | code 0 (5.5 s) | code 0 (4.5 s) |
| `npm run qa:claims:rev01` | code 0 (0.8 s) | code 0 (0.5 s) |
| `npm run build -- --webpack` | code 0 (13.7 s) | code 0 (9.3 s) |
| `npm run test:brand-os` | code 0 (1.9 s) | code 0 (1.7 s) |
| `npm test` | code 0 (13.6 s) | code 0 (8.8 s) |
| `npm run qa:brand:rev01` | code 0 (0.3 s) | code 0 (0.2 s) |

À chaque tour : **722/722 tests Node**, aucun échec/skip ; **19/19 Brand OS**.
Logs de chaque commande : `/tmp/accueil-correctif2-run{1,2}-*.log` ; résultats
structurés : `/tmp/accueil-correctif2-results.json`.

Contrôles additionnels : `git diff --check` code 0 ;
`npm run qa:network:rev01 -- --list` code 0 : Total: 622 tests in 18 files.
Une tentative préalable `npx playwright test --list` sans la sélection du dépôt
avait échoué (code 1) en collectant aussi des tests Node pendant la réinstallation
des dépendances. Elle est conservée dans `/tmp/accueil-correctif2-playwright-list.log` ;
le rejeu correct, après les installations, est dans
`/tmp/accueil-correctif2-playwright-collection.log`. Aucun navigateur lancé.

Relecture finale du delta : six fichiers de code/tests concernés, plus ce rapport ;
contrôle SHA256 confirmant que `action-unique.test.mjs` et tous les autres fichiers
préexistants sont inchangés depuis l'entrée de ce tour. Les deux batteries demandées
sont vertes ; les limites Node 24 et navigateur décrites ci-dessus restent explicites.

## Correctif 3 — calendrier, identité DOM et liste du hero (13/11/2026)

Source : dernière section « Correctif 3 » de la spécification locale, accord de
Paul « go », puis consigne de ce tour : lint et tests Node uniquement, sans
Chromium, Playwright ni build. Borne : ce tour et un correctif au maximum.
Périmètre : worktree local, deux fichiers produit, les deux tests navigateur
nommés ci-dessous et ce rapport ; aucune donnée ni écriture distante. Delta
réversible par retrait des changements de ce tour. Modifications préexistantes
(spec, captures) conservées ; aucun commit ni push.

### Changements

- **A — `HomeGoals.tsx`** : suppression de `key={goal.id}` sur `ParritCalInline`
  et du commentaire devenu faux. Aucun état, observateur ou mécanisme ajouté ;
  `CalInline.tsx` reste inchangé.
- **B — `tests/stabilite.spec.ts`** : clé logique fondée sur `id` ou la première
  classe, avec l'index existant. À chaque échantillon, comparaison des éléments
  courants aux références DOM initiales ; tout remplacement ou changement de
  nombre rend `nodesStable` faux définitivement. Assertion distincte à la fin.
  Hauteurs à 1 px, scrollHeight à 1 px, CLS ≤ 0,01, durée d'observation et
  chargement unique du calendrier inchangés.
- **C — `single-page.css`** : police explicitement héritée par le gabarit ;
  flèche native remplacée par un chevron CSS positionné dans la réserve droite
  existante, sans retour à la ligne et sans interception des clics. Gabarit et
  select partagent toujours police, graisse et rembourrage. Aucune couleur,
  aucun texte ni ordre de bloc modifié.
- **`tests/accueil-epure.spec.ts`** : mesure du texte de chaque option avec la
  police calculée du select, après chargement des fontes, comparée à sa largeur
  hors bordures et rembourrage (réserve du chevron comprise). Les 17 objectifs
  sont contrôlés en FR/EN à 1440 et 390 px ; contrôles de débordement conservés.
  Le scénario calendrier change l'objectif avant le chargement différé, puis
  après : paramètres du premier chargement, identité du stage et de l'iframe,
  une seule requête, attribution actualisée du bouton et rechargement de page
  sont contrôlés. Aucun test hors du périmètre D n'a été modifié.

### Limite acceptée du calendrier

Les paramètres suivent l'objectif jusqu'au chargement différé du calendrier.
Après ce chargement, ils restent ceux de ce moment : **un objectif changé après
le chargement n'atteint pas la réservation**. Le bouton du hero continue de
porter `source=accueil-<objectif>` à chaque clic. Cette limite est explicitement
acceptée par la spec ; aucun rechargement forcé n'est ajouté pour la contourner.

### Validation et reprise sur l'hôte

- Référence `npm test` : **722/722**, code 0, aucun échec ni test ignoré.
- Candidat `npm run lint` : **code 0**.
- Candidat `npm test` : **722/722**, code 0, aucun échec ni test ignoré.
- `git diff --check` : **code 0**.
- Journaux : `/tmp/accueil-correctif3-baseline.log`,
  `/tmp/accueil-correctif3-lint.log`, `/tmp/accueil-correctif3-test.log`.

**Non exécutés, conformément à la consigne :** build (Turbopack ou Webpack),
Playwright, Chromium, captures et mesures navigateur. La capture fournie
`docs/accueil-epure/construit-tour2-fold.png` a été examinée, sans la modifier.
La lisibilité réelle à 1440, 1280, 800, 390 et 320 px, l'identité DOM, l'absence
de rechargement de l'iframe et le CLS restent à vérifier sur l'hôte.

Le contrôle négatif demandé par B — remettre temporairement `key={goal.id}`,
constater l'échec de `nodesStable` dans le test de stabilité, puis retirer la
clé et rejouer — **n'a pas été exécuté**, puisqu'il nécessite le navigateur
interdit dans ce tour. Il reste à faire une fois sur l'hôte ; aucune preuve
négative ni preuve navigateur/production n'est revendiquée ici. La clé est
absente de l'état livré.
