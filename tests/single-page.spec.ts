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
    await expect(page.locator("main > section")).toHaveCount(12);
    expect(await page.locator("main > section[id]").evaluateAll(nodes => nodes.map(n => n.id))).toEqual(locale === "fr" ? ["haut", "references", "en-production", "mesures", "assistant", "terrain", "offres", "parcours", "technologies", "partenaires", "questions", "contact"] : ["haut", "references", "in-production", "measurements", "assistant", "in-the-field", "offers", "path", "technologies", "team", "questions", "contact"]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const mono = await page.locator("main *, footer *, header *").evaluateAll(nodes => nodes.filter(node => {
      const style = getComputedStyle(node);
      return node.getBoundingClientRect().height > 0 && style.visibility !== "hidden" && /mono/i.test(style.fontFamily) && Array.from(node.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()) && !node.closest(".cmd-wordmark, .wordmark, .cmdbar .mark, time, .home-measure strong");
    }).map(node => node.textContent?.slice(0, 60)));
    expect(mono).toEqual([]);
    await expect(page.locator("#references").getByRole("img")).toHaveCount(6);
    await expect(page.locator(".logo-set[aria-hidden=true]")).toHaveCount(0);
    await expect(page.locator(".goal-flow")).toHaveCount(9);
    await expect(page.locator("#architecture")).toHaveCount(0);
    await expect(page.locator("#parcours + #technologies, #path + #technologies")).toHaveCount(1);
    const applications = page.locator(locale === "fr" ? "#en-production" : "#in-production");
    await expect(applications.locator(".goal-flow")).toHaveCount(9);
    await expect(applications.locator("h2")).toHaveCount(3);
    await expect(applications).not.toContainText(/Laparra|Clevery|Forexpert|Joone|SNCF/);
    await expect(applications).toContainText(locale === "fr" ? "L'assistant prépare. Vous validez." : "The assistant prepares. You approve.");
    for (const nav of [".desktop-nav", ".mobile-menu nav"]) {
      await expect(page.locator(`${nav} a`).first()).toHaveText("Applications");
      await expect(page.locator(`${nav} a`).first()).toHaveAttribute("href", locale === "fr" ? "/fr#en-production" : "/#in-production");
    }
    await expect(page.locator("#contact h2")).not.toHaveText(/\.$/);
    await expect(page.locator("main")).not.toContainText(/Brésil|Brazil|Cameroun|Cameroon|métropole lilloise|Lille area/);
    const smallText = await page.locator("main *, header *, footer *").evaluateAll(nodes => nodes.filter(el => {
      if (el.closest(".goal-diagram, .onto-ready, .onto-approval")) return false; // Explicit hero type scale, spec 29/10.
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
    await expect(page.locator('#contact a[href="#reservation"]')).toHaveCount(0);
    await page.locator("#reservation").scrollIntoViewIfNeeded();
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
  await expect(page.locator(".goal-flow")).toHaveCount(9);
  for (const path of ["/fr", "/"]) {
    await page.goto(local(path));
    await expect(page.locator(".goal-diagram [data-active=true]")).toHaveCount(3);
    await expect(page.locator(".goal-results [data-result]:visible")).toHaveCount(1);
    await expect(page.locator(".walk .human")).toHaveAttribute("transform", "translate(900 120)");
    await expect(page.locator(".walk")).toHaveClass(/withbot/);
    await expect(page.locator("#objectif option")).toHaveCount(17);
    await expect(page.locator(".goal-results [data-result]")).toHaveCount(17);
    await expect(page.locator(".partner-offers li")).toHaveCount(23);
    for (const offer of await page.locator(".partner-offers li").all()) await expect(offer).toBeVisible();
    for (const face of await page.locator(".partner-delivery").all()) await expect(face).toBeHidden();
    await expect(page.locator("#references").getByRole("img")).toHaveCount(6);
    await expect(page.locator(".contact-fallback input[type=email]")).toBeVisible();
    await expect(page.locator(".onto .story animate, .onto .story animateMotion, .onto .token")).toHaveCount(0);
    await expect(page.locator(".goal-results")).toBeVisible();
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
    // Static palette contract; breathing is covered separately in intentions.spec.
    await page.emulateMedia({ reducedMotion: "reduce" });
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
  test(`goal figure reduced motion and type scale ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    const figure = page.locator("svg.goal-diagram");
    await expect(figure).toBeVisible();
    await expect(figure).toHaveAttribute("role", "img");
    await expect(figure.locator(":scope > title")).toHaveCount(1);
    await expect(figure.locator("[data-node]")).toHaveCount(48);
    await expect(figure.locator("[data-active=true]")).toHaveCount(3);
    await expect(page.locator(".goal-results")).toHaveAttribute("aria-live", "polite");
    await expect(page.locator(".hero h1")).toHaveCSS("font-size", width === 375 ? "38px" : "46px");
    await expect(page.locator(".hero h1")).toHaveCSS("line-height", width === 375 ? "43px" : "52px");
    await expect(page.locator(".hero .btn.exec")).toHaveCSS("font-size", "22px");
    await expect(page.locator(".founder .btn.exec")).toHaveCSS("font-size", "22px");
    await expect(page.locator(".founder .btn.exec")).toHaveCSS("padding", "22px 36px");
    expect(await figure.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const locale of ["fr", "en"] as const) for (const width of [1440, 1280, 1024, 390, 360, 320]) {
  test(`17 goal paths stay stable and stop in reduced motion ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    await page.evaluate(() => document.fonts.ready);
    const geometry = () => page.locator(".goal-results, .goal-diagram, .hero .actions").evaluateAll(nodes => nodes.map(node => {
      const box = node.getBoundingClientRect(); return { top: box.top + scrollY, height: box.height };
    }));
    const baseline = await geometry();
    const options = await page.locator("#objectif option").evaluateAll(nodes => nodes.map(node => (node as HTMLOptionElement).value));
    expect(options).toHaveLength(17);
    for (const id of options) {
      await page.locator("#objectif").selectOption(id);
      await expect(page.locator(`.goal-results [data-result="${id}"]`)).toBeVisible();
      await expect(page.locator(".goal-results [data-result]:visible")).toHaveCount(1);
      await expect(page.locator(".goal-diagram [data-active=true]")).toHaveCount(3);
      const measured = await geometry();
      for (let row = 0; row < baseline.length; row++) {
        expect(Math.abs(measured[row].top - baseline[row].top)).toBeLessThanOrEqual(1);
        expect(Math.abs(measured[row].height - baseline[row].height)).toBeLessThanOrEqual(1);
      }
      expect(await page.locator(".goal-diagram").evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    }
    const before = await page.locator(".goal-diagram polyline[data-path]").getAttribute("points");
    await page.waitForTimeout(20000);
    await expect(page.locator(".goal-diagram polyline[data-path]")).toHaveAttribute("points", before!);
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

for (const width of [1440, 800, 390]) test(`motor choices remain available with reduced motion at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(local("/fr"));
  const motors = page.locator("#en-production");
  await motors.scrollIntoViewIfNeeded();
  await expect(motors.locator(".goal-flow")).toHaveCount(9);
  for (const line of await motors.locator(".goal-flow").all()) await expect(line).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const el of await page.locator(".goal-flow, .logo-track, .tech-track").all()) await expect(el).toHaveCSS("animation-name", "none");
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

for (const locale of ["fr", "en"]) for (const viewport of [{ width: 390, height: 844 }, { width: 800, height: 1100 }]) {
  test(`mobile menu panel has a visible lower edge only when open ${locale} ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    await page.evaluate(() => document.fonts.ready);
    const header = page.locator(".single-header");
    const menu = header.locator(".mobile-menu");
    const panel = menu.locator("nav");
    const summary = menu.locator("summary");
    const closedHeader = await header.boundingBox();
    await expect(panel).toBeHidden();
    await expect(panel).toHaveCSS("border-bottom-width", "0px");
    await summary.click();
    await expect(menu).toHaveAttribute("open", "");
    await expect(panel).toBeVisible();
    await expect(panel).toBeInViewport({ ratio: 1 });
    await expect(panel).toHaveCSS("border-bottom-width", "1px");
    await expect(panel).toHaveCSS("border-bottom-style", "solid");
    const geometry = await panel.evaluate(el => {
      const style = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      return {
        border: style.borderBottomColor, background: style.backgroundColor,
        paddingTop: style.paddingTop, paddingBottom: style.paddingBottom,
        left: box.left + parseFloat(style.paddingLeft), right: box.right - parseFloat(style.paddingRight),
        top: box.top + parseFloat(style.paddingTop),
        bottom: box.bottom - parseFloat(style.borderBottomWidth) - parseFloat(style.paddingBottom),
        scrollWidth: el.scrollWidth, clientWidth: el.clientWidth,
        scrollHeight: el.scrollHeight, clientHeight: el.clientHeight,
      };
    });
    expect(geometry.border).toMatch(/^rgb\(/); // Opaque, not merely different from the background.
    expect(geometry.border).not.toBe(geometry.background);
    expect(geometry.paddingBottom).toBe(geometry.paddingTop);
    expect(parseFloat(geometry.paddingTop)).toBeGreaterThan(0);
    expect(geometry.scrollWidth).toBe(geometry.clientWidth);
    expect(geometry.scrollHeight).toBe(geometry.clientHeight);
    await expect(panel.locator("a")).toHaveCount(7);
    for (const link of await panel.locator("a").all()) {
      await expect(link).toBeVisible();
      await expect(link).toBeInViewport({ ratio: 1 });
      const box = (await link.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(geometry.left);
      expect(box.x + box.width).toBeLessThanOrEqual(geometry.right);
      expect(box.y).toBeGreaterThanOrEqual(geometry.top);
      expect(box.y + box.height).toBeLessThanOrEqual(geometry.bottom);
      expect(await link.evaluate(el => el.scrollWidth <= el.clientWidth && el.scrollHeight <= el.clientHeight)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
    await summary.click();
    await expect(menu).not.toHaveAttribute("open", "");
    await expect(panel).toBeHidden();
    await expect(panel).toHaveCSS("border-bottom-width", "0px");
    await expect(header).toHaveCSS("border-bottom-width", "0px");
    expect(await header.boundingBox()).toEqual(closedHeader);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
  });
}

// Décision de Paul du 08/11/2026 : the change illustrations were removed.
// Their replacement layers are covered in parcours-accueil.spec.ts.

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
    expect(sections).toHaveLength(10);
    for (const section of sections) {
      expect(section.height, `${section.id}: first child's full border box, without margins`).toBeLessThanOrEqual(height);
      expect(section.scrollHeight, `${section.id}: content must not be clipped`).toBeLessThanOrEqual(height);
      expect(section.overflowY).not.toMatch(/hidden|clip/);
    }
    const figures = page.locator(".goal-schema, .motors-grid, .measure-grid, .assistant-links, .home-offers, .session-mosaic, .home-faq, .path-walker, .steps, .services, .logo-strip, .tech-marquee, .founder > .wrap > .grid");
    await expect(figures).toHaveCount(13);
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
        // Décision de Paul du 08/11/2026 : nouvelles grilles intrinsèques ;
        // leurs sommets et hauteurs restent mesurés, sans seuil assoupli.
        const intrinsic = await track.evaluate(el => el.matches(".home-offers,.session-mosaic"));
        if (!intrinsic) await expect(track).toHaveCSS("align-items", "flex-start");
        const top = (await track.boundingBox())!.y;
        for (const card of await track.locator(":scope > *").all()) {
          if (!intrinsic) await expect(card).toHaveCSS("align-self", "flex-start");
          expect((await card.boundingBox())!.y).toBeCloseTo(top, 0);
        }
        expect(await track.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
      }
    }
    if (width === 1440 || width === 1280) {
      const mark = (await page.locator(".single-header .mark").boundingBox())!;
      for (const selector of [".hero h1", ".goal-results", ".hero .exec"]) {
        const box = (await page.locator(selector).boundingBox())!;
        expect(box.x, `${selector}: same left edge as the header brand`).toBeCloseTo(mark.x, 0);
      }
      expect(await page.locator(".hero h1").evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBe(46);
      const button = page.locator(".hero .exec");
      await expect(button).toHaveCSS("white-space", "nowrap");
      const geometry = await button.evaluate(el => {
        const range = document.createRange();
        range.selectNode(el.firstChild!);
        const style = getComputedStyle(el);
        return {
          lines: range.getClientRects().length,
          contentWidth: range.getBoundingClientRect().width + el.querySelector("svg")!.getBoundingClientRect().width + parseFloat(style.columnGap),
          width: el.getBoundingClientRect().width,
          horizontalInset: parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth),
        };
      });
      expect(geometry.lines).toBe(1);
      expect(geometry.width).toBeCloseTo(geometry.contentWidth + geometry.horizontalInset, 0);
      // Correctif 2 : large button and canonical connector; one text line remains.
      await expect(button).toHaveCSS("padding", "22px 36px");
      const phrase = (await page.locator(".goal-results").boundingBox())!;
      const action = (await button.boundingBox())!;
      const figure = (await page.locator(".goal-diagram").boundingBox())!;
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
      // The 29/10 title scale changes; the full-hero viewport limit is unchanged.
      for (const selector of [".hero h1", "#objectif", ".goal-results", ".hero .exec", ".goal-diagram"]) {
        const box = (await page.locator(selector).boundingBox())!;
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height, selector).toBeLessThanOrEqual(height);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}

for (const locale of ["fr", "en"]) for (const width of [375, 390, 768, 1024, 1199, 1200, 1280, 1440]) {
  test(`three-level hero fits without clipped active labels ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    await page.evaluate(() => document.fonts.ready);
    const diagram = page.locator(".goal-diagram");
    const box = (await diagram.boundingBox())!;
    const hero = (await page.locator(".hero").boundingBox())!;
    await expect(diagram.locator("[data-node]")).toHaveCount(48);
    if (width < 1200) expect(box.width).toBeLessThanOrEqual(560);
    const activeLabels = page.locator('.goal-node-label[data-active="true"]');
    await expect(activeLabels).toHaveCount(3);
    for (const label of await activeLabels.all()) {
      await expect(label).toBeVisible();
      const bounds = (await label.boundingBox())!;
      expect(bounds.x).toBeGreaterThanOrEqual(hero.x);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(hero.x + hero.width);
      expect(bounds.y).toBeGreaterThanOrEqual(hero.y);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(hero.y + hero.height);
      expect(bounds.x).toBeGreaterThanOrEqual(box.x);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(box.x + box.width + 1);
      expect(await label.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(9);
    }
    for (const element of await diagram.locator("*").all()) {
      if (!await element.isVisible()) continue;
      const style = await element.evaluate(el => { const s = getComputedStyle(el); return { shadow: s.boxShadow, radius: s.borderRadius, font: s.fontFamily }; });
      expect(style.shadow).toBe("none");
      expect(style.radius).toBe("0px");
      expect(style.font).not.toMatch(/mono/i);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}

for (const locale of ["fr", "en"]) for (const width of [800, 1024]) {
  test(`hero tablet button stays intrinsic, left aligned and on one line ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 768 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    await page.evaluate(() => document.fonts.ready);
    const hero = (await page.locator(".hero").boundingBox())!;
    const phrase = (await page.locator(".goal-results").boundingBox())!;
    const button = page.locator(".hero .exec");
    const geometry = await button.evaluate(el => {
      const range = document.createRange();
      range.selectNode(el.firstChild!);
      const style = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      return {
        x: box.x, width: box.width, lines: range.getClientRects().length,
        contentWidth: range.getBoundingClientRect().width + el.querySelector("svg")!.getBoundingClientRect().width + parseFloat(style.columnGap),
        inset: parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth),
      };
    });
    expect(geometry.width).toBeLessThan(hero.width * .6);
    expect(geometry.lines).toBe(1);
    expect(geometry.width).toBeCloseTo(geometry.contentWidth + geometry.inset, 0);
    expect(geometry.x).toBeCloseTo(phrase.x, 0);
    await expect(button).toHaveCSS("white-space", "nowrap");
  });
}

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 800 }]) for (const locale of ["fr", "en"]) {
  test(`active goal labels mask neighboring nodes ${locale} ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    const options = await page.locator("#objectif option").evaluateAll(nodes => nodes.map(node => (node as HTMLOptionElement).value));
    for (const id of options) {
      await page.locator("#objectif").selectOption(id);
      await expect(page.locator(".goal-node-label")).toHaveCount(48);
      const labels = page.locator('.goal-node-label[data-active="true"]');
      await expect(labels).toHaveCount(3);
      for (const label of await labels.all()) {
        const background = label;
        await expect(background).toBeVisible();
        expect(await background.evaluate(el => getComputedStyle(el).backgroundColor)).not.toMatch(/^(none|transparent|rgba\(0, 0, 0, 0\))$/);
        await expect(background).toHaveCSS("opacity", "1");
      }
    }
  });
}

for (const locale of ["fr", "en"]) for (const width of [900, 800, 761]) {
  test(`tablet header groups languages, contact and menu on the right ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1100 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    await page.evaluate(() => document.fonts.ready);
    const header = page.locator(".single-header");
    await expect(header.locator(".desktop-nav")).toBeHidden();
    const content = await header.locator(":scope > .wrap").evaluate(el => {
      const box = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        left: box.left + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft),
        right: box.right - parseFloat(style.borderRightWidth) - parseFloat(style.paddingRight),
      };
    });
    const logo = header.locator(".mark");
    await expect(logo).toBeVisible();
    await expect(logo).toBeInViewport({ ratio: 1 });
    const brand = (await logo.boundingBox())!;
    expect(Math.abs(brand.x - content.left), "logo at the left content edge").toBeLessThanOrEqual(1);
    const controls = [header.locator(".languages"), header.locator(":scope > .wrap > .btn"), header.locator(".mobile-menu summary")];
    for (const link of await controls[0].locator("a").all()) await expect(link).toBeVisible();
    let previous = brand;
    for (const [index, control] of controls.entries()) {
      await expect(control).toBeVisible();
      await expect(control).toBeInViewport({ ratio: 1 });
      const box = (await control.boundingBox())!;
      const gap = box.x - (previous.x + previous.width);
      expect(gap, "controls keep their order without overlap").toBeGreaterThanOrEqual(0);
      if (index > 0) expect(gap, "adjacent controls stay grouped").toBeLessThanOrEqual(48);
      expect(Math.abs(box.y + box.height / 2 - (brand.y + brand.height / 2)), "controls share the logo's row").toBeLessThanOrEqual(1);
      previous = box;
    }
    expect(Math.abs(previous.x + previous.width - content.right), "menu at the right content edge").toBeLessThanOrEqual(1);
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
      for (const selector of [".hero h1", ".goal-results", ".hero .exec"]) {
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
      await expect(contact).toHaveAttribute("href", locale === "fr" ? "/fr?source=rdv-nav#contact" : "/?source=rdv-nav#contact");
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

for (const locale of ["fr", "en"]) test(`motor links select complete goal results ${locale}`, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(local(locale === "fr" ? "/fr" : "/"));
  const lines = page.locator(".goal-flow");
  await expect(lines).toHaveCount(9);
  for (const line of await lines.all()) {
    const href = new URL((await line.getAttribute("href"))!, BASE);
    await line.click();
    const id = href.searchParams.get("objectif")!;
    await expect(page.locator("#objectif")).toHaveValue(id);
    await expect(page.locator(`.goal-results [data-result="${id}"]`)).toBeVisible();
  }
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
        const band = page.locator("#parcours + #technologies, #path + #technologies");
        // Round down to keep the section top visible when the hero height includes a subpixel.
        await band.evaluate(el => window.scrollTo(0, Math.floor(el.getBoundingClientRect().top + window.scrollY)));
        await expect(band).toBeInViewport({ ratio: 1 });
        expect((await band.boundingBox())!.height).toBeLessThanOrEqual(height);
        await expect(band.locator(".tech-note")).toHaveCount(0);
        const list = band.locator(".tech-set:not([aria-hidden])");
        expect(await list.locator("li span").allTextContents()).toEqual(["ChatGPT", "Claude", "Gemini", "Mistral", "Copilot", "Google", "Microsoft", "WhatsApp", "Telegram", "OVH"]);
        await expect(page.locator(locale === "fr" ? "#technologies + #partenaires" : "#technologies + #team")).toHaveCount(1);
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
          // Passe 2, décision de Paul du 08/11/2026 : bandeau blanc, contraste AA inchangé.
          const ink = resolve("--ink"), white = resolve("--white"), ink2 = resolve("--ink2");
          const luminance = (color: string) => {
            const rgb = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(n => n / 255);
            const linear = rgb.map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
            return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
          };
          const text = [...section.querySelectorAll<HTMLElement>(".tech-title, .tech-title b, .tech-set:not([aria-hidden]) li span")];
          const background = luminance(style.backgroundColor);
          return {
            background: style.backgroundColor, white,
            clipped: [...section.querySelectorAll<HTMLElement>(".tech-content, .tech-marquee, .tech-track, .tech-set:not([aria-hidden])")]
              .filter(el => el.scrollHeight > el.clientHeight + 1 || /hidden|clip/.test(getComputedStyle(el).overflowY)).map(el => el.className),
            text: text.map(el => {
              const css = getComputedStyle(el);
              const foreground = luminance(css.color);
              return { name: el.textContent, size: parseFloat(css.fontSize), ratio: (Math.max(background, foreground) + .05) / (Math.min(background, foreground) + .05), color: css.color, expected: el.matches(".tech-title") ? ink2 : ink };
            }),
            animations: section.getAnimations({ subtree: true }).length,
          };
        });
        expect(audit.background).toBe(audit.white);
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
  test.describe(`complete motors ${locale} JS=${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled });
    for (const [width, height] of [[1440, 800], [1280, 720], [820, 900], [390, 700], [375, 700], [320, 700]]) {
      test(`complete flows without clipped text at ${width}×${height}`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(local(locale === "fr" ? "/fr" : "/"));
        await page.evaluate(() => document.fonts.ready);
        const motors = page.locator(locale === "fr" ? "#en-production" : "#in-production");
        await expect(motors.locator(".goal-flow")).toHaveCount(9);
        const columns = await motors.locator(".motor-column").evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().width));
        expect(columns).toHaveLength(3);
        for (const column of columns) expect(column).toBeCloseTo(columns[0], 1);
        expect((await motors.locator(":scope > .wrap").boundingBox())!.height).toBeLessThanOrEqual(height);
        for (const flow of await motors.locator(".goal-flow").all()) {
          await expect(flow).toBeVisible();
          const size = await flow.evaluate(el => ({ width: el.clientWidth, scrollWidth: el.scrollWidth, height: el.clientHeight, scrollHeight: el.scrollHeight, font: parseFloat(getComputedStyle(el).fontSize) }));
          expect(size.scrollWidth).toBeLessThanOrEqual(size.width + 1);
          expect(size.scrollHeight).toBeLessThanOrEqual(size.height + 1);
          expect(size.font).toBeGreaterThanOrEqual(16);
          expect(size.height).toBeGreaterThanOrEqual(44);
          for (const text of await flow.locator("b, .goal-flow-steps > span").all()) {
            const bounds = await text.evaluate(el => ({ size: parseFloat(getComputedStyle(el).fontSize), width: el.clientWidth, scrollWidth: el.scrollWidth, height: el.clientHeight, scrollHeight: el.scrollHeight }));
            expect(bounds.size).toBeGreaterThanOrEqual(16);
            expect(bounds.scrollWidth).toBeLessThanOrEqual(bounds.width + 1);
            expect(bounds.scrollHeight).toBeLessThanOrEqual(bounds.height + 1);
          }
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      });
    }
  });
}

for (const locale of ["fr", "en"]) for (const javaScriptEnabled of [true, false]) {
  test.describe(`reference logos inside the strip ${locale} JS=${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled });
    for (const [width, height] of [[1440, 800], [1280, 720], [1100, 800]]) {
      test(`all logos fit inside the strip at ${width}×${height}`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(local(locale === "fr" ? "/fr" : "/"));
        await page.evaluate(() => document.fonts.ready);
        const set = page.locator(".logo-set:not([aria-hidden])");
        await expect(set).toHaveCount(1);
        await expect(set.getByRole("img")).toHaveCount(6);
        const geometry = await set.evaluate(el => {
          const strip = el.closest(".logo-strip")!.getBoundingClientRect();
          return {
            width: el.getBoundingClientRect().width,
            strip: { top: strip.top, right: strip.right, bottom: strip.bottom, left: strip.left },
            logos: [...el.querySelectorAll('[role="img"]')].map(logo => {
              const rect = logo.getBoundingClientRect();
              return { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left, width: rect.width, height: rect.height };
            }),
          };
        });
        expect(geometry.width).toBeLessThanOrEqual(1060);
        // Décision de Paul du 13/11/2026 : une seule ligne en desktop.
        // Les boîtes sont centrées verticalement : on compare les centres.
        const centers = geometry.logos.map(logo => (logo.top + logo.bottom) / 2);
        for (const center of centers) expect(Math.abs(center - centers[0])).toBeLessThanOrEqual(2);
        const ordered = [...geometry.logos].sort((a, b) => a.left - b.left);
        for (let i = 1; i < ordered.length; i++) expect(ordered[i].left - ordered[i - 1].right).toBeGreaterThanOrEqual(24 - 0.5);
        for (const logo of geometry.logos) expect(logo.width).toBeGreaterThanOrEqual(60);
        for (const logo of geometry.logos) {
          expect(logo.width).toBeGreaterThan(0);
          expect(logo.height).toBeGreaterThan(0);
          expect(logo.left).toBeGreaterThanOrEqual(geometry.strip.left - 1);
          expect(logo.right).toBeLessThanOrEqual(geometry.strip.right + 1);
          expect(logo.top).toBeGreaterThanOrEqual(geometry.strip.top - 1);
          expect(logo.bottom).toBeLessThanOrEqual(geometry.strip.bottom + 1);
        }
      });
    }
  });
}

