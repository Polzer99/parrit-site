# Boutons par intention et finitions — rapport du 08/11/2026

## Correctif 2 après tests hôte, 08/11/2026

Implémentation existante conservée et amendement traité. Aucun commit, push ni
déploiement. La validation navigateur reste bloquée par le sandbox.

### Sources, périmètre et preuve

- Référence explicitement demandée : dépôt courant, baseline
  `2b602264911bfb8943995a40887694673e37c84a`.
- Avant modification : AGENTS, AI_CONTEXT, TRUTH, CLAUDE, spec amendée et doctrine
  Recursive Agent Harness consultés. Plan : baseline, régression reproduite,
  corrections ciblées, revue indépendante et même batterie après correction.
- Documentation : Next installé 16.3.4 (`redirects.md`, `use-search-params.md`),
  recoupé avec Context7 Next 16.2.9. Aucun changement de dépendance.
- Seul changement initial : amendement local de la spec. Son SHA256 reste
  `961a9c323a520b7bfcd7b34e2326f16376f5cedb49754d91d56093865150be80`.
- Écritures : dépôt local, code/tests/documentation uniquement, réversibles par
  retrait du diff de cette passe ; baseline Git comme sauvegarde. Zéro ligne métier.
- Boucle bornée : correction initiale puis ajustement de compilation/alignement ;
  arrêt des tentatives navigateur dès le blocage système confirmé.

**Fait vérifié :** les règles actuelles de `next.config.ts` produisent un seul
308 vers l'article anglais avec `source`, `lang` et les UTM conservés dans le
moteur de test de la version Next installée, sans socket ni requête réseau.

**Défaut reproduit :** la bascule de langue du même parcours avait un `href`
SSR sans query. Avant hydratation, cliquer ce lien supprimait `source` et les
UTM ; son gestionnaire JavaScript, lui, les conservait. Les deux nouveaux tests
SSR FR/EN échouent avant correction puis réussissent. Le lien natif conserve
désormais les paramètres, y compris valeurs répétées et encodées ; seul `lang`
est supprimé, conformément au comportement existant de la bascule.

**Limite :** le relevé hôte fourni dans la spec ne donne pas l'assertion exacte
qui échoue au sein du test. La perte sur la bascule est prouvée ; l'attribution
de l'échec hôte à cette étape reste à confirmer. La redirection configurée
n'est pas modifiée sans défaut reproduit.

### Fichiers modifiés et tests

| Fichier | Modification |
|---|---|
| `src/system/single-page.css` | Échelle 18/19 px réservée à `exec` ; `ghost` retrouve `--t-s` à 16 px. Rembourrage vertical total inchangé, compensation de 1 px issue du jeton pour le libellé secondaire ; alignement baseline conservé. |
| `src/system/components/LanguageLink.tsx` | Query conservée dans le lien dès le SSR avec `useSearchParams`. Suspense local avec lien de repli pour les pages d'erreur statiques ; cookie et traduction des ancres au clic conservés. |
| `tests/journal-locale.test.mjs` | Quatre tests Node ajoutés : saut 308 Next avec query et alias renommé ; liens SSR FR/EN avec paramètres répétés/encodés ; lien disponible pendant le prérendu statique sans query. |
| `tests/intentions.spec.ts` | Quatre cas ajoutés à 375 px (FR/EN, avec/sans JS), tailles 16 et 18/19 contrôlées ; mesure de la baseline ajoutée aux cas ordinateur. Seuils existants inchangés. |
| `tests/conformity-i18n.spec.ts` | Deux parcours sans JS : saut 308 puis lien FR/EN avec source/UTM conservés. Le helper de bascule vérifie désormais le href complet avec query, au lieu du seul pathname ; toutes les assertions d'arrivée restent présentes. |
| `tests/langue-metier.test.mjs`, `tests/single-page.test.mjs` | Mock du nouveau hook de lecture de query, sans modification des assertions. |
| `AI_CONTEXT.md`, ce rapport | État courant, diagnostic et limites de validation. |

