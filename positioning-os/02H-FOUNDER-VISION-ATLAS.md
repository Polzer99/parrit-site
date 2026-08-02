# 02H · Atlas de la vision du fondateur

01/08/2026. Reconstruction de la pensée de Paul Larmaraud à partir de ses mots, dans leurs contextes.

**Ce document n'est pas un audit commercial.** Il ne déduit pas l'entreprise future des premières factures. Les preuves historiques contraignent la vision ; elles ne la choisissent pas.

---

## 1. Méthode et couverture

**Nettoyage du corpus.** Sur 1 754 lignes, 65,1 % sont des notifications téléphoniques automatiques. En excluant celles-ci, les entrées de calendrier, les tests et tout ce qui fait moins de 1 500 caractères, il reste **319 conversations humaines réelles**, 3 379 770 caractères, du **26/01/2026 au 01/08/2026**.

**Transcripts réellement lus intégralement pour ce document : 21**, par quatre flux parallèles, plus la vérification directe de deux passages disputés. Volume lu : environ 1,5 million de caractères.

**Documents écrits par Paul, lus intégralement** : `VISION.md` (527 lignes, 25/05), `METHODE.md` (26/04), `IDENTITY.md`, `ESPRIT-PARRIT.md` (28/07), `ADN-PARRIT.md` §1 (30/07), `docs/ARBITRAGES.md` (61 arbitrages), `REGLES-DOR.md` (48 règles), `CLAUDE.md`.

**Contextes couverts** : réflexion avec Maxime (5), décision interne (6), pensée spontanée (7), réaction à un échec (9), ambition future (10), explication du métier à un partenaire (3), travail client (4), vente (1), préparation de propale (2). Le contexte 8 (réaction à un succès) est **quasi absent du corpus** : c'est une lacune, pas un choix.

**Erreurs de données rencontrées, toutes vérifiées.**

- **Trois misattributions de `prospect_id` prouvées** : un transcript étiqueté Laparra contient une préparation de deal IUC ; un étiqueté Lime porte sur Joone en Chine ; un étiqueté « CLEVERY » est un dîner de famille sans une ligne sur le dossier.
- **Une erreur d'attribution de locuteur, corrigée ici pour la troisième fois.** La phrase « je suis capable de baiser tout le monde mais je veux pas les baiser » (transcript `281ffc3c`, 126:22) a de nouveau été attribuée à Paul par un des flux. **Elle est de Speaker 1.** Vérification directe en base : Paul est Speaker 2, identifié sans ambiguïté à 55:56 par « il y a trois ans de mon cerveau dans mon cloud code ». `ESPRIT-PARRIT.md:11` avait déjà signalé cette erreur ; elle s'est reproduite. **Cette citation ne doit jamais être présentée comme une conviction de Paul.**
- La diarisation de `281ffc3c` et `492bd1c3` est instable au sein d'un même bloc.

**Correction sur les « dictées Wispr ».** Ce ne sont pas des dictées. Ce sont **33 rushs vidéo d'une seule session de prospection porte-à-porte filmée le 23/07**, mono-locuteur face caméra. 13 ont été lus intégralement. L'attribution y est certaine, puisque Paul est le seul à parler. Tout document du dossier qui les présente comme des pensées dictées est à corriger.

**Limites.** Deux transcripts volumineux n'ont été lus que partiellement (`4bda539e` 18 %, `63f41e56` 30 %). Le contexte 8 (réaction à un succès) reste **vide, faute de citation attribuable** : c'est signalé plutôt que comblé. Aucun mail ni message LinkedIn n'a été relu pour ce document.

---

## 2. Convictions récurrentes

### C1 — Le déploiement technique n'est pas le sujet. Le sujet est la définition du besoin et l'embarquement des gens.

**Citations.**
> « J'ai réalisé que c'était vraiment le sujet qui prenait le moins de temps. » — 13/07, Toyotomi, contexte 3.
> « Le sujet c'est la définition du besoin et le fait que tout le monde soit embarqué dans le projet, que les gens voient l'intérêt, qu'ils comprennent la tech, qu'ils soient capables d'exprimer leurs besoins. » — 13/07, Toyotomi, contexte 3.
> « Moi j'ai une approche vraiment process par process. » — 13/07, contexte 3.

