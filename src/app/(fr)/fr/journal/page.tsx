import Page, { generateMetadata as metadata } from "@/system/pages/journal";
export function generateMetadata() { return metadata("fr"); }
export default function JournalPage() { return Page("fr"); }
