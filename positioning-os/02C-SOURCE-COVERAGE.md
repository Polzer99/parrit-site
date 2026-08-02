# 02C · Couverture des sources

Audit de l'exécution qui a produit `02A-VALIDATION-PACK.md`. Écrit le 01/08/2026.

**Avertissement de méthode, à lire avant le reste.** Le travail s'est fait en deux phases séparées par une compaction de contexte.

- **Phase 1 (avant compaction)** : exploration réelle de sources primaires, ayant produit `positioning-research/` (9 fichiers, 33 700 mots). Requêtes SQL sur Supabase, lecture de fichiers du dépôt, du CV, de l'export LinkedIn, du code du site.
- **Phase 2 (production de `02A`)** : aucune source primaire nouvelle n'a été ouverte. `02A` a été écrit à partir de `positioning-research/04`, `/05`, `/07` relus intégralement, du `POSITIONING-ONE-PAGER.md`, d'un `grep` sur `docs/ARBITRAGES.md`, et du contexte de phase 1 conservé sous forme résumée.

**Conséquence directe et non négociable : `02A` est adossé à des sources primaires par héritage, pas par vérification propre.** Les paragraphes qui suivent disent où cet héritage est solide et où il ne l'est pas.

L'inventaire ci-dessous a été établi **au moment de cet audit**, pas pendant la production de `02A`. Les colonnes « consulté » et « ouvert intégralement » couvrent les deux phases.


---

# MISE À JOUR DU 01/08/2026 — après l'audit des sources primaires (`02D`)

Les chiffres de ce fichier décrivaient l'état **avant** l'audit. Ils restent en dessous, à titre d'historique. Voici l'état réel après.

| Indicateur | Avant | **Après** |
|---|---:|---:|
| Transcripts inventoriés | 1 747 | **1 754** |
| Transcripts recherchables | 1 747 | 1 754 |
| **Transcripts ouverts intégralement** | 0 | **55** — 41 de l'échantillon neutre + 14 à fort signal |
| Transcripts échantillonnés par script à graine fixe | 0 | **60** (`setseed(0.42)`, stratifié par source, 41 lus / 19 non lus nommés) |
| Threads Gmail ouverts | 0 | **25** |
| Messages mail lus intégralement | 0 | **~30** |
| Requêtes Gmail lancées | 0 | **~30** |
| PDF ouverts | 0 | **10** (6 factures, 1 devis, 1 NDA, 1 convention, CGV) |
| Documents contractuels ouverts | 0 | **6** |
| **Contrats signés trouvés** | inconnu | **0** |
| Workflows listés sur l'instance live | 0 | **106**, dont **35 actifs** |
| Workflows inspectés en détail | 0 | **3 JSON** + **114 inventoriés par script** |
| Décisions avec ≥1 source primaire | 15 / 28 | **28 / 28** |
| Décisions avec contre-exemple recherché | 15 / 28 | **24 / 28** |
| **Décisions à couverture suffisante** | 3 / 28 | **12 / 28** |

**Ce que l'audit a corrigé dans ce fichier même.**

1. La ligne « Transcripts, 1 747 » de l'inventaire général était juste en nombre et **fausse en nature**. Le corpus est à **65,1 % constitué de notifications téléphoniques automatiques** (1 141 lignes, sujet « Jarvis »). Les réunions réellement transcrites sont **215**, soit 12,3 % des lignes mais 39,9 % du volume. Toute phrase de ce dossier qui présente « 1 747 transcripts » comme une masse de conversations est à retirer.
2. La colonne `source` est **corrompue** : 60 valeurs distinctes au lieu de 6, des `messageId` ayant été concaténés dedans. Toute répartition par source publiée jusqu'ici est fausse.
3. La période réelle est **01/12/2025 → 01/08/2026**, volume **7 443 429 caractères**. Ces chiffres n'avaient jamais été calculés.
4. La ligne « Contrats : 0 trouvé » était fausse. Il y en a **6**. Aucun n'est signé, ce qui est un fait différent et plus utile.
5. La ligne « Factures : 0 PDF ouvert » est corrigée : **10 ouverts**. Mais **aucune facture n'existe pour EFI, Laparra, Didier, June et IPD**, ce qui était le trou réel.

**Trous qui restent ouverts, non masqués.**

