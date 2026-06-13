import Link from "next/link";
import QuickContact from "@/components/QuickContact";

const SITE_URL = "https://parrit.ai";

const waitlistStrings = {
  label: "Ton email",
  placeholder: "ton@email.pro",
  submit: "Rejoindre",
  submitting: "…",
  thanks: "C'est noté. Je te préviens dès qu'un module sort.",
  error: "Oups, réessaie dans un instant.",
  micro: "Les 10 premiers modules sont gratuits. Zéro spam.",
};

const steps = [
  {
    n: "01",
    t: "Des modules courts, du concret",
    d: "10 minutes maximum, qu'on peut passer en accéléré. Tu repars de chaque module avec un truc utile que tu ne soupçonnais pas que ton ordinateur savait faire.",
  },
  {
    n: "02",
    t: "Tu demandes ton module",
    d: "Dis le sujet qui te bloque, en français. On le produit vite et il rejoint l'académie. Ce que tu demandes sert à tout le monde.",
  },
  {
    n: "03",
    t: "De gratuit à sur-mesure",
    d: "Les 10 premiers modules sont gratuits. Ensuite, l'accès complet. Et si tu veux, Paul craque TON sujet et te tourne la vidéo.",
  },
];

const modules = [
  { n: "01", t: "C'est quoi Claude Code (et pourquoi c'est pas ChatGPT)", h: "Tout le monde connaît ChatGPT. Personne ne connaît le truc qui agit pour toi.", free: true },
  { n: "02", t: "Un site web propre, fait ce soir, en parlant", h: "Je n'ai jamais codé. À 23h mon site était en ligne.", free: true },
  { n: "03", t: "Ta boîte mail se vide toute seule pendant que tu dors", h: "200 mails non lus. Le matin, 40 réponses déjà écrites.", free: true },
  { n: "04", t: "Tu parles 30 secondes, ça devient une fiche", h: "Note vocale dans la voiture. Arrivé chez moi, la fiche est remplie.", free: true },
  { n: "05", t: "Ton portrait pro en 2 minutes, sans photographe", h: "Cette photo de moi, sans appareil. Juste une phrase tapée.", free: true },
  { n: "06", t: "La mémoire : il ne te fait jamais répéter", h: "Je ne lui réexplique jamais qui je suis. Il s'en souvient.", free: true },
  { n: "07", t: "Ta première compétence réutilisable", h: "Appris une fois. Refait parfait à chaque fois.", free: true },
  { n: "08", t: "Ton agenda Google devient ta télécommande de boîte", h: "J'écris un V devant un rendez-vous, tout mon back-office bouge.", free: true },
  { n: "09", t: "Tes décisions arrivent en cartes : tu glisses", h: "Le matin, je swipe mes décisions, une par une.", free: true },
  { n: "10", t: "Ton premier client trouvé pendant que tu dors", h: "Cette nuit, mon ordi a lu 60 podcasts et m'a sorti 3 clients.", free: true },
  { n: "11", t: "De 1850 prospects bruts à 783 vraies pépites", h: "J'ai exporté 1850 contacts. Claude Code en a jeté la moitié. Tant mieux.", free: false },
  { n: "12", t: "Le cold email qui ne ressemble pas à un cold email", h: "99% finissent en spam. Voilà comment écrire l'autre.", free: false },
  { n: "13", t: "La propale qui te prévient quand le client la lit", h: "Ouverte à 22h14. Mon téléphone a sonné.", free: false },
  { n: "14", t: "Ton chiffre d'affaires en direct, chaque matin", h: "À 7h, je sais ce que j'ai facturé ce mois. Sans Excel.", free: false },
  { n: "15", t: "Une équipe d'assistants qui bossent pendant que tu dors", h: "5 assistants ont bossé sur mon business. J'ai lu le résumé au réveil.", free: false },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Claude Code Academy",
  description:
    "Des modules courts pour apprendre à faire agir son ordinateur avec Claude Code. Les 10 premiers sont gratuits.",
  inLanguage: "fr",
  url: `${SITE_URL}/academy`,
  provider: { "@type": "Organization", name: "Parrit.ai", url: SITE_URL },
};

