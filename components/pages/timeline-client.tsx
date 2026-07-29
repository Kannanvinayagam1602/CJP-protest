"use client";

import * as React from "react";
import type { Dataset, Filters as FilterState } from "@/lib/types";
import { dailyIntensity, majorEventDurations, applyFilters, growthTrend } from "@/lib/analytics";
import { FiltersBar } from "@/components/filters";
import { TimelineChart } from "@/components/charts/timeline-chart";
import { HeatmapCalendar } from "@/components/charts/heatmap-calendar";
import { DurationBarChart } from "@/components/charts/duration-bar-chart";
import { InteractiveTimeline } from "@/components/charts/interactive-timeline";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function TimelineClient({ dataset }: { dataset: Dataset }) {
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
  const intensity = React.useMemo(() => dailyIntensity(filtered), [filtered]);
  const durations = React.useMemo(() => majorEventDurations(filtered), [filtered]);
  const growth = React.useMemo(() => growthTrend(filtered), [filtered]);
  const peakGrowthDay = growth.reduce((max, d) => (d.growthPct > max.growthPct ? d : max), growth[0]);

  const eventTypes = React.useMemo(() => Array.from(new Set(allEvents.map((e) => e.event))), [allEvents]);
  const outcomes = React.useMemo(() => Array.from(new Set(allEvents.map((e) => e.outcome))), [allEvents]);

  return (
    <div className="container flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-2">
        <span className="section-label">Timeline</span>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Movement Timeline</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Day-by-day protest activity, key milestones, and how event types accumulated duration
          over the course of the movement.
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

      <Card>
        <CardHeader>
          <CardTitle>Daily Protest Activity</CardTitle>
          <CardDescription>
            Date vs. estimated participants
            {peakGrowthDay ? ` — sharpest single-day rise was ${peakGrowthDay.growthPct}%` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimelineChart data={intensity} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Intensity Calendar</CardTitle>
            <CardDescription>Heatmap of protest intensity by day</CardDescription>
          </CardHeader>
          <CardContent>
            <HeatmapCalendar data={intensity} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Protest Duration by Event Type</CardTitle>
            <CardDescription>Major events vs. total number of days</CardDescription>
          </CardHeader>
          <CardContent>
            <DurationBarChart data={durations} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Milestones</CardTitle>
          <CardDescription>
            Major speeches, police incidents, government meetings, negotiations, and withdrawal points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InteractiveTimeline events={filtered} />
        </CardContent>
      </Card>
    </div>
  );
}
