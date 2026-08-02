/**
 * Contrats de la grammaire de pages.
 *
 * Ces tests vérifient les règles qui, si elles cèdent, ramènent exactement la
 * dette que les templates viennent de solder : un libellé de CTA en dur, un
 * chiffre sans méthode, deux actions de même poids, un lien sans `source`.
 *
 *   npm run start   (ou: npx next start -p 3000)
 *   npx playwright test tests/template-grammar.spec.ts
 */

import { expect, test } from "@playwright/test";

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";
const url = (p: string) => new URL(p, BASE_URL).toString();

import {
  assertSinglePrincipal,
  ctaHref,
  getCta,
  getOffre,
  getOffres,
  getPreuve,
  getRessource,
  getRessourcesPubliees,
  getTaxonomies,
  libelleOrganisation,
  logoAutorise,
  metriqueAffichable,
  nominatifAutorise,
  offreHref,
  preuvesPubliables,
  validerRegistres,
  type Preuve,
} from "../src/lib/registry";
import {
  adaptersEnregistres,
  dureeISO,
  enregistrerAdapter,
  resolveVideo,
  type VideoSource,
} from "../src/lib/video/contract";

const TEMPLATES = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"] as const;

/* ------------------------------------------------------------- registres */

test.describe("registre des CTA", () => {
  test("une page ne peut pas porter deux actions principales", () => {
    expect(() => assertSinglePrincipal(["rdv.paul"])).not.toThrow();
    expect(() => assertSinglePrincipal(["rdv.paul", "prototype.demander"])).not.toThrow();
    expect(() => assertSinglePrincipal(["rdv.paul", "diagnostic.decrire_mon_cas"])).toThrow(
      /Deux CTA principaux/,
    );
  });

  test("toute destination interne porte son `source`", () => {
    const href = ctaHref("rdv.paul", "fr", "blog:mon-article");
    expect(href).toBe("/fr/rendez-vous?source=blog%3Amon-article");
  });

  test("une ancre et un mailto ne sont pas réécrits", () => {
    expect(ctaHref("ressource.demander", "fr", "x")).toBe("#capture");
    expect(ctaHref("presse.contact", "fr", "x")).toBe("mailto:paul.larmaraud@parrit.ai");
  });

  test("le CTA du diagnostic ne prétend plus réserver quoi que ce soit", () => {
    // Le libellé « Réserver un diagnostic de faisabilité » pointait un outil
    // conversationnel qui ne réserve rien (02-ROUTES §B).
    expect(getCta("diagnostic.decrire_mon_cas").libelle).not.toMatch(/réserv/i);
  });
});

