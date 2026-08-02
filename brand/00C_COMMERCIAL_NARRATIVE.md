---
document: 00C_COMMERCIAL_NARRATIVE
status: adaptable-within-guardrails
version: 1.0.0
updated: 2026-08-02
owner: Paul Larmaraud
registre: COMMERCIAL
---

# 00C · Narration commerciale

**Statut `adaptable-within-guardrails`.** Ce document approfondit le positionnement externe quand nous parlons à un prospect ou à un client qualifié. **Ce n'est pas un troisième positionnement.**

Il s'adapte selon le persona, la maturité, le secteur, le signal détecté, l'offre et le contexte de rendez-vous. **Il ne contredit jamais `00B` et n'expose jamais les éléments internes sensibles de `00A` §9.**

**Aucun prix dans ce document.** Les montants n'existent que dans un contexte commercial nominatif, créé et transmis explicitement.

> L'origine de chaque section est indiquée en fin de bloc. Les contenus sans source antérieure sont marqués `NOUVEAU`.

---

## 1. Ce que la narration ajoute à `00B`

`00B` dit ce que nous promettons. `00C` explique **comment** et **jusqu'où**, à quelqu'un qui a déjà compris et qui veut savoir si c'est sérieux.

Trois garde fous permanents.

1. Une formulation adaptée à un client ne devient pas une phrase publique canonique.
2. Une promesse doit toujours être soutenue par une capacité réelle.
3. Rien de `00A` §9 ne sort, même en rendez-vous.

*Origine : arbitrage de Paul du 02/08/2026.*

## 2. La trajectoire vers l'agentique

`NOUVEAU dans sa formulation commerciale. Fond issu de l'arbitrage du 02/08.`

La destination est agentique : un modèle où des logiciels et des agents exécutent une part croissante des opérations, sous contrôle humain.

**Le point de départ dépend de la maturité réelle.** Nous pouvons commencer par la formation, par le cadrage, par la simplification d'un processus, ou par la construction d'un logiciel, avant de déployer le moindre agent. Une entreprise qui n'a pas encore de processus lisible n'a pas besoin d'un agent, elle a besoin qu'on regarde son processus.

**Ce qui se dit.** L'agentique est notre destination technique, pas votre point d'entrée obligé.

**Ce qui ne se dit pas.** Que le déploiement d'agents est prouvé à grande échelle chez nos clients. Quatre systèmes sont livrés ou actifs, l'usage direct est constaté sur deux, et aucun résultat métier n'est mesuré. En rendez-vous, cela se dit tel quel : c'est ce qui rend le reste crédible.

*Origine : arbitrage du 02/08 pour la trajectoire · `positioning-os/03` §12 pour l'état de preuve.*

## 3. Le développement de logiciels

Nous ne faisons pas que brancher des outils. Nous construisons des logiciels métier quand aucun produit du marché ne fait le travail. Un CRM métier est en production chez un client, avec un dépôt actif.

**Ce qui est réutilisé d'une mission à l'autre** : nos méthodes, nos patterns, nos composants, nos connecteurs, nos évaluations, notre manière de superviser, et les apprentissages des projets précédents.

**Ce qui est conçu pour chaque entreprise** : le problème choisi, l'architecture, les données, les connexions, les règles métier, les entrées, les sorties, les validations humaines, les droits, les interfaces, les conditions de mise en production, le niveau d'autonomie, le mode d'adoption, le régime de suite.

**La phrase de rendez-vous.** Deux entreprises qui veulent la même chose ne reçoivent pas le même système. Les données ne sont pas les mêmes, les règles non plus, les personnes qui valident non plus, et le moment où l'humain doit reprendre la main change complètement.

**Interdits de vocabulaire, même à l'oral** : cousu main, maison d'ingénierie, premium, haut de gamme, luxe. L'idée se démontre par les éléments qui varient, pas par le mot.

*Origine : `positioning-os/09` §4 · `10` vocabulaire retiré.*

## 4. L'intégration aux opérations

Le système entre dans l'environnement réel : les outils déjà en place, les accès existants, les circuits de validation qui existent déjà.

Nous posons les points de validation humaine là où l'erreur coûte, et la trace dit qui a validé quoi. Rien ne part vers l'extérieur sans qu'une personne du client ait relu.

**Les accès sont graduels.** Nous demandons ce qui est nécessaire à l'étape en cours, pas tout au début. Un premier objet peut se construire sur des données neutres, simulées, publiques ou anonymisées.

**Point de franchise à tenir en rendez-vous.** Notre socle minimal de sécurité et de réversibilité n'est pas encore formalisé par écrit. Sur un métier sensible, nous le disons avant d'engager.

