import { localizedPath, type Locale } from "@/system/locale";
import type { JournalEntrySummary } from "@/system/journal";
import { HOME_LAYERS, homeFaqJsonLd } from "@/system/home-layers";
import { JournalCard } from "./JournalCard";
import { HomeAnchorRedirect } from "./HomeAnchorRedirect";
import { SINGLE_PAGE_EN, PARTNER_OFFERS } from "@/system/single-page-copy";
import { ParritCalInline } from "./CalInline";
import { QuickCapture } from "./QuickCapture";
import { ContactIntentLink } from "./ContactIntentLink";
import { getSiteEvidence } from "@/lib/registry/preuves";
import { ClientLogoStrip, ResearchPartner } from "./PublicEvidence";
import { ServiceGrid } from "./ServiceGrid";
import { ConversationMotion } from "./ConversationMotion";
import { OntologyHero } from "./OntologyHero";
import { PathWalker } from "./PathWalker";
import { RevealOnView } from "./RevealOnView";
import { TechnologyBand } from "./TechnologyBand";
import { MobileCarousel } from "./MobileCarousel";
import { SessionPhotos } from "./SessionPhotos";
import { SectionEntrance } from "./SectionEntrance";
import { BrandConnector } from "./BrandConnector";
import { ServiceTasks } from "./ServiceTasks";
export function SinglePage({ locale, contactQuery = "", latestEntries = [] }: { locale: Locale; contactQuery?: string; latestEntries?: JournalEntrySummary[] }) {
 const copy = HOME_LAYERS[locale];
 const fr = locale === "fr";
 const clients = ["Laparra", "Clevery", "Forexpert", "Joone", "SNCF"].filter(id => getSiteEvidence(id, "home"));
 const t = (text: string) => fr ? text : SINGLE_PAGE_EN[text];
 return <main className="single-page" data-brand-mode="accessible"><ConversationMotion/><HomeAnchorRedirect locale={locale}/><SectionEntrance/>


<section className="hero"><div className="wrap">
  <OntologyHero locale={locale}>
    <div className="hero-intro">
      <h1>{t("Votre expertise est la matière première.")}{" "}<b>{t("Nous la mettons au travail.")}</b></h1>
      <div className="sub">
        <p>{t("Nous formons vos équipes à l'IA et construisons les outils qui leur manquent.")}</p>
        <div className="actions">
          <ContactIntentLink locale={locale} query={contactQuery} intent="projet" placement="hero" primary>{t("Parler d'un projet")}</ContactIntentLink>
          <ContactIntentLink locale={locale} query={contactQuery} intent="formation" placement="hero">{t("Former mes équipes")}</ContactIntentLink>
        </div>
      </div>
    </div>
  </OntologyHero>
</div></section>


<section id="references"><RevealOnView className="wrap">
  {clients.length > 0 && <><h2>{t("Ils travaillent")}{" "}<b>{t("avec nous.")}</b></h2>
  <ClientLogoStrip/>
  </>}
</RevealOnView></section>

<SessionPhotos locale={locale} contactQuery={contactQuery}/>

<section id={fr ? "offres" : "offers"} data-regime="ink"><div className="wrap">
  <h2>{copy.offersTitle}</h2>
  <MobileCarousel className="home-offers" label={copy.offersTitle}>
    {copy.offers.map(offer => <article className="home-offer" key={offer.intent}>
      <span className="offer-eyebrow">{offer.eyebrow}</span>
      <h3>{offer.title}</h3><p>{offer.description}</p>
      <ul>{offer.benefits.map(benefit => <li key={benefit}><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="m3 9 4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2"/></svg><span>{benefit}</span></li>)}</ul>
      <ContactIntentLink locale={locale} query={contactQuery} intent={offer.intent} placement="offres">{offer.action}</ContactIntentLink>
    </article>)}
  </MobileCarousel>
</div></section>

<section className="live" id={fr ? "en-production" : "in-production"}><div className="wrap">
  <span id="ce-qui-change" className="home-anchor-alias" aria-hidden="true"/><span id="what-changes" className="home-anchor-alias" aria-hidden="true"/>
  <h2>{t("Quelques applications")}{" "}<b>{t("concrètes.")}</b></h2>
  <p className="muted change-definition">{t("Un assistant, ou agent IA, fait une tâche selon vos règles et vous la soumet avant qu'elle parte.")}</p>
  <MobileCarousel className="scenes" label={fr ? "Applications concrètes" : "Real-world applications"}>
    <div className="scene">
      <div className="phone"><div className="bar">{t("Assistant du cabinet")}{" "}<i></i></div><div className="chat">
        <div className="msg a">{t("Bonjour Maître. 6 messages cette nuit, 3 demandent une action.")}</div>
        <div className="msg a">{t("1. Client A : demande de rendez-vous, réponse prête.\n2. Greffe : pièce reçue, classée au dossier.\n3. Client B : relance, réponse prête.")}</div>
        <div className="msg m">{t("Montre-moi la réponse au client A.")}</div>
        <div className="msg a">{t("Elle est dans votre messagerie, à relire avant envoi.")}</div>
        <div className="msg card"><b>{t("Dans sa messagerie")}</b>{t("Réponse au client A : brouillon prêt, à relire.")}</div>
      </div></div>
      <h3>{t("Chaque matin, un cabinet d'avocats trouve ses réponses déjà rédigées.")}</h3>
    </div>
    <div className="scene">
      <div className="phone"><div className="bar">{t("Assistant de prospection")}{" "}<i></i></div><div className="chat">
        <div className="msg a">{t("Bonjour. Les 10 messages du jour sont partis à 8 h.")}</div>
        <div className="msg a">{t("Les relances de la semaine sont programmées.\nUn appel est prévu aujourd'hui : Entreprise C.")}</div>
        <div className="msg m">{t("Merci, je l'appelle dans la journée.")}</div>
        <div className="msg card"><b>{t("Dans son suivi")}</b>{t("Appeler Entreprise C, aujourd'hui, après 5 semaines.")}</div>
      </div></div>
      <h3>{t("Un organisme de formation prospecte chaque matin à 8 h.")}</h3>
    </div>
    <div className="scene">
      <div className="phone"><div className="bar">{t("Assistant commercial")}{" "}<i></i></div><div className="chat">
        <div className="msg m">{t("Tâche pour Commercial 1 : relancer Client A sur l'offre de clémentines, pour jeudi.")}</div>
        <div className="msg a">{t("Je crée cette tâche : relancer Client A, à faire par Commercial 1, pour jeudi. Tu confirmes ?")}</div>
        <div className="msg m">{t("oui")}</div>
        <div className="msg a">{t("C'est fait, la tâche est enregistrée.")}</div>
        <div className="msg card"><b>{t("Dans son outil de pilotage")}</b>{t("Relancer Client A, à faire, Commercial 1.")}</div>
      </div></div>
      <h3>{t("Un grossiste de Rungis pilote son activité en parlant à son assistant.")}</h3>
    </div>
  </MobileCarousel>
  <p className="note">{t("Scènes reconstituées sur données fictives, fidèles aux systèmes en service.")}</p>
</div></section>

<section className="parcours" id={fr ? "parcours" : "path"}><div className="wrap">
  <h2>{t("Trois étapes,")}{" "}<b>{t("vous commencez où vous voulez.")}</b></h2>
  <PathWalker/>
  <MobileCarousel className="steps" label={fr ? "Trois étapes" : "Three steps"}>
    <div className="step"><span className="n">{t("Étape 1")}</span><h3>{t("Apprendre")}</h3><p>{t("Former les équipes, puis créer avec elles un premier assistant.")}</p><ContactIntentLink locale={locale} query={contactQuery} intent="formation" placement="parcours">{t("Former mes équipes")}</ContactIntentLink></div>
    <div className="step"><span className="n">{t("Étape 2")}</span><h3>{t("Améliorer")}</h3><p>{t("Choisir les priorités, puis livrer des solutions rapides.")}</p><ContactIntentLink locale={locale} query={contactQuery} intent="priorites" placement="parcours">{t("Choisir nos priorités")}</ContactIntentLink></div>
    <div className="step"><span className="n">{t("Étape 3")}</span><h3>{t("Construire")}</h3><p>{t("Relier vos outils, puis bâtir vos propres logiciels.")}</p><ContactIntentLink locale={locale} query={contactQuery} intent="projet" placement="parcours">{t("Parler d'un projet")}</ContactIntentLink></div>
  </MobileCarousel>
  <p className="aussi">{t("Déjà équipés ? Nous vérifions vos outils et leurs règles, installons l'IA sur vos serveurs et contrôlons l'usage qu'en font vos équipes.")}</p>
</div></section>

<section id="services"><RevealOnView className="wrap">
  <h2>{t("Ce que l'IA prépare")}{" "}<b>{t("dans chaque service.")}</b></h2>
  <ServiceTasks locale={locale}/>
</RevealOnView></section>


<TechnologyBand locale={locale}/>

<section id={fr ? "partenaires" : "team"}><RevealOnView className="wrap">
  <h2>{t("Chaque projet a son équipe")}{" "}<b>{t("et sa technologie.")}</b></h2>
  <p className="muted" style={{"marginTop": "20px", "maxWidth": "720px"}}>{t("Plus de vingt partenaires, entrepreneurs et consultants indépendants, choisis selon le diagnostic.")}</p>
  <ServiceGrid offers={PARTNER_OFFERS.map(offers => offers.map(t))} deliveryLabel={t("Avec eux, nous livrons")} label={fr ? "Partenaires et livrables" : "Partners and deliverables"} items={[[t("Ingénieurs IA"), t("Plus de dix, chacun sa spécialité : documents, assistants, connexion à vos logiciels.")], [t("Automatisation et assistants"), t("Des développeurs et des studios : assistants écrits, vocaux et vidéo.")], [t("Transformation et projet"), t("Conduite du changement et pilotage de projet.")], [t("Marque et marketing"), t("Image de marque, contenus et vente.")], [t("Formation"), t("Une quinzaine de formateurs et un organisme certifié.")], [t("Conseil et qualité"), t("Des cabinets partenaires et des relecteurs de nos livrables.")], [t("Chercheurs du MIT"), t("Des chercheurs du MIT dans notre réseau, pour vos déploiements d'assistants les plus exigeants.")]]} />
  <p className="teamcap"><i aria-hidden="true"/>{t("Une équipe composée pour chaque diagnostic, et ce qu'elle livre")}</p>
<ResearchPartner/>
</RevealOnView></section>

<section className="final-call" id="bandeau" data-regime="canard"><div className="wrap">
  <h2>{fr ? "Votre expertise, mise au travail." : "Your expertise, put to work."}</h2>
  <div className="actions">
    <ContactIntentLink locale={locale} query={contactQuery} intent="projet" placement="bandeau" primary>{t("Parler d'un projet")}<BrandConnector/></ContactIntentLink>
    <ContactIntentLink locale={locale} query={contactQuery} intent="formation" placement="bandeau">{t("Former mes équipes")}</ContactIntentLink>
  </div>
</div></section>

<section id="questions"><div className="wrap">
  <h2>{copy.questionsTitle}</h2>
  <div className="home-faq">
    {copy.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
  </div>
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd(locale)).replace(/</g, "\\u003c") }}/>
</div></section>

