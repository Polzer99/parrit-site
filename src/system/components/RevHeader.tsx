import Link from "next/link";

export function RevHeader() {
  return (
    <header className="rev-header">
      <Link className="rev-mark" href="/" aria-label="Parrit.ai home">
        PARRIT<i aria-hidden="true">.</i>AI
      </Link>
    </header>
  );
}
