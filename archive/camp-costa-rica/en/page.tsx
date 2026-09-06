import Landing from "../Landing";
import { CampJsonLd, campMetadata } from "../shared";

export const metadata = campMetadata("en");

export default function CampPage() {
  return (
    <>
      <CampJsonLd lang="en" />
      <Landing lang="en" />
    </>
  );
}
