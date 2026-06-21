# USER STORIES & PARCOURS INDIVIDUALISÉS — site conversationnel parrit.ai
Date : 2026-06-21 · Status : étude / design (designing). Issu d'une étude multi-agents (14 personas) ancrée sur l'historique réel de Parrit.

> Demande Paul (/goal) : des user stories + parcours **individualisés par persona** (DG, toutes les directions métier, avocats, experts-comptables, chefs d'entreprise e-commerce), pour que « ça parle à tout le monde, basé sur le cas d'usage, et que les parcours s'adaptent ». Voir aussi `STUDY.md` (l'archi) et `TRUTH.md` (la source de vérité).

---
## 1. Le système de parcours adaptatifs

### Taxonomie
| Groupe | Personas | Traits communs | Voix |
|---|---|---|---|
| A. Owner-operateurs PME (le coup de poing) | dg (DG/CEO ETI-PME), owner_ecom (chef e-commerce DTC), coo (directeur des operations) | Vue transverse ou tout-en-un, raisonnent en charge des equipes + time-to-impact, allergiques au deck/POC hors-sol, veulent 'la chose qui tourne' en quelques semaines. North star = back-office libere. Front dominant = (1) operer le back-office. | PME-operateur |
| B. Professions reglementees (la donnee + le jugement humain d'abord) | avocat (associe cabinet), expert_comptable (associe cabinet), juridique (General Counsel interne) | Facturent l'heure ou portent la responsabilite reglementaire (secret pro, RGPD, conformite, deontologie). Premier reflexe = la confidentialite, pas la fonctionnalite. Veulent enlever la mecanique repetitive (veille, premiere passe) en gardant l'humain sur la decision. Phrase canon : 'l'outil pousse, l'humain tranche'. | hybride |
| C. Fonctions PME pilotees par la preuve (RDV/ROI) | cfo (DAF), commercial (CCO/Sales), cmo (CMO mid-market) | Porteurs d'un chiffre (cloture/DSO, pipeline/RDV, share of voice/citations IA). Achetent sur preuve mesurable et quick win defendable, pas sur promesse. Le CMO touche au front business+GEO ; le CCO est le coeur du front (2) business genere ; le DAF est sur le back-office financier + IA decision. | hybride |
| D. C-level grand groupe / industrialisation gouvernee (la voix executive) | cdo (Chief Digital Officer), dsi (DSI/CIO), transfo (Dir. Transformation/Innovation), drh (DRH montee en competence) | Sponsors de l'adoption multi-entites, hantes par le cimetiere de POCs, comptables devant le COMEX. Invariants non negociables : agnostique (Vertex/Bedrock/Azure/souverain), la donnee reste chez nous, pas de vendor lock-in, coeur jamais touche (satellites seulement), garde-fous + audit, equipes autonomes apres. Leviers : pilote en prod + enablement gouverne en cascade. Le DRH partage l'enablement/cascade mais glisse cote PME selon la taille. | grand-groupe-C-level |
| E. E-commerce a volume / visibilite IA (le cas Rufus + back-office a volume) | dir_ecom (directeur e-commerce retail/grand groupe) | Pivot a part : raisonne marge/panier/saisonnalite/part de voix Rufus. Deux fronts ancres sur l'outil GEO Amazon reel (taux de citation par segment + 3 fixes copier-coller re-mesures) ET le back-office a volume (service client classify->draft->escalade + capture leads multi-canal). Voix grand-groupe si retail corporate, mais le front 'mesure reelle' parle a tous. | hybride |

### Parcours conversationnel commun (un seul squelette, le contenu se substitue par persona)
PARCOURS CONVERSATIONNEL UNIQUE EN 6 ETAPES (un seul squelette, le contenu se substitue par persona via slots).

E0. COLD-START (avant le premier mot)
- Affiche 3-4 suggestion chips + un placeholder de prompt. Ces chips sont le PREMIER point d'adaptation : pre-remplis a partir du segment detecte de maniere deterministe (UTM/referrer/page). Si segment inconnu -> chips neutres 'deux fronts' (par ou commencer / un cas qui tourne / combien de temps avant un resultat).
- VARIE PAR PERSONA : le jeu de chips (entry.suggestionChips de chaque fiche).

E1. ACCROCHE / PREMIER MESSAGE
- L'utilisateur ecrit (ou clique une chip). On ne le fait jamais remplir un formulaire.
- VARIE : rien cote site, c'est l'input libre. Le firstPrompt des fiches sert d'exemple de calibrage du detecteur.

E2. CADRAGE 'DEUX FRONTS' (le coeur invariant Parrit)
- Toujours : 'Dans une boite comme la votre, ca se joue sur deux fronts/leviers de poids egal. On en prend un, on le fait tourner, on mesure, on etend.' Jamais reduire a la lead gen.
- VARIE : le libelle des deux fronts (diagnostic.framing/front1/front2 de la fiche) + la voix (tutoiement Academy jamais ici / vouvoiement coup de poing PME / vouvoiement executif grand groupe).

E3. CANVAS DIAGNOSTIC (mini-schemas de flux, le COMMENT)
- Toujours : 2 mini-schemas 'entree -> agent -> action/escalade', 1 cas reel anonymise par front, 3-4 pills. Demontrer pas decreter. Zero prix, zero nom client, zero tiret cadratin, zero pathos.
- VARIE : les flux, le cas reel ancre (diagnostic.pills + offerFit), et les INVARIANTS pousses sans qu'on les demande pour groupes B/D (secret pro / donnee chez vous / agnostique / coeur intact).

E4. OFFER-FIT (la chose qui tourne, pas un deck)
- Toujours : Sprint (1-5j) cadre par cartographie + Management d'agents IA en continu (+ Formation/cascade pour D et DRH). Paul prototype, Yukun met en prod. Le site lui-meme = la preuve (Hermes, content factory, machine d'acquisition).
- VARIE : le mix d'offres + le cas reel cite (offerFit de la fiche).

