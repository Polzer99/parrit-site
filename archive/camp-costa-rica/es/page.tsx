import Landing from "../Landing";
import { CampJsonLd, campMetadata } from "../shared";

export const metadata = campMetadata("es");

export default function CampPage() {
  return (
    <>
      <CampJsonLd lang="es" />
      <Landing lang="es" />
    </>
  );
}
