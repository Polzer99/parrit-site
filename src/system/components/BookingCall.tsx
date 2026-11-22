import Link from "next/link";
import { avecSource } from "@/lib/registry/cta";
import { BOOKING_CALL_COPY, BOOKING_COPY, type BookingCallVariant } from "@/system/booking";
import { localizedPath, type Locale } from "@/system/locale";
import { BrandConnector } from "./BrandConnector";
import "@/system/booking.css";

export function BookingCall({ locale, source, variant = "article" }: { locale: Locale; source: string; variant?: BookingCallVariant }) {
  const common = BOOKING_COPY[locale];
  const copy = BOOKING_CALL_COPY[locale][variant];
  return <section className="booking-call" lang={locale} aria-labelledby="booking-call-title">
    <h2 id="booking-call-title">{copy.invitation}</h2>
    <p>{copy.description}</p>
    <Link className="rev-button exec" href={avecSource(localizedPath("/rendez-vous", locale), source)}>{common.action}<BrandConnector /></Link>
    <p className="booking-email">{copy.emailLead} <a href="mailto:paul.larmaraud@parrit.ai">{common.emailOpen}</a></p>
  </section>;
}
