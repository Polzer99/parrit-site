import Layout, { generateMetadata as metadata } from "@/system/pages/layout";
export function generateMetadata() { return metadata("en"); }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Layout locale="en">{children}</Layout>;
}
