# Plan — Fondation analytics refonte-proof
Source spec : docs/analytics-foundation/spec.md (status: approved)
Date : 2026-07-19

## Tâche T1 : Centraliser la capture et l'attribution
- Goal : fournir une API unique strictement typée.
- File(s) : `src/lib/analytics.ts`, `src/lib/attribution.ts`, `src/components/AttributionInit.tsx`
- Steps : ajouter la taxonomie, le wrapper SSR-safe, l'extraction first-touch et l'enregistrement PostHog.
- Acceptance : tous les événements capturés par `track()` portent page, langue et attribution.
- Effort : ~20 min
- Dépend de : —

## Tâche T2 : Installer les trackers globaux
- Goal : couvrir les CTA et l'engagement indépendamment des composants visuels.
- File(s) : `src/components/CtaTracker.tsx`, `src/hooks/useEngagement.ts`, `src/app/[lang]/layout.tsx`
- Steps : listener délégué, paliers scroll throttlés, temps actif bucketisé, montage layout.
- Acceptance : événements uniques, listeners et timers nettoyés.
- Effort : ~30 min
- Dépend de : T1

## Tâche T3 : Configurer PostHog et la page rendez-vous
- Goal : activer les signaux comportementaux et instrumenter l'entrée booking.
- File(s) : `src/app/[lang]/layout.tsx`, `src/app/diagnostic/layout.tsx`, `src/components/BookingTracker.tsx`, `src/app/[lang]/rendez-vous/page.tsx`
- Steps : options rage/dead click, tracker montage + IntersectionObserver.
- Acceptance : `booking_started` différencie montage et iframe visible.
- Effort : ~20 min
- Dépend de : T1

## Tâche T4 : Migrer les événements et annoter les CTA
- Goal : uniformiser les surfaces de conversion existantes et actuelles.
- File(s) : `HomeClient.tsx`, `HomeDeux.tsx`, `LandingPage.tsx`, `OfferPage.tsx`, `QuickContact.tsx`, `DiagnosticClient.tsx`
- Steps : remplacer les captures directes, instrumenter form view/start, poser les attributs déclaratifs.
- Acceptance : aucun événement de la taxonomie ne contourne `track()` dans ce périmètre.
- Effort : ~45 min
- Dépend de : T1, T2

## Tâche T5 : Valider et publier
- Goal : livrer une PR réversible sans merge.
- File(s) : branche complète
- Steps : npm ci, lint, build, serveur local, audit contraste, revue diff, commit, push, draft PR.
- Acceptance : checks verts et URL de PR communiquée.
- Effort : ~30 min
- Dépend de : T1-T4
