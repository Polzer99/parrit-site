# Migration des tests page unique

Contrat changé selon HANDOFF §0 : neuf sections et ancres, quatre thèmes Journal, suppression pages anciennes et composants visuels. Aucune assertion changée pour masquer une erreur de code ; les attentes anciennes (H01…H12, liens /commission, grain, offres, sept liens internes minimum) n’ont plus de contrat produit.

Nouveaux : single-page.test.mjs (SSR FR/EN sans réseau, ordre, preuves et consentement fail closed, empreinte portrait, booking/repli) et single-page.spec.ts (1440/390 FR/EN, typo, débordement, boutons, rose unique, booking, assets, sitemap, no-JS, légal, 404, deny-all self-test).

Conservés/adaptés : brand-os.spec.ts moteur de contraste original et seuils 4.5/3, bordures/boutons 3:1, 404 bilingue, photos ; brand-pixels et metadata-integrity intacts ; conformity-i18n mêmes tests négociation/cookies/query/canonical/hreflang, appliqués aux routes conservées ; conformity-journal intact. Les tests Node de claims Journal, légal, permissions, deadlines, provenance Brand OS, palette adversarial restent actifs. brand-os-render : routes conservées/thèmes, fondateur autorisé seulement home/legal, scènes fictives autorisées seulement home.

Supprimés et remplacés par contrats ci-dessus :
tests/aeration.spec.ts
tests/alignment-grid.spec.ts
tests/anti-slop-copy.spec.ts
tests/audit-readability.spec.ts
tests/conformity-commission.spec.ts
tests/conformity-home.spec.ts
tests/conformity-standard.spec.ts
tests/design-harmonisation.spec.ts
tests/doctrine-visible.spec.ts
tests/dossier.test.mjs
tests/ergonomie-impact.spec.ts
tests/ergonomie-impact.test.mjs
tests/grain.test.mjs
tests/internal-linking.spec.ts
tests/juridique-faiblesses.test.mjs
tests/matiere.spec.ts
tests/product-scene.spec.ts
tests/product-scene.test.mjs
tests/rev01-system.spec.ts
tests/site-v1-v4.spec.ts
tests/site-v1-v4.test.mjs
tests/site-v1-visual.spec.ts
tests/site-v1-visual.test.mjs
tests/site-v1.spec.ts
tests/six-capacites.spec.ts
tests/six-capacites.test.mjs
tests/system-card.test.mjs
tests/systems.spec.ts
tests/tour1-coherence.spec.ts
