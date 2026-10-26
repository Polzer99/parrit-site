# Tour 1 — cohérence globale

Implémentation locale du 26/10/2026. Aucun commit, push, merge, déploiement ou
changement du compte Cal.com. Le handoff préexistant non suivi est conservé.

## Périmètre et preuve

Instructions lues : AGENTS.md, AI_CONTEXT.md, TRUTH.md et handoff. Plan exécuté :
textes et redirections, composants communs, règles CSS, tests, revue et rapport.
Écritures limitées à ce checkout de développement, réversibles par diff Git ;
aucune donnée externe ni table modifiée (0 ligne). Les fichiers suivis étaient
propres au départ ; le handoff était le seul fichier non suivi. Les articles ne
changent que dans leur frontmatter. Les fichiers vendorisés restent intacts.

Sources de décision : code et formulaires de ce checkout, documentation Next
16.3.4 installée (`redirects.md`), types et CSS de `@calcom/embed-core` installé,
version `@calcom/embed-react` 1.5.3 verrouillée. Consultation le 26/10/2026.
Context7 ne proposait aucun résultat pertinent pour embed-react ; documentation
et suivi officiels Cal.com consultés en complément.

Limite de boucle : une tentative Turbopack, repli Webpack si absence de progression ;
arrêt des tests navigateur au premier refus de lancement du sandbox. Aucune
assertion géométrique relâchée pour contourner le refus de Chromium.

## État ligne par ligne

« Fait » signifie implémenté et contrôlé statiquement/au rendu serveur ; les
mesures visuelles restent à rejouer sur l’hôte pour toutes les lignes CSS.

