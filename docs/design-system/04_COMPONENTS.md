# 04 — Composants

Implémentation : `src/components/ds/primitives.tsx` et `src/components/ds/level0.tsx`.
Démonstration vivante : `/design-system`.

Chaque composant déclare : objectif · anatomie · variants · états · responsive · accessibilité · tokens · règles de contenu · erreurs à éviter · statut.

**Statuts.** `stable` : approuvé pour réutilisation. `experimental` : derrière un flag ou en éditorial. `deprecated` : conservé pour migration seulement.

---

## Niveau 0 — figé

Ces cinq composants portent l'identité **sans aucune photographie**. Ils ne rendent ni `<img>`, ni `background-image`, ni couche expressive. C'est le socle du Structural Integrity Test.

### `HeroLevel0` — stable

- **Objectif :** poser la promesse et la nature de l'entreprise en moins de cinq secondes.
- **Anatomie :** badge facultatif → H1 en trois segments (`titleLead` / `titleSignal` rouge / `titleTail`) → chapô avec première phrase en gras → actions → bandeau de conditions réelles séparé par un filet.
- **Variants :** avec ou sans badge, avec ou sans conditions, une ou deux actions.
- **États :** aucun. C'est un bloc statique.
- **Responsive :** `--type-display-hero` est fluide ; les actions passent en `wrap` ; les conditions deviennent une liste.
- **Accessibilité :** un seul `<h1>` par page. Le segment rouge n'apporte pas d'information portée par la seule couleur — il est lisible dans le flux du texte.
- **Contenu :** `titleSignal` doit être le **sujet** de la phrase, jamais un mot choisi pour l'effet. Les `conditions` sont des faits (périmètre, format, contrainte), pas des arguments.
- **Erreurs :** ajouter une image « pour équilibrer » · deux actions primaires · un badge qui ne qualifie rien · un chapô de trois phrases.

### `ProofRailLevel0` — stable

- **Objectif :** rendre visible le modèle de preuve Parrit.
- **Anatomie :** en-tête de section → pour chaque cas : index, `input → output`, propriétaire humain, périmètre, séparés par un filet.
- **Rouge :** la flèche `→` porte le rouge. C'est **le** rouge causal du système : il matérialise le passage de l'input à l'output.
- **Contenu :** jamais de chiffre non vérifié. Le périmètre doit inclure ce que l'agent **ne fait pas** (« aucun envoi automatique », « aucun accès CRM en écriture »).
- **Erreurs :** omettre le propriétaire humain · un output vague (« gain de temps ») · plus de cinq cas.

### `TestimonialShiftLevel0` — stable

- **Objectif :** montrer le déplacement avant → après, sans photo ni logo.
- **Anatomie :** label de contexte → état antérieur barré → filet → état atteint.
- **Contenu :** pas de nom de client dans le texte. Formuler comme le client le dit.
- **Erreurs :** transformer en citation guillemetée avec portrait — c'est le pattern de la couche expressive, pas du niveau 0.

### `HermesTraceLevel0` — stable

- **Objectif :** montrer ce que l'agent a fait, et où l'humain reprend la main.
- **Anatomie :** en-tête avec périmètre déclaré → liste ordonnée d'étapes (heure, action, source, état) → **attribution obligatoire**.
- **Contenu :** une trace crédible **contient un échec**. Inclure au moins un `blocked` et un `human-review` : c'est le signal de crédibilité le plus fort du site.
- **Accessibilité :** `<ol>` sémantique. Chaque état porte un libellé texte, pas seulement une couleur.
- **Erreurs :** une trace 100 % verte · retirer l'attribution · faire parler Hermès à la première personne.

### `CTASectionLevel0` — stable

- **Objectif :** ramener au workflow, pas à l'offre.
- **Anatomie :** fond `--color-paper-alt` → titre → chapô → actions → mentions.
- **Erreurs :** mettre la newsletter ici · un CTA qui demande de choisir une offre.

---

## Primitives — stable

| Composant | Rôle | Contrainte |
|---|---|---|
| `Label` | nomme une zone | mono uppercase, **une ligne**, jamais une phrase |
| `IndexMark` | repère de lecture | chiffres tabulaires |
| `Badge` | état ou catégorie active | red-tint, angles nets |
| `Metric` | donnée de preuve | jamais un chiffre non vérifié |
| `Divider` | séparation | filet 1px, jamais une ombre |
| `SectionHeader` | index + label + titre + chapô | une section = une idée |
| `Button` | action | `primary` rouge, `secondary` encre. **Une seule primaire par écran** |
| `TextLink` | lien texte | souligné, offset 0.25em |

## États Hermès — stable

Treize états. Chacun porte un **libellé** et un **symbole**, pas seulement une couleur : c'est une contrainte d'accessibilité autant qu'une contrainte de marque, et cela évite l'arc-en-ciel de statuts.

| État | Symbole | Rouge ? |
|---|---|---|
| `success` | ● | non |
| `failure` | × | **oui** |
| `waiting` | ○ | non |
| `blocked` | ▪ | **oui** |
| `human-review` | ◆ | **oui** |
| `improvement-proposed` | △ | non |
| `improvement-accepted` | ▲ | non |
| `improvement-rejected` | ▽ | non |

**Seul ce qui demande une intervention porte du rouge.** Un succès n'est pas vert : il est en encre atténuée. Le système ne code pas la réussite par la couleur.

`agent status`, `action card`, `decision`, `signal` et `source` sont couverts par la composition `HermesStatus` + `TraceStep` (champ `source`). Un composant dédié ne se crée que si le besoin devient structurel.

---

## Couche expressive

### `MediaPlate` — stable

- Porte **obligatoirement** `data-layer="expressive"`. Ajouter `data-collapse="true"` si le bloc doit disparaître plutôt que devenir invisible.
- Angles nets, aucune ombre, `alt` toujours renseigné et descriptif.
- **Erreur :** poser un `MediaPlate` sans avoir vérifié que la page tient sans lui.

### `HeroWithMedia`, `EditorialFigure` — à construire

Non implémentés dans cette tranche. Le hero canonique est sans image ; la variante média se construit **après** que le niveau 0 soit validé, jamais avant.

---

## Règle de création

On ne crée un composant que si :

1. aucun existant ne couvre le besoin ;
2. la différence est **structurelle**, pas cosmétique ;
3. il sera réutilisé ;
4. son rôle tient en une phrase.

Sinon : un variant, ou une composition de primitives. **Ne pas remplacer un système cohérent par une préférence esthétique ponctuelle.**
