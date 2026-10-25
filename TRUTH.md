# TRUTH.md — Source de vérité commune (site parrit.ai ↔ agent Hermes)

> **Ce fichier est le cerveau partagé.** Le site (`AGENTS.md` → ici) ET l'agent d'amélioration continue **Hermes** (`hermes/`) le lisent à chaque fois. Toute amélioration du site doit être *cohérente avec ce document*. Quand la réalité de Parrit change, on met à jour CE fichier d'abord (HITL) — pas le code en premier.
>
> Doctrine source (hors-repo, priment en cas de conflit) : `parrit-os/REGLES-DOR.md` · `parrit-os/VISION.md` · `parrit-os/docs/doctrine-communication/DOCTRINE-COMMUNICATION.md`. Doctrine visuelle : Brand OS P1/P3 (D1, 24/09/2026), valeurs générées `src/system/brand-os.tokens.css`, adaptation `src/system/tokens.css`, composants `src/system/`. `BRAND.md` est une archive historique.

---

## 1. Ce qu'est Parrit (positionnement)

Décision du 25/10/2026 : Parrit.ai construit des **logiciels métier**, avec l'ambition de verticaliser des produits, et accompagne les entreprises dans leur **transformation IA**. Deux parcours : PME/ETI et grands groupes ; conseil et logiciel sont ouverts aux deux. FormIA est l'organisme de formation de Parrit.ai, sans site propre. Les outils construits appartiennent au client.

Parrit livre la chose qui tourne, pas un deck. Chaque commande répond au Standard Parrit.

## 2. Rôle du site (24/10/2026)

Peu de texte : montrer les produits, les réalisations, les capacités et les preuves.
Le rendez-vous est une suite possible, pas une métrique à maximiser.
L'ancien objectif RDV/semaine et cash hebdo est remplacé le 24/10/2026.

**CTA en vigueur depuis le 04/10/2026** : « Réserver l'examen » / « Book the examination »
vers `/commission` (ou `/fr/commission`). Le libellé reste inchangé dans ce lot.
Le hero associe l'agent esquisse et la capture. Le Journal n'a pas de capture d'abonnement.

## 3. ICP (à qui on parle)

