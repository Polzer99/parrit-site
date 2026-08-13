# 05 · PROOF INVENTORY, ce qui est publiable sur les landings Paul et Maxime

> **STATUT** : V1, 2026-08-12. Écrit en lecture seule sur le canon. Aucun fichier
> de `parrit-os/canon/` n'a été modifié.
>
> **Rôle de ce document** : traduire la matrice de preuves et la porte de
> publication en un inventaire utilisable par les rédacteurs des deux landings
> personnelles. Il n'écrit pas les pages. Il dit ce qui a le droit d'y figurer,
> mot pour mot, et ce qui n'a pas le droit d'y figurer, avec la raison.
>
> **Sources primaires, lues en entier** :
> - `~/parrit-os/canon/CASE-STUDIES-EVIDENCE-MATRIX.md` (V3, 2026-08-11, R-01 à R-13)
> - `~/parrit-os/canon/PUBLICATION-GATE-ET-PAQUET-EDITORIAL.md` (V1, 2026-08-11, règles P1 à P6, table des 18 entrées, paquets R-10, R-06, R-07)
> - `~/parrit-os/canon/PREUVES.yaml` (28/07/2026, anatomie des deals clos)
> - `~/parrit-os/canon/DEAL-ROOMS.yaml` et `~/parrit-os/canon/RESSOURCES.yaml` (recherche des trois noms de la commande)
> - `~/parrit-site/content/agents/catalog.json` (catalogue public du site)
>
> **Hiérarchie appliquée** : la matrice établit ce qui est vrai. La porte de
> publication établit ce qui est publiable. `site/REFERENCES.md`, décision de Paul
> du **2026-05-25**, domine les deux sur la seule question des noms : **aucun nom
> de client sur une surface publique**, sans exception, y compris sur une landing
> personnelle. Une landing `parrit.ai/paul` ou `parrit.ai/maxime` est une surface
> publique.

---

## 0. Les six règles de la porte, rappelées parce qu'elles s'appliquent ligne à ligne

Reprises mot pour mot de `PUBLICATION-GATE-ET-PAQUET-EDITORIAL.md` §0.

| # | Règle | Ce qu'elle interdit concrètement |
|---|---|---|
| **P1** | Une entrée publique doit être reliée à un identifiant `R-*` de la matrice | Un cas ne devient pas public parce qu'il existe dans un catalogue |
| **P2** | Le statut public doit correspondre au statut vérifié | `deployed` ne peut plus servir de valeur par défaut |
| **P3** | Une preuve **L4** autorise **au plus** un cas anonymisé, **sans résultat** | Décrire un système livré, sans lui prêter d'effet |
| **P4** | Un résultat chiffré exige **L5** : valeur, période, méthode, pièce | Aucun chiffre sans ses quatre attributs |
| **P5** | Un client nommé exige **L6** ou un accord écrit explicite | Le champ `client` ne sort sur aucune surface |
| **P6** | Une entrée non réconciliée reste **hors publication** | Le silence est le comportement par défaut, pas la publication |

**La propriété qui les tient toutes** : l'échec est **fermé**. En l'absence de
réconciliation, de niveau de preuve ou d'accord, le cas ne sort pas.

**Conséquence directe pour les deux landings** :
1. Aucune réalisation ne satisfait aujourd'hui P5 par un accord écrit. **Le seul
   cas nommable de tout le corpus est R-07**, la chronique de presse, et il ne
   nomme aucun client.
2. Sur les huit réalisations L4, chaque landing peut décrire **un système livré**,
   jamais **un effet obtenu**.
3. Trois preuves seulement portent une valeur chiffrée publiable, toutes rattachées
   à R-10, et elles mesurent **la justesse d'un calcul**, pas un résultat client.

---

## 1. Les trois noms de la commande de Paul

### « Joon » : identifié, c'est **Joone**, et il faut le lire en deux dossiers

`Joon` est la variante de dictée de **Joone**, entité légale SAS NOO CORP. La
matrice l'écrit explicitement en R-03 §Identité : *« Variantes : Joone, Joon
(dictée), entité légale SAS NOO CORP »*. Wispr déforme le nom, la base tranche.

⚠️ **Le piège à ne pas reproduire** : Joone porte **deux réalisations distinctes**,
et la V1 de la matrice les confondait. La matrice interdit de les fusionner :
*« Les présenter comme un seul cas serait une faute d'analyse »* (§5).

- **R-03** : le toolkit back-office, trois tâches administratives autour de la
  prestation. **L4.** Un livrable rejeté le 07/08.
- **R-10** : l'agent de reporting financier, le cœur de métier. **L5**, le mieux
  prouvé de tout le corpus.

Les deux fiches sont en §2 ci-dessous, séparées.

### « Forexpert » : trouvé, mais **ce n'est pas une réalisation**

Recherche menée sur `~/parrit-os/` et `~/parrit-site/`. Ce qui existe :

| Trace trouvée | Chemin | Nature |
|---|---|---|
| Dossier de propale | `parrit-os/projects/forexpert-diagnostic/` : `index.html`, `propale.source.html`, `formation.source.html`, `build_protected.mjs`, `api/track.js` | **signature exacte de la propale web protégée**, §3 bis de la matrice |
| Deal room avec code d'accès | `canon/DEAL-ROOMS.yaml` L71 : « Forexpert (Dalila Depoix) », dans la liste des 29 deal rooms | avant-vente |
| Diagnostic manuel envoyé | `canon/RESSOURCES.yaml` L126 : mail « Forexpert × Parrit : le diagnostic, en attendant qu'on se parle » | artefact d'avant-vente, **fabriqué à la main par Paul** |
| Fiches prospect | `parrit-os/prospects/dalila-depoix.md` et `dalila-de-poix.md` | prospect, doublon de fiche |

**Verdict** : **aucune source primaire n'établit un système construit, livré ou
utilisé pour Forexpert.** Le dossier porte la signature de fichiers que la matrice
qualifie sans ambiguïté : *« Ce sont des artefacts d'avant-vente. Aucun n'établit
qu'un système a été construit, livré ou utilisé. Ils prouvent qu'une offre a été
formulée, rien de plus. »* Forexpert ne porte aucun identifiant `R-*`, donc **P1
et P6 le tiennent hors publication**. Il tombe aussi sous l'interdit n°12 de la
matrice : un nom de dossier `projects/` pris pour une référence.

⛔ **Non utilisable sur la page de Paul. Non utilisable sur la page de Maxime.
Sous aucune forme, y compris anonymisée**, puisqu'il n'y a rien à anonymiser.

### « Julien » : **aucune source primaire, non utilisable**

