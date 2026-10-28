# Réservation en anglais sur la version anglaise (Paul, 28/10/2026 : « go »)

Événement Cal.com anglais créé le 28/10 par API, jumeau exact du français (même planning, 15 min,
Google Meet, préavis 2 h, 10 par semaine, interface forcée en anglais) :

- FR : `paul-larmaraud/audit` (id 6667767), « Entretien stratégique IA », interface en français, description
  française seule (la ligne « In English » a été retirée le 28/10) ;
- EN : `paul-larmaraud/ai-strategy-meeting` (id 7676191), « AI strategy meeting », questions en anglais.

## Changement

1. `site.config.ts` : garder `CAL_LINK_COMMISSION = "paul-larmaraud/audit"` (français) et ajouter
   `CAL_LINK_COMMISSION_EN = "paul-larmaraud/ai-strategy-meeting"`, exporté aussi dans `siteConfig`.
2. `ParritCalInline` : sans `calLink` explicite, le lien suit la langue : `fr` → `CAL_LINK_COMMISSION`,
   `en` → `CAL_LINK_COMMISSION_EN`. Un `calLink` passé explicitement reste prioritaire.
3. Aucun autre changement visible.

## Contrôles

- `tests/cal-link.test.mjs` : les deux constantes, et le lien choisi selon la langue (rendu serveur ou
  props) ; le test du lien historique `paul-larmaraud/30min` reste en place.
- Playwright existant : aucune requête réseau réelle (deny-all inchangé) ; la page EN rend l'embed avec
  le lien anglais, la page FR avec le lien français.
- Batterie : `npm ci && npm run lint && npm run build && npm test && npm run qa:brand:rev01 &&
  npm run qa:claims:rev01 && npm run test:brand-os` ; navigateur rejoué par Claude sur l'hôte.
