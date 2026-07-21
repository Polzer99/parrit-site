# Spec L5a — Rendre le lead magnet « harnais coût-IA » atteignable (funnel, lot 5a)

*Repo : parrit-site. Le lead magnet `/harnais-ia` (« Harnais coût IA ») est en ligne, instrumenté (source + events, lots L1/L3), MAIS aucun lien interne du site n'y pointe : il est orphelin, donc personne ne l'atteint. Objectif : le relier depuis le hub de ressources pour qu'il capte enfin. C'est de la reachability, pas du contenu neuf.*

## Périmètre (STRICTEMENT ce lot)

1. Repérer le hub de ressources du site (probablement `src/app/[lang]/ressources/page.tsx`, sinon la page qui liste les ressources/lead magnets). Y **ajouter un lien/carte vers `/harnais-ia`**, en réutilisant EXACTEMENT le motif de carte/lien des ressources déjà présentes (même composant, même style). Titre/desc courts, factuels, tirés de la page harnais elle-même (`src/app/harnais-ia/content.ts` si dispo).
2. Si le site a une navigation ou un footer qui liste les ressources, et que c'est le motif établi, ajouter aussi l'entrée là — sinon s'en tenir au hub ressources.
3. Le lien doit pointer vers la bonne URL de la page harnais telle qu'elle est routée aujourd'hui (vérifier le routing réel).

## Hors périmètre (NE PAS faire)

- Ne PAS créer de nouvelle page, de nouveau design, de nouvelle copy marketing.
- Ne PAS modifier la page `/harnais-ia` elle-même (déjà instrumentée).
- Pas de changement d'offre, de prix, de positionnement, de DA.
- Ne pas toucher aux autres lead magnets ni au « magnet Claude Code » (hors repo/inconnu).

## Critères d'acceptation

- Depuis le hub de ressources, un utilisateur peut atteindre `/harnais-ia` en un clic, via un lien intégré au motif existant.
- Aucun changement visuel hors l'ajout de cette carte/ce lien (cohérent avec les autres).
- `npm run lint` et `npm run build` passent ; les tests Playwright existants restent verts.

## Contraintes

- Lire `AGENTS.md` + `TRUTH.md` avant de modifier. Respecter la DA (réutiliser le motif existant, rien de neuf visuellement).
- Modifications minimales et ciblées. Préserver le WIP. Aucun secret.