Recherche menée sur `~/parrit-os/` et `~/parrit-site/`. Deux occurrences, aucune
n'est une réalisation ni un client livré :

1. **`canon/DEAL-ROOMS.yaml` L79** : « Seelab (Mathieu/Julien/Ronan) ». C'est un
   contact dans une **deal room**, donc de l'avant-vente. Aucun `R-*`, aucun
   artefact de livraison, aucune ligne dans `PREUVES.yaml`.
2. **`parrit-site/content/agents/catalog.json` L35** : « Julien » est le **prénom
   d'un persona fictif** du catalogue public du site, illustration `julien.png`,
   étiquette « Juridique & Conformité ». **Ce n'est pas une personne réelle.**

**Verdict** : **aucune source primaire trouvée sur un « Julien » client ou projet,
non utilisable.** Il n'existe rien à publier, ni nommément, ni anonymisé.

### 🔴 Découverte incidente qui concerne directement les deux landings

La recherche de « Julien » a ouvert `parrit-site/content/agents/catalog.json`. Son
en-tête se déclare : *« Source de verite du site (home + llms.txt) »*, et il porte
**le même schéma et les mêmes entrées** que `cases.registry.json`, le risque n°1 de
la matrice, y compris la première entrée `acquisition-signal-first` en
`"status": "deployed"` avec la promesse *« RDV qualifiés, 24/7 »*.

Or la matrice établit sur ce cas (R-08) : **zéro rendez-vous tracé, compteur vide,
capture arrêtée depuis le 19/05**. Le fichier est déjà dans `parrit-site/`, donc
côté site, et il alimente aussi `llms.txt`.

**Conséquence pour la tranche** : aucune landing ne doit lire ce catalogue, ni
reprendre une de ses formulations. Toute preuve des deux pages doit venir de cet
inventaire, et de lui seul. Ce point est signalé, pas corrigé : la commande
interdit de modifier quoi que ce soit.

---

## 2. Fiches de preuve, une par réalisation candidate

Ordre : les publiables d'abord, les bloquées ensuite.

---

### R-10 · Agent de reporting financier ⭐

- **Identifiant et nom** : R-10, moteur de production du reporting mensuel, de l'export comptable brut au document diffusable. Variantes : reporting BG, « la compétence », chantier reporting-bg.
- **Source** : `canon/CASE-STUDIES-EVIDENCE-MATRIX.md` §4 fiche R-10, et `canon/PUBLICATION-GATE-ET-PAQUET-EDITORIAL.md` §2 en entier. Pièces primaires : `clients-cadrage/joone-cesar-coaching/reporting-bg/INDEX-DES-PREUVES.html` (2026-07-31), `COMPETENCE-v3.1-2026-07-31.md`, `README.md` du chantier (maj 2026-08-06).
- **Statut réel, sans lissage** : livré, passage en production daté du **2026-08-06**, **usage récurrent non constaté**. Aucune clôture postérieure n'est documentée. Au 06/08 la configuration tourne sur la machine d'un référent client, pas sur l'infrastructure cible.
- **Niveau de preuve** : **L5**. Le seul dossier du corpus où un résultat porte valeur, période, méthode et pièce ouvrable.
- **Anonymisation** : **requise**, sans exception, y compris sur un support non public, tant que l'accord écrit n'est pas obtenu (P5). Formulation anonymisée autorisée : « une PME qui rend des comptes à ses investisseurs », ou « une direction financière de PME ».
- **FORMULATION AUTORISÉE**, utilisable telle quelle :
  > « Une PME qui rend des comptes à ses investisseurs produisait sa clôture mensuelle dans un classeur que plus personne ne pouvait vérifier. Les règles de gestion ont été écrites en français, puis exécutées par un moteur rejoué sur seize mois consécutifs : sur ces seize mois, le chiffre d'affaires recalculé est identique au leur, et les contrôles passent. Le système refuse de produire une clôture s'il manque une donnée. »

  Variante courte, même socle : « Seize mois de clôture rejoués, seize fois le même chiffre d'affaires que le client. Et un système qui s'arrête plutôt que d'estimer une donnée manquante. »

  Chiffres de situation initiale autorisés, tous L5 et tous reliés à leur cellule dans l'index des preuves : **508 comptes**, **85 451 formules**, **1 254 cellules en erreur**, **59 liens vers un classeur de 2022**, **42 cellules `#REF!`** dans le cash bridge, balances arrivant avec **deux mois de retard**.
- **FORMULATION INTERDITE** :
  - ⛔ Le nom du client, sous toute forme. Raison : P5 non satisfaite, et décision du 25/05/2026.
  - ⛔ Tout gain de temps, tout pourcentage d'efficacité, tout délai avant/après. Raison : la baseline est écrite « inconnue, à reconstituer » dans le canon.
  - ⛔ « Zéro compte non mappé » **et** « 114 comptes qui ne se recomposent pas », les deux isolément. Raison : deux mesures sourcées semblent se contredire (31/07 contre 02/08) et rien n'établit qu'elles portent sur la même chose.
  - ⛔ « Installé chez le client ». Raison : blocage d'accès constaté en séance au 06/08.
  - ⛔ « Automatisé », « sans intervention », « autonome ». Raison : trois points d'arrêt humains sont des principes non négociables du système, dont un qui arrête la clôture.
  - ⛔ Toute donnée financière du client : trésorerie, dette, marges.
  - ⛔ Présenter les trois métriques comme un résultat d'affaires. Raison : elles mesurent la justesse du calcul, pas un effet chez le client. C'est une preuve de justesse.
- **Page Paul** : **oui**, c'est sa meilleure preuve. Systémique, vérifiable, et la situation initiale se raconte sans jargon.
- **Page Maxime** : **sous condition**. Utilisable seulement s'il en est l'auteur ou le porteur côté delivery, ce que cet inventaire ne peut pas établir : aucune source primaire ne nomme Maxime sur ce chantier. À trancher par Paul avant usage. Par défaut, non.

---

### R-06 · Parrit OS interne

- **Identifiant et nom** : R-06, le système d'exploitation interne de Parrit. Variantes : signals, canon, machine unifiée, cockpit.
- **Source** : matrice §4 fiche R-06, et porte de publication §3 en entier. Pièces : `canon/README.md` (2026-07-28), `tools/prooflint.py`, `tools/articlelint.py`, historique Git de `~/parrit-os-signals` (574 commits, 05/05 au 04/08/2026).
- **Statut réel** : **production interne**. Aucun chiffre d'usage, aucun gain de temps mesuré.
- **Niveau de preuve** : **L4**.
- **Anonymisation** : **non requise**, Parrit est le sujet. Mais **la nature de la preuve doit être dite dans la phrase elle-même**, sans quoi le lecteur la comptera comme un client.
- **FORMULATION AUTORISÉE** :
  > « Nous avons commencé par nous-mêmes. Notre définition de cible vivait dans 301 fichiers et trois catalogues d'offres se contredisaient sur les prix. Nous avons posé un canon unique, et des garde-fous qui bloquent la production au lieu de la commenter. C'est le système avec lequel nous travaillons tous les jours. »

  Métrique autorisée, **une seule** : « 301 fichiers portaient un bout de définition de cible, et trois catalogues d'offres coexistaient », citée **comme un état de départ constaté le 2026-07-28**, jamais comme un résultat.
