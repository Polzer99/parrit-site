# CODEX SPEC — 08/11/2026 — Boutons par intention et finitions visuelles

Niveau de risque : moyen (structure et boutons de l'accueil, index du Journal). Aucune donnée, aucun prix, aucun envoi, aucun changement de base.

## Décision

Paul, 08/11/2026 : « avoir des calls to action qui soient différents en fonction de si la personne veut se former, si elle veut parler d'un projet, etc. » et « mettre en production des améliorations visuelles pour que ce soit esthétiquement appealing ». Pas de webinaire pour l'instant.

Source : étude `~/parrit-canon/docs/site-benchmark/ETUDE-CONCURRENTS-2026-11-08.md` (les trois concurrents font entrer le visiteur par son intention ; Parrit n'a qu'un bouton).

Principe : s'intégrer dans l'existant. Les trois étapes « Apprendre / Améliorer / Construire » sont déjà les trois intentions ; on leur donne chacune leur bouton.

## 1. Boutons par intention

Toutes les destinations restent `#contact` (`/#contact` ou `/fr#contact`), avec un paramètre `?source=` placé AVANT l'ancre (`/fr?source=intention-formation-hero#contact`), qui dit l'intention. Le clic ne doit pas recharger la page si le visiteur est déjà sur l'accueil : défilement vers `#contact` et `source` mémorisé pour le formulaire. Réutiliser l'utilitaire existant qui pose `source` (chercher `avecSource` ou équivalent) plutôt qu'en écrire un second. Le formulaire `QuickCapture` transmet déjà `source` et les `utm_*` : **aucun nouveau champ, aucune modification du chemin serveur ni de la base**. Valeurs de `source` : `intention-formation`, `intention-priorites`, `intention-projet` (suffixe `-hero` ou `-parcours` selon l'emplacement).

### Hero

Deux actions, selon la règle des boutons du dépôt : `exec` puis `ghost`, espacement `var(--brand-s2)`, même hauteur et même ligne de base.

| | FR | EN | Destination |
|---|---|---|---|
| `exec` (inchangé) | Parler d'un projet | Talk about a project | `?source=intention-projet-hero#contact` |
| `ghost` (nouveau) | Former mes équipes | Train my teams | `?source=intention-formation-hero#contact` |

Sur ordinateur, les deux boutons sont sur une ligne, à leur largeur de contenu. Sur téléphone, les deux en pleine largeur, l'un sous l'autre. **Le hero entier, barre comprise, tient toujours à 1440×800** : si ce n'est pas le cas, le signaler dans le rapport au lieu d'assouplir le contrôle.

### Section « Trois étapes » (`#parcours` / `#path`)

Chaque étape reçoit un lien `ghost` sous son texte (une seule action par carte, qui mène à la destination finale) :

| Étape | FR | EN | `source` |
|---|---|---|---|
| Apprendre | Former mes équipes | Train my teams | `intention-formation-parcours` |
| Améliorer | Choisir nos priorités | Set our priorities | `intention-priorites-parcours` |
| Construire | Parler d'un projet | Talk about a project | `intention-projet-parcours` |

Les cartes des étapes s'alignent : les liens sont sur la même ligne de base dans les trois cartes (sous-grille ou hauteur réservée dès le SSR), carrousel mobile conservé.

### Contact

Sous le bouton d'envoi du formulaire, une ligne en texte discret (FR / EN) :
« 15 minutes en visio. Vous décrivez un service ou un irritant, nous vous disons ce qui est faisable, et ce qui ne l'est pas. »
« 15 minutes by video call. You describe a team or a pain point, we tell you what can be done, and what cannot. »

## 2. Finitions visuelles (Brand OS strict : radius 0, zéro dégradé, zéro ombre, jetons uniquement)

1. **Références en défilement continu** (`#references`) : les logos autorisés défilent lentement en boucle, animation CSS seulement, pause au survol et au focus, **aucun mouvement en mode réduit** (logos statiques, centrés). Les logos et la logique `getSiteEvidence` / `publicationLogo` restent inchangés.
2. **Cartes des trois étapes** : filet de séparation et numéro d'étape alignés, petit état de survol par les jetons (changement de couleur de bordure, pas d'ombre).
3. **Index du Journal** (`/journal`, `/fr/journal`) : chaque carte affiche, en plus du titre, de l'extrait et de la date, **le thème** (si l'article appartient à l'un des quatre thèmes de `journal-themes.ts`) et **le temps de lecture** calculé à partir du texte (arrondi à la minute, minimum 1). Grille sur deux colonnes à partir de 1100 px, une colonne en dessous. Rien n'est inventé : un article sans thème n'affiche pas de thème.

