# Audit copy parrit.ai : tells « AI slop » et cohérence FR/EN

Date : 11/10/2026 · Rôle : évaluateur, lecture seule · Base : worktree `/Users/paullarmaraud/codex-work/parrit-alignement-2026-10-11` (rien modifié).
Cadre (précision du fondateur relayée en cours d'audit) : le site est beau, **pas de refonte**. On retire les tells (« Exemple fictif », « Pas X. Y. »), on aligne les termes entre pages et entre FR et EN. **Réécritures minimales, aucune nouvelle section.**

Doctrine lue avant de juger : skill `anti-ia-tells`, REGLES-DOR §10/§24/§53/§57/§60, corpus de style (usage privé, non cité), `TRUTH.md`, `AGENTS.md`.

Légende priorité : **P0** = premier écran de l'accueil ou demande explicite de Paul · **P1** = CTA et cohérence entre pages · **P2** = autres pages · **P3** = surfaces machine (OG, JSON-LD, llms.txt).
Chemins relatifs à `src/` sauf mention contraire. `(rev01)` = `app/(rev01)`.

---

## 0. Ce que la gate devra aussi mettre à jour (sinon CI rouge)

Ces tests vérifient **mot pour mot** les chaînes à supprimer. Ils changent parce que le contrat produit change (décision Paul). Ce n'est pas « modifier un test pour le faire passer » au sens de §11 :
- `tests/conformity-home.spec.ts:199-200` : « Pas publiés. Partagés en rendez-vous. » / « Not published. Shared in person. »
- `tests/audit-truth-copy.test.mjs:87` : même chaîne FR.
- `tests/product-scene.spec.ts:19` : `.product-scene-mention` = « Exemple fictif » / « Fictional example ».
- `tests/brand-os-render.test.mjs:98,103` : « Exemple fictif », « Fictional example ».
- `public/llms.txt` est généré : corriger `scripts/generate-llms.mjs`, pas le fichier.

---

## 1. P0 · Premier écran et demandes explicites de Paul

| # | Fichier:ligne | Langue | Texte actuel | Tell / règle | Réécriture FR | Réécriture EN |
|---|---|---|---|---|---|---|
| 1 | `(rev01)/page.tsx:132` + `:48` (rendu `ProductScene.tsx:67`) | FR/EN | « Exemple fictif » / « Fictional example » | Mention défensive, bannie par Paul | **Supprimer la mention** (prop `mention` et `<p className="product-scene-mention">`). Les noms « Prospect B » / « Contact achat » suffisent à montrer qu'il s'agit d'un cas type. Ne pas écrire « anonymisé » : ce serait faux. | idem |
| 2 | `system/components/ProductScene.tsx:74` | FR (lu aussi sur EN) | aria-label « Exemple fictif de conversation avec l'agent CRM » | Même tell, côté lecteur d'écran | « Conversation avec l'agent CRM » | (bloc en `lang="fr"`, garder FR) |
| 3 | `ProductScene.tsx:82` | FR | alt « Carte de visite fictive : Contact achat, acheteur chez Prospect B » | Même tell | « Carte de visite photographiée : Contact achat, acheteur chez Prospect B » | idem |
| 4 | `ProductScene.tsx:86` | FR | aria-label « Réponses illustrées, démonstration non interactive » | Mention défensive + jargon | « Réponses proposées : oui ou non » | idem |
| 5 | `(rev01)/page.tsx:110` / `:26` | FR/EN | « Pas publiés. Partagés en rendez-vous. » / « Not published. Shared in person. » | Motif exact cité par Paul : négation puis rectification, deux fragments sans verbe | « Les noms des clients sont communiqués en rendez-vous. » | « Client names are shared in a meeting. » |
| 6 | `system/components/AgentEsquisse.tsx:13` / `:29` (premier écran, dans le hero) | FR/EN | « Un exemple, pas une analyse de votre entreprise » / « An example, not an analysis of your company » | « X, pas Y » défensif, visible dès l'arrivée | **Supprimer** la ligne `mode` (le titre « Votre agent · esquisse » suffit). Si un libellé reste : « Esquisse type » | « Sample sketch » |
| 7 | `AgentEsquisse.tsx:23` / `:39` | FR/EN | « Cette esquisse est un exemple, choisi dans une catégorie proche de votre phrase, pas une analyse de votre entreprise. Envoyez-la à Paul : … » | Même antithèse, en doublon de #6 | « Cette esquisse part d'un cas proche de votre phrase. Envoyez-la à Paul : il regarde si un système de ce type a du sens chez vous et vous répond personnellement. » | « This sketch starts from a case close to your sentence. Send it to Paul: he checks whether a system like this makes sense for you and replies personally. » |
| 8 | `AgentEsquisse.tsx:14` / `:30` | FR/EN | « Un système s'esquisse pour la reprendre. » / « A system gets sketched to take it over. » | Passif flou, sonne traduit | « Nous esquissons le système qui la reprendrait. » | « We sketch the system that would take it over. » |
| 9 | `AgentEsquisse.tsx:18` / `:34` | FR/EN | « Brouillon prêt, journalisé, réversible » / « Draft ready, journaled, reversible » | Triade d'adjectifs + anglicisme « journalisé » | « Brouillon prêt, consigné, annulable » | « Draft ready, logged, can be undone » |
| 10 | `AgentEsquisse.tsx:21` / `:37` | FR/EN | « Votre opération, observée en continu » · « Le reste s'exécute et se consigne » / « Only the arbitrations reach you » | Jargon (« arbitrations » en EN est un calque) | garder FR | « Only the decisions reach you » ; idem `:35` « Two gaps to arbitrate » → « Two gaps to decide on » |
| 11 | `system/components/QuickCapture.tsx:42` / `:26` | FR/EN | « Voir l'exemple illustratif » / « See an illustrative example » | Mention défensive + incohérence de terme (ailleurs : « esquisse ») | « Voir l'esquisse » | « See the sketch » |
| 12 | `QuickCapture.tsx:33` | FR | « Votre process à reconstruire, en une phrase (facultatif) » | Anglicisme « process » ; le site dit partout « opération » | « L'opération à reprendre, en une phrase (facultatif) » | `:17` « The operation to take over, in one sentence (optional) » |
| 13 | `QuickCapture.tsx:22` | EN | « Registration failed » | Incohérence FR/EN (FR : « L'envoi a échoué ») | — | « Sending failed » |

Note hero (pas un tell, à signaler seulement) : `(rev01)/page.tsx:101-103` « Nous transformons des problèmes opérationnels en systèmes qui fonctionnent. » échoue au test §60 : une autre agence pourrait la signer en changeant le logo. La phrase suivante (`:104`, « La facture qui traîne, le rapport refait à la main chaque semaine… ») est concrète et porte la page. **Le fondateur a exclu la refonte**, donc pas de réécriture imposée. Option si Paul le souhaite, tirée de TRUTH §1 : « Nous transformons les données de votre entreprise en outils qui vous appartiennent. » / « We turn your company's data into tools you own. »

---

## 2. P1 · CTA et cohérence des termes entre pages, FR/EN

### 2.1 L'examen : une seule graphie, une seule note

Constat : le même objet porte **six notes différentes** et deux graphies.

| Fichier:ligne | Texte actuel FR | EN |
|---|---|---|
| `(rev01)/page.tsx:178` | « 15 min · Un examen, en visio, avec le fondateur » | « 15 min · An examination, on a video call, with the founder » |
| `(rev01)/dossiers/page.tsx:72` | « 15 min · Un examen, avec le fondateur » | « 15 min · An examination, with the founder » |
| `(rev01)/manufacture/page.tsx:70` | « 15 min · En visio, avec le fondateur » | « 15 min · On a video call, with the founder » |
| `(rev01)/standard/page.tsx:92` | « 15 min · En visio, avec le fondateur » | idem |
| `(rev01)/build-with-you/page.tsx:52` | « Examen offert de 15 minutes, avec le fondateur » | « Free 15-minute examination with the founder » |
| `system/components/CalInline.tsx:25` | « 15 MIN · VISIO » | « 15 MIN · VIDEO » |
| `(rev01)/sketch/[id]/page.tsx:171` | « 15 MIN · UN EXAMEN, PAS UN APPEL COMMERCIAL » | « 15 MIN · AN EXAMINATION, NOT A SALES CALL » (antithèse en plus) |

**Proposition, une seule note partout** : FR « 15 min · En visio, avec le fondateur » · EN « 15 min · Video call with the founder ». CalInline peut garder sa version courte en capitales.

**« Offert » : le mot apparaît ou non selon la page.** Les cartes d'offre et la page Build With You disent « Examen offert » (`page.tsx:157`, `systems/page.tsx:164`, `build-with-you:39`). La page `/commission` ne dit pas que l'examen est gratuit, et la FAQ dit « sans engagement » (`systems:173`). C'est un fait commercial, donc **à trancher par Paul** : soit « offert » partout où l'examen est nommé, soit nulle part. Ne rien inventer.

**Majuscule de l'examen.** On trouve « Examen » capitalisé en texte courant (`manufacture:69` « Tout commence par un Examen. », `systems:152` « montré à l'Examen », `:172-173` « après l'Examen », « Un Examen de 15 minutes ») et en minuscule ailleurs (bouton « Réserver l'examen », `commission:19`). Règle proposée : majuscule seulement dans le nom de phase (« L'Examen · La Construction · La Capitalisation », manufacture et sketch), minuscule partout ailleurs. Même règle en EN (« examination » / « Examination »).

### 2.2 CTA

Le bouton principal est cohérent (« Réserver l'examen » / « Book the examination » dans le header, l'accueil, les pages et la capture). Deux écarts :
- `build-with-you/page.tsx:49` / `:27` : « Réserver un examen pour un système sur mesure » / « Book an examination for a custom system ». C'est acceptable comme lien secondaire. Pour l'aligner : « Réserver l'examen (système sur mesure) » / « Book the examination (custom system) ».
- `RevFooter.tsx:24` / `:12` : « Commande · réserver l'examen » / « Commission · book the examination ». OK.
- Le nom du fondateur alterne entre « Paul » (capture : « Envoyer à Paul », « Paul la regarde », esquisse : « Envoyez-la à Paul ») et « le fondateur » (offres, commission, manufacture). Ce n'est pas un tell, c'est un choix de voix. Garder « Paul » dans la capture (geste personnel) et « le fondateur » ailleurs, **sans mélanger les deux dans un même bloc**. Aujourd'hui c'est le cas.

### 2.3 Antithèse répétée sur les offres : « pas un audit ni un deck »

Trois occurrences du même motif « X, pas Y » :
- `(rev01)/page.tsx:154` / `:70` et `systems/page.tsx:161` / `:127` : « Pour le dirigeant qui veut repartir avec quelque chose qui tourne, pas un audit ni un deck. » / « For leaders who want something that runs, not an audit or a deck. »
- `build-with-you/page.tsx:44` / `:22` : « …pas l'audit ni le deck d'une mission classique » / « not the audit or the deck of a typical engagement ».

Tells : antithèse, anglicisme « deck » en FR.
→ Cartes d'offre : « Pour le dirigeant qui veut repartir avec un système en service. » / « For leaders who want to leave with a system in service. »
→ BWY `outBody` : « Un système qui tourne à la fin, dans vos outils. Le code, les données et la documentation vous appartiennent : pour cette formule, votre équipe le fait tourner sans nous. » / « A system running at the end, in your own tools. Code, data and documentation are yours: for this engagement, your team runs it without us. »

Redondance dans la même carte : le format « 10 heures, avec le fondateur » (`page.tsx:161`, `systems:168`) répète la puce « 10 heures de construction avec le fondateur ». **Supprimer `format`** sur les deux cartes, en FR comme en EN.

### 2.4 « Une commande, pas un abonnement » / « Commissioned, not subscribed »

C'est le même motif « X, pas Y », présent sur **toutes les pages** via le footer (`RevFooter.tsx:28` / `:16`). On le retrouve aussi dans `CalInline.tsx:26` / `:33`, `sketch/[id]/page.tsx:174` / `:160`, l'image OG (`app/opengraph-image.tsx:72`), le JSON-LD (`system/jsonld.ts:11`), `llms.txt` et `Opening.tsx:22,36` (code mort, voir §4).
La formule figure dans TRUTH §1. **Arbitrage de Paul requis** (tagline). Proposition : « Payé à la commande, sans abonnement » / « Paid per commission, no subscription ». Elle garde le fait et retire l'antithèse. Si Paul garde la formule, la garder en **un seul endroit** (le footer) et la retirer du reste.

### 2.5 Dossiers : contradiction entre titre et page

- `(rev01)/page.tsx:144` / `:60` : « Nous montrons les dossiers clients en rendez-vous, pas en ligne. »
- `dossiers/page.tsx:46` / `:13` : « …en rendez-vous, pas sur ce site. »

Tells : antithèse, et formulations différentes d'une page à l'autre. Il y a aussi une **contradiction** : la page affiche juste en dessous trois dossiers en ligne.
→ FR (les deux pages) : « Trois dossiers sont résumés ici. Les autres se présentent en rendez-vous. » · EN : « Three dossiers are summarised here. The others are presented in a meeting. »
→ `page.tsx:145` / `:61` devient alors redondant (« Trois dossiers ouverts aujourd'hui. Les autres restent scellés jusqu'au rendez-vous. ») : garder l'un des deux, pas les deux.

### 2.6 Codes internes visibles (REV, PS, STD, P0)

Ces codes n'aident pas un dirigeant et sont **incohérents entre eux** (REV 01 sur une page, REV 02 sur une autre, aucun sur une troisième). Ils restent en anglais sur les pages FR.

| Fichier:ligne | Actuel | Proposition |
|---|---|---|
| `system/components/RegistryLine.tsx:7` (défaut, utilisé par commission, standard, legal) | `PARRIT / SITE · REV 01 · 2026` | `PARRIT.AI · 2026` |
| `dossiers/page.tsx:121` | `PARRIT / DOSSIERS · REV 01 · 2026` | `PARRIT / DOSSIERS · 2026` |
| `manufacture/page.tsx:85` | `PARRIT / MANUFACTURE · REV 02 · 2026` (seul « REV 02 » du site) | `PARRIT / MANUFACTURE · 2026` |
| `journal/page.tsx:35` **et** `:56` | `PARRIT / JOURNAL · REV 01 · 2026` (affiché deux fois) | garder une seule ligne, sans REV |
| `legal/page.tsx:26` | `PARRIT / LEGAL · REV 01 · 2026` | `PARRIT / LEGAL · 2026` |
| `journal/[slug]/og/route.tsx:41` | `PARRIT / JOURNAL · REV 01 · {date}` | `PARRIT / JOURNAL · {date}` |
| `standard/page.tsx:14,57` | `STD-1.0 · 2026` | `LE STANDARD · 2026` / `THE STANDARD · 2026` |
| `standard/page.tsx:17-43,60-86` | `PS-01` … `PS-06` | `01` … `06` |
| `standard/page.tsx:91` / `:48` | « STD-1.0 n'est pas une accréditation. C'est l'exigence de Parrit.ai. Demandez-nous des comptes. » | « Le Standard est un contrôle interne de Parrit.ai, sans accréditation externe. Demandez-nous des comptes. » / « The Standard is Parrit.ai's internal check, with no external accreditation. Hold us to it. » |
| `system/components/RegistrySnapshot.tsx:15` | « Registre P0 · constaté le 2026-09-13 » / « P0 registry · observed 2026-09-13 » | « Registre · constaté le 13 septembre 2026 » / « Registry · observed September 13, 2026 » (date au format de la langue) |
| `systems/page.tsx:154` | « Parrit / Cas central » / « Parrit / Central case » | « Notre propre cas » / « Our own case » |

AGENTS.md fait de la registry line un « élément propriétaire ». Le format `PARRIT / X · 2026` est donc conservé. Seul le code de révision part.

### 2.7 Mention « contrôle interne » : deux formulations

- `system/components/HarnessBadge.tsx:9-13` : « Harness Certified ✓ » (EN seul, même sur FR) + « Contrôle interne Parrit, pas une accréditation. » / « Parrit internal check, not an accreditation. »
- Standard (ci-dessus).

→ Aligner sur une seule phrase : « Contrôle interne Parrit.ai, sans accréditation externe. » / « Parrit.ai internal check, with no external accreditation. » Libellé FR du badge : « Vérifié par le contrôle interne » (EN « Harness Certified » à garder si Paul tient au nom ; le « ✓ » est un glyphe à vérifier contre `brand-os.glyphs.json`).

### 2.8 /systems : écarts FR/EN et dans un même tableau

- `systems/page.tsx:155` FR « Usage interne · vérifié le 13 septembre 2026 » vs `:121` EN « Internal use · observed 2026-09-13 ». Le verbe et le format de date diffèrent. → EN « Internal use · observed September 13, 2026 ».
- Dans le même tableau `ROWS`, deux libellés pour un même statut : FR « En cours de transfert » (`:189,213,219`) et « Transfert en cours » (`:195`) ; EN « Being transferred » (`:233,257,263`) et « Transfer under way » (`:239`). → un seul : « En cours de transfert » / « Being transferred ».
- `:55` FR « (les contacts, les rendez-vous, les appels, les dossiers en cours) » vs `:98` EN « (a contact, a deadline, a call, an open deal) ». La liste n'est pas la même. → EN « (contacts, meetings, calls, open files) », comme `:114`.

### 2.9 Terme « prototype » (abandonné, toujours visible)

`system/engagements.ts:5-8` documente le retrait de « prototype », qui surpromettait. Il reste visible :
- `legal/page.tsx:15,20` : « formulaire prototype » (×2 par langue) → « formulaire de demande » / « request form ».

---

## 3. P2 · Autres pages

### Accueil (`(rev01)/page.tsx`)
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 115 / 31 | FR/EN | « Chaque étape dit ce que Parrit fait, ce que vous apportez, et ce qu'elle débloque pour la suite. » | Méta-texte en triade, promesse que les étapes ne tiennent pas toutes. Test des −20 % | **Supprimer** | **Supprimer** |
| 140 / 56 | FR/EN | « 15 des 25 types d'information que nous suivons étaient encore tenus en double (mesuré le 13 septembre 2026). » | Chiffre sans verdict : sous le titre « La preuve », le dirigeant lit « leurs données sont en double » | « Nous publions l'état réel de notre propre système : au 13 septembre 2026, 15 des 25 types d'information suivis étaient encore tenus en double. » | « We publish the real state of our own system: as of September 13, 2026, 15 of the 25 types of information we track were still held in two places. » |
| 108 / 24 | FR/EN | « Commandes de : » / « Orders from: » | Tournure maladroite ; « Orders » ≠ « commission » ailleurs | « Ils nous ont commandé un système : » | « Systems commissioned by: » |
| 128 / 44 | FR/EN | « Vous demandez, vous validez, la fiche est créée. » | Ternaire rythmé (léger) | garder (il structure les 3 étapes illustrées), sinon « Une photo, un oui : la fiche est créée. » | « One photo, one yes: the record is created. » |

### Commission (`(rev01)/commission/page.tsx`)
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 23 / 13 | FR/EN | « Vous repartez avec une direction claire. » | Formule creuse. Contredit aussi la meta (`:20`, « Vous repartez avec un périmètre écrit ») alors que le corps dit que le périmètre est envoyé *ensuite* | « Après l'appel, un périmètre écrit ou un non clair. » | « After the call, a written scope or a clear no. » |
| 20 / 10 | FR/EN | meta « Vous repartez avec un périmètre écrit ou un non clair. » | Incohérent avec le corps | « Vous recevez ensuite un périmètre écrit, ou un non clair. » | « You then receive a written scope, or a clear no. » |

### Build With You (`(rev01)/build-with-you/page.tsx`)
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 35 / 13 | FR/EN | sous-titre qui répète mot pour mot le H1 puis ajoute « et vous repartez capable de construire le suivant sans nous » | Redite H1 | « Vous repartez aussi capable de construire le suivant sans nous. » | « You also leave able to build the next one without us. » |
| 36 / 14 | FR/EN | « Vous voulez repartir avec quelque chose qui tourne, construit avec vous. » (sous-titre ET meta description) | Parle à la place du lecteur, redite | **Supprimer du rendu** ; meta = la phrase `autonomy` corrigée | idem |
| 44 / 22 | FR/EN | voir §2.3 | | | |

### Manufacture (`(rev01)/manufacture/page.tsx`)
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 47 / 14 | FR/EN | « Un système se fabrique. Il ne s'installe pas. » / « A system is manufactured. It is not installed. » | Négation puis rectification | « Chaque système se fabrique dans vos comptes, avec vos clés. » (fait repris de la phase 02) | « Each system is built in your accounts, under your keys. » |
| 59 / 26 | FR/EN | « …reconstruite de bout en bout… Ensuite seulement, le reste. » / « …end-to-end… Only then, the rest. » | Jargon « de bout en bout » + fragment final | « …reconstruite entièrement dans vos comptes, avec vos clés… Le reste vient ensuite. » | « …rebuilt in full in your accounts… The rest comes after. » |
| 67 / 34 | FR/EN | « …au même Standard. Six critères, identiques pour tout système livré. » | Fragment nominal | « …au même Standard : six critères, les mêmes pour tout système livré. » | « …to the same Standard: six criteria, the same for every system delivered. » |
| 69 / 36 | FR/EN | « Tout commence par un Examen. » | Majuscule (§2.1) | « Tout commence par un examen. » | « It starts with an examination. » |

### Standard (`(rev01)/standard/page.tsx`)
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 62 / 19 | FR/EN | « L'état du pipeline, les relances parties, l'incident d'hier. Un écran. » | Cascade de fragments | « L'état du pipeline, les relances parties et l'incident d'hier tiennent sur un écran. » | « Pipeline state, follow-ups sent and yesterday's incident fit on one screen. » |
| 54 / 11 | FR/EN | meta FR « décisions cadrées et chiffrées » vs EN « framed decisions » | Écart FR/EN | garder | « framed, quantified decisions » |
| 91 / 48 | | voir §2.6 | | | |

### Dossiers (`(rev01)/dossiers/page.tsx`)
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 47 / 14 | FR/EN | « Les dossiers s'ouvrent de vive voix. Des systèmes commandés par… Anonymisés par principe. » | Fragments en cascade, préciosité | « Ces systèmes ont été commandés par des grands comptes, des PME et des ETI. Nous les anonymisons tous. » | « These systems were commissioned by large accounts, SMEs and mid-sized companies. We anonymize all of them. » |
| 71 / 38 | FR/EN | « Le prochain dossier pourrait être le vôtre. » | Cliché CTA, échoue à §60 | « Un dossier commence par un examen. » | « A dossier starts with an examination. » |
| 58 / 25 | FR/EN | dossier 26-002 : `body` vide | Carte incomplète, incohérente avec les deux autres | Paul doit fournir une phrase de mandat **ou** on laisse vide. Ne pas inventer | idem |
| 53,59 / 20,26 | FR/EN | sceau « Commandé » vs « En production » (Parrit) | Ambigu : on peut lire que les systèmes clients ne tournent pas | **UNKNOWN** : Paul confirme l'état réel de 26-002/26-003 avant toute reformulation | idem |
| 69-70 / 36-37 | FR/EN | « D'autres dossiers restent scellés. Ils se lisent en rendez-vous, sur demande. » | Redite du titre après correction §2.5 | garder une seule de ces mentions sur la page | idem |

### /systems (`(rev01)/systems/page.tsx`)
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 145 / 111 | FR/EN | « Montré, pas revendiqué. » / « Shown, not claimed. » | Motif exact « Pas X. Y. » sous forme de titre | « Ce que le système fait aujourd'hui. » | « What the system does today. » |
| 53 / 96 | FR/EN | « …comme dans cet exemple. Nous ne le cachons pas. » / « We do not hide it. » | Phrase défensive qui rassure sans informer (§54) | **Supprimer la dernière phrase** | idem |
| 54 / 97 | FR/EN | « …Mais nous ne l'avons pas encore branché… Et aucune vente ne lui est due : … » | « Et » d'attaque rhétorique | « …Aucune vente ne lui est due : nos clients viennent de personnes que nous connaissons déjà. » | « …No sale is owed to it: our clients come from people we already know. » |
| 22, 53, 103, 114, 148 | FR/EN | « 13 septembre 2026 », cinq fois sur la page | Pas un tell. Donnée datée d'un mois : **vérifier qu'elle est encore la dernière mesure** (§55, UNKNOWN sinon) | — | — |

### Journal index (`(rev01)/journal/page.tsx`)
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 19 / 13 | FR/EN | « Ce qui a tenu, ce qui a cassé, sur des systèmes IA en entreprise. Daté et consigné. » | Fragment final | « Ce qui a tenu et ce qui a cassé sur des systèmes d'IA en entreprise, daté et consigné. » | « What held and what broke on AI systems inside companies, dated and on the record. » |
| `RevFooter.tsx:23` / `:11` | FR/EN | « Le Journal · les chantiers » / « The Journal · field notes » | Écart léger FR/EN | « notes de chantier » | « field notes » |

### Esquisse privée (`(rev01)/sketch/[id]/page.tsx`, page noindex envoyée par mail à un prospect)
C'est la page la plus chargée en tells. Elle est lue par un prospect, donc dans le périmètre.
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 166 / 152 | FR/EN | « UNE ESQUISSE, PAS UNE PROMESSE. LE VRAI INSTRUMENT SE CONSTRUIT SUR VOS FLUX RÉELS. » | Motif « Pas X. Y. » | « LES CHIFFRES RÉELS VIENDRONT DE VOS PROPRES FLUX. » (l'honnêteté sur les chiffres reste, l'antithèse part) | « THE REAL FIGURES WILL COME FROM YOUR OWN FLOWS. » |
| 171 / 157 | FR/EN | « 15 MIN · UN EXAMEN, PAS UN APPEL COMMERCIAL » | Antithèse | « 15 MIN · EN VISIO, AVEC LE FONDATEUR » (§2.1) | « 15 MIN · VIDEO CALL WITH THE FOUNDER » |
| 90 / 32 | FR/EN | « …tracé jusqu'à la ligne et réversible jusqu'au jour. Personne ne l'écrit. Tout le monde le lit. » | Calque EN + antithèse en paire | « …chaque chiffre renvoie à sa ligne source et peut être annulé. Il se lit sans être écrit à la main. » | « …every figure traces to its source line and can be undone. Nobody writes it by hand. » |
| 113 / 55 | FR/EN | « Le CRM devient quelque chose que vous lisez, pas quelque chose que vous remplissez. » | « X, pas Y » | « Le CRM se lit au lieu de se remplir. » | « You read the CRM instead of filling it in. » |
| 117 / 59 | FR/EN | « Le mail traité comme une doctrine. » / « Mail answered as doctrine. » | Jargon creux | « Chaque mail classé, chaque relance à l'heure. » | « Every mail sorted, every follow-up on time. » |
| 118 / 60 | FR/EN | « …Vous signez. Le système se souvient. » | Paire rythmée | « …Vous signez, le système garde la trace. » | « …You sign; the system keeps the record. » |
| 126 / 68 | FR/EN | « La Construction livre le classeur et la doctrine de rédaction, vérifiés. » | **Contresens** : « classeur » traduit « classifier » | « La Construction livre le tri automatique des mails et les règles de rédaction, vérifiés. » | « Construction ships the mail classifier and the drafting rules, checked. » |
| 131 / 73 | FR/EN | « Votre entreprise. Un seul système. » | Deux fragments | « Toute votre entreprise dans un seul système. » | « Your whole company in one system. » |
| 135 / 77 | FR | « exposition signalée… » | Calque de « exposure » | « risque signalé avec sa cause… » | garder |
| 98, 140 / 40, 82 | FR/EN | « de bout en bout » / « end-to-end » | Jargon | « entièrement » | « in full » |
| 150, 164 | FR/EN | « {SOCIÉTÉ} / OS · ESQUISSE », « Brouillon 01 », « PARRIT / ESQUISSE · BROUILLON 01 · 2026 » | Codes internes | « {SOCIÉTÉ} · ESQUISSE » ; supprimer « Brouillon 01 » / « Draft 01 » | idem |
| 174 / 160 | | voir §2.4 | | | |

### Légal (`(rev01)/legal/page.tsx`)
- `:18` / `:13` : « Dernière mise à jour / Octobre 2026 » → « Dernière mise à jour : octobre 2026 » / « Last updated: October 2026 ».
- `:18` kicker « Parrit / Registre documentaire » : jargon léger, acceptable.
- « formulaire prototype » : voir §2.9.

### 404 (`app/not-found.tsx`)
RAS.

### CalInline (`system/components/CalInline.tsx:100-101`)
« [TO FILL] Coaching calendar link must be configured before launch. » ne s'affiche qu'en cas de mauvaise configuration, en EN seul, et parle de « Coaching ». Risque faible. À traiter par la gate config, pas par le copy.

---

## 4. P3 · Surfaces machine (partage LinkedIn, moteurs, IA)

| Fichier:ligne | Actuel | Tell | Proposition |
|---|---|---|---|
| `app/opengraph-image.tsx:58` | « Your company. One system. » (visuel de partage, différent du hero) | Fragments + incohérence avec le H1 | « We turn operational problems into systems that work. » (ou la formule métier §6) |
| `app/opengraph-image.tsx:72` | « COMMISSIONED, NOT SUBSCRIBED · PARRIT / SITE · REV 01 · 2026 » | Antithèse + code REV | « PARRIT.AI · DATA AND AI · 2026 » |
| `system/jsonld.ts:10-11` | « …tools the company owns: commissioned, not subscribed. Based in France; operating internationally… » | Antithèse | « Parrit.ai is an independent French data and AI company. It turns a company's data into tools the company owns, built in its own accounts and documented. Works in English and French. » |
| `scripts/generate-llms.mjs` → `public/llms.txt` | **16 tirets cadratins « — »** dans llms.txt (17 dans le générateur), dont PS-01…PS-06, « Operates internationally… — », « Built on… — the client… » ; « not a workshop », « Not a sales call. », « Commissioned, not subscribed. » ; définitions PS-01…06 différentes de la page Standard | Tiret cadratin = blocage dur ; antithèses ; incohérence avec /standard | Remplacer « — » par « : » ou « , » ; retirer les antithèses ; reprendre mot pour mot les six énoncés EN de `/standard` |
| `system/components/Opening.tsx` (tout le fichier) | « REV 01 », « Une commande, pas un abonnement », « 14 SYSTÈMES », « 2 TROUVÉES » | Code mort : **importé nulle part**. AGENTS.md le décrit pourtant comme joué à chaque arrivée (doc obsolète) | Ne pas réécrire. Signaler à Paul : supprimer le composant ou corriger AGENTS.md |

Hors périmètre page, même tell : `lib/server/interets.ts:242,250`, le mail automatique après capture : « Voici un exemple illustratif, proche de votre besoin, pas une analyse de votre entreprise ». À aligner sur #7 dans le même lot, sinon le prospect retrouve dans sa boîte la phrase retirée du site.

---

## 5. Synthèse

### 5.1 Les 10 motifs à bannir (règles pour une future gate CI sur les chaînes des `DICT`/`COPY`/`FOOTER`)

1. **Négation puis rectification en fragments** (« Pas publiés. Partagés… », « Not published. Shared… »)
   `(?:^|[.!?]\s+)(?:Pas|Not|No|Jamais|Never)\s+[^.!?]{1,40}\.\s+[A-ZÀ-Ý][^.!?]{1,60}\.`
2. **Antithèse en ligne « X, pas Y »** (« une commande, pas un abonnement », « Shown, not claimed », « pas un audit ni un deck »)
   `(?i),\s+(?:pas|not|plutôt que|rather than)\s+(?:un|une|le|la|les|des|d'|l'|a|an|the|claimed|revendiqu)` (sauf liste blanche validée par Paul)
3. **Mentions défensives** : `(?i)\b(fictif|fictive|fictional|illustrati(f|ve|on)|illustrées?|non interactive|pas une analyse|not an analysis|pas une promesse|not a promise)\b`
4. **Codes internes visibles** : `\bREV\s?0\d\b|\bPS-0\d\b|\bSTD-\d\.\d\b|\bP0\b|\bDraft 0\d\b|\bBrouillon 0\d\b`
5. **Tiret cadratin et demi-cadratin** dans toute chaîne publique, générateurs compris (`scripts/*.mjs`) : `[—–]`
6. **Cascade de fragments courts** (deux phrases de quatre mots ou moins, sans verbe, à la suite) :
   `(?:^|[.!?]\s+)[A-ZÀ-Ý][^.!?\s]*(?:\s[^.!?\s]+){0,3}\.\s+[A-ZÀ-Ý][^.!?\s]*(?:\s[^.!?\s]+){0,3}\.` (en avertissement : les listes Signal/Décision/Action en sont exemptées)
7. **Jargon et calques** en FR : `(?i)\b(de bout en bout|journalis|doctrine|process\b|deck\b|exposition|arbitrage|seamless|robust|leverage)\b`
8. **Termes retirés** : `(?i)\bprototype\b` hors code (cf. `engagements.ts`) ; « Commandes de » ; « Orders from ».
9. **Graphie de l'examen hors nom de phase** : `\b(?:un|l'|à l'|après l')Examen\b|\ban Examination\b|\bthe Examination\b` (la majuscule n'est admise que dans les listes de phases)
10. **Date ISO dans une chaîne FR affichée** : `\b20\d\d-\d\d-\d\d\b` dans les valeurs `fr:` (le FR écrit « 13 septembre 2026 »)

Le plus utile en plus, sans regex : un test de **cohérence des notes** qui vérifie qu'une seule constante `EXAM_NOTE[locale]` est utilisée partout (§2.1). Même mécanique que `engagements.ts`, qui centralise déjà les promesses du funnel.

### 5.2 Le métier de Parrit en une phrase (tirée de TRUTH §1, aucun fait ajouté)

- **FR** : « Parrit.ai est une maison française indépendante de données et d'IA : nous transformons les données d'une entreprise en outils qui lui appartiennent, construits dans ses comptes et documentés. »
- **EN** : « Parrit.ai is an independent French data and AI firm. We turn a company's data into tools it owns, built in its own accounts and documented. »

Usage proposé : meta description de l'accueil, JSON-LD, llms.txt, et en option le hero si Paul rouvre la question (§1, note hero).

### 5.3 Arbitrages qui reviennent à Paul (aucun fait inventé ici)
1. Garder ou non la tagline « Une commande, pas un abonnement » (§2.4).
2. Examen « offert » partout ou nulle part (§2.1).
3. État réel des dossiers 26-002 et 26-003 (« Commandé » ou « En production ») et la phrase de mandat manquante pour 26-002.
4. Mesure du 13 septembre 2026 : encore la dernière ? (/systems, accueil).
5. Composant `Opening.tsx` mort : supprimer ou corriger AGENTS.md.