- **FORMULATION INTERDITE** :
  - ⛔ Le présenter comme un cas client, ou le laisser dans une liste de clients.
  - ⛔ Tout gain de temps, toute productivité, tout « x fois plus vite ». Raison : aucune mesure n'existe.
  - ⛔⛔ Toute affirmation de résultat d'acquisition. Raison, et c'est l'interdit le plus contre-intuitif du corpus : le compteur de rendez-vous est vide, la capture de signaux est arrêtée depuis le 19/05, et le froid affiche **476 envois pour zéro réponse**. Parrit vend de l'acquisition et n'a aucune preuve d'acquisition par la machine.
  - ⛔ « Autonome ». Raison : la doctrine impose l'humain à la gâchette sur tout envoi sortant, tout prix, toute prise de parole publique.
  - ⛔ Tout coût d'exploitation, toute rentabilité. Raison : inconnu sur tous les systèmes.
  - ⛔ Le nombre de commits présenté comme une preuve de qualité ou d'usage. Il peut être cité comme volume d'activité, rien de plus.
- **Page Paul** : **oui**. C'est la preuve systémique par excellence, et elle ne dépend de l'accord de personne.
- **Page Maxime** : **sous condition**, et seulement sous l'angle « voici comment on travaille en interne », jamais comme une réalisation qu'il aurait portée. Aucune source ne le nomme sur ce système.

---

### R-07 · Chronique Le Monde Informatique

- **Identifiant et nom** : R-07, « Paralléliser le travail sans paralléliser les erreurs », volet 1 de la série graph engineering. Variante : LMI-01.
- **Source** : matrice §4 fiche R-07, porte de publication §4. Pièces : `docs/super-app/articles/LMI-01-paralleliser-sans-paralleliser-les-erreurs.md` en-têtes V5 à V7, `docs/super-app/METHODO-ARTICLES-PRESSE.md` §5.
- **Statut réel** : **publié** le 2026-08-10, confirmation du média le jour même à 15h46. Volets 2 et 3 au statut `proposé`, acceptés nommément le 03/08, **non écrits**.
- **Niveau de preuve** : **L6**, la seule du corpus.
- **Anonymisation** : **non requise**, et c'est le seul cas où P5 est satisfaite. Aucun client n'est nommé dans cette preuve, c'est un média.
- **FORMULATION AUTORISÉE** :
  > « Notre première chronique a été publiée par Le Monde Informatique le 10 août 2026. Elle est passée par le fact-checking de la rédaction, qui a demandé deux corrections avant parution. »

  Métriques autorisées, **deux et rien d'autre** : le nombre de signes (**3 592**) et la date de publication (**2026-08-10**).
- **FORMULATION INTERDITE** :
  - ⛔ Republier le texte sur nos surfaces. Raison : la consigne du média autorise la reprise **par lien uniquement**, contrainte bloquante et déjà écrite.
  - ⛔ Toute audience, portée ou retombée. Raison : aucun chiffre n'est connu.
  - ⛔ Annoncer « une série de 3 articles » comme un fait acquis. Raison : deux sur trois ne sont pas écrits, et la méthode distingue `proposé` de `publié` précisément pour empêcher cette confusion.
  - ⛔ Présenter le média comme une référence client ou un partenaire.
  - ⛔ Une publication de presse présentée comme un témoignage client. Ce n'est ni un client, ni un cas d'usage.
- 🔴 **Blocage actif** : **l'URL de parution n'est pas connue.** Sans elle, la seule preuve L6 du corpus est attestée en interne mais **non vérifiable par un tiers**, et la reprise par lien, seule autorisée, est **impossible**. Une landing qui affiche cette preuve sans lien cliquable affaiblit exactement ce qu'elle veut démontrer.
- **Page Paul** : **oui**, sous condition d'obtenir l'URL. C'est sa preuve d'autorité, signée de son nom.
- **Page Maxime** : **non**. L'article est signé Paul Larmaraud. Le porter sur la page de Maxime serait une attribution fausse.

---

### R-02 · Operating system d'un cabinet d'avocats

- **Identifiant et nom** : R-02, système d'exploitation quotidien d'un dirigeant de cabinet d'avocats. Variantes : Clevery, bot Henri.
- **Source** : matrice §4 fiche R-02. Pièces : `projects/clevery-bot/docs/INVENTAIRE-CLEVERY-2026-08-10.md` §1 (inventaire constaté machine), `projects/clevery-bot/docs/STATUS.md` brique 6g (forensic du 10/06).
- **Statut réel** : **production, usage récurrent**, mais **le flux s'est arrêté le 06/07** et l'arrêt est passé inaperçu, faute de supervision. Inventaire du 10/08 : zéro surveillance en place, **110 fiches sur 289 jamais vues** par le dirigeant.
- **Niveau de preuve** : **L5**.
- **Anonymisation** : **requise**. Formulation autorisée par `site/REFERENCES.md` : « un cabinet d'avocats ».
- **FORMULATION AUTORISÉE** :
  > « Pour un cabinet d'avocats, un dispositif qui remonte ce qui bouge sur un portefeuille de clients et n'envoie qu'après validation humaine. État constaté le 2026-08-10. »

  La date de constat fait partie de la phrase autorisée, elle ne s'enlève pas.
- **FORMULATION INTERDITE** :
  - ⛔ « 289 clients suivis ». Raison : 110 fiches sur 289 n'ont jamais été vues, la couverture réelle est partielle.
  - ⛔ Toute formulation au présent sans date de constat. Raison : deux flux documentés se sont arrêtés sans que personne ne le remarque.
  - ⛔ Les 27 % de doublons présentés comme un gain client. Raison : cette métrique mesure **un défaut du système, corrigé**. La présenter comme une performance serait un détournement.
  - ⛔ Citer « 103 événements » ou « 111 événements ». Raison : deux canons portent deux comptages différents, l'écart n'est pas tranché, **aucun des deux n'est citable seul**.
  - ⛔ Le nom du client.