for (const locale of ["fr", "en"]) for (const [width, height] of [[1440, 800], [1280, 720], [390, 700], [320, 700]]) {
  test(`night tour 2: timeless scenes, footer Journal and contact spacing ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    await page.evaluate(() => document.fonts.ready);

    // None of the nine motor lines carries a date or a temporal promise.
    const months = "janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|january|february|march|april|may|june|july|august|september|october|november|december";
    const calendarDate = new RegExp(`\\b(?:\\d{1,2}(?:er|st|nd|rd|th)?\\s+(?:${months})|(?:${months})\\s+\\d{1,2}|\\d{1,4}[/-]\\d{1,2}[/-]\\d{1,4}|(?:19|20)\\d{2})\\b`, "i");
    const flows = page.locator(".goal-flow");
    await expect(flows).toHaveCount(9);
    for (const flow of await flows.all()) {
      await expect(flow).not.toContainText(calendarDate);
      await expect(flow).not.toContainText(/\b(?:aujourd'hui|demain|hier|matin|soir|today|tomorrow|yesterday|morning|evening|tonight|daily|weekly|monthly|yearly|hourly|quotidien(?:ne)?|hebdomadaire|mensuel(?:le)?|annuel(?:le)?|(?:chaque|tous les|toutes les|every|each)\s+(?:jours?|semaines?|mois|ans?|années?|heures?|day|week|month|year|hour)|\d+\s*(?:h|min(?:utes?)?|heures?|jours?|semaines?|mois|ans?|années?|hours?|days?|weeks?|months?|years?))\b/i);
    }
    const journal = locale === "fr" ? "/fr/journal" : "/journal";
    await expect(page.locator(`#references a[href="${journal}"]`)).toHaveCount(0);
    // Décision de Paul du 08/11/2026, correctif passe 2 : one index link, only in articles.
    await expect(page.locator(`main a[href="${journal}"]`)).toHaveCount(1);
    await expect(page.locator(`#${locale === "fr" ? "mesures" : "measurements"} a[href="${journal}"]`)).toHaveCount(1);
    await expect(page.locator(`footer a[href="${journal}"]`)).toBeVisible();

    if (width >= 1280) {
      const spacing = await page.locator(".founder .grid").evaluate(grid => {
        const title = grid.querySelector("h2")!.getBoundingClientRect();
        const paragraph = grid.querySelector(".founder-details > p")!;
        const range = document.createRange();
        range.selectNodeContents(paragraph);
        return { box: paragraph.getBoundingClientRect().top - title.bottom, firstLine: range.getClientRects()[0].top - title.bottom };
      });
      expect(spacing.box).toBeGreaterThanOrEqual(0);
      expect(spacing.firstLine).toBeGreaterThanOrEqual(0);
      expect(spacing.firstLine).toBeLessThanOrEqual(40);
    }

    const geometry = await page.locator(".contact-fallback .quick-fields").evaluate(fields => {
      const button = fields.querySelector("button")!;
      const input = fields.querySelector("input")!;
      const style = getComputedStyle(button);
      const box = button.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(button);
      const lines = [...range.getClientRects()];
      const text = range.getBoundingClientRect();
      const grid = fields.getBoundingClientRect();
      return {
        paddingLeft: parseFloat(style.paddingLeft), paddingRight: parseFloat(style.paddingRight),
        textLeft: text.left - box.left - parseFloat(style.borderLeftWidth),
        textRight: box.right - text.right - parseFloat(style.borderRightWidth),
        lines: lines.length, textTop: text.top - box.top, textBottom: box.bottom - text.bottom,
        left: box.left, right: box.right, gridLeft: grid.left, gridRight: grid.right,
        inputRight: input.getBoundingClientRect().right, scrollWidth: fields.scrollWidth, clientWidth: fields.clientWidth,
      };
    });
    expect(geometry.paddingLeft).toBeGreaterThanOrEqual(16);
    expect(geometry.paddingRight).toBeGreaterThanOrEqual(16);
    expect(geometry.lines).toBe(1);
    expect(geometry.textLeft).toBeGreaterThanOrEqual(geometry.paddingLeft - 1);
    expect(geometry.textRight).toBeGreaterThanOrEqual(geometry.paddingRight - 1);
    expect(geometry.textTop).toBeGreaterThanOrEqual(0);
    expect(geometry.textBottom).toBeGreaterThanOrEqual(0);
    expect(geometry.left).toBeGreaterThanOrEqual(geometry.gridLeft);
    expect(geometry.right).toBeLessThanOrEqual(geometry.gridRight + 1);
    expect(geometry.inputRight).toBeLessThanOrEqual(geometry.left + 1);
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
    expect(geometry.gridRight).toBeLessThanOrEqual(width);
  });
}

