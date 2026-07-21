import { expect, test, type Page } from "@playwright/test";

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";
const LEAD_WEBHOOK = "**/webhook/parrit-lead";

type AnalyticsEvent = {
  event: string;
  properties: Record<string, unknown>;
};

async function installPostHogSpy(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const events: AnalyticsEvent[] = [];
    const posthog = {
      __loaded: true,
      capture: (event: string, properties: Record<string, unknown> = {}) => {
        events.push({ event, properties });
      },
      identify: () => undefined,
      register: () => undefined,
      setPersonProperties: () => undefined,
    };

    Object.assign(window, { __analyticsEvents: events, posthog });
  });
}

async function analyticsEvents(page: Page, event: string): Promise<AnalyticsEvent[]> {
  return page.evaluate((eventName) => {
    const events = (window as unknown as { __analyticsEvents: AnalyticsEvent[] }).__analyticsEvents;
    return events.filter((item) => item.event === eventName);
  }, event);
}

test("home rendez-vous CTAs emit stable click placements without changing destinations", async ({ page }) => {
  await installPostHogSpy(page);
  await page.goto(new URL("/fr", BASE_URL).toString());
  await page.evaluate(() => {
    document.addEventListener("click", (event) => event.preventDefault());
  });

  const placements = [
    "home-hire-agent",
    "home-demo",
    "home-catalog",
    "home-final-hire-agent",
  ];

  for (const placement of placements) {
    const destination = `/fr/rendez-vous?source=${placement}`;
    const cta = page.locator(`[data-ph-placement="${placement}"]`);

    await expect(cta).toHaveAttribute("href", destination);
    await cta.click();
    await expect.poll(async () => analyticsEvents(page, "cta_click")).toContainEqual({
      event: "cta_click",
      properties: expect.objectContaining({
        destination,
        page: "/fr",
        placement,
      }),
    });
  }
});

test("quick contact emits one view and one success after an accepted lead", async ({ page }) => {
  await installPostHogSpy(page);
  await page.route(LEAD_WEBHOOK, (route) => route.fulfill({ status: 200, body: "ok" }));
  await page.goto(new URL("/fr/rendez-vous", BASE_URL).toString());

  await expect.poll(async () => analyticsEvents(page, "form_view")).toContainEqual({
    event: "form_view",
    properties: expect.objectContaining({ form: "quickcontact", page: "/fr/rendez-vous" }),
  });

  await page.locator('form input[name="contact"]').fill("direction@example.com");
  await page.locator('form button[type="submit"]').click();

  await expect.poll(async () => analyticsEvents(page, "form_submitted")).toHaveLength(1);
  await expect(analyticsEvents(page, "form_submitted")).resolves.toContainEqual({
    event: "form_submitted",
    properties: expect.objectContaining({ form: "quickcontact", page: "/fr/rendez-vous" }),
  });
});

test("offer form reports an HTTP failure and never reports a success", async ({ page }) => {
  await installPostHogSpy(page);
  await page.route(LEAD_WEBHOOK, (route) => route.fulfill({ status: 503, body: "unavailable" }));
  await page.goto(new URL("/fr/deployer", BASE_URL).toString());

  const form = page.locator("form.leadform");
  await form.locator('input[name="email"]').fill("direction@example.com");
  await form.locator('input[name="tel"]').fill("0612345678");
  await form.locator('button[type="submit"]').click();

  await expect.poll(async () => analyticsEvents(page, "form_failed")).toContainEqual({
    event: "form_failed",
    properties: expect.objectContaining({ form: "offre:deployer", page: "/fr/deployer", status: 503 }),
  });
  await expect(analyticsEvents(page, "form_submitted")).resolves.toHaveLength(0);
});

test("lead magnets expose their stable form identifiers on mount", async ({ page }) => {
  await installPostHogSpy(page);

  await page.goto(new URL("/harnais-ia", BASE_URL).toString());
  await expect.poll(async () => analyticsEvents(page, "form_view")).toContainEqual({
    event: "form_view",
    properties: expect.objectContaining({ form: "harnais-ia", page: "/harnais-ia" }),
  });

  await page.goto(new URL("/outils/detecteur-bullshit", BASE_URL).toString());
  await expect.poll(async () => analyticsEvents(page, "form_view")).toContainEqual({
    event: "form_view",
    properties: expect.objectContaining({ form: "detecteur-bullshit", page: "/outils/detecteur-bullshit" }),
  });
});