- ⚠️ **Réserve à porter avant tout usage commercial** : le dirigeant du cabinet est **le père de Paul**. Ce n'est pas disqualifiant, c'est un fait qui doit être connu : un cas client dont le client est un parent ne se présente pas comme une vente conquise. **Arbitrage de Paul requis, pas de la machine.**
- **Page Paul** : **sous condition**. Excellent techniquement, mais il cumule trois réserves à porter en même temps : le lien familial, la couverture partielle, l'arrêt du 06/07. À n'utiliser qu'après arbitrage explicite de Paul.
- **Page Maxime** : **non**. Le lien familial est du côté de Paul, et le cas ne se raconte pas sans lui.

---

### R-09 · Système de veille pour un dirigeant en recherche de poste

- **Identifiant et nom** : R-09, veille sur le marché caché de l'emploi de direction, par détection de signaux. Variantes : Didier Barbanneau, veille PE, pack hands-on.
- **Source** : matrice §4 fiche R-09. Pièces : `projects/didier-barbanneau/veille-pe-n8n/DEPLOY-2026-07-13-specialty-PE.md`, `ECARTS-ET-CORRECTIFS.md` (2026-06-29), douze sauvegardes horodatées `_LIVE_BACKUP_*.json`.
- **Statut réel** : **production, usage récurrent**. Workflow n8n actif, 41 nœuds, batterie déterministe 15/15, retours client écrits et datés (mail du 07/07), recalibrage livré le 13/07. **Aucun résultat côté client** : aucun entretien, aucune candidature, aucun poste tracé.
- **Niveau de preuve** : **L4**.
- **Anonymisation** : **requise**. Formulation autorisée : « un dirigeant en recherche de poste ». Raison supplémentaire de prudence : la personne est en recherche d'emploi, ce qui dépasse la seule question contractuelle.
- **FORMULATION AUTORISÉE** :
  > « Pour un dirigeant en recherche de poste, un dispositif de veille livré, itéré sur trois mois, avec des retours écrits datés. »

  Matière éditoriale utilisable, et sourcée comme un actif plutôt qu'une faiblesse : le dossier écrit noir sur blanc qu'une cible à 100 % de contacts nommés n'est pas atteignable, *« nom quand vérifiable et indice de rôle précis sinon, pas 100 % de noms »*. Cette honnêteté est publiable.
- **FORMULATION INTERDITE** :
  - ⛔ Toute mesure d'effet : entretien obtenu, poste décroché, opportunité créée. Raison : rien n'est tracé.
  - ⛔ « Rendu autonome ». Raison : c'est une **garantie contractuelle**, pas un résultat constaté. Paul intervient à chaque recalibrage.
  - ⛔ Le nom du client.
  - ⛔ Présenter le pack comme une formation réussie. Raison : la matrice requalifie le dossier, ce n'est pas un pack de formation, c'est un produit livré.
- **Page Paul** : **sous condition**, en second rang derrière R-10. Il apporte l'usage client réel avec retours datés, que R-10 n'a pas.
- **Page Maxime** : **oui, sous condition d'anonymat strict**. C'est la preuve la plus **humaine et pédagogique** du corpus : une personne, une méthode manuelle au départ, des retours écrits, des corrections livrées. Elle raconte un accompagnement, pas une infrastructure.

---

### R-03 · Toolkit back-office d'une marque de soin

- **Identifiant et nom** : R-03, outillage de back-office et de reporting. Variantes : Joone, **Joon** (dictée), SAS NOO CORP.
- **Source** : matrice §4 fiche R-03. Pièces : `signals/clients/joone/README.md`, `signals/clients/joone/*.py`, `clients-cadrage/joone-cesar-coaching/BRIEF-CALL-REFERENTS-2026-06-11.md`, `canon/PREUVES.yaml` entrée `joone_cesar`.
- **Statut réel** : **livré, usage partiel**. **Un livrable a été rejeté par le client** au 07/08. Statut d'usage contradictoire entre deux mémoires de session, non confirmé en artefact primaire. **Lacune assumée.**
- **Niveau de preuve** : **L4**.
- **Anonymisation** : **requise**. Formulation autorisée : « une PME de biens de consommation », ou « une marque de soin ».
- **FORMULATION AUTORISÉE** :
  > « Pour une PME de biens de consommation, trois tâches administratives récurrentes outillées : émission de factures, décompte d'heures, veille hebdomadaire. »

  Détail publiable et intéressant, car il illustre la doctrine : les trois outils portent **trois points d'arrêt humains câblés dans le code**. La facture ne part jamais au client, la veille sort en brouillon, le compteur d'heures écrit à Paul.
- **FORMULATION INTERDITE** :
  - ⛔ « Automatisé » sans mention du contrôle humain.
  - ⛔ Toute affirmation d'usage récurrent. Raison : deux sources se contredisent au jour près.
  - ⛔ Toute mention de la formation comme succès. Raison : un livrable a été rejeté le 07/08.
  - ⛔ Tout montant. Raison : deux montants coexistent, 1 530 € HT et 2 160 € HT, non tranché.
  - ⛔ Le nom du client, et le mélange avec R-10.
- **Page Paul** : **sous condition**, en illustration de la doctrine « l'humain garde la gâchette », jamais comme un cas phare.
- **Page Maxime** : **oui, sous condition**. Le format « trois tâches administratives outillées » est concret, pédagogique et sans promesse. C'est un bon second exemple pour lui.

---

### R-12 · Système de veille marché pour une personne en repositionnement

- **Identifiant et nom** : R-12, veille sectorielle et détection de signaux faibles. Variantes : veille luxe, `parrit-veille-luxe`.
- **Source** : matrice §4 fiche R-12. Pièces : `~/parrit-veille-luxe/README.md`, `docs/SPEC.md`, `deploy/README.md`, `deploy/systemd/veille-luxe.{service,timer}`, `git log` (17 commits, 23 PR, 30/06 au 07/08/2026).
- **Statut réel** : **livré et déployé**, **usage client non constaté**. Le mode d'envoi par défaut est `preview`, ce qui adresse la newsletter **à Paul, pas à la destinataire**. Aucune bascule en `live` n'est établie. Statut commercial ouvert : aucun montant, aucune facture, aucun contrat trouvé.
- **Niveau de preuve** : **L4 sur la construction et le déploiement**, **L1 sur l'usage**.
- **Anonymisation** : **requise**, et deux fois plutôt qu'une : la personne est en recherche de poste, et le dossier utilise ses abonnements personnels pour franchir deux paywalls.
- **FORMULATION AUTORISÉE** :
  > « Un second dispositif de veille, construit sur la même forme, pour un autre secteur. »

  Angle éditorial réellement soutenu, et le plus intéressant de la fiche : le contrôle humain est **structurel**. Le système envoie par défaut à son opérateur, pas au destinataire final. Le passage en envoi réel est une action manuelle et séparée. Formulation autorisée : « L'humain n'est pas en aval du système, il en est la porte de sortie, fermée par défaut. »
