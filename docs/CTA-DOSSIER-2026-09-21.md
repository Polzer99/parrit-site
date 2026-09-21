# Dossier de travail — CTA du funnel (21/09/2026)

Document interne, jamais publié. Un CTA par ligne : promesse, données demandées,
destination, état réellement obtenu, responsable de la suite, preuve de
fonctionnement vérifiée pendant cet audit de reprise.

| CTA | Promesse | Données demandées | Destination | État obtenu | Responsable de la suite | Preuve |
|---|---|---|---|---|---|---|
| Formulaire fusionné hero (« Envoyer ma demande », ex-« Recevez votre prototype ») | Une demande enregistrée, avec un exemple illustratif accessible tout de suite | E-mail (obligatoire), description de l'opération (facultative, reprise du besoin déjà saisi) | Confirmation sur place + lien `/sketch/[id]` | Ligne `prospects` créée/mise à jour (Supabase), `touchpoint` posé, carte `telegram_queue` tentée (best-effort, un échec n'annule pas le succès) | Paul (envoi humain, §27/§30) | `src/lib/server/interets.ts` : réponse `200` uniquement après confirmation base ; échec de carte journalisé, pas bloquant |
| Formulaire `QuickCapture` autonome sur `/commission` (« Pas de créneau ? Laissez votre e-mail ») | Idem, sans description de besoin | E-mail | Confirmation sur place | Idem | Paul | Même code serveur (`/api/interet`) |
| « Parlons-en » / « Let's talk » → `/commission` | Réserver un examen de 15 minutes avec le fondateur | Ce que demande l'embed Cal.com (hors dépôt) | Confirmation Cal.com + invitation calendrier | Un rendez-vous réel programmé | Le fondateur (tient l'appel) | `paul-larmaraud/audit`, 15 min, vérifié chargé pendant cet audit |
| « Découvrir Build With You » / OfferCard | Navigation seule | Aucune | `/build-with-you` | Page affichée | — | — |
| « Réserver un examen » (offre « Système sur mesure ») | Réserver le même examen de 15 min | — | `/commission` | Identique à la ligne Cal.com ci-dessus | Le fondateur | Idem |
| Lien « Voir l'exemple illustratif » (ex-« Voir l'esquisse s'assembler ») après confirmation | Un exemple prédéfini par catégorie de besoin, pas une analyse personnalisée | Aucune (URL = jeton d'accès `submissionId`) | `/sketch/[id]` | Page statique rendue depuis un des 4 gabarits (`SKETCHES`), langue et entreprise substituées | — | `src/lib/server/sketch.ts` (lecture seule), `sketch/[id]/page.tsx` |
| Bouton « Parlons-en » de fin de page (Dossiers, Standard, Systems, Sketch) | Identique à la ligne Cal.com | Identique | `/commission` | Identique | Le fondateur | Identique |

Ce tableau ne remplace aucune doctrine (`site.config.ts`, `interets.ts`) : il
documente ce qui existe, pour vérifier que chaque libellé public correspond à
ce que ce tableau décrit — pas l'inverse.
