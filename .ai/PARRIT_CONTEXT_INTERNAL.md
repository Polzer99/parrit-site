# Contexte Parrit.ai · profil INTERNAL

> **Fichier généré. Ne jamais l'éditer à la main.**
> Régénérer avec `npm run context:build`. Vérifier avec `npm run context:check`.

Contexte complet par défaut pour les agents du dépôt. Contient le positionnement interne, externe et commercial, les phrases verrouillées et l'index canonique.

- Profil : `internal`
- SHA Git des sources : `5656d16c05e492424b1577173d0a48441a981eb0`
- Sources inlinées : 5 · référencées : 15

---

<!-- source: brand/00_SOURCE_OF_TRUTH.md sha256:4a902fceb13db000 mode:full -->

# 00 — Source de vérité Parrit.ai

**Version :** 1.0.0
**Statut :** index canonique
**Propriétaire :** Paul Larmaraud
**Dernière mise à jour :** 2 août 2026

## Rôle du document

Ce fichier n'écrit plus le positionnement. Il **indexe les trois registres** et dit lequel prime selon la question posée.

| Registre | Document | Statut | Rythme |
|---|---|---|---|
| **Interne** | [`00A_POSITIONING_INTERNAL.md`](./00A_POSITIONING_INTERNAL.md) | `living` | Évolue fréquemment. Chaque affirmation porte un statut : `validated`, `current`, `hypothesis`, `experimental`, `client-specific`, `deprecated` |
| **Externe** | [`00B_POSITIONING_EXTERNAL.md`](./00B_POSITIONING_EXTERNAL.md) | `approved` v1.0.0 | Contrat stable avec le marché. Évolue rarement, sur décision explicite de Paul |
| **Commercial** | [`00C_COMMERCIAL_NARRATIVE.md`](./00C_COMMERCIAL_NARRATIVE.md) | `adaptable-within-guardrails` | S'adapte au prospect sans jamais contredire `00B` |

**Règle centrale.** Une évolution interne ne modifie pas automatiquement le positionnement externe. Une formulation commerciale adaptée à un client ne devient pas une phrase publique canonique.

**Les agents doivent identifier le registre dans lequel ils travaillent avant de produire du contenu.**

## Quatre hiérarchies de précédence

### Sens interne

1. Décision récente explicite de Paul
2. `brand/00A_POSITIONING_INTERNAL.md`
3. Décisions validées de `positioning-os/02B-DECISION-LOG.md`
4. Sources internes spécialisées
5. Implémentation et historique

### Sens public

1. Décision récente explicite de Paul
2. `brand/00B_POSITIONING_EXTERNAL.md`
3. Sources publiques spécialisées
4. Supports existants

### Phrases publiques exactes

1. Décision récente explicite de Paul
2. `positioning-os/10-LOCKED-PUBLIC-COPY.md`
3. `brand/00B_POSITIONING_EXTERNAL.md`
4. `positioning-os/09-PUBLIC-COPY-LIBRARY.md`

### Registre commercial

1. Décision récente explicite de Paul
2. `brand/00C_COMMERCIAL_NARRATIVE.md`
3. `brand/00B_POSITIONING_EXTERNAL.md`
4. Connaissances internes explicitement partageables
5. Adaptation au contexte du prospect

## Exécution

La chaîne d'exécution reste inchangée : `01_DESIGN_TOKENS > 02-05 contrats spécialisés > Figma audité > code > site en ligne`. Le site est une sortie du système, jamais la source.

`brand/03_CONTENT_SYSTEM.md` est un **guide d'exécution subordonné** à `00B` et à `10-LOCKED-PUBLIC-COPY.md`.

## Documents retirés de toute position canonique

`status: historical`, conservés sans réécriture, exclus des trois bundles : `TRUTH.md` · `MATURITE-SOT.md` · `BRAND.md` · `DESIGN-SYSTEM.md` · `design-source/DA-TOKENS-EXTRACTED.md`.

## Prix

