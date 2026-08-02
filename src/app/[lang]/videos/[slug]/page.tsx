import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { T2Video } from "@/components/templates/T2Video";
import { SITE_URL } from "@/lib/seo/jsonld";
import { getVideo, getVideoSlugs } from "@/lib/videos";
import { hasLocale, locales } from "../../dictionaries";
import { LIBELLES } from "../../pilote-libelles";

/**
 * Aucune vidéo n'est publiée : `generateStaticParams` renvoie une liste vide et
 * la route ne génère aucune page. Elle existe, elle compile, elle est testée.
 *
 * Le jour où une entrée `published` apparaît dans `src/lib/videos.ts`, sa page
 * se génère toute seule — sans qu'une ligne de ce fichier change.
 */
export function generateStaticParams() {
  const slugs = getVideoSlugs();
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const v = getVideo(slug);
  if (!hasLocale(lang) || !v) return {};

  return {
    metadataBase: new URL(SITE_URL),
    title: `${v.titre} | Parrit.ai`,
    description: v.description,
    alternates: { canonical: `${SITE_URL}/${lang}/videos/${v.slug}` },
    openGraph: {
      title: v.titre,
      description: v.description,
      url: `${SITE_URL}/${lang}/videos/${v.slug}`,
      type: "video.other",
    },
  };
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const v = getVideo(slug);
  if (!v) notFound();

  const l = LIBELLES[lang] ?? LIBELLES.fr;

  return (
    <T2Video
      lang={lang}
      ctaId="rdv.paul"
      data={{
        slug: v.slug,
        titre: v.titre,
        description: v.description,
        media: v.media,
        auteur: { nom: "Paul Larmaraud", slug: v.auteurSlug },
        resumeStructure: v.resumeStructure,
        videosLiees: [],
      }}
      labels={{
        videos: l.videos.nav,
        resume: l.article.tldr,
        transcript: "Transcript",
        aVoir: l.article.lireEnsuite,
      }}
    />
  );
}
