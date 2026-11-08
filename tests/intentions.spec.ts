import { hasFrenchJournalTranslation } from "../src/system/journal-translations";
import { test, expect } from "./network-deny.setup";
import { mkdir } from "node:fs/promises";
import contactExpectation from "./fixtures/contact-expectation.json";

const BASE = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const local = (path: string) => {
  const url = new URL(path, BASE);
  expect(["localhost", "127.0.0.1"]).toContain(url.hostname);
  return url.href;
};
test.beforeEach(async ({ page }) => {
  await page.route("**/embed/embed.js", async route => {
    expect(new URL(route.request().url()).hostname).toBe("app.cal.com");
    await route.fulfill({ contentType: "application/javascript", body: "/* offline Cal loader */" });
  });
  // Local POST must also be mocked: it otherwise calls the real downstream service.
  await page.route("**/api/interet", route => route.fulfill({ json: { ok: true } }));
});
// Décision de Paul du 08/11/2026, nuit : une action par emplacement.
const actions = [
  [".single-header > .wrap > a.rev-button", "rdv-nav"],
  [".hero .exec", "rdv-hero"],
  ["#bandeau .exec", "rdv-bandeau"],
  [".founder .btn.exec", "rdv-contact"],
] as const;

for (const locale of ["fr", "en"] as const) {
  const home = locale === "fr" ? "/fr" : "/";
  for (const [selector, source] of actions) test(`intent attribution survives click and reaches mocked form ${locale} ${source}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(`${home}?utm_source=test&utm_campaign=kept&utm_custom=custom&source=old`));
    const input = page.locator('#single-contact input[type="email"]');
    await input.fill("visitor@example.invalid");
    await page.evaluate(() => { document.documentElement.dataset.documentSentinel = "same-document"; });
    const navigations: string[] = [];
    page.on("request", request => { if (request.isNavigationRequest()) navigations.push(request.url()); });
    await page.locator(selector).click();
    await expect(page).toHaveURL(new RegExp(`source=${source}#contact$`));
    await expect(page.locator("#contact")).toBeFocused();
    await expect(page.locator("#contact h2")).toBeInViewport();
    await expect(input).toHaveValue("visitor@example.invalid");
    expect(await page.locator("html").getAttribute("data-document-sentinel")).toBe("same-document");
    expect(navigations).toEqual([]);
    const request = page.waitForRequest(request => new URL(request.url()).pathname === "/api/interet" && request.method() === "POST");
    await page.locator('#single-contact button[type="submit"]').click();
    expect((await request).postDataJSON()).toMatchObject({
      source: "site:quick-capture", lang: locale, pageOrigine: home,
      attribution: { source, utm_source: "test", utm_campaign: "kept", utm_custom: "custom" },
    });
  });

  for (const javaScriptEnabled of [true, false]) test.describe(`intent layout ${locale} JS=${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled });
    for (const [width, height] of [[1440, 800], [390, 844], [375, 844]]) test(`SSR geometry and captures ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(local(home));
      await page.evaluate(() => document.fonts.ready);
      const buttons = page.locator(".hero .actions a");
      await expect(buttons).toHaveCount(1);
      await expect(buttons.first()).toHaveClass(/\bexec\b/);
      await expect(buttons.first()).toHaveCSS("font-size", "22px");
      for (const [selector, source] of actions) await expect(page.locator(selector)).toHaveAttribute("href", `${home}?source=${source}#contact`);
      const box = (await buttons.first().boundingBox())!;
      const group = (await page.locator(".hero .actions").boundingBox())!;
      expect(Math.abs(box.x - group.x)).toBeLessThanOrEqual(1);
      expect(box.x + box.width).toBeLessThanOrEqual(group.x + group.width + 1);
      if (width === 1440) {
        const photo = (await page.locator(".hero-photo").boundingBox())!;
        expect(box.x + box.width).toBeLessThanOrEqual(photo.x);
        const hero = (await page.locator(".hero").boundingBox())!;
        expect(hero.y + hero.height).toBeLessThanOrEqual(800);
      } else {
        expect(box.width).toBeCloseTo(group.width, 0);
      }
      const steps = page.locator(".steps .step");
      await expect(steps).toHaveCount(3);
      for (const step of await steps.all()) await expect(step.locator("a")).toHaveCount(0);
      const rows = await steps.evaluateAll(nodes => nodes.map(node => ({
        top: node.getBoundingClientRect().top,
        number: node.querySelector(".n")!.getBoundingClientRect().top,
      })));
      for (const field of ["top", "number"] as const) expect(Math.max(...rows.map(row => row[field])) - Math.min(...rows.map(row => row[field]))).toBeLessThanOrEqual(1);
      const note = page.locator(".contact-expectation");
      await expect(note).toHaveText(contactExpectation[locale]);
      expect((await note.boundingBox())!.y).toBeGreaterThanOrEqual((await page.locator("#single-contact .quick-fields").boundingBox())!.y + (await page.locator("#single-contact .quick-fields").boundingBox())!.height);
      await expect(page.locator(".logo-track")).toHaveCSS("animation-name", "none");
      expect(await page.locator(".logo-strip").evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
      const logoSet = page.locator(".logo-set:not([aria-hidden])");
      await expect(logoSet.getByRole("img")).toHaveCount(8);
      const centered = await logoSet.evaluate(el => {
        const parent = el.closest(".logo-strip")!.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        return { middle: r.x + r.width / 2, parentMiddle: parent.x + parent.width / 2, overflow: el.scrollWidth - el.clientWidth };
      });
      expect(Math.abs(centered.middle - centered.parentMiddle)).toBeLessThanOrEqual(1);
      expect(centered.overflow).toBeLessThanOrEqual(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      if (process.env.CTA_CAPTURE === "1" && javaScriptEnabled) {
        const directory = process.env.CTA_CAPTURE_DIR ?? "/tmp/cta-intentions-captures";
        await mkdir(directory, { recursive: true });
        for (const [name, selector] of [["hero", ".single-header"], ["parcours", ".parcours"], ["references", "#references"]]) {
          await page.locator(selector).evaluate(el => el.scrollIntoView({ block: "start", behavior: "instant" }));
          await page.screenshot({ path: `${directory}/${locale}-${width}-${name}.png` });
        }
        await page.goto(local(`${locale === "fr" ? "/fr" : ""}/journal`));
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: `${directory}/${locale}-${width}-journal.png` });
      }
    });

    test("logos loop continuously in CSS, pause on hover/focus and stop on reduced motion", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto(local(home));
      const strip = page.locator(".logo-strip");
      const track = page.locator(".logo-set img").first();
      await strip.scrollIntoViewIfNeeded();
      await expect(track).toHaveCSS("animation-duration", "12.8s");
      await expect(track).toHaveCSS("animation-iteration-count", "infinite");
      await expect(track).toHaveCSS("animation-play-state", "running");
      await strip.hover();
      await expect(track).toHaveCSS("animation-play-state", "paused");
      await page.mouse.move(0, 0);
      await strip.focus();
      await expect(track).toHaveCSS("animation-play-state", "paused");
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(track).toHaveCSS("animation-name", "none");
      expect(await strip.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
    });
  });

  for (const width of [1440, 1100, 1099, 390]) test(`Journal reading time, themes and column breakpoint ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(local(`${locale === "fr" ? "/fr" : ""}/journal`));
    const cards = page.locator(".journal-index > li");
    expect(await cards.count()).toBeGreaterThan(0);
    for (const card of await cards.all()) {
      await expect(card.locator("a")).toHaveCount(1);
      const href = await card.locator("a").getAttribute("href");
      const slug = href!.split("/").at(-1)!;
      const translated = locale === "fr" && hasFrenchJournalTranslation(slug);
      await expect(card.locator("a")).toHaveAttribute("href", `${translated ? "/fr" : ""}/journal/${slug}`);
      await expect(card.locator("a")).toHaveAttribute("hreflang", translated ? "fr" : "en");
      await expect(card.locator(".journal-reading-time")).toHaveText(locale === "fr" ? /^[1-9]\d* min de lecture$/ : /^[1-9]\d* min read$/);
    }
    await expect(page.locator(`a[href="${locale === "fr" ? "/fr" : ""}/journal/one-card-one-action"] .journal-entry-theme`)).toHaveCount(0);
    await expect(page.locator(`a[href="${locale === "fr" ? "/fr" : ""}/journal/the-claim-a-green-pipeline-never-makes"] .journal-entry-theme`)).toHaveCount(2);
    const columns = await page.locator(".journal-index").evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length);
    expect(columns).toBe(width >= 1100 ? 2 : 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}

// Décision de Paul du 08/11/2026, nuit : quatre placements (contact rétabli au correctif 4) en SSR et hydratés.
for (const locale of ["fr", "en"] as const) for (const javaScriptEnabled of [true, false]) {
  test.describe(`single appointment action ${locale} JS=${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled });
    for (const [width, height] of [[1440, 800], [390, 700]]) {
      test(`four placements, two offers and eight contained logos ${width}`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ reducedMotion: "reduce" });
        const home = locale === "fr" ? "/fr" : "/";
        const label = locale === "fr" ? "Prendre rendez-vous" : "Book a call";
        await page.goto(local(`${home}?source=old&utm_campaign=appointment&utm_custom=kept`));
        await page.evaluate(() => document.fonts.ready);
        const reassurance = page.locator(".hero-reassurance");
        await expect(reassurance).toHaveText(locale === "fr"
          ? "Vos équipes gardent la décision. Aucune relance automatique."
          : "Your teams keep the final say. No automated follow-up.");
        await expect(reassurance).toBeVisible();
        await expect(reassurance).toHaveCSS("font-size", "16px");
        const noteBox = (await reassurance.boundingBox())!;
        const buttonBox = (await page.locator(".hero .actions a").boundingBox())!;
        expect(noteBox.y - buttonBox.y - buttonBox.height).toBeGreaterThanOrEqual(12);
        expect(noteBox.x).toBeCloseTo(buttonBox.x, 0);
        const contact = page.locator(".founder .btn.exec");
        await expect(contact).toHaveCSS("font-size", "22px");
        await expect(contact).toHaveCSS("padding", "22px 36px");
        const contactBox = (await contact.boundingBox())!;
        const bannerBox = (await page.locator("#bandeau .exec").boundingBox())!;
        expect(contactBox.y - bannerBox.y - bannerBox.height, "banner and contact never share this viewport").toBeGreaterThanOrEqual(height);
        const faq = page.locator(".home-faq details");
        await expect(faq).toHaveCount(6);
        for (let index = 0; index < 6; index++) {
          await expect(faq.nth(index)).toHaveJSProperty("open", index === 2 || index === 5);
          if (index === 2 || index === 5) {
            await expect(faq.nth(index).locator("p")).toBeVisible();
            await faq.nth(index).locator("summary").click();
            await expect(faq.nth(index).locator("p")).toBeHidden();
            await faq.nth(index).locator("summary").click();
            await expect(faq.nth(index).locator("p")).toBeVisible();
          }
        }
        await expect(page.locator(".live .note")).toHaveText(locale === "fr"
          ? "Inspirées de nos missions. Les données affichées sont fictives."
          : "Drawn from our projects. The data shown is fictitious.");
        if (width <= 900) await page.locator(".mobile-menu summary").click();
        const actions = page.locator('a.rev-button[href*="#contact"]:visible');
        await expect(actions).toHaveCount(4);
        const sources: string[] = [];
        for (const action of await actions.all()) {
          await expect(action).toHaveText(label);
          const target = new URL((await action.getAttribute("href"))!, BASE);
          expect(target.pathname).toBe(home);
          expect(target.hash).toBe("#contact");
          expect(target.searchParams.getAll("source")).toHaveLength(1);
          sources.push(target.searchParams.get("source")!);
          expect(target.searchParams.get("utm_campaign")).toBe("appointment");
          expect(target.searchParams.get("utm_custom")).toBe("kept");
        }
        expect(sources.sort()).toEqual(["rdv-bandeau", "rdv-contact", "rdv-hero", "rdv-nav"]);
        await expect(page.locator('main a.ghost[href*="#contact"]')).toHaveCount(0);
        await expect(page.locator('main a[href*="intention-"]')).toHaveCount(0);
        await expect(page.locator(".home-offer")).toHaveCount(2);
        await expect(page.locator(".home-offer a,.home-offer button,.step a,.field a")).toHaveCount(0);
        // Article excerpts keep their own editorial vocabulary, outside this amendment.
        const text = (await page.locator("main > section:not(#articles)").allInnerTexts()).join("\n");
        expect(text).not.toMatch(/\b(?:formation|former|formons|training|train)\b|parler d['’]un projet|talk about a project|conseil et outils/i);
        const logos = page.locator("#references [role=img]");
        await expect(logos).toHaveCount(8);
        expect(await logos.evaluateAll(nodes => nodes.map(node => node.getAttribute("aria-label")))).toEqual([
          "Laparra", "Clevery Avocats", "Forexpert", "Joone", "SNCF", "Toyotomi Europe", "Hiolle Technologies", "Carte Noire",
        ]);
        const geometry = await page.locator(".logo-strip").evaluate(strip => {
          const outer = strip.getBoundingClientRect();
          return { width: outer.width, overflow: strip.scrollWidth - strip.clientWidth,
            logos: [...strip.querySelectorAll('[role="img"], img')].map(logo => {
              const box = logo.getBoundingClientRect();
              return { width: box.width, height: box.height, left: box.left - outer.left,
                right: outer.right - box.right, top: box.top - outer.top, bottom: outer.bottom - box.bottom };
            }) };
        });
        expect(geometry.width).toBeLessThanOrEqual(1060);
        expect(geometry.overflow).toBeLessThanOrEqual(1);
        for (const logo of geometry.logos) {
          expect(logo.width).toBeGreaterThan(0);
          expect(logo.height).toBeGreaterThan(0);
          for (const distance of [logo.left, logo.right, logo.top, logo.bottom]) expect(distance).toBeGreaterThanOrEqual(-1);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
        if (width === 1440) {
          // FAQ interaction can scroll the page: measure document coordinates.
          const heroBottom = await page.locator(".hero").evaluate(el => el.getBoundingClientRect().bottom + window.scrollY);
          expect(heroBottom).toBeLessThanOrEqual(height);
        }
        // Native anchors preserve attribution even without hydration.
        await page.locator(".hero .exec").click();
        await expect(page).toHaveURL(/source=rdv-hero.*#contact$/);
        expect(new URL(page.url()).searchParams.get("utm_custom")).toBe("kept");
      });
    }
  });
}

