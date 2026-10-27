import { readingMs } from "../src/system/reading";
import { mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import founderPhotos from "./fixtures/founder-photo.json";
import { test, expect } from "./network-deny.setup";
const BASE = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const local = (path: string) => {
  const url = new URL(path, BASE);
  expect(["localhost", "127.0.0.1"]).toContain(url.hostname);
  return url.href;
};
test.beforeEach(async ({ page }) => {
  // Only the expected Cal loader is mocked; every other external request fails.
  await page.route("**/embed/embed.js", async route => {
    expect(new URL(route.request().url()).hostname).toBe("app.cal.com");
    await route.fulfill({ contentType: "application/javascript", body: "/* Offline Cal loader: no remote booking or tracking. */" });
  });
  // Never let a local API request reach a real downstream webhook.
  await page.route("**/api/interet", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }));
});
for (const width of [1440, 390]) for (const locale of ["fr", "en"]) {
  test(`single page geometry, typography, anchors and booking ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    const portrait = page.locator(".founder picture img");
    await expect(portrait).toHaveAttribute("alt", "Paul Larmaraud");
    await expect(portrait).toHaveAttribute("loading", "lazy");
    await expect(portrait).toHaveCSS("object-fit", "contain");
    await expect(portrait).toHaveCSS("border-radius", "0px");
    const portraitBox = await portrait.boundingBox();
    expect(portraitBox).not.toBeNull();
    expect(portraitBox!.width / portraitBox!.height).toBeCloseTo(3 / 4, 2);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("main > section")).toHaveCount(9);
    expect(await page.locator("main > section[id]").evaluateAll(nodes => nodes.map(n => n.id))).toEqual(locale === "fr" ? ["technologies", "en-production", "ce-qui-change", "parcours", "services", "partenaires", "references", "contact"] : ["technologies", "in-production", "what-changes", "path", "services", "team", "references", "contact"]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const mono = await page.locator("main *, footer *, header *").evaluateAll(nodes => nodes.filter(node => {
      const style = getComputedStyle(node);
      return node.getBoundingClientRect().height > 0 && style.visibility !== "hidden" && /mono/i.test(style.fontFamily) && Array.from(node.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()) && !node.closest(".cmd-wordmark, .wordmark, .cmdbar .mark");
    }).map(node => node.textContent?.slice(0, 60)));
    expect(mono).toEqual([]);
    await expect(page.locator("#references").getByRole("img")).toHaveCount(5);
    await expect(page.locator(".logo-set[aria-hidden=true]")).toHaveCount(1);
    await expect(page.locator("#services .use-case")).toHaveCount(12);
    await expect(page.locator("#architecture")).toHaveCount(0);
    await expect(page.locator(".hero + #technologies")).toHaveCount(1);
    const applications = page.locator(locale === "fr" ? "#en-production" : "#in-production");
    await expect(applications.locator(".phone")).toHaveCount(3);
    await expect(applications.locator("h3")).toHaveCount(3);
    await expect(applications).not.toContainText(/Laparra|Clevery|Forexpert|Joone|SNCF/);
    await expect(applications.locator(".note")).toContainText(locale === "fr" ? "données fictives" : "fictional data");
    for (const nav of [".desktop-nav", ".mobile-menu nav"]) {
      await expect(page.locator(`${nav} a`).first()).toHaveText("Applications");
      await expect(page.locator(`${nav} a`).first()).toHaveAttribute("href", locale === "fr" ? "/fr#en-production" : "/#in-production");
    }
    await expect(page.locator("#contact h2")).not.toHaveText(/\.$/);
    await expect(page.locator("main")).not.toContainText(/Brésil|Brazil|Cameroun|Cameroon|métropole lilloise|Lille area/);
    const smallText = await page.locator("main *, header *, footer *").evaluateAll(nodes => nodes.filter(el => {
      if (!(el instanceof HTMLElement) || !el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return false;
      return el.getBoundingClientRect().height > 0 && [...el.childNodes].some(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()) && parseFloat(getComputedStyle(el).fontSize) < 15;
    }).map(el => el.textContent?.slice(0, 80)));
    expect(smallText).toEqual([]);
    const partners = page.locator(locale === "fr" ? "#partenaires" : "#team");
    const cards = partners.locator(".services > div");
    await expect(cards).toHaveCount(7);
    await expect(cards.last()).toContainText(/MIT/);
    await expect(partners.locator("img, svg")).toHaveCount(0);
    const grid = await partners.locator(".services").boundingBox();
    const last = await cards.last().boundingBox();
    expect(grid).not.toBeNull();
    expect(last).not.toBeNull();
    if (width === 1440) expect(last!.width).toBeCloseTo(grid!.width - 2, 0);
    else expect(last!.width).toBeLessThan(grid!.width);
    const rows = await cards.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top));
    expect(new Set(rows).size).toBe(width === 1440 ? 3 : 1);
    for (const button of await page.locator(".rev-button:visible").all()) {
      const style = await button.evaluate(el => { const c = getComputedStyle(el); return { family: c.fontFamily, weight: c.fontWeight, spacing: c.letterSpacing, height: el.getBoundingClientRect().height }; });
      expect(style.family).toContain("General");
      expect(style.weight).toBe("600");
      expect(["normal", "0px"]).toContain(style.spacing);
      expect(style.height).toBeGreaterThanOrEqual(44);
      expect((await button.innerText()).trim()).not.toMatch(/\.$/);
    }
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 700) {
      await page.evaluate(y => window.scrollTo(0, y), y);
      await page.waitForTimeout(30);
      expect(await page.locator(".exec").evaluateAll(nodes => nodes.filter(node => {
        const r = node.getBoundingClientRect(); const s = getComputedStyle(node);
        return r.bottom > 0 && r.top < innerHeight && r.width > 0 && s.visibility !== "hidden" && s.display !== "none";
      }).length)).toBeLessThanOrEqual(1);
    }
    await page.locator('#contact a[href="#reservation"]').click();
    await expect(page).toHaveURL(/#reservation$/);
    await expect(page.locator("#reservation")).toBeInViewport();
    await expect(page.locator(".contact-fallback details")).toHaveCount(0);
    await expect(page.locator('#reservation input[type="email"]')).toBeVisible();
    await expect(page.locator(".contact-fallback button")).toHaveText(locale === "fr" ? "Être recontacté" : "Contact me");
    await expect(page.locator(".contact-fallback button")).toHaveClass(/ghost/);
    const emailBox = await page.locator('.contact-fallback input[type="email"]').boundingBox();
    const submitBox = await page.locator(".contact-fallback button").boundingBox();
    expect(emailBox).not.toBeNull();
    expect(submitBox).not.toBeNull();
    expect(submitBox!.x).toBeGreaterThanOrEqual(emailBox!.x + emailBox!.width - 1);
    expect(submitBox!.y).toBeCloseTo(emailBox!.y, 0);
    if (locale === "fr" && process.env.PAGE_UNIQUE_CAPTURE === "1") {
      await page.evaluate(() => window.scrollTo(0, 0));
      await mkdir("docs/site-v1/page-unique", { recursive: true });
      await page.screenshot({ path: `docs/site-v1/page-unique/implementation-${width}.png`, fullPage: true, animations: "disabled" });
    }
  });
}
test("photo is served byte-identical and sitemap contains only successful canonical pages", async ({ request }) => {
  for (const [name, expected] of Object.entries(founderPhotos)) {
    const photo = await request.get(local(`/brand/founder/${name}`), { maxRedirects: 0 });
    expect(photo.status()).toBe(200);
    expect(createHash("sha256").update(await photo.body()).digest("hex")).toBe(expected.sha256);
  }
  const sitemap = await request.get(local("/sitemap.xml"), { maxRedirects: 0 });
  const paths = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname);
  expect(paths).toContain("/journal/themes/harness-engineering");
  expect(paths).toContain("/fr");
  for (const path of paths) {
    const response = await request.get(local(path), { maxRedirects: 0, headers: { "accept-language": "en" } });
    expect(response.status(), path).toBe(200);
  }
});
test("no JavaScript conversations remain visible and legal and 404 stay accessible", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const unexpected: string[] = [];
  await context.route("**/*", async route => {
    if (["localhost", "127.0.0.1"].includes(new URL(route.request().url()).hostname)) return route.continue();
    unexpected.push(route.request().url()); await route.abort();
  });
  const page = await context.newPage();
  await page.goto(local("/fr"));
  for (const message of await page.locator(".phone .msg").all()) await expect(message).toBeVisible();
  for (const path of ["/fr", "/"]) {
    await page.goto(local(path));
    await expect(page.locator(".onto .res.on")).toHaveCount(4);
    for (const result of await page.locator(".onto .rest").all()) await expect(result).toBeVisible();
    await expect(page.locator(".walk .human")).toHaveAttribute("transform", "translate(900 120)");
    await expect(page.locator(".walk")).toHaveClass(/withbot/);
    await expect(page.locator(".use-case")).toHaveCount(12);
    await expect(page.locator(".case:not(.visually-hidden)")).toHaveCount(12);
    await expect(page.locator(".partner-offers li")).toHaveCount(23);
    for (const offer of await page.locator(".partner-offers li").all()) await expect(offer).toBeVisible();
    for (const face of await page.locator(".partner-delivery").all()) await expect(face).toBeHidden();
    await expect(page.locator("#references").getByRole("img")).toHaveCount(5);
    await expect(page.locator(".contact-fallback input[type=email]")).toBeVisible();
    await expect(page.locator(".onto .story animate, .onto .story animateMotion, .onto .token")).toHaveCount(0);
    await expect(page.locator(".humby")).toBeVisible();
  }
  for (const path of ["/legal", "/fr/legal"]) {
    expect((await page.goto(local(path)))?.status()).toBe(200);
    await expect(page.locator("main")).toContainText("Cloudflare");
  }
  expect((await page.goto(local("/page-unique-missing")))?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("footer")).toBeVisible();
  await context.close();
  expect(unexpected).toEqual([]);
});
test.describe("network denial self-test", () => {
  test.use({ expectBlockedRequest: true });
  test("an unmocked external request is blocked", async ({ page, blockedRequests }) => {
    await page.goto(local("/journal"));
    await page.evaluate(async () => { try { await fetch("https://network-deny.invalid/test"); } catch { /* expected */ } });
    expect(blockedRequests).toEqual(["https://network-deny.invalid/test"]);
  });
});
test("retired routes redirect once with their complete source query", async ({ request }) => {
  const themes: Record<string, string> = { "consulting-transformation": "conseil-transformation", "ai-sprints": "ai-sprints", "engineering-integration": "integration-developpement", "harness-engineering": "harness-engineering" };
  const sections: Record<string, [string, string]> = { manufacture: ["path", "parcours"], "build-with-you": ["path", "parcours"], standard: ["technologies", "technologies"], systems: ["technologies", "technologies"], dossiers: ["references", "references"], commission: ["contact", "contact"], contact: ["contact", "contact"] };
  const cases: [string, string][] = [["/fr/conseil-transformation", "/fr/journal/themes/conseil-transformation"]];
  for (const [old, theme] of Object.entries(themes)) for (const prefix of ["", "/fr"]) cases.push([`${prefix}/${old}`, `${prefix}/journal/themes/${theme}`]);
  for (const [old, anchors] of Object.entries(sections)) for (const [i, prefix] of ["", "/fr"].entries()) cases.push([`${prefix}/${old}`, `${prefix || "/"}#${anchors[i]}`]);
  for (const [source, destination] of cases) {
    const response = await request.get(local(`${source}?source=qa&utm_source=test&utm_campaign=a%20b`), { maxRedirects: 0 });
    expect(response.status(), source).toBe(308);
    const location = new URL(response.headers().location, BASE);
    const expected = new URL(destination, BASE);
    expect(location.pathname).toBe(expected.pathname);
    expect(location.hash).toBe(expected.hash);
    expect(Object.fromEntries(location.searchParams)).toEqual({ source: "qa", utm_source: "test", utm_campaign: "a b" });
    const final = await request.get(local(location.pathname + location.search), { maxRedirects: 0, headers: { "accept-language": "en" } });
    expect(final.status(), `${source}: redirect target`).toBe(200);
  }
});

