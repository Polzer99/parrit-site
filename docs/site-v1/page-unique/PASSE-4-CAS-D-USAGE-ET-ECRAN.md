# Passe 4 — cas d'usage, partenaires, trajet sans outillage, un bloc = un écran (Paul, 27/10/2026)

Statut : maquette revue par Paul le 27/10 après-midi (films « passe 4 » et « téléphone »).
Maquette de référence (lecture seule, hors dépôt) :
`/private/tmp/claude-501/-Users-paullarmaraud/b2420e7f-18c7-4612-878e-b13d9a2a28d0/scratchpad/maquette-bas/`
— `passe4.py` contient tous les textes et règles ; `index.html` en est le résultat. Copier `passe4.py`
dans `docs/site-v1/page-unique/passe-4/` (pas de vidéo, pas de capture).

Le reste de la page ne change pas. Aucune couleur littérale, radius 0, aucune ombre, General Sans.

## 1. Services : quatre cas d'usage qui défilent

Remplacer, dans chaque case de `#services`, la tâche à barre de progression et « Prêt à relire » par :
nom du service, un cas d'usage, une étiquette (« Back-office » contour canard / « Nouveau » fond
canard, texte blanc) et quatre points de position.

- Ordre de défilement : back-office, nouveau, back-office, nouveau. Une case sur deux commence au
  deuxième cas (« Nouveau »), pour que le mélange se voie tout de suite.
- Chaque cas reste **3,5 s** (le temps de le lire), puis la phrase et l'étiquette s'éteignent 120 ms et
  le suivant apparaît. Départs décalés de 290 ms d'une case à l'autre.
- Rendu serveur, sans JS et en mouvement réduit : premier cas de chaque case, sans défilement.
- `aria-live="off"` ; les quatre cas sont dans le DOM pour les lecteurs d'écran (un visible, trois
  en texte masqué visuellement), afin que le contenu ne dépende pas de l'animation.

| Service | Back-office (FR / EN) | Nouveau (FR / EN) |
|---|---|---|
| Direction / Leadership | Résume les décisions de chaque réunion, et qui s'en charge. / Summarizes each meeting's decisions, and who owns them. — Prépare le tableau de bord du lundi. / Prepares Monday's dashboard. | Simule l'effet d'une décision sur la marge avant de la prendre. / Simulates a decision's effect on margin before you make it. — Répond à une question sur toute l'entreprise, sources à l'appui. / Answers a question about the whole company, with sources. |
| Finance | Rapproche les relevés bancaires et le grand livre. / Reconciles bank statements with the ledger. — Relance les factures échues, sur le bon ton. / Chases overdue invoices, in the right tone. | Prévoit la trésorerie à treize semaines, à jour chaque matin. / Forecasts cash thirteen weeks ahead, updated every morning. — Repère une dépense anormale le jour même. / Spots an unusual expense the same day. |
| Commercial / Sales | Met à jour la base clients après chaque rendez-vous. / Updates the customer base after every meeting. — Prépare les devis selon vos conditions. / Prepares quotes on your terms. | Repère les entreprises qui viennent d'avoir besoin de vous. / Spots the companies that have just come to need you. — Prépare chaque rendez-vous avec tout l'historique du client. / Prepares every meeting with the client's full history. |
| Administration des ventes / Sales administration | Saisit les commandes reçues par e-mail. / Enters orders received by e-mail. — Confirme les délais de livraison au client. / Confirms delivery dates to the client. | Lit un bon de commande scanné ou manuscrit. / Reads a scanned or handwritten purchase order. — Prévient le client d'un retard avant qu'il n'appelle. / Warns the client of a delay before they call. |
| Achats / Purchasing | Compare les offres des fournisseurs. / Compares supplier offers. — Vérifie chaque facture contre sa commande. / Checks every invoice against its order. | Surveille le prix des matières et alerte au bon moment. / Watches raw material prices and alerts you at the right time. — Évalue un nouveau fournisseur à partir de sources publiques. / Assesses a new supplier from public sources. |
| Logistique / Logistics | Prévient quand une livraison prend du retard. / Warns you when a delivery runs late. — Prépare les documents d'expédition. / Prepares shipping documents. | Recalcule les tournées chaque matin selon les commandes du jour. / Recalculates delivery rounds every morning from the day's orders. — Anticipe une rupture avant qu'elle n'arrive. / Anticipates a stock-out before it happens. |
| Production | Prépare le planning de la semaine. / Prepares the week's schedule. — Consigne les arrêts machine. / Logs machine stoppages. | Replanifie dans l'heure quand une machine s'arrête. / Reschedules within the hour when a machine stops. — Répond aux opérateurs à partir des notices techniques. / Answers operators from the technical manuals. |
| Qualité / Quality | Classe les réclamations par cause. / Sorts complaints by cause. — Tient à jour les fiches de non-conformité. / Keeps non-conformity reports up to date. | Relie chaque réclamation au lot et à la machine en cause. / Links each complaint to the batch and machine involved. — Rassemble les preuves d'un audit avant qu'il commence. / Gathers the evidence for an audit before it starts. |
| Service client / Customer service | Propose une réponse à chaque demande. / Suggests a reply to each request. — Trie les demandes par urgence. / Sorts requests by urgency. | Répond la nuit et le week-end, dans votre ton. / Replies at night and at weekends, in your tone. — Repère un client sur le point de partir. / Spots a client about to leave. |
| Ressources humaines / Human resources | Vérifie qu'un dossier est complet. / Checks that an employee file is complete. — Prépare l'arrivée d'un nouveau salarié. / Prepares a new hire's arrival. | Répond aux questions des salariés sur leurs droits, à toute heure. / Answers employees' questions about their rights, at any hour. — Trouve qui, en interne, a déjà résolu ce problème. / Finds who, in-house, has already solved this problem. |
| Marketing | Adapte un même texte à chaque canal. / Adapts one text to each channel. — Fait le bilan de chaque campagne. / Reviews each campaign. | Écrit une version par secteur client, en une fois. / Writes one version per client sector, in one go. — Suit chaque semaine ce que publient vos concurrents. / Tracks what your competitors publish, every week. |
| Juridique / Legal | Prépare un projet de contrat à relire. / Drafts a contract for review. — Suit les échéances de vos contrats. / Tracks your contracts' deadlines. | Compare un contrat reçu à vos règles et signale les écarts. / Compares an incoming contract with your rules and flags the gaps. — Retrouve une clause dans dix ans d'archives. / Finds a clause in ten years of archives. |

