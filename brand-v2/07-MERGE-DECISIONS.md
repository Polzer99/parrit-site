# M1 · DÉCISIONS DE MERGE

**Gate :** M1 · **Owner :** orchestrateur · **Date :** 12/08/2026

Ce document tranche. Il est la seule source de vérité pour G6 à G16. En cas de
contradiction entre ce document et un artefact amont, **c'est ce document qui
gagne**, et l'écart est écrit ici plutôt que lissé.

Entrées fusionnées : `02-FUNNEL.md`, `03-REFERENCES-PAUL.md`,
`04-REFERENCES-MAXIME.md`, `05-PROOF-INVENTORY.md`, `06-DESIGN-SYSTEM-PLAN.md`.

---

## 1. Le funnel définitif, huit sections

Repris de G1, avec **deux amendements** dont un qui corrige G1.

| # | Section | Contenu | Prix ? | CTA ? |
|---:|---|---|---|---|
| 1 | Hero | Nom, titre, sous-titre, visuel, **CTA primaire** | non | **oui** |
| 2 | Reconnaissance | Le visiteur se reconnaît, dans ses mots | non | non |
| 3 | Trois usages concrets | Trois situations, jamais quatre | non | non |
| 4 | Preuve | Un cas, passé par la porte P1 à P6 | non | non |
| 5 | Méthode | Trois étapes visibles, jamais cinq | non | non |
| 6 | Autonomie | Ce que le visiteur saura faire après | non | non |
| 7 | Offre | 10 heures, 2 500 € HT, ce qui est inclus | **oui, ici seulement** | oui, même CTA |
| 8 | Conversion | Rappel de l'objet de l'échange, réservation | non | oui, même CTA |

### Amendement 1, qui corrige G1 : le hero porte le CTA primaire

G1 écrivait *« aucun CTA de conversion dans le hero, un simple signal de scroll
suffit »*. **C'est rejeté.** Deux raisons, et la seconde est décisive.

D'abord, la spécification above-the-fold de la commande liste explicitement un
CTA parmi les cinq éléments maximum du premier écran, pour les deux pages.

Ensuite, le test des 5 secondes exige que le visiteur réponde à *« quelle est la
prochaine action ? »*. G1 y répondait *« descendre dans la page »*. Descendre
n'est pas une action, c'est l'absence d'action. Un visiteur qui repart au bout
de cinq secondes n'aura rien vu d'autre que le hero.

**Décision.** Le CTA primaire apparaît trois fois, en sections 1, 7 et 8. **Même
libellé, même destination, à chaque fois.** Ce n'est pas trois CTA concurrents,
c'est un seul CTA rappelé, ce que la commande autorise explicitement : tous les
CTA principaux mènent à la même prochaine étape.

**Le prix reste interdit dans le hero.** Un CTA n'est pas un prix. La règle
violée en V1 était l'affichage du montant, pas la présence d'une action.

### Amendement 2 : la section 7 ne porte pas un CTA secondaire différent

G1 proposait un CTA secondaire léger en section 7. **Rejeté** : cela ouvrirait
une seconde porte. La section 7 porte le CTA primaire, identique aux deux autres.

---

## 2. Le placement du prix, règle unique

**2 500 € HT, section 7, une seule fois, sur chacune des deux pages.**

Interdit partout ailleurs : hero, header, barre collante, métadonnée visible
avant le scroll, section 3, section 4, section 8. Aucun second ancrage, aucun
`2 499 €`, aucun « à partir de », aucun tarif dégressif.

Le mot « offre » et la mention « 10 heures » sont eux aussi réservés à la
section 7, à une exception près : le sous-titre du hero peut dire que le travail
se fait **avec** le visiteur sur son vrai travail, sans nommer ni la durée ni le
prix.

---

## 3. Le CTA unique, arrêté

Une seule formulation par page, jamais deux.

| Page | CTA retenu | Pourquoi celui-là |
|---|---|---|
| **Paul** | **Cadrer mon premier système** | Exprime une décision, pas une découverte. « Cadrer » est un verbe d'opérateur. Le visiteur de Paul veut avancer, pas apprendre |
| **Maxime** | **Choisir mon premier usage** | Exprime la permission de ne pas savoir. C'est exactement l'état du visiteur de Maxime, et le titre de sa section 2 |

Les deux mènent à la **même** prochaine étape : un échange dont l'objet est de
sélectionner le premier cas d'usage. Pas une démo, pas un audit, pas un devis.

---

## 4. Les références, arrêtées

**Quatre par personne, aucune de plus.** Toutes ont désormais une capture
desktop et une capture mobile sur disque, et **chacune a été ouverte et regardée**
avant validation.

### Paul

