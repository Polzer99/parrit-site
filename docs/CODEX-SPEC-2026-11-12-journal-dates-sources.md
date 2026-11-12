# CODEX SPEC — Journal : dater les sources depuis la page, pas depuis le modèle

Niveau de risque : faible (script de contenu désarmé).

Constat, run 43307831165 (12/11) : les trois passes ramènent 10 résultats chacune, mais les deux sujets échouent en `materiau_insuffisant`. Sujet 1 : 1 source acceptée, écartées `sans_date` 13, `domaine_refuse` 9, `trop_ancienne` 5, `sans_chiffre` 1, `http_403` 1. Sujet 2 : 0 acceptée, `sans_date` 11, `recherche_interrompue` 6, `sans_chiffre` 2.

Cause : `scripts/journal-machine-research.mjs` (≈ l. 26-29) n'accepte une annotation que si le JSON rédigé par le modèle de recherche (`metadata.sources`) contient la même URL avec `published_at`. Le modèle n'en liste qu'une partie, donc la plupart des résultats sont écartés en `sans_date` sans que la page ait été lue. Puis (≈ l. 133) la date doit apparaître en toutes lettres dans le texte, alors que beaucoup de pages ne la portent que dans leurs métadonnées.

## 1. La date se lit dans la page (déterministe)

Nouvelle fonction `extractPublicationDate(html|pdf, url, headers)` dans `journal-machine-gates.mjs`, testée unitairement, par ordre de priorité :
1. JSON-LD : `datePublished`, puis `dateCreated` (et `dateModified` conservé à part) ;
2. métadonnées : `article:published_time`, `og:published_time`, `citation_publication_date`, `citation_date`, `DC.date`, `dcterms.issued`, `date`, `pubdate`, `parsely-pub-date`, `sailthru.date` ;
3. `<time datetime>` du premier article ou de l'en-tête ;
4. date dans l'URL (`/2025/08/01/`, `/2025-08-01-`, `20250801`) ;
5. texte visible : « publié le », « mis à jour le », « Published », « Updated », formats FR et EN (réutiliser la logique de `sourceDatePresent`) ;
6. PDF : `CreationDate` des métadonnées, sinon première date complète des deux premières pages ;
7. arXiv : date de soumission de la page `abs`.
Retour : `{ published_at, methode }`. Aucune date trouvée → `sans_date`. Une date dans le futur ou avant 1990 → ignorée.

## 2. Le modèle n'est plus nécessaire pour retenir une source

Toute annotation `url_citation` d'un domaine autorisé est candidate, qu'elle figure ou non dans `metadata.sources`. Pour chaque candidate : récupération de la page (fonction existante `fetchSource`), date par la §1, fraîcheur par `sourceFresh` (le `kind` vient du modèle s'il l'a donné, sinon de la liste où le domaine figure : `institutions` → `study` ; `presse_editeurs` → `news` pour la presse, `documentation` pour les éditeurs ; textes de loi sur legifrance, eur-lex → `law`), éditeur = `author` du modèle sinon le nom de domaine. Les faits restent ceux de la page : nombres présents dans le texte récupéré (la porte existante de vérification des nombres ne change pas). La date fournie par le modèle n'est qu'un indice : en cas de désaccord avec la page, la page fait foi.

Limiter à 24 pages récupérées par sujet (les plus pertinentes en premier : annotations des passes institutions, puis presse, puis contradiction), délai 15 s chacune, en parallèle par 4.

## 3. Diagnostic

- `sources_acceptees` : URL, éditeur, `published_at`, `methode` de datation, nombre de faits chiffrés.
- `recherche_interrompue` : consigner aussi le message d'erreur (200 caractères, sans secret) et la passe concernée.

## 4. Tests

- Une fixture HTML par méthode de la §1 (JSON-LD, meta, time, URL, texte FR, PDF, arXiv) → bonne date et bonne `methode`.
- Annotation absente du JSON du modèle mais page datée → acceptée.
- Date du modèle contredite par la page → date de la page.
- Ne modifie pas les tests existants, sauf ceux de la machine (`tests/journal-machine*`). Batterie : `npm ci --silent && npm run lint && npm run build -- --webpack && npm test`, entièrement verte.
