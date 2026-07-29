import type { Metadata } from "next";
import { getDataset } from "@/lib/data";
import { ParticipantsClient } from "@/components/pages/participants-client";

export const metadata: Metadata = {
  title: "Participants",
  description: "Participation statistics by city for the CJP protest movement.",
};

export default async function ParticipantsPage() {
  const dataset = await getDataset();
  return <ParticipantsClient dataset={dataset} />;
}
