# CODEX-SPEC · 2026-09-20 · Section « offres » (2 cartes) sur la home

Statut : **VALIDÉ PAR PAUL le 20/09/2026.** Livrable = un système de cartes d'offres
réutilisable, avec une vraie preview desktop + mobile FR/EN. Ce n'est PAS une refonte du
site, PAS une nouvelle ontologie de marque, PAS une gamme commerciale inventée.

**Important — pas de déploiement en production dans cette tranche.** Ouvrir la PR,
laisser le CD produire la preview Vercel de la PR. **Ne pas merger.** Claude fera la
revue visuelle de la preview puis reviendra vers Paul avant tout merge.

## 0. Périmètre — ce qui ne bouge PAS

- **Ne pas toucher** `src/app/(rev01)/commission/page.tsx`, `src/system/components/Dossier.tsx`,
  `src/app/(rev01)/dossiers/page.tsx`.
- **Ne pas toucher** le bloc « La maison » / founder bridge dans `page.tsx` (la section
  `home-s-maison` et ses deux liens existants) ni les tests qui le couvrent dans
  `tests/conformity-home.spec.ts` (lignes du describe "founder bridge...").
- Ne pas créer de troisième palier, d'abonnement, de badge "Recommended/Populaire", de
  toggle mensuel/annuel, de garantie de résultat ou de délai de livraison non documenté.
- Ne pas mélanger la capability "formation" (Build With You, famille `formation` dans le
  graphe commercial) avec une promesse de développement logiciel sur devis (carte 2) dans
  un même intitulé.

## 1. Source des faits (à citer telle quelle, ne pas reformuler les montants)

Source canonique : `~/parrit-os/docs/commercial-graph/commercial-graph-v1.json`, nœud
`off.build-with-you` (id `OFF-01`, statut `ACTIVE`, `sales_status_A: SOLD`,
`entry_offer_A: true`). Champs exploités :

- `prix.montant_ht` = **3200**, `devise` = EUR, `unite` = "forfait".
- `attributes.duration_A` = "10 heures".
- `resume` = "audit 30 min offert -> restitution 30 min -> 10 heures ou le client
  construit AVEC Paul et repart avec un output qui tourne".
- `promesse` = "le client ne veut ni un audit ni un deck, il veut repartir avec quelque
  chose qui tourne, construit avec lui."
- Réserve déjà documentée dans le graphe (`attributes.notes_A`) : le prix nominal
  3 200 € HT ne correspond à aucune vente réelle retrouvée (Forexpert 2 000 €, Didier
  Barbanneau 2 000 €/8h, Joone 2 160 €/12h) — **publier le prix nominal tel quel** (c'est
  la décision de Paul), ne pas mentionner cette réserve sur le site (registre interne).
- Doctrine tarifaire : `~/parrit-os/REGLES-DOR.md` §5 — « ancrages tarifaires OK, détail
  au call » — ce prix forfaitaire affiché est conforme, pas une exception.
- **Aucun nom de client** (Forexpert, Didier Barbanneau, Joone, Caroline Sevin) ne doit
  apparaître nulle part sur le site (REGLES-DOR §6).

La carte 2 (« Système sur mesure ») n'a pas de nœud dédié dans le graphe — elle reprend
le parcours déjà en production : `/commission` (examen 15 min avec le fondateur, verdict,
sur-devis, périmètre écrit avant de commencer — déjà la doctrine `TRUTH.md`/`AGENTS.md`
en vigueur). Ne pas lui inventer un prix, une durée ou des livrables numérotés au-delà de
ce que `/commission` promet déjà.

## 2. Nouveau composant `src/system/components/OfferCard.tsx`