- **160 des 215 réunions réellement transcrites n'ont pas été lues.** 55 lectures intégrales ont eu lieu, dont 19 de l'échantillon neutre restent ouvertes — notamment trois enregistrements volumineux (`710a1a24` 134 727 car., `2d8eed7e` 67 350 car., `469ba178` 37 339 car.).
- **Aucun log n8n ni GitHub Actions.** On ne peut pas distinguer un pipeline muet d'un pipeline cassé : `efi_forwarded_replies` est figée depuis le 05/06 alors que le cron tourne toutes les heures.
- **Aucun rapprochement bancaire facture par facture.** Qonto n'a pas été ouvert.
- **Les deux `.pages` Laparra** ne sont lisibles qu'en page 1 : leur statut de signature reste indéterminé.
- **`get_workflow_details` refusé** sur les quatre workflows clients (`availableInMCP=false`), d'où un recours aux JSON disque, qui divergent du live.
- **Aucun accès SSH** aux VPS clients.
- **IPD et June restent introuvables** dans Gmail comme sur le disque : deux montants du corpus (13 000 € et 2 500 €) n'ont aucune trace.

**Trois défauts de données découverts par la lecture, et par elle seule.**

- **Deux misattributions de `prospect_id` prouvées** : un transcript rattaché à Laparra contient une préparation de deal IUC, un autre rattaché à Lime porte entièrement sur Joone. Le champ n'est pas fiable pour du scoring ni de la relance.
- **`client_id` est NULL sur 100 % des 1 754 lignes.**
- **Les trois entités les plus représentées sont internes** : Serge Lebrun 65, Maxime Boué 54, Yukun Leng 41. Environ **9 % du corpus est de la capture d'équipe et de vie ambiante**, pas du signal commercial.

**Réponses du §11, révisées.** (1) OUI. (2) OUI. (3) **PARTIELLEMENT** — 25 threads, 10 PDF et 55 transcripts ouverts, mais 19 de l'échantillon neutre restent non lus. (4) **OUI** pour les mails comme pour les transcripts lus. (5) **PARTIELLEMENT**, 24 sur 28. (6) **NON, inchangé** — le rapprochement reste au total mensuel. (7) OUI. (8) **OUI, mais 6 décisions au lieu de 13.** (9) **OUI** — 160 réunions non lues, les logs d'exécution, Qonto. (10) **PARTIELLEMENT**, 12 décisions sur 28 sont arbitrables en l'état.


---

## 1. Inventaire général

