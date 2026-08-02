# 02D · Audit des sources primaires

01/08/2026. Quatre agents Claude Code en parallèle, un run Codex, et du travail direct. Tout ce qui suit a été ouvert, pas cité.

---

## 1. Méthode

**Sources réellement interrogées.** Gmail MCP (~30 requêtes, ~25 threads ouverts, ~30 messages lus intégralement) · Supabase HISTORIQUE en lecture seule (12 requêtes) · n8n MCP (106 workflows listés) · le système de fichiers (PDF, docx, pages, CSV) · `docs/ARBITRAGES.md` (61 arbitrages) · `REGLES-DOR.md` (48 règles) · le dépôt `parrit-site`.

**Gmail : OUI**, utilisé pour la première fois du dossier. 25 threads ouverts sur 12 dossiers commerciaux.

**PDF ouverts : 10** (6 factures, 1 devis, 1 NDA, 1 convention, les CGV), plus 3 `.docx` et 2 `.pages` (page 1 seulement, format IWA non convertible).

**Contrats localisés : 6 documents contractuels distincts. Contrats signés confirmés visuellement : 0.**

**Workflows : 106 listés sur l'instance live, 35 actifs.** `get_workflow_details` a échoué sur les quatre workflows clients ciblés (`availableInMCP=false`) ; contournement par les JSON exportés, en signalant que disque et live divergent.

**Transcripts : 60 échantillonnés par script à graine fixe (`setseed(0.42)`), 41 lus intégralement, plus 14 transcripts à fort signal lus en entier.** Soit **55 lectures intégrales**, les premières du dossier. 19 de l'échantillon restent non lus, listés nommément.

**Codex** a produit l'inventaire déterministe des 114 JSON n8n. Deux réserves d'exécution : il a échoué au premier lancement (prompt attendu sur stdin) et il perd son MCP Supabase à l'authentification.

**Limites.** Aucun log d'exécution n8n ni GitHub Actions accessible : « dernière exécution réussie » n'est approché que par les tables en aval, ce qui ne distingue pas « rien à traiter » de « pipeline cassé ». Aucun accès SSH aux VPS clients. Les deux `.pages` Laparra ne sont lisibles qu'en page 1.

---

## 2. Dossiers commerciaux reconstitués

### EFI Énergies / Brieuc Tertrais (« Gazelec Moins Cher »)
**Le nom est faux.** Aucun thread « Gazelec » n'existe. Le dossier réel est EFI Énergies, contact Brieuc Tertrais, chargé d'affaires grands comptes. · **Origine** : hors mail. · **Offre réelle, lue dans le devis** : setup 3 000 € + outils refacturés au réel + **50 € HT par RDV qualifié**. · **Promesse chiffrée** : « 1 à 5 RDV qualifiés par jour ». · **Contrat** : aucun. Le devis porte `status: brouillon` et `date_envoi:` **vide**. · **Facture** : **aucun PDF n'existe**. · **Encaissement** : une ligne `revenue_events` à 3 000 €, `invoice_id` **NULL**, note « facture encaissée **d'après Paul** ». · **Livraison** : campagnes actives, pipeline de reply en production. · **Ce que le client fournit** : presque rien de traçable, un exemple de campagne partenaire repartagé deux fois à deux mois d'écart.
**Prouve** : que Parrit sait livrer et opérer un système d'acquisition. **Ne prouve pas** : l'encaissement. La seule ligne de revenu « dure » du corpus repose sur une note de mémoire, sans facture ni trace bancaire individuelle.

