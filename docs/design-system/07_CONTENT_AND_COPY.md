# 07 — Contenu et copywriting

Le design system porte aussi les règles de contenu : une page peut respecter tous les tokens et sonner faux.

## Style Parrit

Première personne quand Paul s'exprime · phrases courtes · **une idée par ligne** · langage concret · verbes d'action · preuves · situations de terrain.

Pas de jargon inutile · pas de promesses vagues · pas de ton de cabinet · pas de condescendance · pas de formulation gonflée · **pas de texte manifestement produit par une machine**.

## Dire ceci

- ce que l'agent **reçoit** ;
- ce qu'il **fait** ;
- ce qu'il **renvoie** ;
- ce qui reste **contrôlé par l'humain** ;
- ce qui **change concrètement** ;
- le **temps économisé** ;
- les **erreurs évitées** ;
- le **système déployé** ;
- les **prochaines étapes**.

## Bannir ceci

« révolutionner » · « transformer votre business grâce à l'IA » · « libérer le potentiel » · « solution innovante » · « futur du travail » · « puissance de l'intelligence artificielle » · « automatisation intelligente de bout en bout ».

Plus largement : les adjectifs creux (innovant, puissant, révolutionnaire), les transitions artificielles (de plus, en outre, par ailleurs), la symétrie parfaite des listes, les conclusions mécaniques.

## Le tiret cadratin

**`—` est interdit** dans tout contenu destiné à un client, un prospect ou le public. C'est le tell IA numéro un. `prooflint.py` bloque le build là-dessus.

## Ce qu'on n'invente jamais

Une preuve · un ROI · une métrique · un nom de client · une faisabilité. Jamais décrire un agent comme un employé magique.

Un chiffre non vérifié dans une section de preuve annule la crédibilité de toute la page. En cas de doute : vérifier en ligne, ou retirer le chiffre.

## Nommage des clients

Pas de nom de client **dans le texte** — les cas sont anonymisés. Le mur de logos clients **visuel** est autorisé.

## Patterns éditoriaux

**Le chapô signature.** Première phrase en gras, suite en encre atténuée. C'est une signature Parrit, pas un effet : la phrase en gras porte la thèse, la suite la qualifie.

**Le bandeau de conditions.** Sous un hero, trois à quatre faits courts (périmètre, format, contrainte). Des faits, jamais des arguments.

**Le périmètre négatif.** Dans une preuve, dire ce que l'agent **ne fait pas** : « aucun envoi automatique », « aucun accès CRM en écriture ». C'est plus convaincant que ce qu'il fait.

**L'avant → après.** Formuler l'état antérieur comme le client le dit, pas comme un cabinet le reformule.

## Titres

Un titre porte l'idée dominante de sa section. Si tu hésites entre deux titres, c'est que tu as deux sections.

**Le rouge dans un titre, côté rédaction.** Un seul segment rouge par titre. Ce segment doit porter une **cause**, un **problème**, une **transformation**, un **résultat** ou le **sujet principal**. Jamais un mot choisi pour l'effet visuel ou pour casser une ligne.

Test d'écriture : relis ton titre **entièrement en noir**. S'il perd son sens, le rouge portait de l'information à lui seul et le titre est mal écrit. Réécris la phrase plutôt que de déplacer la couleur. Règle complète : `03_COLOR_AND_TOKENS.md`, ADR-012.

Attention aux capitales accentuées : plus un titre est long en français, plus le risque de collision d'accents augmente. Voir `02_TYPOGRAPHY_AND_GRID.md`.

## Multilingue

Français principal, anglais secondaire, plus `pt-BR` et `zh-CN`. Les versions restent **sémantiquement équivalentes**. Une traduction ne devient jamais une réécriture stratégique non documentée.

Éditer une langue implique de répliquer dans les quatre. C'est une contrainte de cohérence, pas une formalité.

## Gate avant publication

Tout contenu qui sort chez un client, un prospect ou le public passe la skill `anti-ia-tells` et `prooflint.py`. Le design system ne remplace pas ce gate : il s'y ajoute.
