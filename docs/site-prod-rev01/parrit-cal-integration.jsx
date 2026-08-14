/* ══════════════════════════════════════════════════════════════════
   PARRIT / CAL.COM INTEGRATION — REV 01
   Prise de rendez-vous intégrée aux codes PARRIT / CODES-1.0 REV 02.
   Deux modes : inline (l'instrument) et popup (depuis un CTA).

   PRÉREQUIS
   npm install @calcom/embed-react

   À REMPLACER
   CAL_LINK — ton lien Cal.com réel, format "handle/event-slug"
   (ex. "paul-larmaraud/30min"), récupérable dans Cal.com →
   Event Type → ⋯ → Embed.

   NOTE PRODUCTION (Claude Code / Codex)
   L'intérieur de l'iframe Cal.com n'accepte que les variables que
   Cal expose (brandColor + cssVarsPerTheme) — nos tokens PC ne
   s'appliquent pas dedans. Le cadre autour, lui, est 100 % Parrit :
   registre instrument (PC-02), ligne de registre (PC-05), filets
   1 px (PC-04). Le brief CODES-1.0 REV 02 fait autorité.
   ══════════════════════════════════════════════════════════════════ */

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

const CAL_LINK = "parrit/commission"; // ← REMPLACER

/* Tokens PC-01/02 — mêmes valeurs que le prototype REV 02 */
const PARRIT_RED = "#E10600";

/* ──────────────────────────────────────────────────────────────────
   MODE 1 — INLINE · l'instrument de prise de rendez-vous
   À poser sur le registre Document (blanc froid), comme l'objet
   cockpit de la homepage : le calendrier est mis en scène comme
   un instrument, avec sa ligne de registre.
   ────────────────────────────────────────────────────────────────── */

export function ParritCalInline() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "commission" });
      cal("ui", {
        theme: "dark",                       // registre Instrument
        hideEventTypeDetails: false,
        layout: "month_view",
        styles: { branding: { brandColor: PARRIT_RED } },
        cssVarsPerTheme: {
          dark: {
            "cal-brand": PARRIT_RED,
            "cal-bg": "#131518",             // --carbon
            "cal-bg-emphasis": "#1A1D21",    // --carbon2
            "cal-border": "#24282D",         // --rule-d
            "cal-text": "#F1F2F3",           // --paper
            "cal-text-muted": "#9CA1A6",     // --g2
          },
          light: { "cal-brand": PARRIT_RED },
        },
      });
    })();
  }, []);

  return (
    <div style={S.stage}>
      {/* l'instrument — mêmes règles que .instr du prototype */}
      <div style={S.instr}>
        <div style={S.ibar}>
          <span style={S.reg}>PARRIT / COMMISSION</span>
          <span style={S.reg}>SELECT A TIME</span>
        </div>
        <Cal
          namespace="commission"
          calLink={CAL_LINK}
          style={{ width: "100%", height: "100%", minHeight: 560, overflow: "auto" }}
          config={{ layout: "month_view", theme: "dark" }}
        />
        <div style={{ ...S.ibar, borderTop: "1px solid #24282D", borderBottom: 0 }}>
          <span style={S.reg}>45 MIN · VISIO</span>
          <span style={{ ...S.reg, color: "#F1F2F3" }}>
            <span style={S.sq} />COMMISSIONED, NOT SUBSCRIBED
          </span>
        </div>
      </div>
      <div style={S.caption}>THE FIRST STEP — AN EXAMINATION, NOT A SALES CALL.</div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   MODE 2 — POPUP · depuis un CTA
   Le bouton reste un bouton Parrit standard (PC-07 ne s'applique
   pas : ouvrir un calendrier n'est pas une action conséquente —
   le Hold-to-Commit est réservé aux décisions qui engagent).
   ────────────────────────────────────────────────────────────────── */

export function ParritCalButton({ children = "Commission your Operating System" }) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "commission-popup" });
      cal("ui", {
        theme: "dark",
        layout: "month_view",
        styles: { branding: { brandColor: PARRIT_RED } },
      });
    })();
  }, []);

  return (
    <button
      type="button"
      data-cal-namespace="commission-popup"
      data-cal-link={CAL_LINK}
      data-cal-config='{"layout":"month_view","theme":"dark"}'
      style={S.cta}
    >
      {children}
    </button>
  );
}

/* ── styles inline (mappés PC-01 → PC-05 ; en prod : classes du DS) ── */
const S = {
  stage: { padding: "30px 0 60px" },
  instr: {
    background: "#131518",
    border: "1px solid #24282D",
    maxWidth: 860,
    margin: "0 auto",
    boxShadow: "0 40px 80px -40px rgba(10,11,12,.4)", // seule ombre autorisée (PC-04)
  },
  ibar: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    padding: "12px 17px",
    borderBottom: "1px solid #24282D",
  },
  reg: {
    fontFamily: '"Geist Mono","IBM Plex Mono",Menlo,monospace',
    fontSize: 10,
    letterSpacing: ".16em",
    textTransform: "uppercase",
    color: "#6F757B",
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  sq: { display: "inline-block", width: 8, height: 8, background: PARRIT_RED },
  caption: {
    textAlign: "center",
    marginTop: 16,
    fontFamily: '"Geist Mono","IBM Plex Mono",Menlo,monospace',
    fontSize: 10,
    letterSpacing: ".16em",
    textTransform: "uppercase",
    color: "#55595E",
  },
  cta: {
    appearance: "none",
    cursor: "pointer",
    border: `1.5px solid ${PARRIT_RED}`,
    background: PARRIT_RED,
    color: "#fff",
    fontFamily: '"Geist Mono","IBM Plex Mono",Menlo,monospace',
    fontSize: 10.5,
    letterSpacing: ".16em",
    textTransform: "uppercase",
    fontWeight: 600,
    padding: "13px 20px",
  },
};

/* ══════════════════════════════════════════════════════════════════
   VARIANTE HTML VANILLA — si la page n'est pas en React
   (site statique, Webflow, etc.). Coller avant </body>.
   ══════════════════════════════════════════════════════════════════

<div id="parrit-cal" style="max-width:860px;margin:0 auto;background:#131518;border:1px solid #24282D;min-height:560px"></div>

<script type="text/javascript">
  (function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal, ar = arguments;
      if (!cal.loaded) {
        cal.ns = {}; cal.q = cal.q || [];
        d.head.appendChild(d.createElement("script")).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); }
        else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, "https://app.cal.com/embed/embed.js", "init");

  Cal("init", "commission", { origin: "https://cal.com" });

  Cal.ns.commission("inline", {
    elementOrSelector: "#parrit-cal",
    calLink: "parrit/commission",            // ← REMPLACER
    config: { layout: "month_view", theme: "dark" }
  });

  Cal.ns.commission("ui", {
    theme: "dark",
    styles: { branding: { brandColor: "#E10600" } },
    hideEventTypeDetails: false,
    layout: "month_view"
  });
</script>

   ══════════════════════════════════════════════════════════════════ */
