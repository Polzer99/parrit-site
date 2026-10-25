import { PUBLIC_CLIENT_NAMES } from "../../src/system/public-clients.ts";
import ts from "typescript";

// Known private clients remain checked even outside an explicit client attribution.
const KNOWN_CLIENT_NAMES = [
  "Joone", "Clevery", "Lavazza", "Naval Group", "Estée Lauder", "Hiolle",
  "Toyotomi", "Metavisio", "Stratera", "Rydge", "Eficia", "TerraCall", "SNCF",
  "GESLOT", ...PUBLIC_CLIENT_NAMES,
];
const allowed = (name) => PUBLIC_CLIENT_NAMES.some((value) => value.toLowerCase() === name.toLowerCase());
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function privateClientNames(text) {
  return KNOWN_CLIENT_NAMES.filter((name) => !allowed(name) &&
    new RegExp(`(?<![\\p{L}\\p{N}_])${escape(name)}(?![\\p{L}\\p{N}_])`, "iu").test(text));
}

// Check the literal DICT, never execute the page. Unknown names are also rejected
// in the client list and explicit Chez/At attributions, not just known clients.
export function homeClientViolations(source) {
  const violations = [];
  const ast = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function visit(node, inDictionary = false) {
    const inside = inDictionary || (ts.isVariableDeclaration(node) && node.name.getText(ast) === "DICT");
    if (!inside || !ts.isStringLiteral(node)) {
      ts.forEachChild(node, (child) => visit(child, inside));
      return;
    }
    const text = node.text;
    const line = ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1;
    const candidates = [...privateClientNames(text)];
    const property = node.parent;
    const isClientList = ts.isPropertyAssignment(property) && property.name.getText(ast) === "list" &&
      ts.isPropertyAssignment(property.parent.parent) && property.parent.parent.name.getText(ast) === "brands";
    if (isClientList) {
      for (const item of text.split(" · ")) {
        if (!/^(?:un|une|a|an)\s/iu.test(item)) candidates.push(item.split(",")[0].trim());
      }
    }
    for (const match of text.matchAll(/\b(?:Chez|At)\s+([^,.!?]+),/gu)) candidates.push(match[1].trim());
    for (const name of new Set(candidates)) {
      if (!allowed(name)) violations.push({ line, name });
    }
  }
  visit(ast);
  return violations;
}
