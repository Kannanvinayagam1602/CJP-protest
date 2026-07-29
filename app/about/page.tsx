import type { Metadata } from "next";
import { Info, Database, ShieldAlert, FileJson } from "lucide-react";
import { getDataset } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Dataset",
  description: "Explanation of the sample dataset, its fields, and how it was generated.",
};

const FIELDS: { name: string; description: string }[] = [
  { name: "id", description: "Unique identifier for the event (e.g. EVT-0001)." },
  { name: "date", description: "ISO date the event took place." },
  { name: "city", description: "City where the event occurred." },
  { name: "state", description: "State associated with the city." },
  { name: "lat / lng", description: "Approximate coordinates used for the illustrative map." },
  { name: "location", description: "Descriptive location within the city." },
  { name: "event", description: "Event type — rally, sit-in, negotiation meeting, police action, etc." },
  { name: "duration_day", description: "Number of days this specific event/phase lasted." },
  { name: "estimated_participants", description: "Estimated attendee count for the event." },
  { name: "main_demand", description: "Primary demand associated with the event." },
  { name: "secondary_demand", description: "Secondary or supporting demand, if any." },
  { name: "government_response", description: "How officials responded to this event." },
  { name: "police_action", description: "Level of police activity recorded, if any." },
  { name: "media_attention", description: "Qualitative media attention level (Low–Very High)." },
  { name: "outcome", description: "Accepted, Rejected, Pending, or Partially Accepted." },
  { name: "status", description: "Ongoing or Resolved." },
  { name: "source", description: "Always 'Sample Data (Illustrative)' — see disclaimer below." },
  { name: "source_url", description: "Placeholder URL pointing to this project's sample dataset." },
];

export default async function AboutPage() {
  const { meta, events } = await getDataset();

  return (
    <div className="container flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-2">
        <span className="section-label">About Dataset</span>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">About This Dataset</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          What this dashboard analyzes, how the dataset was built, and important context on its
          fictional nature.
        </p>
      </div>

      <Card className="border-accent/40 bg-accent/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-accent" />
            <CardTitle>Important Disclaimer</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm leading-relaxed">
          <p>{meta.disclaimer}</p>
          <p>
            No claims in this dashboard should be interpreted as reporting on real news events,
            real organizations, or real government actions. Every <code>source</code> field in the
            dataset is intentionally labeled <Badge variant="outline">Sample Data (Illustrative)</Badge>{" "}
            rather than pointing to an actual news outlet, and every <code>source_url</code> points
            to this project's own repository rather than an external article.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <CardTitle>Dataset Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Total events" value={String(events.length)} />
            <Row label="Date range" value={`${formatDate(meta.start_date)} – ${formatDate(meta.end_date)}`} />
            <Row label="Duration" value={`${meta.total_duration_days} days`} />
            <Row label="Cities" value={String(meta.cities.length)} />
            <Row label="Main demand categories" value={String(meta.main_demands.length)} />
            <Row label="Generated" value={formatDate(meta.generated_at)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileJson className="h-4 w-4 text-primary" />
              <CardTitle>File Location</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              The dataset lives at <code className="text-foreground">/public/data/protests.json</code>{" "}
              and is read server-side by <code className="text-foreground">lib/data.ts</code>.
            </p>
            <p>
              It was generated by a deterministic Python script at{" "}
              <code className="text-foreground">scripts/generate_data.py</code> (seeded, so re-running
              it reproduces the same data).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <CardTitle>Cities Covered</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {meta.cities.map((c) => (
                <Badge key={c} variant="outline">{c}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Field Reference</CardTitle>
          <CardDescription>Every field present in each event record</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.name} className="flex gap-3 text-sm">
                <code className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-primary">{f.name}</code>
                <span className="text-muted-foreground">{f.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>License</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This project and its sample dataset are provided under the MIT License. See the
          project's <code>README.md</code> for full details.
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
