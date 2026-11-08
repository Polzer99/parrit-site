## Hero de conversion, correctif 1 de la spec du 08/11/2026

Le correctif 1 de `docs/CODEX-SPEC-2026-11-08-hero-conversion.md` prime :
le hero reprend le `.wrap` commun (1160 px, marges internes 40 px sur ordinateur),
soit les bords de contenu 180/1260 px à 1440. Sa hauteur est intrinsèque, sans
minimum lié au viewport ; rembourrage vertical 24 px, inférieur au maximum
`--brand-s8`. La section références peut apparaître au premier écran.
Logos en flex à écart fixe `--brand-s2`, hauteur optique `--brand-s3` (24 px) ;
le SVG SNCF est compensé pour ses marges transparentes. Grille 2×2 sous 1100 px.
Colonnes égales, photo, textes, action, preuve, schéma, animations, permissions
et fichiers conservés. Aucun seuil de hauteur, alignement, stabilité ou CLS
assoupli. Tests 1440×900 et alignements externes ajoutés ; rendu réel à confirmer
sur l'hôte (serveur EPERM, Chromium interdit avant navigation).

## Hero de conversion, décision de Paul du 08/11/2026

`docs/CODEX-SPEC-2026-11-08-hero-conversion.md` prime pour le premier écran :
deux colonnes égales dès 1100 px, photo réelle `formation-equipes`, un bouton,
preuve sous le bouton. Surtitre, H1 inchangé, sous-titre, action et preuve sont
alignés ; la photo partage les bords haut/bas du bloc texte. Navigation ghost,
attribution `rdv-hero`, UTM et respiration conservés. Logos blancs contrôlés par
`getSiteEvidence` et `publicationLogo` : Toyotomi Europe, SNCF, Hiolle Technologies,
Laparra si tous autorisés, sinon les quatre premiers autorisés. Sur téléphone
et tablette, bouton pleine largeur, logos 2 × 2 puis photo 4:3.
Le schéma trois plans vit dans sa propre section, après les deux métiers :
« Comment l'IA travaille avec vos outils. » / « How AI works with your tools. ».
Ses quatre histoires, légende, carte, citation, minuteur et mouvement réduit
sont conservés. Quatorze sections ; nouvelle ancre `#fonctionnement` /
`#how-it-works`, ordre partagé avec llms. « Un bloc = un écran » s'applique au
schéma ; seuils de hauteur, stabilité, CLS et blocage réseau inchangés.
Les anciennes mentions de schéma dans le hero et de noms clients uniquement
dans les références sont remplacées pour ce périmètre. Les autres contrats restent.

## Action unique, correctifs 3 et 4, décision de Paul du 08/11/2026, nuit

Les sections 6 et 7 de `docs/CODEX-SPEC-2026-11-08-action-unique-et-wording.md`
priment sur les mentions antérieures de trois placements : le bouton du fondateur
est rétabli, même libellé, `exec`, source `rdv-contact`, 22 px et 22 × 36 px.
Navigation `ghost` conservée ; quatre placements au total, formulaire distinct.
Écart sous le bouton du hero : 16 px. Transitions et animations des grands boutons
explicitement nulles en mouvement réduit. À 1280 × 720, les marges internes de
l'équipe sont réduites, sans changement de texte, taille ou seuil géométrique.
Le Journal français de PR #370 et son correctif typographique sont intégrés :
31 éditions FR, liens localisés, métadonnées et llms généré, originaux EN conservés.
Le merge Git reste à effectuer sur l'hôte : `ORIG_HEAD.lock` interdit dans le
bac à sable ; intégration des fichiers à trois versions réalisée dans le worktree.
Preuve navigateur et CLS à rejouer sur hôte autorisé, voir le compte rendu.

## Correctif 2 de l’action unique, décision de Paul du 08/11/2026, nuit

La section 5 de `docs/CODEX-SPEC-2026-11-08-action-unique-et-wording.md`
prime : navigation `ghost` de taille inchangée, hero et bandeau `exec` en
`var(--t-l)`, rembourrage 22 × 36 px, hauteur minimale 64 px, pleine largeur
sur téléphone. Connecteur VS-CONNECTOR dans les deux boutons, translation 4 px
au survol/focus ; fond rose clair Brand OS et bordure encre 2 px, transition
150 ms, appui 1 px. Seul le fond du hero respire (alpha 0,92–1, cycle 3 s),
arrêt au survol/focus/appui ; mouvement réduit statique. Carte MIT et H1 conservés,
FAQ coût sans chiffre. Aucun seuil géométrique, contraste ou CLS assoupli.
La géométrie réelle reste à vérifier sur un hôte autorisant le navigateur.

## Correctif 1 de l'action unique, décision de Paul du 08/11/2026, nuit

La spec amendée conserve les deux métiers et les huit références. Les services
portent « Préparé, vous validez » / « Prepared, you approve » ; la ligne des
partenaires précise l'interlocuteur responsable de bout en bout. Les FAQ données
et prix sont ouvertes dès le HTML serveur, sans changer leurs réponses ni FAQPage.
La note des applications précise leur origine dans les missions et les données
fictives. La réassurance « Vos équipes gardent la décision. Aucune relance
automatique. » est sous le bouton du hero, en texte secondaire FR/EN.
Le header partagé utilise « Prendre rendez-vous » / « Book a call » avec
`rdv-nav` et les UTM aussi sur Journal, thèmes et mentions légales ; sa destination
au contact de l'accueil reste inchangée. Corps éditoriaux et mentions légales intacts.
La réserve navigation `ghost` est levée par le correctif 2 ci-dessus. La géométrie du hero
avec la nouvelle ligne reste à vérifier sur un hôte autorisant Chromium ; aucun
seuil n'est assoupli et aucun repli vers le bandeau n'est affirmé nécessaire sans mesure.