for (const locale of ["fr", "en"]) for (const width of [1440, 375]) {
  test(`primary buttons use canonical rose ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    for (const selector of [".hero .btn.exec", ".founder .btn.exec"]) {
      const button = page.locator(selector);
      const rose = await button.evaluate(el => {
        const probe = document.createElement("span");
        probe.style.color = "var(--brand-core-rose)";
        el.append(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      });
      await expect(button).toHaveCSS("background-color", rose);
    }
  });
  test(`addendum figure, final reduced-motion state and type scale ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    const figure = page.locator("svg.onto");
    await expect(figure).toBeVisible();
    await expect(figure).toHaveAttribute("aria-hidden", "true");
    await expect(figure.locator(".layer")).toHaveCount(3);
    await expect(figure).toHaveAttribute("viewBox", "0 0 1080 360");
    await expect(figure.locator(".edge:not(.talk)")).toHaveCount(16);
    await expect(figure.locator(".talk")).toHaveCount(5);
    await expect(figure.locator(".node:not(.r)")).toHaveCount(5);
    await expect(figure.locator(".node.r")).toHaveCount(4);
    await expect(figure.locator(".ag")).toHaveCount(6);
    await expect(figure.locator(".eye")).toHaveCount(12);
    await expect(figure.locator(".res.on")).toHaveCount(4);
    await expect(figure.locator(".pulse, .token, animateMotion")).toHaveCount(0);
    await expect(page.locator(".ontocap")).toHaveAttribute("aria-live", "off");
    for (const el of await page.locator(".panel .answer, .doc .ok, .doc .l, .soft .row:last-child span").all()) {
      await expect(el).toBeVisible();
      await expect(el).toHaveCSS("animation-name", "none");
      await expect(el).toHaveCSS("transform", "none");
      await expect(el).toHaveCSS("opacity", await el.evaluate(node => node.matches(".l") ? "0.5" : "1"));
    }
    const active = await page.locator(".soft .top").evaluate(el => getComputedStyle(el).color);
    for (const agent of await page.locator(".soft .row:last-child span").all()) await expect(agent).toHaveCSS("background-color", active);
    // PASSE-4-CAS-D-USAGE-ET-ECRAN.md §7.2 : seul le hero téléphone passe à 22px pour tenir sans défiler.
    await expect(page.locator(".hero .sub p")).toHaveCSS("font-size", width === 375 ? "22px" : "26px");
    for (const button of await page.locator(".hero .btn.exec, .founder .btn.exec").all()) {
      await expect(button).toHaveCSS("font-size", "22px");
      await expect(button).toHaveCSS("padding", "22px 36px");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    // Switching the live preference must restore animation, then stop it again.
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.locator(locale === "fr" ? "#ce-qui-change h2" : "#what-changes h2").scrollIntoViewIfNeeded();
    await expect(page.locator(locale === "fr" ? "#ce-qui-change" : "#what-changes")).toHaveAttribute("data-motion", "ready");
    await expect(page.locator(".panel .answer")).toHaveCSS("animation-duration", "8s");
    expect(await page.locator(".doc .l").evaluateAll(nodes => nodes.map(el => getComputedStyle(el).animationDelay))).toEqual(["0s", "0.6s", "1.2s"]);
    expect(await page.locator(".soft .row:last-child span").evaluateAll(nodes => nodes.map(el => getComputedStyle(el).animationDelay))).toEqual(["0s", "1s", "2s"]);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(".panel .answer")).toHaveCSS("opacity", "1");
    await expect(page.locator(".panel .answer")).toHaveCSS("animation-name", "none");
  });
}


