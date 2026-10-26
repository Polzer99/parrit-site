/* eslint-disable @next/next/no-img-element */
import type { Locale } from "@/system/locale";
import { localizedPath } from "@/system/locale";
import { SINGLE_PAGE_EN } from "@/system/single-page-copy";
import { ParritCalInline } from "./CalInline";
import { QuickCapture } from "./QuickCapture";
import { getSiteEvidence } from "@/lib/registry/preuves";
import { ClientReference, ResearchPartner } from "./PublicEvidence";
import { ServiceGrid } from "./ServiceGrid";
import { ConversationMotion } from "./ConversationMotion";
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
  <svg className="onto" viewBox="0 0 1080 260" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><line x1="0" y1="40" x2="1080" y2="40" className="layer"/>
    <text x="0" y="30" className="lab">{t("Vos données")}</text>
    <line x1="0" y1="130" x2="1080" y2="130" className="layer"/>
    <text x="0" y="120" className="lab">{t("Vos règles")}</text>
    <line x1="0" y1="220" x2="1080" y2="220" className="layer"/>
    <text x="0" y="210" className="lab">{t("Vos agents")}</text>
    <path id="onto-e0" d="M190 40 L310 130" className="edge"/>
    <path id="onto-e1" d="M430 40 L310 130" className="edge"/>
    <path id="onto-e2" d="M430 40 L590 130" className="edge"/>
    <path id="onto-e3" d="M670 40 L590 130" className="edge"/>
    <path id="onto-e4" d="M670 40 L830 130" className="edge"/>
    <path id="onto-e5" d="M910 40 L830 130" className="edge"/>
    <path id="onto-e6" d="M310 130 L260 220" className="edge"/>
    <path id="onto-e7" d="M590 130 L540 220" className="edge"/>
    <path id="onto-e8" d="M830 130 L860 220" className="edge"/>
    <path id="onto-e9" d="M310 130 L540 220" className="edge"/>
    <path id="onto-e10" d="M590 130 L860 220" className="edge"/>
    <rect x="184" y="34" width="12" height="12" className="node"/>
    <text x="202" y="58" className="nt">{t("Clients")}</text>
    <rect x="424" y="34" width="12" height="12" className="node"/>
    <text x="442" y="58" className="nt">{t("Commandes")}</text>
    <rect x="664" y="34" width="12" height="12" className="node"/>
    <text x="682" y="58" className="nt">{t("Stocks")}</text>
    <rect x="904" y="34" width="12" height="12" className="node"/>
    <text x="922" y="58" className="nt">{t("Factures")}</text>
    <rect x="304" y="124" width="12" height="12" className="node r"/>
    <text x="322" y="148" className="nt">{t("Validation")}</text>
    <rect x="584" y="124" width="12" height="12" className="node r"/>
    <text x="602" y="148" className="nt">{t("Droits")}</text>
    <rect x="824" y="124" width="12" height="12" className="node r"/>
    <text x="842" y="148" className="nt">{t("Échéances")}</text>
    <g transform="translate(260 222) scale(1.4)"><rect x="-11" y="-22" width="22" height="22" className="ag"/>
    <rect x="-6" y="-15" width="4" height="5" className="eye"/>
    <rect x="2" y="-15" width="4" height="5" className="eye"/>
    </g>
    <g transform="translate(540 222) scale(1.4)"><rect x="-11" y="-22" width="22" height="22" className="ag"/>
    <rect x="-6" y="-15" width="4" height="5" className="eye"/>
    <rect x="2" y="-15" width="4" height="5" className="eye"/>
    </g>
    <g transform="translate(860 222) scale(1.4)"><rect x="-11" y="-22" width="22" height="22" className="ag"/>
    <rect x="-6" y="-15" width="4" height="5" className="eye"/>
    <rect x="2" y="-15" width="4" height="5" className="eye"/>
    </g>
    <rect width="7" height="7" x="-3.5" y="-3.5" className="pulse"><animateMotion dur="3.08s" begin="2.18s" repeatCount="indefinite"><mpath href="#onto-e0"/>
    </animateMotion></rect><rect width="7" height="7" x="-3.5" y="-3.5" className="pulse"><animateMotion dur="3.34s" begin="2.42s" repeatCount="indefinite"><mpath href="#onto-e1"/>
    </animateMotion></rect><rect width="7" height="7" x="-3.5" y="-3.5" className="pulse"><animateMotion dur="3.85s" begin="0.26s" repeatCount="indefinite"><mpath href="#onto-e2"/>
    </animateMotion></rect><rect width="7" height="7" x="-3.5" y="-3.5" className="pulse"><animateMotion dur="2.63s" begin="3.35s" repeatCount="indefinite"><mpath href="#onto-e3"/>
    </animateMotion></rect><rect width="7" height="7" x="-3.5" y="-3.5" className="pulse"><animateMotion dur="3.12s" begin="0.94s" repeatCount="indefinite"><mpath href="#onto-e4"/>
    </animateMotion></rect><rect width="7" height="7" x="-3.5" y="-3.5" className="pulse"><animateMotion dur="4.59s" begin="1.88s" repeatCount="indefinite"><mpath href="#onto-e5"/>
    </animateMotion></rect><rect width="7" height="7" x="-3.5" y="-3.5" className="pulse"><animateMotion dur="4.27s" begin="1.91s" repeatCount="indefinite"><mpath href="#onto-e6"/>
    </animateMotion></rect><rect width="7" height="7" x="-3.5" y="-3.5" className="pulse"><animateMotion dur="3.88s" begin="0.6s" repeatCount="indefinite"><mpath href="#onto-e7"/>
    </animateMotion></rect><rect width="7" height="7" x="-3.5" y="-3.5" className="pulse"><animateMotion dur="3.87s" begin="3.47s" repeatCount="indefinite"><mpath href="#onto-e8"/>
    </animateMotion></rect><rect width="7" height="7" x="-3.5" y="-3.5" className="pulse"><animateMotion dur="3.65s" begin="2.97s" repeatCount="indefinite"><mpath href="#onto-e9"/>
    </animateMotion></rect><rect width="7" height="7" x="-3.5" y="-3.5" className="pulse"><animateMotion dur="3.94s" begin="0.26s" repeatCount="indefinite"><mpath href="#onto-e10"/>
    </animateMotion></rect></svg>
