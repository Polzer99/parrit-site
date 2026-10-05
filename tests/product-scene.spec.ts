import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
test.use({ serviceWorkers: "block" });

for (const locale of ["fr", "en"] as const) {
  for (const width of [375, 768, 1024, 1025, 1440]) {
    test(`product scene ${locale} ${width}`, async ({ page }, testInfo) => {
      await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${BASE_URL}${locale === "fr" ? "/fr" : "/"}`);
      const section = page.locator(".home-s-build");
      await section.scrollIntoViewIfNeeded();
      await page.evaluate(() => document.fonts.ready);
      await expect(section.getByRole("heading", { level: 2 })).toHaveText(locale === "fr"
        ? "Vous demandez, vous validez, la fiche est créée."
        : "You ask, you approve, the record is created.");
      await expect(section.locator(".product-scene-mention")).toHaveText(locale === "fr" ? "Exemple fictif" : "Fictional example");
      await expect(section.locator(".product-scene-mention")).toHaveCSS("font-family", /IBM Plex Mono/);
      await expect(section.locator(".product-scene-mention")).toHaveCSS("font-size", "14px");
      await expect(section.locator(".product-scene-steps .scene-marker")).toHaveText(["1", "2", "3"]);
      await expect(section.locator(".scene-chat .scene-marker, .product-scene-image .scene-marker")).toHaveText(["1", "2", "3"]);
      expect(await section.innerText()).not.toMatch(/Laparra|Rungis|\bMIN\b|GESLOT|Lyon/i);
      await expect(section.locator(".home-s-build-grid, .home-s-verdict")).toHaveCount(0);
      for (const img of await section.locator("img").all()) {
        await img.scrollIntoViewIfNeeded();
        await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
        await expect(img).toHaveAttribute("loading", "lazy");
        await expect(img).toHaveAttribute("decoding", "async");
        expect(await img.getAttribute("alt")).toBeTruthy();
        if (await img.evaluate((el) => el.parentElement?.tagName === "PICTURE")) {
          const sources = img.locator("..").locator("source");
          await expect(sources).toHaveCount(2);
          await expect(sources.nth(0)).toHaveAttribute("type", "image/avif");
          await expect(sources.nth(1)).toHaveAttribute("type", "image/webp");
        } else {
          await expect(img).toHaveAttribute("src", "/brand/scenes/scene-carte-visite-photo.png");
        }
      }
      for (const marker of await section.locator(".scene-marker").all()) {
        await expect(marker).toHaveCSS("width", "28px");
        await expect(marker).toHaveCSS("height", "28px");
        await expect(marker).toHaveCSS("font-weight", "600");
      }
      const chat = section.locator(".scene-chat");
      await expect(chat).toHaveAttribute("lang", "fr");
      await expect(chat.locator(".scene-chat-header strong")).toHaveText("Agent CRM");
      await expect(chat.locator(".scene-chat-header div > span")).toHaveText("bot");
      await expect(chat.locator(".scene-chat-avatar")).toHaveText("CRM");
      await expect(chat.locator(".scene-chat-date")).toHaveText("Aujourd'hui");
      await expect(chat.locator(".scene-chat-bubble > p")).toHaveText([
        "nouveau contact chez Prospect B, vu ce matin",
        "Je crée Contact achat (acheteur) chez Prospect B. C'est bon ?",
        "oui",
        "C'est créé : Contact achat (acheteur) chez Prospect B.",
      ]);
      await expect(chat.locator(".scene-chat-time")).toHaveText(["08:04", "08:04", "08:05", "08:05"]);
      await expect(chat.locator(".scene-chat-choices > span")).toHaveText(["Oui", "Non"]);
      await expect(chat.locator(".scene-chat-input")).toHaveText("Message");
      await expect(chat.locator(".scene-chat-time svg")).toHaveCount(2);
      await expect(chat.locator(".scene-chat-check")).toHaveCount(2);
      for (const text of await chat.locator(".scene-chat-bubble p, .scene-chat-bubble strong, .scene-chat-time").all()) {
        expect(await text.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)), "message text stays readable").toBeGreaterThanOrEqual(14);
      }
      await expect(section.locator(".product-scene-copy h2")).toHaveCSS("text-wrap", "balance");
      const crmMarker = await section.locator(".product-scene-image .scene-marker").evaluate((marker) => {
        const image = marker.parentElement!.getBoundingClientRect();
        const rect = marker.getBoundingClientRect();
        return [(rect.x + rect.width / 2 - image.x) / image.width * 100,
          (rect.y + rect.height / 2 - image.y) / image.height * 100];
      });
      expect(crmMarker[0]).toBeCloseTo(93, 1);
      expect(crmMarker[1]).toBeCloseTo(9, 1);
      // HTML anchors preserve the 6px separation from each real bubble, at every width.
      const markerGaps = await chat.locator(".scene-marker").evaluateAll((markers) => markers.map((marker) => {
        const rect = marker.getBoundingClientRect();
        const bubble = marker.parentElement!.getBoundingClientRect();
        return {
          gap: bubble.left - rect.right,
          intersects: rect.left < bubble.right && rect.right > bubble.left
            && rect.top < bubble.bottom && rect.bottom > bubble.top,
        };
      }));
      for (const marker of markerGaps) {
        expect(marker.intersects, "repère outside its bubble").toBe(false);
        expect(marker.gap, "repère strictly left without touching").toBeGreaterThan(0);
        expect(marker.gap, "6px gap at every viewport").toBeCloseTo(6, 1);
      }
      const geometry = await section.evaluate((el) => {
        const box = (selector: string) => {
          const r = el.querySelector(selector)!.getBoundingClientRect();
          return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width };
        };
        return {
          copy: box(".product-scene-copy"), conversation: box(".product-scene-conversation"),
          object: box(".product-scene-object"), mention: box(".product-scene-mention"),
          container: box(".product-scene"), crm: box(".product-scene-image"), label: box(".product-scene-label"),
          overflow: [...el.querySelectorAll("*")].some((child) => {
            const r = child.getBoundingClientRect();
            return r.left < -1 || r.right > innerWidth + 1;
          }),
          documentOverflow: document.documentElement.scrollWidth > innerWidth,
          textOverflow: [...el.querySelectorAll(".product-scene-copy h2, .product-scene-copy > p, .product-scene-steps li > span:last-child")].some((text) => {
            const bounds = text.getBoundingClientRect();
            const range = document.createRange();
            range.selectNodeContents(text);
            return [...range.getClientRects()].some((r) => r.left < bounds.left - 1 || r.right > bounds.right + 1);
          }),
        };
      });
      expect(geometry.overflow).toBe(false);
      expect(geometry.documentOverflow).toBe(false);
      expect(geometry.textOverflow).toBe(false);
      expect(geometry.crm.y - geometry.label.bottom, "CRM label stays attached to the capture").toBeGreaterThanOrEqual(8);
      expect(geometry.crm.y - geometry.label.bottom).toBeLessThanOrEqual(12);
      if (width > 1024) {
        expect(geometry.copy.right).toBeLessThanOrEqual(geometry.conversation.x);
        expect(geometry.conversation.right).toBeLessThanOrEqual(geometry.object.x);
        expect(geometry.conversation.width).toBe(320);
        expect(geometry.object.width).toBe(420);
        expect(Math.abs(geometry.object.bottom - geometry.conversation.bottom)).toBeLessThanOrEqual(1);
      } else {
        expect(geometry.copy.bottom).toBeLessThanOrEqual(geometry.conversation.y);
        expect(geometry.conversation.bottom).toBeLessThanOrEqual(geometry.object.y);
        expect(geometry.object.bottom).toBeLessThanOrEqual(geometry.mention.y);
        expect(geometry.conversation.width).toBeCloseTo(Math.min(360, geometry.container.width), 1);
        expect(geometry.object.width).toBeCloseTo(geometry.container.width, 1);
      }
      await section.screenshot({ path: testInfo.outputPath(`scene-${locale}-${width}.png`) });
      await testInfo.attach(`scene-${locale}-${width}`, { path: testInfo.outputPath(`scene-${locale}-${width}.png`), contentType: "image/png" });
    });
  }
}
