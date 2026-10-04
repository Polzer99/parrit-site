# AI Context

## Architecture actuelle

Site public Parrit.ai : Next.js 16.2.2 (App Router), React 19, TypeScript strict, Tailwind v4. Déploiement Vercel depuis `main`, Node.js 24.x (`.nvmrc`). Lire `AGENTS.md`, puis `TRUTH.md` avant tout changement de contenu ou de conversion. La spec validée `docs/CODEX-SPEC-2026-09-06-site-integral.md` décrit les lots du 06/09/2026.

L'application publique canonique vit dans `src/app/(rev01)/` : `/`, `/manufacture`, `/standard`, `/dossiers`, `/commission`, `/journal`, `/journal/[slug]`, `/journal/rss.xml`, `/legal` et `/sketch/[id]`. Le layout du groupe charge les polices, tokens, styles et la command bar. La home simplifiée porte `QuickCapture` hero et `AgentEsquisse`, puis les métriques et les sections éditoriales. `Opening` reste dans le code mais n’est plus rendu (décision Paul 06/09/2026). Les cinq pages intérieures ont leur copy FR/EN dédié.

Le copy vit dans des dictionnaires `DICT` par page et dans les composants localisés. Depuis le lot GEO/SEO B, les URLs nues rendent toujours l'anglais ; `/fr` et `/fr/{manufacture,standard,dossiers,commission,journal,legal}` rendent le français par rewrite du proxy, sans duplication. Le proxy transmet le chemin public et la locale ; `getLocale()` donne priorité au chemin. La négociation Accept-Language redirige en 302 uniquement les URLs traduites nues, hors bots et hors cookie de choix. Le header pose le cookie puis navigue entre URLs localisées ; `?lang=fr|en` migre en 301 en conservant les autres paramètres. Les articles du Journal et son RSS restent sans variante `/fr`. Canonicals, hreflang réciproques et OG suivent le chemin ; x-default reste anglais. Le sitemap inclut les sept paires (six routes institutionnelles et l'index Journal traduit).

## Canon visuel

Depuis le 04/10/2026, le Brand OS remplace T4/REV 03 : `src/system/brand-os.*` contient
le paquet vendorisé immuable (mode accessible), avec empreintes et régénération dans
`brand-os.origin.json`. `tokens.css` adapte ses valeurs par alias. General Sans (UI et titres)
et IBM Plex Mono (technique) sont conservées à leurs chemins actuels, contrôlées par SHA256.
Les documents REV 03 et `BRAND.md` sont historiques. Aucun mode complex ni Inter Tight.
Les OG utilisent `token.server.ts` et les deux CSS sont tracés dans les bundles Next.
Les états sombres redéfinissent les gris et `--label-d`, dont le défaut convient au clair.

## Conversion et données

`QuickCapture` poste vers `/api/interet`. Sa variante hero propose `idee` optionnelle (300 caractères) ; `src/lib/server/interets.ts` la range dans `metadata.interets_declares[].idee_prototype`. Les écritures métier passent par le serveur ; aucun secret côté client. `RegisterInterest` a été supprimé au lot GEO/SEO A.

`AgentEsquisse` est un échange déterministe local, sans backend ni LLM, avec un événement analytique au premier envoi. `/commission` porte `ParritCalInline` puis une capture standard. Le Journal n'a pas de capture d'abonnement. Les esquisses privées `/sketch/[id]` restent noindex et dynamiques ; leur UUID est le jeton d'accès.

## Journal et zones sensibles

Les entrées sont dans `content/journal/*.mdx`, lues par `src/system/journal.ts`. Ne pas modifier ces articles dans une purge d'identité. Le publisher `scripts/publish-journal.mjs` passe les gates de `scripts/journal-gates.mjs` puis le contrat de validation. Sa publication hors dry-run utilise git et pousse sur `main` : ne pas l'exécuter pendant un lot interdisant git.

Les registres `src/lib/registry/` restent des données legacy : éviter les transformations larges. L'entrée de ressource du détecteur dont la route n'existait plus a été retirée au lot 3. Aucun changement de schéma de base dans ce lot.

## Surfaces retirées

