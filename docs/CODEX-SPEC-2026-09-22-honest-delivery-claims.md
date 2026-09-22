# SPEC — Exactitude des engagements (données, validation), clarté de la mission

Branche : `codex/honest-delivery-claims`. Base : `origin/main` (`95ed6de`).

Texte rédigé par Claude (corpus Carla + brief de Paul, 22/09/2026). Codex
applique tel quel.

## Contexte — deux corrections factuelles, confirmées par Paul en session

1. **Propriété/accès aux données.** Le site affirme sans nuance « nous n'en
   gardons pas de copie ailleurs » / « votre équipe le fait tourner sans
   nous ». Paul confirme : les données vivent bien dans les comptes du
   client (pas de copie séparée), MAIS Parrit garde un accès technique
   lorsque le client choisit un support/une maintenance continue. L'ancienne
   formulation est trompeuse par omission. Correction : rendre la promesse
   d'indépendance CONDITIONNELLE (un choix du client), jamais absolue.
2. **Validation humaine.** « Tout changement de système et toute correction
   automatique doivent être validés par une personne » est une affirmation
   absolue que Paul dit de moins en moins vraie. Correction : retirer la
   généralisation, la remplacer par un fait plus étroit et vérifiable (le
   contrôle réel déjà documenté ailleurs sur la même page — un nouveau point
   d'écriture vers un ancien outil ne peut pas s'ajouter sans être déclaré).

Le reste de la spec répond au brief de Paul : clarté façon cabinet de conseil
(étapes, responsabilités, livrables, engagements crédibles), Commission qui
explique l'objectif réel du premier échange sans annoncer un cadrage complet
en 15 minutes, Build With You qui précise ce que les 10 heures livrent dans
le périmètre retenu.

## Fichier 1 — `src/app/(rev01)/standard/page.tsx`

Remplacer (dans `DICT.en.principles`, ligne PS-05) :
```ts
      [
        "PS-05",
        "The system belongs to you.",
        "Code, data and documentation included. Your team runs it without us."
      ],
```
par :
```ts
      [
        "PS-05",
        "The system belongs to you.",
        "Code, data and documentation included. Your team can run it without us — if you'd rather keep us on for support, that access is your choice, never a dependency we build in."
      ],
```

Remplacer (dans `DICT.fr.principles`, ligne PS-05) :
```ts
      [
        "PS-05",
        "Le système vous appartient.",
        "Code, données et documentation compris. Votre équipe le fait tourner sans nous."
      ],
```
par :
```ts
      [
        "PS-05",
        "Le système vous appartient.",
        "Code, données et documentation compris. Votre équipe peut le faire tourner sans nous — si vous préférez nous garder en support, cet accès est votre choix, jamais une dépendance imposée."
      ],
```

## Fichier 2 — `src/app/(rev01)/systems/page.tsx`

### 2.1 — FAQ : où vont les données (exactitude)

Remplacer (dans `DICT.en.faq`) :
```ts
      ["Where does our data go?", "Into your own accounts, with your own access. We don't keep a copy elsewhere."],
```
par :
```ts
      ["Where does our data go?", "Into your own accounts. We don't build a second database of it — if you choose ongoing support, we keep the technical access that takes, nothing more."],
```

Remplacer (dans `DICT.fr.faq`) :
```ts
      ["Où vont nos données ?", "Dans vos comptes, avec vos propres accès. Nous n'en gardons pas de copie ailleurs."],
```
par :
```ts
      ["Où vont nos données ?", "Dans vos comptes. Nous n'en construisons pas une seconde base ailleurs — si vous choisissez un suivi continu, nous gardons l'accès technique que ça demande, rien de plus."],
```

### 2.2 — Garde-fous : retirer la généralisation sur la validation humaine