| Référence | Capture | Ce qu'on en prend |
|---|---|---|
| Palantir | `refs/palantir.jpg` | gravité, systèmes, autorité par le texte, densité assumée |
| Linear | `refs/linear.jpg` | précision, craft, produit montré en marche, motion courte |
| McKinsey | `refs/mckinsey.jpg` | crédibilité dirigeant, cadre de pensée, profondeur éditoriale |
| Wispr Flow | `refs/wispr.jpg` | compréhension immédiate, friction retirée, une action évidente |

### Maxime

| Référence | Capture | Ce qu'on en prend |
|---|---|---|
| Matis Clouet, via **the-ecosystem.io** | `refs/matis-clouet.jpg` | titre serif éditorial, preuves chiffrées sous le titre, interviews clients en vidéo |
| Iman Gadzhi, via **iman-gadzhi.com** | `refs/iman-gadzhi.jpg` | photo cinématographique plein cadre, retenue, nom en très grand, navigation minuscule |
| Ramit Sethi | `refs/ramit-sethi.jpg` | finance rendue humaine, un seul bouton, titre énorme et simple |
| Sahil Bloom | `refs/sahil-bloom.jpg` | portrait plein cadre, élégance éditoriale, thought leadership sobre |

### Deux corrections d'URL, à consigner

| Référence | URL utilisée en V1 | Ce que la capture montrait vraiment | URL correcte |
|---|---|---|---|
| Matis Clouet | `matisclouet.com` | une installation WordPress vierge, « Bonjour tout le monde » | **`the-ecosystem.io`** |
| Iman Gadzhi | `gadzhi.com` | HILLS, sa marque de lunettes, une boutique en ligne | **`iman-gadzhi.com`** |

La V1 a publié un moodboard où deux des quatre références de Maxime montraient
un autre site, avec un commentaire écrit avec assurance sur ce qui avait été
« observé ». La cause est la même que pour Bain : **une capture téléchargée sans
être regardée**. La règle est désormais dans le script de capture et dans ce
document : un statut de téléchargement réussi ne dit rien du contenu.

### Un AVOID de première importance, trouvé sur the-ecosystem.io

La page porte un widget de discussion affichant *« Only few slots are left »*
avec un compte à rebours de deux minutes cinquante-sept. **C'est de la fausse
rareté.** Elle est interdite sur la page de Maxime, sous toutes ses formes :
compte à rebours, nombre de places restantes, « plus que X jours », badge
d'urgence. La mécanique de conversion se prend, ce ressort-là se laisse.

---

## 5. Les preuves utilisables, arrêtées

Source unique : `05-PROOF-INVENTORY.md`, qui applique la porte P1 à P6.

### Page Paul

| Rang | Preuve | Niveau | Forme autorisée |
|---|---|---|---|
| 1 | **R-10**, reporting mensuel d'une marque de soin | **L5** | cas anonymisé, avec les chiffres de la situation de départ, qui sont sourcés |
| 2 | **R-06**, Parrit sur elle-même | L4 | preuve de méthode, **la nature interne doit être dite dans la phrase** |
| 3 | **R-07**, chronique de presse | **L6** | preuve d'autorité, **uniquement quand l'URL de parution existe**. Sinon `PROOF SLOT` |

### Page Maxime

| Rang | Preuve | Niveau | Forme autorisée |
|---|---|---|---|
| 1 | **R-09**, veille d'un dirigeant en recherche de poste | L4 | système livré décrit, **aucun effet prêté** (règle P3) |
| 2 | **R-03**, toolkit back-office d'une marque de soin | L4 | idem, en illustration pédagogique |

### Le fait le plus inconfortable de la tranche, dit plutôt que contourné

**Aucune source primaire du canon ne rattache Maxime à une réalisation `R-*`.**
Le seul projet où le canon le nomme est rangé hors périmètre machine, dans un
autre compartiment.

Conséquence assumée : sa page s'appuie sur des preuves de **Parrit**, présentées
sous un angle pédagogique, jamais sur des preuves qui seraient les siennes. Et
elle porte un `PROOF SLOT` explicite pour une preuve propre à Maxime.
**Cette preuve est à produire, pas à trouver.**

### Ce qui est interdit, et qui vaut pour les deux rédacteurs

Le §5 de `05-PROOF-INVENTORY.md` fait loi, ses 30 interdits sont contractuels.
Les cinq qui vont se présenter spontanément sous une plume de conversion :

1. Tout gain de temps chiffré. Aucune baseline n'existe.
2. Tout nombre de clients, tout taux, tout ROI, tout « x fois plus vite ».
3. Tout nom de client, sur toute surface, y compris une landing personnelle.
4. Tout témoignage ou verbatim client. Aucun n'a d'accord.
5. Une preuve interne présentée comme un cas client.

---

## 6. L'arbitrage sur le mot « autonome »

**C'est la contradiction la plus sérieuse remontée par le graphe, et elle est
tranchée ici.**

