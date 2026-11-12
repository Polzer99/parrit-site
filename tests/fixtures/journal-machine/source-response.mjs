// Frozen synthetic publication metadata, independent of research-model replies.
export function sourceResponse(url, text) {
  const date = new URL(url).hostname.includes('cnil') ? '2026-09-01' : new URL(url).hostname.includes('banque-france') ? '2026-08-01' : '2026-10-01';
  return new Response(`<meta property="article:published_time" content="${date}"><article>${text}</article>`);
}
