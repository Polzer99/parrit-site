"use client";

import {
  CALENDAR,
  CRM,
  EMAIL,
  INTERNAL,
  POLITIQUE,
  REGLE_MODIFIEE,
  WEB,
} from "../product-living-scene-v2/renderer";
import type { PremiumState } from "./usePremium";

/**
 * PRODUCT-LIVING-SYSTEM-SCENE-V2-PREMIUM-V1 — les six surfaces, en trois niveaux.
 *
 * Le contenu ne change pas d'un mot par rapport à la V2 : ce sont les mêmes
 * données. Ce qui change, c'est la QUANTITÉ montrée à un instant donné.
 *
 *   active        anatomie complète, pleine lisibilité, interaction possible
 *   contextuelle  une seule information principale, aucun bruit secondaire
 *   disponible    présence minimale, la surface peut revenir si elle sert
 *
 * Trois niveaux d'information se superposent à cela :
 *   n1  l'information métier          toujours visible
 *   n2  état, origine, confiance      surfaces active et contextuelle
 *   n3  version, trace, métadonnées   uniquement à l'inspection
 */

type SurfaceState = PremiumState["surfaces"][number];

/** Intitulés de structure. Ils nomment l'anatomie, ils ne racontent rien. */
const L = {
  fil: "Ce qu'elle apporte",
  statut: "Dernière interaction",
  source: "Source",
  proprietaire: "Propriétaire",
  comparable: "Cas comparables",
  permission: "Permission",
  cause: "Cause du blocage",
  acces: "Demander l'accès",
  contrainte: "Contrainte",
  proposition: "Proposition",
} as const;

export function SurfacePremium({ surf, s }: { surf: SurfaceState; s: PremiumState }) {
  const actif = surf.niveau === "active";

  return (
    <article
      className="pp-surface"
      data-surface={surf.id}
      data-niveau={surf.niveau}
      data-etat={surf.etat}
      data-attenuee={surf.attenuee ? "oui" : undefined}
      style={{ ["--rang" as string]: surf.rang }}
      onMouseEnter={() => s.setSurfaceSurvolee(surf.id)}
      onMouseLeave={() => s.setSurfaceSurvolee(null)}
      aria-label={`${surf.label}, ${surf.etat === "bloquee" ? "bloquée" : surf.role}`}
    >
      <header className="pp-surface-head">
        <span className="pp-surface-nom">{surf.label}</span>
        <span className="pp-surface-etat" data-bloquee={surf.etat === "bloquee" ? "oui" : undefined}>
          {surf.etat === "bloquee" ? "bloquée" : surf.role}
        </span>
      </header>

      {surf.niveau !== "disponible" ? (
        <div className="pp-surface-corps">{corps(surf, s, actif)}</div>
      ) : null}

      {/* La confirmation se pose dans la surface concernée, décalée par son
          rang : les trois sorties ne tombent pas au même instant. */}
      {surf.recoit ? (
        <footer className="pp-out" data-engage={surf.recoit.engage ? "oui" : "non"}>
          <span className="pp-out-titre">{surf.recoit.titre}</span>
          <span className="pp-n3">{surf.recoit.detail}</span>
        </footer>
      ) : null}
    </article>
  );
}

function corps(surf: SurfaceState, s: PremiumState, actif: boolean) {
  switch (surf.id) {
    case "email":
      return <Email actif={actif} surf={surf} s={s} />;
    case "crm":
      return <Crm actif={actif} />;
    case "web":
      return <Web actif={actif} progression={surf.agent?.progression ?? 0} />;
    case "knowledge":
      return <Knowledge actif={actif} s={s} />;
    case "internal":
      return <Internal actif={actif} s={s} />;
    case "calendar":
      return <Calendar actif={actif} retenu={s.commit && s.branche === "valider"} />;
    default:
      return null;
  }
}

/* ---------------------------------------------------------------- EMAIL --
   Objet, extrait, fragment sélectionné, intention, action disponible. */
function Email({ actif, surf, s }: { actif: boolean; surf: SurfaceState; s: PremiumState }) {
  const p = surf.agent?.progression ?? 0;
  const morceaux = decouper(EMAIL.extrait, EMAIL.fragments);
  return (
    <>
      <p className="pp-n1 pp-email-objet">{EMAIL.objet}</p>
      {actif ? (
        <>
          <p className="pp-n2 pp-email-extrait">
            {morceaux.map((m, i) =>
              m.fragment === null ? (
                <span key={i}>{m.texte}</span>
              ) : (
                <mark
                  key={i}
                  className="pp-frag"
                  data-vu={p > (m.fragment + 1) / (EMAIL.fragments.length + 1) ? "oui" : "non"}
                >
                  {m.texte}
                </mark>
              ),
            )}
          </p>
          <p className="pp-n2 pp-chip">{EMAIL.intention}</p>
          <button
            type="button"
            className="pp-action"
            onClick={() => s.setSourceChoisie(surf.choisie ? null : surf.id)}
            aria-pressed={surf.choisie}
          >
            {L.fil}
          </button>
          {surf.choisie ? <p className="pp-n3">{surf.apporte}</p> : null}
          <p className="pp-n3">{EMAIL.provenance}</p>
        </>
      ) : null}
    </>
  );
}

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
   Relation, chronologie, statut, dernière interaction. */
