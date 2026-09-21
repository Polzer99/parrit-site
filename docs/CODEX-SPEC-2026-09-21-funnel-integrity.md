# SPEC — Intégrité du funnel (besoin ↔ scénario ↔ envoi)

Branche : `codex/funnel-integrity`. Base : `origin/main` (`6a5acd8`).

## Contexte

Bug reproduit par Paul sur `/fr` : saisir « Préparer le reporting hebdomadaire »
puis Esquisser, puis saisir « Suivre les paiements des factures » puis
Esquisser de nouveau — le scénario affiché passe bien aux factures, mais le
champ du formulaire (`QuickCapture`, champ `quick-idee`) conserve l'ancien
texte. Cause : `QuickCapture` initialise son état `idee` avec
`useState(initialIdee ?? "")` — un état React ne se resynchronise jamais tout
seul quand une prop change, seulement à l'initialisation. Le composant reste
monté entre deux esquisses (il vit dans le même emplacement de l'arbre), donc
`initialIdee` change sans que `idee` ne suive.

Deux autres corrections dans ce même lot : le vocabulaire « prototype » qui
survit sous le formulaire après l'esquisse (incohérent avec la distinction
déjà établie ailleurs entre exemple illustratif / demande enregistrée), et le
lien `/commission` du brouillon mail français qui pointe vers le parcours
anglais.

## Fichier 1 — `src/system/components/QuickCapture.tsx`

Ajouter un `useEffect` qui resynchronise `idee` (et `ideaRevealed`) chaque fois
que `initialIdee` change — c'est-à-dire chaque nouvelle esquisse, jamais une
frappe locale dans le champ lui-même puisque celle-ci ne touche pas la prop.
Une édition directe du récapitulatif par l'utilisateur reste donc préservée
(l'effet ne se redéclenche pas tant que `initialIdee` ne change pas), et
l'e-mail déjà saisi n'est jamais touché par cet effet.

Remplacer :

```tsx
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocusEmail) emailRef.current?.focus();
  }, [autoFocusEmail]);
```

par :

```tsx
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocusEmail) emailRef.current?.focus();
  }, [autoFocusEmail]);

  // Une nouvelle esquisse change `initialIdee` : le récapitulatif doit suivre.
  // Une frappe locale dans le champ ne touche jamais cette prop, donc une
  // modification directe du récapitulatif par l'utilisateur n'est jamais
  // écrasée par cet effet. L'e-mail n'est pas concerné.
  useEffect(() => {
    if (initialIdee !== undefined) {
      setIdee(initialIdee);
      setIdeaRevealed(true);
    }
  }, [initialIdee]);
```

Aucun autre changement dans ce fichier.

## Fichier 2 — `src/system/engagements.ts`

Remplacement intégral :

```ts
/* Les promesses du funnel vivent ICI et nulle part ailleurs. Une promesse
   dupliquée finit par diverger : c'est ce qui est arrivé avant le 09/09/2026,
   où la même ligne existait en quatre formulations selon la page.

   Corrigé le 21/09/2026 (audit funnel) : « prototype » surpromettait un
   livrable personnalisé à ce stade du parcours, alors qu'il s'agit d'un
   exemple illustratif suivi d'une revue humaine — jamais d'un prototype
   fabriqué automatiquement pour chaque entreprise. */

import type { Locale } from "@/system/locale";

export const ENGAGEMENTS = {
  en: {
    reponsePersonnelle: "One personal reply per company",
    aucuneSequence: "No automated sequence",
  },
  fr: {
    reponsePersonnelle: "Une réponse personnelle par entreprise",
    aucuneSequence: "Aucune séquence automatique",
  },
} as const;

export function noteFunnel(locale: Locale, variante: "hero" | "standard"): string {
  const e = ENGAGEMENTS[locale];
  if (variante === "hero") return e.reponsePersonnelle;
  return `${e.reponsePersonnelle} · ${e.aucuneSequence}`;
}
```

`QuickCapture.tsx` importe déjà `noteFunnel` par son nom — aucun changement
d'appelant nécessaire, seul le contenu affiché change.

## Fichier 3 — `src/lib/server/interets.ts`

Dans `poserCarteSuperApp`, remplacer le bloc suivant :

```ts
  const sketchUrl = `https://parrit.ai/sketch/${contexte.submissionId}`;
  const fr = contexte.lang === "fr";
  const objet = fr
    ? "Votre système d'exploitation · première esquisse"
    : "Your operating system · first sketch";
  const idee = contexte.idee
    ? (fr
      ? ` Vous parliez de : "${contexte.idee}".`
      : ` You mentioned: "${contexte.idee}".`)
    : "";
  const brouillon = fr
    ? `Bonjour,

Vous avez laissé votre adresse sur parrit.ai.${idee} Voici la première esquisse de votre système : ${sketchUrl}

Un examen de 15 minutes, en visio, la précise :
https://parrit.ai/commission

Paul Larmaraud · Parrit.ai`
    : `Hello,

You left your address on parrit.ai.${idee} Here is the first sketch of your system: ${sketchUrl}

A 15-minute examination, on a video call, sharpens it:
https://parrit.ai/commission

Paul Larmaraud · Parrit.ai`;
```

par :

```ts
  const sketchUrl = `https://parrit.ai/sketch/${contexte.submissionId}`;
  const fr = contexte.lang === "fr";
  // Le brouillon français doit renvoyer vers le parcours français, jamais
  // vers l'anglais (corrigé le 21/09/2026).
  const commissionUrl = fr ? "https://parrit.ai/fr/commission" : "https://parrit.ai/commission";
  const objet = fr
    ? "Un exemple pour votre besoin"
    : "An example for what you described";
  const idee = contexte.idee
    ? (fr
      ? ` Vous parliez de : "${contexte.idee}".`
      : ` You mentioned: "${contexte.idee}".`)
    : "";
  const brouillon = fr
    ? `Bonjour,

Vous avez laissé votre adresse sur parrit.ai.${idee} Voici un exemple illustratif, proche de votre besoin, pas une analyse de votre entreprise : ${sketchUrl}

Un examen de 15 minutes, en visio, la précise :
${commissionUrl}

Paul Larmaraud · Parrit.ai`
    : `Hello,

You left your address on parrit.ai.${idee} Here is an illustrative example, close to your need, not an analysis of your company: ${sketchUrl}

A 15-minute examination, on a video call, sharpens it:
${commissionUrl}

Paul Larmaraud · Parrit.ai`;
```

Puis, dans le tableau `texte` (note interne de la carte super app, jamais vue
par le prospect), remplacer la ligne :

```ts
    ...(contexte.idee ? [`Idée du prototype : ${contexte.idee}`] : []),
```

par :

```ts
    ...(contexte.idee ? [`Besoin décrit : ${contexte.idee}`] : []),
```

(Cohérence de vocabulaire interne : le mot « prototype » ne doit plus
apparaître nulle part dans ce parcours tant qu'aucun système n'a été
réellement livré.)

Aucun autre changement dans ce fichier.

## Vérification attendue

- `npm run build`, `npm run qa:brand:rev01`, `npm run qa:network:rev01` verts.
- Test manuel (moi, après merge) : sur `/fr`, saisir un premier besoin,
  Esquisser, constater le récapitulatif préremplit ; saisir un second besoin
  différent, Esquisser à nouveau, constater que le récapitulatif affiche
  désormais le SECOND besoin (pas le premier) et que le scénario/catégorie
  envoyée correspond au second. Éditer directement le récapitulatif, constater
  que l'édition survit. Remplir l'e-mail avant de refaire une esquisse,
  constater que l'e-mail n'est jamais perdu.
