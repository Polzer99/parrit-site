# Maillage interne du site + auteur humain nommé

Date : 2026-09-09. Lot SEO n°2 et n°3 du plan tiré des newsletters BotRank.ai et
BabyLoveGrowth.ai (audit du 09/09, écarts confirmés après vérification adverse).

## Ce qui est constaté, pas supposé

1. **Le maillage interne s'arrête à la home.** `src/app/(rev01)/layout.tsx` ne
   monte aucun footer : le seul footer du site est écrit en dur dans
   `src/app/(rev01)/page.tsx` (lignes ~236-247, alimenté par `copy.footer`).
   Toutes les autres pages — `/manufacture`, `/standard`, `/dossiers`,
   `/commission`, `/legal`, `/journal`, `/journal/<slug>` — n'ont donc AUCUN lien
   en pied de page. La nav en compte trois. Aucun article ne pointe vers un autre
   article : `journal/[slug]/page.tsx` finit sur une `RegistryLine` et rien d'autre.
2. **Aucun auteur humain n'est nommé.** `blogPostingJsonLd.author` vaut
   `Organization / Parrit`. Paul Larmaraud écrit le Journal, a un site personnel
   qui répond, et figure déjà comme `founder` dans le JSON-LD Organization du
   layout : la donnée existe, elle n'est simplement pas réutilisée. Trois surfaces
   sont muettes : le JSON-LD de l'article, la balise `<meta name="author">`,
   et le `<dc:creator>` du flux RSS.

## Périmètre autorisé

- `src/system/auteur.ts` (nouveau)
- `src/system/components/RevFooter.tsx` (nouveau)
- `src/system/components/index.ts`
- `src/app/(rev01)/layout.tsx`
- `src/app/(rev01)/page.tsx`
- `src/app/(rev01)/journal/[slug]/page.tsx`
- `src/app/(rev01)/journal/rss.xml/route.ts`
- `src/app/(rev01)/rev01.css`
- `tests/internal-linking.spec.ts` (nouveau)
- `package.json` (uniquement pour ajouter la nouvelle spec à `qa:network:rev01`)

Rien d'autre. En particulier : ne pas toucher au sitemap, ne pas toucher aux
articles de `content/journal/`, ne pas créer de page.

---

## 1. Un footer unique, monté sur toutes les pages

Créer `src/system/components/RevFooter.tsx`, exporté depuis `index.ts`, sur le
modèle de `RevHeader` : un composant qui prend `{ locale }` et porte son propre
dictionnaire bilingue dans une constante `FOOTER` en tête de fichier.

**Le rendu doit être identique à l'octet près à l'actuel footer de la home** —
mêmes classes (`home-s-footer r2-dark`, `home-s-wrap`, `nav aria-label="Footer"`,
`home-s-footer-meta`), même structure `<span>` / `<small> · </small>`, mêmes
`localizedPath`. Aucun style nouveau n'est nécessaire ; aucune valeur hexadécimale
ne doit apparaître.

Liste des liens, six entrées, dans cet ordre exact (les quatre premiers libellés
existent déjà, les reprendre au mot près) :

```
en : /manufacture "The Manufacture" · "the method"
     /standard    "The Standard"    · "our commitments"
     /dossiers    "The Dossiers"    · "references"
     /journal     "The Journal"     · "field notes"
     /commission  "Commission"      · "book an examination"
     /legal       "Legal"           · ""

fr : /manufacture "La Manufacture"    · "la méthode"
     /standard    "Le Standard"       · "nos engagements"
     /dossiers    "Les Dossiers"      · "références"
     /journal     "Le Journal"        · "les chantiers"
     /commission  "Commande"          · "réserver un examen"
     /legal       "Mentions légales"  · ""
```

`founder` et `principle` reprennent mot pour mot ce que `copy.footer` contient
déjà dans les deux langues.

Puis :
- monter `<RevFooter locale={locale} />` dans `src/app/(rev01)/layout.tsx`,
  après `{children}` ;
- **supprimer** le `<footer>` en dur de `src/app/(rev01)/page.tsx` ainsi que les
  deux blocs `footer:` devenus inutiles dans `copy` — sinon la home affiche deux
  footers. Une seule définition doit subsister dans tout le dépôt.

## 2. Trois articles liés en fin de chaque entrée du Journal

Dans `src/app/(rev01)/journal/[slug]/page.tsx`, juste avant le
`<footer className="journal-article-footer">` existant, insérer un bloc de
navigation vers trois autres entrées.

Sélection **déterministe** (aucun aléatoire, `Math.random` interdit) : partir de
`getAllJournalEntrySummaries()`, retirer les entrées `noindex` et l'entrée
courante, puis prendre les trois qui suivent la position de l'entrée courante,
en repartant au début quand on atteint la fin de la liste. Ainsi l'entrée la plus
récente reçoit elle aussi trois liens, et deux articles voisins ne se renvoient
pas la même paire. Si moins de trois entrées sont disponibles, en afficher moins,
et ne rien afficher du tout si la liste est vide.

