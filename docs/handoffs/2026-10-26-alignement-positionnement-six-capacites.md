# Handoff 2026-10-26 — alignement sur le positionnement canonique, six capacités

Auteur : Claude (superviseur) · Writer : Codex · Décision : Paul, mission « Brand, Website, LinkedIn & Video Alignment » du 26/10/2026.
Positionnement de référence : `parrit-canon/positioning/POSITIONNEMENT-CANONIQUE-2026-10-26.md` (copié ci-dessous, il fait foi).

> Parrit.ai conçoit, construit et met en production des systèmes intelligents qui transforment les opérations des entreprises.
> EN : Parrit.ai designs, builds and runs intelligent systems that change how companies operate.

**Ne pas déployer.** La PR attend la validation explicite de Paul (le site se déploie seul au merge sur main).

## 1. Constat (origin/main 2b97c85)
- H1 « Nous transformons des problèmes opérationnels en systèmes qui fonctionnent » = promesse D-028 : **on la garde**.
- Kicker « Parrit / Logiciels et IA » et sous-titre « construit des logiciels métier et accompagne… » : cadrage outil, à remplacer par la définition.
- Les six capacités sont absentes du site.
- `/build-with-you` n'est lié depuis aucune page (orphelin, joignable seulement par URL et par la 301 de paul-larmaraud.com).
- `public/llms.txt` (généré par `scripts/generate-llms.mjs`) et la description JSON-LD disent encore « An independent French maison ».

## 2. À faire (copie exacte, FR et EN en parité)

### 2.1 Accueil, `src/app/(rev01)/page.tsx`, `DICT.*.hero`
- `kicker` FR : `Parrit / Systèmes intelligents pour les opérations` · EN : `Parrit / Intelligent systems for operations`
- `sub` FR : `Parrit.ai conçoit, construit et met en production des systèmes intelligents qui transforment les opérations des entreprises. La facture qui traîne, le rapport refait à la main chaque semaine : nous partons de la façon dont votre équipe travaille aujourd'hui, puis nous construisons des outils qui vous appartiennent.`
- `sub` EN : `Parrit.ai designs, builds and runs intelligent systems that change how companies operate. The invoice that drags, the report rebuilt by hand every week: we start from how your team works today, then build tools you own.`
- `before`, `frame`, `after` (H1) : **inchangés**.

### 2.2 Nouvelle section `capacites`, insérée entre `parcours` et `journey`
Réutiliser les composants existants (`K`, la grille et les styles déjà employés par `parcours` ou `journey`) ; aucun nouveau composant si un existant suffit. Aucun bouton, aucun lien, aucun prix par carte : ce n'est pas un catalogue.

FR
- kicker : `Ce que nous savons faire`
- title : `Six capacités, que nous combinons selon le problème à résoudre.`
- items (titre · texte) :
  1. `Transformation IA` · `Choisir les cas d'usage à partir de vos opérations, les chiffrer et les ordonner.`
  2. `Agents autonomes` · `Des agents qui agissent dans des limites écrites. Ce qui engage l'entreprise passe par une validation humaine.`
  3. `Logiciels sur mesure et systèmes internes` · `Des outils construits autour du processus réel, dans vos comptes.`
  4. `IA privée et souveraine` · `Des modèles et des données hébergés là où vous le décidez.`
  5. `Infrastructure go-to-market` · `La donnée commerciale, sa qualité et les relances, sous supervision humaine.`
  6. `Usines de contenu` · `Produire, vérifier et publier, avec des contrôles avant chaque diffusion.`
- note : `Avant d'automatiser, nous observons le travail tel qu'il se fait. Nous distinguons ce qui améliore l'existant de ce qui devient possible pour la première fois.`

EN
- kicker : `What we can do`
- title : `Six capabilities, combined according to the problem at hand.`
- items :
  1. `AI Transformation` · `Choosing use cases from your operations, then costing and sequencing them.`
  2. `Autonomous Agents` · `Agents that act within written limits. Whatever commits the company goes through human approval.`
  3. `Custom Software & Internal Systems` · `Tools built around the real process, inside your own accounts.`
  4. `Private & Sovereign AI` · `Models and data hosted where you decide.`
  5. `AI Go-to-Market Infrastructure` · `Commercial data, its quality and follow-ups, under human supervision.`
  6. `Content Factories` · `Producing, checking and publishing, with controls before every release.`
- note : `Before automating, we study the work as it is done today. We keep apart what improves the existing process and what becomes possible for the first time.`

### 2.3 Relier l'offre Build With You (sans la mettre en avant comme catalogue)
- Dans `journey`, sous le lien existant « Réserver l'examen », un lien secondaire (style lien, pas bouton) : FR `Construire un premier système avec nous` → `/fr/build-with-you` ; EN `Build a first system with us` → `/build-with-you` (utiliser `localizedPath`).
- Dans `RevFooter.tsx`, ajouter le même lien à la liste existante.
- Le contenu de `/build-with-you` est **inchangé**.

### 2.4 Métadonnées et lisibilité machine
- `metadata` de l'accueil : title FR `Parrit.ai · Systèmes intelligents pour les opérations` · EN `Parrit.ai · Intelligent systems for real operations` ; description = la définition (FR/EN).
- `scripts/generate-llms.mjs` et la description JSON-LD de l'organisation : remplacer « An independent French maison… » par la définition EN ; régénérer `public/llms.txt`.

### 2.5 Sources de vérité du dépôt (même geste, pas de contradiction)
- `TRUTH.md` : remplacer la définition de Parrit par la définition canonique ci-dessus, ajouter les six capacités et les huit principes du positionnement canonique ; conserver les deux parcours PME/ETI et grands groupes, FormIA, l'ICP et les règles dures existantes.
- `AGENTS.md`, puce « Positionnement (25/10/2026) » : la remplacer par « Positionnement (26/10/2026) : définition canonique `parrit-canon/positioning/POSITIONNEMENT-CANONIQUE-2026-10-26.md`, six capacités (pas un catalogue) ; deux parcours PME/ETI et grands groupes conservés ».

## 3. Interdits
- Ne pas toucher : la liste des clients (`brands`, `public-clients.ts`), `proof`, `build` (scène de la carte de visite), `journal`, `/commission`, le H1, le header (`RevHeader.tsx`), tout prix ou condition.
- Aucun tiret cadratin ou demi-cadratin dans la copie ajoutée.
- Ne pas affaiblir un test existant ; les tests vérifient la structure et les règles de fond, pas les libellés (règle du 25/10).
- Aucun déploiement, aucun appel réseau.

## 4. Tests à ajouter (`tests/*.test.mjs`, `node --test`)
- La section `capacites` existe en FR et en EN avec exactement 6 items, mêmes clés dans les deux langues.
- Aucun item ne contient de prix, de montant, de durée chiffrée ni de lien.
- L'accueil (FR et EN) contient un lien vers `build-with-you` ; le footer aussi.
- `public/llms.txt` ne contient plus « maison ».

## 5. Contrôles (fixés avant lancement)
1. Batterie : `npm ci --silent && npm run lint && npm test && npm run build`.
2. Revue Claude du diff (périmètre, aucun libellé hors spec, parité FR/EN) + captures 375 px et 1440 px de l'accueil FR et EN.
3. Validation de Paul avant merge (le merge déploie).

## 6. Bornes
MAX_ITERATIONS 2 runs Codex. Si un test existant casse pour une raison étrangère à ce lot : s'arrêter et le signaler.
