---
document: 11-FLAGSHIP-USE-CASES
status: living
version: 1.0.0
updated: 2026-08-02
owner: Paul Larmaraud
registre: INTERNAL
---

# 11 · Cas d'usage étendards

Quatre systèmes transformés en objets pédagogiques. Ils servent à vulgariser l'IA agentique et à démontrer la largeur de Parrit.ai par des problèmes traités, jamais par une liste de secteurs ni de fonctions.

**Ce document ne modifie pas le positionnement**, figé dans `00B_POSITIONING_EXTERNAL` et `10-LOCKED-PUBLIC-COPY`. Il ne produit aucun slogan et ne spécialise Parrit.ai dans aucun secteur : les quatre cas viennent de quatre familles différentes précisément pour interdire cette lecture.

## Convention de preuve

| Marqueur | Sens |
|---|---|
| `PROUVÉ` | Une source primaire ouverte l'établit : facture, dépôt, base, fil de messages |
| `OBSERVÉ` | Constaté par une note ou une synthèse, sans inspection directe de la source |
| `À MESURER` | Aucune donnée, un compteur reste à poser |
| `AMBITION` | État visé, non atteint |

**Limite qui pèse sur les quatre cas.** `02C-SOURCE-COVERAGE` établit qu'aucun des quatre systèmes clients n'a été inspecté directement : ni base, ni logs, ni interface. L'affirmation « ça tourne » repose sur des notes. Rien de ce document ne peut donc dépasser `OBSERVÉ` sur l'exécution, ni `À MESURER` sur l'effet.

## Anatomie agentique commune

Huit étapes, identiques dans les quatre cas. C'est cette répétition qui rend l'agentique compréhensible sans vocabulaire technique.

| Étape | Ce que c'est |
|---|---|
| Information entrante | Ce qui déclenche : un fichier, un message, un signal, une échéance |
| Contexte retrouvé | Ce que le système va chercher avant de décider : historique, règles, données liées |
| Décision ou préparation | Ce que l'agent conclut, propose ou rédige |
| Outil utilisé | Ce qu'il actionne : base, messagerie, tableur, dépôt |
| Validation humaine | Le point où une personne tranche |
| Action réalisée | Ce qui part réellement |
| Trace produite | Ce qui reste : qui a validé quoi, quand |
| Résultat mesuré | Le compteur, quand il existe |

**Ce qui distingue un agent d'une automatisation** : les étapes 2 et 3. Une automatisation exécute une règle écrite d'avance. Un agent va chercher le contexte, puis produit une proposition qui n'était pas écrite d'avance. **L'étape 5 est ce qui rend la chose acceptable en entreprise.**

## Standardisation

Chaque cas se lit en deux couches.

**Noyau réutilisable** : connecteurs, ingestion, journaux, permissions, validation, gestion des erreurs, évaluations, supervision, documentation.

**Composition client** : données, règles métier, agrégats, priorités, actions, interfaces, droits, validations, niveau d'autonomie, critères de réussite.

C'est la traduction opérationnelle du principe de `00A` : les briques peuvent être éprouvées, leur composition doit être propre à l'entreprise.

---

# Cas 1 · De la balance générale au reporting investisseurs

**Famille : finance et reporting.**

**1. Nom public provisoire.** Du grand livre au reporting, sans ressaisie.

**2. Phrase simple.** Une entreprise sort chaque mois un export comptable brut, et quelqu'un passe des jours à le transformer en tableau lisible pour ses investisseurs. Le système fait cette transformation, et l'humain valide les chiffres avant qu'ils partent.

**3. Personne concernée.** Un dirigeant ou un directeur financier de PME qui rend des comptes à des actionnaires ou à des investisseurs, sans équipe de contrôle de gestion dédiée.

**4. Situation avant.** `OBSERVÉ` Un export de balance générale, plusieurs centaines de lignes de comptes, retraité à la main dans un tableur, avec un plan de reclassement qui vit dans la tête d'une personne.

**5. Friction.** Le travail est long, il recommence à chaque période, et il n'est pas vérifiable : personne ne peut recomposer un total à partir des lignes sans tout refaire.

**6. Données et outils disponibles.** `OBSERVÉ` L'export comptable, un plan de comptes, des règles de reclassement, un tableur de destination, et le format attendu par le destinataire.

**7. Ce que le système réalise.** Il ingère la balance, applique le plan de reclassement, produit les agrégats, signale les comptes qui ne se recomposent pas, et prépare le document dans le format attendu.

