import { localizedPath, type Locale } from "@/system/locale";
import { LanguageLink } from "./LanguageLink";
export function RevFooter({ locale }: { locale: Locale }) {
  const themes = [
    ["harness-engineering", "Encadrer vos assistants IA", "Rules and checks for AI assistants"],
    ["ai-sprints", "Un premier résultat", "A first result"],
    ["integration-developpement", "Relier vos logiciels", "Connect your software"],
    ["conseil-transformation", "Choisir vos priorités", "Choose your priorities"],
  ];
  return <footer className="single-footer"><div className="wrap"><span>© 2026 Parrit.ai</span><div className="footer-links">
    {themes.map(([slug, fr, en]) => <a key={slug} href={localizedPath(`/journal/themes/${slug}`, locale)}>{locale === "fr" ? fr : en}</a>)}
    <a href={localizedPath("/journal", locale)}>Journal</a><a href={localizedPath("/legal", locale)}>{locale === "fr" ? "Mentions légales" : "Legal notice"}</a><LanguageLink locale={locale === "fr" ? "en" : "fr"}>{locale === "fr" ? "English" : "Français"}</LanguageLink></div></div></footer>;
}
