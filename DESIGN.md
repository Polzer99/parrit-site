# Design du site Parrit.ai

Référence de lecture du code servi, relevée le 12/11/2026. Le **Brand OS reste
la source**, avec les décisions datées d'[AGENTS.md](AGENTS.md)
et leurs amendements. Ce document ne crée ni palette ni contrat de contenu.

Les feuilles globales sont chargées dans l'ordre : polices, Brand OS, alias,
composants système, REV 01, accueil. Les règles tardives et contextuelles priment
sur les anciennes déclarations du même fichier. Sources :
[layout public](src/app/(rev01)/layout.tsx),
[provenance du Brand OS](src/system/brand-os.origin.json).

## Système visuel unique, décision de Paul du 21/11/2026 (soir)

Une règle par sujet, sur toutes les pages. Mesures et raisons : [audit](docs/AUDIT-VISUEL-2026-11-21.md), [spec](docs/CODEX-SPEC-2026-11-21-coherence-visuelle.md), [compte rendu](docs/REPORT-2026-11-21-coherence-visuelle.md). Garde-fou : [coherence-visuelle.spec.ts](tests/coherence-visuelle.spec.ts).

1. **Titres** ([system.css](src/system/system.css)) : titre de page `--d-m` (54 px, 34 sur téléphone), interligne 1,05 ; titre de section `--d-s` (40 px, 32 sur téléphone), interligne 1,1 ; graisse 500, interlettrage `--title-tracking`, largeur `--title-max`. Titre de carte, d'étape ou de rubrique : `--t-l` (22 px), graisse 600.
2. **Deux exceptions nommées** : le titre du héros de l'accueil (46/52 px, 38/43 sur téléphone, seconde phrase en 600) et l'intertitre d'article `--t-xl` (26 px, 600). Aucun autre gras dans un titre.
3. **Alignement** : tout part du bord gauche du conteneur (1160 px, marges de 40 px, 20 sur téléphone) ou de sa colonne de grille : titres, textes, boutons, logos, pictogrammes, filets. Rien n'est centré, rien n'est poussé à droite. Avec un visuel : texte à gauche, visuel à droite.
4. **Rythme** : `--section-y` (64 px) au-dessus et au-dessous de chaque section, sans unité de fenêtre ; `--stack` (32 px) du titre au contenu, entre deux contenus et entre deux colonnes ; `--inner` (16 px) dans un composant. Le héros de l'accueil garde `--brand-s6`. Premier contenu des pages intérieures à 64 px sous la barre.
5. **Carte** : fond `--paper2` (sur fond sombre : celui de la section), filet de 1 px, marge `--card-pad`. Ordre : repère (numéro en `--d-s`, pictogramme de 32 px ou chiffre en `--d-m`), étiquette, titre, texte de 16 px, liste à coches. Ce qui n'est pas une carte est une ligne : un filet au-dessus.
6. **Filets** : un seul gris par fond, `--brand-accessible-line` sur fond clair, `--brand-derived-on-ink-line` sur fond sombre.
7. **Boutons** ([rev01.css](src/app/(rev01)/rev01.css)) : un principal `.rev-button.exec` (rose, filet de 2 px, flèche du Brand OS, toujours), en taille normale (16 px, 48 px de haut) ou grande `.large` (22 px, marge 22 × 36 px) au héros de l'accueil, au héros des pages d'offre et au contact ; un secondaire `.rev-button.ghost` (contour de 1 px, sans flèche). Sur téléphone, hors de la barre et du champ d'envoi, un bouton prend toute la largeur du conteneur.
8. **Largeur de lecture** : `--measure` sur tout paragraphe, toute liste et toute réponse (75 caractères au plus par ligne, mesuré) ; `--title-max` sur les titres.
9. **Repères** : pictogrammes du schéma du héros ([CardGlyph](src/system/components/CardGlyph.tsx)), numéros d'étape, nombre d'articles lu au registre du Journal. Aucun nouvel actif, aucune animation nouvelle.

## Couleur

