import { test, expect } from "./network-deny.setup";

const BASE = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
test.use({ serviceWorkers: "block" });
function local(path: string) {
  const url = new URL(path, BASE);
  expect(["localhost", "127.0.0.1"]).toContain(url.hostname);
  return url.href;
}

test.beforeEach(async ({ page }) => {
  // The context-wide deny-all is installed first. No real booking or lead request.
  await page.route("**/embed/embed.js", route => route.fulfill({ contentType: "application/javascript", body: "/* offline */" }));
  await page.route("**/api/interet", route => route.fulfill({ json: { ok: true } }));
});

for (const locale of ["fr", "en"] as const) for (const javaScriptEnabled of [true, false]) {
  test.describe(`visual layers ${locale} JS=${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled });
    for (const [width, height] of [[1440, 800], [1280, 720], [390, 700], [375, 844]]) {
      test(`photos, contrast, offer alignment and final call ${width}×${height}`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(local(`${locale === "fr" ? "/fr" : "/"}?utm_custom=visual&source=old`));
        const field = page.locator(locale === "fr" ? "#terrain" : "#in-the-field");
        expect(await field.evaluate(el => el.previousElementSibling?.id)).toBe("references");
        await expect(field.locator("picture")).toHaveCount(3);
        const pictures = field.locator("picture img");
        for (const picture of await pictures.all()) {
          await picture.scrollIntoViewIfNeeded();
          await expect(picture).toBeVisible();
          await expect(picture).toHaveAttribute("alt", /\S.+/);
          await expect(picture).toHaveAttribute("loading", "lazy");
          const geometry = await picture.evaluate(async node => {
            const img = node as HTMLImageElement;
            await img.decode();
            const css = getComputedStyle(img);
            const box = img.getBoundingClientRect();
            return { width: img.width, height: img.height, declared: [img.getAttribute("width"), img.getAttribute("height")], source: img.currentSrc, natural: img.naturalWidth, fit: css.objectFit, filter: css.filter, radius: css.borderRadius, box: { width: box.width, height: box.height } };
          });
          expect(new URL(geometry.source).origin).toBe(new URL(BASE).origin);
          expect(new URL(geometry.source).pathname).toMatch(/^\/photos\/session\/.+\.(avif|webp)$/);
          expect(geometry.natural).toBeGreaterThan(0);
          expect(geometry.declared.map(Number).every(n => n > 0)).toBe(true);
          expect(geometry.fit).toBe("cover");
          expect(geometry.filter).toBe("none");
          expect(geometry.radius).toBe("0px");
          expect(geometry.box.height).toBeLessThanOrEqual(height);
          expect(geometry.box.width).toBeLessThanOrEqual(width);
        }
        const figures = await field.locator("figure").evaluateAll(nodes => nodes.map(node => {
          const b = node.getBoundingClientRect(); return { x: b.x, y: b.y, bottom: b.bottom, width: b.width, height: b.height };
        }));
        const mosaic = (await field.locator(".session-mosaic").boundingBox())!;
        const offerTrack = (await page.locator(".home-offers").boundingBox())!;
        expect(mosaic.width).toBeCloseTo(offerTrack.width, 0);
        expect((await field.locator(":scope > .wrap").boundingBox())!.height).toBeLessThanOrEqual(height);
        if (width > 760) {
          expect(mosaic.height).toBeCloseTo(Math.min(540, height * .62), 0);
          expect(figures[0].width / figures[1].width).toBeCloseTo(2, 2);
          expect(figures[0].y).toBeCloseTo(mosaic.y, 0);
          expect(figures[1].y).toBeCloseTo(mosaic.y, 0);
          expect(figures[0].x).toBeLessThan(figures[1].x);
          expect(Math.abs(figures[1].x - figures[2].x)).toBeLessThanOrEqual(1);
          expect(figures[1].bottom).toBeLessThan(figures[2].y);
          expect(Math.abs(figures[0].bottom - figures[2].bottom)).toBeLessThanOrEqual(1);
        } else {
          expect(figures.every(f => Math.abs(f.width - (width - 40)) <= 1)).toBe(true);
          await expect(field.locator(".swipe-dots i")).toHaveCount(3);
          await field.getByRole("region").focus();
          await page.keyboard.press("Home");
          await page.keyboard.press("ArrowRight");
          if (javaScriptEnabled) {
            await expect(field.locator(".swipe-dots i").nth(1)).toHaveClass("on");
            await expect.poll(() => field.getByRole("region").evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
          }
        }
        if (width <= 760) {
          for (const track of await page.locator(".home-offers,.session-mosaic,.home-journal-list").all()) {
            // Native Home can still scroll the document with JS disabled.
            // Compare all rectangles in one frame, with the same strict threshold.
            const geometry = await track.evaluate(el => ({
              top: el.getBoundingClientRect().top,
              cards: [...el.children].map(card => card.getBoundingClientRect().top),
            }));
            for (const top of geometry.cards) expect(top).toBeCloseTo(geometry.top, 0);
          }
        }
        const offers = page.locator(locale === "fr" ? "#offres" : "#offers");
        const cards = offers.locator("article");
        await expect(cards).toHaveCount(2);
        for (const card of await cards.all()) {
          await expect(card.locator("li svg")).toHaveCount(3);
          await expect(card.locator("a,button")).toHaveCount(0);
        }
        const cardRows = await cards.evaluateAll(nodes => nodes.map(node => {
          const rect = node.getBoundingClientRect();
          return { top: rect.top, bottom: rect.bottom };
        }));
        for (const key of ["top", "bottom"] as const) expect(Math.max(...cardRows.map(b => b[key])) - Math.min(...cardRows.map(b => b[key]))).toBeLessThanOrEqual(1);
        const final = page.locator("#bandeau");
        expect(await final.evaluate(el => el.previousElementSibling?.id)).toBe(locale === "fr" ? "partenaires" : "team");
        expect(await final.evaluate(el => el.nextElementSibling?.id)).toBe("questions");
        await expect(final.locator("a.exec")).toHaveCount(1);
        await expect(final.locator("a.ghost")).toHaveCount(0);
        await expect(final.locator('a.exec svg[data-connector="VS-CONNECTOR"] path')).toHaveCount(2);
        for (const [link, source] of [[final.locator("a.exec"), "rdv-bandeau"]] as const) {
          const url = new URL((await link.getAttribute("href"))!, BASE);
          expect(url.hash).toBe("#contact");
          expect(url.searchParams.getAll("source")).toEqual([source]);
          expect(url.searchParams.get("utm_custom")).toBe("visual");
        }
        await expect(field.locator("a,button")).toHaveCount(0);
        await expect(final.locator("a")).toHaveCount(1);

        const contrasts = await page.locator(".field h2,.field-intro,.session-mosaic figcaption,.field .btn,.home-offer h3,.offer-eyebrow,.home-offer p,.home-offer li span,.home-offer .btn,.live h2,.live .change-definition,.live .scene h3,.live .note,.tech-title,.tech-title b,.final-call h2,.final-call .btn").evaluateAll(nodes => {
          const lum = (color: string) => {
            const rgb = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(n => n / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
            return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
          };
          return nodes.map(node => {
            let parent: Element | null = node;
            while (parent && ["transparent", "rgba(0, 0, 0, 0)"].includes(getComputedStyle(parent).backgroundColor)) parent = parent.parentElement;
            if (!parent) throw new Error("Missing opaque background");
            const bg = lum(getComputedStyle(parent).backgroundColor), fg = lum(getComputedStyle(node).color);
            return { text: node.textContent, ratio: (Math.max(bg, fg) + .05) / (Math.min(bg, fg) + .05) };
          });
        });
        for (const sample of contrasts) expect(sample.ratio, sample.text ?? "contrast").toBeGreaterThanOrEqual(4.5);
        for (const section of await page.locator("main > section").all()) {
          await expect(section).toBeVisible();
          await expect(section).toHaveCSS("opacity", "1");
          await expect(section).not.toHaveAttribute("data-entrance");
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
        if ([1440, 375].includes(width)) await page.screenshot({ path: testInfo.outputPath(`visual-layers-${locale}-${width}.png`), fullPage: true, animations: "disabled" });
      });
    }
  });
}

for (const locale of ["fr", "en"] as const) for (const javaScriptEnabled of [true, false]) {
  test.describe(`mobile content ${locale} JS=${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled });
    for (const [width, height] of [[390, 700], [375, 844]]) {
      test(`native photos and complete Journal titles ${width}×${height}`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(local(locale === "fr" ? "/fr" : "/"));
        const mosaic = page.locator(".session-mosaic");
        await expect(mosaic).toHaveAttribute("tabindex", "0");
        await expect(mosaic).toHaveCSS("scroll-snap-type", "x mandatory");
        await expect(mosaic.locator(":scope > figure")).toHaveCount(3);
        for (const figure of await mosaic.locator(":scope > figure").all()) {
          await figure.scrollIntoViewIfNeeded();
          await figure.locator("img").evaluate(img => (img as HTMLImageElement).decode());
          await expect(figure.locator("figcaption")).toBeVisible();
          const box = await figure.evaluate(el => {
            const track = el.parentElement!.getBoundingClientRect();
            const card = el.getBoundingClientRect();
            const caption = el.querySelector("figcaption")!;
            const label = caption.getBoundingClientRect();
            return { top: card.top, trackTop: track.top, height: card.height,
              labelTop: label.top, labelBottom: label.bottom, bottom: card.bottom,
              captionFits: caption.scrollWidth <= caption.clientWidth && caption.scrollHeight <= caption.clientHeight };
          });
          expect(box.top).toBeCloseTo(box.trackTop, 0);
          expect(box.height).toBeLessThanOrEqual(height);
          expect(box.labelTop).toBeGreaterThanOrEqual(box.top);
          expect(box.labelBottom).toBeLessThanOrEqual(box.bottom);
          expect(box.captionFits).toBe(true);
        }
        const cards = page.locator("#articles article");
        await expect(cards).toHaveCount(3);
        for (const card of await cards.all()) {
          await card.scrollIntoViewIfNeeded();
          await expect(card.locator("h3")).toBeVisible();
          const text = await card.evaluate(el => {
            const box = el.getBoundingClientRect();
            const heading = el.querySelector("h3")!;
            const range = document.createRange();
            range.selectNodeContents(heading);
            return { title: heading.textContent, height: box.height,
              lineCount: range.getClientRects().length,
              clipped: [...el.querySelectorAll("a,h3,.journal-entry-meta,time")].some(node => node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1),
              linesFit: [...range.getClientRects()].every(line => line.left >= box.left - 1 && line.right <= box.right + 1 && line.top >= box.top - 1 && line.bottom <= box.bottom + 1),
              clamp: getComputedStyle(heading).webkitLineClamp };
          });
          expect(text.height).toBeLessThanOrEqual(height);
          expect(text.lineCount).toBeGreaterThan(0);
          expect(text.clipped, text.title ?? "article").toBe(false);
          expect(text.linesFit, text.title ?? "article").toBe(true);
          expect(text.clamp).toBe("none");
        }
      });
    }
  });
}

