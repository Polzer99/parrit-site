# SPEC — Reprise du copywriting (accueil sous le premier écran + Build With You) (PR B / 2)

Source : `Audit Funnel Copywriting Sept 20 2026.md` (Paul, 21/09/2026),
étapes 3-4 (« Reprendre l'argumentaire commercial » / « Composer les pages »),
constats **F09, F10, F11**. **Cette spec suppose la PR A déjà mergée**
(continuité du parcours, justesse des durées/résultats/portée du contrôle) —
ne pas revenir dessus, ne pas la refaire.

**Doctrine à appliquer, ensemble, sur tout texte nouveau ci-dessous** :
REGLES-DOR §57 (corpus Carla — `~/parrit-os/docs/doctrine-communication/
CORPUS-CARLA-DE-PREVAL.md`, **privé : on écrit dans son style, on ne cite
JAMAIS une de ses phrases**) + §60 (test de distinctivité : « en changeant
seulement le nom et le logo, cette pièce serait-elle publiable pour une autre
agence ? »). Concrètement : phrases courtes qui tombent, une scène nommée
plutôt qu'une catégorie abstraite, un chiffre toujours avec sa date et sa
source, zéro superlatif, français pensé en français. **Ne réécris pas la
vision ni les sections déjà conformes** (hero, « La maison », « Le Journal »,
la clôture) : elles ont été relues et tiennent déjà ce niveau — le problème
n'est pas leur texte, c'est l'absence de preuve visible entre la promesse
(« Ce que nous construisons ») et l'offre.

**Contrainte inchangée : zéro tiret cadratin (—). Aucun prix ne change.
Aucune autorisation de publication ne change.**

---

## 1. Accueil — une section « La preuve » entre la promesse et l'offre (F09)

**Constat.** L'accueil promet une prise en charge large (« Ce que nous
construisons ») puis passe directement à l'offre, sans qu'aucune preuve ne
soit visible depuis la page d'accueil elle-même. `/systems` (le système
interne, daté, montré avec ses limites) et `/dossiers` (les cas clients,
anonymisés) existent déjà et font exactement ce travail de preuve — mais rien
sur l'accueil n'y renvoie en dehors du lien de navigation dans l'en-tête. Le
lecteur ne peut pas savoir, depuis l'accueil, où regarder pour vérifier une
affirmation.

**Correction : une nouvelle section, entre `home-s-build` et `home-s-offers`,
qui renvoie vers ces deux pages en reprenant MOT POUR MOT leurs titres déjà
approuvés — aucun texte nouveau n'est inventé, seule la navigation est
ajoutée.**

### `src/app/(rev01)/page.tsx`

Ajouter dans `DICT.fr`, après le bloc `build` et avant `offers` :
```ts
proof: {
  kicker: "La preuve",
  systems: { title: "Nous montrons le système. Vous jugez avant de vous engager.", cta: "Voir le système" },
  dossiers: { title: "Les dossiers s'ouvrent de vive voix.", cta: "Voir les dossiers" },
},
```
Ajouter dans `DICT.en`, au même endroit :
```ts
proof: {
  kicker: "The proof",
  systems: { title: "We show the system. You judge before you commit.", cta: "See the system" },
  dossiers: { title: "The dossiers open in conversation.", cta: "See the dossiers" },
},
```
(Ces quatre titres sont des citations EXACTES des `<h1>` déjà en production
sur `/systems` et `/dossiers`, dans les deux langues — vérifier l'exactitude
caractère pour caractère contre `src/app/(rev01)/systems/page.tsx` et
`src/app/(rev01)/dossiers/page.tsx` avant de committer.)

Insérer, entre la section `home-s-build` et la section `home-s-offers` du
JSX :
```tsx
<section className="home-s-proof" aria-label={copy.proof.kicker}>
  <div className="home-s-wrap">
    <K>{copy.proof.kicker}</K>
    <div className="home-s-proof-grid">
      <Link className="home-s-proof-item" href={localizedPath("/systems", locale)}>
        <h3>{copy.proof.systems.title}</h3>
        <span>{copy.proof.systems.cta} →</span>
      </Link>
      <Link className="home-s-proof-item" href={localizedPath("/dossiers", locale)}>
        <h3>{copy.proof.dossiers.title}</h3>
        <span>{copy.proof.dossiers.cta} →</span>
      </Link>
    </div>
  </div>
</section>
```
`localizedPath` est déjà importé en tête de fichier (`from
"@/system/locale"`) — vérifier, l'ajouter sinon.

