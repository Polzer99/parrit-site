# CODEX-SPEC · 2026-09-20 · Founder bridge « Rencontrez Paul » dans le bloc « La maison »

Statut : **VALIDÉ PAR PAUL le 19/09/2026** (« A4 — Founder bridge : GO »), en réponse à
`docs/AUDIT-VISUEL-PALANTIR-IBM-2026-09-19.md`, axe 5 du mandat (« founder-led sans
marque séparée »).

Périmètre strict : ajouter UN lien secondaire dans le bloc « La maison » de la home
(`src/app/(rev01)/page.tsx`), vers `https://paul-larmaraud.com`. Aucun autre changement.
Ne pas transformer le bloc en biographie. Ne pas toucher au copy déjà validé
(`maison.title`, `maison.leadStrong`, `maison.leadRest`, `maison.body`, `maison.link`,
`maison.alt`, `maison.caption` restent identiques).

## 1. `src/app/(rev01)/page.tsx` — ajouter une clé de copy

Dans `DICT.en.maison` et `DICT.fr.maison`, ajouter une clé `bridge` (chaîne), à la suite
des clés existantes :

- `en.maison.bridge` = `"Meet Paul"`
- `fr.maison.bridge` = `"Rencontrez Paul"`

## 2. JSX — second lien, sous le lien existant

Dans la section `home-s-maison`, sous le `<Link>` existant qui pointe vers `/commission`
(`copy.maison.link`), ajouter un second lien :

```tsx
<a
  className="home-s-text-link home-s-text-link--secondary"
  href="https://paul-larmaraud.com"
  target="_blank"
  rel="noopener noreferrer"
>
  {copy.maison.bridge} →
</a>
```

Utiliser une balise `<a>` classique (pas `next/link`) car la cible est un domaine externe
distinct du site parrit.ai. `target="_blank"` + `rel="noopener noreferrer"` obligatoires
(sortie de site).

## 3. CSS — `.home-s-text-link--secondary`

Dans `src/app/(rev01)/rev01.css`, ajouter une règle pour ce modificateur : même famille
que `.home-s-text-link` (héritée), mais visuellement secondaire — plus petit ou plus
discret (ex. `opacity` réduite, ou couleur `--g3`/`--label-d` au lieu de l'accent), de
sorte que le lien vers `/commission` (l'action principale : réserver un examen) reste
visuellement dominant. Ne pas inventer de nouveau token de couleur : réutiliser une
valeur déjà présente dans `src/system/tokens.css`. Espacement vertical cohérent avec les
deux `<p>` et le lien existant du bloc (pas de fusion visuelle avec le premier lien : les
deux doivent rester deux actions clairement distinctes, pas une seule ligne).

## 4. QA avant PR

- `npm run lint` + `npx tsc --noEmit` + `npm run build` : verts.
- `npm run qa:brand:rev01` : vert.
- Capture d'écran du bloc « La maison » (FR + EN, desktop 1440px et mobile 375px)
  montrant les deux liens clairement séparés.
- Vérifier au clavier (focus visible sur le nouveau lien) et au lecteur d'écran basique
  (le lien doit être annoncé comme lien externe — `aria-label` optionnel du type
  `"Rencontrez Paul (ouvre paul-larmaraud.com)"` si ça aide, à la discrétion de
  l'implémentation, sans complexifier).
- `git diff --stat` : seuls `page.tsx`, `rev01.css` et ce fichier de spec doivent
  apparaître.

## 5. Livraison

Branche dédiée → PR vers `main`. NE PAS MERGER : review Claude (APPROVE) + CD/batterie
verte = les 3 feux (§25). Rollback : revert de la PR (aucune migration de données).
