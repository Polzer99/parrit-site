import { test, expect } from "./network-deny.setup";
import { HOME_LAYERS } from "../src/system/home-layers";

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
      test(`order, offers, native FAQ and dated evidence ${width}×${height}`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ reducedMotion: "reduce" });
        const home = locale === "fr" ? "/fr" : "/";
        await page.goto(local(`${home}?utm_campaign=layers&source=old`));
        const expected = locale === "fr"
          ? ["haut", "references", "realisation", "offres", "partenaires", "parcours", "terrain", "technologies", "mesures", "questions", "contact"]
          : ["haut", "references", "case-study", "offers", "team", "path", "in-the-field", "technologies", "measurements", "questions", "contact"];
        expect(await page.locator("main > section").evaluateAll(nodes => nodes.map(node => node.id))).toEqual(expected);
        const nav = locale === "fr" ? ["offres", "partenaires", "parcours", "questions", "journal"] : ["offers", "team", "path", "questions", "journal"];
        for (const selector of [".desktop-nav", ".mobile-menu nav"]) {
          expect(await page.locator(`${selector} a`).evaluateAll(nodes => nodes.map(node => node.getAttribute("href")))).toEqual([...nav, ...(selector === ".mobile-menu nav" ? ["contact"] : [])].map(id => id === "journal" ? `${locale === "fr" ? "/fr" : ""}/journal` : `${home}${selector === ".mobile-menu nav" && id === "contact" ? "?utm_campaign=layers&source=rdv-nav" : ""}#${id}`));
        }
        const offers = page.locator(locale === "fr" ? "#offres article" : "#offers article");
        await expect(offers).toHaveCount(2);
        for (const offer of await offers.all()) await expect(offer.locator("a,button")).toHaveCount(0);
        const faq = page.locator("#questions details");
        await expect(faq).toHaveCount(6);
        const pairs = await faq.evaluateAll(nodes => nodes.map(node => [node.querySelector("summary")!.textContent, node.querySelector("p")!.textContent]));
        expect(pairs).toEqual(HOME_LAYERS[locale].faq);
        const graph = JSON.parse((await page.locator('#questions script[type="application/ld+json"]').textContent())!);
        expect(graph.inLanguage).toBe(locale);
        expect(graph.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }) => [item.name, item.acceptedAnswer.text])).toEqual(pairs);
        // Native keyboard interaction works even when JavaScript is disabled.
        for (const [index, detail] of (await faq.all()).entries()) {
          const initiallyOpen = index === 2 || index === 5;
          await expect(detail).toHaveJSProperty("open", initiallyOpen);
          await detail.locator("summary").focus();
          if (initiallyOpen) {
            await expect(detail.locator("p")).toBeVisible();
            await page.keyboard.press("Space");
            await expect(detail).not.toHaveAttribute("open", "");
            await expect(detail.locator("p")).toBeHidden();
          }
          await page.keyboard.press("Enter");
          await expect(detail).toHaveAttribute("open", "");
          await expect(detail.locator("p")).toBeVisible();
          expect(await detail.locator("p").evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
          await page.keyboard.press("Space");
          await expect(detail).not.toHaveAttribute("open", "");
        }
        // 15/11 : calculateur ; les mesures internes quittent l'accueil, la presse reste.
        await expect(page.locator(".home-measures .home-press")).toBeVisible();
        await expect(page.locator(".home-measures a[href*='/journal/']")).toHaveCount(0);
        // 21/11/2026 (soir) : le calculateur est supprimé.
        await expect(page.locator(".home-motors, .home-calculator, .calc-card")).toHaveCount(0);
        // 21/11 : la section des assistants est supprimée (coherence-et-garde-fous B.1).
        await expect(page.locator(".assistant-links a, .home-assistant, #assistant")).toHaveCount(0);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
        if ([1440, 390, 375].includes(width)) await page.screenshot({ path: testInfo.outputPath(`home-${locale}-${width}.png`), fullPage: true, animations: "disabled" });
        await page.locator(".home-measures .home-journal-link").click();
        await expect(page).toHaveURL(local(locale === "fr" ? "/fr/journal" : "/journal"));
        await expect(page.locator(".journal-index > li").first()).toBeVisible();
      });
    }

    test("legacy fragments reach applications and retain attribution", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      const home = locale === "fr" ? "/fr" : "/";
      const target = locale === "fr" ? "en-production" : "in-production";
      for (const old of ["ce-qui-change", "what-changes", "services"]) {
        await page.goto(local(`${home}?source=legacy&utm_campaign=keep#${old}`));
        if (javaScriptEnabled && old !== "services") await expect(page).toHaveURL(new RegExp(`#${target}$`));
        // 21/11/2026 (soir) : l'ancre vit en tête de la section des offres ; son titre doit être à l'écran.
        await expect(page.locator(`#${target}`)).toHaveCount(1);
        await expect(page.locator(locale === "fr" ? "#offres h2" : "#offers h2").first()).toBeInViewport();
        const url = new URL(page.url());
        expect(url.searchParams.get("source")).toBe("legacy");
        expect(url.searchParams.get("utm_campaign")).toBe("keep");
      }
    });
  });
}

// Anciennes sources diffusées : QuickCapture continue de les lire.
for (const locale of ["fr", "en"] as const) test(`legacy intent attribution reaches capture ${locale}`, async ({ page }) => {
  const home = locale === "fr" ? "/fr" : "/";
  await page.goto(local(`${home}?utm_custom=keep&source=intention-formation-hero#contact`));
  await page.locator("#single-contact input[type=email]").fill("test@example.invalid");
  const submission = page.waitForRequest(request => new URL(request.url()).pathname === "/api/interet" && request.method() === "POST");
  await page.locator('#single-contact button[type="submit"]').click();
  expect((await submission).postDataJSON()).toMatchObject({
    attribution: { source: "intention-formation-hero", utm_custom: "keep" },
  });
  await expect(page.locator("#single-contact")).toHaveAttribute("data-state", "done");
  await expect(page.locator("#single-contact a,#single-contact button")).toHaveCount(0);
  expect(await page.locator('a.rev-button[href*="source="]').evaluateAll(nodes => [...new Set(nodes.map(node => new URL((node as HTMLAnchorElement).href).searchParams.get("source")))].sort())).toEqual(["accueil-rendez-vous", "rdv-nav", "rdv-parcours"]); // 21/11 (soir) : calculateur supprimé ; nuit : le bouton du contact laisse la place à celui du parcours
});