## Action unique et transformation, décision de Paul du 08/11/2026, nuit

`docs/CODEX-SPEC-2026-11-08-action-unique-et-wording.md` remplace les anciens
contrats de texte et d'action de l'accueil, y compris le hero à deux actions.
Libellé unique « Prendre rendez-vous » / « Book a call », trois placements
navigation / hero / bandeau, sources `rdv-nav`, `rdv-hero`, `rdv-bandeau` via
`avecSource`, UTM conservés. Une action au hero ; aucune action au terrain,
aux offres, au parcours ni dans le portrait du contact. Le formulaire conserve
son rôle d'envoi et la lecture des anciennes sources ; son succès n'ajoute pas
un quatrième bouton. Le lien Journal reste un lien de contenu.
Deux cartes sombres sans bouton : transformation IA et développement de
logiciels, pour les PME, ETI et grands groupes. H1 inchangé ; sous-titre :
« Vos équipes prennent l'IA en main. Nous développons les logiciels qui leur manquent. »
« Your teams take AI in hand. We build the software they are missing. »
Textes de l'accueil, FAQ, métadonnées et présentation de l'accueil dans llms
alignés ; articles et mentions légales conservés.
Toyotomi Europe, Hiolle Technologies et Carte Noire rejoignent les cinq clients
publiables, sur décision nominative de Paul sans accord écrit des clients.
Huit masques locaux, provenance et empreintes dans `public/clients/SOURCES.md` ;
deux rangées ordinateur autorisées dans 1060 px, grille deux colonnes mobile,
éclairage successif 1,6 s, rampes 300 ms, pause survol/focus, réduit statique.
Le Journal ne nomme aucun client. Aucun seuil géométrique ou CLS assoupli.

**Arbitrage levé par le correctif 2, décision de Paul du 08/11/2026, nuit :**
la navigation conserve explicitement son style `ghost` et sa taille. Hero et
bandeau restent `exec`. Les contrôles du rose unique restent intacts.


## Journal en français, décision de Paul du 08/11/2026

`docs/CODEX-SPEC-2026-11-08-journal-en-francais.md` remplace le contrat
« articles uniquement en anglais » pour les 31 entrées indexables. Les éditions
françaises vivent dans `content/journal/fr/<slug>.mdx`, avec le même slug, la
même date et `translationOf`. `journal-translations.ts` partage leur registre
entre lecteur, navigation et redirections ; les tests imposent sa concordance
avec le corpus. Le corps, les titres, les cartes et les métadonnées suivent la
langue de l'URL. Canonicals propres, alternates fr/en/x-default réciproques,
Article/inLanguage et sitemap bilingue. Les neuf noindex gardent leur 308 vers
l'anglais ; les anciens noms rejoignent leur langue en un saut. RSS et OG restent
aux adresses anglaises existantes. `llms.txt` est régénéré avec les éditions FR.
Les certificats existants portent sur les octets de l'original anglais ; le
libellé français du badge le précise. Originaux anglais et certificats inchangés.

## Appel de 15 minutes, décision de Paul du 08/11/2026

La spec `docs/CODEX-SPEC-2026-11-08-appel-15-min-lot-a.md` ajoute
`/rendez-vous` et `/fr/rendez-vous`, noindex/follow, hors sitemap : titre,
phrase, calendrier Cal.com existant dans la langue de la page et repli e-mail.
La source filtrée `[a-z0-9-]{1,80}` rejoint `metadata[source]` ; les `utm_*`
sont transmis au calendrier sans cookie ni stockage. L'accueil conserve son
calendrier et son comportement sans ces paramètres.
Un seul bloc partagé en fin d'article (avant « À lire ensuite ») et de thème
propose l'appel de 15 minutes avec Paul Larmaraud : un H2, une phrase, un
bouton exec et le repli e-mail, dans la langue de l'interface ; le corps de
l'article garde `lang="en"`. Sources `journal-<slug>` et `theme-<theme>`.
Hors de l'accueil, la destination de rendez-vous est `/rendez-vous`, localisée
par `localizedPath` et attribuée par `avecSource`. Les règles « Parler d'un
projet » de l'accueil et du hero restent inchangées. Aucun prix, aucune
pression ni promesse supplémentaire ; FormIA et publication hors périmètre.

## Correctif 3 — décision de Paul du 08/11/2026

Applications uniquement, à ≤ 760 px : marges au-dessus de la définition et des
scènes à `--brand-s1` (8 px chacune, gain total 16 px), pour la marge demandée
sous 700 px à 390×700. Textes, typographie et tests existants conservés.

## Correctif 2 — décision de Paul du 08/11/2026

Les logos conservent leurs dimensions agrandies ; seul leur espacement passe à
`--brand-s3` pour tenir sur une ligne dans le maximum de 1060 px. Aucun seuil
assoupli. Les comparaisons de sommets sont simultanées ; la comparaison des
articles attend le Journal chargé. Aucun changement de contenu, de cadrage ou
de structure de carrousel entre SSR et hydratation.

## Correctif passe 2 — décision de Paul du 08/11/2026

La spec amendée prime sur la passe 2 ci-dessous. Ordre : hero, références,
terrain, offres, applications, parcours, services, technologies, équipe,
bandeau, questions, derniers articles, fondateur/contact. Le bandeau est déplacé
avant la FAQ pour séparer ses boutons de ceux du contact.

