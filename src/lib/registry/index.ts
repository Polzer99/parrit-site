/**
 * LES REGISTRES — point d'entrée unique.
 *
 * Quatre sources de vérité, une par nature de donnée. Aucune n'est dupliquée
 * ailleurs, et chacune peut évoluer sans qu'un composant bouge.
 *
 *   cta.ts        les actions      — libellé, destination, funnel, événement
 *   preuves.ts    les preuves      — huit natures, deux règles dures
 *   ressources.ts les ressources   — promesse, contenu, livraison
 *   ciblage.ts    offre · problème · situation · persona · maturité
 *
 * ⚠️ Importer CE fichier, pas les fichiers individuels : c'est ici que la
 * validation s'exécute. `parts.tsx` l'importe, et les huit templates importent
 * `parts.tsx` — donc toute page construite avec un template valide les registres
 * pendant `next build`.
 */

import { assertRegistresValides } from "./validate";

// Exécuté une fois au chargement du module, donc au build. Un registre
// incohérent casse la compilation, pas la production.
assertRegistresValides();

export * from "./cta";
export * from "./preuves";
export * from "./ressources";
export * from "./ciblage";
export { validerRegistres, assertRegistresValides, type Anomalie } from "./validate";