### Laparra (Eric Godard-Durand)
**Décideur** : Eric Godard-Durand, président, fils Antoine en copie. · **Contrat** : un accord de **confidentialité** signé le 20/05, pas un contrat commercial. Aucun devis chiffré dans les mails. · **Facture** : aucune. · **Livraison** : CRM livré fin mai sur Vercel, migration VPS annoncée fin mai, **toujours en cours fin juillet**. Identifiants livrés par mail en clair, mot de passe `12345678` pour les deux comptes. · **Ce que le client fournit** : les accès GESLOT/Synoméga le 25/06. · **Chantier ouvert** : l'intégration GESLOT n'est **toujours pas finie au 28/07**, deux mois après. · **Bascule du 27/07** : Yukun annonce son départ. Citation exacte : *« Je suis très déçue par ton comportement récent ainsi que par les valeurs que tu incarnes. Au vu de ces divergences fondamentales, il est désormais impossible pour moi de continuer à travailler gratuitement pour toi. »* Elle propose un mois de passation. · Le dépôt git du CRM montre un **dernier commit le 23/07, par elle**. · Au 31/07, Paul est toujours en contact direct avec le client malgré la passation annoncée à Maxime.
**Prouve** : un système livré, utilisé, en développement actif. **Ne prouve pas** : un euro. Et révèle que le principal actif technique client a été construit **gratuitement** par quelqu'un qui part.

### Didier Barbanneau
**Aucun thread de cadrage, aucun mail de signature, aucun montant.** Gmail ne contient que la phase d'exploitation. · 21/07, deux mails de Paul : « Pourquoi ta veille n'est pas partie », « pourquoi rien n'est parti » — incident. 27/07 : « sa veille est repartie, et elle a changé de logique », « il a raison sur la liste, c'est corrigé ». · Didier recharge lui-même son compte OpenRouter (27/07), donc **il porte son propre coût d'infrastructure**. · **Facture** : aucun PDF.
**Prouve** : un client qui tient une partie de sa propre infra, et qui corrige le produit. **Ne prouve pas** : le montant de 2 000 €, ni la garantie de résultat que le corpus lui attribue.

### Joone / NOO CORP (César Caulliez)
**Facture F-2026-034 ouverte** : émise 12/06, échéance 12/07, « Kick-off IA + ateliers référents (12h) », **2 160 € HT / 2 592 € TTC**. → **Ceci tranche l'arbitrage A41** : c'est 2 160 €, pas 1 530 €. · Compteur de forfait : 10 h, 4 h 30 consommées au 27/07. · 17/07, César demande une revue « en partant du **handover de Loris** » : Joone reprend le travail d'un prestataire précédent, fait absent de tout le corpus. · Périmètre en extension le 31/07 (« P&L analytics »). · **Aucun système technique livré** : uniquement des livrables d'enablement.
**Prouve** : la seule facture d'un client actif, ouverte et lue, avec son objet exact. **Ne prouve pas** : que l'enablement produit autre chose que du rachat de forfaits.

### Clevery / PGEE (Henri Larmaraud)
**La facture F-2026-036 n'est pas au nom de Clevery.** Elle est au nom de **PGEE**, contact Henri Larmaraud, objet « Legal OS », **3 000 € HT / 3 600 € TTC**, émise 14/07, échéance 13/08. · **Relation familiale confirmée par le corpus des mails** (signature « Ton papa »). · 19/06, Henri liste ses besoins lui-même : clause IA en convention d'honoraires, veille branchée sur la boîte mail, agent de priorisation entre lui, Jeanne et Fabienne, et un **VPS on-premise garantissant le secret professionnel**. Il interroge son assureur sur la couverture RCP de l'IA générative le même jour, **sans que Parrit le pilote**. · Un outil tourne bien en production : des mails « Votre to-do du 21/07 » partent de son adresse.
**Prouve** : un client qui exprime un besoin réglementaire précis et gère lui-même sa conformité. **Ne prouve pas** : que ce soit reproductible hors famille.

### June (Cameroun) et IPD
**AUCUN THREAD.** Requêtes essayées : « June Cameroun », « June Cameroun Parrit », « IPD », « IPD séminaire IA ». Aucune facture, aucun document. Les 2 500 € et les 13 000 € cités dans tout le corpus n'ont **aucune trace écrite retrouvable**.

