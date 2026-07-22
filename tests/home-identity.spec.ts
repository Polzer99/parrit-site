import { expect, test } from "@playwright/test";

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";

const locales = [
  { locale: "fr", identity: "Des humains réels, qui ont déjà déployé pour de vrai.", behind: "Qui est derrière" },
  { locale: "en", identity: "Real people who have already deployed for real.", behind: "Who is behind Parrit" },
  { locale: "pt-BR", identity: "Pessoas reais, que já fizeram implantações de verdade.", behind: "Quem está por trás" },
  { locale: "zh-CN", identity: "真实的人，真正做过生产部署。", behind: "谁在背后" },
] as const;

for (const { locale, identity, behind } of locales) {
  test(`${locale} home foregrounds real people without fictional agent faces`, async ({ page }) => {
    await page.goto(new URL(`/${locale}`, BASE_URL).toString());

    await expect(page.locator(".hd-lede")).toContainText(identity);
    await expect(page.locator(".hd-team h2")).toContainText(behind);
    await expect(page.locator('.hd-team img[src="/team/paul-portrait.jpg"]')).toHaveCount(1);
    await expect(page.locator('.hd-team img[src="/team/yukun-portrait.jpg"]')).toHaveCount(1);
    await expect(page.locator('.hd-team a[href="/fondateurs"]')).toHaveCount(1);
    await expect(page.locator('img[src*="/brand/agents/"]')).toHaveCount(0);
    await expect(page.locator(".hd-agent-mark")).not.toHaveCount(0);

    const sectionOrder = await page.locator(".hd-hero, .hd-terrain, .hd-team, #catalogue-agents").evaluateAll(
      (elements) => elements.map((element) => element.className || element.id),
    );
    expect(sectionOrder).toEqual(["hd-hero", "hd-terrain", "hd-team", "hd-catalog"]);
  });
}
