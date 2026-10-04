# CODEX SPEC — parrit.ai : photo du fondateur, textes de positionnement et corrections, PRÊTS À PUBLIER (PR non fusionnée)

Date : 05/10/2026 · Auteur : Claude (relecture, §25) · Base : `origin/main` (1fc8995 = production). Le `main` local est
périmé : ne rien en reprendre.
**Statut : préparation.** Cette PR porte les options RECOMMANDÉES des arbitrages AV-3 et DV-01 à DV-06, que Paul n'a
pas encore rendus. Elle ne sera fusionnée qu'après sa décision ; si une option change, une reprise FIX ajustera. La
production actuelle reste la référence tant que la PR n'est pas fusionnée.
**Hors lot, ne pas toucher** : prix (3 200 € HT), durées (15 min / 30 min / 10 h), destinations des CTA, formulaires et
API (`QuickCapture`, `/api/interet`), PostHog, tokens et polices (`src/system/brand-os.*` ne s'éditent jamais à la main),
articles du Journal, routes.

## REPRISE (05/10) — le travail est déjà fait dans ce worktree
La première exécution est complète et conservée (non commitée). Ne rien refaire, ne rien annuler. La batterie n'a pas
tourné (commande de batterie absente du pont, pas un échec du code). Relire seulement le diff contre la spec et
compléter un oubli éventuel. Ne lance PAS de build dans le sandbox : il laisse `.next/lock` et bloque la batterie. La
batterie hors sandbox rejoue lint, build, contrôles de marque et tests navigateur.

## 0. Sources (lecture seule, hors du dépôt)
- Photos prêtes : `/Users/paullarmaraud/parrit-canon-visual-system/brand/visual/sites/handoff/2026-10-05/photos/`
  (`photos.manifest.json` donne source, cadre, dimensions et sha256 de chaque fichier). Vraies photos de studio
  (08/04/2025), recadrage géométrique seul, aucune retouche (REGLES-DOR §37). Ne jamais générer, retoucher ou
  recompresser ces fichiers.
- Canon verbal : `/Users/paullarmaraud/parrit-canon-visual-system/brand/verbal/{positioning,offers,claims}.json`.

## 1. Photo du fondateur (AV-3, option recommandée : DSC00629)
1. Copier octet pour octet `parrit-ai-founder-dsc00629-3x4-340.{avif,webp}` et `parrit-ai-founder-dsc00629-3x4-680.{avif,webp}`
   dans `public/brand/founder/`. Ne copier aucun autre fichier de ce dossier.
2. Accueil (`src/app/(rev01)/page.tsx`, section `home-s-maison`) : remettre une `<figure>` avant `home-s-maison-copy`,
   avec un `<picture>` (source avif puis webp, `srcset` 340w/680w, `sizes="(max-width: 859px) min(340px, 100vw), 340px"`),
   `width=340 height=453`, `loading="lazy"`, `decoding="async"`. Texte alternatif : FR « Paul Larmaraud, fondateur de
   Parrit.ai » ; EN « Paul Larmaraud, founder of Parrit.ai ». Au-delà de 859 px, grille `340px minmax(0, 1fr)` alignée au
   centre (le CSS d'origine est encore dans `rev01.css`) ; en dessous, photo au-dessus du texte, `width: min(340px, 100%)`.
   La légende `copy.journey.caption` reste où elle est aujourd'hui.
3. Test : l'image servie existe, a un `alt` non vide, et le sha256 de chaque fichier copié est celui du manifeste (copier
   les 4 empreintes dans un fixture de test, avec le chemin du manifeste source en commentaire). Le contrôle des assets
   interdits (`test:brand-os`) reste vert.

## 2. Textes de positionnement (DV-01 a, DV-02 a, DV-03 a ; DV-04 a et DV-05 a ne changent rien sur ce site)
Remplacer exactement, FR et EN, sans toucher au reste de la phrase ou du composant :

| Emplacement | Aujourd'hui | Devient |
|---|---|---|
| `page.tsx:15` kicker EN | Parrit / Company operating systems | Parrit / Data and AI |
| `page.tsx:16-18` H1 EN | The AI system your company operates on. | We turn operational problems into systems that work. |
| `page.tsx:102` kicker FR | Parrit / Systèmes d'exploitation d'entreprise | Parrit / Données et IA |
| `page.tsx:103-105` H1 FR | Le système IA qui fait tourner votre entreprise. | Nous transformons des problèmes opérationnels en systèmes qui fonctionnent. |
| `page.tsx:19` sous-titre EN | The invoice that drags, … until it goes live. | Parrit.ai is a data and AI company. The invoice that drags, the report rebuilt by hand every week: we start from your data and build tools you own. |
| `page.tsx:106` sous-titre FR | La facture qui traîne, … jusqu'à la mise en service. | Parrit.ai est une maison de données et d'IA. La facture qui traîne, le rapport refait à la main chaque semaine : nous partons de vos données et construisons des outils qui vous appartiennent. |
| `page.tsx:192` title FR | Parrit.ai · Systèmes d'exploitation d'entreprise | Parrit.ai · Données et IA, des outils qui vous appartiennent |
| `page.tsx:193` + `layout.tsx:38` title EN | Parrit.ai · Company Operating Systems | Parrit.ai · Data and AI, tools you own |
| `page.tsx:195` méta FR | Parrit.ai construit des systèmes IA depuis trois ans, … à vous pour de bon. | Parrit.ai relie vos sources, remet vos données à plat et construit dessus des outils qui vous appartiennent : le code, les données et la documentation. |
| `page.tsx:196` + `layout.tsx:59-60` méta EN | Parrit.ai examines how a company operates, … as owned infrastructure. | Parrit.ai connects your sources, cleans up your data and builds tools on top of it that you own: the code, the data and the documentation. |
| `src/system/jsonld.ts:11` | Parrit.ai designs and builds company operating systems: commissioned, not subscribed. Based in France; … | Parrit.ai is a data and AI company: it turns a company's data into software tools the company owns. Based in France; working in English and French. |
| `RevFooter.tsx:16` EN | Commissioned, not subscribed | What we build belongs to you |
| `RevFooter.tsx:28` FR | Une commande, pas un abonnement | Ce que nous construisons vous appartient |
| `CalInline.tsx:26,33`, `sketch/[id]/page.tsx:160,174` | UNE COMMANDE, PAS UN ABONNEMENT / COMMISSIONED, NOT SUBSCRIBED | CE QUE NOUS CONSTRUISONS VOUS APPARTIENT / WHAT WE BUILD BELONGS TO YOU |
| `opengraph-image.tsx:6,44` | … COMPANY OPERATING SYSTEMS | PARRIT.AI · DATA AND AI |
| `opengraph-image.tsx:72` | COMMISSIONED, NOT SUBSCRIBED · … | WHAT WE BUILD BELONGS TO YOU · … (reste de la ligne inchangé) |
| `Opening.tsx:21-22` EN | Parrit.ai designs and builds<br />company operating systems. / … Commissioned, not subscribed. | Parrit.ai turns operational problems<br />into systems that work. / One system to understand, decide and act across the company. Built for one company at a time. What we build belongs to you. |
| `Opening.tsx:35-36` FR | Parrit.ai conçoit et construit<br />des systèmes d'exploitation d'entreprise. / … Une commande, pas un abonnement. | Parrit.ai transforme des problèmes opérationnels<br />en systèmes qui fonctionnent. / Un seul système pour comprendre, décider et agir, à l'échelle de l'entreprise. Une entreprise à la fois. Ce que nous construisons vous appartient. |
| `sketch/[id]/page.tsx:14` | Operating System · Sketch | System · Sketch |

Les titres de la home se mesurent : vérifier à 375, 768 et 1440 px qu'aucune ligne du H1 ne porte un mot seul
(`text-wrap: balance` existe déjà ; ne pas forcer de retour à la ligne).

## 3. `llms.txt`, `llms-full.txt`, `TRUTH.md` (même décisions + affirmations bloquées du canon)
`public/llms.txt` est régénéré au prebuild par `scripts/generate-llms.mjs` : modifier le générateur (ou sa source),
jamais le seul fichier généré ; les numéros de ligne ci-dessous désignent la sortie générée.
- `public/llms.txt:3-5`, `:8`, `:15`, `:62` et `src/app/llms-full.txt/route.ts:2-4` : remplacer « company operating
  system(s) » par la formulation de la ligne JSON-LD ci-dessus (« a data and AI company… tools the company owns ») ou par
  « system » quand la phrase parle d'un système livré ; « Commissioned, not subscribed » / « The engagement model is a
  commission, not a subscription » → « What Parrit builds belongs to the client: the code, the data and the
  documentation. »
- Supprimer `public/llms.txt:45-46` « every commission includes maintenance and evolution — Parrit carries what it
  delivers » : affirmation bloquée (« maintenance incluse », `claims.json`), contredite par `/build-with-you`.
- Les lignes 54-56 (preuves) ne bougent pas, sauf le mot « operating system » remplacé par « system ».
- `TRUTH.md:11` et `:37` : même remplacement ; `TRUTH.md:57` « la home n'affiche AUCUN prix » est faux : écrire
  « la home affiche l'ancrage de Build With You (à partir de 3 200 € HT, au forfait) ; le sur-mesure est sur devis ».
- L'article du Journal « What is a company operating system? » n'est PAS modifié (contenu éditorial, hors lot) :
  le lister dans le rapport.

## 4. Mentions légales (`src/app/(rev01)/legal/page.tsx:15,20`)
« Lorsque vous utilisez les formulaires prototype ou journal » → « Lorsque vous utilisez le formulaire prototype »
(EN : « the prototype form »), À CONDITION que `git grep -n 'interet.*journal\|"journal"' src/` ne montre aucun point
d'entrée d'interface qui envoie `interet: "journal"`. S'il en existe un, ne rien changer et le signaler dans le rapport.

## 5. Preuves attendues dans la PR
- `npm run lint`, `npm run build`, `npm test`, `npm run test:brand-os` verts (navigateur hors sandbox par la batterie).
- Captures 375 / 768 / 1440 de `/`, `/fr`, `/build-with-you`, `/fr/build-with-you`, `/legal`, `/fr/legal` dans
  `docs/qa/2026-10-05-arbitrages/`.
- `docs/REPORT-2026-10-05-arbitrages-prets.md` : chaque ligne du tableau §2 avec fichier:ligne avant/après, les
  occurrences restantes de « operating system » / « système d'exploitation » / « abonnement » (avec raison si gardées).
