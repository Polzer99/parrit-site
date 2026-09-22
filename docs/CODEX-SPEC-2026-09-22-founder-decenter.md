# SPEC — Décentrer Paul Larmaraud de parrit.ai, rester dans le registre Palantir

Branche : `codex/founder-decenter`. Base : `origin/main` (`1a82359`).

## Contexte

Retour de Paul (22/09/2026, verbatim) : « Tout ne doit pas être basé autour de
Paul Larmaraud. [...] c'est la page paul-larmaraud.com qui doit être basée sur
Paul Larmaraud, pas Parrit.ai [...] Fondé par Paul Larmaraud, ça fait hyper
mégalomaniaque [...] je veux juste que ça représente ce qu'on fait en termes de
copywriting. L'idée, c'est de rester dans la DA Palantir, pas le journal. Là,
t'as fait un mix de Paul Larmaraud et de Palantir [...] On avait fait beaucoup
d'analyses de DA, il faut rester cohérent. »

Deux fichiers d'audit déjà validés par Paul établissent ce registre :
`docs/CODEX-SPEC-2026-09-19-copy-palantir-coldiq.md` (registre Palantir × ColdIQ,
retrait des badges-preuve) et `docs/CODEX-SPEC-2026-09-20-founder-bridge-maison.md`
(« Ne pas transformer le bloc en biographie » — un lien secondaire discret
suffit, jamais une déclaration d'identité). La section « journey » de la home
(retravaillée plus tôt aujourd'hui) a dépassé ce cadre : son H2 est devenu le
nom complet de Paul, et le mot « Paul » (au lieu de « le fondateur »/« the
founder », déjà la convention établie ailleurs sur les mêmes pages) réapparaît
en corps de texte à plusieurs endroits. Grep effectué avant cette spec : la
convention correcte (« avec le fondateur »/« with the founder ») coexiste déjà,
dans les mêmes objets `DICT`, avec la version fautive (« avec Paul »/« with
Paul ») — c'est une incohérence interne, pas une divergence de fond.

Ce qui reste inchangé et correct, à ne pas toucher :
- La légende sous le portrait (« Paul Larmaraud · Fondateur »/« · Founder ») :
  identifie qui est sur la photo, convention éditoriale normale.
- Le lien secondaire « Rencontrez Paul »/« Meet Paul » vers
  `https://paul-larmaraud.com` : c'est une porte de sortie vers SA page
  personnelle, exactement la répartition que Paul demande (paul-larmaraud.com
  = lui ; parrit.ai = ce que l'entreprise fait).
- Toutes les mentions de « le fondateur »/« the founder » (rôle, pas nom) :
  déjà conformes.
- `legal/page.tsx` (`publicationDirector: "Paul Larmaraud"`) : mention légale
  obligatoire, hors sujet.

## Fichier 1 — `src/app/(rev01)/page.tsx`

### 1.1 — Titre de la section `journey` : retirer le nom, revenir au registre process

Remplacer (dans `DICT.en.journey`) :
```ts
      title: "Paul Larmaraud is your point of contact throughout the project.",
      intro: "From the first conversation to handover, four steps, always with him.",
```
par :
```ts
      title: "From the first message to handover, in four steps.",
      intro: "Each step names what Parrit does, what you bring, and what it unlocks next.",
```

Remplacer (dans `DICT.fr.journey`) :
```ts
      title: "Paul Larmaraud est votre interlocuteur tout au long du projet.",
      intro: "De la première conversation à la prise en main, quatre étapes, toujours avec lui.",
```
par :
```ts
      title: "Du premier message à la prise en main, en quatre étapes.",
      intro: "Chaque étape dit ce que Parrit fait, ce que vous apportez, et ce qu'elle débloque pour la suite.",
```

### 1.2 — Steps 01 et 02 : « Parrit », pas « Paul »

Remplacer (dans `DICT.en.journey.steps`) :
```ts
        ["01", "Name the operation", "You describe what costs you the most time. Paul examines with you who it touches and what it really costs."],
        ["02", "Write the scope", "What gets built, what Paul will need from you, and how success is judged, written before work starts."],
```
par :
```ts
        ["01", "Name the operation", "You describe what costs you the most time. Parrit examines with you who it touches and what it really costs."],
        ["02", "Write the scope", "What gets built, what Parrit will need from you, and how success is judged, written before work starts."],
```

Remplacer (dans `DICT.fr.journey.steps`) :
```ts
        ["01", "Nommer l'opération", "Vous décrivez ce qui vous coûte le plus de temps. Paul examine avec vous qui elle touche et ce qu'elle coûte réellement."],
        ["02", "Écrire le périmètre", "Ce qui sera construit, ce dont Paul aura besoin de vous, et comment on juge que c'est réussi, écrit avant que le travail commence."],
```
par :
```ts
        ["01", "Nommer l'opération", "Vous décrivez ce qui vous coûte le plus de temps. Parrit examine avec vous qui elle touche et ce qu'elle coûte réellement."],
        ["02", "Écrire le périmètre", "Ce qui sera construit, ce dont Parrit aura besoin de vous, et comment on juge que c'est réussi, écrit avant que le travail commence."],
```

Steps 03 et 04 ne changent pas (déjà en voix systémique, sans mention de Paul).
`journey.kicker`, `link`, `alt`, `caption`, `bridge` ne changent pas.

### 1.3 — Deliverable « Build With You » : aligner sur « the founder »

Remplacer (dans `DICT.en.offers.cards[0].deliverables`) :
```ts
            "10 hours of building with Paul",
```
par :
```ts
            "10 hours of building with the founder",
```

Remplacer (dans `DICT.fr.offers.cards[0].deliverables`) :
```ts
            "10 heures de construction avec Paul",
```
par :
```ts
            "10 heures de construction avec le fondateur",
```

(Cette carte a déjà, juste en dessous, `format: "10 hours, with the founder"` /
`"10 heures, avec le fondateur"` — la correction supprime une incohérence
interne à la même carte, elle n'invente rien.)

## Fichier 2 — `src/app/(rev01)/systems/page.tsx`

Même correction, doublon exact de la carte Build With You.

Remplacer (dans `DICT.en.deliverables`) :
```ts
      "10 hours of building with Paul",
```
par :
```ts
      "10 hours of building with the founder",
```

Remplacer (dans `DICT.fr.deliverables`) :
```ts
      "10 heures de construction avec Paul",
```
par :
```ts
      "10 heures de construction avec le fondateur",
```

## Fichier 3 — `src/app/(rev01)/commission/page.tsx`

Remplacer (dans `DICT.en.noteBody`) :
```ts
    "noteBody": "Either Paul sends you a written scope next: what gets built, what he'll need from you, how success is judged. Or a clear no, right away. Nothing is signed during the call; the scope is written afterwards, in black and white.",
```
par :
```ts
    "noteBody": "Either the founder sends you a written scope next: what gets built, what he'll need from you, how success is judged. Or a clear no, right away. Nothing is signed during the call; the scope is written afterwards, in black and white.",
```

Remplacer (dans `DICT.fr.noteBody`) :
```ts
    "noteBody": "Soit Paul vous envoie ensuite un périmètre écrit : ce qui sera construit, ce dont il aura besoin de vous, comment on juge que c'est réussi. Soit un non clair, tout de suite. Rien ne se signe pendant l'appel ; le périmètre se rédige après, noir sur blanc.",
```
par :
```ts
    "noteBody": "Soit le fondateur vous envoie ensuite un périmètre écrit : ce qui sera construit, ce dont il aura besoin de vous, comment on juge que c'est réussi. Soit un non clair, tout de suite. Rien ne se signe pendant l'appel ; le périmètre se rédige après, noir sur blanc.",
```

(Le reste de `noteBody`, y compris le pronom « il »/« he », ne change pas — il
se réfère maintenant à « le fondateur »/« the founder », grammaticalement
correct.)

## Vérification attendue (par Claude, après merge)

- `npm run build`, `npm run lint`, `qa:brand:rev01`, `qa:claims:rev01`,
  `qa:network:rev01` verts.
- Chercher toute assertion de test citant l'ancien titre de `journey`, l'ancien
  texte des steps 01/02, ou l'ancienne ligne `deliverables`/`noteBody` — mettre
  à jour pour refléter le nouveau texte, jamais l'affaiblir.
- `grep -rn "\bPaul\b" src/app/\(rev01\)` (hors `Paul Larmaraud`,
  `paul-larmaraud`, `paul.larmaraud`) : ne doit plus rien retourner en dehors
  de la légende du portrait, du lien `bridge`, et de `layout.tsx`
  (commentaire de code, hors scope).
- Aucun tiret cadratin (—) introduit.
- Capture d'écran desktop + mobile de la section `journey` (home, FR + EN),
  vérifier que le nouveau H2 et les 4 étapes restent lisibles sans
  débordement.
