# CODEX SPEC — Hero de conversion, sur le modèle Studeria / Alegria

Niveau de risque : moyen (premier écran). À lancer sur `origin/main` **après la fusion de la PR #371** (action unique « Prendre rendez-vous »).

## Décision de Paul (08/11/2026, nuit)

« La première page ne convertit pas bien. Il y a un trop gros espace sous le call to action. Problème de cohérence et de visibilité pour la conversion. Il ne faut qu'un call to action. Reprendre la UX UI des concurrents en termes d'endroit où positionner les choses, viser quelque chose de symétrique, de réussi : c'est du travail fait par des professionnels. »

Agents de conversion (round 0, `~/parrit-canon/docs/site-benchmark/personas/ROUND-0-2026-11-08.md`) : 5/5 jugent le schéma du hero « illisible » ou « décoratif ».

## Le modèle à reproduire (captures : `~/parrit-canon/docs/site-benchmark/captures/studeria-1440-hero.png`, `alegria-1440-hero.png`)

Un bloc texte compact, centré verticalement, qui se lit de haut en bas sans trou :
1. surtitre court ; 2. H1 ; 3. sous-titre de deux lignes ; 4. **un seul bouton** ; 5. **la preuve collée sous le bouton** ; et sur l'autre moitié, **une vraie photo** de session.

## Nouveau hero (ordinateur ≥ 1100 px)

- **Grille deux colonnes égales** (`1fr 1fr`), gouttière `var(--brand-s6)`, contenu centré verticalement, hauteur du hero = hauteur utile de l'écran à 1440×800 (barre comprise), fond canard.
- **Colonne gauche, dans cet ordre, espacements réguliers en jetons Brand OS** :
  1. surtitre : « Transformation IA · Développement de logiciels » / « AI transformation · Software development » (petite taille, couleur d'accent claire du registre sombre) ;
  2. H1 inchangé : « Votre expertise est la matière première. **Nous la mettons au travail.** » ;
  3. sous-titre de la PR #371 (« Vos équipes prennent l'IA en main. Nous développons les logiciels qui leur manquent. ») ;
  4. le bouton unique « Prendre rendez-vous » (version large de #371, flèche, respiration) ;
  5. **directement dessous**, à `var(--brand-s2)` : la phrase « Vos équipes gardent la décision. Aucune relance automatique. » puis une **rangée de 4 logos clients** en blanc (masques existants, `getSiteEvidence`/`publicationLogo`) précédée de « Ils nous font confiance » / « Trusted by » ; choisir Toyotomi, SNCF, Hiolle Technologies, Laparra si autorisés, sinon les 4 premiers autorisés.
- **Colonne droite** : la photo réelle `formation-equipes` (déjà dans `public/photos/session/`), en `cover`, cadre plein de la colonne, radius 0, sans ombre ; légende discrète sur aplat encre « Prise en main par les équipes ». `fetchpriority="high"`, pas de lazy, dimensions explicites.
- **Plus rien sous le bouton** que la preuve : la légende, la carte et la citation du schéma quittent le hero.

## Le schéma trois plans

Il n'est pas supprimé : il **déménage** dans sa propre section, juste après « Deux métiers, une même transformation », titre « Comment l'IA travaille avec vos outils. » / « How AI works with your tools. », avec sa légende, sa carte et sa citation, son animation et ses quatre histoires inchangées. Mêmes contrats d'animation (un minuteur, nettoyage hors écran, mouvement réduit) ; « un bloc = un écran » s'y applique désormais.

## Téléphone (< 760 px) et tablette

Ordre : surtitre, H1, sous-titre, bouton pleine largeur, preuve (phrase + logos sur une ligne défilable ou 2×2), puis la photo pleine largeur en 4:3 sous le bloc. Tout le texte + le bouton visibles sans défiler à 390×844.

## Symétrie et cohérence

- Bords gauche du surtitre, du H1, du sous-titre, du bouton et de la preuve alignés à 1 px.
- Haut de la photo aligné sur le haut du surtitre, bas de la photo aligné sur le bas de la rangée de logos (± 4 px) à 1440×800 et 1280×720.
- Un seul `exec` rose à l'écran ; la navigation reste `ghost`.

## Contrats et tests

Mettre à jour `AGENTS.md`/`TRUTH.md` : « Hero de conversion, décision de Paul du 08/11/2026 : deux colonnes, photo réelle, un bouton, preuve sous le bouton ; schéma trois plans dans sa propre section ». Remplacer les tests de géométrie du hero qui supposent le schéma par ceux ci-dessus ; **ne rien assouplir** ailleurs (stabilité, CLS, Brand OS, deny-all, « un bloc = un écran », 1440×800). Tests FR/EN, avec et sans JS, mouvement réduit : ordre des éléments, alignements à 1 px, écart bouton → preuve ≤ `var(--brand-s3)`, aucun vide > 48 px entre deux éléments de la colonne gauche, photo chargée sans lazy, logos autorisés uniquement, schéma présent dans sa nouvelle section avec ses quatre histoires. Batterie : `npm ci --silent && npm run lint && npm run build -- --webpack && npm test`. Ne pas committer les PNG réécrits sous `.codex-handoffs/brand-os-p1/after/`.
