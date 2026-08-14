# HOTFIX H1 — Bascule du webhook de capture de leads
PARRIT / SITE-PROD · HOTFIX H1 · 2026-08-14 · SPEC POUR CODEX

## Contexte
Toute la capture de leads du site poste sur l'ancienne instance n8n
`https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead` (VPS en cours d'évacuation).
L'instance cible `https://n8n.srv1857989.hstgr.cloud/webhook/parrit-lead` est **déjà
opérationnelle et prouvée de bout en bout** (test du 14/08 : webhook → Google Sheets →
Gmail ×2 → Supabase RPC `ingerer_lead_site`, ligne vérifiée dans `contacts`).

## Tâche (mécanique, aucune décision de design)
1. Remplacer **toutes** les occurrences de `n8n.srv1115145.hstgr.cloud` par
   `n8n.srv1857989.hstgr.cloud` dans le code du site. Fichiers connus (vérifier par grep,
   la liste peut être incomplète) :
   - src/app/outils/detecteur-bullshit/DetecteurClient.tsx
   - src/app/diagnostic/DiagnosticClient.tsx
   - src/app/harnais-ia/Landing.tsx
   - src/app/camp-costa-rica/Landing.tsx
   - src/app/api/chat/lead/route.ts
   - src/app/[lang]/HomeClient.tsx
   - src/components/NewsletterVeille.tsx
   - src/components/OfferPage.tsx
   - src/components/QuickContact.tsx
   - public/efi-audit-hotels/index.html
   - public/hr-radar/index.html
2. Dans `src/app/api/chat/lead/route.ts` et `src/app/api/ressource/route.ts` : si un
   défaut `process.env.PARRIT_LEAD_WEBHOOK || "<url>"` existe, mettre à jour le défaut
   vers le nouvel hôte. Ne pas toucher à la logique.
3. Ne RIEN changer d'autre. Pas de refactoring, pas de centralisation (elle viendra avec
   la refonte REV 01). Pas de modification de copy.

## Critères d'acceptation
- `grep -rn "srv1115145" src public scripts` → zéro résultat (hors ce fichier de spec et docs/).
- `npm run build` passe.
- Diff minimal : uniquement des substitutions d'URL.