## Hors périmètre

- Texte du hero, titre de l'onglet, meta description, `llms.txt`, données structurées.
- Le titre « Quelques applications concrètes. » et sa note.
- Couleurs, polices, Cal.com, chemin serveur du formulaire, sitemap.
- Webinaire, page d'inscription.

## Tests

- Nouveaux tests FR/EN : deux boutons dans le hero (ordre `exec` puis `ghost`, destinations et `source`), un lien par étape avec la bonne `source`, ligne sous le formulaire présente, défilement arrêté en mouvement réduit, carte du Journal avec temps de lecture.
- Contrôles existants inchangés : géométrie (« un bloc = un écran », hero à 1440×800), réseau deny-all, Brand OS, stabilité.
- Batterie : `npm ci --silent && npm run lint && npm run build -- --webpack && npm test`, verte.
- Ne pas committer les PNG réécrits sous `.codex-handoffs/brand-os-p1/after/` ni la copie de cette spec dans `tmp/`.
- Mettre à jour `AGENTS.md` et `TRUTH.md` (section boutons) avec la mention « décision de Paul du 08/11/2026 ».

## Preuve attendue

Captures FR et EN à 1440×800 et 390×844 : hero, section des étapes, références, index du Journal.

## Correctif après la première passe (PR #365, 08/11)

1. La durée était fausse dans la spec : les rendez-vous Cal.com `paul-larmaraud/audit` et `paul-larmaraud/ai-strategy-meeting` durent **15 minutes** (relevé le 08/11 sur cal.com). La phrase devient :
   « 15 minutes en visio. Vous décrivez un service ou un irritant, nous vous disons ce qui est faisable, et ce qui ne l'est pas. »
   « 15 minutes by video call. You describe a team or a pain point, we tell you what can be done, and what cannot. »
2. **Retirer l'exception ajoutée à `scripts/false-claims-check.mjs`** (`approvedContactCopy`) : le contrôle « call duration » doit rester exactement comme sur `main`. Le commentaire « approved by Paul » était faux. Mettre à jour la fixture `tests/fixtures/contact-expectation.json`, les tests et `AI_CONTEXT.md` en conséquence.
3. Tout le reste de la PR #365 est conservé à l'identique.

## Correctif 2 après tests navigateur sur l'hôte (PR #365, 08/11)

Sur l'hôte, `npm run qa:network:rev01` : 440 réussis, 8 échoués, tous nouveaux par rapport à `main` :

1. `tests/aeration.spec.ts:102` et `tests/audit-readability.spec.ts:27` (FR/EN, 375, 390, 1440) : le bouton `ghost` du hero « Former mes équipes » / « Train my teams » est rendu en **19 px**, hors de l'échelle typographique (attendu 16). Le bouton `ghost` du hero doit suivre la même règle de taille que les autres boutons publics conformes à l'échelle, **sans ajouter d'exception aux contrôles**. Hauteur et ligne de base communes avec le bouton `exec` conservées.
2. `tests/conformity-i18n.spec.ts:145` « French Journal aliases redirect once to the unchanged English article » : la redirection perd la chaîne de requête (`?source=test` attendu, absent). Rétablir la conservation de la requête sur ce saut (règle du dépôt : le `source` et les `utm_*` survivent au saut).

Le sandbox ne peut pas rejouer ces tests navigateur : le dire dans le rapport ; Claude les rejouera sur l'hôte.

## Correctif 3 après tests navigateur sur l'hôte (PR #365, 08/11)

Hôte : 447 réussis, 7 échoués.

1. `tests/audit-readability.spec.ts:27` (FR/EN, 375, 390, 1440) attend **un seul** lien dans `.hero .actions` (`toHaveCount(1)`). C'est l'ancien contrat ; la décision de Paul du 08/11 en met deux. Mettre à jour cette assertion pour exiger exactement **deux** liens, dans l'ordre `exec` puis `ghost`, avec les destinations de la spec. Ne toucher à aucun autre seuil de ce test (tailles, hauteurs, couleurs).
2. `tests/conformity-i18n.spec.ts:132` « header switches paths, saves choice and preserves query/hash » : attendu `/fr/legal?source=test#top`, reçu `/fr/legal?source=test`. Le changement de langue perd désormais l'ancre ; c'est une régression du correctif 2. Rétablir la conservation de la requête **et** de l'ancre, sans casser le correctif 2 (alias français du Journal qui gardent la requête).