for (const locale of ["fr", "en"]) for (const width of [1440, 390]) {
  test(`six overlapping stories, four-result feed and live reduced-motion preference ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const epoch = new Date("2026-10-27T12:00:00Z");
    await page.clock.install({ time: epoch });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    const figure = page.locator("svg.onto");
    const outputs = locale === "fr" ? ["Relance prête", "Commande fournisseur prête", "Trésorerie à jour", "Commande saisie", "Devis à valider", "Rapport de la semaine prêt"] : ["Follow-up ready", "Supplier order ready", "Cash position updated", "Order entered", "Quote to approve", "Weekly report ready"];
    const captions = locale === "fr" ? ["Un client écrit.", "Un article passe", "Une facture", "Un client envoie", "Un prospect", "Le vendredi"] : ["A client writes.", "An item drops", "An invoice", "A client sends", "A prospect", "On Fridays"];
    const staticFeed = figure.locator(".static-feed");
    const liveFeed = figure.locator(".live-feed");
    await expect(staticFeed.locator(".rest")).toHaveText(outputs.slice(0, 4));
    await expect(staticFeed.locator(".hot")).toHaveCount(1);
    await expect(figure.locator(".token, .trail, animateMotion")).toHaveCount(0);
    await expect(page.locator(".ontocap")).toContainText(captions[0]);
    await expect(page.locator(".humby")).toHaveCSS("font-size", "16px");
    await expect(page.locator(".humby")).toContainText("Clive Humby");
    await figure.scrollIntoViewIfNeeded();
    await page.clock.pauseAt(new Date(epoch.getTime() + 10000));
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(page.locator(".ontology-hero")).toHaveAttribute("data-anim", "in");
    await expect(staticFeed).toBeHidden();
    await expect(figure.locator(".pulse animateMotion")).toHaveCount(21);
    await expect(figure.locator(".token")).toHaveCount(1);
    await page.clock.runFor(100);
    await expect(figure.locator('[data-node="E-mails"]')).toHaveClass(/lit/);
    const firstPosition = await figure.locator(".story").getAttribute("transform");
    const firstOffset = await figure.locator(".trail").evaluate(el => getComputedStyle(el).strokeDashoffset);
    await page.clock.runFor(700);
    expect(await figure.locator(".story").getAttribute("transform")).not.toBe(firstPosition);
    expect(Number.parseFloat(await figure.locator(".trail").evaluate(el => getComputedStyle(el).strokeDashoffset))).toBeLessThan(Number.parseFloat(firstOffset));
    await page.clock.runFor(1600);
    await expect(figure.locator(".token")).toHaveCount(2);
    await expect(figure.locator(".trail")).toHaveCount(2);
    await expect(page.locator(".ontocap")).toContainText(captions[1]);
    await expect(figure.locator('[data-agent="Commercial"]')).toHaveClass(/busy/);
    await page.clock.runFor(2000);
    for (let i = 0; i < outputs.length; i++) {
      if (i > 0) await page.clock.runFor(2300);
      await expect(liveFeed.locator(".res:not(.exiting) .rest")).toHaveText(outputs.slice(Math.max(0, i - 3), i + 1).reverse());
      await expect(liveFeed.locator(".hot")).toHaveCount(1);
      await expect(liveFeed.locator(".hot .rest")).toHaveText(outputs[i]);
      await expect(page.locator(".ontocap")).toContainText(captions[(i + 1) % captions.length]);
      expect(await figure.locator(".token").count()).toBeLessThanOrEqual(2);
    }
    await page.clock.runFor(500);
    await expect(liveFeed.locator(".res")).toHaveCount(4);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(figure.locator(".ontology-motion, .busy, .lit")).toHaveCount(0);
    await expect(staticFeed).toBeVisible();
    await expect(staticFeed.locator(".rest")).toHaveText(outputs.slice(0, 4));
    await expect(staticFeed.locator(".hot")).toHaveCount(1);
    await expect(page.locator(".ontocap")).toContainText(captions[0]);
    await page.clock.runFor(20000);
    await expect(staticFeed.locator(".rest")).toHaveText(outputs.slice(0, 4));
    await expect(figure.locator(".token, .trail, animateMotion")).toHaveCount(0);
    // Restart after cleanup, then leave the viewport while two stories are running.
    await page.emulateMedia({ reducedMotion: "no-preference" });
    // Media-query change delivery is not driven by the mocked clock. Anchor time
    // to the actual restart before advancing the story timers and animation frames.
    await expect(page.locator(".ontology-hero")).toHaveAttribute("data-anim", "in");
    await expect(figure.locator(".token")).toHaveCount(1);
    await expect(page.locator(".ontocap")).toContainText(captions[0]);
    // Both stories are in flight at 3000 ms (0–4200 and 2300–6500 ms).
    await page.clock.runFor(3000);
    await expect(figure.locator(".token")).toHaveCount(2);
    await expect(page.locator(".ontocap")).toContainText(captions[1]);
    const labels = figure.locator(".toklab");
    await expect(labels).toHaveCount(2);
    // CSS transitions use real time; await the fade while story time stays paused.
    // Playwright visibility alone includes elements whose opacity is zero.
    await expect(labels.first()).toHaveCSS("opacity", "0");
    await expect(labels.last()).toHaveCSS("opacity", "1");
    expect(await labels.evaluateAll(nodes => nodes
      .filter(node => Number.parseFloat(getComputedStyle(node).opacity) > 0)
      .map(node => node.textContent))).toEqual([locale === "fr" ? "Stock bas" : "Low stock"]);
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.clock.runFor(100);
    await expect(figure.locator(".ontology-motion, .busy, .lit")).toHaveCount(0);
    await page.clock.runFor(20000);
    await expect(figure.locator(".ontology-motion")).toHaveCount(0);
  });
}

test("client masks are local, served successfully and match the approved files", async ({ request }) => {
  const { readFile } = await import("node:fs/promises");
  for (const file of ["laparra.png", "clevery.png", "forexpert.png", "joone.png", "sncf.svg"]) {
    const response = await request.get(local(`/clients/${file}`), { maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(await response.body()).toEqual(await readFile(`public/clients/${file}`));
  }
});

for (const width of [1440, 800, 390]) test(`service columns and animation entry at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(local("/fr"));
  const services = page.locator("#services > .wrap");
  await expect(services).toHaveAttribute("data-anim", "armed");
  await page.locator("#services h2").scrollIntoViewIfNeeded();
  await expect(services).toHaveAttribute("data-anim", "in");
  const columns = await page.locator(".service-tasks").evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length);
  expect(columns).toBe(width > 1100 ? 4 : width > 760 ? 2 : 1);
  await expect(page.locator(".use-case").nth(1)).toHaveAttribute("data-case", "1");
  await page.locator("#references h2").scrollIntoViewIfNeeded();
  await expect(services).toHaveAttribute("data-anim", "out");
  for (const card of await page.locator(".use-case").all()) await expect(card).toHaveAttribute("data-case", "0");
  await expect(page.locator("#references > .wrap")).toHaveAttribute("data-anim", "in");
  await expect(page.locator(".logo-track")).toHaveCSS("animation-duration", "28s");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const el of await page.locator(".case, .logo-track, .tech-track").all()) await expect(el).toHaveCSS("animation-name", "none");
});

