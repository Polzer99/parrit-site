import { expect, test } from "@playwright/test";

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";
const locales = ["fr", "en", "pt-BR", "zh-CN"];

for (const locale of locales) {
  test(`${locale} resources hub links to the AI cost harness in one click`, async ({ page }) => {
    await page.goto(new URL(`/${locale}/ressources`, BASE_URL).toString());

    const harnessCard = page.locator('main.blog-list a.blog-card[href="/harnais-ia"]');
    await expect(harnessCard).toHaveCount(1);

    await harnessCard.click();
    await expect(page).toHaveURL(new URL("/harnais-ia", BASE_URL).toString());
  });
}