| Usage servi | Variables et source |
| --- | --- |
| Palette vendorisée, immuable | [brand-os.tokens.css](src/system/brand-os.tokens.css) : `--brand-core-canard`, `--brand-core-rose`, `--brand-core-off`, `--brand-accessible-ink`, `--brand-accessible-ink2`, `--brand-accessible-sky`, `--brand-accessible-warm`, `--brand-derived-white`. Ne pas recopier les valeurs. |
| Registres contextuels | Le mode accessible et les régimes calm/canard/ink/rose définissent `--brand-bg`, `--brand-fg`, `--brand-fg2`, `--brand-acc`, `--brand-line`, `--brand-surf` dans [brand-os.tokens.css](src/system/brand-os.tokens.css). |
| Alias généraux | `--paper`, `--paper2`, `--ink`, `--g3`, `--rule-l`, `--rule-d` dans [tokens.css](src/system/tokens.css). |
| Accent selon le fond | `--accent-strong`, `--accent-on-dark`, `--accent-border`, `--action-fill`, `--action-pressed`, `--action-text`, `--focus-color` dans [tokens.css](src/system/tokens.css), surchargés par composant dans [rev01.css](src/app/(rev01)/rev01.css) et [single-page.css](src/system/single-page.css). |
| Accueil | Alias `--canard`, `--rose`, `--off`, `--ink2`, `--line`, `--sky`, `--white`, `--on-canard`, `--on-ink`. Hero canard ; références, parcours, technologies, équipe et articles blancs ; terrain et services sauge ; applications et FAQ blanc cassé ; bandeau en registre canard ; contact encre. Source : [single-page.css](src/system/single-page.css), [SinglePage](src/system/components/SinglePage.tsx). |

## Typographie

| Élément | Règle servie et source |
| --- | --- |
| Familles | `--ui` = General Sans avec repli ajusté, `--ed` = `--ui`, `--mono` = IBM Plex Mono. Fichiers locaux, General Sans 400/500/600 en affichage optional. [tokens.css](src/system/tokens.css), [fonts.css](src/system/fonts.css). |
| Échelle commune | `--t-k` et `--t-s` : 16 px ; `--t-m` : 18 px ; `--t-l` : 22 px ; `--t-xl` : 26 px. Titres `--d-s`, `--d-m`, `--d-l`, `--d-xl` avec adaptation à 760 px. [tokens.css](src/system/tokens.css). |
| Accueil | General Sans. Titres selon le système visuel unique ci-dessus. Hero spécifique : H1 38/43 px, puis 46/52 px dès 761 px ; ne pas lui appliquer le titre de page générique. [single-page.css](src/system/single-page.css). |
| Journal | Chapeau en `--t-m`, interligne 1,65 ; titres et corps suivent les règles Journal, code en `--mono`. Métadonnées séparées du chapeau par `--brand-s2`. Identité éditoriale Parrit.ai, sans signature nominative ajoutée ; dates localisées avant le titre, mise à jour si différente (Correctif 4 du 13/11/2026). [rev01.css](src/app/(rev01)/rev01.css), [article partagé FR/EN](src/system/pages/article.tsx). |
| Boutons | General Sans 600, casse normale, pas d'espacement ajouté entre lettres. Géométrie : règle 7 du système visuel unique, jetons `--button-font-size`, `--button-min-height`, `--button-padding`. [tokens.css](src/system/tokens.css), [rev01.css](src/app/(rev01)/rev01.css). |

## Mise en page

| Élément | Règle servie et source |
| --- | --- |
| Espacements | Série `--brand-s1`, `--brand-s2`, `--brand-s3`, `--brand-s4`, `--brand-s6`, `--brand-s8` : 8, 16, 24, 32, 48, 64 px. Rythme : règle 4 du système visuel unique. [brand-os.tokens.css](src/system/brand-os.tokens.css), [tokens.css](src/system/tokens.css). |
| Enveloppe accueil | `.wrap` plafonnée à 1160 px, padding horizontal 40 px, puis 20 px à 760 px ; barre de navigation dans le flux, menu natif à 900 px. Menu : Offres, Partenaires, Le parcours, Questions, Journal ; état actif sur les pages du Journal. Contact accessible par le bouton commun (21/11/2026, soir). [single-page.css](src/system/single-page.css), [RevHeader](src/system/components/RevHeader.tsx). |
| Références | Bande de 1060 px maximum, alignée à gauche. Grille à deux colonnes à 760 px. [PublicEvidence](src/system/components/PublicEvidence.tsx), [single-page.css](src/system/single-page.css). |
| Filets | Règle 6 du système visuel unique : 1 px, un seul gris par fond. [single-page.css](src/system/single-page.css). |
| Formes | Aucun dégradé ni ombre ; surfaces carrées. Les rayons des téléphones et de leurs bulles constituent l'exception du site. [single-page.css](src/system/single-page.css), contrats dans [AGENTS.md](AGENTS.md). |
| Géométrie | Les exigences « un bloc = un écran », hero entier et stabilité relèvent des décisions datées d'[AGENTS.md](AGENTS.md). Mesures dans [single-page.spec.ts](tests/single-page.spec.ts) et [stabilite.spec.ts](tests/stabilite.spec.ts), sans abaisser leurs seuils. |

