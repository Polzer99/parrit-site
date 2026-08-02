/**
 * VALIDATION DES REGISTRES — exécutée au BUILD.
 *
 * `index.ts` appelle `validerRegistres()` au chargement du module, et tous les
 * templates passent par lui. Un registre incohérent fait donc échouer
 * `next build`, pas une page en production.
 *
 * Principe : « le CI bloque » vaut mieux que « penser à vérifier ».
 *
 * Ce qui est vérifié :
 *   1. identifiants uniques dans chacun des registres ;
 *   2. identifiants stables — préfixe imposé, pas d'espace, pas d'accent ;
 *   3. références croisées résolues (une ressource pointe un CTA qui existe) ;
 *   4. pas de duplication d'une donnée canonique ailleurs ;
 *   5. les deux règles dures des preuves : chiffre complet, nominatif autorisé ;
 *   6. un CTA interne construit bien une destination attribuée.
 */

import { ctaHref, getCta, type CtaId } from "./cta";
import { getOffres, taxonomieOffresNonTranchee } from "./ciblage";
import { metriqueAffichable, nominatifAutorise, toutesLesPreuves } from "./preuves";
import { getRessourcesPubliees } from "./ressources";

export type Anomalie = { registre: string; id: string; probleme: string };

const PREFIXES: Record<string, string> = {
  preuves: "preuve.",
  ressources: "res.",
  offres: "offre.",
  problemes: "probleme.",
};

/** Un identifiant stable : minuscules, points, tirets. Rien d'autre. */
const ID_STABLE = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;

