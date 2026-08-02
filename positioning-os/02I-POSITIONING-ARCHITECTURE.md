# 02I · Architecture du positionnement

01/08/2026. Les couches du positionnement, sous la décision de fondateur consignée dans `02H-FOUNDER-VISION.md`.

Ce document ne produit ni slogan, ni copy de site. Il définit ce que chaque couche doit accomplir, pour que la rédaction se fasse ensuite sans rejouer les arbitrages.

---

## 1. Catégorie mentale recherchée

Parrit.ai doit devenir **l'entreprise qu'on pense à appeler pour intégrer l'IA correctement dans son entreprise**.

La catégorie porte sur **l'intégration réussie**, pas sur la technologie. Elle se joue sur trois mots que le marché n'occupe pas ensemble : décider, construire, faire adopter.

Trois places sont déjà prises et ne sont pas la nôtre. Celle de l'outil, occupée par les logiciels. Celle du cours, occupée par les organismes de formation. Celle du rapport, occupée par le conseil. La place visée est celle de **la personne à qui on confie le sujet**.

La formulation exacte n'est pas écrite ici. Trois contraintes s'imposent à celui qui l'écrira : elle doit être comprise sans traduction par quelqu'un qui commence à peine ; elle ne doit pas promettre un résultat non mesuré ; et elle doit survivre au fait que sur le terrain, le mot « IA » déclenche une mauvaise expérience chez quatre personnes sur cinq.

---

## 2. Promesse de surface

**Ce qu'une personne peu mature doit comprendre en cinq secondes** : qu'elle peut confier son sujet à quelqu'un qui va lui dire quoi faire en premier, le construire, et le faire fonctionner chez elle.

Elle ne doit avoir besoin de comprendre ni l'agentique, ni les outils de développement assisté, ni les modèles, ni l'architecture technique. Aucun de ces mots ne doit être nécessaire à la compréhension.

**Trois choses doivent passer.** Ce qu'elle obtient, concrètement, et sous quel délai. Ce qu'elle doit fournir de son côté. Ce qui se passe ensuite, c'est-à-dire qu'elle garde la main.

**Trois choses ne doivent pas y être.** Un chiffre de gain, tant qu'aucun n'est mesuré. Un vocabulaire de spécialiste. Une liste de technologies.

**Le test de recevabilité** : une personne qui utilise un assistant conversationnel de temps en temps doit pouvoir répéter la promesse à quelqu'un d'autre sans se tromper. Si elle ne le peut pas, la promesse est trop profonde pour la surface.

---

## 3. Mécanisme distinctif

Sept étapes. C'est le mécanisme qui différencie, pas la technologie.

1. **Comprendre le niveau et le besoin.** Où en est l'entreprise, ce qui coince, ce que ça coûte, qui décide.
2. **Choisir le bon premier chantier.** Six critères : pénibilité, temps passé, technicité, accès à la donnée, réversibilité, place de l'humain. C'est l'étape que personne d'autre ne vend et qui porte le plus de valeur.
3. **Construire**, sur les vraies données du client, pas sur un cas d'école.
4. **Mettre en fonctionnement** dans son environnement réel.
5. **Itérer.** Deux à quatre semaines, annoncées d'emblée comme une constante et non comme un aléa. C'est un argument, pas une excuse : ceux qui promettent l'installation immédiate produisent la déception que le marché nous renvoie ensuite.
6. **Faire adopter.** Les points de validation humaine, la trace de qui a validé quoi, la formation des personnes qui s'en servent.
7. **Opérer ou transférer.** La décision appartient au client, elle se prend à la fin, et elle est tarifée séparément.

**Ce qui rend le mécanisme crédible** : l'étape 2 s'appuie sur une règle explicite. On automatise ce qui est répétitif, fréquent, à règles claires, avec des données disponibles, **et où une erreur se rattrape**. On garde l'humain sur le rare, le nouveau, le jugement, et ce qui coûte cher.

---

## 4. Échelle d'offres par maturité

Cinq marches. Ni les noms ni les prix ne sont fixés ici. Ce qui est fixé, c'est **ce que chaque marche doit produire** et **ce qui autorise à passer à la suivante**.

