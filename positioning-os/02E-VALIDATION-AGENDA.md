# 02E · Agenda de validation

Feuille de travail pour trancher les 28 décisions avec Paul, en quatre sessions. Statuts actualisés après l'audit des sources primaires du 01/08/2026 (`02D`).

Les recommandations sont **des recommandations de Claude Code**, jamais des décisions. Elles sont là pour être contredites.

---

# Session 1 · Identité et positionnement

### 1. Quel genre de structure Parrit.ai est-elle ?
**Position** : boutique qui construit et exploite des systèmes sur mesure, décideur unique. · **Statut : HYPOTHÈSE** (dégradé). · **Source** : `revenue_events` = 2 lignes, `clients` = 1 ligne, 7 ventes revendiquées. · **Contre-exemple** : aucune facture n'existe pour EFI, Laparra, Didier, June, IPD. · **Options** : (a) boutique · (b) équipe IA temporaire · (c) agence de transformation · (d) infrastructure augmentée · (e) boutique + régime embarqué.
**Reco Claude Code** : (a), et rapprocher Qonto avant de dire quoi que ce soit de public. On ne peut pas fonder une identité sur sept ventes dont une seule a une facture ouverte.
**Décision de Paul :**

### 2. Que représente Parrit.ai publiquement ?
**Position** : trois formulations en conflit. · **Statut : CONTRADICTOIRE, aggravé** — il y en a **cinq**, dont la boussole §39 (« Le cerveau qui rationalise ton business, te dit la vérité, et te rend autonome ») et la candidate d'A43 (« on ne vend pas de l'IA, on construit l'outil sur vos données et vous gardez le droit de relire »), toutes deux absentes de `02A`. · **Contre-exemple** : aucune n'est mesurée. · **Options** : (a) la vitesse · (b) le contrôle avant envoi · (c) la définition du besoin · (d) la boussole §39 · (e) deux registres assumés.
**Reco Claude Code** : trancher A43 d'abord, le reste en découle. Et poser le compteur avant de choisir la vitesse.
**Décision de Paul :**

### 3. Qui est le client naturel ?
**Position** : sept traits comportementaux. · **Statut : PROUVÉ** sur décideur unique, accès aux données, friction réelle. · **Source** : sept ventes, sept décideurs uniques ; 476 envois froids, 0 réponse. · **Contre-exemple** : « volonté d'être challengé » n'est observé nulle part. · **Options** : (a) garder les sept · (b) réduire aux trois prouvés, en filtre dur · (c) questionnaire sur le site.
**Reco Claude Code** : (b). Le filtre à trois aurait écarté Moët, IUC et IPD avant tout travail non payé.
**Décision de Paul :**

### 4. Quelle place pour les secteurs ?
**Position** : cabinets réglementés en priorité, formation en contrôle. · **Statut : HYPOTHÈSE**. · **Source** : un système en production chez un cabinet. · **Contre-exemple** : c'est le cabinet du père, la facture est au nom de **PGEE**, et **l'unique incident de sécurité connu porte sur ce dossier** (faille RLS colmatée le 28/07). · **Options** : (a) comportement seul · (b) un secteur public · (c) deux cellules de test · (d) pages secondaires.
**Reco Claude Code** : (c), et rien de public avant une signature hors famille.
**Décision de Paul :**

### 5. Quel est le moment déclencheur ?
**Position** : aucun n'est écrit. · **Statut : OBSERVÉ après coup.** · **Source** : quatre moments constatés, tous par le réseau. · **Contre-exemple** : aucun signal externe n'a jamais produit de deal. · **Options** : (a) échéance réglementaire · (b) le fondateur devient le goulot · (c) un outil acheté non utilisé · (d) ne pas trancher.
**Reco Claude Code** : (b). C'est le seul commun aux sept sous-segments de services, et c'est ce que Diego décrit chez Trainline.
**Décision de Paul :**

