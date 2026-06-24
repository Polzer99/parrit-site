# Kit prez post-meeting : propositions de valeur par personne

Date : 2026-06-24
Statut : template interne
Usage : suite de rendez-vous personnalisee
Sources : `persona-value-prop-matrix.md`, `post-meeting-template.md`, `post-meeting-presentation-template.md`, `MATURITE-SOT.md`

Objectif : generer vite une suite de meeting qui donne envie de continuer. Le support doit pouvoir devenir un mail, une note 1 page, une mini-prez ou une base de propale protegee. Il sert a personnaliser ce qu'on envoie apres un rendez-vous : proposition de valeur, use cases, avant / apres, ressource jointe et prochain pas.

## Inputs obligatoires apres meeting

| Champ | Question a se poser | Exemple |
|---|---|---|
| Personne | Qui doit se reconnaitre en premier ? | DG, DAF, DSI, CCO, DRH, associe avocat |
| Maturite | Ou se situe la personne entre N1 et N7 ? | N1 decouvre, N4 cartographie, N5 veut produire, N7 optimise |
| Moment | Pourquoi maintenant ? | COMEX, cloture, saison forte, refonte CRM, pression pipeline |
| Douleur dite | Quelle phrase exacte a ete prononcee ? | "On teste beaucoup mais rien ne tourne." |
| Risque a proteger | Qu'est-ce qui rend le chantier sensible ? | Donnee, adoption equipe, secret, piste d'audit, SI coeur |
| Premier flux | Quel flux peut etre rendu visible en 45 minutes ? | Demandes entrantes, relances, veille, tickets, reporting |
| Ressource jointe | Quel support aide sans noyer ? | Carte 7 niveaux, schema avant/apres, note gouvernance, exemple signal |

## Recette de personnalisation

1. Choisir un persona principal et un persona secondaire si le deal a deux acheteurs.
2. Choisir une seule promesse principale : temps rendu, revenu genere, risque maitrise ou autonomie interne.
3. Placer l'avant / apres avant toute description Parrit.
4. Proposer trois use cases maximum, dont un prioritaire.
5. Joindre une seule ressource : elle doit faire avancer la decision, pas remplir le mail.
6. Terminer par un prochain pas dateable : atelier 45 minutes, scan limite, cartographie d'un flux, revue d'architecture.

## Structure de la prez personnalisable

### Slide 1 - Ce qu'on a compris

Titre : `{prenom}, votre sujet n'est pas "faire de l'IA". C'est {enjeu_persona}.`

- Moment : `{moment}`
- Douleur visible : `{douleur_dite}`
- Risque a proteger : `{risque}`
- Decision utile : choisir un premier flux qui peut tourner, etre mesure, puis etre etendu.

### Slide 2 - Votre realite

Trois blocs courts :

| Bloc | Contenu |
|---|---|
| Charge | Ce qui revient trop souvent et consomme l'equipe. |
| Dispersion | Ou l'information se perd entre personnes, outils et canaux. |
| Controle | Ce qui doit rester humain, trace et gouverne. |

### Slide 3 - Avant / apres

| Avant | Apres |
|---|---|
| `{avant_1}` | `{apres_1}` |
| `{avant_2}` | `{apres_2}` |
| `{avant_3}` | `{apres_3}` |

Phrase a garder : la valeur apparait quand un flux important devient plus clair, plus rapide et plus controlable.

### Slide 4 - Trois cas possibles, un seul a choisir

| Cas | Pourquoi lui | Signal visible vite |
|---|---|---|
| `{use_case_prioritaire}` | `{raison_priorite}` | `{signal_resultat}` |
| `{use_case_option_2}` | `{raison_option_2}` | `{signal_option_2}` |
| `{use_case_option_3}` | `{raison_option_3}` | `{signal_option_3}` |

### Slide 5 - Premier flux cible

`Entrees` -> `tri / enrichissement` -> `action preparee` -> `validation humaine` -> `trace + mesure`

Completer :

- Entrees : `{canaux_entree}`
- Outil de destination : `{outil_destination}`
- Exceptions : `{exceptions}`
- Validation : `{validateur}`
- Mesure : `{kpi}`

### Slide 6 - Comment Parrit intervient

| Role | Ce que ca apporte |
|---|---|
| Cadrage metier | Choisir le bon cas, le bon perimetre et le bon niveau de risque. |
| Construction | Produire un flux utilisable sur les outils existants autant que possible. |
| Mise sous controle | Garder validation humaine, traces, indicateurs et transfert equipe. |
| Extension | Decider quoi etendre apres preuve du premier flux. |