Remplacer (dans `DICT.en.guards`, l'entrée `"Every system change and every automatic correction must be validated by a person."`) :
```ts
    guards: ["For each type of information, a single tool is trusted. It's never chosen by default or by habit.", "Every system change and every automatic correction must be validated by a person.", "Every decision is logged: who decided, and when. Nothing happens silently.", "Before a change touches the site or our tools, a second system, distinct from the one that wrote it, reviews it, and a person decides alone whether to ship it. It can always be rolled back.", "The choice of AI model depends on the need and the cost, never on a single imposed provider."],
```
par :
```ts
    guards: ["For each type of information, a single tool is trusted. It's never chosen by default or by habit.", "A new write path into a legacy tool can't be added without being declared here first.", "Every decision is logged: who decided, and when. Nothing happens silently.", "Before a change touches the site or our tools, a second system, distinct from the one that wrote it, reviews it, and a person decides alone whether to ship it. It can always be rolled back.", "The choice of AI model depends on the need and the cost, never on a single imposed provider."],
```

Remplacer (dans `DICT.fr.guards`, l'entrée équivalente) :
```ts
    guards: ["Pour chaque type d'information, un seul outil fait foi. Il n'est jamais choisi par hasard ni par habitude.", "Tout changement de système et toute correction automatique doivent être validés par une personne.", "Chaque décision est notée : qui a décidé, et quand. Rien ne se passe sans laisser de trace.", "Avant qu'un changement touche le site ou nos outils, un second système, distinct de celui qui l'a écrit, le relit, et une personne décide seule de le mettre en ligne. On peut toujours revenir en arrière.", "Le choix d'un outil d'intelligence artificielle dépend du besoin et du coût, jamais d'un seul fournisseur imposé."],
```
par :
```ts
    guards: ["Pour chaque type d'information, un seul outil fait foi. Il n'est jamais choisi par hasard ni par habitude.", "Un nouveau point d'écriture vers un ancien outil ne peut pas s'ajouter sans être déclaré ici.", "Chaque décision est notée : qui a décidé, et quand. Rien ne se passe sans laisser de trace.", "Avant qu'un changement touche le site ou nos outils, un second système, distinct de celui qui l'a écrit, le relit, et une personne décide seule de le mettre en ligne. On peut toujours revenir en arrière.", "Le choix d'un outil d'intelligence artificielle dépend du besoin et du coût, jamais d'un seul fournisseur imposé."],
```

### 2.3 — Intro des trois faits : nommer les questions du client

Remplacer (dans `DICT.en`) :
```ts
    intro: "Here are three things we hold ourselves to before we offer them to you.",
```
par :
```ts
    intro: "Before you trust a system with your operation, three questions matter: is it reliable, who's in control when it changes, what happens when it goes live. We answer them for ourselves first.",
```

Remplacer (dans `DICT.fr`) :
```ts
    intro: "Voici trois méthodes que nous utilisons dans notre propre travail avant de vous les proposer.",
```
par :
```ts
    intro: "Avant de confier une opération à un système, trois questions comptent : est-il fiable, qui contrôle un changement, que se passe-t-il à la mise en service. Nous y répondons d'abord pour nous-mêmes.",
```

## Fichier 3 — `src/app/(rev01)/commission/page.tsx`

Remplacer (tout le bloc `DICT`) :
```ts
const DICT = {
  "en": {
    "title": "Every commission begins with an examination.",
    "metaDescription": "Every commission begins with an examination: fifteen minutes on a video call with the founder, a written scope or a clear no. Select a time.",
    "kicker": "Parrit / Commission",
    "sub": "Fifteen minutes on a video call with the founder.",
    "noteTitle": "You leave with a verdict.",
    "noteBody": "A written scope, or a clear no. Nothing is signed during the call; terms are set afterwards, in black and white.",
    "capture": "No slot that works? Leave your e-mail",
    "aria": "Select a time"
  },
  "fr": {
    "title": "Toute commande commence par un examen.",
    "metaDescription": "Toute commande commence par un examen : quinze minutes en visio avec le fondateur, un périmètre écrit ou un non clair. Choisissez un créneau.",
    "kicker": "Parrit / Commande",
    "sub": "Quinze minutes en visio avec le fondateur.",
    "noteTitle": "Vous repartez avec un verdict.",
    "noteBody": "Un périmètre écrit, ou un non clair. Rien ne se signe pendant l'appel ; les conditions se fixent après, noir sur blanc.",
    "capture": "Pas de créneau ? Laissez votre e-mail",
    "aria": "Choisissez un créneau"
  }
} as const;
```
par :
```ts
const DICT = {
  "en": {
    "title": "Every commission begins with an examination.",
    "metaDescription": "Fifteen minutes on a video call with the founder, to name the operation costing you the most and check a system makes sense for it. You leave with a written scope or a clear no.",
    "kicker": "Parrit / Commission",
    "sub": "Fifteen minutes on a video call with the founder, to name the operation costing you the most and check a system makes sense for it.",
    "noteTitle": "You leave with a clear direction.",
    "noteBody": "Either Paul sends you a written scope next — what gets built, what he'll need from you, how success is judged — or a clear no, right away. Nothing is signed during the call; the scope is written afterwards, in black and white.",
    "capture": "No slot that works? Leave your e-mail",
    "aria": "Select a time"
  },
  "fr": {
    "title": "Toute commande commence par un examen.",
    "metaDescription": "Quinze minutes en visio avec le fondateur, pour nommer l'opération qui vous coûte le plus et vérifier qu'un système a du sens pour elle. Vous repartez avec un périmètre écrit ou un non clair.",
    "kicker": "Parrit / Commande",
    "sub": "Quinze minutes en visio avec le fondateur, pour nommer l'opération qui vous coûte le plus et vérifier qu'un système a du sens pour elle.",
    "noteTitle": "Vous repartez avec une direction claire.",
    "noteBody": "Soit Paul vous envoie ensuite un périmètre écrit — ce qui sera construit, ce dont il aura besoin de vous, comment on juge que c'est réussi — soit un non clair, tout de suite. Rien ne se signe pendant l'appel ; le périmètre se rédige après, noir sur blanc.",
    "capture": "Pas de créneau ? Laissez votre e-mail",
    "aria": "Choisissez un créneau"
  }
} as const;
```

Aucun changement JSX — la page consomme les mêmes clés (`title`, `sub`,
`noteTitle`, `noteBody`, `capture`, `aria`, `kicker`, `metaDescription`).

## Fichier 4 — `src/app/(rev01)/build-with-you/page.tsx`

Remplacer (dans `DICT.en`) :
```ts
    outBody: "Something that runs at the end, in your own tools, not a demo. Code, data and documentation are yours: your team runs it without us, like every system we deliver.",
```
par :
```ts
    outBody: "Something that runs at the end, in your own tools, not a demo. Code, data and documentation are yours: for this engagement, your team runs it without us.",
```

Remplacer (dans `DICT.fr`) :
```ts
    outBody: "Une chose qui tourne à la fin, dans vos outils, pas une démonstration. Le code, les données et la documentation vous appartiennent : votre équipe le fait tourner sans nous, comme sur chaque système que nous livrons.",
```
par :
```ts
    outBody: "Une chose qui tourne à la fin, dans vos outils, pas une démonstration. Le code, les données et la documentation vous appartiennent : pour cette formule, votre équipe le fait tourner sans nous.",
```

Aucun autre changement dans ce fichier (le prix hérite déjà de l'ancrage « à
partir de » fusionné dans `OfferCard.tsx`, `nextBody`/`nextLink` restent ceux
de la correction précédente).

## Vérification attendue (par Claude, après merge)

- `npm run build`, `npm run lint`, `qa:brand:rev01`, `qa:claims:rev01`,
  `qa:network:rev01` verts.
- Chercher toute assertion de test citant l'ancien texte exact des quatre
  fichiers (FAQ données, garde-fous, Commission, Build With You `outBody`) —
  mettre à jour pour refléter le nouveau texte, jamais l'affaiblir.
- Relecture FR/EN : aucune des quatre pages n'affirme plus une indépendance
  totale des données, ni une validation humaine universelle sans exception.