**PUBLIC** : aucun prix. **COMMERCIAL générique** : aucun prix. **INTERNAL** : autorisés. **Contexte commercial nominatif** : autorisés uniquement dans un devis ou une proposition dédiée, transmis volontairement.

---

## Historique, superseded le 02/08/2026

Les blocs ci dessous fixaient le positionnement jusqu'au 30/07/2026. Ils sont conservés à l'identique et remplacés par `00A` et `00B`.

## Mission

Mettre des agents utiles au travail dans de vrais workflows d’entreprise, puis transmettre le système et les réflexes opérationnels aux équipes du client.

## Positionnement

Parrit.ai est un partenaire opératoire de déploiement d’agents et de systèmes internes.

Parrit ne livre pas un discours sur l’IA. Parrit part d’une tâche réelle, définit l’input, l’output, les accès, le propriétaire humain et les conditions de contrôle, puis met le système en production.

## Publics prioritaires

- dirigeants ;
- directions des opérations ;
- DSI ;
- directions data et transformation ;
- responsables commerciaux, support, finance, administration et RH lorsqu’un workflow concret est identifié.

## Ennemi

- le théâtre de l’IA ;
- les preuves de concept qui ne sortent jamais du laboratoire ;
- les chatbots génériques déconnectés du travail ;
- les tableaux de bord sans action ;
- les slides de conseil sans déploiement ;
- les systèmes autonomes sans propriétaire, limite d’accès ni trace ;
- le marketing technologique plus fort que le produit.

## Promesse

**FR :** Passez d’une IA qui parle à des agents qui exécutent.  
**EN :** Move from AI that talks to agents that execute.

Promesse opératoire :

> À partir d’un input concret, produire un output défini, contrôlé, traçable et transférable aux équipes.

---

## Modèle de preuve

Toute affirmation importante doit pouvoir montrer :

- le workflow réel ;
- l’input ;
- l’output ;
- les actions de l’agent ;
- le propriétaire humain ;
- le périmètre ;
- les accès ;
- la trace d’exécution ;
- le point de contrôle ;
- le résultat mesuré ou l’état réel du déploiement ;
- le transfert d’autonomie.

## Personnalité

Parrit est :

- direct ;
- testé sur le terrain ;
- exigeant ;
- calme ;
- intelligent ;
- humain ;
- éditorial ;
- anti-hype ;
- crédible à l’international.

Paul doit être perçu comme un opérateur accessible, pas comme un influenceur ni comme un modèle publicitaire.

## Tensions créatives

- humain / machine ;
- artisanat / système ;
- vitesse / contrôle ;
- autonomie / responsabilité ;
- culture éditoriale / rigueur opérationnelle ;
- simplicité visible / complexité cachée ;
- intuition / trace ;
- mouvement / cadre.

## Concept visuel

### Editorial Operating System

Un journal de terrain contemporain pour les personnes qui construisent des systèmes.

La base :

- papier blanc cassé ;
- encre noire ;
- un rouge signal ;
- hiérarchie éditoriale forte ;
- trame halftone ;
- lignes et nœuds rouges lorsqu’ils expliquent une causalité ;
- photographie humaine documentaire ;
- grands espaces négatifs ;
- géométrie plutôt carrée ;
- grain tactile et maîtrisé.

## Règles obligatoires

- Une idée dominante par écran.
- Montrer l’exécution plutôt que l’abstraction.
- Montrer de vrais inputs et outputs.
- Garder le contrôle humain visible.
- Rendre la complexité lisible.
- Concevoir chaque asset pour être réutilisable.
- Préférer la preuve à la promesse.
- Préférer l’espace à la décoration.
- Utiliser le rouge comme signal, jamais comme papier peint.
- Séparer la photo propre de la couche graphique.
- Construire mobile et desktop comme deux compositions cohérentes.
- Toute décision stable doit être documentée et versionnée.

## Interdits visuels

