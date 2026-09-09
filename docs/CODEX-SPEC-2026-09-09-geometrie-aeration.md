# Géométrie et aération : les défauts visibles, mesurés en production

Date : 2026-09-09. Signalés par Paul après un passage page par page sur le site.
Lot **géométrique uniquement** : aucun texte n'est réécrit ici, aucune taille de
police n'est changée. Le plancher de lisibilité et le registre de voix font
l'objet de lots séparés.

Référence : `docs/EXIGENCE-SITE-PARRIT.md` (posé dans ce même lot).

## Les cinq défauts, chacun mesuré

### 1. Un texte touche un bouton, écart ZÉRO

Sur `/standard`, `/fr/standard`, `/manufacture`, `/fr/manufacture` et
`/dossiers`, `/fr/dossiers`, la ligne de preuve (« 30 min · En visio, avec le
fondateur ») et le bouton d'action sont posés côte à côte **sans aucun écart** :

```
fin du texte     : 460,8 px
début du bouton  : 460,8 px
écart            : 0,00
```

Le texte gris finit dans le rectangle rouge. C'est le défaut le plus voyant du
site, et il est sur la page qui s'appelle « Le Standard ».

Corriger le conteneur de cette paire (preuve + action) pour qu'il pose un écart
franc : au moins **24 px** en largeur, et le même en hauteur quand la paire
passe en colonne. Chercher la règle qui gouverne ce groupe dans
`src/app/(rev01)/rev01.css` (les pages partagent la même classe de pied de
section) et la corriger à un seul endroit, pas page par page.

### 2. Une note collée sous un très grand titre

Sur `/fr`, le bloc de clôture laisse **21,6 px** entre un titre de 54 px rendu
sur trois lignes et sa note. Après un titre de cette taille, 21 px ne sépare
rien : l'espace qui suit un titre doit croître avec lui.

Porter cet écart à au moins **0,6 fois la taille du titre**, soit 32 px ici.
Utiliser une valeur relative, pas un nombre en dur, pour que la règle tienne aux
autres largeurs.

### 3. Les titres cassent au milieu d'un terme composé

Trois exemples relevés en production :

- `/fr` : « Votre système / d'exploitation, examiné. »
- `/fr/standard` : « Six engagements. Chaque / système livré les tient. »
- `/fr/dossiers` : « Les dossiers / s'ouvrent / de vive voix. »

Appliquer `text-wrap: balance` aux titres de niveau 1 et 2 du site, et
`text-wrap: pretty` aux paragraphes de chapô. C'est exactement le cas d'usage de
ces propriétés : elles équilibrent les lignes et suppriment les veuves sans
toucher au texte. Vérifier dans `node_modules/next/dist/docs/` ou la doc CSS que
la propriété est bien supportée par la cible du dépôt, et prévoir la dégradation
gracieuse (une propriété inconnue est simplement ignorée).

### 4. Une veuve

Sur `/fr/standard`, le paragraphe sous le tableau finit sur « Demandez-nous des /
comptes. » Le `text-wrap: pretty` du point 3 traite ce cas ; vérifier qu'il
s'applique bien à ce paragraphe.

### 5. Les trois cartes de `/dossiers` ne s'alignent pas

Les légendes de statut font une ligne pour deux cartes et deux lignes pour la
troisième (« EN CONSTRUCTION · PREMIÈRES BRIQUES EN SERVICE »). Résultat : les
trois pastilles rouges ne sont pas sur la même ligne, ce qui se voit
immédiatement.

Corriger en poussant la ligne de statut en bas de carte : les cartes deviennent
une colonne flex, la zone de statut se colle au bas par `margin-top: auto`. Les
trois pastilles se retrouvent alors alignées quel que soit le nombre de lignes
du texte. Ne pas fixer de hauteur en dur.

### 6. Une colonne trop étroite sur `/standard`

Dans le tableau du Standard, la colonne des intitulés est si étroite que « La
brique suivante augmente la valeur des précédentes. » tombe sur **cinq** lignes
et que sa cellule fait le double de la hauteur de ses voisines. Élargir cette
colonne pour qu'aucun intitulé ne dépasse trois lignes en français à 1440 px,
en gardant le tableau dans sa largeur actuelle.

## Périmètre

`src/app/(rev01)/rev01.css` en premier lieu. Si un correctif exige une
modification de structure (le `margin-top: auto` du point 5 peut demander un
conteneur), toucher la page concernée, jamais son texte. Aucun fichier de
contenu, aucune chaîne de caractères modifiée.

## Le gate

Créer `tests/aeration.spec.ts`, ajouté à `qa:network:rev01`, en Playwright
navigateur (ces règles sont géométriques, elles exigent un rendu).

Sur `/`, `/fr`, `/standard`, `/fr/standard`, `/manufacture`, `/fr/manufacture`,
`/dossiers`, `/fr/dossiers`, aux largeurs **1440 et 390** :

1. **Aucun texte ne touche un bouton** : pour chaque `a` ou `button` ayant un
   fond non transparent, mesurer l'écart au rectangle de TEXTE le plus proche
   qui n'est pas à l'intérieur du bouton. Échouer sous **12 px**, horizontalement
   comme verticalement.
2. **Aucun texte ne chevauche un autre texte** : deux rectangles de texte de
   deux éléments distincts, non imbriqués, ne doivent jamais s'intersecter.

Mesurer les rectangles de TEXTE avec la Range API (`selectNodeContents`), jamais
`getBoundingClientRect` de l'élément : une boîte peut être parfaitement alignée
pendant que le texte qu'elle contient ne l'est pas. C'est la leçon du défaut de
nav du 09/09.

Respecter le deny-all du dépôt (`./network-deny.setup`) et le cas particulier
des pages qui chargent l'embarqué Cal, comme le fait déjà
`tests/conformity-commission.spec.ts`.

## Preuve attendue

1. `npm run qa:brand:rev01` et `npm run build` verts.
2. `npm run qa:network:rev01` vert, nouvelle spec comprise.
3. Preuve que le gate mord : Claude le pointera sur le build d'avant le lot ; il
   doit sortir en code 1 en nommant la paire preuve + bouton à 0 px.
