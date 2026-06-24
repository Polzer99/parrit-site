import MaturitePage, {
  generateMaturiteMetadata,
  generateMaturiteStaticParams,
} from "@/components/MaturitePage";

const slug = "masterclass-metier";

export const generateStaticParams = generateMaturiteStaticParams;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return generateMaturiteMetadata({ params, slug });
}

export default function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return <MaturitePage params={params} slug={slug} />;
}