### 6. Quel problème central ?
**Position** : traduire un besoin flou en objet technique. · **Statut : CONTRADICTOIRE.** · **Source** : capacité la mieux notée de l'inventaire. · **Contre-exemple corrigé** : Hertman ne prouve plus que « la démo ne crée pas le besoin ». Les mails montrent une proposition chiffrée, une réponse d'attente, et **aucune relance pendant trois mois**. Le problème démontré est le **suivi**, pas la définition. · **Options** : (a) définir le besoin · (b) idée → production · (c) fragmentation · (d) capacité IA interne · (e) croissance · (f) la chaîne entière.
**Reco Claude Code** : ne pas trancher avant d'avoir regardé combien de dossiers sont morts faute de relance. C'est mesurable en une heure.
**Décision de Paul :**

### 7. Quelle transformation promise ?
**Position** : d'un process dans la tête à un système tracé. · **Statut : PROUVÉ** sur la description. · **Source** : quatre livraisons réelles. · **Contre-exemple** : le devis EFI promet « 1 à 5 RDV qualifiés par jour » — une promesse chiffrée que `02A` disait inexistante, et qui n'a jamais été mesurée. · **Options** : (a) décrire sans chiffre · (b) poser un compteur et attendre · (c) promettre un délai.
**Reco Claude Code** : (b), et retirer la promesse EFI de tout futur devis tant qu'elle n'est pas mesurée.
**Décision de Paul :**

---

# Session 2 · Offre et modèle économique

### 8. Quelle place chez le client ?
**Position** : prestataire de build. · **Statut : PROUVÉ, et enrichi.** · **Source neuve, décisive** : Diego (Trainline) demande de lui-même *« work with you as a consultant to train me or someone on the GTM team »*. · **Contre-exemple** : trois capacités non délégables reposent sur la présence de Paul. · **Options** : (a) build · (b) équipe embarquée · (c) co-Chief AI · (d) opérateur · (e) formateur · (f) combinaison nommée.
**Reco Claude Code** : (f), avec les deux étapes que Trainline a déjà validées : on construit avec vous, puis vous construisez seul.
**Décision de Paul :**

### 9. Quelle durée de relation ?
**Position** : aucune écrite. · **Statut : OBSERVÉ** (relevé). · **Source** : l'offre Trainline — packs de 10 h, un à trois mois, résiliable chaque mois, ce qui est livré reste au client. · **Contre-exemple** : Clevery tourne depuis avril sans passation, la boucle est muette depuis le 29/06. · **Options** : (a) trois mois intensifs · (b) trois à six mois de RUN · (c) dégressif · (d) ponctuel · (e) sortie organisée dès le devis.
**Reco Claude Code** : (e), en reprenant mot pour mot le format Trainline, qui existe déjà et qu'un client a accepté sur le fond.
**Décision de Paul :**

### 10. Par quoi un client commence-t-il ?
**Position** : pack d'heures, ou objet borné 2-4 k€. · **Statut : CONTRADICTOIRE, corrigé.** · **Source** : facture F-2026-034 (Joone, 2 160 € HT, kick-off + ateliers 12 h) — **A41 est tranché**. · **Contre-exemple** : aucun produit d'entrée n'a de compteur. · **Options** : (a) objet borné seul · (b) objet borné + formation-déploiement · (c) trois portes · (d) garder le pack d'heures.
**Reco Claude Code** : (b), et arrêter de présenter le diagnostic : jamais signé, outil productisé à 0 usage.
**Décision de Paul :**

### 11. Comment facturer ?
**Position** : forfaits 2-5 k€. · **Statut : CORRIGÉ.** · **Source** : le devis EFI porte **setup 3 000 € + 50 € HT par RDV qualifié** — le prix au résultat a bien été proposé. Le devis Hertman porte **2 900 € + 600 €/mois sur 12 mois** — le récurrent aussi. · **Contre-exemple** : ni l'un ni l'autre n'a produit d'encaissement traçable. Marge toujours inconnue. · **Options** : (a) forfait ponctuel · (b) forfait puis RUN · (c) au résultat · (d) financé par la formation.
**Reco Claude Code** : ne rien trancher avant d'avoir calculé la marge d'une mission terminée. Aujourd'hui aucun des quatre ne peut être défendu par un chiffre.
**Décision de Paul :**

