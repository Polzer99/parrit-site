# SPEC — En-tête sobre, premier écran avec système visible, schéma vérifié sur /systems

Chantier demandé par Paul (20/09/2026) : « La reprise concerne aussi la direction
artistique du site. Le changement doit être visible dès l'arrivée sur l'accueil
[...] Le premier écran doit permettre de voir quelque chose du système annoncé. »
Puis, dans le même message : « Applique la règle anti-slop existante dès cette
conception [...] Livre des captures comparables avant/après. »

**Contrainte non négociable, comme sur les specs précédentes : zéro tiret
cadratin (—).** Aucun design system local, aucune nouvelle couleur, aucune
nouvelle famille de police : réutiliser exclusivement les tokens déjà déclarés
dans `src/system/tokens.css` et les classes déjà existantes (`K`, `.rev-button
.exec`, `var(--rule-d)`, `var(--carbon2)`, etc.). Ne PAS toucher au registre
`prototype REV 03` (`docs/site-prod-rev01/parrit-command-center-rev03.html`) :
ce fichier reste l'archive de la version approuvée à l'époque, la mise à jour
du canon écrit se fait séparément par Claude dans `AGENTS.md`.

## 1. En-tête — `src/system/components/RevHeader.tsx` + `src/app/(rev01)/rev01.css`

**Retirer l'horloge live.** Elle n'apporte aucune information au visiteur et
alourdit la barre. Concrètement dans `RevHeader.tsx` :
- Supprimer l'état `clock`, le `useEffect` qui le met à jour chaque seconde, et
  l'élément `<time className="clock">`.
- Dans `rev01.css`, supprimer les 4 règles `.clock { ... }` (la déclaration de
  base ligne ~151, et les 3 surcharges dans les media queries ~1280, ~1296) :
  elles deviennent mortes.

**Ajouter une action principale.** La barre n'a aujourd'hui aucun bouton
d'action, seulement des liens de navigation. Ajouter, juste après
`.locale-toggle` et avant `.cmd-menu-toggle`, un lien `Link` :
```tsx
<Link className="cmd-cta rev-button exec" href={localizedPath("/commission", locale)}>
  {locale === "fr" ? "Parlons-en" : "Let's talk"}
</Link>
```
Dans `rev01.css`, ajouter une règle `.cmd-cta` juste après le bloc
`.locale-toggle button:focus-visible` (~ligne 189) :
```css
.cmd-cta {
  padding: 8px 16px;
  font-size: var(--t-k);
}
```
(le bouton hérite déjà de `.rev-button.exec` pour la couleur/le fond ; cette
règle ne fait que le faire tenir dans la hauteur de 52px de la barre.)

**Mobile : garder l'action accessible, ne pas surcharger.** Dans la media
query `@media (max-width: 760px)` existante (~ligne 1286), ajouter `.cmd-cta {
display: none; }` à côté de `.clock { display: none; }` restant (si le clock
rule y est supprimé, ajouter `.cmd-cta` à sa place dans le même bloc) : sous
760px, seuls le wordmark, la langue et le bouton menu restent dans la barre.
Ajouter ensuite le lien équivalent DANS le panneau mobile (`cmd-panel`) : dans
`RevHeader.tsx`, après la boucle `nav.map(...)` qui liste les liens dans le
`<nav className="cmd-panel...">`, ajouter le même `Link` vers `/commission`
avec la classe `cmd-panel-cta` (nouvelle classe, pas `cmd-nav-prototype`,
pour ne pas hériter du style de lien secondaire). Dans `rev01.css`, ajouter
juste après le bloc `.cmd-panel a:focus-visible` (~ligne 1387) :
```css
.cmd-panel-cta {
  margin-top: 12px;
  border: 0 !important;
}
```
(réutilise `.cmd-panel a` pour le reste : couleur, police, transition ; le
`!important` neutralise juste la bordure de séparation des liens de nav, qui
n'a pas de sens sur un bouton d'action.)

