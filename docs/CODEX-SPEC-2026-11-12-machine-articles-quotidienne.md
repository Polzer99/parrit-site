# CODEX SPEC — Machine à articles quotidienne (SEO + GEO), relance du Journal

Niveau de risque : moyen. Le code livre la machine **désarmée** : sans la variable de dépôt `JOURNAL_AUTOPUBLISH=1`, elle ouvre une PR par jour et ne publie rien. L'armement est un geste de Paul.

Demande de Paul (12/11/2026) : « optimiser le site pour ranker sur les offres qu'on déploie et récupérer du trafic sur les marchés qu'on peut adresser, avec une machine qui publie chaque jour des articles GEO-friendly et SEO-friendly. Je voudrais que la cadence reparte. »

## Pourquoi l'ancienne machine s'est arrêtée (ne pas la refaire)

- Dernier article publié le 13/10 (`8402983`). Le geste quotidien tournait en local (`claude -p`, job launchd `ai.parrit.journal-quotidien`) avec un panel de 8 à 16 relecteurs LLM et une porte « lisibilité » LLM. Mesure du 01/11 : la même porte, sur un texte qu'elle avait accepté, a rendu **1 PASS sur 5**. Résultat : 17 jours d'affilée sans article, coût réel à chaque passage. Paul a coupé le job le 03/11 : « relance seulement avec une autre méthode et un modèle moins cher ».
- Nouvelle méthode : **les portes sont déterministes** (code, regex, vérification de sources par HTTP). Un seul juge LLM, étroit, binaire, sur deux questions précises. Modèles OpenRouter bon marché. Tourne dans GitHub Actions, Mac fermé.

## Ce qui existe et se réutilise (ne pas réécrire)

- `content/journal/<slug>.mdx` (EN) et `content/journal/fr/<slug>.mdx` (FR, `translationOf`), routes `/journal/<slug>` et `/fr/journal/<slug>`, hreflang, sitemap, `llms.txt` (prebuild `scripts/generate-llms.mjs`).
- `scripts/publish-journal.mjs` et `scripts/journal-gates.mjs` : portes fiches internes, slug, noms clients (`scripts/lib/public-clients.mjs`), répétition, pièges MDX, orthographe de l'entité, conformité marque, build. **Les réutiliser telles quelles** en important leurs fonctions. `publish-journal.mjs` dépend de `~/parrit-os` (prooflint, registre) : en CI, ces deux étapes sont remplacées par l'équivalent Node décrit plus bas, sans modifier le comportement local du script.
- `scripts/false-claims-check.mjs`, `scripts/lib/certification-claims.mjs`, `scripts/lib/ownership-claims.mjs` : à appliquer à chaque article.
- Secret de dépôt `OPENROUTER_API_KEY` (déjà présent). Exemple de workflow planifié : `.github/workflows/hermes-weekly.yml`.

## 1. La carte des sujets (`content/plan/sujets.json`)

Fichier versionné, file d'attente lue par la machine. Chaque entrée :

```json
{ "id": "audit-ia-pme-par-ou-commencer", "requete": "par où commencer l'IA dans une PME",
  "intention": "informationnelle|commerciale", "pilier": "audit-pme|agents-production|formation|logiciel-sur-mesure|industrie-metiers|gouvernance",
  "offre": "audit|formation|logiciel|harnais", "angle_local": false, "statut": "a_faire|publie|ecarte", "slug": null, "publie_le": null }
```

Graine à créer (36 sujets, ordre = priorité ; FR d'abord, ce que tape un dirigeant de PME ou d'ETI, une DSI, une direction métier) :

