# parrit.ai : positionnement logiciels métier + deux parcours (PROPOSITION, ne pas fusionner sans Paul)

Date : 25/10/2026. Base : origin/main `c8dce63`. Rédigée par Claude, implémentée par Codex (§25).
Statut : **proposition de texte public**. La PR sert à la revue visuelle par Paul ; elle ne part en production
qu'après son accord explicite sur les mots.

## Source du positionnement
Dossier Whimsical « Dossier sourcé · Parrit × Maxime », bloc « Positionnement confirmé » (24-25/10) : Parrit construit
et distribue des logiciels, avec vocation à verticaliser des logiciels métier, et accompagne les entreprises dans leur
transformation IA ; deux parcours, PME et grands groupes, sans réserver le logiciel à l'un et le conseil à l'autre ;
la formation passe par FormIA, organisme de formation de Parrit.ai, sans site autonome. Le site affiche aujourd'hui
« maison de données et d'IA » : c'est l'écart corrigé ici.

## Règles absolues
- Change **uniquement** les textes listés ci-dessous, mot pour mot. Rien d'autre (h1 conservé : décision du 04/10).
- Ne change pas les CTA ni leurs libellés (« Réserver l'examen » / « Book the examination » sont verrouillés par
  des tests et une décision publiée). La nouvelle section **ne contient aucun lien ni bouton**.
- Aucun nom de client, aucun prix, aucune mention Qualiopi ou certification.
- Pas de tiret cadratin ni demi-cadratin. Apostrophes droites comme le reste du fichier.
- Tests : tu peux modifier **seulement** l'assertion de `tests/conformity-home.spec.ts` (~l.137) qui épingle le texte
  de `.home-s-hero-sub`, pour la nouvelle phrase. Aucun autre test existant ne se modifie ; si un autre test casse,
  explique pourquoi et arrête-toi sur ce point. Ajoute un test pour la nouvelle section.
- Aucune nouvelle couleur, police ou rayon. Pas de rose dans la nouvelle section (un éclat rose par écran).

## Textes

### Hero (`src/app/(rev01)/page.tsx`, `DICT`)
- FR `hero.kicker` : `Parrit / Logiciels et IA`
- EN `hero.kicker` : `Parrit / Software and AI`
- FR `hero.sub` : `Parrit.ai construit des logiciels métier et accompagne les entreprises dans leur transformation IA. La facture qui traîne, le rapport refait à la main chaque semaine : nous partons de vos données et construisons des outils qui vous appartiennent.`
- EN `hero.sub` : `Parrit.ai builds business software and helps companies through their AI transformation. The invoice that drags, the report rebuilt by hand every week: we start from your data and build tools you own.`

### Métadonnées de l'accueil (`generateMetadata` du même fichier)
- FR title : `Parrit.ai · Logiciels métier et IA, des outils qui vous appartiennent`
- EN title : `Parrit.ai · Business software and AI, tools you own`
- FR description : `Parrit.ai construit des logiciels métier et accompagne les PME, les ETI et les grands groupes dans leur transformation IA. Ce que nous construisons vit dans vos comptes et vous appartient.`
- EN description : `Parrit.ai builds business software and helps SMEs, mid-sized companies and large groups with their AI transformation. What we build lives in your accounts and belongs to you.`
- `src/app/(rev01)/layout.tsx` (~l.39, titre par défaut EN commençant par « Parrit.ai · Data and ») : remplacer
  « Data and AI » par « Business software and AI » sans toucher le reste de la chaîne.
- `src/app/opengraph-image.tsx` : la mention « DATA AND AI » (ou équivalent) devient « SOFTWARE AND AI » ; `alt`
  aligné. Ne rien changer d'autre dans l'image.

### Nouvelle section « parcours » (FR et EN)
Placée **juste après** la section `.home-s-brands` et avant `.home-s-maison`. Classe racine `home-s-parcours`.
Composition : reprendre le gabarit et les styles de `.home-s-proof` (fond clair, kicker mono, deux colonnes séparées
par un filet vertical en desktop, une colonne avec filet horizontal sous 760 px). Pas de nouveau composant si
`.home-s-proof-*` peut être réutilisé par classes partagées. Bord gauche = grille du site (180 px à 1440, 20 px mobile).

FR :
- kicker : `Avec qui nous travaillons`
- h2 : `Nous travaillons avec des PME, des ETI et des grands groupes.`
- colonne 1, h3 `PME et ETI` ; texte : `Le dirigeant nous apporte un sujet précis. Nous le cadrons avec lui, nous construisons, puis son équipe reprend l'outil.`
- colonne 2, h3 `Grands groupes` ; texte : `Une direction métier ou la direction de la transformation porte le projet. Nous préparons le périmètre avec le sponsor et les équipes techniques, puis nous construisons.`
- note sous les colonnes (style `doctrine-note`) : `Dans les deux cas, nous faisons du conseil et du logiciel. Pour former vos équipes, nous passons par FormIA, l'organisme de formation de Parrit.ai.`

