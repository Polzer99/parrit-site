// Copy trilingue du Camp Parrita. FR = langue de référence ; EN vise le
// parent américain fortuné ; ES = espagnol latino-américain neutre.
// Les FAQ nourrissent aussi le JSON-LD FAQPage et llms-full.txt (GEO).

export type CampLang = "fr" | "en" | "es";

export interface Faq {
  q: string;
  a: string;
}

export interface CampCopy {
  langLabel: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  nav: { cta: string };
  hero: {
    kicker: string;
    h1a: string;
    h1b: string;
    h1red: string;
    sub: string;
    cta: string;
    facts: string[];
  };
  story: {
    kicker: string;
    h2: string;
    lead: string;
    capSurf: string;
    capMarket: string;
    steps: { t: string; d: string }[];
  };
  program: {
    kicker: string;
    h2: string;
    capFire: string;
    phases: { days: string; title: string; d: string }[];
  };
  creations: {
    kicker: string;
    h2: string;
    lead: string;
    items: { t: string; d: string }[];
  };
  quote: { text: string; by: string };
  parents: {
    kicker: string;
    h2: string;
    lead: string;
    capWalk: string;
    before: { label: string; d: string };
    during: { label: string; d: string };
    after: { label: string; d: string };
  };
  security: {
    kicker: string;
    h2: string;
    lead: string;
    items: { t: string; d: string }[];
  };
  founder: {
    kicker: string;
    h2: string;
    alt: string;
    p1: string;
    p2: string;
    p3: string;
  };
  forWho: {
    kicker: string;
    h2: string;
    yesLabel: string;
    noLabel: string;
    yes: string[];
    no: string[];
  };
  practical: {
    kicker: string;
    h2: string;
    cols: { t: string; items: string[] }[];
  };
  archives: {
    kicker: string;
    h2: string;
    lead: string;
    items: { img: string; alt: string; cap: string }[];
  };
  faqSection: { kicker: string; h2: string };
  faqs: Faq[];
  apply: {
    kicker: string;
    h2: string;
    sub: string;
    fieldName: string;
    fieldEmail: string;
    fieldPhone: string;
    whoParent: string;
    whoParticipant: string;
    fieldWhy: string;
    submit: string;
    submitting: string;
    error: string;
    fine: string;
    ok: string;
  };
  footer: string;
}

