import { expect, test } from "@playwright/test";

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";

const pages = [
  { slug: "home", path: "/fr", reviewArtifact: true },
  { slug: "masterclass-ia", path: "/fr/masterclass-ia", reviewArtifact: true },
  { slug: "masterclass-metier", path: "/fr/masterclass-metier" },
  { slug: "sessions-mcp", path: "/fr/sessions-mcp" },
  { slug: "audit", path: "/fr/audit" },
  { slug: "optimisation-flotte", path: "/fr/optimisation-flotte", reviewArtifact: true },
  { slug: "deploiement-agents", path: "/fr/deploiement-agents" },
  { slug: "outils-agentiques", path: "/fr/outils-agentiques" },
  { slug: "deployer", path: "/fr/deployer", reviewArtifact: true },
  { slug: "croissance", path: "/fr/croissance", reviewArtifact: true },
  { slug: "transmettre", path: "/fr/transmettre", reviewArtifact: true },
  { slug: "blog", path: "/fr/blog" },
  { slug: "blog-carte-action", path: "/fr/blog/une-carte-une-action" },
  { slug: "actualite", path: "/fr/actualite" },
  { slug: "glossaire", path: "/fr/glossaire" },
  { slug: "glossaire-agent-ia", path: "/fr/glossaire/agent-ia-entreprise" },
  { slug: "auteur-paul-larmaraud", path: "/fr/auteur/paul-larmaraud" },
  { slug: "zh-home", path: "/zh-CN", expectedText: /[\u3400-\u9fff]/u },
  { slug: "zh-blog", path: "/zh-CN/blog", expectedText: /[\u3400-\u9fff]/u },
  { slug: "zh-actualite", path: "/zh-CN/actualite", expectedText: /[\u3400-\u9fff]/u },
  { slug: "zh-setup", path: "/zh-CN/setup-claude-code", expectedText: /[\u3400-\u9fff]/u },
  { slug: "zh-remote", path: "/zh-CN/remote", expectedText: /[\u3400-\u9fff]/u },
  {
    slug: "zh-auteur-paul-larmaraud",
    path: "/zh-CN/auteur/paul-larmaraud",
    expectedText: /[\u3400-\u9fff]/u,
  },
  { slug: "academy", path: "/academy" },
  { slug: "fondateurs", path: "/fondateurs" },
  { slug: "diagnostic", path: "/diagnostic" },
  { slug: "detecteur-bullshit", path: "/outils/detecteur-bullshit" },
];

const expectedOrigin = "https://parrit.ai";
const expectedSocialImage = `${expectedOrigin}/opengraph-image`;
const locales = ["fr", "en", "pt-BR", "zh-CN"];
const maturityPaths = [
  "/masterclass-ia",
  "/masterclass-metier",
  "/sessions-mcp",
  "/audit",
  "/deploiement-agents",
  "/outils-agentiques",
  "/optimisation-flotte",
];
const legacyRedirects = [
  { from: "/audit-claude-code", to: "/audit" },
  { from: "/sprint", to: "/deploiement-agents" },
];

test("home maturity section exposes all N1-N7 entry points", async ({ page }) => {
  await page.goto(new URL("/fr", BASE_URL).toString(), { waitUntil: "networkidle" });

  await expect(page.locator("#maturite .mountain-point")).toHaveCount(7);
  await expect(page.locator("#maturite .maturite-tile")).toHaveCount(7);

  for (const path of maturityPaths) {
    await expect(page.locator(`#maturite .mountain-point[href="/fr${path}"]`)).toHaveCount(1);
    await expect(page.locator(`#maturite .maturite-tile[href="/fr${path}"]`)).toHaveCount(1);
  }
});

const viewports = [
  { slug: "desktop", width: 1440, height: 1100 },
  { slug: "tablet", width: 820, height: 1180 },
  { slug: "mobile", width: 390, height: 844 },
];

test("sitemap lists maturity canonicals and omits legacy redirects", async ({ request }) => {
  const sitemap = await request.get(new URL("/sitemap.xml", BASE_URL).toString());
  expect(sitemap.ok(), "sitemap response").toBeTruthy();

  const xml = await sitemap.text();
  for (const locale of locales) {
    for (const path of maturityPaths) {
      expect(xml, `sitemap contains /${locale}${path}`).toContain(
        `${expectedOrigin}/${locale}${path}`,
      );
    }

    for (const redirect of legacyRedirects) {
      expect(xml, `sitemap omits /${locale}${redirect.from}`).not.toContain(
        `${expectedOrigin}/${locale}${redirect.from}`,
      );
    }
  }
});

for (const locale of locales) {
  for (const redirect of legacyRedirects) {
    test(`${locale}${redirect.from} permanently redirects to ${locale}${redirect.to}`, async ({
      request,
    }) => {
      const response = await request.get(
        new URL(`/${locale}${redirect.from}`, BASE_URL).toString(),
        { maxRedirects: 0 },
      );

      expect(response.status(), "legacy redirect status").toBe(301);
      expect(response.headers().location, "legacy redirect target").toBe(
        `/${locale}${redirect.to}`,
      );
    });
  }
}

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
            .filter((family) =>
              /DM Sans|Cormorant Garamond|Hanken Grotesk|JetBrains Mono|Poppins/i.test(
                family,
              ),
            );

          const documentElement = document.documentElement;
          const horizontalOverflow =
            Math.max(documentElement.scrollWidth, document.body.scrollWidth) -
            documentElement.clientWidth;

          const bodyText = document.body.innerText;
          const bannedCopyMatches = [
            /\bPOCs?\b/iu,
            /\bchatbots?\b/iu,
            /\bjours-homme\b/iu,
            /\bprompts?\b/iu,
            /\bexp[ée]rimentations?\b/iu,
            /\bSur devis\b/iu,
            /—/u,
          ]
            .map((regex) => bodyText.match(regex)?.[0])
            .filter((value): value is string => Boolean(value));

          const metadata = {
            bodyFontFamily: getComputedStyle(document.body).fontFamily,
            ogUrl:
              document
                .querySelector('meta[property="og:url"]')
                ?.getAttribute("content") ?? "",
            ogImage:
              document
                .querySelector('meta[property="og:image"]')
                ?.getAttribute("content") ?? "",
            twitterImage:
              document
                .querySelector('meta[name="twitter:image"]')
                ?.getAttribute("content") ?? "",
          };

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
            bannedCopyMatches,
            metadata,
            oldFontFamilies,
            horizontalOverflow,
            vercelUrls: runtimeUrls.filter((url) => /\.vercel\.app/i.test(url)),
          };
        });

        expect(audit.bannedCopyMatches, "no public doctrine banned copy").toEqual([]);
        expect(audit.metadata.bodyFontFamily, "body uses Geist").toContain("Geist");
        expect(audit.metadata.ogUrl, "canonical social URL").toMatch(
          /^https:\/\/parrit\.ai(\/|$)/,
        );
        expect(audit.metadata.ogImage, "canonical Open Graph image").toBe(
          expectedSocialImage,
        );
        expect(audit.metadata.twitterImage, "canonical Twitter image").toBe(
          expectedSocialImage,
        );
        expect(audit.oldFontFamilies, "no old font families loaded").toEqual([]);
        expect(audit.horizontalOverflow, "no horizontal overflow").toBeLessThanOrEqual(1);
        expect(audit.vercelUrls, "no runtime *.vercel.app URL").toEqual([]);
        expect(jsErrors, "no JavaScript errors").toEqual([]);
        if (route.expectedText) {
          await expect(page.locator("body"), "expected localized body copy").toContainText(
            route.expectedText,
          );
        }

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
