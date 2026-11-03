# parrit.ai : un français que les métiers comprennent, et un site qu'on trouve

Niveau de risque : moyen

Statut : validée par Paul le 03/11/2026 (« Go sur la spec »).

## Demande de Paul (02/11/2026)

Rendre le site plus compréhensible pour les métiers, dans un français courant, en quittant le « langage Palantir ». Le référencement fait partie du chantier.

## Règle de construction

- On modifie l'existant : mêmes sections, même charte, mêmes animations, aucune nouvelle page, aucun nouveau composant, aucune nouvelle dépendance.
- Aucun prix, aucune offre détaillée, aucune promesse de gain chiffrée (TRUTH.md §1 et §6).
- Aucun fait nouveau : chaque phrase réécrite dit ce que disait l'ancienne, en plus simple.
- Le lecteur de référence est un responsable de service d'une PME ou d'une ETI (finance, administration des ventes, qualité, production). Il doit comprendre chaque phrase sans connaître l'informatique.

## Constats (02/11/2026, site en ligne)

| Fait | Source |
|---|---|
| Le schéma du haut de page affiche « ONTOLOGIE, votre entreprise en objets reliés », « SOURCES DE LOGIQUE », « SYSTÈMES D'ACTION » | `src/system/ontology-hero-data.ts`, page `/fr` |
| Le premier titre ne dit pas ce que fait l'entreprise et ne contient aucun mot recherché | H1 de `/fr` |
| Le bandeau affiche 41 noms techniques, dont FastAPI, MCP, Qwen, GLM, juste après le haut de page | `src/system/technologies.ts`, page `/fr` |
| Les étiquettes des 48 cas sont « Back-office » et « Nouveau » | `src/system/single-page-copy.ts` |
| 7 adresses françaises sur 45 dans le plan du site | `https://parrit.ai/sitemap.xml` |
| `/fr/journal` a un titre français et des articles en anglais ; une adresse d'article en `/fr` renvoie vers l'anglais, y compris pour `agent-ia-entreprise` | contrôle HTTP du 02/11 |
| La description de l'entreprise dans les données structurées de `/fr` est en anglais, `sameAs` est vide, `jobTitle` vaut « Founder » | source HTML de `/fr` |
| `llms.txt` est en anglais et décrit des sections retirées (« how data travels through our systems ») | `https://parrit.ai/llms.txt` |
| Le pied de page compte 3 liens, accueil et articles | source HTML |
| La page d'accueil est servie en `no-store` | en-têtes HTTP |
| PostHog est absent de `/fr`, le suivi des citations par les IA est désactivé, `site_aeo_citations` n'existe pas dans la SuperApp | HTML, `gh workflow list`, requête SuperApp |

Inconnu : le trafic réel et les positions Google. Aucun accès à Search Console depuis les outils. Une recherche web sur « Parrit.ai agents IA entreprise Lille » n'a remonté aucune page de Parrit.ai ; l'outil est américain, ce n'est donc pas une mesure de position Google.

## Lot 1 : la langue

Sources à modifier : `src/system/single-page-copy.ts`, `src/system/ontology-hero-data.ts`, `src/system/components/SinglePage.tsx`, `src/system/components/TechnologyBand.tsx`, `src/app/opengraph-image.tsx`, `TRUTH.md` et `AGENTS.md`.

Ce lot remplace, pour ces points seulement, des décisions de Paul du 27/10 écrites dans `TRUTH.md`, `AGENTS.md` et `docs/site-v1/page-unique/` : titre « expertise », bouton « Parlons de votre transformation », schéma « ontologie », phrase de Clive Humby, bandeau complet placé après le hero, pied de page réduit au Journal. Mettre ces passages à jour avec la mention « décision de Paul du 02/11/2026 ». Tout le reste de ces décisions tient.

Le français ci-dessous est le texte exact. L'anglais suit le même sens, en anglais courant, et remplace les chaînes correspondantes.

### Haut de page

| Avant | Après |
|---|---|
| Votre expertise est la matière première. Nous la mettons au travail. | Nous formons vos équipes à l'IA et construisons les outils qui leur manquent. |
| Vos règles, vos données et vos décisions deviennent des systèmes qui en multiplient l'impact. | Réponses aux clients, relances, devis, comptes rendus : l'IA prépare, vos équipes relisent et décident. |
| Parlons de votre transformation | Parler d'un projet |

### Schéma animé

