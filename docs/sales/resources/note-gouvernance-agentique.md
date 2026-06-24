# Ressource : note gouvernance agentique

Date : 2026-06-24
Statut : source envoyable / a designer en PDF
Usage : DSI, CIO, CDO, directeur transformation, juridique, sponsors grand groupe

## Intention

Cette note rassure les acheteurs qui portent le risque : securite, donnees, acces, logs, responsabilites, coeur SI. Elle doit montrer que Parrit ne vend pas une couche brillante au-dessus du chaos, mais une pratique agentique gouvernee.

Elle est utile quand le prospect dit :

- "La donnee doit rester chez nous."
- "Je ne veux pas de shadow IT."
- "Qui valide ce que l'agent fait ?"
- "Comment garde-t-on une piste d'audit ?"
- "On ne touche pas au coeur du SI."

## Version courte envoyable

### Gouverner avant d'etendre

Un agent utile n'est pas seulement un agent qui repond. C'est un systeme dont on connait :

- les donnees accessibles ;
- les actions autorisees ;
- les validations humaines ;
- les journaux d'activite ;
- le responsable metier ;
- le chemin d'arret ou de correction.

La gouvernance n'arrive pas apres le succes. Elle se pose des le premier flux.

## Les 6 garde-fous

| Garde-fou | Question | Sortie attendue |
|---|---|---|
| Donnees | Quelles donnees l'agent peut-il lire ? | Perimetre documente, sources autorisees, donnees exclues. |
| Acces | Qui peut declencher, valider ou modifier ? | Roles, droits, separation des responsabilites. |
| Actions | Que peut faire l'agent sans humain ? | Liste courte d'actions autorisees et interdites. |
| Validation | Quand l'humain reprend-il la main ? | Regles d'escalade, cas sensibles, seuils. |
| Journaux | Que doit-on pouvoir relire ? | Trace des entrees, sorties, decisions et corrections. |
| Amelioration | Comment corrige-t-on les erreurs ? | Boucle de feedback, revue, nouvelle version. |

## Principe d'architecture

Parrit privilegie les flux satellites avant le coeur SI.

`Outils existants` -> `couche d'orchestration` -> `agent supervise` -> `validation humaine` -> `trace`

Ce principe permet d'avancer sans exposer tout le systeme :

- le coeur SI reste intact ;
- les premiers cas sont limites ;
- les droits sont explicites ;
- les erreurs deviennent visibles ;
- le transfert aux equipes internes est possible.

## Avant / apres

| Avant | Apres |
|---|---|
| Usages disperses, chaque equipe teste avec ses propres regles. | Un cadre commun definit donnees, acces, validation et trace. |
| La DSI decouvre les usages trop tard. | La DSI cadre le perimetre avant construction. |
| Les metiers veulent aller vite, le risque reste flou. | Le flux avance vite parce que le risque est borne. |
| Les erreurs sont difficiles a expliquer. | Les journaux permettent de relire, corriger et ameliorer. |

## Questions de cadrage

Avant de construire, poser ces questions :

1. Quelle est la source de verite du flux ?
2. Quelles donnees sont interdites ?
3. Quelle action ne doit jamais etre automatique ?
4. Qui valide les cas sensibles ?
5. Quel journal doit rester consultable ?
6. Quel indicateur prouve que le flux merite d'etre etendu ?

## CTA post-meeting

`On cartographie un flux satellite, ses donnees, ses validations et ses journaux avant toute construction.`

## Brief design PDF

Format : A4 portrait, sobre, lisible par un COMEX ou une DSI.

Structure :

1. Titre : "Un agent sans gouvernance devient une dette."
2. Bloc court : definition d'un agent gouverne.
3. Tableau des 6 garde-fous.
4. Schema d'architecture satellite.
5. Questions de cadrage + CTA.

Regles DA :

- Fond clair, peu de decoration, ton executive.
- Rouge Parrit uniquement pour la couche d'orchestration et la validation humaine.
- Mettre en avant les mots : donnees, acces, validation, journaux, responsabilites.

