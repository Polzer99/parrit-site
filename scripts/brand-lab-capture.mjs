#!/usr/bin/env node
/**
 * Capture les références visuelles du Brand Lab (moodboard INTERNE, non indexé).
 *
 * Usage : node scripts/brand-lab-capture.mjs [--only=slug] [--force]
 * Sortie : public/brand-lab/refs/<slug>.jpg  (desktop 1440)
 *          public/brand-lab/refs/<slug>-m.jpg (mobile 390)
 *
 * Les captures servent UNIQUEMENT de moodboard interne (cf. BRAND-LAB-V1.md §
 * "Règle légale"). Elles ne sont pas publiées, le dossier est disallow dans
 * robots.ts et les pages portent noindex.
 *
 * Un échec de capture n'est jamais bloquant : la page Inspirations retombe sur
 * une "plaque de référence" dessinée en CSS.
 */
import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "brand-lab", "refs");

const REFS = [
  // · Paul
  { slug: "palantir", url: "https://www.palantir.com/" },
  { slug: "linear", url: "https://linear.app/" },
  { slug: "uber", url: "https://www.uber.com/" },
  { slug: "mckinsey", url: "https://www.mckinsey.com/" },
  { slug: "bain", url: "https://www.bain.com/" },
  { slug: "amazon-about", url: "https://www.aboutamazon.com/" },
  { slug: "wispr", url: "https://wisprflow.ai/" },
  // · Maxime
  { slug: "matis-clouet", url: "https://www.matisclouet.com/" },
  { slug: "iman-gadzhi", url: "https://www.imangadzhi.com/" },
  { slug: "ramit-sethi", url: "https://www.iwillteachyoutoberich.com/" },
  { slug: "sahil-bloom", url: "https://www.sahilbloom.com/" },
  { slug: "ali-abdaal", url: "https://aliabdaal.com/" },
  // · Parrit
  { slug: "aman", url: "https://www.aman.com/" },
  { slug: "bang-olufsen", url: "https://www.bang-olufsen.com/en/fr/" },
  { slug: "apple", url: "https://www.apple.com/" },
  { slug: "rimowa", url: "https://www.rimowa.com/fr/fr/home" },
  { slug: "aesop", url: "https://www.aesop.com/fr/" },
];

const args = process.argv.slice(2);
const only = args.find((a) => a.startsWith("--only="))?.split("=")[1];
const force = args.includes("--force");

async function shoot(ctxOpts, ref, suffix) {
  const file = path.join(OUT, `${ref.slug}${suffix}.jpg`);
  if (existsSync(file) && !force) return { slug: ref.slug, status: "skip" };
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({
      ...ctxOpts,
      locale: "en-US",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    });
    const page = await ctx.newPage();
    await page.goto(ref.url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(4500);
    // bannières cookies les plus courantes : on tente, on n'insiste pas
    for (const sel of [
      'button:has-text("Accept")',
      'button:has-text("Accepter")',
      'button:has-text("Tout accepter")',
      'button:has-text("I agree")',
      "#onetrust-accept-btn-handler",
    ]) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 700 })) {
          await el.click({ timeout: 1200 });
          await page.waitForTimeout(900);
          break;
        }
      } catch {}
    }
    await page.waitForTimeout(700);
    const buf = await page.screenshot({ type: "jpeg", quality: 72 });
    await writeFile(file, buf);
    return { slug: ref.slug, status: "ok" };
  } catch (e) {
    return { slug: ref.slug, status: "fail", error: String(e).slice(0, 120) };
  } finally {
    await browser.close();
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const list = only ? REFS.filter((r) => r.slug === only) : REFS;
  const report = [];
  for (const ref of list) {
    const d = await shoot({ viewport: { width: 1440, height: 900 } }, ref, "");
    const m = await shoot(
      { viewport: { width: 390, height: 780 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
      ref,
      "-m"
    );
    report.push({ ...ref, desktop: d.status, mobile: m.status, error: d.error || m.error });
    console.log(
      `${d.status === "ok" || d.status === "skip" ? "✓" : "✗"} ${ref.slug.padEnd(16)} desktop=${d.status} mobile=${m.status}${d.error ? " · " + d.error : ""}`
    );
  }
  await writeFile(path.join(OUT, "_capture-report.json"), JSON.stringify(report, null, 2));
  const failed = report.filter((r) => r.desktop === "fail");
  console.log(`\n${report.length - failed.length}/${report.length} références capturées.`);
  if (failed.length) console.log("Échecs (fallback plaque CSS) : " + failed.map((f) => f.slug).join(", "));
}

main();