- **FORMULATION INTERDITE** :
  - ⛔ « La newsletter part deux fois par semaine chez la cliente ». Raison : le mode par défaut adresse le mail à Paul, aucune bascule n'est établie.
  - ⛔ Toute affirmation de réception, de lecture ou de retour de la destinataire.
  - ⛔ Le secteur nommé, s'il suffit à identifier la personne combiné à « en repositionnement ».
  - ⛔ Le présenter comme une référence client. Raison : aucun prix arrêté, le dépôt le qualifie lui-même de « démo/vitrine ».
- **Page Paul** : **sous condition**, et seulement comme démonstration de discipline de livraison, jamais comme un cas d'usage abouti.
- **Page Maxime** : **non**, tant que la question 21 de la matrice n'est pas répondue. Un cas de veille dont on ne peut pas dire qu'il a été lu ne tient pas sur une page qui doit rassurer.

---

### R-13 · Super app d'acquisition mobile

- **Identifiant et nom** : R-13, boucle mobile de revue et de décision sur la file de prospection. Variantes : Mobile Acquisition Loop V0, `parrit-super-app`.
- **Source** : matrice §4 fiche R-13. Pièces : `~/parrit-super-app/docs/definition/MOBILE-ACQUISITION-LOOP-V0-HANDOFF.md` (vérifié le 2026-08-01), `deploy/docker-compose.yml`, `tests/` (18 batteries).
- **Statut réel** : **démonstrateur interne déployé en staging**, sur une URL de travail protégée par mot de passe. **Aucun usage mesuré.**
- **Niveau de preuve** : **L3-L4**.
- **Anonymisation** : **non requise**, Parrit est son propre client.
- **FORMULATION AUTORISÉE** : à n'utiliser **qu'adossée à R-06**, comme sa surface mobile, jamais seule.
  > « Le système avec lequel nous travaillons ne vit pas que dans un terminal : sa file de décisions se tranche depuis un téléphone. Version de travail interne, en ligne depuis le 1er août 2026. »
- **FORMULATION INTERDITE** :
  - ⛔ « Super app » employé seul. Raison : le mot désigne **deux choses sans rapport** dans le corpus, une application déployée (R-13) et un chantier de production éditoriale (R-07). Toute phrase publique qui l'emploie seul sera juste pour l'un et fausse pour l'autre.
  - ⛔ « En production ». Raison : une URL de staging n'est pas une mise en production.
  - ⛔ Tout chiffre d'usage, tout nombre de fiches tranchées. Raison : aucun compteur.
  - ⛔ La présenter comme un produit ou une offre.
- **Page Paul** : **sous condition**, en appui de R-06 uniquement.
- **Page Maxime** : **non**. Rien à y démontrer côté humain.

---

### R-05 · Content Factory

- **Identifiant et nom** : R-05, fabrique de contenu Parrit, trois familles.
- **Source** : matrice §4 fiche R-05. Pièces : `docs/content-factory-parrit/CONTENT-FACTORY-PARRIT.md` §2 (v2, 2026-07-19), `tools/prooflint.py`, `projects/content-factory/demo/`.
- **Statut réel** : **démonstrateur interne**, statut corrigé en V2. Rien dans les sources n'établit une production. **Aucun volume produit, aucun lead capté, aucune mesure d'audience.**
- **Niveau de preuve** : **L2-L3**.
- **Anonymisation** : non applicable, Parrit est le sujet.
- **FORMULATION AUTORISÉE**, une seule et sans chiffre :
  > « Une chaîne de production de contenu outillée en interne, avec ses gabarits et sa batterie de tests. »
- **FORMULATION INTERDITE** :
  - ⛔ « Produits chaque semaine ». Raison : c'est exactement ce qu'affirme le catalogue branché sur le site, et rien ne le soutient.
  - ⛔ Tout volume, toute cadence, toute mesure. Raison : **il n'en existe aucune**. Le document définit *comment* mesurer, il ne porte aucune mesure.
- **Page Paul** : **non**. Preuve trop faible pour une page qui doit démontrer un système.
- **Page Maxime** : **non**, pour la même raison.

---

### R-08 · Pipeline d'acquisition, courtier énergie

- **Identifiant et nom** : R-08, acquisition par signaux d'intention pour un courtier en énergie B2B. Variantes : EFI Energy, Gazelec Moins Cher.
- **Source** : matrice §4 fiche R-08. Pièces : `projects/brieuc-gazelec/00_KICKOFF_BRIEF.md`, `RDV_TRACKING.md`, `rdv_log.csv`, `PURGE_UNSUB_INCIDENT_30MAY.md`, `canon/PREUVES.yaml` entrée `gazelec_moins_cher_brieuc`.
- **Statut réel** : **livré, puis arrêté**. Capture de signaux stoppée le **19/05**. **Zéro rendez-vous tracé** : `rdv_log.csv`, désigné comme source de vérité de la métrique, ne contient que sa ligne d'en-tête. Incident du 30/05 : 128 prospects supprimés, 124 non récupérables.
- **Niveau de preuve** : **L4 sur l'argent** (3 000 € HT encaissés le 22/04, seule ligne 100 % confirmée par l'argent selon `PREUVES.yaml`), **L3 sur le système**, **L1 sur tout résultat d'acquisition**.
- **Anonymisation** : **requise**. Formulation autorisée par `site/REFERENCES.md` : « un courtier énergie B2B ».
- **FORMULATION AUTORISÉE**, sans aucun résultat :
  > « Pour un courtier en énergie, un pipeline d'acquisition livré en 2026, aujourd'hui arrêté. »
- **FORMULATION INTERDITE** :
  - ⛔⛔ Toute affirmation de rendez-vous, de pipeline ou de résultat. Raison : le compteur est vide, la capture est arrêtée depuis le 19/05, et le froid affiche **476 envois pour zéro réponse**.
  - ⛔ « 24/7 ». Raison : c'est la formulation exacte du catalogue fautif.
  - ⛔ Les 3 000 € présentés comme un résultat. C'est un setup encaissé, pas un effet.
- **Page Paul** : **non** en preuve. **Sous condition** en matière éditoriale : le canon classe explicitement « 476 envois, zéro réponse » et l'incident du 30/05 comme des **chiffres d'échec publiables**. C'est de la matière d'autorité, à condition que Paul décide de la raconter (question 20 de la matrice, ouverte).
- **Page Maxime** : **non**.

---

### R-04 · Rufus Amazon GEO