| Avant | Après |
|---|---|
| ANALYSES · SOLUTIONS, ce que vous obtenez | CE QUE VOUS OBTENEZ, des réponses et des alertes prêtes à valider |
| ONTOLOGIE, votre entreprise en objets reliés | VOTRE ENTREPRISE, clients, commandes et factures reliés entre eux |
| SOURCES, ce que vous avez déjà | CE QUE VOUS AVEZ DÉJÀ, vos documents, vos règles, vos logiciels |
| AUTOMATISATIONS ET AGENTS | TÂCHES AUTOMATISÉES |
| SOURCES DE DONNÉES | VOS DOCUMENTS |
| SOURCES DE LOGIQUE | VOS RÈGLES |
| SYSTÈMES D'ACTION | VOS LOGICIELS |
| Le système le relie à sa commande. | L'outil retrouve sa commande. |
| Le système la relie au client. | L'outil retrouve le client. |
| Le système le relie au fournisseur. | L'outil retrouve le fournisseur. |
| Un agent applique vos conditions. | Il applique vos conditions. |
| Un agent applique vos échéances. | Il applique vos échéances. |
| Un agent le compare à vos procédures. | Il le compare à vos procédures. |
| Un agent applique vos procédures qualité. | Il applique vos procédures qualité. |

Les quatre étapes accessibles aux lecteurs d'écran suivent les mêmes mots.

### Phrase sous le schéma

| Avant | Après |
|---|---|
| « La donnée est le nouveau pétrole », disait Clive Humby en 2006. Brute, elle ne sert à rien : nous la raffinons. | Vos e-mails, vos contrats et vos factures contiennent déjà les réponses. Nous les rendons utilisables. |

### Bandeau des technologies

| Avant | Après |
|---|---|
| Agnostiques par nature : pour chaque besoin, la meilleure technologie. | Pour chaque besoin, nous choisissons la meilleure technologie. |

Le bandeau passe juste avant la section « Chaque projet a son équipe et sa technologie » et ne garde que les noms que connaît un non-spécialiste, dans cet ordre : ChatGPT, Claude, Gemini, Mistral, Copilot, Google, Microsoft, WhatsApp, Telegram, OVH. Les autres noms restent dans `src/system/technologies.ts`, sans affichage. Aucun partenariat sous-entendu.

### Le mot « agent »

Dans le texte visible, « agent » devient « assistant », sauf dans la phrase suivante, placée sous le titre « Ce que l'IA change dans votre entreprise. », qui garde le mot que les gens recherchent :

« Un assistant, ou agent IA, fait une tâche selon vos règles et vous la soumet avant qu'elle parte. »

Exemples :

| Avant | Après |
|---|---|
| Agent du cabinet, Agent de prospection, Agent commercial | Assistant du cabinet, Assistant de prospection, Assistant commercial |
| Un grossiste de Rungis pilote son activité en parlant à ses agents. | Un grossiste de Rungis pilote son activité en parlant à son assistant. |
| Former les équipes, puis créer avec elles un premier agent. | Former les équipes, puis créer avec elles un premier assistant. |

### Étiquettes des 48 cas

| Avant | Après |
|---|---|
| Back-office | Tâche reprise |
| Nouveau | Nouvelle capacité |

### Équipe et fondateur

| Avant | Après |
|---|---|
| Plus de dix, chacun sa spécialité : vision, agents, intégration. | Plus de dix, chacun sa spécialité : lecture de documents, assistants, connexion à vos logiciels. |
| Le harness engineering | Les règles et les contrôles autour des assistants |
| L'intégration à vos logiciels | La connexion à vos logiciels |
| La formation à Claude Code | La formation de vos développeurs à Claude Code |
| Les déploiements exigeants | Les projets les plus exigeants |
| La revue d'architecture | La relecture technique |
| L'évaluation des modèles | Le choix du bon modèle d'IA |
| Déjà équipés ? Nous vérifions vos agents et leurs règles, installons l'IA sur vos serveurs et auditons votre usage de Claude Code. | Déjà équipés ? Nous vérifions vos outils et leurs règles, installons l'IA sur vos serveurs et contrôlons l'usage qu'en font vos équipes. |
| Il conçoit des systèmes où plusieurs agents travaillent ensemble, et les garde-fous qui les encadrent. | Il conçoit des outils d'IA et les contrôles qui les encadrent. |

Tout autre texte reste identique.

## Lot 2 : le référencement, dans la même PR

