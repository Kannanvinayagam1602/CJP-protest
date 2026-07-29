"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Users,
  ListChecks,
  MapPin,
  Landmark,
  Flag,
} from "lucide-react";
import type { Dataset, Filters as FilterState } from "@/lib/types";
import {
  computeKPIs,
  dailyIntensity,
  participantsByCity,
  demandDistribution,
  applyFilters,
} from "@/lib/analytics";
import { KPICard } from "@/components/kpi-card";
import { FiltersBar } from "@/components/filters";
import { TimelineChart } from "@/components/charts/timeline-chart";
import { ParticipantsChart } from "@/components/charts/participants-chart";
import { DemandPieChart } from "@/components/charts/demand-pie-chart";
import { HeatmapCalendar } from "@/components/charts/heatmap-calendar";
import { CityBubbleMap } from "@/components/charts/city-bubble-map";
import { SummaryCards } from "@/components/summary-cards";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

export function DashboardClient({ dataset }: { dataset: Dataset }) {
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
  const kpis = React.useMemo(() => computeKPIs({ meta, events: filtered }), [meta, filtered]);
  const intensity = React.useMemo(() => dailyIntensity(filtered), [filtered]);
  const byCity = React.useMemo(() => participantsByCity(filtered), [filtered]);
  const demandDist = React.useMemo(() => demandDistribution(filtered), [filtered]);

  const cityPoints = React.useMemo(() => {
    const seen = new Map<string, { city: string; lat: number; lng: number; participants: number }>();
    for (const e of filtered) {
      const existing = seen.get(e.city);
      if (existing) existing.participants += e.estimated_participants;
      else seen.set(e.city, { city: e.city, lat: e.lat, lng: e.lng, participants: e.estimated_participants });
    }
    return Array.from(seen.values());
  }, [filtered]);

  const summaries = React.useMemo(() => {
    const topCity = byCity[0];
    const topDemand = demandDist[0];
    const topTwoShare = demandDist.slice(0, 2).reduce((s, d) => s + d.pct, 0);
    const accepted = filtered.filter((e) => e.outcome === "Accepted").length;
    return [
      `The movement spans approximately ${meta.total_duration_days} days, making it a sustained, multi-city demonstration rather than a single flashpoint event.`,
      topCity
        ? `Participation was heaviest in ${topCity.city}, accounting for ${formatNumber(topCity.participants)} of the estimated attendees in the current view.`
        : "No participation data matches the current filters.",
      topDemand
        ? `${topDemand.name} was the most frequently raised demand, and the top two demands together account for roughly ${Math.round(topTwoShare)}% of all recorded events.`
        : "No demand data matches the current filters.",
      `${accepted} events in the current view are tagged with a fully "Accepted" government outcome, reflecting partial responsiveness to protester demands.`,
    ];
  }, [byCity, demandDist, filtered, meta.total_duration_days]);

  const eventTypes = React.useMemo(() => Array.from(new Set(allEvents.map((e) => e.event))), [allEvents]);
  const outcomes = React.useMemo(() => Array.from(new Set(allEvents.map((e) => e.outcome))), [allEvents]);

  return (
    <div className="container flex flex-col gap-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-2"
      >
        <span className="section-label">Home Dashboard</span>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">CJP Protest Analytics Dashboard</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Analytics for the Citizens for Justice Platform (CJP) protest movement, built on an
          illustrative sample dataset. Use the filters below to explore by date, city, demand,
          outcome, or event type.
        </p>
      </motion.div>

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

      <section aria-label="Key performance indicators" className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard index={0} label="Total Duration" value={`${kpis.totalDurationDays} days`} icon={CalendarDays} delta="Feb 3 – Mar 10, 2026" />
        <KPICard index={1} label="Est. Participants" value={formatNumber(kpis.estimatedParticipants)} icon={Users} delta="Across all events in view" />
        <KPICard index={2} label="Major Demands" value={String(kpis.numberOfDemands)} icon={ListChecks} delta="Tracked demand categories" />
        <KPICard index={3} label="Cities Participated" value={String(kpis.citiesParticipated)} icon={MapPin} delta="Metro areas involved" />
        <KPICard index={4} label="Gov. Responses" value={String(kpis.governmentResponses)} icon={Landmark} delta="Recorded official responses" />
        <KPICard
          index={5}
          label="Acceptance Rate"
          value={`${kpis.acceptanceRatePct}%`}
          icon={Flag}
          delta={kpis.finalOutcomeStatus}
          deltaTone={kpis.acceptanceRatePct > 50 ? "up" : "neutral"}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Protest Timeline</CardTitle>
            <CardDescription>Daily estimated participation across the movement</CardDescription>
          </CardHeader>
          <CardContent>
            <TimelineChart data={intensity} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Demand Distribution</CardTitle>
            <CardDescription>Share of events by primary demand</CardDescription>
          </CardHeader>
          <CardContent>
            <DemandPieChart data={demandDist} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Participants by City</CardTitle>
            <CardDescription>Cumulative estimated participants per city</CardDescription>
          </CardHeader>
          <CardContent>
            <ParticipantsChart data={byCity} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Participating Cities</CardTitle>
            <CardDescription>Relative participation, illustrative map</CardDescription>
          </CardHeader>
          <CardContent>
            <CityBubbleMap data={cityPoints} />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Daily Protest Intensity</CardTitle>
          <CardDescription>Calendar heatmap of daily participation volume</CardDescription>
        </CardHeader>
        <CardContent>
          <HeatmapCalendar data={intensity} />
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Summary</h2>
        <SummaryCards summaries={summaries} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Event Log</h2>
        <DataTable events={filtered} />
      </section>
    </div>
  );
}
