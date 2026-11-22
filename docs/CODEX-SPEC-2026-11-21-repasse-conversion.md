# parrit.ai : repasse de conversion (grand compte et dirigeant de PME)

Niveau de risque : moyen (balisage, styles et libellés de l'accueil, de la page de rendez-vous et du bloc de fin d'article ; aucun prix, aucun envoi, aucun fichier juridique).

S'applique après la PR 400 (le rendez-vous ne porte le nom de personne).

## Demande de Paul (21/11/2026, nuit)

« C'est pas forcément Paul. » ; « Photos de Paul, pas besoin en bas. » ; « Fais une repasse en mode grands comptes ou dirigeant de PME pour que ça convertisse mieux. » ; « En termes d'alignement et de cohérence aussi, place les choses pour que le cerveau s'y retrouve. » ; « "Nous écrire", par exemple, n'est pas du tout appealing. »

## Sources

- Relevé mesuré de toutes les actions de l'accueil, section par section (site construit, 1440 × 900 et 390 × 844).
- Deux lectures du site en rôle, sur captures : une directrice de la transformation d'un groupe de 4 000 salariés, un dirigeant de PME de 45 salariés.
- Grille d'ergonomie interne (premier écran, actions, langage visuel, confiance).

## Constats (mesurés ou lus par les deux lecteurs)

1. Entre le bouton du premier écran (y = 553 px) et celui du bloc de contact (y = 5 573 px), la page ne propose aucune prise de rendez-vous : 5 000 px sur ordinateur, autant sur téléphone. La seule action intermédiaire, « Lire nos retours de terrain », fait quitter la page.
2. Le bloc de contact enchaîne un bouton « Prendre rendez-vous » qui mène au calendrier placé juste dessous, un lien « Nous écrire » qui ouvre un courriel, un calendrier, puis un formulaire « Vous préférez écrire ? » : deux chemins d'écriture pour la même chose, et un bouton qui ne produit rien de visible.
3. Un portrait sans nom à côté du titre : « c'est qui ? ». Paul n'en veut plus.
4. « Nous écrire » ne dit ni ce qu'on écrit ni ce qu'on obtient.

## Décisions (Paul, le 21/11/2026 au soir, sur cette opération du site : « Je te donne carte blanche. »)

1. **Bloc de contact de l'accueil**, de haut en bas, tout au bord gauche :
   - le titre « Commencez par une tâche précise. » et son paragraphe, inchangés ;
   - un intertitre « Choisissez un créneau. » / « Pick a time. », puis le calendrier ;
   - un intertitre « Aucun créneau ne vous convient ? » / « No time that suits you? », la phrase « Laissez votre adresse électronique. Nous vous répondons par courriel. » / « Leave your email address. We reply by email. » (aucune promesse nouvelle : le message de confirmation dit déjà « Parrit.ai l'étudie et vous répond par e-mail » ; la première version, « Nous vous proposons un autre moment. », engageait à proposer un créneau et a été retirée à la relecture), le champ et son bouton « Être recontacté » / « Request a reply » (libellé court : sur téléphone, un libellé long ne laisse que 88 px au champ), puis les deux phrases existantes (« Pendant les 15 minutes… » et « Aucune relance automatique. »), inchangées.
   - Sont supprimés du bloc : le portrait, le lien « Nous écrire », le grand bouton « Prendre rendez-vous » (le calendrier est l'action). La source `rdv-contact` n'a plus d'émetteur.
2. **Une prise de rendez-vous à mi-page** : à la fin de la section « Trois étapes, vous commencez où vous voulez. », sous « Déjà équipés ? … », un bouton principal de taille normale « Prendre rendez-vous » / « Book a call », source `rdv-parcours`, qui mène à `#contact`. Même libellé et même destination que les autres : l'action reste unique, elle a un emplacement de plus. Ceci amende « aucune action au parcours » (08/11/2026).
3. **Page de rendez-vous** : le lien « Nous écrire » / « Write to us » devient « Décrire votre besoin par courriel » / « Describe your need by email ». **Bloc de fin d'article ou de page d'offre** : après la phrase qui dit déjà « par courriel », le lien devient « Ouvrir un courriel » / « Open an email ».
4. **Suites de la relecture de la PR 400** : le commentaire de `booking.css` et la phrase d'`AGENTS.md` disent que le cadre du calendrier s'arrête à 800 px.
5. **Correctif d'un défaut de la PR 400** : sur téléphone, le conteneur du calendrier imposait 560 px de hauteur minimale pendant son montage, soit 12 px de plus que la réserve de 548 px. Le bloc de contact sautait de 12 px puis revenait (relevé par `tests/stabilite.spec.ts` rejoué en local à 390 × 844). Le conteneur n'impose plus de hauteur : la réserve est portée par la scène seule.

## Règles

- Aucun autre texte ne change. `tests/style-site.test.mjs` et `tests/densite-pages.test.mjs` restent verts sans être assouplis ; le garde-fou visuel `tests/coherence-visuelle.spec.ts` aussi.
- Les seuils de géométrie (« un bloc = un écran »), de contraste et de stabilité ne changent pas. La section du parcours doit toujours tenir dans l'écran à 1440 × 800, 1280 × 720 et 390 × 700 avec son bouton.
- Les tests qui exigeaient le bouton du contact (`rdv-contact`) exigent désormais celui du parcours (`rdv-parcours`) ; ceux qui exigeaient le portrait exigent son absence.
- Les fichiers du portrait restent dans `public/brand/founder/` (aucune suppression de fichier dans ce lot).

## Hors de ce lot, à proposer à Paul

- Un lien vers les pages d'offre depuis les deux cartes d'offre de l'accueil (elles ne sont atteignables que par le pied de page) : il faut décider quelle page va sous quelle carte.
- Une ligne sous les logos des clients disant ce qui a été fait pour qui : chaque mention doit être sourcée et autorisée.
- Sur téléphone, la seconde carte d'offre et les étapes 2 et 3 sont hors écran (défilement latéral).
- La carte « Chercheurs du MIT », jugée décorative par la lectrice grand compte.

## Critères d'acceptation

- Sur l'accueil, la distance entre deux prises de rendez-vous ne dépasse pas 3 000 px sur ordinateur. Mesuré après changement à 1440 × 800 : bouton du héros à y = 553 px, bouton du parcours à y = 3 199 px (2 646 px), titre du bloc de contact à y = 5 342 px (2 143 px).
- Le bloc de contact ne contient plus ni image, ni lien `mailto`, ni bouton vers `#reservation`.
- `npm run lint && npm run build -- --webpack && npm test && npm run qa:claims:rev01 && npm run qa:brand:rev01` verts ; CI verte.
