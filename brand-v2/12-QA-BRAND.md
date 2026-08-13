# G15 · QA FIDÉLITÉ DE MARQUE

**Gate :** G15 · **Relecteur :** indépendant, n'a ni conçu ni intégré ces pages ·
**Date :** 12/08/2026

Référence : `07-MERGE-DECISIONS.md` §4 et §8, `06-DESIGN-SYSTEM-PLAN.md`.

## 0. Ce qui a réellement été regardé

| Node | Contenu | Vu |
|---|---|---|
| `41:2` | Landing Paul, desktop 1440, hauteur réelle 4696 | oui, plein cadre + 6 recadrages agrandis |
| `45:2` | Landing Maxime, desktop 1440, hauteur réelle 5318 | oui, plein cadre + 6 recadrages agrandis |
| `17:8` | Les deux versions mobile 390 | oui, plein cadre + recadrage sur la carte d'offre |
| `51:2` | Moodboard « Références visuelles V2 » | oui, les 8 fiches lues |
| `17:5` | Page SHARED SYSTEM, composants | **NON. Le node n'existe pas dans le fichier.** |

Deux points d'honnêteté sur la méthode, qui limitent la portée de ce rapport.

**Le node `17:5` est introuvable.** L'appel renvoie « node not found », et le
listing des pages du document ne remonte qu'une seule page, `00 — START HERE`,
qui ne contient que le brand brief. **La page des composants partagés n'a donc
pas pu être auditée.** Tout ce qui est dit ici sur les composants est déduit de
leur rendu sur les deux landings, jamais de la bibliothèque elle-même. C'est une
vérification qui manque, pas une vérification qui passe.

**Le fichier a été réécrit pendant l'audit.** Les captures ont été prises, puis
les mêmes identifiants sont devenus introuvables quelques minutes plus tard.
Le rapport porte donc sur un état daté, pas sur l'état courant. Les notes
doivent être rejouées après le prochain gel du fichier.

Les captures sont conservées dans le scratchpad de session
(`paul.png`, `max.png`, `mob.png`, `refs.png` et leurs recadrages).

---

## 1. Page PAUL, l'opérateur

| Critère | Note | Ce qui est vu à l'écran |
|---|---:|---|
| Raison | **9** | Le hero argumente au lieu de promettre : « Il faut vous y mettre. Reste à choisir par quoi commencer. » Le sous-titre pose une mécanique en trois temps, sujet, construction, reprise, sans un seul adjectif de vente. La section 4 raconte un cas avec ses chiffres de départ, et la ligne rouge sous le cas dit explicitement qu'aucun client n'est nommé. C'est de la retenue argumentée, elle tient. |
| Conquête | **7** | Le seul geste réellement conquérant est la phrase de la section 7, à droite de la carte de prix : « Si je pense qu'un sujet ne mérite pas d'être construit, je vous le dis avant de commencer. » Elle porte plus que tout le reste de la page. Ailleurs, le registre redevient prudent et le rouge n'apparaît que sur trois boutons et quelques micro-labels. La page tient sa position, elle ne prend pas de terrain. |
| Créativité | **5** | **C'est la note faible et elle est méritée.** La composition est un gabarit : hero texte à gauche et bloc à droite, trois cartes, trois étapes numérotées, carte de prix à gauche avec une phrase à droite. Rien dans la mise en page n'est inventé, et surtout rien n'est spécifique à Paul : c'est la même ossature que la page de Maxime, en couleurs inversées. Le moodboard promet la gravité de Palantir et le craft de Linear, aucun des deux n'atterrit. |
| 0 vers 1 | **7** | La section 5, « Comment ça se passe », énonce Comprendre, Choisir et construire, Continuer. Elle décrit le passage, elle ne le **montre** pas. Aucun artefact, aucun avant et après, aucune interface, aucun document. Sur une page dont la thèse est qu'on part de zéro et qu'on repart avec quelque chose qui tourne, ce quelque chose n'est jamais à l'écran. |
| Système | **6** | La preuve de la section 4 décrit bien un système, des règles écrites en français, un refus de produire la clôture si une donnée manque, trois points d'arrêt humains. Mais c'est de la prose dans un rectangle. Aucune structure n'est rendue visible : ni schéma, ni enchaînement, ni objet. Le visiteur lit qu'il y a un système, il n'en voit jamais un. |
| Autorité | **7** | Le fond encre, la densité tenue et le prix affiché sans détour posent l'autorité. Deux choses la plafonnent. Le portrait du hero est un `PHOTO SLOT` vide, donc un rectangle gris occupe le quart droit du premier écran. Et la preuve d'autorité prévue au §5 du merge, la chronique de presse R-07 en L6, **n'apparaît nulle part sur la page**. La seule preuve d'autorité disponible est absente. |
| Absence d'esthétique de coach | **9** | Rien à redire. Pas de compte à rebours, pas de mur de témoignages, pas de portrait souriant bras croisés, pas de « places limitées ». Le seul emplacement de citation est un `PROOF SLOT` rouge qui dit en toutes lettres qu'aucun verbatim n'est disponible avec un accord. Cette honnêteté-là est le meilleur signal anti-coach de la page. |

