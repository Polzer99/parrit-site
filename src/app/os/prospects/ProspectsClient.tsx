"use client";

import { useMemo, useState, Fragment } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Prospect = {
  id: string;
  slug: string;
  nom: string;
  entreprise: string | null;
  poste: string | null;
  status: string | null;
  priorite: number | null;
  telephone: string | null;
  email: string | null;
  linkedin: string | null;
  prochain_tp_date: string | null;
  dernier_tp_date: string | null;
  montant: number | null;
  campaign: string | null;
  source: string | null;
  channel: string | null;
  n_tp: number | null;
};

const ALL_STATUSES = [
  "à_contacter", "à_relancer", "rdv_pris", "devis_envoye",
  "accord_verbal", "deal_signed", "pas_maintenant",
  "en_veille", "open_conversation", "partenaire", "relation_perso",
];

const eur = (n: number | null) =>
  n ? new Intl.NumberFormat("fr-FR", {
    style: "currency", currency: "EUR", maximumFractionDigits: 0,
  }).format(n) : "";

const statusColor = (s: string | null): string => {
  if (!s) return "#A09488";
  if (s === "deal_signed") return "#2A2420";
  if (s === "accord_verbal") return "#5FAF8E";
  if (s === "devis_envoye") return "#C8956C";
  if (s === "rdv_pris") return "#8B6F47";
  if (s === "pas_maintenant") return "#A09488";
  if (s.startsWith("à_")) return "#5A5047";
  return "#A09488";
};

export default function ProspectsClient({ prospects }: { prospects: Prospect[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string[]>(
    ["à_contacter", "à_relancer", "rdv_pris", "devis_envoye"]);
  const [minMontant, setMinMontant] = useState(0);
  const [opened, setOpened] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const qq = q.toLowerCase().trim();
    return prospects.filter((p) => {
      if (status.length && !(p.status && status.includes(p.status))) return false;
      if (minMontant && (p.montant || 0) < minMontant) return false;
      if (qq) {
        const hay = `${p.nom || ""} ${p.entreprise || ""} ${p.poste || ""} ${p.campaign || ""}`.toLowerCase();
        if (!hay.includes(qq)) return false;
      }
      return true;
    });
  }, [prospects, q, status, minMontant]);

  const toggleStatus = (s: string) => {
    setStatus((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
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
        className="font-heading font-light text-[52px] md:text-[64px] leading-[0.95] tracking-tight text-text mb-8"
      >
        Prospects <span className="text-text-dim tabular-nums text-3xl align-top">· {filtered.length}</span>
      </motion.h1>

      {/* Filters */}
      <div className="rounded-3xl bg-white border border-border p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 items-center">
          <input
            type="text"
            placeholder="Rechercher nom, entreprise, poste, campagne…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded-full bg-bg border border-border px-5 py-2.5 text-sm placeholder:text-text-dim focus:outline-none focus:border-text-muted"
          />
          <label className="text-sm text-text-muted flex items-center gap-2">
            Montant ≥
            <input
              type="number"
              value={minMontant}
              onChange={(e) => setMinMontant(Number(e.target.value))}
              step={500}
              min={0}
              className="w-24 rounded-full bg-bg border border-border px-3 py-2 text-sm text-right focus:outline-none focus:border-text-muted"
            />
            €
          </label>
          <button
            onClick={() => { setQ(""); setStatus([]); setMinMontant(0); }}
            className="text-xs text-text-dim hover:text-text transition"
          >
            Reset
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => toggleStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                status.includes(s)
                  ? "bg-text text-bg border-text"
                  : "bg-white text-text-muted border-border hover:border-text-muted"
              }`}
            >
              {s.replaceAll("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.15em] text-text-dim font-medium">
              <th className="text-left px-5 py-3.5">Nom</th>
              <th className="text-left px-3 py-3.5">Entreprise</th>
              <th className="text-left px-3 py-3.5">Statut</th>
              <th className="text-left px-3 py-3.5">Campagne</th>
              <th className="text-right px-3 py-3.5">Priorité</th>
              <th className="text-right px-3 py-3.5">Montant</th>
              <th className="text-left px-3 py-3.5">Next</th>
              <th className="text-right px-5 py-3.5">TP</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <Fragment key={p.id}>
                <tr
                  className={`border-t border-border hover:bg-bg/60 cursor-pointer transition ${opened === p.id ? "bg-bg/60" : ""}`}
                  onClick={() => setOpened(opened === p.id ? null : p.id)}
                >
                  <td className="px-5 py-3.5 font-medium text-text">{p.nom}</td>
                  <td className="px-3 py-3.5 text-text-muted">{p.entreprise || "—"}</td>
                  <td className="px-3 py-3.5">
                    <span
                      className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: statusColor(p.status) + "22",
                        color: statusColor(p.status),
                      }}
                    >
                      {(p.status || "?").replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-text-muted text-xs">{p.campaign || "—"}</td>
                  <td className="px-3 py-3.5 text-right tabular-nums text-text-dim">{p.priorite ?? "—"}</td>
                  <td className="px-3 py-3.5 text-right tabular-nums font-medium text-accent">{eur(p.montant)}</td>
                  <td className="px-3 py-3.5 text-text-muted tabular-nums text-xs">
                    {p.prochain_tp_date || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-text-dim">{p.n_tp ?? 0}</td>
                </tr>
                {opened === p.id && (
                  <tr className="border-t border-border bg-bg/40">
                    <td colSpan={8} className="px-5 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-text-dim mb-0.5">Poste</p>
                          <p className="text-text">{p.poste || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-dim mb-0.5">Email</p>
                          <p className="text-text">{p.email || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-dim mb-0.5">Tél</p>
                          <p className="text-text">{p.telephone || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-dim mb-0.5">LinkedIn</p>
                          {p.linkedin ? (
                            <a href={p.linkedin} target="_blank" rel="noreferrer"
                               className="text-accent hover:underline truncate block">
                              voir profil
                            </a>
                          ) : (
                            <p className="text-text">—</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <CadrageButton slug={p.slug} />
                        <RelanceButton slug={p.slug} />
                        <MarkRdvButton id={p.id} />
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function CadrageButton({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const run = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const r = await fetch("/api/os/cadrage", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      setDone(r.ok);
    } finally { setLoading(false); }
  };
  return (
    <button
      onClick={run}
      disabled={loading}
      className="text-xs rounded-full bg-text text-bg px-4 py-2 hover:bg-bg-dark transition disabled:opacity-60"
    >
      {loading ? "…" : done ? "✓ Cadrage" : "📋 Cadrage court"}
    </button>
  );
}

function RelanceButton({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<null | string>(null);
  const run = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const r = await fetch("/api/os/relance", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const j = await r.json();
      setDone(j.insufficient ? "⚠️ Pas de contexte" : "✓ Relance");
    } finally { setLoading(false); }
  };
  return (
    <button
      onClick={run}
      disabled={loading}
      className="text-xs rounded-full bg-white text-text border border-text px-4 py-2 hover:bg-bg transition disabled:opacity-60"
    >
      {loading ? "…" : done || "🔁 Relance"}
    </button>
  );
}

function MarkRdvButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const run = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const r = await fetch("/api/os/mark-rdv", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setDone(r.ok);
    } finally { setLoading(false); }
  };
  return (
    <button
      onClick={run}
      disabled={loading || done}
      className="text-xs rounded-full bg-white text-accent border border-accent px-4 py-2 hover:bg-accent hover:text-bg transition disabled:opacity-60"
    >
      {done ? "✓ RDV pris" : "✅ RDV pris"}
    </button>
  );
}
