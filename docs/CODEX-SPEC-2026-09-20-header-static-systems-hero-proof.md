# SPEC — En-tête non fixe, preuve dans le premier écran de /systems, correction sémantique de l'accent

Suite de Paul (20/09/2026) après relecture de la PR #275. Quatre corrections
ciblées, PAS une réécriture : les acquis de la PR #275 (grille 1160px, nav
sans doublon, schéma relationnel 2 sources → contrôle → décision, texte
sourcé) sont conservés tels quels sauf mention contraire ci-dessous.

**Contrainte inchangée : zéro tiret cadratin (—).**

## 1. L'en-tête n'est plus `position: fixed`

Paul : « Le test qui impose fixed décrit l'ancienne implémentation ; il ne
justifie pas de la conserver. » Retirer le positionnement fixe, l'en-tête
devient un bloc normal en tête de flux du document — visible à l'arrivée sur
toutes les pages (il est déjà rendu avant `{children}` dans
`src/app/(rev01)/layout.tsx`, aucun changement nécessaire là), mais il défile
avec la page au lieu de rester épinglé.

Dans `src/app/(rev01)/rev01.css` :

1. Remplacer la règle `.cmdbar { ... }` (position, z-index, inset, hauteur,
   fond, backdrop-filter, border-bottom) par :
```css
.cmdbar {
  height: 64px;
  border-bottom: 1px solid var(--rule-d);
  background: rgba(10, 11, 12, .92);
}
```
   (`position`, `z-index`, `inset`, `backdrop-filter` disparaissent : un
   bloc en flux normal n'a besoin d'aucun des trois, et rien ne défile plus
   derrière lui pour justifier un flou.)

2. Supprimer entièrement la règle `body { padding-top: 64px; }` — elle
   compensait l'espace mangé par un en-tête fixe ; un en-tête en flux normal
   occupe déjà sa propre place, la compensation devient un double espace si
   elle reste.

3. **Ne pas toucher** aux règles suivantes, qui restent correctes sans
   changement (vérifié : elles continuent de produire exactement le même
   rendu, l'en-tête étant toujours haut de 64px et toujours au sommet du
   document au premier chargement) :
   - `.opening { inset: 64px 0 0; min-height: calc(100vh - 64px); }` — reste
     un overlay fixe qui commence sous les 64px de l'en-tête, valable car
     l'Opening ne joue qu'à l'arrivée fraîche sur `/`, avant tout défilement.
   - `.home-s-hero { min-height: calc(100svh - 64px); ... }` — le premier
     écran de l'accueil doit toujours remplir l'espace restant sous
     l'en-tête.
   - `.cmd-panel { position: fixed; inset: 64px 0 0; ... }` — le panneau
     mobile reste un overlay plein écran, ouvert uniquement depuis le bouton
     Menu de l'en-tête (donc toujours avec l'en-tête visible en haut).

4. Effet de bord positif à ne pas corriger davantage : les ancres de la page
   (`#operating-view`, `#capacites`, etc.) n'étaient jamais compensées par un
   `scroll-padding-top` — avec un en-tête fixe, un saut direct vers une ancre
   masquait partiellement sa cible sous la barre. Sans `position: fixed`, ce
   défaut disparaît de lui-même. Ne rien ajouter pour ça.

### Test à corriger (changement intentionnel, pas un assouplissement)

Dans `tests/conformity-home.spec.ts`, le test `"the command bar is fixed at
the approved height on every core page"` (dans `test.describe("command
bar", ...)`) vérifiait un choix qui n'est plus le canon. Renommer le test en
`"the command bar keeps the approved height and sits in normal flow on every
core page"` et remplacer son corps par :
```ts
for (const path of ["/", "/standard", "/commission", "/journal"]) {
  await page.goto(`${BASE_URL}${path}`);

  const commandBar = page.locator(".cmdbar");
  await expect(commandBar).toBeVisible();
  await expect(commandBar).not.toHaveCSS("position", "fixed");
  await expect(commandBar).toHaveCSS("height", "64px");
}
```
(la hauteur reste vérifiée à l'identique ; seule l'attente de positionnement
change, dans le sens explicitement demandé par Paul.)

## 2. Premier écran de `/systems` : une preuve réelle, pas seulement un titre

Paul : « Recompose le premier écran de /systems autour d'un fragment réel et
autorisé de notre système : titre, preuve lisible, date, limite et action. »
Ce fragment existe déjà et coche ces cases : c'est le composant `SystemCard`
utilisé plus bas dans `#capacites`, avec les données de
`evidence.cards[0]` (« La liste qui fait foi ») — titre (`name`), preuve
lisible (`input`/`process`/`output`), limite (`limits`, toujours rendue),
et l'action est déjà présente juste au-dessus (les boutons "Parlons-en" /
"Capacités démontrées" du hero). Il manque seulement la date : la réutiliser
depuis `copy.observed`, déjà écrite ailleurs sur la page (« Usage interne ·
vérifié le 13 septembre 2026 » / « Internal use · observed 2026-09-13 »).

**Ne pas créer de nouveau texte.** Dans
`src/app/(rev01)/systems/page.tsx`, à l'intérieur de `<header
className="r2-hero">`, juste après la ligne des deux boutons (`talk` +
lien `#capacites`), ajouter :
```tsx
<div className="systems-hero-proof">
  <K>{copy.observed}</K>
  <SystemCard {...evidence.cards[0]} locale={locale} />
</div>
```
(`SystemCard` est déjà importé en tête de fichier. Le schéma détaillé et le
grid des 4 cartes plus bas dans `#capacites` restent inchangés : la carte
apparaît deux fois sur la page, une fois en aperçu immédiat, une fois dans
le catalogue complet — répétition volontaire, pas une redite accidentelle.)

