# CODEX SPEC — parrit.ai : photo du fondateur (AV-3), promesse de tête (DV-01 a) et catégorie (DV-02 a)

Date : 04/10/2026 · Auteur : Claude (relecture, §25) · Base : `origin/main` (`bb7b7e0` = production, PR #300).
Décisions de Paul du 04/10/2026 (terminal a7 : « OK, pour moi, c'est bon, on go », puis « Oui, tout ») : AV-3 = DSC00629,
DV-01 = a, DV-02 = a. Enregistrées dans le Brand OS (`studio-dsc00629` APPROVED ; DV-01/DV-02 DECIDED). **Ce lot sera
fusionné et publié.** Il remplace la PR #296 (base périmée) : ne pas la reprendre, s'en servir seulement comme référence.
**Hors lot — DV-03 N'EST PAS décidé** : « Une commande, pas un abonnement » / « Commissioned, not subscribed » reste
partout où il est (`RevFooter`, `CalInline`, `sketch/[id]`, `opengraph-image.tsx:72`, `Opening`, `llms.txt`, JSON-LD).
Ne pas toucher non plus : prix, durées, offres, `QuickCapture`/`AgentEsquisse` (comportement), Journal, tokens, polices,
routes, ni les acquis de #300 (boutons, libellé « Réserver l'examen », un éclat rose par écran).

## FIX2 (04/10) — sur le travail présent (ne rien refaire)
Seul échec restant : `doctrine-visible.spec.ts:111`, le titre h2 du déroulement fait 4 lignes à 1440 px. Le seuil de
3 lignes avait été fixé par Claude pour la composition SANS photo (spec #300, FIX2 §3) ; avec la photo de 340 px, la
colonne de texte est plus étroite. Avec photo : 4 lignes au plus ; sans photo : 3 lignes au plus (inchangé). Aucun autre
changement.

## FIX1 (04/10) — sur le travail présent (ne rien refaire)
Batterie : seul `tests/doctrine-visible.spec.ts:94` (et `:105`) échoue à 1440, FR et EN : il gèle la composition SANS
photo de #300 (colonne de texte centrée seule, largeur égale à la section « Ce que nous construisons »). Avec la photo,
la règle devient : au-delà de 859 px, c'est l'ENSEMBLE photo + texte (`home-s-maison-grid`) qui est centré à ±1 px dans
la section et dont la largeur égale la référence à ±1 px ; le titre h2 tient en trois lignes au plus ; en dessous de
860 px, la règle actuelle reste exacte. Garder la branche « sans photo » du test (si aucune image n'est rendue, l'ancien
contrôle s'applique). Seuils inchangés.

## 1. Photo (AV-3 = DSC00629)
Source, lecture seule : `/Users/paullarmaraud/parrit-canon-visual-system/brand/visual/sites/handoff/2026-10-05/photos/`
(`photos.manifest.json`). Vraie photo de studio, recadrage géométrique seul (§37) : ne jamais générer, retoucher ni
recompresser.
1. Copier octet pour octet `parrit-ai-founder-dsc00629-3x4-340.{avif,webp}` et `…-3x4-680.{avif,webp}` dans
   `public/brand/founder/`. Aucun autre fichier.
2. Accueil, section `home-s-maison` : une `<figure>` avant `home-s-maison-copy`, `<picture>` (avif puis webp, `srcset`
   340w/680w, `sizes="(max-width: 859px) min(340px, 100vw), 340px"`), `width=340 height=453`, `loading="lazy"`,
   `decoding="async"`, alt FR « Paul Larmaraud, fondateur de Parrit.ai », EN « Paul Larmaraud, founder of Parrit.ai ».
   Au-delà de 859 px : grille `340px minmax(0, 1fr)`, alignée au centre verticalement ; en dessous : photo au-dessus du
   texte, `width: min(340px, 100%)`. La légende `journey.caption` est rendue (la règle de #300 « légende si et seulement
   si photo » s'applique). Zéro ombre, zéro rayon.
3. Tests : image servie, alt non vide, sha256 des 4 fichiers = manifeste (fixture avec le chemin du manifeste en
   commentaire) ; la légende est rendue avec la photo ; `test:brand-os` (assets interdits) reste vert.

## 2. Promesse de tête et catégorie (DV-01 a, DV-02 a)
Remplacer exactement, FR et EN :
| Emplacement | Aujourd'hui | Devient |
|---|---|---|
| kicker EN (`page.tsx`) | Parrit / Company operating systems | Parrit / Data and AI |
| kicker FR | Parrit / Systèmes d'exploitation d'entreprise | Parrit / Données et IA |
| H1 EN | The AI system your company operates on. | We turn operational problems into systems that work. |
| H1 FR | Le système IA qui fait tourner votre entreprise. | Nous transformons des problèmes opérationnels en systèmes qui fonctionnent. |
| sous-titre EN | The invoice that drags, … until it goes live. | Parrit.ai is a data and AI company. The invoice that drags, the report rebuilt by hand every week: we start from your data and build tools you own. |
| sous-titre FR | La facture qui traîne, … jusqu'à la mise en service. | Parrit.ai est une maison de données et d'IA. La facture qui traîne, le rapport refait à la main chaque semaine : nous partons de vos données et construisons des outils qui vous appartiennent. |
| `generateMetadata` title FR | Parrit.ai · Systèmes d'exploitation d'entreprise | Parrit.ai · Données et IA, des outils qui vous appartiennent |
| title EN (+ `layout.tsx` défaut) | Parrit.ai · Company Operating Systems | Parrit.ai · Data and AI, tools you own |
| méta FR | Parrit.ai construit des systèmes IA chez des grands comptes, … à vous pour de bon. | Parrit.ai relie vos sources, remet vos données à plat et construit dessus des outils qui vous appartiennent : le code, les données et la documentation. |
| méta EN (+ `layout.tsx`) | Parrit.ai examines how a company operates, … | Parrit.ai connects your sources, cleans up your data and builds tools on top of it that you own: the code, the data and the documentation. |
| `src/system/jsonld.ts` description | « …designs and builds company operating systems… » | remplacer SEULEMENT ce segment par « is a data and AI company that turns a company's data into software tools the company owns » ; le reste de la phrase (dont « commissioned, not subscribed » s'il y est) ne bouge pas |
| `Opening.tsx` EN | « Parrit.ai designs and builds<br />company operating systems. » | « Parrit.ai turns operational problems<br />into systems that work. » (la ligne suivante ne change pas) |
| `Opening.tsx` FR | « Parrit.ai conçoit et construit<br />des systèmes d'exploitation d'entreprise. » | « Parrit.ai transforme des problèmes opérationnels<br />en systèmes qui fonctionnent. » (la ligne suivante ne change pas) |
| `opengraph-image.tsx` (titre de carte, l. 6 et 44) | … COMPANY OPERATING SYSTEMS | PARRIT.AI · DATA AND AI |
| `sketch/[id]/page.tsx` | Operating System · Sketch | System · Sketch |
| lien sous le hero FR / EN | « Ou parlons-en : un examen de 15 minutes, en visio, avec le fondateur. » / EN équivalent | « Ou réservez l'examen : 15 minutes, en visio, avec le fondateur. » / « Or book the examination: 15 minutes, by video, with the founder. » (aligne le hero sur le libellé unique de #300) |
- Le cadre Parrit (crochets) entoure le dernier groupe du H1 : « systèmes qui fonctionnent » / « systems that work ».
  Vérifier à 375, 768 et 1440 px qu'aucune ligne du H1 ne porte un mot seul (`text-wrap: balance` existe déjà) et que le
  H1 reste dans l'échelle actuelle.
- `scripts/generate-llms.mjs` (source de `llms.txt`), `src/app/llms-full.txt/route.ts`, `TRUTH.md` : remplacer
  « company operating system(s) » / « systèmes d'exploitation d'entreprise » par la formulation de la catégorie (« a data
  and AI company… tools the company owns ») ou par « system(s) » quand la phrase parle d'un système livré. `TRUTH.md` :
  « la home n'affiche AUCUN prix » est faux → « la home affiche l'ancrage de Build With You (à partir de 3 200 € HT, au
  forfait) ; le sur-mesure est sur devis ». L'article du Journal « What is a company operating system? » n'est PAS modifié
  (le lister dans le rapport).
- Contrôle final : `git grep -n -i -E "company operating system|systèmes? d'exploitation d'entreprise|operates on" src scripts`
  ne renvoie plus rien de rendu hors Journal (lister les restes et leur raison).

## 3. Tests et batterie
Mettre à jour uniquement les tests qui gèlent un texte changé ici (liste avant/après dans le rapport) ; aucun seuil ne
bouge ; les tests de #300 restent verts. Batterie hors sandbox : lint, claims, build, brand, `test:brand-os`,
`qa:network:rev01`. Rapport `docs/REPORT-2026-10-04-photo-dv01-dv02.md`.
