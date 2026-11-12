import Page, { generateMetadata as metadata } from "@/system/pages/theme";
type Props = { params: Promise<{ theme: string }> };
export function generateMetadata(props: Props) { return metadata(props, "fr"); }
export default function JournalThemePage(props: Props) { return Page(props, "fr"); }
export { generateStaticParams } from "@/system/pages/theme";
