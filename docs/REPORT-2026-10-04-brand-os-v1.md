# Rapport Brand OS v1 · 04/10/2026

Implémentation livrée localement. Aucun commit, push, merge ni déploiement. Validation navigateur bloquée par le sandbox ; aucune conformité visuelle en production revendiquée.

## Sources et périmètre

- Baseline : HEAD et origin/main **local** = `3593c229c55cfe69f025266817b0e1cd73fc990b`. Pas de mise à jour du remote.
- État initial : seule la spec du 04/10 était non suivie. Elle est préservée sans modification.
- Reprise du contenu `ec09bc3` par patch hors index, sans cherry-pick ni commit. Les côtés main `test:entity` et `src/system/jsonld.ts` sont conservés.
- Paquet lu au chemin exact de la spec. Son origin déclare `112de90e0a1ce811d47869af624202367722350e`, généré le 04/10 à 14:40:53+02:00 ; le SHA `cd69c5b` cité par la spec est celui du handoff, pas le SHA source déclaré par l’export. Les cinq fichiers sont identiques octet pour octet à la source fournie.
- Quatre icônes vérifiées contre `site-assets.manifest.json`. Qualiopi conservé.
- Mandat : fichiers locaux de ce dépôt uniquement ; réversible par diff, zéro donnée métier, zéro ligne DB. Aucun changement des API, formulaires, Cal.com, PostHog, proxy, articles ou juridique.
- Plan suivi : reprise canon, surfaces et textes, contrôles, revue indépendante, corrections bornées. Les deux passes adverses ont renforcé les contrôles, sans assouplir les seuils.

## Fichiers

| Fichier | Modification |
|---|---|
| `.github/workflows/ci.yml` | Gate test:brand-os après build. |
| `AGENTS.md` | Canon Brand OS, contrats, polices et négociation de langue réelle. |
| `AI_CONTEXT.md` | Architecture visuelle et état de migration actualisés. |
| `design-source/parrit-da.css` | Avertissement d’archive repris de #292. |
| `docs/CODEX-SPEC-2026-09-28-brand-os-p1-palette.md` | Spec de la reprise #292, conservée pour traçabilité. |
| `next.config.ts` | Tracing des deux CSS OG ; suppression du cache du portrait. |
| `package-lock.json` | Déclaration directe de deux dépendances déjà verrouillées, sans changement de version. |
| `package.json` | Gates Brand OS/Playwright ; dépendances explicites des scanners. |
| `public/brand/favicon.svg` | Icône canon, octets du paquet. |
| `public/fonts/rev03/LICENSE-Source-Serif-4.txt` | Supprimé avec la police retirée. |
| `public/fonts/rev03/source-serif-4-latin-opsz-normal.woff2` | Supprimé. |
| `public/founder-portrait.jpg` | Supprimé conformément au registre des assets rejetés. |
| `scripts/brand-conformity-check.mjs` | Gate #292 ; couleurs littérales nommées et archives sous src contrôlées. |
| `scripts/brand-os-contracts.mjs` | SHA256, assets interdits, extraction HTML et couverture des glyphes. |
| `src/app/(rev01)/build-with-you/page.tsx` | H1, kicker, titre des métadonnées FR/EN. |
| `src/app/(rev01)/dossiers/page.tsx` | H1 et sous-titre FR/EN. |
| `src/app/(rev01)/journal/[slug]/og/route.tsx` | Résolution de couleurs via token.server, contenu conservé. |
| `src/app/(rev01)/layout.tsx` | Import du vendor avant alias ; Twitter large et image hérités. JSON-LD conservé. |
| `src/app/(rev01)/manufacture/page.tsx` | H1, sous-titre, H2 FR/EN ; séparateurs des phases. |
| `src/app/(rev01)/page.tsx` | Quatre titres par langue ; portrait retiré, légende maintenue, CTA sans flèche. |
| `src/app/(rev01)/rev01.css` | Registres accessibles, liens sombres, colonne maison unique, graisses, connecteurs vectoriels. |
| `src/app/apple-icon.png` | Icône 180 canon. |
| `src/app/favicon.ico` | Ajout du favicon canon. |
| `src/app/icon.png` | Icône 512 canon. |
| `src/app/not-found.tsx` | 404 bilingue, noindex, chrome partagé, General Sans, trois liens. |
| `src/app/opengraph-image.tsx` | Résolution de couleurs et gris sombre ; contenu conservé. |
| `src/lib/registry/ressources.ts` | Deux flèches-caractères remplacées par un point médian. |
| `src/system/brand-os.connectors.json` | Paquet immuable copié octet pour octet. |
| `src/system/brand-os.forbidden-assets.json` | Paquet immuable copié octet pour octet. |
| `src/system/brand-os.glyphs.json` | Paquet immuable copié octet pour octet. |
| `src/system/brand-os.origin.json` | Paquet immuable copié octet pour octet. |
| `src/system/brand-os.tokens.css` | Paquet immuable copié octet pour octet. |
| `src/system/components/MechanismSchema.tsx` | Deux connecteurs CSS aria-hidden remplacent les glyphes. |
| `src/system/fonts.css` | Retrait de la déclaration de police éditoriale. |
| `src/system/locale.ts` | Image OG 1200×630 explicite dans localizedOpenGraph. |
| `src/system/system.css` | Ombres tokenisées et gris du registre sombre. |
| `src/system/token.server.ts` | Résolveur strict des alias pour Satori, repris de #292. |
| `src/system/tokens.css` | Mapping Brand OS, label-d clair par défaut, ed vers ui. |
| `tests/aeration.spec.ts` | Gris lus via les tokens actifs, seuils de contraste conservés. |
| `tests/brand-os-contracts.test.mjs` | 5 tests : intégrité, assets, glyphes et mutations. |
| `tests/brand-os-render.test.mjs` | 1 test : 18 rendus Next compilés + 2 URL manquantes, sans réseau. |
| `tests/brand-os.spec.ts` | 40 tests navigateur : contraste, métadonnées, 404, mobile et connecteurs. |
| `tests/brand-os.test.mjs` | 6 tests : résolution, contrastes, OG PNG, mutations du contrôle couleur. |
| `tests/conformity-home.spec.ts` | Attendus de palette et titre explicite mis à jour. |
| `tests/offer-cards.spec.ts` | H1 Build With You localisé, assertions commerciales conservées. |
| `docs/REPORT-2026-10-04-brand-os-v1.md` | Ce compte rendu. |

