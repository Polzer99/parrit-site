# PRODUCT-LIVING-SYSTEM-SCENE-V2-PREMIUM-V1

**Tranche du 1er août 2026.** Passe de finition produit sur la scène V2.
**Aucune direction n'est déclarée approuvée.** Aucun ADR n'est créé.

| | Route | Statut |
|---|---|---|
| **V1** | `/art-direction-lab/product-living-scene` | conservée, harnais vert |
| **V2** | `/art-direction-lab/product-living-scene-v2` | conservée, harnais vert |
| **Premium** | `/art-direction-lab/product-living-scene-v2-premium` | variante de finition |

Implémentation : `src/app/art-direction-lab/product-living-scene-v2-premium/`

---

## Arbitrage

V1 échouait parce qu'elle ressemblait à un rapport interactif. V2 a corrigé la métaphore et fonctionne comme un produit : le moteur, les surfaces, l'objet modulaire, le HumanGate, la sortie distribuée et la boucle d'amélioration sont validés **comme architecture de recherche**.

Le Desire Test n'est toujours pas gagné : V2 ressemble encore à un wireframe avancé, à un debugger, à un outil interne pour opérateurs. Cette tranche ne change **rien** à ce qui se passe. Elle change comment cela se vit.

## Défauts de V2 corrigés

| Défaut V2 | Traitement |
|---|---|
| Surfaces gris clair proches du wireframe | trois niveaux — active, contextuelle, disponible — et deux blancs distincts, chaud pour l'actif, froid pour le contexte |
| Cadres et séparateurs nombreux | **31 cadres en V2, 2 en premium** (mesuré) : contraste de surface et profondeur à la place des bordures |
| Faible différenciation de profondeur | lumière localisée sous l'objet, châssis en dégradé, ombres dures courtes, liseré haut sur la surface active |
| Noyau ressemblant à une grille de blocs | un emplacement vide n'a plus ni fond ni cadre : seuls les modules renseignés existent visuellement |
| Beaucoup de texte simultané | **84 blocs de texte en V2, 37 en premium** (mesuré) : une seule surface détaillée à la fois |
| HumanGate en console latérale | question, manque, action proposée, une décision évidente, trois alternatives en retrait |
| Interactions d'administration | contrôles intégrés au rail ; sur mobile, une commande visible et le reste révélable |
| Grand mot « Engagé » | **supprimé.** Le commit est une impulsion lumineuse, un verrouillage et trois confirmations décalées |
| Top bar de debug | cinq informations : Parrit, dossier, statut, version, démonstration |
| Hiérarchie de lumière insuffisante | douze tokens expérimentaux de lumière et de texte |
| États inactifs trop présents | les surfaces sans rôle se rétractent en réserve |

## Architecture conservée

`scenario.ts`, `useScene.ts`, et les dérivations `useRenderer.ts` de la V2 sont consommés **tels quels**. Dix états, timeline, quatre branches, pause, rejouer, pas à pas, mouvement réduit, clavier, huit modules, six surfaces, sortie distribuée, règle `R-014` dans Knowledge, occurrence suivante, rareté du rouge, arrêt réel au HumanGate.

`usePremium.ts` n'ajoute que de la hiérarchie : niveau de surface, surface dominante, modules prioritaires, moment d'impulsion, condition d'inspection. **Aucune valeur fonctionnelle n'y est redéfinie.**

## Nouvelle hiérarchie

**Trois niveaux de surface.** `active` : anatomie complète, profondeur supérieure, interaction possible — **une seule à la fois**, choisie par la phase. `contextuelle` : une information principale, rien d'autre. `disponible` : présence minimale, elle revient si elle sert.

**Trois niveaux d'information.** `n1` l'information métier, toujours. `n2` état, origine, confiance, sur les surfaces actives et contextuelles. `n3` version, trace, métadonnées — **jamais visible par défaut**, révélé au survol, au focus, ou en pause. Vérifié : zéro élément de niveau 3 affiché au repos.

## Surfaces

