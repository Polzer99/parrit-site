# G14 · QA CONVERSION

**Nœud :** G14 · **Owner :** relecteur conversion indépendant · **Date :** 12/08/2026

Ce document note. Il ne valide pas. Chaque note est ancrée sur une capture prise
et regardée. Rien n'est noté qui n'ait été vu.

---

## 0. État des captures, à lire avant les notes

Quatre captures étaient demandées. **Deux seulement ont pu être prises.**

| Cible demandée | nodeId | Résultat |
|---|---|---|
| Landing Paul, desktop 1440 | `41:2` | **Vue**, pleine page 1440 × 4696, plus le hero `41:7` en résolution lisible |
| Landing Maxime, desktop 1440 | `45:2` | **Vue**, pleine page 1440 × 5318, plus le hero `45:7` en résolution lisible |
| Page mobile 390, les deux versions | `17:8` | **Node introuvable.** Non vu, non noté |
| Page funnel | `53:2` | **Node introuvable.** Non vu, non noté |

Deux faits à consigner, parce qu'ils changent la portée de cette revue.

**Le fichier a été démonté pendant la relecture.** À 15h5x, `get_metadata` sur
`41:2` rendait l'arbre complet des huit sections. Quelques minutes plus tard, le
nœud `44:43` lu dans ce même arbre renvoyait « node not found », puis `41:2`
lui-même, puis `45:2`. `get_metadata` sans nodeId ne liste aujourd'hui qu'une
seule page, `0:1 · 00 — START HERE`, qui contient une note de cadrage en anglais
et aucune maquette.

**Conséquence.** Les notes ci-dessous portent sur un état daté du 12/08 vers
15h55, qui n'est plus dans le fichier. Elles sont vraies de ce que j'ai vu.
Elles doivent être rejouées sur les frames reconstruites avant tout gate.

Le mobile et le funnel restent **non notés**. Une note inventée sur une page non
vue vaudrait moins que rien.

---

## 1. Page Paul, desktop 1440

Ce que la capture montre, dans l'ordre : header `PARRIT` avec un bouton rouge à
droite, hero sur fond encre, `Ce que j'entends le plus souvent`, `Trois sujets
qu'on prend souvent en premier`, `Un cas, en entier`, `Comment ça se passe`,
`Ce que vous saurez faire après`, `L'offre`, `On commence par choisir le sujet`,
footer. Huit sections, pas une de plus.

| Critère | Note | Justification, ancrée sur la capture |
|---|---:|---|
| Clarté de la promesse | **7/10** | Le sous-titre est net et concret : un sujet qui coûte du temps, construit sur vos vraies données, vous repartez avec quelque chose qui tourne. Mais le titre dépense ses onze mots sur le constat, `Il faut vous y mettre. Reste à choisir par quoi commencer.`, pas sur la promesse, et **le mot « Paul » n'apparaît nulle part dans le premier écran** : le header dit `PARRIT`. Le visiteur ne sait pas qu'il est sur une page personnelle |
| Compréhension de la valeur | **8/10** | Le sous-titre porte l'input, la méthode et l'output en une phrase de trente et un mots. La section 6 dit précisément ce que le visiteur saura faire : ouvrir le système, voir ce qu'il a fait, corriger une règle, l'expliquer. C'est au-dessus du seuil, tenu par le texte seul |
| Progression du funnel | **8/10** | Les huit sections sont dans l'ordre du document M1, le prix arrive après la preuve et la méthode, la conversion ferme. Le maillon faible est la section 4 : au format pleine page, `Un cas, en entier` se lit comme un mur de mono dense sur fond sombre, au moment exact où le doute est le plus fort |
| Placement du prix | **9/10** | `2 500 € HT` apparaît une seule fois, dans la carte de la section 7. Absent du hero, du header, de toute barre. Vérifié sur la pleine page |
| Force de la preuve | **5/10** | La section 4 affiche la carte de preuve **et, à côté d'elle, un encadré rouge vide** portant un `PROOF SLOT`. Le hero affiche un second bloc vide de 440 × 520 marqué `PHOTO SLOT · Portrait documentaire de Paul`. Une preuve seule flanquée d'un trou déclaré compte moins qu'une preuve seule |
| Lisibilité de l'offre | **8/10** | Une carte, un prix, ce qui est inclus, pas de palier, pas de « à partir de ». La colonne de droite ajoute la phrase la plus forte de la page : `Si je pense qu'un sujet ne mérite pas d'être construit, je vous le dis avant de commencer.` |
| Évidence du CTA | **9/10** | `Cadrer mon premier cas`, rouge plein, même libellé et même largeur en header, en hero, dans la carte d'offre et en section 8. Impossible de le manquer, impossible de le confondre avec autre chose |
| Absence de friction | **7/10** | Aucun formulaire, aucune newsletter, micro-copie rassurante à deux endroits, `sans engagement` et `Rien à préparer`. Deux frictions réelles : les deux emplacements vides visibles, et **aucun calendrier dans la page** alors que le funnel en prévoyait un en section 8. Le clic mène hors champ |