| Type de source | Emplacements découverts | Total | Indexé ou recherchable | Consulté | Ouvert intégralement | Période | Problèmes |
|---|---|---:|---:|---:|---:|---|---|
| Transcripts | Supabase `transcripts` (base HISTORIQUE) | 1 747 | 1 747 | ~40 extraits | **0** | non bornée précisément | `transcript_raw` intégralement NULL |
| Notes vocales transcrites | `parrit-os/wispr/recordings`, sources `wispr` 33 et `plaud` 106 | inclus ci-dessus | idem | quelques extraits | **0** | idem | noms propres déformés par Wispr |
| Mails | Gmail MCP, `revenue_events`, `AI_CONTEXT` | inconnu | oui (MCP dispo) | **0** | **0** | — | **aucun mail ouvert dans aucune des deux phases** |
| Threads complets | Gmail MCP | inconnu | oui | **0** | **0** | — | idem |
| Messages LinkedIn | `parrit-os/data/linkedin/2026-05-07_export/` | 14 414 cités | export brut | **0** conversation | **0** | jusqu'au 07/05 | agrégats hérités, non revérifiés |
| Propositions commerciales | 63 chemins `*propale*` | 63 | non indexé | ~3 par mention | **0** | 2026 | 16 chiffrées AES, contenu non relu |
| Devis | `parrit-os/devis/` | 20 | non | **0** | **0** | 2026 | — |
| Contrats | aucun répertoire identifié | **0 trouvé** | — | — | — | — | **aucun contrat n'a été localisé** |
| Factures | Qonto, `revenue_events` | ~22 citées | partiellement | **0 PDF** | **0** | avr.-juil. | **le trou le plus documenté du corpus (K11)** |
| Encaissements | `VERITE-ARGENT-2026-07-29.md` | 4 agrégats mensuels | oui | 1 fichier | **1** | avr.-juil. | run `30437733244` déclenché par erreur en `--live` |
| Impayés | même fichier | 17 + 5 lignes | oui | 1 fichier | **1** | idem | détail par facture non ouvert |
| Repositories | 22 dépôts git sous `~` | 22 | non | 2 (`parrit-os`, `parrit-site`) | **0** | — | 20 dépôts jamais inspectés |
| `CLAUDE.md` | 46 fichiers sous `~` | 46 | non | 1 (racine) | **1** | — | 45 non lus |
| PRD et spécifications | `parrit-os/PRD.md`, `docs/super-app/` | 249 `.md` dans `docs/` | non | ~6 | **3** | 2026 | 243 non ouverts |
| Workflows n8n | `n8n-workflows`, `n8n-canon`, `workflows` | 114 JSON | non | **0 JSON** | **0** | — | tout vient de l'inventaire du 27/07 |
| Bases de données | Supabase HISTORIQUE + CIBLE, `parrit.db` | 3 | 1 (HISTORIQUE) | 1 | — | — | **base CIBLE injoignable en session** |
| Journaux d'exécution | n8n, `push_logs`, `dream_reports` | inconnu | non | **0** | **0** | — | jamais ouverts |
| Incidents | `REGLES-DOR.md` (48 règles) | 48 | oui | via synthèse | **0** | 2026 | fichier jamais ouvert dans ces deux phases |
| Systèmes clients | Clevery, Laparra, Didier, EFI | 4 | non | via synthèse | **0** | avr.-juil. | aucun accès direct pris |
| Super app | `parrit-site`, `lib/sections.ts`, `docs/super-app/` | 1 | partiel | 2 fichiers | **2** | juil. | `SOCLE.md` et `VERITE-ARGENT` lus en phase 1 |
| Contenus publiés | site, LinkedIn, presse, newsletter | inconnu | non | page d'accueil live | **0** | — | aucune donnée de performance ouverte |
| Brouillons | Gmail, `content/`, `Inbox/` | inconnu | non | **0** | **0** | — | — |
| Décisions et mémoires | `docs/ARBITRAGES.md` (61 arbitrages), 897 fichiers mémoire | 958 | oui (`grep`) | 61 titres, ~15 mémoires | **0** | 2026 | titres lus, contenu non ouvert |

---

## 2. Couverture des transcripts

- **Découverts** : 1 747, table `transcripts`, base HISTORIQUE `dgjgscstyzcmtwgjrrda`.
- **Rendus recherchables** : 1 747 (100 %), par requêtes SQL `substring`/`position` sur `body_text`.
- **Ayant produit un signal utilisé dans `02A`** : environ 25, tous par héritage de la phase 1 (verbatims Laparra, Joone, Overlord, Silvani, Berton, porte-à-porte, Maxime).
- **Ouverts intégralement : 0.** Aucun transcript n'a jamais été lu de bout en bout dans aucune des deux phases.
- **Interrogés uniquement par recherche** : 1 747.
- **Inaccessibles** : `transcript_raw` est NULL sur la totalité des lignes ; seul `body_text` est exploitable.
- **Répartition par source** : terracall 1 184 · whatsapp 137 · plaud 106 · gemini-meet 106 · calendar_meeting 80 · wispr 33.
- **Volume** : non mesuré. Aucun `sum(length(body_text))` n'a été exécuté.
- **Représentation** : jamais calculée. Aucun `group by prospect_id` n'a été fait, donc **les personnes et entreprises les plus représentées sont inconnues**. Les verbatims retenus l'ont été par recherche par mot-clé, pas par échantillonnage.
- **Catégories de réunions** : non typées.

**Biais principal, à assumer.** La recherche par mot-clé remonte ce qu'on cherche déjà. Les objections formulées avec un vocabulaire non anticipé n'ont jamais pu apparaître. Le corpus n'a pas été lu, il a été interrogé.

**Les quatre niveaux, appliqués honnêtement** : inventorié 1 747 · interrogé par recherche 1 747 · extrait lu ~40 · ouvert intégralement **0**.

---

## 3. Couverture des mails et communications

