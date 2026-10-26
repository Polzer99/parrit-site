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
