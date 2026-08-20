# Spec Codex — nettoyage identité publique (Yukun, ancienneté, "vingt experts")

Contexte complet : `docs/brand/PUBLIC-ENTITY-SOURCE-OF-TRUTH.md` (registre canonique, à lire
en premier) et `docs/brand/ONLINE-ENTITY-AUDIT.md`. Ce spec ne couvre QUE les corrections déjà
100 % tranchées par Paul — aucune invention, aucune extrapolation.

## Faits tranchés qui fondent ce spec

1. **Yukun Leng n'est pas et n'a jamais été présentée par Paul comme une associée actuelle.**
   Citation exacte de Paul (20/08/2026) : « Yukun, c'est pas mon associé. On travaille pas
   ensemble. » Elle a quitté toute collaboration avec Parrit.ai le 27/07/2026.
2. **Aucun chiffre d'ancienneté professionnelle globale n'est vérifié.** Le seul intervalle
   daté et vérifié est Lime, septembre 2022 → mai 2024 (20 mois). Toute formule « 10 ans
   d'expérience », « dix ans », « ten years » appliquée à Paul est fausse.
3. **« Vingt experts contractualisés et mobilisables » est une affirmation fausse.** Aucun
   contrat de partenaire de ce type n'existe.
4. **Parrit.ai est une SASU à fondateur unique, Paul Larmaraud, président**, créée le 2 mai
   2024 (RCS Nanterre, 6 mai 2024). Aucune co-fondation à afficher.

## Tâche 1 — `src/app/fondateurs/page.tsx`

Réécrire la page en page **mono-fondateur** (Paul Larmaraud uniquement). Objectifs :

- Retirer entièrement la section Yukun (portrait, bio, `deck.yukun`, `founders-person reverse`).
- Retirer toute mention de « boutique franco-chinoise » et de « deux fondateurs » / « Deux
  mains. Un même ouvrage. » (cette identité visuelle était construite autour du duo) —
  reformuler le hero autour de Paul seul, sans réutiliser une formule qui présuppose un
  second fondateur.
- Le JSON-LD (`jsonLd.@graph`) : retirer entièrement l'entité `Person` `#yukun-leng` et sa
  présence dans `Organization.founder` (qui devient `founder: { "@id": ".../#paul-larmaraud" }`,
  simple objet, plus un tableau) et dans `AboutPage.about`.
- Garder la structure générale (nav, footer, CTA `Réserver 15 minutes avec Paul`), la charte
  visuelle (`brand/` tokens), et le ton (voir `docs/brand-v2/paul-personal-brand.md` — pas
  d'autocélébration, pas de CV listé, 160 mots max sur l'essentiel).
- Contenu de remplacement suggéré pour le corps (à ajuster au ton du repo, pas à copier mot
  pour mot) : reprendre le storytelling déjà validé dans
  `docs/brand-v2/paul-personal-brand.md` (« Les problèmes changent. Ma manière de les
  attaquer reste la même. »), qui ne mentionne pas Yukun et est déjà conforme à `00B`.
- **Ne pas inventer de nouveau texte biographique** au-delà de ce qui est déjà validé dans
  `00B_POSITIONING_EXTERNAL.md`, `00C_COMMERCIAL_NARRATIVE.md` et `paul-personal-brand.md`.
- Renommer le titre de page si besoin (« Le fondateur » plutôt que « Les fondateurs »),
  cohérent en FR uniquement (cette route n'est pas dans `[lang]`).

## Tâche 2 — sweep textuel, tout le dépôt (hors `node_modules`, `.next`, `.git`)

Chercher et corriger toute occurrence de :

- `Yukun`, `冷宇坤`, `yukun-leng`, `yukun-portrait` en tant que membre actuel/fondatrice/associée
  — retirer ou, si la mention est déjà `status: historical` (fichiers `TRUTH.md`,
  `MATURITE-SOT.md`, `BRAND.md`, `DESIGN-SYSTEM.md`, `design-source/DA-TOKENS-EXTRACTED.md`),
  **ne pas toucher** — ces fichiers sont déjà exclus des bundles publics par doctrine du repo.
- `vingt experts`, `20 experts`, `twenty experts` — retirer partout où c'est présenté comme un
  fait actuel (hors fichiers déjà `status: historical`).
- `10 ans d'expérience`, `dix ans d'expérience`, `10 years`, `ten years` appliqués à Paul —
  retirer partout où c'est présenté comme un fait actuel (hors fichiers `status: historical`).
- `boutique franco-chinoise` — retirer des surfaces publiques actives (routes `src/app/**`,
  `content/**`, `public/**`, `brand/00*`, `docs/brand-v2/**`) ; laisser dans les fichiers déjà
  `status: historical`.

Utiliser `grep -rn` avant/après pour produire un diff propre, fichier par fichier. Ne toucher à
rien sous `positioning-os/02*` (ce sont des documents d'audit historique déjà correctement
datés et sourcés, pas des surfaces publiques).

## Tâche 3 — `public/llms.txt` et tout générateur (`scripts/generate-llms.mjs`)

Vérifier que le contenu généré/exposé aux crawlers IA ne contient ni prix (déjà interdit par
doctrine), ni les formulations retirées à la Tâche 2, ni Yukun comme fondatrice active.

## Portes de qualité avant PR (reprises de `AGENTS.md`)

- `npm run build` (4 langues SSG) doit passer.
- `npm run lint` doit passer.
- `PARRIT_BASE=http://localhost:3000 python3 scripts/contrast-audit.py /fondateurs` → 0 erreur.
- Aucune image `public/team/yukun-portrait.jpg` ne doit plus être référencée dans le code (le
  fichier peut rester sur disque, juste ne plus être importé/affiché).
- Diff lisible, commit unique ou par tâche, PR avec description claire des 3 tâches.

## Hors scope de ce spec — ne pas toucher

- Tout ce qui touche à Arkel, YUPA, Matidor.com, Infobip, ESSCA, localisation Lille/Rueil — non
  tranché par Paul, voir `PUBLIC-ENTITY-SOURCE-OF-TRUTH.md` §4.
- Le contenu de `brand/00B_POSITIONING_EXTERNAL.md` / `00C` / `positioning-os/*` : documents de
  gouvernance, pas des surfaces publiques à éditer dans ce spec.
- Aucun changement de prix, d'offre, de CTA.
