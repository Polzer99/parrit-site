# parrit.ai : un seul système visuel sur tout le site

Niveau de risque : moyen (CSS et balisage de toutes les pages publiques, aucun texte de fond, aucune logique).

S'applique après la PR 397 (branche de départ : `cf50cb8`).

## Demande de Paul (21/11/2026, soir)

« Tu n'écoutes jamais mes conseils : visuellement, toujours un manque de cohérence et d'alignement. Les blocs ne sont pas lisibles ni visuels. » ; « Standard Palantir, les top standards qu'on a. » ; « Apporter de la cohérence, surtout, et enlever l'inutile. » ; « Les gens doivent savoir comment l'utiliser en regardant directement la page. »

## Source

`docs/AUDIT-VISUEL-2026-11-21.md` : mesures du site (titres, axes, marges, cartes, boutons, longueurs de ligne), comparaison avec Craft AI, Galadrim, 1600.agency et Palantir, système cible (partie 3), changements fichier par fichier (partie 4), suppressions (partie 5). **La partie 3 est la spec. La partie 4 est l'ordre de travail.** La charte ne change pas : couleurs, General Sans, pas d'arrondi, pas d'ombre, pas de dégradé.

## Décisions prises (Paul a donné carte blanche)

1. **Le calculateur est déjà supprimé** de l'accueil (PR 397). Tout ce que l'audit dit des calculateurs est sans objet.
2. **Partenaires** : les sous-listes (23 lignes « Avec eux, nous livrons ») sortent de la page et du HTML. Sept cartes : un pictogramme, un titre, une phrase. `PARTNER_OFFERS` et le mécanisme de défilement des offres sont supprimés s'ils ne servent plus. Cette décision remplace le contrat du 27/10/2026 sur les 23 offres.
3. **« Déjà équipés ? … »** reste sous les trois étapes, sur la largeur de lecture (deux lignes), sans autre changement.
4. **« Pour les PME, les ETI et les grands groupes. »** remonte sous le titre des offres, comme phrase d'introduction.
5. **Presse** : texte à gauche, chiffre à droite. Le chiffre est le nombre d'articles publiés et indexables du Journal dans la langue de la page, calculé depuis le registre (`getAllJournalEntrySummaries`), avec la légende « articles publiés dans le Journal. » / « articles published in the Journal. ». Jamais écrit en dur.
6. **Pages d'offre** : titre à 54 px à gauche ; à droite du titre, les quatre noms d'étape numérotés en colonne (une liste, pas des titres). Les exemples de tâches en trois cases avec pictogramme. Les numéros d'étape en 40 px. Les coches à la place des puces dans « vous recevez ». Dans « À lire dans le Journal », le titre et la date de chaque article, sans extrait.
7. **Page de rendez-vous** : texte en haut à gauche, calendrier dessous sur toute la largeur (amendé après relecture : dans une colonne de 617 px le calendrier Cal.com passe en disposition étroite, que personne n'a pu voir). Le bandeau en capitales et le pied « VISIO » du calendrier disparaissent sur cette page.
8. **Mentions légales** : le filet de 2 px disparaît (feuille de style seulement). Le fichier de la page (`src/system/pages/legal.tsx`) n'est pas modifié : le retrait du second « Dernière mise à jour » sort de ce lot, il touche un fichier juridique et attend l'accord de Paul.
9. **Gras dans les titres** : seule la seconde phrase du titre principal de l'accueil reste en gras.
10. **Boutons** : un principal (rose, filet 2 px, flèche), grand au héros de l'accueil, au héros des pages d'offre et au contact, normal ailleurs ; un secondaire en contour. Le fond canard disparaît des boutons. Les tests `audit-readability.spec.ts` et `single-page.spec.ts` définissent ce qui est « grand » : si le héros des pages d'offre passe en grand, la définition de `prominent` du test l'inclut, sans changer ses seuils (22 px, 48 px mini, graisse 600).

## Règles

- Aucun texte de fond ne change, sauf les suppressions listées et la légende du chiffre de la presse. `tests/style-site.test.mjs` et `tests/densite-pages.test.mjs` restent verts sans être assouplis.
- Les tests de géométrie (« un bloc = un écran » à 1440×800, 1280×720, 390×700), de contraste et de stabilité gardent leurs seuils. Mesurer la hauteur des blocs après chaque étape qui la change.
- Aucune couleur littérale : uniquement des jetons (`var(--…)`). `npm run qa:brand:rev01` vert.
- Garde-fou nouveau : `tests/coherence-visuelle.spec.ts`, ajouté à `qa:network:rev01`. Sur l'accueil, une page d'offre, l'index du Journal, un article, `/rendez-vous` et les mentions légales, en FR et en EN, à 1440×800 et 390×700 : une seule taille calculée par niveau de titre (les deux exceptions nommées dans l'audit, pas d'autre), tous les titres de section au même bord gauche que le conteneur, une seule hauteur par taille de bouton, aucun paragraphe de plus de 80 caractères par ligne, un seul gris de filet par fond.
- `DESIGN.md` décrit le système (partie 3 de l'audit, en vingt lignes au plus). `AGENTS.md` reçoit une décision datée de cinq lignes.

## Critères d'acceptation

- Les incohérences de gravité 1 et 2 de la partie 2 de l'audit ont disparu, captures avant et après à l'appui (`docs/captures/2026-11-21-coherence-visuelle/`), mesures dans `docs/REPORT-2026-11-21-coherence-visuelle.md`.
- `npm run lint && npm run build -- --webpack && npm test && npm run qa:claims:rev01 && npm run qa:brand:rev01` verts.
