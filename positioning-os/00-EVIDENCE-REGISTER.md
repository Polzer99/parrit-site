# 00 · Registre de preuve

Arrêté au 01/08/2026. Ce fichier ne raconte rien. Il classe.

Il ne remplace pas `~/positioning-research/` (le dossier de preuve, 33 700 mots). Il en extrait ce qui a le droit de peser dans une décision de positionnement, et il jette le reste.

## Ordre de confiance appliqué

1. Encaissements, contrats, factures
2. Systèmes réellement livrés et utilisés
3. Paroles directes de clients
4. Données comportementales et résultats mesurés
5. Propositions commerciales
6. Code et systèmes internes
7. Mémoire et notes
8. Doctrine et ambitions

Règle de dégradation : une affirmation ne peut pas être classée plus haut que sa source la plus faible. Une note de mémoire qui décrit un encaissement reste au niveau 7 tant que la facture n'est pas ouverte.

## Cinq états, jamais mélangés

| État | Définition opérationnelle |
|---|---|
| **PROUVÉ** | Niveau 1 à 3, au moins deux occurrences indépendantes, ou une occurrence bancaire |
| **OBSERVÉ, PAS ASSEZ RÉPÉTÉ** | Vrai une ou deux fois, jamais reproduit hors contexte personnel |
| **EN CONSTRUCTION** | Existe techniquement, ne produit pas encore de résultat mesuré |
| **HYPOTHÈSE** | Formulé, testable, jamais testé |
| **AMBITION** | Souhaité, ni testé ni testable en l'état |

---

# A. Ce que Parrit.ai a réellement vendu

## PROUVÉ (niveau 1)

| Ligne | Montant | Forme | Source |
|---|---|---|---|
| Gazelec (Brieuc Tertrais) | 3 000 € | setup borné | `revenue_events` `f31ec8e0`, `status=paid`, 22/04 |
| Laparra (Eric Godard-Durand) | 2 500 € encaissés sur accord global 7 500 € | CRM sur mesure | mail `19df96c142f4bac4`, 05/05 |
| Laparra formation Qualiopi | 2 640 € | formation financée | facture, 27/07 |
| Didier Barbanneau | 2 000 € | pack 8 h hands-on | signé 20/05 |
| Joone (César Caulliez) | montant à recaler | **forfaits de 10 h, à chaque fois** | F-2026-034, 12/06 |
| Clevery Avocats | montant non lu | Operating System IA | F-2026-036, 14/07 |
| June (Cameroun) | 2 500 € | seul deal du voyage | non tracé en base |

**Agrégat bancaire, quatre mois** : 33 369 € encaissés, moyenne 8 342 €/mois, amplitude ×7 entre juin (2 631 €) et mai (18 581 €). Solde au 29/07 : 150 €.

**Ce que ces sept lignes ont en commun** : ce sont des **objets bornés, payés une fois**, vendus à quelqu'un qui pouvait signer seul. Aucune n'est un abonnement.

**Récurrent confirmé en banque : 0 €.** C'est le chiffre le plus important du registre, parce que trois documents internes construisent un plan de revenu par-dessus.

## HYPOTHÈSE ou AMBITION (jamais vendu)

Diagnostic 3-10 k€ · Sprint d'impact 9,5-14,5 k€ · Fractional AI Operator 4 k€/mois · FDE 20 k€/mois · Séminaire 25 k€ · super app vendue · abonnement de valeur · offre développeurs (audience citée, offre jamais écrite).

Ces cinq premières lignes sont exactement les cinq offres produites par le deep research de juin, suivi « littéralement ». Zéro signature en six semaines. **Le problème de juin n'était pas la connaissance du marché : c'était la conversion d'une analyse en objet achetable.**

## Interdits de manipulation

- Pipe déclaré 132 166 € (Botswana 50 k, IUC 25 k, NAOS 14,4 k) : niveau 5, **jamais un encaissement**.
- 16 propales chiffrées, 49 codes d'accès : niveau 5 et 6. Une propale envoyée n'est pas une demande du marché.
- Références des sociétés partenaires : elles n'appartiennent pas à Parrit.ai et ne peuvent pas servir de preuve de livraison Parrit.

