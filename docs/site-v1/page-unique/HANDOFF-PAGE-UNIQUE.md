# Handoff Codex : parrit.ai devient une page unique (27/10/2026)

## Décisions de Paul (27/10/2026, nuit)

1. « Je préfère qu'on ait une landing page hyper simple sur une page […] On dirait que c'est des débutants qui travaillent. »
2. La page reprend son **deck de référence V3.2** (`~/Desktop/Parrit.ai/presentation-generale/2026-10-deck-de-reference/`), recalé sur la vision de Parrit.ai (mise en production).
3. **Nom et photo de Paul** sur la page (lève la règle du 12/10 « aucune mention du fondateur hors /legal »).
4. « Parrit.ai n'est pas une boîte de CRM » : aucun CRM en vedette.
5. Maquette **validée par Paul** (« Ok go ») : `docs/site-v1/page-unique/MAQUETTE-VALIDEE.html` et ses rendus `maquette-1440.png`, `maquette-390.png`. **La reproduire fidèlement** : ordre des sections, textes français mot pour mot, mise en page, rythme, couleurs (jetons Brand OS uniquement : la maquette n'utilise que des `var(--brand-*)`). Ne rien réinterpréter.

## 1. L'accueil devient la page unique

`src/app/(rev01)/page.tsx` (FR sur `/fr`, EN sur `/`) rend les 8 sections de la maquette, dans cet ordre, avec ces ancres :

| # | Section | Ancre | Régime |
|---|---|---|---|
| 1 | Haut de page (titre, phrase, bouton, escalier) | (aucune) | canard |
| 2 | Ce que l'IA change dans votre entreprise | `#ce-qui-change` / `#what-changes` | clair |
| 3 | Le parcours (Apprendre, Améliorer, Construire) | `#parcours` / `#path` | canard |
| 4 | Ce que l'IA prépare dans chaque service | `#services` | clair |
| 5 | Garde-fous et hébergement | `#confiance` / `#safeguards` | aplat `--brand-accessible-sky` |
| 6 | Références | `#references` | clair |
| 7 | Par où commencer | `#commencer` / `#start` | clair |
| 8 | Fondateur et contact | `#contact` | encre |

- Barre du haut : `PARRIT.AI`, cinq liens d'ancre (FR : « Ce que l'IA change », « Le parcours », « Garde-fous », « Références », « Contact » ; EN : « What AI changes », « The path », « Safeguards », « References », « Contact »), sélecteur de langue existant, bouton « Parler d'un projet » / « Talk about a project » vers `#contact`. Plus de menu déroulant, plus d'entrées Conseil, AI Sprints, Engineering, Plus, Journal. Mobile : wordmark, langues et bouton sur une rangée ; les ancres dans un menu simple.
- Section 8 : photo issue du registre de marque (`person.paul.primary_portrait`, `parrit-canon/brand/assets/photos/paul-centre.png`, empreinte du registre à vérifier ; copier dans `public/` avec son empreinte dans un contrat d'assets, ne jamais retoucher l'image), texte de la maquette, bouton « Parler d'un projet » qui fait défiler vers la **réservation intégrée juste dessous, dans la même section** (composants existants `CalInline` puis `QuickCapture` en repli « Pas de créneau ? Laissez votre e-mail »), et l'adresse e-mail.
- Pied de page : « © 2026 Parrit.ai », liens « Journal », « Mentions légales », bascule de langue. Aucun autre lien.
- La bande de grain (`Matiere`) n'est pas dans la maquette validée : la retirer de la page (garder le composant et ses tests si d'autres pages l'utilisent ; sinon supprimer composant, tuiles, générateur et tests du grain, et l'appel au prebuild).
- Statuts des preuves : petite ligne en casse normale (« Exemple illustratif », « Chez un client »), carré de 8 px (`--brand-accessible-line` ou `--brand-core-canard`), jamais en capitales ni en police machine.

## 2. Version anglaise (écrite en anglais, texte exact)

