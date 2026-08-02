import { expect, test } from "@playwright/test";

import {
  construireProfil,
  signauxDepuisDemandes,
  CONFIANCE_MINIMALE,
  type Signal,
} from "../src/lib/interet/profil";
import { AUCUNE_RESSOURCE, prochaineAction, selectNextResource } from "../src/lib/interet/selection";
import { construireMatrice } from "../src/lib/interet/couverture";
import { projeterLigne, organisationObservee, variablesPourLaCopie } from "../src/lib/interet/projection";
import { getRessource, getRessourcesPubliees } from "../src/lib/registry/ressources";
import type { Ressource } from "../src/lib/registry/ressources";

/**
 * MOTEUR D'INTÉRÊT — tout est pur, donc tout est testable sans base ni réseau.
 *
 * Chaque cas correspond à une situation réelle, pas à une ligne de couverture.
 */

const REGISTRE = getRessourcesPubliees();
const pilierDe = (slug: string) => getRessource(slug)?.pilier ?? null;

function demande(ressource: string, date: string, article?: string, canal?: string) {
  return {
    submission_id: `sub-${ressource}-${date}`,
    ressource_slug: ressource,
    article_slug: article,
    demande_le: date,
    attribution: canal ? { utm_source: canal } : undefined,
  };
}

/* ------------------------------------------------------------ premiers cas */

test("première ressource : un pilier, une confiance pleine, une suite proposée", () => {
  const signaux = signauxDepuisDemandes(
    [demande("architecture-claude-md", "2026-08-01T10:00:00Z", "securite-agents-ia-entreprise", "linkedin")],
    pilierDe,
  );
  const profil = construireProfil(signaux);

  expect(profil.dominant_pillar).toBe("agents-ia");
  expect(profil.confidence).toBe(1);
  expect(profil.engagement_level).toBe("tiede");
  expect(profil.nurture_state).toBe("nurture_automatique");
  expect(profil.resources_consumed).toEqual(["architecture-claude-md"]);

  const decision = selectNextResource({ ...profil }, REGISTRE);
  if (decision.ressource === AUCUNE_RESSOURCE) {
    // Acceptable seulement si le catalogue est réellement vide sur ce pilier.
    expect(decision.raison).toContain("agents-ia");
  } else {
    expect(decision.ressource.pilier).toBe("agents-ia");
    expect(decision.ressource.slug).not.toBe("architecture-claude-md");
    expect(decision.ressource.livraisonVerifiee).toBe(true);
  }
});

test("seconde ressource du même pilier : intention forte, la séquence s'arrête", () => {
  const signaux = signauxDepuisDemandes(
    [
      demande("architecture-claude-md", "2026-08-01T10:00:00Z"),
      demande("detecteur-bullshit", "2026-08-04T10:00:00Z"),
    ],
    pilierDe,
  );
  const profil = construireProfil(signaux);

  expect(profil.dominant_pillar).toBe("agents-ia");
  expect(profil.engagement_level).toBe("chaud");
  expect(profil.nurture_state).toBe("intention_forte");
  expect(profil.human_handoff_required).toBe(true);

  const decision = selectNextResource({ ...profil }, REGISTRE);
  const action = prochaineAction(profil, decision);
  expect(action.action).toBe("proposer_echange_humain");
});

test("signaux sur deux piliers à égalité : on se tait", () => {
  const signaux: Signal[] = [
    { nature: "vue_page", pilier: "agents-ia", date: "2026-08-01T10:00:00Z" },
    { nature: "vue_page", pilier: "logiciel-ia-sur-mesure", date: "2026-08-01T10:00:00Z" },
  ];
  const profil = construireProfil(signaux);

  expect(profil.confidence).toBe(0);
  expect(profil.confidence).toBeLessThan(CONFIANCE_MINIMALE);

  const decision = selectNextResource({ ...profil }, REGISTRE);
  expect(decision.ressource).toBe(AUCUNE_RESSOURCE);
  expect(prochaineAction(profil, decision).action).toBe("ne_rien_envoyer");
});

