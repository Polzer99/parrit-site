export type JournalMarkdownBlock =
  | { kind: "markdown"; text: string }
  | { kind: "table"; headings: string[]; rows: string[][] };

// The machine emits a deliberately small table dialect, avoiding a new parser
// dependency: outer pipes, a separator row, no embedded or escaped pipes.
export function journalMarkdownBlocks(content: string): JournalMarkdownBlock[] {
  const lines = content.split("\n");
  const blocks: JournalMarkdownBlock[] = [];
  let text: string[] = [];
  let fence: { marker: string; length: number } | undefined;
  const row = (line: string) => line.trim().startsWith("|") && line.trim().endsWith("|");
  const cells = (line: string) => line.trim().slice(1, -1).split("|").map(cell => cell.trim());
  const embeddedPipe = (line: string) => line.includes("\\|") || /`[^`\n]*\|[^`\n]*`/.test(line);
  const flush = () => {
    if (text.length) blocks.push({ kind: "markdown", text: text.join("\n") });
    text = [];
  };
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const delimiter = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
    if (delimiter) {
      if (!fence) fence = { marker: delimiter[1][0], length: delimiter[1].length };
      else if (delimiter[1][0] === fence.marker && delimiter[1].length >= fence.length && !delimiter[2].trim()) fence = undefined;
      text.push(line);
      continue;
    }
    const separator = lines[index + 1] ?? "";
    if (fence || !row(line) || !row(separator) || !cells(separator).every(cell => /^:?-{3,}:?$/.test(cell))) {
      text.push(line);
      continue;
    }
    flush();
    const headings = cells(line);
    if (embeddedPipe(line) || headings.length !== cells(separator).length || headings.some(heading => !heading)) {
      throw new Error("Unsupported Journal table header.");
    }
    index += 2;
    const rows: string[][] = [];
    for (; index < lines.length && row(lines[index]); index++) {
      const columns = cells(lines[index]);
      if (embeddedPipe(lines[index]) || columns.length !== headings.length) throw new Error("Unsupported Journal table row.");
      rows.push(columns);
    }
    if (!rows.length) throw new Error("Journal table requires a data row.");
    blocks.push({ kind: "table", headings, rows });
    index--;
  }
  flush();
  return blocks;
}
