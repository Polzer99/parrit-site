# SPEC — Recomposition réelle de l'en-tête + schéma relationnel sur /systems

Suite explicite de Paul (20/09/2026) après relecture de la PR #274 : « La bande
sombre fixe subsiste : retirer l'horloge et ajouter un bouton ne réalise pas
son remplacement. Recompose l'en-tête avec la grille et les éléments de marque
existants, une navigation sans doublon et une action principale claire. » et
« Le schéma doit montrer les relations entre sources, contrôles et décision.
Des dates exactes dans trois cartes ne suffisent pas à donner une direction
artistique distinctive. Ajoute un accès explicite depuis l'accueil. »

**Contrainte non négociable, comme sur les specs précédentes : zéro tiret
cadratin (—).** Aucun design system local, aucune nouvelle couleur, aucune
nouvelle famille de police, `position: fixed` de `.cmdbar` **conservé**
(testé et approuvé explicitement par `tests/conformity-home.spec.ts` :
`toHaveCSS("position", "fixed")` — ne pas le retirer, ce n'est pas ce qui est
demandé). Ce qui change : la composition interne, pas le mécanisme de
positionnement.

## 1. En-tête — recomposition réelle

### 1a. Aligner le contenu sur la grille réelle du site (pas de padding brut)

Aujourd'hui `.cmdbar` utilise `padding: 0 20px` : son contenu colle aux bords
de l'écran, sans rapport avec la colonne `max-width: 1160px` que toutes les
autres sections utilisent (`.r2-wrap`, `.home-s-wrap`). Corriger dans
`src/system/components/RevHeader.tsx` : envelopper le contenu actuel du
`<header className="cmdbar">` dans un `<div className="cmdbar-inner">` (le
`<header>` garde le fond sombre plein bord, `cmdbar-inner` porte la largeur).

Dans `rev01.css`, remplacer la règle `.cmdbar { ... padding: 0 20px; ... }`
par (fond seul, plus de padding horizontal direct) :
```css
.cmdbar {
  position: fixed;
  z-index: 50;
  inset: 0 0 auto;
  border-bottom: 1px solid var(--rule-d);
  background: rgba(10, 11, 12, .92);
  backdrop-filter: blur(8px);
}

.cmdbar-inner {
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: 1160px;
  height: 64px;
  margin: 0 auto;
  padding: 0 40px;
}

@media (max-width: 760px) {
  .cmdbar-inner {
    padding: 0 20px;
  }
}
```
(reprend exactement le motif `max-width: 1160px` + `padding: 0 40px` /
`0 20px` sous 760px déjà utilisé par `.r2-wrap`.)

### 1b. Hauteur 52px → 64px, partout où elle est référencée pour l'en-tête

