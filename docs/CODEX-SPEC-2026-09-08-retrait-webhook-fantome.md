# SPEC · Retrait de l'appel webhook fantôme des leads (déchet ancien site)

Date : 2026-09-08. Ordre Paul : « aucun déchet en lien avec l'ancien
site ». Un seul fichier : `src/app/api/interet/route.ts`.

## Constat prouvé (fiche mémoire project_leads_notif_chaine_cassee_2026_09_08)

`PARRIT_LEAD_WEBHOOK` (env Vercel) pointe vers une cible vivante qui
répond 2xx mais qui n'est PAS l'instance n8n canon : le webhook
`parrit-lead` de l'instance canon affiche 0 exécution depuis toujours
alors que la base enregistre tout (3 880 exécutions d'autres
workflows). L'appel produit un faux signal `notification: "envoyee"`
et n'aboutit nulle part. Le canal réel des leads est la carte
`telegram_queue` posée par `poserCarteSuperApp` (qui ne bouge PAS).

## Modification

Dans `src/app/api/interet/route.ts` :
1. Supprimer la constante `WEBHOOK_LEAD` (ligne
   `const WEBHOOK_LEAD = process.env.PARRIT_LEAD_WEBHOOK ?? "";`).
2. Supprimer le bloc entier `if (WEBHOOK_LEAD && ...) { ... }` (le
   fetch et l'affectation de `notification`).
3. Supprimer la variable `notification` et son champ dans le
   `Response.json` final (aucun composant client ne le lit, vérifié
   par grep sur src/system/components et src/lib).
4. Ajuster le commentaire d'en-tête du fichier s'il mentionne encore
   « la notification n8n vient APRÈS la persistance » : la
   notification passe désormais UNIQUEMENT par la carte
   `telegram_queue` (orchestrateur, règle 17) ; la ligne de commentaire
   doit dire cela.

Ne rien changer d'autre : ni `poserCarteSuperApp`, ni la persistance,
ni la réponse restante (ok, submissionId, prospectId, dejaEnregistre,
sketchUrl).

## Preuve attendue

Build OK ; `grep -rn PARRIT_LEAD_WEBHOOK src/` vide ; suite Playwright
complète verte ; un POST local sur /api/interet répond ok:true sans
champ notification.
