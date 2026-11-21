# parrit.ai : passe de copy (retrait du texte « IA » et du ton pompeux sur le fondateur)

Niveau de risque : faible (texte visible et tests qui le vérifient ; aucune logique, aucun style, aucune page nouvelle).

## Demande de Paul (21/11/2026)

« Fais une passe sur le site, mets à jour l'IA slop et le copywriting avec ChatGPT, le modèle le plus élevé, pour revoir tout le site, et évite les choses pompeuses sur le fondateur. »

Le texte « Après » ci-dessous a été rédigé par gpt-6-astra (relecture du 21/11/2026, à partir du texte en ligne), puis relu par Claude pour les faits. **Il est appliqué MOT POUR MOT.** Ne pas le reformuler.

## Règles de construction

Correctif CI : deux choix du sélecteur raccourcis (réserve du chevron) et titre du contact sans point final (règle des titres).

- On modifie l'existant : mêmes sections, même charte, mêmes composants, mêmes animations. Aucune dépendance.
- Chaque chaîne française changée garde sa traduction anglaise : remplacer la clé dans `src/system/single-page-copy.ts` (ou le champ `fr` de `home-goals.ts`, `home-layers.ts`, `ontology-hero-data.ts`, `booking.ts`…) et écrire l'anglais courant qui suit le même sens. Pas d'anglais pompeux non plus.
- Le titre principal ne change pas : « Votre expertise est la matière première. Nous la mettons au travail. »
- Le `<title>` et la description de l'accueil (`src/system/pages/home.tsx`) ne changent pas (référencement).
- Les données structurées (`jsonld.ts`) ne changent pas, sauf si une chaîne FAQ partagée avec le texte visible change : elle suit alors le texte (décision du 08/11 : texte affiché et FAQPage partagent les mêmes paires).
- Une ligne marquée « À supprimer » disparaît du rendu, avec sa clé de traduction. Pour le bloc du fondateur : la photo, le bouton « Prendre rendez-vous » et l'adresse e-mail restent ; le titre devient « Vous échangez avec Paul Larmaraud » et les trois paragraphes indiqués disparaissent.
- Tests : mettre à jour UNIQUEMENT les assertions qui vérifient une chaîne changée ici (`tests/booking.spec.ts`, `tests/booking.test.mjs`, `tests/booking-render.test.mjs`, `tests/action-unique.test.mjs`, et toute autre qui échoue pour cette seule raison). Ne supprimer aucun test, n'affaiblir aucune doctrine testée (`doctrine-visible`, brand-os, false-claims). Le test de `action-unique` qui vérifie « Chercheurs du MIT » reste valable (l'étiquette est inchangée).
- `AGENTS.md` et `TRUTH.md` : là où ils citent une phrase remplacée (« Parrit.ai, c'est une équipe. »…), mettre la nouvelle avec la mention « décision de Paul du 21/11/2026 ». `public/llms.txt` (ou son générateur `scripts/generate-llms.mjs`) suit les phrases changées.
- La PR #389 (phrase des partenaires) est remplacée par celle-ci : ne pas la reprendre.

## Accueil (/fr et son équivalent anglais)

| Avant (mot pour mot) | Après |
|---|---|
| une flotte d'agents autonomes | des assistants coordonnés |
| Les clients silencieux, avec une raison de les rappeler. | Vous repérez les clients à rappeler et pour quel motif. |
| Les décisions de la réunion, et qui s'en charge. | Vous retrouvez les décisions et les personnes chargées de les appliquer. |
| Des agents qui se répartissent le travail, sous votre contrôle. | Des assistants se répartissent le travail. Vous gardez le contrôle. |
| Un outil à vous, construit sur votre métier. | Nous construisons votre outil à partir de votre métier. |
| Un état des lieux, puis un plan par priorité. | Nous examinons votre travail et définissons les priorités avec vous. |
| Un cadre pour coder avec l'IA sans casser la production. | Vos développeurs utilisent l'IA sans perturber les logiciels en service. |
| Un prototype qui tourne, pour décider sur pièce. | Vous testez une première version pour décider de la suite. |
| Agents autonomes | Assistants coordonnés |
| Code fiable | Code contrôlé |
| Deux métiers, une même transformation. | Vos équipes prennent l'IA en main. Nous construisons vos outils. |
| Une gouvernance claire : qui utilise quoi, avec quelles règles | Vous définissez qui utilise l'IA et selon quelles règles. |
| Choisir les priorités, puis livrer des solutions rapides. | Nous choisissons les priorités avec vous, puis construisons les outils. |
| Pour chaque besoin, nous choisissons la meilleure technologie. | Nous choisissons les outils selon votre besoin. |
| Parrit.ai, c'est une équipe. Plus de vingt partenaires, et pour chaque projet ceux dont vous avez besoin. | Nous faisons appel à des partenaires pour construire vos outils et accompagner vos équipes selon votre projet. |
| Plus de dix, chacun sa spécialité : documents, assistants, connexion à vos logiciels. | Les ingénieurs interviennent selon leur spécialité sur les documents, les assistants ou les liens entre logiciels. |
| Des développeurs et des studios : assistants écrits, vocaux et vidéo. | Des développeurs et des studios créent vos assistants écrits, vocaux et vidéo. |
| Conduite du changement et pilotage de projet. | Nous accompagnons vos équipes et suivons le projet. |
| Image de marque, contenus et vente. | Nos partenaires travaillent sur votre marque, vos contenus et vos ventes. |
| Une quinzaine d'intervenants et un organisme certifié. | Des intervenants accompagnent vos équipes dans la prise en main de l'IA. |
| Des cabinets partenaires et des relecteurs de nos livrables. | Des cabinets partenaires relisent les travaux que nous vous remettons. |
| Des chercheurs du MIT dans notre réseau, pour vos déploiements d'assistants les plus exigeants. | Des chercheurs du MIT font partie de notre réseau. |
| Une équipe composée pour chaque diagnostic, et ce qu'elle livre | Nos partenaires interviennent selon les besoins du projet. |
| Par un premier échange de 15 minutes en visioconférence, puis un cadrage écrit, ou un refus motivé si nous ne sommes pas les bons interlocuteurs. | Nous échangeons pendant 15 minutes en visioconférence, puis nous définissons le travail par écrit. Si nous ne pouvons pas vous aider, nous vous expliquons pourquoi. |
| Pour chaque besoin, la plus adaptée : ChatGPT, Claude, Gemini, Mistral, Copilot, entre autres, sans dépendre d'un seul fournisseur. | Nous choisissons selon votre besoin parmi ChatGPT, Claude, Gemini, Mistral, Copilot et d'autres outils. Nous ne dépendons pas d'un seul fournisseur. |
| Oui. L'équipe se compose selon le diagnostic, parmi plus de vingt partenaires. | Oui. Nous choisissons les intervenants selon les besoins de votre entreprise. |
| Paul Larmaraud, fondateur de Parrit.ai | Vous échangez avec Paul Larmaraud |
| Il a créé Parrit.ai en 2024, après deux ans chez Lime. | À supprimer |
| Le premier échange se fait avec lui : vous lui parlez de votre projet. | À supprimer |
| Premier échange de 15 minutes en visioconférence : vous présentez votre besoin, nous vous indiquons ce qui est réalisable. | Pendant les 15 minutes en visioconférence, vous présentez votre besoin. Nous vous indiquons ce qui est réalisable. |

Bloc du fondateur, résultat attendu : le titre « Vous échangez avec Paul Larmaraud », puis le seul paragraphe « Prise en main de l'IA, développement sur mesure, expertise métier, recherche : le travail se fait ensuite avec l'équipe adaptée à votre projet. » (conservé : décision de Paul des 13 et 14/11, le site ne présente jamais un fondateur qui fait tout), puis le bouton et l'e-mail. Dans `AGENTS.md`, la section « Une équipe, décision de Paul des 13 et 14/11/2026 » devient : section partenaires ouverte par la nouvelle phrase des partenaires ; bloc contact sans date de création ni parcours du fondateur (décision de Paul du 21/11/2026 : rien de pompeux sur le fondateur), avec la phrase du travail en équipe. Le reste de la section tient.

Note : l'accueil affiche « Paul Larmaraud, » et « fondateur de Parrit.ai » en deux morceaux (`home-layers.ts`, clé `contact`). Le titre remplacé est la ligne entière.

## Rendez-vous (/fr/rendez-vous)

| Avant (mot pour mot) | Après |
|---|---|
| Entretien stratégique IA, 15 minutes | Premier échange de 15 minutes |
| 15 minutes avec Paul Larmaraud pour clarifier votre sujet. Vous repartez avec une première piste, et vous décidez de la suite. | Vous échangez avec Paul Larmaraud sur votre besoin pendant 15 minutes. Vous examinez une première piste et décidez de la suite. |

Le titre de l'onglet devient « Premier échange, 15 minutes · Parrit.ai ». Anglais : « First call, 15 minutes ».

## Journal (/fr/journal, en-tête)

| Avant (mot pour mot) | Après |
|---|---|
| Ce journal s'écrit sur les chantiers. | Ce journal raconte le travail sur des systèmes d'IA en entreprise. |
| Ce qui a tenu et ce qui a cassé sur des systèmes d'IA en entreprise, daté et consigné. | Les articles décrivent ce qui a fonctionné et ce qui a échoué, avec les dates et les constats. |

## Vérification

`npm ci && npm run lint && npm run build -- --webpack && npm test` vert. Puis rechercher dans `src/` et `public/` chaque chaîne « Avant » : aucune ne doit rester visible (hors archives et docs).