Mosaïque pleine largeur en grille 2:1, hauteur min(540 px, 62svh), images en
cover avec position par photo et légendes sur aplat encre. Les exports restent
entiers, sans agrandissement ni métadonnées ; seul le cadrage d'affichage change.
Logos monochromes sources conservés : repos 0,35, éclairage 1/échelle 1,08,
rampes 300 ms et cinq créneaux de 1,6 s ; pause survol/focus et mouvement réduit
statique à opacité 1. La pleine couleur n'est plus attendue de ces masques.

Exactement un lien vers l'index Journal dans main, uniquement dans la section
des articles, et celui du pied conservé (amendement au contrat night tour 2).
Contrôles sur fond clair avec couleurs contextuelles ; bordure supérieure de
la piste Journal retirée pour aligner ses cartes au sommet. Aucun seuil de
contraste, géométrie, durée de test, stabilité ou CLS assoupli.

## Couches visuelles, passe 2 — décision de Paul du 08/11/2026

La passe 2 de `docs/CODEX-SPEC-2026-11-08-parcours-accueil-couches.md` complète
la passe 1. Treize sections : hero, références, terrain, offres, applications,
parcours, services, technologies, équipe, questions, derniers articles, bandeau
final, fondateur/contact. Navigation de la passe 1 conservée ; `#terrain` /
`#in-the-field` suivent la bascule de langue.

Vraies photos de session autorisées, décision de Paul du 08/11/2026, provenance
dans `public/photos/session/SOURCES.md` ; aucune image générée par IA ni photo de
banque. Exception limitée aux trois photos choisies, remplaçant pour elles
« aucune photo de remplacement avant AV-3 ». Cadrages entiers, AVIF/WebP 480/960
(atelier limité à sa source de 800 px), sans EXIF/GPS ni retouche. Portrait du
contact et certification Qualiopi inchangés.

Références : mêmes permissions et fichiers, pixels sources sans recoloration, éclairage CSS
successif toutes les 1,6 s, pause survol/focus ; statiques en pleine couleur en
mouvement réduit. Limite actuelle : les cinq fichiers autorisés sont monochromes ;
la restitution couleur attend des originaux couleur. Offres : fond encre, surtitres
et trois coches SVG par carte,
trois actions ghost alignées en pied. Fonds : références/parcours/technologies/
équipe/articles blancs, terrain/services sauge, applications/FAQ blanc cassé,
bandeau final canard. Seuls fonds et couleurs contextuelles changent dans les
sections existantes ; hero et contact conservés.

Terrain : une action formation (`intention-formation-terrain`). Bandeau final :
projet exec (`intention-projet-bandeau`, connecteur canon VS-CONNECTOR), puis
formation ghost (`intention-formation-bandeau`). Attribution/UTM conservés.
Apparition unique 400 ms / 16 px maximum, ajoutée par JS ; contenu visible sans
JS et en mouvement réduit. Aucun seuil géométrique, contraste ou CLS assoupli.
Les anciennes mentions de fonds, photos et absence de surtitres ne s'appliquent
plus au périmètre explicitement amendé ici.

## Parcours de l’accueil par couches, décision de Paul du 08/11/2026

`docs/CODEX-SPEC-2026-11-08-parcours-accueil-couches.md` remplace les anciens
contrats d’ordre et de navigation. Onze sections : hero, références, offres,
applications, parcours, services, technologies, équipe, questions, derniers
articles, fondateur/contact. Navigation : Applications, Offres, Le parcours,
Services, Questions, Contact. `#references` reste accessible.
La section « Ce que l’IA change » est retirée ; sa définition « Un assistant,
ou agent IA, … » devient la première phrase des applications. Les anciennes
ancres renvoient aux applications, y compris via la bascule de langue.
Trois cartes d’entrée FR/EN, une action ghost au contact par carte : sources
`intention-{formation,grands-groupes,pme}-offres`, UTM conservés. Six accordéons
natifs et FAQPage issus du même texte localisé. Trois derniers articles triés
par le Journal, même carte, une destination par article puis lien vers l’index.
La FAQ autorise exactement la réponse à 15 minutes de cette spec ; aucun prix.
Hero, parcours, services, technologies, partenaires, permissions clients,
contact, charte, seuils géométriques et de stabilité restent inchangés.
Les contrats antérieurs ci-dessous ne s’appliquent plus à la section retirée.

## Visibilité IA, décision de Paul du 03/11/2026

La spec `docs/CODEX-SPEC-2026-11-03-alignement-visibilite-ia.md` remplace les
mentions de Lille dans les métadonnées de l'accueil par Tourcoing et Paris.
Le siège légal reste inchangé. `robots.txt` partage un seul groupe `*` ; seuls
`/os` et `/api` sont interdits. Les thèmes exposent un Article et, si des questions
sont affichées, une FAQ strictement issue du même contenu localisé. Leur date
de modification est partagée avec le sitemap dans `src/system/journal-themes.ts`.
Aucun texte visible, prix, client, profil LinkedIn ou adresse de rue ajouté.

## Langue métier et référencement, décision de Paul du 02/11/2026

