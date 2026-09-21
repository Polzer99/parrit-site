# SPEC — Section « La maison » : sortir du générique, dire ce qui a été construit

Branche : `codex/maison-anti-slop`. Base : `origin/main` (`1923e69`).

Texte rédigé par Claude (corpus Carla + test anti-slop §60). Codex applique
tel quel.

## Contexte

Retour de Paul (21/09/2026, verbatim) : « Cette partie-là, niveau copywriting,
il faut la revoir parce que je sais pas forcément ce que j'ai construit. […]
Ça fait vraiment AI slop. » Le texte actuel (« Vous parlez à celui qui
construit. » / « Pas de compte client, pas de chef de projet. » / « Ce qu'il
montre à l'examen, il le fait déjà tourner chez lui. ») ne dit jamais QUOI est
montré, et la paire de négations « pas de compte client, pas de chef de
projet » est un gabarit interchangeable avec n'importe quelle agence solo.

Correction : le corps nomme maintenant explicitement ce qui est montré — le
système qui fait tourner Parrit elle-même, déjà établi et vérifiable sur
`/systems` (« Nous vendons le système qui nous fait tourner », Dossier
26-001) — et remplace la paire de négations par une scène concrète (le
dossier qui change de main entre deux rendez-vous), en respectant la règle
durcie d'une seule négation-contraste par pièce.

## Fichier — `src/app/(rev01)/page.tsx`

Remplacer (dans `DICT.en.maison`) :
```ts
    maison: {
      kicker: "The maison",
      title: "You talk to the person who builds.",
      leadStrong: "No account manager. No project lead.",
      leadRest: " The founder, in person, on every commission.",
      body: "What he shows at the examination, he already runs himself.",
      link: "Book an examination",
      alt: "Portrait of the founder",
      caption: "Paul Larmaraud · Founder",
      bridge: "Meet Paul",
    },
```
par :
```ts
    maison: {
      kicker: "The maison",
      title: "Paul answers alone, from the first message to the last line of code.",
      leadStrong: "No one else picks up your file between calls.",
      leadRest: " The founder, in person, on every commission.",
      body: "What he shows you at the examination is the system already running Parrit.",
      link: "Book an examination",
      alt: "Portrait of the founder",
      caption: "Paul Larmaraud · Founder",
      bridge: "Meet Paul",
    },
```

Remplacer (dans `DICT.fr.maison`) :
```ts
    maison: {
      kicker: "La maison",
      title: "Vous parlez à celui qui construit.",
      leadStrong: "Pas de compte client, pas de chef de projet.",
      leadRest: " Le fondateur, en personne, sur chaque commande.",
      body: "Ce qu'il montre à l'examen, il le fait déjà tourner chez lui.",
      link: "Réserver un examen",
      alt: "Portrait du fondateur",
      caption: "Paul Larmaraud · Fondateur",
      bridge: "Rencontrez Paul",
    },
```
par :
```ts
    maison: {
      kicker: "La maison",
      title: "Paul répond seul, du premier message à la dernière ligne de code.",
      leadStrong: "Personne d'autre ne reprend votre dossier entre deux rendez-vous.",
      leadRest: " Le fondateur, en personne, sur chaque commande.",
      body: "Ce qu'il vous montre à l'examen, c'est le système qui fait déjà tourner Parrit.",
      link: "Réserver un examen",
      alt: "Portrait du fondateur",
      caption: "Paul Larmaraud · Fondateur",
      bridge: "Rencontrez Paul",
    },
```

Aucun autre changement — le JSX de la section (`home-s-maison`) n'a pas besoin
d'être touché, la forme (kicker, h2, `<strong>{leadStrong}</strong>{leadRest}`,
paragraphe `body`, deux liens) reste identique.

## Vérification attendue (par Claude, après merge)

- `npm run build`, `npm run lint`, `qa:brand:rev01`, `qa:claims:rev01`,
  `qa:network:rev01` verts.
- Aucune assertion de test ne cite l'ancien texte de cette section (à
  vérifier par recherche avant de considérer la PR prête) ; sinon, mettre à
  jour l'assertion pour refléter le nouveau texte approuvé, jamais
  l'affaiblir.
- Lecture FR/EN : le corps de la section nomme maintenant explicitement ce
  qui est montré (le système qui fait tourner Parrit), plus de négation
  générique en paire.