| Spec | État | Fichiers et résultat |
|---|---|---|
| 1 Manufacture, hébergement contractuel | Fait | `src/app/(rev01)/manufacture/page.tsx`, textes FR/EN exacts |
| 1 Systems, destination des données | Fait | `systems/page.tsx`, réponse contractuelle FR/EN |
| 1 Standard 05, maintenance | Fait | `standard/page.tsx`, fin de promesse inconditionnelle |
| 1 Systems, formation et système | Fait | FAQ FR/EN remplacée |
| 1 Harness, title | Fait | `SiteV1Page.tsx`, « rendre … plus fiables » FR/EN |
| 1 Construction EN | Fait | Home et `site-v1-pages.ts`, building block |
| 1 Confidentialité | Fait | `legal/page.tsx` aligné sur QuickCapture servi par Commission : e-mail, intérêt, source, identifiant, page, langue, attribution ; retrait description et ressources |
| 1 Journal, six corrections | Fait | Cinq frontmatters, dont titre facturation ; aucun corps retouché |
| 1 Gate accroches | Fait | `ownership-claims.mjs` parse le YAML, contrôle title/description, y compris descriptions multilignes ; corps exclus |
| 1 Articles /fr | Fait | `next.config.ts`, 308 générique et aliases renommés directement vers leur destination finale ; paramètres conservés par Next |
| 1 Index Journal | Fait | Note FR unique, badges EN retirés, dates FR et EN-GB aux formats demandés |
| 2.1 Largeur | Fait, mesure hôte requise | CSS commune largeur de contenu, aussi sur mobile ; groupes cohérents |
| 2.2 Alignement | Fait, mesure hôte requise | Alignement gauche des actions ; clôtures centrées avec leur titre ; suppression de l’action décalée dans Systems |
| 2.3 Actions doubles | Fait, mesure hôte requise | Home et Systems : exec puis ghost, gap brand-s2 ; tests hauteur et alignement |
| 2.4 Principal | Fait | Un principal par section ; clôtures existantes via FinalCall |
| 2.5 Libellés | Fait | Sans point final ; contrôles navigateur ; infinitif/impératif des actions conservé |
| 2.6 Commission | Fait | CTA uniformisé, y compris hero, BWY et QuickCapture ; exception textuelle BWY système sur mesure selon spec |
| 2.7 Formulaire | Conservé | Envoi à droite du champ ; exclu des mesures d’alignement de liens |
| 2.8 Navigation | Fait | Style ghost identique, suppression de la variation par intersection du hero |
| 2 Documentation et gate | Fait | Règles ajoutées à AGENTS.md, CTA synchronisé dans TRUTH.md ; 52 parcours, 26 pages × 2 largeurs |
| 3 Liens | Fait | Couleur par jeton contextuel, soulignement 1 px ; test contre bleu navigateur |
| 3 Séquence | Fait | `Sequence.tsx`, réutilisé pour Conseil, Sprints et Méthode ; guides Conseil et Sprints également |
| 3 FAQ | Fait | `Faq.tsx`, details natif et + SVG, réutilisé dans guides et Systems |
| 3 Dernier appel | Fait sur les clôtures existantes | `FinalCall.tsx` partagé home, quatre guides, Standard, Manufacture, Dossiers, BWY et Systems. Pas de nouvelle section marketing ajoutée à Legal, Journal ou Commission, pour respecter l’interdit de restructuration |
| 3 Footer | Fait, mesure hôte requise | Aucun filet supérieur d’enveloppe ; séparateurs entre rangées étendus sur la grille ; registre Systems retiré, copyright commun conservé |
| 3 H1 | Fait | Recette commune 400 / .98 / 22ch, y compris pages anciennes ; tailles existantes conservées |
| 3 Onglets | Fait | Contour inactif brand-line, actif plein, panneaux avec majuscule |
| 3 Navigation + et fonds | Fait | Plus/More ; même jeton encre pour barre et hero sombre |
| 4 Sous-menu Engineering | Fait | Trois bénéfices distincts FR/EN, desktop et mobile |
| 4 Commission | Fait | Titre exact et états de chargement en casse normale |
| 4 Standard | Fait | Décision prête à être tranchée, état des ventes, historique ; licenses EN |
| 4 Engagements | Fait | Manufacture emploie engagements/commitments comme Standard |
| 4 Dossiers / Manufacture EN | Fait | Titres et footer ; numéros internes de dossiers conservés comme clés mais non rendus |
| 4 Références | Fait | Joone EN corrigé ; ponctuation des cinq noms, exception virgule Laparra EN ; permissions inchangées |
| 4 Titres et anglais américain | Fait dans le périmètre éditable | Quatre titres Journal en casse de phrase ; noms propres et sigles conservés ; licenses ; titre nominal Legal sans point. Corps d’articles inchangés conformément à l’interdit |
| 4 Date Harness | Fait | Style de pied en brand-fg2, taille existante |
| 5 Langue et 24 h Cal.com | Impossible à garantir avec l’API installée | Voir limites ci-dessous ; aucun paramètre fictif ajouté |
| 5 Thème Cal.com | Fait, rendu tiers non vérifié | Fond, texte, texte secondaire, bordures et accent depuis jetons encre ; `styles.align: left` documenté dans les types locaux |
| 5 Largeur et marges Cal.com | Fait côté hôte | Conteneurs 100 %, marges horizontales nulles, overflow contenu ; intérieur cross-origin non mesurable ici |
| 5 Rayons / nom | Hors contrôle du site | Nom et paramètres de l’événement à vérifier dans le compte Cal.com ; aucune mutation distante |

## Tests et exécution

Référence avant modification : dépendances absentes, puis `npm ci --offline`
réussi sans modification du lockfile. Suite Node : 162/165, trois échecs dus à
l’absence initiale de `.next`, pas à une assertion produit.

État candidat :

| Commande | Résultat |
|---|---|
| `npm run lint` | Vert, aucune alerte |
| `npx tsc --noEmit` | Vert |
| `npm test` | 169/169 |
| `npm run build` | Turbopack interrompu après absence de progression, pas déclaré vert |
| `npm run build -- --webpack` | Vert, 62 pages |
| `npm run qa:brand:rev01` | Vert |
| `npm run qa:claims:rev01` | Vert |
| `npm run test:brand-os` | 24/24 |
| `git diff --check` | Vert |
| `next start -p 3210` | Refus sandbox : listen EPERM |
| Playwright tour1 | 53 tests recensés ; Chromium refusé avant navigation |
| `qa:network:rev01 -- --max-failures=1` | 489 tests recensés ; refus Chromium, arrêt anticipé, suite non validée |

Nouveaux tests : `tests/tour1-coherence.test.mjs` (4 cas : claims y compris YAML
multiligne et contrôle négatif sur corps, séquences/FAQ sans JS FR/EN, manifeste
308 et aliases) ; `tests/tour1-coherence.spec.ts` (52 parcours responsive et un
parcours redirection avec paramètres et langue HTML). Deny-all partagé, embed
simulé explicitement, service workers bloqués. Spec ajoutée à qa:network.