### Slide 7 - Ressource jointe

Choisir une seule ressource dans la table plus bas.

### Slide 8 - Prochain pas

CTA : `On prend un exemple reel de {use_case_prioritaire} et on cartographie le flux cible en 45 minutes : entrees, exceptions, validation, mesure et premiere version possible.`

## Propositions de valeur par personne

| Personne | Phrase de valeur post-meeting | Avant / apres a raconter | Use cases a proposer | Ressource a joindre | CTA |
|---|---|---|---|---|---|
| DG / CEO | Passer de l'idee IA au premier chantier qui rend du temps et prouve la methode. | Avant : initiatives dispersees. Apres : un flux prioritaire choisi, opere et mesure. | Back-office multi-canal, qualification commerciale par signal, reporting dirigeant. | Carte 7 niveaux + note deux fronts. | Choisir le premier chantier qui doit tourner en quelques semaines. |
| Owner e-commerce | Sortir le fondateur des taches repetitives client sans casser la relation de marque. | Avant : messages, commandes et leads disperses. Apres : base unique, segments propres, relances suivies. | Capture multi-canal, relances WhatsApp, tri SAV, newsletter de marque. | Schema canaux -> base unique -> validation humaine. | Prendre un flux client et le rendre operable. |
| COO | Enlever le geste repetitif qui ralentit les operations et rendre le process mesurable. | Avant : boites partagees, escalades, ressaisie. Apres : tri, preparation, escalade ciblee, action dans l'outil. | Reclamations, commandes, alertes rupture, synchronisation ERP / tableur. | Schema avant / apres du flux operationnel. | Partir du geste quotidien le plus couteux. |
| Avocat associe | Proteger le temps facturable et le secret professionnel tout en accelerant la preparation. | Avant : veille et mise en forme prennent le dessus. Apres : signaux qualifies, premieres passes, validation avocat. | Veille clients, sources officielles, structuration d'actes, supervision interne. | Exemple de veille sur sources officielles. | Choisir une veille ou une premiere passe sous validation avocat. |
| Expert-comptable associe | Transformer la chasse aux pieces en file de validation pour rendre du temps au conseil. | Avant : pieces en vrac, saisie, relances manuelles. Apres : classement, manquants detectes, pre-rapprochement. | Collecte multi-canal, GED, rapprochement bancaire, veille conseil client. | Schema collecte -> manquants -> validation. | Prendre un dossier type et cartographier la file. |
| DAF / CFO | Gagner du temps sur les flux financiers repetitifs sans perdre trace, controle et ROI defendable. | Avant : cloture longue, rapprochements manuels, reporting fragile. Apres : base consolidee, relances, trace et validation humaine. | Rapprochement, relances clients, reporting, controle processus. | Mini-audit 1 page avec risques et indicateurs. | Choisir un flux financier repetitif et sa piste d'audit. |
| DRH | Faire adopter l'IA par des outils utiles le lundi matin, pas par une formation abstraite. | Avant : formation generique, inquietude equipe. Apres : cas RH reel, referents internes, outil reutilisable. | Tri CV, reponses candidats, onboarding, FAQ paie, cascade referents. | Trame atelier referents + cas construit en live. | Choisir un cas RH et former les referents autour. |
| DSI / CIO | Capter la valeur agentique sans exposer le coeur du SI, les donnees ou la gouvernance. | Avant : usages disperses, shadow IT, risque data. Apres : environnements separes, acces controles, journaux. | Agents sur outils satellites, controle acces, journaux, transfert equipe. | Note architecture agnostique. | Cartographier le flux satellite et les garde-fous. |
| CDO | Transformer les tests disperses en capacite interne qui passe vraiment en production. | Avant : demonstrations non reprises. Apres : cas metier en production, referents autonomes, cadre de replication. | Pilote metier, couche interne, enablement referents, revue d'alignement. | Note pilote + transfert de capacite. | Choisir un cas metier et le chemin de production. |
| Directeur transformation | Passer de chantiers disperses a une pratique agentique gouvernee et portee par les equipes. | Avant : initiatives locales, faible passage en production. Apres : pilote, playbook, referents, revue d'alignement. | Pilote metier, formation referents, cadre de validation, reporting adoption. | Note gouvernance + enablement en cascade. | Choisir un cas prioritaire et le cadre autour. |
| Directeur commercial / CCO | Remplacer la prospection froide par une boucle de signaux qualifies. | Avant : listes froides, messages generiques, pipe irregulier. Apres : signaux detectes, messages personnalises, validation humaine. | Veille comptes, enrichissement, sequences personnalisees, relances, pilotage. | Exemple signal -> qualification -> message -> rendez-vous. | Tester une boucle sur un signal reel du secteur. |
| CMO | Transformer l'expertise de marque en contenus et signaux mesurables sans diluer la voix. | Avant : calendrier tendu, dependance agence, faible reutilisation. Apres : content factory, voix preservee, actifs declinables. | Articles, posts, videos, repurposing, mesure citations, localisation. | Exemple content factory + mesure de citations IA. | Partir d'un actif existant et construire la boucle contenu + mesure. |
| Directeur juridique | Accelerer la premiere passe et la veille sans deleguer la decision juridique. | Avant : contrats relus de zero, veille chronophage. Apres : clauses marquees, risques tries, veille supervisee. | Revue contrats, matrice de risque, veille reglementaire, pre-annotation. | Note humain dernier filtre + exemple veille supervisee. | Prendre un type de document ou une source de veille. |
| Directeur e-commerce retail | Mesurer la visibilite de la marque dans les reponses d'achat IA et corriger ce qui fait perdre la citation. | Avant : aucune lecture des questions ou la marque disparait. Apres : taux de citation, actions catalogue, re-mesure. | Scan Rufus par segment, correction fiches, tri service client, relances multi-canal. | Exemple question acheteur -> citation -> correction -> re-mesure. | Lancer un premier scan sur un segment catalogue. |