for (const locale of ["fr", "en"]) {
  test(`logo spotlight is staggered, pauses, and removes grayscale in reduced motion ${locale}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    const strip = page.locator(".logo-strip");
    await strip.scrollIntoViewIfNeeded();
    const images = page.locator(".logo-set:not([aria-hidden]) img");
    await expect(images).toHaveCount(6);
    for (const [i, img] of (await images.all()).entries()) {
      await expect(img).toHaveCSS("animation-name", "logo-spotlight");
      const delay = await img.evaluate(el => parseFloat(getComputedStyle(el).animationDelay));
      expect(delay).toBeCloseTo(i * 1.6);
      expect(await img.evaluate(el => parseFloat(getComputedStyle(el).animationDuration))).toBe(9.6);
    }
    await strip.hover();
    await expect(page.locator(".logo-track")).toHaveCSS("animation-name", "none");
    await expect(images.first()).toHaveCSS("animation-play-state", "paused");
    await page.mouse.move(0, 0); await strip.focus();
    await expect(images.first()).toHaveCSS("animation-play-state", "paused");
    await images.first().evaluate(el => { const animation = el.getAnimations()[0]; animation.pause(); animation.currentTime = 800; });
    await expect(images.first()).toHaveCSS("opacity", "1");
    await expect(images.first()).toHaveCSS("filter", "grayscale(0)");
    expect(await images.first().evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a)).toBeCloseTo(1.08, 2);
    // Sample the same animation clock: one highlighted logo, all others at rest.
    // 300 ms ramps bound each 1.6 s slot; no overlapping spotlight at wraparound.
    for (const time of [0, 300, 800, 1599, 1900, 3500, 5100, 6700, 7999, 8300, 9900, 11500, 12799, 13100]) {
      const samples = await images.evaluateAll((nodes, time) => nodes.map(el => {
        const animation = el.getAnimations()[0]; animation.pause(); animation.currentTime = time;
        return Number(getComputedStyle(el).opacity);
      }), time);
      expect(samples.filter(opacity => opacity > .351).length).toBeLessThanOrEqual(1);
      expect(samples.filter(opacity => Math.abs(opacity - .35) < .001).length).toBeGreaterThanOrEqual(5);
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const img of await images.all()) {
      await expect(img).toHaveCSS("animation-name", "none");
      await expect(img).toHaveCSS("opacity", "1");
      await expect(img).toHaveCSS("filter", "none");
    }
    expect(await strip.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
  });

  test(`section entrance runs once and new contact actions retain form data ${locale}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(local(`${locale === "fr" ? "/fr" : "/"}?utm_custom=keep`));
    for (const section of await page.locator(".hero, #contact").all()) await expect(section).not.toHaveAttribute("data-entrance");
    const field = page.locator(locale === "fr" ? "#terrain" : "#in-the-field");
    await expect(field).toHaveAttribute("data-entrance", "pending");
    await field.scrollIntoViewIfNeeded();
    await expect(field).toHaveAttribute("data-entrance", "entered");
    await expect(field).toHaveCSS("animation-duration", "0.4s");
    await expect.poll(() => field.evaluate(el => el.getAnimations().length)).toBe(0);
    await page.locator("h1").scrollIntoViewIfNeeded();
    await field.scrollIntoViewIfNeeded();
    expect(await field.evaluate(el => el.getAnimations().length)).toBe(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("[data-entrance]")).toHaveCount(0);
    const email = page.locator("#single-contact input[type=email]");
    await email.fill("test@example.invalid");
    for (const [link, source] of [[page.locator("#bandeau a.exec"), "rdv-bandeau"]] as const) {
      await link.click();
      await expect(email).toHaveValue("test@example.invalid");
      await expect(page.locator("#contact")).toBeFocused();
      expect(new URL(page.url()).searchParams.getAll("source")).toEqual([source]);
      expect(new URL(page.url()).searchParams.get("utm_custom")).toBe("keep");
    }
  });
}

