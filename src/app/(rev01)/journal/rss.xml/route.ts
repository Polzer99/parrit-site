import { getAllJournalEntries } from "@/system/journal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://parrit.ai";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const items = getAllJournalEntries()
    .filter((entry) => !entry.noindex)
    .map(
      (entry) => `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${SITE_URL}/journal/${entry.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/journal/${entry.slug}</guid>
      <pubDate>${new Date(`${entry.date}T00:00:00.000Z`).toUTCString()}</pubDate>
      <description>${escapeXml(entry.description)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Parrit Journal</title>
    <link>${SITE_URL}/journal</link>
    <description>Field notes on building and operating company systems.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