// Correctif 1 : the shared navigation keeps attribution on every public surface.
for (const locale of ["fr", "en"] as const) for (const javaScriptEnabled of [true, false]) {
  test.describe(`off-home appointment ${locale} JS=${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled });
    for (const width of [1440, 390]) test(`same label and destination at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
      const prefix = locale === "fr" ? "/fr" : "";
      // Both editions from PR #370 also share the appointment navigation.
      for (const route of ["/journal", "/journal/themes/ai-sprints", "/legal", "/journal/what-is-parrit-ai"]) {
        await page.goto(local(`${prefix}${route}?utm_campaign=navigation&source=old`));
        if (width <= 900) await page.locator(".mobile-menu summary").click();
        const action = page.locator(".single-header a.rev-button:visible");
        await expect(action).toHaveCount(1);
        await expect(action).toHaveText(locale === "fr" ? "Prendre rendez-vous" : "Book a call");
        const target = new URL((await action.getAttribute("href"))!, BASE);
        expect(target.pathname).toBe(prefix || "/");
        expect(target.hash).toBe("#contact");
        expect(target.searchParams.getAll("source")).toEqual(["rdv-nav"]);
        expect(target.searchParams.get("utm_campaign")).toBe("navigation");
        await action.click();
        await expect(page).toHaveURL(target.href);
        await expect(page.locator("#contact h2")).toBeInViewport();
      }
    });
  });
}