Anatomies distinctes : Email (objet, extrait, fragment sélectionné, intention, action), CRM (relation, chronologie, statut, dernière interaction), Web (identité, vérifications, source), Knowledge (règle active, version, propriétaire, cas comparables), Internal data (permission, cause du blocage, demande d'accès **réellement jouable** au moment du gate), Calendar (disponibilité, contrainte, proposition, commit).

## Objet central

Un châssis, pas une grille. Les modules ont des poids différents et **les prioritaires prennent temporairement plus de place** : au gate le contexte manquant, après décision l'action et la décision.

Les poids de rangée vivent dans **une seule table**, qui produit à la fois le `grid-template-rows` et les ancres des tracés. Les séparer revenait à dessiner la contradiction entre deux points qui n'existaient plus une fois les rangées redimensionnées — c'était le cas au premier jet.

Les dépendances ne s'affichent qu'au focus d'un module. En permanence, elles retransformaient l'objet en schéma.

## HumanGate

Cinq temps : la question, l'information manquante, l'action proposée, les conséquences comparables, la décision.

**Une action évidente** — 97 px de haut — et **trois alternatives** à environ 49 px, soit un rapport de 2. Chaque alternative annonce sa conséquence avant le clic ; le risque, la version, la surface consultée et les deux formulations de « Corriger » s'ouvrent avec « Comparer les conséquences ».

Le gate couvre 21 % de l'écran et ne recouvre pas l'objet. La photographie documentaire du propriétaire est en 28 px et **facultative** : une constante la retire sans rien casser.

## Commit

Pas de mot géant. Le statut passe à **Validé**, le module `DEC` se verrouille, les modules dépendants confirment leur état par un coin coupé, une lame de lumière traverse la scène **une fois** en 700 ms, la version passe à v3, puis Email, Calendar et CRM reçoivent leur confirmation **décalées de 0, 140 et 280 ms**. C'est ce décalage qui rend le commit lisible plutôt que spectaculaire.

## Top bar

Parrit · Dossier d'opportunité `OPP-2041` · statut · version · Données de démonstration. Cinq blocs, 48 px de haut. Le reste est passé dans l'inspector, à la demande.

## Mouvement

Départ vif, arrivée posée (`cubic-bezier(.16,.84,.44,1)`), verrouillage net (`cubic-bezier(.2,0,0,1)`), trois durées seulement : 130 ms pour l'interface, 300 ms pour l'objet, 560 ms pour la scène. Une micro-pause de 700 ms est tenue entre la décision et sa conséquence.

## Mobile

Sept chapitres plein écran, **vrais écrans 390 × 844 et 375 × 812**. Chacun a un numéro, un titre, l'objet en bande, une seule surface active et une transformation. Le gate mobile montre une action évidente ; les autres suites sont révélables et **ne s'affichent pas toutes en même temps**. Le rail est une barre de progression avec une commande visible, les autres derrière `···`.

## Tests

Harnais dédié : `node scripts/living-scene-premium-qa.mjs`. Les harnais V1 et V2 restent séparés et verts.

| Test | Résultat |
|---|---|
| **Premium Product** | ✅ mesuré par comparaison à la V2 sur la même phase : 2 cadres contre 31, 37 blocs de texte contre 84 |
| **Information Hierarchy** | ✅ zéro métadonnée de niveau 3 au repos, état et valeurs métier lisibles |
| **Surface Focus** | ✅ exactement une surface active, échantillonné sur quatre phases |
| **Commit Satisfaction** | ✅ aucun texte au-dessus de 40 px, statut Validé, `DEC` verrouillé, v3, impulsion présente |
| **HumanGate Hierarchy** | ✅ une action principale, trois alternatives, rapport de surface ≈ 2 |
| **Top Bar Product** | ✅ 5 blocs, 48 px |
| **Mobile Premium** | ✅ 7 chapitres autonomes, rail atteignable, branches révélables, cibles ≥ 44 px |
| **Product First** | ✅ sans Barlow, grain, photo ni mentions, la scène tient |
| Living Technology · Object Transformation · Agent Usefulness | ✅ |
| Human Control · Branch · Distributed Output · Living Feedback | ✅ |
| Red Scarcity · profondeur · reduced motion · clavier | ✅ |
| Timers, erreurs, débordement, Chromium, WebKit, `lint`, `tsc`, `build` | ✅ |

**Desire Test : il appartient à Paul.** *« Est-ce que cette expérience me donne envie de brancher Parrit à mon entreprise ? »*

## Défauts trouvés en chemin

- **La V2 livrée au commit `ecaa821` portait une erreur de lint** — un `ref` transitant par la valeur de retour du hook, donc lu pendant le rendu. Corrigé à la source : le ref vit désormais dans le composant qui possède le conteneur, et le chapitre visé se retrouve par son attribut. La V2 et le premium en bénéficient.
- **Le rail de lecture mobile de la V2 tombe sous la ligne de flottaison** : la colonne des chapitres n'est pas bornée en hauteur. Corrigé dans le premium (`height: 100svh`), **pas dans la V2**, qui reste telle qu'elle a été arbitrée. À trancher.
- Le bloc « Corriger » avec ses deux formulations visibles pesait plus lourd que l'action principale et cassait la hiérarchie du gate. Les formulations sont passées dans la couche révélable.

## Arbitrages restant humains

1. **Le Desire Test.** Premium contre V2, et premium dans l'absolu.
2. **Le renversement encre / papier**, toujours ouvert : il s'écarte du canon papier du design system.
3. **La surface dominante par phase** est un choix éditorial déguisé en règle. Il se discute phase par phase.
4. **La place du texte** : il n'en reste presque plus.
5. **La photographie** au gate : garder, agrandir, retirer.
6. **Faut-il rétroporter la finition dans la V2**, ou garder trois renderers vivants.

## Hors périmètre

Homepage publique · design system · Brand OS · copy commerciale · offres · prix · photographie de Maxime · machine d'état · scénario · branches.
