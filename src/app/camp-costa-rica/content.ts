// Copy canonique du Camp Parrita (FR). Une seule langue en v1 : la cible
// est le parent francophone. Les FAQ sont exportées séparément pour être
// réutilisées dans le JSON-LD FAQPage (GEO) et dans llms-full.txt.

export interface Faq {
  q: string;
  a: string;
}

// Les réponses sont écrites pour être citées telles quelles par un moteur
// génératif : phrase d'attaque qui répond, puis le détail.
export const FAQS: Faq[] = [
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
    q: "Comment inscrire mon enfant ou postuler ?",
    a: "Via le formulaire de candidature en bas de cette page. Nous répondons sous 48 heures pour organiser un entretien de 20 minutes avec le participant (et les parents s'ils le souhaitent). L'entretien valide la motivation, pas le CV : nous cherchons des jeunes prêts à jouer le jeu à fond.",
  },
];

export const STORY_STEPS: { t: string; d: string }[] = [
  {
    t: "Parti avec moins de 3 000 €",
    d: "Arrivée sur la côte Pacifique du Costa Rica, sans plan, sans réseau, sans parler la langue.",
  },
  {
    t: "Des cours de surf sans savoir surfer",
    d: "Premier apprentissage : on ne vend pas ce qu'on sait faire, on vend ce que les gens cherchent. Et on apprend en marchant.",
  },
  {
    t: "Des soirées dans la jungle",
    d: "Jamais organisé une soirée de sa vie. Il a trouvé le lieu, les partenaires, le public. Complet.",
  },
  {
    t: "Hôtels, jus de fruits, hospitality",
    d: "Embauché dans des hôtels sans parler espagnol. Puis un business de jus de fruits, monté en repérant ce qui manquait sur place. Pieds nus, sans téléphone.",
  },
  {
    t: "Six mois plus tard, le déclic est acquis",
    d: "Retour en France. Une mission d'intérim chez Lime devient deux ans à lancer un programme. Puis la création de son entreprise, Parrit, nommée d'après la ville du déclic : Parrita.",
  },
];

export const PROGRAM: { phase: string; days: string; title: string; d: string }[] = [
  {
    phase: "Phase 1",
    days: "Jours 1 et 2",
    title: "La déconnexion",
    d: "Téléphone, montre connectée et carte bancaire déposés au coffre. Briefing sécurité, remise du kit minimaliste et d'un petit pécule. À partir de là, tout se gagne.",
  },
  {
    phase: "Phase 2",
    days: "Jours 3 à 8",
    title: "Le défi terrain",
    d: "Créer une activité qui rapporte, ou un partenariat rentable avec un commerce local. Négociation en direct, en face à face. Chaque soir, 30 minutes de débrief sur les blocages réels : la peur d'aborder, le refus, l'ennui.",
  },
  {
    phase: "Phase 3",
    days: "Jours 9 et 10",
    title: "Le retour",
    d: "Présentation des résultats devant le groupe. Restitution des téléphones. Atelier d'intégration : comment garder ce niveau d'audace une fois rentré, dans les études, un job ou un projet.",
  },
];
