import type { Metadata } from "next";
import { getDataset } from "@/lib/data";
import { DashboardClient } from "@/components/dashboard-client";

export const metadata: Metadata = {
  title: "Home Dashboard",
  description: "Key metrics, timeline, participation, and outcomes for the CJP protest movement.",
};

export default async function HomePage() {
  const dataset = await getDataset();
  return <DashboardClient dataset={dataset} />;
}
