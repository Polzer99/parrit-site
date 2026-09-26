# Compte rendu : Entity Identity V0

Implémentation de la spec du 26/09/2026, sur le checkout demandé
`codex/docs-CODEX-SPEC-2026-09-26-entity-identity-v0-md`, base
`260d6e9afec4a38f4c4f41d685f5458f67956d48`.
La spec non suivie préexistante est conservée intacte. Aucun commit, push ou déploiement.

## Modifications

- `src/system/auteur.ts` : identifiant personnel, ORG_ID, références Person/Organization.
- `src/system/jsonld.ts` : constructeurs purs utilisés par les deux surfaces.
- `src/app/(rev01)/layout.tsx` : Organization identifiée, founder lié, sameAs vide.
- `src/app/(rev01)/journal/[slug]/page.tsx` : BlogPosting identifié, auteur et publisher liés.
- `scripts/entity-spelling.mjs` : scan UTF-8 récursif des quatre racines, distance de Levenshtein, diagnostics fichier/ligne/variante. Seule la spec est explicitement exclue ; les binaires sont ignorés. La comparaison ne distingue pas la casse, pour préserver notamment les domaines et adresses.
- `scripts/publish-journal.mjs` : gate bloquante après copie éventuelle et avant prooflint/build/publication.
- `package.json` : commande test:entity.
- `tsconfig.json` : allowImportingTsExtensions avec noEmit, pour les imports TS exécutables directement par Node 26.
- `AI_CONTEXT.md` : contrat et vérifications documentés.

Aucun frontmatter, journal.ts, texte de page, style ou champ dateModified modifié.

## Tests et preuves

Baseline : 8/8 tests Journal, TypeScript, lint, marque et claims verts.
Candidat :

| Commande | Résultat |
| --- | --- |
| npm run test:entity | 7/7 |
| npm run test:journal | 9/9 |
| npx --no-install tsc --noEmit | code 0 |
| npm run lint | code 0 |
| npm run qa:brand:rev01 | code 0 |
| npm run qa:claims:rev01 | code 0 |
| git diff --check | code 0 |

Tests ajoutés : `tests/entity-graph.test.mjs` (références exactes, Organization et vrai article),
`tests/entity-spelling.test.mjs` (variantes prescrites, casse, seuil, tokens, récursion, exclusions, binaires et scan réel),
et un test d'intégration dans `tests/publish-journal-gates.test.mjs`. Ce dernier exécute le vrai publisher en dry-run dans un arbre temporaire, avec HOME isolé et PATH vide : une faute arrête le processus avec fichier et ligne, avant prooflint/build.

Relecture indépendante : aucun défaut bloquant ; sa suggestion de preuve d'intégration du publisher a été ajoutée.
Le premier essai de ce test a révélé l'héritage de NODE_TEST_CONTEXT dans les sous-processus : le harnais le retire pour permettre au publisher de lancer sa propre suite. Les assertions restent identiques.

## Environnement et limites

Node 26.3.0. Dépendances absentes au départ ; npm ci hors réseau échoue (ENOTCACHED).
Vérifications exécutées avec les dépendances locales du dépôt voisin, via un lien temporaire, Next 16.3.4. Aucun changement de lockfile.
La documentation Next locale JSON-LD a été consultée. Node émet un avertissement bénin de détection ESM des .ts ; aucune modification globale du type de package.
Build, serveur, navigateur et vérification de production non exécutés : la spec demande les suites Node et TypeScript, sans changement visuel ni déploiement. Aucune preuve de publication des nouveaux identifiants n'est revendiquée.

## JSON-LD avant/après

Objets avant reconstruits depuis les expressions du checkout initial ; objets après produits par les fonctions livrées.
Article réel : `content/journal/agent-ia-entreprise.mdx`. Les propriétés existantes sont conservées ; les différences portent sur les identifiants, références et sameAs.

### Organization avant

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Parrit.ai",
  "alternateName": "PARRIT.AI",
  "url": "https://parrit.ai",
  "logo": "https://parrit.ai/icon.png",
  "description": "Parrit.ai designs and builds company operating systems: commissioned, not subscribed. Based in France; operating internationally in English and French.",
  "founder": {
    "@type": "Person",
    "name": "Paul Larmaraud",
    "url": "https://paul-larmaraud.com"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Rueil-Malmaison",
    "addressCountry": "FR"
  },
  "sameAs": [
    "https://paul-larmaraud.com"
  ]
}
```

### Organization après

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://parrit.ai/#organization",
  "name": "Parrit.ai",
  "url": "https://parrit.ai",
  "alternateName": "PARRIT.AI",
  "logo": "https://parrit.ai/icon.png",
  "description": "Parrit.ai designs and builds company operating systems: commissioned, not subscribed. Based in France; operating internationally in English and French.",
  "founder": {
    "@type": "Person",
    "@id": "https://paul-larmaraud.com/#person",
    "name": "Paul Larmaraud",
    "url": "https://paul-larmaraud.com"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Rueil-Malmaison",
    "addressCountry": "FR"
  },
  "sameAs": []
}
```

### BlogPosting avant

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "What is an AI agent in a company?",
  "datePublished": "2026-05-15",
  "dateModified": "2026-05-15",
  "image": "https://parrit.ai/journal/agent-ia-entreprise/og",
  "inLanguage": "en",
  "publisher": {
    "@type": "Organization",
    "name": "Parrit.ai",
    "logo": {
      "@type": "ImageObject",
      "url": "https://parrit.ai/icon.png"
    }
  },
  "description": "An operational definition without jargon, from a partner that deploys them every week.",
  "author": {
    "@type": "Person",
    "name": "Paul Larmaraud",
    "url": "https://paul-larmaraud.com"
  },
  "mainEntityOfPage": "https://parrit.ai/journal/agent-ia-entreprise"
}
```

### BlogPosting après

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "https://parrit.ai/journal/agent-ia-entreprise#article",
  "headline": "What is an AI agent in a company?",
  "datePublished": "2026-05-15",
  "dateModified": "2026-05-15",
  "image": "https://parrit.ai/journal/agent-ia-entreprise/og",
  "inLanguage": "en",
  "publisher": {
    "@type": "Organization",
    "@id": "https://parrit.ai/#organization",
    "name": "Parrit.ai",
    "url": "https://parrit.ai",
    "logo": {
      "@type": "ImageObject",
      "url": "https://parrit.ai/icon.png"
    }
  },
  "description": "An operational definition without jargon, from a partner that deploys them every week.",
  "author": {
    "@type": "Person",
    "@id": "https://paul-larmaraud.com/#person",
    "name": "Paul Larmaraud",
    "url": "https://paul-larmaraud.com"
  },
  "mainEntityOfPage": "https://parrit.ai/journal/agent-ia-entreprise"
}
```
