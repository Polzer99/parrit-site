# Page unique Parrit.ai

Implémentation locale du handoff daté du 27/10/2026, section 0 prioritaire.
Checkout explicitement désigné par Paul : `page-unique-2`, HEAD initial
`9b658e26b8a2de15cd8be0483f0e0d5c85530c86`, propre avant travaux.
Aucun commit, push, changement de branche, déploiement ou appel métier réel.

## Livré

- Neuf sections FR/EN dans l’ordre final : hero, production, changements,
  parcours, services, garde-fous, partenaires, références/outils, contact.
  Texte FR repris de la maquette ; EN des §0, §2 et §6. Ancres localisées,
  mêmes grilles, espacements, couleurs Brand OS, General Sans et ontologie (addendum ci-dessous).
- Header dans le flux, six ancres, bascule de langue conservant requête et
  ancre traduite ; menu mobile natif. Footer limité aux liens demandés.
- Trois téléphones : animations CSS opacity/transform, cycle 18 s, activées
  après hydratation. Sans JS et en mouvement réduit, messages tous visibles.
- ServiceGrid partagé entre les six services et les six spécialités partenaires.
- Réservation CalInline dans `#contact`, cible `#reservation`, puis QuickCapture
  dans un repli. Lien Journal et mention de la métropole lilloise ajoutés.
- Portrait `/photos/paul-centre.png` copié sans retouche : SHA256
  `b5537ffe836e6933a11e2ff6b81b617e5ccab24213462bfc41c27aae0e182733`.
  Contrat : `src/system/single-page-assets.json`. Le registre local porte encore
  CANDIDATE ; l'autorisation explicite du handoff et de la maquette prime.
- Dix outils : assets fournis, SVG monochromes par masque ; OpenCode conserve
  son PNG fourni (un masque alpha sur cette image opaque formerait un carré).
  Provenance/licences dans `public/tools/SOURCES.md`, sans inventer une licence
  CC0 pour le PNG OpenCode. Aucun logo client ou MIT téléchargé.
- Permissions de texte conservées via getSiteEvidence ; logos distincts,
  éteints, accord nominatif daté/source/fichier obligatoires. MIT reste invisible
  et attaché aux partenaires. Révocation des droits : scènes et références
  retirées, titres vides masqués, outils indépendants conservés.
- Quatre thèmes bilingues sous le Journal, avec réponse directe courte,
  contenu textuel existant, FAQ, articles pertinents et contact. Anciennes
  pages supprimées ; 308 vers thèmes ou ancres, requête conservée. Sitemap
  et générateur llms actualisés. Journal, articles et chaîne de publication
  conservés ; esquisses privées conservées.
- Organization conserve le siège légal de Rueil-Malmaison, ajoute areaServed
  Lille/MEL/Hauts-de-France/France. Person lié par worksFor sur l'accueil.
  Aucun LocalBusiness ni adresse fictive. Titres/descriptions localisés.
- Grain et composants devenus inutilisés retirés ; règles AGENTS/TRUTH mises
  à jour, sans modifier les fichiers vendorisés Brand OS ni les polices.

## Arbitrages documentés

Section 0 remplace l'ancien H1, l'ordre à huit sections et « Votre phrase ».
§6.4 remplace les redirections vers ancres des quatre guides par les thèmes.
Les téléphones, le portrait, les chiffres et les logos techniques explicitement
validés priment sur la liste ancienne d'interdits contradictoire.
La phrase exacte sur l'organisme certifié et sa traduction sont autorisées
uniquement dans les deux fichiers de copy de la page, avec référence au handoff
au niveau de la gate claims. Les autres affirmations restent contrôlées.

Le champ sameAs du graphe existant est vide. Aucun lien LinkedIn vérifié n'a
été trouvé dans le code, site.config ni les sources du lot : il reste vide,
plutôt que d'inventer un profil. C'est une réserve sur le §6.4.
La négociation linguistique historique est conservée : une destination anglaise
suivie sans cookie par un navigateur francophone peut ensuite négocier un 302
vers le français. Les 308 de migration eux-mêmes sont directs ; les tests les
vérifient hors négociation (Accept-Language en).

## Vérification et limites

