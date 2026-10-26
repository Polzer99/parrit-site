# Rapport d'implémentation du site V1, lot 1

Date : 26/10/2026. Dépôt de départ : `2115aab95e6656d5272ac8cf0ae109b3f567418d`,
branche `codex/docs-site-v1-HANDOFF-LOT-1-md`. Aucun commit, push, merge ou déploiement.

## Sources et changements préexistants

AGENTS.md, AI_CONTEXT.md, TRUTH.md et HANDOFF-LOT-1.md lus avant modification.
Le seul changement initial était le dossier non suivi `docs/site-v1/`, contenant
le handoff. Ce fichier est conservé sans modification.

Les trois documents obligatoires et les relevés manquaient dans ce checkout.
Ils ont été retrouvés dans `/Users/paullarmaraud/codex-work/wt-site-v1/docs/site-v1/`,
dont l'audit porte sur le même commit `2115aab`, puis copiés sans modification
ici : plan, spécification V1, note de cadrage, rapports et registre YAML.
Aucun fichier de cet autre worktree n'a été modifié.

Documentation technique : guides `proxy.md` et `page.md` de Next.js 16.3.4 installé,
et documentation Context7 Next.js versionnée 16.2.9 pour les rewrites et matchers.
Le plan fourni tient lieu de plan d'implémentation autorisé.

Écritures : fichiers locaux du dépôt uniquement ; pas de base de données ni de
service métier. Changements réversibles par diff, état initial conservé dans Git,
handoff préexistant intact. Aucun accès secret nécessaire.

## Livré

- Accueil FR/EN : H01, H02, H03, H04, H05, H06, H07, H11 et H12, dans cet ordre.
  Textes français du plan, traduction anglaise, schéma de processus vectoriel,
  références en texte à partir de `public-clients.ts`, un nom par ligne.
- Quatre entrées de navigation, sous-menu Engineering et accordéon mobile natifs.
  Barre dans le flux, CTA visible sur mobile sans panneau superposé. Escape et
  activation des liens ferment le menu mobile ; langue conservant requête et ancre.
- `IntegrationBuildSwitcher` : tous les panneaux en SSR et sans JavaScript ;
  tablist/tab/tabpanel après hydratation, flèches avec bouclage, Home/End,
  sélection, liens ARIA et focus visible. Pas d'animation nécessaire.
- Quatre pages FR/EN : conseil, sprints, engineering et harness. Fiche En bref,
  FAQ, ancres Engineering, sommaire sticky Harness sur desktop, protocole,
  limites et date éditoriale. Au moins sept liens internes distincts par page.
- Locale asymétrique `/fr/conseil-transformation` et `/consulting-transformation`,
  proxy, alternates, OG, sitemap, llms. `/contact` et `/fr/contact` en 301 vers
  les réservations correspondantes ; alias `/fr/consulting-transformation`
  en 301 vers son orthographe française canonique.
- `CaseStudyCard` affiche problème, intervention, système et statut. Le registre
  porte les champs de la spec §6. Source, propriétaire de permission, portée,
  permission accordée et dates calendaires valides sont exigés. Une référence
  retirée ou périmée disparaît entièrement. Aucun logo autorisé. Revue trimestrielle
  au 26/01/2027, après laquelle ces références sont masquées sans renouvellement.
  Les anciennes preuves sans permission explicite échouent aussi au filtre public.
- `EvidenceBadge` est absent du rendu public par défaut. Aucun chiffre de résultat,
  Content Factory, FormIA, Qualiopi ou attribution MIT sur les pages du lot.
- Métadonnées globales et Organization JSON-LD alignés ; doctrine AGENTS/TRUTH et
  entrée AI_CONTEXT actualisées. La propriété et la maintenance sont définies par
  contrat, sans cession universelle revendiquée dans les nouveaux contenus.

Les fichiers des pages `/legal`, `/build-with-you`, `/commission`, du Journal,
`public-clients.ts`, des polices et du paquet Brand OS vendorisé sont inchangés.
Le header/footer commun change sur ces pages comme prévu. Les composants historiques
AgentEsquisse et ProductScene restent dans le dépôt mais quittent l'accueil.

## Principaux fichiers

- `src/app/(rev01)/page.tsx`, les quatre nouveaux répertoires de pages et `layout.tsx`.
- `src/system/components/{RevHeader,RevFooter,CaseStudyCard,EvidenceBadge,IntegrationBuildSwitcher,ProcessDiagram,SiteV1Page}.tsx`.
- `src/system/site-v1-pages.ts`, `src/system/site-v1.css` : contenu structuré et
  adaptation exclusivement fondée sur les tokens existants.
- `src/system/locale.ts`, `src/proxy.ts`, `src/app/sitemap.ts`, `next.config.ts`.
- `src/system/jsonld.ts`, `scripts/generate-llms.mjs`, `public/llms.txt` généré.
- `src/lib/registry/preuves.ts` ; `src/app/not-found.tsx` charge aussi les styles
  nécessaires à la nouvelle navigation sur la page 404.
