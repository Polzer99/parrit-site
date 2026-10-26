import { localizedPath, type Locale } from "@/system/locale";
import { LanguageLink } from "./LanguageLink";
export function RevFooter({ locale }: { locale: Locale }) {
  return <footer className="single-footer"><div className="wrap"><span>© 2026 Parrit.ai</span><div className="footer-links"><a href={localizedPath("/journal", locale)}>Journal</a><a href={localizedPath("/legal", locale)}>{locale === "fr" ? "Mentions légales" : "Legal notice"}</a><LanguageLink locale={locale === "fr" ? "en" : "fr"}>{locale === "fr" ? "English" : "Français"}</LanguageLink></div></div></footer>;
}