`src/app-rev01/` et la route de debug `src/app/system/` sont supprimés ; `/system` répond 404. Le microsite et ses assets dédiés sont archivés dans `archive/camp-costa-rica/`, hors routing Next et hors `public/`. L'archive est exclue de TypeScript et ESLint. La redirection permanente `/camp-costa-rica/:path*` vers `/` vit dans `next.config.ts` ; le proxy ne contient plus de rewrite de domaine camp. `/paul` et `/maxime` restent redirigées vers `/`.

## Vérification

Pour chaque lot : `npm run lint`, `npx tsc --noEmit`, `npm run qa:brand:rev01`. La gate de marque parcourt les deux arbres actifs `src/system` et `src/app/(rev01)` et interdit les hex hors tokens, y compris dans CalInline. L'hôte exécute `npm run build` et `npm run qa:network:rev01` avec le serveur sur le port 3210 ; ne pas lancer de serveur dans ce sandbox. Tous les tests e2e doivent utiliser le deny-all réseau partagé. La spec `tests/rev01-system.spec.ts` verrouille désormais la 404 et conserve l'autotest de blocage réseau.

Aucun appel runtime à `*.vercel.app`. Aucun changement de schéma sans migration. Aucun secret committé. Le lot 3 interdit toute commande git ; Paul reste responsable du merge.

## GEO/SEO, lot A

Métadonnées home localisées ; articles EN avec canonical auto-référent et alternates en/x-default, BlogPosting et OG enrichis. RSS découvrable depuis le layout et le Journal. Les engagements du Standard et les phases sont des h3 à rendu constant ; ItemList localisé sur Standard. /llms-full.txt expose les articles indexables en texte brut, cache partagé 1 h. Sitemap daté par route ; Vary Accept-Language/Cookie dans le proxy. Le routage /fr est maintenant pris en charge par le lot B.


## GEO/SEO, lot B

`tests/conformity-i18n.spec.ts` rejoint `qa:network:rev01` : contenu par URL, négociation 302, migration 301, cookie/header, métadonnées réciproques, sitemap et articles uniquement EN. Deny-all partagé, service workers bloqués et embed Cal simulé. Lint, TypeScript et gate de marque validés ; 96 cas proxy vérifiés hors réseau. Les 19 tests navigateur sont listés, à exécuter chez l'hôte avec le build. Aucun CSS ni article MDX modifié. Rapport `.codex-report-geo-b.md`.

## Intégrité des métadonnées, 09/09/2026

Les images des articles utilisent la route explicite `/journal/[slug]/og`, commune à Open Graph, Twitter et BlogPosting. La convention `journal/[slug]/opengraph-image.tsx` est supprimée ; rendu, polices et tokens conservés. Le tracing des assets cible la nouvelle route. Le titre du Journal français devient `Le Journal` ; Organization porte `Parrit.ai` et l'alias `PARRIT.AI`.

`tests/metadata-integrity.spec.ts` rejoint `qa:network:rev01` : HTTP pur, destinations limitées au serveur local, redirections interdites, titres uniques sur le sitemap et images OG/JSON-LD en 200. Les descriptions sont relevées sans seuil éditorial. Build, vérifications HTTP et preuve par mutation restent à exécuter par Claude hors de ce sandbox.

## Géométrie et aération, 09/09/2026

Le lot géométrique conserve textes, tailles et couleurs. `rev01.css` regroupe l'écart de 24 px pour `.standard-action` et `.r2-close` (deux structures existantes), espace la note de clôture en em, équilibre les titres, applique pretty aux paragraphes, aligne les statuts des dossiers et élargit les intitulés du Standard. Le sélecteur de langue espace aussi ses boutons pour garder le texte voisin à distance du fond actif.

`tests/aeration.spec.ts` rejoint `qa:network:rev01` : huit routes EN/FR à 1440/390, fragments de texte mesurés par Range, minimum 12 px aux actions remplies et aucun chevauchement de textes distincts non imbriqués. Deny-all partagé, service workers bloqués ; aucune de ces routes ne monte Cal. Support progressif de text-wrap : les anciens navigateurs de la cible Next peuvent ignorer balance/pretty et conserver le retour à la ligne natif. Documentation locale Next et données caniuse consultées hors réseau.

TypeScript, ESLint ciblé et gate de marque validés. Build, rendu navigateur, captures et preuve de mutation sur l'ancien build restent à exécuter par Claude, hors sandbox. Aucun port, réseau ou commit dans ce lot.

## Accent bleu, 13/09/2026