**Aucune note bloquante sous le seuil sur cette page.**

---

## 2. Page Maxime, desktop 1440

Ce que la capture montre : header `MAXIME · PARRIT`, hero sur crème avec un
grand bloc à gauche et le copy à droite, puis les mêmes huit sections que Paul,
retitrées.

| Critère | Note | Justification, ancrée sur la capture |
|---|---:|---|
| Clarté de la promesse | **8/10** | `Comprendre ce que l'IA peut faire chez vous, en le construisant` dit la promesse et le différenciateur dans le même souffle. L'identité est posée deux fois, dans le header et dans `Je m'appelle Maxime` |
| Compréhension de la valeur | **7/10, SOUS LE SEUIL** | Le texte fait le travail. **L'écran ne le fait pas.** Le tiers gauche du premier écran est un rectangle vide de 480 × 600 qui affiche en rouge `PORTRAIT SLOT · IMAGE REQUISE` et la phrase `Cet écran ne fonctionne pas sans ce portrait`. La maquette a raison. En cinq secondes, l'élément visuel dominant de la page annonce que la page n'est pas finie |
| Progression du funnel | **6/10, SOUS LE SEUIL** | La chaîne casse au maillon 4. Dans `Un exemple réel, raconté sans arrondi`, la **position de preuve principale, à gauche, est un encadré vide** qui déclare `PRIMARY EVIDENCE REQUIRED` et `Aucune source du canon ne rattache aujourd'hui Maxime à une réalisation`. Le visiteur arrive au moment où il cherche une raison de croire et trouve un aveu |
| Placement du prix | **9/10** | `2 500 € HT` une seule fois, section 7, sous le titre `Dix heures avec moi, sur votre sujet`. Rien avant |
| Force de la preuve | **4/10** | Les deux éléments présents en section 4 sont des preuves de **Parrit**, le dispositif de veille et la PME de biens de consommation. Aucune n'est celle de Maxime, et la maquette l'écrit elle-même à l'écran. C'est honnête, et c'est faible |
| Lisibilité de l'offre | **8/10** | Même clarté que sur Paul, avec l'exclusion dite en face de la carte : `Aucun abonnement, aucun forfait de suite imposé.` Une seule décision à prendre |
| Évidence du CTA | **9/10** | `Trouver par où commencer`, rouge plein, quatre emplacements, un seul libellé, une seule destination |
| Absence de friction | **7/10** | `En visio. Rien à préparer, rien à installer.` est la meilleure micro-copie des deux pages. Pénalisé par les deux emplacements vides et par l'absence de calendrier en section 8 |

### Ce qu'il faut changer, précisément

**Compréhension de la valeur, 7/10.** Faire la photo. Portrait de Maxime, buste,
lumière naturelle, regard caméra, tenue de travail, comme le brief de
l'emplacement le demande. Tant qu'elle n'existe pas, cette page ne se publie
pas : elle ne peut pas se rattraper par le texte, puisque la différence
assumée entre les deux pages est justement la place du visage. Si la photo ne
peut pas être faite cette semaine, la seule alternative acceptable est de
redessiner le hero en une seule colonne pleine largeur, sans emplacement vide,
et d'assumer une page sans visage jusqu'à la prise de vue.

**Progression du funnel, 6/10.** Deux corrections, dans cet ordre.
Première : supprimer l'encadré vide de l'artboard. Un emplacement de preuve
déclaré vide est un outil de production, il n'a rien à faire sur une page que
regarde un prospect. Seconde : reconstruire la section 4 autour de la preuve qui
existe, le dispositif de veille, en disant à la première ligne que c'est un
travail Parrit et ce que Maxime y a fait. Une preuve de la maison, nommée comme
telle, convertit. Un trou nommé comme tel ne convertit pas.

---

## 3. Test des 5 secondes, premier écran uniquement

