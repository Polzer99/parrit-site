# 08 — Carte d’implémentation

Adapt paths to the detected framework.

```text
src/
  design-system/
    tokens/
    primitives/
    components/
    patterns/
    index.ts
  content/
    fr/
    en/
  features/
    hermes/
      components/
      adapters/
      fixtures/
      analytics/
      types.ts
  analytics/
    events.ts
    consent.ts
  experiments/
    flags.ts
brand/
experiments/
docs/
```

## Suggested stable component API

```ts
<SectionLabel index="01" label="Agents en production" />
<EditorialHeadline emphasis="exécutent">...</EditorialHeadline>
<InputOutputCase input={...} output={...} trace={...} owner={...} />
<HermesCaseInput locale="fr" onSummary={...} />
<FeasibilitySummary summary={...} />
<AgentTrace steps={...} />
```

Names may change to fit the repository conventions, but the contracts should remain.


## Migration recommandée

1. Inventorier les valeurs hardcodées.
2. Introduire les variables sémantiques sans casser le rendu.
3. Migrer les primitives.
4. Migrer les composants de la homepage.
5. Construire le parcours Hermès derrière un adapter.
6. Migrer les pages secondaires une fois la homepage validée.
7. Supprimer les anciens tokens uniquement après régression visuelle et recherche d’usages.

Ne pas introduire un nouveau framework UI tant que le repository existant permet une migration propre.
