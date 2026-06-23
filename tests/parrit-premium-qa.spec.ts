import { expect, test } from "@playwright/test";

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";

const pages = [
  { slug: "home", path: "/fr", reviewArtifact: true },
  { slug: "deployer", path: "/fr/deployer", reviewArtifact: true },
  { slug: "croissance", path: "/fr/croissance", reviewArtifact: true },
  { slug: "transmettre", path: "/fr/transmettre", reviewArtifact: true },
  { slug: "academy", path: "/academy" },
  { slug: "fondateurs", path: "/fondateurs" },
  { slug: "diagnostic", path: "/diagnostic" },
  { slug: "detecteur-bullshit", path: "/outils/detecteur-bullshit" },
];

const viewports = [
  { slug: "desktop", width: 1440, height: 1100 },
  { slug: "tablet", width: 820, height: 1180 },
  { slug: "mobile", width: 390, height: 844 },
];

for (const viewport of viewports) {
  test.describe(`${viewport.slug} ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport });

    for (const route of pages) {
      test(`${route.slug} keeps Parrit DA runtime clean`, async ({ page, browserName }) => {
        const jsErrors: string[] = [];
        page.on("pageerror", (error) => jsErrors.push(error.message));
        page.on("console", (message) => {
          if (message.type() === "error") jsErrors.push(message.text());
        });

        await page.goto(new URL(route.path, BASE_URL).toString(), {
          waitUntil: "networkidle",
        });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(500);

        const audit = await page.evaluate(() => {
          const oldFontFamilies = Array.from(document.fonts)
            .map((font) => font.family)
            .filter((family) => /DM Sans|Cormorant Garamond/i.test(family));

          const documentElement = document.documentElement;
          const horizontalOverflow =
            Math.max(documentElement.scrollWidth, document.body.scrollWidth) -
            documentElement.clientWidth;

          const runtimeUrls = [
            location.href,
            ...Array.from(document.querySelectorAll("[href],[src],[action]"))
              .flatMap((node) => [
                node.getAttribute("href"),
                node.getAttribute("src"),
                node.getAttribute("action"),
              ])
              .filter((value): value is string => Boolean(value)),
            ...performance.getEntriesByType("resource").map((entry) => entry.name),
          ];

          return {
            oldFontFamilies,
            horizontalOverflow,
            vercelUrls: runtimeUrls.filter((url) => /\.vercel\.app/i.test(url)),
          };
        });

        expect(audit.oldFontFamilies, "no old font families loaded").toEqual([]);
        expect(audit.horizontalOverflow, "no horizontal overflow").toBeLessThanOrEqual(1);
        expect(audit.vercelUrls, "no runtime *.vercel.app URL").toEqual([]);
        expect(jsErrors, "no JavaScript errors").toEqual([]);

        await page.screenshot({
          path: `artifacts/qa/${browserName}-${route.slug}-${viewport.slug}.png`,
          fullPage: true,
        });

        if (
          browserName === "chromium" &&
          route.reviewArtifact &&
          (viewport.slug === "desktop" || viewport.slug === "mobile")
        ) {
          await page.screenshot({
            path: `artifacts/${route.slug}-${viewport.slug}-fr.png`,
            fullPage: true,
          });
        }
      });
    }
  });
}
