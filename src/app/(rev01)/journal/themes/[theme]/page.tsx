import Page, { generateMetadata as metadata } from "@/system/pages/theme";
type Props = { params: Promise<{ theme: string }> };
export function generateMetadata(props: Props) { return metadata(props); }
export default function JournalThemePage(props: Props) { return Page(props); }
export { generateStaticParams } from "@/system/pages/theme";
