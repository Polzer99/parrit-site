import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { journalReadingMinutes } from "./journal-reading.ts";
import { hasFrenchJournalTranslation } from "./journal-translations.ts";
import type { Locale } from "./locale";

const JOURNAL_DIRECTORY = path.join(process.cwd(), "content", "journal");
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type JournalEntry = {
  title: string;
  date: string;
  description: string;
  slug: string;
  noindex: boolean;
  content: string;
  updatedAt?: string;
  pilier?: string;
  requete?: string;
  author?: string;
  sources?: { label: string; url: string; publisher?: string; published_at?: string }[];
  faq?: { q: string; a: string }[];
};

export type JournalEntrySummary = Omit<JournalEntry, "content"> & { readingMinutes: number };

type JournalFrontmatter = Omit<JournalEntry, "content"> & { draft: boolean };
type JournalFile = JournalEntry & { draft: boolean };

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
  for (const flag of ["draft", "noindex"] as const) {
    if (data[flag] !== undefined && typeof data[flag] !== "boolean") {
      throw new Error(`Journal entry ${filename} has an invalid ${flag} flag.`);
    }
  }

  const frontmatter: JournalFrontmatter = {
    title: requireString(data, "title", filename),
    date: requireString(data, "date", filename),
    description: requireString(data, "description", filename),
    slug: requireString(data, "slug", filename),
    noindex: data.noindex === true,
    draft: data.draft === true,
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

  for (const field of ["updatedAt", "pilier", "requete", "author"] as const) {
    if (data[field] !== undefined) frontmatter[field] = requireString(data, field, filename);
  }
  if (frontmatter.updatedAt !== undefined && (
    !ISO_DATE.test(frontmatter.updatedAt) ||
    Number.isNaN(Date.parse(frontmatter.updatedAt)) ||
    new Date(frontmatter.updatedAt).toISOString().slice(0, 10) !== frontmatter.updatedAt ||
    frontmatter.updatedAt < frontmatter.date
  )) throw new Error(`Journal entry ${filename} has an invalid updatedAt.`);

  for (const field of ["sources", "faq"] as const) {
    const value = data[field];
    if (value === undefined) continue;
    if (!Array.isArray(value)) throw new Error(`Journal entry ${filename} has invalid ${field}.`);
    const pairs = value.map((item: unknown) => {
      const keys = field === "sources" ? ["label", "url"] : ["q", "a"];
      if (!item || typeof item !== "object" || keys.some(key =>
        !(key in item) || typeof (item as Record<string, unknown>)[key] !== "string" ||
        !(item as Record<string, string>)[key].trim()
      )) throw new Error(`Journal entry ${filename} has invalid ${field}.`);
      const record = item as Record<string, string>;
      return keys.map(key => record[key].trim());
    });
    if (field === "sources") {
      frontmatter.sources = pairs.map(([label, url], index) => {
        let parsed: URL;
        try { parsed = new URL(url); } catch { throw new Error(`Journal entry ${filename} has an invalid source URL.`); }
        if (!["https:", "http:"].includes(parsed.protocol) || parsed.username || parsed.password) {
          throw new Error(`Journal entry ${filename} has an invalid source URL.`);
        }
        const item = value[index] as Record<string, unknown>;
        const details: { publisher?: string; published_at?: string } = {};
        for (const key of ["publisher", "published_at"] as const) {
          if (item[key] !== undefined) {
            if (typeof item[key] !== "string" || !item[key].trim()) throw new Error(`Journal entry ${filename} has invalid source ${key}.`);
            details[key] = item[key].trim();
          }
        }
        if (details.published_at && (!ISO_DATE.test(details.published_at) || !Number.isFinite(Date.parse(details.published_at)) || new Date(details.published_at).toISOString().slice(0, 10) !== details.published_at)) throw new Error(`Journal entry ${filename} has invalid source date.`);
        return { label, url, ...details };
      });
    } else frontmatter.faq = pairs.map(([q, a]) => ({ q, a }));
  }

  return frontmatter;
}

function journalFilenames(): string[] {
  if (!fs.existsSync(JOURNAL_DIRECTORY)) {
    return [];
  }

  return fs.readdirSync(JOURNAL_DIRECTORY).filter((filename) => filename.endsWith(".mdx"));
}

function readJournalFile(filename: string, locale: Locale = "en"): JournalFile {
  const source = fs.readFileSync(path.join(JOURNAL_DIRECTORY, locale === "fr" ? "fr" : "", filename), "utf8");
  const parsed = matter(source);
  const frontmatter = parseFrontmatter(filename, parsed.data);
  if (locale === "fr" && parsed.data.translationOf !== frontmatter.slug) {
    throw new Error(`Journal translation ${filename} has an invalid translationOf.`);
  }

  return {
    ...frontmatter,
    content: parsed.content.trim(),
  };
}

// Publication dates are calendar days in UTC, as in RSS pubDate.
function publishedEntry(entry: JournalFile, today: string): JournalEntry | undefined {
  const { draft, ...published } = entry;
  return !draft && published.date <= today ? published : undefined;
}

function localizedEntry(entry: JournalEntry, locale: Locale): JournalEntry {
  if (locale !== "fr" || entry.noindex || !hasFrenchJournalTranslation(entry.slug)) return entry;
  const translated = readJournalFile(`${entry.slug}.mdx`, "fr");
  const { draft, ...localized } = translated;
  if (translated.date !== entry.date || translated.noindex !== entry.noindex || draft) {
    throw new Error(`Journal translation ${entry.slug} has inconsistent publication metadata.`);
  }
  return localized;
}

export function getAllJournalEntries(locale: Locale = "en"): JournalEntry[] {
  const entries = journalFilenames().map(filename => readJournalFile(filename));
  const slugs = new Set<string>();

  for (const entry of entries) {
    if (slugs.has(entry.slug)) {
      throw new Error(`Duplicate journal slug: ${entry.slug}.`);
    }
    slugs.add(entry.slug);
  }

  const today = new Date().toISOString().slice(0, 10);
  return entries.flatMap(entry => {
    const published = publishedEntry(entry, today);
    return published ? [published] : [];
  }).sort((left, right) => {
    const byDate = right.date.localeCompare(left.date);
    return byDate === 0 ? left.title.localeCompare(right.title, "en") : byDate;
  }).map(entry => localizedEntry(entry, locale));
}

export function getAllJournalEntrySummaries(locale: Locale = "en"): JournalEntrySummary[] {
  return getAllJournalEntries(locale).map(({ content, ...summary }) => ({
    ...summary,
    readingMinutes: journalReadingMinutes(content),
  }));
}

export function getJournalEntry(slug: string, locale: Locale = "en"): JournalEntry | undefined {
  if (!SAFE_SLUG.test(slug)) {
    return undefined;
  }

  const filename = `${slug}.mdx`;
  if (!journalFilenames().includes(filename)) {
    return undefined;
  }

  const entry = readJournalFile(filename);
  const published = publishedEntry(entry, new Date().toISOString().slice(0, 10));
  return published ? localizedEntry(published, locale) : undefined;
}