Résultat attendu : la barre garde ses 52px, son fond sombre, son wordmark, sa
nav et son sélecteur de langue — mais elle n'affiche plus une horloge qui
tourne, et elle porte désormais une action claire. C'est la seule modification
de composition demandée pour l'en-tête ; ne pas changer la hauteur, la
typographie ou la couleur au-delà de ce qui est écrit ici.

## 2. Premier écran de l'accueil — `src/app/(rev01)/page.tsx`

Aujourd'hui, le premier écran (`section.home-s-hero`, `min-height: calc(100svh
- 52px)`) ne contient que le kicker, le H1, le sous-titre et un formulaire de
capture d'e-mail (`QuickCapture`). La démonstration réelle du système (le
composant `AgentEsquisse`, qui esquisse en direct Signal/Décision/Action à
partir d'une phrase tapée par le visiteur) vit dans une **section séparée, en
dessous**, invisible sans défiler. Paul demande que le premier écran montre
« quelque chose du système annoncé » : ce quelque chose existe déjà et
fonctionne (`AgentEsquisse`), il est seulement mal placé.

**Fusionner les deux sections.** Dans `HomePage()` :
1. Supprimer la section `<section className="home-s-agent r2-dark">` (celle
   qui contient uniquement `<AgentEsquisse locale={locale} />`).
2. À l'intérieur de `<section className="home-s-hero r2-dark">`, déplacer
   `<AgentEsquisse locale={locale} />` pour qu'il apparaisse **entre**
   `<p className="home-s-hero-sub">{copy.hero.sub}</p>` et
   `<QuickCapture locale={locale} id="prototype" hero />` (donc avant le
   formulaire de capture, pas après).
3. Dans `rev01.css`, supprimer la règle `.home-s-agent { padding: 0 0 64px; }`
   (section supprimée, règle morte). Ajouter à la place, juste avant la règle
   `.home-s-quick-capture` (~ligne 1722), une règle de respiration :
```css
.home-s-hero .agent-esquisse {
  margin: 40px auto 0;
}
```

**Corriger le texte qui référence la position.** Le texte de clôture
d'`AgentEsquisse` dit aujourd'hui « Laissez votre e-mail **ci-dessus** » (FR)
/ « Leave your e-mail **above** » (EN), et son lien pointe vers `#prototype`
(l'ancre du formulaire `QuickCapture`). Comme le formulaire passe maintenant
**après** le composant dans l'ordre de lecture, corriger dans
`src/system/components/AgentEsquisse.tsx` :
- FR, `close`: remplacer `"La version complète se construit après l'Examen. Laissez votre e-mail ci-dessus : le prototype arrive"` par `"La version complète se construit après l'Examen. Laissez votre e-mail ci-dessous : le prototype arrive"`
- EN, `close`: remplacer `"The full version is built after the Examination. Leave your e-mail above: the prototype arrives"` par `"The full version is built after the Examination. Leave your e-mail below: the prototype arrives"`

Le lien `href="#prototype"` ne change pas (il pointe toujours vers le bon
champ, qui est maintenant plus bas dans la page, donc l'ancre reste correcte).

Résultat attendu : au chargement de l'accueil, sans défiler, un visiteur voit
le H1, le sous-titre, puis un encadré interactif où il peut taper une phrase et
recevoir en direct un aperçu Signal/Décision/Action. C'est une démonstration
réelle du système, pas une image.

## 3. Présence visuelle sur `/systems` — nouveau composant `MechanismSchema`

`/systems` décrit un mécanisme réel (vérifié dans
`docs/CODEX-SPEC-2026-09-20-systems-editorial-corrections.md`) mais ne le
montre nulle part visuellement. Ajouter un schéma minimal, construit
uniquement à partir de faits déjà écrits sur la page (aucune nouvelle
affirmation) : pas une image, pas une capture, un schéma en trois blocs.

**Créer `src/system/components/MechanismSchema.tsx`** :
```tsx
import type { Locale } from "../locale";
import { K } from "./K";

const STEPS = {
  fr: [
    ["Écriture", "Un contact, un rendez-vous ou un dossier est créé, ici ou dans un ancien outil."],
    ["Deux contrôles", "Un verrou bloque tout nouveau point d'écriture non déclaré. Un audit périodique compare les deux sources."],
    ["Décision humaine", "Le fondateur tranche, un type d'information à la fois, et la date est notée."],
  ],
  en: [
    ["Write", "A contact, a meeting, or a file gets created, here or in an older tool."],
    ["Two checks", "A gate blocks any new undeclared write path. A periodic audit compares both sources."],
    ["Human decision", "The founder decides, one type of information at a time, and the date gets logged."],
  ],
} as const;

export function MechanismSchema({ locale = "en" }: { locale?: Locale }) {
  const steps = STEPS[locale];
  return (
    <div className="mechanism-schema" role="img" aria-label={locale === "fr" ? "Le mécanisme, en trois temps : écriture, deux contrôles, décision humaine." : "The mechanism, in three steps: write, two checks, human decision."}>
      {steps.map(([label, body], index) => (
        <div className="mechanism-schema-step" key={label}>
          <K>{String(index + 1).padStart(2, "0")}</K>
          <h3>{label}</h3>
          <p>{body}</p>
        </div>
      ))}
    </div>
  );
}
```

**L'insérer dans `src/app/(rev01)/systems/page.tsx`**, dans la section
`operating-view`, juste après le `<p>` du narrative et avant le
`<RegistrySnapshot>` :
```tsx
<p style={{ lineHeight: 1.8 }}>{evidence.narrative}</p>
<MechanismSchema locale={locale} />
<RegistrySnapshot locale={locale} asOf="2026-09-13" rows={ROWS[locale]} summaryText={copy.summaryText} />
```
Ajouter l'import : `import { MechanismSchema } from "@/system/components/MechanismSchema";`

**CSS dans `rev01.css`**, ajouter après le bloc `.registry-snapshot` existant
(chercher la règle `.registry-snapshot table` ou équivalent, et l'ajouter à la
suite) :
```css
.mechanism-schema {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin: 32px 0;
  border: 1px solid var(--rule-d);
  background: var(--rule-d);
}

.mechanism-schema-step {
  padding: 24px;
  background: var(--carbon2);
}

.mechanism-schema-step h3 {
  margin: 12px 0 8px;
  color: var(--paper);
  font-size: var(--t-m);
}

.mechanism-schema-step p {
  margin: 0;
  color: var(--label-d);
  line-height: 1.6;
}

@media (max-width: 760px) {
  .mechanism-schema {
    grid-template-columns: 1fr;
  }
}
```
(reprend exactement le patron déjà utilisé par `.agent-esquisse-cells` :
grille à filet 1px, fond carbone, aucune nouvelle couleur.)

## Test de distinctivité (anti-slop, exigence de Paul du même message)

Avant de livrer, faire relire par Codex en lecture seule le rendu final de la
section (texte des 3 blocs + en-tête) avec la question exacte : « en changeant
seulement le nom et le logo, pourrait-on publier exactement cette pièce pour
une autre agence ? ». Si la réponse est oui, la reprendre avant de livrer.

## Vérification à livrer dans la PR

1. `grep -n "clock" src/system/components/RevHeader.tsx src/app/'(rev01)'/rev01.css` → aucune règle `.clock` restante (seul un éventuel commentaire est toléré).
2. `grep -n "home-s-agent" src/app/'(rev01)'/page.tsx src/app/'(rev01)'/rev01.css` → aucun résultat.
3. `grep -n "—" src/system/components/RevHeader.tsx src/system/components/AgentEsquisse.tsx src/system/components/MechanismSchema.tsx src/app/'(rev01)'/page.tsx src/app/'(rev01)'/systems/page.tsx` → aucun résultat.
4. `npm run build && npm run qa:brand:rev01` verts.
5. `npx next start -p 3210 &` puis `npm run qa:network:rev01` vert — si un test échoue parce qu'il vérifie l'ancienne structure (ex. présence de `.clock`, position de `AgentEsquisse`), corriger le test pour refléter la nouvelle structure réelle, ne jamais l'assouplir au-delà de ce qui a changé.
