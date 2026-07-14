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

### 2026-06-30 — cycle Hermes
- inputs : 6 surfaces live, memoire OK, analytics PostHog quantitatif
- 5 propositions (top : "Clarifier l'offre dès le hero" ICE 504)
- statut : propose, en attente merge HITL → `proposals/2026-06-30.md`
- issue Codex ouverte : https://github.com/Polzer99/parrit-site/issues/109

### 2026-07-06 — cycle Hermes
- inputs : 6 surfaces live, memoire OK, analytics PostHog quantitatif
- 5 propositions (top : "Remplacer le hero 'chemin de l'IA' par une offre claire" ICE 504)
- statut : propose, en attente merge HITL → `proposals/2026-07-06.md`
- 2026-07-06: 3 issues hermes ouvertes -> pas de nouvelle issue (anti-pileup)

### 2026-07-13 — cycle Hermes
- inputs : 6 surfaces live, memoire OK, analytics PostHog quantitatif
- 5 propositions (top : "Remplacer le hero 'chemin de l'IA' par une offre claire" ICE 504)
- statut : propose, en attente merge HITL → `proposals/2026-07-13.md`
- 2026-07-13: 3 issues hermes ouvertes -> pas de nouvelle issue (anti-pileup)

### 2026-07-14 — HANDOFF audit site (Claude, hors cycle Hermes)
Audit multi-agents du site (harmonie / EN / zones mortes / conversion) + décisions Paul.
**Déjà corrigé et EN PROD** (ne pas reproposer) :
- Pivot 3 offres SUR DEVIS, home SANS prix : TRUTH.md §4/§6.1 + llms.txt + llms-full.txt alignés (#143). Anciens prix 5 000/99/250 RETIRÉS partout.
- Gate `qa:doctrine` aligné sur le pivot (« sur devis »/« pas des POC » autorisés, em-dash toléré en commentaires) → CI de main VERTE (#143).
- Home i18n complète 4 langues (`HomeDeux` DICT) : /en·pt·zh n'étaient PAS traduits (#144).
- 404 `/efi-audit-hotels` réparé (proxy) ; `/rendez-vous` ajouté au sitemap ; 44 « espace avant deux-points » purgés dans en.json ; CTA `/architecture-claude-md` → /rendez-vous (#142).
- 3 anciennes issues Hermes « Clarifier l'offre dès le hero » (#16/#106/#109) fermées (superseded par le pivot).

**Backlog à PRENDRE (issues Codex, 3 feux) — vérifié sur origin/main + live :**
1. [conversion P0] Nav persistante partout : logo home cliquable (aujourd'hui un `<img>` nu) + liens Offres/Ressources/Blog/RDV. Les 3 offres ne sont atteignables que depuis la home.
2. [conversion/compliance P1] Footer légal (mentions légales + politique de confidentialité RGPD) cohérent sur toutes les pages — absent, alors qu'on capture email/tel et qu'on cible COMEX/DSI.
3. [conversion P1] CTA `/demarrer-claude-code` → `/rendez-vous?source=ressource-demarrer` (ressource gated sans sortie de funnel, comme `/architecture-claude-md` déjà fait).
4. [zone morte P1] `/[lang]/audit-claude-code` : `next.config.ts` redirige 301 → `/audit` MAIS la page `LandingPage` existe et n'est jamais servie. Supprimer la page OU le redirect (trancher).
5. [zone morte P1] Pages dans le sitemap jamais reliées en interne : `setup-claude-code`, `remote`, `glossaire` → les relier (nav/footer) ou les sortir du sitemap.
6. [EN P1] `en.json` clé `casVitrines` : 5 résidus FR (« 6 sem. », « (analyse) » ×2, « alertes », « (enrichissement) ») — corriger avant que la section soit câblée (aujourd'hui 404).
7. [EN P2] `OfferPage.tsx` : `resultAccent` + `result` collés sans séparateur → phrases bancales en EN (ex. « Production signal-led acquisition machine in production »).
8. [EN P2] Qualiopi/OPCO sur pages ciblant l'international (`remote`, `setup`) : expliciter en incise ou conditionner à l'audience FR.
9. [i18n P1] Catalogue d'agents (`catalog.json`) rendu en FR sur /en·pt·zh (cartes agents de la home). Prévoir un `catalog.json` multilingue ou un dictionnaire de traduction.
10. [DA — DÉCISION PAUL] Incohérence de palette : l'app suit TRUTH.md §6.3 (`#F5F8FF`/`#161616`/`#AA0003`) mais le design-system canon (skill) + les ressources statiques (`architecture-claude-md`, `demarrer-claude-code`) suivent `#FFFDFA`/`#0C0C0D`/`#D1132F`. Deux DA coexistent sur le même domaine. Trancher laquelle est canon, puis harmoniser.
11. [doctrine] `layout.tsx` JSON-LD « Sprint à impact / Sprint agentique » : aligner sur les 3 offres pivot. TRUTH.md §7 pointe encore `HomeClient` comme home (corrigé côté AGENTS.md, à répercuter dans TRUTH.md §7).
12. [conversion P2] CTA home « Voir la démo » mène à `/rendez-vous` (pas une vraie démo) → renommer « Réserver une démo » ou brancher une démo passive.