La spec `docs/CODEX-SPEC-2026-11-02-langue-metier-et-referencement.md`,
validée le 03/11, remplace uniquement les anciens contrats de texte et de placement :
H1 « Votre expertise est la matière première. Nous la mettons au travail. »,
sous-titre « Nous formons vos équipes à l'IA et construisons les outils qui leur manquent. »
(décision de Paul du 08/11/2026),
CTA « Parler d'un projet » / « Talk about a project » aussi dans le hero,
schéma « Ce que vous obtenez / Votre entreprise / Ce que vous avez déjà »,
phrase « Vos e-mails, vos contrats et vos factures contiennent déjà les réponses.
Nous les rendons utilisables. » à la place de Clive Humby. Les assistants gardent
le mot « agent IA » une seule fois, dans la définition sous « Ce que l'IA change ».
Bandeau avant l'équipe : ChatGPT, Claude, Gemini, Mistral, Copilot, Google,
Microsoft, WhatsApp, Telegram, OVH ; registre complet conservé sans autre affichage.
Pied commun : quatre thèmes du Journal, Journal, mentions légales et bascule de langue.
Sections, charte, animations, 48 cas, 23 offres et seuils géométriques conservés.
Le profil LinkedIn d'entreprise reste non confirmé ; aucun `sameAs` inventé.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## AI Playbook — engineering doctrine (REGLES-DOR §33)
Applies to any code delivered from this repo. "The CI blocks" beats "remember to check"; validate before normalizing (foundations first, finishing later). Non-negotiables:
- Plan validated BEFORE any code; 1 module = 1 closed loop (write → targeted review → reversible commit on a branch).
- Data: stable primary key; relations via foreign key only (never join by name); each business entity in its own table (no free text); unique key before any import/seed; constraints in the DB (uniqueness, enum, not-null, format), not only in app code.
- Security: code never reaches business tables from an unauthenticated/client surface — go through a server path; service_role/secrets server-side only; a missing env var = hard stop at startup (no silent fallback); never hardcode a secret (incl. in workflow YAML); DB views in security_invoker (SECURITY DEFINER only for documented anonymous aggregates).
- Versioning: every schema change = a replayable migration + an updated reference schema; never alter the prod schema without a migration.
- Knowledge: maintain a minimal AI_CONTEXT.md (architecture state · risk zones · established rules) and read it first each session.
- JS/TS repos also: TypeScript strict (`any` forbidden), ESLint strict, Dependabot, security scan; ci.yml = exactly checkout → npm ci → npm run lint → npm run build (npm ci, never npm install); CI verifies, it never deploys.

# parrit-site — carte du dépôt (pour Codex & Claude)

> Entrée des agents. `CLAUDE.md` importe ce fichier : même source pour les deux.
> Site institutionnel public **parrit.ai** (Next.js 16 / React 19, déployé sur Vercel via push `main`). REV 01 : **FR + EN** (`src/system/locale.ts`, `LOCALES = ["fr", "en"]`), URLs nues en anglais et `/fr/*` en français ; bascule cliquable avec cookie. `src/proxy.ts` négocie `Accept-Language` par 302 vers le français hors bots et hors cookie de choix. *Corrigé le 20/09/2026 : la mention « anglais uniquement » était obsolète depuis l'ajout du FR.* L'arbre multilingue legacy `[lang]` a été supprimé le 14/08/2026 (Lot P) ; `/:lang/*` répond 301 vers `/`.

## Source de vérité COMMUNE = `TRUTH.md`
**Avant de toucher au contenu/positionnement/conversion, lire [`TRUTH.md`](./TRUTH.md)** : ce qu'est Parrit, le rôle du site (24/10/2026 : montrer produits, réalisations, capacités et preuves ; rendez-vous possible sans maximisation), l'ICP, les offres, la voix (LE TAMIS), les règles dures, et la définition d'une « amélioration ». C'est le **cerveau partagé** entre le site et l'agent d'amélioration continue **Hermes** (`hermes/`, voir `hermes/LOOP.md`). La source de vérité **visuelle** est la section suivante (Brand OS). En cas de conflit : `REGLES-DOR.md` puis `VISION.md` (hors-repo) priment.

## Source de vérité visuelle = Brand OS (04/10/2026)

Le Brand OS remplace la charte T4/REV 03 (D1 du 24/09, désactivation le 28/09).
Le prototype REV 03, `BRAND.md`, `docs/design-system/` et `design-source/` sont historiques.
Ne pas recopier leurs couleurs ni réintroduire leurs polices.

| Source | Rôle |
|---|---|
| `src/system/brand-os.origin.json` | Provenance, commande de régénération et SHA256 du paquet et des polices |
| `src/system/brand-os.tokens.css` | Valeurs vendorisées, jamais éditées à la main |
| `src/system/brand-os.{forbidden-assets,glyphs,connectors}.json` | Contrats d'assets, de couverture typographique et de connecteurs |
| `src/system/tokens.css` | Adaptation du site par `var(--brand-*)`, sans valeur de palette recopiée |
| `src/system/` + `src/app/(rev01)/` | Composants et pages du site |

Régénérer dans le dépôt canon avec la commande de `origin.json`, puis recopier les cinq fichiers
à l'identique. `npm run test:brand-os` contrôle leurs empreintes après build. Les fichiers de
polices General Sans (`public/fonts/rev02/`) et IBM Plex Mono (`public/fonts/rev03/`) doivent
correspondre à `canon_fonts`. Mode accessible uniquement ; `--ed` utilise `--ui`, poids 500.
Aucun mode complex ni Inter Tight.

