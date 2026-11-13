import Page, { generateMetadata as metadata } from "@/system/pages/booking";
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export function generateMetadata() { return metadata(); }
export default function BookingPage(props: Props) { return Page(props); }
