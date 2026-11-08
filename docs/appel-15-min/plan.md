# Plan d'exécution, appel de 15 minutes, lot A

Source approuvée : `docs/CODEX-SPEC-2026-11-08-appel-15-min-lot-a.md`,
« go appel » du 08/11/2026 et demande explicite d'implémentation intégrale.

## Cadre

Dépôt courant explicitement désigné, baseline `27967907c3280b8d4afbc0c2a1768deccde4a767`.
Seule la spec est non suivie au départ ; elle reste intacte.
Écriture locale réversible, fichiers source/tests/documentation seulement ;
aucune donnée métier, aucun système client, 0 ligne de données.
Sauvegarde : HEAD et spec préexistante ; retrait possible du seul diff de ce lot.
Aucun commit, push ni déploiement. Une relecture indépendante et une correction
au maximum, puis vérification et rapport. Aucun essai de réservation réelle.

## T1 : Établir les preuves et le banc

- Lire les règles, les composants, le routage et les dépendances installées.
- `npm ci`, lint, build Webpack puis tests Node avant modification.
- Ajouter les tests de filtrage, liens, rendu bilingue et parcours navigateur.
- Acceptation : baseline connue et tests nouveaux rouges avant implémentation.

## T2 : Relier l'attribution et les destinations

- `src/system/booking.ts` : textes partagés et filtrage de la requête.
- `CalInline.tsx` : prop facultative, config inchangée sans paramètres.
- `locale.ts`, `proxy.ts`, `cta.ts`, `attribution.ts` : destination localisée,
  source posée uniquement par `avecSource`, retrait du lien Google inutilisé.
- Acceptation : valeurs source invalides ignorées ; UTM transmis sans stockage.

## T3 : Ajouter la page et le bloc

- Page `/rendez-vous` : metadata localisée, noindex/follow, calendrier et mail.
- Composant partagé `BookingCall` et CSS dans `src/system`, ajouté après le
  corps d'article et à la place de la dernière section des thèmes.
- Acceptation : un seul exec, quatre éléments, langues et destinations exactes.
- Préserver l'accueil, les contenus et styles d'articles, sitemap, llms et publication.

## T4 : Amender les règles et vérifier

- Ajout en tête d'AGENTS ; seule phrase du rôle du site modifiée dans TRUTH.
- Adapter uniquement les anciennes interdictions incompatibles avec les textes
  désormais explicitement autorisés ; conserver les contrôles ailleurs.
- Revue indépendante, correction éventuelle, lint/build/tests/marque/Brand OS.
- Banc navigateur avec SDK installé et iframe servis localement, deny-all.
- Captures 1440/375 si l'environnement le permet ; sinon commandes de reprise
  et absence de preuve visuelle explicites. Preuve Cal.com réelle hors mandat.

## Sources établies le 08/11/2026

- `@calcom/embed-react` 1.5.3, `dist/Cal.es.mjs` : transmet `config` à `inline`.
- `@calcom/embed-core/dist/embed/embed.js` : `buildFilteredQueryParams` transforme
  chaque entrée (tableaux compris) en URLSearchParams ; `createIframe` les ajoute
  à l'URL. `metadata[source]` et `utm_*` sont donc supportés sans contournement.
- Guide Next installé `page.md` : `searchParams` est une Promise, valeurs
  string/string[]/undefined. Context7 Next 16.2.9 confirme ce contrat.
- Les articles gardent leur URL canonique anglaise ; leur rendu FR sera testé
  avec le contexte serveur FR existant, sans ajouter de route française.