</div></section>

{clients.some(id => ["Clevery", "Forexpert", "Laparra"].includes(id)) && <section className="live" id={fr ? "en-production" : "in-production"}><div className="wrap">
  <h2>{t("Nos agents travaillent déjà")}{" "}<b>{t("chez nos clients.")}</b></h2>
  <div className="scenes">
    {getSiteEvidence("Clevery", "home") && <div className="scene">
      <div className="phone"><div className="bar">{t("Agent du cabinet")}{" "}<i></i></div><div className="chat">
        <div className="msg a">{t("Bonjour Maître. 6 messages cette nuit, 3 demandent une action.")}</div>
        <div className="msg a">{t("1. Client A : demande de rendez-vous, réponse prête.\n2. Greffe : pièce reçue, classée au dossier.\n3. Client B : relance, réponse prête.")}</div>
        <div className="msg m">{t("Montre-moi la réponse au client A.")}</div>
        <div className="msg a">{t("Elle est dans votre messagerie, à relire avant envoi.")}</div>
        <div className="msg card"><b>{t("Dans sa messagerie")}</b>{t("Réponse au client A : brouillon prêt, à relire.")}</div>
      </div></div>
      <h3>{t("Un cabinet d'avocats démarre sa journée avec ses actions prêtes.")}</h3><p className="who">{t("Clevery Avocats, chaque matin.")}</p>
    </div>}
    {getSiteEvidence("Forexpert", "home") && <div className="scene">
      <div className="phone"><div className="bar">{t("Agent prospection")}{" "}<i></i></div><div className="chat">
        <div className="msg a">{t("Bonjour. Les 10 messages du jour sont partis à 8 h.")}</div>
        <div className="msg a">{t("Les relances de la semaine sont programmées.\nUn appel est prévu aujourd'hui : Entreprise C, à J+35.")}</div>
        <div className="msg m">{t("Merci, je l'appelle dans la journée.")}</div>
        <div className="msg card"><b>{t("Dans son suivi")}</b>{t("Appeler Entreprise C, aujourd'hui, après 5 semaines.")}</div>
      </div></div>
      <h3>{t("Un organisme de formation prospecte chaque matin à 8 h.")}</h3><p className="who">{t("Forexpert, chaque matin.")}</p>
    </div>}
    {getSiteEvidence("Laparra", "home") && <div className="scene">
      <div className="phone"><div className="bar">{t("Agent CRM")}{" "}<i></i></div><div className="chat">
        <div className="msg m">{t("Tâche pour Commercial 1 : relancer Client A sur l'offre avocat Hass, pour jeudi.")}</div>
        <div className="msg a">{t("Je crée cette tâche : relancer Client A, à faire par Commercial 1, pour le 8 octobre. Tu confirmes ?")}</div>
        <div className="msg m">{t("oui")}</div>
        <div className="msg a">{t("C'est fait, la tâche est dans le CRM.")}</div>
        <div className="msg card"><b>{t("Dans son CRM")}</b>{t("Relancer Client A, à faire, Commercial 1.")}</div>
      </div></div>
      <h3>{t("Un grossiste de Rungis pilote sa base clients en parlant à ses agents.")}</h3><p className="who">{t("Laparra, sur le téléphone de l'équipe.")}</p>
    </div>}
  </div>
  <p className="note">{t("Scènes reconstituées sur données fictives, fidèles aux systèmes en service. Rien ne part sans l'accord d'une personne.")}</p>
</div></section>}