**8. Ce qui relève de l'agentique.** Pas la somme, qui est du calcul. Ce qui est agentique, c'est **le rapprochement d'un compte inconnu avec une règle existante**, la proposition de classement pour un compte jamais vu, et la détection d'un écart que personne n'a demandé de chercher.

**9. Décisions conservées par l'humain.** Le plan de reclassement lui-même. L'arbitrage sur tout compte signalé comme ambigu. Et **la validation finale avant que le document parte à un tiers**, qui est non négociable sur de la donnée financière.

**10. Situation après visée.** `AMBITION` Une transformation reproductible, dont chaque total peut être remonté jusqu'aux lignes d'origine.

**11. Résultat actuellement observé.** `OBSERVÉ` Une compétence de reclassement a été produite et transmise, en version 3.1, après levée de sept incohérences par un contrôle de recalcul.

**12. Résultat actuellement mesuré.** `À MESURER` **Aucun.** Ni durée avant, ni durée après, ni taux d'erreur.

**13. Résultat encore hypothétique.** `AMBITION` Le passage d'environ deux mois et demi à environ deux semaines. **Ce gain ne peut pas être écrit tant que les dates, le périmètre et les livrables des deux situations ne sont pas retrouvés.** En l'état, c'est une affirmation orale sans dossier.

**14. Métrique principale à instrumenter.** Le délai entre la réception de l'export et la validation du document final, mesuré sur trois périodes consécutives.

**15. Sources internes disponibles.** La facture F-2026-034, ouverte et lue, pour l'accompagnement associé. La compétence v3.1 et son journal de corrections.

**16. Sources manquantes.** La chronologie du processus avant intervention. Le périmètre exact des deux situations comparées. Et le point ouvert le plus lourd : **114 comptes de bilan ne se recomposent pas**, ce qui interdit toute déclaration de fiabilité.

**17. Partie réutilisable.** L'ingestion d'un export comptable, le moteur de reclassement, le contrôle de recomposition qui bloque quand un total ne tombe pas, le format de sortie, la trace de validation.

**18. Partie spécifique au client.** Le plan de comptes, les règles de reclassement, les agrégats attendus, le format du destinataire, la personne qui valide.

**19. Conditions du passage en production.** Les 114 comptes réconciliés. Un contrôle bloquant sur la recomposition. Un jeu de test sur au moins trois périodes passées. Et l'accord écrit du client sur l'usage de ses données comptables.

**20. Risques.** *Technique* : un plan de comptes qui évolue sans prévenir casse le reclassement. *Métier* : un reclassement faux produit un document faux qui part à un investisseur. *Sécurité* : la donnée comptable est parmi les plus sensibles, elle exige un socle qui n'est pas encore écrit. *Adoption* : si le contrôleur ne fait pas confiance au reclassement, il refait tout à la main et le système ne sert à rien.

**21. Trente secondes.**
**FR** : « Chaque mois, vous sortez un export comptable et quelqu'un passe des jours à le remettre en forme pour vos investisseurs. Nous construisons le système qui fait cette transformation sur vos règles à vous, qui signale ce qui ne tombe pas juste, et qui attend votre validation avant que quoi que ce soit parte. »
**EN** : "Every month you export raw accounting data, and someone spends days reshaping it for your investors. We build the system that runs that transformation on your own rules, flags whatever does not add up, and waits for your sign off before anything goes out."

**22. Deux minutes.** Montrer l'export brut à l'écran. Montrer la règle de reclassement, écrite et lisible. Lancer la transformation. **Montrer surtout le compte que le système refuse de classer et remonte à l'humain** : c'est là que la démonstration devient crédible. Montrer la validation, puis la trace. Dire ce qui n'est pas fait : le système ne juge pas la qualité de la comptabilité et ne remplace pas un commissaire aux comptes.

**23. Structure d'étude de cas longue.** Le processus avant, chronométré. Pourquoi ce chantier a été choisi selon les six critères. Ce qui a été construit, et ce qui a été refusé. Les sept incohérences trouvées et comment. Les 114 comptes qui résistent, écrits comme tels. Le point de validation. Ce qui reste à mesurer.

---

# Cas 2 · La boîte mail et les dossiers d'un dirigeant de cabinet

**Famille : back-office et knowledge operations.**

**1. Nom public provisoire.** La boîte mail qui prépare le travail à votre place.