Baseline : npm ci réussi ; 165/169 tests Node réussis avant modification,
quatre échecs dont les tests nécessitant les manifests de build absents.
Le changement de contrat justifie les suppressions de tests des anciennes
pages, des scènes retirées et du grain. Les contrôles de fond sont conservés :
permissions, revue J-30, clients, claims, Journal, légal, palettes/empreintes,
contraste 4.5/3, boutons 3:1, réseau, métadonnées, locale et redirections.
Détail : [TESTS-PAGE-UNIQUE.md](TESTS-PAGE-UNIQUE.md).

Une revue indépendante a détecté puis fait corriger la grille mobile,
l'alignement header/footer, la hauteur du menu, la taille des masques,
l'apparition initiale des messages, les titres sans références et le contenu
textuel du schéma Harness. La revue n'est pas une preuve visuelle.

### Comparaison demandée

Références examinées : [1440](maquette-1440.png), [390](maquette-390.png),
[HTML validé](MAQUETTE-VALIDEE.html).

**Captures de l'implémentation indisponibles dans ce sandbox** : `next start
-p 3210` échoue avec `listen EPERM`; Chromium échoue avant toute navigation
avec `bootstrap_check_in ... Permission denied (1100)` et SIGTRAP. Aucune
capture de référence n'a été remplacée ni présentée comme un rendu candidat.
La géométrie, le contraste calculé dans le navigateur et le calendrier réel
restent à vérifier sur l'hôte. Les tests SSR utilisent un blocage réseau ; ils
ne prouvent pas le chargement du calendrier tiers.

Écarts prévus et demandés par le handoff par rapport au rendu statique :
langues et bouton/menu mobile visibles, lien Journal avant le fondateur,
mention lilloise, calendrier intégré et repli e-mail. Ces ajouts allongent la
page. Le header desktop est légèrement compacté pour accueillir les langues.
Le PNG OpenCode est affiché comme dans la maquette, les neuf autres logos sont
des masques. Les autres écarts visuels ne sont pas quantifiés faute de captures.

Rejeu sur hôte, sans requêtes réelles :

```bash
npm run build # ou npx next build --webpack si Turbopack reste bloqué
npx next start -p 3210
# Dans un autre terminal :
PAGE_UNIQUE_CAPTURE=1 npm run qa:network:rev01
```

Les captures FR 1440/390 de single-page.spec.ts seront écrites à côté des
maquettes. Les mocks calendrier et le deny-all sont obligatoires.

## Résultat de la batterie finale

La chaîne exacte demandée a été lancée. npm ci, lint et les 103 tests Node
réussissent ; elle reste ensuite bloquée sur « Creating an optimized production
build » de Turbopack, sans progression, puis est interrompue. Le script build
n'est pas modifié. Validation de repli : `npx next build --webpack`.

| Contrôle | Résultat |
|---|---|
| `npm ci --silent` | Réussi |
| `npm run lint` | Réussi |
| `npm test` | 103/103 réussis |
| `npm run build` (Turbopack) | Bloqué, interrompu sans progression |
| `npx next build --webpack` | Réussi, 52 pages générées, TypeScript réussi |
| `npm run qa:brand:rev01` | Réussi |
| `npm run qa:claims:rev01` | Réussi |
| `npm run test:brand-os` | 19/19 réussis |
| `qa:network:rev01 -- --list` | 70 cas recensés, six fichiers |
| Navigateur/captures | Non validés : EPERM serveur et Chromium |
| `git diff --check` | Réussi |

La dernière revue ajoute aussi la vérification de l'unicité des titres sur les
routes et langues au rendu serveur, puis rejoue lint, build Webpack, les 103
tests et les trois gates. Les titres des thèmes reprennent leur nom et leur
phrase validée pour distinguer FR et EN.

Warnings non bloquants conservés : type de module Node implicite et avertissement
Next metadataBase pendant certains rendus. Les assertions sur les URL publiques
OG, Twitter, les glyphes et les métadonnées du rendu compilé restent actives.
Journaux de travail : `/tmp/parrit-page-unique/`.

## Périmètre et réversibilité

TARGET_SYSTEM : checkout local explicitement mandaté ; ENVIRONMENT : sandbox.
WRITE_SCOPE : code, tests, assets publics et documentation du site ; aucune
ligne de base de données modifiée. REVERSIBLE : diff Git non committé ; baseline
HEAD ci-dessus et sources maquette conservées. ROLLBACK : réappliquer le diff
inverse après revue, sans toucher à un système externe. Boucle bornée : deux
passes implementation/revue, arrêt sur refus sandbox répété et résultat de la
batterie. PRODUCTION_PROOF : aucune, aucun déploiement autorisé dans ce lot.


## Addendum du 27/10 : expertise, boutons, ontologie et tâches

Source : `ADDENDUM-PAGE-UNIQUE.md` et bloc `svg.onto` de la maquette mise à
jour, lus dans ce checkout. Modifications limitées au hero, aux boutons
principaux hero/fondateur, aux animations des trois panneaux, aux tests et
aux documents de référence. Le travail préexistant non commité est conservé.
Aucun commit, push ou changement de branche.

- Sous-titre FR et EN exacts de l'addendum. Mesure 560 px, interligne 1,45 ;
  `--t-xl` (26 px) pour le pas supérieur, au lieu des 24 px hors échelle de
  la maquette. Boutons : `--t-l` (22 px, pas le plus proche de 21 px), padding
  22 × 36 px. Aucun jeton vendorisé modifié.
- Escalier supprimé ; SVG décoratif aria-hidden, viewBox 1080 × 260,
  trois couches, quatre données, trois règles, trois agents carrés à deux yeux,
  onze liens et onze impulsions. Coordonnées et temporisations reprises de la
  maquette ; identifiants préfixés `onto-`. Libellés intégralement traduits.
  Blanc, canard et couleur contextuelle via les jetons Brand OS ; aucun rose.
  Figure conservée aussi sur mobile ; taille des textes SVG au plancher 16 px
  en unités du viewBox, qui est réduit avec la figure comme dans la maquette.
- Réponse différée et compte rendu ligne par ligne sur 8 s ; badge après
  2,4 s ; trois agents allumés successivement sur 6 s. CSS activée après
  hydratation via le mécanisme existant. Sans JS et en mouvement réduit,
  réponse, lignes, badge et trois agents allumés restent affichés. En mouvement
  réduit, les impulsions SVG sont masquées et le réseau reste visible.
- `TRUTH.md` actualisé avec le sous-titre et le remplacement de l'escalier.

Validation de départ : 103/103 tests Node. Deux tests SSR ajoutés (FR/EN) :
structure, nombre d'éléments, références des chemins, absence de couleurs
littérales/rose dans le SVG et traduction. Quatre cas Playwright ajoutés :
FR/EN à 1440/375, absence de rose calculée sur toute la figure, réseau visible,
impulsions masquées, état final des tâches, tailles des boutons/sous-titre,
absence de débordement, temporisations et changement de préférence à chaud.
Le deny-all et les mocks existants sont conservés.

Limite constatée à nouveau : `next start -p 3210` retourne `listen EPERM` ;
les quatre cas Chromium échouent au lancement avec `MachPortRendezvousServer:
Permission denied (1100)`, avant navigation. Aucune capture candidate ni
preuve visuelle obtenue ; aucune preuve production, aucun déploiement.
Rejeu hôte : `npx playwright test tests/single-page.spec.ts --browser=chromium`.

Batterie finale demandée lancée dans son ordre exact : lint réussi, 105/105
tests Node réussis, puis Turbopack sans progression à « Creating an optimized
production build ». Interruption explicite (code 130), puis reprise manuelle
au repli `npx next build --webpack` et aux trois contrôles suivants.

| Contrôle addendum | Résultat |
|---|---|
| `npm run lint` | Réussi |
| `npm test` | 105/105 réussis (baseline 103/103) |
| `npm run build` | Turbopack interrompu sans progression |
| `npx next build --webpack` | Réussi, TypeScript et 52 pages |
| `npm run qa:brand:rev01` | Réussi |
| `npm run qa:claims:rev01` | Réussi |
| `npm run test:brand-os` | 19/19 réussis |
| Quatre nouveaux cas Playwright | Bloqués avant navigation par le sandbox |
| `git diff --check` | Réussi |

Les avertissements préexistants metadataBase et type de module Node restent
non bloquants. La validation navigateur n'est pas revendiquée.
