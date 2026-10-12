# Correctifs PR #313, passe 2 (revue Claude, 11/10/2026) — 13 échecs restants sur 280

1. **Code** `src/app/(rev01)/page.tsx` (hero) : le cadre contient `{copy.hero.frame}{copy.hero.after}` = deux nœuds texte, donc
   deux rectangles de texte (`tests/brand-os.spec.ts:240`, à 768 et 1440, FR et EN). Rendre une seule chaîne :
   `{`${copy.hero.frame}${copy.hero.after}`}` (ou fusionner frame et after dans la copy). Ne pas modifier le test.
2. **Test** `tests/conformity-journal.spec.ts:64` : `K.tsx` pose désormais un espace insécable avant « · » (voulu, aucune
   ligne ne commence par « · »). Écrire la regex avec `\s` autour des séparateurs (`/^WE FIND THE WAY\s·\s\d{4}-\d{2}-\d{2}\s·\sPARRIT \/ JOURNAL$/`).
   Vérifier toute autre assertion de texte contenant « · » dans les specs et l'adapter de la même façon.
3. **Test** `tests/systems.spec.ts:42` : la phrase réécrite commence par « No sale… » / « Aucune vente… » (majuscule).
   Rendre ces `toContainText` insensibles à la casse (regex `/no sale/i`, `/aucune vente/i`), sans retirer de phrase attendue.

Ne committe pas, ne pousse pas.