---

# B. Ce que les clients ont réellement utilisé

## PROUVÉ (niveau 2 + 3)

| Client | Objet en usage | Depuis | Trace |
|---|---|---|---|
| Clevery | 3 cartes Telegram/jour + veille lundi 7h30 | 26/04 | cron n8n `dEkeKknH5LTdqAMw`, 289 clients en base, `clevery_relance_events` avec auteur de chaque décision |
| Didier | digest veille PE, lundi 8h | 23/05 | workflow n8n 40 nœuds, classé GARDE le 27/07 |
| EFI / Brieuc | reply pipeline + mail bi-hebdo | date non tracée | campagne Instantly `31680411` |
| Laparra | CRM front + back en production | 05/05 | VPS OVH client |
| Joone | prompts et ressources réutilisés par César lui-même | 28/07 | il redemande des forfaits |

**Le chiffre d'usage qui contredit la façade** : 851 cartes Telegram produites, **679 ignorées, 0 envoyée automatiquement**. Le client ne consomme pas de l'automatisation. Il consomme **un droit de veto exercé peu souvent**.

**Détail décisif, niveau 2** : chez Clevery, une règle de préséance écrite donne à Henri la priorité sur Paul. **C'est le seul cas prouvé du corpus où la boucle de décision a été transférée à un client.**

## Ce que personne n'a utilisé

`/diagnostic` productisé : **0 usage retrouvé sur 2 722 touchpoints**, alors que les deux diagnostics faits à la main ont converti. La ressource Heads of Sales promise publiquement dans une vidéo : jamais construite. La super app : aucun client ne l'a vue.

---

# C. Les processus que Paul comprend particulièrement bien

Classement par nombre de cas indépendants, pas par affinité déclarée.

| Processus | Cas | État |
|---|---|---|
| **Prospection / ciblage / qualification de fichier** | DREAL 47 691 lignes triées en 8 150 cibles selon la logique des formalités · EFI · Forexpert · Trainline ES-IT · Instantly · PhantomBuster | **PROUVÉ**, c'est le domaine le plus dense du corpus |
| **Suivi commercial et relance chez un cabinet de service** | Clevery (289 clients), Laparra (CRM + statuts), Joone | **PROUVÉ** |
| **Veille structurée pour un métier de niche** | Didier (3 lentilles PE Life Sciences), Clevery (veille juridique) | **PROUVÉ** |
| Production de contenu et d'artefacts commerciaux | 16 propales chiffrées, Content Factory, pipeline PDF | **PROUVÉ sur la fabrication**, non prouvé sur l'effet commercial |
| Back-office / ERP / opérations industrielles | Laparra (le seul), Toyotomi (deck) | **OBSERVÉ, PAS ASSEZ RÉPÉTÉ** |
| E-commerce | 8 propales, StoresDiscount, Estée Lauder, Kiabi, Vertbaudet | **0 signature. HYPOTHÈSE.** |

**Conséquence non négociable pour la suite** : la compétence métier la mieux prouvée de Parrit.ai n'est pas « l'IA ». C'est **la chaîne commerciale d'une entreprise de service founder-led**. Cinq des sept lignes vendues touchent à cette chaîne.

---

# D. Les projets qui ont créé un résultat opérationnel