- dégradés bleu-violet typiques des sites IA ;
- néons et cyberpunk ;
- hologrammes ;
- robots humanoïdes ;
- blobs 3D génériques ;
- glassmorphism comme langage par défaut ;
- accumulation de cartes arrondies ;
- dashboards décoratifs avec fausses données ;
- photos de stock trop parfaites ;
- visage de mannequin à la place de Paul ;
- bruit visuel sans rôle explicatif.

## Action principale du site

L’utilisateur ne choisit pas d’abord une offre. Il décrit d’abord un workflow douloureux.

**Action principale :** Tester un cas avec Hermès.  
**Action secondaire :** Parler à Paul.

## Hermès

Hermès est à la fois :

- une interface de qualification ;
- une preuve de la méthode Parrit ;
- un générateur de résumé de faisabilité ;
- un orchestrateur d’expériences supervisées ;
- un bibliothécaire de la source de vérité.

Hermès ne doit pas être présenté comme un collègue humain. Il doit rendre visibles ses limites, son périmètre et son niveau de confiance.

## Boucle d’amélioration

Le site peut s’améliorer selon cette boucle :

`observer → diagnostiquer → formuler une hypothèse → créer une variante → tester → faire valider → exposer → analyser → promouvoir ou revenir en arrière → mettre à jour la source`

Aucune modification stable de marque, de confidentialité, de prix, d’offre ou de promesse centrale ne peut être publiée sans validation explicite.

## Langues

- langue principale : français ;
- langue secondaire : anglais ;
- les versions doivent rester sémantiquement équivalentes ;
- une traduction ne doit pas devenir une réécriture stratégique non documentée.

---

<!-- source: brand/00A_POSITIONING_INTERNAL.md sha256:be1bd875b62a43d7 mode:full -->

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

---

<!-- source: brand/00B_POSITIONING_EXTERNAL.md sha256:1a8578eee5512157 mode:full -->

---
document: 00B_POSITIONING_EXTERNAL
status: approved
version: 1.0.0
approved_at: 2026-08-02
owner: Paul Larmaraud
registre: PUBLIC
---

# 00B · Positionnement externe

**Statut `approved`.** Ce document est le contrat stable entre Parrit.ai et le marché. Il est simple, compréhensible, mémorisable, cohérent dans le temps, et utilisable sur le site, dans la VSL, les contenus et la prospection.

**Il évolue rarement, et uniquement après une décision explicite de Paul.** Il n'est pas réécrit lorsqu'une nouvelle capacité, offre, architecture ou hypothèse apparaît en interne.

**Aucun prix n'y figure. Aucun prototype gratuit n'y est promis.**

> L'origine de chaque section est indiquée en fin de bloc. Les contenus sans source antérieure sont marqués `NOUVEAU`.

---

## 1. Promesse publique

**Phrase canonique**, verrouillée mot pour mot, jamais reformulée.

> **FR** · L’IA construite autour de votre entreprise.
> **EN** · AI built around your business.

**Explication**, verrouillée.

> **FR** · Nous comprenons votre contexte, identifions ce qui mérite d’être construit, puis concevons et faisons fonctionner les systèmes IA adaptés à vos données, vos règles, vos outils et vos équipes.
> **EN** · We understand your context, identify what is worth building, then design and deploy AI systems around your data, rules, tools, and teams.

**Différenciation**, verrouillée.

> **FR** · Nous ne vous imposons pas une solution déjà prête. Nous partons de votre réalité pour construire ce qui doit réellement fonctionner chez vous.
> **EN** · We do not force you into an off-the-shelf solution. We start from how your business actually works and build what needs to work for you.

Les quatorze paires verrouillées sont dans `positioning-os/10-LOCKED-PUBLIC-COPY.md`, qui gagne sur les phrases exactes. « Nous construisons l'IA autour de votre entreprise, pas l'inverse » n'est **pas** verrouillée : c'est une formulation commerciale, disponible dans `00C` et dans la réserve `09`.

*Origine : `positioning-os/10` paires 1, 2 et 3 · arbitrage de Paul du 02/08 sur la non-création d'une quinzième paire.*

## 2. Audiences