### 12. Que veut dire l'autonomie ?
**Position** : deux régimes non nommés. · **Statut : CONTRADICTOIRE, avec une preuve neuve dans les deux sens.** · **Source** : Paul l'a écrite noir sur blanc à Trainline — *« you or the person you pick runs a live B2B acquisition engine, and can build the next one without me »*, avec un « autonomy check » et *« If it does not pass, I keep going at no extra cost »*. · **Contre-exemple** : `clevery_relance_events`, seule boucle transférée, **aucune décision depuis le 29/06**, et la table n'a **pas de colonne d'auteur** — on ne peut pas prouver que c'est Henri qui swipait. · **Options** : (a) deux régimes tarifés · (b) autonomie seule · (c) opérateur seul · (d) hybride.
**Reco Claude Code** : (a), en reprenant la formulation Trainline pour le régime autonomie. Elle est écrite, garantie, et un client l'a demandée.
**Décision de Paul :**

### 13. De quoi Parrit.ai répond-elle ?
**Position** : non cadrée. · **Statut : OBSERVÉ** (relevé). · **Source** : les **CGV v1.0 de janvier 2025** existent : Parrit.ai coordinateur, obligation de moyens, sous-traitants seuls responsables techniquement, responsabilité plafonnée au montant HT perçu. · **Contre-exemple** : elles n'ont **jamais été opposées à personne**, et zéro contrat signé existe. Pratique contraire attestée : mot de passe `12345678` envoyé en clair par mail à Laparra. · **Options** : (a) moyens sur le build · (b) résultat sur un indicateur · (c) exploitation avec délai chiffré · (d) trois niveaux.
**Reco Claude Code** : ressortir les CGV, les mettre à jour, les joindre à chaque devis. Le travail est fait à 80 %, il dort depuis 18 mois.
**Décision de Paul :**

### 14. Qu'est-ce qui différencie réellement ?
**Position** : double casquette, discipline de preuve, droit de relire. · **Statut : AFFAIBLI.** · **Source** : la convention de preuve et les linters bloquants sont réels. · **Contre-exemple** : le droit de relire n'est pas seulement non vendu, il n'est **plus exercé depuis un mois**. Et la règle §36 impose de supprimer toute brique non adoptée. · **Options** : (a) fondateur-opérateur · (b) discipline de preuve · (c) droit de relire, rendu démontrable · (d) rien avant un résultat mesuré.
**Reco Claude Code** : avant de choisir (c), aller voir pourquoi Henri a arrêté de cliquer. La réponse change la décision.
**Décision de Paul :**

---

# Session 3 · Organisation et moat

### 15. Quel moat construire ?
**Position** : neuf candidats. · **Statut : AMBITION.** · **Source** : 48 règles d'or nées d'incidents, ~450 fichiers de retours. · **Contre-exemple** : aucun n'a produit un euro ; zéro brique respecte §45. · **Options** : (a) protocole de définition du besoin · (b) mémoire des déploiements · (c) réduire la dépendance à Paul · (d) rien ce trimestre.
**Reco Claude Code** : (c), pour une raison qui n'est plus stratégique mais matérielle : le serveur 187 part avec Yukun le 31/08.
**Décision de Paul :**

### 16. Que garde Paul, que transmet-il ?
**Position** : trois capacités non délégables. · **Statut : CONTRADICTOIRE.** · **Source** : les sept ventes passent par lui. · **Contre-exemple** : il porte aussi l'infra, la facturation et la relance, hors de cette liste — et c'est l'absence de relance qui a tué Hertman et Moët. · **Options** : (a) vente, besoin, architecture · (b) tout jusqu'à un seuil · (c) sortie immédiate de l'infra.
**Reco Claude Code** : (a), et confier la relance à un système avant tout le reste. C'est le geste le moins noble et le mieux documenté comme coûteux.
**Décision de Paul :**

### 17. Quel est le rôle de Maxime ?
**Position** : angle, perception, distribution. · **Statut : HYPOTHÈSE, cause identifiée.** · **Source** : A24 — le blocage n'est pas une décision, **n8n Community interdit tout accès scopé**, Admin est réservé aux licences Pro. · **Contre-exemple** : sept actions attribuées le 27/07, zéro visible le 28/07 ; et A45 nomme un partage IUC 50/50 **écrit nulle part**, seul risque juridique de la relation. · **Options** : (a) angle et distribution seuls · (b) + contenu avec objectif chiffré · (c) + livraison, ce qui exige de payer une licence · (d) ne rien figer.
**Reco Claude Code** : trancher d'abord le partage IUC par écrit. Un désaccord d'associés non écrit coûte plus cher qu'une licence n8n.
**Décision de Paul :**

