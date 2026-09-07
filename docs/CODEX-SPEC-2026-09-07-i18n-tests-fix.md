# SPEC · Réparation des 3 tests conformity-i18n (fix-forward après #234)

Date : 2026-09-07. Périmètre : `tests/conformity-i18n.spec.ts` UNIQUEMENT.
Aucun changement de code de production : le comportement serveur est prouvé
correct au curl sur le serveur local ET en prod. Ce sont les tests qui
s'appuient sur un mécanisme non fiable du runner.

## Diagnostic (constaté, pas déduit)

1. **Slash final sur la racine.** Next émet pour la home EN :
   `<link rel="canonical" href="https://parrit.ai"/>` (sans slash final),
   idem pour hreflang `en`/`x-default` et `og:url`. Les tests attendent
   `https://parrit.ai/` (avec slash). Les deux formes sont équivalentes
   pour la racine ; l'attente doit suivre ce que Next émet.

2. **Le runner `@playwright/test` n'applique PAS `page.setExtraHTTPHeaders`
   sur la PREMIÈRE navigation d'un test** (prouvé au proxy de logging le
   07/09 : premier hit arrivé avec `accept-language: en-US`, tous les
   suivants portent bien l'override ; le même code en script `playwright`
   autonome fonctionne). Conséquence : le test « French negotiation is
   302 » ne déclenche jamais la négociation, et le test Googlebot passe
   ses assertions de non-redirection pour la mauvaise raison. Les
   assertions de PROTOCOLE (statut, Location, Vary, Cache-Control,
   Set-Cookie, contenu servi à un UA donné) doivent passer par
   `APIRequestContext` (fixture `request`), qui envoie les en-têtes
   verbatim et permet `maxRedirects: 0`.

## Valeurs de référence relevées au curl sur le serveur local (build #234)

- `GET /` (UA Googlebot, Accept-Language fr) → `200` direct, HTML `lang="en"`,
  h1 `The AI system your company operates on.`, canonical `https://parrit.ai`.
- `GET /standard?source=test` (Accept-Language `fr-FR,fr;q=0.9,en;q=0.8`) →
  `302`, `location: /fr/standard?source=test` (RELATIVE en local — comparer
  via `new URL(location, BASE_URL)`), `vary: Accept-Language, Cookie,
  User-Agent`, `cache-control: private, no-store`, AUCUN `set-cookie`.
- Home EN : `og:url` = `https://parrit.ai`, hreflang `en` et `x-default` =
  `https://parrit.ai`, hreflang `fr` = `https://parrit.ai/fr`.

## Modifications demandées

### A. Aide de résolution racine

Ajouter en tête de fichier :

```ts
// Next émet la racine sans slash final (https://parrit.ai) ; toute attente
// d'URL absolue passe par ici pour suivre cette convention.
const absolute = (pathname: string) => (pathname === "/" ? SITE : `${SITE}${pathname}`);
```

Dans le test en boucle `reciprocal hreflang and path metadata`, remplacer :
- l'attente canonical `${SITE}${pathname}` → `absolute(pathname)` ;
- les attentes hreflang `${SITE}${url}` → `absolute(url)` (seuls `en` et
  `x-default` de la racine changent de valeur, `fr` reste `/fr`) ;
- l'attente `og:url` `${SITE}${pathname}` → `absolute(pathname)`.
Ne rien changer d'autre dans ce test.

### B. Test Googlebot → protocole pur

Remplacer intégralement le test
`Googlebot receives English on bare URL despite French preference` par :

```ts
test("Googlebot receives English on bare URL despite French preference", async ({ request }) => {
  // Le runner n'applique pas setExtraHTTPHeaders sur la premiere navigation
  // (constate au proxy de logging, 07/09) : les assertions de protocole
  // passent par APIRequestContext, qui envoie les en-tetes verbatim.
  const response = await request.get(`${BASE_URL}/`, {
    headers: { "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8", "User-Agent": "Googlebot" },
    maxRedirects: 0,
  });
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain('<html lang="en"');
  expect(html).toContain("The AI system your company operates on.");
  expect(html).toContain(`<link rel="canonical" href="${SITE}"/>`);
});
```

### C. Test négociation 302 → protocole pur

Remplacer intégralement le test
`French negotiation is 302, preserves query and does not record a choice` par :

```ts
test("French negotiation is 302, preserves query and does not record a choice", async ({ request }) => {
  const headers = { "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8" };
  const response = await request.get(`${BASE_URL}/standard?source=test`, { headers, maxRedirects: 0 });
  expect(response.status()).toBe(302);
  const location = new URL(response.headers()["location"] ?? "", BASE_URL);
  expect(`${location.pathname}${location.search}`).toBe("/fr/standard?source=test");
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(response.headers()["vary"]?.toLowerCase()).toContain("user-agent");
  expect(response.headers()["set-cookie"]).toBeUndefined();
  const followed = await request.get(location.href, { headers, maxRedirects: 0 });
  expect(followed.status()).toBe(200);
  expect(await followed.text()).toContain('<html lang="fr"');
});
```

## Interdits

- Ne toucher à AUCUN autre test ni à AUCUN fichier de `src/`.
- Ne pas retirer le fixture `network-deny.setup` (les requêtes
  APIRequestContext ne passent pas par les routes du contexte, mais elles
  ne visent que localhost : aucune fuite possible).
- Pas de `test.skip`, pas d'assouplissement d'assertion au-delà de ce qui
  est spécifié ici.

## Preuve attendue

`./node_modules/.bin/playwright test tests/conformity-i18n.spec.ts` →
19/19 verts, lu par EXIT CODE.