| Marche | Ce que le client obtient | Ce qui autorise la marche suivante |
|---|---|---|
| **Commencer** | Il voit ce que ça change chez lui, sur son propre cas, en séance | Il identifie un processus qui coince et peut le chiffrer |
| **Premier système** | Une chose qui tourne seule et produit un résultat visible chaque semaine | Le système est utilisé sans qu'on le rappelle |
| **Fonction transformée** | Une chaîne complète outillée, avec ses validations et sa mesure | Un résultat est mesuré sur cette fonction |
| **Entreprise transformée** | Plusieurs fonctions branchées entre elles | Le client veut piloter l'ensemble depuis un seul endroit |
| **Operating System** | Il supervise activité, agents, validations et résultats depuis sa propre interface | — |

**État de preuve, à ne pas masquer.** Les marches 2 et 3 sont démontrées chez des clients. La marche 4 ne l'est pas. La marche 5 existe en interne et **aucun client ne l'a vue**. L'échelle est une architecture, pas un catalogue de choses vendues.

**Sept portes d'entrée** peuvent mener aux marches 1 et 2 : la veille, un agent mail, une session de construction accompagnée, un prototype fonctionnel, un système de croissance, un outil métier, une formation qui se termine avec un agent qui marche. Elles sont interchangeables du point de vue de la méthode. **La porte ne dit pas ce qu'on est.**

---

## 5. Signal de profondeur

Ce que le site et les contenus doivent révéler **progressivement**, à mesure que le visiteur descend, sans que rien n'en soit exigé en surface.

**Ce qui se montre.** Une méthode de décision qui a des critères écrits, pas une intuition. Des systèmes en production chez des clients, décrits par leur fonction. Un travail piloté au langage naturel, où la machine exécute des chaînes complètes et pas des complétions. Une discipline d'ingénierie où les contrôles bloquent la livraison au lieu de la signaler. Des règles internes nées d'incidents réels, et le fait qu'on les a écrites plutôt que subies. Une convention de preuve qui déclare les cases vides au lieu de les remplir.

**Comment le montrer.** En donnant à voir le geste, jamais en le revendiquant. Une capture d'un point de validation, la liste des six critères de sélection, un extrait de règle avec l'incident qui l'a produite. La profondeur se démontre par des objets, pas par des adjectifs.

**Interdits.** Toute affirmation d'avance sur le marché. Toute statistique d'échec du secteur. Tout empilement de noms d'outils. La profondeur qui se déclare devient de la posture.

---

## 6. Signal de largeur

Montrer qu'on travaille sur des problèmes très variés, **sans jamais écrire qu'on peut tout faire**.

**La méthode : les familles de preuves.** On ne liste pas des clients ni des secteurs, on liste des **types de problèmes résolus**, chacun adossé à un cas réel et anonymisé conformément aux règles internes.

Quatre familles sont soutenues aujourd'hui par des systèmes livrés : préparer une décision commerciale à partir d'un fichier trop gros pour être lu ; faire arriver chaque semaine une information de niche sans que personne ne la cherche ; trier ce qui arrive et préparer une réponse qu'un humain signe ; donner à une entreprise un outil métier qui n'existait dans aucun logiciel du marché.

**Ce que la largeur ne doit jamais devenir.** Une grille de fonctions métier, qui rejoue le catalogue. Une liste de secteurs, qui installe une spécialisation non prouvée. Un nombre d'artefacts : la quantité de briques n'a jamais été une capacité.

**La phrase de cadrage à tenir** : les problèmes sont différents, la méthode est la même. C'est la méthode qui porte la largeur, pas l'inventaire.

---

## 7. Structure de confiance

Ce qui doit rassurer quelqu'un qui débute, dans l'ordre où il se pose les questions.

**« Vais-je me tromper ? »** On répond par les erreurs déjà commises : quarante-huit règles internes, chacune née d'un incident payé. Le client n'a pas à refaire ce chemin.

**« Comment ça se passe ? »** Par la méthode en sept étapes, annoncée à l'avance, avec un périmètre écrit avant de commencer.

