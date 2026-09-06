import Landing from "./Landing";
import { CampJsonLd, campMetadata } from "./shared";

export const metadata = campMetadata("fr");

export default function CampPage() {
  return (
    <>
      <CampJsonLd lang="fr" />
      <Landing lang="fr" />
    </>
  );
}