`AGENTS.md` et `TRUTH.md` portent déjà la décision de Paul du 08/11/2026 et
restent inchangés. La durée de 15 minutes, la fixture et le contrôle des
affirmations restent inchangés. Serveur du formulaire, attribution des intentions,
permissions/logos, registre du Journal, Cal.com, métadonnées, sitemap et `llms.txt`
restent inchangés. Aucun PNG suivi ni copie de spec dans `tmp/` modifiés.

### Résultats exécutés

| Vérification | Baseline | Candidat final |
|---|---|---|
| `npm ci --silent` | Réussi | Même installation, dépendances inchangées |
| `npm run lint` | Réussi | Réussi |
| `npm run build -- --webpack` | Réussi | Réussi |
| `npm test` | 181/181 | 185/185 |
| Régressions SSR FR/EN nouvelles | 2 échecs attendus | Réussies |
| `npx tsc --noEmit` | — | Réussi |
| `npm run qa:brand:rev01` | — | Réussi |
| `npm run qa:claims:rev01` | — | Réussi |
| `npm run test:brand-os` | — | 19/19 |
| `npm run qa:network:rev01 -- --list` | — | 454 tests, 13 fichiers |
| `CTA_CAPTURE=1 npm run qa:network:rev01 -- --workers=1 --max-failures=1` | — | 1 échec de lancement, 453 non exécutés |
| `git diff --check` | — | Réussi |

La première compilation du candidat a détecté `useSearchParams` sans Suspense
sur la 404 statique ; le composant a été corrigé puis la batterie rejouée.
La revue indépendante a identifié le décalage des bords induit par les tailles
19/16 px malgré une baseline commune. Compensation ajoutée sans changer la
hauteur totale, puis revue finale favorable. Le calcul des métriques ne remplace
pas une validation visuelle. Avertissements préexistants : `metadataBase` et
type de module Node.

Logs locaux : `/tmp/cta-fix2-install.log`, `/tmp/cta-fix2-{baseline,final}-{lint,build,test}.log`,
`/tmp/cta-fix2-{red,green,types,brand,claims,brand-os}.log`,
`/tmp/cta-fix2-{server,playwright-list,playwright-run}.log`.

### Blocage et reprise hôte

Serveur : `listen EPERM 127.0.0.1:3210`. Chromium : `MachPortRendezvous`,
`Permission denied`, `SIGTRAP` avant navigation. Aucun contournement tenté.
Les 454 tests navigateur ne sont donc pas validés ; les captures FR/EN
1440×800 et 390×844, la géométrie et la stabilité/CLS restent **UNKNOWN**.
Aucune preuve production revendiquée, déploiement exclu du mandat.

Claude doit reprendre sur l'hôte, serveur lancé avec
`npm run start -- --hostname 127.0.0.1 -p 3210`, puis :

```sh
npm run qa:network:rev01
CTA_CAPTURE=1 npx playwright test tests/intentions.spec.ts --browser=chromium
```

Captures hors dépôt sous `/tmp/cta-intentions-captures`, à produire et inspecter.
Les sections suivantes décrivent les passes précédentes, pas cette exécution.

## Correctif après PR #365, 08/11/2026

Correctif implémenté conformément à la spec amendée. La première passe est
conservée, avec une durée de **15 minutes** et le contrôle des durées restauré.
Aucun commit, push ou déploiement effectué.

### Sources et périmètre

- Référence demandée : checkout courant `afd758232cb015bdd172947185252120982f0761`.
- Source fonctionnelle : section « Correctif après la première passe » de la spec ;
  la durée provient du relevé Cal.com fourni dans cette décision, sans nouvelle
  consultation ni modification de Cal.com.
- Avant modification : lecture de `AI_CONTEXT.md`, `AGENTS.md`, `TRUTH.md`,
  `CLAUDE.md`, de la spec et de la doctrine Recursive Agent Harness.
- Guide Next local `use-client.md` consulté ; aucun changement d’API ou de dépendance.
- Seul changement préexistant : amendement local de la spec, conservé à l’identique.
- Plan exécuté : baseline, tests de régression, correction ciblée, revue indépendante,
  même batterie et tentative navigateur. Une itération ; arrêt sur blocage système.
- Écritures : dépôt local uniquement, réversibles par retrait du diff de cette passe ;
  sauvegarde des fichiers suivis dans la référence ci-dessus. Zéro ligne métier.

