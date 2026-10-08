# parrit.ai : ancrage Build With You à partir de 3 500 € HT (08/10/2026)

Décision directe de Paul (08/10/2026) : « on met à partir de 3 500 € ». Brand OS `CLM-OFFER-BWY` : FR « À partir de 3 500 € HT, au
forfait… », EN « From €3,500 excl. VAT, fixed price… ». « 3 200 € » est désormais BLOQUÉ.

1. `site.config.ts` : `BUILD_WITH_YOU_PRICE = { amountHt: 3500, currency: "EUR" }`. Toute occurrence affichée de 3 200 / 3,200 qui
   désigne l'offre (pages EN et FR, cartes d'offre, JSON-LD Offer, llms.txt via `scripts/generate-llms.mjs`, articles du Journal)
   devient 3 500 / 3,500. `TRUTH.md` et `AI_CONTEXT.md` : mettre à jour la ligne de prix avec la date et la décision.
2. Tests : mettre à jour `tests/offer-card.test.mjs`, `tests/offer-cards.spec.ts`, `tests/systems.spec.ts` et toute référence au prix
   en gardant leurs exigences ; ajouter une assertion : aucun « 3,200 » / « 3 200 € » rendu.
3. Ne pas toucher `design-source/` (historique). Ne pas toucher à la composition de l'accueil (refonte en cours par une autre
   session) : seulement le montant s'il y apparaît.
Batterie : `npm ci && npm run build && npm run qa:claims:rev01 && npm run test:brand-os` verte ; la CI rejoue Playwright.
Diffusion : PR ; fusion par Claude après CI verte (déploiement Vercel automatique sur main).
