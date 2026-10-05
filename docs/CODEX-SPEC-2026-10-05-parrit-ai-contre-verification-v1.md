# CODEX SPEC — parrit.ai : corrections issues de la contre-vérification du 05/10

Date : 05/10/2026 · Auteur : Claude (relecture, §25) · Base : `origin/main` (`ea06308` = production).
Contre-vérification demandée par Paul (05/10) : quatre relecteurs indépendants, constats vérifiés par Claude. Ce lot
corrige uniquement les écarts à des règles ou décisions DÉJÀ prises. **PR et préversion ; publication après relecture.**
**Ne pas toucher** : hero (textes), photo, offres (structure), Journal (contenu), tokens, polices, « Une commande, pas un
abonnement » (DV-03 ouvert), FAQ sur la maintenance (DV-03), chiffres de /systems (à revalider par Paul).
Référentiel : `/Users/paullarmaraud/parrit-canon-visual-system/brand/verbal/{offers,claims,lexicon,decisions}.json`.

## FIX1 (05/10) — sur le travail présent (ne rien refaire)
Batterie : deux échecs seulement.
1. `tests/brand-os.spec.ts:245-246` : les coins du cadre du hero mesurent 16 px au lieu de 14 px. La règle « même forme de
   coin à toutes les largeurs » s'applique avec la taille d'origine : remettre les coins à 14 × 14 px partout (centrage
   et jambages du §4 conservés). Le test reste tel quel.
2. `tests/doctrine-visible.spec.ts:208` sur /commission (FR, EN, 1440, 390) : l'élément `<i>` rose (le petit carré
   devant « UNE COMMANDE, PAS UN ABONNEMENT » dans `CalInline`) partage l'écran avec le bouton rose « Envoyer à Paul ».
   Le carré prend la couleur du texte de la barre (pas rose) ; le bouton reste l'unique éclat. Test inchangé.
Rien d'autre ne change.

## 1. Scène produit lisible sur mobile (VS-PRODUCT-SCENE, plancher 14 px)
À 375 et 768 px, le texte des bulles (image de 1434 px réduite à ~290-320 px) tombe à 9-10 px et les libellés de la fiche
CRM à 6-8 px. Correction :
- `ProductScene` rend la CONVERSATION en HTML/CSS (vraie messagerie : en-tête « Agent CRM / bot » avec pastille « CRM »,
  date « Aujourd'hui », bulles entrantes blanches et sortantes vertes, heure et coches, boutons « ✅ Oui » / « ✖ Non »,
  zone de saisie « Message »), avec les textes MOT POUR MOT de la scène p2 :
  `/Users/paullarmaraud/parrit-canon-visual-system/brand/visual/sites/handoff/2026-10-04/scene-agent-crm/ocr.txt`
  (« nouveau contact chez Prospect B, vu ce matin » 08:04 ; « Je crée **Contact achat** (acheteur) chez **Prospect B**.
  C'est bon ? » 08:04 ; boutons Oui / Non ; « oui » 08:05 ; « ✅ C'est créé : **Contact achat** (acheteur) chez
  **Prospect B**. » 08:05). La photo de la carte de visite reste une image, découpée de la scène (le PNG existant, région
  de la carte, sans retouche). Corps des bulles ≥ 14 px à toutes les largeurs ; couleurs de la messagerie limitées à
  cette maquette (variables CSS locales au composant, documentées comme « reconstitution d'interface tierce », pas des
  tokens de marque). Repères 1 et 2 posés en HTML sur les bulles (bord gauche, sans recouvrir le texte).