test.describe("registre des preuves", () => {
  test("un chiffre sans période ni méthode ne s'affiche pas", () => {
    const p = getPreuve("preuve.derive-openrouter");
    expect(p).toBeDefined();
    expect(metriqueAffichable(p!)).toBe(true);
    expect(
      metriqueAffichable({ ...p!, mesure: { ...p!.mesure!, methodeMesure: "" } }),
    ).toBe(false);
    expect(metriqueAffichable({ ...p!, mesure: { ...p!.mesure!, periode: "" } })).toBe(false);
  });

  test("une preuve sans métrique reste affichable, sans son chiffre", () => {
    const p = getPreuve("preuve.capture-site");
    expect(p).toBeDefined();
    expect(metriqueAffichable(p!)).toBe(false);
    expect(preuvesPubliables([p!])).toHaveLength(1);
  });

  test("les huit natures de preuve passent le même contrat de lecture", () => {
    const natures: Preuve["type"][] = [
      "preuve_interne",
      "systeme_en_fonctionnement",
      "trace",
      "metrique_interne",
      "cas_anonymise",
      "temoignage",
      "media",
      "client_nominatif_autorise",
    ];
    for (const type of natures) {
      const p: Preuve = {
        id: `preuve.type-${type.replace(/_/g, "-")}`,
        type,
        titre: "t",
        description: "d",
        niveauPreuve: 3,
        source: "s",
        confidentialite: "publiable",
      };
      // Aucune nature n'exige de charge utile pour être lue et filtrée.
      expect(() => preuvesPubliables([p])).not.toThrow();
      expect(metriqueAffichable(p)).toBe(false);
      expect(nominatifAutorise(p)).toBe(true);
    }
  });

  test("une preuve nominative sans autorisation est filtrée, pas affichée à moitié", () => {
    const base: Preuve = {
      id: "preuve.nominative-test",
      type: "client_nominatif_autorise",
      titre: "t",
      description: "d",
      niveauPreuve: 5,
      source: "s",
      confidentialite: "publiable",
      descriptifAnonymise: "Un groupe industriel européen",
      nominatif: { organisation: "Organisation Test", logo: "/x.svg", publicationPermission: false },
    };

    expect(nominatifAutorise(base)).toBe(false);
    expect(preuvesPubliables([base])).toHaveLength(0);
    // Sans permission : ni le nom, ni le logo. Le descriptif anonymisé prend le relais.
    expect(libelleOrganisation(base)).toBe("Un groupe industriel européen");
    expect(logoAutorise(base)).toBeNull();

    const autorisee: Preuve = {
      ...base,
      nominatif: { ...base.nominatif!, publicationPermission: true },
    };
    expect(preuvesPubliables([autorisee])).toHaveLength(1);
    expect(libelleOrganisation(autorisee)).toBe("Organisation Test");
    expect(logoAutorise(autorisee)).toBe("/x.svg");
  });

  test("aucune preuve du registre n'exige un nom ni un logo pour être lue", () => {
    for (const p of preuvesPubliables(
      ["preuve.derive-openrouter", "preuve.capture-site", "preuve.circuit-breaker",
       "preuve.trace-coupe-circuit", "preuve.consolidation-gate", "preuve.atelier-cartographie"]
        .map((id) => getPreuve(id)!)
    )) {
      expect(p.nominatif).toBeUndefined();
    }
  });
});

test.describe("ciblage — les offres restent configurables", () => {
  test("les deux taxonomies cohabitent sans être fusionnées", () => {
    const taxonomies = getTaxonomies();
    expect(taxonomies).toContain("trois-offres");
    expect(taxonomies).toContain("paliers");
    // Le nombre d'offres est de la DONNÉE : aucun composant ne le code.
    expect(getOffres("trois-offres").length).toBe(3);
    expect(getOffres("paliers").length).toBe(7);
  });

  test("une référence d'offre inconnue ne casse rien, elle ne rend rien", () => {
    expect(getOffre("offre.inexistante")).toBeUndefined();
    expect(offreHref("offre.inexistante", "fr")).toBeNull();
  });

  test("aucun libellé de CTA ne nomme une taxonomie d'offre", () => {
    const interdits = /palier|niveau\s*N[1-7]|croissance|deployer|transmettre/i;
    for (const id of [
      "rdv.paul", "rdv.systeme", "rdv.offre", "rdv.auteur",
      "diagnostic.decrire_mon_cas", "ressource.demander", "ressource.telecharger",
      "veille.recevoir", "prototype.demander", "presse.kit", "presse.contact",
    ] as const) {
      expect(getCta(id).libelle).not.toMatch(interdits);
    }
  });
});

