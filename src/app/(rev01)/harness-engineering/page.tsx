import { SiteV1Page, siteV1Metadata } from "@/system/components/SiteV1Page";

export const generateMetadata = () => siteV1Metadata("harness-engineering");
export default function Page() { return <SiteV1Page id="harness-engineering"/>; }