- **Identifiant** : R-04, mesure de visibilité d'une marque dans les moteurs de recommandation d'une place de marché. Lab et copropriété.
- **Source** : matrice §4 fiche R-04.
- **Statut réel** : **démonstrateur interne** sur fixtures, arrêté au 21/06.
- **Niveau de preuve** : **L2-L3**.
- **Anonymisation** : sans objet, le cas est bloqué.
- **FORMULATION AUTORISÉE** : ⛔ **aucune.**
- **FORMULATION INTERDITE** : ⛔ « SaaS », ⛔ « déployé », ⛔ les marques citées. Raison : le premier client visé figure explicitement dans la liste des interdits de `site/REFERENCES.md`, comme prospect et non comme client livré. Un démonstrateur sur données de test n'est pas un produit.
- **Page Paul** : **non**. **Page Maxime** : **non**.

---

### R-11 · Cockpit ESG d'avant-vente

- **Identifiant** : R-11, cockpit de simulation d'impact environnemental, construit pour ouvrir une conversation.
- **Source** : matrice §4 fiche R-11.
- **Statut réel** : **prototype d'avant-vente**, jamais une prestation. Rien n'établit que le prototype ait été envoyé, ouvert ou regardé.
- **Niveau de preuve** : **L2-L3**.
- **FORMULATION AUTORISÉE** : ⛔ **aucune.** Le prospect est un dirigeant nommé d'un groupe coté, l'approche était de l'outbound automatisé, et rien n'a été vendu.
- **FORMULATION INTERDITE** : ⛔ toute présentation de la réponse du dirigeant comme un intérêt client. Le brief la qualifie lui-même : *« C'est son seul engagement. Pas de promesse, pas de réunion programmée. Juste une porte entrouverte. »*
- **Page Paul** : **non**. **Page Maxime** : **non**.

---

### R-01 · CRM sur mesure, négoce

- **Identifiant** : R-01, CRM sur mesure. Variantes : Lapara, Lappara (coquille du fil mail).
- **Source** : matrice §4 fiche R-01.
- **Statut réel** : **prototype livré, puis repris par un tiers.** L'audit interne du 28/03 emploie lui-même le mot « prototype » et liste l'absence d'authentification comme bloquante pour la production. **208 commits postérieurs, dont 199 signés par un prestataire tiers, soit 96 %.**
- **Niveau de preuve** : **L4**.
- **FORMULATION AUTORISÉE** : ⛔ **aucune, même anonymisée.**
- **FORMULATION INTERDITE** : ⛔ tout, sous toute forme. Raison, et elle est bloquante : un constat daté du 2026-07-06, destiné à un conseil juridique, établit que le dépôt est passé sous le contrôle d'un prestataire tiers. **Tant que ce point est ouvert, ce cas ne figure ni sur une homepage, ni sur une landing, ni dans un lead magnet, ni dans un article, même anonymisé** : le secteur et la taille suffiraient à l'identifier. ⛔ Également interdit : « nous avons livré un CRM en production », et la valorisation interne « 18 000 € + HT », qui est une posture commerciale et jamais un prix payé.
- **Page Paul** : **non**. **Page Maxime** : **non**.

---

## 3. Tableau de recommandation, Paul contre Maxime

**Le principe de répartition** : la page de Paul démontre **un système et une
méthode**, celle de Maxime démontre **un accompagnement et une pédagogie**. Une
même preuve peut servir les deux, mais rarement sous le même angle. Aucune des
deux pages ne peut nommer un client.

| Preuve | Niveau | Page Paul | Page Maxime | Pourquoi |
|---|---|---|---|---|
| **R-10** reporting financier | **L5** | **Oui, preuve principale** | Sous condition, par défaut non | Systémique et vérifiable. C'est la seule preuve dont un tiers peut contrôler les chiffres. Aucune source ne rattache Maxime à ce chantier |
| **R-06** Parrit OS interne | L4 | **Oui, preuve de méthode** | Sous condition, angle « comment on travaille » | Zéro dépendance à un accord. Mais aucune métrique d'effet, donc jamais en tête d'argumentaire |
| **R-07** chronique LMI | **L6** | **Oui, preuve d'autorité**, dès que l'URL existe | **Non** | Signé Paul Larmaraud. Le porter chez Maxime serait une attribution fausse |
| **R-09** veille dirigeant | L4 | Sous condition, second rang | **Oui, preuve principale** | La plus humaine du corpus : une personne, des retours écrits datés, des corrections livrées. Elle raconte un accompagnement |
| **R-03** toolkit back-office | L4 | Sous condition, en illustration | **Oui, second exemple** | Concret, pédagogique, trois points d'arrêt humains câblés dans le code. Bon support pour expliquer sans promettre |
| **R-02** cabinet d'avocats | **L5** | Sous condition, arbitrage Paul | Non | Trois réserves cumulées : lien familial, couverture partielle, arrêt du 06/07 |
| **R-12** veille marché | L4 construction, L1 usage | Sous condition, discipline de livraison | Non | Aucun destinataire prouvé. Ne tient pas sur une page qui doit rassurer |
| **R-13** super app | L3-L4 | Sous condition, adossée à R-06 | Non | Staging interne sans usage mesuré |
| **R-08** courtier énergie | L4 argent, L1 résultat | Non en preuve, sous condition en matière éditoriale | Non | Les chiffres d'échec sont publiables si Paul décide de les raconter |
| **R-05** Content Factory | L2-L3 | Non | Non | Aucune mesure d'aucune sorte |
| **R-04** Rufus | L2-L3 | **Non** | **Non** | Démonstrateur sur fixtures, marque interdite |
| **R-11** cockpit ESG | L2-L3 | **Non** | **Non** | Avant-vente, dirigeant nommé d'un groupe coté |
| **R-01** CRM négoce | L4 | **Non** | **Non** | Constat juridique ouvert au 06/07 |
| Forexpert | aucun `R-*` | **Non** | **Non** | Aucune source primaire d'un système livré |
| « Julien » | aucun `R-*` | **Non** | **Non** | Aucune source primaire. Deux occurrences : un contact d'avant-vente, et un persona fictif du site |

**Le trio de la page Paul** : R-10 anonymisé, R-06, R-07. Les trois niveaux ne se
répètent pas (L5, L4, L6), les trois natures sont différentes (client anonymisé,
interne, publique), et un seul dépend d'une décision extérieure, l'accord sur R-10.

**Le duo de la page Maxime** : R-09 anonymisé, R-03 anonymisé. Les deux sont L4,
donc **P3 s'applique strictement** : décrire un système livré, sans lui prêter
aucun effet. C'est peu, et c'est exactement ce que les sources soutiennent.

