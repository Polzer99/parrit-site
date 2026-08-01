# PRODUCT-LIVING-SYSTEM-SCENE-V2

**Tranche du 1er août 2026.** Second renderer de la scène produit, expérimental.
**Aucune direction n'est déclarée approuvée.** Aucun ADR n'est créé.

| | Route | Statut |
|---|---|---|
| **V1** | `/art-direction-lab/product-living-scene` | conservée, accessible, harnais toujours vert |
| **V2** | `/art-direction-lab/product-living-scene-v2` | nouveau renderer |

Implémentation : `src/app/art-direction-lab/product-living-scene-v2/`

---

## Diagnostic V1

Le moteur tenait. La représentation, non.

**Ce qui fonctionnait, et qui est conservé sans y toucher** : le scénario typé, les dix états, la timeline, pause, rejouer, pas à pas, l'arrêt réel au HumanGate, les quatre branches, les versions v0 à v3, la boucle d'amélioration, le mouvement réduit, la navigation clavier.

**Ce qui échouait visuellement** : gros titre éditorial en tête d'écran, fond papier, dossier blanc central lu comme une feuille, agents alignés en rangée d'étiquettes, traits rouges partout, données en lignes de métadonnées, HumanGate en modale noire posée au centre, sortie résumée dans un rectangle de texte. Concept D animé, autrement dit.

Le problème n'était pas fonctionnel. C'était le renderer.

## Architecture de la tranche

| Couche | Fichier | Statut |
|---|---|---|
| Moteur | `product-living-scene/scenario.ts`, `useScene.ts` | **inchangé**, importé tel quel |
| Renderer V1 | `product-living-scene/LivingScene.tsx`, `scene.css` | **inchangé**, archive et comparaison |
| Données de présentation V2 | `product-living-scene-v2/renderer.ts` | nouveau, aucune logique métier |
| Dérivations V2 | `product-living-scene-v2/useRenderer.ts` | enveloppe `useScene()`, ne le réimplémente pas |
| Renderer V2 | `SceneV2.tsx`, `Surfaces.tsx`, `scene-v2.css` | nouveau |

La règle tenue : **si une valeur décide de quelque chose, elle vient du moteur ; si elle décide seulement de la façon dont ça se voit, elle est dans le renderer.**

## Nouvelle métaphore

Le champ est en **encre**, les surfaces logicielles sont **claires**. Le papier n'est plus le fond de l'écran, il est la matière des logiciels. On lit un poste de travail, pas une page.

Le dossier n'est plus un document. C'est une **architecture modulaire** : huit modules dans une grille irrégulière de trois colonnes sur quatre rangées, reliés par des dépendances. Chaque module arrive d'une surface, se pose, puis se **verrouille** au commit, coin coupé à l'appui. Une case vide est un emplacement en attente, en trait discontinu, pas un champ de formulaire.

| Module | Code | Dépend de |
|---|---|---|
| Signal | `SGN` | — |
| Identité | `IDN` | — |
| Relation | `REL` | Identité |
| Contexte | `CTX` | Relation |
| Hypothèse | `HYP` | Signal |
| Risque | `RSK` | Contexte, Hypothèse |
| Action | `ACT` | Risque |
| Décision | `DEC` | Risque |

`DEC` est la seule case que la machine n'écrit jamais.

La **contradiction** — le contexte est indisponible alors qu'une action est déjà proposée — est le seul trait autorisé à traverser l'objet par-dessus les modules. C'est exactement ce que la machine ne sait pas résoudre seule.

## Surfaces

Six interfaces spécialisées, chacune avec sa fonction visuelle propre. Aucun produit tiers reproduit, aucun logo.

| Surface | Ce qu'elle montre |
|---|---|
| **Email** | provenance, objet, extrait, fragments surlignés au fur et à mesure que l'agent les isole, intention détectée |
| **CRM** | statut de contact, mini-historique de relation, actions ouvertes |
| **Web** | entreprise, vérifications cochées ou hachurées, source datée |
| **Knowledge** | politique interne `POL-04` versionnée, trois règles, cas comparables |
| **Internal data** | accès refusé, permission manquante, raison, conséquence |
| **Calendar** | contrainte, bande de créneaux, réservation |

Elles **entrent latéralement** quand elles servent, **se rétractent** ensuite, et **se rallument** si la sortie les concerne.

## Agents

Plus de rangée d'étiquettes. Un agent est **un curseur qui traverse le champ**, portant le code du module qu'il va remplir, et qui passe devant l'objet. Il n'existe à l'écran que pendant son intervention : **deux à quatre agents actifs**, jamais sept. Au survol il révèle son geste et atténue les autres.