Un en-tête plus sobre a besoin de respirer. Remplacer **exactement et
uniquement** ces occurrences de `52px` (ne pas toucher les autres `52px` du
fichier — `.quick-capture { gap: 52px }`, `.home-s-build-grid { margin-top:
52px }`, `.home-s-journal ol { margin: 52px 0 36px }`, `.quick-fields input {
min-height: 52px }` : ces quatre-là sont des espacements sans rapport avec la
hauteur de l'en-tête, ne pas y toucher) :

- `body { padding-top: 52px; }` → `64px`
- `.opening { inset: 52px 0 0; min-height: calc(100vh - 52px); }` → `64px` aux deux endroits
- `.cmd-panel { inset: 52px 0 0; ... }` → `64px`
- `.home-s-hero { min-height: calc(100svh - 52px); ... }` → `64px`
- Les deux commentaires qui mentionnent « cmdbar de 52px » / « 52px bar » → mettre à jour le chiffre pour rester exacts.

### 1c. Navigation sans doublon, une seule action principale

Aujourd'hui `NAV` (dans `RevHeader.tsx`) contient trois entrées : `Journal`,
`Commande` (→ `/commission`) et `Votre prototype` (→ `/#prototype`) — plus le
bouton `.cmd-cta` ajouté en PR #274, qui pointe **aussi** vers `/commission`.
`Commande` et le bouton principal mènent à la même destination : doublon.
`Votre prototype` perdait sa raison d'être de lien de navigation depuis que
la démonstration vit directement dans le premier écran de l'accueil (PR
#274) : elle n'a plus besoin d'un raccourci de saut de page, elle est déjà
visible à l'arrivée.

Remplacer la constante `NAV` par :
```tsx
const NAV = {
  en: [
    ["/journal", "Journal"],
    ["/systems", "Systems"],
  ],
  fr: [
    ["/journal", "Journal"],
    ["/systems", "Systèmes"],
  ],
} as const;
```
Cela retire la logique `cmd-nav-prototype` devenue inutile (la classe
`href === "/#prototype"` dans les deux boucles `.map` de `RevHeader.tsx`,
desktop et mobile) : simplifier ces deux boucles pour ne plus tester ce cas
particulier (il n'existe plus dans `NAV`). Le bouton `.cmd-cta`/`.cmd-panel-cta`
« Parlons-en »/« Let's talk » → `/commission` reste la SEULE porte vers la
prise de rendez-vous, dans la barre desktop et le panneau mobile — ne pas le
dupliquer dans `NAV`.

Résultat : nav = `Journal`, `Systèmes` (accès explicite au chantier `/systems`
depuis TOUTES les pages, y compris l'accueil — répond directement à la
demande « ajoute un accès explicite depuis l'accueil ») + une seule action
`Parlons-en`.

### 1d. Tests à mettre à jour (structure changée intentionnellement, ne pas assouplir une assertion au-delà de ce qui a changé)

- `tests/conformity-home.spec.ts` : `toHaveCSS("height", "52px")` → `"64px"`.
- `tests/conformity-home.spec.ts`, test `"command bar nav items share one text baseline"` : `expect(centres.length).toBeGreaterThanOrEqual(3)` → `toBe(2)` (2 liens de nav désormais, `Journal` et `Systèmes` ; le bouton `.cmd-cta` n'est pas un `.cmd-nav a`, il reste hors de ce test par construction).
- `tests/conformity-i18n.spec.ts` : `await expect(page.locator('.cmd-nav a[href="/fr/commission"]')).toHaveCount(1);` → cette assertion vérifiait que `/commission` était atteignable depuis la nav ; ce n'est plus dans `.cmd-nav`, c'est dans `.cmd-cta`. Remplacer par `await expect(page.locator('.cmd-cta[href="/fr/commission"]')).toHaveCount(1);`.
- Vérifier avec `grep -rn "cmd-nav-prototype\|#prototype" tests/*.spec.ts` s'il existe d'autres assertions sur ce lien de nav disparu ; les adapter à la même logique (le lien n'existe plus dans la nav, la démonstration reste accessible directement dans le premier écran de l'accueil).
- Ajouter une assertion nouvelle dans `tests/conformity-i18n.spec.ts` ou `tests/systems.spec.ts` (au choix du meilleur emplacement) : un lien `.cmd-nav a[href="/systems"]` (et `/fr/systems`) existe sur la page d'accueil.

## 2. `/systems` — remplacer les 3 cartes par un schéma relationnel

Le composant `src/system/components/MechanismSchema.tsx` (3 cartes côte à
côte, chacune avec un chiffre) ne montre aucune relation entre les éléments :
c'est une liste, pas un schéma. Le refaire pour montrer explicitement le flux
réel : **deux sources → un contrôle → une décision**, dans cet ordre, avec des
flèches qui relient visuellement les blocs (pas seulement une grille à filet).

Remplacer entièrement le contenu de `MechanismSchema.tsx` par :
```tsx
import type { Locale } from "../locale";
import { K } from "./K";

const COPY = {
  fr: {
    label: "Le mécanisme, vérifié",
    sourceCanonical: ["La source qui doit faire foi", "Notre application interne."],
    sourceLegacy: ["Ce qui écrit encore à côté", "Onze anciens outils, dont une synchronisation toutes les 15 minutes."],
    control: ["Deux contrôles", "Un verrou empêche tout nouveau point d'écriture non déclaré depuis le 13 septembre 2026. Un audit périodique, comme celui du 11 septembre, compare les deux sources : il a trouvé 114 fiches présentes seulement côté ancien système."],
    decision: ["Décision humaine, datée", "Le fondateur tranche, un type d'information à la fois. Une décision déjà prise et datée, comme celle du 14 septembre."],
  },
  en: {
    label: "The mechanism, verified",
    sourceCanonical: ["The source meant to be trusted", "Our internal application."],
    sourceLegacy: ["What still writes alongside it", "Eleven older tools, including a sync job running every 15 minutes."],
    control: ["Two checks", "A gate has blocked any new undeclared write path since September 13, 2026. A periodic audit, like the one run on September 11, compares both sources: it found 114 records that existed only in the old system."],
    decision: ["Human decision, dated", "The founder decides, one type of information at a time. A decision already made and dated, like the one on September 14."],
  },
} as const;

export function MechanismSchema({ locale = "en" }: { locale?: Locale }) {
  const copy = COPY[locale];
  const ariaLabel = locale === "fr"
    ? "Schéma : deux sources se rejoignent dans un contrôle, qui alimente une décision humaine."
    : "Diagram: two sources feed into a check, which feeds into a human decision.";
  return (
    <div className="mechanism-diagram" role="img" aria-label={ariaLabel}>
      <K className="mechanism-diagram-label">{copy.label}</K>
      <div className="mechanism-diagram-sources">
        <div className="mechanism-diagram-node mechanism-diagram-node--canonical">
          <h3>{copy.sourceCanonical[0]}</h3>
          <p>{copy.sourceCanonical[1]}</p>
        </div>
        <div className="mechanism-diagram-node mechanism-diagram-node--legacy">
          <h3>{copy.sourceLegacy[0]}</h3>
          <p>{copy.sourceLegacy[1]}</p>
        </div>
      </div>
      <div className="mechanism-diagram-arrow" aria-hidden="true">↓</div>
      <div className="mechanism-diagram-node mechanism-diagram-node--control">
        <h3>{copy.control[0]}</h3>
        <p>{copy.control[1]}</p>
      </div>
      <div className="mechanism-diagram-arrow" aria-hidden="true">↓</div>
      <div className="mechanism-diagram-node mechanism-diagram-node--decision">
        <h3>{copy.decision[0]}</h3>
        <p>{copy.decision[1]}</p>
      </div>
    </div>
  );
}
```

**CSS** dans `rev01.css` : supprimer entièrement l'ancien bloc `.mechanism-schema`
/ `.mechanism-schema-step` (et sa media query `max-width: 760px`), le
remplacer par :
```css
.mechanism-diagram {
  margin: 32px 0;
}

.mechanism-diagram-label {
  display: block;
  margin-bottom: 16px;
  color: var(--g4);
}

.mechanism-diagram-sources {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  background: var(--rule-d);
  border: 1px solid var(--rule-d);
}

.mechanism-diagram-node {
  padding: 24px;
  background: var(--carbon2);
}

.mechanism-diagram-node--legacy {
  border-top: 2px dashed var(--rule-d);
}

.mechanism-diagram-node h3 {
  margin: 0 0 8px;
  color: var(--paper);
  font-size: var(--t-m);
}

.mechanism-diagram-node p {
  margin: 0;
  color: var(--label-d);
  line-height: 1.6;
}

.mechanism-diagram-node--control {
  border: 1px solid var(--accent-dark-border);
}

.mechanism-diagram-node--decision {
  border: 1px solid var(--rule-d);
  background: var(--carbon);
}

.mechanism-diagram-arrow {
  display: flex;
  justify-content: center;
  margin: 4px 0;
  color: var(--g4);
  font-family: var(--mono);
  font-size: 20px;
  line-height: 1;
}

@media (max-width: 760px) {
  .mechanism-diagram-sources {
    grid-template-columns: 1fr;
  }
}
```
Notes de composition : `--legacy` porte une bordure supérieure en tirets
(seule exception au « zéro décoration » : elle signale visuellement « pas la
source qui fait foi », un signifiant fonctionnel, pas ornemental) ; `--control`
porte la seule bordure en couleur d'accent de tout le schéma (loi de
l'accent : ceci est le nœud qui déclenche une vérification active) ; les
flèches `↓` sont du texte, pas des images, pas de SVG à maintenir. Zéro
dégradé, zéro ombre, radius 0 — conforme au canon existant.

**Test de distinctivité (§60, obligatoire avant de livrer)** : relire le
rendu final (texte des 4 blocs + disposition) avec la question exacte :
« en changeant seulement le nom et le logo, ce schéma serait-il publiable pour
une autre agence ? ». Le sourcing (onze outils, 13/11/14 septembre) doit
rester visible et vérifiable dans le rendu, pas seulement dans le code.

## Vérification à livrer dans la PR

1. `grep -n "—" src/system/components/RevHeader.tsx src/system/components/MechanismSchema.tsx src/app/'(rev01)'/rev01.css` → aucun résultat nouveau (le commentaire déjà substitué en PR #274 reste substitué).
2. `grep -n "mechanism-schema\b" src/app/'(rev01)'/rev01.css src/app/'(rev01)'/systems/page.tsx tests/systems.spec.ts` → aucun résultat (classe entièrement remplacée par `mechanism-diagram`, y compris dans les tests qui la référencent).
3. `grep -n "cmd-nav-prototype\|Commande\"\|Votre prototype\|\"Commission\"" src/system/components/RevHeader.tsx` → aucun résultat.
4. `npm run build && npm run qa:brand:rev01` verts.
5. `npx next start -p 3210 &` puis `npm run qa:network:rev01` vert — corriger toute fixture périmée par la structure ci-dessus (hauteur, nombre de liens nav, emplacement du lien `/commission`, classe `mechanism-schema` → `mechanism-diagram`), ne jamais assouplir une assertion au-delà de ce qui a réellement changé.
