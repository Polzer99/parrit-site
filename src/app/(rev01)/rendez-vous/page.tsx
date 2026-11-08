import type { Metadata } from "next";
import { getLocale } from "@/lib/server/locale";
import { BOOKING_COPY, bookingParameters, type BookingSearchParams } from "@/system/booking";
import { ParritCalInline } from "@/system/components/CalInline";
import { localizedAlternates, localizedOpenGraph } from "@/system/locale";
import "@/system/booking.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const copy = BOOKING_COPY[locale];
  return {
    title: copy.title,
    description: copy.description,
    robots: { index: false, follow: true },
    alternates: localizedAlternates("/rendez-vous", locale),
    openGraph: localizedOpenGraph("/rendez-vous", locale, copy.title, copy.description),
  };
}

export default async function BookingPage({ searchParams }: { searchParams: Promise<BookingSearchParams> }) {
  const locale = await getLocale();
  const copy = BOOKING_COPY[locale];
  const parameters = bookingParameters(await searchParams);
  return <main className="rev-page" lang={locale} data-brand-mode="accessible">
    <div className="rev-wrap booking-page">
      <h1>{copy.title}</h1>
      <p>{copy.description}</p>
      <ParritCalInline key={JSON.stringify(parameters)} locale={locale} bookingParams={parameters} />
      <a className="booking-email" href="mailto:paul.larmaraud@parrit.ai">{copy.email}</a>
    </div>
  </main>;
}
