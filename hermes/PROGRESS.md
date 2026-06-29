# Hermes — PROGRESS (mémoire entre les cycles)

> Mémoire versionnée et auditable de la boucle d'amélioration continue. Hermes lit le bas de ce fichier à chaque cycle pour ne pas répéter, et pour mesurer l'effet des changements déjà mergés. **N'efface jamais l'historique** : on apprend de ce qui n'a pas marché aussi.

Format d'une entrée : date · cycle/hypothèse · ce qui a été mergé · effet mesuré (métrique avant→après) · leçon.

---

## Apprentissages durables (résumé en tête)
- _(vide — premier cycle)_

## Journal des cycles
### 2026-06-18 — bootstrap
- Hermes v1 mis en place (source de vérité commune `TRUTH.md`, boucle `hermes.mjs`, autonomie L2 human-triggered).
- Observation v1 = audit qualitatif du contenu live (PostHog quantitatif pas encore câblé : pas de clé Query API → gap déclaré dans `LOOP.md`).
- Prochain cycle : lancer `node hermes/hermes.mjs`, choisir la proposition #1, la passer en issue Codex, merger (3 feux), puis mesurer.

### 2026-06-18 — cycle Hermes
- inputs : 5 surfaces live, memoire OK, analytics qualitatif
- 5 propositions (top : "Clarifier l'offre dès le hero" ICE 504)
- statut : propose, en attente merge HITL → `proposals/2026-06-18.md`

- issue Codex ouverte (proposition #2, mobile CTA) : https://github.com/Polzer99/parrit-site/issues/7

### 2026-06-18 — cycle Hermes
- inputs : 5 surfaces live, memoire OK, analytics PostHog quantitatif
- 5 propositions (top : "Clarifier l'offre dès le hero" ICE 504)
- statut : propose, en attente merge HITL → `proposals/2026-06-18.md`

### 2026-06-21 — cycle Hermes
- inputs : 5 surfaces live, memoire OK, analytics PostHog quantitatif
- 5 propositions (top : "Clarifier l'offre dès le hero" ICE 504)
- statut : propose, en attente merge HITL → `proposals/2026-06-21.md`
- issue Codex ouverte : https://github.com/Polzer99/parrit-site/issues/16

### 2026-06-21 — cycle Hermes
- inputs : 6 surfaces live, memoire OK, analytics PostHog quantitatif
- 5 propositions (top : "Clarifier l'offre dès le hero" ICE 576)
- statut : propose, en attente merge HITL → `proposals/2026-06-21.md`
- issue Codex ouverte : https://github.com/Polzer99/parrit-site/issues/37

### 2026-06-22 — cycle Hermes
- inputs : 6 surfaces live, memoire OK, analytics PostHog quantitatif
- 5 propositions (top : "Clarifier l'offre dès le hero" ICE 504)
- statut : propose, en attente merge HITL → `proposals/2026-06-22.md`
- 2026-06-22: 3 issues hermes ouvertes -> pas de nouvelle issue (anti-pileup)

### 2026-06-29 — cycle Hermes
- inputs : 6 surfaces live, memoire OK, analytics PostHog quantitatif
- 5 propositions (top : "Clarifier l'offre dès le hero" ICE 504)
- statut : propose, en attente merge HITL → `proposals/2026-06-29.md`
- issue Codex ouverte : https://github.com/Polzer99/parrit-site/issues/106
