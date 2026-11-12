# Design du site Parrit.ai

Référence de lecture du code servi, relevée le 12/11/2026. Le **Brand OS reste
la source**, avec les décisions datées d'[AGENTS.md](AGENTS.md)
et leurs amendements. Ce document ne crée ni palette ni contrat de contenu.

Les feuilles globales sont chargées dans l'ordre : polices, Brand OS, alias,
composants système, REV 01, accueil. Les règles tardives et contextuelles priment
sur les anciennes déclarations du même fichier. Sources :
[layout public](src/app/(rev01)/layout.tsx),
[provenance du Brand OS](src/system/brand-os.origin.json).

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
| Accueil | General Sans, titres 500, emphases et boutons 600. H2 utilise `--d-s`, puis 34 px sur téléphone. Hero spécifique : H1 38/43 px, puis 46/52 px dès 761 px ; ne pas lui appliquer l'ancien grand H1 générique. [single-page.css](src/system/single-page.css). |
| Journal | Chapeau en `--t-m`, interligne 1,65 ; titres et corps suivent les règles Journal, code en `--mono`. Métadonnées séparées du chapeau par `--brand-s2`. [rev01.css](src/app/(rev01)/rev01.css), [article](src/app/(rev01)/journal/[slug]/page.tsx). |
| Boutons | General Sans 600, casse normale, pas d'espacement ajouté entre lettres. Taille commune via `--button-font-size`, `--button-min-height`, `--button-padding` ; surcharges de l'accueil dans [single-page.css](src/system/single-page.css). [tokens.css](src/system/tokens.css), [rev01.css](src/app/(rev01)/rev01.css). |

## Mise en page

| Élément | Règle servie et source |
| --- | --- |
| Espacements | Série `--brand-s1`, `--brand-s2`, `--brand-s3`, `--brand-s4`, `--brand-s6`, `--brand-s8` : 8, 16, 24, 32, 48, 64 px. Série locale `--s1`, `--s2`, `--s3`, `--s4`, `--s6`, `--s8` de mêmes pas. Des dimensions spécifiques existent : ne pas les uniformiser sans spec. [brand-os.tokens.css](src/system/brand-os.tokens.css), [tokens.css](src/system/tokens.css). |
| Enveloppe accueil | `.wrap` plafonnée à 1160 px, padding horizontal 40 px, puis 20 px à 760 px ; barre de navigation dans le flux, menu natif à 900 px. [single-page.css](src/system/single-page.css), [RevHeader](src/system/components/RevHeader.tsx). |
| Références | Bande de 1060 px maximum. Grille à deux colonnes à 760 px. [PublicEvidence](src/system/components/PublicEvidence.tsx), [single-page.css](src/system/single-page.css). |
| Filets | Grilles et FAQ : 1 px via `--line` ; contours d'action selon leur contexte . [single-page.css](src/system/single-page.css). |
| Formes | Aucun dégradé ni ombre ; surfaces carrées. Les rayons des téléphones et de leurs bulles constituent l'exception du site. [single-page.css](src/system/single-page.css), contrats dans [AGENTS.md](AGENTS.md). |
| Géométrie | Les exigences « un bloc = un écran », hero entier et stabilité relèvent des décisions datées d'[AGENTS.md](AGENTS.md). Mesures dans [single-page.spec.ts](tests/single-page.spec.ts) et [stabilite.spec.ts](tests/stabilite.spec.ts), sans abaisser leurs seuils. |

## Composants

