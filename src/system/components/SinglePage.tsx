import { Fragment, type ReactNode } from "react";
import { localizedPath, type Locale } from "@/system/locale";
import type { JournalEntrySummary } from "@/system/journal";
import { HOME_LAYERS, HOME_SECTION_ORDER, homeSectionHeadings, homeFaqJsonLd, type HomeSection } from "@/system/home-layers";
import { JournalCard } from "./JournalCard";
import { HomeAnchorRedirect } from "./HomeAnchorRedirect";
import { SINGLE_PAGE_EN, PARTNER_OFFERS } from "@/system/single-page-copy";
import { ParritCalInline } from "./CalInline";
import { QuickCapture } from "./QuickCapture";
import { AppointmentLink } from "./AppointmentLink";
import { PUBLIC_CLIENT_NAMES } from "@/system/public-clients";
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
 const headings = homeSectionHeadings(locale);
 const fr = locale === "fr";
 const clients = PUBLIC_CLIENT_NAMES.filter(id => getSiteEvidence(id, "home"));
 const t = (text: string) => fr ? text : SINGLE_PAGE_EN[text];
 const sections = {
hero: (
<section className="hero"><div className="wrap">
  <OntologyHero locale={locale}>
    <div className="hero-intro">
      <h1>{headings.hero[0]}{" "}<b>{headings.hero[1]}</b></h1>
      <div className="sub">
        <p>{t("Vos équipes prennent l'IA en main. Nous développons les logiciels qui leur manquent.")}</p>
        <div className="hero-appointment">
          <div className="actions">
            <AppointmentLink locale={locale} query={contactQuery} placement="hero"><BrandConnector/></AppointmentLink>
          </div>
          <p className="hero-reassurance">{t("Vos équipes gardent la décision. Aucune relance automatique.")}</p>
        </div>
      </div>
    </div>
  </OntologyHero>
</div></section>


),
references: (
<section id="references"><RevealOnView className="wrap">
  {clients.length > 0 && <><h2>{headings.references[0]}{" "}<b>{headings.references[1]}</b></h2>
  <ClientLogoStrip/>
  </>}
</RevealOnView></section>

),
terrain: (
<SessionPhotos locale={locale}/>

),
offers: (
<section id={fr ? "offres" : "offers"} data-regime="ink"><div className="wrap" id={fr ? undefined : "offres"}>
  <h2>{copy.offersTitle}</h2>
  <MobileCarousel className="home-offers" label={copy.offersTitle}>
    {copy.offers.map(offer => <article className="home-offer" key={offer.id}>
      <span className="offer-eyebrow">{offer.eyebrow}</span>
      <h3>{offer.title}</h3>
      <ul>{offer.benefits.map(benefit => <li key={benefit}><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="m3 9 4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2"/></svg><span>{benefit}</span></li>)}</ul>
    </article>)}
  </MobileCarousel>
  <p className="offers-audience">{copy.offersAudience}</p>
</div></section>

),
applications: (
<section className="live" id={fr ? "en-production" : "in-production"}><div className="wrap">
  <span id="ce-qui-change" className="home-anchor-alias" aria-hidden="true"/><span id="what-changes" className="home-anchor-alias" aria-hidden="true"/>
  <h2>{headings.applications[0]}{" "}<b>{headings.applications[1]}</b></h2>
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
      <h3>{t("Une entreprise de services prospecte chaque matin à 8 h.")}</h3>
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
  <p className="note">{t("Inspirées de nos missions. Les données affichées sont fictives.")}</p>
</div></section>

),
path: (
<section className="parcours" id={fr ? "parcours" : "path"}><div className="wrap">
  <h2>{headings.path[0]}{" "}<b>{headings.path[1]}</b></h2>
  <PathWalker/>
  <MobileCarousel className="steps" label={fr ? "Trois étapes" : "Three steps"}>
    <div className="step"><span className="n">{t("Étape 1")}</span><h3>{t("Apprendre")}</h3><p>{t("Prendre l'IA en main, puis créer un premier assistant avec vos équipes.")}</p></div>
    <div className="step"><span className="n">{t("Étape 2")}</span><h3>{t("Améliorer")}</h3><p>{t("Choisir les priorités, puis livrer des solutions rapides.")}</p></div>
    <div className="step"><span className="n">{t("Étape 3")}</span><h3>{t("Construire")}</h3><p>{t("Relier vos outils, puis bâtir vos propres logiciels.")}</p></div>
  </MobileCarousel>
  <p className="aussi">{t("Déjà équipés ? Nous vérifions vos outils et leurs règles, installons l'IA sur vos serveurs et contrôlons l'usage qu'en font vos équipes.")}</p>
</div></section>

),
services: (
<section id="services"><RevealOnView className="wrap">
  <h2>{headings.services[0]}{" "}<b>{headings.services[1]}</b></h2>
  <ServiceTasks locale={locale}/>
</RevealOnView></section>


),
technologies: (
<TechnologyBand locale={locale}/>

),
team: (
<section id={fr ? "partenaires" : "team"}><RevealOnView className="wrap">
  <h2>{headings.team[0]}{" "}<b>{headings.team[1]}</b></h2>
  <p className="muted team-intro">{t("Un seul interlocuteur, responsable de bout en bout. Selon le besoin, il s'entoure de spécialistes parmi plus de vingt partenaires.")}</p>
  <ServiceGrid offers={PARTNER_OFFERS.map(offers => offers.map(t))} deliveryLabel={t("Avec eux, nous livrons")} label={fr ? "Partenaires et livrables" : "Partners and deliverables"} items={[[t("Ingénieurs IA"), t("Plus de dix, chacun sa spécialité : documents, assistants, connexion à vos logiciels.")], [t("Automatisation et assistants"), t("Des développeurs et des studios : assistants écrits, vocaux et vidéo.")], [t("Transformation et projet"), t("Conduite du changement et pilotage de projet.")], [t("Marque et marketing"), t("Image de marque, contenus et vente.")], [t("Prise en main"), t("Une quinzaine d'intervenants et un organisme certifié.")], [t("Conseil et qualité"), t("Des cabinets partenaires et des relecteurs de nos livrables.")], [t("Chercheurs du MIT"), t("Des chercheurs du MIT dans notre réseau, pour vos déploiements d'assistants les plus exigeants.")]]} />
  <p className="teamcap"><i aria-hidden="true"/>{t("Une équipe composée pour chaque diagnostic, et ce qu'elle livre")}</p>
<ResearchPartner/>
</RevealOnView></section>

),
banner: (
<section className="final-call" id="bandeau" data-regime="canard"><div className="wrap">
  <h2>{headings.banner[0]}</h2>
  <div className="actions">
    <AppointmentLink locale={locale} query={contactQuery} placement="bandeau"><BrandConnector/></AppointmentLink>
  </div>
</div></section>

),
questions: (
<section id="questions"><div className="wrap">
  <h2>{copy.questionsTitle}</h2>
  <div className="home-faq">
    {copy.faq.map(([question, answer], index) => <details key={question} open={index === 2 || index === 5}><summary>{question}</summary><p>{answer}</p></details>)}
  </div>
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd(locale)).replace(/</g, "\\u003c") }}/>
</div></section>

),
articles: (
<section id="articles"><div className="wrap">
  <h2>{copy.articlesTitle}</h2>
  <MobileCarousel className="journal-list journal-index home-journal-list" label={copy.articlesTitle}>
    {latestEntries.map(entry => <article key={entry.slug}><JournalCard entry={entry} locale={locale} compact/></article>)}
  </MobileCarousel>
  <a className="btn rev-button ghost home-journal-link" href={localizedPath("/journal", locale)}>{copy.journalLink}</a>
</div></section>

),
contact: (
<section className="founder" id="contact" tabIndex={-1}><div className="wrap"><div className="grid">
  <picture>
    <source type="image/avif" srcSet="/brand/founder/parrit-ai-founder-linkedin-buste-3x4-340.avif 340w, /brand/founder/parrit-ai-founder-linkedin-buste-3x4-680.avif 680w" sizes="(max-width: 760px) calc((100vw - 40px) * .38), (max-width: 1160px) calc((100vw - 144px) / 3), 339px" />
    <source type="image/webp" srcSet="/brand/founder/parrit-ai-founder-linkedin-buste-3x4-340.webp 340w, /brand/founder/parrit-ai-founder-linkedin-buste-3x4-680.webp 680w" sizes="(max-width: 760px) calc((100vw - 40px) * .38), (max-width: 1160px) calc((100vw - 144px) / 3), 339px" />
    <img src="/brand/founder/parrit-ai-founder-linkedin-buste-3x4-680.webp" alt="Paul Larmaraud" width="600" height="800" loading="lazy" />
  </picture>
  <div className="founder-identity">
    <h2>{headings.contact[0] + " "}<b>{headings.contact[1]}</b></h2>
  </div>
  <div className="founder-details">
    <p>{t("Il a créé l'entreprise en 2024, après deux ans chez Lime.")}</p>
    <ul>
      <li>{t("Il conçoit des outils d'IA et les contrôles qui les encadrent.")}</li>
      <li>{t("Il accompagne les équipes dans la prise en main de l'IA et pilote les projets.")}</li>
    </ul>
    <div className="actions"><AppointmentLink locale={locale} query={contactQuery} placement="contact"/><a className="mail" href="mailto:paul.larmaraud@parrit.ai">{"paul.larmaraud@parrit.ai"}</a></div>
  </div>
</div><div id="reservation" className="reservation"><ParritCalInline locale={locale}/><div className="contact-fallback"><QuickCapture locale={locale} id="single-contact" variant="contact" /></div></div></div></section>

),
 } satisfies Record<HomeSection, ReactNode>;
 return <main className="single-page" data-brand-mode="accessible"><ConversationMotion/><HomeAnchorRedirect locale={locale}/><SectionEntrance/>
   {HOME_SECTION_ORDER.map(id => <Fragment key={id}>{sections[id]}</Fragment>)}
 </main>;
}