L'inventaire de preuves interdit « autonome » et « rendu autonome » (interdit
n° 13). La commande, elle, construit toute la promesse sur l'autonomie, et le
funnel lui consacre une section entière.

Les deux ont raison, sur deux objets différents. L'interdit porte sur **deux
usages précis** : un système décrit comme fonctionnant sans humain, et un client
décrit comme ayant été rendu autonome, présenté comme un résultat constaté. Sur
R-09, « rendu autonome » est une garantie contractuelle, pas un fait mesuré.

### La règle de rédaction qui en découle, contraignante pour G6 et G7

**Autorisé.** L'autonomie comme **capacité visée par l'offre**, au futur, à la
deuxième personne, sans la rattacher à un cas passé :
- « vous saurez faire tourner ce qu'on aura construit »
- « vous saurez repérer le prochain sujet, et le traiter »
- « l'objectif est que vous n'ayez plus besoin de nous pour les petits sujets »

**Interdit.** L'autonomie comme **résultat prouvé** ou comme propriété d'un
système :
- « nos clients sont devenus autonomes »
- « un système autonome », « sans intervention », « pilote automatique »
- « X est reparti autonome », attaché à un cas
- « automatisé » employé seul, sans mentionner le contrôle humain

**Le titre de la section 6 devient « Ce que vous saurez faire après »**, pas
« Autonomie ». Le mot peut apparaître dans le corps, jamais comme une promesse
de résultat.

---

## 7. Les composants communs, arrêtés

Onze, repris de G5, tous instanciés par les deux pages. Aucun composant
supplémentaire n'est autorisé sans amender ce document.

`Header / Minimal` · `CTA / Primary` · `Link / Secondary` · `Hero / Section` ·
`Card / Use-case` · `Card / Proof` · `Process / Step` · `Card / Offer` ·
`Quote / Testimonial` · `FAQ / Item` · `Footer / Minimal`

**Note sur `Quote / Testimonial`** : le composant est construit, mais **aucun
verbatim client n'est disponible avec un accord**. Sur les deux pages, il porte
un `PROOF SLOT`. Il n'est pas rempli par du faux.

---

## 8. Ce qui distingue Paul de Maxime, et ce qui ne change jamais

### Ne change jamais, c'est la maison

Geist et Geist Mono. Le rouge Parrit `#D1132F`. Angles à zéro. Aucune ombre.
Base 8. Grille 12 colonnes en desktop, 4 en mobile. Les onze composants et leur
structure. Le funnel en huit sections. Le prix en section 7. Un seul CTA.

### Change, c'est la température

| | Paul | Maxime |
|---|---|---|
| Fond | encre, contraste élevé | crème chaud, lumière |
| Densité | serrée, tenue | aérée, respiration |
| Place du visage | secondaire, une fois, documentaire | **centrale, dès le hero** |
| Preuve montrée | un artefact de travail, une interface, un document | une histoire d'accompagnement, une personne |
| Typographie | poids élevé, titres compacts | poids moyen, interlignage large |
| Motion | rapide et sèche | plus ronde et lente |
| Registre du copy | décision, système, exécution | permission, compréhension, progression |

**Le test qui arbitre :** un lecteur qui voit les deux pages côte à côte doit
reconnaître **la même entreprise** et **deux personnes différentes**. S'il voit
deux entreprises, la maison a échoué. S'il voit deux fois la même personne,
l'expression a échoué.

---

## 9. Les règles de longueur du copy

Contractuelles pour G6 et G7, vérifiées au mot près en M2.

- Titre du hero : **12 mots maximum**.
- Sous-titre du hero : **35 mots maximum**.
- Aucun paragraphe au-dessus de **70 mots**.
- Total de la page : **500 à 750 mots**, justification écrite obligatoire au-delà.
- Trois exemples maximum en section 3, trois étapes maximum en section 5.
- Aucun jargon non expliqué, aucune phrase sur « le futur de l'IA », aucun mot
  creux de cabinet de conseil.
- **Aucun tiret cadratin**, gate automatique du dépôt.

---

## 10. Gate M1

| Critère | Résultat |
|---|---|
| Funnel définitif arrêté | **PASS**, §1, huit sections, deux amendements écrits |
| Quatre références Paul arrêtées | **PASS**, §4, captures vérifiées |
| Quatre références Maxime arrêtées | **PASS**, §4, deux URL corrigées et recapturées |
| Preuves utilisables arrêtées | **PASS**, §5, porte P1 à P6 appliquée |
| Composants communs arrêtés | **PASS**, §7, onze |
| Différences Paul et Maxime arrêtées | **PASS**, §8 |
| Règles de longueur du copy arrêtées | **PASS**, §9 |
| Emplacement du prix arrêté | **PASS**, §2, section 7 uniquement |
| CTA unique arrêté | **PASS**, §3, un par page, trois emplacements, même destination |

**M1 : PASS.** G6 et G7 sont autorisés. La production Figma est autorisée.
