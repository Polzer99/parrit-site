/**
 * LIBELLÉS DE LA VERTICALE ÉDITORIALE PILOTE.
 *
 * Les templates ne portent aucun texte : ils reçoivent leurs libellés. Ce
 * fichier les rassemble pour les quatre langues du site, en un seul endroit.
 *
 * Ce n'est PAS du copywriting de positionnement — c'est de la chrome : noms de
 * sections, libellés de navigation, états vides. Le copywriting de
 * positionnement attend le document de Paul et n'est pas touché ici.
 *
 * Les états vides disent la vérité et rien d'autre : ce qui n'existe pas
 * encore, pourquoi, et où aller à la place. Aucune promesse de date.
 */

type Bloc = {
  nav: string;
  titreIndex: string;
  description: string;
  videTitre: string;
  videExplication: string;
  videSortie: string;
};

export type LibellesPilote = {
  blog: string;
  /**
   * Les actions d'une carte d'index. UNE seule par carte, et elle mène à la
   * valeur finale — arbitrage Paul du 02/08/2026. Pas de « voir la fiche ».
   */
  index: {
    lireArticle: string;
    lireSujet: string;
    accederRessource: string;
    faireDiagnostic: string;
    sujets: string;
    articles: string;
    ressources: string;
  };
  ressources: { nav: string; titreIndex: string; description: string; obtenez: string; autres: string };
  videos: Bloc;
  presse: Bloc & { mention: string; source: string };
  article: {
    tldr: string;
    sommaire: string;
    faq: string;
    sources: string;
    lireEnsuite: string;
    voirProfil: string;
  };
};

const fr: LibellesPilote = {
  blog: "Blog",
  index: {
    lireArticle: "Lire l'article",
    lireSujet: "Lire le sujet",
    accederRessource: "Accéder à la ressource",
    faireDiagnostic: "Faire le diagnostic",
    sujets: "Les grands sujets",
    articles: "Les articles",
    ressources: "Les ressources",
  },
  ressources: {
    nav: "Ressources",
    titreIndex: "Ce qu'on met à votre disposition",
    description: "Les guides, matrices et diagnostics qu'on utilise nous-mêmes.",
    obtenez: "Contenu",
    autres: "Autres ressources",
  },
  videos: {
    nav: "Vidéos",
    titreIndex: "Les systèmes, filmés",
    description: "Des démonstrations de systèmes réels, avec leur transcript.",
    videTitre: "Aucune vidéo n'est publiée pour l'instant.",
    videExplication:
      "On n'en a pas encore tourné. Quand ce sera le cas, chaque vidéo arrivera avec son transcript, pour être lisible sans être regardée.",
    videSortie: "Lire les articles",
  },
  presse: {
    nav: "Presse",
    titreIndex: "Mentions et interventions",
    description: "Les parutions et les prises de parole publiques, avec leur source.",
    videTitre: "Aucune parution n'est enregistrée pour l'instant.",
    videExplication:
      "On ne référence une parution que si elle est réelle et vérifiable : le média, la date et le lien vers la source.",
    videSortie: "Voir le blog",
    mention: "Mention",
    source: "Lire la source",
  },
  article: {
    tldr: "En bref",
    sommaire: "Sommaire",
    faq: "Questions fréquentes",
    sources: "Sources",
    lireEnsuite: "À lire ensuite",
    voirProfil: "Voir le profil",
  },
};

const en: LibellesPilote = {
  blog: "Blog",
  index: {
    lireArticle: "Read the article",
    lireSujet: "Read the topic",
    accederRessource: "Open the resource",
    faireDiagnostic: "Take the diagnostic",
    sujets: "Key topics",
    articles: "Articles",
    ressources: "Resources",
  },
  ressources: {
    nav: "Resources",
    titreIndex: "What we make available to you",
    description: "The guides, matrices and diagnostics we use ourselves.",
    obtenez: "Contents",
    autres: "Other resources",
  },
  videos: {
    nav: "Videos",
    titreIndex: "The systems, on film",
    description: "Demonstrations of real systems, with their transcript.",
    videTitre: "No video is published yet.",
    videExplication:
      "We have not filmed any yet. When we do, each one will ship with its transcript, so it can be read without being watched.",
    videSortie: "Read the articles",
  },
  presse: {
    nav: "Press",
    titreIndex: "Mentions and appearances",
    description: "Publications and public appearances, with their source.",
    videTitre: "No publication is on record yet.",
    videExplication:
      "We only list a publication when it is real and verifiable: the outlet, the date, and the link to the source.",
    videSortie: "See the blog",
    mention: "Mention",
    source: "Read the source",
  },
  article: {
    tldr: "In short",
    sommaire: "Contents",
    faq: "FAQ",
    sources: "Sources",
    lireEnsuite: "Read next",
    voirProfil: "View profile",
  },
};

