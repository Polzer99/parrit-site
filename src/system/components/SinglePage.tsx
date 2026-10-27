import type { Locale } from "@/system/locale";
import { localizedPath } from "@/system/locale";
import { SINGLE_PAGE_EN, PARTNER_OFFERS } from "@/system/single-page-copy";
import { ParritCalInline } from "./CalInline";
import { QuickCapture } from "./QuickCapture";
import { getSiteEvidence } from "@/lib/registry/preuves";
import { ClientReference, ClientLogoStrip, ResearchPartner } from "./PublicEvidence";
import { ServiceGrid } from "./ServiceGrid";
import { ConversationMotion } from "./ConversationMotion";
import { OntologyHero } from "./OntologyHero";
import { PathWalker } from "./PathWalker";
import { RevealOnView } from "./RevealOnView";
import { DataArchitecture } from "./DataArchitecture";
import { MobileCarousel } from "./MobileCarousel";
import { ServiceTasks } from "./ServiceTasks";
export function SinglePage({ locale }: { locale: Locale }) {
 const fr = locale === "fr";
 const clients = ["Laparra", "Clevery", "Forexpert", "Joone", "SNCF"].filter(id => getSiteEvidence(id, "home"));
 const t = (text: string) => fr ? text : SINGLE_PAGE_EN[text];
 return <main className="single-page" data-brand-mode="accessible"><ConversationMotion/>


<section className="hero"><div className="wrap">
  <div className="grid">
    <h1>{t("Nous allons à la frontière du possible,")}{" "}<b>{t("puis nous le livrons à nos clients.")}</b></h1>
    <div className="sub">
      <p>{t("Votre expertise est la matière première. Nous en faisons des systèmes qui en multiplient l'impact.")}</p>
      <div className="actions" style={{"marginTop": "0"}}><a className="btn rev-button exec" href="#contact">{t("Parlons de votre transformation")}</a></div>
    </div>
  </div>
  <OntologyHero locale={locale}/>
  {/* Attribution de la citation courte : https://ico.org.uk/for-the-public/ico-40/data-as-a-commodity/ */}
  <p className="humby">{t("« La donnée est le nouveau pétrole », disait Clive Humby en 2006. Brute, elle ne sert à rien : nous la raffinons.")}</p>
</div></section>

{clients.some(id => ["Clevery", "Forexpert", "Laparra"].includes(id)) && <section className="live" id={fr ? "en-production" : "in-production"}><div className="wrap">
  <h2>{t("Nos agents travaillent déjà")}{" "}<b>{t("chez nos clients.")}</b></h2>
  <MobileCarousel className="scenes" label={fr ? "Agents en production" : "Agents in production"}>
    {getSiteEvidence("Clevery", "home") && <div className="scene">
      <div className="phone"><div className="bar">{t("Agent du cabinet")}{" "}<i></i></div><div className="chat">
        <div className="msg a">{t("Bonjour Maître. 6 messages cette nuit, 3 demandent une action.")}</div>
        <div className="msg a">{t("1. Client A : demande de rendez-vous, réponse prête.\n2. Greffe : pièce reçue, classée au dossier.\n3. Client B : relance, réponse prête.")}</div>
        <div className="msg m">{t("Montre-moi la réponse au client A.")}</div>
        <div className="msg a">{t("Elle est dans votre messagerie, à relire avant envoi.")}</div>
        <div className="msg card"><b>{t("Dans sa messagerie")}</b>{t("Réponse au client A : brouillon prêt, à relire.")}</div>
      </div></div>
      <h3>{t("Chaque matin, un cabinet d'avocats trouve ses réponses déjà rédigées.")}</h3><p className="who">{t("Clevery Avocats.")}</p>
    </div>}
    {getSiteEvidence("Forexpert", "home") && <div className="scene">
      <div className="phone"><div className="bar">{t("Agent de prospection")}{" "}<i></i></div><div className="chat">
        <div className="msg a">{t("Bonjour. Les 10 messages du jour sont partis à 8 h.")}</div>
        <div className="msg a">{t("Les relances de la semaine sont programmées.\nUn appel est prévu aujourd'hui : Entreprise C.")}</div>
        <div className="msg m">{t("Merci, je l'appelle dans la journée.")}</div>
        <div className="msg card"><b>{t("Dans son suivi")}</b>{t("Appeler Entreprise C, aujourd'hui, après 5 semaines.")}</div>
      </div></div>
      <h3>{t("Un organisme de formation prospecte chaque matin à 8 h.")}</h3><p className="who">{t("Forexpert.")}</p>
    </div>}
    {getSiteEvidence("Laparra", "home") && <div className="scene">
      <div className="phone"><div className="bar">{t("Agent commercial")}{" "}<i></i></div><div className="chat">
        <div className="msg m">{t("Tâche pour Commercial 1 : relancer Client A sur l'offre avocat Hass, pour jeudi.")}</div>
        <div className="msg a">{t("Je crée cette tâche : relancer Client A, à faire par Commercial 1, pour le 8 octobre. Tu confirmes ?")}</div>
        <div className="msg m">{t("oui")}</div>
        <div className="msg a">{t("C'est fait, la tâche est enregistrée.")}</div>
        <div className="msg card"><b>{t("Dans son outil de pilotage")}</b>{t("Relancer Client A, à faire, Commercial 1.")}</div>
      </div></div>
      <h3>{t("Un grossiste de Rungis pilote son activité en parlant à ses agents.")}</h3><p className="who">{t("Laparra, sur le téléphone de l'équipe.")}</p>
    </div>}
  </MobileCarousel>
  <p className="note">{t("Scènes reconstituées sur données fictives, fidèles aux systèmes en service.")}</p>
</div></section>}

<section id={fr ? "ce-qui-change" : "what-changes"}><div className="wrap">
  <h2>{t("Ce que l'IA change")}{" "}<b>{t("dans votre entreprise.")}</b></h2>
  <MobileCarousel className="three" label={fr ? "Ce que l’IA change" : "What AI changes"}>
    <div className="item"><div className="panel"><div className="bubble">{t("Liste chaque décision et son responsable.")}</div><div className="answer">{t("Voici les trois décisions et leurs responsables.")}</div></div>
      <h3>{t("Vos équipes savent utiliser l'IA.")}</h3><p className="muted">{t("Une demande claire donne une réponse utile.")}</p><div className="status"><i></i>{t("Exemple illustratif")}</div></div>
    <div className="item"><div className="panel"><div className="doc"><b>{t("Compte rendu")}</b><div className="l"></div><div className="l"></div><div className="l" style={{"width": "60%"}}></div><span className="ok">{t("Prêt à relire")}</span></div></div>
      <h3>{t("Un outil prépare vos tâches répétitives.")}</h3><p className="muted">{t("Il rédige le compte rendu, vous le relisez.")}</p><div className="status"><i></i>{t("Exemple illustratif")}</div></div>
    <div className="item"><div className="panel"><div className="soft"><div className="top">{t("Votre logiciel")}</div><div className="row"><span>{t("Vos informations")}</span><span>{t("Vos règles")}</span></div><div className="row"><span>{"Agent"}</span><span>{"Agent"}</span><span>{"Agent"}</span></div></div></div>
      <h3>{t("Votre façon de travailler devient un logiciel.")}</h3><p className="muted">{t("Chacun voit les mêmes informations, à jour.")}</p><div className="status client"><i></i>{t("Chez un client")}</div></div>
  </MobileCarousel>
</div></section>



<section className="parcours" id={fr ? "parcours" : "path"}><div className="wrap">
  <h2>{t("Trois étapes,")}{" "}<b>{t("vous commencez où vous voulez.")}</b></h2>
  <PathWalker/>
  <MobileCarousel className="steps" label={fr ? "Trois étapes" : "Three steps"}>
    <div className="step"><span className="n">{t("Étape 1")}</span><h3>{t("Apprendre")}</h3><p>{t("Former les équipes, puis créer avec elles un premier agent.")}</p></div>
    <div className="step"><span className="n">{t("Étape 2")}</span><h3>{t("Améliorer")}</h3><p>{t("Choisir les priorités, puis livrer des solutions rapides.")}</p></div>
    <div className="step"><span className="n">{t("Étape 3")}</span><h3>{t("Construire")}</h3><p>{t("Relier vos outils, puis bâtir vos propres logiciels.")}</p></div>
  </MobileCarousel>
  <p className="aussi">{t("Déjà équipés ? Nous vérifions vos agents et leurs règles, installons l'IA sur vos serveurs et auditons votre usage de Claude Code.")}</p>
</div></section>

<section id="services"><RevealOnView className="wrap">
  <h2>{t("Ce que l'IA prépare")}{" "}<b>{t("dans chaque service.")}</b></h2>
  <ServiceTasks locale={locale}/>
</RevealOnView></section>


<section id={fr ? "partenaires" : "team"}><RevealOnView className="wrap">
  <h2>{t("Chaque projet a son équipe")}{" "}<b>{t("et sa technologie.")}</b></h2>
  <p className="muted" style={{"marginTop": "20px", "maxWidth": "720px"}}>{t("Plus de vingt partenaires, entrepreneurs et consultants indépendants, choisis selon le diagnostic.")}</p>
  <ServiceGrid offers={PARTNER_OFFERS.map(offers => offers.map(t))} deliveryLabel={t("Avec eux, nous livrons")} label={fr ? "Partenaires et livrables" : "Partners and deliverables"} items={[[t("Ingénieurs IA"), t("Plus de dix, chacun sa spécialité : vision, agents, intégration.")], [t("Automatisation et assistants"), t("Des développeurs et des studios : assistants écrits, vocaux et vidéo.")], [t("Transformation et projet"), t("Conduite du changement et pilotage de projet.")], [t("Marque et marketing"), t("Image de marque, contenus et vente.")], [t("Formation"), t("Une quinzaine de formateurs et un organisme certifié.")], [t("Conseil et qualité"), t("Des cabinets partenaires et des relecteurs de nos livrables.")], [t("Chercheurs du MIT"), t("Des chercheurs du MIT dans notre réseau, pour vos déploiements d'agents les plus exigeants.")]]} />
  <p className="teamcap"><i aria-hidden="true"/>{t("Une équipe composée pour chaque diagnostic, et ce qu'elle livre")}</p>
  <div className="partner-invitation">
    <p>{fr ? "Vous êtes formateur ou consultant IA ?" : "Are you an AI trainer or consultant?"}</p>
    <a className="btn rev-button ghost" href={localizedPath("/become-a-partner", locale)}>{fr ? "Rejoindre le réseau" : "Join the network"}</a>
  </div>
<ResearchPartner/>
</RevealOnView></section>

<section id="references" style={{"paddingTop": "0"}}><RevealOnView className="wrap">
  {clients.length > 0 && <><h2>{t("Ils travaillent")}{" "}<b>{t("avec nous.")}</b></h2>
  <ClientLogoStrip/>
  <div className="reflines">
    <ClientReference id="Laparra">{t("Grossiste du MIN de Rungis : un outil de pilotage agentique pour les fruits et légumes.")}</ClientReference>
    <ClientReference id="Clevery">{t("Un agent pour le cabinet.")}</ClientReference>
    <ClientReference id="Forexpert">{t("Un agent de prospection.")}</ClientReference>
    <ClientReference id="Joone">{t("L'accompagnement des équipes à l'IA.")}</ClientReference>
    <ClientReference id="SNCF">{t("Un programme de formation.")}</ClientReference>
  </div>
  </>}
</RevealOnView></section>

<DataArchitecture locale={locale}/>



<div className="journal-entry wrap"><a href={localizedPath("/journal", locale)}>{fr ? "Ce que nous écrivons" : "What we write"}</a></div>
<section className="founder" id="contact"><div className="wrap"><div className="grid">
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
      <li>{t("Il conçoit des systèmes où plusieurs agents travaillent ensemble, et les garde-fous qui les encadrent.")}</li>
      <li>{t("Il forme les équipes et pilote les projets.")}</li>
    </ul>
    <div className="actions"><a className="btn rev-button exec" href="#reservation">{t("Parler d'un projet")}</a><a className="mail" href="mailto:paul.larmaraud@parrit.ai">{"paul.larmaraud@parrit.ai"}</a></div>
  </div>
</div><div id="reservation" className="reservation"><ParritCalInline locale={locale}/><div className="contact-fallback"><QuickCapture locale={locale} id="single-contact" variant="contact" /></div></div></div></section>

</main>;
}
