import type { Metadata } from "next";
import { getDataset } from "@/lib/data";
import { OutcomesClient } from "@/components/pages/outcomes-client";

export const metadata: Metadata = {
  title: "Outcomes",
  description: "Outcome and government response analysis for the CJP protest movement.",
};

export default async function OutcomesPage() {
  const dataset = await getDataset();
  return <OutcomesClient dataset={dataset} />;
}