## Textes livrés

| Page / clé | EN | FR |
|---|---|---|
| `/` `journey.title` | Four steps take you from the first message to a system your team runs. | Quatre étapes mènent du premier message à un système que votre équipe fait tourner. |
| `/` `proof.dossiers.title` | We show client dossiers in a meeting, not online. | Nous montrons les dossiers clients en rendez-vous, pas en ligne. |
| `/` `journal.title` | The Journal records what held and what broke on our projects. | Le Journal consigne ce qui a tenu et ce qui a cassé sur nos chantiers. |
| `/` `close.title` | A 15-minute examination tells you whether a system is worth building. | Un examen de 15 minutes vous dit si un système vaut d'être construit. |
| `/build-with-you` H1 | In 10 hours with the founder, you build a system that runs. | En 10 heures avec le fondateur, vous construisez un système qui tourne. |
| `/build-with-you` kicker au-dessus du H1 | Build With You | Build With You |
| `/manufacture` H1 | We build each system one operation at a time, from Examination to Compounding. | Nous construisons chaque système une opération à la fois, de l'Examen à la Capitalisation. |
| `/manufacture` sous-titre | A system is manufactured. It is not installed. | Un système se fabrique. Il ne s'installe pas. |
| `/manufacture` H2 « Three phases. » | Three phases turn an examined operation into a system you own. | Trois phases transforment une opération examinée en un système qui vous appartient. |
| `/dossiers` H1 | We show client dossiers in a meeting, not on this site. | Nous montrons les dossiers clients en rendez-vous, pas sur ce site. |
| `/dossiers` sous-titre | The dossiers open in conversation. Systems commissioned by large accounts, SMEs and mid-sized companies. Anonymized on principle. | Les dossiers s'ouvrent de vive voix. Des systèmes commandés par des grands comptes, des PME et des ETI. Anonymisés par principe. |

Autres changements de texte :