| Emplacement | Anglais |
|---|---|
| H1 | « From first steps with AI **to software built around your business.** » |
| Phrase | « Parrit.ai trains your teams, builds with them and puts software made for your company into production. » |
| Bouton | « Let's talk about your transformation » |
| §2 titre | « What AI changes **in your company.** » |
| §2 carte 1 | bulle « List each decision and who owns it. » ; réponse « Here are the three decisions and their owners. » ; titre « Your teams know how to use AI. » ; texte « A clear request gets a useful answer. » ; statut « Illustrative example » |
| §2 carte 2 | document « Meeting notes », pastille « Ready to review » ; titre « A tool prepares your repetitive tasks. » ; texte « The tool drafts the meeting notes, you review them. » ; statut « Illustrative example » |
| §2 carte 3 | « Your software », « Your information », « Your rules », « Agent » ; titre « The way you work becomes software. » ; texte « Everyone sees the same information, up to date. » ; statut « At a client » |
| §3 titre | « Three steps. **Start wherever you are.** » |
| §3 étapes | « Step 1 » Learn : « Train your teams, then build a first agent with us. » ; « Step 2 » Improve : « Choose your priorities, then put quick, useful solutions in place. » ; « Step 3 » Build : « Connected tools, then software of your own, in production. » |
| §3 ligne | « Already equipped? We check your agents and their rules, install AI on your servers and audit your use of Claude Code. » |
| §4 titre | « What AI prepares **in every department.** » |
| §4 cartes | Leadership « It summarizes the decisions from each meeting. » ; Finance « It flags gaps between two files. » ; Sales « It spots the companies to contact. » ; Human resources « It checks that a file is complete. » ; Marketing « It adapts one text to each channel. » ; Legal « It drafts a contract for review. » ; statut « Illustrative examples » |
| §5 titre | « Your agents act **within limits you set.** » |
| §5 carte 1 | « Which clients should I follow up this week? » / « Allowed » « It gets the list of its clients. » ; « Show me the salaries. » / « Refused » « It has no right to read payroll. » ; titre « Each agent sees only what it is allowed to see. » |
| §5 carte 2 | « The agent wants to send a quote to client A. » ; « Every send needs a person's approval. » ; « A person approves: the quote goes out. » ; titre « Nothing goes out without approval. » ; texte « At Parrit.ai, no message goes out without a person's approval. » |
| §5 carte 3 | « An agent writes the requested code. » ; « Others review it, each from a different angle. » ; « Tests decide. » ; titre « One agent writes the code, others check it. » ; texte « On October 19, 2026, four agents reviewed the code before it was accepted. » |
| §5 hébergement | « With a provider » « Your data is processed under the contract. » ; « On your servers » « Your data is processed on your premises. » ; « Hybrid » « Sensitive data stays with you. » |
| §6 titre | « They work **with us.** » |
| §6 références | Laparra « Fruit and vegetable wholesaler at the Rungis market: agents that manage the customer base, and a tool to steer the business. » ; Clevery Avocats « An agent for the firm. » ; Forexpert « A prospecting agent. » ; Joone « Helping the teams adopt AI. » ; SNCF « A training program, delivered with Arkel. » |
| §7 titre | « What you say **tells us where to start.** » |
| §7 lignes | “We have AI, but nobody uses it.” → « Train the teams » ; “We want to try it on a real task.” → « Build a first agent with us » ; “We have plenty of ideas: where do we start?” → « Choose priorities » ; “We want a tool made for us.” → « Business software » ; “Our tools exist, we want them to be reliable.” → « Audit and safeguards » |
| §8 | « Paul Larmaraud, **founder of Parrit.ai.** » ; « He founded Parrit.ai in 2024, after two years at Lime. » ; « He designs systems where several agents work together. » ; « He puts in place the safeguards that frame the agents. » ; « He trains teams and leads AI projects. » ; bouton « Talk about a project » |
| Pied | « Journal », « Legal notice », « Français » |

## 3. Les anciennes pages redirigent vers leur section

Dans `next.config.ts`, redirections 308 en un seul saut, FR et EN, requête conservée :

| Ancienne URL (EN et `/fr/…`) | Destination |
|---|---|
| `/consulting-transformation`, `/fr/conseil-transformation`, `/ai-sprints`, `/engineering-integration`, `/manufacture`, `/build-with-you` | `/#path` / `/fr#parcours` |
| `/harness-engineering`, `/standard`, `/systems` | `/#safeguards` / `/fr#confiance` |
| `/dossiers` | `/#references` / `/fr#references` |
| `/commission` | `/#contact` / `/fr#contact` |

Les pages et composants qui ne servent plus sont supprimés (pas laissés morts). Restent servies : `/`, `/fr`, `/journal`, `/fr/journal`, `/journal/<slug>`, `/legal`, `/fr/legal`, `/sketch/[id]` (non indexé, inchangé), et les redirections existantes. `sitemap.xml` et `public/llms.txt` (via son générateur) ne listent plus que les pages servies. Les redirections anciennes qui pointaient vers une page supprimée pointent directement vers la nouvelle destination (jamais deux sauts).

## 4. Règles à mettre à jour

