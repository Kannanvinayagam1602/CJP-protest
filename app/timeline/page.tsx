import type { Metadata } from "next";
import { getDataset } from "@/lib/data";
import { TimelineClient } from "@/components/pages/timeline-client";

export const metadata: Metadata = {
  title: "Timeline",
  description: "Day-by-day protest activity and key milestones for the CJP protest movement.",
};

export default async function TimelinePage() {
  const dataset = await getDataset();
  return <TimelineClient dataset={dataset} />;
}