export const FR: CampCopy = {
  langLabel: "FR",
  metaTitle: "Camp Parrita : immersion entrepreneuriale au Costa Rica | Parrit",
  metaDescription:
    "10 jours au Costa Rica sans téléphone, budget minuscule, un business à créer sur place. Le camp qui provoque le déclic entrepreneurial chez les jeunes adultes. 8 places par cohorte, admission sur candidature.",
  ogTitle: "Camp Parrita : le déclic entrepreneurial, au Costa Rica",
  ogDescription:
    "10 jours sans téléphone, un business à créer en partant de rien, un encadrement invisible mais permanent. La métamorphose que ni les études ni un stage ne donnent.",
  nav: { cta: "Candidater" },
  hero: {
    kicker: "Camp Parrita · Côte Pacifique, Costa Rica",
    h1a: "10 jours sans téléphone.",
    h1b: "Un business à créer.",
    h1red: "Un déclic pour la vie.",
    sub: "8 jeunes adultes. Un budget minuscule. L'obligation de créer une activité qui rapporte, en négociant en direct avec les locaux. Ce n'est pas un voyage. C'est une métamorphose, encadrée.",
    cta: "Postuler à la prochaine cohorte",
    facts: ["10 jours", "0 écran", "8 places", "1 business créé sur place"],
  },
  story: {
    kicker: "Chapitre 01 · L'histoire d'origine",
    h2: "Parrit porte le nom d'une ville du Costa Rica : Parrita.",
    lead: "Avant de fonder son entreprise, Paul Larmaraud est parti seul sur cette côte, avec moins de 3 000 €. Ce qui s'est passé en six mois a tout déclenché. Le camp reproduit exactement ce mécanisme.",
    capSurf: "Playa Sámara. Donner des cours de surf sans savoir surfer : on apprend en marchant.",
    capMarket: "Le business de jus de fruits : repérer ce qui manque, le vendre le lendemain.",
    steps: [
      { t: "Parti avec moins de 3 000 €", d: "Arrivée sur la côte Pacifique du Costa Rica, sans plan, sans réseau, sans parler la langue." },
      { t: "Des cours de surf sans savoir surfer", d: "Premier apprentissage : on ne vend pas ce qu'on sait faire, on vend ce que les gens cherchent. Et on apprend en marchant." },
      { t: "Des soirées dans la jungle", d: "Jamais organisé une soirée de sa vie. Il a trouvé le lieu, les partenaires, le public. Complet." },
      { t: "Hôtels, jus de fruits, hospitality", d: "Embauché dans des hôtels sans parler espagnol. Puis un business de jus de fruits, monté en repérant ce qui manquait sur place. Pieds nus, sans téléphone." },
      { t: "Six mois plus tard, le déclic est acquis", d: "Retour en France. Une mission d'intérim chez Lime devient deux ans à lancer un programme. Puis la création de son entreprise, Parrit, nommée d'après la ville du déclic : Parrita." },
    ],
  },
  program: {
    kicker: "Chapitre 02 · Le programme",
    h2: "Trois phases. Aucune échappatoire. Un cadre solide.",
    capFire: "Le débrief du soir, autour du feu : 30 minutes sur les blocages réels de la journée.",
    phases: [
      { days: "Jours 1 et 2", title: "La déconnexion", d: "Téléphone, montre connectée et carte bancaire déposés au coffre. Briefing sécurité, remise du kit minimaliste et d'un petit pécule. À partir de là, tout se gagne." },
      { days: "Jours 3 à 8", title: "Le défi terrain", d: "Créer une activité qui rapporte, ou un partenariat rentable avec un commerce local. Négociation en direct, en face à face. Chaque soir, 30 minutes de débrief sur les blocages réels : la peur d'aborder, le refus, l'ennui." },
      { days: "Jours 9 et 10", title: "Le retour", d: "Présentation des résultats devant le groupe. Restitution des téléphones. Atelier d'intégration : comment garder ce niveau d'audace une fois rentré, dans les études, un job ou un projet." },
    ],
  },
  creations: {
    kicker: "Sur le terrain",
    h2: "Ce qu'ils créent, concrètement.",
    lead: "Pas de business plan, pas de pitch deck : du cash gagné en vrai, avec les moyens du bord. Tout ce qui suit vient du vécu du fondateur sur cette côte.",
    items: [
      { t: "Cours de surf", d: "Le fondateur en a donné sans savoir surfer. On vend ce que les gens cherchent, on apprend en marchant." },
      { t: "Événementiel", d: "Une soirée dans la jungle : trouver le lieu, les partenaires, le public. Complet dès la première." },
      { t: "Jus de fruits", d: "Repérer ce qui manque sur la plage, l'acheter au marché, le vendre le lendemain." },
      { t: "Services aux hôtels", d: "Accueil, animation, mise en relation avec les touristes : les hôtels manquent toujours de bras fiables." },
      { t: "Guides et excursions", d: "Cascades, spots de surf, pêche : les touristes paient pour être emmenés au bon endroit." },
      { t: "Ce qu'on n'a pas prévu", d: "Le meilleur business de la cohorte sera celui qu'aucune liste n'avait anticipé. C'est le principe." },
    ],
  },
  quote: {
    text: "« Personne ne m'a appris à entreprendre. On m'a juste retiré le filet. Le reste est venu tout seul. »",
    by: "Paul Larmaraud · fondateur, Parrit",
  },
  parents: {
    kicker: "Chapitre 03 · Pour les parents",
    h2: "Vous ne payez pas un séjour. Vous financez un avant / après.",
    lead: "Beaucoup de jeunes brillants n'ont jamais eu à se débrouiller. Le camp leur donne ce que ni les études ni un stage ne donnent : la preuve vécue qu'ils peuvent créer de la valeur en partant de rien. Pendant ce temps, le cadre de sécurité (référent local, contact médical, base arrière, point quotidien) reste actif en permanence, sans qu'ils le sentent.",
    capWalk: "Pieds nus, sans téléphone. L'inconfort est le professeur ; la sécurité, invisible.",
    before: { label: "Avant", d: "À l'aise partout, autonome nulle part. Le téléphone comme prothèse, le confort comme plafond." },
    during: { label: "Pendant", d: "Obligé d'aborder, de négocier, d'encaisser des refus, de trouver un manque et de le combler. Débriefé chaque soir." },
    after: { label: "Après", d: "Un jeune qui a généré du cash en partant de rien ne raconte plus sa vie de la même façon. Et ne la conduit plus de la même façon." },
  },
  security: {
    kicker: "Chapitre 04 · La sécurité",
    h2: "Livrés à eux-mêmes en apparence. Jamais en réalité.",
    lead: "La sensation de risque fait partie de l'expérience. Le risque réel, lui, est géré comme sur une expédition : un dispositif complet, actif en permanence, invisible pour les participants.",
    items: [
      { t: "Un référent local permanent", d: "Un fixeur qui vit sur place, connaît chaque commerce et chaque famille de la zone. Il sait où est chaque participant sans jamais se montrer." },
      { t: "Un contact médical identifié", d: "Clinique repérée, protocole d'évacuation écrit, trousse de secours à la base arrière. Le standard d'une expédition, pas d'une colonie." },
      { t: "Une base arrière", d: "Un toit, de l'eau, un repas assuré chaque soir. Le défi porte sur le business, jamais sur la survie." },
      { t: "Un point quotidien obligatoire", d: "Chaque soir, 30 minutes de débrief avec l'encadrant. Personne ne passe une journée sans être vu, écouté, recadré si besoin." },
      { t: "Un canal famille ouvert 24h/24", d: "Les participants n'ont pas de téléphone ; les parents, si. L'encadrement est joignable à tout moment du séjour, dans les deux sens." },
      { t: "Une zone éprouvée", d: "La côte Pacifique autour de Sámara et Parrita : des villages touristiques habitués aux voyageurs, où le fondateur a lui-même vécu six mois." },
    ],
  },
  founder: {
    kicker: "Chapitre 05 · Qui encadre",
    h2: "Paul Larmaraud. Il ne raconte pas le camp, il l'a vécu.",
    alt: "Paul Larmaraud, fondateur du Camp Parrita",
    p1: "Parti seul sur cette côte avec moins de 3 000 €, sans parler la langue. Six mois plus tard : des cours de surf donnés, des soirées organisées, des hôtels qui l'embauchent, un business de jus de fruits qui tourne.",
    p2: "De retour en France, une mission d'intérim chez Lime devient deux ans à lancer un programme. Puis il fonde Parrit, son entreprise, nommée d'après la ville du déclic.",
    p3: "Pendant le camp, il est présent sur place du premier au dernier jour, en coach de l'ombre : il observe à distance, débriefe chaque soir, et ne fait jamais à la place des participants.",
  },
  forWho: {
    kicker: "La sélection",
    h2: "Ce camp n'est pas fait pour tout le monde. C'est voulu.",
    yesLabel: "Fait pour",
    noLabel: "Pas fait pour",
    yes: [
      "18 à 30 ans, prêt à jouer le jeu à fond, y compris l'inconfort",
      "Étudiant brillant mais jamais confronté au réel, que ses parents veulent voir se révéler",
      "Jeune entrepreneur bloqué, qui tourne en rond derrière son écran",
      "Capable de tenir 10 jours sans réseaux sociaux (oui, ça se teste à l'entretien)",
    ],
    no: [
      "Celui qu'on inscrit contre sa volonté : l'entretien l'écarte systématiquement",
      "Celui qui cherche des vacances originales ou du tourisme d'aventure",
      "Celui qui a besoin d'un suivi médical ou psychologique incompatible avec l'isolement",
      "Celui dont la seule motivation est de faire plaisir à ses parents",
    ],
  },
  practical: {
    kicker: "Le cadre, concrètement",
    h2: "Ce qui est prévu, ce qui ne l'est pas, et pourquoi.",
    cols: [
      {
        t: "Ce qui est pris en charge",
        items: [
          "Vols aller-retour accompagnés depuis Paris",
          "Base arrière : toit, eau, un repas assuré par jour",
          "Kit de départ minimaliste + petit pécule en colones",
          "Encadrement sur place pendant tout le séjour",
          "Référent local, protocole médical, assurance du programme",
        ],
      },
      {
        t: "Ce qui n'est pas fourni, volontairement",
        items: [
          "Le confort : pas d'hôtel, pas de climatisation, pas de room service",
          "Le téléphone, la montre connectée, la carte bancaire : au coffre",
          "L'argent au-delà du pécule : le reste se gagne sur place",
          "Les réponses : l'encadrant débriefe, il ne fait jamais à la place",
        ],
      },
      {
        t: "Comment ça démarre",
        items: [
          "Candidature en ligne, réponse sous 48 h",
          "Entretien de 20 minutes avec le participant (parents bienvenus)",
          "Appel de préparation : équipement, santé, attentes",
          "Départ groupé depuis Paris, remise des téléphones à l'arrivée",
        ],
      },
    ],
  },
  archives: {
    kicker: "Archives 2022 · Les preuves",
    h2: "Ce n'est pas un storytelling. Voici les originaux.",
    lead: "Le flyer de la vraie soirée, la vidéo de la vraie plage, les vraies platines. Tout ce que cette page raconte s'est passé, et il en reste des traces.",
    items: [
      { img: "/camp/archive-flyer-jungle-rave.jpg", alt: "Flyer original de la Jungle Rave du 23 juillet 2022 à Samara Beach", cap: "Le flyer original : Jungle Rave, 23 juillet 2022, Samara Beach. Au line-up : Polzer, le nom de scène de Paul." },
      { img: "/camp/archive-dj-symbiosis.jpg", alt: "Paul aux platines pendant une soirée Symbiosis en 2022", cap: "Image tirée des vidéos de l'époque : Paul aux platines de sa propre soirée. Il n'avait jamais mixé avant le Costa Rica." },
      { img: "/camp/archive-samara-beach.jpg", alt: "La plage de Sámara filmée en 2022", cap: "Sámara, 2022, filmée au téléphone avant qu'il soit posé au coffre. C'est là que tout a commencé." },
    ],
  },
  faqSection: { kicker: "Questions des parents", h2: "Tout ce que vous vous demandez, sans détour." },
  faqs: [
    {
      q: "Qu'est-ce que le Camp Parrita, concrètement ?",
      a: "Le Camp Parrita est une immersion entrepreneuriale de 10 jours au Costa Rica, sans téléphone, avec un budget volontairement minuscule. Chaque participant doit créer une activité qui génère du cash sur place, en négociant en direct avec les commerces locaux. Ce n'est ni une colonie de vacances ni un séminaire : c'est un défi réel, encadré discrètement, conçu pour provoquer un déclic entrepreneurial durable.",
    },
    {
      q: "À qui s'adresse ce camp ?",
      a: "À deux profils : des jeunes adultes (18 ans et plus) que leurs parents veulent voir gagner en autonomie, en débrouillardise et en goût de l'effort, et des jeunes entrepreneurs déjà lancés mais bloqués, qui ont besoin d'un électrochoc. L'admission se fait sur candidature puis entretien : nous ne prenons pas tout le monde.",
    },
    {
      q: "Est-ce que c'est dangereux ? Comment la sécurité est-elle assurée ?",
      a: "Les participants ont la sensation d'être livrés à eux-mêmes, mais le cadre de sécurité est permanent et invisible : un référent local (fixeur) qui connaît la zone, un contact médical identifié, une base arrière où dormir, un point quotidien avec l'encadrant. La zone (côte Pacifique, région de Sámara et Parrita) est une zone touristique habituée aux voyageurs. La sensation de risque fait partie de l'expérience ; le risque réel est géré.",
    },
    {
      q: "Pourquoi confisquer le téléphone ?",
      a: "Parce que le téléphone est la sortie de secours qui empêche le déclic. Sans lui, il faut demander son chemin, négocier en face à face, s'ennuyer, observer, oser. Les téléphones sont conservés en sécurité pendant le séjour et un canal d'urgence reste ouvert en permanence : les familles peuvent joindre l'encadrement à tout moment.",
    },
    {
      q: "Que font les participants pendant les 10 jours ?",
      a: "Jours 1 et 2 : arrivée, dépôt du téléphone, briefing sécurité, remise d'un petit pécule. Jours 3 à 8 : le défi. Créer une activité rentable ou un partenariat avec un commerce local (restaurant, surf shop, hôtel, tourisme), en partant de rien. Chaque soir, un débrief de 30 minutes sur les blocages rencontrés. Jours 9 et 10 : présentation des résultats devant le groupe, restitution des téléphones, atelier de retour pour transformer l'expérience en habitudes durables.",
    },
    {
      q: "Mon enfant ne parle pas espagnol. C'est un problème ?",
      a: "Non, c'est un des leviers du déclic. Le fondateur du camp est arrivé au Costa Rica sans parler la langue et a travaillé dans des hôtels dès les premières semaines. Se faire comprendre sans vocabulaire force à oser, et l'anglais suffit dans les zones touristiques pour démarrer.",
    },
    {
      q: "Combien coûte le camp ?",
      a: "Le tarif est communiqué lors de l'entretien de candidature. C'est un programme premium, en petit groupe (8 participants maximum), avec un encadrement dédié sur place. Si votre première question est le prix plutôt que la transformation, ce camp n'est probablement pas pour vous.",
    },
    {
      q: "Qu'est-ce que mon enfant en retire, une fois rentré ?",
      a: "La preuve vécue qu'il peut créer de la valeur en partant de rien. Concrètement : oser aborder des inconnus, négocier, encaisser des refus, trouver un manque et le combler, tenir un objectif sans stimulation numérique. C'est exactement le mécanisme qui a permis au fondateur, à son retour en France, de transformer une simple mission d'intérim chez Lime en deux ans de lancement de programme, puis de créer son entreprise.",
    },
    {
      q: "Qui encadre le camp ?",
      a: "Paul Larmaraud, fondateur de Parrit, qui a vécu lui-même cette expérience sur cette même côte : petits boulots dans l'hospitality, cours de surf, soirées dans la jungle, business de jus de fruits, le tout en moins de six mois avec moins de 3 000 euros en poche. Il est présent sur place pendant tout le séjour, en posture de coach de l'ombre : il observe, débriefe chaque soir, mais ne fait jamais à la place des participants.",
    },
    {
      q: "Comment suis-je informé pendant le séjour, en tant que parent ?",
      a: "Vous recevez un point de l'encadrement à l'arrivée, à mi-parcours et au retour. Entre ces trois jalons, pas de nouvelles quotidiennes : c'est une condition de la métamorphose. En revanche, le canal d'urgence fonctionne 24h/24 dans les deux sens : s'il se passe quoi que ce soit, vous êtes appelé immédiatement, et vous pouvez joindre l'encadrement à tout moment.",
    },
    {
      q: "Et si mon enfant craque et veut abandonner ?",
      a: "Ça arrive, en général au jour 3 ou 4, et c'est souvent le moment le plus important du séjour. L'encadrant est là pour ça : le débrief du soir transforme l'envie d'abandonner en matière de travail. Si un participant veut réellement arrêter, personne ne le retient de force : on organise son retour, avec ses parents. En pratique, passer le cap du milieu change tout.",
    },
    {
      q: "Quel est le taux d'encadrement ?",
      a: "8 participants maximum, avec deux adultes dédiés sur place en permanence (le fondateur et le référent local), plus un contact médical identifié : un adulte pour quatre jeunes. Et une honnêteté totale sur le reste : en journée, les participants agissent seuls dans une zone connue et délimitée. C'est le cœur du programme. Le débrief du soir est obligatoire, le référent local sait toujours où ils sont, et le canal d'urgence ne ferme jamais.",
    },
    {
      q: "Quelle assurance couvre le séjour ?",
      a: "Le programme est couvert par une assurance responsabilité civile professionnelle. Chaque participant doit en plus disposer d'une assurance voyage incluant les frais médicaux et l'évacuation sanitaire : nous la vérifions ensemble lors de l'appel de préparation, avant le départ. Personne ne monte dans l'avion sans que cette couverture soit en place.",
    },
    {
      q: "Que disent les autorités sur le Costa Rica ?",
      a: "L'avis du Département d'État américain classe le Costa Rica au niveau 2 (« vigilance renforcée ») : le même palier que la France, l'Italie ou le Royaume-Uni. Le pays n'a pas d'armée depuis 1948 et vit largement du tourisme. Le 911 fonctionne sur place, mais un opérateur anglophone n'est pas garanti : c'est précisément pour ça que le camp a son propre protocole médical écrit et un encadrement qui parle la langue.",
    },
    {
      q: "Comment inscrire mon enfant ou postuler ?",
      a: "Via le formulaire de candidature en bas de cette page. Nous répondons sous 48 heures pour organiser un entretien de 20 minutes avec le participant (et les parents s'ils le souhaitent). L'entretien valide la motivation, pas le CV : nous cherchons des jeunes prêts à jouer le jeu à fond.",
    },
  ],
  apply: {
    kicker: "Candidature",
    h2: "8 places par cohorte. L'entretien décide.",
    sub: "Laissez vos coordonnées : nous revenons vers vous sous 48 h pour un entretien de 20 minutes. Parents bienvenus.",
    fieldName: "Prénom et nom",
    fieldEmail: "Email",
    fieldPhone: "Téléphone (optionnel)",
    whoParent: "Je suis un parent",
    whoParticipant: "Je suis le futur participant",
    fieldWhy: "Pourquoi ce camp, pourquoi maintenant ? (3 lignes suffisent)",
    submit: "Postuler à la prochaine cohorte",
    submitting: "Envoi...",
    error: "Un souci d'envoi. Réessayez, ou écrivez à paul.larmaraud@parrit.ai",
    fine: "Réponse sous 48 h. Aucune donnée revendue, aucun spam.",
    ok: "✓ Candidature reçue. Nous revenons vers vous sous 48 h pour planifier l'entretien.",
  },
  footer: "Camp Parrita · une expérience Parrit · parrit.ai",
};