// Reproduce the product journey while waiting for the document destination.
// The original parcours-accueil comparison is kept unchanged per the correction.
for (const locale of ["fr", "en"]) test(`home Journal link loads the same latest entries ${locale}`, async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const home = locale === "fr" ? "/fr" : "/";
  const journal = locale === "fr" ? "/fr/journal" : "/journal";
  await page.goto(local(home));
  const expected = await page.locator("#articles article a").evaluateAll(nodes => nodes.map(node => node.getAttribute("href")));
  expect(expected).toHaveLength(3);
  await page.locator("#articles .home-journal-link").click();
  await expect(page).toHaveURL(local(journal));
  await expect(page.locator(".journal-index > li").first()).toBeVisible();
  const actual = await page.locator(".journal-index > li > a").evaluateAll(nodes => nodes.slice(0, 3).map(node => node.getAttribute("href")));
  expect(actual).toEqual(expected);
});

// Polissage du 12/11 : focus des technologies et états des contrôles natifs.
for (const locale of ["fr", "en"] as const) {
  for (const width of [1440, 390]) {
    test(`UI polish: technology focus ${locale} ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(local(locale === "fr" ? "/fr" : "/"));
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator(".logo-set:not([aria-hidden]) .client-logo")).toHaveCount(6);
      const technologies = page.locator("#technologies");
      await technologies.scrollIntoViewIfNeeded();
      await technologies.focus();
      await expect(technologies).toHaveCSS("outline-style", "solid");
      await expect(technologies).toHaveCSS("outline-width", "2px");
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    });
  }

  test(`UI polish: technology scroll pauses on focus ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 800 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    const track = page.locator(".tech-track");
    await expect(track).toHaveCSS("animation-name", "technology-scroll");
    await page.locator("#technologies").focus();
    await expect(track).toHaveCSS("animation-play-state", "paused");
  });

  test(`UI polish: native controls expose their pressed state ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(locale === "fr" ? "/fr" : "/"));
    for (const control of [page.locator(".mobile-menu summary"), page.locator(".home-faq summary").first()]) {
      await control.scrollIntoViewIfNeeded();
      await control.hover();
      await page.mouse.down();
      try {
        await expect(control).toHaveCSS("text-decoration-line", "underline");
      } finally {
        await page.mouse.up();
      }
      await control.focus();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Shift+Tab");
      await expect(control).toBeFocused();
      await expect(control).toHaveCSS("outline-style", "solid");
    }
  });
}
