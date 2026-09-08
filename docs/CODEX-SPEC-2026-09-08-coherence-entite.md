# SPEC · Cohérence d'entité + charte typographique (3 corrections)

Date : 2026-09-08. Trois fichiers, rien d'autre.

## 1. `src/app/(rev01)/layout.tsx` · ville du JSON-LD

La description de l'Organization dit « Based in Lille, France » alors
que le bloc adresse du même JSON-LD dit Rueil-Malmaison, et que le
registre du commerce (SIREN 928 503 218, vérifié sur Pappers le 08/09)
donne le siège à Rueil-Malmaison. Décision Paul du 08/09 : « on garde
en France et international ». Remplacer la phrase :

- AVANT : `Based in Lille, France; operating internationally in English and French.`
- APRÈS : `Based in France; operating internationally in English and French.`

Ne pas toucher au bloc adresse (Rueil-Malmaison, correct).

## 2. `public/llms.txt` · charte typographique

Le fichier contient 19 tirets cadratins « — ». La charte éditoriale du
site les interdit (llms-full.txt, écrit au LOT A, en a zéro). Remplacer
CHAQUE « — » par la ponctuation qui préserve exactement le sens :
deux-points quand le segment explique ou définit, virgule quand c'est
une incise légère, point quand deux phrases autonomes se cachent
derrière le tiret, parenthèses si c'est un vrai aparté. Aucun autre mot
ne change. Zéro cadratin et zéro demi-cadratin « – » à l'arrivée.

## 3. `docs/seo-geo/ARTICLE-CONTRACT.md` · bandeau de vérité

Le contrat décrit un moteur de blog qui n'existe plus :
`src/lib/blog.ts` et la route `src/app/[lang]/blog/[slug]` ont été
purgés (refonte Parrit Simple, PR#227-229 des 04-06/09), et le gate CI
`qa:doctrine` n'existe pas dans package.json ni dans les workflows.
Ajouter EN TÊTE du fichier (juste après le titre H1) ce bandeau :

> **⚠️ CONTRAT PARTIELLEMENT PÉRIMÉ (constat du 08/09/2026).** Le
> moteur décrit ici (`BlogPostSource`, `src/lib/blog.ts`, route
> `/[lang]/blog/`, gate CI `qa:doctrine`, piliers) a été purgé lors de
> la refonte Parrit Simple (PR#227-229). Le rail vivant est le
> **Journal** (`content/journal/*.mdx`, frontmatter title/date/
> description/slug/noindex validé par `src/system/journal.ts`). Restent
> valables comme doctrine d'écriture : answer-first, description
> courte menée par la réponse, zéro tiret cadratin, mot « chatbot »
> banni, FAQ sourcées si le rendu le permet. Décision d'archivage ou de
> réalignement complet : Paul.

Ne rien modifier d'autre dans ce fichier.

## Preuve attendue

`grep -c "—" public/llms.txt` rend 0 ; build OK ; le JSON-LD de la home
ne contient plus « Lille ».