Adaptations autorisées des tests existants :
- `ergonomie-impact.test.mjs` : sélecteur du composant séquence, mêmes comptes
  d’étapes et connecteurs.
- `readability-contract.test.mjs` : ancienne variation observer du CTA remplacée
  par style invariant ; menu natif toujours contrôlé.
- `audit-truth-copy.test.mjs` : formulation Joone explicitement approuvée ajoutée
  aux formulations d’accompagnement ; interdit de promettre un système conservé.
- `brand-os-render.test.mjs` : ancien badge par article remplacé par interdiction
  du badge et comptage d’une note unique FR dans le texte visible (hors payload
  RSC). Liens canoniques et `hreflang` toujours contrôlés.

- `journal-locale.test.mjs` et `conformity-i18n.spec.ts` : l’ancien contrat
  d’alias français réécrit est remplacé par le 308, une seule destination anglaise,
  conservation des paramètres (y compris `lang=fr`), contenu identique et choix
  de langue conservé dans le cookie. La bascule reste sur l’article canonique.
  `locale.ts` et `proxy.ts` empêchent la réintroduction d’un détour.

Journaux : `/private/tmp/tour1-{baseline-ready,lint,types,build,webpack,tests,brand,claims,brand-os,browser,network,server}.log`.

## Limites Cal.com et preuve de production