### Mails
Envoyés ouverts : **0.** Reçus ouverts : **0.** Threads complets ouverts : **0.** Le connecteur Gmail MCP était disponible pendant toute la session et n'a **jamais été appelé**. Les références de mails dans `02A` (notamment `19df96c142f4bac4`, l'accord Laparra) proviennent de `positioning-research/04`, elles n'ont pas été rouvertes. Problème d'ingestion connu et non résolu : un défaut fait apparaître comme non envoyés des documents réellement partis, confirmé sur Trainline le 31/07, non vérifié sur IUC et Hertman.

### LinkedIn
Conversations ouvertes : **0.** Les chiffres cités (14 414 messages analysés, 5 176 connexions dormantes, 792 fiches InMail) sont des agrégats hérités d'analyses antérieures au dossier, non revérifiés. L'export date du 07/05/2026, donc **presque trois mois de messages ne sont couverts par rien**.

### Autres communications
WhatsApp : 137 transcripts en base, aucun ouvert. Telegram : 851 cartes produites, 679 ignorées, chiffres hérités, table `clevery_relance_events` jamais requêtée dans ces deux phases. Téléphone : 84 lignes en file, **jamais mesuré, jamais écouté**.

---

## 4. Couverture commerciale et financière

| Catégorie | Découverts | Ouverts | Statut vérifié | Rapprochement bancaire |
|---|---:|---:|---|---|
| Propositions | 63 chemins | 0 | non | non |
| Devis | 20 | 0 | non | non |
| Contrats | 0 localisé | 0 | — | — |
| Factures | ~22 citées | **0 PDF** | non | non |
| Avoirs | aucun identifié | 0 | — | — |
| Preuves d'encaissement | 4 agrégats mensuels | 4 | oui, au niveau mensuel | **oui, mais agrégé seulement** |
| Renouvellements | 1 cas (Joone) | 0 | non | non |
| Créances | 5 factures / 13 200 € | 0 | non | agrégé |
| Impayés | 17 factures / 41 775 € | 0 | non | agrégé |

**Le rapprochement bancaire n'a été fait qu'au niveau du total mensuel**, via un run Qonto agrégé déclenché par erreur en mode `--live`. Aucune facture n'a été rapprochée d'un virement. Aucun montant individuel de `02A` (2 640 €, 3 000 €, 2 500 €, 2 000 €) n'a été confirmé par un document ouvert.

---

## 5. Couverture technique et produit

- **Repositories** : 22 découverts, **2 inspectés** en phase 1 (`parrit-os`, `parrit-site`), 20 jamais ouverts.
- **`CLAUDE.md`** : 46 sur le disque, 1 lu (celui de la racine, injecté automatiquement).
- **Systèmes en production chez un client** : 4 (Clevery, Laparra, Didier, EFI). **Aucun n'a été inspecté directement** : ni base, ni logs, ni interface. L'affirmation « ça tourne » repose sur des notes, pas sur une observation.
- **Systèmes internes uniquement** : super app, Dream Machine, pont Codex, harnais. `lib/sections.ts` et `SOCLE.md` lus en phase 1.
- **Workflows** : 114 fichiers JSON sur disque, **0 ouvert**. Les chiffres de `02A` (42 actifs, 13 qui ne devraient pas tourner, 8 hors périmètre Parrit) viennent tous de l'inventaire du 27/07, non revérifié.
- **Incidents** : `REGLES-DOR.md` contient 48 règles nées d'incidents. Le fichier n'a été ouvert dans aucune des deux phases.
- **Logs, déploiements, coûts** : **0 consulté.** Aucun coût d'infrastructure ou de LLM par client n'a été extrait, ce qui est cohérent avec le fait que `02A` déclare la marge inconnue.

**Les sept états, appliqués aux systèmes clients** : construits 4 · déployés 4 · utilisés 4 (par note, pas par log) · utilisés par un client 4 · **payés 4 en build, 0 en run** · maintenus 4, par Paul seul · abandonnés 1 (Hertman, jamais mis en production).

---

## 6. Couverture du contenu et de la marque