test("visible contact variant keeps the capture payload and error recovery", async ({ page }) => {
  await page.goto(local("/fr?source=passe3&utm_source=test"));
  const input = page.locator(".contact-fallback input[type=email]");
  const button = page.locator(".contact-fallback button");
  await expect(input).toBeVisible();
  await expect(button).toHaveText("Être recontacté");
  await button.click();
  await expect(page.locator(".contact-fallback [role=alert]")).toBeVisible();
  let payload: Record<string, unknown> = {};
  await page.route("**/api/interet", async route => {
    payload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ ok: false }) });
  });
  await input.fill("qa@example.test");
  await button.click();
  await expect(page.locator(".contact-fallback [role=alert]")).toContainText("échoué");
  expect(payload).toMatchObject({ email: "qa@example.test", interet: "full-os", source: "site:quick-capture", pageOrigine: "/fr", lang: "fr", attribution: { source: "passe3", utm_source: "test" } });
  expect(payload).not.toHaveProperty("idee");
  expect(payload.submissionId).toEqual(expect.any(String));
  await page.route("**/api/interet", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }));
  await button.click();
  await expect(page.locator(".contact-fallback [data-state=done]")).toBeVisible();
});

// Blocking contract §5: measure intrinsic content, never a capped/clipped section.
for (const locale of ["fr", "en"]) for (const [width, height] of [[1440, 800], [1280, 720], [390, 700]]) {
  test(`un bloc = un écran ${locale} ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    await page.evaluate(() => document.fonts.ready);
    const sections = await page.locator(".single-page > section:not(.hero):not(#contact)").evaluateAll(nodes => nodes.map(section => {
      const content = section.firstElementChild as HTMLElement;
      return { id: section.id, height: content.getBoundingClientRect().height, scrollHeight: content.scrollHeight, overflowY: getComputedStyle(content).overflowY };
    }));
    expect(sections).toHaveLength(7);
    for (const section of sections) {
      expect(section.height, `${section.id}: first child's full border box, without margins`).toBeLessThanOrEqual(height);
      expect(section.scrollHeight, `${section.id}: content must not be clipped`).toBeLessThanOrEqual(height);
      expect(section.overflowY).not.toMatch(/hidden|clip/);
    }
    const figures = page.locator(".ontology-hero, .onto, .scenes, .three, .path-walker, .steps, .service-tasks, .services, .logo-strip, .tech-marquee, .founder > .wrap > .grid");
    await expect(figures).toHaveCount(11);
    for (const figure of await figures.all()) {
      const box = await figure.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height, await figure.getAttribute("class") ?? "figure").toBeLessThanOrEqual(height);
    }
    for (const track of await page.locator(".mobile-carousel").all()) {
      await expect(track).toHaveAttribute("tabindex", "0");
      expect(await track.getAttribute("aria-label")).toBeTruthy();
      for (const card of await track.locator(":scope > *").all()) {
        expect((await card.boundingBox())!.height).toBeLessThanOrEqual(height);
      }
      if (width === 390) {
        await expect(track).toHaveCSS("scroll-snap-type", "x mandatory");
        await expect(track).toHaveCSS("align-items", "flex-start");
        const top = (await track.boundingBox())!.y;
        for (const card of await track.locator(":scope > *").all()) {
          await expect(card).toHaveCSS("align-self", "flex-start");
          expect((await card.boundingBox())!.y).toBeCloseTo(top, 0);
        }
        expect(await track.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
      }
    }
    if (width === 1440 || width === 1280) {
      const mark = (await page.locator(".single-header .mark").boundingBox())!;
      for (const selector of [".hero h1", ".hero .sub p", ".hero .exec"]) {
        const box = (await page.locator(selector).boundingBox())!;
        expect(box.x, `${selector}: same left edge as the header brand`).toBeCloseTo(mark.x, 0);
      }
      expect(await page.locator(".hero h1").evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(72);
      const button = page.locator(".hero .exec");
      await expect(button).toHaveCSS("white-space", "nowrap");
      const geometry = await button.evaluate(el => {
        const range = document.createRange();
        range.selectNodeContents(el);
        const style = getComputedStyle(el);
        return {
          lines: range.getClientRects().length,
          contentWidth: range.getBoundingClientRect().width,
          width: el.getBoundingClientRect().width,
          horizontalInset: parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth),
        };
      });
      expect(geometry.lines).toBe(1);
      expect(geometry.width).toBeCloseTo(geometry.contentWidth + geometry.horizontalInset, 0);
      // Keep the existing exec padding and line height, including the founder counterpart.
      for (const property of ["padding-top", "padding-bottom", "padding-left", "padding-right", "line-height"]) {
        await expect(button).toHaveCSS(property, await page.locator(".founder .exec").evaluate((el, property) => getComputedStyle(el).getPropertyValue(property), property));
      }
      const phrase = (await page.locator(".hero .sub p").boundingBox())!;
      const action = (await button.boundingBox())!;
      const figure = (await page.locator(".ontology-hero").boundingBox())!;
      expect(action.y).toBeGreaterThanOrEqual(phrase.y + phrase.height);
      expect(action.x + action.width).toBeLessThanOrEqual(figure.x);
    } else {
      const action = (await page.locator(".hero .exec").boundingBox())!;
      const group = (await page.locator(".hero .actions").boundingBox())!;
      expect(action.width).toBeCloseTo(group.width, 0);
      await expect(page.locator(".hero .exec")).toHaveCSS("white-space", "normal");
    }
    if (width === 1440) {
      const header = (await page.locator(".single-header").boundingBox())!;
      const hero = (await page.locator(".hero").boundingBox())!;
      expect(hero.y).toBeGreaterThanOrEqual(header.y + header.height);
      expect(hero.y + hero.height).toBeLessThanOrEqual(height);
      // §7 permits a fluid H1 >=72px to retain this full-hero viewport contract.
      for (const selector of [".hero h1", ".hero .sub p", ".hero .exec", ".onto", ".ontocap", ".humby"]) {
        const box = (await page.locator(selector).boundingBox())!;
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height, selector).toBeLessThanOrEqual(height);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}

for (const locale of ["fr", "en"]) for (const javaScriptEnabled of [true, false]) {
  test.describe(`compact mobile header ${locale} JS=${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled });
    test("hero visible without scrolling and native menu reachable by keyboard", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 700 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(local(locale === "fr" ? "/fr" : "/"));
      await page.evaluate(() => document.fonts.ready);
      const header = page.locator(".single-header");
      const menu = header.locator("details");
      const summary = menu.locator("summary");
      const headerBox = (await header.boundingBox())!;
      expect(headerBox.y).toBe(0);
      expect(headerBox.height).toBeLessThanOrEqual(64);
      const brand = (await header.locator(".mark").boundingBox())!;
      for (const control of await header.locator(".languages a, summary").all()) {
        const box = (await control.boundingBox())!;
        expect(box.x).toBeGreaterThan(brand.x + brand.width);
        expect(box.y + box.height / 2).toBeCloseTo(brand.y + brand.height / 2, 0);
        await expect(control).toBeInViewport({ ratio: 1 });
      }
      await expect(header.locator(":scope > .wrap > .btn")).toBeHidden();
      for (const selector of [".hero h1", ".hero .sub p", ".hero .exec"]) {
        await expect(page.locator(selector)).toBeVisible();
        await expect(page.locator(selector)).toBeInViewport({ ratio: 1 });
      }
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      await header.locator(".mark").focus();
      for (const control of [...await header.locator(".languages a").all(), summary]) {
        await page.keyboard.press("Tab");
        await expect(control).toBeFocused();
      }
      await page.keyboard.press("Enter");
      await expect(menu).toHaveAttribute("open", "");
      for (const link of await menu.locator("nav a").all()) {
        await page.keyboard.press("Tab");
        await expect(link).toBeFocused();
        await expect(link).toBeInViewport({ ratio: 1 });
      }
      const contact = menu.locator(".btn");
      await expect(contact).toHaveAttribute("href", locale === "fr" ? "/fr#contact" : "/#contact");
      if (javaScriptEnabled) {
        await page.keyboard.press("Escape");
        await expect(menu).not.toHaveAttribute("open", "");
        await expect(summary).toBeFocused();
        await page.keyboard.press("Space");
        await expect(menu).toHaveAttribute("open", "");
        await contact.focus();
        await page.keyboard.press("Enter");
        await expect(menu).not.toHaveAttribute("open", "");
        await expect(page).toHaveURL(/#contact$/);
      } else {
        await summary.focus();
        await page.keyboard.press("Space");
        await expect(menu).not.toHaveAttribute("open", "");
      }
    });
  });
}

for (const locale of ["fr", "en"]) test(`passe 4 services cycle and restore SSR state ${locale}`, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const epoch = new Date("2026-10-27T12:00:00Z");
  await page.clock.install({ time: epoch });
  await page.goto(local(locale === "fr" ? "/fr" : "/"));
  const cards = page.locator(".use-case");
  await expect(cards).toHaveCount(12);
  await expect(page.locator(".case")).toHaveCount(48);
  const first = cards.first();
  const text = await first.locator(".case-text").allTextContents();
  await page.locator("#services h2").scrollIntoViewIfNeeded();
  await page.clock.pauseAt(new Date(epoch.getTime() + 10000));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(cards.nth(1)).toHaveAttribute("data-case", "1");
  const cases = await first.locator(".case").allTextContents();
  const secondCases = await cards.nth(1).locator(".case").allTextContents();
  const firstDuration = readingMs(cases[0]);
  const secondDuration = readingMs(secondCases[1]) + 290;
  await page.clock.runFor(firstDuration - 1);
  await expect(first).toHaveAttribute("data-case", "0");
  await page.clock.runFor(1);
  await expect(first).toHaveClass(/blink/);
  await page.clock.runFor(120);
  await expect(first).toHaveAttribute("data-case", "1");
  await expect(first.locator(".case:not(.visually-hidden) .case-text")).toHaveText(text[1]);
  // Each neighbor follows its own text length as well as the stagger.
  if (secondDuration > firstDuration + 120) {
    await expect(cards.nth(1)).toHaveAttribute("data-case", "1");
    await page.clock.runFor(secondDuration - firstDuration);
  }
  await expect(cards.nth(1)).toHaveAttribute("data-case", "2");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const card of await cards.all()) await expect(card).toHaveAttribute("data-case", "0");
  await page.clock.runFor(20000);
  for (const card of await cards.all()) await expect(card).toHaveAttribute("data-case", "0");
});

test("partner offers keep at most two faces active and restore every static offer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const epoch = new Date("2026-10-27T12:00:00Z");
  await page.clock.install({ time: epoch });
  await page.goto(local("/fr"));
  await page.locator("#partenaires h2").scrollIntoViewIfNeeded();
  await page.clock.pauseAt(new Date(epoch.getTime() + 10000));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".partner-motion")).toHaveAttribute("data-anim", "in");
  const cards = page.locator(".partner");
  const fronts = await cards.evaluateAll(nodes => nodes.map(card => [...card.querySelectorAll(".partner-type .s, .partner-type p")].map(node => node.textContent).join(" ")));
  await page.clock.runFor(Math.max(...fronts.map(readingMs)));
  await expect(cards.first()).toHaveClass(/flip/);
  const offers = await cards.first().locator("li").allTextContents();
  await expect(cards.first().locator(".offer")).toHaveText(offers[0]);
  for (let i = 0; i < offers.length; i++) {
    const dwell = readingMs(offers[i]) + (i ? 150 : 0);
    await page.clock.runFor(dwell - 1);
    await expect(cards.first()).toHaveClass(/flip/);
    await expect(cards.first()).not.toHaveClass(/blink/);
    await expect(cards.first().locator(".offer")).toHaveText(offers[i]);
    await page.clock.runFor(1);
    if (i + 1 < offers.length) {
      await expect(cards.first()).toHaveClass(/blink/);
      await page.clock.runFor(150);
      await expect(cards.first().locator(".offer")).toHaveText(offers[i + 1]);
    } else await expect(cards.first()).not.toHaveClass(/flip/);
  }
  for (let time = 0; time < 28000; time += 100) {
    await page.clock.runFor(100);
    expect(await page.locator(".partner.flip").count()).toBeLessThanOrEqual(2);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".partner.flip")).toHaveCount(0);
  for (const offer of await page.locator(".partner-offers li").all()) await expect(offer).toBeVisible();
});

for (const locale of ["fr", "en"]) test(`five native carousels retain keyboard scrolling and position dots ${locale}`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(local(locale === "fr" ? "/fr" : "/"));
  const tracks = page.locator(".mobile-carousel");
  await expect(tracks).toHaveCount(5);
  for (const track of await tracks.all()) {
    await track.scrollIntoViewIfNeeded();
    await expect.poll(() => track.evaluate(el => el.scrollLeft)).toBe(0);
    await track.focus();
    await page.keyboard.press("End");
    await expect.poll(() => track.evaluate(el => el.scrollLeft)).toBeGreaterThan(100);
    const dots = track.locator("xpath=following-sibling::*[1]");
    await expect(dots.locator("i").last()).toHaveClass("on");
    await page.keyboard.press("Home");
    await expect.poll(() => track.evaluate(el => el.scrollLeft)).toBe(0);
    await expect(dots.locator("i").first()).toHaveClass("on");
    await page.keyboard.press("ArrowRight");
    await expect(dots.locator("i").nth(1)).toHaveClass("on");
    await page.keyboard.press("ArrowLeft");
    await expect(dots.locator("i").first()).toHaveClass("on");
  }
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(2700);
  for (const track of await tracks.all()) expect(await track.evaluate(el => el.scrollLeft)).toBe(0);
});

// The band must remain complete without hydration and fit the same screen contract.
for (const locale of ["fr", "en"]) for (const javaScriptEnabled of [true, false]) {
  test.describe(`technology band ${locale} JS=${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled });
    for (const [width, height] of [[1440, 800], [1280, 720], [390, 700]]) {
      test(`reduced motion, full contents, contrast and screen at ${width}×${height}`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(local(locale === "fr" ? "/fr" : "/"));
        await page.evaluate(() => document.fonts.ready);
        const band = page.locator(".hero + #technologies");
        // Round down to keep the section top visible when the hero height includes a subpixel.
        await band.evaluate(el => window.scrollTo(0, Math.floor(el.getBoundingClientRect().top + window.scrollY)));
        await expect(band).toBeInViewport({ ratio: 1 });
        expect((await band.boundingBox())!.height).toBeLessThanOrEqual(height);
        await expect(band.locator(".tech-note")).toHaveCount(0);
        const list = band.locator(".tech-set:not([aria-hidden])");
        const { TECHNOLOGIES } = await import("../src/system/technologies");
        expect(await list.locator("li span").allTextContents()).toEqual(TECHNOLOGIES.map(item => item.name));
        await expect(band.locator(".tech-set[aria-hidden=true]")).toBeHidden();
        await expect(band.locator(".tech-track")).toHaveCSS("animation-name", "none");
        await expect(band.locator(".tech-track")).toHaveCSS("transform", "none");
        for (const item of await list.locator("li").all()) {
          await expect(item).toBeInViewport({ ratio: 1 });
          await expect(item).toHaveCSS("font-size", "18px");
          await expect(item).toHaveCSS("font-weight", "600");
        }
        for (const icon of await list.locator(".tech-icon").all()) {
          await expect(icon).toHaveCSS("width", "26px");
          await expect(icon).toHaveCSS("height", "26px");
          expect(await icon.evaluate(el => getComputedStyle(el).maskImage)).toContain("/tech/");
        }
        for (const square of await list.locator(".tech-square").all()) {
          await expect(square).toHaveCSS("width", "14px");
          await expect(square).toHaveCSS("height", "14px");
        }
        const audit = await band.evaluate(section => {
          const style = getComputedStyle(section);
          // Read scoped tokens directly without relying on a rendered probe.
          const resolve = (token: string) => {
            const value = style.getPropertyValue(token).trim();
            if (!value) {
              throw new Error(`Undefined technology band color token: ${token}`);
            }
            const hex = value.match(/^#([\da-f]{3}|[\da-f]{6})$/i);
            if (hex) {
              const digits = hex[1].length === 3 ? [...hex[1]].map(n => n + n).join("") : hex[1];
              const channels = [0, 2, 4].map(offset => parseInt(digits.slice(offset, offset + 2), 16));
              return `rgb(${channels.join(", ")})`;
            }
            const rgb = value.match(/^rgb\((.*)\)$/i);
            const channels = rgb?.[1].trim().split(/[\s,]+/);
            if (channels?.length === 3 && channels.every(n => /^\d+(?:\.\d+)?$/.test(n) && Number(n) <= 255)) {
              return `rgb(${channels.map(Number).join(", ")})`;
            }
            throw new Error(`Unsupported technology band color token: ${token}=${value}`);
          };
          const ink = resolve("--ink"), white = resolve("--white"), onInk = resolve("--on-ink");
          const luminance = (color: string) => {
            const rgb = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(n => n / 255);
            const linear = rgb.map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
            return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
          };
          const text = [...section.querySelectorAll<HTMLElement>(".tech-title, .tech-title b, .tech-set:not([aria-hidden]) li span")];
          const background = luminance(style.backgroundColor);
          return {
            background: style.backgroundColor, ink,
            clipped: [...section.querySelectorAll<HTMLElement>(".tech-content, .tech-marquee, .tech-track, .tech-set:not([aria-hidden])")]
              .filter(el => el.scrollHeight > el.clientHeight + 1 || /hidden|clip/.test(getComputedStyle(el).overflowY)).map(el => el.className),
            text: text.map(el => {
              const css = getComputedStyle(el);
              const foreground = luminance(css.color);
              return { name: el.textContent, size: parseFloat(css.fontSize), ratio: (Math.max(background, foreground) + .05) / (Math.min(background, foreground) + .05), color: css.color, expected: el.matches(".tech-title") ? onInk : white };
            }),
            animations: section.getAnimations({ subtree: true }).length,
          };
        });
        expect(audit.background).toBe(audit.ink);
        expect(audit.animations).toBe(0);
        expect(audit.clipped).toEqual([]);
        for (const text of audit.text) {
          expect(text.size, text.name ?? "text").toBeGreaterThanOrEqual(16);
          expect(text.ratio, text.name ?? "text").toBeGreaterThanOrEqual(4.5);
          expect(text.color).toBe(text.expected);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      });
    }
  });
}

