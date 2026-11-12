import Page, { generateMetadata as metadata } from "@/system/pages/home";
type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export function generateMetadata() { return metadata("fr"); }
export default function HomePage(props: Props) { return Page(props, "fr"); }
