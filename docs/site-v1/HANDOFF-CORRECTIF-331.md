# Correctif de la PR #331 (27/10/2026, nuit)

Suite complète rejouée par Claude sur l'hôte : 426 réussis, 10 échecs, tous dans `tests/conformity-home.spec.ts` ligne 45 (« aucune surface avec ombre ou rayon »).

Éléments trouvés à 375 px : `.scene-chat` (rayon 24 px), `.scene-chat-bubble` ×4 (12 px), `.scene-chat-input` (20 px), aucune ombre. Ce sont les éléments du **téléphone** de `ProductScene`, remis sur l'accueil par la PR #330. La règle du dépôt les autorise : « Formes : radius 0 sauf téléphone ».

Correction demandée, et seulement celle-ci :
- Dans `tests/conformity-home.spec.ts` (et dans toute autre spec qui applique la même vérification globale de rayon sur l'accueil), exclure de la vérification **les seuls descendants du téléphone de la scène produit** (le conteneur `.scene-chat` et ses descendants), et continuer à exiger : aucune ombre nulle part (y compris dans le téléphone), rayon 0 partout ailleurs.
- Ajouter dans le même test une assertion positive : les éléments arrondis de l'accueil sont tous à l'intérieur de `.scene-chat`.
- Aucun changement de CSS ni de composant.

Critères : `npm run lint`, `npm test`, `npm run build`, `npm run qa:brand:rev01` verts ; Claude rejoue la suite navigateur sur l'hôte. Branche depuis `72f30fb`, PR vers `main` qui remplace la #331. Pas de fusion par Codex.
