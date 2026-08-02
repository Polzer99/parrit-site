# PRODUCT-LIVING-SYSTEM-SCENE-V1

**Tranche du 1er août 2026.** Une scène produit isolée, expérimentale.
**Aucune direction n'est déclarée approuvée.** Aucun ADR n'est créé.

Route : `/art-direction-lab/product-living-scene` · Implémentation : `src/app/art-direction-lab/product-living-scene/`

---

## Objectif

Réussir le cœur vivant autour duquel un futur site pourra être construit. Pas le site, pas une homepage, pas un concept E à dix sections : **une seule scène continue** qui montre un système Parrit en train de travailler.

Le but est de provoquer « je veux voir ce système branché à mon entreprise », pas « la documentation du workflow est claire ».

## Scénario

Un message entrant signale une opportunité. Le système lit le contexte disponible, sept agents se répartissent le travail en parallèle sur six surfaces logicielles, un dossier unique s'enrichit, une action est proposée. **Une source manque : le système s'arrête et demande une décision.** La décision humaine relance la machine, une action est préparée, et le retour humain réécrit une règle.

## Objet métier

**Dossier d'opportunité `OPP-2041`**, au centre du plateau du début à la fin. Ce n'est pas un formulaire qui se remplit : chaque champ est **déposé** par un agent, en trois couches, et se verrouille.

**États traversés :** Reçu · Contexte manquant · En cours d'analyse · Enrichi · Action proposée · Validation requise · Validé · Action préparée · Retour enregistré · Règle améliorée.

**Versions.** `v0` → `v1` → `v2` → `v3`. La version ne change **que** si une transformation réelle a eu lieu, jamais au passage d'une phase. Cliquer une version antérieure marque les lignes ajoutées depuis.

## Agents

Sept rôles : Signal · Company · Relation · Context · Use case · Risk · Next action. Ils sont représentés comme des **lignes d'exécution** avec leur progression réelle, jamais comme des avatars, des robots, des bulles ou des nœuds ronds.

**Chacun produit une modification observable du dossier.** `Context` échoue volontairement : l'historique relationnel est indisponible. C'est cet échec qui crée le besoin d'un humain, et il se voit, en trait pointillé et en texte barré.

## Surfaces logicielles

Six : Email · CRM · Web · Knowledge · Internal data · Calendar. Abstraites, en fenêtres partielles. **Aucun écran de produit tiers n'est reproduit, aucun logo.** Chaque surface porte son rôle : lue, vérifiée, comparée, mise à jour, bloquée. Cliquer une surface montre ce qu'elle apporte.

La sensation technologique vient de la coordination, pas de l'accumulation de marques.

## HumanGate

Une interruption, pas une ligne de registre. La scène se voile, un bloc d'encre vient au premier plan, la question est posée avec sa raison et son propriétaire nommé.

**L'arrêt est réel** : l'horloge de la scène est stoppée, pas ralentie. Vérifié automatiquement, aucune suite ne se joue et aucune sortie n'apparaît avant décision.

Quatre réponses : **Valider · Corriger · Rejeter · Demander plus de contexte.**

## Branches

Quatre conséquences distinctes. Deux branches ne peuvent pas produire le même résultat, c'est vérifié.

| | État | Sortie | Version | Règle après retour |
|---|---|---|---|---|
| **Valider** | Action préparée | message rédigé, créneau réservé | v3 | proposer l'action et signaler la source manquante |
| **Corriger** | Action préparée | message réécrit avant envoi | v3 | reprendre la formulation validée |
| **Rejeter** | Retour enregistré | aucune action envoyée | v2 | ne rien proposer sans échange antérieur retrouvé |
| **Demander du contexte** | Contexte manquant | demande adressée à l'équipe | v2 | demander le contexte relationnel d'abord |

## Sortie et amélioration

La scène ne s'arrête pas à la sortie. La boucle montre la règle **avant**, barrée, et la règle **après retour humain**, reliées par un trait rouge.

Elle porte explicitement : *modification enregistrée par la direction commerciale, rien n'a été appris automatiquement.* **L'humain reste propriétaire de la modification.**

## Mouvement

| Phase | Fenêtre |
|---|---|
| Veille | 0 → 600 ms |
| Signal entrant | 600 → 1 500 ms |
| Travail parallèle | 1 500 → 4 000 ms |
| Convergence | 4 000 → 5 500 ms |
| Décision humaine | 5 500 ms → **jusqu'à interaction** |
| Sortie | 2 000 ms après décision |
| Amélioration | 1 200 ms |

Tout se dérive d'un seul nombre, le temps écoulé. Aucun composant ne garde d'état d'animation propre : `pause`, `step` et `replay` en découlent sans désynchronisation.

**Contrôles intégrés** : Replay · Pause · Step, plus une barre de progression. Ce n'est pas un lecteur vidéo.

**Reduced motion** : aucun déplacement long, transitions ramenées à 120 ms, et le scénario reste entier, gate, branches, sortie et boucle compris.