`AGENTS.md` et `TRUTH.md` : remplacer les sections décrivant les quatre pages V1, les routes supprimées, les « trois portes » et l'interdiction du fondateur par : page unique (référence `docs/site-v1/page-unique/`), décisions de Paul du 27/10 citées ci-dessus, photo du registre autorisée en section 8. Conserver : Brand OS, mode accessible, règle des boutons, un éclat rose par écran, deny-all réseau, clients publiables, aucun prix.

## 5. Tests

- Supprimer les tests des pages supprimées (ils n'ont plus d'objet) ; **garder** les contrôles transverses : Brand OS, contraste, deny-all réseau, conformité de marque, fausses promesses, mono interdite, boutons (adaptés à la page unique), Journal, légal, redirections.
- Nouveaux tests : (a) l'accueil FR/EN rend les 8 sections dans l'ordre, avec leurs ancres ; (b) chaque ancienne URL répond 308 vers sa section, en un seul saut, requête conservée ; (c) aucune URL du sitemap ne répond autre chose que 200 ; (d) à 1440 et 390 px : aucun débordement, aucun texte en police machine, boutons conformes, un seul éclat rose par écran ; (e) la photo est servie et son empreinte correspond au registre ; (f) la réservation est atteignable depuis le bouton de la section 8.
- Comparaison visuelle : captures 1440 et 390 px de `/fr` jointes au rapport, à côté de `maquette-1440.png` et `maquette-390.png` ; écrire les écarts restants.

## 6. Ajouts de Paul après la première maquette (27/10, nuit) — inclus dans la maquette validée

Paul : « mixer ça avec la présentation Act-On et les logos de la tech qu'on emploie » ; « une petite case CRM […] des téléphones. On voyait le cabinet d'avocats qui pouvait avoir du résultat, on voyait Forexpert […] idéalement des petites vidéos, avec les conversations en direct sur le téléphone » ; « il ne faudra pas perdre le journal […] l'optimisation GEO […] ranker sur nos sujets de niche, et localement sur Lille et les Hauts-de-France » ; « les logos des entreprises avec lesquelles on travaille […] MIT […] On peut pas les afficher encore, mais on pourrait les afficher. »

### 6.1 Section « Nos agents travaillent déjà chez nos clients » (maquette, après « Ce que l'IA change »)

Trois téléphones (textes exacts de la maquette, issus du deck Act-On du 22/10, slides 11 à 13, scènes reconstituées sur données fictives) : cabinet d'avocats (Clevery Avocats), organisme de formation (Forexpert), grossiste de Rungis (Laparra). Les messages **apparaissent un à un, en boucle, comme une conversation en direct** (CSS uniquement, `transform` et `opacity`, cycle d'environ 18 s) ; avec `prefers-reduced-motion: reduce` ou sans JavaScript, tous les messages sont visibles d'emblée. Le téléphone garde ses coins arrondis (seule exception de la charte). Mention sous la section, mot pour mot. Ancre `#en-production` / `#in-production`, ajoutée en tête de la navigation (« En production » / « In production »).

EN : titre « Our agents already work **at our clients.** » ; cabinet : messages « Good morning. 6 messages overnight, 3 need action. » / « 1. Client A: meeting request, reply ready.\n2. Court registry: document received, filed.\n3. Client B: follow-up, reply ready. » / « Show me the reply to client A. » / « It is in your mailbox, ready to review before sending. » ; carte « In the mailbox » « Reply to client A: draft ready to review. » ; titre « A law firm starts its day with its actions ready. » ; ligne « Clevery Avocats, every morning. » — formation : « Good morning. Today's 10 messages went out at 8 a.m. » / « This week's follow-ups are scheduled.\nA call is due today: Company C, day 35. » / « Thanks, I'll call them today. » ; carte « In the pipeline » « Call Company C today, after 5 weeks. » ; titre « A training company prospects every morning at 8 a.m. » ; ligne « Forexpert, every morning. » — grossiste : « Task for Sales 1: follow up Client A on the Hass avocado offer, by Thursday. » / « I'm creating this task: follow up Client A, owner Sales 1, due October 8. Confirm? » / « yes » / « Done, the task is in the CRM. » ; carte « In the CRM » « Follow up Client A, to do, Sales 1. » ; titre « A Rungis wholesaler steers its customer base by talking to its agents. » ; ligne « Laparra, on the team's phones. » — mention « Scenes rebuilt with fictional data, faithful to the systems in service. Nothing goes out without a person's approval. »

### 6.2 Bande « Les outils avec lesquels nous construisons » (section Références)

