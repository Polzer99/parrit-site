import { readFileSync } from "fs";
import path from "path";
import Link from "next/link";

export const revalidate = 0;
export const dynamic = "force-dynamic";

function loadSnapshot() {
  const p = path.join(process.cwd(), "public", "os-snapshot.json");
  return JSON.parse(readFileSync(p, "utf-8"));
}

export default function TranscriptsPage() {
  const snap = loadSnapshot();
  const transcripts = snap.transcripts_recent || [];
  return (
    <main className="min-h-screen px-6 md:px-12 py-8 md:py-12">
      <nav className="text-sm text-text-dim mb-6">
        <Link href="/os" className="hover:text-text transition">← Retour au dashboard</Link>
      </nav>

      <h1 className="font-heading font-light text-[52px] md:text-[64px] leading-[0.95] tracking-tight text-text mb-2">
        Transcripts
      </h1>
      <p className="text-text-muted mb-10">
        TerraCall · Plaud · Gemini — classification auto (système / prospection / closing / delivery).
      </p>

      <div className="space-y-3">
        {transcripts.map((t: any) => (
          <article key={t.id} className="rounded-3xl bg-white border border-border px-6 py-5">
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <h3 className="font-heading text-xl text-text">
                {t.subject || "(pas de sujet)"}
              </h3>
              <span className="text-xs text-text-dim tabular-nums shrink-0">
                {t.date || "—"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-bg border border-border text-text-muted font-medium">
                {t.source || "?"}
              </span>
              <code className="text-text-dim text-[11px]">{t.id.slice(0, 8)}</code>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 text-sm text-text-dim">
        <p>Ingestion auto (P1) : Gmail webhook → classification auto → Qdrant + SQLite.</p>
      </div>
    </main>
  );
}