### 18. Que sont réellement les partenaires ?
**Position** : « une vingtaine d'experts ». · **Statut : CONTREDIT.** · **Source** : mail du 27/07 — *« il est désormais impossible pour moi de continuer à travailler gratuitement pour toi »*. Le réseau était celui de Yukun, **non rémunérée**. · **Contre-exemple** : le serveur 187, les agents, le cold-call, le runner CI et l'ingestion sont sur son compte Hostinger (A16, « risque n°1 »). · **Options** : (a) retirer toute mention · (b) contractualiser trois partenaires · (c) requalifier · (d) reconstruire.
**Reco Claude Code** : (a) immédiatement, et traiter A16 comme une urgence d'exploitation, pas comme un arbitrage de positionnement.
**Décision de Paul :**

### 19. Quelle place pour la formation ?
**Position** : opportuniste. · **Statut : OBSERVÉ, fragilisé.** · **Source** : convention Laparra, 2 640 € HT confirmés. · **Contre-exemple** : elle est marquée « Brouillon », sans SIRET, sans dates, sans intitulé, échéancier « à définir », case « signée » **non cochée**. · **Options** : (a) centrale · (b) porte d'entrée · (c) adoption en fin de mission · (d) financement · (e) à limiter.
**Reco Claude Code** : (b), mais finir la convention avant d'en faire une stratégie. Un organisme de formation sans convention signée n'en est pas un.
**Décision de Paul :**

### 20. Que devient la super app ?
**Position** : outil interne, six sections déployées. · **Statut : AMBITION.** · **Source** : `lib/sections.ts`. · **Contre-exemple** : aucun client ne l'a vue ; le système ne sait toujours pas dire ce qui est parti. · **Options** : (a) interne six mois · (b) interne puis ouverte sur demande · (c) produit maintenant · (d) deux produits.
**Reco Claude Code** : (a), avec une seule fonction prioritaire : savoir ce qui est parti et qui l'a validé. C'est ce qui manque à quatre décisions de ce document.
**Décision de Paul :**

### 21. Quel storytelling fondateur ?
**Position** : Lime en noyau. · **Statut : PROUVÉ** pour le noyau. · **Source** : CV et export LinkedIn (sept. 2022 – mai 2024, Swap Stations, Lime for Business, *AI Innovation & Enablement*). · **Contre-exemple** : Decathlon, Boulanger, les partenariats bruxellois et la transmission à Londres ne sont dans aucun artefact. · **Options** : (a) noyau seul · (b) vérifier puis intégrer · (c) ne pas en parler.
**Reco Claude Code** : (a) jusqu'à validation. Et noter que la meilleure phrase de méthode du corpus est déjà écrite, à Lime London : *« I don't hand over a deck — I deploy the thing. »*
**Décision de Paul :**

---

# Session 4 · Marque, contenu et évolution

### 22. Quelles valeurs sont démontrées ?
**Position** : cinq sur huit. · **Statut : PROUVÉ** pour cinq. · **Source** : 34 `AUCUNE MATIERE`, cinq offres retirées, linters bloquants, 48 règles nées d'incidents. · **Contre-exemple** : l'autonomie, l'amélioration continue et la responsabilité restent revendiquées sans preuve. · **Options** : (a) publier les cinq · (b) publier les huit en marquant trois comme objectifs · (c) ne rien publier.
**Reco Claude Code** : (a).
**Décision de Paul :**

### 23. Que refuse Parrit.ai ?
**Position** : huit critères. · **Statut : CORRIGÉ.** · **Source** : quatre dossiers à comité, zéro euro. · **Contre-exemple décisif** : le cas fondateur, Hertman, **n'est pas un refus client**. Le client a répondu « je reviens vers toi rapidement » et personne n'a relancé pendant trois mois. Idem Moët : proposition envoyée le 23/06, aucune réponse, aucune relance. · **Options** : (a) écrire les huit · (b) trois critères durs · (c) informel.
**Reco Claude Code** : (b), en ajoutant un neuvième qui n'est pas un critère de refus mais une règle interne : **toute proposition envoyée est relancée deux fois, ou elle est déclarée perdue**.
**Décision de Paul :**

