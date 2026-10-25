# Lot A — compte rendu d'implémentation

Date : 25/10/2026. Spec : `2026-10-25-lot-a-harmonisation-design.md`.

**État courant : voir « Révision 3 » en fin de document.** Les sections
précédentes sont conservées comme historique de la première livraison. A2 bis
remplace désormais l'annulation d'A2 et la révision 2 autorise la correction du
présupposé de l'audit d'aération.

## Périmètre livré

Instructions du dépôt et AI_CONTEXT lus avant modification ; documentation CSS
et Playwright de la version Next installée consultée. Plan suivi : vérifier les
contrats existants, traiter A1 à A6, ajouter la couverture navigateur, relire le
diff puis exécuter la batterie. Lors de la reprise de vérification, les cinq
fichiers suivis modifiés, la spec, ce rapport et le nouveau test étaient déjà
présents. L'implémentation et les tests ont été conservés ; ce rapport est
complété avec les résultats de la reprise ci-dessous.

| Point | Fichier et ligne | Résultat |
| --- | --- | --- |
| A1 | `src/app/(rev01)/rev01.css:1773` | H1 home en General Sans 500 ; taille, cadre et alignement conservés. |
| A2 | Aucun changement livré | Annulé pour incompatibilité avec un test existant, détail ci-dessous. |
| A3 | `src/app/(rev01)/rev01.css:2565` | `.r2-phase .no` utilise `--g3`, gris clair contextuel sur fond encre. |
| A3, fond clair | `src/app/(rev01)/rev01.css:856`, `:1997`, `:2466` | Numéros du Standard, étapes de l'accueil et ancien tableau Standard en `--accent-text` (canard). Plex Mono conservé. |
| A4 | `src/system/system.css:116`, `:128` | Suppression des deux `box-shadow` Instrument ; filets conservés. Recherche dans `src/` : aucun `box-shadow` ni `boxShadow` restant. |
| A5 | `src/app/(rev01)/rev01.css:166`, `:1320`, `:3263`, `:3375` | FR/EN en Plex Mono, taille et tracking de navigation, filet séparateur, fond transparent, aucun cadre. Langue active claire et soulignée, inactive secondaire. Hauteur 48 px, largeur minimale 44 px. Suppression des anciennes règles contradictoires. |
| A5, accessibilité | `src/system/components/RevHeader.tsx:144` | Ajout de `aria-current="true"` uniquement à la langue active ; `aria-pressed` et logique de bascule conservés. |
| A6 | `src/app/(rev01)/rev01.css:395` | Padding de base remplacé par `var(--button-padding)`. La règle commune située plus bas appliquait déjà ce token : rendu prévu identique. |
| Tests | `tests/design-harmonisation.spec.ts:1`, `package.json:17` | Nouveau fichier de 12 cas, intégré à `qa:network:rev01`. |
| Continuité | `AI_CONTEXT.md:571` | État livré, exception A2 et limites de validation consignés. |

Aucun texte visible FR/EN, alt, aria-label, metadata, URL ou contenu du Journal
n'a changé. Aucun fichier `brand-os.*`, API, police, dépendance ou test existant
n'a été modifié. Les marqueurs ProductScene, le point du logo, le CTA du header
et le cadre du bouton Menu sont conservés. Aucun commit, push, déploiement ou
capture ajouté au dépôt.

## Point annulé : A2

`tests/aeration.spec.ts:219` à `:226` impose les valeurs indépendantes suivantes :

- Fixes : 16, 18, 22, 26 px.
- Desktop : 40, 54, 84 px, tolérance 0,5 px.
- Mobile : 32, 34, 40 px, même tolérance.

Le clamp demandé vaut 48 px à 1440 px. La réévaluation sous Node des tableaux et
du prédicat extraits du test existant donne :

```text
1440 px : candidat 48 px, accepté par aeration = false
390 px  : candidat 32 px, accepté par aeration = true
```