test("le signal explicite l'emporte sur la navigation passive", () => {
  const signaux: Signal[] = [
    { nature: "vue_page", pilier: "logiciel-ia-sur-mesure", date: "2026-08-01T10:00:00Z" },
    { nature: "vue_page", pilier: "logiciel-ia-sur-mesure", date: "2026-08-01T11:00:00Z" },
    { nature: "vue_page", pilier: "logiciel-ia-sur-mesure", date: "2026-08-01T12:00:00Z" },
    {
      nature: "ressource_demandee",
      pilier: "agents-ia",
      date: "2026-08-02T10:00:00Z",
      ressourceSlug: "architecture-claude-md",
    },
  ];
  const profil = construireProfil(signaux);
  // 100 contre 9 : une demande vaut plus que trois vues.
  expect(profil.dominant_pillar).toBe("agents-ia");
});

test("aucune ressource suivante quand le pilier est épuisé", () => {
  const duPilier = REGISTRE.filter((r) => r.pilier === "agents-ia").map((r) => r.slug);
  const profil = {
    dominant_pillar: "agents-ia" as const,
    confidence: 1,
    resources_consumed: duPilier,
    engagement_level: "chaud" as const,
    nurture_state: "nurture_automatique" as const,
  };

  const decision = selectNextResource(profil, REGISTRE);
  expect(decision.ressource).toBe(AUCUNE_RESSOURCE);
  expect(decision.raison).toContain("épuisé");
});

test("une ressource non publiée n'est jamais proposée", () => {
  const registre: Ressource[] = [
    { ...REGISTRE[0], slug: "brouillon", publiee: false, pilier: "agents-ia", livraisonVerifiee: true },
  ];
  const decision = selectNextResource(
    {
      dominant_pillar: "agents-ia",
      confidence: 1,
      resources_consumed: [],
      engagement_level: "chaud",
      nurture_state: "nurture_automatique",
    },
    registre,
  );
  expect(decision.ressource).toBe(AUCUNE_RESSOURCE);
  expect(decision.raison).toContain("non publiées");
});

test("une livraison non vérifiée exclut la ressource de toute séquence", () => {
  const registre: Ressource[] = [
    {
      ...REGISTRE[0],
      slug: "promesse-ouverte",
      publiee: true,
      pilier: "agents-ia",
      livraisonVerifiee: false,
    },
  ];
  const decision = selectNextResource(
    {
      dominant_pillar: "agents-ia",
      confidence: 1,
      resources_consumed: [],
      engagement_level: "chaud",
      nurture_state: "nurture_automatique",
    },
    registre,
  );
  expect(decision.ressource).toBe(AUCUNE_RESSOURCE);
  expect(decision.raison).toContain("livraison est vérifiée");
});

/* --------------------------------------------------------- faits humains */

test("une réponse arrête toute automatisation", () => {
  const signaux = signauxDepuisDemandes([demande("architecture-claude-md", "2026-08-01T10:00:00Z")], pilierDe);
  const profil = construireProfil(signaux, { aRepondu: true });

  expect(profil.nurture_state).toBe("handoff_humain");
  const decision = selectNextResource({ ...profil }, REGISTRE);
  expect(decision.ressource).toBe(AUCUNE_RESSOURCE);
  expect(prochaineAction(profil, decision).action).toBe("reprise_humaine");
});

test("un rendez-vous pris arrête toute automatisation", () => {
  const profil = construireProfil(
    signauxDepuisDemandes([demande("architecture-claude-md", "2026-08-01T10:00:00Z")], pilierDe),
    { aReserve: true },
  );
  expect(profil.nurture_state).toBe("handoff_humain");
  expect(profil.human_handoff_required).toBe(true);
});

/* ------------------------------------------------------------ idempotence */

test("rejouer le même submission_id ne change pas la ligne du cockpit", () => {
  const signaux = signauxDepuisDemandes([demande("architecture-claude-md", "2026-08-01T10:00:00Z")], pilierDe);
  const profil = construireProfil(signaux);
  const decision = selectNextResource({ ...profil }, REGISTRE);
  const action = prochaineAction(profil, decision);

  const commun = {
    email: "test@exemple.fr",
    profil,
    signaux,
    decision,
    action,
    maintenantIso: "2026-08-05T09:00:00Z",
    syncSupabase: "ok" as const,
  };

  const premiere = projeterLigne({ ...commun, submissionIds: ["sub-1"] });
  const rejeu = projeterLigne({ ...commun, submissionIds: ["sub-1"], ligneExistante: premiere });

  expect(rejeu.submission_ids).toBe("sub-1");
  expect(rejeu.ressources_consommees).toBe(premiere.ressources_consommees);
});