// Correctif 2, décision de Paul du 08/11/2026, nuit : large CTA, native CSS
// interaction in both rendering modes, with no new timers or outgoing requests.
for (const locale of ["fr", "en"] as const) for (const javaScriptEnabled of [true, false]) {
  test.describe(`large appointment buttons ${locale} JS=${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled });
    for (const width of [1440, 375]) test(`size, connector, interaction and reduced motion ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto(local(locale === "fr" ? "/fr" : "/"));
      await page.evaluate(() => document.fonts.ready);
      const hero = page.locator(".hero .exec");
      await expect(hero).toHaveCSS("animation-duration", "3s");
      await expect(hero).toHaveCSS("animation-iteration-count", "infinite");
      const breath = await hero.evaluate(el => {
        const animation = el.getAnimations().find(a => a instanceof CSSAnimation && a.animationName === "appointment-breathe")!;
        animation.pause();
        const sample = (time: number) => {
          animation.currentTime = time;
          const style = getComputedStyle(el);
          return { color: style.backgroundColor, opacity: style.opacity, text: style.color, width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height };
        };
        const frames = (animation.effect as KeyframeEffect).getKeyframes();
        const samples = [sample(0), sample(1500), sample(3000)];
        animation.play();
        return { frames, samples };
      });
      expect(breath.samples[0].color).not.toBe(breath.samples[1].color);
      expect(breath.samples[0]).toEqual(breath.samples[2]);
      for (const sample of breath.samples) {
        expect(sample.opacity).toBe("1");
        expect(sample.text).toBe(breath.samples[0].text);
        expect(sample.width).toBe(breath.samples[0].width);
        expect(sample.height).toBe(breath.samples[0].height);
      }
      for (const frame of breath.frames) expect(Object.keys(frame).filter(key => !["offset", "computedOffset", "easing", "composite"].includes(key))).toEqual(["backgroundColor"]);
      await expect(page.locator("#bandeau .exec")).toHaveCSS("animation-name", "none");
      for (const selector of [".hero .exec", "#bandeau .exec"]) {
        const button = page.locator(selector);
        const arrow = button.locator('svg[data-connector="VS-CONNECTOR"]');
        await expect(button).toHaveCSS("font-size", "22px");
        await expect(button).toHaveCSS("padding", "22px 36px");
        await expect(arrow).toHaveCount(1);
        await expect(arrow).toHaveAttribute("aria-hidden", "true");
        await expect(arrow).toHaveAttribute("focusable", "false");
        const box = (await button.boundingBox())!;
        expect(box.height).toBeGreaterThanOrEqual(64);
        if (width === 375) expect(box.width).toBeCloseTo((await button.locator("..").boundingBox())!.width, 0);
        const colors = await button.evaluate(el => {
          const probe = document.createElement("span");
          el.append(probe);
          probe.style.color = "var(--brand-accessible-warm)";
          const warm = getComputedStyle(probe).color;
          probe.style.color = "var(--ink)";
          const ink = getComputedStyle(probe).color;
          probe.remove();
          return { warm, ink };
        });
        await button.hover();
        await expect(button).toHaveCSS("animation-name", "none");
        await expect(button).toHaveCSS("background-color", colors.warm);
        await expect(button).toHaveCSS("border-top-color", colors.ink);
        await expect(button).toHaveCSS("border-top-width", "2px");
        await expect(button).toHaveCSS("transition-duration", "0.15s, 0.15s, 0.15s");
        await expect(arrow).toHaveCSS("transform", "matrix(1, 0, 0, 1, 4, 0)");
        await page.mouse.down();
        await expect(button).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 1)");
        // Complete a real click. Moving a pressed anchor invokes Chromium drag
        // interception, whose timer cannot settle with page JavaScript disabled.
        await page.mouse.up();
        const home = locale === "fr" ? "/fr" : "/";
        await expect(page).toHaveURL(local(`${home}?source=rdv-${selector.startsWith(".hero") ? "hero" : "bandeau"}#contact`));
        await page.goto(local(home));
        await page.evaluate(() => document.fonts.ready);
        await page.mouse.move(0, 0);
        await button.focus();
        await expect(button).toBeFocused();
        await expect(button).toHaveCSS("animation-name", "none");
        await expect(button).toHaveCSS("background-color", colors.warm);
        await expect(button).toHaveCSS("border-top-color", colors.ink);
        await expect(arrow).toHaveCSS("transform", "matrix(1, 0, 0, 1, 4, 0)");
        await page.emulateMedia({ reducedMotion: "reduce" });
        await expect(button).toHaveCSS("animation-name", "none");
        await expect(button).toHaveCSS("transition-duration", "0s");
        await expect(arrow).toHaveCSS("transform", "none");
        await button.evaluate(el => (el as HTMLElement).blur());
        await expect(button).toHaveCSS("animation-name", "none");
        await page.emulateMedia({ reducedMotion: "no-preference" });
      }
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(page.locator(".single-header .rev-button")).toHaveClass([/\bghost\b/, /\bghost\b/]);
      const heroBox = (await page.locator(".hero").boundingBox())!;
      if (width === 1440) expect(heroBox.y + await page.evaluate(() => scrollY) + heroBox.height).toBeLessThanOrEqual(800);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    });
  });
}