### Hertman → **Guillaume HERT, Amplify Groupe**
Le nom lui-même était faux. · Origine : rencontre physique, mars. Un premier sujet (production documentaire Zoho) meurt sans suite après le 25/03. · **Devis DREAL envoyé le 05/05 : 2 900 € de setup + 600 € HT/mois, engagement 12 mois.** · Réponse du client le 06/05 : *« Super, merci pour la proposition. J'en parle avec mon associé et je reviens vers toi rapidement. »* · **Dernier message du thread. Aucune relance de Paul, jamais.**
**Correction majeure.** Le corpus raconte que le client a rappelé pour dire qu'il n'avait pas de besoin. **Les mails ne montrent pas cela.** Ils montrent une proposition chiffrée, une réponse positive d'attente, et un silence non relancé pendant trois mois. Et le fameux « 900 €/mois » vient d'une **V1 de devis rangée**, jamais envoyée. Le contre-exemple central de `02A` ne dit pas ce qu'on lui faisait dire : ce n'est pas « la démo ne crée pas le besoin », c'est **« personne n'a relancé »**.

### Trainline (Diego Borreguero) — **le dossier le plus important de l'audit**
27/07, Diego reformule lui-même ce qu'il veut acheter : *« I think the best approach would be to work with you as a consultant to train me or someone on the Trainline GTM team. You teach us how to build the workflow to capture b2b clients efficiently. »* · Réponse de Paul le même jour : **packs de 10 h, 2 500 € le pack, un à trois mois, résiliable chaque mois**, ce qui est livré reste au client. Livrables : un pipeline en production sur les comptes du client, une cartographie de signaux, le playbook et les enregistrements, des métriques avant/après, et un **« autonomy check »** en dernière session où la personne du client câble un nouveau signal seule. Citation exacte : *« If it does not pass, I keep going at no extra cost. »* Et : *« at the end, you or the person you pick runs a live B2B acquisition engine, and can build the next one without me. »* · Demande côté client : un owner nommé, 2 h par semaine. · 29/07, Diego : *« Thanks Paul, this is exactly what I needed. Let me check with the B2B team. »*
**Prouve** : que l'offre d'autonomie existe, qu'elle est écrite, chiffrée, garantie, et qu'**un client l'a demandée de lui-même avant qu'on la lui propose**. C'est la meilleure source primaire du dossier sur les décisions 8, 9, 12 et 13.

### IUC, Moët Hennessy, Lime London, NAOS
**IUC** : trois formules envoyées le 29/06 — 8 656 € / 25 000 € / 33 656 € — décision via DSI **et** COMEX. · **Moët** : proposition envoyée le 23/06 à deux contacts, **zéro réponse, jamais**. · **Lime London** : Kaan Tas, relation antérieure renouée. Démo n8n **déployée en direct pendant l'appel**. Méthode énoncée par Paul : *« I don't hand over a deck — I deploy the thing. »* Puis passage à une interlocutrice plus junior fin juin, Kaan décline le 01/07. Aucune propale chiffrée envoyée. · **NAOS** : le même rendez-vous reporté **quatre fois** en dix semaines, refroidi par un changement de gouvernance interne, aucun chiffrage.

---

## 3. Réalité contractuelle

**Documents trouvés : 6. Signés : 0.**

| Document | Statut réel |
|---|---|
| « Parrit AI Contrat.docx » et « Contrat Parrit AI.docx » | **Fichiers identiques**, contrat de sous-traitance avec exclusivité 24 mois et clause pénale 30 %. **Template 100 % vierge**, tous les champs `[●]` non remplis |
| Contrat d'apport d'affaires Adopte une IA | Daté 09/05/2024. **Lignes de signature vides**, Annexe 3 (commission) absente |
| NDA Toyotomi / Act-On Data | 5 pages lues. Noms tapés, **aucun paraphe visible**. Anomalie : **droit applicable algérien** pour deux sociétés françaises sur un appel d'offres français |
| Convention de formation Laparra | Marquée « Brouillon ». SIRET, dates, intitulé, échéancier **absents**. Case « signée » **non cochée**. 2 640 € HT confirmés |
| Deux `.pages` de confidentialité CRM Laparra | Deux fichiers **différents**. L'un nomme la société « **Paritt.ai** », coquille dans le nom propre. Signature non vérifiable, seule la page 1 est lisible |
| CGV Parrit.ai v1.0, janvier 2025 | **Le seul cadre de responsabilité qui existe.** Parrit.ai = coordinateur, obligation de **moyens** ; les sous-traitants sont seuls responsables techniquement ; responsabilité plafonnée au montant HT perçu |