| Composant | Anatomie, états et source |
| --- | --- |
| Bouton `exec` | `.rev-button.exec` utilise les couleurs d'action contextuelles. Sur l'accueil, hero/bandeau : `--t-l`, padding 22 × 36 px, hauteur minimale 64 px ; contact : même taille et padding. Connecteur vectoriel canonique. Hover/focus des grands boutons : `--brand-accessible-warm`, bord encre, connecteur déplacé de 4 px ; active : déplacement vertical de 1 px, annulé pour hero/bandeau en mouvement réduit. [AppointmentLink](src/system/components/AppointmentLink.tsx), [BrandConnector](src/system/components/BrandConnector.tsx), [single-page.css](src/system/single-page.css). |
| Bouton `ghost` et états communs | Fond transparent, bord et texte contextuels ; hover/active définis dans [rev01.css](src/app/(rev01)/rev01.css), avec surcharges accueil. Appui `.rev-button` : 1 px ; focus-visible : contour de 2 px avec décalage, via `--focus-color` ou la couleur du contexte. Disabled : opacité 1, fond transparent, gris contextuels, curseur interdit. Le bouton du formulaire porte l'attribut natif disabled durant l'envoi. [QuickCapture](src/system/components/QuickCapture.tsx), [single-page.css](src/system/single-page.css). |
| Bandeaux | Technologies : deux listes pour une piste continue, doublon masqué aux lecteurs d'écran ; une liste repliée en mode réduit. Bandeau rendez-vous : titre centré et action unique. [TechnologyBand](src/system/components/TechnologyBand.tsx), [SinglePage](src/system/components/SinglePage.tsx), [single-page.css](src/system/single-page.css). |
| Services et équipe | Services : quatre colonnes, puis deux à 1100 px, une à 599 px ; carrousels mobiles natifs avec leurs règles spécifiques. Équipe : grille à trois colonnes, dernière expertise pleine largeur. Réserve intrinsèque des variantes de texte ; badge existant conservé. [ServiceTasks](src/system/components/ServiceTasks.tsx), [ServiceGrid](src/system/components/ServiceGrid.tsx), [single-page.css](src/system/single-page.css). |
| Téléphones | Trois conversations rendues dès le serveur, boîtiers et hauteurs partagés, bulles dans le flux ; carrousel natif aux petites largeurs. [SinglePage](src/system/components/SinglePage.tsx), [ConversationMotion](src/system/components/ConversationMotion.tsx), [single-page.css](src/system/single-page.css). |
| FAQ et menu | Éléments natifs details/summary, focus visible et appui souligné ; ouvertures initiales selon la décision datée, réponses inchangées. [SinglePage](src/system/components/SinglePage.tsx), [RevHeader](src/system/components/RevHeader.tsx), [single-page.css](src/system/single-page.css). |
| Rendez-vous | Bloc partagé : titre, phrase, bouton, repli e-mail ; grille avec `--s3` et padding `--s6`. Calendrier intégré monté à l'approche de l'écran ; état de chargement et minimum de hauteur réservés sur l'accueil, sans plafonner l'iframe. Les couleurs de l'embed sont résolues depuis les variables servies. [BookingCall](src/system/components/BookingCall.tsx), [booking.css](src/system/booking.css), [CalInline](src/system/components/CalInline.tsx), [single-page.css](src/system/single-page.css). |

## Mouvement

| Mouvement existant | Contrat et source |
| --- | --- |
| Durées communes | `--micro`, `--move`, `--seq`, `--hold`, `--ease` sont les jetons généraux. Les transitions nomment leurs propriétés ; aucune transition sur all. [tokens.css](src/system/tokens.css), [system.css](src/system/system.css), [rev01.css](src/app/(rev01)/rev01.css). |
| Interactions | Grands boutons : 150 ms sur fond, bord et transformation ; liens et autres boutons suivent les déclarations contextuelles de 150 ms. Aucune nouvelle animation d'appui. [single-page.css](src/system/single-page.css), [rev01.css](src/app/(rev01)/rev01.css). |
| Hero | Respiration du seul fond du bouton, 3 s, arrêt hover/focus/active. L'ontologie utilise son séquencement existant, arrêté hors écran et en mode réduit. [single-page.css](src/system/single-page.css), [OntologyHero](src/system/components/OntologyHero.tsx). |
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
