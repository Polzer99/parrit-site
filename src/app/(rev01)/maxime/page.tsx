import type { Metadata } from "next";

import { PersonalPage } from "@/system/components/PersonalPage";

export const metadata: Metadata = {
  title: "Maxime",
  description:
    "Maxime works on the architecture, infrastructure and reliability of operating systems and offers focused one-to-one coaching.",
};

export default function MaximePage() {
  return (
    <PersonalPage
      person="Maxime"
      role="Partner · Operating systems"
      statement="I make operating systems reliable enough for the real world."
      introduction="I work on the architecture and infrastructure that let an operating system remain understandable, controlled and dependable in production."
      practiceTitle="Reliability is part of the architecture."
      practiceBody="The work is to make the system observable, traceable and reversible, so its operators can understand its state and act without depending on a black box."
    />
  );
}