**Responsabilité** : définie une seule fois, dans des CGV jamais opposées à personne. **Durée, propriété, maintenance, réversibilité, DPA** : néant, sauf la confidentialité (Laparra, Toyotomi). **Sécurité** : aucun engagement écrit, et une pratique contraire attestée (mot de passe en clair par mail).

**Le fait à assumer** : de l'argent a circulé — au moins une facture porte « payée » dans son nom de fichier — **sans qu'aucun contrat signé correspondant n'existe**.

---

## 4. Réalité des systèmes clients

| Client | Système | Actif | Utilisé | Décideur final | Dépendance à Paul | Coût connu | Payé | Résultat mesuré |
|---|---|---|---|---|---|---|---|---|
| Clevery | Bot Python sur VPS (**pas n8n**), crons système | Oui | Oui, mais **dernier événement 06/07**, dernière décision humaine **29/06** | Henri clique, mais la table **n'a pas de colonne d'auteur** | Forte | Non | F-2026-036 émise au nom de **PGEE**, échéance 13/08 | Non |
| Clevery | Veille juridique n8n `dEkeKknH5LTdqAMw` | **NON, inactif** depuis le 11/04 | Non | — | — | Non | Non | Non |
| Didier | Veille PE n8n, 40 nœuds, lundi 8h | Oui | Indéterminé | Client | Moyenne, il paie son OpenRouter | Non | Aucune facture | Non |
| EFI | GitHub Actions + n8n, **deux implémentations concurrentes** écrivant dans la même table | Oui, cron horaire | **`efi_forwarded_replies` : 28 lignes, dernier forward le 05/06** — 8 semaines de silence | Brieuc | Forte | Non | Aucune facture | Non |
| Laparra | CRM, dépôt git réel | Oui, dernier commit 23/07 | Oui | Client | **Portée par Yukun, qui part** | Non | Aucune facture | Non |
| Joone | **Aucun système technique** | — | — | — | Totale | — | 2 592 € TTC | Non |
| Hertman | `projects/dreal-transporteurs/` : **deux fichiers d'échantillon**, aucun script, aucun déploiement | Non | Non | — | — | — | Non | Non |

