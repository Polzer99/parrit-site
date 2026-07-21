# Spec L3b — Tracer les CTA de la home live (funnel, complément du lot 3)

*Repo : parrit-site. Le Lot 3 a instrumenté les formulaires, mais a manqué la home RÉELLEMENT déployée. La home live = `src/app/[lang]/HomeDeux.tsx` (rendue par `src/app/[lang]/page.tsx`) ; `HomeClient.tsx` n'est plus que `/os-classic` (noindex). Le chemin de conversion principal de la home live = les CTA du hero qui envoient vers `/rendez-vous`. Ils ne sont PAS tracés → on ne voit pas le haut du funnel.*

## Périmètre (STRICTEMENT ce lot)

1. Dans `src/app/[lang]/HomeDeux.tsx` : sur les **CTA principaux** (notamment « Embaucher un agent » et « Réserver une démo » du hero, et tout autre CTA majeur de la page qui pointe vers `/rendez-vous`), émettre un event de clic via le helper `track()` de `src/lib/analytics.ts` :
   - `cta_click` avec `{ placement: "<identifiant-stable>" }`. Réutiliser l'identifiant déjà présent dans le `?source=` du lien quand il existe (ex. `home-hire-agent`, `home-demo`) comme `placement`.
2. **Ne pas changer le comportement** des boutons/liens (la navigation vers `/rendez-vous` doit rester identique). On ajoute seulement l'appel `track()` au clic.
3. Si un helper de tracking de CTA existe déjà dans le repo (ex. attribut `data-ph`, wrapper de lien), l'utiliser plutôt que d'en réinventer un.

## Hors périmètre

- Aucun changement visuel, de copy, de structure, de style.
- Pas de nouveaux events de formulaire (déjà faits au Lot 3).
- Pas de dashboard/funnel PostHog (côté Paul).
- Ne pas toucher `HomeClient.tsx` (déjà instrumenté au Lot 3) ni d'autres pages.

## Critères d'acceptation

- Les CTA principaux du hero de `HomeDeux.tsx` émettent `cta_click` avec un `placement` stable, au clic, sans modifier la navigation.
- `npm run lint` et `npm run build` passent ; les tests Playwright existants restent verts.

## Contraintes

- Lire `AGENTS.md` + `TRUTH.md` avant de modifier. Respecter la DA (zéro changement visuel).
- Uniquement le helper `track()` existant. Pas de nouvelle dépendance. Modifications minimales. Préserver le WIP. Aucun secret.
