# SPEC — Corrections issues de la revue à 6 personas (Carla, agence copywriting, Iceatel/UX, Bénédicte Aubry, Serge Lebrun, Eric)

Branche : `codex/revue-6-personas`. Base : `origin/main` (`f592648`).

## Contexte

Six revues indépendantes du site en production (23/09/2026) ont convergé sur
plusieurs défauts précis, tous vérifiés par Claude sur le HTML réel avant
d'écrire cette spec (pas de citation non vérifiée). Cette spec applique les
corrections retenues pour ce premier lot — texte uniquement, sauf un ajout de
CTA en JSX sur Build With You. Ne touche à rien qui n'est pas listé ici.

Explicitement HORS PÉRIMÈTRE de cette spec (décision déjà prise ou en attente
d'arbitrage, ne pas y toucher) :
- La bande de navigation non fixe au défilement (retrait volontaire de
  `position: fixed` acté le 20/09, testé) — Iceatel la critique mais c'est une
  correction déjà délibérée, pas un oubli.
- Les chiffres absents sur les dossiers 26-002/26-003 — retirés le 21/09 faute
  de preuve vérifiable au registre ; ne pas en réinventer.
- La traduction du Journal FR — décision produit plus large, en attente de Paul.
- Le widget de réservation Cal.com (doublon FR/EN signalé par Iceatel) — vit
  dans la configuration Cal.com, pas dans ce dépôt.
- La liste "Systems commissioned by" (accueil) — nécessite de vérifier le
  registre de preuves avant d'ajouter quoi que ce soit ; pas traité ici.

## Fichier 1 — `src/app/(rev01)/manufacture/page.tsx`

### 1.1 — Retirer "certified"/"certifié", qui contredit Standard ("not an accreditation")

Remplacer (EN, corps du texte) :
```ts
        "One critical operation, rebuilt end-to-end in your accounts, under your keys. It runs in production, with real users, then it is certified to the Standard. A few weeks, usually. Only then, the rest."
```
par :
```ts
        "One critical operation, rebuilt end-to-end in your accounts, under your keys. It runs in production, with real users, then it is checked against the Standard. Two to four weeks, usually, depending on the scope written at the Examination. Only then, the rest."
```

Remplacer (EN, registre du footer) :
```ts
    "status": "EVERY SYSTEM CERTIFIED TO THE STANDARD",
```
par :
```ts
    "status": "EVERY SYSTEM CHECKED AGAINST THE STANDARD",
```

Remplacer (FR, corps du texte) :
```ts
        "Une opération critique, reconstruite de bout en bout dans vos comptes, avec vos clés. Elle tourne en production, devant de vrais utilisateurs, puis elle est certifiée selon le Standard. Quelques semaines, en général. Ensuite seulement, le reste."
```
par :
```ts
        "Une opération critique, reconstruite de bout en bout dans vos comptes, avec vos clés. Elle tourne en production, devant de vrais utilisateurs, puis elle est vérifiée au regard du Standard. Deux à quatre semaines, en général, selon le périmètre écrit à l'Examen. Ensuite seulement, le reste."
```

Remplacer (FR, registre du footer) :
```ts
    "status": "CHAQUE SYSTÈME CERTIFIÉ AU STANDARD",
```
par :
```ts
    "status": "CHAQUE SYSTÈME VÉRIFIÉ AU STANDARD",
```

## Fichier 2 — `src/app/(rev01)/standard/page.tsx`

Corrige la parallélisme grammatical des 6 titres PS-01→PS-06 : en l'état,
"The"/"Every" ouvrent les 6 titres EN, "Chaque"/"Le"/"La" ouvrent les 6 titres
FR — règle violée : jamais le même mot en tête de plusieurs entrées d'une
liste. Seuls les `h3` (titre de chaque principe) changent ; les
`doctrine-definition` (phrase d'exemple juste en dessous) ne changent pas.

Remplacer (EN, PS-01) :
```ts
"The state is readable at any moment."
```
par :
```ts
"State is readable at any moment."
```

Remplacer (EN, PS-03) :
```ts
"Every decision keeps its origin."
```
par :
```ts
"A decision always keeps its origin."
```

Remplacer (EN, PS-04) :
```ts
"The way back is written in advance."
```
par :
```ts
"Rolling back is written in advance."
```

Remplacer (EN, PS-06) :
```ts
"The next brick raises the value of the ones before."
```
par :
```ts
"Each brick raises the value of the ones before it."
```

(PS-02 "Every signal carries its decision." et PS-05 "The system belongs to
you." ne changent PAS — après les 4 remplacements ci-dessus, les 6 mots de
tête sont déjà tous distincts : State / Every / A / Rolling / The / Each.)

Remplacer (FR, PS-03) :
```ts
"Chaque décision garde son origine."
```
par :
```ts
"Toute décision garde son origine."
```

Remplacer (FR, PS-05) :
```ts
"Le système vous appartient."
```
par :
```ts
"Vous restez propriétaire du système."
```

Remplacer (FR, PS-06) :
```ts
"La brique suivante augmente la valeur des précédentes."
```
par :
```ts
"Une nouvelle brique augmente la valeur des précédentes."
```

(PS-01 "L'état se lit à tout moment.", PS-02 "Chaque signal porte sa
décision." et PS-04 "Le retour arrière est écrit d'avance." ne changent PAS —
après les 3 remplacements ci-dessus, les 6 mots de tête FR sont déjà tous
distincts : L' / Chaque / Toute / Le / Vous / Une.)

Ne pas toucher aux `doctrine-definition`, aux codes PS-0X, ni au sceau/date en
pied de chaque carte.

## Fichier 3 — `src/app/(rev01)/build-with-you/page.tsx`

Cette page cumulait 4 négations (règle : une seule négation-contraste par
pièce entière). On en garde une seule, déplacée hors du premier écran, et on
corrige une incohérence grammaticale.

### 3.1 — `promise` (sous-titre du hero, au-dessus du pli) : retirer la négation

Remplacer (EN) :
```ts
    promise: "You want to leave with something that runs, built with you. Not an audit or a deck.",
```
par :
```ts
    promise: "You want to leave with something that runs, built with you.",
```

Remplacer (FR) :
```ts
    promise: "Vous voulez repartir avec quelque chose qui tourne, construit avec vous. Pas un audit ni un deck.",
```
par :
```ts
    promise: "Vous voulez repartir avec quelque chose qui tourne, construit avec vous.",
```

### 3.2 — `steps[2]` (troisième étape) : accorder la nature grammaticale en anglais

Remplacer (EN) :
```ts
      ["03", "Build together", "10 hours with the founder to build a working system."],
```
par :
```ts
      ["03", "Building together", "10 hours with the founder to build a working system."],
```

(FR "Construction ensemble" ne change pas — déjà un groupe nominal, cohérent
avec les deux premières étapes.)

### 3.3 — `outBody` : seule négation conservée sur la page, reformulée pour nommer le vrai contraste (audit/deck) au lieu du générique "not a demo"

Remplacer (EN) :
```ts
    outBody: "Something that runs at the end, in your own tools, not a demo. Code, data and documentation are yours: for this engagement, your team runs it without us.",
```
par :
```ts
    outBody: "Something that runs at the end, in your own tools, not the audit or the deck of a typical engagement. Code, data and documentation are yours: for this engagement, your team runs it without us.",
```

Remplacer (FR) :
```ts
    outBody: "Une chose qui tourne à la fin, dans vos outils, pas une démonstration. Le code, les données et la documentation vous appartiennent : pour cette formule, votre équipe le fait tourner sans nous.",
```
par :
```ts
    outBody: "Une chose qui tourne à la fin, dans vos outils, pas l'audit ni le deck d'une mission classique. Le code, les données et la documentation vous appartiennent : pour cette formule, votre équipe le fait tourner sans nous.",
```

### 3.4 — `bringBody` : retirer les deux négations restantes

Remplacer (EN) :
```ts
    bringBody: "One precise operation, not an audit of the whole company: the follow-up that quietly drops, the spreadsheet you copy out every week, the decision that always lands on your desk. You're in the room for the 10 hours: you decide, there's no project lead standing in for you.",
```
par :
```ts
    bringBody: "One precise operation: the follow-up that quietly drops, the spreadsheet you copy out every week, the decision that always lands on your desk. You're in the room for the 10 hours: you decide.",
```

Remplacer (FR) :
```ts
    bringBody: "Une opération précise, pas un audit de l'entreprise entière : la relance qui retombe dans l'oubli, le tableau que vous recopiez chaque semaine, la décision qui atterrit toujours sur votre bureau. Vous êtes présent pendant les 10 heures : c'est vous qui tranchez, pas un chef de projet à votre place.",
```
par :
```ts
    bringBody: "Une opération précise : la relance qui retombe dans l'oubli, le tableau que vous recopiez chaque semaine, la décision qui atterrit toujours sur votre bureau. Vous êtes présent pendant les 10 heures : c'est vous qui tranchez.",
```

### 3.5 — JSX : ajouter un CTA intermédiaire après la section des 3 étapes

La page n'a aujourd'hui aucune action cliquable avant la toute fin (après 4
sections complètes). Ajouter un lien discret juste après la section
`build-steps`, avant la section `build-out`.

Remplacer :
```tsx
        <section className="r2-section" aria-labelledby="build-steps">
          <div className="r2-shead"><h2 className="r2-ed" id="build-steps">{copy.stepsTitle}</h2></div>
          <div className="r2-phases">
            {copy.steps.map(([number, title, body]) => <div className="r2-phase" key={number}>
              <div className="no">{number}</div><h3 className="nm">{title}</h3><div className="ds">{body}</div>
            </div>)}
          </div>
        </section>
```
par :
```tsx
        <section className="r2-section" aria-labelledby="build-steps">
          <div className="r2-shead"><h2 className="r2-ed" id="build-steps">{copy.stepsTitle}</h2></div>
          <div className="r2-phases">
            {copy.steps.map(([number, title, body]) => <div className="r2-phase" key={number}>
              <div className="no">{number}</div><h3 className="nm">{title}</h3><div className="ds">{body}</div>
            </div>)}
          </div>
          <p style={{ marginTop: 24 }}>
            <Link className="home-s-text-link" href={localizedPath("/commission", locale)}>{copy.cta}</Link>
          </p>
        </section>
```

(`localizedPath` et `Link` sont déjà importés dans ce fichier. `copy.cta` existe
déjà — "Book the free examination"/"Réserver l'examen offert".)

## Fichier 4 — `src/app/(rev01)/systems/page.tsx`

Le tableau affiché ne montre que 7 des 25 types d'information annoncés dans
`summaryText`, sans le dire. Ajouter une phrase de cadrage à la fin de
`summaryText`.

Remplacer (EN) :
```ts
    summaryText: "25 types of information tracked in total. For 1, the transfer is complete. For 8, it's underway. For 4, a check found a disagreement between the two versions. For 12, the transfer hasn't started. The legacy-tool count includes points already paused or failing, kept on record until formally closed.",
```
par :
```ts
    summaryText: "25 types of information tracked in total. For 1, the transfer is complete. For 8, it's underway. For 4, a check found a disagreement between the two versions. For 12, the transfer hasn't started. The legacy-tool count includes points already paused or failing, kept on record until formally closed. The table above lists the 7 most significant of the 25; the full registry is shown at the Examination.",
```

Remplacer (FR) :
```ts
    summaryText: "25 types d'information suivis au total. Pour 1, le transfert est terminé. Pour 8, il est en cours. Pour 4, une vérification a trouvé un désaccord entre les deux versions. Pour 12, le transfert n'a pas encore commencé. Le compte des anciens outils inclut des points déjà mis en pause ou en échec, gardés au registre jusqu'à fermeture actée.",
```
par :
```ts
    summaryText: "25 types d'information suivis au total. Pour 1, le transfert est terminé. Pour 8, il est en cours. Pour 4, une vérification a trouvé un désaccord entre les deux versions. Pour 12, le transfert n'a pas encore commencé. Le compte des anciens outils inclut des points déjà mis en pause ou en échec, gardés au registre jusqu'à fermeture actée. Le tableau ci-dessus détaille les 7 types les plus significatifs sur les 25 ; le registre complet est montré à l'Examen.",
```

## Fichier 5 — `src/app/(rev01)/page.tsx`

### 5.1 — `hero.sub` : retirer la négation, garder le sens (portée élargie)

Remplacer (EN) :
```ts
      sub: "The invoice that drags, the report rebuilt by hand every week: entry points, never the limit. We build inside your systems, on your data, until it goes live.",
```
par :
```ts
      sub: "The invoice that drags, the report rebuilt by hand every week: entry points we push as far as the operation demands. We build inside your systems, on your data, until it goes live.",
```

Remplacer (FR) :
```ts
      sub: "La facture qui traîne, le rapport refait à la main chaque semaine : des points de départ, jamais la limite. Nous construisons dans vos systèmes, sur vos données, jusqu'à la mise en service.",
```
par :
```ts
      sub: "La facture qui traîne, le rapport refait à la main chaque semaine : des points de départ que nous poussons aussi loin que l'opération l'exige. Nous construisons dans vos systèmes, sur vos données, jusqu'à la mise en service.",
```

### 5.2 — `build.items[1]` (étape 02, "Decide"/"Décider") : retirer la négation

Remplacer (EN) :
```ts
        ["02", "Decide", "The follow-up arrives already drafted, quantified, ready to approve. You never start from a blank page."],
```
par :
```ts
        ["02", "Decide", "The follow-up arrives already drafted, quantified, ready to approve."],
```

Remplacer (FR) :
```ts
        ["02", "Décider", "La relance vous arrive déjà rédigée, chiffrée, prête à valider. Vous ne partez jamais d'une page blanche."],
```
par :
```ts
        ["02", "Décider", "La relance vous arrive déjà rédigée, chiffrée, prête à valider."],
```

### 5.3 — `credential.text` : expliquer le lien avec le Standard de Parrit plutôt que le laisser implicite

Remplacer (EN) :
```ts
      text: "Formia, also led by our founder, is Qualiopi-certified (ATA 1926 2026, valid through May 2029).",
```
par :
```ts
      text: "Formia, also led by our founder, holds the Qualiopi certification (ATA 1926 2026, valid through May 2029): the same rigor he holds Parrit's own Standard to.",
```

Remplacer (FR) :
```ts
      text: "Formia, également dirigée par notre fondateur, est certifiée Qualiopi (ATA 1926 2026, valable jusqu'en mai 2029).",
```
par :
```ts
      text: "Formia, également dirigée par notre fondateur, détient la certification Qualiopi (ATA 1926 2026, valable jusqu'en mai 2029) : la même exigence qu'il applique au Standard de Parrit.",
```

## Fichier 6 — `src/system/components/QuickCapture.tsx`

Retirer le pronom possessif du bouton d'envoi, pour aligner sur la convention
du reste du site (aucun autre bouton du site n'utilise "my"/"ma").

Remplacer (EN) :
```ts
    button: "Send my request",
```
par :
```ts
    button: "Send to Paul",
```

Remplacer (EN, aria) :
```ts
    aria: "Send my request",
```
par :
```ts
    aria: "Send to Paul",
```

Remplacer (FR) :
```ts
    button: "Envoyer ma demande",
```
par :
```ts
    button: "Envoyer à Paul",
```

Remplacer (FR, aria) :
```ts
    aria: "Envoyer ma demande",
```
par :
```ts
    aria: "Envoyer à Paul",
```

## Fichier 7 — `src/system/components/AgentEsquisse.tsx`

Corrige une incohérence de personne grammaticale : le prompt d'ouverture dit
"I'll sketch"/"J'esquisse" (première personne, laisse croire que le fondateur
répond en direct), alors que le texte affiché juste après précise que
l'esquisse est un exemple générique et que c'est l'ENVOI à Paul qui déclenche
une vraie réponse personnelle. Retirer la première personne de l'ouverture
pour ne plus contredire cette clarification.

Remplacer (EN) :
```ts
    opening: "Describe the operation that costs you the most time. I'll sketch the system that takes it over.",
```
par :
```ts
    opening: "Describe the operation that costs you the most time. A system gets sketched to take it over.",
```

Remplacer (FR) :
```ts
    opening: "Décrivez l'opération qui vous coûte le plus de temps. J'esquisse le système qui la reprend.",
```
par :
```ts
    opening: "Décrivez l'opération qui vous coûte le plus de temps. Un système s'esquisse pour la reprendre.",
```

Ne pas toucher à `transition` dans ce fichier (déjà correct — il explique
clairement que c'est un exemple, pas une analyse, et que l'envoi à Paul
déclenche une vraie réponse personnelle).

## Vérification attendue (par Claude, après merge)

- `npm run build`, `npm run lint`, `qa:brand:rev01`, `qa:claims:rev01`,
  `qa:network:rev01` verts.
- `tests/conformity-standard.spec.ts` : le tableau `PRINCIPLES` (lignes 6-31)
  cite l'ancien texte exact des 6 titres PS — remplacer chaque titre changé
  (PS-01, PS-03, PS-04, PS-06) par son nouveau texte exact, PS-02 et PS-05
  restent identiques.
- `tests/conformity-home.spec.ts` ligne ~150 : l'assertion sur `hero.sub`
  cite l'ancien texte exact FR/EN — mettre à jour avec le nouveau texte.
- Chercher toute autre assertion de test citant un texte modifié par cette
  spec (Build With You, Systems summaryText, QuickCapture, AgentEsquisse,
  Manufacture) et l'actualiser, jamais l'affaiblir.
- Aucun tiret cadratin (—) introduit — vérifier explicitement chaque chaîne
  modifiée avant de committer.
- Capture d'écran de Build With You (FR + EN, desktop 1440px et mobile 375px)
  montrant le nouveau lien intermédiaire correctement positionné, sans
  chevauchement avec les cartes d'étapes.