const ptBR: LibellesPilote = {
  blog: "Blog",
  index: {
    lireArticle: "Ler o artigo",
    lireSujet: "Ler o tema",
    accederRessource: "Acessar o recurso",
    faireDiagnostic: "Fazer o diagnóstico",
    sujets: "Grandes temáticas",
    articles: "Artigos",
    ressources: "Recursos",
  },
  ressources: {
    nav: "Recursos",
    titreIndex: "O que colocamos à sua disposição",
    description: "Os guias, matrizes e diagnósticos que nós mesmos usamos.",
    obtenez: "Conteúdo",
    autres: "Outros recursos",
  },
  videos: {
    nav: "Vídeos",
    titreIndex: "Os sistemas, filmados",
    description: "Demonstrações de sistemas reais, com transcrição.",
    videTitre: "Nenhum vídeo publicado por enquanto.",
    videExplication:
      "Ainda não gravamos nenhum. Quando gravarmos, cada vídeo virá com sua transcrição, para poder ser lido sem ser assistido.",
    videSortie: "Ler os artigos",
  },
  presse: {
    nav: "Imprensa",
    titreIndex: "Menções e intervenções",
    description: "Publicações e falas públicas, com a fonte.",
    videTitre: "Nenhuma publicação registrada por enquanto.",
    videExplication:
      "Só listamos uma publicação se ela for real e verificável: o veículo, a data e o link para a fonte.",
    videSortie: "Ver o blog",
    mention: "Menção",
    source: "Ler a fonte",
  },
  article: {
    tldr: "Em resumo",
    sommaire: "Sumário",
    faq: "Perguntas frequentes",
    sources: "Fontes",
    lireEnsuite: "Para ler depois",
    voirProfil: "Ver perfil",
  },
};

const zhCN: LibellesPilote = {
  blog: "博客",
  index: {
    lireArticle: "阅读文章",
    lireSujet: "阅读主题",
    accederRessource: "获取资源",
    faireDiagnostic: "开始诊断",
    sujets: "核心主题",
    articles: "文章",
    ressources: "资源",
  },
  ressources: {
    nav: "资源",
    titreIndex: "我们提供给你的内容",
    description: "我们自己在用的指南、矩阵与诊断工具。",
    obtenez: "内容",
    autres: "其他资源",
  },
  videos: {
    nav: "视频",
    titreIndex: "系统实录",
    description: "真实系统的演示，附带文字稿。",
    videTitre: "目前尚未发布任何视频。",
    videExplication: "我们还没有拍摄。发布时，每个视频都会附带文字稿，无需观看即可阅读。",
    videSortie: "阅读文章",
  },
  presse: {
    nav: "媒体",
    titreIndex: "报道与公开发言",
    description: "已发表的报道与公开发言，均附来源。",
    videTitre: "目前尚无已记录的报道。",
    videExplication: "只有真实且可核实的报道才会列出：媒体名称、日期与来源链接。",
    videSortie: "查看博客",
    mention: "报道",
    source: "阅读原文",
  },
  article: {
    tldr: "摘要",
    sommaire: "目录",
    faq: "常见问题",
    sources: "参考资料",
    lireEnsuite: "继续阅读",
    voirProfil: "查看简介",
  },
};

export const LIBELLES: Record<string, LibellesPilote> = {
  fr,
  en,
  "pt-BR": ptBR,
  "zh-CN": zhCN,
};