C'est une incompatibilité de contrat établie par lecture et exécution du
prédicat, pas une mesure navigateur. Chromium étant bloqué, le test E2E complet
ne peut pas atteindre cette assertion ici. Pour respecter l'interdiction de
modifier les tests et la consigne d'annuler un point incompatible, A2 n'est pas
retenu : aucun nouveau token inutilisé, aucune modification des tailles H2,
du Journal ou de la note de clôture. Les cinq autres points sont conservés.

## Tests ajoutés

`tests/design-harmonisation.spec.ts` utilise le même harnais deny-all que
`doctrine-visible.spec.ts`, bloque les service workers et n'effectue aucun appel
à un service externe. Les dimensions sont 1440×900 et 390×844.

- 4 cas : `/fr/build-with-you` et `/fr/manufacture`, exactement trois numéros,
  absence de couleur rose calculée, gris canonique et Plex Mono.
- 4 cas : étapes de `/fr` et critères de `/fr/standard`, canard et Plex Mono.
- 4 cas : accueil FR/EN, poids 500 du H1, état accessible et soulignement de la
  langue active, absence de cadres/fonds, taille tactile, typo/espacement alignés
  sur la navigation, séparateur, cadre Menu, marqueurs ProductScene roses,
  padding canonique, aucune ombre dans le main et absence de débordement global.

Les tests existants de bascule de langue, géométrie, aération et ProductScene
restent inchangés. Les nouveaux cas sont découverts et compilés ; leurs
assertions navigateur restent à exécuter chez l'hôte.

## Exécution

Les dépendances ont été installées avec `npm ci --offline --ignore-scripts`
depuis le cache local, sans modification du lockfile. Les tests qui utilisent le
serveur Next compilé ont été rejoués après le dernier build Webpack réussi.

| Commande | Résultat |
| --- | --- |
| `npm run lint` | Succès, code 0. |
| `npx tsc --noEmit` | Succès, code 0. |
| `npm test` | Succès, 102/102, aucun ignoré. |
| `npm run test:brand-os` | Succès, 24/24, aucun ignoré. |
| `npm run qa:claims:rev01` | Succès, code 0. |
| `npm run build` | Turbopack reste sur « Creating an optimized production build » sans progression ; interruption contrôlée, code 130. |
| `npm run build -- --webpack` | Succès, code 0, 58 pages générées. Aucun changement du script build. |
| `npm run qa:brand:rev01` | Succès, code 0, y compris après build final. |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | Bloqué : Chromium refuse le lancement avant navigation. 1 échec d'infrastructure, 323 cas non exécutés. |
| `npx playwright test tests/design-harmonisation.spec.ts --list` | Succès : 12 cas découverts. |
| `npx playwright test tests/design-harmonisation.spec.ts --browser=chromium --workers=1 --max-failures=1` | Même blocage Chromium ; 1 échec d'infrastructure, 11 cas non exécutés. |
| `git diff --check` | Succès. |

Le lancement Chromium de référence, avant modification, échouait déjà avec
`MachPortRendezvousServer: Permission denied (1100)`. La limite d'un échec évite
de reproduire le même blocage pour tous les cas ; elle ne désactive aucune
assertion. Aucun serveur local n'a été lancé, conformément à AI_CONTEXT.

Le build Webpack signale aussi l'avertissement existant `metadataBase` absent
sur certaines métadonnées. Les métadonnées restent hors périmètre ; les tests de
rendu serveur Brand OS passent. Le build Turbopack et la batterie navigateur
doivent être rejoués sur l'hôte autorisé, serveur local sur 3210 pour Playwright.
La vérification visuelle reste à Claude, comme demandé par la spec.

Les journaux bruts sont dans `/private/tmp/lot-a-*.log`, notamment
`lot-a-build-final.log`, `lot-a-test-final.log`, `lot-a-brand-os-final.log`,
`lot-a-network.log` et `lot-a-new-browser.log` ; ils ne sont pas versionnés.

## Reprise de vérification, 25/10/2026

