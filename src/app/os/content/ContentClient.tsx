"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Idea = {
  id: string;
  title: string;
  body: string;
  tags: string[] | string | null;
  source: string | null;
  created_at: string;
};

type Transcript = {
  id: string;
  source: string | null;
  date: string | null;
  subject: string | null;
};

export default function ContentClient({
  ideas: initial,
  transcripts,
}: {
  ideas: Idea[];
  transcripts: Transcript[];
}) {
  const [ideas, setIdeas] = useState(initial);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setFlash("Titre + corps requis");
      return;
    }
    setSaving(true);
    try {
      const r = await fetch("/api/os/content-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      const j = await r.json();
      if (j.ok) {
        setIdeas([j.idea, ...ideas]);
        setTitle("");
        setTags("");
        setBody("");
        setFlash("✓ Ajouté");
        setTimeout(() => setFlash(null), 2000);
      }
    } finally {
      setSaving(false);
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
        Content
      </motion.h1>
      <p className="text-text-muted mb-10">
        Idées + briques transcripts. Matière première pour la newsletter, posts, LinkedIn.
      </p>

      <section className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div>
          <h2 className="font-heading text-2xl mb-4 text-text">
            Idées stockées
            <span className="text-text-dim text-base ml-3">{ideas.length}</span>
          </h2>
          <div className="space-y-3">
            {ideas.length === 0 && (
              <p className="text-text-dim italic">
                Aucune idée — utilise le formulaire à droite.
              </p>
            )}
            {ideas.map((idea, i) => {
              const tagList = Array.isArray(idea.tags)
                ? idea.tags
                : typeof idea.tags === "string"
                  ? idea.tags.split(",").map((t) => t.trim()).filter(Boolean)
                  : [];
              return (
                <motion.article
                  key={idea.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.03 * i }}
                  className="rounded-3xl bg-white border border-border px-6 py-5"
                >
                  <div className="flex items-baseline justify-between mb-2 gap-4">
                    <h3 className="font-heading text-xl text-text">{idea.title}</h3>
                    <span className="text-xs text-text-dim tabular-nums shrink-0">
                      {(idea.created_at || "").slice(0, 10)}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted whitespace-pre-wrap mb-3">
                    {idea.body}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {tagList.map((t: string) => (
                      <span
                        key={t}
                        className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-bg border border-border text-text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        <aside>
          <div className="rounded-3xl bg-white border border-border px-5 py-5 sticky top-6">
            <h3 className="font-heading text-xl mb-4 text-text">Nouvelle idée</h3>
            <form onSubmit={save} className="space-y-3">
              <input
                type="text"
                placeholder="Titre court"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-full bg-bg border border-border px-4 py-2 text-sm placeholder:text-text-dim focus:outline-none focus:border-text-muted"
              />
              <input
                type="text"
                placeholder="Tags (newsletter, linkedin...)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-full bg-bg border border-border px-4 py-2 text-sm placeholder:text-text-dim focus:outline-none focus:border-text-muted"
              />
              <textarea
                placeholder="Dicte ton idée brute."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                className="w-full rounded-2xl bg-bg border border-border px-4 py-3 text-sm placeholder:text-text-dim focus:outline-none focus:border-text-muted resize-y"
              />
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-text text-bg px-4 py-2.5 text-sm font-medium hover:bg-bg-dark transition disabled:opacity-60"
              >
                {saving ? "…" : "Sauvegarder"}
              </button>
              {flash && <p className="text-xs text-center text-accent">{flash}</p>}
            </form>
          </div>
        </aside>
      </section>

      <section className="mt-14">
        <h2 className="font-heading text-2xl mb-4 text-text">
          Transcripts récents
          <span className="text-text-dim text-base ml-3">
            sources pour tes contenus
          </span>
        </h2>
        <div className="space-y-2">
          {transcripts.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl bg-white border border-border px-5 py-3.5 flex items-center gap-3 text-sm"
            >
              <span className="text-text-dim text-xs font-medium tabular-nums w-20">
                {t.date || "—"}
              </span>
              <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-bg border border-border text-text-muted">
                {t.source || "?"}
              </span>
              <span className="text-text truncate">
                {t.subject || "(pas de sujet)"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
