import { expect, test } from "@playwright/test";

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";
const FICTIONAL_AGENT_NAMES = /\b(?:Mateo|Ava|Priya|Kenji|Amara|Noah|Yuki|Omar)\b/i;

const locales = [
  { locale: "fr", identity: "Des humains réels, qui ont déjà déployé pour de vrai.", behind: "Qui est derrière", network: "une vingtaine d'experts, moitié métier, moitié technique", goal: "plus besoin de nous, c'est gagné", cases: ["Acquisition signal-first", "Capture multicanal", "Facturation & suivi", "Formation agentique"], diagnostic: "Réserver un diagnostic de faisabilité", talk: "Parler à Paul" },
  { locale: "en", identity: "Real people who have already deployed for real.", behind: "Who is behind Parrit", network: "a network of about twenty expert partners", goal: "making you autonomous", cases: ["Signal-first acquisition", "Multichannel capture", "Billing & tracking", "Agentic training"], diagnostic: "Book a feasibility check", talk: "Talk to Paul" },
  { locale: "pt-BR", identity: "Pessoas reais, que já fizeram implantações de verdade.", behind: "Quem está por trás", network: "uma rede de cerca de vinte parceiros especialistas", goal: "tornar vocês autônomos", cases: ["Aquisição signal-first", "Captura multicanal", "Faturamento & acompanhamento", "Formação agêntica"], diagnostic: "Reservar um diagnóstico de viabilidade", talk: "Falar com Paul" },
  { locale: "zh-CN", identity: "真实的人，真正做过生产部署。", behind: "谁在背后", network: "约二十位专家伙伴组成的网络", goal: "让你们能够自主推进", cases: ["信号优先获客", "多渠道汇集", "开票与跟踪", "智能体培训"], diagnostic: "预约可行性诊断", talk: "与 Paul 交流" },
] as const;

for (const { locale, identity, behind, network, goal, cases, diagnostic, talk } of locales) {
  test(`${locale} home foregrounds real people without fictional agent faces`, async ({ page }) => {
    await page.goto(new URL(`/${locale}`, BASE_URL).toString());

    await expect(page.locator(".hd-lede")).toContainText(identity);
    await expect(page.locator(".hd-team h2")).toContainText(behind);
    await expect(page.locator('.hd-team img[src="/team/paul-reel.jpg"]')).toHaveCount(1);
    await expect(page.locator('.hd-team img[src="/team/paul-portrait.jpg"]')).toHaveCount(0);
    await expect(page.locator('.hd-team img[src="/team/yukun-portrait.jpg"]')).toHaveCount(0);
    await expect(page.locator(".hd-team")).not.toContainText("Yukun");
    await expect(page.locator(".hd-team-network")).toContainText(network);
    await expect(page.locator(".hd-team-goal")).toContainText(goal);
    await expect(page.locator('.hd-team a[href="/fondateurs"]')).toHaveCount(1);
    await expect(page.locator('img[src*="/brand/agents/"]')).toHaveCount(0);
    await expect(page.locator(".hd-agent-mark")).toHaveCount(0);
    await expect(page.locator(".hd-agent-name")).toHaveCount(4);
    await expect(page.locator(".hd-case-title")).toHaveText([...cases]);
    await expect(page.locator(".hd-agent-name")).not.toContainText(FICTIONAL_AGENT_NAMES);
    await expect(page.locator("main")).not.toContainText(FICTIONAL_AGENT_NAMES);
    await expect(page.locator(".hd-transfos")).toHaveCount(0);
    await expect(page.locator(".hd-launches")).toHaveCount(0);
    await expect(page.locator('[data-ph-placement="use_cases"]')).toHaveCount(0);
    await expect(page.locator('[data-ph-placement="launches"]')).toHaveCount(0);
    await expect(page.locator('[data-ph-placement="home-diagnostic"]')).toHaveCount(2);
    await expect(page.locator('[data-ph-placement="home-diagnostic"]').first()).toHaveText(diagnostic);
    await expect(page.locator('[data-ph-placement="home-diagnostic"]').first()).toHaveAttribute("href", "/diagnostic?source=home-diagnostic");
    await expect(page.locator('[data-ph-placement="home-parler-paul"]')).toHaveText(talk);
    await expect(page.locator('[data-ph-placement="home-parler-paul"]')).toHaveAttribute("href", `/${locale}/rendez-vous?source=home-parler-paul`);

    const sectionOrder = await page.locator(".hd-hero, .hd-terrain, .hd-team, #catalogue-agents").evaluateAll(
      (elements) => elements.map((element) => element.className || element.id),
    );
    expect(sectionOrder).toEqual(["hd-hero", "hd-terrain", "hd-team", "hd-catalog"]);
  });
}
