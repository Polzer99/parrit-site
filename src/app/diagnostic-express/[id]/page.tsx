import DiagnosticExpressRevealClient from "./DiagnosticExpressRevealClient";

export default async function DiagnosticExpressRevealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <DiagnosticExpressRevealClient id={id} />;
}
