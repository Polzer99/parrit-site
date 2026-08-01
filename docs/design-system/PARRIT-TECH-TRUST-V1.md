# PARRIT-TECH-TRUST-V1

**Tranche du 1er août 2026.** Direction visuelle seule. **Aucun texte canonique n'a été modifié.**
Concept D ajouté au laboratoire. A, B et C ne reçoivent qu'un accès vers D.

---

## Objectif

Passer d'une affiche à un **operating system éditorial** : une page qui se lit d'abord comme une entreprise technologique, dont la singularité éditoriale apparaît ensuite, et dont la confiance vient de ce qu'elle montre, pas de ce qu'elle promet.

Répartition visée et tenue : **55 % système, 25 % éditorial, 20 % humain**. La photographie ne porte jamais l'identité seule.

## Éléments hérités de A, B et C

| Repris de | Quoi |
|---|---|
| **B** | le langage d'exécution, les traces, entrées et sorties, les états, les validations humaines, les relations entre systèmes |
| **A** | la chaleur, la présence de Paul, la lisibilité commerciale, le sentiment que de vraies personnes répondent |
| **C** | la force de la condensée, quelques ruptures de rythme, les bascules encre |

**Non repris :** le froid de B, dont l'offre arrivait trop tard et dont la page ne montrait aucun visage avant le bas. La dépendance photographique de A, où le portrait occupait la moitié du premier écran. La posture de C, où la typographie disait plus que la page ne prouvait.

## Grammaire visuelle

**Grille.** Douze colonnes, gouttière 24 px, largeur maximale 1320 px. Elle n'est jamais dessinée : elle se lit dans les filets, les index et les changements de densité. Le hero est asymétrique, 7 colonnes d'éditorial et 4 de système, séparées par une colonne vide. Aucune section n'est parfaitement symétrique.

**Rythme.** Ouverture papier · immersion encre sur la preuve · retour papier sur le problème · zone technique dense sur les cas et la topologie · respiration humaine sur la méthode · encre à nouveau sur Hermes · papier sur le registre · encre sur le fondateur et le CTA final.

**Typographie.** Quatre familles, jamais quatre dans un même bloc.

| Famille | Rôle tenu |
|---|---|
| Barlow Condensed 900 / 800 | titres, bascules, clés de preuve, libellés de nœuds et d'états |
| Arpona | citation, ligne du HumanGate, corps de Hermes, texte final |
| Geist | corps, explications, CTA |
| Geist Mono | états, sources, temps, identifiants, métadonnées, légendes |

**Palette.** Encre `#0C0C0D`, papier `#FFFDFA`, rouge `#D1132F`, et deux gris fonctionnels seulement (`#6E7079` pour les métadonnées, `#9A9BA1` pour les filets appuyés). Rien d'autre.

**Le rouge ne fait qu'une chose : signaler qu'un humain doit intervenir, ou tracer une relation active.** Il n'est jamais posé sur un titre, une icône et un bouton en même temps. Sur la page entière : le filet de l'eyebrow, l'étape en attente, le HumanGate, la colonne de décision humaine, la relation de topologie, la bascule avant/après, deux états du journal, deux états du registre, le CTA final.

**Matière.** Le halftone a disparu des zones de système : il ne survit que sur le portrait tramé, qui n'est pas utilisé dans D. Aucune plaque de collage. Le grain n'est pas appliqué : à cette densité de filets il salissait la lecture. C'est un écart assumé par rapport à A et C, et il est réversible.

## Composants

| Composant | Ce qu'il fait |
|---|---|
| **TechHero** | éditorial à gauche, panneau d'exécution à droite, tenu par des filets et posé sur la même grille. Pas une carte SaaS : ni rayon, ni ombre, ni fond propre |
| **ExecutionTrace** | une action décomposée : entrée, cinq étapes horodatées, validation, sortie, propriétaire, état. Le rail d'état est plein si terminé, rouge s'il attend, hachuré s'il est bloqué |
| **SystemTopology** | cinq couches, données, règles, agents, humain, logiciels, reliées par un filet rouge à pointe qui traverse la gouttière. Aucun nœud rond flottant |
| **HumanGate** | le moment précis où la chaîne s'arrête. Filet rouge, état, visage, propriétaire nommé, attente datée. C'est le signe distinctif de la page |
| **ProofLedger** | cinq colonnes : élément, source, état, dernière vérification, **limite**. La colonne « limite » est la plus large de la table |
| **BeforeAfterFlow** | même matière des deux côtés, l'avant est barré, une bascule rouge à pointe traverse. Pas deux cartes génériques |
| **HermesActivity** | journal daté avec sorties produites, validation requise, action bloquée, retour effectué. Attribution portée dans le bloc |
| **FounderValidation** | Paul associé à un propriétaire, une responsabilité et une méthode nommés, puis les trois mois. Pas un « mot du fondateur » |
| **TrustRail** | cinq mentions sobres, sous le hero. Aucune certification, aucune conformité revendiquée |

## Mouvement

| Autorisé | Durée |
|---|---|
| l'étape en attente pulse | 1 200 ms, boucle |
| la relation rouge se trace | 380 ms, une fois |
| fond de ligne au survol d'un cas | 160 ms |
| bascule du CTA, encre vers rouge | 160 ms |
| lien secondaire, gris vers rouge | 160 ms |