Le rouge sort de l'identité active. `src/system/tokens.css` porte le système d'accent bleu : jetons clairs pour papier, jetons sombres pour ink/carbon, et contexte `--action-*` redéfini par surface. Aucun jeton clair ne doit être peint sur fond sombre, ni l'inverse.

## Polices et gris lisible, 14/09/2026

IBM Plex Mono remplace le mono technique pour les kickers, labels, boutons, chiffres, wordmark, mark `[P.]` et images de partage. la police éditoriale historique (retirée le 04/10) remplace la fonte éditoriale de `--ed`; le fichier retenu est la variante variable `source-serif-4-latin-opsz-normal.woff2`, qui expose `wght` et `opsz`. `--g4` vaut le gris clair lisible `#606366` sur papier et `--g4-d` vaut `#8C8F92` sur carbone ; les surfaces sombres redéfinissent `--g4` vers `--g4-d`.

## Retrait capture Journal, 14/09/2026

Règle Paul : un bouton qui ne déclenche rien de réel est supprimé. La capture d'abonnement au Journal a été retirée de la home et de `/journal` parce qu'aucun envoi du Journal n'existe ; `QuickCapture` et `/api/interet` restent en place pour le prototype.

## Échelle fermée et plancher 14 px, 09/09/2026

Les neuf tailles canoniques vivent dans `tokens.css` (`--t-*`, `--d-*`). Les 102 déclarations de `rev01.css` sont normalisées (dont une reste `inherit`), ainsi que les 19 tailles de `system.css` ; le corps hérite désormais de `--t-m`. Les valeurs absentes du tableau de la spec sont rattachées sans nouveau pas : 26 px à `--t-xl`, 34 px fixe et clamps plafonnés à 30/38 px à `--d-s`, plafonds 76 px à `--d-xl`, 15 px et code `.9em` à `--t-s`, 9.5/12.5 px à `--t-k`.

Les usages CSS de rouge des deux arbres actifs passent par `--accent`/`--accent-p`, alias des valeurs brutes conservées. CalInline et la couleur conditionnelle des esquisses suivent ces alias. Aucun texte affiché ni valeur de couleur modifié.

Tracking réduit pour `.wordmark`, `.cmd-nav a`, `.clock` entre 761 et 1000 px, `.doctrine-code .k` et `.r2-std-row .ps` (media query comprise). Les numéros mobiles `.r2-phase .no` gardent 14 px avec un padding horizontal de 12 px. Les tests d'aération existants ajoutent le plancher strict et les neuf valeurs attendues indépendantes des tokens, tolérance 0.5 px sur les pas fluides ; champs et placeholders inclus.

TypeScript, lint complet et gate de marque passent hors réseau. Le H1 home vaut statiquement 84 px à 1440 ; son override mobile passe de 46.8 à 38 px à 390, et de 68 à 49.152 px à 768. Aucun build, navigateur, port ou commit exécuté. Claude doit encore passer la batterie et regarder les trois largeurs, surtout la command bar tablette, les en-têtes de Manufacture, les sceaux du Standard et des dossiers, les libellés Cal et le hero mobile. Les routes Journal et les esquisses restent hors des huit routes du test d'aération prescrit.

## Tests pré-hydratation, 14/09/2026

`tests/aeration.spec.ts` et `tests/conformity-i18n.spec.ts` rejouent désormais les gestes client fragiles avec `expect(...).toPass` et des bornes courtes : le champ email invalide doit garder sa valeur avant submit puis exposer `.ri-error[role='alert']`, et chaque switch de langue ne retente qu'une seule cible (`EN` puis `FR`) tout en conservant URL, query/hash, cookie et `lang`. Aucun attribut produit ni retry Playwright global ajouté ; si une saisie réelle est perdue avant hydratation sur connexion lente, ce sera un lot `src/` séparé.

## Offres home, 20/09/2026

La spec validée `docs/CODEX-SPEC-2026-09-20-offer-cards-home.md` prime sur l’ancienne interdiction de prix public de TRUTH.md pour Build With You : 3 200 € HT forfait, 10 heures. Deux OfferCard entre build et Journal ; champs absents masqués, prix et priceNote mutuellement exclusifs. La page `/build-with-you` et `/fr/build-with-you` utilise les composants et styles r2 existants ; registre locale, matcher proxy et sitemap incluent cette route. Aucun changement commission/dossiers/founder bridge. Écart commercial conservé selon mandat : audit offert 30 min pour Build With You, destination commission annonçant 15 min.