L'agent `Context` échoue, volontairement. Son curseur passe en rouge, sa valeur est barrée, son module est hachuré. C'est cet échec qui rend l'humain nécessaire.

## HumanGate

Il n'est plus une modale. Il **se dote à côté de l'objet**, à gauche, et couvre **21 % de l'écran** — vérifié, avec un plafond de test à 45 %.

Pendant l'arrêt : la périphérie s'atténue, **la source bloquée reste lue en pleine lumière**, le module problématique se détache en rouge, l'action proposée reste cerclée de blanc. On voit les deux termes de l'arbitrage en même temps que la question.

**Chaque décision montre ce qu'elle provoque avant le clic** : son effet, son risque, la version qui en résultera. Ce ne sont pas quatre boutons identiques :

| Option | Forme |
|---|---|
| **Valider** | bouton primaire, effet et risque annoncés |
| **Corriger** | pas un bouton : **deux formulations précises** à choisir |
| **Rejeter** | bouton, conséquence annoncée |
| **Demander du contexte** | bouton, **nomme la surface qui sera consultée** |

La photographie documentaire de Paul apparaît uniquement ici, en 44 px, pour nommer qui porte la décision. Recadrage seul, aucun visage généré. Elle ne sauve pas l'interface : le Product First Test se joue sans elle.

## Sortie distribuée

La sortie ne se résume plus dans une carte. Elle **se dépose dans les logiciels concernés**, et pas les mêmes selon la branche.

| Branche | Email | Calendar | CRM | Version |
|---|---|---|---|---|
| **Valider** | message prêt à partir | créneau réservé | fiche mise à jour | v3 |
| **Corriger** | message réécrit | créneau réservé | préférence conservée | v3 |
| **Rejeter** | aucun message | aucun créneau | motif consigné | v2 |
| **Contexte** | demande d'historique envoyée | aucun créneau | dossier suspendu | v2 |

Le **moment de commit** verrouille les modules, coin coupé, 700 ms après la décision. La distribution suit 300 ms plus tard, pour que verrouillage et dépôt ne se confondent pas en un seul éclair.

## Feedback appliqué

La règle vit **dans le système**, pas dans deux paragraphes. C'est un segment de la politique `POL-04`, dans la surface Knowledge : `R-014` est barrée, remplacée, signée `v2 · modifiée par la direction commerciale`. Les deux autres règles ne bougent pas.

Puis une **occurrence suivante** apparaît : un signal de même forme, la politique en v2, et ce que le système fait désormais plus tôt. C'est la preuve que la correction sert à quelque chose.

Rien n'est appris automatiquement. **L'humain reste propriétaire de la modification.**

## Mobile

Refonte complète : sept **chapitres plein écran**, pas un rapport vertical.

1. Un signal entre · 2. Le contexte manque · 3. Le travail se répartit · 4. Le dossier se compose · 5. Vous tranchez · 6. Le système engage · 7. La règle change.

Un événement majeur par écran, une surface principale, et **l'objet en bande compacte dans chaque chapitre** : huit tuiles d'état plus la valeur du module en cours. Le chapitre courant vient à l'écran quand la scène avance ; le doigt reste libre, l'accroche est en `proximity`.

Le HumanGate est un chapitre entier, **mais l'objet reste visible au-dessus** — vérifié. Cibles tactiles pleines, rien sous 12 px, aucun tableau horizontal, aucun débordement.

Le rendu serveur est celui du plateau ; le passage en chapitres se décide après le montage, donc aucune divergence d'hydratation.

## Mouvement

Chaque déplacement a une origine et une destination : entrée latérale, sélection d'un fragment, transfert vers le module, verrouillage, retrait de la surface, focus sur la décision, reprise, commit distribué. Trois vitesses seulement — 140 ms pour l'interface, 320 ms pour l'objet, 620 ms pour la scène.

Tout se dérive toujours d'un seul nombre : le temps écoulé.

## Profondeur et palette

Plans décalés, chevauchements, changements d'échelle de 2 à 4 %, **ombres dures et non floutées** (5 px de flou maximum, vérifié), rayons contenus à 8 px maximum sur les surfaces produit seulement.

Interdits tenus : aucun glassmorphism, aucun glow, aucun néon, aucun flou décoratif, aucune particule, aucun gradient violet, aucune carte molle.

**Le rouge est devenu rare.** Les faisceaux de travail sont en encre claire — un transfert normal n'est pas une alerte. Le rouge ne sert plus qu'à la décision humaine, à l'interruption, au blocage, à la transformation principale et à la sélection active. Mesuré en flux normal : bien en dessous du plafond de 12 % d'éléments rouges.

## Typographie

Barlow Condensed est réduite à **quatre moments** : le nom du produit, l'état majeur du dossier, la question du gate, le mot de commit. Aucun titre de plus de deux lignes. Tout le reste est en Geist et Geist Mono.

