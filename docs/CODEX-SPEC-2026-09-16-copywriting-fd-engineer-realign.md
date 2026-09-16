# CODEX-SPEC · 2026-09-16 · Copy hero + « La maison » (angle Forward Deployed Engineer) + fix alignement capture éclair

Statut : **VALIDÉ PAR PAUL le 16/09/2026** (repasse Carla faite en session avec
Claude, verdict donné en chat : « réaligne le copywriting »).
Périmètre strict : chaînes de copy dans `src/app/(rev01)/page.tsx` (DICT.hero.sub
et DICT.maison, FR + EN) + un fix CSS d'alignement dans
`src/app/(rev01)/rev01.css`. Aucun changement de structure, de route ou de
composant.

## 1. Pourquoi

Paul a lu la home en direct et rejeté deux choses :
1. Le sous-titre du hero et le bloc « La maison » vendaient une **durée**
   (« depuis trois ans ») au lieu de montrer une **capacité**. Verdict de
   Paul : « 3 ans dans la tête des gens lambda, c'est rien. » L'angle demandé :
   des ingénieurs qui codent DANS le système du client (forward deployed
   engineer), pas un cabinet qui liste son ancienneté.
2. Le bloc « The maison » / « We take few commissions » sonnait générique et
   ne correspondait pas à sa voix. Passe Carla appliquée dans la session
   (négation+affirmation collées, concret avant abstrait, zéro superlatif).

## 2. Chaînes à remplacer dans `DICT.en.hero` et `DICT.fr.hero`

Remplacer **uniquement** la clé `sub` de chaque locale. Ne pas toucher
`kicker`, `before`, `frame`, `after`, `alternative`.

FR (actuel) :
```
sub: "Parrit.ai construit des systèmes IA depuis trois ans, chez des grands comptes, des PME et des ETI. Une entreprise à la fois.",
```
FR (nouveau) :
```
sub: "On code chez vous. Avec vos données. Jusqu'à ce que ça tourne.",
```

EN (actuel) :
```
sub: "Parrit.ai has built AI systems for three years, for large accounts, SMEs and mid-sized companies. One company at a time.",
```
EN (nouveau) :
```
sub: "We build inside your systems. On your data. Until it runs.",
```

## 3. Chaînes à remplacer dans `DICT.en.maison` et `DICT.fr.maison`

Remplacer **uniquement** `title`, `leadStrong`, `leadRest`, `body`. Ne pas
toucher `kicker`, `link`, `alt`, `caption`.

FR (actuel) :
```
title: "Nous acceptons peu de commandes.",
leadStrong: "Trois ans à construire ces systèmes.",
leadRest: " Ce qui tourne chez un client tourne d'abord chez nous.",
body: "L'examen de 15 minutes se tient avec le fondateur, en direct.",
```
FR (nouveau) :
```
title: "Nous construisons chez vous.",
leadStrong: "Pas de rapport, pas de slide.",
leadRest: " Un système qui tourne, codé avec vos équipes, sur vos données.",
body: "L'examen se tient avec le fondateur, en direct. Ce qu'on vous montre, on l'a déjà fait tourner chez nous.",
```

EN (actuel) :
```
title: "We take few commissions.",
leadStrong: "Three years building these systems.",
leadRest: " What runs at a client's runs at ours first.",
body: "The 15-minute examination is held with the founder, live.",
```
EN (nouveau) :
```
title: "We build inside your systems.",
leadStrong: "No deck. No report.",
leadRest: " A working system, coded with your team, on your data.",
body: "The examination is held by the founder, live. What we show you, we already run ourselves.",
```

Le corps a perdu la durée explicite (« 15 minutes ») dans `body` puisqu'elle
est déjà portée par `close.note` et par `/commission`. Ne pas la
réintroduire ; ne pas raccourcir ni reformuler au-delà de ce qui est donné
ci-dessus (ces phrases sont la source de vérité — copy déjà passé par la
voix Carla, ne pas l'améliorer, ne pas le traduire, ne pas le paraphraser).

## 4. Fix CSS — capture éclair du hero désalignée

Constat mesuré (Playwright + lecture de `src/app/(rev01)/rev01.css`) :
`.home-s-hero .home-s-wrap { text-align: center; }` centre tout le hero (H1,
sous-titre, lien « Ou parlons-en »), mais `.home-s-quick-capture` (variante
hero du composant `QuickCapture`) porte `text-align: left;` (ligne ~1729).
Résultat : le champ e-mail, le bouton et la note « UN PROTOTYPE PAR
ENTREPRISE · AUCUNE SÉQUENCE AUTOMATIQUE » s'affichent plaqués à gauche du
bloc de 760px, alors que tout le reste du hero (au-dessus ET en dessous,
notamment le lien « Ou parlons-en : un examen de 15 minutes… » juste après)
reste centré. C'est le défaut signalé par Paul (« il est désaligné,
complètement à gauche, on comprend pas pourquoi »).

Fix : retirer la déclaration `text-align: left;` de la règle
`.home-s-quick-capture` dans `src/app/(rev01)/rev01.css` pour qu'elle hérite
du centrage du hero. Vérifier ensuite que :
- le champ + bouton + note sont visuellement centrés dans le hero (desktop
  1440px et mobile 375px), FR et EN ;
- le champ conserve sa largeur pleine (`grid-template-columns: minmax(0,1fr)
  auto` sur `.quick-fields` ne doit pas être touché) ;
- la variante NON-hero du composant (`.quick-capture` seul, utilisée sur
  `/commission` et `/journal`) est inchangée à l'écran (elle ne porte pas la
  classe `.home-s-quick-capture`, donc hors périmètre de ce fix — le
  vérifier par capture, ne pas juste le supposer).

## 5. QA avant PR

- `npm run lint` + `npx tsc --noEmit` + `npm run build` : verts.
- `python3 ~/parrit-os/tools/prooflint.py` sur les chaînes modifiées (zéro
  tiret cadratin, zéro placeholder).
- Captures d'écran AVANT/APRÈS de la home (hero complet, FR et EN, 375px et
  1440px) montrant la capture éclair centrée. Captures de `/commission` (FR
  et EN) montrant que rien n'y a changé visuellement.
- Aucune autre chaîne du fichier ne doit différer du diff attendu (sections
  2 et 3 ci-dessus uniquement) : `git diff` de `page.tsx` ne doit toucher que
  les 2 blocs `hero.sub` (fr/en) et les 4 clés `maison.{title,leadStrong,
  leadRest,body}` (fr/en). `git diff` de `rev01.css` ne doit toucher qu'une
  ligne (la suppression de `text-align: left;`).

## 6. Livraison

Branche dédiée → PR vers `main`. NE PAS MERGER : review Claude (APPROVE) +
CD/batterie verte + Paul valide le rendu visuel (captures dans la PR) = les
3 feux (§25). Rollback : revert de la PR (aucune migration de données, aucun
schéma touché).
