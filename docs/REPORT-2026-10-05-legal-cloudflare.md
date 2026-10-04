# Rapport — page légale Cloudflare

Spec : `docs/CODEX-SPEC-2026-10-05-parrit-ai-legal-cloudflare-v1.md`.

## Périmètre

Modification locale et réversible de la page légale FR/EN, ajout de deux tests dans `tests/privacy-corrections.test.mjs` et du présent rapport. Aucune modification du runtime, des scripts analytics, des styles ou des dépendances déclarées. Aucun commit, push ni déploiement. La spec non suivie préexistante est conservée. Aucun système distant ni donnée métier modifié.

Les constats Cloudflare proviennent de la spec datée du 05/10/2026 ; ils ne constituent pas une nouvelle observation de production par cette session (horloge locale : 04/10/2026).

## Texte avant/après

### FR

**Mesure d’audience — avant**

Le site ne mesure plus l’audience dans votre navigateur.

**Après**

Cloudflare, qui achemine le site, mesure les performances des pages (temps de chargement) et compte les visites. Cette mesure ne dépose ni cookie ni stockage dans votre navigateur et ne produit que des statistiques agrégées. Base légale : notre intérêt légitime à faire fonctionner et à améliorer le site.

**Destinataires et sous-traitants — avant**

Vos données sont traitées par Parrit.ai et par les prestataires techniques strictement nécessaires au service : hébergement (Vercel), base de données (Supabase), notifications internes (Telegram), et prise de rendez-vous (Cal.com). Certains prestataires peuvent traiter des données hors de l'Union européenne, avec les garanties contractuelles exigées par le RGPD.

**Après**

Vos données sont traitées par Parrit.ai et par les prestataires techniques strictement nécessaires au service : hébergement (Vercel), acheminement du site et mesure des performances (Cloudflare), base de données (Supabase), notifications internes (Telegram), et prise de rendez-vous (Cal.com). Certains prestataires peuvent traiter des données hors de l'Union européenne, avec les garanties contractuelles exigées par le RGPD.

### EN

**Audience measurement — avant**

The site no longer measures audience in your browser.

**Après**

Cloudflare, which delivers the site, measures page performance (load times) and counts visits. This measurement sets no cookie and no browser storage, and produces aggregated statistics only. Legal basis: our legitimate interest in running and improving the site.

**Recipients and processors — avant**

Your data is processed by Parrit.ai and by the technical providers strictly necessary to the service: hosting (Vercel), database (Supabase), internal notifications (Telegram), and booking (Cal.com). Some providers may process data outside the European Union, with the contractual safeguards required by the GDPR.

**Après**

Your data is processed by Parrit.ai and by the technical providers strictly necessary to the service: hosting (Vercel), site delivery and performance measurement (Cloudflare), database (Supabase), internal notifications (Telegram), and booking (Cal.com). Some providers may process data outside the European Union, with the contractual safeguards required by the GDPR.

## Tests et exécution

Les deux nouveaux tests rendent le composant légal réel avec React, une locale simulée et les composants de chrome neutralisés. Ils exigent le paragraphe exact dans sa rubrique FR/EN, Cloudflare immédiatement après Vercel dans la liste des prestataires, et refusent les anciennes formulations (apostrophe droite, typographique ou encodée). Aucun appel réseau n'est nécessaire ; le chargeur existant interdit `fetch`.

| Contrôle | Avant | Après |
|---|---|---|
| `npm run test:privacy` | Bloqué : `react-dom` absent | Même blocage, aucune assertion exécutée |
| `npm run qa:claims:rev01` | Réussi | Réussi |
| `npm run qa:brand:rev01` | Bloqué : `color-name` absent | Même blocage |
| `npm run lint` | Non exécuté | Bloqué : `eslint` absent |
| `node --check tests/privacy-corrections.test.mjs` | Non exécuté | Réussi |
| `git diff --check` | Non exécuté | Réussi |
| Comparaison statique des paragraphes FR/EN avec la spec | Non exécuté | Réussie, anciennes formulations absentes |

L'installation `npm ci --offline --ignore-scripts --cache /tmp/parrit-legal-npm-cache` échoue avec `ENOTCACHED` (zwitch). Les guides Next locaux sont également absents ; aucune API Next n'a été modifiée, seuls les textes du dictionnaire le sont.

## Vérifications restantes hors sandbox

Conformément à la spec, aucun build ni serveur lancé dans le sandbox. Après installation des dépendances sur l'hôte : `npm run test:privacy`, `npm run lint`, `npm run qa:claims:rev01`, `npm run build`, `npm run qa:brand:rev01`, `npm run test:brand-os`, puis `npm run qa:network:rev01` avec le serveur local sur 3210. Les deux dernières suites ne sont pas exécutées ici, car elles nécessitent notamment le build. Les blocages d'environnement ne sont pas des validations fonctionnelles.

Preuve de production attendue après publication par le processus externe : vérifier les rubriques FR/EN de `/fr/legal` et `/legal`, et leur cohérence avec la mesure Cloudflare réellement injectée. Aucune preuve de publication n'est revendiquée ici.
