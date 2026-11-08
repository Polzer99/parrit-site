/** Estimated at 200 words/minute, rounded to the nearest minute (minimum one).
 * Count article text and code, excluding Markdown syntax and link destinations.
 */
export function journalReadingMinutes(markdown: string): number {
  const text = markdown
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/^\s*\[[^\]]+\]:\s+\S+.*$/gm, " ")
    .replace(/!?\[([^\]]*)\]\([^\n]*?\)/g, "$1")
    .replace(/!?\[([^\]]*)\]\[[^\]]*\]/g, "$1")
    .replace(/^\s*(?:`{3,}|~{3,}).*$/gm, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#*_`~>|]/g, " ");
  const words = text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  return Math.max(1, Math.round(words / 200));
}