<section id={fr ? "ce-qui-change" : "what-changes"}><div className="wrap">
  <h2>{t("Ce que l'IA change")}{" "}<b>{t("dans votre entreprise.")}</b></h2>
  <div className="three">
    <div className="item"><div className="panel"><div className="bubble">{t("Liste chaque décision et son responsable.")}</div><div className="answer">{t("Voici les trois décisions et leurs responsables.")}</div></div>
      <h3>{t("Vos équipes savent utiliser l'IA.")}</h3><p className="muted">{t("Une demande claire donne une réponse utile.")}</p><div className="status"><i></i>{t("Exemple illustratif")}</div></div>
    <div className="item"><div className="panel"><div className="doc"><b>{t("Compte rendu")}</b><div className="l"></div><div className="l"></div><div className="l" style={{"width": "60%"}}></div><span className="ok">{t("Prêt à relire")}</span></div></div>
      <h3>{t("Un outil prépare vos tâches répétitives.")}</h3><p className="muted">{t("L'outil rédige le compte rendu, vous le relisez.")}</p><div className="status"><i></i>{t("Exemple illustratif")}</div></div>
    <div className="item"><div className="panel"><div className="soft"><div className="top">{t("Votre logiciel")}</div><div className="row"><span>{t("Vos informations")}</span><span>{t("Vos règles")}</span></div><div className="row"><span>{"Agent"}</span><span>{"Agent"}</span><span>{"Agent"}</span></div></div></div>
      <h3>{t("Votre façon de travailler devient un logiciel.")}</h3><p className="muted">{t("Chacun voit les mêmes informations, à jour.")}</p><div className="status client"><i></i>{t("Chez un client")}</div></div>
  </div>
</div></section>



<section className="parcours" id={fr ? "parcours" : "path"}><div className="wrap">
  <h2>{t("Trois étapes,")}{" "}<b>{t("vous commencez où vous voulez.")}</b></h2>
  <div className="steps">
    <div className="step"><span className="n">{t("Étape 1")}</span><h3>{t("Apprendre")}</h3><p>{t("Former les équipes, puis construire un premier agent avec nous.")}</p></div>
    <div className="step"><span className="n">{t("Étape 2")}</span><h3>{t("Améliorer")}</h3><p>{t("Choisir les priorités, puis mettre en place des solutions rapides et utiles.")}</p></div>
    <div className="step"><span className="n">{t("Étape 3")}</span><h3>{t("Construire")}</h3><p>{t("Des outils reliés entre eux, puis des logiciels à vous, en production.")}</p></div>
  </div>
  <p className="aussi">{t("Déjà équipé ? Nous vérifions vos agents et leurs règles, nous installons l'IA sur vos serveurs, nous auditons votre usage de Claude Code.")}</p>
</div></section>

