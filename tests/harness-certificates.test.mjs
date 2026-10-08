import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { checkCertificate, verifyCertificates } from "../src/system/harness-certificates.mjs";
import { certificationClaims, sourceProse } from "../scripts/lib/certification-claims.mjs";

const component = new URL("../src/system/components/HarnessBadge.tsx", import.meta.url);
const compiled = ts.transpileModule(readFileSync(component, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const require = createRequire(component);

function fixture(run) {
  const root = mkdtempSync(join(tmpdir(), "parrit-certificate-"));
  mkdirSync(join(root, "public/certificates"), { recursive: true });
  mkdirSync(join(root, "content/journal"), { recursive: true });
  const source = "---\nslug: example\ntitle: Example\n---\nExact source.\n";
  writeFileSync(join(root, "content/journal/example.mdx"), source);
  const certificate = { status: "CERTIFIED", url: "https://parrit.ai/journal/example", content_sha256: createHash("sha256").update(source).digest("hex") };
  const save = (value) => writeFileSync(join(root, "public/certificates/example.json"), JSON.stringify(value));
  const mod = { exports: {} };
  new Function("require", "module", "exports", compiled)((name) => {
    if (name === "server-only") return {};
    if (name === "../harness-certificates.mjs") return { checkCertificate: (slug) => checkCertificate(slug, root) };
    return require(name);
  }, mod, mod.exports);
  const render = (locale = "en", slug = "example") => renderToStaticMarkup(createElement(mod.exports.HarnessBadge, { slug, locale }));
  try { run({ root, source, certificate, save, render }); } finally { rmSync(root, { recursive: true, force: true }); }
}

test("valid source certificate renders the real badge, disclaimer and local proof in both languages", () => fixture(({ root, certificate, save, render }) => {
  save(certificate);
  assert.deepEqual(verifyCertificates(root), []);
  for (const [locale, disclaimer, link] of [["en", "Parrit internal check, not an accreditation.", "See the proof"], ["fr", "Contrôle interne Parrit, pas une accréditation.", "Voir la preuve"]]) {
    const html = render(locale);
    for (const text of ["Harness Certified ✓", disclaimer, link, 'href="/certificates/example.json"']) assert.ok(html.includes(text));
  }
}));

test("absent, NOT_CERTIFIED, malformed, mismatched and unsafe certificates never render a badge", () => fixture(({ root, certificate, save, render }) => {
  assert.equal(render(), "");
  assert.deepEqual(verifyCertificates(root), []);
  for (const mutation of [{ status: "NOT_CERTIFIED" }, { url: "https://parrit.ai/fr/journal/example" }, { url: "https://evil.example/journal/example" }, { content_sha256: "0".repeat(64) }]) {
    save({ ...certificate, ...mutation });
    assert.equal(render(), "");
    assert.equal(verifyCertificates(root).length, 1);
  }
  writeFileSync(join(root, "public/certificates/example.json"), "{");
  assert.equal(render(), "");
  assert.equal(render("en", "../example"), "");
}));

test("source byte changes including frontmatter invalidate the certificate", () => fixture(({ root, certificate, source, save }) => {
  save(certificate);
  writeFileSync(join(root, "content/journal/example.mdx"), source.replace("title: Example", "title: Changed"));
  assert.match(verifyCertificates(root)[0], /SHA256/);
}));

test("npm build lifecycle fails before compilation for a stale hash", () => fixture(({ root, certificate, save }) => {
  save({ ...certificate, content_sha256: "0".repeat(64) });
  const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.match(packageJson.scripts.prebuild, /^node scripts\/verify-certificates.mjs && /);
  mkdirSync(join(root, "scripts"));
  writeFileSync(join(root, "scripts/verify-certificates.mjs"), `import ${JSON.stringify(new URL("../scripts/verify-certificates.mjs", import.meta.url).href)};`);
  writeFileSync(join(root, "package.json"), JSON.stringify({ scripts: { prebuild: packageJson.scripts.prebuild, build: "node -e \"console.log('COMPILATION_REACHED')\"" } }));
  const result = spawnSync("npm", ["run", "build"], { cwd: root, encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Source SHA256 mismatch/);
  assert.doesNotMatch(result.stdout, /COMPILATION_REACHED/);
}));

test("certification wording requires its own sentence disclaimer or exact badge", () => {
  for (const text of ["certifié", "certifiée", "certifiés", "certification", "Certified delivery", "Certified. This is not an accreditation.", "Harness Certified ✓ extra certified"]) assert.ok(certificationClaims(text).length, text);
  assert.deepEqual(certificationClaims("Certified, not an accreditation."), []);
  assert.deepEqual(certificationClaims("Certifié, pas une accréditation."), []);
  assert.deepEqual(certificationClaims("Harness Certified ✓", true), []);
  assert.ok(certificationClaims("Harness Certified ✓").length);
  assert.ok(certificationClaims("Harness Certified ✓ and certified delivery", true).length);
});

test("source extraction isolates dictionary entries from comments and unrelated disclaimers", () => {
  const source = `// The client's copy\nconst title = "Certified delivery";\nconst note = "not an accreditation";\n// The client's footer\nconst el = <strong>certifiée</strong>;`;
  const violations = sourceProse(source, "sample.tsx").flatMap(({ text }) => certificationClaims(text));
  assert.deepEqual(violations, ["Certified delivery", "certifiée"]);
});