Tests : `node --test tests/offer-card.test.mjs` (rendu serveur réel) et `tests/offer-cards.spec.ts` intégré à qa:network:rev01 (FR/EN, 375/767/768/1440, liens, métadonnées, débordements, captures 375/1440). Validation navigateur et captures à terminer hors sandbox, Chromium refusé par macOS.

## En-tête, hero et schéma, 20/09/2026

La spec `docs/CODEX-SPEC-2026-09-20-header-hero-systems-visual.md` remplace l'horloge par le CTA localisé commission (barre desktop, panneau mobile). `AgentEsquisse` vit dans le hero, entre le sous-titre et `QuickCapture` ; sa clôture indique désormais « ci-dessous » / « below ». `MechanismSchema` reprend trois étapes bilingues ancrées sur des faits vérifiés (onze outils, audit du 11/09, fermeture du 14/09) après un premier test de distinctivité qui avait jugé une version plus générique publiable pour n'importe quelle agence. Le test de succession des sections attend maintenant le hero avant les marques.

Validation complétée hors sandbox Codex (build, `qa:brand:rev01`, `qa:network:rev01` 74/74, captures desktop/mobile avant/après) : deux régressions réelles trouvées et corrigées avant merge — cascade CSS `.rev-button` écrasant le padding `.cmd-cta` (fixée par `.cmdbar .cmd-cta`), et le test de contraste du focus sur bouton sombre qui ciblait par erreur un bouton `disabled` d'AgentEsquisse après la réorganisation du hero (le sélecteur exclut désormais les contrôles désactivés et couvre aussi `.cmdbar .rev-button.exec`).

Lint, TypeScript et contrôle de marque passent. Les trois grep prescrits sont vides. Validation visuelle non obtenue : Chromium et le port local sont refusés dans le sandbox. Voir le rapport dédié pour les limites de validation et de distinctivité.

## Recomposition de l'en-tête et schéma relationnel, 20/09/2026

La spec `docs/CODEX-SPEC-2026-09-20-header-recompose-systems-diagram.md` remplace la composition précédente : `.cmdbar` reste fixe, hauteur 64 px, contenu dans `.cmdbar-inner` sur la grille 1160 px. Navigation Journal et Systems/Systèmes, commission uniquement via le CTA. Les décalages liés à l'en-tête suivent 64 px ; les quatre espacements indépendants de 52 px restent identiques. `MechanismSchema` reprend exactement le copy et les quatre blocs de la spec : deux sources, contrôle, décision, avec deux flèches. Tests de hauteur, cardinalité, CTA localisé et sélecteurs mis à jour ; accès Systems depuis les deux accueils ajouté.

Lint, TypeScript et gate de marque passent. Les quatre grep sont vides.

Validation complétée hors sandbox (build, `qa:brand:rev01`, `qa:network:rev01` 76/76,
captures desktop/mobile FR/EN avant/après) : une correction appliquée avant merge. La bordure
d'accent du schéma était posée sur le nœud « Deux contrôles », en contradiction avec la loi de
l'accent (« décision requise ») ; déplacée sur « Décision humaine, datée ». Jugement visuel
fait sur les captures : l'en-tête aligné sur la grille 1160px et la nav à 2 liens + 1 CTA se
distinguent clairement de l'ancienne barre plein-bord ; le schéma montre une vraie relation
2 sources → 1 contrôle → 1 décision, pas trois cartes parallèles.

## En-tête dans le flux et preuve Systems, 20/09/2026

La spec `docs/CODEX-SPEC-2026-09-20-header-static-systems-hero-proof.md`, sections 1 à 4, remplace le canon fixe précédent : command bar de 64 px dans le flux, sans compensation body. Opening et panneau mobile restent fixes. Le hero Systems réutilise la première SystemCard et la date observée ; le catalogue conserve ses quatre cartes. MechanismSchema reprend les formulations FR/EN prescrites et la bordure décision devient neutre (`--rule-d`), avec le fond `--carbon` conservé. Seul le test de positionnement est adapté au nouveau contrat.

Validation complétée hors sandbox (build, `qa:brand:rev01`, `qa:network:rev01` 76/76, captures
desktop/mobile FR/EN avant/après, dont une capture après défilement confirmant que la barre
quitte bien l'écran sur l'accueil et sur `/systems`). Jugement visuel fait sur les captures :
la carte de preuve du hero Systems est lisible sans défiler sur desktop, atteignable par un
court défilement sur mobile ; le nœud décision du schéma est visuellement identique au nœud
contrôle (bordure neutre), seule sa profondeur (`--carbon`) le distingue des deux nœuds sources.

