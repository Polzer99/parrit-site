# Spec L3 — Instrumentation de conversion PostHog (funnel, lot 3)

*Repo : parrit-site. Objectif : rendre le funnel VISIBLE dans PostHog. Aujourd'hui PostHog ne reçoit que `$pageview` + un `hero_cta_click` mort. On veut voir chaque étape : vue formulaire → soumission → succès/échec, sur TOUS les points de capture. Le Lot 1 (fiabilité capture) est déjà en prod.*

## Contexte vérifié

- Helper d'instrumentation existant : `src/lib/analytics.ts` (fonction `track()` typée). L'UTILISER, ne pas créer d'autre lib ni appeler `posthog` en direct ailleurs.
- Certains formulaires émettent déjà `track("form_submitted", …)` / `track("form_failed", …)` (diagnostic, détecteur). Beaucoup ne le font PAS (home, offre, quick-contact, harnais). Objectif = **cohérence sur TOUS**.
- Attribution : `src/lib/attribution.ts` (`getAttribution()`) déjà utilisé côté payload.

## Périmètre (STRICTEMENT ce lot)

1. **Sur CHAQUE formulaire de capture** (home, page offre, quick-contact, diagnostic, détecteur-bullshit, harnais-ia, assistant/chat) : émettre trois events cohérents via `track()` :
   - `form_view` une fois quand le formulaire devient visible/rendu (éviter les doublons : un seul par montage).
   - `form_submitted` **uniquement en cas de succès réel** (après `response.ok`), avec `{ form: "<nom-stable>", page }`.
   - `form_failed` en cas d'échec, avec `{ form, page, status? }`.
   - Utiliser le MÊME identifiant `form` que le `source` déjà posé au Lot 1 quand c'est possible (ex. `home`, `diagnostic`, `offre:<x>`, `detecteur-bullshit`, `harnais-ia`, `quickcontact`, `assistant`).
2. **Ne PAS dupliquer** les events déjà présents : consolider (un seul `form_submitted` par soumission réussie), pas deux.
3. **CTA primaires** : là où un `data-ph` / `track()` de clic manque sur un CTA principal (ex. « Embaucher un agent », « Réserver une démo » du hero), ajouter un event de clic léger et nommé (`cta_click` avec `{ placement }`), sans changer le comportement du bouton.

## Hors périmètre (NE PAS faire)

- Pas de création de dashboard / funnel sauvegardé PostHog (côté Paul, via MCP — il garde la main sur la mesure).
- Pas de tagging UTM des liens sortants (Lot 4).
- Aucun changement visuel, de copy, de structure de page, ni de logique de capture (déjà faite au Lot 1). On AJOUTE des events, rien d'autre.
- Ne pas toucher aux tables/serveur/n8n.

## Critères d'acceptation

- Chaque formulaire de capture émet `form_view`, `form_submitted` (succès uniquement), `form_failed` (échec), via `track()`, avec un `form` stable et cohérent avec le `source`.
- Aucun double `form_submitted`.
- `npm run lint` et `npm run build` passent. Les tests Playwright existants restent verts (ne pas casser `tests/diagnostic-e2e.spec.ts`).

## Contraintes

- Lire `AGENTS.md` + `TRUTH.md` AVANT de modifier. Respecter la DA (aucun changement visuel).
- N'utiliser que le helper `track()` existant (`src/lib/analytics.ts`). Pas de nouvelle dépendance.
- Modifications minimales et ciblées. Préserver tout le WIP.
- Secrets : rien de nouveau, aucun secret dans le code.
