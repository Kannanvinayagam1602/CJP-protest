"use client";

import * as React from "react";
import type { Dataset, Filters as FilterState } from "@/lib/types";
import { demandDistribution, outcomeByDemand, applyFilters, mode } from "@/lib/analytics";
import { FiltersBar } from "@/components/filters";
import { DemandPieChart } from "@/components/charts/demand-pie-chart";
import { OutcomeStackedChart } from "@/components/charts/outcome-stacked-chart";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DemandAnalysisClient({ dataset }: { dataset: Dataset }) {
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
  const demandDist = React.useMemo(() => demandDistribution(filtered), [filtered]);
  const outcomeRows = React.useMemo(() => outcomeByDemand(filtered), [filtered]);
  const commonDemand = React.useMemo(() => mode(filtered.map((e) => e.main_demand)), [filtered]);
  const commonSecondary = React.useMemo(
    () => mode(filtered.map((e) => e.secondary_demand ?? "None stated")),
    [filtered]
  );

  const eventTypes = React.useMemo(() => Array.from(new Set(allEvents.map((e) => e.event))), [allEvents]);
  const outcomes = React.useMemo(() => Array.from(new Set(allEvents.map((e) => e.outcome))), [allEvents]);

  return (
    <div className="container flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-2">
        <span className="section-label">Demand Analysis</span>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Demand Analysis</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Breakdown of the movement's core demands and how the government responded to each of them.
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

      <div className="flex flex-wrap gap-2">
        <Badge>Most common demand: {commonDemand}</Badge>
        <Badge variant="accent">Most common secondary demand: {commonSecondary}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Demand Distribution</CardTitle>
            <CardDescription>Share of events by primary demand</CardDescription>
          </CardHeader>
          <CardContent>
            <DemandPieChart data={demandDist} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Outcome by Demand</CardTitle>
            <CardDescription>Accepted vs. rejected vs. pending, per demand</CardDescription>
          </CardHeader>
          <CardContent>
            <OutcomeStackedChart data={outcomeRows} />
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