## Continuité du funnel et justesse des engagements, 21/09/2026

La spec `docs/CODEX-SPEC-2026-09-21-funnel-continuity.md` (première des deux specs de reprise
demandées après l'audit funnel/copywriting du 20-21/09) referme plusieurs écarts trouvés en
audit. `AgentEsquisse` et `QuickCapture` sont fusionnés dans un seul parcours : le besoin tapé
est transmis (`initialIdee`), le classement suit enfin le scénario détecté au lieu d'être
toujours `full-os` (`interet={INTERET_FOR_SCENARIO[...]}`), le focus va au champ e-mail sans
saut d'ancre (`autoFocusEmail`), et l'ancienne ancre `#prototype` a disparu. `/sketch/[id]` lit
désormais la langue déclarée (`lireEsquisse` renvoie `lang`) et rend les 4 gabarits et tout le
chrome dans cette langue — plus de texte anglais fixe sur une esquisse française. `getLang()`
retombe sur `"en"` par défaut (un chemin sans préfixe est anglais sur ce site, jamais français).
Le contrôle du schéma (`MechanismSchema`) redevient scopé à l'ajout d'un point d'écriture, pas
à toute écriture. Deux résultats clients de `/dossiers` sans appui dans `preuves.ts` (le
registre canon, qui déclare lui-même 0 métrique client publiable) sont redevenus des
descriptions de mécanisme, sans chiffre inventé. PS-04 du Standard distingue désormais
annulation avant envoi, retour à l'état interne, et correction après envoi — sans jamais
promettre l'effacement d'un message déjà reçu. L'écart documenté le 20/09 (« audit offert 30 min
pour Build With You, destination commission annonçant 15 min ») est refermé : l'étape 1 devient
un examen de 15 min, identique au lien réellement réservé ; la restitution de 30 min n'est pas
touchée. Le hero de `/systems` n'affiche plus la fiche catalogue complète (4 blocs, ~937 px
mesurés en audit) mais un fragment compact (nom, preuve, limite, ~400 px).

