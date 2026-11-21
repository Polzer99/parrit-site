import { localizedPath, type Locale } from "@/system/locale";
import { JOURNAL_THEMES } from "@/system/journal-themes";
import { LanguageLink } from "./LanguageLink";

const themes = ["conseil-transformation", "ai-sprints", "integration-developpement", "harness-engineering"] as const;

export function RevFooter({ locale }: { locale: Locale }) {
  return <footer className="single-footer"><div className="wrap">
    <span>© 2026 Parrit.ai</span>
    <div className="footer-groups">
      <div className="footer-group">
        <p>{locale === "fr" ? "Ce que nous faisons" : "What we do"}</p>
        <div className="footer-links">{themes.map(slug => <a key={slug} href={localizedPath(`/journal/themes/${slug}`, locale)}>{JOURNAL_THEMES[slug].label[locale]}</a>)}</div>
      </div>
      <div className="footer-group">
        <p>Parrit.ai</p>
        <div className="footer-links">
          <a href={localizedPath("/journal", locale)}>Journal</a>
          <a href={localizedPath("/legal", locale)}>{locale === "fr" ? "Mentions légales" : "Legal notice"}</a>
          <LanguageLink locale={locale === "fr" ? "en" : "fr"}>{locale === "fr" ? "English" : "Français"}</LanguageLink>
        </div>
      </div>
    </div>
  </div></footer>;
}