### Fichiers modifiés dans cette passe

| Fichier | Modification |
|---|---|
| `src/system/components/QuickCapture.tsx` | Deux phrases FR/EN : 30 → 15 minutes. |
| `scripts/false-claims-check.mjs` | Suppression de `approvedContactCopy`, de son commentaire erroné et de l’exemption ; fichier identique à `f124fae`, main avant la première passe. |
| `tests/fixtures/contact-expectation.json` | Paragraphes attendus à 15 minutes, également utilisés par les audits SSR et navigateur existants. |
| `tests/intentions.test.mjs` | Attentes SSR corrigées ; ancien test d’exemption remplacé par deux tests FR/EN acceptant 15 minutes et rejetant l’ancien paragraphe exact ou un ajout à 30 minutes, dans QuickCapture et ailleurs. |
| `tests/intentions.spec.ts` | Attente de 15 minutes sous l’envoi, FR/EN avec et sans JavaScript. |
| `AI_CONTEXT.md`, ce rapport | Correctif documenté ; ancienne exemption explicitement signalée comme supprimée. |

`AGENTS.md` et `TRUTH.md` contiennent déjà la décision de Paul du 08/11/2026
sur les boutons ; ils sont conservés. Tous les autres fichiers de la première
passe sont inchangés, notamment CSS, attribution, serveur du formulaire, Cal.com,
Journal, permissions, deny-all et seuils de géométrie/stabilité.
Les audits `noOffer` restent limités au paragraphe exact désormais à 15 minutes ;
ils sont distincts du contrôle `call duration`, restauré sans exemption nouvelle.
Aucun PNG suivi ni copie de la spec dans `tmp/` modifiés.

### Résultats exécutés

| Vérification | Baseline `afd7582` | Candidat corrigé |
|---|---|---|
| `npm ci --silent` | Réussi | Réussi |
| `npm run lint` | Réussi | Réussi |
| `npm run build -- --webpack` | Réussi | Réussi |
| `npm test` | 180/180 | 181/181 |
| `node --test tests/intentions.test.mjs` avec nouvelles attentes | 9 réussis, 4 échecs attendus avant correction | 13/13 ; également rejoués par la revue indépendante |
| `npx tsc --noEmit` | — | Réussi |
| `npm run qa:brand:rev01` | — | Réussi |
| `npm run qa:claims:rev01` | — | Réussi |
| `npm run test:brand-os` | — | 19/19 |
| `npm run qa:network:rev01 -- --list` | — | 448 tests, 13 fichiers |
| `CTA_CAPTURE=1 npm run qa:network:rev01 -- --workers=1 --max-failures=1` | — | Bloqué au lancement Chromium, 1 échec avant navigation, 447 non exécutés |
| `git diff --check` | — | Réussi |

La régression est démontrée avant/après : deux échecs SSR détectaient l’ancienne
durée et deux échecs du contrôle détectaient l’exemption de l’ancien paragraphe.
Revue indépendante du diff : aucun défaut concret relevé.
Avertissements préexistants dans les tests : type de module Node et `metadataBase`.
Logs : `/tmp/cta-correctif-{baseline,final}-*.log`,
`/tmp/cta-correctif-{red,green}.log`, `/tmp/cta-correctif-playwright-{list,run}.log`.

### Blocages et preuve restante

Serveur : `listen EPERM 127.0.0.1:3210`. Chromium : `MachPortRendezvous`,
`Permission denied`, `SIGTRAP`. Aucun contournement des restrictions.
Captures FR/EN 1440×800 et 390×844, géométrie réelle et CLS restent **UNKNOWN**.
Les commandes de reprise sur l’hôte figurent en fin de rapport. Aucune preuve
production revendiquée ; déploiement exclu du mandat.

## Historique de la première passe (avant le correctif de durée)

Cette section décrit la passe `afd7582`. L’exception au contrôle des durées et
la mention d’une approbation de Paul étaient erronées et sont supprimées par
le correctif décrit en tête de ce rapport.

Implémentation réalisée. Validation statique, serveur compilé et tests Node réussis.
Validation navigateur et captures non acquises : le sandbox interdit le serveur
local et le lancement de Chromium. Aucun commit, push ou déploiement.

