"use client";

import {
  CALENDAR,
  CRM,
  EMAIL,
  INTERNAL,
  POLITIQUE,
  REGLE_MODIFIEE,
  WEB,
} from "./renderer";
import type { RendererState } from "./useRenderer";

/**
 * PRODUCT-LIVING-SYSTEM-SCENE-V2 — les six surfaces logicielles.
 *
 * Chacune a une fonction visuelle qui lui est propre : un message que l'on
 * lit, une relation que l'on retrouve, une information que l'on vérifie, une
 * politique qui encadre, un accès qui manque, un créneau que l'on pose.
 *
 * Aucune ne reproduit un produit tiers. Aucun logo, aucune barre d'outils
 * imitée : ce sont des interfaces spécialisées et originales, réduites à ce
 * que le système en fait réellement.
 */

type SurfaceState = RendererState["surfaces"][number];

export function Surface({ surf, s }: { surf: SurfaceState; s: RendererState }) {
  return (
    <article
      className="pv2-surface"
      data-surface={surf.id}
      data-etat={surf.etat}
      data-attenuee={surf.attenuee ? "oui" : undefined}
      aria-label={`Surface ${surf.label}, ${surf.etat === "bloquee" ? "bloquée" : surf.role}`}
    >
      <header className="pv2-surface-head">
        <button
          type="button"
          className="pv2-surface-btn"
          onClick={() => s.setSourceChoisie(surf.choisie ? null : surf.id)}
          aria-pressed={surf.choisie}
        >
          <span className="pv2-code">{surf.label}</span>
        </button>
        <span className="pv2-surface-role" data-bloquee={surf.etat === "bloquee" ? "oui" : undefined}>
          {surf.etat === "bloquee" ? "bloquée" : surf.role}
        </span>
      </header>

      <div className="pv2-surface-body">{interieur(surf, s)}</div>

      {surf.choisie ? <p className="pv2-surface-apport">{surf.apporte}</p> : null}

      {/* La sortie se dépose ici, dans la surface concernée. Ce n'est pas un
          résumé posé ailleurs : c'est le logiciel qui a changé. */}
      {surf.recoit ? (
        <footer className="pv2-surface-out" data-engage={surf.recoit.engage ? "oui" : "non"}>
          <span className="pv2-out-titre">{surf.recoit.titre}</span>
          <span className="pv2-out-detail">{surf.recoit.detail}</span>
        </footer>
      ) : null}
    </article>
  );
}

function interieur(surf: SurfaceState, s: RendererState) {
  switch (surf.id) {
    case "email":
      return <SurfaceEmail progression={surf.agent?.progression ?? 0} />;
    case "crm":
      return <SurfaceCrm />;
    case "web":
      return <SurfaceWeb progression={surf.agent?.progression ?? 0} />;
    case "knowledge":
      return <SurfaceKnowledge s={s} />;
    case "internal":
      return <SurfaceInternal bloquee={surf.etat === "bloquee"} />;
    case "calendar":
      return <SurfaceCalendar retenu={s.commit && s.branche === "valider"} />;
    default:
      return null;
  }
}

/* ---------------------------------------------------------------- EMAIL --
   Un message : provenance, objet, extrait. L'agent Signal surligne les
   fragments au fur et à mesure qu'il les isole, pas tous d'un coup. */
function SurfaceEmail({ progression }: { progression: number }) {
  const morceaux = decouper(EMAIL.extrait, EMAIL.fragments);
  return (
    <div className="pv2-email">
      <p className="pv2-meta">{EMAIL.provenance}</p>
      <p className="pv2-email-objet">{EMAIL.objet}</p>
      <p className="pv2-email-extrait">
        {morceaux.map((m, i) =>
          m.fragment === null ? (
            <span key={i}>{m.texte}</span>
          ) : (
            <mark
              key={i}
              className="pv2-frag"
              data-vu={progression > (m.fragment + 1) / (EMAIL.fragments.length + 1) ? "oui" : "non"}
            >
              {m.texte}
            </mark>
          ),
        )}
      </p>
      <p className="pv2-chip">{EMAIL.intention}</p>
    </div>
  );
}

/** Découpe l'extrait autour des fragments à surligner, en gardant l'ordre. */
function decouper(texte: string, fragments: readonly string[]) {
  const out: { texte: string; fragment: number | null }[] = [];
  let reste = texte;
  fragments.forEach((f, i) => {
    const at = reste.indexOf(f);
    if (at < 0) return;
    if (at > 0) out.push({ texte: reste.slice(0, at), fragment: null });
    out.push({ texte: f, fragment: i });
    reste = reste.slice(at + f.length);
  });
  if (reste) out.push({ texte: reste, fragment: null });
  return out;
}