- **Site actuel** : page d'accueil live consultée en phase 1, plus `HomeDeux.tsx` lu. C'est la seule source primaire de marque réellement ouverte.
- **Anciennes versions, landing pages** : **0 consultée.**
- **Articles, vidéos, scripts, brouillons** : **0 ouvert.** La vidéo qui promet publiquement une ressource Heads of Sales jamais construite est citée sans avoir été visionnée.
- **Calendriers éditoriaux** : le chiffre « 43 lignes, 0 exécutée » est hérité, la table n'a pas été requêtée ici.
- **Ressources promises vs produites** : 3 ressources orphelines identifiées en phase 1, contenu non ouvert.
- **Données de performance** : **aucune.** PostHog était disponible et n'a jamais été interrogé. Aucune donnée d'audience, de conversion ou de trafic n'existe dans `02A`.
- **Contenus ayant contribué à une vente** : un seul cas cité, le passage média ayant mené à IPD, connu par note et non par trace.

---

## 7. Sources secondaires utilisées comme index

| Document | Usage réel |
|---|---|
| `positioning-research/04`, `/05`, `/07` | **Utilisés comme preuve directe.** Relus intégralement, ce sont les sources principales de `02A`. Ce sont des synthèses, pas des sources primaires |
| `positioning-research/00`, `/01`, `/02`, `/03`, `/06`, `/08` | Index, via le contexte hérité. Non rouverts en phase 2 |
| `00-EVIDENCE-REGISTER.md` | Preuve directe pour les statuts et les montants |
| `01-MARKET-MAP.md` | Hypothèse pour les segments et les prix du marché |
| `02-POSITIONING-DECISION.md` | Hypothèse pour l'architecture, index pour les scores |
| `POSITIONING-ONE-PAGER.md` | Preuve directe pour les faits Lime |
| `docs/ARBITRAGES.md` | Index. 61 titres lus par `grep`, **aucun contenu ouvert** |
| Canon (`SOCLE`, `OFFRES`, `ROLE-PAUL`, `VOIX`, `ESPRIT`) | Preuve directe pour la doctrine, **secondaire pour les faits commerciaux** qu'il rapporte |
| Mémoire (897 fichiers) | Index. ~15 titres vus via `MEMORY.md`, aucun fichier ouvert |

**Le point le plus important de cette section** : trois fichiers de synthèse ont été traités comme des preuves. Ils sont rigoureux et étiquetés, mais ils restent des synthèses.

---

## 8. Décisions insuffisamment reliées aux sources primaires

| Décision | Sources primaires consultées | Contre-exemple recherché | Couverture suffisante ? | Ce qui manque |
|---|---:|---|---|---|
| 1 Identité | 2 (`revenue_events`, banque agrégée) | oui | partielle | factures ouvertes |
| 2 Positionnement public | 1 (site live) | oui | **non** | le compteur « semaine prochaine » |
| 3 Cible comportementale | 2 (Instantly, transcripts extraits) | oui | partielle | échantillonnage non orienté |
| 4 Secteurs | 1 (base HISTORIQUE) | partiel | **non** | propales e-commerce non ouvertes |
| 5 Moment déclencheur | 0 | **non** | **non** | relecture de 4 transcripts d'ouverture |
| 6 Problème central | 1 (transcripts extraits) | oui | **non** | usage réel de `/diagnostic` |
| 7 Transformation | 0 | non | **non** | observation directe d'un système client |
| 8 Modèle de relation | 1 (contrats absents) | partiel | **non** | les contrats, introuvables |
| 9 Durée | 0 | non | **non** | dates de début et de fin par dossier |
| 10 Produits d'entrée | 2 (`revenue_events`, canon) | oui | partielle | montants par facture |
| 11 Offre économique | 2 (banque, canon) | oui | partielle | marge, jamais calculée |
| 12 RUN et autonomie | 1 (transcripts extraits) | oui | partielle | `clevery_relance_events` non requêtée |
| 13 Responsabilité | 0 | **non** | **non** | contrats, CGV, engagements écrits |
| 14 Différenciation | 2 (code des linters, canon) | oui | partielle | aucun test client de l'argument |
| 15 Moat | 0 | **non** | **non** | inspection des 114 workflows |
| 16 Rôle de Paul | 1 (`ROLE-PAUL.yaml`) | oui | partielle | mesure de la capacité simultanée |
| 17 Rôle de Maxime | 1 (inventaire du 27/07) | oui | partielle | son dépôt, jamais inspecté |
| 18 Partenaires | 0 | partiel | **non** | liste nominative, aucun contrat |
| 19 Formation | 1 (facture citée, non ouverte) | **non** | **non** | dossier Qualiopi, conventions |
| 20 Super app | 2 (`lib/sections.ts`, `SOCLE`) | oui | oui | — |
| 21 Storytelling Lime | 2 (CV, `Positions.csv`) | oui | oui | les 3 éléments non vérifiés, signalés |
| 22 Valeurs | 2 (code des linters, canon) | oui | partielle | `REGLES-DOR.md` non ouvert |
| 23 Refus | 1 (transcripts extraits) | oui | partielle | aucun document opposable |
| 24 Promesses | 2 (`HomeDeux.tsx`, page live) | oui | **oui** | — |
| 25 Site | 2 (code, page live) | oui | partielle | PostHog jamais interrogé |
| 26 Contenu | 1 (page live) | oui | **non** | données de performance |
| 27 Vision 18 mois | 1 (banque agrégée) | partiel | **non** | dates de règlement par facture |
| 28 Critères de validation | 0 | **non** | **non** | rien n'est instrumenté |