**Audience de marque.** Une personne, dans une entreprise, qui veut comprendre ce que l'IA peut changer dans son travail ou dans son organisation. Elle s'en sert peut-être simplement, sans comprendre les agents ni le code. Dirigeante, direction métier, responsable d'équipe, employée ou référente interne, avec ou sans pouvoir de décision.

**La marque parle largement. La qualification vient après la compréhension**, jamais sur la page d'accueil.

*Origine : `positioning-os/03` §5 et §6.*

## 3. Problèmes

Une entreprise sait qu'elle doit s'y mettre. Elle ignore par quoi commencer, craint de payer pour un document ou une session qui ne laisse rien derrière elle, et peut avoir déjà été déçue.

Le marché fragmente généralement la responsabilité entre cinq acteurs : l'outil, la formation, le conseil, l'intégration et l'exploitation. Le passage entre ces parts reste à la charge du client.

**Parrit.ai cherche à maintenir cette responsabilité dans une même relation.**

Trois formulations selon la maturité du lecteur.

- Vous savez qu'il faut s'y mettre. Vous ne savez pas par où commencer, et vous ne voulez pas payer pour un rapport.
- Vous avez essayé des outils. Rien n'est vraiment entré dans vos opérations.
- Vos systèmes tournent, mais personne ne sait ce qu'ils ont produit ni qui a validé quoi.

*Origine : `positioning-os/03` §7 · `07` §3.*

## 4. Transformation

**Avant** : des usages dispersés, des processus encore portés manuellement, des responsabilités peu claires, des outils fragmentés.

**Après** : un ou plusieurs systèmes fonctionnent sur les données réelles, les validations sont définies, les responsabilités sont claires, les usages sont observables, et le client choisit ensuite son régime de suite.

**Aucun gain chiffré n'est promis.** Aucun pourcentage, aucune durée gagnée, aucun montant économisé.

Le déplacement visé : de « il faut que je m'y mette » à « je sais à qui en parler ».

*Origine : `positioning-os/03` §8.*

## 5. Les trois piliers publics

`NOUVEAU, arbitrage de Paul du 02/08/2026.`

**1. Transformer.** Comprendre les opportunités, prioriser et faire évoluer les méthodes.

**2. Construire.** Développer des logiciels adaptés aux opérations réelles.

**3. Déployer.** Mettre en production des agents qui exécutent, vérifient et travaillent avec les équipes.

**La formation traverse les trois piliers. Ce n'est pas une activité isolée.**

**Deux précisions de cadrage.** Les piliers décrivent ce que fait Parrit.ai. La progression du client se lit sur une autre échelle, Commencer, Transformer, Piloter. **Les deux ne sont jamais présentées comme des architectures concurrentes.** Et le pilier Déployer décrit ce que Parrit.ai fait, pas un état atteint chez tous les clients.

*Origine : arbitrage de Paul du 02/08/2026. Aucune source antérieure.*

## 6. Offres visibles

Ce que le marché voit, sans aucun prix.

| Offre visible | Ce que le client obtient |
|---|---|
| **Premier échange** | Trente minutes pour comprendre sa situation et voir si un sujet mérite d'être travaillé. Gratuit, sans engagement, sans prototype promis |
| **Session de sélection** | Une heure pour choisir le bon premier cas d'usage et repartir avec une décision |
| **Premier système** | Un objet borné qui fonctionne sur ses données réelles, avec ses validations |
| **Transformation** | Plusieurs systèmes reliés, l'adoption, la mesure et la gouvernance |
| **Suite** | Continuer avec Parrit.ai, reprendre progressivement en interne, ou partager les responsabilités |

Formats disponibles selon les cas : veille spécialisée, agent mail, outil métier, préparation de réponses, qualification de données, prototype, formation appliquée, session pratique.

**Règle absolue.** Aucun prix sur le site. Les montants sont communiqués après qualification, dans un devis ou un lien privé.

*Origine : `positioning-os/04` sections 2 à 6, dépouillées de tout montant.*

## 7. Preuves publiables

