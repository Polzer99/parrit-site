# Arbitrages prêts : compte rendu du 05/10/2026

## Reprise : vérification du travail conservé

Cette reprise suit la section « REPRISE (05/10) » de la spec. L'implémentation,
les assets et les tests étaient déjà présents à l'ouverture ; ils ont été
préservés. La relecture du diff contre les sections 1 à 5 n'a identifié aucun
oubli de code. Seul ce compte rendu est complété pendant cette reprise.
Les résultats historiques ci-dessous décrivent la première exécution.

Contrôles effectivement rejoués pendant la reprise :

| Contrôle | Résultat |
|---|---|
| `npm run lint` | Vert |
| `npx tsc --noEmit` | Vert |
| `npm test` | 48/48 verts, aucun test ignoré |
| `npm run test:brand-os` | 12/12 verts, aucun test ignoré |
| `npm run qa:brand:rev01` | Vert |
| `npm run qa:claims:rev01` | Vert |
| `git diff --check` | Vert |
| Fixture photo contre manifeste source | Les quatre SHA256 concordent |
| `public/llms.txt` contre contenu du générateur | Identité exacte |
| Recherche d'entrée Journal prescrite au §4 | Deux occurrences internes seulement, aucun formulaire Journal |
| `npm run qa:network:rev01 -- --list` | 146 tests découverts, dont les 18 cas arbitrages |

Les tests de rendu utilisent le build local préexistant (`BUILD_ID` :
`Y5uN8-TR1Hav_X0UjJ17o`). Aucun build ni serveur n'a été lancé pendant cette
reprise, conformément à la spec. Aucun outil de batterie hors sandbox n'est
exposé dans cette session. Le build frais, l'exécution navigateur et les
18 captures restent donc à faire par la batterie de l'hôte ; la découverte
des tests n'est pas une exécution et ne valide pas la disposition des H1.
Les logs Node, Brand OS et découverte sont dans
`/tmp/parrit-arbitrages-reprise-{test,brand,discovery}.log`.
Aucun commit, push ou déploiement effectué.

## Statut et périmètre

Candidat préparé localement selon `docs/CODEX-SPEC-2026-10-05-parrit-ai-arbitrages-prets-v1.md`.
Les options recommandées AV-3 et DV-01 à DV-06 restent des propositions : ce travail
ne constitue ni leur validation par Paul ni une mise en production. Aucun commit,
push, merge ou déploiement effectué.

- REPO : dépôt courant `handoff-docs-CODEX-SPEC-2026-10-05-parrit-ai-arbitrages-pr`.
- REF / SHA : HEAD et référence locale origin/main identiques à
  `1fc89959f71b367c92840d279ca00eeae4234aef`, base expressément demandée.
- État initial : seul le fichier de spec était non suivi ; il est préservé intact.
- Sources consultées : AGENTS.md, AI_CONTEXT.md, TRUTH.md ; manifeste photo et
  `brand/verbal/{positioning,offers,claims}.json` du dépôt canon, en lecture seule.
  Le canon verbal indique lui-même un statut candidat ; la spec borne les options
  à préparer. Les documents Next installés sur les assets publics et métadonnées
  ont été lus. Aucune nouvelle API de framework introduite.
- Écritures : fichiers locaux de ce dépôt uniquement ; aucune donnée métier,
  aucun système client. Changements réversibles par diff, originaux suivis dans
  HEAD ; la spec préexistante n'est jamais réécrite. Aucun secret lu ou ajouté.
- Plan exécuté : référence avant modification, textes et assets, tests ciblés,
  relecture indépendante, vérification du candidat. Corrections
  ciblées ; arrêt sur les blocages d'environnement reproductibles. Build
  Turbopack candidat borné à 100 secondes. Aucun appel à un modèle externe.

## Modifications

- `public/brand/founder/` : exactement les quatre fichiers DSC00629 340/680 en
  AVIF/WebP, copiés octet pour octet. Aucun recadrage, génération ni recompression.