**Moyenne fidélité de personnalité : 7,1 / 10.**

---

## 2. Page MAXIME, le guide

| Critère | Note | Ce qui est vu à l'écran |
|---|---:|---|
| Cœur | **4** | **Il n'y a pas de visage.** Le hero est construit autour d'un `PORTRAIT SLOT / IMAGE REQUISE` qui occupe toute la moitié gauche du premier écran, et l'espace y est réservé jusqu'en bas de page sans jamais être rempli. Le §8 du merge écrit que la place du visage est « centrale, dès le hero ». Sur la page telle qu'elle est, l'ancrage émotionnel est un rectangle beige vide. Un dirigeant qui ouvre cette page ne rencontre personne. |
| Pédagogie | **8** | C'est ce que la page réussit le mieux. La section 2 pose « Vous savez que c'est important. Vous ne savez pas par où commencer. » et laisse le visiteur se reconnaître dans trois phrases à la première personne. La section 5 s'intitule « Trois temps, et rien d'autre », ce qui est à la fois le contenu et la promesse de ne pas noyer. Le vocabulaire est concret de bout en bout. |
| Confiance | **7** | Deux gestes solides : la phrase de droite en section 7, « Aucun abonnement, aucun forfait de suite imposé. Si vous voulez continuer ensuite, on en reparle. Sinon, ce qui a été construit reste chez vous », et le `PROOF SLOT` en pointillés rouges de la section 4 qui reconnaît par écrit qu'aucune réalisation propre à Maxime n'est disponible. Ce qui abîme la note n'est pas le texte, c'est l'exécution : portrait absent, et copie qui diverge entre desktop et mobile, voir §3. |
| Contenu | **3** | **Zéro surface de contenu sur la page.** Ni vidéo, ni article, ni newsletter, ni interview, ni extrait. Les quatre références choisies pour lui, Matis Clouet, Iman Gadzhi, Ramit Sethi, Sahil Bloom, sont **toutes les quatre** des pages construites autour du contenu, et le moodboard le dit lui-même, « interviews clients en vidéo », « preuves posées juste sous le titre », « portrait plein cadre ». Rien de ce qui a été extrait des références n'a été appliqué. Sur le pilier qui définit Maxime, la page est vide. |
| Finance | **5** | La page est transparente sur le prix, 2 500 € HT, aucun abonnement, aucun forfait. C'est de la clarté commerciale, ce n'est pas de la finance rendue humaine. Le TAKE de Ramit Sethi disait « la finance rendue humaine » : aucun chiffre, aucun coût, aucun ordre de grandeur du problème n'est traduit pour le visiteur. Le seul nombre de la page est son propre tarif. |
| Accessibilité | **8** | Le fond crème, l'interlignage large et les phrases courtes tiennent la promesse. Un dirigeant de 45 à 60 ans lit cette page sans effort et peut l'envoyer à son associé sans en avoir honte, la section 6 le dit d'ailleurs mot pour mot. Une réserve réelle : **tout le corps de texte est en Geist Mono**, y compris les paragraphes longs. Le mono à petite taille sur crème est ce qui fatigue le plus vite l'œil de cette tranche d'âge, et il tire le registre vers le technique, à l'opposé du guide. |
| Absence d'esthétique de gourou | **9** | Propre. L'AVOID le plus important du moodboard, la fausse rareté relevée sur `the-ecosystem.io`, est respecté : aucun compte à rebours, aucune place restante, aucun badge d'urgence. Pas de hero cinématographique, pas de promesse de revenus, pas de citation inspirante. La page refuse le registre, comme demandé. |

**Moyenne fidélité de personnalité : 6,3 / 10.**

---

## 3. Maison commune