<section id="articles"><div className="wrap">
  <h2>{copy.articlesTitle}</h2>
  {fr && <p className="journal-language-note">Articles en anglais</p>}
  <MobileCarousel className="journal-list journal-index home-journal-list" label={copy.articlesTitle}>
    {latestEntries.map(entry => <article key={entry.slug}><JournalCard entry={entry} locale={locale} compact/></article>)}
  </MobileCarousel>
  <a className="btn rev-button ghost home-journal-link" href={localizedPath("/journal", locale)}>{copy.journalLink}</a>
</div></section>

<section className="founder" id="contact" tabIndex={-1}><div className="wrap"><div className="grid">
  <picture>
    <source type="image/avif" srcSet="/brand/founder/parrit-ai-founder-linkedin-buste-3x4-340.avif 340w, /brand/founder/parrit-ai-founder-linkedin-buste-3x4-680.avif 680w" sizes="(max-width: 760px) calc((100vw - 40px) * .38), (max-width: 1160px) calc((100vw - 144px) / 3), 339px" />
    <source type="image/webp" srcSet="/brand/founder/parrit-ai-founder-linkedin-buste-3x4-340.webp 340w, /brand/founder/parrit-ai-founder-linkedin-buste-3x4-680.webp 680w" sizes="(max-width: 760px) calc((100vw - 40px) * .38), (max-width: 1160px) calc((100vw - 144px) / 3), 339px" />
    <img src="/brand/founder/parrit-ai-founder-linkedin-buste-3x4-680.webp" alt="Paul Larmaraud" width="600" height="800" loading="lazy" />
  </picture>
  <div className="founder-identity">
    <h2>{"Paul Larmaraud, "}<b>{t("fondateur de Parrit.ai")}</b></h2>
  </div>
  <div className="founder-details">
    <p>{t("Il a créé l'entreprise en 2024, après deux ans chez Lime.")}</p>
    <ul>
      <li>{t("Il conçoit des outils d'IA et les contrôles qui les encadrent.")}</li>
      <li>{t("Il forme les équipes et pilote les projets.")}</li>
    </ul>
    <div className="actions"><a className="btn rev-button exec" href="#reservation">{t("Parler d'un projet")}</a><a className="mail" href="mailto:paul.larmaraud@parrit.ai">{"paul.larmaraud@parrit.ai"}</a></div>
  </div>
</div><div id="reservation" className="reservation"><ParritCalInline locale={locale}/><div className="contact-fallback"><QuickCapture locale={locale} id="single-contact" variant="contact" /></div></div></div></section>

</main>;
}
