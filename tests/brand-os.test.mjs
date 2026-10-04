import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import ts from "typescript";
import { createRequire } from "node:module";

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const vendor = read("src/system/brand-os.tokens.css");
const aliases = read("src/system/tokens.css");
const source = new URL("../src/system/token.server.ts", import.meta.url);
const compiled = ts.transpileModule(readFileSync(source, "utf8"), {
  compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText;
const componentModule = { exports: {} };
new Function("require", "module", "exports", compiled)(createRequire(source), componentModule, componentModule.exports);
const { createTokenResolver, token } = componentModule.exports;

export function contrast(a, b) {
  const luminance = (hex) => {
    const rgb = hex.slice(1).match(/../g).map((v) => parseInt(v, 16) / 255)
      .map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const [x, y] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (x + .05) / (y + .05);
}

test("all color aliases resolve to vendor literals, including multi-hop action aliases", () => {
  for (const name of aliases.slice(0, aliases.indexOf("/* PC-03")).matchAll(/(--[\w-]+):/g)) {
    assert.match(token(name[1]), /^#[\da-f]{6}$/i, name[1]);
  }
  assert.equal(token("--action-fill"), token("--brand-core-canard"));
  assert.equal(token("--accent-on-dark"), token("--brand-core-rose"));
});

test("OG resolver uses root only, exact names, and fails on missing/cyclic/unsupported tokens", () => {
  const resolve = createTokenResolver([":root { --a: var(--b); --b: #ffffff; --a-long: #000000; } [data-mode] { --b: #000000; }"]);
  assert.equal(resolve("--a"), "#ffffff");
  assert.throws(() => resolve("--missing"), /Missing/);
  assert.throws(() => createTokenResolver([":root{--a:var(--b);--b:var(--a);}"])("--a"), /Cyclic/);
  assert.throws(() => createTokenResolver([":root{--a:var(--missing);}"])("--a"), /Missing/);
  assert.throws(() => createTokenResolver([":root{--a:rgba(0,0,0,1);}"])("--a"), /Unsupported/);
});

test("light and dark text, actions, selections and OG pairs meet 4.5:1", () => {
  const pairs = [];
  for (const background of ["--paper", "--paper2", "--accent-surface"]) {
    for (const foreground of ["--ink", "--body-l", "--g3", "--g4-l", "--label-d", "--accent-text"]) pairs.push([foreground, background]);
  }
  for (const background of ["--ink", "--carbon2", "--steel", "--accent-dark-surface"]) {
    for (const foreground of ["--paper", "--g4-d", "--brand-derived-on-ink-2", "--accent-on-dark"]) pairs.push([foreground, background]);
  }
  pairs.push(["--action-text", "--action-fill"], ["--ink", "--accent-on-dark"], ["--selection-fg", "--selection-bg"]);
  for (const [fg, bg] of pairs) assert.ok(contrast(token(fg), token(bg)) >= 4.5, `${fg}/${bg}: ${contrast(token(fg), token(bg))}`);
  // The October contract makes label-d readable on paper by default. Dark
  // registers override it explicitly; browser tests verify the real cascade.
  const css = read("src/app/(rev01)/rev01.css");
  for (const selector of [".home-s-hero", ".cmdbar", ".r2-dark:not(.ri-stage)"]) {
    const block = css.split("}").find((rule) => rule.split("{")[0].split(",").map((part) => part.trim()).includes(selector)
      && rule.includes("--label-d:"));
    assert.ok(block?.includes("--label-d: var(--brand-derived-on-ink-2)"), selector);
  }
  // These failures demonstrate why register aliases are necessary.
  assert.ok(contrast(token("--accent-text"), token("--carbon")) < 4.5);
  assert.ok(contrast(token("--accent-on-dark"), token("--paper")) < 4.5);
  assert.ok(contrast(token("--g2"), token("--carbon")) < 4.5);
});

test("both OG routes bundle both CSS inputs and share the resolver", () => {
  for (const file of ["src/app/opengraph-image.tsx", "src/app/(rev01)/journal/[slug]/og/route.tsx"]) {
    assert.ok(read(file).includes('import { token } from "@/system/token.server"'));
  }
  const config = read("next.config.ts");
  assert.equal((config.match(/"\.\/src\/system\/brand-os.tokens.css"/g) ?? []).length, 2);
  const layout = read("src/app/(rev01)/layout.tsx");
  assert.ok(layout.indexOf('import "../../system/brand-os.tokens.css"') < layout.indexOf('import "../../system/tokens.css"'));
});

test("brand gate rejects retired and hardcoded colors anywhere in src, including aliases and fake token files", () => {
  const fixture = mkdtempSync(path.join(tmpdir(), "brand-os-gate-"));
  try {
    for (const directory of ["src/system", "src/app/(rev01)", "src/lib", "public/brand", "archive", "src/lib/archive"]) mkdirSync(path.join(fixture, directory), { recursive: true });
    writeFileSync(path.join(fixture, "src/system/brand-os.tokens.css"), vendor);
    writeFileSync(path.join(fixture, "src/system/tokens.css"), aliases);
    const script = new URL("../scripts/brand-conformity-check.mjs", import.meta.url).pathname;
    const run = () => spawnSync(process.execPath, [script], { cwd: fixture, encoding: "utf8" });
    assert.equal(run().status, 0);
    for (const [file, literal] of [["src/lib/colors.ts", "#0a0b0c"], ["src/lib/colors.ts", "#f08e85"], ["src/lib/tokens.css", "#006F8A"], ["src/system/tokens.css", "#FFFFFF"], ["src/lib/colors.ts", "rgb(0,111,138)"], ["src/lib/colors.ts", "#D1132FAA"]]) {
      const full = path.join(fixture, file);
      writeFileSync(full, `/* ${literal} */`);
      const result = run();
      assert.equal(result.status, 1, `${file}: ${literal}`);
      assert.match(result.stderr, /outside brand-os.tokens.css|retired palette/);
      rmSync(full);
    }
    writeFileSync(path.join(fixture, "archive/old.css"), "a {color:#D1132F}");
    assert.equal(run().status, 0, "only the top-level archive is outside delivered code");
    writeFileSync(path.join(fixture, "src/lib/archive/old.css"), "a {color:#D1132F}");
    assert.equal(run().status, 1, "an archive directory inside src is still delivered code");
    rmSync(path.join(fixture, "src/lib/archive/old.css"));
    for (const value of ['a { color: blue; }', 'a { border: 1px solid black; }', 'a { --custom: rebeccapurple; }', 'const style = { backgroundColor: "navy" }', 'const el = <svg fill="aliceblue" />']) {
      writeFileSync(path.join(fixture, "src/lib/colors.ts"), value);
      assert.equal(run().status, 1, value);
    }
    rmSync(path.join(fixture, "src/lib/colors.ts"));
    writeFileSync(path.join(fixture, "src/system/brand-os.tokens.css"), ":root{--bad:#131518;}");
    assert.equal(run().status, 1, "even vendor must reject the retired palette");
  } finally { rmSync(fixture, { recursive: true, force: true }); }
});

test("both OG handlers produce real PNGs with resolved colors (no network)", async () => {
  for (const file of ["src/app/opengraph-image.tsx", "src/app/(rev01)/journal/[slug]/og/route.tsx"]) {
    const entry = new URL(`../${file}`, import.meta.url);
    const nativeRequire = createRequire(entry);
    const compiledRoute = ts.transpileModule(read(file), {
      compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    const routeModule = { exports: {} };
    const requireRoute = (name) => {
      if (name === "@/system/token.server") return componentModule.exports;
      if (name === "@/system/journal") return { getJournalEntry: () => ({ title: "Brand OS rendering test", date: "2026-09-28" }) };
      return nativeRequire(name);
    };
    new Function("require", "module", "exports", compiledRoute)(requireRoute, routeModule, routeModule.exports);
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => { throw new Error("Network forbidden during OG tests"); };
    try {
      const response = routeModule.exports.GET
        ? await routeModule.exports.GET(new Request("http://localhost/journal/test/og"), { params: Promise.resolve({ slug: "test" }) })
        : await routeModule.exports.default();
      const png = Buffer.from(await response.arrayBuffer());
      assert.equal(response.status, 200);
      assert.equal(png.subarray(1, 4).toString(), "PNG");
      assert.equal(png.readUInt32BE(16), 1200);
      assert.equal(png.readUInt32BE(20), 630);
    } finally { globalThis.fetch = originalFetch; }
  }
});
