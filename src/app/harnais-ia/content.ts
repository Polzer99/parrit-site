export type Lang = "fr" | "en";

export interface LeadMagnetCopy {
  kicker: string;
  h1a: string;
  h1num: string;
  h1b: string;
  sub: string;
  chips: { label: string; logo?: string }[];
  proof: { sec: string; res: string; pain: string }[];
  gateKicker: string;
  gateTitle: string;
  gateLead: string;
  principleTitle: string;
  principleBody: string;
  ruleTitle: string;
  ruleBody: string;
  matrixTitle: string;
  matrixHead: [string, string, string, string];
  matrixRows: [string, string, string, string][];
  steps: { t: string; d: string }[];
  captureTitle: string;
  captureSub: string;
  fieldName: string;
  fieldEmail: string;
  submit: string;
  fine: string;
  ok: string;
  navCta: string;
  footer: string;
}

export const COPY: Record<Lang, LeadMagnetCopy> = {
  fr: {
    kicker: "Étude de cas interne · Fractional AI Operator",
    h1a: "On a divisé nos coûts IA par ",
    h1num: "20",
    h1b: ". Voici le harnais exact, mesuré.",
    sub: "Pas une promesse marketing. Sur trois semaines de notre propre activité (Codex + Claude Code), on a mesuré chaque token, routé chaque tâche vers le modèle open-weight le moins cher qui fait le travail, et gardé le frontier pour les 10 % critiques. Méthode reproductible, chiffres à l'appui.",
    chips: [
      { label: "Claude Code", logo: "/brand/tool-logos/claude.svg" },
      { label: "Codex", logo: "/brand/tool-logos/openai.svg" },
      { label: "DeepSeek V4" },
      { label: "GLM-5.2" },
      { label: "Gemma local" },
    ],
    proof: [
      { sec: "Volume mesuré", res: "1,13 Md", pain: "tokens consommés en 17 jours, sur la seule surface Codex." },
      { sec: "Coût équivalent-API", res: "−95 %", pain: "même travail, routé vers l'open-weight au lieu du frontier." },
      { sec: "Limites de plan", res: "0 blocage", pain: "plus jamais coupé en pleine session par un quota épuisé." },
    ],
    gateKicker: "Le harnais complet",
    gateTitle: "Playbook + matrice tâche → modèle + calculateur",
    gateLead: "Laissez votre email, on vous l'envoie. Lecture 8 minutes, applicable aujourd'hui.",
    principleTitle: "Le principe : pourquoi 95 % et pas 20 %",
    principleBody: "Un modèle frontier (gpt-5.5 : $5/$30 par 1M ; Opus : $5/$25) coûte 30 à 50× plus cher qu'un open-weight capable (DeepSeek V4 Flash : $0.09/$0.18). Or ~90 % du volume réel ne mérite pas un frontier. L'écart de prix structurel fait l'économie.",
    ruleTitle: "La règle d'or",
    ruleBody: "On ne choisit jamais un modèle par habitude. On classe la tâche, la classe impose le modèle, et ce routage devient le défaut, jamais un effort de mémoire. C'est ce qui fait tenir le −95 % dans le temps.",
    matrixTitle: "La matrice tâche → modèle",
    matrixHead: ["Classe", "Tâche", "Modèle", "Coût /1M"],
    matrixRows: [
      ["déterministe", "regex, filtre, dédup", "aucun LLM", "$0"],
      ["local", "classif offline, prefilter", "gemma3:12b", "$0"],
      ["cheap", "extraction, scoring, routing", "deepseek-v4-flash", "$0.09"],
      ["draft", "email, post, copy", "deepseek-v4-pro", "$0.44"],
      ["strong", "coding, synthèse, PRD", "glm-5.2", "$0.95"],
      ["frontier", "sécu, incident, archi", "Sonnet / GPT-5.5", "$3-5"],
    ],
    steps: [
      { t: "Étape 1 : Mesurer", d: "Lire les 3 surfaces. On découvre que 1-2 concentrent 90 % du coût." },
      { t: "Étape 2 : Router", d: "Le volume non-critique descend vers l'open-weight, par défaut." },
      { t: "Étape 3 : Réserver", d: "Le frontier reste pour sécu, incident, archi seulement." },
    ],
    captureTitle: "Recevez le harnais complet",
    captureSub: "Le playbook (méthode + chiffres), la matrice tâche → modèle, et le calculateur qu'on utilise nous-mêmes. Paul vous écrit ensuite pour voir comment l'adapter à votre stack.",
    fieldName: "Prénom",
    fieldEmail: "Email professionnel",
    submit: "Recevoir le harnais + être recontacté →",
    fine: "Un seul email pour le harnais, puis un mot de Paul. Pas de spam, désinscription en 1 clic.",
    ok: "✓ Merci, le harnais arrive dans votre boîte. Paul vous écrit dans la foulée pour en parler.",
    navCta: "Recevoir le harnais",
    footer: "Au-delà de ChatGPT · en production en 14 jours · paul.larmaraud@parrit.ai",
  },
  en: {
    kicker: "Internal case study · Fractional AI Operator",
    h1a: "We cut our AI costs by ",
    h1num: "20×",
    h1b: ". Here's the exact harness, measured.",
    sub: "Not a marketing promise. Over three weeks of our own activity (Codex + Claude Code), we measured every token, routed each task to the cheapest open-weight model that does the job, and kept frontier models for the critical 10%. Reproducible method, numbers to back it.",
    chips: [
      { label: "Claude Code", logo: "/brand/tool-logos/claude.svg" },
      { label: "Codex", logo: "/brand/tool-logos/openai.svg" },
      { label: "DeepSeek V4" },
      { label: "GLM-5.2" },
      { label: "Local Gemma" },
    ],
    proof: [
      { sec: "Measured volume", res: "1.13 B", pain: "tokens used in 17 days, on the Codex surface alone." },
      { sec: "API-equivalent cost", res: "−95%", pain: "same work, routed to open-weight instead of frontier." },
      { sec: "Plan limits", res: "0 blocks", pain: "never cut off mid-session by an exhausted quota again." },
    ],
    gateKicker: "The full harness",
    gateTitle: "Playbook + task → model matrix + calculator",
    gateLead: "Leave your email, we'll send it over. 8-minute read, usable today.",
    principleTitle: "The principle: why 95% and not 20%",
    principleBody: "A frontier model (gpt-5.5: $5/$30 per 1M; Opus: $5/$25) costs 30 to 50× more than a capable open-weight one (DeepSeek V4 Flash: $0.09/$0.18). Yet ~90% of real volume doesn't need a frontier model. The structural price gap is where the savings come from.",
    ruleTitle: "The golden rule",
    ruleBody: "You never pick a model out of habit. You classify the task, the class dictates the model, and that routing becomes the default, never a memory effort. That's what keeps the −95% holding over time.",
    matrixTitle: "The task → model matrix",
    matrixHead: ["Class", "Task", "Model", "Cost /1M"],
    matrixRows: [
      ["deterministic", "regex, filter, dedup", "no LLM", "$0"],
      ["local", "offline classify, prefilter", "gemma3:12b", "$0"],
      ["cheap", "extraction, scoring, routing", "deepseek-v4-flash", "$0.09"],
      ["draft", "email, post, copy", "deepseek-v4-pro", "$0.44"],
      ["strong", "coding, synthesis, PRD", "glm-5.2", "$0.95"],
      ["frontier", "security, incident, architecture", "Sonnet / GPT-5.5", "$3-5"],
    ],
    steps: [
      { t: "Step 1: Measure", d: "Read the 3 surfaces. You find 1-2 concentrate 90% of the cost." },
      { t: "Step 2: Route", d: "Non-critical volume drops to open-weight, by default." },
      { t: "Step 3: Reserve", d: "Frontier stays for security, incident, architecture only." },
    ],
    captureTitle: "Get the full harness",
    captureSub: "The playbook (method + numbers), the task → model matrix, and the cost calculator we use ourselves. Paul then writes to you to see how to adapt it to your stack.",
    fieldName: "First name",
    fieldEmail: "Work email",
    submit: "Get the harness + a follow-up →",
    fine: "One email for the harness, then a note from Paul. No spam, one-click unsubscribe.",
    ok: "✓ Thanks, the harness is on its way to your inbox. Paul will write to you shortly to talk it through.",
    navCta: "Get the harness",
    footer: "Beyond ChatGPT · in production in 14 days · paul.larmaraud@parrit.ai",
  },
};