**« Vais-je être largué ? »** Par la progression : on entre au niveau du client, on ne saute pas de marche, et rien ne l'oblige à comprendre la technique.

**« Est-ce que ça va partir sans moi ? »** Par la validation humaine : rien ne sort vers l'extérieur sans relecture, et la trace dit qui a validé quoi. C'est ce que trois clients ont demandé spontanément, avec leurs propres mots.

**« Que devez-vous voir de chez moi ? »** Par des accès graduels : on demande ce qui est nécessaire à l'étape en cours, pas tout au début.

**« Et si ça tourne mal ? »** Par la sécurité et la réversibilité, qui doivent être écrites avant d'être promises. **C'est le point faible actuel** : aucune exigence minimale de sécurité n'est formalisée, et un cadre de responsabilité existe sans avoir jamais été opposé à personne. À traiter avant de s'adresser à des métiers sensibles.

**« Serai-je coincé ? »** Par l'absence de dépendance artificielle : ce qui est construit reste au client, et la sortie est une décision qu'il prend, pas une porte qu'on lui ferme.

---

## 8. Transformation de marque recherchée

**Avant.** Le visiteur pense que l'IA est un outil qu'il utilise mal, ou une promesse dont il s'est déjà méfié. Il a entendu qu'il faut s'y mettre. Il ne sait pas par quoi commencer, il craint de payer pour un cours ou pour un rapport, et il a peut-être déjà été déçu.

**Après.** Il pense qu'il existe quelqu'un à qui confier le sujet. Il a compris qu'on commence petit et concret, que ça se voit vite, et qu'il garde la main. Il ne sait toujours pas ce qu'est un agent, et ça n'a aucune importance.

**Le déplacement visé** : passer de « il faut que je m'y mette » à « je sais à qui en parler ».

---

## 9. Risques de positionnement

| Risque | Ce qui le déclenche | Contre-mesure |
|---|---|---|
| **Devenir générique** | Promettre l'intégration de l'IA sans mécanisme visible | Le mécanisme en sept étapes et les six critères de sélection, montrés et non revendiqués |
| **Paraître trop complexe** | Faire remonter la profondeur en surface | Le test de répétition : une personne peu mature doit pouvoir redire la promesse |
| **Promettre trop** | Écrire l'ambition à dix-huit mois comme un résultat | Aucun chiffre de gain avant qu'un seul soit mesuré chez un client |
| **Être pris pour une formation** | Entrer par la pédagogie et s'arrêter là | Toute session se termine par un objet qui tourne, et cela doit d'abord être vrai |
| **Être pris pour une agence d'automatisation** | Vendre des connexions entre outils | Mettre l'étape de décision devant l'étape de construction |
| **Être pris pour un cabinet** | Vendre un cadrage sans livraison | Une chose qui tourne avant toute recommandation |
| **Être pris pour une solution prête à l'emploi** | Laisser croire à l'installation immédiate | Annoncer les deux à quatre semaines d'itération d'emblée, comme un choix |

**Un risque supplémentaire, propre à ce positionnement.** En s'adressant du débutant à l'entreprise avancée, la marque peut donner l'impression de ne s'adresser à personne. La réponse n'est pas de réduire l'ambition mais de tenir deux niveaux de lecture séparés : la surface parle au débutant, la profondeur parle à l'avancé, et rien de la profondeur n'est exigé pour comprendre la surface.

---

## 10. Décisions nécessaires avant le copywriting

1. **La catégorie publique** : ce qui est écrit en haut de page, et si le mot « IA » y figure.
2. **La promesse de surface** en une phrase, validée par le test de répétition.
3. **Les deux régimes de sortie**, nommés et tarifés séparément.
4. **La porte d'entrée poussée en premier** parmi les sept, et ce qu'elle produit exactement.
5. **Les familles de preuves retenues** pour la largeur, et leur formulation anonymisée.
6. **Le socle de sécurité et de réversibilité**, écrit avant d'être promis.
7. **Le résultat client mesuré en premier**, et chez qui. Sans lui, la couche de profondeur reste déclarative.
