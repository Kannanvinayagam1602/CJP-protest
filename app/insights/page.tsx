import type { Metadata } from "next";
import {
  Activity,
  Users,
  MapPin,
  ListChecks,
  Landmark,
  TrendingUp,
  Percent,
  Timer,
} from "lucide-react";
import { getDataset } from "@/lib/data";
import { computeInsights, mean, median, mode, stdDev, percentageDistribution } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatNumber, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Insights",
  description: "Automatically calculated statistics and executive summary for the CJP protest movement.",
};

export default async function InsightsPage() {
  const { meta, events } = await getDataset();
  const insights = computeInsights(events);
  const demandDist = percentageDistribution(events.map((e) => e.main_demand));
  const outcomeDist = percentageDistribution(events.map((e) => e.outcome));
  const participants = events.map((e) => e.estimated_participants);

  const stats = [
    { label: "Average Participants / Event", value: formatNumber(insights.averageParticipants), icon: Users },
    { label: "Median Participants / Event", value: formatNumber(insights.medianParticipants), icon: Activity },
    { label: "Std. Deviation", value: formatNumber(insights.stdDevParticipants), icon: TrendingUp },
    { label: "Longest Protest Phase", value: insights.longestProtestPhase, icon: Timer },
    { label: "Most Common Demand", value: insights.mostCommonDemand, icon: ListChecks },
    { label: "Most Affected City", value: insights.mostAffectedCity, icon: MapPin },
    { label: "Acceptance Rate", value: `${insights.acceptanceRatePct}%`, icon: Percent },
    { label: "Gov. Response Frequency", value: String(insights.governmentResponseFrequency), icon: Landmark },
    {
      label: "Avg. Days Between Negotiations",
      value: insights.avgDaysBetweenNegotiations ? `${insights.avgDaysBetweenNegotiations} days` : "N/A",
      icon: Timer,
    },
    {
      label: "Peak Daily Intensity",
      value: insights.peakDailyIntensity.date ? formatDate(insights.peakDailyIntensity.date) : "N/A",
      icon: Activity,
    },
  ];

  return (
    <div className="container flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-2">
        <span className="section-label">Insights</span>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Automated Insights</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Descriptive statistics and an executive summary generated directly from the sample
          dataset — mean, median, mode, standard deviation, and distribution analysis.
        </p>
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s, i) => (
          <Card key={i} className="animate-fade-up glass-panel-hover" style={{ animationDelay: `${i * 40}ms` }}>
            <CardContent className="flex flex-col gap-2 p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-4 w-4" />
              </span>
              <span className="section-label">{s.label}</span>
              <span className="text-lg font-bold">{s.value}</span>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Demand Distribution</CardTitle>
            <CardDescription>Percentage share of events by main demand</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demandDist.map((d) => (
              <div key={d.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{d.label}</span>
                  <span className="text-muted-foreground">{d.pct.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outcome Distribution</CardTitle>
            <CardDescription>Percentage share of events by outcome status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {outcomeDist.map((d) => (
              <div key={d.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{d.label}</span>
                  <span className="text-muted-foreground">{d.pct.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
          <CardDescription>
            Generated from the sample dataset for the fictional CJP protest scenario
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none space-y-4 text-sm leading-relaxed text-foreground/90 dark:prose-invert">
          <p>
            <strong>Background.</strong> The Citizens for Justice Platform (CJP) movement, as
            represented in this sample dataset, began on {formatDate(meta.start_date)} and ran for{" "}
            {meta.total_duration_days} days across {meta.cities.length} major Indian cities,
            organizing around a defined set of grievances.
          </p>
          <p>
            <strong>Objectives.</strong> Organizers focused on {meta.main_demands.length} core
            demand categories, with participants seeking policy change alongside accountability
            from public officials.
          </p>
          <p>
            <strong>Major demands.</strong> {insights.mostCommonDemand} was the most frequently
            recorded demand, appearing in {demandDist[0]?.pct.toFixed(1)}% of logged events,
            followed by other demands relating to compensation, police accountability, and
            protections for protestors.
          </p>
          <p>
            <strong>Timeline.</strong> Activity ramped up over the first ten days, sustained a peak
            through the middle third of the movement, and tapered as negotiations progressed,
            concluding around {formatDate(meta.end_date)}.
          </p>
          <p>
            <strong>Participation.</strong> An estimated {formatNumber(participants.reduce((a, b) => a + b, 0))}{" "}
            cumulative participants were logged across all events, with {insights.mostAffectedCity}{" "}
            recording the highest turnout of any single city.
          </p>
          <p>
            <strong>Government response.</strong> Officials responded through a mix of public
            statements, scheduled meetings, and negotiation sessions, with {insights.governmentResponseFrequency}{" "}
            distinct responses recorded, alongside periods of police deployment during
            higher-intensity phases.
          </p>
          <p>
            <strong>Negotiation process.</strong> Formal negotiation sessions occurred at an
            average interval of {insights.avgDaysBetweenNegotiations || "N/A"} days, with the pace
            of talks increasing markedly in the final third of the movement.
          </p>
          <p>
            <strong>Final outcome.</strong> Of demands reaching a resolved status, roughly{" "}
            {insights.acceptanceRatePct}% were accepted or partially accepted, while the remainder
            were rejected or left pending at the close of the observed period.
          </p>
          <p>
            <strong>Lessons learned.</strong> Sustained, multi-city coordination and consistent
            media attention appear closely linked to the pace of government engagement in this
            scenario, with earlier negotiation sessions correlating with faster partial
            concessions.
          </p>
          <p>
            <strong>Future implications.</strong> The pattern illustrated by this sample dataset
            suggests that demand specificity and cross-city coordination are useful factors to
            track in analyzing the trajectory of large-scale civic movements.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