Étiquettes : « Back-office » / « Back office », « Nouveau » / « New ».

## 2. Partenaires : « Avec eux, nous livrons »

Chaque case de `#partenaires` se retourne : la face canard affiche « Avec eux, nous livrons » /
« With them, we deliver » puis chaque offre, **2,2 s** chacune (fondu de 150 ms entre deux offres),
avant de revenir au type de partenaire. Une case démarre toutes les 3,4 s, dans l'ordre : jamais
plus de deux cases retournées en même temps. Supprimer le surlignage séquentiel de la passe 3.
Légende : « Une équipe composée pour chaque diagnostic, et ce qu'elle livre » / « A team assembled
for each diagnosis, and what it delivers ». Sans JS ou mouvement réduit : face « type » seule, les
offres en liste visible sous la description.

| Type | Offres FR | Offres EN |
|---|---|---|
| Ingénieurs IA | Des agents sur mesure · La vision par ordinateur · L'intégration à vos logiciels | Custom agents · Computer vision · Integration with your software |
| Automatisation et assistants | Des assistants écrits · Des assistants vocaux · Des vidéos générées | Written assistants · Voice assistants · Generated videos |
| Transformation et projet | La conduite du changement · Le pilotage de projet · Votre feuille de route IA | Change management · Project delivery · Your AI roadmap |
| Marque et marketing | Votre identité de marque · Vos contenus · Votre prospection | Your brand identity · Your content · Your prospecting |
| Formation | Des formations certifiées · Des ateliers par métier · La formation à Claude Code | Certified training · Workshops by role · Claude Code training |
| Conseil et qualité | L'audit de vos processus · Le diagnostic IA · La relecture de chaque livrable | Process audits · AI diagnosis · A review of every deliverable |
| Chercheurs du MIT | Vos déploiements d'agents les plus exigeants · La revue d'architecture | Your most demanding agent deployments · Architecture review |

## 3. Trajet d'une donnée : plus d'outils clients, le local, aucun outillage interne

Paul : on utilise bien plus d'outils, il manque le local, et on ne dévoile pas notre stack. Le bon
modèle en face de chaque tâche, et nous construisons les harnais.

- **Retirer** toute mention de notre outillage interne dans cette section : Supabase, OVH,
  OpenRouter, Claude, ChatGPT, Gemini, Mistral, Qwen, DeepSeek, et la ligne « Nous construisons avec »
  (Claude Code, Codex, OpenCode, GitHub, Vercel, n8n). Puces en texte seul, sans icône ni carré.
- Supprimer de `public/tools/` les icônes devenues inutiles et leurs lignes dans `SOURCES.md` ; garder
  celles encore affichées (WhatsApp, iMessage, Telegram si utilisées, sinon les retirer aussi).
- La mention « Les marques citées appartiennent à leurs propriétaires… » reste tant qu'une marque
  (WhatsApp, iMessage, Teams, Telegram) est citée.