Relecture d'AGENTS.md, d'AI_CONTEXT, de la spec, du diff et des guides CSS,
Playwright et CLI de Next.js 16.3.4 installé. Aucun changement supplémentaire
du code ou des tests n'a été nécessaire. Les modifications présentes à
l'arrivée restent intactes. A2 est confirmé incompatible par réévaluation
du prédicat d'aération : 48 px refusés à 1440 px, 32 px acceptés à 390 px.
La recherche `box-shadow|boxShadow` ne trouve aucune occurrence dans `src/`.

| Vérification relancée | Résultat |
| --- | --- |
| `npm run lint` | Succès. |
| `npx tsc --noEmit` | Succès. |
| `npm test` | Succès, 102/102 ; rejoué après le nouveau build Webpack. |
| `npm run test:brand-os` | Succès, 24/24 ; rejoué après le nouveau build Webpack. |
| `npm run qa:claims:rev01` | Succès. |
| `npm run build` | Sans progression après 90 secondes ; processus interrompu par SIGINT, wrapper sorti avec le code 124. |
| `npm run build -- --webpack` | Succès, 58/58 pages générées ; avertissement `metadataBase` existant. |
| `npm run qa:brand:rev01` | Succès, avant et après build. |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | Échec au lancement Chromium : `MachPortRendezvousServer: Permission denied (1100)` ; aucune navigation, 323 cas non exécutés. |
| `npx playwright test tests/design-harmonisation.spec.ts --list` | 12 cas découverts. |
| `git diff --check` | Succès. |

Les journaux de cette reprise sont dans `/private/tmp/lot-a-recheck-*.log`.
Le build Turbopack, les interactions et les mesures navigateur restent à
valider sur l'hôte ; aucun serveur local ni capture n'a été créé pendant
cette reprise. Aucun commit, push ou déploiement.

## Révision 2 — état livré

La révision 2 de la spec est le plan validé de cette reprise. AGENTS.md,
AI_CONTEXT.md, la spec complète et les guides CSS, Playwright et CLI de Next
16.3.4 installé ont été lus avant modification. Le travail A1/A3/A4/A5/A6
présent à l'arrivée est conservé. Aucune dépendance installée dans cette reprise.

| Fichier et ligne | Modification finale |
| --- | --- |
| `src/app/(rev01)/rev01.css:538`, `:1753` | A2 bis : titres de section `.rev-section-head h2` et `.home-s h2` en `var(--d-s)` : 40 px desktop, 32 px jusqu'à 760 px. Les H2 `.r2-ed` et légaux utilisaient déjà ce token. |
| `src/app/(rev01)/rev01.css:2054` | Suppression de l'exception à 26 px entre 1025 et 1200 px pour le titre de section ProductScene ; marqueurs et contenu inchangés. |
| `src/app/(rev01)/rev01.css:2132` | Taille de clôture explicitement conservée via `--d-l` : 54 px desktop, 34 px mobile. `.r2-close h2` reste inchangé. |
| `src/app/(rev01)/rev01.css:166`, `:395`, `:1773`, `:2563` | A1/A3/A5/A6 conservés : poids 500, numéros secondaires, sélecteur de langue texte et padding canonique. |
| `src/system/components/RevHeader.tsx:144` | A5 conservé : `aria-current` sur la langue active, aucune modification de la bascule. |
| `src/system/system.css:116`, `:128` | A4 conservé : deux ombres supprimées ; aucune occurrence `box-shadow` ou `boxShadow` dans `src/`. |
| `tests/aeration.spec.ts:240`, `:543` | Actions visibles pleines **ou au contour** incluses dans la mesure. Une simple bordure inférieure de lien ne constitue pas un contour de bouton. |
| `tests/design-harmonisation.spec.ts:56`, `:145` | Cinq cas supplémentaires pour A2 bis ; 17 cas au total. |
| `package.json:17` | Intégration de la nouvelle spec à `qa:network:rev01`, conservée. |
| `AI_CONTEXT.md:571` | État révision 2, exceptions et limites de validation actualisés. |

