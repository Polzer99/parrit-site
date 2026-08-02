import { expect, test, request as playwrightRequest } from "@playwright/test";

/**
 * LA BOUCLE, DE BOUT EN BOUT.
 *
 * article → ressource → formulaire → livraison → lead → persistance → attribution.
 *
 * Le test n'utilise QUE des adresses `+test@`, qui sont routées vers le
 * workspace de test : jouer cette batterie ne salit jamais le CRM.
 *
 * Ce qui est vérifié, et qui doit rester vrai :
 *   1. l'article mène à la ressource en un clic, avec son attribution ;
 *   2. la page livre réellement la valeur (les templates sont téléchargeables) ;
 *   3. la capture ne répond `ok` qu'avec un identifiant de persistance réel ;
 *   4. rejouer la même soumission ne duplique rien ;
 *   5. une ressource inconnue est refusée — on ne livre pas une URL du client ;
 *   6. l'accès n'est jamais otage de la capture.
 */

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";
const ARTICLE = "/fr/blog/securite-agents-ia-entreprise";
const RESSOURCE = "/architecture-claude-md";

/** Une adresse par exécution : l'idempotence se teste sur le submission_id. */
function emailDeTest(suffixe: string): string {
  return `paul+test-${suffixe}@parrit.ai`;
}

test("l'article mène à la ressource en un clic, avec son attribution", async ({ page }) => {
  await page.goto(new URL(ARTICLE, BASE_URL).toString());

  const lien = page.locator(`a[href^="${RESSOURCE}?source="]`);
  await expect(lien).toHaveCount(1);

  const href = await lien.getAttribute("href");
  expect(href).toContain("source=blog");

  await lien.click();
  await page.waitForURL(`**${RESSOURCE}?source=*`);
  expect(page.url()).toContain(RESSOURCE);
});

test("la ressource livre réellement sa valeur", async ({ page }) => {
  await page.goto(new URL(RESSOURCE, BASE_URL).toString());

  /* Quatre templates, en clair dans la page. La valeur ne dépend d'aucun envoi
     de courriel : c'est ce qui rend la promesse tenable. */
  const telechargements = page.locator('a[download$=".md"]');
  await expect(telechargements).toHaveCount(4);

  for (let i = 0; i < 4; i += 1) {
    const href = await telechargements.nth(i).getAttribute("href");
    expect(href, "un lien de téléchargement doit porter un contenu réel").toMatch(
      /^data:text\/markdown/,
    );
  }
});

test("la capture ne répond ok qu'avec une persistance confirmée", async () => {
  const api = await playwrightRequest.newContext({ baseURL: BASE_URL });

  const reponse = await api.post("/api/ressource", {
    data: {
      email: emailDeTest("persistance"),
      nom: "Test",
      ressourceSlug: "architecture-claude-md",
      articleSlug: "securite-agents-ia-entreprise",
      source: "blog:securite-agents-ia-entreprise",
      pageOrigine: RESSOURCE,
      lang: "fr",
      attribution: { utm_source: "playwright", utm_campaign: "boucle" },
    },
  });

  expect(reponse.status()).toBe(200);
  const corps = await reponse.json();

  expect(corps.ok).toBe(true);
  // Un identifiant de ligne réel : c'est ça, la preuve de persistance.
  expect(corps.prospectId).toMatch(/^[0-9a-f-]{36}$/i);
  expect(corps.touchpointId).toMatch(/^[0-9a-f-]{36}$/i);
  expect(corps.submissionId).toBeTruthy();
  // L'accès est rendu par le serveur, depuis le registre.
  expect(corps.ressourceUrl).toBe(RESSOURCE);

  await api.dispose();
});

test("rejouer la même soumission ne duplique rien", async () => {
  const api = await playwrightRequest.newContext({ baseURL: BASE_URL });
  const email = emailDeTest("idempotence");

  const premier = await api.post("/api/ressource", {
    data: { email, ressourceSlug: "architecture-claude-md", lang: "fr" },
  });
  const a = await premier.json();
  expect(a.ok).toBe(true);
  expect(a.dejaEnregistre).toBe(false);

  const rejeu = await api.post("/api/ressource", {
    data: {
      email,
      ressourceSlug: "architecture-claude-md",
      lang: "fr",
      submissionId: a.submissionId,
    },
  });
  const b = await rejeu.json();

  expect(b.ok).toBe(true);
  expect(b.dejaEnregistre, "la reprise doit reconnaître la soumission").toBe(true);
  expect(b.prospectId).toBe(a.prospectId);
  expect(b.touchpointId).toBe(a.touchpointId);

  await api.dispose();
});

test("une ressource inconnue est refusée", async () => {
  const api = await playwrightRequest.newContext({ baseURL: BASE_URL });

  const reponse = await api.post("/api/ressource", {
    data: { email: emailDeTest("inconnue"), ressourceSlug: "../../etc/passwd", lang: "fr" },
  });

  expect(reponse.status()).toBe(400);
  const corps = await reponse.json();
  expect(corps.ok).toBe(false);
  // Aucune URL fournie par l'appelant n'est renvoyée.
  expect(corps.ressourceUrl).toBeUndefined();

  await api.dispose();
});

test("une adresse invalide est refusée avant toute écriture", async () => {
  const api = await playwrightRequest.newContext({ baseURL: BASE_URL });

  const reponse = await api.post("/api/ressource", {
    data: { email: "pas-une-adresse", ressourceSlug: "architecture-claude-md" },
  });

  expect(reponse.status()).toBe(400);
  await api.dispose();
});

test("l'accès n'est jamais otage de la capture", async ({ page }) => {
  /* Capture coupée : la porte doit s'ouvrir quand même. C'est l'inverse exact
     de l'ancien comportement, où l'ouverture était certaine mais la capture
     silencieusement perdue. */
  await page.route("**/api/ressource", (route) => route.abort());
  await page.goto(new URL(RESSOURCE, BASE_URL).toString());

  await page.fill('form.leadform input[name="name"]', "Test");
  await page.fill('form.leadform input[name="email"]', emailDeTest("hors-ligne"));
  await page.click('form.leadform button[type="submit"]');

  await expect(page.locator("#ok")).toBeVisible();
  await expect(page.locator("body")).not.toHaveClass(/locked/);

  // Et la saisie est conservée pour être rejouée.
  const enAttente = await page.evaluate(() =>
    localStorage.getItem("parrit_demande_en_attente"),
  );
  expect(enAttente, "la soumission doit survivre à la panne").toBeTruthy();
});