- `AGENTS.md`, `TRUTH.md`, `AI_CONTEXT.md`, documents du lot et `package.json`.

## Tests ajoutés et adaptations

Nouveaux : `tests/site-v1.test.mjs`, `tests/site-v1-routing.test.mjs`,
`tests/helpers/site-v1-render.mjs`, `tests/site-v1.spec.ts`.

Couverture : rendu réel FR/EN sans réseau, permission refusée/en attente/manquante,
permission retirée au rendu, dates invalides ou périmées, portée et sources,
badge interne masqué, absence de logos/claims/chiffres/tirets, titres et descriptions
uniques, hreflang, slugs asymétriques, paramètres préservés, proxy et robots,
redirections, sept liens internes, panneaux sans JS et interactions clavier.

Les tests six-capacites, conformity-home et product-scene suivent le nouveau
contrat : trois portes et Harness, ordre H01-H12, références en une colonne,
schéma vectoriel et statuts explicites. Les contrôles de l'ancien formulaire
ou des coins du titre ne s'appliquent plus à l'accueil qui ne les rend plus.
Les contrôles de géométrie sont remplacés par ceux des nouveaux éléments.
Les tests d'assets de ProductScene restent actifs.

Les assertions communes sont adaptées dans les suites audit, doctrine, Brand OS,
i18n, alignment et aeration. Les algorithmes et seuils de contraste, taille de
texte, espacement et débordement restent conservés. Les nouveaux parcours sont
ajoutés aux audits Brand OS et aeration. La mention obligatoire exacte
« Demonstration, fictional data. » est exemptée du seul ancien rejet des mentions
illustratives ; les autres textes restent contrôlés. Les tests de capture de
réservation et leur simulation réseau sont conservés.

Le deny-all réseau partagé est inchangé. Les requêtes API des nouveaux tests sont
limitées à un hôte local et n'effectuent aucun suivi de redirection externe.

## Résultats d'exécution

| Commande | Résultat final |
|---|---|
| `npm ci --silent` | Réussi |
| `npm run lint` | Réussi |
| `npx tsc --noEmit` | Réussi |
| `npm test` | 136/136 réussis |
| `npm run qa:brand:rev01` | Réussi |
| `npm run qa:claims:rev01` | Réussi |
| `npm run build -- --webpack` | Réussi, 62/62 pages générées |
| `npm run test:brand-os` | 24/24 réussis, dont rendu serveur compilé FR/EN |
| `git diff --check` | Réussi |
| `npm run qa:network:rev01 -- --list` | 396 tests recensés dans 20 fichiers |
| `npx playwright test tests/site-v1.spec.ts --browser=chromium --max-failures=1` | Bloqué au lancement de Chromium, 59 tests non exécutés après le premier échec d'environnement |
| `npm run build` | Turbopack interrompu après absence de progression en compilation ; non validé |

Référence avant implémentation : installation réussie ; premier `npm test` à
112 réussites et 3 échecs faute de `.next` dans ce checkout neuf ; build Webpack
initial réussi, 58 pages. Il n'y a donc pas de baseline navigateur ni de mesure
comparative de performance. Les résultats ci-dessus sont ceux de l'état final,
après build ; les tests dépendant du build ont été rejoués en séquence.

Avertissements non bloquants observés : module type du fichier TypeScript
public-clients, et avertissement metadataBase déjà présent dans la construction
initiale. La suite de rendu compilé vérifie les OG et l'absence d'URL localhost
sur la 404. Les journaux complets sont dans `/private/tmp/site-v1-*.log`.

## Revue indépendante et corrections

Revue locale en lecture seule par un agent distinct conformément au Harness :
les dates de preuve n'étaient pas assez strictes et H02 héritait de la grille à
deux colonnes. Ces deux constats sont corrigés et couverts par des assertions.
Cette revue ne remplace pas la revue Claude des textes et du diff prévue au handoff.

## Limites et reprise sur l'hôte

Chromium échoue avant navigation :
`bootstrap_check_in ... MachPortRendezvousServer: Permission denied (1100)`.
Aucune capture, validation visuelle, mesure de contraste navigateur, validation
clavier réelle ou preuve de production n'est revendiquée.

Les 50 captures demandées sont prêtes via `scripts/capture-site-v1.sh`, avec
instructions dans `docs/site-v1/captures/README.md`. `npm run qa:site-v1` exécute
la suite du lot ; `npm run qa:network:rev01` exécute la batterie complète.
Sur l'hôte : construire, lancer `npm run start -- -p 3210`, puis exécuter les
suites et les captures. Revoir les textes contre le plan, notamment la traduction
anglaise, et faire valider l'aperçu par Paul avant toute fusion/publication.
Le lot 2 et ses permissions restent hors périmètre.
