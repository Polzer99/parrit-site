# TRUTH.md — Source de vérité commune (site parrit.ai ↔ agent Hermes)

> **Ce fichier est le cerveau partagé.** Le site (`AGENTS.md` → ici) ET l'agent d'amélioration continue **Hermes** (`hermes/`) le lisent à chaque fois. Toute amélioration du site doit être *cohérente avec ce document*. Quand la réalité de Parrit change, on met à jour CE fichier d'abord (HITL) — pas le code en premier.
>
> Doctrine source (hors-repo, priment en cas de conflit) : `parrit-os/REGLES-DOR.md` · `parrit-os/VISION.md` · `parrit-os/docs/doctrine-communication/DOCTRINE-COMMUNICATION.md`. Doctrine visuelle : `BRAND.md` (ce repo).

---

## 1. Ce qu'est Parrit (positionnement)

Parrit.ai est une **maison française indépendante**, fondée par Paul Larmaraud et menée par ses associés, qui conçoit et construit des **systèmes d'exploitation d'entreprise**. Un seul système pour comprendre, décider et agir à l'échelle de l'entreprise, construit pour une entreprise à la fois. Une commande, pas un abonnement.

Parrit livre la chose qui tourne, pas un deck. Chaque commande est menée en personne par un associé et répond au Standard Parrit.

## 2. North stars (ce que la conversion doit servir)

1. **RDV qualifiés / semaine** (le site doit transformer un visiteur dirigeant en RDV).
2. **Cash hebdo** (les RDV deviennent des deals).

> Le rôle du SITE dans ce système = **transformer l'attention d'un dirigeant en RDV qualifié avec Paul.** C'est la métrique de conversion nord. Tout le reste (trafic, GEO, contenu) est en amont.

**CTA primaire du site** : « Parlons-en » / réserver un Examen de 30 minutes. Surfaces : capture prototype `QuickCapture`, formulaire complet `RegisterInterest`, puis calendrier Cal.com sur `/commission`.

## 3. ICP (à qui on parle)

