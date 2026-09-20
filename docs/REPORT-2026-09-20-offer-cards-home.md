# Livraison locale : offres home, 20/09/2026

Implémentation de la spec validée, sans commit, push, PR ni déploiement. La spec était le seul fichier non suivi au départ ; elle est conservée sans modification. Base de travail : checkout explicitement désigné par Paul, HEAD ed25e4add831 (pas une assertion sur la production).

## Fichiers et composants

- `src/system/components/OfferCard.tsx` : carte réutilisable, formatage monétaire FR/EN, une action, listes facultatives masquées si absentes/vides. Deux modes de prix fournis simultanément lèvent une erreur explicite ; aucun prix déduit.
- `src/app/(rev01)/page.tsx` : dictionnaires offers FR/EN et deux cartes entre build et Journal.
- `src/app/(rev01)/rev01.css` : grammaire commune, filet 1 px, grille deux colonnes puis une sous 768 px, tokens existants uniquement.
- `src/app/(rev01)/build-with-you/page.tsx` : promesse, trois étapes, forfait, CTA commission localisé. Réutilise K, RegistryLine, r2-wrap, r2-hero, r2-phases, r2-close et rev-button/exec. Aucun formulaire.
- `src/system/locale.ts`, `src/proxy.ts`, `src/app/sitemap.ts` : nécessaires pour rendre réellement `/fr/build-with-you`, négocier la langue et indexer les deux URL avec leurs alternates. Titres SEO distincts FR/EN, H1 canonique inchangé.
- `tests/offer-card.test.mjs` : quatre tests du rendu serveur réel (champs absents/vides, faits fournis, prix localisé, conflit des prix).
- `tests/offer-cards.spec.ts` : huit parcours FR/EN aux largeurs 375/767/768/1440 ; position de section, deux cartes, livrables, prix, liens, colonnes, débordements, navigation, langue, canonical/hreflang, page sans formulaire. Captures section/page aux largeurs 375/1440.
- `package.json` : nouveaux parcours ajoutés à qa:network:rev01.
- `AI_CONTEXT.md` : état architectural et arbitrage de prix récent documentés.

`commission/page.tsx`, `Dossier.tsx`, `dossiers/page.tsx`, le bloc maison et `tests/conformity-home.spec.ts` sont inchangés.

## Provenance des faits et arbitrages

Source consultée le 20/09/2026 : `~/parrit-os/docs/commercial-graph/commercial-graph-v1.json`, nœud `off.build-with-you`, `maj_le=2026-09-12`.

- Montant 3200 / EUR / forfait : `prix.montant_ht`, `prix.devise`, `prix.unite`. Traduction EN du forfait : fixed fee ; HT : excl. VAT. Aucun montant recalculé.
- Format 10 heures : `attributes.duration_A`.
- Audit offert 30 min, restitution 30 min, construction 10 heures avec le fondateur : `resume`.
- Audience et promesse de système qui tourne construit ensemble : `promesse`, `resume` ; copy et traductions conformément aux §3–4 de la spec.
- Système sur mesure, réalisation par Parrit, sur devis : spec §1/§3 et TRUTH.md §4. Examen, verdict (périmètre écrit ou non clair), conditions écrites ensuite : `src/app/(rev01)/commission/page.tsx`, DICT.fr/en.sub, noteTitle, noteBody. Aucun délai/prix/garantie ajouté.
- La décision explicite du 20/09 dans la spec prime sur l’ancienne interdiction de prix dans TRUTH.md et `prix.ancrage_public=false` dans le graphe. Aucun changement du graphe interne ni publication de ses réserves sur le site.
- Écart encore ouvert : la destination imposée `/commission` annonce 15 minutes, l’offre sourcée un audit offert de 30 minutes. Destination conservée et page commission intacte, comme demandé. La spec n’autorise pas à résoudre cet écart en modifiant le booking.

## Vérifications

Baseline avant modification : lint, TypeScript et gate de marque verts après `npm ci --ignore-scripts --no-audit --no-fund` (dépendances initialement absentes).

Candidat :

- `npm run lint` : réussi.
- `npx tsc --noEmit` : réussi.
- `npm run qa:brand:rev01` : réussi.
- `node --test tests/offer-card.test.mjs` : 4/4 réussis.
- `npx playwright test tests/offer-cards.spec.ts --list` : 8 tests collectés.
- `git diff --check` : réussi.
- `npm run build` : Turbopack est resté à l’étape compile sans résultat ; interrompu (130). Ne pas le considérer vert.
- `npm run build -- --webpack` : réussi, compilation, TypeScript, génération des 48 pages et traces terminées ; route `/build-with-you` présente. Avertissement metadataBase pendant la génération d’images, sans échec.
- `npm run qa:network:rev01 -- --workers=1 --max-failures=1` : 65 tests collectés, arrêt au premier lancement Chromium, refus macOS `bootstrap_check_in ... MachPortRendezvousServer: Permission denied (1100)`. 64 non exécutés. Ce résultat ne valide ni n’invalide le rendu produit.
- Captures : prévues comme pièces jointes par les tests, non produites en raison du blocage Chromium. Rejouer sur l’hôte avec serveur local sur 3210.
- Context7 : quota mensuel dépassé. Documentation Next 16.3.4 embarquée consultée (`page.md`, `generate-metadata.md`).

Revue indépendante statique : titre SEO identique FR/EN détecté puis corrigé ; aucun autre défaut identifié. Preuve en production/preview et revue visuelle restent à établir par le script/hôte de livraison autorisé. Aucun test réel de conversion commerciale réalisé.