EN :
- kicker : `Who we work with`
- h2 : `We work with SMEs, mid-sized companies and large groups.`
- column 1, h3 `SMEs and mid-sized companies` ; text : `The CEO brings us one precise problem. We scope it together, we build, then the team takes the tool over.`
- column 2, h3 `Large groups` ; text : `A business unit or the transformation office owns the project. We set the scope with the sponsor and the technical teams, then we build.`
- note : `Either way, we do consulting and software. Training goes through FormIA, Parrit.ai's training organisation.`

### Test à ajouter
Playwright (même harnais que `conformity-home.spec.ts`), FR et EN, 1440×900 et 390×844 : la section
`.home-s-parcours` existe une fois, contient 2 h3, 0 lien, 0 bouton, le h2 attendu, se place entre
`.home-s-brands` et `.home-s-maison`, et son bord gauche = celui du h2 de `.home-s-maison` (± 1 px).

## Vérifications
`npm run lint && npm test && npm run test:brand-os && npm run qa:claims:rev01 && npm run build && npm run qa:brand:rev01 && npm run qa:network:rev01`

## Compte rendu attendu
Fichiers modifiés, test ajouté, assertion modifiée (avant/après), résultats, points non appliqués avec la raison.

---

# RÉVISION 2 (25/10/2026, 23h) — décisions de Paul intégrées

Le travail du premier passage est déjà dans ce worktree (textes, section, `conformity-home.spec.ts`). Garde-le,
corrige-le et complète-le avec ce qui suit. La batterie du premier passage a échoué sur
`tests/brand-os-render.test.mjs:149` (titre de page figé mot pour mot) : c'est l'objet du point R2.

Décisions de Paul du 25/10 (dictées, source de cette révision) :
- « On n'est pas obligé de protéger par les tests les choses-là. » Les tests ne doivent plus figer des libellés.
- « Les règles écrites de Parrit.ai et le système de contrôle : enlever les contradictions et rester aligné sur la
  dernière version. »
- Règle d'or n° 6 amendée : « On doit montrer ce qu'on est capable de faire. Et oui, on peut citer Laparra. »
  Seul Laparra est autorisé à être nommé ; les autres clients restent anonymisés.

## R1. Citer Laparra (accueil, FR et EN)
- `brands.list` FR devient : `Laparra, grossiste en fruits et légumes au MIN de Rungis · un groupe industriel · un cabinet d'avocats · un courtier en énergie B2B · une marque grand public.`
- `brands.note` FR devient : `Les autres noms sont communiqués en rendez-vous.`
- EN `brands.list` : `Laparra, a fruit and vegetable wholesaler at the Rungis market · an industrial group · a law firm · a B2B energy broker · a consumer brand.`
- EN `brands.note` : `Other names are shared in a meeting.`
- Section `home-s-parcours`, colonne PME et ETI : ajouter une seconde phrase après le texte existant.
  FR : `Chez Laparra, grossiste en fruits et légumes au MIN de Rungis, les commerciaux travaillent dans le CRM que nous avons construit avec eux.`
  EN : `At Laparra, a fruit and vegetable wholesaler at the Rungis market, the sales team works in the CRM we built with them.`
- Le découpage de `brands.list` sur ` · ` doit continuer à fonctionner (le premier élément contient une virgule).
- Aucun logo, aucun lien vers un site tiers.

## R2. Les tests ne figent plus les libellés
Dans les tests existants, remplace chaque assertion qui compare un **texte de copie exact** (titre, sous-titre,
libellé de bouton, phrase de section, titre de page/metadata) par une assertion **structurelle** qui garde l'intention :
- au lieu de `toHaveText("<phrase>")` / `html.includes("<titre>")` : l'élément existe, n'est pas vide, est unique si
  l'unicité est le vrai contrôle ;
- au lieu de `getByRole("link", { name: "Réserver l'examen" })` : le lien d'action principal est unique dans sa
  section et pointe vers `/commission` (ou `/fr/commission`) ;
- les règles de **fond** restent testées : pas de prix, pas de tiret cadratin, pas de rose en double, pas de nom de
  client hors liste autorisée, pas de lien vers paul-larmaraud.com, pas de mention du fondateur hors /legal, grille et
  alignements, accessibilité, réseau.
