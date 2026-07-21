# Spec L1 — Fiabiliser la capture des leads (funnel, lot 1)

*Repo : parrit-site. Objectif : arrêter l'hémorragie de leads. Aujourd'hui le site capte ~280 visiteurs/mois mais **0 lead n'atteint le CRM** : les formulaires postent vers le webhook n8n `parrit-lead` sans vérifier `response.ok`, donc un échec est avalé en silence et l'utilisateur voit quand même un « merci ».*

## Contexte vérifié

- Point de capture central : les formulaires du site POSTent vers le webhook `https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead`.
- Symptôme mesuré (21/07) : aucune ligne de source site (`lead-magnet-harnais-cout-ia`, `assistant site`, `parrit.ai`) dans la base CRM `prospects`. Soit personne ne soumet, soit les soumissions sont perdues sans alerte. Les deux se traitent ici.
- Fondation d'attribution existante : `src/lib/attribution.ts` (fonction d'attribution / `getAttribution()` ou équivalent). L'utiliser si elle existe.

## Périmètre (STRICTEMENT ce lot, ne pas déborder)

1. **Trouver TOUS les points d'envoi** vers le webhook `parrit-lead` dans `src/` (grep sur `parrit-lead` et sur l'URL du webhook). Il y en a plusieurs (contact rapide, home, page offre, `harnais-ia`, `detecteur-bullshit`, `diagnostic`, etc.). Traiter chacun.
2. **Vérifier `response.ok`** sur chaque `fetch()` du webhook. En cas d'échec réseau OU de `response.ok === false` :
   - **NE PAS** afficher l'état de succès (« merci » / confirmation). Afficher un **état d'erreur visible** (« Un problème est survenu, réessayez ») et **permettre de renvoyer**.
   - Ne jamais laisser croire à l'utilisateur que c'est envoyé si ça ne l'est pas.
3. **Payload cohérent** sur chaque formulaire :
   - un champ `source` **descriptif et stable** identifiant le formulaire. Conserver les valeurs existantes déjà signifiantes (ex. `lead-magnet-harnais-cout-ia`) ; pour un formulaire sans source claire, en ajouter une du type `site:<nom-formulaire>` (ex. `site:quickcontact`, `site:home`, `site:offre`, `site:diagnostic`).
   - l'**attribution** si `src/lib/attribution.ts` l'expose (source/UTM/landing page) — l'inclure dans le payload.
4. **Aucune régression** : le chemin nominal (succès) doit continuer à marcher exactement comme avant. On ajoute la gestion d'échec, on ne change pas l'UX de succès.

## Hors périmètre (NE PAS faire dans ce lot)

- Pas d'instrumentation PostHog / events de conversion (c'est le lot L3).
- Pas de tagging UTM des liens sortants (L4).
- Pas de refonte visuelle, pas de changement de copy, pas de nouvelle page.
- Ne pas toucher au workflow n8n (c'est côté serveur, lot L2 hors repo).

## Critères d'acceptation (definition of done)

- Chaque `fetch()` vers `parrit-lead` vérifie `response.ok` et gère l'échec sans faux succès.
- Chaque formulaire envoie un `source` descriptif + l'attribution si disponible.
- **Un test** simule une réponse webhook en échec (ex. mock `fetch` → 500 ou reject) et vérifie que l'UI affiche l'erreur et **n'affiche pas** l'état de succès. Suivre les conventions de test du repo (voir `AGENTS.md` ; unit ou Playwright selon ce qui existe déjà).
- `npm run lint` et `npm run build` passent.

## Contraintes

- Lire `AGENTS.md` et les conventions du repo AVANT de modifier.
- Respecter le design system (aucun changement visuel hors le message d'erreur, sobre, à la DA existante).
- Secrets : ne jamais committer de clé ; l'URL du webhook est déjà en clair dans le code existant, la garder telle quelle (ne pas inventer de variable d'env dans ce lot).
- Préserver tout le WIP existant. Modifications minimales et ciblées.