- CTA EN « Let's meet », « See the system », « See the dossiers » et FR « Rencontrons-nous », « Voir le système », « Voir les dossiers » : flèche retirée, libellés conservés.
- Manufacture : « Examination · Construction · Compounding » et « Examen · Construction · Capitalisation ».
- Registre ressources : « La matrice tâche · modèle, et le calcul de ce que vous payez en trop. » et « La matrice tâche · modèle, avec les seuils ».
- 404 : un H1 EN puis FR, « This page does not exist. » / « Cette page n'existe pas. ». Liens « Back to the home page » (/), « Revenir à l'accueil » (/fr), « Read the Journal » (/journal).
- Légende du fondateur conservée en tête de colonne ; textes alternatifs devenus inutiles supprimés avec l’image.
- Métadonnées Build With You : nouveau H1 dans le titre (56 caractères EN, 68 FR avant suffixe). Les autres titres de métadonnées ne recopiaient pas les H1 changés et restent identiques.
- Deux flèches de MechanismSchema remplacées par une tige et une tête CSS, sans texte.

## Tests et résultats

| Vérification | Résultat |
|---|---|
| Baseline lint, marque, claims | Verts avant modification |
| `npm ci --offline` | Réussi depuis cache, 462 paquets ; 0 vulnérabilité signalée |
| `npm run lint` | Vert |
| `npx tsc --noEmit` | Vert |
| `npm run qa:claims:rev01` | Vert |
| `npm run qa:brand:rev01` | Vert |
| `npm run build` (Turbopack) | N’avançait plus en compilation ; interrompu, pas déclaré vert |
| `npm run build -- --webpack` | Vert, compilation, typage, génération et tracing terminés |
| `npm run test:brand-os` | 12/12 verts après build |
| `npm run test:entity` | 7/7 verts |
| `node --test tests/offer-card.test.mjs` | 4/4 verts |
| `git diff --check` | Vert |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | 116 tests découverts ; premier test bloqué au lancement Chromium, 115 non exécutés |
| `npm run start -- -p 3210` | Refus sandbox : `listen EPERM 0.0.0.0:3210` |

Les tests Node produisent réellement les deux PNG OG 1200×630. Ils vérifient SHA du vendor et des polices, assets interdits, glyphes, cycles/alias absents, contrastes des paires et mutations hostiles. Ils échouent si le build HTML manque. Le registre immuable `brand-os.forbidden-assets.json` est la seule exception à son propre scan textuel (il contient nécessairement les noms rejetés), avec SHA contrôlé.

Les pages métier sont dynamiques : le scan des seuls HTML précompilés couvre principalement la 404. Le test supplémentaire de rendu appelle le Next compilé avec ses objets request/response simulés, sans port : 18 rendus EN/FR en 200, images OG/Twitter et dimensions correctes, titres exacts, glyphes conformes ; deux URL inconnues en 404 bilingue. Fetch, HTTP/HTTPS et connexion socket sont bloqués, tentatives journalisées et refusées même si le code les intercepte. Cela ne teste pas le proxy, l’hydratation ni la géométrie navigateur.

La revue indépendante a fait fermer deux contournements de la gate couleur (noms CSS et répertoire archive sous src), préciser le H1 bilingue, et renforcer le filet réseau du test serveur. Les tests du contrat modifié remplacent les anciennes valeurs de palette et les anciens titres ; aucune assertion commerciale n’a été supprimée.

## Limites et questions ouvertes

- Chromium refuse `bootstrap_check_in … MachPortRendezvousServer: Permission denied (1100)`. Captures, contraste réel EN/FR, débordement375px et géométrie des connecteurs restent à exécuter hors sandbox via la batterie prévue. Ne pas assimiler rendu serveur et validation visuelle.
- Turbopack standard reste à revalider sur l’hôte/CI. Le script build n’a pas été modifié pour imposer Webpack.
- Next émet encore un avertissement générique `metadataBase` pendant build/rendu ; les 18 surfaces demandées et la 404 ont été vérifiées sans image pointant vers localhost. La 404 dispose de son metadataBase explicite.
- Les décisions DV-01/DV-02 (hero), DV-03 (modèle), DV-06 (offres), AV-2 (forme du logo), AV-3 (photo) et AV-6 (mode complex) restent ouvertes ou hors mandat. Aucun remplacement inventé.
- Les règles historiques de TRUTH.md et prototypes ne doivent pas être prises pour une autorisation de restaurer T4 ; AGENTS et AI_CONTEXT pointent maintenant vers le Brand OS.