Pilier `audit-pme` (offre : séance d'une heure puis audit de deux jours)
1. Par où commencer l'IA dans une PME quand on n'a pas d'équipe data ?
2. Audit IA d'une PME : que regarde-t-on en deux jours ?
3. Comment choisir le premier cas d'usage IA rentable dans une PME industrielle ?
4. Quels processus d'une PME se prêtent vraiment à un agent IA, et lesquels non ?
5. Combien de temps faut-il pour voir un premier résultat d'un projet IA en PME ?
6. IA dans une PME des Hauts-de-France : quels appuis régionaux existent ? (angle_local, sources officielles Région / BPI / CCI uniquement)

Pilier `agents-production` (sujets où Parrit est seul en français, étude du 08/11)
7. Qu'est-ce qu'un agent IA en entreprise, concrètement ?
8. Agent IA ou RPA : comment choisir ?
9. Comment savoir si un agent IA a vraiment fait son travail ?
10. Un agent IA peut-il inventer des faits, et comment s'en protéger ?
11. Quelles permissions donner à un agent IA dans un système d'information ?
12. Qu'est-ce que le harnais (harness) d'un agent IA ?
13. Combien coûte un agent IA en production, au mois ?
14. Faut-il plusieurs fournisseurs de modèles IA pour ne pas dépendre d'un seul ?
15. IA souveraine : héberger un modèle sur ses propres serveurs, pour qui et à quel prix d'infrastructure ?

Pilier `industrie-metiers` (personne ne l'occupe en français)
16. IA et service qualité : traiter les réclamations clients plus vite
17. IA et administration des ventes (ADV) : ce qu'on peut automatiser
18. IA et achats industriels : comparer des offres fournisseurs
19. IA et logistique : prévoir, planifier, répondre aux clients
20. IA et maintenance industrielle : ce qui marche aujourd'hui
21. Faire adopter un ERP ou SAP grâce à un assistant IA
22. IA pour un grossiste ou un distributeur : CRM et commandes

Pilier `logiciel-sur-mesure`
23. Développer un outil IA sur mesure ou acheter un SaaS ?
24. Du prototype IA à l'outil en production : ce qui change
25. Combien de temps pour construire un outil IA interne ?
26. Claude Code pour une PME : à quoi ça sert hors des développeurs ?

Pilier `formation` (ne jamais nommer d'organisme ni de certification : décision de Paul en attente)
27. Former ses équipes aux agents IA : par où commencer ?
28. Apprendre à construire un agent IA sans être développeur
29. Former un référent IA interne : quel rôle, quelles compétences ?

Pilier `gouvernance`
30. AI Act : quelles obligations pour une PME qui utilise l'IA ?
31. AI Act : l'obligation de former les salariés (article 4)
32. Faut-il consulter le CSE avant de déployer l'IA ?
33. Rédiger une charte d'usage de l'IA en entreprise
34. RGPD et agents IA : ce qu'il faut vérifier
35. Données de l'entreprise et ChatGPT : quels risques réels ?
36. Mesurer le retour sur investissement d'un projet IA

La machine marque `ecarte` un sujet trop proche d'un article existant (Jaccard ≥ 0,5 sur titres via `gateRepetition`, ou même requête) et passe au suivant. Script `scripts/journal-sujets.mjs --ajouter "<requête>" --pilier … --offre …` pour enrichir la file à la main.

## 2. Le générateur (`scripts/journal-machine.mjs`)

Node 22, ESM, sans dépendance nouvelle hors nécessité (fetch natif). Étapes :

1. **Choisir** le premier sujet `a_faire`. S'il n'y en a plus : sortir en code 0 et ouvrir une issue « Journal : file de sujets vide ».
2. **Rechercher** (une requête) : OpenRouter `POST /api/v1/chat/completions`, modèle `JOURNAL_MODELE_RECHERCHE` (défaut `deepseek/deepseek-v4-flash`), `plugins: [{ "id": "web", "max_results": 8 }]`. Consigne : réunir 5 à 8 sources récentes (moins de 24 mois, sauf texte de loi), francophones ou officielles de préférence, avec pour chacune les faits chiffrés exacts et la phrase d'où ils viennent. Conserver `message.annotations[].url_citation` (url, title, content). Interdits comme sources : sites concurrents directs de conseil IA, contenus générés sans auteur.
3. **Écrire en français** : modèle `JOURNAL_MODELE_REDACTION` (défaut `deepseek/deepseek-v4-pro`), température 0,4, sources fournies dans le prompt, **aucune autre source autorisée**. Gabarit imposé (issu de l'étude concurrents du 08/11) :
   - frontmatter : `title` (la question, ≤ 70 caractères), `description` (≤ 155), `date`, `updatedAt`, `pilier`, `requete`, `author: Paul Larmaraud`, `sources: [{label,url}]`, `faq: [{q,a}]` (3 à 5) ;
   - **réponse directe** de 50 à 80 mots en tête, avant tout titre : elle répond à la question sans préambule ;
   - « À retenir » : 3 à 5 puces ;
   - 3 à 5 H2 formulés en questions d'acheteur, chacun ouvert par une réponse de 40 à 60 mots ;
   - au moins un tableau ;
   - « Ce que nous en retenons » : la position de Parrit.ai, en « nous », **sans aucun fait de mission, client, chiffre interne ou résultat revendiqué** ;
   - FAQ (rendue et en données structurées `FAQPage`) ;
   - fin : une phrase qui renvoie à l'appel de 15 minutes, lien vers l'ancre de réservation existante de l'accueil FR (la même cible que les CTA actuels, avec `?source=journal-<slug>`) ;
   - 900 à 1 600 mots ; vouvoiement ; phrases courtes ; lien interne vers 2 à 3 articles existants du même pilier (ou proches) quand ils existent.
   Le prompt système reprend la liste d'interdits de la §4 et la voix de `docs/CODEX-SPEC-2026-11-08-journal-en-francais.md` §1.
4. **Adapter en anglais** (même modèle) : `content/journal/<slug>.mdx`, même structure, mêmes chiffres et URL. Le FR est la version de référence ; l'EN reste nécessaire au gabarit actuel (FR = `translationOf`).
5. **Portes** (§3). Si une porte échoue : **une** réécriture ciblée avec le motif exact de l'échec, puis nouvelle passe des portes. Second échec : sujet laissé `a_faire` avec un compteur `essais`, passage au sujet suivant (un seul autre essai par jour). Trois échecs sur un sujet : `ecarte` avec le motif.
6. **Plafond de coût** : additionner `usage.cost` des réponses OpenRouter ; au-delà de `JOURNAL_COUT_MAX_USD` (défaut 0,50) le run s'arrête sans publier.
7. **Journal de bord** : une ligne JSON par run dans `content/plan/journal-runs.jsonl` (date, sujet, slug, modèles, coût, portes et motifs, issue : publie/pr/echec).

Les rendus nouveaux du gabarit (bloc réponse directe, « À retenir », FAQ en `FAQPage`, sources en bas, `dateModified` = `updatedAt`, auteur avec `@id` de la page auteur s'il existe) : les ajouter au gabarit d'article existant **uniquement s'ils manquent**, sans changer le rendu des 31 articles déjà publiés (champs optionnels).

## 3. Les portes (toutes déterministes sauf la dernière)

Fichier `scripts/journal-machine-gates.mjs`, testé unitairement.

1. Portes existantes de `journal-gates.mjs` et de `publish-journal.mjs` (fiches internes, slug, noms clients, répétition, pièges MDX, orthographe de l'entité, conformité marque), plus `false-claims-check`, `certification-claims`, `ownership-claims`.
2. **Anti-IA en Node** (équivalent prooflint) : aucun `—` ni `–` ; aucune de ces expressions : « de plus », « en outre », « par ailleurs », « il est important de noter », « dans un monde où », « à l'ère de », « révolutionnaire », « innovant », « puissant », « incontournable », « véritable levier », « n'est plus une option », « En conclusion », « En résumé » ; pas trois paragraphes d'affilée qui commencent par le même mot.
3. **Structure** : réponse directe 50-80 mots avant le premier titre ; 3 à 5 H2 se terminant par « ? » ; au moins un tableau ; « Ce que nous en retenons » présent ; FAQ 3 à 5 ; lien de réservation présent ; 900 à 1 600 mots (FR).
4. **Sources vérifiées par HTTP** : chaque URL de `sources` répond 200 (GET, suivi de redirections, délai 15 s, User-Agent générique `ParritJournalBot/1.0`). **Chaque nombre** du texte FR (hors années, numéros d'article de loi, versions, nombres ≤ 10 écrits dans une phrase sans unité) doit apparaître, normalisé (virgule/point, espaces de milliers, `%`), dans le texte d'au moins une source citée (texte de la page récupérée, ou `url_citation.content`). Un nombre introuvable = échec avec la liste des nombres en cause.
5. **Interdits Parrit** : aucun prix ni montant en euros ; aucun nom de client (porte 1) ; aucune mention de FormIA, Qualiopi, OPCO éligibilité, MIT, « nos clients », « chez un client », « nous avons déployé », « nous avons accompagné » ; aucune adresse, aucun « bureaux ». Villes autorisées : Tourcoing, Lille, métropole lilloise, Hauts-de-France, Paris.
6. **Juge unique** (modèle `JOURNAL_MODELE_JUGE`, défaut `z-ai/glm-5.3`, température 0, sortie JSON stricte). Deux questions seulement, réponse oui/non + citation de la phrase en cause : (a) le texte affirme-t-il une expérience vécue, un résultat ou un fait sur Parrit.ai qui ne figure pas dans la liste des faits autorisés ci-dessous ? (b) la réponse directe répond-elle à la requête du sujet ? Faits autorisés sur Parrit.ai : « Parrit.ai conseille et construit des outils IA pour des PME, des ETI et des grands groupes », « présence à Tourcoing et à Paris », « Paul Larmaraud, fondateur ». Un « oui » à (a) ou un « non » à (b) = échec. Pas d'autre jugement de style par LLM.
7. **Build** : `npm run lint && npm run build -- --webpack` et les tests du Journal existants.

## 4. Le workflow (`.github/workflows/journal-quotidien.yml`)

- `schedule: cron "15 5 * * *"` (chaque jour, 7 jours sur 7) + `workflow_dispatch` (entrée `sujet` optionnelle).
- `concurrency: journal-quotidien`, pas d'annulation.
- Étapes : checkout, Node 22, `npm ci`, `node scripts/journal-machine.mjs`.
- Si les portes passent : branche `journal/<slug>`, commit « Journal : <titre FR> », PR étiquetée `journal`.
  - si `vars.JOURNAL_AUTOPUBLISH == '1'` : fusion de la PR dans `main` par le workflow (squash) une fois `ci.yml` vert sur la branche, ou, si l'attente de `ci.yml` n'est pas possible avec `GITHUB_TOKEN`, après le build et les tests déjà passés dans le même job. Le choix est documenté dans le rapport ;
  - sinon : PR laissée ouverte (mode désarmé, défaut).
- Après fusion, **preuve de mise en ligne** (un 200 ne suffit pas) : jusqu'à 15 minutes, sonder `https://parrit.ai/fr/journal/<slug>` jusqu'à ce que la page réponde 200 **et contienne le titre FR**, puis vérifier sa présence dans `https://parrit.ai/sitemap.xml`. Ensuite ping **IndexNow** (`https://api.indexnow.org/indexnow`, clé dans `public/<clé>.txt`, clé fournie en variable `INDEXNOW_KEY`, URL FR et EN). Mettre `statut: publie`, `slug`, `publie_le` dans `sujets.json` (commit sur `main`).
- Échec de preuve : issue « Journal : article fusionné mais absent en ligne » avec l'URL.
- **Alerte de panne** : si `journal-runs.jsonl` ne contient aucune issue `publie` (ou `pr` en mode désarmé) depuis 48 h, ouvrir (une seule fois, pas de doublon) une issue « Journal en panne » assignée à `Polzer99` avec les motifs des derniers runs.
- Permissions minimales : `contents: write`, `pull-requests: write`, `issues: write`.

## 5. Contrôles hors code

- Aucun envoi de mail, aucune carte Telegram, aucun réseau social : la machine ne fait que des PR, des commits sur `main` (si armée) et des issues GitHub.
- `AGENTS.md` dit « jamais d'auto-merge ». Cette règle reste vraie pour le code. La fusion automatique d'un **article** (contenu seul, toutes portes vertes) est une exception que Paul arme lui-même par `JOURNAL_AUTOPUBLISH=1`, conformément à son ordre du 25/08 sur le Journal (« publié par les portes machines, pas par une validation humaine »). Désarmée par défaut. Ajouter cette phrase à `AGENTS.md`, section « Règles de sortie ». La fusion automatique refuse toute PR dont le diff touche autre chose que `content/journal/**` et `content/plan/**`.
- Ne pas toucher `hermes-weekly.yml`, `ci.yml`, ni les 31 articles existants (hors champs optionnels ajoutés au gabarit).
- **Ne modifie pas les tests existants**, sauf pour ajouter les nouveaux.

## 6. Tests

- Unitaires des portes (§3) : un article d'exemple valide passe ; une variante par porte échoue avec le bon motif (tiret cadratin, nombre non sourcé, prix, « chez un client », H2 sans « ? », réponse directe de 120 mots, nom client).
- Le générateur testé avec OpenRouter simulé (fixtures JSON, dont `annotations`), sans réseau : choix du sujet, écriture des deux fichiers, mise à jour de `sujets.json` et de `journal-runs.jsonl`, plafond de coût, réécriture unique puis report.
- `act` ou exécution locale de `node scripts/journal-machine.mjs --dry-run --fixtures` : produit l'article et le rapport sans git ni réseau.
- Batterie : `npm ci --silent && npm run lint && npm run build -- --webpack && npm test`. Ne pas committer les PNG réécrits sous `.codex-handoffs/brand-os-p1/after/`.

## 7. Rapport attendu

`docs/REPORT-2026-11-12-machine-articles-quotidienne.md` : fichiers créés, choix de fusion automatique retenu et pourquoi, coût estimé par article (calcul à partir des tarifs OpenRouter relevés le 12/11 : `deepseek-v4-pro` 0,89 $ / 1,78 $ par million de jetons entrée/sortie, `deepseek-v4-flash` 0,09 $ / 0,18 $, `glm-5.3` 0,07 $ / 1,40 $, recherche web environ 0,007 $ par requête), ce qui n'a pas pu être vérifié dans le bac à sable.

---

## Correctif 1 — calibre presse (décision de Paul, 12/11/2026, après lancement)

Paul : « quelque chose du même calibre que ce qui est publié dans Le Nouvel Économiste et Le Monde Informatique ». Ce correctif **prime** sur les §2.3, §3.3, §3.6 et la liste de sujets du §1 là où ils divergent. La plomberie (file, workflow, preuve en ligne, plafond, journal de bord, mode désarmé) est inchangée.

Référence de calibre : la méthode des chroniques de Paul parues dans Le Monde Informatique (méthode du 07/08/2026, résumée ici ; aucun texte de chronique ne doit être copié dans le dépôt, qui est public, ni repris dans un article : accord avec le média, contenu dupliqué).

### C1.1 Gabarit d'article (remplace §2.3)

- **Titre** : une thèse affirmative, qui contredit une idée reçue du secteur, 50 à 90 caractères. Exemples du registre visé : « L'IA est partout dans les entreprises, les agents presque nulle part » ; « La spécification est devenue le livrable » ; « Avant les licenciements, ce sont les prestataires qui sautent ». Jamais une question, jamais « Guide », « Tout savoir », « Comment », « X conseils ». La requête du sujet va dans la `description` et dans le chapô, pas forcément dans le titre.
- **Chapô** : 300 à 450 signes, porté par un ou deux faits chiffrés et datés, avec leur source nommée. Il répond à la requête du sujet (c'est lui que les moteurs de réponse citent). Jamais une définition, jamais un état de l'art, jamais une scène inventée.
- **Corps** : 3 ou 4 intertitres **affirmatifs** (ni questions, ni nominaux creux comme « Les enjeux », « Le contexte »). Progression : le constat chiffré, pourquoi ça tourne mal (faits), ce qu'il faut faire à la place en une règle qu'un dirigeant peut répéter, ce qu'il peut faire lundi (une question à poser, un contrôle à exiger, un arbitrage à rendre).
- **Densité** : 4 à 8 faits par article (un chiffre, une date, un avant contre après), chacun attribué à sa source dans la phrase (« selon l'Insee, en juillet 2026 »). Un paragraphe sans fait ni source est coupé.
- **Ton** : journalistique, neutre, troisième personne dans le corps. Aucun « nous », « notre », « chez nous », aucune publicité, aucun « Parrit » dans le corps.
- **Aucun terme technique sans traduction dans la même phrase** (barème : « jetons » → le coût ; « contexte » → ce que la machine garde en tête ; « orchestration » → la répartition du travail entre plusieurs logiciels). Un sigle est développé à sa première occurrence.
- **Chute** : une ou deux phrases qui reprennent la thèse du titre sous forme de règle.
- **Longueur** : 4 500 à 7 000 signes pour le corps (espaces comprises), soit un format long de la presse économique.
- **Après le corps, séparé** : un bloc « Sources » (titre, éditeur, date, lien) ; une signature « Paul Larmaraud, fondateur de Parrit.ai » ; une seule ligne d'appel, sobre, vers l'appel de 15 minutes (lien de réservation existant, `?source=journal-<slug>`). **Pas de FAQ visible, pas de « À retenir », pas de tableau imposé** (un tableau seulement si les chiffres le demandent). La FAQ du frontmatter (2 à 4 questions, réponses tirées du texte) n'alimente que les données structurées.

### C1.2 Matériau avant sujet (remplace §2.2)

- La recherche cherche des **sources primaires** : instituts statistiques (Insee, Eurostat, Dares, Banque de France), régulateurs et textes officiels (CNIL, Commission européenne, Légifrance, Journal officiel), laboratoires et éditeurs sur leurs propres pages (Anthropic, OpenAI, Google, Mistral), études de cabinets lues sur le site de l'éditeur (McKinsey, EY, BCG, Gartner), prépublications (arXiv), presse économique de référence (Les Échos, Le Monde, L'Usine Nouvelle, Le Monde Informatique, Financial Times). **Refusés** : agrégateurs et reprises (un chiffre de McKinsey cité par Forbes doit être rouvert chez McKinsey ou abandonné), blogs de vendeurs, sites concurrents de conseil IA, pages sans date.
- Fraîcheur : moins de 6 mois pour les données d'usage et de marché, moins de 18 mois pour les études, sans limite pour un texte de loi.
- La recherche doit aussi chercher **ce qui contredit** l'angle prévu ; la thèse se forme sur ce que disent les sources, pas avant.
- **Pas de matériau, pas d'article** : si la recherche ne ramène pas au moins 3 sources primaires acceptées portant au moins 4 faits chiffrés, le sujet est reporté (motif `materiau_insuffisant`) et la machine passe au suivant.

### C1.3 Deux passes d'écriture

1. **Rédaction** : modèle `JOURNAL_MODELE_REDACTION`, défaut **`z-ai/glm-5.2`** (le modèle premium du runtime Parrit), température 0,5.
2. **Secrétariat de rédaction** : même modèle, température 0,2, qui reprend le texte contre la liste du C1.1 (chapô concret, intertitres affirmatifs, faits attribués, termes traduits, paragraphes sans fait coupés, interdits du §3.2) et rend le texte final. Pas d'autre passe.
Le plafond de coût passe à 0,80 $ par run (`JOURNAL_COUT_MAX_USD`).

### C1.4 Portes (modifie §3)

- §3.3 Structure, remplacée par : titre sans « ? » et sans les mots interdits du C1.1 ; chapô 300-450 signes contenant au moins un chiffre ; 3 ou 4 H2, aucun ne se terminant par « ? », aucun dans la liste des nominaux creux (« Introduction », « Contexte », « Les enjeux », « Conclusion », « En résumé ») ; corps 4 500-7 000 signes ; chaque paragraphe du corps contient un chiffre **ou** le nom d'une source citée dans `sources` ; aucun « nous », « notre », « nos », « chez nous », « Parrit » dans le corps (hors bloc signature et appel) ; bloc Sources avec au moins 3 entrées.
- §3.4 Sources, ajouts : rejet de tout domaine de la liste noire d'agrégateurs (fichier `content/plan/sources-refusees.json`, à amorcer avec forbes.com, medium.com, linkedin.com, substack.com, et les domaines de contenu sponsorisé courants) ; **toute citation entre guillemets** de plus de six mots doit figurer mot pour mot (après normalisation des espaces et apostrophes) dans le texte de la source qui l'attribue, sinon échec.
- §3.6 Juge, trois questions au lieu de deux : (a) inchangée ; (b) le chapô répond-il à la requête du sujet ? (c) le titre porte-t-il une thèse que le texte démontre par au moins deux faits sourcés ? Toujours oui/non, avec la phrase en cause.

### C1.5 Sujets (modifie §1)

- Le champ `requete` reste la cible de recherche. Ajouter un champ `these_pressentie` (facultatif, peut être `null`) : la machine peut la réviser si les sources la contredisent, et consigne la thèse retenue dans `journal-runs.jsonl`.
- Marquer **`ecarte` dès la création**, motif `couvert_par_chronique_presse`, les sujets 23 (développer ou acheter), 33 (charte d'usage) ; et écarter tout sujet futur dont le titre recoupe (Jaccard ≥ 0,4) un titre de `content/plan/chroniques-presse.json`. Ce fichier ne contient **que les titres** (jamais le texte) : « Paralléliser le travail sans paralléliser les erreurs » ; « Où mettre un modèle, où mettre une règle métier » ; « La spécification est devenue le livrable » ; « Le garde-fou va dans la CI plutôt que dans la checklist » ; « Le modèle se loue, le savoir-faire se possède » ; « Rester agnostique du modèle par construction » ; « L'IA est partout dans les entreprises, les agents presque nulle part » ; « Avant les licenciements, ce sont les prestataires qui sautent » ; « La recherche a changé de monnaie » ; « Arrêtez de demander à l'IA une chose à la fois » ; « Ce que les dirigeants achètent vraiment quand ils automatisent » ; « La feuille de route IA d'une ETI commence par les métiers, pas par l'outil » ; « Construire ses propres logiciels plutôt que tout louer : l'arbitrage que l'IA rouvre » ; « Le vrai gagnant de l'IA a de l'ancienneté » ; « Quelle base fait foi : une décision de direction, pas un chantier technique » ; « Une charte d'usage de l'IA s'écrit avec le juriste et les équipes, pas avec un modèle de document ».

### C1.6 Tests (complète §6)

Fixtures mises à jour : un article valide au gabarit C1.1 passe ; échouent avec le bon motif : titre en question, intertitre « Les enjeux », intertitre interrogatif, « nous » dans le corps, paragraphe sans fait ni source, citation entre guillemets absente de la source, source sur domaine refusé, corps de 3 000 signes, sujet recoupant une chronique presse.

---

## Correctif 2 — tests en retard sur le retrait des logos (12/11/2026)

Constat sur l'hôte (installation exacte, build vert) : 440/446, six échecs dans `tests/action-unique.test.mjs`, `tests/home-visual-layers.test.mjs` et `tests/single-page.test.mjs` (fr et en). Cause : la PR #373 du 09/11 (décision de Paul) a retiré les logos et références **Toyotomi Europe** et **Hiolle Technologies** de l'accueil ; ces tests attendent encore huit références et leurs images sources. Comme la machine rejoue toute la suite avant publication, elle serait bloquée chaque jour.

Exception explicite à « ne modifie pas les tests existants » : aligner **uniquement** ces trois fichiers sur l'état voulu par #373 : les références autorisées sont celles que la page rend aujourd'hui (sans Toyotomi Europe ni Hiolle Technologies), le compte attendu suit, la vérification des images sources ne liste plus les deux logos retirés. Lire `git show 6364fb4` pour l'état exact. Ne pas réintroduire les logos, ne pas affaiblir les autres assertions de ces tests (une action d'accueil, deux métiers, couleurs depuis les seules sources locales autorisées). Résultat attendu : `npm test` entièrement vert.