export default function AcademyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="blog-nav">
        <Link href="/fr" className="nav-logo">Parrit.ai</Link>
        <Link href="/fondateurs" className="blog-nav-link">Qui est derrière</Link>
      </nav>

      <main className="aca">
        {/* HERO */}
        <section className="founders-hero">
          <p className="founders-eyebrow">CLAUDE CODE ACADEMY</p>
          <h1 className="founders-title">
            Fais agir<span className="it">ton ordinateur.</span>
          </h1>
          <p className="founders-lede">
            La plupart des gens discutent avec une IA. Ici, on apprend à la faire AGIR : ranger ses mails,
            sortir un site en une soirée, trouver des clients pendant qu'on dort. Des modules courts, concrets,
            prouvés sur le vrai quotidien de Paul. Tu repars à chaque fois avec un truc que tu ne soupçonnais pas.
          </p>
          <div className="aca-hero-form">
            <QuickContact strings={waitlistStrings} page="academy" variant="light" />
          </div>
        </section>

        {/* LE PRINCIPE */}
        <section className="landing-v4-section">
          <h2 className="landing-v4-section-title">Comment ça marche</h2>
          <div className="landing-v4-steps">
            {steps.map((s) => (
              <div className="landing-v4-step" key={s.n}>
                <div className="landing-v4-step-num">{s.n}</div>
                <div>
                  <p className="landing-v4-step-title">{s.t}</p>
                  <p className="landing-v4-step-desc">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SAISON 1 */}
        <section className="landing-v4-section">
          <h2 className="landing-v4-section-title">La Saison 1</h2>
          <div className="aca-mods">
            {modules.slice(0, 10).map((m) => (
              <div className="aca-mod" key={m.n}>
                <div className="aca-mod-n">{m.n}</div>
                <div className="aca-mod-body">
                  <div className="aca-mod-title">{m.t}</div>
                  <div className="aca-mod-hook">{m.h}</div>
                </div>
                <span className="aca-badge free">Gratuit</span>
              </div>
            ))}
            <div className="aca-divider">À partir d'ici, accès complet</div>
            {modules.slice(10).map((m) => (
              <div className="aca-mod" key={m.n}>
                <div className="aca-mod-n">{m.n}</div>
                <div className="aca-mod-body">
                  <div className="aca-mod-title">{m.t}</div>
                  <div className="aca-mod-hook">{m.h}</div>
                </div>
                <span className="aca-badge paid">Abonné</span>
              </div>
            ))}
          </div>

          {/* DEMANDE UN MODULE */}
          <div className="aca-ask">
            <p className="aca-ask-title">Il te manque un module ?</p>
            <p className="aca-ask-sub">
              Dis-nous le sujet qui te bloque au quotidien, on le tourne. Rejoins la liste ci-dessous et glisse
              ta demande, les abonnés peuvent même faire craquer leur sujet par Paul en vidéo sur-mesure (à partir de 200 €).
            </p>
          </div>
        </section>

        {/* LE MODÈLE */}
        <section className="landing-v4-section">
          <h2 className="landing-v4-section-title">Le modèle</h2>
          <div className="landing-v4-grid">
            <div className="landing-v4-card" style={{ boxShadow: "4px 4px 0 #D1132F" }}>
              <p className="landing-v4-card-title">Gratuit</p>
              <p className="landing-v4-card-desc">Les 10 premiers modules. Sans compte, sans carte. De quoi te lancer pour de vrai.</p>
            </div>
            <div className="landing-v4-card" style={{ boxShadow: "4px 4px 0 #0C0C0D" }}>
              <p className="landing-v4-card-title">Abonné</p>
              <p className="landing-v4-card-desc">Tous les modules suivants, et les nouveaux qui sortent chaque semaine.</p>
            </div>
            <div className="landing-v4-card" style={{ boxShadow: "4px 4px 0 #D1132F" }}>
              <p className="landing-v4-card-title">Sur-mesure</p>
              <p className="landing-v4-card-desc">Paul craque TON sujet et te tourne la vidéo tuto. À partir de 200 €.</p>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="founders-close">
          <h2 className="founders-close-title">Rejoins la première promo</h2>
          <p className="founders-close-text">
            Laisse ton email : tu es prévenu à chaque nouveau module, et tu accèdes aux 10 premiers gratuitement.
            Construit par Paul Larmaraud &amp; Yukun Leng.{" "}
            <Link href="/fondateurs" style={{ color: "var(--parrit-red)", textDecoration: "underline" }}>Leur histoire</Link>.
          </p>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <QuickContact strings={waitlistStrings} page="academy-footer" variant="dark" />
          </div>
        </section>
      </main>

      <footer className="blog-footer">
        <p className="footer-legal" style={{ marginTop: 0 }}>
          © {new Date().getFullYear()} SASU PARRIT.AI · Rueil-Malmaison
        </p>
      </footer>
    </>
  );
}
