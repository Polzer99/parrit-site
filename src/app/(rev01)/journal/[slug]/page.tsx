import Page, { generateMetadata as metadata } from "@/system/pages/article";
type Props = { params: Promise<{ slug: string }> };
export function generateMetadata(props: Props) { return metadata(props); }
export default function JournalArticlePage(props: Props) { return Page(props); }
export { generateStaticParams } from "@/system/pages/article";
