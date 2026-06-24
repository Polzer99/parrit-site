# Ressource : back-office multi-canal

Date : 2026-06-24
Statut : source envoyable / a designer en PDF
Usage : owner e-commerce, DG, COO, equipes operations, service client

## Intention

Cette ressource montre le premier front Parrit : rendre un flux operationnel lisible quand les demandes arrivent de partout. Elle doit faire comprendre que l'agent ne remplace pas l'equipe : il trie, enrichit, prepare et escalade.

Elle est utile quand le prospect dit :

- "Les demandes arrivent par tous les canaux."
- "On oublie des relances."
- "Le SAV prend trop de temps."
- "On copie-colle entre outils."
- "Je veux garder la validation humaine."

## Version courte envoyable

### Un seul flux pour les demandes dispersees

Dans beaucoup d'entreprises, le temps se perd avant meme que le travail commence : email, formulaire, telephone, messages sociaux, tableurs et outil metier ne racontent pas la meme histoire.

La premiere valeur d'un agent n'est pas spectaculaire. Elle est operationnelle :

`Canaux d'entree` -> `base unique` -> `tri` -> `action preparee` -> `validation humaine` -> `trace`

## Schema cible

| Couche | Role | Exemple |
|---|---|---|
| Entrees | Recuperer les demandes la ou elles arrivent. | Mail, formulaire, telephone, Instagram, WhatsApp, site. |
| Base unique | Garder source, statut, historique et prochaine action. | Table, CRM, outil metier ou base legere. |
| Tri | Classer urgence, type, client, valeur, exception. | SAV simple, reclamation, demande commerciale, cas sensible. |
| Action preparee | Rediger ou preparer la suite sans executer aveuglement. | Reponse, relance, note interne, mise a jour. |
| Validation | Laisser l'humain arbitrer les cas importants. | Approbation, modification, escalade, refus. |
| Mesure | Suivre volumes, delais, erreurs et exceptions. | Tableau simple par semaine. |

## Avant / apres

| Avant | Apres |
|---|---|
| Chaque canal a sa logique et son responsable implicite. | Une file unique rend le flux visible. |
| Les relances dependent de la memoire de l'equipe. | Les prochaines actions sont preparees et suivies. |
| Les cas simples et sensibles arrivent au meme endroit. | Les exceptions remontent a la bonne personne. |
| Le volume est ressenti, pas mesure. | Volumes, delais et escalades deviennent lisibles. |

## Exemple anonymise

Situation : une marque ou une equipe operations recoit des demandes via plusieurs canaux. Les commandes, questions et relances sont traitees manuellement, avec de la ressaisie et des oublis.

Flux cible :

1. Centraliser les entrees dans une base unique.
2. Ajouter source, categorie, urgence et statut.
3. Preparer la reponse ou l'action.
4. Escalader les cas sensibles.
5. Mesurer volume, delai et charge evitee.

Ce que l'equipe gagne : un quotidien plus lisible, moins de ressaisie, moins d'oublis, et un humain concentre sur les decisions utiles.

## Use cases

- E-commerce : leads sociaux, commandes telephone, demandes SAV, relances WhatsApp.
- Operations : reclamations, commandes, alertes rupture, synchronisation entre outils.
- Cabinet : demandes entrantes, qualification, veille client, relance dossier.
- B2B services : formulaires, emails commerciaux, support, demandes partenaires.

## CTA post-meeting

`On prend un flux reel, on liste les entrees, les exceptions et les validations, puis on dessine la file cible en 45 minutes.`

## Brief design PDF

Format : A4 portrait ou slide 16:9.

Structure :

1. Titre : "Quand tout arrive partout, rien n'est vraiment pilote."
2. Schema horizontal : canaux -> base -> tri -> validation -> trace.
3. Bloc avant / apres en deux colonnes.
4. Encadre "ce qui reste humain".
5. CTA discret.

Regles DA :

- Fond clair, schema tres lisible, peu de texte.
- Utiliser des pictogrammes simples pour les canaux.
- Rouge Parrit uniquement pour la file cible et la validation humaine.

