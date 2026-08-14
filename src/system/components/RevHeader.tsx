import Link from "next/link";

export function RevHeader() {
  return (
    <header className="rev-header">
      <Link className="rev-mark" href="/" aria-label="Parrit home">
        [P<i aria-hidden="true">.</i>]
      </Link>
    </header>
  );
}