- **Couleurs (24/09/2026, D1)** : Brand OS P1/P3, valeurs générées dans `brand-os.tokens.css`, adaptées par `tokens.css`.
- **Polices (04/10/2026)** : General Sans pour le texte et l'interface, IBM Plex Mono pour le registre technique ; auto-hébergées.
- **Accent** : utiliser les jetons contextuels du registre clair/sombre ; aucune couleur littérale hors du fichier vendorisé.
- **Boutons** : General Sans 600, casse normale, sans espacement de lettres ajouté.
- **Formes** : radius 0 sauf téléphone, zéro dégradé ; zéro ombre.
- **Logo** : `[P.]` et `PARRIT.AI`, arbitrage AV-2 conservé ; icônes issues du paquet canon.
- **Connecteurs** : tige et tête vectorielles suivant VS-CONNECTOR, aucune flèche-caractère.
- **Photo** : aucune photo de remplacement avant AV-3 ; certification Qualiopi conservée.
- **Enveloppe, décision Paul du 27/10/2026** : page unique, maquette et handoff dans
  `docs/site-v1/page-unique/` ; section 0 prime. Barre canard dans le flux,
  six ancres, langues et contact ; menu mobile natif. Pied : copyright,
  quatre thèmes du Journal, Journal, mentions légales, langue (décision de Paul du 02/11/2026). Aucun surtitre ni registre visible.
- **Photo** : portrait choisi par Paul le 27/10/2026 : buste LinkedIn souriant,
  section contact, exports AVIF/WebP 340/680 de `public/brand/founder/` ;
  octets et SHA256 contrôlés par `tests/fixtures/founder-photo.json`, cadrage entier 3:4.

### Boutons par intention — décision de Paul du 08/11/2026

`docs/CODEX-SPEC-2026-11-08-cta-par-intention-et-finitions.md` prime sur les
contrats antérieurs des boutons du hero et des trois étapes. Hero : « Parler
d'un projet » / « Talk about a project » (`exec`) puis « Former mes équipes » /
« Train my teams » (`ghost`), même hauteur, écart `var(--brand-s2)`, ligne commune
sur ordinateur et pleine largeur en colonne sur téléphone. Parcours : une action
`ghost` par étape, formation / priorités / projet, alignée dès le SSR.
Tous mènent à `/#contact` ou `/fr#contact`, avec `source=intention-{formation,
priorites,projet}-{hero,parcours}` avant l'ancre via `avecSource`. Les UTM sont
conservés dans le HTML serveur et au clic ; sur l'accueil, historique et
défilement sans rechargement, attribution lue par QuickCapture sans nouveau
champ ni modification du serveur. Ligne sous l'envoi, correctif 4, décision de Paul du 08/11/2026 :
« Premier échange de 15 minutes en visioconférence : vous présentez votre besoin, nous vous indiquons ce qui est réalisable. »
« A first 15-minute video call: you present your needs, we tell you what is feasible. »
Références : boucle CSS lente, pause survol/focus, logos statiques centrés en
mouvement réduit ; permissions inchangées. Journal : thèmes uniquement issus du
registre partagé `journal-themes.ts`, lecture estimée à 200 mots/minute arrondie
(minimum 1), deux colonnes dès 1100 px. Tous les seuils géométriques restent
inchangés, dont le hero entier à 1440×800. Les règles ci-dessous restent
applicables hors de ces amendements.

### Boutons publics — tour 1 (26/10/2026)

Largeur de contenu à partir de 600 px ; sous 600 px, tous les boutons d’un même
groupe suivent le même choix de largeur. Alignement sur le bord gauche du texte
précédent, ou centré si son titre est centré. Deux actions : `exec` puis `ghost`,
espacement `var(--brand-s2)`, hauteur et ligne de base communes. Un seul `exec`
par section ; principal en clôture. Pas de point final, infinitif FR et impératif
court EN. Vers `/#contact` ou `/fr#contact` : « Parler d'un projet » / « Talk about a project ».
Le hero suit aussi ce libellé (décision de Paul du 02/11/2026). L’envoi du formulaire de contact reste à droite du champ.
Un seul éclat rose par écran (Brand OS) : navigation `ghost`, dans le flux ; boutons principaux du hero et du contact `exec`. Repli e-mail à bouton neutre.

### Règle de création — non négociable

Toute nouvelle page publique se construit avec `src/system/` (tokens, composants K/St/Frame/
Instrument/RegistryLine, boutons `.rev-button` / `.exec` / `.ghost`) et se vérifie contre le
Brand OS et ses contrats (captures 1440/375, contraste et absence de débordement). Un hex dans une
page est un défaut. Interdit de créer un design system local ou une seconde famille typo.
La CI bloque : `qa:brand:rev01` (tokens, ombres, radius, PC-10) + `qa:network:rev01`
(specs de conformité — H1 88px, une ombre max, zéro radius).

### Règle d'index — arbitrage Paul du 02/08/2026

**La structure n'ajoute pas d'étape entre le visiteur et la valeur.**

Une carte d'index porte **une seule action**, et cette action mène à la **destination finale**. Pas de « voir la fiche » quand une autre action reste nécessaire derrière.

Une ressource a **une seule URL canonique** : celle qui rend son expérience complète (promesse, contenu, preuve, formulaire éventuel, accès, CTA suivant). Elle est déclarée dans `experience` au registre. Le corollaire s'applique partout :

- l'alias `/[lang]/ressources/[slug]` redirige en **301** vers l'expérience quand celle-ci vit ailleurs — la redirection se déclare dans `next.config.ts`, jamais dans une page, pour rester à **un seul saut** ;
- **une seule** des deux URL entre au sitemap, et c'est l'expérience ;
- le `source` et les `utm_*` survivent au saut : ne jamais réécrire une destination en jetant sa chaîne de requête. Un seul utilitaire pose `?source=` — `avecSource()` dans `cta.ts`.

`tests/ressources-reachability.spec.ts` bloque les cinq régressions correspondantes. Ses assertions portent sur les URL et le registre, **jamais sur des classes CSS** : une refonte visuelle ne doit pas casser un test de conversion.

## Routes, page unique (27/10/2026)