**Quatre familles de problèmes traités**, anonymisées.

1. Préparer une décision commerciale à partir d'un fichier trop gros pour être lu.
2. Faire arriver chaque semaine une information de niche sans que personne ne la cherche.
3. Trier ce qui arrive et préparer une réponse qu'un humain signe.
4. Donner à une entreprise un outil métier qui n'existait dans aucun logiciel du marché.

**Preuves de méthode.** Six critères de sélection écrits. Des points de validation humaine avec la trace de qui a validé quoi. Un périmètre écrit avant de commencer. Des contrôles qui bloquent la publication d'un chiffre non recalculé.

**Preuve de parcours.** Lime, 2022 à 2024, lancement des Swap Stations sur le marché parisien, dernier intitulé *AI Innovation & Enablement*.

**Ce qui ne se dit pas.** Aucun ROI, aucun gain chiffré, aucun client nommé sans consentement écrit, aucun délai systématique, aucune spécialisation sectorielle, aucun nom de concurrent.

**Phrase de cadrage** : les problèmes sont différents, la méthode est la même. La largeur se montre, elle ne se revendique pas.

*Origine : `positioning-os/05` §13 · `06` §17 · `03` §12.*

## 8. Ton

Direct, humain, chaleureux, précis, énergique, simple. Parfois légèrement drôle lorsque cela vient naturellement. Exigeant sans condescendance, sûr de sa méthode sans posture de gourou.

**Séquence en quatre temps**, dans cet ordre, sur toute page et tout contenu : rassurer, éveiller la curiosité, montrer le niveau, déclencher l'action.

**Voix.** Paul raconte en « je ». Parrit.ai agit en « nous ».

**Rythme.** Une idée par paragraphe, deux à cinq phrases quand le sujet le permet, des formulations dicibles à voix haute. Ni saut de ligne après chaque phrase, ni accumulation de punchlines, ni manifeste.

**Le mot IA apparaît dès les premières sections.** Aucune formule vague pour le contourner.

**Interdits.** Révolutionner, disrupter, magie, collaborateurs virtuels, armée d'agents, employé IA, plug and play, sans effort, clé en main, transformation garantie, dix fois plus productif, nous automatisons tout, nous construisons tout, dix ans d'avance, technologie de pointe sans preuve, accompagnement de bout en bout sans détail. Le tiret cadratin bloque la publication.

*Origine : `positioning-os/05` §6, §7 et §17 · `07` §2, §9, §10 et §13.*

## 9. CTA

**Le CTA public principal est le premier échange de trente minutes**, gratuit. Intention : réserver un premier échange pour comprendre ce que Parrit.ai peut faire dans votre situation.

Formulation verrouillée du CTA : **FR** « Parlez-nous de ce qui vous prend du temps. » · **EN** « Tell us what’s taking up your time. »

**Ce qu'un CTA ne fait jamais** : afficher un prix, renvoyer vers un paiement, laisser croire qu'un prototype est offert, demander des accès sensibles, annoncer un délai ou un résultat.

Intentions par niveau : voir un exemple ou recevoir une ressource pour la découverte, réserver un premier échange pour la curiosité et le problème identifié, parler de l'ensemble de ses systèmes pour un profil avancé.

*Origine : `positioning-os/10` paire 14 · `07` §18 · `08` §11.*

## 10. VSL

`NOUVEAU, arbitrage de Paul du 02/08/2026.` Cadre uniquement. Ni durée, ni chiffre, ni témoignage, ni cas client, ni script final.

**Rôle.** Faire comprendre en une seule écoute ce que Parrit.ai prend en charge, à quelqu'un qui n'a pas envie de lire. Elle remplace la lecture de la page, elle ne la résume pas.

**Structure en cinq mouvements.**

1. Le problème reconnu par le spectateur, dans ses termes.
2. Ce que le marché lui a déjà vendu, et pourquoi ça n'a rien laissé.
3. Ce que nous faisons à la place : comprendre, choisir, construire, faire fonctionner, faire adopter.
4. Une chose qui tourne, montrée à l'écran.
5. Le premier pas, gratuit et sans engagement.