// Decision by Paul, 02/11/2026: plain language without losing SSR or destinations.
for (const locale of ["fr", "en"]) for (const width of [1440, 390, 375]) {
  test(`business language and localized SEO ${locale} ${width}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width === 1440 ? 800 : 700 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    await page.evaluate(() => document.fonts.ready);
    // Decision of 08/11/2026: the offer moves to the subtitle; SEO stays descriptive.
    const headline = locale === "fr"
      ? "Votre expertise est la matière première. Nous la mettons au travail."
      : "Your expertise is the raw material. We put it to work.";
    await expect(page.locator("h1")).toHaveText(headline);
    await expect(page.locator("h1 b")).toHaveText(locale === "fr" ? "Nous la mettons au travail." : "We put it to work.");
    await expect(page.locator(".goal-results [data-result]:visible")).toHaveCount(1);
    await expect(page.locator("#objectif option")).toHaveCount(17);
    await expect(page.locator(".hero .exec")).toHaveText(locale === "fr" ? "Prendre rendez-vous" : "Book a call");
    // Décision de Paul du 08/11/2026, nuit : action unique et attribution rendez-vous.
    await expect(page.locator(".hero .exec")).toHaveAttribute("href", `${locale === "fr" ? "/fr" : "/"}?source=accueil-rendez-vous#contact`);
    for (const selector of [".hero h1", ".goal-results", ".hero .exec"]) {
      const element = page.locator(selector);
      await expect(element).toBeVisible();
      await expect(element).toBeInViewport({ ratio: 1 });
      const bounds = await element.evaluate(el => {
        const range = document.createRange();
        range.selectNodeContents(el);
        const text = range.getBoundingClientRect();
        const box = el.getBoundingClientRect();
        return { left: text.left, right: text.right, boxLeft: box.left, boxRight: box.right,
          scrollHeight: el.scrollHeight, clientHeight: el.clientHeight };
      });
      expect(bounds.left).toBeGreaterThanOrEqual(bounds.boxLeft - 1);
      expect(bounds.right).toBeLessThanOrEqual(bounds.boxRight + 1);
      expect(bounds.scrollHeight).toBeLessThanOrEqual(bounds.clientHeight + 1);
    }
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const capture = testInfo.outputPath(`headline-${locale}-${width}.png`);
    await page.screenshot({ path: capture, animations: "disabled" });
    await testInfo.attach("headline", { path: capture, contentType: "image/png" });
    const text = await page.locator("body").innerText();
    // Only the exact H1 checked above is exempt from the old vocabulary rule.
    expect(text.replace(/\s+/g, " ").replace(headline, "")).not.toMatch(locale === "fr"
      ? /ontologie|objets reliés|sources de logique|systèmes d'action|agnostiques|harness|back-office|raffinons|matière première/i
      : /ontology|linked objects|logic sources|systems of action|technology-agnostic|harness engineering/i);
    await expect(page.locator(".goal-flow")).toHaveCount(9);
    for (const value of [await page.title(), await page.locator('meta[name="description"]').getAttribute("content")]) {
      expect(value).toMatch(locale === "fr" ? /\bIA\b.*Tourcoing.*Paris/ : /\bAI\b.*Tourcoing.*Paris/);
      expect(value).not.toMatch(/Lille/);
    }
    const definition = page.locator(locale === "fr" ? "#en-production > .wrap > p" : "#in-production > .wrap > p");
    await expect(definition).toHaveCount(1);
    await expect(definition).toBeVisible();
    const definitionHeight = await definition.evaluate(el => ({ client: el.clientHeight, scroll: el.scrollHeight }));
    expect(definitionHeight.scroll).toBeLessThanOrEqual(definitionHeight.client + 1);
    const graph = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(node => JSON.parse(node.textContent ?? "{}") as { "@type": string; description?: string; jobTitle?: string }));
    expect(graph.find(item => item["@type"] === "Organization")?.description).toMatch(locale === "fr" ? /équipes.*IA/ : /teams.*AI/);
    expect(graph.find(item => item["@type"] === "Person")?.jobTitle).toBe(locale === "fr" ? "Fondateur" : "Founder");
  });
}

