# CONCEPT D — REJECTED AS FINAL DIRECTION, RETAINED AS RESEARCH PROTOTYPE

**Statut : `REJECTED AS FINAL DIRECTION — RETAINED AS RESEARCH PROTOTYPE`.**
Corrigé le 1er août 2026, après inspection réelle du site et de l'enregistrement de navigation par Paul.

> **Ce document portait précédemment le statut `APPROVED PENDING FINAL COPY`. Ce statut était faux.** Il découlait d'une instruction devenue obsolète, validée avant que Paul n'ait navigué dans le prototype. La décision terrain la plus récente prévaut. Voir **ADR-019**, qui supersède **ADR-018**.

- **Ce que Concept D est :** un prototype de recherche documenté, complet, testé, réutilisable.
- **Ce que Concept D n'est pas :** la direction visuelle finale de Parrit.ai, ni une référence obligatoire pour la homepage.
- **Implémentation :** `src/app/art-direction-lab/concept-d/` · rendu sur `/art-direction-lab/concept-d`
- **Aucune migration publique ne doit être dérivée automatiquement de D.**

**Aucun travail n'a été supprimé.** Les captures, les composants, les recettes d'image et les tests restent en place.

---

## Diagnostic

### Ce que Concept D a apporté

- une meilleure singularité éditoriale
- un langage de trace
- le HumanGate
- une présence explicite du contrôle humain
- une meilleure rigueur typographique
- une photographie plus authentique

### Pourquoi il n'est pas la direction finale

Il reste trop proche :

- d'un rapport éditorial
- d'une publication imprimée devenue site
- d'une interface statique de contrôle
- d'une succession de tableaux, de filets et de registres

Il ne donne pas encore suffisamment la sensation :

- d'un produit technologique vivant
- d'agents réellement en action
- de logiciels qui communiquent
- d'objets qui changent d'état
- d'une technologie désirable
- d'une expérience fluide
- d'une profondeur de produit
- d'une entreprise technologiquement très avancée qui rend les choses simples

**Le problème restant n'est pas seulement le wording.** C'est encore un problème de direction d'expérience et de représentation du produit.

---

## Ce qui peut être réemployé

Réutilisable dans une direction future, **sans obligation** et sans imposer la composition de D.

| Élément | Pourquoi il tient |
|---|---|
| **HumanGate** | le moment où le système s'arrête et où un humain nommé tranche |
| **Attribution Hermes** | obligation permanente, indépendante de toute direction |
| **Propriétaire humain** | une chaîne sans propriétaire n'est pas crédible |
| **Sources et limites explicites** | la colonne « limite » du registre de preuves |
| **Traçabilité** | ce qui s'est passé, quand, et ce qui peut être défait |
| **Photographie documentaire réelle** | non générative, fond réel conservé |
| **Refus des faux chiffres et des fausses interfaces** | labels de démonstration obligatoires |
| **Distinction automatique / humain** | le rouge ne signale qu'une intervention humaine |
| **Certains détails de mouvement** | durées courtes, mouvement porteur de sens, reduced motion respecté |
| **Certains traitements typographiques éditoriaux** | la singularité Parrit vient de là |

## Ce qui ne doit pas être repris automatiquement

Ces choix appartiennent à D. Une direction future n'a pas à les reconduire.

- l'omniprésence de Barlow Condensed
- les tableaux comme langage principal
- l'esthétique de rapport
- la forte densité de métadonnées
- l'alternance systématique papier et encre
- la structure très plate
- des sections principalement statiques
- une logique de produit **racontée** plutôt que **vécue**

---

## Précédence

**Aucune direction visuelle finale n'est actuellement approuvée.**

La homepage publique reste la référence de production jusqu'à décision et migration explicites. Cela n'en fait pas la cible visuelle future : ni Level 0, ni les templates commerciaux Figma ne sont rétablis comme direction cible.

La prochaine exploration part du produit vivant, pas du registre éditorial. Voir [`PRODUCT-LIVING-SYSTEM-BRIEF.md`](./PRODUCT-LIVING-SYSTEM-BRIEF.md).

---

## Tests

`scripts/concept-d-qa.mjs` contient un **Concept D Regression Test**, anciennement présenté comme un test de gel canonique. Ce cadrage était faux et a été corrigé.

Le test vérifie **uniquement le prototype** : sa reproductibilité, la présence de ses composants, son accessibilité, et l'absence de régression involontaire. Il s'exécute sur la seule route `/art-direction-lab/concept-d`.

Il **ne juge aucune direction future**. Une direction qui utilise une autre composition, donne plus de profondeur au produit, réduit la place de Barlow Condensed, modifie la grille, représente autrement les agents, change le rythme des sections ou abandonne certains composants de D **ne peut pas le faire échouer**.

## Copy

`src/app/art-direction-lab/concept-d/copy.ts` reste le point d'entrée de texte **du prototype Concept D uniquement**. Ce n'est pas le contrat de la future homepage. Aucune copy n'a été modifiée.

---

## Hors périmètre de cette correction

Le prix et l'arbitrage `TRUTH.md` §6.1 · la photographie de Maxime · la copy finale · la migration du design system · la homepage publique. Aucun de ces sujets ne bloque la correction de gouvernance.