- `src/app/(rev01)/page.tsx` : photo dans une figure avant le texte ; sources
  AVIF puis WebP, tailles et attributs prescrits, alternative localisée. La
  légende reste au début de `.home-s-maison-copy`. Nouveaux kicker, H1,
  sous-titre et métadonnées FR/EN.
- `src/app/(rev01)/rev01.css` : grille 340 px + texte au-dessus de 859 px ;
  portrait au-dessus du texte en dessous, largeur limitée à 340 px, hauteur
  automatique. H1 sur la largeur disponible, `text-wrap: balance` conservé,
  aucun retour forcé. La fin de phrase reste insécable ; le H1 français sur
  petit écran emploie le pas existant `--d-s`, sans ajout/modification de token.
  L'absence de mots isolés reste à confirmer dans Chromium.
- `src/app/(rev01)/layout.tsx`, `src/system/jsonld.ts`,
  `src/system/components/{RevFooter,CalInline,Opening}.tsx`,
  `src/app/(rev01)/sketch/[id]/page.tsx`, `src/app/opengraph-image.tsx` :
  remplacements du tableau §2, détaillés ci-dessous. Opening reste non rendu.
- `scripts/generate-llms.mjs` et `public/llms.txt` : nouvelle présentation et
  propriété, retrait de la promesse de maintenance incluse. Le fichier public
  est régénéré, pas corrigé seul. Les preuves chiffrées restent identiques,
  seuls les mots « operating system » deviennent « system » dans ces preuves.
- `src/app/llms-full.txt/route.ts` : aucun changement nécessaire, car la route
  reprend déjà le préambule de `public/llms.txt`. Test réel du rendu ajouté.
- `TRUTH.md` : positionnement, propriété et règle des prix corrigés selon §3.
- `src/app/(rev01)/legal/page.tsx` : seul le formulaire prototype est mentionné
  en FR/EN. Le scan demandé retourne uniquement `src/lib/server/interets.ts:27`
  (valeur encore admise côté serveur) et `src/system/journal.ts:8` (répertoire
  de contenu), aucun point d'entrée d'interface envoyant `interet: "journal"`.
- `package.json` : ajout de `npm test` pour tous les tests Node ; ajout de la
  nouvelle spec navigateur à la batterie réseau.
- `AI_CONTEXT.md` : état du candidat et pointeur vers ce rapport.

Prix, durées, destinations des CTA, formulaires, API, PostHog, paquet Brand OS,
polices, articles et routes conservés. DV-04 a et DV-05 a n'appellent aucun
changement sur ce site. Aucune assertion réseau ou contraste n'est affaiblie.

## Tableau §2 : sources avant / après

Numéros avant : `HEAD@1fc8995`. Numéros après : fichiers du candidat.
Les entrées partageant plusieurs fichiers ou langues sont dépliées ; les champs
`before`, `frame` et `after` forment ensemble le H1, espaces normalisés au rendu.