<section id="services"><div className="wrap">
  <h2>{t("Ce que l'IA prépare")}{" "}<b>{t("dans chaque service.")}</b></h2>
  <ServiceGrid items={[[t("Direction"), t("Elle résume les décisions de chaque réunion.")], ["Finance", t("Elle signale les écarts entre deux fichiers.")], [t("Commercial"), t("Elle repère les entreprises à contacter.")], [t("Ressources humaines"), t("Elle vérifie qu'un dossier est complet.")], ["Marketing", t("Elle adapte un même texte à chaque canal.")], [t("Juridique"), t("Elle prépare un projet de contrat à relire.")]]} />
  <div className="status"><i></i>{t("Exemples illustratifs")}</div>
</div></section>

<section id={fr ? "confiance" : "safeguards"} style={{"background": "var(--sky)"}}><div className="wrap">
  <h2>{t("Vos agents agissent")}{" "}<b>{t("dans des limites que vous fixez.")}</b></h2>
  <div className="trust">
    <div className="card"><div className="q">{t("Quels clients relancer cette semaine ?")}</div><div className="v"><b>{t("Autorisé")}</b>{t("Il reçoit la liste de ses clients.")}</div><div className="q">{t("Montre-moi les salaires.")}</div><div className="v"><b className="no">{t("Refusé")}</b>{t("Il n'a pas le droit de lire la paie.")}</div>
      <h3>{t("Chaque agent ne voit que ce qu'il a le droit de voir.")}</h3></div>
    <div className="card"><div className="flow"><div>{t("L'agent veut envoyer un devis au client A.")}</div><div>{t("Tout envoi demande l'accord d'une personne.")}</div><div className="ok">{t("Une personne valide : le devis part.")}</div></div>
      <h3>{t("Rien ne part sans validation.")}</h3><p className="muted">{t("Chez Parrit.ai, aucun message ne part sans l'accord d'une personne.")}</p></div>
    <div className="card"><div className="flow"><div>{t("Un agent écrit le code demandé.")}</div><div>{t("D'autres le relisent, chacun sous un angle.")}</div><div className="ok">{t("Les tests tranchent.")}</div></div>
      <h3>{t("Un agent écrit le code, d'autres le vérifient.")}</h3><p className="muted">{t("Le 19/10/2026, quatre agents ont relu le code avant qu'il soit accepté.")}</p></div>
  </div>
  <div className="host">
    <div><b>{t("Chez un fournisseur")}</b><p className="muted">{t("Vos données sont traitées selon le contrat.")}</p></div>
    <div><b>{t("Sur vos serveurs")}</b><p className="muted">{t("Vos données sont traitées chez vous.")}</p></div>
    <div><b>{t("Mixte")}</b><p className="muted">{t("Les données sensibles restent chez vous.")}</p></div>
  </div>
</div></section>

<section id={fr ? "partenaires" : "team"}><div className="wrap">
  <h2>{t("Chaque projet a son équipe")}{" "}<b>{t("et sa technologie.")}</b></h2>
  <p className="muted" style={{"marginTop": "20px", "maxWidth": "720px"}}>{t("Plus de vingt partenaires, entrepreneurs et consultants indépendants, choisis selon le diagnostic.")}</p>
  <ServiceGrid items={[[t("Ingénieurs IA"), t("Plus de dix ingénieurs en IA appliquée, chacun sa spécialité : vision, agents, intégration.")], [t("Sans code et assistants"), t("Des développeurs et des studios : automatisations, assistants écrits, vocaux et vidéo.")], [t("Transformation et projet"), t("Des experts de la conduite du changement et du pilotage de projet.")], [t("Marque et marketing"), t("Des experts de l'image de marque, des contenus et de la vente.")], [t("Acculturation"), t("Une quinzaine de formateurs mobilisables, et un organisme certifié.")], [t("Conseil et qualité"), t("Des cabinets de conseil et des relecteurs de nos livrables.")]]} />
  <p className="muted" style={{"marginTop": "28px"}}>{t("À l'international : des partenaires au Brésil et en Italie ; au Cameroun, une expansion en cours et de premiers clients.")}</p>
<ResearchPartner/>
</div></section>