### 24. Quelles promesses sont autorisées ?
**Position** : plusieurs promesses interdites sont en ligne. · **Statut : AGGRAVÉ.** · **Source** : `HomeDeux.tsx` **et** `src/app/llms-full.txt/route.ts` — les prix 5 000 € / 99 €/mois / 250 €/h sont **servis aux crawlers IA**, pas seulement affichés. La branche s'appelle `feat/pivot-collaborateurs-souverains` : c'est un pivot délibéré. · **Contre-exemple** : sept logos clients contre la règle §6. · **Options** : (a) corriger cette semaine · (b) corriger seulement les violations de règles d'or · (c) attendre la refonte.
**Reco Claude Code** : (a). Une route `llms.txt` qui publie des prix jamais vendus est le pire endroit où laisser une erreur : elle se recopie ailleurs.
**Décision de Paul :**

### 25. Que doit faire le site ?
**Position** : catalogue d'agents, CTA « Parler à Paul ». · **Statut : HYPOTHÈSE.** · **Source** : §46 tranche déjà une partie — la structure du site **se lit dans la base et le canon**, et toute capture de lead atterrit en base. · **Contre-exemple** : un seul entrant site sur toute la période, zéro deal. · **Options** : (a) global et actionnable en trois clics · (b) vitrine minimale · (c) une page par produit d'entrée.
**Reco Claude Code** : (a), en appliquant §46 plutôt qu'en rouvrant A52. La règle d'or a déjà répondu à la question.
**Décision de Paul :**

### 26. À quoi sert le contenu ?
**Position** : à l'arrêt, 43 lignes de calendrier, 0 exécutée. · **Statut : HYPOTHÈSE.** · **Source** : un passage média a produit une négociation à 13 k€ (IPD) — mais IPD n'a **aucun thread Gmail**, donc même ce cas n'est pas vérifiable. · **Contre-exemple** : 0 deal sur 476 envois Instantly, 390 podcasts, 122 events. · **Options** : (a) documenter les résultats · (b) démontrer la méthode · (c) alimenter la vente · (d) le contenu comme système vendu.
**Reco Claude Code** : (b). C'est le seul disponible immédiatement, et la matière réelle existe : 215 réunions transcrites, jamais exploitées.
**Décision de Paul :**

### 27. Quelle vision à 18 mois ?
**Position** : 10-20 k€/mois. · **Statut : AMBITION.** · **Source** : moyenne réelle 8 342 €/mois. · **Contre-exemple** : le problème est l'amplitude, pas le niveau ; le récurrent censé la corriger est à 0 € ; et le cinquième élément d'ambition (« rendre Parrit.ai moins nécessaire ») contredit le RUN de la décision 12. · **Options** : (a) vision de revenu · (b) vision d'impact avec un indicateur par client · (c) vision de rareté.
**Reco Claude Code** : (a) pour piloter, mais en changeant l'indicateur : viser **le plancher mensuel**, pas la moyenne.
**Décision de Paul :**

### 28. Quels critères valident le positionnement ?
**Position** : huit candidats, aucun atteint. · **Statut : AMBITION.** · **Source** : un pilote payé atteint sept fois. · **Contre-exemple** : quatre critères ne sont pas instrumentés — rien ne permettrait de les constater. · **Options** : (a) les huit · (b) trois bloquants : résultat mesuré, marge connue, renouvellement payé · (c) un seul : un client hors réseau qui paie deux fois.
**Reco Claude Code** : (b), avec une préalable non négociable : **rapprocher Qonto facture par facture**. Tant que six ventes sur sept n'ont ni facture ni ligne de revenu, aucun critère n'est mesurable.
**Décision de Paul :**

---

## Ordre suggéré

Les sessions 1 et 2 dépendent d'une extraction d'une heure (Qonto) et d'une lecture (les 215 réunions). Les sessions 3 et 4 peuvent se tenir tout de suite : elles portent sur des faits déjà établis, pas sur des chiffres manquants.

Deux sujets sortent de ce cadre et ne sont pas des décisions de positionnement : **A16** (le serveur 187 part le 31/08) et **A45** (le partage IUC non écrit). Ils se traitent avant, indépendamment.
