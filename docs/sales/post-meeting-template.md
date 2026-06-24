# Template post-meeting personnalise

Date : 2026-06-24
Statut : template interne
Usage : suite de rendez-vous, personnalisation par personne rencontree

Ce document sert a produire une suite de meeting claire : mail, mini-presentation, note partageable ou base de propale privee. Il transforme les informations du rendez-vous en proposition de valeur personnalisee, sans prix et sans nom client tant que le support n'est pas protege.

## Donnees a renseigner

| Champ | Exemple |
|---|---|
| `{prenom}` | Claire |
| `{entreprise}` | Entreprise X |
| `{persona}` | DAF, DG, CCO, DRH, DSI... |
| `{moment}` | apres cloture, avant lancement marche, avant COMEX... |
| `{douleur_1}` | trop de ressaisie entre outils |
| `{douleur_2}` | pas de vision claire sur les relances |
| `{risque}` | donnee sensible, adoption equipe, controle interne |
| `{front_1}` | operations / back-office |
| `{front_2}` | revenu / visibilite / pilotage |
| `{use_case_prioritaire}` | tri des reclamations, scan Rufus, relances clients... |
| `{outil_existant}` | ERP, CRM, Google Sheet, messagerie, outil metier... |
| `{decisionnaire}` | Paul, sponsor metier, DSI, associe... |
| `{prochaine_etape}` | atelier de cadrage, scan, cartographie process... |

## Structure recommandee

### 1. Accroche mail

Objet possible :

- Suite a notre echange : premier chantier agentique pour `{entreprise}`
- `{prenom}`, la premiere marche concrete pour `{use_case_prioritaire}`
- Synthese rapide : ce que Parrit peut faire avec `{entreprise}`

Corps court :

> Bonjour `{prenom}`,
>
> Merci pour l'echange. J'ai repris ce que vous avez partage : `{douleur_1}`, `{douleur_2}`, et la contrainte importante autour de `{risque}`.
>
> La bonne premiere marche n'est pas de tout transformer. C'est de choisir un flux qui compte, le faire tourner, mesurer ce que ca change, puis etendre.
>
> Je vous ai mis ci-dessous une proposition de cadrage simple : votre realite, deux fronts possibles, le cas d'usage prioritaire et la suite concrete.
>
> Paul

### 2. Votre realite

Template :

> Vous etes dans un moment ou `{moment}`. Le sujet n'est pas seulement "faire de l'IA". Le sujet est de retirer de la charge operationnelle la ou elle s'accumule, sans perdre le controle sur `{risque}`.
>
> Ce qu'on a entendu : `{douleur_1}`. Et derriere : `{douleur_2}`.
>
> Notre lecture : le bon chantier n'est pas le plus spectaculaire, c'est celui qui peut devenir un flux fiable dans votre quotidien.

### 3. Les deux fronts possibles

Template :

| Front | Ce qu'on attaque | Exemple de resultat visible |
|---|---|---|
| `{front_1}` | Les taches repetitives, les entrees dispersees, les validations qui saturent l'equipe. | Une file claire : entree -> tri -> action proposee -> validation humaine. |
| `{front_2}` | Le revenu, la visibilite, le pilotage ou la decision. | Un signal detecte, une action preparee, une mesure suivie. |

Phrase de liaison :

> On peut travailler les deux, mais on ne commence pas par les deux. On choisit le front ou l'impact sera le plus visible pour vos equipes et le plus defendable pour vos decideurs.

### 4. Le cas prioritaire

Template :

> Le premier cas que je proposerais de cadrer est `{use_case_prioritaire}`.
>
> Aujourd'hui, il ressemble a ceci : `{outil_existant}` recoit ou produit l'information, plusieurs personnes interviennent, et une partie du travail repose sur de la vigilance humaine.
>
> Demain, le flux peut ressembler a ceci :
>
> 1. Les entrees arrivent dans une base ou une file unique.
> 2. L'agent classe, enrichit et prepare l'action.
> 3. Les cas sensibles remontent a l'humain.
> 4. Chaque action garde une trace.
> 5. On mesure le temps rendu, les erreurs evitees ou la qualite du suivi.

### 5. Avant / apres