**2. Phrase simple.** Un dirigeant reçoit chaque jour des messages qui appellent une réponse, une relance ou un classement. Le système lit ce qui arrive, retrouve le dossier concerné, prépare ce qu'il faut faire, et le lui présente. Il décide, le système exécute.

**3. Personne concernée.** Un dirigeant de cabinet, associé ou gérant, qui traite lui-même sa correspondance et n'a pas le temps de relancer ce qui traîne.

**4. Situation avant.** `OBSERVÉ` Des messages traités dans l'ordre d'arrivée, des relances qui dépendent de la mémoire, et un contexte de dossier dispersé entre la messagerie, les fichiers et les échanges passés.

**5. Friction.** Ce n'est pas le volume, c'est le rattachement. Retrouver de quel dossier parle un message, et ce qu'on avait promis la fois d'avant, coûte plus cher que d'écrire la réponse.

**6. Données et outils disponibles.** `OBSERVÉ` La messagerie professionnelle, les dossiers, l'historique des échanges, et une base de suivi des relances.

**7. Ce que le système réalise.** Il trie ce qui arrive, retrouve le dossier, prépare une proposition d'action, la présente au dirigeant, exécute ce qu'il valide, et garde une trace.

**8. Ce qui relève de l'agentique.** **Le rattachement**. Un message qui ne cite aucun numéro de dossier, et que le système relie quand même au bon dossier par son contenu et par l'historique. Puis la proposition de la bonne suite : relancer, répondre, classer, ou ne rien faire.

**9. Décisions conservées par l'humain.** Tout ce qui sort vers un client ou un tiers. Le dirigeant lit et valide avant l'envoi, sans exception.

**10. Situation après visée.** `AMBITION` Plus rien ne traîne faute d'y avoir pensé, et chaque envoi porte la trace de qui l'a validé.

**11. Résultat actuellement observé.** `OBSERVÉ` Un bot en fonctionnement sur un serveur, 103 événements de relance enregistrés, un usage constaté par le dirigeant.

**12. Résultat actuellement mesuré.** `À MESURER` **Aucun.** Et trois faits doivent être écrits en même temps que le cas : la table de relances **est silencieuse depuis le 6 juillet**, la **dernière décision humaine enregistrée date du 29 juin**, et la table **n'a aucune colonne d'auteur**, ce qui rend le partage des décisions invérifiable. Un second système de veille associé est **inactif depuis le 11 avril**.

**13. Résultat encore hypothétique.** `AMBITION` Toute affirmation sur le chiffre d'affaires du cabinet. **Elle est interdite tant que les relances ne sont pas attribuées et que les revenus ne sont pas rattachés à ces relances.** Ni l'un ni l'autre n'existe.

**14. Métrique principale à instrumenter.** Le taux de messages entrants rattachés au bon dossier sans correction humaine, et le nombre de relances envoyées après validation par période.

**15. Sources internes disponibles.** La table des événements de relance, 103 lignes. Le code du bot. La facture associée, émise au nom d'une autre entité que le cabinet, ce qui doit être corrigé dans toute communication.

**16. Sources manquantes.** L'accès au serveur pour observer l'exécution réelle. La colonne d'auteur, absente. La raison de l'arrêt du 6 juillet. Le consentement écrit du client pour toute publication.

**17. Partie réutilisable.** L'ingestion de messagerie, le moteur de rattachement, la file de propositions, la surface de validation, la trace, la gestion des erreurs.

**18. Partie spécifique au client.** La nomenclature des dossiers, les règles de priorité, le ton des réponses, les délais de relance, les droits d'accès, la personne qui valide.

**19. Conditions du passage en production.** Une colonne d'auteur sur chaque décision. Une supervision qui alerte quand le flux s'arrête, ce qui n'a pas eu lieu en juillet. Un socle de confidentialité écrit, indispensable sur du secret professionnel. Et un accord explicite sur ce que le système a le droit de lire.

**20. Risques.** *Technique* : un système silencieux qui passe pour actif, ce qui s'est déjà produit. *Métier* : une relance envoyée au mauvais dossier. *Sécurité* : correspondance couverte par le secret professionnel, périmètre de lecture à borner par écrit. *Adoption* : si le dirigeant cesse de valider, le système s'arrête sans que personne le remarque.

**21. Trente secondes.**
**FR** : « Vos messages arrivent, et ce qui coûte du temps n'est pas d'y répondre, c'est de retrouver de quel dossier ils parlent. Le système fait ce rattachement, prépare la suite, et vous la présente. Rien ne part sans que vous ayez relu. »
**EN** : "Messages come in, and the expensive part is not writing the reply, it is working out which matter they belong to. The system does that linking, prepares what comes next, and hands it to you. Nothing goes out until you have read it."