for (const locale of ["fr", "en"]) test(`technology loop moves left, joins seamlessly, pauses and respects live motion preference ${locale}`, async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(local(locale === "fr" ? "/fr" : "/"));
  await page.evaluate(() => document.fonts.ready);
  const band = page.locator("#technologies");
  await band.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const track = band.locator(".tech-track");
  await expect(track).toHaveCSS("animation-duration", "60s");
  await expect(track).toHaveCSS("animation-timing-function", "linear");
  await expect(track).toHaveCSS("animation-iteration-count", "infinite");
  await expect(track).toHaveCSS("animation-play-state", "running");
  await expect(band.locator(".tech-set[aria-hidden=true]")).toBeVisible();
  const start = await track.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
  await expect.poll(() => track.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41)).toBeLessThan(start);
  const seam = await track.evaluate(el => {
    const [first, second] = Array.from(el.children).map(child => child.getBoundingClientRect());
    const animation = el.getAnimations()[0];
    animation.pause();
    animation.currentTime = 30000;
    const midpoint = new DOMMatrixReadOnly(getComputedStyle(el).transform).m41;
    animation.currentTime = 59999;
    const beforeSeam = new DOMMatrixReadOnly(getComputedStyle(el).transform).m41;
    animation.currentTime = 60000;
    const end = new DOMMatrixReadOnly(getComputedStyle(el).transform).m41;
    animation.currentTime = 0;
    const beginning = new DOMMatrixReadOnly(getComputedStyle(el).transform).m41;
    animation.play();
    return { first: first.width, second: second.width, step: second.x - first.x, midpoint, beforeSeam, end, beginning };
  });
  expect(seam.first).toBeCloseTo(seam.second, 1);
  expect(seam.step).toBeCloseTo(seam.first, 1);
  expect(seam.midpoint).toBeCloseTo(-seam.first / 2, 1);
  expect(seam.beforeSeam).toBeCloseTo(-seam.first * 59999 / 60000, 1);
  expect(Math.abs(seam.first + seam.beforeSeam - seam.beginning)).toBeLessThan(1);
  // At the next iteration the first copy occupies the same position as the preceding duplicate.
  expect(seam.end).toBeCloseTo(seam.beginning, 1);
  await band.hover();
  await expect(track).toHaveCSS("animation-play-state", "paused");
  await page.mouse.move(0, 0);
  await band.focus();
  await expect(track).toHaveCSS("animation-play-state", "paused");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(track).toHaveCSS("animation-name", "none");
  await expect(band.locator(".tech-set[aria-hidden=true]")).toBeHidden();
  expect(await band.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
});

