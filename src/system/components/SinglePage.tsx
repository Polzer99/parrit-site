import type { Locale } from "@/system/locale";
import { HomeGoalProvider, GoalHero, GoalBooking } from "./HomeGoals";
import { HomeMeasures } from "./HomeEvidence";
import { Fragment, type ReactNode } from "react";
import { HOME_LAYERS, HOME_SECTION_ORDER, homeSectionHeadings, homeFaqJsonLd, type HomeSection } from "@/system/home-layers";
import { SectionEntrance } from "./SectionEntrance";
import { HomeAnchorRedirect } from "./HomeAnchorRedirect";
import { SINGLE_PAGE_EN } from "@/system/single-page-copy";
import { QuickCapture } from "./QuickCapture";
import { AppointmentLink } from "./AppointmentLink";
import { PUBLIC_CLIENT_NAMES } from "@/system/public-clients";
import { getSiteEvidence } from "@/lib/registry/preuves";
import { ClientLogoStrip, ResearchPartner } from "./PublicEvidence";
import { ServiceGrid } from "./ServiceGrid";
import { PathWalker } from "./PathWalker";
import { RevealOnView } from "./RevealOnView";
import { TechnologyBand } from "./TechnologyBand";
import { MobileCarousel } from "./MobileCarousel";
import { SessionPhotos } from "./SessionPhotos";
import { BrandConnector } from "./BrandConnector";
import { CardGlyph, CheckMark } from "./CardGlyph";
export function SinglePage({ locale, contactQuery = "" }: { locale: Locale; contactQuery?: string }) {
 const copy = HOME_LAYERS[locale];
 const headings = homeSectionHeadings(locale);
 const fr = locale === "fr";
 const clients = PUBLIC_CLIENT_NAMES.filter(id => getSiteEvidence(id, "home"));
 const t = (text: string) => fr ? text : SINGLE_PAGE_EN[text];
 // Le grand numéro est le repère de l'étape ; le mot « Étape » reste lu par les lecteurs d'écran.
 const stepNumber = (label: string) => { const cut = label.lastIndexOf(" "); return <span className="n"><span className="sr-only">{label.slice(0, cut + 1)}</span>{label.slice(cut + 1)}</span>; };
 const sections = {
hero: <GoalHero locale={locale}/>,
measures: <HomeMeasures locale={locale}/>,
references: (
<section id="references"><RevealOnView className="wrap">
  {clients.length > 0 && <><h2>{headings.references[0]}{" "}{headings.references[1]}</h2>
  <ClientLogoStrip/>
  </>}
</RevealOnView></section>

),
terrain: (
<SessionPhotos locale={locale}/>

),
offers: (
<section id={fr ? "offres" : "offers"} data-regime="ink"><div className="wrap" id={fr ? undefined : "offres"}>
  {/* Anciennes ancres de la section retirée le 21/11/2026 : elles restent atteignables. */}
  {["en-production", "in-production", "services", "ce-qui-change", "what-changes"].map(alias => <span key={alias} id={alias} className="home-anchor-alias" aria-hidden="true"/>)}
  <h2>{copy.offersTitle}</h2>
  <p className="offers-audience">{copy.offersAudience}</p>
  <MobileCarousel className="home-offers" label={copy.offersTitle}>
    {copy.offers.map(offer => <article className="home-offer" key={offer.id}>
      <CardGlyph name={offer.id === "transformation" ? "person" : "cube"}/>
      <span className="offer-eyebrow">{offer.eyebrow}</span>
      <h3>{offer.title}</h3>
      <ul>{offer.benefits.map(benefit => <li key={benefit}><CheckMark/><span>{benefit}</span></li>)}</ul>
    </article>)}
  </MobileCarousel>
</div></section>

),
path: (
<section className="parcours" id={fr ? "parcours" : "path"}><div className="wrap">
  <h2>{headings.path[0]}<br/>{headings.path[1]}</h2>
  <PathWalker/>
  <MobileCarousel className="steps" label={fr ? "Trois étapes" : "Three steps"}>
    <div className="step">{stepNumber(t("Étape 1"))}<h3>{t("Apprendre")}</h3><p>{t("Prendre l'IA en main, puis créer un premier assistant avec vos équipes.")}</p></div>
    <div className="step">{stepNumber(t("Étape 2"))}<h3>{t("Améliorer")}</h3><p>{t("Nous choisissons les priorités avec vous, puis construisons les outils.")}</p></div>
    <div className="step">{stepNumber(t("Étape 3"))}<h3>{t("Construire")}</h3><p>{t("Relier vos outils, puis bâtir vos propres logiciels.")}</p></div>
  </MobileCarousel>
  <p className="aussi">{t("Déjà équipés ? Nous vérifions vos outils et leurs règles, installons l'IA sur vos serveurs et contrôlons l'usage qu'en font vos équipes.")}</p>
  {/* Repasse de conversion du 21/11/2026 : la page ne laisse plus 5 000 px sans prise de rendez-vous. */}
  <div className="parcours-action"><AppointmentLink locale={locale} query={contactQuery} placement="parcours"><BrandConnector/></AppointmentLink></div>
</div></section>

),
technologies: (
<TechnologyBand locale={locale}/>

),
team: (
<section id={fr ? "partenaires" : "team"}><RevealOnView className="wrap">
  <h2>{headings.team[0]}{" "}{headings.team[1]}</h2>
  <p className="muted team-intro">{t("Nous travaillons avec des ingénieurs, des studios, des consultants, des intervenants, des cabinets de conseil et des chercheurs. Pour chaque projet, nous réunissons ceux dont le métier correspond à votre besoin.")}</p>
  <ServiceGrid label={fr ? "Partenaires" : "Partners"} items={[
    ["gear", t("Ingénieurs IA"), t("Des ingénieurs spécialisés travaillent sur vos documents, vos assistants ou les liens entre vos logiciels.")],
    ["bot", t("Automatisation et assistants"), t("Des développeurs et des studios créent vos assistants écrits, vocaux et vidéo.")],
    ["chart", t("Transformation et projet"), t("Des consultants accompagnent vos équipes dans le changement et suivent le projet avec vous.")],
    ["mail", t("Marque et marketing"), t("Nos partenaires travaillent sur votre marque, vos contenus et vos ventes.")],
    ["person", t("Prise en main"), t("Des intervenants accompagnent vos équipes dans la prise en main de l'IA.")],
    ["rule", t("Conseil et qualité"), t("Des cabinets partenaires relisent les travaux que nous vous remettons.")],
    ["doc", t("Chercheurs du MIT"), t("Des chercheurs du MIT font partie de notre réseau.")],
  ]} />
<ResearchPartner/>
</RevealOnView></section>

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
contact: (
<section className="founder" id="contact" tabIndex={-1}><div className="wrap"><div className="grid">
  <div className="founder-identity">
    <h2>{headings.contact[0] + " "}{headings.contact[1]}</h2>
  </div>
  <div className="founder-details">
    <p>{t("Vous décrivez une tâche qui prend du temps à vos équipes, ou un outil qui vous manque. Nous vous disons ce qui est réalisable. Le travail se fait ensuite avec les ingénieurs, les intervenants et les consultants dont votre projet a besoin.")}</p>
  </div>
</div><div id="reservation" className="reservation" tabIndex={-1}><h3 className="reservation-title">{fr ? "Choisissez un créneau." : "Pick a time."}</h3><GoalBooking locale={locale}/><div className="contact-fallback"><QuickCapture locale={locale} id="single-contact" variant="contact" /></div></div></div></section>

),
 } satisfies Record<HomeSection, ReactNode>;
 return <HomeGoalProvider query={contactQuery}><main className="single-page home-epure" data-brand-mode="accessible"><HomeAnchorRedirect locale={locale}/><SectionEntrance/>
   {HOME_SECTION_ORDER.map(id => <Fragment key={id}>{sections[id]}</Fragment>)}
 </main></HomeGoalProvider>;
}