## Ressource a joindre selon maturite

| Niveau | Situation | Ressource | Role dans la suite |
|---|---|---|---|
| N1 | La personne decouvre l'IA generative. | Fiche "De l'IA generative a l'IA agentique". | Donner le cadre et calmer le bruit ambiant. |
| N2 | Elle veut appliquer l'IA a son metier. | Fiche use cases par fonction. | Montrer que le sujet part du quotidien metier. |
| N3 | Elle veut connecter ses outils. | Schema connecteurs et outils existants. | Rendre concret le passage assistant -> action. |
| N4 | Elle veut cartographier les process. | Mini-audit 1 page. | Prioriser avant de construire. |
| N5 | Elle veut un agent en production. | Schema flux supervise + trace. | Montrer le controle humain et la mesure. |
| N6 | Elle veut construire en interne. | Note transfert de capacite. | Vendre l'autonomie, pas seulement la livraison. |
| N7 | Elle a deja une flotte. | Note diagnostic flotte. | Reprendre le controle : couts, erreurs, logs, gouvernance. |

## Ressources de prospection a produire

| Ressource | Cible prioritaire | Statut | Contenu minimum | Sortie attendue |
|---|---|---|---|---|
| Fiche 7 niveaux "IA generative -> IA agentique" | DG, DRH, prospects N1/N2 | Source creee : `resources/fiche-7-niveaux-ia-generative-agentique.md` | Montagne maturite, 7 niveaux, 1 exemple par niveau, CTA diagnostic. | PDF 1 page + image LinkedIn. |
| Fiche avant / apres par persona | DG, CCO, owner e-commerce, transfo, e-commerce retail | Source creee : `resources/fiches-avant-apres-personas-prioritaires.md` | Avant, apres, 3 use cases, ressource suivante. | PDF court par persona. |
| Mini-audit post-meeting | DAF, COO, DSI, transfo | Base presente dans ce kit | Trois use cases, risques, premier flux, prochaines etapes. | Markdown + page protegee si deal chaud. |
| Exemple boucle signal -> rendez-vous | Directeur commercial / CCO | Source creee : `resources/exemple-boucle-signal-rendez-vous.md` | Signal, qualification, message, validation humaine, pilotage. | PDF + extrait mail. |
| Exemple back-office multi-canal | Owner e-commerce, DG, COO | Source creee : `resources/exemple-back-office-multi-canal.md` | Canaux, base unique, tri, relances, exceptions. | Schema partageable. |
| Note gouvernance agentique | DSI, CDO, transfo, juridique | Source creee : `resources/note-gouvernance-agentique.md` | Donnee, acces, journaux, validation, coeur SI intact. | PDF 1 page. |
| Template propale protegee | Deals chauds | Commence via templates existants | Resume meeting, use cases, prix, destinataires, tracking. | Page web protegee. |

## Controle qualite avant envoi

- La premiere page parle de la personne, pas de Parrit.
- Un avant / apres concret apparait avant les moyens.
- Le support propose un premier flux, pas une transformation totale.
- La ressource jointe correspond au niveau de maturite.
- Aucun prix ni nom client sur un support non protege.
- Le CTA est simple, dateable, et ne demande pas une decision lourde.
