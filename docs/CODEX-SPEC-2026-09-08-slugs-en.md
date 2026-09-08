# SPEC · Journal : slugs anglais pour les 12 entrées indexables à slug FR

Date : 2026-09-08. Mandat GEO (« référencé sur la partie anglaise
aussi ») : le Journal est un rail 100 % EN, mais 12 entrées indexables
portent encore un slug FR qui promet un contenu FR. On renomme en EN
avec 301, MAINTENANT (avant indexation profonde du /fr tout neuf). Les
9 entrées noindex gardent leur slug (elles attendent leur
retravail-ou-suppression, décision Paul).

## 1. La table de renommage (12 entrées)

| Ancien slug | Nouveau slug |
|---|---|
| agent-whatsapp-business-entreprise | whatsapp-business-agent |
| crm-automatise-pme-artisans | automated-crm-for-smes |
| evaluation-adoption-sap-intelligence-artificielle | measuring-sap-adoption-with-ai |
| facturation-automatique-ia-pme | automated-invoicing-with-ai |
| glm-5-2-souverainete | glm-5-2-sovereignty |
| prospection-ia-signaux-podcasts-linkedin | ai-prospecting-weak-signals |
| publier-sans-relecture-humaine | publishing-without-human-review |
| securite-agents-ia-entreprise | ai-agent-security-in-the-enterprise |
| une-carte-une-action | one-card-one-action |
| veille-juridique-automatisee-avocats | automated-legal-intelligence-for-lawyers |
| le-bon-endroit-pour-ecrire | the-right-place-to-write |
| le-brouillon-qui-sait-se-taire | the-draft-that-knows-when-to-stay-silent |

## 2. Ce qui change

a) `content/journal/` : renommer chaque fichier `<ancien>.mdx` en
`<nouveau>.mdx` ET mettre le champ frontmatter `slug` au nouveau (le
validateur exige slug === nom de fichier). AUCUN autre champ ni le
corps ne changent.

b) `next.config.ts` : ajouter une constante `RENOMMAGES_JOURNAL` (map
ancien → nouveau, les 12 lignes) et générer pour chacune une
redirection `{ source: "/journal/<ancien>", destination:
"/journal/<nouveau>", statusCode: 301 }`, insérée dans `redirects()` à
côté de `...REDIRECTIONS_JOURNAL`. Adapter `REDIRECTIONS_JOURNAL` pour
que les destinations legacy passent par la map : si le slug est dans
`RENOMMAGES_JOURNAL`, `destination = /journal/<nouveau>` (un seul saut
depuis les vieilles routes blog/actualite/glossaire, pas de chaîne).

c) Tests, recalibrage des verrous (jamais de suppression) :
- `tests/conformity-journal.spec.ts` : le test du footer registry-line
  visite `/journal/une-carte-une-action` → le faire visiter
  `/journal/one-card-one-action`.
- `tests/conformity-i18n.spec.ts` : le test « Journal articles are
  English only, including legacy French aliases » utilise
  `/journal/une-carte-une-action` → passer au nouveau slug
  `/journal/one-card-one-action` (mêmes assertions).
- Ajouter dans `tests/conformity-journal.spec.ts` un test « renamed
  French slugs answer one permanent redirect » qui vérifie sur DEUX
  échantillons (`/journal/une-carte-une-action` →
  `/journal/one-card-one-action` et `/journal/glm-5-2-souverainete` →
  `/journal/glm-5-2-sovereignty`) : statut 301 en un seul saut, via la
  fixture `request` avec `maxRedirects: 0` (pas de page.goto pour du
  protocole).

d) Vérifier au grep qu'aucun fichier de `src/` ni de `content/` ne
référence un ancien slug ailleurs que dans la map de redirection.

## Preuve attendue

Build OK ; les 12 nouveaux slugs dans le sitemap et plus aucun des 12
anciens ; suite Playwright complète verte ; `curl -s -o /dev/null -w
"%{http_code} %{redirect_url}" /journal/une-carte-une-action` → 301
vers /journal/one-card-one-action.
