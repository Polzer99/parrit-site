---
document: 00A_POSITIONING_INTERNAL
status: living
version: 1.0.0
updated: 2026-08-02
owner: Paul Larmaraud
registre: INTERNAL
---

# 00A · Positionnement interne

**Statut `living`.** Ce document est un modèle vivant de ce que Parrit.ai devient, apprend et sait réellement produire. Il évolue à partir des missions, des systèmes déployés, des apprentissages de production, d'Hermès et de Parrit OS, des offres testées, des capacités qui émergent, des erreurs et des changements de marché.

**Il n'est pas une vérité verrouillée.** Chaque affirmation importante porte un statut : `validated`, `current`, `hypothesis`, `experimental`, `client-specific`, `deprecated`.

**Une évolution interne ne modifie pas automatiquement le positionnement externe.** Elle signale seulement ce que nous avons appris, ce qui change dans nos capacités, ce qui pourrait à terme nécessiter une évolution publique, et ce qui doit rester interne.

> L'origine de chaque section est indiquée en fin de bloc. Les contenus sans source antérieure sont marqués `NOUVEAU`.

---

## 1. Vision

`validated` Parrit.ai est un **partenaire de transformation et d'ingénierie agentique**.

`validated` Quatre capacités : transformation des méthodes de travail et des opérations, développement de logiciels sur mesure, déploiement d'agents en production, formation et autonomisation des équipes.

`validated` **La destination stratégique est agentique. Le point de départ dépend du niveau de maturité réel de chaque entreprise.** Parrit peut commencer par la formation, le cadrage, la simplification d'un processus ou la construction d'un logiciel avant de déployer des agents.

`validated` **Phrase interne de référence.** Nous accompagnons les entreprises depuis leur niveau actuel jusqu'à un modèle où des logiciels et des agents exécutent une partie croissante de leurs opérations, sous contrôle humain.

`validated` **Place mentale visée.** Parrit.ai est l'entreprise à qui l'on confie son sujet IA. C'est une boussole interne, jamais une phrase de site.

`hypothesis` À dix-huit ou trente-six mois, Parrit.ai est le nom qui vient quand un dirigeant décide de s'y mettre sérieusement et ne veut pas se tromper.

*Origine : arbitrage de Paul du 02/08/2026 pour les quatre capacités et la phrase de référence · `positioning-os/03` §2 et §15.*

## 2. Transformation

`validated` Nous entrons par un processus qui coince, pas par une technologie. Nous comprenons la manière réelle de travailler, nous chiffrons ce que coûte la friction, et nous repérons qui décide.

`validated` **Six critères écrits** pour choisir le premier chantier : pénibilité, temps passé, technicité, accès à la donnée, réversibilité, place de l'humain.

`validated` **Règle de sélection.** On automatise ce qui est répétitif, fréquent, à règles claires, avec des données disponibles, et où une erreur se rattrape. L'humain garde le rare, le nouveau, le jugement, et ce qui coûte cher.

`current` Le discernement est la capacité la plus rare et la moins vendue séparément : entrer vite dans un contexte, distinguer le problème réel de sa première formulation, dire ce qui ne mérite pas d'être construit, et changer d'avis quand le contexte change.

*Origine : `positioning-os/03` §9 et §17 · `09` §4 bis.*

## 3. Logiciels

`validated` Parrit.ai construit des logiciels sur mesure, pas seulement des automatisations. Un CRM métier est en production chez un client, avec un dépôt actif.

`validated` **Le principe du cousu main.** Les briques peuvent être éprouvées : méthodes, règles, patterns, composants, connecteurs, évaluations, supervision, apprentissages des projets précédents. **Leur composition doit être propre à l'entreprise** : le problème choisi, l'architecture, les données, les connexions, les règles métier, les entrées, les sorties, les validations humaines, les droits, les interfaces, les conditions de mise en production, le niveau d'autonomie, le mode d'adoption, le régime de suite.

`current` L'itération en conditions réelles dure jusqu'à ce que le système soit suffisamment fiable pour l'usage défini. Aucun délai n'a jamais été compté.

*Origine : `positioning-os/03` §17 et §12 · `05` §5.*