/* ------------------------------------------------------------------ CRM --
   Une relation : ce qui s'est passé, et le trou entre les deux. */
function SurfaceCrm() {
  return (
    <div className="pv2-crm">
      <p className="pv2-meta">{CRM.statut}</p>
      <ol className="pv2-timeline">
        {CRM.historique.map((h) => (
          <li key={h.quand} data-etat={h.etat}>
            <span className="pv2-timeline-quand">{h.quand}</span>
            <span className="pv2-timeline-quoi">{h.quoi}</span>
          </li>
        ))}
      </ol>
      <p className="pv2-meta">{CRM.actions}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ WEB --
   Une vérification : ce qui est confirmé, et ce qui ne l'est pas. */
function SurfaceWeb({ progression }: { progression: number }) {
  return (
    <div className="pv2-web">
      <p className="pv2-web-nom">{WEB.entreprise}</p>
      <p className="pv2-meta">{WEB.taille}</p>
      <ul className="pv2-checks">
        {WEB.verifie.map((v, i) => (
          <li
            key={v.quoi}
            data-ok={v.ok ? "oui" : "non"}
            data-vu={progression > (i + 1) / (WEB.verifie.length + 1) ? "oui" : "non"}
          >
            <span className="pv2-check-mark" aria-hidden="true" />
            {v.quoi}
            <span className="pv2-sr">{v.ok ? " : vérifié" : " : non vérifié"}</span>
          </li>
        ))}
      </ul>
      <p className="pv2-meta">{WEB.source}</p>
    </div>
  );
}

/* ------------------------------------------------------------ KNOWLEDGE --
   Une politique versionnée. La boucle d'amélioration ne produit pas deux
   paragraphes : elle modifie UN segment de cette politique, ici, à sa place.
   Le propriétaire humain est nommé sur la modification. */
function SurfaceKnowledge({ s }: { s: RendererState }) {
  return (
    <div className="pv2-know">
      <p className="pv2-meta">
        {POLITIQUE.reference} · {POLITIQUE.titre}
      </p>
      <ol className="pv2-regles">
        {POLITIQUE.regles.map((r) => {
          const cible = r.code === REGLE_MODIFIEE;
          const change = cible && s.regleModifiee;
          return (
            <li key={r.code} data-cible={cible ? "oui" : undefined} data-change={change ? "oui" : undefined}>
              <span className="pv2-regle-code">{r.code}</span>
              {cible ? (
                <span className="pv2-regle-corps">
                  <span className="pv2-regle-texte" data-remplacee={change ? "oui" : undefined}>
                    {s.regleAvant}
                  </span>
                  {change ? (
                    <>
                      <span className="pv2-regle-neuve">{s.regleApres}</span>
                      <span className="pv2-regle-sign">
                        v2 · modifiée par la direction commerciale
                      </span>
                    </>
                  ) : null}
                </span>
              ) : (
                <span className="pv2-regle-corps">
                  <span className="pv2-regle-texte">{r.texte}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <p className="pv2-meta">{POLITIQUE.comparables}</p>
    </div>
  );
}

/* -------------------------------------------------------- INTERNAL DATA --
   Un accès qui manque. C'est la seule surface qui ne donne rien, et c'est
   elle qui rend la décision humaine nécessaire. */
function SurfaceInternal({ bloquee }: { bloquee: boolean }) {
  return (
    <div className="pv2-internal" data-bloquee={bloquee ? "oui" : undefined}>
      <p className="pv2-internal-etat">Accès {INTERNAL.acces.toLowerCase()}</p>
      <p className="pv2-internal-perm">{INTERNAL.permission}</p>
      <p className="pv2-meta">{INTERNAL.raison}</p>
      {bloquee ? <p className="pv2-internal-cons">{INTERNAL.consequence}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------- CALENDAR --
   Des créneaux, une contrainte, et une réservation qui se pose ou non. */
function SurfaceCalendar({ retenu }: { retenu: boolean }) {
  return (
    <div className="pv2-cal">
      <p className="pv2-meta">{CALENDAR.contrainte}</p>
      <ul className="pv2-slots">
        {CALENDAR.creneaux.map((c) => (
          <li
            key={c.quand}
            data-libre={c.libre ? "oui" : "non"}
            data-retenu={retenu && c.quand === CALENDAR.retenu ? "oui" : undefined}
          >
            {c.quand}
          </li>
        ))}
      </ul>
    </div>
  );
}