Dix outils, logos monochromes (couleur de texte de la section, via masque CSS sur les SVG), libellé dessous : ChatGPT, Claude Code, Codex, OpenCode, Gemini, n8n, Supabase, Telegram, GitHub, Vercel. Fichiers fournis dans `docs/site-v1/page-unique/logos/` (Simple Icons, licence CC0, version 13.21.0 sur jsDelivr ; OpenCode : icône du site officiel opencode.ai), à copier dans `public/` avec un fichier `SOURCES.md` (origine, date, licence). Mention mot pour mot sous la bande. EN : « The tools we build with. » ; « The brands named belong to their owners. We use them; no partnership is implied. »

### 6.3 Logos des clients et du MIT : prêts, éteints par défaut

- Dans le registre des preuves (`getSiteEvidence` / registre existant), ajouter pour Laparra, Clevery, Forexpert, Joone, SNCF un champ `logo` : `{ autorise: false, fichier: null, source: null, accord: null }`. La section Références affiche le **logo** seulement si `autorise: true` **et** `fichier`, `source` et `accord` (qui, date) sont remplis ; sinon le **nom en texte** (comportement actuel). Un test bloque l'affichage d'un logo sans accord renseigné.
- Préparer de la même façon une entrée « MIT » dans un bloc « Recherche » des références, **éteinte** (`autorise: false`), intitulé à fixer par Paul. Rien du MIT ne s'affiche tant que l'entrée est éteinte. Ne télécharger aucun logo de client ni du MIT dans ce lot.

### 6.4 Journal, GEO et référencement local : ne rien perdre

- **Journal** : `/journal`, `/fr/journal`, `/journal/<slug>`, la chaîne de publication (`content/journal`, scripts de publication et portes de contrôle) et ses tests restent intacts. Lien « Journal » dans le pied de page et une ligne « Ce que nous écrivons » avant la section fondateur menant au Journal.
- **Pages thèmes (hub-and-spoke, doctrine GEO de la skill `geo-visibilite-ia`)** : au lieu de rediriger les anciennes pages de contenu vers une simple ancre, créer quatre pages thèmes **sous le Journal**, non présentes dans la navigation principale : `/journal/themes/harness-engineering`, `/journal/themes/ai-sprints`, `/journal/themes/integration-developpement`, `/journal/themes/conseil-transformation` (et leurs équivalents FR sous `/fr/journal/themes/…`). Chacune reprend le **contenu textuel existant** de l'ancienne page correspondante (sans les éléments visuels retirés : ni surtitres, ni étiquettes), en tête une réponse directe en moins de 80 mots, puis la liste des articles du Journal sur ce thème, et un bouton vers `/#contact`. Les anciennes URL (`/harness-engineering`, `/ai-sprints`, `/engineering-integration`, `/consulting-transformation` et leurs versions FR) redirigent en 308 vers leur page thème (et non vers une ancre), pour conserver leur référencement. Les autres anciennes pages gardent les redirections du §3.
- **Données structurées** sur l'accueil : JSON-LD `Organization` (nom, URL, logo texte, `sameAs` LinkedIn existant) + `Person` (Paul Larmaraud, fondateur, `worksFor`) + `areaServed` : Lille, Métropole européenne de Lille, Hauts-de-France, France. **Aucune adresse postale de commerce local** (le siège légal est à Rueil-Malmaison ; ne pas créer de `LocalBusiness` avec une fausse adresse). Phrase visible dans la section fondateur, sous la bio : « Basé dans la métropole lilloise, il travaille aussi à Paris. » / « Based in the Lille area, he also works in Paris. »
- `sitemap.xml` : accueil FR/EN, pages thèmes, Journal, articles, mentions légales. `public/llms.txt` (via son générateur) : décrire la page unique, les pages thèmes et le Journal.
- Titres et descriptions : `<title>` de l'accueil FR « Parrit.ai · Agents et logiciels d'IA en production, Lille et Hauts-de-France » ; EN « Parrit.ai · AI agents and software in production » ; descriptions de 120 à 155 caractères.

## Interdits

Aucun texte hors ce document et la maquette ; aucun chiffre, prix, logo ; aucune couleur littérale, ombre, dégradé ; rayon 0 partout (pas de téléphone sur cette page) ; aucune mono visible ; aucun CRM en vedette.

## Critères, branche

`npm ci`, lint, `npm test`, build, `qa:brand:rev01`, `qa:claims:rev01`, `test:brand-os` verts ; Claude rejoue `qa:network:rev01` sur l'hôte. Rapport `docs/site-v1/page-unique/RAPPORT-PAGE-UNIQUE.md`. Branche depuis `main`, PR vers `main`, pas de fusion par Codex. Mise en production ordonnée par Paul.
