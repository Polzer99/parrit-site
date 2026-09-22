# SPEC — Prix affiché en ancrage, pas en forfait fixe

Branche : `codex/price-anchor`. Base : `origin/main` (`2823a63`).

## Contexte

Vérifié (recherche factuelle, 22/09/2026) : `paul-larmaraud.com` affiche
aujourd'hui « à partir de 3 200 € HT les 10 heures » (prix en retrait
visuellement, doctrine explicite du site personnel contre l'affichage d'un
prix « en gros »). `parrit-site` affiche le même montant mais comme un
forfait fixe (« 3 200 € HT · forfait »), sans ancrage. Aucune trace canon
d'un prix « 5 500 € pour tout le monde » n'existe — le montant est déjà
identique des deux côtés, seule la PRÉSENTATION diverge. Aligner sur
l'ancrage, cohérent aussi avec `AGENTS.md` : « Prix publics autorisés
uniquement sous forme d'ancrage `à partir de X €` ».

## Fichier — `src/system/components/OfferCard.tsx`

Remplacer :
```ts
export function formatOfferPrice(price: OfferPrice, locale: Locale): string {
  const amount = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency", currency: price.currency, minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(price.amountHt);
  return `${amount} ${locale === "fr" ? "HT" : "excl. VAT"} · ${price.basis}`;
}
```
par :
```ts
export function formatOfferPrice(price: OfferPrice, locale: Locale): string {
  const amount = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency", currency: price.currency, minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(price.amountHt);
  const anchor = locale === "fr" ? "À partir de" : "Starting at";
  return `${anchor} ${amount} ${locale === "fr" ? "HT" : "excl. VAT"} · ${price.basis}`;
}
```

Ne pas toucher au reste du fichier (le composant `OfferCard` lui-même,
`priceNote` pour la Commande sur mesure, restent inchangés).

## Vérification attendue

- `npm run build`, `npm run lint` verts.
- Chercher toute assertion de test citant l'ancien texte exact
  (`"3 200 € HT · forfait"` / `"€3,200 excl. VAT · fixed fee"` ou équivalent)
  et la mettre à jour pour refléter le nouveau texte, jamais l'affaiblir.
- Ce changement seul ne modifie pas encore les valeurs `basis` (« forfait » /
  « fixed fee ») passées par `page.tsx` et `build-with-you/page.tsx` — c'est
  fait dans une spec séparée pour éviter un conflit de fusion, cette spec-ci
  livre seulement le préfixe d'ancrage dans le composant partagé.