*Origine : `positioning-os/03` §4 et §9 · `04` porte 2 · `05` §15.*

## 5. Le rôle d'Hermès

`NOUVEAU dans sa formulation commerciale. Cadré par l'arbitrage du 02/08.`

Hermès est notre **couche d'orchestration**. Elle organise l'exécution, les validations et l'amélioration progressive des systèmes.

Ce qui se dit : elle permet de savoir ce qui a été produit, ce qui a été validé, par qui, et ce qui doit être corrigé. Elle rend l'amélioration continue possible sans qu'un humain relance chaque étape à la main.

**Ce qui ne se dit jamais** : les boucles internes, l'architecture sensible, les mécanismes de proposition automatique, et le détail de ce qui tourne chez nous. Hermès n'est pas un produit, ce n'est pas un livrable, et aucun client ne l'a vue.

*Origine : arbitrage du 02/08 · `brand/05_HERMES_CONVERSION.md` pour le périmètre existant.*

## 6. La méthode de déploiement

Sept étapes, annoncées avant de commencer.

1. **Comprendre** le niveau, le processus qui coince, son coût, qui décide.
2. **Choisir** le premier chantier, selon six critères écrits : pénibilité, temps passé, technicité, accès à la donnée, réversibilité, place de l'humain.
3. **Construire** sur les données réelles.
4. **Mettre en fonctionnement** dans l'environnement du client.
5. **Itérer** jusqu'à ce que le système soit assez fiable pour l'usage défini.
6. **Faire adopter** : validations, traçabilité, formation des personnes concernées.
7. **Opérer, transmettre ou combiner les deux.**

**L'étape 2 est celle qui se raconte.** La règle : on automatise ce qui est répétitif, fréquent, à règles claires, avec des données disponibles, et où une erreur se rattrape. L'humain garde le rare, le nouveau, le jugement, le coûteux.

**Sur les délais.** Aucun délai systématique n'est annoncé, aucun n'ayant été compté. Une hypothèse de durée peut figurer dans un devis, jamais dans une promesse.

*Origine : `positioning-os/03` §9 · `04` porte 2.*

## 7. La gouvernance

**Ce que Parrit.ai prend en charge** : recommander, construire, orchestrer, mettre en fonctionnement, accompagner l'adoption.

**Ce que le client conserve** : les décisions stratégiques, les validations sensibles, et le choix final du régime de suite.

**Ce que le client doit fournir** pour qu'une mission tienne : un décideur, un périmètre, des données, des accès, un référent interne, un budget, du temps de validation.

**Ce qui fait échouer un dossier**, et que nous disons tôt : un comité qui décide à la place d'une personne, des accès qui ne s'ouvrent pas, aucun référent disponible.

**Notre responsabilité contractuelle** est plafonnée au montant perçu. Nos conditions générales existent et n'ont encore jamais été opposées à personne.

*Origine : `positioning-os/03` §4 et §6 · `04` porte 3.*

## 8. Les niveaux de maturité

Grille de lecture pour situer un prospect. **Elle ne lui est pas présentée comme un diagnostic, elle guide les questions.**

| Niveau | Ce qu'on entend en rendez-vous | Ce qu'on propose |
|---|---|---|
| 1 · Commencer | « On utilise un peu ChatGPT, on ne sait pas quoi en faire de plus » | Voir ce que ça change sur son propre cas |
| 2 · Premier système | « J'ai une tâche qui me mange du temps » | Un objet borné qui tourne sur ses données |
| 3 · Fonction transformée | « Toute la chaîne est concernée » | Une chaîne outillée, avec ses validations et une mesure |
| 4 · Entreprise transformée | « On veut relier plusieurs fonctions » | Un engagement long. **Non démontré chez nous, à dire** |
| 5 · Piloter | « Je ne sais pas ce que mes systèmes ont produit » | Direction produit. **Aucun client ne l'a vue, à dire** |

**Deux triades, jamais opposées.** Transformer, Construire, Déployer décrit ce que fait Parrit.ai. Commencer, Transformer, Piloter décrit où en est le client.

*Origine : `positioning-os/03` §11 · arbitrage du 02/08 pour la coexistence.*

## 9. Les modalités d'accompagnement

**Le parcours.** Un premier échange de trente minutes, gratuit, pour comprendre la situation et vérifier qu'un sujet mérite d'être travaillé. Puis, si c'est le cas, une session de sélection d'une heure qui aboutit à une décision et à un cas d'usage retenu. Puis un premier système construit sur les données réelles. Puis, selon les besoins, une transformation plus large.

**Les trois régimes de suite.**