**Résultat : 3 décisions sur 28 ont une couverture suffisante** (20, 21, 24). 12 sont partielles. **13 sont insuffisantes**, dont 6 qui ne reposent sur aucune source primaire ouverte (5, 7, 9, 13, 15, 28).

---

## 9. Sources non accessibles ou inexploitables

| Source | Type | Raison | Impact | Action |
|---|---|---|---|---|
| Base CIBLE `bgedzhcuvrqqcttiezei` | base | non joignable par MCP en session | tout `02A` décrit l'ancienne base | ouvrir l'accès REST |
| `transcript_raw` | colonne | NULL sur 1 747 lignes | pas de vérification du texte brut | corriger le pipeline |
| PDF de factures | documents | jamais ouverts | 7 montants non confirmés | moins d'une heure de lecture |
| Contrats | documents | **aucun localisé** | les décisions 8, 9, 13 sont sans fondement documentaire | trouver ou constater qu'il n'y en a pas |
| VPS Laparra | système client | clé SSH non détenue par Paul | production client non observable | demander l'accès |
| Machines 187 et 72 | infrastructure | shell refusé | ce qui tourne vraiment n'est pas vérifiable | arbitrage A16 |
| Messages LinkedIn post 07/05 | communications | hors export | trois mois d'échanges invisibles | réexporter |
| Enregistrements d'appels | audio | 84 lignes jamais écoutées | le canal téléphone est un angle mort total | échantillonner 10 appels |

---

## 10. Problèmes de qualité des données

1. **Ingestion défaillante sur les envois.** Un récap Trainline réellement envoyé et validé par le client apparaissait comme non envoyé. Corrigé sur ce dossier, **non vérifié sur IUC et Hertman qui reposent sur le même champ**.
2. **Doublons non traités.** Joone compte comme trois fiches, Didier comme deux, la seule relation IUC comme sept. Toute statistique d'entonnoir est invalide.
3. **Personne contre compte, jamais tranché.** Didier affiche 8 touches, 23 réelles.
4. **Actions planifiées comptées comme envoyées.** 69 relances posées comptées comme des mails partis, **défaut reproduit à l'identique dans la nouvelle base**.
5. **Statuts commerciaux faux.** 9 clients marqués `signed` : la banque en confirme 1, en infirme 3, et pour 1 personne ne sait qui c'est.
6. **Documents manquants.** IPD, 13 000 €, n'existe dans aucune table. Le montant Joone existe en trois versions incompatibles.
7. **Notes de mémoire prises pour des preuves.** La ligne la plus solide du corpus (Gazelec, `status=paid`) repose sur « encaissée d'après Paul », sans PDF. Hertman était `signed` avec pour preuve littérale « 900 €/mois (mémoire dossiers actifs) ».
8. **Divergence code contre canon.** Prix, logos et vocabulaire du dépôt contredisent le canon ; la spec déclare un sujet ouvert que le code a déjà tranché.
9. **Locuteurs incertains.** Les transcripts Wispr déforment les noms propres ; « Swiss Studio » est resté non identifié faute de confirmation.
10. **Écart bancaire non résolu.** 150 € au 29/07 contre 257,87 € au 28/07, sans explication trouvée.

