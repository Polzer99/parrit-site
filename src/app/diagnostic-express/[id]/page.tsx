import Link from "next/link";
import DiagnosticExpressRevealClient from "./DiagnosticExpressRevealClient";

export default async function DiagnosticExpressRevealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <nav className="blog-nav">
        <Link href="/fr" className="nav-logo">Parrit.ai</Link>
        <Link href="/diagnostic-express" className="blog-nav-link">Nouveau diagnostic →</Link>
      </nav>
      <h1 className="sr-only">Votre diagnostic Parrit</h1>
      <DiagnosticExpressRevealClient id={id} />
    </>
  );
}