⚠️ **Une limite de cet inventaire, à dire plutôt qu'à contourner** : aucune source
primaire du canon ne rattache Maxime à une réalisation `R-*`. Le canon le nomme sur
un projet, Mr Couteau, que la doctrine range **hors périmètre machine**, dans un
autre compartiment. Sa page ne peut donc pas s'appuyer sur des preuves qui seraient
les siennes. Elle s'appuie sur des preuves de Parrit, sous un angle pédagogique.
**Si Paul veut une preuve propre à Maxime, elle est à produire, pas à trouver.**

---

## 4. PROOF SLOT, ce qu'il faut obtenir et auprès de qui

Format : chaque emplacement de la page reste vide, ou porte la mention neutre
indiquée, tant que la pièce n'est pas obtenue. **Le comportement par défaut est le
silence, jamais une formulation de remplacement.**

### PROOF SLOT 01 · L'URL de parution de la chronique
**PRIMARY EVIDENCE REQUIRED.** Concrètement : l'adresse web de l'article publié le
2026-08-10 sur `lemondeinformatique.fr`. Auprès de qui : le contact rédaction du
groupe Overlord Media, par un mail de Paul. Ce qu'elle débloque : la seule preuve
L6 du corpus devient vérifiable par un tiers, et la reprise par lien, seule
autorisée, devient possible. **C'est la question la plus facile à résoudre du
corpus.** En attendant : la mention de l'article est autorisée sans lien, mais elle
perd l'essentiel de sa force. Page concernée : Paul.

### PROOF SLOT 02 · L'accord écrit du client de R-10
**PRIMARY EVIDENCE REQUIRED.** Concrètement : un accord écrit du décideur côté
client, couvrant la formulation retenue **et** les données financières citées.
Auprès de qui : le décideur du dossier, par Paul, jamais par un agent. Ce qu'elle
débloque : P5, donc le passage d'un cas anonymisé à un cas nommé, et un cran de
crédibilité sur la preuve principale. En attendant : la formulation anonymisée du
§2 s'applique, sans exception, y compris sur un support non public. Page
concernée : Paul.

### PROOF SLOT 03 · L'écart 0 contre 114 comptes sur R-10
**PRIMARY EVIDENCE REQUIRED.** Concrètement : établir si « aucun compte non mappé »
(31/07) et « 114 comptes qui ne se recomposent pas » (02/08) mesurent deux choses
différentes, ou une régression. Auprès de qui : les référents côté client qui
écrivent les règles de gestion, via Paul. Ce qu'elle débloque : rien tant qu'elle
est ouverte, **aucun des deux chiffres ne se publie**. En attendant : les trois
métriques du tableau L5 restent citables, ces deux-là non. Page concernée : Paul.

### PROOF SLOT 04 · Une clôture produite après le 06/08 sur R-10
**PRIMARY EVIDENCE REQUIRED.** Concrètement : la trace d'au moins une clôture
mensuelle produite depuis le passage en production. Auprès de qui : le référent
client détenteur de la configuration. Ce qu'elle débloque : la différence entre
« livré » et « en usage récurrent ». En attendant : ⛔ interdiction d'écrire que le
système est en usage. Page concernée : Paul.

### PROOF SLOT 05 · Un avant contre après daté sur une opération interne, R-06
**PRIMARY EVIDENCE REQUIRED.** Concrètement : une valeur, une période, une méthode
sur une opération interne mesurable, par exemple le temps de production d'un
livrable avant et après le canon. Auprès de qui : Paul lui-même, c'est la seule
preuve du corpus qui ne dépend de personne d'autre. Ce qu'elle débloque : R-06
passe de L4 à L5, et la page cesse de n'avoir qu'un seul chiffre. **C'est le PROOF
SLOT le plus rentable de la liste** : rien ne le bloque sauf la décision de poser le
compteur. Page concernée : Paul, et indirectement Maxime.

### PROOF SLOT 06 · Une preuve propre à Maxime
**PRIMARY EVIDENCE REQUIRED.** Concrètement : une réalisation dont Maxime est le
porteur documenté, avec un artefact daté, à l'intérieur du périmètre Parrit. Auprès
de qui : Paul et Maxime, à cadrer ensemble. Ce qu'elle débloque : la page de Maxime
cesse d'emprunter des preuves qui ne sont pas les siennes. ⚠️ Mr Couteau **ne
convient pas** : le canon le range hors périmètre machine, dans un compartiment
étanche. En attendant : la page de Maxime s'appuie sur R-09 et R-03, sous un angle
« voici comment on accompagne », jamais « voici ce que j'ai livré ». Page
concernée : Maxime.

### PROOF SLOT 07 · La bascule `live` de R-12
**PRIMARY EVIDENCE REQUIRED.** Concrètement : la date de bascule du mode d'envoi de
`preview` vers `live`, et une confirmation de réception par la destinataire. Auprès
de qui : Paul, qui est l'expéditeur, et la destinataire. Ce qu'elle débloque : R-12
passe de L1 à L4 sur l'usage, et le corpus gagne une **famille reproductible** de
deux cas de veille, la seule chose que Parrit a construite deux fois. Page
concernée : les deux, R-12 rejoindrait R-09 sur la page de Maxime.

### PROOF SLOT 08 · L'arbitrage de Paul sur R-02
**DECISION REQUIRED, pas une preuve.** Concrètement : Paul tranche deux points, le
lien familial et le comptage 103 contre 111 événements. Auprès de qui : Paul seul,
la machine ne peut pas s'y substituer. Ce qu'elle débloque : la seconde preuve L5
du corpus. En attendant : R-02 reste hors des deux pages.

### PROOF SLOT 09 · La décision sur les deux catalogues branchés
**DECISION REQUIRED.** Concrètement : recalibrer les `status` ou débrancher
`~/parrit-canon/client-decks/cases.registry.json` **et**
`~/parrit-site/content/agents/catalog.json`, qui portent les mêmes entrées et les
mêmes `deployed` non soutenus, y compris « RDV qualifiés, 24/7 » sur un cas dont le
compteur est vide. Auprès de qui : Paul, question ouverte depuis la V2 de la
matrice. Ce qu'elle débloque : tant qu'elle est ouverte, **le site peut publier ce
que le présent document interdit**, et les landings hériteront du même vocabulaire
si elles lisent ces fichiers. ⚠️ Ce point vaut correction du périmètre déclaré dans
la porte de publication, qui ne connaissait que le premier des deux fichiers.

---

## 5. CE QUI NE DOIT SURTOUT PAS ÊTRE DIT

Liste des affirmations tentantes que **rien ne soutient**. Chacune viendrait
naturellement sous la plume d'un rédacteur pressé. Aucune n'a de source.

**Les chiffres qui n'existent pas**