Même discipline evidence-driven que `Dossier.tsx` (PR #267) : un champ non fourni ne
s'affiche pas, aucun placeholder, aucune déduction.

```tsx
type OfferPrice = {
  amountHt: number;
  currency: string; // "EUR"
  basis: string;    // ex. "forfait"
};

type OfferCardProps = {
  name: string;                     // nom canonique de l'offre
  audience: string;                 // à qui / quel problème
  outcome: string;                  // résultat attendu, concret
  deliverables?: readonly string[]; // ce qui est effectivement livré (viser 3)
  format?: string;                  // ex. "10 heures, avec le fondateur"
  price?: OfferPrice;               // montant réel, si documenté
  priceNote?: string;               // ex. "Sur devis" — SEULEMENT si c'est un fait
                                     // explicite de l'offre, jamais une valeur par
                                     // défaut générée quand price est absent
  exclusions?: readonly string[];   // coûts additionnels / ce qui n'est pas inclus
  cta: { label: string; href: string };
};
```

Règles de rendu : `deliverables`/`exclusions` absents ou vides → section non rendue (pas
de titre orphelin). `price` ET `priceNote` ne sont jamais tous les deux affichés pour la
même carte — un seul mode de prix par carte, celui que l'appelant fournit. Le prix passe
avant le CTA visuellement, mais ne domine pas la carte (respecter la densité §2 du Brand
OS : hiérarchie par taille/accent ponctuel, pas par le gras généralisé). Une seule action
principale (`cta`) — pas de deuxième lien dans la carte.

## 3. Section home — deux cartes

Dans `src/app/(rev01)/page.tsx`, ajouter une nouvelle section entre `home-s-build`
(Comprendre/Décider/Agir) et `home-s-journal` — ni avant, ni après ces deux sections
existantes. Nouvelle clé `DICT.en.offers` / `DICT.fr.offers` avec un kicker (ex. "Ways to
start" / "Pour commencer") et les deux cartes :

**Carte 1 — Build With You**
- `audience` : reprend l'esprit de la `promesse` sourcée (le dirigeant qui veut repartir
  avec quelque chose qui tourne, pas un audit ni un deck).
- `outcome` : un système qui tourne, construit avec le fondateur.
- `deliverables` (3, tirés du `resume` sourcé) : audit de 30 min offert · restitution de
  30 min · 10 heures de construction avec le fondateur.
- `format` : "10 heures, avec le fondateur".
- `price` : `{ amountHt: 3200, currency: "EUR", basis: "forfait" }`.
- `cta` : label à définir en FR/EN (ex. "Découvrir Build With You" / "See Build With
  You"), `href` = `/build-with-you` (FR : chemin localisé via `localizedPath`).

**Carte 2 — Système sur mesure**
- `audience` : qui veut confier la réalisation complète à Parrit.
- `outcome` : un système construit et mis en production par Parrit.
- `deliverables` : reprendre UNIQUEMENT ce que `/commission` promet déjà (examen du
  besoin avec le fondateur, verdict, périmètre écrit avant de commencer) — pas de
  troisième livrable inventé.
- `priceNote` : "Sur devis" (FR) / "Custom quote" (EN) — fait réel de l'offre existante,
  pas une valeur par défaut du composant.
- `cta` : label existant du site pour ce parcours (cohérent avec le CTA déjà utilisé
  ailleurs pour `/commission`, ex. "Réserver un examen" / "Book an examination"),
  `href` = `/commission` (localisé).

Layout : grille 2 colonnes desktop, 1 colonne mobile, même filet 1px que
`.home-s-build-grid`, pas de carrousel. Les deux cartes utilisent la même grammaire
visuelle (typographie, espacement, bordures, style du prix, style du bouton) même si
leur mode de prix diffère (montant vs "Sur devis") — c'est la donnée qui diffère, pas le
gabarit.

## 4. Nouvelle page `src/app/(rev01)/build-with-you/page.tsx`

Page minimale, destination du CTA de la carte 1 — ne pas la sur-construire. Réutilise
`K`, `RegistryLine`, `.rev-button`/`.exec`, registre carbon `r2-dark` (cohérent avec
l'arbitrage §10.2 du Brand OS : instrument/produit = carbon). Contenu : titre (nom de
l'offre), la `promesse` sourcée, le déroulé en 3 temps (audit 30 min → restitution 30 min
→ 10h de construction), le prix (3 200 € HT, forfait), un CTA final vers `/commission`
(réserver l'audit initial gratuit — c'est la vraie porte d'entrée du parcours, cf.
`resume` sourcé : "audit 30 min offert" précède les 10h). Pas de formulaire, pas de
nouveau composant de mise en page — un `<main className="rev-page r2-dark">` du même
type que les pages existantes.

## 5. QA avant PR

- `npm run lint` + `npx tsc --noEmit` + `npm run build` + `npm run qa:brand:rev01` :
  verts.
- Nouveau fichier de test Playwright (ou ajout à `tests/conformity-home.spec.ts` pour la
  section home, plus un test dédié pour `/build-with-you`) couvrant : les 2 cartes
  visibles FR/EN à 375px et 1440px, le prix affiché tel quel sur la carte 1, "Sur devis"
  sur la carte 2, les deux `href` corrects, aucun débordement horizontal, la grille passe
  à 1 colonne sous 768px.
- Captures desktop (1440px) et mobile (375px), FR et EN, de la nouvelle section ET de la
  page `/build-with-you`.
- `git diff --stat` : `OfferCard.tsx` (nouveau), `page.tsx`, `rev01.css`,
  `build-with-you/page.tsx` (nouveau), le(s) fichier(s) de test, ce fichier de spec.
  **`commission/page.tsx`, `Dossier.tsx`, `dossiers/page.tsx` ne doivent PAS apparaître.**

## 6. Livraison

Branche dédiée → **ouvrir la PR, laisser le CD tourner, NE PAS MERGER.** Le compte rendu
Codex doit inclure : liste des composants créés/réutilisés, provenance exacte de chaque
prix/texte (fichier + champ), et tout arbitrage commercial encore ouvert repéré pendant
l'implémentation.
