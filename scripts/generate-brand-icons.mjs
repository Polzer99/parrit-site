// Run from the repository root: node scripts/generate-brand-icons.mjs
// Uses the same local font and token resolver as the OG route; no network.
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { createElement as h } from "react";
import nextOg from "next/og.js";
import ts from "typescript";

const { ImageResponse } = nextOg;

const resolverUrl = new URL("../src/system/token.server.ts", import.meta.url);
const compiled = ts.transpileModule(await readFile(resolverUrl, "utf8"), {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText;
const resolver = { exports: {} };
new Function("require", "module", "exports", compiled)(createRequire(resolverUrl), resolver, resolver.exports);
const { token } = resolver.exports;

export async function generateIcons() {
  const font = await readFile(new URL("../src/og-assets/ibm-plex-mono-latin-600-normal.woff", import.meta.url));
  const files = new Map();
  for (const [name, size] of [["icon.png", 512], ["apple-icon.png", 180], ["favicon.ico", 48]]) {
    const response = new ImageResponse(h("div", {
      style: {
        display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center",
        background: token("--accent-strong"), color: token("--paper2"),
        fontFamily: "IBM Plex Mono", fontWeight: 600, fontSize: size * 0.34,
      },
    }, "[P", h("span", { style: { color: token("--accent-on-dark") } }, "."), "]"), {
      width: size, height: size,
      fonts: [{ name: "IBM Plex Mono", data: font, weight: 600, style: "normal" }],
    });
    const png = Buffer.from(await response.arrayBuffer());
    if (name.endsWith(".ico")) {
      // ICO directory with a single PNG payload (48 × 48, RGBA).
      const header = Buffer.alloc(22);
      header.writeUInt16LE(1, 2);
      header.writeUInt16LE(1, 4);
      header[6] = size;
      header[7] = size;
      header.writeUInt16LE(1, 10);
      header.writeUInt16LE(32, 12);
      header.writeUInt32LE(png.length, 14);
      header.writeUInt32LE(header.length, 18);
      files.set(name, Buffer.concat([header, png]));
    } else files.set(name, png);
  }
  return files;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const [name, bytes] of await generateIcons()) {
    await writeFile(new URL(`../src/app/${name}`, import.meta.url), bytes);
  }
}
