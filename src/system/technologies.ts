/** Public tools in the order approved in BANDEAU-TECHNOLOGIES.md, 27/10/2026.
 * A null logo renders the square marker; names are never inferred from filenames.
 */
export type Technology = { readonly name: string; readonly logo: string | null };

export const TECHNOLOGIES: readonly Technology[] = [
  { name: "Claude", logo: "claude" },
  { name: "ChatGPT", logo: "openai" },
  { name: "Gemini", logo: "gemini" },
  { name: "Mistral", logo: "mistral" },
  { name: "Llama", logo: "meta" },
  { name: "Qwen", logo: "qwen" },
  { name: "DeepSeek", logo: "deepseek" },
  { name: "Kimi", logo: "kimi" },
  { name: "MiniMax", logo: "minimax" },
  { name: "GLM", logo: "zhipu" },
  { name: "Grok", logo: "grok" },
  { name: "Hermes", logo: "nousresearch" },
  { name: "Cohere", logo: "cohere" },
  { name: "Perplexity", logo: "perplexity" },
  { name: "Gemma", logo: "gemma" },
  { name: "Copilot", logo: "copilot" },
  { name: "Instinct", logo: null },
  { name: "Claude Code", logo: "claude" },
  { name: "Codex", logo: "openai" },
  { name: "MCP", logo: "mcp" },
  { name: "OpenRouter", logo: "openrouter" },
  { name: "n8n", logo: "n8n" },
  { name: "Python", logo: "python" },
  { name: "FastAPI", logo: "fastapi" },
  { name: "Next.js", logo: "nextdotjs" },
  { name: "Supabase", logo: "supabase" },
  { name: "PostgreSQL", logo: "postgresql" },
  { name: "Docker", logo: "docker" },
  { name: "Playwright", logo: null },
  { name: "OVH", logo: "ovh" },
  { name: "Vercel", logo: "vercel" },
  { name: "Cloudflare", logo: "cloudflare" },
  { name: "GitHub", logo: "github" },
  { name: "Google", logo: "google" },
  { name: "Microsoft", logo: "microsoft" },
  { name: "WhatsApp", logo: "whatsapp" },
  { name: "Telegram", logo: "telegram" },
  { name: "Wispr Flow", logo: null },
  { name: "Plaud", logo: null },
  { name: "Phantombuster", logo: null },
  { name: "Lemlist", logo: null },
];

// Public selection, decision by Paul on 02/11/2026. Keep the full registry above.
const PUBLIC_TECHNOLOGY_NAMES = ["ChatGPT", "Claude", "Gemini", "Mistral", "Copilot", "Google", "Microsoft", "WhatsApp", "Telegram", "OVH"] as const;
export const PUBLIC_TECHNOLOGIES = PUBLIC_TECHNOLOGY_NAMES.map(name => {
  const technology = TECHNOLOGIES.find(item => item.name === name);
  if (!technology) throw new Error(`Unknown public technology: ${name}`);
  return technology;
});
