import type { Metadata } from "next";
import { getLocale } from "@/lib/server/locale";
import { PartnerPage } from "@/system/components/PartnerPage";
import { PARTNER_DICT } from "@/system/partner-copy";
import { localizedAlternates, localizedOpenGraph } from "@/system/locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { title, introduction: description } = PARTNER_DICT[locale];
  return {
    title: { absolute: title },
    description,
    alternates: localizedAlternates("/become-a-partner", locale),
    openGraph: localizedOpenGraph("/become-a-partner", locale, title, description),
  };
}

export default async function BecomePartnerPage() {
  return <PartnerPage locale={await getLocale()} />;
}
