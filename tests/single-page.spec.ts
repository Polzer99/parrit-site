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
    expect(await page.locator("main > section[id]").evaluateAll(nodes => nodes.map(n => n.id))).toEqual(locale === "fr" ? ["en-production", "ce-qui-change", "parcours", "services", "partenaires", "references", "architecture", "contact"] : ["in-production", "what-changes", "path", "services", "team", "references", "architecture", "contact"]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const mono = await page.locator("main *, footer *, header *").evaluateAll(nodes => nodes.filter(node => {
      const style = getComputedStyle(node);
      return node.getBoundingClientRect().height > 0 && style.visibility !== "hidden" && /mono/i.test(style.fontFamily) && Array.from(node.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()) && !node.closest(".cmd-wordmark, .wordmark, .cmdbar .mark");
    }).map(node => node.textContent?.slice(0, 60)));
    expect(mono).toEqual([]);
    await expect(page.locator("#references").getByRole("img")).toHaveCount(5);
    await expect(page.locator(".logo-set[aria-hidden=true]")).toHaveCount(1);
    await expect(page.locator("#services .job")).toHaveCount(12);
    await expect(page.locator("#architecture .stage")).toHaveCount(5);
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
    expect(last!.width).toBeCloseTo(grid!.width - 2, 0);
    const rows = await cards.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top));
    expect(new Set(rows).size).toBe(width === 1440 ? 3 : 7);
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
    for (const done of await page.locator(".job .done").all()) await expect(done).toBeVisible();
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
  const sections: Record<string, [string, string]> = { manufacture: ["path", "parcours"], "build-with-you": ["path", "parcours"], standard: ["architecture", "architecture"], systems: ["architecture", "architecture"], dossiers: ["references", "references"], commission: ["contact", "contact"], contact: ["contact", "contact"] };
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
    await expect(figure.locator(".res.on")).toHaveCount(3);
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
    await expect(page.locator(".hero .sub p")).toHaveCSS("font-size", "26px");
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
    await page.clock.runFor(2400);
    await expect(figure.locator(".token")).toHaveCount(2);
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
  expect(columns).toBe(width > 1100 ? 4 : width >= 600 ? 2 : 1);
  await expect(page.locator(".job .bar i").first()).toHaveCSS("animation-duration", "6s");
  await page.locator("#architecture h2").scrollIntoViewIfNeeded();
  await expect(services).toHaveAttribute("data-anim", "out");
  await expect(page.locator(".job .bar i").first()).toHaveCSS("animation-name", "none");
  await expect(page.locator("#architecture > .wrap")).toHaveAttribute("data-anim", "in");
  await expect(page.locator(".rail i")).toHaveCSS("animation-duration", "12s");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const el of await page.locator(".job .done, .rail i, .results span").all()) await expect(el).toHaveCSS("animation-name", "none");
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