**CSS**, dans `rev01.css`, section claire (registre « home-s », PAS `r2-dark`
— cette section vit entre deux sections déjà claires, `home-s-build` étant la
seule section sombre du groupe) :
```css
.home-s-proof {
  padding: 64px 0;
  border-bottom: 1px solid var(--rule-l);
}
.home-s-proof-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  background: var(--rule-l);
  margin-top: 24px;
}
.home-s-proof-item {
  display: block;
  background: var(--paper2);
  padding: 32px;
  text-decoration: none;
  color: inherit;
}
.home-s-proof-item span {
  display: inline-block;
  margin-top: 12px;
  font-family: var(--mono);
  font-size: var(--t-k);
  letter-spacing: .05em;
  color: var(--accent-text);
}
@media (max-width: 640px) {
  .home-s-proof-grid { grid-template-columns: 1fr; }
}
```
Pour le titre (`.home-s-proof-item h3`), réutiliser EXACTEMENT la même
échelle typographique que `.home-s-maison-copy h2` (même `font-size`, même
`font-weight`) — ne pas inventer un nouveau palier de titre. Vérifier au
rendu (desktop + mobile) que le contraste et l'espacement restent cohérents
avec `.home-s-brands`/`.home-s-maison` juste au-dessus et en dessous.

---

## 2. Build With You — décrire le travail livré, pas seulement sa durée (F11)

