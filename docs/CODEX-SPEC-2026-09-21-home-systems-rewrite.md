# SPEC — Accueil (portée réelle + preuve visible) et ouverture /systems

Branche : `codex/home-systems-rewrite`. Base : `origin/main` (`6a5acd8`).

Passe rédigée par Claude à partir du corpus Carla de Préval (privé, jamais
cité) et de `brand-context.md` (portée des promesses, une seule marque
Parrit.ai, founder-led résolu par contexte). Codex applique le texte fourni
tel quel — aucune reformulation supplémentaire de sa part.

## Fichier 0 (asset, déjà en place avant l'exécution)

`public/brand/qualiopi-formia.png` existe déjà dans ce worktree (copié
directement par Claude, hors périmètre Codex — c'est un fichier binaire).
Ne pas le recréer, l'ignorer si vu par un `git status`.

## Fichier 1 — `src/app/(rev01)/page.tsx`

### 1.1 — `hero.sub` : ouvrir sur une scène concrète avant l'abstraction

Remplacer (dans `DICT.en.hero`) :
```ts
      sub: "We build inside your systems. On your data. Until it runs.",
```
par :
```ts
      sub: "The invoice nobody owns until it's overdue. The report stitched together by hand every Monday. We build inside your systems, on your data, until it runs.",
```

Remplacer (dans `DICT.fr.hero`) :
```ts
      sub: "On code chez vous. Avec vos données. Jusqu'à ce que ça tourne.",
```
par :
```ts
      sub: "La facture que personne ne suit avant qu'elle traîne. Le rapport recomposé à la main chaque lundi. On code chez vous, avec vos données, jusqu'à ce que ça tourne.",
```

### 1.2 — `build.title` et `build.verdict` : périmètre réel, pas l'entreprise entière

Le titre et la conclusion de la section « Ce que nous construisons »
affirmaient une portée non tenue (« votre entreprise entière », « le reste
tourne sans vous » au sens absolu), en contradiction avec Build With You qui
précise explicitement « une opération précise, pas un audit de l'entreprise
entière ». Correction : la section décrit désormais la méthode qui part d'une
opération et compose vers un système, jamais l'affirmation que c'est déjà fait
pour toute l'entreprise.

Remplacer (dans `DICT.en.build`) :
```ts
      title: "Your company, on one system.",
```
par :
```ts
      title: "One operation becomes one system, brick by brick.",
```

Remplacer (dans `DICT.en.build`) :
```ts
      verdict: "Three moves. The rest runs without you.",
```
par :
```ts
      verdict: "Three moves, on the operation you chose. Everything else executes without you.",
```

Remplacer (dans `DICT.fr.build`) :
```ts
      title: "Votre entreprise, sur un seul système.",
```
par :
```ts
      title: "Une opération devient un système, brique après brique.",
```

Remplacer (dans `DICT.fr.build`) :
```ts
      verdict: "Trois gestes. Le reste tourne sans vous.",
```
par :
```ts
      verdict: "Trois gestes, sur l'opération choisie. Le reste s'exécute sans vous.",
```

Les trois items numérotés (01 Comprendre / 02 Décider / 03 Agir) ne changent
pas.

### 1.3 — `proof` : ajouter un élément vérifiable directement sur l'accueil

Un titre réutilisé ne suffit pas comme preuve éditoriale : chaque carte de la
section « La preuve » doit porter un fait vérifiable et compact, en plus du
lien vers le détail. Ajouter un champ `fact` à chaque sous-objet de `proof`.

Remplacer (dans `DICT.en.proof`) :
```ts
    proof: {
      kicker: "The proof",
      systems: { title: "We show the system. You judge before you commit.", cta: "See the system" },
      dossiers: { title: "The dossiers open in conversation.", cta: "See the dossiers" },
    },
```
par :
```ts
    proof: {
      kicker: "The proof",
      systems: {
        title: "We show the system. You judge before you commit.",
        fact: "15 of 25 information sources still duplicated, checked September 13, 2026.",
        cta: "See the system",
      },
      dossiers: {
        title: "The dossiers open in conversation.",
        fact: "Three open dossiers today. The rest stay sealed until a meeting.",
        cta: "See the dossiers",
      },
    },
```

Remplacer (dans `DICT.fr.proof`) :
```ts
    proof: {
      kicker: "La preuve",
      systems: { title: "Nous montrons le système. Vous jugez avant de vous engager.", cta: "Voir le système" },
      dossiers: { title: "Les dossiers s'ouvrent de vive voix.", cta: "Voir les dossiers" },
    },
```
par :
```ts
    proof: {
      kicker: "La preuve",
      systems: {
        title: "Nous montrons le système. Vous jugez avant de vous engager.",
        fact: "15 sources d'information sur 25 encore en double, vérifié le 13 septembre 2026.",
        cta: "Voir le système",
      },
      dossiers: {
        title: "Les dossiers s'ouvrent de vive voix.",
        fact: "Trois dossiers ouverts aujourd'hui. Les autres restent scellés jusqu'au rendez-vous.",
        cta: "Voir les dossiers",
      },
    },
```

Dans le JSX de la section `home-s-proof`, ajouter un `<p>` entre le `<h3>` et
le `<span>` de chaque carte. Remplacer :

```tsx
      <section className="home-s-proof" aria-label={copy.proof.kicker}>
        <div className="home-s-wrap">
          <K>{copy.proof.kicker}</K>
          <div className="home-s-proof-grid">
            <Link className="home-s-proof-item home-s-proof-item--systems" href={localizedPath("/systems", locale)}>
              <h3>{copy.proof.systems.title}</h3>
              <span>{copy.proof.systems.cta} →</span>
            </Link>
            <Link className="home-s-proof-item home-s-proof-item--dossiers" href={localizedPath("/dossiers", locale)}>
              <h3>{copy.proof.dossiers.title}</h3>
              <span>{copy.proof.dossiers.cta} →</span>
            </Link>
          </div>
        </div>
      </section>
```

par :

```tsx
      <section className="home-s-proof" aria-label={copy.proof.kicker}>
        <div className="home-s-wrap">
          <K>{copy.proof.kicker}</K>
          <div className="home-s-proof-grid">
            <Link className="home-s-proof-item home-s-proof-item--systems" href={localizedPath("/systems", locale)}>
              <h3>{copy.proof.systems.title}</h3>
              <p>{copy.proof.systems.fact}</p>
              <span>{copy.proof.systems.cta} →</span>
            </Link>
            <Link className="home-s-proof-item home-s-proof-item--dossiers" href={localizedPath("/dossiers", locale)}>
              <h3>{copy.proof.dossiers.title}</h3>
              <p>{copy.proof.dossiers.fact}</p>
              <span>{copy.proof.dossiers.cta} →</span>
            </Link>
          </div>
        </div>
      </section>
```

### 1.4 — Nouvelle section « crédential » en pied de page (demande Paul, 21/09/2026)

Formia (organisme de formation dirigé par le fondateur de Parrit.ai, entité
distincte, jamais fondue dans la marque Parrit.ai — cf. `brand-context.md`
§5 : « brand = Parrit.ai seul ») détient une certification Qualiopi réelle et
en cours de validité (certificat ATA 1926 2026, ATALIA Certification,
26 mai 2026 → 25 mai 2029). Ajouter une bande discrète, après `home-s-close`
et avant la fin du `<main>`, qui présente ce fait sans jamais laisser
entendre que Parrit.ai elle-même est certifiée.

Ajouter dans `DICT.en` (au même niveau que `close`) :
```ts
    credential: {
      text: "Formia, also led by our founder, is Qualiopi-certified (ATA 1926 2026, valid through May 2029).",
    },
```

Ajouter dans `DICT.fr` (au même niveau que `close`) :
```ts
    credential: {
      text: "Formia, également dirigée par notre fondateur, est certifiée Qualiopi (ATA 1926 2026, valable jusqu'en mai 2029).",
    },
```

Dans le JSX, juste après la fermeture de `</section>` de `home-s-close` et
avant `</main>`, ajouter :

```tsx
      <section className="home-s-credential">
        <div className="home-s-wrap">
          <Image src="/brand/qualiopi-formia.png" alt="Qualiopi" width={96} height={51} />
          <p>{copy.credential.text}</p>
        </div>
      </section>
```

(`Image` est déjà importé en haut du fichier depuis `next/image`.)

## Fichier 2 — `src/app/(rev01)/systems/page.tsx`

Recomposer l'ouverture pour que titre, preuve compacte et action soient
lisibles ensemble, sans le poids visuel de `.offer-card` (conçu pour le
catalogue, pas pour un aperçu de hero).

Remplacer :

```tsx
      <header className="r2-hero">
        <K>{copy.kicker}</K><h1>{copy.title}</h1><p className="r2-sub">{copy.sub}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 32 }}>{talk}<Link className="rev-button ghost" href="#capacites">{copy.catalogue}</Link></div>
        <div className="systems-hero-proof">
          <K>{copy.observed}</K>
          <article className="system-card offer-card" style={{ border: 0, background: "var(--ink)" }}>
            <h3>{evidence.cards[0].name}</h3>
            <p>{evidence.cards[0].output}</p>
            <p style={{ color: "var(--g2)" }}>{HERO_PROOF_LIMIT[locale]}</p>
            <K>{evidence.cards[0].proofLabel}</K>
          </article>
        </div>
      </header>
```

par :

```tsx
      <header className="r2-hero systems-hero">
        <K>{copy.kicker}</K><h1>{copy.title}</h1><p className="r2-sub">{copy.sub}</p>
        <div className="systems-hero-proof">
          <article className="systems-hero-proof-card">
            <K>{copy.observed}</K>
            <h3>{evidence.cards[0].name}</h3>
            <p>{evidence.cards[0].output} {HERO_PROOF_LIMIT[locale]}</p>
            <K>{evidence.cards[0].proofLabel}</K>
          </article>
        </div>
        <div className="systems-hero-actions">{talk}<Link className="rev-button ghost" href="#capacites">{copy.catalogue}</Link></div>
      </header>
```

(L'action passe après la preuve compacte : titre → espace → preuve → action,
dans cet ordre de lecture.)

## Fichier 3 — `src/app/(rev01)/rev01.css`

### 3.1 — Scoper une largeur de titre plus généreuse pour l'ouverture Systems

Le titre de `/systems` est nettement plus long que ceux des autres pages
`r2-hero` (`Build With You`, `The dossiers open in conversation.`) et hérite
de `max-width: 14ch`, ce qui le fait s'enrouler sur beaucoup plus de lignes
que nécessaire et pousse tout le reste hors du premier écran. Ne pas toucher
la règle partagée `.r2-hero h1` (les autres pages n'ont pas ce problème) —
ajouter une règle scopée après elle :

```css
.systems-hero h1 {
  max-width: 32ch;
}
```

### 3.2 — Remplacer le bloc `.systems-hero-proof` existant

Remplacer :

```css
.systems-hero-proof {
  max-width: 480px;
  margin-top: 40px;
  text-align: left;
}
```

par :

```css
.systems-hero-proof {
  max-width: 480px;
  margin-top: 24px;
  text-align: left;
}

.systems-hero-proof-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 24px;
  background: var(--ink);
}

.systems-hero-proof-card h3 {
  margin: 0;
  font-size: var(--t-l);
  font-weight: 500;
  color: var(--paper);
}

.systems-hero-proof-card p {
  margin: 0;
  line-height: 1.6;
  color: var(--label-d);
}

.systems-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 24px;
}

@media (max-width: 760px) {
  .systems-hero-proof-card { padding: 16px 18px; }
}
```

### 3.3 — Ajouter le fait sous le titre des cartes preuve de l'accueil

Après le bloc existant :

```css
.home-s-proof-item h3 {
  font-size: var(--d-l);
  font-weight: 400;
}
```

ajouter :

```css
.home-s-proof-item p {
  margin: 16px 0 0;
  line-height: 1.6;
  color: var(--label-d);
}
```

### 3.4 — Nouvelle bande crédential

Ajouter à la fin du fichier :

```css
.home-s-credential {
  padding: 32px 0;
  border-top: 1px solid var(--rule-l);
}
.home-s-credential .home-s-wrap {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.home-s-credential img {
  width: 96px;
  height: auto;
  flex-shrink: 0;
}
.home-s-credential p {
  margin: 0;
  max-width: 56ch;
  color: var(--g3);
  font-size: var(--t-m);
  line-height: 1.6;
}
```

## Vérification attendue (par Claude, après merge)

- `npm run build`, `npm run qa:brand:rev01`, `npm run qa:network:rev01` verts.
- Mesure Playwright réelle à 1363×936 sur `/systems` (avant/après) : position
  du haut de la carte de preuve, du titre de la carte, du bas de la carte —
  comparer aux mesures de l'audit (897 / 933 / 1256) et documenter le résultat
  réel, pas une estimation.
- Vérification visuelle mobile (390px) de la même ouverture.
- Vérification que `/brand/qualiopi-formia.png` répond bien en production et
  que le texte de la bande crédential ne mentionne jamais Parrit.ai comme
  organisme certifié.
