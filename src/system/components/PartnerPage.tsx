import type { Locale } from "../locale";
import { PARTNER_DICT, PARTNER_FORM_URL } from "../partner-copy";
import "../partner-page.css";

export function PartnerPage({ locale }: { locale: Locale }) {
  const copy = PARTNER_DICT[locale];
  return <main className="single-page partner-page" data-brand-mode="accessible">
    <div className="wrap">
      <h1>{copy.heading}{" "}<b>{copy.emphasis}</b></h1>
      <p className="partner-introduction">{copy.introduction}</p>
      <div className="partner-blocks">
        {copy.blocks.map(block => <div key={block.heading}>
          <h2>{block.heading}</h2>
          <p>{block.text}</p>
        </div>)}
      </div>
      <div className="partner-next">
        <div className="partner-action">
          <a className="btn rev-button exec" href={PARTNER_FORM_URL} target="_blank" rel="noopener noreferrer">{copy.action}</a>
          {copy.formLanguage && <p>{copy.formLanguage}</p>}
        </div>
        <p className="partner-privacy muted">{copy.privacy}{" "}<a href="mailto:paul.larmaraud@parrit.ai">{copy.contact}</a>.</p>
      </div>
    </div>
  </main>;
}
