import { test, expect } from "./network-deny.setup";
import { HOME_LAYERS } from "../src/system/home-layers";
import { getJournalThemes } from "../src/system/journal-themes";
import type { Locale } from "../src/system/locale";

const BASE = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const local = (path: string) => {
  const url = new URL(path, BASE);
  expect(["localhost", "127.0.0.1"]).toContain(url.hostname);
  return url.href;
};

test.beforeEach(async ({ page }) => {
  // network-deny.setup installs the global deny-all before this expected embed mock.
  await page.route("**/embed/embed.js", async route => {
    expect(new URL(route.request().url()).hostname).toBe("app.cal.com");
    await route.fulfill({ contentType: "application/javascript", body: "/* offline */" });
  });
  await page.route("**/api/interet", route => route.fulfill({ status: 200, json: { ok: true } }));
});

for (const locale of ["fr", "en"] as const) for (const javaScriptEnabled of [true, false]) {
  test.describe(`layered home ${locale} JS=${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled });
    for (const [width, height] of [[1440, 800], [1280, 720], [800, 1100], [390, 700], [375, 844]]) {
      test(`order, offers, native FAQ and latest articles ${width}×${height}`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ reducedMotion: "reduce" });
        const home = locale === "fr" ? "/fr" : "/";
        await page.goto(local(`${home}?utm_campaign=layers&source=old`));
        const expected = locale === "fr"
          ? ["", "references", "terrain", "offres", "en-production", "parcours", "services", "technologies", "partenaires", "bandeau", "questions", "articles", "contact"]
          : ["", "references", "in-the-field", "offers", "in-production", "path", "services", "technologies", "team", "bandeau", "questions", "articles", "contact"];
        expect(await page.locator("main > section").evaluateAll(nodes => nodes.map(node => node.id))).toEqual(expected);
        const nav = locale === "fr" ? ["en-production", "offres", "parcours", "services", "questions", "contact"] : ["in-production", "offers", "path", "services", "questions", "contact"];
        for (const selector of [".desktop-nav", ".mobile-menu nav"]) {
          expect(await page.locator(`${selector} a`).evaluateAll(nodes => nodes.map(node => node.getAttribute("href")))).toEqual(nav.map(id => `${home}#${id}`));
        }
        const offers = page.locator(locale === "fr" ? "#offres article" : "#offers article");
        await expect(offers).toHaveCount(3);
        for (const [index, intent] of ["formation", "grands-groupes", "pme"].entries()) {
          const action = offers.nth(index).getByRole("link");
          await expect(action).toHaveCount(1);
          await expect(action).toHaveClass(/\bghost\b/);
          const url = new URL((await action.getAttribute("href"))!, BASE);
          expect(url.pathname).toBe(home);
          expect(url.hash).toBe("#contact");
          expect(url.searchParams.getAll("source")).toEqual([`intention-${intent}-offres`]);
          expect(url.searchParams.get("utm_campaign")).toBe("layers");
        }
        const faq = page.locator("#questions details");
        await expect(faq).toHaveCount(6);
        const pairs = await faq.evaluateAll(nodes => nodes.map(node => [node.querySelector("summary")!.textContent, node.querySelector("p")!.textContent]));
        expect(pairs).toEqual(HOME_LAYERS[locale].faq);
        const graph = JSON.parse((await page.locator('#questions script[type="application/ld+json"]').textContent())!);
        expect(graph.inLanguage).toBe(locale);
        expect(graph.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }) => [item.name, item.acceptedAnswer.text])).toEqual(pairs);
        // Native keyboard interaction works even when JavaScript is disabled.
        for (const detail of await faq.all()) {
          await detail.locator("summary").focus();
          await page.keyboard.press("Enter");
          await expect(detail).toHaveAttribute("open", "");
          await expect(detail.locator("p")).toBeVisible();
          expect(await detail.locator("p").evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
          await page.keyboard.press("Space");
          await expect(detail).not.toHaveAttribute("open", "");
        }
        const articles = page.locator("#articles article");
        await expect(articles).toHaveCount(3);
        const homeCards = await articles.evaluateAll(nodes => nodes.map(node => ({
          href: node.querySelector("a")!.getAttribute("href"),
          title: node.querySelector("h3")!.textContent,
          date: node.querySelector("time")!.getAttribute("datetime"),
          meta: node.querySelector(".journal-entry-meta")!.textContent,
        })));
        for (const [index, card] of homeCards.entries()) {
          await expect(articles.nth(index).getByRole("link")).toHaveCount(1);
          await expect(articles.nth(index).getByRole("link")).toHaveAttribute("hreflang", locale);
          expect(card.href).toMatch(new RegExp(`^${locale === "fr" ? "/fr" : ""}/journal/[a-z0-9-]+$`));
          const themes = getJournalThemes(card.href!.split("/").at(-1)!);
          await expect(articles.nth(index).locator(".journal-entry-theme")).toHaveCount(themes.length);
          for (const theme of themes) expect(card.meta).toContain(theme.label[locale]);
        }
        expect(homeCards.map(card => card.date)).toEqual(homeCards.map(card => card.date).sort().reverse());
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
        if ([1440, 375].includes(width)) await page.screenshot({ path: testInfo.outputPath(`home-${locale}-${width}.png`), fullPage: true, animations: "disabled" });
        await page.locator("#articles .home-journal-link").click();
        // evaluateAll does not wait for navigation or matching cards. Read the
        // destination only once it exists; keep the exact comparison below.
        await expect(page).toHaveURL(local(locale === "fr" ? "/fr/journal" : "/journal"));
        await expect(page.locator(".journal-index > li").nth(2)).toBeVisible();
        const indexCards = await page.locator(".journal-index > li").evaluateAll(nodes => nodes.slice(0, 3).map(node => ({
          href: node.querySelector("a")!.getAttribute("href"),
          title: node.querySelector("h2")!.textContent,
          date: node.querySelector("time")!.getAttribute("datetime"),
          meta: node.querySelector(".journal-entry-meta")!.textContent,
        })));
        expect(homeCards).toEqual(indexCards);
      });
    }

    test("legacy fragments reach applications and retain attribution", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      const home = locale === "fr" ? "/fr" : "/";
      const target = locale === "fr" ? "en-production" : "in-production";
      for (const old of ["ce-qui-change", "what-changes"]) {
        await page.goto(local(`${home}?source=legacy&utm_campaign=keep#${old}`));
        if (javaScriptEnabled) await expect(page).toHaveURL(new RegExp(`#${target}$`));
        await expect(page.locator(`#${target} h2`)).toBeInViewport();
        const url = new URL(page.url());
        expect(url.searchParams.get("source")).toBe("legacy");
        expect(url.searchParams.get("utm_campaign")).toBe("keep");
      }
    });
  });
}

for (const locale of ["fr", "en"] as const satisfies readonly Locale[]) test(`offer clicks preserve the form and attribution ${locale}`, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const home = locale === "fr" ? "/fr" : "/";
  await page.goto(local(`${home}?utm_custom=keep&source=old`));
  const email = page.locator("#single-contact input[type=email]");
  await email.fill("test@example.invalid");
  const offers = page.locator(locale === "fr" ? "#offres article a" : "#offers article a");
  for (const [index, intent] of ["formation", "grands-groupes", "pme"].entries()) {
    await offers.nth(index).click();
    await expect(email).toHaveValue("test@example.invalid");
    await expect(page.locator("#contact")).toBeFocused();
    const url = new URL(page.url());
    expect(url.searchParams.getAll("source")).toEqual([`intention-${intent}-offres`]);
    expect(url.searchParams.get("utm_custom")).toBe("keep");
  }
});
