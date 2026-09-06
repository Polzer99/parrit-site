import { readFileSync } from "node:fs";
import path from "node:path";

import { getAllJournalEntries } from "@/system/journal";

function plainText(markdown: string): string {
  return markdown
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?(?:ul|ol|li|p|br|div)\b[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/^\s*```[^\n]*$/gm, "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .replace(/^ {0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*[-*_]{3,}\s*$/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function GET() {
  const introduction = readFileSync(path.join(process.cwd(), "public/llms.txt"), "utf8")
    .split(/^## /m)[0].trim();
  const entries = getAllJournalEntries()
    .filter((entry) => !entry.noindex)
    .map((entry) => [
      entry.title,
      entry.date,
      entry.description,
      `https://parrit.ai/journal/${entry.slug}`,
      plainText(entry.content),
    ].join("\n\n"));

  return new Response([plainText(introduction), ...entries].join("\n\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