Le seul H2 de `/dossiers` est dans `.r2-close` (`dossiers/page.tsx:103`). Il
relève donc de l'exception explicitement maintenue par la révision 2 et reste
à 54/34 px. Il n'existe pas de H2 de section supplémentaire à réduire sur cette
page. Aucun changement de `--d-m`, `--d-l` ou des autres tokens ; aucun token
`--t-title` ajouté. Titres de cartes et d'entrées du Journal inchangés.

### Justification de la modification du test existant

Le présupposé « une action a nécessairement un fond plein » excluait le CTA au
contour et ne trouvait plus d'action sur certaines pages après l'allègement
de la langue active. Le filtre mesure désormais les liens/boutons visibles
avec fond peint ou quatre bordures peintes et une boîte non vide. Le calcul
des distances et le minimum de 12 px restent identiques. Le plancher de 16 px,
les valeurs de l'échelle fermée, les chevauchements et les contrôles de contraste
sont inchangés. C'est le seul test existant modifié, dans le périmètre autorisé
par la révision 2.

Les cinq nouveaux cas vérifient les H2 FR/EN à 1440×900 et 390×844 sur l'accueil,
Manufacture, Build With You, Systems et Legal, ainsi que les exceptions des
clôtures et du Journal. Un cas couvre les largeurs 760, 761 et 1100 px. La taille
du H1 est aussi verrouillée dans les quatre cas accueil existants du nouveau
fichier. Aucun screenshot ajouté ; harnais deny-all et service workers bloqués.

### Diagnostic du timeout mobile

Comparaison avec la référence locale `origin/main`, commit `c8dce63` :

- `AgentEsquisse.tsx`, `QuickCapture.tsx` et la page d'accueil sont identiques.
- `RevHeader.tsx` ne diffère que par `aria-current` ; aucune logique modifiée.
- Toute la fonction `measureInvalidFormStates`, y compris ses clics et délais,
  est identique octet pour octet. Le parcours initial de saisie est aussi intact.
- `AI_CONTEXT.md` sur cette référence signale déjà l'échec d'aération à 390 px
  dans la revue du 11 octobre, antérieure à ce lot.
- Le rapport navigateur préexistant
  `test-results/tests-aeration-at-390px-al-e9a67-ithin-the-closed-type-scale-chromium/error-context.md`
  situe le timeout dans `measureInvalidFormStates` : le champ contient
  « reporting », mais « Esquisser » est encore désactivé. C'est compatible avec
  une course à l'hydratation, sans permettre de confirmer sa cause exacte.

Le changement A6 ne modifie pas le padding calculé du formulaire : une règle
`.rev-button` ultérieure utilisait déjà `--button-padding` sur origin/main.
La barre reste dans le flux ; le séparateur de langue a `pointer-events: none`.
Les modifications A2 bis sont situées après le formulaire d'accueil.

Un lancement ciblé avant cette reprise échoue au démarrage de Chromium avec
`MachPortRendezvousServer: Permission denied (1100)`, avant toute navigation.
La comparaison interactive avant/après et le diagnostic définitif restent
donc bloqués. Aucun correctif spéculatif ni modification du test de saisie.

### Préservation du worktree

Les 36 PNG déjà modifiés à l'arrivée sont conservés avec les mêmes SHA256.
La spec et les autres modifications préexistantes sont préservées. Aucun
nouveau PNG, texte public, alt, aria-label, metadata, URL, contenu Journal,
contrat `brand-os.*`, API ou lockfile modifié. Aucun commit, push ni déploiement.
La comparaison finale des empreintes est consignée avec les vérifications.

### Résultats d'exécution de la révision 2

