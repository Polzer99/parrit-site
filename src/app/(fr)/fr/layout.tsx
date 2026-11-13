import Layout, { generateMetadata as metadata } from "@/system/pages/layout";
export function generateMetadata() { return metadata("fr"); }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Layout locale="fr">{children}</Layout>;
}