**Messages à démontrer**, pas à énoncer : nous partons de son travail réel, nous décidons avant de construire, il garde la main, quelque chose fonctionne à la fin.

**Preuves nécessaires avant tournage.** Un système filmable en fonctionnement. Un point de validation humaine visible à l'écran. La liste des six critères. Un consentement écrit si un environnement client apparaît.

**CTA.** Celui du §9, sans variante.

**Contraintes de design et d'accessibilité.** Tokens de `01_DESIGN_TOKENS.md`. Sous titres FR et EN obligatoires. Compréhensible sans le son. Aucun prix à l'image. Aucun chiffre de résultat. Aucune esthétique IA générique.

*Origine : arbitrage de Paul du 02/08/2026. Aucune source antérieure.*

## 11. Objections

Réponses courtes, publiables. Aucune ne promet un résultat non démontré.

| Objection | Réponse |
|---|---|
| Nous avons déjà ChatGPT | Tant mieux, c'est un bon point de départ. La question suivante, c'est ce qui tourne tout seul pendant que personne ne tape dedans |
| Nous avons déjà fait une formation | Alors vos équipes savent mieux s'en servir. Ce qui manque en général, c'est un système qui fait le travail sans qu'on y pense |
| Nous avons déjà testé un agent | La plupart des essais échouent parce que le mauvais processus a été choisi. On peut regarder ensemble ce qui a coincé |
| Nous ne savons pas par où commencer | C'est exactement le sujet du premier échange. Nous avons des critères écrits, et nous les appliquons avec vous |
| Nos données sont sensibles | Nous demandons les accès au moment où ils sont nécessaires, pas avant |
| Nous avons déjà une DSI | Très bien, nous travaillons avec elle. Nous apportons le choix des cas et la mise en usage, elle garde la main sur les accès et la sécurité |
| Nous ne voulons pas dépendre d'un prestataire | C'est une décision que vous prenez à la fin. Ce que nous construisons reste chez vous |
| Cela va prendre des mois | Nous commençons petit et borné, et nous vous disons avant de commencer combien de temps nous pensons qu'il faudra |
| Nous voulons commencer petit | C'est notre manière de faire par défaut. Un objet, un processus, un résultat visible |
| Combien je vais gagner | Je ne vous donnerai pas un chiffre que je n'ai pas mesuré. On peut poser le compteur dès le premier système |

*Origine : `positioning-os/09` §15 · `07` §7 et §8.*

---

## Contrôle des changements

`NOUVEAU, arbitrage de Paul du 02/08/2026.`

**Ce document reste stable jusqu'à une nouvelle décision explicite de Paul.** Aucune date de fin n'est fixée. Toute modification exige le bloc complet ci dessous et l'approbation explicite de Paul.

```
Date :
Section modifiée :
Raison du changement :
Impact sur le site :
Impact sur les offres :
Impact sur la VSL :
Impact sur les contenus existants :
Approbation explicite de Paul : oui / non
```

**Ce qui ne déclenche pas de modification** : une nouvelle capacité interne, une offre testée, une architecture, une hypothèse, un apprentissage de production. Ces évolutions vivent dans `00A`.

**Cinq catégories de proposition.** Amélioration de formulation sans changement de sens, nouvelle preuve, nouveau cas d'usage, nouvelle offre, changement réel de positionnement. Seule la dernière exige une décision de Paul, et doit rester exceptionnelle.

**Test de cohérence** avant toute nouvelle page, offre, campagne ou contenu. Cela renforce-t-il l'idée que Parrit.ai peut prendre en charge le sujet IA ? Montre-t-on l'IA mise au travail plutôt qu'une technologie vendue pour elle-même ? La nouveauté enrichit-elle le positionnement au lieu d'en créer un autre ? Une personne qui la découvre comprend-elle encore la même entreprise ? La largeur est-elle démontrée plutôt que revendiquée ?

