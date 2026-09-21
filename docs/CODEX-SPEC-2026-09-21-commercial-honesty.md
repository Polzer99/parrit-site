# SPEC — Honnêteté commerciale : Build With You (suite) et Dossiers

Branche : `codex/commercial-honesty`. Base : `origin/main` (`6a5acd8`).

Texte rédigé par Claude (corpus Carla + `brand-context.md`). Codex applique
tel quel.

## Fichier 1 — `src/app/(rev01)/build-with-you/page.tsx`

### 1.1 — `nextBody` : dire concrètement ce que le dirigeant possède, sait
faire, peut faire évoluer

« Le système construit rejoint les suivants » ne dit rien de vérifiable au
lecteur. Remplacer par ce qui reste concrètement entre ses mains après les
10 heures — cohérent avec PS-05 (le système appartient au client, déjà cité
dans `outBody` de cette même page) et PS-06 (la brique suivante augmente la
valeur des précédentes, déjà cité au Standard).

Remplacer (dans `DICT.en`) :
```ts
    nextBody: "The system you build joins the next ones: every capability raises the value of the ones before it. If you want Parrit to build what comes next, a custom Commission starts at the same place.",
```
par :
```ts
    nextBody: "You keep the system, and you keep the method: you watched, for 10 hours, how one operation turns into something that runs. The next one you spot, your team can take on alone with what it learned — or you call Parrit back for a custom Commission, starting from the same place.",
```

Remplacer (dans `DICT.fr`) :
```ts
    nextBody: "Le système construit rejoint les suivants : chaque capacité augmente la valeur de celles d'avant. Si vous voulez que Parrit construise la suite, une Commande sur mesure part du même endroit.",
```
par :
```ts
    nextBody: "Vous repartez avec le système, et avec la manière de le refaire : vous avez vu, pendant les 10 heures, comment une opération se transforme en quelque chose qui tourne. La prochaine que vous repérerez, votre équipe peut s'y attaquer seule avec ce qu'elle a appris, ou vous rappelez Parrit pour une Commande sur mesure qui part du même endroit.",
```

### 1.2 — `nextLink` : le libellé doit annoncer la vraie destination

Le lien mène à `/commission` (la prise de rendez-vous, un examen de 15
minutes) — pas à une page qui montre un « système sur mesure ». Renommer pour
décrire ce qui se passe réellement au clic.

Remplacer (dans `DICT.en`) :
```ts
    nextLink: "See the custom system",
```
par :
```ts
    nextLink: "Book an examination for a custom system",
```

Remplacer (dans `DICT.fr`) :
```ts
    nextLink: "Voir le système sur mesure",
```
par :
```ts
    nextLink: "Réserver un examen pour un système sur mesure",
```

Aucun autre changement dans ce fichier — le prix, le forfait et le CTA de
clôture restent ceux déjà en place.

## Fichier 2 — `src/app/(rev01)/dossiers/page.tsx`

Paul a vérifié le 21/09/2026 (voir `docs/DOSSIERS-MATRICE-VERIFICATION-2026-09-21.md`)
qu'aucune preuve du registre ne confirme aujourd'hui les affirmations de
livraison/autonomie de 26-002 et 26-003, et a tranché : retirer ces
affirmations tant qu'elles ne sont pas confirmées. Les deux dossiers décrivent
désormais le mandat commandé, jamais un résultat atteint. 26-001 (le système
interne de Parrit.ai, vérifiable sur `/systems`) ne change pas.

Remplacer (dans `DICT.en.dossiers`, le second élément du tableau — Dossier
26-003) :
```ts
      {
        "ref": "Dossier 26-003 · A consumer brand",
        "title": "The reporting that assembles itself and ships on time.",
        "body": "The report assembles itself from the source systems, with no manual rebuild. The client's own team runs it alone, today.",
        "seal": "Delivered · In the client's hands"
      },
```
par :
```ts
      {
        "ref": "Dossier 26-003 · A consumer brand",
        "title": "A reporting system, commissioned to assemble itself and ship on time.",
        "body": "The brief: pull the report together from the source systems automatically, with no manual rebuild each cycle.",
        "seal": "Commissioned"
      },
```

Remplacer (dans `DICT.en.dossiers`, le premier élément — Dossier 26-002) :
```ts
      {
        "ref": "Dossier 26-002 · A law firm",
        "title": "Re-engaged case files stop falling through again.",
        "body": "Client intake and follow-ups are being rebuilt on the firm's own infrastructure. The first capabilities are already running; the rest follows the same method.",
        "seal": "Under construction · First capabilities live"
      },
```
par :
```ts
      {
        "ref": "Dossier 26-002 · A law firm",
        "title": "A system commissioned so re-engaged case files stop falling through.",
        "body": "The brief: rebuild client intake and follow-ups on the firm's own infrastructure, one capability at a time.",
        "seal": "Commissioned"
      },
```

Remplacer (dans `DICT.fr.dossiers`, Dossier 26-003) :
```ts
      {
        "ref": "Dossier 26-003 · Une marque grand public",
        "title": "Le reporting qui s'assemble seul et part à l'heure.",
        "body": "Le rapport s'assemble depuis les systèmes sources, sans reprise manuelle. L'équipe du client le fait tourner seule, aujourd'hui.",
        "seal": "Livré · Aux mains du client"
      },
```
par :
```ts
      {
        "ref": "Dossier 26-003 · Une marque grand public",
        "title": "Un reporting commandé pour s'assembler seul et partir à l'heure.",
        "body": "Le mandat : assembler le rapport depuis les systèmes sources, sans reprise manuelle à chaque cycle.",
        "seal": "Commandé"
      },
```

Remplacer (dans `DICT.fr.dossiers`, Dossier 26-002) :
```ts
      {
        "ref": "Dossier 26-002 · Un cabinet d'avocats",
        "title": "Les dossiers relancés ne retombent plus dans l'oubli.",
        "body": "L'arrivée des clients et les relances sont refondues sur l'infrastructure du cabinet. Les premières briques tournent déjà ; le reste suit la même méthode.",
        "seal": "En construction · Premières briques en service"
      },
```
par :
```ts
      {
        "ref": "Dossier 26-002 · Un cabinet d'avocats",
        "title": "Un système commandé pour que les dossiers relancés ne retombent plus dans l'oubli.",
        "body": "Le mandat : refondre l'arrivée des clients et les relances sur l'infrastructure du cabinet, une capacité à la fois.",
        "seal": "Commandé"
      },
```

Le troisième élément (Dossier 26-001 · Parrit.ai, notre propre système) ne
change pas dans les deux langues.

## Vérification attendue

- `npm run build`, `npm run qa:brand:rev01`, `npm run qa:network:rev01` verts.
- Lecture des deux pages en FR et EN : aucun des deux dossiers ne doit plus
  affirmer une livraison, un usage autonome ou l'absence de reprise manuelle.
  Le lien « Voir/Réserver... système sur mesure » de Build With You doit
  mener au même `/commission` qu'avant — seul le libellé change.
