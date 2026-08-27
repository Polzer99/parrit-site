# Spec — supprimer les traces d'écriture/génération IA restantes sur parrit.ai

Contexte : audit complet (copy, mentions explicites, visuels, métadonnées EXIF/C2PA)
mené le 27/08/2026. Deux correctifs concrets en ressortent. Tout le reste (mentions
explicites IA, métadonnées EXIF/C2PA des assets servis) est déjà propre — ne rien y
toucher.

## Tâche 1 — retirer le tiret cadratin/demi-cadratin (—/–) du copy public

Le repo bannit déjà ce tell dans sa propre doctrine (`prooflint.py`, `TRUTH.md` §voix,
AGENTS.md "pas de jargon IA"), mais le copy anglais de REV01 en contient encore ~35
occurrences utilisées comme ponctuation de liaison. Remplace-les par une ponctuation de
prose normale — point, virgule, deux-points, point-virgule, ou le point médian `·` déjà
utilisé ailleurs dans la charte comme séparateur (ex. "In production · Compounding") —
selon ce qui se lit le plus naturellement en anglais. Les suggestions ci-dessous sont des
PROPOSITIONS, pas des remplacements mot pour mot obligatoires : priorité à une prose
anglaise naturelle et à la voix du site (factuelle, sobre, jamais de symétrie mécanique).

Fichiers concernés (grep `—` et `–` sur `src/app/(rev01)/**/*.tsx` et
`src/system/components/**/*.tsx` pour retrouver chaque occurrence exacte avant d'éditer,
les numéros de ligne ci-dessous datent de l'audit et peuvent avoir légèrement bougé) :

- `src/app/(rev01)/page.tsx` — ~21 occurrences (titre meta L8, hero, FAQ "Who is
  Parrit?"/data/maintenance/team/délai, section dossiers, section standard, section
  manufacture, closing).
- `src/app/(rev01)/dossiers/page.tsx` — contenu DOSSIERS dupliqué depuis page.tsx, mêmes
  phrases à corriger à l'identique + meta description.
- `src/app/(rev01)/commission/page.tsx` — meta description + copy visible (dupliqués),
  intro "the founder", clause d'engagement.
- `src/app/(rev01)/standard/page.tsx` — 5 occurrences (specs PS, "Certified — Built to…").
- `src/app/(rev01)/manufacture/page.tsx` — meta + 5 occurrences dans les phases/principes.
- `src/app/(rev01)/sketch/[id]/page.tsx` — 8 occurrences dans le copy SKETCHES.
- `src/system/components/RegisterInterest.tsx` — 2 occurrences.
- `src/system/components/CalInline.tsx` — 1 occurrence ("RETRIEVING THE CALENDAR — A FEW
  SECONDS").
- `src/app/(rev01)/layout.tsx` — titre JSON-LD/meta `default: "Parrit — Company Operating
  Systems"` → `"Parrit · Company Operating Systems"` (garder cohérent avec le · déjà
  utilisé comme séparateur de marque).

**Exemptions à NE PAS toucher** (usages légitimes, pas des tells) :
- `src/app/(rev01)/sketch/[id]/page.tsx` — le `€ —` qui représente un montant non encore
  chiffré dans un instrument (valeur affichée, pas de la prose).
- `src/system/components/RevHeader.tsx` — `useState("—")`, placeholder d'horloge avant
  hydratation, pas du texte.
- Tout tiret dans un commentaire JSX (`{/* ... */}`), non rendu au visiteur.
- `src/app/camp-costa-rica/**` — hors périmètre (aucun tiret dans le copy visible
  constaté à l'audit, uniquement en commentaires).

Après édition : `grep -rn '[—–]' "src/app/(rev01)" src/system/components` ne doit plus
remonter que les exemptions ci-dessus.

## Tâche 2 — supprimer les portraits IA orphelins d'un pivot abandonné

`public/brand/agents/` contient 16 PNG (portraits fictifs générés par IA : amelie, chloe,
julien, karim, lucas, marc, nadia, thomas + `friendly/{commercial,direction,finance,
juridique,marketing,operations,relation-client,rh}.png`) issus d'un pivot "catalogue
d'agents à recruter" abandonné (`content/agents/catalog.json`, `src/lib/agents.ts`,
`HomeDeux.tsx`, `AgentCard` n'existent plus dans le code actuel). Ces fichiers restent
physiquement dans `public/` donc servables par URL directe (`parrit.ai/brand/agents/
marc.png` répondrait 200) même sans lien visible depuis le site — c'est une trace IA
publique résiduelle.

Avant de supprimer, vérifie par `grep -rn "brand/agents" src/ content/` qu'aucune route
vivante ne les référence encore (l'audit du 27/08 a confirmé que non). Si confirmé,
`git rm` le dossier `public/brand/agents/` en entier (les 16 fichiers + sous-dossier
`friendly/`).

**Ne pas toucher** : `public/camp/*` (vraies photos, page `/camp-costa-rica` live),
`public/brand/editorial/portraits/paul-*` (déclinaisons algorithmiques codées d'une vraie
photo de Paul via `design-source/editorial/recipes/`, pas de la génération IA — même si
orphelines, elles sont hors périmètre de cette tâche), `public/brand/qualiopi/*` et
`public/brand/client-logos/*` (assets de marque légitimes, hors périmètre), tout dossier
d'archive (`docs/`, `artifacts/`, `design-source/`) qui n'est de toute façon pas servi
sous `public/`.

## Batterie avant de finir (voir AGENTS.md du repo)

```bash
npm run build                 # inclut le prebuild (llms.txt), doit rester vert
npm run qa:brand:rev01        # hex hors tokens / radius / ombres — doit rester vert
```

Si le temps le permet, lance aussi `npx next start -p 3210 &` puis
`npm run qa:network:rev01` (5 specs Playwright, deny-all réseau) — sinon note-le comme
non exécuté dans ton rapport final pour que la revue humaine le fasse.

## Ce que tu NE dois PAS faire

- Ne touche à AUCUN autre fichier que ceux listés ci-dessus.
- Ne commit pas, ne push pas (ton sandbox ne le permet de toute façon pas ici) —
  contente-toi d'éditer les fichiers sur le disque, le commit est fait par Claude ensuite.
- Ne change ni la structure de contenu, ni le sens des phrases au-delà de la ponctuation
  nécessaire pour retirer le tiret cadratin.
- Ne touche pas aux 4 placeholders `[your name]` / `[Hugging Face]` / `[OpenRouter]` /
  `[Pleias]` / `[VentureBeat]` / `[specific topic]` repérés dans `content/journal/*.mdx`
  pendant l'audit — ce sont des bugs de contenu séparés, hors périmètre de cette tâche.

Termine par un résumé texte : fichiers modifiés, nombre d'occurrences corrigées, fichiers
supprimés, résultat de la batterie.
