import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { deflateSync } from 'node:zlib';

export const TONES = { clair: ['--brand-core-off', 0.06], canard: ['--brand-core-canard', 0.10] };
export const INK = '--brand-accessible-ink';

export function readTokens(css) {
  const tokens = new Map();
  for (const name of [INK, ...Object.values(TONES).map(([token]) => token)]) {
    const matches = [...css.matchAll(new RegExp(`${name}\\s*:\\s*([^;{}]+)`, 'g'))];
    if (matches.length !== 1 || !/^#[\da-f]{6}$/i.test(matches[0][1].trim())) {
      throw new Error(`Missing, ambiguous or unreadable Brand OS token: ${name}`);
    }
    tokens.set(name, Buffer.from(matches[0][1].trim().slice(1), 'hex'));
  }
  return tokens;
}

export function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function chunk(type, data) {
  const body = Buffer.concat([Buffer.from(type), data]);
  const length = Buffer.alloc(4); length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

export function makeTile(background, ink, density) {
  if (background.equals(ink)) throw new Error('Grain requires two distinct colors');
  // Uniform sampling without replacement: the nearest whole number of 2×2 cells.
  const cells = Array.from({ length: 256 * 256 }, (_, i) => i);
  let state = 20261026;
  const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 2 ** 32; };
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  const scanlines = Buffer.alloc(512 * 65); // filter 0 + 512 one-bit palette indices
  for (const cell of cells.slice(0, Math.round(cells.length * density))) {
    const x = (cell % 256) * 2; const y = Math.floor(cell / 256) * 2;
    for (let dy = 0; dy < 2; dy++) scanlines[(y + dy) * 65 + 1 + (x >> 3)] |= 3 << (6 - (x % 8));
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(512, 0); header.writeUInt32BE(512, 4); header[8] = 1; header[9] = 3;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header),
    chunk('PLTE', Buffer.concat([background, ink])), chunk('IDAT', deflateSync(scanlines, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ]);
}

export async function generateGrain(root = process.cwd()) {
  const tokens = readTokens(await readFile(join(root, 'src/system/brand-os.tokens.css'), 'utf8'));
  const tiles = Object.entries(TONES).map(([tone, [token, density]]) => [tone, makeTile(tokens.get(token), tokens.get(INK), density)]);
  await mkdir(join(root, 'public/matiere'), { recursive: true });
  for (const [tone, png] of tiles) {
    if (png.length >= 8192) throw new Error(`Grain ${tone} exceeds 8 KiB`);
    await writeFile(join(root, `public/matiere/grain-${tone}.png`), png);
    console.log(`grain-${tone}.png: ${png.length} bytes`);
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await generateGrain();