**22. Deux minutes.** Montrer un message qui ne cite aucune référence. Montrer le système retrouver le dossier et dire pourquoi. Montrer la proposition de relance. **Montrer le refus de valider, et ce qui se passe alors.** Montrer la trace. Dire ce qui n'est pas fait : le système ne donne aucun avis juridique et n'écrit rien qui parte sans lecture.

**23. Structure d'étude de cas longue.** Le rattachement comme problème central. Pourquoi ce chantier plutôt qu'un autre. Le choix de la validation systématique. Les 103 événements. **L'arrêt de juillet, raconté** : c'est le passage le plus utile du cas, parce qu'il montre ce qui manquait, une supervision. Ce qui reste à instrumenter.

---

# Cas 3 · Le CRM d'un grossiste en fruits et légumes

**Famille : outil métier vertical.**

**1. Nom public provisoire.** L'outil métier qui n'existait dans aucun logiciel du marché.

**2. Phrase simple.** Un grossiste travaillait avec des tableurs et des messages, parce qu'aucun CRM du marché ne parle son métier. Nous lui avons construit le sien, sur ses données, et il le pilote depuis la messagerie qu'il utilise déjà.

**3. Personne concernée.** Un dirigeant de PME de négoce, avec de vraies opérations quotidiennes, des clients récurrents, et des équipes qui travaillent depuis le terrain plutôt que devant un écran.

**4. Situation avant.** `OBSERVÉ` Des tableurs, des échanges dispersés, et un suivi commercial qui dépend de qui se souvient de quoi.

**5. Friction.** Les CRM du marché imposent leur modèle de données. Un négoce de produits frais raisonne en tournées, en volumes et en saison, pas en pipeline d'opportunités.

**6. Données et outils disponibles.** `OBSERVÉ` Les fichiers clients existants, l'historique commercial, une base hébergée, et une messagerie mobile déjà adoptée par les équipes.

**7. Ce que le système réalise.** Il centralise les clients et l'activité, présente ce qu'il faut faire, et permet d'agir depuis un téléphone sans ouvrir un logiciel.

**8. Ce qui relève de l'agentique.** Pas le CRM lui-même, qui est du logiciel sur mesure. Ce qui est agentique, c'est **ce qui décide quoi remonter à qui, et quand** : repérer le client qu'on n'a pas rappelé, préparer la relance, et la présenter dans la messagerie plutôt que d'attendre que quelqu'un ouvre un écran.

**9. Décisions conservées par l'humain.** Toute la décision commerciale. Le système propose une priorité, il ne contacte personne seul.

**10. Situation après visée.** `AMBITION` Une équipe qui travaille depuis le terrain avec le même niveau d'information que devant un ordinateur.

**11. Résultat actuellement observé.** `OBSERVÉ` Un CRM construit sur mesure, avec un dépôt de code réel et actif, dernier commit le 23 juillet, et un usage constaté par le client.

**12. Résultat actuellement mesuré.** `À MESURER` **Aucun.** Aucun compteur d'usage, aucun effet commercial mesuré. **Aucune facture n'existe pour ce dossier**, ce qui doit être connu en interne avant toute mise en avant.

**13. Résultat encore hypothétique.** `AMBITION` Tout effet sur le chiffre d'affaires, la rétention ou la productivité commerciale.

**14. Métrique principale à instrumenter.** Le nombre d'utilisateurs actifs par semaine et le nombre d'actions commerciales enregistrées depuis la messagerie.

**15. Sources internes disponibles.** Le dépôt de code et son historique. Les comptes rendus de réunion de retour sur la phase 1.

**16. Sources manquantes.** L'accès au serveur, dont la clé n'est pas détenue par Paul. Les journaux d'usage. Le statut de signature de deux documents contractuels, illisibles au-delà de la première page. Le consentement de publication.

**17. Partie réutilisable.** Le socle de base de données, l'authentification et les droits, le connecteur de messagerie, la file de notifications, les journaux, la supervision, la documentation.

**18. Partie spécifique au client.** Le modèle de données du négoce, les règles de priorité commerciale, les agrégats de tournée et de volume, les interfaces mobiles, les droits par rôle.

