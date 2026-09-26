# SPEC — ENTITY IDENTITY V0 (parrit.ai)

Mandat : Content Factory Parrit, phase 1, « tests immédiats » (décision Paul du 25/09/2026).
Dépôt jumeau : `paul-larmaraud-landing` reçoit la spec symétrique. Les deux sites doivent
porter **exactement** les mêmes identifiants. Doctrine d'entité existante à respecter :
`docs/CODEX-SPEC-2026-09-08-coherence-entite.md` et `docs/CODEX-SPEC-2026-09-22-founder-decenter.md`
(le nom de Paul ne revient **pas** dans les titres ni le texte de la home : on consolide
l'entité dans les données structurées, pas dans le copy).

## Identifiants canoniques (ne pas en inventer d'autres)

```text
ORG_ID    = https://parrit.ai/#organization
PERSON_ID = https://paul-larmaraud.com/#person     (déjà publié par paul-larmaraud.com)
Nom       = Paul Larmaraud        (orthographe unique, casse exacte)
```

## Ce qu'il faut faire

1. **`src/system/auteur.ts`** : ajouter `id: "https://paul-larmaraud.com/#person"` à `AUTEUR`,
   et exporter `ORG_ID` + deux helpers `personRef()` / `orgRef()` qui renvoient
   `{ "@type", "@id", "name", "url" }`. Plus aucune chaîne « Paul Larmaraud » en dur dans un JSON-LD.
2. **`src/app/(rev01)/layout.tsx`** (Organization) :
   - ajouter `"@id": ORG_ID` ;
   - `founder` = `personRef()` (avec `@id: PERSON_ID`) ;
   - `sameAs` ne liste que des pages qui **sont** Parrit.ai (profil entreprise, etc.).
     `paul-larmaraud.com` n'est pas l'organisation : le retirer de `sameAs` (la relation passe
     par `founder.@id`). Laisser un tableau vide et le commentaire existant sur la page LinkedIn
     entreprise. N'inventer aucune URL.
3. **`src/app/(rev01)/journal/[slug]/page.tsx`** (BlogPosting) :
   `author` = `personRef()` ; `publisher` = `orgRef()` complété du `logo` existant ;
   ajouter `"@id": "<url canonique>#article"`. Ne pas toucher au frontmatter ni à `journal.ts`
   (le `dateModified` réel est une tranche ultérieure).
4. **Test bloquant d'orthographe** `tests/entity-spelling.test.mjs` (`node --test`) :
   - parcourt `src/`, `content/`, `public/`, `docs/` hors `node_modules` et `.next` ;
   - échoue sur toute variante proche de « Larmaraud » qui n'est pas exactement
     « Larmaraud » : distance de Levenshtein ≤ 2, insensible à la casse, sur les tokens
     alphabétiques de 6 à 12 lettres commençant par `la`. Au minimum :
     `Lamaraud`, `Larmarau`, `Larmeraud`, `Larmaroud`, `Lamarraud`, `Larmarraud`, `Larmaraux` ;
   - message d'erreur : fichier, ligne, variante ;
   - ce fichier de spec contient volontairement les variantes interdites : l'exclure par une
     liste d'exclusion explicite et documentée.
   - L'ajouter aussi aux gates de `scripts/publish-journal.mjs` (un article mal orthographié
     ne part pas).
5. **Test d'entité** `tests/entity-graph.test.mjs` (`node --test`, sans navigateur) : tester
   les helpers et les objets JSON-LD construits (extraire leur construction dans des fonctions
   pures si nécessaire, ex. `src/system/jsonld.ts`) :
   - Organization : `@id === ORG_ID`, `founder["@id"] === PERSON_ID`, aucun `sameAs` vers `paul-larmaraud.com` ;
   - BlogPosting d'une entrée de journal réelle : `author["@id"] === PERSON_ID`,
     `publisher["@id"] === ORG_ID`, `@id` finit par `#article`.
   Node 26 exécute le TypeScript par effacement de types ; si un import `.ts` pose problème,
   garder les fonctions testées sans syntaxe TS non effaçable.
6. Ajouter un script `"test:entity": "node --test tests/entity-spelling.test.mjs tests/entity-graph.test.mjs"`.

## Hors périmètre

Pas de page équipe, pas de Maxime (relation non tranchée), pas de BreadcrumbList, pas de
dateModified, pas de changement visuel ni de copy. Pas de déploiement, pas de merge.

## Vérification

`npm run test:entity` et `npm run test:journal` verts, `npx tsc --noEmit` vert.
Le compte rendu montre le JSON-LD Organization et un BlogPosting avant/après.
