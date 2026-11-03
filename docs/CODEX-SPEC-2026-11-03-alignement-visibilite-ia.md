# parrit.ai : aligner le site sur la recherche par les IA

Niveau de risque : moyen

Statut : demandé par Paul le 03/11/2026 (« Alignes le site », « Tourcoing et Paris »).

## Règle de construction

Modifier l'existant : aucune nouvelle page, aucun nouveau composant visible, aucune dépendance, aucun fait nouveau. Aucun prix. Le texte visible des pages ne change pas. Les mentions légales ne changent pas : le siège social reste celui de `src/app/(rev01)/legal/page.tsx`.

## Constats du 03/11/2026

| Fait | Source |
|---|---|
| `robots.txt` interdit `/_next` au groupe `*`, donc à Google et à Bing | `src/app/robots.ts`, `https://parrit.ai/robots.txt` |
| Les groupes nommés (`GPTBot`, `ClaudeBot`…) n'ont que `Allow: /` : `/os` et `/api` ne leur sont pas interdits | même fichier |
| La directive `Host` n'est pas standard | même fichier |
| Les quatre pages thèmes n'ont aucune donnée structurée, alors qu'elles affichent un titre, une description et des questions fréquentes | `src/app/(rev01)/journal/themes/[theme]/page.tsx` |
| Le titre et la description de l'accueil citent Lille ; Paul demande Tourcoing et Paris | `src/app/(rev01)/page.tsx`, décision de Paul du 03/11/2026 |

## 1. `robots.txt`

Dans `src/app/robots.ts`, une seule règle : `userAgent: "*"`, `allow: "/"`, `disallow: ["/os", "/api"]`. Retirer les groupes nommés et `host`. Garder `sitemap`. Aucun robot d'IA n'est bloqué par ce changement, y compris `OAI-SearchBot`, `Claude-SearchBot` et `ChatGPT-User`.

Banc : `/_next` n'est plus interdit ; `/os` et `/api` restent interdits ; un seul groupe ; aucune ligne `Host`.

## 2. Tourcoing et Paris

Textes exacts :

| Lieu | Français | Anglais |
|---|---|---|
| Titre de l'accueil | Parrit.ai · Formation à l'IA et outils sur mesure pour les entreprises, Tourcoing et Paris | Parrit.ai · AI training and custom tools for businesses, Tourcoing and Paris |
| Fin de la description de l'accueil | Tourcoing, Paris et toute la France. | Tourcoing, Paris and across France. |

Dans `src/system/jsonld.ts`, `organizationJsonLd` :

- `address` reste le siège social, inchangé ;
- ajouter `location` : deux `Place`, chacune avec une `PostalAddress` qui ne porte que `addressLocality` (`Tourcoing`, `Paris`) et `addressCountry: "FR"`. Aucune rue inventée ;
- `areaServed` devient `["Tourcoing", "Paris", "Métropole européenne de Lille", "Hauts-de-France", "France"]`.

Dans `scripts/generate-llms.mjs`, la ligne de zone devient « Présence : Tourcoing et Paris. Zone d'intervention : toute la France. » et, en anglais, « Presence: Tourcoing and Paris. Service area: across France. » Le siège social reste indiqué. Régénérer `public/llms.txt` par le script.

Écrire dans `TRUTH.md` : « Villes affichées : Tourcoing et Paris, décision de Paul du 03/11/2026. Le siège social légal reste celui des mentions légales. » Adapter les passages d'`AGENTS.md` qui demanderaient Lille.

Adapter les contrôles qui exigent `Lille` (`tests/langue-metier.test.mjs`, `tests/single-page.spec.ts`) : ils exigent désormais `Tourcoing` et `Paris`. `tests/entity-graph.test.mjs` garde le siège.

Banc : titre et description FR et EN contiennent Tourcoing et Paris, et non Lille ; `location` compte deux lieux sans rue ; `address` inchangée ; `/fr/legal` inchangée.

## 3. Données structurées des quatre pages thèmes

Dans `src/system/jsonld.ts`, ajouter une fonction qui rend, depuis le contenu déjà affiché et dans la langue de la page :

- un `Article` : `headline` (titre affiché), `description`, `inLanguage`, `author` et `publisher` (`orgRef()`), `mainEntityOfPage` (adresse canonique de la page), `dateModified` (même date que le plan du site pour ces pages, tirée d'une seule constante partagée avec `src/app/sitemap.ts`) ;
- un `FAQPage`, seulement si la page a des questions, avec exactement les questions et réponses affichées.

L'insérer dans `src/app/(rev01)/journal/themes/[theme]/page.tsx`, comme l'accueil insère les siennes. Échapper le JSON comme le fait déjà le dépôt. Aucun texte visible ne change.

Banc, sur les quatre thèmes en FR et EN : JSON valide ; langue juste ; chaque question et réponse de `FAQPage` existe dans le HTML visible ; aucune question hors de la page ; aucun prix ; aucun nom de client.

## Hors de cette PR

- `www.parrit.ai` : réglage DNS et Vercel, à part.
- SPF et DMARC.
- `sameAs` : attend l'adresse de la page LinkedIn confirmée par Paul.
- Traduction des articles : relecture de Paul.

## Vérification

`npm run lint`, build Webpack, `npm test`, marque et claims. Le navigateur est refusé par le bac à sable : Claude rejoue les 410 tests sur l'hôte, ne rien revendiquer de réel.

Après fusion : contrôle en ligne de `/robots.txt`, `/llms.txt`, du titre et des données structurées de `/fr` et d'un thème, puis captures.

## Bornes

Une relecture de PR et une correction au plus. Au-delà, retour à Paul.
