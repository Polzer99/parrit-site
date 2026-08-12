import type { Metadata } from "next";
import Link from "next/link";
import { INSPIRATIONS, FAMILY_LABEL, CAPTURED_AT, type Family } from "../_lib/inspirations";
import Reveal from "../_components/Reveal";
import { Section, Wrap, Head, Stack } from "../_components/kit";
import "./inspirations.css";

export const metadata: Metadata = {
  title: "Inspirations · Parrit Brand Lab",
  robots: { index: false, follow: false },
};

const FAMILIES: { key: Family; title: string; sub: string }[] = [
  {
    key: "paul",
    title: "Paul",
    sub: "Raison, conquête, systèmes. Palantir et Linear pour la tenue, Wispr Flow pour la simplicité.",
  },
  {
    key: "maxime",
    title: "Maxime",
    sub: "Cœur, confiance, apprentissage. La mécanique des marques personnelles, le sérieux d'un dirigeant.",
  },
  {
    key: "parrit",
    title: "Parrit",
    sub: "Expansion, maîtrise, permanence. Aman et Bang & Olufsen pour la retenue, Apple pour la simplicité produit.",
  },
];

function RefCard({ slug }: { slug: string }) {
  const ref = INSPIRATIONS.find((r) => r.slug === slug);
  if (!ref) return null;
  const host = new URL(ref.url).host.replace(/^www\./, "");
  return (
    <Reveal>
      <article className={`insp${ref.noShot ? " insp--noshot" : ""}`}>
        {ref.noShot ? (
          /* Référence doctrinale : aucune capture, volontairement. Montrer un
             site dont on rejette la forme reviendrait à le proposer comme
             modèle. On affiche la raison du retrait à la place. */
          <div className="insp__plate">
            <span className="lab-label lab-label--signal">Aucune capture</span>
            <p className="insp__plate__why">
              Retirée du moodboard visuel. Seule la doctrine est retenue.
            </p>
          </div>
        ) : (
          <div className="insp__shots">
            <a
              className="insp__shot"
              href={ref.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Ouvrir ${ref.name}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/brand-lab/refs/${ref.slug}.jpg`} alt={`Capture de ${ref.name}, desktop`} loading="lazy" />
            </a>
            <div className="insp__shot insp__shot--m">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/brand-lab/refs/${ref.slug}-m.jpg`} alt={`Capture de ${ref.name}, mobile`} loading="lazy" />
            </div>
          </div>
        )}

        <div className="insp__body">
          <div className="insp__head">
            <h3 className="lab-h3">{ref.name}</h3>
            <a className="insp__url" href={ref.url} target="_blank" rel="noreferrer noopener">
              {host}
            </a>
          </div>

          {ref.doctrineOnly ? (
            <span className="lab-badge">
              <i className="lab-dot" aria-hidden />
              Doctrine seulement, aucune influence de forme
            </span>
          ) : null}

          <p className="insp__observed">
            <span className="lab-label">Ce qu&apos;on a regardé</span>
            {ref.observed}
          </p>

          <div className="insp__cols">
            <div className="insp__col insp__col--take">
              <span className="lab-label lab-label--signal">TAKE</span>
              <ul>
                {ref.take.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="insp__col insp__col--avoid">
              <span className="lab-label">AVOID</span>
              <ul>
                {ref.avoid.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="insp__applied">
            <span className="lab-label">Ce qu&apos;on en a fait dans le lab</span>
            {ref.applied}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

export default function InspirationsPage() {
  return (
    <main className="t-lab">
      <Section variant="flush">
        <Wrap size="wide">
          <Stack gap={6}>
            <div className="insp__hero">
              <span className="lab-num">00</span>
              <h1 className="lab-h1">Ce que nous regardons, et ce que nous refusons.</h1>
              <p className="lab-lead" style={{ maxWidth: "48ch" }}>
                Dix-sept références, capturées le {CAPTURED_AT}. Pour chacune : ce qui a
                été observé, ce qu&apos;on prend, ce qu&apos;on laisse, et la décision de
                design que ça a produite dans les trois prototypes.
              </p>
              <p className="lab-body">
                Un site change. Ces captures sont un moodboard interne daté, pas une
                archive. Elles servent à comprendre une composition, un rythme, une
                densité, une hiérarchie. Aucune n&apos;est un gabarit.
              </p>
              <div className="lab-cta-row">
                <Link className="lab-btn" href="/brand-lab/paul">
                  Voir Paul
                </Link>
                <Link className="lab-btn lab-btn--ghost" href="/brand-lab/maxime">
                  Voir Maxime
                </Link>
                <Link className="lab-btn lab-btn--ghost" href="/brand-lab/parrit">
                  Voir Parrit
                </Link>
              </div>
            </div>
          </Stack>
        </Wrap>
      </Section>

      {FAMILIES.map((fam, i) => {
        const refs = INSPIRATIONS.filter((r) => r.families.includes(fam.key));
        return (
          <Section key={fam.key} id={fam.key}>
            <Wrap size="wide">
              <Head
                num={String(i + 1).padStart(2, "0")}
                label={FAMILY_LABEL[fam.key]}
                title={fam.title}
                lead={fam.sub}
              />
              <div className="insp__list">
                {refs.map((r) => (
                  <RefCard key={`${fam.key}-${r.slug}`} slug={r.slug} />
                ))}
              </div>
            </Wrap>
          </Section>
        );
      })}

      <Section id="interdits">
        <Wrap size="wide">
          <Head
            num="04"
            label="Garde-fous"
            title="Ce qui ne sera produit dans aucune des trois directions."
            lead="La liste n'est pas une préférence de goût. Chaque entrée est un raccourci que le marché prend à notre place, et qui nous ferait ressembler à tout le monde."
          />
          <div className="insp__bans">
            {[
              "Cerveau, réseau de neurones, constellation de nœuds",
              "Orbe futuriste, robot, agent flottant",
              "Dégradés de startup IA, noir et violet",
              "Noir et or de faux luxe",
              "Fond spatial, halo, néon",
              "Photo de banque d'images, poignée de main",
              "Tableau de bord fictif avec de faux chiffres",
              "Logo client non autorisé",
              "Métrique inventée, ROI promis",
              "Gabarit d'agence, composant générique recoloré",
              "Collection de drapeaux, globe, carte du monde cliché",
              "Idéogramme posé pour dire international",
            ].map((b) => (
              <span key={b} className="insp__ban">
                {b}
              </span>
            ))}
          </div>
          <p className="lab-body" style={{ marginTop: "2rem" }}>
            Sur l&apos;international : l&apos;ancienne identité liée au Costa Rica et au
            sceau chinois ne contraint plus ce travail. L&apos;ambition doit se lire dans
            la tenue, pas dans un symbole géographique. Le logo est hors périmètre de
            cette tranche.
          </p>
        </Wrap>
      </Section>

      <Section id="regle" variant="alt">
        <Wrap size="text">
          <Stack gap={4}>
            <span className="lab-label">Règle légale et créative</span>
            <h2 className="lab-h3">
              Nous extrayons des principes. Nous ne reproduisons pas des marques.
            </h2>
            <p className="lab-body">
              Ce qui se prend : la composition, le rythme, la densité, l&apos;architecture,
              le mouvement, la relation entre le texte et l&apos;image, la hiérarchie, la
              mécanique de conversion. Ce qui ne se prend jamais : un logo, une
              iconographie propriétaire, un wording, une combinaison distinctive exacte,
              une composition au pixel, une identité commerciale.
            </p>
            <p className="lab-body">
              Cette page est un moodboard interne. Elle porte noindex, elle est refusée
              aux robots, et elle n&apos;a pas vocation à sortir de l&apos;atelier.
            </p>
          </Stack>
        </Wrap>
      </Section>

      <footer className="lab-foot">
        <Wrap size="wide">
          Parrit Brand Lab · interne · captures du {CAPTURED_AT} ·{" "}
          <code>node scripts/brand-lab-capture.mjs --force</code> pour rafraîchir
        </Wrap>
      </footer>
    </main>
  );
}
