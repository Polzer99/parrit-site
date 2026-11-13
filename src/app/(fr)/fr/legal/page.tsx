import Page, { generateMetadata as metadata } from "@/system/pages/legal";
export function generateMetadata() { return metadata("fr"); }
export default function LegalPage() { return Page("fr"); }