Sources : `src/app/(rev01)/page.tsx`, le composant des données structurées, `scripts/generate-llms.mjs` (il génère `public/llms.txt`, jamais d'édition à la main), `src/system/site-v1-pages.ts`, `src/app/sitemap.ts`.

1. Titre de `/fr` : « Parrit.ai · Formation à l'IA et outils sur mesure pour les entreprises, Lille ».
2. Description de `/fr` : « Nous formons vos équipes à l'IA et construisons des outils sur mesure : réponses aux clients, relances, devis, comptes rendus. Lille, Hauts-de-France et toute la France. »
3. Données structurées de `/fr` : description de l'entreprise en français, `jobTitle` « Fondateur », `sameAs` rempli avec la page LinkedIn de Parrit.ai si Paul la confirme.
4. `llms.txt` : décrire les sections actuelles, en français et en anglais.
5. Les quatre thèmes gardent leur adresse actuelle ; leurs titres et leur premier paragraphe français passent à la langue du lot 1 :

| Thème | Titre français actuel | Titre français proposé |
|---|---|---|
| `harness-engineering` | Harness Engineering : Le modèle ne suffit pas. Il faut un système fiable autour. | Encadrer vos assistants IA : règles, droits et contrôles |
| `ai-sprints` | AI Sprints : Un problème précis, un système testable, une décision fondée sur des preuves. | Un premier résultat en cycle court, avec des critères écrits à l'avance |
| `integration-developpement` | Engineering & Intégration : Concevoir, connecter, construire. | Relier vos logiciels et construire ce qui manque |
| `conseil-transformation` | Conseil & Transformation : Comprendre, décider, transformer. | Choisir vos priorités et préparer vos équipes |

6. Pied de page : ajouter les liens existants vers les quatre thèmes, le Journal et les mentions légales, sur toutes les pages. Aucune nouvelle page.

## Hors de cette PR

- Traduction de six articles en français : relecture de Paul, article par article, lot séparé.
- Pages par métier : décision après trois mois de mesure.
- Mesure : Search Console et suivi des citations par les IA, voir les décisions ci-dessous.
- `no-store` de la page d'accueil : à traiter après cette PR, car le changement touche le choix de langue.

## Banc d'essai

1. Aucun des mots suivants dans le texte visible de `/fr` : ontologie, objets reliés, sources de logique, systèmes d'action, agnostiques, harness, back-office, raffinons, matière première.
2. Le mot « agent » n'apparaît qu'une fois dans le texte visible de `/fr`, dans la phrase de définition.
3. Le H1, le titre et la description de `/fr` contiennent « IA » ; le titre et la description contiennent « Lille ».
4. Le texte de la version anglaise ne contient plus aucun de ces équivalents : ontology, linked objects, logic sources, systems of action, technology-agnostic, harness engineering.
5. Le haut de page, barre comprise, tient à 1440×800 ; chaque bloc tient dans l'écran à 1280×720 et 390×700, sans texte coupé, en français et en anglais.
6. Le bandeau affiche exactement les dix noms, à l'emplacement prévu ; en mouvement réduit, aucune animation.
7. La phrase de définition, les 48 cas et les 23 offres restent dans le HTML serveur.
8. Aucun tiret cadratin, aucun prix, aucun nom de client hors des références, aucune tournure du type « X, pas Y ».
9. Les données structurées de `/fr` sont valides et en français.
10. `llms.txt` ne cite plus aucune section retirée.
11. Le pied de page contient les six liens, sur `/fr`, sur `/fr/journal` et sur un article.
12. L'image de partage reprend le nouveau titre.

Les tests qui figent les anciens libellés (`tests/single-page.test.mjs`, `tests/og-canard.test.mjs`, `tests/technologies.test.mjs`) passent au contrôle de fond (TRUTH.md §6.9), sans copier le nouveau texte.

## Pont

`parrit-site` n'a pas de pont : lancer `~/parrit-super-app/scripts/codex-handoff.sh` depuis un dossier frais sur `origin/main`, avec `CODEX_MODEL=gpt-6-astra` et `CODEX_BATTERIE_CMD="npm ci --silent && npm run lint && npm run build -- --webpack && npm test"`.

Après fusion : contrôle en navigateur de `/` et `/fr`, ordinateur et téléphone, plus lecture du texte par Paul.

## Bornes

Deux contrôles : relecture de la PR, relecture du texte en ligne. Une correction au plus par contrôle. Au-delà, retour à Paul.