| Fichier:ligne avant → après | Avant | Après |
|---|---|---|
| `src/app/(rev01)/page.tsx:15` → `src/app/(rev01)/page.tsx:15` | Parrit / Company operating systems | Parrit / Data and AI |
| `src/app/(rev01)/page.tsx:16` → `src/app/(rev01)/page.tsx:16` | before: "The AI system your company",<br>      frame: "operates",<br>      after: "on.", | before: "We turn operational problems into",<br>      frame: "systems",<br>      after: "that work.", |
| `src/app/(rev01)/page.tsx:102` → `src/app/(rev01)/page.tsx:102` | Parrit / Systèmes d'exploitation d'entreprise | Parrit / Données et IA |
| `src/app/(rev01)/page.tsx:103` → `src/app/(rev01)/page.tsx:103` | before: "Le système IA qui fait tourner votre",<br>      frame: "entreprise.", | before: "Nous transformons des problèmes opérationnels en",<br>      frame: "systèmes", |
| `src/app/(rev01)/page.tsx:105` → `src/app/(rev01)/page.tsx:105` | after: "", | after: "qui fonctionnent.", |
| `src/app/(rev01)/page.tsx:19` → `src/app/(rev01)/page.tsx:19` | The invoice that drags, the report rebuilt by hand every week: entry points we push as far as the operation demands. We build inside your systems, on your data, until it goes live. | Parrit.ai is a data and AI company. The invoice that drags, the report rebuilt by hand every week: we start from your data and build tools you own. |
| `src/app/(rev01)/page.tsx:106` → `src/app/(rev01)/page.tsx:106` | La facture qui traîne, le rapport refait à la main chaque semaine : des points de départ que nous poussons aussi loin que l'opération l'exige. Nous construisons dans vos systèmes, sur vos données, jusqu'à la mise en service. | Parrit.ai est une maison de données et d'IA. La facture qui traîne, le rapport refait à la main chaque semaine : nous partons de vos données et construisons des outils qui vous appartiennent. |
| `src/app/(rev01)/page.tsx:192` → `src/app/(rev01)/page.tsx:192` | Parrit.ai · Systèmes d'exploitation d'entreprise | Parrit.ai · Données et IA, des outils qui vous appartiennent |
| `src/app/(rev01)/page.tsx:195` → `src/app/(rev01)/page.tsx:195` | Parrit.ai construit des systèmes IA depuis trois ans, chez des grands comptes, des PME et des ETI : votre entreprise, examinée, reconstruite opération par opération, à vous pour de bon. | Parrit.ai relie vos sources, remet vos données à plat et construit dessus des outils qui vous appartiennent : le code, les données et la documentation. |
| `src/app/(rev01)/page.tsx:193` → `src/app/(rev01)/page.tsx:193` | Parrit.ai · Company Operating Systems | Parrit.ai · Data and AI, tools you own |
| `src/app/(rev01)/page.tsx:196` → `src/app/(rev01)/page.tsx:196` | Parrit.ai examines how a company operates, builds its first production system and compounds it as owned infrastructure. | Parrit.ai connects your sources, cleans up your data and builds tools on top of it that you own: the code, the data and the documentation. |
| `src/app/(rev01)/layout.tsx:38` → `src/app/(rev01)/layout.tsx:38` | Parrit.ai · Company Operating Systems | Parrit.ai · Data and AI, tools you own |
| `src/app/(rev01)/layout.tsx:42` → `src/app/(rev01)/layout.tsx:42` | Parrit.ai examines how a company operates, builds its first production system and compounds it as owned infrastructure. | Parrit.ai connects your sources, cleans up your data and builds tools on top of it that you own: the code, the data and the documentation. |
| `src/system/jsonld.ts:11` → `src/system/jsonld.ts:11` | Parrit.ai designs and builds company operating systems: commissioned, not subscribed. Based in France; operating internationally in English and French. | Parrit.ai is a data and AI company: it turns a company's data into software tools the company owns. Based in France; working in English and French. |
| `src/system/components/RevFooter.tsx:16` → `src/system/components/RevFooter.tsx:16` | Commissioned, not subscribed | What we build belongs to you |
| `src/system/components/RevFooter.tsx:28` → `src/system/components/RevFooter.tsx:28` | Une commande, pas un abonnement | Ce que nous construisons vous appartient |
| `src/system/components/Opening.tsx:22` → `src/system/components/Opening.tsx:22` | Commissioned, not subscribed | What we build belongs to you |
| `src/system/components/Opening.tsx:36` → `src/system/components/Opening.tsx:36` | Une commande, pas un abonnement | Ce que nous construisons vous appartient |
| `src/system/components/CalInline.tsx:33` → `src/system/components/CalInline.tsx:33` | COMMISSIONED, NOT SUBSCRIBED | WHAT WE BUILD BELONGS TO YOU |
| `src/system/components/CalInline.tsx:26` → `src/system/components/CalInline.tsx:26` | UNE COMMANDE, PAS UN ABONNEMENT | CE QUE NOUS CONSTRUISONS VOUS APPARTIENT |
| `src/app/(rev01)/sketch/[id]/page.tsx:160` → `src/app/(rev01)/sketch/[id]/page.tsx:160` | COMMISSIONED, NOT SUBSCRIBED | WHAT WE BUILD BELONGS TO YOU |
| `src/app/(rev01)/sketch/[id]/page.tsx:174` → `src/app/(rev01)/sketch/[id]/page.tsx:174` | UNE COMMANDE, PAS UN ABONNEMENT | CE QUE NOUS CONSTRUISONS VOUS APPARTIENT |
| `src/app/opengraph-image.tsx:72` → `src/app/opengraph-image.tsx:72` | COMMISSIONED, NOT SUBSCRIBED | WHAT WE BUILD BELONGS TO YOU |
| `src/app/opengraph-image.tsx:6` → `src/app/opengraph-image.tsx:6` | Parrit.ai · Company Operating Systems | PARRIT.AI · DATA AND AI |
| `src/app/opengraph-image.tsx:44` → `src/app/opengraph-image.tsx:44` | PARRIT.AI · COMPANY OPERATING SYSTEMS | PARRIT.AI · DATA AND AI |
| `src/system/components/Opening.tsx:21` → `src/system/components/Opening.tsx:21` | Parrit.ai designs and builds<br />company operating systems. | Parrit.ai turns operational problems<br />into systems that work. |
| `src/system/components/Opening.tsx:35` → `src/system/components/Opening.tsx:35` | Parrit.ai conçoit et construit<br />des systèmes d'exploitation d'entreprise. | Parrit.ai transforme des problèmes opérationnels<br />en systèmes qui fonctionnent. |
| `src/app/(rev01)/sketch/[id]/page.tsx:14` → `src/app/(rev01)/sketch/[id]/page.tsx:14` | Operating System · Sketch | System · Sketch |
| `src/app/(rev01)/legal/page.tsx:15` → `src/app/(rev01)/legal/page.tsx:15` | the prototype or journal forms | the prototype form |
| `src/app/(rev01)/legal/page.tsx:20` → `src/app/(rev01)/legal/page.tsx:20` | les formulaires prototype ou journal | le formulaire prototype |

