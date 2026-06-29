export type PillarSlug =
  | "agents-ia"
  | "formation-agents-ia"
  | "logiciel-ia-sur-mesure";

export interface PillarTranslation {
  title: string;
  description: string;
  intro: string; // HTML
}

export interface Pillar {
  slug: PillarSlug;
  keyword: string;
  translations: Record<"fr" | "en" | "pt-BR", PillarTranslation>;
}

export const PILLARS: Pillar[] = [
  {
    slug: "agents-ia",
    keyword: "agent IA",
    translations: {
      fr: {
        title: "Claude Code et les agents IA : ce qu'on en fait vraiment en entreprise",
        description:
          "Ce qu'est un agent IA, ce qu'il fait en production, comment le déployer en sécurité. Le code agentique appliqué aux opérations.",
        intro: `<p>Un agent IA fait le travail, il ne se contente pas de répondre. Il lit vos données, enchaîne les étapes tout seul, agit dans vos outils et vous rend un résultat utilisable. Le code agentique, comme Claude Code ou Codex, c'est la même mécanique appliquée au logiciel : vous décrivez ce qu'il vous faut, l'agent écrit, teste et livre.</p>
<p>Concrètement, ça donne quoi ? Un agent qui score cinq mille contacts dormants chaque jour. Un autre qui lit la veille réglementaire à votre place et vous envoie l'essentiel le lundi matin. Un troisième qui interroge votre ERP en français, sans que personne touche à une requête. Des systèmes qui tournent déjà en production, pas des promesses de salon.</p>
<p>Notre travail, c'est de les installer chez vous pour de bon : déployés dans votre infrastructure, pilotés par vos équipes, et le code vous reste. La sécurité n'est pas un sujet qu'on règle après coup. Vos données ne sortent pas de chez vous, vos systèmes critiques restent hors de portée de l'agent tant que vous ne l'avez pas décidé, et chaque déploiement suit un guide de sécurité qu'on a écrit et qu'on applique : droits au minimum nécessaire, secrets gardés côté serveur, garde-fous testés avant toute mise en production.</p>`,
      },
      en: {
        title: "Claude Code and AI agents: what we actually do with them in business",
        description:
          "What an AI agent is, what it does in production, how to deploy it safely. Agentic code applied to operations.",
        intro: `<p>An AI agent does the work, it does not just respond. It reads your data, chains the steps on its own, acts in your tools and hands you a usable result. Agentic code, like Claude Code or Codex, is the same mechanics applied to software: you describe what you need, the agent writes, tests and delivers.</p>
<p>What does that look like in practice? An agent that scores five thousand dormant contacts every day. Another that reads the regulatory digest for you and sends you the essentials every Monday morning. A third that queries your ERP in plain language, without anyone touching a SQL query. Systems already running in production, not conference promises.</p>
<p>Our job is to install them at your company for good: deployed in your infrastructure, operated by your teams, and you own the code. Security is not something we address after the fact. Your data does not leave your premises, your critical systems stay out of the agent's reach until you decide otherwise, and every deployment follows a security guide we wrote and apply: least-privilege rights, secrets kept server-side, guardrails tested before any go-live.</p>`,
      },
      "pt-BR": {
        title: "Claude Code e os agentes de IA: o que realmente fazemos com eles nas empresas",
        description:
          "O que é um agente de IA, o que ele faz em produção, como implantá-lo com segurança. O código agêntico aplicado às operações.",
        intro: `<p>Um agente de IA faz o trabalho, não se limita a responder. Ele lê seus dados, encadeia as etapas sozinho, age nas suas ferramentas e entrega um resultado utilizável. O código agêntico, como o Claude Code ou o Codex, é a mesma mecânica aplicada ao software: você descreve o que precisa, o agente escreve, testa e entrega.</p>
<p>Na prática, como fica? Um agente que pontua cinco mil contatos dormentes todo dia. Outro que lê o boletim regulatório no seu lugar e te manda o essencial toda segunda de manhã. Um terceiro que consulta o seu ERP em português, sem que ninguém precise tocar em uma query. Sistemas que já rodam em produção, não promessas de palco.</p>
<p>Nosso trabalho é instalá-los na sua empresa de forma definitiva: implantados na sua infraestrutura, operados pelas suas equipes, e o código fica com você. Segurança não é algo que resolvemos depois. Os seus dados não saem das suas instalações, os seus sistemas críticos ficam fora do alcance do agente até você decidir o contrário, e cada implantação segue um guia de segurança que escrevemos e aplicamos: direitos com o mínimo necessário, segredos guardados no servidor, guardrails testados antes de qualquer entrada em produção.</p>`,
      },
    },
  },
  {
    slug: "formation-agents-ia",
    keyword: "se former aux agents IA",
    translations: {
      fr: {
        title: "Se former aux agents IA : monter en compétence sans devenir développeur",
        description:
          "Apprendre à piloter des agents qui codent et exécutent. Formations hands-on à partir de vos vrais cas, réflexes de sécurité inclus.",
        intro: `<p>Se former aux agents IA, ça ne veut pas dire apprendre à coder. Ça veut dire apprendre à faire travailler des agents qui codent et exécutent pour vous. Le poste qui se dessine, ce n'est pas développeur, c'est plutôt chef d'orchestre d'une petite flotte d'agents : vous cadrez, ils produisent, vous gardez la main sur ce qui sort.</p>
<p>Une formation qui sert à quelque chose part de vos vrais dossiers, pas d'un cours théorique. On prend une tâche qui vous mange du temps chaque semaine et on construit ensemble l'agent qui s'en occupe, en quelques heures. On y apprend aussi les bons réflexes de sécurité, pour que vos équipes déploient sans ouvrir de failles. Nos sessions se font en présentiel ou à distance, et on est en train de décrocher Qualiopi pour ouvrir le financement OPCO.</p>
<p>Vous trouverez ici par où commencer quand on ne code pas, comment embarquer une équipe entière, et à quoi ressemble un premier agent monté en une journée.</p>`,
      },
      en: {
        title: "Learning to use AI agents: build skills without becoming a developer",
        description:
          "Learn to operate agents that code and execute. Hands-on training from your real cases, security reflexes included.",
        intro: `<p>Learning to use AI agents does not mean learning to code. It means learning to make agents that code and execute work for you. The role taking shape is not developer, it is more like conductor of a small fleet of agents: you set the direction, they produce, you keep control over what comes out.</p>
<p>Training that is actually useful starts from your real files, not a theoretical course. We take a task that eats your time every week and build together the agent that handles it, in a few hours. We also cover the right security reflexes, so your teams can deploy without opening vulnerabilities. Our sessions run in person or remotely, and we are working on Qualiopi accreditation to open up OPCO funding.</p>
<p>Here you will find where to start when you do not code, how to bring a whole team along, and what a first agent built in a day looks like.</p>`,
      },
      "pt-BR": {
        title: "Aprender a usar agentes de IA: ganhar competência sem virar desenvolvedor",
        description:
          "Aprender a pilotar agentes que codificam e executam. Treinamentos hands-on a partir dos seus casos reais, reflexos de segurança incluídos.",
        intro: `<p>Aprender a usar agentes de IA não significa aprender a programar. Significa aprender a fazer com que agentes que programam e executam trabalhem para você. O papel que está surgindo não é o de desenvolvedor, é mais o de regente de uma pequena frota de agentes: você define o rumo, eles produzem, você mantém o controle sobre o que sai.</p>
<p>Um treinamento que serve para algo começa pelos seus casos reais, não por um curso teórico. Pegamos uma tarefa que consome o seu tempo toda semana e construímos juntos o agente que cuida disso, em poucas horas. Também cobrimos os reflexos certos de segurança, para que as suas equipes implantem sem abrir brechas. As nossas sessões acontecem presencialmente ou à distância, e estamos buscando o credenciamento Qualiopi para abrir o financiamento pelo OPCO.</p>
<p>Aqui você vai encontrar por onde começar quando não programa, como embarcar toda uma equipe e como é um primeiro agente construído em um dia.</p>`,
      },
    },
  },
  {
    slug: "logiciel-ia-sur-mesure",
    keyword: "créer un logiciel IA",
    translations: {
      fr: {
        title: "Créer un logiciel IA sur-mesure : du prototype en 14 jours à la production",
        description:
          "Un logiciel IA fonctionnel en deux semaines, testé sur vos données, code livré sur stack ouverte. Du prototype à la production.",
        intro: `<p>On peut aujourd'hui avoir un logiciel IA qui marche sans équipe technique et sans attendre six mois. Avec le code agentique, on sort une première version fonctionnelle, testée sur vos vraies données, en deux semaines. Pas une maquette qu'on range dans un tiroir, un outil que vos équipes ouvrent tous les jours.</p>
<p>La vraie question n'est plus de choisir entre développer et acheter. C'est de savoir quelle partie de votre logiciel vous appartient. Un SaaS générique vous loue une fonction et vous impose sa logique. Un outil sur-mesure épouse votre process et reste à vous. On livre le code sur une stack ouverte, Claude Code, Gemini, n8n, sans boîte noire et sans vous rendre dépendants de nous. Tout passe par votre infrastructure et suit notre guide de sécurité, donc vos équipes peuvent l'auditer et le faire vérifier.</p>`,
      },
      en: {
        title: "Building custom AI software: from prototype in 14 days to production",
        description:
          "A working AI tool in two weeks, tested on your data, code delivered on an open stack. From prototype to production.",
        intro: `<p>Today you can have AI software that works without a technical team and without waiting six months. With agentic code, we ship a first working version, tested on your real data, in two weeks. Not a mockup that sits in a drawer, a tool your teams open every day.</p>
<p>The real question is no longer whether to build or buy. It is about knowing which part of your software belongs to you. A generic SaaS rents you a function and imposes its logic. A custom tool fits your process and stays yours. We deliver the code on an open stack, Claude Code, Gemini, n8n, with no black box and without making you dependent on us. Everything runs through your infrastructure and follows our security guide, so your teams can audit it and have it independently verified.</p>`,
      },
      "pt-BR": {
        title: "Criar um software de IA sob medida: do protótipo em 14 dias à produção",
        description:
          "Um software de IA funcional em duas semanas, testado nos seus dados, código entregue em stack aberta. Do protótipo à produção.",
        intro: `<p>Hoje é possível ter um software de IA que funciona sem equipe técnica e sem esperar seis meses. Com o código agêntico, entregamos uma primeira versão funcional, testada nos seus dados reais, em duas semanas. Não uma maquete que vai para a gaveta, mas uma ferramenta que as suas equipes abrem todos os dias.</p>
<p>A verdadeira questão não é mais escolher entre desenvolver e comprar. É saber qual parte do seu software pertence a você. Um SaaS genérico te aluga uma função e impõe a sua lógica. Uma ferramenta sob medida adere ao seu processo e fica sendo sua. Entregamos o código em uma stack aberta, Claude Code, Gemini, n8n, sem caixa preta e sem criar dependência de nós. Tudo passa pela sua infraestrutura e segue o nosso guia de segurança, portanto as suas equipes podem auditá-lo e fazer verificações independentes.</p>`,
      },
    },
  },
];

export function getPillars(): Pillar[] {
  return PILLARS;
}

export function getPillar(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug);
}