E5. CTA + LIVRABLE
- Toujours : visio 15-20 min (PME owner-ecom/COO/CFO/CCO/CMO/dir_ecom souvent 20 min de cartographie d'un process/scan reel ; grand groupe 15-20 min cadrage cas pilote + archi). Possibilite d'envoyer une presentation sur-mesure a la suite. Aucune relance agressive, aucune promesse chiffree non defendable.
- VARIE : la formulation du CTA (cta de la fiche) + le 'teaser de livrable' (audit citations IA pour CMO, premier scan Rufus pour dir_ecom, cartographie d'un process avant la prochaine periode fiscale pour expert_comptable).

CE QUI EST 100% COMMUN : la grammaire 2 fronts, le canvas mini-schemas, l'interdiction prix/nom client/tiret/pathos (LE TAMIS applique a chaque message genere), le binome proto/prod, la cloture sur visio. CE QUI VARIE : chips, libelle des fronts, voix, cas ancre, invariants pousses, formulation CTA, teaser livrable.

### Détection du segment
DETECTION EN DEUX TEMPS (deterministe d'abord, LLM ensuite, le LLM peut RE-ROUTER).

1) SIGNAUX DETERMINISTES (a l'arrivee, cote serveur, avant le 1er message) -> pose un segment provisoire + le bon jeu de chips :
- UTM campaign/content : campagnes dirigeants-PME/Operating-Partner -> groupe A ; campagne C-level Data/IA, enablement, scaling -> groupe D ; campagne GEO/content factory -> cmo ; campagne Rufus/GEO Amazon -> dir_ecom.
- Referrer : LinkedIn post Paul outbound/signal -> commercial ; LinkedIn post content factory/GEO -> cmo ; LinkedIn intervention 'democratiser l'agentique grands groupes' -> D ; outil public detecteur de bullshit -> owner_ecom/cmo/coo (lead magnet) ; annuaire ordre / presse profession -> avocat/expert_comptable/juridique.
- Page d'entree : page back-office/operations -> A ; page formation/academy/management d'agents -> drh/transfo ; page archi/securite/souverainete -> dsi ; page GEO e-commerce/Rufus -> dir_ecom ; page acquisition/business-genere -> commercial ; page conformite/LegalTech -> juridique.
- Email du domaine si capte plus tard : grand groupe corporate .com -> bascule voix executive ; gmail/perso -> reste owner.
- Granularite : ces signaux fixent SEGMENT (4 macro : dirigeant-pme, owner-ecommerce, profession-liberale, direction-grand-groupe) -> map direct sur le champ 'segment' deja present dans les fiches.

2) EXTRACTION LLM (sur la conversation, en continu) -> affine le persona DANS le segment et choisit la voix :
- Lexique discriminant (champ 'language' de chaque fiche) : 'P&L/marge/par ou commencer' -> dg ; 'SAV/Klaviyo/PrestaShop/sans agence' -> owner_ecom ; 'secret pro/jurisprudence/BODACC' -> avocat ; 'liasse/rapprochement/FEC' -> expert_comptable ; 'cloture/DSO/piste d'audit/ROI defendable' -> cfo ; 'RDV qualifies/pipeline/SDR/delivrabilite' -> commercial ; 'GEO/AEO/voix de marque/AI Overviews' -> cmo ; 'POC/production/COMEX/agnostique/referents' -> cdo ; 'RBAC/journaux d'audit/systemes coeur/shadow IT' -> dsi ; 'industrialiser/gouvernance/plusieurs entites/CoE' -> transfo ; 'montee en competence/cascade/ne pas braquer' -> drh ; 'revue de contrats/clauses/RGPD/privilege' -> juridique ; 'Rufus/part de voix/ASIN/Buy Box' -> dir_ecom.
- Le LLM produit un objet {segment, persona, voix, confidence}. Si confidence faible -> reste sur le cadrage generique 'deux fronts' (jamais de mauvais ciblage agressif).
- RE-ROUTAGE autorise : si le deterministe disait 'dirigeant-pme' mais la conversation parle agnostique/COMEX/multi-entites, le LLM bascule en 'direction-grand-groupe' et change la voix coup-de-poing -> executive (critere d'acceptation explicite du cdo/transfo).

3) ROUTAGE : {segment, persona, voix} -> selectionne le pack de slots (chips, framing, fronts, cas ancre, invariants, CTA) injecte dans le squelette commun. Aucune page dediee par persona : c'est le MEME parcours qui charge un pack.

### Mapping sur le site + niveau de personnalisation
MAPPING SUR LES SURFACES DU SITE + niveau de personnalisation (perso des BORDS vs perso du COEUR).

Surfaces :
- Accueil / hero : universel, voix neutre Parrit (AI Operating Partner, deux fronts, 'on livre la chose qui tourne'). Perso = NULLE (le coeur de marque ne bouge pas).
- Cold-start de la conversation (chips + placeholder) : PERSO DES BORDS, deterministe (UTM/referrer/page). C'est ici qu'on gagne le plus de pertinence a moindre risque : on ne change pas le discours, juste l'amorce.
- Le diagnostic conversationnel (canvas) : PERSO DU COEUR, pilotee LLM. C'est le seul endroit ou le contenu se reecrit vraiment (fronts, cas ancre, voix, invariants). C'est le 'sur-mesure' Parrit en construction.
- Pages thematiques (back-office / operations, business genere/acquisition, formation/academy, conformite-LegalTech, GEO e-commerce/Rufus, archi-securite-souverainete) : servent de POINTS D'ENTREE deterministes (elles fixent le segment) et hebergent un cas reel anonyme pre-cable au segment. Perso = MOYENNE (statique par segment, pas par individu).
- Outil public detecteur de bullshit : surface de PREUVE et lead magnet, pas de perso ; il alimente le referrer (owner_ecom/cmo/coo) et sert d'accroche 'Parrit fait tourner des agents, il n'en parle pas'.
- Blog / content factory (Actualite) : preuve vivante + entree GEO ; referrer signal cmo/dir_ecom.
- CTA visio / prise de RDV : universel dans la forme (15-20 min avec Paul), libelle PERSO DES BORDS (teaser livrable adapte).

Doctrine perso : COEUR DE MARQUE = invariant (positionnement, deux fronts, LE TAMIS, binome proto/prod, jamais prix/nom client). BORDS = adaptatifs (chips, libelles, cas ancre, voix, CTA, invariants pousses). On personnalise l'amorce et le diagnostic, jamais l'identite. Regle de securite : tant que la confidence persona est faible, on reste sur le coeur neutre plutot que de risquer une voix fausse (un grand groupe a qui on parle 'coup de poing' = echec).

### Branchement sur l'archi 5 couches
BRANCHEMENT SUR L'ARCHI 5 COUCHES (segment -> conversation -> generation -> livrable -> continuite).

C1 SEGMENT (detection) : les signaux deterministes (UTM/referrer/page/domaine email) posent le SEGMENT (les 4 valeurs du champ 'segment' des fiches : dirigeant-pme / owner-ecommerce / profession-liberale / direction-grand-groupe) + le jeu de chips. C'est la couche d'entree : elle choisit le pack provisoire et la voix par defaut. Sortie = {segment, voix, chips}.

C2 CONVERSATION (le squelette commun 6 etapes) : le MEME parcours pour tous, qui charge le pack du persona. Le LLM extrait persona+confidence du lexique (champ 'language'), peut re-router de segment, et selectionne dans le pack : framing, front1/front2, pills, invariants a pousser. Cette couche tient l'invariant 'deux fronts' et la voix. Sortie = {persona, voix verrouillee, fronts retenus, front choisi par l'utilisateur}.

C3 GENERATION (canvas + copy) : a partir du pack + de ce que dit l'utilisateur, on genere les mini-schemas de flux, le cas reel ancre (offerFit) et la copy. LE TAMIS s'applique ici a chaque message, avec garde-fou deterministe (filtre prix/nom client/tiret cadratin) avant affichage. C'est la couche ou Parrit 'demontre' (le COMMENT), pas decrete.

C4 LIVRABLE : le CTA + le teaser de livrable adapte (visio 15-20 min, audit citations IA pour cmo, scan Rufus pour dir_ecom, cartographie process avant periode fiscale pour expert_comptable) + l'option 'presentation sur-mesure envoyee a la suite'. Le livrable final reste le RDV qualifie avec Paul (north star) ; la presentation est generee depuis le pack + la conversation.

C5 CONTINUITE : la conversation + {segment, persona, voix, front choisi, signaux} se consignent (Supabase, base separee par contexte) pour preparer le call de Paul et alimenter le CRM/relance avec respect du meeting_guard (pas de relance si RDV booke). Le site est lui-meme la preuve de cette archi : Hermes ameliore le site en continu, la content factory publie le travail reel, la machine d'acquisition par signal tourne. Le systeme de parcours adaptatifs est donc la face visiteur de la meme machine unifiee acquisition->closing->livraison : segment capte -> conversation qui qualifie -> generation du diagnostic -> livrable RDV, un seul pipeline.

### Personas prioritaires (par valeur RDV)
- commercial (CCO/Sales) — front 'business genere' = north star RDV direct, intention la plus chaude, le cas courtier energie B2B + la machine d'acquisition Parrit elle-meme sont deja en prod : conversion la plus rapide
- dg (DG/CEO ETI-PME) — arbitre du budget, point d'entree le plus large, debloque les deux fronts d'un coup, cas coutellerie + courtier prets
- transfo (Dir. Transformation grand groupe) — plus gros tickets (pilote + enablement cascade + revue d'alignement), voix executive deja gravee, cas luxe/retail/distributeur sport ; valeur RDV par tete maximale
- owner_ecom (chef e-commerce DTC) — volume d'entrants via outil public + content, cas coutellerie/abonnement tres concrets, cycle court, alimente la preuve sociale
- dir_ecom (directeur e-commerce retail) — accroche differenciante forte (scan Rufus reel = teaser livrable tangible), demo 20/06 a proteger, ticket eleve

### Matrice
| Persona | Chip d'entree (amorce) | Cadrage diagnostic (2 fronts) | Offre | CTA |
|---|---|---|---|---|
| dg | Par ou commencer avec l'IA | Operer le back-office + Generer du business | Sprint Transformation IA + Formation pour scaler | Visio 15-20 min, cadrer le 1er chantier |
| owner_ecom | Automatiser mon SAV sans agence | Capture+relance multi-canal + SAV/newsletter | Sprint court 1-5j ou tache au temps passe | 20 min sur mon cas, 1er front a automatiser |
| coo | Automatiser le traitement des reclamations | Charge equipe (tri/escalade) + Pilotage (alerte) | Sprint cartographie process + workflow en prod | 20 min, mapper un process + son cout |
| avocat | Automatiser la veille sur mes clients | Veille auto portefeuille + Mecanique de production | Transformation IA + Management agents, pilote | Visio 15-20 min, cadrer un pilote |
| expert_comptable | Automatiser la collecte des pieces | Collecte/rapprochement + Temps conseil libere | Sprint + Management agents | 20 min, cartographier canaux avant la periode |
| cfo | Automatiser rapprochement + relances | Back-office financier + IA au service decision | Sprint quick win mesurable + Management agents | 15-20 min, chiffrer un quick win |
| drh | Former mes equipes sans les braquer | Montee en competence cascade + Back-office RH | Formation cascade + Sprint front RH | Visio 15-20 min, cadrer kick-off + 1er cas |
| dsi | La donnee reste-t-elle chez nous ? | Peripherie auto (coeur intact) + Agnostique+transfert | Transformation+Management+Formation, pilote integre | 15-20 min, cartographier satellites + archi |
| cdo | Passer nos POCs en production | Pilote en prod + Autonomie referents | Transformation+Management+Formation, revue alignement | 15-20 min, cartographier un cas metier |
| commercial | Detecter les signaux d'achat | Capter+qualifier signal + Transformer en RDV | Sprint boucle signal->RDV + operation continue | 20 min, un signal reel de votre secteur |
| cmo | Etre cite par ChatGPT et Perplexity | Production content factory + Visibilite GEO/AEO | Usine de contenu + Management boucle GEO | 20 min + audit de vos citations IA |
| juridique | Automatiser la 1ere passe contrats | 1ere passe contrats + Veille reglementaire supervisee | Sprint proto sur vos contrats + Management veille | 15-20 min, cadrer 1ere passe sur 1 contrat type |
| dir_ecom | Mesurer ma part de voix sur Rufus | Visibilite Rufus mesuree+corrigee + Back-office volume | Transformation+Management, pilote grand groupe | 15-20 min, lancer un 1er scan Rufus |
| transfo | Passer nos POCs a l'echelle | Pilote en prod + Enablement gouverne cascade | Transformation+Management+Formation, revue alignement | 15-20 min, cadrer un cas pilote + revue |

### Risques
- Mauvais routage de voix : parler 'coup de poing PME' a un DSI/CDO grand groupe = echec immediat (leur critere d'acceptation l'interdit). Mitiger : confidence-gating, par defaut le coeur neutre, le LLM ne bascule en voix executive que sur signaux explicites (agnostique/COMEX/multi-entites).
- Sur-personnalisation = effet flippant : adapter trop tot sur un signal faible (UTM heritee, referrer trompeur) donne un diagnostic a cote. Personnaliser les BORDS tot, le COEUR seulement quand la confidence monte.
- Frontiere DRH/dirigeant-pme floue : le DRH oscille entre PME (back-office RH) et grand groupe (cascade/COMEX). Risque de double comptage. Trancher par taille d'entreprise detectee + lexique 'cascade/referents'.
- Promesse implicite de chiffre : les personas preuve (CFO/CCO/CMO) reclament du ROI/volume ; risque de glisser vers une promesse non defendable. Garder LE TAMIS : montrer le COMMENT et un ordre de grandeur (ex 150-300 mails/j), jamais un resultat garanti.
- Fuite de prix / nom client dans le texte genere par LLM : le modele peut halluciner un nom ou un montant. Garde-fou deterministe post-generation (filtre regex noms/prix/tiret cadratin) AVANT affichage, sinon viole une regle absolue.
- Catalogue de cas reels limite : reutiliser toujours coutellerie/courtier/cabinet peut sonner repetitif et exposer a la sur-attribution. Mapper un cas pertinent par persona et eviter d'empiler.
- Dependance a la qualite de detection : si UTM/referrer absents (acces direct, app mail), tout repose sur le LLM ; prevoir un parcours neutre robuste qui convertit sans persona.
- Charge de maintenance : 14 packs de slots a tenir alignes avec les vrais cas et la doctrine. Risque de derive copy. Centraliser les packs en data (un fichier source) et faire passer LE TAMIS en CI.

---
## 2. Les 14 user stories

### Directeur General / CEO (ETI ou PME)
*Segment : dirigeant-pme*

**User story** — En tant que DG d'une ETI, je veux identifier en quelques minutes les deux fronts de mon entreprise ou des agents IA degagent du temps et generent du business, afin d'arbitrer un premier chantier a impact rapide et de savoir qui le porte cote operationnel.

**Job-to-be-done** : Quand je vois mes equipes saturees sur des taches repetitives et mes concurrents avancer sur l'IA, je veux savoir ou l'agentique cree un gain concret et rapide dans MA boite, afin de decider d'un premier chantier qui tourne en quelques semaines sans bloquer toute l'organisation.

**Douleurs (leurs mots)** : Tout le monde me parle d'IA mais personne ne me montre une chose qui tourne dans ma boite · Mes equipes passent un temps fou sur des taches a faible valeur (saisie, relances, veille, support) et je le paie sur la marge · J'ai peur de lancer un gros projet IA hors-sol qui consomme du budget six mois et n'accouche de rien · Je ne sais pas par ou commencer ni qui dans mon equipe doit porter ca

**Langage / vocabulaire** : P&L, marge, time-to-impact, arbitrage, charge des equipes, quick win, ROI, back-office, ca tourne ou pas, concret, mes equipes, premier chantier, passer a l'echelle

**Entrée** : Arrive par bouche-a-oreille de pair dirigeant, par un post LinkedIn de Paul, ou en cherchant 'automatiser les operations avec l'IA' / 'agents IA entreprise'. Intention : voir une preuve concrete avant d'engager du temps, pas lire un enieme discours sur l'IA.
  - 1ʳᵉ phrase type : « On est une PME de 120 personnes, mes equipes croulent sous les taches repetitives et je ne sais pas par ou commencer avec l'IA. Concretement, qu'est-ce qui tournerait vite chez nous ? »
  - Chips : Par ou commencer avec l'IA dans ma boite · Quel chantier a impact rapide pour mes equipes · Montrez-moi un cas concret qui tourne · Combien de temps avant un premier resultat

**Diagnostic (Dans une entreprise comme la votre, l'agentique se joue sur deux fronts de poids egal. Vous n'avez pas a tout faire d'un coup : on en prend un, on le fait tourner, on mesure, puis on etend.)** :
  - Operer le back-office. On branche vos canaux d'entree (formulaires, telephone, messageries, votre outil metier) sur un socle unique, et des agents font tourner le quotidien : capture et qualification des demandes, relances segmentees, veille, premiere reponse au support. Ancre reel : pour une marque artisanale haut de gamme, les leads qui arrivaient en desordre par plusieurs canaux atterrissent dans une base unique avec des relances automatiques calibrees par type de client. Resultat visible : du temps rendu aux equipes, plus rien qui passe a la trappe.
  - Generer du business. On part d'un signal exterieur (une intervention, un changement, une actualite de la cible) pour declencher une prise de contact personnalisee, supervisee par un humain, qui aboutit a des rendez-vous qualifies. Ancre reel : pour un courtier en energie B2B, ce mecanisme alimente le pipe commercial sans gonfler l'equipe. Vous gardez la main : l'humain valide avant tout envoi.
  - Pills : 2 fronts, on en prend 1 d'abord · premier resultat en quelques semaines · ca tourne, on ne vous remet pas un deck · vous gardez la main : l'humain valide

**Offre + cas ancré** : Offre Transformation IA en format Sprint (quelques jours) : on cartographie vos deux fronts, on choisit le chantier a impact le plus rapide, et on livre une premiere brique qui tourne, pas un rapport. Paul fait le proto, Yukun la mise en prod. Cas qui resonne pour un DG transverse : une marque artisanale dont le back-office (capture multi-canal + relances segmentees) a ete mis sous agents, ou un courtier B2B dont le business genere tourne en continu. Pour le passage a l'echelle ensuite, le volet Formation au management d'agents IA outille vos equipes pour porter la suite en interne.

**CTA** : Reserver 15-20 min en visio avec Paul pour cadrer le premier chantier a impact

**Détection** : Page d'entree = accueil ou page back-office / operations (pas une page technique ou academy) · Langage de la conversation : P&L, marge, equipes, par ou commencer, quick win, time-to-impact, sans jargon technique · Mentionne une taille d'entreprise (50-500) et une vue transverse, pas un service unique · Referrer LinkedIn (post Paul) ou bouche-a-oreille pair dirigeant ; recherche du type 'automatiser operations IA PME' · UTM campagne dirigeants PME / Operating Partner ; pas d'arrivee via outil public detecteur de bullshit ni page formation

**Critères d'acceptation** :
  - [ ] Des le premier message, le diagnostic propose les DEUX fronts (back-office + business) avec un cas reel anonymise par front, et invite a en choisir un seul a demarrer
  - [ ] Le canvas montre le COMMENT en mini-schemas de flux (canaux d'entree vers base unique vers actions agents) sans aucun jargon : un DG non-technicien comprend le benefice metier en moins de 30 secondes
  - [ ] Aucun prix ni nom de client n'apparait dans le texte ; le parcours se clot sur le CTA visio 15-20 min, sans relance agressive ni promesse chiffree non defendable


### Chef d'entreprise e-commerce (owner-operateur)
*Segment : owner-ecommerce*

**User story** — En tant que fondateur-operateur d'une boutique e-commerce qui fait tout lui-meme, je veux que mes taches repetitives de back-office (capture de leads multi-canal, relances segmentees, SAV, newsletter) soient operees par des agents que je supervise, afin de recuperer plusieurs heures par semaine et convertir plus sans recruter ni dependre d'une agence.

**Job-to-be-done** : Quand mon temps part dans des taches repetitives (relances clients, SAV, saisie de commandes, newsletter), je veux deleguer ces fronts a des agents qui tournent vraiment, afin de recuperer des heures par semaine et faire grossir le CA sans recruter ni dependre d'une agence.

**Douleurs (leurs mots)** : Je passe mes soirees a re-saisir a la main les commandes telephone et a recopier des leads TikTok dans un Google Sheet · Mon SAV explose, je reponds aux memes mails toute la journee et je paie une agence pour ce que je pourrais internaliser · J'ai des leads qui arrivent de partout (TikTok, Snap, Insta, site, tel) et je relance au feeling, sans segmentation, donc je laisse de l'argent sur la table · Toutes les solutions qu'on me vend sont des usines a gaz, je veux un truc qui marche, pas un projet de 6 mois

**Langage / vocabulaire** : back-office, SAV, tickets, relances, panier moyen, leads, DM, Klaviyo, PrestaShop / Shopify, WhatsApp, Google Sheet, internaliser, sans agence, ca tourne tout seul, gain de temps, newsletter de marque, abonnement

**Entrée** : Canal organique / bouche-a-oreille e-commerce, ou depuis un contenu Paul (video, outil public detecteur de bullshit), ou recherche du type 'automatiser SAV e-commerce' / 'automatiser relances WhatsApp'. Intention = trouver du levier concret, pas un audit.
  - 1ʳᵉ phrase type : « Je gere une boutique en ligne a 3, je passe mes journees sur le SAV et a recopier des commandes a la main. Vous faites quoi exactement, concretement ? »
  - Chips : Automatiser mon SAV sans agence · Capturer mes leads TikTok / Insta / tel au meme endroit · Relancer mes clients par WhatsApp automatiquement · Combien de temps pour mettre ca en place ?

**Diagnostic (Sur une boutique tenue a quelques personnes, le temps fuit sur deux fronts. On les attaque comme deux flux concrets, pas comme un projet.)** :
  - Back-office capture + relance : un point d'entree unique ou tombent les leads et commandes (TikTok, Snap, Insta, site, telephone) vers un Google Sheet que vous lisez deja, avec source et segment ajoutes automatiquement. Par-dessus, un agent WhatsApp relance par typologie (premier achat, panier abandonne, B2B, cadeau) avec l'historique par numero. Cas reel : une coutellerie artisanale ou ~50% des commandes arrivaient par telephone et la saisie etait 100% manuelle, desormais centralisee et relancee.
  - Back-office SAV + contenu : un agent qui classe les tickets entrants, prepare les reponses (vous gardez la main sur l'escalade) et un volume de SAV deja automatisable a 50%+ qu'on internalise pour sortir de la dependance agence. Cote contenu, un agent qui produit le template de newsletter de marque a partir de vos editions passees, votre banque d'images et votre ton de voix. Cas reel : une marque de produits en abonnement qui automatisait deja une partie de son SAV et voulait l'internaliser.
  - Pills : 1 boite unique pour tous vos leads · Relances WhatsApp segmentees · SAV : tri + reponses pretes · Newsletter au template automatise

**Offre + cas ancré** : Offre Transformation IA en format Sprint court (1 a 5 jours) ou intervention a la tache au temps passe, pour rester loin de l'usine a gaz. Cas reels anonymises qui resonnent : la coutellerie artisanale (capture multi-canal TikTok/Snap/site/tel vers Sheet + relances WhatsApp segmentees par typologie) et la marque de produits en abonnement (SAV deja automatise a 50%+ a internaliser + template de newsletter de marque automatise). Demonstration possible via l'outil public (detecteur de bullshit) qui montre que Parrit fait tourner des agents, il n'en parle pas.

**CTA** : Montrez-moi sur mon cas : 20 min pour cadrer le premier front a automatiser

**Détection** : Page d'entree liee a l'automatisation e-commerce / SAV / relances · Mots-cles dans la conversation : SAV, tickets, leads, DM, panier, Klaviyo, PrestaShop, Shopify, WhatsApp, newsletter, sans agence, internaliser · Langage 'je fais tout moi-meme', 'a 2-3', 'ca tourne tout seul', 'pas une usine a gaz' · Referrer reseaux sociaux (TikTok/Insta) ou contenu Paul, plutot que LinkedIn corporate · UTM contenu / outil public detecteur de bullshit

**Critères d'acceptation** :
  - [ ] La conversation identifie au moins un des deux fronts (capture/relance OU SAV/newsletter) et restitue un mini-schema de flux concret ancre sur un cas reel anonymise, sans jargon ni promesse hors-sol
  - [ ] Le diagnostic montre le COMMENT (canaux, point d'entree, segmentation, agent de tri) et ne contient ni prix, ni nom de client, ni tiret cadratin, ni pathos
  - [ ] Le parcours propose un CTA sobre de cadrage 20 min sur le cas reel de la personne, sans deck ni promesse de transformation generique


### Avocat / associe de cabinet
*Segment : profession-liberale*

**User story** — En tant qu'associé de cabinet d'avocats, je veux automatiser la veille et la mécanique de production autour de mes dossiers tout en gardant la main sur chaque décision, afin de libérer des heures facturables sans jamais compromettre le secret professionnel ni la qualité des actes.

**Job-to-be-done** : Récupérer du temps facturable et fiabiliser la veille et la production d'actes, sans déléguer à un outil qui touche aux données clients ni qui décide à sa place. Garder l'humain sur la décision juridique, automatiser la mécanique autour.

**Douleurs (leurs mots)** : Mes heures partent dans la veille, la recherche et la mise en forme, pas dans le conseil que je facture · Tout passe par le secret professionnel : je ne peux pas balancer mes dossiers dans un outil grand public · On rate des signaux sur nos clients (procédures, M&A, radiations) parce que personne n'a le temps de surveiller · Je vois passer ChatGPT mais ça hallucine une jurisprudence, et un acte faux m'engage

**Langage / vocabulaire** : secret professionnel, temps facturable, diligences, veille juridique, jurisprudence, rédaction d'actes, conflit d'intérêts, confidentialité des dossiers, RPVA, déontologie, associé / collaborateur, BODACC, le cabinet

**Entrée** : Arrive par une recherche sur l'IA en cabinet d'avocats ou via un confrère / le réseau, avec une intention prudente : voir si c'est sérieux et compatible avec la déontologie, pas un gadget. Souvent en lisant un article ou après avoir testé ChatGPT et s'être heurté à la confidentialité.
  - 1ʳᵉ phrase type : « Je suis associé dans un cabinet d'avocats. Je perds un temps fou en veille et en mise en forme d'actes, mais je ne peux rien mettre dans un outil à cause du secret professionnel. Qu'est-ce que vous faites concrètement pour un cabinet ? »
  - Chips : Automatiser la veille sur mes clients et mes dossiers · L'IA et le secret professionnel, comment vous gérez · Récupérer des heures facturables sans risque · Un exemple concret livré pour un cabinet

**Diagnostic (Pour un cabinet, deux leviers de poids égal. On ne cherche pas à remplacer le jugement de l'avocat, on enlève la mécanique autour pour vous rendre des heures.)** :
  - Veille automatisée sur vos clients et vos dossiers. On branche des sources officielles (BODACC, registres, sources publiques) sur votre portefeuille : chaque jour un agent détecte les signaux qui comptent (procédure collective, cession, modification, radiation, M&A), les note, écarte les homonymes et les doublons, et vous pousse seulement le qualifié. L'avocat valide d'un geste, garde ou écarte. Un récapitulatif agrégé arrive le lundi. La veille tourne seule, la décision reste à vous.
  - La mécanique de production : recherche, structuration, mise en forme, premiers jets. On opère le travail répétitif autour de vos actes avec des agents que vous pilotez, sur une couche où la donnée reste chez vous. Le secret professionnel n'est pas un obstacle qu'on contourne, c'est l'architecture : agnostique sur le moteur (souverain ou cloud privé), les dossiers ne sortent pas, l'humain tranche chaque sortie.
  - Pills : Veille auto sur portefeuille · Sources officielles, zéro hallucination · Dédoublonnage signaux · Validation par l'avocat, l'humain tranche

**Offre + cas ancré** : Offre Transformation IA + Management d'agents IA, en pilote cadré. Le cas réel anonymisé qui résonne : pour un cabinet, on a mis en place une veille juridique automatisée sur plusieurs centaines de clients, alimentée par des sources officielles (BODACC) et une recherche IA contrôlée, avec scoring de pertinence, dédoublonnage, et un bot de supervision qui pousse chaque jour les signaux à l'avocat pour validation d'un geste, plus un récapitulatif hebdomadaire agrégé. La règle structurante : l'outil pousse, l'avocat décide.

**CTA** : Voir ce que ça donne sur votre cabinet : 15-20 minutes en visio avec Paul, on cadre un pilote sur un cas réel.

**Détection** : Mots-clés de recherche : IA cabinet avocats, automatisation veille juridique, IA et secret professionnel, RPVA, déontologie IA · Langage dans la conversation : secret professionnel, temps facturable, diligences, jurisprudence, conflit d'intérêts, le cabinet, associé/collaborateur · Page d'entrée : article ou page liée à la veille / aux professions réglementées ; referrer réseau ou bouche-à-oreille confrère · Préoccupation immédiate et récurrente pour la confidentialité et le risque (engagement de responsabilité), réticence aux outils grand public

**Critères d'acceptation** :
  - [ ] Le diagnostic mentionne explicitement le secret professionnel / confidentialité comme architecture (donnée qui reste chez le cabinet, moteur agnostique), pas comme une promesse vague
  - [ ] Le diagnostic montre le COMMENT de la veille (sources officielles + scoring + dédoublonnage + validation par l'avocat), pas seulement le bénéfice
  - [ ] Le parcours pose la règle 'l'outil pousse, l'avocat tranche' et n'évoque ni prix ni nom de client, et propose le CTA visio 15-20 min sans pression


### Expert-comptable / associe de cabinet
*Segment : profession-liberale*

**User story** — En tant qu'associe de cabinet d'expertise comptable, je veux que la collecte des pieces et le rapprochement tournent en automatique sous mon controle, afin que mes collaborateurs basculent leur temps de la saisie vers la revision et le conseil, sans jamais perdre la main sur la conformite ni laisser sortir la donnee de mes clients

**Job-to-be-done** : Absorber la charge de saisie et de rapprochement sans grossir l'equipe, et tenir les echeances fiscales en restant maitre de la conformite et du secret professionnel, pour que les collaborateurs passent du temps sur la revision et le conseil plutot que sur la pre-compta

**Douleurs (leurs mots)** : La saisie et le rapprochement bancaire mangent les journees des collaborateurs, surtout en periode de liasse et de TVA · Les pieces arrivent en vrac par dix canaux (mail, drive client, scan, photo WhatsApp, portail) et personne ne sait ce qui manque avant la cloture · On a teste des OCR et des outils SaaS qui promettent tout et tiennent la moitie, et la donnee part chez un tiers · Le conseil, ce qui fait la marge et fidelise, passe toujours apres l'operationnel parce qu'on court derriere les echeances

**Langage / vocabulaire** : saisie, rapprochement bancaire, revision, liasse fiscale, TVA / CA3, FEC, lettrage, GED / dematerialisation des pieces, balance, production comptable, portefeuille clients, secret professionnel, periode fiscale, facturation electronique

**Entrée** : Arrive souvent en fin de periode fiscale, via une recherche du type automatisation saisie comptable ou IA cabinet comptable, ou par un confrere / un article ; entre par le detecteur de bullshit ou une page parlant des deux fronts internes
  - 1ʳᵉ phrase type : « On est un cabinet, mes collabs passent leurs journees sur la saisie et le rapprochement. Qu'est-ce que vous pouvez vraiment automatiser sans que ca devienne ingerable en periode fiscale ? »
  - Chips : Automatiser la collecte des pieces clients · Le rapprochement bancaire en continu · Garder la main sur la conformite · Liberer du temps pour le conseil

**Diagnostic (Pour un cabinet, ca se joue sur deux fronts de meme poids : le front interne qu'on automatise, et le temps de conseil qu'on libere une fois ce front degage)** :
  - Front interne, la collecte et le rapprochement. On branche un agent sur vos canaux d'entree de pieces (mail dedie, drive, scans, photos) qui les recoit, les classe par client et par exercice, detecte ce qui manque avant cloture, et pre-rapproche les ecritures bancaires. La saisie devient une file de propositions que le collaborateur valide, pas une page blanche. La donnee reste chez vous, l'agent tourne sur votre brique, jamais on ne touche au reglementaire sans validation humaine.
  - Front conseil, le temps recupere. Une fois la pre-compta degagee, on installe une veille par client (changements reglementaires, signaux dans leur secteur) qui prepare des angles de relance et de RDV conseil. Vous restez le filtre humain : l'agent prepare, le collaborateur ou l'associe decide ce qui part au client.
  - Pills : Collecte multi-canal des pieces · Pre-rapprochement bancaire · Validation humaine sur le reglementaire · Donnee chez vous · Veille conseil par client

**Offre + cas ancré** : Offre Transformation IA en format Sprint (1 a 5 jours) pour cadrer et brancher la collecte de pieces et le pre-rapprochement, puis Management d'agents IA pour faire tourner l'ensemble sous supervision. Cas reel anonymise qui resonne : une coutellerie haut de gamme dont on capte les leads depuis cinq canaux disperses vers une base unique avec relances segmentees (meme probleme de pieces qui arrivent partout, ramenees a une file maitrisee) ; et un cabinet d'avocats, profession reglementee elle aussi, pour qui on a installe une veille automatisee avec un bot de supervision ou l'humain reste filtre avant tout envoi client, secret professionnel preserve

**CTA** : Reserver 20 minutes avec Paul pour cartographier vos canaux de pieces et votre rapprochement, et identifier ce qui s'automatise avant la prochaine periode

**Détection** : Mots-cles d'entree : automatisation saisie comptable, IA rapprochement bancaire, GED cabinet, OCR pieces comptables, automatiser collecte clients · Langage de la conversation : saisie, rapprochement, revision, liasse, TVA/CA3, FEC, lettrage, portefeuille, secret professionnel · Pic de trafic correle aux echeances fiscales (TVA mensuelle, periode de liasse) · Referrer depuis annuaires ordre / presse profession comptable, ou arrivee via le detecteur de bullshit · Page d'entree centree sur le front interne / back-office automatise plutot que sur la lead gen

**Critères d'acceptation** :
  - [ ] Si l'utilisateur dit saisie / rapprochement / liasse, le diagnostic affiche les deux fronts avec un mini-schema de flux pieces -> file de validation et ne reduit jamais l'offre a de la lead gen
  - [ ] Le diagnostic montre le COMMENT (canaux d'entree, classement par client/exercice, pre-rapprochement, validation humaine) sans aucun chiffre de prix ni nom de client, et nomme explicitement secret professionnel / donnee chez vous
  - [ ] Le cas reel cite est anonymise (coutellerie multi-canal et cabinet d'avocats reglemente) et le CTA propose 20 minutes avec Paul cale sur la cartographie des canaux avant la prochaine periode fiscale


### Chief Digital Officer (grand groupe/ETI)
*Segment : direction-grand-groupe*

**User story** — En tant que CDO d'un grand groupe sponsor de l'adoption IA, je veux transformer nos POCs en agents qui tournent en production et rendre mes referents autonomes pour les porter, afin de montrer du concret au COMEX tout en gardant le controle (donnee chez nous, agnostique, garde-fous DSI).

**Job-to-be-done** : Apres une vague de POCs IA qui n'ont pas passe le cap de la production, transformer l'enthousiasme en capacite interne reelle : des agents qui tournent sur de vrais cas metier, des equipes autonomes pour les porter, et des garde-fous qui rassurent la DSI, la securite et le COMEX, sans dependre d'un prestataire a vie ni livrer la donnee a l'exterieur.

**Douleurs (leurs mots)** : On a multiplie les POCs et les demos, mais rien n'est passe en production a l'echelle, et le COMEX commence a demander ce que ca a produit · Mes equipes IA savent prompter mais ne savent pas construire et operer des agents qui tiennent dans notre environnement · La DSI et la securite bloquent des qu'on parle de donnees, de modeles externes ou de vendor lock-in · Je ne veux pas etre dependant d'un cabinet a vie ; il me faut une capacite interne qui reste chez nous quand le prestataire part

**Langage / vocabulaire** : passer du POC a la production, scaler l'adoption, monter en competence les referents, agnostique, souverain, la donnee reste chez nous, pas de vendor lock-in, garde-fous, playbook, couches logicielles internes proprietaires, revue d'alignement, cas d'usage metier, pilote, DSI, COMEX

**Entrée** : Arrive en recherche raisonnee (LinkedIn d'un pair, intervention de Paul sur la democratisation de l'agentique dans les grands groupes, recommandation interne) ou via une page anglaise/grand-compte. Intention : evaluer si Parrit peut faire passer ses POCs en production sans tout exposer a la DSI. Lit avant de parler, cherche la preuve du COMMENT.
  - 1ʳᵉ phrase type : « On a fait pas mal de POCs IA cette annee mais rien n'est vraiment passe en production. Concretement, comment vous faites pour que des agents tournent sur nos cas metier et que ce soit mes equipes qui les portent ensuite ? »
  - Chips : Passer nos POCs en production a l'echelle · Rendre nos referents autonomes sur leurs cas · Rester agnostique : la donnee reste chez nous · Les garde-fous pour rassurer la DSI

**Diagnostic (Vous etes a la jonction de deux leviers : faire passer ce qui marche en demo a quelque chose qui tourne, et transferer la capacite a vos equipes pour qu'elles le portent sans nous. On regarde les deux ensemble.)** :
  - Levier production : on prend un de vos cas metier reels (un workflow backend interne, une couche logicielle proprietaire) et on en fait un agent qui tourne dans VOTRE environnement, sur le modele de votre choix (Vertex, Bedrock, Azure ou souverain). On orchestre les process satellites autour de votre SI, jamais les systemes critiques. Sprint de prototypage : une premiere version qui tourne en quelques jours, puis mise en production avec garde-fous (variables, types, dependances, securite verifies a chaque generation ; interface et base strictement separees ; acces teste comme par quelqu'un qui cherche a passer outre).
  - Levier autonomie : vos referents prennent l'outil en main et gagnent leur autonomie en construisant un vrai agent, pas en regardant une demo. On installe le playbook a l'echelle (conventions d'equipe, garde-fous, securite ecrits dans des fichiers de directives courts injectes dans l'outil) et une revue d'alignement reguliere, pour que l'usage tienne quand il s'etend. Ce sont eux qui portent l'outil ensuite ; le deploiement reste pilote par vos equipes.
  - Pills : 1 cas metier en production · Referents autonomes · Agnostique : modele au choix de la DSI · Playbook + garde-fous installes · Revue d'alignement

**Offre + cas ancré** : Offres Parrit : Transformation IA + Management d'agents IA + Formation au management d'agents, en mode pilote + revue d'alignement. Cas reels qui resonnent (anonymises) : un equipementier industriel ou les referents internes prennent Claude Code en main pour faire passer leurs cas backend en production avec playbook et garde-fous ; un groupe avec couches logicielles proprietaires ou les agents tournent sur l'environnement du client, modele au choix de la DSI, donnee qui ne sort pas. Le site lui-meme est la preuve : Parrit fait tourner ses propres agents (amelioration continue, content, acquisition), il ne fait pas que les decrire.

**CTA** : Caler 15-20 min en visio avec Paul pour cartographier un de vos cas metier et voir ce qui peut tourner en quelques jours

**Détection** : UTM ou referrer LinkedIn pointant sur un contenu agentique grand groupe ou une intervention de Paul · Email professionnel d'un grand groupe ou d'une ETI (domaine corporate, pas gmail) · Page d'entree anglaise ou orientee grand-compte plutot que la page PME/owner · Vocabulaire dans la conversation : POC, production a l'echelle, referents, DSI, COMEX, agnostique, souverain, vendor lock-in, couches proprietaires · Mention de POCs deja faits, d'equipes IA internes a faire monter en competence, ou de contraintes securite/conformite sur la donnee

**Critères d'acceptation** :
  - [ ] La conversation detecte le profil grand groupe et bascule sur la voix C-level (agnostique, souverain, donnee chez vous, pilote + revue d'alignement) sans jamais glisser sur le ton coup de poing PME
  - [ ] Le diagnostic livre les deux leviers (production + autonomie referents) ancres sur le COMMENT verifiable (sprint quelques jours, garde-fous a chaque generation, playbook injecte, modele au choix), sans aucun prix ni nom de client dans le texte
  - [ ] Le parcours se termine sur un canvas a deux leviers avec mini-schemas de flux et le CTA 15-20 min visio, et une presentation sur-mesure peut etre envoyee a la suite


### Directeur des operations (COO)
*Segment : dirigeant-pme*

**User story** — En tant que directeur des opérations, je veux qu'un process manuel et chronophage soit opéré par un système fiable branché sur mes outils actuels, afin de réduire la charge de mes équipes, mesurer et tenir mes délais, et garder l'humain uniquement là où il décide vraiment.

**Job-to-be-done** : Quand un process tourne encore à la main (ressaisies, mails de réclamation, suivi de commandes, alertes qui arrivent trop tard), je veux le faire opérer par un système fiable qui s'intègre à mes outils existants, afin de récupérer du temps équipe, fiabiliser la qualité et tenir mes délais sans recruter ni casser l'existant.

**Douleurs (leurs mots)** : On ressaisit la même info dans trois outils : ça part en erreur et ça bouffe des heures que personne n'a · Les réclamations clients arrivent en vrac dans une boîte mail partagée, sans typologie, sans temps de réponse mesuré, et tout escalade vers moi · Je découvre une rupture ou un retard après coup, jamais avant : zéro alerte proactive sur mes métriques · J'ai déjà testé un outil no-code ou un POC qui n'a jamais passé l'échelle ni survécu au terrain

**Langage / vocabulaire** : process, ressaisie, back-office, supply, rupture de stock, délai de réponse, réclamation client, escalade, SLA, le terrain, ça doit tourner le lundi matin, ça scale ou pas, intégré à mes outils, ERP, tableau de suivi, charge de travail, fiabilité, qui fait quoi

**Entrée** : Arrive souvent via une recherche sur l'automatisation des opérations ou un partage du détecteur de bullshit, ou par bouche-à-oreille dirigeant. Intention : voir si c'est du concret qui tourne, pas un cabinet de conseil de plus. Il scanne vite, il cherche le COMMENT.
  - 1ʳᵉ phrase type : « On a un process de traitement des réclamations qui part dans tous les sens, tout remonte vers moi. C'est automatisable sans qu'on perde la main sur les cas sensibles ? »
  - Chips : Automatiser le traitement des réclamations · Supprimer les ressaisies entre nos outils · Être alerté avant la rupture, pas après · Voir un cas réel en opérations

**Diagnostic (Deux fronts, et chez un COO ils se tiennent : un front charge équipe, un front pilotage. On attaque le geste qui se répète chaque jour, puis on rend mesurable ce qui ne l'est pas encore.)** :
  - Front charge équipe : on prend votre flux de réclamations ou de commandes là où il vit déjà (boîte mail partagée, tableur, ERP) et un agent le classe par typologie, applique la logique métier (qui dépend du cas et du contexte) et prépare la réponse. L'humain ne reprend la main que sur les cas sensibles, définis par vous. C'est exactement ce qu'on opère pour un acteur de mobilité urbaine à Londres : 150 à 300 mails par jour triés, réponse pré-rédigée, escalade humaine seulement sur les cas qui le justifient, avec une action créée directement dans leur outil interne.
  - Front pilotage : on supprime les ressaisies en branchant vos outils entre eux, source de vérité unique, et un agent surveille vos métriques pour lever l'alerte lui-même avant la rupture ou le retard. Pour une marque artisanale, on a remplacé une saisie 100 pour cent manuelle de commandes multi-canaux par une capture centralisée et des relances segmentées par typologie de client : le suivi devient lisible, le geste répétitif disparaît.
  - Pills : Branché sur vos outils, pas un de plus · Humain à la décision, agent sur le répétitif · Du mesurable là où c'était aveugle · Ça tourne en production, pas un POC

**Offre + cas ancré** : Offre Transformation IA en format Sprint (1 à 5 jours) : cartographie des process, chiffrage de la charge actuelle, quick wins en moins de 4 semaines, puis workflow opéré en production. Cas réels qui résonnent (anonymisés) : l'automatisation du flux de réclamations d'un opérateur de mobilité urbaine (tri, réponse, escalade ciblée, action dans l'outil interne) et la suppression de la saisie manuelle multi-canal chez une marque artisanale avec relances segmentées. Pour le pilotage, l'agent d'alerte proactive sur métriques. Yukun met en production ce que Paul prototype.

**CTA** : Réserver 20 minutes avec Paul pour mapper un de vos process et estimer le temps qu'il vous coûte aujourd'hui

**Détection** : UTM ou requête autour de automatisation des opérations, des process, du back-office, du traitement des réclamations ou des ressaisies · Page d'entrée orientée back-office automatisé ou cas industrie/retail/supply · Vocabulaire dans la conversation : process, supply, rupture, délai de réponse, escalade, SLA, ressaisie, ERP, le terrain · Referrer depuis le détecteur de bullshit ou un partage dirigeant · Formulation orientée fiabilité et passage à l'échelle plutôt que génération de leads

**Critères d'acceptation** :
  - [ ] À l'arrivée avec un signal ops (UTM/mots-clés process/réclamation/ressaisie), le cold-start affiche des chips orientées back-office et le premier diagnostic parle charge équipe + pilotage, sans jamais réduire à la lead gen
  - [ ] Le diagnostic montre au moins un COMMENT ancré sur un cas réel anonymisé (tri-réponse-escalade des réclamations, ou suppression de ressaisie multi-canal) avec un ordre de grandeur de volume, et zéro prix, zéro nom client, zéro tiret cadratin
  - [ ] Le canvas rend les deux fronts en mini-schémas de flux (entrée outils existants vers agent vers action/escalade) et le parcours se clôt sur un CTA 20 minutes avec Paul, pas sur une promesse générique


### Directeur financier / DAF (CFO)
*Segment : dirigeant-pme*

**User story** — En tant que DAF, je veux automatiser mes taches financieres repetitives (rapprochement, relances, reporting) avec une piste d'audit et une validation humaine, afin de raccourcir ma cloture et de defendre chaque gain devant ma direction sans prendre de risque sur le controle ni sur la donnee.

**Job-to-be-done** : Quand je dois clôturer, consolider et défendre un budget, je veux fiabiliser et raccourcir mes processus financiers répétitifs sans perdre le contrôle ni ajouter du risque, afin de libérer mon équipe des tâches de saisie et de produire un reporting défendable plus vite.

**Douleurs (leurs mots)** : Ma clôture mensuelle prend trop de jours, l'équipe passe son temps à ressaisir et rapprocher au lieu d'analyser · On me demande un ROI chiffré et un cas d'usage prouvé avant toute dépense, je ne signe pas sur une promesse · Le rapprochement factures / commandes / relances clients reste manuel et source d'erreurs, le DSO dérape · Je refuse une boite noire : j'ai besoin de traçabilité, d'un humain qui valide, et que la donnée reste chez nous

**Langage / vocabulaire** : cloture, consolidation, reporting, ROI defendable, DSO, rapprochement, controle interne, piste d'audit, centres de couts, tresorerie previsionnelle, ETP, saisie, fiabilite de la donnee, souverainete des donnees

**Entrée** : Arrive via une recherche sur l'automatisation finance / IA en finance, un partage LinkedIn d'un pair, ou orienté par sa direction générale après un comité ; intention prudente, evaluation, cherche la preuve et le cadre de controle avant de s'engager.
  - 1ʳᵉ phrase type : « On veut reduire le temps de cloture et fiabiliser le reporting, mais je dois pouvoir defendre le ROI et garder le controle. Concretement, qu'est-ce que vous automatisez et comment je garde la main ? »
  - Chips : Automatiser le rapprochement et les relances clients · Raccourcir ma cloture mensuelle · Garder une piste d'audit et un humain qui valide · Defendre le ROI devant ma direction

**Diagnostic (Sur votre poste, deux leviers de meme poids : ce qui se passe avant le chiffre (les operations qui le produisent) et ce qui se passe avec le chiffre (l'analyse et la decision). Parrit construit et opere sur les deux, avec un humain a la gachette et une trace de chaque action.)** :
  - Operer le back-office financier : capture et rapprochement des factures, commandes et encaissements dans une base unique, relances clients segmentees et automatiques pour reprendre le DSO, et un reporting consolide remonte sans ressaisie. Chaque ecriture porte sa piste d'audit, rien ne se valide sans un controle humain. Meme mecanique que la capture multi-canal vers une base unique avec relances segmentees deja en production chez un artisan haut de gamme, transposee a vos flux financiers.
  - Mettre l'IA au service de la decision : des agents qui lisent vos processus dans vos outils existants (ERP, compta, tableurs), evaluent si une operation est faite correctement, proposent une methode plus rapide et signalent les ecarts sur les centres de couts avant qu'une mauvaise decision ne passe. On travaille de maniere agnostique, la donnee reste chez vous, jamais branchee en dur sur votre coeur comptable.
  - Pills : Cloture raccourcie, equipe sortie de la saisie · Piste d'audit sur chaque action · Humain qui valide, pas de boite noire · Donnee chez vous, deploiement agnostique · ROI mesure process par process

**Offre + cas ancré** : Offre Transformation IA en format Sprint (1 a 5 jours), cadre par une cartographie des processus financiers puis un ou deux quick wins mesurables avant tout chantier profond, avec management d'agents IA en continu une fois en production. Cas reels qui resonnent (anonymises) : un outil qui evalue la maitrise d'un processus dans l'ERP et bloque les mauvaises decisions sur les centres de couts ; un back-office de capture multi-canal vers une base unique avec relances segmentees automatiques ; une facturation et un suivi des heures automatises pour un client en prestation.

**CTA** : Reserver 15 a 20 minutes avec Paul pour cartographier un processus financier et chiffrer un premier quick win mesurable.

**Détection** : Mots-cles dans la conversation : cloture, consolidation, reporting, DSO, rapprochement, ROI defendable, piste d'audit, controle interne, centres de couts, tresorerie · Page d'entree finance / automatisation des operations financieres, ou referrer LinkedIn d'un pair DAF · Langage prudent et oriente preuve : demande de cas d'usage prouve, de ROI chiffre, de garanties sur la donnee et le controle avant tout engagement · UTM ou intention liee a IA finance, automatisation comptable, reduction des couts de back-office

**Critères d'acceptation** :
  - [ ] Le diagnostic affiche deux fronts ancres sur des cas reels anonymises (back-office financier + IA au service de la decision) sans jamais citer de nom client ni de prix
  - [ ] Le parcours repond explicitement aux trois objections DAF : ROI defendable et mesure process par process, piste d'audit avec validation humaine, donnee qui reste chez le client en deploiement agnostique
  - [ ] Le CTA propose un creneau court de cartographie d'un processus financier debouchant sur un premier quick win chiffre, et la copy passe LE TAMIS (sobre, factuelle, sans pathos ni tiret cadratin)


### Directeur des ressources humaines (DRH)
*Segment : dirigeant-pme*

**User story** — En tant que DRH, je veux faire monter mes equipes en competence sur l'IA avec des cas d'usage tires de leur vrai quotidien RH et automatiser mon back-office repetitif, afin de prouver au COMEX une adoption mesurable et de rassurer mes equipes en leur montrant que l'IA leur enleve les taches penibles plutot que leur poste.

**Job-to-be-done** : Quand le COMEX me demande un plan IA et que mes equipes ont peur pour leurs postes, je veux faire monter mes equipes en competence sur des outils IA qui leur servent vraiment dans leur quotidien (paie, recrutement, onboarding) et alleger mon back-office RH, afin de transformer l'adoption en gain concret et mesurable plutot qu'en une enieme formation hors-sol que personne ne reutilise.

**Douleurs (leurs mots)** : Le COMEX me demande un plan IA mais je ne sais pas par ou commencer ni quoi promettre · Mes equipes ont peur que l'IA supprime leurs postes, je dois embarquer sans braquer · On a deja paye des formations IA generiques que personne ne reutilise le lundi matin · Mon back-office RH crame des heures sur du repetitif : tri de CV, reponses candidats, questions paie recurrentes, onboarding · Je ne veux pas qu'on m'envoie des consultants qui font un PowerPoint et repartent

**Langage / vocabulaire** : montee en competence, adoption, embarquer les equipes, acculturation IA, cascade, referents, plan de formation, GEPP, onboarding, back-office RH, tri de CV, conduite du changement, conformite sociale, ne pas braquer les equipes, hands-on, cas d'usage concret

**Entrée** : Arrive via une recherche du type 'formation IA equipes entreprise' ou 'acculturation IA RH', ou en reference d'un pair DRH, ou apres un post LinkedIn de Paul sur la formation au management d'agents IA. Intention : trouver un partenaire qui forme concretement, pas un programme theorique.
  - 1ʳᵉ phrase type : « Mon COMEX me demande un plan IA et mes equipes ont peur pour leurs postes. Comment je fais monter mes 40 personnes en competence sans que ce soit une formation de plus que personne ne reutilise ? »
  - Chips : Former mes equipes sans les braquer · Automatiser mon back-office RH (tri CV, reponses candidats) · Un plan IA concret a presenter au COMEX · Comment se passe une cascade par referents internes ?

**Diagnostic (Pour une DRH, on travaille deux leviers : faire monter vos equipes en competence (l'humain) et alleger votre back-office RH (les operations). Les deux se renforcent : on forme sur des cas tires de votre vrai quotidien, donc la formation produit directement des outils qui tournent.)** :
  - Montee en competence par cascade. Kick-off presentiel devant l'ensemble de l'equipe (vulgarisation + un cas d'usage construit en live, par exemple simuler un process RH a vous), puis ateliers a distance pour 3 a 4 referents internes que l'on rend autonomes. Ce sont eux qui cascadent ensuite a tout le service. On forme au management d'agents IA avec Claude Code, sur vos propres exemples, pas sur des slides generiques.
  - Back-office RH automatise. On construit et on opere des outils sur vos taches repetitives : tri et premiere reponse aux candidatures, reponses aux questions paie recurrentes, checklist d'onboarding qui se declenche seule, capture et suivi des demandes internes multi-canal. Paul fait le prototype, Yukun la mise en production. On livre la chose qui tourne, supervisee par un humain.
  - Pills : Kick-off presentiel + cascade par referents · Cas d'usage tires de votre quotidien RH · Outils qui tournent, pas un PowerPoint · Humain a la gachette sur chaque process sensible

**Offre + cas ancré** : Offre Parrit = Formation au management d'agents IA (format Enablement & Cascade) couplee a un sprint Transformation IA sur un front back-office RH. Cas reel anonymise qui resonne : une marque de soin bebe ou Parrit a forme les equipes par cascade (kick-off presentiel devant une quarantaine de personnes, puis referents internes rendus autonomes qui ont diffuse a tout le service) sur des cas d'usage de leur propre activite. Cas complementaire : un distributeur sport ou la formation s'est faite en hackathons hands-on (les equipes construisent leurs propres agents). Pour le back-office, ancrage sur le cas coutellerie artisanale (capture multi-canal + relances segmentees automatisees) transpose au flux de candidatures et demandes internes RH.

**CTA** : Reserver 15-20 min en visio avec Paul pour cadrer un kick-off et identifier le premier cas d'usage RH

**Détection** : Mots-cles : formation IA equipes, acculturation IA, montee en competence, adoption IA RH, cascade, referents · Vocabulaire conduite du changement : embarquer, ne pas braquer, peur pour les postes, COMEX, GEPP, plan de formation · Page d'entree : pages formation / academy / management d'agents IA · UTM ou referrer : LinkedIn (post sur la formation au management d'agents), recherche 'former mes equipes a l'IA' · Conversation mentionnant onboarding, tri de CV, paie, candidats, conformite sociale

**Critères d'acceptation** :
  - [ ] Le diagnostic affiche les deux leviers (montee en competence par cascade + back-office RH) en mini-schemas de flux, avec un cas d'usage RH concret nomme (ex : tri/reponse candidatures ou checklist onboarding) et non une promesse generique
  - [ ] Au moins un cas reel anonymise pertinent pour la RH est mobilise (cascade par referents devant ~40 personnes, ou hackathons hands-on) sans aucun nom de client ni prix affiche
  - [ ] Le parcours rassure explicitement sur l'emploi (l'IA enleve le repetitif, l'humain reste a la gachette) et se conclut par le CTA visio 15-20 min, le texte passant LE TAMIS (sobre, faits, zero pathos, pas de tiret cadratin)


### DSI / CIO (systemes d'information)
*Segment : direction-grand-groupe*

**User story** — En tant que DSI d'un groupe a SI critique, je veux deployer des agents IA agnostiques (modele et cloud au choix) qui orchestrent les process satellites autour de mes systemes proprietaires sans jamais toucher au coeur, avec environnements separes, journaux d'audit et acces controles, afin de capter la valeur de l'agentique tout en gardant la donnee chez moi, la conformite intacte et mes equipes autonomes pour operer la chose.

**Job-to-be-done** : Mettre l'agentique au service des metiers SANS perdre le controle : que la donnee reste chez nous, que ca s'integre au SI existant, que ce soit agnostique du fournisseur (pas de vendor lock-in), gouverne, auditable, et que ce soit mes equipes qui sachent operer la chose une fois livree.

**Douleurs (leurs mots)** : Le COMEX veut de l'IA partout demain, moi je porte la responsabilite si une donnee fuit ou si la prod tombe · Les equipes contournent deja le SI avec ChatGPT grand public : du shadow IT que je ne maitrise pas et qui exfiltre de la donnee · Tout le monde me pousse un produit SaaS proprietaire : je refuse de remplacer un lock-in par un autre, je veux rester agnostique du modele et du cloud · Les POC ne passent jamais en prod : ca reste hors-sol, pas integre au SI, pas gouverne, et personne en interne ne sait le maintenir · On me parle d'agents mais on touche a mes systemes coeur : impensable sans environnements separes, journaux d'audit et acces controles

**Langage / vocabulaire** : souverainete, agnostique / vendor lock-in, integration au SI existant, shadow IT, gouvernance / RACI / comitologie, la donnee reste chez nous, environnements separes, journaux d'audit / tracabilite, acces controles / RBAC, dette technique, systemes coeur vs satellites, Vertex AI / Bedrock / Azure OpenAI / modele souverain, passage en prod / industrialisation, couches logicielles internes proprietaires, revue d'alignement

**Entrée** : Arrive en evaluateur prudent : recherche du type 'IA agentique souveraine entreprise', 'agents IA sans vendor lock-in', 'integration agents IA SI existant', ou via une recommandation d'un pair / un membre du COMEX qui a vu une demo. Veut comprendre l'archi avant de parler offre.
  - 1ʳᵉ phrase type : « Je suis DSI. Avant tout : ou vit la donnee, qui detient le code, et est-ce que ca s'integre a mon SI sans que je sois enferme avec un fournisseur ? »
  - Chips : La donnee reste-t-elle chez nous ? · Vous etes agnostique sur le modele et le cloud ? · Comment vous ne touchez pas a mes systemes coeur ? · Mes equipes pourront-elles l'operer apres ?

**Diagnostic (On regarde votre SI sur deux leviers : ce qu'on automatise EN PERIPHERIE (les process satellites), et comment on garde le controle DESSUS (gouvernance, souverainete, agnosticisme). On ne touche jamais le coeur.)** :
  - Periphérie automatisee, coeur intact : on deploie les agents sur les process satellites autour de vos systemes proprietaires (capture multi-canal, veille, qualification de dossiers, support de niveau 1, reporting) et jamais sur les ecritures / transactions du coeur. Concretement : environnements separes, journaux d'audit sur chaque action d'agent, acces controles, et le code d'orchestration tourne chez vous, sur vos serveurs. Exemple anonymise : pour une banque en zone reglementee, premiere brique = une veille reglementaire automatisee sur de la donnee 100% publique, zero exposition de donnee sensible, le temps de mettre la gouvernance d'accord.
  - Agnostique de bout en bout + transfert aux equipes : le modele (Vertex AI, Bedrock, Azure OpenAI ou souverain) et l'orchestration sont a votre main, une seule fonction a repointer, zero lock-in. Et on ne livre pas un boitier noir : on FORME vos equipes pour qu'elles operent et fassent evoluer la chose en interne. Exemple anonymise : un groupe qui voulait une capacite IA interne plutot que de sous-traiter a fait monter deux de ses talents pendant qu'on construisait, pour qu'a la fin ce soit leur outil, sur leur stack.
  - Pills : La donnee reste chez vous · Agnostique modele + cloud · Coeur jamais touche, satellites automatises · Audit + acces controles · Vos equipes operent apres

**Offre + cas ancré** : Offres Parrit qui resonnent : Transformation IA (pilote integre + revue d'alignement) + Management d'agents IA + Formation au management d'agents IA, en format Sprint avec passage en prod par le binome proto/mise en prod. Cas reel anonymise qui parle a ce persona : une banque universelle en zone fortement reglementee qui voulait une capacite IA INTERNE (former ses propres talents plutot que sous-traiter) et une automatisation strictement satellite du coeur bancaire, demarree par une veille reglementaire sur donnee publique pour ne creer aucune friction Conformite. Aussi : un cabinet d'avocats avec veille automatisee + bot de supervision humaine, qui montre la gouvernance avec un humain a la gachette.

**CTA** : Une visio de 15 a 20 minutes : on cartographie 2 ou 3 process satellites candidats et on cadre l'archi (souverainete, agnosticisme, audit) avant tout engagement.

**Détection** : Requetes / mots-cles : 'IA agentique souveraine', 'agents IA sans vendor lock-in', 'integration agents SI', 'gouvernance IA', 'shadow IT IA' · Vocabulaire dans la conversation : souverainete, agnostique, RBAC, journaux d'audit, environnements separes, dette technique, systemes coeur, passage en prod · Premieres questions orientees risque/controle (ou vit la donnee, qui detient le code, conformite) plutot que prix ou delai · Referrer / page d'entree : pages archi, securite, ou arrivee depuis une recommandation interne (COMEX, pair) plutot que depuis un canal grand public · Email pro en .com d'un grand groupe / ETI, signature DSI-CIO-RSSI ; intention B2B grand compte

**Critères d'acceptation** :
  - [ ] Le parcours affirme explicitement, sans qu'on le demande, les trois invariants DSI : la donnee reste chez vous, agnostique (modele + cloud, zero lock-in), le coeur n'est jamais touche (uniquement les satellites, avec audit + acces controles)
  - [ ] Le diagnostic montre le COMMENT concret (environnements separes, journaux d'audit, une fonction d'orchestration a repointer, transfert aux equipes) et non une promesse, avec au moins un cas reel anonymise (banque souveraine / cabinet d'avocats) sans nom client ni prix
  - [ ] Le CTA propose une visio 15-20 min de cartographie + cadrage archi (pas un devis ni une demo generique), et le ton passe LE TAMIS : sobre, factuel, zero pathos, zero tiret cadratin


### Directeur commercial (CCO / Sales)
*Segment : dirigeant-pme*

**User story** — En tant que directeur commercial d'une PME B2B, je veux une machine qui detecte en continu les signaux d'achat sur mon marche et declenche un outreach personnalise au bon moment, afin que mes commerciaux recoivent des RDV qualifies a appeler au lieu de prospecter a froid.

**Job-to-be-done** : Faire tomber plus de RDV qualifies dans l'agenda de mes commerciaux sans embaucher trois SDR, en arretant de prospecter dans le vide : detecter les signaux d'achat, frapper au bon moment avec le bon message, et liberer mes vendeurs pour le closing.

**Douleurs (leurs mots)** : Mes commerciaux passent la moitie de leur temps a chercher des leads et a copier-coller des sequences au lieu de vendre · Ma prospection part dans le vide : on contacte des gens qui n'ont aucune raison d'acheter maintenant, taux de reponse au ras des paques · Je n'ai aucune visibilite sur les signaux d'achat (changement de poste, levee, recrutement, prise de parole) avant mes concurrents · Les outils d'IA qu'on a teste crachent des emails generiques qui sentent le robot et brulent la delivrabilite · Mon pipeline est en dents de scie, je ne sais pas d'ou viendra le CA du trimestre prochain

**Langage / vocabulaire** : RDV qualifies, pipeline, taux de reponse, signaux d'achat, SDR / BDR, outbound, cold email, delivrabilite, ICP, cadence / sequence, taux de transformation, cout d'acquisition, ramp, no-show, closing, quota

**Entrée** : Arrive via une recherche du type 'automatiser la prospection B2B / generer des RDV qualifies', un post LinkedIn de Paul sur l'outbound par signal, ou en bouche-a-oreille d'un autre dirigeant. Intention chaude : il cherche du resultat pipeline, pas une theorie.
  - 1ʳᵉ phrase type : « On a 6 commerciaux, je veux qu'ils arretent de prospecter dans le vide. Vous savez detecter les signaux d'achat et faire tomber des RDV qualifies sans que j'embauche deux SDR ? »
  - Chips : Detecter les signaux d'achat sur mon marche · Plus de RDV qualifies sans embaucher de SDR · Du cold email qui ne sent pas le robot · Liberer mes commerciaux pour le closing

**Diagnostic (Votre sujet, c'est deux leviers sur la meme chaine : faire arriver le bon signal, puis le transformer en RDV sans cramer vos commerciaux.)** :
  - Capter le signal et qualifier : on branche une veille continue sur votre marche (prises de parole en podcast/conference, changements de poste, recrutements, levees, evenements a decideurs) qui extrait pour chaque contact l'entreprise, le secteur, l'effectif, le contexte exact de ce qu'il a dit, score votre ICP, et n'envoie que l'or. Pour un courtier energie B2B on a branche ce type de pipeline signal vers RDV ; sur un acteur du voyage on a constitue un catalogue de 55 signaux verifies (lancements tarifaires, pics evenementiels, paniers abandonnes, mouvements concurrents) qui alimentent les campagnes.
  - Transformer sans brider le commercial : enrichissement du contact (email puis telephone en cascade), copy personnalisee dans votre voix ancree sur le signal frais (pas de generique), validation humaine d'un coup de pouce sur Telegram, puis livraison automatique. Les leads telephonables partent en file 'a appeler', les autres en sequence email avec delivrabilite preservee ; vos commerciaux recoivent des RDV a closer, pas une liste a debroussailler.
  - Pills : Veille signaux continue · Qualification ICP automatique · Copy dans votre voix, ancree sur le signal · RDV qualifies en file

**Offre + cas ancré** : Offre Transformation IA + Management d'agents IA, en format Sprint (1-5j) pour brancher la premiere boucle signal vers RDV, puis operation en continu (front 'business genere'). Cas reels qui resonnent (anonymises) : un courtier energie B2B pour qui on a construit la chaine signal vers outreach vers RDV qualifies ; un acteur du voyage pour qui on a bati un catalogue de signaux verifies alimentant des campagnes de retargeting et de declenchement ; et la mecanique interne Parrit elle-meme (la machine d'acquisition par signal podcast/evenement qu'on fait tourner sur notre propre pipeline).

**CTA** : Voir une boucle signal vers RDV branchee sur votre marche : 20 min en visio avec Paul, on regarde un signal reel de votre secteur de bout en bout.

**Détection** : UTM ou referrer LinkedIn sur un post outbound/signal · Page d'entree type /acquisition, /business-genere ou article 'prospection' · Mots-cles dans la conversation : RDV qualifies, pipeline, SDR, taux de reponse, signaux d'achat, outbound, delivrabilite, quota · Mentionne une equipe commerciale ('mes commerciaux', 'mon equipe sales', 'mes vendeurs') · Parle resultat chiffre (volume de RDV, taux de transfo, CA trimestre) plutot que techno

**Critères d'acceptation** :
  - [ ] Le diagnostic affiche les deux leviers en mini-schemas de flux (signal capte vers qualifie vers enrichi vers RDV) et nomme au moins un cas reel anonymise pertinent (courtier energie ou acteur voyage), sans aucun nom client ni prix
  - [ ] La copy parle la langue du CCO (RDV qualifies, pipeline, signaux d'achat, delivrabilite) et montre le COMMENT concret (veille, scoring ICP, enrichissement cascade, validation humaine) plutot qu'une promesse de volume
  - [ ] Le CTA propose un creneau de 20 min en visio avec un signal reel du secteur du visiteur, et le texte passe LE TAMIS (sobre, factuel, zero pathos, zero tiret cadratin)


### Directeur marketing (CMO)
*Segment : direction-grand-groupe*

**User story** — En tant que directrice marketing, je veux une usine de contenu qui produit a ma place dans ma voix de marque et qui rend ma marque visible dans les reponses IA, afin de tenir ma cadence editoriale multilingue sans gonfler mon equipe ni mon budget agence et de voir enfin si je suis citee.

**Job-to-be-done** : Produire plus de contenu de qualite, dans plus de langues, sans gonfler l'equipe ni l'agence, et faire en sorte que la marque soit citee par les moteurs de reponse (ChatGPT, Perplexity, Gemini, AI Overviews) tout en gardant la voix de marque et la mesure sous controle.

**Douleurs (leurs mots)** : Mon equipe passe ses journees a produire au lieu de penser, et on n'arrive jamais a tenir la cadence editoriale sur tous les canaux et toutes les langues · Je vois mon trafic SEO s'effriter pendant que les reponses IA captent les clics, et je ne sais meme pas si ma marque est citee par ChatGPT ou Perplexity · On a teste des outils de generation, ca sort du contenu plat qui ne ressemble pas a notre voix, je passe plus de temps a corriger qu'a creer · Je paye un freelance ou une agence chaque mois pour le contenu et ca ne scale pas, chaque langue ou canal en plus c'est une ligne de budget en plus

**Langage / vocabulaire** : GEO, AEO, etre cite par les IA, AI Overviews, share of voice, voix de marque, ton editorial, calendrier editorial, contenu a l'echelle, demand gen, MQL, attribution, personnalisation, localisation multilingue, pillar content, repurposing, trafic organique

**Entrée** : Arrive depuis une recherche du type 'comment etre cite par ChatGPT' ou 'GEO agence', un post LinkedIn de Paul sur la content factory, ou en testant le detecteur de bullshit IA partage par un pair. Intention : comprendre comment industrialiser le contenu et la visibilite IA sans sacrifier la qualite.
  - 1ʳᵉ phrase type : « On galere a produire assez de contenu de qualite et je ne sais pas si ma marque est citee par les IA. Vous faites quoi exactement la-dessus ? »
  - Chips : Etre cite par ChatGPT et Perplexity · Produire du contenu a l'echelle dans ma voix · Mesurer ma visibilite dans les reponses IA · Tester le detecteur de bullshit

**Diagnostic (Vous avez deux leviers a actionner en parallele, et le second sert le premier : la production et la visibilite.)** :
  - Production : une content factory qui part de votre matiere reelle (votre activite, vos sujets, vos sources verifiees) et la transforme chaque semaine en articles, posts et videos avatar, dans votre voix de marque et en plusieurs langues (FR, EN, PT-BR), avec capture email segmentee par sujet. Concretement on a deja monte ce moteur pour une marque de cosmetique : chaque membre de l'equipe devient maitre de l'outil au lieu d'en etre spectateur, et le specialiste qu'on mobilisait chaque mois n'est plus le goulot.
  - Visibilite : un moteur GEO/AEO qui mesure en continu si votre marque est citee par ChatGPT, Perplexity, Gemini et les AI Overviews, sur vos requetes cles, et qui boucle ce signal vers la production pour combler les trous. On est partis du meme constat sur notre propre marque : zero citation au depart, donc une boucle de mesure 24/7 puis du contenu de corroboration cible.
  - Pills : Articles + posts + videos / semaine · Voix de marque preservee · FR EN PT-BR · Suivi citations IA 24/7

**Offre + cas ancré** : Offre Transformation IA en mode usine de contenu, plus Management d'agents IA pour faire tourner la boucle GEO/AEO. Le cas reel anonymise qui resonne : une marque de cosmetique pour qui on a construit une content factory ou chaque equipe (marques, IT, RH, finance) devient maitre de ses outils plutot que spectateur, en remplacement du specialiste mobilise chaque mois. Pour la mesure de visibilite IA, on s'appuie sur notre propre moteur GEO 24/7 (on construit la chose qui tourne, on n'en parle pas) et sur l'absorption progressive d'un SaaS GEO vers une couche proprietaire.

**CTA** : Voir la content factory tourner et recevoir un premier audit de vos citations IA. Reservez 20 minutes avec Paul.

**Détection** : UTM ou requete contenant GEO, AEO, 'cite par les IA', 'AI Overviews', 'content at scale', 'agence GEO' · Referrer LinkedIn sur un post de Paul autour de la content factory ou du contenu IA · Page d'entree = detecteur de bullshit IA ou section Actualite du blog · Langage de la conversation : voix de marque, calendrier editorial, share of voice, MQL, repurposing, localisation multilingue · Email professionnel avec intitule marketing / brand / content / acquisition / growth

**Critères d'acceptation** :
  - [ ] Le diagnostic affiche un canvas a deux leviers (production de contenu et visibilite GEO/AEO) avec des mini-schemas de flux, sans citer aucun prix ni nom de client
  - [ ] Le diagnostic emploie le vocabulaire CMO (voix de marque, GEO/AEO, citations IA, multilingue, capture segmentee) et ancre sur le cas cosmetique anonymise et le moteur GEO interne
  - [ ] Le parcours propose le detecteur de bullshit comme preuve concrete et termine sur un CTA sobre vers 20 minutes avec Paul, avec un audit citations IA en accroche


### Directeur(rice) juridique / General Counsel (interne)
*Segment : dirigeant-pme*

**User story** — En tant que directeur juridique interne, je veux qu'un agent fasse la première passe sur mes contrats et ma veille réglementaire en gardant les données dans notre périmètre, afin de rendre mon temps au jugement juridique et d'arrêter d'être le goulot d'étranglement du business.

**Job-to-be-done** : Quand le volume de contrats à revoir et la pression conformité dépassent ce que mon équipe peut absorber, je veux automatiser la part répétitive de la revue et de la veille sans perdre la main sur le jugement juridique ni sortir nos données du périmètre, afin de tenir les délais business sans gonfler l'effectif ni externaliser la matière sensible.

**Douleurs (leurs mots)** : Je suis le goulot d'étranglement : tout contrat passe par moi ou mon équipe, et le business attend · La veille réglementaire me prend des heures et je rate quand même des textes qui nous concernent · Je revois les mêmes clauses standard cent fois alors que mon temps devrait aller sur les vrais risques · Je ne peux pas balancer nos contrats ou nos données dans un outil IA grand public, c'est mort côté confidentialité et RGPD

**Langage / vocabulaire** : revue de contrats, clauses à risque, conformité RGPD, veille réglementaire, première passe, données qui restent chez nous, privilège / confidentialité, le métier valide, fonction juridique, goulot d'étranglement, matrice de risque, redlining

**Entrée** : Arrive via une recherche du type 'automatiser revue de contrats IA' ou 'veille juridique automatisée', ou par bouche-à-oreille (un pair, un programme dirigeants type Catho/FLD), ou en cherchant comment utiliser l'IA sur du juridique sans risque conformité. Intention : prudente, exploratoire, teste si on comprend sa matière avant de parler.
  - 1ʳᵉ phrase type : « On reçoit trop de contrats à revoir et la veille me bouffe mes journées. Je veux voir ce que l'IA peut prendre en charge sans que nos données sortent et sans perdre la main sur le juridique. »
  - Chips : Automatiser la première passe de revue de contrats · Veille réglementaire qui ne rate rien · Garder les données dans notre périmètre · Voir comment un cabinet d'avocats l'a déjà fait

**Diagnostic (Votre fonction tient sur deux leviers : la matière qui rentre (contrats, demandes du business) et la matière qui change autour de vous (la réglementation). On automate la première passe des deux, vous gardez la décision.)** :
  - Première passe sur les contrats : un agent lit chaque contrat entrant, repère les clauses qui s'écartent de votre standard, marque les points à risque dans votre matrice, et vous remet un contrat pré-annoté. Vous ne lisez plus de zéro, vous arbitrez. Les fichiers restent dans votre périmètre, le modèle tourne sur l'infrastructure que votre DSI choisit (souverain, cloud privé, la donnée ne part pas).
  - Veille réglementaire qui remonte à vous, pas l'inverse : l'agent suit les sources qui vous concernent, filtre ce qui touche réellement vos contrats et votre activité, et pousse chaque signal trié sur une surface où vous validez d'un geste ce qui mérite une action. C'est exactement le mécanisme qu'on opère pour un cabinet d'avocats : veille automatisée plus un bot de supervision où l'humain garde le dernier mot.
  - Pills : Contrats pré-annotés · Clauses à risque signalées · Veille triée à valider d'un geste · Données dans votre périmètre

**Offre + cas ancré** : Offre Transformation IA en format Sprint (1-5 jours) pour cadrer et prototyper l'agent de revue sur vos propres contrats, plus Management d'agents IA pour opérer la veille en continu avec supervision humaine. Le cas réel qui résonne : un cabinet d'avocats pour qui on opère une veille juridique automatisée doublée d'un bot de supervision (l'humain valide chaque signal avant qu'il ne devienne une action). Sur le contrat, l'angle LegalTech analyse de clauses et conformité RGPD est le terrain naturel du Sprint.

**CTA** : Prendre 20 minutes en visio pour cadrer la première passe sur un de vos contrats types

**Détection** : Mots-clés de recherche : 'automatiser revue contrats IA', 'veille juridique automatisée', 'IA juridique confidentialité', 'analyse de clauses IA' · Langage dans la conversation : revue de contrats, clauses, RGPD, conformité, veille réglementaire, privilège, données qui restent chez nous · Page d'entrée orientée conformité / LegalTech ou cas anonymisé cabinet d'avocats · Referrer ou UTM lié à un programme dirigeants (FLD/droit, exec ed) ou réseau juridique · Insistance précoce sur la confidentialité et le périmètre des données avant de parler de fonctionnalités

**Critères d'acceptation** :
  - [ ] Le diagnostic affiche deux leviers concrets (première passe contrats + veille supervisée) avec un mini-schéma de flux pour chacun, sans aucun nom de client ni prix
  - [ ] La confidentialité et le maintien des données dans le périmètre du client apparaissent explicitement dès le diagnostic, sans avoir à les demander
  - [ ] Le cas anonymisé du cabinet d'avocats (veille + bot de supervision) est cité comme preuve du COMMENT, et le CTA propose une visio de cadrage de 15-20 min, pas un achat


### Directeur e-commerce (retail/grand groupe)
*Segment : direction-grand-groupe*

**User story** — En tant que directeur e-commerce d'une marque retail, je veux mesurer en continu si Amazon recommande mes produits quand un client interroge Rufus, savoir ou je decroche et obtenir les corrections exactes sur mes fiches, afin de defendre ma part de voix et ma conversion tout en absorbant le volume de service client et de relances sans grossir l'equipe.

**Job-to-be-done** : Quand un acheteur demande conseil a l'IA d'Amazon (Rufus) ou cherche un produit, je veux savoir si ma marque est recommandee, ou je decroche et qui gagne a ma place, et avoir les corrections exactes a appliquer sur mes fiches, pour proteger ma part de voix et ma conversion sans noyer mon equipe sous le volume de service client et de relances.

**Douleurs (leurs mots)** : Sur Amazon, les gens ne tapent plus de mots-cles, ils demandent a Rufus, et Rufus ne montre que ~5 produits : si je n'y suis pas je ne perds pas une position, je perds la vente, et personne ne sait me dire ou je suis absent · Mon service client encaisse des centaines de mails par jour, surtout en pic de saison, et mon equipe passe son temps a re-rediger les memes reponses au lieu de traiter les vrais cas sensibles · Je capture des leads sur trop de canaux (site, social, marketplaces, tel) et ca se perd : pas de relance segmentee, pas de vue unique · On me vend des audits GEO et des dashboards d'observation, mais a la fin personne ne me donne le fix concret a appliquer sur la fiche, et je ne sais pas si ca a bouge

**Langage / vocabulaire** : part de voix, taux de citation, Rufus, GEO Amazon, Buy Box, ASIN, fiche produit, attributs backend, A+ content, conversion, panier moyen, marge, saisonnalite / pics, service client a volume, marketplace, catalogue, MDD / by Amazon, share of voice

**Entrée** : Arrive par une recherche sur la visibilite Amazon / Rufus / GEO e-commerce (LinkedIn, recherche IA, bouche-a-oreille retail) ou par l'outil public detecteur de bullshit, avec une intention chaude : comprendre s'il est cite par l'IA d'Amazon et ce qu'il peut faire concretement.
  - 1ʳᵉ phrase type : « Je dirige le e-commerce d'une marque retail, on vend beaucoup sur Amazon. Est-ce que vous savez mesurer si Rufus recommande mes produits, et corriger mes fiches quand je decroche ? »
  - Chips : Mesurer ma part de voix sur Rufus · Ou je decroche et qui gagne a ma place · Automatiser mon service client en pic de saison · Relancer mes leads multi-canal sans les perdre

**Diagnostic (Vous avez deux fronts a tenir en e-commerce a volume : le front qui vous fait gagner des ventes (etre recommande la ou l'achat se declenche) et le front qui vous coute du temps (operer le service client et les relances sans noyer l'equipe). Parrit opere les deux.)** :
  - Visibilite Rufus, mesuree et corrigee, pas observee. On pose a Rufus les vraies questions de vos acheteurs par segment de catalogue et on note, question par question, si votre marque est citee et qui l'est a votre place : ca donne un taux de citation par segment. La ou vous etes absent alors que vous vendez ce produit, on sort jusqu'a 3 actions concretes copier-coller sur la fiche (renseigner un attribut backend, ajouter une Q&A qui repond a la question, corriger un titre ou un bullet), puis on re-mesure pour prouver que ca a bouge. Le systeme tourne en boucle, ajoute les requetes manquantes et vous pousse un resume : il propose, vous validez, il ne touche jamais votre compte vendeur.
  - Le back-office a volume automatise. Le service client : on classe les centaines de mails entrants, on redige la reponse, et on n'escalade a un humain que les cas sensibles selon votre logique metier (un courtier energie B2B et un cabinet d'avocats tournent deja sur cette mecanique veille + supervision humaine). La capture de leads multi-canal (social, boutique en ligne, telephone) consolidee dans une base unique avec relances segmentees par typologie, comme pour une marque artisanale haut de gamme qui recuperait ses leads TikTok/Snap/boutique/tel eparpilles.
  - Pills : Taux de citation Rufus par segment · 3 fixes copier-coller par fiche, re-mesures · Service client : trier, rediger, escalader l'humain · Leads multi-canal -> base unique + relances segmentees

**Offre + cas ancré** : Offre Transformation IA + Management d'agents IA, ancree sur le cas e-commerce reel de Parrit : un outil qui mesure la part de voix d'une marque cafe sur Rufus segment par segment, identifie ou elle decroche face aux concurrents et livre les 3 corrections exactes sur chaque fiche, avant de recommencer tout seul. Complete par le back-office automatise (service client a volume facon classify -> draft -> escalade humaine, et capture leads multi-canal + relances segmentees facon coutellerie haut de gamme). Pour un grand groupe : pilote + revue d'alignement, agnostique (Vertex/Bedrock/Azure/souverain au choix de leur DSI, la donnee reste chez eux).

**CTA** : Voir une mesure reelle sur votre catalogue : 15-20 min en visio pour lancer un premier scan de votre part de voix Rufus

**Détection** : Mots-cles de la conversation : Rufus, GEO Amazon, part de voix, taux de citation, fiche produit, ASIN, Buy Box, A+ content, conversion, service client a volume, saisonnalite, marketplace · Page d'entree : landing GEO e-commerce / Rufus, ou referral depuis l'outil public detecteur de bullshit · UTM/referrer : LinkedIn retail/e-commerce, recherche IA sur la visibilite Amazon, contenu de la content factory sur le GEO · Langage : raisonne en marges, panier moyen, pics de saison, volume de tickets, catalogue et marketplace plutot qu'en lead gen pure

**Critères d'acceptation** :
  - [ ] Des l'entree, le diagnostic affiche les deux fronts e-commerce (visibilite Rufus mesuree+corrigee / back-office service client+leads) en mini-schemas de flux, sans aucun prix ni nom de client
  - [ ] Le diagnostic montre le COMMENT concret : taux de citation par segment, 3 actions copier-coller par fiche, re-mesure, et tri/draft/escalade humaine pour le service client, pas une promesse generale
  - [ ] Le parcours propose un premier scan reel de la part de voix Rufus sur le catalogue du visiteur et un CTA visio 15-20 min, en restant sobre (zero pathos, zero tiret cadratin, anonymisation des cas)


### Directeur de la transformation / Innovation
*Segment : direction-grand-groupe*

**User story** — En tant que Directeur de la Transformation d'un grand groupe, je veux un cadre pour deployer l'agentique de maniere gouvernee a travers mes entites et rendre mes equipes autonomes pour en produire et en operer, afin de transformer des process reels mesurables plutot que d'accumuler des POCs sans suite.

**Job-to-be-done** : Sortir l'agentique de l'effet vitrine (des dizaines de POCs qui ne tournent pas en prod) pour la déployer de façon gouvernée et mesurable à travers les entités, en montant les équipes en autonomie sans dépendre d'un prestataire sur la durée et sans laisser proliferer du code et des agents non maitrises.

**Douleurs (leurs mots)** : On a un cimetiere de POCs : ca demo bien, ca ne passe jamais en production ni a l'echelle · Chaque entite fait sa popote dans son coin, je n'ai aucune visibilite ni gouvernance sur ce qui est deploye · On genere du code et des agents tres vite, mais je n'ai pas le cadre pour savoir lesquels sont fiables, conformes et maintenables · On me demande le ROI et l'adoption reelle, je n'ai que des chiffres d'usage de ChatGPT, pas des process transformes · Je ne veux pas re-signer un cabinet tous les ans : il faut que mes equipes sachent faire seules · La DSI et la conf veulent garder la donnee en interne et rester agnostiques sur le cloud

**Langage / vocabulaire** : passer a l'echelle / scaler au-dela des POCs, industrialiser, enablement transverse, gouvernance de l'adoption, couches logicielles internes proprietaires, pilote + revue d'alignement, agnostique (Vertex / Bedrock / Azure / souverain), la donnee reste chez nous, monter les equipes en autonomie, adoption reelle vs usage, cas d'usage prioritaires, cascade, centre d'excellence / CoE

**Entrée** : Arrive le plus souvent par une recherche orientee enablement / scaling agentique grand groupe, ou par une recommandation d'un pair dirigeant, ou apres avoir teste l'outil public (detecteur de bullshit) et clique vers le site. Intention : evaluer un partenaire capable de l'aider a passer de l'experimentation a l'industrialisation gouvernee, pas un enieme cabinet de conseil.
  - 1ʳᵉ phrase type : « On a une trentaine de POCs IA dans le groupe et presque rien en production. Je cherche comment industrialiser l'agentique de facon gouvernee a travers nos entites et rendre nos equipes autonomes. Comment vous procedez concretement ? »
  - Chips : Passer nos POCs a l'echelle · Gouverner l'adoption sur plusieurs entites · Rendre nos equipes autonomes (enablement) · Garder la donnee en interne (agnostique)

**Diagnostic (A votre niveau, le passage a l'echelle se joue sur deux leviers complementaires : une preuve qui tient en production, et un cadre qui la rend reproductible et gouvernable a travers vos entites. On commence petit et reel, on ne couvre pas tout le groupe d'un coup.)** :
  - Le pilote qui tient en prod. On prend un cas d'usage prioritaire d'une de vos entites, sur vos couches logicielles internes (pas une demo hors-sol), et on le fait tourner avec Claude Code : du process reel automatise, pas un slide. Paul cadre et prototype, Yukun met en production. Agnostique : Vertex, Bedrock, Azure ou souverain selon votre DSI, la donnee ne sort pas de chez vous. On instrumente l'adoption et l'effet sur le process des le depart, pas seulement l'usage.
  - L'enablement gouverne, en cascade. On forme vos equipes au management d'agents IA en hands-on (elles construisent, on accompagne), et on pose la revue d'alignement : comment un agent passe du proto a la prod, qui valide, comment on garde la main sur le code genere vite, comment chaque entite reutilise le socle sans repartir de zero. C'est le passage du prototype isole a une pratique gouvernee que vous pilotez.
  - Pills : Pilote en prod sur un cas reel · Enablement hands-on en cascade · Revue d'alignement (proto -> prod gouverne) · Agnostique, la donnee reste chez vous

**Offre + cas ancré** : Combinaison Transformation IA (sprint sur un cas d'usage prioritaire pour produire le pilote qui tient en prod) + Management d'agents IA + Formation au management d'agents IA en cascade, le tout cadre par une revue d'alignement. Cas reels anonymises qui resonnent : un groupe de luxe ou l'on a deploye de l'agentique sur les entites avec une revue d'alignement (le COMMENT du scaling gouverne) ; un retailer mode forme en hands-on et un distributeur sport via des hackathons supervises de creation d'agents (l'enablement transverse qui rend les equipes autonomes). Demonstration vivante : le site lui-meme est opere par des agents et une content factory qui publie le travail reel chaque jour, plus l'outil public detecteur de bullshit.

**CTA** : Reservez 15 a 20 minutes en visio avec Paul pour cadrer un cas d'usage pilote et la revue d'alignement.

**Détection** : Page d'entree ou parcours autour de l'enablement / scaling / gouvernance de l'adoption (vs page Academy grand public ou page owner-PME) · Langage de la conversation : 'POCs', 'a l'echelle', 'industrialiser', 'gouvernance', 'plusieurs entites/marques', 'agnostique', 'la donnee reste chez nous', 'enablement transverse' · Referrer / UTM corporate (domaine grand groupe, signature d'une recommandation de pair, campagne ciblee C-level Data/IA) · Vocabulaire organisationnel : DSI, conformite, CoE, cascade, revue d'alignement · Vouvoiement et registre executif des le premier message (vs tutoiement Academy)

**Critères d'acceptation** :
  - [ ] Le diagnostic affiche le cadrage 'deux leviers' (pilote en prod + enablement gouverne en cascade) avec le COMMENT concret, sans aucun prix ni nom de client, sans tiret cadratin, et avec au moins un cas reel anonymise (groupe de luxe / retailer / distributeur sport)
  - [ ] La copy emploie le vocabulaire du persona (industrialiser, gouvernance de l'adoption, couches internes proprietaires, agnostique, la donnee reste chez nous) et adopte le vouvoiement registre executif, distinct du ton owner-PME 'coup de poing' et du tutoiement Academy
  - [ ] Le CTA propose un echange de 15 a 20 minutes en visio avec Paul oriente cadrage d'un cas d'usage pilote, et le canvas visuel rend les deux leviers en mini-schemas de flux

