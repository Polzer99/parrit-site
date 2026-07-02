import { expect, type Page, test } from "@playwright/test";

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";
const DIAGNOSTIC_API = process.env.NEXT_PUBLIC_DIAGNOSTIC_API ?? "https://api.parrit.ai";

const forbiddenOutput = [
  /—/u,
  /(?:€|£|\$|R\$|¥|￥)\s?\d/iu,
  /\d[\d .,]*\s?(?:k€|€|eur|euros?|usd|dollars?|gbp|pounds?|reais|yuan|rmb)/iu,
  /\b(?:insead|lvmh|kiabi|catho|decathlon|forvia|naos|joone|clevery|babybel)\b/iu,
  /\b(?:prompt|prompts|chatbot|chatbots|poc)\b/iu,
];

function assertNoForbiddenOutput(text: string) {
  for (const regex of forbiddenOutput) {
    expect(text, `forbidden output: ${regex}`).not.toMatch(regex);
  }
}

async function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

async function mockDiagnosticCreate(page: Page, status = 200) {
  const calls: Array<{ site?: string; fonction?: string; email?: string; prenom?: string }> = [];

  await page.route(`${DIAGNOSTIC_API}/diagnostic`, async (route) => {
    const body = route.request().postDataJSON() as {
      site?: string;
      fonction?: string;
      email?: string;
      prenom?: string;
    };
    calls.push(body);
    if (status !== 200) {
      await route.fulfill({ status, contentType: "application/json", body: JSON.stringify({ error: "erreur" }) });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ id: "abc123" }),
    });
  });

  return calls;
}

const sampleDiagnostic = {
  framing: "Deux fronts a cadrer.",
  front1: { label: "Back-office", nodes: ["Demandes", "速 Agent", "File claire"] },
  front2: { label: "Business", nodes: ["Signaux", "速 Agent", "Action preparee"] },
  pills: ["supervision humaine", "trace", "mesure"],
  offer: "Ce qu'on poserait : un flux supervise qui garde l'humain sur la decision.",
  cta: "Parler a Paul 15 minutes",
};

async function mockReveal(page: Page, mode: "ok" | "invalid" | "expired") {
  const calls: Array<{ id?: string; code?: string }> = [];

  await page.route(`${DIAGNOSTIC_API}/reveal`, async (route) => {
    const body = route.request().postDataJSON() as { id?: string; code?: string };
    calls.push(body);

    if (mode === "invalid") {
      await route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ error: "invalid" }) });
      return;
    }
    if (mode === "expired") {
      await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ error: "expired" }) });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ diagnostic: sampleDiagnostic }),
    });
  });

  return calls;
}

test("/diagnostic-express renders the landing and submits to success", async ({ page }) => {
  const calls = await mockDiagnosticCreate(page);
  const errors = await collectConsoleErrors(page);

  await page.goto(new URL("/diagnostic-express", BASE_URL).toString(), { waitUntil: "networkidle" });

  await expect(page.getByLabel("Site web")).toBeVisible();
  await expect(page.getByLabel("Votre fonction")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Prénom")).toBeVisible();

  await page.getByLabel("Site web").fill("exemple-entreprise.fr");
  await page.getByLabel("Votre fonction").fill("Dirigeant");
  await page.getByLabel("Email").fill("claire@example.com");
  await page.getByRole("button", { name: /diagnostic/i }).click();

  await expect(page.locator(".dx-success")).toBeVisible();
  await expect(page.locator(".dx-success")).toContainText("Votre diagnostic part par mail avec un code");

  expect(calls).toHaveLength(1);
  expect(calls[0]).toMatchObject({
    site: "exemple-entreprise.fr",
    fonction: "Dirigeant",
    email: "claire@example.com",
  });

  const bodyText = await page.locator("body").innerText();
  assertNoForbiddenOutput(bodyText);
  expect(errors, "no landing console errors").toEqual([]);
});

test("/diagnostic-express rejects an invalid site or email before calling the API", async ({ page }) => {
  const calls = await mockDiagnosticCreate(page);

  await page.goto(new URL("/diagnostic-express", BASE_URL).toString(), { waitUntil: "networkidle" });

  await page.getByLabel("Site web").fill("pas-un-site");
  await page.getByLabel("Votre fonction").fill("Dirigeant");
  await page.getByLabel("Email").fill("pas-un-email");
  await page.getByRole("button", { name: /diagnostic/i }).click();

  await expect(page.locator(".dx-error")).toBeVisible();
  expect(calls).toHaveLength(0);
});

test("/diagnostic-express/[id] asks for the code and reveals the diagnostic on a valid code", async ({ page }) => {
  const calls = await mockReveal(page, "ok");
  const errors = await collectConsoleErrors(page);

  await page.goto(new URL("/diagnostic-express/abc123", BASE_URL).toString(), { waitUntil: "networkidle" });

  await expect(page.getByLabel("Code reçu par mail")).toBeVisible();
  await page.getByLabel("Code reçu par mail").fill("7XQK2");
  await page.getByRole("button", { name: /voir mon diagnostic/i }).click();

  await expect(page.locator(".dx-framing")).toContainText(sampleDiagnostic.framing);
  await expect(page.locator(".dx-result")).toContainText(sampleDiagnostic.front1.label);
  await expect(page.locator(".dx-result")).toContainText(sampleDiagnostic.front2.label);

  expect(calls).toHaveLength(1);
  expect(calls[0]).toMatchObject({ id: "abc123", code: "7XQK2" });

  const bodyText = await page.locator("body").innerText();
  assertNoForbiddenOutput(bodyText);
  expect(errors, "no reveal console errors").toEqual([]);
});

test("/diagnostic-express/[id] shows a sober error on an invalid code", async ({ page }) => {
  await mockReveal(page, "invalid");

  await page.goto(new URL("/diagnostic-express/abc123", BASE_URL).toString(), { waitUntil: "networkidle" });
  await page.getByLabel("Code reçu par mail").fill("00000");
  await page.getByRole("button", { name: /voir mon diagnostic/i }).click();

  await expect(page.locator(".dx-error")).toContainText("Code invalide");
});

test("/diagnostic-express/[id] shows an expiry error on a 404", async ({ page }) => {
  await mockReveal(page, "expired");

  await page.goto(new URL("/diagnostic-express/deadbeef", BASE_URL).toString(), { waitUntil: "networkidle" });
  await page.getByLabel("Code reçu par mail").fill("7XQK2");
  await page.getByRole("button", { name: /voir mon diagnostic/i }).click();

  await expect(page.locator(".dx-error")).toContainText(/introuvable|expiré/i);
});
