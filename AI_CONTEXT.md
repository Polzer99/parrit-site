# AI Context

## Architecture actuelle

Site public Parrit.ai : Next.js 16.2.2 (App Router), React 19, TypeScript strict, Tailwind v4. Déploiement Vercel depuis `main`, Node.js 24.x (`.nvmrc`). Lire `AGENTS.md`, puis `TRUTH.md` avant tout changement de contenu ou de conversion. La spec validée `docs/CODEX-SPEC-2026-09-06-site-integral.md` décrit les lots du 06/09/2026.

L'application publique canonique vit dans `src/app/(rev01)/` : `/`, `/manufacture`, `/standard`, `/dossiers`, `/commission`, `/journal`, `/journal/[slug]`, `/journal/rss.xml`, `/legal` et `/sketch/[id]`. Le layout du groupe charge les polices, tokens, styles et la command bar. La home simplifiée porte `QuickCapture` hero et `AgentEsquisse`, puis les métriques et les sections éditoriales. `Opening` reste dans le code mais n’est plus rendu (décision Paul 06/09/2026). Les cinq pages intérieures ont leur copy FR/EN dédié.

Le copy vit dans des dictionnaires `DICT` par page et dans les composants localisés. Depuis le lot GEO/SEO B, les URLs nues rendent toujours l'anglais ; `/fr` et `/fr/{manufacture,standard,dossiers,commission,journal,legal}` rendent le français par rewrite du proxy, sans duplication. Le proxy transmet le chemin public et la locale ; `getLocale()` donne priorité au chemin. La négociation Accept-Language redirige en 302 uniquement les URLs traduites nues, hors bots et hors cookie de choix. Le header pose le cookie puis navigue entre URLs localisées ; `?lang=fr|en` migre en 301 en conservant les autres paramètres. Les articles du Journal et son RSS restent sans variante `/fr`. Canonicals, hreflang réciproques et OG suivent le chemin ; x-default reste anglais. Le sitemap inclut les sept paires (six routes institutionnelles et l'index Journal traduit).

## Canon visuel

Le prototype REV 03 `docs/site-prod-rev01/parrit-command-center-rev03.html` fait autorité ; `src/system/tokens.css` porte les valeurs et `src/system/` les composants. General Sans pour le corps/UI, IBM Plex Mono pour le registre technique, Source Serif 4 pour les grands titres éditoriaux. General Sans est auto-hébergée dans `public/fonts/rev02/` ; IBM Plex Mono et Source Serif 4 dans `public/fonts/rev03/` ; polices OG dans `src/og-assets/`.

`BRAND.md`, `docs/design-system/` et `design-source/` sont historiques. Ne pas restaurer la palette crème, les anciens logos, Geist ni les anciens choix typographiques. Les images OG lisent les couleurs via `token()` ; `next.config.ts` inclut le CSS et les polices dans leurs bundles. CalInline résout les variables CSS du parent avant de les transmettre à l'iframe externe.

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

IBM Plex Mono remplace le mono technique pour les kickers, labels, boutons, chiffres, wordmark, mark `[P.]` et images de partage. Source Serif 4 remplace la fonte éditoriale de `--ed`; le fichier retenu est la variante variable `source-serif-4-latin-opsz-normal.woff2`, qui expose `wght` et `opsz`. `--g4` vaut le gris clair lisible `#606366` sur papier et `--g4-d` vaut `#8C8F92` sur carbone ; les surfaces sombres redéfinissent `--g4` vers `--g4-d`.

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
