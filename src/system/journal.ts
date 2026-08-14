import "server-only";

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const JOURNAL_DIRECTORY = path.join(process.cwd(), "content", "journal");
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type JournalEntry = {
  title: string;
  date: string;
  description: string;
  slug: string;
  content: string;
};

export type JournalEntrySummary = Omit<JournalEntry, "content">;

type JournalFrontmatter = Omit<JournalEntry, "content">;

function requireString(
  data: Record<string, unknown>,
  field: keyof JournalFrontmatter,
  filename: string,
): string {
  const value = data[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Journal entry ${filename} has an invalid ${field}.`);
  }

  return value.trim();
}

function parseFrontmatter(filename: string, data: Record<string, unknown>): JournalFrontmatter {
  const frontmatter = {
    title: requireString(data, "title", filename),
    date: requireString(data, "date", filename),
    description: requireString(data, "description", filename),
    slug: requireString(data, "slug", filename),
  };

  if (!ISO_DATE.test(frontmatter.date)) {
    throw new Error(`Journal entry ${filename} must use an ISO date.`);
  }

  if (!SAFE_SLUG.test(frontmatter.slug)) {
    throw new Error(`Journal entry ${filename} has an unsafe slug.`);
  }

  if (`${frontmatter.slug}.mdx` !== filename) {
    throw new Error(`Journal entry ${filename} must match its frontmatter slug.`);
  }

  return frontmatter;
}

function journalFilenames(): string[] {
  if (!fs.existsSync(JOURNAL_DIRECTORY)) {
    return [];
  }

  return fs.readdirSync(JOURNAL_DIRECTORY).filter((filename) => filename.endsWith(".mdx"));
}

function readJournalFile(filename: string): JournalEntry {
  const source = fs.readFileSync(path.join(JOURNAL_DIRECTORY, filename), "utf8");
  const parsed = matter(source);
  const frontmatter = parseFrontmatter(filename, parsed.data);

  return {
    ...frontmatter,
    content: parsed.content.trim(),
  };
}

export function getAllJournalEntries(): JournalEntry[] {
  const entries = journalFilenames().map(readJournalFile);
  const slugs = new Set<string>();

  for (const entry of entries) {
    if (slugs.has(entry.slug)) {
      throw new Error(`Duplicate journal slug: ${entry.slug}.`);
    }
    slugs.add(entry.slug);
  }

  return entries.sort((left, right) => {
    const byDate = right.date.localeCompare(left.date);
    return byDate === 0 ? left.title.localeCompare(right.title, "en") : byDate;
  });
}

export function getAllJournalEntrySummaries(): JournalEntrySummary[] {
  return getAllJournalEntries().map(({ title, date, description, slug }) => ({
    title,
    date,
    description,
    slug,
  }));
}

export function getJournalEntry(slug: string): JournalEntry | undefined {
  if (!SAFE_SLUG.test(slug)) {
    return undefined;
  }

  const filename = `${slug}.mdx`;
  if (!journalFilenames().includes(filename)) {
    return undefined;
  }

  return readJournalFile(filename);
}
