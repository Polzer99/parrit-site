# VISUAL SOURCE OF TRUTH — APPROVED PENDING FINAL COPY

**Concept D poli** est la source visuelle de vérité de Parrit.ai.
**Statut : approuvé, en attente de la copy définitive.** Validé par Paul le 1er août 2026.

- **Direction :** Editorial Operating System
- **Implémentation de référence :** `src/app/art-direction-lab/concept-d/`
- **Rendu :** `/art-direction-lab/concept-d`
- **Figma :** page `PARRIT — VISUAL RESET V2`, frames `D — Desktop`, `D — Mobile`, `D — Components`, `D — Motion notes`
- **Commits :** `71ecaae` puis `8d3e3bc`, branche `ds/visual-reset-v2`

**L'exploration de directions artistiques est close.** Il n'y aura pas de concept E. A, B et C restent dans le laboratoire comme historique de décision, non comme options.

---

## Ce qui est figé

Ces éléments ne se rediscutent plus. Toute modification exige un nouvel ADR.

### Direction et grammaire

| | |
|---|---|
| Direction | **Editorial Operating System** |
| Grille | 12 colonnes, gouttière 24 px, largeur maximale 1320 px |
| Filets | 1 px pour la séparation, 2 px pour l'ouverture de bloc, 3 px pour une frontière forte. Un filet va toujours jusqu'au bord de sa zone |
| Formes | aucun rayon, aucune ombre, aucune carte |
| Rythme | alternance papier et encre, trois niveaux de section |
| Espacement | échelle unique `--s-1` à `--s-8` sur toute la couche technique |

### Typographie

| Famille | Rôle figé |
|---|---|
| **Barlow Condensed** 900 / 800 | grands titres, bascules, clés de registre, libellés d'objet et de nœud |
| **Geist Mono** | traces, états, sources, horodatages, identifiants, métadonnées, légendes |
| **Arpona** | citation, ligne du HumanGate, corps de Hermes, texte final |
| **Geist** | corps, explications, CTA |

Planchers de lisibilité : 12 px pour toute couche technique indispensable, 15 px pour le corps desktop, 16 px pour le corps et les CTA en mobile. `0.6875rem` n'est admis que sur trois métadonnées strictement secondaires.

### Palette

`#FFFDFA` papier · `#0C0C0D` encre · `#D1132F` rouge · deux gris fonctionnels, `#6E7079` et `#76777E`. Rien d'autre.

**Le rouge ne signale que deux choses : une intervention humaine requise, ou une relation active.** Il n'est jamais posé simultanément sur un titre, une icône et un bouton.

### Composants

**TechHero** · **ExecutionTrace** · **HumanGate** · **SystemTopology** · **ProofLedger** et sa colonne limite · **registre de mission** · **méthode montrant le transfert de responsabilité** · **HermesActivity** · **BeforeAfterFlow** · **FounderValidation** · **TrustRail**.

### Photographie

**Documentaire, non générative.** Le portrait part toujours d'une photographie réelle. Opérations autorisées : recadrage, détourage technique, décontamination de contour, désaturation, contraste, grain, trame. Interdit : régénération du visage, modification de la mâchoire, du sourire, des yeux, de la morphologie, reconstruction générative des cheveux.

`paul-authority-branded.png` et `paul-working-branded.png` restent **non câblés**, le visage n'y étant pas fidèle.

### Mobile

La recomposition est figée composant par composant : trace verticale à une étape lisible à la fois, registre de mission en blocs, ProofLedger priorisé sur élément, état et limite, topologie en séquence verticale à liens continus, TrustRail empilé, fondateur en buste cadré.

### Mouvement

160 ms pour l'interface, 380 ms pour le contenu, 1 200 ms pour la démonstration système. Aucune particule, parallaxe, glitch, néon ni texte en mouvement. `prefers-reduced-motion` coupe animations et transitions **mais laisse la relation rouge tracée**, parce qu'elle porte du sens.

### Probité

Tout bloc de démonstration porte son label. Aucun mockup n'est présenté comme une capture client. Aucun chiffre de résultat n'est publié tant qu'il n'est pas mesuré. L'attribution Hermes est obligatoire, mot pour mot : *Hermes Agent, open source by Nous Research, MIT License.*

---

## Ce qui n'est PAS figé

Ces points bougeront avec la copy définitive. Ils ne sont pas des écarts au canon.

- les **retours à la ligne**, y compris ceux du titre du hero
- la **quantité exacte de rouge dans les titres**
- les **hauteurs dépendantes du texte**, donc la hauteur de page
- la **densité des blocs éditoriaux**
- l'**ordre final des sections commerciales**

---

## Comment la copy définitive entre

**Un seul fichier :** `src/app/art-direction-lab/concept-d/copy.ts`.

C'est aujourd'hui le seul point d'entrée du texte dans la page. Il ne fait que réexporter le socle partagé du laboratoire. Il porte le contrat `CopyContract`, qui décrit une **forme**, pas un contenu : il ne contraint ni les mots, ni la longueur, ni le nombre de cas d'usage.

1. Déposer le wording validé, par exemple `copy.final.ts`, conforme à `CopyContract`.
2. Changer l'import dans `copy.ts`.
3. Lancer `node scripts/concept-d-qa.mjs`.

Une livraison incomplète **ne compilera pas** : l'annotation de type l'interdit.

**Aucune copy n'est écrite ni réécrite dans cette tranche.** La prochaine modification de texte ne commencera qu'après réception du wording validé par Paul.

---

## Garde-fou automatique

`scripts/concept-d-qa.mjs` contient désormais un **test de gel du canon**. Il échoue si :

- l'un des composants canoniques disparaît du rendu
- le papier, l'encre ou le rouge changent de valeur
- la grille cesse d'avoir 12 colonnes
- les grands titres quittent Barlow Condensed, ou la couche technique quitte Geist Mono
- un rayon ou une ombre apparaît quelque part
- l'attribution Hermes disparaît
- un portrait brandé est câblé à la place de la photographie réelle

Il **ne juge pas le texte** : la copy peut changer entièrement sans le faire échouer. C'est exactement ce qu'on attend d'un canon visuel gelé en attente de wording.

---

## Ce qui reste hors périmètre

Homepage publique · autres langues · Brand OS · les quinze documents du design system · concepts A, B et C · le prix affiché, dont l'arbitrage avec `TRUTH.md` §6.1 reste ouvert · le portrait de Maxime, en attente d'un fichier source.