## Tests ajoutés et ajustés

- `tests/founder-photos.test.mjs` et `tests/fixtures/founder-photos.json` :
  répertoire limité aux quatre fichiers autorisés et SHA256 figés du manifeste.
  Le chemin absolu du manifeste est conservé en commentaire dans le test qui
  charge la fixture JSON (JSON ne permet pas les commentaires).
- `tests/arbitrages.spec.ts` : 18 cas, six routes FR/EN à 375/768/1440 px ;
  captures dans le dossier demandé, H1 exact et comptage par ligne avec Range
  après chargement des fontes ; photo visible, disposition, alt, sources,
  attributs, quatre réponses HTTP locales et leurs empreintes ; mentions
  légales corrigées et absence de débordement. Deny-all partagé et service
  workers bloqués ; aucun envoi de formulaire.
- `tests/brand-os-render.test.mjs` : intégration sur le serveur compilé sans
  socket et avec interdiction de réseau ; H1, title, description, Open Graph,
  Organization, footer, figure, mentions légales et préambule llms-full.
  L'interdit sur l'ancien asset `founder-portrait` est conservé.
- `tests/conformity-{home,i18n}.spec.ts` : attendus exacts des nouveaux H1 et
  sous-titres. Les autres assertions sont conservées.
- `tests/system-card.test.mjs` : deux attendus anciens ont été découverts par
  l'activation de la batterie Node complète. Échec reproduit isolément alors
  que test et composant étaient encore identiques à HEAD. Les attendus sont
  alignés sur le contrat déjà livré dans `28fae7d` et explicitement exigé par
  `docs/CODEX-SPEC-2026-09-20-systems-editorial-corrections.md`, Remplacement 1 :
  « Anciens points d'écriture recensés » / « Legacy write points on record ».
  Aucune modification de RegistrySnapshot, ni suppression d'assertion.

