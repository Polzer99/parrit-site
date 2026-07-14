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

**Corrigé et EN PROD par #146 (14/07, ne pas reproposer) :**
- [item 6] `en.json` `casVitrines` : 5 résidus FR traduits (`6 weeks`, `analysis`, `Telegram alerts`, `signal analysis`, `enrichment`).
- [item 12] CTA home « Voir la démo » → « Réserver une démo » (4 langues) — libellé honnête, mène toujours à `/rendez-vous`.
- [item 3] Ressource `demarrer-claude-code` : CTA final « Parler à Paul » (`#gate`) → « Réserver 15 min avec Paul » (`/rendez-vous?source=ressource-demarrer`).
- [item 4] Route morte `src/app/[lang]/audit-claude-code` SUPPRIMÉE (301 → `/audit` conservé dans `next.config.ts`).
- [item 11] `layout.tsx` JSON-LD réaligné sur les 3 offres canoniques (Transformation IA/`croissance` · Agent IA·Sprint agentique/`deployer` · Formation agentique/`transmettre`) + La Veille, `url` par offre ; « Sprint à impact »/« Operating Partner » supprimés. TRUTH §7 → home = `HomeDeux`.

**Vérifié NON-défaut (ne rien faire) :**
- [item 5] `setup-claude-code`/`remote`/`glossaire` = landings SEO/GEO volontaires (rendent `LandingPage`, atteignables par recherche/ads). Les garder au sitemap sert le GEO ; le seul manque = un lien humain, couvert par le footer unifié (item 2) le jour où il existe.
- [items 7/8] EN des offres (`OfferPage`) relu = correct (`<b>-40%</b> processing time…`). « OPCO » n'apparaît que dans le JSON-LD/llms (exact) et `/os-classic` (noindex). Pas de reformulation nécessaire.

**Backlog RESTANT (nécessite Paul ou un vrai lot design/i18n) :**
1+2. [conversion P0 / compliance P1 — DESIGN + DONNÉES PAUL] **Footer unifié + légal.** Aujourd'hui chaque page a un `<footer>` bespoke (HomeDeux `hd-cta`, etc.) et AUCUN composant partagé → un footer global doublerait l'existant : c'est une refonte (unifier les footers en un `SiteFooter` avec liens 3 offres + Ressources + Blog + RDV, ce qui règle aussi la nav des offres et relie `glossaire`). Le volet **mentions légales + politique RGPD** exige les données d'immatriculation (SIREN, RCS, capital, directeur de publication, hébergeur=Vercel) → **à fournir par Paul** avant de publier une page légale (pas de placeholder en prod).
9. [i18n P1] Catalogue d'agents (`catalog.json`) rendu en FR sur /en·pt·zh. Lot de traduction (`catalog.json` multilingue ou dictionnaire).
10. [DA — DÉCISION PAUL] Palette : app TRUTH §6.3 (`#F5F8FF`/`#161616`/`#AA0003`) vs canon design-system + ressources statiques (`#FFFDFA`/`#0C0C0D`/`#D1132F`). Deux DA sur le même domaine. Trancher le canon, puis harmoniser.
