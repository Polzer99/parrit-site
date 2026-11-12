import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import { syncBuiltinESMExports } from "node:module";
import NextServerModule from "next/dist/server/next-server.js";
import { createRequestResponseMocks } from "next/dist/server/lib/mock-request.js";
import { NextRequest } from "next/server.js";
import * as nextServer from "next/server.js";
import { loader } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";

// Real compiled pages, no socket and no external service (same harness as Brand OS).
test("compiled booking funnel, bilingual interface and all registry destinations", { timeout: 30000 }, async () => {
  const attempts = [];
  const originals = [globalThis.fetch, http.request, http.get, https.request, https.get, net.Socket.prototype.connect];
  const deny = () => { attempts.push("unexpected network"); throw new Error("Network forbidden"); };
  globalThis.fetch = http.request = http.get = https.request = https.get = net.Socket.prototype.connect = deny;
  syncBuiltinESMExports();
  const conf = JSON.parse(readFileSync(".next/required-server-files.json", "utf8")).config;
  const server = new NextServerModule.default({ dir: process.cwd(), dev: false, conf, hostname: "localhost", port: 3210 });
  try {
    await server.prepare();
    const render = async (url, locale) => {
      const chunks = [];
      const { req, res } = createRequestResponseMocks({ url, headers: { host: "localhost:3210", "x-parrit-locale": locale }, resWriter: chunk => { chunks.push(Buffer.from(chunk)); return true; } });
      await server.getRequestHandler()(req, res);
      if (!res.finished) await new Promise(resolve => res.once("finish", resolve));
      assert.equal(res.statusCode, 200, url);
      assert.equal(res.getHeader("location"), undefined, url);
      assert.equal(res.getHeader("x-middleware-rewrite"), undefined, url);
      return Buffer.concat(chunks).toString();
    };
    const load = loader("en", { "next/server": nextServer });
    const { proxy, config } = load("src/proxy.ts");
    assert.ok(config.matcher.includes("/rendez-vous"));
    assert.ok(config.matcher.includes("/fr/:path*"));
    for (const locale of ["fr", "en"]) {
      const prefix = locale === "fr" ? "/fr" : "";
      const publicPath = `${prefix}/rendez-vous?source=journal-test&utm_source=x`;
      const response = proxy(new NextRequest(`http://localhost:3210${publicPath}`, { headers: { "accept-language": "en" } }));
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("x-middleware-request-x-parrit-locale"), locale);
      assert.equal(response.headers.get("x-middleware-rewrite"), null);
      assert.equal(response.headers.get("location"), null);
      const booking = await render(publicPath, locale);
      assert.ok(booking.includes(`<html lang="${locale}"`));
      assert.ok(booking.includes(`rel="canonical" href="https://parrit.ai${prefix}/rendez-vous"`));
      for (const [language, path] of [["fr", "/fr/rendez-vous"], ["en", "/rendez-vous"], ["x-default", "/rendez-vous"]]) {
        assert.ok(booking.includes(`hrefLang="${language}" href="https://parrit.ai${path}"`));
      }
      assert.equal((booking.match(/<h1\b/g) ?? []).length, 1);
      assert.match(booking, locale === "fr" ? /Entretien stratégique IA, 15 minutes/ : /AI strategy call, 15 minutes/);
      assert.match(booking, /name="robots" content="noindex, follow"/);
      assert.match(booking, /href="mailto:paul.larmaraud@parrit.ai"/);
      assert.ok(booking.includes(`href="https://parrit.ai${prefix}/rendez-vous"`));
      assert.match(booking, /metadata\[source\]/);
      for (const [route, source] of [["/journal/malicious-mcp-server-after-install", "journal-malicious-mcp-server-after-install"], ["/journal/themes/ai-sprints", "theme-ai-sprints"]]) {
        const html = await render(`${prefix}${route}`, locale);
        const blocks = [...html.matchAll(/<section class="booking-call"[^>]*>[\s\S]*?<\/section>/g)];
        assert.equal(blocks.length, 1, route);
        const block = blocks[0][0];
        assert.match(block, new RegExp(`lang="${locale}"`));
        assert.equal((html.match(/class="[^"]*\bexec\b[^"]*"/g) ?? []).length, 1);
        assert.ok(block.includes(`href="${prefix}/rendez-vous?source=${source}"`));
        assert.doesNotMatch(visibleText(block), /offert|gratuit|€|countdown|compte à rebours/i);
        if (source.startsWith("journal-")) {
          assert.match(html, new RegExp(`class="journal-body" lang="${locale}"`));
          assert.ok(html.indexOf('class="journal-body"') < blocks[0].index);
          assert.ok(blocks[0].index < html.indexOf('class="journal-related"'));
        } else {
          assert.ok(html.indexOf('class="journal-list"') < blocks[0].index);
        }
        await render(`${prefix}/rendez-vous?source=${source}`, locale);
      }
      const { ctaHref } = load("src/lib/registry/cta.ts");
      for (const id of ["rdv.paul", "rdv.systeme", "rdv.offre", "rdv.auteur", "prototype.demander"]) {
        const href = ctaHref(id, locale, "test-registry");
        assert.equal(href, `${prefix}/rendez-vous?source=test-registry`);
        await render(href, locale);
      }
    }
    assert.doesNotMatch(await render("/sitemap.xml", "en"), /rendez-vous/);
  } finally {
    await server.close();
    [globalThis.fetch, http.request, http.get, https.request, https.get, net.Socket.prototype.connect] = originals;
    syncBuiltinESMExports();
  }
  assert.deepEqual(attempts, []);
});