| Commande | Résultat |
| --- | --- |
| `npm run lint` | Succès, code 0. |
| `npx tsc --noEmit` | Succès, code 0. |
| `npm test` | Succès, 102/102, aucun ignoré ; rejoué après le build final. |
| `npm run test:brand-os` | Succès, 24/24, aucun ignoré ; rejoué après le build final. |
| `npm run qa:claims:rev01` | Succès, code 0. |
| `npm run build` | Turbopack sans progression après 120 s sur « Creating an optimized production build » ; interruption SIGINT, wrapper code 124. |
| `npm run build -- --webpack` | Succès, code 0, 58/58 pages générées. Script build inchangé. Avertissement `metadataBase` préexistant. |
| `npm run qa:brand:rev01` | Succès après le build final, code 0. |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1 --output=/private/tmp/lot-a-r2-network-results` | Code 1 : Chromium refusé au lancement avant navigation. 329 cas découverts, 1 échec d'infrastructure et 328 non exécutés. |
| `npx playwright test tests/design-harmonisation.spec.ts --list` | Succès : 17 cas découverts. |
| `git diff --check` | Succès. |
| SHA256 des captures préexistantes | 36/36 identiques à l'arrivée. |

Les tests SSR utilisent le build Webpack final avec leur blocage réseau ; les
nouveaux tests navigateur sont découverts mais leurs assertions ne sont pas
validées ici. `--max-failures=1` arrête la répétition du même refus de lancement,
sans désactiver d'assertion. Aucun serveur local lancé, conformément à AI_CONTEXT.
Les logs sont dans `/private/tmp/lot-a-r2-*.log`, dont `test-final`,
`brand-os-final`, `build`, `webpack` et `network`.

Aucun point supplémentaire annulé. A2 initial (48 px) est remplacé par A2 bis,
et A6 est conservé. Restent à exécuter sur l'hôte : build Turbopack, batterie
navigateur complète avec le serveur sur 3210, diagnostic interactif du timeout
mobile, puis revue visuelle par Claude. Aucun résultat de géométrie ou
d'interaction n'est présenté comme validé par ce sandbox.

## Révision 3 — corrections des revues, 26/10/2026

La spec complète, AGENTS.md, AI_CONTEXT.md, TRUTH.md et les guides CSS/CLI de
Next 16.3.4 installé ont été lus avant modification. La révision 3 constitue le
plan validé. Le code des révisions précédentes est conservé ; la modification
préexistante de la spec est intacte. Aucun commit, push ou déploiement effectué.

| Fichier et ligne | Modification |
| --- | --- |
| `src/app/(rev01)/rev01.css:1773` | H1 accueil à 400, taille/cadre/couleurs inchangés ; autres graisses inchangées. |
| `src/system/components/RevHeader.tsx:137` | Groupe nommé « Langue » / « Language », état `aria-pressed` conservé, `aria-current` redondant retiré. Aucune logique de bascule modifiée. |
| `src/app/(rev01)/rev01.css:2464` | Suppression des deux règles `.r2-std-row .ps`, desktop et responsive, après recherche sans consommateur dans `src/`. |
| `src/app/(rev01)/systems/page.tsx:274`, `rev01.css:3187` | Titre de preuve du hero en H2 avec classe dédiée reprenant le style précédent : 22 px, 500, marge nulle. |
| `src/app/(rev01)/rev01.css:3207` | Cible réelle du lien Méthode de 44 px, sans changement de libellé ou de destination. |
| `src/system/components/SystemCard.tsx:20`, `rev01.css:3383` | Sept lignes partagées : domaine, titre, quatre rubriques, preuve. Le DL utilise les quatre lignes de subgrid correspondantes. Une rubrique absente conserve sa position sans contenu fabriqué. Titres et preuves alignés en haut. |
| `src/app/(rev01)/rev01.css:3385` | Retrait des cartes aligné sur la preuve du hero : 24 px (`--s3`) sur desktop, 18 px jusqu'à 760 px. L'ancien retrait de 30 px expliquait un écart horizontal de 6 px sur desktop. |
| `tests/design-harmonisation.spec.ts:88`, `:143` | Contrats H1/langue actualisés ; quatre nouveaux cas Systems, FR/EN à 1440×900 et 390×844, soit 21 cas dans le fichier. |
| `AI_CONTEXT.md:596` | État révision 3 et limites de vérification consignés. |

Les nouveaux tests contrôlent la hiérarchie complète des titres, le style
inchangé du titre de preuve, le maintien de la graisse des autres H1, la cible
du lien (y compris ses zones de padding), les quatre rubriques par carte,
l'alignement des deux paires de cartes sur desktop, leur empilement mobile,
l'alignement horizontal avec la preuve du hero, l'absence de chevauchement et
de débordement. Ils utilisent le harnais deny-all commun, sans capture ajoutée.

Les assertions 500/aria-current du test du lot sont remplacées par celles
explicitement demandées par la révision 3 ; aucun autre test existant n'est
modifié dans cette reprise. Aucun texte visible, métadonnée, URL, API, article
ou fichier vendorisé n'a changé. Le seul libellé accessible modifié est celui
du groupe de langues, expressément demandé. A2 bis et A3/A4/A6 sont conservés.

Le diagnostic mobile reste limité : comparaison locale avec `origin/main`
(`c8dce63`), AgentEsquisse et QuickCapture identiques ; le test d'aération est
inchangé dans cette reprise. AI_CONTEXT sur cette référence signale déjà
l'échec à 390 px. Chromium étant refusé avant navigation, aucune cause CSS
n'est confirmée et aucun correctif spéculatif du formulaire n'est ajouté.

Aucun point supplémentaire annulé. A2 initial à 48 px reste remplacé par A2 bis
à 40/32 px ; les clôtures restent exemptées. A1 à 500 et `aria-current` sont
remplacés par les arbitrages explicites de la révision 3, pas par un relâchement
des contrôles.

### Résultats d'exécution de la révision 3

| Commande | Résultat |
| --- | --- |
| `npm run lint` | Succès, code 0. |
| `npx tsc --noEmit` | Succès, code 0. |
| `npm test` | Succès, 102/102, rejoué sur le build final. |
| `npm run test:brand-os` | Succès, 24/24, rejoué sur le build final. |
| `npm run qa:claims:rev01` | Succès, code 0. |
| `npm run build` | Turbopack sans progression pendant 90 s à la compilation ; arrêté par SIGINT, wrapper code 124. |
| `npm run build -- --webpack` | Succès après le dernier changement CSS, 58/58 pages ; avertissement `metadataBase` préexistant. Script et dépendances inchangés. |
| `npm run qa:brand:rev01` | Succès, y compris après le build final. |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1 --output=/private/tmp/lot-a-r3-playwright` | 333 cas découverts ; Chromium refusé avant navigation (`MachPortRendezvousServer: Permission denied (1100)`), code 1. Un échec d'infrastructure, 332 cas non exécutés. |
| `npx playwright test tests/design-harmonisation.spec.ts --list` | Succès, 21 cas découverts après le dernier changement. |
| `git diff --check` | Succès. |
| Recherche `box-shadow`, `boxShadow`, `.r2-std-row .ps` dans `src/` | Aucune occurrence. |

