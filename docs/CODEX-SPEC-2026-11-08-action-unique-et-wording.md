# CODEX SPEC — Une seule action, un seul libellé, et le wording de la transformation

Niveau de risque : moyen (textes et boutons de l'accueil, nouveaux clients publiables). À lancer sur `origin/main` (PR #369 fusionnée). **Remplace** `docs/CODEX-SPEC-2026-11-08-cta-tournant-dirigeants.md` (abandonnée, ne pas l'implémenter).

## Décisions de Paul (08/11/2026, nuit)

- « Le problème, c'est les call to action : il y en a trop. » « Que le site et les call to action soient beaucoup plus propres. »
- « On ne parle pas de formation : on parle de prise en main, d'accompagnement au changement. On est toujours dans la transformation. On n'est pas dans le conseil et les outils. » « Parler d'un projet, ça ne veut rien dire. » Les axes : **transformation IA** et **développement de logiciels**, pour les **PME, ETI et grands groupes**.
- « Tu peux mettre aussi Toyotomi Europe, Hiolle Technologies, Carte Noire » (clients publiables).

## Ce que montrent les concurrents (mesure du 08/11, accueil à 1440 px, boutons hors en-tête et pied)

| Site | Boutons | Libellés |
|---|---|---|
| Studeria | 14 | « Former mes équipes » répété partout, plus « Prendre rendez-vous » |
| AI Sisters | 42 | « Prendre rendez-vous » répété ; les autres liens mènent à des preuves (cas clients, avis, presse) |
| Alegria | 23 | un choix de public en haut, puis un seul « Parler de mon projet IA » |
| Parrit avant | 14 | 4 libellés différents mélangés (projet, formation, priorités, recontacté) |

Règle retenue : **une seule action, un seul libellé, partout** ; les autres liens mènent à du contenu ou à des preuves, jamais à une variante d'action.

## 1. L'action unique

- Libellé unique : **« Prendre rendez-vous »** / **« Book a call »**, partout où un bouton mène au contact : barre de navigation, hero, bandeau final. Toujours `exec` (rose), toujours vers `/#contact` ou `/fr#contact`, `source=rdv-{nav,hero,bandeau}` via `avecSource`.
- **Supprimer** tous les autres boutons d'action de l'accueil : le `ghost` « Former mes équipes » du hero, celui de « Sur le terrain », les trois boutons des cartes d'offre, les trois boutons des étapes du parcours, le `ghost` du bandeau final. Le composant `ContactIntentLink` et les sources `intention-*` ne servent plus sur l'accueil (conserver la lecture des anciennes `source` côté QuickCapture pour les liens déjà diffusés).
- Le bouton d'envoi du formulaire de contact garde son rôle ; le lien « Le Journal » de la section articles reste (contenu, pas action).
- Contrats à mettre à jour avec la mention « décision de Paul du 08/11/2026, nuit » : hero à **une** action, libellé unique, aucun autre CTA. Ne pas assouplir les seuils géométriques, `doctrine-visible` (un seul rose par écran) reste vrai : vérifier qu'aucun écran ne voit deux `exec`.

## 2. Le wording (français pensé en français, phrases courtes ; anglais réécrit, pas traduit)

