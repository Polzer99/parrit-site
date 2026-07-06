import "server-only";

import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const LAUNCH_CATEGORIES = [
  "CRM",
  "Sales",
  "RH",
  "Support",
  "Finance",
  "Marketing",
  "Ops",
] as const;

export type LaunchCategory = (typeof LAUNCH_CATEGORIES)[number];

export type LaunchResource = {
  label: string;
  href: string;
};

export type Launch = {
  num: number;
  slug: string;
  title: string;
  date: string;
  category: LaunchCategory;
  sector: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  stack: string[];
  devDuration: string;
  summary: string;
  cover?: string;
  resource?: LaunchResource;
  draft: boolean;
  content: string;
};

export type LaunchSitemapEntry = {
  slug: string;
  lastModified: string;
};

const launchesDirectory = path.join(process.cwd(), "content", "launches");

type LaunchFrontmatter = {
  num?: unknown;
  slug?: unknown;
  title?: unknown;
  date?: unknown;
  category?: unknown;
  sector?: unknown;
  difficulty?: unknown;
  stack?: unknown;
  devDuration?: unknown;
  summary?: unknown;
  cover?: unknown;
  resource?: unknown;
  draft?: unknown;
};

function assertString(value: unknown, field: string, file: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid launch frontmatter "${field}" in ${file}`);
  }
  return value;
}

function assertNumber(value: unknown, field: string, file: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid launch frontmatter "${field}" in ${file}`);
  }
  return value;
}

function assertCategory(
  value: unknown,
  file: string,
): LaunchCategory {
  const category = assertString(value, "category", file);
  if (!LAUNCH_CATEGORIES.includes(category as LaunchCategory)) {
    throw new Error(`Invalid launch category "${category}" in ${file}`);
  }
  return category as LaunchCategory;
}

function assertDifficulty(value: unknown, file: string): 1 | 2 | 3 | 4 | 5 {
  const difficulty = assertNumber(value, "difficulty", file);
  if (![1, 2, 3, 4, 5].includes(difficulty)) {
    throw new Error(`Invalid launch difficulty "${difficulty}" in ${file}`);
  }
  return difficulty as 1 | 2 | 3 | 4 | 5;
}

function normalizeStack(value: unknown, file: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Invalid launch frontmatter "stack" in ${file}`);
  }
  return value;
}

function normalizeResource(
  value: unknown,
  file: string,
): LaunchResource | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Invalid launch frontmatter "resource" in ${file}`);
  }

  const resource = value as Record<string, unknown>;
  return {
    label: assertString(resource.label, "resource.label", file),
    href: assertString(resource.href, "resource.href", file),
  };
}

function readLaunchFile(fileName: string): Launch {
  const fullPath = path.join(launchesDirectory, fileName);
  const file = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(file);
  const frontmatter = data as LaunchFrontmatter;

  return {
    num: assertNumber(frontmatter.num, "num", fileName),
    slug: assertString(frontmatter.slug, "slug", fileName),
    title: assertString(frontmatter.title, "title", fileName),
    date: assertString(frontmatter.date, "date", fileName),
    category: assertCategory(frontmatter.category, fileName),
    sector: assertString(frontmatter.sector, "sector", fileName),
    difficulty: assertDifficulty(frontmatter.difficulty, fileName),
    stack: normalizeStack(frontmatter.stack, fileName),
    devDuration: assertString(frontmatter.devDuration, "devDuration", fileName),
    summary: assertString(frontmatter.summary, "summary", fileName),
    cover:
      typeof frontmatter.cover === "string" && frontmatter.cover.length > 0
        ? frontmatter.cover
        : undefined,
    resource: normalizeResource(frontmatter.resource, fileName),
    draft: frontmatter.draft === true,
    content,
  };
}

function readLaunches(): Launch[] {
  if (!fs.existsSync(launchesDirectory)) return [];

  return fs
    .readdirSync(launchesDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(readLaunchFile);
}

export function getAllLaunches(): Launch[] {
  return readLaunches()
    .filter((launch) => !launch.draft)
    .sort((a, b) => b.num - a.num);
}

export function getLaunchBySlug(slug: string): Launch | undefined {
  return getAllLaunches().find((launch) => launch.slug === slug);
}

export function getCategories(): LaunchCategory[] {
  return [...LAUNCH_CATEGORIES];
}

export function getAllLaunchSitemapEntries(): LaunchSitemapEntry[] {
  return getAllLaunches().map((launch) => ({
    slug: launch.slug,
    lastModified: launch.date,
  }));
}