- **Cœur** : dirigeants de **PME/ETI françaises** (résistants au changement, pragmatiques, allergiques au jargon).
- **Haut de gamme** : **C-level de grands groupes** (adoption de l'agentique sur leurs couches logicielles internes propriétaires). Voix distincte, plus « démocratiser l'agentique en grand groupe ».
- Marché Afrique (Cameroun) : premium CEOs + grand public formations — géré à l'humain, hors site public.

## 4. Offres (ce qu'on vend)

Parrit vend des **systèmes sur mesure**. La Manufacture suit trois phases : Examen, Construction, Capitalisation. Chaque système est construit sur l'infrastructure du client, vérifié selon le Standard Parrit (contrôle interne, pas une accréditation), documenté et détenu par le client.

Le site public invite à un premier échange avec Parrit.ai, sans prix ni offre détaillée. Le périmètre et le prix se donnent en rendez-vous puis en propale privée (décision Paul du 12/10/2026).

La home simplifiée présente la promesse, la capture prototype et l'agent esquisse, puis les métriques, la méthode et les actions de conversion. Les cinq pages intérieures `/manufacture`, `/standard`, `/dossiers`, `/commission` et `/journal` suivent le copy FR/EN validé dans `docs/CODEX-SPEC-2026-09-06-site-integral.md` (lots 1 et 2). Le lot 3 retire les anciennes identités sans réécrire ce copy.

La surface de debug `/system` est retirée (404). Le microsite camp est conservé dans `archive/camp-costa-rica/`, avec ses assets dédiés hors de `public/`. `/camp-costa-rica/:path*` redirige définitivement vers `/` ; le proxy ne réécrit plus le domaine du camp.

Surfaces produit du site rev01 : `/`, `/manufacture`, `/standard`, `/dossiers`, `/commission`, `/journal`, `/legal` et les esquisses privées `/sketch/[id]`.

## 5. Voix (DOCTRINE-COMMUNICATION — « LE TAMIS »)

- **Operating Partner / artisan-opérateur.** Autorité **démontrée** (Enargeia : volumes, durées, le COMMENT), jamais décrétée.
- **Sobriété** (−20 % de mots), anti-LinkedIn-performatif, **zéro pathos**, zéro hook fabriqué, zéro CTA mendiant.
- **Bannis** : jargon IA creux, « je me permets », « n'hésitez pas », superlatifs, **tiret cadratin `—`**.
- Greeting contacts chauds = « Hello [Prénom] ». Cold = « Bonjour ».
- Toute copie publique passe **LE TAMIS** (8 filtres) avant publication.

## 6. Règles dures (non négociables — un changement qui les viole est REJETÉ)

1. **Prix (12/10/2026)** : aucun prix ni offre détaillée sur le site public. Périmètre et prix en rendez-vous puis en propale privée ; aucun devis personnalisé public ni promesse de ROI garanti.
2. **Clients (25/10/2026)** : seuls les noms de `src/system/public-clients.ts` sont publiables (Laparra). Tous les autres clients restent anonymisés. Aucun logo ajouté par ce lot.
3. **Couleurs (24/09/2026, D1)** : Brand OS P1/P3. Valeurs dans `src/system/brand-os.tokens.css` (généré), adaptées par `src/system/tokens.css`. Un hex dans une page ou un composant est un défaut.
4. **Polices (04/10/2026)** : General Sans pour le texte et l'interface, IBM Plex Mono pour le registre technique. Toutes deux auto-hébergées ; aucune autre famille.
5. **Jamais d'appel runtime à `*.vercel.app`** dans une livraison (le site EST sur Vercel — ça vise les ressources chargées au runtime).
6. **Pas de tiret cadratin**, pas de superlatifs creux.
7. **i18n** : une langue = une URL (lot GEO/SEO B validé le 07/09/2026). Les URLs nues rendent l’anglais ; `/fr/*` rend le français, avec canonical auto-référent et x-default sur l’anglais. La négociation `Accept-Language` redirige temporairement vers `/fr`, hors bots et hors cookie de choix. La bascule du header pose le cookie et change d’URL. Le copy reste dans les dictionnaires `DICT` par page. L’index du Journal est traduit ; ses articles restent uniquement sur leurs URLs nues en anglais.
8. **Déploiement** : push `main` → CD Vercel. Jamais de merge prod sans les **3 feux** (review APPROVE + CD/batterie vert + Paul a COMPRIS) — RÈGLES-DOR §22/§25.

9. **Tests (25/10/2026)** : les tests contrôlent les règles de fond et la structure, pas des libellés.

## 7. Architecture du site (où agir)

- Stack : Next.js 16 / React 19 / TypeScript / Tailwind v4, Vercel, français et anglais. Mesure d'audience (05/10/2026) : PostHog retiré du navigateur ; seule mesure active, Cloudflare Web Analytics injectée par Cloudflare hors dépôt, décrite dans `/legal`.
- Site canon : `src/app/(rev01)/`. Le copy localisé vit dans les `DICT` des pages et composants concernés.
- Capture lead : `src/system/components/QuickCapture.tsx` poste vers `/api/interet` ; `idee` rejoint `metadata.interets_declares[].idee_prototype`. `AgentEsquisse.tsx` fonctionne sans backend ni LLM. Le Journal n'a pas de capture d'abonnement. La prise de rendez-vous passe par Cal.com dans `CalInline.tsx` sur `/commission`.
- Garde-fous avant push : `npm run build`, `npm run qa:brand:rev01`, puis `npm run qa:network:rev01` avec blocage réseau global.

## 8. Définition d'une « amélioration » (le filtre de Hermes)

Une amélioration valable :
- **rend les produits, réalisations, capacités ou preuves plus compréhensibles** (rôle du site décidé le 24/10/2026) ;
- **passe LE TAMIS** (sobre, Enargeia, pas de pathos) ;
- **respecte les règles dures** (§6) ;
- est **falsifiable** : on nomme le comportement observable à vérifier (accès à une réalisation, compréhension d'une capacité, lisibilité d'une preuve), sans maximiser les rendez-vous ;
- est **réversible** (une PR, un rollback possible).

Anti-objectifs : faire « plus joli » sans hypothèse de conversion ; ajouter du trafic vanity ; tout ce qui sent le growth-hack performatif (ça trahit la voix).

## 9. Hypothèses de conversion ouvertes (backlog vivant — Hermes entretient ceci)

- Le CTA « Réserver l'examen » / « Book the examination » (04/10/2026) propose-t-il une suite claire après les preuves ?
**Hypothèse desktop-OS close** : Paul a tranché le 04/09/2026 pour le retrait de l'instrument de la home. La home simplifiée est le canon ; ne pas réintroduire ce concept comme expérience de navigation.

- Les preuves (Enargeia) sont-elles assez concrètes et chiffrées (sans violer §6) pour créer la confiance ?
- Mobile : le funnel de contact tient-il sur mobile ?

> Hermes met à jour cette section à chaque cycle (ce qui a été testé, ce qui a bougé). Voir `hermes/PROGRESS.md`.

Décision Paul du 12/10/2026, marque unifiée : le site parle au nom de Parrit.ai ; aucun nom de personne hors mentions légales. Auteurs, métadonnées, données structurées, RSS, textes et e-mails de capture utilisent Parrit.ai. La photo et le lien personnel sont retirés du rendu ; les fichiers photo du canon, les identifiants internes, le compte Cal.com et l’adresse de contact sont conservés.