- `/` et `/fr` : neuf sections selon `BANDEAU-TECHNOLOGIES.md` §2.
- `/journal`, `/fr/journal`, `/journal/[slug]`, RSS et `/legal`, `/fr/legal` conservés.
- Quatre thèmes bilingues sous `/journal/themes/` : harness-engineering,
  ai-sprints, integration-developpement, conseil-transformation.
- Anciennes pages : 308 en un saut dans `next.config.ts`, quatre pages V1 vers
  leurs thèmes, autres vers les ancres du handoff. Requête conservée.
- `/sketch/[id]` : privé, noindex, inchangé. `/system` reste 404.
- OG et chaîne de publication Journal conservés. `scripts/generate-llms.mjs`
  génère `public/llms.txt` ; ne pas éditer ce dernier à la main.

## Tests : blocage réseau global obligatoire (règle repo, 14/08/2026)

**Aucun test (Playwright ou autre) n'a le droit de laisser sortir une requête vers un service réel.** Incident du 14/08/2026 : le mock e2e interceptait une URL divergente de celle du code, et les POST du CI sont partis en vrai sur le webhook n8n de production (faux leads en CRM + alertes mail). Décision Paul : la règle est gravée ici, immédiatement.

Concrètement, dans toute spec e2e :
- poser un **deny-all** en tête de test — `page.route('**/*', …)` avec allowlist limitée à `localhost`/`127.0.0.1` — et **faire échouer le test** sur toute requête sortante non attendue ;
- ne jamais intercepter un endpoint réel par son URL en dur : importer la constante depuis le code testé, ou intercepter par motif (`**/webhook/**`) ;
- un mock qui ne matche pas = requête qui SORT. Le deny-all est le filet, pas l'exception.

## Batterie avant tout push
```bash
npm run build                                   # inclut prebuild (llms.txt)
npm run qa:brand:rev01                          # couleurs hors vendor, radius, ombres, dégradés, PC-10
npm run test:brand-os                           # origine, polices, assets, glyphes après build
npx next start -p 3210 &                        # les specs visent :3210 (QA_BASE_URL)
npm run qa:network:rev01                        # 5 specs Playwright (deny-all réseau)
```
Voir aussi la skill `qa-playwright` (batterie responsive + multi-navigateur).

## Règles de sortie (non négociables)
- **Jamais d'appel runtime à `*.vercel.app`** dans une livraison (REGLES-DOR §13). Le site EST hébergé sur Vercel — ça vise les ressources chargées au runtime (images/redirects/signatures), pas l'hébergement.
- Aucun prix ni offre détaillée sur le site public (12/10/2026). Pas de devis détaillé ni de prix personnalisé hors propale privée.
- Clients (25/10/2026, révision 4) : seuls les noms de `src/system/public-clients.ts` sont publiables (Laparra, Clevery, Forexpert, Joone, SNCF) ; tous les autres restent anonymisés. Clevery Avocats désigne Clevery. Joone : accompagnement IA ; SNCF : formation avec Arkel, jamais client direct. Exception : le Journal ne nomme aucun client, même public. Décision Paul du 27/10/2026 : logos des cinq clients publiables affichés sans accord écrit des clients ; provenance dans `public/clients/SOURCES.md`, MIT sans logo. Aucun template n'exige de nom ou de logo pour se rendre.
- Positionnement : page unique validée par Paul le 27/10/2026, `docs/site-v1/page-unique/PASSE-3-PAGE-RACONTEE.md`.
- Marque : Parrit.ai ; nom et portrait de Paul autorisés dans le contact (27/10), identité du Journal inchangée.
- Mesure d'audience (05/10/2026) : PostHog retiré du navigateur ; seule mesure active, Cloudflare Web Analytics injectée hors dépôt par Cloudflare et décrite dans `/legal`.
- CTA (26/10/2026) : « Parler d'un projet » / « Talk about a project », hero inclus (décision de Paul du 02/11/2026) vers `/#contact` ou `/fr#contact`.
- CTA réservation (28/10/2026) : Cal.com utilise `paul-larmaraud/audit` en FR et `paul-larmaraud/ai-strategy-meeting` en EN ; un `calLink` explicite reste prioritaire.
- Tests (25/10/2026) : contrôler les règles de fond et la structure, pas les libellés. Conserver les contrôles de destination, accessibilité, réseau et géométrie.
- Collab Codex↔Claude = via **GitHub Issues/PR**, jamais d'auto-merge, **Paul merge**. Codex = codeur, Claude = relecteur (sécu/archi/bugs/dette).

## Page unique et mode accessible (27/10/2026)

La passe 3 (`docs/site-v1/page-unique/PASSE-3-PAGE-RACONTEE.md`) et sa maquette
archivée dans `passe-3/maquette/` priment sur la maquette précédente pour leur périmètre.
Ordre actuel (décision de Paul du 02/11/2026) : hero, applications, ce qui change, parcours, services, technologies,
partenaires, références, fondateur/contact avec réservation intégrée.
Aucune section « Votre phrase ». Aucun prix. Aucun CRM en vedette.
Les chiffres et outils explicitement présents dans la maquette sont autorisés.
Navigation : Applications, parcours, services, équipe, références, contact.
`standard` et `systems` redirigent en 308 vers `#technologies`.
Les références nominatives passent par `getSiteEvidence`. Revue J-30 en CI, pas d'expiration
silencieuse en production. Décision Paul du 27/10/2026 : logos des cinq clients publiables affichés sans
accord écrit des clients, sur sa décision nominative datée ; provenance dans
`public/clients/SOURCES.md`. Le contrat `publicationLogo` reste obligatoire,
ainsi que la permission de publication du client. MIT dans partenaires, sans logo. Logos techniques : outils utilisés, pas partenariat.
General Sans partout sur la page ; IBM Plex Mono uniquement dans le code du Journal.
Téléphones : seule exception de rayon ; animations CSS, messages visibles sans JS
et avec mouvement réduit. Contrôles dans `tests/single-page.spec.ts`.