## 4. Agents

`validated` Le management d'agents est pratiqué en interne tous les jours : travail piloté au langage naturel, duo d'agents avec relecture obligatoire et trois validations avant intégration, intégration continue à quatre portes, contrôles qui bloquent la livraison au lieu de la signaler.

`current` **Chez le client, l'état est plus modeste.** Quatre systèmes sont identifiés comme livrés ou actifs, l'usage direct est constaté sur deux, et **aucun résultat métier n'est mesuré**.

`hypothesis` Un agent en état de marche remis à l'issue d'une session. C'est la promesse la plus vendable du catalogue et celle dont la preuve manque.

`experimental` L'Operating System, couche de supervision unifiée. Il existe en interne, aucun client ne l'a vu, et sa première fonction utile reste la plus modeste : savoir ce qui est parti et qui l'a validé.

*Origine : `positioning-os/03` §11 et §12 · `04` porte 1 et section 7.*

## 5. Formation

`validated` **La formation traverse les trois piliers publics. Ce n'est pas une activité isolée.** `NOUVEAU, arbitrage de Paul du 02/08/2026.`

`validated` Une prestation de kick off et d'ateliers référents a été facturée 2 160 € HT, avec facture ouverte et lue.

`current` Une formation suivie d'un achat de déploiement est observée sur un cas.

`validated` **Une formation théorique seule ne constitue pas une offre Parrit.ai complète.** Chaque format produit au minimum une meilleure compréhension, un premier usage réel, ou un premier objet fonctionnel.

`current` Qualiopi est un mécanisme de financement, une porte d'entrée et un outil d'adoption. Ce n'est pas le positionnement, et la qualification n'est pas forcée sur un format dont le livrable principal est un prototype construit par Parrit.ai.

*Origine : `positioning-os/04` porte 1 · arbitrage du 02/08 pour la transversalité.*

## 6. Chemin de maturité

`current` **Deux triades coexistent et ne sont jamais présentées comme concurrentes.** `NOUVEAU, arbitrage de Paul du 02/08/2026.`

| | Ce que fait Parrit | Où en est le client |
|---|---|---|
| 1 | Transformer | Commencer |
| 2 | Construire | Transformer |
| 3 | Déployer | Piloter |

La première décrit nos capacités. La seconde décrit la maturité de l'entreprise en face.

`current` **L'échelle interne à cinq niveaux** reste l'outil de diagnostic. Elle situe un client, elle ne lui est jamais présentée.

| Niveau | Ce que le client obtient | Preuve |
|---|---|---|
| 1 Commencer | Il voit ce que l'IA change dans son contexte | Vendu ou observé |
| 2 Premier système | Une chose qui fonctionne seule, résultat visible | Démontré sur quelques systèmes |
| 3 Fonction transformée | Une chaîne métier outillée, avec ses validations | Observé sur des cas isolés, sans transformation métier mesurée |
| 4 Entreprise transformée | Plusieurs fonctions reliées | `hypothesis` Ambition non démontrée |
| 5 Operating System | Supervision au même endroit | `experimental` Interne, jamais utilisé par un client |

*Origine : `positioning-os/03` §11 · arbitrage du 02/08 pour la coexistence des triades.*

## 7. Modèle opératoire

`validated` **Sept étapes**, annoncées avant de commencer : comprendre, choisir, construire, mettre en fonctionnement, itérer, faire adopter, puis opérer, transmettre ou combiner les deux.

`validated` **Ce que Parrit.ai prend en charge** : recommander, construire, orchestrer, mettre en fonctionnement, accompagner l'adoption. **Ce que le client conserve** : les décisions stratégiques, les validations sensibles, et le choix final du régime de suite.

`validated` **L'acheteur réel engage six choses** : budget, périmètre, données, accès, référent interne, décision. La marque parle largement, la mission reste sélective.

`validated` **Critères de refus** : un comité décide à la place d'une personne, les accès ne s'ouvrent pas, aucun référent n'est disponible, le budget n'est pas engagé, le sujet exige un socle de sécurité qui n'existe pas.

