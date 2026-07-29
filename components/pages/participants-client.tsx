"use client";

import * as React from "react";
import { Users, TrendingUp, MapPin } from "lucide-react";
import type { Dataset, Filters as FilterState } from "@/lib/types";
import { participantsByCity, applyFilters, mean, median, stdDev } from "@/lib/analytics";
import { FiltersBar } from "@/components/filters";
import { ParticipantsChart } from "@/components/charts/participants-chart";
import { CityBubbleMap } from "@/components/charts/city-bubble-map";
import { KPICard } from "@/components/kpi-card";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

export function ParticipantsClient({ dataset }: { dataset: Dataset }) {
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
  const byCity = React.useMemo(() => participantsByCity(filtered), [filtered]);
  const participants = React.useMemo(() => filtered.map((e) => e.estimated_participants), [filtered]);

  const cityPoints = React.useMemo(() => {
    const seen = new Map<string, { city: string; lat: number; lng: number; participants: number }>();
    for (const e of filtered) {
      const existing = seen.get(e.city);
      if (existing) existing.participants += e.estimated_participants;
      else seen.set(e.city, { city: e.city, lat: e.lat, lng: e.lng, participants: e.estimated_participants });
    }
    return Array.from(seen.values());
  }, [filtered]);

  const eventTypes = React.useMemo(() => Array.from(new Set(allEvents.map((e) => e.event))), [allEvents]);
  const outcomes = React.useMemo(() => Array.from(new Set(allEvents.map((e) => e.outcome))), [allEvents]);

  return (
    <div className="container flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-2">
        <span className="section-label">Participants</span>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Participation Analysis</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Estimated participation by city, with descriptive statistics for the current filter selection.
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
        <KPICard index={0} label="Average / Event" value={formatNumber(Math.round(mean(participants)))} icon={Users} />
        <KPICard index={1} label="Median / Event" value={formatNumber(Math.round(median(participants)))} icon={TrendingUp} />
        <KPICard index={2} label="Std. Deviation" value={formatNumber(Math.round(stdDev(participants)))} icon={TrendingUp} />
        <KPICard index={3} label="Most Affected City" value={byCity[0]?.city ?? "N/A"} icon={MapPin} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estimated Participants by City</CardTitle>
            <CardDescription>Cumulative participation, current filter selection</CardDescription>
          </CardHeader>
          <CardContent>
            <ParticipantsChart data={byCity} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Participation Map</CardTitle>
            <CardDescription>Illustrative bubble sizes by participation</CardDescription>
          </CardHeader>
          <CardContent>
            <CityBubbleMap data={cityPoints} />
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