// Correctif 4: the longer partner introduction fits without clipping, also in SSR.
for (const locale of ["fr", "en"] as const) for (const javaScriptEnabled of [true, false]) {
  test.describe(`compact partner section ${locale} JS=${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled });
    test("complete partner content fits 1280×720", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(local(locale === "fr" ? "/fr" : "/"));
      await page.evaluate(() => document.fonts.ready);
      const section = page.locator(locale === "fr" ? "#partenaires" : "#team");
      const dimensions = await section.locator(":scope > .wrap").evaluate(el => ({
        height: el.getBoundingClientRect().height, scrollHeight: el.scrollHeight,
        overflow: getComputedStyle(el).overflowY,
      }));
      expect(dimensions.height).toBeLessThanOrEqual(720);
      expect(dimensions.scrollHeight).toBeLessThanOrEqual(720);
      expect(dimensions.overflow).not.toMatch(/hidden|clip/);
      await expect(section.locator(".partner")).toHaveCount(7);
      await expect(section.locator(".partner-offers li")).toHaveCount(23);
      for (const paragraph of await section.locator(".team-intro,.partner-type p,.partner-offers li,.teamcap").all()) {
        await expect(paragraph).toBeVisible();
        expect(await paragraph.evaluate(el => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1280);
    });
  });
}