**PROUVÉ** : Clevery (bot en production 3 mois, décisions tracées, Henri l'utilise seul). Laparra (CRM en production, statuts recalculés). Didier (digest livré chaque lundi). EFI (campagne qui tourne pour le compte du client).

**Nuance obligatoire** : sur ces quatre, **un est le cabinet du père de Paul** et un a **contesté le niveau de livraison** (Didier, 29/06 : « pas au niveau de ce qu'on avait validé »). Il reste donc **deux résultats opérationnels chez un client sans lien familial et sans contestation** : Laparra et EFI.

**Aucun gain client chiffré n'existe.** Aucun euro économisé, aucune heure gagnée, aucun taux de conversion amélioré n'est mesuré chez un client. Sur 90 jours de mails sortants, aucun n'a été inventé, ce qui est une discipline réelle, mais le résultat net est le même : **Parrit.ai ne peut prouver aucun ROI client.**

---

# E. Les missions qui ont produit de l'enthousiasme sans achat

C'est la catégorie la plus instructive du registre.

| Cas | Enthousiasme mesuré | Achat |
|---|---|---|
| **Hertman** | 47 691 lignes traitées avant le rendez-vous, **devis réclamé sous 24 h par le client lui-même** | **0 €.** Rappelle ensuite : pas de besoin pour le moment |
| Moët Hennessy DSI | sprint d'impact présenté | 0 |
| IPD | 5 jours du call à la propale, 13 000 € | silence depuis le 07/07 |
| IUC | devis émis | 21 jours sans relance, rien |
| Trainline | récap envoyé, **validé sur le fond par le client** | 39 jours, rien |
| Porte-à-porte | 11 commerces, 6 mails | 0 réponse |

**Règle tirée de Hertman, PROUVÉE par un contre-exemple** : *l'objet déjà construit fabrique de l'intérêt, il ne fabrique pas le besoin.* La démonstration remplace la qualification au lieu de la suivre. Elle produit un devis demandé, pas un devis signé.

**Motif net sur les cycles** : 0 intermédiaire = jours (Didier 10, Laparra le jour même). 1 comité = mois, ou rien (Trainline, IUC, IPD, Moët). Sans exception dans le corpus.

---

# F. Ce qui dépend encore de Paul

**Totalement** : traduire une situation floue en objet technique (C1) · la démo live, qui ne fonctionne que parce que la compétence technique et la parole commerciale sont dans le même corps · lire un interlocuteur en temps réel (trois pitchs différents en une après-midi) · l'infrastructure · toutes les corrections.

**Le goulot commun à quatre capacités sur dix n'est pas une compétence, c'est un accès** : clé SSH de Maxime en attente, prod Laparra qui refuse la clé de Paul, credentials n8n à ressaisir, shell refusé sur la machine de production. Sept actions techniques attribuées à Maxime le 27/07, zéro visible le 28/07 au soir.

---

# G. Ce qui peut être repris (agents, Maxime, partenaires)

| Capacité | Repreneur réaliste | État |
|---|---|---|
| Documentation et transfert (C8) | agents | **la mieux transmissible**, outillage déjà écrit |
| Formalisation du tacite en règle exécutable (C2) | agents, déclenchement par Paul | outillé (`consolidation-gate`, `skill-ingest`) |
| Construction de prototype (C3) | Codex via `codex-handoff.sh` | pont existant, protocole écrit |
| Production d'artefacts commerciaux (C10) | agents | outillage complet |
| Connexion de systèmes (C4) | Maxime | **bloqué par l'accès, pas par la compétence** |
| Distribution, angle, perception | Maxime | son périmètre déclaré |
| Traduction du besoin (C1), démo live | **personne aujourd'hui** | classé non délégable au canon |

---

# H. Ce qui rend une mission rentable ou non

**AUCUNE MATIERE chiffrée.** `v_marge_projets` existe avec les bonnes colonnes, ses quatre lignes sont à NULL et concernent des projets de test. Aucun suivi d'heures réelles. **La marge par mission est inconnue.**

Ce qui est **observé** sans être chiffré :

- Rentable : un interlocuteur unique · un périmètre borné écrit avant de commencer (Joone : « enablement ≠ build », le seul écart maîtrisé du corpus) · un objet réutilisable d'un client à l'autre.
- Non rentable : le comité · la garantie de résultat écrite pour vendre vite, devenue levier de renégociation à la livraison (Didier) · le déplacement long (Cameroun : 7-8 semaines, 25 prospects, 1 signature de 2 500 €) · le temps d'infra de Paul, nommé « deux fois perdu » puisqu'il devra être repris.

**Coût de trésorerie du non-recouvrement** : 41 775 € considérés perdus sur 17 factures. C'est **plus que le chiffre encaissé sur les quatre mois étudiés.** Le problème de revenu de Parrit.ai n'est pas seulement un problème de vente.

---

# I. Comportement commun des clients qui donnent les accès

Cinq traits, chacun vérifié sur au moins deux clients payants.

1. **Une seule personne décide et paie.** Sept lignes vendues, sept fois un décideur unique.
2. **Confiance préexistante.** Les quatre premiers deals viennent du réseau personnel direct. Le froid : 476 envois Instantly, **0 réponse**, 0 deal, jamais.
3. **Il demande le contrôle avant l'envoi, avec ses propres mots.** Laparra : « qu'on valide, qu'on certifie ». Joone : « comme un stagiaire, on va tout vérifier avant que ça parte ». Overlord : « on valide ensemble ». Trois entreprises, quatre mois, la même demande jamais suggérée par Parrit.
4. **Il a un volume mesurable de friction**, pas une envie d'IA.
5. **Il accepte que son diagnostic de départ soit contredit.**

**Le trait le plus discriminant reste l'accès aux données.** Sans lui, rien ne se construit, et il n'est jamais accordé par une organisation à comité dans le corpus.

---

# J. Quand Parrit.ai devrait refuser

Chaque ligne est adossée à un cas réel qui a coûté quelque chose.

| Refuser | Parce que |
|---|---|
| Un dossier à comité sans sponsor unique qui signe | Trainline, IUC, IPD, Moët : quatre dossiers, zéro euro, des mois |
| Une démonstration avant qualification du besoin chiffré | Hertman : le geste le plus abouti du corpus, 0 € |
| Une garantie de résultat écrite pour accélérer la vente | Didier : la garantie est devenue le levier de la contestation |
| Un montage de formation sans session réelle | déjà refusé le 27/07, coût assumé 2 640 € avec 258 € en banque |
| Un prix bradé sous 1 500 € | plancher tenu deux fois, deals perdus, principe conservé |
| Une mission sans accès aux données ni référent interne nommé | condition d'échec commune à tous les dossiers enlisés |
| Un sujet où un cabinet porte la responsabilité finale | déjà refusé, à raison |
| Un client dont on ne peut pas mesurer le résultat | c'est ce qui empêche aujourd'hui toute preuve de ROI |

---

# Les six affirmations qui ne survivent pas au registre

À retirer de toute copy, propale ou décision tant qu'elles ne sont pas re-prouvées.

1. **« On vend l'autonomie. »** Zéro client autonome prouvé. Paul l'a lui-même relativisée le 30/07 : « des personnes veulent être autonomes, des personnes veulent qu'on fasse pour elles. » Le canon continue de l'écrire comme une promesse universelle.
2. **« Une vingtaine d'experts. »** Paul, plus Maxime en montée, moins Yukun qui sort le 31/08.
3. **« De l'IA qui agit. »** Les clients achètent une IA qui prépare et un humain qui signe.
4. **« Le récurrent est notre modèle. »** 0 € en banque. Les deux références citées au canon (Hertman 900 €/mois, Moppy 1 200 €/mois) sont infirmées : aucune facture, aucun virement.
5. **« L'e-commerce est notre verticale. »** 8 propales, 0 signature.
6. **« Nos automatisations apprennent. »** Zéro brique respecte la règle §45 qui l'exige.

# Les cinq faits qui doivent porter la décision

1. Sept ventes, toutes **bornées, payées une fois, à un décideur unique**, ticket 2 à 5 k€.
2. Le domaine métier le mieux prouvé est la **chaîne commerciale d'une entreprise de service founder-led**, pas « l'IA ».
3. Ce que les clients nomment spontanément et paient est **le droit de relire avant que ça parte**, et il a déjà été transféré à un client (Henri).
4. **Le comité tue.** Zéro exception.
5. **Aucun ROI client n'est mesuré**, et c'est ce qui bloque à la fois le prix, le récurrent et la preuve publique.

*Trois trous se ferment sans décision stratégique : ouvrir cinq PDF de facture (moins d'une heure, ferme la moitié de `VERITE-ARGENT`) · retirer prix et logos de `HomeDeux.tsx` · réparer l'ingestion qui empêche de savoir ce qui est parti.*