export const EN: CampCopy = {
  langLabel: "EN",
  metaTitle: "Camp Parrita: a 10-day entrepreneurial immersion in Costa Rica",
  metaDescription:
    "10 days in Costa Rica with no phone, almost no money, and one mission: build a real business on the ground. The camp that turns bright young adults into entrepreneurs. 8 spots per cohort, admission by application.",
  ogTitle: "Camp Parrita: the entrepreneurial awakening, in Costa Rica",
  ogDescription:
    "No phone for 10 days, a business built from nothing, and a safety framework that never sleeps. The transformation no classroom or internship can deliver.",
  nav: { cta: "Apply" },
  hero: {
    kicker: "Camp Parrita · Pacific Coast, Costa Rica",
    h1a: "10 days without a phone.",
    h1b: "One business to build.",
    h1red: "A turning point for life.",
    sub: "8 young adults. A tiny budget. One obligation: create something that earns real money, negotiating face to face with locals. This is not a trip. It is a supervised metamorphosis.",
    cta: "Apply for the next cohort",
    facts: ["10 days", "0 screens", "8 spots", "1 business built on the ground"],
  },
  story: {
    kicker: "Chapter 01 · The origin story",
    h2: "Parrit is named after a town in Costa Rica: Parrita.",
    lead: "Before founding his company, Paul Larmaraud landed alone on this coast with less than $3,500. What happened over the next six months changed everything. The camp reproduces that exact mechanism.",
    capSurf: "Playa Sámara. Teaching surf lessons without knowing how to surf: you learn by doing.",
    capMarket: "The fruit juice business: spot what's missing, sell it the next morning.",
    steps: [
      { t: "Landed with less than $3,500", d: "Arrived on Costa Rica's Pacific coast with no plan, no network, and no Spanish." },
      { t: "Surf lessons without knowing how to surf", d: "First lesson learned: you don't sell what you know, you sell what people want. And you learn by doing." },
      { t: "Parties in the jungle", d: "He had never organized an event in his life. He found the venue, the partners, the crowd. Sold out." },
      { t: "Hotels, fruit juice, hospitality", d: "Hired by hotels without speaking Spanish. Then a fruit juice business, built by spotting what the beach was missing. Barefoot, no phone." },
      { t: "Six months later, the switch had flipped", d: "Back in France, a temp assignment at Lime turned into two years launching a program. Then he founded his own company, Parrit, named after the town where it all clicked: Parrita." },
    ],
  },
  program: {
    kicker: "Chapter 02 · The program",
    h2: "Three phases. No way out. A solid frame.",
    capFire: "The evening debrief, around the fire: 30 minutes on the day's real blockers.",
    phases: [
      { days: "Days 1 and 2", title: "The disconnection", d: "Phone, smartwatch and credit cards go into the safe. Safety briefing, minimalist kit and a small cash allowance. From here on, everything is earned." },
      { days: "Days 3 to 8", title: "The field challenge", d: "Build something that earns money, or a profitable partnership with a local business. Real negotiation, face to face. Every evening, a 30-minute debrief on the real blockers: fear of approaching strangers, rejection, boredom." },
      { days: "Days 9 and 10", title: "The return", d: "Results presented to the group. Phones handed back. Integration workshop: how to keep this level of boldness once home, in school, a job or a venture." },
    ],
  },
  creations: {
    kicker: "On the ground",
    h2: "What they actually build.",
    lead: "No business plan, no pitch deck: real cash earned with whatever is at hand. Everything below comes from the founder's own months on this coast.",
    items: [
      { t: "Surf lessons", d: "The founder taught them without knowing how to surf. You sell what people want, and learn by doing." },
      { t: "Events", d: "A party in the jungle: find the venue, the partners, the crowd. Sold out on the first night." },
      { t: "Fruit juice", d: "Spot what the beach is missing, buy it at the market, sell it the next day." },
      { t: "Hotel services", d: "Reception, entertainment, connecting with tourists: hotels always need reliable hands." },
      { t: "Guides and excursions", d: "Waterfalls, surf spots, fishing: tourists pay to be taken to the right place." },
      { t: "The unplanned one", d: "The best business of the cohort will be the one no list anticipated. That is the point." },
    ],
  },
  quote: {
    text: "“Nobody taught me how to build a business. They just took away the safety net. The rest came on its own.”",
    by: "Paul Larmaraud · founder, Parrit",
  },
  parents: {
    kicker: "Chapter 03 · For parents",
    h2: "You are not paying for a trip. You are funding a before and after.",
    lead: "Many bright young people have simply never had to fend for themselves. This camp gives them what no school or internship can: lived proof that they can create value from nothing. Meanwhile, the safety framework (local fixer, medical contact, base camp, daily check-in) stays active around the clock, without them ever feeling it.",
    capWalk: "Barefoot, no phone. Discomfort is the teacher; safety stays invisible.",
    before: { label: "Before", d: "Comfortable everywhere, autonomous nowhere. The phone as a crutch, comfort as a ceiling." },
    during: { label: "During", d: "Forced to approach, negotiate, absorb rejection, find a gap and fill it. Debriefed every evening." },
    after: { label: "After", d: "A young adult who has earned real money starting from nothing tells their story differently. And leads their life differently." },
  },
  security: {
    kicker: "Chapter 04 · Safety",
    h2: "On their own in appearance. Never in reality.",
    lead: "The feeling of risk is part of the experience. The actual risk is managed like an expedition: a complete framework, active around the clock, invisible to participants.",
    items: [
      { t: "A permanent local fixer", d: "A local who lives there and knows every shop and every family in the area. He knows where each participant is without ever showing himself." },
      { t: "An identified medical contact", d: "A vetted private clinic, a written evacuation protocol, a first-aid kit at base camp. Expedition standards, not summer-camp standards." },
      { t: "A base camp", d: "A roof, water, one guaranteed meal every evening. The challenge is about business, never about survival." },
      { t: "A mandatory daily check-in", d: "Every evening, 30 minutes of debrief with the lead. Nobody goes a single day without being seen, heard, and steadied if needed." },
      { t: "A 24/7 family line", d: "Participants have no phone; parents do. The team can be reached at any moment of the stay, in both directions." },
      { t: "A proven area", d: "The Pacific coast around Sámara and Parrita: tourist towns used to travelers, where the founder himself lived for six months." },
    ],
  },
  founder: {
    kicker: "Chapter 05 · Who runs it",
    h2: "Paul Larmaraud. He doesn't tell the story of the camp. He lived it.",
    alt: "Paul Larmaraud, founder of Camp Parrita",
    p1: "He landed alone on this coast with less than $3,500 and no Spanish. Six months later: surf lessons taught, events organized, hotels hiring him, a fruit juice business running.",
    p2: "Back in France, a temp assignment at Lime became two years launching a program. Then he founded Parrit, his company, named after the town where everything clicked.",
    p3: "During the camp he is on site from the first day to the last, as a shadow coach: he watches from a distance, debriefs every evening, and never does the work for the participants.",
  },
  forWho: {
    kicker: "Selection",
    h2: "This camp is not for everyone. By design.",
    yesLabel: "Built for",
    noLabel: "Not built for",
    yes: [
      "18 to 30, ready to play the game fully, discomfort included",
      "A bright student who has never faced the real world, whose parents want to see them step up",
      "A young founder who is stuck, going in circles behind a screen",
      "Able to last 10 days without social media (yes, we test for it in the interview)",
    ],
    no: [
      "Anyone enrolled against their will: the interview filters this out systematically",
      "Anyone looking for original vacations or adventure tourism",
      "Anyone whose medical or psychological needs are incompatible with remoteness",
      "Anyone whose only motivation is to please their parents",
    ],
  },
  practical: {
    kicker: "The practical frame",
    h2: "What is covered, what is deliberately not, and why.",
    cols: [
      {
        t: "What is taken care of",
        items: [
          "Escorted group flights from Paris; international participants are met at San José airport (SJO)",
          "Base camp: a roof, water, one guaranteed meal a day",
          "Minimalist starter kit + a small allowance in colones",
          "On-site supervision for the entire stay",
          "Local fixer, medical protocol, program insurance",
        ],
      },
      {
        t: "What is deliberately not provided",
        items: [
          "Comfort: no hotel, no air conditioning, no room service",
          "Phone, smartwatch, credit cards: locked in the safe",
          "Money beyond the allowance: the rest is earned on the ground",
          "Answers: the coach debriefs, he never does it for them",
        ],
      },
      {
        t: "How it starts",
        items: [
          "Online application, answer within 48 hours",
          "A 20-minute interview with the participant (parents welcome)",
          "A preparation call: gear, health, expectations",
          "Group departure, phones handed in on arrival",
        ],
      },
    ],
  },
  archives: {
    kicker: "2022 archives · The proof",
    h2: "This is not storytelling. These are the originals.",
    lead: "The flyer of the actual party, the video of the actual beach, the actual DJ decks. Everything this page tells you happened, and the traces still exist.",
    items: [
      { img: "/camp/archive-flyer-jungle-rave.jpg", alt: "Original flyer of the Jungle Rave, July 23, 2022, Samara Beach", cap: "The original flyer: Jungle Rave, July 23, 2022, Samara Beach. On the line-up: Polzer, Paul's stage name." },
      { img: "/camp/archive-dj-symbiosis.jpg", alt: "Paul DJing at a Symbiosis party in 2022", cap: "A frame from the original videos: Paul behind the decks of his own party. He had never mixed before Costa Rica." },
      { img: "/camp/archive-samara-beach.jpg", alt: "Sámara beach filmed in 2022", cap: "Sámara, 2022, filmed on a phone before phones went into the safe. This is where it all started." },
    ],
  },
  faqSection: { kicker: "Parents' questions", h2: "Everything you are wondering, straight answers." },
  faqs: [
    {
      q: "What exactly is Camp Parrita?",
      a: "Camp Parrita is a 10-day entrepreneurial immersion on Costa Rica's Pacific coast: no phone, a deliberately tiny budget, and one mission: build something that earns real money by negotiating directly with local businesses. It is neither a summer camp nor a seminar: it is a real challenge, discreetly supervised, designed to trigger a lasting entrepreneurial awakening.",
    },
    {
      q: "Who is this camp for?",
      a: "Two profiles: young adults (18+) whose parents want to see them gain autonomy, resourcefulness and a taste for effort, and young founders who are already launched but stuck and need a jolt. Admission is by application followed by an interview: we do not take everyone.",
    },
    {
      q: "Is it safe? How is safety handled?",
      a: "Participants feel like they are on their own, but the safety framework is permanent and invisible: a local fixer who knows the area, an identified medical contact with a written evacuation protocol, a base camp to sleep in, and a mandatory daily debrief with the lead. The area, around Sámara and Parrita on the Pacific coast, is a well-traveled tourist region. The feeling of risk is part of the experience; the actual risk is managed.",
    },
    {
      q: "Why take away the phone?",
      a: "Because the phone is the escape hatch that prevents the transformation. Without it, you have to ask for directions, negotiate face to face, get bored, observe, dare. Phones are stored securely for the stay, and an emergency line stays open around the clock: families can reach the team at any time.",
    },
    {
      q: "Is Costa Rica safe for young travelers?",
      a: "Costa Rica is one of the most stable countries in Latin America: no army since 1948, a long democratic tradition, and a tourism industry that hosts millions of visitors a year. The camp operates in small Pacific-coast towns that live off tourism, where the founder himself lived for six months. As anywhere, the framework matters: participants stay within a known zone, with a local fixer and daily check-ins.",
    },
    {
      q: "Do participants need a visa for Costa Rica?",
      a: "For US, Canadian, UK and EU passport holders, no visa is required for a stay of this length: a valid passport and proof of onward travel are enough. We confirm entry requirements for each participant's nationality during the preparation call, along with recommended vaccinations and insurance details.",
    },
    {
      q: "What about health and medical care on site?",
      a: "Costa Rica has one of the best healthcare systems in Latin America, with private clinics in tourist areas. The camp has an identified medical contact, a written evacuation protocol and a first-aid kit at base camp, and the program includes insurance coverage. Any medical condition is discussed confidentially before departure during the preparation call.",
    },
    {
      q: "My kid doesn't speak Spanish. Is that a problem?",
      a: "No, it is one of the levers of the transformation. The founder arrived in Costa Rica without the language and was working in hotels within weeks. Making yourself understood without vocabulary forces you to dare, and English is enough to get started in tourist areas.",
    },
    {
      q: "How much does the camp cost?",
      a: "The fee is shared during the application interview. It is a premium program: 8 participants maximum, a dedicated team on site, and expedition-grade logistics. If your first question is the price rather than the transformation, this camp is probably not for you.",
    },
    {
      q: "How is this different from Outward Bound or a gap year program?",
      a: "Wilderness programs build character through nature; gap years build perspective through travel. Camp Parrita builds one specific thing: the lived proof that you can create economic value from nothing. The challenge is not to survive outdoors or to discover a culture; it is to walk up to strangers, negotiate, get rejected, adjust, and come home having earned real money with your own hands. That is a different muscle, and it is the one entrepreneurs use.",
    },
    {
      q: "What does my child get out of it, back home?",
      a: "Lived proof that they can create value from nothing. Concretely: daring to approach strangers, negotiating, absorbing rejection, finding a gap and filling it, holding a goal without digital stimulation. This is exactly the mechanism that allowed the founder, back in France, to turn a temp assignment at Lime into two years launching a program, then to build his own company.",
    },
    {
      q: "Who supervises the camp?",
      a: "Paul Larmaraud, founder of Parrit, who lived this exact experience on this exact coast: hospitality jobs, surf lessons, jungle events, a fruit juice business, all within six months and with less than $3,500. He is on site for the entire stay as a shadow coach: he observes, debriefs every evening, and never does the work for the participants.",
    },
    {
      q: "How am I kept informed during the stay, as a parent?",
      a: "You receive an update from the team on arrival, at mid-point and on return. Between those milestones, no daily news: it is a condition of the metamorphosis. The emergency line, however, works 24/7 in both directions: if anything happens you are called immediately, and you can reach the team at any time.",
    },
    {
      q: "What if my child breaks down and wants to quit?",
      a: "It happens, usually around day 3 or 4, and it is often the most important moment of the stay. That is what the lead is there for: the evening debrief turns the urge to quit into working material. If a participant genuinely wants to stop, nobody holds them by force: we organize their return, together with the parents. In practice, getting past the mid-point changes everything.",
    },
    {
      q: "What is the staff-to-participant ratio?",
      a: "8 participants maximum, with two dedicated adults permanently on site (the founder and the local fixer) plus an identified medical contact: one adult for every four participants. And full honesty about the rest: during the day, participants operate on their own inside a known, bounded area. That is the heart of the program. The evening debrief is mandatory, the local fixer always knows where they are, and the emergency line never closes.",
    },
    {
      q: "What insurance covers the stay?",
      a: "The program carries professional liability insurance. On top of that, every participant must hold travel medical insurance that includes medical evacuation: we verify it together during the preparation call, before departure. Nobody boards the plane without that coverage in place.",
    },
    {
      q: "What does the US State Department say about Costa Rica?",
      a: "Costa Rica is currently under a Level 2 advisory (\"Exercise Increased Caution\"): the same tier as France, Italy and the United Kingdom. The country has had no army since 1948 and lives largely off tourism. 911 works locally, but an English-speaking operator is not guaranteed, which is exactly why the camp runs its own written medical protocol with staff who speak the language.",
    },
    {
      q: "How do I apply or enroll my child?",
      a: "Through the application form at the bottom of this page. We answer within 48 hours to set up a 20-minute interview with the participant (parents welcome). The interview tests motivation, not resumes: we look for young people ready to play the game fully.",
    },
  ],
  apply: {
    kicker: "Application",
    h2: "8 spots per cohort. The interview decides.",
    sub: "Leave your details: we come back to you within 48 hours for a 20-minute interview. Parents welcome.",
    fieldName: "Full name",
    fieldEmail: "Email",
    fieldPhone: "Phone (optional)",
    whoParent: "I am a parent",
    whoParticipant: "I am the future participant",
    fieldWhy: "Why this camp, why now? (3 lines are enough)",
    submit: "Apply for the next cohort",
    submitting: "Sending...",
    error: "Something went wrong. Try again, or write to paul.larmaraud@parrit.ai",
    fine: "Answer within 48 hours. No data resold, no spam.",
    ok: "✓ Application received. We will come back to you within 48 hours to schedule the interview.",
  },
  footer: "Camp Parrita · a Parrit experience · parrit.ai",
};

