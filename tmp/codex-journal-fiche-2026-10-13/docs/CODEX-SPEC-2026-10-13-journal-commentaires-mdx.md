# CODEX SPEC 2026-10-13 : le Journal affiche les commentaires MDX en clair

## Constat (vérifié en prod le 13/10/2026)

Les entrées de `content/journal/*.mdx` sont rendues par `react-markdown`
(`src/app/(rev01)/journal/[slug]/page.tsx`), pas par un compilateur MDX. Un
commentaire MDX `{/* ... */}` n'y est donc pas un commentaire : il sort comme
premier paragraphe visible (`<p>{/*` dans le HTML).

Pages touchées en prod ce matin : `hook-timeout-lets-tool-call-through`,
`legacy-database-migration-writers-first`, `what-a-pilot-skips-to-look-finished`.
Le moteur de rédaction du Journal pose une « fiche d'entrée » interne dans ce
commentaire (consigne de sa skill), d'où la fuite.

## Ce qu'il faut livrer

1. Dans `src/system/journal.ts`, au chargement d'une entrée (là où `content`
   est construit à partir de `matter(source).content`), retirer tout
   commentaire de la forme `{/* ... */}` (multi-ligne compris, non gourmand),
   ainsi que les commentaires HTML `<!-- ... -->`, avant de renvoyer `content`.
   Les lignes vides laissées en tête sont supprimées. Rien d'autre ne change
   dans le texte (pas de normalisation d'espaces ailleurs).
2. Un test qui prouve : une entrée avec `{/*\nRAIL parrit\n*/}` puis un
   paragraphe rend un `content` qui commence par le paragraphe et ne contient
   ni `{/*` ni `RAIL`. Un second cas : commentaire sur une ligne. Un troisième :
   un texte sans commentaire est renvoyé à l'identique.
3. Ne pas toucher aux fichiers de `content/journal/` (le contenu reste tel
   quel ; c'est le rendu qui doit être juste).
4. Si la génération de `public/llms.txt` lit aussi le corps des entrées, y
   appliquer la même fonction (une seule fonction exportée, réutilisée).

## Hors périmètre

Aucun changement de style, de route, de script de publication, de dépendance.
Zéro secret. Branche dédiée, PR vers main, ne pas merger. Batterie verte
(`npm run lint`, `npm run build`, tests existants + nouveaux).

## Preuve attendue dans la PR

Sortie du test, et la liste des trois slugs ci-dessus dont le `content` chargé
ne commence plus par `{/*`.
