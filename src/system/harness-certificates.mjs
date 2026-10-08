import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Validate the exact source bytes, including frontmatter, never rendered HTML.
 * @param {string} slug
 * @param {string} root
 */
export function checkCertificate(slug, root = process.cwd()) {
  if (!SAFE_SLUG.test(slug)) return { valid: false, reason: "Unsafe slug" };
  try {
    const certificate = JSON.parse(readFileSync(join(root, "public/certificates", `${slug}.json`), "utf8"));
    if (certificate?.status !== "CERTIFIED") return { valid: false, reason: "Status must be CERTIFIED" };
    if (certificate.url !== `https://parrit.ai/journal/${slug}`) return { valid: false, reason: "Canonical URL mismatch" };
    const source = readFileSync(join(root, "content/journal", `${slug}.mdx`));
    const hash = createHash("sha256").update(source).digest("hex");
    if (certificate.content_sha256 !== hash) return { valid: false, reason: "Source SHA256 mismatch" };
    return { valid: true, reason: "" };
  } catch (error) {
    return { valid: false, reason: error instanceof Error ? error.message : "Unreadable certificate" };
  }
}

/** @param {string} root */
export function verifyCertificates(root = process.cwd()) {
  let files;
  try {
    files = readdirSync(join(root, "public/certificates"));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
  const errors = [];
  for (const file of files.filter((name) => /\.json$/i.test(name)).sort()) {
    const slug = file.slice(0, -5);
    const result = checkCertificate(slug, root);
    if (!file.endsWith(".json") || !result.valid) errors.push(`${file}: ${result.reason || "Use lowercase .json extension"}`);
  }
  return errors;
}
