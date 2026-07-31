# 06 — Blueprint de la homepage

> ⚠️ **Tension signalée le 31/07/2026, non tranchée.** Le hero décrit ci-dessous inclut « portrait de Paul ou scène opératoire avec espace négatif ». Le Design System pose depuis le 31/07 que **le hero canonique par défaut est sans image** (`docs/design-system/PARRIT-DESIGN-SYSTEM.md` §2 et §9), et que le canon Figma lui-même est un hero sans photographie.
>
> Les deux se défendent : ce blueprint décrit une page riche, le Design System décrit un socle qui doit tenir seul. La résolution probable est que le portrait devienne une **variante média** ajoutée après validation du niveau 0, jamais le point de départ.
>
> **Ce document n'est pas modifié.** L'arbitrage appartient à la tranche `HOMEPAGE-LEVEL0-V1`, pas à un import.

## Objectif

Faire comprendre en moins de dix secondes :

1. ce que Parrit déploie ;
2. à partir de quoi ;
3. ce que le visiteur obtient ;
4. pourquoi le système est contrôlé ;
5. quelle action réaliser maintenant.

Le parcours principal ne commence pas par « choisir une offre ». Il commence par « décrire une tâche réelle ».

## Ordre canonique

### 1. Hero : promesse + workflow

Label : `PARRIT · AGENTS EN PRODUCTION`

Titre :

> Passez d’une IA qui parle à des agents qui exécutent.

Sous-titre :

> Décrivez une tâche concrète. Hermès la qualifie, nous cadrons le premier test et mettons le système entre les mains de vos équipes.

Composants :

- `EditorialHeadline`
- `HermesCaseInput`
- `PrimaryCTA`
- `SecondaryCTA`
- portrait de Paul ou scène opératoire avec espace négatif

Preuve compacte :

`Périmètre défini · accès contrôlés · trace d’exécution · propriétaire nommé`

### 2. Trust strip

Trois à cinq faits vérifiables seulement :

- périmètre ;
- contrôle des accès ;
- trace ;
- propriétaire humain ;
- transfert aux équipes.

Aucun vanity metric non prouvé.

### 3. Trois cas Input → Output

Chaque cas contient :

- contexte métier ;
- input avant ;
- output attendu ;
- actions de l’agent ;
- validation humaine ;
- état réel : prototype, pilote ou production ;
- changement mesuré lorsque disponible.

Les secteurs doivent refléter les cas réellement maîtrisés par Parrit.

### 4. Démonstration Hermès

Montrer une interaction réaliste :

1. description de la tâche ;
2. une à trois questions ;
3. résumé de faisabilité ;
4. premier test jouable ;
5. limite et dépendance ;
6. CTA adapté.

Si le backend n’existe pas encore, utiliser une fixture explicitement présentée comme démonstration, derrière une interface typée.

### 5. Trace d’exécution

Montrer :

- trigger ;
- actions ;
- outils ;
- gate humaine ;
- résultat ;
- chemin d’exception.

La trace doit être pédagogique. Pas de faux terminal décoratif.

### 6. Preuve client

Une preuve vaut mieux que six logos sans contexte.

Structure :

- douleur ;
- système ;
- résultat ;
- statut ;
- citation ou trace ;
- niveau d’anonymisation.

### 7. Méthode Parrit

Titre :

> Pas de grand soir. Une boucle courte jusqu’à la production.

Étapes :

1. observer le travail réel ;
2. définir l’input et l’output ;
3. tester sur un périmètre fermé ;
4. mettre en production ;
5. transférer et améliorer.

### 8. Modes d’intervention

Les offres apparaissent seulement après le mécanisme et la preuve :

- transformation / superapp interne ;
- déploiement d’un agent ou d’un workflow ;
- accompagnement, coaching et autonomie.

Chaque offre doit indiquer le type de problème auquel elle correspond, pas seulement son nom.

### 9. Paul et le réseau

Objectif : créer de la confiance sans culte du fondateur.

Montrer :

- Paul sur le terrain ;
- sa logique d’exécution ;
- le réseau d’experts lorsque nécessaire ;
- les limites honnêtes ;
- la proximité avec la production.

Le portrait doit être chaleureux, calme, légèrement souriant et reconnaissable.

### 10. CTA final

Titre :

> Donnez-nous un workflow. On vous dit ce qui est jouable.

Action principale : `Vérifier la faisabilité`

Action secondaire : `Parler à Paul`

### 11. Newsletter et footer

La newsletter reste un objet éditorial important, mais secondaire par rapport au parcours workflow → valeur → échange.

## Mobile

- Ne pas empiler mécaniquement les éléments desktop.
- Le champ Hermès doit être utilisable d’une main.
- Le titre doit garder une rupture de ligne intentionnelle.
- Les traces deviennent verticales.
- Les collages se réduisent à une narration de deux ou trois éléments.
- Le portrait ne doit pas prendre tout le premier écran au détriment de la promesse.

## Critères de réussite

- une seule action principale ;
- valeur rendue avant la demande de rendez-vous ;
- preuve visible avant l’architecture d’offres ;
- aucune promesse non vérifiable ;
- cohérence visuelle entre éditorial, produit et founder brand ;
- expérience utilisable au clavier et avec reduced motion ;
- analytics sans stockage du texte privé du workflow.