**CSS** dans `rev01.css`, ajouter une règle de largeur/espacement pour que
la carte ne s'étire pas sur toute la largeur du hero :
```css
.systems-hero-proof {
  max-width: 480px;
  margin-top: 40px;
  text-align: left;
}
```
(`.r2-hero` est centré par défaut sur cette page ; cette règle recentre
l'alignement du texte à gauche À L'INTÉRIEUR du bloc carte, sans changer le
centrage du H1/sous-titre au-dessus. Si `SystemCard` ne s'affiche pas
correctement en dehors de son grid d'origine — vérifier visuellement —,
ajuster uniquement les propriétés de layout de `.systems-hero-proof`, jamais
le composant `SystemCard` lui-même.)

## 3. Deux resserrages de texte (Carla + §60 : les chiffres seuls ne suffisent pas)

Dans `src/system/components/MechanismSchema.tsx`, deux changements de
formulation, rien d'autre :

**a) Titre du premier nœud**, trop long et légèrement calqué du jargon
(« doit faire foi » comme verbe modal). Le remplacer par la formule déjà
établie ailleurs sur cette même page (cohérence de vocabulaire, pas
invention) :
- FR : `"La source qui doit faire foi"` → `"Ce qui fait foi"`
- EN : `"The source meant to be trusted"` → `"What's trusted"`

**b) Corps du nœud contrôle**, trop dense pour un encart de schéma (deux
faits + deux dates empilés). Retirer la date redondante avec celle déjà
affichée par la légende ajoutée en §2 ci-dessus, et réutiliser mot pour mot
la formule déjà employée dans `evidence.narrative` sur la même page
(« 114 fiches présentes uniquement dans l'ancien système » / « 114 records
that existed only in the old system ») plutôt que d'en inventer une
variante :
- FR : `"Un verrou empêche tout nouveau point d'écriture non déclaré depuis le 13 septembre 2026. Un audit périodique, comme celui du 11 septembre, compare les deux sources : il a trouvé 114 fiches présentes seulement côté ancien système."` → `"Un verrou bloque toute nouvelle écriture non déclarée. Un audit du 11 septembre a trouvé 114 fiches présentes uniquement dans l'ancien système."`
- EN : `"A gate has blocked any new undeclared write path since September 13, 2026. A periodic audit, like the one run on September 11, compares both sources: it found 114 records that existed only in the old system."` → `"A gate blocks any new undeclared write. An audit run on September 11 found 114 records that existed only in the old system."`

Ne pas toucher aux deux autres nœuds (légende « Ce qui écrit encore à côté »
et « Décision humaine, datée ») : déjà conformes.

## 4. Corriger la sémantique de l'accent (le nœud décision n'est pas une décision en attente)

Erreur trouvée par Paul dans la PR #275 : l'accent bleu (loi de marque =
« décision requise ») a été posé sur le nœud « Décision humaine, datée » —
mais ce nœud décrit une décision **déjà prise et datée**, pas une décision
en attente. Aucun des quatre nœuds du schéma ne représente une décision
active à prendre maintenant (cette action-là, c'est le bouton "Parlons-en"
du hero, qui porte déjà l'accent, à raison). Ne pas réinventer une urgence
qui n'existe pas pour justifier la couleur : retirer l'accent du schéma, et
donner au nœud décision un état visuel distinct par la PROFONDEUR plutôt que
par la couleur (statut = forme, pas seulement teinte).

Dans `rev01.css`, remplacer :
```css
.mechanism-diagram-node--decision {
  border: 1px solid var(--accent-dark-border);
  background: var(--carbon);
}
```
par :
```css
.mechanism-diagram-node--decision {
  border: 1px solid var(--rule-d);
  background: var(--carbon);
}
```
(seule la couleur de bordure change, `var(--rule-d)` au lieu de
`var(--accent-dark-border)` — identique à `--control` désormais. Le fond
`--carbon`, plus sombre que le `--carbon2` des trois autres nœuds, reste la
seule différence visuelle du nœud décision : une profondeur qui signale
« installé, réglé », sans utiliser la couleur réservée à l'action requise.)
Confirmer qu'aucun nœud du schéma ne porte plus `var(--accent-dark-border)` :
`grep -n "accent-dark-border" src/app/'(rev01)'/rev01.css` doit encore
matcher son usage légitime ailleurs sur le site (boutons, focus), mais plus
dans le bloc `.mechanism-diagram-node--*`.

## Vérification à livrer dans la PR

1. `grep -n "—" src/app/'(rev01)'/systems/page.tsx src/system/components/MechanismSchema.tsx src/app/'(rev01)'/rev01.css` → aucun résultat nouveau.
2. `grep -n "position: fixed" src/app/'(rev01)'/rev01.css` → ne doit plus matcher `.cmdbar` (les autres, `.opening`/`.cmd-panel`/etc., restent fixes, c'est voulu).
3. `grep -n "padding-top: 64px" src/app/'(rev01)'/rev01.css` → aucun résultat (la règle `body` a disparu).
4. `npm run build && npm run qa:brand:rev01` verts.
5. `npx next start -p 3210 &` puis `npm run qa:network:rev01` vert — corriger toute fixture périmée par les changements ci-dessus, ne jamais assouplir une assertion au-delà de ce qui a réellement changé. Portée particulière : le test renommé de `conformity-home.spec.ts` (§1), aucun autre test ne devrait bouger (la carte ajoutée en §2 vit hors des scopes `#capacites`/`.home-s-offers-grid` déjà comptés par les tests existants — vérifier que c'est bien le cas avant de conclure).
