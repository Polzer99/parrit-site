#!/usr/bin/env node
/**
 * Drip-schedule helper for parrit-site blog
 *
 * Usage:
 *   node scripts/add-blog-post.mjs <path-to-article.json> [--cadence weekly|biweekly|aggressive]
 *
 * The article.json comes from the Gemini prompt
 * (parrit-os/agents/blog-content-engine/PROMPT_GEMINI_PAUL_VOICE.md).
 *
 * Strategy:
 *   - "weekly"   : 1 article / 6-8 days, randomized weekday (mar/mer/jeu) + hour 09-17
 *   - "biweekly" : 1 article / 11-15 days
 *   - "aggressive" : 1 article / 3-5 days (steady state after ramp-up)
 *
 * The helper looks at existing publishedAt dates in blog.ts and schedules
 * the new article AFTER the last one + a natural-feel gap.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_FILE = resolve(__dirname, "../src/lib/blog.ts");

const CADENCES = {
  weekly: { minDays: 6, maxDays: 8 },
  biweekly: { minDays: 11, maxDays: 15 },
  aggressive: { minDays: 3, maxDays: 5 },
};

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeekday(date) {
  // shift to Tue/Wed/Thu — best for publishing per analytics
  const target = [2, 3, 4][randint(0, 2)];
  while (date.getDay() !== target) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

function pickHour(date) {
  // 09h - 17h randomized to ~minute precision
  date.setHours(randint(9, 17), randint(0, 59), 0, 0);
  return date;
}

function getLastPublishedAt() {
  const blog = readFileSync(BLOG_FILE, "utf-8");
  // crude regex extraction
  const pubs = [...blog.matchAll(/publishedAt:\s*"([^"]+)"/g)].map((m) => new Date(m[1]));
  const dates = [...blog.matchAll(/^\s*date:\s*"([^"]+)"/gm)].map((m) => new Date(m[1]));
  const all = [...pubs, ...dates].filter((d) => !isNaN(d.getTime()));
  if (all.length === 0) return new Date();
  return new Date(Math.max(...all.map((d) => d.getTime())));
}

function nextPublishDate(cadence = "weekly") {
  const { minDays, maxDays } = CADENCES[cadence] ?? CADENCES.weekly;
  let candidate = getLastPublishedAt();
  candidate = new Date(candidate.getTime() + randint(minDays, maxDays) * 86400000);
  candidate = pickWeekday(candidate);
  candidate = pickHour(candidate);
  // Ensure at least 2 days in the future
  const earliest = new Date(Date.now() + 2 * 86400000);
  if (candidate < earliest) candidate = earliest;
  return candidate.toISOString();
}

function main() {
  const args = process.argv.slice(2);
  const articlePath = args[0];
  const cadence = args.find((a) => a.startsWith("--cadence="))?.split("=")[1] ?? "weekly";

  if (!articlePath) {
    console.error("Usage: node scripts/add-blog-post.mjs <article.json> [--cadence=weekly|biweekly|aggressive]");
    process.exit(1);
  }

  const article = JSON.parse(readFileSync(articlePath, "utf-8"));
  if (!article.slug || !article.translations) {
    console.error("Article JSON must have `slug` and `translations`.");
    process.exit(1);
  }

  const publishedAt = nextPublishDate(cadence);
  const today = new Date().toISOString().slice(0, 10);

  // Format the entry for blog.ts
  const entry = `  {
    slug: ${JSON.stringify(article.slug)},
    date: ${JSON.stringify(article.date ?? today)},
    publishedAt: ${JSON.stringify(publishedAt)},
    author: ${JSON.stringify(article.author ?? "Paul Larmaraud")},
    tags: ${JSON.stringify(article.tags ?? [])},
    relatedSlugs: ${JSON.stringify(article.relatedSlugs ?? [])},
    translations: ${JSON.stringify(article.translations, null, 6).replace(/^/gm, "    ").trimStart()},
  },\n`;

  const blog = readFileSync(BLOG_FILE, "utf-8");
  // Insert before the closing `];` of the posts array
  const insertAt = blog.lastIndexOf("];");
  if (insertAt < 0) {
    console.error("Could not find `];` in blog.ts to insert article.");
    process.exit(1);
  }
  // Verify slug not already present
  if (blog.includes(`slug: "${article.slug}"`)) {
    console.error(`Slug "${article.slug}" already in blog.ts — aborting.`);
    process.exit(1);
  }
  const updated = blog.slice(0, insertAt) + entry + blog.slice(insertAt);
  writeFileSync(BLOG_FILE, updated, "utf-8");

  console.log(`✓ Added "${article.slug}"`);
  console.log(`  publishedAt: ${publishedAt}`);
  console.log(`  cadence:     ${cadence}`);
  console.log(`  Run \`npm run build\` to verify, then commit + push.`);
}

main();