Rendu : un `<nav className="journal-related" aria-label>` contenant un `<K>` —
`Continue reading` en anglais, `À lire ensuite` en français — puis les liens,
chacun portant le titre de l'entrée et sa date. Les URL passent par
`localizedPath` comme partout ailleurs.

Le CSS va dans `src/app/(rev01)/rev01.css`, à côté de `.journal-article-footer` :
uniquement des variables de `tokens.css`, radius 0, aucune ombre, aucun dégradé.
Le gate `qa:brand:rev01` refuse tout hexadécimal écrit en dur.

## 3. L'auteur humain, défini une seule fois

Créer `src/system/auteur.ts` — un module de constantes, **sans** `server-only`,
pour qu'il soit importable partout :

```ts
export const AUTEUR = {
  nom: "Paul Larmaraud",
  url: "https://paul-larmaraud.com",
} as const;
```

Le consommer aux quatre endroits, sans jamais ressaisir la chaîne :

- `journal/[slug]/page.tsx` — `blogPostingJsonLd.author` devient
  `{ "@type": "Person", name: AUTEUR.nom, url: AUTEUR.url }`. Le `publisher`
  reste l'Organization : c'est la personne qui écrit, la maison qui publie.
- `journal/[slug]/page.tsx` — `generateMetadata` gagne
  `authors: [{ name: AUTEUR.nom, url: AUTEUR.url }]`, ce qui produit la balise
  `<meta name="author">`.
- `journal/rss.xml/route.ts` — déclarer l'espace de noms sur la balise racine
  (`<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">`) et ajouter
  `<dc:creator>` à chaque `<item>`, en passant par `escapeXml`.
- `(rev01)/layout.tsx` — le `founder` et le `sameAs` du JSON-LD Organization
  reprennent la constante au lieu de leurs chaînes en dur. Valeurs rendues
  inchangées.

---

## 4. Le gate qui empêche le maillage de retomber à zéro

Créer `tests/internal-linking.spec.ts` et l'ajouter à la liste de
`qa:network:rev01` dans `package.json`.

Le test importe `./network-deny.setup` comme toutes les autres specs, et lit
`BASE_URL` depuis `process.env.QA_BASE_URL` avec le même repli `127.0.0.1:3210`
que les fichiers voisins.

**Construction de la liste d'URL** — l'union de deux sources, pas le seul sitemap :
1. les `<loc>` de `${BASE_URL}/sitemap.xml`, dont on remplace l'origine
   `https://parrit.ai` par `BASE_URL` ;
2. les `href` commençant par `/journal/` relevés sur `/journal` et sur
   `/fr/journal`.

Dédoublonner en normalisant la barre oblique finale. La liste doit compter au
moins 40 URL ; si elle en compte moins, échouer en le disant — cela signifie que
le sitemap s'est vidé.

**Mesure, page par page** : compter les liens `<a href>` de même origine, en
excluant les ancres pures (`#...`) et l'URL de la page elle-même, puis dédoublonner.
**Seuil : au moins 7 liens internes uniques par page.** Le message d'échec nomme
l'URL, le compte obtenu et la liste des liens trouvés — lisible sans ouvrir un
navigateur.

**Le piège à éviter** : `/commission` et `/fr/commission` chargent l'embarqué
Cal.com, que le deny-all bloque **par construction**. Le fixture fait alors
échouer le test sauf si `expectBlockedRequest` vaut `true`. Regrouper ces deux URL
dans un `test.describe` à part avec `test.use({ expectBlockedRequest: true })`,
exactement comme le fait déjà `tests/conformity-commission.spec.ts`. Ne jamais
désactiver le deny-all, ne jamais autoriser un hôte externe.

## Contraintes d'écriture

- Zéro tiret cadratin dans le code, les commentaires et les libellés.
- TypeScript strict, `any` interdit.
- Les commentaires expliquent le POURQUOI, en français, comme le reste du dépôt.

## Preuve attendue

1. `npm run qa:brand:rev01` vert.
2. `npm run build` vert.
3. `npx next start -p 3210` puis `npm run qa:network:rev01` vert, nouvelle spec comprise.
4. **La preuve que le gate mord** : retirer temporairement `<RevFooter />` du
   layout, reconstruire, relancer la spec de maillage — elle DOIT échouer en
   nommant les pages tombées sous le seuil. Remettre, revérifier le vert.
   Rapporter les deux sorties.
5. Vérifier à la main sur `http://127.0.0.1:3210/journal/<un slug>` que le JSON-LD
   contient bien `"@type":"Person"` et que `<meta name="author">` est présent, et
   sur `/journal/rss.xml` que `dc:creator` apparaît dans chaque item.