test("technology masks are served locally with the exact supplied SVG bytes", async ({ request }) => {
  const { readFile } = await import("node:fs/promises");
  const { TECHNOLOGIES } = await import("../src/system/technologies");
  for (const logo of new Set(TECHNOLOGIES.map(item => item.logo).filter(Boolean))) {
    const response = await request.get(local(`/tech/${logo}.svg`), { maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/svg+xml");
    expect(await response.body()).toEqual(await readFile(`public/tech/${logo}.svg`));
  }
});

for (const locale of ["fr", "en"]) for (const javaScriptEnabled of [true, false]) {
  test.describe(`equal application phones ${locale} JS=${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled });
    for (const [width, height] of [[1440, 800], [1280, 720], [820, 900], [390, 700], [375, 700], [320, 700]]) {
      test(`complete messages and identical screens at ${width}×${height}`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(local(locale === "fr" ? "/fr" : "/"));
        await page.evaluate(() => document.fonts.ready);
        const phones = page.locator(".live .phone");
        await expect(phones).toHaveCount(3);
        const dimensions = await phones.evaluateAll(nodes => nodes.map(phone => {
          const screen = phone.querySelector<HTMLElement>(".chat")!;
          const bar = phone.querySelector<HTMLElement>(".bar")!;
          const rect = phone.getBoundingClientRect();
          const frame = screen.getBoundingClientRect();
          const textRects = [...phone.querySelectorAll<HTMLElement>(".bar, .msg")].flatMap(node => {
            const range = document.createRange(); range.selectNodeContents(node);
            return [...range.getClientRects()].map(box => ({ top: box.top, bottom: box.bottom, left: box.left, right: box.right }));
          });
          return {
            width: rect.width, height: rect.height, screenHeight: frame.height,
            clipped: textRects.some(box => box.top < rect.top || box.bottom > rect.bottom || box.left < rect.left || box.right > rect.right),
            scrollHeight: screen.scrollHeight, clientHeight: screen.clientHeight,
            top: screen.querySelector(".msg")!.getBoundingClientRect().top - frame.top,
            padding: parseFloat(getComputedStyle(screen).paddingTop),
            barHeight: bar.getBoundingClientRect().height,
            fontSizes: [...phone.querySelectorAll<HTMLElement>(".bar, .msg, .msg b")].map(node => parseFloat(getComputedStyle(node).fontSize)),
          };
        }));
        for (const size of dimensions) {
          expect(size.width).toBeCloseTo(dimensions[0].width, 1);
          expect(size.height).toBeCloseTo(dimensions[0].height, 1);
          expect(size.screenHeight).toBeCloseTo(dimensions[0].screenHeight, 1);
          expect(size.barHeight).toBeCloseTo(dimensions[0].barHeight, 1);
          expect(size.clipped).toBe(false);
          expect(size.scrollHeight).toBeLessThanOrEqual(size.clientHeight + 1);
          expect(size.top).toBeCloseTo(size.padding, 1);
          expect(Math.min(...size.fontSizes)).toBeGreaterThanOrEqual(16);
        }
        const references = page.locator("#references");
        await expect(references.locator(".reflines, p")).toHaveCount(0);
        for (const client of ["Laparra", "Clevery", "Forexpert", "Joone", "SNCF"]) {
          await expect(references.getByRole("img", { name: new RegExp(client) })).toHaveCount(1);
        }
        if (width <= 1100) {
          const track = page.locator(".scenes.mobile-carousel");
          await expect(track).toHaveCSS("scroll-snap-type", "x mandatory");
          if (javaScriptEnabled) {
            await track.focus();
            await page.keyboard.press("End");
            await expect.poll(() => track.evaluate(el => el.scrollLeft)).toBeGreaterThan(100);
            await expect(track.locator("xpath=following-sibling::*[1]").locator("i").last()).toHaveClass("on");
          }
        }
      });
    }
  });
}