export function validerRegistres(): Anomalie[] {
  const anomalies: Anomalie[] = [];
  const ajouter = (registre: string, id: string, probleme: string) =>
    anomalies.push({ registre, id, probleme });

  /* -------------------------------------------------------- 1 & 2. ids */

  const verifierIds = (registre: string, ids: string[]) => {
    const vus = new Set<string>();
    for (const id of ids) {
      if (vus.has(id)) ajouter(registre, id, "identifiant dupliqué");
      vus.add(id);
      if (!ID_STABLE.test(id)) {
        ajouter(registre, id, "identifiant instable (minuscules, points et tirets seulement)");
      }
      const prefixe = PREFIXES[registre];
      if (prefixe && !id.startsWith(prefixe)) {
        ajouter(registre, id, `identifiant sans le préfixe « ${prefixe} »`);
      }
    }
  };

  const preuves = toutesLesPreuves();
  const ressources = getRessourcesPubliees();
  const offres = getOffres();

  verifierIds("preuves", preuves.map((p) => p.id));
  verifierIds("ressources", ressources.map((r) => r.id));
  verifierIds("offres", offres.map((o) => o.id));

  /* ------------------------------------------------ 3. références croisées */

  for (const r of ressources) {
    // Lève si l'identifiant n'existe pas dans le registre des CTA.
    const cta = getCta(r.ctaPrincipal as CtaId);
    if (!cta) {
      ajouter("ressources", r.id, `ctaPrincipal « ${r.ctaPrincipal} » introuvable`);
      continue;
    }
    if (cta.priorite !== "principale") {
      ajouter(
        "ressources",
        r.id,
        `ctaPrincipal « ${r.ctaPrincipal} » n'est pas de priorité principale`,
      );
    }
  }

  /* ------------------------------------------- 4. pas de duplication */

  // Une ressource ne redéfinit pas le libellé de son CTA : elle le référence.
  for (const r of ressources) {
    if ((r as unknown as Record<string, unknown>).ctaLibelle !== undefined) {
      ajouter("ressources", r.id, "libellé de CTA dupliqué, utiliser ctaPrincipal");
    }
  }

  // Deux ressources ne peuvent pas servir le même livrable sous deux slugs.
  const livrables = new Map<string, string>();
  for (const r of ressources) {
    if (!r.livrable) continue;
    const deja = livrables.get(r.livrable);
    if (deja) ajouter("ressources", r.id, `livrable déjà servi par « ${deja} »`);
    else livrables.set(r.livrable, r.id);
  }

  /* ------------------------------ 4bis. une seule URL canonique par ressource */

  /* Arbitrage Paul du 02/08/2026 : deux ressources ne peuvent pas revendiquer la
     même expérience, et une expérience « route_dediee » doit viser un chemin
     interne réel. C'est ce qui empêche de refabriquer deux pages indexables
     décrivant la même chose. */
  const experiences = new Map<string, string>();
  for (const r of ressources) {
    if (r.experience.rendu !== "route_dediee") continue;
    const url = r.experience.url;
    if (!url.startsWith("/") || url.startsWith("//")) {
      ajouter("ressources", r.id, `expérience « ${url} » : chemin interne attendu`);
      continue;
    }
    if (url === `/ressources/${r.slug}`) {
      ajouter("ressources", r.id, "expérience « route_dediee » qui vise sa propre fiche");
    }
    const deja = experiences.get(url);
    if (deja) ajouter("ressources", r.id, `expérience « ${url} » déjà revendiquée par « ${deja} »`);
    else experiences.set(url, r.id);
  }

  /* Une ressource publiée sans mode d'accès véridique n'est pas publiable : soit
     T3 rend l'expérience, soit une route dédiée la sert. Pas de troisième cas. */
  for (const r of ressources) {
    if (r.experience.rendu === "route_dediee" && !r.experience.url) {
      ajouter("ressources", r.id, "publiée sans URL d'expérience");
    }
  }

  /* --------------------------------------- 5. les deux règles des preuves */

  for (const p of preuves) {
    // Un chiffre partiel est pire qu'aucun chiffre : il a l'air vérifié.
    if (p.mesure && !metriqueAffichable(p)) {
      ajouter("preuves", p.id, "mesure incomplète : metrique, periode ET methodeMesure");
    }
    // Le champ `publicationPermission` doit être EXPLICITE dès qu'un tiers est nommé.
    if (p.nominatif && typeof p.nominatif.publicationPermission !== "boolean") {
      ajouter("preuves", p.id, "preuve nominative sans publicationPermission explicite");
    }
    if (p.nominatif?.publicationPermission === true && !p.nominatif.sourceAutorisation) {
      ajouter("preuves", p.id, "autorisation déclarée sans trace (sourceAutorisation)");
    }
    // Une preuve nominative non autorisée doit rester utilisable, anonymisée.
    if (!nominatifAutorise(p) && !p.descriptifAnonymise) {
      ajouter("preuves", p.id, "nominative sans autorisation ET sans descriptifAnonymise");
    }
    if (p.type === "trace" && !p.trace) {
      ajouter("preuves", p.id, "type « trace » sans étapes");
    }
    if (p.type === "media" && !p.media) {
      ajouter("preuves", p.id, "type « media » sans média");
    }
  }

  /* ------------------------------------------------ 6. destinations attribuées */

  const ctaIds: CtaId[] = [
    "rdv.paul",
    "rdv.systeme",
    "rdv.offre",
    "rdv.auteur",
    "diagnostic.decrire_mon_cas",
    "ressource.demander",
    "ressource.telecharger",
    "veille.recevoir",
    "prototype.demander",
    "presse.kit",
    "presse.contact",
  ];
  for (const id of ctaIds) {
    const href = ctaHref(id, "fr", "validation");
    if (href.startsWith("/") && !href.includes("source=")) {
      ajouter("cta", id, "destination interne sans ?source=, attribution impossible");
    }
  }

  return anomalies;
}

/**
 * Lève si un registre est incohérent. Appelée au chargement du module `index.ts`,
 * donc pendant `next build`.
 *
 * La taxonomie d'offre encore provisoire n'est PAS une erreur : c'est une
 * décision qui appartient au document de positionnement, pas au CI. On
 * l'annonce, on ne bloque pas dessus.
 */
export function assertRegistresValides(): void {
  const anomalies = validerRegistres();
  if (anomalies.length > 0) {
    const detail = anomalies
      .map((a) => `  · [${a.registre}] ${a.id} : ${a.probleme}`)
      .join("\n");
    throw new Error(`Registres incohérents (${anomalies.length}) :\n${detail}`);
  }

  if (taxonomieOffresNonTranchee() && process.env.NODE_ENV !== "test") {
    console.warn(
      "[registres] Taxonomie d'offre encore provisoire : deux taxonomies cohabitent " +
        "dans src/lib/registry/ciblage.ts. Le document de positionnement tranchera. " +
        "Aucun composant n'en dépend.",
    );
  }
}