- Fiche CRM : sous 1024 px, pleine largeur du conteneur ; au-delà, largeur 420 px. Si un libellé reste sous 12 px rendu,
  le signaler dans le rapport (c'est une capture réelle, on ne la redessine pas).
- Titre h2 : `text-wrap: balance`, aucune veuve (« la / fiche est créée. » à éviter).
- Libellé « Dans votre CRM » collé à la fiche (8 à 12 px au-dessus), pas flottant.

## 2. Un seul nom par objet (W-48) et énoncé du prix (DV-06 DECIDED)
- Offre sur mesure : nom unique « Système sur mesure » / « Custom system » (offers.json). Remplacer « Commande sur
  mesure » (build-with-you `nextBody`), « custom Commission », et unifier les liens : « Réserver un examen pour un
  système sur mesure » reste un lien de texte. « Commande » comme nom de la page /commission et « Une commande, pas un
  abonnement » ne changent pas.
- Prix : partout « À partir de 3 200 € HT au forfait » / « From €3,200 excl. VAT, fixed price » (carte d'offre de
  l'accueil, /build-with-you, /systems), au lieu de « · forfait » / « · fixed fee ». Le montant vient toujours de la
  config ; insécables entre 3 200, €, HT (aucune coupure « 3 200 € / HT »).
- Action de réservation : libellé unique « Réserver l'examen » / « Book the examination » sur tous les boutons ; les liens
  de pied de page « Commande · réserver un examen » deviennent « Commande · réserver l'examen ».

## 3. Affirmations au-delà des claims
- `manufacture` (FR et EN) : « Chaque nouvelle brique rejoint le système et augmente la valeur des précédentes » →
  « Chaque nouvelle brique rejoint le même système et réutilise ce que les précédentes ont mis en place. » (offers.json
  `compounding_system` : verdict PARTIEL, ne s'énonce pas comme un fait). EN équivalent.
- `standard` : « Une nouvelle brique augmente la valeur des précédentes. » → retirer cette ligne (PS-06) ou la remplacer
  par « Une nouvelle brique réutilise ce qui existe déjà. » ; titre « Six engagements. Chaque système livré les tient. »
  → « Six engagements, vérifiés sur chaque système avant sa livraison. » si et seulement si `claims.json` le permet ; sinon
  « Six engagements que nous appliquons à nos systèmes. » (lire les claims CLM-INT-* et choisir la formulation autorisée ;
  le dire dans le rapport).
- `dossiers` : sceau « En production · La valeur s'accumule » → « En production ».
- `manufacture` : « Quinze minutes avec le fondateur, puis un diagnostic écrit : … » → aligner sur /commission :
  « Quinze minutes avec le fondateur, puis un périmètre écrit, ou un non clair. » (EN équivalent).
- `/systems` : coquille « se contredisent Au 13 septembre » → ajouter le point.

## 4. Accent et composition (W-32, W-10)
- Un seul éclat rose par écran : le lien sous le hero (« Ou réservez l'examen… ») passe en couleur de texte courant
  soulignée (pas rose) ; le lien « Fondée par Paul Larmaraud » du pied de page n'est pas rose ; sur /commission, /systems
  (« Garde-fous » : liens) et /build-with-you, les liens de texte ne sont pas roses — seul le bouton principal de l'écran
  peut l'être. Étendre le test « un éclat rose par écran » à ces pages (1440 et 390).
- Cadre du hero : centré horizontalement sur le texte encadré (écart gauche/droite ≤ 2 px), jambages (« y », « q »)
  à l'intérieur du cadre (marge basse du cadre ≥ la hauteur de jambage), même forme de coin à toutes les largeurs.
- Liste « Des systèmes commandés par » : aucun élément coupé en deux lignes (`white-space: nowrap` par élément).
- Titres de section : `text-wrap: balance` partout où il manque ; aucune veuve.
- `/fr/journal/*` qui servent la page anglaise : ajouter la mention « Article en anglais. » sous le titre (FR), sans
  changer l'URL.

## 5. Tests et batterie
Mettre à jour les tests qui gèlent les textes changés (liste avant/après dans le rapport) ; aucun seuil ne baisse.
Batterie hors sandbox : lint, claims, build, brand, `test:brand-os`, `qa:network:rev01`. Rapport
`docs/REPORT-2026-10-05-contre-verification.md` avec captures 1440/768/375 FR de l'accueil (dont la scène) et de
/build-with-you.
