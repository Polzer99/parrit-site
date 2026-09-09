import type { APIRequestContext } from "@playwright/test";
import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const SITE_URL = "https://parrit.ai";

function decodeEntities(value: string): string {
  return value.replace(/&(?:amp|quot|apos|lt|gt|#(\d+)|#x([\da-f]+));/gi, (entity: string, decimal: string | undefined, hex: string | undefined) => {
    if (decimal || hex) return String.fromCodePoint(Number.parseInt(decimal ?? hex ?? "0", decimal ? 10 : 16));
    const named: Record<string, string> = { "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">" };
    return named[entity.toLowerCase()] ?? entity;
  });
}

function attributes(tag: string): Record<string, string> {
  return Object.fromEntries([...tag.matchAll(/([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map((match) => [match[1].toLowerCase(), decodeEntities(match[2] ?? match[3] ?? match[4])]));
}

function imageUrls(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(imageUrls);
  if (!value || typeof value !== "object") return [];
  const image = value as Record<string, unknown>;
  return imageUrls(image.contentUrl ?? image.url ?? image["@id"]);
}

function jsonLdImages(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(jsonLdImages);
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) =>
    key === "image" ? imageUrls(child) : jsonLdImages(child));
}

function localUrl(value: string, page = SITE_URL): string {
  const url = new URL(value, page);
  expect([SITE_URL, new URL(BASE_URL).origin], `Origine interdite : ${value}`).toContain(url.origin);
  const target = new URL(BASE_URL);
  target.pathname = url.pathname;
  target.search = url.search;
  target.hash = "";
  return target.href;
}

async function getLocal(request: APIRequestContext, url: string) {
  const target = new URL(url);
  // Deny-all HTTP : la fixture request échappe aux interceptions navigateur.
  expect(["localhost", "127.0.0.1"]).toContain(target.hostname);
  expect(target.origin, `Origine interdite : ${url}`).toBe(new URL(BASE_URL).origin);
  // Aucun suivi, même si un serveur local redirige vers un service réel.
  return request.get(url, { maxRedirects: 0 });
}

async function getText(request: APIRequestContext, url: string): Promise<string> {
  const response = await getLocal(request, url);
  try {
    expect(response.status(), `URL inaccessible : ${url}`).toBe(200);
    return await response.text();
  } finally {
    await response.dispose();
  }
}

test("sitemap metadata has unique titles and reachable images", async ({ request }, testInfo) => {
  test.setTimeout(300_000);
  const sitemap = await getText(request, localUrl("/sitemap.xml"));
  const pages = [...new Set([...sitemap.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)]
    .map((match) => decodeEntities(match[1].trim())))];
  expect(pages.length, "Le sitemap ne contient aucune URL").toBeGreaterThan(0);
  const titles = new Map<string, string>();
  const records: { page: string; title: string; description: string | undefined; images: { field: string; url: string }[] }[] = [];

  for (const page of pages) {
    await test.step(page, async () => {
      const html = await getText(request, localUrl(page));
      const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
      const markup = html.replace(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
      const title = decodeEntities(markup.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();
      const metas = [...markup.matchAll(/<meta\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)].map(([tag]) => attributes(tag));
      const description = metas.find((meta) => meta.name === "description")?.content;
      const images = metas.filter((meta) => meta.property === "og:image")
        .map((meta) => ({ field: "og:image", url: meta.content ?? "" }));
      for (const [, attrs, body] of scripts) {
        if (attributes(attrs).type !== "application/ld+json") continue;
        const data: unknown = JSON.parse(body);
        images.push(...jsonLdImages(data).map((url) => ({ field: "JSON-LD.image", url })));
      }
      records.push({ page, title, description, images });
      expect.soft(title, `Titre absent : ${page}`).not.toBe("");
      const previous = titles.get(title);
      expect.soft(previous, `Titre partagé « ${title} » : ${previous} et ${page}`).toBeUndefined();
      if (!previous) titles.set(title, page);

      for (const { field, url } of images) {
        expect(url.trim(), `${page} : ${field} vide`).not.toBe("");
        const response = await getLocal(request, localUrl(url, page));
        try {
          expect.soft(response.status(), `${page} : ${field} ${url} : statut ${response.status()} (attendu 200)`).toBe(200);
        } finally {
          await response.dispose();
        }
      }
    });
  }
  await testInfo.attach("metadata-integrity", {
    body: JSON.stringify(records, null, 2),
    contentType: "application/json",
  });
});