Aucune particule, aucune parallaxe, aucun glitch, aucun néon, aucun texte en mouvement. `prefers-reduced-motion` coupe animations et transitions, **mais laisse la relation rouge tracée** : elle porte du sens, pas de la décoration. Vérifié automatiquement.

## Confiance

**Ce qui la produit, visuellement.** Chaque chaîne nomme son propriétaire. Chaque bloc de démonstration porte son label. Chaque ligne du registre porte sa source **et sa limite**. Le journal montre autant d'actions bloquées et de retours que de sorties produites. Le rail rappelle que les systèmes existants sont conservés et qu'un retour arrière est possible.

**Probité, vérifiée par le harnais.** Quatre labels obligatoires sont présents : `Exemple de trace`, `Interface de démonstration`, `Flux type`, `Specimen`. Aucun mockup n'est présenté comme une capture client. Un contrôle automatique cherche tout chiffre de résultat non vérifié dans la page : **aucun**. La ligne « Résultats chiffrés » du registre dit explicitement qu'aucun n'est publié tant qu'il n'est pas mesuré.

**Paul.** Deux apparitions, pas davantage. Une vignette de 60 px dans le HumanGate, associée à une validation en attente. Une silhouette dans le bloc fondateur, associée à un propriétaire, une responsabilité et une méthode. Jamais décorative, jamais en portfolio.

**Hermes.** Attribution portée deux fois, dans le bloc et en pied de page, mot pour mot : *Hermes Agent, open source by Nous Research, MIT License.* Jamais présenté comme une technologie Parrit.

## Limites

- **Le grain papier n'est pas appliqué** dans D. À cette densité de filets il dégradait la lecture. Écart assumé, réversible.
- **Les horodatages sont relatifs** (« il y a 4 min »). Ils décrivent une forme de trace, pas un relevé. Le label `Exemple de trace` le dit.
- **Le portrait de référence** est la photographie du 01/08, prise en salle. Le détourage est propre après correction du halo et de la dominante verte, mais le bord d'épaule reste légèrement en escalier à 200 %, la définition du masque étant limitée par la source.
- **Deux portraits brandés ont été produits** à partir de cette même photographie, `paul-authority-branded` et `paul-working-branded`. Ils ne sont **pas câblés** : le modèle a affiné la mâchoire et supprimé le sourire. Sur une page dont le sujet est la confiance, un visage approximatif est un défaut. Décision à Paul.
- **Le prix reste affiché**, comme le demandait la tranche précédente, alors que `TRUTH.md` §6.1 l'interdit sur la home publique. Le laboratoire n'est pas publié. Arbitrage à rouvrir avant toute mise en production.
- **Maxime** : la photographie a été transmise en image, sans fichier sur le disque. Son portrait n'a donc pas pu être produit.

## Captures

`docs/design-system/qa/visual-reset-v2/`

| Fichier | Contenu |
|---|---|
| `concept-d-hero-1440x900` | premier écran desktop |
| `concept-d-1440x900` | pleine page desktop, 5 817 px |
| `concept-d-hero-390x844` · `concept-d-390x844` | premier écran et pleine page mobile |
| `concept-d-hero-375x812` · `concept-d-375x812` | second format mobile |
| `d-detail-hero-200` · `d-detail-panel-200` · `d-detail-gate-200` · `d-detail-trace-200` | détails rendus à 200 % |
| `d-state-hover` · `d-state-focus` | états d'interaction |
| `d-reduced-motion-1440x900` | version sans mouvement |
| `compare-old` · `compare-b` · `compare-d` | ancien site, concept B, concept D, même cadrage |
| `sheet-d-components` · `sheet-d-motion` | planches Figma |

**Figma.** Page `PARRIT — VISUAL RESET V2`, quatre frames ajoutées sous la rangée historique : `D — Desktop`, `D — Mobile`, `D — Components`, `D — Motion notes`. Les six frames historiques sont vérifiées inchangées, toujours en `y = 0`.

## Tests

| Test | Résultat |
|---|---|
| Tech Credibility | trace, états, sources, propriétaires, topologie et journal sont lisibles sans lire un seul paragraphe |
| Trust | aucun chiffre de résultat, quatre labels de démonstration présents, aucune fausse interface client |
| Non-Template | grille asymétrique, aucun rayon, aucune ombre, aucune carte, aucun graphique. Changer les couleurs ne donne pas un SaaS |
| Editorial Lineage | condensée en capitales, un seul rouge fonctionnel, filets, index, mono. La filiation newsletter tient |
| Human Presence | deux apparitions, toutes deux attachées à une responsabilité |
| Detail | inspecté à 100 % et 200 % sur quatre composants. Un défaut trouvé et corrigé : une bande de papier de 4 rem séparait deux zones encre |
| Débordement, `H1`, tiret cadratin, CTA, accents, chasse | ✅ sur les quatre concepts, cinq largeurs, Chromium et WebKit |
| Hover, focus, reduced motion | ✅ aucun composant à l'état navigateur par défaut |
| `tsc`, `lint`, `build` | ✅ |

## À arbitrer

1. **Portraits brandés** : les câbler après une nouvelle passe plus fidèle, ou rester sur la découpe réelle.
2. **Maxime** : déposer le fichier pour produire son portrait.
3. **Le grain** : le réintroduire à très faible opacité dans D, ou l'assumer absent.
4. **Le prix** : rouvrir `TRUTH.md` §6.1 avant toute mise en production.

## Hors périmètre

Wording canonique · concepts A, B et C · Brand OS · les quinze documents du design system · homepage publique · autres langues.
