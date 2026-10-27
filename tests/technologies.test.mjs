import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { loader, renderPage } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";

// Contract approved by Paul, BANDEAU-TECHNOLOGIES.md §1 (27/10/2026).
const approved = [
  ["Claude", "claude"], ["ChatGPT", "openai"], ["Gemini", "gemini"], ["Mistral", "mistral"],
  ["Llama", "meta"], ["Qwen", "qwen"], ["DeepSeek", "deepseek"], ["Kimi", "kimi"],
  ["MiniMax", "minimax"], ["GLM", "zhipu"], ["Grok", "grok"], ["Hermes", "nousresearch"],
  ["Cohere", "cohere"], ["Perplexity", "perplexity"], ["Gemma", "gemma"], ["Copilot", "copilot"],
  ["Instinct", null], ["Claude Code", "claude"], ["Codex", "openai"], ["MCP", "mcp"],
  ["OpenRouter", "openrouter"], ["n8n", "n8n"], ["Python", "python"], ["FastAPI", "fastapi"],
  ["Next.js", "nextdotjs"], ["Supabase", "supabase"], ["PostgreSQL", "postgresql"], ["Docker", "docker"],
  ["Playwright", null], ["OVH", "ovh"], ["Vercel", "vercel"], ["Cloudflare", "cloudflare"],
  ["GitHub", "github"], ["Google", "google"], ["Microsoft", "microsoft"], ["WhatsApp", "whatsapp"],
  ["Telegram", "telegram"], ["Wispr Flow", null], ["Plaud", null], ["Phantombuster", null], ["Lemlist", null],
];
const { TECHNOLOGIES } = loader("en")("src/system/technologies.ts");
test("technology registry preserves the exact approved order, names and logos", () => {
  assert.deepEqual(TECHNOLOGIES.map(({ name, logo }) => [name, logo]), approved);
});

for (const locale of ["fr", "en"]) test(`technologies immediately follow the hero with complete SSR and one accessible copy (${locale})`, async () => {
  const html = await renderPage(locale);
  assert.match(html, /<section class="hero">[\s\S]*?<\/section><section id="technologies"/);
  assert.doesNotMatch(html, /id="architecture"|href="[^"]*#architecture|\/tools\//);
  const section = html.match(/<section id="technologies"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  const copies = [...section.matchAll(/<ul([^>]*)>([\s\S]*?)<\/ul>/g)];
  assert.equal(copies.length, 2);
  assert.doesNotMatch(copies[0][1], /aria-hidden/);
  assert.match(copies[1][1], /aria-hidden="true"/);
  for (const [, , list] of copies) {
    assert.deepEqual([...list.matchAll(/<span>([^<]+)<\/span>/g)].map(m => m[1]), approved.map(([name]) => name));
    const entries = [...list.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1]);
    entries.forEach((entry, i) => {
      assert.match(entry, /<i[^>]*aria-hidden="true"/);
      if (approved[i][1]) assert.ok(entry.includes(`mask-image:url(/tech/${approved[i][1]}.svg)`));
      else { assert.match(entry, /class="tech-square"/); assert.doesNotMatch(entry, /mask-image/); }
    });
  }
  const text = visibleText(section).replace(/\s+/g, " ").trim();
  assert.ok(text.includes(locale === "fr"
    ? "Agnostiques par nature : pour chaque besoin, la meilleure technologie."
    : "Technology-agnostic by nature: for every need, the best technology."));
  assert.doesNotMatch(section, /tech-note|Les marques citées|The brands named/);
  assert.doesNotMatch(section, /<script|<img|https?:|#[a-f\d]{3,8}\b/i);
});

test("all technology SVG masks are local, color-free and attributed by file with fingerprints", () => {
  const files = [...new Set(approved.map(([, logo]) => logo).filter(Boolean))].map(logo => `${logo}.svg`).sort();
  assert.equal(files.length, 33);
  assert.deepEqual(readdirSync("public/tech").sort(), ["SOURCES.md", ...files].sort());
  const sources = readFileSync("public/tech/SOURCES.md", "utf8");
  assert.match(sources, /27\/10\/2026/);
  for (const file of files) {
    const bytes = readFileSync(`public/tech/${file}`);
    const svg = bytes.toString();
    const row = sources.split("\n").find(line => line.startsWith(`| \`${file}\` |`));
    assert.ok(row, file);
    assert.match(row, /@lobehub\/icons-static-svg@1\.60\.0|simple-icons@15\.16\.1/);
    assert.ok(row.includes(createHash("sha256").update(bytes).digest("hex")), file);
    assert.match(svg, /<svg\b[^>]*viewBox="0 0 24 24"/);
    assert.doesNotMatch(svg, /#[a-f\d]{3,8}\b|(?:rgb|hsl|lab|lch|color)\s*\(|<style|\sstyle=|\shref=|\son\w+=/i, file);
    for (const [, value] of svg.matchAll(/\b(?:fill|stroke|color|stop-color|flood-color|lighting-color)="([^"]+)"/g)) {
      assert.ok(["none", "currentColor", "inherit"].includes(value), `${file}: ${value}`);
    }
    for (const [, tag] of svg.matchAll(/<\/?([\w:-]+)/g)) assert.ok(["svg", "path", "g"].includes(tag), `${file}: ${tag}`);
  }
  assert.equal(existsSync("src/system/components/DataArchitecture.tsx"), false);
  assert.equal(existsSync("public/tools/SOURCES.md"), false);
  assert.doesNotMatch(readFileSync("src/system/single-page.css", "utf8"), /#architecture|\.flowmap|\.flow-container|\.stage\b|\.rail\b|\.chips?\b|data-rail|stage-lit|result-lit/);
});
