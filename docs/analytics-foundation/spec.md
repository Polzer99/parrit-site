# Spec — Fondation analytics refonte-proof
Date : 2026-07-19
Status : implemented

## Objectif
Centraliser l'instrumentation PostHog du site public afin que chaque signal de conversion porte son attribution et reste exploitable après la refonte. Le lien cash est indirect à court terme et direct à moyen terme : mesurer les CTA et parcours qui produisent des rendez-vous qualifiés.

## Contexte
- Les événements d'engagement ont disparu lors d'un refactor.
- Les UTM existent en localStorage mais ne sont pas enregistrées comme super-properties PostHog.
- Les CTA et formulaires utilisent plusieurs implémentations directes de `posthog.capture`.
- Next.js 16, React 19, TypeScript strict, quatre langues ; `any` interdit.
- `npm run lint`, `npm run build` et l'audit contraste bloquent la livraison.

## Questions résolues (avec Paul)
- Taxonomie d'événements → union stricte fournie dans l'issue.
- Portée CTA → home, pages partagées, offres, contact, navigation et page rendez-vous.
- Livraison → branche et PR sans auto-merge.

## Alternatives considérées
- Appels PostHog directs dans chaque composant : précis mais fragile et déjà source de dérive.
- Provider React analytics : structuré mais couple la fondation à l'arbre React et demande une migration plus large.
- **Choix : module `track()` + listeners globaux délégués**, car la taxonomie, l'attribution et les propriétés de page restent centralisées tout en tolérant les futures refontes DOM.

## Spec
- `track()` est SSR-safe, no-op sans PostHog et enrichit chaque événement avec attribution, page et langue.
- AttributionInit enregistre last/current touch en super-properties et first touch via `$set_once`.
- Les CTA déclaratifs utilisent `data-ph`, `data-ph-label`, `data-ph-dest`, `data-ph-placement`.
- L'engagement émet chaque palier de scroll une fois et des buckets de temps actif aux transitions de visibilité/page.
- Les formulaires et le diagnostic passent par la taxonomie centralisée.
- La page rendez-vous émet au montage et à la première visibilité de l'iframe.
- Non-goal : modifier le contenu, le design ou la configuration du projet PostHog côté serveur.

## Risques + mitigations
- Double capture CTA : un élément ne porte qu'une valeur `data-ph`; le listener choisit l'événement correspondant.
- Surcomptage engagement SPA : état et timers sont nettoyés au démontage.
- PostHog chargé après le layout : le snippet fournit une queue immédiatement ; sinon no-op silencieux conforme au brief.
- Temps inactif compté : accumulation uniquement lorsque le document est visible.

## Acceptance criteria (testables)
- [ ] Union stricte et aucun `any`.
- [ ] Attribution enregistrée avant les événements applicatifs.
- [ ] CTA, scroll, temps, formulaires, diagnostic et rendez-vous centralisés.
- [ ] Rage clicks et dead clicks activés dans les deux initialisations.
- [ ] `npm run lint` et `npm run build` verts sur les quatre langues.
- [ ] `scripts/contrast-audit.py` retourne `TOTAL = 0`.