## Périmètre et sources

- Source fonctionnelle : `docs/CODEX-SPEC-2026-11-08-cta-par-intention-et-finitions.md`, décision de Paul du 08/11/2026.
- Dépôt / référence : checkout demandé, branche `codex/docs-CODEX-SPEC-2026-11-08-cta-par-intention-et-fi`, baseline `f124fae865cd67d3a2cf3e9a12536f91aa46a867`.
- Instructions lues avant modification : `AI_CONTEXT.md`, `AGENTS.md`, `TRUTH.md`, doctrine `RECURSIVE-AGENT-HARNESS.md`.
- Documentation : guides locaux de Next 16.3.4 sur History API et `searchParams` asynchrone ; Context7 Next 16.2.9 pour l'intégration de `pushState` au routeur.
- État initial : seule la spec était non suivie ; elle est conservée sans modification.
- Écritures : fichiers locaux du dépôt, réversibles ; zéro ligne métier, aucun service client modifié. Retour arrière limité au diff de cette passe, sans toucher la spec préexistante. Référence Git disponible pour les fichiers suivis.
- Boucle : baseline, implémentation, revue indépendante, corrections ciblées, mêmes vérifications. Arrêt des tentatives navigateur après constat des restrictions de l'environnement.

## Modifications

| Fichiers | Résultat |
|---|---|
| `src/lib/registry/cta.ts` | `avecSource` place la source avant l'ancre, remplace une source précédente et conserve les autres paramètres. |
| `src/system/components/ContactIntentLink.tsx` (nouveau) | Vrai lien localisé dès le SSR. Clic simple sur l'accueil : historique, défilement et focus du contact sans rechargement ; clic modifié conservé. |
| `src/app/(rev01)/page.tsx`, `src/system/components/SinglePage.tsx`, `src/system/single-page-copy.ts` | Deux actions dans le hero ; une action par étape. Paramètres d'arrivée transmis aux liens SSR, y compris UTM personnalisés et valeurs multiples. |
| `src/system/components/QuickCapture.tsx` | Paragraphe FR/EN demandé sous l'envoi, uniquement pour la variante contact. Payload et chemin serveur inchangés. |
| `src/system/single-page.css` | Boutons du hero alignés, colonne gauche portée à 512 px sur ordinateur pour accueillir les deux largeurs intrinsèques ; boutons empilés sur téléphone. Sous-grille des étapes, filets et survol. Références en boucle CSS de 28 s, raccord adapté au gap, pause survol/focus ; logos centrés et statiques en mouvement réduit. Survol du bouton secondaire adapté au fond sombre. |
| `src/system/journal-themes.ts`, `src/app/(rev01)/journal/themes/[theme]/page.tsx` | Registre des quatre thèmes et appartenances existantes centralisé, sans modifier leurs articles ni la date partagée du sitemap. |
| `src/system/journal-reading.ts` (nouveau), `src/system/journal.ts` | Temps estimé depuis le corps de l'article, à 200 mots/minute, arrondi au plus proche, minimum 1 ; marqueurs Markdown et destinations des liens exclus. |
| `src/app/(rev01)/journal/page.tsx`, `src/app/(rev01)/rev01.css` | Thème(s) réellement associés et temps de lecture localisés ; aucune catégorie inventée. Une seule action par carte ; deux colonnes à partir de 1100 px. |
| `scripts/false-claims-check.mjs` | Exception introduite lors de cette passe, puis supprimée par le correctif : l’approbation attribuée à Paul était erronée. |
| `package.json` | Nouvelle suite Playwright ajoutée au gate réseau existant. |
| `AGENTS.md`, `TRUTH.md`, `AI_CONTEXT.md` | Décision du 08/11 documentée, nouveaux contrats et limites de preuve explicités. |

Les titres, sous-titre, métadonnées, données structurées, articles, sitemap,
`public/llms.txt`, polices, couleurs canoniques, permissions/logos clients,
Cal.com et serveur du formulaire sont conservés. Le prébuild régénère
`llms.txt` à l'identique. Aucun PNG suivi n'a été modifié.

## Tests

