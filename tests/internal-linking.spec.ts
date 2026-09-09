import type { APIRequestContext } from "@playwright/test";

import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";

function normalizeUrl(href: string, base = BASE_URL): string {
  const url = new URL(href, base);
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  return url.href;
}

function decodeEntities(value: string): string {
  return value.replace(/&(?:amp|quot|apos|lt|gt|#(\d+)|#x([\da-f]+));/gi, (entity: string, decimal: string | undefined, hex: string | undefined) => {
    if (decimal || hex) return String.fromCodePoint(Number.parseInt(decimal ?? hex ?? "0", decimal ? 10 : 16));
    const named: Record<string, string> = { "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">" };
    return named[entity.toLowerCase()] ?? entity;
  });
}

function anchorHrefs(html: string): string[] {
  const markup = html.replace(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
  return [...markup.matchAll(/<a\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)].flatMap(([tag]) => {
    const attributes = [...tag.matchAll(/([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)];
    const href = attributes.find((attribute) => attribute[1].toLowerCase() === "href");
    return href ? [decodeEntities(href[2] ?? href[3] ?? href[4]).trim()] : [];
  });
}

async function getText(request: APIRequestContext, url: string): Promise<string> {
  const target = new URL(url);
  expect(["localhost", "127.0.0.1"]).toContain(target.hostname);
  expect(target.origin, `Origine interdite : ${url}`).toBe(new URL(BASE_URL).origin);
  // APIRequestContext échappe au deny-all navigateur : aucun suivi de redirection.
  const response = await request.get(url, { maxRedirects: 0 });
  try {
    expect(response.status(), `URL inaccessible : ${url}`).toBe(200);
    return await response.text();
  } finally {
    await response.dispose();
  }
}

async function checkInternalLinks(request: APIRequestContext, url: string) {
  const html = await getText(request, url);
  const currentUrl = normalizeUrl(url);
  const links = [...new Set(anchorHrefs(html).filter((href) => href && !href.startsWith("#"))
    .map((href) => normalizeUrl(href, url))
    .filter((href) => new URL(href).origin === new URL(currentUrl).origin && href !== currentUrl))].sort();

  expect.soft(
    links.length,
    `${url} : ${links.length} liens internes uniques (minimum 7). Liens trouvés :\n${links.join("\n")}`,
  ).toBeGreaterThanOrEqual(7);
}

test("every discovered page has at least seven unique internal links", async ({ request }) => {
  test.setTimeout(300_000);
  const sitemap = await getText(request, `${BASE_URL}/sitemap.xml`);
  const locations = [...sitemap.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)]
    .map((match) => decodeEntities(match[1].trim()));
  expect(locations.length, "Le sitemap ne contient aucune URL").toBeGreaterThan(0);
  const urls = new Set(locations.map((location) => {
    const url = new URL(location);
    expect(url.origin, `Origine inattendue dans le sitemap : ${location}`).toBe("https://parrit.ai");
    return normalizeUrl(`${url.pathname}${url.search}`, BASE_URL);
  }));

  for (const path of ["/journal", "/fr/journal"]) {
    const html = await getText(request, `${BASE_URL}${path}`);
    for (const href of anchorHrefs(html).filter((href) => href.startsWith("/journal/"))) {
      urls.add(normalizeUrl(href));
    }
  }

  expect(urls.size, `Seulement ${urls.size} URL découvertes (minimum 40) : vérifier que le sitemap ne s'est pas vidé.`)
    .toBeGreaterThanOrEqual(40);

  for (const url of [...urls].sort()) {
    await test.step(url, async () => checkInternalLinks(request, url));
  }
});
