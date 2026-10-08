import ts from "typescript";

// Sentence-level exception: a disclaimer on a neighbouring sentence is insufficient.
export function certificationClaims(text, allowBadge = false) {
  const normalized = text.replace(/\r?\n\s*/g, " ");
  const checked = allowBadge ? normalized.replaceAll("Harness Certified ✓", "Harness check") : normalized;
  return checked.split(/[.!?](?:\s|$)/u).filter((sentence) =>
    /(?<![\p{L}\p{N}_])(?:certified|certifications?|certifié[es]*)(?![\p{L}\p{N}_])/iu.test(sentence) &&
    !/\bnot an accreditation\b|\bpas une accréditation\b/iu.test(sentence),
  );
}

export function sourceProse(source, filename) {
  const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true,
    filename.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const values = [];
  function visit(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isJsxText(node)) {
      values.push({ text: node.text, line: ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1 });
    } else if (ts.isTemplateExpression(node)) {
      values.push({ text: [node.head.text, ...node.templateSpans.map((span) => span.literal.text)].join(" "), line: ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1 });
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  return values;
}
