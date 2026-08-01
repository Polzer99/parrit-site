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
} from "../src/lib/registry/cta";
import { getPreuve, metriqueAffichable } from "../src/lib/registry/preuves";
import { getRessource, getRessourcesPubliees } from "../src/lib/registry/ressources";

const TEMPLATES = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"] as const;

/* ------------------------------------------------------------- registres */

test.describe("registre des CTA", () => {
  test("une page ne peut pas porter deux actions principales", () => {
    expect(() => assertSinglePrincipal(["rdv.paul"])).not.toThrow();
    expect(() => assertSinglePrincipal(["rdv.paul", "ressource.telecharger"])).not.toThrow();
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
    expect(metriqueAffichable({ ...p!, methodeMesure: undefined })).toBe(false);
    expect(metriqueAffichable({ ...p!, periode: undefined })).toBe(false);
  });

  test("une preuve sans métrique reste affichable, sans son chiffre", () => {
    const p = getPreuve("preuve.capture-site");
    expect(p).toBeDefined();
    expect(metriqueAffichable(p!)).toBe(false);
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
