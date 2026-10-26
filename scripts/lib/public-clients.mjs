import { PUBLIC_CLIENT_NAMES, publicClientName } from "../../src/system/public-clients.ts";
import ts from "typescript";

// Known private clients remain checked even outside an explicit client attribution.
const PRIVATE_CLIENT_NAMES = [
  "Lavazza", "Naval Group", "Estée Lauder", "Hiolle",
  "Toyotomi", "Metavisio", "Stratera", "Rydge", "Eficia", "TerraCall", "GESLOT",
];
const allowed = (name) => publicClientName(name) !== undefined;
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function matchingNames(text, names) {
  return names.filter((name) =>
    new RegExp(`(?<![\\p{L}\\p{N}_])${escape(name)}(?![\\p{L}\\p{N}_])`, "iu").test(text));
}

export function privateClientNames(text) {
  return matchingNames(text, PRIVATE_CLIENT_NAMES.filter((name) => !allowed(name)));
}

// The Journal never names clients, including those authorized on institutional pages.
export function journalClientNames(text) {
  return matchingNames(text, [...PRIVATE_CLIENT_NAMES, ...PUBLIC_CLIENT_NAMES]);
}

const propertyName = (node) => node.name && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) ? node.name.text : undefined;
const propertyValue = (object, name) => object.properties.find((node) => ts.isPropertyAssignment(node) && propertyName(node) === name)?.initializer;

// Read only literal client references from DICT; do not execute application code.
export function homeClientReferences(source) {
  const ast = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const references = [];
  function visit(node, inDictionary = false) {
    const inside = inDictionary || (ts.isVariableDeclaration(node) && propertyName(node) === "DICT");
    if (inside && ts.isPropertyAssignment(node) && propertyName(node) === "brands" && ts.isObjectLiteralExpression(node.initializer)) {
      const list = propertyValue(node.initializer, "list");
      const literal = (object, name) => {
        const value = propertyValue(object, name);
        return value && ts.isStringLiteral(value) ? value.text : "";
      };
      references.push({
        locale: propertyName(node.parent.parent),
        kicker: literal(node.initializer, "kicker"),
        note: literal(node.initializer, "note"),
        clients: list && ts.isArrayLiteralExpression(list) ? list.elements.map((item) =>
          ts.isObjectLiteralExpression(item) ? { name: literal(item, "name"), description: literal(item, "description") } : { name: "", description: "" }) : [],
      });
    }
    ts.forEachChild(node, (child) => visit(child, inside));
  }
  visit(ast);
  return references;
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
    if (ts.isPropertyAssignment(property) && propertyName(property) === "name") {
      for (let parent = property.parent; parent; parent = parent.parent) {
        if (ts.isPropertyAssignment(parent) && propertyName(parent) === "brands") {
          candidates.push(text);
          break;
        }
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
