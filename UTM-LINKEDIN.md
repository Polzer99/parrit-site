# Convention UTM — posts LinkedIn → parrit.ai

## Pourquoi

Sans UTM, tous les visiteurs LinkedIn apparaissent en "direct" dans PostHog. Avec UTM, on isole : quel post a converti, quelle variante de copy a marché.

## Format canonique

```
https://parrit.ai/fr?utm_source=linkedin&utm_campaign=<slug>&utm_content=<variant>
```

| Param          | Valeur                                              |
| -------------- | --------------------------------------------------- |
| `utm_source`   | `linkedin` (toujours, en minuscules)                |
| `utm_medium`   | `social` (optionnel, sous-entendu pour linkedin)    |
| `utm_campaign` | slug du post, lowercase, kebab-case                 |
| `utm_content`  | variante de copy/visuel si A/B test (`v1`, `v2`...) |

### Slugging des posts

- Format : `YYYY-MM-DD-sujet-court`
- Exemples :
  - `2026-05-06-claude-code-roi`
  - `2026-05-08-sprint-os-laparra`
  - `2026-05-10-podcast-vincent-capra`

## Exemples

```
https://parrit.ai/fr?utm_source=linkedin&utm_campaign=2026-05-06-claude-code-roi
https://parrit.ai/fr?utm_source=linkedin&utm_campaign=2026-05-06-claude-code-roi&utm_content=v2
https://parrit.ai/fr/auteur/paul-larmaraud?utm_source=linkedin&utm_campaign=2026-05-08-bio
```

## Builder rapide (en attendant un outil)

```bash
URL="https://parrit.ai/fr"
CAMPAIGN="2026-05-06-claude-code-roi"
echo "${URL}?utm_source=linkedin&utm_campaign=${CAMPAIGN}"
```

## Ce qu'on voit dans PostHog après

Filtre sur `utm_source = linkedin`, breakdown par `utm_campaign` :
- Visiteurs par post
- Funnel `pageview → cta_clicked → form_submitted` par post
- Comparaison `utm_content=v1` vs `v2` quand A/B test