1. ⛔ **Tout gain de temps.** « X heures économisées », « la clôture passe de 5 jours à 1 », « 3 jours par mois libérés ». Aucune baseline n'existe. Le canon écrit lui-même que la baseline de délai est « inconnue, à reconstituer ».
2. ⛔ **Tout ROI, toute rentabilité, tout coût d'exploitation.** Le coût mensuel est **inconnu sur les quatre systèmes étendards**, et le canon écrit qu'il conditionne toute vente d'exploitation.
3. ⛔ **Tout pourcentage d'efficacité, tout « x fois plus vite ».** Aucune mesure d'aucune sorte.
4. ⛔ **Tout nombre de clients.** « Une dizaine de clients », « plus de 20 projets », « nos clients ». Le corpus compte **13 réalisations dont 8 seulement atteignent L4**, et deux cas clients seulement soutiennent pleinement le mot « déployé ».
5. ⛔ **Tout taux** : taux de réponse, taux de conversion, taux d'ouverture, taux de rendez-vous. Le seul chiffre de conversion sourcé du corpus est **476 envois à froid pour zéro réponse**.
6. ⛔ **Tout volume de production.** « Des contenus produits chaque semaine » : aucune mesure n'existe sur la Content Factory.
7. ⛔ **Tout chiffre d'audience** sur la chronique de presse. Aucun n'est connu.
8. ⛔ **Les 27 % de doublons présentés comme un gain.** Ils mesurent un défaut du système, corrigé.
9. ⛔ **« 289 clients suivis ».** 110 fiches sur 289 n'ont jamais été vues.
10. ⛔ **« 103 » ou « 111 » événements cités seuls.** Deux canons se contredisent, l'écart n'est pas tranché.
11. ⛔ **« Zéro compte non mappé » ou « 114 comptes ».** Les deux sont sourcés, aucun n'est citable tant que l'écart n'est pas expliqué.
12. ⛔ **La valorisation « 18 000 € + HT »** de R-01, et tout montant de deal en général. Deux montants coexistent sur au moins deux dossiers.

**Les mots qui promettent plus que les preuves**

13. ⛔ **« Autonome », « rendu autonome », « sans intervention », « pilote automatique ».** La doctrine impose l'humain à la gâchette sur tout envoi sortant, tout prix, toute prise de parole publique. Sur R-09, « rendu autonome » est une **garantie contractuelle**, pas un résultat constaté.
14. ⛔ **« Automatisé »** employé seul, sans mentionner le contrôle humain.
15. ⛔ **« Déployé », « en production », « ça tourne » au présent sans date de constat.** Deux flux documentés se sont arrêtés sans que personne ne le remarque : la veille du cabinet le **06/07**, la capture de signaux le **19/05**.
16. ⛔ **« 24/7 ».** C'est la formulation exacte du catalogue fautif, sur le cas dont le compteur est vide.
17. ⛔ **« SaaS », « notre produit », « notre plateforme ».** Un démonstrateur sur fixtures n'est pas un produit exploité.
18. ⛔ **« Transformation », « nous transformons plusieurs opérations », « accompagner la transformation »** présentés comme un cas client. **Aucune transformation multi-opérations n'a été livrée chez un client.** Les dossiers qui en portent le nom sont des propales. La seule occurrence soutenue est Parrit sur elle-même.
19. ⛔ **« Super app »** employé seul, sans préciser laquelle des deux.

**Les attributions fausses**

20. ⛔ **Tout nom de client**, sur toute surface, y compris une landing personnelle. Décision de Paul du **2026-05-25**. La procédure d'ouverture existe et exige quatre conditions cumulatives dont un accord écrit. **Aucune réalisation ne remplit aujourd'hui cette condition.**
21. ⛔ **L'Oréal et EDF.** Cités oralement le 17/07 et affichés sur un one-pager, mais `site/REFERENCES.md` note lui-même « aucune trace écrite de la mission dans l'OS à ce jour ». **L1.** À ne pas utiliser à l'écrit.
22. ⛔ **Les noms du catalogue hérité** : Lacoste, Groupe Seb, Accor, Sony Music, Showroom Privé, Virbac, Visiativ et les autres. Aucun artefact primaire de ces missions n'existe. `site/REFERENCES.md` les situe du côté d'un **partenaire**, pas de Parrit.
23. ⛔ **Tout nom de dossier `projects/` pris pour une référence** : LVMH, Kiabi, Forvia, Moët Hennessy, Décathlon, Vertbaudet, Trainline, Chronodrive, Forexpert et une vingtaine d'autres. Ce sont des **dossiers de propale**. C'est le piège le plus facile à déclencher et le plus difficile à rattraper.
24. ⛔ **Toute attribution d'un résultat commercial à la machine.** Les deals tracés proviennent, sauf un, de relations préexistantes. `PREUVES.yaml` le dit explicitement.
25. ⛔ **Une preuve interne présentée comme un cas client.** R-06 et R-13 sont Parrit sur elle-même. La nature de la preuve doit être dite **dans la phrase**, pas en note de bas de page.
26. ⛔ **Une publication de presse présentée comme un témoignage client.** R-07 n'est ni un client, ni un cas d'usage.
27. ⛔ **Un dépôt Git, un `deploy.sh` ou un timer présentés comme une preuve d'usage.** Ils prouvent qu'un système est écrit, outillé et cadencé. L'exécution et l'usage restent hors de portée.
28. ⛔ **Le CRM de R-01 sous toute forme**, y compris anonymisée, tant que le constat du 2026-07-06 est ouvert.
29. ⛔ **Une preuve de Parrit attribuée personnellement à Maxime**, ou l'inverse. Aucune source ne rattache Maxime à une réalisation `R-*` du périmètre.
30. ⛔ **Un témoignage, une citation ou un verbatim client.** Aucun n'est disponible avec un accord. Les verbatims des transcripts sont de la matière interne, pas du contenu publiable.

---

## 6. Ce que cet inventaire n'a pas fait

- Il n'a modifié **aucun** fichier du canon, ni du site, ni des deux catalogues.
- Il n'a produit **aucun copywriting** : les formulations autorisées sont reprises
  ou dérivées mot pour mot des paquets éditoriaux sourcés, jamais réécrites pour
  sonner mieux.
- Il n'a **rien conclu hors source** : chaque statut vient de la matrice, chaque
  interdit de la porte de publication ou de la matrice, chaque recherche de nom est
  rapportée avec son résultat, y compris quand ce résultat est « rien ».
- Il n'a **rien inventé sur Forexpert ni sur Julien**. Les deux sont déclarés non
  utilisables, avec le détail de ce qui a été trouvé.

*Document de qualification éditoriale. Lecture seule sur le canon.*