Fichiers connus concernés : `tests/brand-os-render.test.mjs`, `tests/conformity-home.spec.ts`,
`tests/doctrine-visible.spec.ts`, `tests/doctrine-visible.test.mjs`, `tests/audit-truth-copy.test.mjs`. Cherche les
autres (grep des chaînes de copie dans `tests/`). Liste dans le compte rendu chaque assertion remplacée (avant → après).
Ne supprime aucun test entier ; ne relâche aucune règle de fond.

## R3. Liste unique des clients nommables
- Crée `src/system/public-clients.ts` : `export const PUBLIC_CLIENT_NAMES = ["Laparra"] as const;` avec un commentaire
  « Règle d'or n° 6 amendée le 25/10/2026 : seuls ces clients peuvent être nommés publiquement. »
- Si un test, un script de gate (`scripts/false-claims-check.mjs`, `scripts/*.mjs`, `tests/*`) interdit les noms de
  clients ou l'expression « Les noms des clients sont communiqués », fais-le lire cette liste au lieu d'une règle
  « aucun nom ». Ajoute un test : un nom de client hors liste (ex. une chaîne de test fictive) dans le DICT de
  l'accueil fait échouer le contrôle. Si aucun contrôle de ce type n'existe, ajoute ce test minimal.

## R4. Règles écrites alignées sur la dernière version
Réécris les passages contradictoires de `TRUTH.md`, `AGENTS.md` et `AI_CONTEXT.md` (et `CLAUDE.md` du dépôt s'il les
répète) pour qu'ils décrivent l'état décidé le plus récent, chacun avec sa date. Supprime l'ancienne règle au lieu de
l'empiler (une ligne « remplacé le JJ/MM » suffit). État à écrire :
1. Positionnement (25/10) : Parrit construit des logiciels métier, avec l'ambition de verticaliser des produits, et
   accompagne les entreprises dans leur transformation IA ; deux parcours, PME/ETI et grands groupes, conseil et
   logiciel ouverts aux deux ; FormIA = organisme de formation de Parrit.ai, sans site propre. Remplace « maison
   française indépendante de données et d'IA ».
2. Rôle du site (24/10) : peu de texte, montrer produits, réalisations, capacités et preuves ; le rendez-vous est une
   suite possible, pas une métrique à maximiser. Remplace les « north stars RDV/semaine et cash hebdo » du §2.
3. Prix (12/10) : aucun prix ni offre détaillée sur le site. Supprime la règle « ancrage À partir de 3 500 € HT » du §6.1.
4. Clients (25/10) : seuls les noms de `src/system/public-clients.ts` sont publiables (Laparra) ; les autres anonymisés.
5. Couleurs (24/09, D1) : Brand OS P1/P3, valeurs dans `src/system/brand-os.tokens.css` (généré) adaptées par
   `src/system/tokens.css`. Supprime « palette rev02 / système d'accent bleu ».
6. Polices : General Sans (texte et interface) + IBM Plex Mono (registre technique), auto-hébergées. Supprime
   Source Serif 4.
7. Mesure d'audience (05/10) : PostHog retiré du navigateur ; seule mesure active = Cloudflare Web Analytics injectée
   par Cloudflare (hors dépôt), décrite dans /legal. Supprime « PostHog autocapture et session replay » du §7.
8. Fondateur (12/10) : aucune mention du fondateur hors /legal ; une seule marque Parrit.ai.
9. CTA (04/10, en vigueur) : « Réserver l'examen » / « Book the examination » vers /commission. Ne pas le changer ici.
10. Tests (25/10) : les tests contrôlent les règles de fond et la structure, pas des libellés.
Ne touche pas aux autres sections de ces fichiers. Pas de tiret cadratin.

## Vérifications
Inchangées (voir plus haut). Le serveur de test est démarré par la batterie, pas par toi.


---

# RÉVISION 3 (25/10/2026, 23h30)

Batterie précédente : 315/316, un échec. `tests/conformity-i18n.spec.ts:148` : tu as remplacé « le texte "Article en
anglais." est absent » par « `h1 + p` est absent », or les articles anglais ont un paragraphe sous le h1. Mauvais
substitut. Corrige : repère l'élément qui porte la mention de langue de l'alias français par un crochet stable
(classe existante ou, à défaut, un attribut `data-language-note` ajouté à cet élément, sans effet visuel) et teste sa
présence sur l'alias FR et son absence sur l'URL EN. Relis toutes les autres assertions structurelles que tu as
écrites avec la même question : « ce substitut peut-il être vrai pour une autre raison ? » ; corrige celles qui le
peuvent. Ne committe aucune capture `.codex-handoffs/**/*.png`.
