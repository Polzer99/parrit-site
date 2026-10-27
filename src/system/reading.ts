/** Whitespace-delimited words; apostrophes and hyphens stay within a word. */
export function readingMs(text: string): number {
  const words = text.trim().match(/\S+/gu)?.length ?? 0;
  return Math.max(3_000, 1_200 + 300 * words);
}
