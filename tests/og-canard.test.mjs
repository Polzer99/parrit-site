import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire, syncBuiltinESMExports } from "node:module";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import { test, beforeEach, afterEach, mock } from "node:test";
import ts from "typescript";
import sharp from "sharp";
import { generateIcons } from "../scripts/generate-brand-icons.mjs";

let networkAttempts;
beforeEach(() => {
  networkAttempts = [];
  const deny = () => { networkAttempts.push("outbound request"); throw new Error("Network forbidden"); };
  for (const transport of [http, https]) {
    mock.method(transport, "request", deny);
    mock.method(transport, "get", deny);
  }
  mock.method(net.Socket.prototype, "connect", deny);
  mock.method(globalThis, "fetch", deny);
  syncBuiltinESMExports();
});
afterEach(() => {
  mock.restoreAll();
  syncBuiltinESMExports();
  assert.deepEqual(networkAttempts, []);
});

function load(file, overrides = {}) {
  const url = new URL(`../${file}`, import.meta.url);
  const nativeRequire = createRequire(url);
  const compiled = ts.transpileModule(readFileSync(url, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const loaded = { exports: {} };
  new Function("require", "module", "exports", compiled)((name) => overrides[name] ?? nativeRequire(name), loaded, loaded.exports);
  return loaded.exports;
}
const { token } = load("src/system/token.server.ts");
const rgb = (name) => token(name).slice(1).match(/../g).map((value) => parseInt(value, 16));

async function checkImage(bytes, size) {
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.deepEqual([info.width, info.height], size);
  for (const [x, y] of [[0, 0], [info.width - 1, 0], [0, info.height - 1], [info.width - 1, info.height - 1]]) {
    const index = (y * info.width + x) * 4;
    assert.deepEqual([...data.subarray(index, index + 4)], [...rgb("--accent-strong"), 255]);
  }
  for (const color of ["--paper2", "--accent-on-dark"]) {
    const expected = rgb(color);
    assert.ok(data.some((_, i) => i % 4 === 0 && expected.every((v, c) => data[i + c] === v)), `Missing ${color}`);
  }
}

function textContent(element) {
  if (typeof element === "string") return element;
  if (Array.isArray(element)) return element.map(textContent).join(" ");
  return element?.props ? textContent(element.props.children) : "";
}

test("OG renders a 200 PNG with canard corners, local fonts and the two-line French headline", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error("Network forbidden during OG rendering"); };
  try {
    let tree;
    let options;
    const { ImageResponse } = createRequire(import.meta.url)("next/og");
    const route = load("src/app/opengraph-image.tsx", {
      "@/system/token.server": { token },
      "next/og": { ImageResponse: class extends ImageResponse {
        constructor(element, config) { super(element, config); tree = element; options = config; }
      } },
    });
    const response = await route.default();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/png");
    await checkImage(Buffer.from(await response.arrayBuffer()), [1200, 630]);
    assert.doesNotMatch(textContent(tree) + route.alt, /systems|systèmes/i);
    const headline = tree.props.children[1];
    assert.equal(headline.props.children.length, 2);
    assert.equal(headline.props.style.fontWeight, 400);
    assert.equal(headline.props.children[1].props.style.fontWeight, 600);
    assert.equal(textContent(headline), "Nous allons à la frontière du possible, puis nous le livrons à nos clients.");
    assert.equal(route.alt, `Parrit.ai · ${textContent(headline)}`);
    assert.ok(options.fonts.reduce((total, font) => total + font.data.length, 0) < 500_000);
    assert.notEqual(route.runtime, "edge");
  } finally { globalThis.fetch = originalFetch; }
});

test("all icons reproduce byte for byte with canard background, white mark and pink dot", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error("Network forbidden during icon rendering"); };
  try {
    const generated = await generateIcons();
    for (const [name, size] of [["icon.png", 512], ["apple-icon.png", 180], ["favicon.ico", 48]]) {
      const stored = readFileSync(new URL(`../src/app/${name}`, import.meta.url));
      assert.deepEqual(generated.get(name), stored, `${name}: regenerate with node scripts/generate-brand-icons.mjs`);
      if (name.endsWith(".ico")) {
        assert.equal(stored.readUInt16LE(2), 1);
        assert.equal(stored.readUInt16LE(4), 1);
        assert.deepEqual([...stored.subarray(6, 8)], [48, 48]);
        assert.equal(stored.readUInt32LE(14), stored.length - stored.readUInt32LE(18));
        await checkImage(stored.subarray(stored.readUInt32LE(18)), [size, size]);
      } else await checkImage(stored, [size, size]);
    }
  } finally { globalThis.fetch = originalFetch; }
});