## Expressions restantes et raisons

Scan insensible à la casse de `src/`, `public/`, `content/journal/`, du générateur
et de TRUTH.md. Les documents historiques et specs ne sont pas une surface
publiée ; leurs citations d'anciennes formulations sont conservées comme preuves.

| Fichier:ligne | Expression restante | Raison de conservation |
|---|---|---|
| `TRUTH.md:26` | - Journal : pas de capture d'abonnement (retirée le 14/09 : aucun envoi n'existait). | Abonnement Journal retiré ou ancien prix expressément interdit, pas une offre courante. |
| `TRUTH.md:57` | 1. **Prix** : la home affiche l'ancrage de Build With You (à partir de 3 200 € HT, au forfait) ; le sur-mesure est sur devis. Interdit : ré-afficher les anciens prix fermes (Sprint 5 000 €, Abonnement 99 €/mois, Évolution 250 €/h) — ils sont retirés. Pas de devis personnalisé hors propale privée, pas de promesse de ROI garanti. « Sur devis » reste la formulation du sur-mesure ; Build With You affiche son ancrage public. | Abonnement Journal retiré ou ancien prix expressément interdit, pas une offre courante. |
| `TRUTH.md:70` | - Capture lead : `src/system/components/QuickCapture.tsx` poste vers `/api/interet` ; `idee` rejoint `metadata.interets_declares[].idee_prototype`. `AgentEsquisse.tsx` fonctionne sans backend ni LLM. Le Journal n'a pas de capture d'abonnement. La prise de rendez-vous passe par Cal.com dans `CalInline.tsx` sur `/commission`. | Abonnement Journal retiré ou ancien prix expressément interdit, pas une offre courante. |
| `content/journal/what-is-a-company-operating-system.mdx:2` | operating system / company operating systems | Article éditorial, explicitement hors lot ; également diffusé par llms-full. |
| `content/journal/what-is-a-company-operating-system.mdx:4` | operating system / company operating systems | Article éditorial, explicitement hors lot ; également diffusé par llms-full. |
| `content/journal/what-is-a-company-operating-system.mdx:8` | operating system / company operating systems | Article éditorial, explicitement hors lot ; également diffusé par llms-full. |
| `content/journal/what-is-a-company-operating-system.mdx:14` | operating system / company operating systems | Article éditorial, explicitement hors lot ; également diffusé par llms-full. |
| `content/journal/what-is-a-company-operating-system.mdx:16` | operating system / company operating systems | Article éditorial, explicitement hors lot ; également diffusé par llms-full. |
| `content/journal/what-is-a-company-operating-system.mdx:20` | operating system / company operating systems | Article éditorial, explicitement hors lot ; également diffusé par llms-full. |
| `content/journal/what-is-a-company-operating-system.mdx:22` | operating system / company operating systems | Article éditorial, explicitement hors lot ; également diffusé par llms-full. |
| `content/journal/what-is-a-company-operating-system.mdx:24` | operating system / company operating systems | Article éditorial, explicitement hors lot ; également diffusé par llms-full. |
| `content/journal/what-is-a-company-operating-system.mdx:40` | operating system / company operating systems | Article éditorial, explicitement hors lot ; également diffusé par llms-full. |
| `content/journal/what-is-a-company-operating-system.mdx:44` | operating system / company operating systems | Article éditorial, explicitement hors lot ; également diffusé par llms-full. |
| `content/journal/permission-layer-for-coding-agents.mdx:32` | operating system / company operating systems | Article éditorial, explicitement hors lot ; également diffusé par llms-full. |
| `src/app/(rev01)/manufacture/page.tsx:11` | "metaDescription": "How Parrit.ai builds a company operating system, from Examination to Compounding.", | Copy Manufacture / phase de capitalisation hors tableau §2 ; occurrence signalée, non réécrite hors mandat. |
| `content/journal/what-is-parrit-ai.mdx:4` | operating system / company operating systems | Article éditorial, explicitement hors lot ; également diffusé par llms-full. |
| `content/journal/what-is-parrit-ai.mdx:8` | operating system / company operating systems | Article éditorial, explicitement hors lot ; également diffusé par llms-full. |
| `src/lib/server/interets.ts:15` | * esquisse un mini-prototype d'operating system pour l'entreprise. La carte | Commentaire interne du traitement serveur ; API hors lot. |
| `src/system/commissioning.ts:14` | title: "Each capability joins the operating system.", | Copy Manufacture / phase de capitalisation hors tableau §2 ; occurrence signalée, non réécrite hors mandat. |

