import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { homedir } from "node:os";
import path from "node:path";

// Explicitly selected originals only. Never fetch a substitute or enlarge a source.
const sourceDirectory = process.argv[2] ?? path.join(homedir(), "Downloads/_Images");
const sources = [
  ["formation-equipes", "Activité de Paul Larmaraud (2).jpeg"],
  ["atelier-outils", "Activité de Paul Larmaraud.jpeg"],
  ["intervention-dirigeants", "Activité de Paul Larmaraud (1).jpeg"],
];
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
// Decode all originals before writing anything; unreadable input is a hard failure.
const originals = await Promise.all(sources.map(async ([id, source]) => {
  const bytes = await readFile(path.join(sourceDirectory, source));
  const { data, info } = await sharp(bytes).rotate().raw().toBuffer({ resolveWithObject: true });
  return { id, source, bytes, data, info };
}));
await mkdir("public/photos/session", { recursive: true });
const manifest = [];
for (const { id, source, bytes, data, info } of originals) {
  const files = [];
  for (const target of [480, 960]) for (const format of ["avif", "webp"]) {
    const width = Math.min(target, info.width);
    // Raw pixels contain no EXIF/GPS, XMP, IPTC or ICC. Width-only resize keeps the whole frame.
    const output = await sharp(data, { raw: info }).resize({ width, withoutEnlargement: true })
      .toFormat(format, { quality: format === "avif" ? 65 : 82 }).toBuffer({ resolveWithObject: true });
    const file = `/photos/session/${id}-${width}.${format}`;
    await writeFile(`public${file}`, output.data);
    files.push({ file, width: output.info.width, height: output.info.height, sha256: hash(output.data) });
  }
  manifest.push({ id, source, sourceWidth: info.width, sourceHeight: info.height, sourceSha256: hash(bytes), files });
}
await writeFile("tests/fixtures/session-photos.json", JSON.stringify(manifest, null, 2) + "\n");
await writeFile("public/photos/session/SOURCES.md", `# Photos de session\n\nIntégration : 08/11/2026. Conversion par \`node scripts/prepare-session-photos.mjs\`.\nCadrages entiers, sans retouche ni agrandissement ; AVIF/WebP, métadonnées retirées.\n\n${manifest.map(p => `- \`${p.id}\` : \`~/Downloads/_Images/${p.source}\` ; photo réelle, choisie par Paul le 08/11/2026 ; intégrée le 08/11/2026. Source ${p.sourceWidth} × ${p.sourceHeight}, SHA256 \`${p.sourceSha256}\`.`).join("\n")}\n\nL'atelier est limité à 800 px, largeur de l'original, pour le grand export.\n`);
console.log(manifest.map(p => ({ id: p.id, exports: p.files.map(f => `${f.width}×${f.height} ${path.extname(f.file)}`) })));
