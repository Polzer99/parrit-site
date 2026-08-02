import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { T3Ressource } from "@/components/templates/T3Ressource";
import { SITE_URL } from "@/lib/seo/jsonld";
import { getAllRessourceSlugs, getRessource, getRessourcesPubliees } from "@/lib/registry";
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
 */
export function generateStaticParams() {
  const slugs = getAllRessourceSlugs();
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
  if (!r) notFound();

  const l = LIBELLES[lang] ?? LIBELLES.fr;

  const liees = getRessourcesPubliees()
    .filter((autre) => autre.slug !== r.slug && autre.langue === r.langue)
    .slice(0, 3)
    .map((autre) => ({
      slug: autre.slug,
      href: `/${lang}/ressources/${autre.slug}`,
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
