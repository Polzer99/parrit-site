import { expect, test, request as playwrightRequest } from "@playwright/test";

import {
  aliasRessourcesARediriger,
  getRessourcesPubliees,
  urlExperience,
} from "../src/lib/registry/ressources";

/**
 * ARBITRAGE PAUL DU 02/08/2026 — la structure n'ajoute pas d'étape entre le
 * visiteur et la valeur.
 *
 * Ce qui est vérifié ici, et qui doit rester vrai :
 *   1. index → valeur finale en UN clic, sans page intermédiaire ;
 *   2. aucune chaîne de redirection supérieure à une redirection ;
 *   3. `source` et `utm_*` préservés jusqu'à la destination ;
 *   4. aucun doublon canonique : une ressource, une seule URL au sitemap ;
 *   5. aucune ressource publiée sans mode d'accès véridique.
 *
 * Les assertions portent sur les URL et le registre, jamais sur des classes CSS :
 * une refonte visuelle ne doit pas casser un test de conversion.
 */

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";
const locales = ["fr", "en", "pt-BR", "zh-CN"];

/** Les ressources visibles sur l'index d'une langue de page. */
function ressourcesAttendues(locale: string) {
  return getRessourcesPubliees(locale === "en" ? "en" : "fr");
}

for (const locale of locales) {
  test(`${locale} — chaque carte de l'index ressources mène à la valeur en un clic`, async ({
    page,
  }) => {
    await page.goto(new URL(`/${locale}/ressources`, BASE_URL).toString());

    for (const r of ressourcesAttendues(locale)) {
      const cible = urlExperience(r, locale);
      const carte = page.locator(`a[href^="${cible}?source="]`);

      await expect(carte, `carte manquante pour ${r.id}`).toHaveCount(1);

      // Aucune carte ne propose deux actions : une carte, une action.
      await expect(carte.locator("a, button")).toHaveCount(0);
    }
  });

  test(`${locale} — le clic atterrit sur l'expérience, pas sur une fiche`, async ({ page }) => {
    await page.goto(new URL(`/${locale}/ressources`, BASE_URL).toString());

    const r = ressourcesAttendues(locale)[0];
    const cible = urlExperience(r, locale);

    await page.locator(`a[href^="${cible}?source="]`).first().click();
    await page.waitForURL(`**${cible}?source=ressources`);

    // La destination est la valeur : elle ne renvoie pas vers l'index d'où l'on vient.
    expect(page.url()).toContain(cible);
    expect(page.url()).toContain("source=ressources");
  });

  test(`${locale} — chaque carte du blog mène directement à l'article`, async ({ page }) => {
    await page.goto(new URL(`/${locale}/blog`, BASE_URL).toString());

    const cartes = page.locator(`a[href^="/${locale}/blog/"]`);
    const total = await cartes.count();
    expect(total).toBeGreaterThan(0);

    for (let i = 0; i < total; i += 1) {
      const href = await cartes.nth(i).getAttribute("href");
      // Article ou page de sujet : deux destinations finales, aucune fiche.
      expect(href).toMatch(new RegExp(`^/${locale}/blog/(sujet/)?[a-z0-9-]+$`));
    }
  });
}

test("aucune chaîne de redirection supérieure à une redirection", async () => {
  const api = await playwrightRequest.newContext({ baseURL: BASE_URL });

  for (const { slug, url } of aliasRessourcesARediriger()) {
    for (const locale of locales) {
      const sansSuivi = await api.get(`/${locale}/ressources/${slug}`, {
        maxRedirects: 0,
      });
      expect(sansSuivi.status(), `${locale}/${slug} doit rediriger en 301`).toBe(301);
      expect(sansSuivi.headers()["location"]).toContain(url);

      // Un seul saut : la destination répond directement, sans nouvelle redirection.
      const arrivee = await api.get(url, { maxRedirects: 0 });
      expect(arrivee.status(), `${url} ne doit pas rediriger à son tour`).toBe(200);
    }
  }

  await api.dispose();
});

test("les paramètres source et utm survivent à la redirection", async () => {
  const api = await playwrightRequest.newContext({ baseURL: BASE_URL });
  const requete = "?source=linkedin&utm_source=li&utm_campaign=aout&utm_medium=post";

  for (const { slug } of aliasRessourcesARediriger()) {
    const reponse = await api.get(`/fr/ressources/${slug}${requete}`, { maxRedirects: 0 });
    const location = reponse.headers()["location"] ?? "";

    for (const parametre of [
      "source=linkedin",
      "utm_source=li",
      "utm_campaign=aout",
      "utm_medium=post",
    ]) {
      expect(location, `${slug} perd ${parametre}`).toContain(parametre);
    }
  }

  await api.dispose();
});

test("aucun doublon canonique : une ressource, une seule URL au sitemap", async () => {
  const api = await playwrightRequest.newContext({ baseURL: BASE_URL });
  const sitemap = await (await api.get("/sitemap.xml")).text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  // Aucune URL en double, toutes ressources confondues.
  expect(new Set(urls).size).toBe(urls.length);

  for (const { slug, url } of aliasRessourcesARediriger()) {
    // L'expérience est au sitemap...
    expect(urls.some((u) => u.endsWith(url))).toBe(true);
    // ...et l'alias qui redirige vers elle n'y est pas.
    for (const locale of locales) {
      expect(urls).not.toContain(`https://parrit.ai/${locale}/ressources/${slug}`);
    }
  }

  await api.dispose();
});

test("aucune ressource publiée sans mode d'accès véridique", async () => {
  const api = await playwrightRequest.newContext({ baseURL: BASE_URL });

  for (const r of getRessourcesPubliees()) {
    const cible = urlExperience(r, "fr");
    expect(cible, `${r.id} sans URL d'expérience`).toBeTruthy();

    const reponse = await api.get(cible, { maxRedirects: 0 });
    expect(reponse.status(), `${r.id} : l'expérience ${cible} ne répond pas`).toBe(200);
  }

  await api.dispose();
});