Le type `KnownConfig` installé ne fournit ni langue ni format horaire ; `UiConfig`
non plus. Le suivi officiel décrit ces limitations :
[langue de l’embed](https://github.com/calcom/cal.diy/issues/30193),
[format horaire de l’embed](https://github.com/calcom/cal.diy/issues/23289).
Les couleurs sont exposées par `cssVarsPerTheme` ; leurs noms sont présents dans
`node_modules/@calcom/embed-core/dist/embed/embed.js`. Le réglage de langue par
événement (`interfaceLanguage`) ne suffit pas à faire suivre deux langues à un
seul événement. Aucun changement du compte ou nouvel événement n’a été fait.
Les rayons internes, le nom, les marges internes et la sélection de créneaux
restent à constater sur le vrai embed ; la CSS hôte ne traverse pas son iframe.

PRODUCTION_PROOF restant : revue sur l’hôte de la suite complète, captures
1440/375 et contraste, vérification de la redirection en un saut, rendu des
boutons/FAQ/onglets, puis contrôle manuel de l’embed Cal.com sans soumettre de
réservation. Un build réussi ou un mock Cal ne prouve pas ces effets. Aucun
résultat visuel ou de production n’est revendiqué ici.

## Correctif

Mandat : `HANDOFF-CORRECTIF-TOUR1.md`, appliqué au checkout local sans commit,
push ni changement de branche. Écritures limitées aux composants, styles,
textes du hero, documentation et aux deux tests expressément autorisés.
Aucune écriture sur un service externe. Modifications réversibles par le diff ;
état initial suivi propre, hormis le handoff non suivi conservé.

Source de référence : journal hôte `tour1-echecs.log` fourni dans le handoff,
443 réussites / 46 échecs sur le tour 1. La table conserve les numéros du journal.
Il s’agit de corrections du code et de contradictions identifiées, pas de
résultats navigateur après correctif : Claude rejoue cette suite sur l’hôte.

Le hero retrouve « Parlons de votre transformation » / « Let's talk about your
transformation ». L’exception du test vise uniquement le premier bouton exec de
H01 sur l’accueil ; tous les autres boutons restent contrôlés. AGENTS et TRUTH
reprennent cette décision. Les FAQ V1 gardent leur balisage existant, explicitement
verrouillé par le test Node ; la même implémentation Faq permet à Systems de
conserver ses titres h3. Aucun test Node modifié.

| N° | Cas du journal | Cause | Correction ou limite |
|---|---|---|---|
| 1 | aeration.spec.ts:114:7 › at 1440px all routes keep text clear and within the closed type scale | Contours des onglets inactifs à 1,565:1. | Contour sur le jeton de texte secondaire du registre (repli g2 / paper). |
| 2 | audit-readability.spec.ts:19:9 › audit readability /build-with-you at 375px | Lien d’action BWY recoloré par la règle des liens courants. | Exclusion de ce lien des deux sélecteurs génériques ; couleur héritée claire restaurée. |
| 3 | alignment-grid.spec.ts:7:7 › shared grid en /systems 1440 | Ancien registre de pied de page supprimé. | Ancrage autorisé déplacé vers footer.home-s-footer ; mesure du bord de contenu conservée. |
| 4 | aeration.spec.ts:114:7 › at 390px all routes keep text clear and within the closed type scale | Contours des onglets inactifs à 1,565:1. | Contour sur le jeton de texte secondaire du registre (repli g2 / paper). |
| 5 | conformity-home.spec.ts:5:7 › home structure, references and geometry en 375 | H12 imbriqué dans un div, absent de main > section. | FinalCall devient la section directe H12 ; son enveloppe de grille passe à l’intérieur. |
| 6 | conformity-home.spec.ts:5:7 › home structure, references and geometry fr 375 | H12 imbriqué dans un div, absent de main > section. | FinalCall devient la section directe H12 ; son enveloppe de grille passe à l’intérieur. |
| 7 | conformity-home.spec.ts:5:7 › home structure, references and geometry en 390 | H12 imbriqué dans un div, absent de main > section. | FinalCall devient la section directe H12 ; son enveloppe de grille passe à l’intérieur. |
| 8 | audit-readability.spec.ts:19:9 › audit readability /fr/build-with-you at 375px | Lien d’action BWY recoloré par la règle des liens courants. | Exclusion de ce lien des deux sélecteurs génériques ; couleur héritée claire restaurée. |
| 9 | conformity-home.spec.ts:5:7 › home structure, references and geometry fr 390 | H12 imbriqué dans un div, absent de main > section. | FinalCall devient la section directe H12 ; son enveloppe de grille passe à l’intérieur. |
| 10 | conformity-home.spec.ts:5:7 › home structure, references and geometry en 1023 | H12 imbriqué dans un div, absent de main > section. | FinalCall devient la section directe H12 ; son enveloppe de grille passe à l’intérieur. |
| 11 | conformity-home.spec.ts:5:7 › home structure, references and geometry fr 1023 | H12 imbriqué dans un div, absent de main > section. | FinalCall devient la section directe H12 ; son enveloppe de grille passe à l’intérieur. |
| 12 | conformity-home.spec.ts:5:7 › home structure, references and geometry en 1024 | H12 imbriqué dans un div, absent de main > section. | FinalCall devient la section directe H12 ; son enveloppe de grille passe à l’intérieur. |
| 13 | conformity-home.spec.ts:5:7 › home structure, references and geometry fr 1024 | H12 imbriqué dans un div, absent de main > section. | FinalCall devient la section directe H12 ; son enveloppe de grille passe à l’intérieur. |
| 14 | alignment-grid.spec.ts:7:7 › shared grid fr /systems 1440 | Ancien registre de pied de page supprimé. | Ancrage autorisé déplacé vers footer.home-s-footer ; mesure du bord de contenu conservée. |
| 15 | conformity-home.spec.ts:5:7 › home structure, references and geometry en 1440 | H12 imbriqué dans un div, absent de main > section. | FinalCall devient la section directe H12 ; son enveloppe de grille passe à l’intérieur. |
| 16 | conformity-home.spec.ts:5:7 › home structure, references and geometry fr 1440 | H12 imbriqué dans un div, absent de main > section. | FinalCall devient la section directe H12 ; son enveloppe de grille passe à l’intérieur. |
| 17 | audit-readability.spec.ts:19:9 › audit readability /build-with-you at 390px | Lien d’action BWY recoloré par la règle des liens courants. | Exclusion de ce lien des deux sélecteurs génériques ; couleur héritée claire restaurée. |
| 18 | doctrine-visible.spec.ts:94:11 › doctrine decorative pink accent spacing in every viewport fr / 1440 | Bouton de navigation rose voisin des marqueurs de la scène. | Navigation non rose. Assertion ultérieure de bascule exec au scroll incompatible avec le style invariant : test inchangé. |
| 19 | design-harmonisation.spec.ts:142:9 › systems heading hierarchy, method target and aligned cards fr 1440 | H1 à 400 au lieu de 500. | Recette commune H1 à 500. |
| 20 | audit-readability.spec.ts:19:9 › audit readability /fr/build-with-you at 390px | Lien d’action BWY recoloré par la règle des liens courants. | Exclusion de ce lien des deux sélecteurs génériques ; couleur héritée claire restaurée. |
| 21 | alignment-grid.spec.ts:7:7 › shared grid en /systems 375 | Ancien registre de pied de page supprimé. | Ancrage autorisé déplacé vers footer.home-s-footer ; mesure du bord de contenu conservée. |
| 22 | doctrine-visible.spec.ts:94:11 › doctrine decorative pink accent spacing in every viewport fr /systems 1440 | Le test impose ghost au premier bouton Systems ; le contrôle tour 1 impose exec puis ghost. | Contradiction laissée visible : exec puis ghost conservés conformément à la règle tour 1 ; aucun test modifié. |
| 23 | design-harmonisation.spec.ts:142:9 › systems heading hierarchy, method target and aligned cards en 1440 | H1 à 400 au lieu de 500. | Recette commune H1 à 500. |
| 24 | audit-readability.spec.ts:19:9 › audit readability / at 1440px | Contour et texte de navigation roses sur l’accueil. | Jeton paper pour le style ghost commun, fond transparent. |
| 25 | doctrine-visible.spec.ts:94:11 › doctrine decorative pink accent spacing in every viewport fr / 390 | Le test exige encore une bascule ghost vers exec après le hero. | Style invariant conservé conformément au handoff ; assertion obsolète non modifiée. |
| 26 | alignment-grid.spec.ts:7:7 › shared grid fr /systems 375 | Ancien registre de pied de page supprimé. | Ancrage autorisé déplacé vers footer.home-s-footer ; mesure du bord de contenu conservée. |
| 27 | audit-readability.spec.ts:19:9 › audit readability /fr at 1440px | Contour et texte de navigation roses sur l’accueil. | Jeton paper pour le style ghost commun, fond transparent. |
| 28 | design-harmonisation.spec.ts:142:9 › systems heading hierarchy, method target and aligned cards fr 390 | H1 à 400 au lieu de 500. | Recette commune H1 à 500. |
| 29 | doctrine-visible.spec.ts:94:11 › doctrine decorative pink accent spacing in every viewport fr /systems 390 | Le test impose ghost au premier bouton Systems ; le contrôle tour 1 impose exec puis ghost. | Contradiction laissée visible : exec puis ghost conservés conformément à la règle tour 1 ; aucun test modifié. |
| 30 | audit-readability.spec.ts:19:9 › audit readability /build-with-you at 1440px | Lien d’action BWY recoloré par la règle des liens courants. | Exclusion de ce lien des deux sélecteurs génériques ; couleur héritée claire restaurée. |
| 31 | systems.spec.ts:10:9 › systems en at 375px | Questions FAQ dans des span, aucun h3. | Faq reçoit questionHeading pour Systems : quatre h3 dans les summary, interaction native conservée. |
| 32 | doctrine-visible.spec.ts:94:11 › doctrine decorative pink accent spacing in every viewport en / 1440 | Bouton de navigation rose voisin des marqueurs de la scène. | Navigation non rose. Assertion ultérieure de bascule exec au scroll incompatible avec le style invariant : test inchangé. |
| 33 | design-harmonisation.spec.ts:142:9 › systems heading hierarchy, method target and aligned cards en 390 | H1 à 400 au lieu de 500. | Recette commune H1 à 500. |
| 34 | tour1-coherence.spec.ts:8:7 › coherence fr 375 /systems | Boutons Systems mobiles de largeurs et hauteurs différentes. | Sous 600 px, grille à lignes égales et tous les boutons à 100 % ; dès 600 px, largeur de contenu et étirement vertical. |
| 35 | audit-readability.spec.ts:19:9 › audit readability /fr/build-with-you at 1440px | Lien d’action BWY recoloré par la règle des liens courants. | Exclusion de ce lien des deux sélecteurs génériques ; couleur héritée claire restaurée. |
| 36 | systems.spec.ts:10:9 › systems fr at 375px | Questions FAQ dans des span, aucun h3. | Faq reçoit questionHeading pour Systems : quatre h3 dans les summary, interaction native conservée. |
| 37 | doctrine-visible.spec.ts:94:11 › doctrine decorative pink accent spacing in every viewport en /systems 1440 | Le test impose ghost au premier bouton Systems ; le contrôle tour 1 impose exec puis ghost. | Contradiction laissée visible : exec puis ghost conservés conformément à la règle tour 1 ; aucun test modifié. |
| 38 | tour1-coherence.spec.ts:8:7 › coherence en 375 /systems | Boutons Systems mobiles de largeurs et hauteurs différentes. | Sous 600 px, grille à lignes égales et tous les boutons à 100 % ; dès 600 px, largeur de contenu et étirement vertical. |
| 39 | systems.spec.ts:10:9 › systems en at 767px | Questions FAQ dans des span, aucun h3. | Faq reçoit questionHeading pour Systems : quatre h3 dans les summary, interaction native conservée. |
| 40 | doctrine-visible.spec.ts:94:11 › doctrine decorative pink accent spacing in every viewport en / 390 | Le test exige encore une bascule ghost vers exec après le hero. | Style invariant conservé conformément au handoff ; assertion obsolète non modifiée. |
| 41 | systems.spec.ts:10:9 › systems fr at 767px | Questions FAQ dans des span, aucun h3. | Faq reçoit questionHeading pour Systems : quatre h3 dans les summary, interaction native conservée. |
| 42 | doctrine-visible.spec.ts:94:11 › doctrine decorative pink accent spacing in every viewport en /systems 390 | Le test impose ghost au premier bouton Systems ; le contrôle tour 1 impose exec puis ghost. | Contradiction laissée visible : exec puis ghost conservés conformément à la règle tour 1 ; aucun test modifié. |
| 43 | systems.spec.ts:10:9 › systems en at 768px | Questions FAQ dans des span, aucun h3. | Faq reçoit questionHeading pour Systems : quatre h3 dans les summary, interaction native conservée. |
| 44 | systems.spec.ts:10:9 › systems fr at 768px | Questions FAQ dans des span, aucun h3. | Faq reçoit questionHeading pour Systems : quatre h3 dans les summary, interaction native conservée. |
| 45 | systems.spec.ts:10:9 › systems en at 1440px | Questions FAQ dans des span, aucun h3. | Faq reçoit questionHeading pour Systems : quatre h3 dans les summary, interaction native conservée. |
| 46 | systems.spec.ts:10:9 › systems fr at 1440px | Questions FAQ dans des span, aucun h3. | Faq reçoit questionHeading pour Systems : quatre h3 dans les summary, interaction native conservée. |

### Assertions incompatibles conservées

- `doctrine-visible.spec.ts:168` exige une bascule exec au scroll ; le handoff
  impose une navigation de style invariant. Pas de réintroduction de l’observateur.
- `doctrine-visible.spec.ts:99` exige ghost au hero Systems ;
  `tour1-coherence.spec.ts:38` exige exec puis ghost pour ce même groupe.
  La règle tour 1 est conservée ; ces quatre cas doctrine restent non résolus.
- Navigation : le jeton contextuel `--accent-on-dark` du seul bouton cmd-cta
  est défini sur `--paper`. La recette ghost existante conserve son alias ;
  les autres accents du site restent inchangés. Le contrôle Node de cette recette
  et les mesures navigateur du jeton restent applicables au registre neutre.

PRODUCTION_PROOF : suite navigateur hôte, captures 1440/375, mesure des contours
d’onglets et géométrie des boutons. Aucune preuve de production revendiquée.

### Vérification

Baseline locale avant modification : 165/169 tests Node ; quatre échecs dus à
l’absence de `.next` (contrats d’assets, glyphes, rendu compilé, redirects).
Après un build préparatoire Webpack : `npm ci --silent`, lint et 169/169 tests
Node réussis dans la chaîne exacte demandée. Aucun test rendu vert par une
modification de ses assertions Node.

Contraste théorique du contour, calcul WCAG depuis les valeurs vendorisées :
6,228:1 (calm), 4,627:1 (canard), 8,478:1 (ink). La mesure sur le fond peint
reste à confirmer par la suite navigateur hôte.

Résultat final : la chaîne exacte demandée s’arrête à `npm run build` :
Turbopack interrompu (code 130) après environ 120 s sans progression.
Les commandes suivantes du `&&` n’ont donc pas été exécutées dans cette chaîne.
La tentative préparatoire Turbopack avait rencontré le même blocage ; aucun
changement du script build, de la configuration ou des dépendances pour le masquer.

Validation de repli sur les fichiers finaux, code de sortie 0 :
`npm run build -- --webpack && npm run lint && npm test && npm run qa:brand:rev01 && npm run qa:claims:rev01 && npm run test:brand-os`.
Build 62 pages, lint réussi, 169/169 tests Node, marque et claims réussis,
24/24 tests Brand OS. `git diff --check` réussi. Pas de suite navigateur locale ;
les contradictions ci-dessus empêchent d’annoncer les 489 cas verts.

Journaux locaux : `/tmp/fix-tour1-baseline.log`, `/tmp/fix-tour1-battery.log`
(chaîne exacte), `/tmp/fix-tour1-validation.log` (validation finale Webpack),
`/tmp/fix-tour1-webpack.log` (build préparatoire).


## Correctif B — 27/10/2026, nuit

Mandat : `HANDOFF-CORRECTIF-TOUR1-B.md`, appliqué sur les changements A
existants, branche `fix/tour1-coherence`, HEAD `41cc437`. Aucun commit, push,
changement de branche ni déploiement. Écritures locales réversibles uniquement ;
aucune donnée métier touchée. Copie avant B des huit fichiers concernés :
`/private/tmp/tour1-b-backup/` (0 à 7 : RevHeader, site-v1.css, rev01.css,
Systems, test tour1, AGENTS, AI_CONTEXT, présent rapport).

- Accueil uniquement : H1 à 400, tailles 84/40 px conservées ; les autres H1
  restent à 500. Sélecteur limité à `.rev-page.home-s .home-s-hero h1`.
- Navigation : observateur historique restauré depuis `bd7f9aa`, ghost avant
  la sortie complète du hero accueil, exec après, retour ghost à la remontée.
  État initial ghost sans JS, nettoyage de l’observateur au démontage et état
  réinitialisé par la clé pathname. Les pages intérieures restent ghost, comme
  dans le comportement historique et les tests doctrine. Alias rose canonique
  restauré en retirant la surcharge neutre du correctif A.
- Premier bouton du hero Systems restauré en ghost. Le groupe inférieur garde
  exec puis ghost. Règle Brand OS actualisée dans AGENTS.md.
- Seule adaptation de test ajoutée dans B : `tour1-coherence.spec.ts`, choix
  ghost pour le premier bouton du hero Systems ; toutes les mesures de
  géométrie, destinations, réseau et accessibilité sont conservées.

### Batterie et limites

Baseline : 169/169 tests Node réussis avant B. Après B, la chaîne exacte
`npm run lint && npm test && npm run build && npm run qa:brand:rev01 && npm run qa:claims:rev01 && npm run test:brand-os`
s’arrête à `npm test` : lint réussi, 168/169 tests réussis.

**Contradiction restante, test laissé intact** :
`tests/readability-contract.test.mjs:21-25` impose un bouton toujours ghost,
interdit `IntersectionObserver` et `data-home`, contrairement au correctif B
et à `doctrine-visible.spec.ts:168`. Le handoff n’autorise pas sa modification.
Aucun contournement de cette assertion n’a été ajouté au composant.

Vérifications suivantes lancées séparément :
- `npm run build` : Turbopack bloqué à « Creating an optimized production
  build », interrompu (130), sans modification du script ou de la config.
- `npm run build -- --webpack` : réussi, TypeScript et 62 pages.
- `qa:brand:rev01`, `qa:claims:rev01` : réussis.
- `test:brand-os` après le build Webpack : 24/24 réussis. Une tentative avant
  la fin du build échouait sur les artefacts `.next` absents ; elle ne constitue
  pas la validation finale.
- `git diff --check` : réussi.

Preuve navigateur non acquise : `next start -p 3210` refusé par le sandbox
(`listen EPERM 0.0.0.0:3210`). Rejouer sur l’hôte les tests doctrine,
harmonisation et cohérence FR/EN, notamment avant/après la limite du hero
et après navigation client. Aucun nouveau résultat navigateur ni capture
revendiqué ; les 469/489 cités dans le handoff précèdent B.

Journaux : `/private/tmp/tour1-b-baseline.log`, `tour1-b-battery.log`,
`tour1-b-build.log`, `tour1-b-webpack.log`, `tour1-b-checks.log`.
La consultation Context7 React a échoué (301) ; restauration fondée sur le
code historique local et lecture du guide CSS Next installé.