test.describe("headline without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  for (const locale of ["fr", "en"]) for (const width of [1440, 390, 375]) {
    test(`text fits and contact stays above the fold ${locale} ${width}`, async ({ page }) => {
      const height = width === 1440 ? 800 : 700;
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(local(locale === "fr" ? "/fr" : "/"));
      await page.evaluate(() => document.fonts.ready);
      const title = page.locator(".hero h1");
      await expect(title).toHaveCSS("font-size", width === 1440 ? "46px" : "38px");
      await expect(title).toHaveCSS("line-height", width === 1440 ? "52px" : "43px");
      await expect(title).toHaveCSS("font-weight", "500");
      await expect(title.locator("b")).toHaveCSS("font-weight", "600");
      for (const selector of [".hero h1", ".goal-results", ".hero .exec"]) {
        const element = page.locator(selector);
        await expect(element).toBeVisible();
        await expect(element).toBeInViewport({ ratio: 1 });
        const bounds = await element.evaluate(el => ({
          scrollHeight: el.scrollHeight, clientHeight: el.clientHeight,
          scrollWidth: el.scrollWidth, clientWidth: el.clientWidth,
        }));
        expect(bounds.scrollHeight, selector).toBeLessThanOrEqual(bounds.clientHeight + 1);
        expect(bounds.scrollWidth, selector).toBeLessThanOrEqual(bounds.clientWidth + 1);
      }
      if (width === 1440) {
        const hero = (await page.locator(".hero").boundingBox())!;
        expect(hero.y + hero.height).toBeLessThanOrEqual(height);
      }
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    });
  }
});

for (const path of ["/fr", "/fr/journal", "/journal/agent-ia-entreprise"]) {
  test(`footer exposes all six destinations on ${path}`, async ({ page }) => {
    await page.goto(local(path));
    const prefix = path.startsWith("/fr") ? "/fr" : "";
    const footer = page.locator("footer");
    const links = ["harness-engineering", "ai-sprints", "integration-developpement", "conseil-transformation"].map(slug => `${prefix}/journal/themes/${slug}`);
    links.push(`${prefix}/journal`, `${prefix}/legal`);
    for (const href of links) await expect(footer.locator(`a[href="${href}"]`)).toBeVisible();
    await expect(footer.locator("a")).toHaveCount(7); // Six content links plus the existing language switch.
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 800 });
      expect(await footer.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      for (const link of await footer.locator("a").all()) {
        const box = await link.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      }
    }
  });
}
