export const WA_LINK = "https://wa.me/33759665687?text=Bonjour%20Paul%20!";

export const projects = [
  {
    name: "Contestation SNCF",
    badge: "Micro-SaaS",
    badgeColor: "bg-purple-500/20 text-purple-400",
    description:
      "Outil IA qui g\u00e9n\u00e8re et envoie automatiquement des lettres de contestation d\u2019amendes SNCF en recommand\u00e9 AR. Photo du PV \u2192 IA extrait les donn\u00e9es \u2192 paiement \u2192 recommand\u00e9 envoy\u00e9.",
    link: "https://contester-amende-sncf.vercel.app",
    status: "En production",
  },
  {
    name: "CRM Laparra",
    badge: "CRM sur mesure",
    badgeColor: "bg-green-500/20 text-green-400",
    description:
      "CRM fruits & l\u00e9gumes pour un grossiste de Rungis. Dashboard analytics, pipeline Kanban, saisonnalit\u00e9, import ERP. Con\u00e7u pour 20 commerciaux terrain.",
    link: "https://laparra-crm.vercel.app",
    status: "En production",
  },
  {
    name: "MAGEC Connect",
    badge: "Plateforme collaborative",
    badgeColor: "bg-blue-500/20 text-blue-400",
    description:
      "Plateforme pour un groupement d\u2019achat de 100+ membres. Comparateur de prix fournisseurs, import de factures par IA, assistant int\u00e9gr\u00e9.",
    link: "https://groupachat-proto.vercel.app",
    status: "Prototype",
  },
  {
    name: "Prospection automatis\u00e9e",
    badge: "Agents IA",
    badgeColor: "bg-indigo-500/20 text-indigo-400",
    description:
      "Syst\u00e8me de d\u00e9tection de signaux d\u2019achat LinkedIn + s\u00e9quences cold email personnalis\u00e9es. Pipeline PhantomBuster \u2192 scoring IA \u2192 Instantly.",
    status: "En production (confidentiel)",
  },
  {
    name: "Agent Comptabilit\u00e9",
    badge: "Automatisation",
    badgeColor: "bg-amber-500/20 text-amber-400",
    description:
      "Agent IA qui scanne les emails, d\u00e9tecte les factures, et les attache automatiquement aux transactions Qonto. Z\u00e9ro saisie manuelle.",
    status: "En production",
  },
  {
    name: "PaY \u2014 Chatbot SAP",
    badge: "RAG & IA",
    badgeColor: "bg-rose-500/20 text-rose-400",
    description:
      "Chatbot IA pour accompagner les utilisateurs SAP. RAG sur documentation, analyse de screenshots, r\u00e9ponses contextuelles.",
    status: "En production",
  },
] as const;

export const steps = [
  {
    num: "01",
    title: "On discute",
    desc: "Appelez-nous ou envoyez un message WhatsApp. On comprend votre besoin en 15 minutes.",
  },
  {
    num: "02",
    title: "On construit",
    desc: "Prototype fonctionnel en 48h. Vous testez, vous donnez vos retours, on it\u00e8re.",
  },
  {
    num: "03",
    title: "On d\u00e9ploie",
    desc: "Mise en production, maintenance, et am\u00e9lioration continue. Vous n\u2019y touchez pas.",
  },
] as const;

export const team = [
  {
    name: "Paul Larmaraud",
    role: "Go-to-Market, Product & Op\u00e9rations",
    linkedin: "https://www.linkedin.com/in/paul-larmaraud/",
  },
  {
    name: "Yukun Leng",
    role: "Tech Lead, SAP & Supply Chain",
    linkedin: "https://www.linkedin.com/in/yukun-leng/",
  },
] as const;

export const pillars = [
  {
    title: "Prototypage IA",
    desc: "De l\u2019id\u00e9e au prototype fonctionnel en 48h. Next.js, n8n, agents IA.",
    icon: "zap" as const,
  },
  {
    title: "Automatisation",
    desc: "On automatise vos processus : prospection, admin, CRM, facturation.",
    icon: "bot" as const,
  },
  {
    title: "D\u00e9ploiement & Op\u00e9rations",
    desc: "On met en production et on maintient. Vous n\u2019y pensez plus.",
    icon: "rocket" as const,
  },
] as const;
