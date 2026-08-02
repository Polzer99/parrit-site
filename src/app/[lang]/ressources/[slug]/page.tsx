import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { T3Ressource } from "@/components/templates/T3Ressource";
import { SITE_URL } from "@/lib/seo/jsonld";
import {
  getRessource,
  getRessourcesPubliees,
  getRessourcesRenduesParTemplate,
  urlExperience,
} from "@/lib/registry";
import { hasLocale, locales } from "../../dictionaries";
import { LIBELLES } from "../../pilote-libelles";

/**
 * PAGE RESSOURCE.
 *
 * La donnée vient du registre — `src/lib/registry/ressources.ts` — et non d'un
 * tableau recopié dans la page. Ajouter une ressource au registre suffit à
 * créer sa page, son entrée d'index et son maillage.
 *
 * Le template refuse de promettre un envoi par courriel quand
 * `livraisonVerifiee` est faux : le message de confirmation ne joint aujourd'hui
 * aucune ressource, donc la page donne le lien à l'écran.
 *
 * ARBITRAGE PAUL DU 02/08/2026 — cette route ne rend QUE les ressources dont
 * l'expérience complète vit ici (`experience.rendu === "template"`). Celles dont
 * l'expérience existe déjà à une route dédiée sont redirigées en 301 par
 * `next.config.ts`, avant tout rendu : elles ne passent jamais par ce fichier.
 * Une fiche descriptive qui obligerait à recliquer n'est plus une destination.
 *
 * Aujourd'hui, les six ressources publiées sont toutes en route dédiée. Ce
 * fichier ne rend donc rien — et c'est exactement ce qui est voulu. Le jour où
 * une ressource autoportante arrive, elle passe en `template` et cette route la
 * sert, sans que rien d'autre ne bouge.
 */
export function generateStaticParams() {
  const slugs = getRessourcesRenduesParTemplate().map((r) => r.slug);
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const r = getRessource(slug);
  if (!hasLocale(lang) || !r) return {};

  return {
    metadataBase: new URL(SITE_URL),
    title: `${r.titre} | Parrit.ai`,
    description: r.promesse,
    alternates: { canonical: `${SITE_URL}/${lang}/ressources/${r.slug}` },
    openGraph: {
      title: r.titre,
      description: r.promesse,
      url: `${SITE_URL}/${lang}/ressources/${r.slug}`,
      siteName: "Parrit.ai",
      type: "article",
    },
  };
}

export default async function RessourcePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const r = getRessource(slug);
  // Une ressource servie par une route dédiée est redirigée en amont. Si on
  // arrive ici malgré tout, on ne rend surtout pas la fiche que l'arbitrage
  // supprime.
  if (!r || r.experience.rendu !== "template") notFound();

  const l = LIBELLES[lang] ?? LIBELLES.fr;

  // Les ressources liées visent l'expérience, jamais une fiche intermédiaire.
  const liees = getRessourcesPubliees()
    .filter((autre) => autre.slug !== r.slug && autre.langue === r.langue)
    .slice(0, 3)
    .map((autre) => ({
      slug: autre.slug,
      href: urlExperience(autre, lang),
      titre: autre.titre,
      meta: autre.type,
    }));

  return (
    <T3Ressource
      ressource={r}
      lang={lang}
      /* Preuve rattachée : le harnais IA documente la dérive de coût réelle. */
      preuveRefs={r.slug === "harnais-ia" ? ["preuve.derive-openrouter"] : []}
      ressourcesLiees={liees}
      labels={{
        ressources: l.ressources.nav,
        obtenez: l.ressources.obtenez,
        autres: l.ressources.autres,
      }}
    />
  );
}
