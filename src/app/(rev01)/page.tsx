import type { Metadata } from "next";
import Link from "next/link";
import { localizedAlternates, localizedOpenGraph, localizedPath } from "@/system/locale";
import { getLocale } from "@/lib/server/locale";
import { PUBLIC_CLIENT_NAMES, publicClientName } from "@/system/public-clients";
import { getSiteEvidence } from "@/lib/registry/preuves";
import { K, Matiere } from "@/system/components";
import { CaseStudyCard } from "@/system/components/CaseStudyCard";
import { IntegrationBuildSwitcher } from "@/system/components/IntegrationBuildSwitcher";
import { ProcessDiagram } from "@/system/components/ProcessDiagram";

const DICT = {
  fr: {
    hero: {
      kicker: "CONSEIL · TRANSFORMATION · ENGINEERING",
      title: "Transformez votre entreprise. Pas simplement vos outils.",
      sub: "De la stratégie à la mise en production, nous repensons vos opérations, intégrons les bonnes technologies et construisons les systèmes adaptés à votre métier.",
      primary: "Parlons de votre transformation",
      secondary: "Voir nos réalisations"
    },
    brands: {
      kicker: "Ce que nous avons fait, et pour qui",
      list: [
        {
          name: "Laparra",
          description: "grossiste en fruits et légumes du MIN de Rungis : un CRM"
        },
        {
          name: "Clevery Avocats",
          description: "un agent pour le cabinet"
        },
        {
          name: "Forexpert",
          description: "un agent de prospection"
        },
        {
          name: "Joone",
          description: "un accompagnement des équipes à l'IA"
        },
        {
          name: "SNCF",
          description: "un programme de formation réalisé avec Arkel"
        }
      ]
    },
    consulting: {
      title: "Comprendre vos opérations avant de choisir une technologie.",
      body: "Nous commençons par regarder comment votre équipe travaille aujourd'hui. Nous repérons les tâches qui reviennent, celles qui coûtent du temps et celles qui portent un risque. Puis nous décidons avec vous de ce qui mérite d'être transformé, dans quel ordre, et comment vos équipes s'approprieront le changement.",
      steps: [
        [
          "Observer",
          "les tâches réelles, les outils, les données"
        ],
        [
          "Prioriser",
          "valeur, risque, faisabilité"
        ],
        [
          "Transformer",
          "processus et systèmes, une brique à la fois"
        ],
        [
          "Mesurer",
          "ce qui a changé, avec une méthode décidée au départ"
        ]
      ],
      link: "Explorer notre approche conseil."
    },
    examples: "Trois façons dont nous travaillons",
    sprints: {
      title: "Un problème précis, un système testable, une décision fondée sur des preuves.",
      body: "Plutôt que des mois d'hypothèses, un cycle court sur un périmètre décidé ensemble. La durée dépend du problème et se fixe au cadrage.",
      steps: [
        [
          "Cadrage",
          "besoin, résultat attendu, données, critères de succès écrits avant de construire"
        ],
        [
          "Construction",
          "une brique qui tourne sur vos cas réels"
        ],
        [
          "Évaluation",
          "avec vos utilisateurs, contre les critères du cadrage"
        ],
        [
          "Décision",
          "passer en production, corriger ou arrêter, et pourquoi"
        ]
      ],
      limit: "Ce qui n'est pas livré : un système en production à grande échelle, une promesse de délai fixe.",
      link: "Cadrer un sprint."
    },
    engineering: "Intégrer ce qui existe. Construire ce qui manque.",
    harness: {
      title: "Le modèle ne suffit pas. Il faut un système fiable autour.",
      body: "Un agent qui réussit une démonstration peut échouer dans vos opérations. Ce qui fait la différence se trouve autour du modèle : le contexte qu'on lui donne, les outils qu'il a le droit d'utiliser, les vérifications avant chaque action, la supervision humaine et le suivi des coûts.",
      link: "Optimiser notre système d'agents."
    },
    method: [
      "Comprendre comment vos équipes travaillent",
      "Prioriser",
      "Construire une première brique mesurée",
      "L'intégrer à vos outils",
      "La tester avec vos équipes",
      "L'adopter et la maintenir"
    ],
    close: {
      title: "Parlons de l'opération que vous voulez transformer.",
      button: "Parler d'un projet"
    }
  },
  en: {
    hero: {
      kicker: "CONSULTING · TRANSFORMATION · ENGINEERING",
      title: "Transform your business. Not just your tools.",
      sub: "From strategy to production, we rethink your operations, integrate the right technologies and build systems suited to your business.",
      primary: "Let's talk about your transformation",
      secondary: "See our work"
    },
    brands: {
      kicker: "What we have done, and for whom",
      list: [
        {
          name: "Laparra",
          description: "fruit and vegetable wholesaler at the Rungis market: a CRM"
        },
        {
          name: "Clevery Avocats",
          description: "an agent for the firm"
        },
        {
          name: "Forexpert",
          description: "a prospecting agent"
        },
        {
          name: "Joone",
          description: "AI support for the teams"
        },
        {
          name: "SNCF",
          description: "a training program delivered with Arkel"
        }
      ]
    },
    consulting: {
      title: "Understand your operations before choosing a technology.",
      body: "We start by looking at how your team works today. We identify recurring tasks, those that take time and those that carry risk. Then we decide with you what is worth transforming, in which order, and how your teams will adopt the change.",
      steps: [
        [
          "Observe",
          "real tasks, tools and data"
        ],
        [
          "Prioritize",
          "value, risk and feasibility"
        ],
        [
          "Transform",
          "processes and systems, one building block at a time"
        ],
        [
          "Measure",
          "what has changed, using a method agreed at the outset"
        ]
      ],
      link: "Explore our consulting approach."
    },
    examples: "Three ways we work",
    sprints: {
      title: "A precise problem, a testable system, a decision based on evidence.",
      body: "Instead of months of assumptions, a short cycle with a scope agreed together. Duration depends on the problem and is set during scoping.",
      steps: [
        [
          "Scoping",
          "need, expected outcome, data and success criteria written before building"
        ],
        [
          "Construction",
          "a system that runs on your real cases"
        ],
        [
          "Evaluation",
          "with your users, against the scoping criteria"
        ],
        [
          "Decision",
          "move to production, correct or stop, and why"
        ]
      ],
      limit: "What is not delivered: a system in production at scale, a promise of a fixed deadline.",
      link: "Scope a sprint."
    },
    engineering: "Integrate what exists. Build what is missing.",
    harness: {
      title: "The model is not enough. It needs a reliable system around it.",
      body: "An agent that succeeds in a demonstration can fail in your operations. What makes the difference sits around the model: the context it receives, the tools it is allowed to use, checks before each action, human supervision and cost tracking.",
      link: "Optimize our agent system."
    },
    method: [
      "Understand how your teams work",
      "Prioritize",
      "Build a first measured building block",
      "Integrate it with your tools",
      "Test it with your teams",
      "Adopt and maintain it"
    ],
    close: {
      title: "Let's talk about the operation you want to transform.",
      button: "Talk about a project"
    }
  }
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale(); const copy = DICT[locale];
  const title = `Parrit.ai · ${copy.hero.title}`; const description = copy.hero.sub;
  return { title: { absolute: title }, description, alternates: localizedAlternates("/", locale), openGraph: localizedOpenGraph("/", locale, title, description) };
}
export default async function HomePage() {
  const locale = await getLocale(); const copy = DICT[locale];
  const href = (path: string) => localizedPath(path, locale);
  const references = PUBLIC_CLIENT_NAMES.filter(id => getSiteEvidence(id, "home"));
  const cases = (["demo-crm", "Laparra", "Clevery"] as const).filter(id => getSiteEvidence(id, "home"));
  return <main className="rev-page home-s v1-page" data-brand-mode="accessible">
    <section className="home-s-hero r2-dark" id="H01" data-regime="ink"><div className="home-s-wrap">
      <K>{copy.hero.kicker}</K><h1>{copy.hero.title}</h1><p className="home-s-hero-sub">{copy.hero.sub}</p>
      <div className="v1-actions"><Link className="rev-button exec" href={href("/commission")}>{copy.hero.primary}</Link><Link className="rev-button ghost" href={href("/dossiers")}>{copy.hero.secondary}</Link></div>
      <ProcessDiagram locale={locale}/>
    </div></section>
    <div data-regime="calm"><div className="home-s-wrap"><Matiere tone="clair" /></div></div>
    {references.length > 0 && <section className="home-s-brands" id="H02" data-regime="calm"><div className="home-s-wrap"><h2>{copy.brands.kicker}</h2><ul className="home-s-brands-list" role="list">
      {references.map(id => { const evidence = getSiteEvidence(id, "home"); const item = copy.brands.list.find(client => publicClientName(client.name) === id); return evidence && item ? <li key={id} data-evidence={id}><strong>{item.name}</strong>{locale === "fr" ? (id === "Laparra" ? ", " : " : ") : ": "}<span>{item.description}</span></li> : null; })}
    </ul></div></section>}
    <section id="H03" data-regime="calm"><div className="home-s-wrap"><K>{locale === "fr" ? "Conseil & Transformation" : "Consulting & Transformation"}</K><h2>{copy.consulting.title}</h2><p>{copy.consulting.body}</p><ol className="v1-grid v1-numbered">{copy.consulting.steps.map(([title, body], index) => <li key={title}><span className="v1-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></li>)}</ol><Link className="rev-button ghost" href={href("/consulting-transformation")}>{copy.consulting.link}</Link></div></section>
    {cases.length > 0 && <section id="H04" data-regime="ink"><div className="home-s-wrap"><h2>{copy.examples}</h2><div className="v1-cases">{cases.map(id => <CaseStudyCard key={id} id={id} locale={locale} pageId="home"/>)}</div></div></section>}
    <section id="H05" data-regime="calm"><div className="home-s-wrap"><K>AI Sprints</K><h2>{copy.sprints.title}</h2><p>{copy.sprints.body}</p><div className="v1-grid">{copy.sprints.steps.map(([title, body]) => <div key={title}><h3>{title}</h3><p>{body}</p></div>)}</div><p>{copy.sprints.limit}</p><Link className="rev-button ghost" href={href("/ai-sprints")}>{copy.sprints.link}</Link></div></section>
    <section id="H06" data-regime="canard"><div className="home-s-wrap"><K>{locale === "fr" ? "Engineering & Intégration" : "Engineering & Integration"}</K><h2>{copy.engineering}</h2><IntegrationBuildSwitcher locale={locale}/><Link className="rev-button ghost" href={href("/engineering-integration")}>{locale === "fr" ? "Explorer l'engineering" : "Explore engineering"}</Link></div></section>
    <section id="H07" data-regime="ink" className="r2-dark"><div className="home-s-wrap"><K>Harness Engineering</K><h2>{copy.harness.title}</h2><p>{copy.harness.body}</p><Link className="rev-button ghost" href={href("/harness-engineering")}>{copy.harness.link}</Link></div></section>
    <section id="H11" data-regime="calm"><div className="home-s-wrap"><h2>{locale === "fr" ? "Méthode" : "Method"}</h2><ol className="v1-grid v1-numbered v1-method">{copy.method.map((step, index) => <li key={step}><span className="v1-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol></div></section>
    <section id="H12" data-regime="ink" className="home-s-close r2-dark"><div className="home-s-wrap"><h2>{copy.close.title}</h2><div className="v1-close-rows"><Link className="rev-button exec" href={href("/commission")}>{copy.close.button}</Link></div></div></section>
  </main>;
}