**Constat.** La page annonce un audit, une restitution, 10 heures et un
forfait, sans dire ce qui sort concrètement des 10 heures, ce que le
dirigeant doit apporter, ni ce qui se passe ensuite. Ces réponses existent
déjà ailleurs sur le site (Standard PS-05/PS-06, la section « La maison » de
l'accueil) : les reprendre plutôt que promettre au-delà de ce qui est écrit
ailleurs.

**Correction : remplacer intégralement `src/app/(rev01)/build-with-you/
page.tsx`.**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/lib/server/locale";
import { K, RegistryLine } from "@/system/components";
import { formatOfferPrice } from "@/system/components/OfferCard";
import { localizedAlternates, localizedOpenGraph, localizedPath } from "@/system/locale";

const DICT = {
  en: {
    metaTitle: "Build With You · Build with the founder",
    promise: "You want to leave with something that runs, built with you. Not an audit or a deck.",
    stepsTitle: "Build with the founder.",
    steps: [
      ["01", "Free examination", "The same 15-minute examination as every commission."],
      ["02", "Findings review", "30 minutes to review the findings together."],
      ["03", "Build together", "10 hours with the founder to build a working system."],
    ],
    outTitle: "What comes out of these 10 hours.",
    outBody: "Something that runs at the end, in your own tools, not a demo. Code, data and documentation are yours: your team runs it without us, like every system we deliver.",
    bringTitle: "What you bring.",
    bringBody: "One precise operation, not an audit of the whole company: the follow-up that quietly drops, the spreadsheet you copy out every week, the decision that always lands on your desk. You're in the room for the 10 hours: you decide, there's no project lead standing in for you.",
    nextTitle: "What happens next.",
    nextBody: "The system you build joins the next ones: every capability raises the value of the ones before it. If you want Parrit to build what comes next, a custom Commission starts at the same place.",
    nextLink: "See the custom system",
    basis: "fixed fee",
    cta: "Book the free examination",
  },
  fr: {
    metaTitle: "Build With You · Construire avec le fondateur",
    promise: "Vous voulez repartir avec quelque chose qui tourne, construit avec vous. Pas un audit ni un deck.",
    stepsTitle: "Construire avec le fondateur.",
    steps: [
      ["01", "Examen offert", "Le même examen de 15 minutes que toute commande."],
      ["02", "Restitution", "30 minutes pour reprendre les constats ensemble."],
      ["03", "Construction ensemble", "10 heures avec le fondateur pour construire un système qui tourne."],
    ],
    outTitle: "Ce qui sort de ces 10 heures.",
    outBody: "Une chose qui tourne à la fin, dans vos outils, pas une démonstration. Le code, les données et la documentation vous appartiennent : votre équipe le fait tourner sans nous, comme sur chaque système que nous livrons.",
    bringTitle: "Ce que vous apportez.",
    bringBody: "Une opération précise, pas un audit de l'entreprise entière : la relance qui retombe dans l'oubli, le tableau que vous recopiez chaque semaine, la décision qui atterrit toujours sur votre bureau. Vous êtes présent pendant les 10 heures : c'est vous qui tranchez, pas un chef de projet à votre place.",
    nextTitle: "Et ensuite.",
    nextBody: "Le système construit rejoint les suivants : chaque capacité augmente la valeur de celles d'avant. Si vous voulez que Parrit construise la suite, une Commande sur mesure part du même endroit.",
    nextLink: "Voir le système sur mesure",
    basis: "forfait",
    cta: "Réserver l'examen offert",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const description = DICT[locale].promise;
  return {
    title: DICT[locale].metaTitle, description,
    alternates: localizedAlternates("/build-with-you", locale),
    openGraph: localizedOpenGraph("/build-with-you", locale, DICT[locale].metaTitle, description),
  };
}

export default async function BuildWithYouPage() {
  const locale = await getLocale();
  const copy = DICT[locale];
  return (
    <main className="rev-page r2-dark">
      <div className="r2-wrap">
        <header className="r2-hero">
          <K>Parrit / Build With You</K>
          <h1>Build With You</h1>
          <p className="r2-sub">{copy.promise}</p>
        </header>
        <section className="r2-section" aria-labelledby="build-steps">
          <div className="r2-shead"><h2 className="r2-ed" id="build-steps">{copy.stepsTitle}</h2></div>
          <div className="r2-phases">
            {copy.steps.map(([number, title, body]) => <div className="r2-phase" key={number}>
              <div className="no">{number}</div><h3 className="nm">{title}</h3><div className="ds">{body}</div>
            </div>)}
          </div>
        </section>
        <section className="r2-section" aria-labelledby="build-out">
          <div className="r2-shead"><h2 className="r2-ed" id="build-out">{copy.outTitle}</h2></div>
          <p style={{ lineHeight: 1.8 }}>{copy.outBody}</p>
        </section>
        <section className="r2-section" aria-labelledby="build-bring">
          <div className="r2-shead"><h2 className="r2-ed" id="build-bring">{copy.bringTitle}</h2></div>
          <p style={{ lineHeight: 1.8 }}>{copy.bringBody}</p>
        </section>
        <section className="r2-section" aria-labelledby="build-next">
          <div className="r2-shead"><h2 className="r2-ed" id="build-next">{copy.nextTitle}</h2></div>
          <p style={{ lineHeight: 1.8, marginBottom: 16 }}>{copy.nextBody}</p>
          <Link href={localizedPath("/commission", locale)}>{copy.nextLink}</Link>
        </section>
        <section className="r2-close" aria-label="Build With You">
          <p className="offer-price">{formatOfferPrice({ amountHt: 3200, currency: "EUR", basis: copy.basis }, locale)}</p>
          <Link className="rev-button exec" href={localizedPath("/commission", locale)}>{copy.cta}</Link>
        </section>
        <footer className="r2-footer"><RegistryLine value="PARRIT / BUILD WITH YOU · 2026" /></footer>
      </div>
    </main>
  );
}
```

Notes de conformité :
- Le prix (3200 € HT, forfait) et les 3 étapes numérotées ne changent pas de
  fond (seule la durée de l'étape 1 a déjà été corrigée en PR A, 30→15 min —
  ne pas la re-toucher ici).
- `outBody`/`bringBody`/`nextBody` reprennent des engagements DÉJÀ écrits
  ailleurs sur le site (PS-05 « Le système vous appartient », PS-06 « La
  brique suivante augmente la valeur des précédentes », « Pas de chef de
  projet » de la section « La maison » de l'accueil) — aucune garantie
  nouvelle n'est inventée pour cette page.
- Ces trois sections utilisent les classes `r2-section`/`r2-shead`/`r2-ed`
  déjà en usage sur `/systems` et `/manufacture` : aucune nouvelle classe
  CSS n'est nécessaire pour cette partie.

---

## Vérification à livrer dans la PR

1. `grep -n "—"` sur tous les fichiers touchés → aucun résultat nouveau.
2. Comparer caractère pour caractère les 4 titres réutilisés (`copy.proof.*`)
   contre les `<h1>` réels de `/systems` et `/dossiers`, dans les deux
   langues — une seule apostrophe ou majuscule différente est un défaut.
3. `npm run build && npm run qa:brand:rev01` verts.
4. `npx next start -p 3210 &` puis `npm run qa:network:rev01` vert — corriger
   toute fixture périmée par la nouvelle section et le nouveau contenu de
   `/build-with-you`, sans jamais assouplir une assertion au-delà de ce qui a
   changé.
5. Capture desktop (1440×900) et mobile (390×844), FR et EN, de : l'accueil
   complet (scroll jusqu'au pied), en particulier la nouvelle section « La
   preuve » entre la promesse et l'offre, et la page `/build-with-you`
   complète.
6. Relire à voix haute (ou faire relire par Codex comme dernière étape de son
   propre travail) l'enchaînement des titres de `/build-with-you` dans
   l'ordre — le test de la chaîne des titres de Carla : « Build With You »
   → « Construire avec le fondateur. » → « Ce qui sort de ces 10 heures. »
   → « Ce que vous apportez. » → « Et ensuite. » doit se lire comme un mémo,
   sans provoquer de question de clarification.