Les tests SSR utilisent le build final et interdisent les sorties réseau.
Aucun serveur lancé, conformément à AI_CONTEXT ; aucune capture créée.
La batterie navigateur devra être rejouée sur l'hôte avec le serveur sur 3210,
y compris les 21 cas du lot et le parcours d'aération mobile inchangé.
La revue visuelle reste à Claude. Logs : `/private/tmp/lot-a-r3-*.log`, notamment
`build`, `build-webpack-final`, `test-final`, `brand-os-final` et `network`.

### Vérification finale du worktree — 25/10/2026

La reprise trouve déjà les corrections de la révision 3 et leurs tests dans
le worktree. Après lecture des instructions, de la spec complète, des guides
Next locaux et revue du diff contre `origin/main`, aucun complément de code
n'est nécessaire. Les modifications préexistantes, notamment la spec, sont
conservées. Seuls ce rapport et AI_CONTEXT sont complétés pendant cette reprise.
La liste de fichiers et les lignes de la révision 3 ci-dessus restent valables.

Les 21 cas de `tests/design-harmonisation.spec.ts` sont conservés : tailles des
titres et exceptions, couleurs des numéros, langues accessibles, cibles tactiles,
hiérarchie et alignement des cartes Systems, absence d'ombres et de débordement.
Aucun test supplémentaire ni modification des assertions n'a été nécessaire.
Le harnais deny-all reste actif. Aucun point supplémentaire annulé.

