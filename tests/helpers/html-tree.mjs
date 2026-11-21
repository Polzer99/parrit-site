// Minimal tree for React's static markup (well formed, no comments except <!-- -->).
// Used by tests/style-site.test.mjs to read the visible text by role.
import { visibleText } from "../../scripts/brand-os-contracts.mjs";
const VOID = new Set(["br", "img", "input", "meta", "link", "hr", "source", "wbr", "area", "base", "col", "embed", "track", "path", "circle", "rect", "line", "polyline", "stop", "use"]);
export function parseHtml(html) {
  const root = { tag: "#root", attrs: {}, children: [], parent: null };
  let current = root;
  const clean = html.replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
  const token = /<(\/?)([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>|([^<]+)/g;
  for (const match of clean.matchAll(token)) {
    const [, closing, tag, rawAttrs, selfClosing, text] = match;
    if (text !== undefined) { current.children.push({ tag: "#text", text, parent: current }); continue; }
    const name = tag.toLowerCase();
    if (closing) {
      let node = current;
      while (node && node.tag !== name) node = node.parent;
      if (node?.parent) current = node.parent;
      continue;
    }
    const attrs = {};
    for (const attr of rawAttrs.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)) attrs[attr[1]] = attr[2] ?? "";
    const node = { tag: name, attrs, children: [], parent: current };
    current.children.push(node);
    if (!selfClosing && !VOID.has(name)) current = node;
  }
  return root;
}
export function* walk(node) { yield node; for (const child of node.children ?? []) yield* walk(child); }
const decode = text => visibleText(text).replace(/\s+/g, " ").trim();
export function textOf(node) {
  if (node.tag === "#text") return node.text;
  return (node.children ?? []).map(textOf).join("");
}
// Text as a reader sees it: no aria-hidden copy, no hidden attribute, no svg.
export function readable(node) {
  if (node.tag === "#text") return node.text;
  if (node.attrs?.["aria-hidden"] === "true" || "hidden" in (node.attrs ?? {}) || ["svg", "option", "select"].includes(node.tag)) return "";
  return (node.children ?? []).map(readable).join(node.tag === "br" ? " " : "");
}
export const clean = node => decode(readable(node));
export function hiddenFrom(node) {
  for (let n = node; n; n = n.parent) if (n.attrs?.["aria-hidden"] === "true" || "hidden" in (n.attrs ?? {})) return true;
  return false;
}
export function ancestors(node) { const list = []; for (let n = node.parent; n; n = n.parent) list.push(n); return list; }
export const cls = node => (node.attrs?.class ?? "").split(/\s+/).filter(Boolean);