- **12 tests Node ajoutés** dans `tests/intentions.test.mjs` : utilitaire source/ancre/UTM, texte de lecture et arrondi, résumés issus du corpus réel, appartenances des thèmes, rendu FR/EN, clic normal/modifié, liens SSR avec paramètres et tests adversariaux du gate de durée.
- **30 tests Playwright ajoutés** dans `tests/intentions.spec.ts` : cinq intentions FR/EN jusqu'au POST local mocké, document et saisie conservés ; géométrie FR/EN avec/sans JS ; alignement et destinations ; mouvement réduit/pause ; colonnes du Journal à 1099/1100 px ; captures optionnelles aux formats demandés.
- `tests/fixtures/contact-expectation.json` fixe les deux paragraphes approuvés pour les contrôles.
- `tests/langue-metier.test.mjs` et `tests/single-page.spec.ts` : l'ancien href `#contact` devient la destination localisée avec source. Aucun seuil de géométrie changé.
- `tests/brand-os-render.test.mjs` et `tests/anti-slop-copy.spec.ts` : exception exacte et limitée au paragraphe de contact, conservation des interdictions ailleurs, y compris métadonnées et attributs. Le contrôle de liste du Journal accepte sa classe d'index additionnelle sans retirer les assertions sur les articles.
- `tests/stabilite.spec.ts`, deny-all réseau et assertions géométriques existantes conservés. Le POST local est intercepté afin de ne jamais appeler le service réel en aval.

## Exécution

| Vérification | Baseline | Candidat |
|---|---|---|
| `npm ci --silent` | Réussi | Réussi |
| `npm run lint` | Réussi | Réussi |
| `npm run build -- --webpack` | Réussi | Réussi |
| `npm test` | 168/168 | 180/180 |
| `npx tsc --noEmit` | — | Réussi |
| `npm run qa:brand:rev01` | — | Réussi |
| `npm run qa:claims:rev01` | — | Réussi |
| `npm run test:brand-os` | — | 19/19 |
| `npm run qa:network:rev01 -- --list` | — | 448 tests recensés, 13 fichiers |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | — | Arrêt avant navigation : Chromium interdit, 1 échec de lancement, 447 non exécutés |
| `git diff --check` | — | Réussi |

Une première compilation a signalé un argument de page facultatif incompatible
avec le type généré Next ; signature corrigée. La première batterie a signalé
les anciens contrats de destination et de durée, adaptés explicitement à la
nouvelle décision, ainsi que le sélecteur strict de la liste du Journal.

Revue adverse indépendante : perte d'UTM sur les clics modifiés trouvée puis
corrigée par les vrais href SSR ; correction retestée. Dernière revue : aucun
nouveau défaut concret, 22/22 tests ciblés réussis indépendamment. Les exceptions
des contrôles restent limitées au mandat.

Avertissements préexistants : `metadataBase` pendant le build et type de module
Node pour certains tests. Ils ne bloquent pas les vérifications réussies.
Logs locaux : `/tmp/cta-baseline-*.log`, `/tmp/cta-final-*.log`,
`/tmp/cta-playwright-list.log`, `/tmp/cta-playwright-run.log`.

## Blocage et reprise

Le serveur échoue avec `listen EPERM 127.0.0.1:3210`. Chromium échoue avant toute
navigation avec `MachPortRendezvous`, `Permission denied` et `SIGTRAP`.

**UNKNOWN** : rendu navigateur, hero entier dans 1440×800, stabilité/CLS,
alignements réels, contraste calculé et captures. Les seuils ne sont pas
assouplis. Aucun résultat en production revendiqué ; aucun déploiement autorisé.

Sur l'hôte, après installation/build, démarrer dans un terminal :

```sh
npm run start -- --hostname 127.0.0.1 -p 3210
```

Puis dans un autre :

```sh
npm run qa:network:rev01
CTA_CAPTURE=1 npx playwright test tests/intentions.spec.ts --browser=chromium
```

Les captures FR/EN à 1440×800 et 390×844 (hero, parcours, références, Journal)
sont écrites sous `/tmp/cta-intentions-captures`, hors des PNG suivis. Le dossier
peut être changé par `CTA_CAPTURE_DIR`. Elles restent à produire et à inspecter.