test("une nouvelle demande complète la ligne sans écraser l'historique", () => {
  const anterieure = {
    submission_ids: "sub-1",
    ressources_consommees: "demarrer-claude-code",
    premier_canal: "podcast",
  };

  const signaux = signauxDepuisDemandes(
    [demande("architecture-claude-md", "2026-08-03T10:00:00Z", undefined, "linkedin")],
    pilierDe,
  );
  const profil = construireProfil(signaux);
  const decision = selectNextResource({ ...profil }, REGISTRE);

  const ligne = projeterLigne({
    email: "test@exemple.fr",
    profil,
    signaux,
    decision,
    action: prochaineAction(profil, decision),
    submissionIds: ["sub-2"],
    maintenantIso: "2026-08-05T09:00:00Z",
    syncSupabase: "ok",
    ligneExistante: anterieure,
  });

  // Rien n'est perdu : les deux soumissions et les deux ressources coexistent.
  expect(ligne.submission_ids).toBe("sub-1, sub-2");
  expect(ligne.ressources_consommees).toContain("demarrer-claude-code");
  expect(ligne.ressources_consommees).toContain("architecture-claude-md");
  // Le premier canal est un fait daté : il ne se réécrit pas.
  expect(ligne.premier_canal).toBe("podcast");
  expect(ligne.dernier_canal).toBe("linkedin");
});

/* ------------------------------------------------------------ projection */

test("l'organisation se déduit du domaine, sans jamais la demander", () => {
  expect(organisationObservee("marie@grand-lille.cci.fr")).toBe("grand-lille.cci.fr");
  expect(organisationObservee("marie@gmail.com")).toBe("(adresse personnelle)");
});

test("les variables de copie ne contiennent aucun texte de message", () => {
  const signaux = signauxDepuisDemandes(
    [demande("architecture-claude-md", "2026-08-01T10:00:00Z", "securite-agents-ia-entreprise", "linkedin")],
    pilierDe,
  );
  const profil = construireProfil(signaux);
  const decision = selectNextResource({ ...profil }, REGISTRE);

  const v = variablesPourLaCopie({
    profil,
    signaux,
    decision,
    action: prochaineAction(profil, decision),
    registre: REGISTRE,
  });

  expect(v.pilier).toBe("agents-ia");
  expect(v.ressource_precedente).toBe("architecture-claude-md");
  expect(v.contexte_origine.article).toBe("securite-agents-ia-entreprise");
  expect(v.contexte_origine.canal).toBe("linkedin");
  expect(v.etat_handoff).toBe("nurture_automatique");
});

/* ------------------------------------------------------------- couverture */

test("la matrice rend visibles les trous du catalogue", () => {
  const matrice = construireMatrice(REGISTRE, { "agents-ia": 5, "formation-agents-ia": 0 });

  expect(matrice.piliers.length).toBeGreaterThan(0);
  // Chaque pilier dit ce qui lui manque, ou rien.
  for (const p of matrice.piliers) {
    expect(typeof p.pilier).toBe("string");
    expect(Array.isArray(p.niveauxVides)).toBe(true);
  }

  const enManque = matrice.piliers.filter((p) => p.manque !== null);
  if (enManque.length > 0) {
    expect(matrice.prochaineRessourceAProduire).not.toBeNull();
  }
});

test("le harnais IA, promesse sans livrable, est exclu des séquences", () => {
  const harnais = getRessource("harnais-ia");
  expect(harnais).toBeDefined();
  expect(harnais!.livraisonVerifiee).toBe(false);

  const decision = selectNextResource(
    {
      dominant_pillar: harnais!.pilier,
      confidence: 1,
      resources_consumed: [],
      engagement_level: "chaud",
      nurture_state: "nurture_automatique",
    },
    [harnais!],
  );
  expect(decision.ressource).toBe(AUCUNE_RESSOURCE);
});
