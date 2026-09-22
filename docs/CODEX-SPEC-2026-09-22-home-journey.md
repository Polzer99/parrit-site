# SPEC — Accueil : le parcours plutôt que « La maison »

Branche : `codex/home-journey`. Base : `origin/main` (`95ed6de`).

Texte rédigé par Claude (corpus Carla + brief détaillé de Paul, 22/09/2026).
Codex applique tel quel.

## Contexte

Retour de Paul : la section « La maison » lisait comme une déclaration
d'autorité générique (déjà corrigée une fois, encore insuffisante). Nouvelle
demande, plus précise : retirer « Paul répond seul », « Personne d'autre ne
reprend votre dossier » et l'intitulé « La maison » — ces formulations
suggèrent une dépendance à une seule personne, ce qui inquiète. Ne pas
prétendre que Paul écrit personnellement chaque ligne de code. Présenter son
rôle positivement (« Paul Larmaraud est votre interlocuteur tout au long du
projet » — confirmé exact : aucun sous-traitant ni collaborateur n'intervient
dans la réalisation, recherche factuelle menée le 22/09). Remplacer par une
progression claire : d'où part le visiteur, où chaque étape le conduit.

La section devient : même mise en page (portrait + colonne de texte), mais le
texte décrit maintenant les 4 étapes de la mission plutôt qu'une déclaration
sur le fondateur.

La section « Ce que nous construisons » (Comprendre/Décider/Agir) reste
distincte — Paul demande qu'elle soit reliée à une situation concrète plutôt
que de décrire un fonctionnement abstrait.

## Fichier — `src/app/(rev01)/page.tsx`

### 1 — Remplacer la clé `maison` par `journey` dans les deux locales

Remplacer (dans `DICT.en`) :
```ts
    maison: {
      kicker: "The maison",
      title: "Paul answers alone, from the first message to the last line of code.",
      leadStrong: "No one else picks up your file between calls.",
      leadRest: " The founder, in person, on every commission.",
      body: "What he shows you at the examination is the system already running Parrit.",
      link: "Book an examination",
      alt: "Portrait of the founder",
      caption: "Paul Larmaraud · Founder",
      bridge: "Meet Paul",
    },
```
par :
```ts
    journey: {
      kicker: "How it works",
      title: "Paul Larmaraud is your point of contact throughout the project.",
      intro: "From the first conversation to handover, four steps, always with him.",
      steps: [
        ["01", "Name the operation", "You describe what costs you the most time. Paul examines with you who it touches and what it really costs."],
        ["02", "Write the scope", "What gets built, what Paul will need from you, and how success is judged — written before work starts."],
        ["03", "Build and verify", "The system gets built, then checked the way Parrit checks its own tools first. It doesn't go live until your team has been through it."],
        ["04", "Take it over", "Code, data and documentation are yours. Your team learns to run it at handover, and can take it further alone — or call Parrit back, depending on the path you chose."],
      ],
      link: "Book an examination",
      alt: "Portrait of the founder",
      caption: "Paul Larmaraud · Founder",
      bridge: "Meet Paul",
    },
```

Remplacer (dans `DICT.fr`) :
```ts
    maison: {
      kicker: "La maison",
      title: "Paul répond seul, du premier message à la dernière ligne de code.",
      leadStrong: "Personne d'autre ne reprend votre dossier entre deux rendez-vous.",
      leadRest: " Le fondateur, en personne, sur chaque commande.",
      body: "Ce qu'il vous montre à l'examen, c'est le système qui fait déjà tourner Parrit.",
      link: "Réserver un examen",
      alt: "Portrait du fondateur",
      caption: "Paul Larmaraud · Fondateur",
      bridge: "Rencontrez Paul",
    },
```
par :
```ts
    journey: {
      kicker: "Le déroulement",
      title: "Paul Larmaraud est votre interlocuteur tout au long du projet.",
      intro: "De la première conversation à la prise en main, quatre étapes, toujours avec lui.",
      steps: [
        ["01", "Nommer l'opération", "Vous décrivez ce qui vous coûte le plus de temps. Paul examine avec vous qui elle touche et ce qu'elle coûte réellement."],
        ["02", "Écrire le périmètre", "Ce qui sera construit, ce dont Paul aura besoin de vous, et comment on juge que c'est réussi — écrit avant que le travail commence."],
        ["03", "Construire et vérifier", "Le système se construit puis se vérifie avec la méthode que Parrit applique d'abord à ses propres outils. Il n'entre en service qu'une fois votre équipe passée dessus."],
        ["04", "Prendre la main", "Le code, les données et la documentation vous appartiennent. Votre équipe apprend à s'en servir à la livraison, et peut le faire évoluer seule — ou vous rappelez Parrit, selon la formule choisie."],
      ],
      link: "Réserver un examen",
      alt: "Portrait du fondateur",
      caption: "Paul Larmaraud · Fondateur",
      bridge: "Rencontrez Paul",
    },
```

### 2 — Section « Ce que nous construisons » : relier à une situation concrète

