import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const ICONS = [
  "/brand/favicon-32.png",
  "/brand/favicon-180.png",
  "/brand/favicon-192.png",
  "/brand/favicon-512.png",
  "/icon.png",
];

test.use({ serviceWorkers: "block" });

for (const path of ICONS) {
  test(`${path} contains no reddish pixels`, async ({ request, page }) => {
    const url = new URL(path, BASE_URL);
    // API requests bypass browser routing: allow only local HTTP, without redirects.
    expect(["http:", "https:"]).toContain(url.protocol);
    expect(["localhost", "127.0.0.1"]).toContain(url.hostname);
    const response = await request.get(url.href, { maxRedirects: 0 });
    let encoded: string;
    try {
      expect(response.status(), `${path}: expected HTTP 200`).toBe(200);
      expect(response.headers()["content-type"], `${path}: expected PNG`).toMatch(/^image\/png\b/i);
      encoded = (await response.body()).toString("base64");
    } finally {
      await response.dispose();
    }

    // Decode the exact HTTP bytes on the fixture's blank page under its shared deny-all.
    const faultyPixels = await page.evaluate(async (base64) => {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      if (!image.naturalWidth || !image.naturalHeight) throw new Error("Empty image");
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas 2D unavailable");
      context.drawImage(image, 0, 0);
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
      let count = 0;
      for (let offset = 0; offset < data.length; offset += 4) {
        const red = data[offset];
        const green = data[offset + 1];
        const blue = data[offset + 2];
        const alpha = data[offset + 3];
        // Same threshold as scripts/brand-conformity-check.mjs; ignore only alpha 0.
        if (alpha > 0 && red > 90 && red >= 1.8 * green && red >= 1.8 * blue) count++;
      }
      return count;
    }, encoded);

    expect(faultyPixels, `${path}: ${faultyPixels} reddish non-transparent pixels`).toBe(0);
  });
}