---

## 11. Contrôle final

1. **Transcripts inventoriés ?** OUI. 1 747, comptés en base.
2. **Rendus recherchables ?** OUI. Recherche SQL plein texte disponible sur `body_text`.
3. **Sources décisives ouvertes en contexte complet ?** NON. Aucun transcript, mail, facture ou workflow n'a été ouvert intégralement. Seuls le code du site, le CV, l'export LinkedIn et cinq fichiers de doctrine l'ont été.
4. **Threads complets lus ?** NON. Zéro thread mail ou LinkedIn ouvert, alors que le contexte est déterminant sur au moins quatre dossiers (Trainline, IUC, IPD, Hertman).
5. **Contre-exemples recherchés pour les 28 ?** PARTIELLEMENT. Recherchés pour 20, absents pour 5, 13, 15, 19, 28, partiels pour 4, 8, 18, 27.
6. **Rapprochement bancaire ?** PARTIELLEMENT. Au niveau du total mensuel uniquement, via un run déclenché par erreur en `--live`. Aucune facture rapprochée d'un virement.
7. **Usages clients distingués des constructions internes ?** OUI. C'est la discipline la mieux tenue du dossier : la super app, le multi-agents et le harnais sont partout classés internes et sans valeur client démontrée.
8. **Décisions reposant uniquement sur une ancienne synthèse ?** OUI. Six (5, 7, 9, 13, 15, 28) n'ont aucune source primaire ouverte.
9. **Zones importantes non explorées ?** OUI. Les mails, les threads LinkedIn, les 114 workflows, les 20 autres dépôts, les logs, les appels téléphoniques, les données de performance du site.
10. **`02A` utilisable pour un arbitrage humain sans extraction supplémentaire ?** PARTIELLEMENT. Il l'est pour les décisions d'identité, de refus, de promesses et de rôle. Il ne l'est pas pour celles qui dépendent d'un chiffre : marge, durée, responsabilité, critères de validation.

---

## 12. Verdict de couverture

### Ce que le corpus permet de décider maintenant
1. Ce qui a été vendu, en nature et en ordre de grandeur. 2. Que le comité ne signe pas. 3. Que le froid n'a produit aucun deal. 4. Que le contrôle avant envoi est demandé spontanément par trois clients. 5. Que le récurrent bancaire est nul. 6. Ce qu'il faut retirer du site, ligne par ligne. 7. Les critères de refus. 8. Le noyau vérifié du parcours Lime. 9. Que Maxime n'a rien livré. 10. Que le réseau de partenaires appartient à quelqu'un qui part.

### Ce que Paul doit décider indépendamment des données historiques
1. L'identité de l'entreprise. 2. Le régime d'autonomie. 3. Ce qu'il arrête de faire. 4. Le périmètre de Maxime et la clé SSH. 5. Ce qu'on dit du réseau après le 31/08. 6. Le site ou le canon (A52). 7. La responsabilité contractuelle. 8. Le niveau de sécurité minimal. 9. L'ambition à 18 mois. 10. Produit ou service pour le prochain trimestre.

### Ce qui exige une extraction supplémentaire
1. Ouvrir les cinq PDF de facture. 2. Localiser les contrats, ou constater qu'il n'y en a pas. 3. Calculer la marge d'une mission terminée. 4. Ouvrir les threads Trainline, IUC, IPD, Hertman. 5. Requêter `clevery_relance_events`. 6. Inspecter les 114 workflows. 7. Ouvrir `REGLES-DOR.md` et les 61 arbitrages. 8. Interroger PostHog. 9. Échantillonner 20 transcripts au hasard, sans mot-clé. 10. Réexporter LinkedIn depuis le 07/05.

### Ce qui exige un test marché plutôt qu'une recherche
1. Un client hors réseau paie un RUN. 2. Le droit de relire fait acheter. 3. Un cabinet réglementé hors réseau signe. 4. Un organisme de formation signe. 5. La formation ouvre sur un déploiement, hors Laparra. 6. L'objet borné à 2-4 k€ se vend hors réseau. 7. Un cabinet achète de la capacité de production. 8. « La semaine prochaine » est tenable sur dix dossiers. 9. Une mission dégage plus de 50 % de marge. 10. Un contenu de méthode produit un rendez-vous.
