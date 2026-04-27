"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Signal = {
  id: string;
  source: string;
  detail_preview: string;
  confidence: number | null;
  detected_at: string;
  actioned_at: string | null;
};

export default function SignalsClient({
  signals: initial,
  touchpoints_7d,
}: {
  signals: Signal[];
  touchpoints_7d: Array<{ channel: string; n: number }>;
}) {
  const [signals, setSignals] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);

  const pushCard = async (id: string) => {
    setBusyId(id);
    try {
      const r = await fetch("/api/os/signal-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signal_id: id }),
      });
      if (r.ok) {
        setSignals((s) =>
          s.map((x) =>
            x.id === id ? { ...x, actioned_at: new Date().toISOString() } : x,
          ),
        );
      }
    } finally {
      setBusyId(null);
    }
  };

  const skip = async (id: string) => {
    setBusyId(id);
    try {
      const r = await fetch("/api/os/signal-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signal_id: id, outcome: "skipped" }),
      });
      if (r.ok) setSignals((s) => s.filter((x) => x.id !== id));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="min-h-screen px-6 md:px-12 py-8 md:py-12">
      <nav className="text-sm text-text-dim mb-6">
        <Link href="/os" className="hover:text-text transition">
          ← Retour au dashboard
        </Link>
      </nav>

      <motion.h1
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-heading font-light text-[52px] md:text-[64px] leading-[0.95] tracking-tight text-text mb-2"
      >
        Signaux
      </motion.h1>
      <p className="text-text-muted mb-10">
        Non actionnés — push carte Telegram avec angle Opus 4.7, ou skip.
      </p>

      <section className="mb-12">
        <h2 className="font-heading text-2xl mb-4 text-text">À qualifier</h2>
        <div className="space-y-3">
          {signals.filter((s) => !s.actioned_at).length === 0 && (
            <p className="text-text-dim italic">
              Aucun signal non actionné. Tout est à jour.
            </p>
          )}
          {signals
            .filter((s) => !s.actioned_at)
            .map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.04 * i }}
                className="rounded-3xl bg-white border border-border px-6 py-5"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-bg border border-border text-text-muted font-medium">
                      {s.source}
                    </span>
                    {s.confidence != null && (
                      <span className="text-text-dim">confiance {s.confidence}</span>
                    )}
                    <span className="text-text-dim tabular-nums">
                      {(s.detected_at || "").slice(0, 16).replace("T", " ")}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-text leading-relaxed mb-4">
                  {s.detail_preview}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => pushCard(s.id)}
                    disabled={busyId === s.id}
                    className="text-xs rounded-full bg-text text-bg px-4 py-2 hover:bg-bg-dark transition disabled:opacity-60"
                  >
                    {busyId === s.id ? "…" : "📱 Pousser sur Telegram"}
                  </button>
                  <button
                    onClick={() => skip(s.id)}
                    disabled={busyId === s.id}
                    className="text-xs rounded-full bg-white text-text-muted border border-border px-4 py-2 hover:border-text-muted transition disabled:opacity-60"
                  >
                    Skip
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-2xl mb-4 text-text">Activité 7 jours</h2>
        <div className="space-y-2">
          {touchpoints_7d.map((t) => {
            const max = Math.max(...touchpoints_7d.map((x) => x.n), 1);
            const pct = (t.n / max) * 100;
            return (
              <div
                key={t.channel}
                className="bg-white rounded-2xl border border-border px-5 py-3.5"
              >
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <span className="font-medium text-text">{t.channel}</span>
                  <span className="tabular-nums text-text-muted">{t.n}</span>
                </div>
                <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-accent rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