| Critère | Note | Ce qui est vu à l'écran |
|---|---:|---|
| Cohérence | **8** | Même grille, même famille Geist et Geist Mono, angles à zéro partout, aucune ombre, filets 1px, même rythme vertical, même carte de prix. Les huit sections sont dans le même ordre sur les deux pages. La maison est lisible. |
| Composants partagés | **6** | Deux divergences visibles sur des composants censés être identiques. Le `PROOF SLOT` est rendu comme **un filet rouge plein à gauche** chez Paul et comme **un cadre en pointillés rouges** chez Maxime : même rôle, deux dessins. L'étiquette de `Card / Offer` est `L'ACCOMPAGNEMENT`, en capitales mono, chez Paul et sur le mobile de Maxime, mais sur le **desktop de Maxime** elle est en bas de casse et porte un tout autre texte. Rappel : la bibliothèque n'a pas pu être ouverte, ces écarts sont donc constatés au rendu, pas à la source. |
| Niveau de finition | **5** | **La note qui fait le plus mal.** Trois défauts concrets. Un, **aucune image sur aucune des deux pages** : tous les visuels sont des emplacements vides, y compris les deux portraits. Deux, sur la carte d'offre de Maxime en desktop, **l'étiquette et le libellé du bouton semblent intervertis** : l'étiquette a la longueur de mots de « Trouver par où commencer » et le bouton celle de « Cadrer mon premier cas », qui est le CTA de Paul. Si c'est confirmé, cela viole le §3 du merge, un seul libellé par page. Trois, le corps de la carte d'offre de Maxime **n'est pas le même texte en desktop et en mobile**. Ces trois points se lisent à l'œil nu, ils ne demandent aucun outil. |
| Même entreprise perceptible | **8** | Oui, sans hésitation. Le rouge, la mono, les angles nets, la carte de prix et le squelette en huit sections signent la même maison des deux côtés. |
| Personnalités distinctes | **7** | Elles sont distinctes, mais **presque uniquement par inversion de la palette**. Section par section, bloc par bloc, dans le même ordre et les mêmes proportions, c'est la même page. Le brand brief interdit explicitement de faire « trois peaux du même site ». On en est à deux peaux du même site, sauvées par la copie, qui elle est réellement écrite dans deux registres différents. |

---

## 4. Test à l'aveugle, réponse franche

**Saurais-je dire qui est qui ?** Oui, en une seconde, mais pas pour la bonne
raison. Je le saurais parce que l'une est sur fond encre et l'autre sur fond
crème, et parce que l'une ouvre par une injonction, « Il faut vous y mettre »,
et l'autre par une permission, « Comprendre ce que l'IA peut faire chez vous ».
Retirez la couleur de fond et le premier écran : **je ne saurais plus**. Les
sections 3, 5, 6 et 7 sont interchangeables, seule la copie change. La
personnalité vit dans le texte, presque pas dans le dessin.

**Verrais-je que c'est la même entreprise ?** Oui, clairement. Sur ce point les
deux pages passent.

**Ce que je verrais aussi sans qu'on me le demande :** que les deux pages ne
sont pas finies. Deux rectangles vides à la place des deux visages, sur le
premier écran des deux pages, c'est la première chose que l'œil attrape.

---

## 5. Interdits visuels

Vérifiés un par un sur les quatre frames. **Aucun n'est présent.**

Cerveau, réseau de neurones, orbe, robot, chatbot flottant, dégradé de startup
IA, noir et violet, noir et or, photo de banque d'images, tableau de bord fictif
avec de faux chiffres, esthétique SaaS générique, gabarit d'agence, kit UI
recoloré : rien de tout cela à l'écran.

Deux nuances à consigner plutôt qu'à lisser.

**Le kit recoloré.** Le grief le plus proche d'être fondé est celui du kit UI
simplement recoloré, non pas parce qu'un kit a été acheté, mais parce que les
deux pages sont le même gabarit avec deux palettes. Je ne coche pas l'interdit,
la typographie, les filets et la densité sont bien du système Parrit, mais je le
signale : c'est la direction dans laquelle la production dérive.

**Les faux chiffres.** La carte de preuve de Paul affiche des nombres précis,
comptes saisis à la main, formules, cellules en erreur. Ils viennent de R-10,
classé L5 et sourcé au §5 du merge, et ils sont présentés dans un document de
travail, pas dans un tableau de bord maquetté. Ce n'est donc pas l'interdit.

---

## 6. Écart de tokens, à trancher par une décision écrite

Constat mesuré au pixel sur les captures, pas déduit.

| Surface | Valeur mesurée | Canon `docs/design-system/` v1.0 |
|---|---|---|
| Rouge, page Paul, desktop et mobile | **`#EF1D38`** | `#D1132F` |
| Rouge, page Maxime, desktop et mobile | `#D1132F` | `#D1132F` |
| Fond, page Paul | `#0E0E10` et `#17171A` | `#0C0C0D` |
| Fond, page Maxime | `#FBF6EF` et `#F2EAE0` | `#FFFDFA` |

