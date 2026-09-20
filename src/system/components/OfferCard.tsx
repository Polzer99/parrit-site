import Link from "next/link";
import type { Locale } from "../locale";

export type OfferPrice = {
  amountHt: number;
  currency: string;
  basis: string;
};

export type OfferCardProps = {
  name: string;
  audience: string;
  outcome: string;
  deliverables?: readonly string[];
  format?: string;
  price?: OfferPrice;
  priceNote?: string;
  exclusions?: readonly string[];
  cta: { label: string; href: string };
  locale?: Locale;
};

export function formatOfferPrice(price: OfferPrice, locale: Locale): string {
  const amount = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency", currency: price.currency, minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(price.amountHt);
  return `${amount} ${locale === "fr" ? "HT" : "excl. VAT"} · ${price.basis}`;
}

export function OfferCard({
  name, audience, outcome, deliverables, format, price, priceNote, exclusions, cta, locale = "en",
}: OfferCardProps) {
  // Reject ambiguous inputs instead of silently discarding an explicit commercial fact.
  if (price !== undefined && priceNote !== undefined) {
    throw new Error("OfferCard accepts either price or priceNote, never both.");
  }
  return (
    <article className="offer-card">
      <h3>{name}</h3>
      <p>{audience}</p>
      <p className="offer-card-outcome">{outcome}</p>
      {!!deliverables?.length && <ul>{deliverables.map((item) => <li key={item}>{item}</li>)}</ul>}
      {format && <p>{format}</p>}
      {!!exclusions?.length && <div>
        <p>{locale === "fr" ? "Non inclus" : "Not included"}</p>
        <ul>{exclusions.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>}
      <footer className="offer-card-action">
        {(price || priceNote) && <p className="offer-price">{price ? formatOfferPrice(price, locale) : priceNote}</p>}
        <Link className="rev-button exec" href={cta.href}>{cta.label}</Link>
      </footer>
    </article>
  );
}