**Les sept états, appliqués.** Code existant : 6 sur 7. Workflow actif : 4. Exécution récente confirmée : 2 (Laparra, Didier). **Usage client constaté : 2** (Clevery jusqu'au 06/07, Laparra). **Valeur perçue mesurée : 0.** **Payé : 1** (Joone). Maintenu : 4, tous par Paul ou Yukun.

**Sur les 114 JSON du disque, zéro porte `active: true`** alors que l'instance live en compte 35 actifs. Les deux sources divergent, et le tri du 27/07 sur disque (`garde` 43, `non-repris` 45, `refaire` 12, `decide` 8 = 108) ne se réconcilie ni avec les 185 briques ni avec les verdicts de l'arbitrage A18.

---

## 5. Résultats de l'échantillonnage neutre

**Méthode reproductible.** `SELECT setseed(0.42)` puis `row_number() OVER (PARTITION BY source ORDER BY random())`, quotas fixes par source : terracall 41, whatsapp 5, plaud 4, gemini-meet 4, calendar_meeting 3, wispr 3 = **60**. Stratification à **une seule dimension, la source** ; le croisement par mois a été écarté (6 sources × 9 mois donnerait des strates trop fines pour n=60). Requête SQL et liste des 60 identifiants conservées dans le transcript de session.

**Lus intégralement : 41 sur 60.** Non lus : **19**, nommés — 3 plaud volumineux (`710a1a24` 134 727 car., `2d8eed7e` 67 350 car., `469ba178` 37 339 car.) et 16 terracall. Le plus long des non-lus, `c1ea8f1e` (14 603 car., appel entrant de 26 min), est le candidat prioritaire.

**Statistiques de base, jamais calculées auparavant.** Période réelle **01/12/2025 → 01/08/2026**. 1 754 lignes. **7 443 429 caractères**, moyenne 4 244.

**La découverte principale de tout cet audit.**

| Catégorie réelle | Lignes | % lignes | % volume | Moyenne |
|---|---:|---:|---:|---:|
| **Notifications téléphoniques automatiques (« Jarvis »)** | **1 141** | **65,1 %** | 52,7 % | 3 437 |
| **Réunions réellement transcrites** (plaud, gemini-meet, read-ai) | **215** | **12,3 %** | 39,9 % | 13 816 |
| Fragments WhatsApp | 146 | 8,3 % | 3,2 % | 1 619 |
| Autre | 139 | 7,9 % | 3,5 % | 1 855 |
| Entrées de calendrier | 80 | 4,6 % | 0,5 % | 428 |
| Dictées Wispr | 33 | 1,9 % | 0,3 % | 693 |

**Le corpus de 1 754 « transcripts » sur lequel repose tout le dossier de positionnement est à 65 % constitué de notifications automatiques d'analyse d'appels et de messages vocaux.** Le corpus de conversations réellement transcrites compte **215 documents**, pas 1 754.

C'est exactement ce que la recherche par mot-clé ne pouvait pas révéler : elle remontait les 215 documents utiles et laissait croire que le reste était de la même nature.

**Contradictions nouvelles.** Le champ `source` est corrompu : 60 valeurs distinctes au lieu de 6, parce que des `messageId` ont été concaténés dedans (« terracall (messageId `19db...`) »). Toute répartition par source jamais publiée est fausse. · Les fragments WhatsApp échantillonnés font 27, 36 et 42 caractères : ce ne sont pas des conversations. · `wispr` ne couvre que **deux jours**, les 23 et 24 juillet. · `calendar_meeting` s'arrête au 22/06. · `gemini-meet` s'arrête au 23/07.

**Biais confirmé** : la recherche par mot-clé ne remontait que ce qui était déjà cherché. **Biais infirmé** : le corpus n'est pas trop petit, il est **mal caractérisé**.

**Ce que la lecture des 55 transcripts a produit, et que rien d'autre n'aurait donné.**

- **Deux misattributions de `prospect_id` prouvées.** `943b2a89`, rattaché à Eric Godard-Durand (Laparra), contient en réalité une préparation du deal **IUC** mêlée à un enregistrement ambiant de vie privée Paul/Yukun. `68933d4f`, rattaché à Kaan Tas (Lime), porte entièrement sur l'expansion de **Joone en Chine** et ne mentionne ni Lime ni Kaan. Le champ n'est pas fiable pour du scoring ou de la relance.
- **`client_id` est NULL sur 100 % des lignes.** Aucun transcript n'est rattaché à un client.
- **Les trois entités les plus représentées ne sont pas des clients** : Serge Lebrun (65), Maxime Boué (54), Yukun Leng (41). **160 transcripts, environ 9 % du corpus, sont de la capture d'équipe et de vie ambiante.**
- **Le corpus est concentré** : 95 % des lignes sur mars-juillet 2026 (mars 149, avril 325, mai 421, juin 326, juillet 509).
- **Le défaut d'ingestion est confirmé une troisième fois.** La fiche Hertman porte « Backlog archivé 2026-06-16 (généré jamais envoyé +30j) » alors que Gmail montre le devis **envoyé le 05/05** et une réponse du client le 06/05. Après Trainline, c'est le deuxième cas où la base affirme un non-envoi démenti par le mail.
- **Deux dossiers absents de toutes les synthèses.** **Redsmite** (cjahan@redsmite.com, une réunion calendrier « Redsmite x Parrit.ai » et un enregistrement dédié) et **Chamas Ops / Riad Dhaouadi**, présent avec une décision actée (facture phase 2, formation calée) alors qu'il n'apparaît ailleurs que comme contentieux.
- **IUC, chiffres internes jamais écrits** : 25 000 € plus 900 €/mois de maintenance, et Paul envisageant à voix haute de basculer sur **2 000 €/mois sur 12 mois** plutôt qu'un one-shot. Arbitrage non tranché.
- **Sur Maxime, une phrase à porter au dossier** : Paul lui délègue la production IUC « pour qu'il monte en compétence », en disant aussi « si on lui donne du cash il va vouloir rester à plein temps ». C'est une décision de management énoncée, jamais écrite — à rapprocher du partage 50/50 non contractualisé d'A45.
- **« 3 à 5 semaines » est un chiffre-totem**, répété identique dans deux pitchs différents sans être recalculé. Même statut que « la semaine prochaine » : un argument, pas une mesure.
- **Lime est corroboré indépendamment** : dans une réunion du 16/03, Paul cite son « expérience en gestion de produit chez Lime » à un tiers. La décision 21 ne repose plus seulement sur le CV et l'export LinkedIn.
- **Une conviction récurrente, non commerciale** : « l'IA me fait gagner du temps » est un plafond de perception à casser, le vrai levier étant « l'IA crée de la valeur qu'on ne pouvait pas produire avant ». Tenue dans au moins deux contextes différents.
- **Le bruit est confirmé par la lecture** : sur 25 terracall lus, au moins 15 sont des messages vocaux de zéro à vingt secondes sans contenu.

---

## 6. Décisions dont le statut change

| Décision | Ancien statut | Nouveau statut | Nouvelle source | Pourquoi |
|---|---|---|---|---|
| 1 Identité | OBSERVÉ / HYPOTHÈSE | **HYPOTHÈSE** | `revenue_events` = 2 lignes ; `clients` = 1 ligne | Six des sept ventes n'ont aucune ligne de revenu ni facture |
| 2 Positionnement | CONTRADICTOIRE | **CONTRADICTOIRE, aggravé** | §39 de `REGLES-DOR.md` ; A43 | Il n'y a pas trois formulations mais **cinq**, dont la boussole §39 et le « droit de relire » d'A43, absentes de `02A` |
| 8 Modèle de relation | PROUVÉ build | **PROUVÉ, et enrichi** | thread Trainline 27/07 | Un client a demandé de lui-même le régime formation-puis-autonomie |
| 9 Durée | HYPOTHÈSE | **OBSERVÉ** | thread Trainline | Une durée écrite existe : packs de 10 h, 1 à 3 mois, résiliable mensuellement |
| 10 Produits d'entrée | CONTRADICTOIRE | **CONTRADICTOIRE, corrigé** | devis EFI ; facture F-2026-034 | Le pack d'heures est confirmé (Joone 2 160 € HT) ; le prix au résultat n'est plus « jamais proposé » |
| 11 Offre économique | HYPOTHÈSE récurrent | **CORRIGÉ** | devis EFI ; devis Hertman ; Trainline | Le prix au résultat (50 €/RDV) et le récurrent (600 €/mois) ont été **proposés**, jamais signés |
| 12 RUN / autonomie | CONTRADICTOIRE | **CONTRADICTOIRE, avec une preuve neuve** | Trainline ; `clevery_relance_events` | L'autonomie est écrite et garantie chez Trainline ; et la seule boucle transférée est muette depuis le 29/06 |
| 13 Responsabilité | AMBITION | **OBSERVÉ** | CGV v1.0 ; NDA ; convention | Un cadre existe (obligation de moyens, plafond au montant perçu) mais **n'a jamais été signé avec personne** |
| 14 Différenciation | PROUVÉ méthode | **AFFAIBLI** | `clevery_relance_events` | Le droit de relire n'est pas seulement non vendu : il n'est plus exercé depuis un mois |
| 17 Rôle de Maxime | HYPOTHÈSE | **HYPOTHÈSE, cause identifiée** | A24 ; mails de passation | Le blocage n'est pas une décision : **n8n Community interdit l'accès scopé**. Et A45 nomme un risque juridique non écrit (partage IUC 50/50) |
| 18 Partenaires | CONTRADICTOIRE | **CONTREDIT** | mail Yukun 27/07 ; A16 | Yukun travaillait **gratuitement**, part sur un désaccord de valeurs, et le serveur 187 est sur son compte |
| 19 Formation | OBSERVÉ | **OBSERVÉ, fragilisé** | convention brouillon | Le seul dossier de formation n'est ni daté, ni signé, ni chiffré dans son échéancier |
| 23 Refus | PROUVÉ | **CORRIGÉ** | thread Hertman | Le cas fondateur n'est pas un refus client, c'est une **absence de relance** |
| 24 Promesses | CONTRADICTOIRE | **AGGRAVÉ** | `llms-full.txt/route.ts` | Les prix ne sont pas seulement dans un composant, ils sont **servis aux crawlers IA** |

---

## 7. Décisions que l'histoire ne peut pas trancher

**Décision 12, le RUN se vend-il.** Aucun run n'a jamais été facturé ; les sources ne peuvent pas dire ce que personne n'a essayé. **Test** : proposer le run à un client existant. **Métrique** : signature. **Délai** : 30 jours. **Seuil** : 1.

**Décision 14, le droit de relire fait-il acheter.** Il n'a jamais été mis en avant dans une vente. **Test** : le placer en première ligne sur cinq approches. **Métrique** : taux de rendez-vous à volume égal. **Délai** : 30 jours. **Seuil** : supérieur à l'ouverture actuelle.

**Décision 4, le segment réglementé tient-il hors famille.** L'unique référence est le père du fondateur, et l'unique incident de sécurité connu (faille RLS colmatée le 28/07) porte sur ce même dossier. **Test** : cinq approches de cabinets sans lien. **Métrique** : accès aux données sous 7 jours. **Délai** : 45 jours. **Seuil** : 1.

**Décision 11, quel modèle de prix.** Trois modèles ont été proposés — forfait, récurrent, au résultat — un seul a produit un encaissement non documenté. **Test** : proposer les trois au même profil. **Métrique** : lequel se signe. **Délai** : 60 jours.

**Décision 27, l'amplitude se corrige-t-elle.** Aucune donnée historique ne le dira. **Test** : trois mois consécutifs au-dessus de 8 000 €.

---

## 8. Verdict

**Prêtes à être validées avec Paul.** 3 la cible comportementale · 8 le modèle de relation, désormais adossé à une demande client écrite · 9 la durée, avec un format existant · 13 la responsabilité, un cadre écrit à opposer ou à réécrire · 18 les partenaires, la question est tranchée par les faits · 21 le storytelling, noyau vérifié · 22 les valeurs démontrées · 23 les critères de refus, corrigés · 24 les promesses à retirer.

**Nécessitant encore une extraction.** Ouvrir Qonto et rapprocher facture par facture — aucune facture n'existe pour EFI, Laparra, Didier, June, IPD. · Ouvrir les deux `.pages` Laparra dans Pages.app pour savoir s'ils sont signés. · Obtenir les logs n8n et GitHub Actions : sans eux, on ne peut pas distinguer un pipeline muet d'un pipeline cassé. · **Lire les 215 vraies réunions transcrites** — c'est le corpus réel, il n'a jamais été lu. · Identifier « Loris », le prestataire dont Joone reprend le travail.

**Nécessitant un test marché.** Le run mensuel · le droit de relire comme argument · un cabinet réglementé hors famille · le prix au résultat · l'objet borné hors réseau.

**À retirer immédiatement.**
1. « 1 747 transcripts » comme preuve de matière : **65 % sont des notifications téléphoniques automatiques**, le corpus réel est de 215 réunions.
2. Le nom « Gazelec Moins Cher » : le client s'appelle EFI Énergies.
3. Le nom « Hertman » : l'interlocuteur s'appelle Guillaume Hert, société Amplify Groupe.
4. Le récit « Hertman a rappelé pour dire qu'il n'avait pas de besoin » : les mails montrent une proposition non relancée pendant trois mois.
5. « 900 €/mois Hertman » : c'est une V1 de devis rangée, jamais envoyée.
6. Le montant Joone « à recaler » : c'est **2 160 € HT**, facture F-2026-034 ouverte. A41 est tranché.
7. « F-2026-036 = Clevery » : la facture est au nom de **PGEE**.
8. Toute répartition des transcripts par source : le champ est corrompu.
9. « 185 briques » : irréconciliable avec les 108 fichiers triés sur disque.
10. Le réseau de partenaires comme actif Parrit : il appartenait à quelqu'un qui partait, et qui travaillait gratuitement.
