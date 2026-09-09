# SPEC · Alignement du parcours prototype : splash, cadratin, promesses centralisées

Date : 2026-09-09. Ordre Paul : « Commission, votre prototype, tout ça ne s'est
pas aligné » + « "un prototype par entreprise", "préparé à la main" : il faut
centraliser » + exigence grands comptes : **zéro coquille, zéro erreur**.

Trois corrections, trois fichiers touchés, aucune autre.

## 1. Retirer le splash de la page d'esquisse

**Constat prouvé** (captures prod du 09/09) : `/sketch/[id]` affiche pendant
2,6 secondes un écran noir de « boot log » qui recouvre toute la page ; le
prospect qui vient de laisser son e-mail attend devant du vide avant de voir son
esquisse. C'est exactement l'interdit visuel écrit du canon : **« préchargement
long avant le message »**. Le même composant (`className="opening"`) a déjà été
retiré du rendu de la home sur décision de Paul le 06/09.

Dans `src/app/(rev01)/sketch/[id]/page.tsx` :
- supprimer l'import `SketchBoot` et l'élément `<SketchBoot company={company} />` ;
- le fragment `<>...</>` qui n'enveloppe plus qu'un seul enfant redevient le
  `<main>` seul.

Ne PAS supprimer le fichier `src/system/components/SketchBoot.tsx` : il reste
dans le dépôt, non rendu, comme `Opening`. Ajouter en tête de ce fichier un
commentaire d'une ligne : `/* NON RENDU depuis le 09/09/2026 : interdit visuel
« préchargement long avant le message ». Conservé comme Opening. */`

## 2. Supprimer le tiret cadratin visible de l'esquisse

Toujours dans `sketch/[id]/page.tsx`, entrée `full-os`, la ligne d'instrument
porte `value: "€ —"`. Le tiret cadratin est interdit dans tout texte public
Parrit, et le rendu donne un « € — » qui se lit comme un gabarit cassé.

Remplacer par une valeur qui n'invente aucun montant et reste cohérente avec ses
voisines (`"3"`, `"7"`) :

```ts
{ value: "1", label: "exposure surfaced with its cause and the one decision it requires", status: "ACTION", critical: true },
```

Vérifier qu'aucun autre tiret cadratin ne subsiste dans une chaîne AFFICHÉE de
`src/` (les commentaires de code ne sont pas concernés).

## 3. Centraliser les promesses du funnel

**Constat** : la même promesse existe en trois variantes dispersées —
`QuickCapture.tsx` ligne 17 (`One prototype per company · No automated
sequence`), ligne 33 (la version FR), et ligne 150 une ternaire inline qui
produit une QUATRIÈME formulation pour le hero (`Prepared by hand` / `Préparé à
la main`). `AgentEsquisse.tsx` répète « préparé à la main » dans son texte de
clôture.

Créer `src/system/engagements.ts` — source unique des promesses du funnel :

```ts
/* Les promesses du funnel vivent ICI et nulle part ailleurs. Une promesse
   dupliquée finit par diverger : c'est ce qui est arrivé avant le 09/09/2026,
   où la même ligne existait en quatre formulations selon la page. */

import type { Locale } from "@/system/locale";

export const ENGAGEMENTS = {
  en: {
    unProtoParEntreprise: "One prototype per company",
    prepareALaMain: "Prepared by hand",
    aucuneSequence: "No automated sequence",
  },
  fr: {
    unProtoParEntreprise: "Un prototype par entreprise",
    prepareALaMain: "Préparé à la main",
    aucuneSequence: "Aucune séquence automatique",
  },
} as const;

export function noteFunnel(locale: Locale, variante: "hero" | "standard"): string {
  const e = ENGAGEMENTS[locale];
  const second = variante === "hero" ? e.prepareALaMain : e.aucuneSequence;
  return `${e.unProtoParEntreprise} · ${second}`;
}
```

Puis :
- `QuickCapture.tsx` : supprimer `note` des deux dictionnaires et la ternaire
  inline ; appeler `noteFunnel(locale, hero ? "hero" : "standard")`.
- `AgentEsquisse.tsx` : la phrase de clôture garde son sens mais reprend le
  terme centralisé, en composant avec `ENGAGEMENTS[locale].prepareALaMain` en
  minuscule initiale plutôt qu'en le réécrivant à la main.

**Les textes affichés ne doivent pas changer.** Cette tranche déplace la vérité,
elle ne la réécrit pas : après le lot, les mêmes chaînes exactes s'affichent.

## Interdits de cette tranche

Ne pas toucher à la durée annoncée (« Thirty minutes », « 30 MIN ») : c'est un
engagement commercial, arbitrage de Paul, traité séparément. Ne pas toucher à
`ParritCalInline` ni à la page `/commission`. Ne pas changer un token, une
couleur, une police.

## Preuve attendue

`npm run lint`, `npx tsc --noEmit`, `npm run qa:brand:rev01` verts ; build OK ;
suite Playwright complète verte (le gate réseau tourne sur le serveur 3210 de
l'hôte) ; `grep -rn "—" src/ --include="*.tsx" --include="*.ts"` ne remonte plus
que des commentaires, aucune chaîne affichée.