test.describe("contrat vidéo — neutre vis-à-vis de l'hébergeur", () => {
  const source: VideoSource = {
    provider: "test",
    externalId: "abc",
    canonicalUrl: "/a.mp4",
    embedUrl: "/a.mp4",
    thumbnail: "/a.jpg",
    duration: 372,
    publicationDate: "2026-08-01",
    transcript: [{ t: "00:00", texte: "x" }],
    chapters: [],
    captions: [],
  };

  test("aucun hébergeur n'est présélectionné", () => {
    expect(adaptersEnregistres()).toEqual([]);
  });

  test("une donnée complète se résout sans adapter", () => {
    expect(resolveVideo(source).embedUrl).toBe("/a.mp4");
  });

  test("un provider sans URL ni adapter échoue en nommant la décision manquante", () => {
    const nue = { ...source, canonicalUrl: undefined, embedUrl: undefined, thumbnail: undefined };
    expect(() => resolveVideo(nue)).toThrow(/adapter|tranch/i);
  });

  test("un adapter enregistré construit les URL sans toucher au template", () => {
    enregistrerAdapter({
      provider: "fictif",
      canonicalUrl: (id) => `https://exemple.test/v/${id}`,
      embedUrl: (id) => `https://exemple.test/e/${id}`,
      thumbnail: (id) => `https://exemple.test/t/${id}.jpg`,
    });
    const resolu = resolveVideo({
      ...source,
      provider: "fictif",
      canonicalUrl: undefined,
      embedUrl: undefined,
      thumbnail: undefined,
    });
    expect(resolu.embedUrl).toBe("https://exemple.test/e/abc");
    expect(resolu.thumbnail).toBe("https://exemple.test/t/abc.jpg");
  });

  test("une vidéo sans transcript est refusée", () => {
    expect(() => resolveVideo({ ...source, transcript: [] })).toThrow(/transcript/i);
  });

  test("la durée ISO 8601 est correcte", () => {
    expect(dureeISO(372)).toBe("PT6M12S");
    expect(dureeISO(3661)).toBe("PT1H1M1S");
  });
});

test.describe("validation des registres", () => {
  test("les trois registres sont cohérents", () => {
    expect(validerRegistres()).toEqual([]);
  });
});

test.describe("registre des ressources", () => {
  test("une ressource dont la livraison n'est pas vérifiée est marquée comme telle", () => {
    // Le mail de confirmation n8n est générique et ne joint rien : la page ne
    // doit donc pas promettre un envoi.
    expect(getRessource("harnais-ia")?.livraisonVerifiee).toBe(false);
  });

  test("la ressource anglophone est publiée et cesse d'être orpheline", () => {
    expect(getRessourcesPubliees("en").map((r) => r.slug)).toContain("hr-radar");
  });
});

/* ---------------------------------------------------------------- rendu */

test.describe("rendu des huit templates", () => {
  for (const t of TEMPLATES) {
    test(`${t} — un seul h1, un graphe valide, des liens attribués`, async ({ page }) => {
      const reponse = await page.goto(url(`/template-grammar/${t}`));
      expect(reponse?.status()).toBe(200);

      await expect(page.locator("h1")).toHaveCount(1);

      const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(scripts.length).toBeGreaterThan(0);
      const graphe = JSON.parse(scripts[0]);
      expect(graphe["@context"]).toBe("https://schema.org");
      expect(Array.isArray(graphe["@graph"])).toBe(true);
      expect(graphe["@graph"].length).toBeGreaterThan(0);

      // Aucun CTA anonyme : tout ce qui est instrumenté porte son identifiant
      // de registre, sinon le libellé est revenu en dur quelque part.
      const ctas = page.locator('[data-ph="cta"]');
      const n = await ctas.count();
      for (let i = 0; i < n; i++) {
        await expect(ctas.nth(i)).toHaveAttribute("data-cta-id", /.+/);
      }

      // Aucune destination interne sans `source`.
      const liens = await page.locator("a[data-cta-id]").evaluateAll((els) =>
        els.map((e) => (e as HTMLAnchorElement).getAttribute("href") ?? ""),
      );
      for (const href of liens) {
        if (href.startsWith("/") ) {
          expect(href).toContain("source=");
        }
      }
    });
  }

  test("le logotype n'est jamais retapé en texte", async ({ page }) => {
    await page.goto(url("/template-grammar/t1"));
    const logo = page.locator('header img[alt="Parrit.ai"]');
    await expect(logo).toHaveCount(1);
    await expect(logo).toHaveAttribute("src", /\.svg$/);
  });

  test("le pied de page légal n'existe qu'une fois", async ({ page }) => {
    await page.goto(url("/template-grammar/t4"));
    await expect(page.getByText("SASU PARRIT.AI")).toHaveCount(1);
  });
});
