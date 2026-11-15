import type { Locale } from "@/system/locale";
import { HomeGoalProvider, GoalHero, GoalMotors, GoalBooking } from "./HomeGoals";
import { HomeMeasures, HomeAssistant } from "./HomeEvidence";
import { Fragment, type ReactNode } from "react";
import { HOME_LAYERS, HOME_SECTION_ORDER, homeSectionHeadings, homeFaqJsonLd, type HomeSection } from "@/system/home-layers";
import { SectionEntrance } from "./SectionEntrance";
import { HomeAnchorRedirect } from "./HomeAnchorRedirect";
import { SINGLE_PAGE_EN, PARTNER_OFFERS } from "@/system/single-page-copy";
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
export function SinglePage({ locale, contactQuery = "" }: { locale: Locale; contactQuery?: string }) {
 const copy = HOME_LAYERS[locale];
 const headings = homeSectionHeadings(locale);
 const fr = locale === "fr";
 const clients = PUBLIC_CLIENT_NAMES.filter(id => getSiteEvidence(id, "home"));
 const t = (text: string) => fr ? text : SINGLE_PAGE_EN[text];
 const sections = {
hero: <GoalHero locale={locale}/>,
motors: <GoalMotors locale={locale}/>,
measures: <HomeMeasures locale={locale}/>,
assistant: <HomeAssistant locale={locale}/>,
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
technologies: (
<TechnologyBand locale={locale}/>

),
team: (
<section id={fr ? "partenaires" : "team"}><RevealOnView className="wrap">
  <h2>{headings.team[0]}{" "}<b>{headings.team[1]}</b></h2>
  <p className="muted team-intro">{t("Chaque projet réunit, parmi plus de vingt partenaires, ceux dont il a besoin.")}</p>
  <ServiceGrid offers={PARTNER_OFFERS.map(offers => offers.map(t))} deliveryLabel={t("Avec eux, nous livrons")} label={fr ? "Partenaires et livrables" : "Partners and deliverables"} items={[[t("Ingénieurs IA"), t("Plus de dix, chacun sa spécialité : documents, assistants, connexion à vos logiciels.")], [t("Automatisation et assistants"), t("Des développeurs et des studios : assistants écrits, vocaux et vidéo.")], [t("Transformation et projet"), t("Conduite du changement et pilotage de projet.")], [t("Marque et marketing"), t("Image de marque, contenus et vente.")], [t("Prise en main"), t("Une quinzaine d'intervenants et un organisme certifié.")], [t("Conseil et qualité"), t("Des cabinets partenaires et des relecteurs de nos livrables.")], [t("Chercheurs du MIT"), t("Des chercheurs du MIT dans notre réseau, pour vos déploiements d'assistants les plus exigeants.")]]} />
  <p className="teamcap"><i aria-hidden="true"/>{t("Une équipe composée pour chaque diagnostic, et ce qu'elle livre")}</p>
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
  <picture>
    <source type="image/avif" srcSet="/brand/founder/parrit-ai-founder-linkedin-buste-3x4-340.avif 340w, /brand/founder/parrit-ai-founder-linkedin-buste-3x4-680.avif 680w" sizes="(max-width: 760px) calc((100vw - 40px) * .38), (max-width: 1160px) calc((100vw - 144px) / 3), 339px" />
    <source type="image/webp" srcSet="/brand/founder/parrit-ai-founder-linkedin-buste-3x4-340.webp 340w, /brand/founder/parrit-ai-founder-linkedin-buste-3x4-680.webp 680w" sizes="(max-width: 760px) calc((100vw - 40px) * .38), (max-width: 1160px) calc((100vw - 144px) / 3), 339px" />
    <img src="/brand/founder/parrit-ai-founder-linkedin-buste-3x4-680.webp" alt="Paul Larmaraud" width="600" height="800" loading="lazy" />
  </picture>
  <div className="founder-identity">
    <h2>{headings.contact[0] + " "}<b>{headings.contact[1]}</b></h2>
  </div>
  <div className="founder-details">
    <p>{t("Il a créé Parrit.ai en 2024, après deux ans chez Lime.")}</p>
    <ul>
      <li>{t("Le premier échange se fait avec lui : vous lui parlez de votre projet.")}</li>
      <li>{t("Prise en main de l'IA, développement sur mesure, expertise métier, recherche : le travail se fait ensuite avec l'équipe adaptée à votre projet.")}</li>
    </ul>
    <div className="actions"><AppointmentLink locale={locale} query={contactQuery} placement="contact"/><a className="mail" href="mailto:paul.larmaraud@parrit.ai">{"paul.larmaraud@parrit.ai"}</a></div>
  </div>
</div><div id="reservation" className="reservation"><GoalBooking locale={locale}/><div className="contact-fallback"><QuickCapture locale={locale} id="single-contact" variant="contact" /></div></div></div></section>

),
 } satisfies Record<HomeSection, ReactNode>;
 return <HomeGoalProvider query={contactQuery}><main className="single-page home-epure" data-brand-mode="accessible"><HomeAnchorRedirect locale={locale}/><SectionEntrance/>
   {HOME_SECTION_ORDER.map(id => <Fragment key={id}>{sections[id]}</Fragment>)}
 </main></HomeGoalProvider>;
}
