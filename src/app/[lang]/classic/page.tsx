import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "../dictionaries";
import HomeClassic from "../HomeClassic";

export const metadata = {
  title: "Parrit · Classic V3",
  robots: { index: false, follow: false },
};

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  return <HomeClassic dict={dict} lang={lang as Locale} />;
}
