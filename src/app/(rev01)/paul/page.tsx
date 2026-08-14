import type { Metadata } from "next";

import { PersonalPage } from "@/system/components/PersonalPage";
import { CAL_LINK_COACHING_PAUL } from "../../../../site.config";

export const metadata: Metadata = {
  title: "Paul Larmaraud",
  description:
    "Paul Larmaraud turns operational problems into working systems and offers focused one-to-one coaching.",
};

export default function PaulPage() {
  return (
    <PersonalPage
      calLink={CAL_LINK_COACHING_PAUL}
      person="Paul Larmaraud"
      role="Founder · Operating partner"
      statement="I turn operational problems into systems that work."
      introduction="I build the first working version myself, configure the agents around it and make the operation concrete enough to test in the real world."
      practiceTitle="The work starts with a working version."
      practiceBody="I work from the operation itself: the decisions, tools, handoffs and exceptions that determine whether a system holds. What runs for a client runs with me first."
    />
  );
}
