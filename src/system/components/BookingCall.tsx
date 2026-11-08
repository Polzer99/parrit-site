import Link from "next/link";
import { avecSource } from "@/lib/registry/cta";
import { BOOKING_COPY } from "@/system/booking";
import { localizedPath, type Locale } from "@/system/locale";
import "@/system/booking.css";

export function BookingCall({ locale, source }: { locale: Locale; source: string }) {
  const copy = BOOKING_COPY[locale];
  return <section className="booking-call" lang={locale} aria-labelledby="booking-call-title">
    <h2 id="booking-call-title">{copy.invitation}</h2>
    <p>{copy.description}</p>
    <Link className="rev-button exec" href={avecSource(localizedPath("/rendez-vous", locale), source)}>{copy.action}</Link>
    <a className="booking-email" href="mailto:paul.larmaraud@parrit.ai">{copy.email}</a>
  </section>;
}