Deux défauts de test trouvés et corrigés avant merge (Codex n'a pas pu les exécuter, son
sandbox refuse Chromium) : deux entrées de la liste figée de contraste `NEUTRAL_CONTROL_DEBT`
(`input#quick-idee`/`input#quick-email` sur l'accueil) n'avaient jamais été mesurées pour de
vrai avant cette fusion — le panneau était toujours resté replié pendant l'audit — et affichaient
une valeur jamais vérifiée (1.329) ; la première mesure réelle donne 1.234, identique à
`input#agent-operation` qui partage exactement la même règle CSS. Et un `.click()` de test juste
avant une vérification de contour de focus faisait passer Chromium en modalité pointeur, masquant
le contour d'accent réel d'un lien du header pour un vrai utilisateur au clavier ; un `Tab` de
test restaure la modalité clavier avant la mesure. Aucune assertion n'a été assouplie au-delà de
ce qui a réellement changé.

Validation complétée hors sandbox (build, `qa:brand:rev01`, `qa:network:rev01` 76/76 — deux fois
de suite après correctifs —, captures desktop/mobile FR/EN avant/après). Une seconde spec,
`docs/CODEX-SPEC-2026-09-21-copywriting-parcours.md`, reprend le copywriting de l'accueil sous
le premier écran et de `/build-with-you` une fois celle-ci mergée.

## Reprise du copywriting : preuve sur l'accueil et Build With You, 21/09/2026

La spec `docs/CODEX-SPEC-2026-09-21-copywriting-parcours.md` (seconde des deux specs de reprise,
suite de la première ci-dessus) referme l'écart F09 : la promesse de « Ce que nous construisons »
n'avait aucune preuve visible depuis l'accueil avant l'offre. Une nouvelle section « La preuve »
est insérée entre `home-s-build` et `home-s-offers`, reprenant mot pour mot les `<h1>` déjà en
production de `/systems` et `/dossiers` (vérifiés caractère pour caractère) comme titres de deux
cartes-liens — aucun texte nouveau n'est inventé, seule la navigation est ajoutée. `/build-with-you`
est réécrite pour répondre à F11 : trois nouvelles sections (« What comes out of these 10 hours »,
« What you bring », « What happens next ») s'appuient sur des engagements déjà écrits ailleurs
(PS-05, PS-06 du Standard ; « pas de chef de projet » de la section « La maison ») plutôt que
d'inventer une garantie propre à cette offre. Prix et étapes 01-03 (durées déjà corrigées en PR A)
inchangés.

Un défaut de test trouvé et corrigé avant merge : les deux nouvelles cartes de la section preuve
partagent la même classe CSS, ce qui les faisait mesurer comme une seule entrée dans la liste
figée de contraste (`NEUTRAL_CONTROL_DEBT`) puis se signaler mutuellement comme « doublon » —
la vérification exige qu'un sélecteur répété corresponde à un seul élément par page. Deux classes
de modificateur (`--systems`/`--dossiers`) distinguent désormais les deux cartes ; leur contraste
réel (1.270:1, fond `--paper2` sur grille `--rule-l`, même motif de séparation 1px que
`home-s-offers-grid` et le catalogue `/systems`) est documenté dans la liste figée, pas contourné.

Validation complétée hors sandbox (build, lint, `qa:claims:rev01`, `qa:brand:rev01`,
`qa:network:rev01` 76/76, captures desktop/mobile FR/EN avant/après). `qa:claims:rev01` a
d'abord bloqué la PR A pour une fausse alerte sans lien avec cette spec (voir historique PR
#277) — la reprise ici en tient compte : aucun tableau de durées n'est reformé sur une seule
ligne source dans cette PR.

## Accueil et ouverture Systems, 21/09/2026

La spec `docs/CODEX-SPEC-2026-09-21-home-systems-rewrite.md` est appliquée à
l'identique : scènes concrètes dans le sous-titre du hero FR/EN, portée de la
méthode limitée à l'opération choisie, faits visibles dans les deux cartes de
preuve. Une bande après la clôture attribue la certification Qualiopi à Formia ;
elle utilise l'asset fourni `public/brand/qualiopi-formia.png`, sans le modifier.
L'ouverture Systems utilise un titre de largeur 32ch, une preuve compacte dédiée
et les actions après la preuve. Les autres heroes et le catalogue restent inchangés.
Les mesures navigateur avant/après et la vérification de l'asset en production
sont prévues par la spec côté Claude après merge.

## Parcours accueil, 22/09/2026

La spec `docs/CODEX-SPEC-2026-09-22-home-journey.md` est appliquée à
l'identique : `journey` remplace `maison` dans les dictionnaires FR/EN, avec
quatre étapes en liste ordonnée ; les classes de mise en page sont conservées.
Comprendre/Décider/Agir suit désormais l'exemple de la facture impayée.
L'assertion du titre est actualisée sans assouplissement. Blocs de remplacement
vérifiés caractère par caractère ; gates marque et claims vertes avant/après.
Lint, build et tests navigateur non validés ici : dépendances absentes,
installation hors réseau impossible (ENOTCACHED). Captures et batterie complète
restent à réaliser par Claude selon la spec.

## Identité d'entité, 26/09/2026

`src/system/auteur.ts` centralise l'identifiant personnel et ORG_ID ; `personRef()`
et `orgRef()` alimentent les constructeurs purs de `src/system/jsonld.ts`, utilisés
par le layout et les articles. Organization.sameAs reste vide ; le site personnel
est relié uniquement via founder. BlogPosting porte son URL canonique + #article.
Aucun changement de copy, de frontmatter ni de dateModified.

`npm run test:entity` contrôle les graphes et l'orthographe dans src/content/public/docs.
Seule la spec contenant volontairement les contre-exemples est exclue explicitement.
Le publisher exécute cette gate d'orthographe après la copie éventuelle, avant
prooflint/build/publication. Un test d'intégration isolé verrouille cet arrêt.
Résultats : entité 7/7, Journal 9/9, TypeScript, lint, marque et claims verts.
Les JSON-LD avant/après et limites d'environnement sont dans
`docs/REPORT-2026-09-26-entity-identity-v0.md`. Aucun déploiement effectué.

## Migration Brand OS, 04/10/2026

La spec `docs/CODEX-SPEC-2026-10-04-parrit-ai-brand-os-v1.md` est appliquée au checkout
`3593c229` (identique à origin/main local), avec reprise sans commit du contenu de `ec09bc3`.
Paquet de raccordement copié octet pour octet ; son origin déclare `112de90e`, export du 04/10.
Portrait rejeté et fonte éditoriale retirés. Connecteurs CSS vectoriels, CTA sans flèches.
Titres FR/EN changés uniquement dans le périmètre prescrit ; hero, offres, articles et juridique préservés.
OpenGraph explicite sur les pages localisées, Twitter large hérité, images propres aux articles conservées.
404 bilingue, chrome partagé, noindex. La CI ajoute `test:brand-os` après build ; contrôles de
contraste, métadonnées, connecteurs et débordement 375px dans la batterie deny-all.
Le registre immuable des assets interdits est l'unique exception à son propre scan textuel.
Aucun commit, push, merge ni déploiement pendant ce lot. Les preuves d'exécution et limites
sont dans `docs/REPORT-2026-10-04-brand-os-v1.md`.

## Brand OS FIX2, 04/10/2026

Les placeholders des captures et de l'agent esquisse utilisent `--g4-d`, alias du
jeton clair canonique, avec opacité 1. Les boutons désactivés gardent une bordure
et un texte contextuels lisibles, un fond transparent et le curseur `not-allowed`,
y compris au survol ; l'action active conserve son accent. Les labels sombres
utilisent `--g4-d` ; le chargement Cal ne fait plus varier l'opacité du texte.
`tests/brand-os.spec.ts` contrôle aussi le texte et la bordure désactivés et ajoute
quatre parcours FR/EN à 375/1440 px (vide, survol, saisie, espaces seuls), sans envoi.
L'attendu du lien fondateur suit le contrat sans flèche. Les deux formulations
« La matrice qui associe chaque tâche à un modèle » sont restaurées au registre.
Voir `docs/REPORT-2026-10-04-brand-os-fix2.md` pour la validation et ses limites.

## Brand OS FIX3, 04/10/2026

Les deux labels directs de `home-s-maison-copy` sont des blocs séparés par `--s3`
(24 px). La 404 utilise une colonne d'actions dédiée, alignée à gauche, avec un
seul bouton plein et deux secondaires ; son titre utilise toute la colonne.
Les tests Brand OS couvrent la séparation FR/EN à 375/768/1440 px et la visibilité
des trois actions avant le footer dans la fenêtre 1440 × 900.
Résultats et limites d'exécution : `docs/REPORT-2026-10-04-brand-os-fix3.md`.

## Corrections de confidentialité et formulations, 05/10/2026

Le lot `docs/CODEX-SPEC-2026-10-05-parrit-ai-corrections-v1.md` désactive l’injection
PostHog navigateur ; sa constante reste dormante dans le layout. Attribution en
mémoire du document uniquement, conservée en navigation client et perdue au
rechargement ; aucun accès au stockage navigateur. QuickCapture transmet aussi
cette attribution d’arrivée. AgentEsquisse et les gabarits sketch restent sans LLM.
Aucun envoi serveur PostHog ni appel n8n/Sheets trouvé dans les parcours du site.
Confidentialité FR/EN alignée, mentions chiffrées visées retirées des pages,
des deux articles et du générateur llms ; bloc de certification tierce retiré de
l’accueil (asset conservé). Les indications historiques contraires sont obsolètes.
`npm run test:privacy` couvre les régressions ; le deny-all e2e ne tolère plus
PostHog. Voir le rapport du lot pour les preuves et contrôles hors sandbox restants.

## Doctrine visible, 04/10/2026 — validation partielle

Le lot `docs/CODEX-SPEC-2026-10-04-parrit-ai-doctrine-visible-v1.md` unifie les
boutons en General Sans 600 et le libellé de réservation FR/EN. Déroulement
centré sans légende orpheline, offres en contour, preuves au cran des cartes,
Journal anglais annoncé en FR, CTA dans le hero Build With You, ombre Cal retirée.
Le contenu du hero accueil, les prix, routes, intégrations et assets canon sont préservés.
`test:doctrine` vérifie les esquisses privées avec des données synthétiques ;
`tests/doctrine-visible.spec.ts` rejoint la batterie réseau avec 42 cas et les captures.
FIX1 applique W-66 : header en contour tant que le hero accueil est visible, plein
après sa sortie via IntersectionObserver ; sans JS, contour ; ailleurs, plein.
Le test strict d’accent est conservé ; transitions, navigation et absence de JS couvertes.
L’assertion de légende compilée suit désormais la présence d’une photo dans la section.
Build interdit ici ; Chromium refuse de démarrer dans le sandbox. Voir
`docs/REPORT-2026-10-04-doctrine-visible.md` avant de considérer le lot validé.

FIX2 (04/10) : alias `--text-note` retiré ; notes et verdict au cran existant
`--t-k` (14 px), liens de preuve en General Sans au corps (18 px), casse normale.
Le déroulement occupe la largeur commune des sections ; paragraphes conservés à 56ch.
Les 36 captures PNG suivies de brand-os-p1/after sont sauvegardées hors dépôt puis
retirées ; les PNG de `.codex-handoffs` sont désormais ignorés. Tests de composition
complétés. Lint, types, claims, brand et tests Node passent ; Chromium reste bloqué,
le build et la preuve visuelle doivent être exécutés par l’hôte (voir rapport FIX2).

## Photo et catégorie, 04/10/2026 — AV-3 / DV-01 a / DV-02 a

La spec `docs/CODEX-SPEC-2026-10-04-parrit-ai-photo-dv01-dv02-v1.md` autorise
DSC00629 : quatre exports AVIF/WebP 340/680 copiés sans transformation dans
`public/brand/founder/`, avec légende et alt FR/EN. La home présente désormais
« Données et IA » / « Data and AI » et la promesse de systèmes qui fonctionnent ;
métadonnées, OG, Opening, JSON-LD et introduction llms suivent cette catégorie.
DV-03 et les articles du Journal restent inchangés. Le H1 garde le cadre sans
coupure et utilise le palier existant `--d-s` à 480 px et moins.
Build Webpack, lint, types, claims, marque et 13 tests Brand OS passent. Le rendu
navigateur et les captures 375/768/1440 restent à vérifier par l’hôte : Chromium
est refusé dans le sandbox macOS. Détails dans `docs/REPORT-2026-10-04-photo-dv01-dv02.md`.

FIX1 : le test de composition doctrine mesure désormais l'ensemble photo + texte
au-dessus de 859 px quand une image est rendue. La branche sans photo/mobile et
les seuils existants sont conservés. Build Webpack, lint, claims, marque et les
39 tests Node passent à la reprise ; Chromium reste bloqué avant navigation.


FIX2 photo (04/10) : conformément à la section FIX2 de la spec photo,
le test doctrine du h2 à 1440 px autorise quatre lignes avec photo et conserve
les trois lignes sans photo (tolérance 0.01 inchangée). Aucun autre changement
fonctionnel. Build Webpack, lint, types, claims, marque et 39 tests Node passent.
La batterie navigateur reste bloquée au lancement de Chromium par macOS ;
voir la section Reprise FIX2 du rapport photo pour les résultats de cette passe.

FIX3 photo (04/10) : le cadre du H1 accueil reçoit un padding horizontal de
0.9em avec marges compensatrices de -0.9em pour préserver la coupure du texte.
Les tests Brand OS vérifient les quatre coins face aux rectangles Range du texte,
un écart horizontal de 12 px minimum et des coins dans le viewport, FR/EN à
375/390/768/1440 px. Build Webpack, lint, types, claims, marque et 39 tests Node
passent ; Chromium reste refusé par le sandbox avant navigation. La géométrie
réelle reste à valider sur l’hôte ; voir la reprise FIX3 du rapport photo.

FIX4 photo (04/10) : sous 400 px uniquement, le H1 utilise le palier existant
`--t-xl` (26 px), avec retrait du cadre de 1.04em pour conserver la séparation
de 12 px. Les huit parcours FR/EN à 375/390/768/1440 contrôlent également les
coins dans la gouttière réelle de `.home-s-wrap`. Build Webpack et contrôles
statiques/Node passent ; géométrie navigateur non validée (Chromium refusé par
macOS avant navigation). Voir la reprise FIX4 du rapport photo.

FIX5 photo (04/10) : la dernière décision de la spec remplace le contrôle de
gouttière FIX4 par une marge écran minimale de 16 px pour chaque coin du H1.
Les huit parcours FR/EN conservent non-intersection et séparation texte ≥12 px.
CSS inchangé. Build Webpack, lint, types et 39 tests Node passent ; validation
navigateur toujours bloquée au lancement de Chromium (voir rapport FIX5).
