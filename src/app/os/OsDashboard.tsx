"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Snapshot = React.ComponentProps<typeof _Dummy>["snapshot"];
function _Dummy(_: { snapshot: any }) { return null; }

const eur = (n: number) => new Intl.NumberFormat("fr-FR", {
  style: "currency", currency: "EUR", maximumFractionDigits: 0,
}).format(n);

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Bonjour" : h < 18 ? "Bon après-midi" : "Bonsoir";
};

export default function OsDashboard({ snapshot }: { snapshot: any }) {
  const [refreshing, setRefreshing] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const refresh = async () => {
    setRefreshing(true);
    setFlash(null);
    try {
      const res = await fetch("/api/os/refresh", { method: "POST" });
      if (res.ok) {
        setFlash("✓ Rafraîchi");
        setTimeout(() => window.location.reload(), 600);
      } else {
        setFlash("✗ Échec refresh");
      }
    } catch {
      setFlash("✗ Erreur réseau");
    } finally {
      setRefreshing(false);
    }
  };

  const generated = new Date(snapshot.generated_at);
  const kpis = snapshot.kpis;
  const rdvProgress = Math.min(100, (kpis.rdv_today / kpis.rdv_goal) * 100);

  return (
    <main className="min-h-screen px-6 md:px-12 py-8 md:py-12">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between mb-10"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-text-dim mb-2">
            {snapshot.workspace.name} · Parrit OS
          </p>
          <h1 className="font-heading font-light text-[52px] md:text-[72px] leading-[0.95] tracking-tight text-text">
            {greeting()}, Paul.
          </h1>
          <p className="mt-3 text-text-muted text-sm md:text-base">
            Mis à jour {generated.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {flash && (
            <span className="text-xs text-accent">{flash}</span>
          )}
          <Link
            href="/os/signals"
            className="text-sm text-text-muted hover:text-text transition"
          >
            Signaux →
          </Link>
          <Link
            href="/os/prospects"
            className="text-sm text-text-muted hover:text-text transition"
          >
            Prospects →
          </Link>
          <Link
            href="/os/transcripts"
            className="text-sm text-text-muted hover:text-text transition"
          >
            Transcripts →
          </Link>
          <Link
            href="/os/content"
            className="text-sm text-text-muted hover:text-text transition"
          >
            Content →
          </Link>
          <Link
            href="/os/deals"
            className="text-sm text-text-muted hover:text-text transition"
          >
            Deals →
          </Link>
          <button
            onClick={refresh}
            disabled={refreshing}
            className="rounded-full bg-bg-dark text-text-light px-5 py-2.5 text-sm font-medium hover:bg-black transition disabled:opacity-60"
          >
            {refreshing ? "…" : "Rafraîchir"}
          </button>
        </div>
      </motion.header>

      {/* KPI strip */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >
        <KpiCard label="RDV aujourd'hui" value={`${kpis.rdv_today} / ${kpis.rdv_goal}`} progress={rdvProgress} accent />
        <KpiCard label="Pipe actif" value={eur(kpis.pipe_eur)} />
        <KpiCard label="Prospects" value={kpis.prospects.toString()} />
        <KpiCard label="Touchpoints" value={kpis.touchpoints.toString()} />
      </motion.section>

      {/* Go-to-Market horizontal */}
      <section className="mb-14">
        <SectionTitle title="Go-to-Market" sub="Campagnes actives — engagement & conversion" />
        <div className="space-y-3">
          {snapshot.campaigns.map((c: any, i: number) => (
            <CampaignRow key={c.campaign} c={c} delay={0.05 * i} />
          ))}
        </div>
      </section>

      {/* Top prospects + Signaux */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
        <div>
          <SectionTitle title="Top prospects" sub="À actionner cette semaine" />
          <div className="space-y-2.5">
            {snapshot.top_prospects.map((p: any, i: number) => (
              <ProspectRow key={p.slug} p={p} delay={0.04 * i} />
            ))}
          </div>
        </div>
        <div>
          <SectionTitle title="Signaux" sub="Non actionnés, triés par fraîcheur" />
          <div className="space-y-2.5">
            {snapshot.signals.slice(0, 6).map((s: any, i: number) => (
              <SignalRow key={s.id} s={s} delay={0.04 * i} />
            ))}
            {snapshot.signals.length === 0 && (
              <p className="text-sm text-text-dim italic">Aucun signal non actionné</p>
            )}
          </div>
        </div>
      </section>

      {/* Transcripts récents + Canaux 7j */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <SectionTitle title="Transcripts récents" />
          <div className="space-y-2">
            {snapshot.transcripts_recent.map((t: any, i: number) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.03 * i }}
                className="rounded-2xl bg-white border border-border px-5 py-3.5 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-text-dim text-xs font-medium tabular-nums">
                    {t.date || "—"}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-bg border border-border text-text-muted">
                    {t.source || "?"}
                  </span>
                  <span className="text-text truncate">{t.subject || "(pas de sujet)"}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle title="Activité 7 jours" sub="Touchpoints par canal" />
          <div className="space-y-2">
            {snapshot.touchpoints_7d.map((t: any) => {
              const max = Math.max(...snapshot.touchpoints_7d.map((x: any) => x.n));
              const pct = (t.n / max) * 100;
              return (
                <div key={t.channel} className="bg-white rounded-2xl border border-border px-5 py-3.5">
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
        </div>
      </section>

      <footer className="mt-20 pt-8 border-t border-border text-xs text-text-dim">
        SQLite local · {snapshot.campaigns.length} campagnes · {snapshot.top_prospects.length} top prospects · {snapshot.signals.length} signaux
      </footer>
    </main>
  );
}

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-heading text-[28px] md:text-[32px] font-light tracking-tight text-text">
        {title}
      </h2>
      {sub && <p className="text-text-muted text-sm mt-0.5">{sub}</p>}
    </div>
  );
}

function KpiCard({
  label, value, progress, accent,
}: { label: string; value: string; progress?: number; accent?: boolean }) {
  return (
    <div className="rounded-3xl bg-white border border-border px-6 py-5">
      <p className="text-[11px] uppercase tracking-[0.15em] text-text-dim font-medium mb-1.5">
        {label}
      </p>
      <p className="font-heading text-4xl md:text-5xl tracking-tight text-text tabular-nums">
        {value}
      </p>
      {progress !== undefined && (
        <div className="mt-3 h-1 bg-bg rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className={`h-full ${accent ? "bg-accent" : "bg-text"} rounded-full`}
          />
        </div>
      )}
    </div>
  );
}

function CampaignRow({ c, delay }: { c: any; delay: number }) {
  const segments = [
    { label: "RDV", n: c.rdv, color: "#5FAF8E" },
    { label: "Devis", n: c.devis, color: "#C8956C" },
    { label: "Accord", n: c.accord, color: "#8B6F47" },
    { label: "Deal", n: c.deals, color: "#2A2420" },
    { label: "No", n: c.no, color: "#A09488" },
    { label: "Pending", n: c.pending, color: "#E3D5BF" },
  ];
  const total = c.total || 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-3xl bg-white border border-border px-6 py-5"
    >
      <div className="flex items-baseline justify-between mb-3 gap-4">
        <h3 className="font-heading text-xl md:text-2xl text-text truncate">
          {c.campaign}
        </h3>
        <div className="flex items-center gap-5 text-sm tabular-nums shrink-0">
          <span className="text-text-dim">{c.total} prospects</span>
          {c.pipe_eur > 0 && (
            <span className="text-text-muted">{eur(c.pipe_eur)}</span>
          )}
          <span className="px-3 py-1 rounded-full bg-bg text-text font-medium">
            {c.engagement_rate}% engagés
          </span>
          <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
            {c.rdv_rate}% RDV
          </span>
        </div>
      </div>
      {/* Segmented progress */}
      <div className="flex h-2.5 rounded-full overflow-hidden bg-bg">
        {segments.map((s) => (
          s.n > 0 ? (
            <motion.div
              key={s.label}
              initial={{ width: 0 }}
              animate={{ width: `${(s.n / total) * 100}%` }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              title={`${s.label}: ${s.n}`}
              style={{ backgroundColor: s.color }}
              className="h-full"
            />
          ) : null
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-[11px] text-text-muted">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label} <span className="tabular-nums text-text">{s.n}</span>
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function ProspectRow({ p, delay }: { p: any; delay: number }) {
  const statusLabel = (p.status || "?").replaceAll("_", " ");
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-2xl bg-white border border-border px-5 py-3.5 hover:border-text-dim transition"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <p className="font-medium text-text truncate">
            {p.nom}
            {p.entreprise && (
              <span className="text-text-muted font-normal"> · {p.entreprise}</span>
            )}
          </p>
          <p className="text-xs text-text-dim mt-0.5">
            {statusLabel}
            {p.campaign && <> · {p.campaign}</>}
            {p.prochain_tp_date && <> · next {p.prochain_tp_date}</>}
          </p>
        </div>
        {p.montant && (
          <span className="text-sm font-medium text-accent tabular-nums shrink-0">
            {eur(p.montant)}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function SignalRow({ s, delay }: { s: any; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-2xl bg-white border border-border px-5 py-3.5"
    >
      <div className="flex items-center gap-3 mb-1">
        <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-bg border border-border text-text-muted font-medium">
          {s.source}
        </span>
        {s.confidence != null && (
          <span className="text-xs text-text-dim">conf {s.confidence}</span>
        )}
        <span className="text-xs text-text-dim ml-auto tabular-nums">
          {(s.detected_at || "").slice(0, 10)}
        </span>
      </div>
      <p className="text-sm text-text-muted line-clamp-2">{s.detail_preview}</p>
    </motion.div>
  );
}