| Endroit | Avant | Après FR | Après EN |
|---|---|---|---|
| Sous-titre du hero | Nous formons vos équipes à l'IA et construisons les outils qui leur manquent. | Vos équipes prennent l'IA en main. Nous développons les logiciels qui leur manquent. | Your teams take AI in hand. We build the software they are missing. |
| Section offres, titre | Par où commencer | Deux métiers, une même transformation. | Two crafts, one transformation. |
| Carte 1 surtitre / titre | Formation · Former vos équipes | Transformation IA · Vos équipes prennent l'IA en main. | AI transformation · Your teams take AI in hand. |
| Carte 1 coches | (anciennes) | Prise en main sur vos outils et vos documents · Accompagnement au changement, du comité de direction aux équipes métier · Une gouvernance claire : qui utilise quoi, avec quelles règles | Hands-on work with your own tools and documents · Change management, from the executive committee to every team · Clear governance: who uses what, under which rules |
| Carte 2 surtitre / titre | Conseil · Grands groupes | Développement de logiciels · Ce qui manque, nous le construisons. | Software development · What is missing, we build. |
| Carte 2 coches | (anciennes) | Des outils sur mesure, reliés à vos logiciels · Des assistants que vos équipes relisent et valident · Installés chez vous si vos données l'exigent | Custom tools connected to your software · Assistants your teams review and approve · Installed on your servers when your data requires it |
| Carte 3 | PME et ETI | **Supprimée** (deux cartes seulement, même gabarit sombre, sans bouton) | removed |
| Sous les cartes | (rien) | Pour les PME, les ETI et les grands groupes. | For SMEs, mid-sized companies and large groups. |
| Sur le terrain, sous-titre | Nous formons et construisons dans vos locaux, sur vos outils. | Dans vos locaux, sur vos outils, avec vos équipes. | On your premises, with your tools and your teams. |
| Légende photo 1 | Formation des équipes | Prise en main par les équipes | Teams taking AI in hand |
| FAQ « Faut-il des équipes techniques ? » | Non. Nous formons vos équipes sur leurs outils, puis… | Non. Vos équipes prennent l'IA en main sur leurs outils, puis nous construisons des assistants qu'elles relisent et valident. | No. Your teams take AI in hand with their own tools, then we build assistants they review and approve. |

- Chercher sur l'accueil (FR/EN, y compris `llms.txt`, métadonnées, OG si elles reprennent le sous-titre) toute autre occurrence visible de « formation », « former », « formons », « conseil et outils », « parler d'un projet » et l'aligner sur ce vocabulaire (prise en main, accompagnement au changement, transformation IA, développement de logiciels). Ne pas toucher au Journal ni aux mentions légales. Le titre H1 reste inchangé.
- Interdits : tiret cadratin et demi-cadratin, « afin de », adjectifs creux, point final dans un bouton.

## 3. Trois nouveaux clients publiables

- Ajouter **Toyotomi Europe**, **Hiolle Technologies**, **Carte Noire** à `PUBLIC_CLIENT_NAMES` et au registre `getSiteEvidence` / `publicationLogo`, « décision nominative de Paul Larmaraud du 08/11/2026, sans accord écrit des clients », comme les cinq existants.
- Logos sources (lecture seule, hors dépôt) : `~/parrit-canon/docs/site-benchmark/logos-clients/toyotomi.png` (en-tête de toyotomi.eu, relevé le 08/11/2026), `hiolle-technologies.svg` (en-tête de hiolle-technologies.fr, 08/11/2026), `carte-noire.png` (fichier d'archive de Paul). Les convertir au même format que les logos existants (masque monochrome, même hauteur optique), servis depuis `public/clients/`, provenance ajoutée dans `public/clients/SOURCES.md`. Si un fichier ne se convertit pas proprement, s'arrêter et le dire ; ne rien redessiner.
- Les huit logos entrent dans la bande des références avec l'éclairage tournant existant ; la bande respecte toujours sa largeur maximale (1060 px) : réduire l'espacement ou passer à deux rangées sur ordinateur si nécessaire, sans découpe.
- Le Journal ne nomme toujours aucun client.

## Tests

FR/EN, ordinateur et téléphone, avec et sans JS : un seul libellé d'action sur tout l'accueil (« Prendre rendez-vous » / « Book a call ») ; exactement 3 boutons d'action hors formulaire (nav, hero, bandeau) ; aucun `ghost` d'action restant ; `source=rdv-*` correctes ; aucune occurrence visible de « formation », « former », « formons », « Parler d'un projet » sur l'accueil ; deux cartes d'offre sans bouton ; 8 logos, tous dans la bande ; hero à 1440×800, « un bloc = un écran », stabilité, Brand OS, deny-all inchangés. Batterie : `npm ci --silent && npm run lint && npm run build -- --webpack && npm test`. Ne pas committer les PNG réécrits sous `.codex-handoffs/brand-os-p1/after/`.