## Profondeur

Plans superposés décalés, faible changement d'échelle quand une surface intervient, ordre de plan qui suit l'activité, et une lumière fonctionnelle en encre qui marque où le travail a lieu.

**Aucune ombre molle de carte, aucun flou général, aucun verre, aucun glow, aucune particule, aucun néon, aucune parallaxe gratuite, aucune 3D.** Vérifié : zéro ombre et zéro rayon dans toute la scène.

## Mobile

390 × 844 et 375 × 812. Ce n'est pas la scène desktop réduite : le plateau devient une **séquence verticale**. Les faisceaux et les plans disparaissent, les surfaces deviennent une pile temporelle, le dossier reste au centre de la lecture.

Le **HumanGate passe en plein écran** avec des cibles tactiles pleines. Vérifié : il couvre plus de 90 % de l'écran. Aucun microtexte, rien sous 12 px, aucun tableau horizontal, aucun pinch-to-zoom.

## Signature Parrit

Encre, papier, rouge, et deux gris. **Barlow Condensed est fortement réduite** : le titre de la scène, la bascule d'état du dossier, la question du gate, la sortie. Elle ne porte aucun libellé courant. Geist Mono tient les états, les rôles et les métadonnées. Geist tient le corps.

Le rouge ne fait qu'une chose : marquer une intervention en cours ou une décision humaine.

## Limites

- **Les données sont fictives** et l'interface le dit en clair : `Specimen produit · Données de démonstration`. Aucun client, aucune personne réelle, aucun chiffre de résultat.
- **Aucune photographie n'est utilisée** dans la scène. Le portrait n'aurait pas apporté de responsabilité réelle ici : le propriétaire est nommé par sa fonction, ce qui est plus juste qu'un visage décoratif. C'est un écart assumé au regard de Concept D.
- **Le scénario est unique.** Un seul cas métier est mis en scène ; rien ne dit encore comment plusieurs cas cohabiteraient.
- **La scène n'est pas une homepage** et ne prétend pas en tenir lieu. Il manque tout ce qui vend : offre, méthode, preuve, prix, appel à l'action.
- **Le rapport texte/scène n'est pas arbitré.** La zone éditoriale est volontairement courte ; sa juste taille dépendra du wording définitif.

## Captures

`docs/design-system/qa/living-scene/`

Desktop : `desktop-01-initial` · `02-signal` · `03-parallele` · `04-convergence` · `05-humangate` · `06-sortie-validation` · `07-boucle` · `08-branche-rejet` · `09-clavier` · `10-reduced-motion`.
Mobile, aux deux formats : `01-signal` · `02-orchestration` · `03-humangate` · `04-sortie` · `05-feedback`.
Autres : `webkit-humangate` · `compare-conceptd-scene` · `sheet-scene-mobile` · `sheet-scene-components` · `sheet-scene-motion`.

**Figma.** Page `PARRIT — VISUAL RESET V2`, nouvelle zone `PRODUCT LIVING SYSTEM`, huit frames posées sous tout l'existant. Les quatorze frames précédentes (A, B, C, D, archives D, planches) ne sont pas touchées.

## Tests

| Test | Résultat |
|---|---|
| Living Technology | ✅ entrée, actions coordonnées (au moins deux agents et deux faisceaux simultanés), transformation, décision, sortie, boucle |
| Object Transformation | ✅ les quatre versions sont atteintes |
| Agent Usefulness | ✅ aucun agent sans intervention observable |
| Human Control | ✅ l'horloge s'arrête, le dossier n'évolue pas, aucune sortie avant décision |
| Branch | ✅ validation et rejet diffèrent par la sortie, la règle **et** la version |
| Feedback | ✅ la règle après retour diffère de la règle avant |
| Non-Dashboard | ✅ zéro ombre, zéro rayon |
| Non-Report | ✅ zéro tableau, zéro rangée de tableau |
| Reduced Motion | ✅ aucune durée longue, scénario complet |
| Clavier | ✅ décision atteignable et déclenchable au Tab puis Entrée, focus visible |
| Timers, erreurs, débordement | ✅ aucun timer survivant au démontage, aucune erreur console, aucun débordement |
| Chromium et WebKit | ✅ |
| `lint`, `tsc`, `build` | ✅ |

**Desire Test : il appartient à Paul.** Il n'est pas dans le harnais et ne peut pas être marqué automatiquement comme réussi.

## Arbitrages restant humains

1. **La scène provoque-t-elle l'envie ?** C'est la seule question qui compte, et elle ne se mesure pas.
2. **Le rapport entre la scène et le discours** : combien de texte autour, et où.
3. **La place de la photographie** : absente ici, à réintroduire ou non.
4. **Un scénario ou plusieurs** : un seul cas suffit-il à représenter Parrit.

## Hors périmètre

Homepage publique · design system · Brand OS · copy commerciale · offres · prix · photographie de Maxime · Concept D et ses tests.