## Composants

| Composant | Anatomie, états et source |
| --- | --- |
| Bouton `exec` | Règle 7 du système visuel unique. Connecteur vectoriel canonique dans chaque bouton principal. Survol, focus et appui : fond `--brand-accessible-warm`, bord encre, connecteur déplacé de 4 px, appui de 1 px ; tout est nul en mouvement réduit. [AppointmentLink](src/system/components/AppointmentLink.tsx), [BrandConnector](src/system/components/BrandConnector.tsx), [rev01.css](src/app/(rev01)/rev01.css). |
| Bouton `ghost` et états communs | Fond transparent, bord et texte dans la couleur du contexte, jamais de flèche. Focus-visible : contour de 2 px avec décalage, via `--focus-color` ou la couleur du contexte. Disabled : opacité 1, fond transparent, gris contextuels, curseur interdit. Le bouton du formulaire porte l'attribut natif disabled durant l'envoi et reste collé à droite de son champ. [QuickCapture](src/system/components/QuickCapture.tsx), [rev01.css](src/app/(rev01)/rev01.css). |
| Bandeau | Technologies : deux listes pour une piste continue, doublon masqué aux lecteurs d'écran ; une liste repliée en mode réduit. Contour gris de 1 px (région atteignable au clavier), contour de focus canard. [TechnologyBand](src/system/components/TechnologyBand.tsx), [single-page.css](src/system/single-page.css). |
| Partenaires | Sept cartes (pictogramme, titre, phrase) sur trois colonnes, la dernière sur toute la largeur ; carrousel natif sur téléphone. Les 23 offres et leur défilement sont supprimés (décision 2 du 21/11/2026, soir). [ServiceGrid](src/system/components/ServiceGrid.tsx), [single-page.css](src/system/single-page.css). |
| Téléphones | Trois conversations rendues dès le serveur, boîtiers et hauteurs partagés, bulles dans le flux ; carrousel natif aux petites largeurs. [SinglePage](src/system/components/SinglePage.tsx), [ConversationMotion](src/system/components/ConversationMotion.tsx), [single-page.css](src/system/single-page.css). |
| FAQ et menu | Éléments natifs details/summary, focus visible et appui souligné ; ouvertures initiales selon la décision datée, réponses inchangées. [SinglePage](src/system/components/SinglePage.tsx), [RevHeader](src/system/components/RevHeader.tsx), [single-page.css](src/system/single-page.css). |
| Rendez-vous | Bloc partagé en fin d'article et de page d'offre : titre, phrase, bouton principal, repli e-mail. Page de rendez-vous : une colonne, texte en haut à gauche, calendrier dessous dans un cadre de 800 px, puis « Décrire votre besoin par courriel ». Bloc de contact de l'accueil : titre, paragraphe, « Choisissez un créneau. » et calendrier, « Aucun créneau ne vous convient ? » et formulaire ; ni portrait, ni bouton, ni lien de courriel. Le bandeau en capitales et le pied du calendrier sont supprimés. Calendrier intégré monté à l'approche de l'écran ; état de chargement et minimum de hauteur réservés sur l'accueil, sans plafonner l'iframe. [BookingCall](src/system/components/BookingCall.tsx), [booking.css](src/system/booking.css), [CalInline](src/system/components/CalInline.tsx), [single-page.css](src/system/single-page.css). |

## Mouvement

| Mouvement existant | Contrat et source |
| --- | --- |
| Durées communes | `--micro`, `--move`, `--seq`, `--hold`, `--ease` sont les jetons généraux. Les transitions nomment leurs propriétés ; aucune transition sur all. [tokens.css](src/system/tokens.css), [system.css](src/system/system.css), [rev01.css](src/app/(rev01)/rev01.css). |
| Interactions | Boutons principaux : 150 ms sur fond, bord et transformation ; liens et autres boutons suivent les déclarations contextuelles de 150 ms. Aucune nouvelle animation d'appui. [rev01.css](src/app/(rev01)/rev01.css). |
| Hero | Bouton sans respiration (épure du 13/11/2026). Seul mouvement : le tracé du chemin au choix d'objectif, nul en mouvement réduit. [HomeGoals](src/system/components/HomeGoals.tsx), [single-page.css](src/system/single-page.css). |
| Références et technologies | Éclairage des logos et défilement des technologies conservés ; pause au survol/focus ; logos opaques et technologies repliées statiques en mode réduit. [PublicEvidence](src/system/components/PublicEvidence.tsx), [single-page.css](src/system/single-page.css). |
| Apparition des sections | Une seule apparition, 400 ms et 16 px au maximum, activée par JS ; contenu visible sans JS et en mode réduit. Décision du 08/11, inchangée. [SectionEntrance](src/system/components/SectionEntrance.tsx), [single-page.css](src/system/single-page.css). |
| Mouvement réduit | Transitions globales annulées ; les composants animés de l'accueil désactivent explicitement leurs animations. Le fallback global d'animation à 1 ms demeure pour les autres éléments. [system.css](src/system/system.css), [single-page.css](src/system/single-page.css). |