| Avant | Apres |
|---|---|
| Information eparpillee entre outils, personnes et canaux. | Source de verite claire, exploitable par l'equipe. |
| Decisions retardees par la ressaisie ou le tri manuel. | Agent sur le repetitif, humain sur la decision. |
| Peu de mesure sur la charge reelle. | Volume, temps, escalades et actions suivis. |
| Effet vitrine difficile a defendre. | Flux operationnel que l'on peut montrer et ameliorer. |

### 6. Ce que Parrit fait concretement

Template :

> Parrit intervient comme operating partner agentique :
>
> - Paul cadre le cas d'usage, prototype le flux et garde le lien avec la decision metier.
> - Yukun met en production proprement, avec les integrations, les garde-fous et la maintenabilite.
> - Vos equipes gardent la main : validation humaine, trace des actions, transfert progressif.
>
> Le livrable n'est pas un document de plus. C'est un flux qui tourne, puis une equipe capable de le superviser.

### 7. Proposition de premiere marche

| Etape | Contenu | Sortie |
|---|---|---|
| Cadrage | Cartographier `{use_case_prioritaire}`, ses entrees, ses sorties, les exceptions et les validations. | Schema du flux cible + priorite de deploiement. |
| Construction | Construire la premiere version sur les outils existants, sans changer le coeur du systeme. | Agent ou workflow supervise sur un perimetre clair. |
| Mise sous controle | Ajouter validation humaine, journal d'actions, indicateurs et transfert a l'equipe. | Flux operable et decision sur l'extension. |

### 8. Ce dont on a besoin

Template :

> Pour avancer proprement, il nous faudrait :
>
> - un exemple reel de `{use_case_prioritaire}` ;
> - les canaux d'entree et l'outil de destination ;
> - les regles de validation ou d'escalade ;
> - le niveau de sensibilite de la donnee ;
> - la personne qui valide cote `{entreprise}`.

### 9. CTA

Options :

- "Je vous propose un atelier de 45 minutes pour cartographier ce flux avec un exemple reel sous les yeux."
- "On peut commencer par un scan limite, puis decider si le chantier merite d'etre mis en production."
- "La prochaine etape utile : choisir le cas, les donnees accessibles et la personne qui valide."

## Variantes par persona

### DG / CEO

Angle : priorisation, marge, temps equipe.

Phrase a utiliser :

> Le risque, pour une direction generale, est de laisser l'IA au niveau des idees. La valeur apparait quand un premier flux concret tourne dans l'entreprise et donne une methode pour les suivants.

Premiers cas :

- back-office multi-canal ;
- qualification commerciale ;
- reporting dirigeant ;
- veille marche.

### Owner e-commerce

Angle : temps fondateur, SAV, relances, dependance agence.

Phrase a utiliser :

> Le premier gain n'est pas de remplacer votre jugement. C'est de sortir le fondateur des taches qui reviennent tous les jours : recopier, trier, relancer, repondre aux memes demandes.

Premiers cas :

- capture TikTok / Snap / site / telephone ;
- relances WhatsApp ;
- tri SAV ;
- newsletter de marque.

### Avocat / cabinet

Angle : secret professionnel, qualite, temps facturable.

Phrase a utiliser :

> L'agent ne tranche pas. Il pousse les signaux, prepare la premiere passe et garde une trace. L'avocat garde la decision.

Premiers cas :

- veille clients et dossiers ;
- sources officielles ;
- pre-structuration d'actes ;
- supervision humaine.

### Expert-comptable

Angle : collecte, rapprochement, echeances, temps conseil.

Phrase a utiliser :

> Le sujet n'est pas de remplacer le collaborateur. C'est de transformer la chasse aux pieces en file de validation, pour rendre du temps a la revision et au conseil.

Premiers cas :

- collecte multi-canal ;
- detection des manquants ;
- pre-rapprochement ;
- veille conseil client.

### CDO / transformation / innovation

Angle : passage en production, autonomie, gouvernance.

Phrase a utiliser :

> La question n'est pas de produire une demonstration supplementaire. La question est de choisir un cas metier, le faire tourner dans votre environnement, puis rendre vos referents capables de le porter.

Premiers cas :

- pilote metier ;
- agent sur couche interne ;
- formation referents ;
- revue d'alignement.