**L'intégration est conforme à `06-DESIGN-SYSTEM-PLAN.md`**, qui déclare
explicitement `action/primary = #EF1D38` côté Paul, `paperPaul = #0E0E10` et
`paperMaxime = #FBF6EF`, et qui justifie l'éclaircissement du rouge par le
contraste sur fond encre. Ce n'est donc pas une faute d'exécution.

Mais `07-MERGE-DECISIONS.md` §8 écrit, sans réserve, que « le rouge Parrit
`#D1132F` » fait partie de ce qui **ne change jamais**. Les deux documents se
contredisent, le document qui fait loi est le §8, et c'est l'autre qui a été
suivi. Par ailleurs `#FBF6EF` et `#0E0E10` sont deux couleurs **nouvelles**, qui
n'existent pas dans le canon de l'entreprise.

Ce n'est pas un défaut de fidélité, c'est une décision de charte prise en
silence. Elle doit être soit écrite dans le canon comme variante assumée sur
fond encre, soit annulée. En l'état, la maison a trois crèmes et deux rouges.

---

## 7. Verdict

**Seuil bloquant : aucune page ne passe en dessous de 8/10 sur la fidélité de
personnalité.**

**LES DEUX PAGES SONT BLOQUÉES.**

- **Paul : 7,1 / 10.** Tiré vers le bas par la créativité, 5, et par le système
  montré, 6.
- **Maxime : 6,3 / 10.** Tiré vers le bas par le contenu, 3, et par le cœur, 4.

**G15 : FAIL.**

---

## 8. Corrections, par ordre de gravité

**Bloquant, page Maxime**

1. **Remplir le portrait du hero.** Sans visage, le pilier cœur ne peut pas
   monter au-dessus de 4, quoi qu'on fasse au texte. C'est le premier écran, et
   c'est la seule différence structurelle prévue avec la page de Paul.
2. **Ouvrir une surface de contenu.** Une seule suffit pour passer de 3 à 7 :
   un extrait vidéo, un article, ou la newsletter. Les quatre références
   retenues pour lui sont construites là-dessus, et rien n'en a été pris.
3. **Vérifier la carte d'offre en desktop**, étiquette et libellé de bouton
   probablement intervertis, avec un CTA de Paul sur la page de Maxime.
4. **Réaligner la copie de la carte d'offre entre desktop et mobile.** Les deux
   ne disent pas la même chose aujourd'hui.

**Bloquant, page Paul**

5. **Montrer un artefact.** Une interface, un document, un enchaînement, une
   sortie réelle. Créativité, système et 0 vers 1 sont bloqués ensemble par la
   même absence : la page parle de ce qui est construit sans jamais le montrer.
6. **Faire apparaître la preuve d'autorité R-07**, ou écrire dans le document
   pourquoi elle est écartée. C'est la seule preuve L6 disponible, et elle
   manque.
7. **Remplir le portrait documentaire du hero**, ou retirer le bloc. Un
   rectangle gris sur le quart du premier écran coûte plus que l'absence de
   photo.

**Structurel, les deux pages**

8. **Casser la symétrie de composition.** Aujourd'hui, section par section, ce
   sont deux peaux du même gabarit. Deux gestes suffiraient : une section de
   Paul en pleine largeur et dense, à la Palantir, et une section de Maxime
   construite autour d'une image plein cadre, à la Sahil Bloom.
9. **Unifier le rendu du `PROOF SLOT`**, filet plein d'un côté, pointillés de
   l'autre, et l'étiquette de `Card / Offer`, capitales d'un côté, bas de casse
   de l'autre.
10. **Trancher l'écart de tokens du §6 par une décision écrite**, et republier
    la page des composants partagés : elle est introuvable dans le fichier, et
    tant qu'elle l'est, la conformité des onze composants n'est pas auditable.

**Non bloquant, à considérer**

11. Sur la page de Maxime, sortir les paragraphes longs de Geist Mono. Le mono
    est juste pour les labels et les micro-textes, il tire le corps de texte
    vers le technique, exactement là où le guide a besoin de chaleur.