**Contextes distincts** : 3 (partenaire), 4 (formation client), et en écho dans les documents écrits.
**Évolution** : stable de juin à fin juillet.
**Contradictoire** : sa valeur facturée reste très technique (Claude Code, Codex, MCP, agents). Il n'a aucune expertise sectorielle verticale et le reconnaît. Tension non résolue entre « la technique n'est pas le sujet » et « ce que je vends est technique ».
**Niveau d'autorité : CONVICTION FORTE.**

### C2 — La valeur est dans la supervision et le craquage, pas dans la production.

**Citations.**
> « On est trois à craquer les sujets et ensuite on délègue la production à plus de vingt partenaires. Le job des trois personnes c'est de prendre un sujet, le craquer, définir l'architecture, définir le périmètre. » — 20/07, club d'affaires, contexte 3.
> « On essaie de le faire le moins possible et surtout de superviser, parce qu'on estime que la valeur elle est plutôt dans nous qui supervisons. » — 13/07, Toyotomi, contexte 3.
> « Moi je ne vois pas la prod comme un goulot d'étranglement. » — 29/06, avec Maxime, contexte 5.
> « La distribution, c'est le sujet numéro un. » — 29/06, contexte 5.

**Contextes distincts** : 3, 5, 10. Deux interlocuteurs sans rapport (un ami salarié, une inconnue en club d'affaires), six semaines d'écart.
**Évolution** : identique au 08/06 et au 20/07.
**Contradictoire** : l'organisation décrite repose sur Yukun pour piloter les partenaires, et elle part le 31/08. Le modèle est énoncé au présent alors qu'il n'a plus de titulaire.
**Niveau d'autorité : CONVICTION FORTE.**

### C3 — Il ne croit pas au SaaS en libre-service. Il croit à une couche logicielle propriétaire.

**Citations.**
> « Non, je ne crois pas dans le SaaS. » — 08/06, déjeuner privé, contexte 10.
> « Je crois plutôt dans la couche logiciel interne qui va faire que je surpasse toute concurrence. » — 08/06, contexte 10.
> « Peut-être que ça sera un SaaS auquel tu peux te brancher, mais à aucun moment je vais laisser la configuration à mes clients. » — 08/06, contexte 10.
> « On est en train de parler de créer un logiciel en vrai Maxime, d'un système d'exploitation. C'est une couche logicielle qui va ship du contenu juste à partir de notre interaction humaine, à notre voix. À partir d'une action, t'auras quinze actions. » — 20/07, avec Maxime, contexte 5.

**Contextes distincts** : 10 (ambition privée), 5 (réflexion avec Maxime). Six semaines d'écart.
**Évolution** : le refus du SaaS de juin devient en juillet une ambition de système d'exploitation interne. La ligne est cohérente : l'outil sert Parrit d'abord.
**Contradictoire, et c'est net** : dans la même conversation du 08/06 il construit trois offres productisées et réplicables — l'outil Rufus pour l'e-commerce, la vidéo de mariage « en volume », puis le 06/07 le produit d'appel de veille pensé multi-secteurs. Il refuse le mot, pas la chose.
**Niveau d'autorité : CONVICTION FORTE, avec une contradiction active.**

### C4 — L'IA ne sait pas avoir de vision. Il faut craquer avec la machine, pas la laisser craquer.

**Citations.**
> « L'IA est mauvaise pour ça, la stratégie. Elle ne comprend pas la temporalité. » — 19/07, avec Maxime, contexte 5. Maxime dit indépendamment « l'IA est nulle en vision » le 17/07.
> « Pour craquer le truc, t'es obligé de craquer avec la machine. Tu dois pas laisser la machine craquer pour toi, mais c'est une fois que tu as craqué que tu peux aller dans des trucs auto-apprenants. » — 19/07, contexte 5.
> « Il faut mettre son goût dans la machine. Et ça, c'est un truc que je n'ai pas encore réussi à faire bien. » — 20/07, contexte 5.
> « Il y a trois ans de mon cerveau dans mon cloud code. » — 17/07, contexte 7.

**Contextes distincts** : 5, 7, 10.
**Évolution** : c'est la thèse la plus stable du corpus, et la seule que les deux associés formulent séparément.
**Contradictoire** : aucune contradiction trouvée. C'est la conviction la plus propre du dossier.
**Niveau d'autorité : CONVICTION FORTE.**

### C5 — L'humain dans la boucle, comme phase et non comme état final.

**Citations.**
> « Il faut toujours toujours mettre l'humain dans la boucle. Dans le premier temps. » — 01/07, formation Joone, contexte 4.
> « Nous, on déconseille de faire du 100 % tout de suite, sauf si c'est très déterministe. » — 13/07, contexte 3.
> « Toujours revoir ce qu'on a généré avec l'IA, sinon on ne sait même plus de quoi il s'agit. » — 01/07, contexte 4.
> Doctrine du périmètre : automatisable si répétitif, fréquent, à règles claires, cadre stable, données disponibles, **et si une erreur peut se rattraper**. Humain gardé sur le rare, le nouveau, le jugement, et ce qui coûte cher.

**Contextes distincts** : 3, 4.
**Évolution** : les deux mentions temporelles comptent — « dans le premier temps » chez Paul, « au début » chez le client Joone. Le contrôle est présenté comme une phase par les deux côtés.
**Contradictoire** : sa propre pratique. Il lance six ou sept tâches à Claude le soir et relit le lendemain. Ce qu'il enseigne et ce qu'il fait divergent.
**Niveau d'autorité : CONVICTION FORTE sur la doctrine, CONTRADICTOIRE sur la pratique.**

### C6 — Les PME founder-led valent mieux que les grands groupes, pour une raison biographique.

**Citations.**
> « Les beaux use cases agentiques que je vais avoir, ça va être sur des PME. Parce qu'en fait les grands groupes, ils sont très frileux. » — 08/06, contexte 10.
> « La PME, tu peux brancher Cloudcode partout en une journée. » — 08/06, contexte 10.
> « J'ai vraiment vu ce que c'est que le salariat après avoir été une sorte d'entrepreneur dans l'entreprise, et j'ai dit non. C'est ça qui a déclenché la création de ma boîte. » — 29/06, contexte 7.

**Contextes distincts** : 7, 10.
**Contradictoire** : les grandes marques servent de preuve sociale en clientèle, et une référence L'Oréal-EDF est utilisée comme argument de vente pour le Botswana. Le refus des grands groupes est une préférence de terrain, pas une politique.
**Niveau d'autorité : CONVICTION FORTE.**

### C7 — Il veut devenir une autorité, et que ce soient les gens qui viennent.

**Citations.**
> « Moi je veux être une autorité, ça ne me dérange pas d'être connu. Je sais contacter les gens, mais j'aimerais passer à un mode où c'est les gens qui me contactent. Pour ça, je dois un peu me montrer, dire ce que je fais et parler un peu plus. » — 19/06, à son père, contexte 7. **Hors de tout enjeu commercial.**
> « Il ne faut pas avoir cette posture de chasseur. C'est lui qui a besoin de toi, c'est pas toi qui as besoin de lui. » — 19/07, contexte 6.
> « L'émotion justifie l'envie, la raison justifie l'action. » — 19/07, contexte 6.

**Contextes distincts** : 7, 6, 10.
**Évolution** : de « je veux être connu » en juin à une architecture de contenu et un objectif chiffré en juillet (100 000 abonnés en avril 2027, dont 10 000 sur YouTube).
**Contradictoire** : la doctrine « grand-mère » du 17/07 dit l'inverse — il ne faut pas que le public s'attache aux fondateurs. Deux logiques d'attachement opposées, jamais réconciliées.
**Niveau d'autorité : CONVICTION FORTE, avec une contradiction ouverte.**

### C8 — La monétisation se fait au résultat, pas à l'heure.

**Citations.**
> « Moi je vois la monétisation d'un résultat que j'apporte à mes clients. C'est au résultat, au prototype, au rendez-vous qualifié. » — 08/06, contexte 10.
> « Un agent, ça vaut entre 2 et 10 000, ou plus même. » — 08/06, contexte 10.

**Contradictoire, frontalement** : dans la même conversation, « je leur vends des heures » pour un client cosmétique, sans gêne apparente. Et la grille réelle de juillet est en jours-hommes : 1 200 €/jour, plancher 800 €.
**Niveau d'autorité : INTUITION**, pas conviction. Elle est énoncée une fois et démentie par la pratique le même jour.

### C9 — L'approche générique est morte.

**Citations.**
> « Aujourd'hui on peut ne plus faire d'approche générique. Donc pourquoi rester sur une approche générique ? Je comprends pas. » — 29/06, contexte 10.
> Sur les concurrents plug-and-play : « Il n'y a rien de révolutionnaire dans ce qu'ils font. Ça reste un agent IA, il y a toujours les deux à quatre semaines d'itération, même pour eux. » — 29/06, contexte 9.

**Niveau d'autorité : CONVICTION FORTE.**

### C10 — Ce qu'il apporte, c'est d'être à la croisée des mondes.

**Citations.**
> « Moi c'est un profil, je sais construire le truc et à la fois je suis capable de le comprendre et de collecter l'enjeu business. Je suis un peu à la croisée des mondes. En étant autodidacte donc pas profil ingénieur, j'ai fait une école de commerce. » — 13/07, contexte 3, répété quasi mot pour mot le 15/07.
> « Nous, on est exactement ces mecs-là. On est les personnes qui viennent autour de la non-tech pour faire qu'elle puisse build son truc. » — 17/07, contexte 10.

**Niveau d'autorité : CONVICTION FORTE**, mais attention : c'est aussi son pitch. Elle est prononcée majoritairement en contexte 3, donc partiellement circonstancielle.

### C11 — Sur le terrain, il a cessé de se présenter comme quelqu'un qui fait de l'IA.

**Citations.**
> « Aujourd'hui je ne me positionne plus comme une personne qui fait de l'IA. Je me positionne comme une agence digitale. Parce que j'ai réalisé que la plupart des gens avaient une mauvaise expérience avec l'IA. Les gens ne sont pas prêts pour l'IA. Ça fait déjà quatre personnes sur cinq qui me disent : oh l'IA, moi j'ai une mauvaise expérience, ça ne marche pas bien. » — 23/07, porte-à-porte filmé, seul face caméra, contexte 7.
> « J'appelle ça digital parce qu'en général quand je parle d'IA les gens ont une mauvaise expérience. L'intelligence artificielle ça fait un peu peur. » — 28/07, en clientèle, contexte 1.

**Contextes distincts** : 7 puis 1. Cinq jours d'écart, formulation quasi identique, un constat de terrain d'abord, un argument ensuite.
**Évolution** : le constat précède l'usage commercial, ce qui est l'ordre inverse de l'habitude. C'est ce qui en fait une conviction et non un pitch.
**Contradictoire** : tout le canon, le site et les propales sont construits sur le mot IA. Et Paul défend par ailleurs les LLM avec vigueur contre leurs détracteurs. Il tient donc une conviction technique forte et un constat d'adoption très faible, sans les concilier.
**Niveau d'autorité : CONVICTION FORTE.** C'est la citation la plus dissonante du corpus par rapport à tout ce que Parrit publie.

### C12 — Livrer prime sur réseauter.

**Citations.**
> « Je suis à un événement networking là, et je me dis que c'est inutile ces trucs-là en fait. » — 18/07, en aparté pendant un salon professionnel, contexte 7.
> « Les rendez-vous B2B, les gens répondent pas. Je pense que je vais rentrer. Surtout que je dois onboarder, je dois shipper deux produits, donc j'ai un peu autre chose à faire. Je vais shipper. » — même moment.
> « Tu peux pas maîtriser le business si tu cherches à maîtriser d'autres choses à la fois. Il faut supprimer l'inutile du quotidien. » — 14/06, en famille, contexte 7.

**Contextes distincts** : deux fois en contexte 7, à quatre jours d'écart, avec deux interlocuteurs différents et aucun enjeu commercial. C'est le signal le mieux attribué du corpus.
**Contradictoire** : il adhère à un club d'affaires le 20/07 et consacre du temps aux cafés de mise en relation. Le réseau reste, dans les faits, son premier canal de deals.
**Niveau d'autorité : CONVICTION FORTE**, en tension directe avec ce qui produit son revenu.

---

## 3. L'entreprise que Paul veut construire

**Place chez le client.** Il entre par la définition du besoin, pas par la technologie. « Moi je suis impliqué sur les parties définition des besoins avec les clients, partie commerciale, jusqu'au prototypage. » Le déploiement est délégué. **Il veut être celui qui décide quoi construire, pas celui qui construit.**

**Durée.** Deux régimes coexistent sans être nommés comme tels. Pour un client individuel type Didier : un plan d'autonomie explicite en deux étapes, avec sortie. Pour un compte agence type e-commerce ou cabinet : rien n'est prévu pour sortir, au contraire.

**Type d'impact.** « Déclencher une dynamique positive dans l'entreprise et faire que la valeur soit perçue. » Le mot « perçue » est de lui, et il compte : ce n'est pas un ROI, c'est une adhésion.

**Rôle de Paul.** Craquer, définir l'architecture, tenir la relation, prototyper. Et une lucidité : « Moi j'ai vachement d'intuitions, vachement de fulgurances, transformer l'intuition en action tout de suite. Par contre, ça me fatigue. » (19/06, contexte 7.)

**Rôle de Maxime.** Le 01/07 : trois personal brands égaux, « trois génies ». Le 19/07 : « il faut que toi tu sois populaire auprès des boîtes et que moi je sois populaire auprès de l'entertainment ». La symétrie disparaît en trois semaines, sans être renoncée.

**Rôle des agents.** Une main d'œuvre supervisée. « Moi je passe ma journée à manager des agents. » Et une méthode en trois étapes qu'il assume ne pas avoir atteinte : identifier, monter la qualité, puis auto-apprenant — « mais moi je n'en suis pas encore là ».

**Rôle des partenaires.** Le tiers extérieur du modèle trois-plus-vingt. Il paie l'investissement initial d'un partenaire pour ne pas l'humilier et sécuriser la distribution.

**Rôle de la couche logicielle.** Un système d'exploitation interne. Le mot « super app » n'apparaît **pas une seule fois** dans les six transcripts de stratégie. Ce qu'il décrit, c'est un OS qui produit du contenu et des leads à partir de sa propre voix.

**Rôle du contenu.** Renverser la direction de l'approche. Objectif chiffré : 100 000 abonnés en avril 2027.

**Rôle de la formation.** Ambigu, et c'est important : le 19/07 il pousse une campagne Qualiopi de formation agentique, et le 20/07 au matin il doute — « je me trompe peut-être de bataille en essayant de former les gens à l'agentique, parce que c'est pas tout le monde qui peut se former à l'agentique ».

**Modèle économique souhaité.** Trois pôles, formulés le 20/07 : « génération de croissance, donc par le contenu, par l'outbound ; closing, prototypage ; et juste là derrière la partie production. » Avec une hésitation capitalistique : « ça fera potentiellement deux SAS ».

**Organisation future.** Trois associés qui craquent, plus de vingt partenaires qui produisent, et à terme une infrastructure propre : « à terme, on aura nos serveurs, notre infra, on n'aura plus de VPS et on aura des GPU ».

**Horizon chiffré, dit à un partenaire le 15/07** : « aujourd'hui on est à 200 000 de CA l'an passé, l'objectif c'est d'aller vers le million, d'ici deux ans. »

**Comment il compte y arriver, dit le 28/07 hors script de vente.** Sans lever de fonds : « je cherche pas à lever de fonds, je cherche pas à me faire aider. » Sans embaucher : « on utilise l'IA pour croître sans avoir à embaucher, on manage les agents IA. » Et en réinvestissant : « je réinvestis dans des systèmes qui deviennent autonomes au fur et à mesure. Jusqu'à ce que ça tombe tout seul. »

**Trois ambitions ouvertes, jamais tranchées** : tester le marché américain (« j'ai pas du tout envie d'être franco-français »), une délocalisation éventuelle (« j'ai pas encore pris la décision »), et recruter un profil de dix-huit ou dix-neuf ans pour en faire « le prochain consultant Claude Code de la boîte ».

**Le récit d'origine, répété deux fois dans le même échange** : « jamais, un jour dans ma vie, je me suis dit je vais être entrepreneur. C'était naturel. C'est pas un truc que j'ai cherché. » Avec, comme matrice de méthode, six mois au Costa Rica sans téléphone : donner des cours de surf, organiser des soirées, « j'ai lancé plein de trucs en six mois ».

**Sa méthode face au doute** : « le doute se résout par l'action. Je ne tire jamais de conclusion avant de l'avoir fait. Tu vas rater neuf fois sur dix, mais la dixième c'est celle qui fait que tu atteins ton objectif. »

---

## 4. Ce que Paul ne veut pas construire

**Refus explicites, avec la citation.**

- **Le SaaS en libre-service.** « Non, je ne crois pas dans le SaaS. » Et : « à aucun moment je vais laisser la configuration à mes clients. »
- **Le catalogue d'agents plug-and-play.** « Ils se mettent à mettre des prénoms et des images sur les agents. C'est très smart d'un point de vue marketing, mais il n'y a rien de plus. »
- **L'approche générique.** « Pourquoi rester sur une approche générique ? Je comprends pas. »
- **L'apport d'affaires.** « On ne peut pas faire de l'apport d'affaires. Notre réputation, elle doit rester entre nos mains. »
- **L'app interne avant d'avoir craqué les process.** « L'app, il faut se lancer dedans quand on est sûr d'avoir craqué les choses. »
- **L'Académie avant l'audience.** « Je trouve ça ridicule de lancer l'Académie avant d'avoir fait ces vidéos-là. »
- **L'externalisation dispersée.** « Le fait de tout externaliser à droite à gauche, ça crée une complexité trop forte. »
- **Le registre corporate.** « Il y a trop de gens, ils sont bloqués par le truc corporate. Je pense qu'il faut vraiment casser ça. »
- **Le pitch IA générique.** « Il n'y a pas de "vos RAG à meilleur prix", ça n'existe pas. »
- **La posture de chasseur en inbound.** « C'est lui qui a besoin de toi, c'est pas toi qui as besoin de lui. »
- **Le 100 % autonome sans supervision**, sauf déterministe.
- **Le contenu client sans consentement.** « La confidentialité, la zone entre nous, elle est hyper importante et il ne faut pas la violer. »
- **Descendre sous 800 €/jour.** « Ça ne ressemblera jamais en dessous de 800, pour quelqu'un de vraiment compétent. »

**Refus implicites, tirés des actes** : brader, encaisser de l'argent mal monté, inventer une preuve, vendre ce qu'il ne sait pas défendre. Chacun a un coût payé, documenté dans `ESPRIT-PARRIT.md` §2.

**Ce qui n'est PAS un refus de Paul** : la phrase sur la manipulation, attribuée par erreur trois fois. Elle est d'un autre locuteur.

**Ce qui n'est pas non plus un refus** : la vente d'heures. Aucune citation ne l'interdit, et il dit « je leur vends des heures » sans gêne. La doctrine anti-heures vient du canon écrit, pas de sa bouche.

---

## 5. Les contradictions de la vision

| Contradiction | Position A | Position B | Ce qui a évolué | Ce qui reste à trancher |
|---|---|---|---|---|
| **Global contre spécialisé** | Transsectoriel affirmé ; « approche process par process » | `VISION.md` 25/05 : atelier de génération de RDV par signaux, très étroit | Enterré le 30/07 par A43, mais le fichier n'a jamais été corrigé | Si l'étroitesse de mai était une erreur ou une discipline perdue |
| **RUN contre retrait** | Plan d'autonomie en deux étapes pour Didier | Modèle agence pensé pour rester : e-commerce, cabinet, « pool de consultants qui grossit » | Rien. Les deux coexistent depuis juin | Si le régime dépend du type de client, et lequel se vend |
| **Service contre produit** | « Je ne crois pas dans le SaaS » (08/06) | Trois offres productisées construites en juin-juillet | Le refus porte sur la configuration par le client, pas sur la réplicabilité | Ce qui est vendu et ce qui reste interne |
| **Autonomie contre prise en charge** | « On vend l'autonomie » (§39) | « Des personnes veulent être autonomes, des personnes veulent qu'on fasse pour elles » (30/07) | Tranché le 30/07 : c'est par produit d'appel | Nommer et tarifer les deux régimes |
| **Croissance contre opérations** | « La distribution, c'est le sujet numéro un » | Approche process par process, back-office, outils métier | Le contenu monte fort en juillet | Quel pôle finance l'autre |
| **Émotion contre clarté** | « L'émotion justifie l'envie » ; doctrine « grand-mère » | « La raison justifie l'action » ; refus du pitch générique | Formulé comme une séquence le 19/07 | Si c'est vraiment une séquence ou un arbitrage évité |
| **Marque personnelle contre marque d'entreprise** | 01/07 : trois personal brands égaux | 19/07 : Paul autorité B2B, Maxime entertainment | La symétrie disparaît en trois semaines sans être renoncée | Et une contrainte non traitée : Eteos non liquidée |
| **Boutique sélective contre accessibilité** | Trois qui craquent, sur-mesure, jamais générique | Ambition internationale, contenu de masse, vidéo « en volume » | Résolu partiellement : craquage artisanal, production industrielle | Ce qui arrive quand le contenu de masse amène des clients hors boutique |
| **Artisanat contre industrialisation** | « Il faut craquer avec la machine, pas la laisser craquer » | « Si on veut scaler, il faudra des agents qui itèrent pour nous » | Ligne stable : craquer à la main, produire à la machine | Où passe exactement la frontière |
| **Paul central contre entreprise indépendante** | Trois capacités déclarées non délégables | « Il faut mettre son goût dans la machine, je n'ai pas encore réussi » | Reconnu comme un échec en cours, pas nié | Ce qui se transmet en premier |

**Deux contradictions supplémentaires, absentes des listes habituelles.**

**Vouloir être connu contre vouloir que le public s'attache à autre chose.** « Je veux être une autorité » (19/06) contre la doctrine « grand-mère » (17/07), où le public doit s'attacher à un personnage et non aux fondateurs.

**Le doute sur l'agentique, dit le lendemain du lancement d'une offre de formation agentique.** « Je me trompe peut-être de bataille » (20/07 matin) contre la campagne Qualiopi poussée le 19/07. Le doute n'apparaît dans aucun document commercial.

---

## 6. Chronologie de la vision

**26/04 — `METHODE.md`.** Première vision écrite : *« Claude Code n'est pas un copilote. C'est un employé que tu manages. »* Le sujet annoncé n'est pas de livrer des agents mais **de monter une équipe Claude Code chez le client**. Trois phases, huit piliers. Vision d'enablement.

**25/05 — `VISION.md` v3.1.** Identité étroite : *« atelier de génération de rendez-vous qualifiés par signaux d'intention + prototypage rapide d'agents IA »*. Avec un fait biographique unique dans tout le corpus : **sept ans de pratique manuelle de la génération de RDV par signaux, trois ans de construction du système**.

**08/06 — le déjeuner Kiabi.** La formulation la plus pure, sans enjeu de vente : refus du SaaS, couche logicielle propriétaire, PME contre grands groupes, ambition Chine-Afrique-Brésil, monétisation au résultat.

**19/06 — la conversation avec son père.** « Je veux être une autorité. » Hors de tout cadre professionnel.

**23/06 — le deep research Gemini.** La conviction des « généralistes innovateurs », que Paul défendait avec une caution de Dan Priest chez PwC, est **rejetée par une analyse externe**. Elle disparaît. C'est le seul cas du corpus où une conviction est abandonnée sur un avis, pas sur un fait de marché.

**29/06 — avec Maxime et Didier.** Discipline de coûts chiffrée. Plan de passation en deux étapes. « La distribution, c'est le sujet numéro un. »

**01/07 — Paris, à pied.** « Aujourd'hui c'est devenu presque plus important la vision autour d'une conversation que l'exécution. » Trois personal brands égaux. Et, le soir après la formation Joone : « je réalise que je suis trop loin, je suis beaucoup trop loin, j'utilise même plus ce que j'enseigne ».

**13-15/07 — Toyotomi.** Le modèle d'organisation énoncé deux fois. L'horizon chiffré : 200 000 € l'an passé, le million dans deux ans.

**17/07 — avec Maxime.** « Il y a trois ans de mon cerveau dans mon cloud code. » Le concept de contenu émotionnel. La reconnaissance dans une catégorie : « on est exactement ces mecs-là ».

**19/07.** L'architecture de contenu se fige. « On arrête tout contenu spontané. » Et l'aveu le plus dur du corpus : **« j'ai tendance à toujours penser que ma vision c'est la bonne et en fait c'est faux, parce que le marché il veut pas ma vision. »**

**20/07 — deux sessions le même jour.** Le matin, le doute apparaît pour la première fois. L'après-midi, l'ambition d'un système d'exploitation, et : « c'est un sport de longévité ».

**28/07 — `ESPRIT-PARRIT.md`.** Mise à plat. « Personne, dans 1 679 transcripts, ne dit du bien de Parrit avec ses propres mots. »

**30/07 — `ADN-PARRIT.md`, décision A43.** La thèse est tranchée. `VISION.md:12` est formellement enterrée.

---

## 7. Les décisions récentes qui doivent primer

**Ce sont des choix de gouvernance, pas des preuves de marché.** Elles priment sur toute conviction plus ancienne.

1. **A43, 30/07 — la thèse.** « Vous me donnez ça, je vous montre les résultats la semaine prochaine. » Avec la nuance qui fait partie de la décision : « ça dépend de la personne. Des personnes veulent être autonomes, des personnes veulent qu'on fasse pour elles. » Le choix autonomie / fait-pour-vous se joue **par produit d'appel**.
2. **A43 corollaire, 30/07** — la candidate « droit de relire » n'est plus la thèse. Elle reste une description juste de ce que les clients achètent.
3. **A43 corollaire, 30/07** — `VISION.md:12`, l'atelier de RDV par signaux, est **enterrée**.
4. **A41, 30/07** — le format Joone est un forfait de 10 h, à chaque fois.
5. **19/07** — arrêt du contenu spontané, passage à un calendrier tenu par Maxime.
6. **20/07** — trois pôles : croissance, closing-prototypage, production.
7. **28/07** — l'accès SSH de Maxime attend le cloisonnement.

---

## 8. Questions non résolues

1. Le doute du 20/07 sur la formation agentique tient-il, ou était-ce une mauvaise matinée ?
2. Les deux régimes, autonomie et fait-pour-vous, se nomment-ils et se tarifent-ils séparément ?
3. Le modèle trois-plus-vingt survit-il au départ de Yukun, qui en tenait le tiers production ?
4. La couche logicielle reste-t-elle interne, ou devient-elle un produit malgré le refus du SaaS ?
5. Qui porte la marque : les fondateurs, ou un personnage à qui le public s'attache ?
6. La contrainte Eteos non liquidée est-elle encore active, et jusqu'à quand ?
7. Le million dans deux ans se fait-il par le ticket, par le récurrent, ou par le contenu ?
8. La vente d'heures est-elle refusée par doctrine, ou seulement plafonnée ?
9. Le contenu finance-t-il le closing, ou l'inverse ?
10. Que devient la conviction des « généralistes innovateurs », abandonnée sur un avis externe et jamais rejouée contre le réel ?
11. Où passe exactement la frontière entre ce qui reste craqué à la main et ce qui devient auto-apprenant ?
12. Les sept ans de pratique du signal-based outbound sont-ils un actif à réactiver ou une page tournée ?
13. Le pôle production existe-t-il encore, ou seulement le craquage ?
14. « Je suis trop loin, j'utilise même plus ce que j'enseigne » — que fait-on de cet écart ?
15. Quelle est la première chose que Paul transmet, puisqu'il dit ne pas avoir réussi à mettre son goût dans la machine ?