*Origine : `positioning-os/07` §23 pour les catégories · gabarit d'impact nouveau.*

---

## Contenus nouveaux dans ce brouillon

| Contenu | Source |
|---|---|
| Les trois piliers Transformer, Construire, Déployer | Arbitrage de Paul, 02/08/2026 |
| La transversalité de la formation | Arbitrage de Paul, 02/08/2026 |
| Le cadre de la VSL | Arbitrage de Paul, 02/08/2026 |
| Le gabarit de contrôle des changements | Arbitrage de Paul, 02/08/2026 |
| Le tableau des offres visibles sans prix | Dérivé de `04`, mise en forme nouvelle |

Tout le reste est extrait du Positioning OS, sans réécriture de fond. Les phrases verrouillées sont citées mot pour mot.

---

<!-- source: brand/00C_COMMERCIAL_NARRATIVE.md sha256:198d081ea323d542 mode:full -->

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

---

<!-- source: positioning-os/10-LOCKED-PUBLIC-COPY.md sha256:da8d6d65af3c339f mode:full -->

# 10 · Copy publique verrouillée

v1 · 02/08/2026. **Source canonique des formulations publiques validées par Paul, en français et en anglais.**

Quatorze paires verrouillées. Elles sont reproduites mot pour mot, sans variante, sans amélioration, sans reformulation.

## Règle de priorité

1. **`10-LOCKED-PUBLIC-COPY.md` gagne pour les phrases exactes.**
2. Le Positioning OS gagne pour le sens stratégique.
3. `09-PUBLIC-COPY-LIBRARY.md` reste une réserve de formulations non verrouillées.

Cette passe ne modifie pas le positionnement. Il reste figé jusqu'au 02/02/2027.

---

## Les quatorze paires verrouillées

### 1. Accroche principale

**FR**

L’IA construite autour de votre entreprise.

**EN**

AI built around your business.

---

### 2. Sous-titre principal

**FR**

Nous comprenons votre contexte, identifions ce qui mérite d’être construit, puis concevons et faisons fonctionner les systèmes IA adaptés à vos données, vos règles, vos outils et vos équipes.

**EN**

We understand your context, identify what is worth building, then design and deploy AI systems around your data, rules, tools, and teams.

---

### 3. Différenciation

**FR**

Nous ne vous imposons pas une solution déjà prête. Nous partons de votre réalité pour construire ce qui doit réellement fonctionner chez vous.

**EN**

We do not force you into an off-the-shelf solution. We start from how your business actually works and build what needs to work for you.

---

### 4. Autonomie et système ouvert

**FR**

Nous concevons le système pour que vous puissiez le comprendre, le superviser et, si vous le souhaitez, en reprendre progressivement le pilotage.

**EN**

We design the system so you can understand it, oversee it, and gradually take control whenever you choose.

---

### 5. Point d’entrée humain

**FR**

Vos équipes ont mieux à faire que passer leurs journées dans l’administratif.

**EN**

Your teams have better things to do than spend their days buried in admin.

---

### 6. Libération des équipes

**FR**

Nous construisons les systèmes IA qui leur rendent du temps, de l’énergie et de la capacité d’action.

**EN**

We build AI systems that give them back time, energy, and the ability to act.

---

### 7. Passage vers la croissance

**FR**

Une fois les mains libérées, nous mettons cette capacité retrouvée au service de la croissance.

**EN**

Once their hands are free, we turn that regained capacity toward growth.

---

### 8. Articulation administratif et croissance

**FR**

Nous commençons par ce qui ralentit vos équipes. Puis nous construisons ce qui peut accélérer votre entreprise.

**EN**

We start with what slows your teams down. Then we build what helps your business move faster.

---

### 9. Discernement

**FR**

Avant de construire, nous identifions ce qui mérite réellement de l’être.

**EN**

Before we build, we identify what is truly worth building.

---

### 10. Réponse à « concrètement, que faites-vous ? »

**FR**

Nous commençons par libérer vos équipes de l’administratif. Puis nous construisons les systèmes qui soutiennent la croissance.