export const ES: CampCopy = {
  langLabel: "ES",
  metaTitle: "Camp Parrita: inmersión emprendedora de 10 días en Costa Rica",
  metaDescription:
    "10 días en Costa Rica sin teléfono, con un presupuesto mínimo y una misión: crear un negocio real en el terreno. El campamento que despierta el instinto emprendedor de los jóvenes adultos. 8 plazas por cohorte, admisión por candidatura.",
  ogTitle: "Camp Parrita: el despertar emprendedor, en Costa Rica",
  ogDescription:
    "10 días sin teléfono, un negocio creado desde cero y un dispositivo de seguridad que nunca duerme. La transformación que ni los estudios ni una pasantía pueden dar.",
  nav: { cta: "Postular" },
  hero: {
    kicker: "Camp Parrita · Costa Pacífica, Costa Rica",
    h1a: "10 días sin teléfono.",
    h1b: "Un negocio por crear.",
    h1red: "Un despertar para toda la vida.",
    sub: "8 jóvenes adultos. Un presupuesto mínimo. Una obligación: crear una actividad que genere dinero real, negociando cara a cara con los locales. Esto no es un viaje. Es una metamorfosis, supervisada.",
    cta: "Postular a la próxima cohorte",
    facts: ["10 días", "0 pantallas", "8 plazas", "1 negocio creado en el terreno"],
  },
  story: {
    kicker: "Capítulo 01 · La historia de origen",
    h2: "Parrit lleva el nombre de una ciudad de Costa Rica: Parrita.",
    lead: "Antes de fundar su empresa, Paul Larmaraud llegó solo a esta costa con menos de 3 000 €. Lo que pasó en seis meses lo cambió todo. El campamento reproduce exactamente ese mecanismo.",
    capSurf: "Playa Sámara. Dar clases de surf sin saber surfear: se aprende haciendo.",
    capMarket: "El negocio de jugos: detectar lo que falta y venderlo al día siguiente.",
    steps: [
      { t: "Llegó con menos de 3 000 €", d: "Aterrizó en la costa Pacífica de Costa Rica sin plan, sin contactos y sin hablar el idioma." },
      { t: "Clases de surf sin saber surfear", d: "Primera lección: no se vende lo que uno sabe hacer, se vende lo que la gente busca. Y se aprende haciendo." },
      { t: "Fiestas en la selva", d: "Nunca había organizado una fiesta. Encontró el lugar, los socios, el público. Lleno total." },
      { t: "Hoteles, jugos, hospitalidad", d: "Contratado por hoteles sin hablar español. Después, un negocio de jugos montado detectando lo que faltaba en la playa. Descalzo, sin teléfono." },
      { t: "Seis meses después, el clic estaba hecho", d: "De regreso en Francia, una misión temporal en Lime se convirtió en dos años lanzando un programa. Luego fundó su empresa, Parrit, bautizada con el nombre de la ciudad del despertar: Parrita." },
    ],
  },
  program: {
    kicker: "Capítulo 02 · El programa",
    h2: "Tres fases. Ninguna escapatoria. Un marco sólido.",
    capFire: "El debrief de la noche, alrededor del fuego: 30 minutos sobre los bloqueos reales del día.",
    phases: [
      { days: "Días 1 y 2", title: "La desconexión", d: "Teléfono, reloj inteligente y tarjetas quedan en la caja fuerte. Briefing de seguridad, kit minimalista y un pequeño fondo en colones. A partir de ahí, todo se gana." },
      { days: "Días 3 a 8", title: "El desafío de campo", d: "Crear una actividad que genere ingresos, o una alianza rentable con un comercio local. Negociación real, cara a cara. Cada noche, 30 minutos de debrief sobre los bloqueos reales: el miedo a abordar, el rechazo, el aburrimiento." },
      { days: "Días 9 y 10", title: "El regreso", d: "Presentación de resultados ante el grupo. Devolución de los teléfonos. Taller de integración: cómo conservar ese nivel de audacia de vuelta a casa, en los estudios, un trabajo o un proyecto." },
    ],
  },
  creations: {
    kicker: "En el terreno",
    h2: "Lo que crean, concretamente.",
    lead: "Sin business plan, sin pitch deck: dinero real ganado con lo que hay a mano. Todo lo que sigue viene de la experiencia del fundador en esta misma costa.",
    items: [
      { t: "Clases de surf", d: "El fundador las dio sin saber surfear. Se vende lo que la gente busca, y se aprende haciendo." },
      { t: "Eventos", d: "Una fiesta en la selva: encontrar el lugar, los socios, el público. Lleno desde la primera noche." },
      { t: "Jugos de fruta", d: "Detectar lo que falta en la playa, comprarlo en el mercado, venderlo al día siguiente." },
      { t: "Servicios a hoteles", d: "Recepción, animación, conexión con turistas: a los hoteles siempre les faltan manos confiables." },
      { t: "Guías y excursiones", d: "Cascadas, olas, pesca: los turistas pagan por ser llevados al lugar correcto." },
      { t: "Lo imprevisto", d: "El mejor negocio de la cohorte será el que ninguna lista anticipó. Ese es el principio." },
    ],
  },
  quote: {
    text: "« Nadie me enseñó a emprender. Solo me quitaron la red de seguridad. El resto vino solo. »",
    by: "Paul Larmaraud · fundador, Parrit",
  },
  parents: {
    kicker: "Capítulo 03 · Para los padres",
    h2: "No están pagando un viaje. Están financiando un antes y un después.",
    lead: "Muchos jóvenes brillantes simplemente nunca tuvieron que arreglárselas solos. Este campamento les da lo que ni los estudios ni una pasantía pueden dar: la prueba vivida de que pueden crear valor desde cero. Mientras tanto, el dispositivo de seguridad (referente local, contacto médico, campamento base, control diario) permanece activo las 24 horas, sin que ellos lo sientan.",
    capWalk: "Descalzos, sin teléfono. La incomodidad es el maestro; la seguridad, invisible.",
    before: { label: "Antes", d: "Cómodo en todas partes, autónomo en ninguna. El teléfono como muleta, la comodidad como techo." },
    during: { label: "Durante", d: "Obligado a abordar, negociar, encajar rechazos, encontrar una carencia y llenarla. Con debrief cada noche." },
    after: { label: "Después", d: "Un joven que generó dinero real partiendo de cero ya no cuenta su vida de la misma manera. Ni la conduce de la misma manera." },
  },
  security: {
    kicker: "Capítulo 04 · La seguridad",
    h2: "Solos en apariencia. Nunca en realidad.",
    lead: "La sensación de riesgo es parte de la experiencia. El riesgo real se gestiona como en una expedición: un dispositivo completo, activo las 24 horas, invisible para los participantes.",
    items: [
      { t: "Un referente local permanente", d: "Un local que vive ahí y conoce cada comercio y cada familia de la zona. Sabe dónde está cada participante sin mostrarse jamás." },
      { t: "Un contacto médico identificado", d: "Clínica privada identificada, protocolo de evacuación escrito, botiquín en el campamento base. Estándares de expedición, no de campamento de verano." },
      { t: "Un campamento base", d: "Un techo, agua, una comida asegurada cada noche. El desafío es el negocio, nunca la supervivencia." },
      { t: "Un control diario obligatorio", d: "Cada noche, 30 minutos de debrief con el responsable. Nadie pasa un solo día sin ser visto, escuchado y reencaminado si hace falta." },
      { t: "Una línea familiar 24/7", d: "Los participantes no tienen teléfono; los padres, sí. El equipo está localizable en todo momento, en ambos sentidos." },
      { t: "Una zona probada", d: "La costa Pacífica alrededor de Sámara y Parrita: pueblos turísticos acostumbrados a los viajeros, donde el propio fundador vivió seis meses." },
    ],
  },
  founder: {
    kicker: "Capítulo 05 · Quién supervisa",
    h2: "Paul Larmaraud. No cuenta el campamento: lo vivió.",
    alt: "Paul Larmaraud, fundador de Camp Parrita",
    p1: "Llegó solo a esta costa con menos de 3 000 € y sin hablar el idioma. Seis meses después: clases de surf dadas, fiestas organizadas, hoteles que lo contratan, un negocio de jugos funcionando.",
    p2: "De regreso en Francia, una misión temporal en Lime se convirtió en dos años lanzando un programa. Luego fundó Parrit, su empresa, bautizada con el nombre de la ciudad del despertar.",
    p3: "Durante el campamento está presente del primer al último día, como coach en la sombra: observa a distancia, hace el debrief cada noche y nunca hace el trabajo por los participantes.",
  },
  forWho: {
    kicker: "La selección",
    h2: "Este campamento no es para todo el mundo. Es a propósito.",
    yesLabel: "Hecho para",
    noLabel: "No hecho para",
    yes: [
      "De 18 a 30 años, dispuesto a jugar el juego a fondo, incomodidad incluida",
      "Un estudiante brillante que nunca enfrentó el mundo real, y cuyos padres quieren verlo revelarse",
      "Un joven emprendedor bloqueado, dando vueltas detrás de una pantalla",
      "Capaz de aguantar 10 días sin redes sociales (sí, se evalúa en la entrevista)",
    ],
    no: [
      "Quien es inscrito contra su voluntad: la entrevista lo descarta sistemáticamente",
      "Quien busca vacaciones originales o turismo de aventura",
      "Quien necesita un seguimiento médico o psicológico incompatible con el aislamiento",
      "Quien solo quiere complacer a sus padres",
    ],
  },
  practical: {
    kicker: "El marco, en concreto",
    h2: "Lo que está previsto, lo que no lo está, y por qué.",
    cols: [
      {
        t: "Lo que está cubierto",
        items: [
          "Vuelos de ida y vuelta acompañados desde París; los participantes internacionales son recibidos en el aeropuerto de San José (SJO)",
          "Campamento base: techo, agua, una comida asegurada por día",
          "Kit de inicio minimalista + un pequeño fondo en colones",
          "Supervisión en el terreno durante toda la estadía",
          "Referente local, protocolo médico, seguro del programa",
        ],
      },
      {
        t: "Lo que no se provee, a propósito",
        items: [
          "La comodidad: sin hotel, sin aire acondicionado, sin room service",
          "El teléfono, el reloj inteligente, las tarjetas: en la caja fuerte",
          "Dinero más allá del fondo inicial: el resto se gana en el terreno",
          "Las respuestas: el coach hace el debrief, nunca lo hace por ellos",
        ],
      },
      {
        t: "Cómo empieza",
        items: [
          "Candidatura en línea, respuesta en 48 horas",
          "Entrevista de 20 minutos con el participante (padres bienvenidos)",
          "Llamada de preparación: equipo, salud, expectativas",
          "Salida en grupo, entrega de teléfonos a la llegada",
        ],
      },
    ],
  },
  archives: {
    kicker: "Archivos 2022 · Las pruebas",
    h2: "Esto no es storytelling. Estos son los originales.",
    lead: "El flyer de la fiesta real, el video de la playa real, las bandejas reales. Todo lo que cuenta esta página ocurrió, y quedan las huellas.",
    items: [
      { img: "/camp/archive-flyer-jungle-rave.jpg", alt: "Flyer original de la Jungle Rave del 23 de julio de 2022 en Samara Beach", cap: "El flyer original: Jungle Rave, 23 de julio de 2022, Samara Beach. En el line-up: Polzer, el nombre artístico de Paul." },
      { img: "/camp/archive-dj-symbiosis.jpg", alt: "Paul en las bandejas durante una fiesta Symbiosis en 2022", cap: "Imagen de los videos de la época: Paul en las bandejas de su propia fiesta. Nunca había mezclado antes de Costa Rica." },
      { img: "/camp/archive-samara-beach.jpg", alt: "La playa de Sámara filmada en 2022", cap: "Sámara, 2022, filmada con el teléfono antes de que fuera a la caja fuerte. Ahí empezó todo." },
    ],
  },
  faqSection: { kicker: "Preguntas de los padres", h2: "Todo lo que se están preguntando, sin rodeos." },
  faqs: [
    {
      q: "¿Qué es exactamente Camp Parrita?",
      a: "Camp Parrita es una inmersión emprendedora de 10 días en la costa Pacífica de Costa Rica: sin teléfono, con un presupuesto deliberadamente mínimo y una misión: crear una actividad que genere dinero real negociando directamente con los comercios locales. No es un campamento de verano ni un seminario: es un desafío real, supervisado con discreción, diseñado para provocar un despertar emprendedor duradero.",
    },
    {
      q: "¿Para quién es este campamento?",
      a: "Para dos perfiles: jóvenes adultos (18+) cuyos padres quieren verlos ganar autonomía, recursividad y gusto por el esfuerzo, y jóvenes emprendedores ya lanzados pero bloqueados, que necesitan una sacudida. La admisión es por candidatura y luego entrevista: no aceptamos a todo el mundo.",
    },
    {
      q: "¿Es peligroso? ¿Cómo se garantiza la seguridad?",
      a: "Los participantes sienten que están solos, pero el dispositivo de seguridad es permanente e invisible: un referente local que conoce la zona, un contacto médico identificado con protocolo de evacuación escrito, un campamento base donde dormir y un debrief diario obligatorio. La zona, alrededor de Sámara y Parrita en la costa Pacífica, es una región turística acostumbrada a los viajeros. La sensación de riesgo es parte de la experiencia; el riesgo real está gestionado.",
    },
    {
      q: "¿Por qué quitarles el teléfono?",
      a: "Porque el teléfono es la salida de emergencia que impide la transformación. Sin él, hay que preguntar el camino, negociar cara a cara, aburrirse, observar, atreverse. Los teléfonos se guardan de forma segura durante la estadía y una línea de emergencia permanece abierta las 24 horas: las familias pueden contactar al equipo en cualquier momento.",
    },
    {
      q: "¿Costa Rica es un país seguro para jóvenes viajeros?",
      a: "Costa Rica es uno de los países más estables de América Latina: sin ejército desde 1948, con una larga tradición democrática y una industria turística que recibe millones de visitantes al año. El campamento opera en pequeños pueblos de la costa Pacífica que viven del turismo, donde el propio fundador vivió seis meses. Como en todas partes, el marco importa: los participantes permanecen en una zona conocida, con un referente local y controles diarios.",
    },
    {
      q: "¿Se necesita visa para Costa Rica?",
      a: "Para pasaportes de EE. UU., Canadá, Reino Unido y la Unión Europea no se requiere visa para una estadía de esta duración: basta un pasaporte vigente y un boleto de salida. Confirmamos los requisitos de entrada según la nacionalidad de cada participante durante la llamada de preparación, junto con las vacunas recomendadas y los detalles del seguro.",
    },
    {
      q: "¿Qué pasa con la salud y la atención médica en el lugar?",
      a: "Costa Rica tiene uno de los mejores sistemas de salud de América Latina, con clínicas privadas en las zonas turísticas. El campamento cuenta con un contacto médico identificado, un protocolo de evacuación escrito y un botiquín en el campamento base, y el programa incluye cobertura de seguro. Cualquier condición médica se conversa de forma confidencial antes de la salida.",
    },
    {
      q: "Mi hijo no habla español. ¿Es un problema?",
      a: "No: es una de las palancas del despertar. El fundador llegó a Costa Rica sin hablar el idioma y a las pocas semanas ya trabajaba en hoteles. Hacerse entender sin vocabulario obliga a atreverse, y el inglés basta para empezar en las zonas turísticas.",
    },
    {
      q: "¿Cuánto cuesta el campamento?",
      a: "La tarifa se comunica durante la entrevista de candidatura. Es un programa premium: 8 participantes como máximo, un equipo dedicado en el terreno y una logística de nivel expedición. Si su primera pregunta es el precio y no la transformación, este campamento probablemente no es para usted.",
    },
    {
      q: "¿En qué se diferencia de un programa tipo Outward Bound o un año sabático?",
      a: "Los programas de naturaleza forjan el carácter a través del entorno; los años sabáticos amplían la perspectiva a través del viaje. Camp Parrita construye una sola cosa: la prueba vivida de que se puede crear valor económico desde cero. El desafío no es sobrevivir al aire libre ni descubrir una cultura; es abordar desconocidos, negociar, recibir rechazos, ajustar y volver a casa habiendo ganado dinero real con las propias manos. Es un músculo distinto, y es el que usan los emprendedores.",
    },
    {
      q: "¿Qué se lleva mi hijo al volver?",
      a: "La prueba vivida de que puede crear valor desde cero. En concreto: atreverse a abordar desconocidos, negociar, encajar rechazos, detectar una carencia y llenarla, sostener un objetivo sin estímulos digitales. Es exactamente el mecanismo que permitió al fundador, de regreso en Francia, convertir una misión temporal en Lime en dos años lanzando un programa, y luego crear su propia empresa.",
    },
    {
      q: "¿Quién supervisa el campamento?",
      a: "Paul Larmaraud, fundador de Parrit, que vivió esta misma experiencia en esta misma costa: trabajos de hospitalidad, clases de surf, fiestas en la selva, un negocio de jugos, todo en menos de seis meses y con menos de 3 000 euros. Está presente durante toda la estadía como coach en la sombra: observa, hace el debrief cada noche y nunca hace el trabajo por los participantes.",
    },
    {
      q: "¿Cómo me mantienen informado durante la estadía, como padre?",
      a: "Recibe un reporte del equipo a la llegada, a mitad de camino y al regreso. Entre esos tres hitos, no hay noticias diarias: es una condición de la metamorfosis. La línea de emergencia, en cambio, funciona 24/7 en ambos sentidos: si pasa cualquier cosa, lo llamamos de inmediato, y usted puede contactar al equipo en todo momento.",
    },
    {
      q: "¿Y si mi hijo se quiebra y quiere abandonar?",
      a: "Pasa, generalmente el día 3 o 4, y suele ser el momento más importante de la estadía. Para eso está el responsable: el debrief de la noche convierte las ganas de abandonar en material de trabajo. Si un participante realmente quiere parar, nadie lo retiene a la fuerza: organizamos su regreso, junto con los padres. En la práctica, superar la mitad lo cambia todo.",
    },
    {
      q: "¿Cuál es la proporción de adultos por participante?",
      a: "8 participantes como máximo, con dos adultos dedicados presentes todo el tiempo (el fundador y el referente local) más un contacto médico identificado: un adulto por cada cuatro jóvenes. Y honestidad total sobre el resto: durante el día, los participantes actúan solos dentro de una zona conocida y delimitada. Ese es el corazón del programa. El debrief de la noche es obligatorio, el referente local siempre sabe dónde están y la línea de emergencia nunca cierra.",
    },
    {
      q: "¿Qué seguro cubre la estadía?",
      a: "El programa cuenta con un seguro de responsabilidad civil profesional. Además, cada participante debe tener un seguro de viaje que incluya gastos médicos y evacuación sanitaria: lo verificamos juntos durante la llamada de preparación, antes de la salida. Nadie sube al avión sin esa cobertura activa.",
    },
    {
      q: "¿Qué dicen las autoridades sobre Costa Rica?",
      a: "El aviso del Departamento de Estado de EE. UU. clasifica a Costa Rica en nivel 2 (« precaución aumentada »): el mismo nivel que Francia, Italia o el Reino Unido. El país no tiene ejército desde 1948 y vive en gran parte del turismo. El 911 funciona, pero no se garantiza un operador en inglés: exactamente por eso el campamento tiene su propio protocolo médico escrito y un equipo que habla el idioma.",
    },
    {
      q: "¿Cómo inscribo a mi hijo o postulo?",
      a: "A través del formulario de candidatura al final de esta página. Respondemos en 48 horas para organizar una entrevista de 20 minutos con el participante (padres bienvenidos). La entrevista evalúa la motivación, no el currículum: buscamos jóvenes dispuestos a jugar el juego a fondo.",
    },
  ],
  apply: {
    kicker: "Candidatura",
    h2: "8 plazas por cohorte. La entrevista decide.",
    sub: "Deje sus datos: volvemos en 48 horas para una entrevista de 20 minutos. Padres bienvenidos.",
    fieldName: "Nombre y apellido",
    fieldEmail: "Email",
    fieldPhone: "Teléfono (opcional)",
    whoParent: "Soy padre o madre",
    whoParticipant: "Soy el futuro participante",
    fieldWhy: "¿Por qué este campamento, por qué ahora? (3 líneas bastan)",
    submit: "Postular a la próxima cohorte",
    submitting: "Enviando...",
    error: "Algo falló. Intente de nuevo, o escriba a paul.larmaraud@parrit.ai",
    fine: "Respuesta en 48 horas. Ningún dato revendido, nada de spam.",
    ok: "✓ Candidatura recibida. Volvemos en 48 horas para agendar la entrevista.",
  },
  footer: "Camp Parrita · una experiencia Parrit · parrit.ai",
};

export const DICT: Record<CampLang, CampCopy> = { fr: FR, en: EN, es: ES };
export const CAMP_LANGS: CampLang[] = ["fr", "en", "es"];