| Régime | Qui opère | Qui décide | Fin de la relation |
|---|---|---|---|
| RUN | Parrit.ai | Le client sur les arbitrages | Préavis, restitution documentée |
| Transfert | Le client, accompagnement dégressif | Le client | Test d'autonomie écrit avant le démarrage |
| Hybride | Partagé, périmètre écrit | Chacun sur son périmètre | Renégociation à date fixe |

**Franchise obligatoire.** Aucun de ces trois régimes n'a encore été mené jusqu'au bout ni renouvelé. Un client a demandé l'autonomie par écrit et accepté une offre sur le fond, sans signature.

**Prix.** Aucun montant dans ce document ni dans aucun bundle. Ils circulent uniquement dans un devis ou un lien privé nominatif.

*Origine : `positioning-os/04` sections 3 à 6, dépouillées des montants.*

## 10. Cas d'usage adaptés au client

Familles de problèmes déjà traitées, à choisir selon l'interlocuteur.

| Famille | À qui elle parle |
|---|---|
| Préparer une décision commerciale à partir d'un fichier trop gros pour être lu | Direction commerciale, direction générale |
| Faire arriver chaque semaine une information de niche | Métier spécialisé, veille réglementaire, direction technique |
| Trier ce qui arrive et préparer une réponse qu'un humain signe | Support, administration, commerce |
| Donner un outil métier qui n'existait dans aucun logiciel du marché | Opérations, direction générale |

Familles travaillées à preuve plus faible, à présenter comme telles : contenu, reporting, administratif, prototypes dans des domaines nouveaux.

**Règle.** Les problèmes changent, la méthode reste la même. Jamais de liste de secteurs, jamais de grille de fonctions.

*Origine : `positioning-os/05` §13.*

## 11. Adaptations commerciales

`NOUVEAU, arbitrage de Paul du 02/08/2026.` Angles d'entrée, pas de nouvelles promesses.

**Par persona.**

| Persona | Ce qui compte | Par quoi entrer |
|---|---|---|
| Dirigeant | Ne pas se tromper, voir vite | Le choix du premier chantier et ce qu'il verra fonctionner |
| Direction métier | Que ça marche dans son service | La construction sur ses vraies données |
| Responsable d'équipe | Que son équipe adopte | Les validations qui restent chez lui, et la formation |
| Référent interne IA | Montrer du concret à sa direction | Repartir avec un objet qui tourne |
| Profil technique | Que ce soit sérieux | Le protocole à deux agents, les contrôles bloquants, l'architecture |

**Par maturité.** Voir le §8. On entre au niveau du prospect, on ne saute pas de marche, et on ne lui fait jamais sentir qu'il est en retard.

**Par secteur.** Le secteur fournit un exemple et un vocabulaire, jamais une expertise revendiquée. **Aucune spécialisation sectorielle n'est prouvée.** Rien de sectoriel ne se publie tant qu'une signature hors réseau n'existe pas dans le secteur concerné.

**Par signal.** Un signal détecté sert à formuler une accroche vérifiée et récente. Il ne remplace ni la qualification, ni les six engagements de l'acheteur réel.

**Par contexte de rendez-vous.** Sur une démonstration, l'ordre est imposé : le problème, puis l'enjeu, puis la machine, puis un menu de suites possibles. La donnée est testée avant de choisir l'angle. Le test de sortie : le prospect doit pouvoir réexpliquer ce qu'il a vu à quelqu'un d'autre.

*Origine : arbitrage du 02/08 pour la structure · `positioning-os/07` §10 et §20 pour la matière.*

## 12. Ce qui ne sort jamais, même en rendez-vous

`INTERNAL STRICT`, rappel depuis `00A` §9.

Le prototype commercial gratuit, qui n'est ni annoncé ni suggéré. Le coût de revient et la marge. L'organisation interne et ses dépendances. La trésorerie. Tout nom de client sans consentement écrit. Les éléments du parcours de Paul encore à vérifier. Les boucles internes d'Hermès. Le vocabulaire retiré du public. Et toute promesse de résultat chiffré, puisque aucun n'est mesuré.

*Origine : `00A` §9.*

---

## Contenus nouveaux dans ce brouillon

| Contenu | Source |
|---|---|
| Le cadrage de la trajectoire agentique en registre commercial | Arbitrage de Paul, 02/08/2026 |
| Le rôle commercial d'Hermès comme couche d'orchestration | Arbitrage de Paul, 02/08/2026 |
| Les adaptations par persona, maturité, secteur, signal et contexte | Arbitrage de Paul, 02/08/2026 |
| La grille de lecture des niveaux en situation de rendez-vous | Dérivée de `03` §11, mise en forme nouvelle |

Tout le reste est extrait du Positioning OS, sans réécriture de fond.