**19. Conditions du passage en production.** La reprise des accès serveur par Parrit.ai ou par le client, **point bloquant tant que la clé appartient à une personne qui quitte l'entreprise**. Une supervision. Une documentation de reprise. Un cadre contractuel signé.

**20. Risques.** *Technique* : un actif construit par une seule personne, sans reprise organisée. *Métier* : un modèle de données trop taillé pour un client rend la brique difficile à réemployer. *Sécurité* : données clients et commerciales, accès à cloisonner par rôle. *Adoption* : la messagerie est un bon canal parce qu'elle est déjà utilisée ; elle devient un mauvais canal si le volume de notifications dépasse ce qu'une personne lit.

**21. Trente secondes.**
**FR** : « Aucun logiciel du marché ne parlait le métier de ce grossiste, alors nous avons construit le sien. Il vit sur ses données, il se pilote depuis la messagerie que ses équipes utilisent déjà, et il leur dit quoi faire en premier. »
**EN** : "No off-the-shelf tool spoke this wholesaler's trade, so we built the one that does. It runs on his own data, it is driven from the messaging app his teams already use, and it tells them what to handle first."

**22. Deux minutes.** Montrer le modèle de données, et **un champ qui n'existe dans aucun CRM du marché** : c'est la démonstration la plus économique du sur mesure. Montrer une relance qui arrive dans la messagerie. Montrer l'action et son enregistrement. Dire ce qui n'est pas fait : le système ne contacte aucun client de lui-même.

**23. Structure d'étude de cas longue.** Pourquoi un logiciel du marché ne convenait pas, avec le champ qui le prouve. Ce qui a été réutilisé et ce qui a été conçu. Le choix de la messagerie comme interface. Ce qui reste à instrumenter. **Et la dépendance à une seule personne, racontée comme une leçon**, puisqu'elle a produit une règle interne.

---

# Cas 4 · Le système de croissance de Parrit.ai

**Famille : croissance.**

**1. Nom public provisoire.** Notre propre machine, et ce qu'elle nous a appris.

**2. Phrase simple.** Nous avons construit pour nous-mêmes un système qui repère les entreprises au bon moment, prépare l'approche et produit le contenu. Nous en parlons surtout parce qu'il nous a coûté cher à apprendre.

**3. Personne concernée.** Un dirigeant ou un responsable commercial qui veut faire venir des clients sans embaucher une équipe.

**4. Situation avant.** `OBSERVÉ` Une prospection portée par une personne, dépendante de sa mémoire et de son temps.

**5. Friction.** Trois problèmes distincts qu'on confond souvent : trouver qui contacter, savoir quand, et avoir quelque chose à dire qui ne ressemble pas à un envoi de masse.

**6. Données et outils disponibles.** `OBSERVÉ` Des sources de signaux publics, une base de prospects, un outil d'envoi, une chaîne de production de contenu.

**7. Ce que le système réalise.** Il capte des signaux, les qualifie, prépare une approche vérifiée, et alimente une production de contenu.

**8. Ce qui relève de l'agentique.** **La qualification** : passer de milliers de signaux bruts à une poignée qui mérite un geste, en allant chercher le contexte de chaque entreprise. Et la préparation d'une accroche fondée sur un fait récent et vérifié, plutôt que sur un modèle de message.

**9. Décisions conservées par l'humain.** L'envoi. Sans exception, et c'est la règle née de l'incident le plus coûteux du dossier.

**10. Situation après visée.** `AMBITION` Un flux régulier de rendez-vous qualifiés, dont l'origine est traçable.

**11. Résultat actuellement observé.** `OBSERVÉ` L'entonnoir de qualification fonctionne : environ 5 055 signaux réduits à 10 retenus, pour un coût nul. La chaîne de production de contenu et d'artefacts commerciaux fonctionne : `PROUVÉ` sur la fabrication, avec 16 propositions chiffrées produites.

**12. Résultat actuellement mesuré.** `À MESURER` sur l'effet commercial. Les chiffres disponibles sont des chiffres d'échec, et ils font partie du cas : **476 envois à froid, zéro réponse, zéro affaire**. **Aucune affaire ne peut être revendiquée par ce système, faute d'origine traçable.** Le canal qui a produit des affaires est le réseau, pas la machine.

**13. Résultat encore hypothétique.** `AMBITION` Que le contenu produise des entrants qualifiés. Que la source de signaux redevienne vivante : **le dernier signal capté date du 19 mai**.

**14. Métrique principale à instrumenter.** Le nombre de rendez-vous qualifiés dont l'origine est attribuée à une source précise, mesuré mensuellement.

