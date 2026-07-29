import type { Metadata } from "next";
import { getDataset } from "@/lib/data";
import { DemandAnalysisClient } from "@/components/pages/demand-analysis-client";

export const metadata: Metadata = {
  title: "Demand Analysis",
  description: "Breakdown of demands and government responses for the CJP protest movement.",
};

export default async function DemandAnalysisPage() {
  const dataset = await getDataset();
  return <DemandAnalysisClient dataset={dataset} />;
}
