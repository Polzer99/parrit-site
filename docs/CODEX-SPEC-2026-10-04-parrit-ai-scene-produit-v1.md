# CODEX SPEC — parrit.ai : « Ce que nous construisons » montre un exemple réel de logiciel, en conversation + résultat

Date : 04/10/2026 · Auteur : Claude (relecture, §25) · Base : `origin/main` (`2250407` = production).
Décision de Paul du 04/10/2026 (confirmée en direct, terminal a7 : « Oui, les deux ») : le site, dans sa partie qui montre
ce que Parrit construit, présente un exemple de logiciel avec la mise en scène de la plaquette CRM V4, jugée « canon »,
entièrement anonyme. Motif inscrit au Brand OS : `VS-PRODUCT-SCENE`
(`/Users/paullarmaraud/parrit-canon-visual-system/brand/visual/decisions/VISUAL-CANDIDATES.md`).
**Ce lot va en PR et en préversion seulement. Rien n'est fusionné sans le GO de Paul.**
**Ne pas toucher** : hero, déroulement, photo, preuve, offres, Journal, header, footer, tokens, polices, autres pages.

## FIX2 (04/10) — sur le travail FIX1 présent (ne rien refaire)
À 768 px le repère 2 (taille fixe 28 px) recoupe encore la bulle. L'accrocher par son bord DROIT : `left: 64.5%` (bord
gauche de la bulle) et `transform: translate(calc(-100% - 6px), -50%)`, `top` au milieu vertical de la bulle (69,5 %).
Ainsi il reste à 6 px à gauche de la bulle à toutes les largeurs. Le test FIX1 reste tel quel.

## FIX1 (04/10) — sur la PR #302 (ne rien refaire)
Relecture visuelle : le repère 2 recouvre le mot « oui » de la bulle. Le placer à gauche de la bulle, sans la toucher :
`left: 60%` (au lieu de 64,5 %), `top` inchangé. Ajouter au test : le repère 2 ne recoupe pas le rectangle de la bulle
« oui » (coordonnées de la bulle en pourcentage de l'image : left 64,5 %, top 67,3 %, right 86,4 %, bottom 71,7 %). Rien
d'autre ne change.

## 1. Assets (lecture seule, copier octet pour octet)
Source : `/Users/paullarmaraud/parrit-canon-visual-system/brand/visual/sites/handoff/2026-10-04/scene-agent-crm/`
(`manifest.json` : rôle, taille, sha256 ; `ocr.txt` : texte relevé, aucun nom réel, lieu ni logo).
- `scene-carte-visite-messagerie.png` (1434 × 2399, messagerie reconstituée, fond transparent avec ombre douce) ;
- `scene-carte-visite-fiche-crm.png` (860 × 564, capture réelle du CRM sur données fictives).
Copier dans `public/brand/scenes/` ; produire en plus, à partir de ces fichiers, des versions WebP et AVIF redimensionnées
(messagerie : 480 et 960 px de large ; fiche : 430 et 860 px), sans recadrage ni retouche. Test : sha256 des deux PNG =
manifeste (fixture avec le chemin du manifeste en commentaire).

## 2. Section `home-s-build` (accueil FR et EN)
Remplace les trois cartes (Comprendre / Décider / Agir) et la phrase de conclusion « Trois gestes… Le reste s'exécute sans
vous. » (promesse non tenue par l'exemple). Le surtitre reste.
| Élément | FR | EN |
|---|---|---|
| surtitre (inchangé) | Ce que nous construisons | What we build |
| titre h2 | Vous demandez, vous validez, la fiche est créée. | You ask, you approve, the record is created. |
| phrase d'ouverture | Un exemple : un agent dans la messagerie de l'équipe commerciale, relié au CRM de l'entreprise. | One example: an agent in the sales team's messaging app, connected to the company's CRM. |
| étape 1 | Vous photographiez la carte. | You photograph the card. |
| étape 2 | Vous répondez « oui ». | You reply “yes”. |
| étape 3 | Le contact est dans le CRM. | The contact is in the CRM. |
| étiquette au-dessus de la fiche | Dans votre CRM | In your CRM |
| mention | Exemple fictif | Fictional example |
Composition (comme la page 02 de la plaquette V4) :
- au-delà de 1024 px : trois colonnes alignées sur la grille de la section — à gauche titre, phrase et les trois étapes
  (chacune précédée de son repère numéroté) ; au centre l'image de la messagerie (largeur 360 px) ; à droite l'étiquette
  et la fiche CRM (largeur 380 px), alignée sur le bas de la messagerie ; la mention « Exemple fictif » sous la colonne de
  gauche, en Plex Mono `--t-k` (étiquette d'appareil) ;
- de 768 à 1024 px : texte au-dessus, messagerie et fiche côte à côte ;
- sous 768 px : texte, messagerie (largeur `min(320px, 100%)`), fiche (`min(340px, 100%)`), mention.
- Repères : pastilles rondes roses numérotées (rose de la marque, chiffre encre, 28 px, General Sans 600), posées en HTML
  au-dessus des images, positionnées en pourcentage de l'image : repère 1 au coin haut-gauche de la bulle photo
  (left 25,2 %, top 23,3 %), repère 2 à gauche de la bulle « oui » (left 64,5 %, top 69,5 %), repère 3 au coin haut-droit
  de la fiche CRM (left 93 %, top 9 %). Les mêmes pastilles précèdent les trois étapes du texte. Aucune flèche, aucun trait.
- Le groupe de repères compte comme l'éclat rose de l'écran (VS-PRODUCT-SCENE) : adapter le test « un éclat rose par
  écran » (`tests/doctrine-visible.spec.ts`) pour compter un groupe de repères `.scene-marker` comme un seul éclat.
- Images : `<picture>` AVIF puis WebP, `loading="lazy"`, `decoding="async"`, dimensions déclarées. Texte alternatif FR
  messagerie : « Conversation avec l'agent CRM : une carte de visite photographiée, la question « C'est bon ? » et la
  réponse « oui » » ; fiche : « Fiche du contact créée dans le CRM : société, nom, poste, mobile masqué ». EN équivalent.
- Aucune ombre ajoutée en CSS (l'ombre douce est dans le PNG de la messagerie, la fiche en porte une aussi : les garder
  telles quelles ; ne pas en ajouter), aucun rayon ajouté, aucune couleur hors tokens. Fond de section inchangé.

## 3. Composant réutilisable
Écrire la scène comme un composant `ProductScene` (dans `src/system/components/`) qui prend : titre, phrase, étapes,
image de conversation, image d'objet, étiquette, positions des repères, mention. L'accueil l'utilise ; aucune autre page
ne change dans ce lot.

## 4. Tests et batterie
- Nouveaux tests : sha256 des assets ; trois repères dans les images et trois dans le texte, numérotés 1-2-3 ; aucun
  texte de la section ne contient « Laparra », « Rungis », « MIN », « GESLOT », « Lyon » ; mention « Exemple fictif » /
  « Fictional example » présente ; la section tient sans débordement à 375, 768, 1440.
- Mettre à jour les tests qui gèlent les trois cartes ou la phrase de conclusion (liste avant/après dans le rapport).
- Batterie hors sandbox : lint, claims, build, brand, `test:brand-os`, `qa:network:rev01`.
- Rapport `docs/REPORT-2026-10-04-scene-produit.md` avec captures 1440, 768 et 375, FR et EN, de la section.