<section id="references" style={{"paddingTop": "0"}}><div className="wrap">
  {clients.length > 0 && <><h2>{t("Ils travaillent")}{" "}<b>{t("avec nous.")}</b></h2>
  <div className="refs">
    <ClientReference id="Laparra">{t("Grossiste en fruits et légumes du MIN de Rungis : des agents qui gèrent la base clients, et un outil de pilotage de l'entreprise.")}</ClientReference>
    <ClientReference id="Clevery">{t("Un agent pour le cabinet.")}</ClientReference>
    <ClientReference id="Forexpert">{t("Un agent de prospection.")}</ClientReference>
    <ClientReference id="Joone">{t("L'accompagnement des équipes à l'IA.")}</ClientReference>
    <ClientReference id="SNCF">{t("Un programme de formation, réalisé avec Arkel.")}</ClientReference>
  </div>
  </>}
  <h3 style={{"marginTop": "96px"}}>{t("Les outils avec lesquels nous construisons.")}</h3>
  <div className="tools">
    <div><span aria-hidden="true" className="ic" style={{ maskImage: "url(/tools/openai.svg)" }} />{"ChatGPT"}</div>
    <div><span aria-hidden="true" className="ic" style={{ maskImage: "url(/tools/claude.svg)" }} />{"Claude Code"}</div>
    <div><span aria-hidden="true" className="ic" style={{ maskImage: "url(/tools/openai.svg)" }} />{"Codex"}</div>
    <div><img src="/tools/opencode.png" width="34" height="34" alt="" />{"OpenCode"}</div>
    <div><span aria-hidden="true" className="ic" style={{ maskImage: "url(/tools/googlegemini.svg)" }} />{"Gemini"}</div>
    <div><span aria-hidden="true" className="ic" style={{ maskImage: "url(/tools/n8n.svg)" }} />{"n8n"}</div>
    <div><span aria-hidden="true" className="ic" style={{ maskImage: "url(/tools/supabase.svg)" }} />{"Supabase"}</div>
    <div><span aria-hidden="true" className="ic" style={{ maskImage: "url(/tools/telegram.svg)" }} />{"Telegram"}</div>
    <div><span aria-hidden="true" className="ic" style={{ maskImage: "url(/tools/github.svg)" }} />{"GitHub"}</div>
    <div><span aria-hidden="true" className="ic" style={{ maskImage: "url(/tools/vercel.svg)" }} />{"Vercel"}</div>
  </div>
  <p className="legal-note">{t("Les marques citées appartiennent à leurs propriétaires. Nous les utilisons ; aucun partenariat n'est sous-entendu.")}</p>
</div></section>



<div className="journal-entry wrap"><a href={localizedPath("/journal", locale)}>{fr ? "Ce que nous écrivons" : "What we write"}</a></div>
<section className="founder" id="contact"><div className="wrap"><div className="grid">
  <img src="/photos/paul-centre.png" alt="Paul Larmaraud" width="860" height="1720" loading="lazy" />
  <div>
    <h2>{"Paul Larmaraud, "}<b>{t("fondateur de Parrit.ai.")}</b></h2>
    <p style={{"marginTop": "20px"}}>{t("Il a fondé Parrit.ai en 2024, après deux ans chez Lime.")}</p>
    <ul>
      <li>{t("Il conçoit des systèmes où plusieurs agents travaillent ensemble.")}</li>
      <li>{t("Il met en place les garde-fous qui encadrent les agents.")}</li>
      <li>{t("Il forme les équipes et pilote les projets d'IA.")}</li>
    </ul>
    <p className="local-note">{fr ? "Basé dans la métropole lilloise, il travaille aussi à Paris." : "Based in the Lille area, he also works in Paris."}</p>
    <div className="actions"><a className="btn rev-button exec" href="#reservation">{t("Parler d'un projet")}</a><a className="mail" href="mailto:paul.larmaraud@parrit.ai">{"paul.larmaraud@parrit.ai"}</a></div>
  </div>
</div><div id="reservation" className="reservation"><ParritCalInline locale={locale}/><details className="contact-fallback"><summary>{fr ? "Pas de créneau ? Laissez votre e-mail" : "No slot that works? Leave your e-mail"}</summary><QuickCapture locale={locale} id="single-contact" /></details></div></div></section>

</main>;
}
