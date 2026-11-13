import Page, { generateMetadata as metadata } from "@/system/pages/article";
type Props = { params: Promise<{ slug: string }> };
export function generateMetadata(props: Props) { return metadata(props, "fr"); }
export default function JournalArticlePage(props: Props) { return Page(props, "fr"); }
import { getAllJournalEntrySummaries } from "@/system/journal";
import { hasFrenchJournalTranslation } from "@/system/journal-translations";
export function generateStaticParams() { return getAllJournalEntrySummaries().filter(entry => hasFrenchJournalTranslation(entry.slug)).map(({ slug }) => ({ slug })); }