| Question | Paul | Maxime |
|---|---|---|
| Pour qui | **NON.** Rien dans le premier écran ne nomme l'audience, et `PARRIT` en header ne dit pas que c'est la page de Paul | **OUI.** `des dirigeants qui n'ont pas le temps de se former` |
| Qu'est-ce qui change pour moi | **OUI.** `vous repartez avec quelque chose qui tourne et que vous comprenez` | **OUI.** `Comprendre ce que l'IA peut faire chez vous, en le construisant` |
| Quelle est la prochaine action | **OUI.** `Cadrer mon premier cas`, rouge, sous le sous-titre | **OUI.** `Trouver par où commencer` |
| **Résultat** | **2 sur 3** | **3 sur 3 sur le texte**, mais l'image dominante de l'écran dit `IMAGE REQUISE` |

---

## 4. Test des 15 secondes, premier écran uniquement

| Question | Paul | Maxime |
|---|---|---|
| Sur quoi on travaille | **OUI.** `un sujet qui vous coûte du temps aujourd'hui` | **OUI.** `un vrai sujet à eux plutôt que sur un exemple de démonstration` |
| En quoi ce n'est pas une formation | **OUI.** `on le construit avec vous sur vos vraies données` | **OUI**, et dit frontalement : `qui n'ont pas le temps de se former` |
| Quel premier résultat | **OUI.** `quelque chose qui tourne` | **NON.** Le sous-titre dit comment on travaille, jamais avec quoi on repart |
| Comment ça me rend plus capable | **PARTIEL.** `et que vous comprenez`, trois mots à la fin d'une phrase longue | **OUI.** `Comprendre ce que l'IA peut faire chez vous` |
| **Résultat** | **3,5 sur 4** | **3 sur 4** |

**Correction Maxime :** ajouter l'output au sous-titre du hero. Il manque
l'équivalent du `quelque chose qui tourne` de Paul, et il tient en cinq mots
sans dépasser les trente-cinq autorisés.

---

## 5. Conditions d'échec immédiat

| Condition | Paul | Maxime |
|---|---|---|
| Le prix apparaît dans le hero | **PASS.** `2 500 € HT` n'existe qu'en section 7, vérifié sur la pleine page | **PASS.** Idem |
| Plus d'un CTA principal | **PASS.** Un seul libellé, `Cadrer mon premier cas`, répété à l'identique | **PASS.** Un seul libellé, `Trouver par où commencer` |
| La valeur est expliquée avant le prix | **PASS.** Cinq sections de valeur et de preuve précèdent la section 7 | **PASS.** Idem |
| Les deux pages sont deux copies recolorées | **PASS avec réserve écrite**, voir ci-dessous | **PASS avec réserve écrite** |
| La page Maxime ressemble à un site de gourou | sans objet | **PASS.** Aucun compte à rebours, aucune place restante, aucun badge d'urgence, aucun revenu affiché, aucun témoignage. L'AVOID relevé sur `the-ecosystem.io` n'a pas été repris |
| La page Paul ressemble à un template SaaS générique | **PASS.** Angles nets, aucune ombre, aucun dégradé, aucun mur de logos, aucune grille de fonctionnalités à pictogrammes. Le rang de trois cartes est le seul réflexe SaaS, et les filets 1px le tiennent du côté éditorial | sans objet |
| Plus de huit sections majeures | **PASS.** Header, huit sections, footer | **PASS.** Idem |

### La réserve sur « deux copies recolorées »

Elle mérite d'être écrite plutôt que classée. Les deux heros sont deux
compositions réellement différentes : copy à gauche et image à droite chez Paul,
image à gauche et copy à droite chez Maxime, dans deux températures opposées.
**En dessous du hero, les sept sections partagent le même squelette**, au pixel
près sur les sections 3, 5, 7 et 8 : même rang de trois cartes, même rang de
trois étapes, même carte d'offre de 576 px avec un paragraphe en vis-à-vis, même
bloc de conversion centré.

Le document M1 §8 le veut ainsi, c'est « la maison ». Le test qu'il propose est
tenu : on reconnaît la même entreprise et deux personnes. Mais le second terme
est porté **par le copy seul**. Si le copy est allégé plus tard, la différence
disparaît. C'est un point de fragilité, pas un échec.

---

## 6. Écart avec M1, à consigner

M1 §1 arrête le CTA primaire à **trois emplacements**, sections 1, 7 et 8. Les
deux maquettes en portent **quatre** : le header en ajoute un, avec le même
libellé et la même destination. Ce n'est pas une seconde porte, et à mon avis de
relecteur conversion c'est un ajout utile sur des pages de 4 700 et 5 300 px.
Mais l'écart n'est écrit nulle part. Soit M1 est amendé, soit le header perd son
bouton.

---

## 7. Gate G14

| Page | Compréhension de la valeur | Progression du funnel | Évidence du CTA | Verdict |
|---|---:|---:|---:|---|
| Paul desktop | 8/10 | 8/10 | 9/10 | **PASS**, sous réserve de la photo du hero et du calendrier |
| Maxime desktop | **7/10** | **6/10** | 9/10 | **FAIL** |
| Mobile 390 | non vu | non vu | non vu | **NON NOTÉ** |
| Funnel | non vu | non vu | non vu | **NON NOTÉ** |

**G14 : FAIL.** La page Maxime est sous le seuil sur deux critères bloquants sur
trois. Deux des quatre surfaces demandées n'ont pas pu être regardées, et les
frames notées ont été supprimées du fichier pendant la relecture. Le gate ne peut
pas être déclaré atteint sur cette base.
