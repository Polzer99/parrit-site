import assert from 'node:assert/strict';
import { test, before, after } from 'node:test';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import { syncBuiltinESMExports } from 'node:module';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import sharp from 'sharp';
import { token, renderIcon, pngToIco } from '../scripts/generate-canard-icons.mjs';

const originals = [globalThis.fetch, http.request, http.get, https.request, https.get, net.Socket.prototype.connect];
const attempts = [];
before(() => {
  const deny = () => { attempts.push('Unexpected network request'); throw new Error(attempts.at(-1)); };
  http.request = http.get = https.request = https.get = net.Socket.prototype.connect = deny;
  // Satori loads its bundled WASM through an inline data URL, not the network.
  globalThis.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    if (url.startsWith('data:')) return originals[0](input, init);
    return deny();
  };
  syncBuiltinESMExports();
});
after(() => {
  [globalThis.fetch, http.request, http.get, https.request, https.get, net.Socket.prototype.connect] = originals;
  syncBuiltinESMExports();
  assert.deepEqual(attempts, []);
});

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url));
const rgb = (name) => [...Buffer.from(token(name).slice(1), 'hex')];
async function pixels(buffer, size) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, size[0]);
  assert.equal(info.height, size[1]);
  for (const offset of [0, (info.width - 1) * 4, (info.height - 1) * info.width * 4, data.length - 4]) {
    assert.deepEqual([...data.subarray(offset, offset + 4)], [...rgb('--accent-strong'), 255]);
  }
  for (const name of ['--paper2', '--accent-on-dark']) {
    const color = rgb(name);
    assert.ok(data.some((_, i) => i % 4 === 0 && color.every((v, c) => data[i + c] === v)), `Missing ${name}`);
  }
}

test('OG renders locally: 200, 1200×630, canard corners and brand colors; no obsolete claim', async () => {
  const source = new URL('../src/app/opengraph-image.tsx', import.meta.url);
  const text = readFileSync(source, 'utf8');
  assert.doesNotMatch(text, /systems|systèmes/i);
  assert.doesNotMatch(text, /runtime\s*=\s*["']edge/);
  const compiled = ts.transpileModule(text, { compilerOptions: {
    target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  } }).outputText;
  const compiledModule = { exports: {} };
  const require = createRequire(source);
  new Function('require', 'module', 'exports', compiled)(
    (id) => id === '@/system/token.server' ? { token } : require(id), compiledModule, compiledModule.exports);
  assert.match(compiledModule.exports.alt, /frontière du possible/);
  const response = await compiledModule.exports.default();
  assert.equal(response.status, 200);
  await pixels(Buffer.from(await response.arrayBuffer()), [1200, 630]);
});

for (const [file, size] of [['icon.png', 512], ['apple-icon.png', 180], ['favicon.ico', 48]]) {
  test(`${file}: canard, white, rose, dimensions and reproducible generation`, async () => {
    const stored = read(`src/app/${file}`);
    const png = await renderIcon(size);
    assert.deepEqual(stored, file.endsWith('.ico') ? pngToIco(png, size) : png);
    if (file.endsWith('.ico')) {
      assert.equal(stored.readUInt16LE(2), 1);
      assert.equal(stored.readUInt16LE(4), 1);
      assert.equal(stored[6], size);
      assert.equal(stored.readUInt32LE(14), stored.length - 22);
    }
    await pixels(file.endsWith('.ico') ? stored.subarray(stored.readUInt32LE(18)) : stored, [size, size]);
  });
}