- **Cœur** : dirigeants de **PME/ETI françaises** (résistants au changement, pragmatiques, allergiques au jargon).
- **Haut de gamme** : **C-level de grands groupes** (adoption de l'agentique sur leurs couches logicielles internes propriétaires). Voix distincte, plus « démocratiser l'agentique en grand groupe ».
- Marché Afrique (Cameroun) : premium CEOs + grand public formations — géré à l'humain, hors site public.

## 4. Offres (ce qu'on vend)

Parrit vend des **systèmes d'exploitation d'entreprise sur mesure**. La Manufacture suit trois phases : Examen, Construction, Capitalisation. Chaque système est construit sur l'infrastructure du client, certifié selon le Standard Parrit, documenté et détenu par le client.

Les commandes sont **sur devis** : périmètre et conditions sont cadrés par écrit après l'Examen. Le site public n'affiche aucun prix.

Surfaces produit du site rev01 : `/`, `/manufacture`, `/standard`, `/dossiers`, `/commission`, `/journal`, `/legal` et les esquisses privées `/sketch/[id]`.

## 5. Voix (DOCTRINE-COMMUNICATION — « LE TAMIS »)

- **Operating Partner / artisan-opérateur.** Autorité **démontrée** (Enargeia : volumes, durées, le COMMENT), jamais décrétée.
- **Sobriété** (−20 % de mots), anti-LinkedIn-performatif, **zéro pathos**, zéro hook fabriqué, zéro CTA mendiant.
- **Bannis** : jargon IA creux, « je me permets », « n'hésitez pas », superlatifs, **tiret cadratin `—`**.
- Greeting contacts chauds = « Hello [Prénom] ». Cold = « Bonjour ».
- Toute copie publique passe **LE TAMIS** (8 filtres) avant publication.

## 6. Règles dures (non négociables — un changement qui les viole est REJETÉ)

1. **Prix** : depuis le pivot 2026, les offres sont **sur devis** (périmètre et prix cadrés après diagnostic) et **la home n'affiche AUCUN prix**. Interdit : ré-afficher les anciens prix fermes (Sprint 5 000 €, Abonnement 99 €/mois, Évolution 250 €/h) — ils sont retirés. Pas de devis personnalisé hors propale privée, pas de promesse de ROI garanti. « sur devis » est la formulation validée pour le prix public.
2. **Pas de noms de clients** en texte (anonymisé ; mur de logos visuel autorisé, override Paul `BRAND.md §6`).
3. **Palette stricte rev02** : les valeurs vivent uniquement dans `src/system/tokens.css`. Registres carbone et papier froid, Parrit Red `#E10600`. Un hex écrit dans une page ou un composant est un défaut.
4. **Polices** : General Sans pour le corps et l'interface, JetBrains Mono pour le registre technique, Fraunces réservée aux grands titres éditoriaux. Elles sont auto-hébergées dans `public/fonts/rev02/`.
5. **Jamais d'appel runtime à `*.vercel.app`** dans une livraison (le site EST sur Vercel — ça vise les ressources chargées au runtime).
6. **Pas de tiret cadratin**, pas de superlatifs creux.
7. **i18n** : le site rev01 existe en `fr · en`, sans préfixe de route. La langue suit le choix persistant du visiteur, puis `Accept-Language` : français pour un navigateur français, anglais sinon. Le copy vit dans des dictionnaires `DICT` par page. Les articles du Journal gardent leur langue d'origine.
8. **Déploiement** : push `main` → CD Vercel. Jamais de merge prod sans les **3 feux** (review APPROVE + CD/batterie vert + Paul a COMPRIS) — RÈGLES-DOR §22/§25.

## 7. Architecture du site (où agir)

- Stack : Next.js 16 / React 19 / TypeScript / Tailwind v4, Vercel, français et anglais. Analytics **PostHog** (`eu.i.posthog.com`, autocapture et session replay).
- Site canon : `src/app/(rev01)/`. Le copy localisé vit dans les `DICT` des pages et composants concernés.
- Capture lead : `src/system/components/QuickCapture.tsx` et `RegisterInterest.tsx` postent vers `/api/interet`. La prise de rendez-vous passe par Cal.com dans `CalInline.tsx` sur `/commission`.
- Garde-fous avant push : `npm run build`, `npm run qa:brand:rev01`, puis `npm run qa:network:rev01` avec blocage réseau global.

## 8. Définition d'une « amélioration » (le filtre de Hermes)

Une amélioration valable :
- **sert une north star** (plus de RDV qualifiés, ou un funnel moins fuyard, ou un meilleur signal/bruit pour le dirigeant cible) ;
- **passe LE TAMIS** (sobre, Enargeia, pas de pathos) ;
- **respecte les 7 règles dures** (§6) ;
- est **falsifiable** : on nomme la métrique qui devra bouger (taux de soumission `QuickCapture` ou `RegisterInterest`, clics CTA, RDV/sem) ;
- est **réversible** (une PR, un rollback possible).

Anti-objectifs : faire « plus joli » sans hypothèse de conversion ; ajouter du trafic vanity ; tout ce qui sent le growth-hack performatif (ça trahit la voix).

## 9. Hypothèses de conversion ouvertes (backlog vivant — Hermes entretient ceci)

- Le CTA « Parler à Paul » est-il assez tôt / assez clair au-dessus de la ligne de flottaison ?
- Le concept « desktop-OS » est-il un coût cognitif pour un dirigeant pressé (vs clarté de l'offre) ?
- Les preuves (Enargeia) sont-elles assez concrètes et chiffrées (sans violer §6) pour créer la confiance ?
- Le détecteur de bullshit (`/outils/detecteur-bullshit`) ramène-t-il des leads qualifiés (action `bullshit_detector_lead`) ? Quel est son taux de gate-email ?
- Mobile : le funnel de contact tient-il sur mobile ?

> Hermes met à jour cette section à chaque cycle (ce qui a été testé, ce qui a bougé). Voir `hermes/PROGRESS.md`.
