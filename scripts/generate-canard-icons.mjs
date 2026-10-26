/** Run: node scripts/generate-canard-icons.mjs. No network or system fonts.
 * OG Regular/Semibold OTF files are lossless decompressions of public/fonts/rev02:
 * Python fontTools.ttLib.TTFont(source); font.flavor = None; font.save(destination).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import React from 'react';
import { ImageResponse } from 'next/og.js';

// Use the site's strict alias resolver, including its missing-token failures.
const source = new URL('../src/system/token.server.ts', import.meta.url);
const compiled = ts.transpileModule(readFileSync(source, 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText;
const compiledModule = { exports: {} };
new Function('require', 'module', 'exports', compiled)(createRequire(source), compiledModule, compiledModule.exports);
export const { token } = compiledModule.exports;

export async function renderIcon(size) {
  const font = readFileSync(new URL('../src/og-assets/ibm-plex-mono-latin-600-normal.woff', import.meta.url));
  const response = new ImageResponse(React.createElement('div', {
    style: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: token('--accent-strong'), color: token('--paper2'), fontFamily: 'IBM Plex Mono',
      fontWeight: 600, fontSize: size * 0.36 },
  }, '[P', React.createElement('span', { style: { color: token('--accent-on-dark') } }, '.'), ']'), {
    width: size, height: size, fonts: [{ name: 'IBM Plex Mono', data: font, weight: 600, style: 'normal' }],
  });
  return Buffer.from(await response.arrayBuffer());
}

export function pngToIco(png, size) {
  // ICO directory containing one PNG (supported by modern browsers and Windows).
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header[6] = size;
  header[7] = size;
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, png]);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const [file, size] of [['icon.png', 512], ['apple-icon.png', 180], ['favicon.ico', 48]]) {
    const png = await renderIcon(size);
    writeFileSync(new URL(`../src/app/${file}`, import.meta.url), file.endsWith('.ico') ? pngToIco(png, size) : png);
  }
}