| # | Titre et phrase FR | EN | Puces FR / EN |
|---|---|---|---|
| 1 | Vos sources · Tout ce que vos équipes utilisent déjà. | Your sources · Everything your teams already use. | E-mails / E-mails · Agenda / Calendar · Téléphone et messages vocaux / Phone and voicemail · WhatsApp · Teams et Slack / Teams and Slack · ERP · CRM · Comptabilité / Accounting · Paie / Payroll · Tableurs / Spreadsheets · Documents et PDF / Documents and PDFs · Scans et photos / Scans and photos · Sites web / Websites · Machines et capteurs / Machines and sensors |
| 2 | Votre base · Une seule base, où vous le décidez. | Your database · One database, wherever you decide. | Dans le cloud, en Europe / In the cloud, in Europe · Sur vos serveurs / On your servers · En local, sur vos machines / Locally, on your machines |
| 3 | Les agents · Le bon modèle en face de chaque tâche, dans un harnais construit pour vous. | The agents · The right model for each task, inside a harness built for you. | Le bon modèle pour chaque tâche / The right model for each task · En ligne ou en local / Online or local · Vos règles et vos contrôles / Your rules and checks · Des tests à chaque changement / Tests on every change |
| 4 | Vous validez · Là où vous êtes déjà. | You approve · Where you already are. | **Votre propre application / Your own app** (en tête, fond canard, texte blanc, gras, un cran plus grand) · WhatsApp · iMessage · E-mail · Teams · Telegram |
| 5 | Le résultat · Le travail est fait. | The result · The work is done. | inchangé |

Grille ordinateur : `1.7fr 1fr 1fr 1fr .9fr`.

## 4. Laparra : un outil de pilotage agentique

Partout où le site présente Laparra comme un CRM ou une base clients :
- ligne de référence : « Grossiste du MIN de Rungis : un outil de pilotage agentique pour les fruits
  et légumes. » / « Wholesaler at the Rungis market: an agentic management tool for fruit and vegetables. » ;
- registre `preuves.ts`, claim Laparra : « Un outil de pilotage agentique pour les fruits et légumes » ;
- titre de la scène téléphone : « Un grossiste de Rungis pilote son activité en parlant à ses agents. » /
  « A Rungis wholesaler runs its business by talking to its agents. ».
Chercher aussi « CRM » associé à Laparra dans `src/`, `content/` et `scripts/generate-llms.mjs`.

## 5. Un bloc = un écran (Paul : « que le schéma d'architecture ne soit pas coupé »)

Règle, vérifiée par un test bloquant dans `tests/single-page.spec.ts`, FR et EN, en mouvement réduit,
aux trois tailles **1440×800, 1280×720 et 390×700** :

- (a) pour chaque section sauf le hero et le contact : hauteur du contenu (premier enfant de la
  section, sans ses marges) ≤ hauteur de l'écran ;
- (b) pour toutes les sections : aucune figure (SVG du hero, liste de cartes, carrousel, grille de
  services, équipe, trajet d'une donnée, bloc fondateur) n'est plus haute que l'écran ;
- (c) le hero tient entier (titre, phrase, bouton, schéma, légende) en 1440×800, barre canard comprise.

Moyens (maquette, partie 5 de `passe4.py`) :

- **Ordinateur** : marges de section `clamp(56px, 9vh, 112px)` ; services, équipe et trajet resserrés
  (padding 18 à 22px, puces 15px, gaps 6 à 14px). Le schéma du hero se réduit avec
  `max-height` calculée sur la hauteur d'écran, jamais coupé. H1 inchangé (contrat 88px).
- **Téléphone (≤ 760px)** : services, équipe, trois étapes, trajet d'une donnée, les trois
  téléphones « En production » et les trois cartes « Ce que l'IA change » deviennent des carrousels
  horizontaux (`scroll-snap`, cartes à 84 % de largeur, alignées en haut), avec des points de position
  sous chaque carrousel. Le trajet d'une donnée avance seul toutes les 2,4 s jusqu'au premier
  toucher, et jamais en mouvement réduit. Bloc fondateur : photo à 38 % à côté du nom, liste dessous.
- Le calendrier Cal.com est exempté de la règle (a) (hauteur fixée par Cal.com), pas le bloc fondateur.
- Aucun texte sous 15px ; carrousels accessibles au clavier (`tabindex="0"`, `aria-label`).

## 6. Tests et documents

- Mettre à jour les contrôles de structure (services, partenaires, trajet sans outillage interne :
  aucune de ces marques visible dans `#architecture`, « Votre propre application » en tête), la liste
  d'outils attendue dans `tests/single-page.test.mjs`, et les textes Laparra.
- Ajouter le test « un bloc = un écran » ci-dessus.
- `AGENTS.md` et `TRUTH.md` : référencer cette passe ; règle « ne pas dévoiler la stack interne sur
  la page » et règle « un bloc = un écran ».
- Batterie : `npm ci && npm run lint && npm run build && npm test && npm run qa:brand:rev01 &&
  npm run qa:claims:rev01 && npm run test:brand-os` ; navigateur rejoué par Claude sur l'hôte.
