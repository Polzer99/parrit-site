"use client";

/**
 * HOMEPAGE-LEVEL0-V1 — premier écran commercial de la homepage française.
 *
 * Périmètre : hero + rail de preuve. Rien d'autre. Le reste de la homepage est
 * rendu inchangé par `HomeDeux`, juste en dessous.
 *
 * Ce composant ne redéfinit aucun style : il compose `HeroLevel0` et
 * `ProofRailLevel0` du design system et charge les tokens canoniques.
 *
 * Contrat complet : docs/design-system/HOMEPAGE-LEVEL0-V1.md
 */

import { useEffect, useRef } from "react";
import "@/styles/parrit-tokens.css";
import { HeroLevel0, ProofRailLevel0, type ProofItem } from "@/components/ds/level0";
import { track } from "@/lib/analytics";
import { HOMEPAGE_LEVEL0_VARIANT } from "@/lib/flags";

/* ---------------------------------------------------------------- contenu */

/**
 * Le rouge porte le passage central : parler → exécuter. C'est la causalité
 * de la promesse, pas un mot mis en valeur. Le titre reste entier lu en noir.
 */
const HERO = {
  eyebrow: "Agents en production",
  titleLead: "D’une IA qui parle à des agents qui",
  titleSignal: "exécutent.",
  ledeStrong: "Vous décrivez une tâche qui vous coûte du temps.",
  lede:
    "On définit l’entrée, la sortie, le périmètre et le propriétaire humain, " +
    "puis on met le système en production avec vos équipes.",
  conditions: [
    "Périmètre défini",
    "Accès encadrés",
    "Trace d’exécution",
    "Propriétaire nommé",
  ],
} as const;

/**
 * Preuves. Aucun chiffre, aucune durée, aucun nom de client.
 *
 * Les trois couples input → output sont ceux déjà publiés sur la homepage
 * actuelle (bloc « Input → Output » de `HomeDeux`) : ils sont validés et en
 * ligne. Le périmètre ajouté décrit ce que l'agent NE fait PAS, ce qui est la
 * promesse opératoire du canon et se vérifie, contrairement à une métrique.
 */
const PROOF: ProofItem[] = [
  {
    index: "01",
    input: "Un CRM rempli à la main",
    output: "Un CRM à jour tout seul",
    owner: "l’équipe commerciale",
    scope: "l’agent propose, personne n’écrit sans validation",
  },
  {
    index: "02",
    input: "Des sources de veille éparpillées",
    output: "Un mail, chaque matin",
    owner: "le dirigeant",
    scope: "lecture seule, aucun envoi automatique",
  },
  {
    index: "03",
    input: "Des devis tapés un par un",
    output: "Des devis prêts en un clic",
    owner: "l’administration des ventes",
    scope: "brouillon uniquement, la signature reste humaine",
  },
];

const PRIMARY_CTA = {
  label: "Décrire un workflow",
  href: "/diagnostic?source=home-level0",
} as const;

const SECONDARY_LINK = {
  label: "Voir des exemples",
  href: "#catalogue-agents",
} as const;

/* ------------------------------------------------------------------ vue */

export default function HomeLevel0() {
  const rootRef = useRef<HTMLDivElement>(null);
  /** Garde-fou : un rendu React ne doit pas produire un événement de vue. */
  const viewSent = useRef(false);
  const proofSent = useRef(false);
  const scrollSent = useRef(false);

  useEffect(() => {
    if (viewSent.current) return;
    viewSent.current = true;
    track("homepage_level0_view", {
      variant: HOMEPAGE_LEVEL0_VARIANT,
      route: "/fr",
      locale: "fr",
    });
  }, []);

  /** Le visiteur a-t-il atteint la preuve, puis dépassé le premier écran ? */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const proof = root.querySelector("[data-level0-proof]");
    const sentinel = root.querySelector("[data-level0-end]");
    if (!proof || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          if (entry.target === proof && !proofSent.current) {
            proofSent.current = true;
            track("homepage_level0_proof_interaction", {
              variant: HOMEPAGE_LEVEL0_VARIANT,
              route: "/fr",
              locale: "fr",
              element: "proof_rail",
              interaction: "viewed",
            });
          }

          if (entry.target === sentinel && !scrollSent.current) {
            scrollSent.current = true;
            track("homepage_level0_scroll_to_next_section", {
              variant: HOMEPAGE_LEVEL0_VARIANT,
              route: "/fr",
              locale: "fr",
              element: "section_end",
            });
          }
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(proof);
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  /** Clics : délégation, un seul écouteur, pas de handler par élément. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    function handleClick(event: MouseEvent): void {
      if (!(event.target instanceof Element)) return;
      const el = event.target.closest<HTMLElement>("[data-level0-action]");
      if (!el) return;

      const action = el.dataset.level0Action;
      const shared = {
        variant: HOMEPAGE_LEVEL0_VARIANT,
        route: "/fr",
        locale: "fr",
        label: el.textContent?.trim() ?? "",
        destination: el.getAttribute("href") ?? "",
      };

      if (action === "primary") {
        track("homepage_level0_primary_cta_click", { ...shared, element: "primary_cta" });
      } else if (action === "secondary") {
        track("homepage_level0_secondary_link_click", { ...shared, element: "secondary_link" });
      }
    }

    root.addEventListener("click", handleClick);
    return () => root.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      ref={rootRef}
      className="home-level0 parrit-grain"
      data-variant={HOMEPAGE_LEVEL0_VARIANT}
    >
      <div className="home-level0-inner">
        <HeroLevel0
          eyebrow={HERO.eyebrow}
          titleLead={HERO.titleLead}
          titleSignal={HERO.titleSignal}
          ledeStrong={HERO.ledeStrong}
          lede={HERO.lede}
          conditions={[...HERO.conditions]}
          primaryCta={PRIMARY_CTA}
          primaryCtaProps={{ "data-level0-action": "primary" }}
          secondaryLink={SECONDARY_LINK}
          secondaryLinkProps={{ "data-level0-action": "secondary" }}
        />

        <div data-level0-proof>
          <ProofRailLevel0
            /* Volontairement sans numéro : la section « Sur le terrain » juste
               en dessous porte déjà « 01 » et n'est pas dans le périmètre de
               cette tranche. Renuméroter la page entière viendra plus tard. */
            index=""
            label="Ce qui tourne"
            title="Vous posez le cas. On rend le résultat."
            lede="Trois workflows réels. Pour chacun, ce qui entre, ce qui sort, qui en reste propriétaire, et ce que l’agent ne fait pas."
            items={PROOF}
            itemProps={{ "data-level0-proof-item": "true" }}
          />
        </div>

        <div data-level0-end aria-hidden="true" />
      </div>
    </div>
  );
}