## À faire / À éviter

- **À faire** : utiliser les variables et composants existants, vérifier la cascade complète,
  tester FR/EN, clavier, mobile, sans JS et mouvement réduit. Sources :
  [layout](src/app/(rev01)/layout.tsx), [AGENTS.md](AGENTS.md).
- **À faire** : régénérer les assets vendorisés depuis leur provenance et conserver leurs
  empreintes ; suivre les décisions datées pour les textes, logos, photos et actions.
  Sources : [brand-os.origin.json](src/system/brand-os.origin.json), [AGENTS.md](AGENTS.md).
- **À éviter** : palette recopiée, nouvelle police, nouvelle famille de boutons,
  dégradés/ombres, arrondis hors exception téléphone, flèches caractères,
  transition sur all ou abaissement d'un seuil pour faire passer un test.
  Sources : [AGENTS.md](AGENTS.md), [brand-os.connectors.json](src/system/brand-os.connectors.json).
- **À éviter** : prendre les documents historiques DESIGN-SYSTEM.md, BRAND.md ou
  docs/design-system pour le rendu actuel. Source : [AGENTS.md](AGENTS.md).

## Épure

La [spec du 13/11/2026](docs/CODEX-SPEC-2026-11-13-accueil-epure.md)
prime sur les descriptions historiques ci-dessus pour le haut de l'accueil.
Les composants concernés sont [HomeGoals](src/system/components/HomeGoals.tsx),
[HomeEvidence](src/system/components/HomeEvidence.tsx) et leurs règles finales
 dans [single-page.css](src/system/single-page.css).

1. Une idée une fois : objectifs et résultats remplacent introduction, carte
   d'approbation et réassurance du hero.
2. Le titre porte seul : aucune petite étiquette au-dessus des nouveaux titres.
3. L'espace et les filets de 1 px séparent les éléments ; une seule carte (règle 5
   du système visuel unique), jamais de carte imbriquée.
4. Une seule action principale visible par écran : bouton du hero puis celui
   du contact ; le Journal est un lien secondaire.
5. La chasse fixe est réservée aux dates, mesures et code. Le mode accessible
   de l'accueil conserve toutefois son alias `--mono` vers General Sans :
   l'autorisation d'une chasse fixe n'impose pas de remplacer cette police.
6. Rythme : règle 4 du système visuel unique. Le hero suit `--brand-s6`.
7. Largeur de lecture `--measure` (règle 8) et titres équilibrés ; les colonnes et écrans
   étroits gardent leur largeur disponible. Aucun minimum qui provoque un débordement.
8. Un seul mouvement d'auteur dans le haut de page : tracé du chemin au choix
   d'objectif, nul en mouvement réduit. Logos statiques, respiration du bouton
   et entrées des nouveaux blocs retirées. Sections conservées inchangées.
9. Sélection via les jetons existants, curseur de saisie via `--focus-color`,
   soulignement décalé de .2em ; dates et mesures à chiffres tabulaires. Les
   règles communes sont dans [system.css](src/system/system.css).
10. Seul [BrandConnector](src/system/components/BrandConnector.tsx) indique
    l'enchaînement des actions ; aucun caractère flèche.

À partir de 1100 px, les six logos tiennent sur une ligne dans 1060 px, réduits à proportion.
Sous 1100 px, les cartes des offres utilisent le carrousel natif du dépôt ; sous 760 px, celles
du terrain, des étapes et des partenaires aussi, pour conserver un bloc par écran.
Le calculateur de l'accueil est supprimé (décision de Paul du 21/11/2026 au soir) :
plus de champs de saisie, de cartes de résultat ni de pied de calculateur.
Les sources de publication et les assets du Brand OS restent inchangés.
