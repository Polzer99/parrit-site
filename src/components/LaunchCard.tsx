import Link from "next/link";
import type { Launch } from "@/lib/launches";

type LaunchCardLaunch = Pick<
  Launch,
  | "num"
  | "slug"
  | "title"
  | "category"
  | "sector"
  | "stack"
  | "devDuration"
  | "summary"
  | "difficulty"
>;

type LaunchCardProps = {
  launch: LaunchCardLaunch;
  href: string;
};

export default function LaunchCard({ launch, href }: LaunchCardProps) {
  return (
    <Link className="launch-card" href={href}>
      <div className="launch-card-top">
        <span className="launch-card-num">
          #{String(launch.num).padStart(3, "0")}
        </span>
        <span className="launch-badge">{launch.category}</span>
      </div>
      <h3 className="launch-card-title">{launch.title}</h3>
      <p className="launch-card-summary">{launch.summary}</p>
      <div className="launch-card-meta">
        <span>{launch.sector}</span>
        <span>{launch.devDuration}</span>
        <span>Difficulte {launch.difficulty}/5</span>
      </div>
      <div className="launch-stack" aria-label="Stack">
        {launch.stack.slice(0, 4).map((tool) => (
          <span className="launch-chip" key={tool}>
            {tool}
          </span>
        ))}
      </div>
    </Link>
  );
}