**15. Sources internes disponibles.** Les compteurs de l'entonnoir. Les journaux d'envoi. La chaîne de production de contenu.

**16. Sources manquantes.** L'attribution de bout en bout, du signal jusqu'à l'affaire. Une source de signaux vivante.

**17. Partie réutilisable.** L'ingestion de signaux, la qualification, l'enrichissement, la file de validation, les journaux, le contrôle de préflux qui bloque un envoi mal formé, la production de contenu.

**18. Partie spécifique au client.** Les sources de signaux, les critères de qualification, le message, les canaux, les seuils, la personne qui valide.

**19. Conditions du passage en production chez un client.** Un contrôle de préflux obligatoire. Une attribution posée avant le premier envoi. Une source de signaux vérifiée. Et le respect des règles applicables à la prospection.

**20. Risques.** *Technique* : une source qui meurt sans alerte, ce qui est arrivé. *Métier* : un envoi de masse mal préparé brûle des adresses et une réputation, ce qui est arrivé : **986 messages vides partis, 512 boîtes brûlées**. *Sécurité et conformité* : données personnelles, base légale et droit d'opposition à traiter avant tout envoi. *Adoption* : un système qui produit plus de propositions qu'une personne n'en valide s'arrête de lui-même.

**21. Trente secondes.**
**FR** : « Nous avons construit notre propre machine de croissance : repérer les bonnes entreprises au bon moment, préparer une approche vérifiée, produire le contenu. Nous en parlons surtout pour ce qu'elle nous a appris, y compris ce qu'elle nous a coûté. »
**EN** : "We built our own growth machine: spot the right companies at the right time, prepare a checked approach, produce the content. We mostly talk about it for what it taught us, including what it cost us."

**22. Deux minutes.** Montrer l'entonnoir : le volume d'entrée, les filtres, le petit nombre qui sort. **Montrer l'incident des envois vides et la règle qui en est née.** Montrer le contrôle de préflux qui bloque désormais. Dire ce qui n'est pas fait : aucune affaire n'est attribuée à cette machine à ce jour.

**23. Structure d'étude de cas longue.** Les trois problèmes distincts. Ce qui a été construit. L'incident, en détail. La règle écrite après. Ce qui a été coupé et pourquoi. **Ce que la machine n'a pas produit**, ce qui est le passage le plus crédible du récit. Ce qui reste à instrumenter.

---

## Ce que les quatre cas démontrent ensemble

**Quatre familles, une seule méthode.** Finance et reporting, back-office et knowledge operations, outil métier vertical, croissance. Le problème change à chaque fois, la méthode ne change pas : comprendre, choisir, construire sur les données réelles, mettre en fonctionnement, faire adopter, puis opérer ou transmettre.

**Les mêmes huit étapes** apparaissent dans les quatre cas, ce qui permet à une personne non technique de reconnaître un système agentique la troisième fois qu'elle le voit.

**La même frontière humaine.** Dans les quatre cas, l'action vers l'extérieur passe par une validation. C'est ce qui rend le sujet acceptable en entreprise, et c'est vérifiable.

**Ces quatre cas ne sont pas quatre limites de l'offre.** Ils sont quatre exemples d'une méthode transsectorielle. Toute communication qui les transformerait en catalogue, en verticales ou en spécialisations sectorielles contredirait `00B`.

**Le GEO reste hors de cette liste.** Il peut être mentionné comme tactique intégrée à l'intérieur du cas 4, jamais comme cas étendard.

## État de preuve consolidé

| Cas | Exécution | Effet | Publiable en l'état |
|---|---|---|---|
| 1 · Reporting | `OBSERVÉ` | `À MESURER` | Oui, en décrivant la méthode et le problème, sans aucun gain de délai |
| 2 · Cabinet | `OBSERVÉ`, avec arrêt constaté | `À MESURER` | Oui, sans nommer le client et sans aucune affirmation de revenu |
| 3 · CRM | `OBSERVÉ`, dépôt actif | `À MESURER` | Oui, en décrivant la fonction, sans nommer le client |
| 4 · Croissance | `PROUVÉ` sur la fabrication | `À MESURER`, chiffres d'échec disponibles | Oui, y compris l'incident, qui est la partie la plus crédible |

**Aucun gain non mesuré n'est affirmé dans ce document.** Les seuls chiffres publiables aujourd'hui sont des chiffres de volume et d'échec, pas des chiffres de résultat.
