"use client";

import * as React from "react";
import { CheckCircle2, XCircle, Clock, Landmark } from "lucide-react";
import type { Dataset, Filters as FilterState } from "@/lib/types";
import { outcomeByDemand, governmentResponseTimeline, applyFilters } from "@/lib/analytics";
import { FiltersBar } from "@/components/filters";
import { OutcomeStackedChart } from "@/components/charts/outcome-stacked-chart";
import { GovResponseAreaChart } from "@/components/charts/gov-response-area-chart";
import { KPICard } from "@/components/kpi-card";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function OutcomesClient({ dataset }: { dataset: Dataset }) {
  const { meta, events: allEvents } = dataset;
  const [filters, setFilters] = React.useState<FilterState>({
    dateFrom: meta.start_date,
    dateTo: meta.end_date,
    city: "All",
    demand: "All",
    outcome: "All",
    eventType: "All",
    query: "",
  });

  const filtered = React.useMemo(() => applyFilters(allEvents, filters), [allEvents, filters]);
  const outcomeRows = React.useMemo(() => outcomeByDemand(filtered), [filtered]);
  const govTimeline = React.useMemo(() => governmentResponseTimeline(filtered), [filtered]);

  const counts = React.useMemo(() => {
    const accepted = filtered.filter((e) => e.outcome === "Accepted").length;
    const partial = filtered.filter((e) => e.outcome === "Partially Accepted").length;
    const rejected = filtered.filter((e) => e.outcome === "Rejected").length;
    const pending = filtered.filter((e) => e.outcome === "Pending").length;
    return { accepted, partial, rejected, pending };
  }, [filtered]);

  const eventTypes = React.useMemo(() => Array.from(new Set(allEvents.map((e) => e.event))), [allEvents]);
  const outcomes = React.useMemo(() => Array.from(new Set(allEvents.map((e) => e.outcome))), [allEvents]);

  return (
    <div className="container flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-2">
        <span className="section-label">Outcomes</span>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Outcome Analysis</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          How each demand was ultimately resolved, and the pattern of government responses over time.
        </p>
      </div>

      <FiltersBar
        filters={filters}
        onChange={setFilters}
        cities={meta.cities}
        demands={meta.main_demands}
        outcomes={outcomes}
        eventTypes={eventTypes}
        minDate={meta.start_date}
        maxDate={meta.end_date}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard index={0} label="Accepted" value={String(counts.accepted)} icon={CheckCircle2} deltaTone="up" />
        <KPICard index={1} label="Partially Accepted" value={String(counts.partial)} icon={Landmark} />
        <KPICard index={2} label="Rejected" value={String(counts.rejected)} icon={XCircle} deltaTone="down" />
        <KPICard index={3} label="Pending" value={String(counts.pending)} icon={Clock} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Outcome by Demand</CardTitle>
            <CardDescription>Accepted, rejected, and pending status per demand</CardDescription>
          </CardHeader>
          <CardContent>
            <OutcomeStackedChart data={outcomeRows} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Government Response Timeline</CardTitle>
            <CardDescription>Meetings, negotiations, police action, and public statements over time</CardDescription>
          </CardHeader>
          <CardContent>
            <GovResponseAreaChart data={govTimeline} />
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Matching Events</h2>
        <DataTable events={filtered} />
      </section>
    </div>
  );
}