| Commande relancée | Résultat de cette reprise |
| --- | --- |
| `npm run lint` | Succès, code 0. |
| `npx --no-install tsc --noEmit` | Succès, code 0. |
| `npm test` | Succès, 102/102 ; également après le nouveau build Webpack. |
| `npm run test:brand-os` | Succès, 24/24 ; également après le nouveau build Webpack. |
| `npm run qa:claims:rev01` | Succès, code 0. |
| `npm run build` | Aucune progression après 120 s à la compilation Turbopack ; interruption SIGINT, wrapper code 124. |
| `npm run build -- --webpack` | Succès, 58/58 pages ; avertissement `metadataBase` préexistant. |
| `npm run qa:brand:rev01` | Succès, également après build. |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1 --output=/private/tmp/lot-a-final-network-results` | 333 cas découverts ; Chromium refusé par macOS (`MachPortRendezvousServer`, permission denied 1100) avant toute navigation. Un échec d'infrastructure, 332 cas non exécutés. |
| `npx --no-install playwright test tests/design-harmonisation.spec.ts --list` | Succès, 21 cas découverts. |
| `git diff --check` | Succès. |

La comparaison confirme que `AgentEsquisse.tsx`, `QuickCapture.tsx` et la page
d'accueil sont identiques à `origin/main`, ainsi que la fonction
`measureInvalidFormStates`. Le timeout à 390 px figure déjà dans AI_CONTEXT
sur cette référence. Le diagnostic navigateur demeure bloqué ; aucune cause
CSS ni résolution de ce timeout n'est affirmée.

Les recherches d'ombres et de `.r2-std-row .ps` dans `src/` sont vides. Aucun
serveur, capture, commit, push ou déploiement ajouté. Les journaux de cette
exécution sont dans `/private/tmp/lot-a-final-*.log`. La validation navigateur
et le build Turbopack restent à exécuter sur l'hôte ; Webpack ne remplace pas
ces validations.

### Nouvelle vérification — journaux `lot-a-verify`, 25/10/2026

Les huit fichiers déjà modifiés à l'ouverture sont conservés. La revue de la
spec complète (révisions 1 à 3), des consignes et du diff confirme que le code
et les 21 tests du lot sont déjà présents ; aucun ajout de code ou de test
n'est nécessaire dans cette reprise. Seuls ce rapport et AI_CONTEXT sont
complétés. Les fichiers et lignes de la révision 3 restent valables.

| Commande exécutée | Résultat |
| --- | --- |
| `npm run lint` | Succès. |
| `npx --no-install tsc --noEmit` | Succès. |
| `npm test` | 102/102, y compris après le nouveau build Webpack. |
| `npm run test:brand-os` | 24/24, y compris après le nouveau build Webpack. |
| `npm run qa:claims:rev01` | Succès. |
| `npm run build` | Interrompu après 120 s sans progression à la compilation Turbopack ; code du wrapper 124. |
| `npm run build -- --webpack` | Succès, 58/58 pages ; avertissement `metadataBase` préexistant. |
| `npm run qa:brand:rev01` | Succès avant et après build. |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1 --output=/private/tmp/lot-a-verify-network-results` | Chromium refusé avant navigation : `MachPortRendezvousServer`, permission denied 1100. Un échec d'infrastructure, 332 cas non exécutés. |
| `npx --no-install playwright test tests/design-harmonisation.spec.ts --list` | 21 cas découverts. |
| `git diff --check` | Succès. |

Aucun point supplémentaire annulé. La comparaison avec `origin/main` confirme
que le formulaire et sa séquence de test mobile sont inchangés ; le timeout
mobile y était déjà documenté. Sa cause reste à établir dans le navigateur.
Les recherches d'ombres et de la règle `.r2-std-row .ps` restent vides.
Les journaux de cette reprise sont dans `/private/tmp/lot-a-verify-*.log`.
Aucun serveur, capture, commit, push ou déploiement effectué.
