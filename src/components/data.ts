export const WA_LINK = "https://wa.me/33759665687?text=Bonjour%20Paul%20!";

export const painPoints = [
  {
    title: "Saisie manuelle des documents",
    desc: "Factures, rapports, contrats saisis un a un a la main \u2014 erreurs et reprises inevitables",
  },
  {
    title: "Suivi de projet via messagerie",
    desc: "Un message manque peut bloquer tout un projet",
  },
  {
    title: "Consolidation de donnees par copier-coller",
    desc: "Agregation manuelle entre systemes \u2014 une demi-journee pour produire un seul rapport",
  },
  {
    title: "Validations repetitives epuisantes",
    desc: "Memes processus recommences a chaque fois, sans visibilite sur l\u2019avancement",
  },
] as const;

export const services = [
  {
    title: "CRM sur mesure + Assistant IA commercial",
    desc: "Gestion unifiee des clients et opportunites. Consultation directe via WhatsApp.",
    icon: "users" as const,
  },
  {
    title: "Assistant intelligent SAP",
    desc: "Operez SAP en langage naturel. Reduisez la dependance aux consultants.",
    icon: "terminal" as const,
  },
  {
    title: "Automatisation intelligente des documents",
    desc: "Reconnaissance et saisie automatiques des factures et contrats. 30 secondes \u2014 10x plus rapide.",
    icon: "file" as const,
  },
  {
    title: "Solution d\u2019automatisation des processus sur mesure",
    desc: "Validation et suivi 100% automatises. Alertes automatiques, zero oubli.",
    icon: "cog" as const,
  },
] as const;

export const caseStudies = [
  {
    badge: "CAS REEL \u00b7 CRM",
    name: "Agence Laparra \u2014 CRM",
    subtitle: "Grossiste en produits agricoles francais",
    details: "Fondee en 1946 \u00b7 10 commerciaux \u00b7 160+ clients \u00b7 CA 28,4M\u20ac",
    problem: "Informations eparpillees entre Outlook, WhatsApp et la memoire des commerciaux",
    solution: "CRM unifie, assistant IA WhatsApp, calendrier saisonnier avec alertes automatiques",
    link: "https://laparra-crm.vercel.app",
    status: "En production",
  },
  {
    badge: "CAS REEL \u00b7 MICRO-SAAS",
    name: "Contestation SNCF \u2014 Micro-SaaS",
    subtitle: "Outil IA de contestation d\u2019amendes SNCF",
    details: "Photo du PV \u2192 IA extrait les donnees \u2192 lettre generee \u2192 recommande AR envoye automatiquement",
    problem: "",
    solution: "14,90\u20ac par contestation \u00b7 Pipeline 100% automatise",
    link: "https://contester-amende-sncf.vercel.app",
    status: "En production",
  },
  {
    badge: "CAS REEL \u00b7 SAP",
    name: "Assistant SAP \u2014 PaY",
    subtitle: "SAP aussi simple qu\u2019envoyer un message",
    details: "Modules MM/SD/FI \u00b7 Chinois/Francais/Anglais",
    problem: "",
    solution: "90% des problemes quotidiens resolus en autonomie par les utilisateurs",
    link: "",
    status: "En production",
  },
  {
    badge: "CAS REEL \u00b7 AGENTS IA",
    name: "Automatisation prospection",
    subtitle: "Systeme de detection de signaux d\u2019achat",
    details: "Pipeline automatise : signaux LinkedIn \u2192 scoring IA \u2192 sequences personnalisees \u2192 RDV qualifies",
    problem: "",
    solution: "",
    link: "",
    status: "En production (confidentiel)",
  },
] as const;

export const teamMembers = [
  {
    name: "Yukun Leng",
    role: "Co-fondateur",
    desc: "Consultant SAP \u00b7 10 ans MM/SD/FI \u00b7 Ex-LVMH, Jabil \u00b7 Specialite : supply chain \u00b7 Responsable marche Chine",
    linkedin: "https://www.linkedin.com/in/yukun-leng/",
  },
  {
    name: "Paul Larmaraud",
    role: "Co-fondateur",
    desc: "Ingenieur IA \u00b7 3+ ans de deploiement IA \u00b7 Ex-Lime operations mondiales \u00b7 \u00ab From idea \u2192 agent \u2192 adoption. Fast. \u00bb",
    linkedin: "https://www.linkedin.com/in/paul-larmaraud/",
  },
] as const;
