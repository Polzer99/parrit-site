import { homeSectionHeadings } from "@/system/home-layers";
import type { Locale } from "@/system/locale";
import { MobileCarousel } from "./MobileCarousel";

const photos = [
  { id: "formation-equipes", width: 960, height: 1280,
    caption: { fr: "Prise en main par les équipes", en: "Teams taking AI in hand" },
    alt: { fr: "Paul Larmaraud accompagne une équipe réunie autour de tables devant un écran.", en: "Paul Larmaraud works with a team seated around tables in front of a screen." } },
  { id: "atelier-outils", width: 800, height: 836,
    caption: { fr: "Atelier sur vos outils", en: "Workshop on your tools" },
    alt: { fr: "Paul Larmaraud présente un schéma d'assistants à l'écran à une équipe munie d'ordinateurs.", en: "Paul Larmaraud presents a diagram of assistants on screen to a team using laptops." } },
  { id: "intervention-dirigeants", width: 960, height: 1281,
    caption: { fr: "Intervention devant des dirigeants", en: "Talk to business leaders" },
    alt: { fr: "Paul Larmaraud s'adresse au public, un microphone à la main.", en: "Paul Larmaraud speaks to an audience while holding a microphone." } },
] as const;

export function SessionPhotos({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  const title = homeSectionHeadings(locale).terrain[0];
  return <section className="field" id={fr ? "terrain" : "in-the-field"}><div className="wrap">
    <h2>{title}</h2>
    <p className="field-intro">{fr ? "Dans vos locaux, sur vos outils, avec vos équipes." : "On your premises, with your tools and your teams."}</p>
    <MobileCarousel className="session-mosaic" label={title}>
      {photos.map(({ id, width, height, caption, alt }, index) => {
        const base = `/photos/session/${id}`;
        const sizes = index === 0 ? "(max-width: 760px) calc(100vw - 40px), (max-width: 1160px) calc((100vw - 96px) * 2 / 3), 710px" : "(max-width: 760px) calc(100vw - 40px), (max-width: 1160px) calc((100vw - 96px) / 3), 355px";
        return <figure key={id} data-photo={id}>
          <picture>
            <source type="image/avif" srcSet={`${base}-480.avif 480w, ${base}-${width}.avif ${width}w`} sizes={sizes}/>
            <source type="image/webp" srcSet={`${base}-480.webp 480w, ${base}-${width}.webp ${width}w`} sizes={sizes}/>
            <img src={`${base}-${width}.webp`} width={width} height={height} loading="lazy" alt={alt[locale]}/>
          </picture>
          <figcaption>{caption[locale]}</figcaption>
        </figure>;
      })}
    </MobileCarousel>
  </div></section>;
}
