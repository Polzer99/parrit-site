import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';
import { crc32, readTokens, TONES, INK } from './generate-grain.mjs';

// Deliberately accepts only the generator's lossless, opaque, one-bit PNG format.
export function decodeGrain(png) {
  const fail = () => { throw new Error('Invalid grain PNG (format, checksum or palette)'); };
  if (!png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) fail();
  const chunks = [];
  for (let offset = 8; offset < png.length;) {
    if (offset + 12 > png.length) fail();
    const size = png.readUInt32BE(offset); const end = offset + 8 + size;
    if (end + 4 > png.length) fail();
    const type = png.toString('ascii', offset + 4, offset + 8);
    if (crc32(png.subarray(offset + 4, end)) !== png.readUInt32BE(end)) fail();
    chunks.push({ type, data: png.subarray(offset + 8, end) }); offset = end + 4;
  }
  if (chunks.map(c => c.type).join(',') !== 'IHDR,PLTE,IDAT,IEND') fail();
  const [header, palette, compressed, end] = chunks.map(c => c.data);
  if (header.length !== 13 || header.readUInt32BE(0) !== 256 || header.readUInt32BE(4) !== 256 || !header.subarray(8).equals(Buffer.from([1, 3, 0, 0, 0])) || end.length) fail();
  if (palette.length !== 6 || palette.subarray(0, 3).equals(palette.subarray(3))) fail();
  const raw = inflateSync(compressed, { maxOutputLength: 256 * 33 });
  if (raw.length !== 256 * 33) fail();
  const pixels = [];
  for (let y = 0; y < 256; y++) {
    if (raw[y * 33] !== 0) fail();
    for (let x = 0; x < 256; x++) pixels.push((raw[y * 33 + 1 + (x >> 3)] >> (7 - x % 8)) & 1);
  }
  if (new Set(pixels).size !== 2) fail();
  return { palette, pixels };
}

export async function checkGrain(root = process.cwd()) {
  const css = await readFile(join(root, 'src/system/brand-os.tokens.css'), 'utf8');
  const tokens = readTokens(css);
  const directory = join(root, 'public/matiere');
  const files = (await readdir(directory)).sort();
  const expected = Object.keys(TONES).map(tone => `grain-${tone}.png`).sort();
  if (files.join(',') !== expected.join(',')) throw new Error('Grain directory must contain exactly the two expected PNG tiles');
  for (const [tone, [token, density]] of Object.entries(TONES)) {
    const png = await readFile(join(directory, `grain-${tone}.png`));
    const { palette, pixels } = decodeGrain(png);
    if (!palette.equals(Buffer.concat([tokens.get(token), tokens.get(INK)]))) throw new Error(`Grain ${tone}: colors differ from vendor tokens`);
    if (png.length >= 4096) throw new Error(`Grain ${tone}: exceeds 4 KiB`);
    if (pixels.reduce((sum, pixel) => sum + pixel, 0) !== Math.round(128 * 128 * density) * 4) throw new Error(`Grain ${tone}: wrong density`);
    for (let y = 0; y < 256; y += 2) for (let x = 0; x < 256; x += 2) {
      const i = y * 256 + x;
      if ([i + 1, i + 256, i + 257].some(j => pixels[i] !== pixels[j])) throw new Error(`Grain ${tone}: not 2×2 cells`);
    }
  }
}
