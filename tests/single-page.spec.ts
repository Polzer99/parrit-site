import { mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import founderPhotos from "./fixtures/founder-photo.json";
import { test, expect } from "./network-deny.setup";
const BASE = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
// Exception scénario donnée : exception validée par Paul le 27/10/2026.
const ONTOLOGY_STORY_ROSE_EXCEPTION = ".onto .gold";
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
    expect(await page.locator("main > section[id]").evaluateAll(nodes => nodes.map(n => n.id))).toEqual(locale === "fr" ? ["en-production", "ce-qui-change", "parcours", "services", "confiance", "partenaires", "references", "contact"] : ["in-production", "what-changes", "path", "services", "safeguards", "team", "references", "contact"]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const mono = await page.locator("main *, footer *, header *").evaluateAll(nodes => nodes.filter(node => {
      const style = getComputedStyle(node);
      return node.getBoundingClientRect().height > 0 && style.visibility !== "hidden" && /mono/i.test(style.fontFamily) && Array.from(node.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()) && !node.closest(".cmd-wordmark, .wordmark, .cmdbar .mark");
    }).map(node => node.textContent?.slice(0, 60)));
    expect(mono).toEqual([]);
    await expect(page.locator("#references .refs img")).toHaveCount(0);
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
    await page.locator(".contact-fallback summary").click();
    await expect(page.locator('#reservation input[type="email"]')).toBeVisible();
    await page.locator(".contact-fallback summary").click();
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
    await expect(page.locator(".onto .gold")).toHaveCSS("opacity", "1");
    await expect(page.locator(".onto .goldt")).toHaveCSS("opacity", "1");
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
  const sections: Record<string, [string, string]> = { manufacture: ["path", "parcours"], "build-with-you": ["path", "parcours"], standard: ["safeguards", "confiance"], systems: ["safeguards", "confiance"], dossiers: ["references", "references"], commission: ["contact", "contact"], contact: ["contact", "contact"] };
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
    await expect(figure.locator(".edge:not(.ghost)")).toHaveCount(11);
    await expect(figure.locator(".story .edge.ghost")).toHaveCount(1);
    await expect(figure.locator(".ag")).toHaveCount(3);
    await expect(figure.locator(".eye")).toHaveCount(6);
    for (const pulse of await figure.locator(".pulse").all()) await expect(pulse).toBeHidden();
    const pink = await page.locator(".hero .exec").evaluate(el => getComputedStyle(el).backgroundColor);
    await expect(page.locator(ONTOLOGY_STORY_ROSE_EXCEPTION)).toHaveCount(1);
    await expect(page.locator(ONTOLOGY_STORY_ROSE_EXCEPTION)).toHaveCSS("fill", pink);
    expect(await figure.locator("*").evaluateAll((nodes, { pink, exception }) => nodes.filter(el => {
      const style = getComputedStyle(el);
      return !el.matches(exception) && [style.fill, style.stroke, style.backgroundColor].includes(pink);
    }).length, { pink, exception: ONTOLOGY_STORY_ROSE_EXCEPTION })).toBe(0);
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
    await expect(page.locator("main")).toHaveAttribute("data-motion", "ready");
    await expect(page.locator(".panel .answer")).toHaveCSS("animation-duration", "8s");
    expect(await page.locator(".doc .l").evaluateAll(nodes => nodes.map(el => getComputedStyle(el).animationDelay))).toEqual(["0s", "0.6s", "1.2s"]);
    expect(await page.locator(".soft .row:last-child span").evaluateAll(nodes => nodes.map(el => getComputedStyle(el).animationDelay))).toEqual(["0s", "1s", "2s"]);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(".panel .answer")).toHaveCSS("opacity", "1");
    await expect(page.locator(".panel .answer")).toHaveCSS("animation-name", "none");
  });
}

for (const locale of ["fr", "en"]) for (const width of [1440, 390]) {
  test(`data story cycle, action rose and static reduced-motion result ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    const figure = page.locator("svg.onto");
    const result = figure.locator(".gold");
    const label = figure.locator(".goldt");
    await expect(result).toBeVisible();
    await expect(result).toHaveCSS("opacity", "1");
    await expect(label).toBeVisible();
    await expect(label).toHaveCSS("opacity", "1");
    await expect(label).toHaveText(locale === "fr" ? "Relance prête" : "Follow-up ready");
    await expect(label).toHaveCSS("font-weight", "600");
    const rose = await page.locator(".hero .exec").evaluate(el => getComputedStyle(el).backgroundColor);
    await expect(result).toHaveCSS("fill", rose);
    await expect(figure.locator(".story animate, .story animateMotion, .token")).toHaveCount(0);
    const humby = page.locator(".humby");
    await expect(humby).toBeVisible();
    await expect(humby).toHaveCSS("font-size", "16px");
    await expect(humby).toHaveText(locale === "fr"
      ? "« La donnée est le nouveau pétrole », disait Clive Humby en 2006. Brute, elle ne sert à rien : nous la raffinons."
      : "“Data is the new oil,” Clive Humby said in 2006. Raw, it is useless: we refine it.");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(figure.locator(".token animateMotion")).toHaveAttribute("dur", "9s");
    await expect(figure.locator(".token mpath")).toHaveAttribute("href", "#onto-story-path");
    await expect(figure.locator(".in")).toHaveText(locale === "fr" ? "E-mail client" : "Client e-mail");
    // Seek the real SVG timeline: input, moving token, result, then next cycle.
    for (const [seconds, outputOpacity, tokenOpacity] of [[1, "0", "1"], [7.5, "1", "0"], [10, "0", "1"]] as const) {
      await figure.evaluate((el, time) => {
        const svg = el as SVGSVGElement;
        svg.pauseAnimations();
        svg.setCurrentTime(time);
      }, seconds);
      await expect(result).toHaveCSS("opacity", outputOpacity);
      await expect(label).toHaveCSS("opacity", outputOpacity);
      await expect(figure.locator(".token")).toHaveCSS("opacity", tokenOpacity);
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(figure.locator(".token")).toHaveCount(0);
    await expect(result).toHaveCSS("opacity", "1");
    await expect(label).toHaveCSS("opacity", "1");
    await expect(figure.locator(".story animate, .story animateMotion")).toHaveCount(0);
  });
}
