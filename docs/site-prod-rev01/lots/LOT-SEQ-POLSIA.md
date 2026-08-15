# LOT SEQ — Séquence Polsia sauce Parrit (spec, 15/08/2026)

Modèle : la séquence réelle reçue par Paul (system@polsia.com, projet « LoopOS »),
décodée dans `feedback_funnel_onboarding_prototype_personnalise.md`. Langue : EN.
Voix : LE SYSTÈME à la 1re personne (« I sketched… »), jamais « formation avec Paul ».

## Déjà en production (15/08)
- Déclaration d'intérêt → **esquisse générée immédiatement** : `/sketch/[submissionId]`
  (page personnalisée par intérêt + entreprise, boot « watch me work », noindex,
  jeton = UUID serveur). Le formulaire affiche « Watch your sketch being assembled ».
- Carte super app enrichie : lien esquisse + brouillon mail 1 prêt à envoyer.
- Webhook n8n reçoit `sketch_url`.

## La séquence mail (HITL v1 — chaque envoi = un swipe de Paul)
1. **M1 — instantané** « Your operating system — first sketch » : lien esquisse,
   ancre « 10 focused hours », question A/B (« examination call, or a deeper sketch
   of one flow? Just reply. »). ← brouillon déjà dans la carte.
2. **M2 — J+1** « A gap I see for {Company} » : UN insight spécifique au secteur
   (déduit du domaine/entreprise), re-ancre 10 h, même question A/B.
3. **M3 — J+3** « Two directions ready for {Company} » : deux next steps concrets
   tirés de l'intérêt déclaré, reply = choisir.
4. **M4 — J+6** « Last check-in » : fin de séquence explicite, porte laissée ouverte.

## Règles
- §19/§27 : aucun envoi sans swipe tant que Paul n'a pas basculé l'interrupteur
  full-auto (phase 2 : M1 seul passe en auto, transactionnel).
- Jamais de chiffre inventé présenté comme réel : l'esquisse se dit « sketch, not
  a promise ». PC-10.
- Événements PostHog : `prototype_requested` (fait), + `sketch_viewed` à brancher
  sur la page esquisse (autocapture couvre le pageview ; l'event nommé viendra
  avec la lecture des relances).

## Phase 2 (après rodage sur les premiers leads réels)
- M1 auto (envoi transactionnel direct), M2-M4 restent au swipe.
- Insight M2 généré par LLM via OpenRouter (§7), relu en carte avant envoi.