L'article **« What is a company operating system? »**
(`content/journal/what-is-a-company-operating-system.mdx`) n'est pas modifié.
`what-is-parrit-ai.mdx` conserve aussi son ancienne présentation : article hors
lot. L'expression dans `permission-layer-for-coding-agents.mdx` désigne le
système d'exploitation informatique, pas le positionnement commercial.

## Vérifications et limites

| Commande | Référence avant modification | Candidat final |
|---|---|---|
| `npm ci --offline --ignore-scripts` | 462 paquets installés depuis le cache, 0 vulnérabilité signalée | Dépendances inchangées |
| `npm run lint` | Vert | Vert |
| `npm run build` (Turbopack) | Stagne en compilation, interrompu | Stagne au même endroit ; arrêt borné à 100 s, code 124 |
| `npm run build -- --webpack` | Vert | Vert : compilation, typage, génération et tracing terminés |
| `npm test` | Script absent | **48/48 verts** après le build Webpack |
| `npm run test:brand-os` | **12/12 verts** après le build Webpack | **12/12 verts** après le build Webpack |
| `npx tsc --noEmit` | Non mesuré séparément | Vert |
| `npm run qa:brand:rev01` | Vert | Vert |
| `npm run qa:claims:rev01` | Vert | Vert |
| Découverte Playwright | Batterie préexistante de 128 cas | **146 cas**, dont 18 nouveaux, 14 fichiers |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | Essai ciblé : Chromium ne démarre pas | Même refus au lancement ; 1 échec d'environnement, 145 non exécutés |
| `git diff --check` | Pas de modification suivie initiale | Vert |

Aucun changement du bundler par défaut ni de la CI. Les tests Brand OS exécutent
réellement les rendus OG PNG et le rendu serveur FR/EN, sans requêtes externes.
L'avertissement générique Next `metadataBase` existait déjà dans le build de
référence ; les métadonnées publiques testées restent conformes.

Relecture indépendante finale : aucun blocage de code restant ; 10/10 tests
ciblés (photos, SystemCard et rendu compilé) rejoués avec succès. Elle a identifié
une taille mobile non canonique, corrigée en réutilisant `--d-s`, sans modifier
le contrôle de l'échelle fermée. Une estimation des largeurs de mots depuis les
fontes locales a guidé l'ajustement ; elle ne remplace pas la mesure Chromium.

Les logs de la session sont sous `/tmp/parrit-arbitrages/` : `baseline-*.log`,
`candidate-{build,webpack,lint,tsc,test,brand,qa-brand,claims,network,discovery}.log`.

**Captures : non produites.** Chromium est bloqué avant navigation par
`bootstrap_check_in ... MachPortRendezvousServer: Permission denied (1100)`.
Aucun contournement du sandbox n'a été tenté ; aucun serveur n'a été lancé ici,
conformément à AI_CONTEXT.md. Les 18 captures, le contrôle des mots isolés,
la disposition photo/texte, les empreintes HTTP et le contraste en navigateur
restent à vérifier sur l'hôte. Le dossier
`docs/qa/2026-10-05-arbitrages/README.md` donne les commandes et noms attendus.
Ne pas déclarer cette validation visuelle acquise avant cette exécution.

Preuve de production : non recherchée, car déploiement interdit. La preuve
visuelle du candidat exige l'exécution sur l'hôte et la lecture des captures.
La préparation de ces options ne dispense pas de la décision de Paul avant merge.