**EN**

We start by freeing your teams from admin. Then we build the systems that support growth.

---

### 11. Profondeur d’exécution

**FR**

Nous ne nous arrêtons pas au prototype. Nous vous accompagnons jusqu’à la mise en fonctionnement et à l’adoption par vos équipes.

**EN**

We do not stop at the prototype. We stay with you through rollout and adoption across your teams.

---

### 12. Choix du régime de suite

**FR**

Vous pouvez ensuite continuer à piloter le système avec nous, le reprendre progressivement en interne ou partager les responsabilités.

**EN**

You can then keep running the system with us, gradually bring it in-house, or share responsibility.

---

### 13. Relation directe et humaine

**FR**

Vous travaillez directement avec les personnes qui comprennent votre contexte et construisent le système.

**EN**

You work directly with the people who understand your context and build the system.

---

### 14. Appel à l’action

**FR**

Parlez-nous de ce qui vous prend du temps.

**EN**

Tell us what’s taking up your time.

---

## Règles publiques

- Les versions françaises et anglaises ont la même priorité.
- Aucune phrase ne peut être traduite à nouveau librement.
- Aucune phrase ne doit être modifiée pour s'adapter à une maquette.
- L'agent UX/UI peut sélectionner, placer et mettre en scène les blocs.
- L'agent UX/UI ne peut pas réécrire les formulations verrouillées.
- Toutes les phrases ne sont pas obligées d'apparaître sur la même page.
- L'ordre visuel reste du ressort de l'UX/UI.
- Le sens doit progresser du cœur vers le cerveau.
- L'humain est une dimension du positionnement et de la communication, pas une structure visuelle imposée.
- Aucun prix ne doit apparaître publiquement.
- Aucun prototype gratuit ne doit être promis publiquement.

## Vocabulaire retiré de la copy publique

Les expressions suivantes ne font plus partie de la copy publique principale.

- cousu main
- maison d'ingénierie
- premium
- haut de gamme
- luxe

Les idées correspondantes restent présentes dans la qualité du jugement, de la construction, de la relation et de l'exécution. **Elles ne doivent plus être revendiquées directement.**

---

## Sources référencées, à lire à la demande

Ces documents ne sont pas chargés automatiquement. Les ouvrir uniquement quand la question l'exige.

| Source | sha256 |
|---|---|
| `positioning-os/02B-DECISION-LOG.md` | `345a0e2db77f4272` |
| `positioning-os/03-POSITIONING-ONE-PAGER.md` | `ae36b8c31dbc42d5` |
| `positioning-os/04-OFFER-LADDER.md` | `4f96aa585354d0b3` |
| `positioning-os/05-BRAND-FOUNDATIONS.md` | `52d191741ad69941` |
| `positioning-os/06-STORYTELLING.md` | `2c89bbfb292c49eb` |
| `positioning-os/07-COPY-OS.md` | `9061903dd6e1188a` |
| `positioning-os/08-SITE-MESSAGING-ARCHITECTURE.md` | `5d1f34ab681b7f64` |
| `positioning-os/09-PUBLIC-COPY-LIBRARY.md` | `305dd69a253bd2ef` |
| `brand/01_DESIGN_TOKENS.md` | `2389a0a43d5a4b0b` |
| `brand/02_COMPONENTS.md` | `02509e5e685610fa` |
| `brand/03_CONTENT_SYSTEM.md` | `1657cebb0002b996` |
| `brand/04_IMAGE_SYSTEM.md` | `50d87a1121d1a524` |
| `brand/05_HERMES_CONVERSION.md` | `c1897ad4e999d954` |
| `brand/09_GOVERNANCE.md` | `e8110bdec64e5040` |
| `AGENTS.md` | `e5d98a28d57ad3d2` |

## Exclusions de ce profil

- Documents `historical` : `TRUTH.md` · `MATURITE-SOT.md` · `BRAND.md` · `DESIGN-SYSTEM.md` · `design-source/DA-TOKENS-EXTRACTED.md`.