function Crm({ actif }: { actif: boolean }) {
  const dernier = CRM.historique[CRM.historique.length - 1];
  return (
    <>
      <p className="pp-n1">{CRM.statut}</p>
      {actif ? (
        <>
          <ol className="pp-n2 pp-chrono">
            {CRM.historique.map((h) => (
              <li key={h.quand} data-etat={h.etat}>
                <span className="pp-chrono-point" aria-hidden="true" />
                <span className="pp-chrono-quoi">{h.quoi}</span>
                <span className="pp-n3 pp-chrono-quand">{h.quand}</span>
              </li>
            ))}
          </ol>
          <p className="pp-n2">
            <span className="pp-cle">{L.statut}</span> {dernier.quoi}
          </p>
          <p className="pp-n3">{CRM.actions}</p>
        </>
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------------ WEB --
   Identité, vérification, source, fraîcheur. */
function Web({ actif, progression }: { actif: boolean; progression: number }) {
  return (
    <>
      <p className="pp-n1">{WEB.entreprise}</p>
      {actif ? (
        <>
          <p className="pp-n2">{WEB.taille}</p>
          <ul className="pp-n2 pp-checks">
            {WEB.verifie.map((v, i) => (
              <li
                key={v.quoi}
                data-ok={v.ok ? "oui" : "non"}
                data-vu={progression > (i + 1) / (WEB.verifie.length + 1) ? "oui" : "non"}
              >
                <span className="pp-mark" aria-hidden="true" />
                {v.quoi}
                <span className="pp-sr">{v.ok ? " : vérifié" : " : non vérifié"}</span>
              </li>
            ))}
          </ul>
          <p className="pp-n3">
            <span className="pp-cle">{L.source}</span> {WEB.source}
          </p>
        </>
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------ KNOWLEDGE --
   Règle active, version, propriétaire, règles comparables.
   C'est ici que le retour humain réécrit un segment de la politique. */
function Knowledge({ actif, s }: { actif: boolean; s: PremiumState }) {
  const cible = POLITIQUE.regles.find((r) => r.code === REGLE_MODIFIEE);
  const change = s.regleModifiee;
  return (
    <>
      <p className="pp-n1 pp-regle" data-change={change ? "oui" : undefined}>
        <span className="pp-regle-avant" data-remplacee={change ? "oui" : undefined}>
          {s.regleAvant}
        </span>
        {change ? <span className="pp-regle-neuve">{s.regleApres}</span> : null}
      </p>
      {actif ? (
        <>
          <p className="pp-n2 pp-regle-meta">
            <span className="pp-cle">{cible?.code}</span>
            <span className="pp-version">{change ? "v2" : "v1"}</span>
            {change ? (
              <span className="pp-regle-sign">
                {L.proprietaire} : direction commerciale
              </span>
            ) : null}
          </p>
          <ul className="pp-n3 pp-comparables">
            {POLITIQUE.regles
              .filter((r) => r.code !== REGLE_MODIFIEE)
              .map((r) => (
                <li key={r.code}>
                  <span className="pp-cle">{r.code}</span> {r.texte}
                </li>
              ))}
          </ul>
          <p className="pp-n3">
            <span className="pp-cle">{L.comparable}</span> {POLITIQUE.comparables}
          </p>
        </>
      ) : null}
    </>
  );
}

/* -------------------------------------------------------- INTERNAL DATA --
   Permission, cause du blocage, demande d'accès possible. */
function Internal({ actif, s }: { actif: boolean; s: PremiumState }) {
  return (
    <>
      <p className="pp-n1 pp-refus">Accès {INTERNAL.acces.toLowerCase()}</p>
      {actif ? (
        <>
          <p className="pp-n2">
            <span className="pp-cle">{L.permission}</span> {INTERNAL.permission}
          </p>
          <p className="pp-n2">
            <span className="pp-cle">{L.cause}</span> {INTERNAL.raison}
          </p>
          {/* La demande d'accès n'est proposée que lorsqu'elle est réellement
              jouable : c'est l'une des quatre branches du moteur, pas un
              bouton décoratif. */}
          {s.bloque ? (
            <button type="button" className="pp-action" onClick={() => s.decider("contexte")}>
              {L.acces}
            </button>
          ) : null}
          <p className="pp-n3">{INTERNAL.consequence}</p>
        </>
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------- CALENDAR --
   Disponibilité, contrainte, proposition, commit. */
function Calendar({ actif, retenu }: { actif: boolean; retenu: boolean }) {
  const libres = CALENDAR.creneaux.filter((c) => c.libre).length;
  return (
    <>
      <p className="pp-n1">
        {libres} créneaux libres
      </p>
      {actif ? (
        <>
          <ul className="pp-n2 pp-slots">
            {CALENDAR.creneaux.map((c) => (
              <li
                key={c.quand}
                data-libre={c.libre ? "oui" : "non"}
                data-retenu={retenu && c.quand === CALENDAR.retenu ? "oui" : undefined}
              >
                <span className="pp-sr">{c.quand}</span>
              </li>
            ))}
          </ul>
          <p className="pp-n2">
            <span className="pp-cle">{L.proposition}</span> {CALENDAR.retenu}
          </p>
          <p className="pp-n3">
            <span className="pp-cle">{L.contrainte}</span> {CALENDAR.contrainte}
          </p>
        </>
      ) : null}
    </>
  );
}