### COO

Angle : process, terrain, ressaisie, delais.

Phrase a utiliser :

> On part du geste qui se repete tous les jours. L'agent prend le tri et la preparation. L'equipe garde l'exception, la decision et la relation.

Premiers cas :

- reclamations ;
- commandes ;
- alertes rupture ;
- synchronisation entre outils.

### DAF / CFO

Angle : controle, piste d'audit, cloture, ROI defendable.

Phrase a utiliser :

> Le flux doit etre mesurable et controlable. Chaque proposition doit laisser une trace, chaque validation reste humaine, et chaque gain se defend process par process.

Premiers cas :

- rapprochement ;
- relances clients ;
- reporting ;
- controle processus.

### DRH

Angle : adoption, peur equipe, formation utile, back-office.

Phrase a utiliser :

> La formation fonctionne quand elle produit un outil utile au quotidien. On forme vos referents sur vos cas, puis ils deviennent capables d'accompagner les autres.

Premiers cas :

- tri CV ;
- reponses candidats ;
- onboarding ;
- FAQ paie ;
- cascade referents.

### DSI / CIO

Angle : securite, SI critique, souverainete, gouvernance.

Phrase a utiliser :

> On ne touche pas au coeur du SI. On orchestre les process satellites avec environnements separes, journaux d'audit, acces controles et modele au choix.

Premiers cas :

- agents sur outils satellites ;
- journaux d'audit ;
- controle acces ;
- transfert equipe.

### Directeur commercial

Angle : signaux d'achat, pipeline, qualite de contact.

Phrase a utiliser :

> Le but n'est pas d'envoyer plus. Le but est de contacter mieux : au bon moment, sur un signal reel, avec une validation humaine avant toute action sensible.

Premiers cas :

- veille comptes ;
- enrichissement ;
- sequences personnalisees ;
- relances des non-reponses.

### CMO

Angle : voix de marque, cadence, visibilite IA.

Phrase a utiliser :

> La content factory ne remplace pas la marque. Elle transforme votre expertise en actifs repetables, mesurables et adaptes aux moteurs de recherche classiques comme aux reponses IA.

Premiers cas :

- articles ;
- posts ;
- videos ;
- mesure citations ;
- localisation multilingue.

### Directeur juridique

Angle : contrats, RGPD, veille, goulot d'etranglement.

Phrase a utiliser :

> L'agent fait la premiere passe. Il marque les clauses, classe les risques et remonte la veille. La decision reste juridique.

Premiers cas :

- revue contrats ;
- matrice de risque ;
- veille reglementaire ;
- pre-annotation.

### Directeur e-commerce retail

Angle : Rufus, part de voix, catalogue, service client.

Phrase a utiliser :

> On ne se limite pas a observer la visibilite. On mesure la presence par question, on identifie ou la marque decroche, on propose les corrections exactes, puis on re-mesure.

Premiers cas :

- scan Rufus ;
- correction fiche produit ;
- service client ;
- relances multi-canal.

## Ressources a joindre selon le cas

| Situation | Ressource |
|---|---|
| Prospect au stade decouverte | Fiche "De l'IA generative a l'IA agentique" + carte des 7 niveaux. |
| Prospect avec douleur operationnelle | Mini-schema avant/apres du flux prioritaire. |
| Prospect dirigeant | Note 1 page : deux fronts, premiere marche, risque traite. |
| Prospect grand groupe | Note securite / gouvernance : agnostique, donnees chez vous, coeur intact. |
| Prospect commercial / marketing | Exemple de boucle signal ou content factory. |
| Prospect e-commerce | Exemple scan Rufus ou back-office client a volume. |
| Deal chaud | Page propale privee chiffree avec prix, codes nominatifs et tracking. |

## Checklist avant envoi

- Le document parle de la personne rencontree avant de parler de Parrit.
- Un avant/apres concret apparait dans la premiere moitie.
- Le cas d'usage prioritaire est nomme.
- Le prochain pas est une action simple, pas une decision lourde.
- Aucun prix, aucun nom client, aucune promesse de resultat garanti.
- Les mots bannis ne sont pas presents.
- Le support peut etre transforme en page propale privee si le deal devient chaud.