Remplacer (dans `DICT.en.build`) :
```ts
      items: [
        ["01", "Understand", "Everything that happens, readable at any moment. You open it, you know."],
        ["02", "Decide", "Only decisions reach you. Framed and quantified, on a card."],
        ["03", "Act", "The action executes in the same system. Journaled, reversible. The system belongs to you."],
      ],
```
par :
```ts
      items: [
        ["01", "Understand", "An invoice sits unpaid for 12 days: you know the moment you open the screen, not at next month's reconciliation."],
        ["02", "Decide", "The follow-up arrives already drafted, quantified, ready to approve — you never start from a blank page."],
        ["03", "Act", "Once approved, it goes out and logs itself in the journal. You can always roll it back; the system stays yours."],
      ],
```

Remplacer (dans `DICT.fr.build`) :
```ts
      items: [
        ["01", "Comprendre", "Tout ce qui se passe, lisible à tout moment. Vous ouvrez, vous savez."],
        ["02", "Décider", "Seules les décisions remontent jusqu'à vous. Cadrées et chiffrées, sur une carte."],
        ["03", "Agir", "L'action s'exécute dans le même système. Consignée au journal, réversible. Le système vous appartient."],
      ],
```
par :
```ts
      items: [
        ["01", "Comprendre", "Une facture reste impayée depuis 12 jours : vous le savez dès l'ouverture de l'écran, pas au rapprochement du mois suivant."],
        ["02", "Décider", "La relance vous arrive déjà rédigée, chiffrée, prête à valider — vous ne partez jamais d'une page blanche."],
        ["03", "Agir", "Une fois validée, elle part et se note au journal. Vous pouvez toujours revenir en arrière ; le système reste à vous."],
      ],
```

Le `verdict` de cette section ne change pas.

### 3 — JSX : renommer les références à `copy.maison` et remplacer le contenu de la section

Remplacer :
```tsx
      <section className="home-s-maison">
        <div className="home-s-wrap home-s-maison-grid">
          <figure>
            <Image src="/founder-portrait.jpg" alt={copy.maison.alt} width={340} height={453} sizes="(max-width: 859px) 100vw, 340px" />
            <figcaption><K>{copy.maison.caption}</K></figcaption>
          </figure>
          <div className="home-s-maison-copy">
            <K>{copy.maison.kicker}</K>
            <h2>{copy.maison.title}</h2>
            <p><strong>{copy.maison.leadStrong}</strong>{copy.maison.leadRest}</p>
            <p>{copy.maison.body}</p>
            <Link className="home-s-text-link" href={localizedPath("/commission", locale)}>{copy.maison.link}</Link>
            <a
              className="home-s-text-link home-s-text-link--secondary"
              href="https://paul-larmaraud.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${copy.maison.bridge} (${locale === "fr" ? "ouvre paul-larmaraud.com dans un nouvel onglet" : "opens paul-larmaraud.com in a new tab"})`}
            >
              {copy.maison.bridge} →
            </a>
          </div>
        </div>
      </section>
```
par :
```tsx
      <section className="home-s-maison">
        <div className="home-s-wrap home-s-maison-grid">
          <figure>
            <Image src="/founder-portrait.jpg" alt={copy.journey.alt} width={340} height={453} sizes="(max-width: 859px) 100vw, 340px" />
            <figcaption><K>{copy.journey.caption}</K></figcaption>
          </figure>
          <div className="home-s-maison-copy">
            <K>{copy.journey.kicker}</K>
            <h2>{copy.journey.title}</h2>
            <p>{copy.journey.intro}</p>
            <ol className="home-s-journey-steps">
              {copy.journey.steps.map(([number, title, body]) => (
                <li key={number}><K>{number}</K><h3>{title}</h3><p>{body}</p></li>
              ))}
            </ol>
            <Link className="home-s-text-link" href={localizedPath("/commission", locale)}>{copy.journey.link}</Link>
            <a
              className="home-s-text-link home-s-text-link--secondary"
              href="https://paul-larmaraud.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${copy.journey.bridge} (${locale === "fr" ? "ouvre paul-larmaraud.com dans un nouvel onglet" : "opens paul-larmaraud.com in a new tab"})`}
            >
              {copy.journey.bridge} →
            </a>
          </div>
        </div>
      </section>
```

(Le nom de la classe CSS `home-s-maison`/`home-s-maison-grid`/`home-s-maison-copy` reste tel quel — c'est un identifiant interne, pas un texte affiché. Seul le contenu change.)

## Fichier — `src/app/(rev01)/rev01.css`

Ajouter, après le bloc existant `.home-s-maison-copy p { ... }` :
```css
.home-s-journey-steps {
  list-style: none;
  margin: 32px 0 0;
  padding: 0;
}
.home-s-journey-steps li {
  margin-top: 24px;
}
.home-s-journey-steps li:first-child {
  margin-top: 0;
}
.home-s-journey-steps .k {
  display: block;
  margin-bottom: 6px;
}
.home-s-journey-steps h3 {
  margin: 0 0 6px;
  font-size: var(--t-l);
  font-weight: 500;
  color: var(--body-l);
}
.home-s-journey-steps p {
  margin: 0;
  max-width: 56ch;
}
```

## Vérification attendue (par Claude, après merge)

- `npm run build`, `npm run lint`, `qa:brand:rev01`, `qa:claims:rev01`,
  `qa:network:rev01` verts.
- Chercher toute assertion de test citant `copy.maison`, l'ancien titre, ou
  l'ancien texte de `home-s-build.items` — mettre à jour pour refléter le
  nouveau texte approuvé, jamais l'affaiblir.
- Capture d'écran desktop + mobile de la section, vérifier que les 4 étapes
  restent lisibles à côté du portrait sans débordement.