Le **Product First Test** retire la condensée, la texture, la photographie et les annotations : la scène reste technologique et lisible. C'était la condition pour que la signature soit une signature et non une béquille.

## Limites

- **Les données sont fictives** et l'interface le dit : `Specimen produit · Données de démonstration`. Aucun client, aucune personne réelle, aucun chiffre de résultat.
- **Le scénario est unique.** Rien ne dit encore comment plusieurs cas métier cohabiteraient dans la même scène.
- **La V2 n'est pas une homepage** et ne prétend pas en tenir lieu : ni offre, ni méthode, ni preuve, ni prix, ni appel à l'action.
- **Le gate masque la colonne de gauche** pendant l'arrêt. C'est assumé — ces surfaces ont fini leur travail — mais c'est un choix, pas une évidence.
- **Le rapport texte / scène reste ouvert.** Il n'y a presque plus de texte : une phrase de conclusion dans le rail. C'est peut-être trop peu.

## Captures

`docs/design-system/qa/living-scene-v2/`

Desktop : `01-initial` · `02-signal` · `03-parallele` · `04-convergence` · `05-humangate` · `06-sortie-distribuee` · `07-feedback` · `08-branche-rejet` · `09-product-first` · `10-clavier` · `11-reduced-motion`.
Mobile, aux deux formats : `01-signal` · `02-parallele` · `03-decision` · `04-commit` · `05-amelioration`.
Planches : `sheet-v2-components` · `sheet-v2-motion` · `sheet-v2-mobile` · `compare-v1-v2` · `webkit-humangate`.

**Figma.** Page `PARRIT — VISUAL RESET V2`, nouvelle zone `PRODUCT LIVING SYSTEM V2` (`42:2`–`42:11`) posée sous tout l'existant, avec la comparaison V1 / V2 au même instant fonctionnel. Les vingt-deux frames précédentes, dont les huit de la V1, ne sont pas touchées — vérifié après coup.

## Tests

Harnais dédié : `node scripts/living-scene-v2-qa.mjs`. Le harnais V1 reste séparé et reste vert.

| Test | Résultat |
|---|---|
| Living Technology | ✅ 2 à 4 agents actifs, faisceaux simultanés |
| Object Transformation | ✅ les quatre versions atteintes, écarts marqués entre versions |
| Agent Usefulness | ✅ sept modules modifiés par un agent |
| Human Control | ✅ l'horloge s'arrête, aucune sortie déposée avant décision |
| Branch | ✅ sortie, règle, version **et** occurrence suivante diffèrent |
| **Product First** | ✅ sans Barlow, texture, photo ni annotations, la scène tient |
| **Document Metaphor** | ✅ 3 colonnes, 4 rangées, aucun formulaire, aucun tableau |
| **Surface Reality** | ✅ six intérieurs distincts, aucun mot posé autour du dossier |
| **HumanGate Integration** | ✅ 21 % de l'écran, objet non recouvert, source bloquée visible |
| **Distributed Output** | ✅ trois surfaces différentes changent |
| **Living Feedback** | ✅ règle modifiée dans la politique, propriétaire nommé, occurrence suivante |
| **Red Scarcity** | ✅ aucun faisceau rouge, rouge sous le plafond en flux normal |
| **Mobile Experience** | ✅ 7 chapitres plein écran, objet visible pendant la décision, cibles ≥ 44 px |
| Profondeur | ✅ aucune ombre molle, aucun rayon > 8 px, aucun flou |
| Reduced Motion | ✅ scénario entier, sortie distribuée et occurrence comprises |
| Clavier | ✅ décision atteignable et déclenchable au Tab puis Entrée |
| Timers, erreurs, débordement | ✅ |
| Chromium et WebKit | ✅ |
| `lint`, `tsc`, `build` | ✅ |

**Desire Test : il appartient à Paul.** Question exacte : *« Est-ce que cette scène me donne envie de brancher Parrit à mon entreprise ? »* Il n'est pas dans le harnais et ne peut pas être marqué automatiquement comme réussi.

## Arbitrages restant humains

1. **Le Desire Test.** V2 contre V1, et V2 dans l'absolu.
2. **Le renversement encre / papier.** Le champ sombre est ce qui fait basculer la scène du côté produit. Il s'écarte du canon papier du design system.
3. **La place du texte.** Il n'en reste presque plus. Combien en remettre, et où.
4. **Un scénario ou plusieurs.**
5. **La photographie.** Présente uniquement au gate, en 44 px. À garder, agrandir, ou retirer.

## Hors périmètre

Homepage publique · design system · Brand OS · copy commerciale · offres · prix · photographie de Maxime · V1 et ses tests.
