# CODEX-SPEC · 2026-09-20 · `Dossier.tsx` — contrat de données evidence-driven

Statut : **VALIDÉ PAR PAUL le 19/09/2026** (arbitrage A1, en réponse au blocage remonté
sur `docs/AUDIT-VISUEL-PALANTIR-IBM-2026-09-19.md` : le composant imposait une structure
plus riche que les faits réellement disponibles). Décision de Paul : corriger le
composant, ne jamais inventer de données pour remplir ses champs.

Périmètre strict : **`src/system/components/Dossier.tsx` uniquement**. Ce composant
n'est actuellement importé par aucune page (vérifié par `git grep`) — zéro risque de
régression visuelle en prod. Ne pas toucher `src/app/(rev01)/dossiers/page.tsx` dans
cette spec : le câblage du composant sur la page réelle et le choix des faits à y
afficher font l'objet d'une spec séparée, après validation du contrat par Paul.

## 1. Nouveau contrat de types

```tsx
type DossierProps = {
  // Socle obligatoire — toujours connu, toujours affiché.
  title: string;
  client: string;
  systemId: string;
  commissionedYear: string | number;
  status: string;
  problem: string;

  // Optionnels — n'existent que si le fait est réellement documenté.
  domain?: string;
  revision?: string;
  capabilities?: readonly string[];
  before?: readonly string[];
  after?: readonly string[];
  measurementPeriod?: string;
};
```

Changement : `domain`, `revision` (déjà optionnel-ish dans l'usage mais obligatoire dans
le type actuel), `capabilities`, `before`, `after`, `measurementPeriod` passent de
requis à optionnels. `title`, `client`, `systemId`, `commissionedYear`, `status`,
`problem` restent requis — ce sont les seuls faits garantis disponibles pour tout
dossier.

## 2. Règles de rendu (non négociables)

- **Un champ absent n'est pas affiché.** Pas de ligne vide, pas de section vide, pas de
  titre de section sans contenu en dessous.
- **Aucune valeur placeholder.** Ne jamais rendre `""`, `"—"`, `"N/A"`, `"TBD"` ou
  équivalent à la place d'un champ manquant : le champ est simplement absent du DOM.
- **La plaque de métadonnées** (`dossier-plate`) ne doit lister QUE les paires
  `[label, value]` dont la valeur est définie. `Domain` et `Rev` disparaissent de la
  plaque s'ils ne sont pas fournis ; `Client`, `System`, `Commissioned`, `Status`
  restent toujours affichés (champs obligatoires du type).
- **Section « 02 · Capabilities built »** : ne se rend pas du tout (ni le `<K>` de
  titre, ni la `<section>`) si `capabilities` est absent ou vide.
- **Section « 03 · Measured change »** : ne se rend pas du tout si NI `before` NI
  `after` n'est fourni (ou vide). Si un seul des deux est fourni, rendre uniquement le
  bloc correspondant (`Before` seul, ou `After` seul) — jamais une colonne vide en
  vis-à-vis. Le suffixe `measurementPeriod` dans le titre de section ne s'affiche que
  si `measurementPeriod` est fourni (déjà optionnel aujourd'hui, ne pas régresser ce
  comportement).
- **Aucune logique de déduction.** Le composant ne doit contenir aucune transformation,
  formatage ou interprétation qui inventerait une donnée à partir d'une autre (ex. pas
  de valeur par défaut calculée pour `revision`, pas de texte générique injecté quand
  `domain` manque). Il affiche ce qu'on lui donne, rien de plus.

## 3. QA avant PR

- `npm run lint` + `npx tsc --noEmit` + `npm run build` : verts.
- Ajouter un test unitaire ou un test Playwright minimal (au choix du contexte déjà en
  place dans le dépôt — regarder comment les autres composants de `src/system/` sont
  testés, ne pas inventer un nouveau framework de test) qui vérifie, en import direct du
  composant hors page (via une route de test si nécessaire, ou un test de rendu isolé) :
  1. avec SEULEMENT le socle obligatoire rempli → aucune trace de "Domain", "Rev",
     "Capabilities built", "Measured change" dans le rendu ;
  2. avec `after` seul rempli (pas de `before`) → la section "Measured change" apparaît
     avec uniquement le bloc "After", sans bloc "Before" vide.
- `git diff --stat` : seul `src/system/components/Dossier.tsx` (+ le fichier de test
  ajouté, + ce fichier de spec) doit apparaître. **`dossiers/page.tsx` ne doit pas
  apparaître dans le diff.**

## 4. Livraison

Branche dédiée → PR vers `main`. NE PAS MERGER sans review Claude (APPROVE) + CD/batterie
verte. Puisque le composant n'est importé nulle part, aucune capture d'écran de page
réelle n'est nécessaire — mais si le test de rendu isolé produit un artefact visuel,
l'inclure. Rollback : revert de la PR, aucun impact prod (composant inutilisé).