## Passe 4, 27/10/2026

`docs/site-v1/page-unique/PASSE-4-CAS-D-USAGE-ET-ECRAN.md` prime sur la passe 3
pour les cas d’usage, les offres partenaires, le trajet et la géométrie.
Maquette source archivée : `docs/site-v1/page-unique/passe-4/passe4.py`.
Décision Paul du 27/10/2026, soir : `BANDEAU-TECHNOLOGIES.md` remplace la
règle de confidentialité de la stack. Bandeau `#technologies` juste avant l’équipe (décision de Paul du 02/11/2026) :
pour chaque besoin, nous choisissons la meilleure technologie. Dix noms affichés ; liste canonique
dans `src/system/technologies.ts`, logos locaux dans `public/tech/`, aucun
partenariat sous-entendu. La section architecture est retirée.
Les mentions de Claude Code comme formation/audit restent autorisées.
Un bloc = un écran : en FR/EN et mouvement réduit, à 1440×800, 1280×720 et
390×700, le premier enfant de chaque section (hors hero/contact) et chaque
figure doivent tenir dans la hauteur du viewport, sans découpe ni texte masqué.
Le hero entier, barre comprise, tient à 1440×800 ; le calendrier seul est exempté.
Cinq carrousels mobiles natifs (celui du trajet est retiré), accessibles au clavier, avec points de position.
Les 48 cas et les 23 offres restent dans le HTML serveur ; aucun mouvement
en mode réduit et aucun minuteur après démontage. Le registre de preuves conserve
le pilotage agentique des fruits et légumes pour Laparra ; seuls les logos
sont désormais affichés dans les références (§5 du tour 1).

## Applications concrètes et bouton du hero, amendement du 27/10 au soir

`BANDEAU-TECHNOLOGIES.md` §4 prime pour la section des téléphones et le bouton du hero.
« Quelques applications concrètes. » / « A few real-world applications. » :
trois scènes anonymes, titres et note de données fictives conservés, toujours
visibles même si toutes les permissions clients sont révoquées. Navigation
« Applications » dans les deux langues ; ancres `#en-production` / `#in-production`
conservées. Les noms et logos clients restent uniquement dans `#references`,
avec `getSiteEvidence` et les contrôles de publication inchangés.
Sur ordinateur (>760 px), le bouton rose du hero tient sur une ligne, à sa
largeur de contenu, sous l'accroche et aligné à gauche ; hauteur et rembourrage
existants conservés. Sur téléphone, pleine largeur inchangée. Le hero entier,
barre comprise, tient toujours à 1440×800, sans aucun seuil de contrôle assoupli.


## Tour 1 de la nuit, 27/10/2026

`BANDEAU-TECHNOLOGIES.md` §5 : téléphones de dimensions communes, cartes des
applications pleine largeur sur mobile et carrousel également sur tablette.
Références : seuls les logos autorisés et leurs noms accessibles ; aucun texte
sous le bandeau. Mention de propriété des marques retirée des technologies.
23 offres partenaires FR/EN. `src/system/reading.ts` centralise la lecture :
max(3 000 ms, 1 200 ms + 300 ms par mot), services et offres ; fondus ajoutés
à cette durée, départs décalés, aucune offre tronquée. Hero et contact intacts
sur consigne explicite de Paul : le timing du hero est exclu de ce tour.

## Tour 2 de la nuit, 27/10/2026

`docs/site-v1/page-unique/NUIT-TOUR-2.md` : hauteur des trois téléphones
partagée par une sous-grille CSS, selon le contenu le plus long plus une ligne,
y compris sans JS. Grossiste : clémentines et échéance relative cohérente FR/EN.
Journal uniquement au pied ; hauteurs optiques des logos sans modifier les images.
Titre du fondateur suivi du texte, portrait entier 3:4 ; seul le rembourrage
horizontal du bouton du formulaire change. Hero, autres boutons, Cal.com et
offres intacts. Contrôles existants conservés ; géométrie à rejouer sur l'hôte.

## Tour 3 de la nuit, 28/10/2026

`docs/site-v1/page-unique/NUIT-TOUR-3.md` : seule la mise en page de
`ce-qui-change` / `what-changes` évolue. Cadres et légendes en sous-grille
intrinsèque commune ; cases du logiciel en rangées sur mobile, points proches
des cartes, carrousel natif dès la tablette. Aucun texte ni taille de texte
modifié ; hero, boutons, Cal.com et offres intacts. Tests FR/EN avec/sans JS,
mouvement réduit, alignement à 1 px et écart aux points ≤ 48 px ; contrôles
existants inchangés, dont « un bloc = un écran ». Navigateur à rejouer sur l'hôte.

## Tour 4 de la nuit, 28/10/2026

`docs/site-v1/page-unique/NUIT-TOUR-4.md` : entre 761 et 900 px uniquement,
langues, bouton et menu groupés à droite, logo seul à gauche ; espacement
mobile conservé via Brand OS. Libellés, styles des boutons, hero, Cal.com et
offres intacts. Six tests FR/EN à 900, 800 et 761 px : ordre, ligne commune,
bords à 1 px, écarts ≤ 48 px et absence de débordement horizontal.
Contrôles existants inchangés ; navigateur à rejouer sur l'hôte.

## Tour 5 de la nuit, 28/10/2026

