# Tour 2 de la nuit du 27/10 : revue « dirigeant pressé » (carte blanche de Paul)

Revue faite sur captures FR/EN, 1440×800 et 390×844, après la PR #347. Périmètre : copie et mise
en page, risque faible. Ne pas toucher : le hero (« c'est canon »), les boutons, Cal.com, les offres.

1. **Téléphones des applications** (`#en-production` / `#in-production`) : à 1440×800, la moitié
   basse des trois écrans reste vide une fois les messages affichés (hauteur fixe
   `calc(var(--brand-s6) * 9)`). Ramener la hauteur commune à ce que demande la scène la plus longue
   (FR et EN, toutes tailles), plus un rembourrage d'une ligne de message. Les trois téléphones
   gardent strictement les mêmes dimensions entre eux (contrôle existant conservé), aucun message
   coupé ni barre de défilement, mouvement réduit et sans JS compris.
2. **Scène du grossiste** : « l'offre avocat Hass » se lit comme un avocat (métier) juste à côté de
   la scène du cabinet d'avocats, et la tâche dit « pour jeudi » puis l'agent répond « pour le
   8 octobre » (date passée, incohérente). Remplacer :
   - « Tâche pour Commercial 1 : relancer Client A sur l'offre de clémentines, pour jeudi. » /
     « Task for Sales 1: follow up Client A on the clementine offer, by Thursday. »
   - « Je crée cette tâche : relancer Client A, à faire par Commercial 1, pour jeudi. Tu confirmes ? » /
     « I'm creating this task: follow up Client A, owner Sales 1, due Thursday. Confirm? »
3. **Références** : retirer le lien isolé « Ce que nous écrivons » / « What we write » sous les logos
   (le Journal reste accessible par le pied de page ; vérifier qu'un lien Journal y est bien présent
   en FR et EN, sinon ne rien retirer et le signaler). Équilibrer la taille optique des cinq logos :
   Forexpert et SNCF paraissent nettement plus petits que Laparra et Joone. Une hauteur cible par
   logo (dans le registre ou le CSS des logos), sans déformer, sans changer les fichiers d'image.
4. **Fondateur** : sur ordinateur, ~100 px de vide entre le titre « Paul Larmaraud, fondateur de
   Parrit.ai » et la première ligne (la photo couvre deux lignes de grille et étire la première).
   Le titre et le texte doivent se suivre avec l'espacement normal d'un titre de section ; la photo
   garde son cadrage 3:4 entier.
5. **Formulaire « Vous préférez écrire ? »** : le texte du bouton « Être recontacté » touche le bord
   de son cadre à 1440. Rembourrage horizontal normal des boutons, une seule ligne, sans déborder du
   champ ni de la grille.

## Contrôles

- Tests existants conservés sans assouplissement ; ajouter : hauteur des téléphones ≤ contenu le
  plus long + une marge (et ≥ ce contenu), trois téléphones identiques ; aucune date en dur dans
  les scènes ; aucun lien Journal dans `#references` et un lien Journal dans le pied FR/EN ; écart
  titre → première ligne du fondateur ≤ 40 px à 1440×800 et 1280×720 ; bouton du formulaire avec
  un rembourrage horizontal ≥ 16 px et texte non débordant.
- Batterie : `npm ci && npm run lint && npm run build && npm test && npm run qa:brand:rev01 &&
  npm run qa:claims:rev01 && npm run test:brand-os` ; navigateur rejoué par Claude sur l'hôte.
