# Hermès — amélioration continue du site

**Statut : architecture documentée. Rien n'est construit. Aucune boucle autonome ne tourne.**

Ce document décrit une progression contrôlée. Il ne décrit pas un système en place, et il ne doit pas servir de justification pour en démarrer un sans validation.

---

## Principe directeur

> **Le design system est supérieur à l'optimisation ponctuelle.**

Une variante qui améliore un taux de clic mais dégrade la cohérence de marque est rejetée. Un gain local ne rachète jamais une perte systémique. C'est la seule règle qui n'a pas de seuil négociable.

---

## Les neuf étapes

| # | Étape | Ce qui se passe | Qui décide |
|---|---|---|---|
| 1 | **Observation** | collecte passive de signaux | machine |
| 2 | **Diagnostic** | corrélation signal → hypothèse de friction | machine |
| 3 | **Proposition** | formulation d'un changement, avec la métrique qui le motive | machine |
| 4 | **Simulation** | rendu de la variante hors production, captures, passage de la QA | machine |
| 5 | **Revue humaine** | acceptation, rejet ou reformulation | **Paul** |
| 6 | **Déploiement** | mise en ligne derrière un flag, exposition partielle | machine, après feu vert |
| 7 | **Mesure** | comparaison sur la métrique déclarée à l'étape 3 | machine |
| 8 | **Conservation ou rollback** | promotion de la variante, ou retour arrière | **Paul** |
| 9 | **Apprentissage** | mise à jour de la source de vérité et du journal | machine, validé |

Les étapes 5 et 8 ne sont **jamais** automatisables. Ce sont les deux verrous.

---

## Sources de données

Analytics · profondeur de scroll · clics · soumissions de formulaire · conversions · abandons · provenance · CRM · retours commerciaux · retours clients · contenu performant · recherche interne.

**Contrainte de vie privée.** Rien de ce qu'un visiteur écrit dans une entrée de workflow ne sort du périmètre déclaré. Aucune donnée personnelle n'alimente une proposition d'amélioration. Une proposition cite un **agrégat**, jamais un individu.

---

## Critères pour qu'une proposition soit recevable

Une proposition est rejetée d'office si elle ne porte pas :

1. **la métrique ou l'observation qui la motive**, chiffrée ;
2. le périmètre exact du changement ;
3. la variante rendue, avec captures 375/768/1024/1440 ;
4. le résultat de la QA (`ds-specimen-qa.mjs`) sur la variante ;
5. la métrique de succès et le seuil ;
6. la durée d'exposition prévue ;
7. **le rollback en une ligne**.

Une proposition sans chiffre est une opinion. Elle ne passe pas.

---

## Ce qu'Hermès ne peut pas proposer

- Un changement de **positionnement**, de **promesse principale**, d'**offre**, de **prix** ou de **mention légale**.
- Un changement de **token**. Les tokens se décident dans `03_COLOR_AND_TOKENS.md`, par un humain, avec un ADR.
- Une suppression de preuve, de périmètre, de propriétaire humain ou d'attribution.
- La suppression de l'attribution *« Hermes Agent — open source by Nous Research, MIT License »*.
- Toute modification qui ferait échouer le Structural Integrity Test ou le Generic AI Test.

---

## Permissions

| Surface | Droit d'Hermès |
|---|---|
| Lecture analytics agrégées | oui |
| Lecture de la source de vérité `docs/design-system/` | oui |
| Écriture d'une proposition dans un fichier dédié | oui |
| Ouverture d'une pull request derrière un flag | oui, sans merge |
| Merge | **non** |
| Déploiement | **non** |
| Écriture en base métier | **non** |
| Modification de token, de prix, d'offre, de mention légale | **non** |

---

## Journalisation

Chaque proposition, chaque décision humaine et chaque promotion ou rollback laisse une trace horodatée : proposition, motif chiffré, décision, auteur de la décision, résultat mesuré, état final.

Le journal se lit avec les mêmes composants que la trace publique (`HermesTraceLevel0`) : la boucle d'amélioration du site est elle-même un système Parrit, et elle se montre comme tel.

---

## Limites de sécurité

- **Aucune modification de production sans validation humaine, au départ et pour longtemps.**
- Chaque expérimentation est réversible, sans exception.
- Une expérimentation qui ne peut pas être annulée n'est pas lancée.
- Le flag est la seule voie de mise en ligne d'une variante.
- Une proposition qui touche à la marque sort du périmètre d'Hermès et devient un ADR humain.

---

## Instrumentation nécessaire, par ordre de dépendance

1. Événements analytics nommés et documentés sur les surfaces de conversion.
2. Un identifiant de variante propagé jusqu'à la mesure.
3. Un mécanisme de flag côté serveur, avec exposition partielle.
4. Un stockage de propositions versionné et lisible par un humain.
5. Le rendu automatisé des captures et le passage de la QA sur une variante.

**Rien de tout cela n'existe au 31/07/2026.** Le premier pas utile n'est pas Hermès : c'est l'étape 1 de la liste ci-dessus.