`docs/site-v1/page-unique/NUIT-TOUR-5.md` : panneau du menu ouvert uniquement,
à ≤900 px, filet bas de 1 px via `--on-canard` et rembourrages verticaux
égaux via `--brand-s2`. Quatre tests FR/EN à 390×844 et 800×1100 : bordure
visible, liens entiers, absence de débordement et état fermé inchangé.
Contrôles existants conservés ; Playwright à rejouer par Claude sur l'hôte.

## Hero tablette, 28/10/2026

`docs/site-v1/page-unique/HERO-TABLETTE.md` : entre 761 et 1100 px, schéma
sous le texte et le bouton, pleine largeur et sans plafond de hauteur ; légende
puis citation. Contour canard de 4 unités sur `.toklab` seulement, via Brand OS.
Textes, composant, animation et géométrie hors tablette inchangés. Quatre tests
FR/EN à 800×1100 et 1024×768 : ordre, largeur ≥90 %, étiquettes à l'écran ≥14 px,
bouton intrinsèque sur une ligne et absence de débordement. Contour vérifié dans
les tests animés FR/EN ordinateur/mobile ; aucun contrôle existant assoupli.
Validation : npm ci, lint, build Webpack, 121/121 tests Node (avant/après),
marque/claims et 19/19 Brand OS réussis. Turbopack interrompu après 90 s sans
progression ; 125 tests Playwright recensés, à rejouer par Claude sur l'hôte.

## Page stable, 28/10/2026

`docs/site-v1/page-unique/PAGE-STABLE.md` : légendes, cas et faces partenaires
réservent leur variante la plus haute par grille dès le SSR. Conversations
complètes dans le flux ; animation par opacité/translation seulement. General Sans
400/500/600 préchargées, repli Arial ajusté aux métriques des fichiers canoniques.
Correctif hôte : General Sans 400/500/600 en `font-display: optional` pour éviter
les sauts liés aux coupures de mots différentes en Arial ; préchargements et
repli conservés, IBM Plex Mono inchangée. Test de fontes lentes intact (position
et hauteur ≤ 1 px, layout-shift ≤ 0,01, chargement vérifié par `document.fonts.check`) ;
huit contrôles FR/EN supplémentaires vérifient General Sans sur le H1 au premier
affichage avec les fontes servies normalement (`getComputedStyle` et `document.fonts.check`).
Cal.com réserve 570/910 px selon la largeur du cadre, sans plafond ni découpe ;
profil étroit à 800 px à confirmer avec le calendrier réel sur l'hôte.
`tests/stabilite.spec.ts` rejoint `qa:network:rev01` : huit parcours FR/EN,
quatre tailles, 25 s immobiles puis défilement ; huit contrôles de fontes lentes.
SDK et iframe Cal servis localement, deny-all inchangé. Textes, `reading.ts`
et assertions existantes intacts ; géométrie et CLS à rejouer par Claude sur l'hôte.

## Hero trois plans, 29/10/2026

Les noms des plans ont, comme les zones, le fond de la page (`var(--canard)`), avec `padding:0 2px` (31/10/2026).

Amendement du 30/10/2026 : `docs/CODEX-SPEC-2026-10-30-hero-reclamation-qualite.md`.
La quatrième histoire devient « Une réclamation qualité arrive » pour que la
home parle aussi à l’industrie. Parcours : E-mails, Réclamation, Commande,
Procédures, Recherche documentaire (« Cause identifiée »), puis ERP après
« Vous décidez ». Trois liens ajoutés ; les trois autres histoires, tous les
nœuds (y compris ceux de la réunion), les liens existants, durées et styles
sont conservés.

`docs/CODEX-SPEC-2026-10-29-hero-trois-plans.md` remplace les précédents
contrats du hero, dont `HERO-TABLETTE.md`. Titre « Votre expertise est la matière première.
Nous la mettons au travail. », sous-titre « Nous formons vos équipes à l'IA et construisons
les outils qui leur manquent. » (décision de Paul du 08/11/2026),
trois plans, 33 nœuds et quatre histoires issus des maquettes archivées dans
`docs/hero-trois-plans/` (sans générateurs Python). À partir de 1200 px :
légende et carte sous le texte à gauche, schéma dégagé et citation à droite.
En dessous : bouton pleine largeur, schéma sans libellés de nœuds ni zones,
plafonné à 560 px, légende puis citation ; H1 mobile 38/43 px.
Un seul minuteur, étapes 2700 ms, dernière 3600 ms, pause 900 ms ; nettoyage
hors écran et mouvement réduit restituent l'histoire 1 à l'étape 4.
Amendement `docs/CODEX-SPEC-2026-10-29-hero-trois-plans-allege.md` : légende
à deux rangées, une phrase par étape (18/26 px, graisse 600), puis la carte.
Titre à l'étape 0, étape traduite capitalisée et ponctuée ensuite ; fondu
250 ms sans déplacement, aucun fondu en mouvement réduit. Les vingt phrases
et quatre cartes complètes réservent leur hauteur dès le SSR. Plus de liste
visible ni de pastilles ; les quatre étapes courantes restent dans une liste
réservée aux lecteurs d'écran, hors mise en page. Fond des libellés et surface
du plan partagent `--onto-plane`, mélange canard/encre à 48 % d'encre ; les zones
gardent la couleur de la page, `--canard`.
Le rose reste au seul bouton ; validation sauge,
General Sans, aucun rayon ni ombre. Le hero entier tient toujours à 1440×800.
Les audits typographiques appliquent la nouvelle échelle uniquement au hero ;
les seuils de stabilité et les contrôles des autres sections restent inchangés.