`current` **Trois régimes de suite** : RUN opéré par Parrit.ai, transfert progressif, ou modèle hybride. Aucun n'est prouvé par un renouvellement encaissé.

`current` **Deux mouvements commerciaux coexistent.** Le mouvement actuel va du call gratuit au prototype commercial gratuit sélectif puis au build payé. Le mouvement cible va du call gratuit à la session de sélection payante, puis au prototype payé, puis au build. Aucune date de bascule.

*Origine : `positioning-os/03` §4, §6 et §9 · `04` sections 3 à 6.*

## 8. Avantages compétitifs

`validated` **Quarante huit règles internes**, chacune née d'un incident réel et payé. Le client n'a pas à refaire ce chemin.

`validated` **Une méthode de décision écrite.** Les six critères existent avant la conversation, ils ne sont pas improvisés.

`validated` **Une discipline d'ingénierie** où les contrôles bloquent la livraison plutôt que de la signaler, et une convention de preuve qui déclare les cases vides au lieu de les remplir.

`validated` **Le même corps porte la compétence technique et la parole commerciale**, ce qui rend possible la démonstration en direct.

`current` **La tension centrale** : un niveau d'ingénierie élevé et une conception spécifique, rendus accessibles par une relation humaine et simple. Version courte : très avancés dans l'exécution, très simples dans la relation.

`current` **Territoire interne** : une maison d'ingénierie IA qui conçoit des systèmes cousus à chaque entreprise. Repère d'exigence, jamais une auto-désignation publique.

`current` **Le premium ne repose ni sur un prix, ni sur une esthétique, ni sur un vocabulaire élitiste**, mais sur la sélection des sujets, le temps consacré à comprendre, l'implication directe de ceux qui construisent, la précision d'exécution, la responsabilité jusqu'au fonctionnement, la capacité à refuser une mauvaise idée, et la qualité de la transmission.

*Origine : `positioning-os/05` §2, §5, §14 et §16 · `09` §13.*

## 9. Éléments non publiables

`INTERNAL STRICT` Aucune ligne de cette section n'entre dans les profils commercial ou public.

**Prix et mécanique commerciale.** Tous les montants. La déduction de la session sous trente jours. Le prototype commercial gratuit sélectif, qui n'est ni annoncé, ni suggéré, ni promis, y compris en rendez-vous. Le coût de revient, inconnu. La marge, inconnue.

**Organisation.** Qui part, qui reste, qui possède quoi, les dépendances de production. Le statut, le périmètre et l'engagement de Maxime, tant qu'un accord écrit manque.

**Finances.** La trésorerie, les impayés, les montants dus.

**Clients.** Tout nom sans consentement écrit. Tout incident qui rendrait un client reconnaissable. Les dossiers perdus faute de relance.

**Parcours à vérifier.** Les réparations physiques attribuées à Paul, certains partenariats, l'extension à Bruxelles, le transfert aux équipes de Londres, les responsabilités juridiques et financières exactes.

**Vocabulaire retiré du public.** Cousu main, maison d'ingénierie, premium, haut de gamme, luxe. Les idées restent, elles ne se revendiquent plus.

**Ambitions.** Les niveaux 4 et 5. L'exploitation payante. Le transfert mené jusqu'au bout. Les impacts annoncés. La phrase visée à dix-huit mois.

**Manques structurels à ne pas masquer.** Aucun résultat client mesuré. Aucun transfert livré. Aucun test d'autonomie passé. Aucun RUN facturé. Le socle de sécurité et de réversibilité n'est pas écrit.

*Origine : `positioning-os/04` sections 3 et 9 · `05` §17 et §19 · `06` §18 et §19 · `10` vocabulaire retiré.*

---

## Contenus nouveaux dans ce brouillon

| Contenu | Source |
|---|---|
| Les quatre capacités et la phrase interne de référence | Arbitrage de Paul, 02/08/2026 |
| La transversalité de la formation | Arbitrage de Paul, 02/08/2026 |
| La coexistence des deux triades | Arbitrage de Paul, 02/08/2026 |
| Les statuts par affirmation | Arbitrage de Paul, 02/08/2026 |

Tout le reste est extrait du Positioning OS, sans réécriture de fond.
